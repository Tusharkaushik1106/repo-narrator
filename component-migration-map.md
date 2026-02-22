# COMPONENT MIGRATION MAP — UI ADAPTER LAYER
> gitlore current system → graffico.it design system
> NO CODE CHANGES. This is a planning document only.
> Rule: change className strings only. Never touch logic, hooks, API calls, props, or state.

---

## GLOBAL TOKEN SUBSTITUTION TABLE

Before reading per-component specs, apply these token swaps mentally everywhere.
This is the "Rosetta Stone" of the migration.

### Color Substitutions

| Current (cyan/slate) | Target (graffico) | Notes |
|---|---|---|
| `bg-slate-950` | `bg-ink-black` | Body/page background |
| `bg-slate-900` | `bg-ink-black/80` | Card/panel background |
| `bg-slate-800` | `bg-ink-black/60` | Input/secondary bg |
| `bg-slate-700` | `bg-ink-black/50` | Subtle bg |
| `text-slate-50` | `text-almond-cream` | Primary text |
| `text-slate-200` | `text-almond-cream/90` | High-visibility text |
| `text-slate-300` | `text-almond-cream/70` | Secondary text |
| `text-slate-400` | `text-almond-cream/50` | Muted text |
| `text-slate-500` | `text-almond-cream/30` | Faint/hint text |
| `text-cyan-400` | `text-tomato-jam` | Primary accent text |
| `text-cyan-300` | `text-tomato-jam/80` | Soft accent text |
| `text-sky-300` | `text-metallic-gold` | Secondary accent text |
| `text-fuchsia-400` | `text-metallic-gold` | Gold accent |
| `border-slate-700` | `border-almond-cream/10` | Default border |
| `border-slate-700/70` | `border-almond-cream/10` | Default border |
| `border-slate-600` | `border-almond-cream/20` | Medium border |
| `border-cyan-400` | `border-tomato-jam` | Accent border |
| `border-cyan-500/40` | `border-tomato-jam/30` | Soft accent border |
| `ring-cyan-500` | `ring-tomato-jam` | Focus ring |
| `ring-slate-700` | `ring-almond-cream/10` | Default ring |
| `from-cyan-400 to-sky-500` | `bg-tomato-jam` | Gradient → solid |
| `from-cyan-500 to-sky-500` | `bg-tomato-jam` | Gradient → solid |
| `from-cyan-500/20 to-sky-500/20` | `bg-tomato-jam/10` | Soft gradient → tint |
| `bg-gradient-to-br from-slate-800/80 to-slate-900/80` | `bg-ink-black/80 backdrop-blur-sm` | Card bg |
| `shadow-cyan-500/40` | `shadow-[0_0_15px_rgba(192,57,43,0.4)]` | Glow shadow |
| `hover:shadow-cyan-500/50` | `hover:shadow-[0_0_25px_rgba(192,57,43,0.6)]` | Hover glow |

### Typography Substitutions

| Current | Target | Notes |
|---|---|---|
| `font-semibold text-slate-50 text-2xl` | `font-shrikhand text-almond-cream text-2xl` | H1/H2 headings |
| `font-semibold text-base/lg` | `font-sans font-semibold text-almond-cream` | H3/H4 headings |
| `text-xs font-medium uppercase tracking-[0.2em]` | same classes — keep pattern | Label style is already correct |

### Radius Substitutions

| Current | Target |
|---|---|
| `rounded-lg` | `rounded-xl` (buttons, small elements) |
| `rounded-xl` | `rounded-2xl` (medium cards) |
| `rounded-2xl` | `rounded-3xl` ← PRIMARY card radius |
| `rounded-[1.25rem]` | `rounded-3xl` |

### `.glass-panel` Replacement

The existing `.glass-panel` CSS class maps to this new class:
```
OLD: className="glass-panel ..."
NEW: className="rounded-3xl border border-almond-cream/10 bg-ink-black/80 backdrop-blur-md overflow-hidden ..."
```
Keep the `glass-panel` class in globals.css and just redefine it — zero JSX changes needed.

---

## COMPONENT MAPPING TABLE

---

### 1. `globals.css` — Design Foundation
**File:** [src/app/globals.css](src/app/globals.css)

| Aspect | Current | Target Change |
|---|---|---|
| Body bg | `bg-slate-950` / `#0b0f19` | `--color-ink-black: #101011` |
| Body text | `text-slate-50` | `--color-almond-cream: #e7d7c1` |
| `.glass-panel` | cyan glow, slate bg, 1.25rem radius | `bg: ink-black/80`, `border: almond-cream/10`, `box-shadow: tomato-jam glow`, `border-radius: 1.5rem (rounded-3xl)` |
| `.bg-rn-gradient` | cyan/purple/pink radial blobs | Replace with: `from-tomato-jam/20` + `via-metallic-gold/10` blobs on ink-black base |
| `.focus-ring-glow` | cyan ring | Replace ring color with `rgba(192,57,43,0.6)` (tomato-jam) |
| `::selection` | none defined | Add: `background: #c0392b; color: #fff` |
| Custom keyframes | none relevant | Add: `emoji-bounce`, `arrow-bounce`, `scroll-dot`, `swipe-up` |
| CSS vars | none | Add: `--color-tomato-jam`, `--color-almond-cream`, `--color-metallic-gold`, `--color-ink-black` |

**What must NOT change:** `.scrollbar-thin`, `.transform-gpu`, `.markdown-body`, scroll behavior media queries, reduced-motion rules.

---

### 2. `RootLayout` — [src/app/layout.tsx](src/app/layout.tsx)
**Type:** Shell/Provider wrapper

| Aspect | Current | Target Change |
|---|---|---|
| Fonts | `Space_Grotesk` + `JetBrains_Mono` | Replace with `Shrikhand` (display) + `Work_Sans` (body) from `next/font/google` |
| Font variables | `--font-ui`, `--font-code` | Rename to `--font-shrikhand`, `--font-work-sans` |
| Body classNames | `bg-slate-950 text-slate-50` | `bg-ink-black text-almond-cream selection:bg-tomato-jam selection:text-white` |
| Meta title | `gitlore` | Keep as-is |
| Theme color meta | not present | Add: `<meta name="theme-color">` light `#F5E6D3` / dark `#1A1A1A` |

**What must NOT change:** Provider order (`SessionProvider` → `RepoProvider` → `FileProvider`), `OmniChat` and `Header` injection, `children` slot.

---

### 3. `Header` — [src/components/layout/Header.tsx](src/components/layout/Header.tsx)
**Type:** Global navigation

