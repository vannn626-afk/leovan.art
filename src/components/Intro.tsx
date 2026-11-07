import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SkipForward } from "lucide-react";
import { LVMark } from "./ui/Logo";
import { sceneState } from "../lib/sceneStore";
import { play } from "../lib/sound";

type Props = { onDone: () => void; onReveal: () => void; reducedMotion: boolean };

/**
 * Cinematic Persona 5 style intro:
 * Black screen -> red scanline -> angular slash -> 3D camera zoom ->
 * LEOVAN impact slam -> red comic wipe reveal.
 * Fast, punchy (~1.9s), reliable, 100% completion guaranteed, skippable.
 */
export function Intro({ onDone, onReveal, reducedMotion }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const finished = useRef(false);
  const [pct, setPct] = useState(0);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    document.documentElement.classList.remove("intro-lock");
    tl.current?.kill();
    sceneState.intro = 1;
    onReveal();
    onDone();
  };

  useEffect(() => {
    document.documentElement.classList.add("intro-lock");
    // Failsafe: ensures screen NEVER stays locked indefinitely
    const failsafe = window.setTimeout(finish, 6000);

    if (reducedMotion) {
      sceneState.intro = 1;
      const t = window.setTimeout(finish, 80);
      return () => {
        window.clearTimeout(t);
        window.clearTimeout(failsafe);
        document.documentElement.classList.remove("intro-lock");
      };
    }

    const q = gsap.utils.selector(root);
    const counter = { v: 0 };
    play("intro");

    const ctx = gsap.context(() => {
      const t = gsap.timeline({ onComplete: finish });
      tl.current = t;

      // 0.0s - 1.6s: Counter counts 0% -> 100% with audio feel & LV monogram pulse
      t.to(
        counter,
        {
          v: 100,
          duration: 1.6,
          ease: "power2.inOut",
          onUpdate: () => setPct(Math.round(counter.v)),
        },
        0,
      )
        .fromTo(q(".i-status"), { autoAlpha: 0, y: 15 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.1)
        .fromTo(q(".i-line"), { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "expo.out" }, 0.2)
        .fromTo(
          q(".i-shape"),
          { clipPath: "polygon(0% 49.5%, 100% 49.5%, 100% 50.5%, 0% 50.5%)" },
          { clipPath: "polygon(0% 28%, 100% 10%, 100% 64%, 0% 88%)", duration: 0.6, ease: "expo.inOut" },
          0.5,
        )
        .set(q(".i-line"), { autoAlpha: 0 }, 0.9)
        .to(q(".i-status, .i-logo"), { autoAlpha: 0, duration: 0.25 }, 1.7)

        // 1.8s - 2.3s: Open up blades to 3D scene, red shape collapses to dynamic slash
        .to(q(".i-top"), { yPercent: -110, rotate: -4, duration: 0.65, ease: "expo.inOut" }, 1.8)
        .to(q(".i-bottom"), { yPercent: 110, rotate: -4, duration: 0.65, ease: "expo.inOut" }, 1.8)
        .to(q(".i-shape"), { clipPath: "polygon(0% 62%, 100% 40%, 100% 43%, 0% 66%)", duration: 0.5, ease: "expo.inOut" }, 1.8)
        .to(sceneState, { intro: 1, duration: 1.2, ease: "power2.out" }, 1.8)

        // 2.2s - 2.9s: LEOVAN title slams in with shake impact and stays readable
        .fromTo(q(".i-word"), { autoAlpha: 0, scale: 2.8, skewX: -10 }, { autoAlpha: 1, scale: 1, skewX: -10, duration: 0.35, ease: "power4.in" }, 2.2)
        .to(q(".i-word"), { x: "+=14", yoyo: true, repeat: 5, duration: 0.04, ease: "none" }, 2.55)
        .fromTo(q(".i-sub"), { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.3 }, 2.6)

        // 3.0s - 3.6s: Red comic-book wipe cuts through and reveals the site
        .fromTo(q(".i-wipe"), { xPercent: 120, autoAlpha: 1 }, { xPercent: -120, autoAlpha: 1, duration: 0.65, ease: "expo.inOut" }, 3.0)
        .to(q(".i-word, .i-sub, .i-shape"), { autoAlpha: 0, duration: 0.05 }, 3.35)
        .call(() => onReveal(), [], 3.25)
        .to(root.current, { autoAlpha: 0, duration: 0.25 }, 3.55);
    }, root);

    // Keyboard shortcut to skip intro
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        play("click");
        finish();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      ctx.revert();
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(failsafe);
      document.documentElement.classList.remove("intro-lock");
    };
  }, [reducedMotion]);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] overflow-hidden select-none"
      role="dialog"
      aria-label="Intro LEOVAN"
      aria-live="polite"
    >
      <div className="i-top absolute inset-0 bg-void" style={{ clipPath: "polygon(0 0, 100% 0, 100% 46%, 0 58%)" }} />
      <div className="i-bottom absolute inset-0 bg-void" style={{ clipPath: "polygon(0 57.8%, 100% 45.8%, 100% 100%, 0 100%)" }} />
      <div className="i-bottom halftone pointer-events-none absolute inset-0 text-crimson/30" />

      <div className="i-line absolute left-0 top-1/2 h-[3px] w-full origin-left bg-blood" style={{ transform: "scaleX(0)" }} />
      <div className="i-shape absolute inset-0 bg-blood" style={{ clipPath: "polygon(0% 49.5%, 100% 49.5%, 100% 50.5%, 0% 50.5%)" }}>
        <div className="halftone absolute inset-0 text-crimson" />
      </div>

      <div className="i-logo absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <LVMark animated className="h-24 w-auto md:h-32" />
      </div>

      <div className="i-status absolute bottom-10 left-6 font-mono text-[11px] tracking-[0.35em] text-paper md:left-12 md:text-xs pointer-events-none">
        <p className="text-blood font-bold">INITIALIZING EXPERIENCE</p>
        <p className="mt-2 text-ash">LEOVAN / DEVELOPER PORTFOLIO</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1 w-40 -skew-x-[30deg] bg-white/15">
            <div className="h-full bg-blood transition-all duration-75" style={{ width: `${pct}%` }} />
          </div>
          <span className="tabular-nums font-bold text-paper">{String(pct).padStart(3, "0")}%</span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <p
          className="i-word font-display text-[clamp(5rem,23vw,22rem)] text-paper opacity-0 [text-shadow:10px_10px_0_#E60023]"
          aria-hidden="true"
        >
          LEOVAN
        </p>
        <p className="i-sub mt-4 bg-paper px-4 py-1 font-mono text-xs font-bold tracking-[0.4em] text-void opacity-0 md:text-sm">
          DEVELOPER PORTFOLIO
        </p>
      </div>

      <div className="i-wipe pointer-events-none absolute -inset-y-10 left-[-20%] w-[140%] bg-blood" style={{ transform: "skewX(-18deg)", visibility: "hidden" }}>
        <div className="halftone absolute inset-0 text-void/40" />
        <div className="absolute inset-y-0 left-[12%] w-6 bg-void" />
        <div className="absolute inset-y-0 right-[12%] w-3 bg-paper" />
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          play("click");
          finish();
        }}
        className="clip-tag absolute right-5 top-5 z-20 inline-flex items-center gap-2 bg-paper px-5 py-2 font-mono text-xs font-bold tracking-[0.25em] text-void transition-colors hover:bg-blood hover:text-paper md:right-10 md:top-8"
      >
        SKIP INTRO <SkipForward className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
