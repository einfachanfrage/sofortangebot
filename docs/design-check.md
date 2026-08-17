# Design-Check — offene Punkte UI/UX & CI

Gemeinsame Datei von Sandy, Product Designer (mir), Head of IT und allen, die
am Look & Feel von Sofortangebot mitbauen. Der EINE Ort, an dem der aktuelle
Stand der Design-/CI-Konsistenz-Prüfung steht — nach dem gleichen Prinzip wie
`docs/pruefmeister-testfaelle.md` für QA.

**Ablauf:** Ich (Product Designer) trage neue Befunde ein, sobald ich den Code
durchgehe, und aktualisiere den Status, sobald ich einen Fix sehe oder
nachprüfe. Der Chief of Staff weist offene Punkte den passenden Leuten zu —
bei DC-001 z. B. erst eine Entscheidung von Sandy, danach Umsetzung durch Head
of IT. Wer etwas umsetzt, trägt ein kurzes **Fix-Update** direkt unter dem
jeweiligen Befund ein (was geändert, wie geprüft). Status-Zeile danach
aktualisieren, damit niemand an zwei Stellen nachschauen muss.

Jeder Punkt hat eine feste ID (DC-XXX) — bei Rückfragen einfach auf die ID
verweisen.

**Status-Zeichen:** ✅ behoben & geprüft · 🟡 behoben, noch nicht nachgeprüft ·
🔵 Entscheidung nötig, bevor Umsetzung möglich ist · ❌ offen, bestätigter
Befund · ⏳ noch nicht geprüft.

## Stand auf einen Blick (zuletzt aktualisiert: 2026-08-17)

| ID | Thema | Status | Zuständig |
|---|---|---|---|
| DC-001 | Drei widersprüchliche Preismodelle + „18 Gewerke"-Versprechen | 🔵 Entscheidung von Sandy nötig — live bestätigt | — |
| DC-002 | „Angebote" fehlt in Desktop-Sidebar | ❌ offen — live bestätigt | — |
| DC-003 | Statusfarben für Angebote — 3 inkonsistente Quellen, 1 verworfene Prop | ❌ offen | — |
| DC-004 | `pb-safe` / `pt-safe-top` nicht definiert (Safe-Area auf iPhone) | ❌ offen | — |
| DC-005 | Kein gemeinsamer `Button.tsx`, `active:scale-98` ungültig | ❌ offen | — |
| DC-006 | `typography.ts` + Farb-Tokens (`@theme inline`) werden nirgends genutzt | ❌ offen | — |
| DC-007 | Mobile-Seitentitel: „Angebote"/„Kunden" weiß, „Einstellungen" gelb | ❌ offen — live bestätigt (Screenshot) | — |
| DC-008 | Kleine Sprach-/Textpolitur (Singular/Plural, Umlaut in KI-Wörterbuch) | ❌ offen | — |
| DC-009 | Leere Aufnahme (0 Positionen) wird als grüner Erfolg angezeigt | ❌ offen — live reproduziert | — |
| DC-010 | Keine Guardrail: leeres Angebot (0 €, kein Kunde) lässt sich „fertigstellen" und versandfertig machen | ❌ offen — live reproduziert | — |
| DC-011 | **Kritisch:** Fertiggestelltes Angebot verschwindet komplett aus der Angebote-Liste | ❌ offen — live reproduziert | — |
| DC-012 | Text-Notiz-Eingabe komplett gebaut, aber nirgends verlinkt (keine Alternative zur Sprachaufnahme) | ❌ offen | — |
| DC-013 | AppLayout-Footer stört den fokussierten Aufmaß-Aufnahme-Screen | ❌ offen — live bestätigt | — |
| DC-014 | **Kritisch:** Rohe Datenbank-Fehlermeldung auf Englisch beim Logo-Upload im Onboarding | ❌ offen — live bestätigt (Screenshot) | — |
| DC-015 | Onboarding-Schritte: viel ungenutzter Leerraum zwischen Formular und Button-Leiste | ❌ offen — live bestätigt | — |
| DC-016 | Onboarding: „Weiter"-Button 6× unterschiedlich beschriftet, Klammer-Zahl unklar | ❌ offen — live bestätigt | — |
| DC-017 | Drei verschiedene Icon-Sprachen im Produkt (Lucide / native Emoji / Sketch) | ❌ offen — live bestätigt | — |
| DC-018 | Emoji-Auswahl je Onboarding-Schritt wirkt zufällig (u. a. britisches Pfund-Symbol) | ❌ offen — live bestätigt | — |
| DC-019 | Zwei sehr ähnlich benannte Buchhaltungs-Optionen ohne Erklärung des Unterschieds | ❌ offen — live bestätigt | — |
| DC-020 | Push-Erlaubnis-Screen: Ablehnen-Möglichkeit nicht erkennbar | 🔵 Prüfen, ob nur Screenshot-Ausschnitt | — |

