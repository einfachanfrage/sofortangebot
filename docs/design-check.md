# Design-Check — offene Punkte UI/UX & CI

Gemeinsame Datei von Sandy, Product Designer (mir), Head of Product
Engineering, Platform & Integrations Engineer und allen, die am Look & Feel
von Sofortangebot mitbauen. Der EINE Ort, an dem der aktuelle Stand der
Design-/CI-Konsistenz-Prüfung steht — nach dem gleichen Prinzip wie
`docs/pruefmeister-testfaelle.md` für QA.

**Ablauf:** Ich (Product Designer) trage neue Befunde ein, sobald ich den Code
durchgehe, und aktualisiere den Status, sobald ich einen Fix sehe oder
nachprüfe. Der Chief of Staff weist offene Punkte den passenden Leuten zu —
bei DC-001 z. B. erst eine Entscheidung von Sandy, danach Umsetzung durch Head
of Product Engineering. Wer etwas umsetzt, trägt ein kurzes **Fix-Update**
direkt unter dem jeweiligen Befund ein (was geändert, wie geprüft).
Status-Zeile danach aktualisieren, damit niemand an zwei Stellen nachschauen
muss.

Jeder Punkt hat eine feste ID (DC-XXX) — bei Rückfragen einfach auf die ID
verweisen.

**Status-Zeichen:** ✅ behoben & geprüft · 🟡 behoben, noch nicht nachgeprüft ·
🔵 Entscheidung nötig, bevor Umsetzung möglich ist · ❌ offen, bestätigter
Befund · ⏳ noch nicht geprüft.

**Hinweis zur Pflege dieser Datei:** Sie ist am 17.08. (jetzt zum zweiten Mal
in dieser Datei, projektweit schon das 5. Mal) durch gleichzeitige
Bearbeitung kurz auf einen älteren Stand zurückgefallen — die
Organigramm-Hinweise und die DC-001-Entscheidung waren dadurch kurz weg,
jetzt vom Chief of Staff wiederhergestellt. DC-007–DC-020 (deine neuen
Befunde) waren davon nicht betroffen. Bitte vor dem Speichern kurz nochmal
lesen, was gerade in der Datei steht, statt eine lokal ältere Kopie
zurückzuschreiben.

## Organigramm-Hinweise

**17.08.2026 — Rollen-Split:** Die bisherige „Head of IT"-Rolle ist
aufgeteilt in **Head of Product Engineering** (Pipeline/Pricing/Produkt) und
**Platform & Integrations Engineer** (Zahlungen/Accounts/Security/Infra,
u. a. Row-Level-Security). Alle „Head of IT"-Verweise unten sind entsprechend
zu lesen — Details: CoS-009 in `docs/chief-of-staff-todos.md`.

**17.08.2026 — Neue Rolle Head of Marketing:** Sandy baut zusätzlich ein
Marketing-Team auf, erste Position ist **Head of Marketing** — verantwortet
CI/Marke und darf die aktuelle CI grundlegend neu vorschlagen (Umsetzung
erst nach Sandys Zustimmung). Arbeitet eng mit dir (Product Designer)
zusammen, vor allem dort, wo CI und Produkt-Design-System sich berühren —
gemeinsame Datei: `docs/marketing-design-austausch.md`. Details:
`docs/team-organigramm.md`, Abschnitt „Head of Marketing".

## Stand auf einen Blick (zuletzt aktualisiert: 2026-08-18, Wand-Chip DC-024 gebaut)

| ID | Thema | Status | Zuständig |
|---|---|---|---|
| DC-001 | Drei widersprüchliche Preismodelle + „18 Gewerke"-Versprechen | ✅ entschieden (22€/17€ Jahresabo, 3 frei, „Maler & Bodenleger") — Umsetzung offen | Head of Product Engineering |
| DC-002 | „Angebote" fehlt in Desktop-Sidebar | ❌ offen — live bestätigt | — |
| DC-003 | Statusfarben für Angebote — 3 inkonsistente Quellen, 1 verworfene Prop | ❌ offen | — |
| DC-004 | `pb-safe` / `pt-safe-top` nicht definiert (Safe-Area auf iPhone) | 🟡 behoben, noch nicht auf echtem iPhone nachgeprüft | Product Designer |
| DC-005 | Kein gemeinsamer Button-Baustein | 🟡 `active:scale-98`-Bug behoben, `Button.tsx` erstellt — Migration bestehender Stellen offen | Product Designer |
| DC-006 | `typography.ts` + Farb-Tokens (`@theme inline`) werden nirgends genutzt | ❌ offen — Aufräumen läuft, erste 5 Komponenten migriert (siehe Update 2026-08-18) | Product Designer |
| DC-007 | Mobile-Seitentitel: „Angebote"/„Kunden" weiß, „Einstellungen" gelb | 🟡 behoben, noch nicht live nachgeprüft | Product Designer |
| DC-008 | Kleine Sprach-/Textpolitur (Singular/Plural, Umlaut in KI-Wörterbuch) | ❌ offen | — |
| DC-009 | Leere Aufnahme (0 Positionen) wird als grüner Erfolg angezeigt | ❌ offen — live reproduziert | — |
| DC-010 | Keine Guardrail: leeres Angebot (0 €, kein Kunde) lässt sich „fertigstellen" und versandfertig machen | ❌ offen — Widerspruchs-Banner unabhängig von Prüfmeister/Sandy bestätigt (PD-006), Priorität erhöht | — |
| DC-011 | **Kritisch:** Fertiggestelltes Angebot verschwindet komplett aus der Angebote-Liste | ✅ behoben + live bestätigt (fehlende DB-Spalten `gewerk`/`title` ließen JEDE Abfrage scheitern, alle 56 Angebote betroffen) | Head of Product Engineering |
| DC-012 | Text-Notiz-Eingabe komplett gebaut, aber nirgends verlinkt (keine Alternative zur Sprachaufnahme) | ❌ offen | — |
| DC-013 | AppLayout-Footer stört den fokussierten Aufmaß-Aufnahme-Screen | ❌ offen — live bestätigt | — |
| DC-014 | **Kritisch:** Rohe Datenbank-Fehlermeldung auf Englisch beim Logo-Upload im Onboarding | 🟡 Ursache = CoS-P-005, Migration offen — Fehlermeldungs-Politur separat offen | Platform & Integrations Engineer (Ursache) / offen (Text) |
| DC-015 | Onboarding-Schritte: viel ungenutzter Leerraum zwischen Formular und Button-Leiste | ❌ offen — live bestätigt | — |
| DC-016 | Onboarding: „Weiter"-Button 6× unterschiedlich beschriftet, Klammer-Zahl unklar | ❌ offen — live bestätigt | — |
| DC-017 | Drei verschiedene Icon-Sprachen im Produkt (Lucide / native Emoji / Sketch) | ❌ offen — live bestätigt | — |
| DC-018 | Emoji-Auswahl je Onboarding-Schritt wirkt zufällig (u. a. britisches Pfund-Symbol) | ❌ offen — live bestätigt | — |
| DC-019 | Zwei sehr ähnlich benannte Buchhaltungs-Optionen ohne Erklärung des Unterschieds | ❌ offen — live bestätigt | — |
| DC-020 | Push-Erlaubnis-Screen: Ablehnen-Möglichkeit nicht erkennbar | 🔵 Prüfen, ob nur Screenshot-Ausschnitt | — |
| DC-021 | Bestätigungskarte vor Entwurf-Erstellung zeigt nicht zuverlässig, was am Ende berechnet wird (PD-001) | ❌ offen — mehrfach reproduziert (Prüfmeister) | — |
| DC-022 | „X Positionen erkannt"-Zahl stimmt wiederholt nicht mit der tatsächlichen Anzahl überein (PD-004) | ❌ offen — zweifach reproduziert (Prüfmeister), verwandt mit DC-009 | — |
| DC-023 | Fassade: Aufnahmekarte zeigt Fenstermaße statt Fassadenmaße (PD-007) | 🟡 Extraktions-Fix von Head of Product Engineering lokal verifiziert (zeigt jetzt lieber nichts als Falsches) — noch nicht auf sofortangebot.app deployt | Head of Product Engineering |
| DC-024 | Raummaße-Chip zeigt lauter rote „Fehler" bei Nicht-Raum-Objekten (z. B. Fassade) (PD-003) | 🟡 Wand-Chip-Komponente gebaut (`AngebotDetail.tsx`), scoped typecheck + ESLint sauber — noch nicht live nachgeprüft | Product Designer (umgesetzt) |
| DC-025 | Rückfragen-UI: von Sandy selbst als „hässlich" bewertet, komplettes Neudenken gewünscht (PD-002) | 🟡 UI direkt auf Sandys Anweisung umgesetzt (`RueckfragenScreen.tsx`, tsc/eslint sauber) — noch nicht live geprüft; CoS-011-Aufwandsschätzung von Head of Product Engineering dadurch überholt | Product Designer (umgesetzt) |
| DC-026 | Rückfragen werden gestellt, obwohl die Antwort schon im Gesagten steht (PD-005) | 🔵 UI-Seite mit DC-025 vorbereitet, „Du hast gesagt"-Vorschlag wartet weiter auf Erkennungs-Flag von Head of Product Engineering | Head of Product Engineering |
| DC-027 | Automatisch ergänzte Positionen sollten als „Vorschlag" gekennzeichnet sein (PD-008) | ❌ offen — dreifach reproduziert (Prüfmeister) | — |

