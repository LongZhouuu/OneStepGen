# ADHD Productivity Tool — Backend Walkthrough

## What Was Built

A complete **FastAPI backend** demonstrating a **semantic AI pipeline** for ADHD-friendly task management:

```
User Input (text / PDF)  →  LLM (Groq / Llama 3)  →  Semantic Scoring  →  Prioritised Tasks JSON
```

---

## Files Created

| File | Purpose |
|------|---------| 
| [main.py](file:///n:/iteration%202/main.py) | FastAPI app with `/process-text` and `/upload-pdf` endpoints |
| [utils/ai_processor.py](file:///n:/iteration%202/utils/ai_processor.py) | Sends text to Groq (Llama 3), returns task list with urgency/importance ratings |
| [utils/scoring.py](file:///n:/iteration%202/utils/scoring.py) | Semantic priority scoring model (+3 urgency, +2 importance, +1 short) |
| [utils/pdf_parser.py](file:///n:/iteration%202/utils/pdf_parser.py) | PDF text extraction via PyPDF with error handling |
| [requirements.txt](file:///n:/iteration%202/requirements.txt) | Python dependencies |
| [.env.example](file:///n:/iteration%202/.env.example) | API key template |
| [README.md](file:///n:/iteration%202/README.md) | Full setup & testing guide |

---

## AI Pipeline Architecture

### Stage 1 — Text Extraction ([pdf_parser.py](file:///n:/iteration%202/utils/pdf_parser.py))
- Uses PyPDF to extract text from every page
- Handles empty/corrupt/image-only PDFs gracefully
- Only used for the `/upload-pdf` endpoint

### Stage 2 — LLM Processing ([ai_processor.py](file:///n:/iteration%202/utils/ai_processor.py))
- Sends text to **Llama 3 70B** via Groq with a structured prompt
- LLM extracts tasks and breaks them into 2–5 minute actionable steps
- Each step starts with a verb (e.g. "Open", "Write", "Submit")
- LLM rates each task's **urgency (1–5)** and **importance (1–5)**
- Returns empty list on failure (never crashes)

### Stage 3 — Semantic Priority Scoring ([scoring.py](file:///n:/iteration%202/utils/scoring.py))
- Pure Python semantic scoring model (no ML dependencies)
- Uses LLM-provided urgency and importance ratings as the sole signal
- Three components: urgency (max +3), importance (max +2), short task bonus (+1)
- Score ≥ 4 → "Do First", 2–3 → "Schedule", 1 → "Delegate", 0 → "Maybe/Later"

---

## How to Run

```bash
# 1. Set up API key
cp .env.example .env
# Edit .env and paste your Groq API key

# 2. Start the server
uvicorn main:app --reload

# 3. Open browser
# http://127.0.0.1:8000/docs
```

---

## Validation

- ✅ All dependencies install successfully
- ✅ App imports without errors
- ✅ Swagger docs available at `/docs` for interactive testing
