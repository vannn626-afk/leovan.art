import { useCallback, useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Backdrop } from "./components/Backdrop";
import { Intro } from "./components/Intro";
import { Nav } from "./components/Nav";
import { PersonaNowPlaying } from "./components/AudioPlayer";
import { Hero } from "./components/sections/Hero";
import { About } from "./components/sections/About";
import { TechStack } from "./components/sections/TechStack";
import { Projects } from "./components/sections/Projects";
import { Achievements } from "./components/sections/Achievements";
import { Personality } from "./components/sections/Personality";
import { Contact } from "./components/sections/Contact";
import { useIsMobile, useReducedMotion } from "./hooks/useMedia";
import { useScrollScene } from "./hooks/useScrollScene";
import { useReveal } from "./hooks/useReveal";
import { useActiveSection } from "./hooks/useActiveSection";
import { sceneState } from "./lib/sceneStore";

export default function App() {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [introDone, setIntroDone] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const onReveal = useCallback(() => setRevealed(true), []);

  useScrollScene();
  useReveal(!reducedMotion);
  const active = useActiveSection();

  const onIntroDone = useCallback(() => {
    sceneState.intro = 1;
    setRevealed(true);
    setIntroDone(true);
    document.documentElement.classList.remove("intro-lock");
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  // Deep links (e.g. /#projects) skip straight to content
  useEffect(() => {
    if (window.location.hash && window.location.hash !== "#home") onIntroDone();
  }, [onIntroDone]);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-blood focus:px-4 focus:py-2">
        Lewati ke konten
      </a>
      <Backdrop isMobile={isMobile} reducedMotion={reducedMotion} />
      {!introDone && <Intro onDone={onIntroDone} onReveal={onReveal} reducedMotion={reducedMotion} />}
      <Nav active={active} />
      <PersonaNowPlaying />
      <main id="main" className="relative z-10 overflow-x-clip">
        <Hero ready={revealed} reducedMotion={reducedMotion} />
        <About reducedMotion={reducedMotion} />
        <TechStack reducedMotion={reducedMotion} />
        <Projects reducedMotion={reducedMotion} />
        <Achievements reducedMotion={reducedMotion} />
        <Personality reducedMotion={reducedMotion} />
        <Contact />
      </main>
    </>
  );
}
