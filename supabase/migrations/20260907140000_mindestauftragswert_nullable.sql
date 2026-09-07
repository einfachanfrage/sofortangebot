-- companies.mindestauftragswert: NULL wird zu "nie eingestellt"
-- (Head of Product Engineering, 2026-09-07 — Sandys Freigabe, Punkt 4 aus
-- docs/chief-of-staff-todos.md)
--
-- Zweck: Der Chief of Staff hat entschieden, dass 180 EUR bei der
-- Ersteinrichtung als Vorschlag vorbelegt sein sollen. Heute ist das nicht
-- unterscheidbar: Die Spalte kennt nur Zahlen, und 0 heisst gleichzeitig
-- "nie angefasst" und "bewusst ausgeschaltet". Mit NULL sind die beiden
-- Faelle getrennt -- dieselbe Konstruktion wie bei
-- companies.onboarding_started_at (Migration vom 02.09.).
--
-- Semantik ab hier:
--   NULL  = nie eingestellt  -> keine Position, Formular schlaegt 180 EUR vor
--   0     = bewusst aus      -> keine Position, kein Vorschlag
--   > 0   = aktiv            -> Position "Anfahrt & Vorbereitung" mit der
--                               Differenz, sobald das Angebot darunter bleibt
--
-- Bewusst KEIN Backfill bestehender Zeilen auf NULL. Alle bestehenden Betriebe
-- stehen heute auf 0 und verhalten sich danach exakt wie vorher -- niemandem
-- wird rueckwirkend ein Betrag in seine Angebote gerechnet. Additiv heisst
-- additiv, dieselbe Regel wie bei onboarding_started_at.
--
-- Der Code kommt ohne diese Migration aus (mindestauftragsPosition behandelt
-- null und 0 identisch als "aus"); sie schaltet nur den Vorschlagswert frei.

ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS mindestauftragswert NUMERIC;
ALTER TABLE public.companies ALTER COLUMN mindestauftragswert DROP NOT NULL;
ALTER TABLE public.companies ALTER COLUMN mindestauftragswert SET DEFAULT NULL;

COMMENT ON COLUMN public.companies.mindestauftragswert IS
  'Mindestauftragswert in EUR netto. NULL = nie eingestellt (Formular schlaegt 180 vor), 0 = bewusst aus, > 0 = aktiv. Bleibt ein Angebot darunter, entsteht die Position "Anfahrt & Vorbereitung" mit dem Differenzbetrag.';
