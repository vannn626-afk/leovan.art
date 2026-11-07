import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Center, Edges, Text3D, type Text3DProps } from "@react-three/drei";
import * as THREE from "three";
import helvetiker from "./fonts/helvetiker_bold.typeface.json";
import { carouselIcons, type BrandIcon } from "../config/site";
import { sectionWeight } from "../lib/sceneStore";

type Common = { reducedMotion: boolean; isMobile: boolean };
type FontProp = Text3DProps["font"];
const FONT = helvetiker as unknown as FontProp;

/** Hides a group entirely when its section weight is ~0 (saves draw calls). */
function applyWeight(g: THREE.Group, w: number, base = 1) {
  g.visible = w > 0.01;
  g.scale.setScalar(Math.max(0.0001, w) * base);
}

/* ------------------------------------------------------------------ */
/* TECH: rotating ring of 3D panels textured with official logos       */
/* ------------------------------------------------------------------ */
function makePanelTexture(icon: BrandIcon) {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, size, size);
  // Red angular corner + stripe
  ctx.fillStyle = "#e60023";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(90, 0);
  ctx.lineTo(0, 70);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(0, size - 14, size, 14);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 4;
  ctx.strokeRect(6, 6, size - 12, size - 12);
  // Official icon path
  ctx.save();
  ctx.translate(size / 2 - 60, size / 2 - 72);
  ctx.scale(5, 5);
  ctx.fillStyle = "#ffffff";
  ctx.fill(new Path2D(icon.path));
  ctx.restore();
  ctx.fillStyle = "#a0a0a0";
  ctx.font = "bold 20px monospace";
  ctx.textAlign = "center";
  ctx.fillText(icon.title.toUpperCase().slice(0, 16), size / 2, size - 34);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function TechCarousel({ reducedMotion, isMobile }: Common) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Group>(null);
  const textures = useMemo(() => carouselIcons.map(makePanelTexture), []);
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);
  const radius = isMobile ? 2.5 : 3.6;

  useFrame((state, dt) => {
    const g = group.current;
    if (!g || !ring.current) return;
    const w = sectionWeight(2);
    applyWeight(g, w);
    g.position.y = (1 - w) * -3 + (isMobile ? 0.6 : 0);
    if (!reducedMotion) ring.current.rotation.y += dt * 0.25;
    ring.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.08 - 0.12;
  });

  return (
    <group ref={group} position={[0, 0, -2.6]}>
      <group ref={ring}>
        {textures.map((tex, i) => {
          const a = (i / textures.length) * Math.PI * 2;
          return (
            <group key={i} position={[Math.sin(a) * radius, (i % 2 ? 0.45 : -0.45), Math.cos(a) * radius]} rotation={[0, a, 0]}>
              <mesh>
                <boxGeometry args={[1.1, 1.1, 0.06]} />
                <meshStandardMaterial attach="material-0" color="#e60023" />
                <meshStandardMaterial attach="material-1" color="#e60023" />
                <meshStandardMaterial attach="material-2" color="#e60023" />
                <meshStandardMaterial attach="material-3" color="#e60023" />
                <meshStandardMaterial attach="material-4" map={tex} emissiveMap={tex} emissive="#ffffff" emissiveIntensity={0.35} roughness={0.5} />
                <meshStandardMaterial attach="material-5" color="#120004" metalness={0.8} roughness={0.3} />
              </mesh>
            </group>
          );
        })}
      </group>
      {/* Central red platform ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <ringGeometry args={[radius - 0.08, radius + 0.08, 64]} />
        <meshBasicMaterial color="#e60023" toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* PROJECTS: angled panels sliding in from both sides                  */
/* ------------------------------------------------------------------ */
export function ProjectFrames({ reducedMotion, isMobile }: Common) {
  const group = useRef<THREE.Group>(null);
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g || !left.current || !right.current) return;
    const w = sectionWeight(3);
    g.visible = w > 0.01;
    const off = (1 - w) * 9;
    left.current.position.x = THREE.MathUtils.damp(left.current.position.x, (isMobile ? -1.8 : -3.6) - off, 6, dt);
    right.current.position.x = THREE.MathUtils.damp(right.current.position.x, (isMobile ? 1.8 : 3.6) + off, 6, dt);
    left.current.rotation.z = -0.35 - (1 - w) * 0.6;
    right.current.rotation.z = 0.3 + (1 - w) * 0.6;
    if (core.current && !reducedMotion) {
      core.current.rotation.x += dt * 0.4;
      core.current.rotation.y += dt * 0.6;
      core.current.scale.setScalar(w * (1 + Math.sin(state.clock.elapsedTime * 2) * 0.05));
    }
  });

  return (
    <group ref={group} position={[0, 0, -4]}>
      <group ref={left} position={[-12, 0.4, 0]} rotation={[0, 0.5, -0.35]}>
        <mesh>
          <boxGeometry args={[3.4, 4.6, 0.08]} />
          <meshStandardMaterial color="#e60023" metalness={0.3} roughness={0.4} emissive="#990019" emissiveIntensity={0.4} />
          <Edges color="#ffffff" />
        </mesh>
        <mesh position={[0.35, -0.3, 0.2]}>
          <boxGeometry args={[3.0, 3.8, 0.05]} />
          <meshStandardMaterial color="#050505" metalness={0.9} roughness={0.25} />
          <Edges color="#e60023" />
        </mesh>
      </group>
      <group ref={right} position={[12, -0.6, -1]} rotation={[0, -0.5, 0.3]}>
        <mesh>
          <boxGeometry args={[3.2, 4.2, 0.08]} />
          <meshStandardMaterial color="#0c0c0c" metalness={0.9} roughness={0.2} />
          <Edges color="#e60023" />
        </mesh>
        <mesh position={[-0.3, 0.4, 0.2]}>
          <boxGeometry args={[2.6, 0.5, 0.05]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      </group>
      <mesh ref={core} position={[0, 0.2, -1.5]}>
        <octahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial color="#e60023" wireframe />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* ACHIEVEMENTS: big extruded IMMORTAL typography                      */
/* ------------------------------------------------------------------ */
export function ImmortalText({ reducedMotion, isMobile }: Common) {
  const group = useRef<THREE.Group>(null);
  const viewport = useThree((s) => s.viewport);
  const fit = Math.min(1, viewport.width / 10.5);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const w = sectionWeight(4);
    applyWeight(g, w, fit);
    g.rotation.x = (1 - w) * -1.2 + (reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.6) * 0.06);
    g.rotation.y = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.4) * 0.12;
  });

  return (
    <group ref={group} position={[0, isMobile ? 0.9 : 0.4, -2.2]}>
      <Center>
        <Text3D font={FONT} size={1.15} height={0.45} bevelEnabled bevelSize={0.03} bevelThickness={0.04} curveSegments={3} letterSpacing={0.04}>
          IMMORTAL
          <meshPhysicalMaterial color="#e60023" metalness={0.85} roughness={0.22} clearcoat={1} emissive="#990019" emissiveIntensity={0.5} />
        </Text3D>
      </Center>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* PERSONALITY: original comic "burst" stars                           */
/* ------------------------------------------------------------------ */
function burstShape(spikes = 12, outer = 1, inner = 0.62) {
  const s = new THREE.Shape();
  for (let i = 0; i <= spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner * (0.9 + ((i * 37) % 10) / 50);
    const a = (i / (spikes * 2)) * Math.PI * 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  return s;
}

const bursts = [
  { pos: [3.6, 1.4, -1], color: "#e60023", s: 0.9 },
  { pos: [-3.2, -1.6, -2], color: "#ffffff", s: 0.65 },
  { pos: [2.6, -2, -3], color: "#e60023", s: 0.55 },
] as const;

export function ComicBursts({ reducedMotion, isMobile }: Common) {
  const group = useRef<THREE.Group>(null);
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const geo = useMemo(
    () => new THREE.ExtrudeGeometry(burstShape(), { depth: 0.18, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 1 }),
    [],
  );
  useEffect(() => () => geo.dispose(), [geo]);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const w = sectionWeight(5);
    applyWeight(g, w, isMobile ? 0.6 : 1);
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    refs.current.forEach((m, i) => {
      if (!m) return;
      m.rotation.z = t * (0.3 + i * 0.15) * (i % 2 ? -1 : 1);
      m.rotation.y = Math.sin(t * 0.8 + i) * 0.5;
    });
  });

  return (
    <group ref={group} position={[0, isMobile ? 1.5 : 0, 0]}>
      {bursts.map((b, i) => (
        <mesh
          key={i}
          ref={(m) => {
            refs.current[i] = m;
          }}
          geometry={geo}
          position={b.pos as unknown as [number, number, number]}
          scale={b.s}
        >
          <meshStandardMaterial color={b.color} metalness={0.2} roughness={0.5} emissive={b.color} emissiveIntensity={0.15} />
          <Edges color={b.color === "#ffffff" ? "#e60023" : "#030303"} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* CONTACT: final LEOVAN signature                                     */
/* ------------------------------------------------------------------ */
export function Signature({ isMobile }: Common) {
  const group = useRef<THREE.Group>(null);
  const bar = useRef<THREE.Mesh>(null);
  const viewport = useThree((s) => s.viewport);
  const fit = Math.min(1, viewport.width / 8.5);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const w = sectionWeight(6);
    applyWeight(g, w, fit);
    g.position.y = (isMobile ? 0 : -0.95) - (1 - w) * 2;
    if (bar.current) bar.current.scale.x = Math.max(0.001, w);
  });

  return (
    <group ref={group} position={[0, -0.95, -1]}>
      <Center>
        <Text3D font={FONT} size={0.85} height={0.22} bevelEnabled bevelSize={0.02} bevelThickness={0.02} curveSegments={3} letterSpacing={0.12}>
          LEOVAN
          <meshPhysicalMaterial color="#f4f4f4" metalness={0.6} roughness={0.25} clearcoat={1} />
        </Text3D>
      </Center>
      <mesh ref={bar} position={[0, -0.7, 0]} rotation={[0, 0, -0.04]}>
        <planeGeometry args={[6.5, 0.12]} />
        <meshBasicMaterial color="#e60023" toneMapped={false} />
      </mesh>
    </group>
  );
}
