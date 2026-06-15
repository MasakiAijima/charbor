import type { HarborLog, Locale, MediatedMessage } from "@/lib/types";

interface MediateMessageInput {
  userMessage: string;
  harborLog: HarborLog;
  locale?: Locale;
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
  locale = "en",
}: MediateMessageInput): MediatedMessage {
  if (locale === "ja") {
    const observation = userMessage
      .trim()
      .replace(/[。！？!?]+$/g, "")
      .replace(/いつも|絶対に|普通は/g, "");
    const interpretation =
      "この状況により、進行の見通しが立てにくくなっている可能性があります。";
    const request =
      "次の具体的な一歩と担当者を一緒に確認できますか？";
    const knownGoal =
      harborLog.goal[0]?.content ?? "対話を明確な成果につなげること";

    return {
      observation: `${observation}。`,
      interpretation,
      request,
      translatedMessage: `観察: ${observation}。\n解釈: ${interpretation}\n依頼: ${request}\n\n共通の意図: ${knownGoal.replace(/[。]+$/g, "")}。`,
    };
  }

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
