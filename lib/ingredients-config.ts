import type { IngredientId } from "./scene-store";

export type IngredientGeometry =
  | "domeBun"
  | "flatBun"
  | "cheese"
  | "patty"
  | "lettuce"
  | "tomato"
  | "sauce";

export interface IngredientConfig {
  id: IngredientId;
  label: string;
  spec: string;
  geometry: IngredientGeometry;
  /** Stack order, 0 = top of the assembled burger, 6 = bottom. */
  stackIndex: number;
  /** Assembled Y position (world units). */
  assembledY: number;
  /** Y position once fully deconstructed (Ingredients section). */
  deconstructedY: number;
  /** Lateral / depth scatter target once fully deconstructed, for the exploded-diagram look. */
  deconstructedOffset: [number, number];
  color: string;
  emissive?: string;
  /**
   * Production-quality generated mesh (fal.ai Hunyuan3D, PBR: albedo +
   * normal + metallic/roughness, resized to 1024px and WebP-compressed).
   * When set, IngredientMesh loads this GLB instead of the procedural
   * geometry; `geometry`/`color`/`emissive` above stay as the fallback for
   * any ingredient that ever loses its model. `modelScale`/`modelYOffset`/
   * `modelRotationX`/`modelRotationY` calibrate each generated mesh into
   * the same slot the procedural version used.
   */
  modelUrl?: string;
  modelScale?: number;
  modelYOffset?: number;
  modelRotationX?: number;
  modelRotationY?: number;
}

// Same 7-ingredient set used across the entire homepage — never swapped per section.
export const INGREDIENTS: IngredientConfig[] = [
  {
    id: "topBun",
    label: "TOP BUN",
    spec: "TOASTED BRIOCHE",
    geometry: "domeBun",
    stackIndex: 0,
    assembledY: 1.5,
    deconstructedY: 4.2,
    deconstructedOffset: [-0.15, 0.1],
    color: "#d9a15a",
    modelUrl: "/models/ingredients/top-bun.glb",
    modelScale: 1.05,
    modelYOffset: -0.05,
  },
  {
    id: "cheese",
    label: "CHEESE",
    spec: "2X AGED CHEDDAR",
    geometry: "cheese",
    stackIndex: 1,
    assembledY: 0.95,
    deconstructedY: 2.5,
    deconstructedOffset: [1.5, -0.1],
    color: "#f2c14e",
    modelUrl: "/models/ingredients/cheese.glb",
    modelScale: 1.1,
    modelYOffset: 0,
  },
  {
    id: "patty",
    label: "PATTY",
    spec: "180G — 100% BEEF",
    geometry: "patty",
    stackIndex: 2,
    assembledY: 0.55,
    deconstructedY: 0.9,
    deconstructedOffset: [-1.05, 0.35],
    color: "#5b3524",
    emissive: "#e8611f",
    modelUrl: "/models/ingredients/patty.glb",
    modelScale: 1.0,
    modelYOffset: 0,
  },
  {
    id: "lettuce",
    label: "LETTUCE",
    spec: "FLAME-KISSED ROMAINE",
    geometry: "lettuce",
    stackIndex: 3,
    assembledY: 0.2,
    deconstructedY: -0.6,
    deconstructedOffset: [1.0, 0.5],
    color: "#7fae4a",
    modelUrl: "/models/ingredients/lettuce.glb",
    modelScale: 1.15,
    modelYOffset: 0,
    modelRotationX: Math.PI / 2,
    modelRotationY: 0,
  },
  {
    id: "tomato",
    label: "TOMATO",
    spec: "VINE-RIPENED",
    geometry: "tomato",
    stackIndex: 4,
    assembledY: -0.05,
    deconstructedY: -1.5,
    deconstructedOffset: [-0.85, -0.4],
    color: "#c0392b",
    modelUrl: "/models/ingredients/tomato.glb",
    modelScale: 1.0,
    modelYOffset: 0,
  },
  {
    id: "sauce",
    label: "SAUCE",
    spec: "EMBER GLAZE",
    geometry: "sauce",
    stackIndex: 5,
    assembledY: -0.3,
    deconstructedY: -2.6,
    deconstructedOffset: [0.5, -0.6],
    color: "#7a3410",
    emissive: "#e8611f",
    modelUrl: "/models/ingredients/sauce.glb",
    modelScale: 1.0,
    modelYOffset: 0,
  },
  {
    id: "bottomBun",
    label: "BOTTOM BUN",
    spec: "TOASTED BRIOCHE",
    geometry: "flatBun",
    stackIndex: 6,
    assembledY: -0.75,
    deconstructedY: -4.0,
    deconstructedOffset: [0, 0],
    color: "#d9a15a",
    modelUrl: "/models/ingredients/bottom-bun.glb",
    modelScale: 1.0,
    modelYOffset: 0,
  },
];

export const ingredientById = (id: IngredientId) =>
  INGREDIENTS.find((i) => i.id === id)!;
