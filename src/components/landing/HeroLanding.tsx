"use client";

import { motion } from "framer-motion";
import { GithubIcon, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { useRepoContext } from "@/context/RepoContext";

export function HeroLanding() {
  const router = useRouter();
  const { startAnalysis } = useRepoContext();
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = input.trim().length > 0;

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);

    startAnalysis(input.trim());
    router.push("/loading");
  };

  return (
    <main className="relative flex min-h-dvh items-center justify-center px-4 py-10 sm:px-8 lg:px-16">
      <motion.div
        className={clsx(
          "glass-panel relative w-full max-w-5xl px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12",
        )}
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 18 }}
      >
        <div className="pointer-events-none absolute inset-0 rounded-[1.25rem] bg-[radial-gradient(circle_at_0%_0%,rgba(34,211,238,0.25),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(236,72,153,0.25),transparent_55%)] opacity-60 mix-blend-screen" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-[3fr,2fr] lg:items-center">
          <section>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-300 ring-1 ring-slate-600/60">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400/20 text-cyan-300">
                <Sparkles className="h-3 w-3" />
              </span>
              <span className="uppercase tracking-[0.18em]">
                Clarity through bioluminescence
              </span>
            </div>

            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
              Speak{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
                fluent repository
              </span>
              .
            </h1>

            <p className="mt-5 max-w-xl text-balance text-sm leading-relaxed text-slate-300 sm:text-base">
              Paste any GitHub repo. Watch Repo Narrator and Gemini map every
              file, function, and dependency into a glowing neural diagram you
              can actually reason about.
            </p>

            <form
              onSubmit={handleAnalyze}
              className="mt-8 space-y-4 rounded-2xl bg-slate-900/40 p-3 ring-1 ring-slate-700/70"
            >
              <label className="block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Input Hub
              </label>
              <motion.div
                className={clsx(
                  "relative flex flex-col gap-3 rounded-2xl bg-slate-950/60 p-3 sm:flex-row sm:items-center sm:p-3.5",
                  "focus-within:ring-2 focus-within:ring-cyan-400/80 focus-within:ring-offset-0",
                )}
                initial={{ boxShadow: "0 0 0 0 rgba(34,211,238,0.0)" }}
                animate={{
                  boxShadow: canSubmit
                    ? "0 0 40px 0 rgba(34,211,238,0.55)"
                    : "0 0 26px 0 rgba(15,23,42,0.9)",
                }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                <motion.div
                  className="pointer-events-none absolute inset-[-2px] rounded-[1.4rem] bg-[conic-gradient(from_120deg_at_50%_50%,rgba(34,211,238,0.9),rgba(168,85,247,0.9),rgba(236,72,153,0.9),rgba(34,211,238,0.9))] opacity-70"
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 22,
                    ease: "linear",
                  }}
                />
                <div className="relative flex-1 rounded-2xl bg-slate-950/90 px-4 py-2.5">
                  <input
                    className="w-full bg-transparent text-sm text-slate-50 placeholder:text-slate-500 outline-none focus:outline-none"
                    placeholder="Paste GitHub URL or drop a repo.zip"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>
                <div className="relative flex gap-2 sm:w-auto sm:justify-end">
                  <button
                    type="submit"
                    disabled={!canSubmit || submitting}
                    className={clsx(
                      "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition-colors focus-ring-glow",
                      "bg-slate-700/80 text-slate-200",
                      canSubmit &&
                        "bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 shadow-lg shadow-cyan-500/40 hover:from-cyan-300 hover:to-sky-400",
                      submitting && "opacity-80 cursor-wait",
                    )}
                  >
                    <span>Analyze</span>
                    <Sparkles className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 px-2.5 py-1">
                  <GithubIcon className="h-3.5 w-3.5 text-slate-300" />
                  <span>GitHub OAuth / PAT – tokens never logged</span>
                </div>
                <span className="text-slate-500">or</span>
                <span>Drop a .zip – processed entirely server-side</span>
              </div>
            </form>
          </section>

          <section className="relative">
            <motion.div
              className="glass-panel relative h-full min-h-[260px] overflow-hidden border border-cyan-400/20 bg-gradient-to-b from-slate-950/90 to-slate-900/60"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.08, type: "spring", stiffness: 90 }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.35),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.4),transparent_55%)] mix-blend-screen" />

              <div className="relative z-10 flex h-full flex-col justify-between p-5">
                <div className="space-y-1.5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-200/90">
                    Neural Loading Bay
                  </p>
                  <p className="text-xs text-slate-300">
                    Repo Narrator will:
                  </p>
                </div>

                <ol className="mt-4 space-y-2 text-xs text-slate-200">
                  <li className="flex items-start gap-2">
                    <span className="mt-[3px] h-1.5 w-10 rounded-full bg-gradient-to-r from-cyan-300 to-sky-500" />
                    <span>Clone / unpack your repository.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-[3px] h-1.5 w-10 rounded-full bg-gradient-to-r from-sky-400 to-fuchsia-400" />
                    <span>Parse files &amp; build ASTs and call graphs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-[3px] h-1.5 w-10 rounded-full bg-gradient-to-r from-fuchsia-400 to-cyan-300" />
                    <span>Embed, summarize, and illuminate hotspots.</span>
                  </li>
                </ol>

                <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] text-slate-300">
                  <div className="rounded-xl bg-slate-950/50 p-3 ring-1 ring-cyan-400/30">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-cyan-200/90">
                      Gemini
                    </p>
                    <p className="mt-1 font-mono text-xs text-cyan-100">
                      gemini-1.5-pro
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-950/50 p-3 ring-1 ring-fuchsia-400/40">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-fuchsia-200/90">
                      Narrator
                    </p>
                    <p className="mt-1 text-xs text-slate-100">
                      Multi-level explanations, architecture diagrams, and
                      RAG-backed Q&amp;A.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        </div>
      </motion.div>
    </main>
  );
}


