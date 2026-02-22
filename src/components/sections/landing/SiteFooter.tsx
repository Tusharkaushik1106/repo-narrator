import Link from "next/link";
import { Github } from "lucide-react";
import { DarkSection } from "@/components/sections/DarkSection";
import { FOOTER_LINKS } from "@/data/landing";

// ─────────────────────────────────────────────────────────────────────────────
// SiteFooter
//
// Minimal footer — brand, navigation links, and a GitHub link.
// Navigation data imported from @/data/landing.
// ─────────────────────────────────────────────────────────────────────────────

export function SiteFooter() {
  return (
    <footer>
    <DarkSection spacing="sm" atmosphere={false}>
      <div className="border-t border-fg/8 pt-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between sm:gap-4">

          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl overflow-hidden ring-1 ring-tomato-jam/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="gitlore logo" className="h-full w-full object-contain" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-fg">gitlore</p>
              <p className="text-[9px] font-medium uppercase tracking-widest text-fg/30">
                speak fluent repository
              </p>
            </div>
          </div>

          {/* Nav links */}
          <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-x-6 gap-y-1">
            {FOOTER_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-xs text-fg/40 gf-transition hover:text-fg/70"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* GitHub */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-fg/35 gf-transition hover:text-fg/65"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>

        </div>

        {/* Legal */}
        <p className="mt-6 text-center text-[10px] text-fg/20">
          © {new Date().getFullYear()} gitlore · Analysis runs server-side and is not stored.
        </p>
      </div>
    </DarkSection>
    </footer>
  );
}
