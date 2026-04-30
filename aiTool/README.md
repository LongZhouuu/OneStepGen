# 🧠 ADHD Productivity Tool — AI Backend

A **FastAPI** backend that demonstrates a **semantic AI pipeline** for an ADHD-friendly task management system.  
Built as a university AI project showcasing NLP via LLM + semantic scoring.

---

## 🏗️ Architecture — AI Pipeline

```
User Input (text or PDF)
       │
       ▼
[1] Text Extraction        ← pdf_parser.py (PyPDF)
       │
       ▼
[2] LLM Processing         ← ai_processor.py (Groq / Llama 3)
       │  • Extracts tasks
       │  • Breaks into 2–5 min steps
       │  • Each step starts with a verb
       │  • Rates urgency (1–5) and importance (1–5)
       ▼
[3] Semantic Priority Scoring ← scoring.py
       │  Uses LLM urgency + importance ratings
       │  Maps into 0–6 point range → priority label
       ▼
Structured JSON Response
```

---

## 📂 Project Structure

```
iteration 2/
├── main.py                 # FastAPI application & endpoints
├── utils/
│   ├── __init__.py
│   ├── pdf_parser.py       # PDF text extraction (PyPDF)
│   ├── ai_processor.py     # LLM integration (Groq / Llama 3)
│   └── scoring.py          # Semantic priority scoring model (LLM ratings)
├── requirements.txt        # Python dependencies
├── .env.example            # Template for environment variables
├── .gitignore
└── README.md               # You are here!
```

---

## 🚀 Getting Started

### 1. Install Python

Make sure you have **Python 3.10+** installed.  
Check with: `python --version`

### 2. Create a virtual environment (recommended)

```bash
# Create
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Set up your API key

1. Get a **free** Groq API key at [https://console.groq.com](https://console.groq.com)
2. Copy the example env file:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and paste your key:
   ```
   GROQ_API_KEY=your-actual-key-here
   ```

### 5. Run the server

```bash
uvicorn main:app --reload
```

The server starts at **http://127.0.0.1:8000**

---

## 🧪 Testing the API

### Interactive Docs (easiest)

Open your browser and go to:

👉 **http://127.0.0.1:8000/docs**

This is FastAPI's built-in Swagger UI.  You can test both endpoints directly from the browser.

---

### Endpoint 1: `POST /process-text`

**What it does:** Takes raw text, extracts tasks via AI, and assigns priorities.

**Request body:**
```json
{
  "text": "I need to submit my assignment by tomorrow. Also review the lecture notes and buy groceries today."
}
```

**Example response:**
```json
[
  {
    "task": "Open the assignment document",
    "priority": "Do First",
    "score": 5
  },
  {
    "task": "Write the conclusion section",
    "priority": "Schedule",
    "score": 3
  },
  {
    "task": "Submit the assignment on the portal",
    "priority": "Do First",
    "score": 6
  },
  {
    "task": "Open the lecture notes PDF",
    "priority": "Schedule",
    "score": 2
  },
  {
    "task": "Make a grocery list",
    "priority": "Delegate",
    "score": 1
  }
]
```

---

### Endpoint 2: `POST /upload-pdf`

**What it does:** Accepts a PDF file, extracts text from it, then runs the same AI pipeline.

**How to test:**
1. Go to `/docs`
2. Click on `POST /upload-pdf`
3. Click "Try it out"
4. Upload any PDF file
5. Click "Execute"

---

## 📊 Semantic Priority Scoring Model

The scoring model runs **after** the LLM and uses the LLM's **semantic understanding** of each task.

The LLM rates each task's **urgency** (1–5) and **importance** (1–5). These are mapped into a 0–6 point range:

| Component        | Mapping                      | Max Points |
|------------------|------------------------------|------------|
| Urgency 1–5      | `(urgency - 1) × 0.625`     | **+2.5**   |
| Importance 1–5   | `(importance - 1) × 0.625`  | **+2.5**   |
| Short task bonus  | 8 words or fewer             | **+1**     |

### Why equal weighting?

Urgency and importance are weighted **equally** so the system doesn't push ADHD users toward chasing urgent-but-trivial tasks while neglecting important-but-not-urgent work (a known ADHD trap called "urgency bias"). The LLM understands *meaning*, so "Fix the leaking kitchen tap" gets a high urgency rating even without any keyword match.

| Total Score | Priority      |
|-------------|---------------|
| ≥ 4         | **Do First**  |
| 2–3         | **Schedule**  |
| 1           | **Delegate**  |
| 0           | **Maybe/Later** |

---

## 🛡️ Error Handling

| Scenario                  | Behaviour                                  |
|---------------------------|--------------------------------------------|
| Empty text input          | Returns `400` with clear error message     |
| LLM fails / no API key   | Returns an empty task list `[]`            |
| Empty / image-only PDF    | Returns `422` with descriptive message     |
| Invalid file type         | Returns `400` — "Please upload a PDF file" |
| Unexpected server error   | Returns `500` — API never crashes          |

---

## 🎯 What This Project Demonstrates

1. **NLP using LLM** — Groq (Llama 3) extracts and restructures tasks from natural language  
2. **Semantic AI scoring** — LLM understands context and rates urgency/importance without rigid keyword lists  
3. **Clear AI pipeline** — Text → LLM (extract + rate) → Semantic Scoring → Output  
4. **Clean API integration** — RESTful FastAPI endpoints with validation  
5. **ADHD-friendly design** — Tasks broken into small, actionable steps starting with verbs  
6. **Graceful fallback** — Works even if the LLM returns plain strings (neutral defaults applied)
