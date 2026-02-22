"use client";

import { signIn } from "next-auth/react";
import { GithubIcon, Database, Zap, Shield, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { LogoMark } from "@/components/ui/LogoMark";

const PERKS = [
  { icon: Database, label: "Indexed repo history" },
  { icon: Zap,      label: "Instant AI summaries" },
  { icon: Shield,   label: "Private repo access" },
];

const GoogleIcon = (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden>
    <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#4285F4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default function SignInPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSignIn = async (provider: "github" | "google") => {
    setLoading(provider);
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch {
      setLoading(null);
    }
  };

  return (
    <main className="relative flex min-h-dvh overflow-hidden">

      {/* ── Left: brand panel (desktop only) ── */}
      <div className="relative hidden lg:flex lg:w-[46%] flex-col justify-between p-12 border-r border-fg/8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-tomato-jam/10 via-transparent to-metallic-gold/5" />

        {/* Brand mark */}
        <Link href="/" className="relative flex items-center gap-2.5 w-fit group">
          <div className="h-9 w-9 rounded-xl overflow-hidden shadow-[0_0_0_1px_rgba(192,57,43,0.28),0_0_16px_rgba(192,57,43,0.14)]">
            <LogoMark className="h-full w-full" />
          </div>
          <span className="text-[17px] font-semibold text-fg/90 group-hover:text-fg transition-colors">
            gitlore
          </span>
        </Link>

        {/* Pitch */}
        <div className="relative space-y-6">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-tomato-jam/80">
              AI-powered repo intelligence
            </p>
            <h2 className="text-3xl font-semibold text-fg leading-snug">
              Understand any codebase<br />in under 60 seconds.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-fg/45">
              gitlore parses your repository, maps its architecture, and gives you an AI that knows every file — instantly.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {PERKS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full border border-fg/10 bg-fg/5 px-3 py-1.5 text-xs text-fg/55"
              >
                <Icon className="h-3 w-3 text-tomato-jam/70 shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs italic text-fg/20">"speak fluent repository"</p>
      </div>

      {/* ── Right: auth panel ── */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-16">
        {/* Background accent */}
        <div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-tomato-jam/8 blur-3xl" />

        {/* Back link */}
        <Link
          href="/"
          className="absolute top-6 left-6 inline-flex items-center gap-1.5 text-xs text-fg/35 transition-colors hover:text-fg/65"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>

        <motion.div
          className="relative z-10 w-full max-w-[340px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Mobile-only brand */}
          <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden w-fit">
            <div className="h-8 w-8 rounded-xl overflow-hidden shadow-[0_0_0_1px_rgba(192,57,43,0.28)]">
              <LogoMark className="h-full w-full" />
            </div>
            <span className="text-base font-semibold text-fg/90">gitlore</span>
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-fg">Sign in</h1>
            <p className="mt-1.5 text-sm text-fg/40">
              Continue to your gitlore workspace
            </p>
          </div>

          {/* Auth buttons */}
          <div className="space-y-2.5">
            {/* GitHub — primary */}
            <motion.button
              onClick={() => handleSignIn("github")}
              disabled={loading !== null}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-fg/90 px-4 py-3 text-sm font-semibold text-canvas transition-all hover:bg-fg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === "github" ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-canvas/20 border-t-canvas" />
              ) : (
                <GithubIcon className="h-4 w-4 shrink-0" />
              )}
              Continue with GitHub
            </motion.button>

            {/* Google — secondary */}
            <motion.button
              onClick={() => handleSignIn("google")}
              disabled={loading !== null}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-fg/12 bg-fg/[0.04] px-4 py-3 text-sm font-semibold text-fg/75 transition-all hover:bg-fg/[0.08] hover:border-fg/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === "google" ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-fg/15 border-t-fg/60" />
              ) : (
                GoogleIcon
              )}
              Continue with Google
            </motion.button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-fg/8" />
            <span className="text-[10px] text-fg/25 tracking-wide">secure OAuth · no passwords stored</span>
            <div className="h-px flex-1 bg-fg/8" />
          </div>

          {/* Legal */}
          <p className="text-center text-[11px] leading-relaxed text-fg/25">
            By continuing you agree to our{" "}
            <Link href="/terms" className="text-fg/40 underline underline-offset-2 hover:text-tomato-jam transition-colors">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-fg/40 underline underline-offset-2 hover:text-tomato-jam transition-colors">
              privacy policy
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </main>
  );
}
