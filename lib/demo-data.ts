import type { HarborLog, Message, Topic } from "@/lib/types";

export const topics: Topic[] = [
  {
    id: "launch-scope",
    title: "Launch scope",
    createdAt: "2026-06-10T09:00:00.000Z",
    latestUpdate: "Can we define a stable scope?",
    unreadCount: 2,
  },
  {
    id: "design-handoff",
    title: "Design handoff",
    createdAt: "2026-06-11T02:00:00.000Z",
    latestUpdate: "Waiting on final review",
    unreadCount: 0,
  },
  {
    id: "customer-pilot",
    title: "Customer pilot",
    createdAt: "2026-06-12T06:00:00.000Z",
    latestUpdate: "Three teams confirmed",
    unreadCount: 4,
  },
];

export const messages: Message[] = [
  {
    id: "msg-1",
    topicId: "launch-scope",
    type: "remote_ai_message",
    author: "Maya's mediator",
    content:
      "Maya would like clarity on which capabilities are essential for the pilot. She is concerned that adding more work now could make the launch date less reliable.",
    createdAt: "2026-06-14T04:18:00.000Z",
  },
  {
    id: "msg-2",
    topicId: "launch-scope",
    type: "user_message",
    author: "You",
    content: "The requirements keep changing and we are falling behind.",
    createdAt: "2026-06-14T04:22:00.000Z",
  },
  {
    id: "msg-3",
    topicId: "launch-scope",
    type: "ai_translation",
    author: "Your mediator",
    content:
      "Observation: Requirements have changed multiple times.\nInterpretation: This may be affecting delivery timelines.\nRequest: Can we define a stable scope for the next milestone?",
    createdAt: "2026-06-14T04:22:20.000Z",
  },
  {
    id: "msg-4",
    topicId: "launch-scope",
    type: "remote_ai_message",
    author: "Maya's mediator",
    content:
      "Maya agrees that a stable milestone would help. She proposes limiting the pilot to the core onboarding and reporting flows, with integrations moved to the next phase.",
    createdAt: "2026-06-14T04:27:00.000Z",
  },
  {
    id: "msg-5",
    topicId: "design-handoff",
    type: "remote_ai_message",
    author: "Maya's mediator",
    content:
      "Maya has completed the primary screens and would like a final review of the empty states before handoff.",
    createdAt: "2026-06-13T07:30:00.000Z",
  },
  {
    id: "msg-6",
    topicId: "customer-pilot",
    type: "remote_ai_message",
    author: "Maya's mediator",
    content:
      "Three pilot teams have confirmed participation. The remaining question is whether support onboarding can happen in the same week.",
    createdAt: "2026-06-13T09:45:00.000Z",
  },
];

export const harborLogs: Record<string, HarborLog> = {
  "launch-scope": {
    topicId: "launch-scope",
    goal: [
      {
        id: "goal-1",
        content: "Deliver the project successfully.",
        confidence: 0.96,
      },
    ],
    agreements: [
      {
        id: "agreement-1",
        content: "Requirements have changed.",
        confidence: 0.91,
      },
      {
        id: "agreement-2",
        content: "A stable milestone would improve delivery confidence.",
        confidence: 0.87,
      },
    ],
    disagreements: [
      {
        id: "disagreement-1",
        content: "Which capabilities are essential for the pilot.",
        confidence: 0.68,
      },
    ],
    openQuestions: [
      {
        id: "question-1",
        content: "How should scope be stabilized?",
        confidence: 0.84,
      },
    ],
    decisions: [],
  },
  "design-handoff": {
    topicId: "design-handoff",
    goal: [
      {
        id: "goal-design",
        content: "Complete a clear, implementation-ready design handoff.",
        confidence: 0.94,
      },
    ],
    agreements: [],
    disagreements: [],
    openQuestions: [
      {
        id: "question-design",
        content: "Are the empty states ready for final approval?",
        confidence: 0.82,
      },
    ],
    decisions: [],
  },
  "customer-pilot": {
    topicId: "customer-pilot",
    goal: [
      {
        id: "goal-pilot",
        content: "Run a focused pilot with three customer teams.",
        confidence: 0.97,
      },
    ],
    agreements: [
      {
        id: "agreement-pilot",
        content: "Three teams are ready to participate.",
        confidence: 0.98,
      },
    ],
    disagreements: [],
    openQuestions: [
      {
        id: "question-pilot",
        content: "When should support onboarding happen?",
        confidence: 0.76,
      },
    ],
    decisions: [],
  },
};
