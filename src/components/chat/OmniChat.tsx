"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { NarrationMessage } from "@/lib/types";
import { useRepoContext } from "@/context/RepoContext";
import { useFileContext } from "@/context/FileContext";

export function OmniChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<NarrationMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { analysis } = useRepoContext();
  const { currentFile } = useFileContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = draft.trim();
    if (!content || sending) return;

    const userMessage: NarrationMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setDraft("");
    setSending(true);
    setStreamingContent("");

    try {
      const context = currentFile?.path
        ? {
            type: "file" as const,
            path: currentFile.path,
            language: currentFile.language,
          }
        : undefined;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: content,
          repoId:
            analysis && analysis.owner && analysis.name
              ? `${analysis.owner}/${analysis.name}`
              : undefined,
          context,
          fileContent: currentFile?.content || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      window.dispatchEvent(new CustomEvent("usage-updated"));

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulatedText += chunk;
          setStreamingContent(accumulatedText);
        }
      }

      const assistantMessage: NarrationMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: accumulatedText,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingContent("");
    } catch (error) {
      const errorMessage: NarrationMessage = {
        id: `${Date.now()}-assistant-error`,
        role: "assistant",
        content:
          error instanceof Error
            ? `Error: ${error.message}`
            : "I couldn't reach the chat API. Please check your network and GEMINI_API_KEY configuration.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setSending(false);
      setStreamingContent("");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[9999] inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-400 to-fuchsia-500 text-slate-950 shadow-lg shadow-cyan-500/40 focus:outline-none transform-gpu"
        style={{ position: 'fixed' }}
      >
        <MessageCircle className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.section
            className="fixed bottom-20 right-5 z-40 w-[420px] max-w-[calc(100vw-2.5rem)] rounded-2xl border border-slate-700/80 bg-slate-950/95 p-4 shadow-2xl shadow-slate-900/80 backdrop-blur-xl"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            <header className="mb-3 flex items-center justify-between gap-2 border-b border-slate-800/50 pb-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-300">
                  gitlore Chat
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                  {currentFile?.path
                    ? `Context: ${currentFile.path}`
                    : "Ask about files, flows, or architecture"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900/80 text-slate-300 transition-colors hover:bg-slate-800 hover:text-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="mb-3 max-h-[400px] space-y-3 overflow-y-auto rounded-xl bg-slate-950/60 p-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent transform-gpu">
              {messages.length === 0 && !streamingContent && (
                <div className="space-y-2 text-xs text-slate-400">
                  <p className="font-medium text-slate-300">Try asking:</p>
                  <ul className="space-y-1.5 pl-4 list-disc">
                    <li>&ldquo;Explain the authentication flow&rdquo;</li>
                    <li>&ldquo;How does this file work?&rdquo;</li>
                    <li>&ldquo;What are the main components?&rdquo;</li>
                  </ul>
                  {currentFile?.path && (
                    <p className="mt-3 pt-3 border-t border-slate-800 text-cyan-300/80">
                      💡 I can see you&apos;re viewing: <code className="text-[10px] bg-slate-900/50 px-1.5 py-0.5 rounded">{currentFile.path}</code>
                    </p>
                  )}
                </div>
              )}
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={
                    m.role === "user"
                      ? "ml-auto max-w-[85%] rounded-xl bg-gradient-to-br from-cyan-500/20 to-sky-500/20 border border-cyan-500/30 px-3 py-2 text-left"
                      : "mr-auto max-w-[85%] rounded-xl bg-slate-900/80 border border-slate-700/50 px-3 py-2 text-left"
                  }
                >
                  {m.role === "user" ? (
                    <p className="text-xs text-cyan-100 whitespace-pre-wrap break-words">
                      {m.content}
                    </p>
                  ) : (
                    <div className="text-xs text-slate-200 prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                          h1: ({ children }) => <h1 className="text-sm font-semibold mb-2 text-cyan-300">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-xs font-semibold mb-1.5 mt-3 text-cyan-300">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-xs font-medium mb-1 mt-2 text-sky-300">{children}</h3>,
                          ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                          code: ({ children, className }) => {
                            const isInline = !className;
                            return isInline ? (
                              <code className="bg-slate-800/60 text-cyan-300 px-1.5 py-0.5 rounded text-[10px] font-mono">
                                {children}
                              </code>
                            ) : (
                              <code className="block bg-slate-900/80 p-2 rounded-lg text-[10px] font-mono text-slate-300 overflow-x-auto my-2">
                                {children}
                              </code>
                            );
                          },
                          pre: ({ children }) => (
                            <pre className="bg-slate-900/80 p-2 rounded-lg text-[10px] font-mono text-slate-300 overflow-x-auto my-2">
                              {children}
                            </pre>
                          ),
                          strong: ({ children }) => <strong className="font-semibold text-slate-100">{children}</strong>,
                          em: ({ children }) => <em className="italic text-slate-300">{children}</em>,
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-2 border-cyan-500/50 pl-3 my-2 italic text-slate-300">
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </motion.div>
              ))}
              {streamingContent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mr-auto max-w-[85%] rounded-xl bg-slate-900/80 border border-slate-700/50 px-3 py-2 text-left"
                >
                  <div className="text-xs text-slate-200 prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                        code: ({ children }) => (
                          <code className="bg-slate-800/60 text-cyan-300 px-1.5 py-0.5 rounded text-[10px] font-mono">
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {streamingContent}
                    </ReactMarkdown>
                  </div>
                  <span className="inline-block w-2 h-3 bg-cyan-400 animate-pulse ml-1" />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                className="flex-1 rounded-lg bg-slate-900/90 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                placeholder="Ask about the code..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !draft.trim()}
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 px-3 py-2 text-xs font-medium text-slate-950 transition-all hover:from-cyan-400 hover:to-sky-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}


