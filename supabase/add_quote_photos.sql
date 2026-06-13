-- Fotos & interne Notizen für Angebote
-- Ausführen im Supabase SQL Editor

-- Interne Notizen (erscheinen NICHT im PDF)
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS internal_notes TEXT;

-- Rabatt & Zuschläge
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS discount_percent NUMERIC(5,2) DEFAULT 0;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS discount_amount  NUMERIC(10,2) DEFAULT 0;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS surcharge_amount NUMERIC(10,2) DEFAULT 0;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS surcharge_label  TEXT;

-- Foto-Tabelle
CREATE TABLE IF NOT EXISTS quote_photos (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_id     UUID REFERENCES quotes(id) ON DELETE CASCADE NOT NULL,
  company_id   UUID NOT NULL,
  url          TEXT NOT NULL,
  filename     TEXT NOT NULL,
  in_pdf       BOOLEAN DEFAULT false,
  erstellt_am  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE quote_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quote_photos_company_only" ON quote_photos
  FOR ALL USING (
    company_id = (SELECT id FROM companies WHERE user_id = auth.uid())
  );

CREATE INDEX IF NOT EXISTS idx_quote_photos_quote_id ON quote_photos(quote_id);

-- Supabase Storage Bucket (muss in Dashboard angelegt werden):
-- Name: quote-photos
-- Public: false (signed URLs verwenden)
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/heic
-- Max file size: 10 MB
