"""
ai_processor.py — Send text to Groq (Llama 3) and get back structured tasks.

This is the *first half* of our AI pipeline:
    1.  We send the user's raw text to the LLM.
    2.  The LLM extracts tasks and breaks each one into small,
        actionable steps (2–5 minutes each), starting with a verb.
    3.  The LLM also rates each task's urgency and importance on
        a 1–5 scale, giving the scoring model semantic context.

We return a list of dicts, each with "task", "urgency", and "importance".

Provider: Groq (free tier)
Model:    Llama 3.3 70B Versatile (fast, accurate, great at structured JSON)

Rate Limits (free tier):
    • 30 requests per minute  (RPM)
    • 1,000 requests per day  (RPD)
    • ~6,000 tokens per minute (TPM — varies by model)

This module handles rate limits automatically with exponential backoff
retry logic and text chunking for large inputs.
"""

import asyncio
import json
import logging
import os
import time
from pathlib import Path
from groq import AsyncGroq
from dotenv import load_dotenv

# Load the .env file so we can read GROQ_API_KEY
# Use explicit path so it works from any working directory
_ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(_ENV_PATH)

logger = logging.getLogger(__name__)


# ── Default scores when the LLM doesn't provide them ───────
# 3 = neutral middle of the 1–5 scale.
_DEFAULT_URGENCY: int = 3
_DEFAULT_IMPORTANCE: int = 3


# ── Rate limit / retry configuration ──────────────────────
MAX_RETRIES: int = 3              # How many times to retry on rate limit
INITIAL_BACKOFF_SECS: float = 2.0 # First wait (doubles each retry)
MAX_BACKOFF_SECS: float = 60.0    # Never wait longer than this

# Approximate character limit per chunk.
# Llama 3.3 70B on Groq free tier has ~6,000 TPM.
# ~4 chars ≈ 1 token, so ~20,000 chars ≈ 5,000 tokens (leaves room
# for the system prompt + response tokens).
MAX_CHARS_PER_CHUNK: int = 18_000


# ── Prompt template ─────────────────────────────────────────
# This is the instruction we give the LLM every time.

SYSTEM_PROMPT = """You are an ADHD-friendly productivity assistant.

Given the text below, do the following:
1. Identify every task, to-do, or action item mentioned.
2. Break each task into small, concrete steps that take 2–5 minutes each.
3. Every step MUST start with an action verb (e.g. "Open", "Write", "Send").
4. For EACH step, rate its urgency and importance on a 1–5 integer scale:
   - urgency:    1 = no rush at all, 5 = must be done immediately
   - importance: 1 = trivial / nice-to-have, 5 = critical / high-impact
5. Return ONLY a valid JSON object containing a "tasks" array. No markdown, no explanation.
6. If the text does NOT contain any genuine tasks, to-dos, or action items,
   return {"tasks": []} — do NOT invent or hallucinate tasks from general
   narrative, news, or informational content.

Example output:
{
  "tasks": [
    {"task": "Open the assignment document", "urgency": 4, "importance": 5},
    {"task": "Write the introduction paragraph", "urgency": 3, "importance": 4},
    {"task": "Save the file", "urgency": 2, "importance": 3}
  ]
}"""


# ── Helpers ─────────────────────────────────────────────────

def _clamp(value, lo: int = 1, hi: int = 5) -> int:
    """Clamp *value* to the [lo, hi] range, defaulting to 3 on bad input."""
    try:
        n = int(value)
        return max(lo, min(hi, n))
    except (TypeError, ValueError):
        return _DEFAULT_URGENCY          # safe neutral default


def _normalise_task(item) -> dict:
    """
    Convert whatever the LLM returned for a single task into our
    standard dict format: {"task": str, "urgency": int, "importance": int}.

    Handles both the new object format and the legacy plain-string format.
    """
    if isinstance(item, str):
        # Legacy format — plain string, no metadata
        return {
            "task": item,
            "urgency": _DEFAULT_URGENCY,
            "importance": _DEFAULT_IMPORTANCE,
        }

    if isinstance(item, dict):
        return {
            "task": str(item.get("task", "")),
            "urgency": _clamp(item.get("urgency", _DEFAULT_URGENCY)),
            "importance": _clamp(item.get("importance", _DEFAULT_IMPORTANCE)),
        }

    # Unknown shape — skip it
    return None


