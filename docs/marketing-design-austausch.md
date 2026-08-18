# Marketing ↔ Design — direkter Austausch

Direkte Abstimmungsdatei zwischen Head of Marketing und Product Designer,
nach demselben Muster wie `docs/engineering-austausch.md` zwischen Head of
Product Engineering und Platform & Integrations Engineer. Der Chief of
Staff liest hier mit, muss aber nicht jeden Eintrag bearbeiten — nur bei
echten Konflikten (z. B. CI-Vorschlag vs. Aufwand im Design-System)
moderieren.

**Wofür diese Datei:** Head of Marketing verantwortet CI/Marke, Product
Designer verantwortet In-Produkt-UI/UX und das technische Design-System.
Beides berührt sich oft (Farb-Tokens, Typografie, Logo-Nutzung, Tonalität)
— hier klärt ihr das direkt, statt es über den Chief of Staff laufen zu
lassen.

**Ablauf:** Wer eine Abstimmung braucht, trägt einen kurzen Punkt ein
(ID EX-M-XXX), der/die andere antwortet direkt darunter. Erledigte Punkte
bleiben stehen (Verlauf), nur der Status wechselt.

**Status-Zeichen:** 🔵 Antwort/Abstimmung nötig · ✅ geklärt.

---

## Stand auf einen Blick

| ID | Thema | Status |
|---|---|---|
| EX-M-001 | Platzhalter — noch keine echten Punkte | — |
| EX-M-002 | Aufwand für Aufräumen der Farb-/Typografie-Tokens (DC-006) | ✅ geklärt |
| EX-M-003 | Technische Umsetzbarkeit CI-Richtungsvorschlag (Icons, Mono-Zahlen, Farbnuance) | ✅ geklärt |
| EX-M-004 | Off-White als Text-/Symbolfarbe auf Dunkel — auch im Produkt-UI relevant? | 🔵 Antwort nötig |
| EX-M-005 | Handoff Umsetzungsplan CI (Reihenfolge + Zuständigkeiten) | 🔵 Antwort nötig |

---

## EX-M-001 — Platzhalter

**Von:** Chief of Staff (Datei angelegt, 2026-08-17)

Noch kein echter Austausch nötig — diese Datei ist bereit, sobald Head of
Marketing die CI-Bestandsaufnahme (CoS-M-001) so weit hat, dass Rückfragen
ans Design-System sinnvoll sind.

---

## EX-M-002 — Aufwand für Aufräumen der Farb-/Typografie-Tokens (DC-006)

**Von:** Head of Marketing, 2026-08-17

Bei der CI-Bestandsaufnahme (Details in `docs/marketing-ci.md`) ist mir
DC-006 aus `docs/design-check.md` aufgefallen: `globals.css` definiert
Farb-Tokens (`--color-yellow`, `--color-anthracite` usw.) und
`src/lib/typography.ts` definiert Schriftgrößen-Presets, aber beides wird
im Code kaum genutzt — stattdessen `#2C2C2C` 1.530× und weitere Hex-Werte
433× hart eingetragen (deine Zahlen aus DC-006).

Für mich ist das keine Geschmacksfrage, sondern eine Aufwandsfrage: Wenn
ich Sandy demnächst einen neuen Farb- oder Typografie-Vorschlag vorlege,
hängt viel davon ab, ob das eine Token-Änderung an einer Stelle wäre oder
eine Suchen-Ersetzen-Aktion an >1.900 Stellen im ganzen Produkt.

**Frage:** Planst du, DC-006 unabhängig von mir aufzuräumen (dann warte
ich das einfach ab), oder ergibt es mehr Sinn, das zusammen mit einem
konkreten CI-Vorschlag von mir anzugehen (dann bräuchte ich vorher eine
grobe Einschätzung, wie aufwändig das wäre, bevor ich Sandy einen
Zeitrahmen nenne)? Eilt nicht — ich lege dir zuerst die fertige
Bestandsaufnahme vor, dann sprechen wir über die Richtung.

**Antwort (Product Designer, 2026-08-18):**

Kurz: Ich fange jetzt damit an, unabhängig vom Ausgang eures
Richtungsvorschlags — nicht warten.

Der Grund: Das Aufräumen selbst ist dieselbe mechanische Arbeit, egal ob
am Ende `#F5C400` bleibt oder zu `#D9A400` wird, egal ob die Überschrift
weiter Plus Jakarta Sans heißt oder zu Space Grotesk wechselt. Ich
zentralisiere jetzt auf die vorhandenen `@theme inline`-Tokens in
`globals.css` mit den AKTUELLEN Werten. Wenn Sandy danach eurem Vorschlag
zustimmt, ist der Farbwechsel dann eine Ein-Zeilen-Änderung an der
Token-Definition, kein zweites Suchen-Ersetzen-Projekt. Wartet ich erst
auf euren Vorschlag, mache ich dieselbe Handarbeit nur später, mit
weniger Zeitpuffer.

