-- PD-010: Für eine Innentür führte der Katalog fünf Zeilen in zwei Rubriken,
-- für die Zarge drei. Entscheidung des Prüfmeisters vom 15.09.2026:
-- eine Arbeit, eine Zeile — und sie steht in den Lackierarbeiten.
--
--   bleibt   Türen lackieren (2× Anstrich)            90,00 €  Lackierarbeiten
--   neu      Türen lackieren einseitig (2× Anstrich)  55,00 €  (umbenannt aus
--            „Innentürblatt lackieren einseitig")
--   bleibt   Türzarge lackieren                       45,00 €  Lackierarbeiten
--
--   entfällt Innentürblatt lackieren beidseitig       90,00 €  (identisch)
--   entfällt Tür streichen / lackieren (beidseitig)   75,00 €  Anstrich Innen
--   entfällt Tür streichen / lackieren (einseitig)    45,00 €  Anstrich Innen
--   entfällt Türzarge streichen                       35,00 €  Anstrich Innen
--
-- Warum das mehr ist als Aufräumen: `taetigkeiten.ts` ordnet
-- „Maler – Lackierarbeiten" der Tätigkeit *Lackieren* zu und alles übrige
-- „Maler …" der Tätigkeit *Innen streichen*. Die Altlast-Zeilen lagen damit in
-- der FALSCHEN Tätigkeit — und ausgerechnet die billigeren. Ein Betrieb, der
-- den Lackier-Haken nicht setzt, bekam seine Türen trotzdem bepreist: 15 € zu
-- niedrig, ohne je nach dem Preis gefragt worden zu sein.
--
-- Reihenfolge ist wichtig: erst umbenennen, dann löschen. Andersherum könnte
-- das UPDATE auf einen Titel laufen, den das DELETE gerade freigeräumt hat.

-- 1. Umbenennen — der Preis bleibt, nur der Name wird Teil der Wortfamilie.
UPDATE public.price_items
SET title = 'Türen lackieren einseitig (2× Anstrich)'
WHERE title = 'Innentürblatt lackieren einseitig'
  AND NOT EXISTS (
    SELECT 1 FROM public.price_items andere
    WHERE andere.company_id = price_items.company_id
      AND andere.title = 'Türen lackieren einseitig (2× Anstrich)'
  );

-- 2. Die vier Altlast-Zeilen entfernen — aber nur, wo keine Angebotsposition
--    daran hängt. Einem Betrieb eine Zeile unter einem verschickten Angebot
--    wegzuziehen wäre schlimmer als die Dopplung.
DELETE FROM public.price_items pi
WHERE pi.title IN (
    'Innentürblatt lackieren beidseitig',
    'Tür streichen / lackieren (beidseitig)',
    'Tür streichen / lackieren (einseitig)',
    'Türzarge streichen'
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.quote_items qi WHERE qi.price_item_id = pi.id
  );
