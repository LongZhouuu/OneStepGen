"""
test_all_scenarios.py — Comprehensive pre-push test suite.

Tests both fixes:
  Fix #3 — Hallucination guard (prompt + noise filter)
  Fix #4 — Scoring rebalance (equal urgency/importance weights)

Part 1: Scoring model (local, no API needed — runs instantly)
Part 2: LLM integration (calls Groq API — needs valid API key)
"""

import asyncio
import sys

# ── PART 1: Scoring Model Tests (Fix #4) ─────────────────────
# These run locally — no API key needed.

from utils.scoring import _semantic_score, _compute_score, _score_to_priority, assign_priorities

passed = 0
failed = 0


def check(test_name: str, actual, expected):
    """Simple assertion helper with pass/fail counting."""
    global passed, failed
    ok = actual == expected
    icon = "✅" if ok else "❌"
    print(f"  {icon} {test_name}")
    if not ok:
        print(f"       Expected: {expected}")
        print(f"       Got:      {actual}")
        failed += 1
    else:
        passed += 1


print("=" * 60)
print("PART 1 — SCORING MODEL (local, no API)")
print("=" * 60)

# ── Test 1: Equal weighting ──────────────────────────────────
print("\n🧪 Test 1: Urgency and importance are weighted equally")

# urgency=5, importance=1 should equal urgency=1, importance=5
score_urgent = _semantic_score("Test task text here", urgency=5, importance=1)
score_important = _semantic_score("Test task text here", urgency=1, importance=5)
check(
    "urgency=5/imp=1 equals urgency=1/imp=5",
    score_urgent, score_important
)

# Both maxed out should give 5.0 (2.5 + 2.5) without short bonus
score_max = _semantic_score("This is a longer task that exceeds eight words definitely", urgency=5, importance=5)
check(
    "Max urgency + max importance (long task) = 5.0",
    score_max, 5.0
)

# Both maxed out + short task should give 6.0
score_max_short = _semantic_score("Submit report", urgency=5, importance=5)
check(
    "Max urgency + max importance (short task) = 6.0",
    score_max_short, 6.0
)

# Both minimum should give 0.0
score_min = _semantic_score("Some task here for testing that is longer than eight words easily", urgency=1, importance=1)
check(
    "Min urgency + min importance (no short bonus) = 0.0",
    score_min, 0.0
)

# ── Test 2: Short task bonus ─────────────────────────────────
print("\n🧪 Test 2: Short task bonus (≤8 words = +1)")

short_task = _semantic_score("Buy milk", urgency=3, importance=3)
long_task = _semantic_score("Go to the supermarket and buy two litres of full cream milk", urgency=3, importance=3)
check(
    "Short task scores 1 point higher than long task (same ratings)",
    short_task - long_task, 1.0
)

# Exactly 8 words should get the bonus
exactly_8 = _semantic_score("One two three four five six seven eight", urgency=1, importance=1)
check("Exactly 8 words gets short bonus = 1.0", exactly_8, 1.0)

# 9 words should NOT get the bonus
nine_words = _semantic_score("One two three four five six seven eight nine", urgency=1, importance=1)
check("9 words does NOT get short bonus = 0.0", nine_words, 0.0)

# ── Test 3: Priority bucket thresholds ───────────────────────
print("\n🧪 Test 3: Priority bucket thresholds")

check("Score 6 → Do First",    _score_to_priority(6), "Do First")
check("Score 5 → Do First",    _score_to_priority(5), "Do First")
check("Score 4 → Do First",    _score_to_priority(4), "Do First")
check("Score 3 → Schedule",    _score_to_priority(3), "Schedule")
check("Score 2 → Schedule",    _score_to_priority(2), "Schedule")
check("Score 1 → Delegate",    _score_to_priority(1), "Delegate")
check("Score 0 → Maybe/Later", _score_to_priority(0), "Maybe/Later")

# ── Test 4: _compute_score rounds correctly ──────────────────
print("\n🧪 Test 4: Score rounding (half-up)")

# urgency=3, importance=3, short task: (2*0.625)+(2*0.625)+1 = 3.5 → rounds to 4
check(
    "Mid ratings + short task → 4 (Do First)",
    _compute_score("Buy milk", llm_urgency=3, llm_importance=3), 4
)

# urgency=2, importance=2, long task: (1*0.625)+(1*0.625)+0 = 1.25 → rounds to 1
check(
    "Low ratings + long task → 1 (Delegate)",
    _compute_score("Go to the store and pick up items for dinner tonight", llm_urgency=2, llm_importance=2), 1
)

# ── Test 5: Default fallback when ratings missing ────────────
print("\n🧪 Test 5: Graceful defaults (no urgency/importance)")

score_no_ratings = _compute_score("Some task", llm_urgency=None, llm_importance=None)
score_with_defaults = _compute_score("Some task", llm_urgency=3, llm_importance=3)
check(
    "Missing ratings default to 3/3 (same as explicit 3/3)",
    score_no_ratings, score_with_defaults
)

