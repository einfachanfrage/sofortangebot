CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Nur Service-Role darf lesen (kein öffentlicher Zugriff)
CREATE POLICY "waitlist_insert" ON waitlist
  FOR INSERT WITH CHECK (true);
