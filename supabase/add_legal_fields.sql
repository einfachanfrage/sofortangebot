-- Punkt 3: Quote-Number persistieren
-- (Spalte existiert bereits in schema.sql, aber wird nie befüllt — jetzt wird sie befüllt beim Erstellen)

-- Punkt 5: IP-Adresse und Dokument-Hash für Unterschrift-Nachweis
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS signer_ip TEXT;

-- Punkt 7 + 9: USt-ID und AGB-URL für Betriebe
ALTER TABLE companies ADD COLUMN IF NOT EXISTS ust_id TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS agb_url TEXT;

-- KEIN public UPDATE RLS nötig — Unterschrift läuft jetzt über Server-API mit Service Role Key
