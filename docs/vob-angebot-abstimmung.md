# VOB & Angebotserstellung — Abstimmung

**Head of Legal & Compliance ↔ Prüfmeister ↔ Head of Product Engineering ↔
Product Designer**

Angelegt am 2026-09-01 auf Sandys ausdrückliche Bitte: das VOB-Thema und die
Angebotserstellung sollen fachlich und rechtlich lückenlos passen. Das ist der
EINE Ort, an dem steht, ob das, was die Engine rechnet und aufs Angebot
schreibt, den Abrechnungsregeln des Gewerks entspricht.

**Warum eine eigene Datei und nicht `pruefmeister-testfaelle.md`?** Der
Prüfmeister prüft: *rechnet das Tool das, was ich gesagt habe?* Diese Datei
prüft eine Ebene darunter: *ist die Regel, nach der gerechnet wird, überhaupt
die richtige?* Das sind zwei verschiedene Fragen. Ein Fall kann bei PM-XXX
grün sein (Ist = Soll) und hier trotzdem rot, weil das Soll selbst nicht der
Norm entspricht.

## Wer bringt was ein

| Rolle | Beitrag |
|---|---|
| **Head of Legal & Compliance** | Was die Norm sagt, ob sie überhaupt gilt, was gegenüber Verbrauchern hält, was aufs Angebot muss |
| **Prüfmeister** | Was in der Branche tatsächlich üblich ist — die Norm ist das eine, die gelebte Praxis das andere. Wo beide auseinandergehen, ist das eine Entscheidung, keine Rechenfrage |
| **Head of Product Engineering** | Was die Engine tatsächlich rechnet, was ein Fix kostet, welche Golden-Tests betroffen sind |
| **Product Designer** | Wie eine Abrechnungsregel dem Handwerker und dem Endkunden erklärt wird, ohne das Angebot zu überladen |

**Ablauf:** Ich (Legal) trage Befunde ein. Wer etwas umsetzt oder fachlich
widerspricht, hängt ein **Update** direkt unter den Befund und aktualisiert die
Status-Zeile. Bei Befunden, die Geld auf dem Kundenangebot bewegen, bitte
NICHT stillschweigend umsetzen — erst hier kurz gegenzeichnen, dann bauen.

Jeder Punkt hat eine feste ID (**VOB-XXX**).

**Status-Zeichen:** ✅ geklärt & umgesetzt · 🟡 umgesetzt, noch nicht
nachgeprüft · ❌ offen, bestätigter Befund · 🔵 Entscheidung von Sandy nötig ·
🟠 fachliche Rückmeldung vom Prüfmeister nötig, bevor irgendwer baut ·
⏳ wartet auf Vorbedingung.

**Datei-Sicherheit:** Neue Einträge ans Dateiende anhängen, vor die
Endmarkierung. Nicht die ganze Datei neu schreiben. Hintergrund: CoS-013 in
`chief-of-staff-todos.md`.

---

## Wichtiger Vorbehalt zur Quellenlage — bitte einmal lesen

Der Originaltext von DIN 18363 und DIN 18365 ist kostenpflichtig (DIN Media /
Beuth) und war für mich nicht abrufbar. **Alles unten steht auf
Sekundärquellen** — Fachpresse, Innungs-PDFs, Betriebe, die den Normtext für
ihre Kunden zitieren. Ich habe wo möglich mehrfach gegengeprüft und markiere
jeden Punkt mit seiner Belegstärke:

- **[belegt]** — mehrere unabhängige Quellen, wörtlicher Normtext, konsistent
- **[unsicher]** — nur eine Quelle, oder Quellen widersprechen sich
- **[Praxis]** — Fachkonsens, aber kein Normzitat
- **[Einschätzung]** — meine juristische Bewertung, kein Normtext

**Das führt direkt zu VOB-011: wir sollten die beiden Normen kaufen.** Rund
120–160 € für DIN 18363:2019-09 und DIN 18365:2019-09. Gemessen daran, dass
diese beiden Dokumente bestimmen, wie jedes Angebot im Produkt gerechnet wird,
ist das der billigste Posten im ganzen Projekt. Ohne sie arbeiten wir bei
mehreren der Punkte unten mit Wahrscheinlichkeiten statt mit Gewissheit — und
bei VOB-003 kann uns das konkret in die falsche Richtung schicken.

---

## Normlage kompakt — damit niemand nochmal recherchieren muss

**Gültige Fassungen:** DIN 18363:2019-09 (Maler- und Lackierarbeiten) und
DIN 18365:2019-09 (Bodenbelagarbeiten). Die VOB/C-Gesamtausgabe 2023 hat beide
ATV nicht neu gefasst. Bei DIN 18363 wurde 2019 gegenüber 2016 die Nummer
5.2.3 gestrichen, alles danach verschiebt sich um eins — deshalb kursieren
zwei Nummerierungen. [belegt]

**Der Satz, den man sich merken muss:** Die VOB/C gilt **nicht von selbst**.
Sie ist AGB und muss in den Vertrag einbezogen werden (§ 305 Abs. 2 BGB). Ohne
Einbeziehung gilt der reine BGB-Werkvertrag — und dort wird die tatsächlich
bearbeitete Menge geschuldet, nicht die nach VOB gerechnete. Gegenüber
Verbrauchern gibt es zusätzlich Rechtsprechung, die die Übermessung kippt
(OLG Stuttgart 21.02.2008, 2 U 84/07 — Volltext habe ich nicht eingesehen).
Details in `docs/legal-001-bestandsaufnahme.md`, Abschnitt B1. [Einschätzung]

**DIN 18363 — Abrechnung (Abschnitt 5):**
- Übermessen werden Aussparungen mit **Einzelgröße bis 2,5 m²** — je Öffnung
  einzeln, nicht in Summe. Für Aussparungen **in Böden** gilt **0,5 m²**.
  Maßgeblich sind die kleinsten Maße der Aussparung. [belegt]
- **Leibungen und beschichtete Rückflächen von Nischen werden gesondert
  gerechnet — „unabhängig von ihrer Einzelgröße".** Also auch dann, wenn die
  zugehörige Öffnung übermessen wurde. [belegt, aber siehe VOB-003]
- Unterbrechungen (Vorsprünge, Pfeiler, Stützen, Unterzüge, Gesimse) mit
  Einzelbreite **< 30 cm** werden übermessen — unabhängig davon, ob sie
  behandelt werden. Leisten und Sockel **< 10 cm Höhe** ebenfalls. [belegt]
