# Datenbankbetrieb und Umgebungen

## Feste Trennung

| Umgebung | Git-Branch | Vercel | Supabase | Zahlungsdaten |
|---|---|---|---|---|
| Entwicklung | Feature-Branch | lokal | lokales Supabase | Testdaten |
| Staging | `develop` | Preview/Staging-Domain | eigenes Staging-Projekt | ausschließlich Stripe-Testmodus |
| Produktion | `main` | Production / `www.sofortangebot.app` | Projekt `yqlledouhfovytifeekd` | Live-Daten |

Staging darf niemals Produktionsschlüssel oder eine Produktions-Datenbank-URL
verwenden. Produktionsdaten werden nicht nach Staging kopiert. Reproduzierbare
Testdaten liegen in `supabase/seed-staging.sql`.

## GitHub-Environments und Secrets

In GitHub unter **Settings → Environments** anlegen:

### `staging`

- `STAGING_DB_URL`: direkte oder Session-Pooler-Postgres-URL des Stagingprojekts

### `production-backup`

- `PRODUCTION_DB_URL`: direkte oder Session-Pooler-Postgres-URL der Produktion
- `BACKUP_PASSPHRASE`: zufällige Passphrase mit mindestens 32 Zeichen; separat
  im Passwortmanager aufbewahren

### `production`

- `PRODUCTION_DB_URL`: direkte oder Session-Pooler-Postgres-URL der Produktion

Für `production` sind Required Reviewers empfehlenswert. `production-backup`
hat bewusst keine Required Reviewers, damit der tägliche Zeitplan ohne
manuelle Freigabe läuft. Die Zugangsdaten bleiben trotzdem auf den
Backup-Workflow beschränkt.

## Migrationen

1. Migration lokal als neue Datei in `supabase/migrations/` anlegen.
2. Feature-Branch nach `develop` mergen.
3. Der Workflow `Database migrations` spielt sie automatisch auf Staging.
4. Staging fachlich testen.
5. `develop` nach `main` mergen.
6. Workflow manuell mit Ziel `production` und Bestätigung
   `DEPLOY-PRODUCTION` starten.

Jeder Lauf speichert die Ausgabe von `supabase migration list` **vor und nach**
dem Anwenden als GitHub-Artefakt:

- Staging: 90 Tage
- Produktion: 365 Tage

Damit ist dokumentiert, welche Migration vor dem Lauf bereits remote
ausgeführt war und welche durch den Lauf hinzugekommen ist.
`supabase/check_migrationen.sql` bleibt der zusätzliche inhaltliche
Kontrollcheck für Kernobjekte.

Der aktuell belegbare Ausgangsstand steht in
[`migration-status-production.md`](migration-status-production.md). Diese
Datei darf erst anhand einer direkten Datenbankabfrage oder eines
Workflow-Artefakts aktualisiert werden, nicht aufgrund bloß vorhandener
Migrationsdateien.

## Backups

`Production database backup` läuft täglich um 02:17 UTC und kann manuell
gestartet werden. Der Ablauf:

1. `pg_dump` im Custom-Format
2. Integritätsprüfung mit `pg_restore --list`
3. AES-256-Verschlüsselung mit PBKDF2
4. SHA-256-Prüfsumme
5. Speicherung als GitHub-Artefakt für 30 Tage
6. unverschlüsseltes Dump wird vor dem Upload gelöscht

Die Passphrase gehört nicht ins Repository und muss unabhängig von GitHub im
Passwortmanager liegen. Ein Backup gilt erst als belastbar, wenn mindestens
ein Test-Restore in das Stagingprojekt erfolgreich durchgeführt wurde.

## Restore-Test

Mindestens monatlich:

1. Backup-Artefakt herunterladen.
2. Prüfsumme validieren.
3. Dump mit der Passphrase entschlüsseln.
4. In eine leere temporäre Staging-Datenbank zurückspielen.
5. Tabellenanzahlen und einen vollständigen Angebotsablauf prüfen.
6. Datum und Ergebnis im Betriebsprotokoll festhalten.

Supabase-Datenbankbackups enthalten keine gelöschten Storage-Dateien. Für
Uploads und Angebotsfotos ist deshalb langfristig eine separate
Storage-Sicherung erforderlich.
