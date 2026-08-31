-- CoS-019 Teil 2 — Sandys Entscheidung 2026-08-31: „Ja, vereinheitlichen."
--
-- Dieselbe Sache hieß je nach Gewerk „Anfahrt & Organisation" (12 Gewerke),
-- „Anfahrt & Planung" (5) oder „Anfahrt & Vorbereitung" (1). Auf /preise
-- standen dadurch drei Rubriken nebeneinander, die alle dasselbe meinen.
-- Gleiche Ursache und gleiche Lösung wie bei den Erschwernis-Rubriken am
-- 2026-08-24: im Code vereinheitlicht (default-prices.ts, preise-vorlagen.ts),
-- diese Migration zieht die bereits in Betriebs-Preisdatenbanken gelandeten
-- Zeilen nach.
--
-- Kollisionsfrei: jedes Gewerk führte nur EINE der drei Schreibweisen, ein
-- Umbenennen kann in keinem Gewerk auf eine bestehende zweite Anfahrt-Rubrik
-- treffen. Preis-Matching und Gewerk-Zuordnung hängen ohnehin am Präfix vor
-- dem „–", nicht am Rubriknamen dahinter.
update public.price_items
set category = replace(replace(category, '– Anfahrt & Planung', '– Anfahrt & Organisation'),
                                         '– Anfahrt & Vorbereitung', '– Anfahrt & Organisation')
where category like '%– Anfahrt & Planung' or category like '%– Anfahrt & Vorbereitung';
