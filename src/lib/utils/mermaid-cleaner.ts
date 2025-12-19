export function cleanMermaidCode(raw: string): string {
  if (!raw) return "";

  // 1. Remove markdown code fences
  let clean = raw.replace(/```mermaid/gi, "").replace(/```/g, "");

  // 2. Normalise whitespace
  clean = clean.trim();

  // 3. For sequence diagrams, make sure the header is on its own line
  //    e.g. "sequenceDiagram participant A" -> "sequenceDiagram\nparticipant A"
  clean = clean.replace(
    /^\s*(sequenceDiagram)([^\n]*)$/i,
    (_match, header: string, rest: string) =>
      rest.trim().length ? `${header}\n${rest.trim()}` : header
  );

  // 4. Ensure each Mermaid participant declaration is on its own line.
  //    This fixes cases like: "participant Aparticipant B"
  clean = clean.replace(
    /(participant\s+[^\n]+?)(?=participant\s)/g,
    (_match, first: string) => `${first}\n`
  );

  // 5. If there is no explicit diagram type at the top, default to "graph TD"
  //    Treat "graph", "flowchart", and "sequenceDiagram" as valid headers.
  const hasDiagramHeader = /^(\s*(graph|flowchart|sequenceDiagram)\b)/i.test(
    clean
  );
  if (!hasDiagramHeader) {
    clean = `graph TD\n${clean}`;
  }

  return clean;
}

