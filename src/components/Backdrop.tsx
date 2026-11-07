import { Component, lazy, Suspense, useState, type ReactNode } from "react";
import { hasWebGL } from "../lib/webgl";
import { LVMark } from "./ui/Logo";

const Experience = lazy(() => import("../three/Experience"));

/** Static visual used while 3D loads, when WebGL is missing, or if the scene crashes. */
export function StaticBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-ink" aria-hidden="true">
      <div className="absolute -left-[10%] top-[10%] h-[50%] w-[80%] -skew-x-[22deg] bg-gradient-to-r from-crimson/60 to-transparent" />
      <div className="halftone halftone-fade absolute inset-0 text-blood/20" />
      <div className="absolute right-[6%] top-[22%] w-[38vw] max-w-[460px] opacity-80 drop-shadow-[18px_18px_0_#990019] max-md:left-1/2 max-md:top-[12%] max-md:w-[46vw] max-md:-translate-x-1/2 max-md:opacity-30">
        <LVMark className="h-auto w-full" lColor="#151515" vColor="#E60023" />
      </div>
      <div className="absolute bottom-[18%] left-0 h-2 w-[70%] -rotate-6 bg-blood/70" />
    </div>
  );
}

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[LEOVAN] 3D scene disabled:", error);
    this.props.onError();
  }
  render() {
    return this.state.failed ? <StaticBackdrop /> : this.props.children;
  }
}

export function Backdrop({ isMobile, reducedMotion }: { isMobile: boolean; reducedMotion: boolean }) {
  const [enabled, setEnabled] = useState(() => hasWebGL());
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      {enabled ? (
        <SceneBoundary onError={() => setEnabled(false)}>
          <Suspense fallback={<StaticBackdrop />}>
            <Experience isMobile={isMobile} reducedMotion={reducedMotion} onContextLost={() => setEnabled(false)} />
          </Suspense>
        </SceneBoundary>
      ) : (
        <StaticBackdrop />
      )}
      {/* Vignette + grain to keep text readable over the scene */}
      <div className="grain absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(3,3,3,0.75)_100%)]" />
    </div>
  );
}
