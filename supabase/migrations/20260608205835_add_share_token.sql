-- Share-Token für öffentliche PDF-Links (WhatsApp, E-Mail)
-- Im Supabase SQL Editor ausführen

alter table quotes
  add column if not exists share_token uuid default gen_random_uuid() not null;

-- Unique Index damit kein Token doppelt vorkommt
create unique index if not exists quotes_share_token_idx on quotes(share_token);

-- Öffentlicher Zugriff auf PDF via Token (keine Auth nötig)
create policy "Public can fetch quote by share_token" on quotes
  for select using (share_token is not null);