„Zuständig" trägt der Chief of Staff ein, sobald zugewiesen.

---

## DC-001 — Drei widersprüchliche Preismodelle + „18 Gewerke"-Versprechen

**Datum:** 2026-08-16
**Status:** 🔵 Entscheidung von Sandy nötig — danach Umsetzung Head of IT

**Befund:** Der Pro-Plan hat drei unterschiedliche Preise live im Code:
- Landingpage (`src/components/landing/PreiseSection.tsx`): 29 €/Monat, Free = „5 Angebote kostenlos"
- Upgrade-Dialog im Produkt (`src/components/PlanWahlModal.tsx`): 17 €/Monat bei Jahresabo (22 €/Monat sonst), Free = „3 Angebote / Monat"
- Alte, unverlinkte Vorschau-Seite (`src/app/vorschau/page.tsx`, live erreichbar unter `/vorschau`): 9 €/Monat „Basic" + 29 €/Monat Pro

Dazu wirbt `PlanWahlModal.tsx` mit „Alle 18 Gewerke". `src/lib/gewerke.ts` listet 17 Gewerke, davon haben nur 6 (Maler, Boden, Fliesen, Elektro, Sanitär, Trockenbau) eine echte Mengen-Berechnung. Die eigene FAQ auf der Landingpage sagt explizit, dass aktuell bewusst nur Maler und Boden auf dem nötigen Niveau sind.

**Warum blockiert:** Ohne Entscheidung, welcher Preis/welches Freikontingent aktuell korrekt ist, würde Head of IT sonst nur raten.

**Braucht von Sandy:** Verbindlicher Preis + Freikontingent + korrekte Gewerke-Zahl, dann als kurze Notiz hier ergänzen.

**Empfehlung für die Umsetzung (sobald entschieden):** Einen einzigen Datenpunkt (z. B. `lib/pricing.ts`) anlegen, von dem Landingpage, PlanWahlModal und ggf. `/vorschau` lesen — nicht drei Stellen von Hand synchron halten.

**Update 2026-08-17 (Onboarding-Screenshots von Sandy):** Direkt nach
Abschluss des Onboardings erscheint das Plan-Wahl-Fenster mit „Vollgas —
17 €/Monat (Bei Jahresabo. Monatlich 22 €.)" — genau die Stelle, wo eine
neue Person zum allerersten Mal einen Preis sieht. Das ist der früheste
Berührungspunkt im ganzen Produkt und bestätigt nochmal, wie wichtig es
ist, dass dieser Preis mit Landingpage und `/vorschau` übereinstimmt.

**Update 2026-08-17 (live im Browser geprüft):** Auf `/preise` (Preisdatenbank)
sind tatsächlich nur zwei Gewerke mit echten Positionen hinterlegt —
„Bodenbeläge & …" (177 Positionen) und „Maler & Lackie…" (164 Positionen).
Das deckt sich mit der FAQ-Aussage und macht „Alle 18 Gewerke" im
Upgrade-Dialog noch deutlicher zu einem Versprechen, das aktuell nicht
gehalten wird.

---

## DC-002 — „Angebote" fehlt in Desktop-Sidebar

**Datum:** 2026-08-16 · live bestätigt 2026-08-17
**Status:** ❌ offen

**Befund:** `src/components/SideNav.tsx` (feste Desktop-Navigation) hat nur
Dashboard, Kunden, Einstellungen. „Angebote" — in der mobilen `BottomNav.tsx`
einer von genau vier Hauptreitern — fehlt komplett. Am Desktop kommt man nur
über einen 11px-Link „Alle →" auf dem Dashboard dorthin; von Kunden oder
Einstellungen aus gibt es keinen direkten Weg mehr dahin.

**Empfehlung:** Vierten Nav-Punkt „Angebote" in `SideNav.tsx` ergänzen, analog
zu `BottomNav.tsx` (Reihenfolge/Icon dort spiegeln).

**Update 2026-08-17 (live im Browser geprüft):** Im echten Produkt
bestätigt — Desktop-Sidebar zeigt nur Dashboard/Kunden/Einstellungen,
`/angebote` ist nur per direktem Link erreichbar. Mobil ist „Angebote"
selbstverständlich einer von vier Reitern in der Bottom-Nav.

---

## DC-003 — Statusfarben für Angebote: 3 inkonsistente Quellen

**Datum:** 2026-08-16
**Status:** ❌ offen

**Befund:** Drei unabhängige Farb-Maps für denselben Angebots-Status:
`src/app/(app)/angebote/page.tsx`, `src/components/MobileQuoteCard.tsx` und
teilweise `src/app/(app)/dashboard/page.tsx`. Konkret weicht z. B. „Beauftragt"
zwischen `#EDFAF0`/`#1A7A38` und `#DCFCE7`/`#14532D` ab.

