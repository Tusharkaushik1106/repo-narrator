"use client";

import { motion } from "framer-motion";
import { useRepoContext } from "@/context/RepoContext";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { MermaidDiagram } from "@/components/diagrams/MermaidDiagram";
import { Loader2 } from "lucide-react";

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

  useEffect(() => {
    if (!analysis?.owner || !analysis?.name) {
      setLoading(false);
      return;
    }

    async function fetchProjectAnalysis() {
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
    <div className="h-full overflow-y-auto px-4 py-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Overview Section */}
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

        {/* Architecture Diagram */}
        {projectAnalysis.mermaidArchitecture && (
          <motion.section
            className="glass-panel overflow-hidden p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="mb-4 text-lg font-semibold text-slate-50">
              Architecture Diagram
            </h2>
            <div className="rounded-lg border border-slate-700/50 bg-slate-950/50 p-4">
              <MermaidDiagram
                key={`arch-${projectAnalysis.mermaidArchitecture?.slice(0, 50)}`}
                code={projectAnalysis.mermaidArchitecture}
                id="project-architecture"
              />
            </div>
          </motion.section>
        )}

        {/* Key Components */}
        {projectAnalysis.keyComponents && projectAnalysis.keyComponents.length > 0 && (
          <motion.section
            className="glass-panel overflow-hidden p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="mb-4 text-lg font-semibold text-slate-50">
              Key Components
            </h2>
            <ul className="space-y-3">
              {projectAnalysis.keyComponents.map((component, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 rounded-lg bg-slate-950/60 p-3"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-xs font-semibold text-cyan-300">
                    {index + 1}
                  </span>
                  <p className="flex-1 text-sm text-slate-200">{component}</p>
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        {/* Data Flow Diagram */}
        {projectAnalysis.mermaidDataFlow && (
          <motion.section
            className="glass-panel overflow-hidden p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="mb-4 text-lg font-semibold text-slate-50">
              Data Flow
            </h2>
            <div className="rounded-lg border border-slate-700/50 bg-slate-950/50 p-4">
              <MermaidDiagram
                code={projectAnalysis.mermaidDataFlow}
                id="project-dataflow"
              />
            </div>
            {projectAnalysis.dataFlow && (
              <div className="mt-4 text-sm text-slate-300">
                <ReactMarkdown>{projectAnalysis.dataFlow}</ReactMarkdown>
              </div>
            )}
          </motion.section>
        )}

        {/* Tech Stack */}
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

        {/* Dependencies */}
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
    </div>
  );
}

