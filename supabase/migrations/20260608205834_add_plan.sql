-- Plan & Stripe Felder zur companies Tabelle hinzufügen
-- Im Supabase SQL Editor ausführen

alter table companies
  add column if not exists plan text not null default 'starter' check (plan in ('starter', 'pro', 'enterprise')),
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists plan_expires_at timestamptz;

-- Index für Stripe-Lookups
create index if not exists companies_stripe_customer_id_idx on companies(stripe_customer_id);

-- Alle bestehenden User bekommen 'starter' Plan (default greift automatisch)
-- Pro-User können über Stripe Webhook auf 'pro' gesetzt werden