„Zuständig" trägt der Chief of Staff ein, sobald zugewiesen.

---

## DC-001 — Drei widersprüchliche Preismodelle + „18 Gewerke"-Versprechen

**Datum:** 2026-08-16 · entschieden 2026-08-16
**Status:** ✅ entschieden — Umsetzung bei Head of Product Engineering offen

**Befund:** Der Pro-Plan hat drei unterschiedliche Preise live im Code:
- Landingpage (`src/components/landing/PreiseSection.tsx`): 29 €/Monat, Free = „5 Angebote kostenlos"
- Upgrade-Dialog im Produkt (`src/components/PlanWahlModal.tsx`): 17 €/Monat bei Jahresabo (22 €/Monat sonst), Free = „3 Angebote / Monat"
- Alte, unverlinkte Vorschau-Seite (`src/app/vorschau/page.tsx`, live erreichbar unter `/vorschau`): 9 €/Monat „Basic" + 29 €/Monat Pro

Dazu wirbt `PlanWahlModal.tsx` mit „Alle 18 Gewerke". `src/lib/gewerke.ts` listet 17 Gewerke, davon haben nur 6 (Maler, Boden, Fliesen, Elektro, Sanitär, Trockenbau) eine echte Mengen-Berechnung. Die eigene FAQ auf der Landingpage sagt explizit, dass aktuell bewusst nur Maler und Boden auf dem nötigen Niveau sind.

**Entscheidung (Sandy, 2026-08-16):** 22 €/Monat Standard, 17 €/Monat bei
Jahresabo, 3 Angebote/Monat kostenlos im Free-Tier. Statt „Alle 18 Gewerke"
ehrlich mit „Maler & Bodenleger" werben — aktuell die einzigen zwei Gewerke
auf dem nötigen Qualitätsniveau. Vollständiger Verlauf:
`docs/entscheidungen-fuer-sandy.md`.

**Empfehlung für die Umsetzung:** Einen einzigen Datenpunkt (z. B. `lib/pricing.ts`) anlegen, von dem Landingpage, PlanWahlModal und ggf. `/vorschau` lesen — nicht drei Stellen von Hand synchron halten. Noch nicht umgesetzt (Stand 17.08.).

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
**Status:** 🟡 behoben, noch nicht auf echtem iPhone nachgeprüft

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

**Fix-Update (Product Designer, 2026-08-18):** Genau diese zwei Utilities
in `src/app/globals.css` ergänzt (Tailwind-v4-`@utility`-Syntax). `pb-safe`
wird bereits in `BottomNav.tsx` genutzt, `pt-safe-top` in
`dashboard/page.tsx` und `entwurf/page.tsx` — ab jetzt sollten beide
tatsächlich Wirkung zeigen statt No-Ops zu sein. **Noch offen:** Ich habe
kein echtes iPhone mit Home-Indicator zum Testen — bitte jemand mit Gerät
kurz gegenprüfen, dass der Abstand unten/oben jetzt sichtbar korrekt ist.

---

## DC-005 — Kein gemeinsamer Button, `active:scale-98` ungültig

**Datum:** 2026-08-16
**Status:** 🟡 Bug behoben, `Button.tsx` erstellt — Migration bestehender
Stellen offen

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

**Fix-Update (Product Designer, 2026-08-18):** Beides erledigt.
`active:scale-98` in `kunden/page.tsx` und `kunden/[id]/page.tsx` zu
`active:scale-[0.98]` korrigiert — der Press-Effekt tut an beiden Stellen
jetzt wieder etwas. Neu: `src/components/Button.tsx`, forwardRef,
Varianten `primary`/`secondary`/`destructive`, Größen `default`/`small`,
eingebauter `loading`-State (Spinner statt Inhalt, automatisch
deaktiviert) — nach demselben Muster wie `Input.tsx` (ein Basis-Stil pro
Variante, per `className` erweiterbar). Nutzt von Anfang an die
Farb-Tokens aus DC-006 (`bg-yellow`/`text-anthracite`) statt neuer
Hex-Literale. **Noch offen:** Die 30+ bestehenden Button-Stellen im Code
migrieren auf `Button.tsx` — bewusst nicht in diesem Rutsch gemacht,
passiert schrittweise bei Gelegenheit, wie in der Empfehlung oben
vorgesehen.

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

