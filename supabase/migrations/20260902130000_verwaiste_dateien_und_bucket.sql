-- Verwaiste Speicherdateien + oeffentlicher Foto-Bucket
-- (Head of Product Engineering, 2026-09-02)
--
-- Zwei Funde beim Durchgehen der eigenen offenen Punkte:
--
-- 1. Im Bucket `entwurf-audio` liegen 263 Dateien, aber nur 81 Aufnahmen in
--    der Datenbank nennen eine davon. 182 Dateien gehoeren zu geloeschten
--    Entwuerfen und Angeboten -- Sprachaufnahmen aus fremden Wohnungen, die
--    niemand mehr findet. Der neue 30-Tage-Job haette sie nie erwischt: der
--    arbeitet ueber Datenbankzeilen, und die gibt es nicht mehr. Ursache ist
--    immer dieselbe: die Datenbank kaskadiert beim Loeschen, der
--    Objektspeicher kennt keine Kaskade.
--
-- 2. Der Bucket `quote-photos` war oeffentlich, obwohl der Code Zugriffe ueber
--    signierte URLs mit einer Stunde Laufzeit absichert. Ein oeffentlicher
--    Bucket haengt das aus. Inhalt sind Baustellenfotos aus Wohnungen von
--    Endkunden.

-- ── 1. Was kann weg? ───────────────────────────────────────────────────────
-- Die Funktion sagt nur, WAS verwaist ist. Geloescht wird ueber die
-- Storage-API, nie direkt in storage.objects -- sonst bliebe die Datei im
-- Objektspeicher liegen und nur ihr Eintrag waere weg.
CREATE OR REPLACE FUNCTION verwaiste_speicherdateien(
  p_bucket TEXT,
  p_mindestalter INTERVAL DEFAULT INTERVAL '24 hours'
)
RETURNS TABLE(name TEXT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, storage
AS $$
  SELECT o.name
  FROM storage.objects o
  WHERE o.bucket_id = p_bucket
    -- Unbekannter Bucket -> leeres Ergebnis. Niemals "alles ist verwaist".
    AND p_bucket IN ('entwurf-audio', 'entwurf-fotos', 'quote-photos', 'public-pdfs')
    -- Mindestens eine Stunde alt, damit eine Datei, deren Datenbankzeile
    -- gerade erst geschrieben wird, nicht mitten im Upload verschwindet.
    AND o.created_at < NOW() - GREATEST(p_mindestalter, INTERVAL '1 hour')
    AND CASE p_bucket
          WHEN 'entwurf-audio' THEN NOT EXISTS (
            SELECT 1 FROM entwurf_aufnahmen a WHERE a.audio_url = o.name)
          WHEN 'entwurf-fotos' THEN NOT EXISTS (
            SELECT 1 FROM entwurf_aufnahmen a WHERE a.foto_url = o.name)
          WHEN 'quote-photos' THEN NOT EXISTS (
            SELECT 1 FROM quote_photos qp WHERE qp.filename = o.name)
          -- Oeffentliche PDFs: verwaist ODER abgelaufen. Das Angebot traegt
          -- ein Gueltigkeitsdatum, die Datei im oeffentlichen Bucket lief
          -- bisher unbegrenzt weiter -- der Link lief also nie wirklich ab.
          WHEN 'public-pdfs' THEN NOT EXISTS (
            SELECT 1 FROM quotes q
            WHERE q.pdf_public_url LIKE '%' || o.name
              AND COALESCE(q.pdf_url_gueltig_bis, 'infinity'::TIMESTAMPTZ) > NOW())
          ELSE FALSE
        END
$$;

-- Gegenprobe fuer den Aufrufer: Sind ALLE Dateien eines gut gefuellten
-- Buckets angeblich verwaist, ist wahrscheinlich die Verknuepfung kaputt.
CREATE OR REPLACE FUNCTION speicher_dateien_anzahl(p_bucket TEXT)
RETURNS BIGINT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, storage
AS $$
  SELECT count(*) FROM storage.objects WHERE bucket_id = p_bucket
$$;

REVOKE ALL ON FUNCTION verwaiste_speicherdateien(TEXT, INTERVAL) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION speicher_dateien_anzahl(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION verwaiste_speicherdateien(TEXT, INTERVAL) TO service_role;
GRANT EXECUTE ON FUNCTION speicher_dateien_anzahl(TEXT) TO service_role;

-- ── 2. Foto-Bucket schliessen ──────────────────────────────────────────────
-- Alle Zugriffe im Code laufen ueber die Service-Rolle (Upload und
-- createSignedUrl in api/quotes/[id]/photos) -- der Bucket braucht weder das
-- Public-Flag noch eine Policy.
UPDATE storage.buckets SET public = FALSE WHERE id = 'quote-photos';
