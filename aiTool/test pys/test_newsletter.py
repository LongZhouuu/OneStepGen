"""
Test with ACS Newsletter text — full pipeline: text → Groq → scoring → priorities.
"""
from utils.ai_processor import extract_tasks_from_text
from utils.scoring import assign_priorities

NEWSLETTER_TEXT = """
Dear Members,

April has been a significant and constructive month for ACS, combining important governance progress, strong engagement with educators and partners, and a continued focus on positioning the Society for the future.

At its heart, ACS exists for one reason: community. Community is why we exist - a place to find your people, to belong, and to support one another through every stage of a technology career. Whether that support is technical, professional or personal, ACS at its best is members supporting members, especially through periods of change and uncertainty.

With April also marking the school holiday period in many parts of the country, I hope those of you with children were able to step away from work, even briefly, and spend some quality time together. I was fortunate to do exactly that. One of my children shares my love of computer games, which meant I spent more than a few hours reliving parts of my own childhood through some classic titles whilst discovering that my reaction times are not what they used to be. Those moments are a good reminder of why balance, connection, and family matter - and why the technology we work in every day should ultimately serve people and relationships.

The Management Committee met in Hobart alongside the EdCAT 2026 Conference, with discussions focused on maintaining stability, strengthening foundations and ensuring ACS remains firmly focused on delivering value for members. Work continues on simplifying governance, ensuring continuity in key roles, and supporting clearer, more contemporary membership pathways that better reflect how technology careers now evolve. These decisions are deliberately practical, aimed at keeping ACS modern, relevant and easier to engage with.

There has also been some change within the Management Committee during this period. Helen McHugh has stepped away from her role, and I thank her sincerely for her support and contribution during a time of significant transition. These changes are being managed carefully to ensure continuity and minimise disruption, allowing ACS to stay focused on members and future readiness.

EdCAT 2026 in Hobart was a real highlight. The conference once again demonstrated the power of community - bringing educators, industry, students and government together as a single system. The pace of technological change does not respect boundaries, and collaboration like this is essential if Australia is to build the skills, capability and confidence needed for the future. Conversations throughout the week reinforced how deeply digital capability now underpins every sector of the economy, and why long-term outcomes require long-term thinking.

I would like to personally acknowledge and sincerely thank Ashton Wood of DV Safe Phone and Jack Growden of LiteHaus International. I genuinely appreciate the leadership they show and their commitment to using technology as a force for good.

Through DV Safe Phone, Ashton and team refurbish and distribute mobile phones to support people experiencing domestic and family violence, helping ensure access to safe and secure communication when it matters most.

Through LiteHaus International, Jack and team bridge the digital divide by repurposing end-of-life devices to build digital learning environments in schools and to provide laptops and computers directly to students who would otherwise go without access. Their work includes establishing digital labs in schools across Australia and the Asia-Pacific, and providing free devices to students from regional, remote, and under-resourced communities so that access to education and opportunity is not limited by access to technology.

I have had the opportunity to engage with both organisations and see the impact firsthand, and it reinforces why it is important for ACS to continue to partner with and support charities and community organisations. As a professional society, supporting one another and the broader community is part of who we are.

Looking ahead, ACS is experiencing significant change which is likely to remain a constant. Our focus is on adapting deliberately and confidently, while staying grounded in our purpose. The forthcoming Federal Budget will shape national priorities around skills, productivity, and digital capability, and ACS must be ready to engage constructively and advocate for outcomes that support both our members and the broader profession.

At the same time, we remain deeply connected to our history. Planning for ACS's 60th anniversary is well underway across all Branches, and it is encouraging to see the energy and pride being invested in celebrating our legacy. Celebrating our rich history is not about looking backwards - it is about recognising what can be achieved when a community comes together and using that foundation to build what comes next.

Change will continue, but our commitment remains steadfast: supporting our members, advancing the technology profession, and continuing the work of the organisation, and ensuring ACS remains a place where people belong. ACS has continued to evolve over its 60-year history, and each time ACS, like technology, has emerged bolder and stronger. I am confident this period will be no different and I look forward to exploring the opportunities ahead.

Thank you for being part of this community, for supporting one another, finding your people, and continuing to shape what ACS stands for.
"""

print(f"📝 Input text: {len(NEWSLETTER_TEXT)} characters\n")

# Step 1 — Send to LLM
print("🔄 Sending to Groq API (Llama 3)...")
tasks = extract_tasks_from_text(NEWSLETTER_TEXT)

if not tasks:
    print("❌ No tasks returned — check the API key or network.")
else:
    print(f"✅ Got {len(tasks)} tasks from the LLM\n")

    # Show raw LLM output (before scoring)
    print("── Raw LLM output (task + urgency + importance) ──")
    for i, t in enumerate(tasks, 1):
        print(f"  {i:2d}. [{t['urgency']}/{t['importance']}]  {t['task']}")
    print()

    # Step 2 — Score and assign priorities
    print("🔄 Running semantic scoring model...\n")
    prioritised = assign_priorities(tasks)

    # Group by priority
    buckets = {"Do First": [], "Schedule": [], "Delegate": [], "Maybe/Later": []}
    for t in prioritised:
        buckets[t["priority"]].append(t)

    for label, items in buckets.items():
        if items:
            icon = {"Do First": "🔴", "Schedule": "🟡", "Delegate": "🟢", "Maybe/Later": "⚪"}[label]
            print(f"{icon} {label}  ({len(items)} tasks)")
            print(f"  {'─' * 55}")
            for t in items:
                print(f"  • {t['task']}  (score: {t['score']})")
            print()
