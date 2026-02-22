# REDESIGN GUARDRAILS
## Behavior Contract & Immutable Ruleset

> **Purpose:** This document is the single source of truth for all behavior in this application.
> Any future redesign — visual, structural, or architectural — MUST preserve every contract below.
> If a proposed change breaks any section of this contract, **refuse the change**.

---

## TABLE OF CONTENTS
1. [API Endpoints & Request/Response Shapes](#1-api-endpoints--requestresponse-shapes)
2. [Auth & Session Handling](#2-auth--session-handling)
3. [Middleware Contract](#3-middleware-contract)
4. [State Management](#4-state-management)
5. [Streaming / Realtime Contract](#5-streaming--realtime-contract)
6. [Token Usage & Quota System](#6-token-usage--quota-system)
7. [External Integrations](#7-external-integrations)
8. [Background Jobs](#8-background-jobs)
9. [Database Contract](#9-database-contract)
10. [IMMUTABLE FILE RULESET](#10-immutable-file-ruleset)

---

## 1. API Endpoints & Request/Response Shapes

### 1.1 `POST /api/chat`

**Runtime:** Node.js
**Auth required:** Yes — `getServerSession(authConfig)`. Returns `401` if no valid session.

**Request body:**
```ts
{
  question: string;        // Required. Max 2000 chars.
  repoId?: string;         // Optional. Used for RAG vector lookup.
  context?: NarrationContext; // Optional. { type, path, symbolName, language }
  fileContent?: string;    // Optional. Truncated to 3000 chars internally.
}
```

**Response:** `text/plain; charset=utf-8` streaming response (NOT JSON).
Chunks arrive as plain text. No JSON envelope. `Cache-Control: no-store`.

**Error responses (JSON):**
```ts
{ error: "Unauthorized" }                        // 401
{ error: "Missing question" }                    // 400
{ error: "Question too long. Maximum 2000 characters." } // 400
{ error: string, retryAfter?: number }           // 429 — quota exceeded
```

**Behavior invariants:**
- `fileContent` is always silently capped at 3000 characters server-side.
- If `repoId` is provided, performs RAG lookup (top-5 vector matches) and prepends as context.
- On Gemini 429/503, a user-facing error message is streamed into the response body (not returned as HTTP error).
- Token usage is estimated BEFORE the call and reconciled AFTER with `recordActualUsage`.

---

### 1.2 `GET /api/usage`

**Auth required:** Yes — `401` if no session.

**Query params:**
```
?userId=<string>   // Optional. If provided, must match the authenticated user — else 403.
```

**Response (200):**
```ts
{
  tokensUsed: number;
  tokensRemaining: number;
  requestCount: number;
  requestsRemaining: number;
}
```

**Error responses:**
```ts
{ error: "Unauthorized" }  // 401
{ error: "Forbidden" }     // 403 — userId param doesn't match session
```

---

### 1.3 `POST /api/analyze`

**Auth:** Not explicitly checked at route level (handled upstream via context).

**Request body:**
```ts
{
  repoUrl: string;   // GitHub URL e.g. "https://github.com/owner/repo"
}
```

**Response (200):**
```ts
{
  repoId: string;
  repoUrl: string;
  owner: string;
  name: string;
  elevatorPitch: string;
  stackRadar: Array<{ subject: string; value: number }>;
  hotspots: Array<{ path: string; complexity: number }>;
  sampleFileTree: Array<{
    path: string;
    language: string;
    complexity: "green" | "yellow" | "red";
  }>;
  fullFileTree: Array<{
    path: string;
    type: "file" | "folder";
    language: string;
    complexity: "green" | "yellow" | "red";
  }>;
  sampleCode: string;
}
```

**Behavior invariants:**
- Calls GitHub API to fetch repo metadata and recursive file tree.
- Generates embeddings for code files and stores in in-memory vector store under `repoId`.
- Calculates `stackRadar` with exactly these subjects: `["Frontend", "Backend", "Auth", "Infra", "DX"]`.
- Hotspot complexity is numeric (higher = more complex).

---

### 1.4 `POST /api/file-summary`

**Request body:**
```ts
{
  owner: string;
  repo: string;
  path: string;
}
```

**Response (200):**
```ts
{
  summary: string;    // Markdown-formatted file summary
  diagram: string;    // Mermaid diagram code (may be empty string)
  cached: boolean;    // true if result came from DB cache
}
```

**Behavior invariants:**
- File content is fetched from GitHub raw URL.
- SHA256 hash of file content is used as cache key in `summary_cache` PostgreSQL table.
- Cache is checked BEFORE calling Gemini.
- On Gemini rate limit (429), retries with exponential backoff (3 retries, doubling delay).
- Mermaid output is cleaned via `cleanMermaidCode()` before returning.

---

### 1.5 `POST /api/project-overview`

**Request body:**
```ts
{
  owner: string;
  repo: string;
  repoId: string;
}
```

**Response (200):**
```ts
{
  overview: string;
  architecture: string;
  keyComponents: string[];
  dataFlow: string;
  techStack: string[];
  dependencies: string[];
  mermaidArchitecture: string;
  mermaidDataFlow: string;
}
```

**Behavior invariants:**
- Checks in-memory `diagramCache` first; falls back to PostgreSQL `diagram_store` table.
- If uncached: fetches file tree from GitHub, calls Gemini for structured overview.
- Result is stored in both in-memory cache AND PostgreSQL before returning.
- `mermaidArchitecture` and `mermaidDataFlow` are cleaned via `cleanMermaidCode()`.

---

### 1.6 `POST /api/index-repo`

**Request body:**
```ts
{
  repo: RepoIdentifier;  // { type: "github" | "zip" | "local", github?: {...}, uploadId?: string }
}
```

**Response (202):**
```ts
{
  jobId: string;   // Format: "job_<base36_timestamp>"
  status: "queued";
}
```

**IMPORTANT — Stub:** This endpoint is a stub. It does NOT process anything.
No background job is created. The `jobId` is fake.

---

### 1.7 `GET /api/auth/[...nextauth]`
### 1.8 `POST /api/auth/[...nextauth]`

Standard NextAuth.js catch-all handler. Delegates entirely to `authConfig` in `src/lib/auth.ts`.

**Providers configured:** GitHub OAuth, Google OAuth
**Custom sign-in page:** `/api/auth/signin`
**Session callback:** passes session through unchanged.

---

### 1.9 `POST /api/extension/narrate`

**Auth:** Requires `x-gitlore-extension-key` header matching `process.env.EXTENSION_SECRET`.
Returns `401` if missing or incorrect.

**Request body:**
```ts
{
  codeSnippet: string;
  language?: string;
}
```

**Response (200):**
```ts
{
  purpose: string;
  components: string[];
  architecture: string;
}
```

**Behavior invariants:**
- In-memory cache with SHA256 key; **24-hour TTL** on cache entries.
- LRU-like cleanup: when cache exceeds 100 entries, oldest 20 are purged.
- Code is minified before being sent to Gemini to reduce token usage.
- Returns `401` without `x-gitlore-extension-key` or with wrong key.

---

### 1.10 `POST /api/extension/risk`

**Auth:** Requires `x-gitlore-extension-key` header.

**Request body:**
```ts
{
  codeSnippet: string;
}
```

**Response (200):**
```ts
{
  score: number;   // 1-10 risk score
  reason: string;  // Explanation of risk
}
```

**Behavior invariants:**
- Aggressively cleans Gemini JSON response (strips markdown fences, trailing commas).
- Falls back to `{ score: 5, reason: "Unable to analyze..." }` on parse failure.
- Never returns a 500 — all errors produce fallback values.

---

### 1.11 `POST /api/extension/impact`

**Auth:** Requires `x-gitlore-extension-key` header.

**Request body:**
```ts
{
  codeSnippet: string;
}
```

**Response (200):**
```ts
{
  riskLabel: string;   // e.g. "PII", "Auth", "External API", "Database Write"
  riskColor: string;   // Hex color string e.g. "#ff0000"
  summary: string;     // Short description
  score: number;       // 0-100 complexity score (computed locally, not from AI)
}
```

**Behavior invariants:**
- `score` is computed locally via `calculateComplexityScore()` — NOT from Gemini.
  - Formula: `min(60, (length/1000)*60) + min(40, importCount*8)`, capped at 100.
- Falls back to `{ riskLabel: "Unknown", riskColor: "#888888", summary: ... }` on parse failure.

---

### 1.12 `POST /api/extension/search`
### 1.13 `OPTIONS /api/extension/search`

**Auth:** Requires `x-gitlore-extension-key` header matching `process.env.GITLORE_EXTENSION_SECRET`.
**Note:** This endpoint uses `GITLORE_EXTENSION_SECRET`, NOT `EXTENSION_SECRET`. This distinction is intentional.

**CORS:** All responses include `Access-Control-Allow-Origin: *`.
OPTIONS preflight returns 200 with CORS headers.

**Request body:**
```ts
{
  query: string;
  context?: string;   // Truncated to 5000 chars internally
}
```

**Response (200):**
```ts
{
  answer: string;   // Plain text, max ~2 sentences, no Markdown
}
```

**Behavior invariants:**
- `context` is always truncated to 5000 characters server-side.
- Response is plain text — Gemini is explicitly instructed to NOT use Markdown.
- Returns `{ answer: "Auth Failed" }` with status 401 on bad key.
- Returns `{ answer: "System Overload. Try again." }` with status 500 on errors.
- Uses `gemini-2.5-flash` model with `maxTokens: 200`.

---

## 2. Auth & Session Handling

### 2.1 NextAuth Configuration (`src/lib/auth.ts`)

```
Providers:   GitHub OAuth, Google OAuth
Sign-in URL: /api/auth/signin
Session:     Session object passed through unchanged (no custom JWT claims added)
```

User identity is derived as: `session?.user?.email || session?.user?.id`

All authenticated API routes use this exact pattern:
```ts
const session = await getServerSession(authConfig);
const userId = session?.user?.email || session?.user?.id;
if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
```

### 2.2 Development Auth Bypass

**Controlled by:** `NEXT_PUBLIC_DEV_AUTH_BYPASS=true` AND `NODE_ENV !== "production"`

Two components enforce this (BOTH must stay synchronized):
1. `src/middleware.ts` — intercepts `GET /api/auth/session` and returns fake session JSON
2. `src/components/auth/SessionProvider.tsx` — passes fake `Session` object to NextAuthSessionProvider

**Fake session shape:**
```ts
{
  user: { name: "Local Dev", email: "dev@local.test", image: null },
  expires: "2099-01-01T00:00:00.000Z"
}
```

**INVARIANT:** The dev bypass CANNOT activate when `NODE_ENV === "production"`.
Both files have a double-guard. This must never be weakened.

### 2.3 AuthGuard Component (`src/components/auth/AuthGuard.tsx`)

- Wraps protected pages.
- If `status === "unauthenticated"`, calls `signIn(undefined, { callbackUrl: pathname })`.
- Renders `null` while loading or unauthenticated (never renders children).
- Shows a loading spinner during `status === "loading"`.

---

## 3. Middleware Contract

**File:** `src/middleware.ts`

**Matcher:**
```ts
["/api/extension/:path*", "/api/auth/session"]
```

**Production behavior:**
- Routes under `/api/extension/` require header `x-gitlore-extension-key` matching `process.env.EXTENSION_SECRET`.
- Missing or wrong key → `401 Unauthorized` (plain text body, not JSON).
- All other routes pass through via `NextResponse.next()`.

**Dev behavior (bypass active):**
- `GET /api/auth/session` returns hardcoded `DEV_SESSION` JSON with header `X-Dev-Auth-Bypass: 1`.
- All other routes pass through unconditionally — no extension key check in dev.

**INVARIANT:** Middleware must never block `/api/extension/search` from CORS preflight (OPTIONS) in production. The OPTIONS handler in the search route handles CORS itself.

---

## 4. State Management

### 4.1 RepoContext (`src/context/RepoContext.tsx`)

**State shape:**
```ts
{
  analysis?: RepoAnalysis;
  status: "idle" | "running" | "done" | "error";
  error?: string;
}
```

**RepoAnalysis shape:**
```ts
{
  repoId: string;
  repoUrl: string;
  owner: string;
  name: string;
  elevatorPitch: string;
  stackRadar: Array<{ subject: string; value: number }>;
  hotspots: Array<{ path: string; complexity: number }>;
  sampleFileTree: Array<{ path: string; language: string; complexity: "green"|"yellow"|"red" }>;
  fullFileTree?: Array<{ path: string; type: "file"|"folder"; language: string; complexity: "green"|"yellow"|"red" }>;
  sampleCode: string;
}
```

**Actions:**
- `startAnalysis(repoUrl)` → sets `status: "running"`, clears error
- `finishAnalysis(analysis)` → sets `status: "done"`, stores analysis
- `failAnalysis(message)` → sets `status: "error"`, stores message

**INVARIANT:** `useRepoContext()` throws if called outside `<RepoProvider>`. This is intentional guard behavior — do not remove the throw.

### 4.2 FileContext (`src/context/FileContext.tsx`)

**State shape:**
```ts
{
  currentFile: {
    path: string | null;
    content: string | null;
    language?: string;
  } | null;
}
```

**Actions:**
- `setCurrentFile(file | null)` — sets or clears selected file

**INVARIANT:** `useFileContext()` throws if called outside `<FileProvider>`. Do not remove.

### 4.3 No External Store

There is **no Zustand, Redux, Jotai, or MobX** in this application.
All state is React Context + `useState`. Do not introduce external stores without removing these contexts.

---

## 5. Streaming / Realtime Contract

There are **no WebSockets** in this application.

Streaming is implemented via `TransformStream` in `POST /api/chat`:

```
Client → POST /api/chat (JSON body)
Server → Response(stream.readable, { "Content-Type": "text/plain; charset=utf-8" })
Client reads stream as text chunks
```

The client must read the response body as a **readable stream of plain text chunks**.
There is no JSON framing, no SSE `data:` prefix, no event types.

**INVARIANT:** The `Content-Type` header for the chat response is `text/plain; charset=utf-8`, NOT `text/event-stream`. Do not convert this to SSE without updating all consumers.

---

## 6. Token Usage & Quota System

**File:** `src/lib/tokenUsage.ts`
**Storage:** PostgreSQL table (if `DATABASE_URL` configured), in-memory fallback.

### Limits (HARDCODED — must not change without product decision):
```
DAILY_TOKEN_LIMIT    = 50,000 tokens/user/day
DAILY_REQUEST_LIMIT  = 100 requests/user/day
RATE_LIMIT_WINDOW    = 60 seconds
RATE_LIMIT_MAX_REQ   = 10 requests per window
```

### Token Estimation Formula:
```ts
// Base: 1 token per 3 characters
let tokens = Math.ceil(text.length / 3);
// Code bonus: +20% if code markers detected
if (/[{}\[\]()=>]/.test(text)) tokens = Math.ceil(tokens * 1.2);
// Minimum: 1 token
return Math.max(1, tokens);
```

### `checkAndRecordUsage(userId, estimatedTokens)` contract:
- Returns `{ allowed: true }` or `{ allowed: false, reason: string, retryAfter?: number }`
- Checks: daily tokens → daily requests → per-minute rate limit (in that order)
- On DB failure: **allows** the request (fail-open for availability)

### `recordActualUsage(userId, tokenDifference)` contract:
- Called AFTER streaming completes with the delta between estimated and actual tokens
- Positive delta = undercounted, negative delta = overcounted
- Silent no-op on failure

### `getUserUsage(userId)` contract:
Returns:
```ts
{
  tokensUsed: number;
  tokensRemaining: number;   // max(0, DAILY_TOKEN_LIMIT - tokensUsed)
  requestCount: number;
  requestsRemaining: number; // max(0, DAILY_REQUEST_LIMIT - requestCount)
}
```
Returns zeroed object on DB failure.

---

## 7. External Integrations

### 7.1 Google Gemini API (`src/lib/gemini_adapter.ts`)

**Default model:** `models/gemini-2.5-flash`
**Embedding model:** `gemini-embedding-001` (hardcoded in `src/lib/embeddings.ts`)

**Retry policy:**
- 3 retries on 429 (rate limit) or 503 (overload)
- Exponential backoff starting at 1000ms, doubling each retry
- Other errors: throw immediately

**System prompt prefix (INVARIANT):**
```
"You are gitlore, an expert software explainer. You explain repositories in multiple levels of abstraction, and you always ground explanations in the provided code context when available.\n\n"
```

**Message format sent to Gemini:**
```
{systemPrefix}
{contextString}
User: {message.content}
Assistant: {message.content}
...
Assistant:
```

### 7.2 GitHub API (`src/lib/github.ts`)

**Base URL:** `https://api.github.com`
**User-Agent:** `gitlore` (required by GitHub API — do not remove)

**Endpoints called:**
- `GET /repos/{owner}/{name}` — repo metadata
- `GET /repos/{owner}/{name}/git/trees/HEAD?recursive=1` — full file tree
- `GET https://raw.githubusercontent.com/{owner}/{name}/HEAD/{path}` — raw file content

**Auth:** Bearer token via `GITHUB_PAT` env var (optional — unauthenticated if absent).

**INVARIANT:** `User-Agent: gitlore` header must be present on all GitHub requests. GitHub blocks requests without a User-Agent.

### 7.3 PostgreSQL (`src/lib/db/schema.ts`)

**Connection:** Single `Pool` instance (singleton pattern).
**Tables managed by the app:**

```sql
-- File summary cache
CREATE TABLE IF NOT EXISTS summary_cache (
  file_hash   text PRIMARY KEY,   -- SHA256 of file content
  summary_markdown text,
  diagram_code text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Project overview / diagram store
-- (created by diagramStore.ts, see that file for exact DDL)

-- Token usage tracking
-- (created by tokenUsage.ts, see that file for exact DDL)
```

**INVARIANT:** If `DATABASE_URL` is not set, the app functions without a database (graceful degradation). No code should throw on missing DB — all DB calls must have a null-check guard.

---

## 8. Background Jobs

**There are no background jobs in this application.**

The `/api/index-repo` endpoint is a **stub** that returns a fake job ID. It performs zero processing. This is a placeholder for future implementation.

Do not add real job processing to this endpoint without also adding proper job infrastructure (queue, worker, status polling endpoint).

---

## 9. Database Contract

### 9.1 `summary_cache` Table
- **Primary key:** `file_hash` (SHA256 hex of raw file content)
- **Cache strategy:** Write-through. Always read before Gemini call; always write after.

### 9.2 `diagram_store` Table (managed by `src/lib/diagramStore.ts`)
- Stores project overview data keyed by `(owner, repo, user_id)`
- In-memory `diagramCache` (Map) is the L1 cache; PostgreSQL is L2.

### 9.3 Token Usage Table (managed by `src/lib/tokenUsage.ts`)
- Tracks per-user daily and per-minute token/request counts.
- `userId` is the user's email address or NextAuth user ID.

---

## 10. IMMUTABLE FILE RULESET

The following files define **behavior, not appearance**. They must **never** be modified during a visual redesign. Any change to these files requires explicit product/engineering review and a corresponding update to this document.

### TIER 1 — NEVER TOUCH DURING REDESIGN

These files are pure behavior. A redesign has zero reason to touch them.

| File | Why It's Protected |
|---|---|
| `src/lib/auth.ts` | Defines OAuth providers, session shape, sign-in page route |
| `src/lib/gemini_adapter.ts` | All LLM calls, retry logic, streaming protocol, system prompt |
| `src/lib/tokenUsage.ts` | Quota limits, estimation algorithm, rate limiting logic |
| `src/lib/embeddings.ts` | Embedding model name, API call shape |
| `src/lib/vector_store_adapter.ts` | RAG storage and retrieval, cosine similarity implementation |
| `src/lib/github.ts` | All GitHub API calls, auth headers, User-Agent |
| `src/lib/db/schema.ts` | DB pool singleton, table creation DDL |
| `src/lib/diagramCache.ts` | In-memory diagram cache contract |
| `src/lib/diagramStore.ts` | PostgreSQL diagram persistence |
| `src/lib/types.ts` | Shared TypeScript type definitions used across API boundary |
| `src/lib/config.ts` | Environment variable mappings |
| `src/middleware.ts` | Extension auth, dev bypass logic, route matching |
| `src/app/api/auth/[...nextauth]/route.ts` | NextAuth handler entrypoint |
| `src/app/api/chat/route.ts` | Streaming chat, RAG integration, token tracking |
| `src/app/api/analyze/route.ts` | Repo analysis pipeline |
| `src/app/api/file-summary/route.ts` | File summarization + caching pipeline |
| `src/app/api/project-overview/route.ts` | Project overview generation + caching |
| `src/app/api/usage/route.ts` | Token usage endpoint |
| `src/app/api/index-repo/route.ts` | Stub job endpoint (preserve stub behavior) |
| `src/app/api/extension/narrate/route.ts` | Extension narration + TTL cache |
| `src/app/api/extension/risk/route.ts` | Extension risk scoring |
| `src/app/api/extension/impact/route.ts` | Extension impact + complexity scoring |
| `src/app/api/extension/search/route.ts` | Extension search + CORS |
| `src/context/RepoContext.tsx` | Repo analysis state machine |
| `src/context/FileContext.tsx` | File selection state |
| `src/components/auth/AuthGuard.tsx` | Route protection + redirect logic |
| `src/components/auth/SessionProvider.tsx` | NextAuth provider + dev bypass |
| `src/lib/utils/mermaid-cleaner.ts` | Mermaid output sanitization |

---

### TIER 2 — MODIFY ONLY THE VISUAL LAYER

These files have both behavior and visual concerns. During redesign, **only modify JSX structure, CSS classes, and animation variants**. The behavioral hooks, API calls, and context usage must remain identical.

| File | Behavioral Parts to Preserve |
|---|---|
| `src/components/auth/AuthButton.tsx` | `signIn()`, `signOut()`, `useSession()` calls |
| `src/components/chat/OmniChat.tsx` | Fetch to `/api/chat`, stream reading logic, token tracking |
| `src/components/chat/UsageIndicator.tsx` | Fetch to `/api/usage`, polling interval |
| `src/components/chat/UsageModal.tsx` | Usage data display logic |
| `src/components/dashboard/CockpitDashboard.tsx` | `useRepoContext()`, `startAnalysis()`, fetch to `/api/analyze` |
| `src/components/dashboard/ProjectOverview.tsx` | Fetch to `/api/project-overview`, loading states |
| `src/components/workbench/DeepDiveExplorer.tsx` | Fetch to `/api/file-summary`, `useFileContext()`, `useRepoContext()` |
| `src/components/diagrams/MermaidDiagram.tsx` | Mermaid initialization and rendering logic |
| `src/app/layout.tsx` | Provider order: `SessionProvider` → `RepoProvider` → `FileProvider` |

---

### TIER 3 — SAFE TO REDESIGN FREELY

These files are purely visual or structural. Redesign them without restriction.

| File | Notes |
|---|---|
| `src/app/globals.css` | Global styles only |
| `src/app/page.tsx` | Landing page — visual only |
| `src/components/landing/HeroLanding.tsx` | Pure visual component |
| `src/components/layout/Header.tsx` | Visual layout (preserve auth button placement) |
| `src/components/loading/NeuralLoadingBay.tsx` | Visual loading animation |
| `src/components/background/ParticleCanvas.tsx` | Animated background — pure visual |
| `src/components/ui/*` | UI primitives — safe to replace entirely |
| `src/components/providers/ThemeProvider.tsx` | Theme switching — visual concern |
| `src/components/sections/*` | Layout sections — pure visual |

---

## ENFORCEMENT RULES

When reviewing any future code change against this document, apply these rules:

1. **API contract change?** — If a request body field is added, removed, or renamed in Tier 1 files, REJECT unless this document is updated first.

2. **Response shape change?** — If any endpoint returns a different JSON structure than documented here, REJECT. The chat streaming format (plain text, not SSE) must be preserved.

3. **Auth flow change?** — If `getServerSession` is removed from any authenticated route, or the `userId` derivation pattern changes, REJECT.

4. **Quota limit change?** — Any change to `DAILY_TOKEN_LIMIT`, `DAILY_REQUEST_LIMIT`, `RATE_LIMIT_WINDOW`, or `RATE_LIMIT_MAX_REQ` is a product decision, not a redesign decision. REJECT if not explicitly authorized.

5. **Context API change?** — If `RepoContext` or `FileContext` state shapes change, all consumers must be audited. Do not change the shape without updating every component that reads it.

6. **Dev bypass weakened?** — If the double-guard (`env flag AND NODE_ENV check`) in either `middleware.ts` or `SessionProvider.tsx` is removed or weakened, REJECT immediately.

7. **Extension auth removed?** — If the `x-gitlore-extension-key` check is removed from any `/api/extension/*` route, REJECT.

8. **User-Agent removed from GitHub calls?** — REJECT. GitHub will block the requests.

9. **DB null-guard removed?** — If any database call loses its null-check for missing `DATABASE_URL`, REJECT.

10. **Tier 1 file touched for visual reasons?** — REJECT. Visual changes belong in Tier 3 files or the visual layer of Tier 2 files only.

---

*Last updated: 2026-02-22*
*Generated by analyzing: Next.js 16, React 19, NextAuth 4, Google Gemini, PostgreSQL (Supabase)*
