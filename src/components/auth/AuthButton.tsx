"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { GithubIcon, LogOut, User, ChevronDown, Mail } from "lucide-react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export function AuthButton() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  if (status === "loading") {
    return (
      <div className="inline-flex h-9 items-center gap-2 rounded-lg bg-slate-800/60 px-3 text-sm text-slate-400">
        <div className="h-3 w-3 animate-pulse rounded-full bg-slate-600" />
        <span className="hidden sm:inline">Loading...</span>
      </div>
    );
  }

  if (session?.user) {
    const userEmail = session.user.email || "";
    const userName = session.user.name || "";
    const displayName = userName || userEmail.split("@")[0] || "User";
    const displayEmail = userEmail || "";

    return (
      <div className="relative z-[100]" ref={dropdownRef}>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="group inline-flex items-center gap-2.5 rounded-lg bg-gradient-to-r from-slate-800/80 to-slate-900/80 px-3 py-2 text-sm font-medium text-slate-200 ring-1 ring-slate-700/70 transition-all hover:from-slate-700/90 hover:to-slate-800/90 hover:ring-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10 max-w-[280px] sm:max-w-none"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-sky-500/20 ring-1 ring-cyan-500/30">
            <User className="h-3.5 w-3.5 text-cyan-400" />
          </div>
          <div className="hidden min-w-0 flex-col items-start sm:flex">
            <span className="text-xs font-semibold text-slate-100 truncate max-w-[140px]">{displayName}</span>
            {displayEmail && (
              <span className="text-[10px] text-slate-400 truncate max-w-[140px]">{displayEmail}</span>
            )}
          </div>
          <div className="flex min-w-0 flex-col items-start sm:hidden">
            <span className="text-xs font-semibold text-slate-100 truncate max-w-[100px]">{displayName}</span>
          </div>
          <ChevronDown
            className={clsx(
              "h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform",
              isOpen && "rotate-180 text-cyan-400"
            )}
          />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-700/70 bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-slate-900/50 ring-1 ring-slate-700/50 overflow-hidden z-[9999]"
            >
              <div className="p-3 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-sky-500/20 ring-2 ring-cyan-500/30">
                    <User className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-100 truncate">
                      {displayName}
                    </p>
                    {displayEmail && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Mail className="h-3 w-3 text-slate-500" />
                        <p className="text-xs text-slate-400 truncate">{displayEmail}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-1.5">
                <button
                  onClick={() => {
                    signOut({ callbackUrl: "/" });
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-rose-500/10 hover:text-rose-300 group"
                >
                  <LogOut className="h-4 w-4 text-rose-400 group-hover:text-rose-300" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <motion.button
      onClick={() => signIn(undefined, { callbackUrl: "/" })}
      className={clsx(
        "inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-sky-500 px-4 py-2 text-sm font-semibold transition-all",
        "text-slate-950 shadow-lg shadow-cyan-500/40",
        "hover:from-cyan-400 hover:to-sky-400 hover:shadow-xl hover:shadow-cyan-500/50",
        "focus-ring-glow active:scale-95"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <GithubIcon className="h-4 w-4" />
      <span>Sign In</span>
    </motion.button>
  );
}

