# Marketing / CI — Bestandsaufnahme

Home-Datei von Head of Marketing für alles rund um Corporate Identity und
Marketing-Materialien — nach demselben Prinzip wie `docs/design-check.md`
beim Product Designer. Laufender Inhalt, wird bei jedem neuen CI-Thema
ergänzt.

**Ablauf:** Diese Datei enthält die vollständige Analyse/Begründung.
`docs/chief-of-staff-marketing-todos.md` verweist mit kurzem Status hierher.

---

## CoS-M-001, Teil 1 — CI-Bestandsaufnahme (Stand: 2026-08-17)

**Was ich mir angesehen habe:** Landingpage (`src/app/page.tsx` +
`src/components/landing/*`), Farb-/Typografie-Tokens (`globals.css`,
`src/lib/typography.ts`), Logo-Komponente (`src/components/Logo.tsx`),
App-Icons (`icon.tsx`, `apple-icon.tsx`, `manifest.ts`), `public/`-Ordner,
Coming-Soon-Seite, ein Blogpost, sowie die CI-relevanten Befunde, die der
Product Designer in `docs/design-check.md` bereits dokumentiert hat (DC-001,
DC-006, DC-007) — um nicht doppelt zu prüfen, was schon bekannt ist.

### Was heute da ist

**Farben:** Ein Zwei-Farben-System — Gelb `#F5C400` als Akzent, Anthrazit
`#2C2C2C` als Anker, dazu ein warmes Off-White `#F7F7F5` als Hintergrund
statt reinem Weiß. Definiert als Tailwind-Tokens in `globals.css`
(`--color-yellow`, `--color-anthracite` usw.).

**Typografie:** Zwei Schriften — „Plus Jakarta Sans" (700/800, für
Überschriften) und „Inter" (400–600, für Fließtext). Auffällig: Die
CSS-Variable und alle Klassennamen heißen `--font-syne` / `.font-syne`,
obwohl technisch Plus Jakarta Sans geladen wird. Sieht nach einem späteren
Schriftwechsel aus, bei dem die Benennung nicht mitgezogen wurde.

**Logo:** Kein Bild-/Wortmarken-Asset, sondern reiner Text: „sofort" +
„angebot" in einer Font-Black-Wortmarke, mit einem cleveren
Umkehr-System (`variant="dark"`: sofort=Gelb, angebot=Weiß · `variant="light"`:
sofort=Anthrazit, angebot=Gelb). Kein eigenständiges Bildzeichen — das
App-Icon ist ein Anthrazit-Quadrat mit den Buchstaben „sa" in Gelb.
`public/` enthält bis auf `favicon.ico` ausschließlich die
Next.js-Standard-Platzhalter-SVGs (file/globe/next/vercel/window) — es
gibt also aktuell **keine einzige echte Bild-Asset-Datei** der Marke.

**Bildsprache:** Keine — weder Fotografie noch Illustration. Icons sind
durchgehend Standard-Emoji (🎙 📐 🧮 ✍️ 🔗 💡 🎨 🏠 …), auf der Landingpage
genauso wie im Produkt.

**Tonalität:** Direkt, konkret, wenig Marketing-Floskeln. Beispiele:
„Feierabend statt Angebot schreiben", „Kunde wartet", „Gerechnet, nicht
geschätzt". Der Blogpost-Ton ist genauso: kurze Sätze, keine Umwege,
Praxisnutzen zuerst.

### Stärken

Die Tonalität ist die größte Stärke und sollte unverändert bleiben. Sie
trifft die Zielgruppe genau: ein Handwerker, der abends noch ein Angebot
schreiben muss, will keine Marketingsprache, sondern verstehen, was das
Tool für ihn tut — und das tut der Text durchgehend gut, inklusive
Details wie dem Rechenweg-an-jeder-Position-Argument, das Vertrauen
schafft, ohne es zu behaupten.

Das Farbpaar Gelb/Anthrazit ist mutig statt austauschbar-blau, wie es die
meisten B2B-SaaS-Tools nutzen, und hat einen klaren Bezug zum Handwerk
(Gelb erinnert an Warnweste/Werkzeug, nicht an Tech-Startup). Anthrazit
als zweite Farbe statt Schwarz nimmt der Kombination die Härte und
funktioniert sowohl hell als auch dunkel gut lesbar.

