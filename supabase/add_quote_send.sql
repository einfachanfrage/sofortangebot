-- Versand-Tracking für Angebote
-- Ausführen im Supabase SQL Editor

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS gesendet_am     TIMESTAMPTZ;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS gesendet_via    TEXT;  -- 'email'|'whatsapp'|'link'
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS empfaenger_email TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS pdf_public_url  TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS pdf_url_gueltig_bis TIMESTAMPTZ;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS geoeffnet_am    TIMESTAMPTZ;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS geoeffnet_count INT DEFAULT 0;

-- Öffnungs-Tracking
CREATE TABLE IF NOT EXISTS angebot_views (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  angebot_id  UUID REFERENCES quotes(id) ON DELETE CASCADE NOT NULL,
  viewed_at   TIMESTAMPTZ DEFAULT now(),
  ip_land     TEXT,
  user_agent  TEXT
);

ALTER TABLE angebot_views ENABLE ROW LEVEL SECURITY;

-- Öffentliche INSERT (kein Auth nötig, wird vom Edge aufgerufen)
CREATE POLICY "angebot_views_insert_public" ON angebot_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "angebot_views_select_company" ON angebot_views
  FOR SELECT USING (
    angebot_id IN (
      SELECT id FROM quotes WHERE company_id = (
        SELECT id FROM companies WHERE user_id = auth.uid()
      )
    )
  );

-- Supabase Storage Bucket:
-- Name: public-pdfs
-- Public: true (damit öffentliche URL ohne Auth funktioniert)
-- Allowed MIME types: application/pdf
-- Max file size: 20 MB