Ursache: `MobileQuoteCard` bekommt eine `statusColor`-Prop übergeben, nimmt
sie aber nie entgegen (Funktionssignatur destrukturiert nur `quote,
statusLabel, formattedDate, formattedAmount`) — nutzt stattdessen immer die
eigene interne Farbtabelle. Dadurch sieht dieselbe Statuskarte auf
Desktop-Table und mobiler Kartenliste unterschiedlich aus.

Zusätzlich: Der Status `bereit` (Fertiggestellt) fehlt in der
`STATUS_LABEL`-Map von `angebote/page.tsx` — fällt dort auf „Entwurf" zurück,
obwohl das Angebot schon fertig ist.

**Empfehlung:** Eine zentrale `status-config.ts` mit Label + Farbe pro Status
(inkl. `bereit`), von der alle drei Stellen importieren. `MobileQuoteCard`
so anpassen, dass die `statusColor`-Prop tatsächlich verwendet wird (oder
ganz entfernt wird, wenn die zentrale Quelle reicht).

---

## DC-004 — `pb-safe` / `pt-safe-top` nicht definiert (Safe-Area iPhone)

**Datum:** 2026-08-16
**Status:** ❌ offen

**Befund:** `BottomNav.tsx`, `dashboard/page.tsx` und `entwurf/page.tsx`
nutzen die Klassen `pb-safe` / `pt-safe-top`, damit Inhalte nicht unter der
iPhone-Home-Leiste bzw. Notch verschwinden. Klassen sind nirgends definiert
(kein Tailwind-Plugin in `package.json`, keine eigene Utility in
`globals.css`) — Tailwind generiert dafür keine Regel, die Klassen tun
nichts.

**Empfehlung:** In `src/app/globals.css` eigene Utilities ergänzen, z. B.
`@utility pb-safe { padding-bottom: env(safe-area-inset-bottom); }` und
`@utility pt-safe-top { padding-top: env(safe-area-inset-top); }`
(Tailwind-v4-Syntax), dann auf echtem iPhone mit Home-Indicator prüfen.

---

## DC-005 — Kein gemeinsamer Button, `active:scale-98` ungültig

**Datum:** 2026-08-16
**Status:** ❌ offen

**Befund:** Kein `Button.tsx` vorhanden (nur `Input.tsx` und `Toast.tsx` sind
echte Bausteine). Der gelbe Primär-Button taucht in über 30 leicht
unterschiedlichen Varianten auf (`rounded-xl` vs. `rounded-2xl`, `py-3` vs.
`py-3.5` vs. `py-4` vs. `py-[18px]`, `font-black` vs. `font-extrabold`,
`active:scale-95` vs. `active:scale-[0.98]` vs. `active:scale-[0.97]`).

Konkreter Bug: `src/app/(app)/kunden/page.tsx` und
`src/app/(app)/kunden/[id]/page.tsx` nutzen `active:scale-98` ohne Klammern —
keine gültige Tailwind-Klasse (Skalierungsschritt „98" existiert nicht in der
Standardskala). Der Press-Effekt tut an diesen zwei Stellen nichts.

**Empfehlung:** `Button.tsx` nach Vorbild von `Input.tsx` bauen (Varianten:
primary/secondary/destructive, Größen: default/small), dann schrittweise bei
Gelegenheit migrieren. `active:scale-98` in beiden Dateien zu
`active:scale-[0.98]` korrigieren.

---

## DC-006 — `typography.ts` + Farb-Tokens werden nirgends genutzt

**Datum:** 2026-08-16
**Status:** ❌ offen

**Befund:** `src/lib/typography.ts` definiert saubere Tokens (`h1`, `h2`,
`h3`, `body`, `label` …) — wird laut Grep über `src/` von keiner einzigen
Stelle importiert. Stattdessen 31 verschiedene feste Pixelgrößen im Code
(`text-[14px]`, `text-[13px]`, `text-[11px]` …), oft nur 1px auseinander in
vergleichbaren Kontexten.

Gleiches Bild bei Farben: `globals.css` definiert `--color-yellow`,
`--color-anthracite`, `--color-bg`, `--color-white` als Tailwind-Theme —
genutzt wird kaum etwas davon. Stattdessen 1.530× `#2C2C2C` und 433×
`#F5C400` als Rohwert, dazu Fast-Duplikate bei Grau-/Grüntönen (`#666666`,
`#888888`, `#999999`, `#333333`, `#1A1A1A`, `#111111`; `#1A7A38`, `#2a7a2a`,
`#16a34a`; `#ef4444` vs. `#dc2626`).