Das Logo-Umkehrsystem (`variant`-Prop) ist strukturell durchdacht — eine
einzige Komponente, die sich automatisch an hellen/dunklen Hintergrund
anpasst, ohne dass an zehn Stellen von Hand Farben gepflegt werden müssen.

Das warme Off-White (`#F7F7F5`) statt reinem Weiß ist eine kleine, aber
richtige Entscheidung — wirkt weniger klinisch, mehr „Werkstatt" als
„Software".

### Schwächen

**Die Marke hat kein Bild, nur Text.** Kein Icon, kein Symbol, keine
eigene Formensprache — nur eine fette Wortmarke plus Emoji als
Notlösung für alles, was ein Icon bräuchte. Das fällt an Stellen auf, an
denen ein Handwerker die Marke „auf einen Blick" erkennen sollte (App-Icon
auf dem Homescreen, PDF-Kopf beim Kunden) — dort steht aktuell nur „sa" in
zwei Buchstaben. Für eine App, die täglich auf dem Handy-Homescreen liegt
und deren PDFs beim Kunden landen (also das eigentliche Aushängeschild
sind), ist das eine Lücke, kein Detail.

**Emoji als durchgängiges Icon-System untergräbt das eigene
Versprechen.** Die Landingpage sagt selbst: „Kunden entscheiden auch nach
Eindruck" (aus dem Blogpost) und „Kein professionelles Layout … wirkt
nicht vertrauenswürdig". Gleichzeitig ist praktisch jedes Icon auf der
Landingpage ein Standard-Emoji, das auf jedem Gerät anders aussieht und
optisch eher nach Consumer-Chat-App als nach Werkzeug für professionelle
Angebote wirkt. Das ist der Punkt, an dem „schnell gebaut" gegen „extrem
clean" steht.

**Die Typografie-Identität ist unentschieden, nicht nur unbenannt.**
Dass die Variable `--font-syne` heißt, während tatsächlich Plus Jakarta
Sans lädt, ist mehr als ein Schönheitsfehler — es deutet darauf hin, dass
die Schriftwahl selbst nie bewusst final getroffen, sondern nur
technisch weitergereicht wurde. Plus Jakarta Sans + Inter ist eine solide,
aber auch sehr verbreitete SaaS-Schriftkombination ohne eigenen
Wiedererkennungswert.

**Die Farb-/Typografie-Tokens existieren, werden aber praktisch nicht
genutzt** (`docs/design-check.md`, DC-006: `#2C2C2C` steht 1.530× und
weitere Hex-Werte 433× hart im Code, statt die definierten Tokens zu
importieren). Für meine Rolle heißt das konkret: Eine neue CI-Farbe wäre
aktuell keine Ein-Zeilen-Änderung an einer Stelle, sondern eine
Suchen-Ersetzen-Aktion an über 1.900 Stellen. Das ist kein
Geschmacksthema, sondern eine Voraussetzung, bevor irgendein CI-Vorschlag
realistisch umsetzbar wird — siehe Rückfrage an Product Designer unten.

**Kleine Konsistenz-Ausreißer**, am Rande bemerkt (keine eigenen Punkte,
da teils schon woanders erfasst): Die Coming-Soon-Seite nutzt `#1E1E1E`
statt des Marken-Anthrazit `#2C2C2C`. Die Landingpage zeigt beim Preis
noch 29 €/Monat, obwohl Sandy sich laut `design-check.md` (DC-001) bereits
für 22 €/17 € entschieden hat — das ist Umsetzungssache bei Head of
Product Engineering, nicht bei mir, aber es ist der erste Eindruck, den
jeder potenzielle Kunde von der Marke bekommt, deshalb der Hinweis.

### Fazit in einem Satz

Die Tonalität ist bereits genau richtig und sollte Leitplanke für alles
Weitere sein; Farbe und Anthrazit-Anker sind eine brauchbare Basis; aber
bei allem Visuellen darüber hinaus (Bildzeichen, Icon-Sprache, bewusste
Typografie-Entscheidung, echte Marken-Assets) fängt die Marke praktisch
bei null an — was für eine sechs Monate alte Firma normal ist, aber genau
erklärt, warum diese Position jetzt sinnvoll ist.

