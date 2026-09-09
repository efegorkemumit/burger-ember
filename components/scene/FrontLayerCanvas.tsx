"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ingredientById } from "@/lib/ingredients-config";
import { computeIngredientTransform, FRONT_LAYER_INGREDIENT } from "@/lib/burger-transform";
import { useSceneStore } from "@/lib/scene-store";
import { IngredientMesh } from "./ingredients/IngredientMesh";

function FrontIngredient() {
  const groupRef = useRef<THREE.Group>(null);
  const cfg = ingredientById(FRONT_LAYER_INGREDIENT);

  useFrame((_, delta) => {
    const { phase, phaseProgress, pointer, hoveredIngredient, magneticFactor, reducedMotion } =
      useSceneStore.getState();
    const target = computeIngredientTransform(cfg, {
      phase,
      phaseProgress,
      pointer,
      hoveredIngredient,
      magneticFactor,
      reducedMotion,
    });
    const node = groupRef.current;
    if (!node) return;
    const damp = 1 - Math.pow(0.001, delta);
    node.position.x += (target.position[0] - node.position.x) * damp;
    node.position.y += (target.position[1] - node.position.y) * damp;
    node.position.z += (target.position[2] - node.position.z) * damp;
    const s = node.scale.x + (target.scale - node.scale.x) * damp;
    node.scale.setScalar(s);
  });

  return (
    <group ref={groupRef}>
      <IngredientMesh geometry={cfg.geometry} color={cfg.color} emissive={cfg.emissive} />
    </group>
  );
}

/**
 * Duplicate, synchronized mini-scene that renders only the "cheese" layer
 * above section 05's foreground typography — the one ingredient the
 * direction contract pins as passing in front of the numbers while the
 * rest of the burger stays behind the type in the main persistent canvas.
 */
export function FrontLayerCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: 32, position: [0, 0.2, 8.4] }}
      >
        <ambientLight intensity={0.6} color="#ece4d6" />
        <directionalLight position={[3, 4, 2]} intensity={1.2} color="#fff3e2" />
        <FrontIngredient />
      </Canvas>
    </div>
  );
}
