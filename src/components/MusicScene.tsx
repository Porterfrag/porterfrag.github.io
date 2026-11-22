"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Glitch,
  Noise,
  Scanline,
  Vignette,
} from "@react-three/postprocessing";
import { AdditiveBlending, Object3D, Vector2 } from "three";
import type { Group, InstancedMesh } from "three";

type Streak = { x: number; y: number; z: number; length: number };

function makeStreak(): Streak {
  const angle = Math.random() * Math.PI * 2;
  const radius = 1.5 + Math.random() * 5.5;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius * 0.7,
    z: -Math.random() * 26,
    length: 0.5 + Math.random() * 2.4,
  };
}

function WarpStreaks({ count }: { count: number }) {
  const mesh = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const streaks = useMemo(() => Array.from({ length: count }, makeStreak), [count]);

  useFrame((_, delta) => {
    const node = mesh.current;
    if (!node) return;
    const speed = Math.min(delta, 0.05) * 17;

    streaks.forEach((streak, i) => {
      streak.z += speed;
      if (streak.z > 7) Object.assign(streak, makeStreak(), { z: -26 });
      dummy.position.set(streak.x, streak.y, streak.z);
      dummy.scale.set(0.014, 0.014, streak.length);
      dummy.updateMatrix();
      node.setMatrixAt(i, dummy.matrix);
    });
    node.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#ff4a3f" toneMapped={false} transparent opacity={0.75} />
    </instancedMesh>
  );
}

function Ship() {
  const group = useRef<Group>(null);
  const glows = useRef<Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.position.y = Math.sin(t * 1.3) * 0.06;
      group.current.rotation.z = -0.12 + Math.sin(t * 0.9) * 0.035;
      group.current.rotation.y = -0.62 + Math.sin(t * 0.6) * 0.04;
      group.current.rotation.x = 0.5 + Math.sin(t * 1.7) * 0.02;
    }
    if (glows.current) {
      glows.current.scale.setScalar(0.9 + Math.sin(t * 10) * 0.12);
    }
  });

  const hull = (
    <meshStandardMaterial
      color="#2a2a2e"
      metalness={0.62}
      roughness={0.38}
      flatShading
    />
  );

  return (
    <group ref={group} scale={1.35}>
      {/* long nose */}
      <mesh position={[0, 0, -0.55]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.32, 3.2, 8]} />
        {hull}
        <Edges scale={1.005} threshold={14} color="#ff3b30" />
      </mesh>

      {/* main hull */}
      <mesh position={[0, 0, 0.45]}>
        <boxGeometry args={[0.78, 0.38, 1.7]} />
        {hull}
        <Edges scale={1.005} threshold={14} color="#ff3b30" />
      </mesh>

      {/* four swept wings */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.82, side * 0.16, 0.38]} rotation={[0, side * 0.1, side * 0.44]}>
            <boxGeometry args={[1.55, 0.065, 0.78]} />
            {hull}
            <Edges scale={1.008} threshold={14} color="#ff3b30" />
          </mesh>
          <mesh position={[side * 0.82, -side * 0.16, 0.38]} rotation={[0, side * 0.1, -side * 0.44]}>
            <boxGeometry args={[1.55, 0.065, 0.78]} />
            {hull}
            <Edges scale={1.008} threshold={14} color="#ff3b30" />
          </mesh>
        </group>
      ))}

      {/* canopy */}
      <mesh position={[0, 0.26, -0.5]} scale={[1, 0.75, 1.4]}>
        <sphereGeometry args={[0.26, 10, 7]} />
        <meshStandardMaterial
          color="#ff3b30"
          emissive="#ff3b30"
          emissiveIntensity={0.85}
          metalness={0.35}
          roughness={0.22}
          flatShading
        />
      </mesh>

      {/* twin engines */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.3, 0, 1.32]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.23, 0.55, 10]} />
          <meshStandardMaterial color="#1a1a1c" metalness={0.8} roughness={0.25} flatShading />
          <Edges scale={1.01} threshold={14} color="#ff3b30" />
        </mesh>
      ))}

      {/* engine flames */}
      <group ref={glows}>
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.3, 0, 1.64]}>
            <mesh>
              <circleGeometry args={[0.17, 16]} />
              <meshBasicMaterial
                color="#ff3b30"
                transparent
                opacity={0.95}
                blending={AdditiveBlending}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[0, 0, 0.01]}>
              <circleGeometry args={[0.07, 12]} />
              <meshBasicMaterial color="#fff4f0" toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>

      <pointLight position={[0, 0, 1.8]} intensity={22} color="#ff3b30" distance={9} />
      <directionalLight position={[-4, 5, 6]} intensity={4} color="#ff7a70" />
      <ambientLight intensity={1} />
    </group>
  );
}

export default function MusicScene() {
  const [compact, setCompact] = useState(false);
  const [active, setActive] = useState(true);
  const aberration = useMemo(() => new Vector2(0.0008, 0.001), []);
  const glitchDelay = useMemo(() => new Vector2(3.5, 7.5), []);
  const glitchDuration = useMemo(() => new Vector2(0.05, 0.14), []);
  const glitchStrength = useMemo(() => new Vector2(0.03, 0.18), []);

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
      camera={{ position: [0, 0, 6.4], fov: 42 }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <fog attach="fog" args={["#070707", 6, 20]} />
      <WarpStreaks count={compact ? 46 : 110} />
      <Ship />

      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={0.4} intensity={1.35} />
        {!compact && (
          <>
            <Glitch
              active
              delay={glitchDelay}
              duration={glitchDuration}
              strength={glitchStrength}
              ratio={0.7}
            />
            <ChromaticAberration offset={aberration} radialModulation={false} modulationOffset={0} />
            <Scanline density={1.3} opacity={0.1} />
          </>
        )}
        <Noise opacity={0.05} />
        <Vignette offset={0.26} darkness={0.82} eskil={false} />
      </EffectComposer>
    </Canvas>
  );
}
