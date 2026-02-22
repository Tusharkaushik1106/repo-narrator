# GITLORE — NEW SITE STRUCTURE
## Product Architecture, Landing Flow, Dashboard Entry & CTA Strategy

> Based on: current product capabilities (REDESIGN_GUARDRAILS.md) + Phenomenon Studio UX patterns (design.md)
> This is a design intent document. No code. No component names. No Tailwind classes.

---

## WHO THIS IS FOR

Before designing anything, the audience must be locked.

**Primary user:** A developer (IC or lead) who has just joined a codebase they didn't write,
is about to do a code review on an unfamiliar repo, or wants to understand "how does this thing actually work?"

**Secondary user:** A developer who already uses the VS Code extension and wants to deepen usage through the web app.

**They are:**
- Technically literate — they will read code on the landing page
- Deeply skeptical of marketing claims — "show me it working, don't tell me it's powerful"
- Time-poor — they want the answer in one click, not after a 6-step setup
- Privacy-aware — they're handing over a GitHub repo URL; they'll want to know it's safe

**They are NOT:**
- Non-technical managers evaluating vendor tools (secondary at best)
- Agency clients expecting a portfolio (wrong product entirely)

This distinction changes everything about how the site is structured.

---

## PART 1 — SITEMAP

```
gitlore.io/
│
├── /                           Landing page (marketing + conversion)
│
├── /how-it-works               Single-page explainer (optional, can be landing section)
│
├── /extension                  VS Code extension landing page (dedicated)
│
├── /changelog                  What's new (builds trust with technical users)
│
├── /dashboard          🔒      Main product — repo analysis hub
│
├── /workbench          🔒      Deep dive file explorer + chat
│
├── /settings           🔒      (future) Token usage, account, API key
│
└── /api/auth/signin            Auth entry (GitHub + Google OAuth)

🔒 = requires authentication
```

### Why this sitemap

**`/extension` as its own page** — not a landing section, a full page.
The VS Code extension is a distinct product surface with its own install flow, screenshots, and use cases.
Developers who discover gitlore through the extension need a tailored landing that speaks to extension-first workflows.
Mixing it into the main landing dilutes both messages.

**No `/pricing` page yet** — the free tier (50k tokens/day, 100 requests/day) is generous for individual use.
Pricing should appear on the landing page as a transparent section, not a separate page.
A separate pricing page implies a complex tier structure that doesn't exist yet.

**`/changelog`** — this is a developer trust signal.
Technical users check changelogs before committing to a tool. An active changelog says "this is maintained."
It costs almost nothing to maintain and pays in credibility.

**No `/docs`** — the product is self-evident enough. If onboarding requires docs, the onboarding UX needs fixing first.
Add `/docs` when the product has enough surface area to warrant it.

---

## PART 2 — LANDING PAGE SECTION ORDER

### The Core Difference from Phenomenon Studio

Phenomenon's layered belief system works because their product is invisible until you hire them.
gitlore's product is the opposite — it can be demonstrated in 30 seconds.

The job of the gitlore landing page is not to build belief slowly.
**It is to collapse the distance between "I'm curious" and "I've seen it work."**

Every section must answer one of three questions:
1. "What is this?" (orient)
2. "Does it actually work?" (prove)
3. "How do I get it?" (convert)

Anything that doesn't answer one of those questions is noise.

---

### Section Order with Reasoning

