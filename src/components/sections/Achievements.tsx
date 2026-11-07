import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { Crown, Swords } from "lucide-react";
import { profile, sections } from "../../config/site";
import { SectionHeading } from "../ui/SectionHeading";

export function Achievements({ reducedMotion }: { reducedMotion: boolean }) {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (reducedMotion || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ach-letter",
        { yPercent: 110, rotateX: -90, autoAlpha: 0 },
        {
          yPercent: 0,
          rotateX: 0,
          autoAlpha: 1,
          stagger: 0.06,
          ease: "back.out(1.6)",
          duration: 0.8,
          scrollTrigger: { trigger: ".ach-panel", start: "top 75%", toggleActions: "play reverse play reverse" },
        },
      );
      gsap.fromTo(
        ".ach-panel",
        { rotateX: 18, scale: 0.92, transformPerspective: 1400 },
        { rotateX: 0, scale: 1, ease: "power2.out", scrollTrigger: { trigger: ".ach-panel", start: "top bottom", end: "top 35%", scrub: 0.7 } },
      );
      gsap.to(".ach-ring", { rotate: 360, duration: 30, repeat: -1, ease: "none" });
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={root} id="achievements" aria-labelledby="ach-title" className="relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <SectionHeading id="ach-title" code={sections[4].code} kicker="ACHIEVEMENTS / PERSONAL RECORD" title={<>BEYOND<br className="md:hidden" /> THE CODE.</>} align="right" />

        <div className="ach-panel clip-notch relative bg-blood p-[3px]">
          <div className="clip-notch relative overflow-hidden bg-void/90 px-5 py-12 md:px-14 md:py-20">
            {/* dynamic background */}
            <div className="stripes pointer-events-none absolute inset-0" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] md:h-[560px] md:w-[560px]" aria-hidden="true">
              <svg viewBox="0 0 200 200" className="ach-ring h-full w-full text-blood/40">
                <polygon points="100,4 196,100 100,196 4,100" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <polygon points="100,24 176,100 100,176 24,100" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="6 5" />
                <polygon points="100,46 154,100 100,154 46,100" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="0.8" />
              </svg>
            </div>
            <div className="pointer-events-none absolute -bottom-10 left-0 h-24 w-[130%] -rotate-3 bg-blood/70" aria-hidden="true">
              <div className="halftone absolute inset-0 text-void/50" />
            </div>

            <div className="relative">
              <div className="flex flex-wrap items-center gap-3" data-reveal="left">
                <Swords className="h-6 w-6 text-blood" aria-hidden="true" />
                <p className="font-mono text-xs font-bold tracking-[0.35em] md:text-sm">GAME</p>
              </div>
              <p className="mt-3 font-display text-[clamp(1.8rem,5vw,3.6rem)] uppercase leading-none" data-reveal="left">
                MOBILE LEGENDS: <span className="text-blood">BANG BANG</span>
              </p>

              <div className="mt-12 flex items-center gap-3" data-reveal="left">
                <Crown className="h-6 w-6 text-paper" aria-hidden="true" />
                <p className="clip-tag bg-paper px-4 py-1 font-mono text-xs font-bold tracking-[0.35em] text-void">RANK</p>
              </div>
              <p
                className="mt-4 flex flex-wrap font-display text-[clamp(4.2rem,17vw,15rem)] leading-[0.85] -skew-x-[8deg] [perspective:800px] [text-shadow:8px_8px_0_#990019]"
                aria-label={profile.rank}
              >
                {profile.rank.split("").map((c, i) => (
                  <span key={i} className="ach-letter inline-block origin-bottom" aria-hidden="true">
                    {c}
                  </span>
                ))}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-xs tracking-[0.3em] text-ash" data-reveal>
                <span className="h-[3px] w-16 bg-blood" aria-hidden="true" />
                PERSONAL RECORD / RANKED MODE
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
