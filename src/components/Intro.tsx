import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SkipForward } from "lucide-react";
import { LVMark } from "./ui/Logo";
import { sceneState } from "../lib/sceneStore";
import { play } from "../lib/sound";

type Props = { onDone: () => void; onReveal: () => void; reducedMotion: boolean };

/**
 * Cinematic intro: black -> red line -> angular red shape -> 3D LV fly-in ->
 * LEOVAN slam -> red comic wipe. ~3s, skippable, with a hard failsafe.
 */
export function Intro({ onDone, onReveal, reducedMotion }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const finished = useRef(false);
  const [pct, setPct] = useState(0);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    tl.current?.kill();
    sceneState.intro = 1;
    onReveal();
    onDone();
  };

  useEffect(() => {
    document.documentElement.classList.add("intro-lock");
    const failsafe = window.setTimeout(finish, 7000);

    if (reducedMotion) {
      sceneState.intro = 1;
      const t = window.setTimeout(finish, 350);
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
      t.to(counter, { v: 100, duration: 1.1, ease: "power2.inOut", onUpdate: () => setPct(Math.round(counter.v)) }, 0)
        .fromTo(q(".i-status"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0)
        .fromTo(q(".i-line"), { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: "expo.out" }, 0.2)
        .fromTo(
          q(".i-shape"),
          { clipPath: "polygon(0% 49.7%, 100% 49.5%, 100% 50.3%, 0% 50.5%)" },
          { clipPath: "polygon(0% 28%, 100% 10%, 100% 64%, 0% 88%)", duration: 0.45, ease: "expo.inOut" },
          0.68,
        )
        .set(q(".i-line"), { autoAlpha: 0 }, 0.9)
        .to(q(".i-status, .i-logo"), { autoAlpha: 0, duration: 0.2 }, 1.1)
        // Open up to the 3D scene: black blades fly out, red shape collapses to a slash
        .to(q(".i-top"), { yPercent: -110, rotate: -4, duration: 0.7, ease: "expo.inOut" }, 1.15)
        .to(q(".i-bottom"), { yPercent: 110, rotate: -4, duration: 0.7, ease: "expo.inOut" }, 1.15)
        .to(q(".i-shape"), { clipPath: "polygon(0% 62%, 100% 40%, 100% 43%, 0% 66%)", duration: 0.6, ease: "expo.inOut" }, 1.15)
        .to(sceneState, { intro: 1, duration: 1.5, ease: "power3.out" }, 1.1)
        // LEOVAN slams in
        .fromTo(q(".i-word"), { autoAlpha: 0, scale: 2.8, skewX: -10 }, { autoAlpha: 1, scale: 1, skewX: -10, duration: 0.32, ease: "power4.in" }, 1.5)
        .to(q(".i-word"), { x: "+=14", yoyo: true, repeat: 5, duration: 0.035, ease: "none" }, 1.82)
        .fromTo(q(".i-sub"), { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.3 }, 1.85)
        // Red comic-book wipe reveals the site
        .fromTo(q(".i-wipe"), { xPercent: 130, autoAlpha: 1 }, { xPercent: -130, autoAlpha: 1, duration: 0.85, ease: "expo.inOut" }, 2.35)
        .to(q(".i-word, .i-sub, .i-shape"), { autoAlpha: 0, duration: 0.01 }, 2.75)
        .call(() => onReveal(), [], 2.6)
        .to(root.current, { autoAlpha: 0, duration: 0.2 }, 3.05);
    }, root);

    return () => {
      ctx.revert();
      window.clearTimeout(failsafe);
      document.documentElement.classList.remove("intro-lock");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  return (
    <div ref={root} className="fixed inset-0 z-[100] overflow-hidden" role="dialog" aria-label="Intro LEOVAN" aria-live="polite">
      <div className="i-top absolute inset-0 bg-void" style={{ clipPath: "polygon(0 0, 100% 0, 100% 46%, 0 58%)" }} />
      <div className="i-bottom absolute inset-0 bg-void" style={{ clipPath: "polygon(0 57.8%, 100% 45.8%, 100% 100%, 0 100%)" }} />
      <div className="i-bottom halftone pointer-events-none absolute inset-0 text-crimson/30" />

      <div className="i-line absolute left-0 top-1/2 h-[3px] w-full origin-left bg-blood" style={{ transform: "scaleX(0)" }} />
      <div className="i-shape absolute inset-0 bg-blood" style={{ clipPath: "polygon(0% 49.7%, 100% 49.5%, 100% 50.3%, 0% 50.5%)" }}>
        <div className="halftone absolute inset-0 text-crimson" />
      </div>

      <div className="i-logo absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <LVMark animated className="h-24 w-auto md:h-32" />
      </div>

      <div className="i-status absolute bottom-10 left-6 font-mono text-[11px] tracking-[0.35em] text-paper md:left-12 md:text-xs">
        <p className="text-blood">INITIALIZING EXPERIENCE</p>
        <p className="mt-2 text-ash">LEOVAN / DEVELOPER PORTFOLIO</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1 w-40 -skew-x-[30deg] bg-white/15">
            <div className="h-full bg-blood" style={{ width: `${pct}%` }} />
          </div>
          <span className="tabular-nums">{String(pct).padStart(3, "0")}%</span>
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
        onClick={() => {
          play("click");
          finish();
        }}
        className="clip-tag absolute right-5 top-5 z-10 inline-flex items-center gap-2 bg-paper px-5 py-2 font-mono text-xs font-bold tracking-[0.25em] text-void transition-colors hover:bg-blood hover:text-paper md:right-10 md:top-8"
      >
        SKIP INTRO <SkipForward className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
