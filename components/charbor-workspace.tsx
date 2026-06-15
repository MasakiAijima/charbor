"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Anchor,
  ArrowUp,
  Bot,
  Check,
  ChevronDown,
  CircleHelp,
  Globe2,
  Handshake,
  Inbox,
  Menu,
  MessageSquareMore,
  Plus,
  Search,
  Settings,
  Sparkles,
  Target,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getDemoData } from "@/lib/demo-data";
import { anchorDecision, updateSharedUnderstanding } from "@/lib/harborLog";
import { translations, type Translation } from "@/lib/i18n";
import { mediateMessage } from "@/lib/mediator";
import type {
  HarborLog,
  HarborLogItem,
  Locale,
  Message,
  MessageType,
  Topic,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const sectionMeta = {
  goal: { icon: Target, tone: "text-blue-700 bg-blue-50" },
  agreements: {
    icon: Handshake,
    tone: "text-emerald-700 bg-emerald-50",
  },
  disagreements: {
    icon: MessageSquareMore,
    tone: "text-amber-700 bg-amber-50",
  },
  openQuestions: {
    icon: CircleHelp,
    tone: "text-violet-700 bg-violet-50",
  },
  decisions: {
    icon: Check,
    tone: "text-slate-700 bg-slate-100",
  },
} as const;

type HarborSection = keyof typeof sectionMeta;

function formatTime(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Tokyo",
  }).format(new Date(value));
}

function MessageAvatar({ type }: { type: MessageType }) {
  if (type === "user_message") {
    return (
      <div className="grid size-8 shrink-0 place-items-center rounded-full bg-slate-900 text-xs font-semibold text-white">
        Y
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-full",
        type === "ai_translation"
          ? "bg-blue-50 text-blue-700"
          : "bg-violet-50 text-violet-700",
      )}
    >
      <Bot className="size-4" />
    </div>
  );
}

function MessageCard({
  message,
  onAnchor,
  locale,
  t,
}: {
  message: Message;
  onAnchor: (message: Message) => void;
  locale: Locale;
  t: Translation;
}) {
  const isTranslation = message.type === "ai_translation";
  const isRemote = message.type === "remote_ai_message";

  return (
    <article className="group flex gap-3">
      <MessageAvatar type={message.type} />
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900">
            {message.author}
          </span>
          {isTranslation && (
            <Badge className="bg-blue-50 text-blue-700">{t.mediated}</Badge>
          )}
          {isRemote && (
            <Badge className="bg-violet-50 text-violet-700">{t.received}</Badge>
          )}
          <span className="text-xs text-slate-400">
            {formatTime(message.createdAt, locale)}
          </span>
        </div>
        <div
          className={cn(
            "relative rounded-2xl border px-4 py-3.5 shadow-soft",
            isTranslation
              ? "border-blue-100 bg-blue-50/60"
              : isRemote
                ? "border-violet-100 bg-violet-50/40"
                : "border-slate-200 bg-white",
          )}
        >
          <p className="whitespace-pre-line text-[14px] leading-6 text-slate-700">
            {message.content}
          </p>
          <button
            type="button"
            onClick={() => onAnchor(message)}
            className={cn(
              "mt-3 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors",
              message.anchored
                ? "bg-slate-900 text-white"
                : "text-slate-400 hover:bg-white hover:text-slate-700",
            )}
          >
            {message.anchored ? (
              <Check className="size-3.5" />
            ) : (
              <Anchor className="size-3.5" />
            )}
            {message.anchored ? t.anchored : t.anchorToLog}
          </button>
        </div>
      </div>
    </article>
  );
}

