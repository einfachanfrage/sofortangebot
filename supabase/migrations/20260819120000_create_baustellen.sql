-- CoS-012/DC-029: "Baustelle"/Projekt-Zuordnung — Datenmodell.
-- Eine Baustelle gehört zu genau einem Kunden, ein Kunde kann mehrere haben
-- (z.B. eine Hausverwaltung mit mehreren Objekten). Struktur + RLS bewusst
-- 1:1 am bewährten `briefpapiere`-Muster orientiert (genau ein "Standard"-/
-- "Erst"-Eintrag pro Bezugsobjekt via partiellem Unique-Index, dieselbe
-- company-gescopte RLS-Policy).
--
-- Schritt 1 von 2 (siehe auch 20260819120100_backfill_baustellen.sql):
-- nur Tabelle + RLS + nullable Spalte auf quotes anlegen — bewusst noch
-- nichts befüllen oder verknüpfen. Lehre aus DC-011: Migration und
-- App-Deploy laufen in diesem Projekt nicht immer synchron, ein Schritt,
-- der für sich allein steht und nichts Bestehendes verändert, ist sicher
-- auch dann, wenn der App-Code, der die neue Spalte nutzt, erst später
-- deployed wird.

CREATE TABLE IF NOT EXISTS baustellen (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id         UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id        UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  name               TEXT NOT NULL,
  adresse            TEXT,
  -- Die automatisch angelegte erste Baustelle pro Kunde — siehe
  -- `src/lib/baustellen.ts`, `getOrCreateErstbaustelle()`. Für die
  -- überwiegende Mehrheit der Nutzer (ein Auftrag pro Kunde) bleibt das die
  -- einzige Baustelle und ist im Produkt nicht sichtbar/wählbar — sichtbar
  -- wird die Auswahl erst, sobald ein Kunde bewusst eine zweite bekommt.
  ist_erstbaustelle  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Höchstens eine Erstbaustelle pro Kunde — verhindert Duplikate auch bei
-- gleichzeitigen Anfragen (siehe Race-Condition-Behandlung in
-- `getOrCreateErstbaustelle()`).
CREATE UNIQUE INDEX IF NOT EXISTS baustellen_erstbaustelle_unique
  ON baustellen (customer_id) WHERE ist_erstbaustelle = TRUE;

CREATE INDEX IF NOT EXISTS baustellen_customer_id_idx ON baustellen (customer_id);
CREATE INDEX IF NOT EXISTS baustellen_company_id_idx ON baustellen (company_id);

ALTER TABLE baustellen ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Nur eigene Baustellen" ON baustellen
  FOR ALL USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

-- Nullable und bewusst dauerhaft nullable (Designer-Antwort DC-029, Frage 4):
-- Angebote ohne Kunde (Entwürfe, die nie über die "ohne Kunde"-Phase
-- hinauskommen) brauchen keine künstliche Platzhalter-Baustelle.
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS baustelle_id UUID REFERENCES baustellen(id);
CREATE INDEX IF NOT EXISTS quotes_baustelle_id_idx ON quotes (baustelle_id);
