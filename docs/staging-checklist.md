# Staging Checklist — vor jedem Production-Deploy

Erst wenn ALLE Punkte grün: Pull Request auf `main` mergen.

## Funktions-Tests auf staging.sofortangebot.app

- [ ] Auf staging.sofortangebot.app eingeloggt (roter Banner sichtbar)
- [ ] Neues Angebot per Spracheingabe erstellt
- [ ] Neues Angebot per Texteingabe erstellt
- [ ] PDF generiert und visuell geprüft
- [ ] E-Mail-Versand getestet (Testempfänger: test@sofortangebot.app)
- [ ] Stripe Test-Zahlung durchgeführt (Karte: 4242 4242 4242 4242)
- [ ] Angebotsnummer korrekt vergeben (GoBD-Format)
- [ ] Briefpapier-Variante ausgewählt und in PDF sichtbar
- [ ] Angebot-Vorschau + Versand-Dialog funktioniert
- [ ] Link-Sharing + QR-Code funktioniert

## Integrationen (falls geändert)

- [ ] Lexoffice Export getestet (Sandbox-Account)
- [ ] sevDesk Export getestet (falls aktiv)

## Technische Checks

- [ ] Mobile Safari (iPhone) geprüft
- [ ] Chrome Android geprüft
- [ ] Keine neuen Sentry-Fehler auf Staging
- [ ] Health Checks alle grün: /api/health, /api/health/pdf, /api/health/ai
- [ ] TypeScript: `npx tsc --noEmit` läuft fehlerfrei

## Datenbank

- [ ] Alle neuen SQL-Migrations auf Staging ausgeführt
- [ ] Migrations auf Production vorbereitet (Datei in /supabase/migrations/)
