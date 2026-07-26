# Datenbank-Migrationen

Alle Schema-Änderungen liegen hier — eine Datei pro Änderung, mit Zeitstempel-Präfix
(`YYYYMMDDHHMMSS_beschreibung.sql`). Die Reihenfolge der Dateinamen ist die
Ausführungs-Reihenfolge.

## Workflow

**Neue Migration anlegen:**
1. Datei hier erstellen: `YYYYMMDDHHMMSS_was_es_tut.sql` (Zeitstempel = jetzt)
2. Idempotent schreiben — muss bei doppelter Ausführung fehlerfrei durchlaufen:
   - `CREATE TABLE IF NOT EXISTS …`
   - `ADD COLUMN IF NOT EXISTS …`
   - `CREATE OR REPLACE FUNCTION …`
   - Policies absichern: `DROP POLICY IF EXISTS "name" ON tabelle;` vor `CREATE POLICY`
3. Im Supabase SQL-Editor ausführen (Produktion)
4. **Repräsentatives Objekt in `../check_migrationen.sql` ergänzen** (eine Zeile im VALUES-Block).
   Der Check muss mit derselben laufenden Nummer wie die Migration enden.

**Status prüfen — welche Migrationen fehlen noch?**
Inhalt von [`../check_migrationen.sql`](../check_migrationen.sql) im Supabase
SQL-Editor ausführen. Jede Zeile mit `❌ FEHLT` muss noch ausgeführt werden.

## Weitere Dateien in `supabase/`

| Datei | Zweck |
|---|---|
| `schema.sql` | Historisches Basis-Schema; danach immer alle Migrationen in Reihenfolge anwenden |
| `check_migrationen.sql` | Status-Check (siehe oben) |
| `seed-staging.sql` | Testdaten für Staging |
| `functions/` | Edge Functions (Deno) |

## Hinweise

- `alle_migrationen.sql` (veralteter Sammel-Dump) wurde im Juli 2026 entfernt —
  die Einzeldateien hier sind die einzige Quelle der Wahrheit.
- `schema.sql` ersetzt die Migrationen nicht. Ein neues Projekt ist erst nach
  Anwendung aller Einzelmigrationen auf dem aktuellen Stand.
- Bekannte Stolperfalle: `CREATE POLICY` ohne vorheriges `DROP POLICY IF EXISTS`
  bricht bei erneuter Ausführung mit Fehler 42710 ab — dann läuft der **Rest der
  Datei nicht mehr**! (So ist im Juni 2026 die `check_rate_limit`-Funktion aus
  `add_rate_limiting.sql` verloren gegangen.)
