-- Debug-Tabelle debug_extraktion_roh war komplett ungeschuetzt (kein RLS,
-- volle Rechte fuer anon + authenticated ueber die REST-API) -- jeder mit dem
-- oeffentlichen Website-Schluessel konnte alle Sprach-Transkripte und
-- KI-Rohdaten aller Nutzer lesen. Fix analog zu ki_usage: RLS an, nur
-- Besitzer sieht eigene Zeile, anon-Zugriff komplett entzogen.
-- Gefunden und direkt auf Produktion geschlossen: 2026-08-17
-- (Platform & Integrations Engineer, CoS-P-001). Diese Datei dokumentiert
-- den bereits angewendeten Fix nachtraeglich im Repo, damit Staging/
-- zukuenftige Migrationslaeufe konsistent bleiben.

alter table public.debug_extraktion_roh enable row level security;

create policy "debug_extraktion_roh_own" on public.debug_extraktion_roh
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

revoke all on public.debug_extraktion_roh from anon;
