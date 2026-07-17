-- Pro-Angebot-Einstellungen (Zahnrad) — überschreiben die globalen Einstellungen
-- Ausführen im Supabase SQL Editor
--
-- NULL bedeutet überall: "aus den Betriebs-Einstellungen erben" (kein Override).
-- briefpapier_id und valid_until existieren bereits auf quotes.

ALTER TABLE quotes
  ADD COLUMN IF NOT EXISTS angebot_struktur TEXT
    CHECK (angebot_struktur IN ('raeume', 'arbeitsablauf', 'gewerk')),
  ADD COLUMN IF NOT EXISTS kopftext TEXT,
  ADD COLUMN IF NOT EXISTS fusstext TEXT,
  ADD COLUMN IF NOT EXISTS zahlungsziel_tage INT,
  ADD COLUMN IF NOT EXISTS dokument_typ TEXT NOT NULL DEFAULT 'angebot'
    CHECK (dokument_typ IN ('angebot', 'kostenvoranschlag')),
  ADD COLUMN IF NOT EXISTS skonto_prozent NUMERIC,
  ADD COLUMN IF NOT EXISTS skonto_tage INT,
  ADD COLUMN IF NOT EXISTS widerruf_beilegen BOOLEAN,
  ADD COLUMN IF NOT EXISTS preis_darstellung TEXT
    CHECK (preis_darstellung IN ('netto', 'brutto'));