| Aspect | Current | Target Change |
|---|---|---|
| Background | `bg-slate-950/70 backdrop-blur-2xl border-slate-800/30` | `bg-ink-black/80 backdrop-blur-md border-almond-cream/10` |
| Top gradient line | `via-cyan-500/30` | `via-tomato-jam/30` |
| Logo glow | `from-cyan-500/30 via-sky-500/30` | `from-tomato-jam/30 via-metallic-gold/20` |
| Logo ring | `ring-cyan-500/30` | `ring-tomato-jam/20` |
| Brand name gradient | `from-slate-50 via-cyan-100 to-slate-50` | `from-almond-cream via-almond-cream/80 to-almond-cream` |
| Nav link active state | `text-cyan-300` + `from-cyan-500/15 to-sky-500/15 ring-cyan-500/30` | `text-tomato-jam` + `from-tomato-jam/10 to-tomato-jam/5 ring-tomato-jam/20` |
| Nav link hover | `hover:text-cyan-300` | `hover:text-tomato-jam` |
| Nav link active indicator | `layoutId="activeNav"` motion div — keep | Just recolor: `from-tomato-jam/10 ring-tomato-jam/20` |
| Icon colors | `text-slate-500 group-hover:text-cyan-400` | `text-almond-cream/30 group-hover:text-tomato-jam` |
| AuthButton container | no changes needed | pass-through |

**What must NOT change:** `pathname` null-return logic (hides header on `/dashboard`, `/workbench`, `/loading`, `/api/auth/signin`), `isActive()` helper, `usePathname()` hook, all `Link href` values, `layoutId="activeNav"`.

---

### 4. `HeroLanding` — [src/components/landing/HeroLanding.tsx](src/components/landing/HeroLanding.tsx)
**Type:** Landing page (mixed logic + UI)

| Aspect | Current | Target Change |
|---|---|---|
| Page wrapper | `relative min-h-dvh w-full overflow-hidden` | Keep — add `bg-ink-black` |
| Main card | `glass-panel w-full max-w-5xl px-6 py-8` | Redefine glass-panel → `rounded-3xl border border-almond-cream/10 bg-ink-black/80 backdrop-blur-md` |
| Badge/pill | `bg-slate-900/70 ring-slate-600/60 text-slate-300` | `bg-ink-black/70 border border-almond-cream/10 text-almond-cream/60` |
| Badge icon | `bg-cyan-400/20 text-cyan-300` | `bg-tomato-jam/10 text-tomato-jam` |
| H1 | `text-balance text-4xl font-semibold text-slate-50` | `font-shrikhand text-4xl md:text-5xl lg:text-6xl text-almond-cream` |
| H1 gradient word | `from-cyan-300 via-sky-400 to-fuchsia-400` | `from-tomato-jam via-[#e84832] to-metallic-gold` |
| Body paragraph | `text-slate-300 font-normal` | `text-almond-cream/70 font-normal` |
| Brand name inline | `from-cyan-300 via-cyan-200 to-cyan-300` | `from-tomato-jam via-[#d4503f] to-tomato-jam` |
| "loyal one" word | `from-purple-300 via-purple-200 to-purple-300` | `from-metallic-gold via-[#e8c84a] to-metallic-gold` |
| Form wrapper | `bg-slate-900/40 ring-slate-700/70` | `bg-ink-black/40 border border-almond-cream/10` |
| Form label | `text-slate-400 uppercase tracking-[0.2em]` | `text-almond-cream/40 uppercase tracking-[0.2em]` — keep style |
| Conic gradient border on input | `from-cyan-400 via-fuchsia-400 to-cyan-400` | `from-tomato-jam via-metallic-gold to-tomato-jam` |
| Input box | `bg-slate-950/90 text-slate-50 placeholder:text-slate-500` | `bg-ink-black/90 text-almond-cream placeholder:text-almond-cream/30` |
| Input glow shadow | `shadow-[0_0_20px_0_rgba(34,211,238,0.4)]` | `shadow-[0_0_20px_0_rgba(192,57,43,0.3)]` |
| Focus ring | `focus-within:ring-cyan-400/80` | `focus-within:ring-tomato-jam/60` |
| Submit button (inactive) | `bg-slate-700/80 text-slate-200` | `bg-almond-cream/10 text-almond-cream/50` |
| Submit button (active) | `from-cyan-400 to-sky-500 text-slate-950 shadow-cyan-500/40` | `bg-tomato-jam text-white shadow-[0_0_15px_rgba(192,57,43,0.4)]` |
| Submit button hover | `hover:from-cyan-300 hover:to-sky-400` | `hover:brightness-110 hover:scale-105` |
| GitHub info pill | `bg-slate-900/80 text-slate-300` | `bg-ink-black/70 border border-almond-cream/10 text-almond-cream/50` |
| Right panel card | `border-cyan-400/20 from-slate-950/90 to-slate-900/60` | `border-tomato-jam/20 bg-ink-black/80` |
| Right panel label | `text-cyan-200/90 uppercase tracking-[0.18em]` | `text-tomato-jam/80 uppercase tracking-[0.18em]` |
| Feature bullets | `from-cyan-300 to-sky-500` / `from-sky-400 to-fuchsia-400` | `from-tomato-jam to-metallic-gold` / `from-metallic-gold to-tomato-jam` |
| Pill badges | `from-cyan-500/10 border-cyan-400/20 text-cyan-200` | `from-tomato-jam/10 border-tomato-jam/20 text-tomato-jam/80` |
| Pulse dots | `bg-cyan-400` / `bg-fuchsia-400` / `bg-emerald-400` | `bg-tomato-jam` / `bg-metallic-gold` / `bg-almond-cream/60` |
| NeuralBackground | Remove or replace | Replace with 2 layered blobs: `blob-1` + `blob-2` (see design.md §3.4) + noise overlay at 3% opacity |

**What must NOT change:** `handleAnalyze()`, `useSession()`, `useRepoContext()`, `signIn()` call, `startAnalysis()`, `router.push('/loading')`, `canSubmit` guard, `input`/`submitting` state, all font imports (Poppins/Space_Grotesk/Playfair) — or remove them only if typography is fully replaced.

---

### 5. `AuthButton` — [src/components/auth/AuthButton.tsx](src/components/auth/AuthButton.tsx)
**Type:** Auth trigger + user menu

