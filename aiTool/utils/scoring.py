"""
scoring.py — Semantic priority scoring model (LLM context only).

This is the *second half* of our AI pipeline:
    LLM (ai_processor) → structured tasks → scoring model (this file) → prioritised tasks

The model relies ENTIRELY on the LLM's semantic understanding of each task.
The LLM rates every task on two dimensions:

    • urgency    (1–5):  1 = no rush at all,  5 = must be done immediately
    • importance (1–5):  1 = trivial/nice-to-have,  5 = critical/high-impact

These two ratings are mapped into a 0–6 point score:

    Urgency component:     (urgency - 1) × 0.625    →  0 to 2.5 points
    Importance component:  (importance - 1) × 0.625  →  0 to 2.5 points
    Short-task bonus:      ≤ 8 words                →  0 or 1 point
                                                  ─────────────────
                                              Total:  0 to 6 points

Priority buckets:
    Score ≥ 4  → "Do First"
    Score 2–3  → "Schedule"
    Score 1    → "Delegate"
    Score 0    → "Maybe/Later"

Why semantic-only?
    Keyword lists (e.g. "today", "deadline") are brittle — they miss tasks
    that are genuinely urgent but don't happen to contain magic words.
    The LLM understands *meaning*, so "Fix the leaking kitchen tap" gets
    a high urgency rating even without any keyword match.
"""


# ── Configuration ──────────────────────────────────────────

# Tasks with this many words or fewer get a +1 "short task" bonus.
# Shorter tasks are easier to start — important for ADHD users.
SHORT_TASK_WORD_LIMIT: int = 8

# Default scores when the LLM doesn't provide ratings.
# 3 = neutral middle of the 1–5 scale.
_DEFAULT_URGENCY: int = 3
_DEFAULT_IMPORTANCE: int = 3


# ── Scoring functions ──────────────────────────────────────

def _semantic_score(task_text: str, urgency: int, importance: int) -> float:
    """
    Compute a priority score from the LLM's urgency/importance ratings.

    Maps the 1–5 scales into a 0–6 range:
        urgency    1–5  →  0, 0.625, 1.25, 1.875, 2.5  (max +2.5)
        importance 1–5  →  0, 0.625, 1.25, 1.875, 2.5  (max +2.5)
        short task       →  +1                           (max +1)
                                                    total max = 6

    Parameters
    ----------
    task_text : str
        The task description (used to check word count).
    urgency : int
        LLM-rated urgency (1–5).
    importance : int
        LLM-rated importance (1–5).

    Returns
    -------
    float
        The computed score (0.0–6.0).
    """
    score = 0.0

    # Urgency component (maps 1→0, 5→2.5)
    score += (urgency - 1) * 0.625

    # Importance component (maps 1→0, 5→2.5)
    score += (importance - 1) * 0.625

    # Short task bonus — easier to start for ADHD users
    word_count = len(task_text.split())
    if word_count <= SHORT_TASK_WORD_LIMIT:
        score += 1

    return score


def _compute_score(task_text: str, llm_urgency: int = None,
                   llm_importance: int = None) -> int:
    """
    Compute the final priority score for a single task.

    Uses the LLM's semantic ratings as the sole signal.  If the LLM
    did not provide ratings (legacy format), neutral defaults (3/3)
    are used so the pipeline never breaks.

    Parameters
    ----------
    task_text : str
        The task description (e.g. "Fix the leaking kitchen tap").
    llm_urgency : int or None
        LLM-rated urgency (1–5). None if not available.
    llm_importance : int or None
        LLM-rated importance (1–5). None if not available.

    Returns
    -------
    int
        The computed score (0 or higher).
    """
    # Use defaults if LLM didn't provide ratings (graceful fallback)
    urgency = llm_urgency if llm_urgency is not None else _DEFAULT_URGENCY
    importance = llm_importance if llm_importance is not None else _DEFAULT_IMPORTANCE

    raw_score = _semantic_score(task_text, urgency, importance)

    # Round to nearest integer (half-up)
    return int(raw_score + 0.5)


def _score_to_priority(score: int) -> str:
    """Convert a numeric score into a human-readable priority label."""
    if score >= 4:
        return "Do First"
    elif score >= 2:
        return "Schedule"
    elif score == 1:
        return "Delegate"
    else:
        return "Maybe/Later"


# ── Public API ──────────────────────────────────────────────

def assign_priorities(tasks: list[dict]) -> list[dict]:
    """
    Take a list of task dicts and return a **ranked** list of dicts with
    the task text, its assigned priority, a global rank, and a
    per-category rank.

    Tasks are sorted by score (highest first) so the rank reflects
    the recommended order of execution.  Within the same score,
    original order is preserved (stable sort).

    The ``category_rank`` tells the user exactly which task to tackle
    first *within* each priority bucket.  For example, if there are
    three "Do First" tasks, they will be numbered 1, 2, 3 based on
    their score (highest score → rank 1).

    Parameters
    ----------
    tasks : list[dict]
        Each dict must have:
            • "task"       – the task description (str)
            • "urgency"    – LLM-rated urgency, 1–5 (int)
            • "importance" – LLM-rated importance, 1–5 (int)

    Returns
    -------
    list[dict]
        Each dict has keys:
            • "task"           – the original task text
            • "priority"       – one of "Do First", "Schedule",
                                 "Delegate", or "Maybe/Later"
            • "score"          – the numeric score (for debugging)
            • "rank"           – 1-based global rank (1 = do this first)
            • "category_rank"  – 1-based rank within the priority
                                 category (1 = top task in that group)

    Example
    -------
    >>> assign_priorities([{"task": "Submit the report", "urgency": 5, "importance": 5}])
    [{"task": "Submit the report", "priority": "Do First", "score": 6, "rank": 1, "category_rank": 1}]
    """

    results: list[dict] = []

    for task_dict in tasks:
        task_text = task_dict.get("task", "")
        llm_urgency = task_dict.get("urgency")
        llm_importance = task_dict.get("importance")

        score = _compute_score(task_text, llm_urgency, llm_importance)
        priority = _score_to_priority(score)

        priority_group_map = {
            "Do First": "urgent-important",
            "Schedule": "not-urgent-important",
            "Delegate": "urgent-not-important",
            "Maybe/Later": "not-urgent-not-important"
        }
        priority_group = priority_group_map.get(priority, "not-urgent-not-important")

        results.append({
            "task": task_text,
            "priority": priority,
            "priorityGroup": priority_group,
            "score": score,
        })

    # Sort by score descending — highest priority tasks come first
    results.sort(key=lambda t: t["score"], reverse=True)

    # Assign a 1-based global rank so the user knows the overall order
    for position, task in enumerate(results, start=1):
        task["rank"] = position

    # Assign a 1-based rank WITHIN each priority category so the user
    # knows exactly which task to start with in each bucket.
    category_counters: dict[str, int] = {}
    for task in results:
        priority = task["priority"]
        category_counters[priority] = category_counters.get(priority, 0) + 1
        task["category_rank"] = category_counters[priority]

    return results
