"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useRepoContext } from "@/context/RepoContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProjectOverview } from "./ProjectOverview";

export function CockpitDashboard() {
  const { analysis } = useRepoContext();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "project">("overview");

  const radarData =
    analysis?.stackRadar?.length &&
    analysis.stackRadar.map((p) => ({ subject: p.subject, A: p.value }));

  const hotspots = analysis?.hotspots?.length
    ? analysis.hotspots.map((h) => ({
        path: h.path,
        complexity: h.complexity / 100,
      }))
    : [];

  return (
    <main className="flex h-screen flex-col overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-slate-800/80 bg-slate-950/90 px-4 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-6xl gap-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "overview"
                ? "border-b-2 border-cyan-400 text-cyan-300"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("project")}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "project"
                ? "border-b-2 border-cyan-400 text-cyan-300"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Project Details
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "overview" ? (
          <div className="h-full overflow-y-auto px-4 py-6 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-6xl grid grid-rows-[minmax(0,1fr)_minmax(0,0.85fr)] gap-4">
        <section className="grid grid-cols-[minmax(0,2.3fr)_minmax(0,1.2fr)] gap-4">
          <motion.article
            className="glass-panel relative flex flex-col overflow-hidden p-5 sm:p-7"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
          >
            <header className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                  Elevator pitch
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-50">
                  {analysis?.name
                    ? `${analysis.name} in one breath`
                    : "Repository in one breath"}
                </h2>
              </div>
              <div className="rounded-full bg-slate-900/70 px-3 py-1 text-[11px] text-slate-300">
                Gemini · <span className="text-cyan-300">gemini-2.5-flash</span>
              </div>
            </header>
            <div className="space-y-3 max-w-2xl text-sm leading-relaxed text-slate-200/90">
              <p>
                {analysis?.elevatorPitch ? (
                  analysis.elevatorPitch
                ) : (
                  <>
                    <span className="font-semibold text-cyan-200">
                      Repo Narrator
                    </span>{" "}
                    is a Gemini-powered cockpit for understanding large
                    codebases. Paste a GitHub URL from the home screen to see a
                    live elevator pitch for that repository here.
                  </>
                )}
              </p>
              <p className="text-slate-300">
                For this repo, Repo Narrator will build{" "}
                <span className="text-cyan-200">
                  architecture diagrams, call-flow charts, and file dependency
                  maps
                </span>{" "}
                (via Mermaid and React Flow), highlight{" "}
                <span className="text-sky-200">hotspots &amp; complexity</span>
                , surface a{" "}
                <span className="text-fuchsia-200">
                  language / stack balance
                </span>{" "}
                in the radar view, and power{" "}
                <span className="text-emerald-200">
                  RAG-backed Q&amp;A over code and docs
                </span>{" "}
                from the workbench and chat.
              </p>
            </div>
          </motion.article>

          <motion.aside
            className="glass-panel relative flex flex-col overflow-hidden p-4 sm:p-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.06, type: "spring", stiffness: 95 }}
          >
            <header className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
                  Stack radar
                </p>
                <p className="text-xs text-slate-300">
                  Balance between surfaces in this repo.
                </p>
              </div>
            </header>
            <div className="relative h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData ?? []}>
                  <PolarGrid
                    stroke="#1e293b"
                    radialLines={false}
                    gridType="circle"
                  />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#cbd5f5", fontSize: 11 }}
                  />
                  <PolarRadiusAxis
                    tick={false}
                    axisLine={false}
                    tickCount={4}
                  />
                  <Radar
                    dataKey="A"
                    stroke="#22d3ee"
                    fill="url(#radarFill)"
                    strokeWidth={2}
                    fillOpacity={0.7}
                  />
                  <defs>
                    <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.7} />
                      <stop offset="60%" stopColor="#a855f7" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="#ec4899" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.aside>
        </section>

        <section className="grid grid-rows-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-4">
          <motion.section
            className="glass-panel flex flex-col overflow-hidden p-4 sm:p-5"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, type: "spring", stiffness: 95 }}
          >
            <header className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
                  Hotspots
                </p>
                <p className="text-xs text-slate-300">
                  Files with notable complexity or branching.
                </p>
              </div>
            </header>

            <ul className="space-y-2.5 text-sm text-slate-200">
              {hotspots.map((file) => (
                <li
                  key={file.path}
                  className="flex items-center justify-between gap-2 rounded-xl bg-slate-950/60 px-3 py-2"
                >
                  <span className="truncate text-xs font-mono text-slate-300">
                    {file.path}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">
                        complexity
                      </span>
                      <span className="text-xs font-semibold text-slate-100">
                        {Math.round(file.complexity * 100)}
                      </span>
                    </div>
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        background:
                          file.complexity > 0.8
                            ? "#fb7185"
                            : file.complexity > 0.7
                              ? "#facc15"
                              : "#22c55e",
                        boxShadow:
                          file.complexity > 0.8
                            ? "0 0 12px rgba(248,113,113,0.9)"
                            : file.complexity > 0.7
                              ? "0 0 12px rgba(250,204,21,0.9)"
                              : "0 0 12px rgba(34,197,94,0.9)",
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section
            className="glass-panel flex items-center justify-between overflow-hidden px-4 py-3 sm:px-5 sm:py-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, type: "spring", stiffness: 95 }}
          >
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
                Repo mini-map
              </p>
              <p className="mt-1 text-xs text-slate-300">
                Scaled-down flow of modules and entrypoints.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/workbench")}
              className="rounded-full border border-cyan-400/60 bg-slate-950/60 px-4 py-2 text-xs font-medium text-cyan-200 transition hover:bg-slate-900/80 focus:outline-none"
            >
              Explore in workbench
            </button>
          </motion.section>
        </section>
      </div>
          </div>
        ) : (
          <ProjectOverview />
        )}
      </div>
    </main>
  );
}