**Empfehlung:** Kein Rewrite nötig — neue Stellen konsequent auf
`text-anthracite`/`bg-yellow` (aus `@theme inline`) und die
`typography.ts`-Tokens umstellen. Bestehende Stellen bei Gelegenheit
mitziehen, nicht als eigenen Sprint.

---

## DC-007 — Mobile-Seitentitel: „Angebote"/„Kunden" weiß, „Einstellungen" gelb

**Datum:** 2026-08-17 (live im Browser auf 390×844 geprüft, Screenshot vorhanden)
**Status:** ❌ offen — live bestätigt

**Befund:** Auf dem Handy-Viewport haben alle Listen-Header denselben
dunklen Hintergrund. „Angebote" und „Kunden" zeigen den Seitentitel in Weiß,
„Einstellungen" an derselben Stelle in Gelb (`#F5C400`). Im Code bereits
identifiziert (`text-[#F5C400] md:text-[#2C2C2C]` statt `text-white
md:text-[#2C2C2C]` in `einstellungen/page.tsx`), jetzt live auf dem Gerät
bestätigt — springt im direkten Vergleich sofort ins Auge.

**Empfehlung:** In `src/app/(app)/einstellungen/page.tsx` Zeile mit dem
Seitentitel auf `text-white md:text-[#2C2C2C]` angleichen.

---

## DC-008 — Kleine Sprach-/Textpolitur

**Datum:** 2026-08-17 (live im Browser geprüft)
**Status:** ❌ offen

**Befund:**
- Kunden-Übersicht zeigt bei genau einem Kunden „1 Kunden gesamt" —
  sollte „1 Kunde gesamt" heißen (Singular bei Zähler = 1).
- Unter Einstellungen → App → „Mein Wörterbuch" erscheinen von der KI
  gelernte Begriffe teils ohne Umlaut, z. B. „sockelleisten abkleben
  kueche" statt „…Küche" — wirkt an einer Stelle, die bewusst Vertrauen in
  die Spracherkennung aufbauen soll, unpoliert.

**Empfehlung:** Pluralregel für Zähler wie bei anderen Stellen im Code
(vgl. `quotes.length !== 1 ? 'e' : ''` in `kunden/page.tsx`) auch für
„Kunde/Kunden" anwenden. Umlaut-Normalisierung im Wörterbuch-Speicherpfad
prüfen (KI-Transkript vermutlich vor dem Speichern ASCII-normalisiert).

---

## DC-009 — Leere Aufnahme wird als grüner Erfolg angezeigt

**Datum:** 2026-08-17 (live durchgespielt, Screenshots vorhanden)
**Status:** ❌ offen — live reproduziert

**Befund:** Aufnahme gestartet, 15 Sekunden lang nichts gesagt (Stille), gestoppt.
Ergebnis: Status „✓ Fertig", darunter ein grünes Erfolgs-Banner mit Häkchen
„0 Positionen erkannt — bereit für den Entwurf." und ein aktiver gelber
Haupt-Button „✓ 0 Positionen erkannt / Entwurf erstellen · ca. 10 Sekunden".
Grüne Häkchen-Farbe und das Wort „bereit" signalisieren Erfolg — bei null
erkannten Positionen ist das objektiv kein Erfolg. Ein Handwerker, der kurz
nicht hinschaut, tippt hier guten Gewissens weiter.

**Empfehlung:** Bei 0 erkannten Positionen ein neutrales/warnendes Banner
zeigen („Nichts erkannt — nochmal versuchen?") statt des grünen
Erfolgs-Stils, und den Haupt-Button in diesem Fall durch „Nochmal
aufnehmen" ersetzen statt „Entwurf erstellen" aktiv anzubieten.

---

## DC-010 — Keine Guardrail beim Fertigstellen eines leeren Angebots

**Datum:** 2026-08-17 (live durchgespielt, Screenshots vorhanden)
**Status:** ❌ offen — live reproduziert

**Befund:** Direkter Folgefund von DC-009: Auf „Entwurf erstellen" geklickt →
System erkennt korrekt serverseitig „Keine Positionen erkannt" (rotes
Banner) — zeigt aber **gleichzeitig weiterhin** das grüne
„0 Positionen erkannt — bereit für den Entwurf."-Banner direkt darunter.
Zwei widersprüchliche Zustände (Fehler + Erfolg) gleichzeitig sichtbar, ohne
Hinweis, was als Nächstes zu tun ist — der einzige aktive Button wiederholt
exakt die Aktion, die gerade fehlgeschlagen ist.

Im leeren Angebots-Entwurf (0 €, kein Kunde, keine Positionen) lässt sich
trotzdem ganz normal auf „Fertigstellen" tippen — keine Warnung, keine
Blockade. Status wechselt sofort zu „Fertiggestellt" (grüner Pill), Toast
„Angebot fertiggestellt ✓", und die „Vorschau" zeigt ein komplett leeres,
aber professionell aussehendes PDF (Firmenkopf, Angebotsnummer, Datum,
leere Positionstabelle, 0,00 € Gesamt, Unterschriftszeile) mit „Senden →"
als Haupt-Button — versandfertig an niemanden (kein Kunde zugewiesen).

