-- DC-027 / CoS-017: Der Handwerker kann im fertigen Angebot bisher nicht
-- unterscheiden, welche Position er selbst gesagt hat und welche das Tool
-- automatisch ergänzt hat (z. B. "Boden schützen", Erschwerniszuschläge,
-- Grundierung nach Spachtelarbeiten). Beides sieht optisch identisch aus.
--
-- Diese Spalte trägt genau diese eine Information bis in die Positionsliste:
-- true = von den Vollständigkeitsregeln ergänzt, false = so aus der Aufnahme
-- übernommen. Gesetzt wird sie zentral in
-- src/lib/vollstaendigkeit/index.ts (pruefeUndErgaenzeVollstaendigkeit) und
-- über /api/angebot-generieren + /api/entwurf/generiere-positionen
-- durchgereicht. Der Product Designer hängt daran das "Vorschlag"-Badge.
--
-- Rückwärtskompatibel: Default false, not null — bestehende Positionen und
-- älterer App-Code, der die Spalte nicht mitschreibt, funktionieren
-- unverändert weiter.
alter table public.quote_items
  add column if not exists automatisch_ergaenzt boolean not null default false;

comment on column public.quote_items.automatisch_ergaenzt is
  'DC-027: true = vom Tool ergänzt (nicht wörtlich gesagt) — steuert das "Vorschlag"-Badge in der Positionsliste.';