| Aspect | Current | Target Change |
|---|---|---|
| Loading skeleton | `bg-slate-800/60 text-slate-400` with pulse dot | `bg-ink-black/60 text-almond-cream/40` with `bg-almond-cream/20 animate-pulse` dot |
| Trigger button (signed-in) | `from-slate-800/80 to-slate-900/80 ring-slate-700/70 text-slate-200` | `bg-ink-black/60 border border-almond-cream/10 text-almond-cream/80 backdrop-blur-sm` |
| Trigger hover | `hover:ring-cyan-500/40 hover:shadow-cyan-500/10` | `hover:border-almond-cream/20 hover:text-almond-cream` |
| Avatar icon wrapper | `from-cyan-500/20 to-sky-500/20 ring-cyan-500/30` | `from-tomato-jam/15 to-tomato-jam/5 ring-tomato-jam/20` |
| Avatar icon | `text-cyan-400` | `text-tomato-jam` |
| ChevronDown (open) | `rotate-180 text-cyan-400` | `rotate-180 text-tomato-jam` |
| Dropdown panel | `border-slate-700/70 bg-slate-900/95 backdrop-blur-xl ring-slate-700/50` | `rounded-2xl border border-almond-cream/10 bg-ink-black/95 backdrop-blur-xl` |
| Dropdown header border | `border-slate-700/50` | `border-almond-cream/10` |
| User avatar (large) | `from-cyan-500/20 to-sky-500/20 ring-2 ring-cyan-500/30` | `from-tomato-jam/15 to-tomato-jam/5 ring-2 ring-tomato-jam/20` |
| Email icon | `text-slate-500` | `text-almond-cream/30` |
| Email text | `text-slate-400` | `text-almond-cream/50` |
| Name text | `text-slate-100` | `text-almond-cream` |
| Sign out button | `text-slate-300 hover:bg-rose-500/10 hover:text-rose-300` | `text-almond-cream/60 hover:bg-tomato-jam/10 hover:text-tomato-jam` |
| Sign out icon | `text-rose-400` | `text-tomato-jam` |
| Sign in button (unauthenticated) | `from-cyan-500 to-sky-500 text-slate-950 shadow-cyan-500/40` | `bg-tomato-jam text-white rounded-full px-5 py-2 shadow-[0_0_15px_rgba(192,57,43,0.4)]` |
| Sign in icon | `GithubIcon` | Keep GithubIcon |
| Sign in hover | `hover:from-cyan-400 hover:to-sky-400` | `hover:brightness-110 hover:scale-105` |
| framer-motion props | `whileHover={{scale:1.05}}` `whileTap={{scale:0.95}}` | Keep — these are correct per graffico spec |

**What must NOT change:** `useSession()`, `signIn()`, `signOut({ callbackUrl: '/' })`, `isOpen` state, `dropdownRef` click-outside logic, `displayName`/`displayEmail` logic, all auth conditionals.

---

### 6. `AuthGuard` — [src/components/auth/AuthGuard.tsx](src/components/auth/AuthGuard.tsx)
**Type:** Route protection wrapper (mostly logic)

| Aspect | Current | Target Change |
|---|---|---|
| Loading spinner wrapper | `flex min-h-screen items-center justify-center` | Keep layout — add `bg-ink-black` to outer div |
| Spinner ring | `border-cyan-500/20 border-t-cyan-500` | `border-tomato-jam/20 border-t-tomato-jam` |
| "Loading..." text | `text-slate-400` | `text-almond-cream/50` |

**What must NOT change:** `useEffect` signIn redirect, `status === "loading"` / `"unauthenticated"` guards, `useSession()`, `usePathname()`, `signIn()` call, `return null` for unauthenticated, `return <>{children}</>` for authenticated.

---

### 7. `NeuralLoadingBay` — [src/components/loading/NeuralLoadingBay.tsx](src/components/loading/NeuralLoadingBay.tsx)
**Type:** Loading page (heavy logic + UI)

#### Error state (401 redirect)
| Aspect | Current | Target Change |
|---|---|---|
| Container | `glass-panel` | `rounded-3xl border border-almond-cream/10 bg-ink-black/80 backdrop-blur-md` |
| "Redirecting..." text | `text-slate-400` | `text-almond-cream/50` |

#### Error state (general)
| Aspect | Current | Target Change |
|---|---|---|
| Card bg gradient | radial gradients `rgba(239,68,68,...)` | `from-tomato-jam/15 via-transparent to-transparent blur-3xl` |
| Error label | `text-red-400 uppercase` | `text-tomato-jam/80 uppercase tracking-[0.2em]` |
| H1 | `text-slate-50` | `font-shrikhand text-almond-cream` |
| Error box | `border-red-500/30 bg-red-950/20 text-red-300` | `border-tomato-jam/30 bg-tomato-jam/5 text-tomato-jam/80` |
| Error text | `text-slate-300` | `text-almond-cream/70` |
| "Back to Home" button | `bg-cyan-500/20 border-cyan-400/50 text-cyan-200` | `bg-tomato-jam/10 border-tomato-jam/30 text-tomato-jam rounded-full` |
| "Try Again" button | `bg-slate-800/80 border-slate-600/50 text-slate-200` | `bg-almond-cream/5 border-almond-cream/20 text-almond-cream/70 rounded-full` |

#### Loading state (main)
| Aspect | Current | Target Change |
|---|---|---|
| Card bg | radial cyan/indigo/pink gradients | `from-tomato-jam/15 via-metallic-gold/5 to-transparent blur-3xl` |
| Section label | `text-sky-300 uppercase tracking-[0.2em]` | `text-tomato-jam/70 uppercase tracking-[0.2em]` |
| H1 | `font-semibold text-slate-50` | `font-shrikhand text-almond-cream` |
| Repo name inline | `text-cyan-300` | `text-tomato-jam` |
| Body text | `text-slate-300` | `text-almond-cream/70` |
| Step orb (outer) | `bg-slate-900/80` | `bg-ink-black/80` |
| Step orb (inner glow) | `from-cyan-400 to-fuchsia-500` | `from-tomato-jam to-metallic-gold` |
| Step label (inactive) | `text-slate-400` | `text-almond-cream/40` |
| Step label (active) | `text-slate-50` | `text-almond-cream` |
| Step index text | `text-slate-400 uppercase tracking-[0.16em]` | `text-almond-cream/40 uppercase tracking-[0.16em]` |
| Right panel card | `border-cyan-400/30 bg-slate-950/80` | `border-tomato-jam/20 bg-ink-black/80` |
| Orb outer ring | `border-cyan-300/60` | `border-tomato-jam/40` |
| Orb inner ring 1 | `border-fuchsia-400/60 rotate-360 16s` | `border-metallic-gold/40` (keep animation) |
| Orb inner ring 2 | `border-sky-400/60 -rotate-360 24s` | `border-tomato-jam/40` (keep animation) |
| Orb glow blur | `from-cyan-400/40 via-sky-500/50 to-fuchsia-500/40` | `from-tomato-jam/40 via-[#e05e4a]/30 to-metallic-gold/30` |
| Bottom info gradient | `from-slate-950 via-slate-950/90` | `from-ink-black via-ink-black/90` |
| Info text | `text-slate-300` / `text-slate-400` | `text-almond-cream/60` / `text-almond-cream/40` |
| "Streaming facts" label | `text-slate-200` | `text-almond-cream/80` |

