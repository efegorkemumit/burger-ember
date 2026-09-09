"use client";

import { useSceneStore } from "@/lib/scene-store";
import { FrontLayerCanvas } from "./FrontLayerCanvas";

const LINES = ["180G", "100% BEEF", "OPEN FIRE", "2X CHEESE"];

function Lines({ variant }: { variant: "back" | "front" }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1 text-center leading-[0.9]">
      {LINES.map((line) => (
        <div
          key={line}
          className={`text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl ${
            variant === "back" ? "text-charcoal" : "text-plaster"
          }`}
        >
          {line}
        </div>
      ))}
    </div>
  );
}

/**
 * Section 05's "type sandwich": most of the burger's ingredients render
 * inside the persistent canvas (z-10), sitting *between* this back copy
 * of the numbers (z-9, behind everything) and the front copy (z-11,
 * above everything) — plus a dedicated front-layer canvas (z-12) for the
 * one ingredient (cheese) the direction pins as passing in front of the
 * type itself. Root-mounted once so it can stay perfectly viewport-fixed
 * regardless of where the 05 section sits in document flow.
 */
export function QualityTypographyOverlay() {
  const phase = useSceneStore((s) => s.phase);
  const active = phase === "quality";

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-[9] transition-opacity duration-500"
        style={{ opacity: active ? 1 : 0 }}
        aria-hidden
      >
        <Lines variant="back" />
      </div>
      <div
        className="pointer-events-none fixed inset-0 z-[11] transition-opacity duration-500"
        style={{ opacity: active ? 1 : 0 }}
        aria-hidden
      >
        <Lines variant="front" />
      </div>
      {active && <FrontLayerCanvas />}
    </>
  );
}
