import { motion } from "framer-motion";
import { CupSoda, Gamepad2, Soup } from "lucide-react";
import type { ComponentType } from "react";
import { profile, sections } from "../../config/site";
import { SectionHeading } from "../ui/SectionHeading";
import { play } from "../../lib/sound";

/** Original geometric web glyph (not character artwork). */
type IconProps = { className?: string; strokeWidth?: number };

function WebGlyph(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" className={props.className} aria-hidden="true">
      <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" />
      <path d="M12 6.5 15.9 8.1 17.5 12 15.9 15.9 12 17.5 8.1 15.9 6.5 12 8.1 8.1Z" />
      <path d="M12 3.2 18.2 5.8 20.8 12 18.2 18.2 12 20.8 5.8 18.2 3.2 12 5.8 5.8Z" />
    </svg>
  );
}

type Card = { label: string; value: string; quote: string; Icon: ComponentType<IconProps>; tone: "red" | "white" | "black"; span: string; tilt: number };

const cards: Card[] = [
  { label: "FAVORITE FOOD", value: profile.favoriteFood, quote: "MAKANAN FAVORIT.", Icon: Soup, tone: "red", span: "md:col-span-7", tilt: -2 },
  { label: "FAVORITE DRINK", value: profile.favoriteDrink, quote: "MINUMAN FAVORIT.", Icon: CupSoda, tone: "white", span: "md:col-span-5", tilt: 2.5 },
  { label: "FAVORITE CHARACTER", value: profile.favoriteCharacter, quote: "KARAKTER FAVORIT.", Icon: WebGlyph, tone: "black", span: "md:col-span-5", tilt: 1.5 },
  { label: "GAME", value: "MOBILE LEGENDS", quote: "RANK: IMMORTAL.", Icon: Gamepad2, tone: "red", span: "md:col-span-7", tilt: -1.5 },
];

const tones = {
  red: "bg-blood text-paper",
  white: "bg-paper text-void",
  black: "bg-void text-paper border-2 border-blood",
};

export function Personality({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section id="personality" aria-labelledby="personality-title" className="relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <SectionHeading id="personality-title" code={sections[5].code} kicker="PERSONALITY" title={<>OFF THE<br className="md:hidden" /> GRID</>} />

        <ul className="grid gap-5 md:grid-cols-12 md:gap-6 [perspective:1400px]">
          {cards.map((c, i) => (
            <motion.li
              key={c.label}
              className={c.span}
              initial={reducedMotion ? false : { opacity: 0, rotateX: -45, rotateY: i % 2 ? 25 : -25, y: 80 }}
              whileInView={{ opacity: 1, rotateX: 0, rotateY: 0, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.7, delay: (i % 2) * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.article
                whileHover={reducedMotion ? undefined : { rotate: 0, scale: 1.02, rotateY: i % 2 ? -6 : 6 }}
                onHoverStart={() => play("hover")}
                style={{ rotate: c.tilt }}
                className={`group relative h-full min-h-[260px] overflow-hidden p-6 shadow-[10px_10px_0_#030303] md:min-h-[300px] md:p-8 ${tones[c.tone]} ${
                  i % 2 ? "clip-panel-r" : "clip-panel"
                }`}
              >
                <div className={`halftone pointer-events-none absolute inset-0 ${c.tone === "white" ? "text-blood/25" : "text-void/30"} halftone-fade`} aria-hidden="true" />
                <c.Icon
                  className={`pointer-events-none absolute -bottom-6 -right-6 h-48 w-48 opacity-20 transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110 md:h-60 md:w-60`}
                  strokeWidth={1.2}
                />
                <div className="relative flex h-full flex-col">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-12 w-12 items-center justify-center -skew-x-12 ${c.tone === "white" ? "bg-void text-paper" : "bg-paper text-void"}`}>
                      <c.Icon className="h-6 w-6 skew-x-12" strokeWidth={2} />
                    </span>
                    <p className="font-mono text-xs font-bold tracking-[0.3em]">{c.label}</p>
                  </div>
                  <h3 className="mt-auto pt-10 font-display text-[clamp(3rem,8vw,6rem)] uppercase leading-[0.85] -skew-x-6">{c.value}</h3>
                  {/* comic speech caption */}
                  <p
                    className={`mt-4 self-start -rotate-2 border-2 px-3 py-1 font-display text-sm tracking-[0.12em] md:text-base ${
                      c.tone === "white" ? "border-void bg-blood text-paper" : "border-void bg-paper text-void"
                    }`}
                  >
                    {c.quote}
                  </p>
                </div>
              </motion.article>
            </motion.li>
          ))}
        </ul>
        <p className="mt-10 font-mono text-[11px] tracking-[0.2em] text-ash" data-reveal>
          * Spider-Man adalah karakter favorit, bukan maskot situs ini. Semua grafis di sini adalah desain orisinal LEOVAN.
        </p>
      </div>
    </section>
  );
}
