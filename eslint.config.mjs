import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Historische Extraktions-Engines verarbeiten dynamische KI-Payloads.
      // Die Stellen bleiben sichtbar, blockieren das CI aber nicht.
      "@typescript-eslint/no-explicit-any": "warn",
      // Deutsche UI-Texte dürfen typografische Zeichen direkt enthalten.
      "react/no-unescaped-entities": "off",
      // Legacy-Komponenten nutzen gültiges Function-Hoisting und bewusstes
      // Client-Hydrating. Sichtbar halten und schrittweise refactoren.
      "react-hooks/immutability": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  {
    files: ["*.config.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
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
