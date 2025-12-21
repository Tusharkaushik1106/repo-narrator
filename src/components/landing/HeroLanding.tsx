"use client";

import { motion } from "framer-motion";
import { GithubIcon, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { signIn, useSession } from "next-auth/react";
import { useRepoContext } from "@/context/RepoContext";
import { NeuralBackground } from "@/components/ui/neural-background";
import { Poppins, Space_Grotesk, Playfair_Display } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const playfair = Playfair_Display({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export function HeroLanding() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { startAnalysis } = useRepoContext();
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = input.trim().length > 0;

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    
    if (status === "unauthenticated" || !session) {
      const callbackUrl = "/";
      void signIn(undefined, { callbackUrl });
      return;
    }

    setSubmitting(true);
    startAnalysis(input.trim());
    router.push("/loading");
  };

  return (
    <main className="relative min-h-dvh w-full overflow-hidden transform-gpu">
      <NeuralBackground />
      <div className="relative z-10 flex min-h-dvh items-center justify-center px-4 pt-24 pb-10 sm:px-8 lg:px-16">
        <motion.div
          className={clsx(
            "glass-panel relative w-full max-w-5xl px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12",
          )}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >

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

            <p className={`mt-5 max-w-xl text-balance text-sm leading-relaxed sm:text-base ${poppins.variable} ${spaceGrotesk.variable} ${playfair.variable}`}>
              <span className={`text-slate-300 ${poppins.className} font-normal`}>Drop your github repository and watch </span>
              <span className={`font-semibold bg-gradient-to-r from-cyan-300 via-cyan-200 to-cyan-300 bg-clip-text text-transparent ${spaceGrotesk.className}`} style={{ fontFamily: 'var(--font-space)' }}>gitlore</span>
              <span className={`text-slate-300 ${poppins.className} font-normal`}> summarize every file, function, and dependency like a </span>
              <span className={`font-semibold bg-gradient-to-r from-purple-300 via-purple-200 to-purple-300 bg-clip-text text-transparent ${playfair.className}`} style={{ fontFamily: 'var(--font-playfair)' }}>loyal one</span>
              <span className={`text-slate-300 ${poppins.className} font-normal`}>.</span>
            </p>

            <form
              onSubmit={handleAnalyze}
              className="mt-8 space-y-4 rounded-2xl bg-slate-900/40 p-3 ring-1 ring-slate-700/70"
            >
              <label className="block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                Input Hub
              </label>
              <div
                className={clsx(
                  "relative flex flex-col gap-3 rounded-2xl bg-slate-950/60 p-3 sm:flex-row sm:items-center sm:p-3.5 transition-shadow duration-300",
                  "focus-within:ring-2 focus-within:ring-cyan-400/80 focus-within:ring-offset-0",
                  canSubmit
                    ? "shadow-[0_0_20px_0_rgba(34,211,238,0.4)]"
                    : "shadow-[0_0_10px_0_rgba(15,23,42,0.5)]",
                )}
              >
                <div
                  className="pointer-events-none absolute inset-[-2px] rounded-[1.4rem] bg-[conic-gradient(from_120deg_at_50%_50%,rgba(34,211,238,0.9),rgba(168,85,247,0.9),rgba(236,72,153,0.9),rgba(34,211,238,0.9))] opacity-70"
                  style={{
                    animation: "rotate-gradient 22s linear infinite",
                    willChange: "transform",
                    transform: "translateZ(0)",
                    WebkitBackfaceVisibility: "hidden",
                    backfaceVisibility: "hidden",
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
              </div>

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
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >

              <div className="relative z-10 flex h-full flex-col justify-between p-5">
                <div className="space-y-1.5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-200/90">
                    Neural Loading Bay
                  </p>
                  <p className="text-xs text-slate-300">
                    gitlore will:
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

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-cyan-500/10 to-sky-500/10 px-3 py-1.5 border border-cyan-400/20">
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-medium text-cyan-200">Real-time Analysis</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-fuchsia-500/10 to-pink-500/10 px-3 py-1.5 border border-fuchsia-400/20">
                    <div className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
                    <span className="text-[10px] font-medium text-fuchsia-200">Smart Diagrams</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 px-3 py-1.5 border border-emerald-400/20">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-medium text-emerald-200">RAG-Powered Q&A</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        </div>
      </motion.div>
      </div>
    </main>
  );
}


