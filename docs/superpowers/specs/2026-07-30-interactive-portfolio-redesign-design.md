# Interactive Portfolio Redesign

## Goal

Elevate the existing single-page portfolio (React + Vite + Tailwind + Framer Motion) from a mostly-static editorial layout into a genuinely interactive, distinctive experience — explicitly avoiding common "AI-portfolio" tells (glossy chrome 3D orbs, stock Lottie animation, generic scroll-reveal-only motion). The existing warm cream/near-black editorial visual system (custom cursor, magnetic buttons, hairlines, marquee, big display type) is kept and reinforced, not replaced.

## Scope

Six additions to `src/App.tsx` and its supporting components. No routing library is introduced — the site stays a single scrollable page with anchor navigation, consistent with current structure.

New dependencies: `three`, `@react-three/fiber`, `@react-three/drei` (hero 3D accent only). No other new dependencies — metrics count-up and command palette are built on what's already installed (`framer-motion`, React state).

### 1. Hero 3D accent

Replace the flat blurred `<div>` currently used as "Abstract Glow" in the hero section with a monochrome, noise-distorted wireframe icosphere rendered via `@react-three/fiber` + `@react-three/drei`'s `MeshDistortMaterial`.

- Positioned as a background layer behind the hero text (not a focal "look at my 3D" object)
- Single color derived from the existing palette (`#1A1A1A`), low opacity, no PBR/glossy material, no rainbow gradient
- Subtly tilts/rotates toward the cursor position (parallax via pointer tracking, not full OrbitControls)
- Respects `prefers-reduced-motion`: renders a static frame (no rotation) when set
- Lives in a new `src/components/HeroMesh.tsx`, lazy-loaded (`React.lazy`) so the ~600kb three.js payload doesn't block initial page render

### 2. Metrics section

New section between Hero and About (`id="metrics"`, added to `navItems`? — no, kept out of nav to avoid overloading the 5-item nav; reachable by scroll only, matches how "Marquee Banner" already has no nav entry).

Four stat cards in a bento-style grid, each counting up from 0 when scrolled into view:

| Value | Label |
|---|---|
| Rp30jt+ | Nilai proyek yang dipimpin |
| 3 | Developer dipimpin |
| 150+ | Bug diperbaiki |
| 24 | Anggota divisi dipimpin |

- Count-up driven by `framer-motion`'s `useMotionValue` + `animate()` + `useInView` (already-installed lib, no new dependency)
- Numbers rendered with `font-mono tabular-nums` for stable width during animation
- Entrance stagger 30–50ms per card, spring easing (consistent with `ui-ux-pro-max` motion guidance)

### 3. Project case-study expand

`types.ts` `Project` interface gains optional fields:

```ts
export interface Project {
  title: string;
  date: string;
  image: string;
  description: string;
  role?: string;
  techStack?: string[];
  highlights?: string[];
}
```

Clicking a project card expands it in place (Framer Motion shared `layoutId` transition, not a modal or route) to reveal `role`, `techStack` as small badges, and `highlights` as a short list. Collapsing works the same way (click again / close affordance). Only one project expanded at a time.

Content for the four existing projects (Ayub Podo Rukun, HDB AC Shop, Blitaris Tekno, Naivara) is filled in from the CV data already used to populate the array.

### 4. Cursor & hover interactivity

Extend `src/components/CustomCursor.tsx` (currently a plain dot/ring follower) with contextual state:

- Default: existing dot/ring behavior, unchanged
- Hovering a project card: cursor enlarges and shows a small "View" label
- Hovering a project card: a small floating image preview (the project's own image) follows the cursor with slight lag/spring — studio-website pattern
- `Magnetic.tsx` is reused as-is for nav items and contact links; no changes needed there

### 5. Command palette (Cmd+K)

New `src/components/CommandPalette.tsx`, custom-built (no `cmdk` dependency — scope is ~10 static items, doesn't justify a library):

- Opens on `Cmd+K` / `Ctrl+K`, and via a small trigger hint in the nav
- Lists: 5 section nav items + 4 social/contact links (email, WhatsApp, LinkedIn, GitHub)
- Plain substring filter on typed input (no fuzzy-match library)
- Full keyboard support: `↑`/`↓` to move selection, `Enter` to activate, `Esc` to close
- Selecting a nav item calls the existing `scrollTo()`; selecting a contact item opens the link the same way the existing contact section links do

### 6. Motion polish

- All new animations (count-up, card expand, cursor states, palette open/close) respect `prefers-reduced-motion` — reduced to instant/near-instant state changes when set
- Motion durations/easing stay within the 150–300ms micro-interaction range already established by existing `fadeUp`/`textReveal` variants; nothing new introduces a slower or wildly different rhythm

## Out of scope

- Dark mode / theme toggle (not requested; current warm palette is the established identity)
- Any routing library or multi-page navigation
- GIF/Lottie decorative animation (explicitly rejected as an AI-slop marker)
- Backend/CMS for project content — content stays hardcoded in `App.tsx` arrays as it is today

## Testing

Manual verification via dev server + browser (Chrome automation) covering: hero 3D renders and tilts with mouse, metrics count up on scroll, project expand/collapse works and only one is open at a time, cursor states change appropriately over project cards vs elsewhere, command palette opens/closes/filters/navigates via keyboard, and a `prefers-reduced-motion` pass confirms animations degrade gracefully. No automated test suite exists in this project (`npm run lint` = `tsc --noEmit` is the only current check) — that remains the baseline check, run after implementation.
