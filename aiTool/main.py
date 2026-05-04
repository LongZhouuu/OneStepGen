"""
main.py — FastAPI application for the ADHD Productivity Tool.

╔══════════════════════════════════════════════════════════════╗
║  AI PIPELINE OVERVIEW  (Semantic Scoring)                    ║
║                                                              ║
║  User Input (text or PDF)                                    ║
║       │                                                      ║
║       ▼                                                      ║
║  [1] Text Extraction  (pdf_parser.py — if PDF)               ║
║       │                                                      ║
║       ▼                                                      ║
║  [2] LLM Processing   (ai_processor.py — Groq / Llama 3)     ║
║       │   • Extracts tasks from raw text                     ║
║       │   • Breaks them into 2–5 min actionable steps        ║
║       │   • Each step starts with a verb                     ║
║       │   • Rates urgency (1–5) and importance (1–5)         ║
║       ▼                                                      ║
║  [3] Priority Scoring  (scoring.py — semantic model)         ║
║       │   Uses LLM urgency + importance ratings              ║
║       │   Maps scores into 0–6 range → priority label        ║
║       ▼                                                      ║
║  Structured JSON Response                                    ║
╚══════════════════════════════════════════════════════════════╝

Run with:
    uvicorn main:app --reload
"""

import base64
import hashlib
import hmac
import os
import secrets
import time

from fastapi import FastAPI, File, HTTPException, Request, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from starlette.middleware.base import BaseHTTPMiddleware

# Our utility modules (the AI pipeline)
from utils.pdf_parser import extract_text_from_pdf
from utils.ai_processor import extract_tasks_from_text
from utils.scoring import assign_priorities


# ── FastAPI app instance ────────────────────────────────────

app = FastAPI(
    title="ADHD Productivity Tool — AI Backend",
    description=(
        "A semantic AI system that uses an LLM (Groq / Llama 3) to extract "
        "tasks from text or PDFs, then applies a semantic scoring model "
        "(LLM urgency + importance ratings) to assign ADHD-friendly priorities."
    ),
    version="3.0.0",
)


class OriginVerifyMiddleware(BaseHTTPMiddleware):
    """
    When ORIGIN_VERIFY_SECRET is set, require header X-Origin-Verify to match.
    CloudFront should send this on the origin request only (not exposed in the Vue bundle).
    Skips check for OPTIONS so CORS preflight still works.
    Unset ORIGIN_VERIFY_SECRET for local dev against API directly.
    """

    async def dispatch(self, request: Request, call_next):
        expected = os.getenv("ORIGIN_VERIFY_SECRET", "").strip()
        if not expected:
            return await call_next(request)
        if request.method == "OPTIONS":
            return await call_next(request)

        got = request.headers.get("x-origin-verify") or request.headers.get(
            "X-Origin-Verify",
            "",
        )
        if not secrets.compare_digest(got.strip().encode("utf-8"), expected.encode("utf-8")):
            return JSONResponse(
                status_code=403,
                content={"detail": "Forbidden"},
            )
        return await call_next(request)


# Allow cross-origin requests from any frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
# Outermost: verify CloudFront origin secret before other layers
app.add_middleware(OriginVerifyMiddleware)


# ── Request / Response models ──────────────────────────────

# ── Site gate (server-side; password never in SPA bundle) ────────────────

SITE_GATE_COOKIE = "onestepgen_site_gate"
SITE_GATE_MAX_AGE = 7 * 24 * 3600


def _site_access_password_configured() -> bool:
    return bool(os.getenv("SITE_ACCESS_PASSWORD", "").strip())


def _site_gate_signing_key() -> bytes:
    key = os.getenv("SITE_GATE_SESSION_SECRET", "").strip()
    if not key:
        raise RuntimeError("SITE_GATE_SESSION_SECRET is not set")
    return key.encode("utf-8")


def _request_is_https(request: Request) -> bool:
    if request.url.scheme == "https":
        return True
    xf = (request.headers.get("x-forwarded-proto") or "").lower().split(",")[0].strip()
    return xf == "https"


def mint_site_gate_cookie_value() -> str:
    exp = int(time.time()) + SITE_GATE_MAX_AGE
    rnd = secrets.token_hex(16)
    payload = f"v1|{exp}|{rnd}"
    sig = hmac.new(_site_gate_signing_key(), payload.encode("utf-8"), hashlib.sha256).hexdigest()
    raw = f"{payload}|{sig}"
    return base64.urlsafe_b64encode(raw.encode("utf-8")).decode("ascii").rstrip("=")


