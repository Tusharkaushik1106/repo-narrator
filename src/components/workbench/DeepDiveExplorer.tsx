"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ReactFlow, { Background } from "reactflow";
import "reactflow/dist/style.css";
import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";
import { useRepoContext } from "@/context/RepoContext";
import { useFileContext } from "@/context/FileContext";
import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { MermaidDiagram } from "@/components/diagrams/MermaidDiagram";
import ReactMarkdown from "react-markdown";
import { ChevronRight, ChevronDown, Folder, File, Route, Zap, Sparkles } from "lucide-react";
import { AuthButton } from "@/components/auth/AuthButton";
import Link from "next/link";

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

interface FileTreeItem {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: FileTreeItem[];
  complexity?: "green" | "yellow" | "red";
  language?: string;
  isRoute?: boolean;
  isImportant?: boolean;
}

function buildFileTree(
  entries: Array<{
    path: string;
    type?: "file" | "folder";
    language: string;
    complexity: "green" | "yellow" | "red";
  }>,
): FileTreeItem[] {
  const tree: FileTreeItem[] = [];
  const pathMap = new Map<string, FileTreeItem>();

  
  const sortedEntries = [...entries].sort((a, b) => {
    const aIsFolder = a.type === "folder";
    const bIsFolder = b.type === "folder";
    if (aIsFolder && !bIsFolder) return -1;
    if (!aIsFolder && bIsFolder) return 1;
    return a.path.localeCompare(b.path);
  });

  for (const entry of sortedEntries) {
    const parts = entry.path.split("/");
    const itemName = parts.pop()!;
    const isFolder = entry.type === "folder";

    
    let isRoute = false;
    let isImportant = false;

    if (!isFolder) {
      
      isRoute =
        entry.path.includes("/route.") ||
        entry.path.includes("/api/") ||
        (entry.path.includes("/app/") && (itemName === "page.tsx" || itemName === "page.ts" || itemName === "page.jsx" || itemName === "page.js")) ||
        entry.path.includes("/pages/") ||
        !!itemName.match(/^route\.(ts|tsx|js|jsx)$/);
      
      isImportant =
        entry.complexity === "red" ||
        entry.complexity === "yellow" ||
        itemName === "package.json" ||
        itemName === "tsconfig.json" ||
        itemName === "next.config.js" ||
        itemName === "next.config.ts" ||
        itemName === "tailwind.config.js" ||
        itemName === "tailwind.config.ts" ||
        itemName === "README.md" ||
        itemName === ".env.example";
    }

    
    let currentPath = "";
    let currentLevel = tree;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!pathMap.has(currentPath)) {
        const folder: FileTreeItem = {
          name: part,
          path: currentPath,
          type: "folder",
          children: [],
        };
        pathMap.set(currentPath, folder);
        currentLevel.push(folder);
        currentLevel = folder.children!;
      } else {
        
        const folder = pathMap.get(currentPath)!;
        currentLevel = folder.children!;
      }
    }

    
    if (isFolder) {
      
      
      if (!pathMap.has(entry.path)) {
        const folder: FileTreeItem = {
          name: itemName,
          path: entry.path,
          type: "folder",
          children: [],
        };
        pathMap.set(entry.path, folder);
        currentLevel.push(folder);
      }
    } else {
      
      const existingFile = currentLevel.find(
        (item) => item.path === entry.path && item.type === "file",
      );
      if (!existingFile) {
        currentLevel.push({
          name: itemName,
          path: entry.path,
          type: "file",
          complexity: entry.complexity,
          language: entry.language,
          isRoute,
          isImportant,
        });
      }
    }
  }

  return tree;
}