- Bei Abrechnung nach Längenmaß: Unterbrechungen **< 1 m Einzellänge** werden
  übermessen. [belegt]
- Fenster, Türen, Trennwände werden **je beschichtete Seite nach Fläche**
  gerechnet — die Norm kennt keine Stück-Pauschale. [belegt]
- Grundlage der Flächenermittlung ist das **Rohbaumaß** (bis zu den
  ungeputzten, unbekleideten Bauteilen); nur wenn das nicht ermittelbar ist,
  die behandelte Fläche. [belegt]

**DIN 18363 — Neben- vs. Besondere Leistungen (Abschnitt 4):**
- **Nebenleistung, also im Einheitspreis enthalten:** loses Abdecken zum Schutz
  von Bauteilen und Einrichtung (4.1.3) · Reinigen des Untergrunds allgemein
  (4.1.6) · bis zu 5 Schalter-/Steckdosenabdeckungen je Raum ab- und
  anbringen (4.1.4) · Gerüste, solange die zu bearbeitende Fläche **nicht
  höher als 3,50 m** liegt (4.1.1) · Zwischenschliff (4.1.8) · Ausbessern
  einzelner kleiner Schäden (4.1.7). [belegt]
- **Besondere Leistung, also gesondert abrechenbar:** besonderer Schutz durch
  **Abkleben** von Fenstern, Türen, Böden (4.2.11) · Reinigen von **grober**
  Verschmutzung (4.2.10) · Gerüste **über 3,50 m** (4.2.5) · Entfernen von
  Altbeschichtungen und Wandbekleidungen (4.2.12) · umfangreiche
  Untergrundvorbereitung (4.2.1). [belegt]
- **Die Trennlinie, die im Produkt zählt:** *Abdecken* ist drin, *Abkleben*
  ist extra.

**DIN 18365 — Bodenbelagarbeiten:**
- Aufmaß bis zu den begrenzenden Bauteilen, also **Wand zu Wand**. [unsicher]
- Sockelleisten nach tatsächlicher Länge; Unterbrechungen (Türdurchgänge)
  **bis 1,00 m** werden durchgemessen, nicht abgezogen. [belegt, zwei
  unabhängige Quellen]
- Nischen werden unabhängig von ihrer Größe gesondert gerechnet. [unsicher]
- **Schwellenwert für Öffnungen: ungeklärt.** Eine Quelle nennt 0,1 m², eine
  andere 0,5 m² bzw. 2,5 m². Siehe VOB-008. [unsicher]
- **Verschnitt ist in DIN 18365 keine Abrechnungsgröße.** Abgerechnet wird die
  verlegte Fläche; der Verschnitt gehört als Materialanteil in den
  Einheitspreis. Das ist Fachkonsens über mehrere unabhängige Quellen, aber
  kein von mir eingesehener Normwortlaut. Siehe VOB-001. [Praxis]

---

## Stand auf einen Blick

| ID | Thema | Adressat | Status |
|---|---|---|---|
| VOB-001 | Verschnitt wird auf die **abgerechnete Menge** aufgeschlagen statt in den Einheitspreis | Prüfmeister → dann Sandy | 🟠 |
| VOB-002 | **Drei verschiedene Verschnittsätze** im Code — 5 %, 10 %, 12 % | Head of Product Engineering | ❌ |
| VOB-003 | Geplante „VOB-Feinheit" zu Leibungen zeigt vermutlich in die **falsche Richtung** — bitte nicht bauen | Head of Product Engineering | ❌ |
| VOB-004 | Übermessungshinweis erreicht das Kunden-PDF nicht (= G5 aus CoS-L-001) | Head of Product Engineering + Product Designer | ❌ |
| VOB-005 | **Nebenleistungen** werden als eigene Positionen berechnet (Boden/Möbel abdecken) | Prüfmeister → dann Sandy | 🟠 |
| VOB-006 | Höhenzuschlag: drei verschiedene Schwellen im Produkt (2,80 / 3,00 / 4,00 m), Norm sagt 3,50 m | Prüfmeister + Head of Product Engineering | 🟠 |
| VOB-007 | Die Zeile „Normgrundlagen" behauptet VOB-Konformität, die an mehreren Stellen nicht gegeben ist | Product Designer + Legal | ❌ |
| VOB-008 | DIN-18365-Schwellenwert für Bodenöffnungen ungeklärt | Legal (nach VOB-011) | ⏳ |
| VOB-009 | Türen/Fenster nach Stück statt nach Fläche | Prüfmeister | 🟠 |
| VOB-010 | Zuschlags-Einheiten: Prozent im Titel, Euro im Preis (14 Einträge) | Head of Product Engineering | ❌ |
| VOB-011 | **Normtexte kaufen** — Grundlage für VOB-001, -003, -008 | Sandy (Freigabe ~150 €) | 🔵 |
| VOB-012 | Türbreiten werden von der Sockelleistenlänge abgezogen — Norm sagt: bis 1 m durchmessen | Head of Product Engineering | ❌ |

---

## VOB-001 — Verschnitt landet in der abgerechneten Menge, nicht im Einheitspreis

**Status:** 🟠 fachliche Rückmeldung vom Prüfmeister nötig, bevor irgendwer baut

**Was der Code tut** (`src/lib/mengen/gewerke/boden.ts`):

```js
positionen.push({
  beschreibung: `${label} verlegen${verschnittSuffix} — ${name}`,
  menge: round2(flaeche * (1 + verschnitt)),
  einheit: 'm²',
  berechnungsweg: `${flaeche} m² + ${pct}% Verschnitt`,
})
```

Bei 20 m² Wohnzimmer und 5 % steht auf dem Angebot **21,00 m²**. Der Endkunde
bezahlt 21 m², verlegt wurde auf 20 m². Dasselbe Muster steht als Anweisung im
GPT-Prompt in `src/app/api/angebot-verfeinern/route.ts`:
„Fliesen inkl. 12% Verschnitt: Fläche × 1,12 × Preis" und „GK-Platten inkl. 10%
Verschnitt: m² × 1,10 × 8€/m²".

**Warum das ein Problem ist.** Verschnitt ist nach durchgehendem Fachkonsens
**Kalkulationssache, nicht Abrechnungssache** — er gehört in den
Materialkostenanteil des Einheitspreises, nicht als Mengenaufschlag auf die
Aufmaßfläche. Abgerechnet wird nach VOB die eingebaute Leistung. [Praxis]

