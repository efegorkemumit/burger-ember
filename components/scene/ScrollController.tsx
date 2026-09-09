"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSceneStore, PHASE_ORDER, type Phase } from "@/lib/scene-store";

gsap.registerPlugin(ScrollTrigger);

/**
 * Drives the shared scene-store from real document scroll. Each section
 * carries `data-phase="hero" | "ingredients" | ...` and owns a
 * contiguous scroll range (`top top` -> `bottom top`); exactly one is
 * active at a time, so the persistent 3D rig always knows which of the
 * 7 sections it is currently performing for.
 */
export function ScrollController() {
  useEffect(() => {
    const { setPhase, setPhaseProgress, setGlobalProgress } =
      useSceneStore.getState();

    const triggers: ScrollTrigger[] = [];

    PHASE_ORDER.forEach((phase) => {
      const el = document.querySelector<HTMLElement>(`[data-phase="${phase}"]`);
      if (!el) return;

      // The footer is shorter than the viewport (it's a plain content
      // block, not a scroll-driven 3D moment), so its top edge can never
      // reach the viewport's top edge the way every taller section's does.
      // "top bottom" instead fires as soon as it starts entering view.
      const isLast = phase === PHASE_ORDER[PHASE_ORDER.length - 1];

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: isLast ? "top bottom" : "top top",
        end: "bottom top",
        onUpdate: (self) => {
          if (self.isActive) {
            setPhase(phase as Phase);
            setPhaseProgress(self.progress);
          }
        },
        onEnterBack: () => setPhase(phase as Phase),
        onEnter: () => setPhase(phase as Phase),
      });
      triggers.push(trigger);
    });

    const globalTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => setGlobalProgress(self.progress),
    });
    triggers.push(globalTrigger);

    // first paint: make sure phase 0 is set even before any scroll fires.
    setPhase("hero");
    setPhaseProgress(0);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      triggers.forEach((t) => t.kill());
      window.removeEventListener("load", refresh);
    };
  }, []);

  return null;
}
