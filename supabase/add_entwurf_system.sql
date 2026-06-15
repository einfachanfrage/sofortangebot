-- Entwurfs-System für Sofortangebot
-- Ausführen im Supabase SQL Editor

-- 1. Neue Spalten auf quotes ────────────────────────────────────────────────
ALTER TABLE quotes
  ADD COLUMN IF NOT EXISTS entwurf_gespeichert_am TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS entwurf_geraet TEXT;
  -- 'ios' | 'android' | 'web'

-- 2. Entwurf-Aufnahmen Tabelle ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS entwurf_aufnahmen (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  angebot_id            UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  typ                   TEXT NOT NULL CHECK (typ IN ('sprache', 'notiz', 'foto')),

  -- Sprache
  audio_url             TEXT,
  audio_dauer_sekunden  INT,
  transkript            TEXT,

  -- KI-Ergebnis
  erkannte_positionen   JSONB DEFAULT '[]',
  verarbeitung_status   TEXT NOT NULL DEFAULT 'ausstehend'
    CHECK (verarbeitung_status IN ('ausstehend', 'verarbeitung', 'fertig', 'fehler')),

  -- Notiz
  notiz_text            TEXT,

  -- Foto
  foto_url              TEXT,
  foto_beschreibung     TEXT,
  in_pdf                BOOLEAN NOT NULL DEFAULT FALSE,

  -- Meta
  erstellt_am           TIMESTAMPTZ NOT NULL DEFAULT now(),
  geraet                TEXT,
  sortierung            INT NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_entwurf_aufnahmen_angebot
  ON entwurf_aufnahmen(angebot_id, erstellt_am);

ALTER TABLE entwurf_aufnahmen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Eigene Entwurfsaufnahmen verwalten"
  ON entwurf_aufnahmen
  FOR ALL
  USING (
    angebot_id IN (
      SELECT q.id FROM quotes q
      JOIN companies c ON c.id = q.company_id
      WHERE c.user_id = auth.uid()
    )
  )
  WITH CHECK (
    angebot_id IN (
      SELECT q.id FROM quotes q
      JOIN companies c ON c.id = q.company_id
      WHERE c.user_id = auth.uid()
    )
  );

-- 3. Storage Bucket für Audio ───────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'entwurf-audio',
  'entwurf-audio',
  FALSE,
  26214400, -- 25 MB
  ARRAY['audio/webm', 'audio/mp4', 'audio/m4a', 'audio/ogg', 'audio/mpeg', 'audio/wav']
)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Eigene Audio-Dateien lesen'
  ) THEN
    CREATE POLICY "Eigene Audio-Dateien lesen"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'entwurf-audio' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Eigene Audio-Dateien hochladen'
  ) THEN
    CREATE POLICY "Eigene Audio-Dateien hochladen"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'entwurf-audio' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Eigene Audio-Dateien löschen'
  ) THEN
    CREATE POLICY "Eigene Audio-Dateien löschen"
      ON storage.objects FOR DELETE
      USING (bucket_id = 'entwurf-audio' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;

-- 4. Storage Bucket für Fotos ───────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'entwurf-fotos',
  'entwurf-fotos',
  FALSE,
  10485760, -- 10 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Eigene Foto-Dateien lesen'
  ) THEN
    CREATE POLICY "Eigene Foto-Dateien lesen"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'entwurf-fotos' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Eigene Foto-Dateien hochladen'
  ) THEN
    CREATE POLICY "Eigene Foto-Dateien hochladen"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'entwurf-fotos' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Eigene Foto-Dateien löschen'
  ) THEN
    CREATE POLICY "Eigene Foto-Dateien löschen"
      ON storage.objects FOR DELETE
      USING (bucket_id = 'entwurf-fotos' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;
