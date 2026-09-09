import { create } from "zustand";

export type Phase =
  | "hero"
  | "ingredients"
  | "fire"
  | "build"
  | "quality"
  | "assembly"
  | "footer";

export const PHASE_ORDER: Phase[] = [
  "hero",
  "ingredients",
  "fire",
  "build",
  "quality",
  "assembly",
  "footer",
];

export type IngredientId =
  | "topBun"
  | "cheese"
  | "patty"
  | "lettuce"
  | "tomato"
  | "sauce"
  | "bottomBun";

interface SceneState {
  /** Which section is currently driving the 3D rig. */
  phase: Phase;
  /** 0..1 progress through the current phase's scroll span. */
  phaseProgress: number;
  /** 0..1 progress across the entire document. */
  globalProgress: number;
  /** Normalized pointer position, -1..1 on both axes, relative to viewport center. */
  pointer: { x: number; y: number };
  /** True once we've seen a real pointer move (vs. touch/scroll-synthesized). */
  pointerActive: boolean;
  /** Ingredient currently under the pointer / focused in the ingredients section. */
  hoveredIngredient: IngredientId | null;
  /** 0 (collapsed) .. 1 (fully spread) magnetic spacing control for the Build section. */
  magneticFactor: number;
  /** Coarse pointer / touch device — drives the scroll-linked interaction fallback. */
  isTouch: boolean;
  /** `prefers-reduced-motion: reduce`. Ambient drift/tilt gets removed; the
   * scroll-phase content transitions that aid comprehension stay, just gentler. */
  reducedMotion: boolean;

  setPhase: (phase: Phase) => void;
  setPhaseProgress: (progress: number) => void;
  setGlobalProgress: (progress: number) => void;
  setPointer: (x: number, y: number) => void;
  setPointerActive: (active: boolean) => void;
  setHoveredIngredient: (id: IngredientId | null) => void;
  setMagneticFactor: (factor: number) => void;
  setIsTouch: (isTouch: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
}

declare global {
  interface Window {
    __sceneStore?: typeof useSceneStore;
  }
}

export const useSceneStore = create<SceneState>((set) => ({
  phase: "hero",
  phaseProgress: 0,
  globalProgress: 0,
  pointer: { x: 0, y: 0 },
  pointerActive: false,
  hoveredIngredient: null,
  magneticFactor: 0.5,
  isTouch: false,
  reducedMotion: false,

  setPhase: (phase) => set({ phase }),
  setPhaseProgress: (phaseProgress) => set({ phaseProgress }),
  setGlobalProgress: (globalProgress) => set({ globalProgress }),
  setPointer: (x, y) => set({ pointer: { x, y } }),
  setPointerActive: (pointerActive) => set({ pointerActive }),
  setHoveredIngredient: (hoveredIngredient) => set({ hoveredIngredient }),
  setMagneticFactor: (magneticFactor) => set({ magneticFactor }),
  setIsTouch: (isTouch) => set({ isTouch }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
}));

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  window.__sceneStore = useSceneStore;
}
