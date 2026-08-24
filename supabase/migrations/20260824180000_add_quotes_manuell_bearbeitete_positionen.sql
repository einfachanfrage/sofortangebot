-- CoS-014 (2026-08-24, Sandys Auftrag „fix das"): Handänderungen des
-- Handwerkers vor einer späteren Neu-Berechnung schützen.
--
-- Bisher überlebte eine von Hand geänderte Position eine Neu-Berechnung nur
-- ZUFÄLLIG: /api/entwurf/generiere-positionen arbeitet rein additiv (nur
-- INSERT, nie UPDATE/DELETE), bestehende Zeilen wurden deshalb nie angefasst.
-- Einen echten „das war ich"-Schutz gab es nicht, und zwei Löcher blieben:
-- eine von Hand geänderte MENGE führte zu einer fast-gleichen Zeile DANEBEN
-- (der Dublettenschutz vergleicht Titel und Menge exakt), und eine gelöschte
-- Position kam kommentarlos zurück.
--
-- Bewusst eine Liste am Angebot statt eines Flags je Position: Der Löschfall
-- hat gar keine Zeile mehr, an der ein Flag hängen könnte. Eine Liste von
-- Positionstiteln deckt Ändern, Löschen und Selbst-Hinzufügen mit demselben
-- Mechanismus ab. Der Titel trägt im ganzen Produkt schon die Raum-Zuordnung
-- als Suffix („Wandflächen streichen — Flur") und ist genau das, was die
-- Engine bei einer Neu-Berechnung wieder erzeugen würde.
--
-- Rückwärtskompatibel: leeres Array als Default, not null. Bestehende
-- Angebote verhalten sich unverändert, bis der Handwerker das erste Mal
-- etwas von Hand ändert. Logik: src/lib/manuelle-positionen.ts.
alter table public.quotes
  add column if not exists manuell_bearbeitete_positionen text[] not null default '{}'::text[];

comment on column public.quotes.manuell_bearbeitete_positionen is
  'CoS-014: Titel der Positionen, die der Handwerker selbst geändert, gelöscht oder hinzugefügt hat — eine Neu-Berechnung legt sie nicht erneut an.';