**Empfehlung:** Vor „Fertigstellen" prüfen: mindestens 1 Position UND ein
zugewiesener Kunde, sonst Button deaktivieren mit kurzem Hinweis statt
stillschweigend zuzulassen. Die widersprüchliche Doppel-Meldung aus DC-009
beheben, dann verschwindet ein Teil dieses Problems automatisch.

---

## DC-011 — Kritisch: Fertiggestelltes Angebot verschwindet aus der Angebote-Liste

**Datum:** 2026-08-17 (live reproduziert, dreifach gegengeprüft)
**Status:** ❌ offen — live reproduziert, **Ursache noch nicht eingegrenzt** (vermutlich Backend/Query, nicht UI)

**Befund:** Das oben erstellte leere „Fertiggestellt"-Angebot (Nr.
2026-493C) ist auf `/angebote` unter „Alle" **nicht sichtbar** — die Seite
zeigt „Noch kein Angebot.", auch nach hartem Reload mit Cache-Bust-Parameter.
Die Detailseite des Angebots (`/angebot/79ac1431-…`) zeigt es weiterhin
korrekt mit Status „Fertiggestellt". Das Dashboard (`/dashboard`) zeigt es
ebenfalls korrekt unter „Zuletzt erstellt" — dort sogar mit dem richtigen
Label „Fertiggestellt" (Dashboard kennt den Status `bereit` in seiner
Label-Map, `angebote/page.tsx` nicht, siehe DC-003).

Das bedeutet: Zwei verschiedene Abfragen auf dieselbe Tabelle
(`getDashboardData()` vs. `getQuotesOverview()` in `src/data/quotes.ts` bzw.
`src/data/dashboard.ts`) liefern unterschiedliche Ergebnismengen für
denselben Datensatz. Für einen Nutzer sieht das aus, als wäre ein gerade
fertiggestelltes Angebot spurlos verschwunden — potenziell
vertrauenszerstörend, wenn es einem zahlenden Kunden mit echten Daten
passiert statt nur bei meinem leeren Test-Datensatz.

**Nicht meine Aufgabe als Product Designer, das im Code zu lokalisieren** —
aber der Verdacht liegt nahe bei `getQuotesOverview()` in `src/data/quotes.ts`:
entweder eine implizite Inner-Join-Bedingung auf `customers` (Angebot hat
keinen zugewiesenen Kunden), oder eine RLS-Policy auf der `quotes`-Tabelle,
die bei fehlendem Kunden oder `total_gross = 0` greift. Bitte Head of IT
gezielt auf diese zwei Stellen ansetzen.

**Empfehlung:** Dringend vor DC-001–DC-010 einordnen, wenn Kapazität knapp
ist — das hier kann echte, bezahlte Angebote betreffen, nicht nur
Design-Politur.

---

## DC-012 — Text-Notiz-Eingabe komplett gebaut, aber nirgends verlinkt

**Datum:** 2026-08-17
**Status:** ❌ offen

**Befund:** In `src/app/(app)/angebot/[id]/entwurf/page.tsx` existiert eine
vollständige `NotizModal`-Komponente („Notiz hinzufügen", Textfeld,
Speichern-Button) inkl. funktionierender `saveNotiz()`-Funktion, die an
`/api/entwurf/notiz` postet — der State `showNotiz`/`setShowNotiz` ist
vorhanden. Aber: `setShowNotiz(true)` wird an keiner Stelle im Code
aufgerufen — kein Button öffnet dieses Modal. Aktuell gibt es im
Aufmaß-Flow nur zwei Eingabewege: Sprachaufnahme oder Foto vom
handschriftlichen Zettel. Eine reine Text-Eingabe (z. B. in lauter
Umgebung, in einer Besprechung, oder wenn man einfach nicht sprechen will)
ist nicht erreichbar, obwohl die Funktion technisch fertig ist.

**Empfehlung:** Kleinen dritten Button/Icon neben „Zettel" und „Aufnehmen"
ergänzen, der `setShowNotiz(true)` aufruft — die Funktion ist bereits
fertig, es fehlt nur die Verlinkung.

---

## DC-013 — AppLayout-Footer stört den fokussierten Aufmaß-Aufnahme-Screen

**Datum:** 2026-08-17 (live bestätigt, Screenshot vorhanden)
**Status:** ❌ offen — live bestätigt

