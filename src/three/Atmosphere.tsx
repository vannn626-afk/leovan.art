import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "../lib/sceneStore";

type Common = { reducedMotion: boolean };

/* ---------------- Instanced angular shards (depth parallax) ---------------- */
export function Shards({ count, reducedMotion }: Common & { count: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const data = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const depth = Math.random();
        return {
          x: (Math.random() - 0.5) * 18,
          y: (Math.random() - 0.5) * 12,
          z: -2 - depth * 12,
          depth,
          s: 0.12 + Math.random() * 0.45,
          rx: Math.random() * Math.PI,
          ry: Math.random() * Math.PI,
          speed: 0.15 + Math.random() * 0.5,
          red: i % 3 === 0,
        };
      }),
    [count],
  );

  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const red = new THREE.Color("#e60023");
    const dark = new THREE.Color("#1a1a1a");
    data.forEach((d, i) => m.setColorAt(i, d.red ? red : dark));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [data]);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    const sec = sceneState.section;
    const p = sceneState.pointer;
    data.forEach((d, i) => {
      // Closer shards travel further per section => layered parallax
      const parallax = (1.2 - d.depth) * 2.4;
      let y = d.y + sec * parallax + Math.sin(t * d.speed + i) * 0.25;
      y = ((((y + 6) % 12) + 12) % 12) - 6;
      dummy.position.set(d.x - p.x * (1 - d.depth) * 0.6, y - p.y * (1 - d.depth) * 0.4, d.z);
      dummy.rotation.set(d.rx + t * d.speed, d.ry + t * d.speed * 0.7, 0);
      dummy.scale.setScalar(d.s);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <tetrahedronGeometry args={[1, 0]} />
      <meshStandardMaterial metalness={0.7} roughness={0.35} flatShading />
    </instancedMesh>
  );
}

/* ---------------- Particles ---------------- */
export function Particles({ count, reducedMotion }: Common & { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const red = new THREE.Color("#e60023");
    const white = new THREE.Color("#ffffff");
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = -Math.random() * 14 + 2;
      const c = Math.random() > 0.7 ? red : white;
      col.set([c.r, c.g, c.b], i * 3);
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  }, [count]);
  useEffect(() => () => geo.dispose(), [geo]);

  useFrame((state, dt) => {
    if (!ref.current || reducedMotion) return;
    ref.current.rotation.y += dt * 0.015;
    ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, sceneState.section * 0.6, 2, dt);
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.035} vertexColors transparent opacity={0.75} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ---------------- Angular red structures ---------------- */
const slashes = [
  { pos: [-5.5, 2.4, -7], rot: [0, 0.3, -0.62], size: [14, 0.5], color: "#e60023", depth: 0.4 },
  { pos: [6, -2.6, -9], rot: [0, -0.4, 0.55], size: [16, 1.1], color: "#990019", depth: 0.2 },
  { pos: [1, 4.5, -11], rot: [0, 0, -0.35], size: [22, 0.18], color: "#ffffff", depth: 0.1 },
  { pos: [-3, -4.2, -6], rot: [0, 0.2, 0.28], size: [12, 0.25], color: "#e60023", depth: 0.6 },
] as const;

export function Structures({ reducedMotion }: Common) {
  const group = useRef<THREE.Group>(null);
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame((state, dt) => {
    const t = reducedMotion ? 0 : state.clock.elapsedTime;
    const sec = sceneState.section;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const s = slashes[i];
      m.position.y = THREE.MathUtils.damp(m.position.y, s.pos[1] + (sec - 3) * s.depth * 1.6, 2.5, dt);
      m.position.x = s.pos[0] + Math.sin(t * 0.2 + i) * 0.5;
      m.rotation.z = s.rot[2] + Math.sin(sec * 0.9 + i) * 0.12;
    });
    if (group.current) group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, sceneState.pointer.x * 0.08, 2, dt);
  });
  return (
    <group ref={group}>
      {slashes.map((s, i) => (
        <mesh
          key={i}
          ref={(m) => {
            refs.current[i] = m;
          }}
          position={s.pos as unknown as [number, number, number]}
          rotation={s.rot as unknown as [number, number, number]}
        >
          <planeGeometry args={[s.size[0], s.size[1]]} />
          <meshBasicMaterial color={s.color} transparent opacity={s.color === "#ffffff" ? 0.25 : 0.55} side={THREE.DoubleSide} toneMapped={false} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------- Moving light sources ---------------- */
export function MovingLights({ reducedMotion }: Common) {
  const red = useRef<THREE.PointLight>(null);
  const white = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    const t = reducedMotion ? 1 : state.clock.elapsedTime;
    if (red.current) red.current.position.set(Math.sin(t * 0.6) * 5, Math.cos(t * 0.4) * 2 + 1, 2 + Math.cos(t * 0.6) * 2);
    if (white.current) white.current.position.set(Math.cos(t * 0.35) * 6, 3, Math.sin(t * 0.35) * 3);
  });
  return (
    <>
      <pointLight ref={red} color="#e60023" intensity={40} distance={14} decay={2} />
      <pointLight ref={white} color="#ffffff" intensity={14} distance={14} decay={2} />
    </>
  );
}

/* ---------------- Floor (receives the monogram shadow) ---------------- */
export function Floor({ receiveShadow }: { receiveShadow: boolean }) {
  return (
    <group position={[0, -2.6, -2]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow={receiveShadow}>
        <planeGeometry args={[60, 40]} />
        <meshStandardMaterial color="#070707" metalness={0.6} roughness={0.55} />
      </mesh>
      <gridHelper args={[60, 40, "#e60023", "#3a000a"]} position={[0, 0.01, 0]} material-transparent material-opacity={0.35} />
    </group>
  );
}
