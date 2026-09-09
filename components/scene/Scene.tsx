"use client";

import { Canvas } from "@react-three/fiber";
import { useSceneStore } from "@/lib/scene-store";
import { BurgerRig } from "./BurgerRig";
import { CameraRig } from "./CameraRig";
import { PointerController } from "./PointerController";

/**
 * The persistent 3D burger — mounted once, stays alive behind every
 * section from 01 Hero through 06 Final Assembly, fading only for 07
 * Footer. This is the experience mechanism; Live-Fire Asador is the art
 * direction painted on top of it (lighting, palette, the grate in 03).
 */
export function Scene() {
  const phase = useSceneStore((s) => s.phase);
  const hidden = phase === "footer";

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-700"
      style={{ opacity: hidden ? 0 : 1 }}
      aria-hidden
    >
      <PointerController />
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: 30, position: [0, 0.05, 5.6] }}
      >
        <ambientLight intensity={0.55} color="#ece4d6" />
        <directionalLight
          position={[3, 4, 2]}
          intensity={1.4}
          color="#fff3e2"
        />
        <directionalLight
          position={[-3, -1, -2]}
          intensity={0.5}
          color="#e8611f"
        />
        <fog attach="fog" args={["#171512", 6, 14]} />
        <CameraRig />
        <BurgerRig />
      </Canvas>
    </div>
  );
}
