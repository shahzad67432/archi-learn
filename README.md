# Archi.learn — Master System Design Through Play

<p align="center">
  <img src="/hero-concept_02.svg" width="420" alt="Tree of Knowledge" />
</p>

Not another article. Not another video. Archi.learn is an interactive, gamified platform where you learn system design by moving through zones — **The Problem → How It Works → Hard Parts → Try It → Quiz** — one scroll-snap at a time. Earn XP, level up your mascot, and unlock harder concepts as you go.

## The Visual Language

Every scene is hand-crafted in isometric SVG with a warm orange and cream palette against near-black ink. The four **chapter SVGs** hidden throughout the concepts grid tell a silent story of growth:

<table>
  <tr>
    <td width="160" align="center"><img src="/hero-chapter_01.svg" width="140" alt="Seed" /></td>
    <td><strong>Seed</strong> — A tiny sprout pushes through soil underground. A watering can rests beside it, a measuring stick tracks its height, raindrops fall from a soft sun above, and a seed packet waits nearby.<br/><em>Curiosity — the beginning.</em></td>
  </tr>
  <tr>
    <td width="160" align="center"><img src="/hero-chapter_02.svg" width="140" alt="Root" /></td>
    <td><strong>Root</strong> — Roots spread deep below the platform. A small trunk rises with just a few leaf clusters. The foundation is being built.<br/><em>Understanding the fundamentals.</em></td>
  </tr>
  <tr>
    <td width="160" align="center"><img src="/hero-chapter_03.svg" width="140" alt="Branch" /></td>
    <td><strong>Branch</strong> — Multiple branches reach outward with flower buds forming. A dashed connector line runs between branches — the system design metaphor.<br/><em>Making connections.</em></td>
  </tr>
  <tr>
    <td width="160" align="center"><img src="/hero-chapter_04.svg" width="140" alt="Bloom" /></td>
    <td><strong>Bloom</strong> — A full canopy of leaves, flowers, fruit, a butterfly, sparkles, and a dashed network across every branch.<br/><em>Mastery — everything connects.</em></td>
  </tr>
</table>

## Meet Archi

Archi is the orange mascot that travels with you through every scene — pointing at a sprout in chapter one, reading a book by the roots in chapter two, reaching up to connect branches in chapter three, and celebrating with raised arms under the full bloom in chapter four. As you earn XP, Archi grows with you.

## How It Works

1. **Browse the grid** — concept cards show title, tags, difficulty, and XP reward
2. **Pick a topic** — click any published concept to enter its learning page
3. **Scroll through 5 zones** — each is a full-screen snap section:
   - **Zone 0 — The Problem**: A side-by-side comparison of the old way vs the right way (HTTP polling vs WebSockets, with live SVG diagrams)
   - **Zone 1 — How It Works**: The mechanics, broken down visually
   - **Zone 2 — Hard Parts**: The edge cases and gotchas
   - **Zone 3 — Try It**: Interactive sandbox
   - **Zone 4 — Quiz**: Test what you learned
4. **Earn XP** — complete zones, ace quizzes, level up

<p align="center">
  <img src="/hero-design.png" width="700" alt="Archi.learn concepts grid" style="border-radius: 12px;" />
</p>

## Tech Stack

- **Next.js 16** with App Router and Turbopack
- **TypeScript** — strict mode, full type safety
- **Framer Motion** — staggered entrances, animated SVG paths, micro-interactions
- **Tailwind CSS v4** — utility-first, custom theme tokens
- **Zustand** — XP store with localStorage persistence
- **SVG** — all illustrations and diagrams are inline SVG, no external image dependencies

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start learning.