Rechtlich ist das die gleiche Konstruktion wie bei der Übermessung — der Kunde
zahlt Fläche, die es nicht gibt — nur **schwächer abgesichert**: Für die
Übermessung gibt es immerhin eine Norm, auf die man sich berufen kann, wenn man
sie wirksam einbezogen hat. Für einen Verschnittzuschlag auf die
Abrechnungsmenge gibt es keine. Gegenüber einem Verbraucher ist er damit sehr
schwer zu verteidigen. [Einschätzung]

**Was ihr richtig gemacht habt, und das ist nicht wenig:** Der Verschnitt steht
**im Positionstitel** („Vinyl verlegen inkl. 5% Verschnitt"), und der Titel
landet anders als `annahmen` und `berechnungsweg` tatsächlich im PDF. Der Kunde
wird also nicht getäuscht — er sieht, was passiert. Das ist der entscheidende
Unterschied zur Übermessung (VOB-004), wo er es eben nicht sieht. Es macht die
Methode nicht normkonform, aber es nimmt ihr die Schärfe.

**Die saubere Lösung, und sie kostet den Betrieb nichts:** Menge = verlegte
Fläche, Verschnitt in den Einheitspreis. Aus

> Vinyl verlegen inkl. 5% Verschnitt · 21,00 m² · 45,00 € = 945,00 €

wird

> Vinyl verlegen · 20,00 m² · 47,25 € = 945,00 €

Gleicher Endbetrag, gleiche Marge, aber die Menge auf dem Angebot ist die
Menge, die der Kunde nachmessen kann. Das ist genau die Sorte Änderung, die
juristisch viel und wirtschaftlich nichts kostet.

**Bevor das jemand baut, brauche ich den Prüfmeister.** Meine Frage, offen
gestellt: **Ist es in der Boden-Branche üblich, den Verschnitt als Menge
auszuweisen — oder ist das etwas, worüber sich Kunden regelmäßig beschweren?**
Ich sehe die Rechtslage, aber nicht die Praxis. Wenn Handwerker es gewohnt
sind, den Verschnitt sichtbar zu machen, weil es das Materialrisiko erklärt,
dann ist der Umbau in den Einheitspreis vielleicht ein Verlust an
Nachvollziehbarkeit, den man anders lösen sollte — etwa als erklärender
Untertitel statt als Mengenaufschlag. Sag mir, was du draußen siehst.

**Danach:** Das ist eine Entscheidung für Sandy, weil es jedes Bodenangebot
optisch verändert.

---

## VOB-002 — Drei verschiedene Verschnittsätze im selben Produkt

**Status:** ❌ offen — Head of Product Engineering

Beim Nachverfolgen von VOB-001 bin ich darüber gestolpert. Der Verschnittsatz
steht an vier Stellen und hat drei verschiedene Werte:

| Ort | Satz | Wirkung |
|---|---|---|
| `boden-normalisierer.ts` → `standardVerschnitt()` | **5 %** für Laminat, Vinyl, Linoleum, Parkett, Diele; **0 %** für Kork und Teppich | rechnet die Menge |
| `mengen/bewertung.ts` Zeile 94 | **„Belagverschnitt: 10 % (bei Diagonalverlegung 15 %)"** | steht als Annahme im Angebot |
| `api/angebot-verfeinern/route.ts` | **12 %** Fliesen (Z. 34), **10 %** GK-Platten (Z. 42), **10 %** Vinyl im Beispiel-JSON (Z. 85) | Anweisung an GPT |
| `mengen/aufnahme-hinweise.ts` Zeile 13 | rechnet `menge / 1.1` zurück, sucht dafür `/10\s*%\s*verschnitt/i` | greift nicht mehr, weil die Engine „5% Verschnitt" schreibt |

**Das Konkrete:** Die Engine rechnet 5 %, und in denselben Angebotsdaten steht
als Annahme, es seien 10 % gewesen. Der Handwerker liest eine Zahl, die
Rechnung benutzt eine andere. Wenn ein Endkunde später nachrechnet, findet er
genau diesen Widerspruch — und dann geht es nicht mehr um 5 % Material, sondern
um die Glaubwürdigkeit des ganzen Angebots.

Die Rückrechnung in `aufnahme-hinweise.ts` ist derzeit harmlos, weil vorher der
`berechnungsweg` gematcht wird. Sie ist aber eine Falle für den Nächsten, der
dort etwas ändert.

**Bitte:** einen Wert, eine Stelle. `standardVerschnitt()` ist die richtige —
den Text in `bewertung.ts` und den GPT-Prompt daraus speisen statt sie
danebenzuschreiben. Der Fischgrät-/Diagonal-Aufschlag (15 %) darf bleiben, wo
er ist, solange er auch nur aus einer Quelle kommt.

**Hinweis für den Fall, dass VOB-001 umgesetzt wird:** Dann wandert der Satz
ohnehin in die Preisbildung. Trotzdem sollte er vorher konsolidiert werden —
sonst zieht man drei verschiedene Werte in die neue Struktur mit.

---

## VOB-003 — Die geplante „VOB-Feinheit" zu Leibungen zeigt vermutlich in die falsche Richtung

**Status:** ❌ offen — Head of Product Engineering. **Bitte nicht bauen.**

In `src/lib/mengen/gewerke/vob-uebermessung.ts` steht im Kommentarkopf:

> „Bewusst NICHT Teil dieser Funktion: die VOB-Regel besagt zusätzlich, dass
> Leibungen übermessener (nicht abgezogener) Öffnungen nicht separat vergütet
> werden. `daten.leibungen[]` hat aktuell keine Verknüpfung zu einzelnen
> Fenster-/Tür-Objekten (siehe maler.ts) — diese Verfeinerung ist bewusst
> zurückgestellt, nicht Teil des aktuellen Fixes."

Derselbe Punkt steht als Punkt 3 unter „Was bewusst NICHT angefasst wurde" in
`pruefmeister-testfaelle.md`, Abschnitt vom 21.08.

**Nach meiner Recherche ist die Regel genau umgekehrt.** DIN 18363, Abschnitt
5.2.3 der Fassung 2019 (= 5.2.4 der Fassung 2016), im Wortlaut aus zwei
unabhängigen Sekundärquellen:

> „Beschichtete Rückflächen von Nischen sowie Leibungen werden **unabhängig
> von ihrer Einzelgröße** mit ihren Maßen **gesondert gerechnet**."

„Unabhängig von ihrer Einzelgröße" heißt gerade: es spielt keine Rolle, ob die
zugehörige Öffnung unter oder über der 2,5-m²-Schwelle liegt. Die Leibung wird
so oder so gerechnet. [belegt, zwei Quellen — aber siehe Vorbehalt unten]

Das ergibt auch wirtschaftlich Sinn, wenn man beide Regeln zusammen liest: Die
Übermessung gleicht aus, dass **um** die Öffnung herum mehr Kantenarbeit
anfällt. Die Leibung ist die **Fläche in der Öffnung** — eine andere Fläche,
und tatsächlich beschichtet. Sie separat zu rechnen ist keine
Doppelvergütung.

**Was das für uns bedeutet:** `maler.ts` Zeile 606 ff. berechnet Leibungen
bereits als eigene Positionen nach abgewickelter Fläche — also, soweit ich das
beurteilen kann, **schon jetzt richtig**. Die geplante „Verfeinerung" würde
korrektes Verhalten kaputt machen und dem Handwerker Geld wegnehmen, das ihm
nach der Norm zusteht.

**Vorbehalt, und der ist mir wichtig:** Beide Quellen sind Sekundärquellen und
sie widersprechen sich in einem Detail — die eine spricht davon, dass Leibungen
nach **Flächenmaß** gerechnet werden, die andere nach **Längenmaß** getrennt
nach Bauart. Für die Frage „gesondert oder nicht" sind beide eindeutig, für die
Frage „wie gemessen" nicht. Der Code rechnet nach Fläche
(`anz × Umfang × Tiefe`). Ob das die richtige Einheit ist, kann ich ohne den
Normtext nicht sagen.

**Konkrete Bitte:**
1. Den Backlog-Punkt aus dem Kommentarkopf und aus `pruefmeister-testfaelle.md`
   **nicht umsetzen**, sondern zunächst als „strittig, siehe VOB-003" markieren.
2. Nach VOB-011 (Normtext) kläre ich Wortlaut und Einheit abschließend und
   trage das Ergebnis hier ein.
3. Bis dahin bleibt das Verhalten wie es ist — das ist die sichere Variante.

**An den Prüfmeister:** Wie ist es in der Praxis? Rechnet ein Maler die
Fensterleibung bei einem normalen Fenster mit ab, oder ist das etwas, das man
üblicherweise „mitmacht"? Deine Antwort ist für mich mindestens so wichtig wie
der Normtext, weil sie zeigt, was ein Endkunde erwartet.

---

## VOB-004 — Der Übermessungshinweis erreicht das Kunden-PDF nicht

**Status:** ❌ offen — Head of Product Engineering + Product Designer
**Identisch mit G5** aus `docs/legal-001-bestandsaufnahme.md`; hier steht die
fachliche Seite, dort die rechtliche.

`vobHinweistext()` erzeugt bereits genau den richtigen Satz:

> „2 Öffnungen bis 2,5 m² Einzelgröße nicht abgezogen (3,09 m², VOB/C
> DIN 18363 Übermessung)"

Er landet im `annahmen`-Array und wird in `AngebotDetail.tsx` (Zeile 2648)
angezeigt — also **nur dem Handwerker in der App**. `pdf.tsx` rendert als
Positionsuntertitel ausschließlich `item.description`, und die kommt aus
`waehleUntertitel()`. Auch `berechnungsweg` bleibt in der App.

**Der Endkunde liest also „Wandfläche streichen — 50,00 m²", misst 46,64 m²
nach und findet keine Erklärung.** Genau daraus entsteht Streit, und die
Erklärung liegt zwei Zeilen entfernt.

**Warum das mehr ist als Kosmetik:** Ohne den Hinweis ist die VOB/C an dieser
Stelle nicht einbezogen (§ 305 Abs. 2 BGB braucht einen ausdrücklichen Hinweis
und die zumutbare Möglichkeit der Kenntnisnahme). Ohne Einbeziehung gilt der
BGB-Werkvertrag, und dort schuldet der Kunde die tatsächlich bearbeitete
Fläche. Der Handwerker steht dann mit einer Mehrforderung da, die er nicht
begründen kann.

**Vorschlag für die Formulierung** (Freigabe durch Sandy nötig, → S-2 in
`entscheidungen-fuer-sandy.md`), in normaler Schriftgröße direkt unter der
Position, nicht in der Fußzeile:

> *Abrechnung nach VOB/C (DIN 18363): Fenster- und Türöffnungen bis 2,5 m²
> Einzelgröße werden nicht abgezogen, weil der Mehraufwand für Kanten und
> Leibungen die eingesparte Fläche ausgleicht. 2 Öffnungen (3,09 m²) sind
> entsprechend in der Fläche enthalten.*

**An den Product Designer:** Das ist Vertrauensarbeit, keine Rechtsklausel. Der
Satz erklärt dem Endkunden, warum die Rechnung fair ist — richtig platziert
verkauft er, statt zu verunsichern. Wie bekommen wir ihn aufs Blatt, ohne die
Positionsliste zu überladen? Denkbar wäre auch eine Fußnotenziffer an der
Menge und der Erklärtext einmal am Ende, statt bei jeder betroffenen Position.

**Verwandter Fund, PM-031:** Die „So gerechnet"-Zeile im Fassaden-Chip zeigt
eine andere, VOB-widrige Rechnung als die tatsächlich abgerechnete Position
(46,64 m² vs. 50,00 m²). Der Prüfmeister hat das als kosmetisch eingeordnet,
und für die Abrechnung stimmt das. Rechtlich ist es das nicht: zwei
widersprüchliche Zahlen für dieselbe Fläche im selben Werkzeug sind im
Streitfall der Beleg dafür, dass die höhere nicht plausibel erklärt ist. Ich
unterstütze den Fix ausdrücklich.

---

## VOB-005 — Nebenleistungen werden als eigene Positionen berechnet

**Status:** 🟠 fachliche Rückmeldung vom Prüfmeister nötig

DIN 18363 trennt in Abschnitt 4 zwischen **Nebenleistungen** (im Einheitspreis
enthalten, nicht extra abrechenbar) und **Besonderen Leistungen** (extra
abrechenbar). Die Trennlinie verläuft hier: **Abdecken ist drin, Abkleben ist
extra.** [belegt]

Abgleich mit `default-prices.ts` und mit dem, was `maler.ts` automatisch
erzeugt:

| Position im Produkt | Preis | DIN 18363 | Bewertung |
|---|---|---|---|
| `Boden abdecken (Abdeckvlies)` | 1,20 €/m² | 4.1.3 loses Abdecken = **Nebenleistung** | ❌ eigentlich im Einheitspreis enthalten |
| `Möbel abdecken mit Folie` | 1,50 €/m² | 4.1.3 = **Nebenleistung** | ❌ dito |
| `Boden schützen` (auto durch `maler.ts`) | aus Katalog | 4.1.3 = **Nebenleistung** | ❌ dito, und sie wird automatisch erzeugt |
| `Sockelleisten abkleben` | 0,80 €/lfdm | 4.2.11 Abkleben = **Besondere Leistung** | ✅ korrekt eigene Position |
| `Abkleben Fenster-/Türrahmen` | 8,00 €/Stück | 4.2.11 | ✅ korrekt |
| `Abkleben Schalter / Steckdosen` | 3,00 €/Stück | 4.1.4 regelt nur *Abnehmen/Anbringen* von bis zu 5 Stück je Raum als Nebenleistung; Abkleben ist etwas anderes | 🟠 Grenzfall |
| `Zuschlag stark verschmutzter Untergrund` | 3,00 €/m² | 4.2.10 grobe Verschmutzung = **Besondere Leistung** | ✅ korrekt |
| `Endreinigung Fenster / Böden` | 45,00 €/Std | 4.1.6 betrifft Reinigen des *Untergrunds*, nicht die Endreinigung | ✅ vertretbar |

**Was das praktisch heißt.** Ein Angebot, das oben „Normgrundlagen: VOB/C
DIN 18363" ausweist und weiter unten „Boden abdecken 20 m² × 1,20 €" als eigene
Position führt, widerspricht sich. Ein Endkunde, der die Norm liest — und die
Zeile lädt ihn dazu ein — findet dort, dass das im Preis enthalten sein müsste.
24 € sind kein Drama, aber es ist der Punkt, an dem das Angebot angreifbar
wird, und zwar an einer Stelle, wo es das nicht müsste. [Einschätzung]

**Wichtig, damit das nicht falsch ankommt:** Das ist **keine Preisfrage**. Es
gibt im Bauhandwerk keine verbindliche Preisverordnung, der Betrieb darf
kalkulieren, was er will. Es ist eine **Struktur**frage: dieselbe Leistung darf
nicht einmal im m²-Preis stecken und einmal als eigene Zeile auftauchen.

**An den Prüfmeister, und das ist die entscheidende Frage:** Wie machen es
Malerbetriebe tatsächlich? Meine Vermutung ist, dass „Boden abdecken" als
sichtbare Position durchaus üblich ist, weil sie dem Kunden zeigt, dass
sorgfältig gearbeitet wird — und dass der m²-Preis fürs Streichen dann
entsprechend knapper kalkuliert ist. Wenn das so ist, ist die Position nicht
falsch, sondern nur schlecht begründet, und die Lösung ist eine andere als bei
VOB-001: nicht entfernen, sondern nicht mehr „VOB/C" darüberschreiben (→
VOB-007). Sag mir, was du kennst.

