-- Konto-Löschung, die wirklich löscht (Head of Product Engineering, 2026-09-02)
--
-- Ausgangslage: `api/account/delete` hat bisher NUR `companies.deleted_at`
-- gesetzt. Auth-Nutzer, Angebote, Kundendaten, Aufnahmen und alle Dateien im
-- Storage blieben unbefristet liegen. Dem standen drei eigene Zusagen
-- gegenüber — Datenschutzerklärung Abschnitt 8, Abschnitt 6 und AGB § 6.5
-- („nach 30 Tagen unwiderruflich gelöscht"). Die 30-Tage-Frist war sogar
-- schon gebaut (RestoreBanner + api/account/restore); es fehlte nur das,
-- was danach passieren sollte. Der Kommentar in
-- 20260613135944_add_soft_delete.sql hat den fehlenden Schritt wörtlich
-- vorweggenommen.
--
-- Diese Funktion ist der DB-Teil der harten Löschung. Sie läuft in EINER
-- Transaktion: entweder ist das Konto weg oder gar nichts hat sich geändert.
-- Storage-Dateien und der Auth-Nutzer werden außerhalb gelöscht (beides ist
-- nicht transaktional) — deshalb räumt der Aufrufer ZUERST den Storage und
-- ruft DANN diese Funktion: eine verwaiste Datei ohne DB-Zeile ist
-- unauffindbar, eine DB-Zeile ohne Datei wäre ein kaputtes Konto.
--
-- Was über `companies` kaskadiert und deshalb hier NICHT einzeln steht:
--   baustellen, briefpapiere, customers, integrations, nummernkreise,
--   positions_empfehlungen, price_items, quotes → quote_items, quote_photos,
--   angebot_eingaben, angebot_views, entwurf_aufnahmen, vergebene_nummern.
-- Alles andere mit Personenbezug hängt an user_id ohne Fremdschlüssel und
-- muss ausdrücklich mit weg.

CREATE OR REPLACE FUNCTION konto_hart_loeschen(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_company_id UUID;
  v_email      TEXT;
  v_bericht    JSONB := '{}'::JSONB;
  v_anzahl     INT;
BEGIN
  SELECT id INTO v_company_id FROM companies WHERE user_id = p_user_id;
  SELECT email INTO v_email FROM auth.users WHERE id = p_user_id;

  DELETE FROM ki_usage WHERE user_id = p_user_id;
  GET DIAGNOSTICS v_anzahl = ROW_COUNT;
  v_bericht := v_bericht || jsonb_build_object('ki_usage', v_anzahl);

  DELETE FROM push_subscriptions WHERE user_id = p_user_id;
  GET DIAGNOSTICS v_anzahl = ROW_COUNT;
  v_bericht := v_bericht || jsonb_build_object('push_subscriptions', v_anzahl);

  DELETE FROM debug_extraktion_roh WHERE user_id = p_user_id;
  GET DIAGNOSTICS v_anzahl = ROW_COUNT;
  v_bericht := v_bericht || jsonb_build_object('debug_extraktion_roh', v_anzahl);

  DELETE FROM nutzer_begriffe
   WHERE user_id = p_user_id
      OR (v_company_id IS NOT NULL AND betrieb_id = v_company_id);
  GET DIAGNOSTICS v_anzahl = ROW_COUNT;
  v_bericht := v_bericht || jsonb_build_object('nutzer_begriffe', v_anzahl);

  -- Ratenbegrenzung protokolliert die Nutzer-ID als `user:<uuid>`.
  -- Technisches Log, aber mit Personenbezug — gehört mit weg.
  DELETE FROM rate_limit_log WHERE identifier = 'user:' || p_user_id::TEXT;
  GET DIAGNOSTICS v_anzahl = ROW_COUNT;
  v_bericht := v_bericht || jsonb_build_object('rate_limit_log', v_anzahl);

  -- Warteliste: eigener Zweck, eigene Einwilligung — aber die
  -- Datenschutzerklärung verspricht die Löschung ALLER mit dem Konto
  -- verbundenen Daten, und die E-Mail-Adresse ist genau das.
  IF v_email IS NOT NULL THEN
    DELETE FROM waitlist WHERE lower(email) = lower(v_email);
    GET DIAGNOSTICS v_anzahl = ROW_COUNT;
    v_bericht := v_bericht || jsonb_build_object('waitlist', v_anzahl);

    DELETE FROM gewerk_waitlist WHERE lower(email) = lower(v_email);
    GET DIAGNOSTICS v_anzahl = ROW_COUNT;
    v_bericht := v_bericht || jsonb_build_object('gewerk_waitlist', v_anzahl);
  END IF;

  IF v_company_id IS NOT NULL THEN
    DELETE FROM companies WHERE id = v_company_id;  -- kaskadiert (siehe Kopf)
    GET DIAGNOSTICS v_anzahl = ROW_COUNT;
  ELSE
    v_anzahl := 0;
  END IF;
  v_bericht := v_bericht || jsonb_build_object('companies', v_anzahl);

  RETURN v_bericht || jsonb_build_object('company_id', v_company_id, 'user_id', p_user_id);
END;
$$;

-- SECURITY DEFINER heißt: die Funktion läuft mit den Rechten ihres Besitzers.
-- Sie darf deshalb ausschließlich vom Server (Service-Rolle) aufrufbar sein —
-- sonst könnte ein eingeloggter Nutzer über die öffentliche API ein FREMDES
-- Konto löschen, indem er eine andere user_id übergibt.
REVOKE ALL ON FUNCTION konto_hart_loeschen(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION konto_hart_loeschen(UUID) FROM anon;
REVOKE ALL ON FUNCTION konto_hart_loeschen(UUID) FROM authenticated;
GRANT EXECUTE ON FUNCTION konto_hart_loeschen(UUID) TO service_role;

COMMENT ON FUNCTION konto_hart_loeschen(UUID) IS
  'Löscht alle Daten eines Kontos unwiderruflich (DB-Teil). Storage und Auth-Nutzer räumt der Aufrufer. Nur für service_role.';
