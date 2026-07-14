-- Rechenweg-Transparenz pro Position ("rechnet statt rät")
-- Ausführen im Supabase SQL Editor
--
-- berechnungsweg: nachvollziehbarer Rechenweg, z.B. "Umfang 18 m × 2,6 m − 2 Fenster − 1 Tür = 45,8 m²"
-- annahmen:       getroffene Annahmen als Liste, z.B. ["Quadratischer Raum angenommen"]

ALTER TABLE quote_items
  ADD COLUMN IF NOT EXISTS berechnungsweg TEXT,
  ADD COLUMN IF NOT EXISTS annahmen JSONB DEFAULT '[]'::jsonb;
