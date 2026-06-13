# CHANGELOG

Alle wichtigen Änderungen am Sofortangebot-Projekt.

---

## [Unveröffentlicht] — 2026-06-13 (Session 4)

### Angebots-Vorschau + Direktversand

- **Vorschau Bottom Sheet** (`VorschauUndVersand`): 80%/92vh-Sheet mit Tabs „Vorschau" / „Senden →"
  - Angebot/Rechnung-Toggle in Vorschau, 3s-Erklärer-Banner
  - Skalierte React-Vorschau identisch zum PDF-Layout
- **Tab E-Mail**: Vorbefüllte, editierbare Nachricht (Anrede, Freitext), Betreff, An-Adresse; PDF-Anhang automatisch; ZUGFeRD-Anhang bei B2B-Kunden; reply-to = Handwerker-E-Mail
- **Tab WhatsApp**: Öffentlicher PDF-Link per WhatsApp teilen
- **Tab Link kopieren**: QR-Code (qrcode.react) + URL-Feld + Kopieren-Button
- **PDF-Public-URL** (`/api/quotes/[id]/public-pdf`): Generiert PDF, lädt in Supabase Storage `public-pdfs` hoch (30-Tage-Cache)
- **Send-API** (`/api/quotes/[id]/send`): E-Mail via Resend (reply_to handwerker), Status `sent` setzen, gesendet_via/am/empfaenger_email speichern
- **Footer-Bar** in AngebotDetail: Feste Leiste unten — „+ Position" (nur Edit-Modus) | „Vorschau" | „Senden →"
- **`supabase/add_quote_send.sql`**: `gesendet_am`, `gesendet_via`, `empfaenger_email`, `pdf_public_url`, `pdf_url_gueltig_bis`, `geoeffnet_am`, `geoeffnet_count` + `angebot_views`-Tabelle
- Manuell anzulegen: Supabase Storage Bucket `public-pdfs` (public, PDF only)

## [Unveröffentlicht] — 2026-06-13 (Session 3)

### Angebots-Bearbeitungsansicht — komplett überarbeitet
- **Tabs** „Positionen" und „Notizen & Fotos" im Header
- **Notizen & Fotos-Tab**: Interne Notizen (nicht im PDF), Foto-Anhänge (bis 10), Grid-Ansicht, Lightbox, Toggle „ins PDF"
- **Drag & Drop** Umsortierung der Positionen via `@dnd-kit/sortable` (Drag-Handle rechts)
- **Inline-Bearbeitung**: Tipp auf Position öffnet Edit direkt in Card, Einheiten-Dropdown + Freitext
- **Summenblock**: Nettosumme → Rabatt → Zuschlag → Netto gesamt → MwSt → GESAMT; Kleinunternehmer-Hinweis
- **Rabatt & Zuschläge**: Einklappbarer Bereich im Edit-Modus, % oder absolut, Zuschlag mit eigenem Label
- **KI-Vorschläge-Bar**: Zeigt bis zu 2 Empfehlungen wenn Trigger-Kategorie im Angebot, direkt hinzufügbar
- **Echtzeit-Gesamtsumme** im Header mit MwSt-Hinweis
- **Speichern-Button** nur aktiv wenn Änderungen vorhanden (`hasChanges`)
- **Autosave interne Notizen** nach 1,5s Pause
- **Status `in_bearbeitung`** ergänzt (für Session-Konzept)
- **`supabase/add_quote_photos.sql`**: `quote_photos`-Tabelle, `internal_notes`, Rabatt/Zuschlag-Felder
- **`/api/quotes/[id]/photos`**: GET/POST/PATCH/DELETE für Foto-Management via Supabase Storage

### Session-basierte Spracheingabe
- **Mehrfach-Eingabe**: Zweite Spracheingabe ergänzt bestehende Positionen statt sie zu ersetzen
- **Eingabe-Protokoll**: Aufklappbare Liste je Eingabe (Nr., Transkript, erkannte Positionen)
- **Button „Weiteres Aufmaß einsprechen"** im Review-Schritt
- **`supabase/add_angebot_eingaben.sql`**: `angebot_eingaben`-Tabelle + `has_seen_voice_hint`
- **Dashboard**: Offene `in_bearbeitung`-Sessions werden als gelbe Cards ganz oben angezeigt

### Sprach-Starthilfe
- **Erste-Mal-Karte**: Erscheint beim allerersten Öffnen von „Neues Angebot" mit Beispielsatz + „Verstanden"-Button; danach nie wieder
- **Rotierender Hint-Text** über Mikrofon-Button, gewerk-spezifisch (Maler, Fliesen, Elektro, Sanitär, Zimmerer), wechselt alle 4s
- **„Beispiel anhören"-Button**: Generiert TTS via OpenAI (Stimme: onyx), gecacht in Supabase Storage `tts-cache/`
- **Nach erster Aufnahme**: Einmaliger Hinweis „Gut gemacht. Einfach weitersprechen..."
- **Unvollständigkeits-Check**: Warnung wenn < 3 Positionen oder < 200 € beim Fertigstellen
- **`/api/tts-demo`**: POST-Endpunkt, gewerk-spezifischer Text, Supabase-Cache

