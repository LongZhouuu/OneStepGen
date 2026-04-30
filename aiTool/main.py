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

from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel

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


# ── Request / Response models ──────────────────────────────

class TextInput(BaseModel):
    """The JSON body for the /process-text endpoint."""
    text: str


class TaskOutput(BaseModel):
    """A single task with its assigned priority, rank, and category rank."""
    task: str
    priority: str
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