def _chunk_text(text: str, max_chars: int = MAX_CHARS_PER_CHUNK) -> list[str]:
    """
    Split *text* into chunks of at most *max_chars* characters.

    Tries to break at paragraph boundaries (double newline) to keep
    context intact.  Falls back to splitting at single newlines, then
    at the hard character limit if necessary.
    """
    if len(text) <= max_chars:
        return [text]

    chunks: list[str] = []
    remaining = text

    while remaining:
        if len(remaining) <= max_chars:
            chunks.append(remaining)
            break

        # Try to find a paragraph break within the limit
        split_pos = remaining.rfind("\n\n", 0, max_chars)

        if split_pos == -1:
            # No paragraph break — try a single newline
            split_pos = remaining.rfind("\n", 0, max_chars)

        if split_pos == -1:
            # No newline at all — hard split at limit
            split_pos = max_chars

        chunks.append(remaining[:split_pos].strip())
        remaining = remaining[split_pos:].strip()

    # Filter out empty chunks
    return [c for c in chunks if c]


async def _call_groq_with_retry(client: AsyncGroq, user_text: str) -> str | None:
    """
    Call the Groq API with automatic retry on rate-limit (429) errors.

    Uses exponential backoff: 2s → 4s → 8s (capped at MAX_BACKOFF_SECS).
    Returns the raw response text, or None if all retries fail.
    """
    backoff = INITIAL_BACKOFF_SECS

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            chat_completion = await client.chat.completions.create(
                model="llama-3.3-70b-versatile",      # fast & accurate
                messages=[
                    {
                        "role": "system",
                        "content": SYSTEM_PROMPT,
                    },
                    {
                        "role": "user",
                        "content": user_text,
                    },
                ],
                temperature=0.3,                       # low = more deterministic
                max_tokens=2048,
                response_format={"type": "json_object"},  # force valid JSON
            )

            # Success — return the raw text
            if chat_completion.choices and chat_completion.choices[0].message.content:
                return chat_completion.choices[0].message.content.strip()
            else:
                logger.error("LLM returned an empty response.")
                return None

        except Exception as error:
            error_str = str(error).lower()
            error_code = getattr(error, 'status_code', None)

            is_rate_limit = (
                error_code == 429
                or "rate_limit" in error_str
                or "rate limit" in error_str
                or "429" in error_str
                or "too many requests" in error_str
            )

            if is_rate_limit and attempt < MAX_RETRIES:
                # Parse retry-after header if available
                retry_after = None
                if hasattr(error, 'response') and error.response is not None:
                    retry_after_header = error.response.headers.get("retry-after")
                    if retry_after_header:
                        try:
                            retry_after = float(retry_after_header)
                        except (ValueError, TypeError):
                            pass

                wait_time = retry_after if retry_after else backoff
                wait_time = min(wait_time, MAX_BACKOFF_SECS)

                logger.warning(
                    f"⏳ Rate limit hit (attempt {attempt}/{MAX_RETRIES}). "
                    f"Waiting {wait_time:.1f}s before retry..."
                )
                await asyncio.sleep(wait_time)
                backoff = min(backoff * 2, MAX_BACKOFF_SECS)
                continue

            elif is_rate_limit:
                logger.error(
                    f"🚫 Rate limit exceeded after {MAX_RETRIES} retries. "
                    f"Groq free tier allows 30 req/min and 1,000 req/day. "
                    f"Please wait a moment and try again."
                )
                raise RuntimeError("Groq API rate limit exceeded after maximum retries.")
            else:
                # Non-rate-limit error — don't retry
                logger.error(f"LLM call failed: {error}")
                raise

    raise RuntimeError("Groq API rate limit exceeded after maximum retries.")


