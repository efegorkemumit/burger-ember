"use client";

import { useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { INGREDIENTS } from "@/lib/ingredients-config";
import { computeIngredientTransform } from "@/lib/burger-transform";
import { useSceneStore } from "@/lib/scene-store";
import { IngredientMesh } from "./ingredients/IngredientMesh";
import { GridGuides } from "./GridGuides";
import { FireBed } from "./FireBed";

// Per-frame convergence rate toward the current target (exponential decay,
// applied as `1 - base ** delta`; smaller base = snappier). Every phase
// shares the same brisk, ambient-hover weight except "assembly": the
// reassembly is a deliberate landing, not another hover response, so it
// settles ~35% slower for real impact (asymmetric timing, matches the
// same phase's camera settle in CameraRig).
const DAMP_BASE: Record<string, number> = { assembly: 0.006 };
const DEFAULT_DAMP_BASE = 0.001;

export function BurgerRig() {
  const rigRef = useRef<THREE.Group>(null);
  const groupRefs = useRef<Record<string, THREE.Group | null>>({});

  useFrame((_, delta) => {
    const store = useSceneStore.getState();
    const { phase, phaseProgress, pointer, hoveredIngredient, reducedMotion } = store;

    // Build section's magnetic spacing is pointer-driven on desktop and
    // orientation/idle-driven on touch (see PointerController) — either
    // way it rides the same normalized pointer.y signal.
    const magneticFactor = Math.min(1, Math.max(0, (pointer.y + 1) / 2));
    if (phase === "build") store.setMagneticFactor(magneticFactor);

    const damp = 1 - Math.pow(DAMP_BASE[phase] ?? DEFAULT_DAMP_BASE, delta);

    for (const cfg of INGREDIENTS) {
      const node = groupRefs.current[cfg.id];
      if (!node) continue;
      const target = computeIngredientTransform(cfg, {
        phase,
        phaseProgress,
        pointer,
        hoveredIngredient,
        magneticFactor,
        reducedMotion,
      });
      node.position.x += (target.position[0] - node.position.x) * damp;
      node.position.y += (target.position[1] - node.position.y) * damp;
      node.position.z += (target.position[2] - node.position.z) * damp;
      const s = node.scale.x + (target.scale - node.scale.x) * damp;
      node.scale.setScalar(s);

      const prevOpacity = node.userData.currentOpacity ?? 1;
      const nextOpacity = prevOpacity + (target.opacity - prevOpacity) * damp;
      node.userData.currentOpacity = nextOpacity;
      node.visible = nextOpacity > 0.01;
      // Once converged (the common case: fully visible almost everywhere,
      // or fully hidden while off-phase), skip the scene-graph walk and
      // material write entirely instead of paying for it every frame
      // forever — it resumes the instant `target.opacity` moves again.
      if (Math.abs(nextOpacity - prevOpacity) > 0.0004) {
        node.traverse((child) => {
          const mesh = child as THREE.Mesh;
          const material = mesh.material as THREE.Material | undefined;
          if (material && "opacity" in material) {
            if (nextOpacity < 0.999) material.transparent = true;
            (material as THREE.MeshStandardMaterial).opacity = nextOpacity;
          }
        });
      }
    }

    // whole-rig tilt/parallax in the hero, settles elsewhere. Removed
    // under reduced motion — whole-scene rotation tied to ambient mouse
    // position is exactly the kind of motion that preference exists for.
    if (rigRef.current) {
      const tiltTarget =
        phase === "hero" && !reducedMotion
          ? { x: pointer.y * 0.12, y: pointer.x * -0.18 }
          : { x: 0, y: 0 };
      rigRef.current.rotation.x +=
        (tiltTarget.x - rigRef.current.rotation.x) * damp;
      rigRef.current.rotation.y +=
        (tiltTarget.y - rigRef.current.rotation.y) * damp;
    }
  });

  const setHovered = (id: (typeof INGREDIENTS)[number]["id"] | null) =>
    useSceneStore.getState().setHoveredIngredient(id);

  return (
    <group ref={rigRef} scale={0.5}>
      <GridGuides />
      <FireBed />
      {INGREDIENTS.map((cfg) => (
        <group
          key={cfg.id}
          ref={(node) => {
            groupRefs.current[cfg.id] = node;
          }}
          onPointerOver={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            setHovered(cfg.id);
          }}
          onPointerOut={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            setHovered(null);
          }}
        >
          <IngredientMesh
            geometry={cfg.geometry}
            color={cfg.color}
            emissive={cfg.emissive}
            modelUrl={cfg.modelUrl}
            modelScale={cfg.modelScale}
            modelYOffset={cfg.modelYOffset}
            modelRotationX={cfg.modelRotationX}
            modelRotationY={cfg.modelRotationY}
          />
        </group>
      ))}
    </group>
  );
}
