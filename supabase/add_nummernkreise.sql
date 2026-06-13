-- Angebotsnummern-System (GoBD-konform)
-- Ausführen im Supabase SQL Editor

-- 1. Nummernkreise ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS nummernkreise (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  betrieb_id      UUID REFERENCES companies(id) ON DELETE CASCADE,
  typ             TEXT NOT NULL CHECK (typ IN ('angebot', 'rechnung')),
  prefix          TEXT DEFAULT '',
  jahr_aktiv      INT,          -- z.B. 2026; NULL = kein Jahr
  trennzeichen    TEXT DEFAULT '-',
  naechste_nummer INT DEFAULT 1,
  min_stellen     INT DEFAULT 3,
  letztes_update  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(betrieb_id, typ)
);

ALTER TABLE nummernkreise ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nummernkreise_own" ON nummernkreise
  USING (betrieb_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));

-- 2. Vergebene Nummern (Audit-Trail, GoBD) ──────────────────────────────
CREATE TABLE IF NOT EXISTS vergebene_nummern (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  betrieb_id      UUID REFERENCES companies(id) ON DELETE CASCADE,
  typ             TEXT NOT NULL,
  nummer          TEXT NOT NULL,
  sequenz_nummer  INT NOT NULL,
  angebot_id      UUID REFERENCES quotes(id) ON DELETE SET NULL,
  vergeben_am     TIMESTAMPTZ DEFAULT now(),
  storniert       BOOLEAN DEFAULT false,
  UNIQUE(betrieb_id, typ, nummer)
);

ALTER TABLE vergebene_nummern ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vergebene_nummern_own" ON vergebene_nummern
  USING (betrieb_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));

-- 3. Angebote: Nummerspalte + Briefpapier-Spalte ────────────────────────
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS angebotsnummer TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS briefpapier_id UUID;
-- (REFERENCES briefpapiere(id) wird nach Tabelle briefpapiere ergänzt)

-- 4. Atomic Nummernvergabe (RPC) ────────────────────────────────────────
CREATE OR REPLACE FUNCTION vergib_naechste_nummer(
  p_betrieb_id UUID,
  p_typ        TEXT,
  p_angebot_id UUID
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_kreis          nummernkreise%ROWTYPE;
  v_sequenz        INT;
  v_nummer         TEXT;
  v_sequenz_str    TEXT;
BEGIN
  -- Nummernkreis sperren (FOR UPDATE verhindert Race Condition)
  SELECT * INTO v_kreis
  FROM nummernkreise
  WHERE betrieb_id = p_betrieb_id
    AND typ = p_typ
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Kein Nummernkreis gefunden für typ=%', p_typ;
  END IF;

  v_sequenz     := v_kreis.naechste_nummer;
  v_sequenz_str := LPAD(v_sequenz::TEXT, v_kreis.min_stellen, '0');

  -- Vollständige Nummer aufbauen
  v_nummer := '';
  IF v_kreis.prefix != '' THEN
    v_nummer := v_kreis.prefix || v_kreis.trennzeichen;
  END IF;
  IF v_kreis.jahr_aktiv IS NOT NULL THEN
    v_nummer := v_nummer || v_kreis.jahr_aktiv::TEXT || v_kreis.trennzeichen;
  END IF;
  v_nummer := v_nummer || v_sequenz_str;

  -- Sequenz hochzählen
  UPDATE nummernkreise
  SET naechste_nummer = v_sequenz + 1,
      letztes_update  = now()
  WHERE betrieb_id = p_betrieb_id
    AND typ = p_typ;

  -- Vergabe dokumentieren
  INSERT INTO vergebene_nummern (betrieb_id, typ, nummer, sequenz_nummer, angebot_id)
  VALUES (p_betrieb_id, p_typ, v_nummer, v_sequenz, p_angebot_id);

  -- Angebotsnummer auf Quote speichern
  UPDATE quotes
  SET angebotsnummer = v_nummer
  WHERE id = p_angebot_id;

  RETURN v_nummer;
END;
$$;

-- 5. Jahreswechsel-Cron (pg_cron) ─────────────────────────────────────
-- Nur ausführen wenn pg_cron Extension aktiv ist:
-- SELECT cron.schedule(
--   'jahreswechsel-nummernkreis',
--   '0 0 1 1 *',
--   $$
--     UPDATE nummernkreise
--     SET naechste_nummer = 1,
--         jahr_aktiv = EXTRACT(YEAR FROM now())::INT
--     WHERE jahr_aktiv IS NOT NULL;
--   $$
-- );

-- 6. Briefpapiere ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS briefpapiere (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  betrieb_id       UUID REFERENCES companies(id) ON DELETE CASCADE,
  name             TEXT NOT NULL,
  ist_standard     BOOLEAN DEFAULT false,

  -- Firmeninfo (kann vom Hauptbetrieb abweichen)
  firmenname       TEXT,
  zusatz           TEXT,
  strasse          TEXT,
  plz              TEXT,
  ort              TEXT,
  telefon          TEXT,
  email            TEXT,
  website          TEXT,

  -- Logo
  logo_url         TEXT,
  logo_position    TEXT DEFAULT 'links',
  logo_groesse     TEXT DEFAULT 'mittel',

  -- Design
  akzentfarbe      TEXT DEFAULT '#F5C400',

  -- Fußzeile
  fusszeile_links  TEXT,
  fusszeile_mitte  TEXT,
  fusszeile_rechts TEXT,

  -- Schrift
  schrift          TEXT DEFAULT 'inter',

  erstellt_am      TIMESTAMPTZ DEFAULT now(),
  aktualisiert_am  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE briefpapiere ENABLE ROW LEVEL SECURITY;

CREATE POLICY "briefpapiere_own" ON briefpapiere
  USING (betrieb_id IN (SELECT id FROM companies WHERE user_id = auth.uid()));

-- FK nachrüsten (quotes.briefpapier_id → briefpapiere)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'quotes_briefpapier_id_fkey'
  ) THEN
    ALTER TABLE quotes
      ADD CONSTRAINT quotes_briefpapier_id_fkey
      FOREIGN KEY (briefpapier_id) REFERENCES briefpapiere(id) ON DELETE SET NULL;
  END IF;
END$$;

-- 7. Hilfsfunktion: Standard-Nummernkreis anlegen ────────────────────
CREATE OR REPLACE FUNCTION init_nummernkreise(p_betrieb_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO nummernkreise (betrieb_id, typ, prefix, jahr_aktiv, trennzeichen, naechste_nummer, min_stellen)
  VALUES
    (p_betrieb_id, 'angebot',  'AG', EXTRACT(YEAR FROM now())::INT, '-', 1, 3),
    (p_betrieb_id, 'rechnung', 'RE', EXTRACT(YEAR FROM now())::INT, '-', 1, 3)
  ON CONFLICT (betrieb_id, typ) DO NOTHING;
END;
$$;
