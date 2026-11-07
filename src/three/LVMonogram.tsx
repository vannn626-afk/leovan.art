import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";
import { LV_L_POINTS, LV_V_POINTS } from "../components/ui/Logo";
import { sceneState, sectionWeight } from "../lib/sceneStore";
import { currentKey } from "./keyframes";

/** Convert the 2D logo polygon (SVG space) into a centered THREE.Shape. */
function shapeFrom(points: string, inset = 0) {
  const pts = points.split(" ").map((p) => p.split(",").map(Number));
  const shape = new THREE.Shape();
  pts.forEach(([x, y], i) => {
    const vx = (x - 122.5) / 100;
    const vy = (117.5 - y) / 100;
    const sx = vx * (1 - inset);
    const sy = vy * (1 - inset);
    if (i === 0) shape.moveTo(sx, sy);
    else shape.lineTo(sx, sy);
  });
  shape.closePath();
  return shape;
}

const extrude: THREE.ExtrudeGeometryOptions = {
  depth: 0.34,
  bevelEnabled: true,
  bevelThickness: 0.05,
  bevelSize: 0.028,
  bevelSegments: 2,
  curveSegments: 1,
};

type Props = { isMobile: boolean; reducedMotion: boolean; castShadow: boolean };

export function LVMonogram({ isMobile, reducedMotion, castShadow }: Props) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const glow = useRef<THREE.MeshBasicMaterial>(null);

  const { lGeo, vGeo, glowGeo } = useMemo(() => {
    const lGeo = new THREE.ExtrudeGeometry(shapeFrom(LV_L_POINTS), extrude);
    const vGeo = new THREE.ExtrudeGeometry(shapeFrom(LV_V_POINTS), extrude);
    lGeo.translate(0, 0, -0.17);
    vGeo.translate(0, 0, -0.05);
    const glowGeo = new THREE.ShapeGeometry([shapeFrom(LV_L_POINTS), shapeFrom(LV_V_POINTS)]);
    return { lGeo, vGeo, glowGeo };
  }, []);

  useEffect(
    () => () => {
      lGeo.dispose();
      vGeo.dispose();
      glowGeo.dispose();
    },
    [lGeo, vGeo, glowGeo],
  );

  useFrame((state, dt) => {
    const g = group.current;
    const i = inner.current;
    if (!g || !i) return;
    const d = Math.min(dt, 0.05);
    const k = currentKey(isMobile);
    const t = state.clock.elapsedTime;
    const p = sceneState.pointer;
    const motion = reducedMotion ? 0 : 1;

    // Scroll-driven placement
    g.position.x = THREE.MathUtils.damp(g.position.x, k.pos[0], 3.2, d);
    g.position.y = THREE.MathUtils.damp(g.position.y, k.pos[1] + Math.sin(t * 1.1) * 0.12 * motion, 3.2, d);
    g.position.z = THREE.MathUtils.damp(g.position.z, k.pos[2], 3.2, d);
    const s = THREE.MathUtils.damp(g.scale.x, k.scale, 3.2, d);
    g.scale.setScalar(s);

    // Pointer-responsive + slow idle rotation. Tech section adds a full showcase spin.
    const spin = sectionWeight(2) * t * 0.6 * motion;
    const tx = k.rot[0] - p.y * 0.35 + Math.sin(t * 0.5) * 0.05 * motion;
    const ty = k.rot[1] + p.x * 0.6 + Math.sin(t * 0.3) * 0.22 * motion + spin;
    i.rotation.x = THREE.MathUtils.damp(i.rotation.x, tx, 4, d);
    i.rotation.y = THREE.MathUtils.damp(i.rotation.y, ty, 4, d);
    i.rotation.z = THREE.MathUtils.damp(i.rotation.z, k.rot[2], 4, d);

    if (glow.current) glow.current.opacity = 0.28 + Math.sin(t * 2.2) * 0.08 * motion;
  });

  return (
    <group ref={group}>
      <group ref={inner}>
        <mesh geometry={lGeo} castShadow={castShadow}>
          <meshPhysicalMaterial
            color="#0b0b0b"
            metalness={1}
            roughness={0.16}
            clearcoat={1}
            clearcoatRoughness={0.08}
            emissive="#990019"
            emissiveIntensity={0.06}
            envMapIntensity={1.4}
          />
          <Edges threshold={20} color="#ff1a3c" />
        </mesh>
        <mesh geometry={vGeo} castShadow={castShadow}>
          <meshPhysicalMaterial
            color="#140306"
            metalness={1}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
            emissive="#e60023"
            emissiveIntensity={0.22}
            envMapIntensity={1.4}
          />
          <Edges threshold={20} color="#ffffff" />
        </mesh>
        {/* Red emissive halo behind the mark */}
        <mesh geometry={glowGeo} position={[0.03, -0.03, -0.32]} scale={1.07}>
          <meshBasicMaterial
            ref={glow}
            color="#e60023"
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}
