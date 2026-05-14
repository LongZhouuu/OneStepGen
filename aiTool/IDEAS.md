# 💡 Feature Ideas for ADHD Productivity Tool

This document contains simple, high-value ideas to improve the tool. They are designed to be easy to build, easy to connect to the frontend, and specifically target ADHD pain points.

---

## 💡 Idea 1: "Energy Level" Matching (Spoon Theory)

ADHD energy levels fluctuate wildly. If a user is having a low-energy day, seeing a list of high-cognitive tasks causes "task paralysis".

- **The Feature:** Allow the user to state their current energy level (Low, Medium, High). The AI rates how much "brain power" each task takes and the frontend highlights the ones that match their current energy.
- **Why it's valuable:** It shows a deep empathy for neurodivergent users by acknowledging that not all tasks require the same type of effort.

### The "Step vs Task" Problem

Because the AI breaks tasks down into 2-5 minute steps, filtering out tasks purely by step-level energy can be confusing. For instance, "Open the assignment document" is low energy, but the immediate next step ("Write the introduction") is high energy. If a user only has low energy, they will get stuck on step 2.

Here are two ways to build this feature to avoid that trap:

#### Fix 1: The "Parent Task" Context

Instead of rating the cognitive load of the _step_, instruct the LLM to rate the overall **parent task**.

**1. Backend Changes (`ai_processor.py`)**
Change the prompt to ask for the parent task's cognitive load:

```python
# In SYSTEM_PROMPT add:
# "For EACH step, identify its 'parent_task_cognitive_load' (1=mindless/easy, 5=requires deep focus)."
```

**2. Frontend Integration**
When the user selects "Low Energy", completely hide any steps that belong to a high-cognitive-load parent task. Only show them standalone, easy tasks (like "Sign for pizza").

#### Fix 2: "Icebreaker Mode" (The 5-Minute Rule)

This embraces the fact that the first step is low energy, but changes the messaging to reduce anxiety.

**1. Backend Changes**
No prompt changes needed!

**2. Frontend Integration**
If the user selects "Low Energy", don't hide tasks. Instead, highlight the very first 2-minute step of a big task and add an **"Icebreaker"** label.
Show messaging like: _"You have low energy today. You don't have to finish the essay. Just do this one 2-minute step to break the ice: Open the document. Then you can stop."_

---

## 💡 Idea 2: Gamified "Dopamine Points" (XP)

ADHD brains are dopamine-starved. Instant gratification helps build momentum.

- **The Feature:** Assign an "XP" or point value to each task based on how difficult/important it is. Checking it off gives them points.
- **Why it's valuable:** It provides immediate positive reinforcement, making the act of completing tasks intrinsically rewarding.

### How to Build It

**1. Backend Changes (`scoring.py` & `main.py`)**
This requires **zero changes to the AI prompt**. Just calculate the points in `scoring.py`.

```python
# inside scoring.py
def assign_priorities(tasks: list[dict]) -> list[dict]:
    # ... inside your loop ...

    # Calculate XP (example formula)
    xp_points = (urg * 10) + (imp * 15)

    results.append({
        "task": task_text,
        "priority": priority,
        "priorityGroup": priority_group,
        "score": score,
        "xp": xp_points  # <-- Add this!
    })
```

Add `xp: int = 0` to your `TaskOutput` model in `main.py`.

**2. Frontend Integration**
Read `task.xp` and display a cool pill badge like `+65 XP` next to the task text. When the user clicks the checkbox, play a tiny "ding" sound and show a quick CSS animation of the XP floating upwards.

---

## 💡 Idea 3: "Time Blindness" Estimator

A core ADHD trait is time blindness—a 15-minute task might feel like it takes 3 hours in the user's head, causing them to avoid it.

- **The Feature:** Calculate and display the estimated time to complete a priority bucket.
- **Why it's valuable:** It grounds the user in reality. Seeing "This entire list will only take 20 minutes" immediately reduces anxiety.

### How to Build It

**1. Backend Changes (`scoring.py` & `main.py`)**
Since your prompt already tells the LLM to break things into "2–5 minute steps", you can safely assume each task takes ~5 minutes. No prompt changes needed!

```python
# inside scoring.py
def assign_priorities(tasks: list[dict]) -> list[dict]:
    # ... inside your loop ...

    results.append({
        "task": task_text,
        "priority": priority,
        "priorityGroup": priority_group,
        "score": score,
        "estimated_mins": 5  # <-- Add this!
    })
```

Add `estimated_mins: int = 0` to your `TaskOutput` model in `main.py`.

**2. Frontend Integration**
On the frontend, sum up the `estimated_mins` for all tasks in the "Do First" column. Display a comforting message at the top of the column:

> _"You have 4 tasks here. This will only take about 20 minutes total!"_

<!-- CHECKPOINT id="ckpt_mp2gnwdn_e4ahp6" time="2026-05-12T10:01:29.771Z" note="auto" fixes=0 questions=0 highlights=0 sections="" -->

<!-- CHECKPOINT id="ckpt_mp2h0rc5_lg5ld6" time="2026-05-12T10:11:29.765Z" note="auto" fixes=0 questions=0 highlights=0 sections="" -->
