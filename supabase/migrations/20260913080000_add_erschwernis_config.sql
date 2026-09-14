-- Erschwerniszuschläge je Betrieb abschaltbar (CoS-E-040 / TN-097)
-- Ausführen im Supabase SQL Editor
--
-- Manfred: „Erschwerniszuschläge ‚Altbau'/‚bewohnt' lassen sich in den
-- Einstellungen nirgends abschalten." Ein Betrieb, der ausschließlich im
-- Altbau arbeitet, hat den Aufwand längst im Quadratmeterpreis und löscht
-- die Position in jedem Angebot von Hand.
--
-- NULL = nie eingestellt = ALLE an (bisheriges Verhalten; ein Update darf
-- niemandem still einen Zuschlag wegnehmen, den er bisher bekommen hat).
-- Format: { "altbau": false, "denkmalschutz": true, "bewohnt": false,
--           "untergrund": true, "raumhoehe": true }
-- Fehlt ein Schlüssel, gilt der Zuschlag als eingeschaltet.

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS erschwernis_config JSONB DEFAULT NULL;

COMMENT ON COLUMN companies.erschwernis_config IS
  'Welche Erschwerniszuschläge automatisch vorgeschlagen werden. NULL = alle.';
