-- ============================================================
-- MIGRATIONS-STATUS-CHECK
-- Im Supabase SQL-Editor ausführen — zeigt für jede Migration,
-- ob ihr Kern-Objekt in der Datenbank existiert.
-- ❌ FEHLT = Migration aus supabase/migrations/ noch ausführen!
-- ============================================================

WITH checks(reihenfolge, migration, objekt, vorhanden) AS (VALUES
  ( 1, '20260608205834_add_plan',                    'companies.plan',                    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='companies' AND column_name='plan')),
  ( 2, '20260608205835_add_share_token',             'quotes.share_token',                EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quotes' AND column_name='share_token')),
  ( 3, '20260609094154_add_integration_keys',        'companies.lexoffice_api_key',       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='companies' AND column_name='lexoffice_api_key')),
  ( 4, '20260609095656_add_all_integrations',        'companies.fastbill_api_key',        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='companies' AND column_name='fastbill_api_key')),
  ( 5, '20260609103817_add_lexoffice_contact_id',    'customers.lexoffice_contact_id',    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customers' AND column_name='lexoffice_contact_id')),
  ( 6, '20260609104546_add_all_contact_ids',         'customers.sevdesk_contact_id',      EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customers' AND column_name='sevdesk_contact_id')),
  ( 7, '20260609105716_add_reminder_fields',         'quotes.reminder_sent_at',           EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quotes' AND column_name='reminder_sent_at')),
  ( 8, '20260609110211_add_sent_via',                'quotes.sent_via',                   EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quotes' AND column_name='sent_via')),
  ( 9, '20260609140240_add_legal_fields',            'quotes.signer_ip',                  EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quotes' AND column_name='signer_ip')),
  (10, '20260613135123_add_agb_consent',             'companies.agb_akzeptiert_am',       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='companies' AND column_name='agb_akzeptiert_am')),
  (11, '20260613135124_add_zugferd_fields',          'customers.leitweg_id',              EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='customers' AND column_name='leitweg_id')),
  (12, '20260613135944_add_soft_delete',             'companies.deleted_at',              EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='companies' AND column_name='deleted_at')),
  (13, '20260613142431_add_angebot_eingaben',        'Tabelle angebot_eingaben',          EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='angebot_eingaben')),
  (14, '20260613142432_add_quote_photos',            'quotes.internal_notes',             EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quotes' AND column_name='internal_notes')),
  (15, '20260613144614_add_quote_send',              'quotes.gesendet_am',                EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quotes' AND column_name='gesendet_am')),
  (16, '20260613150138_add_nummernkreise',           'Tabelle nummernkreise',             EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='nummernkreise')),
  (17, '20260613191600_add_rate_limiting',           'Funktion check_rate_limit()',       EXISTS (SELECT 1 FROM pg_proc WHERE proname='check_rate_limit')),
  (18, '20260613213937_add_api_versionen',           'Tabelle api_versionen',             EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='api_versionen')),
  (19, '20260614054925_add_vob_normen',              'price_items.vob_norm',              EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='price_items' AND column_name='vob_norm')),
  (20, '20260614060425_add_preisdatenbank_v2',       'price_items.nutzungshaeufigkeit',   EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='price_items' AND column_name='nutzungshaeufigkeit')),
  (21, '20260614132752_create_briefpapiere',         'Tabelle briefpapiere',              EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='briefpapiere')),
  (22, '20260614182218_add_onboarding_fields',       'companies.onboarding_completed',    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='companies' AND column_name='onboarding_completed')),
  (23, '20260614192523_add_ki_increment',            'Funktion increment_nutzung()',      EXISTS (SELECT 1 FROM pg_proc WHERE proname='increment_nutzung')),
  (24, '20260614192524_add_pwa_push',                'Tabelle push_subscriptions',        EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='push_subscriptions')),
  (25, '20260614192525_add_vault_rpc',               'Funktion get_vault_secret()',       EXISTS (SELECT 1 FROM pg_proc WHERE proname='get_vault_secret')),
  (26, '20260615065725_add_entwurf_system',          'Tabelle entwurf_aufnahmen',         EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='entwurf_aufnahmen')),
  (27, '20260615070303_add_gewerke_table',           'Tabelle gewerke',                   EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='gewerke')),
  (28, '20260615193423_add_aufnahme_logging',        'entwurf_aufnahmen.transkript_original', EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='entwurf_aufnahmen' AND column_name='transkript_original')),
  (29, '20260615193424_add_nutzer_learning',         'Tabelle nutzer_begriffe',           EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='nutzer_begriffe')),
  (30, '20260617063703_create_positions_empfehlungen', 'Tabelle positions_empfehlungen',  EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='positions_empfehlungen')),
  (31, '20260623195834_add_lexware_integration',     'companies.lexware_api_key',         EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='companies' AND column_name='lexware_api_key')),
  (32, '20260701173855_add_revision_tracking',       'quotes.revision',                   EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quotes' AND column_name='revision')),
  (33, '20260701173856_create_waitlist',             'Tabelle waitlist',                  EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='waitlist')),
  (34, '20260702092924_add_raum_details',            'quotes.raum_details',               EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quotes' AND column_name='raum_details')),
  (35, '20260704074603_add_kleinmaterial_config',    'companies.kleinmaterial_config',    EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='companies' AND column_name='kleinmaterial_config')),
  (36, '20260704203908_add_anfahrt_config',          'companies.anfahrt_config',          EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='companies' AND column_name='anfahrt_config')),
  (37, '20260705064529_add_company_kontakt',         'companies.website',                 EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='companies' AND column_name='website')),
  (38, '20260712120000_add_abrechnungs_modus',       'companies.abrechnungs_modus',       EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='companies' AND column_name='abrechnungs_modus')),
  (39, '20260714120000_add_berechnungsweg',          'quote_items.berechnungsweg',        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quote_items' AND column_name='berechnungsweg')),
  (40, '20260717120000_add_angebot_struktur',         'companies.angebot_struktur',        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='companies' AND column_name='angebot_struktur')),
  (41, '20260717140000_add_widerruf',                'companies.widerruf_aktiv',          EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='companies' AND column_name='widerruf_aktiv')),
  (42, '20260717160000_add_angebot_optionen',         'quotes.dokument_typ',               EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quotes' AND column_name='dokument_typ')),
  (43, '20260720183000_lock_down_public_quotes',      'keine anonymen Quote-Policies',     NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public'
      AND tablename IN ('quotes', 'quote_items')
      AND policyname IN (
        'Public can view sent quotes',
        'Public can fetch quote by share_token',
        'Public can view items of sent quotes'
      )
  )),
  (44, '20260720204500_add_engine_price_positions',  'Engine-Katalogpositionen',          NOT EXISTS (
    SELECT 1
    FROM companies c
    WHERE NOT EXISTS (
      SELECT 1 FROM price_items p
      WHERE p.company_id = c.id
        AND lower(p.title) = lower('Sockelleisten abkleben')
        AND lower(p.unit) = lower('lfdm')
    )
  )),
  (45, '20260720211000_link_quote_items_to_price_items', 'quote_items.price_item_id',      EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='quote_items' AND column_name='price_item_id')),
  (46, '20260726183000_complete_maler_catalog',       '164 Maler-Katalogpositionen',        NOT EXISTS (
    SELECT 1
    FROM companies c
    WHERE (
        'malerarbeiten' = any(coalesce(c.gewerke, '{}'::text[]))
        OR EXISTS (
          SELECT 1 FROM price_items p0
          WHERE p0.company_id = c.id
            AND p0.category LIKE 'Maler %'
        )
      )
      AND (
        SELECT count(DISTINCT lower(p.title) || '|' || lower(p.unit))
        FROM price_items p
        WHERE p.company_id = c.id
          AND p.category LIKE 'Maler %'
      ) < 164
  )),
  (47, '20260726190000_complete_boden_catalog',       '177 Boden-Katalogpositionen',        NOT EXISTS (
    SELECT 1
    FROM companies c
    WHERE (
        'boden_parkett' = any(coalesce(c.gewerke, '{}'::text[]))
        OR EXISTS (
          SELECT 1 FROM price_items p0
          WHERE p0.company_id = c.id
            AND p0.category LIKE 'Boden %'
        )
      )
      AND (
        SELECT count(DISTINCT lower(p.title) || '|' || lower(p.unit))
        FROM price_items p
        WHERE p.company_id = c.id
          AND p.category LIKE 'Boden %'
      ) < 177
  ))
)
SELECT
  migration,
  objekt,
  CASE WHEN vorhanden THEN '✅ ausgeführt' ELSE '❌ FEHLT' END AS status
FROM checks
ORDER BY vorhanden ASC, reihenfolge ASC;