const FileTreeItem = memo(
  ({
    item,
    level = 0,
    selectedPath,
    expandedFolders,
    onToggleFolder,
    onSelectFile,
  }: {
    item: FileTreeItem;
    level?: number;
    selectedPath: string | null;
    expandedFolders: Set<string>;
    onToggleFolder: (path: string) => void;
    onSelectFile: (path: string) => void;
  }) => {
    const isExpanded = expandedFolders.has(item.path);
    const isFolder = item.type === "folder";

    const dotColor =
      item.complexity === "red"
        ? "#fb7185"
        : item.complexity === "yellow"
          ? "#fbbf24"
          : "#22c55e";

    if (isFolder) {
      return (
        <>
          <li
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 cursor-pointer hover:bg-slate-900/60 transition-colors"
            style={{ paddingLeft: `${0.5 + level * 0.75}rem` }}
            onClick={() => onToggleFolder(item.path)}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 text-slate-400 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-3 w-3 text-slate-400 flex-shrink-0" />
            )}
            <Folder className="h-3.5 w-3.5 text-cyan-400/70 flex-shrink-0" />
            <span className="truncate font-mono text-[11px] text-slate-300">{item.name}</span>
          </li>
          {isExpanded &&
            item.children?.map((child, index) => (
              <FileTreeItem
                key={`${child.path}-${child.type}-${index}`}
                item={child}
                level={level + 1}
                selectedPath={selectedPath}
                expandedFolders={expandedFolders}
                onToggleFolder={onToggleFolder}
                onSelectFile={onSelectFile}
              />
            ))}
        </>
      );
    }

    const fileIsSelected = selectedPath === item.path;

    return (
      <li
        className={`flex items-center gap-1.5 rounded-lg px-2 py-1 cursor-pointer transition-colors ${
          fileIsSelected
            ? "bg-cyan-500/20 border-l-2 border-cyan-400"
            : "hover:bg-slate-900/60"
        }`}
        style={{ paddingLeft: `${0.5 + level * 0.75}rem` }}
        onClick={() => onSelectFile(item.path)}
      >
        <div className="h-3.5 w-3.5 flex-shrink-0 flex items-center justify-center">
          {item.isRoute ? (
            <Route className="h-3 w-3 text-purple-400" />
          ) : (
            <File className="h-3 w-3 text-slate-400" />
          )}
        </div>
        <span
          className={`truncate font-mono text-[11px] flex-1 ${
            fileIsSelected ? "text-cyan-200 font-medium" : "text-slate-200"
          }`}
        >
          {item.name}
        </span>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {item.isImportant && (
            <Zap className="h-2.5 w-2.5 text-amber-400" fill="currentColor" />
          )}
          {item.complexity && (
            <span
              className="h-2 w-2 rounded-full"
              style={{
                background: dotColor,
                boxShadow: `${dotColor}80 0 0 4px`,
              }}
            />
          )}
        </div>
      </li>
    );
  },
);

FileTreeItem.displayName = "FileTreeItem";

