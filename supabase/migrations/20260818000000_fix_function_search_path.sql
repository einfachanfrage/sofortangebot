-- Nebenbefund aus CoS-P-001 (2026-08-17), jetzt nachgezogen: Supabase
-- Security Advisor meldete 9 Funktionen mit "mutable search_path" (WARN).
--
-- Risiko: ohne fest gesetzten search_path löst Postgres unqualifizierte
-- Objektnamen (Tabellen, andere Funktionen) danach auf, was im aktuellen
-- "search_path" der aufrufenden Session steht — bei SECURITY DEFINER-
-- Funktionen (laufen mit den Rechten des Erstellers, nicht des Aufrufers)
-- könnte das theoretisch missbraucht werden, um die Funktion durch ein
-- gleichnamiges Objekt in einem anderen Schema "umzuleiten". Fix: search_path
-- pro Funktion fest auf `public, pg_temp` setzen — das entspricht dem
-- bisherigen faktischen Verhalten (alle Referenzen sind unqualifiziert und
-- liegen in `public`), macht es nur zusätzlich unveränderlich.
--
-- Kein Verhaltensunterschied für die App, nur ein Härtungs-Fix. Betrifft
-- 9 Funktionen: get_vault_secret, update_aktualisiert_am,
-- vergib_naechste_nummer, init_nummernkreise, lookup_nutzer_begriff,
-- bestatige_nutzer_match, registriere_korrektur, check_rate_limit,
-- increment_nutzung. Signaturen per pg_proc abgefragt statt geraten, damit
-- ALTER FUNCTION nicht an falschen Parametertypen scheitert.

ALTER FUNCTION public.get_vault_secret(secret_name text) SET search_path = public, pg_temp;
ALTER FUNCTION public.update_aktualisiert_am() SET search_path = public, pg_temp;
ALTER FUNCTION public.vergib_naechste_nummer(p_betrieb_id uuid, p_typ text, p_angebot_id uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.init_nummernkreise(p_betrieb_id uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.lookup_nutzer_begriff(p_user_id uuid, p_begriff text, p_gewerk_id text) SET search_path = public, pg_temp;
ALTER FUNCTION public.bestatige_nutzer_match(p_user_id uuid, p_betrieb_id uuid, p_begriff text, p_position_id text, p_gewerk_id text) SET search_path = public, pg_temp;
ALTER FUNCTION public.registriere_korrektur(p_user_id uuid, p_betrieb_id uuid, p_begriff text, p_alter_position_id text, p_neuer_position_id text, p_gewerk_id text) SET search_path = public, pg_temp;
ALTER FUNCTION public.check_rate_limit(p_identifier text, p_endpunkt text, p_limit integer, p_fenster_minuten integer) SET search_path = public, pg_temp;
ALTER FUNCTION public.increment_nutzung(p_item_id uuid) SET search_path = public, pg_temp;
