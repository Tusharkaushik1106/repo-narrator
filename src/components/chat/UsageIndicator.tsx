"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Zap } from "lucide-react";
import { UsageModal } from "./UsageModal";

export function UsageIndicator() {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!session?.user) return null;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-5 left-5 z-30 flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-900/90 backdrop-blur-xl px-3 py-2 text-xs shadow-lg transition-all hover:border-cyan-500/50 hover:bg-slate-800/90 hover:shadow-cyan-500/10"
        title="View usage statistics"
      >
        <Zap className="h-3.5 w-3.5 text-cyan-400" />
        <span className="font-semibold text-slate-200">Usage</span>
      </button>
      <UsageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

