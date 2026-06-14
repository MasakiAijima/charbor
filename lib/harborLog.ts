import type { HarborLog, HarborLogItem, MediatedMessage } from "@/lib/types";

function makeItem(
  content: string,
  confidence: number,
  sourceMessageId?: string,
): HarborLogItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    content,
    confidence,
    sourceMessageId,
  };
}

export function updateSharedUnderstanding(
  previous: HarborLog,
  mediated: MediatedMessage,
  sourceMessageId?: string,
): HarborLog {
  const next = structuredClone(previous);

  if (mediated.request) {
    next.openQuestions = [
      ...next.openQuestions,
      makeItem(mediated.request, 0.72, sourceMessageId),
    ];
  }

  if (
    /\b(agree|aligned|confirm|shared|both)\b/i.test(mediated.translatedMessage)
  ) {
    next.agreements = [
      ...next.agreements,
      makeItem(mediated.observation, 0.78, sourceMessageId),
    ];
  }

  if (/\b(disagree|conflict|different|concern|uncertainty)\b/i.test(mediated.interpretation)) {
    next.disagreements = [
      ...next.disagreements,
      makeItem(mediated.interpretation, 0.62, sourceMessageId),
    ];
  }

  return next;
}

export function anchorDecision(
  previous: HarborLog,
  content: string,
  sourceMessageId: string,
): HarborLog {
  if (previous.decisions.some((item) => item.sourceMessageId === sourceMessageId)) {
    return previous;
  }

  return {
    ...previous,
    decisions: [
      ...previous.decisions,
      makeItem(content, 0.95, sourceMessageId),
    ],
  };
}