**What must NOT change:** The entire logic `useEffect` with `fetch('/api/analyze')`, `finishAnalysis()`, `failAnalysis()`, `router.push('/dashboard')`, rate limit error handling, `stepTimer` interval, `startAnalysis()` in retry handler, `signIn()` on 401, `currentStepIndex` state, `steps` array.

---

### 8. `CockpitDashboard` — [src/components/dashboard/CockpitDashboard.tsx](src/components/dashboard/CockpitDashboard.tsx)
**Type:** Dashboard page (mixed logic + UI)

#### Top nav bar
| Aspect | Current | Target Change |
|---|---|---|
| Nav bar bg | `border-slate-800/80 bg-slate-950/90 shadow-slate-900/30` | `border-almond-cream/10 bg-ink-black/90 backdrop-blur-md` |
| Logo/brand link | `text-slate-50 hover:text-cyan-400` | `text-almond-cream hover:text-tomato-jam` |
| Logo glow | `bg-cyan-400/20` | `bg-tomato-jam/20` |
| Brand gradient | `from-slate-50 to-slate-300 group-hover:from-cyan-300` | `from-almond-cream to-almond-cream/80 group-hover:from-tomato-jam` |
| Divider | `bg-slate-700/50` | `bg-almond-cream/10` |
| Tab button (active) | `text-cyan-300` | `text-tomato-jam` |
| Tab button (inactive) | `text-slate-400 hover:text-slate-200 hover:bg-slate-800/40` | `text-almond-cream/40 hover:text-almond-cream/70 hover:bg-almond-cream/5` |
| Tab underline indicator | `bg-gradient-to-r from-cyan-400 to-sky-400` (motion layoutId) | `bg-tomato-jam` |
| "Workbench" link | `text-slate-400 hover:text-cyan-300` | `text-almond-cream/40 hover:text-tomato-jam` |

#### Elevator Pitch card
| Aspect | Current | Target Change |
|---|---|---|
| Card | `glass-panel` | `rounded-3xl border border-almond-cream/10 bg-ink-black/80 backdrop-blur-md` |
| Background radial | `from-cyan-400/0.08 ... from-rose-400/0.08` | `from-tomato-jam/5 via-transparent to-metallic-gold/5` |
| Icon wrapper | `from-cyan-500/20 to-sky-500/20 ring-cyan-500/30` | `from-tomato-jam/15 to-tomato-jam/5 ring-tomato-jam/20` |
| Icon | `Zap text-cyan-400` | `Zap text-tomato-jam` |
| Label | `text-slate-400 uppercase tracking-[0.2em]` | `text-almond-cream/40 uppercase tracking-[0.2em]` |
| H2 | `text-base font-semibold text-slate-50` | `font-shrikhand text-base text-almond-cream` |
| Gemini badge | `bg-slate-900/70 ring-slate-700/50 text-slate-300` | `bg-ink-black/70 border border-almond-cream/10 text-almond-cream/50` |
| Gemini icon | `text-cyan-400` | `text-tomato-jam` |
| Pitch text box | `bg-slate-900/40 ring-slate-700/50 text-slate-200/95` | `bg-ink-black/40 border border-almond-cream/10 text-almond-cream/90` |
| "Architecture" mini-card | `from-cyan-500/10 to-sky-500/10 ring-cyan-500/20` | `from-tomato-jam/5 ring-tomato-jam/15` |
| "Architecture" label | `text-cyan-300` | `text-tomato-jam` |
| "Intelligence" mini-card | `from-fuchsia-500/10 to-pink-500/10 ring-fuchsia-500/20` | `from-metallic-gold/5 ring-metallic-gold/15` |
| "Intelligence" label | `text-fuchsia-300` | `text-metallic-gold` |
| GitBranch icon | `text-sky-200` / `text-fuchsia-200` | `text-tomato-jam` / `text-metallic-gold` |

#### Stack Radar card
| Aspect | Current | Target Change |
|---|---|---|
| Card | `glass-panel` | `rounded-3xl border border-almond-cream/10 bg-ink-black/80 backdrop-blur-md` |
| Background radial | `from-purple-400/0.1` | `from-metallic-gold/5` |
| Icon wrapper | `from-fuchsia-500/20 to-pink-500/20 ring-fuchsia-500/30` | `from-metallic-gold/15 to-metallic-gold/5 ring-metallic-gold/20` |
| Icon | `TrendingUp text-fuchsia-400` | `TrendingUp text-metallic-gold` |
| Label | `text-slate-400` | `text-almond-cream/40` |
| Sub-label | `text-slate-300` | `text-almond-cream/60` |
| Radar `PolarGrid` stroke | `#334155` | `rgba(231,215,193,0.1)` |
| Radar `PolarAngleAxis` tick fill | `#cbd5e1` | `#e7d7c1` |
| Radar `stroke` | `#22d3ee` | `#c0392b` |
| Radar gradient stop 0 | `#22d3ee` cyan | `#c0392b` tomato-jam |
| Radar gradient stop 50 | `#a855f7` purple | `#d4af37` metallic-gold |
| Radar gradient stop 100 | `#ec4899` pink | `#e7d7c1` almond-cream |
| Radar `activeDot` fill | `#06b6d4` | `#e84832` |
| Tag pills | `bg-slate-900/60 ring-slate-700/50 text-slate-300 text-cyan-300` | `bg-ink-black/60 border border-almond-cream/10 text-almond-cream/60 text-tomato-jam` |
| Tag dot | `from-cyan-400 to-fuchsia-400` | `from-tomato-jam to-metallic-gold` |

