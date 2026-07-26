-- Ergänzt bereits bestehende betriebliche Kataloge um Positionen, die von der
-- Mengenengine exakt erzeugt werden. Vorhandene persönliche Preise bleiben
-- unangetastet und gewinnen durch NOT EXISTS.
insert into price_items (company_id, category, title, unit, unit_price)
select c.id, p.category, p.title, p.unit, p.unit_price
from companies c
cross join (values
  ('Maler – Vorbereitung & Schutz', 'Sockelleisten abkleben', 'lfdm', 0.80::numeric),
  ('Boden – Untergrundvorbereitung', 'Untergrundvorbereitung / Ausgleich', 'm²', 12.00::numeric),
  ('Boden – Feuchtigkeitsschutz', 'Epoxidharz-Feuchtigkeitssperre aufwalzen', 'm²', 18.00::numeric),
  ('Maler – Vorbereitung & Schutz', 'Holzvertäfelung / Wandbelag abkleben', 'm²', 3.00::numeric),
  ('Maler – Anstrich Innen', 'Kniestockwände streichen', 'm²', 11.00::numeric),
  ('Maler – Anstrich Innen', 'Dachschrägen streichen', 'm²', 11.00::numeric),
  ('Maler – Anstrich Innen', 'Deckenspiegel streichen', 'm²', 11.00::numeric),
  ('Maler – Tapezierarbeiten', 'Akzentwand Vliestapete', 'm²', 14.00::numeric),
  ('Maler – Anstrich Innen', 'Restwände streichen', 'm²', 9.50::numeric),
  ('Maler – Schimmel & Sanierung', 'Schimmelbehandlung / Grundierung', 'm²', 12.00::numeric),
  ('Maler – Dekorative Techniken', 'Kalkputz aufbringen', 'm²', 35.00::numeric),
  ('Maler – Spezialbeschichtungen', 'Silikatfarbe auftragen (2×)', 'm²', 13.00::numeric),
  ('Maler – Spezialbeschichtungen', 'Nikotinsperre auftragen', 'm²', 9.00::numeric),
  ('Maler – Baustelleneinrichtung', 'Gerüst stellen (Pauschale)', 'Pauschale', 450.00::numeric),
  ('Maler – Untergrundvorbereitung', 'Rissverschluss mit Gewebe', 'm²', 18.00::numeric),
  ('Maler – Baustelleneinrichtung', 'Bautrockner aufstellen und betreiben', 'Tage', 45.00::numeric),
  ('Maler – Schimmel & Sanierung', 'Anti-Schimmel-Anstrich', 'm²', 15.00::numeric),
  ('Maler – Anstrich Innen', 'Kalken / Weißkalkung', 'm²', 10.00::numeric),
  ('Maler – Dekorative Techniken', 'Spachteltechnik (Betonoptik)', 'm²', 45.00::numeric),
  ('Maler – Spezialbeschichtungen', 'Versiegelung / Schutzanstrich', 'm²', 14.00::numeric),
  ('Maler – Holzbeschichtung', 'Holzbalken anschleifen', 'lfdm', 8.00::numeric),
  ('Maler – Holzbeschichtung', 'Lasur auftragen (transparent)', 'lfdm', 9.00::numeric)
) as p(category, title, unit, unit_price)
where not exists (
  select 1
  from price_items existing
  where existing.company_id = c.id
    and lower(existing.title) = lower(p.title)
    and lower(existing.unit) = lower(p.unit)
);
