create table if not exists positions_empfehlungen (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  trigger_category text not null,
  empfehlung_title text not null,
  empfehlung_unit text not null default 'Stk',
  empfehlung_unit_price numeric(10,2) not null default 0,
  created_at timestamptz default now()
);

alter table positions_empfehlungen enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'positions_empfehlungen'
    and policyname = 'Eigene Empfehlungen'
  ) then
    create policy "Eigene Empfehlungen" on positions_empfehlungen
      for all using (
        company_id in (select id from companies where user_id = auth.uid())
      );
  end if;
end $$;
