-- Staging-Testdaten
-- NUR auf Staging ausführen, nie auf Production!

-- Testbetrieb (wird nach Auth-User-Anlage verknüpft)
INSERT INTO companies (
  id, user_id, name, address, email, phone,
  vat_rate, plan, e_rechnung_aktiv
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000099', -- Staging Test-User (manuell anlegen)
  'Musterbetrieb GmbH (Staging)',
  'Teststraße 1, 10115 Berlin',
  'test@sofortangebot.app',
  '+49 30 12345678',
  19,
  'pro',
  true
) ON CONFLICT (id) DO NOTHING;

-- Testkunde
INSERT INTO customers (
  id, company_id, name, address, email
) VALUES (
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000001',
  'Max Mustermann',
  'Kundenstraße 5, 80331 München',
  'kunde@example.com'
) ON CONFLICT (id) DO NOTHING;

-- Test-Angebot
INSERT INTO quotes (
  id, company_id, customer_id, status,
  total_net, total_vat, total_gross, valid_until
) VALUES (
  '00000000-0000-0000-0000-000000000020',
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000010',
  'draft',
  1000.00, 190.00, 1190.00,
  (now() + interval '30 days')::date
) ON CONFLICT (id) DO NOTHING;

INSERT INTO quote_items (
  quote_id, position, title, quantity, unit, unit_price, total_price
) VALUES
  ('00000000-0000-0000-0000-000000000020', 1, 'Fliesenarbeiten Bad', 12, 'm²', 65.00, 780.00),
  ('00000000-0000-0000-0000-000000000020', 2, 'Kleinmaterial-Pauschale', 1, 'pauschal', 220.00, 220.00)
ON CONFLICT DO NOTHING;
