import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowDownRight, Mail } from "lucide-react";
import { profile } from "../../config/site";
import { scrollToSection } from "../Nav";
import { play } from "../../lib/sound";

type Props = { ready: boolean; reducedMotion: boolean };

export function Hero({ ready, reducedMotion }: Props) {
  const root = useRef<HTMLElement>(null);

  const entrance = useRef<gsap.core.Timeline | null>(null);

  // Headline entrance: prepared (hidden) on mount, played as the intro wipe clears
  useLayoutEffect(() => {
    if (reducedMotion || !root.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
      entrance.current = tl;
      tl.from(".h-panel", { xPercent: -110, skewX: -20, duration: 0.9, ease: "expo.inOut" })
        .from(".h-letter", { yPercent: 120, rotate: 12, skewX: -25, duration: 0.9, stagger: 0.05 }, 0.25)
        .from(".h-sub", { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)", duration: 0.6, ease: "expo.inOut" }, 0.6)
        .from(".h-character", { xPercent: 40, autoAlpha: 0, scale: 0.92, duration: 0.9, ease: "expo.out" }, 0.65)
        .from(".h-fade", { y: 30, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, 0.75)
        .from(".h-cta", { x: -60, autoAlpha: 0, duration: 0.6 }, 0.95);
    }, root);
    // Failsafe: never leave the hero hidden
    const failsafe = window.setTimeout(() => entrance.current?.play(), 8000);
    return () => {
      window.clearTimeout(failsafe);
      ctx.revert();
      entrance.current = null;
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (ready) entrance.current?.play();
  }, [ready]);

  // Depth layers: pointer parallax + scroll parallax (scrubbed, reversible)
  useLayoutEffect(() => {
    if (reducedMotion || !root.current) return;
    const ctx = gsap.context(() => {
      const layers = gsap.utils.toArray<HTMLElement>("[data-depth]");
      const movers = layers.map((el) => ({
        x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" }),
        d: Number(el.dataset.depth),
      }));
      const onMove = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        movers.forEach((m) => {
          m.x(nx * m.d * 60);
          m.y(ny * m.d * 40);
        });
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      gsap.to(".h-scroll-far", {
        yPercent: 40,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".h-scroll-near", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      return () => window.removeEventListener("pointermove", onMove);
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={root}
      id="home"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-24 pt-24 md:pt-28"
    >
      {/* Far layer: outline monogram letters */}
      <div className="h-scroll-far pointer-events-none absolute inset-0" aria-hidden="true">
        <div data-depth="0.3" className="absolute -right-[8vw] top-[8%] font-display text-[42vw] text-stroke opacity-[0.07] md:text-[30vw]">
          LV
        </div>
      </div>

      {/* Mid layer: red diagonal panel with halftone */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div data-depth="0.6" className="h-panel absolute -left-[20%] top-[18%] h-[62%] w-[85%] -skew-x-[22deg] bg-gradient-to-r from-crimson/80 via-blood/50 to-transparent md:w-[62%]">
          <div className="halftone halftone-fade absolute inset-0 text-void/50" />
        </div>
        <div data-depth="1" className="absolute left-[4%] top-[14%] h-1 w-[40vw] -rotate-[14deg] bg-paper/80" />
        <div data-depth="1.3" className="absolute bottom-[22%] right-[6%] h-3 w-[22vw] -rotate-[14deg] bg-blood" />
      </div>

      <div className="h-scroll-near relative z-10 mx-auto w-full max-w-[1500px] px-5 md:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-3xl">
            <div className="h-fade flex flex-wrap items-center gap-3">
              <span className="clip-tag bg-paper px-4 py-1 font-mono text-[10px] font-bold tracking-[0.3em] text-void md:text-xs">
                FILE 00 / THE AWAKENING
              </span>
              <span className="font-mono text-[10px] tracking-[0.3em] text-ash md:text-xs">{profile.identity.toUpperCase()}</span>
            </div>

            <h1
              id="hero-title"
              className="mt-6 flex overflow-hidden pb-2 font-display text-[clamp(4.8rem,18vw,15rem)] uppercase leading-[0.82] -skew-x-[8deg]"
              aria-label="LEOVAN"
            >
              {"LEOVAN".split("").map((ch, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className={`h-letter inline-block ${i >= 3 ? "text-blood [text-shadow:8px_8px_0_#030303]" : "[text-shadow:8px_8px_0_#990019]"}`}
                >
                  {ch}
                </span>
              ))}
            </h1>

            <p style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }} className="h-sub mt-2 inline-block -skew-x-12 bg-paper px-4 py-2 font-display text-[clamp(1.3rem,4.2vw,2.8rem)] tracking-wide text-void md:px-6">
              <span className="inline-block skew-x-12">{profile.tagline}</span>
            </p>

            <p className="h-fade mt-6 max-w-xl text-base text-paper/85 md:text-lg">
              Web &amp; App Developer. 14 years old. Indonesia.
            </p>

            <ul className="h-fade mt-6 flex flex-wrap gap-2 font-mono text-xs font-bold tracking-[0.2em] md:text-sm" aria-label="Status">
              {["DEV", "APP & WEB", "INDONESIA"].map((s, i) => (
                <li key={s} className={`border-2 px-3 py-1.5 ${i === 0 ? "border-blood bg-blood text-paper" : "border-paper/70 text-paper"}`}>
                  [ {s} ]
                </li>
              ))}
            </ul>

            <div className="h-cta mt-10 flex flex-wrap gap-4">
              <a
                href="#projects"
                className="btn-p5"
                onMouseEnter={() => play("hover")}
                onClick={(e) => {
                  e.preventDefault();
                  play("click");
                  scrollToSection("projects");
                }}
              >
                <span>DISCOVER MY WORK</span>
                <ArrowDownRight className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="#contact"
                className="btn-p5 btn-ghost"
                onMouseEnter={() => play("hover")}
                onClick={(e) => {
                  e.preventDefault();
                  play("click");
                  scrollToSection("contact");
                }}
              >
                <span className="inline-flex items-center gap-3">
                  CONTACT ME <Mail className="h-5 w-5" aria-hidden="true" />
                </span>
              </a>
            </div>
          </div>

          {/* Persona character cut-in illustration */}
          <div
            data-depth="0.8"
            className="h-character relative flex flex-col items-center justify-center lg:items-end mt-8 lg:mt-0"
          >
            <div className="relative group max-w-[420px] sm:max-w-[480px] lg:max-w-[560px]">
              {/* Persona decorative backdrop slashes & halftone */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-4 -skew-x-12 bg-gradient-to-tr from-blood/35 via-crimson/20 to-transparent rounded-lg opacity-80 blur-xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-6 top-6 h-28 w-28 -rotate-12 bg-blood/20 halftone clip-tag"
              />

              {/* Persona Tag Header */}
              <div className="mb-2 flex items-center justify-between gap-3 self-stretch -skew-x-12 px-3 font-mono text-[10px] tracking-[0.25em] md:text-xs">
                <span className="bg-blood px-2 py-0.5 font-bold text-paper">AVATAR / OPERATIVE</span>
                <span className="text-ash/80">FILE // 00-P5</span>
              </div>

              {/* Character Image with Persona 5 red shadow */}
              <div className="relative overflow-visible">
                <img
                  src={profile.characterImage}
                  alt="LEOVAN Joker Persona Character"
                  className="relative z-10 w-full max-h-[420px] sm:max-h-[500px] lg:max-h-[600px] object-contain select-none transition-transform duration-500 group-hover:scale-105 filter drop-shadow-[10px_10px_0_#990019] drop-shadow-[0_25px_35px_rgba(230,0,35,0.4)]"
                  loading="eager"
                  draggable={false}
                />
              </div>

              {/* Bottom stylized callout banner */}
              <div className="mt-2 -skew-x-12 bg-void/90 border border-blood/60 px-4 py-1.5 shadow-[6px_6px_0_#E60023]">
                <p className="font-display text-sm tracking-[0.15em] text-paper md:text-base">
                  <span className="text-blood">WHO KNOWS AS</span> MOHAMMAD SOFANDI
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HUD corners */}
      <div className="h-fade pointer-events-none absolute bottom-20 right-5 hidden text-right font-mono text-[10px] tracking-[0.3em] text-ash md:block md:right-10" aria-hidden="true">
        <p>JAWA BARAT / INDONESIA</p>
        <p className="mt-1 text-blood">SUKAGUMIWANG, INDRAMAYU</p>
      </div>

      {/* Bottom marquee */}
      <div className="absolute inset-x-0 bottom-0 z-10 -skew-y-1 overflow-hidden border-y-2 border-void bg-blood py-2" aria-hidden="true">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap font-display text-xl tracking-[0.15em] text-void md:text-2xl">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="flex gap-10">
              {Array.from({ length: 6 }).map((__, j) => (
                <span key={j} className="flex items-center gap-10">
                  {profile.secondaryTagline}
                  <span className="text-paper">{profile.tagline}</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
