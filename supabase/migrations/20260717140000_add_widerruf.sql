-- Widerrufsbelehrung fürs Angebot (Verbraucher / Haustürgeschäft)
-- Ausführen im Supabase SQL Editor
--
-- Wird ein Vertrag außerhalb der Geschäftsräume geschlossen (Kunde unterschreibt
-- vor Ort), hat der Verbraucher ein 14-tägiges Widerrufsrecht (§ 312b, § 355 BGB).
-- Ohne korrekte Belehrung verlängert sich die Frist auf 12 Monate + 14 Tage.
--
-- widerruf_aktiv: Belehrung ans Angebot anhängen (nur bei Privatkunden)
-- widerruf_text:  eigener Text; NULL = Standard-Muster (EGBGB Anlage 1) wird genutzt

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS widerruf_aktiv BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS widerruf_text TEXT;
