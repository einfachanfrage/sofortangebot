-- Integration API Keys für Lexoffice und sevDesk
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS lexoffice_api_key TEXT,
  ADD COLUMN IF NOT EXISTS sevdesk_api_key TEXT;
