"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { AdditiveBlending, MathUtils, Vector2 } from "three";
import type { Group, Points } from "three";

function Artifact() {
  const tilt = useRef<Group>(null);
  const spin = useRef<Group>(null);

  useFrame((state, delta) => {
    if (tilt.current) {
      tilt.current.rotation.x = MathUtils.lerp(
        tilt.current.rotation.x,
        -state.pointer.y * 0.26,
        0.045,
      );
      tilt.current.rotation.y = MathUtils.lerp(
        tilt.current.rotation.y,
        state.pointer.x * 0.38,
        0.045,
      );
    }
    if (spin.current) {
      spin.current.rotation.y += delta * 0.16;
      spin.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <group ref={tilt} position={[2, 0.15, -0.6]} scale={0.85}>
      <group ref={spin}>
        <mesh>
          <icosahedronGeometry args={[1.55, 1]} />
          <meshStandardMaterial
            color="#0b0b0c"
            roughness={0.3}
            metalness={0.85}
            flatShading
          />
          <Edges scale={1.003} threshold={12} color="#ff3b30" />
        </mesh>

        <mesh scale={0.5} rotation={[0.4, 0.3, 0]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#ff3b30"
            emissive="#ff3b30"
            emissiveIntensity={1.6}
            roughness={0.25}
            metalness={0.4}
            flatShading
          />
        </mesh>

        <mesh rotation={[Math.PI / 2.3, 0.2, 0]}>
          <torusGeometry args={[2.3, 0.008, 6, 160]} />
          <meshBasicMaterial color="#ff3b30" transparent opacity={0.6} />
        </mesh>

        <mesh rotation={[0.2, Math.PI / 3, Math.PI / 2.6]}>
          <torusGeometry args={[2.75, 0.005, 6, 160]} />
          <meshBasicMaterial color="#f2f0eb" transparent opacity={0.25} />
        </mesh>
      </group>
    </group>
  );
}

function Dust({ count }: { count: number }) {
  const ref = useRef<Points>(null);

  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      data[i * 3] = (Math.random() - 0.5) * 12;
      data[i * 3 + 1] = (Math.random() - 0.5) * 8;
      data[i * 3 + 2] = (Math.random() - 0.5) * 7 - 1;
    }
    return data;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.018;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.024}
        color="#ff6b62"
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function HeroScene() {
  const [compact, setCompact] = useState(false);
  const [active, setActive] = useState(true);
  const offset = useMemo(() => new Vector2(0.0006, 0.0008), []);

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
      camera={{ position: [0, 0, 6.6], fov: 42 }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <fog attach="fog" args={["#070707", 5, 14]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 2.5, 4]} intensity={32} color="#ff3b30" distance={14} />
      <pointLight position={[-4, -2, 3]} intensity={14} color="#ffffff" distance={12} />

      <Artifact />
      <Dust count={compact ? 90 : 260} />

      <EffectComposer multisampling={0}>
        <Bloom
          mipmapBlur
          luminanceThreshold={0.45}
          luminanceSmoothing={0.3}
          intensity={1.35}
        />
        {!compact && (
          <ChromaticAberration
            offset={offset}
            radialModulation={false}
            modulationOffset={0}
          />
        )}
        <Noise opacity={0.05} />
        <Vignette offset={0.22} darkness={0.9} eskil={false} />
      </EffectComposer>
    </Canvas>
  );
}
