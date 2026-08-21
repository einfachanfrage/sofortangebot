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

## Stand auf einen Blick (zuletzt aktualisiert: 2026-08-21, DC-030 — konkrete Gate-Anforderung nachgereicht, damit Nutzer nur einmal wartet)

| ID | Thema | Status | Zuständig |
|---|---|---|---|
| DC-001 | Drei widersprüchliche Preismodelle + „18 Gewerke"-Versprechen | 🟡 entschieden + umgesetzt (22€/17€ Jahresabo, 3 frei, „Maler & Bodenleger", zentrale `pricing.ts`), Live-Nachtest steht aus | Head of Product Engineering |
| DC-002 | „Angebote" fehlt in Desktop-Sidebar | ❌ offen — live bestätigt | — |
| DC-003 | Statusfarben für Angebote — 3 inkonsistente Quellen, 1 verworfene Prop | ❌ offen | — |
| DC-004 | `pb-safe` / `pt-safe-top` nicht definiert (Safe-Area auf iPhone) | 🟡 behoben, noch nicht auf echtem iPhone nachgeprüft | Product Designer |
| DC-005 | Kein gemeinsamer Button-Baustein | 🟡 `active:scale-98`-Bug behoben, `Button.tsx` erstellt — Migration bestehender Stellen offen | Product Designer |
| DC-006 | `typography.ts` + Farb-Tokens (`@theme inline`) werden nirgends genutzt | ❌ offen — Aufräumen läuft, erste 5 Komponenten migriert (siehe Update 2026-08-18) | Product Designer |
| DC-007 | Mobile-Seitentitel: „Angebote"/„Kunden" weiß, „Einstellungen" gelb | 🟡 behoben, noch nicht live nachgeprüft | Product Designer |
| DC-008 | Kleine Sprach-/Textpolitur (Singular/Plural, Umlaut in KI-Wörterbuch) | ❌ offen | — |
| DC-009 | Leere Aufnahme (0 Positionen) wird als grüner Erfolg angezeigt | 🟡 mit DC-028 mitgefixt (2026-08-19): `kannFertigstellen` verlangt jetzt `erkannteAnzahl > 0`, 0 Positionen zeigt neutralen Hinweis statt grünem Erfolg — noch nicht live nachgeprüft | Product Designer (umgesetzt) |
| DC-010 | Keine Guardrail: leeres Angebot (0 €, kein Kunde) lässt sich „fertigstellen" und versandfertig machen; Widerspruchs-Banner (rot „Keine Positionen erkannt" + grün „X erkannt") | 🟡 Widerspruchs-Banner root-caused + gefixt (Head of Product Engineering, 2026-08-20, siehe „Systemischer Fund" Punkt 3 in `pruefmeister-testfaelle.md`) — zwei unabhängige GPT-Aufrufe (Chip-Vorschau vs. Server-Berechnung) konnten divergieren, `bannerZustand` zeigt jetzt nie mehr gleichzeitig mit `fehler`; noch nicht live nachgeprüft. Fehlende Guardrail (leeres Angebot lässt sich trotzdem fertigstellen) bleibt separat offen | Head of Product Engineering (Banner-Widerspruch) / offen (Guardrail) |
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
| DC-021 | Bestätigungskarte vor Entwurf-Erstellung zeigt nicht zuverlässig, was am Ende berechnet wird (PD-001) | 🟡 Architektur-Fix (CoS-002) weitgehend fertig: Karten-Abgleich nach Berechnung + Karte liest jetzt dieselbe geprüfte Extraktion wie die finale Berechnung (siehe DC-030). Nur der Geld-Pfad selbst (Schritt 3) läuft noch über den alten, separaten GPT-Aufruf — bis dahin bleibt ein Rest-Risiko, dass die bestätigte Karte trotzdem leicht abweicht | Head of Product Engineering |
| DC-022 | „X Positionen erkannt"-Zahl stimmt wiederholt nicht mit der tatsächlichen Anzahl überein (PD-004) | 🟡 Root Cause bestätigt, wird mit DC-021/CoS-002 mitgelöst | Head of Product Engineering |
| DC-023 | Fassade: Aufnahmekarte zeigt Fenstermaße statt Fassadenmaße (PD-007) | 🟡 Extraktions-Fix von Head of Product Engineering lokal verifiziert (zeigt jetzt lieber nichts als Falsches) — noch nicht auf sofortangebot.app deployt | Head of Product Engineering |
| DC-024 | Raummaße-Chip zeigt lauter rote „Fehler" bei Nicht-Raum-Objekten (z. B. Fassade) (PD-003) | 🟡 Wand-Chip-Komponente gebaut (`AngebotDetail.tsx`), scoped typecheck + ESLint sauber — noch nicht live nachgeprüft | Product Designer (umgesetzt) |
| DC-025 | Rückfragen-UI: von Sandy selbst als „hässlich" bewertet, komplettes Neudenken gewünscht (PD-002) | 🟡 UI direkt auf Sandys Anweisung umgesetzt (`RueckfragenScreen.tsx`, tsc/eslint sauber) — noch nicht live geprüft; CoS-011-Aufwandsschätzung von Head of Product Engineering dadurch überholt | Product Designer (umgesetzt) |
| DC-026 | Rückfragen werden gestellt, obwohl die Antwort schon im Gesagten steht (PD-005) | 🔵 UI-Seite mit DC-025 vorbereitet, „Du hast gesagt"-Vorschlag wartet weiter auf Erkennungs-Flag von Head of Product Engineering | Head of Product Engineering |
| DC-027 | Automatisch ergänzte Positionen sollten als „Vorschlag" gekennzeichnet sein (PD-008) | ❌ offen — dreifach reproduziert (Prüfmeister) | — |
| DC-028 | Aufmaß-Sammelansicht („Timeline"): falsche Maße bei mehreren Räumen, wirkt wie Duplikat, viel Weißraum, Positionen stimmen nicht mit Entwurf überein | 🟡 Umgesetzt (`entwurf/page.tsx`, raum-gruppiert), scoped tsc + ESLint sauber — noch nicht live nachgeprüft | Product Designer (umgesetzt) |
| DC-029 | Angebote brauchen eine „Baustelle"/Projekt-Zuordnung zusätzlich zum Kunden (mehrere Angebote pro Baustelle über Zeit, z. B. erst Entrümpelung, dann Ausbau) — von Sandy über Clemens (künftiger Testnutzer) eingebracht | 🟡 Umgesetzt (Datenmodell + UI) — Sandy hat nach Konzept/Prototyp „Top umsetzen" gesagt. Sechs Dateien geändert/neu, scoped `tsc` sauber, `eslint` in dieser Umgebung nicht lauffähig (siehe Detail), noch nicht live mit echten Kundendaten geprüft (Produktion hat aktuell 0 Kunden) | Product Designer (umgesetzt, wartet auf Live-Check) |
| DC-030 | Wie soll die Aufnahmekarte den kurzen Zwischenzustand „vorläufig" (schnelle Vorschau) vs. „bestätigt" (vollständig geprüft) zeigen, sobald CoS-002 Schritt 2/3 live sind? | ✅ Entschieden (Option 3) + umgesetzt (Head of Product Engineering, 2026-08-21) — Karte, DC-028-Raum-Karten und „Entwurf erstellen"-Gate alle wie entschieden gebaut. Regressionsgeprüft (236 Tests grün), noch KEIN Live-Nachtest | Product Designer (Entscheidung) / Head of Product Engineering (Umsetzung) |

„Zuständig" trägt der Chief of Staff ein, sobald zugewiesen.

---

## DC-001 — Drei widersprüchliche Preismodelle + „18 Gewerke"-Versprechen

**Datum:** 2026-08-16 · entschieden 2026-08-16
**Status:** 🟡 entschieden + umgesetzt (2026-08-18) — Live-Nachtest steht aus

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

**Fix-Update (Head of Product Engineering, 2026-08-18):** Umgesetzt, siehe
CoS-001 in `chief-of-staff-todos.md` für die volle Liste. Kurzfassung: alle
drei Stellen zeigen jetzt 17 €/Monat (Bei Jahresabo. Monatlich 22 €.) und 3
Angebote/Monat frei; `PlanWahlModal.tsx` wirbt jetzt mit „Maler & Bodenleger"
statt „Alle 18 Gewerke"; `/vorschau` leitet direkt auf die Landingpage um,
keine eigenen Preise mehr; die hier empfohlene `lib/pricing.ts` ist angelegt
und wird von Landingpage + PlanWahlModal gelesen. Live-Nachtest im Browser
steht noch aus.

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

**Fix-Update (Head of Product Engineering, 2026-08-20):** Genau das ist
jetzt in Arbeit — Sandy hat die Architektur-Frage aus Punkt (3) entschieden,
siehe CoS-002 in `chief-of-staff-todos.md` und
`docs/cos-002-architektur-vorschlag.md`. Zwei Teile schon fertig, getestet
und commitet (`74aef2a`): (1) Die Karte wird jetzt nach jeder Berechnung
automatisch mit den final berechneten Positionen abgeglichen — behebt die
meisten Fälle von „Karte sagt X, Rechnung sagt Y" sofort, ohne dass die
Karte selbst schon dieselbe Quelle wie die Berechnung liest. (2) Die
technische Vorbereitung, damit die Karte langfristig wortwörtlich dieselbe
Berechnungslogik liest wie die finale Kalkulation (statt einer zweiten,
unabhängigen GPT-Antwort), ist gebaut und gegen alle 236 bestehenden Tests
regressionsgeprüft — nur der sichtbare Teil auf der Karte selbst fehlt noch.
Dafür eine offene Design-Frage an dich, neu unter **DC-030**.

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

**Fix-Update (Head of Product Engineering, 2026-08-20):** Root Cause
bestätigt — genau die vermutete Quellen-Divergenz (Karte = schnelle
Chip-Vorschau via `gpt-4o-mini`, Berechnung = eigener, ~16× teurerer
Edge-Function-Aufruf via `gpt-4o`). Wird im selben Zug wie DC-021 behoben,
Details dort. Sobald der sichtbare Teil von Schritt 2 steht (Karte liest
dieselbe Quelle wie die Berechnung statt eines separaten
Erkennungsschritts), kann diese Zahl strukturell nicht mehr abweichen.

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

## DC-028 — Aufmaß-Sammelansicht („Timeline") komplett neu gedacht

**Datum:** 2026-08-18/19 (Sandys direkter Auftrag, zwei Screenshots
beigefügt — „ich finds katastrophal … denk das komplett neu")
**Status:** 🟡 Konzept + klickbarer Prototyp fertig, Sandys Go steht noch aus
— NICHT umgesetzt, bewusst noch kein Code in `entwurf/page.tsx` geändert

**Befund:** Screen nach der Aufnahme, vor „Entwurf erstellen"
(`entwurf/page.tsx`, `AufnahmeCard`). Bei zwei eingesprochenen Räumen
(Sandys Beispiel: Wohnzimmer + Küche) zeigt die Ansicht trotzdem nur EINE
Karte mit „MASSE 5,00 × 4,00 m" (Maße von nur einem der beiden Räume) und
darunter eine flache Liste „Wände streichen / Decke streichen / Wände
streichen" — sieht aus wie ein Duplikat, ist in Wirklichkeit Raum 1 +
Raum 2 ohne jede Kennzeichnung. Dazu viel ungenutzter Weißraum unten
(„nur oben was steht"). Und, wichtigster Punkt von Sandy: die gezeigten
Positionen/Anzahl stimmen nicht zuverlässig mit dem, was danach im Entwurf
und im fertigen Angebot steht.

Bündelt mehrere bereits bekannte Kollegen-Hinweise zu genau derselben
Stelle, nur aus verschiedenen Blickwinkeln: PD-001 (Bestätigungskarte kein
verlässliches Versprechen), DC-009 (leere Aufnahme = grüner Erfolg),
DC-010 (widersprüchliche Banner), DC-021/DC-022 (Karte stimmt nicht mit
Berechnung überein).

**Root-Cause (Code durchgegangen):**

1. `AufnahmeCard` ist strukturell für genau EINEN Raum gebaut
   (`erkenneEinzelraum`, `extrahiereRaumdaten()`) — bei mehreren Räumen wird
   entweder `null` oder das Maß des zuerst gefundenen Raums gezeigt, ohne
   das kenntlich zu machen. Die Leistungsliste (`erkannte.map(...)`) ist
   komplett flach, ohne Raum-Zuordnung in der Anzeige.
2. Bereits seit PD-001/DC-021/DC-022 bekannt: Karte und spätere Berechnung
   sind zwei unabhängige GPT-Aufrufe. `chips-extraktion.ts`
   (`extrahiereChips`) liefert nur die schnelle Vorschau für diese Karte —
   laut eigenem Code-Kommentar „NICHT die echte Berechnung". Die echte
   Berechnung läuft beim Erstellen komplett neu über `angebot-extrahieren`
   + `generiere-positionen`. Zwei unabhängige GPT-Antworten auf denselben
   Text können strukturell nie zu 100 % übereinstimmen.
3. Gute Nachricht beim Code-Lesen gefunden: Die Raum-Info steckt in den
   Titeln bereits drin, wird nur nicht genutzt. Der Prompt in
   `chips-extraktion.ts` weist GPT explizit an, Titel mit „ — Raumname"
   zu suffixen — exakt dieselbe Konvention, die `gruppiereNachRaum`
   (`angebot-gruppierung.ts`) später für die Raum-Gruppierung im fertigen
   Angebot nutzt. Die Sammelansicht nutzt dieses Suffix aktuell nur für
   eine Ja/Nein-Frage („genau ein Raum?"), nicht zum Gruppieren. Heißt: eine
   raum-gruppierte Anzeige ist HEUTE SCHON möglich, ohne neuen GPT-Aufruf,
   ohne Datenmodell-Änderung.

**Konzept (Details in `dc-028-konzept-aufmass-sammlung.md`):**
Grundprinzip-Wechsel von „gruppiert nach Aufnahme" zu „gruppiert nach
Raum" — alle bisher erkannten Positionen aus allen Aufnahmen zusammen
einsammeln, mit derselben `gruppiereNachRaum`-Logik wie im fertigen
Angebot nach Raum gruppieren (gleicher Code-Pfad, nicht nur gleiche
Optik). Kein erfundenes einzelnes „Maße"-Feld mehr — jede Raum-Karte zeigt
nur, was wirklich zu ihr gehört, lieber nichts als raten (gleiches Prinzip
wie der DC-023-Fix). Einzelne Aufnahmen bleiben sichtbar, aber als
schlanke antippbare Chip-Leiste statt großer leerer Kästen — behebt den
Weißraum-Vorwurf gleich mit, weil die Fläche jetzt von echten Raum-Karten
genutzt wird. „Bereit für den Entwurf"-Banner und die Positions-Anzahl
werden zur direkten Summe der Raum-Gruppen statt eines separat geführten
Zählers — nur noch eine Quelle, die auseinanderlaufen könnte, nicht zwei
(nimmt DC-010 einen Teil seiner Grundlage). DC-009 gleich mitgelöst: bei
0 gepoolten Positionen kein grüner Erfolgs-Stil mehr, sondern neutraler
Hinweis + „Nochmal aufnehmen" statt „Entwurf erstellen".

**Was das NICHT löst — ehrlich dazu:** Die Raum-Gruppierung macht die
Anzeige endlich richtig strukturiert und nutzt exakt dieselbe Logik wie
das fertige Angebot. Sie garantiert aber nicht, dass die Positions-ANZAHL
innerhalb eines Raums immer exakt mit der späteren Berechnung
übereinstimmt — dafür bräuchte es Root-Cause 2 (zwei unabhängige
GPT-Aufrufe) gelöst. Das ist keine Design-Frage mehr, sondern eine
Architektur-Frage: könnte die Vorschau irgendwann aus derselben Quelle wie
die finale Berechnung kommen, statt ein zweites Mal zu fragen? Gebe ich als
offene technische Frage an Head of Product Engineering weiter, entscheide
es nicht selbst.

**Nächster Schritt:** Konzept + klickbarer Vorher/Nachher-Prototyp
(`dc-028-sammlung-prototyp.html`) sind an Sandy raus. Sobald sie die
Richtung bestätigt, setze ich es in `entwurf/page.tsx` um — die
Grundbausteine (`gruppiereNachRaum`, Raum-Emoji, Leistungslisten-Zeile)
existieren bereits und müssen nur wiederverwendet, nicht neu erfunden
werden. Bewusst noch keine Implementierung, da Sandy ausdrücklich „komplett
neu denken" wollte, nicht „schnell reparieren".

**Update (2026-08-19):** Sandy hat dem Konzept zugestimmt und zwei Punkte
präzisiert — beide technisch geprüft, kein neuer Architektur-Bedarf:
(1) Das Mikrofon muss von diesem Screen aus immer erreichbar bleiben — ist
es bereits (feste Aufnahme-Taste unten), Redesign ändert daran nichts.
(2) Landet eine Nachtrags-Aufnahme zu einem bereits vorhandenen Raum
automatisch in dessen Karte? Ja — weil die Raum-Gruppierung bei jeder
neuen Aufnahme über den KOMPLETTEN gepoolten Bestand neu läuft (nicht pro
Aufnahme einzeln), fällt eine neue „ — Wohnzimmer"-Position automatisch in
die bestehende Wohnzimmer-Karte, kein Sonderfall nötig. Zusätzlich
präzisiert: auch nach „Entwurf erstellen" soll man beim Zurückkehren
(„Aufnahme"-Link im fertigen Angebot, `AngebotDetail.tsx`) alle
bisherigen Raum-Karten sehen und per Mikro weiter ergänzen können.
Vorschlag dafür: bereits berechnete `quote_items` UND frische, noch nicht
berechnete Vorschau-Positionen in derselben Raum-Karte zeigen, frische
Positionen mit „Wird berechnet"-Markierung, statt wie aktuell ein
separater, nicht raum-gruppierter Hinweis-Banner. Prototyp um dritten
Zustand „Nachtrag" erweitert, der genau das zeigt.

**Fix-Update (2026-08-19):** Sandy hat ihr Go gegeben, umgesetzt in
`entwurf/page.tsx`:
- Neuer Pool `baueSammelPool()`: bereits berechnete `quote_items` (echt,
  `pending: false`) + Vorschau-Positionen aus noch nicht „fertiggestellten"
  Aufnahmen (`pending: true`, aber nur markiert, wenn es überhaupt schon
  einen echten Bestand gibt — beim allerersten Aufnehmen wäre die Markierung
  nur Lärm ohne echten Kontrast).
- `gruppiereNachRaum()` (dieselbe Funktion wie in `AngebotDetail.tsx`) läuft
  über diesen Pool → neue Komponente `RaumKarte` zeigt eine Karte pro Raum
  (Emoji, Name, Positionen; frische Positionen mit „Wird berechnet"-Badge
  statt Preis). Beantwortet Sandys Nachtrags-Frage strukturell: eine neue
  Aufnahme zu „Wohnzimmer" landet automatisch in der bestehenden
  Wohnzimmer-Karte, weil die Gruppierung jedes Mal neu über den Gesamtbestand
  läuft — kein Sonderfall-Code nötig.
- Ohne erkennbare Räume (`gruppiereNachRaum` liefert `null`) Fallback auf die
  bisherige, ungruppierte `AufnahmeCard`-Liste — lieber nichts erfinden als
  eine Raum-Struktur vortäuschen, die nicht da ist.
- Einzelne Aufnahmen: neue kompakte `AufnahmeChip`-Leiste (Zeit, Status,
  erkannter Raum) ersetzt die vorherigen großen Kästen als primäre Ansicht —
  Antippen öffnet ein Detail-Sheet mit der vollständigen, unveränderten
  `AufnahmeCard` (Transkript, Audio, Löschen, Retry). Löst den
  Weißraum-Vorwurf, weil die Fläche jetzt von Raum-Karten genutzt wird.
- Mikro bleibt unverändert immer erreichbar (feste Taste unten) — daran hat
  das Redesign nichts geändert, wie in Sandys Rückfrage bestätigt.
- DC-009 gleich mitgefixt: `kannFertigstellen` verlangt jetzt zusätzlich
  `erkannteAnzahl > 0` — bei 0 erkannten Positionen kein grüner
  Erfolgs-Button mehr, sondern neutraler Hinweis + Mikro-Label „Nochmal
  aufnehmen".
- DC-010 entschärft: Kopfzeile, Banner und Button-Unterzeile lesen jetzt alle
  aus demselben `gesamtPositionen`/`erkannteAnzahl`, keine zwei getrennt
  geführten Zähler mehr.
- Button-Text wechselt zu „Entwurf aktualisieren" statt „Entwurf erstellen",
  sobald es schon einen berechneten Bestand gibt (Nachtrag-Fall).
- Verifiziert: scoped `tsc --noEmit` (nur `entwurf/page.tsx` + Abhängigkeiten)
  und scoped `eslint` auf derselben Datei — beide sauber, 0 Fehler. Volle
  `npm test`/`npm run typecheck` über das Gesamtprojekt konnte ich in dieser
  Umgebung weiterhin nicht laufen lassen (kaputtes `@rolldown`-Binding,
  bereits bei DC-024 dokumentiert, nicht mein Bug) — bitte vor Live-Test
  einmal gegenprüfen. Noch nicht live getestet.

---

## DC-029 — Angebote brauchen eine „Baustelle"/Projekt-Zuordnung

**Datum:** 2026-08-19 (von Sandy eingebracht, Quelle: Clemens — ihr Partner,
selbst Handwerker, wird nach Gate 1 bei 100 % erster Testnutzer)

**Status:** 🔵 Wording-Konzept steht (mein Teil) — Datenmodell und
Lexware/Lexoffice-Anbindung offen, bevor UI/Umsetzung sinnvoll möglich ist.
Bewusst noch KEIN Prototyp/Mockup — Sandy hat Menü/UI-Umsetzung selbst
explizit auf „nächster Schritt" gelegt, das hier ist der Denk-Vorlauf dafür.

**Der Bedarf (Clemens' Praxis):** Bei größeren Aufträgen (z. B. kompletter
Innenausbau) macht ein Handwerker nicht ein einziges großes Angebot,
sondern nach und nach mehrere — z. B. erst ein Angebot nur für die
Entrümpelung, später weitere für die einzelnen Ausbau-Gewerke. Aktuell hängt
in Sofortangebot ein Angebot nur an einem Kunden (`quotes.customer_id`) —
es gibt keine Ebene dazwischen, die mehrere zusammengehörige Angebote für
denselben Auftrag/dieselbe Baustelle bündelt. Ich hab den Datenbestand
geprüft: weder `Customer` noch `Quote` haben aktuell ein Feld für Projekt,
Baustelle oder eine von der Rechnungsadresse abweichende Lieferadresse
(`src/lib/types.ts`) — das ist eine echte Lücke, kein Missverständnis.

**Mein Teil — Wording-Vorschlag:** Ich empfehle **„Baustelle"** als
nutzersichtbaren Begriff, nicht „Projekt". Begründung: Sofortangebots
Zielgruppe (Maler, Bodenleger, Innenausbau-Handwerker wie Clemens) sagt im
Alltag „ich bin auf der Baustelle", nicht „ich arbeite am Projekt" —
„Projekt" klingt nach Software/Agentur-Sprache, nicht nach der Werkstatt-
bzw. Baustellen-Realität dieser Zielgruppe, und würde gegen das
„menschlich, kein Amtsdeutsch"-Prinzip des Produkts laufen. „Lieferadresse"
(Clemens' dritte Nennung) ist der korrekte Buchhaltungs-Begriff aus
Lexware-Sicht, aber als Nutzer-Wording zu technisch — die Adresse würde ich
als EIN Feld INNERHALB der Baustelle behandeln, nicht als eigenständiges
Konzept.

Struktur-Vorschlag (konzeptionell, keine fertige Schema-Vorgabe — das ist
Head of Product Engineerings Entscheidung): eine Baustelle gehört zu genau
einem Kunden (ein Kunde kann mehrere Baustellen haben, z. B. eine
Hausverwaltung mit mehreren Objekten), hat einen Namen/eine Bezeichnung
(„Wohnung Familie Müller, 2. OG" o. ä.) und optional eine Adresse. Ein
Angebot hängt dann an Kunde UND Baustelle. Wichtig für die Mehrheit der
Nutzer, die NUR einen einzigen Auftrag pro Kunde haben (kein Clemens-Fall):
das darf keine zusätzliche Pflicht-Hürde beim ersten Angebot werden — Vorschlag
dafür ist, beim Anlegen eines Kunden automatisch eine erste Baustelle mit der
Kunden-Adresse vorzubefüllen, sichtbar/benennbar erst, sobald wirklich eine
zweite dazukommt. Genau das „Alles, was es nicht braucht, ist weg"-Prinzip.

**Offen für Head of Product Engineering:** Datenmodell (neue Tabelle
`baustellen` o. ä., FK `baustelle_id` auf `quotes`, Migration bestehender
Angebote auf eine automatisch erzeugte Erst-Baustelle pro Kunde, damit
nichts verwaist).

**Offen für Platform & Integrations Engineer — Machbarkeits-Einschätzung
(2026-08-19, Platform & Integrations Engineer):**

Kurz: **Nein, kein natives Feld — Baustelle lässt sich bei Lexware/Lexoffice
nur als Text unterbringen, nicht als eigene, auswertbare Struktur.**

Erstmal zur Klarstellung, was im Code technisch zwei getrennte Integrationen
sind (`lexoffice_api_key` und `lexware_api_key`, zwei eigene Routen
`src/app/api/integrations/lexoffice/` und `.../lexware/`): beide sprechen
exakt dieselbe API (`api.lexoffice.io/v1` — "Lexware Office" ist die
umbenannte Cloud-Version von Lexoffice, gleicher Anbieter Haufe). Für die
Machbarkeitsfrage sind es also keine zwei Fragen, sondern eine.

Laut aktueller Lexware-API-Dokumentation (developers.lexware.io, heute
geprüft) hat die `Quotation`/`Invoice`-Ressource genau EIN `address`-Objekt
(entweder per `contactId` auf einen bestehenden Kontakt verweisend, oder
Name/Straße/PLZ/Ort inline) — das ist auch exakt das, was unser Code aktuell
schon befüllt. Es gibt **kein** separates Lieferadress-Feld an der
Quotation und **kein** Projekt- oder Kostenstellen-Konzept in der API,
weder bei Angeboten noch bei Rechnungen. Es gibt einen eigenen Ressourcen-Typ
"Delivery Notes" (Lieferscheine), aber das ist ein eigenständiges Dokument
für Warenversand, kein Zusatzfeld an unseren Angeboten — dafür bräuchte man
eine ganz eigene Anbindung, unverhältnismäßig für das, was wir wollen.

**Was stattdessen geht (Workaround, kein Umbau der Integration nötig):**
Angebote/Rechnungen haben freie Textfelder (`title`, `introduction`,
`remark`). Sobald das Datenmodell (Head of Product Engineering) die
Baustelle liefert, können wir den Baustellen-Namen einfach mit in den
Angebots-Titel oder die Einleitung schreiben, die an Lexware/Lexoffice
übertragen wird (z. B. „Angebot – Baustelle: Wohnung Familie Müller, 2.
OG"). Sichtbar für den Handwerker in seiner Buchhaltungssoftware, aber
**nicht** strukturiert filterbar/auswertbar dort — aus Lexware-Sicht bleibt
es ein Angebot ohne eigenes Projekt-Attribut.

**Aufwand, falls gewünscht:** klein. Betrifft zwei bestehende Dateien
(`src/app/api/integrations/lexoffice/route.ts`,
`.../lexware/route.ts`), dort jeweils eine Zeile ergänzen, die den
Baustellen-Namen (sobald er existiert) in `title`/`introduction`
einsetzt. Keine neue API-Anbindung, kein API-Versionswechsel nötig.

**Einschränkung meiner Einschätzung:** Ich habe das über die öffentliche
Lexware-Doku geprüft, nicht mit einem echten API-Call gegen einen aktiven
Account getestet (kein Test-Zugang aus dieser Session). Bevor das
tatsächlich umgesetzt wird, würde ich einmal kurz live gegenprüfen (z. B.
mit deinem eigenen Lexoffice/Lexware-Testkonto), dass sich an der API
nichts geändert hat — reine Doku-Recherche ist eine gute Grundlage für die
Ja/Nein-Frage, aber kein Ersatz für einen echten Testaufruf vor dem Bauen.

**Fazit für die Priorisierung:** Die Lexware-Seite ist kein Blocker für
DC-029 — sie schränkt nur ein, WIE gut die Baustelle in der Buchhaltung
sichtbar wird (Text statt Struktur), verhindert aber nichts. Das
Datenmodell bei Head of Product Engineering bleibt der eigentliche
Startpunkt.

**Bewusst nicht Teil dieses Vorschlags:** Menü-Platzierung, konkrete
Screens, wie eine Baustelle angelegt/gewechselt wird. Sandy hat das selbst
auf „nächster Schritt" gelegt — sobald Datenmodell + Lexware-Machbarkeit
stehen, liefere ich dafür Konzept + klickbaren Prototyp, genau wie bei
DC-025/DC-028.

**Antwort auf Sandys Frage „bist du da richtig":** Teilweise. Das Wording
und die grundsätzliche UX-Idee sind mein Bereich, deshalb hier dokumentiert.
Datenmodell und Lexware-Anbindung sind nicht meins — die liegen bei Head of
Product Engineering bzw. Platform & Integrations Engineer. Ich kann beide
nicht direkt anstoßen (getrennte Cowork-Projekte, siehe
`team-organigramm.md`) — diese Zeile hier in `design-check.md` ist der
gemeinsame Ort, an dem sie mitlesen; der Chief of Staff müsste die beiden
offenen Teile formal zuweisen.

**Datenmodell-Schätzung (Head of Product Engineering, 2026-08-19) — Teil 1
von CoS-012, wie in `chief-of-staff-todos.md` vergeben.** Grobe Schätzung
plus konkreter Schema-Vorschlag, noch keine Umsetzung — Ziel ist Abstimmung
mit dem Designer, bevor daran gebaut wird.

*Schema-Vorschlag (Entwurf, keine finale Vorgabe):*
```sql
CREATE TABLE baustellen (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id         UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id        UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  name               TEXT NOT NULL,
  adresse            TEXT,
  ist_erstbaustelle  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- höchstens eine Erstbaustelle pro Kunde
CREATE UNIQUE INDEX baustellen_erstbaustelle_unique
  ON baustellen (customer_id) WHERE ist_erstbaustelle = TRUE;
CREATE INDEX baustellen_customer_id_idx ON baustellen (customer_id);

ALTER TABLE baustellen ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Nur eigene Baustellen" ON baustellen FOR ALL USING (
  company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
);

ALTER TABLE quotes ADD COLUMN baustelle_id UUID REFERENCES baustellen(id);
```
Struktur und RLS-Policy sind bewusst 1:1 am Muster von `briefpapiere`
orientiert (dieselbe „genau ein Standard/Erst-Eintrag pro Bezugsobjekt"-Idee
via partiellem Unique-Index, dieselbe company-scoped RLS-Policy) — kein neues
Muster, sondern ein bereits bewährtes wiederverwendet.

*Backfill für bestehende Kunden/Angebote (eigener, idempotenter Schritt nach
der Schema-Migration):* pro Kunde mit mindestens einem Angebot eine
Erstbaustelle anlegen (Name/Adresse aus dem Kunden übernommen), danach alle
bestehenden `quotes` ohne `baustelle_id` auf die Erstbaustelle ihres Kunden
verknüpfen. Über `WHERE NOT EXISTS`/`WHERE baustelle_id IS NULL` gebaut,
also gefahrlos mehrfach ausführbar.

*Reihenfolge — Lehre aus DC-011 direkt angewendet:* DC-011 hat gezeigt, was
passiert, wenn Code eine Spalte erwartet, deren Migration noch nicht gelaufen
ist (`quotes/create/route.ts` hat dafür bis heute einen Fallback-Pfad für
`share_token`/`briefpapier_id`). Damit das hier nicht nochmal passiert, in
drei sauber getrennten Schritten, jeder für sich deploybar/testbar:
1. Migration: Tabelle + RLS + nullable `quotes.baustelle_id` — allein
   ungefährlich, nichts liest/schreibt das Feld noch.
2. Backfill-Migration: Erstbaustellen anlegen + bestehende Angebote
   verknüpfen.
3. Erst danach App-Code: Kundenanlage erzeugt automatisch die Erstbaustelle,
   Angebotserstellung setzt `baustelle_id` auf die Erstbaustelle des Kunden
   (bzw. später, sobald UI da ist, auf die vom Nutzer gewählte).

*Betroffene Stellen im App-Code (per Suche gefunden, überschaubar):*
`customers`-Insert kommt an genau zwei Stellen vor —
`src/app/(app)/kunden/neu/page.tsx` (normales Kunde-anlegen-Formular) und
`src/app/(app)/angebot/[id]/AngebotDetail.tsx` (Kunde-Import aus
Lexware-Kontakten direkt im Angebots-Editor). `quotes`-Insert kommt an
genau einer Stelle vor — `src/app/api/quotes/create/route.ts` (der zentrale
Erstellungs-Endpunkt, legt bei Bedarf auch gleich den Kunden mit an). Alle
drei bräuchten die neue Erstbaustellen-Logik, aber es sind nur diese drei —
kein verstreuter Umbau.

*Grobe Einordnung der Größe:* deutlich mehr als PM-008/`modus: 'wand'`
(das war reine Anwendungslogik ohne Schema-Änderung an einer Kern-Tabelle).
Hier kommen eine echte Migration + Backfill an `quotes` UND drei App-Stellen
zusammen — ich würde es bei „mittel", oberhalb von DC-024/DC-028-Größenordnung
ansiedeln, nicht bei „klein". Genau deshalb wie von Sandy verlangt mit
derselben Sorgfalt wie CoS-P-005/DC-024 behandeln, nicht nebenbei zwischen
zwei andere Sachen quetschen.

*Offene Fragen an den Designer, bevor ich anfange zu bauen:*
1. `quotes.customer_id` ist schon heute nullable (ein Entwurf kann ganz ohne
   Kunde starten) — `baustelle_id` müsste dieselbe Übergangsphase erlauben
   (leer, bis ein Kunde gewählt ist). Passt das zu deiner UX-Vorstellung,
   oder soll die UI die Kundenwahl und Baustellenwahl zusammen erzwingen?
2. Beim Kunden-Import aus Lexware direkt im Angebots-Editor (zweite
   Insert-Stelle oben) — soll das gerade offene Angebot sofort mit der neu
   angelegten Erstbaustelle verknüpft werden? Meine Annahme: ja, aber das ist
   dein Terrain.
3. Name-Vorschlag für die automatisch angelegte Erstbaustelle, wenn der
   Kunde noch keine Adresse hat (z. B. Schnellanlage ohne Adressfeld) — mein
   Vorschlag „Baustelle bei {Kundenname}" als Fallback, aber Wording ist bei
   dir.
4. Soll `baustelle_id` langfristig NOT NULL werden (Datenintegrität), sobald
   der Backfill bestätigt vollständig ist, oder dauerhaft nullable bleiben
   als Sicherheitsnetz? Ich tendiere angesichts der DC-011-Erfahrung
   (Migrations- und Deploy-Zeitpunkt laufen in diesem Projekt nicht immer
   synchron) zu „dauerhaft nullable", aber das ist eine bewusste
   Abwägungsfrage, keine reine Technik-Entscheidung.

Sobald diese vier Punkte geklärt sind, kann ich die Migration + Backfill +
App-Wiring umsetzen. Status in `chief-of-staff-todos.md` CoS-012 entsprechend
aktualisiert.

**Antwort an Head of Product Engineering (Product Designer, 2026-08-19):**
Danke für den sauberen Schema-Vorschlag und die Einordnung als „mittel" statt
„klein" — deckt sich mit meinem Eindruck. Hier alle vier Fragen:

**1. Nullable, genau wie `customer_id`, gleiche Übergangsphase — nicht
zusammen erzwingen.** Der ganze Aufnahme-Flow ist bewusst darauf gebaut, dass
der Handwerker auf der Baustelle erstmal einspricht, ohne vorher Formulare
auszufüllen (siehe DC-028) — `customer_id` ist genau deshalb schon nullable.
Eine Baustelle gehört zu einem Kunden; ohne Kunde gibt's noch nichts, wovon
sie überhaupt eine wäre. Also: Baustellenwahl blockiert nie den Start einer
Aufnahme, genau wie die Kundenwahl heute auch nicht. UX-Regel, die das für
alle drei Insert-Stellen einheitlich macht: **sobald `customer_id` an einem
Angebot gesetzt wird — egal auf welchem Weg —, wird automatisch die
Erstbaustelle dieses Kunden als `baustelle_id` mitgesetzt, ohne dass der
Nutzer etwas tun muss.** Erst wenn er bewusst eine zweite Baustelle für
denselben Kunden anlegt (Clemens-Fall), wird die Wahl überhaupt sichtbar.

**2. Ja, genau wie du angenommen hast.** Direkte Folge aus der Regel oben —
Lexware-Import ist einfach einer von mehreren Wegen, wie `customer_id`
gesetzt wird, kein Sonderfall. Bitte an derselben Stelle im Code lösen wie
die anderen beiden Insert-Stellen, nicht separat.

**3. Verfeinerung deines Vorschlags:** Wenn der Kunde schon eine Adresse hat,
sollte die Erstbaustelle direkt danach benannt werden (z. B. „Musterstraße
12, 12345 Musterstadt") statt nach dem Kundennamen — das ist tatsächlich der
Name, unter dem ein Handwerker eine Baustelle im Kopf hat (bei mehreren
Objekten unterscheidet man ja über den Ort, nicht über „welcher Kunde nochmal
war das"). Dein Vorschlag „Baustelle bei {Kundenname}" ist der richtige
Fallback für genau den Fall, den du beschrieben hast — Kunde ganz ohne
Adresse (Schnellanlage). Also: `adresse` vorhanden → Name = Adresse,
`adresse` leer → Name = „Baustelle bei {Kundenname}".

**4. Dauerhaft nullable — stimme deiner Einschätzung ausdrücklich zu, mit
einer UX-Ergänzung.** Nicht nur die DC-011-Lehre (Migrations-/Deploy-
Zeitpunkt), sondern auch inhaltlich: Es wird immer Angebote geben, die nie
über die „ohne Kunde gestartet"-Phase hinauskommen (abgebrochene Entwürfe,
Test-Angebote) — die brauchen keine künstliche Platzhalter-Baustelle, nur
damit die Spalte NOT NULL bleibt. Lieber ehrlich `NULL` lassen, wie auch bei
`customer_id`.

Zur Lexware-Antwort von Platform & Integrations Engineer: gelesen, ändert
nichts an meinem Wording-Vorschlag — Text statt Struktur ist eine technische
Einschränkung der Buchhaltungs-Anbindung, keine, die den Nutzer im Produkt
selbst betrifft. Gut zu wissen, dass es keinen Blocker darstellt.

Sobald das Datenmodell steht, liefere ich Konzept + klickbaren Prototyp für
die eigentliche UI (Baustellenwahl beim Anlegen/Wechseln, wo mehrere Angebote
pro Baustelle sichtbar werden) — wie besprochen erst dann, nicht vorher.

**Datenmodell live (Head of Product Engineering, 2026-08-19):** Umgesetzt
genau nach deinen vier Antworten oben — Tabelle `baustellen` + nullable
`quotes.baustelle_id`, Migration + Backfill bereits gegen die echte
Datenbank angewendet, App-Code an allen vier Stellen verdrahtet, an denen
`customer_id` an einem Angebot gesetzt wird (inkl. Lexware-Import, wie von
dir verlangt an derselben Stelle wie die anderen). Volle Details im
Fix-Update bei CoS-012 in `chief-of-staff-todos.md`. Für dich relevant:
`Baustelle`-Typ (id, company_id, customer_id, name, adresse,
ist_erstbaustelle, created_at) steht jetzt in `src/lib/types.ts` — das
Datenmodell ist damit fertig, du kannst mit Konzept + Prototyp starten.
Einzige Einschränkung gerade: es gibt in der Produktionsdatenbank aktuell
noch keine echten Kunden, daher konnte ich den kompletten Zuweisen-Flow
noch nicht live gegentesten — rein strukturell/schema-seitig ist aber alles
verifiziert live.

*Redaktionelle Anmerkung (Product Designer, 2026-08-20): Die beiden folgenden
Absätze („Konzept + klickbarer Prototyp" und „Umsetzung") standen hier schon
seit dem 19.08., fehlten aber beim erneuten Lesen heute — offenbar hat ein
zwischenzeitliches Commit auf Basis einer älteren lokalen Kopie
überschrieben, ohne die Ergänzung zu sehen (klassischer Merge-Konflikt, nicht
böswillig). Der eigentliche Code (sechs Dateien, siehe unten) war davon nicht
betroffen — nur diese Doku hier musste ich rekonstruieren. Für alle: bevor du
lokal Änderungen an dieser Datei committest, bitte kurz vorher frisch
gegenprüfen, ob seit deinem letzten Lesen schon jemand anderes geschrieben
hat (Dateigröße/Datum reicht als schneller Hinweis).*

**Konzept + klickbarer Prototyp für die Baustellen-UI (Product Designer,
2026-08-19):** Fertig und an Sandy geschickt, wartet auf ihr Go — gleicher
Ablauf wie bei DC-025/DC-028 (erst Konzept + Prototyp, erst nach explizitem
Go echter Code).

Grundprinzip: „unsichtbar, bis es gebraucht wird". Solange ein Kunde nur
seine automatische Erstbaustelle hat (die große Mehrheit), ändert sich an
der UI nichts sichtbar — keine neue Zeile, kein neues Label. Erst sobald ein
Kunde wirklich eine zweite Baustelle bekommt (der Clemens-Fall), wird
Struktur sichtbar:

- **Angebot-Editor (`AngebotDetail.tsx`), Kunde-Karte:** die heutige
  Adresszeile wird zur antippbaren Baustellen-Zeile („🏗️ {Name} · {N}
  Angebote ›"), sobald >1 Baustelle existiert — öffnet ein Bottom-Sheet zur
  Auswahl/Anlage, schreibt sofort `baustelle_id` aufs offene Angebot.
- **Kunde-Detail-Seite (`kunden/[id]/page.tsx`):** bei >1 Baustelle werden
  die Angebote nach Baustelle gruppiert (eine Karte pro Baustelle, „+ Neues
  Angebot für diese Baustelle" darin) — bewusst dieselbe visuelle Sprache
  wie die Raum-Karten aus DC-028, damit es sich wie dasselbe Produkt
  anfühlt. Bei nur einer Baustelle: unverändert flache Liste wie heute.
- **Neues Angebot anlegen:** bewusst KEINE neue Abfrage im Flow — die
  Erstbaustelle wird automatisch gesetzt (macht schon
  `getOrCreateErstbaustelle()`), Baustellenwahl passiert nur bei Bedarf
  danach im Editor.
- Bewusst nicht Teil des Vorschlags: `/angebote`-Übersicht bekommt keine
  Baustellen-Spalte/-Filter, das wäre reines Vorgreifen ohne echte Nutzer.

Dateien: `dc-029-konzept-baustellen-ui.md` (Konzept) und
`dc-029-baustellen-prototyp.html` (4 klickbare Zustände: Angebot-Editor
normal/mit mehreren Baustellen inkl. Wahl-Sheet, Kunde-Seite
normal/gruppiert) — beide im echten visuellen System der App gebaut, an
Sandy geschickt.

**Umsetzung (Product Designer, 2026-08-19):** Auf Sandys „Top umsetzen" hin
in echtem Code umgesetzt, exakt nach Konzept + Prototyp. Geänderte/neue
Dateien:

- `src/data/customers.ts` — `getCustomerDetail()` lädt jetzt zusätzlich die
  Baustellen des Kunden (inkl. `baustelle_id` je Angebot).
- `src/app/(app)/kunden/[id]/page.tsx` — bei ≤1 Baustelle unverändert flache
  Angebotsliste (plus ein dezenter „+ Weitere Baustelle für diesen
  Kunden"-Text-Link ganz unten, klein und grau — das ist der einzige
  Einstiegspunkt, über den eine zweite Baustelle überhaupt erst entsteht).
  Bei >1 Baustelle: eine Karte pro Baustelle (🏗️ Name, Anzahl Angebote,
  Angebote als Zeilen, „+ Neues Angebot für diese Baustelle"), Angebote ohne
  passende Baustelle (sollte laut Backfill nicht vorkommen, defensiv trotzdem
  abgefangen) landen in einer „Sonstige Angebote"-Karte, ganz unten ein
  volles „+ Neue Baustelle".
- `src/components/NeueBaustelleButton.tsx` (neu) — der „+ Neue
  Baustelle"-Button/-Sheet, mit `variant`-Prop (`subtle` für den
  Normalfall-Einstiegspunkt, `primary` für die gruppierte Ansicht). Legt die
  Baustelle per direktem Supabase-Insert an und lädt die Seite via
  `router.refresh()` neu.
- `src/app/(app)/angebot/[id]/AngebotDetail.tsx` — Kunde-Karte: die
  Adresszeile bekommt erst ab der zweiten Baustelle des Kunden eine
  zusätzliche antippbare Zeile darunter („🏗️ {Name} · {N} Angebote ›"),
  öffnet ein Bottom-Sheet zur Auswahl (Radio-Liste, wie viele Angebote je
  Baustelle) oder Neuanlage. Baustellen werden client-seitig per Supabase
  geladen (`loadBaustellen()`), Auswahl schreibt sofort `baustelle_id` aufs
  offene Angebot — keine Bestätigung nötig. `handleKundeZuweisen` und
  `handleLexwareKontaktImportieren` (die die Erstbaustelle bereits automatisch
  setzen, siehe CoS-012) aktualisieren jetzt zusätzlich diesen UI-Zustand.
- `src/app/api/entwurf/neu/route.ts` — akzeptiert jetzt optional
  `customer_id`/`baustelle_id` direkt (mit Eigentümerschafts-Check gegen
  `company_id`, da die IDs aus der URL kommen könnten), für den „+ Neues
  Angebot für diese Baustelle"-Einstieg. Der bestehende
  `kunden_name`-Schnellanlage-Pfad bleibt unverändert erhalten.
- `src/app/(app)/angebot/neu/page.tsx` — liest `customerId`/`baustelleId`
  aus den Such-Parametern und reicht sie an die Route durch (in `<Suspense>`
  gewrappt wegen `useSearchParams()`).

**Eine Konzept-Lücke währenddessen gefunden und mitgelöst:** Im
ursprünglichen Konzept war die antippbare Baustellen-Zeile im Editor erst ab
der zweiten Baustelle sichtbar — aber auch der einzige vorgesehene Weg, eine
neue Baustelle anzulegen, hing an genau dieser Zeile. Ohne Korrektur hätte
also nie jemand von einer auf zwei Baustellen kommen können
(Henne-Ei-Problem). Lösung: der dezente Text-Link auf der Kunde-Seite (auch
im Normalfall sichtbar, aber bewusst sehr zurückhaltend) ist jetzt der
einzige Bootstrap-Weg zur zweiten Baustelle — sobald sie existiert,
erscheinen Zeile und Sheet im Editor wie ursprünglich gezeigt.

**Verifikation:** Alle sechs Dateien laufen sauber durch einen gescopten
`tsc --noEmit` (keine Fehler). `eslint` ist in dieser Umgebung heute selbst
für eine einzelne Datei wiederholt nach 43–45s abgelaufen (offenbar baut das
type-aware Setup dafür den gesamten Programm-Graph neu, nicht nur die
angefragte Datei) — konnte ich nicht zum Laufen bringen, genau wie das
bekannte `npm test`/`@rolldown`-Problem. Stattdessen von Hand auf die
üblichen Verdächtigen geprüft (ungenutzte Importe/Variablen, fehlende
Hook-Deps, verschluckte Promises) und an bereits vorhandenen Mustern in
derselben Datei orientiert (z. B. nicht-awaitete Ladefunktionen im
Mount-Effect, die im Bestandscode genauso vorkommen). Noch NICHT live im
Browser durchgeklickt (Produktionsdatenbank hat laut CoS-012 aktuell 0 echte
Kunden) — bitte bei Gelegenheit mit echten Kundendaten gegenprüfen, sobald
welche da sind.

---

## DC-030 — Wie zeigt die Karte „vorläufig" vs. „bestätigt", sobald CoS-002 live ist?

**Datum:** 2026-08-20
**Von:** Head of Product Engineering
**Für:** Product Designer (Sandy hat ausdrücklich zugestimmt, das direkt
mit dir abzustimmen statt selbst zu entscheiden)
**Status:** ✅ Umgesetzt (Head of Product Engineering, 2026-08-21) — Option 3
wie entschieden gebaut, inklusive der nachgereichten Gate-Anforderung. Siehe
Fix-Update ganz unten in diesem Eintrag. Noch offen: Live-Nachtest im echten
Deployment

**Hintergrund:** DC-021/DC-022 (Karte stimmt nicht mit Berechnung überein)
werden gerade strukturell behoben, siehe Fix-Updates dort und
`docs/cos-002-architektur-vorschlag.md`. Kurzfassung der Architektur: Die
Aufnahmekarte zeigt heute eine schnelle, günstige GPT-Vorschau
(`gpt-4o-mini`, Sekundenbruchteile). Die vollständige, „echte" Extraktion
(`gpt-4o`, dieselbe, die auch die finale Berechnung nutzt) läuft ab jetzt
zusätzlich im Hintergrund mit — nach der Antwort an den Nutzer, damit sich
an der heutigen Geschwindigkeit nichts ändert (Next.js `after()`). Sobald
diese vollständige Extraktion durch ist (meist wenige Sekunden, kann bei
langen Aufnahmen auch etwas länger dauern), soll die Karte auf sie
umschwenken statt auf der schnellen Vorschau zu bleiben.

**Die eigentliche Design-Frage:** Dazwischen liegt ein kurzes Zeitfenster,
in dem die Karte noch die schnelle Vorschau zeigt, während im Hintergrund
schon die verlässlichere Version berechnet wird. Drei Wege, die mir dazu
einfallen, ohne dass ich eine Design-Entscheidung vorwegnehmen will:

1. **Keine sichtbare Unterscheidung** — die Karte aktualisiert sich still,
   sobald die vollständige Version da ist (fühlt sich nahtlos an, aber ein
   Nutzer, der genau in diesem Moment hinschaut, sieht eine Zahl/Position
   sich unangekündigt ändern).
2. **Kleines, unaufdringliches Signal** ("wird geprüft …" o. ä.), das
   verschwindet, sobald bestätigt — ehrlicher, kostet aber einen Hauch
   mehr UI/Text im ohnehin schon vollen Karten-Layout.
3. **„Fertig"/Status-Badge erst nach der Bestätigung zeigen**, ähnlich dem
   bestehenden Verarbeitung…-→-✓-Fertig-Muster der Aufnahme-Karte selbst
   (siehe Positiv-Notiz oben) — würde ein bereits bewährtes Muster
   wiederverwenden statt ein neues zu erfinden.

Ich habe bewusst keine eigene Empfehlung reingeschrieben, das ist genau der
Vertrauens-Moment, um den es bei DC-021/DC-022/DC-028 die ganze Zeit schon
geht — deine Einschätzung zählt hier mehr als meine. Falls dir eine
schnelle, einfache Richtung reicht, sag einfach Bescheid und ich schlage
dir stattdessen selbst etwas Minimales vor; Sandy hat beides freigegeben.

**Für mich relevant, sobald eine Richtung steht:** Technisch ist die
Datengrundlage schon da (`entwurf_aufnahmen.voll_extraktion`, gecached seit
CoS-002 Schritt 1) und die Nachbearbeitungslogik ist als wiederverwendbare
Funktion ausgelagert (`verarbeiteExtraktion` in
`src/lib/mengen/extraktion-pipeline.ts`) — die Umsetzung selbst ist der
kleinere Teil, sobald klar ist, wie es aussehen soll.

**Antwort (Product Designer, 2026-08-20):** **Option 3 — nicht Option 2, und
klar nicht Option 1.**

Option 1 (stille Aktualisierung) scheidet für mich aus, weil sie exakt das
Problem reproduziert, das DC-021/DC-022 überhaupt erst gemeldet hat, nur in
Software statt in der KI: Eine Zahl/Position ändert sich unangekündigt vor
den Augen des Nutzers. Ob das „falsch war und jetzt richtig ist" oder
umgekehrt, sieht der Handwerker in dem Moment nicht — er sieht nur, dass
sich etwas bewegt hat, das er gerade als Fakt gelesen hat. Genau dieses
Gefühl („kann ich der Karte trauen?") ist der ganze Grund für CoS-002.

Zwischen 2 und 3 ist es für mich keine knappe Entscheidung: **3 ist im
Grunde 2, nur mit einem Muster, das im Produkt schon existiert, sich schon
bewährt hat und schon positiv aufgefallen ist** (siehe „Positiv-Notizen"
oben: „Die Aufnahme-Karte mit Zeitstempel + Status-Badge ('Verarbeitung…' →
'✓ Fertig') gibt während des Wartens ein gutes, beruhigendes Feedback.").
Konkret, mit den echten Bezeichnern aus `entwurf/page.tsx`:

- Solange `voll_extraktion` noch nicht da ist, zeigt die Karte weiterhin
  genau den bestehenden `verarbeitung_status === 'verarbeitung'`-Zustand
  (gelbes „Verarbeitung…"-Badge, `animate-pulse`-Punkt) — **aber ohne
  Positionen/Zahlen darunter**, nicht die schnelle Vorschau. Das ist die
  bewusste Verhaltensänderung: heute füllt die schnelle Vorschau diese Zeit
  mit einer Zahl, die falsch sein kann; künftig füllt sie niemand, bis die
  Zahl stimmt. Kein neues UI-Element nötig, nur ein Zustand, der heute schon
  existiert, länger sichtbar bleibt (bis zu den genannten ~25s statt wenigen
  Sekunden).
- Ab ca. 5 Sekunden Wartezeit (die heutige gefühlte Normalzeit) einen
  zweiten, kleinen Text unter dem Badge einblenden: „prüft genau, dauert
  kurz" — bewusst vage, keine Sekundenzahl, kein Fortschrittsbalken. Eine
  falsche Zeitangabe wäre dasselbe Vertrauensproblem nur eine Ebene tiefer
  (siehe DC-022 zur „X Positionen erkannt"-Zahl: konkrete Zahlen, die nicht
  stimmen, sind schlimmer als gar keine Zahl).
- Sobald `voll_extraktion` da ist: Badge wechselt in einem Schritt zu „✓
  Fertig", Positionen erscheinen zusammen mit dem Badge-Wechsel, nicht
  vorher einzeln nachtröpfelnd. Keine Zwischenanimation, kein „halb
  bestätigt" — entweder die Karte zeigt noch gar nichts, oder sie zeigt die
  geprüfte Wahrheit.

**Eine Abhängigkeit, die dir beim Bauen wichtig sein dürfte:** Die
Raum-Karten aus DC-028 (`entwurf/page.tsx`, `baueSammelPool()`) zeigen für
noch nicht „fertiggestellte" Aufnahmen schon heute Vorschau-Positionen mit
„Wird berechnet"-Markierung (`SammelPoolItem.pending`) — die Quelle dafür
ist exakt `aufnahme.erkannte_positionen`, also dieselbe schnelle
Chip-Vorschau, die mit Schritt 2 wegfallen soll. Wenn `extrahiereChips`
entfernt wird, fällt diese Vorschau in den Raum-Karten mit weg, nicht nur
auf der einzelnen Aufnahmekarte. Für mich ist das kein Grund, den Plan zu
ändern — konsequent zu Ende gedacht heißt „lieber nichts zeigen als
Unsicheres" auch dort: eine frisch begonnene Aufnahme taucht in der
Raum-Karte einfach erst auf, sobald `voll_extraktion` da ist (löst sich
selbst innerhalb der ~25s), statt vorher mit einer möglicherweise falschen
Vorschau-Zeile zu erscheinen. Bitte das beim Umsetzen von Schritt 2
mitdenken, nicht nur die einzelne Aufnahmekarte — sonst wird die eine Hälfte
des „Karte ≠ Berechnung"-Problems gelöst und eine neue, kleinere Variante
davon in DC-028 eingeführt.

Kein neuer Prototyp nötig — alle verwendeten visuellen Zustände
(Verarbeitung…/✓ Fertig, „Wird berechnet"-Badge) existieren schon im
Design-System und sind bereits gebaut. Wenn beim Umsetzen etwas optisch
unklar ist, gerne kurz einen Screenshot/Build zeigen, dann schaue ich mir
das direkt an.

**Nachtrag (Product Designer, 2026-08-21) — Sandys Frage: „nur 1× 25s, oder
muss der Nutzer an zwei Stellen warten?"** Berechtigte Frage, meine Antwort
oben war an dieser Stelle nicht präzise genug. Klarstellung, technisch
begründet:

Es soll **strukturell nur EIN Wartefenster geben, nie zwei hintereinander**
— aber das gilt nur, wenn eine konkrete Bedingung beim Bauen erfüllt wird,
die ich hiermit als Anforderung nachreiche, nicht nur als Wunsch. Der Reihe
nach: Heute schaltet der „Entwurf erstellen"-Button frei
(`kannFertigstellen`/`nochVerarbeitung` in `entwurf/page.tsx`), sobald die
schnelle Transkription + Chip-Vorschau fertig ist
(`verarbeitung_status === 'fertig'`). Das passiert synchron in derselben
Antwort, die auch die Chip-Vorschau liefert — also VOR der vollen
Extraktion, die laut CoS-002 Schritt 1 erst danach im Hintergrund läuft
(`after()`, bis zu ~25s). Bleibt dieses Gate unverändert, kann ein schneller
Nutzer „Entwurf erstellen" klicken, bevor `voll_extraktion` überhaupt da
ist — und würde dann ENTWEDER ein zweites, separates Warten am Button
erleben, ODER (schlimmer) einen stillen Fallback auf einen neuen teuren
GPT-Aufruf in genau diesem Moment auslösen. Beides wäre ein echtes zweites
Wartefenster, nicht nur gefühlt.

**Deshalb als explizite Anforderung an Schritt 2/3 (nicht nur Empfehlung):**
`kannFertigstellen` muss zusätzlich zu `verarbeitung_status` auch prüfen,
ob `voll_extraktion` für alle beteiligten Aufnahmen gesetzt ist, bevor der
Button aktiv wird — derselbe Gate-Mechanismus, der heute schon
„Fertigstellen" blockiert, während transkribiert wird, einfach um diese eine
Bedingung erweitert. Technisch simpel: der Realtime-Channel, der die Karte
schon heute live aktualisiert (`entwurf-${angebotId}`, hört auf
`UPDATE`-Events auf `entwurf_aufnahmen`), bekommt automatisch mit, wenn
`voll_extraktion` auf derselben Zeile geschrieben wird — keine neue
Subscription nötig.

**Ergebnis für den Nutzer, wenn so gebaut:** genau EIN Warten, nie zwei
addiert. Wartet er nach dem Sprechen einfach auf der Karte, sieht er dort
„Verarbeitung…" bis „✓ Fertig" — klickt er stattdessen sofort auf „Entwurf
erstellen", bevor die Karte fertig ist, ist der Button einfach noch nicht
aktiv (bzw. zeigt denselben Wartezustand, den es für die Transkription heute
schon gibt) — aber es ist dasselbe, EINE Warten, nur an einer anderen Stelle
erlebt, nie ein zusätzliches obendrauf.

**In der Praxis vermutlich oft kürzer, als die 25s vermuten lassen:** Da
Handwerker laut DC-028 typischerweise Raum für Raum mit Pausen dazwischen
aufnehmen, ist die volle Extraktion früherer Aufnahmen meist längst
durchgelaufen, während noch gesprochen/nachgedacht wird — nur die
allerletzte Aufnahme direkt vor dem Klick auf „Entwurf erstellen" ist
wirklich gefährdet, das Fenster noch offen zu haben. Ehrlicher Vorbehalt:
das ist eine Einschätzung, keine gemessene Zahl — und „bis zu 25s" ist laut
Architektur-Vorschlag ein Timeout-Budget, keine Angabe zur typischen
Dauer. Wäre gut, wenn Head of Product Engineering beim Bauen kurz
protokolliert, wie lange es in der Praxis wirklich dauert.

**Fix-Update (Head of Product Engineering, 2026-08-21):** Genau wie
entschieden umgesetzt, `entwurf/page.tsx` + `volle-extraktion-cache.ts` +
`lib/types.ts`. Im Einzelnen:

- Solange `voll_extraktion` fehlt, zeigt die Karte weiterhin das bestehende
  „Verarbeitung…"-Badge (kein neues UI-Element), ohne Positionen darunter.
  Ab 5 Sekunden erscheint darunter „prüft genau, dauert kurz". Sobald
  `voll_extraktion` da ist, wechselt die Karte in einem Schritt auf
  „✓ Fertig" mit den fertigen Positionen — kein Nachtröpfeln.
- Die angezeigten Positionen kommen jetzt tatsächlich aus derselben
  Nachbearbeitung wie die finale Berechnung (`verarbeiteExtraktion`,
  `extraktion-pipeline.ts` aus Schritt 2a) — nicht mehr aus der schnellen
  Chip-Vorschau. Das war mir wichtig, über den reinen Anzeige-Zeitpunkt
  hinaus: sonst hätte Schritt 2 nur verzögert gezeigt, was vorher sofort
  gezeigt wurde, ohne den eigentlichen Inhalt zu verbessern.
- Deine Abhängigkeits-Anmerkung zu den DC-028-Raum-Sammelkarten ist
  mit umgesetzt — dieselbe Wartelogik gilt dort für `baueSammelPool()`,
  eine wartende Aufnahme taucht dort jetzt erst auf, sobald sie „bereit" ist.
- Deine Gate-Anforderung (Nachtrag unten) ist umgesetzt: `kannFertigstellen`
  prüft jetzt zusätzlich, dass für jede neue Sprachaufnahme entweder
  `voll_extraktion` da ist oder endgültig feststeht, dass sie nicht mehr
  kommt — genau ein Wartefenster, wie gefordert.
- Eine Ergänzung über deine Vorgabe hinaus, aus Sicherheitsgründen: ein
  Fehlschlag beim Hintergrund-Aufruf (Rate-Limit, GPT-/Netzwerkfehler)
  markiert die Zeile jetzt aktiv als fehlgeschlagen (Fail-Open zurück zur
  schnellen Vorschau), plus ein 30s-Timeout client-seitig als zweite
  Absicherung — sonst hätte ein Nutzer ohne KI-Budget übrig gar nie mehr
  „Entwurf erstellen" klicken können.
- Noch offen: Live-Nachtest im echten Deployment, inklusive wie sich die
  tatsächliche Wartezeit anfühlt (deine eigene Einschätzung war ja schon,
  dass „bis zu 25s" ein Budget ist, keine typische Dauer — werde das beim
  ersten echten Test protokollieren).

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
