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

Der erste manuelle Lauf von **Database migrations** mit Ziel `production`
erzeugt:

- `migration-status-production-before.txt`
- `migration-status-production-after.txt`

Der Vorher-Stand dokumentiert exakt die bereits ausgeführten Migrationen. Der
Nachher-Stand dokumentiert den Stand nach dem kontrollierten Abgleich. Beide
Dateien werden 365 Tage als GitHub-Artefakt aufbewahrt.

Voraussetzung ist das Secret `PRODUCTION_DB_URL` im GitHub-Environment
`production`. Nach dem ersten erfolgreichen Lauf werden Datum, Workflow-Run
und Ergebnis hier ergänzt.

## Offener Betriebsnachweis

- [ ] `PRODUCTION_DB_URL` in GitHub `production` hinterlegen
- [ ] Workflow erstmals mit `DEPLOY-PRODUCTION` ausführen
- [ ] Vorher-/Nachher-Artefakt prüfen
- [ ] Run-ID und bestätigten Stand in diesem Dokument ergänzen
- [ ] `supabase/check_migrationen.sql` zusätzlich ausführen