# ── Test 6: assign_priorities ranking ────────────────────────
print("\n🧪 Test 6: Ranking and category_rank")

test_tasks = [
    {"task": "Low priority task here for testing", "urgency": 1, "importance": 2},
    {"task": "Submit report", "urgency": 5, "importance": 5},
    {"task": "Review notes", "urgency": 4, "importance": 4},
]
ranked = assign_priorities(test_tasks)

check("Highest score gets rank 1", ranked[0]["task"], "Submit report")
check("Second highest gets rank 2", ranked[1]["task"], "Review notes")
check("Lowest gets rank 3", ranked[2]["rank"], 3)
check("First item in its category gets category_rank 1", ranked[0]["category_rank"], 1)

# ── Test 7: Empty input ─────────────────────────────────────
print("\n🧪 Test 7: Empty and edge-case inputs")

check("Empty list → empty result", assign_priorities([]), [])

single = assign_priorities([{"task": "Do thing", "urgency": 3, "importance": 3}])
check("Single task gets rank 1", single[0]["rank"], 1)
check("Single task gets category_rank 1", single[0]["category_rank"], 1)


# ── PART 1 SUMMARY ───────────────────────────────────────────
print(f"\n{'─' * 60}")
print(f"PART 1 RESULTS: {passed} passed, {failed} failed")
print(f"{'─' * 60}")

if failed > 0:
    print("\n🚫 Scoring model has failures — fix before pushing!")
    print("   Skipping Part 2 (API tests).")
    sys.exit(1)

print("\n✅ All scoring tests passed! Moving to API tests...\n")


# ── PART 2: LLM Integration Tests (Fix #3) ───────────────────
# These call the Groq API — needs a valid API key.

from utils.ai_processor import extract_tasks_from_text

api_passed = 0
api_failed = 0


def api_check(test_name: str, condition: bool, detail: str = ""):
    """Assertion helper for API tests."""
    global api_passed, api_failed
    icon = "✅" if condition else "❌"
    print(f"  {icon} {test_name}")
    if detail:
        print(f"       {detail}")
    if condition:
        api_passed += 1
    else:
        api_failed += 1


