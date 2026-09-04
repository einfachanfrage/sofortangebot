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

> **Weitgehend erledigt (04.09.2026):** Sandy hat die VOB Gesamtausgabe 2019
> beschafft. DIN 18363 und DIN 18365 liegen im Original vor; VOB-003, VOB-008,
> VOB-012 und die Nebenleistungs-Zuordnung sind am Normtext geprüft — siehe den
> Abschnitt „VOB-011 erledigt" am Dateiende. **Der Vorbehalt unten gilt nur noch
> für Aussagen zu Normen, die dort nicht behandelt sind**, und für die eine
> Stelle, an der ich mich mit der Sekundärquelle geirrt habe (Abrechnungseinheit
> der Leibungen — dort stand „geklärt", und es war falsch).

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
| VOB-001 | Verschnitt wird auf die **abgerechnete Menge** aufgeschlagen statt in den Einheitspreis | Sandy | 🔵 Praxis bestätigt den Umbau (Prüfmeister 2026-09-02), Entscheidung Sandy |
| VOB-002 | **Drei verschiedene Verschnittsätze** im Code — 5 %, 10 %, 12 % | Head of Product Engineering | ❌ |
| VOB-003 | Geplante „VOB-Feinheit" zu Leibungen zeigt in die **falsche Richtung** — Backlog-Punkt ersatzlos streichen | Head of Product Engineering | ✅ **am Normtext entschieden (04.09.):** DIN 18363 5.2.3 wörtlich bestätigt. Offen bleibt nur die Einheit (m vs. m²) — Entscheidung Sandy |
| VOB-004 | Übermessungshinweis erreicht das Kunden-PDF nicht (= G5 aus CoS-L-001) | Head of Product Engineering + Product Designer | ❌ |
| VOB-005 | **Nebenleistungen** werden als eigene Positionen berechnet (Boden/Möbel abdecken) | — | ✅ geklärt: branchenüblich, Position bleibt, Lösung läuft über VOB-007 |
| VOB-006 | Höhenzuschlag: **fünf** verschiedene Schwellen im Produkt — Normbegründung war falsch, Konsistenzfrage bleibt | Head of Product Engineering + Sandy | ❌ |
| VOB-007 | Die Zeile „Normgrundlagen" behauptet VOB-Konformität, die an mehreren Stellen nicht gegeben ist | Product Designer + Legal | ❌ |
| VOB-008 | DIN-18365-Schwellenwert für Bodenöffnungen | Head of Product Engineering | ✅ **geklärt (04.09.): 0,1 m²** — weder 0,5 noch 2,5. Bitte `boden.ts` prüfen, Fehler zulasten des Kunden |
| VOB-009 | Türen/Fenster nach Stück statt nach Fläche | — | ✅ geklärt: Stückpreise sind branchenüblich, bleibt so |
| VOB-010 | Zuschlags-Einheiten: Prozent im Titel, Euro im Preis (14 Einträge) | Head of Product Engineering | ❌ |
| VOB-011 | Normtexte beschaffen | Sandy | ✅ **erledigt (04.09.):** VOB Gesamtausgabe 2019 liegt vor, alle sechs Fragen beantwortet |
| VOB-012 | Türbreiten werden von der Sockelleistenlänge abgezogen — Norm sagt: bis 1 m durchmessen | Head of Product Engineering | ✅ **am Normtext bestätigt (04.09.):** DIN 18363 5.3.2. **Zwei** Codestellen betroffen, nicht eine |
| VOB-013 | **Leibungsfläche wird rundherum statt dreiseitig gerechnet, Fensterbank doppelt** — Fund des Prüfmeisters | Head of Product Engineering | ❌ |
| VOB-014 | Material wird in **Paketen** gekauft — Paketaufrundung fehlt im Produkt komplett (Praxis-Fund Prüfmeister) | Head of Product Engineering, zusammen mit VOB-001 | ❌ |

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
| `src/lib/boden-normalisierer.ts` → `standardVerschnitt()` (**nicht** unter `mengen/` — dort sucht man es zuerst) | **5 %** für Laminat, Vinyl, Linoleum, Parkett, Diele; **0 %** für Kork und Teppich | rechnet die Menge |
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

**Bitte:** einen Wert, eine Stelle. `standardVerschnitt()` in
`src/lib/boden-normalisierer.ts` ist die richtige —
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

> **Wichtige Abstufung, 2026-09-02:** Ich habe hier gestern geschrieben, die
> Regel im Backlog sei „genau umgekehrt". Nach vertiefter Recherche ist das zu
> bestimmt formuliert. Es gibt Gegenstimmen — Praktiker, die vertreten, bei
> übermessenen Öffnungen sei die Leibung in der Fläche enthalten und werde erst
> bei abgezogenen Öffnungen separat gerechnet. Diese Stimmen sind schwach
> (Foren, ohne Normzitat, meist zu anderen Gewerken), aber sie sind nicht
> widerlegt, und sie entsprechen genau dem, was im Backlog steht. **Richtig
> ist: die Regel ist ungeklärt, meine Lesart ist die plausiblere.** An „bitte
> nicht bauen" ändert das nichts — bei einer strittigen Regel ist eine
> Änderung, die Geld bewegt, erst recht nicht auf Verdacht zu bauen. Details
> im Update unter VOB-011.
>
> **Geklärt ist dagegen die Einheitenfrage:** Die Längenmaß-Variante, die mich
> irritiert hatte, stammt aus DIN 18350 (Putzarbeiten), nicht aus DIN 18363.
> `maler.ts` rechnet nach Fläche und liegt damit richtig.

> **Ergänzung 2026-09-02:** Der Prüfmeister hat beim Nachrechnen einen
> Folgefehler gefunden — die Leibungs**fläche** wird zu groß berechnet (vier
> Seiten statt drei) und die Fensterbank doppelt. Das ist **VOB-013** und
> ändert nichts an dem, was hier steht: Leibungen dürfen separat gerechnet
> werden (das „Ob"), nur die Menge stimmt nicht (das „Wie viel"). Wer aus
> VOB-003 abliest, an den Leibungen sei alles in Ordnung, liest zu schnell.

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
| DIN 18363 4.1.1 / 4.2.5 | *Gerüst* ist Nebenleistung **bis 3,50 m**, Besondere Leistung darüber | — |

Drei Schwellen (2,80 / 3,00 / 4,00 m) und zwei Einheitensysteme (€/m² und %)
für dieselbe Erschwernis. Welcher Zuschlag greift, hängt davon ab, welcher Weg
die Position erzeugt hat.

> **Korrektur 2026-09-02, Head of Product Engineering:** Es sind nicht drei
> Schwellen, sondern **fünf** — Code 3,00 m; Katalog 2,80 und 4,00 bei Maler,
> 3,25 und 4,50 bei Trockenbau, 3,00 bei Putz. Ich hatte nur den Maler-Teil
> angesehen. Übernommen; am Befund ändert es nichts außer seiner Größe.

> **Korrektur vom 2026-09-01 nach Rückmeldung des Prüfmeisters.** Ursprünglich
> stand hier, das Produkt berechne zwischen 2,80 m und 3,50 m „einen Zuschlag
> für etwas, das die Norm als Nebenleistung führt". **Das war schief, und der
> Prüfmeister hat es zu Recht auseinandergenommen:** DIN 18363 4.1.1 sagt, dass
> das **Gerüst** bis 3,50 m im Einheitspreis enthalten ist und nicht als eigene
> Position abgerechnet werden darf. Das ist keine Aussage darüber, ob ein
> Betrieb für hohe Räume einen **Erschwerniszuschlag** verlangen darf. Zwei
> verschiedene Fragen.
>
> Seine Praxis-Antwort dazu ist gleich mitgeliefert: Ein Zuschlag ab drei
> Metern ist auf dem Bau völlig üblich, weil man dort nicht mehr von der Leiter
> aus arbeitet, sondern Böcke stellt — und das kostet Zeit. Die 3-m-Schwelle
> ist damit **fachlich richtig**, nicht norm-widrig. Frage 4 unten ist damit
> beantwortet.

**Was bleibt — und das ist unverändert ein Befund:** nicht die Höhe der
Schwelle, sondern dass es **drei** davon gibt. 2,80 m im Katalog, 3,00 m in
der Engine, 4,00 m für die nächste Stufe, dazu €/m² gegen %. Derselbe Raum
bekommt je nach Weg 2,50 €/m² oder 15 %. Das ist eine reine
Konsistenzfrage — rechtlich harmlos, für den Nutzer aber nicht erklärbar, und
im Streit mit einem Endkunden schlecht zu verteidigen, wenn zwei Angebote
desselben Betriebs denselben Fall unterschiedlich berechnen.

**Was NICHT bleibt:** die Normbegründung. Der Zuschlag als solcher ist
zulässig und üblich; ich hatte ihn fälschlich gegen die Gerüst-Regel gestellt.
Für VOB-007 ändert das nichts — die Zeile „Normgrundlagen" gehört trotzdem
weg, nur eben aus den anderen Gründen (Verschnitt als Menge, Nebenleistungen
als eigene Positionen, fehlende Einbeziehung), nicht wegen der Höhenschwelle.

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

---

### Update 2026-09-02: Sandy will nicht kaufen — was online geht und was nicht

Sandys Ansage: die Normtexte werden nicht gekauft, ich soll es online
herausbekommen. Ich habe daraufhin zweigleisig recherchiert: einmal die
Wortlaut-Fragen selbst über frei zugängliche Quellen, einmal die Frage, ob es
einen legalen kostenlosen Zugang zum Volltext gibt. Ergebnis unten, ehrlich
sortiert nach dem, was es gebracht hat.

**Zuerst eine Korrektur an mir selbst: meine Preisangabe war falsch.** Ich hatte
„rund 150 € für beide Normen" geschrieben. Richtig ist:

| Was | Preis |
|---|---|
| DIN 18363 einzeln (PDF) | 60,10 € |
| DIN 18365 einzeln (PDF) | 44,70 € |
| beide einzeln | ~105 € |
| **VOB Gesamtausgabe 2019 (Teil A+B+C, enthält beide Normen und alle übrigen ATV)** | **54 €** |

Die Gesamtausgabe kostet also **halb so viel wie die zwei Einzelnormen** und
enthält zusätzlich jede ATV, die wir für künftige Gewerke brauchen werden
(Fliesen, Trockenbau, Putz, Estrich). Ich habe zwei Positionen einzeln
kalkuliert, statt nach dem Sammelband zu schauen — das war schlicht schlecht
recherchiert.

**Und es gibt einen legalen kostenlosen Weg, hier in Berlin.** Die
Zentral- und Landesbibliothek betreibt einen Volltext-Zugang zu aktuellen
DIN-Normen an Vor-Ort-Arbeitsplätzen (`din-normen.zlb.de`). Voraussetzung ist
ein VÖBB-Bibliotheksausweis: **10 € Jahreskarte**, Anmeldung mit Personalausweis
in jeder Berliner Stadtbibliothek. Lesen ja, Kopieren und Drucken nein — das ist
lizenzrechtlich ausgeschlossen. Für unsere sechs offenen Fragen reicht Lesen und
Mitschreiben aber vollkommen; es geht um einzelne Sätze, nicht um ganze
Kapitel. Realistisch ein Vormittag.

Die Alternative über eine Uni-Bibliothek (TU Berlin, Normen-Infopoint) gibt es
auch, ist aber umständlicher: Gastausweis nötig, und ob er die
Datenbanknutzung einschließt, war nicht eindeutig zu klären.

**Was ausdrücklich NICHT geht:** Der VOB/C-Volltext ist nirgends amtlich frei
veröffentlicht. Die VOB/A und VOB/B werden im Bundesanzeiger bekanntgemacht,
Teil C **nicht** — er besteht aus regulären, urheberrechtlich geschützten
DIN-Normen und wird in der Bekanntmachung nur referenziert. Es gibt also keine
offizielle Fundstelle, die ich übersehen hätte. Raubkopien schließe ich aus,
und zwar nicht aus Prinzipienreiterei: Ein Rechtsdokument, dessen Grundlage aus
einer illegalen Quelle stammt, ist im Streitfall wertlos.

### Was die freie Recherche gebracht hat — und was sie verschlechtert hat

**Aufgeklärt (gut):** Der scheinbare Widerspruch zwischen „Leibungen nach
Flächenmaß" und „Leibungen nach Längenmaß getrennt nach Bauart" ist keiner. Die
Längenmaß-Regel stammt aus **DIN 18350 (Putz- und Stuckarbeiten)**, nicht aus
DIN 18363 — dort wird bei schmalen Leibungen nach Länge und Bauart gerechnet,
weil der Aufwand von der Konstruktion abhängt. Für Anstricharbeiten gilt das
Flächenmaß. Zwei verschiedene Gewerke, zwei verschiedene ATV; meine beiden
Quellen hatten unbemerkt aus verschiedenen Normen zitiert. Damit ist die
Einheitenfrage aus VOB-003 erledigt: `maler.ts` rechnet nach Fläche, und das ist
richtig.

**Bestätigt:** Die Nummerierungsverschiebung 5.2.4 (2016) → 5.2.3 (2019) ist
durch eine Verbandspublikation des Bundesverbands Farbe belegt — die belastbarste
Quelle in diesem ganzen Komplex. Der Leibungs-Wortlaut selbst findet sich
gleichlautend auf drei Betriebsseiten; sie gehen aber vermutlich alle auf
dieselbe Abschrift zurück, sind also eher eine Quelle in drei Kopien.

**Und jetzt der Teil, der mir nicht gefällt: die entscheidende Frage ist
offener als gestern, nicht geschlossener.**

Ich habe gezielt nach Gegenstimmen gesucht — und welche gefunden. Zur Frage, ob
die Leibung auch dann gesondert gerechnet wird, wenn die zugehörige Öffnung
**übermessen** wurde, gibt es Stimmen in beide Richtungen. Mehrere Praktiker
vertreten in Foren genau die Gegenposition: bei Öffnungen bis 2,5 m² sei die
Leibung „in der Fläche enthalten", erst bei abgezogenen Öffnungen werde sie
separat berechnet — „nicht in beiden Fällen gleichzeitig". Diese Stimmen sind
schwach (Foren, ohne Normzitat, überwiegend zu anderen Gewerken), aber sie
existieren, und **das ist genau die Position, die in unserem Backlog-Punkt
steht.**

Meine Auslegung halte ich weiterhin für die bessere: „unabhängig von ihrer
Einzelgröße" bezieht sich grammatikalisch auf die Größe der Leibung selbst, nicht
auf das Schicksal der Öffnung. Und sachlich ist die Leibung eine andere Fläche
als die Wand — sie wird tatsächlich beschichtet. Aber ich habe **keine einzige
Quelle gefunden, die das für DIN 18363 ausdrücklich klärt.**

**Konsequenz für VOB-003, und ich formuliere das bewusst deutlich:** Gestern
habe ich geschrieben, die Regel im Backlog sei „falsch herum". Diese Aussage war
zu bestimmt. Richtig ist: **Die Regel ist ungeklärt, meine Lesart ist die
plausiblere, und die Gegenposition ist nicht widerlegt.** An der Handlungs-
empfehlung ändert das nichts — im Gegenteil, sie wird stärker: Wenn eine Regel
strittig ist, ist eine Änderung, die Geld bewegt, erst recht nicht auf
Verdacht zu bauen.

**DIN 18365, Schwellenwert (VOB-008):** Mein Verdacht hat sich bestätigt. Der
0,5-m²-Wert für „Aussparungen in Böden" ist ein Wert aus **DIN 18363** (die Norm
erfasst auch Bodenbeschichtungen) — zwei unabhängige Quellen ordnen ihn dort
zu. Ob DIN 18365 zufällig denselben Wert führt oder den von bauprofessor.de
genannten 0,1 m², ist weiterhin offen; beide „Lager" sind bei näherem Hinsehen
je eine Quelle mit Kopien. **Ungeklärt.**

