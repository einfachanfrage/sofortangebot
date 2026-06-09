-- ============================================================
-- ALLE MIGRATIONEN — in Supabase SQL-Editor ausführen
-- Enthält alle Änderungen seit dem initialen schema.sql
-- Stand: aktuell (inklusive Legal-Fixes)
-- ============================================================

-- Plan + Stripe
ALTER TABLE companies ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'starter';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ;

-- Buchhaltungs-Integrationen (API-Keys auf companies)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS lexoffice_api_key TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS sevdesk_api_key TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS fastbill_api_key TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS fastbill_email TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS billomat_api_key TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS billomat_subdomain TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS papierkram_api_key TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS easybill_api_key TEXT;

-- Gewerk + Logo + Einstellungen
ALTER TABLE companies ADD COLUMN IF NOT EXISTS gewerke TEXT[] DEFAULT '{}';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS reminder_days INTEGER DEFAULT 3;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS vat_rate INTEGER DEFAULT 19;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS payment_days INTEGER DEFAULT 14;

-- Rechtliche Pflichtangaben (§ 14 UStG / DSGVO)
ALTER TABLE companies ADD COLUMN IF NOT EXISTS ust_id TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS agb_url TEXT;

-- Kontakt-IDs auf customers (verhindert Duplikate beim Buchhaltungs-Export)
ALTER TABLE customers ADD COLUMN IF NOT EXISTS lexoffice_contact_id TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS sevdesk_contact_id TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS fastbill_customer_id TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS billomat_client_id TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS papierkram_contact_id TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS easybill_customer_id TEXT;

-- Share-Token für sichere Signing-Links (nicht UUID-basiert)
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS share_token UUID DEFAULT gen_random_uuid();
CREATE UNIQUE INDEX IF NOT EXISTS quotes_share_token_idx ON quotes(share_token);

-- Unterschrift-Felder
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS signature_url TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS signer_ip TEXT;

-- Erinnerungs-Tracking
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ;

-- Versandweg-Tracking
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS sent_via TEXT[] DEFAULT '{}';

-- Angebotsnummer (Spalte existiert in schema.sql, wird jetzt beim Erstellen befüllt)
-- quote_number TEXT -- bereits in schema.sql vorhanden

-- ============================================================
-- STORAGE BUCKETS (manuell in Supabase Dashboard anlegen falls nicht vorhanden)
-- Bucket: company-logos  → Public
-- Bucket: quote-signatures → Public
-- ============================================================
