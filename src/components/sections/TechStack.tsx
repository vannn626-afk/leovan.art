import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { sections, techCategories, type Tech } from "../../config/site";
import { SectionHeading } from "../ui/SectionHeading";
import { TechIcon } from "../ui/BrandIcon";
import { play } from "../../lib/sound";

function TechCard({ tech, index, category }: { tech: Tech; index: number; category: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${-y * 18}deg`);
    el.style.setProperty("--ry", `${x * 22}deg`);
  };
  const reset = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <motion.li
      initial={{ opacity: 0, rotateY: -70, x: 40, skewX: -10 }}
      animate={{ opacity: 1, rotateY: 0, x: 0, skewX: 0 }}
      exit={{ opacity: 0, rotateY: 70, x: -40, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5, delay: index * 0.035, ease: [0.16, 1, 0.3, 1] }}
      className="[perspective:900px]"
    >
      <div
        ref={ref}
        tabIndex={0}
        onPointerMove={onMove}
        onPointerLeave={reset}
        onMouseEnter={() => play("hover")}
        className="group clip-card relative aspect-[4/5] cursor-default bg-void outline-none transition-[transform,background-color] duration-300 [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] [transform-style:preserve-3d] hover:bg-blood focus-visible:bg-blood"
      >
        <div className="absolute left-0 top-0 h-10 w-10 bg-blood [clip-path:polygon(0_0,100%_0,0_100%)] transition-colors group-hover:bg-paper group-focus-visible:bg-paper" aria-hidden="true" />
        <span className="absolute right-3 top-3 font-mono text-[10px] text-ash group-hover:text-paper">{String(index + 1).padStart(2, "0")}</span>
        <div className="flex h-full flex-col items-center justify-center gap-4 p-4 [transform:translateZ(40px)]">
          <TechIcon tech={tech} className="h-10 w-10 text-paper transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 md:h-12 md:w-12" />
          <h3 className="text-center font-display text-lg tracking-wide md:text-xl">{tech.name}</h3>
        </div>
        {/* Hover-triggered info */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-paper px-3 py-2 text-void transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0">
          <p className="font-mono text-[9px] tracking-[0.2em] text-crimson">{category}</p>
          <p className="text-xs font-semibold leading-tight">{tech.note}</p>
        </div>
      </div>
    </motion.li>
  );
}

export function TechStack({ reducedMotion }: { reducedMotion: boolean }) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);
  const cat = techCategories[active];

  const select = (i: number) => {
    if (i === active) return;
    play("click");
    setActive(i);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (active + (e.key === "ArrowRight" ? 1 : -1) + techCategories.length) % techCategories.length;
    select(next);
    document.getElementById(`tab-${techCategories[next].id}`)?.focus();
  };

  useLayoutEffect(() => {
    if (reducedMotion || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".t-stage",
        { rotateX: 22, y: 80, transformPerspective: 1400 },
        { rotateX: 0, y: 0, ease: "power2.out", scrollTrigger: { trigger: ".t-stage", start: "top 95%", end: "top 45%", scrub: 0.8 } },
      );
      gsap.fromTo(".t-bg", { xPercent: 0 }, { xPercent: -35, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={root} id="tech" aria-labelledby="tech-title" className="relative overflow-hidden py-28 md:py-40">
      <div className="t-bg pointer-events-none absolute left-0 top-1/3 whitespace-nowrap font-display text-[22vw] leading-none text-paper/[0.03]" aria-hidden="true">
        ARSENAL ARSENAL ARSENAL
      </div>

      <div className="relative mx-auto max-w-[1500px] px-5 md:px-10">
        <SectionHeading id="tech-title" code={sections[2].code} kicker="TECH STACK" title="ARSENAL" align="right" />

        <p data-reveal className="mb-8 max-w-2xl border-l-4 border-blood bg-void/70 py-2 pl-4 text-sm text-ash md:text-base">
          Toolkit yang pernah gue pelajari dan pakai buat eksperimen &amp; bikin project. Bukan klaim expert di semuanya — masih terus belajar,
          satu teknologi demi satu teknologi.
        </p>

        <div role="tablist" aria-label="Kategori teknologi" onKeyDown={onKey} className="no-scrollbar -mx-5 mb-8 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:px-0">
          {techCategories.map((c, i) => {
            const on = i === active;
            return (
              <button
                key={c.id}
                id={`tab-${c.id}`}
                role="tab"
                type="button"
                aria-selected={on}
                aria-controls="tech-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => select(i)}
                onMouseEnter={() => play("hover")}
                className={`relative shrink-0 -skew-x-12 border-2 px-5 py-2.5 font-display text-base tracking-[0.12em] transition-colors md:text-lg ${
                  on ? "border-blood bg-blood text-paper" : "border-paper/30 bg-void/80 text-ash hover:border-paper hover:text-paper"
                }`}
              >
                <span className="inline-flex skew-x-12 items-center gap-2">
                  <span className="font-mono text-[10px]">{String(i + 1).padStart(2, "0")}</span>
                  {c.label}
                  <span className="font-mono text-[10px] opacity-70">[{c.items.length}]</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="t-stage relative">
          <div className="mb-5 flex items-end justify-between gap-4">
            <AnimatePresence mode="wait">
              <motion.h3
                key={cat.id}
                initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}
                animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
                exit={{ clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" }}
                transition={{ duration: 0.4, ease: [0.7, 0, 0.2, 1] }}
                className="font-display text-[clamp(2rem,6vw,4.5rem)] leading-none text-blood"
              >
                {cat.label}
              </motion.h3>
            </AnimatePresence>
            <p className="font-mono text-xs tracking-[0.3em] text-ash">
              {String(active + 1).padStart(2, "0")} / {String(techCategories.length).padStart(2, "0")}
            </p>
          </div>

          <div id="tech-panel" role="tabpanel" aria-labelledby={`tab-${cat.id}`}>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
              <AnimatePresence mode="wait">
                {cat.items.map((t, i) => (
                  <TechCard key={`${cat.id}-${t.name}`} tech={t} index={i} category={cat.label} />
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
