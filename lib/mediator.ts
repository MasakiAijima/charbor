import type { HarborLog, MediatedMessage } from "@/lib/types";

interface MediateMessageInput {
  userMessage: string;
  harborLog: HarborLog;
}

const blamePhrases: Array<[RegExp, string]> = [
  [
    /you never give us enough time to review changes/gi,
    "Review time for changes has often been shorter than needed",
  ],
  [/you never/gi, "This has not consistently"],
  [/you always/gi, "This has often"],
  [/your fault/gi, "a contributing factor"],
  [/incompetent/gi, "not meeting the expected outcome"],
  [/ridiculous/gi, "difficult to understand"],
];

function neutralizeLanguage(message: string) {
  return blamePhrases.reduce(
    (result, [pattern, replacement]) => result.replace(pattern, replacement),
    message.trim(),
  );
}

function asSentence(value: string) {
  const withoutTrailingPunctuation = value.replace(/[.!?]+$/g, "");
  return `${withoutTrailingPunctuation}.`;
}

export function mediateMessage({
  userMessage,
  harborLog,
}: MediateMessageInput): MediatedMessage {
  const neutralMessage = neutralizeLanguage(userMessage);
  const knownGoal =
    harborLog.goal[0]?.content ?? "move the conversation toward a clear outcome";

  const observation = asSentence(
    neutralMessage.replace(
      /\b(I think|I feel like|obviously|clearly)\b[:,]?\s*/gi,
      "",
    ),
  );

  const interpretation =
    "This may be creating uncertainty and making progress harder to predict.";

  const request =
    "Could we identify one concrete next step and confirm who will own it?";

  return {
    observation,
    interpretation,
    request,
    translatedMessage: `Observation: ${observation}\nInterpretation: ${interpretation}\nRequest: ${request}\n\nShared intent: ${asSentence(knownGoal)}`,
  };
}
