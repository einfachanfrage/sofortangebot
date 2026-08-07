-- Logging-Felder für die Extraktions-Stufe (GPT-Struktur vor/nach Nachbearbeitung)
-- Bereits per MCP direkt auf der Datenbank angewendet — diese Datei hält die
-- Migrations-Historie im Repo synchron.

ALTER TABLE quotes
  ADD COLUMN IF NOT EXISTS extraktion_roh jsonb,
  ADD COLUMN IF NOT EXISTS extraktion_final jsonb;

COMMENT ON COLUMN quotes.extraktion_roh IS 'Rohe Struktur direkt von GPT-4o, vor allen Nachbearbeitungs-Schritten (Normalisierung, Implizit-Wissen, Kontext-Analyzer, Reparaturen etc.)';
COMMENT ON COLUMN quotes.extraktion_final IS 'Finale Struktur nach allen Nachbearbeitungs-Schritten, wie sie an die Mengen-Engine geht';
