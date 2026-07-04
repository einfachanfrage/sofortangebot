ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS sevdesk_contact_id TEXT,
  ADD COLUMN IF NOT EXISTS fastbill_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS billomat_client_id TEXT,
  ADD COLUMN IF NOT EXISTS papierkram_contact_id TEXT,
  ADD COLUMN IF NOT EXISTS easybill_customer_id TEXT;
