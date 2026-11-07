import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { sceneState } from "../lib/sceneStore";
import { deviceTier } from "../lib/webgl";
import { currentKey } from "./keyframes";
import { LVMonogram } from "./LVMonogram";
import { Floor, MovingLights, Particles, Shards, Structures } from "./Atmosphere";
import { ComicBursts, ImmortalText, ProjectFrames, Signature, TechCarousel } from "./SectionObjects";

type Props = { isMobile: boolean; reducedMotion: boolean; onContextLost: () => void };

/** Scroll + pointer + intro driven camera. */
function CameraRig({ isMobile }: { isMobile: boolean }) {
  const camera = useThree((s) => s.camera);
  const look = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    const k = currentKey(isMobile);
    const p = sceneState.pointer;
    const intro = sceneState.intro;
    const pull = (1 - intro) * 9; // intro: camera approaches from far away
    const px = isMobile ? 0 : p.x * 0.45;
    const py = isMobile ? 0 : p.y * 0.3;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, k.cam[0] + px, 2.5, d);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, k.cam[1] + py, 2.5, d);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, k.cam[2] + pull, intro < 1 ? 5 : 2.5, d);
    look.x = THREE.MathUtils.damp(look.x, k.look[0], 2.5, d);
    look.y = THREE.MathUtils.damp(look.y, k.look[1], 2.5, d);
    look.z = THREE.MathUtils.damp(look.z, k.look[2], 2.5, d);
    camera.lookAt(look);
    // Slight dutch angle that follows the pointer — cinematic tilt
    camera.rotation.z += (isMobile ? 0 : -p.x * 0.03) - Math.sin(sceneState.section * 1.3) * 0.015;
  });
  return null;
}

function Scene({ isMobile, reducedMotion, shadows }: { isMobile: boolean; reducedMotion: boolean; shadows: boolean }) {
  const tier = useMemo(() => deviceTier(), []);
  const particleCount = tier === "low" ? 120 : isMobile ? 180 : 420;
  const shardCount = tier === "low" ? 14 : isMobile ? 20 : 42;

  return (
    <>
      <color attach="background" args={["#060606"]} />
      <fog attach="fog" args={["#060606", 8, 22]} />
      <ambientLight intensity={0.12} />
      <directionalLight
        position={[-4, 6, 5]}
        intensity={2.2}
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0005}
      />
      <spotLight position={[6, 2, -3]} angle={0.6} penumbra={0.8} intensity={60} color="#e60023" distance={16} />
      <pointLight position={[-6, -1, -2]} intensity={30} color="#e60023" distance={12} />
      <MovingLights reducedMotion={reducedMotion} />

      {/* Local studio reflections: no network HDR, rendered once */}
      <Environment resolution={isMobile ? 64 : 128} frames={1}>
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 4, 3]} scale={[8, 0.5, 1]} />
        <Lightformer form="rect" intensity={2} color="#ffffff" position={[-4, 0, 4]} rotation={[0, 0.8, 0]} scale={[0.3, 6, 1]} />
        <Lightformer form="rect" intensity={6} color="#e60023" position={[4, -1, 2]} rotation={[0, -0.9, 0]} scale={[1, 8, 1]} />
        <Lightformer form="rect" intensity={4} color="#e60023" position={[0, -3, -4]} scale={[10, 1, 1]} />
      </Environment>

      <CameraRig isMobile={isMobile} />
      <LVMonogram isMobile={isMobile} reducedMotion={reducedMotion} castShadow={shadows} />
      <Structures reducedMotion={reducedMotion} />
      <Shards count={shardCount} reducedMotion={reducedMotion} />
      <Particles count={particleCount} reducedMotion={reducedMotion} />
      <Floor receiveShadow={shadows} />

      <TechCarousel isMobile={isMobile} reducedMotion={reducedMotion} />
      <ProjectFrames isMobile={isMobile} reducedMotion={reducedMotion} />
      <Suspense fallback={null}>
        <ImmortalText isMobile={isMobile} reducedMotion={reducedMotion} />
        <Signature isMobile={isMobile} reducedMotion={reducedMotion} />
      </Suspense>
      <ComicBursts isMobile={isMobile} reducedMotion={reducedMotion} />
    </>
  );
}

export default function Experience({ isMobile, reducedMotion, onContextLost }: Props) {
  const tier = useMemo(() => deviceTier(), []);
  const maxDpr = tier === "high" ? 1.75 : tier === "mid" ? 1.4 : 1;
  const [dpr, setDpr] = useState(maxDpr);
  const [visible, setVisible] = useState(() => !document.hidden);
  const shadows = tier === "high" && !isMobile;

  // Pause rendering completely when the tab is hidden
  useEffect(() => {
    const on = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", on);
    return () => document.removeEventListener("visibilitychange", on);
  }, []);

  return (
    <Canvas
      frameloop={visible ? "always" : "never"}
      dpr={dpr}
      shadows={shadows}
      camera={{ position: [0, 0, 16], fov: isMobile ? 55 : 42, near: 0.1, far: 60 }}
      gl={{ antialias: tier !== "low", powerPreference: "high-performance", alpha: false, stencil: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onContextLost();
        });
      }}
      aria-hidden="true"
    >
      <PerformanceMonitor
        onDecline={() => setDpr((d) => Math.max(0.75, d - 0.35))}
        onIncline={() => setDpr((d) => Math.min(maxDpr, d + 0.2))}
        flipflops={3}
        onFallback={() => setDpr(0.75)}
      >
        <Suspense fallback={null}>
          <Scene isMobile={isMobile} reducedMotion={reducedMotion} shadows={shadows} />
        </Suspense>
      </PerformanceMonitor>
    </Canvas>
  );
}
