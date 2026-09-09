"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import type { IngredientGeometry } from "@/lib/ingredients-config";

/**
 * Procedural, parametric geometry for each of the 7 shared ingredients.
 * This is the fallback path for any ingredient that doesn't yet have an
 * approved production-quality GLB (see `modelUrl` below) — flat-shaded
 * primitives with a hard outline shell, honest about being a placeholder.
 */
function useIngredientGeometry(type: IngredientGeometry): THREE.BufferGeometry {
  return useMemo(() => {
    switch (type) {
      case "domeBun":
        return new THREE.SphereGeometry(1.05, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      case "flatBun":
        return new THREE.CylinderGeometry(1.05, 0.95, 0.32, 24);
      case "cheese":
        return new THREE.CylinderGeometry(1.12, 1.12, 0.06, 4, 1);
      case "patty":
        return new THREE.CylinderGeometry(0.92, 0.92, 0.28, 20);
      case "lettuce":
        return new THREE.IcosahedronGeometry(1.08, 1);
      case "tomato":
        return new THREE.CylinderGeometry(0.85, 0.85, 0.14, 16);
      case "sauce":
        return new THREE.TorusGeometry(0.55, 0.07, 8, 24);
      default:
        return new THREE.BoxGeometry(1, 1, 1);
    }
  }, [type]);
}

interface IngredientMeshProps {
  geometry: IngredientGeometry;
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  scale?: number;
  opacity?: number;
  /** Pilot-quality GLB (fal.ai Hunyuan3D, PBR: albedo + normal + roughness/metalness). */
  modelUrl?: string;
  modelScale?: number;
  modelYOffset?: number;
  modelRotationX?: number;
  modelRotationY?: number;
}

export function IngredientMesh({
  geometry,
  color,
  emissive,
  emissiveIntensity = 0.4,
  scale = 1,
  opacity = 1,
  modelUrl,
  modelScale = 1,
  modelYOffset = 0,
  modelRotationX = 0,
  modelRotationY = 0,
}: IngredientMeshProps) {
  if (modelUrl) {
    return (
      <group scale={scale}>
        <GltfIngredient
          url={modelUrl}
          modelScale={modelScale}
          yOffset={modelYOffset}
          rotationX={modelRotationX}
          rotationY={modelRotationY}
        />
      </group>
    );
  }

  return (
    <ProceduralIngredient
      geometry={geometry}
      color={color}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
      scale={scale}
      opacity={opacity}
    />
  );
}

/** Production-quality generated mesh: PBR materials ship inside the GLB
 * itself (baseColor/normal/metallicRoughness), so we render them as-is
 * rather than overriding with the procedural flat-shaded material. */
function GltfIngredient({
  url,
  modelScale,
  yOffset,
  rotationX,
  rotationY,
}: {
  url: string;
  modelScale: number;
  yOffset: number;
  rotationX: number;
  rotationY: number;
}) {
  const { scene } = useGLTF(url);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  return (
    <primitive
      object={cloned}
      scale={modelScale}
      position={[0, yOffset, 0]}
      rotation={[rotationX, rotationY, 0]}
    />
  );
}

function ProceduralIngredient({
  geometry,
  color,
  emissive,
  emissiveIntensity,
  scale,
  opacity,
}: Pick<
  IngredientMeshProps,
  "geometry" | "color" | "emissive" | "emissiveIntensity" | "scale" | "opacity"
> &
  Required<Pick<IngredientMeshProps, "emissiveIntensity" | "scale" | "opacity">>) {
  const geo = useIngredientGeometry(geometry);
  const flatY = geometry === "lettuce" ? 0.55 : 1;

  return (
    <group scale={[scale, scale * flatY, scale]}>
      {/* schematic outline shell */}
      <mesh geometry={geo} scale={1.04} name="outline">
        <meshBasicMaterial
          color="#0b0a08"
          side={THREE.BackSide}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* the ingredient itself, flat-shaded for the graphic/technical read */}
      <mesh geometry={geo} castShadow receiveShadow name="body">
        <meshStandardMaterial
          color={color}
          emissive={emissive ?? "#000000"}
          emissiveIntensity={emissive ? emissiveIntensity : 0}
          flatShading
          roughness={0.65}
          metalness={0.05}
          transparent
          opacity={opacity}
        />
      </mesh>
      {geometry === "patty" && <GrillMarks opacity={opacity} />}
    </group>
  );
}

/** Crossed sear marks on the patty's top face — the detail that reads as
 * "real fire" once the camera macros in for section 03. */
function GrillMarks({ opacity }: { opacity: number }) {
  const marks = [-0.5, -0.25, 0, 0.25, 0.5];
  return (
    <group position={[0, 0.141, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
      {marks.map((m) => (
        <mesh key={`a-${m}`} position={[m, 0, 0]}>
          <planeGeometry args={[0.12, 1.7]} />
          <meshStandardMaterial
            color="#140a06"
            roughness={0.9}
            transparent
            opacity={0.85 * opacity}
          />
        </mesh>
      ))}
      {marks.map((m) => (
        <mesh key={`b-${m}`} position={[0, m, 0.001]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[0.12, 1.7]} />
          <meshStandardMaterial
            color="#140a06"
            roughness={0.9}
            transparent
            opacity={0.85 * opacity}
          />
        </mesh>
      ))}
    </group>
  );
}
