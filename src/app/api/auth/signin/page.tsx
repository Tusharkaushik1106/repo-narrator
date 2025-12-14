"use client";

import { signIn } from "next-auth/react";
import { GithubIcon, Sparkles, Zap, Shield, Database, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

export default function SignInPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSignIn = async (provider: "github" | "google") => {
    setLoading(provider);
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch (error) {
      setLoading(null);
    }
  };

  const features = [
    { icon: Database, text: "Save repository diagrams" },
    { icon: Zap, text: "Access your dashboard" },
    { icon: Shield, text: "Secure authentication" },
  ];

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-fuchsia-500/20 blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="glass-panel relative overflow-hidden px-8 py-10 sm:px-10 sm:py-12"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="pointer-events-none absolute inset-0 rounded-[1.25rem] bg-gradient-to-r from-cyan-500/20 via-transparent to-fuchsia-500/20 opacity-50" />
          <div className="pointer-events-none absolute inset-0 rounded-[1.25rem] bg-[radial-gradient(circle_at_0%_0%,rgba(34,211,238,0.15),transparent_60%),radial-gradient(circle_at_100%_100%,rgba(236,72,153,0.15),transparent_60%)] opacity-80 mix-blend-screen" />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href="/"
                className="mb-8 inline-flex items-center gap-2.5 text-lg font-semibold text-slate-50 transition-all hover:text-cyan-400 group"
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
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <h1 className="mb-3 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
                Welcome back
              </h1>
              <p className="text-sm leading-relaxed text-slate-400 sm:text-base">
                Sign in to unlock the full power of gitlore and start exploring repositories with AI-powered insights.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8 space-y-2.5"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3 text-sm text-slate-300"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-sky-500/20 ring-1 ring-cyan-500/30">
                    <feature.icon className="h-3.5 w-3.5 text-cyan-400" />
                  </div>
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <motion.button
                onClick={() => handleSignIn("github")}
                disabled={loading !== null}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={clsx(
                  "group relative w-full inline-flex items-center justify-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all overflow-hidden",
                  "bg-gradient-to-r from-slate-800/90 to-slate-900/90 text-slate-200 ring-1 ring-slate-700/70",
                  "hover:from-slate-700/95 hover:to-slate-800/95 hover:text-slate-50 hover:ring-slate-600/80 hover:shadow-lg hover:shadow-cyan-500/10",
                  "focus-ring-glow disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 transition-opacity group-hover:opacity-100" />
                <GithubIcon className="relative z-10 h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="relative z-10">Continue with GitHub</span>
                {loading === "github" && (
                  <div className="relative z-10 ml-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                )}
              </motion.button>

              <motion.button
                onClick={() => handleSignIn("google")}
                disabled={loading !== null}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={clsx(
                  "group relative w-full inline-flex items-center justify-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all overflow-hidden",
                  "bg-white text-slate-900 ring-1 ring-slate-300/50 shadow-md",
                  "hover:bg-slate-50 hover:ring-slate-400/60 hover:shadow-lg hover:shadow-slate-500/20",
                  "focus-ring-glow disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-100/0 via-slate-100/50 to-slate-100/0 opacity-0 transition-opacity group-hover:opacity-100" />
                <svg className="relative z-10 h-5 w-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="relative z-10">Continue with Google</span>
                {loading === "google" && (
                  <div className="relative z-10 ml-2 h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-transparent" />
                )}
              </motion.button>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center text-xs leading-relaxed text-slate-500"
            >
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors">
                terms of service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors">
                privacy policy
              </Link>
              .
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 text-center"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-cyan-400 group"
              >
                <ArrowRight className="h-3 w-3 rotate-180 transition-transform group-hover:-translate-x-0.5" />
                <span>Back to home</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}

