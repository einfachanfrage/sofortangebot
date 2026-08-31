-- DC-042 — Status-Modell, Sandys Entscheidungen vom 2026-08-31
--
-- Punkt 3: "Abgelehnt" unterscheidet zwischen einem aktiven Nein des Kunden
--          und "nie wieder gehört".
-- Punkt 4: "Beim Kunden seit X Tagen" auf Basis eines echten Versanddatums
--          statt created_at. Die Spalte dafür existiert bereits seit
--          20260613144614 als `gesendet_am` — sie wurde bisher nur von einem
--          der beiden Versandwege geschrieben und von niemandem gelesen. Kein
--          zweites Feld anlegen, sondern das vorhandene vollständig nutzen.
-- Archivieren: bewahrt jetzt den echten Ausgang, statt ihn zu überschreiben.

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS gesendet_am        TIMESTAMPTZ;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS archiviert_am      TIMESTAMPTZ;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS status_vor_archiv  TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS abgelehnt_grund    TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'quotes_abgelehnt_grund_check'
  ) THEN
    ALTER TABLE quotes ADD CONSTRAINT quotes_abgelehnt_grund_check
      CHECK (abgelehnt_grund IS NULL OR abgelehnt_grund IN ('aktiv', 'keine_rueckmeldung'));
  END IF;
END $$;

COMMENT ON COLUMN quotes.gesendet_am       IS 'Zeitpunkt des Versands an den Kunden — Basis für "Beim Kunden seit X Tagen" (DC-042)';
COMMENT ON COLUMN quotes.archiviert_am     IS 'Wann archiviert. Archivieren ist eine Aufräum-Aktion, keine Phase im Lebensweg (DC-042)';
COMMENT ON COLUMN quotes.status_vor_archiv IS 'Echter Ausgang vor dem Archivieren, damit "archiviert" ihn nicht mehr überschreibt (DC-042)';
COMMENT ON COLUMN quotes.abgelehnt_grund   IS 'aktiv = Kunde hat Nein gesagt, keine_rueckmeldung = nie wieder gehört. NULL = unbekannt (DC-042)';

-- Bereits archivierte Angebote bekommen wenigstens ein Datum. Ihr echter
-- Ausgang lässt sich nicht rekonstruieren — er wurde damals überschrieben —,
-- deshalb bleibt status_vor_archiv dort ehrlich leer statt geraten.
UPDATE quotes SET archiviert_am = COALESCE(archiviert_am, created_at)
WHERE status = 'archived' AND archiviert_am IS NULL;
