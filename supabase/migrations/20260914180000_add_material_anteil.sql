-- price_items.material_anteil: der Materialanteil einer Position in € je
-- Einheit (CoS-E-053, Schritt 3 aus `docs/preisliste-konzept.md` Fassung 3).
--
-- Manfred, 14.09.2026: „Wenn ich Material rausziehe, sind es nicht mehr 11,50
-- für Wand 2x, sondern 8,50 plus Farbe. Das muss die App wissen, sonst hab ich
-- Material doppelt."
--
-- Bis hierher kannte die App genau eine Zahl je Position. Woher die 8,50
-- kommen sollen, stand nirgends. Ein Knopf „Material herausziehen" ohne diese
-- Spalte erzeugt eine Materialzeile UND lässt den vollen Preis in der
-- Arbeitszeile stehen — doppelt berechnetes Material.
--
-- ABSOLUT, nicht prozentual: Ein Liter Wandfarbe wird nicht teurer, weil der
-- Betrieb einen höheren Stundensatz hat. Wer seinen Preis anhebt, hebt seine
-- Arbeit an; das Material bleibt. Ein Prozentsatz würde bei jeder
-- Preiserhöhung stillschweigend mitwachsen.
--
-- Bewusst KEIN Backfill und kein DEFAULT. NULL heißt „nicht selbst gesetzt",
-- und dann leitet `src/lib/materialanteil.ts` den Wert aus dem Preis ab —
-- über die Faustregel des Prüfmeisters (innen rund ein Viertel, nie über ein
-- Drittel; Fassade und Boden ein Drittel bis die Hälfte). Das ist besser als
-- ein eingefrorener Backfill: Ändert der Betrieb seinen Preis, stimmt der
-- abgeleitete Materialanteil weiterhin, ein gebackfillter Wert nicht mehr.
--
-- NULL heißt ausdrücklich NICHT „kein Material". Ob eine Position überhaupt
-- Material hat, das der Kunde aussucht, entscheidet der Titel — Zubehör wie
-- Trittschall, Kleister oder Grundierung bekommt gar keinen Schalter.

ALTER TABLE public.price_items
  ADD COLUMN IF NOT EXISTS material_anteil NUMERIC;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'price_items_material_anteil_nicht_negativ'
  ) THEN
    ALTER TABLE public.price_items
      ADD CONSTRAINT price_items_material_anteil_nicht_negativ
      CHECK (material_anteil IS NULL OR material_anteil >= 0);
  END IF;
END $$;

COMMENT ON COLUMN public.price_items.material_anteil IS
  'CoS-E-053: Materialanteil in € je Einheit, absolut. NULL = nicht selbst gesetzt, wird aus dem Preis abgeleitet (src/lib/materialanteil.ts). NULL heißt nicht "kein Material".';
