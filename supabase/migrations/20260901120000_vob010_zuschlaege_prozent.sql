-- VOB-010 / L6 — Fund von Head of Legal & Compliance (2026-09-01).
--
-- 14 Katalogeinträge über 10 Gewerke tragen den Prozentsatz im TITEL, hatten
-- aber die Einheit „Pauschale" und den Prozentwert als EURO-Preis:
-- „Zuschlag Wochenend- / Feiertagsarbeit (25%)" = 25,00 € statt 25 % der
-- Leistung. Auf einem 5.000-€-Auftrag also 25 € statt 1.250 €.
--
-- In jedem der 14 Fälle ist der Preis exakt gleich der Prozentzahl im Titel —
-- derselbe Eingabefehler wie bei den fünf Maler-Zuschlägen vom 31.08. Der Wert
-- bleibt deshalb stehen, nur die Einheit wird richtiggestellt; damit rechnet
-- ihn `zuschlag-basis.ts` künftig als Prozentsatz auf die Bemessungsgrundlage.
--
-- Bewusst ausgenommen: „Gefälleestrich … (2% Gefälle)" und „(1–2% Gefälle)".
-- Dort ist das Prozent ein Gefälle, kein Zuschlag — die Euro-Preise stimmen.
-- Deshalb greift die Bedingung nur auf Titel, in denen die Prozentzahl
-- unmittelbar vor der schließenden Klammer steht.

update price_items
set unit = '%',
    ist_erschwerniszuschlag = true,
    zuschlag_typ = 'prozent',
    erschwerniszuschlag_fuer = coalesce(erschwerniszuschlag_fuer, 'Leistungen dieses Gewerks')
where category like '%– Erschwernisse & Zuschläge'
  and unit = 'Pauschale'
  and title ~ '[0-9]+%\)'
  and unit_price = (regexp_match(title, '([0-9]+)%\)'))[1]::numeric;
