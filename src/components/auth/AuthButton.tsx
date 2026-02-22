"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { GithubIcon, LogOut, User, ChevronDown, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
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
      <div className="inline-flex h-9 items-center gap-2 rounded-lg bg-fg/8 px-3 text-sm text-fg/50">
        <div className="h-3 w-3 animate-pulse rounded-full bg-fg/20" />
        <span className="hidden sm:inline">Loading…</span>
      </div>
    );
  }

  if (session?.user) {
    const userEmail   = session.user.email || "";
    const userName    = session.user.name  || "";
    const displayName  = userName || userEmail.split("@")[0] || "User";
    const displayEmail = userEmail || "";

    return (
      <div className="relative z-[100]" ref={dropdownRef}>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "group inline-flex items-center gap-2.5 rounded-xl px-3 py-2",
            "text-sm font-medium text-fg",
            "border border-fg/10 bg-canvas/80 backdrop-blur-sm",
            "gf-transition",
            "hover:border-tomato-jam/30 hover:bg-fg/5",
            "max-w-[280px] sm:max-w-none",
          )}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-tomato-jam/10 ring-1 ring-tomato-jam/20">
            <User className="h-3.5 w-3.5 text-tomato-jam" />
          </div>
          <div className="hidden min-w-0 flex-col items-start sm:flex">
            <span className="text-xs font-semibold text-fg truncate max-w-[140px]">{displayName}</span>
            {displayEmail && (
              <span className="text-[10px] text-fg/45 truncate max-w-[140px]">{displayEmail}</span>
            )}
          </div>
          <div className="flex min-w-0 flex-col items-start sm:hidden">
            <span className="text-xs font-semibold text-fg truncate max-w-[100px]">{displayName}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 shrink-0 text-fg/40 gf-transition-fast",
              isOpen && "rotate-180 text-tomato-jam",
            )}
          />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{    opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
              className={cn(
                "absolute right-0 mt-2 w-64 overflow-hidden z-[9999]",
                "rounded-2xl border border-fg/10",
                "bg-[var(--elevated-gradient)] backdrop-blur-xl",
                "shadow-[0_16px_48px_rgba(0,0,0,0.5)]",
              )}
            >
              <div className="p-3 border-b border-fg/8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tomato-jam/10 ring-2 ring-tomato-jam/20">
                    <User className="h-5 w-5 text-tomato-jam" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-fg truncate">{displayName}</p>
                    {displayEmail && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Mail className="h-3 w-3 text-fg/40" />
                        <p className="text-xs text-fg/45 truncate">{displayEmail}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-1.5">
                <button
                  onClick={() => { signOut({ callbackUrl: "/" }); setIsOpen(false); }}
                  className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-fg/70 gf-transition-fast hover:bg-tomato-jam/10 hover:text-tomato-jam group"
                >
                  <LogOut className="h-4 w-4 text-tomato-jam/60 group-hover:text-tomato-jam gf-transition-fast" />
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
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-4 py-2",
        "text-sm font-semibold text-white",
        "bg-tomato-jam shadow-lg shadow-tomato-jam/30",
        "gf-transition",
        "hover:bg-tomato-jam/85 hover:shadow-xl hover:shadow-tomato-jam/40",
        "gf-focus-ring focus-visible:ring-2 focus-visible:ring-tomato-jam/50 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      <GithubIcon className="h-4 w-4" />
      <span>Sign In</span>
    </motion.button>
  );
}
