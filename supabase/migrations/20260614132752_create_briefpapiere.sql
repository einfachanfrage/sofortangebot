-- Briefpapier-Varianten pro Betrieb
CREATE TABLE IF NOT EXISTS briefpapiere (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  betrieb_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name            TEXT NOT NULL DEFAULT 'Standard',
  ist_standard    BOOLEAN NOT NULL DEFAULT FALSE,

  -- Firmendaten (können vom Betriebsprofil abweichen)
  firmenname      TEXT,
  zusatz          TEXT,
  strasse         TEXT,
  plz             TEXT,
  ort             TEXT,
  telefon         TEXT,
  email           TEXT,
  website         TEXT,

  -- Logo
  logo_url        TEXT,
  logo_position   TEXT NOT NULL DEFAULT 'links' CHECK (logo_position IN ('links', 'mitte', 'rechts')),
  logo_groesse    TEXT NOT NULL DEFAULT 'mittel' CHECK (logo_groesse IN ('klein', 'mittel', 'gross')),

  -- Design
  akzentfarbe     TEXT NOT NULL DEFAULT '#F5C400',
  schrift         TEXT NOT NULL DEFAULT 'inter' CHECK (schrift IN ('inter', 'roboto', 'opensans')),

  -- Fußzeile (3 Spalten)
  fusszeile_links  TEXT,
  fusszeile_mitte  TEXT,
  fusszeile_rechts TEXT,

  erstellt_am     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  aktualisiert_am TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pro Betrieb max. 1 Standard-Briefpapier sicherstellen
CREATE UNIQUE INDEX IF NOT EXISTS briefpapiere_standard_unique
  ON briefpapiere (betrieb_id)
  WHERE ist_standard = TRUE;

-- RLS
ALTER TABLE briefpapiere ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Nur eigene Briefpapiere" ON briefpapiere
  FOR ALL USING (
    betrieb_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

-- Trigger: aktualisiert_am automatisch setzen
CREATE OR REPLACE FUNCTION update_aktualisiert_am()
RETURNS TRIGGER AS $$
BEGIN
  NEW.aktualisiert_am = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER briefpapiere_aktualisiert
  BEFORE UPDATE ON briefpapiere
  FOR EACH ROW EXECUTE FUNCTION update_aktualisiert_am();
