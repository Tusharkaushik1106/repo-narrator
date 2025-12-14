"use client";

import { AuthButton } from "@/components/auth/AuthButton";
import { Sparkles, LayoutDashboard, Code2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function Header() {
  const pathname = usePathname();
  
  if (pathname === "/dashboard" || pathname === "/workbench" || pathname === "/loading" || pathname?.startsWith("/api/auth/signin")) {
    return null;
  }

  const isActive = (path: string) => pathname === path;

  return (
    <header             className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/30 bg-slate-950/70 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] transform-gpu will-change-transform">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/8 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.1),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 relative z-10 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="relative">
            <motion.div
              className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500/30 via-sky-500/30 to-cyan-500/30 blur-lg opacity-60"
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative flex items-center justify-center rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-950/90 to-slate-900/90 ring-1 ring-cyan-500/30 shadow-lg shadow-cyan-500/10 backdrop-blur-sm group-hover:ring-cyan-400/50 transition-all duration-300 h-10 w-10">
              <img 
                src="/logo.png" 
                alt="gitlore Logo" 
                className="h-full w-full object-contain transition-all duration-300 group-hover:scale-110 brightness-310 contrast-110 z-10" 
                style={{ filter: 'drop-shadow(0 0 1px rgba(34, 211, 238, 0.3))' }}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
            </div>
          </div>
          
          <div className="flex flex-col">
            <motion.span 
              className="text-base font-bold bg-gradient-to-r from-slate-50 via-cyan-100 to-slate-50 bg-clip-text text-transparent"
              whileHover={{ 
                backgroundImage: "linear-gradient(to right, #67e8f9, #22d3ee, #67e8f9)"
              }}
            >
              gitlore
            </motion.span>
            <span className="text-[9px] text-slate-500 font-medium tracking-[0.15em] uppercase leading-tight">
              your github slave
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-1.5">
          <Link
            href="/dashboard"
            className={`group relative hidden items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-300 sm:inline-flex ${
              isActive("/dashboard")
                ? "text-cyan-300"
                : "text-slate-400 hover:text-cyan-300"
            }`}
          >
            <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
              isActive("/dashboard")
                ? "bg-gradient-to-r from-cyan-500/15 to-sky-500/15 ring-1 ring-cyan-500/30 shadow-lg shadow-cyan-500/10"
                : "bg-slate-800/0 group-hover:bg-slate-800/40 group-hover:ring-1 group-hover:ring-cyan-500/20"
            }`} />
            
            <LayoutDashboard className={`h-4 w-4 relative z-10 transition-all duration-300 ${
              isActive("/dashboard") ? "text-cyan-400" : "text-slate-500 group-hover:text-cyan-400 group-hover:scale-110"
            }`} />
            <span className="relative z-10">Dashboard</span>
            
            {isActive("/dashboard") && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-sky-500/10 ring-1 ring-cyan-500/20"
                layoutId="activeNav"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </Link>
          
          <Link
            href="/workbench"
            className={`group relative hidden items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-300 sm:inline-flex ${
              isActive("/workbench")
                ? "text-cyan-300"
                : "text-slate-400 hover:text-cyan-300"
            }`}
          >
            <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
              isActive("/workbench")
                ? "bg-gradient-to-r from-cyan-500/15 to-sky-500/15 ring-1 ring-cyan-500/30 shadow-lg shadow-cyan-500/10"
                : "bg-slate-800/0 group-hover:bg-slate-800/40 group-hover:ring-1 group-hover:ring-cyan-500/20"
            }`} />
            
            <Code2 className={`h-4 w-4 relative z-10 transition-all duration-300 ${
              isActive("/workbench") ? "text-cyan-400" : "text-slate-500 group-hover:text-cyan-400 group-hover:scale-110"
            }`} />
            <span className="relative z-10">Workbench</span>
            
            {isActive("/workbench") && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-sky-500/10 ring-1 ring-cyan-500/20"
                layoutId="activeNav"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </Link>
          <div className="h-6 w-px bg-gradient-to-b from-transparent via-slate-700/60 to-transparent mx-1.5 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="relative">
            <AuthButton />
          </div>
        </nav>
      </div>
    </header>
  );
}