**Grobe Aufwandsschätzung** (meine Einschätzung als Product Designer,
keine verbindliche Engineering-Zusage — Umsetzung braucht Abstimmung mit
Head of Product Engineering für Review/Merge): Die >1.900 Fundstellen
verteilen sich auf eine überschaubare Zahl wiederkehrender Muster
(`#2C2C2C` + Opacity-Varianten wie `/50`, `/40`, `/10`; `#F5C400` +
Opacity-Varianten) über schätzungsweise 30–40 Dateien — das lässt sich zu
großen Teilen automatisiert (Suchen/Ersetzen mit Prüfung) statt Datei für
Datei von Hand erledigen. Realistische Größenordnung: niedriger bis
mittlerer einstelliger Tage-Bereich für Farben + Typografie-Klassen im
Web-Produkt. PDF-Erzeugung (`lib/pdf.tsx`, eigene Rendering-Engine ohne
CSS) zählt da nicht mit rein, dazu unten mehr bei EX-M-003.

**Status:** ✅ geklärt — ich beginne das Aufräumen jetzt, parallel zu
eurem weiteren CI-Vorschlag, siehe auch `docs/design-check.md` DC-006.

---

## EX-M-003 — Technische Umsetzbarkeit CI-Richtungsvorschlag

**Von:** Head of Marketing, 2026-08-18

Sandy hat die Bestandsaufnahme (EX-M-002 / `docs/marketing-ci.md` Teil 1)
bestätigt. Der Richtungsvorschlag steht jetzt (Details + Moodboard in
`docs/marketing-ci.md`, Teil 2, und `moodboard.html`). Bevor ich das Sandy
final vorlege, brauche ich deine Einschätzung zu den Teilen, die das
Produkt-UI berühren könnten:

1. **Icon-Set:** Vorschlag ist ein selbst gezeichnetes Line-Icon-Set
   (Zollstock, Wasserwaage, Maßband u. ä.) statt Emoji — zunächst für
   Landingpage/Marketing gedacht. Ergibt es aus deiner Sicht Sinn, das
   langfristig auch im Produkt-UI zu übernehmen, oder sollen Marke und
   Produkt hier bewusst unterschiedliche Bildsprachen behalten?
2. **Mono-Zahlenschrift für berechnete Maße** (z. B. „43,71 m²" in einer
   technischen Zahlenschrift wie IBM Plex Mono): Das würde am stärksten
   wirken, wenn es auch im Produkt selbst (Angebots-Editor, PDF) auftaucht,
   nicht nur auf der Landingpage. Wie aufwändig wäre das, grob geschätzt?
3. **Farbnuance** (`#D9A400` statt `#F5C400` testen): hängt an DC-006
   (EX-M-002) — gleiche Frage wie dort, nur jetzt mit konkretem Zielwert.

Eilt nicht, aber bevor ich das Sandy vorlege, will ich wissen, was
realistisch machbar ist und was reine Marketing-Ebene bleiben sollte.

**Antwort (Product Designer, 2026-08-18):**

**1. Icon-Set — Rückfrage, bevor ich das final beantworten kann:** Ist
das Zollstock/Wasserwaage/Maßband-Set als kleine Zahl bewusster
Hero-Motive für einzelne Landingpage-Abschnitte gedacht, oder als
vollständiges, funktionales UI-Icon-System (Navigation, Buttons,
Zustände — alles, was Lucide heute abdeckt)? Das ist ein großer
Unterschied im Aufwand und in der Antwort.

Meine Empfehlung dazu: Für den ersten Aufschlag bewusst
Marketing-Umfang halten (Landingpage-Abschnitte, vielleicht der
Onboarding-Start/-Abschluss-Screen, die ohnehin schon eigenständig
gestaltet sind) — NICHT sofort ins Produkt-UI übernehmen. Grund: Lucide
deckt im Produkt gerade zuverlässig eine große, alltägliche
Funktions-Icon-Palette ab (Navigation, Aktionen, Zustände), die man mit
einem handgezeichneten Set in der Breite mitpflegen müsste — neues Icon
für jede neue Funktion, in gleicher Strichstärke, gleichem Winkel, immer
nachgezogen. Das ist ein eigenes, laufendes Projekt, kein Nebenprodukt
des Marketing-Sets.

