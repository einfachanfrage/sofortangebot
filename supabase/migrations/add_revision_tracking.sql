-- Revisionsverwaltung für Angebote
-- revision: Version des Angebots (1 = Original, 2 = erste Überarbeitung, ...)
-- original_id: zeigt auf das allererste Angebot dieser Serie (null beim Original selbst)

alter table quotes
  add column if not exists revision smallint not null default 1,
  add column if not exists original_id uuid references quotes(id) on delete set null;

-- Index für schnelles Abrufen aller Revisionen eines Angebots
create index if not exists idx_quotes_original_id on quotes(original_id);

comment on column quotes.revision is 'Revisionsnummer: 1 = Original, 2 = erste Überarbeitung usw.';
comment on column quotes.original_id is 'UUID des allerersten Angebots in dieser Serie (null beim Original)';
