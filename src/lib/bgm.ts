/**
 * Procedural Persona 5 inspired BGM Synthesizer for LEOVAN Portfolio.
 * Generates chill acid-jazz & lo-fi grooves natively via Web Audio API.
 * Zero external audio assets, zero CORS, zero latency.
 */

export type BgmTrack = {
  id: string;
  name: string;
  genre: string;
  bpm: number;
};

export const BGM_TRACKS: BgmTrack[] = [
  { id: "rain", name: "BENEATH THE RAIN", genre: "LO-FI ACID JAZZ", bpm: 76 },
  { id: "phantom", name: "PHANTOM GROOVE", genre: "STEALTH FUNK JAZZ", bpm: 92 },
];

const TRACK_STORAGE_KEY = "leovan:bgm_track";

type BgmListener = (playing: boolean, track: BgmTrack, volume: number) => void;
type BeatListener = (beat: number, energy: number) => void;

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isPlaying = false;
let currentTrackIndex = 0;
let volume = 0.22;

const listeners = new Set<BgmListener>();
const beatListeners = new Set<BeatListener>();

// Try load state
try {
  if (typeof localStorage !== "undefined") {
    const savedTrack = localStorage.getItem(TRACK_STORAGE_KEY);
    if (savedTrack) {
      const idx = BGM_TRACKS.findIndex((t) => t.id === savedTrack);
      if (idx !== -1) currentTrackIndex = idx;
    }
  }
} catch {
  /* storage unavailable */
}

function getAudio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === "suspended") {
    void audioCtx.resume();
  }
  if (!masterGain && audioCtx) {
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(volume, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  }
  return audioCtx;
}

// -------------------------------------------------------------
// Jazz Synthesizer Instruments
// -------------------------------------------------------------

// Fender Rhodes / Electric Piano simulation
function playRhodesChord(
  ctx: AudioContext,
  dest: AudioNode,
  frequencies: number[],
  time: number,
  duration: number,
  gain = 0.12
) {
  frequencies.forEach((freq, i) => {
    // Fundamental tone (sine)
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, time);

    // Warm bell-like second harmonic (triangle)
    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 2, time);

    // Tone shaping filter
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1800, time);
    filter.frequency.exponentialRampToValueAtTime(500, time + duration);

    // Amplitude envelope
    const env = ctx.createGain();
    const chordGain = (gain / frequencies.length) * (1 - i * 0.08);
    env.gain.setValueAtTime(0.0001, time);
    env.gain.linearRampToValueAtTime(chordGain, time + 0.018);
    env.gain.exponentialRampToValueAtTime(chordGain * 0.45, time + 0.35);
    env.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(env);
    env.connect(dest);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration + 0.05);
    osc2.stop(time + duration + 0.05);
  });
}

// Smooth Warm Bass
function playBass(ctx: AudioContext, dest: AudioNode, freq: number, time: number, duration: number, gain = 0.22) {
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, time);

  // Sub oscillator for deep rumble
  const sub = ctx.createOscillator();
  sub.type = "triangle";
  sub.frequency.setValueAtTime(freq, time);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(320, time);
  filter.frequency.exponentialRampToValueAtTime(140, time + duration);

  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, time);
  env.gain.linearRampToValueAtTime(gain, time + 0.025);
  env.gain.exponentialRampToValueAtTime(gain * 0.6, time + 0.2);
  env.gain.exponentialRampToValueAtTime(0.0001, time + duration);

  osc.connect(filter);
  sub.connect(filter);
  filter.connect(env);
  env.connect(dest);

  osc.start(time);
  sub.start(time);
  osc.stop(time + duration + 0.05);
  sub.stop(time + duration + 0.05);
}

// Lo-Fi Drum: Kick
function playLoFiKick(ctx: AudioContext, dest: AudioNode, time: number) {
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(120, time);
  osc.frequency.exponentialRampToValueAtTime(38, time + 0.16);

  env.gain.setValueAtTime(0.25, time);
  env.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

  osc.connect(env);
  env.connect(dest);
  osc.start(time);
  osc.stop(time + 0.22);
}