### Offene Rückfrage an Product Designer (vor dem Vorschlag an Sandy)

Eingetragen in `docs/marketing-design-austausch.md` (EX-M-002): Wie
aufwändig wäre es, DC-006 (Farb-/Typografie-Tokens) im Zuge eines
CI-Vorschlags aufzuräumen, statt es als separates Aufräum-Projekt zu
behandeln? Davon hängt ab, ob ein neuer Farbvorschlag in Tagen oder
Wochen umsetzbar ist.

---

## CoS-M-001, Teil 2 — Richtungsvorschlag (Stand: 2026-08-18)

Sandy hat die Bestandsaufnahme aus Teil 1 bestätigt. Hier der begründete
Richtungsvorschlag, Moodboard-Ebene — visuelle Referenz als HTML-Datei
mitgeliefert (`moodboard.html`, an Sandy geschickt).

**Kernidee — Arbeitstitel „Gerechnet, nicht geschätzt" als Bild:**
Sofortangebot soll aussehen wie ein Präzisionswerkzeug für Profis, nicht
wie eine weitere gelbe Startup-App. Referenz-Welt: deutsche/nordische
Werkzeugmarken (präzise, mutige Einzelfarbe, keine Dekoration) und
technische Bemaßung/Messprotokoll-Ästhetik — weil genau das zum
eigentlichen Produktversprechen passt: Der Rechenweg an jeder Position ist
das eigentliche Alleinstellungsmerkmal, aber visuell bisher unsichtbar.
Die Marke soll das zeigen, nicht nur behaupten.

**Was bleibt (siehe Teil 1):** Tonalität, warmes Off-White, Anthrazit als
Anker, Logo-Umkehrsystem.

**Was sich ändern soll, mit Begründung:**

1. **Farbnuance testen, Konzept behalten.** Gelb bleibt Markenfarbe.
   Vorschlag: einen gedeckteren, wärmeren Ton testen (`#D9A400` statt
   `#F5C400`) — gleiche Familie, wirkt weniger nach Warnschild/Bauzaun und
   mehr nach lackiertem Werkzeugkoffer. Kein Bruch, eine Nuance.
2. **Typografie bewusst entscheiden statt technisch mitschleppen.**
   Überschriften auf ein Grotesk mit eigenem Charakter (Vorschlag:
   Bricolage Grotesque — dazu unten mehr) statt der nie final
   entschiedenen Plus-Jakarta-Sans-Kombi (Code-Variable heißt noch
   `--font-syne`). Inter für Fließtext bleibt — funktioniert bereits gut
   als neutraler Werkstoff.
3. **Neu, als eigenständiges Markenmerkmal: Maße in Mono-Zahlenschrift.**
   Berechnete Werte wie „43,71 m²" bekommen eine technische Zahlenschrift
   (z. B. IBM Plex Mono) statt normaler Fließtext-Zahlen — wie auf einem
   Messprotokoll. Macht „gerechnet, nicht geschätzt" sichtbar, nicht nur
   behauptet, und ist ein Detail, das kein Konkurrent hat.
4. **Emoji durch ein eigenes Line-Icon-Set ersetzen.** Motive aus der
   Bauwelt (Zollstock, Wasserwaage, Maßband) statt generischer
   Business-Icons oder System-Emoji, die auf jedem Gerät anders aussehen
   und eher nach Chat-App wirken. Betrifft Landingpage und — in Abstimmung
   mit Product Designer — perspektivisch auch das Produkt-UI.
5. **Ein echtes Logomark ergänzen.** Aktuell ist das App-Icon nur „sa" in
   zwei Buchstaben. Vorschlag: ein einfaches Bemaßungs-/Messsymbol als
   Zeichen, das eigenständig funktioniert (Homescreen, Favicon, PDF-Kopf)
   und ohne Wort „hier wird gemessen, nicht geschätzt" sagt.
6. **Keine Fotografie.** Handwerker-Stockfotos wirken fast immer
   künstlich und würden von der bereits guten App-UI-Bildsprache im
   Hero-Bereich ablenken — die bleibt der visuelle Ankerpunkt, nur die
   Icons drumherum ändern sich.

