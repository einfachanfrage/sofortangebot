-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Companies (Handwerker-Profile)
create table if not exists companies (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  name text not null default '',
  address text not null default '',
  tax_number text,
  iban text,
  logo_url text,
  signature_url text,
  vat_rate integer not null default 19,
  payment_days integer not null default 14,
  language text not null default 'de',
  accounting_software text not null default 'none',
  gewerke text[] not null default '{}',
  created_at timestamptz default now()
);

alter table companies enable row level security;
create policy "Users can manage own company" on companies
  for all using (auth.uid() = user_id);

-- Integrations (OAuth Tokens)
create table if not exists integrations (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id) on delete cascade not null,
  provider text not null,
  access_token text not null,
  refresh_token text,
  expires_at timestamptz,
  created_at timestamptz default now(),
  unique(company_id, provider)
);

alter table integrations enable row level security;
create policy "Users can manage own integrations" on integrations
  for all using (
    exists (select 1 from companies where id = company_id and user_id = auth.uid())
  );

-- Price Items (Preisdatenbank)
create table if not exists price_items (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id) on delete cascade not null,
  category text not null,
  title text not null,
  unit text not null default 'm²',
  unit_price numeric(10,2) not null default 0,
  description text,
  created_at timestamptz default now()
);

alter table price_items enable row level security;
create policy "Users can manage own price items" on price_items
  for all using (
    exists (select 1 from companies where id = company_id and user_id = auth.uid())
  );

-- Customers
create table if not exists customers (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id) on delete cascade not null,
  name text not null,
  address text,
  email text,
  phone text,
  created_at timestamptz default now()
);

alter table customers enable row level security;
create policy "Users can manage own customers" on customers
  for all using (
    exists (select 1 from companies where id = company_id and user_id = auth.uid())
  );

-- Quotes (Angebote)
create table if not exists quotes (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id) on delete cascade not null,
  customer_id uuid references customers(id) on delete set null,
  status text not null default 'draft',
  created_at timestamptz default now(),
  valid_until date,
  total_net numeric(12,2) not null default 0,
  total_vat numeric(12,2) not null default 0,
  total_gross numeric(12,2) not null default 0,
  notes text,
  signed_at timestamptz,
  signed_by text,
  quote_number text
);

alter table quotes enable row level security;
create policy "Users can manage own quotes" on quotes
  for all using (
    exists (select 1 from companies where id = company_id and user_id = auth.uid())
  );

-- Public quote access for customer signing
create policy "Public can view sent quotes" on quotes
  for select using (status in ('sent', 'accepted', 'rejected'));

-- Quote Items (Positionen)
create table if not exists quote_items (
  id uuid primary key default uuid_generate_v4(),
  quote_id uuid references quotes(id) on delete cascade not null,
  position integer not null,
  title text not null,
  description text,
  quantity numeric(10,3) not null default 1,
  unit text not null default 'Stk',
  unit_price numeric(10,2) not null default 0,
  total_price numeric(12,2) not null default 0
);

alter table quote_items enable row level security;
create policy "Users can manage own quote items" on quote_items
  for all using (
    exists (
      select 1 from quotes q
      join companies c on c.id = q.company_id
      where q.id = quote_id and c.user_id = auth.uid()
    )
  );

create policy "Public can view items of sent quotes" on quote_items
  for select using (
    exists (select 1 from quotes where id = quote_id and status in ('sent', 'accepted', 'rejected'))
  );

-- Function: auto-create company record after signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.companies (user_id, name)
  values (new.id, '');
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
