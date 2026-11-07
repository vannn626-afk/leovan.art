import { useLayoutEffect, useRef, type PointerEvent } from "react";
import { gsap } from "gsap";
import { ArrowUpRight, Globe, Layers } from "lucide-react";
import { projects, sections } from "../../config/site";
import { SectionHeading } from "../ui/SectionHeading";
import { LVMark } from "../ui/Logo";
import { play } from "../../lib/sound";

type Project = (typeof projects)[number];

/** Layered, perspective "preview" — an abstract composition, not a screenshot. */
function FloatingPreview({ project, flip }: { project: Project; flip: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(ref.current, { rotateY: x * 26 + (flip ? 10 : -10), rotateX: -y * 18 + 6, duration: 0.6, ease: "power3.out" });
  };
  const reset = () => ref.current && gsap.to(ref.current, { rotateY: flip ? 10 : -10, rotateX: 6, duration: 0.8, ease: "power3.out" });

  return (
    <div className="p-preview-wrap [perspective:1100px]" onPointerMove={onMove} onPointerLeave={reset} aria-hidden="true">
      <div
        ref={ref}
        className="relative mx-auto aspect-[4/3] w-full max-w-[560px] [transform-style:preserve-3d]"
        style={{ transform: `rotateY(${flip ? 10 : -10}deg) rotateX(6deg)` }}
      >
        {/* back plate */}
        <div className="absolute inset-0 bg-blood [transform:translateZ(-60px)_rotate(-4deg)]">
          <div className="halftone absolute inset-0 text-void/40" />
        </div>
        {/* window frame */}
        <div className="absolute inset-[6%] flex flex-col border-2 border-paper bg-void [transform:translateZ(0px)]">
          <div className="flex items-center gap-2 border-b-2 border-paper/80 bg-paper px-3 py-1.5 text-void">
            <span className="h-2.5 w-2.5 bg-blood" />
            <span className="h-2.5 w-2.5 bg-void" />
            <span className="h-2.5 w-2.5 bg-ash" />
            <span className="ml-3 flex items-center gap-1.5 truncate font-mono text-[10px] font-bold tracking-wider md:text-xs">
              <Globe className="h-3 w-3" /> {project.domain}
            </span>
          </div>
          <div className="relative flex flex-1 items-center justify-center overflow-hidden">
            <div className="stripes absolute inset-0" />
            <p className="relative font-display text-[clamp(3rem,9vw,7rem)] leading-none text-paper [text-shadow:6px_6px_0_#E60023]">{project.codename}</p>
          </div>
        </div>
        {/* floating chips at different depths */}
        {project.features.map((f, i) => (
          <div
            key={f}
            className="absolute flex items-center gap-2 border-2 border-void bg-paper px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider text-void shadow-[5px_5px_0_#030303] md:text-xs"
            style={{
              left: flip ? undefined : `${1 + i * 5}%`,
              right: flip ? `${1 + i * 5}%` : undefined,
              top: `${18 + i * 24}%`,
              transform: `translateZ(${70 + i * 30}px) rotate(${i % 2 ? 3 : -4}deg)`,
            }}
          >
            <Layers className="h-3 w-3 text-blood" /> {f}
          </div>
        ))}
        <div className="absolute -bottom-4 right-6 [transform:translateZ(110px)]">
          <LVMark className="h-14 w-auto drop-shadow-[4px_4px_0_#030303]" />
        </div>
      </div>
    </div>
  );
}

function ProjectPanel({ project, index }: { project: Project; index: number }) {
  const flip = index % 2 === 1;
  const [brand, name] = project.name.split("|").map((s) => s.trim());
  return (
    <article
      className={`p-panel relative ${flip ? "clip-panel-r" : "clip-panel"} bg-gradient-to-br ${
        flip ? "from-void via-ink to-crimson/40" : "from-crimson/40 via-ink to-void"
      } border-y-2 border-blood/0 px-5 py-14 md:px-12 md:py-20`}
      aria-labelledby={`project-${project.number}`}
    >
      <span
        className={`p-num pointer-events-none absolute top-0 font-display text-[44vw] leading-none text-stroke-red opacity-40 md:text-[24vw] ${flip ? "left-2" : "right-2"}`}
        aria-hidden="true"
      >
        {project.number}
      </span>

      <div className={`relative grid items-center gap-12 lg:grid-cols-2 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <div>
          <div className="flex flex-wrap items-center gap-3" data-reveal="left">
            <span className="font-display text-5xl text-blood md:text-6xl">{project.number}</span>
            <span className="clip-tag bg-paper px-3 py-1 font-mono text-[10px] font-bold tracking-[0.3em] text-void md:text-xs">{project.category}</span>
          </div>
          <h3 id={`project-${project.number}`} className="mt-4 font-display text-[clamp(3rem,9vw,7.5rem)] uppercase leading-[0.85] -skew-x-6" data-reveal="slash">
            {brand} <span className="text-blood">|</span>
            <br />
            <span className="bg-blood px-3 text-paper">{name}</span>
          </h3>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-paper/85 md:text-lg" data-reveal style={{ ["--d" as string]: "0.1s" }}>
            {project.description}
          </p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Fitur">
            {project.features.map((f, i) => (
              <li
                key={f}
                data-reveal="pop"
                style={{ ["--d" as string]: `${0.15 + i * 0.06}s` }}
                className="-skew-x-12 border-2 border-paper/70 bg-void/60 px-3 py-1.5 font-mono text-xs font-bold tracking-[0.15em]"
              >
                <span className="inline-block skew-x-12">{f.toUpperCase()}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-5" data-reveal style={{ ["--d" as string]: "0.25s" }}>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-p5"
              onMouseEnter={() => play("hover")}
              onClick={() => play("click")}
              aria-label={`Explore project ${project.name} (tab baru)`}
            >
              EXPLORE PROJECT <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </a>
            <span className="font-mono text-xs tracking-[0.2em] text-ash">{project.domain}</span>
          </div>
        </div>
        <FloatingPreview project={project} flip={flip} />
      </div>
    </article>
  );
}

export function Projects({ reducedMotion }: { reducedMotion: boolean }) {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (reducedMotion || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".p-panel").forEach((panel, i) => {
        const dir = i % 2 ? 1 : -1;
        gsap.fromTo(
          panel,
          { xPercent: dir * 14, rotate: dir * -3, autoAlpha: 0.2 },
          { xPercent: 0, rotate: 0, autoAlpha: 1, ease: "power3.out", scrollTrigger: { trigger: panel, start: "top 95%", end: "top 45%", scrub: 0.7 } },
        );
        const num = panel.querySelector(".p-num");
        if (num)
          gsap.fromTo(num, { yPercent: 30 }, { yPercent: -25, ease: "none", scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true } });
        const prev = panel.querySelector(".p-preview-wrap");
        if (prev)
          gsap.fromTo(
            prev,
            { y: 120, rotateZ: dir * 6, scale: 0.85 },
            { y: -30, rotateZ: 0, scale: 1, ease: "none", scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom 30%", scrub: 0.6 } },
          );
      });
    }, root);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={root} id="projects" aria-labelledby="projects-title" className="relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <SectionHeading id="projects-title" code={sections[3].code} kicker="PROJECTS / THE PHANTOM ARCHIVE" title={<>PHANTOM<br /> ARCHIVE</>} />
      </div>
      <div className="mx-auto flex max-w-[1600px] flex-col gap-16 md:gap-24 md:px-4">
        {projects.map((p, i) => (
          <ProjectPanel key={p.number} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