**Warum das zur Zielgruppe passt:** Ein Handwerker, der abends noch ein
Angebot rausschicken will, vertraut einer Marke, die aussieht, als würde
sie sein Handwerk verstehen (Maßsymbole, Werkzeug-Motive statt
Business-Icons) — nicht einer, die aussieht wie jede andere
Gelb-Startup-App. Und weil das Kernversprechen des Produkts ohnehin
„rechnet, statt zu schätzen" ist, macht diese Richtung Marke und Produkt
zum ersten Mal wirklich deckungsgleich, statt dass die Marke nur zufällig
gelb ist und der Text separat von Genauigkeit erzählt.

**Offen vor der Vorlage an Sandy:** Rückmeldung von Product Designer zu
technischer Umsetzbarkeit (Aufwand für Icon-Set, Mono-Zahlen im
Produkt-UI, Token-Aufräumung DC-006) — Rückfrage EX-M-003 in
`docs/marketing-design-austausch.md` eingetragen.

**Update 2026-08-18 (Sandys Feedback zum Moodboard):** Richtung insgesamt
bestätigt — „find ich super". Zwei konkrete Änderungen:

1. **Logomark überarbeitet.** Der erste Entwurf (abstrakter
   Bemaßungspfeil) war laut Sandy nicht erkennbar als Messwerkzeug: „man
   erkennt null dass das ein Messwerkzeug sein soll". Eine Handwerker-App
   soll sich sofort als solche zu erkennen geben. Neuer Entwurf: der
   klassische Gliedermaßstab/Zollstock — das eindeutigste Werkzeug-Symbol
   im deutschen Handwerk — als gestufte Linie mit Gelenkpunkten und
   Maß-Strichen (nicht mehr abstrakt-geometrisch). Aktualisiert in
   `moodboard.html`.