export function DeepDiveExplorer() {
  const { analysis } = useRepoContext();
  const { setCurrentFile } = useFileContext();

  
  const fileTree = useMemo(() => {
    if (analysis?.fullFileTree && analysis.fullFileTree.length > 0) {
      return analysis.fullFileTree;
    }
    
    return (analysis?.sampleFileTree ?? []).map((file) => ({
      path: file.path,
      type: "file" as const,
      language: file.language,
      complexity: file.complexity,
    }));
  }, [analysis?.fullFileTree, analysis?.sampleFileTree]);

  const [selectedPath, setSelectedPath] = useState<string | null>(
    fileTree.find((f) => f.type === "file")?.path ?? null,
  );
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const treeStructure = useMemo(() => buildFileTree(fileTree), [fileTree]);

  
  useEffect(() => {
    if (!selectedPath) return;
    const parts = selectedPath.split("/");
    parts.pop(); 
    const pathsToExpand = new Set<string>();
    let currentPath = "";
    for (const part of parts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      pathsToExpand.add(currentPath);
    }
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      pathsToExpand.forEach((path) => next.add(path));
      return next;
    });
  }, [selectedPath]);

  const handleFileSelect = useCallback((path: string) => {
    setSelectedPath(path);
  }, []);

  const handleToggleFolder = useCallback((path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);
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
    
    const lastApiKeyChange = localStorage.getItem("lastApiKeyChange");
    const cacheVersion = localStorage.getItem("cacheVersion") || "0";
    if (lastApiKeyChange && Date.now() - parseInt(lastApiKeyChange) < 60000) {
      
      setCache({});
      localStorage.removeItem("lastApiKeyChange");
    }
  }, []);

  const owner = analysis?.owner ?? "";
  const name = analysis?.name ?? "";

  useEffect(() => {
    if (!selectedPath) {
      setCurrentFile(null);
      return;
    }
    
    if (!analysis || !owner || !name) return;

    
    const cached = cache[selectedPath];
    if (cached && !error) {
      setEditorValue(cached.code);
      setSummary(typeof cached.summary === "string" ? cached.summary : String(cached.summary || ""));
      setMermaid(cached.mermaid);
      setError(null); 
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
            owner,
            name,
            path: selectedPath,
          }),
          signal: controller.signal,
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
          throw new Error(data.error || "Failed to load file summary.");
        }
        const data = await res.json();
        window.dispatchEvent(new CustomEvent("usage-updated"));
        const next = {
          code: data.code as string,
          summary: typeof data.summary === "string" ? data.summary : String(data.summary || ""),
          mermaid: (data.mermaid ?? null) as string | null,
        };
        setEditorValue(next.code);
        setSummary(next.summary);
        setMermaid(next.mermaid);
        setCache((prev) => {
          const newCache = { ...prev };
          if (selectedPath) {
            newCache[selectedPath] = next;
          }
          return newCache;
        });
        setError(null);
        if (selectedPath) {
          setCurrentFile({
            path: selectedPath,
            content: next.code,
            language: selectedPath.split(".").pop() || undefined,
          });
        } 
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
    
  }, [owner, name, selectedPath]);

  return (
    <main className="flex h-screen flex-col overflow-hidden">
      <div className="border-b border-slate-800/80 bg-slate-950/90 shadow-lg shadow-slate-900/30 px-4 sm:px-6 lg:px-8 flex-shrink-0">
        <div className="mx-auto flex max-w-7xl items-center justify-between h-14">
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
            <Link
              href="/dashboard"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-400 transition-all hover:bg-slate-800/60 hover:text-cyan-300"
            >
              Dashboard
            </Link>
          </div>
          <AuthButton />
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <PanelGroup
          direction="horizontal"
          className="glass-panel flex h-full w-full overflow-hidden border border-slate-700/70 bg-slate-950/90 m-2"
        >
        <Panel defaultSize={22} minSize={16} className="border-r border-slate-800/80">
          <aside className="flex h-full flex-col bg-slate-950/90 min-h-0">
            <header className="border-b border-slate-800/80 px-3 py-2.5 flex-shrink-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Files
              </p>
            </header>
            <div className="flex-1 min-h-0 overflow-y-auto px-2 py-2.5 text-xs transform-gpu scrollbar-thin">
              <ul className="space-y-0.5">
                {treeStructure.map((item, index) => (
                  <FileTreeItem
                    key={`${item.path}-${item.type}-${index}`}
                    item={item}
                    selectedPath={selectedPath}
                    expandedFolders={expandedFolders}
                    onToggleFolder={handleToggleFolder}
                    onSelectFile={handleFileSelect}
                  />
                ))}
              </ul>
            </div>
          </aside>
        </Panel>

        <PanelResizeHandle className="w-[1px] bg-gradient-to-b from-cyan-400/70 via-slate-600 to-fuchsia-500/80" />

        <Panel defaultSize={40} minSize={28} className="border-r border-slate-800/80">
          <section className="flex h-full flex-col bg-slate-950/90 min-h-0">
            <header className="border-b border-slate-800/80 px-3 py-2.5 flex-shrink-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Code
              </p>
              <p className="text-[11px] text-slate-500">
                Loaded directly from GitHub for the analyzed repository.
              </p>
            </header>
            <div className="flex-1 min-h-0 overflow-hidden">
              <Editor
                theme="vs-dark"
                defaultLanguage="typescript"
                options={{
                  readOnly: true,
                  fontLigatures: true,
                  fontSize: 13,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  smoothScrolling: false,
                  renderWhitespace: "none",
                  renderLineHighlight: "none",
                  codeLens: false,
                }}
                value={editorValue}
                loading={<div className="text-slate-400">Loading editor...</div>}
              />
            </div>
          </section>
        </Panel>

        <PanelResizeHandle className="w-[1px] bg-gradient-to-b from-fuchsia-500/80 via-slate-600 to-cyan-400/70" />

        <Panel defaultSize={38} minSize={26}>
          <section className="flex h-full flex-col bg-slate-950/90 min-h-0">
            <header className="border-b border-slate-800/80 px-3 py-2.5 flex-shrink-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                The Narrator
              </p>
              <p className="text-[11px] text-slate-500">
                Context-aware summaries and sequence diagrams.
              </p>
            </header>
            <div className="grid flex-1 min-h-0 grid-rows-[minmax(0,0.55fr)_minmax(0,0.45fr)] gap-2.5 p-2.5">
              <motion.div
                className="glass-panel relative flex flex-col overflow-hidden border border-sky-500/30 bg-slate-950/90 px-3 py-2 text-[11px] min-h-0"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-sky-300 flex-shrink-0">
                  File summary
                </p>
                <div className="mt-1 flex-1 min-h-0 overflow-y-auto pr-1 text-slate-200 text-[11px] markdown-body transform-gpu scrollbar-thin">
                  {loading ? (
                    "Analyzing file with Gemini…"
                  ) : error ? (
                    <div className="rounded-lg border border-rose-500/30 bg-rose-950/20 p-2 text-rose-300">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium">Error loading summary</p>
                        <button
                          onClick={() => {
                            setError(null);
                            
                            setCache((prev) => {
                              const newCache = { ...prev };
                              if (selectedPath) {
                                delete newCache[selectedPath];
                              }
                              return newCache;
                            });
                            
                            const currentPath = selectedPath;
                            setSelectedPath(null);
                            setTimeout(() => setSelectedPath(currentPath), 10);
                          }}
                          className="text-[10px] px-2 py-0.5 rounded border border-rose-400/50 hover:bg-rose-500/20 transition-colors"
                        >
                          Retry
                        </button>
                      </div>
                      <p className="text-[10px] text-rose-400 whitespace-pre-wrap">{error}</p>
                      {error.includes("rate limit") && (
                        <p className="text-[10px] text-rose-300/70 mt-2 italic">
                          Note: The free tier limit is per API key. If you changed your API key, the new key may also be on the free tier with the same 20 requests/day limit.
                        </p>
                      )}
                    </div>
                  ) : (
                    <ReactMarkdown>
                      {typeof summary === "string" ? summary : String(summary || "")}
                    </ReactMarkdown>
                  )}
                </div>
              </motion.div>

              <div className="glass-panel relative flex flex-col overflow-hidden border border-fuchsia-500/30 bg-slate-950/90 px-3 py-3 text-xs min-h-0">
                <div className="mb-1 flex items-center justify-between gap-2 flex-shrink-0">
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
                <div
                  className="mt-1 flex-1 min-h-0 overflow-auto"
                  style={{
                    willChange: "scroll-position",
                    transform: "translateZ(0)",
                  }}
                >
                  {loading && !mermaid ? (
                    <div className="flex h-full items-center justify-center text-[11px] text-slate-400">
                      Generating flow chart with Gemini…
                    </div>
                  ) : mermaid && mermaid.trim() ? (
                    <div
                      style={{
                        willChange: "transform",
                        transform: "translateZ(0)",
                        minHeight: "100%",
                      }}
                    >
                      <MermaidDiagram 
                        key={`workbench-${selectedPath}-${mermaid?.slice(0, 50)}`}
                        code={mermaid} 
                        id="mermaid-panel" 
                      />
                    </div>
                  ) : selectedPath ? (
                    <div className="flex h-full items-center justify-center text-[11px] text-slate-400">
                      <div className="text-center">
                        <p>No diagram available for this file.</p>
                        <p className="text-[10px] text-slate-500 mt-1">
                          Gemini did not generate a diagram for this file.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <ReactFlow
                      nodes={initialNodes}
                      edges={initialEdges}
                      fitView
                      nodesDraggable={false}
                      nodesConnectable={false}
                      elementsSelectable={false}
                      panOnDrag={false}
                      zoomOnScroll={false}
                      zoomOnPinch={false}
                    >
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
      </div>

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
            <div
              className="h-[calc(100%-2.5rem)] w-full overflow-auto rounded-xl bg-slate-950/90 p-3"
              style={{
                willChange: "scroll-position",
                transform: "translateZ(0)",
              }}
            >
              {loading && !mermaid ? (
                <div className="flex h-full items-center justify-center text-xs text-slate-400">
                  Generating flow chart with Gemini…
                </div>
              ) : mermaid ? (
                <div
                  style={{
                    willChange: "transform",
                    transform: "translateZ(0)",
                    minHeight: "100%",
                  }}
                >
                  <MermaidDiagram 
                    key={`fullscreen-${mermaid?.slice(0, 50)}`}
                    code={mermaid} 
                    id="mermaid-fullscreen" 
                  />
                </div>
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