// Lo-Fi Drum: Rimshot / Soft Snare
function playLoFiSnare(ctx: AudioContext, dest: AudioNode, time: number) {
  const dur = 0.15;
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.04));

  const noise = ctx.createBufferSource();
  noise.buffer = buf;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(2400, time);
  filter.Q.value = 1.2;

  const env = ctx.createGain();
  env.gain.setValueAtTime(0.08, time);
  env.gain.exponentialRampToValueAtTime(0.001, time + dur);

  noise.connect(filter).connect(env).connect(dest);
  noise.start(time);
  noise.stop(time + dur);
}

// Lo-Fi Brushed Hi-Hat
function playLoFiHiHat(ctx: AudioContext, dest: AudioNode, time: number, open = false) {
  const dur = open ? 0.2 : 0.06;
  const len = Math.floor(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

  const noise = ctx.createBufferSource();
  noise.buffer = buf;

  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.setValueAtTime(6800, time);

  const env = ctx.createGain();
  env.gain.setValueAtTime(open ? 0.035 : 0.02, time);
  env.gain.exponentialRampToValueAtTime(0.0005, time + dur);

  noise.connect(filter).connect(env).connect(dest);
  noise.start(time);
  noise.stop(time + dur);
}

// -------------------------------------------------------------
// Track Data: Chords & Progressions (Persona 5 aesthetic)
// -------------------------------------------------------------

// Track 1: Beneath the Rain (Dm9 -> G13 -> Cmaj9 -> A7#9)
const TRACK1_CHORDS = [
  { bass: 73.42, chord: [293.66, 349.23, 440.0, 523.25, 659.25] }, // D2 bass, D4 F4 A4 C5 E5 (Dm9)
  { bass: 98.0, chord: [293.66, 349.23, 392.0, 493.88, 659.25] },  // G2 bass, D4 F4 G4 B4 E5 (G13)
  { bass: 65.41, chord: [261.63, 329.63, 392.0, 493.88, 587.33] }, // C2 bass, C4 E4 G4 B4 D5 (Cmaj9)
  { bass: 110.0, chord: [277.18, 349.23, 440.0, 554.37, 698.46] }, // A2 bass, C#4 F4 A4 C#5 F5 (A7alt)
];

// Track 2: Phantom Groove (Em7 -> A7 -> Dmaj7 -> B7)
const TRACK2_CHORDS = [
  { bass: 82.41, chord: [329.63, 392.0, 493.88, 587.33] }, // E2, E4 G4 B4 D5 (Em7)
  { bass: 110.0, chord: [293.66, 370.0, 440.0, 554.37] },  // A2, D4 F#4 A4 C#5 (A7)
  { bass: 73.42, chord: [293.66, 370.0, 440.0, 554.37] },  // D2, D4 F#4 A4 C#5 (Dmaj7)
  { bass: 123.47, chord: [311.13, 370.0, 493.88, 622.25] }, // B2, D#4 F#4 B4 D#5 (B7)
];

// -------------------------------------------------------------
// Scheduler Loop
// -------------------------------------------------------------
let timerID: number | null = null;
let currentBar = 0;
let nextNoteTime = 0;

function scheduleStep() {
  if (!isPlaying || !audioCtx || !masterGain) return;

  const track = BGM_TRACKS[currentTrackIndex];
  const beatDuration = 60 / track.bpm;
  const barDuration = beatDuration * 4;

  while (nextNoteTime < audioCtx.currentTime + 0.3) {
    const chordSet = currentTrackIndex === 0 ? TRACK1_CHORDS : TRACK2_CHORDS;
    const chordInfo = chordSet[currentBar % chordSet.length];
    const time = nextNoteTime;

    // 1. Play electric piano chord
    playRhodesChord(audioCtx, masterGain, chordInfo.chord, time, barDuration * 0.9, 0.14);

    // 2. Play walking bass notes (Quarter notes)
    for (let beat = 0; beat < 4; beat++) {
      const bTime = time + beat * beatDuration;
      let freq = chordInfo.bass;
      if (beat === 1) freq *= 1.25; // 3rd/5th step
      if (beat === 2) freq *= 1.5;  // 5th
      if (beat === 3) freq *= 1.12; // chromatic passing
      playBass(audioCtx, masterGain, freq, bTime, beatDuration * 0.75, 0.22);
    }

    // 3. Play Lo-Fi Drums (Kick on 1 & 3, Snare on 2 & 4, Hi-hat swing)
    for (let beat = 0; beat < 4; beat++) {
      const bTime = time + beat * beatDuration;

      // Kick on beat 1 & offbeat 2.5
      if (beat === 0) playLoFiKick(audioCtx, masterGain, bTime);
      if (beat === 2 && currentTrackIndex === 1) playLoFiKick(audioCtx, masterGain, bTime + beatDuration * 0.5);

      // Soft Snare on 2 & 4
      if (beat === 1 || beat === 3) playLoFiSnare(audioCtx, masterGain, bTime);

      // Hi-Hats with swing
      playLoFiHiHat(audioCtx, masterGain, bTime, false);
      const swingOffset = beatDuration * 0.58;
      playLoFiHiHat(audioCtx, masterGain, bTime + swingOffset, beat === 2);
    }

    // Trigger visualizer beats
    for (let beat = 0; beat < 4; beat++) {
      const bTime = time + beat * beatDuration;
      const delay = Math.max(0, (bTime - audioCtx.currentTime) * 1000);
      window.setTimeout(() => {
        if (isPlaying) {
          const energy = beat === 0 || beat === 2 ? 0.95 : 0.65;
          beatListeners.forEach((fn) => fn(beat, energy));
        }
      }, delay);
    }

    currentBar++;
    nextNoteTime += barDuration;
  }

  timerID = window.setTimeout(scheduleStep, 100);
}

// -------------------------------------------------------------
// Public Controller API
// -------------------------------------------------------------

export function isBgmPlaying() {
  return isPlaying;
}

export function getCurrentTrack(): BgmTrack {
  return BGM_TRACKS[currentTrackIndex];
}

export function getBgmVolume() {
  return volume;
}

export function setBgmVolume(val: number) {
  volume = Math.max(0, Math.min(1, val));
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(volume, audioCtx.currentTime);
  }
  notify();
}

