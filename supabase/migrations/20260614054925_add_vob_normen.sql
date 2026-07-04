-- Migration: VOB/DIN Normen + Erschwerniszuschläge
-- Ausführen in: Supabase SQL Editor (Production)

-- 1. Neue Felder in price_items (Preiskatalog)
ALTER TABLE price_items
  ADD COLUMN IF NOT EXISTS vob_norm        TEXT,
  ADD COLUMN IF NOT EXISTS din_normen      TEXT[],
  ADD COLUMN IF NOT EXISTS ist_erschwerniszuschlag BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS erschwerniszuschlag_fuer TEXT,
  ADD COLUMN IF NOT EXISTS zuschlag_typ    TEXT CHECK (zuschlag_typ IN ('prozent', 'festbetrag', 'je_einheit'));

-- 2. Normverweise auch in Angebotspositionen speichern (für PDF)
ALTER TABLE quote_items
  ADD COLUMN IF NOT EXISTS vob_norm   TEXT,
  ADD COLUMN IF NOT EXISTS din_normen TEXT[];

-- 3. Performance-Index für Filter nach Erschwerniszuschlägen
CREATE INDEX IF NOT EXISTS idx_price_items_erschwerniszuschlag
  ON price_items (company_id, ist_erschwerniszuschlag)
  WHERE ist_erschwerniszuschlag = TRUE;

-- Kommentar zur Datenstruktur
COMMENT ON COLUMN price_items.vob_norm IS 'VOB/C-Abschnitt z.B. "VOB/C ATV DIN 18363 Abschnitt 3.1.1"';
COMMENT ON COLUMN price_items.din_normen IS 'Zugehörige DIN-Normen als Array z.B. ARRAY[''DIN 55945'', ''DIN EN ISO 12944'']';
COMMENT ON COLUMN price_items.ist_erschwerniszuschlag IS 'TRUE = Position ist ein Erschwerniszuschlag (wird visuell getrennt dargestellt)';
COMMENT ON COLUMN price_items.erschwerniszuschlag_fuer IS 'Auf welche Grundleistung bezieht sich der Zuschlag z.B. "Wandanstrich"';
COMMENT ON COLUMN price_items.zuschlag_typ IS 'prozent = % auf Basispreis, festbetrag = fixer € Aufpreis, je_einheit = € pro Einheit';