```
┌─────────────────────────────────────────────────────────────────┐
│  1. HERO                                                        │
│     "Understand any codebase in minutes, not days."             │
│     Subhead: Paste a GitHub URL. Get an AI breakdown of the     │
│     architecture, hotspots, file purposes, and more.            │
│     [Analyze a repo →]  [View sample analysis]                  │
│     Small note: "Free to start. GitHub or Google sign-in."      │
├─────────────────────────────────────────────────────────────────┤
│  2. LIVE DEMO STRIP (proof of concept, above the fold)          │
│     A real, pre-run analysis of a well-known open source repo   │
│     shown inline. Not a screenshot — actual rendered output.    │
│     (e.g., "Here's what gitlore says about Next.js itself")     │
├─────────────────────────────────────────────────────────────────┤
│  3. CREDIBILITY BAR                                             │
│     Works with any public GitHub repo                           │
│     Powered by Gemini 2.5 Flash                                 │
│     [X] repos analyzed   /   VS Code Extension available        │
├─────────────────────────────────────────────────────────────────┤
│  4. PROBLEM STATEMENT (the pain, not the solution)              │
│     "Reading unfamiliar code is the most expensive part of      │
│     software development. Onboarding takes weeks. Code reviews  │
│     take hours. Most of that time is just orientation."         │
├─────────────────────────────────────────────────────────────────┤
│  5. SELF-SELECTION CARDS (3 use cases — first person)           │
│     "I'm joining a new codebase"                                │
│     "I'm reviewing a PR I don't know"                           │
│     "I want AI in my editor while I code"                       │
├─────────────────────────────────────────────────────────────────┤
│  6. FEATURE WALKTHROUGH (tabbed or sequential)                  │
│     Tab 1: Repo Analysis   (elevator pitch, stack radar,        │
│                             hotspot map, file tree)             │
│     Tab 2: AI Chat         (ask questions about the repo,       │
│                             RAG-backed answers, file context)   │
│     Tab 3: File Deep Dive  (per-file summary + Mermaid diagram) │
│     Tab 4: VS Code         (narration, risk, impact, search)    │
├─────────────────────────────────────────────────────────────────┤
│  7. HOW IT WORKS (3 steps)                                      │
│     Step 1: Paste a GitHub URL                                  │
│     Step 2: AI reads the entire codebase                        │
│     Step 3: Explore, ask, understand                            │
├─────────────────────────────────────────────────────────────────┤
│  8. EXTENSION SPOTLIGHT                                         │
│     "Already in your editor."                                   │
│     Shows the 4 extension capabilities (narration / risk /      │
│     impact / semantic search) with IDE mockup or screenshot.    │
│     [Install for VS Code →]                                     │
├─────────────────────────────────────────────────────────────────┤
│  9. FREE TIER TRANSPARENCY                                      │
│     "Free to use. No credit card."                              │
│     50,000 tokens/day · 100 requests/day · Unlimited repos      │
│     Honest framing. Not a pricing table — just clarity.         │
├─────────────────────────────────────────────────────────────────┤
│  10. SOCIAL PROOF (if available — otherwise skip until earned)  │
│      Testimonials, GitHub stars, known repos analyzed           │
├─────────────────────────────────────────────────────────────────┤
│  11. FINAL CTA                                                  │
│      "Start understanding code in 30 seconds."                  │
│      [Analyze your first repo →]                                │
│      Sign in with GitHub or Google. Free. No setup.             │
├─────────────────────────────────────────────────────────────────┤
│  12. FOOTER                                                     │
│      Links / GitHub repo (if public) / Extension link /         │
│      Changelog / Privacy / Terms                                │
└─────────────────────────────────────────────────────────────────┘
```

---

### Section-by-Section Reasoning

**Section 1 — Hero**

The headline is outcome-first: "Understand any codebase in minutes, not days."
NOT "AI-powered code analysis platform." That is a feature description, not a promise.
Developers respond to outcomes they've personally felt the absence of.

The primary CTA (`Analyze a repo →`) leads directly to auth + URL input.
Zero intermediate steps — this is the moment of commitment; don't introduce friction.

The secondary CTA (`View sample analysis`) is critical.
Many developers will not sign in without seeing the product first.
This links to a static or pre-rendered analysis of a well-known public repo (e.g., Next.js, Prisma, shadcn).
It removes the "I have to give you my GitHub access before I know what I'm getting" objection.

The "Free to start" note directly under the CTAs preemptively kills the #1 drop-off reason.
Developers stop at a login wall if they don't know what's on the other side.

