-- Rate Limiting + KI-Budget-Tracking
-- Ausführen im Supabase SQL Editor

-- 1. Rate-Limit-Log ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rate_limit_log (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier          TEXT NOT NULL,  -- 'user:[id]' oder 'ip:[ip]'
  endpunkt            TEXT NOT NULL,  -- 'ki_extraktion' | 'pdf' | 'api_global' etc.
  zeitfenster_start   TIMESTAMPTZ NOT NULL,
  anzahl_requests     INT DEFAULT 1,
  UNIQUE(identifier, endpunkt, zeitfenster_start)
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_lookup
  ON rate_limit_log(identifier, endpunkt, zeitfenster_start);

ALTER TABLE rate_limit_log ENABLE ROW LEVEL SECURITY;
-- Kein direkter Nutzer-Zugriff — wird nur server-seitig via Service Role genutzt

-- 2. KI-Usage-Tracking ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ki_usage (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL,
  endpunkt    TEXT NOT NULL,     -- 'transkription' | 'extraktion' | 'tts'
  tokens_in   INT DEFAULT 0,
  tokens_out  INT DEFAULT 0,
  kosten_eur  NUMERIC(10,6) DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ki_usage_user_day
  ON ki_usage(user_id, created_at);

ALTER TABLE ki_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ki_usage_own" ON ki_usage
  USING (user_id = auth.uid());

-- 3. KI-Tagesbudget auf companies ────────────────────────────────────────
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS ki_budget_tagesmaximum_eur NUMERIC DEFAULT 2.00;

-- 4. Atomic Rate-Limit-Check (RPC) ────────────────────────────────────────
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_identifier     TEXT,
  p_endpunkt       TEXT,
  p_limit          INT,
  p_fenster_minuten INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_fenster_start TIMESTAMPTZ;
  v_count         INT;
BEGIN
  -- Zeitfenster auf nächste p_fenster_minuten-Grenze runden
  v_fenster_start := date_trunc('minute', now())
    - ((EXTRACT(MINUTE FROM now())::INT % p_fenster_minuten) * interval '1 minute');

  INSERT INTO rate_limit_log (identifier, endpunkt, zeitfenster_start, anzahl_requests)
  VALUES (p_identifier, p_endpunkt, v_fenster_start, 1)
  ON CONFLICT (identifier, endpunkt, zeitfenster_start)
  DO UPDATE SET anzahl_requests = rate_limit_log.anzahl_requests + 1
  RETURNING anzahl_requests INTO v_count;

  RETURN jsonb_build_object(
    'allowed',   v_count <= p_limit,
    'count',     v_count,
    'limit',     p_limit,
    'reset_at',  v_fenster_start + (p_fenster_minuten * interval '1 minute')
  );
END;
$$;

-- 5. Stündliche Cleanup-Cron (pg_cron) ───────────────────────────────────
-- Nur ausführen wenn pg_cron aktiv:
-- SELECT cron.schedule(
--   'rate-limit-cleanup',
--   '0 * * * *',
--   $$ DELETE FROM rate_limit_log WHERE zeitfenster_start < now() - interval '24 hours'; $$
-- );

-- 6. KI-Kosten-Spike Trigger ─────────────────────────────────────────────
-- (net.http_post benötigt pg_net Extension)
-- Erst aktivieren wenn pg_net Extension aktiv:
--
-- CREATE OR REPLACE FUNCTION alert_kosten_spike()
-- RETURNS TRIGGER AS $$
-- DECLARE v_tageskosten NUMERIC;
-- BEGIN
--   SELECT COALESCE(SUM(kosten_eur), 0) INTO v_tageskosten
--   FROM ki_usage
--   WHERE user_id = NEW.user_id
--     AND created_at >= date_trunc('day', now());
--   IF v_tageskosten > 5.00 THEN
--     PERFORM net.http_post(
--       url  := current_setting('app.base_url') || '/api/admin/alert',
--       body := jsonb_build_object('typ','kosten_spike','user_id',NEW.user_id,'tageskosten',v_tageskosten)::text,
--       headers := '{"Content-Type":"application/json"}'::jsonb
--     );
--   END IF;
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
--
-- CREATE TRIGGER ki_kosten_alert
--   AFTER INSERT ON ki_usage
--   FOR EACH ROW EXECUTE FUNCTION alert_kosten_spike();