2. **Off-White als Text-/Symbolfarbe auf Dunkel ergänzt.** Sandys
   Hinweis: Der Hintergrund ist mal hell, mal dunkel — dafür braucht es
   auch eine bewusste helle Farbe für Text/Symbole auf dunklem Grund,
   nicht nur Reinweiß. Vorschlag: dieselbe warme Off-White-Farbe
   (`#F7F7F5`), die schon als Hintergrund auf hellen Flächen funktioniert,
   übernimmt auf dunklem Grund die Rolle von Weiß — eine Farbe, zwei
   Jobs, statt eine weitere Variable einzuführen. Betrifft Wortmarke
   („angebot" auf Dunkel), Logomark und potenziell weitere Text-auf-Dunkel-
   Stellen im Produkt (siehe Rückfrage an Product Designer).

Beides in `moodboard.html` aktualisiert (Logomark jetzt in Hell- und
Dunkel-Variante gezeigt, Off-White-Swatch ergänzt) und in EX-M-003 an
Product Designer nachgetragen.

**Update 2026-08-18, zweite Feedback-Runde (Headline-Schrift):** Sandy:
Space Grotesk sei „viel zu eckig", die Überschriftenschrift solle
„flüssiger aussehen und nicht standard, aber gleichzeitig [klar/clean]
sein". Space Grotesk raus — neuer Vorschlag: **Bricolage Grotesque**.
Begründung: weichere, fließendere Formen statt der starren, an
Monospace-Proportionen angelehnten Ecken von Space Grotesk, dabei
weiterhin ein Grotesk (passt zu Inter/Mono, kein Bruch im System) und
aktuell noch kein Font, der auf jeder zweiten SaaS-Seite auftaucht wie
Poppins oder Montserrat — also „nicht standard", ohne bewusst schräg oder
verspielt zu wirken. Inter (Text) und die Mono-Zahlenschrift (Maße)
bleiben unverändert, nur die Überschriftenschrift wechselt. Aktualisiert
in `moodboard.html`.

**Update 2026-08-18 (Rückmeldung Product Designer, Schritt 3):** In
`docs/marketing-design-austausch.md` beantwortet — Icon-Set bleibt bewusst
Marketing-Scope (nicht Produkt-UI), Mono-Zahlenschrift nur für Maße statt
Preise, Farb-/Typografie-Token-Aufräumung (DC-006) läuft bereits
unabhängig, danach ist die Farbnuance eine Ein-Zeilen-Änderung. Damit ist
der Vorschlag technisch geprüft und vollständig.

**Update 2026-08-18, dritte Feedback-Runde (Logomark v3):** Sandy: „alles
perfekt außer logo. was soll das sein??? es muss sofort erkennbar sein
dass es irgendein werkzeug ist. das erkennt kein mensch." Der
Gliedermaßstab (v2) war trotz Gelenkpunkten und Maß-Strichen zu abstrakt —
zu viele kleine Details für einen Blick auf App-Icon-Größe. Konsequenz:
Priorität von „möglichst spezifisch (misst, nicht schätzt)" auf „sofort
und ohne jeden Zweifel als Werkzeug erkennbar" verschoben — der zweite
Punkt kommt zuerst. Neuer Entwurf: ein **Hammer** als volle, kräftige
Silhouette statt dünner Linien — das universellste Werkzeug-Symbol,
funktioniert auch klein wie ein echtes Icon statt wie eine technische
Zeichnung. Gelbe Grifffläche als realistisches Detail (echte Hämmer haben
oft farbige Gummigriffe) bringt die Markenfarbe unterschwellig mit rein.
Aktualisiert in `moodboard.html`.

**Update 2026-08-18, vierte Feedback-Runde (Logomark v4):** Sandy: „Logo
ist eine KATASTROPHE! es soll ein zollstock/maßband sein aber man soll es
erkennen." Klarstellung: Sie wollte gar kein beliebiges Werkzeug (der
Hammer-Sprung war ein Missverständnis meinerseits) — der Zollstock-/
Maßband-Gedanke aus v2 war inhaltlich richtig, nur die Bauart falsch: eine
dünne, gestufte Linie mit winzigen Maß-Strichen sieht aus wie ein
technisches Diagramm, nicht wie ein Ding. Neuer Entwurf, **Logomark v4**:
das Maßband als geschlossene, kompakte Form — gelbe Bandkassette (die
Farbe, die echte Maßbänder ohnehin fast immer haben) mit diagonal
herausgezogenem Band und der charakteristischen kleinen Endlasche.
Bewusst nur drei Formen (Kassette, Band, Lasche), keine zusätzlichen
Maß-Striche mehr — das war beim letzten Versuch zu viel Detail für zu
wenig Fläche. Aktualisiert in `moodboard.html`.

**Update 2026-08-18, fünfte Feedback-Runde (Logomark v5):** Sandy: „nein
logo immer noch scheiße. EIN MASSBAND!!!! man erkennt null was das sein
soll." Fehler in v4: das „Band" war nur eine dünne Linie, kein Band.
**Logomark v5**, komplett neu: eine runde gelbe Rolle (Bandkassette von
vorn) mit einem breiten, flachen Band, das seitlich herausragt, zwei
gelben Skalenstrichen darauf und einem sichtbar breiteren Haken am Ende —
plus deutlich größer dargestellt in `moodboard.html`, damit sich das
diesmal wirklich beurteilen lässt.

**Update 2026-08-18, sechste Feedback-Runde (Logomark v6):** Sandy hat ein
Referenzbild geschickt statt weiterer Beschreibung — ein Strich-Icon:
Kassette als Kreis-Umriss, innen ein offener Bogen (Feder), flaches Band
mit Skalenstrichen wie eine kleine Leiter, am Ende ein breiterer Haken.
**Logomark v6** direkt danach nachgebaut, gleiche Bauweise, in unseren
Markenfarben (Off-White/Anthrazit Hauptlinie, Gelb als Akzent für
Feder-Bogen, einen Skalenstrich, Endhaken). Aktualisiert in
`moodboard.html`.

