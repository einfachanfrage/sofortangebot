-- An- und Abfahrt-Pauschale pro Betrieb konfigurierbar
-- Ausführen im Supabase SQL Editor
--
-- NULL = Standard (aus). Format: { "aktiv": true, "betrag_eur": 45, "bezeichnung": "An- und Abfahrt" }

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS anfahrt_config JSONB DEFAULT NULL;
