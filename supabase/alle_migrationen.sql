-- ══════════════════════════════════════════════════════════════
-- ALLE AUSSTEHENDEN MIGRATIONEN — einmal im SQL Editor ausführen
-- ══════════════════════════════════════════════════════════════

-- 1) Plan & Stripe Felder
alter table companies
  add column if not exists plan text not null default 'starter' check (plan in ('starter', 'pro', 'enterprise')),
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists plan_expires_at timestamptz;

create index if not exists companies_stripe_customer_id_idx on companies(stripe_customer_id);

-- 2) Share-Token für öffentliche PDF-Links
alter table quotes
  add column if not exists share_token uuid default gen_random_uuid() not null;

create unique index if not exists quotes_share_token_idx on quotes(share_token);

-- Öffentlicher Zugriff auf PDF via Token
create policy "Public can fetch quote by share_token" on quotes
  for select using (share_token is not null);

-- ══════════════════════════════════════════════════════════════
-- HINWEIS: signed_at, signed_by, quote_number, customers.phone
-- sind bereits im ursprünglichen schema.sql enthalten.
-- Nur ausführen falls das Projekt frisch aufgesetzt wurde.
-- ══════════════════════════════════════════════════════════════
