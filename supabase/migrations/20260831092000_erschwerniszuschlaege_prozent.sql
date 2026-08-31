-- PM-008/PM-015 — Sandys Entscheidung 2026-08-31: „Prozent. Katalog ist die
-- Referenz, die Generierung wird angepasst."
--
-- Zwei Dinge waren hier kaputt, nicht eins:
--
-- 1. Einheiten-Konflikt: die generierten Zuschlagspositionen trugen
--    „Pauschale", der VOB-Teil des Katalogs „%". Der Preis-Matcher besteht auf
--    exakter Einheiten-Übereinstimmung — also nie ein Treffer. Behoben im
--    Code (vollstaendigkeit/maler-extras.ts, default-prices.ts).
--
-- 2. Die vier Ersatz-Einträge mit Einheit „Pauschale", die am 2026-08-20 in
--    default-prices.ts angelegt wurden, damit überhaupt etwas matcht, sind in
--    KEINER echten Betriebs-Preisdatenbank gelandet — es gab nie eine
--    Migration dazu, und beide bestehenden Konten wurden vorher angelegt.
--    Genau deshalb stand „Erschwerniszuschlag Raumhöhe > 3m" im Nachtest vom
--    30.08. weiterhin mit 0,00 € da. Ein reiner Code-Fix hätte daran nichts
--    geändert.
--
-- Die Sätze sind an die vorhandenen VOB-Einträge desselben Katalogs
-- angelehnt, nicht frei gewählt (Höhe 15 %, bewohnt 10 %, Altbau 20 %,
-- Denkmalschutz 30 %, schwieriger Untergrund 10 %). Bestehende, vom Betrieb
-- selbst geänderte Preise bleiben unangetastet: eingefügt wird nur, was in
-- der Kombination aus Bezeichnung UND Einheit noch fehlt.

insert into price_items (
  company_id, category, title, unit, unit_price,
  ist_erschwerniszuschlag, erschwerniszuschlag_fuer, zuschlag_typ, vob_norm, din_normen
)
select
  c.id, p.category, p.title, p.unit, p.unit_price,
  true, p.bezug, 'prozent', 'VOB/C ATV DIN 18363', array['DIN 18363']
from companies c
cross join (values
  ('Maler – Erschwernisse & Zuschläge', 'Erschwerniszuschlag Raumhöhe > 3m',            '%', 15.00::numeric, 'Anstricharbeiten in Räumen über 3 m Höhe'),
  ('Maler – Erschwernisse & Zuschläge', 'Erschwerniszuschlag Altbau',                    '%', 20.00::numeric, 'Anstricharbeiten im Altbau'),
  ('Maler – Erschwernisse & Zuschläge', 'Erschwerniszuschlag Denkmalschutz',             '%', 30.00::numeric, 'Anstricharbeiten unter Denkmalschutzauflagen'),
  ('Maler – Erschwernisse & Zuschläge', 'Erschwerniszuschlag bewohnt',                   '%', 10.00::numeric, 'Anstricharbeiten in bewohnten Räumen'),
  ('Maler – Erschwernisse & Zuschläge', 'Erschwerniszuschlag schwieriger Untergrund',    '%', 10.00::numeric, 'Anstricharbeiten auf schwierigem Untergrund')
) as p(category, title, unit, unit_price, bezug)
where exists (
    select 1 from price_items existing_trade
    where existing_trade.company_id = c.id
      and existing_trade.category like 'Maler %'
  )
  and not exists (
    select 1 from price_items existing
    where existing.company_id = c.id
      and lower(existing.title) = lower(p.title)
      and lower(existing.unit) = lower(p.unit)
  );

-- Falls ein Konto die vier Einträge doch schon als „Pauschale" führt (in
-- default-prices.ts standen sie zwischen dem 20.08. und heute so drin, ein
-- frisch angelegtes Konto hätte sie also bekommen): auf Prozent umstellen
-- statt eine zweite Zeile daneben stehen zu lassen.
delete from price_items alt
where alt.unit = 'Pauschale'
  and alt.title in (
    'Erschwerniszuschlag Raumhöhe > 3m', 'Erschwerniszuschlag Altbau',
    'Erschwerniszuschlag Denkmalschutz', 'Erschwerniszuschlag bewohnt',
    'Erschwerniszuschlag schwieriger Untergrund'
  )
  and exists (
    select 1 from price_items neu
    where neu.company_id = alt.company_id and neu.title = alt.title and neu.unit = '%'
  );
