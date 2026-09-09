import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // react-hooks' new purity/immutability rules assume plain React
    // render-phase code. react-three-fiber's useFrame callbacks run in
    // R3F's own imperative render loop, entirely outside React's render
    // phase, so mutating a ref'd object3D (camera, mesh transforms) or
    // seeding one-off randomized particle data inside useMemo are the
    // correct, standard patterns here rather than violations.
    files: ["components/scene/**/*.{ts,tsx}", "lib/burger-transform.ts"],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
