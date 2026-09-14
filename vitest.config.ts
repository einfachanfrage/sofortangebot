import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    // Nur was unter `src/` liegt, ist ein Test dieses Projekts.
    //
    // Ohne diese Zeile durchsucht vitest den ganzen Projektordner. Am
    // 12.09.2026 hat es deshalb zwei Dateien mitgefahren, die dort nur
    // herumliegen: eine Kopie von `titel-vertraege.test.ts` im Ordner
    // „Claude outputs" (gelieferte Dateien landen dort — sie scheitert an
    // ihren relativen Importen und macht die Suite rot, obwohl das Original
    // unter `src/` grün ist) und `_to_delete/zz-diag.test.ts`, eine alte
    // Diagnose. Beides sind keine Testergebnisse, sondern Ablage.
    //
    // Eine rote Suite, die nichts über den Code aussagt, ist schlimmer als
    // gar keine: Sie gewöhnt einem das Hinschauen ab.
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
