-- Logging-Felder für Zahlen-Erkennung + Multi-Raum-Parsing
-- Führe dieses Script in Supabase SQL Editor aus

ALTER TABLE entwurf_aufnahmen
  ADD COLUMN IF NOT EXISTS transkript_original text,
  ADD COLUMN IF NOT EXISTS transkript_verarbeitet text,
  ADD COLUMN IF NOT EXISTS hat_normalisierung boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS hat_raumwechsel boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS segment_anzahl integer,
  ADD COLUMN IF NOT EXISTS zahlen_ersetzt integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS konfidenz_whisper numeric(4,2);

COMMENT ON COLUMN entwurf_aufnahmen.transkript_original IS 'Rohtext von Whisper, vor jeder Verarbeitung';
COMMENT ON COLUMN entwurf_aufnahmen.transkript_verarbeitet IS 'Text nach Zahlwort-Ersetzung + Raum-Segmentierung';
COMMENT ON COLUMN entwurf_aufnahmen.hat_normalisierung IS 'True wenn transkript-normalisierer Änderungen vorgenommen hat';
COMMENT ON COLUMN entwurf_aufnahmen.hat_raumwechsel IS 'True wenn mehr als ein Raum-Segment erkannt wurde';
COMMENT ON COLUMN entwurf_aufnahmen.segment_anzahl IS 'Anzahl erkannter Raum-Segmente';
COMMENT ON COLUMN entwurf_aufnahmen.zahlen_ersetzt IS 'Anzahl ersetzter Zahlwörter';
COMMENT ON COLUMN entwurf_aufnahmen.konfidenz_whisper IS 'Durchschnittliche avg_logprob aus Whisper verbose_json';