#### Hotspots card
| Aspect | Current | Target Change |
|---|---|---|
| Card | `glass-panel` | `rounded-3xl border border-almond-cream/10 bg-ink-black/80 backdrop-blur-md` |
| Background gradient | `from-rose-500/5 via-transparent to-yellow-500/5` | `from-tomato-jam/5 via-transparent to-metallic-gold/5` |
| Icon wrapper | `from-rose-500/20 to-orange-500/20 ring-rose-500/30` | `from-tomato-jam/15 to-tomato-jam/5 ring-tomato-jam/20` |
| Icon | `AlertTriangle text-rose-400` | `AlertTriangle text-tomato-jam` |
| Label | `text-slate-400` | `text-almond-cream/40` |
| Sub-label | `text-slate-300` | `text-almond-cream/60` |
| Count pill | `bg-slate-900/70 ring-slate-700/50 text-slate-400` | `bg-ink-black/70 border border-almond-cream/10 text-almond-cream/40` |
| Empty state icon | `text-slate-500` | `text-almond-cream/20` |
| Empty state text | `text-slate-400` / `text-slate-500` | `text-almond-cream/40` / `text-almond-cream/30` |
| File item bg | `from-slate-900/80 to-slate-950/80 border-slate-700/50` | `from-ink-black/80 to-ink-black/60 border border-almond-cream/10` |
| File item hover | `hover:border-slate-600/70 hover:shadow-rose-500/10` | `hover:border-almond-cream/20 hover:shadow-tomato-jam/10` |
| File icon ring (critical) | `ring-rose-500/30 from-rose-500/20 to-red-600/20` | `ring-tomato-jam/30 from-tomato-jam/20 to-tomato-jam/5` |
| File icon ring (high) | `ring-yellow-500/30` | `ring-metallic-gold/30 from-metallic-gold/20 to-metallic-gold/5` |
| File icon ring (moderate) | `ring-emerald-500/30` | `ring-almond-cream/20 from-almond-cream/10 to-transparent` |
| Complexity color (critical) | `from-rose-500 to-red-600 text-rose-400` | `from-tomato-jam to-[#9b2c1e] text-tomato-jam` |
| Complexity color (high) | `from-yellow-500 to-orange-500 text-yellow-400` | `from-metallic-gold to-[#b8932a] text-metallic-gold` |
| Complexity color (moderate) | `from-emerald-500 to-green-600 text-emerald-400` | `from-almond-cream/60 to-almond-cream/30 text-almond-cream/60` |
| File name | `text-slate-200 group-hover:text-slate-100` | `text-almond-cream/80 group-hover:text-almond-cream` |
| Directory path | `text-slate-500` | `text-almond-cream/30` |
| Extension pill | `bg-slate-800/70 text-slate-400` | `bg-ink-black/70 border border-almond-cream/10 text-almond-cream/40` |
| "Review needed" pill | `bg-rose-500/10 text-rose-300` | `bg-tomato-jam/10 text-tomato-jam` |
| Bottom hover line | `via-slate-700/50` | `via-almond-cream/10` |
| "Explore in workbench" button | `border-cyan-400/60 bg-slate-950/60 text-cyan-200` | `border-tomato-jam/40 bg-ink-black/60 text-tomato-jam/80 rounded-full` |

**What must NOT change:** `radarData` transform, `hotspots` transform, `getFileIcon()`, `getComplexityColor()` (return values used in logic), `getComplexityLabel()`, `activeTab` state, `useRepoContext()`, `useRouter()`, all `router.push()` calls, all `Link href` values, recharts component tree structure.

---

### 9. `ProjectOverview` — [src/components/dashboard/ProjectOverview.tsx](src/components/dashboard/ProjectOverview.tsx)
**Type:** Data-fetching + render (mixed)

| Aspect | Current | Target Change |
|---|---|---|
| Loading state | `Loader2 text-cyan-400` + `text-slate-400` | `Loader2 text-tomato-jam` + `text-almond-cream/50` |
| Error state | `border-rose-500/30 bg-rose-950/20 text-rose-300/text-rose-400` | `border-tomato-jam/30 bg-tomato-jam/5 text-tomato-jam/80 text-tomato-jam/60` |
| Empty state | `text-slate-400` | `text-almond-cream/50` |
| All `glass-panel` cards | `glass-panel overflow-hidden p-6` | `rounded-3xl border border-almond-cream/10 bg-ink-black/80 backdrop-blur-md overflow-hidden p-6` |
| Section H2 | `text-lg font-semibold text-slate-50` | `font-shrikhand text-lg text-almond-cream` |
| "Architecture Diagram" fullscreen button | `border-cyan-400/40 bg-slate-800/60 text-cyan-300` | `border-tomato-jam/30 bg-tomato-jam/5 text-tomato-jam rounded-full` |
| Diagram render error | `border-amber-500/40 bg-amber-950/20 text-amber-200` | `border-metallic-gold/30 bg-metallic-gold/5 text-metallic-gold/80` |
| Diagram raw code show/hide | `text-amber-100 hover:text-amber-50` | `text-metallic-gold hover:text-metallic-gold/80` |
| Diagram code raw pre | `bg-slate-900/70 text-slate-200 border-slate-700/60` | `bg-ink-black/70 text-almond-cream/80 border-almond-cream/10` |
| Diagram container | `border-slate-700/50 bg-slate-950/50 p-4` | `border-almond-cream/10 bg-ink-black/60 p-4 rounded-2xl` |
| Key Components icon header | `Component text-cyan-400` | `Component text-tomato-jam` |
| Component card | `border-slate-700/50 from-slate-900/80 to-slate-950/80 hover:border-cyan-500/40 hover:shadow-cyan-500/10` | `border-almond-cream/10 bg-ink-black/80 hover:border-tomato-jam/30 hover:shadow-tomato-jam/10` |
| Component number icon | `from-cyan-500/20 to-sky-500/20 ring-cyan-500/30 text-cyan-300` | `from-tomato-jam/15 to-tomato-jam/5 ring-tomato-jam/20 text-tomato-jam` |
| Component title | `text-cyan-200 group-hover:text-cyan-100` | `text-tomato-jam/80 group-hover:text-tomato-jam` |
| Component file path | `bg-slate-800/60 text-slate-400` | `bg-ink-black/60 border border-almond-cream/10 text-almond-cream/40` |
| Component description | `text-slate-300` | `text-almond-cream/70` |
| Bottom hover line | `via-cyan-500/50` | `via-tomato-jam/40` |
| Tech stack pills | `border-cyan-400/30 bg-cyan-500/10 text-cyan-300` | `border-tomato-jam/30 bg-tomato-jam/10 text-tomato-jam/80 rounded-full` |
| Dependencies dot | `bg-fuchsia-400` | `bg-metallic-gold` |
| Dependencies text | `text-slate-300 font-mono` | `text-almond-cream/70 font-mono` |
| Fullscreen modal bg | `bg-slate-950/95 backdrop-blur-xl` | `bg-ink-black/95 backdrop-blur-xl` |
| Fullscreen arch modal | `border-cyan-500/60 shadow-cyan-500/30` | `border-tomato-jam/40 shadow-tomato-jam/20` |
| Fullscreen arch label | `text-cyan-300 uppercase tracking-[0.18em]` | `text-tomato-jam uppercase tracking-[0.18em]` |
| Fullscreen dataflow modal | `border-fuchsia-500/60 shadow-fuchsia-500/30` | `border-metallic-gold/40 shadow-metallic-gold/20` |
| Fullscreen dataflow label | `text-fuchsia-300` | `text-metallic-gold` |
| Fullscreen close button | `bg-slate-900 text-slate-200 hover:bg-slate-800` | `bg-ink-black/80 text-almond-cream/70 hover:bg-almond-cream/10 rounded-full` |
| Fullscreen inner scroll area | `bg-slate-950/90` | `bg-ink-black/90` |