export function playBgm() {
  const ctx = getAudio();
  if (!ctx) return;

  if (!isPlaying) {
    isPlaying = true;
    currentBar = 0;
    nextNoteTime = ctx.currentTime + 0.05;
    if (masterGain) {
      masterGain.gain.cancelScheduledValues(ctx.currentTime);
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.8);
    }
    scheduleStep();
    notify();
  }
}

export function stopBgm() {
  if (isPlaying) {
    isPlaying = false;
    if (timerID) {
      window.clearTimeout(timerID);
      timerID = null;
    }
    if (masterGain && audioCtx) {
      masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
    }
    notify();
  }
}

export function toggleBgm() {
  if (isPlaying) {
    stopBgm();
  } else {
    playBgm();
  }
}

export function nextBgmTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % BGM_TRACKS.length;
  try {
    localStorage.setItem(TRACK_STORAGE_KEY, BGM_TRACKS[currentTrackIndex].id);
  } catch {
    /* empty */
  }
  if (isPlaying) {
    // Smooth reset into next bar
    currentBar = 0;
  }
  notify();
}

export function subscribeBgm(fn: BgmListener) {
  listeners.add(fn);
  return () => void listeners.delete(fn);
}

export function subscribeBeat(fn: BeatListener) {
  beatListeners.add(fn);
  return () => void beatListeners.delete(fn);
}

function notify() {
  const current = getCurrentTrack();
  listeners.forEach((fn) => fn(isPlaying, current, volume));
}