---

## VOB-006 — Drei verschiedene Höhenschwellen, und keine davon ist die der Norm

**Status:** 🟠 Prüfmeister + Head of Product Engineering

| Ort | Schwelle | Einheit |
|---|---|---|
| `default-prices.ts` | `Zuschlag hohe Räume (>2,80 m bis 4 m)` | 2,50 €/m² |
| `default-prices.ts` | `Zuschlag hohe Räume (>4 m)` | 5,00 €/m² |
| `vollstaendigkeit/maler-extras.ts` (`SCHWELLE`) | `Erschwerniszuschlag Raumhöhe > 3m` | 15 % |
| `default-prices.ts` Zeile 3442 | `Erschwerniszuschlag Raumhöhe > 3m` | % |
| DIN 18363 4.1.1 / 4.2.5 | Gerüst ist Nebenleistung **bis 3,50 m**, Besondere Leistung darüber | — |

Drei Schwellen (2,80 / 3,00 / 4,00 m) und zwei Einheitensysteme (€/m² und %)
für dieselbe Erschwernis. Welcher Zuschlag greift, hängt davon ab, welcher Weg
die Position erzeugt hat.

**Der normbezogene Teil:** Zwischen 2,80 m und 3,50 m berechnet das Produkt
einen Zuschlag für etwas, das DIN 18363 ausdrücklich als Nebenleistung führt.
Wieder keine Preisfrage — aber wieder ein Widerspruch zur Zeile
„Normgrundlagen" auf demselben Blatt. [Einschätzung]