**Update 2026-08-18, Logomark final:** Sandy hat selbst eine polierte
finale Version geliefert (gleiche Bauweise wie v6, sauberer ausgeführt)
und freigegeben: „hier! manchmal mit text manchmal ohne. das einbauen in
moodboard dann sind wir durch." Beide Varianten (mit Wortmarke für
Header/Marketing, als reines Icon für Favicon/App-Icon) in
`moodboard.html` eingebaut. Damit ist der komplette CI-Vorschlag
(Bestandsaufnahme, Richtung, Logomark) fertig und von Sandy inhaltlich
bestätigt. Einzig offen für die spätere Umsetzung, nicht mehr Teil der
Freigabe: eine helle Logomark-Variante fürs Design-System (Product
Designer).

---

## CoS-M-001, Teil 3 — Umsetzungsplan (Stand: 2026-08-18)

Sandy hat mit „ok leg die CI fest" die Richtung final bestätigt (Chief of
Staff hat den Entscheid parallel bereits in
`docs/entscheidungen-fuer-sandy.md` gebündelt). Schritt 4 ist damit
doppelt abgesichert. Ab hier Schritt 5: was ändert sich wo, in welcher
Reihenfolge, wer macht was.

**Grundprinzip für die Reihenfolge:** Erst die technische Vorbedingung
(Token-Aufräumung DC-006), dann die günstigen Änderungen, die daran
hängen (Farbe, Typografie), parallel dazu die Teile, die unabhängig davon
schon starten können (Icon-Set, Logomark-Vektorisierung). Zuletzt die
Teile, die auf mehreren Vorstufen aufbauen (Mono-Zahlenschrift, PDF).

### Reihenfolge

1. **Token-Aufräumung DC-006** (läuft bereits, unabhängig, Product
   Designer) — Vorbedingung für Schritt 4 und 5. Kein Zutun meinerseits
   nötig, nur abwarten.
2. **Icon-Set finalisieren** (eigene Arbeit, kann sofort starten, keine
   Abhängigkeit) — die vier bis sechs Motive (Zollstock, Wasserwaage,
   Maßband, Pinsel) aus dem Moodboard als saubere, einheitliche SVGs
   ausarbeiten (gleiche Strichstärke, gleicher Winkel, gleiche Eckenradien
   wie im Moodboard-Entwurf). Ergebnis sind fertige Asset-Dateien, die ich
   an Product Designer/Engineering zur Einbindung in
   `src/components/landing/*` übergebe.
3. **Logomark vektorisieren** (eigene Arbeit + Abstimmung mit Product
   Designer, kann sofort starten) — Sandys finales Raster-Artwork als
   sauberes SVG nachzeichnen (Punkt, den Chief of Staff zu Recht
   angemerkt hat: Base64-PNG ist für Favicon/App-Icon in mehreren
   Auflösungen, PDF-Kopf und variable Einfärbung ungeeignet). Dabei direkt
   die noch fehlende **helle Logomark-Variante** für dunkle-auf-hell-
   Flächen mit erstellen, in Abstimmung mit Product Designer, wie sie ins
   Design-System passt.
4. **Farbnuance umsetzen** (Product Designer/Engineering, erst nach
   Schritt 1) — `#D9A400` statt `#F5C400` in der Token-Definition in
   `globals.css`, laut EX-M-002 dann eine Ein-Zeilen-Änderung.
5. **Typografie umsetzen** (Product Designer/Engineering, erst nach
   Schritt 1) — Headline-Font auf Bricolage Grotesque umstellen (aktuell
   Plus Jakarta Sans unter der irreführenden Variable `--font-syne`, dabei
   gleich sauber auf einen zutreffenden Namen umbenennen, z. B.
   `--font-heading`). Inter für Fließtext bleibt unverändert.
6. **Mono-Zahlenschrift für berechnete Maße** (Product Designer/
   Engineering, erst nach Schritt 1 und 5) — IBM Plex Mono nur für
   berechnete Maße (m², lfm, Stück), nicht für Preise, laut EX-M-003:
   ~1 Tag Web-Produkt-UI (Angebots-Editor, Rechenweg-Erklärungen),
   ~1 Tag separat für PDF-Einbindung (`src/lib/pdf.tsx`).
7. **Icon-Set einbinden** (eigene Arbeit für Auswahl/Platzierung,
   Umsetzung im Code mit Engineering) — Emoji auf der Landingpage durch
   das neue Set ersetzen, Marketing-/Landingpage-Scope wie mit Product
   Designer geklärt (EX-M-003), Produkt-UI bleibt bei Lucide.
