import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { profile, sections } from "../../config/site";
import { SectionHeading } from "../ui/SectionHeading";

const info = [
  ["NAME", profile.name],
  ["KNOWN AS", profile.knownAs],
  ["AGE", String(profile.age)],
  ["STATUS", profile.status],
  ["FOCUS", profile.focus],
  ["LOCATION", profile.locationShort],
] as const;

export function About({ reducedMotion }: { reducedMotion: boolean }) {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (reducedMotion || !root.current) return;
    const ctx = gsap.context(() => {
      // Giant typography sliding horizontally with scroll (reverses on scroll up)
      gsap.fromTo(
        ".a-giant",
        { xPercent: 8 },
        { xPercent: -28, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 0.6 } },
      );
      gsap.fromTo(
        ".a-slash",
        { xPercent: -60, rotate: -18 },
        { xPercent: 20, rotate: -12, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
      gsap.fromTo(
        ".a-card",
        { rotateY: -28, rotateX: 8, z: -120 },
        { rotateY: 0, rotateX: 0, z: 0, ease: "power2.out", scrollTrigger: { trigger: ".a-card", start: "top 90%", end: "top 40%", scrub: 0.8 } },
      );
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={root} id="about" aria-labelledby="about-title" className="relative overflow-hidden py-28 md:py-40">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <p className="a-giant absolute top-6 whitespace-nowrap font-display text-[34vw] leading-none text-stroke opacity-20 md:text-[24vw]">
          LEOVAN LEOVAN
        </p>
        <div className="a-slash absolute bottom-[12%] left-0 h-28 w-[140%] bg-blood/80 md:h-40">
          <div className="halftone absolute inset-0 text-void/40" />
        </div>
      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 md:px-10">
        <SectionHeading id="about-title" code={sections[1].code} kicker="ABOUT / THE DEVELOPER" title={<>BERAWAL<br className="md:hidden" /> DARI GABUT.</>} />

        <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="relative space-y-6 bg-void/75 p-6 text-lg leading-relaxed text-paper/90 backdrop-blur-[2px] md:p-10 md:text-xl clip-panel">
            <p data-reveal="left">
              Gue <strong className="font-display text-2xl tracking-wide text-blood md:text-3xl">LEOVAN</strong>{" "}
              <span className="font-mono text-sm tracking-wide text-ash md:text-base">
                (Who knows as <strong className="text-paper font-semibold">Mohammad Sofandi</strong>)
              </span>
              , developer web dan app berusia 14 tahun dari Sukagumiwang, Indramayu.
            </p>
            <p data-reveal="left" style={{ ["--d" as string]: "0.1s" }}>
              Awalnya cuma mencoba <em className="bg-paper px-1.5 not-italic text-void">vibe coding</em> karena penasaran. Dari situ mulai muncul
              ide, eksperimen, dan project-project yang terus berkembang.
            </p>
            <p data-reveal="left" style={{ ["--d" as string]: "0.2s" }}>
              Sekarang gue fokus membangun <span className="text-blood">aplikasi</span>, <span className="text-blood">website</span>, dan berbagai{" "}
              <span className="text-blood">digital tools</span>.
            </p>
            <blockquote data-reveal style={{ ["--d" as string]: "0.3s" }} className="border-l-4 border-blood pl-5 font-mono text-sm tracking-wide text-ash md:text-base">
              Dari eksperimen kecil menjadi perjalanan untuk terus belajar, menciptakan, dan mengembangkan sesuatu yang bisa digunakan orang lain.
            </blockquote>
          </div>

          <div className="[perspective:1200px]">
            <aside className="a-card clip-notch relative bg-paper p-1 text-void shadow-[14px_14px_0_#E60023] [transform-style:preserve-3d]" aria-label="Informasi personal">
              <div className="clip-notch bg-void p-6 text-paper md:p-8">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] tracking-[0.35em] text-blood md:text-xs">PERSONAL FILE</p>
                  <p className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-ash"><span className="blink inline-block h-2 w-2 bg-blood" aria-hidden="true" />ONLINE</p>
                </div>
                <dl className="mt-6 divide-y divide-white/10">
                  {info.map(([k, v], i) => (
                    <div key={k} data-reveal="right" style={{ ["--d" as string]: `${i * 0.07}s` }} className="group flex items-baseline justify-between gap-4 py-3.5">
                      <dt className="font-mono text-xs tracking-[0.3em] text-ash">{k}</dt>
                      <dd className="text-right font-display text-2xl tracking-wide transition-colors group-hover:text-blood md:text-3xl">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-6 -skew-x-12 bg-blood px-4 py-2 text-center font-display text-lg tracking-[0.12em]">
                  <span className="inline-block skew-x-12">{profile.secondaryTagline}</span>
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