**An den Prüfmeister:** Ab welcher Raumhöhe fängt ein Maler in der Praxis
tatsächlich an, einen Zuschlag zu rechnen? Ich vermute, die Norm-Grenze von
3,50 m ist praxisfern, weil man ab etwa 3 m nicht mehr von der Leiter aus
sinnvoll arbeitet. Wenn das so ist, ist die 3-m-Schwelle die richtige und die
Norm die falsche Referenz — dann gehört sie nur nicht als „VOB/C" verkauft.

**An Head of Product Engineering:** Unabhängig davon, welche Schwelle gewinnt —
eine reicht. Aktuell kann derselbe Raum je nach Weg 2,50 €/m² oder 15 %
bekommen.

---

## VOB-007 — Die Zeile „Normgrundlagen" verspricht mehr, als das Angebot hält

**Status:** ❌ offen — Product Designer + Legal

`pdf.tsx` rendert am Ende:

```
Normgrundlagen: {[...vobNormen, ...dinNormen].join(' · ')}
```

in 7 pt, Farbe `#BBBBBB`. Diese Zeile leistet zwei Dinge nicht, die sie zu
leisten scheint:

**Erstens ist sie keine Einbeziehung.** § 305 Abs. 2 BGB verlangt einen
ausdrücklichen Hinweis und die zumutbare Möglichkeit der Kenntnisnahme. Ein
Normkürzel in 7 pt Hellgrau ist ein Verweis, kein Hinweis — und in dieser
Auszeichnung ein Musterbeispiel dessen, was Gerichte als nicht ausreichend
deutlich verwerfen. Die Übermessung (VOB-004) stützt sie damit nicht.
[Einschätzung]

