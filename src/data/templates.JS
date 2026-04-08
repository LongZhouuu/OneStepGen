const templatesData = [
  {
    id: "email",
    title: "Email",
    subcategories: ["Clarification", "Follow-up", "Request"],
    items: [
      // ===== Clarification =====
      {
        id: 1,
        subcategory: "Clarification",
        title: "Clarify task requirements",
        description: "Ask for more details about a task",
        content: `Hi [Name],

I would like to clarify the requirements for [task].

Could you confirm:
- [Point 1]
- [Point 2]

Thank you,
[Your Name]`,
        exportFormats: ["doc"]
      },
      {
        id: 2,
        subcategory: "Clarification",
        title: "Clarify deadline",
        description: "Confirm when something is due",
        content: `Hi [Name],

Just checking — when is the deadline for [task]?

Thanks,
[Your Name]`,
        exportFormats: ["doc"]
      },

      // ===== Follow-up =====
      {
        id: 3,
        subcategory: "Follow-up",
        title: "Follow-up on request",
        description: "Check status of previous request",
        content: `Hi [Name],

Just following up on my previous message regarding [topic].

Please let me know if there are any updates.

Thanks,
[Your Name]`,
        exportFormats: ["doc"]
      },
      {
        id: 4,
        subcategory: "Follow-up",
        title: "Second follow-up",
        description: "Polite second reminder",
        content: `Hi [Name],

I just wanted to follow up again on [topic].

Please let me know if you need anything from me.

Best regards,
[Your Name]`,
        exportFormats: ["doc"]
      },

      // ===== Request =====
      {
        id: 5,
        subcategory: "Request",
        title: "Request support",
        description: "Ask for help",
        content: `Hi [Name],

I would like to request support with [task].

Please let me know if you are available to help.

Thank you,
[Your Name]`,
        exportFormats: ["doc"]
      },
      {
        id: 6,
        subcategory: "Request",
        title: "Request deadline extension",
        description: "Ask for more time",
        content: `Hi [Name],

I would like to request an extension for [task].

I need additional time to complete it properly.

Thank you for your understanding.

Best regards,
[Your Name]`,
        exportFormats: ["doc"]
      }
    ]
  },

  {
    id: "meeting",
    title: "Meeting",
    subcategories: ["Agenda", "Notes"],
    items: [
      {
        id: 7,
        subcategory: "Agenda",
        title: "Weekly meeting agenda",
        description: "Basic team meeting structure",
        content: `Meeting Title:
Date:

Agenda:
1. Updates
2. Current tasks
3. Blockers
4. Next steps`,
        exportFormats: ["doc"]
      },
      {
        id: 8,
        subcategory: "Agenda",
        title: "Project meeting agenda",
        description: "For project discussions",
        content: `Project:
Date:

Topics:
- Progress update
- Issues
- Decisions

Action items:`,
        exportFormats: ["doc"]
      },
      {
        id: 9,
        subcategory: "Notes",
        title: "Simple meeting notes",
        description: "Capture key information",
        content: `Meeting Notes

Date:
Participants:

Discussion:
-  

Actions:
-  

Next steps:`,
        exportFormats: ["doc"]
      },
      {
        id: 10,
        subcategory: "Notes",
        title: "Detailed meeting notes",
        description: "Structured notes",
        content: `Meeting Notes

Date:
Participants:

Summary:
-  

Decisions:
-  

Action items:
-  

Deadline:`,
        exportFormats: ["doc"]
      }
    ]
  },

  {
    id: "planning",
    title: "Planning",
    subcategories: ["Daily", "Weekly"],
    items: [
      {
        id: 11,
        subcategory: "Daily",
        title: "Daily planner (simple)",
        description: "Basic daily plan",
        content: `Top 3 priorities:
1.
2.
3.

Tasks:
-  

Notes:`,
        exportFormats: ["txt"]
      },
      {
        id: 12,
        subcategory: "Daily",
        title: "Daily planner with time blocks",
        description: "Plan your day by time",
        content: `Morning:
-  

Afternoon:
-  

Evening:
-  

Notes:`,
        exportFormats: ["txt"]
      },
      {
        id: 13,
        subcategory: "Weekly",
        title: "Weekly planner",
        description: "Plan your week",
        content: `Week:

Goals:
1.
2.

Tasks:
Monday:
Tuesday:
Wednesday:
Thursday:
Friday:`,
        exportFormats: ["doc"]
      },
      {
        id: 14,
        subcategory: "Weekly",
        title: "Weekly reflection",
        description: "Review your week",
        content: `What went well:
-  

What can improve:
-  

Next week focus:
-`,
        exportFormats: ["doc"]
      }
    ]
  }
];

export default templatesData;