-- PM-014: echte Race Condition (zwei zeitgleiche Server-Anfragen an
-- /api/entwurf/generiere-positionen) konnte doppelte Positionen im selben
-- Angebot erzeugen, weil beide Anfragen denselben Datenbankstand lasen,
-- bevor eine von beiden geschrieben hatte (TOCTOU). Ein UNIQUE-Constraint
-- auf (quote_id, position) macht die stille Duplizierung strukturell
-- unmöglich: die zweite, kollidierende Schreibung schlägt jetzt sauber mit
-- einem 23505-Fehler fehl. Die App (siehe
-- src/app/api/entwurf/generiere-positionen/route.ts) fängt diesen Fehler ab
-- und behandelt ihn als "jemand anderes war schneller" statt als echten
-- Fehler — mit einem einmaligen Retry auf frischem Datenbankstand.
--
-- Live gegen Produktions-DB angewendet (2026-08-20). Vorher geprüft: keine
-- bestehenden (quote_id, position)-Dubletten in quote_items, Migration lief
-- also ohne Datenbereinigung durch.
alter table public.quote_items
  add constraint quote_items_quote_id_position_key unique (quote_id, position);
