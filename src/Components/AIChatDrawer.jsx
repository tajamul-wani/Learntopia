import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useSound } from "../context/SoundContext";
import { sendMessageToGemini, buildSystemPrompt } from "../services/geminiService";
import Icon from "./ui/Icon";
import BotAvatar from "./BotAvatar";
import { tutorFor } from "../config/tutor";

/**
 * AIChatDrawer — Premium Slide-out AI Tutor Drawer
 */
const AIChatDrawer = ({ isOpen, onClose, course, currentModule }) => {
  const { t } = useLanguage();
  const { playClick } = useSound();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Leo everywhere; the course is what makes the answers specific.
  const tutor = tutorFor(t);
  const systemPrompt = course ? buildSystemPrompt(tutor, course, currentModule) : "";

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = t("aiTutor.chatGreeting", { name: tutor.name, subject: course?.category || "" });
      setMessages([{ role: "model", text: greeting }]);
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = useCallback(async (customText) => {
    const textToSend = typeof customText === "string" ? customText : input;
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    playClick();
    setError(null);
    const userMsg = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const historyForAPI = messages
        .slice(1) // Skip greeting
        .map((m) => ({ role: m.role, text: m.text }));

      const response = await sendMessageToGemini(historyForAPI, trimmed, systemPrompt);
      setMessages((prev) => [...prev, { role: "model", text: response }]);
    } catch (err) {
      // Only ever show a translated message. Raw errors carry API and config
      // detail that a learner should not see; it goes to the console instead.
      if (err?.message === "RATE_LIMIT") {
        setError(t("aiTutor.rateLimitError"));
      } else if (err?.message === "NOT_CONFIGURED") {
        setError(t("aiTutor.unavailable"));
      } else {
        setError(t("aiTutor.errorMessage"));
      }
      console.error("AI Tutor error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, systemPrompt, playClick, t]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    playClick();
    const greeting = t("aiTutor.chatGreeting", { name: tutor.name, subject: course?.category || "" });
    setMessages([{ role: "model", text: greeting }]);
    setError(null);
  };

  // Render text with code blocks, bolding, and inline code formatting
  const renderMessageText = (text) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const code = part.slice(3, -3).replace(/^\w+\n/, "");
        return (
          <pre
            key={i}
            className="my-3 overflow-x-auto rounded-xl clay-inset p-3.5 text-xs font-mono leading-relaxed text-state-success border border-state-success/20"
          >
            <code>{code.trim()}</code>
          </pre>
        );
      }
      const inlineParts = part.split(/(`[^`]+`)/g);
      return (
        <span key={i}>
          {inlineParts.map((ip, j) => {
            if (ip.startsWith("`") && ip.endsWith("`")) {
              return (
                <code
                  key={j}
                  className="rounded-md bg-violet-500/20 px-1.5 py-0.5 text-xs font-mono font-semibold text-violet-300 border border-violet-500/30"
                >
                  {ip.slice(1, -1)}
                </code>
              );
            }
            const boldParts = ip.split(/(\*\*[^*]+\*\*)/g);
            return boldParts.map((bp, k) => {
              if (bp.startsWith("**") && bp.endsWith("**")) {
                return (
                  <strong key={`${j}-${k}`} className="font-extrabold text-white">
                    {bp.slice(2, -2)}
                  </strong>
                );
              }
              return bp;
            });
          })}
        </span>
      );
    });
  };

  // Quick helper suggestion prompts
  const suggestionChips = [
    "Summarize this topic simply!",
    "Give me a fun example!",
    "Test my knowledge with a quick question!"
  ];

  return (
    <>
      {/* Dimmed backdrop blur */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-md transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Drawer */}
      <div
        className={`fixed top-0 right-0 z-[70] flex h-full w-full flex-col border-l border-white/10 bg-surface shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out sm:w-[440px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={`Chat with ${tutor.name}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-surface p-4 shadow-lg">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-none">
              <BotAvatar size="sm" />
              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-ground-900 bg-state-success shadow-sm" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-extrabold text-white truncate leading-snug">{tutor.name}</h3>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-state-success animate-ping" />
                <span className="text-xs font-semibold text-violet-300 truncate">{tutor.role}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-none ml-2">
            <button
              onClick={clearChat}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-surface-2 shadow-clay-sm text-ink-low transition-all hover:bg-surface-3 hover:text-white hover:scale-105 active:scale-95"
              title={t("aiTutor.clearChat")}
            >
              <Icon name="refresh-cw" size={15} />
            </button>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-surface-2 shadow-clay-sm text-ink-low transition-all hover:bg-surface-3 hover:text-white hover:scale-105 active:scale-95"
              title={t("common.close")}
            >
              <Icon name="x" size={18} />
            </button>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scroll-smooth">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar for AI */}
              {msg.role === "model" && (
                <BotAvatar size="sm" className="!w-8 !h-8 !p-1 flex-none mt-0.5" />
              )}

              <div
                className={`max-w-[82%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-violet-600 text-white rounded-tr-none font-medium shadow-clay-sm"
                    : "bg-surface-2 border border-white/10 text-ink-hi rounded-tl-none shadow-clay-sm"
                }`}
              >
                {msg.role === "model" && (
                  <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-violet-300 border-b border-white/10 pb-1">
                    <Icon name="cpu" size={12} className="text-violet-400" />
                    <span>{tutor.name}</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap break-words">
                  {renderMessageText(msg.text)}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex items-start gap-2.5">
              <BotAvatar size="sm" className="!w-8 !h-8 !p-1 flex-none" />
              <div className="rounded-2xl rounded-tl-none border border-violet-500/30 bg-violet-500/10 p-3.5 shadow-clay-sm">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:300ms]" />
                  </div>
                  <span className="text-xs font-semibold text-violet-300">{t("aiTutor.thinking")}</span>
                </div>
              </div>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="mx-auto my-2 max-w-sm rounded-xl border border-state-danger/30 bg-state-danger/10 p-3 text-center text-xs font-semibold text-state-danger shadow-lg">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips (when conversation is fresh) */}
        {messages.length <= 2 && !isLoading && (
          <div className="px-4 pb-2">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink-low">{t("ui.suggestedPrompts")}</p>
            <div className="flex flex-wrap gap-1.5">
              {suggestionChips.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(chip)}
                  className="rounded-full border border-white/15 bg-surface-2 shadow-clay-sm px-3 py-1 text-xs font-medium text-ink-hi hover:bg-violet-500/20 hover:border-violet-500/40 hover:text-white transition-all text-left"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer Input Bar */}
        <div className="border-t border-white/10 bg-ground-900 p-3.5">
          <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-surface-2 p-2 transition-all focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/30 focus-within:bg-surface-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("aiTutor.typeMessage")}
              disabled={isLoading}
              rows={1}
              className="w-full bg-transparent px-2 text-sm font-medium text-white placeholder-ink-low/50 outline-none resize-none leading-relaxed min-h-[36px] max-h-[90px] disabled:opacity-50"
            />

            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-violet-600 text-white shadow-clay-btn hover:bg-violet-500 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:scale-100 disabled:shadow-none"
              title={t("aiTutor.askTutor", { name: tutor.name })}
            >
              <Icon name="send" size={17} className="text-white" />
            </button>
          </div>

          <p className="mt-2 text-center text-[10px] font-medium text-ink-low/60 tracking-wide">
            {t("aiTutor.poweredBy")}
          </p>
        </div>
      </div>
    </>
  );
};

export default AIChatDrawer;
