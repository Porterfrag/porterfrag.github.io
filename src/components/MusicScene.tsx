"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Glitch,
  Noise,
  Scanline,
  Vignette,
} from "@react-three/postprocessing";
import {
  Box3,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  Vector2,
  Vector3,
} from "three";
import type { Group, InstancedMesh } from "three";
import { assetPath } from "@/lib/paths";

const MODEL_URL = assetPath("/models/low-poly-spaceship.glb");

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
    const speed = Math.min(delta, 0.05) * 19;
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
      <meshBasicMaterial color="#ff4a3f" toneMapped={false} transparent opacity={0.8} />
    </instancedMesh>
  );
}

function Starship() {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(MODEL_URL);

  const model = useMemo(() => {
    const copy = scene.clone(true);
    const meshes: Mesh[] = [];
    copy.traverse((child) => {
      if (child instanceof Mesh) meshes.push(child);
    });

    meshes.forEach((child) => {
      child.material = new MeshStandardMaterial({
        color: "#303036",
        metalness: 0.78,
        roughness: 0.34,
        emissive: "#ff3b30",
        emissiveIntensity: 0.06,
        flatShading: true,
      });
      const edges = new Mesh(
        child.geometry,
        new MeshBasicMaterial({
          color: "#ff3b30",
          wireframe: true,
          transparent: true,
          opacity: 0.18,
          depthWrite: false,
        }),
      );
      edges.scale.setScalar(1.004);
      child.add(edges);
    });

    const box = new Box3().setFromObject(copy);
    const center = box.getCenter(new Vector3());
    copy.position.sub(center);
    return copy;
  }, [scene]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.position.y = Math.sin(t * 1.2) * 0.07;
      group.current.rotation.z = -0.16 + Math.sin(t * 0.8) * 0.04;
      group.current.rotation.y = -0.55 + Math.sin(t * 0.55) * 0.05;
      group.current.rotation.x = 0.22 + Math.sin(t * 1.5) * 0.025;
    }
  });

  return (
    <group ref={group} scale={0.3}>
      <primitive object={model} />
      <pointLight position={[0, 0, 2.6]} intensity={10} color="#ff3b30" distance={10} />
      <directionalLight position={[-4, 5, 6]} intensity={3} color="#ff7a70" />
      <ambientLight intensity={0.9} />
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
      <fog attach="fog" args={["#070707", 7, 22]} />
      <WarpStreaks count={compact ? 46 : 110} />
      <Suspense fallback={null}>
        <Starship />
      </Suspense>

      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={0.4} intensity={1.4} />
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