8. **Logomark einbinden** (eigene Arbeit + Abstimmung mit Product
   Designer) — SVG aus Schritt 3 in Header/Wortmarken-Umgebung, Favicon
   (`icon.tsx`), App-Icon (`apple-icon.tsx`, `manifest.ts`) und
   PDF-Kopf einsetzen; dunkle Variante direkt einsatzbereit, helle
   Variante sobald aus Schritt 3 fertig.
9. **Off-White als Text-/Symbolfarbe auf Dunkel** (eigene Arbeit für
   Marketing-/Landingpage-Flächen, ab sofort möglich) — in Wortmarke und
   Logomark bereits umgesetzt (siehe `moodboard.html`), auf weitere
   dunkle Marketing-Flächen ausrollen. **Offen:** EX-M-004 (Relevanz fürs
   Produkt-UI) — Antwort von Product Designer steht noch aus, blockiert
   diesen Schritt nicht, da reine Marketing-/Landingpage-Entscheidung
   unabhängig vom Produkt.
10. **Abschluss-Check** — fertige Umsetzung gegen `moodboard.html` prüfen
    (Farben, Typografie, Icons, Logomark hell/dunkel), Favicon/App-Icon in
    echten Auflösungen ansehen, Kontrast Off-White-auf-Dunkel und
    Anthrazit-auf-Hell/Off-White gegenchecken.

### Eigene Arbeit vs. Abstimmung

- **Komplett eigene Arbeit:** Icon-Set-Gestaltung (Schritt 2),
  Logomark-Vektorisierung als Entwurf (Schritt 3, Feinschliff mit Product
  Designer), Auswahl/Platzierung der Icons und Farbe auf Marketing-Flächen
  (Schritt 7 Konzept, Schritt 9).
- **Abstimmung mit Product Designer nötig, bevor es in Code geht:**
  Logomark-Feinschliff für Design-System (Schritt 3), helle
  Logomark-Variante (Schritt 3), Einbindung Favicon/App-Icon/PDF-Kopf
  (Schritt 8), Klärung EX-M-004 (Schritt 9).
- **Reine Product-Designer-/Engineering-Umsetzung, ich liefere nur die
  Vorgabe:** Token-Aufräumung (Schritt 1, läuft bereits ohne mich),
  Farbnuance (Schritt 4), Headline-Font-Wechsel (Schritt 5),
  Mono-Zahlenschrift (Schritt 6), Code-Einbindung Icon-Set (Schritt 7).

### Governance-Hinweis

Diese Reihenfolge ist der Umsetzungsplan, keine neue Freigabe-Entscheidung
— die CI-Richtung selbst ist mit Sandys „ok leg die CI fest" final
bestätigt. Sollte während der Umsetzung eine echte Abweichung vom
freigegebenen Moodboard nötig werden (z. B. weil sich ein technischer
Grund dagegen stellt), geht das zurück an Sandy, nicht in
Eigenregie mit Product Designer entschieden.

---

## CoS-M-001 — CI-Guide (Referenz-Dokument, Stand: 2026-08-19)

