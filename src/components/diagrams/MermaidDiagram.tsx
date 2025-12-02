"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "strict",
});

interface MermaidDiagramProps {
  code: string;
}

export function MermaidDiagram({ code }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const render = async () => {
      try {
        let cleaned = code.trim();
        // Strip ```mermaid fences if the model included them.
        if (cleaned.startsWith("```")) {
          cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/, "").replace(/```$/, "");
        }
        const { svg } = await mermaid.render("mermaid-diagram", cleaned);
        ref.current!.innerHTML = svg;
      } catch {
        ref.current!.innerHTML =
          '<div class="text-xs text-rose-400">Failed to render Mermaid diagram.</div>';
      }
    };

    render();
  }, [code]);

  return <div ref={ref} className="w-full text-slate-100" />;
}


