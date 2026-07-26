-- Macht die Preisquelle jeder Angebotsposition dauerhaft nachvollziehbar.
alter table quote_items
  add column if not exists price_item_id uuid references price_items(id) on delete set null;

create index if not exists idx_quote_items_price_item_id
  on quote_items(price_item_id);
