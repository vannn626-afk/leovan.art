import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cpu, FolderOpen, Home, Mail, Menu, Trophy, User, Volume2, VolumeX, X, type LucideIcon } from "lucide-react";
import { sections, type SectionId } from "../config/site";
import { Wordmark } from "./ui/Logo";
import { play } from "../lib/sound";
import { useSound } from "../hooks/useSound";

const icons: Partial<Record<SectionId, LucideIcon>> = {
  home: Home,
  about: User,
  tech: Cpu,
  projects: FolderOpen,
  achievements: Trophy,
  contact: Mail,
};

const navItems = sections.filter((s) => !("hiddenInNav" in s && s.hiddenInNav));

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

function SoundToggle({ compact = false }: { compact?: boolean }) {
  const [on, setOn] = useSound();
  const Icon = on ? Volume2 : VolumeX;
  return (
    <button
      type="button"
      onClick={() => setOn(!on)}
      aria-pressed={on}
      aria-label={on ? "Matikan efek suara" : "Nyalakan efek suara"}
      className={`clip-tag group inline-flex items-center gap-2 px-3 py-2 font-mono text-[10px] font-bold tracking-[0.25em] transition-colors ${
        on ? "bg-blood text-paper" : "bg-white/10 text-ash hover:bg-paper hover:text-void"
      }`}
    >
      <Icon className="h-4 w-4 transition-transform group-hover:scale-110" aria-hidden="true" />
      {!compact && <span>SFX {on ? "ON" : "OFF"}</span>}
    </button>
  );
}

export function Nav({ active }: { active: SectionId }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-lock", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => {
    play("click");
    setOpen(false);
    // let the overlay close before scrolling on mobile
    window.setTimeout(() => scrollToSection(id), open ? 280 : 0);
  };

  // Personality section lives between achievements and contact; keep ACHIEVEMENTS lit there.
  const activeNav: SectionId = active === "personality" ? "achievements" : active;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled ? "bg-void/90 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <div className="relative mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 md:h-20 md:px-8">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              go("home");
            }}
            className="relative z-10"
            aria-label="LEOVAN — kembali ke atas"
          >
            <Wordmark />
          </a>

          <nav aria-label="Navigasi utama" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems.map((s) => {
                const Icon = icons[s.id]!;
                const isActive = activeNav === s.id;
                return (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        go(s.id);
                      }}
                      onMouseEnter={() => play("hover")}
                      aria-current={isActive ? "true" : undefined}
                      className={`group relative flex -skew-x-12 items-center gap-2 px-4 py-2.5 font-display text-[15px] tracking-[0.12em] transition-colors ${
                        isActive ? "text-paper" : "text-ash hover:text-void"
                      }`}
                    >
                      <span
                        className={`absolute inset-0 -z-0 origin-left transition-transform duration-300 ease-[cubic-bezier(.7,0,.2,1)] ${
                          isActive ? "scale-x-100 bg-blood" : "scale-x-0 bg-paper group-hover:scale-x-100"
                        }`}
                        aria-hidden="true"
                      />
                      <span className="relative flex skew-x-12 items-center gap-2">
                        <Icon className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-125" aria-hidden="true" />
                        {s.label}
                      </span>
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute -bottom-2 left-2 right-2 h-1 bg-paper"
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <SoundToggle compact />
            <button
              type="button"
              className="clip-tag inline-flex h-11 w-14 items-center justify-center bg-blood text-paper lg:hidden"
              onClick={() => {
                play("click");
                setOpen(true);
              }}
              aria-label="Buka menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className={`h-[3px] origin-left bg-blood transition-transform duration-500 ${scrolled ? "scale-x-100" : "scale-x-0"}`} />
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu navigasi"
            className="fixed inset-0 z-[60] overflow-hidden lg:hidden"
            initial="closed"
            animate="open"
            exit="closed"
          >
            <motion.div
              className="absolute inset-0 bg-blood"
              variants={{
                closed: { clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" },
                open: { clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)" },
              }}
              transition={{ duration: 0.4, ease: [0.7, 0, 0.2, 1] }}
            >
              <div className="halftone absolute inset-0 text-crimson" />
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-void"
              variants={{
                closed: { clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" },
                open: { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 82%)" },
              }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.7, 0, 0.2, 1] }}
            />

            <div className="relative flex h-full flex-col px-6 pb-10 pt-5">
              <div className="flex items-center justify-between">
                <Wordmark />
                <button
                  type="button"
                  onClick={() => {
                    play("click");
                    setOpen(false);
                  }}
                  className="clip-tag inline-flex h-11 w-14 items-center justify-center bg-paper text-void"
                  aria-label="Tutup menu"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <ul className="mt-10 flex flex-1 flex-col justify-center gap-2">
                {navItems.map((s, i) => {
                  const Icon = icons[s.id]!;
                  const isActive = activeNav === s.id;
                  return (
                    <motion.li
                      key={s.id}
                      variants={{
                        closed: { x: -80, opacity: 0, skewX: -20 },
                        open: { x: 0, opacity: 1, skewX: -8 },
                      }}
                      transition={{ delay: 0.15 + i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <a
                        href={`#${s.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          go(s.id);
                        }}
                        className={`flex items-center gap-4 px-4 py-3 font-display text-[clamp(2.2rem,10vw,3.5rem)] leading-none ${
                          isActive ? "bg-blood text-paper" : "text-paper active:bg-paper active:text-void"
                        }`}
                      >
                        <span className="font-mono text-xs text-ash">{s.code}</span>
                        <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                        {s.label}
                      </a>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div
                className="flex items-center justify-between"
                variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
                transition={{ delay: 0.5 }}
              >
                <p className="font-mono text-[10px] tracking-[0.3em] text-ash">FROM CURIOSITY TO CREATION.</p>
                <SoundToggle />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
