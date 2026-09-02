-- Debug-Tabelle entfernen (Head of Product Engineering, 2026-09-02)
--
-- `debug_extraktion_roh` wurde am 07.08.2026 von Hand angelegt, um den
-- Multi-Raum-Bug zu finden — mit dem ausdrücklichen Vorsatz „wieder entfernen
-- sobald geklärt". Der Bug ist längst geklärt, die Tabelle blieb: Sie hat
-- seither JEDES Transkript und die vollständige rohe KI-Antwort mitgeschrieben.
-- 137 Zeilen, 4 Konten, 07.08. bis 01.09.
--
-- Das ist das Sensibelste, was durch dieses System läuft: Kundennamen,
-- Adressen und Gesprächsinhalte aus fremden Wohnungen — gespeichert ohne
-- Zweck, ohne Frist und ohne Erwähnung in der Datenschutzerklärung. Es ist
-- außerdem dieselbe Tabelle, die vom 07. bis 17.08. ohne RLS öffentlich
-- lesbar war (Migration 20260817180000 hat das abgestellt).
--
-- Niemand liest sie: Der einzige Zugriff im gesamten Code war der Insert in
-- `ki-extrahieren`. Was aus diesen Daten gelernt wurde, steht als echte
-- Testfälle in `maler-engine.test.ts` und in den Kommentaren von
-- `kontext-analyzer.ts` und `extraktion-normalisierer.ts` — das Wissen bleibt,
-- die Rohdaten gehen.
--
-- Wer für eine künftige Fehlersuche wieder Rohdaten braucht: bitte befristet,
-- mit Löschjob und nur für den eigenen Testaccount — nicht für alle Nutzer.

-- 1. Erst die Konto-Löschung anpassen, dann die Tabelle wegnehmen — sonst
--    scheitert `konto_hart_loeschen()` beim nächsten Aufruf an einer Tabelle,
--    die es nicht mehr gibt, und ein Konto bliebe ungelöscht stehen.
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

  DELETE FROM nutzer_begriffe
   WHERE user_id = p_user_id
      OR (v_company_id IS NOT NULL AND betrieb_id = v_company_id);
  GET DIAGNOSTICS v_anzahl = ROW_COUNT;
  v_bericht := v_bericht || jsonb_build_object('nutzer_begriffe', v_anzahl);

  DELETE FROM rate_limit_log WHERE identifier = 'user:' || p_user_id::TEXT;
  GET DIAGNOSTICS v_anzahl = ROW_COUNT;
  v_bericht := v_bericht || jsonb_build_object('rate_limit_log', v_anzahl);

  IF v_email IS NOT NULL THEN
    DELETE FROM waitlist WHERE lower(email) = lower(v_email);
    GET DIAGNOSTICS v_anzahl = ROW_COUNT;
    v_bericht := v_bericht || jsonb_build_object('waitlist', v_anzahl);

    DELETE FROM gewerk_waitlist WHERE lower(email) = lower(v_email);
    GET DIAGNOSTICS v_anzahl = ROW_COUNT;
    v_bericht := v_bericht || jsonb_build_object('gewerk_waitlist', v_anzahl);
  END IF;

  IF v_company_id IS NOT NULL THEN
    DELETE FROM companies WHERE id = v_company_id;  -- kaskadiert
    GET DIAGNOSTICS v_anzahl = ROW_COUNT;
  ELSE
    v_anzahl := 0;
  END IF;
  v_bericht := v_bericht || jsonb_build_object('companies', v_anzahl);

  RETURN v_bericht || jsonb_build_object('company_id', v_company_id, 'user_id', p_user_id);
END;
$$;

REVOKE ALL ON FUNCTION konto_hart_loeschen(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION konto_hart_loeschen(UUID) FROM anon;
REVOKE ALL ON FUNCTION konto_hart_loeschen(UUID) FROM authenticated;
GRANT EXECUTE ON FUNCTION konto_hart_loeschen(UUID) TO service_role;

-- 2. Tabelle samt Inhalt entfernen. Unwiderruflich, und genau so gemeint.
DROP TABLE IF EXISTS public.debug_extraktion_roh;
