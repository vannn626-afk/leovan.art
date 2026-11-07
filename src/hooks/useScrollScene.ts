import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sceneState, SECTION_COUNT } from "../lib/sceneStore";
import { sections } from "../config/site";

gsap.registerPlugin(ScrollTrigger);

/**
 * Maps page scroll to a continuous section index for the 3D scene.
 * Each section "anchors" at its vertical center so the scene holds a
 * composition while a section is on screen and transitions between them.
 * Works identically scrolling down and up.
 */
export function useScrollScene() {
  useEffect(() => {
    let anchors: number[] = [];

    const measure = () => {
      const maxMid = document.documentElement.scrollHeight - window.innerHeight / 2;
      anchors = sections.map(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        const top = r.top + window.scrollY;
        return Math.min(top + r.height / 2, maxMid);
      });
      anchors[0] = window.innerHeight / 2;
    };

    const update = () => {
      if (!anchors.length) measure();
      const mid = window.scrollY + window.innerHeight / 2;
      let value = 0;
      if (mid >= anchors[anchors.length - 1]) value = SECTION_COUNT - 1;
      else {
        for (let i = 0; i < anchors.length - 1; i++) {
          if (mid < anchors[i + 1]) {
            const span = Math.max(1, anchors[i + 1] - anchors[i]);
            value = i + Math.max(0, (mid - anchors[i]) / span);
            break;
          }
        }
      }
      sceneState.section = value;
    };

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        sceneState.velocity = Math.min(1, Math.abs(self.getVelocity()) / 4000);
        update();
      },
      onRefresh: () => {
        measure();
        update();
      },
    });

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      sceneState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const ro = new ResizeObserver(() => ScrollTrigger.refresh());
    ro.observe(document.body);

    window.addEventListener("pointermove", onPointer, { passive: true });
    measure();
    update();
    return () => {
      st.kill();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);
}
