-- Kleinmaterial-Pauschale pro Betrieb konfigurierbar
-- Ausführen im Supabase SQL Editor
--
-- NULL = Gewerk-Standardwerte verwenden (z.B. Maler: 25 € ab 200 € Auftragswert)
-- Format: { "aktiv": true, "betrag_eur": 25, "schwelle_eur": 200, "bezeichnung": "Kleinmaterial und Verbrauchsmaterial" }

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS kleinmaterial_config JSONB DEFAULT NULL;
