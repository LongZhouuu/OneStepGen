"""
Test with PDF — full pipeline: PDF → text extraction → Groq → scoring → priorities.
"""
from utils.pdf_parser import extract_text_from_pdf
from utils.ai_processor import extract_tasks_from_text
from utils.scoring import assign_priorities

PDF_PATH = "FIT5120 Student Guide 2026 S1.docx.pdf"

# Step 0 — Extract text from the PDF
print(f"📄 Reading PDF: {PDF_PATH}")
with open(PDF_PATH, "rb") as f:
    pdf_text = extract_text_from_pdf(f.read())

print(f"   Extracted {len(pdf_text)} characters of text.\n")
print(f"   Preview (first 300 chars):\n   {pdf_text[:300]}...\n")

# Step 1 — Send to LLM
print("🔄 Sending to Groq API (Llama 3)...")
tasks = extract_tasks_from_text(pdf_text)

if not tasks:
    print("❌ No tasks returned — check the API key or network.")
else:
    print(f"✅ Got {len(tasks)} tasks — now scoring...\n")

    # Step 2 — Score and assign priorities
    prioritised = assign_priorities(tasks)

    # Group by priority
    buckets = {"Do First": [], "Schedule": [], "Delegate": [], "Maybe/Later": []}
    for t in prioritised:
        buckets[t["priority"]].append(t)

    for label, items in buckets.items():
        if items:
            icon = {"Do First": "🔴", "Schedule": "🟡", "Delegate": "🟢", "Maybe/Later": "⚪"}[label]
            print(f"{icon} {label}  ({len(items)} tasks)")
            print(f"  {'─' * 50}")
            for t in items:
                print(f"  #{t['category_rank']}  {t['task']}  (score: {t['score']}, rank: {t['rank']})")
            print()
