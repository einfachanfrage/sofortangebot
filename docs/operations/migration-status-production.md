# Migrationsstand Produktion

Stand: 26. Juli 2026

Produktionsprojekt: `yqlledouhfovytifeekd`

## Was sicher belegt ist

- Im Repository liegen 47 versionierte SQL-Migrationen.
- Die produktive Anwendung verwendet Datenbankobjekte aus den jüngsten
  Migrationen, und deren fachliche Wirkung wurde bei den letzten
  Produktionsprüfungen kontrolliert.
- Der vollständige, direkt aus `supabase_migrations.schema_migrations`
  gelesene Vorher-/Nachher-Stand liegt als unveränderliches Workflow-Artefakt
  des Produktionslaufs `30210419583` vor.
- Die Historie wurde erst nach einem inhaltlichen Kernobjektcheck abgeglichen;
  drei tatsächlich fehlende Migrationen wurden regulär ausgeführt.

## Verbindlicher Nachweis

Der Workflow **Database migrations** besitzt einen sicheren `audit`-Modus.
Dieser liest den Ledger, ohne Migrationen anzuwenden. Ein Lauf mit
`operation: apply` erzeugt:

- `migration-status-production-before.txt`
- `migration-status-production-after.txt`

Der Vorher-Stand dokumentiert exakt die bereits ausgeführten Migrationen. Der
Nachher-Stand dokumentiert den Stand nach dem kontrollierten Abgleich. Beide
Dateien werden 365 Tage als GitHub-Artefakt aufbewahrt.

Voraussetzung ist das Secret `PRODUCTION_DB_URL` im GitHub-Environment
`production`. Nach dem ersten erfolgreichen Lauf werden Datum, Workflow-Run
und Ergebnis hier ergänzt.

## Betriebsnachweis vom 26. Juli 2026

- [x] `PRODUCTION_DB_URL` in GitHub `Production` hinterlegt
- [x] Verschlüsseltes Produktionsbackup erfolgreich erstellt:
      GitHub Actions Run `30204132535`, Artefakt
      `production-db-30204132535`
- [x] Stagingprojekt aus `supabase/schema.sql` initialisiert und danach auf
      alle 47 versionierten Migrationen aktualisiert:
      zuletzt GitHub Actions Run `30211822002`
- [x] Produktiven Kernobjektbestand vor dem Historienabgleich mit
      `supabase/check_migrationen.sql` geprüft
- [x] Nachweislich vorhandene Altänderungen einmalig in
      `supabase_migrations.schema_migrations` abgeglichen
- [x] Drei tatsächlich fehlende Altänderungen regulär angewendet:
      `20260613213937`, `20260614192523`, `20260720183000`
- [x] Vollständigen Maler-Katalog mit Migration
      `20260726183000_complete_maler_catalog` angewendet
- [x] Frisches verschlüsseltes Produktionsbackup vor dem Boden-Rollout:
      GitHub Actions Run `30211884170`
- [x] Vollständigen Boden-Katalog mit Migration
      `20260726190000_complete_boden_catalog` angewendet
- [x] Boden-Produktionslauf erfolgreich:
      GitHub Actions Run `30211961102`
- [x] Produktionslauf erfolgreich:
      GitHub Actions Run `30210419583`
- [x] Vorher-/Nachher-Stand als Artefakt
      `migration-status-production-30210419583` gespeichert