async def run_part_2():
    global passed, failed, api_passed, api_failed

    print("=" * 60)
    print("PART 2 — LLM INTEGRATION (calls Groq API)")
    print("=" * 60)

    # ── Scenario A: Normal task text (should extract tasks) ──────
    print("\n🧪 Scenario A: Normal task-oriented text")

    normal_text = """
I need to submit my FIT5120 assignment by Friday.
I also have to email my team about the meeting agenda
and buy groceries for dinner tonight.
"""

    print("   Sending to Groq API...")
    tasks_normal = await extract_tasks_from_text(normal_text)
    api_check(
        "Returns tasks from task-oriented input",
        len(tasks_normal) > 0,
        f"Got {len(tasks_normal)} tasks"
    )

    if tasks_normal:
        # Verify structure
        first = tasks_normal[0]
        api_check(
            "Each task has 'task', 'urgency', 'importance' keys",
            all(k in first for k in ("task", "urgency", "importance")),
        )
        api_check(
            "Urgency is in 1–5 range",
            all(1 <= t["urgency"] <= 5 for t in tasks_normal),
        )
        api_check(
            "Importance is in 1–5 range",
            all(1 <= t["importance"] <= 5 for t in tasks_normal),
        )
        api_check(
            "No hallucinated noise (urgency=1 AND importance=1 filtered)",
            all(not (t["urgency"] == 1 and t["importance"] == 1) for t in tasks_normal),
        )

        # Verify scoring pipeline works end-to-end
        prioritised = assign_priorities(tasks_normal)
        api_check(
            "Scoring pipeline produces prioritised output",
            len(prioritised) > 0 and "priority" in prioritised[0],
        )
        valid_priorities = {"Do First", "Schedule", "Delegate", "Maybe/Later"}
        api_check(
            "All priorities are valid labels",
            all(t["priority"] in valid_priorities for t in prioritised),
        )

        print("\n   📋 Results:")
        for t in prioritised:
            print(f"      [{t['priority']:11s}] (score:{t['score']}) {t['task']}")


    # ── Scenario B: Non-task content (Fix #3 — should return few/none)
    print(f"\n{'─' * 60}")
    print("\n🧪 Scenario B: Non-task content (newsletter / informational)")

    newsletter = """
Dear Members,
April has been a significant and constructive month for ACS, combining
important governance progress, strong engagement with educators and partners,
and a continued focus on positioning the Society for the future.

The Management Committee met in Hobart alongside the EdCAT 2026 Conference,
with discussions focused on maintaining stability and strengthening foundations.
Change will continue, but our commitment remains steadfast: supporting our
members and advancing the technology profession. Thank you for being part
of this community.
"""

    print("   Sending to Groq API...")
    tasks_newsletter = await extract_tasks_from_text(newsletter)
    api_check(
        "Newsletter returns ≤ 2 tasks (ideally 0)",
        len(tasks_newsletter) <= 2,
        f"Got {len(tasks_newsletter)} tasks (want 0–2)"
    )

    if tasks_newsletter:
        print("   ⚠️  Tasks extracted (may be legitimate or noise):")
        for t in tasks_newsletter:
            print(f"      [{t['urgency']}/{t['importance']}] {t['task']}")


    # ── Scenario C: Mixed content ────────────────────────────────
    print(f"\n{'─' * 60}")
    print("\n🧪 Scenario C: Mixed content (narrative + some real tasks)")

    mixed = """
The weather has been great this week, and I've been enjoying the sunshine
during my lunch breaks. However, I really need to finish the quarterly
report by end of day Wednesday. My manager also asked me to book the
meeting room for Thursday's presentation. Other than that, the office
potluck was a success and everyone enjoyed the food.
"""

    print("   Sending to Groq API...")
    tasks_mixed = await extract_tasks_from_text(mixed)
    api_check(
        "Mixed content returns some tasks (2+ expected)",
        len(tasks_mixed) >= 2,
        f"Got {len(tasks_mixed)} tasks"
    )

    if tasks_mixed:
        prioritised_mixed = assign_priorities(tasks_mixed)
        has_high = any(t["priority"] == "Do First" for t in prioritised_mixed)
        api_check(
            "At least one task scored as high priority",
            has_high,
            "The quarterly report should be urgent"
        )
        print("\n   📋 Results:")
        for t in prioritised_mixed:
            print(f"      [{t['priority']:11s}] (score:{t['score']}) {t['task']}")


    # ── Scenario D: Pure noise text ──────────────────────────────
    print(f"\n{'─' * 60}")
    print("\n🧪 Scenario D: Pure noise / no actionable content")

    noise = """
The sunset was beautiful yesterday. I saw three birds sitting on the
fence and thought about how peaceful the morning was. The coffee tasted
particularly good today, probably because of the new beans I bought
from the local roaster. Life is good when you slow down and appreciate
the little things.
"""

    print("   Sending to Groq API...")
    tasks_noise = await extract_tasks_from_text(noise)
    api_check(
        "Pure descriptive text returns 0 tasks",
        len(tasks_noise) == 0,
        f"Got {len(tasks_noise)} tasks (want 0)"
    )

    if tasks_noise:
        print("   ⚠️  Unexpected tasks extracted:")
        for t in tasks_noise:
            print(f"      [{t['urgency']}/{t['importance']}] {t['task']}")


    # ── Scenario E: Verify equal weighting in practice ───────────
    print(f"\n{'─' * 60}")
    print("\n🧪 Scenario E: Urgent-but-trivial vs important-but-not-urgent")

    urgent_trivial = """
I need to reply to the spam email from that clothing store RIGHT NOW
before the sale ends in 10 minutes.
"""

    important_calm = """
I should start working on my PhD thesis literature review sometime
this month. It's critical for my academic career.
"""

    print("   Sending urgent-but-trivial to Groq API...")
    tasks_urgent = await extract_tasks_from_text(urgent_trivial)

    print("   Sending important-but-calm to Groq API...")
    tasks_important = await extract_tasks_from_text(important_calm)

    if tasks_urgent and tasks_important:
        scored_urgent = assign_priorities(tasks_urgent)
        scored_important = assign_priorities(tasks_important)

        avg_urgent = sum(t["score"] for t in scored_urgent) / len(scored_urgent)
        avg_important = sum(t["score"] for t in scored_important) / len(scored_important)

        print(f"   Urgent-trivial avg score: {avg_urgent:.1f}")
        print(f"   Important-calm avg score: {avg_important:.1f}")

        api_check(
            "Important-but-calm is NOT drastically lower than urgent-trivial",
            avg_important >= avg_urgent - 2,
            f"Difference: {avg_urgent - avg_important:.1f} (should be small)"
        )
    else:
        print("   ⚠️  Could not compare — one scenario returned no tasks")


    # ── PART 2 SUMMARY ───────────────────────────────────────────
    print(f"\n{'─' * 60}")
    print(f"PART 2 RESULTS: {api_passed} passed, {api_failed} failed")
    print(f"{'─' * 60}")

    # ── FINAL SUMMARY ────────────────────────────────────────────
    total_passed = passed + api_passed
    total_failed = failed + api_failed

    print(f"\n{'=' * 60}")
    print(f"TOTAL: {total_passed} passed, {total_failed} failed")
    print(f"{'=' * 60}")

    if total_failed == 0:
        print("\n🚀 All tests passed — safe to push to GitHub!")
    else:
        print(f"\n⚠️  {total_failed} test(s) failed — review before pushing.")

if __name__ == "__main__":
    asyncio.run(run_part_2())

