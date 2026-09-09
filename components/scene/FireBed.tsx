"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneStore } from "@/lib/scene-store";

/**
 * The iron grate + glowing embers beneath the patty — where the Live-Fire
 * Asador art direction shows up strongest (section 03, Fire/Patty).
 * Drives its own visibility from the scroll phase so the parent scene
 * tree stays purely declarative.
 */
export function FireBed() {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const visibilityRef = useRef(0);
  const emberRefs = useRef<THREE.Mesh[]>([]);
  const embers = useMemo(
    () =>
      Array.from({ length: 24 }, () => ({
        x: (Math.random() - 0.5) * 1.6,
        z: (Math.random() - 0.5) * 1.6,
        phase: Math.random() * Math.PI * 2,
        speed: 0.6 + Math.random() * 0.8,
        size: 0.03 + Math.random() * 0.05,
      })),
    []
  );

  useFrame(({ clock }, delta) => {
    const { phase, phaseProgress } = useSceneStore.getState();
    const target = phase === "fire" ? Math.min(1, phaseProgress * 1.6) : 0;
    const damp = 1 - Math.pow(0.002, delta);
    visibilityRef.current += (target - visibilityRef.current) * damp;
    const v = visibilityRef.current;

    if (groupRef.current) {
      groupRef.current.visible = v > 0.01;
      groupRef.current.traverse((child) => {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.Material | undefined;
        if (material && "opacity" in material) {
          (material as THREE.MeshStandardMaterial).opacity = v;
        }
      });
    }
    if (lightRef.current) lightRef.current.intensity = 4 * v;

    const t = clock.getElapsedTime();
    emberRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const e = embers[i];
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = (0.6 + Math.sin(t * e.speed + e.phase) * 0.4) * v;
    });
  });

  return (
    <group ref={groupRef} position={[0, -0.15, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 1.5, 24, 3]} />
        <meshStandardMaterial color="#171512" roughness={0.4} metalness={0.6} transparent />
      </mesh>
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={`bar-${i}`} rotation={[0, (Math.PI / 10) * i, 0]}>
          <boxGeometry args={[3, 0.04, 0.04]} />
          <meshStandardMaterial color="#0e0c0a" roughness={0.4} metalness={0.6} transparent />
        </mesh>
      ))}
      {embers.map((e, i) => (
        <mesh
          key={i}
          ref={(m) => {
            if (m) emberRefs.current[i] = m;
          }}
          position={[e.x, -0.15, e.z]}
        >
          <sphereGeometry args={[e.size, 6, 6]} />
          <meshStandardMaterial
            color="#3a1204"
            emissive="#ff6a1f"
            emissiveIntensity={0.8}
            transparent
          />
        </mesh>
      ))}
      <pointLight ref={lightRef} position={[0, 0.2, 0]} color="#ff7a2e" intensity={0} distance={4} />
    </group>
  );
}