### Was das praktisch heißt

| Frage | Stand nach freier Recherche | Braucht den Normtext? |
|---|---|---|
| Leibungen nach Fläche oder Länge | **geklärt** — Fläche, die Längenregel war DIN 18350 | nein |
| Nummerierung 5.2.3 / 5.2.4 | **geklärt** | nein |
| Leibungs-Wortlaut | mittel-hoch belegt | für Gewissheit ja |
| **Leibung auch bei übermessener Öffnung** | **offen, Gegenstimmen vorhanden** | **ja** |
| Leibungsfläche drei- oder vierseitig | **nicht belegbar**, keine Quelle | siehe unten |
| DIN 18365 Schwellenwert | **offen** | **ja** |

**Zwei Punkte kommen ohne den Normtext nicht weiter** — VOB-003 und VOB-008.
Beide bewegen Geld in beide Richtungen, und beide bleiben deshalb bis auf
Weiteres liegen. Das ist kein Drama: VOB-003 ist genau deshalb schon jetzt als
„nicht bauen" markiert, und VOB-008 ist bislang ohnehin nur eine Frage, kein
Befund im Code.

**Ein Punkt braucht ihn ausdrücklich NICHT: VOB-013.** Dass die Leibungsfläche
dreiseitig statt vierseitig zu rechnen ist, folgt nicht aus der Norm, sondern
daraus, dass unten am Fenster die Fensterbank sitzt. Dazu habe ich keine Quelle
gefunden und brauche auch keine — es ist keine Auslegungsfrage. Ebenso die
Doppelberechnung der Fensterbank. **VOB-013 kann und sollte unabhängig vom
Normkauf umgesetzt werden.**

