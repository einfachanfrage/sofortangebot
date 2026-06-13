-- Soft-Delete für Account-Löschung (DSGVO Art. 17)
-- Ausführen in Supabase SQL Editor

-- companies: deleted_at für 30-Tage-Wiederherstellung
ALTER TABLE companies ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Index für schnelle Abfragen gelöschter Accounts
CREATE INDEX IF NOT EXISTS idx_companies_deleted_at ON companies(deleted_at) WHERE deleted_at IS NOT NULL;

-- Optional: Cron-Job in Supabase für Hard-Delete nach 30 Tagen
-- (Edge Function oder pg_cron):
--
-- SELECT cron.schedule('hard-delete-accounts', '0 3 * * *', $$
--   DELETE FROM companies WHERE deleted_at < NOW() - INTERVAL '30 days';
-- $$);
--
-- Hinweis: pg_cron muss in Supabase aktiviert sein (Database → Extensions).
