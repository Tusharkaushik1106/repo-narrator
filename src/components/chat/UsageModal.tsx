"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Zap, X, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UsageStats {
  tokensUsed: number;
  tokensRemaining: number;
  requestCount: number;
  requestsRemaining: number;
}

interface UsageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UsageModal({ isOpen, onClose }: UsageModalProps) {
  const { data: session } = useSession();
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsage = useCallback(async (showRefreshing = false) => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    const userId = session.user.email || (session.user as { id?: string }).id;
    if (!userId) {
      setLoading(false);
      return;
    }

    if (showRefreshing) setRefreshing(true);
    try {
      const res = await fetch(`/api/usage?userId=${encodeURIComponent(userId)}&t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setUsage(data);
      }
    } catch (error) {
      console.error("Failed to fetch usage:", error);
    } finally {
      setLoading(false);
      if (showRefreshing) setRefreshing(false);
    }
  }, [session]);

  useEffect(() => {
    if (!isOpen || !session?.user) return;
    
    fetchUsage();
    const interval = setInterval(() => fetchUsage(), 5000); // Refresh every 5s when open
    return () => clearInterval(interval);
  }, [isOpen, session, fetchUsage]);

  useEffect(() => {
    if (!isOpen) return;
    
    const handleUsageUpdate = () => {
      fetchUsage(true);
    };
    
    window.addEventListener("usage-updated", handleUsageUpdate);
    return () => window.removeEventListener("usage-updated", handleUsageUpdate);
  }, [isOpen, fetchUsage]);

  if (!session?.user) return null;

  const tokenPercent = usage ? (usage.tokensUsed / 50000) * 100 : 0;
  const requestPercent = usage ? (usage.requestCount / 100) * 100 : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-1/2 top-1/2 z-[9999] w-full max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <div className="mx-4 rounded-xl border border-slate-700/50 bg-slate-900/95 backdrop-blur-xl p-5 shadow-2xl ring-1 ring-slate-700/50">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-sky-500/20 ring-1 ring-cyan-500/30">
                    <Zap className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-50">Usage Statistics</h3>
                    <p className="text-xs text-slate-400">Daily limits reset at midnight</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchUsage(true)}
                    disabled={refreshing}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-cyan-400 disabled:opacity-50"
                    title="Refresh"
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                  </button>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-slate-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {loading && !usage ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500/30 border-t-cyan-500" />
                </div>
              ) : usage ? (
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-300">Tokens</span>
                      <span className="text-sm text-slate-400">
                        {usage.tokensUsed.toLocaleString()} / 50,000
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(tokenPercent, 100)}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`h-full ${
                          tokenPercent > 90
                            ? "bg-gradient-to-r from-rose-500 to-red-600"
                            : tokenPercent > 70
                            ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                            : "bg-gradient-to-r from-cyan-500 to-sky-500"
                        }`}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {usage.tokensRemaining.toLocaleString()} tokens remaining
                    </p>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-300">Requests</span>
                      <span className="text-sm text-slate-400">
                        {usage.requestCount} / 100
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(requestPercent, 100)}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className={`h-full ${
                          requestPercent > 90
                            ? "bg-gradient-to-r from-rose-500 to-red-600"
                            : requestPercent > 70
                            ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                            : "bg-gradient-to-r from-sky-500 to-cyan-500"
                        }`}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {usage.requestsRemaining} requests remaining
                    </p>
                  </div>

                  <div className="mt-4 rounded-lg bg-slate-800/50 p-3 border border-slate-700/50">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <span className="font-semibold text-slate-300">Note:</span> Usage limits
                      help manage API costs and ensure fair access. Limits reset daily at midnight
                      UTC. Token counts include both input and response tokens from API calls.
                    </p>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Last updated: {new Date().toLocaleTimeString()}</span>
                    <span className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      Live tracking
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-slate-400">
                  Unable to load usage statistics
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

