"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface NavItem {
  label:    string;
  href:     string;
  external?: boolean;
  /** Icon shown left of label */
  icon?:    React.ReactNode;
}

export interface NavbarProps {
  /** Brand content — logo + name */
  brand?:       React.ReactNode;
  /** Navigation links shown in the centre/left */
  navItems?:    NavItem[];
  /** Right-side slot — auth button, CTA, etc. */
  actions?:     React.ReactNode;
  /**
   * Extra slot rendered at the far right of the desktop nav — use for
   * a highlighted CTA button separate from the actions cluster.
   */
  cta?:         React.ReactNode;
  /** Sticky (default: true) */
  sticky?:      boolean;
  /**
   * When true the nav starts fully transparent and transitions to the
   * solid glass surface once the user scrolls past 40 px.
   * Intended for hero pages where the nav overlays a dark background.
   */
  transparent?: boolean;
  /**
   * Compact height variant — h-12 instead of h-16.
   * Used for the in-app (dashboard / workbench) navigation tier.
   */
  compact?:     boolean;
  /** Extra className for the outer <header> */
  className?:   string;
  /** Hides the navbar on these exact pathnames */
  hideOn?:      string[];
}

// ─────────────────────────────────────────────
// NavLink
// ─────────────────────────────────────────────

interface NavLinkProps extends NavItem {
  onClick?: () => void;
  /** Force light text — used inside the dark fullscreen mobile overlay */
  forceDark?: boolean;
}

function NavLink({ label, href, icon, external, onClick }: NavLinkProps) {
  const pathname = usePathname();
  // Treat a link as active when the current path starts with the href
  // (covers both exact matches and nested sub-routes) — but treat "/" as
  // exact-only so it doesn't highlight on every page.
  const isActive =
    href === "/" ? pathname === "/" : pathname?.startsWith(href) ?? false;

  const base = cn(
    "group relative inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2",
    "text-sm font-medium gf-transition-fast",
    isActive
      ? "text-tomato-jam"
      : "text-fg/55 hover:text-fg hover:bg-fg/5",
  );

  const content = (
    <>
      {icon && (
        <span
          className={cn(
            "h-4 w-4 transition-colors",
            isActive ? "text-tomato-jam" : "text-fg/30 group-hover:text-fg/60",
          )}
        >
          {icon}
        </span>
      )}
      <span>{label}</span>

      {/* Active indicator — shared spring layout animation across all links */}
      {isActive && (
        <motion.span
          layoutId="nav-indicator"
          className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-tomato-jam"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={base}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={base} onClick={onClick}>
      {content}
    </Link>
  );
}

// ─────────────────────────────────────────────
// MobileNavLink — full-width variant for the overlay
// ─────────────────────────────────────────────

function MobileNavLink({ label, href, icon, external, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    href === "/" ? pathname === "/" : pathname?.startsWith(href) ?? false;

  const base = cn(
    "group flex items-center gap-3 rounded-2xl px-5 py-4",
    "text-base font-semibold gf-transition-fast",
    isActive
      ? "bg-tomato-jam/10 text-tomato-jam"
      : "text-fg/70 hover:bg-fg/5 hover:text-fg",
  );

  const inner = (
    <>
      {icon && (
        <span
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            isActive ? "text-tomato-jam" : "text-fg/35 group-hover:text-fg/60",
          )}
        >
          {icon}
        </span>
      )}
      <span>{label}</span>
      {isActive && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-tomato-jam" />
      )}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={base}
        onClick={onClick}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={base} onClick={onClick}>
      {inner}
    </Link>
  );
}

// ─────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────

