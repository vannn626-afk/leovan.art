import { useEffect, useState } from "react";
import { sections, type SectionId } from "../config/site";
import { play } from "../lib/sound";

/** Tracks which section occupies the viewport center (for nav + transition sound). */
export function useActiveSection() {
  const [active, setActive] = useState<SectionId>("home");
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    let current: string = "home";
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.target.id !== current) {
            current = e.target.id;
            setActive(current as SectionId);
            play("transition");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return active;
}