**Section 2 — Live Demo Strip**

This is the single biggest departure from the Phenomenon approach.
Phenomenon can't show you their work inline — you have to read a case study.
gitlore CAN show the product working, right on the landing page.

Show a pre-computed analysis of a famous open-source repo as embedded, read-only output.
Rendered elevator pitch, stack radar chart, file tree with complexity colors, hotspot list.
Not a screenshot — the actual UI, in read-only/demo mode.

This is "proof before doubt can form" — the same psychological goal as Phenomenon's stats strip,
but specific to a developer audience: see the actual output, not metrics about it.

Placement: directly below the hero, before the credibility bar.
Reason: credibility through demonstration outweighs credibility through assertion.
The credibility bar validates what the user just saw; it doesn't replace seeing it.

**Section 3 — Credibility Bar**

After the demo, the user has seen the product work. Now anchor that with facts.
"Works with any public GitHub repo" answers "but will it work with my repo?"
"Powered by Gemini 2.5 Flash" answers "what AI is this using?" (developers will ask this)
A live counter of repos analyzed (if available) signals adoption.
The VS Code extension mention plants the seed for Section 8.

This section is low-friction, fast to scan, credibility-stacking.

**Section 4 — Problem Statement**

Most SaaS sites skip this section. That's a mistake for developer tools.
Developers don't buy solutions — they buy relief from recognized pain.
If they don't see their pain named accurately, they assume the product doesn't understand them.

Name the pain precisely:
- Joining a new codebase takes weeks to become productive
- Code review on unfamiliar code is slow and stressful
- Reading code without context is like reading a book starting from chapter 7

This section requires no product explanation. It's purely empathetic.
By the time the user leaves this section, they should feel "yes, that's exactly my problem."

**Section 5 — Self-Selection Cards**

Three use cases in first-person visitor language:

```
"I'm joining a new codebase"
"I'm reviewing a PR I don't understand"
"I want AI in my editor while I code"
```

This pattern is borrowed directly from Phenomenon's pain point cards, but rewritten for developers.
Each card links to a deeper section or a tailored demo/flow.

The genius of this pattern: the visitor doesn't feel sold to.
They feel understood. They're choosing their path, not being herded.

It also reveals which use case is most popular (analytics data = product insight).

**Section 6 — Feature Walkthrough (Tabbed)**

Four tabs map directly to the four actual product surfaces:
1. Repo Analysis → what `/dashboard` gives you
2. AI Chat → what OmniChat gives you
3. File Deep Dive → what `/workbench` gives you
4. VS Code Extension → what the extension gives you

Each tab should have: a label, a 1-sentence description, and a screenshot or animated demo.
No paragraph marketing copy. Developers skip copy and look at the UI.

Why tabs, not a vertical scroll of sections?
Because the four capabilities are peers, not a sequence.
A visitor interested only in the extension doesn't need to scroll past 3 features to find it.
Tabs respect the visitor's attention and intent.

**Section 7 — How It Works (3 Steps)**

```
1. Paste a GitHub URL
2. AI reads the entire repo (file tree, languages, architecture)
3. Explore, chat, and understand — in your browser or your editor
```

This section exists to eliminate the "but what does setup look like?" objection.
Three steps. 30 seconds. No API keys. No config files. No cloning.
The simplicity of the setup is a feature — show it explicitly.

This section should feel effortless, not technical. Numbered steps. Short labels. No wall of text.

**Section 8 — Extension Spotlight**

The VS Code extension is a distinct product, not an add-on.
It deserves its own section with its own hero moment.

Show the four extension capabilities as scannable cards or a 2×2 grid:
- Code Narration: "What does this function do?"
- Risk Analysis: "Risk score 1-10 with explanation"
- Impact Analysis: "PII / Auth / External API / Database Write labels"
- Semantic Search: "Ask questions answered from your codebase"

An IDE mockup or screenshot makes this section immediately credible.
CTA: `Install for VS Code →` — links directly to the marketplace.

