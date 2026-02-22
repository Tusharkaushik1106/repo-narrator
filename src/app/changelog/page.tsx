import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, GitFork } from "lucide-react";
import { RELEASES, CHANGE_META, TAG_META } from "@/data/changelog";

export const metadata: Metadata = {
  title: "Changelog — gitlore",
  description: "Every release, improvement, and fix — documented.",
};

// ─────────────────────────────────────────────────────────────────────────────
// Changelog page
// ─────────────────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ChangelogPage() {
  return (
    <div className="relative z-10 mx-auto w-full max-w-3xl px-4 pb-24 pt-10 sm:px-6">

      {/* ── Page header ──────────────────────────────────────── */}
      <div className="mb-14">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-xs font-medium text-fg/35 transition-colors hover:text-fg/65"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-tomato-jam/12 border border-tomato-jam/20">
            <GitFork className="h-4.5 w-4.5 text-tomato-jam/80" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-tomato-jam/60">
            Release notes
          </span>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          Changelog
        </h1>
        <p className="mt-3 text-base text-fg/50 max-w-xl">
          Every release, improvement, and fix — in order. Updated with each deploy.
        </p>
      </div>

      {/* ── Timeline ─────────────────────────────────────────── */}
      <div className="relative">
        {/* Vertical timeline line */}
        <div
          aria-hidden
          className="absolute left-[11px] top-2 bottom-0 w-px bg-gradient-to-b from-tomato-jam/30 via-fg/8 to-transparent"
        />

        <ol className="space-y-12">
          {RELEASES.map((release, idx) => {
            const tag = TAG_META[release.tag];
            const Icon = release.icon;

            return (
              <li key={release.version} className="relative pl-10">
                {/* Timeline dot */}
                <div
                  aria-hidden
                  className={[
                    "absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full border",
                    idx === 0
                      ? "bg-tomato-jam/15 border-tomato-jam/35 shadow-[0_0_12px_rgba(192,57,43,0.25)]"
                      : "bg-fg/5 border-fg/12",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "h-2 w-2 rounded-full",
                      idx === 0 ? "bg-tomato-jam/80" : "bg-fg/30",
                    ].join(" ")}
                  />
                </div>

                {/* Release card */}
                <div className="rounded-2xl border border-fg/8 bg-fg/[0.02] p-6 transition-colors hover:border-fg/12 hover:bg-fg/[0.035]">

                  {/* Card header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-fg/5 border border-fg/8">
                        <Icon className={`h-4.5 w-4.5 ${release.iconColor}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="text-base font-semibold text-fg">
                            {release.title}
                          </span>
                          {/* Tag badge */}
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tag.color} ${tag.bg} ${tag.border}`}
                          >
                            {release.tag}
                          </span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-fg/35">
                          <span className="font-mono">v{release.version}</span>
                          <span aria-hidden className="text-fg/20">·</span>
                          <time dateTime={release.date}>{formatDate(release.date)}</time>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="mb-5 text-sm text-fg/55 leading-relaxed">
                    {release.summary}
                  </p>

                  {/* Change list */}
                  <ul className="space-y-2.5">
                    {release.changes.map((change, i) => {
                      const meta = CHANGE_META[change.type];
                      return (
                        <li key={i} className="flex items-start gap-3">
                          {/* Type dot */}
                          <span
                            aria-hidden
                            className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${meta.dot}`}
                          />
                          <div className="flex items-baseline gap-2 min-w-0">
                            <span
                              className={`shrink-0 text-[10px] font-semibold uppercase tracking-wide ${meta.color}`}
                            >
                              {meta.label}
                            </span>
                            <span className="text-sm text-fg/60 leading-relaxed">
                              {change.description}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>

        {/* End of timeline marker */}
        <div className="relative pl-10 pt-8">
          <div
            aria-hidden
            className="absolute left-0 top-8 flex h-5 w-5 items-center justify-center"
          >
            <span className="h-2 w-2 rounded-full bg-fg/12" />
          </div>
          <p className="text-xs text-fg/25 italic">
            That&#39;s everything so far. More coming soon.
          </p>
        </div>
      </div>

    </div>
  );
}
