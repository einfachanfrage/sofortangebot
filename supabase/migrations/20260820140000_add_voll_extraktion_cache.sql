-- CoS-002 Option 1, Schritt 1 (Head of Product Engineering, 2026-08-20):
-- neue Spalte zum Cachen der vollen, strukturierten KI-Extraktion
-- (ki-extrahieren) direkt auf der Aufnahme, zusätzlich zur bestehenden
-- schnellen Chip-Vorschau (erkannte_positionen). Rein additiv, nullable,
-- kein bestehender Code liest diese Spalte bisher (kommt in Schritt 2/3,
-- siehe docs/cos-002-architektur-vorschlag.md und
-- src/lib/volle-extraktion-cache.ts).
alter table public.entwurf_aufnahmen
  add column if not exists voll_extraktion jsonb;

comment on column public.entwurf_aufnahmen.voll_extraktion is
  'CoS-002 Option 1: gecachtes Ergebnis der vollen ki-extrahieren-Extraktion (dieselbe, die auch die finale Berechnung nutzt), zusaetzlich zur schnellen Chip-Vorschau in erkannte_positionen. Noch nicht konsumiert (Schritt 1 von 3).';