Why a dedicated section rather than a tab in Section 6?
Because the extension has a different conversion action (install, not sign up).
It needs its own CTA. Mixing it into the tab flow buries it.

**Section 9 — Free Tier Transparency**

Developers hate opaque pricing. They especially hate discovering limits after they've invested time.
Show the limits upfront and frame them honestly:

```
50,000 tokens/day — equivalent to analyzing ~10-15 medium repos
100 requests/day — plenty for daily use
Works with any public GitHub repo
No credit card required
Sign in with GitHub or Google in one click
```

This section is NOT a pricing table. It's a trust signal.
The framing: "here's what you get for free, and here's why it's enough to get started."
The subtext: "we're not hiding a freemium trap."

**Section 10 — Social Proof**

Conditional: only include this section if there are real testimonials or quantifiable adoption.
Do NOT fabricate or use placeholder testimonials. Developers will spot it and it destroys trust.

If this section runs early with no data, skip it and add it when earned.
When it exists, it should show: real names, real contexts ("used it to onboard at a new job"),
and if possible, stats (repos analyzed, time saved).

**Section 11 — Final CTA**

The closing call to action answers one question: "what do I do right now?"

```
"Start understanding code in 30 seconds."
[Analyze your first repo →]
Sign in with GitHub or Google. Free. No setup. No credit card.
```

Every friction-removing statement is explicit:
- "30 seconds" → fast
- "Free" → no cost risk
- "No setup" → no configuration
- "No credit card" → no financial commitment

This is the last chance before the footer. It should be confident, not desperate.

**Section 12 — Footer**

Developer-focused footer content:
- Product links (how it works, extension, changelog)
- GitHub link to the repo (if public — signals transparency, invites contribution)
- Legal: Privacy, Terms
- Auth: Sign in / Sign up

Keep it minimal. Developers don't need 20 service links — they need to find GitHub, privacy, and changelog.

---

## PART 3 — DASHBOARD ENTRY FLOW

This is the sequence a user experiences after authenticating for the first time.

```
┌──────────────────────────────────────────────────────────────────┐
│  STEP 1: AUTH                                                    │
│  User clicks "Analyze a repo →" from landing page               │
│  → Redirected to /api/auth/signin                                │
│  → Two options: "Continue with GitHub" / "Continue with Google"  │
│  → Callback URL preserved → user lands back on dashboard         │
└──────────────────────────────────────────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────────┐
│  STEP 2: EMPTY STATE DASHBOARD                                   │
│  First-time user sees: no previous analysis                      │
│                                                                  │
│  Center of screen:                                               │
│  "Paste a GitHub repo URL to get started."                       │
│  [ github.com/owner/repo _________________ ] [Analyze →]         │
│                                                                  │
│  Below input:                                                    │
│  "Try one of these:"                                             │
│  [facebook/react] [vercel/next.js] [prisma/prisma]              │
│  (pre-filled sample repos, one click to start)                   │
│                                                                  │
│  Why: Eliminates blank-slate paralysis. Developers who           │
│  want to explore before using their own repo can do so.          │
└──────────────────────────────────────────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────────┐
│  STEP 3: LOADING STATE (NeuralLoadingBay)                        │
│  Current: animated loading screen                                │
│                                                                  │
│  Recommended: make the loading informative, not just animated    │
│  Show progress steps as they complete:                           │
│  ✓ Fetching repository metadata                                  │
│  ✓ Reading file tree (312 files found)                           │
│  ⟳ Generating embeddings... (47/312 files)                       │
│  ○ Building architecture overview                                │
│  ○ Identifying hotspots                                          │
│                                                                  │
│  Why: For a developer tool, black-box loading is a red flag.     │
│  Showing what's happening builds trust and makes the wait feel   │
│  purposeful, not random. The specific numbers ("312 files")      │
│  make it feel real.                                              │
└──────────────────────────────────────────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────────┐
│  STEP 4: COCKPIT DASHBOARD (analysis complete)                   │
│                                                                  │
│  Layout zones:                                                   │
│  ┌──────────────────────────┬─────────────────────────┐         │
│  │  Elevator Pitch           │  Stack Radar Chart      │         │
│  │  (repo identity)          │  (tech breakdown)       │         │
│  ├──────────────────────────┼─────────────────────────┤         │
│  │  Hotspot List             │  File Tree              │         │
│  │  (where to look first)    │  (color-coded)          │         │
│  └──────────────────────────┴─────────────────────────┘         │
│                                                                  │
│  Persistent: OmniChat panel (always accessible, collapsible)     │
│  Top nav: "Deep Dive →" button to /workbench                     │
│  Top nav: Usage indicator (tokens remaining)                     │
└──────────────────────────────────────────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────────┐
│  STEP 5: WORKBENCH (user navigates or is prompted)               │
│  File tree on left, file content + summary on right              │
│  OmniChat with file context — "ask about this file"              │
│  Mermaid diagram rendered below file summary                     │
└──────────────────────────────────────────────────────────────────┘
```

