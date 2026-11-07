import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { contact, profile, sections } from "../../config/site";
import { SectionHeading } from "../ui/SectionHeading";
import { BrandSvg } from "../ui/BrandIcon";
import { LVMark } from "../ui/Logo";
import { play } from "../../lib/sound";

async function copyText(text: string) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

export function Contact() {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onCopy = async () => {
    const ok = await copyText(contact.email);
    setStatus(ok ? "copied" : "error");
    play(ok ? "success" : "click");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus("idle"), 2600);
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden pb-16 pt-28 md:pt-40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-to-b from-transparent via-void/40 to-void" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1500px] px-5 md:px-10">
        <SectionHeading id="contact-title" code={sections[6].code} kicker="CONTACT / THE CONNECTION" title={<>LET'S CREATE<br /> SOMETHING.</>} />
        <p className="-mt-4 mb-12 max-w-xl text-lg text-paper/85 md:text-xl" data-reveal>
          Got an idea? Let's turn it into something real.
        </p>

        <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          {/* Email card */}
          <div className="clip-notch relative bg-paper p-[3px]" data-reveal="left">
            <div className="clip-notch relative h-full overflow-hidden bg-void p-6 md:p-10">
              <div className="halftone halftone-fade pointer-events-none absolute inset-0 text-blood/30" aria-hidden="true" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blood" aria-hidden="true" />
                  <p className="font-mono text-xs font-bold tracking-[0.35em]">EMAIL</p>
                </div>
                <a
                  href={`mailto:${contact.email}`}
                  onMouseEnter={() => play("hover")}
                  onClick={() => play("click")}
                  className="group mt-5 block break-all font-display text-[clamp(1.7rem,5.4vw,4rem)] leading-none transition-colors hover:text-blood"
                >
                  {contact.email}
                  <span className="mt-2 block h-1 w-0 bg-blood transition-all duration-500 group-hover:w-full" aria-hidden="true" />
                </a>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a href={`mailto:${contact.email}`} className="btn-p5" onMouseEnter={() => play("hover")} onClick={() => play("click")}>
                    KIRIM EMAIL <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                  </a>
                  <button type="button" onClick={onCopy} onMouseEnter={() => play("hover")} className="btn-p5 btn-ghost" aria-label="Salin alamat email">
                    <span className="inline-flex items-center gap-3">
                      {status === "copied" ? <Check className="h-5 w-5" aria-hidden="true" /> : <Copy className="h-5 w-5" aria-hidden="true" />}
                      {status === "copied" ? "TERSALIN" : "COPY EMAIL"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Social channels — only configured, real links render */}
          <ul className="flex flex-col gap-5">
            {contact.socials.map((s, i) => (
              <li key={s.id} className="flex-1" data-reveal="right" style={{ ["--d" as string]: `${i * 0.1}s` }}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => play("hover")}
                  onClick={() => play("click")}
                  aria-label={`${s.action} — ${s.label} (tab baru)`}
                  className="group relative flex h-full min-h-[150px] items-center gap-5 overflow-hidden border-2 border-paper/80 bg-void/80 p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:-rotate-1 hover:border-blood md:p-8"
                >
                  <span className="absolute inset-0 origin-left -skew-x-12 scale-x-0 bg-blood transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-x-125" aria-hidden="true" />
                  <span className="relative flex h-16 w-16 shrink-0 -skew-x-12 items-center justify-center bg-paper text-void transition-colors group-hover:bg-void group-hover:text-paper">
                    <BrandSvg icon={s.icon} className="h-8 w-8 skew-x-12 transition-transform duration-300 group-hover:scale-110" />
                  </span>
                  <span className="relative min-w-0">
                    <span className="block font-mono text-[10px] font-bold tracking-[0.3em] text-ash group-hover:text-paper">{s.label}</span>
                    <span className="mt-1 block font-display text-3xl leading-none md:text-4xl">{s.action}</span>
                    <span className="mt-2 block truncate font-mono text-xs text-ash group-hover:text-paper">{s.handle}</span>
                  </span>
                  <ArrowUpRight className="relative ml-auto h-7 w-7 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Final signature (DOM layer above the 3D LEOVAN signature) */}
        <footer className="mt-32 border-t-2 border-blood pt-10 md:mt-48">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <div>
              <LVMark className="h-16 w-auto" />
              <p className="mt-4 font-display text-[clamp(3rem,12vw,9rem)] leading-[0.8] -skew-x-6">
                LEO<span className="text-blood">VAN</span>
              </p>
              <p className="mt-3 font-mono text-xs tracking-[0.35em] text-ash">{profile.secondaryTagline}</p>
            </div>
            <div className="font-mono text-[11px] tracking-[0.25em] text-ash md:text-right">
              <p>{profile.identity.toUpperCase()}</p>
              <p className="mt-1">SUKAGUMIWANG, INDRAMAYU — INDONESIA</p>
              <p className="mt-4 text-paper">&copy; {new Date().getFullYear()} LEOVAN. ALL ORIGINAL DESIGN.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Copy feedback toast */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4" aria-live="polite">
        <AnimatePresence>
          {status !== "idle" && (
            <motion.div
              initial={{ y: 60, opacity: 0, skewX: -20 }}
              animate={{ y: 0, opacity: 1, skewX: -12 }}
              exit={{ y: 60, opacity: 0, skewX: -20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={`flex items-center gap-3 border-2 border-void px-6 py-3 font-display text-lg tracking-[0.12em] shadow-[6px_6px_0_#030303] ${
                status === "copied" ? "bg-blood text-paper" : "bg-paper text-void"
              }`}
              role="status"
            >
              <span className="inline-flex skew-x-12 items-center gap-3">
                {status === "copied" ? <Check className="h-5 w-5" aria-hidden="true" /> : <Copy className="h-5 w-5" aria-hidden="true" />}
                {status === "copied" ? "EMAIL TERSALIN KE CLIPBOARD" : `GAGAL MENYALIN — ${contact.email}`}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
