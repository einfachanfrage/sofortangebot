-- Push Subscriptions Tabelle
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Eigene Push-Subscriptions verwalten"
  ON push_subscriptions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Banner-Status auf companies-Tabelle
ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS pwa_banner_shown BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS push_banner_shown BOOLEAN NOT NULL DEFAULT false;
