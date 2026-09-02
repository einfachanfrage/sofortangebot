-- Sichtbarkeit für Hintergrundjobs (Head of Product Engineering, 2026-09-02)
--
-- Anlass: Sandys Frage „ist CRON_SECRET bei Vercel gesetzt?". Sie ist von
-- außen nicht beantwortbar — die Route antwortet mit 401, egal ob das Secret
-- fehlt oder falsch ist, und ein Job, der gar nicht erst startet, hinterlässt
-- überhaupt nichts. Genau deshalb ist beim Erinnerungs-Job monatelang
-- niemandem aufgefallen, dass er nie eine einzige E-Mail verschickt hat:
-- 75 Angebote, keins je mit `reminder_sent_at`.
--
-- Ein Hintergrundjob ohne Spur ist ein Versprechen ohne Beleg. Ab hier
-- schreibt jeder Lauf eine Zeile — und „hat der Job gestern gelaufen?" ist
-- eine Datenbankabfrage statt einer Vermutung.

CREATE TABLE IF NOT EXISTS system_laeufe (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job          TEXT        NOT NULL,
  gestartet_am TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  beendet_am   TIMESTAMPTZ,
  ok           BOOLEAN,
  details      JSONB,
  fehler       TEXT
);

CREATE INDEX IF NOT EXISTS idx_system_laeufe_job_zeit
  ON system_laeufe (job, gestartet_am DESC);

-- Kein Personenbezug, aber auch nichts, was ein Nutzer sehen muss: RLS an,
-- keine Policy — damit kommt ausschließlich die Service-Rolle heran.
ALTER TABLE system_laeufe ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE system_laeufe IS
  'Ein Eintrag je Lauf eines Hintergrundjobs (cron). Beantwortet "lief der Job?" ohne Zugriff auf die Hosting-Oberflaeche.';

-- Aufräumen des Aufräumers: die Protokollzeilen selbst sind nach einem Jahr
-- wertlos. Wird vom Job `aufraeumen` miterledigt (siehe cron/aufraeumen).
