-- quotes.zeige_rechenweg_auf_pdf: Rechenweg auf dem Kunden-PDF steuern
-- (Head of Product Engineering, 2026-09-11 — DC-050, Sandys Entscheidung
-- "Frage pro Angebot vor dem PDF-Erstellen", docs/design-check.md)
--
-- Hintergrund: Das CI-Handbuch fordert den Rechenweg auf dem Kundendokument
-- "nie versteckt, nie eingeklappt" (S. 19). Sandy wollte steuern koennen, ob
-- er drauf muss -- ein echter Zielkonflikt, keine Unachtsamkeit. Ihre Wahl:
-- pro Angebot fragen, nicht global schalten und nicht bei jedem Versand neu.
--
-- Semantik:
--   NULL   = noch nicht gefragt -> Rechenweg IST sichtbar (Handbuch-Standard)
--   true   = sichtbar (ausdrueckliche Antwort)
--   false  = ausgeblendet (ausdrueckliche Antwort)
--
-- NULL ist bewusst nicht "aus": Schweigen darf nichts ausblenden. Sonst
-- entscheidet eine fehlende Antwort still gegen die Norm, und der Kunde
-- bekommt ein Dokument, das er nicht nachrechnen kann -- derselbe Grund wie
-- beim Uebermessungs-Hinweis (VOB-004 / Legal G5).
--
-- Bewusst KEIN Backfill: Alle bestehenden Angebote bleiben NULL und zeigen
-- den Rechenweg weiter, exakt wie bisher. Additiv heisst additiv, dieselbe
-- Regel wie bei companies.onboarding_started_at und .mindestauftragswert.
--
-- Geschrieben wird die Spalte vom Ja/Nein-Dialog vor dem PDF-Erstellen
-- (Product Designer). Gelesen wird sie nirgends einzeln: Alle sechs
-- PDF-Routen laden das Angebot mit `select('*')`, die Spalte kommt also von
-- selbst mit, und `AngebotPDF` entscheidet an EINER Stelle. Haette jede Route
-- die Antwort selbst durchreichen muessen, wuerde eine vergessene Stelle das
-- Kundendokument still aendern.

ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS zeige_rechenweg_auf_pdf BOOLEAN;

COMMENT ON COLUMN public.quotes.zeige_rechenweg_auf_pdf IS
  'DC-050: Rechenweg auf dem Kunden-PDF? NULL = noch nicht gefragt (sichtbar, CI-Handbuch S. 19), true = sichtbar, false = ausgeblendet. Nur das Kunden-PDF; die Entwurfsansicht des Handwerkers klappt seit DC-049 unabhaengig davon ein.';
