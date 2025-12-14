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
import { AuthButton } from "@/components/auth/AuthButton";
import { Sparkles, FileCode, AlertTriangle, TrendingUp, GitBranch, Code2, FileText, Zap } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export function CockpitDashboard() {
  const { analysis } = useRepoContext();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "project">("overview");

  const radarData =
    analysis?.stackRadar?.length
      ? analysis.stackRadar.map((p) => ({ subject: p.subject, A: p.value }))
      : [];

  const hotspots = analysis?.hotspots?.length
    ? analysis.hotspots.map((h) => ({
        path: h.path,
        complexity: h.complexity / 100,
        fileName: h.path.split("/").pop() || h.path,
        directory: h.path.split("/").slice(0, -1).join("/") || "root",
        extension: h.path.split(".").pop()?.toLowerCase() || "",
      }))
    : [];

  const getFileIcon = (extension: string) => {
    const iconMap: Record<string, typeof FileCode> = {
      ts: FileCode,
      tsx: FileCode,
      js: FileCode,
      jsx: FileCode,
      py: Code2,
      java: Code2,
      go: Code2,
      rs: Code2,
      cpp: Code2,
      c: Code2,
      md: FileText,
      json: FileText,
      yml: FileText,
      yaml: FileText,
    };
    return iconMap[extension] || FileCode;
  };

  const getComplexityColor = (complexity: number) => {
    if (complexity >= 0.8) return "from-rose-500 to-red-600";
    if (complexity >= 0.6) return "from-yellow-500 to-orange-500";
    return "from-emerald-500 to-green-600";
  };

  const getComplexityLabel = (complexity: number) => {
    if (complexity >= 0.8) return "Critical";
    if (complexity >= 0.6) return "High";
    return "Moderate";
  };

  return (
    <main className="flex h-screen flex-col overflow-hidden">
      <div className="relative z-50 border-b border-slate-800/80 bg-slate-950/90 shadow-lg shadow-slate-900/30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 text-base font-semibold text-slate-50 transition-all hover:text-cyan-400"
            >
              <div className="relative h-6 w-6">
                <img 
                  src="/logo.png" 
                  alt="gitlore Logo" 
                  className="h-full w-full object-contain transition-transform group-hover:rotate-12" 
                />
                <div className="absolute inset-0 h-6 w-6 animate-pulse rounded-full bg-cyan-400/20 blur-sm" />
              </div>
              <span className="bg-gradient-to-r from-slate-50 to-slate-300 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-cyan-100 transition-all">
                gitlore
              </span>
            </Link>
            <div className="h-6 w-px bg-slate-700/50" />
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("overview")}
                className={`relative px-4 py-3 text-sm font-medium transition-all ${
                  activeTab === "overview"
                    ? "text-cyan-300"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                Overview
                {activeTab === "overview" && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-sky-400"
                    layoutId="activeTab"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("project")}
                className={`relative px-4 py-3 text-sm font-medium transition-all ${
                  activeTab === "project"
                    ? "text-cyan-300"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                Project Details
                {activeTab === "project" && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-sky-400"
                    layoutId="activeTab"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/workbench"
              className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-slate-400 transition-all hover:bg-slate-800/60 hover:text-cyan-300 sm:inline-block"
            >
              Workbench
            </Link>
            <div className="h-6 w-px bg-slate-700/50" />
            <AuthButton />
          </div>
        </div>
      </div>

      
      <div className="flex-1 overflow-hidden">
        {activeTab === "overview" ? (
          <div className="h-full overflow-y-auto px-3 py-2 sm:px-4 lg:px-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900/50 transform-gpu">
            <div className="mx-auto max-w-6xl space-y-3 pb-4">
        <section className="grid grid-cols-[minmax(0,2.3fr)_minmax(0,1.2fr)] gap-3">
          <motion.article
            className="glass-panel relative flex flex-col overflow-hidden p-4 sm:p-5"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(34,211,238,0.08),transparent_60%),radial-gradient(circle_at_100%_100%,rgba(236,72,153,0.08),transparent_60%)] opacity-60 mix-blend-screen" />
            
            <header className="relative z-10 mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-sky-500/20 ring-1 ring-cyan-500/30">
                  <Zap className="h-3.5 w-3.5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                    Elevator pitch
                  </p>
                  <h2 className="mt-0.5 text-base font-semibold text-slate-50">
                    {analysis?.name
                      ? `${analysis.name} in one breath`
                      : "Repository in one breath"}
                  </h2>
                </div>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-slate-900/70 px-2.5 py-1 text-[10px] text-slate-300 ring-1 ring-slate-700/50">
                <Sparkles className="h-2.5 w-2.5 text-cyan-400" />
                <span>Gemini · <span className="text-cyan-300 font-medium">gemini-2.5-flash(DONT EXHAUST ALL OF MY FREE TOKENS t_t)</span></span>
              </div>
            </header>
            <div className="relative z-10 space-y-2.5 max-w-2xl text-sm leading-relaxed">
              <div className="rounded-lg bg-slate-900/40 p-3 ring-1 ring-slate-700/50">
                <p className="text-sm text-slate-200/95 leading-relaxed">
                  {analysis?.elevatorPitch ? (
                    analysis.elevatorPitch
                  ) : (
                    <>
                      <span className="font-semibold text-cyan-200">
                        gitlore
                      </span>{" "}
                      is a Gemini-powered cockpit for understanding large
                      codebases. Paste a GitHub URL from the home screen to see a
                      live elevator pitch for that repository here.
                    </>
                  )}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-gradient-to-br from-cyan-500/10 to-sky-500/10 p-2.5 ring-1 ring-cyan-500/20">
                  <p className="text-[10px] font-semibold text-cyan-300 mb-1">Architecture</p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    <span className="text-cyan-200">Diagrams, call-flow charts,</span> and file dependency maps via Mermaid and React Flow
                  </p>
                </div>
                <div className="rounded-lg bg-gradient-to-br from-fuchsia-500/10 to-pink-500/10 p-2.5 ring-1 ring-fuchsia-500/20">
                  <p className="text-[10px] font-semibold text-fuchsia-300 mb-1">Intelligence</p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    <span className="text-fuchsia-200">RAG-backed Q&A</span> over code and docs from workbench and chat
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <GitBranch className="h-3 w-3" />
                <span>
                  Highlights <span className="text-sky-200">hotspots & complexity</span>, surfaces{" "}
                  <span className="text-fuchsia-200">stack balance</span> in radar view
                </span>
              </div>
            </div>
          </motion.article>

          <motion.aside
            className="glass-panel relative flex flex-col overflow-hidden p-3 sm:p-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.06, type: "spring", stiffness: 95 }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_70%)] opacity-50" />
            
            <header className="relative z-10 mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 ring-1 ring-fuchsia-500/30">
                  <TrendingUp className="h-3.5 w-3.5 text-fuchsia-400" />
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                    Stack radar
                  </p>
                  <p className="text-[11px] text-slate-300">
                    Balance between surfaces in this repo.
                  </p>
                </div>
              </div>
            </header>
            <div className="relative z-10 h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData ?? []}>
                  <PolarGrid
                    stroke="#334155"
                    strokeWidth={1}
                    radialLines={false}
                    gridType="circle"
                  />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#cbd5e1", fontSize: 11, fontWeight: 500 }}
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
                    strokeWidth={2.5}
                    fillOpacity={0.6}
                    dot={{ fill: "#22d3ee", r: 4 }}
                    activeDot={{ r: 6, fill: "#06b6d4" }}
                  />
                  <defs>
                    <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.6} />
                      <stop offset="50%" stopColor="#a855f7" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#ec4899" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                </RadarChart>
              </ResponsiveContainer>
            </div>
            {radarData && radarData.length > 0 && (
              <div className="relative z-10 mt-2 flex flex-wrap gap-1.5">
                {radarData.map((point) => (
                  <div
                    key={point.subject}
                    className="flex items-center gap-1 rounded-full bg-slate-900/60 px-2 py-0.5 text-[9px] ring-1 ring-slate-700/50"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-400" />
                    <span className="text-slate-300">{point.subject}</span>
                    <span className="font-semibold text-cyan-300">{point.A}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.aside>
        </section>

        <section className="grid grid-cols-1 gap-3">
          <motion.section
            className="glass-panel relative flex flex-col overflow-hidden p-3 sm:p-4"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, type: "spring", stiffness: 95 }}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-yellow-500/5 opacity-50" />
            
            <header className="relative z-10 mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500/20 to-orange-500/20 ring-1 ring-rose-500/30">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                    Hotspots
                  </p>
                  <p className="text-[11px] text-slate-300">
                    Files with notable complexity or branching.
                  </p>
                </div>
              </div>
              {hotspots.length > 0 && (
                <div className="flex items-center gap-1 rounded-full bg-slate-900/70 px-2 py-0.5 text-[9px] text-slate-400 ring-1 ring-slate-700/50">
                  <TrendingUp className="h-2.5 w-2.5" />
                  <span>{hotspots.length} files</span>
                </div>
              )}
            </header>

            {hotspots.length === 0 ? (
              <div className="relative z-10 flex flex-col items-center justify-center py-6 text-center">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-800/50 ring-1 ring-slate-700/50">
                  <FileCode className="h-5 w-5 text-slate-500" />
                </div>
                <p className="text-xs font-medium text-slate-400">No hotspots detected</p>
                <p className="mt-0.5 text-[10px] text-slate-500">All files are within normal complexity ranges</p>
              </div>
            ) : (
              <div className="relative z-10 flex-1 min-h-0 overflow-hidden">
                <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900/50 transform-gpu">
                  <ul className="space-y-2">
                    {hotspots.map((file, index) => {
                      const FileIcon = getFileIcon(file.extension);
                      const complexityPercent = Math.round(file.complexity * 100);
                      
                      return (
                        <motion.li
                          key={file.path}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.12 + index * 0.05 }}
                          className="group relative overflow-hidden rounded-lg border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-2.5 transition-all hover:border-slate-600/70 hover:shadow-lg hover:shadow-rose-500/10"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className={clsx(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ring-1",
                              getComplexityColor(file.complexity),
                              file.complexity >= 0.8 
                                ? "ring-rose-500/30 from-rose-500/20 to-red-600/20" 
                                : file.complexity >= 0.6
                                  ? "ring-yellow-500/30 from-yellow-500/20 to-orange-500/20"
                                  : "ring-emerald-500/30 from-emerald-500/20 to-green-600/20"
                            )}>
                              <FileIcon className={clsx(
                                "h-3.5 w-3.5",
                                file.complexity >= 0.8 ? "text-rose-400" : file.complexity >= 0.6 ? "text-yellow-400" : "text-emerald-400"
                              )} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] font-semibold text-slate-200 truncate group-hover:text-slate-100 transition-colors">
                                    {file.fileName}
                                  </p>
                                  <p className="text-[9px] text-slate-500 truncate mt-0.5 font-mono">
                                    {file.directory || "root"}
                                  </p>
                                </div>
                                
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <div className="flex flex-col items-end gap-0.5">
                                    <div className="flex items-center gap-1">
                                      <span className="text-[9px] font-medium text-slate-400">
                                        {getComplexityLabel(file.complexity)}
                                      </span>
                                      <span className={clsx(
                                        "text-[11px] font-bold",
                                        file.complexity >= 0.8 ? "text-rose-400" : file.complexity >= 0.6 ? "text-yellow-400" : "text-emerald-400"
                                      )}>
                                        {complexityPercent}
                                      </span>
                                    </div>
                                    <div className="h-1 w-14 rounded-full bg-slate-800 overflow-hidden">
                                      <div
                                        className={clsx(
                                          "h-full rounded-full bg-gradient-to-r transition-all",
                                          getComplexityColor(file.complexity)
                                        )}
                                        style={{ width: `${complexityPercent}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 mt-1.5">
                                <div className="flex items-center gap-1 rounded-full bg-slate-800/70 px-1.5 py-0.5">
                                  <Code2 className="h-2.5 w-2.5 text-slate-500" />
                                  <span className="text-[9px] font-mono text-slate-400 uppercase">
                                    {file.extension || "file"}
                                  </span>
                                </div>
                                {file.complexity >= 0.8 && (
                                  <div className="flex items-center gap-1 rounded-full bg-rose-500/10 px-1.5 py-0.5">
                                    <AlertTriangle className="h-2.5 w-2.5 text-rose-400" />
                                    <span className="text-[9px] text-rose-300">Review needed</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        </motion.li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}
          </motion.section>

          <motion.section
            className="glass-panel flex items-center justify-between overflow-hidden px-3 py-2.5 sm:px-4 sm:py-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, type: "spring", stiffness: 95 }}
          >
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                Repo mini-map
              </p>
              <p className="mt-0.5 text-[11px] text-slate-300">
                Scaled-down flow of modules and entrypoints.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/workbench")}
              className="rounded-full border border-cyan-400/60 bg-slate-950/60 px-3 py-1.5 text-[11px] font-medium text-cyan-200 transition hover:bg-slate-900/80 focus:outline-none"
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


