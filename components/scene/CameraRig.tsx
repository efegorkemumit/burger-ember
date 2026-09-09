"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneStore, type Phase } from "@/lib/scene-store";

const CAMERA_TARGETS: Record<Phase, { pos: [number, number, number]; look: [number, number, number] }> = {
  hero: { pos: [0, 0.05, 5.6], look: [0, 0.55, 0] },
  ingredients: { pos: [0, 0.25, 6.4], look: [0, 0.05, 0] },
  fire: { pos: [0.3, 0.55, 1.75], look: [0, 0.05, 0] },
  build: { pos: [0, 0.2, 5.2], look: [0, 0.05, 0] },
  quality: { pos: [0, 0.1, 6.6], look: [0, 0, 0] },
  assembly: { pos: [0, 0.15, 5.0], look: [0, 0.1, 0] },
  footer: { pos: [0, 0.15, 5.0], look: [0, 0.1, 0] },
};

// Matches BurgerRig's DAMP_BASE: every phase settles at the same brisk
// ambient weight except "assembly", which lands ~35% slower so the camera
// coming to rest reads as part of the same deliberate landing moment.
const CAMERA_DAMP_BASE: Record<string, number> = { assembly: 0.005 };
const DEFAULT_CAMERA_DAMP_BASE = 0.0008;

export function CameraRig() {
  const { camera, size } = useThree();
  const lookTarget = useRef(new THREE.Vector3(0, 0.3, 0));

  useFrame((_, delta) => {
    const { phase, pointer, reducedMotion } = useSceneStore.getState();
    const damp = 1 - Math.pow(CAMERA_DAMP_BASE[phase] ?? DEFAULT_CAMERA_DAMP_BASE, delta);
    const cfg = CAMERA_TARGETS[phase];

    // Every phase's distance was tuned against a desktop-landscape frame.
    // On a narrow/tall viewport the same world-space framing puts the
    // burger's on-screen footprint too large relative to the UI stacked
    // above/below it (confirmed: Ingredients' label grid collided with the
    // mesh on a 390px-wide screen). Pull the camera back proportionally as
    // the aspect ratio narrows instead of retuning every phase by hand.
    const aspect = size.width / size.height;
    const aspectScale =
      aspect >= 0.9 ? 1 : 1 + Math.min(1, (0.9 - aspect) / 0.45) * 0.35;

    // Camera position tied to ambient mouse position is exactly the kind
    // of motion `prefers-reduced-motion` exists to remove.
    const px = phase === "hero" && !reducedMotion ? pointer.x * 0.3 : 0;
    const py = phase === "hero" && !reducedMotion ? pointer.y * 0.15 : 0;

    camera.position.x += (cfg.pos[0] + px - camera.position.x) * damp;
    camera.position.y += (cfg.pos[1] + py - camera.position.y) * damp;
    camera.position.z += (cfg.pos[2] * aspectScale - camera.position.z) * damp;

    lookTarget.current.x += (cfg.look[0] - lookTarget.current.x) * damp;
    lookTarget.current.y += (cfg.look[1] - lookTarget.current.y) * damp;
    lookTarget.current.z += (cfg.look[2] - lookTarget.current.z) * damp;
    camera.lookAt(lookTarget.current);
  });

  return null;
}
