import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local working dirs: the wget mirror of the old WordPress site and the
    // extraction scratch space. Linting the mirror's minified vendor bundles
    // produced 127 of the project's 135 warnings.
    "_source/**",
    "_content/**",
  ]),
]);

export default eslintConfig;
