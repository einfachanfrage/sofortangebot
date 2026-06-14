-- Migration: Preisdatenbank v2 — Nutzungshäufigkeit-Tracking
-- Ausführen in: Supabase SQL Editor (Production)

ALTER TABLE price_items
  ADD COLUMN IF NOT EXISTS nutzungshaeufigkeit INT NOT NULL DEFAULT 0;

-- Index für Sortierung: häufig genutzte zuerst
CREATE INDEX IF NOT EXISTS idx_price_items_nutzung
  ON price_items (company_id, nutzungshaeufigkeit DESC, title ASC);