def site_gate_cookie_valid(raw: str | None) -> bool:
    if not raw or not _site_access_password_configured():
        return False
    try:
        pad = "=" * (-len(raw) % 4)
        decoded = base64.urlsafe_b64decode((raw + pad).encode("ascii")).decode("utf-8")
        parts = decoded.split("|", 3)
        if len(parts) != 4:
            return False
        ver, exp_s, rnd, sig = parts
        if ver != "v1":
            return False
        exp = int(exp_s)
        if exp < int(time.time()):
            return False
        payload = f"{ver}|{exp_s}|{rnd}"
        expected = hmac.new(
            _site_gate_signing_key(),
            payload.encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(expected.encode("ascii"), sig.encode("ascii"))
    except (ValueError, OSError, UnicodeDecodeError):
        return False


class SiteAccessVerifyBody(BaseModel):
    password: str = Field(..., min_length=1, max_length=512)


class TextInput(BaseModel):
    """The JSON body for the /process-text endpoint."""
    text: str


class TaskOutput(BaseModel):
    """A single task with its assigned priority, rank, and category rank."""
    task: str
    priority: str
    priorityGroup: str
    score: int = 0
    rank: int = 0
    category_rank: int = 0


# ── Helper: run the full pipeline ───────────────────────────

async def run_pipeline(raw_text: str) -> list[dict]:
    """
    Execute the complete AI pipeline on *raw_text*:
        1. Send text to the LLM → get structured task dicts
           (each with task text + urgency/importance scores)
        2. Semantic scoring model uses LLM ratings to assign
           priority labels

    Returns a list of dicts: [{"task": "...", "priority": "...", "score": N}, ...]
    """

    # Step 1 — LLM extracts tasks WITH urgency/importance metadata
    structured_tasks: list[dict] = await extract_tasks_from_text(raw_text)

    # Step 2 — Semantic model assigns priorities from LLM ratings
    prioritised_tasks: list[dict] = assign_priorities(structured_tasks)

    return prioritised_tasks


# ── Endpoints ───────────────────────────────────────────────

@app.get("/")
def root():
    """Health-check / welcome endpoint."""
    return {
        "message": "ADHD Productivity Tool API is running!",
        "docs": "Visit /docs for the interactive API explorer.",
    }


@app.post("/site-access/verify")
async def site_access_verify(request: Request, body: SiteAccessVerifyBody):
    """
    Check shared site password (server env SITE_ACCESS_PASSWORD).
    On success sets HttpOnly cookie; phrase is never compared in the browser bundle.
    """
    if not _site_access_password_configured():
        raise HTTPException(
            status_code=503,
            detail="Site gate is not configured on the server.",
        )

    expected = os.getenv("SITE_ACCESS_PASSWORD", "").strip().encode("utf-8")
    got = body.password.encode("utf-8")
    if not secrets.compare_digest(got, expected):
        raise HTTPException(status_code=401, detail="Invalid access phrase.")

    try:
        token = mint_site_gate_cookie_value()
    except RuntimeError:
        raise HTTPException(
            status_code=503,
            detail="Site gate session signing is not configured (SITE_GATE_SESSION_SECRET).",
        )

    resp = JSONResponse(content={"ok": True})
    resp.set_cookie(
        key=SITE_GATE_COOKIE,
        value=token,
        max_age=SITE_GATE_MAX_AGE,
        httponly=True,
        secure=_request_is_https(request),
        samesite="lax",
        path="/",
    )
    return resp


@app.get("/site-access/status")
def site_access_status(request: Request):
    """204 if valid gate cookie; 401 otherwise."""
    if not _site_access_password_configured():
        raise HTTPException(status_code=503, detail="Site gate not configured.")
    raw = request.cookies.get(SITE_GATE_COOKIE)
    if site_gate_cookie_valid(raw):
        return Response(status_code=204)
    raise HTTPException(status_code=401, detail="Not authenticated.")


@app.post("/site-access/logout")
def site_access_logout():
    resp = JSONResponse(content={"ok": True})
    resp.delete_cookie(SITE_GATE_COOKIE, path="/")
    return resp


@app.post(
    "/process-text",
    response_model=list[TaskOutput],
    summary="Process raw text into prioritised tasks",
)
async def process_text(body: TextInput):
    """
    **Pipeline:**
    raw text → LLM (Groq) → task list → semantic scoring → prioritised tasks

    Send a JSON body with a `"text"` field containing the text you want
    processed.  The system will extract actionable tasks and assign
    priorities automatically using LLM semantic understanding.
    """

    # Validate: reject empty input early
    if not body.text or not body.text.strip():
        raise HTTPException(
            status_code=400,
            detail="The 'text' field cannot be empty. Please provide some text to process.",
        )

    # Run the full AI pipeline
    result = await run_pipeline(body.text)
    return result


@app.post(
    "/upload-pdf",
    response_model=list[TaskOutput],
    summary="Upload a PDF and extract prioritised tasks",
)
async def upload_pdf(file: UploadFile = File(...)):
    """
    **Pipeline:**
    PDF → text extraction → LLM (Groq) → task list → semantic scoring → prioritised tasks

    Upload a PDF file.  The system will extract the text, identify tasks,
    and assign priorities using LLM semantic understanding.
    """

    # Validate: check file type
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF file (*.pdf).",
        )

    try:
        # Read the uploaded file into memory
        file_bytes = await file.read()

        # Step 0 — Extract text from the PDF
        extracted_text = extract_text_from_pdf(file_bytes)

        # Steps 1 & 2 — Run the full AI pipeline
        result = await run_pipeline(extracted_text)
        return result

    except ValueError as value_error:
        # Raised by pdf_parser when the PDF is empty / image-only
        raise HTTPException(status_code=422, detail=str(value_error))

    except Exception as error:
        # Catch-all so the API never crashes
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing the PDF: {error}",
        )