**Befund:** Auf `/angebot/[id]/entwurf` (der bewusst reduzierte,
fokussierte Aufnahme-Screen ohne Bottom-Nav) erscheint trotzdem der globale
Footer aus `(app)/layout.tsx` („© 2026 Sofortangebot · AGB · Datenschutz ·
Impressum") direkt unter der Aufnehmen-/Zettel-Buttonreihe — mit einer
großen leeren Fläche darüber. Wirkt wie ein Leck aus dem globalen Layout in
einen Screen, der bewusst auf „ein Fokus, ein nächster Schritt" ausgelegt
ist (BottomNav wurde ja korrekt ausgeblendet, der Footer nicht).

**Empfehlung:** Footer in `(app)/layout.tsx` über eine Pathname-Prüfung
(oder ein Layout-Flag) auf Fokus-Screens wie `/entwurf` ausblenden, analog
dazu wie BottomNav bereits pro Seite gesteuert wird.

---

## DC-014 — Kritisch: Rohe Datenbank-Fehlermeldung auf Englisch beim Logo-Upload

**Datum:** 2026-08-17 (aus Screenshots von Sandy, Onboarding-Schritt „Dein Logo")
**Status:** ❌ offen — live bestätigt

**Befund:** Wird im Onboarding-Schritt „Dein Logo" ein Bild hochgeladen,
erscheint unter dem Upload-Feld folgende Fehlermeldung im roten Banner,
unübersetzt und im O-Ton der Datenbank:

„Upload fehlgeschlagen: new row violates row-level security policy"

Das ist keine Übersetzungslücke, sondern eine technische Datenbank-Meldung
(Supabase-Zugriffsregel), die eins zu eins an den Handwerker durchgereicht
wird — auf Englisch, mit Fachbegriffen, die selbst für IT-Leute nur mit
Kontext verständlich sind. Das widerspricht dem Grundsatz „klar, menschlich,
kein Amtsdeutsch" fundamental — hier steht praktisch Programmierer-Deutsch,
nicht mal auf Deutsch.

Wichtiger als die Formulierung: Die Fehlermeldung zeigt, dass der
Logo-Upload im Onboarding aktuell offenbar **grundsätzlich fehlschlägt** —
eine Datenbank-Zugriffsregel blockiert das Schreiben, vermutlich weil der
Firmen-Datensatz zu diesem Zeitpunkt im Onboarding noch nicht existiert
oder die Regel den Onboarding-Kontext nicht kennt. Das ist ein
Funktions-Bug, keine reine Text-Frage.

**Empfehlung:**
1. Head of IT: Ursache der RLS-Regel beim Logo-Upload während des
   Onboardings finden und beheben (vermutlich fehlender/verzögerter
   Firmen-Datensatz oder fehlende Policy für den Onboarding-Schritt).
2. Unabhängig davon: Jede Fehlermeldung im Produkt, die aus einer
   API-/Datenbank-Antwort stammt, VOR der Anzeige auf einen freundlichen,
   deutschen Text abbilden (z. B. „Hochladen hat nicht geklappt — bitte
   nochmal versuchen oder später in den Einstellungen nachholen."). Nie
   die Rohmeldung eines Systems direkt anzeigen — das gilt vermutlich nicht
   nur hier, sondern sollte als Grundsatz für alle Fehlerzustände im
   Produkt gelten.

---

## DC-015 — Onboarding: viel ungenutzter Leerraum zwischen Formular und Button-Leiste

**Datum:** 2026-08-17 (aus Screenshots von Sandy)
**Status:** ❌ offen — live bestätigt

**Befund:** In mehreren Onboarding-Schritten (Firmenname, Was machst du,
Rechnungen, Logo) sitzt der Inhalt oben zusammengedrängt, darunter folgt
eine große leere Fläche, bevor unten die Buttons „Zurück"/„Weiter" kommen.
Besonders auffällig beim Logo-Schritt: Nur eine kleine Upload-Box in der
Bildschirmmitte, drumherum fast nur Leerraum. Wirkt auf größeren
Bildschirmen (Tablet, Laptop-Fenster) unfertig statt bewusst reduziert —
„weniger ist mehr" heißt nicht „Fläche leer lassen", sondern gezielt
weglassen, was nicht gebraucht wird. Hier fehlt eher ein gestalterisches
Element (z. B. eine passende Illustration, vertikale Zentrierung des
Inhalts, oder ein größer wirkendes Eingabefeld), das die Fläche bewusst
nutzt.

**Empfehlung:** Inhalt pro Schritt vertikal zentrieren statt oben
anzudocken, oder ein kleines Illustrations-/Grafikelement ergänzen, das zum
jeweiligen Schritt passt (analog zum Icon, aber größer/bewusster
platziert).

---

## DC-016 — Onboarding: „Weiter"-Button uneinheitlich beschriftet

**Datum:** 2026-08-17 (aus Screenshots von Sandy)
**Status:** ❌ offen — live bestätigt

**Befund:** Für dieselbe Aktion („zum nächsten Schritt") gibt es über die
6 Onboarding-Schritte hinweg mindestens fünf verschiedene
Button-Beschriftungen: „Weiter →", „Weiter (1) →", „Weiter (5) →",
„Erstmal überspringen →", „Überspringen →", „Fertig 🚀". Die Zahl in
Klammern bei „Weiter (1)" bzw. „Weiter (5)" ist ohne Erklärung nicht
selbsterklärend — ist das die Anzahl gewählter Gewerke? Die Anzahl
eingetragener Preise? Ein Handwerker, der zum ersten Mal durch den Flow
geht, muss darüber kurz nachdenken statt intuitiv weiterzuklicken.

**Empfehlung:** Einheitliches „Weiter →" für alle Pflichtschritte, „Später
→" oder „Überspringen →" konsistent für alle optionalen Schritte (aktuell
„Erstmal überspringen" vs. „Überspringen" — auch das schon zwei
Varianten), „Fertig 🚀" nur für den letzten Schritt. Zahl in Klammern nur
zeigen, wenn ein kurzer Zusatztext erklärt, wofür sie steht — sonst
weglassen.

---

## DC-017 — Drei verschiedene Icon-Sprachen im Produkt

**Datum:** 2026-08-17
**Status:** ❌ offen — live bestätigt

**Befund:** Im Produkt existieren aktuell drei unterschiedliche
Icon-Stile nebeneinander: (1) Lucide-Linien-Icons in der gesamten Haupt-App
(Navigation, Buttons, Karten) — der eigentliche Standard; (2) native
System-Emoji im gesamten Onboarding (🪜🔨💷💰🎨📊); (3) ein
handgezeichnetes „Sketch"-Mikrofon-Icon (roughjs) exklusiv auf dem
Aufmaß-Start-Screen. Jeder Stil für sich kann funktionieren, aber drei
gleichzeitig ergeben kein einheitliches Bild — genau die Art von Drift,
die ein Designsystem verhindern soll. Emoji wirken zudem je nach
Betriebssystem des Nutzers unterschiedlich (Android/iOS/Windows zeigen
z. T. andere Emoji-Grafiken für dasselbe Zeichen) — im Gegensatz zu Lucide
oder dem Sketch-Icon, die überall gleich aussehen.

**Empfehlung:** Entscheiden, welcher Stil für welchen Kontext gilt (z. B.
Lucide für die App, ein bewusst gewähltes Illustrations-Set nur für
große, seltene Momente wie Onboarding-Start/-Ende), und Emoji als
Platzhalter durch eigene Icons/Illustrationen ersetzen, bevor mehr Screens
im Emoji-Stil dazukommen.

---

## DC-018 — Emoji-Auswahl pro Onboarding-Schritt wirkt zufällig

**Datum:** 2026-08-17
**Status:** ❌ offen — live bestätigt

**Befund:** Die Emoji-Wahl pro Schritt passt teils nicht zum Thema: Eine
Stehleiter (🪜) für „Wie heißt dein Betrieb?" (Firmenname/Adresse) hat
keinen erkennbaren Bezug zum Thema. Auffälliger: Der Schritt „Wie stellst
du Rechnungen?" zeigt eine britische Pfund-Banknote (💷) — in einem
deutschen Produkt für Euro-Rechnungen fachlich falsch, ein Beleg/eine
Quittung (🧾) oder ein Euro-Schein (💶) läge näher.

**Empfehlung:** Emoji pro Schritt kurz gegenprüfen (Firmenname → z. B.
🏢/📋, Rechnungen → 🧾), unabhängig von der grundsätzlicheren Frage aus
DC-017.

---

## DC-019 — Zwei sehr ähnliche Buchhaltungs-Optionen ohne Erklärung des Unterschieds

**Datum:** 2026-08-17
**Status:** ❌ offen — live bestätigt

**Befund:** Im letzten Onboarding-Schritt stehen „Lexware Office" und
„Lexoffice (Legacy)" als zwei separate, gleichrangige Auswahlkarten
direkt untereinander — beide mit Tag „Direkte Verbindung", „Lexware
Office" zusätzlich mit „Beliebt". Für jemanden, der einfach nur „ich nutze
Lexoffice" weiß, ist auf den ersten Blick nicht klar, welche der beiden
Karten die richtige ist bzw. was „Legacy" hier bedeutet.

**Empfehlung:** Kurzen Klarstellungs-Satz ergänzen (z. B. „Nutzt du die
neue Lexware-Office-Oberfläche oder noch den alten Lexoffice-Zugang? Im
Zweifel: Lexware Office.") oder die beiden Optionen zu einer
zusammenführen, falls das technisch möglich ist.

---

## DC-020 — Push-Erlaubnis-Screen: Ablehnen-Möglichkeit nicht erkennbar

**Datum:** 2026-08-17
**Status:** 🔵 Prüfen, ob nur Screenshot-Ausschnitt

**Befund:** Auf dem Bottom-Sheet „Verpasse keine Angebots-Updates" (Push-
Benachrichtigungen) ist im Screenshot nur der Button „Benachrichtigungen
erlauben →" sichtbar. Eine gleichwertige Möglichkeit, abzulehnen oder für
später zu vertagen, ist nicht zu erkennen — könnte am Bildausschnitt
liegen (Sheet evtl. länger als der sichtbare Bereich). Bitte einmal am
echten Gerät nachschauen: Gibt es ein „Nicht jetzt" o. Ä., und ist es
genauso gut auffindbar wie „Erlauben"?

**Empfehlung:** Falls tatsächlich keine gleichwertige Ablehnen-Option
vorhanden ist: ergänzen. Zustimmung zu Benachrichtigungen sollte sich nie
wie die einzige Option anfühlen.

---

## Kleinkram (beobachtet, niedrige Priorität, noch keine eigene ID)

- Preisdatenbank (`/preise`): Gewerke-Namen in der linken Spalte werden
  abgeschnitten („Bodenbeläge &…", „Maler & Lackie…") — Spalte ggf. etwas
  breiter oder Kurzlabel verwenden.
- Aufmaß-Startbildschirm: Das Sketch-Mikrofon-Icon dort ist jetzt Teil von
  DC-017 (drei Icon-Sprachen im Produkt) statt eines eigenen Punkts.
- Beim Durchklicken für diesen Check wurde über den „Neues Angebot"-Button
  ein Test-Entwurf im Konto angelegt (Angebot Nr. 2026-493C, ID
  `79ac1431-…`) und für den Aufnahme-Test bewusst bis „Fertiggestellt"
  durchgespielt (siehe DC-009–DC-011). Er ist leer (0 €, kein Kunde),
  taucht aber wegen DC-011 aktuell NICHT in der Angebote-Liste auf,
  sondern nur auf dem Dashboard und der Detailseite — bitte selbst
  aufräumen/löschen, das mache ich nicht automatisch.

---

## Positiv-Notizen (kein Handlungsbedarf)

`Input.tsx` ist ein vorbildlicher Designsystem-Baustein (ein Style, Kommentar
mit Begründung, überall wiederverwendet). `ConfirmSheet.tsx` ersetzt
konsequent native `confirm()`-Dialoge durch ein markenkonformes Bottom-Sheet.
Ton auf Landingpage/FAQ trifft „menschlich, kein Amtsdeutsch" gut. Die
`Logo`-Komponente mit `variant`-Umkehrmuster (Gelb/Weiß auf Dunkel,
Anthrazit/Gelb auf Hell) ist ein cleveres, einfaches System.

**Aus dem Live-Test des Aufmaß-Flows (2026-08-17):** Der
„Zurück"-Bestätigungsdialog (`zurueck_bestaetigen`-Screen) ist genau
richtig gelöst — er merkt zuverlässig, wenn unverarbeitete Aufnahmen
vorhanden sind, und fragt erst nach, statt Daten stillschweigend zu
verwerfen. Der Angebots-Editor selbst (Kunde/Positionen/Rabatt/Summen,
eine feste Aktionsleiste unten) ist klar gegliedert und fühlt sich sofort
verständlich an — genau das „ein Screen, ein nächster Schritt"-Prinzip, das
ihr wollt. Die Aufnahme-Karte mit Zeitstempel + Status-Badge
(„Verarbeitung…" → „✓ Fertig") gibt während des Wartens ein gutes,
beruhigendes Feedback.

**Aus den Onboarding-Screenshots (2026-08-17):** Der Fortschrittsbalken
oben (6 Segmente, gelb gefüllt bis zum aktuellen Schritt) ist über alle
Schritte hinweg sauber konsistent — man weiß immer, wo man steht.
Start-Screen („Schön dass du dabei bist.") und Abschluss-Screen („Alles
eingerichtet!") bilden mit gleichem dunklem Stil, Konfetti/Wink-Emoji und
ähnlichem Aufbau ein schönes, rundes Klammer-Paar um den ganzen Flow. Die
Kleinunternehmer-Option (§19 UStG) und die AGB-Verlinkung im
Rechnungen-Schritt lösen ein Versprechen aus eurer eigenen FAQ tatsächlich
ein — stimmt überein, sehr gut. Der Vergleich „Ohne Verknüpfung" vs. „Mit
Verknüpfung" im Buchhaltungs-Schritt ist eine klare, schnell verständliche
Entscheidungshilfe ohne viel Text. Der Preis-Editor mit Akkordeon
(Fahrtkosten/Arbeitszeit/Entsorgung, auf/zuklappbar) hält eine an sich
komplexe Aufgabe (eigene Preise eintragen) übersichtlich.