---

## [Unveröffentlicht] — 2026-06-13

### Account-Löschung (DSGVO Art. 17), Cookie-Banner, Transaktions-E-Mails, AVV-Update

**Account-Löschung:**
- `AccountDeleteModal`: Roter Button in Einstellungen → Modal mit LÖSCHEN-Bestätigung
- `/api/account/delete`: Soft-Delete (`deleted_at`), Stripe-Abo canceln, Bestätigungs-E-Mail, Logout
- `/api/account/restore`: `deleted_at` zurücksetzen
- `RestoreBanner`: Zeigt 30-Tage-Wiederherstellungsoption beim Login wenn `deleted_at` gesetzt
- `supabase/add_soft_delete.sql`: `companies.deleted_at` + Index + Cron-Job-Vorlage

**Daten-Export:**
- `/api/account/export`: Erzeugt `angebote.csv` + `kunden.csv` und schickt sie per E-Mail
- "Meine Daten exportieren"-Button in Einstellungen

**Cookie-Banner:**
- `CookieBanner`: Informativer Hinweis beim ersten Besuch, localStorage (`cookie_notice_seen`), kein Cookie selbst
- In Root-Layout eingebunden (erscheint auf allen Seiten)

**Transaktions-E-Mails (`src/lib/email.ts`):**
- `sendWelcomeEmail`: Willkommens-E-Mail nach Registrierung (auth/callback)
- `sendQuoteSentConfirmation`: Interne Kopie an Handwerker (bereit zum Einbinden)
- `sendPaymentFailedEmail`: Zahlung fehlgeschlagen (Stripe-Webhook)
- `sendCancellationEmail`: Kündigung bestätigt (Stripe-Webhook `subscription.deleted`)
- `sendAccountDeletedEmail`: Account gelöscht (account/delete)
- `sendDataExportEmail`: Daten-Export als CSV-Anhänge
- Alle E-Mails: Plain Text + HTML, keine Logo-Header, signiert mit „Sandra"

**AVV:**
- `/avv`: Neugeschrieben mit § 1–§ 8, vollständige Unterauftragnehmer-Liste, TOM



### ZUGFeRD / XRechnung E-Rechnung (§ 14 UStG 2025)
- **`src/lib/zugferd/generateXML.ts`**: Vollständiger ZUGFeRD 2.3 / Factur-X EN 16931 XML-Generator — Verkäufer, Käufer, Positionen (Einheiten-Mapping UN/CEFACT), Steuern, Summen, § 19 UStG Kleinunternehmer-Unterstützung
- **`src/lib/zugferd/embedXML.ts`**: PDF-Einbettung via pdf-lib — `factur-x.xml` als `AFRelationship.Alternative`, XMP-Metadaten mit PDF/A-3b-Marker
- **`/api/pdf/xrechnung`**: Neuer Endpunkt — reines XML (kein PDF) für öffentliche Auftraggeber
- **`/api/pdf`**: Bettet ZUGFeRD automatisch ein wenn `e_rechnung_aktiv + kunde.ist_unternehmen`
- **`/api/email`**: Sendet ZUGFeRD-PDF + `factur-x-[Nr].xml` als zweiten Anhang bei B2B-Kunden
- **Einstellungen**: neue Card „E-Rechnung & Compliance" — Toggle, Warn-Banner wenn Steuernummer fehlt, Hinweistext Kleinunternehmer/ab 2027
- **Kunden-Detail**: neuer `KundeTypToggle` — Privat/Geschäft umschalten, USt-IdNr., Leitweg-ID (für XRechnung)
- **Angebot-Detail**: Download-Button zeigt „ZUGFeRD" wenn Geschäftskunde; zusätzlicher XRechnung-Button wenn Leitweg-ID vorhanden
- **SQL**: `supabase/add_zugferd_fields.sql` — `customers.ist_unternehmen`, `customers.ustid`, `customers.leitweg_id`, `companies.e_rechnung_aktiv`
- **Abhängigkeit**: `pdf-lib` installiert

