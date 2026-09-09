"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { INGREDIENTS } from "@/lib/ingredients-config";
import { useSceneStore } from "@/lib/scene-store";

const VISIBLE_PHASES = new Set(["ingredients", "build", "quality"]);

type LineHandle = THREE.Line<THREE.BufferGeometry, THREE.Material> | null;

/**
 * Thin schematic leader lines connecting each ingredient layer back to a
 * shared central axis — the exploded-parts-diagram signature of the
 * Graphic & Technical direction (donated into the direction contract from
 * the declined "Curved-Crease" and "Teletext" challengers as a single
 * continuous / precisely gridded line language).
 *
 * Drives its own visibility from the scroll phase (matches FireBed's
 * pattern) so it fades in/out at the same weight as everything else in the
 * scene, instead of snapping instantly on the exact frame the phase flips.
 */
export function GridGuides() {
  const color = "#ece4d6";
  const visibilityRef = useRef(0);
  const legRefs = useRef<LineHandle[]>([]);
  const spineRef = useRef<LineHandle>(null);

  const segments = useMemo(
    () =>
      INGREDIENTS.map((ing) => ({
        id: ing.id,
        points: [
          new THREE.Vector3(-2.6, ing.assembledY, 0),
          new THREE.Vector3(-1.3, ing.assembledY, 0),
        ] as [THREE.Vector3, THREE.Vector3],
      })),
    []
  );

  useFrame((_, delta) => {
    const { phase } = useSceneStore.getState();
    const target = VISIBLE_PHASES.has(phase) ? 1 : 0;
    const damp = 1 - Math.pow(0.002, delta);
    visibilityRef.current += (target - visibilityRef.current) * damp;
    const v = visibilityRef.current;

    legRefs.current.forEach((line) => {
      if (line) (line.material as THREE.Material & { opacity: number }).opacity = 0.35 * v;
    });
    if (spineRef.current) {
      (spineRef.current.material as THREE.Material & { opacity: number }).opacity = 0.18 * v;
    }
  });

  return (
    <group>
      {segments.map((seg, i) => (
        <Line
          key={seg.id}
          ref={(el) => {
            legRefs.current[i] = el as unknown as LineHandle;
          }}
          points={seg.points}
          color={color}
          lineWidth={1}
          transparent
          opacity={0}
        />
      ))}
      {/* central vertical spine */}
      <Line
        ref={(el) => {
          spineRef.current = el as unknown as LineHandle;
        }}
        points={[new THREE.Vector3(0, 2.4, 0), new THREE.Vector3(0, -2.4, 0)]}
        color={color}
        lineWidth={1}
        transparent
        opacity={0}
      />
    </group>
  );
}
