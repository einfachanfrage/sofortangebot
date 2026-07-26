-- Öffentliche Tabellen-Policies konnten nicht erzwingen, dass ein Client den
-- geheimen share_token tatsächlich kannte. Dadurch waren gesendete Angebote
-- und Positionen über die Supabase-API auflistbar.
-- Öffentlicher Zugriff läuft nun ausschließlich über serverseitige Endpunkte,
-- die exakt nach dem übergebenen share_token filtern und sichere DTOs liefern.

DROP POLICY IF EXISTS "Public can view sent quotes" ON public.quotes;
DROP POLICY IF EXISTS "Public can fetch quote by share_token" ON public.quotes;
DROP POLICY IF EXISTS "Public can view items of sent quotes" ON public.quote_items;
