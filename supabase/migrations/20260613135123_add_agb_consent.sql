-- AGB-Zustimmung: Rechtssicherer Nachweis
-- Ausführen in Supabase SQL Editor

-- Option A: Über auth.users user_metadata (automatisch durch App gesetzt)
-- Die Felder agb_akzeptiert_am und agb_version werden beim Signup und bei
-- AGB-Updates automatisch in auth.users.raw_user_meta_data gespeichert.
-- Kein ALTER TABLE nötig — Supabase speichert user_metadata als JSONB.

-- Option B: Separate Spalten in der companies-Tabelle (empfohlen für Audits)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS agb_akzeptiert_am TIMESTAMPTZ;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS agb_version TEXT;

-- Nach Ausführung: Bestehende Nutzer beim nächsten Login per Modal abfragen.
-- Neue Nutzer: Werte werden beim Signup via user_metadata gesetzt und können
-- hier nachgezogen werden (z.B. per Trigger oder manuell).
