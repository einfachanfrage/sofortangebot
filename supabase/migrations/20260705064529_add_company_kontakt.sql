-- Kontaktdaten des Betriebs (erscheinen im Angebots-Kopf).
-- Bisher lagen Telefon/E-Mail/Website nur pro Briefpapier-Variante — jetzt
-- zentral am Betrieb, das Briefpapier zieht sie von dort.
-- Ausführen im Supabase SQL Editor.

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS phone         TEXT,
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS website       TEXT;
