import { useEffect } from "react";

/**
 * IntersectionObserver-driven reveals for every [data-reveal] element.
 * The hidden initial state only exists once `anim-ready` is set on <html>,
 * so content always remains visible if this never runs. Elements re-animate
 * when scrolled back into view from either direction.
 */
export function useReveal(enabled: boolean) {
  useEffect(() => {
    const root = document.documentElement;
    if (!enabled || !("IntersectionObserver" in window)) {
      root.classList.remove("anim-ready");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("is-in");
          else e.target.classList.remove("is-in"); // re-animates in both scroll directions
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    const observeAll = () => document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    observeAll();
    root.classList.add("anim-ready");

    // Pick up elements rendered later (e.g. tab switches)
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    // Failsafe: anything already on screen after 2.5s is forced visible
    const failsafe = window.setTimeout(() => {
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("is-in");
      });
    }, 2500);

    return () => {
      io.disconnect();
      mo.disconnect();
      window.clearTimeout(failsafe);
      root.classList.remove("anim-ready");
    };
  }, [enabled]);
}
