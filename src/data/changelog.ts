import {
  Sparkles,
  Zap,
  Shield,
  GitBranch,
  LayoutDashboard,
  FileSearch,
  MessageSquare,
  Bug,
  Wrench,
  Rocket,
} from "lucide-react";
import type { ComponentType } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Changelog data
//
// Each release has a version, date, tag (Major / Minor / Patch), and a list
// of changes grouped by type (feature / improvement / fix).
// ─────────────────────────────────────────────────────────────────────────────

export type ChangeType = "feature" | "improvement" | "fix";
export type ReleaseTag = "Major" | "Minor" | "Patch" | "Beta";

export interface Change {
  type:        ChangeType;
  description: string;
}

export interface Release {
  version:     string;
  date:        string;           // ISO date string
  tag:         ReleaseTag;
  title:       string;
  summary:     string;
  icon:        ComponentType<{ className?: string }>;
  iconColor:   string;
  changes:     Change[];
}

export const RELEASES: Release[] = [
  {
    version:   "0.6.0",
    date:      "2026-02-18",
    tag:       "Minor",
    title:     "Deep Dive Workbench",
    summary:   "A dedicated workbench view for per-file deep dives, inline AI chat, and dependency graph exploration.",
    icon:      FileSearch,
    iconColor: "text-tomato-jam",
    changes: [
      { type: "feature",     description: "New /workbench route with resizable three-panel layout (file tree · viewer · AI chat)" },
      { type: "feature",     description: "Per-file AI summary loaded on selection — no extra clicks required" },
      { type: "feature",     description: "Interactive dependency graph powered by D3 force simulation" },
      { type: "feature",     description: "OmniChat floating assistant available across all authenticated pages" },
      { type: "improvement", description: "File tree now remembers expanded state across navigation" },
      { type: "improvement", description: "Mermaid diagram rendering added to AI response output" },
      { type: "fix",         description: "Fixed double-navbar appearing on /workbench on initial load" },
    ],
  },
  {
    version:   "0.5.0",
    date:      "2026-01-30",
    tag:       "Minor",
    title:     "Cockpit Dashboard",
    summary:   "Project overview dashboard with repo cards, analysis history, and usage indicators.",
    icon:      LayoutDashboard,
    iconColor: "text-metallic-gold",
    changes: [
      { type: "feature",     description: "Dashboard with recent repos, analysis history, and quick-launch cards" },
      { type: "feature",     description: "Usage indicator showing daily Gemini token consumption" },
      { type: "feature",     description: "Project overview page with architecture summary and file stats" },
      { type: "improvement", description: "Loading screen now shows live progress steps instead of a spinner" },
      { type: "improvement", description: "Auth guard redirects unauthenticated users to sign-in seamlessly" },
      { type: "fix",         description: "Fixed session hydration flash on initial page load" },
      { type: "fix",         description: "Resolved occasional 500 on large monorepos with >5k files" },
    ],
  },
  {
    version:   "0.4.0",
    date:      "2026-01-12",
    tag:       "Minor",
    title:     "GitHub OAuth & Private Repos",
    summary:   "Sign in with GitHub to analyze private repositories using OAuth or a personal access token.",
    icon:      Shield,
    iconColor: "text-fg/70",
    changes: [
      { type: "feature",     description: "GitHub OAuth sign-in via NextAuth — tokens are never persisted server-side" },
      { type: "feature",     description: "Private repo support using OAuth scope or PAT passed in the URL" },
      { type: "feature",     description: "PAT input in the analyze form — stored only in session memory" },
      { type: "improvement", description: "Auth button shows user avatar and dropdown with sign-out" },
      { type: "fix",         description: "Fixed redirect loop when session expired mid-analysis" },
    ],
  },
  {
    version:   "0.3.0",
    date:      "2025-12-20",
    tag:       "Minor",
    title:     "Zip Upload & Offline Repos",
    summary:   "Drop a .zip archive of any repository for fully server-side processing — no GitHub account required.",
    icon:      GitBranch,
    iconColor: "text-tomato-jam/70",
    changes: [
      { type: "feature",     description: "Drag-and-drop .zip upload — processed entirely server-side, never stored" },
      { type: "feature",     description: "Support for monorepos with nested package.json / Cargo.toml workspaces" },
      { type: "improvement", description: "File tree now groups by directory with collapsible nodes" },
      { type: "improvement", description: "Improved tokenizer for repos with mixed language file trees" },
      { type: "fix",         description: "Fixed crash on repos with symlinked directories in the zip" },
      { type: "fix",         description: "Binary files (images, fonts) are now gracefully skipped" },
    ],
  },
  {
    version:   "0.2.0",
    date:      "2025-11-28",
    tag:       "Minor",
    title:     "AI Summary Engine",
    summary:   "Gemini 2.5 Flash powers per-file summaries, repo-level architecture briefs, and Q&A.",
    icon:      MessageSquare,
    iconColor: "text-metallic-gold/80",
    changes: [
      { type: "feature",     description: "Per-file AI summary using Gemini 2.5 Flash with streaming output" },
      { type: "feature",     description: "Repo-level architecture brief generated on analysis completion" },
      { type: "feature",     description: "Q&A mode — ask anything about the codebase in natural language" },
      { type: "improvement", description: "Prompt templates tuned for TypeScript, Python, Go, and Rust repos" },
      { type: "fix",         description: "Fixed token overflow for files >4 000 lines by auto-chunking" },
    ],
  },
  {
    version:   "0.1.0",
    date:      "2025-11-01",
    tag:       "Beta",
    title:     "Public Beta Launch",
    summary:   "gitlore opens to the public. Paste any public GitHub URL and get an instant codebase breakdown.",
    icon:      Rocket,
    iconColor: "text-tomato-jam",
    changes: [
      { type: "feature",     description: "Core repo ingestion pipeline — clones, parses, and indexes any public GitHub repo" },
      { type: "feature",     description: "File tree viewer with syntax-highlighted source preview" },
      { type: "feature",     description: "Initial landing page with analyze form" },
      { type: "feature",     description: "Basic loading screen with progress feedback" },
    ],
  },
];

export const CHANGE_META: Record<ChangeType, { label: string; color: string; dot: string }> = {
  feature:     { label: "New",         color: "text-tomato-jam/80",    dot: "bg-tomato-jam" },
  improvement: { label: "Improved",    color: "text-metallic-gold/80", dot: "bg-metallic-gold" },
  fix:         { label: "Fixed",       color: "text-fg/50",            dot: "bg-fg/40" },
};

export const TAG_META: Record<ReleaseTag, { color: string; bg: string; border: string }> = {
  Major: { color: "text-tomato-jam",       bg: "bg-tomato-jam/10",      border: "border-tomato-jam/20" },
  Minor: { color: "text-metallic-gold/90", bg: "bg-metallic-gold/10",   border: "border-metallic-gold/20" },
  Patch: { color: "text-fg/60",            bg: "bg-fg/8",               border: "border-fg/10" },
  Beta:  { color: "text-tomato-jam/70",    bg: "bg-tomato-jam/8",       border: "border-tomato-jam/15" },
};