**What must NOT change:** `useEffect` with `fetch('/api/project-overview')`, `setProjectAnalysis()`, `setError()`, `window.dispatchEvent('usage-updated')`, `fullScreenArch`/`fullScreenDataFlow` state toggles, `MermaidDiagram` props (`code`, `id`, `onError`), `archRenderError`/`dataRenderError` callbacks, `showArchRaw`/`showDataRaw` toggles, all `ReactMarkdown` usage.

---

### 10. `DeepDiveExplorer` — [src/components/workbench/DeepDiveExplorer.tsx](src/components/workbench/DeepDiveExplorer.tsx)
**Type:** Workbench (heavy logic + UI)

#### Top nav bar (within workbench)
Same as CockpitDashboard nav — apply identical nav bar token swaps.

#### File tree panel
| Aspect | Current | Target Change |
|---|---|---|
| Panel bg | `bg-slate-950/80 border-r border-slate-800/50` | `bg-ink-black/80 border-r border-almond-cream/10` |
| Tree label | `text-almond-cream/40 uppercase tracking-[0.15em]` | Already correct if using almond-cream — else `text-almond-cream/40` |
| Folder row | `hover:bg-slate-900/60` | `hover:bg-almond-cream/5` |
| Folder chevron | `text-slate-400` | `text-almond-cream/30` |
| Folder icon | `text-cyan-400/70` | `text-tomato-jam/60` |
| Folder name | `text-slate-300 font-mono text-[11px]` | `text-almond-cream/60 font-mono text-[11px]` |
| File row (unselected) | `hover:bg-slate-900/60` | `hover:bg-almond-cream/5` |
| File row (selected) | `bg-cyan-500/20 border-l-2 border-cyan-400` | `bg-tomato-jam/10 border-l-2 border-tomato-jam` |
| File name (unselected) | `text-slate-200 font-mono text-[11px]` | `text-almond-cream/70 font-mono text-[11px]` |
| File name (selected) | `text-cyan-200 font-medium` | `text-tomato-jam font-medium` |
| Route icon | `text-purple-400` | `text-metallic-gold` |
| File icon | `text-slate-400` | `text-almond-cream/30` |
| Important indicator (Zap) | `text-amber-400` | `text-metallic-gold` |
| Complexity dots | `#fb7185` red / `#fbbf24` yellow / `#22c55e` green | `#c0392b` tomato-jam / `#d4af37` metallic-gold / `#e7d7c1` almond-cream — keep glow ring approach |

#### Editor panel
| Aspect | Current | Target Change |
|---|---|---|
| Panel bg | `bg-slate-950` | `bg-ink-black` |
| Monaco theme | `"vs-dark"` | Keep `"vs-dark"` — Monaco has no graffico theme, this is acceptable |
| Loading overlay | `text-slate-400` | `text-almond-cream/50` |
| Error state | `border-rose-500/30 bg-rose-950/20 text-rose-300` | `border-tomato-jam/30 bg-tomato-jam/5 text-tomato-jam/70` |

#### Summary/AI insight panel
| Aspect | Current | Target Change |
|---|---|---|
| Panel bg | `bg-slate-950/50` | `bg-ink-black/60` |
| Panel border | `border-slate-800/50` | `border-almond-cream/10` |
| "Generate AI Insight" button | `from-cyan-500 to-sky-500 text-slate-950` | `bg-tomato-jam text-white rounded-full hover:brightness-110 hover:scale-105` |
| Button icon | `Sparkles text-current` | Keep |
| Mermaid section header | `text-cyan-300` | `text-tomato-jam` |
| Summary text | `text-slate-300/text-slate-200 markdown-body` | `text-almond-cream/70` — keep `markdown-body` class |
| Spinner | `border-cyan-500/30 border-t-cyan-500` | `border-tomato-jam/20 border-t-tomato-jam` |

#### ReactFlow mini-map
| Aspect | Current | Target Change |
|---|---|---|
| Flow bg | `<Background>` default dark | Change node/edge colors: nodes `fill: ink-black/80 stroke: almond-cream/20`, edges `stroke: tomato-jam/40` |
| Initial nodes style | default | Add custom `style: { background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)', color: '#e7d7c1' }` |

**What must NOT change:** `buildFileTree()`, `FileTreeItem` memo component logic (toggle/select handlers), `useRepoContext()`, `useFileContext()`, `handleFileSelect()`, `handleToggleFolder()`, `handleGenerateSummary()` (fetch to `/api/file-summary`), `cache` state, `AbortController` usage, `setCurrentFile()`, all `fetch()` calls, `mermaid`/`summary`/`editorValue` state, Monaco editor `value`/`language` props, the `cleanMermaidCode()` function, `initialNodes`/`initialEdges` data (only style them).

---

### 11. `OmniChat` — [src/components/chat/OmniChat.tsx](src/components/chat/OmniChat.tsx)
**Type:** Global floating chat (mixed logic + UI)

| Aspect | Current | Target Change |
|---|---|---|
| FAB trigger button | `from-cyan-400 to-fuchsia-500 text-slate-950 shadow-cyan-500/40` | `bg-tomato-jam text-white shadow-[0_0_15px_rgba(192,57,43,0.5)] hover:brightness-110 hover:scale-105` |
| Chat panel | `border-slate-700/80 bg-slate-950/95 backdrop-blur-xl` | `rounded-2xl border border-almond-cream/10 bg-ink-black/95 backdrop-blur-xl` |
| Panel header border | `border-slate-800/50` | `border-almond-cream/10` |
| Title text | `text-cyan-300 uppercase tracking-[0.15em]` | `text-tomato-jam uppercase tracking-[0.15em]` |
| Context path text | `text-slate-400` | `text-almond-cream/40` |
| Close button | `bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-slate-100` | `bg-ink-black/80 text-almond-cream/40 hover:bg-almond-cream/10 hover:text-almond-cream rounded-lg` |
| Messages scroll area | `bg-slate-950/60` | `bg-ink-black/60 rounded-xl` |
| Empty state text | `text-slate-400` | `text-almond-cream/40` |
| Empty state heading | `text-slate-300` | `text-almond-cream/60` |
| Empty state context hint | `text-cyan-300/80` | `text-tomato-jam/70` |
| Inline code in hint | `bg-slate-900/50 text-[10px]` | `bg-ink-black/70 border border-almond-cream/10 text-almond-cream/60` |
| User message bubble | `bg-gradient-to-br from-cyan-500/20 to-sky-500/20 border-cyan-500/30 text-cyan-100` | `bg-tomato-jam/10 border border-tomato-jam/20 text-almond-cream` |
| Assistant message bubble | `bg-slate-900/80 border-slate-700/50 text-slate-200` | `bg-ink-black/80 border border-almond-cream/10 text-almond-cream/80` |
| ReactMarkdown: H1 | `text-sm font-semibold text-cyan-300` | `font-shrikhand text-sm text-tomato-jam` |
| ReactMarkdown: H2 | `text-xs font-semibold text-cyan-300` | `text-xs font-semibold text-tomato-jam` |
| ReactMarkdown: H3 | `text-xs font-medium text-sky-300` | `text-xs font-medium text-metallic-gold` |
| ReactMarkdown: inline code | `bg-slate-800/60 text-cyan-300` | `bg-ink-black/80 border border-almond-cream/10 text-tomato-jam` |
| ReactMarkdown: code block | `bg-slate-900/80 text-slate-300` | `bg-ink-black text-almond-cream/70` |
| ReactMarkdown: blockquote | `border-l-2 border-cyan-500/50 italic text-slate-300` | `border-l-2 border-tomato-jam/40 italic text-almond-cream/60` |
| ReactMarkdown: strong | `text-slate-100` | `text-almond-cream` |
| Streaming bubble | `bg-slate-900/80 border-slate-700/50` | `bg-ink-black/80 border border-almond-cream/10` |
| Streaming cursor | `bg-cyan-400 animate-pulse` | `bg-tomato-jam animate-pulse` |
| Chat input | `bg-slate-900/90 text-slate-100 placeholder:text-slate-500 focus:ring-cyan-500/50` | `bg-ink-black/80 border border-almond-cream/10 text-almond-cream placeholder:text-almond-cream/30 focus:ring-tomato-jam/40 focus:border-tomato-jam/40 rounded-xl` |
| Send button (enabled) | `from-cyan-500 to-sky-500 text-slate-950` | `bg-tomato-jam text-white rounded-xl hover:brightness-110` |
| Send button (disabled) | `disabled:opacity-50` | Keep |
| framer panel animation | spring in/out — keep as-is | Keep all motion values |

