-- Zuarbeit fuer den Product Designer: companies.onboarding_started_at
-- (Head of Product Engineering, 2026-09-02, Punkt 1 von 4 aus seinem
-- Vorschlag "Spaeter fertigstellen", docs/design-check.md)
--
-- Zweck: Heute sind "noch nie angefangen" und "angefangen, aber Firmenname
-- noch leer" aus Sicht der Datenbank derselbe Zustand -- beides ist einfach
-- `companies.name IS NULL`. Deshalb wuerde ein "Spaeter fertigstellen"-Link
-- den Nutzer sofort wieder ins Onboarding zurueckwerfen: genau die Sorte
-- Knopf, die sichtbar etwas tut und nichts bewirkt. Mit dieser Spalte sind
-- die beiden Faelle unterscheidbar.
--
-- Bewusst KEIN Backfill auf created_at: Damit wuerden bestehende Konten
-- schlagartig als "angefangen" gelten und das Dashboard wuerde sich fuer sie
-- anders verhalten. Additiv heisst additiv -- alle bestehenden Zeilen bleiben
-- NULL und verhalten sich exakt wie bisher.
--
-- Punkt 2 (Setzen beim Erreichen von Schritt 2) und Punkt 4 (Link + Banner)
-- baut der Product Designer; Punkt 3 (getDashboardData) liegt im selben
-- Commit wie diese Migration.
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS onboarding_started_at TIMESTAMPTZ;

COMMENT ON COLUMN public.companies.onboarding_started_at IS
  'Wann der Nutzer das Onboarding erstmals erreicht hat. NULL = nie angefangen. Unterscheidet "nie angefangen" von "angefangen, aber unvollstaendig".';
