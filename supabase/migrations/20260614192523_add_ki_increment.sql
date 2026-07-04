-- Nutzungshäufigkeit für Price Items erhöhen (für KI-Matching-Feedback)
CREATE OR REPLACE FUNCTION increment_nutzung(p_item_id UUID)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE price_items
  SET nutzungshaeufigkeit = COALESCE(nutzungshaeufigkeit, 0) + 1
  WHERE id = p_item_id;
$$;

-- Spalte hinzufügen falls noch nicht vorhanden
ALTER TABLE price_items
  ADD COLUMN IF NOT EXISTS nutzungshaeufigkeit INT NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_price_items_nutzung
  ON price_items(nutzungshaeufigkeit DESC);
