"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import type { NarrationMessage } from "@/lib/types";
import { useRepoContext } from "@/context/RepoContext";

export function OmniChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<NarrationMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const { analysis } = useRepoContext();

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

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: content,
          repoId:
            analysis && analysis.owner && analysis.name
              ? `${analysis.owner}/${analysis.name}`
              : undefined,
        }),
      });
      const text = await res.text();

      const assistantMessage: NarrationMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: text,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: NarrationMessage = {
        id: `${Date.now()}-assistant-error`,
        role: "assistant",
        content:
          "I couldn't reach the chat API. Please check your network and GEMINI_API_KEY configuration.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-400 to-fuchsia-500 text-slate-950 shadow-lg shadow-cyan-500/40 focus:outline-none"
      >
        <MessageCircle className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.section
            className="fixed bottom-20 right-5 z-40 w-[340px] max-w-[calc(100vw-2.5rem)] rounded-2xl border border-slate-700/80 bg-slate-950/90 p-3 shadow-2xl shadow-slate-900/80 backdrop-blur-xl"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            <header className="mb-2 flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Omnipresent assistant
                </p>
                <p className="text-[11px] text-slate-400">
                  Ask about files, flows, or architecture.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/80 text-slate-300 hover:bg-slate-800"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </header>

            <div className="mb-2 max-h-64 space-y-2 overflow-y-auto rounded-xl bg-slate-950/80 p-2 text-[11px]">
              {messages.length === 0 && (
                <p className="text-slate-500">
                  Try: &ldquo;Give me a 2-minute tour of the auth flow&rdquo; or
                  &ldquo;Explain how background indexing works.&rdquo;
                </p>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.role === "user"
                      ? "ml-auto max-w-[85%] rounded-xl bg-sky-500/20 px-2.5 py-1.5 text-sky-100 whitespace-pre-wrap text-left"
                      : "mr-auto max-w-[85%] rounded-xl bg-slate-900/80 px-2.5 py-1.5 text-slate-100 whitespace-pre-wrap text-left"
                  }
                >
                  {m.content}
                </div>
              ))}
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-1.5">
              <input
                className="flex-1 rounded-xl bg-slate-900/90 px-2.5 py-1.5 text-[11px] text-slate-100 placeholder:text-slate-500 outline-none"
                placeholder="Ask Repo Narrator anything about this repo..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 px-2.5 py-1.5 text-[11px] font-medium text-slate-950"
              >
                Send
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}


