"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRepoContext } from "@/context/RepoContext";
import { AlertCircle } from "lucide-react";

const steps = [
  { id: "cloning", label: "Cloning repository" },
  { id: "parsing", label: "Parsing & mapping files" },
  { id: "vectorizing", label: "Vectorizing & summarizing" },
  { id: "architecting", label: "Architecting neural map" },
] as const;

export function NeuralLoadingBay() {
  const router = useRouter();
  const { analysis, status, error, startAnalysis, finishAnalysis, failAnalysis } = useRepoContext();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!analysis?.repoUrl || status === "done" || status === "error") {
      return;
    }

    let cancelled = false;

    async function run() {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repoUrl: analysis.repoUrl }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          
          if (res.status === 429) {
            const retryAfter = data.retryAfter || 60;
            throw new Error(
              `Rate limit exceeded. The Gemini API free tier allows 20 requests per day. ` +
              `Please wait ${retryAfter} seconds and try again, or upgrade your API plan. ` +
              `Visit https://ai.google.dev/gemini-api/docs/rate-limits for more information.`
            );
          }
          throw new Error(data.error || "Failed to analyze repository");
        }

        const json = await res.json();
        if (cancelled) return;

        finishAnalysis(json);
        router.push("/dashboard");
      } catch (err: unknown) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Unexpected error while analyzing repo.";
        failAnalysis(message);
      }
    }

    run();

    const stepTimer = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % steps.length);
    }, 1200);

    return () => {
      cancelled = true;
      clearInterval(stepTimer);
    };
  }, [analysis?.repoUrl, failAnalysis, finishAnalysis, router, status]);

  
  if (status === "error" && error) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-4 py-10 sm:px-8 lg:px-16">
        <div className="glass-panel relative w-full max-w-4xl px-6 py-8 sm:px-10 sm:py-10">
          <div className="absolute inset-0 rounded-[1.25rem] bg-[radial-gradient(circle_at_50%_0%,rgba(239,68,68,0.2),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(236,72,153,0.2),transparent_55%)] opacity-80 mix-blend-screen" />
          
          <div className="relative z-10 space-y-6">
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-red-400">
                Analysis Failed
              </p>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                Unable to analyze repository
              </h1>
            </div>
            
            <div className="rounded-lg border border-red-500/30 bg-red-950/20 p-6">
              <p className="text-sm text-red-300 font-medium mb-2">Error:</p>
              <p className="text-sm text-slate-300 whitespace-pre-wrap">{error}</p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  router.push("/");
                }}
                className="px-6 py-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-200 font-medium transition-colors"
              >
                Back to Home
              </button>
              <button
                onClick={() => {
                  if (analysis?.repoUrl) {
                    router.push("/");
                    setTimeout(() => {
                      startAnalysis(analysis.repoUrl);
                      router.push("/loading");
                    }, 100);
                  }
                }}
                className="px-6 py-3 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50 text-slate-200 font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10 sm:px-8 lg:px-16">
      <div className="glass-panel relative w-full max-w-4xl px-6 py-8 sm:px-10 sm:py-10">
        <div className="absolute inset-0 rounded-[1.25rem] bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.28),transparent_55%),radial-gradient(circle_at_0%_100%,rgba(129,140,248,0.3),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(236,72,153,0.32),transparent_55%)] opacity-80 mix-blend-screen" />

        <div className="relative z-10 grid gap-10 md:grid-cols-[3fr,2fr]">
          <section className="space-y-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-300">
                Neural Loading Bay
              </p>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                Mapping the deep sea of{" "}
                <span className="text-cyan-300">
                  {analysis?.name ? analysis.name : "your repository"}
                </span>
                .
              </h1>
              <p className="mt-3 text-sm text-slate-300">
                Repo Narrator is cloning, parsing, and lighting up the structure
                of your codebase. This usually takes a few moments for medium
                projects.
              </p>
            </div>

            <ol className="space-y-3 text-sm text-slate-200">
              {steps.map((step, index) => (
                <li key={step.id} className="flex items-center gap-3">
                  <motion.div
                    className="relative h-9 w-9 rounded-full bg-slate-900/80"
                    initial={{ scale: 0.9, opacity: 0.6 }}
                    animate={{
                      scale: [0.9, 1.05, 0.9],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  >
                    <span className="absolute inset-[3px] rounded-full bg-slate-950" />
                    <span className="absolute inset-[6px] rounded-full bg-gradient-to-tr from-cyan-400 to-fuchsia-500 blur-[1px]" />
                  </motion.div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      {index + 1} · {step.id}
                    </p>
                    <p
                      className={
                        index === currentStepIndex
                          ? "text-slate-50"
                          : "text-slate-400"
                      }
                    >
                      {step.label}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="relative">
            <div className="glass-panel h-full min-h-[260px] overflow-hidden border border-cyan-400/30 bg-slate-950/80">
              <motion.div
                className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/60 bg-slate-950/70"
                initial={{ scale: 0.8, opacity: 0.7 }}
                animate={{
                  scale: [0.8, 1.05, 0.9],
                  opacity: [0.7, 1, 0.8],
                }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <motion.div
                  className="absolute inset-6 rounded-full border border-fuchsia-400/60"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-3 rounded-full border border-sky-400/60"
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
                />
                <div className="absolute inset-10 rounded-full bg-gradient-to-tr from-cyan-400/40 via-sky-500/50 to-fuchsia-500/40 blur-lg" />
              </motion.div>

              <div className="absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent px-4 pb-4 pt-10 text-[11px] text-slate-300">
                <p className="font-medium text-slate-200">Streaming facts:</p>
                <ul className="space-y-1 text-slate-400">
                  {analysis?.owner && analysis?.name ? (
                    <>
                      <li>· GitHub repo: {analysis.owner}/{analysis.name}</li>
                      <li>· Using Gemini model: gemini-2.5-flash</li>
                      <li>
                        · Hotspots identified: {analysis.hotspots.length || 3}{" "}
                        candidate files
                      </li>
                    </>
                  ) : (
                    <>
                      <li>· Resolving repository metadata</li>
                      <li>· Preparing Gemini for architecture overview</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}


