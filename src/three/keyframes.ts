import { sceneState, sectionEase, SECTION_COUNT } from "../lib/sceneStore";

type V3 = [number, number, number];
export type Key = { pos: V3; rot: V3; scale: number; cam: V3; look: V3 };

/** One key per section: hero, about, tech, projects, achievements, personality, contact. */
const desktop: Key[] = [
  { pos: [2.3, 0.15, 0], rot: [0.05, -0.45, 0], scale: 1.3, cam: [0, 0, 7], look: [0, 0, 0] },
  { pos: [-3.7, 0.6, -2.5], rot: [0.15, 0.9, -0.08], scale: 1.0, cam: [0.8, 0.4, 7.6], look: [0, 0, -1] },
  { pos: [0, 0.1, -4.5], rot: [0, 0, 0], scale: 0.9, cam: [0, 1.4, 7.8], look: [0, 0, -2.5] },
  { pos: [4.4, -1.4, -3.5], rot: [0.3, -0.9, 0.25], scale: 0.7, cam: [-0.6, 0, 7], look: [0, 0, -1] },
  { pos: [0, 2.7, -6], rot: [-0.25, 0, 0], scale: 0.75, cam: [0, -0.2, 6.6], look: [0, 0.2, -2] },
  { pos: [-3.8, -1.2, -2.2], rot: [0.4, 0.7, -0.3], scale: 0.85, cam: [0.5, 0.4, 7], look: [0, 0, -1] },
  { pos: [0, 1.0, -0.6], rot: [0, 0, 0], scale: 1.05, cam: [0, 0, 7], look: [0, 0, -1] },
];

const mobile: Key[] = [
  { pos: [0, 1.5, -1.5], rot: [0.05, -0.35, 0], scale: 0.85, cam: [0, 0, 8], look: [0, 0.4, 0] },
  { pos: [1.4, 2.6, -4], rot: [0.15, -0.7, 0.1], scale: 0.75, cam: [0.3, 0.3, 8.4], look: [0, 0.4, -1] },
  { pos: [0, 0.3, -6], rot: [0, 0, 0], scale: 0.7, cam: [0, 1.2, 8.5], look: [0, 0, -2.5] },
  { pos: [1.2, 2.8, -5], rot: [0.3, -0.8, 0.2], scale: 0.6, cam: [-0.3, 0, 8], look: [0, 0.4, -1] },
  { pos: [0, 2.9, -6.5], rot: [-0.25, 0, 0], scale: 0.6, cam: [0, -0.2, 8], look: [0, 0.3, -2] },
  { pos: [-1.3, 2.6, -4], rot: [0.4, 0.7, -0.3], scale: 0.65, cam: [0.3, 0.3, 8], look: [0, 0.4, -1] },
  { pos: [0, 1.4, -1.6], rot: [0, 0, 0], scale: 0.8, cam: [0, 0, 8], look: [0, 0.2, -1] },
];

const out: Key = { pos: [0, 0, 0], rot: [0, 0, 0], scale: 1, cam: [0, 0, 7], look: [0, 0, 0] };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Interpolated key for the current scroll position (writes into a shared object). */
export function currentKey(isMobile: boolean): Key {
  const keys = isMobile ? mobile : desktop;
  const s = Math.min(SECTION_COUNT - 1, Math.max(0, sceneState.section));
  const i = Math.min(SECTION_COUNT - 2, Math.floor(s));
  const t = sectionEase(s - i);
  const a = keys[i];
  const b = keys[i + 1];
  for (let k = 0; k < 3; k++) {
    out.pos[k] = lerp(a.pos[k], b.pos[k], t);
    out.rot[k] = lerp(a.rot[k], b.rot[k], t);
    out.cam[k] = lerp(a.cam[k], b.cam[k], t);
    out.look[k] = lerp(a.look[k], b.look[k], t);
  }
  out.scale = lerp(a.scale, b.scale, t);
  return out;
}
