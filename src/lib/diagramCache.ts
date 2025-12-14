export type DiagramPayload = {
  overview: string;
  architecture: string;
  keyComponents: string[];
  dataFlow: string;
  techStack: string[];
  dependencies: string[];
  mermaidArchitecture: string;
  mermaidDataFlow: string;
};

const diagramCache = new Map<string, DiagramPayload>();

export function getCachedDiagram(key: string): DiagramPayload | undefined {
  return diagramCache.get(key);
}

export function setCachedDiagram(key: string, payload: DiagramPayload): void {
  diagramCache.set(key, payload);
}

