-- ZUGFeRD / XRechnung Felder
-- Ausführen in Supabase SQL Editor

-- Kunden: Kundentyp + E-Rechnung-Felder
ALTER TABLE customers ADD COLUMN IF NOT EXISTS ist_unternehmen BOOLEAN DEFAULT false;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS ustid TEXT;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS leitweg_id TEXT;  -- Pflicht für öffentliche Auftraggeber

-- Betrieb: E-Rechnung Toggle
ALTER TABLE companies ADD COLUMN IF NOT EXISTS e_rechnung_aktiv BOOLEAN DEFAULT true;
