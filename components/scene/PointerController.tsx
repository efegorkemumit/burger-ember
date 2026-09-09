"use client";

import { useEffect, useRef } from "react";
import { useSceneStore } from "@/lib/scene-store";

/**
 * Feeds the shared pointer state that drives Hero separation, tilt/parallax,
 * and the Build section's magnetic spacing.
 *
 * Desktop: real mouse position, normalized -1..1 around viewport center.
 * Touch: no reliable hover, so we substitute device-orientation tilt when
 * granted, and otherwise a gentle idle drift — the pinned "scroll/tilt
 * equivalent" fallback for pointer-only interactions on mobile.
 */
export function PointerController() {
  const idleT = useRef(0);

  useEffect(() => {
    const { setPointer, setPointerActive, setIsTouch, setReducedMotion } =
      useSceneStore.getState();

    // `prefers-reduced-motion`: ambient drift and pointer-driven tilt/
    // separation get removed; scroll-phase content transitions stay (they
    // carry meaning), just without the constant idle motion layered on top.
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);
    const handleMotionPreference = (e: MediaQueryListEvent) =>
      setReducedMotion(e.matches);
    media.addEventListener("change", handleMotionPreference);

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -((e.clientY / window.innerHeight) * 2 - 1);
      setPointer(x, y);
      setPointerActive(true);
    };

    // Fast pointer exit: leaving the window (or the tab losing focus) must
    // release the hero back toward assembled instead of freezing it
    // mid-separation at wherever the cursor last was. `pointer` returning
    // to center is enough — the existing per-frame damping in BurgerRig/
    // CameraRig eases the visual return, no separate tween needed here.
    const handlePointerLeave = () => {
      setPointer(0, 0);
      setPointerActive(false);
    };
    const handleBlur = () => handlePointerLeave();

    // iOS 13+ Safari requires `DeviceOrientationEvent.requestPermission()`,
    // called synchronously inside a user gesture, before `deviceorientation`
    // will ever fire — otherwise the Build section's advertised tilt control
    // is silently dead on iPhone and the idle-drift fallback below quietly
    // takes its place instead. The first touch is already a real user
    // gesture we're listening to (for `isTouch`), so piggyback the request
    // on it rather than adding a separate prompt.
    let orientationPermissionRequested = false;
    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch") return;
      setIsTouch(true);
      if (orientationPermissionRequested) return;
      orientationPermissionRequested = true;
      const OrientationEventCtor = window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<"granted" | "denied">;
      };
      if (typeof OrientationEventCtor?.requestPermission === "function") {
        OrientationEventCtor.requestPermission().catch(() => {});
      }
    };

    let orientationGranted = false;
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      orientationGranted = true;
      const x = Math.max(-1, Math.min(1, e.gamma / 30));
      const y = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
      setPointer(x, y);
      setPointerActive(true);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    window.addEventListener("blur", handleBlur);
    window.addEventListener("deviceorientation", handleOrientation, true);

    let raf = 0;
    const idleLoop = () => {
      const { isTouch, pointerActive, reducedMotion } = useSceneStore.getState();
      if (reducedMotion) {
        // No synthetic wandering — hold center (assembled) at rest.
      } else if (isTouch && !orientationGranted) {
        idleT.current += 0.006;
        setPointer(Math.sin(idleT.current) * 0.4, Math.cos(idleT.current * 0.7) * 0.25);
      } else if (!isTouch && !pointerActive) {
        idleT.current += 0.004;
        setPointer(Math.sin(idleT.current) * 0.08, Math.cos(idleT.current * 0.5) * 0.05);
      }
      raf = requestAnimationFrame(idleLoop);
    };
    raf = requestAnimationFrame(idleLoop);

    return () => {
      media.removeEventListener("change", handleMotionPreference);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("deviceorientation", handleOrientation, true);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
