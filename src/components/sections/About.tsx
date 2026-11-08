import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Faq, faqs, profile, sections } from "../../config/site";
import { SectionHeading } from "../ui/SectionHeading";
import { play } from "../../lib/sound";

const info = [
  ["NAME", profile.name],
  ["KNOWN AS", profile.knownAs],
  ["AGE", String(profile.age)],
  ["STATUS", profile.status],
  ["FOCUS", profile.focus],
  ["LOCATION", profile.locationShort],
] as const;

function FaqAccordionItem({ faq, index }: { faq: Faq; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <article
      className={`group relative border-2 transition-all duration-300 ${
        open ? "border-blood bg-void/90 shadow-[6px_6px_0_#E60023]" : "border-paper/40 bg-void/60 hover:border-paper/80"
      }`}
    >
      <button
        type="button"
        onClick={() => {
          play("card");
          setOpen((prev) => !prev);
        }}
        onMouseEnter={() => play("hover")}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6"
      >
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
          <span className="font-mono text-[10px] font-bold tracking-[0.25em] text-blood">
            {String(index + 1).padStart(2, "0")} // {faq.tag}
          </span>
          <h4 className="font-display text-lg tracking-wide text-paper group-hover:text-blood transition-colors md:text-xl">
            {faq.question}
          </h4>
        </div>
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center -skew-x-12 transition-transform duration-300 ${
            open ? "rotate-180 bg-blood text-paper" : "bg-paper text-void group-hover:bg-blood group-hover:text-paper"
          }`}
          aria-hidden="true"
        >
          <ChevronDown className="h-5 w-5 skew-x-12" />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 px-5 pb-6 pt-4 text-base leading-relaxed text-paper/85 md:px-6 md:text-lg">
              <p>{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

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

        {/* Persona 5 Themed FAQ / Intel Dossier */}
        <div className="mt-16 border-t-2 border-blood/50 pt-12 md:mt-24 md:pt-16" data-reveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <HelpCircle className="h-4 w-4 text-blood" aria-hidden="true" />
                <p className="font-mono text-xs font-bold tracking-[0.35em] text-blood">
                  INTEL DOSSIER // FREQUENTLY ASKED
                </p>
              </div>
              <h3 className="mt-2 font-display text-3xl tracking-wide text-paper md:text-5xl">
                FAQ: PERTANYAAN UMUM
              </h3>
            </div>
            <p className="font-mono text-xs tracking-[0.25em] text-ash">
              KLARIFIKASI ENTITAS &amp; INFORMASI RESMI
            </p>
          </div>

          <div className="grid gap-4 md:gap-5" role="region" aria-label="Pertanyaan yang sering diajukan">
            {faqs.map((faq, i) => (
              <FaqAccordionItem key={faq.question} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