### Dashboard Empty State — Returning User

A returning user who has analyzed repos before should see:

```
"Your last analyzed repos:"
[repo-card: facebook/react — analyzed 2 days ago] [Reopen →]
[repo-card: vercel/next.js — analyzed last week]   [Reopen →]

"Analyze a new repo:"
[ github.com/owner/repo _________________ ] [Analyze →]
```

**Why:** Returning users shouldn't start from scratch. Showing history signals the product remembers them.
Note: this requires persisting analysis results to the database — currently the analysis is in-memory via RepoContext.
This is a future feature consideration, not a current capability.

---

## PART 4 — ONBOARDING FLOW

gitlore does not need a traditional onboarding wizard (no multi-step "tell us about yourself").
The product is self-teaching — you understand it by using it once.

However, a **contextual tooltip layer** on first use is appropriate.

### First-Time Dashboard Tooltips (Progressive)

Trigger: user's first completed analysis.

```
Tooltip 1 → Elevator Pitch section
  "This is gitlore's one-paragraph summary of what this repo does and why it exists."
  [Got it →]

Tooltip 2 → Stack Radar
  "This shows the tech breakdown across 5 dimensions. Higher = more dominant."
  [Got it →]

Tooltip 3 → Hotspot list
  "These are the most complex files. Start here if you're onboarding."
  [Got it →]

Tooltip 4 → OmniChat
  "Ask anything about this repo. I have the full codebase context."
  [Try asking something →]

Tooltip 5 → Workbench link
  "For file-by-file exploration, open the Deep Dive Workbench."
  [Done — I'll explore on my own]
```

Five tooltips. Sequential. Dismissable at any point.
Never shown again after dismissed.

### First-Time Workbench Tooltip

```
Tooltip → File tree
  "Click any file to get a summary, Mermaid diagram, and dedicated chat context."
  [Got it]
```

One tooltip. Workbench is self-evident once you use it.

### No Onboarding Email Sequence Needed (Yet)

The product delivers value on the first session. An email drip adds no value
until there are premium features, team plans, or complex workflows to explain.

---

## PART 5 — CTA PLACEMENT STRATEGY

CTAs in gitlore serve three distinct intents. Each has its own placement logic.

### CTA Type A — Convert (Landing → Auth → Dashboard)

**Primary action:** "Analyze a repo →" or "Get started free →"

Placement rules:
1. Hero section — primary position, above the fold
2. After Section 5 (Self-Selection Cards) — user has identified their use case, is now motivated
3. Final CTA section (Section 11) — last chance before footer

**Why not more placements?**
Over-CTAing signals desperation. Developers notice. Three strategic placements is enough.
The credibility bar, problem section, and feature walkthrough exist to EARN the CTA clicks,
not to be interrupted by them.

---

### CTA Type B — Explore (Landing → Sample Analysis)

