-- Session-basierte Spracheingabe
-- Ausführen im Supabase SQL Editor

-- Neuer Status für offene Angebots-Sessions
-- (QuoteStatus ist im Frontend als Union-Type definiert, Supabase kennt nur TEXT)

-- Eingabe-Protokoll je Angebot
CREATE TABLE IF NOT EXISTS angebot_eingaben (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  angebot_id            UUID REFERENCES quotes(id) ON DELETE CASCADE NOT NULL,
  company_id            UUID NOT NULL,
  eingabe_nummer        INT NOT NULL DEFAULT 1,
  transkript            TEXT,
  erkannte_positionen   JSONB DEFAULT '[]',
  erstellt_am           TIMESTAMPTZ DEFAULT now(),
  geraet                TEXT -- 'web' | 'ios' | 'android'
);

ALTER TABLE angebot_eingaben ENABLE ROW LEVEL SECURITY;

CREATE POLICY "angebot_eingaben_company_only" ON angebot_eingaben
  FOR ALL USING (
    company_id = (SELECT id FROM companies WHERE user_id = auth.uid())
  );

CREATE INDEX IF NOT EXISTS idx_angebot_eingaben_angebot_id ON angebot_eingaben(angebot_id);

-- Hint-Tracking: Erstes-Mal-Anzeige der Sprach-Starthilfe
ALTER TABLE companies ADD COLUMN IF NOT EXISTS has_seen_voice_hint BOOLEAN DEFAULT false;
