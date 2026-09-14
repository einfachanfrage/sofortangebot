-- quotes.erkannter_kundenname: der im Diktat genannte Kundenname
-- (Head of Product Engineering, 2026-09-11 -- CoS-E-018, Manfreds Testlauf
-- TN-044/TN-129, docs/chief-of-staff-engineering-todos.md)
--
-- Hintergrund: Manfred hat den Kunden jeweils als Allererstes gesagt
-- ("Frau Krueger, Bochum", "Herr Yilmaz, Herne") und bekam beide Male
-- "Kein Kunde zugewiesen". Beim Nachsehen war es kein Erkennungsproblem:
-- Die Extraktion liest den Namen sauber aus (Feld `kunde` in
-- ExtrahierteDaten, siehe src/lib/mengen/types.ts und den GPT-Prompt in
-- supabase/functions/_shared/prompt-extraktion-v4.ts) -- und danach liest
-- ihn NIEMAND mehr. Das Feld war eine Sackgasse. Deshalb reproduzierte es
-- sich in beiden Testszenarien identisch.
--
-- Warum eine Spalte und nicht einfach customer_id setzen:
-- Ein verhoerter Name ("Krueger"/"Grueger") wuerde still einen echten
-- Kundendatensatz anlegen, den danach niemand mehr findet oder aufraeumt --
-- und bei Manfred sind 80 % der Angebote Erstkunden, das passiert also
-- staendig. Sofortangebot ist ein Entwurfsgenerator mit Pruefpflicht: Der
-- gehoerte Name ist ein VORSCHLAG, den der Handwerker mit einem Tipp
-- bestaetigt (bestehendem Kunden zuweisen oder neu anlegen). Erst dann
-- entsteht ein Kunde.
--
-- Warum eine eigene Spalte und nicht eines der vorhandenen JSON-Felder --
-- geprueft und verworfen, damit es niemand nochmal aufmacht:
--   * quotes.extraktion_final / .extraktion_roh enthalten den Namen zwar
--     verlaesslich, sind aber ausdruecklich LOGGING-Felder ("Logging-Felder
--     fuer die Extraktions-Stufe", Migration 20260807054617). Sichtbares
--     Produktverhalten auf ein Diagnosefeld zu stuetzen heisst: wer die Logs
--     eines Tages ausduennt, bricht still die Kundenzuweisung.
--   * entwurf_aufnahmen.voll_extraktion und quotes.kombinierte_extraktion_-
--     cache sind opportunistische Caches -- sie DUERFEN fehlen, ohne dass
--     etwas kaputtgeht (siehe kombinierte-extraktion-cache.ts). Genau die
--     Sorte stiller Luecke, aus der dieser Fund entstanden ist.
--
-- Bewusst KEIN Backfill: bestehende Angebote bleiben NULL und verhalten
-- sich exakt wie bisher. Additiv heisst additiv.

ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS erkannter_kundenname TEXT;

COMMENT ON COLUMN public.quotes.erkannter_kundenname IS
  'CoS-E-018: Im Diktat genannter Kundenname als VORSCHLAG. Wird nur gesetzt, solange das Angebot keinen Kunden hat, und macht daraus nie selbst einen Kunden -- der Handwerker bestaetigt mit einem Tipp. NULL = nichts gehoert oder Kunde bereits zugewiesen.';
