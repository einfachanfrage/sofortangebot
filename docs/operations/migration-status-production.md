# Migrationsstand Produktion

Stand: 26. Juli 2026

Produktionsprojekt: `yqlledouhfovytifeekd`

## Aktueller Stand

- Im Repository liegen 50 versionierte SQL-Migrationen.
- Staging und Produktion wurden erfolgreich auf diesen Stand gebracht.
- Der produktive Migrationslauf `30212741740` enthält den dokumentierten
  Vorher-/Nachher-Abgleich.
- Direkt davor wurde mit Lauf `30212671223` ein verschlüsseltes
  Produktionsbackup erstellt.
- Die Katalogbereinigung hat ausschließlich echte Dubletten derselben
  Kategorie, Bezeichnung und Einheit zusammengeführt. Gleichnamige Leistungen
  verschiedener Gewerke oder Kategorien bleiben getrennt.

## Verbindlicher Nachweis

Der Workflow **Database migrations** besitzt einen sicheren `audit`-Modus.
Dieser liest den Ledger, ohne Migrationen anzuwenden. Ein Lauf mit
`operation: apply` erzeugt:

- `migration-status-production-before.txt`
- `migration-status-production-after.txt`

Beide Dateien werden 365 Tage als GitHub-Artefakt aufbewahrt. Voraussetzung
ist das Secret `PRODUCTION_DB_URL` im GitHub-Environment `production`.

## Betriebsnachweis vom 26. Juli 2026

- [x] `PRODUCTION_DB_URL` in GitHub `production` hinterlegt
- [x] Stagingprojekt eingerichtet und getrennt von Produktion betrieben
- [x] Staging-Migrationslauf erfolgreich: `30212492110`
- [x] Frisches verschlüsseltes Produktionsbackup erfolgreich:
      `30212671223`
- [x] Maler-Katalog vollständig eingespielt
- [x] Boden-Katalog vollständig eingespielt
- [x] Exakte Dubletten bereinigt und Referenzen in Angeboten erhalten
- [x] Eindeutigkeitsregel auf Kategorie + Bezeichnung + Einheit aktiviert
- [x] Kataloge aller Betriebe mit dem aktuellen Standardbestand abgeglichen
- [x] Produktions-Migrationslauf erfolgreich: `30212741740`
- [x] Produktionsoberfläche lädt den vollständigen Katalog statt nur der
      ersten 1.000 Datenbankzeilen

## Frühere Nachweise

- Erstes verschlüsseltes Produktionsbackup: `30204132535`
- Historienabgleich mit Vorher-/Nachher-Artefakt: `30210419583`
- Staging-Aktualisierung auf den vorherigen 47er-Stand: `30211822002`
- Backup vor dem Boden-Rollout: `30211884170`
- Boden-Produktionslauf: `30211961102`
