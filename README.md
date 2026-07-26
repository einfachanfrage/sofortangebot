# sofortangebot

Webanwendung zum Erfassen, Kalkulieren, Versenden und Unterzeichnen von Handwerkerangeboten. Die Anwendung basiert auf Next.js, React, Supabase und TypeScript und unterstützt unter anderem KI-gestützte Angebotserstellung, PDF-Ausgabe, Kundenverwaltung und Buchhaltungsintegrationen.

## Voraussetzungen

- Node.js 20
- npm
- Ein Supabase-Projekt
- API-Zugänge für die Funktionen, die lokal verwendet werden sollen

## Lokale Einrichtung

```bash
npm ci
```

Die Beispielkonfiguration kopieren und anschließend mit lokalen Zugangsdaten befüllen:

```powershell
Copy-Item .env.example .env.local
```

Unter macOS oder Linux:

```bash
cp .env.example .env.local
```

Danach den Entwicklungsserver starten:

```bash
npm run dev
```

Die Anwendung ist anschließend unter [http://localhost:3000](http://localhost:3000) erreichbar.

## Konfiguration

Alle unterstützten Variablen und Erläuterungen stehen in [`.env.example`](.env.example). Für den grundlegenden Betrieb werden insbesondere diese Werte benötigt:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- `ADMIN_EMAIL`
- `ALERT_SECRET`

Je nach aktivierter Funktion werden außerdem Zugangsdaten für OpenAI, Resend und Stripe benötigt. `.env.local` enthält Geheimnisse und darf nicht committet werden.

## Datenbank

Das aktuelle Referenzschema liegt in [`supabase/schema.sql`](supabase/schema.sql). Fortlaufende Änderungen befinden sich in [`supabase/migrations`](supabase/migrations) und müssen in der vorgesehenen Reihenfolge auf das Zielprojekt angewendet werden.

Vor einem Deployment ist insbesondere zu prüfen, dass alle Migrationen eingespielt und die Row-Level-Security-Regeln aktiv sind.

## Qualitätsprüfungen

Vor einem Push sollten dieselben Prüfungen wie in der CI ausgeführt werden:

```bash
npm run lint:ci
npm run typecheck
npm test
npm run build
```

`lint:ci` akzeptiert den aktuell dokumentierten Bestand an ESLint-Warnungen, schlägt aber bei neuen Warnungen oder Fehlern fehl. Der Warnungsgrenzwert soll bei jeder Bereinigung entsprechend abgesenkt werden.

## Continuous Integration

Die GitHub-Actions-Pipeline in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) läuft bei Pull Requests, Pushes auf `main` und bei manueller Ausführung. Sie verwendet Node.js 20 und führt nacheinander folgende Schritte aus:

1. reproduzierbare Installation mit `npm ci`
2. ESLint-Prüfung
3. TypeScript-Prüfung
4. automatisierte Tests
5. Next.js-Produktions-Build

Die CI verwendet ausschließlich Platzhalterwerte für Buildzeit-Validierungen. Echte Produktionsgeheimnisse gehören in die geschützten Umgebungsvariablen der jeweiligen Deployment-Plattform und nicht in den Workflow.

## Projektstruktur

```text
src/app/          Next.js-Seiten und API-Routen
src/components/   wiederverwendbare UI-Komponenten
src/data/         serverseitige Data-Access-Schicht
src/lib/          Fachlogik und Infrastruktur
supabase/         Schema, Migrationen und Edge Functions
tests/            ergänzende Tests und Prüfszenarien
```

Serverseitige Seiten sollen Daten über `src/data` laden. Authentifizierung, Mandantenzuordnung und die Auswahl sicherer Rückgabefelder gehören in diese Data-Access-Schicht, nicht in UI-Komponenten.

## Produktionsbetrieb

```bash
npm run build
npm start
```

Vor einem Launch zusätzlich Migrationen, Secrets, E-Mail-Domain, Stripe-Webhooks, Cron-Authentifizierung und die öffentlichen Angebots- beziehungsweise Signaturabläufe in der Zielumgebung prüfen.
