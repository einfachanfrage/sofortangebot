-- Struktur/Gliederung des Angebots pro Betrieb wählbar
-- Ausführen im Supabase SQL Editor
--
--   'raeume'      = nach Räumen gruppiert (Default, bisheriges Verhalten)
--   'arbeitsablauf' = nach Arbeitsablauf: Vorarbeiten → Hauptarbeit → Finish
--   'gewerk'      = nach Gewerk gruppiert (erst alle Maler-, dann alle Bodenarbeiten)

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS angebot_struktur TEXT NOT NULL DEFAULT 'raeume'
    CHECK (angebot_struktur IN ('raeume', 'arbeitsablauf', 'gewerk'));
