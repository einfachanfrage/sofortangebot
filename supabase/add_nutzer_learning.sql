-- Nutzer-spezifisches Learning: Persönliches Wörterbuch

CREATE TABLE IF NOT EXISTS nutzer_begriffe (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Wer
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  betrieb_id UUID,

  -- Was der Nutzer sagt (normalisiert: lowercase, trimmed, Umlaute)
  begriff TEXT NOT NULL,

  -- Was es bedeutet
  position_id TEXT NOT NULL,

  -- Gewerk-Kontext (optional)
  gewerk_id TEXT,

  -- Statistik
  match_count INT DEFAULT 1,
  bestaetigt_count INT DEFAULT 0,
  korrektur_count INT DEFAULT 0,

  -- Status: 'lernend' | 'bestaetigt' | 'deaktiviert'
  status TEXT DEFAULT 'lernend',

  -- Meta
  zuletzt_verwendet TIMESTAMP WITH TIME ZONE DEFAULT now(),
  erstellt_am TIMESTAMP WITH TIME ZONE DEFAULT now(),

  UNIQUE(user_id, begriff, gewerk_id)
);

CREATE INDEX IF NOT EXISTS idx_nutzer_begriffe_lookup
  ON nutzer_begriffe(user_id, gewerk_id, status);

CREATE INDEX IF NOT EXISTS idx_nutzer_begriffe_begriff
  ON nutzer_begriffe(user_id, begriff, status);

-- RLS
ALTER TABLE nutzer_begriffe ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='nutzer_begriffe'
    AND policyname='nutzer_sehen_eigene_begriffe'
  ) THEN
    CREATE POLICY "nutzer_sehen_eigene_begriffe"
    ON nutzer_begriffe FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- ── Begriff nachschlagen ──────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION lookup_nutzer_begriff(
  p_user_id UUID,
  p_begriff TEXT,
  p_gewerk_id TEXT DEFAULT NULL
)
RETURNS TABLE (
  position_id TEXT,
  match_count INT,
  bestaetigt_count INT,
  status TEXT,
  konfidenz NUMERIC
)
LANGUAGE sql
AS $$
  SELECT
    position_id,
    match_count,
    bestaetigt_count,
    status,
    CASE
      WHEN status = 'bestaetigt' THEN 0.95
      WHEN bestaetigt_count >= 2  THEN 0.80
      WHEN match_count >= 2       THEN 0.70
      ELSE 0.60
    END AS konfidenz
  FROM nutzer_begriffe
  WHERE user_id = p_user_id
    AND status != 'deaktiviert'
    AND begriff = lower(trim(p_begriff))
  ORDER BY
    CASE WHEN gewerk_id = p_gewerk_id THEN 0 ELSE 1 END,
    bestaetigt_count DESC
  LIMIT 1;
$$;

-- ── Match bestätigen (nach Angebot-Versand / implizite Bestätigung) ──────────

CREATE OR REPLACE FUNCTION bestatige_nutzer_match(
  p_user_id UUID,
  p_betrieb_id UUID,
  p_begriff TEXT,
  p_position_id TEXT,
  p_gewerk_id TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO nutzer_begriffe (
    user_id, betrieb_id, begriff, position_id, gewerk_id,
    match_count, bestaetigt_count, status
  )
  VALUES (
    p_user_id, p_betrieb_id,
    lower(trim(p_begriff)),
    p_position_id, p_gewerk_id,
    1, 1, 'lernend'
  )
  ON CONFLICT (user_id, begriff, gewerk_id)
  DO UPDATE SET
    match_count       = nutzer_begriffe.match_count + 1,
    bestaetigt_count  = nutzer_begriffe.bestaetigt_count + 1,
    zuletzt_verwendet = now(),
    status = CASE
      WHEN nutzer_begriffe.bestaetigt_count >= 2 THEN 'bestaetigt'
      ELSE nutzer_begriffe.status
    END;
END;
$$;

-- ── Korrektur registrieren (explizites Lernsignal) ───────────────────────────

CREATE OR REPLACE FUNCTION registriere_korrektur(
  p_user_id UUID,
  p_betrieb_id UUID,
  p_begriff TEXT,
  p_alter_position_id TEXT,
  p_neuer_position_id TEXT,
  p_gewerk_id TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Alten Match abwerten
  UPDATE nutzer_begriffe
  SET
    korrektur_count = korrektur_count + 1,
    status = CASE
      WHEN korrektur_count >= 2 THEN 'deaktiviert'
      ELSE status
    END
  WHERE user_id = p_user_id
    AND begriff = lower(trim(p_begriff))
    AND position_id = p_alter_position_id;

  -- Neuen Match sofort als bestätigt speichern
  INSERT INTO nutzer_begriffe (
    user_id, betrieb_id, begriff, position_id, gewerk_id,
    match_count, bestaetigt_count, status
  )
  VALUES (
    p_user_id, p_betrieb_id,
    lower(trim(p_begriff)),
    p_neuer_position_id, p_gewerk_id,
    3, 3, 'bestaetigt'
  )
  ON CONFLICT (user_id, begriff, gewerk_id)
  DO UPDATE SET
    position_id       = p_neuer_position_id,
    match_count       = nutzer_begriffe.match_count + 3,
    bestaetigt_count  = nutzer_begriffe.bestaetigt_count + 3,
    status            = 'bestaetigt',
    korrektur_count   = 0,
    zuletzt_verwendet = now();
END;
$$;
