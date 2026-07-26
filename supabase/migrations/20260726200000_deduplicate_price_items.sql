-- Entfernt nur echte Dubletten innerhalb derselben Kategorie, Bezeichnung und
-- Einheit. Gleich benannte Leistungen in verschiedenen Gewerken bleiben erhalten.
-- Der am häufigsten verwendete, anschließend älteste Datensatz bleibt bestehen.

create temporary table price_item_duplicate_map on commit drop as
with ranked as (
  select
    id,
    first_value(id) over (
      partition by
        company_id,
        lower(btrim(category)),
        lower(btrim(title)),
        lower(btrim(unit))
      order by coalesce(nutzungshaeufigkeit, 0) desc, created_at asc, id asc
    ) as keeper_id,
    row_number() over (
      partition by
        company_id,
        lower(btrim(category)),
        lower(btrim(title)),
        lower(btrim(unit))
      order by coalesce(nutzungshaeufigkeit, 0) desc, created_at asc, id asc
    ) as duplicate_rank
  from price_items
)
select id as duplicate_id, keeper_id
from ranked
where duplicate_rank > 1;

update quote_items q
set price_item_id = duplicates.keeper_id
from price_item_duplicate_map duplicates
where q.price_item_id = duplicates.duplicate_id;

delete from price_items p
using price_item_duplicate_map duplicates
where p.id = duplicates.duplicate_id;

create unique index if not exists uq_price_items_company_category_title_unit
  on price_items (
    company_id,
    lower(btrim(category)),
    lower(btrim(title)),
    lower(btrim(unit))
  );
