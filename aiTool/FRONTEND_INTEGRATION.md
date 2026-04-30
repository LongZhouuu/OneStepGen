# Frontend Integration Guide: ADHD Productivity Backend

Welcome! This guide explains how to connect your frontend application (React, Vue, Next.js, Vanilla JS) to our FastAPI backend. 

The backend processes raw text or PDF documents using a state-of-the-art LLM (Llama 3 via Groq) to extract tasks, break them down into 2-5 minute steps, and semantically score them into an ADHD-friendly priority list.

---

## 1. Enabling CORS
Before you can make requests from your frontend (e.g., `http://localhost:3000`), you must ensure **CORS** is enabled on the backend.

In `main.py`, make sure the `CORSMiddleware` is configured like this:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Update with your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 2. API Endpoints

The API is fully asynchronous, meaning it won't block while processing. There are two primary endpoints you can use:

### Endpoint A: `/process-text`
Use this if the user pastes text directly into a text box.
- **Method**: `POST`
- **URL**: `http://localhost:8000/process-text`
- **Content-Type**: `application/json`

**Example Request:**
```javascript
const response = await fetch('http://localhost:8000/process-text', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: "I need to submit my assignment by Friday and buy groceries." })
});
const tasks = await response.json();
```

### Endpoint B: `/upload-pdf`
Use this if the user uploads a PDF file (e.g., a syllabus or assignment guide).
- **Method**: `POST`
- **URL**: `http://localhost:8000/upload-pdf`
- **Content-Type**: `multipart/form-data`

**Example Request:**
```javascript
// Assuming `fileInput` is an HTML <input type="file" accept=".pdf" />
const file = fileInput.files[0];
const formData = new FormData();
formData.append("file", file);

const response = await fetch('http://localhost:8000/upload-pdf', {
  method: 'POST',
  body: formData // The browser automatically sets the multipart/form-data headers
});
const tasks = await response.json();
```

---

## 3. The Response Format

Both endpoints return the exact same structured JSON array. Each object in the array represents an actionable 2-5 minute task.

```json
[
  {
    "task": "Review the assignment requirements",
    "priority": "Do First",
    "score": 6,
    "rank": 1,
    "category_rank": 1
  },
  {
    "task": "Buy groceries",
    "priority": "Schedule",
    "score": 3,
    "rank": 2,
    "category_rank": 1
  }
]
```

### How to use this data in the UI:
- **`priority`**: Group your UI elements by this string. It will always be one of: `"Do First"`, `"Schedule"`, `"Delegate"`, or `"Maybe/Later"`.
- **`task`**: The actual text to display to the user.
- **`category_rank`**: Use this to order tasks *within* a specific column/group.
- **`rank`**: The overall global rank across all tasks.

---

## 4. Error Handling

Because the backend communicates with a third-party LLM, there are times when it might fail (e.g., rate limits). The backend is designed to "fail loudly" and will return standard HTTP status codes.

You should wrap your frontend calls in a `try...catch` block:

```javascript
try {
  const response = await fetch('http://localhost:8000/upload-pdf', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    if (response.status === 422 || response.status === 400) {
      throw new Error("Invalid file format. Please upload a valid PDF.");
    } else if (response.status === 500) {
      throw new Error("The AI is currently busy or rate-limited. Please try again in a moment.");
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }

  const tasks = await response.json();
  // Render tasks...

} catch (error) {
  // Show error.message in a toast notification or alert box
  console.error("Pipeline Error:", error);
}
```
