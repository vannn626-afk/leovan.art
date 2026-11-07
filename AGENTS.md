# AGENTS.md

## Architecture
- Single-page Vite + React app. A single fixed WebGL canvas (`src/three/Experience.tsx`, lazy-loaded through `src/components/Backdrop.tsx`) sits behind the DOM sections in `src/components/sections/`.
- `src/lib/sceneStore.ts` is a mutable, non-React store. `useScrollScene` (GSAP ScrollTrigger) writes a continuous `section` index (0–6) and the pointer position into it, and `useFrame` reads it. This avoids React re-renders on every scroll tick.
- `src/three/keyframes.ts` holds the per-section monogram and camera keys (desktop and mobile). Section-specific objects (`SectionObjects.tsx`) fade in and out with `sectionWeight(index)`.
- The LV polygon coordinates in `components/ui/Logo.tsx` are shared by the SVG logo and the extruded 3D mark.

## Conventions
- Content lives only in `src/config/site.ts`. Don't hardcode profile or contact data elsewhere, and don't invent accounts (Instagram is intentionally absent).
- Brand icons come from `simple-icons`. Lucide is used as a fallback where a brand isn't published there (C#, SQL, VS Code, REST API). No emoji.
- Reveals use `[data-reveal]` and `useReveal`. Hidden states only apply once `html.anim-ready` is set, so content is never stuck invisible.
- Sound is generated with Web Audio (`lib/sound.ts`) and is off by default.
- Every component takes a `reducedMotion` prop and must degrade gracefully. Dispose any geometry or textures you create.
- The 3D text font is bundled locally at `src/three/fonts/`.
