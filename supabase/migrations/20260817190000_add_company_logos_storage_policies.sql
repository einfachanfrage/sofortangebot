-- Fix: Logo-Upload schlägt im Onboarding mit
-- "new row violates row-level security policy" fehl.
--
-- Root Cause: Der Bucket "company-logos" wurde laut Kommentar in schema.sql
-- nur manuell im Supabase Dashboard angelegt — dabei entstehen keine
-- Row-Level-Security-Policies auf storage.objects. Ohne INSERT-Policy lehnt
-- Postgres jeden Upload ab, unabhängig vom eingeloggten Nutzer. Das Muster
-- (Bucket + Policies gemeinsam per Migration, Ordner = auth.uid()) ist in
-- 20260615065725_add_entwurf_system.sql für "entwurf-audio"/"entwurf-fotos"
-- bereits etabliert — hier für "company-logos" nachgezogen.
--
-- Zusätzlich ändert sich der Upload-Pfad in
-- src/app/api/upload-logo/route.ts von `logos/${user.id}.${ext}` zu
-- `${user.id}/logo.${ext}`, damit `storage.foldername(name)[1]` (erstes
-- Pfadsegment) wie bei den anderen Buckets der User-ID entspricht.

-- 1. Bucket sicherstellen (idempotent, falls nur manuell angelegt oder noch
--    gar nicht vorhanden) ───────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'company-logos',
  'company-logos',
  TRUE, -- öffentlich lesbar, wird direkt im PDF/Angebot verlinkt
  5242880, -- 5 MB, siehe Limit in route.ts
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Policies: jeder Nutzer verwaltet ausschließlich seinen eigenen Ordner
--    (erstes Pfadsegment = auth.uid()) ────────────────────────────────────

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Eigenes Firmenlogo lesen'
  ) THEN
    CREATE POLICY "Eigenes Firmenlogo lesen"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'company-logos' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Eigenes Firmenlogo hochladen'
  ) THEN
    CREATE POLICY "Eigenes Firmenlogo hochladen"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'company-logos' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;

-- UPDATE zusätzlich zu INSERT: der Upload-Endpunkt ruft `upload(..., {
-- upsert: true })` auf — beim Ersetzen eines bereits vorhandenen Logos prüft
-- Supabase Storage die UPDATE-Policy, nicht nur INSERT.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Eigenes Firmenlogo ersetzen'
  ) THEN
    CREATE POLICY "Eigenes Firmenlogo ersetzen"
      ON storage.objects FOR UPDATE
      USING (bucket_id = 'company-logos' AND auth.uid()::text = (storage.foldername(name))[1])
      WITH CHECK (bucket_id = 'company-logos' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Eigenes Firmenlogo löschen'
  ) THEN
    CREATE POLICY "Eigenes Firmenlogo löschen"
      ON storage.objects FOR DELETE
      USING (bucket_id = 'company-logos' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;
