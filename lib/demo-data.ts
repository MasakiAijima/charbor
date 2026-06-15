import type { HarborLog, Locale, Message, Topic } from "@/lib/types";

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

const japaneseTopics: Topic[] = [
  {
    id: "release-scope-ja",
    title: "リリース範囲",
    createdAt: "2026-06-10T09:00:00.000Z",
    latestUpdate: "次のマイルストーンの範囲を固定できますか？",
    unreadCount: 2,
  },
  {
    id: "design-review-ja",
    title: "デザインレビュー",
    createdAt: "2026-06-11T02:00:00.000Z",
    latestUpdate: "空状態の最終確認待ち",
    unreadCount: 0,
  },
  {
    id: "customer-pilot-ja",
    title: "顧客パイロット",
    createdAt: "2026-06-12T06:00:00.000Z",
    latestUpdate: "3チームの参加が確定",
    unreadCount: 3,
  },
];

const japaneseMessages: Message[] = [
  {
    id: "msg-ja-1",
    topicId: "release-scope-ja",
    type: "remote_ai_message",
    author: "MayaのAI仲介者",
    content:
      "Mayaは、パイロットに必要な機能を明確にしたいと考えています。現時点で作業を追加すると、リリース日の確実性が下がることを懸念しています。",
    createdAt: "2026-06-14T04:18:00.000Z",
  },
  {
    id: "msg-ja-2",
    topicId: "release-scope-ja",
    type: "user_message",
    author: "あなた",
    content: "要件が何度も変わっていて、このままでは予定に間に合いません。",
    createdAt: "2026-06-14T04:22:00.000Z",
  },
  {
    id: "msg-ja-3",
    topicId: "release-scope-ja",
    type: "ai_translation",
    author: "あなたのAI仲介者",
    content:
      "観察: 要件が複数回変更されています。\n解釈: 変更が納期の見通しに影響している可能性があります。\n依頼: 次のマイルストーンに向けて、安定した範囲を定義できますか？",
    createdAt: "2026-06-14T04:22:20.000Z",
  },
  {
    id: "msg-ja-4",
    topicId: "release-scope-ja",
    type: "remote_ai_message",
    author: "MayaのAI仲介者",
    content:
      "Mayaも、安定したマイルストーンが必要だと考えています。パイロットはオンボーディングとレポート機能に絞り、外部連携は次の段階へ移すことを提案しています。",
    createdAt: "2026-06-14T04:27:00.000Z",
  },
  {
    id: "msg-ja-5",
    topicId: "design-review-ja",
    type: "remote_ai_message",
    author: "MayaのAI仲介者",
    content:
      "主要画面のデザインは完了しています。実装へ渡す前に、空状態の表現を最終確認したいと考えています。",
    createdAt: "2026-06-13T07:30:00.000Z",
  },
  {
    id: "msg-ja-6",
    topicId: "customer-pilot-ja",
    type: "remote_ai_message",
    author: "MayaのAI仲介者",
    content:
      "3つの顧客チームがパイロット参加を確定しました。サポート向けオンボーディングを同じ週に実施できるかが未解決です。",
    createdAt: "2026-06-13T09:45:00.000Z",
  },
];

const japaneseHarborLogs: Record<string, HarborLog> = {
  "release-scope-ja": {
    topicId: "release-scope-ja",
    goal: [
      {
        id: "goal-ja-1",
        content: "プロジェクトを成功させる。",
        confidence: 0.96,
      },
    ],
    agreements: [
      {
        id: "agreement-ja-1",
        content: "要件が複数回変更されている。",
        confidence: 0.91,
      },
      {
        id: "agreement-ja-2",
        content: "安定したマイルストーンが納期への信頼を高める。",
        confidence: 0.87,
      },
    ],
    disagreements: [
      {
        id: "disagreement-ja-1",
        content: "パイロットに必須とする機能の範囲。",
        confidence: 0.68,
      },
    ],
    openQuestions: [
      {
        id: "question-ja-1",
        content: "どのようにスコープを安定させるか？",
        confidence: 0.84,
      },
    ],
    decisions: [],
  },
  "design-review-ja": {
    topicId: "design-review-ja",
    goal: [
      {
        id: "goal-design-ja",
        content: "実装可能な状態でデザインを引き渡す。",
        confidence: 0.94,
      },
    ],
    agreements: [],
    disagreements: [],
    openQuestions: [
      {
        id: "question-design-ja",
        content: "空状態のデザインは最終承認できるか？",
        confidence: 0.82,
      },
    ],
    decisions: [],
  },
  "customer-pilot-ja": {
    topicId: "customer-pilot-ja",
    goal: [
      {
        id: "goal-pilot-ja",
        content: "3つの顧客チームで集中したパイロットを実施する。",
        confidence: 0.97,
      },
    ],
    agreements: [
      {
        id: "agreement-pilot-ja",
        content: "3チームが参加準備を完了している。",
        confidence: 0.98,
      },
    ],
    disagreements: [],
    openQuestions: [
      {
        id: "question-pilot-ja",
        content: "サポート向けオンボーディングをいつ実施するか？",
        confidence: 0.76,
      },
    ],
    decisions: [],
  },
};

export function getDemoData(locale: Locale) {
  if (locale === "ja") {
    return {
      topics: structuredClone(japaneseTopics),
      messages: structuredClone(japaneseMessages),
      harborLogs: structuredClone(japaneseHarborLogs),
    };
  }

  return {
    topics: structuredClone(topics),
    messages: structuredClone(messages),
    harborLogs: structuredClone(harborLogs),
  };
}
