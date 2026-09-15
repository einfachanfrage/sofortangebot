-- PM-013-A: „Dehnungsfuge einbauen" 45,00 €/Stück aus den Preislisten
-- bestehender Betriebe entfernen.
--
-- Dieselbe Arbeit stand zweimal im Katalog, mit zwei Einheiten:
--   Dehnungsfuge mit Bewegungsprofil herstellen   18,00 €/lfdm   ← bleibt
--   Dehnungsfuge einbauen                         45,00 €/Stück  ← raus
--
-- Entscheidung des Prüfmeisters (14.09.2026): eine Arbeit, eine Einheit —
-- eine Dehnungsfuge wird in Metern gelegt, nicht in Stück.
--
-- Warum das kein Aufräumen ist, sondern Geld: Nennt der Handwerker keine
-- Länge, legt die Aufnahme-Erkennung „1 Stück angenommen — bitte Anzahl/Länge
-- prüfen" an. Solange die Stück-Zeile im Katalog stand, fand diese ANGENOMMENE
-- Eins einen echten Preis und stand mit 45,00 € auf dem Kundenpapier. Ohne sie
-- bleibt die Position unbepreist, und der Versand-Riegel (`versandbereit.ts`)
-- lässt das Angebot nicht zum Kunden, bis der Handwerker die Menge gesetzt hat.
--
-- Nachgesehen vor dem Löschen: In der Produktionsdatenbank gab es drei solcher
-- Zeilen, keine davon war von einer Angebotsposition verwendet
-- (`quote_items.price_item_id`). Die Bedingung steht trotzdem im DELETE — wer
-- die Migration später auf einem anderen Stand ausführt, soll keinem Betrieb
-- eine Zeile unter einem verschickten Angebot wegziehen.

DELETE FROM public.price_items pi
WHERE pi.title = 'Dehnungsfuge einbauen'
  AND pi.unit = 'Stück'
  AND NOT EXISTS (
    SELECT 1 FROM public.quote_items qi WHERE qi.price_item_id = pi.id
  );