function HarborSectionBlock({
  section,
  items,
  t,
}: {
  section: HarborSection;
  items: HarborLogItem[];
  t: Translation;
}) {
  const meta = sectionMeta[section];
  const Icon = meta.icon;

  return (
    <section>
      <div className="mb-2 flex items-center gap-2">
        <div className={cn("grid size-6 place-items-center rounded-md", meta.tone)}>
          <Icon className="size-3.5" />
        </div>
        <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
          {t[section]}
        </h3>
        <span className="text-xs text-slate-300">{items.length}</span>
      </div>
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-soft"
            >
              <p className="text-[13px] leading-5 text-slate-700">
                {item.content}
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-slate-400"
                    style={{ width: `${Math.round(item.confidence * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-400">
                  {Math.round(item.confidence * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-400">
          {t.nothingCaptured}
        </div>
      )}
    </section>
  );
}

export function CharborWorkspace() {
  const initialData = useMemo(() => getDemoData("en"), []);
  const [locale, setLocale] = useState<Locale>("en");
  const [topics, setTopics] = useState(initialData.topics);
  const [activeTopicId, setActiveTopicId] = useState(initialData.topics[0].id);
  const [messages, setMessages] = useState(initialData.messages);
  const [logs, setLogs] = useState<Record<string, HarborLog>>(
    initialData.harborLogs,
  );
  const [draft, setDraft] = useState("");
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<"topics" | "log" | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const t = translations[locale];

  useEffect(() => {
    const savedLocale = window.localStorage.getItem("charbor-locale");
    if (savedLocale === "ja") {
      changeLocale("ja");
    }
  }, []);

  useEffect(() => {
    if (!isSettingsOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsSettingsOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSettingsOpen]);

  const activeTopic =
    topics.find((topic) => topic.id === activeTopicId) ?? topics[0];
  const activeMessages = useMemo(
    () => messages.filter((message) => message.topicId === activeTopicId),
    [activeTopicId, messages],
  );
  const activeLog = logs[activeTopicId];
  const understandingItemCount = activeLog
    ? Object.values(activeLog).reduce(
        (count, value) => count + (Array.isArray(value) ? value.length : 0),
        0,
      )
    : 0;
  const unresolvedCount = activeLog
    ? activeLog.disagreements.length + activeLog.openQuestions.length
    : 0;
  const understandingHealth =
    understandingItemCount === 0
      ? {
          label: t.healthReady,
          progress: 18,
          description: t.healthEmpty,
        }
      : unresolvedCount > 2
        ? {
            label: t.healthNeedsFocus,
            progress: 52,
            description: t.healthUnresolved(unresolvedCount),
          }
        : {
            label: t.healthGood,
            progress: 78,
            description:
              unresolvedCount === 1
                ? t.healthOneRemaining
                : t.healthRemaining(unresolvedCount),
          };

  function changeLocale(nextLocale: Locale) {
    const nextData = getDemoData(nextLocale);
    setLocale(nextLocale);
    setTopics(nextData.topics);
    setMessages(nextData.messages);
    setLogs(nextData.harborLogs);
    setActiveTopicId(nextData.topics[0].id);
    setDraft("");
    setNewTopicTitle("");
    setIsCreatingTopic(false);
    setMobilePanel(null);
    window.localStorage.setItem("charbor-locale", nextLocale);
    document.documentElement.lang = nextLocale;
  }

  function switchTopic(topicId: string) {
    setActiveTopicId(topicId);
    setTopics((current) =>
      current.map((topic) =>
        topic.id === topicId ? { ...topic, unreadCount: 0 } : topic,
      ),
    );
    setMobilePanel(null);
  }

  function createTopic() {
    const title = newTopicTitle.trim();
    if (!title) return;

    const id = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
    const now = new Date().toISOString();
    const topic: Topic = {
      id,
      title,
      createdAt: now,
      latestUpdate: t.newConversation,
      unreadCount: 0,
    };
    const log: HarborLog = {
      topicId: id,
      goal: [],
      agreements: [],
      disagreements: [],
      openQuestions: [],
      decisions: [],
    };

    setTopics((current) => [...current, topic]);
    setLogs((current) => ({ ...current, [id]: log }));
    setActiveTopicId(id);
    setNewTopicTitle("");
    setIsCreatingTopic(false);
  }

  function sendMessage() {
    const content = draft.trim();
    if (!content || !activeLog) return;

    const now = new Date();
    const userMessage: Message = {
      id: `msg-${now.getTime()}`,
      topicId: activeTopicId,
      type: "user_message",
      author: t.you,
      content,
      createdAt: now.toISOString(),
    };
    const mediated = mediateMessage({
      userMessage: content,
      harborLog: activeLog,
      locale,
    });
    const aiMessage: Message = {
      id: `msg-${now.getTime()}-ai`,
      topicId: activeTopicId,
      type: "ai_translation",
      author: t.yourMediator,
      content: mediated.translatedMessage,
      createdAt: new Date(now.getTime() + 1000).toISOString(),
    };

    setMessages((current) => [...current, userMessage, aiMessage]);
    setLogs((current) => ({
      ...current,
      [activeTopicId]: updateSharedUnderstanding(
        current[activeTopicId],
        mediated,
        aiMessage.id,
      ),
    }));
    setTopics((current) =>
      current.map((topic) =>
        topic.id === activeTopicId
          ? { ...topic, latestUpdate: mediated.request }
          : topic,
      ),
    );
    setDraft("");
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function handleAnchor(message: Message) {
    if (message.anchored || !activeLog) return;

    setMessages((current) =>
      current.map((item) =>
        item.id === message.id ? { ...item, anchored: true } : item,
      ),
    );
    setLogs((current) => ({
      ...current,
      [activeTopicId]: anchorDecision(
        current[activeTopicId],
        message.content,
        message.id,
      ),
    }));
  }

  return (
    <main className="h-dvh overflow-hidden bg-slate-100 p-0 lg:p-3">
      <div className="mx-auto grid h-full min-h-0 max-w-[1600px] grid-cols-1 overflow-hidden border-slate-200 bg-white shadow-soft lg:grid-cols-[280px_minmax(480px,1fr)_360px] lg:rounded-2xl lg:border">
        <aside
          className={cn(
            "absolute inset-y-0 left-0 z-30 flex min-h-0 w-[280px] flex-col border-r border-slate-200 bg-slate-50 transition-transform lg:static lg:translate-x-0",
            mobilePanel === "topics" ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
            <div className="flex items-center gap-2.5">
              <div className="grid size-8 place-items-center rounded-lg bg-slate-950 text-white">
                <Anchor className="size-4" />
              </div>
              <span className="text-base font-semibold tracking-tight">Charbor</span>
            </div>
            <Button
              className="lg:hidden"
              variant="ghost"
              size="icon"
              onClick={() => setMobilePanel(null)}
              aria-label={t.closeTopics}
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="border-b border-slate-200 p-3">
            <button className="flex h-9 w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-left text-xs text-slate-400 shadow-sm">
              <Search className="size-3.5" />
              {t.searchConversations}
              <span className="ml-auto rounded border border-slate-200 px-1.5 py-0.5 text-[10px]">
                ⌘K
              </span>
            </button>
          </div>

          <div className="flex items-center justify-between px-4 pb-2 pt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
              {t.topics}
            </p>
            <button
              type="button"
              onClick={() => setIsCreatingTopic(true)}
              className="text-slate-400 transition-colors hover:text-slate-900"
              aria-label={t.createTopic}
            >
              <Plus className="size-4" />
            </button>
          </div>

          <nav className="scrollbar-subtle flex-1 space-y-1 overflow-y-auto px-2">
            {isCreatingTopic && (
              <div className="mb-2 rounded-xl border border-slate-200 bg-white p-2 shadow-soft">
                <input
                  autoFocus
                  value={newTopicTitle}
                  onChange={(event) => setNewTopicTitle(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") createTopic();
                    if (event.key === "Escape") setIsCreatingTopic(false);
                  }}
                  placeholder={t.topicName}
                  className="h-8 w-full rounded-md border border-slate-200 px-2 text-sm outline-none focus:ring-2 focus:ring-slate-200"
                />
                <div className="mt-2 flex gap-1">
                  <Button size="sm" onClick={createTopic}>{t.create}</Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsCreatingTopic(false)}
                  >
                    {t.cancel}
                  </Button>
                </div>
              </div>
            )}
            {topics.map((topic) => {
              const active = topic.id === activeTopicId;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => switchTopic(topic.id)}
                  className={cn(
                    "w-full rounded-xl px-3 py-3 text-left transition-colors",
                    active
                      ? "bg-white shadow-soft ring-1 ring-slate-200"
                      : "hover:bg-white/70",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "truncate text-sm font-medium",
                        active ? "text-slate-950" : "text-slate-700",
                      )}
                    >
                      {topic.title}
                    </span>
                    {topic.unreadCount > 0 && (
                      <span className="ml-auto grid min-w-5 place-items-center rounded-full bg-slate-900 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        {topic.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-400">
                    {topic.latestUpdate}
                  </p>
                </button>
              );
            })}
          </nav>

          <div className="border-t border-slate-200 p-3">
            <div className="flex items-center gap-3 rounded-xl px-2 py-2">
              <div className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-slate-700 to-slate-950 text-xs font-semibold text-white">
                YO
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-800">
                  {t.yourWorkspace}
                </p>
                <p className="text-[11px] text-slate-400">{t.participants}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="grid size-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-white hover:text-slate-900"
                aria-label={t.settings}
              >
                <Settings className="size-4" />
              </button>
            </div>
          </div>
        </aside>

        <section className="flex min-h-0 min-w-0 flex-col overflow-hidden bg-white">
          <header className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 px-4 sm:px-6">
            <Button
              className="lg:hidden"
              variant="ghost"
              size="icon"
              onClick={() => setMobilePanel("topics")}
              aria-label={t.openTopics}
            >
              <Menu className="size-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-sm font-semibold text-slate-950">
                  {activeTopic.title}
                </h1>
                <ChevronDown className="size-3.5 text-slate-400" />
              </div>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {t.conversationSubtitle}
              </p>
            </div>
            <div className="hidden items-center -space-x-2 sm:flex">
              <div className="grid size-7 place-items-center rounded-full border-2 border-white bg-slate-900 text-[9px] font-semibold text-white">
                YO
              </div>
              <div className="grid size-7 place-items-center rounded-full border-2 border-white bg-violet-100 text-[9px] font-semibold text-violet-700">
                MA
              </div>
            </div>
            <Button
              className="xl:hidden"
              variant="outline"
              size="sm"
              onClick={() => setMobilePanel("log")}
            >
              <Inbox className="size-3.5" />
              {t.harborLog}
            </Button>
          </header>

          <div className="scrollbar-subtle flex-1 overflow-y-auto">
            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
              {activeMessages.length > 0 ? (
                <div className="space-y-7">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-100" />
                    <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">
                      {t.today}
                    </span>
                    <div className="h-px flex-1 bg-slate-100" />
                  </div>
                  {activeMessages.map((message) => (
                    <MessageCard
                      key={message.id}
                      message={message}
                      onAnchor={handleAnchor}
                      locale={locale}
                      t={t}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <div className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                    <Sparkles className="size-5" />
                  </div>
                  <h2 className="mt-4 text-base font-semibold text-slate-900">
                    {t.startTitle}
                  </h2>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    {t.startDescription}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-4 sm:px-6">
            <div className="mx-auto max-w-3xl">
              <div className="relative">
                <Textarea
                  ref={inputRef}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={t.composerPlaceholder}
                  className="min-h-[92px] pb-11 pr-14 shadow-soft"
                />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Sparkles className="size-3.5 text-blue-600" />
                  {t.mediatorActive}
                </div>
                <Button
                  size="icon"
                  onClick={sendMessage}
                  disabled={!draft.trim()}
                  className="absolute bottom-3 right-3 size-8 rounded-lg"
                  aria-label={t.sendMessage}
                >
                  <ArrowUp className="size-4" />
                </Button>
              </div>
              <p className="mt-2 text-center text-[10px] text-slate-400">
                {t.composerHint}
              </p>
            </div>
          </div>
        </section>

        <aside
          className={cn(
            "absolute inset-y-0 right-0 z-30 flex min-h-0 w-[360px] max-w-full flex-col border-l border-slate-200 bg-slate-50 transition-transform xl:static xl:translate-x-0",
            mobilePanel === "log" ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 px-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-slate-950">
                  {t.harborLog}
                </h2>
                <span className="size-1.5 rounded-full bg-emerald-500" />
              </div>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {t.sharedUnderstanding}
              </p>
            </div>
            <Button
              className="xl:hidden"
              variant="ghost"
              size="icon"
              onClick={() => setMobilePanel(null)}
              aria-label={t.closeHarborLog}
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="scrollbar-subtle flex-1 overflow-y-auto px-4 py-5">
            {activeLog ? (
              <div className="space-y-6">
                {(Object.keys(sectionMeta) as HarborSection[]).map((section) => (
                  <HarborSectionBlock
                    key={section}
                    section={section}
                    items={activeLog[section]}
                    t={t}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div className="border-t border-slate-200 p-4">
            <div className="rounded-xl bg-slate-900 p-3.5 text-white">
              <div className="flex items-center gap-2 text-xs font-medium">
                <Sparkles className="size-3.5 text-blue-300" />
                {t.understandingHealth}
                <span className="ml-auto text-blue-200">
                  {understandingHealth.label}
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-blue-400"
                  style={{ width: `${understandingHealth.progress}%` }}
                />
              </div>
              <p className="mt-2 text-[10px] leading-4 text-slate-400">
                {understandingHealth.description}
              </p>
            </div>
          </div>
        </aside>

        {mobilePanel && (
          <button
            className="absolute inset-0 z-20 bg-slate-950/20 backdrop-blur-[1px] lg:hidden xl:hidden"
            onClick={() => setMobilePanel(null)}
            aria-label={t.closePanel}
          />
        )}
      </div>

      {isSettingsOpen && (
        <div
          className="absolute inset-0 z-50 grid place-items-center bg-slate-950/35 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setIsSettingsOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="grid size-8 place-items-center rounded-lg bg-slate-100 text-slate-700">
                    <Settings className="size-4" />
                  </div>
                  <h2
                    id="settings-title"
                    className="text-base font-semibold text-slate-950"
                  >
                    {t.settings}
                  </h2>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {t.settingsDescription}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSettingsOpen(false)}
                aria-label={t.closeSettings}
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <Globe2 className="size-4 text-slate-500" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {t.language}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {t.languageDescription}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {(["en", "ja"] as Locale[]).map((option) => {
                  const selected = locale === option;
                  const label = option === "en" ? t.english : t.japanese;

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => changeLocale(option)}
                      className={cn(
                        "rounded-xl border p-3 text-left transition-colors",
                        selected
                          ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                      )}
                      aria-pressed={selected}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {option === "en" ? "English" : "日本語"}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">{label}</p>
                        </div>
                        <div
                          className={cn(
                            "grid size-5 place-items-center rounded-full border",
                            selected
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-slate-300 text-transparent",
                          )}
                        >
                          <Check className="size-3" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
