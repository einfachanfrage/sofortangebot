# Migrationsstand Produktion

Stand: 26. Juli 2026

Produktionsprojekt: `yqlledouhfovytifeekd`

## Was sicher belegt ist

- Im Repository liegen 45 versionierte SQL-Migrationen.
- Die produktive Anwendung verwendet Datenbankobjekte aus den jüngsten
  Migrationen, und deren fachliche Wirkung wurde bei den letzten
  Produktionsprüfungen kontrolliert.
- Ein vollständiger, direkt aus `supabase_migrations.schema_migrations`
  gelesener Ledger liegt im Repository noch nicht vor.

Deshalb werden die 45 Dateien hier **nicht pauschal als ausgeführt markiert**.
Das Vorhandensein einer Datei beweist nicht, dass sie in Produktion angewendet
wurde.

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
- [x] Stagingprojekt aus `supabase/schema.sql` initialisiert und alle
      45 versionierten Migrationen angewendet:
      GitHub Actions Run `30204381894`
- [ ] Produktions-Audit nach Korrektur des Environment-Secrets erneut
      erfolgreich ausführen
- [ ] Erst danach über einen Produktionslauf mit `operation: apply` und
      `DEPLOY-PRODUCTION` entscheiden
- [ ] Vorher-/Nachher-Artefakt prüfen
- [ ] Run-ID und bestätigten Stand in diesem Dokument ergänzen
- [ ] `supabase/check_migrationen.sql` zusätzlich ausführen
