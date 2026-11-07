/**
 * Original UI sound effects, synthesized live with the Web Audio API.
 * No audio files are shipped — every sound is generated from oscillators
 * and filtered noise. Sound is OFF by default and persisted in localStorage.
 */
export type SoundName = "click" | "hover" | "transition" | "intro" | "success" | "slash" | "card" | "persona";

const STORAGE_KEY = "leovan:sound";
let ctx: AudioContext | null = null;
let enabled = false;
const listeners = new Set<(on: boolean) => void>();

try {
  enabled = typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY) === "on";
} catch {
  enabled = false;
}

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function isSoundEnabled() {
  return enabled;
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    /* storage unavailable */
  }
  if (on) {
    audio();
    play("slash");
  }
  listeners.forEach((l) => l(on));
}

export function subscribeSound(fn: (on: boolean) => void) {
  listeners.add(fn);
  return () => void listeners.delete(fn);
}

function tone(a: AudioContext, type: OscillatorType, from: number, to: number, dur: number, gain: number, delay = 0) {
  const t = a.currentTime + delay;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(from, t);
  o.frequency.exponentialRampToValueAtTime(Math.max(20, to), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function noise(a: AudioContext, dur: number, gain: number, fFrom: number, fTo: number, delay = 0) {
  const t = a.currentTime + delay;
  const len = Math.floor(a.sampleRate * dur);
  const buf = a.createBuffer(1, len, a.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource();
  src.buffer = buf;
  const f = a.createBiquadFilter();
  f.type = "bandpass";
  f.Q.value = 1.4;
  f.frequency.setValueAtTime(fFrom, t);
  f.frequency.exponentialRampToValueAtTime(fTo, t + dur);
  const g = a.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + dur * 0.25);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(a.destination);
  src.start(t);
  src.stop(t + dur + 0.02);
}

let lastHover = 0;

export function play(name: SoundName) {
  if (!enabled) return;
  const a = audio();
  if (!a) return;
  switch (name) {
    case "click":
      tone(a, "square", 880, 440, 0.07, 0.05);
      tone(a, "triangle", 1760, 1200, 0.05, 0.03, 0.02);
      break;
    case "hover": {
      const now = performance.now();
      if (now - lastHover < 60) return;
      lastHover = now;
      tone(a, "sine", 2400, 1800, 0.04, 0.018);
      break;
    }
    case "transition":
      noise(a, 0.35, 0.06, 400, 3800);
      break;
    case "intro":
      tone(a, "sawtooth", 110, 38, 0.9, 0.08);
      noise(a, 0.5, 0.08, 6000, 300, 0.05);
      tone(a, "square", 660, 1320, 0.12, 0.04, 0.6);
      break;
    case "success":
      tone(a, "triangle", 660, 660, 0.08, 0.05);
      tone(a, "triangle", 990, 990, 0.12, 0.05, 0.08);
      break;
    case "slash":
      // Persona 5 style card/weapon slash sound
      noise(a, 0.18, 0.09, 8000, 800);
      tone(a, "sawtooth", 1400, 280, 0.15, 0.06);
      break;
    case "card":
      tone(a, "sine", 950, 1200, 0.06, 0.05);
      tone(a, "triangle", 440, 880, 0.08, 0.04, 0.02);
      break;
    case "persona":
      tone(a, "sawtooth", 220, 440, 0.25, 0.06);
      tone(a, "triangle", 554, 880, 0.35, 0.06, 0.08);
      tone(a, "square", 1108, 1760, 0.4, 0.04, 0.16);
      break;
  }
}
