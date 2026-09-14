import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // CoS-P-018 (Platform & Integrations Engineer, 2026-09-14): ohne `files`
    // galt dieses Objekt für ALLE Dateien, auch solche außerhalb des Musters,
    // für das eslint-config-next das react-hooks-Plugin überhaupt anmeldet
    // (node_modules/eslint-config-next/dist/index.js, Zeile 110–121: nur
    // **/*.{js,jsx,mjs,ts,tsx,mts,cts}). Dort bricht ESLint beim Config-Aufbau
    // ab, sobald es auf die react-hooks/*-Regeln trifft, weil das Plugin für
    // diese Dateien nicht registriert ist. Funktionierte, solange
    // eslint-plugin-react-hooks nicht installiert war (dann griffen die
    // Regeln nirgends) — brach mit einem `npm install` um den 11.09. herum,
    // als eslint-config-next@16.2.7 das Plugin zog (^7.0.0, offener Bereich).
    // Gleiches Dateimuster wie das next-Objekt, damit die Regeln nur dort
    // gelten, wo das Plugin auch registriert ist.
    files: ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"],
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
    // CoS-P-018 (Platform & Integrations Engineer, 2026-09-14): _to_delete/
    // ist bereits in .gitignore als Wegwerf-Ordner markiert (alte
    // Diagnose-Skripte, Git-Lock-Reste, Entwürfe) — nur historisch schon vor
    // der .gitignore-Regel eingecheckt und deshalb weiter getrackt. Mit dem
    // files-Scope oben (react-hooks/*) läuft ESLint jetzt tatsächlich über
    // diese Dateien statt vorher abzubrechen, und findet darin u. a. drei
    // echte Fehler in einem alten Wegwerf-Diagnoseskript
    // (_to_delete/diag-20260911/check-bucket.cjs) — die hätten die CI wieder
    // rot gemacht. Kein Löschen (dafür fehlt mir von hier aus der Zugriff,
    // s. Nachtrag), nur konsequent von der Prüfung ausgenommen, wie es die
    // .gitignore-Absicht ohnehin vorsieht.
    "_to_delete/**",
  ]),
]);

export default eslintConfig;
