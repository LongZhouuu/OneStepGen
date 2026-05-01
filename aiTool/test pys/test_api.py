"""
Quick test — full pipeline: text → Groq (Llama 3) → scoring → priorities.
"""
from utils.ai_processor import extract_tasks_from_text
from utils.scoring import assign_priorities

sample_text = """
I need to finish my FIT5120 assignment by Friday. 
I also have to email my team about the meeting agenda 
and buy groceries for dinner tonight.
"""

print("🔄 Calling Groq API (Llama 3)...")
tasks = extract_tasks_from_text(sample_text)

if not tasks:
    print("❌ No tasks returned — check the API key or network.")
else:
    print(f"✅ Got {len(tasks)} tasks from LLM — now scoring...\n")

    # Step 2 — Run the scoring model to assign priorities
    prioritised = assign_priorities(tasks)

    # Group by priority for a nicer display
    buckets = {"Do First": [], "Schedule": [], "Delegate": [], "Maybe/Later": []}
    for t in prioritised:
        buckets[t["priority"]].append(t)

    for label, items in buckets.items():
        if items:
            print(f"{'🔴' if label == 'Do First' else '🟡' if label == 'Schedule' else '🟢' if label == 'Delegate' else '⚪'} {label}")
            print(f"  {'─' * 50}")
            for t in items:
                print(f"  • {t['task']}  (score: {t['score']})")
            print()
