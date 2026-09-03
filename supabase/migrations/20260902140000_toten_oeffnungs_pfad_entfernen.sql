-- Toter "Kunde hat das Angebot geoeffnet"-Pfad entfernen
-- (Head of Product Engineering, 2026-09-02; setzt DC-042 um)
--
-- Sandys Entscheidung vom 31.08. zu DC-042 Punkt 1 lautete "Streichen". Der
-- Status war gestrichen, die Schemareste standen noch:
--   * angebot_views   -- 0 Zeilen, KEIN Schreibzugriff im gesamten Code
--   * angebot_eingaben -- 0 Zeilen, Vorlaeufer von entwurf_aufnahmen
--   * quotes.geoeffnet_am / geoeffnet_count -- nie gefuellt, nirgends gelesen
--
-- Sie sehen im Schema aus wie eine vorhandene Funktion und sind keine. Genau
-- die Sorte Rest, in der spaeter jemand einen Fehler sucht.
DROP TABLE IF EXISTS public.angebot_views;
DROP TABLE IF EXISTS public.angebot_eingaben;
ALTER TABLE public.quotes DROP COLUMN IF EXISTS geoeffnet_am;
ALTER TABLE public.quotes DROP COLUMN IF EXISTS geoeffnet_count;
