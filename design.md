# GRAFFICO.IT — DESIGN SYSTEM IMPLEMENTATION SPECIFICATION
> Reverse-engineered from https://graffico.it/
> Target stack: React + Tailwind CSS v4
> DO NOT copy text content. This is a design token + component spec only.

---

## TABLE OF CONTENTS
1. [Tech Stack](#1-tech-stack)
2. [Typography](#2-typography)
3. [Color System](#3-color-system)
4. [Spacing & Layout](#4-spacing--layout)
5. [Components](#5-components)
6. [Animations & Motion](#6-animations--motion)
7. [Advanced Motion](#7-advanced-motion)
8. [Interaction Details](#8-interaction-details)
9. [Assets & Texture](#9-assets--texture)
10. [Tailwind Config](#10-tailwind-config)
11. [CSS Token Layer](#11-css-token-layer)
12. [Implementation Checklist](#12-implementation-checklist)

---

## 1. TECH STACK

| Layer | Graffico Choice | Your Implementation |
|---|---|---|
| Framework | Next.js (App Router) | Next.js (App Router) ✓ already |
| CSS | Tailwind CSS v4 | Tailwind CSS v4 ✓ already |
| Animation | **GSAP 3.14.2 + ScrollTrigger** | Install: `npm i gsap` |
| Scroll-driven | GSAP ScrollTrigger + CSS `--scroll-progress` var | Same |
| 3D/Motion | CSS `transform-style: preserve-3d` + JS-driven CSS vars | Same |
| Fonts | Self-hosted woff2 (Next.js font pipeline) | `next/font/local` |
| CMS | Contentful | N/A |
| Icons | **Lucide React** | Already installed ✓ |
| Noise Texture | External SVG (`grainy-gradients.vercel.app/noise.svg`) | Use same URL or self-host |

---

## 2. TYPOGRAPHY

### 2.1 Font Stack

```
Display / Headings → Shrikhand (weight: 400 only — it is a single-weight display font)
Body / UI          → Work Sans (variable, weight: 100–900)
Monospace          → PP Fraktion Mono (licensed; fallback: JetBrains Mono / monospace)
Editorial Serif    → PP Editorial New (licensed; fallback: Georgia / serif)
```

### 2.2 Font Loading — Next.js Implementation

```tsx
// src/app/layout.tsx
import { Shrikhand, Work_Sans } from 'next/font/google'

const shrikhand = Shrikhand({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-shrikhand',
  display: 'swap',
})

const workSans = Work_Sans({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin', 'latin-ext'],
  variable: '--font-work-sans',
  display: 'swap',
})

// Apply to <html>:
// className={`${shrikhand.variable} ${workSans.variable}`}
```

### 2.3 CSS Font Variables

```css
:root {
  --font-shrikhand: 'Shrikhand', serif;
  --font-work-sans: 'Work Sans', system-ui, sans-serif;
  --font-fraktion:  'PP Fraktion Mono', 'JetBrains Mono', monospace;
  --font-editorial: 'PP Editorial New', Georgia, serif;
  --default-font-family: var(--font-work-sans);
}
```

### 2.4 Tailwind Font Classes

```css
/* globals.css or Tailwind plugin */
.font-shrikhand { font-family: var(--font-shrikhand); font-style: normal; font-weight: 400; }
.font-sans      { font-family: var(--font-work-sans); }
.font-fraktion  { font-family: var(--font-fraktion); }
.font-editorial { font-family: var(--font-editorial); }
```

### 2.5 Type Scale

| Token | rem | px | Line Height |
|---|---|---|---|
| `text-xs` | 0.75rem | 12px | 1.333 |
| `text-sm` | 0.875rem | 14px | 1.429 |
| `text-base` | 1rem | 16px | 1.5 |
| `text-lg` | 1.125rem | 18px | 1.556 |
| `text-xl` | 1.25rem | 20px | 1.4 |
| `text-2xl` | 1.5rem | 24px | 1.333 |
| `text-3xl` | 1.875rem | 30px | 1.2 |
| `text-4xl` | 2.25rem | 36px | 1.111 |
| `text-5xl` | 3rem | 48px | 1 |
| `text-6xl` | 3.75rem | 60px | 1 |
| `text-7xl` | 4.5rem | 72px | 1 |
| `text-8xl` | 6rem | 96px | 1 |
| `text-9xl` | 8rem | 128px | 1 |

### 2.6 Heading Scale (Usage Pattern)

```
H1 → font-shrikhand text-4xl md:text-5xl lg:text-6xl text-almond-cream leading-tight
H2 → font-shrikhand text-3xl md:text-4xl text-almond-cream
H3 → font-sans text-xl md:text-2xl font-semibold text-almond-cream
H4 → font-sans text-lg font-semibold text-almond-cream
Body → font-sans text-base text-almond-cream/70 leading-relaxed
Label/Tag → font-sans text-sm font-medium tracking-wider uppercase
Mono → font-fraktion text-sm
```

### 2.7 Letter Spacing

```
tracking-wider   → 0.05em   (used on labels/tags)
tracking-widest  → 0.1em    (used on small uppercase labels)
tracking-tight   → -0.025em (used on large display headings)
```

### 2.8 Responsive Typography Behavior

- Mobile: `text-4xl` for H1
- md: `text-5xl` for H1
- lg: `text-6xl` for H1
- No fluid/clamp typography detected — step-based breakpoint changes only.

---

## 3. COLOR SYSTEM

### 3.1 Brand Palette

```css
/* Primary brand colors — define as Tailwind theme extensions */
--color-tomato-jam:    #c0392b;   /* primary accent / CTA red */
--color-almond-cream:  #e7d7c1;   /* primary text on dark / warm white */
--color-metallic-gold: #d4af37;   /* secondary accent / decorative gold */
--color-ink-black:     #101011;   /* primary background — near-black */
--color-seppia-black:  #040f0f;   /* darkest variant */
```

### 3.2 Background Layers

```
Layer 0 (base body):       bg-ink-black           → #101011
Layer 1 (cards/panels):    bg-ink-black/80        → #101011 at 80% opacity
Layer 2 (floating/glass):  bg-ink-black/40 + backdrop-blur-sm
Layer 3 (decorative blob): absolute, blur-3xl, animate-pulse
```

### 3.3 Text Colors

```
Primary text:    text-almond-cream       → #e7d7c1  (full opacity)
Secondary text:  text-almond-cream/70   → 70% opacity
Muted text:      text-almond-cream/40   → 40% opacity
Accent text:     text-tomato-jam        → #c0392b
Gold text:       text-metallic-gold     → #d4af37
On-red:          text-white             → #ffffff
```

### 3.4 Gradients

```css
/* Blob 1 — top right, subtle red-gold */
.blob-1 {
  @apply absolute inset-0 bg-linear-to-br from-tomato-jam/20 via-metallic-gold/10 to-transparent blur-3xl;
}

/* Blob 2 — bottom left, pulsing */
.blob-2 {
  @apply absolute inset-0 bg-linear-to-tl from-transparent via-almond-cream/5 to-tomato-jam/20 blur-3xl animate-pulse;
}

/* Image bottom fade */
.image-fade {
  @apply absolute inset-0 bg-linear-to-t from-ink-black/20 via-transparent to-transparent pointer-events-none;
}
```

### 3.5 Opacity Usage Pattern

Graffico uses Tailwind's `/[opacity]` suffix extensively with their brand colors:
```
bg-tomato-jam/5   bg-tomato-jam/10   bg-tomato-jam/20
bg-almond-cream/5 bg-almond-cream/10 bg-almond-cream/20 bg-almond-cream/30
bg-ink-black/10   bg-ink-black/20    bg-ink-black/40    bg-ink-black/50    bg-ink-black/80

text-almond-cream/40  text-almond-cream/70  text-almond-cream/90
text-tomato-jam/15    text-tomato-jam/20    text-tomato-jam/80
text-metallic-gold/20

border-tomato-jam/30
border-almond-cream/10 border-almond-cream/20
```

Color-mix mode: Tailwind v4 uses `color-mix(in oklab, ...)` for opacity variants.

### 3.6 Dark Mode

**Graffico is dark-first, no light/dark toggle.** The entire site runs on `bg-ink-black`.
- No `dark:` class variants needed.
- `<html>` has no `.dark` class.
- Semantic shadcn tokens exist in CSS but are NOT the active design system — the brand tokens above are.

### 3.7 Selection Colors

```css
::selection {
  background-color: #c0392b; /* tomato-jam */
  color: #ffffff;
}
```

Tailwind: `selection:bg-tomato-jam selection:text-white` on `<body>`.

### 3.8 Meta Theme Colors

```html
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#F5E6D3">
<meta name="theme-color" media="(prefers-color-scheme: dark)"  content="#1A1A1A">
```

---

## 4. SPACING & LAYOUT

### 4.1 Spacing Base Unit

```
base: 0.25rem (4px) — standard Tailwind spacing scale
```

### 4.2 Container System

```
Article/Content: max-w-4xl mx-auto px-4 sm:px-6 lg:px-8
Narrow CTA copy: max-w-xl mx-auto
Wide sections:   max-w-7xl mx-auto
Full bleed:      w-full (no max-width)
```

### 4.3 Grid System

```css
/* 12-column grid (primary layout grid) */
grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12

/* Common column spans on 12-col */
md:col-span-5 lg:col-span-5 xl:col-span-4   /* narrow column */
md:col-span-7 lg:col-span-7 xl:col-span-8   /* wide column */
md:col-span-6                                /* half-half */
md:col-span-3                                /* quarter */
md:col-span-2                                /* small sidebar/label */

/* Auto 2-col */
md:grid-cols-2

/* Auto 3-col */
lg:grid-cols-3

/* Special: fluid + auto */
grid-cols-[1fr_auto]
```

### 4.4 Section Spacing

```
Section vertical padding:  py-24 md:py-32 lg:py-40
Section gap (grid items):  gap-6 md:gap-8 lg:gap-12
Card internal padding:     p-6 md:p-8 lg:p-12
Article padding:           px-4 py-12 sm:px-6 lg:px-8
```

### 4.5 Responsive Breakpoints

| Prefix | Breakpoint |
|---|---|
| (base) | 0px — mobile |
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |
| `2xl:` | 1600px |

Custom JS breakpoints (not Tailwind classes):
- `987px` — 3D project carousel switches behavior
- `767px` — Mobile 3D carousel mode

### 4.6 Border Radius System

```
rounded-full   → 9999px    (pills, tags, avatar, buttons)
rounded-3xl    → 24px      (cards, sections, modals — PRIMARY radius)
rounded-2xl    → 16px      (smaller cards)
rounded-xl     → 12px      (inputs, small cards)
rounded-lg     → 8px       (tiny elements)
```

**Signature: `rounded-3xl` is used everywhere as the dominant card radius.**

---

## 5. COMPONENTS

### 5.1 Navbar

```tsx
// Behavior:
// - Fixed top, full-width
// - bg-ink-black/80 + backdrop-blur-md
// - border-b border-almond-cream/10
// - Hidden on scroll down, revealed on scroll up (GSAP-driven)
// - NOT shrinking — stays same height
// - Logo + nav links + CTA button

// Classes:
<nav className="fixed top-0 left-0 right-0 z-50 border-b border-almond-cream/10 bg-ink-black/80 backdrop-blur-md">
  <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    {/* Logo, links, CTA */}
  </div>
</nav>
```

### 5.2 Buttons

**Primary Button (on dark bg):**
```tsx
<button className="
  inline-flex items-center gap-2
  rounded-full
  bg-tomato-jam px-8 py-3
  font-sans font-bold text-white
  transition-all duration-300
  hover:scale-105 hover:brightness-110
  active:scale-95
  shadow-[0_0_15px_rgba(192,57,43,0.4)]
  hover:shadow-[0_0_25px_rgba(192,57,43,0.6)]
">
```

**Secondary Button (on red bg / CTA):**
```tsx
<a className="
  inline-block
  rounded-full
  bg-white px-8 py-3
  font-bold text-tomato-jam
  transition-all duration-300
  hover:bg-almond-cream/90
  hover:scale-105
  active:scale-95
">
```

**Ghost/Outline Button:**
```tsx
<button className="
  inline-flex items-center gap-2
  rounded-full
  border border-almond-cream/20 px-6 py-2.5
  font-sans text-sm font-medium text-almond-cream
  transition-all duration-300
  hover:border-almond-cream/50 hover:text-almond-cream
  backdrop-blur-sm
">
```

**Arrow bounce button (with animated icon):**
```tsx
<button className="group inline-flex items-center gap-2 ...">
  <span>Label</span>
  <ArrowRight className="h-4 w-4 transition-transform duration-300 animate-[arrow-bounce_1s_ease-in-out_infinite]" />
</button>
```

### 5.3 Cards

**Standard dark card:**
```tsx
<div className="
  group relative
  rounded-3xl
  border border-almond-cream/10
  bg-ink-black/80 backdrop-blur-sm
  p-6 md:p-8
  overflow-hidden
  transition-all duration-500
  hover:-translate-y-2
  hover:border-almond-cream/20
  hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]
">
  {/* Noise texture overlay */}
  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
  {/* Content */}
</div>
```

**Service/feature card:**
```tsx
<div className="
  group relative rounded-3xl
  border border-tomato-jam/20
  bg-tomato-jam/5
  p-6 md:p-8
  overflow-hidden
  transition-all duration-300
  hover:bg-tomato-jam/10
  hover:border-tomato-jam/30
">
```

**CTA card (on tomato-jam background):**
```tsx
<div className="
  group relative
  rounded-3xl
  bg-tomato-jam p-8 md:p-12
  text-center overflow-hidden
">
  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
  {/* content */}
</div>
```

### 5.4 Tags / Badges

```tsx
<span className="
  inline-flex items-center gap-2
  rounded-full
  border border-tomato-jam/30
  bg-tomato-jam/10
  px-4 py-2
  text-sm font-medium text-tomato-jam
  tracking-wider uppercase
  backdrop-blur-sm
">
  Label
</span>
```

Gold variant:
```tsx
<span className="
  inline-flex items-center gap-2
  rounded-full
  border border-metallic-gold/30
  bg-metallic-gold/10
  px-4 py-2
  text-sm font-medium text-metallic-gold
  tracking-wider uppercase
">
```

### 5.5 Divider

```tsx
<div className="my-16 flex items-center gap-4">
  <div className="h-px flex-1 bg-almond-cream/10" />
  <div className="h-2 w-2 rounded-full bg-almond-cream/5" />
  <div className="h-2 w-2 rounded-full bg-almond-cream/10" />
  <div className="h-2 w-2 rounded-full bg-almond-cream/5" />
  <div className="h-px flex-1 bg-almond-cream/10" />
</div>
```

### 5.6 Inputs & Forms

```tsx
<input className="
  w-full rounded-xl
  border border-almond-cream/20
  bg-ink-black/60 backdrop-blur-sm
  px-4 py-3
  text-almond-cream placeholder:text-almond-cream/30
  text-sm font-sans
  outline-none
  transition-all duration-200
  focus:border-tomato-jam/50
  focus:ring-2 focus:ring-tomato-jam/20
  focus:bg-ink-black/80
" />

<textarea className="
  w-full rounded-xl
  border border-almond-cream/20
  bg-ink-black/60 backdrop-blur-sm
  px-4 py-3
  text-almond-cream placeholder:text-almond-cream/30
  text-sm font-sans
  outline-none resize-none
  transition-all duration-200
  focus:border-tomato-jam/50
  focus:ring-2 focus:ring-tomato-jam/20
" />
```

### 5.7 Blockquote (Article)

```tsx
<blockquote className="
  my-8
  border-l-4 border-l-tomato-jam
  bg-tomato-jam/10
  p-6
  italic
  text-almond-cream
  rounded-r-2xl
">
```

### 5.8 Featured Image Block

```tsx
<div className="relative mb-12 overflow-hidden rounded-3xl">
  <div className="relative aspect-video w-full">
    <Image fill className="object-cover" ... />
    {/* Bottom fade */}
    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink-black/20 via-transparent to-transparent" />
  </div>
</div>
```

### 5.9 Floating Decorative Icons (ambient)

```tsx
{/* Used as background decoration, positioned absolute, low opacity, animated */}
<Sparkles className="absolute top-[15%] right-[10%] h-16 w-16 text-tomato-jam/20 animate-pulse" style={{ animationDelay: '1s' }} />
<Star className="absolute bottom-[20%] left-[15%] h-20 w-20 text-metallic-gold/20 animate-pulse" style={{ animationDelay: '0.5s' }} />
```

### 5.10 Scroll Indicator (two variants)

```tsx
{/* Mouse/dot scroll indicator */}
<div className="relative h-10 w-6 rounded-full border-2 border-almond-cream/30">
  <div className="absolute left-1/2 top-2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-almond-cream animate-scroll-dot" />
</div>

{/* Swipe-up touch indicator */}
<div className="relative h-8 w-4 overflow-hidden">
  <div className="absolute left-1/2 h-1.5 w-1.5 rounded-full bg-almond-cream/60 animate-swipe-up" />
</div>
```

### 5.11 Footer

```
Layout: dark bg-ink-black, border-t border-almond-cream/10
Content: logo, nav links grid, contact info, legal links
Spacing: py-16 md:py-24
Typography: text-almond-cream/60 text-sm
```

---

## 6. ANIMATIONS & MOTION

### 6.1 Custom Keyframes (add to globals.css)

```css
@keyframes emoji-bounce {
  0%, 100% { transform: translateY(0) rotate(var(--rotation, 0deg)); }
  50%       { transform: translateY(-10px) rotate(var(--rotation, 0deg)); }
}

@keyframes arrow-bounce {
  0%, 100% { transform: translate(0); }
  50%       { transform: translate(4px); }
}

@keyframes scroll-dot {
  0%   { opacity: 0; transform: translate(-50%, 0.5rem); }
  20%  { opacity: 1; }
  80%  { opacity: 1; }
  100% { opacity: 0; transform: translate(-50%, 2rem); }
}

@keyframes swipe-up {
  0%   { opacity: 0; transform: translate(-50%, 1.5rem); }
  20%  { opacity: 1; transform: translate(-50%, 1.2rem); }
  80%  { opacity: 1; transform: translate(-50%, -1.2rem); }
  100% { opacity: 0; transform: translate(-50%, -1.5rem); }
}
```

### 6.2 Tailwind Animation Config

```js
// tailwind.config (v3 syntax) or CSS layer (v4)
extend: {
  animation: {
    'emoji-bounce': 'emoji-bounce 2s ease-in-out infinite',
    'arrow-bounce': 'arrow-bounce 1s ease-in-out infinite',
    'scroll-dot':   'scroll-dot 2s ease-in-out infinite',
    'swipe-up':     'swipe-up 2s ease-in-out infinite',
  }
}
```

### 6.3 Standard Transition Durations

```
Fast UI feedback:    duration-150 (default Tailwind)
Component hover:     duration-200 to duration-300
Color transitions:   duration-200
Scale/transform:     duration-300
Large reveals:       duration-500 to duration-700
```

### 6.4 Easing

```
General transitions: cubic-bezier(0.4, 0, 0.2, 1)   → ease-in-out (Tailwind default)
Reveal/enter:        cubic-bezier(0, 0, 0.2, 1)       → ease-out
GSAP reveals:        power2.out
GSAP scrub:          power1.inOut
GSAP instant:        none
```

### 6.5 Hover Animation Catalog

```
hover:scale-105                → scale up 5%
hover:scale-110                → scale up 10%
hover:-translate-y-2           → lift 0.5rem
hover:brightness-110           → brighten

group-hover:scale-100          → stop child scaling
group-hover:scale-105          → scale child
group-hover:rotate-12          → rotate icon slightly
group-hover:rotate-45          → rotate icon to arrow
group-hover:translate-x-1      → shift child right 4px
group-hover:translate-x-2      → shift child right 8px
group-hover:translate-y-0      → reveal hidden child
group-hover:w-6                → expand underline/bar
group-hover:text-almond-cream  → text color shift
group-hover:text-tomato-jam    → accent on hover
group-hover:brightness-110     → image brighten

active:scale-95                → press feedback
active:scale-[0.98]            → subtle press feedback
```

All hover states wrapped in `@media (hover: hover)` to avoid sticky states on mobile.

---

## 7. ADVANCED MOTION

### 7.1 GSAP Setup

```tsx
// src/lib/gsap.ts
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }
```

```tsx
// In components — always client-side only
'use client'
import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export function AnimatedSection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        opacity: 0,
        y: 60,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return <div ref={ref}>...</div>
}
```

### 7.2 Parallax Scroll via CSS Variable

```tsx
// Hook: sets --scroll-progress on a container as user scrolls
'use client'
import { useEffect, useRef } from 'react'

export function useScrollProgress() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handler = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const progress = 1 - (rect.top + rect.height) / (vh + rect.height)
      el.style.setProperty('--scroll-progress', progress.toFixed(4))
    }

    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return ref
}
```

```tsx
// Usage in JSX:
<section ref={ref} className="relative overflow-hidden">
  {/* Slow layer: -5% */}
  <div className="translate-y-[calc(var(--scroll-progress)*-5%)]">...</div>
  {/* Fast layer: -15% */}
  <div className="translate-y-[calc(var(--scroll-progress)*-15%)]">...</div>
</section>
```

### 7.3 3D Project Scroll Carousel

This is the signature interaction: cards rotate and translate in 3D as user scrolls through a section.

```css
/* globals.css */
.js-work {
  transform:
    rotateY(calc(var(--progress) * -20deg))
    translate3d(
      calc(var(--progress) * (50vw + 100%) - 50%),
      calc(var(--y) * 50% - 50%),
      calc(var(--progress) * var(--progress) * -5rem)
    )
    scale(var(--size))
    translateZ(0);
  backface-visibility: hidden;
  will-change: transform;
  transform-style: preserve-3d;
  isolation: isolate;
}

@media (max-width: 987px) {
  .js-work {
    /* --y multiplier: still 50% */
  }
}

@media (max-width: 767px) {
  .js-work {
    /* --y multiplier: 100% for mobile */
    transform:
      rotateY(calc(var(--progress) * -20deg))
      translate3d(
        calc(var(--progress) * (50vw + 100%) - 50%),
        calc(var(--y) * 100% - 50%),
        calc(var(--progress) * var(--progress) * -5rem)
      )
      translateZ(0);
  }
}

.js-work-word {
  transform: translate3d(calc(var(--progress) * (80vw + 150%) - 50%), 0, 0);
  will-change: transform;
}
```

```tsx
// Controller: updates --progress and --y CSS vars via GSAP ScrollTrigger
useEffect(() => {
  const items = document.querySelectorAll('.js-work')
  items.forEach((item, i) => {
    const el = item as HTMLElement
    el.style.setProperty('--y', String(i / (items.length - 1)))
    el.style.setProperty('--size', '0.85')
    el.style.setProperty('--state', '1')

    gsap.to(el, {
      '--progress': 1,
      '--size': 1,
      ease: 'none',
      scrollTrigger: {
        trigger: el.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    })
  })
}, [])
```

### 7.4 Letter Scene Animation

```css
/* globals.css */
.s__scene__letter {
  --head:  calc((var(--progress) - 0.5) * -2);
  --ahead: calc(var(--head) * var(--head));
  transform:
    rotateY(calc(var(--head) * -10deg * var(--state)))
    translate3d(
      calc(var(--head) * 50vw * var(--state)),
      calc(var(--iy) * 50% * var(--ahead) * var(--state)),
      0
    );
}
```

### 7.5 Staggered Reveals (GSAP)

```tsx
// Stagger children on scroll enter
gsap.from('.stagger-child', {
  opacity: 0,
  y: 40,
  duration: 0.6,
  ease: 'power2.out',
  stagger: 0.12,
  scrollTrigger: {
    trigger: '.stagger-parent',
    start: 'top 80%',
  }
})
```

### 7.6 Reduced Motion Overrides

```css
@media (prefers-reduced-motion: reduce) {
  .js-work {
    opacity: 1 !important;
    visibility: visible !important;
    transition: none !important;
    position: relative !important;
    top: auto !important;
    left: auto !important;
    transform: none !important;
  }
  .s__scene__letter {
    transition: none !important;
    transform: none !important;
  }
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 7.7 Perspective Container

```tsx
<div className="perspective-[40rem] transform-style-3d">
  {/* 3D children */}
</div>
```

Tailwind custom utility:
```css
.perspective-\[40rem\] { perspective: 40rem; }
.transform-style-3d { transform-style: preserve-3d; }
```

---

## 8. INTERACTION DETAILS

### 8.1 Focus States

```tsx
// Standard: tomato-jam ring
className="outline-none focus-visible:ring-2 focus-visible:ring-tomato-jam/50 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-black"
```

### 8.2 Accordion (FAQ) — CSS Grid technique

```css
/* Collapsed */
.accordion-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.3s ease; overflow: hidden; }
/* Expanded */
.accordion-body[data-open="true"] { grid-template-rows: 1fr; }

/* Inner content needs min-height: 0 to work */
.accordion-inner { min-height: 0; }
```

```tsx
// Tailwind equivalent:
<div className={`grid transition-all duration-300 ease-in-out overflow-hidden ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
  <div className="overflow-hidden min-h-0">
    {/* content */}
  </div>
</div>
```

### 8.3 Image Hover Effects

```tsx
<div className="group relative overflow-hidden rounded-3xl">
  <div className="transition-transform duration-500 group-hover:scale-105">
    <Image ... />
  </div>
  {/* Overlay appears on hover */}
  <div className="absolute inset-0 bg-ink-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
</div>
```

### 8.4 Loading State

```tsx
// Spinner using existing animate-spin
<div className="h-8 w-8 rounded-full border-4 border-almond-cream/20 border-t-tomato-jam animate-spin" />

// Pulse skeleton
<div className="h-4 w-32 rounded-full bg-almond-cream/10 animate-pulse" />
```

### 8.5 Button Press Feedback

```tsx
// Scale down on active — included in button classes
active:scale-95   // standard buttons
active:scale-[0.98]  // subtle press
```

---

## 9. ASSETS & TEXTURE

### 9.1 Noise Texture Overlay

```tsx
{/* Applied on CTA sections and featured blocks */}
<div
  className="pointer-events-none absolute inset-0 opacity-20"
  style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
/>
```

For self-hosting: download the SVG and place in `/public/noise.svg`, then use `bg-[url('/noise.svg')]`.

On cards (subtle): `opacity-[0.03]`
On CTA blocks: `opacity-20`

### 9.2 Icon System

```
Library: Lucide React
Style: outline (default Lucide stroke style)
Common icons used: Sparkles, Laptop, Layers, Lightbulb, Palette, Rocket, ArrowRight, ChevronDown
Size: h-4 w-4 (inline), h-6 w-6 (button), h-8 w-8 (card), h-16 w-16 (decorative), h-24 w-24 (hero bg)
```

### 9.3 Image Treatment

```
Border radius: rounded-3xl (24px) — always
Aspect ratios used:
  - aspect-video (16/9) for featured/hero
  - aspect-square (1/1) for avatars
  - aspect-4/3 for standard cards
  - aspect-[270/530] for portrait phone mockups
  - aspect-[550/326] for landscape cards

Overlays:
  - Bottom fade: bg-linear-to-t from-ink-black/20 via-transparent to-transparent
  - Hover darken: bg-ink-black/40 opacity-0 → opacity-100 on group-hover

Filter on hover: group-hover:brightness-110
```

### 9.4 Background Pattern Architecture

```
1. Base:      body bg-ink-black (#101011)
2. Noise:     absolute inset-0 noise.svg opacity-[0.03] (on sections)
3. Blob 1:    absolute, bg-linear-to-br from-tomato-jam/20, blur-3xl (static)
4. Blob 2:    absolute, bg-linear-to-tl via-almond-cream/5, blur-3xl, animate-pulse (moving)
5. Content:   relative z-10 (always on top of decorative layers)
```

---

## 10. TAILWIND CONFIG

For Tailwind CSS v4, add custom tokens in `globals.css`:

```css
@import "tailwindcss";

@theme {
  /* Brand colors */
  --color-tomato-jam:    #c0392b;
  --color-almond-cream:  #e7d7c1;
  --color-metallic-gold: #d4af37;
  --color-ink-black:     #101011;
  --color-seppia-black:  #040f0f;

  /* Fonts */
  --font-shrikhand: 'Shrikhand', serif;
  --font-work-sans: 'Work Sans', system-ui, sans-serif;
  --font-fraktion:  'PP Fraktion Mono', 'JetBrains Mono', monospace;
  --font-editorial: 'PP Editorial New', Georgia, serif;

  /* Custom animations */
  --animate-emoji-bounce: emoji-bounce 2s ease-in-out infinite;
  --animate-arrow-bounce: arrow-bounce 1s ease-in-out infinite;
  --animate-scroll-dot:   scroll-dot 2s ease-in-out infinite;
  --animate-swipe-up:     swipe-up 2s ease-in-out infinite;
}
```

---

## 11. CSS TOKEN LAYER

Full `globals.css` additions on top of your existing file:

```css
/* ============================
   GRAFFICO DESIGN TOKENS
   ============================ */

/* Brand colors */
:root {
  --color-tomato-jam:    #c0392b;
  --color-almond-cream:  #e7d7c1;
  --color-metallic-gold: #d4af37;
  --color-ink-black:     #101011;
  --color-seppia-black:  #040f0f;
}

/* Body defaults */
body {
  background-color: var(--color-ink-black);
  color: var(--color-almond-cream);
  font-family: var(--font-work-sans, 'Work Sans', system-ui, sans-serif);
  -webkit-font-smoothing: antialiased;
}

/* Selection */
::selection {
  background-color: var(--color-tomato-jam);
  color: #ffffff;
}

/* ============================
   TYPOGRAPHY CLASSES
   ============================ */
.font-shrikhand { font-family: var(--font-shrikhand); font-weight: 400; font-style: normal; }
.font-fraktion  { font-family: var(--font-fraktion); }
.font-editorial { font-family: var(--font-editorial); }

/* ============================
   KEYFRAME ANIMATIONS
   ============================ */
@keyframes emoji-bounce {
  0%, 100% { transform: translateY(0) rotate(var(--rotation, 0deg)); }
  50%       { transform: translateY(-10px) rotate(var(--rotation, 0deg)); }
}

@keyframes arrow-bounce {
  0%, 100% { transform: translate(0); }
  50%       { transform: translate(4px); }
}

@keyframes scroll-dot {
  0%   { opacity: 0; transform: translate(-50%, 0.5rem); }
  20%  { opacity: 1; }
  80%  { opacity: 1; }
  100% { opacity: 0; transform: translate(-50%, 2rem); }
}

@keyframes swipe-up {
  0%   { opacity: 0; transform: translate(-50%, 1.5rem); }
  20%  { opacity: 1; transform: translate(-50%, 1.2rem); }
  80%  { opacity: 1; transform: translate(-50%, -1.2rem); }
  100% { opacity: 0; transform: translate(-50%, -1.5rem); }
}

/* ============================
   3D SCROLL ANIMATION
   ============================ */
.js-work {
  transform:
    rotateY(calc(var(--progress, 0) * -20deg))
    translate3d(
      calc(var(--progress, 0) * (50vw + 100%) - 50%),
      calc(var(--y, 0) * 50% - 50%),
      calc(var(--progress, 0) * var(--progress, 0) * -5rem)
    )
    scale(var(--size, 0.85))
    translateZ(0);
  backface-visibility: hidden;
  will-change: transform;
  transform-style: preserve-3d;
  isolation: isolate;
}

@media (max-width: 767px) {
  .js-work {
    transform:
      rotateY(calc(var(--progress, 0) * -20deg))
      translate3d(
        calc(var(--progress, 0) * (50vw + 100%) - 50%),
        calc(var(--y, 0) * 100% - 50%),
        calc(var(--progress, 0) * var(--progress, 0) * -5rem)
      )
      translateZ(0);
  }
}

.js-work-word {
  transform: translate3d(calc(var(--progress, 0) * (80vw + 150%) - 50%), 0, 0);
  will-change: transform;
}

/* ============================
   LETTER SCENE ANIMATION
   ============================ */
.s__scene__letter {
  --head:  calc((var(--progress, 0) - 0.5) * -2);
  --ahead: calc(var(--head) * var(--head));
  transform:
    rotateY(calc(var(--head) * -10deg * var(--state, 1)))
    translate3d(
      calc(var(--head) * 50vw * var(--state, 1)),
      calc(var(--iy, 0) * 50% * var(--ahead) * var(--state, 1)),
      0
    );
}

/* ============================
   GLASS / NOISE CARD
   ============================ */
.glass-card-dark {
  background: linear-gradient(135deg, rgba(16, 16, 17, 0.9), rgba(16, 16, 17, 0.7));
  border: 1px solid rgba(231, 215, 193, 0.1);
  border-radius: 1.5rem; /* 24px = rounded-3xl */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* ============================
   PERSPECTIVE UTILITIES
   ============================ */
.perspective-40rem { perspective: 40rem; }
.transform-style-3d { transform-style: preserve-3d; }

/* ============================
   ACCORDION (CSS grid technique)
   ============================ */
.accordion-body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.accordion-body.open {
  grid-template-rows: 1fr;
}
.accordion-inner {
  min-height: 0;
  overflow: hidden;
}

/* ============================
   REDUCED MOTION
   ============================ */
@media (prefers-reduced-motion: reduce) {
  .js-work,
  .s__scene__letter {
    transition: none !important;
    transform: none !important;
    opacity: 1 !important;
    visibility: visible !important;
  }
}
```

---

## 12. IMPLEMENTATION CHECKLIST

### Phase 1 — Tokens (zero risk)
- [ ] Add brand color tokens to `globals.css` (@theme block)
- [ ] Load Shrikhand + Work Sans via `next/font/google`
- [ ] Add font CSS classes (`.font-shrikhand`, `.font-sans`, `.font-fraktion`)
- [ ] Set `::selection` colors
- [ ] Set `body` background + text defaults
- [ ] Add all 4 custom `@keyframes`
- [ ] Set meta `theme-color` in layout

### Phase 2 — Static UI Components
- [ ] Replace existing buttons with tomato-jam / almond-cream variants
- [ ] Replace card styles with `rounded-3xl`, dark glass pattern
- [ ] Add noise texture overlay div to CTA sections
- [ ] Replace tag/badge styles with pill variants
- [ ] Add decorative blob layers (absolute, blurred, pulsing) to hero sections
- [ ] Apply `selection:bg-tomato-jam selection:text-white` to `<body>`

### Phase 3 — Layout
- [ ] Implement 12-column grid on section layouts
- [ ] Apply `rounded-3xl` universally to cards, images, modals
- [ ] Normalize section padding to `py-24 md:py-32 lg:py-40`
- [ ] Fix container widths (`max-w-4xl` content, `max-w-7xl` wide)

### Phase 4 — Micro-interactions
- [ ] Add `hover:scale-105 active:scale-95 transition-all duration-300` to all buttons
- [ ] Add `hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]` to cards
- [ ] Implement `group-hover:` child animations on nav/card icons
- [ ] Add `animate-arrow-bounce` to directional arrow icons
- [ ] Add scroll indicators (`animate-scroll-dot` or `animate-swipe-up`)

### Phase 5 — GSAP Integration
- [ ] Install GSAP: `npm i gsap`
- [ ] Create `src/lib/gsap.ts` with plugin registration
- [ ] Implement `useScrollProgress()` hook for parallax
- [ ] Add GSAP scroll-triggered reveal to page sections (stagger)
- [ ] Implement 3D project carousel (`.js-work` + GSAP scrub)
- [ ] Implement navbar hide/show on scroll direction

### Phase 6 — Polish
- [ ] Add `@media (hover: hover)` wrapper to prevent sticky mobile states
- [ ] Add `@media (prefers-reduced-motion: reduce)` overrides
- [ ] Self-host noise SVG texture in `/public/noise.svg`
- [ ] Test 3D transforms at 987px and 767px breakpoints
- [ ] Verify `perspective-40rem` + `transform-style-3d` containers work in Safari

---

## DESIGN SIGNATURE SUMMARY

| Trait | Value |
|---|---|
| Theme | Dark-first, no toggle |
| Primary bg | `#101011` (ink-black) |
| Primary text | `#e7d7c1` (almond-cream) |
| Accent | `#c0392b` (tomato-jam red) |
| Secondary accent | `#d4af37` (metallic-gold) |
| Display font | Shrikhand 400 only |
| Body font | Work Sans variable (100–900) |
| Primary radius | 24px (`rounded-3xl`) everywhere |
| Signature animation | GSAP 3D scroll carousel with rotateY + translate3d |
| Texture | Noise SVG at 3–20% opacity |
| Parallax | CSS `--scroll-progress` var at -5% and -15% rates |
| Hover pattern | scale-105, -translate-y-2, group-hover children |
| Press feedback | active:scale-95 |
| Color space | `color-mix(in oklab, ...)` for opacity variants |
| Motion library | GSAP 3.14.2 + ScrollTrigger |
| Grid | 12-column, responsive col-span |
| Container | `max-w-4xl` content / `max-w-7xl` wide |

---
---

# UX ARCHITECTURE DOCUMENT
## Phenomenon Studio — phenomenonstudio.com
### Full Layout, Navigation & Interaction Analysis

---

## 1. NAVIGATION SYSTEM

### 1.1 Structure

```
[Logo]  Services ▾  Industries ▾  Cases  Company ▾  Insights  Contacts   [Get in touch →]
```

Six primary links + one persistent CTA button anchored to the right.
The CTA (`Get in touch`) is visually isolated from the navigation links — it reads as a button, not a nav item.

### 1.2 Dropdown Menu Grouping

**Services** (mega-menu, 6 items — two semantic clusters):
```
WHAT WE DO        HOW WE DO IT
─────────────     ─────────────
Design            Validate
Development       Build
Research          Scale
```
The "WHAT" cluster is deliverable-named. The "HOW" cluster is phase-named (startup lifecycle language).
This is intentional — it matches their target audience's mental model (founders talk in phases).

**Industries** (4 items):
`SaaS / Healthcare / Fintech / EdTech`
Tightly scoped. No "Other." Scarcity is persuasive — implies deep specialization, not generalism.

**Company** (2 items):
`About / Team`
Minimal. Signals confidence — they let the work speak.

### 1.3 Scroll Behavior

- Preloader fires first (progress bar, random loading quips, animated dots).
  Duration: 300ms minimum, scales with actual load time.
- After preloader: `body.loaded` class is applied; reveals begin.
- Navigation becomes sticky/fixed after preloader clears.
- `initScrollByCss()` drives reveal classes — elements receive `.visible` class when entering viewport.
- The nav likely transitions from transparent-over-hero to opaque on scroll (common pattern; consistent with dark hero).

### 1.4 Mobile Navigation Pattern

Classic hamburger → fullscreen overlay (inferred from structure).
The mega-dropdown depth (6 services + 4 industries) would collapse into an accordion on mobile.
The persistent CTA (`Get in touch`) would likely move into the mobile menu or remain fixed at bottom of screen.

---

## 2. LANDING PAGE SECTION ARCHITECTURE

### Full Section Order — Annotated

```
┌─────────────────────────────────────────────────────────┐
│  1. ANIMATED LOGO                                       │
│     Desktop only. 10-frame sequence, 24fps, 800ms pause │
│     PURPOSE: Brand signature moment before content      │
├─────────────────────────────────────────────────────────┤
│  2. HERO                                                │
│     "Product Design and Development Agency"             │
│     [Let's talk]  [View our cases]                      │
│     + Showreel trigger (on-demand video popup)          │
├─────────────────────────────────────────────────────────┤
│  3. ANCHOR STATEMENT                                    │
│     "From product strategy to market leadership"        │
├─────────────────────────────────────────────────────────┤
│  4. STATS STRIP                                         │
│     98% / 35%+ / 70+ / 500M+                           │
├─────────────────────────────────────────────────────────┤
│  5. CLIENT LOGO MARQUEE                                 │
│     Scrolling logo ticker                               │
├─────────────────────────────────────────────────────────┤
│  6. CLIENT WINS GRID                                    │
│     8 case cards (logo + metric + country + stage)      │
├─────────────────────────────────────────────────────────┤
│  7. PAIN POINT CARDS (3-column)                         │
│     "Extend My Team" / "Redesign My Product" /          │
│     "Launch My MVP"                                     │
├─────────────────────────────────────────────────────────┤
│  8. SERVICE TIERS (tabbed by funding stage)             │
│     Pre-seed / Seed / Series A+                         │
├─────────────────────────────────────────────────────────┤
│  9. FEATURED CASE STUDIES (carousel)                    │
│     3 projects + embedded client quote per case         │
├─────────────────────────────────────────────────────────┤
│  10. INDUSTRY EXPERTISE (4-column)                      │
│      SaaS / Healthcare / EdTech / FinTech               │
├─────────────────────────────────────────────────────────┤
│  11. TEAM GRID                                          │
│      6 photos + "70+ members" + "Learn more"            │
├─────────────────────────────────────────────────────────┤
│  12. WHY US (4 feature cards)                           │
│      Compliance / Trend-resistance / Dev-ready /        │
│      Global delivery                                    │
├─────────────────────────────────────────────────────────┤
│  13. TESTIMONIALS (carousel)                            │
│      5 reviews + Clutch 5.0 + DesignRush 4.9            │
├─────────────────────────────────────────────────────────┤
│  14. AWARDS STRIP                                       │
│      Clutch / Dribbble / Webflow / UXDA / Awwwards      │
├─────────────────────────────────────────────────────────┤
│  15. CONTACT FORM                                       │
│      Name / Email / Message / Budget / Files            │
├─────────────────────────────────────────────────────────┤
│  16. TEAM CONTACT CARDS                                 │
│      2 named contacts with LinkedIn + email             │
├─────────────────────────────────────────────────────────┤
│  17. FOOTER                                             │
│      5 offices / 20+ service links / certifications     │
└─────────────────────────────────────────────────────────┘
```

---

### 2.1 Psychological Purpose of Each Section

**Section 1 — Animated Logo**
_Micro-delight / brand fingerprinting._
Plays before any content appears. Forces a moment of stillness. Not a preloader — it is designed to be watched. Creates memory. "They cared enough to animate their logo."

**Section 2 — Hero**
_Claim / orientation / momentum._
Short declarative headline ("Product Design and Development Agency") answers "what is this?" in under 2 seconds. Dual CTA splits intent: `Let's talk` (warm lead, now) vs `View our cases` (researcher, later). Showreel popup answers "but can they actually design?" without loading a video nobody asked for. This is respectful pacing.

**Section 3 — Anchor Statement**
_Aspiration / promise._
"From product strategy to market leadership" is the transformation statement. It reframes the company from vendor to partner. Placed directly below the hero before any proof — sets the emotional contract before validating it.

**Section 4 — Stats Strip**
_Credibility shock / pattern interrupt._
Numbers are the fastest credibility signal. `500M+ investments raised by clients` is an unusual stat — it reframes their value from "design work done" to "business outcomes enabled." Psychologically: proof before doubt can form.

**Section 5 — Client Logo Marquee**
_Social proof via recognition._
Logos are scanned, not read. The marquee keeps them moving — creating the impression of a larger, more continuous client list than a static grid. Motion also draws the eye downward.

**Section 6 — Client Wins Grid**
_Specificity = trust._
Eight cards with: company name, industry, country, funding amount or metric. This specificity is deliberate. Anyone can say "we work with startups." Showing `Nomupay / Fintech / Ireland / €35.9M` signals deep, verifiable experience. Geography diversity (USA, UK, South Africa, Ireland) signals global capability.

**Section 7 — Pain Point Cards (Self-Selection)**
_Job-to-be-done framing._
Labels read: "Extend My Team" / "Redesign My Product" / "Launch My MVP."
Written in first person as the visitor, not as the agency's service offering.
This is a deliberate UX pattern — the visitor self-selects their problem. Triggers self-identification ("that's me"), which increases conversion intent. Each card links to a specific CTA.

**Section 8 — Service Tiers by Funding Stage**
_Market-fit mapping._
Organizing services by Pre-seed / Seed / Series A is exceptional positioning. It means Phenomenon has mapped their services to the exact vocabulary and mental model of their buyers (startup founders). It also signals a long-term relationship intent — "we grow with you." The tabbed UI keeps this dense content skimmable.

**Section 9 — Featured Case Studies (Carousel)**
_Proof depth._
Three hero-level cases with metrics (40% engagement, 35% conversion, 2x faster workflows) and embedded client quotes. The carousel format implies more exists — creates a "tip of the iceberg" feeling. Metrics are outcome-based, not deliverable-based.

**Section 10 — Industry Expertise**
_Objection handling._
Four industries, each showing challenges AND solutions. This section answers "but do you understand my industry?" before the visitor can ask it. Showing challenges they understand is more persuasive than listing what they offer.

**Section 11 — Team Grid**
_Human signal._
Faces humanize the agency. "70+" is the proof of scale (not a boutique that might disappear). Global presence (Canada, USA, Ukraine, Poland, Estonia, Switzerland) signals timezone coverage and talent diversity.

**Section 12 — Why Us (Feature Cards)**
_Differentiation / objection pre-handling._
Four cards covering: regulatory compliance (HIPAA/GDPR), trend-resistance, developer-ready output, and local+global delivery. These directly address the top objections of B2B SaaS/healthcare founders who need production-ready, compliant design.

**Section 13 — Testimonials**
_Third-party validation._
Clutch 5.0 + DesignRush 4.9 + five named reviews with headshots. Headshots matter — they convert "testimonial" from text into human witness.

**Section 14 — Awards Strip**
_Authority / prestige signals._
Awards placed AFTER testimonials — correct ordering. Client reviews are more trustworthy than industry badges. Awwwards Site of the Day signals design excellence to design-literate buyers.

**Section 15 — Contact Form**
_Conversion._
Budget selector (5 tiers from <$10k to >$100k) serves dual purpose: qualifies leads AND lets visitors self-select their tier without shame. File upload enables brief/RFP sharing. reCAPTCHA v3 is invisible (no friction).

**Section 16 — Team Contact Cards**
_Trust / approachability._
Two named humans (Account Executive + Co-Founder) with LinkedIn links and direct email. For the visitor who hesitates to submit, seeing a real named person to email removes the last barrier. The co-founder's presence signals this is not a black-box agency.

**Section 17 — Footer**
_Navigation redundancy / trust foundation._
20+ service links, 5 office addresses, HIPAA + GDPR + NN/g certs, social channels. Footers are for the visitor who scrolled all the way down and is still evaluating. Dense information here signals legitimacy and breadth.

---

## 3. SECTION PATTERNS

### 3.1 Hero Composition

```
[TYPOGRAPHY-DOMINANT HERO]

Headline:    Large declarative sentence — "Product Design and Development Agency"
Subhead:     One line — outcome statement
Body:        1-2 sentences, transformation framing
CTAs:        Primary filled [Let's talk] / Secondary outlined [View our cases]
Modifier:    On-demand showreel trigger — does NOT autoplay
```

No hero image. No background video. The typography IS the design statement.
Confidence in type = confidence in craft.

### 3.2 Stats Strip Pattern

```
[ 98%          ] [ 35%+         ] [ 70+          ] [ 500M+        ]
  Satisfaction     Conversions     Team members    Investments
```
4-column horizontal. Each stat is one large number + one short label.
Zero decoration. Numbers speak. Likely on dark bg to contrast surrounding sections.

### 3.3 Client Case Cards

```
┌──────────────────────────────────┐
│  [Logo]                          │
│  Company name                    │
│  Industry tag + Country flag     │
│  1-line description              │
│  [Metric / Funding raised]       │
└──────────────────────────────────┘
```
Grid: 4 cards × 2 rows = 8 visible.
Cards are minimal — no CTA per card. It is a proof wall, not a navigation element.

### 3.4 Pain Point Cards (Self-Selection — 3 column)

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Icon        │  │  Icon        │  │  Icon        │
│  Extend My   │  │  Redesign My │  │  Launch My   │
│  Team        │  │  Product     │  │  MVP         │
│              │  │              │  │              │
│  [CTA →]     │  │  [CTA →]     │  │  [CTA →]     │
└──────────────┘  └──────────────┘  └──────────────┘
```
First-person label pattern is the critical insight — visitor-centric language.

### 3.5 Service Tiers (Tabbed)

```
[ Pre-seed ]  [ Seed ]  [ Series A & beyond ]
─────────────────────────────────────────────
 Service 1    Service 2    Service 3
 [Explore →]  [Explore →]  [Explore →]
```
Tab navigation tied to startup lifecycle. 3 services per tab.
Progressive disclosure — hides complexity behind tabs.

### 3.6 Featured Case Carousel

```
← ─────────────────────────────────── →
│ [Case Image / Visual]               │
│ Client name + Industry + Duration   │
│ Key metric (e.g., +35% conversion)  │
│ "Quote from client…"                │
│ [View case study →]                 │
─────────────────────────────────────
    ● ○ ○  (3 dots / pagination)
```
Quote embedded per case — blends proof types. You see the work AND hear the client simultaneously.

### 3.7 Industry Cards (4-column)

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  SaaS    │  │ Health   │  │  EdTech  │  │  FinTech │
│Challenges│  │Challenges│  │Challenges│  │Challenges│
│• …       │  │• …       │  │• …       │  │• …       │
│Solutions │  │Solutions │  │Solutions │  │Solutions │
│• …       │  │• …       │  │• …       │  │• …       │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```
Problem → Solution structure per card. No CTAs here — this is educational positioning, not a sales push.

### 3.8 Testimonials

```
★★★★★  5.0 Clutch  /  ★★★★★  4.9 DesignRush

┌─────────────────────────────────────────────────┐
│ [Headshot]   Name, Title, Company               │
│ "Long testimonial quote spanning 2-3 lines…"    │
│ [Clutch badge / platform source]                │
└─────────────────────────────────────────────────┘
     ← ●  ○  ○  ○  ○  →
```
Platform scores anchored at top (above individual reviews). Macro proof before micro proof.

### 3.9 Contact Form

```
┌─────────────────────────────────────┐
│  Name ___________                   │
│  Email ___________                  │
│  Message ___________________________│
│  __________________________________ │
│  [Upload files — max 5, 5MB each]   │
│                                     │
│  Budget:                            │
│  ○ up to $10k  ○ $10-20k           │
│  ○ $20-50k     ○ $50-100k          │
│  ○ >$100k                           │
│                                     │
│  [Send Message]  ← reCAPTCHA v3    │
└─────────────────────────────────────┘

  [Photo] Kseniia Shalia        [Photo] Polina Chebanova
          Account Executive              Co-Founder & CPO
          LinkedIn | email               LinkedIn | email
```

---

## 4. INTERACTION MODEL

### 4.1 User Guidance Architecture — Layered Belief System

Each section builds credibility established by the one above. The visitor is never asked to commit before they believe.

```
AWARENESS        →  Hero ("we exist, here's what we do")
CREDIBILITY      →  Stats + Logos ("others trust us")
SPECIFICITY      →  Client wins ("here's the evidence, detailed")
SELF-SELECTION   →  Pain point cards ("which one are you?")
DEPTH            →  Services + Cases ("here's exactly how")
HUMANIZATION     →  Team + Why Us ("here's who you'd work with")
VALIDATION       →  Testimonials + Awards ("third parties agree")
CONVERSION       →  Contact form ("now let's talk")
REASSURANCE      →  Named contacts ("a real person awaits")
```

### 4.2 Attention Hierarchy

**Level 1 — Immediate (0–3s):**
Hero headline, stat numbers, logo marquee movement.
Designed to pass the "3-second test" — does this look legit?

**Level 2 — Engaged (3–30s):**
Client wins grid, pain point cards, service tabs.
Visitor is now reading — evaluating fit, not just glancing.

**Level 3 — Committed (30s+):**
Case studies, testimonials, industry cards.
Only interested leads reach here. Content gets more detailed because the visitor is already warm.

**Level 4 — Ready to Act:**
Contact form, named contacts.
Doubt has been systematically removed.

### 4.3 Reading Flow Pattern

**Modified F-pattern** within sections, **Z-pattern** for section transitions.

Within sections (stats strip, card grids):
→ Left-to-right scan across the top
→ Diagonal drop to next row
→ Left-to-right scan repeats

Between sections:
→ Full-width elements (stats strip, marquee, form) reset the eye to left edge
→ Creates a Z-path pulling users downward through the page

The 3-column pain point cards interrupt this flow — they force the visitor to choose a column, creating micro-engagement.

### 4.4 Conversion Architecture — 4 Entry Points Before the Form

The page has four embedded conversion opportunities before Section 15:

1. Hero: `Let's talk` → jumps to `#contact-form`
2. Hero: `View our cases` → navigates to `/projects/`
3. Pain point cards: `Extend / Redesign / Launch` → dedicated landing pages
4. Services tabs: `Explore →` per service

Funnel with multiple entry points — a visitor ready to buy at Section 2 doesn't need to scroll to Section 15. A researcher needs the full journey.

---

## 5. MOTION USAGE

### 5.1 Motion System Overview

Scroll-triggered reveal animations are the primary motion language.
No CSS animations play unless the element is in the viewport.

```
Elements start:   opacity: 0  (.isview:not(.visible))
On scroll-in:    .visible class added → opacity: 1 + transform reset
```

### 5.2 Preloader Sequence

```
Page load begins
    ↓
Progress bar fills (rotating loading messages — "Installing one more great idea…")
    ↓
300ms minimum hold (ensures preloader is seen on fast connections)
    ↓
body.loaded class applied
    ↓
Animated logo sequence fires (10 frames, 24fps, 800ms pause)
    ↓
Hero content reveals
    ↓
Page interaction begins
```

The 300ms minimum hold is intentional — prevents a flash on fast connections
that would make the preloader feel broken.

### 5.3 Animation Classes

| Class | Behavior |
|---|---|
| `.textslide` | Text reveals by sliding in (translateY + fade) |
| `.textslide.title` | Same behavior on headings — may use larger Y offset |
| `.slidetop` | Element slides up from below on viewport enter |
| `.isview:not(.visible)` | Hidden state; `.visible` is the scroll-triggered state |
| `.invisible_container` | Removed on load to prevent flash of unstyled content |

### 5.4 Marquee / Ticker

`initMarqueue()` drives a horizontal scrolling logo ticker.
Continuous loop. Direction: left-to-right.
Speed: smooth, ambient — not demanding of attention.

### 5.5 Stagger Logic

Card grids (client wins, industry cards, why-us cards) use staggered entrance —
cards animate in sequentially left-to-right with ~80–120ms delay per card.

Effect:
1. Draws the eye across the row
2. Makes the section feel dynamic, not static
3. Extends the viewer's time on that section

### 5.6 On-Demand Showreel (Video)

```
User clicks showreel trigger (.showreel-trigger)
    ↓
Overlay opens
    ↓
Plyr player initializes — muted by default
    ↓
Audio unmuted on CTA interaction
    ↓
Closing overlay: player pauses, overlay closes (.closer / .popup-close)
```

Key design decision: video does NOT autoplay in the background.
On-demand showreel is the premium version — "we have a reel, but we respect your attention."

### 5.7 Form Interactions

- Budget radio buttons: animated selection state (pill/chip highlight)
- File upload: drag-and-drop zone with visual feedback
- Submit success: secondary UI appears — CTA to book a call
- reCAPTCHA v3: fully invisible, zero user friction

---

## 6. KEY UX PRINCIPLES OBSERVED

**1. Specificity over claims.**
Every claim has a number. Every number has context. "35%+ conversion boost after redesign" beats "we improve conversions."

**2. First-person visitor language.**
"Launch My MVP" not "MVP Launch Services." Significant empathy signal — the copywriter thought from inside the visitor's head.

**3. Progressive disclosure.**
Tabs (service tiers), carousels (cases), accordions (mobile nav) — complexity is always hidden until requested.

**4. On-demand media.**
No autoplaying video. Showreel is pull, not push.

**5. Layered social proof (5 distinct types):**
Stats → logos → detailed case cards → featured cases with quotes → testimonials with platform scores → awards.
Each layer is a different proof type — they stack, not repeat.

**6. Named humans at the conversion point.**
The contact form is followed by two real people with photos, names, titles, and direct contact. Antidote to "submit and disappear into a ticket system" anxiety.

**7. Startup lifecycle vocabulary.**
Pre-seed / Seed / Series A frames the entire service architecture. This is audience-native language — signals domain fluency before a single word of marketing copy is read.

**8. Cert-forward footer.**
HIPAA + GDPR + NN/g certs in the footer target the procurement/compliance mindset that always checks a vendor's footer.

---

*Source: https://phenomenonstudio.com/*
*Analysis date: 2026-02-22*