def _parse_response(raw_text: str) -> list[dict]:
    """
    Parse the raw LLM response text into a list of normalised task dicts.
    """
    # Sometimes the LLM wraps output in ```json ... ``` — strip that
    cleaned = raw_text
    if cleaned.startswith("```"):
        # Remove the opening ``` (and optional "json" label)
        cleaned = cleaned.split("\n", 1)[-1]
    if cleaned.endswith("```"):
        cleaned = cleaned.rsplit("```", 1)[0]

    cleaned = cleaned.strip()

    # Convert the JSON string into a Python object
    parsed = json.loads(cleaned)

    # ── Handle wrapper object ───────────────────────────
    # When response_format is json_object, some models wrap
    # the array in {"tasks": [...]} — unwrap it.
    if isinstance(parsed, dict):
        # Look for a key that contains a list
        for key in ("tasks", "items", "steps", "results"):
            if key in parsed and isinstance(parsed[key], list):
                parsed = parsed[key]
                break
        else:
            # Single task as a dict? Wrap it.
            if "task" in parsed:
                parsed = [parsed]
            else:
                logger.warning("LLM returned non-list JSON. Returning empty list.")
                return []

    if not isinstance(parsed, list):
        logger.warning("LLM returned non-list JSON. Returning empty list.")
        return []

    # Normalise each item
    tasks = []
    for item in parsed:
        normalised = _normalise_task(item)
        if normalised and normalised["task"]:
            tasks.append(normalised)

    # Filter out likely-hallucinated noise: if the LLM rated a task as
    # both minimal urgency (1) AND minimal importance (1), it's almost
    # certainly not a genuine action item — strip it.
    tasks = [
        t for t in tasks
        if not (t["urgency"] == 1 and t["importance"] == 1)
    ]

    return tasks


# ── Public API ──────────────────────────────────────────────

async def extract_tasks_from_text(user_text: str) -> list[dict]:
    """
    Send *user_text* to Groq (Llama 3) and return structured task dicts.

    Handles large inputs by splitting text into chunks and processing
    each separately.  Automatically retries on rate-limit (429) errors
    with exponential backoff.

    Parameters
    ----------
    user_text : str
        The raw text (typed by the user or extracted from a PDF).

    Returns
    -------
    list[dict]
        Each dict has three keys:
            • "task"       – the actionable step (str)
            • "urgency"    – 1–5 scale (int)
            • "importance" – 1–5 scale (int)
        Returns an empty list if anything goes wrong.
    """

    # ── 1. Read the API key from the environment ────────────
    api_key = os.getenv("GROQ_API_KEY")

    if not api_key or api_key == "your-groq-api-key-here":
        raise ValueError("GROQ_API_KEY is not set in the environment.")

    # ── 2. Create the Groq client ──────────────────────
    client = AsyncGroq(api_key=api_key)

    # ── 3. Chunk the text if it's too large ────────────
    chunks = _chunk_text(user_text)

    if len(chunks) > 1:
        logger.info(
            f"📄 Input is {len(user_text):,} chars — split into "
            f"{len(chunks)} chunks to stay within token limits."
        )

    # ── 4. Process each chunk (with retry logic) ────────
    all_tasks: list[dict] = []

    for i, chunk in enumerate(chunks, start=1):
        if len(chunks) > 1:
            logger.info(f"🔄 Processing chunk {i}/{len(chunks)} ({len(chunk):,} chars)...")

        raw_response = await _call_groq_with_retry(client, chunk)

        if raw_response is None:
            logger.warning(f"Chunk {i}/{len(chunks)} returned no results.")
            continue

        try:
            chunk_tasks = _parse_response(raw_response)
            all_tasks.extend(chunk_tasks)
        except json.JSONDecodeError as json_err:
            logger.error(f"Could not parse chunk {i} as JSON: {json_err}")
            continue

        # Small delay between chunks to avoid hitting RPM limits
        if i < len(chunks):
            logger.info("⏳ Pausing 2s between chunks to respect rate limits...")
            await asyncio.sleep(2.0)

    return all_tasks