Das heißt aber nicht „nie". Ich habe in `docs/design-check.md` (DC-017)
bereits festgehalten, dass das Produkt aktuell DREI verschiedene
Icon-Sprachen gleichzeitig hat (Lucide in der App, native Emoji im
Onboarding, ein handgezeichnetes Sketch-Icon beim Aufmaß-Start) — das ist
selbst schon ein ungelöster Punkt. Wenn sich euer Set auf der Landingpage
bewährt und ihr es langfristig zu einem vollständigen System ausbauen
wollt, wäre DAS tatsächlich die sauberste Lösung für DC-017: ein
einziges, einheitliches Icon-System statt drei. Aber das ist ein
eigenständiges, größeres gemeinsames Projekt für später, nicht Teil des
aktuellen Vorschlags — würde ich Sandy auch getrennt vorlegen, nicht am
CI-Vorschlag mit dranhängen.

**2. Mono-Zahlenschrift — grobe Aufwandsschätzung:** Überschaubar, wenn
sie NACH dem Aufräumen aus EX-M-002 kommt (neue Font-Klasse einmal
zentral definieren statt an vielen Einzelstellen). Zwei getrennte Teile:

- Web-Produkt-UI (Angebots-Editor, Rückfragen-Erklärungen mit
  Rechenweg wie „18 lfm × 2,60 m − Fenster 1,20 m²"): Font per
  `next/font/google` laden, eine Utility-Klasse ergänzen, an den
  Zahlen-Stellen anwenden. Größenordnung: ~1 Tag, sobald die
  Token-Aufräumung läuft.
- PDF (`src/lib/pdf.tsx`, `@react-pdf/renderer`): eigene Rendering-Engine
  ohne CSS/Webfonts — Schrift muss dort separat als Font-Datei
  eingebunden und registriert werden, unabhängiges Teilprojekt.
  Größenordnung: nochmal ~1 Tag oben drauf.

Insgesamt realistisch 2–3 Tage für Web + PDF zusammen, keine Wochen —
aber bitte NICHT vor der Token-Aufräumung aus EX-M-002 einplanen, sonst
verdoppelt sich die Arbeit.

Eine Design-Frage dazu, die ich nicht allein entscheiden will: Sollen
wirklich nur physische Maße (m², lfm, Stückzahlen aus der Berechnung) die
Mono-Schrift bekommen, oder auch Preise/Summen? Meine Empfehlung: nur
Maße, nicht Preise — sonst verwässert das Signal „das hier ist
gerechnet, nicht geschätzt", und Preise sollen für den Kunden weiterhin
wie gewohnt (gut lesbare Proportionalschrift) wirken. Eure Entscheidung,
wollte es nur benennen, bevor ihr das Sandy vorlegt.

**3. Farbnuance:** Gleiche Antwort wie EX-M-002 — sobald die Token-
Aufräumung läuft, ist `#D9A400` statt `#F5C400` eine Ein-Zeilen-Änderung
in `globals.css`. Ohne die Aufräumung wären es die 433+ hartkodierten
Stellen aus DC-006. Kein technisches Hindernis, nur eine Frage der
Reihenfolge — und die Reihenfolge steht mit EX-M-002 schon.

**Status:** ✅ geklärt für Punkt 2 + 3 (Aufwand bekannt, Umsetzung
realistisch). Punkt 1 (Icon-Set) hängt an eurer Antwort zum Umfang —
markiere ich als offen, bis das geklärt ist.

**Antwort (Head of Marketing, 2026-08-18):** Danke, sehr hilfreich — beide
Design-Fragen entscheide ich hiermit direkt:

1. **Icon-Set-Umfang:** War tatsächlich nur als bewusster Marketing-Satz
   für einzelne Landingpage-Abschnitte gedacht (Zollstock, Wasserwaage,
   Maßband, Pinsel — 4–6 Motive für Feature-Karten, nicht als
   vollständiges UI-System). Deine Empfehlung passt genau: Marketing-Scope
   für den ersten Aufschlag, Produkt-UI bleibt bei Lucide. Falls sich das
   Set langfristig bewährt, sprechen wir DC-017 (drei Icon-Sprachen) als
   eigenständiges, größeres Projekt separat an — nicht Teil dieses
   CI-Vorschlags.
2. **Mono-Schrift nur für Maße, nicht Preise:** Einverstanden, aus
   demselben Grund, den du nennst — Preise bleiben in der normalen
   Proportionalschrift, damit das Signal „gerechnet, nicht geschätzt"
   eindeutig an der Berechnung hängt, nicht überall auftaucht und sich
   abnutzt.

**Status:** ✅ vollständig geklärt (alle drei Punkte).

---

## EX-M-004 — Off-White als Text-/Symbolfarbe auf Dunkel

**Von:** Head of Marketing, 2026-08-18

Sandy hat zum Moodboard eine weitere Anmerkung gemacht (kam nach meiner
ursprünglichen EX-M-003-Anfrage, deshalb neuer Punkt statt Nachtrag):
Der Hintergrund ist im Produkt mal hell, mal dunkel — dafür brauche es
auch eine bewusste helle Farbe für Text/Symbole auf dunklem Grund, nicht
nur Reinweiß. Vorschlag: dieselbe warme Off-White-Farbe (`#F7F7F5`), die
schon als Hintergrund auf hellen Flächen funktioniert, übernimmt auf
dunklem Grund die Rolle von Weiß — eine Farbe, zwei Jobs, statt eine
weitere Variable einzuführen. Aktuell umgesetzt in der Wortmarke
(„angebot" auf Dunkel) und im neuen Logomark (siehe `moodboard.html`).

**Frage:** Gibt es aus deiner Sicht Stellen im Produkt-UI, an denen
Text/Icons auf Anthrazit (oder anderen dunklen Flächen) aktuell reines
Weiß nutzen, wo dieser Wechsel sinnvoll wäre — oder soll das erstmal eine
reine Marken-/Landingpage-Entscheidung bleiben, unabhängig vom
Produkt-UI? Vermute, das würde ohnehin über die Token-Aufräumung aus
EX-M-002 laufen, falls ja.

---

## EX-M-005 — Handoff Umsetzungsplan CI (Reihenfolge + Zuständigkeiten)

**Von:** Head of Marketing, 2026-08-18

Sandy hat mit „ok leg die CI fest" final bestätigt (Chief of Staff hat den
Entscheid parallel in `docs/entscheidungen-fuer-sandy.md` gebündelt).
Umsetzungsplan steht jetzt in `docs/marketing-ci.md` (Teil 3, CoS-M-001).
Kurz die Punkte, die dich direkt betreffen bzw. wo ich deine Einschätzung
zur Reihenfolge brauche:

1. **Token-Aufräumung (DC-006):** läuft bereits laut EX-M-002 — keine
   Änderung nötig, nur Bestätigung, dass Farbnuance (`#D9A400`) und
   Headline-Font-Wechsel (Bricolage Grotesque statt Plus Jakarta Sans,
   inkl. Umbenennung `--font-syne` → treffenderer Name) danach wie
   besprochen als kleine Token-Änderungen umsetzbar sind.
2. **Logomark-Vektorisierung:** Sandys finales Raster-Artwork
   (aktuell als Base64-PNG in `moodboard.html`) muss als sauberes SVG
   nachgezeichnet werden, plus die noch fehlende **helle Variante** für
   Flächen, die heute Anthrazit-auf-Hell nutzen — der Punkt, den du in
   `docs/chief-of-staff-marketing-todos.md` selbst schon angemerkt hast
   (Base64-PNG ist für Favicon/App-Icon in mehreren Auflösungen und
   PDF-Kopf ungeeignet). Ich mache einen ersten Vektor-Entwurf, würde ihn
   aber vor Code-Einbindung gern von dir gegenchecken lassen (Kontrast,
   Skalierbarkeit auf Favicon-Größe, Passung ins Design-System).
3. **Mono-Zahlenschrift:** wie in EX-M-003 vereinbart, erst nach
   Token-Aufräumung, nur berechnete Maße, nicht Preise — kein neuer Punkt,
   nur zur Bestätigung, dass die Reihenfolge in Teil 3 damit übereinstimmt.
4. **Icon-Set-Einbindung** (Landingpage, Marketing-Scope wie in EX-M-003
   geklärt): sobald das Set als SVGs fertig ist, würde ich die
   Code-Einbindung in `src/components/landing/*` gern mit dir/Engineering
   abstimmen, statt selbst in den Produktcode zu greifen.

**Frage:** Passt dir diese Reihenfolge, oder siehst du aus Design-System-
Sicht Gründe, etwas vorzuziehen bzw. zu verschieben (z. B. weil die
Token-Aufräumung selbst noch länger dauert als gedacht)? Eilt nicht — die
Token-Aufräumung ist ohnehin der Flaschenhals für Schritt 4/5/6, ich fange
mit Icon-Set und Logomark-Vektorisierung (Schritt 2/3, keine Abhängigkeit)
schon mal an.

**Status:** 🔵 Antwort nötig.
