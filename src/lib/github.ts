const GITHUB_BASE = "https://api.github.com";

function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "User-Agent": "gitlore",
    Accept: "application/vnd.github+json",
  };
  const pat = process.env.GITHUB_PAT;
  if (pat) {
    headers.Authorization = `Bearer ${pat}`;
  }
  return headers;
}

export async function fetchRepoMetadata(owner: string, name: string) {
  const res = await fetch(`${GITHUB_BASE}/repos/${owner}/${name}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch repository metadata from GitHub.");
  }
  return res.json();
}

export interface GitTreeEntry {
  path: string;
  type: "blob" | "tree";
  size?: number;
}

export async function fetchRepoTree(
  owner: string,
  name: string,
): Promise<GitTreeEntry[]> {
  const res = await fetch(
    `${GITHUB_BASE}/repos/${owner}/${name}/git/trees/HEAD?recursive=1`,
    { headers: getAuthHeaders() },
  );
  if (!res.ok) {
    throw new Error("Failed to fetch repository tree from GitHub.");
  }
  const json = (await res.json()) as { tree: GitTreeEntry[] };
  return json.tree;
}

export async function fetchRawFile(
  owner: string,
  name: string,
  path: string,
): Promise<string> {
  const res = await fetch(
    `https://raw.githubusercontent.com/${owner}/${name}/HEAD/${path}`,
    { headers: { "User-Agent": "gitlore" } },
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch raw file: ${path}`);
  }
  return res.text();
}


