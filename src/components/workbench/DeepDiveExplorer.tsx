"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ReactFlow, { Background } from "reactflow";
import "reactflow/dist/style.css";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";
import { useRepoContext } from "@/context/RepoContext";
import { useEffect, useState } from "react";
import { MermaidDiagram } from "@/components/diagrams/MermaidDiagram";
import ReactMarkdown from "react-markdown";

const initialNodes = [
  {
    id: "1",
    data: { label: "app entry" },
    position: { x: 0, y: 0 },
  },
  {
    id: "2",
    data: { label: "api /chat" },
    position: { x: 160, y: 80 },
  },
  {
    id: "3",
    data: { label: "Gemini adapter" },
    position: { x: -120, y: 80 },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "1", target: "3", animated: true },
];

export function DeepDiveExplorer() {
  const { analysis } = useRepoContext();

  const fileTree = analysis?.sampleFileTree ?? [];
  const [selectedPath, setSelectedPath] = useState<string | null>(
    fileTree[0]?.path ?? null,
  );
  const [editorValue, setEditorValue] = useState(
    analysis?.sampleCode ||
      `// Deep Dive Explorer\n// Paste a GitHub URL on the home screen to see real repo context here.\n`,
  );
  const [summary, setSummary] = useState<string>(
    "Select a file to see an explanation of its role in the repo.",
  );
  const [mermaid, setMermaid] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullScreen, setFullScreen] = useState(false);

  const [cache, setCache] = useState<
    Record<string, { code: string; summary: string; mermaid: string | null }>
  >({});

  useEffect(() => {
    if (!analysis || !selectedPath) return;

    const cached = cache[selectedPath];
    if (cached) {
      setEditorValue(cached.code);
      setSummary(cached.summary);
      setMermaid(cached.mermaid);
      return;
    }

    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/file-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            owner: analysis.owner,
            name: analysis.name,
            path: selectedPath,
          }),
          signal: controller.signal,
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to load file summary.");
        }
        const data = await res.json();
        const next = {
          code: data.code as string,
          summary: data.summary as string,
          mermaid: (data.mermaid ?? null) as string | null,
        };
        setEditorValue(next.code);
        setSummary(next.summary);
        setMermaid(next.mermaid);
        setCache((prev) => ({
          ...prev,
          [selectedPath]: next,
        }));
      } catch (err: unknown) {
        if (controller.signal.aborted) return;
        const message =
          err instanceof Error ? err.message : "Unexpected error loading file.";
        setError(message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => controller.abort();
  }, [analysis, selectedPath, cache]);

  return (
    <main className="flex min-h-dvh items-stretch px-2 py-4 sm:px-4 sm:py-6 lg:px-6">
      <PanelGroup
        direction="horizontal"
        className="glass-panel flex w-full overflow-hidden border border-slate-700/70 bg-slate-950/90"
      >
        <Panel defaultSize={22} minSize={16} className="border-r border-slate-800/80">
          <aside className="flex h-full flex-col bg-slate-950/90">
            <header className="border-b border-slate-800/80 px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Files
              </p>
            </header>
            <div className="flex-1 overflow-y-auto px-2 py-2.5 text-xs">
              <ul className="space-y-1.5">
                {fileTree.map((file) => (
                  <li
                    key={file.path}
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-slate-900/80 cursor-pointer"
                    onClick={() => setSelectedPath(file.path)}
                  >
                    <span className="truncate font-mono text-[11px] text-slate-200">
                      {file.path}
                    </span>
                    <span
                      className="ml-2 h-2 w-2 rounded-full"
                      style={{
                        background:
                          file.complexity === "red"
                            ? "#fb7185"
                            : file.complexity === "yellow"
                              ? "#fbbf24"
                              : "#22c55e",
                        boxShadow:
                          file.complexity === "red"
                            ? "0 0 8px rgba(248,113,113,0.9)"
                            : file.complexity === "yellow"
                              ? "0 0 8px rgba(250,204,21,0.9)"
                              : "0 0 8px rgba(34,197,94,0.9)",
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </Panel>

        <PanelResizeHandle className="w-[1px] bg-gradient-to-b from-cyan-400/70 via-slate-600 to-fuchsia-500/80" />

        <Panel defaultSize={40} minSize={28} className="border-r border-slate-800/80">
          <section className="flex h-full flex-col bg-slate-950/90">
            <header className="border-b border-slate-800/80 px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Code
              </p>
              <p className="text-[11px] text-slate-500">
                Loaded directly from GitHub for the analyzed repository.
              </p>
            </header>
            <div className="flex-1 overflow-hidden">
              <Editor
                theme="vs-dark"
                defaultLanguage="typescript"
                options={{
                  readOnly: true,
                  fontLigatures: true,
                  fontSize: 13,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                }}
                value={editorValue}
              />
            </div>
          </section>
        </Panel>

        <PanelResizeHandle className="w-[1px] bg-gradient-to-b from-fuchsia-500/80 via-slate-600 to-cyan-400/70" />

        <Panel defaultSize={38} minSize={26}>
          <section className="flex h-full flex-col bg-slate-950/90">
            <header className="border-b border-slate-800/80 px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                The Narrator
              </p>
              <p className="text-[11px] text-slate-500">
                Context-aware summaries and sequence diagrams.
              </p>
            </header>
            <div className="grid flex-1 grid-rows-[minmax(0,0.55fr)_minmax(0,0.45fr)] gap-2.5 p-2.5">
              <motion.div
                className="glass-panel relative overflow-hidden border border-sky-500/30 bg-slate-950/90 px-3 py-2 text-[11px]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-sky-300">
                  File summary
                </p>
                <div className="mt-1 h-full overflow-y-auto pr-1 text-slate-200 text-[11px] markdown-body">
                  {loading ? (
                    "Analyzing file with Gemini…"
                  ) : error ? (
                    `Error: ${error}`
                  ) : (
                    <ReactMarkdown>{summary}</ReactMarkdown>
                  )}
                </div>
              </motion.div>

              <div className="glass-panel relative overflow-hidden border border-fuchsia-500/30 bg-slate-950/90 px-3 py-3 text-xs">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-fuchsia-300">
                    Sequence / architecture diagram
                  </p>
                  <button
                    type="button"
                    onClick={() => setFullScreen(true)}
                    className="rounded-full border border-fuchsia-400/70 px-2 py-0.5 text-[10px] font-medium text-fuchsia-100 hover:bg-fuchsia-500/10"
                  >
                    Full screen
                  </button>
                </div>
                <div className="mt-1 h-full min-h-[120px]">
                  {loading && !mermaid ? (
                    <div className="flex h-full items-center justify-center text-[11px] text-slate-400">
                      Generating flow chart with Gemini…
                    </div>
                  ) : mermaid ? (
                    <MermaidDiagram code={mermaid} />
                  ) : (
                    <ReactFlow nodes={initialNodes} edges={initialEdges} fitView>
                      <Background
                        color="rgba(148,163,184,0.3)"
                        gap={16}
                        size={0.75}
                      />
                    </ReactFlow>
                  )}
                </div>
              </div>
            </div>
          </section>
        </Panel>
      </PanelGroup>

      {fullScreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl">
          <div className="relative h-[80vh] w-[90vw] max-w-5xl rounded-2xl border border-fuchsia-500/60 bg-slate-950/95 p-4 shadow-2xl shadow-fuchsia-500/30">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-300">
                Sequence / architecture diagram – full screen
              </p>
              <button
                type="button"
                onClick={() => setFullScreen(false)}
                className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800"
              >
                Close
              </button>
            </div>
            <div className="h-[calc(100%-2.5rem)] w-full overflow-auto rounded-xl bg-slate-950/90 p-3">
              {loading && !mermaid ? (
                <div className="flex h-full items-center justify-center text-xs text-slate-400">
                  Generating flow chart with Gemini…
                </div>
              ) : mermaid ? (
                <MermaidDiagram code={mermaid} />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-slate-400">
                  No Mermaid diagram available for this file.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


