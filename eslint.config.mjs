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
    // Generated / local artifacts:
    "coverage/**",
    "node_modules/**",
  ]),
  {
    // Tooling config files are CommonJS by design (Next, Jest, Tailwind load
    // them through require).
    files: ["*.config.js", "*.config.ts", "*.config.mjs", "scripts/**/*.mjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    // Tests use loose mocks on purpose.
    files: ["__tests__/**/*.{ts,tsx}", "jest.setup.js"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    rules: {
      // Allow explicitly-unused parameters/variables (prefixed with `_`).
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
      // The app intentionally loads data in effects (client-side fetch with
      // loading/error state). The React Compiler rule is stricter than this
      // data-fetching pattern allows, so it is reported as a warning.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
