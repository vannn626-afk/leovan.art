/**
 * Mutable, non-React store shared between the DOM (GSAP ScrollTrigger) and the
 * WebGL scene (useFrame). Mutating plain objects avoids re-rendering React on
 * every scroll tick.
 */
export const sceneState = {
  /** Continuous section index: 0 = hero ... 6 = contact. 2.5 = halfway tech -> projects. */
  section: 0,
  /** 0..1 intro camera fly-in progress (1 = finished). */
  intro: 0,
  /** Pointer in normalized device coords (-1..1). */
  pointer: { x: 0, y: 0 },
  /** Normalized overall scroll velocity, used for subtle motion streaks. */
  velocity: 0,
};

export const SECTION_COUNT = 7;

/** Smooth "hold then move" easing for section-to-section interpolation. */
export function sectionEase(t: number) {
  const c = Math.min(1, Math.max(0, (t - 0.15) / 0.7));
  return c * c * c * (c * (c * 6 - 15) + 10);
}

/** 0..1 weight of how "present" a given section is right now. */
export function sectionWeight(index: number, current = sceneState.section) {
  const d = Math.abs(current - index);
  if (d >= 1) return 0;
  const w = 1 - d;
  return w * w * (3 - 2 * w);
}
