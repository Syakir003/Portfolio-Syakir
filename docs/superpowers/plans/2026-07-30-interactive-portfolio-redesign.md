# Interactive Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add six interactive/visual upgrades (3D hero accent, count-up metrics, expandable project case studies, contextual cursor preview, command palette, motion polish) to the existing single-page React portfolio without introducing a router or restyling the established cream/near-black editorial identity.

**Architecture:** Six additive changes layered onto the existing `src/App.tsx` single-page structure. Each new piece of UI is its own component file consumed by `App.tsx`; `App.tsx` keeps owning page-level state (which project is expanded) and data arrays, matching its existing pattern. A shared `useReducedMotion` hook (built first) is consumed by every new animated component.

**Tech Stack:** React 18 + TypeScript + Vite + Tailwind v4 + Framer Motion (all already installed). New dependencies added only for the hero 3D accent: `three`, `@react-three/fiber`, `@react-three/drei`.

## Global Constraints

- No routing library is introduced. The site stays a single scrollable page with anchor navigation (`scrollTo(id)`), per the spec.
- No new dependencies beyond `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three` (hero 3D accent only). Metrics count-up and the command palette are built on `framer-motion` and React state, already installed.
- Every new animated component must respect `prefers-reduced-motion` via the shared `src/hooks/useReducedMotion.ts` hook — reduce to `duration: 0` / static state, never fully remove the feature.
- Keep the existing palette (`#F5F2ED` background, `#1A1A1A` foreground) and existing motion rhythm (150–300ms micro-interactions, spring/ease-out easing). No dark mode, no new colors.
- Icons: reuse `lucide-react` (already installed). No new icon library.
- This project has no automated test suite — `npm run lint` (= `tsc --noEmit`) is the only existing check. Per the spec's Testing section, each task's acceptance check is `tsc --noEmit` passing plus a manual browser verification against the running dev server (`npm run dev`). Do not add a test framework (Vitest/Jest) — out of scope per the spec.
- Spec reference: `docs/superpowers/specs/2026-07-30-interactive-portfolio-redesign-design.md`.

---

### Task 1: 3D dependencies + shared reduced-motion hook

**Files:**
- Modify: `package.json` (via `npm install`, not hand-edited)
- Create: `src/hooks/useReducedMotion.ts`

**Interfaces:**
- Produces: `useReducedMotion(): boolean` (default export), a hook that returns `true` when the OS/browser has `prefers-reduced-motion: reduce` set, and stays in sync if the user changes the setting live.
- Produces: `three`, `@react-three/fiber`, `@react-three/drei` as runtime dependencies, `@types/three` as a dev dependency, available to later tasks.

- [ ] **Step 1: Install the 3D dependencies**

Run:
```bash
npm install three @react-three/fiber@^8 @react-three/drei@^9
npm install -D @types/three
```
Expected: `package.json` gains `three`, `@react-three/fiber`, `@react-three/drei` under `dependencies` and `@types/three` under `devDependencies`. Command exits 0.

- [ ] **Step 2: Create the reduced-motion hook**

Create `src/hooks/useReducedMotion.ts`:

```ts
import { useEffect, useState } from 'react';

export default function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return reduced;
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/hooks/useReducedMotion.ts
git commit -m "feat: add 3D deps and shared reduced-motion hook"
```

---

### Task 2: Hero 3D accent

