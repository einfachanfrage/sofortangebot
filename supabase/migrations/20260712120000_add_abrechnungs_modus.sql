-- Abrechnungs-Modus pro Betrieb: wer besitzt Rechnung + (Zahlungs-)Mahnung?
-- Ausführen im Supabase SQL Editor
--
--   'inapp'  = Angebot→Rechnung→Zahlungserinnerung alles in sofortangebot (kein eigenes Buchhaltungstool)
--   'extern' = Rechnung/Mahnwesen laufen in der verknüpften Buchhaltung (lexoffice/sevDesk/…);
--              sofortangebot verschickt KEINE Zahlungserinnerungen (verhindert Doppel-Mahnungen).
--
-- Angebots-Nachfassen (vor Rechnung) läuft bewusst in BEIDEN Modi — das können Buchhaltungstools nicht.

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS abrechnungs_modus TEXT NOT NULL DEFAULT 'inapp'
    CHECK (abrechnungs_modus IN ('inapp', 'extern'));

-- Bestandsbetriebe: Modus aus vorhandener Buchhaltungs-Verknüpfung ableiten
UPDATE companies
  SET abrechnungs_modus = 'extern'
  WHERE accounting_software IS NOT NULL
    AND accounting_software <> 'none';
