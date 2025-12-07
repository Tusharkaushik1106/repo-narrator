"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "strict",
  fontFamily: "inherit",
  fontSize: 14,
  logLevel: "fatal", 
});

interface MermaidDiagramProps {
  code: string;
  id?: string;
}

export function MermaidDiagram({ code, id = "mermaid-diagram" }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isRendering, setIsRendering] = useState(true);
  const renderedCodeRef = useRef<string>("");
  const isRenderingRef = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    
    
    const normalizedCode = code.trim().replace(/\s+/g, " ");
    const normalizedRendered = renderedCodeRef.current.trim().replace(/\s+/g, " ");
    
    
    if (normalizedRendered === normalizedCode && normalizedCode !== "") {
      return;
    }
    
    
    if (isRenderingRef.current) {
      return;
    }

    setIsRendering(true);
    isRenderingRef.current = true;
    
    const render = async () => {
      let cleaned = code.trim(); 
      
      try {
        
        
        if (!cleaned) {
          if (ref.current) {
            ref.current.innerHTML = "";
          }
          return;
        }
        
        
        if (cleaned.startsWith("```")) {
          cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/, "").replace(/```$/gm, "").trim();
        }
        
        
        cleaned = cleaned
          .replace(/^["']|["']$/g, "")
          .replace(/\\n/g, "\n")
          .replace(/\\"/g, '"')
          .trim();
        
        const validStarts = [
          "sequenceDiagram",
          "flowchart",
          "graph",
          "classDiagram",
          "stateDiagram",
          "erDiagram",
          "journey",
          "gantt",
          "pie",
          "gitgraph",
        ];
        
        const firstLine = cleaned.split("\n")[0].trim();
        const isValid = validStarts.some((start) => firstLine.startsWith(start));
        
        if (!isValid) {
          if (cleaned.includes("->") || cleaned.includes("-->") || cleaned.includes("participant")) {
            cleaned = `sequenceDiagram\n${cleaned}`;
          } else if (
            cleaned.includes("Node") || 
            cleaned.includes("Start") || 
            cleaned.includes("End") ||
            cleaned.includes("[") ||
            cleaned.includes("-->") ||
            cleaned.match(/[A-Z]\[/)
          ) {
            cleaned = `flowchart TD\n${cleaned}`;
          } else if (cleaned.includes("class ") || cleaned.includes("Class")) {
            cleaned = `classDiagram\n${cleaned}`;
          } else {
            cleaned = `flowchart TD\n${cleaned}`;
          }
        }
        
        if (cleaned.startsWith("flowchart") || cleaned.startsWith("graph")) {
          const lines = cleaned.split("\n");
          const fixedLines = lines.map((line, index) => {
            let fixed = line.trim();
            if (!fixed) return fixed;
            
            if (fixed.match(/-->\s*"[^"]*$/)) {
              fixed = fixed + '"';
            }
            
            if (fixed.match(/^[A-Z]\["[^"]*$/)) {
              fixed = fixed + '"]';
            }
            
            if (fixed.match(/^[A-Z]\["[^"]*"$/)) {
              fixed = fixed + "]";
            }
            
            if (fixed.startsWith('"') && !fixed.endsWith('"') && !fixed.includes('"', 1)) {
              const arrowIndex = fixed.indexOf(" -->");
              if (arrowIndex > 0) {
                fixed = fixed.slice(0, arrowIndex) + '"' + fixed.slice(arrowIndex);
              } else {
                fixed = fixed + '"';
              }
            }
            
            if (fixed.match(/-->\s*"[^"]*$/)) {
              fixed = fixed + '"';
            }
            
            return fixed;
          });
          cleaned = fixedLines.join("\n");
          
          cleaned = cleaned.replace(/([A-Z])\[([^\]]+)\]/g, (match, nodeId, label) => {
            let cleanLabel = label.replace(/^["']|["']$/g, "").trim();
            
            if (cleanLabel.includes(" ") || cleanLabel.includes("'") || cleanLabel.includes('"') || 
                cleanLabel.includes("/") || cleanLabel.includes("(") || cleanLabel.includes(")") || 
                cleanLabel.includes("-") || cleanLabel.includes(".")) {
              const escapedLabel = cleanLabel.replace(/"/g, '\\"').replace(/\n/g, " ").trim();
              return `${nodeId}["${escapedLabel}"]`;
            }
            return match;
          });
          
          cleaned = cleaned.replace(/([A-Z])\{([^}]+)\}/g, (match, nodeId, label) => {
            let cleanLabel = label.replace(/^["']|["']$/g, "").trim();
            if (cleanLabel.includes(" ") || cleanLabel.includes("'") || cleanLabel.includes('"') || 
                cleanLabel.includes("/") || cleanLabel.includes("(") || cleanLabel.includes(")") || 
                cleanLabel.includes("-") || cleanLabel.includes(".")) {
              const escapedLabel = cleanLabel.replace(/"/g, '\\"').replace(/\n/g, " ").trim();
              return `${nodeId}{"${escapedLabel}"}`;
            }
            return match;
          });
          
          cleaned = cleaned.replace(/--\s+([^->]+?)\s*-->/g, (match, label) => {
            const trimmedLabel = label.trim().replace(/^["']|["']$/g, "");
            if (trimmedLabel && (trimmedLabel.includes(" ") || trimmedLabel.includes("'") || 
                trimmedLabel.includes('"') || trimmedLabel.includes("?") || trimmedLabel.includes("-"))) {
              const escapedLabel = trimmedLabel.replace(/"/g, '\\"');
              return `-- "${escapedLabel}" -->`;
            }
            return match;
          });
          
          cleaned = cleaned.replace(/^([A-Z])\s*-->\s*"([^"]*)$/gm, (match, nodeId, label) => {
            return `${nodeId} --> "${label}"`;
          });
          
          cleaned = cleaned.replace(/"([^"]+)"\s*-->\s*"([^"]+)"/g, (match, from, to) => {
            return `"${from}" --> "${to}"`;
          });
          
          cleaned = cleaned.replace(/;\s*$/gm, "");
          
          cleaned = cleaned.replace(/\s*-->\s*/g, " --> ");
          cleaned = cleaned.replace(/\s*--\s+/g, " -- ");
          
          cleaned = cleaned.split("\n").filter(line => line.trim()).join("\n");
        }
        
        const uniqueId = `${id}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const { svg } = await mermaid.render(uniqueId, cleaned);
        
        if (ref.current && isRenderingRef.current) {
          ref.current.innerHTML = svg;
          const svgElement = ref.current.querySelector("svg");
          if (svgElement) {
            svgElement.style.willChange = "transform";
            svgElement.style.transform = "translateZ(0)";
            const elements = svgElement.querySelectorAll("path, text, rect, circle, ellipse, line, polygon, polyline");
            elements.forEach((el) => {
              (el as HTMLElement).style.willChange = "transform";
            });
          }
          renderedCodeRef.current = code.trim();
        }
      } catch (error) {
        if (ref.current && isRenderingRef.current) {
          const escapedCode = (cleaned || code)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
          
          const errorHtml = `
            <div class="p-3 rounded-lg border border-rose-500/30 bg-rose-950/20">
              <p class="text-xs text-rose-400 font-medium mb-2">Unable to render Mermaid diagram</p>
              <details class="text-xs">
                <summary class="text-slate-400 cursor-pointer hover:text-slate-300 mb-1">View error details</summary>
                <pre class="mt-2 p-2 bg-slate-900/50 rounded text-slate-300 text-[10px] overflow-auto max-h-32 whitespace-pre-wrap">${escapedCode}</pre>
              </details>
            </div>
          `;
          ref.current.innerHTML = errorHtml;
        }
        if (process.env.NODE_ENV === "development") {
          console.warn("Mermaid render error:", error);
          console.warn("Mermaid code that failed:", cleaned);
        }
      } finally {
        isRenderingRef.current = false;
        setIsRendering(false);
      }
    };

    render();
    
    return () => {
      isRenderingRef.current = false;
    };
  }, [code, id]);

  return (
    <div
      ref={ref}
      className="w-full text-slate-100"
      style={{
        willChange: "transform",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        perspective: "1000px",
      }}
    />
  );
}


