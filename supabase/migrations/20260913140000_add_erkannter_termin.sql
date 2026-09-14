-- quotes.erkannter_termin: der im Diktat genannte Ausführungstermin
-- (CoS-E-019 / TN-045, Manfred) — am 13.09.2026 bereits in Produktion und
-- Staging ausgeführt.
--
-- Manfred sagt den Termin im selben Atemzug wie die Maße ("in drei Wochen
-- fertig") — und danach war er weg. Beim Kundennamen war es dieselbe
-- Geschichte (CoS-E-018): erkannt und von niemandem gelesen. Hier war es
-- eine Stufe früher: Es gab nicht einmal ein Feld.
--
-- Gespeichert wird der WORTLAUT, nicht ein errechnetes Datum.
-- "In drei Wochen" rechnet sich nur von einem Stichtag aus, und der ist der
-- Tag des Diktats — nicht der Tag, an dem der Kunde zusagt. Zwischen beiden
-- liegen oft Wochen. Ein daraus errechnetes Datum sähe aus wie eine Zusage
-- und wäre keine. Nennt der Handwerker ein echtes Datum ("am 15. Oktober"),
-- steht es in Klammern dahinter.
--
-- Wie beim Kundennamen ein VORSCHLAG: Der Handwerker übernimmt ihn mit
-- einem Tipp in seine interne Notiz (das beantwortet zugleich CoS-E-032).
-- Die App trägt von sich aus keinen Termin in ein Kundendokument ein.
--
-- Bewusst KEIN Backfill: bestehende Angebote bleiben NULL und verhalten
-- sich exakt wie bisher.

ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS erkannter_termin TEXT;

COMMENT ON COLUMN public.quotes.erkannter_termin IS
  'CoS-E-019: Im Diktat genannter Ausführungstermin als VORSCHLAG, im Wortlaut des Handwerkers. NULL = nichts gehört. Wird nie von selbst zu einer Zusage im Kundendokument.';
