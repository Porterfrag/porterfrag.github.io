"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { Color, MathUtils, Object3D } from "three";
import type { Group, InstancedMesh } from "three";

const BAR_COUNT = 72;

function Spectrum({ count }: { count: number }) {
  const bars = useRef<InstancedMesh>(null);
  const tilt = useRef<Group>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const color = useMemo(() => new Color(), []);

  useEffect(() => {
    const mesh = bars.current;
    if (!mesh) return;
    for (let i = 0; i < count; i++) {
      color.set(i % 9 === 0 ? "#f2f0eb" : "#ff3b30");
      mesh.setColorAt(i, color);
    }
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [count, color]);

  useFrame((state, delta) => {
    const mesh = bars.current;
    if (!mesh) return;

    const t = state.clock.elapsedTime;

    if (tilt.current) {
      tilt.current.rotation.x = MathUtils.lerp(
        tilt.current.rotation.x,
        -state.pointer.y * 0.2,
        0.04,
      );
      tilt.current.rotation.y = MathUtils.lerp(
        tilt.current.rotation.y,
        state.pointer.x * 0.28 + t * 0.05,
        0.03,
      );
    }

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const wave =
        Math.sin(angle * 4 + t * 2.1) * 0.5 +
        Math.sin(angle * 9 - t * 1.3) * 0.28 +
        Math.sin(angle * 17 + t * 3.2) * 0.12;
      const level = Math.max(0.06, 0.32 + wave * 0.34);
      const height = 0.18 + level * 1.55;
      const radius = 1.75 + height / 2;

      dummy.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        Math.sin(t * 1.4 + i * 0.2) * 0.08,
      );
      dummy.rotation.set(0, 0, angle - Math.PI / 2);
      dummy.scale.set(0.055, height, 0.055);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={tilt}>
      <instancedMesh ref={bars} args={[undefined, undefined, count]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      <mesh>
        <torusGeometry args={[1.72, 0.012, 6, 128]} />
        <meshBasicMaterial color="#ff3b30" transparent opacity={0.55} />
      </mesh>

      <mesh scale={0.52}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#0b0b0c"
          roughness={0.3}
          metalness={0.8}
          flatShading
        />
        <Edges scale={1.005} threshold={12} color="#ff3b30" />
      </mesh>

      <pointLight position={[0, 0, 2.5]} intensity={14} color="#ff3b30" distance={9} />
      <ambientLight intensity={0.35} />
    </group>
  );
}

export default function MusicScene() {
  const [compact, setCompact] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);

    const visibility = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", visibility);

    return () => {
      mq.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <Spectrum count={compact ? 48 : BAR_COUNT} />
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={0.4} intensity={1.25} />
        <Noise opacity={0.04} />
        <Vignette offset={0.3} darkness={0.75} eskil={false} />
      </EffectComposer>
    </Canvas>
  );
}