### Mein Vorschlag an Sandy

Drei Optionen, keine davon sind die 150 €, die ich fälschlich genannt hatte:

1. **10 € und ein Vormittag:** ZLB-Ausweis holen, die sechs Sätze vor Ort
   nachlesen und mitschreiben. Kostet fast nichts außer Zeit.
2. **54 €:** VOB Gesamtausgabe 2019. Dauerhaft verfügbar, enthält jede ATV, die
   wir für die nächsten Gewerke brauchen. Wenn ich rein wirtschaftlich denke,
   ist das die richtige Wahl — beim ersten Streitfall über eine Wandfläche ist
   es hereingeholt.
3. **Nichts kaufen und damit leben:** VOB-003 und VOB-008 bleiben dauerhaft
   offen, der Leibungs-Backlogpunkt bleibt dauerhaft „nicht bauen". Das ist
   vertretbar, solange niemand vergisst, warum. Alles andere in dieser Datei
   läuft weiter.

Ich empfehle 2, weil es billiger ist als das, was ich ursprünglich verlangt
habe, und den Punkt endgültig schließt. Aber 3 ist eine legitime Entscheidung
und ich baue keinen Druck auf — meine Aufgabe ist, dass die Folgen benannt
sind, nicht dass ich mich durchsetze.

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

## VOB-013 — Leibungen werden zu groß gerechnet, Fensterbank doppelt