Auf Sandys Wunsch („erstell vollständige detaillierte CI mit allen Infos
für das Business Sofortangebot") die gesamte bestätigte CI in einem
eigenständigen Referenz-Dokument gebündelt: `docs/ci-guide.html`. Fasst
alles aus Teil 1–3 dieser Datei visuell und geschäftlich zusammen — Business-
Eckdaten (Zielgruppe Maler/Bodenleger/Innenausbau, Preismodell 22 €/17 €,
Kernversprechen Rechenweg-an-jeder-Position), Positionierung, Tonalität mit
So/Nicht-so-Beispielen, Logo (Lockup + Icon-only, Schutzraum, No-Gos),
Farbpalette mit Einsatzregeln, Typografie-Spezimen, Icon-Sprache,
Anwendungsbeispiele (Visitenkarte, PDF-Kopf, App-Icon) und eine
Governance-Seite. Als persistentes Artefakt bei Sandy abgelegt und als
Datei ins Repo committed.

**Verhältnis zu den anderen Dateien:** `docs/marketing-ci.md` (diese Datei)
bleibt die vollständige Arbeits-/Entscheidungshistorie mit allen
Feedback-Runden. `docs/moodboard.html` bleibt das visuelle Arbeitsdokument
mit Vorher/Nachher-Vergleichen. `docs/ci-guide.html` ist neu die
aufgeräumte, präsentable Endfassung ohne Verlaufsrauschen — für Weitergabe
an Dritte (Agenturen, Druckerei, neue Team-Mitglieder) gedacht, nicht für
die laufende Abstimmung.

---

## CoS-M-001 — Design System (technisches Pendant, Stand: 2026-08-31)

Product Designer hat auf Basis von `docs/ci-guide.html` ein vollständiges
technisches Design System gebaut (Tokens, Typo-Skala, Spacing/Radien/
Schatten, Bewegung, 25 Komponenten, zwei UI-Kit-Vorschläge) und Sandy hat
es mir direkt zugeschickt: „das soll deine Basis für alles Zukünftige
sein". Gesichert unter `docs/design-system.pdf`.

**Verhältnis zu `ci-guide.html`:** `ci-guide.html` bleibt die
markennahe, geschäftliche Zusammenfassung (Business, Positionierung,
Tonalität-Beispiele, Logo/Farbe/Typo auf Konzept-Ebene). `design-system.pdf`
ist die technische Vertiefung darauf — exakte Token-Werte, Skalen,
Komponenten-Zustände, UI-Kits. Für alles, was ich ab jetzt baue (Social
Posts, Landingpage-Feedback, künftige Marketing-Assets), gilt: Farben/
Typo/Spacing aus `design-system.pdf` exakt übernehmen statt aus dem
Gedächtnis nachzubauen.

**Zwei offene Punkte, die nur Sandy entscheiden kann** (Details in
`docs/chief-of-staff-marketing-todos.md`, CoS-M-004): ob die im PDF neu
festgelegte Regel „förmliches Sie, nie du" tatsächlich gewollt ist (steht
im Widerspruch zum bisherigen, durchgehend geduzten Produkt und allen
bisherigen Social-Texten), und die Freigabe der neuen Funktionsfarben
(`--state-success`/`--state-danger`), die im PDF selbst als ungeklärt
markiert sind. Bis zur Klärung baue ich nichts Neues auf „Sie" auf.

**Entschieden (Sandy, 2026-08-31, CoS-M-004): Ansprache ist immer „du".**
Die Regel „förmliches Sie — nie du" im Design-System-PDF war ein Fehler und
gilt nicht — Produkt, Landingpage, Social Media, E-Mails: durchgehend „du".
Verbindlich, damit die Fehlannahme nicht wieder auftaucht.

**Entschieden (Sandy, 2026-08-31, CoS-M-005): Haupt-Slogan ist „Aufmaß
fertig. Angebot fertig."** — überall, wo ein kalter Kontakt zuerst landet
(Hero, Bio, Flyer). „Gerechnet, nicht geschätzt." bleibt als sekundäre
Differenzierungszeile (Subline, einzelne Posts), nicht mehr als Erstkontakt.

**Bestätigt, kein Klärungsbedarf:** Farb-Token-Aufräumung (DC-006) ist für
Farbe abgeschlossen — `#F5C400` ist offiziell `--legacy-yellow`, `#D9A400`
ist der einzig gültige Wert. Vektor-Logo und Marketing-Icon-Set als echte
SVGs sind jetzt priorisiert (Product Designer nutzt aktuell Lucide/Raster
als Platzhalter und wartet sichtbar darauf).

---

*Nächster Schritt: Handoff an Product Designer über
`docs/marketing-design-austausch.md` (EX-M-005) — Umsetzungsplan mit
Reihenfolge und Zuständigkeiten übergeben, damit Schritt 1 (läuft) und
Schritt 3/4/5/6 sauber ineinandergreifen. CoS-M-001 ist damit auf meiner
Seite inhaltlich und planerisch abgeschlossen; laufende Umsetzung wird ab
jetzt über EX-M-005 und die jeweiligen Code-Punkte in
`docs/design-check.md` nachverfolgt, nicht mehr über diese Datei.*