**What must NOT change:** `handleSend()`, `fetch('/api/chat')`, streaming reader loop, `window.dispatchEvent('usage-updated')`, `useRepoContext()`, `useFileContext()`, `messages`/`draft`/`sending`/`streamingContent` state, `open` toggle state, `scrollToBottom()` + `messagesEndRef`, `NarrationMessage` type usage.

---

### 12. `UsageIndicator` — [src/components/chat/UsageIndicator.tsx](src/components/chat/UsageIndicator.tsx)
**Type:** Floating trigger button

| Aspect | Current | Target Change |
|---|---|---|
| Position | `fixed bottom-5 left-5` | Keep position |
| Button style | `border-slate-700/50 bg-slate-900/90 backdrop-blur-xl text-slate-200 hover:border-cyan-500/50 hover:bg-slate-800/90` | `border-almond-cream/10 bg-ink-black/80 backdrop-blur-sm text-almond-cream/70 hover:border-tomato-jam/30 hover:bg-ink-black/90 rounded-full` |
| Zap icon | `text-cyan-400` | `text-tomato-jam` |
| "Usage" label | `font-semibold text-slate-200` | `font-semibold text-almond-cream/70` |

**What must NOT change:** `useSession()` guard, `setIsModalOpen(true)` trigger, `UsageModal` render.

---

### 13. `UsageModal` — [src/components/chat/UsageModal.tsx](src/components/chat/UsageModal.tsx)
**Type:** Modal (logic + UI)

| Aspect | Current | Target Change |
|---|---|---|
| Backdrop | `bg-black/50 backdrop-blur-sm` | `bg-ink-black/70 backdrop-blur-md` |
| Modal card | `border-slate-700/50 bg-slate-900/95 backdrop-blur-xl ring-slate-700/50` | `rounded-2xl border border-almond-cream/10 bg-ink-black/95 backdrop-blur-xl` |
| Icon wrapper | `from-cyan-500/20 to-sky-500/20 ring-cyan-500/30` | `from-tomato-jam/15 to-tomato-jam/5 ring-tomato-jam/20` |
| Zap icon | `text-cyan-400` | `text-tomato-jam` |
| Title | `text-slate-50` | `font-shrikhand text-almond-cream` |
| Subtitle | `text-slate-400` | `text-almond-cream/40` |
| Refresh button | `text-slate-400 hover:bg-slate-800/60 hover:text-cyan-400` | `text-almond-cream/40 hover:bg-almond-cream/5 hover:text-tomato-jam rounded-lg` |
| Close button | `text-slate-400 hover:bg-slate-800/60 hover:text-slate-200` | `text-almond-cream/40 hover:bg-almond-cream/5 hover:text-almond-cream rounded-lg` |
| Spinner | `border-cyan-500/30 border-t-cyan-500` | `border-tomato-jam/20 border-t-tomato-jam` |
| Bar label | `text-slate-300` | `text-almond-cream/70` |
| Bar count | `text-slate-400` | `text-almond-cream/40` |
| Bar track | `bg-slate-800` | `bg-almond-cream/10` |
| Bar fill (healthy) | `from-cyan-500 to-sky-500` | `from-tomato-jam to-[#e84832]` |
| Bar fill (warning) | `from-yellow-500 to-orange-500` | `from-metallic-gold to-[#c09020]` |
| Bar fill (critical) | `from-rose-500 to-red-600` | `from-tomato-jam to-[#7a1c14]` (darker red) |
| Remaining text | `text-slate-500` | `text-almond-cream/30` |
| Info box | `bg-slate-800/50 border-slate-700/50 text-slate-400` | `bg-ink-black/60 border border-almond-cream/10 text-almond-cream/40` |
| Info "Note:" label | `text-slate-300` | `text-almond-cream/60` |
| Timestamp | `text-slate-500` | `text-almond-cream/30` |
| "Live tracking" | `text-slate-500` | `text-almond-cream/30` |
| Live dot | `bg-cyan-400 animate-pulse` | `bg-tomato-jam animate-pulse` |
| "Unable to load" | `text-slate-400` | `text-almond-cream/40` |
| motion animation | spring stiffness 300 — keep | Keep all motion values |

**What must NOT change:** `fetchUsage()` function, `fetch('/api/usage?...')`, `setInterval` auto-refresh, `window.addEventListener('usage-updated')`, `tokenPercent`/`requestPercent` calculations, `isOpen`/`onClose` props, `loading`/`refreshing` states, `useSession()`.

---

### 14. `MermaidDiagram` — [src/components/diagrams/MermaidDiagram.tsx](src/components/diagrams/MermaidDiagram.tsx)
**Type:** Diagram renderer (almost pure logic)

| Aspect | Current | Target Change |
|---|---|---|
| Wrapper div | `text-slate-100 space-y-1` | `text-almond-cream space-y-1` |
| Error message | `text-amber-400` | `text-metallic-gold` |
| `mermaid.initialize` theme | `"dark"` | Keep `"dark"` — Mermaid dark theme is acceptable |
| Inline error HTML | `border-amber-500/30 bg-amber-950/20 text-amber-400` | `border border-metallic-gold/30 bg-ink-black/60 text-metallic-gold` |
| Raw code pre | `bg-slate-900/50 text-slate-300` | `bg-ink-black text-almond-cream/70` |