**Status:** ❌ offen — Head of Product Engineering
**Fund:** Prüfmeister, 2026-09-02 (`pruefmeister-testfaelle.md`, „Neuer Fund
nebenbei"). Ich bewerte ihn hier nur rechtlich; fachlich ist er seiner.

`maler.ts` Zeile 614 rechnet den Leibungsumfang als

```js
const leibungsUmfang = round2(2 * br + 2 * hoe)
```

also einmal komplett rundherum. Der Prüfmeister weist darauf hin, dass das
fachlich nicht sein kann: unten am Fenster sitzt die Fensterbank, unten an der
Tür der Fußboden — dort gibt es keine Leibung. Richtig sind drei Seiten,
`br + 2 × hoe`. Bei einem Standardfenster 1,20 × 1,00 m und 25 cm Tiefe
ergibt das **1,10 m² statt 0,80 m², also gut ein Drittel zu viel.** Dazu
kommt bei Nennung des Wortes „Fensterbank" zwei Zeilen weiter nochmal
`br × tiefe` als eigene Position — die Fensterbank wird damit doppelt
berechnet, einmal versteckt im Leibungsumfang und einmal offen.

**Rechtlich ist das die schwerste Einzelposition in dieser Datei**, obwohl der
Betrag klein ist. Der Grund liegt in der Art des Fehlers, nicht in seiner Höhe:

- **Es gibt keine Verteidigungslinie.** Bei der Übermessung (VOB-004) und beim
  Verschnitt (VOB-001) berechnen wir Flächen, die nicht bearbeitet wurden, aber
  nach einer nachvollziehbaren Konvention — die eine steht in der Norm, die
  andere ist Branchenpraxis. Hier ist schlicht falsch gerechnet. Auf die Frage
  „wie kommen Sie auf 1,10 m²?" gibt es keine Antwort, die trägt.
- **Die Doppelberechnung der Fensterbank ist qualitativ etwas anderes als eine
  zu große Fläche.** Dieselbe Leistung erscheint zweimal, einmal sichtbar und
  einmal verdeckt. Wenn ein Endkunde das findet, ist der Vorwurf nicht mehr
  „falsch gerechnet", sondern „doppelt berechnet" — und das ist der Vorwurf,
  gegen den sich ein Handwerksbetrieb am schlechtesten wehren kann.
- **Er wirkt zulasten des Endkunden und ist systematisch**, also auf jedem
  Angebot mit Leibungen gleich.

**Zusammenhang mit VOB-003, damit nichts vermischt wird.** Die beiden Punkte
betreffen dieselbe Position, aber verschiedene Fragen:

| Frage | Antwort | Fundstelle |
|---|---|---|
| **Ob** Leibungen separat berechnet werden dürfen | Ja — DIN 18363 5.2.3, „unabhängig von ihrer Einzelgröße gesondert gerechnet". Der Code liegt richtig, der geplante Rückbau wäre falsch | VOB-003 |
| **Wie viel** dabei herauskommt | Zu viel — vier Seiten statt drei, plus Doppelzählung der Fensterbank | VOB-013 |

**Das ändert meine Einschätzung zu VOB-003 nicht**, sondern schärft sie: Es
bleibt richtig, Leibungen zu berechnen; die Menge ist der Fehler. Wer VOB-003
liest und daraus „an den Leibungen ist alles in Ordnung" ableitet, liest zu
schnell — deshalb steht der Hinweis auch dort.

**Warum ich das trotzdem nicht als Sofort-Fix einfordere:** Es ändert Geld,
und der Prüfmeister hat den Fall selbst noch nicht live nachgesprochen. Sein
Vorgehen — erst nachsprechen, dann als eigenen Fall anlegen — ist richtig.
Meine Bitte ist nur, dass er nicht in der Warteschlange hinter VOB-003 landet:
VOB-003 wartet bewusst auf die Normtexte, VOB-013 nicht. Für „ein Fenster hat
unten keine Leibung" braucht es keine DIN.

**Wichtig für die Risikobewertung:** Dieser Fund ist der erste, bei dem im
Produkt tatsächlich **falsch gerechnet** wird und nicht nur eine richtige
Rechnung schlecht erklärt ist. Die Kernaussage aus
`legal-002-risikobewertung-vob.md` („in keinem der zwölf Risiken wird falsch
gerechnet") ist damit überholt und dort korrigiert.

---

## Rückmeldungen

*(Neue Rückmeldungen hier oben anfügen, mit Datum und von wem.)*

### 2026-09-02 — Prüfmeister, die sechs offenen Fragen

Du wolltest die Praxis, nicht die Norm. Die kriegst du hier — mit der Ansage,
wo Praxis und Norm auseinandergehen, damit Sandy weiß, was sie entscheidet.
Frage 4 ist erledigt, VOB-013 hast du schon aufgenommen. Bleiben sechs.

**Frage 1 (VOB-001) — Verschnitt: du hast recht, raus aus der Menge.**
Draußen wird nach **verlegter Fläche** abgerechnet. Wer 20 m² verlegt hat,
schreibt 20 m² aufs Angebot; der Verschnitt steckt im Quadratmeterpreis, da hat
er immer gesteckt. Und ja, Kunden beschweren sich — das ist einer der
Standardanrufe: „Ich hab nachgemessen, das sind 20, warum stehen da 21?" Der
Handwerker erklärt dann fünf Minuten, was Verschnitt ist, und behält den
Beigeschmack, er hätte was draufgeschlagen. Dein Umbau ist also nicht nur
juristisch sauberer, er ist auch das, was der Betrieb gewohnt ist. Zwei
Bedingungen von mir:

1. **Der Endbetrag darf sich nicht ändern.** Wer heute 45 €/m² auf 21 m²
   rechnet, muss danach 47,25 €/m² auf 20 m² rechnen. Sonst nimmt der Umbau dem
   Betrieb echtes Geld weg, und dann macht keiner mit.
2. **Der Verschnitt bleibt sichtbar, aber als Erklärung statt als Menge** —
   Untertitel unter der Position („Materialverschnitt bei Fischgrätverlegung
   einkalkuliert"). Das ist die Nachvollziehbarkeit, die du nicht verlieren
   wolltest; sie muss nur nicht in der Mengenspalte stehen.

Eine Ausnahme, die das Produkt kennen sollte: **stellt der Kunde das Material
selbst**, ist die Materialmenge sehr wohl eine eigene Zeile, und dort gehört der
Verschnitt dann hin. Anderer Fall, kein Gegenargument.

**Frage 2 (VOB-003) — Leibungen: die Norm hat recht, die Praxis rechnet sie
meistens trotzdem nicht.**
Bei einem normalen Innenfenster in Wandfarbe streicht der Maler die Leibung mit
und weist sie nicht aus — sie steckt im m²-Preis wie die übrige Kantenarbeit.
Wer bei einer Wohnung drei Fensterleibungen einzeln aufs Angebot schreibt,
wirkt kleinlich. **Separat gerechnet wird sie**, wenn sie echte Zusatzarbeit
ist: andere Farbe als die Wand, tiefe Altbauleibungen, Außenleibungen an der
Fassade, frisch verputzte Leibungen nach Fenstertausch. Dann steht sie drin und
niemand findet das komisch.

Fürs Produkt heißt das: **der Code macht es heute richtig.** Er erzeugt
Leibungspositionen nur, wenn im Diktat davon die Rede war, und erfindet keine.
Genau so soll es bleiben — **keine automatische Leibungsposition**, und der
zurückgestellte Backlogpunkt bleibt liegen. Da sind wir uns einig, das stützt
sich gegenseitig.

**Frage 3 (VOB-005) — Abdecken: hier liegst du falsch, die Position bleibt.**
Deine Vermutung stimmt, und stärker als du sie formuliert hast. „Boden
abdecken" und „Möbel abdecken" stehen bei praktisch jedem Wohnungsauftrag als
eigene Zeile. Zwei Gründe, beide handfest:

1. **Der Kunde will es sehen.** Die häufigste Sorge vor einem Malerauftrag ist
   nicht der Preis, sondern „was passiert mit meinem Parkett und meiner Couch".
   Die Zeile beantwortet das, bevor er fragt. Streichst du sie, klingt das
   Angebot billiger und weniger sorgfältig zugleich — die schlechteste
   Kombination, die es gibt.
2. **Der m²-Preis ist entsprechend knapper kalkuliert.** 9,50 €/m² für zweimal
   Anstrich ist ohne Schutzaufwand gerechnet. Wer alles in den Einheitspreis
   packt, landet bei 11–12 €/m² und sieht neben drei anderen Angeboten teuer
   aus, obwohl er dasselbe tut.

Deine Schlussfolgerung stimmt trotzdem, nur an anderer Stelle: **nicht die
Position ist das Problem, sondern die Zeile „VOB/C DIN 18363" darüber.** Wer
nicht nach VOB abrechnet, darf es auch nicht behaupten. Läuft über VOB-007,
hier ist nichts zu bauen. Bei „Schalter/Steckdosen abkleben" gebe ich dir
recht, dass es ein Grenzfall ist — praktisch klebt man ab, statt abzunehmen,
weil es schneller geht. Würde ich lassen.

**Frage 5 (VOB-009) — Stückpreise: bestätigt, bleibt so.**
Türen und Fenster werden im Wohnungsbau ausnahmslos nach Stück gerechnet.
Flächenabrechnung sieht man nur in großen Leistungsverzeichnissen bei
öffentlichen Ausschreibungen. Für den Kunden ist „Innentürblatt lackieren,
beidseitig, 90 €" auch die verständlichere Zeile. Dass der Katalog Türblatt und
Zarge trennt, ist genau richtig. Kein Handlungsbedarf — außer wieder: nicht
„VOB/C" drüberschreiben.

**Frage 6 (VOB-012) — Sockelleisten: durchmessen, du hast recht, und es kostet
Geld.**
Wir ziehen keine Zimmertür ab. Man misst den Raumumfang und zieht nur echte
Unterbrechungen ab — Terrassentür, breiter Durchgang, Schiebetürelement. Bei
einer 90er-Tür frisst der Zuschnitt an der Zarge, die Gehrung und das
Verschnittstück die eingesparten 90 Zentimeter ohnehin auf. Norm und Praxis
sind hier ausnahmsweise einer Meinung. Auch bei **„Sockelleisten abkleben"**
würde ich durchmessen, obwohl dort tatsächlich keine Leiste liegt: der
Anschnitt am Türrahmen ist die fummeligste Stelle der ganzen Bahn.

**Mein Vorschlag, praxis- und normkonform in einem Satz:** *Von der
Sockelleistenlänge werden nur Öffnungen ab 1,00 m Breite abgezogen.* Terrassentür
raus, Zimmertür drin, und es ist dieselbe Logik wie bei der Wandfläche.

**Das ist eine Geldentscheidung und braucht Sandys Go:** rund 2,7 lfdm mehr pro
Wohnung, diesmal **zugunsten** des Betriebs — bei Sockelleisten-Montage zu
8–12 €/lfdm also 20 bis 30 € je Angebot. Bis das entschieden ist, stehen meine
Soll-Lösungen in `pruefmeister-testfaelle.md` auf dem heutigen Abzug; die
betroffenen Zeilen sind dort mit `[VOB-012]` markiert und ändern sich alle
gemeinsam. Und ja — die PM-007-Beobachtung („Türabzug trotz ‚Türen: 0'") ist
dieselbe Codestelle.

**Frage 7 — was das Produkt gar nicht abbildet: Material kommt in Paketen.**
Laminat und Vinyl werden in Paketen zu gut 2 m² verkauft. Kein Bodenleger
bestellt 21,0 m² — er bestellt zehn Pakete und hat 22,2 m² auf der Baustelle.
Genau daraus ist die Verschnitt-Faustregel überhaupt entstanden: sie ist eine
**Einkaufsregel**, keine Abrechnungsregel. Im Code gibt es dafür nichts; „Paket"
kommt im ganzen Mengen-Teil kein einziges Mal vor und im Katalog zweimal, beide
Male in einem fremden Gewerk.

Für VOB-001 ist das der eigentlich saubere Weg: **Verlegefläche als Menge,
Materialbedarf als Paketaufrundung in der Kalkulation.** Dann verschwindet der
Streit über die Nachkommastelle ganz, und der Betrieb sieht trotzdem, was er
bestellen muss. Das wäre auch für den Handwerker ein echter Mehrwert, den keine
Wettbewerbssoftware bietet — bisher rechnet er die Pakete auf dem
Bierdeckel aus.

**Noch ein Praxis-Hinweis zu VOB-011, ungefragt:** Der Normtext ist nicht das,
womit Meisterbetriebe arbeiten. In fast jedem Meisterbüro steht **„VOB im Bild —
Hochbau- und Ausbauarbeiten"**: dasselbe Aufmaßregelwerk, aber mit Zeichnungen
und Rechenbeispielen, und es ist ausdrücklich zum Zitieren gedacht. Kostet in
der Größenordnung der Gesamtausgabe. Für unsere Fragen („wird die Leibung
gesondert gerechnet, wie wird sie gemessen") ist das oft die brauchbarere
Quelle als der Normsatz selbst, weil es die Anwendung zeigt. Als vierte Option
für Sandy, neben deinen dreien.

---

### 2026-09-01 — Prüfmeister, drei Punkte

1. **Widerspruch zwischen zwei Legal-Dokumenten aufgedeckt.** In
   `legal-001-bestandsaufnahme.md` stand unter „Kann warten", die
   zurückgestellte Leibungsregel sei „korrekt so" — direkt gegenläufig zu
   VOB-003 („bitte nicht bauen"). Beide Dateien lagen nebeneinander in `docs/`.
   **Berechtigt und wichtig:** Der Bericht entstand vor der DIN-Recherche und
   wurde danach nicht nachgezogen. Korrigiert am 2026-09-01 mit einem
   Korrekturkasten an der Stelle; maßgeblich ist VOB-003. Mein Fehler, nicht
   seiner — und genau die Sorte Fehler, die in einer Dokumentenlandschaft
   Schaden anrichtet, weil jemand die falsche Datei liest.
2. **VOB-006 fachlich richtiggestellt.** Ich hatte die Gerüst-Nebenleistung
   (DIN 18363 4.1.1, bis 3,50 m) gegen den Erschwerniszuschlag für hohe Räume
   gestellt — zwei verschiedene Fragen. Der Zuschlag ist ab drei Metern
   branchenüblich, weil man dort Böcke statt Leiter braucht. Begründung in
   VOB-006 ersetzt, Frage 4 damit beantwortet. Sein Hinweis, dass die
   **Schlussfolgerung** (Zeile „Normgrundlagen" gehört weg) trotzdem trägt,
   stimmt — sie trägt aus den anderen drei Gründen.
3. **Pfadangabe präzisiert.** `standardVerschnitt()` liegt in
   `src/lib/boden-normalisierer.ts`, nicht unter `mengen/`. In VOB-002 jetzt
   ausgeschrieben. (Nebenbei: in `pruefmeister-testfaelle-archiv.md`, Zeilen
   341 und 355, steht noch der alte Pfad `mengen/gewerke/boden.ts` — dort war
   die Funktion vermutlich mal. Nur zur Kenntnis, das Archiv fasse ich nicht
   an.)

**Offen aus dieser Rückmeldung:** nichts. Die Fragen 1, 2, 3, 5, 6 und 7 sind am
2026-09-02 beantwortet — siehe Rückmeldung oben.

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
4. ~~**VOB-006** — Ab welcher Raumhöhe rechnet ein Maler in der Praxis einen
   Zuschlag?~~ **✅ beantwortet am 2026-09-01:** Ab drei Metern ist ein Zuschlag
   völlig üblich — dort arbeitet man nicht mehr von der Leiter, sondern stellt
   Böcke, und das kostet Zeit. Die 3-m-Schwelle bleibt. Offen bleibt allein die
   Konsistenz (drei Schwellen, zwei Einheiten).
5. **VOB-009** — Türen und Fenster nach Stück: branchenüblich, oder siehst du
   Flächenabrechnung?
6. **VOB-012** — Zieht ihr bei Sockelleisten die Türbreiten ab, oder messt ihr
   durch? Die Norm sagt: bis 1 m Unterbrechung durchmessen.
7. **Allgemein** — Gibt es eine Abrechnungsregel, die du aus der Praxis kennst
   und die das Produkt gar nicht abbildet? Ich habe hier von der Norm her
   gesucht. Der umgekehrte Blick fehlt mir.

8. **Leibungen, Einheit (neu, 04.09.)** — Rechnest du Fensterleibungen in
   **laufenden Metern** oder in **Quadratmetern** ab? Die Norm listet Leibungen
   unter Längenmaß (DIN 18363, 0.5.2), unser Produkt rechnet Quadratmeter. Der
   Abschnitt ist ausdrücklich kein Vertragsbestandteil, also ist beides
   zulässig — mich interessiert, was ein Privatkunde erwartet, wenn er die
   Position liest.

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

## VOB-004 erledigt (Head of Product Engineering, 2026-09-02)

Der Übermessungshinweis steht auf dem Kunden-PDF. Umgesetzt wie vom Product
Designer vorgeschlagen und von Legal vorgegeben: die konkreten Zahlen an der
Position, die Erklärung einmal unter der Positionsliste — nicht in der
Fußzeile, nicht in Fußzeilengrau (8,5 pt / #444444).

Die Datenanbindung, die als Blocker galt, war keiner: `annahmen` steht bereits
als `jsonb` in `quote_items` und wird von `generiere-positionen` befüllt, und
die PDF-Route lädt `quote_items(*)`. Der Hinweis lag also die ganze Zeit im
Item — nur las ihn niemand. Er wird über eine Textprobe erkannt statt über ein
neues Feld, damit auch **bereits erzeugte Angebote** ihn zeigen; ein neues
Feld hätte den Bestand nicht erreicht.

Dabei zwei Nebenfunde derselben Klasse gefixt:

- **Version 2 verlor die Erklärung.** `api/quotes/[id]/revise` kopierte beim
  Anlegen einer Überarbeitung nur Titel, Menge, Einheit und Preis —
  `berechnungsweg`, `annahmen`, `price_item_id` und `automatisch_ergaenzt`
  fielen still weg. Der Kunde hätte auf Revision 2 eine andere Erklärung
  bekommen als auf Revision 1, und der Handwerker den Rechenweg verloren.
  Gleiches beim Duplizieren (`handleDuplicate` → `api/quotes/create`). Beide
  Wege reichen die Felder jetzt durch.
- **Die Menge stand englisch im PDF:** „46.64 m²" direkt neben „12,50 €".
  Jetzt `Intl.NumberFormat('de-DE')` → „46,64".

Abgesichert durch `src/lib/__tests__/pdf-uebermessung-render.test.ts`: rendert
das PDF echt, packt die Content-Streams aus und liest den Text — beide
Renderpfade, plus Gegenprobe ohne Übermessung. Suite 63 Dateien / 1.115 Tests
grün.

VOB-003 und VOB-012 rühre ich weiterhin nicht an, bis die Normtexte vorliegen.

---

## VOB-013 erledigt (Head of Product Engineering, 2026-09-03)

Leibungen rechnen ab sofort **dreiseitig**: Sturz oben, zwei Wangen seitlich.
Unten sitzt beim Fenster die Fensterbank, bei der Tür der Fußboden — dort gibt
es keine Leibungsfläche.

| | vorher | jetzt |
|---|---|---|
| Standardfenster 1,20 × 1,00 m, 25 cm tief | 1,10 m² | **0,80 m²** |
| Tür 0,90 × 2,10 m, 25 cm tief | 1,50 m² | **1,27 m²** |

**Ein Punkt, an dem ich vom Auftragstext abgewichen bin — bitte gegenlesen.**
CoS-036 bat darum, die Position „Fensterbänke streichen" beim Fix „mit zu
entfernen", weil sie dieselbe Fläche ein zweites Mal berechne. Das trifft die
Ursache, aber die Folge wäre zu weit gegangen: Die Doppelzählung war die
Rundum-Formel, nicht die Bank-Position. Die untere Zeile (0,30 m²) steckte im
Umfang **und** in der eigenen Position — genau diese 0,30 m² sind die
Differenz zwischen 1,10 und 0,80 in eurem eigenen Zahlenbeispiel. Nach der
Umstellung auf drei Seiten wird die Bankfläche also **genau einmal** gezählt.
Hätte ich die Position zusätzlich entfernt, wäre eine ausdrücklich genannte
Fensterbank gar nicht mehr berechnet worden — aus „ein Drittel zu viel" wäre
„zu wenig" geworden. Wenn ihr das anders seht, sagt es, dann ändere ich es.

**Abgesichert** (`vob013-leibungen.test.ts`, 8 Tests): dreiseitige Fläche für
Fenster und Türen, Anzahl, Rechenweg-Text, und für die Fensterbank die drei
Fälle — einmal gezählt bei Innenleibung mit Erwähnung, gar nicht ohne
Erwähnung, gar nicht bei Außenleibung. Zusätzlich ein Test, der festhält, dass
Leibung + Bank zusammen wieder 1,10 m² ergeben: dieselbe Gesamtfläche, aber als
zwei getrennte, je einmal gezählte Posten.

**VOB-003 bleibt unberührt** und wartet weiter auf den Normkauf: Ob Leibungen
übermessener Öffnungen überhaupt separat berechnet werden dürfen, ist die
Frage nach dem „Ob". Hier ging es nur um das „Wie viel".

**Für den Prüfmeister**, damit du den Fall live nachsprechen kannst: „Drei
Fenster ein Meter zwanzig auf einen Meter, Leibungstiefe fünfundzwanzig
Zentimeter" muss **2,40 m²** ergeben (3 × 0,80), vorher waren es 3,30 m².

---

## VOB-011 erledigt — der Normtext liegt vor (Head of Legal & Compliance, 2026-09-04)

Sandy hat die **VOB Gesamtausgabe 2019** (Beuth Verlag, ISBN 978-3-410-61299-5)
beschafft — also die Variante, die ich als die günstige empfohlen hatte. Damit
sind **ATV DIN 18363:2019-09** und **ATV DIN 18365:2019-09** im Original
verfügbar, und alle sechs Fragen aus VOB-011 sind beantwortet.

**Zum Umgang mit dem Text:** Ich zitiere hier nur die Sätze, die zur Klärung
nötig sind. Der Volltext kommt nicht in unsere Dateien und nicht ins Repository
— das Werk ist urheberrechtlich geschützt, die Lizenz ist eine personenbezogene
Einzelplatzlizenz auf Sandra Holm.

**Der Vorbehalt aus dem Abschnitt „Wichtiger Vorbehalt zur Quellenlage" ist für
die hier behandelten Punkte damit aufgehoben.** Was unten steht, ist am
Originaltext geprüft, nicht aus Sekundärquellen abgeleitet.

---

### VOB-003 — geklärt. Meine Lesart war richtig, wörtlich.

DIN 18363:2019-09, Abschnitt 5.2.3, im Original:

> „Beschichtete Rückflächen von Nischen sowie Leibungen werden unabhängig von
> ihrer Einzelgröße mit ihren Maßen gesondert gerechnet."

Das ist Wort für Wort der Satz, den ich aus zwei Sekundärquellen zitiert hatte.
Die Gegenstimmen aus der freien Recherche — Leibungen seien bei übermessenen
Öffnungen in der Wandfläche enthalten — sind damit **widerlegt**, nicht nur
schwach belegt.

Dazu passt Abschnitt 5.3.1: Übermessen werden „Aussparungen mit einer
Einzelgröße ≤ 2,5 m², z. B. Öffnungen (auch raumhoch), Nischen". Die Öffnung
wird übermessen, **und** die beschichtete Leibung derselben Öffnung wird
zusätzlich gerechnet. Beides gleichzeitig, ohne Ausnahme für kleine Öffnungen.

**Eine Einschränkung, die im Wortlaut steckt und die wir beachten müssen:** Es
heißt „**beschichtete** Rückflächen … sowie Leibungen". Gerechnet wird nur, was
tatsächlich gestrichen wird. Eine nicht gestrichene Fensterleibung ergibt keine
Position. Ob das Produkt das unterscheidet, sollte Engineering prüfen — heute
erzeugt jede erfasste Leibung eine Position.

**Auftrag an Head of Product Engineering:** Der Backlog-Punkt im Kommentarkopf
von `vob-uebermessung.ts` und der gleichlautende Punkt 3 in
`pruefmeister-testfaelle.md` sind **nicht „strittig", sondern falsch**. Bitte
ersatzlos streichen statt umformulieren, mit Verweis auf DIN 18363:2019-09
Abschnitt 5.2.3, damit ihn niemand in einem halben Jahr wieder aufgreift.

---

### Korrektur an mir selbst: die Einheitenfrage war NICHT geklärt

Am 02.09. habe ich hier geschrieben:

> „**Geklärt ist dagegen die Einheitenfrage:** Die Längenmaß-Variante, die mich
> irritiert hatte, stammt aus DIN 18350 (Putzarbeiten), nicht aus DIN 18363.
> `maler.ts` rechnet nach Fläche und liegt damit richtig."

**Das ist falsch.** Die Längenmaß-Variante steht in DIN 18363 selbst. Abschnitt
0.5.2 („Abrechnungseinheiten") führt unter **Längenmaß (m), getrennt nach
Bauart und Maßen** als ersten Spiegelstrich auf: **„Leibungen"**. Im
Flächenmaß-Katalog 0.5.1 tauchen Leibungen nicht auf.

Ich habe eine Sekundärquelle einer anderen Norm zugeordnet, weil das zu meiner
These passte, und das Ergebnis dann als „geklärt" bezeichnet. Das war derselbe
Fehler wie bei der Groq-Sache: eine Aussage über den Code, die ich nicht am
Original geprüft hatte.

**Was daraus folgt — und hier bitte ich um Vorsicht statt um einen schnellen
Umbau:**

Abschnitt 0 der ATV heißt „Hinweise für das Aufstellen der
Leistungsbeschreibung" und sagt über sich selbst ausdrücklich: **„Die Hinweise
werden nicht Vertragsbestandteil."** Die Abrechnungseinheit aus 0.5.2 ist also
**keine Abrechnungsregel, die man verletzen kann** — sie ist die Vorgabe dafür,
wie ein VOB-konformes Leistungsverzeichnis aufgebaut sein soll. Wer nach m²
abrechnet, rechnet nicht falsch; er weicht von der branchenüblichen
Positionsstruktur ab.

Praktisch heißt das:

- **Die Menge ist nicht falsch.** `anz × Umfang × Tiefe` ergibt die tatsächlich
  gestrichene Fläche, und nach VOB-013 mit dem richtigen dreiseitigen Umfang.
- **Die Position ist unüblich.** Ein Handwerker, der unser Angebot neben ein
  LV nach VOB legt, findet dort „Leibungen … m", bei uns „Leibungen … m².
  Vergleichbar sind die beiden Zahlen nicht.
- **Der Umbau wäre klein** (Menge `anz × Umfang`, Tiefe wandert in die
  Positionsbezeichnung und damit in den Einheitspreis), **aber er ändert
  Preise**, weil der Einheitspreis pro laufendem Meter ein anderer ist als pro
  Quadratmeter.

**Das ist deshalb keine Engineering-Entscheidung, sondern eine für Sandy und
den Prüfmeister** — und sie gehört zu VOB-001 und VOB-014, weil es dieselbe
Frage ist: Wie nah wollen wir an der VOB-Positionsstruktur liegen, wenn die
meisten Angebote unserer Nutzer gar keine VOB-Verträge werden?

**Frage an den Prüfmeister (neu, Nr. 8):** Rechnest du Fensterleibungen in
laufenden Metern oder in Quadratmetern ab, und was erwartet ein Privatkunde,
wenn er die Position liest?

---

### VOB-008 — geklärt: 0,1 m². Beide bisher genannten Werte waren falsch.

DIN 18365:2019-09, Abschnitt 5.3.1:

> „Übermessen werden: Bei Abrechnung nach Flächenmaß — Aussparungen ≤ 0,1 m²
> Einzelgröße, in Bodenbeläge eingearbeitete Teile, z. B. Intarsien,
> Markierungen, Fugen und Profile."

**0,1 m²**, nicht 0,5 und nicht 2,5. Das ist der Faktor 25 gegenüber der
Malerregel, und es ist die strengste Übermessungsschwelle, die mir in der
ganzen VOB/C begegnet ist.

**Woher die 0,5 m² kamen, die uns verwirrt haben:** Der Wert existiert
tatsächlich — aber in **DIN 18363** (Maler), Abschnitt 5.3.1, letzter Halbsatz:
„Aussparungen in Böden mit einer Einzelgröße ≤ 0,5 m²". Das gilt für das
**Beschichten** eines Bodens, nicht für das **Belegen**. Zwei Gewerke, zwei
Zahlen, und die Sekundärquellen haben sie vermischt.

**Was das für das Produkt heißt:** Bei Bodenbelagarbeiten muss praktisch alles
abgezogen werden — eine Türöffnung, ein Kaminsockel, eine Rohrdurchführung
größer als etwa 32 cm × 32 cm. Wenn `boden.ts` die 2,5-m²-Schwelle aus
`vob-uebermessung.ts` mitbenutzt, rechnet es die Fläche systematisch zu groß.
**Bitte prüfen, Head of Product Engineering** — das ist ein Fehler zugunsten
des Betriebs und damit einer, der beim Kunden auffällt.

Nebenbefund aus 5.1: Bei Sockelleisten, Fugen und Profilen ist die
Abrechnungsgröße die **Länge**, nicht die Fläche — das deckt sich mit dem, was
das Produkt tut.

---

### VOB-012 — bestätigt: Öffnungen unter 1,00 m werden durchgemessen

DIN 18363:2019-09, Abschnitt 5.3.2:

> „Bei Abrechnung nach Längenmaß: Unterbrechungen mit einer Einzellänge ≤ 1 m."

Dieselbe Regel wortgleich in DIN 18365, Abschnitt 5.3.2. Die Praxisantwort des
Prüfmeisters und die Norm sagen dasselbe.

`maler.ts` zieht an **zwei** Stellen die vollen Türbreiten von der
Sockelleistenlänge ab (`berechneSockelleistenLaenge(...)` und die Inline-Variante
`effUmfangWZ − tuerBreiten`). Beide sind bei einer Standardtür von 0,90 m
falsch, und zwar zulasten des Betriebs. **Bitte beide Stellen anfassen**, nicht
nur die Hilfsfunktion — bei einem Zimmer mit zwei Türen sind das 1,80 lfdm, die
niemand bezahlt bekommt.

---

### VOB-001 / VOB-002 — der Verschnitt hat in der Norm keine Grundlage

Ich habe die gesamte VOB/C nach „Verschnitt" durchsucht. Der Begriff kommt vor,
aber nur bei **Betonstahl** (dort ausdrücklich mit einer 10-%-Regel) und bei
**Leitungen** (dort ausdrücklich „Verschnitt wird dabei nicht berücksichtigt").
**In DIN 18365 kommt er nicht vor.** Dort heißt es in Abschnitt 5.1 schlicht,
zugrunde zu legen seien „die Maße der belegten Fläche, oder der hergestellten
Beläge".

Verschnitt ist keine belegte Fläche. Wo der Normgeber wollte, dass Verschnitt in
die Menge eingeht, hat er es hingeschrieben; bei Bodenbelägen hat er es nicht.
**Der Aufschlag auf die abgerechnete Menge hat damit keine Normgrundlage** — er
gehört in den Einheitspreis oder in eine klar bezeichnete Materialposition.
Das stützt VOB-001 und ist zugleich die Antwort auf VOB-014: Paketaufrundung ist
eine **Material**frage, keine **Mengen**frage.

Das ist kein Verbot. Bei einem BGB-Vertrag mit einem Privatkunden gilt die VOB/C
ohnehin nur, wenn sie vereinbart wurde. Aber solange die Zeile „Normgrundlagen"
im PDF VOB-Konformität behauptet (VOB-007), ist ein stiller 5-%-Aufschlag auf
die Quadratmeter genau die Art von Detail, die ein Prüfmeister findet.

---

### VOB-005 / VOB-006 — meine Zuordnung der Nebenleistungen war richtig

Am Original geprüft und bestätigt: 4.1.1 (Gerüste bis 3,50 m = Nebenleistung),
4.1.3 (loses Abdecken), 4.1.6 (Reinigen des Untergrundes), 4.2.5 (Gerüste über
3,50 m = Besondere Leistung), 4.2.10 (grobe Verschmutzung), 4.2.11 (Abkleben).
Alles wie in „Normlage kompakt" beschrieben.

**Ein Detail, das wir noch nicht hatten und das ins Produkt gehört:** Nach 4.1.4
ist das Entfernen und Wiederanbringen von **bis zu fünf** Schalter- und
Steckdosenabdeckungen **je Raum** eine Nebenleistung. Alles darüber ist nach
4.2.30 eine Besondere Leistung und damit gesondert vergütungsfähig. Eine sehr
konkrete, gut prüfbare Zahl — und ein plausibler Kandidat für eine Rückfrage im
Aufmaß.

---

### VOB-009 — die Antwort „bleibt so" stimmt, die Begründung war unvollständig

VOB-009 steht als „✅ geklärt: Stückpreise sind branchenüblich". Der Normtext
sagt etwas anderes, und das gehört dazu:

- 5.2.6: „Fenster, Türen, Trennwände, Bekleidungen und dergleichen werden je
  beschichtete Seite nach Fläche gerechnet."
- 0.5.1 führt Türen, Tore, Zargen, Fenster, Rollläden und Fensterläden unter
  **Flächenmaß** auf.
- 5.4.2 setzt voraus, dass auch nach Anzahl gerechnet werden **kann**, und
  regelt dafür eine Toleranz: „Werden Türen, Fenster, Rollläden und dergleichen
  nach Anzahl gerechnet, bleiben Abweichungen von den vorgeschriebenen Maßen
  bis jeweils 5 cm in der Höhe und Breite sowie bis 3 cm in der Tiefe
  unberücksichtigt."

Der Regelfall der Norm ist also die Fläche; die Stückabrechnung ist zulässig,
aber die Ausnahme. **Am Ergebnis ändert das nichts** — Stückpreise bleiben, weil
die Praxis das so macht und die Norm es zulässt. Aber die Zeile „Normgrundlagen"
(VOB-007) sollte das nicht als VOB-Regelfall ausgeben.

---

### Was jetzt an wen geht

| Was | An wen | Dringlichkeit |
|---|---|---|
| Backlog-Punkt Leibungen ersatzlos streichen (VOB-003) | Head of Product Engineering | sofort, 5 Minuten |
| Türbreiten-Abzug an **beiden** Stellen entfernen (VOB-012) | Head of Product Engineering | vor Gate 1 |
| Prüfen, ob `boden.ts` mit 2,5 m² statt 0,1 m² rechnet (VOB-008) | Head of Product Engineering | vor Gate 1 — Fehler zulasten des Kunden |
| Leibungen: nur rechnen, wenn tatsächlich beschichtet | Head of Product Engineering | vor Gate 1 |
| Einheit der Leibungsposition (m vs. m²) | Sandy + Prüfmeister, Frage 8 | Entscheidung, kein Fix |
| Verschnitt aus der Menge in den Preis (VOB-001/002/014) | Sandy | Entscheidung steht weiter aus |
| Zeile „Normgrundlagen" (VOB-007) | Product Designer + Legal | hängt an allem oben |

**Was ich als Nächstes tue:** Die sechs Antworten des Prüfmeisters vom 02.09.
und VOB-014 habe ich weiterhin nicht durchgesehen — das kommt als Nächstes, jetzt
mit dem Normtext daneben.

---

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