export function Navbar({
  brand,
  navItems = [],
  actions,
  cta,
  sticky      = true,
  transparent = false,
  compact     = false,
  className,
  hideOn      = [],
}: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled,   setScrolled]   = React.useState(false);

  // Scroll threshold: 40 px gives the hero a short breathing room before
  // the nav solidifies — matching the "300ms minimum hold" UX principle.
  React.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    handler(); // initialise synchronously in case page is already scrolled
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile overlay on route change
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll while mobile overlay is open
  React.useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  if (hideOn.includes(pathname ?? "")) return null;

  // ── Derived state ────────────────────────────────────────────────────────
  const isSolid = !transparent || scrolled;

  const headerCls = cn(
    sticky && "sticky top-0 z-50",
    "w-full",
    // Border
    isSolid ? "border-b border-fg/8" : "border-b border-transparent",
    // Background + blur
    isSolid
      ? "bg-canvas/85 backdrop-blur-xl"
      : "bg-transparent",
    // Shadow
    isSolid && scrolled && "shadow-[0_4px_24px_rgba(0,0,0,0.4)]",
    // Transition covers bg, border, shadow in one pass
    "transition-[background-color,border-color,box-shadow] duration-300 ease-in-out",
    className,
  );

  const rowHeight = compact ? "h-12" : "h-16";

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <header className={headerCls}>
        {/* Top accent hairline — only visible in solid state */}
        <AnimatePresence>
          {isSolid && (
            <motion.div
              key="accent-line"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-tomato-jam/25 to-transparent pointer-events-none"
            />
          )}
        </AnimatePresence>

        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8",
            rowHeight,
          )}
        >
          {/* Brand */}
          {brand && <div className="shrink-0">{brand}</div>}

          {/* Desktop nav — centred between brand and actions */}
          {navItems.length > 0 && (
            <nav
              className="hidden md:flex items-center gap-0.5"
              aria-label="Main navigation"
            >
              {navItems.map((item) => (
                <NavLink key={item.href} {...item} />
              ))}
            </nav>
          )}

          {/* Right cluster: actions + optional CTA + mobile trigger */}
          <div className="flex items-center gap-2">
            {/* Desktop-only actions (theme toggle, auth button, etc.) */}
            {actions && (
              <div className="hidden md:flex items-center gap-2">{actions}</div>
            )}

            {/* Desktop-only CTA — sits outside the actions cluster so it
                can have its own visual weight without competing with icons */}
            {cta && (
              <div className="hidden md:flex">{cta}</div>
            )}

            {/* Mobile hamburger — shown only when there is content to reveal */}
            {(navItems.length > 0 || actions || cta) && (
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className={cn(
                  "md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl",
                  "text-fg/60 gf-transition-fast",
                  "hover:bg-fg/8 hover:text-fg",
                  "outline-none focus-visible:ring-2 focus-visible:ring-tomato-jam/50",
                  "focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
                )}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Fullscreen mobile overlay ──────────────────────────────────────
          Rendered as a sibling so it covers the sticky header too.
          z-[9999] ensures it sits above every other stacking context.
          ─────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: "0%" }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              "fixed inset-0 z-[9999] flex flex-col",
              "bg-canvas/97 backdrop-blur-2xl",
              "md:hidden",
            )}
          >
            {/* Overlay header row — mirrors the nav height */}
            <div
              className={cn(
                "flex items-center justify-between px-4 shrink-0 border-b border-fg/8",
                rowHeight,
              )}
            >
              {brand && <div className="shrink-0">{brand}</div>}
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-xl",
                  "text-fg/60 gf-transition-fast",
                  "hover:bg-fg/8 hover:text-fg",
                  "outline-none focus-visible:ring-2 focus-visible:ring-tomato-jam/50",
                )}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable content area */}
            <div className="flex flex-col flex-1 overflow-y-auto px-4 py-6 gap-1">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.22, ease: [0, 0, 0.2, 1] }}
                >
                  <MobileNavLink
                    {...item}
                    onClick={() => setMobileOpen(false)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Pinned bottom: actions + CTA */}
            {(actions || cta) && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.22, ease: [0, 0, 0.2, 1] }}
                className="shrink-0 border-t border-fg/8 px-4 py-5 flex flex-col gap-3"
              >
                {cta && <div className="w-full">{cta}</div>}
                {actions && <div className="flex items-center gap-2 justify-end">{actions}</div>}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─────────────────────────────────────────────
// NavBrand — convenience logo+name component
// ─────────────────────────────────────────────

export interface NavBrandProps {
  href?:     string;
  logo?:     React.ReactNode;
  name?:     string;
  tagline?:  string;
  className?: string;
}

export function NavBrand({ href = "/", logo, name, tagline, className }: NavBrandProps) {
  const content = (
    <div className={cn("group inline-flex items-center gap-2.5 transition-opacity duration-150 hover:opacity-85", className)}>
      {logo && (
        <div className={cn(
          "relative shrink-0 h-8 w-8 rounded-xl overflow-hidden transition-shadow duration-200",
          "shadow-[0_0_0_1px_rgba(192,57,43,0.22),0_0_10px_rgba(192,57,43,0.1)]",
          "group-hover:shadow-[0_0_0_1px_rgba(192,57,43,0.45),0_0_18px_rgba(192,57,43,0.2)]",
        )}>
          {logo}
        </div>
      )}
      {(name || tagline) && (
        <div className="flex flex-col leading-none gap-[3px]">
          {name && (
            <span className="text-[15px] font-semibold tracking-tight text-fg/90 group-hover:text-fg transition-colors duration-150">
              {name}
            </span>
          )}
          {tagline && (
            <span className="text-[8px] font-medium tracking-[0.16em] uppercase text-fg/50 group-hover:text-fg/70 transition-colors duration-150">
              {tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
