"use client";

import { INGREDIENTS } from "@/lib/ingredients-config";
import { useSceneStore } from "@/lib/scene-store";
import { SectionKicker } from "@/components/ui/SectionKicker";

export function Ingredients() {
  const hovered = useSceneStore((s) => s.hoveredIngredient);
  const setHovered = useSceneStore((s) => s.setHoveredIngredient);

  return (
    <section data-phase="ingredients" className="relative z-20 h-[220vh]">
      <div className="schematic-grid sticky top-0 flex h-screen flex-col justify-between px-6 py-14 sm:px-10 lg:px-16">
        <SectionKicker index="02" label="INGREDIENTS" />

        <div className="pointer-events-none flex flex-1 items-center">
          <h2 className="max-w-md text-3xl leading-tight font-medium tracking-tight sm:text-4xl">
            Seven layers. Nothing hidden.
          </h2>
        </div>

        <ul className="grid grid-cols-2 gap-x-8 gap-y-3 font-mono text-sm sm:grid-cols-4 lg:gap-x-12">
          {INGREDIENTS.map((ing) => (
            <li
              key={ing.id}
              onMouseEnter={() => setHovered(ing.id)}
              onMouseLeave={() => setHovered(null)}
              className={`pointer-events-auto cursor-default border-t pt-2 transition-colors ${
                hovered === ing.id
                  ? "border-ember text-ember"
                  : "border-plaster/20 text-plaster/60"
              }`}
            >
              <div className="tracking-[0.15em]">{ing.label}</div>
              <div className="text-xs text-plaster/60">{ing.spec}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
