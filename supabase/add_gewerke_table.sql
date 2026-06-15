-- Gewerke-Tabelle mit aktiv/inaktiv Flag
CREATE TABLE IF NOT EXISTS gewerke (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT,
  beschreibung TEXT,
  aktiv BOOLEAN DEFAULT false,
  sortierung INT DEFAULT 0,
  erstellt_am TIMESTAMP DEFAULT now()
);

-- Gewerke eintragen (ON CONFLICT: aktiv-Status aktualisieren)
INSERT INTO gewerke VALUES
  ('maler',            'Maler & Lackierer',      '🖌',  'Streichen, Spachteln, Tapezieren',          true,  1, now()),
  ('fliesen',          'Fliesen & Naturstein',   '🪟',  'Böden, Wände, Bäder, Terrassen',            true,  2, now()),
  ('trockenbau',       'Trockenbau',             '🧱',  'Rigips, Ständerwände, Unterdecken',         true,  3, now()),
  ('boden_parkett',    'Bodenbeläge & Parkett',  '🏠',  'Laminat, Vinyl, Parkett, Teppich',          true,  4, now()),
  ('sanitaer_heizung', 'Sanitär & Heizung',      '🚿',  'Bad, WC, Heizung, Rohrleitungen',           true,  5, now()),
  ('elektro',          'Elektro',                '⚡',  'Leitungen, Steckdosen, Verteilung',         true,  6, now()),
  ('putz_stuck',       'Putz & Stuck',           '🪣',  'Innen-/Außenputz, Kalkputz',               false, 7, now()),
  ('estrich',          'Estrich & Ausgleich',    '📐',  'Estrich, Ausgleichsmasse',                  false, 8, now()),
  ('schreiner_tischler','Schreiner & Tischler',  '🪚',  'Möbel, Türen, Einbauschränke',              false, 9, now()),
  ('dachdecker_zimmerer','Dachdecker & Zimmerer','🏗',  'Dach, Dachstuhl, Zimmerei',                 false,10, now()),
  ('fenster_tueren',   'Fenster & Türen',        '🚪',  'Fenster, Türen, Rollladen',                 false,11, now()),
  ('entruempelung_transport','Entrümpelung',     '🚛',  'Entrümpelung, Haushaltsauflösung',           false,12, now()),
  ('galabau',          'Garten & Landschaft',    '🌿',  'Garten, Pflaster, Bepflanzung',             false,13, now()),
  ('gebaeudereinigung','Gebäudereinigung',        '🧹',  'Unterhaltsreinigung, Grundreinigung',       false,14, now()),
  ('abbruch_rueckbau', 'Abbruch & Rückbau',      '💪',  'Abbruch, Entkernung, Rückbau',              false,15, now()),
  ('fassade',          'Fassade & Außen',        '🏢',  'Fassade, WDVS, Außenputz',                  false,16, now()),
  ('rohbau_maurer',    'Rohbau & Maurer',        '🧱',  'Mauerwerk, Beton, Fundamente',              false,17, now()),
  ('brandschutz',      'Brandschutz & Aufzug',   '🔥',  'Brandschutz, Aufzug, Luftdicht',            false,18, now())
ON CONFLICT (id) DO UPDATE
  SET aktiv = EXCLUDED.aktiv,
      sortierung = EXCLUDED.sortierung;

-- Waitlist für inaktive Gewerke (optionale Funktion)
CREATE TABLE IF NOT EXISTS gewerk_waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  gewerk_id TEXT NOT NULL,
  erstellt_am TIMESTAMP DEFAULT now()
);

-- RLS
ALTER TABLE gewerke ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gewerke_public_read" ON gewerke FOR SELECT USING (true);

ALTER TABLE gewerk_waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "waitlist_insert_public" ON gewerk_waitlist FOR INSERT WITH CHECK (true);
