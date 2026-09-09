import type { IngredientConfig } from "./ingredients-config";
import type { IngredientId, Phase } from "./scene-store";

export interface TransformInput {
  phase: Phase;
  phaseProgress: number;
  pointer: { x: number; y: number };
  hoveredIngredient: IngredientId | null;
  magneticFactor: number;
  reducedMotion: boolean;
}

export interface Transform {
  position: [number, number, number];
  scale: number;
  opacity: number;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Single source of truth for where an ingredient sits, at any scroll
 * phase. Shared by the main persistent rig and the small front-layer
 * canvas (section 05) so both stay perfectly in sync.
 */
export function computeIngredientTransform(
  cfg: IngredientConfig,
  input: TransformInput
): Transform {
  const { phase, phaseProgress: t, pointer, hoveredIngredient, magneticFactor, reducedMotion } =
    input;
  const reactivity = 1 - cfg.stackIndex / 6; // top layers (closer to camera) react more
  const isHovered = hoveredIngredient === cfg.id;

  switch (phase) {
    case "hero": {
      const pointerMag = clamp01(Math.hypot(pointer.x, pointer.y));
      // Hero composition only: idle stays near-assembled, max hover
      // separation cut ~40% (was 0.04 + pointerMag * 0.6) so the layers
      // read as one burger, not scattered parts. Ingredients section's
      // full explode is untouched — separate code path below.
      // Reduced motion: gentler, not zero — halve the response instead of
      // removing it (idle ambient drift is already off, see PointerController).
      const motionScale = reducedMotion ? 0.5 : 1;
      const spread = (0.024 + pointerMag * 0.36) * motionScale;
      const dir = cfg.assembledY >= 0 ? 1 : -1;
      const y = cfg.assembledY + dir * reactivity * spread;
      const x = pointer.x * 0.18 * reactivity * motionScale;
      const z = pointer.y * 0.08 * reactivity * motionScale;
      return { position: [x, y, z], scale: 1, opacity: 1 };
    }

    case "ingredients": {
      const y = lerp(cfg.assembledY, cfg.deconstructedY, t);
      const x = lerp(0, cfg.deconstructedOffset[0] * 2.2, t);
      const z = lerp(0, cfg.deconstructedOffset[1] * 2.2, t);
      if (isHovered) {
        return { position: [x, y, z + 0.6], scale: 1.28, opacity: 1 };
      }
      return { position: [x, y, z], scale: 1, opacity: 1 };
    }

    case "fire": {
      if (cfg.id === "patty") {
        const scale = lerp(1, 1.7, t);
        return { position: [0, lerp(cfg.deconstructedY, 0.35, t), 0], scale, opacity: 1 };
      }
      const x = cfg.deconstructedOffset[0] * 3;
      const z = cfg.deconstructedOffset[1] * 3;
      return {
        position: [x, cfg.deconstructedY, z],
        scale: 1,
        opacity: clamp01(1 - t * 1.4),
      };
    }

    case "build": {
      const spacingMul = lerp(0.4, 1.85, magneticFactor);
      const y = cfg.assembledY + (cfg.deconstructedY - cfg.assembledY) * spacingMul;
      const x = cfg.deconstructedOffset[0] * 2.2 * spacingMul;
      const z = cfg.deconstructedOffset[1] * 2.2 * spacingMul;
      const scale = lerp(0.95, 1.08, magneticFactor);
      return { position: [x, y, z], scale, opacity: 1 };
    }

    case "quality": {
      const startY = cfg.deconstructedY * 0.55;
      const y = lerp(startY, cfg.assembledY, t);
      const x = lerp(cfg.deconstructedOffset[0] * 1.3, 0, t);
      const z = lerp(cfg.deconstructedOffset[1] * 1.3, 0, t);
      // the designated "front" ingredient is rendered by the dedicated
      // front-layer canvas instead, so the main rig hides it here.
      const opacity = cfg.id === "cheese" ? 0 : 1;
      return { position: [x, y, z], scale: 1, opacity };
    }

    case "assembly": {
      const startY = cfg.deconstructedY * 0.3;
      const y = lerp(startY, cfg.assembledY, t);
      const startX = cfg.deconstructedOffset[0] * 0.6;
      const startZ = cfg.deconstructedOffset[1] * 0.6;
      const x = lerp(startX, 0, t);
      const z = lerp(startZ, 0, t);
      const scale = lerp(0.92, 1, t);
      return { position: [x, y, z], scale, opacity: 1 };
    }

    case "footer": {
      return {
        position: [0, cfg.assembledY, 0],
        scale: 1,
        opacity: clamp01(1 - t * 1.6),
      };
    }

    default:
      return { position: [0, cfg.assembledY, 0], scale: 1, opacity: 1 };
  }
}

/** The one ingredient that gets its own front-of-typography canvas in section 05. */
export const FRONT_LAYER_INGREDIENT: IngredientId = "cheese";
