ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS fastbill_api_key TEXT,
  ADD COLUMN IF NOT EXISTS fastbill_email TEXT,
  ADD COLUMN IF NOT EXISTS billomat_api_key TEXT,
  ADD COLUMN IF NOT EXISTS billomat_subdomain TEXT,
  ADD COLUMN IF NOT EXISTS papierkram_api_key TEXT,
  ADD COLUMN IF NOT EXISTS easybill_api_key TEXT;