**Update 2026-08-18:** Hängt inzwischen an zwei Stellen: Head of Marketing
hat in `docs/marketing-ci.md` einen CI-Richtungsvorschlag vorgelegt
(Farbnuance `#D9A400`, evtl. neue Schrift), technische Aufwandsfrage dazu
in `docs/marketing-design-austausch.md` (EX-M-002/EX-M-003) geklärt. Meine
Antwort dort: Ich fange das Token-Aufräumen JETZT an, unabhängig vom
Ausgang des CI-Vorschlags — zentralisiere auf die aktuellen Werte in
`globals.css`, damit ein späterer Farb-/Schrift-Wechsel nur noch eine
Token-Änderung ist, keine zweite Suchen-Ersetzen-Aktion.

**Fix-Update (Product Designer, 2026-08-18):** Erste Migrations-Runde auf
die bestehenden `@theme inline`-Tokens (`bg-yellow`, `text-anthracite`,
`bg-bg`) statt Hex-Literalen abgeschlossen — 5 bereits als vorbildlich
geprüfte Kernkomponenten: `Input.tsx`, `Toast.tsx`, `BottomNav.tsx`,
`SideNav.tsx`, plus das neue `Button.tsx` (DC-005) gleich von Anfang an mit
Tokens statt Hex geschrieben. Bewusst noch NICHT angefasst: Farbnuancen
ohne Token-Entsprechung (z. B. `hover:bg-[#e6b800]` in `SideNav.tsx`,
Inline-`boxShadow`-Werte in `BottomNav.tsx`) — dafür bräuchte es erst neue
Tokens (z. B. „yellow-dark" fürs Hover), das ist eine Design-Entscheidung
für sich, nicht Teil des reinen Aufräumens. **Noch offen:** Der große Rest
der >1.900 Fundstellen über ~30-40 Dateien (siehe Aufwandsschätzung in
`docs/marketing-design-austausch.md`, EX-M-002) — geht schrittweise weiter,
nicht in einem Rutsch.

---

## DC-007 — Mobile-Seitentitel: „Angebote"/„Kunden" weiß, „Einstellungen" gelb

**Datum:** 2026-08-17 (live im Browser auf 390×844 geprüft, Screenshot vorhanden)
**Status:** 🟡 behoben, noch nicht live nachgeprüft

**Befund:** Auf dem Handy-Viewport haben alle Listen-Header denselben
dunklen Hintergrund. „Angebote" und „Kunden" zeigen den Seitentitel in Weiß,
„Einstellungen" an derselben Stelle in Gelb (`#F5C400`). Im Code bereits
identifiziert (`text-[#F5C400] md:text-[#2C2C2C]` statt `text-white
md:text-[#2C2C2C]` in `einstellungen/page.tsx`), jetzt live auf dem Gerät
bestätigt — springt im direkten Vergleich sofort ins Auge.

**Empfehlung:** In `src/app/(app)/einstellungen/page.tsx` Zeile mit dem
Seitentitel auf `text-white md:text-[#2C2C2C]` angleichen.

**Fix-Update (Product Designer, 2026-08-18):** Genau diese Zeile
angeglichen — Seitentitel „Einstellungen" ist mobil jetzt weiß wie bei
„Angebote"/„Kunden". **Noch offen:** Live im Browser auf dem Handy-Viewport
gegenprüfen (war beim ursprünglichen Befund per Screenshot bestätigt).

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

**Update 2026-08-18 (Prüfmeister-Notizen, PD-006):** Unabhängig von meinem
eigenen Test (0 Positionen) hat Sandy selbst denselben Widerspruch bei
einem Fassaden-Test mit 2 Positionen gesehen: rotes „❗ Keine Positionen
erkannt" UND grünes „✓ 2 Positionen erkannt — bereit für den Entwurf"
gleichzeitig auf demselben Screen, musste es zweimal versuchen. Prüfmeister
hat es seitdem in 2 von 3 weiteren Fassaden-Durchläufen erneut gesehen —
tritt also intermittierend auf, nicht nur bei leeren Aufnahmen. Das
bestätigt den Befund aus DC-009/DC-010 nochmal unabhängig und macht ihn
dringlicher: ein Fehler, der nur manchmal auftritt, ist für den Nutzer
verwirrender als einer, der immer da ist. Design-Regel, unabhängig von der
technischen Ursache: Fehler-Banner und Erfolgs-Banner dürfen sich nie
gleichzeitig anzeigen — im Zweifel gewinnt der zuletzt bestätigte,
verlässlichere Zustand. Volltext siehe
`docs/pruefmeister-notizen-fuer-designer.md`, PD-006. Sandy hat
ausdrücklich gesagt, das soll sowohl an mich als auch an Head of Product
Engineering (technische Ursache) gehen.

---

## DC-011 — Kritisch: Fertiggestelltes Angebot verschwindet aus der Angebote-Liste

**Datum:** 2026-08-17 (live reproduziert, dreifach gegengeprüft)
**Status:** ✅ behoben + live bestätigt (2026-08-18) — Ursache gefunden, `typecheck`/706 Tests grün, Sandy hat live gesehen, dass Angebote unter „Alle" wieder auftauchen

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
die bei fehlendem Kunden oder `total_gross = 0` greift. Bitte Head of
Product Engineering gezielt auf diese zwei Stellen ansetzen.

**Empfehlung:** Dringend vor DC-001–DC-010 einordnen, wenn Kapazität knapp
ist — das hier kann echte, bezahlte Angebote betreffen, nicht nur
Design-Politur.

**Chief-of-Staff-Zuweisung (2026-08-17):** An Head of Product Engineering
zugewiesen, priorisiert vor DC-002–DC-010 — potenziell reale, bezahlte
Angebote betroffen.

**Ursache gefunden + Fix (Head of Product Engineering, 2026-08-18):** Der
Verdacht (Inner-Join/RLS) war nicht die Ursache — direkt gegen die
Produktions-Datenbank geprüft: `quotes.gewerk` und `quotes.title` **gibt es
schlicht nicht als Spalten** (nie eine Migration dafür, nie ein Schreibpfad
dafür). `getQuotesOverview()` in `src/data/quotes.ts` hat sie trotzdem in
jeder Abfrage mit angefragt — Postgres/PostgREST lehnt eine Abfrage mit
einer unbekannten Spalte KOMPLETT ab, nicht nur die eine Spalte. Der Fehler
wurde nur ins Server-Log geschrieben (`console.error`), nie angezeigt — für
den Nutzer sah es aus wie ein leerer Zustand ("Noch kein Angebot."), war
aber ein stiller Absturz. Wichtig: Das betraf NICHT nur das eine
Test-Angebot, sondern **jede Firma, jedes Angebot, jeden Filter** auf
`/angebote` — mit Datenbank-Check bestätigt: alle 56 aktuell in Produktion
gespeicherten Angebote waren auf dieser Seite unsichtbar, seit die Zeile so
im Code steht.

Fix: `title` ersatzlos aus der Abfrage entfernt (wurde nirgends benutzt).
`gewerk` (fürs Positionen-Badge auf der Liste) steckt schon im
`extraktion_final`-JSON-Feld, das es wirklich gibt — wird jetzt von dort
gelesen statt aus einer eigenen Spalte. Gleiche tote Spalten-Referenz auch
in `src/app/api/quotes/create/route.ts` gefunden und entfernt (aktuell ruft
sie niemand mit `gewerk` auf, wäre aber beim nächsten Versuch genauso
abgestürzt). Direkt gegen die Produktions-Datenbank verifiziert (Supabase
MCP), dass die neue Spaltenliste existiert und die JSON-Struktur passt.
Lokaler `eslint`-Lauf in der Cowork-Sitzung ist zweimal am Zeitlimit
gescheitert (Netzwerk-Sandbox, kein Code-Problem) — bitte wie bei CoS-010
einmal `npm run typecheck && npm test` laufen lassen, dann live auf
`/angebote` unter „Alle" prüfen, dass bestehende Angebote wieder
auftauchen.

**Live-Bestätigung (Sandy, 2026-08-18):** `typecheck` + 706/706 Tests grün.
Direkt nach Server-Neustart zeigte Sandys normales Browserfenster die
Liste trotzdem weiter leer — Ursache war NICHT der Code, sondern der
PWA-Service-Worker (Seiten-Zwischenspeicher fürs Offline-Arbeiten), der
eine alte Version festgehalten hat (erkennbar daran, dass beim Neuladen
gar keine Anfrage im Server-Terminal ankam). Ein privates/Inkognito-
Fenster umgeht diesen Cache und zeigte sofort die reparierte Liste mit
beiden bestehenden Entwürfen. Für Sandys normales Fenster: F12 →
„Application" → „Storage" → „Clear site data". Damit ist DC-011
abgeschlossen.

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
**Status:** 🟡 Ursache gefunden & behoben, Migration noch nicht angewendet — Fehlermeldungs-Politur separat offen

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

**Chief-of-Staff-Hinweis (2026-08-17):** Gleicher Bug wie CoS-P-005 in
`docs/chief-of-staff-platform-todos.md` — der Platform & Integrations
Engineer hat die Ursache (fehlende RLS-Policy auf dem `company-logos`-
Storage-Bucket) unabhängig davon bereits gefunden und Code-/Migrations-Fix
geschrieben. Migration liegt auf `main` im Repo, ist aber noch nicht auf
einer Datenbank angewendet — Logo-Upload bleibt bis dahin kaputt, wie hier
beschrieben. Bitte an der Ursache nicht doppelt arbeiten — nur Punkt 2 der
Empfehlung unten (nie Rohfehler direkt anzeigen) bleibt ein eigenständiges,
noch offenes Thema für dich.

**Empfehlung:**
1. ~~Head of IT: Ursache der RLS-Regel beim Logo-Upload finden und
   beheben~~ — erledigt, siehe Chief-of-Staff-Hinweis oben (CoS-P-005).
2. Unabhängig davon: Jede Fehlermeldung im Produkt, die aus einer
   API-/Datenbank-Antwort stammt, VOR der Anzeige auf einen freundlichen,
   deutschen Text abbilden (z. B. „Hochladen hat nicht geklappt — bitte
   nochmal versuchen oder später in den Einstellungen nachholen."). Nie
   die Rohmeldung eines Systems direkt anzeigen — das gilt vermutlich nicht
   nur hier, sondern sollte als Grundsatz für alle Fehlerzustände im
   Produkt gelten. **Bleibt offen.**

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

## DC-021 — Bestätigungskarte zeigt nicht zuverlässig, was am Ende berechnet wird

**Datum:** 2026-08-18 (übernommen aus `docs/pruefmeister-notizen-fuer-designer.md`, PD-001)
**Status:** ❌ offen — mehrfach reproduziert

**Befund:** Die Bestätigungskarte vor „Entwurf erstellen" (Raum erkannt +
Maße + Leistungsliste) ist der Moment, in dem der Handwerker in wenigen
Sekunden prüfen soll, ob das Tool richtig verstanden hat — genau deshalb
darf sie nicht selbst fehlerhaft sein. Drei belegte Fälle aus dem Testen:
ein ausdrücklicher Ausschluss („Decke NICHT mitrechnen") wird auf der Karte
korrekt weggelassen, taucht im fertigen Angebot aber trotzdem als Position
auf; der Raumname selbst („Kinderzimmer") erschien einmal als eigener
Punkt in der Leistungsliste, als wäre der Raum eine Arbeit; die
Fenster-Anzahl auf der Karte stimmte einmal nicht mit der später
tatsächlich verrechneten Anzahl überein. Ein weiterer Fall (doppelter
„Decke streichen"-Eintrag bei einem Zwei-Raum-Auftrag) bestätigt: kein
Einzelfall, sondern ein wiederkehrendes Muster.

**Warum das schwerer wiegt als ein einzelner Anzeigefehler:** Diese Karte
soll dem Handwerker erlauben, NICHT jede Position im fertigen Angebot
nachzurechnen. Bestätigt sie „keine Decke" und er bekommt trotzdem eine
Deckenposition berechnet, erzeugt sie falsches statt echtes Vertrauen — und
ein Handwerker, der das einmal erwischt, prüft danach wieder jede Zeile von
Hand. Genau das soll die Karte verhindern.

Die technische Ursache (Karte und Berechnung scheinen zwei getrennte
Datenquellen zu sein, die auseinanderlaufen können) liegt bei Head of
Product Engineering, nicht bei mir. Die Design-Frage, die ich mir davon
mitnehme: Reicht eine reine „Leistungen erkannt"-Liste als Format für
diesen Vertrauens-Moment, oder sollten ausdrückliche Ausschlüsse aktiv
sichtbar bestätigt werden („Decke — ausdrücklich ausgeschlossen ✓") statt
nur durchs Fehlen in der Liste?

**Empfehlung:** Bestätigungskarte grundsätzlich überarbeiten statt nur
Einzelfälle zu flicken: (1) ausdrückliche Ausschlüsse als eigene, positiv
markierte Zeile zeigen statt nur wegzulassen; (2) Raumnamen visuell klar
von der Leistungsliste trennen, damit ein falsch einsortierter Raumname
sofort auffällt; (3) prüfen, ob die auf der Karte gezeigten Zahlen
technisch aus derselben Quelle wie die spätere Berechnung stammen können
(Rückfrage an Head of Product Engineering), damit Karte und Rechnung gar
nicht mehr auseinanderlaufen können.

---

## DC-022 — „X Positionen erkannt"-Zahl stimmt wiederholt nicht mit der tatsächlichen Anzahl überein

**Datum:** 2026-08-18 (übernommen aus PD-004)
**Status:** ❌ offen — zweifach reproduziert, verwandt mit DC-009

**Befund:** Die grüne Leiste „5 Positionen erkannt" kurz vor „Entwurf
erstellen" hat in zwei unabhängigen Tests tatsächlich nur 4 Positionen
geliefert — eine erkannte Leistung ist beide Male im fertigen Angebot
spurlos verschwunden. Anders als bei DC-021 geht es hier nicht um Inhalte,
sondern um eine einzelne, prominente Zahl, der der Handwerker in der
Sekunde vor dem Erstellen vertraut, weil sie so konkret dasteht — ist sie
falsch, ist das ein klarer, zählbarer Vertrauensbruch, kein
Interpretationsspielraum.

Verwandter Kleinfund aus demselben Test: Ein Positionsname „Gondierung"
tauchte einmal auf der Bestätigungskarte auf — ein offensichtlich
verstümmeltes „Grundierung". Fachlich nicht falsch, aber genau die Art
Detail, die einem Handwerker sofort auffällt und Vertrauen kostet.

**Bezug zu DC-009:** DC-009 dokumentiert den Fall „0 Positionen wird als
Erfolg angezeigt". Dieser Befund hier ist die härtere Variante: Auch eine
nicht-null Zahl kann falsch sein, weil sie offenbar aus einem separaten
Erkennungsschritt kommt statt aus der eigentlichen Berechnung. Denkanstoß,
eher eine Frage für Head of Product Engineering als für mich: Diese Zahl
technisch erst NACH dem Rechenschritt anzeigen statt aus einem früheren,
separaten Erkennungsschritt — dann können beide Zahlen gar nicht mehr
auseinanderlaufen.

**Empfehlung:** Root Cause an Head of Product Engineering (gleiche
Quellen-Divergenz wie DC-011 vermutet). Design-seitig: Sobald die
technische Ursache bekannt ist, ggf. die Zahl grundsätzlich aus der
finalen Berechnung ziehen statt aus der Vorschau, analog zu DC-009's
Empfehlung, bei Unsicherheit lieber vorsichtiger zu formulieren als zu
optimistisch.

---

## DC-023 — Fassade: Aufnahmekarte zeigt Fenstermaße statt Fassadenmaße

**Datum:** 2026-08-18 (übernommen aus PD-007)
**Status:** 🟡 Extraktions-Fix lokal verifiziert, noch nicht live deployt

**Befund:** Bei einer Fassade („zwölf Meter lang, Giebelhöhe sechs Meter,
drei Fenster eins zwanzig mal eins vierzig") zeigt die Aufnahmekarte unter
„Masse" die Zahlen 1,20 × 1,40 m — das sind die Fenstermaße, nicht die
Fassadenmaße (12 × 6 m). Die eigentliche Berechnung dahinter ist korrekt
(66,96 m² netto stimmt), nur die Anzeige auf der Karte zeigt die falschen
Zahlen. Vier identische Reproduktionen, Head of Product Engineering hatte
das schon beim ersten Fix gesehen und bewusst als offene Frage stehen
lassen.

**Warum das mehr als Kosmetik ist:** Die „Masse"-Zeile ist der erste Ort,
an dem ein Handwerker prüft, ob das Tool die Grundmaße richtig verstanden
hat — noch vor den Leistungen. Stehen dort falsche Zahlen, wirkt das Tool
auf den ersten Blick kaputt, selbst wenn die spätere Rechnung stimmt.
Gehört in dieselbe Familie wie DC-021: Die Karte ist der Vertrauens-Moment,
und genau da geht etwas schief.

Positiver Nebenfund aus demselben Test: Es gibt inzwischen ein „So
gerechnet"-Infofeld in der späteren Positionsansicht, das den Rechenweg
transparent zeigt (z. B. „12m × 6m − Fenster (5,04 m²) = 66,96 m²") — dort
stehen die richtigen Zahlen. Das wirkt als Vertrauens-Element gut; lohnt
sich zu prüfen, ob so etwas Ähnliches schon auf der allerersten
Aufnahmekarte sinnvoll wäre, nicht erst später.

**Empfehlung:** Head of Product Engineering: Bei Nicht-Raum-Objekten
(Fassade) die richtige Maß-Quelle (Objekt-Maße statt Sub-Element-Maße wie
Fenster) auf der Aufnahmekarte anzeigen. Design-seitig lohnt sich zu
prüfen, ob ein kompaktes „So gerechnet"-Element bereits auf der
Aufnahmekarte Sinn ergibt (siehe auch DC-024, gleicher Objekttyp).

**Fix-Update (Head of Product Engineering, 2026-08-18, via PM-008 Nachtest
5):** Zwei Durchgänge. Erster Fix (Fenster-/Tür-Kontext beim Erkennen von
„X mal Y" überspringen) griff bei Sandys echtem Transkript noch nicht, weil
das Fenstermaß in einer eigenen, knappen Kommaklausel stand und das alte
Kontextfenster zu eng war. Zweiter Fix: satzzeichenbasiert statt fester
Zeichenzahl (prüft jetzt die eigene Klausel plus die davor), Logik von
inline in der Entwurfsseite nach `lib/extraktion-masse.ts` verschoben und
mit 3 Tests gegen Sandys echten Wortlaut abgesichert. Ergebnis: das
Fenstermaß wird jetzt korrekt übersprungen — die echten Fassadenmaße stehen
aber gar nicht im „X mal Y"-Format im Transkript („12 Meter lang" +
„Giebelhöhe … 6 Meter" getrennt), darum zeigt die Karte für diesen Fall
jetzt ehrlich **gar keine** Maße statt falscher. Lokal (`localhost:3000`,
712/712 Tests grün) verifiziert; auf `sofortangebot.app` lief zum
Prüfzeitpunkt noch der alte Stand (separates Deployment, Platform &
Integrations Engineer). Live-Nachprüfung auf Produktion steht noch aus.

**Design-Einordnung (Product Designer, 2026-08-18):** „Lieber nichts als
Falsches" ist als Zwischenstand in Ordnung und deckt sich mit meinem
eigenen Prinzip — eine leere Zeile lügt nicht, eine falsche schon. Die
eigentliche Lösung (die echten Fassadenmaße korrekt anzeigen) hängt an der
strukturellen Datenmodell-Frage aus DC-024 — siehe dort, mein Konzept für
das „So gerechnet"-Element ist gleich als Teil des Wand-Chips mitgedacht,
nicht separat.

---

## DC-024 — Raummaße-Chip zeigt lauter rote „Fehler" bei Nicht-Raum-Objekten

**Datum:** 2026-08-18 (übernommen aus PD-003)
**Status:** ❌ offen — Design-Konzept steht, Sandys Go liegt vor, Umsetzung
Datenmodell aussteht

**Befund:** Bei einer Fassade (kein Innenraum — nur eine Wand ohne Boden,
Decke oder „echte" Tür) zeigt der Raummaße-Chip im fertigen Angebot bei
Länge, Breite, Höhe, Türen UND Fenster überall ein rotes „!" statt Werten —
sieht aus wie fünf gleichzeitige Fehler. Die Fläche darunter (66,96 m²) ist
aber korrekt berechnet. Vermutliche Ursache: Der Chip ist für „normale"
Räume gebaut (Länge × Breite, Höhe, Türen, Fenster) und hat kein eigenes
Format für Objekte, die kein Raum sind.

**Empfehlung:** Eigenes, reduziertes Chip-Format für Nicht-Raum-Objekte
(Fassaden, ggf. später weitere Sonderfälle) bauen, das nur die Felder
zeigt, die dort wirklich Sinn ergeben — statt der vollen Raum-Vorlage mit
roten Fehlern für Felder, die für diesen Objekttyp gar nicht existieren
(z. B. keine „Breite" oder „Türen" im Raumsinn bei einer Fassade).

**Root-Cause bestätigt (Head of Product Engineering, 2026-08-18, PM-008
Nachtest 5):** Die Mengen-Engine selbst behandelt eine Fassade bereits
richtig (eigenes `waende[]`-Feld, nur Wandlänge/-höhe, kein Boden/Decke).
Die Lücke liegt in der Bearbeiten-Ansicht (`AngebotDetail.tsx`,
`RaumDimensionenZeile`): sie füllt ihre Daten ausschließlich aus
`raeume[]` — bei einer reinen Fassaden-Aufnahme bleibt das leer, egal
welches Anzeige-Format ich baue. Konkreter Datenmodell-Vorschlag (noch
nicht umgesetzt, bewusst koordiniert statt blind implementiert, weil er den
Live-Berechnungspfad fertiger Angebote betrifft): `RaumDimension.modus` um
`'wand'` erweitern (nur Länge/Höhe/Türen/Fenster, keine Breite, keine
Bodenfläche), Bearbeiten-Ansicht zusätzlich aus `waende[]` befüllen,
Flächenberechnung für diesen Zweig direkt aus Länge × Höhe statt aus dem
Raumumfang ableiten.

**Fix-Update / Konzept (Product Designer, 2026-08-18):** Design-Seite für
Engineerings Vorschlag steht — „Wand-Chip" statt Raum-Chip. Vollständiges
Spec inkl. Feld-für-Feld-Mapping in `docs/dc-024-konzept-wandchip.md`,
Vorher/Nachher-Mockup in `docs/dc-024-wandchip-mockup.html` (an Sandy
verschickt). Kernpunkte: kein Modus-Umschalter (Raummaße/Flächen
eingeben/Raumform — eine Wand hat eine Form, nicht drei), zwei Maß-Felder
statt drei (Wandlänge × Wandhöhe, kein „Breite"-Feld — das gibt es bei
einer Wand konzeptionell nicht), Türen/Fenster unverändert, und eine „So
gerechnet"-Zeile direkt am Chip („12,00 m × 6,00 m − 3 Fenster (5,04 m²) =
66,96 m² netto") — dasselbe Vertrauens-Element, das laut Prüfmeister in der
Positionsansicht schon gut funktioniert, jetzt eine Stufe früher, genau an
der Stelle, wo heute die roten Fehler stehen. Ergebnis: maximal zwei
mögliche „!"-Zustände statt fünf, und nur noch für echte Lücken. Bewusst
kein Code in `AngebotDetail.tsx`/`raum-geometrie.ts` angefasst — `modus:
'wand'` existiert im Datenmodell noch nicht, und die Stelle betrifft
bereits verschickte, live nachberechnete Angebote. Sobald Head of Product
Engineering den `'wand'`-Zweig anlegt, ist das Spec direkt umsetzbar, dann
baue ich die Komponente. **Braucht jetzt:** Sandys Go für die
Datenmodell-Änderung aus PM-008 Nachtest 5, Punkt 4.

**Go (Sandy, 2026-08-18):** „go" — Freigabe für Engineerings
Datenmodell-Vorschlag oben (`modus: 'wand'`, Bearbeiten-Ansicht zusätzlich
aus `waende[]` befüllen, Flächenberechnung Länge × Höhe statt Raumumfang).
Auch in `docs/entscheidungen-fuer-sandy.md` und
`docs/pruefmeister-testfaelle.md` (PM-008, Nachtest 5, Punkt 4) vermerkt.
**Nächster Schritt:** Head of Product Engineering setzt den `'wand'`-Zweig
um; sobald das Feld existiert, baue ich den Wand-Chip aus
`dc-024-konzept-wandchip.md` direkt dagegen.

**Fix-Update (Product Designer, 2026-08-18):** Datenmodell ist da (Head of
Product Engineering, `modus: 'wand'` + `raum_details` wird jetzt auch aus
`waende[]` befüllt) — Wand-Chip nach `dc-024-konzept-wandchip.md` in
`RaumDimensionenZeile` (`AngebotDetail.tsx`) gebaut:

- Modus-Umschalter (Raummaße/Flächen eingeben/Raumform) durch einen
  Hinweis „Wand / Fassade" + Ausstiegs-Link „Kein Wand-Objekt? Als Raum
  bearbeiten" ersetzt (Escape-Hatch für Fehlerkennung, kein Umschalten in
  eine Wand hinein — das entscheidet die Aufnahme).
- Zwei Maß-Felder statt drei: Wandlänge × Wandhöhe, kein „Breite"-Feld.
- „So gerechnet"-Zeile direkt am Chip, aus dem bereits berechneten
  Netto-Wert abgeleitet (keine doppelten Öffnungs-Konstanten).
- Eigene Design-Entscheidung unterwegs entdeckt: `waende[]` kennt strukturell
  gar kein Türen-Feld (siehe `generiere-positionen/route.ts`) — fehlende
  Türen-Angabe hieß dort „nie gefragt", nicht „echte Lücke", hätte also
  wieder ein unnötiges rotes „!" erzeugt. Türen-Feld zeigt im Wand-Chip jetzt
  bei fehlendem Wert `0` statt „!" (Standardannahme: keine Tür), bleibt aber
  antippbar/korrigierbar. Fenster unverändert als echtes „!", weil das Feld
  in `waende[]` existiert und für die Fläche wichtig ist.

**Verifiziert:** Scoped `tsc --noEmit` (nur die geänderten Dateien +
next-env.d.ts als Root) sauber, `eslint` auf der Datei sauber. Kompletten
`npm test`/`npm run typecheck` konnte ich nicht laufen lassen — auf dem
gemounteten Projektordner fehlt ein natives Rolldown-Binding für Linux
(vitest-Startfehler, „Cannot find native binding … @rolldown/binding-linux-x64-gnu"),
offenbar ein Node-Modules-Zustand, der nicht zu dieser Umgebung passt, nicht
etwas, das mein Code auslöst — bitte einmal gegenlaufen lassen, bevor's live
getestet wird (gleiche Bitte wie von Head of Product Engineering oben).
Noch nicht live im Browser geprüft.

---

## DC-025 — Rückfragen-UI: komplettes Neudenken gewünscht

**Datum:** 2026-08-18 (übernommen aus PD-002, direkt von Sandy)
**Status:** 🟡 UI umgesetzt (siehe Fix-Update unten), noch nicht live im
Browser geprüft

**Befund:** Sandy findet die gesamte Rückfragen-UI/UX „sehr hässlich und
kacke" und möchte sie komplett neu gedacht, nicht nachgebessert haben.
Aktueller Flow, wie ihn Prüfmeister beim Testen laufend sieht: schwarzer
Vollbild-Screen, eine einzelne Frage („Wie viele Türen hat 'Küche'?"), acht
gleich große weiße Antwortkacheln (0–6 plus „Mehr …"), gelber
„Weiter"-Button, kleiner Link „Diese Angabe überspringen". Bei mehreren
Räumen läuft das Raum für Raum, Frage für Frage — bei sechs offenen Fragen
sechs Vollbild-Screens hintereinander für einen einzigen kleinen Auftrag.

Konkrete Beobachtungen aus dem Testen, die ich als Ausgangspunkt nehme statt
bei null anzufangen:
- Viel ungenutzte leere Fläche unter den Antwortkacheln auf jedem
  Vollbild-Screen.
- Harter optischer Bruch zwischen dem hellen Aufmaß-Screen davor und dem
  komplett schwarzen Rückfragen-Screen — fühlt sich wie ein anderes Produkt
  an.
- Keine Übersicht über mehrere offene Fragen auf einmal — nur „Raum 2 von
  2", nicht „noch 4 von 6 Fragen".
- „Diese Angabe überspringen" ist klein und unauffällig, obwohl Überspringen
  (z. B. bei Fenstern) später zu einer roten Fehleranzeige im fertigen
  Angebot führen kann (vgl. PM-003) — der Nutzer merkt beim Überspringen
  nicht, dass das später ein Problem wird.

**Einordnung:** Das ist ein eigenständiges, größeres Redesign-Projekt, kein
Einzelfix wie DC-002–DC-020. Bevor Head of Product Engineering technisch
etwas bauen kann, brauche ich als Product Designer eine Richtung
(Layout-Konzept, wie Fortschritt/Kontext gezeigt wird, wie Überspringen
kommuniziert wird). Sobald ich eine Richtung habe, informiere ich den Chief
of Staff, damit Head of Product Engineering rechtzeitig weiß, was technisch
gebraucht wird (siehe Rückmeldung des Chief of Staff in
`docs/pruefmeister-notizen-fuer-designer.md`).

**Empfehlung:** Als eigenes Vorhaben einplanen (nicht nebenbei), grobes
Konzept erarbeiten: z. B. mehrere Fragen pro Screen statt ein Vollbild pro
Frage, durchgängige Fortschrittsanzeige über alle offenen Fragen (nicht nur
pro Raum), Überspringen-Konsequenz sichtbar machen statt zu verstecken,
Farbwelt näher am Rest des Produkts statt hartem Schwarz-Bruch.

**Fix-Update / Konzept (Product Designer, 2026-08-18):** Konzept steht,
inklusive klickbarem HTML-Prototyp
(`dc-025-rueckfragen-prototyp.html`, an Sandy verschickt) und
ausführlicher Begründung in `docs/dc-025-konzept-rueckfragen.md`. Ich habe
mir dafür den echten Code angeschaut (`RueckfragenScreen.tsx`,
`rueckfragen-flow.ts`) — die einzelnen Eingabe-Bausteine (Maße, Höhe,
Anzahl-Kacheln) sind inhaltlich schon gut gebaut, das Problem liegt im
Vollbild-pro-Frage-Gerüst drumherum. Kernpunkte der neuen Richtung: ein
Screen pro Raum statt pro Frage (Daten sind intern schon nach `kontext`
gruppiert, das wird jetzt auch visuell genutzt), durchgängige
Fortschrittsanzeige „X von Y insgesamt offen" plus Raum-Pillen zum
Springen, weicherer Übergang (dunkler Header nur als Kopfzeile statt
Vollbild-Schwarz), „Du hast gesagt: …"-Vorschläge statt Doppelfragen
(löst zugleich DC-026), Überspringen zeigt vorher die Konsequenz statt sie
zu verstecken, und ein editierbares Recap vor der Berechnung (baut auf
demselben Vertrauens-Moment wie DC-021 auf). Technische Voraussetzung für
Head of Product Engineering: Details in
`docs/dc-025-konzept-rueckfragen.md`, Punkt „Was das technisch braucht" —
der einzige Teil mit echtem Erkennungs-Mehraufwand ist das Flag für
„Wert steht im Transkript, aber nicht strukturiert erkannt". **Noch
offen:** Chief of Staff briefen, damit Head of Product Engineering
rechtzeitig weiß, was gebraucht wird (wie in der Rückmeldung des Chief of
Staff in `docs/pruefmeister-notizen-fuer-designer.md` vereinbart), dann
gemeinsame Aufwandsschätzung für die Umsetzung.

**Fix-Update — Umsetzung (Product Designer, 2026-08-18):** Sandy hat direkt
angewiesen umzusetzen ("setz dc-025 um"), noch bevor Head of Product
Engineerings Aufwandsschätzung aus CoS-011 da war — das läuft der
üblichen Reihenfolge (erst Schätzung, dann Umsetzung) also bewusst voraus,
bitte CoS-011 entsprechend gegenlesen/schließen.

`src/components/aufnahme/RueckfragenScreen.tsx` komplett neu gebaut nach
dem Konzept aus `docs/dc-025-konzept-rueckfragen.md`: Raum-Karten statt
Vollbild-pro-Frage, durchgängige Fortschrittsanzeige („X von Y insgesamt
beantwortet") plus Raum-Pillen, dunkler Header nur noch als Kopfzeile,
Überspringen zeigt vorher die Konsequenz (pro Fragetyp ein kurzer Text),
und eine editierbare Zusammenfassung vor „Angebot berechnen" — wie in
DC-021 vorgeschlagen, nur schon hier eine Stufe früher. Die einzelnen
Eingabe-Bausteine (`MasseEinzelInput`, `MasseMehrereInput`, `HoeheInput`,
`AnzahlInput`) sind unverändert aus der Vorversion übernommen, nur neu als
`JaNeinInput` extrahiert für Konsistenz — die fachliche Eingabelogik war
schon gut, siehe Konzept-Dokument.

Bewusst NICHT enthalten: die „Du hast gesagt: …"-Vorschlagskarte aus dem
Konzept (DC-026) — dafür gibt es aktuell keine Datenquelle, das UI dafür
zu bauen wäre totes Gerüst ohne echten Inhalt. Kommt, sobald Head of
Product Engineering das Erkennungs-Flag liefert.

Außerdem auf Farb-Tokens statt Hex-Literalen umgestellt (DC-006,
`bg-yellow`/`text-anthracite`/`bg-bg`) und die neue `Button.tsx` (DC-005)
für die Haupt-Aktionen verwendet — beides passend zum laufenden Aufräumen,
kein Mehraufwand extra dafür nötig.

Die Props-Schnittstelle nach außen (`fragen`, `onFertig`, `onUeberspringen`,
`onZurueck`) ist unverändert geblieben — `entwurf/page.tsx`, wo die
Komponente eingebunden wird, musste dafür nicht angefasst werden.

**Geprüft:** `npx tsc --noEmit` gegen die echten Projekt-Typen (inkl.
`RueckfrageItem`/`RueckfrageTyp` aus `rueckfragen-generator.ts`) — sauber,
keine Fehler. `npx eslint` auf der Datei — sauber. `npx vitest run` auf
`rueckfragen-flow.test.ts` (unverändert, testet die Datenlogik, nicht
diese Komponente) ist bei mir am fehlenden nativen `@rolldown/binding-
linux-x64-gnu`-Modul gescheitert — ein vorbestehendes Umgebungsproblem im
Test-Toolchain, nicht durch diese Änderung verursacht (ich habe weder
`package.json` noch `node_modules` angefasst). **Noch offen, wichtig:**
Ich habe das NICHT live im Browser durchgeklickt — bitte vor dem
Live-Schalten einmal echt durchspielen (idealerweise mit einem
Mehrraum-Auftrag), das kann ich von hier aus nicht ersetzen. ~~Eine
`tsconfig.check.json`-Hilfsdatei aus dem tsc-Check ließ sich bei mir nicht
löschen (Rechte-Limit der Datei-Brücke) — liegt jetzt in
`_to_delete/tsconfig.check.json`, bitte einmal von Hand entfernen.~~ —
erledigt, Sandy hat sie am 2026-08-18 von Hand gelöscht.

---

## DC-026 — Rückfragen werden gestellt, obwohl die Antwort schon im Gesagten steht

**Datum:** 2026-08-18 (übernommen aus PD-005)
**Status:** ❌ offen — verwandt mit DC-025

**Befund:** Sandy hatte im Transkript eines Tests bereits klar die
Fensteranzahl und die Bodenfläche genannt. Das Tool fragt in der
Rückfragen-Runde trotzdem danach, als hätte es nie hingehört.

**Warum das mehr als ein Komfort-Ärgernis ist:** Die Rückfragen-UI (DC-025)
kostet den Handwerker ohnehin schon mehrere Vollbild-Screens. Sind einige
davon Fragen, die er gerade erst beantwortet hat, fühlt sich das nicht nach
„gründlich", sondern nach „hat nicht zugehört" an — das Gegenteil des
Vertrauens, das dieser Schritt aufbauen soll, und kostet echte Zeit bei
jedem Auftrag, nicht nur im Fehlerfall.

Die technische Ursache (vermutlich prüft der Rückfragen-Schritt nur, ob ein
Feld strukturiert gesetzt ist, nicht ob der Wert schon im freien Text
vorkam) liegt bei Head of Product Engineering. Design-Frage an mich: Sollte
die Rückfragen-Runde grundsätzlich nur echte Lücken füllen — und falls das
technisch nicht zuverlässig erkennbar ist, sollte die UI dem Nutzer
wenigstens zeigen, was sie schon verstanden hat, statt eine Frage zu
stellen, die er sich schon beantwortet glaubt?

**Empfehlung:** Gehört inhaltlich zum DC-025-Redesign — beim Neudenken der
Rückfragen-UI berücksichtigen: entweder zuverlässiger erkennen, was schon
gesagt wurde (Head of Product Engineering), oder zumindest anzeigen „das
hast du schon genannt: X" statt stillschweigend erneut zu fragen.

**Update (Product Designer, 2026-08-18):** Genau das ist jetzt Teil des
DC-025-Konzepts — „Du hast gesagt: …"-Vorschlagskarte mit Zitat-Quelle
statt stiller Doppelfrage, siehe `docs/dc-025-konzept-rueckfragen.md`.
Braucht auf der Erkennungsseite ein neues Flag von Head of Product
Engineering (Wert im Transkript vorhanden, aber nicht strukturiert
gesetzt) — Details dort.

---

## DC-027 — Automatisch ergänzte Positionen sollten als „Vorschlag" gekennzeichnet sein

**Datum:** 2026-08-18 (übernommen aus PD-008, Idee ursprünglich von Sandy)
**Status:** ❌ offen — dreifach reproduziert

**Befund:** Das Tool ergänzt inzwischen an vielen Stellen automatisch
sinnvolle Positionen, ohne dass der Nutzer sie ausdrücklich verlangt hat —
z. B. „Boden schützen", „Sockelleisten abkleben", Erschwerniszuschläge, und
eine Grundierung nach Spachtelarbeiten (fachlich korrekt ergänzt, kein
Fehler). Grundsätzlich gut und spart Tipparbeit — aber im fertigen Angebot
sieht eine ergänzte Position optisch exakt gleich aus wie eine, die der
Handwerker wörtlich gesagt hat. Der Handwerker kann beim schnellen Prüfen
nicht unterscheiden: „das hab ich gesagt" vs. „das hat das Tool für mich
mitgedacht, checken!"

Das wiegt schwerer, weil es auch Gegenbeispiele gibt, wo das Tool ergänzt
hat, obwohl es NICHT passte (z. B. eine Kleinreparatur-Position trotz
ausdrücklicher Verneinung, oder ein ganzer unverlangter
Bodenaustausch-Leistungsblock). Eine klare Kennzeichnung würde in allen
Fällen dasselbe leisten: den Blick des Handwerkers gezielt dahin lenken, wo
er wirklich nochmal prüfen sollte, statt dass er entweder jede Position
gleich intensiv checken muss oder gar nicht merkt, dass da etwas
Ungefragtes steht.

**Voraussetzung (Head of Product Engineering):** Es bräuchte pro Position
ein Flag, ob sie direkt aus dem Transkript kam oder vom Tool selbst
abgeleitet wurde — das gibt es aktuell offenbar noch nicht.

**Empfehlung:** Sobald das Flag technisch verfügbar ist: kleines Badge oder
andere Hintergrundfarbe für „vom Tool ergänzt, nicht wörtlich gesagt" in
der Positionsliste ergänzen. Design-Vorschlag: dezentes Badge (z. B.
„Vorschlag" in Kleinschrift, neutrale Farbe, kein Alarm-Rot) direkt an der
Position, nicht als separater Screen — der Handwerker soll es beim
normalen Durchscrollen sehen, nicht extra danach suchen müssen.

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
