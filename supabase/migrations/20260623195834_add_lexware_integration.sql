-- Lexware Office (Online) Integration
-- Lexware Office ist die Nachfolge von Lexoffice (gleiches Haufe-Produkt, gleiche API)
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS lexware_api_key TEXT;