**Zweitens stimmt sie in der Sache nicht durchgängig.** Wer „DIN 18363"
darüberschreibt, sagt: so ist gerechnet worden. Tatsächlich weicht das Produkt
an mindestens drei Stellen bewusst oder unbewusst davon ab — Verschnitt als
Menge (VOB-001), Nebenleistungen als eigene Positionen (VOB-005),
Höhenzuschlag unterhalb der Normgrenze (VOB-006). Eine Normangabe, die man
punktuell nicht einhält, ist schlechter als gar keine: sie liefert dem
Endkunden den Maßstab, an dem er das Angebot misst. [Einschätzung]

**Mein Vorschlag — zwei getrennte Dinge statt einer Zeile, die beides halb
macht:**

1. **Sachliche Erläuterung** dort, wo die Abweichung sitzt: der
   Übermessungssatz an der Wandflächenposition (VOB-004). Das ist die Stelle,
   an der die Norm tatsächlich angewendet wird und wo sie erklärt werden muss.
2. **Einbeziehung als eigener Fußtext-Baustein**, in lesbarer Größe, für
   Betriebe, die wirklich nach VOB abrechnen wollen — mit Angabe, wo der
   Normtext einzusehen ist. Optional, aktiv einzuschalten.
3. Die pauschale 7-pt-Zeile fällt weg. Was in ihr steckt, wandert in 1. und 2.

