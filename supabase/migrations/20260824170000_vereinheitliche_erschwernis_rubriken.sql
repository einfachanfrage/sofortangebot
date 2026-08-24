-- Sandys Auftrag (2026-08-24, „es stört mich, ändere das"): In sechs Gewerken
-- gab es zwei Rubriken für dieselbe Sache — „<Gewerk> – Erschwernisse" neben
-- „<Gewerk> – Erschwernisse & Zuschläge". In Abbruch und Rohbau standen beide
-- sogar gleichzeitig im selben Gewerk. Ursache war keine Schlamperei beim
-- Tippen, sondern eine spätere Erweiterung (strukturierte VOB/DIN-
-- Erschwerniszuschläge), die eine eigene Rubrik-Schreibweise mitbrachte statt
-- die vorhandene zu benutzen.
--
-- Im Code ist das in src/lib/default-prices.ts und src/lib/preise-vorlagen.ts
-- vereinheitlicht (40 bzw. 11 Zeilen). Diese Migration zieht die bereits in
-- Betriebs-Preisdatenbanken gelandeten Zeilen nach, damit ein bestehendes
-- Konto nicht weiterhin zwei Rubriken nebeneinander angezeigt bekommt.
--
-- Vorher geprüft: keine Titel-/Einheiten-Kollision zwischen alter und neuer
-- Rubrik (weder im Katalog noch in den Bestandsdaten) — die Zusammenlegung
-- kann also keine Dublette erzeugen. Betroffen zum Zeitpunkt der Anwendung:
-- 33 Zeilen in einem Konto. Rein kosmetisch für die Gruppierung auf /preise;
-- Preis-Matching und Gewerk-Zuordnung hängen ausschließlich am Gewerk-Präfix
-- vor dem „–", nicht am Rubriknamen dahinter.
update public.price_items
set category = category || ' & Zuschläge'
where category like '%– Erschwernisse';
