"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "strict",
  fontFamily: "inherit",
  fontSize: 14,
  logLevel: "fatal", // Suppress most Mermaid logs
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
    
    // Normalize code for comparison (trim and remove extra whitespace)
    const normalizedCode = code.trim().replace(/\s+/g, " ");
    const normalizedRendered = renderedCodeRef.current.trim().replace(/\s+/g, " ");
    
    // Skip if already rendered with the same content
    if (normalizedRendered === normalizedCode && normalizedCode !== "") {
      return;
    }
    
    // Prevent concurrent renders
    if (isRenderingRef.current) {
      return;
    }

    setIsRendering(true);
    isRenderingRef.current = true;
    
    const render = async () => {
      let cleaned = code.trim(); // Declare outside try for error display
      
      try {
        
        // Return early if empty
        if (!cleaned) {
          if (ref.current) {
            ref.current.innerHTML = "";
          }
          return;
        }
        
        // Strip ```mermaid fences if the model included them.
        if (cleaned.startsWith("```")) {
          cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/, "").replace(/```$/gm, "").trim();
        }
        
        // Clean up common JSON artifacts that might be in the response (do this BEFORE validation)
        cleaned = cleaned
          .replace(/^["']|["']$/g, "") // Remove surrounding quotes
          .replace(/\\n/g, "\n") // Unescape newlines
          .replace(/\\"/g, '"') // Unescape quotes
          .trim();
        
        // Basic validation and auto-fix: check if it starts with a valid diagram type
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
          // Try to fix common issues
          if (cleaned.includes("->") || cleaned.includes("-->") || cleaned.includes("participant")) {
            // Looks like a sequence diagram but missing declaration
            cleaned = `sequenceDiagram\n${cleaned}`;
          } else if (
            cleaned.includes("Node") || 
            cleaned.includes("Start") || 
            cleaned.includes("End") ||
            cleaned.includes("[") ||
            cleaned.includes("-->") ||
            cleaned.match(/[A-Z]\[/)
          ) {
            // Looks like a flowchart but missing declaration
            cleaned = `flowchart TD\n${cleaned}`;
          } else if (cleaned.includes("class ") || cleaned.includes("Class")) {
            // Looks like a class diagram
            cleaned = `classDiagram\n${cleaned}`;
          } else {
            // Last resort: try as a simple flowchart
            cleaned = `flowchart TD\n${cleaned}`;
          }
        }
        
        // Fix common Mermaid syntax issues for flowcharts
        if (cleaned.startsWith("flowchart") || cleaned.startsWith("graph")) {
          // 0. Fix incomplete lines (missing closing quotes, brackets, etc.)
          const lines = cleaned.split("\n");
          const fixedLines = lines.map((line, index) => {
            let fixed = line.trim();
            if (!fixed) return fixed;
            
            // Fix unclosed quotes in arrow statements (most common issue)
            // Pattern: "Node Name" --> "Other Node (missing closing quote)
            if (fixed.match(/-->\s*"[^"]*$/)) {
              fixed = fixed + '"';
            }
            
            // Fix unclosed quotes in node definitions
            // Pattern: A["Node Name (missing closing quote and bracket)
            if (fixed.match(/^[A-Z]\["[^"]*$/)) {
              fixed = fixed + '"]';
            }
            
            // Fix lines with opening quote but no closing bracket
            // Pattern: A["Node Name" (missing closing bracket)
            if (fixed.match(/^[A-Z]\["[^"]*"$/)) {
              fixed = fixed + "]";
            }
            
            // Fix lines starting with quote but missing closing quote
            // Pattern: "Node Name --> Other (missing closing quote)
            if (fixed.startsWith('"') && !fixed.endsWith('"') && !fixed.includes('"', 1)) {
              // Find where the quote should close (before --> or at end)
              const arrowIndex = fixed.indexOf(" -->");
              if (arrowIndex > 0) {
                fixed = fixed.slice(0, arrowIndex) + '"' + fixed.slice(arrowIndex);
              } else {
                fixed = fixed + '"';
              }
            }
            
            // Fix node references in arrows that are missing closing quotes
            // Pattern: --> "Node Name (missing closing quote)
            if (fixed.match(/-->\s*"[^"]*$/)) {
              fixed = fixed + '"';
            }
            
            return fixed;
          });
          cleaned = fixedLines.join("\n");
          
          // 1. Quote node labels that contain spaces or special characters
          // Handle both quoted and unquoted labels
          cleaned = cleaned.replace(/([A-Z])\[([^\]]+)\]/g, (match, nodeId, label) => {
            // Remove existing quotes if present
            let cleanLabel = label.replace(/^["']|["']$/g, "").trim();
            
            // If label has spaces, quotes, or special chars, quote it
            if (cleanLabel.includes(" ") || cleanLabel.includes("'") || cleanLabel.includes('"') || 
                cleanLabel.includes("/") || cleanLabel.includes("(") || cleanLabel.includes(")") || 
                cleanLabel.includes("-") || cleanLabel.includes(".")) {
              // Escape quotes in label and remove newlines
              const escapedLabel = cleanLabel.replace(/"/g, '\\"').replace(/\n/g, " ").trim();
              return `${nodeId}["${escapedLabel}"]`;
            }
            return match;
          });
          
          // 2. Fix decision nodes (diamonds) with spaces in labels
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
          
          // 3. Fix edge labels (text on arrows) - they need to be quoted if they have spaces
          cleaned = cleaned.replace(/--\s+([^->]+?)\s*-->/g, (match, label) => {
            const trimmedLabel = label.trim().replace(/^["']|["']$/g, "");
            if (trimmedLabel && (trimmedLabel.includes(" ") || trimmedLabel.includes("'") || 
                trimmedLabel.includes('"') || trimmedLabel.includes("?") || trimmedLabel.includes("-"))) {
              const escapedLabel = trimmedLabel.replace(/"/g, '\\"');
              return `-- "${escapedLabel}" -->`;
            }
            return match;
          });
          
          // 4. Fix incomplete arrow statements (missing closing quote or bracket)
          cleaned = cleaned.replace(/^([A-Z])\s*-->\s*"([^"]*)$/gm, (match, nodeId, label) => {
            return `${nodeId} --> "${label}"`;
          });
          
          // 5. Ensure all node references in arrows are properly formatted
          // Fix patterns like: "Node Name" --> "Other Node" (should work, but ensure consistency)
          cleaned = cleaned.replace(/"([^"]+)"\s*-->\s*"([^"]+)"/g, (match, from, to) => {
            // If node IDs are quoted strings with spaces, they need to be defined first
            // For now, just ensure proper spacing
            return `"${from}" --> "${to}"`;
          });
          
          // 6. Remove trailing semicolons (they're optional in Mermaid)
          cleaned = cleaned.replace(/;\s*$/gm, "");
          
          // 7. Ensure proper spacing around arrows
          cleaned = cleaned.replace(/\s*-->\s*/g, " --> ");
          cleaned = cleaned.replace(/\s*--\s+/g, " -- ");
          
          // 8. Remove empty lines
          cleaned = cleaned.split("\n").filter(line => line.trim()).join("\n");
        }
        
        const uniqueId = `${id}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const { svg } = await mermaid.render(uniqueId, cleaned);
        
        // Double-check ref is still valid before updating
        if (ref.current && isRenderingRef.current) {
          ref.current.innerHTML = svg;
          // Optimize SVG for performance
          const svgElement = ref.current.querySelector("svg");
          if (svgElement) {
            svgElement.style.willChange = "transform";
            svgElement.style.transform = "translateZ(0)";
            // Make all paths and text elements GPU-accelerated
            const elements = svgElement.querySelectorAll("path, text, rect, circle, ellipse, line, polygon, polyline");
            elements.forEach((el) => {
              (el as HTMLElement).style.willChange = "transform";
            });
          }
          // Store normalized code to prevent unnecessary re-renders
          renderedCodeRef.current = code.trim();
        }
      } catch (error) {
        // Show error with option to view the code
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
        // Log error in development only
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
    
    // Cleanup function to prevent clearing on unmount
    return () => {
      // Don't clear the content on unmount - let React handle it
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


