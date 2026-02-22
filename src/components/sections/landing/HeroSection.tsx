"use client";

import { Sparkles } from "lucide-react";
import { Eyebrow } from "@/components/ui";
import { HeroSection as HeroBlock } from "@/components/blocks/HeroSection";
import { RepoAnalyzeForm } from "./RepoAnalyzeForm";
import { PREVIEW_CAPABILITIES } from "@/data/landing";

// ─────────────────────────────────────────────────────────────────────────────
// Landing › HeroSection
//
// Page-specific instantiation of the HeroBlock layout.
// All text and data imported from @/data/landing.
// Behavioral logic (form submit, auth, routing) lives in RepoAnalyzeForm.
// ─────────────────────────────────────────────────────────────────────────────

/** Preview card rendered in the right panel slot of HeroBlock */
function PreviewPanel() {
  return (
    <div className="gf-card relative overflow-hidden rounded-2xl p-5 shadow-[0_24px_64px_rgba(0,0,0,0.5)]">
      {/* Traffic-light header */}
      <div className="mb-4 flex items-center gap-2 border-b border-fg/8 pb-3">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-tomato-jam/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-metallic-gold/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-fg/25" />
        </div>
        <span className="ml-2 text-[11px] font-mono text-fg/30">gitlore · cockpit</span>
      </div>

      {/* Mock file tree */}
      <div className="mb-4 space-y-1 text-[11px] font-mono">
        <div className="flex items-center gap-2 text-fg/70">
          <span className="text-tomato-jam/70">▼</span>
          <span>src/</span>
        </div>
        <div className="flex items-center gap-2 pl-4 text-fg/60">
          <span className="text-metallic-gold/70">▼</span>
          <span>components/</span>
        </div>
        {["auth/", "layout/", "ui/", "sections/"].map((f) => (
          <div key={f} className="flex items-center gap-2 pl-8 text-fg/35">
            <span>·</span>
            <span>{f}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 pl-4 text-fg/35">
          <span>▶</span>
          <span>api/</span>
        </div>
        <div className="flex items-center gap-2 pl-4 text-fg/35">
          <span>▶</span>
          <span>context/</span>
        </div>
      </div>

      {/* AI summary card */}
      <div className="rounded-xl bg-fg/5 p-3 border border-fg/8 mb-3">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-tomato-jam/80">
          AI Summary — AuthButton.tsx
        </p>
        <p className="text-[11px] leading-relaxed text-fg/60">
          Client-side auth control. Renders a loading skeleton, then either a
          user avatar dropdown with sign-out, or a sign-in button — driven
          entirely by NextAuth session state.
        </p>
      </div>

      {/* Capabilities grid — data from @/data/landing */}
      <div className="grid grid-cols-2 gap-1.5">
        {PREVIEW_CAPABILITIES.map(({ icon: Icon, label, color }) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded-lg bg-fg/5 px-2.5 py-2 border border-fg/5"
          >
            <Icon className={`h-3.5 w-3.5 shrink-0 ${color}`} />
            <span className="text-[10px] font-medium text-fg/55">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <HeroBlock
      as="main"
      environment="dark"
      eyebrow={
        <Eyebrow>
          <Sparkles className="h-3 w-3" />
          Clarity through code anatomy
        </Eyebrow>
      }
      headline={
        <>
          Speak{" "}
          <span className="bg-gradient-to-r from-tomato-jam to-metallic-gold bg-clip-text text-transparent">
            fluent repository
          </span>
          .
        </>
      }
      subheadline={
        <>
          Drop any GitHub repo and watch{" "}
          <span className="font-semibold bg-gradient-to-r from-tomato-jam to-metallic-gold bg-clip-text text-transparent">
            gitlore
          </span>{" "}
          summarize every file, function, and dependency — like a loyal teammate
          who already read the entire codebase before you arrived.
        </>
      }
      form={<RepoAnalyzeForm />}
      rightPanel={<PreviewPanel />}
    />
  );
}
