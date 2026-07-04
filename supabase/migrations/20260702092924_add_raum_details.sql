-- Raum-Dimensionen für live Neuberechnung der Positionen
ALTER TABLE quotes
  ADD COLUMN IF NOT EXISTS raum_details JSONB DEFAULT '{}';
