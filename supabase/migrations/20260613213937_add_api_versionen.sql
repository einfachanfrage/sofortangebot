-- API-Versionierung & Monitoring
-- Ausführen im Supabase SQL Editor (Production + Staging)

CREATE TABLE IF NOT EXISTS api_versionen (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  anbieter TEXT NOT NULL UNIQUE,
  aktuelle_version TEXT,
  letzter_erfolgreicher_test TIMESTAMPTZ,
  letzter_test TIMESTAMPTZ,
  letzter_fehler TEXT,
  letzter_fehler_am TIMESTAMPTZ,
  status TEXT DEFAULT 'unbekannt',
  erstellt_am TIMESTAMPTZ DEFAULT now()
);

INSERT INTO api_versionen (anbieter, status) VALUES
  ('lexoffice', 'unbekannt'),
  ('sevdesk', 'unbekannt'),
  ('fastbill', 'unbekannt'),
  ('openai', 'unbekannt'),
  ('stripe', 'unbekannt')
ON CONFLICT (anbieter) DO NOTHING;

-- RLS: nur Service Role kann schreiben, alle authentifizierten lesen
ALTER TABLE api_versionen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON api_versionen
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "authenticated_read" ON api_versionen
  FOR SELECT USING (auth.role() = 'authenticated');