### AGB-Integration (rechtssicher)
- **`/agb`**: Vollständige AGB §1–§12 nach Nutzer-Vorlage (Sandy Holm, Sofortangebot, Version 2026-06)
- **`/avv`**: Neue Seite Auftragsverarbeitungsvertrag gem. Art. 28 DSGVO mit TOM, Unterauftragsverarbeitern, Drittlandübermittlungen
- **Registrierung**: Pflicht-Checkbox "AGB + Datenschutz akzeptieren" vor Submit; Fehlermeldung ohne Haken; `agb_akzeptiert_am` + `agb_version` in `user_metadata` gespeichert
- **App-Footer**: `© 2026 Sofortangebot · AGB · Datenschutz · Impressum` auf jeder App-Seite
- **AGB-Update-Modal** (`AgbUpdateModal`): Blocking-Modal bei veralteter `agb_version`; kein X-Button; aktualisiert `user_metadata` bei Akzeptanz
- **SQL**: `supabase/add_agb_consent.sql` — optionale Spalten `agb_akzeptiert_am` + `agb_version` in `companies`-Tabelle



### Neu
- **Regionaler Preisfaktor** in Einstellungen: Vordefinierte Stufen (+20 %, +10 %, ±0 %, −10 %, −15 %) plus freies Eingabefeld; wird beim Erstellen eines Angebots automatisch geladen und auf Positionen angewendet
- **Mindestauftragswert** in Einstellungen: Wird im Angebot-Flow geprüft und angezeigt
- **Angebotsgültigkeit in Tagen** in Einstellungen (Standard: 30 Tage); `valid_until` im Angebot-Flow wird automatisch gesetzt
- **Mengenrabatt-Tiers** (`MengenrabattTier[]`) auf `PriceItem` und `DraftItem`: Staffelpreise pro Position möglich
- **Empfehlungs-Defaults** (`src/lib/empfehlungen-defaults.ts`): Neue Datei mit branchenspezifischen Standardempfehlungen; Suggestion-Toast im Angebot-Flow
- **Materialpreis-Hinweis** in Einstellungen: Toggle ob Materialpreisvolatilität auf Angeboten ausgewiesen wird
- Einstellungsseite: Card-Titel „Rechnungsstellung" → „Steuer & Rechnungslegung"
- § 19 UStG: Pflichthinweis-Text präzisiert

### Geändert
- `Company`-Typ um 4 neue Felder erweitert: `regionaler_preisfaktor_prozent`, `angebot_gueltig_tage`, `materialpreis_hinweis_aktiv`, `mindestauftragswert`
- `PriceItem`-Typ: neues optionales Feld `mengenrabatt`
- `src/lib/default-prices.ts`: massiv erweitert (Branchen-Preislisten)
- `src/lib/preise-vorlagen.ts`: massiv erweitert (Preisvorlagen)
- `src/lib/pdf.tsx`: kleinere Anpassungen

---

## [1.0.0] — 2026-06-12

### Fixes
- Preisliste auf 50 Einträge begrenzt (Groq TPM-Limit) — `581316e`
- Onboarding Step 6 Celebration-Screen war nie sichtbar (`setStep 7` statt `6`) — `4993488`
- Telefonnummer im Impressum eingetragen — `9fe8ace`
- Alle kritischen Legal/Security-Issues behoben — `891e63e`
- 4 kritische Prod-Blocker behoben — `565728c`

---

## [0.9.0] — 2026-06-11

### Neu
- Nachsprechen-Funktion im Angebot-Edit-Modus — `b9f7555`
- Preis-Picker im Angebot-Flow — `f039c0c`
- Automatische Erinnerung (Cron), Signing-Link in E-Mail, Erinnerungseinstellungen — `f039c0c`
- Kunden-Bestätigungs-E-Mail, Angebots-Ablaufprüfung, Dashboard-Suche & Filter — `c3fa78a`
- Manueller Statuswechsel, `sent_via`-Tracking — `c3fa78a`
- Onboarding komplett neu geschrieben: Welcome-Screen, Logo-Schritt, Buchhaltung-Erklärer — `0165272`
- Logo-Upload mit Format-Hinweisen, Entwürfe-Bereich — `5e0cb32`

### Fixes
- Vercel-Timeout auf KI-Routen + Client-Timeout-Handling — `37161ce`
- TypeScript Build-Errors — `28bf5b6`
- Groq Rate-Limit: schnelleres Modell + kürzerer Prompt + Auto-Retry — `f33b78b`
- Groq-kompatibles Error-Handling + `max_tokens`-Limit — `046c09a`
- OpenAI-Client Timeout + robustes Error-Handling — `83f23e7`
- E-Mail-Absender-Domain auf `sofortangebot.app` vereinheitlicht — `ab93525`

---

## [0.8.0] — früher

### Neu
- Desktop-Layout, Legal-Fixes, UX-Verbesserungen — `c9bdb09`
- Vollständiges Feature-Set: Angebotserstellung per Sprache/Text/Foto, PDF-Generierung, Kunden-Verwaltung, Preislisten, Einstellungen, Onboarding
