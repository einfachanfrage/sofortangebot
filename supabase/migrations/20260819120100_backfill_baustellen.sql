-- CoS-012/DC-029: "Baustelle"/Projekt-Zuordnung — Backfill.
-- Schritt 2 von 2 (nach 20260819120000_create_baustellen.sql). Legt für
-- jeden bestehenden Kunden mit mindestens einem Angebot eine Erstbaustelle
-- an und verknüpft alle seine bisherigen Angebote damit, damit nichts
-- verwaist. Namensregel exakt wie in `getOrCreateErstbaustelle()`
-- (`src/lib/baustellen.ts`) — Kundenadresse, falls vorhanden, sonst
-- "Baustelle bei {Kundenname}" (Designer-Antwort DC-029, Frage 3).
--
-- Idempotent über WHERE NOT EXISTS / WHERE baustelle_id IS NULL gebaut —
-- gefahrlos mehrfach ausführbar, z.B. falls sie vor einem künftigen Deploy
-- nochmal laufen muss.

-- 1. Erstbaustelle je Kunde mit mindestens einem Angebot anlegen.
INSERT INTO baustellen (company_id, customer_id, name, adresse, ist_erstbaustelle)
SELECT DISTINCT
  c.company_id,
  c.id,
  COALESCE(NULLIF(TRIM(c.address), ''), 'Baustelle bei ' || c.name),
  c.address,
  TRUE
FROM customers c
WHERE EXISTS (SELECT 1 FROM quotes q WHERE q.customer_id = c.id)
  AND NOT EXISTS (
    SELECT 1 FROM baustellen b WHERE b.customer_id = c.id AND b.ist_erstbaustelle
  );

-- 2. Bestehende Angebote ohne baustelle_id auf die Erstbaustelle ihres
--    Kunden verknüpfen. Angebote ohne Kunden bleiben unverändert NULL.
UPDATE quotes q
SET baustelle_id = b.id
FROM baustellen b
WHERE b.customer_id = q.customer_id
  AND b.ist_erstbaustelle
  AND q.baustelle_id IS NULL
  AND q.customer_id IS NOT NULL;