**What must NOT change:** The entire `sanitizeMermaidCode()` function, `createFallbackDiagram()`, `mermaid.initialize()` config (except theme optionally), all `useRef`/`useState`, the `useEffect` render logic, `isRenderingRef`, `renderedCodeRef`, the SVG performance hinting code.

---

### 15. `NeuralBackground` — [src/components/ui/neural-background.tsx](src/components/ui/neural-background.tsx)
**Type:** Pure visual (decorative only)

| Aspect | Current | Target Change |
|---|---|---|
| Root bg | `bg-[#0B0F19]` | `bg-ink-black` (`#101011`) |
| Vignette gradient | `rgba(11,15,25,...)` | `rgba(16,16,17,...)` — ink-black values |
| Cyan gradient | `stopColor="#22D3EE"` | `stopColor="#c0392b"` (tomato-jam) |
| Purple gradient | `stopColor="#A855F7"` / `stopColor="#22D3EE"` | `stopColor="#d4af37"` (metallic-gold) / `stopColor="#c0392b"` (tomato-jam) |
| Stroke width | `1.5` | Keep |
| Glow filter `stdDeviation` | `3` | Keep |

**What must NOT change:** `generateRandomPath()`, `useEffect` resize handler, `setPaths()`, `setDimensions()`, all framer-motion path animation values (`pathLength`, `opacity`, `duration`, `delay`, `repeat`, `times`).

---

### 16. `SignInPage` — [src/app/api/auth/signin/page.tsx](src/app/api/auth/signin/page.tsx)
**Type:** Auth page

| Aspect | Current | Target Change |
|---|---|---|
| BG blobs | `bg-cyan-500/20 blur-3xl` / `bg-fuchsia-500/20 blur-3xl` | `bg-tomato-jam/15 blur-3xl` / `bg-metallic-gold/10 blur-3xl` |
| Card | `glass-panel` | `rounded-3xl border border-almond-cream/10 bg-ink-black/80 backdrop-blur-md` |
| Card inner gradient | `from-cyan-500/20 via-transparent to-fuchsia-500/20` | `from-tomato-jam/10 via-transparent to-metallic-gold/10` |
| Logo glow | `bg-cyan-400/20` | `bg-tomato-jam/20` |
| Brand gradient | `from-slate-50 to-slate-300 group-hover:from-cyan-300` | `from-almond-cream to-almond-cream/80 group-hover:from-tomato-jam` |
| H1 | `text-3xl font-semibold text-slate-50` | `font-shrikhand text-3xl text-almond-cream` |
| Subtitle | `text-slate-400` | `text-almond-cream/50` |
| Feature icon wrapper | `from-cyan-500/20 to-sky-500/20 ring-cyan-500/30` | `from-tomato-jam/15 to-tomato-jam/5 ring-tomato-jam/20` |
| Feature icon | `text-cyan-400` | `text-tomato-jam` |
| Feature text | `text-slate-300` | `text-almond-cream/70` |
| GitHub button | `from-slate-800/90 to-slate-900/90 ring-slate-700/70 text-slate-200 hover:ring-slate-600/80 hover:shadow-cyan-500/10` | `border border-almond-cream/10 bg-ink-black/70 text-almond-cream/80 hover:border-almond-cream/20 hover:bg-ink-black/90 rounded-xl` |
| GitHub button hover overlay | `from-cyan-500/0 via-cyan-500/10` | `from-tomato-jam/0 via-tomato-jam/5` |
| GitHub loading spinner | `border-slate-400 border-t-transparent` | `border-almond-cream/40 border-t-almond-cream` |
| Google button | `bg-white text-slate-900 ring-slate-300/50` (light) | Keep light — OR use `bg-almond-cream text-ink-black hover:bg-almond-cream/90` |
| Legal links | `text-cyan-400 hover:text-cyan-300` | `text-tomato-jam hover:text-tomato-jam/70` |
| Back to home | `text-slate-500 hover:text-cyan-400` | `text-almond-cream/30 hover:text-tomato-jam` |
| Back arrow | `rotate-180` — keep | Keep |

**What must NOT change:** `handleSignIn()`, `signIn('github', ...)`, `signIn('google', ...)`, `loading` state, `features` array data, `callbackUrl: '/'`, motion animation values.

---

## SUMMARY TABLE — EFFORT ESTIMATE

| Component | Risk Level | UI Changes | Logic Preserved |
|---|---|---|---|
| `globals.css` | Low | Token replacement, redefine `.glass-panel` | N/A |
| `layout.tsx` | Low | Font swap, body classes | Provider order |
| `Header` | Low | Color + ring swaps | pathname logic |
| `AuthButton` | Low | Color + radius swaps | All auth calls |
| `AuthGuard` | Very Low | Spinner color only | All useEffect guards |
| `NeuralBackground` | Very Low | Color values only | All animation logic |
| `SignInPage` | Low | Colors + font | handleSignIn, loading |
| `UsageIndicator` | Very Low | Button style | Session guard, modal trigger |
| `UsageModal` | Low | Colors + bars | fetch, interval, event listener |
| `MermaidDiagram` | Very Low | Wrapper text color | All render logic |
| `NeuralLoadingBay` | Medium | Colors + animation palette | Entire fetch chain |
| `OmniChat` | Medium | Colors + bubble styles + markdown | Entire streaming logic |
| `ProjectOverview` | Medium | Colors + card styles | Entire fetch chain |
| `CockpitDashboard` | Medium | Colors + recharts colors + card styles | All transforms, routing |
| `DeepDiveExplorer` | High | Colors + tree item styles + panel styles | buildFileTree, all fetches |

---

## RECOMMENDED EXECUTION SEQUENCE

```
1. globals.css          → adds all new tokens, redefines glass-panel and bg-rn-gradient
2. layout.tsx           → font swap, body tokens
3. AuthGuard            → trivial, zero risk
4. UsageIndicator       → trivial, zero risk
5. NeuralBackground     → color values only
6. Header               → structural nav, low risk
7. AuthButton           → dropdown + sign-in button
8. SignInPage           → isolated page
9. UsageModal           → modal, low risk
10. MermaidDiagram      → wrapper only
11. NeuralLoadingBay    → loading page, test error paths
12. OmniChat            → chat panel, test streaming still works
13. ProjectOverview     → tab content, test fetch + render
14. CockpitDashboard    → dashboard, test recharts + tab
15. DeepDiveExplorer    → most complex, test file select + summary + Monaco
```