**An den Product Designer:** Die Zeile hat einen echten Wert, den ich nicht
wegwerfen will — sie signalisiert Fachlichkeit. Die Frage ist, wie wir dieses
Signal behalten, ohne eine Zusage zu machen, die das Angebot nicht einlöst.
Vielleicht reicht eine ehrlichere Formulierung („Mengenermittlung in Anlehnung
an VOB/C DIN 18363"), vielleicht braucht es die zwei getrennten Elemente.
Deine Baustelle, meine Randbedingung.

---

## VOB-008 — DIN-18365-Schwellenwert für Bodenöffnungen ungeklärt

**Status:** ⏳ wartet auf VOB-011

Die Quellen widersprechen sich, und der Unterschied ist erheblich:

- bauprofessor.de nennt für DIN 18365: Aussparungen **über 0,1 m²** abziehen,
  bis 0,1 m² übermessen.
- bau-doch-selber.de nennt **2,5 m²** für Aussparungen und **0,5 m²** für
  Öffnungen in Böden.
- DIN **18363** nennt für Aussparungen in Böden ebenfalls **0,5 m²** — was die
  0,1-m²-Angabe zusätzlich fraglich macht, aber nicht widerlegt, weil es zwei
  verschiedene Gewerke sind.

Zwischen 0,1 m² und 2,5 m² liegt bei einem Bodenangebot mit Türnischen und
Rohrdurchführungen ein spürbarer Betrag. Ich löse das nach VOB-011 auf und
trage das Ergebnis hier ein.

**Für Head of Product Engineering, damit das nicht überrascht:** Ich habe im
Boden-Pfad bisher **keine** Übermessungslogik gefunden — `boden.ts` rechnet
`laenge × breite` bzw. die angegebene Fläche und schlägt den Verschnitt auf.
Wenn also eine Schwellenregel dazukommt, ist das neue Logik, kein Fix an
bestehender. Belastbar sagen kann ich das erst nach VOB-011.

Die Sockelleisten-Regel dagegen ist bereits gesichert und hat einen eigenen,
bestätigten Befund ergeben — siehe **VOB-012**.

---

## VOB-009 — Türen und Fenster nach Stück statt nach Fläche

**Status:** 🟠 Prüfmeister — niedrige Priorität

DIN 18363 5.2.7: „Fenster, Türen, Trennwände, Bekleidungen und dergleichen
werden **je beschichtete Seite nach Fläche** gerechnet." Feste
Stück-Umrechnungen kennt die Norm nicht. [belegt]

Der Katalog rechnet nach Stück: `Innentürblatt lackieren einseitig` 55 €,
`beidseitig` 90 €, `Türzarge lackieren` 45 €, `Fensterrahmen Holz lackieren
innen und außen` 130 €.

**Meine Einschätzung: das ist in Ordnung und sollte so bleiben.** Ein
Stückpreis ist ein Pauschalpreis für eine klar umrissene Leistung, und
Pauschalpreise sind zulässig — für einen Verbraucher sind sie sogar
verständlicher als eine abgewickelte Fläche. Es ist nur eben nicht das, was die
Norm als Abrechnungsart vorsieht, und das ist wieder ein Argument für VOB-007:
weniger „VOB/C" behaupten, mehr erklären.

**An den Prüfmeister:** Nur zur Bestätigung — Stückpreise für Türen und Fenster
sind branchenüblich, oder? Falls ihr da draußen Flächenabrechnung seht, sag
Bescheid, dann bewerte ich neu.

---

## VOB-010 — Zuschlags-Einheiten: Prozent im Titel, Euro im Preis

**Status:** ❌ offen — Head of Product Engineering
Vollständige Herleitung in `docs/legal-001-bestandsaufnahme.md`, Abschnitt B2
(dort als L6). Hier nur, weil es in dieselbe Familie gehört.

**14 Katalogeinträge über neun Gewerke** nennen im Titel einen Prozentsatz und
tragen im Preis eine Euro-Pauschale, durchgehend nach demselben Muster
(`unit_price` == die Zahl aus dem Titel). Am deutlichsten beim SHK-Notdienst:
`Zuschlag Notdienst (…, 100%)` mit `unit: 'Pauschale'`, `unit_price: 100.00` —
der Titel verspricht Verdopplung, berechnet werden 100 €.

Rechtlich: §§ 133, 157 BGB, bei AGB-Charakter zusätzlich § 305c Abs. 2 BGB —
Zweifel gehen zulasten des Verwenders, also des Handwerkers.

Das ist derselbe Bug, den Head of Product Engineering am 31.08. für die fünf
Maler-Erschwerniszuschläge behoben hat; er reicht nur weiter. Wegen des
regelmäßigen Musters sollte eine Migration genügen.

---

## VOB-011 — Normtexte kaufen

**Status:** 🔵 Entscheidung von Sandy

**Was:** DIN 18363:2019-09 und DIN 18365:2019-09, beziehbar über DIN Media
(vormals Beuth). Grob 60–80 € pro Norm, zusammen etwa 150 €. Alternativ die
VOB/C-Gesamtausgabe oder die Verbändekommentare, die teurer sind, dafür die
Auslegung mitliefern.

**Warum:** Diese beiden Dokumente bestimmen, wie in diesem Produkt jedes
einzelne Angebot gerechnet wird. Wir arbeiten aktuell mit Zitaten aus
Innungs-PDFs und Betriebs-Websites. Das hat für die Bestandsaufnahme gereicht,
aber:

- **VOB-003** — ob eine geplante Änderung eine korrekte Regel zerstört, hängt
  am genauen Wortlaut eines einzigen Satzes.
- **VOB-008** — zwei Quellen nennen Werte, die um den Faktor 25 auseinander
  liegen.
- **VOB-001** — der Verschnitt-Konsens ist gut belegt, aber ich habe ihn
  nirgends als Normwortlaut gesehen.

**Meine Empfehlung:** kaufen, und zwar vor der Umsetzung von VOB-001 und
VOB-003. Es ist der günstigste Posten mit dem größten Hebel, den ich im
Projekt sehe — und wenn wir das VOB-Thema wirklich lückenlos haben wollen,
wie Sandy es sich wünscht, führt kein Weg daran vorbei.

**Wichtig zur Lizenz:** DIN-Normen sind urheberrechtlich geschützt. Wir dürfen
danach rechnen und auf sie verweisen, aber den **Normtext nicht ins Produkt
kopieren** und nicht an Nutzer weitergeben. Für die Einbeziehung gegenüber dem
Endkunden (VOB-007) heißt das: wir verweisen darauf, wo der Text zu beziehen
ist — wir legen ihn nicht bei. Das ist auch der Grund, warum ich hier nur
kurze Auszüge zitiere und keine Volltexte.

---

## VOB-012 — Türbreiten werden von der Sockelleistenlänge abgezogen

**Status:** ❌ offen — Head of Product Engineering

An zwei Stellen wird die Länge der Sockelleisten um die Türbreiten gekürzt:

```js
// maler.ts:425-426  („Sockelleisten abkleben")
const tuerBreiten = effTueren.reduce((s, t) => s + (t.breite ?? 0.9), 0)
menge: round2(effUmfangWZ - tuerBreiten)

// sockelleisten.ts:27-28
const tuerBreiten = tueren.reduce((sum, t) => sum + (t.breite ?? 0.9), 0)
return round2(umfang - tuerBreiten)
```

**Beide Normen sagen etwas anderes.** Bei Abrechnung nach **Längenmaß** werden
Unterbrechungen mit einer Einzellänge **unter 1 m** übermessen, also
durchgemessen und nicht abgezogen — DIN 18363 Abschnitt 5.3.2 für die
Malerarbeiten [belegt], und für die Bodenbelagarbeiten nach DIN 18365
gleichlautend [belegt, zwei unabhängige Quellen]. Eine normale Zimmertür ist
0,80–0,90 m breit und liegt damit klar darunter. Der Standardwert im Code ist
`0.9` — also genau der Fall, den die Norm nicht abgezogen haben will.

**Das ist der einzige Befund in dieser Datei, der zulasten des Handwerkers
geht.** Bei drei Türen sind das rund 2,7 lfdm, die ihm fehlen. Bei
„Sockelleisten abkleben" zu 0,80 €/lfdm ist das wenig; bei einer
Sockelleisten-Montage mit 8–12 €/lfdm summiert es sich.

**Und es ist inkonsistent zu allem anderen.** Bei der Wandfläche wendet das
Produkt die Übermessung großzügig an (Öffnungen bis 2,5 m² bleiben drin,
VOB-004). Bei der Sockelleiste wendet es sie gar nicht an. Es ist derselbe
Gedanke — kleine Unterbrechungen werden durchgemessen, weil der Mehraufwand
an den Kanten die eingesparte Menge ausgleicht — nur einmal angewendet und
einmal nicht.

**Achtung, ein sachlicher Unterschied, der hier tatsächlich zählt:** Bei
`Sockelleisten abkleben` klebt man an der Tür wirklich nicht ab, es gibt dort
keine Leiste. Die Norm sieht das trotzdem als Übermessung vor — genau wie beim
Fenster in der Wand. Ich halte den Abzug für norm-widrig, aber nicht für
sachwidrig, und will das nicht über den Kopf des Prüfmeisters hinweg
entscheiden.

**Mögliche Verbindung zu PM-007:** Der Prüfmeister hat dort zweimal
„Sockelleisten-Türabzug trotz ‚Türen: 0'" gemeldet. Das ist ein anderer Fehler
(es wird abgezogen, obwohl gar keine Tür da ist), könnte aber dieselbe
Codestelle betreffen. Wer VOB-012 anfasst, sollte PM-007 gleich mitnehmen.

**An den Prüfmeister:** Zieht ihr Türbreiten ab oder messt ihr durch? Das ist
Frage 7 in der Liste unten.

---

## Offene Fragen an den Prüfmeister — gesammelt

Damit du sie in einem Durchgang beantworten kannst, ohne die Datei zu
durchsuchen. Ich brauche für jede davon deine Praxis-Sicht, nicht die Norm —
die habe ich. Wo Praxis und Norm auseinandergehen, ist das eine bewusste
Entscheidung, und die kann man nur treffen, wenn man beide Seiten kennt.

1. **VOB-001** — Ist es beim Bodenleger üblich, den Verschnitt als sichtbare
   Menge auszuweisen („21 m² inkl. 5 % Verschnitt"), oder rechnet man 20 m² mit
   entsprechend kalkuliertem Einheitspreis? Beschweren sich Kunden darüber?
2. **VOB-003** — Rechnet ein Maler die Fensterleibung bei einem normalen
   Fenster mit ab, oder macht man das üblicherweise „mit"?
3. **VOB-005** — Ist „Boden abdecken" / „Möbel abdecken" als eigene Position
   auf dem Angebot branchenüblich? Und wenn ja: ist der m²-Preis fürs
   Streichen dann entsprechend knapper?
4. **VOB-006** — Ab welcher Raumhöhe rechnet ein Maler in der Praxis einen
   Zuschlag? 2,80 m, 3 m, oder erst wenn wirklich ein Gerüst nötig wird?
5. **VOB-009** — Türen und Fenster nach Stück: branchenüblich, oder siehst du
   Flächenabrechnung?
6. **VOB-012** — Zieht ihr bei Sockelleisten die Türbreiten ab, oder messt ihr
   durch? Die Norm sagt: bis 1 m Unterbrechung durchmessen.
7. **Allgemein** — Gibt es eine Abrechnungsregel, die du aus der Praxis kennst
   und die das Produkt gar nicht abbildet? Ich habe hier von der Norm her
   gesucht. Der umgekehrte Blick fehlt mir.

---

## Was ich ausdrücklich gut finde

Damit die Liste nicht als Generalkritik gelesen wird — sie ist es nicht:

- **Die Übermessung ist implementiert, zentral und richtig.**
  `berechneOeffnungsabzugVob()` prüft je Öffnung einzeln statt in Summe, was
  genau der Normsystematik entspricht („Einzelgröße"). Eine Funktion, eine
  Regel, überall eingebunden. Das ist sauberer, als ich es erwartet hatte.
- **Der Kommentarkopf in `vob-uebermessung.ts` benennt, was bewusst nicht
  gemacht wurde.** Genau deshalb konnte ich VOB-003 überhaupt finden. Eine
  offen dokumentierte Auslassung ist mehr wert als eine stillschweigend
  korrekte Implementierung.
- **Der Verschnitt steht im Positionstitel**, nicht versteckt in den
  Annahmen — deshalb erreicht er den Endkunden. Bei der Übermessung ist es
  genau umgekehrt (VOB-004), und der Vergleich zeigt, worauf es ankommt.
- **Leibungen werden als abgewickelte Fläche gerechnet**, mit sichtbarem
  Rechenweg und einer als Annahme markierten Standardtiefe von 25 cm, wenn
  nichts angegeben war. Das ist genau die Art Transparenz, die ein Angebot
  belastbar macht.
- **`pruefmeister-testfaelle.md`** ist die Grundlage, auf der diese ganze
  Prüfung überhaupt möglich war. Ohne die dokumentierten Soll-Lösungen hätte
  ich nicht sagen können, was Absicht ist und was Zufall.

---

*Head of Legal & Compliance · angelegt 2026-09-01 · nächster Schritt:
Rückmeldung Prüfmeister zu den sieben Fragen, parallel VOB-002 und VOB-010
(reine Konsistenzfixes, keine Entscheidung nötig)*

## Nachtrag (2026-09-01) — Risikobewertung zu diesen Befunden liegt vor

Sandy hat im Anschluss eine formale Risikobewertung angefordert. Ergebnis:
**`docs/legal-002-risikobewertung-vob.md`** — zwölf Risiken (LR-01 bis LR-12)
nach Severity × Likelihood, mit Optionentabellen und Restrisiko je Punkt.

**Zuordnung VOB-ID → Risiko-ID**, damit man nicht suchen muss:

| VOB | LR | Score | Level |
|---|---|---|---|
| VOB-004 Übermessungshinweis fehlt im PDF | LR-01 | 16 | 🔴 RED |
| VOB-001 Verschnitt als Mengenaufschlag | LR-02 | 12 | 🟠 ORANGE |
| VOB-011 Normtexte kaufen | LR-03 | 12 | 🟠 ORANGE |
| VOB-003 Leibungs-„Fix" | LR-06 | 12 → 3 | 🟠 → 🟢 |
| VOB-002 drei Verschnittsätze | LR-07 | 9 | 🟡 YELLOW |
| VOB-007 „Normgrundlagen"-Zeile | LR-08 | 9 | 🟡 YELLOW |
| VOB-010 Prozent im Titel, Euro im Preis | LR-09 | 9 | 🟡 YELLOW |
| VOB-005 Nebenleistungen als eigene Positionen | LR-10 | 4 | 🟢 GREEN |
| VOB-012 Türabzug bei Sockelleisten | LR-11 | 4 | 🟢 GREEN |
| VOB-006 Höhenzuschlag-Schwellen | LR-12 | 4 | 🟢 GREEN |
| VOB-009 Türen/Fenster nach Stück | — | — | bewusst kein Risiko |
| VOB-008 DIN-18365-Schwellenwert | — | — | in LR-03 enthalten |

**Drei Dinge daraus, die für die Arbeit an dieser Datei zählen:**

**1. VOB-004 ist das einzige rote Risiko** — und zwar wegen der
Eintrittswahrscheinlichkeit, nicht wegen der Schadenshöhe. Wandflächen
nachzumessen ist die klassischste Handwerker-Streitigkeit überhaupt, dafür
braucht der Kunde einen Zollstock. Mit dem Satz auf dem PDF fällt es von 16 auf
6. Zwei Stunden Arbeit, rot wird gelb — das beste Aufwand-Wirkung-Verhältnis im
ganzen Register.

**2. VOB-003 ist durch das Aufschreiben allein von orange auf grün gefallen.**
Solange „nicht bauen" in der Datei steht, ist die Eintrittswahrscheinlichkeit 1
statt 4. Das ist das einzige Risiko, das sich so verhält — bitte die Markierung
deshalb nicht kommentarlos entfernen, sondern erst, wenn ich VOB-003 nach dem
Normkauf aufgelöst habe.

**3. VOB-012 bleibt grün, aber aus einem unbefriedigenden Grund:** Niemand
verklagt uns dafür, dass ein Handwerker zu wenig berechnet hat. Rechtlich ist
das Risiko klein, fachlich ist es derselbe Fehler wie VOB-004, nur in die
andere Richtung. Ich würde ihn trotzdem fixen — nicht wegen der Haftung,
sondern weil ein Werkzeug, das die Übermessung an der Wand großzügig anwendet
und an der Sockelleiste gar nicht, für den Nutzer nicht erklärbar ist.

**Was ich ausdrücklich NICHT als Risiko führe**, damit hier niemand daran
arbeitet: die Übermessungsregel als solche (korrekt und branchenüblich), die
Stückpreise für Türen und Fenster (VOB-009 — Pauschalpreise sind zulässig und
für Verbraucher verständlicher), und die Höhe der Zuschläge (frei kalkulierbar,
es gibt keine Preisverordnung im Bauhandwerk).

**Die Kernbeobachtung aus der Bewertung:** In keinem der zwölf Risiken wird
falsch gerechnet. Die Übermessung stimmt, die Zuschläge sind branchenüblich,
die Leibungen sind richtig. Was fehlt, ist durchgehend die Erklärung auf dem
Papier, das beim Endkunden landet — plus an zwei Stellen die Konsistenz
zwischen dem, was die Engine rechnet, und dem, was sie darüber schreibt. Das
ist die gute Ausgangslage: Eine richtige Rechnung zu dokumentieren ist Arbeit
von Stunden.

---

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
