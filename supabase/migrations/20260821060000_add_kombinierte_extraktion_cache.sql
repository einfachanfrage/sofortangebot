-- CoS-002 Option 1, Schritt 3 – Mehrfach-Aufnahmen-Fall (Head of Product
-- Engineering, 2026-08-21, Sandys Auftrag "mach komplett rund, das auch
-- noch schließen"): neue Spalte für den spekulativen Vorab-Cache der
-- KOMBINIERTEN Extraktion (mehrere Aufnahmen gemeinsam), zusätzlich zur
-- bestehenden Pro-Aufnahme-Spalte entwurf_aufnahmen.voll_extraktion (die
-- nur den Einzelaufnahme-Fall abdeckt, siehe dortiger Kommentar). Rein
-- additiv, nullable, best-effort — siehe src/lib/kombinierte-extraktion-
-- cache.ts und src/app/api/entwurf/vorab-kombinieren/route.ts.
alter table public.quotes
  add column if not exists kombinierte_extraktion_cache jsonb;

comment on column public.quotes.kombinierte_extraktion_cache is
  'CoS-002 Option 1 Schritt 3 (Mehrfach-Aufnahmen-Fall): spekulativ vorab berechnetes, gecachtes ki-extrahieren-Ergebnis fuer die aktuell kombinierte Aufnahmen-Menge dieses Angebots ({aufnahme_ids: string[], result: ExtrahierteDaten}). Wird von generiere-positionen nur wiederverwendet, wenn aufnahme_ids exakt zur aktuellen Aufnahmen-Menge passt -- sonst faellt die Route auf den bisherigen frischen Kombi-Aufruf zurueck.';
