let cached: boolean | null = null;

export function hasWebGL(): boolean {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    cached = !!gl;
    (gl as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
}

/** Rough device tier used to scale particles, DPR and shadows. */
export function deviceTier(): "low" | "mid" | "high" {
  const mobile = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  if (mobile && (cores <= 4 || mem <= 3)) return "low";
  if (mobile) return "mid";
  return cores >= 8 ? "high" : "mid";
}
