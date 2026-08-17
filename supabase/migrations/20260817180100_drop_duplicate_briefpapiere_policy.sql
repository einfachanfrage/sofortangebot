-- Zwei Policies mit identischer Wirkung auf briefpapiere (Aufraeumen, keine
-- Sicherheitsluecke). "briefpapiere_own" bleibt, aelteres Duplikat entfernt.
-- Bereits auf Staging + Produktion angewendet, 2026-08-17
-- (Platform & Integrations Engineer, CoS-P-001).
drop policy if exists "Nur eigene Briefpapiere" on public.briefpapiere;
