export function cleanMermaidCode(raw: string): string {
  if (!raw) return "";

  let clean = raw.replace(/```mermaid/gi, "").replace(/```/g, "");

  clean = clean.trim();

  clean = clean.replace(
    /^\s*(sequenceDiagram)([^\n]*)$/i,
    (_match, header: string, rest: string) =>
      rest.trim().length ? `${header}\n${rest.trim()}` : header
  );

  clean = clean.replace(
    /(participant\s+[^\n]+?)(?=participant\s)/g,
    (_match, first: string) => `${first}\n`
  );

  const hasDiagramHeader = /^(\s*(graph|flowchart|sequenceDiagram)\b)/i.test(
    clean
  );
  if (!hasDiagramHeader) {
    clean = `graph TD\n${clean}`;
  }

  return clean;
}

