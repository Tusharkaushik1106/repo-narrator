"use client";

import { motion } from "framer-motion";
import { useRepoContext } from "@/context/RepoContext";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { MermaidDiagram } from "@/components/diagrams/MermaidDiagram";
import { Loader2, Maximize2, X, Component, ArrowRight } from "lucide-react";

interface ProjectAnalysis {
  overview: string;
  architecture: string;
  keyComponents: string[];
  dataFlow: string;
  techStack: string[];
  dependencies: string[];
  mermaidArchitecture?: string;
  mermaidDataFlow?: string;
}

export function ProjectOverview() {
  const { analysis } = useRepoContext();
  const [projectAnalysis, setProjectAnalysis] = useState<ProjectAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullScreenArch, setFullScreenArch] = useState(false);
  const [fullScreenDataFlow, setFullScreenDataFlow] = useState(false);
  const [archRenderError, setArchRenderError] = useState<string | null>(null);
  const [dataRenderError, setDataRenderError] = useState<string | null>(null);
  const [showArchRaw, setShowArchRaw] = useState(false);
  const [showDataRaw, setShowDataRaw] = useState(false);

  useEffect(() => {
    if (!analysis?.owner || !analysis?.name) {
      setLoading(false);
      return;
    }

    async function fetchProjectAnalysis() {
      if (!analysis) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/project-overview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            owner: analysis.owner,
            name: analysis.name,
            repoUrl: analysis.repoUrl,
            sampleCode: analysis.sampleCode,
            fileTree: analysis.fullFileTree || analysis.sampleFileTree,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          if (res.status === 429) {
            throw new Error(
              `Rate limit exceeded. Please wait and try again later.`
            );
          }
          throw new Error(data.error || "Failed to load project analysis.");
        }

        const data = await res.json();
        setProjectAnalysis(data);
        window.dispatchEvent(new CustomEvent("usage-updated"));
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Unexpected error loading project analysis.";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchProjectAnalysis();
  }, [analysis]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan-400 mb-3" />
          <p className="text-sm text-slate-400">Analyzing project structure...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-lg border border-rose-500/30 bg-rose-950/20 p-4 text-rose-300 max-w-md">
          <p className="font-medium mb-1">Error loading analysis</p>
          <p className="text-sm text-rose-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!projectAnalysis) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-slate-400">No project analysis available.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-4 py-6 transform-gpu scrollbar-thin">
      <div className="mx-auto max-w-5xl space-y-6">
        <motion.section
          className="glass-panel overflow-hidden p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="mb-4 text-lg font-semibold text-slate-50">
            Project Overview
          </h2>
          <div className="markdown-body text-slate-200 leading-relaxed">
            <ReactMarkdown>{projectAnalysis.overview}</ReactMarkdown>
          </div>
        </motion.section>

        {projectAnalysis.mermaidArchitecture && (
          <motion.section
            className="glass-panel overflow-hidden p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-50">
                Architecture Diagram
              </h2>
              <button
                onClick={() => setFullScreenArch(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-cyan-300 transition-colors hover:bg-slate-700/80 hover:border-cyan-400/60"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Fullscreen</span>
              </button>
            </div>
            <div className="rounded-lg border border-slate-700/50 bg-slate-950/50 p-4 space-y-2">
              {archRenderError && (
                <div className="rounded-md border border-amber-500/40 bg-amber-950/20 px-3 py-2 text-xs text-amber-200">
                  {archRenderError}{" "}
                  <button
                    type="button"
                    onClick={() => setShowArchRaw((s) => !s)}
                    className="underline decoration-dotted underline-offset-4 text-amber-100 hover:text-amber-50 ml-1"
                  >
                    {showArchRaw ? "Hide raw code" : "Show raw code"}
                  </button>
                </div>
              )}
              <MermaidDiagram
                key={`arch-${projectAnalysis.mermaidArchitecture?.slice(0, 50)}`}
                code={projectAnalysis.mermaidArchitecture}
                id="project-architecture"
                onError={(msg) => setArchRenderError(msg)}
              />
              {showArchRaw && (
                <pre className="whitespace-pre-wrap break-words rounded-md bg-slate-900/70 p-3 text-[11px] text-slate-200 border border-slate-700/60">
                  {projectAnalysis.mermaidArchitecture}
                </pre>
              )}
            </div>
          </motion.section>
        )}

        {projectAnalysis.keyComponents && projectAnalysis.keyComponents.length > 0 && (
          <motion.section
            className="glass-panel overflow-hidden p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="mb-6 flex items-center gap-2">
              <Component className="h-5 w-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-slate-50">
                Key Components
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
              {projectAnalysis.keyComponents.map((component, index) => {
                let cleaned = component
                  .replace(/\*\*/g, "")
                  .replace(/`([^`]+)`/g, "$1")
                  .trim();

                const filePathMatch = cleaned.match(/[\(`]([^`\)]+)[\)`]/);
                let filePath: string | null = null;
                if (filePathMatch && filePathMatch[1].includes("/")) {
                  filePath = filePathMatch[1];
                  cleaned = cleaned.replace(/[\(`][^`\)]+[\)`]/g, "").trim();
                }
                const parts = cleaned
                  .split(/[:–—\-]\s+/)
                  .map((p) => p.trim())
                  .filter((p) => p.length > 0);
                
                const title = parts.length > 1 ? parts[0] : parts[0] || cleaned;
                const description = parts.length > 1 
                  ? parts.slice(1).join(": ").trim()
                  : null;

                return (
                  <motion.div
                    key={index}
                    className="group relative overflow-hidden rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-4 transition-all hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-sky-500/20 ring-1 ring-cyan-500/30">
                        <span className="text-sm font-bold text-cyan-300">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="mb-1.5 text-sm font-semibold text-cyan-200 group-hover:text-cyan-100 transition-colors">
                          {title}
                        </h3>
                        {filePath && (
                          <div className="mb-2 inline-flex items-center gap-1.5 rounded-md bg-slate-800/60 px-2 py-0.5">
                            <span className="text-[10px] font-mono text-slate-400">
                              {filePath}
                            </span>
                          </div>
                        )}
                        {description && (
                          <p className="text-sm leading-relaxed text-slate-300">
                            {description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="absolute bottom-0 right-0 h-px w-0 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent transition-all group-hover:w-full" />
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        {projectAnalysis.mermaidDataFlow && (
          <motion.section
            className="glass-panel overflow-hidden p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-50">
                Data Flow
              </h2>
              <button
                onClick={() => setFullScreenDataFlow(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-cyan-300 transition-colors hover:bg-slate-700/80 hover:border-cyan-400/60"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Fullscreen</span>
              </button>
            </div>
            <div className="rounded-lg border border-slate-700/50 bg-slate-950/50 p-4 space-y-2">
              {dataRenderError && (
                <div className="rounded-md border border-amber-500/40 bg-amber-950/20 px-3 py-2 text-xs text-amber-200">
                  {dataRenderError}{" "}
                  <button
                    type="button"
                    onClick={() => setShowDataRaw((s) => !s)}
                    className="underline decoration-dotted underline-offset-4 text-amber-100 hover:text-amber-50 ml-1"
                  >
                    {showDataRaw ? "Hide raw code" : "Show raw code"}
                  </button>
                </div>
              )}
              <MermaidDiagram
                code={projectAnalysis.mermaidDataFlow}
                id="project-dataflow"
                onError={(msg) => setDataRenderError(msg)}
              />
              {showDataRaw && (
                <pre className="whitespace-pre-wrap break-words rounded-md bg-slate-900/70 p-3 text-[11px] text-slate-200 border border-slate-700/60">
                  {projectAnalysis.mermaidDataFlow}
                </pre>
              )}
            </div>
            {projectAnalysis.dataFlow && (
              <div className="mt-4 text-sm text-slate-300">
                <ReactMarkdown>{projectAnalysis.dataFlow}</ReactMarkdown>
              </div>
            )}
          </motion.section>
        )}

        
        {projectAnalysis.techStack && projectAnalysis.techStack.length > 0 && (
          <motion.section
            className="glass-panel overflow-hidden p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="mb-4 text-lg font-semibold text-slate-50">
              Technology Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {projectAnalysis.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.section>
        )}

        {projectAnalysis.dependencies && projectAnalysis.dependencies.length > 0 && (
          <motion.section
            className="glass-panel overflow-hidden p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="mb-4 text-lg font-semibold text-slate-50">
              Key Dependencies
            </h2>
            <ul className="space-y-2">
              {projectAnalysis.dependencies.map((dep, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-slate-300"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400"></span>
                  <span className="font-mono">{dep}</span>
                </li>
              ))}
            </ul>
          </motion.section>
        )}
      </div>
      {fullScreenArch && projectAnalysis.mermaidArchitecture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl">
          <div className="relative h-[85vh] w-[90vw] max-w-6xl rounded-2xl border border-cyan-500/60 bg-slate-950/95 p-4 shadow-2xl shadow-cyan-500/30">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                Architecture Diagram – Fullscreen
              </p>
              <button
                type="button"
                onClick={() => setFullScreenArch(false)}
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs text-slate-200 transition-colors hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div
              className="h-[calc(100%-3rem)] w-full overflow-auto rounded-xl bg-slate-950/90 p-4"
              style={{
                willChange: "scroll-position",
                transform: "translateZ(0)",
              }}
            >
              <MermaidDiagram
                key={`arch-fullscreen-${projectAnalysis.mermaidArchitecture?.slice(0, 50)}`}
                code={projectAnalysis.mermaidArchitecture}
                id="project-architecture-fullscreen"
                onError={(msg) => setArchRenderError(msg)}
              />
            </div>
          </div>
        </div>
      )}
      {fullScreenDataFlow && projectAnalysis.mermaidDataFlow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl">
          <div className="relative h-[85vh] w-[90vw] max-w-6xl rounded-2xl border border-fuchsia-500/60 bg-slate-950/95 p-4 shadow-2xl shadow-fuchsia-500/30">
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-300">
                Data Flow Diagram – Fullscreen
              </p>
              <button
                type="button"
                onClick={() => setFullScreenDataFlow(false)}
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs text-slate-200 transition-colors hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div
              className="h-[calc(100%-3rem)] w-full overflow-auto rounded-xl bg-slate-950/90 p-4"
              style={{
                willChange: "scroll-position",
                transform: "translateZ(0)",
              }}
            >
              <MermaidDiagram
                key={`dataflow-fullscreen-${projectAnalysis.mermaidDataFlow?.slice(0, 50)}`}
                code={projectAnalysis.mermaidDataFlow}
                id="project-dataflow-fullscreen"
                onError={(msg) => setDataRenderError(msg)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