**Files:**
- Create: `src/components/HeroMesh.tsx`
- Modify: `src/App.tsx` (imports, hero section's "Abstract Glow" block)

**Interfaces:**
- Consumes: `useReducedMotion` from Task 1 (`src/hooks/useReducedMotion.ts`).
- Produces: `HeroMesh` default export, a prop-less React component rendering a full-bleed `<canvas>` inside a positioned `<div>`.

- [ ] **Step 1: Create the hero mesh component**

Create `src/components/HeroMesh.tsx`:

```tsx
import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Icosahedron } from '@react-three/drei';
import type { Mesh } from 'three';
import useReducedMotion from '../hooks/useReducedMotion';

function DistortedMesh() {
  const meshRef = useRef<Mesh>(null);
  const reducedMotion = useReducedMotion();
  const { viewport } = useThree();

  useFrame((state) => {
    if (!meshRef.current || reducedMotion) return;
    meshRef.current.rotation.y += 0.0015;
    meshRef.current.rotation.x += 0.0008;
    const targetX = (state.pointer.x * viewport.width) / 40;
    const targetY = (state.pointer.y * viewport.height) / 40;
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.02;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.02;
  });

  return (
    <Icosahedron ref={meshRef} args={[1.6, 4]}>
      <MeshDistortMaterial
        color="#1A1A1A"
        wireframe
        transparent
        opacity={0.12}
        distort={0.35}
        speed={reducedMotion ? 0 : 1.5}
      />
    </Icosahedron>
  );
}

export default function HeroMesh() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] -z-10 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true }}>
        <ambientLight intensity={1} />
        <DistortedMesh />
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 2: Wire it into the hero section, lazy-loaded**

In `src/App.tsx`, change the React import to add `lazy` and `Suspense`:

Find:
```tsx
import React, { useState, useEffect } from 'react';
```

Replace with:
```tsx
import React, { useState, useEffect, lazy, Suspense } from 'react';
```

Add the lazy import right after the existing `Magnetic` import:

Find:
```tsx
import CustomCursor from './components/CustomCursor';
import Magnetic from './components/Magnetic';
```

Replace with:
```tsx
import CustomCursor from './components/CustomCursor';
import Magnetic from './components/Magnetic';

const HeroMesh = lazy(() => import('./components/HeroMesh'));
```

Then replace the static glow div with the lazy 3D mesh, keeping the same div as the `Suspense` fallback so there's no blank flash while the chunk loads:

Find:
```tsx
          {/* Abstract Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-[#1A1A1A]/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
```

Replace with:
```tsx
          {/* Abstract Glow / 3D accent */}
          <Suspense fallback={<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[40vw] md:h-[40vw] bg-[#1A1A1A]/5 rounded-full blur-[100px] -z-10 pointer-events-none" />}>
            <HeroMesh />
          </Suspense>
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Step 4: Manual verification**

Run: `npm run dev`, open the printed local URL in a browser.
Expected:
- A faint dark wireframe sphere is visible behind the hero name text, replacing the old flat blur circle.
- Moving the mouse over the hero makes the sphere drift slightly toward the cursor.
- In OS/browser settings, enabling "reduce motion" and reloading the page: the sphere is still visible but stops rotating/drifting.

- [ ] **Step 5: Commit**

```bash
git add src/components/HeroMesh.tsx src/App.tsx
git commit -m "feat: replace hero glow with subtle 3D wireframe accent"
```

---

### Task 3: Metrics section

**Files:**
- Create: `src/components/MetricsSection.tsx`
- Modify: `src/App.tsx` (import, insert section between marquee and About)

**Interfaces:**
- Consumes: `useReducedMotion` from Task 1.
- Produces: `MetricsSection` default export, a prop-less React component rendering `<section id="metrics">`.

- [ ] **Step 1: Create the metrics section**

Create `src/components/MetricsSection.tsx`:

```tsx
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import useReducedMotion from '../hooks/useReducedMotion';

interface Metric {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

const metrics: Metric[] = [
  { prefix: 'Rp', value: 30, suffix: 'jt+', label: 'Nilai proyek yang dipimpin' },
  { value: 3, label: 'Developer dipimpin' },
  { value: 150, suffix: '+', label: 'Bug diperbaiki' },
  { value: 24, label: 'Anggota divisi dipimpin' },
];

function StatCounter({ metric, delay, reducedMotion }: { metric: Metric; delay: number; reducedMotion: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => setDisplay(v));
    return unsubscribe;
  }, [rounded]);

  useEffect(() => {
    if (!inView) return;
    if (reducedMotion) {
      count.set(metric.value);
      return;
    }
    const controls = animate(count, metric.value, { duration: 1.4, delay, ease: 'easeOut' });
    return () => controls.stop();
  }, [inView, reducedMotion, metric.value, delay, count]);

  return (
    <span ref={ref}>
      {metric.prefix}{display}{metric.suffix}
    </span>
  );
}

export default function MetricsSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="metrics" className="py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="hairline mb-16" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: reducedMotion ? 0 : 0.6, delay: reducedMotion ? 0 : index * 0.08, ease: 'easeOut' }}
              className="flex flex-col gap-2"
            >
              <div className="font-mono tabular-nums text-4xl md:text-6xl font-medium tracking-tight">
                <StatCounter metric={metric} delay={index * 0.08} reducedMotion={reducedMotion} />
              </div>
              <p className="text-sm md:text-base text-[#1A1A1A]/50 font-light uppercase tracking-[0.15em]">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Insert the section into the page**

In `src/App.tsx`, add the import next to the `Magnetic`/`HeroMesh` imports:

Find:
```tsx
const HeroMesh = lazy(() => import('./components/HeroMesh'));
```

Replace with:
```tsx
const HeroMesh = lazy(() => import('./components/HeroMesh'));
import MetricsSection from './components/MetricsSection';
```

Insert the section right after the marquee banner, before the About section:

Find:
```tsx
        {/* About Section */}
        <section id="about" className="py-24 px-6 md:px-12">
```

Replace with:
```tsx
        <MetricsSection />

        {/* About Section */}
        <section id="about" className="py-24 px-6 md:px-12">
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Step 4: Manual verification**

Run: `npm run dev`, scroll to the section between the marquee and "Biography".
Expected: four numbers animate from 0 up to `Rp30jt+`, `3`, `150+`, `24` as the section enters the viewport, using tabular monospace digits (no layout jitter while counting). Scrolling back up and down again does not re-trigger the count (it only counts up once).

- [ ] **Step 5: Commit**

```bash
git add src/components/MetricsSection.tsx src/App.tsx
git commit -m "feat: add animated metrics section"
```

---

### Task 4: Extend Project type + case-study data

**Files:**
- Modify: `src/types.ts`
- Modify: `src/App.tsx` (the `projects` array only)

**Interfaces:**
- Produces: `Project` interface with new optional fields `role?: string`, `techStack?: string[]`, `highlights?: string[]`, consumed by Task 5's `ProjectCard`.

- [ ] **Step 1: Extend the Project interface**

In `src/types.ts`, find:
```ts
export interface Project {
  title: string;
  date: string;
  image: string;
  description: string;
}
```

Replace with:
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

- [ ] **Step 2: Fill in case-study data for all four projects**

In `src/App.tsx`, find the full `projects` array:
```tsx
  const projects: Project[] = [
    {
      title: "CV Ayub Podo Rukun — E-POS System",
      date: "2026 - Sedang Berjalan",
      image: "https://picsum.photos/seed/ayubpodorukun/800/600",
      description: "Sebagai Project Lead, memimpin tim 3 developer merancang dan membangun 3 produk digital terintegrasi (company profile, E-POS web, E-POS mobile) untuk bisnis HVAC klien senilai 30 juta, mulai dari arsitektur sistem hingga deployment menggunakan Laravel, Next.js/React, dan MySQL."
    },
    {
      title: "HDB AC Shop — E-Commerce & Service Platform",
      date: "2025",
      image: "/images/Hdb.png",
      description: "Membangun platform full-stack e-commerce dan manajemen servis AC menggunakan React, TypeScript, dan Node.js/Express, lengkap dengan autentikasi JWT multi-role dan integrasi payment gateway Midtrans (QRIS, transfer bank, e-wallet)."
    },
    {
      title: "CV Blitaris Tekno — Stabilisasi Aplikasi Produksi",
      date: "1 Juli 2026 - 21 Agustus 2026",
      image: "https://picsum.photos/seed/blitaristekno/800/600",
      description: "Mewarisi aplikasi web produksi (Laravel & Vue.js) yang sebelumnya tidak stabil, lalu melakukan debugging dan refactoring menyeluruh, memperbaiki 150+ bug yang berdampak pada stabilitas sistem hingga siap dipakai lagi."
    },
    {
      title: "Katalog Rental Mobil Naivara Group",
      date: "2025",
      image: "/images/Naivara.png",
      description: "Membangun frontend katalog rental mobil menggunakan Laravel Blade, menampilkan 20 unit kendaraan secara responsif dengan integrasi data dinamis dari backend untuk update real-time tanpa reload manual."
    }
  ];
```

Replace with:
```tsx
  const projects: Project[] = [
    {
      title: "CV Ayub Podo Rukun — E-POS System",
      date: "2026 - Sedang Berjalan",
      image: "https://picsum.photos/seed/ayubpodorukun/800/600",
      description: "Sebagai Project Lead, memimpin tim 3 developer merancang dan membangun 3 produk digital terintegrasi (company profile, E-POS web, E-POS mobile) untuk bisnis HVAC klien senilai 30 juta, mulai dari arsitektur sistem hingga deployment menggunakan Laravel, Next.js/React, dan MySQL.",
      role: "Project Lead & Fullstack Developer",
      techStack: ["Laravel", "Next.js/React", "MySQL"],
      highlights: [
        "Memimpin tim 3 developer merancang 3 produk digital terintegrasi dari requirement hingga deployment",
        "Merancang arsitektur sistem dan skema database untuk operasional bisnis HVAC klien",
        "Menjadi single point of contact antara tim dan klien"
      ]
    },
    {
      title: "HDB AC Shop — E-Commerce & Service Platform",
      date: "2025",
      image: "/images/Hdb.png",
      description: "Membangun platform full-stack e-commerce dan manajemen servis AC menggunakan React, TypeScript, dan Node.js/Express, lengkap dengan autentikasi JWT multi-role dan integrasi payment gateway Midtrans (QRIS, transfer bank, e-wallet).",
      role: "Fullstack Developer",
      techStack: ["React", "TypeScript", "Node.js/Express", "MySQL 8.0", "Midtrans"],
      highlights: [
        "Autentikasi JWT multi-role (customer, admin, teknisi)",
        "Integrasi payment gateway Midtrans: QRIS, transfer bank, e-wallet",
        "Admin dashboard dengan analitik penjualan dan tracking order real-time"
      ]
    },
    {
      title: "CV Blitaris Tekno — Stabilisasi Aplikasi Produksi",
      date: "1 Juli 2026 - 21 Agustus 2026",
      image: "https://picsum.photos/seed/blitaristekno/800/600",
      description: "Mewarisi aplikasi web produksi (Laravel & Vue.js) yang sebelumnya tidak stabil, lalu melakukan debugging dan refactoring menyeluruh, memperbaiki 150+ bug yang berdampak pada stabilitas sistem hingga siap dipakai lagi.",
      role: "Fullstack Developer (Magang)",
      techStack: ["Laravel", "Vue.js (Vite)", "MySQL"],
      highlights: [
        "Mewarisi aplikasi produksi yang sebelumnya tidak stabil",
        "Memperbaiki 150+ bug yang berdampak pada stabilitas aplikasi",
        "Pengujian keamanan dasar: validasi input dan autentikasi"
      ]
    },
    {
      title: "Katalog Rental Mobil Naivara Group",
      date: "2025",
      image: "/images/Naivara.png",
      description: "Membangun frontend katalog rental mobil menggunakan Laravel Blade, menampilkan 20 unit kendaraan secara responsif dengan integrasi data dinamis dari backend untuk update real-time tanpa reload manual.",
      role: "Frontend Developer",
      techStack: ["Laravel Blade"],
      highlights: [
        "Menampilkan 20 unit kendaraan secara responsif",
        "Update data real-time tanpa reload manual"
      ]
    }
  ];
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/types.ts src/App.tsx
git commit -m "feat: add case-study data to project entries"
```

---

### Task 5: Project case-study expand + contextual cursor preview

**Files:**
- Create: `src/components/ProjectCard.tsx`
- Modify: `src/components/CustomCursor.tsx`
- Modify: `src/App.tsx` (state, import, projects grid render, `ArrowRight` import removal)

**Interfaces:**
- Consumes: `Project` type with `role`/`techStack`/`highlights` from Task 4, `useReducedMotion` from Task 1.
- Produces: `ProjectCard` default export, `(props: { project: Project; index: number; isExpanded: boolean; onToggle: () => void }) => JSX.Element`. Root element carries `data-cursor-preview` (image URL) and `data-cursor-label` ("View"/"Close") attributes, which `CustomCursor` reads.

- [ ] **Step 1: Create ProjectCard**

Create `src/components/ProjectCard.tsx`:

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Project } from '../types';
import useReducedMotion from '../hooks/useReducedMotion';

interface ProjectCardProps {
  project: Project;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function ProjectCard({ project, index, isExpanded, onToggle }: ProjectCardProps) {
  const reducedMotion = useReducedMotion();
  const detailTransition = reducedMotion ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' as const };

  return (
    <motion.div
      layout
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={`group cursor-pointer hover-trigger ${isExpanded ? 'md:col-span-2' : ''}`}
      onClick={onToggle}
      data-cursor-preview={project.image}
      data-cursor-label={isExpanded ? 'Close' : 'View'}
    >
      <motion.div layout className="overflow-hidden mb-8 bg-[#EAE6DF] rounded-sm">
        <img
          src={project.image}
          alt={project.title}
          className="w-full aspect-4/3 object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
      </motion.div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-display font-bold text-3xl md:text-4xl group-hover:tracking-widest transition-all duration-500 uppercase">
            {project.title}
          </h3>
          <ArrowRight
            className={`transition-all duration-500 text-[#1A1A1A] ${isExpanded ? 'rotate-90' : 'opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'}`}
            strokeWidth={1.5}
            size={28}
          />
        </div>
        <p className="text-[#1A1A1A]/60 font-light leading-relaxed max-w-md">
          {project.description}
        </p>
        <span className="font-mono text-[15px] uppercase tracking-[0.2em] font-medium text-[#1A1A1A]/40 mt-2">
          {project.date}
        </span>

        <AnimatePresence>
          {isExpanded && (project.role || project.techStack || project.highlights) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={detailTransition}
              className="mt-4 pt-6 border-t border-[#1A1A1A]/10 flex flex-col gap-4 overflow-hidden"
            >
              {project.role && (
                <p className="text-sm font-medium text-[#1A1A1A]/80">{project.role}</p>
              )}
              {project.techStack && (
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 border border-[#1A1A1A]/15 rounded-full text-xs font-mono uppercase tracking-wide text-[#1A1A1A]/70"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
              {project.highlights && (
                <ul className="flex flex-col gap-2">
                  {project.highlights.map((point) => (
                    <li
                      key={point}
                      className="text-sm text-[#1A1A1A]/60 font-light leading-relaxed pl-4 relative before:content-['—'] before:absolute before:left-0 before:text-[#1A1A1A]/30"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Add contextual preview to CustomCursor**

Replace the full contents of `src/components/CustomCursor.tsx` with:

```tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useReducedMotion from '../hooks/useReducedMotion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [preview, setPreview] = useState<{ image: string; label: string } | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' || 
        target.closest('a') || 
        target.closest('button') || 
        target.classList.contains('hover-trigger');
        
      setIsHovering(!!isClickable);

      const previewTarget = target.closest('[data-cursor-preview]') as HTMLElement | null;
      if (previewTarget) {
        setPreview({
          image: previewTarget.dataset.cursorPreview!,
          label: previewTarget.dataset.cursorLabel || 'View',
        });
      } else {
        setPreview(null);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Don't render cursor on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-[#1A1A1A] rounded-full pointer-events-none z-9999 mix-blend-difference"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: preview ? 0 : isHovering ? 4 : 1,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-[#1A1A1A]/30 rounded-full pointer-events-none z-9998"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering || preview ? 0 : 1,
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
      />
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: mousePosition.x - 60,
              y: mousePosition.y - 60,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 20 }}
            className="fixed top-0 left-0 w-[120px] h-[120px] rounded-sm overflow-hidden pointer-events-none z-9997 shadow-2xl"
          >
            <img src={preview.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <span className="absolute bottom-1 right-1 font-mono text-[9px] uppercase tracking-widest bg-[#1A1A1A] text-[#F5F2ED] px-1.5 py-0.5 rounded-sm">
              {preview.label}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 3: Wire ProjectCard + expand state into App.tsx**

Remove `ArrowRight` from the lucide-react import (it's now only used inside `ProjectCard`):

Find:
```tsx
import { 
  Menu,
  X,
  ArrowRight,
  Mail,
  MapPin,
  Phone
} from 'lucide-react';
```

Replace with:
```tsx
import { 
  Menu,
  X,
  Mail,
  MapPin,
  Phone
} from 'lucide-react';
```

Add the `ProjectCard` import next to the `MetricsSection` import:

Find:
```tsx
import MetricsSection from './components/MetricsSection';
```

Replace with:
```tsx
import MetricsSection from './components/MetricsSection';
import ProjectCard from './components/ProjectCard';
```

Add expand state next to the existing `scrolled` state:

Find:
```tsx
  const [scrolled, setScrolled] = useState(false);
```

Replace with:
```tsx
  const [scrolled, setScrolled] = useState(false);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
```

Replace the projects grid render with `ProjectCard` usage:

Find:
```tsx
            <div className="grid md:grid-cols-2 gap-12 md:gap-20">
              {projects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} 
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] } }
                  }}
                  className="group cursor-pointer hover-trigger"
                >
                  <div className="overflow-hidden mb-8 bg-[#EAE6DF] rounded-sm">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full aspect-4/3 object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-display font-bold text-3xl md:text-4xl group-hover:tracking-widest transition-all duration-500 uppercase">
                        {project.title}
                      </h3>
                      <ArrowRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-[#1A1A1A]" strokeWidth={1.5} size={28} />
                    </div>
                    <p className="text-[#1A1A1A]/60 font-light leading-relaxed max-w-md">
                      {project.description}
                    </p>
                    <span className="font-mono text-[15px] uppercase tracking-[0.2em] font-medium text-[#1A1A1A]/40 mt-2">
                      {project.date}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
```

Replace with:
```tsx
            <div className="grid md:grid-cols-2 gap-12 md:gap-20">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.title}
                  project={project}
                  index={index}
                  isExpanded={expandedProject === index}
                  onToggle={() => setExpandedProject(expandedProject === index ? null : index)}
                />
              ))}
            </div>
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors (confirms `ArrowRight` removal didn't break anything and `ProjectCard` props match).

- [ ] **Step 5: Manual verification**

Run: `npm run dev`.
Expected:
- Clicking a project card expands it in place to show role, tech-stack badges, and highlights; clicking again collapses it.
- Only one project is expanded at a time (clicking a second card collapses the first).
- Hovering over a project card (not clicked) shows a small floating image preview following the cursor, labeled "View"; the normal dot/ring cursor hides while the preview is shown.

- [ ] **Step 6: Commit**

```bash
git add src/components/ProjectCard.tsx src/components/CustomCursor.tsx src/App.tsx
git commit -m "feat: add project case-study expand and contextual cursor preview"
```

---

### Task 6: Command palette (Cmd+K)

**Files:**
- Create: `src/components/CommandPalette.tsx`
- Modify: `src/App.tsx` (import, `commandItems` data, render, nav hint badge)

**Interfaces:**
- Consumes: `useReducedMotion` from Task 1, the existing `scrollTo(id: string)` function and `navItems` array already defined in `App.tsx`.
- Produces: `CommandItem` interface (`{ id: string; label: string; group: string; onSelect: () => void }`) and `CommandPalette` default export, `(props: { items: CommandItem[] }) => JSX.Element`.

- [ ] **Step 1: Create CommandPalette**

Create `src/components/CommandPalette.tsx`:

```tsx
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import useReducedMotion from '../hooks/useReducedMotion';

export interface CommandItem {
  id: string;
  label: string;
  group: string;
  onSelect: () => void;
}

interface CommandPaletteProps {
  items: CommandItem[];
}

export default function CommandPalette({ items }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  const filtered = useMemo(
    () => items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())),
    [items, query]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((open) => !open);
        return;
      }
      if (!isOpen) return;
      if (e.key === 'Escape') {
        setIsOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = filtered[activeIndex];
        if (item) {
          item.onSelect();
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, activeIndex]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const overlayTransition = reducedMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' as const };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={overlayTransition}
          className="fixed inset-0 z-500 bg-[#1A1A1A]/40 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-6"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={overlayTransition}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#F5F2ED] rounded-sm border border-[#1A1A1A]/10 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1A1A1A]/10">
              <Search size={18} strokeWidth={1.5} className="text-[#1A1A1A]/40" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ketik untuk mencari..."
                className="flex-1 bg-transparent outline-none text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 font-light"
              />
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#1A1A1A]/30 border border-[#1A1A1A]/15 rounded px-1.5 py-0.5">Esc</span>
            </div>
            <div className="max-h-80 overflow-y-auto py-2">
              {filtered.length === 0 && (
                <p className="px-5 py-6 text-sm text-[#1A1A1A]/40 font-light">Tidak ada hasil.</p>
              )}
              {filtered.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => {
                    item.onSelect();
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`w-full flex items-center justify-between gap-4 px-5 py-3 text-left transition-colors ${
                    index === activeIndex ? 'bg-[#1A1A1A]/5' : ''
                  }`}
                >
                  <span className="text-[#1A1A1A] font-light">{item.label}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#1A1A1A]/30">{item.group}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Wire it into App.tsx**

Add the import next to the `ProjectCard` import:

Find:
```tsx
import ProjectCard from './components/ProjectCard';
```

Replace with:
```tsx
import ProjectCard from './components/ProjectCard';
import CommandPalette, { CommandItem } from './components/CommandPalette';
```

Add the `commandItems` array right after the `navItems` array:

Find:
```tsx
  const navItems = [
    { id: 'about', label: 'Biografi' },
    { id: 'projects', label: 'Proyek' },
    { id: 'experience', label: 'Pengalaman' },
    { id: 'education', label: 'Pendidikan' },
    { id: 'certificates', label: 'Sertifikat' },
  ];
```

Replace with:
```tsx
  const navItems = [
    { id: 'about', label: 'Biografi' },
    { id: 'projects', label: 'Proyek' },
    { id: 'experience', label: 'Pengalaman' },
    { id: 'education', label: 'Pendidikan' },
    { id: 'certificates', label: 'Sertifikat' },
  ];

  const commandItems: CommandItem[] = [
    ...navItems.map((item) => ({
      id: item.id,
      label: item.label,
      group: 'Navigasi',
      onSelect: () => scrollTo(item.id),
    })),
    {
      id: 'email',
      label: 'Email Saya',
      group: 'Kontak',
      onSelect: () => { window.location.href = 'mailto:akhmadabdullahsyakirmi1a@gmail.com'; },
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      group: 'Kontak',
      onSelect: () => window.open('https://wa.me/6282333318107', '_blank'),
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      group: 'Kontak',
      onSelect: () => window.open('https://www.linkedin.com/in/akhmad-abdullah-syakir-bb49282b7/', '_blank'),
    },
    {
      id: 'github',
      label: 'GitHub',
      group: 'Kontak',
      onSelect: () => window.open('https://github.com/Syakir003', '_blank'),
    },
  ];
```

Note: `commandItems` references `scrollTo`, which is declared later in the component body (right before the `fadeUp`/`textReveal` variants). No reordering is needed — `scrollTo` is only referenced inside the `() => scrollTo(item.id)` closures, not called immediately, so it resolves fine at click-time regardless of declaration order in the file. (Verified: TypeScript does not flag this as "used before declaration" since the reference is inside a nested function body, not an immediate read.)

Add the nav "⌘K" hint badge inside the desktop nav, right after the `navItems.map(...)` block closes:

Find:
```tsx
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 items-center">
            {navItems.map((item) => (
              <React.Fragment key={item.id}>
                <Magnetic>
                  <button
                    onClick={() => scrollTo(item.id)}
                    className="text-[15px] uppercase tracking-[0.25em] font-medium text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors hover-trigger p-2"
                  >
                    {item.label}
                  </button>
                </Magnetic>
              </React.Fragment>
            ))}
          </div>
```

Replace with:
```tsx
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 items-center">
            {navItems.map((item) => (
              <React.Fragment key={item.id}>
                <Magnetic>
                  <button
                    onClick={() => scrollTo(item.id)}
                    className="text-[15px] uppercase tracking-[0.25em] font-medium text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors hover-trigger p-2"
                  >
                    {item.label}
                  </button>
                </Magnetic>
              </React.Fragment>
            ))}
            <span className="hidden lg:inline-block font-mono text-[11px] uppercase tracking-widest text-[#1A1A1A]/30 border border-[#1A1A1A]/15 rounded px-2 py-1 ml-2">
              ⌘K
            </span>
          </div>
```

Finally, render the palette once near the top of the page tree, right after `<CustomCursor />`:

Find:
```tsx
      <CustomCursor />
```

Replace with:
```tsx
      <CustomCursor />
      <CommandPalette items={commandItems} />
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Step 4: Manual verification**

Run: `npm run dev`.
Expected:
- Pressing `Cmd+K` (Mac) / `Ctrl+K` (Windows/Linux) anywhere on the page opens the palette with an input focused.
- Typing filters the list (e.g. typing "git" leaves only "GitHub").
- `↑`/`↓` moves the highlighted row, `Enter` activates it (nav items scroll to their section and close the palette; "GitHub"/"LinkedIn" open in a new tab; "Email Saya" opens the mail client).
- `Esc` or clicking outside the panel closes it.
- A small "⌘K" hint badge is visible in the desktop nav (on wide viewports).

- [ ] **Step 5: Commit**

```bash
git add src/components/CommandPalette.tsx src/App.tsx
git commit -m "feat: add command palette (Cmd+K) navigation"
```

---

## Final check

- [ ] Run `npx tsc --noEmit -p tsconfig.json` once more from a clean state — expect no errors.
- [ ] Run `npm run dev`, do a full top-to-bottom scroll pass confirming: hero 3D accent, metrics count-up, project expand/collapse + cursor preview, and Cmd+K palette all work together without visual conflicts (e.g. palette opening while a project is expanded, cursor preview persisting after closing the palette).