**Primary action:** "View sample analysis" or "See it live →"

Placement:
1. Hero — secondary CTA, paired with primary
2. Possibly inline in Section 2 (Live Demo Strip) as "Open full analysis →"

**Purpose:** For the developer who won't commit to auth without seeing the product.
This CTA catches them before they bounce. It leads to a read-only pre-run analysis —
no auth required, no data collected.

---

### CTA Type C — Extension Install

**Primary action:** "Install for VS Code →"

Placement:
1. Extension Spotlight section (Section 8) — primary position for this CTA
2. Footer — persistent low-profile link

**Rule:** This CTA should ONLY appear near extension-specific content.
Placing it in the hero alongside "Analyze a repo" would dilute both messages.
Extension users have a different activation path (install → open file → use sidebar) than web app users.

---

### CTA Type D — In-Product (Dashboard)

**Primary action:** "Deep Dive →" (dashboard → workbench)

Placement:
1. After analysis completes — one persistent button in top navigation
2. After OmniChat first response — "See this file in the workbench →" contextual prompt
3. Hotspot list — "Open in workbench" per-file link

**Rule:** In-product CTAs should feel like navigation, not marketing.
They should appear when the user has a reason to go deeper, not at every opportunity.

---

### What CTAs to NEVER do

1. **Do not gate the sample analysis behind auth.** The second CTA exists specifically to bypass this.
   Any friction before the user sees value = higher bounce rate.

2. **Do not show the token usage indicator until it's relevant.** Show it when the user is
   actually consuming tokens (during/after a chat or analysis), not on the empty state.
   Seeing "50,000 tokens remaining" before you've done anything is confusing.

3. **Do not put a CTA in the problem statement section.** That section is empathy, not sales.
   Interrupting empathy with a conversion ask breaks the emotional sequence.

4. **Do not repeat the same CTA text everywhere.** Vary by context:
   - Hero: "Analyze a repo →" (action-oriented)
   - After problem section: "Start in 30 seconds →" (removes friction concern)
   - Final CTA: "Understand your first codebase →" (outcome-oriented)

---

## PART 6 — KEY STRATEGIC DIFFERENCES FROM REFERENCE SITE

| Dimension | Phenomenon Studio | gitlore |
|---|---|---|
| Proof format | Case studies with metrics | Live product demo embedded on page |
| Social proof | Client logos + testimonials | (Earn these; don't fabricate them) |
| Primary conversion | "Get in touch" form | One-click OAuth sign-in |
| Trust signal | Named contacts at bottom | Sample analysis (no auth required) |
| Content volume | High (17 sections) | Low (12 sections max) |
| Audience psychology | Service buyer, slow evaluation | Developer, fast skeptic, show-don't-tell |
| Pain language | Startup founder vocabulary | Developer daily frustration vocabulary |
| Feature disclosure | Progressive tabs by stage | Tabs by surface (Analysis/Chat/File/Extension) |
| CTA strategy | 4 entry points pre-form | 3 primary + 1 extension (separate CTA tree) |
| Footer density | 20+ links, 5 offices | Minimal — GitHub, Privacy, Changelog |

---

## PART 7 — PAGES NOT TO BUILD YET

| Page | Why to wait |
|---|---|
| `/pricing` | No paid tier exists. A pricing page implies one. |
| `/docs` | Product is self-evident. Bad onboarding = UX problem, not docs problem. |
| `/blog` | No SEO strategy yet. Blog without strategy = noise. |
| `/team` | Solo/small team. Skip until there's a reason to humanize at scale. |
| `/case-studies` | No customer stories to tell yet. Placeholder = trust-negative. |

Add these when the product and team reach the stage where they're relevant.
Building them before that point creates an impression of incompleteness.

---

*Document produced from:*
- *Product capabilities: REDESIGN_GUARDRAILS.md*
- *UX reference: Phenomenon Studio analysis in design.md*
- *Date: 2026-02-22*
