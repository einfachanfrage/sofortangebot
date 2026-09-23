# Themenspeicher — was in den Testfällen noch abgedeckt werden muss

**Zweck:** Damit nichts vergessen wird. Hier steht jedes Thema, das in einem
echten Auftrag vorkommt, mit dem Stand seiner Abdeckung. Kein Thema wird aus
dieser Liste gelöscht, wenn es abgedeckt ist — es bekommt die Fallnummer
dahinter. Gelöscht wird nur, was sich als gegenstandslos erweist.

**Warum es die Liste gibt:** Die ersten 37 Fälle waren alle rechteckige Räume mit
Fenstern und Türen — die Welt, die das Datenmodell ohnehin kann. Alles, was *in*
einem Raum steht, kam nicht vor. Diese Liste ist die Gegenprobe: sie wird nicht
aus dem Datenmodell abgeleitet, sondern aus der Baustelle.

**Zielgröße:** 100 Fälle — am 17.09. erreicht und überschritten. Stand 23.09.2026: **146**
*(die Aufzählung darunter zählt den Stand vom 16.09., sie wird nicht fortgeschrieben)*
**Alt: 97**
(46 + PM-047 bis PM-056 + PM-057 bis PM-063 + PM-064 bis PM-068
+ PM-069 bis PM-078 + PM-079 bis PM-088 + PM-089 bis PM-097).

---

## A — Bauteile im Raum *(die Lücke vom 10.09.)*

| Thema | Stand |
|---|---|
| Freistehende Säule / Stahlstütze, Maler **und** Boden im selben Angebot | **PM-038** |
| Gemauerter Pfeiler, Keller, niedrige Höhe | **PM-044** |
| Heizkörper streichen, mehrere je Wohnung | **PM-039** |
| Heizkörper bleibt ausdrücklich — darf keine Position werden | **PM-043** |
| Heizungsrohre / Rohrleitungen lackieren | **PM-044** |
| Stuckprofil umlaufend, Altbau | **PM-039** |
| Deckenrosette | **PM-070** 🔴 — gesagt, keine Zeile; Katalog hätte zwei |
| Sichtbalken / Balkendecke, Altbau | **PM-071** 🔴 — gesagt, keine Zeile |
| Einbauküche bleibt stehen, wird abgeklebt | **PM-041** |
| Einbauschrank vor der Wand | gemessen, ohne Fund: keine Zeile, keine Rückfrage, Wandfläche unverändert. Gehört zu PM-041 |
| Kamin / Kaminsockel im Raum (Boden: Aussparung) | **PM-074** 🔴 — Nebensatzmaß baut eine Sockelleistenzeile |
| Wandnische im Bad, gefliest (eigene Katalogzeile, 95,00 €/Stück) | **PM-075** 🔴 — Nischensatz ändert nichts. **17.09.: Bauauftrag steht** — bepreiste Position, Anzahl aus dem Satz (Einheit ist Stück, nichts zu messen). Engineering, Zug 2 |
| Erker (Zusatzfläche über 2,5 m²) | **PM-081** 🔴 — gesagte Zusatzfläche verschwindet spurlos |
| Wandnische / Regalnische | **PM-089** ✅ **gebaut** (Engineering, 17.09.) — der Satz hinterlässt jetzt einen Fehlt-Eintrag, Wortlaut vom Prüfmeister am 17.09. getauscht (Rückwand + Laibungen, nicht nur Laibungen). Katalog-Lücke bleibt, bepreiste Zeile bewusst nicht. **Neu offen als eigener Fall: dieselbe Nische im TAPEZIER-Diktat** — die Katalogzeile gibt es dort (6,00 €/lfdm), sie hinterlässt trotzdem keine Spur. Menge entschieden: `2 × (Breite + Höhe)` der Öffnung, ohne Höhe nur Fehlt-Eintrag (Prüfmeister, 17.09.) |
| Rollladenkästen | **PM-076** 🔴 — **Katalog-Lücke**, nicht Code |
| Bodenluke, Bodentank, Revisionsklappe | **PM-082** 🔴 — Katalogzeile da (35,00 €/St), keine Position |

## B — Zustand der Baustelle *(bewohnt, belegt, dreckig)*

| Thema | Stand |
|---|---|
| Bewohnte Wohnung, Möbel rücken und abdecken (Besondere Leistung, DIN 18363 4.2) | **PM-039** |
| Möbel komplett ausräumen und zurückräumen | **PM-069** 🔴 — beide Katalogzeilen da, keine kommt |
| Küche/Bad im Betrieb, nur abkleben | **PM-041** |
| Bodenbelag bleibt und muss geschützt werden vs. Boden wird neu (dann **kein** Abdecken) | **PM-038** |
| Fliesenspiegel wird ausgespart | **PM-041** |
| Schimmelbefall, Behandlung vor Anstrich | **PM-043** |
| Nikotin-/Rußbelastung, Sperrgrund nötig | **PM-046** (fünf Funde) + **PM-064** ✅ + **PM-079** 🔴 (zwei Räume, nur einer bekommt ihn) + **PM-080** 🔴 (die Ursache allein löst nichts aus) |
| Alte Tapete muss runter, Zustand unbekannt | **PM-077** — Zeile stimmt, trägt aber `automatisch_ergaenzt` |
| Baustelle bewohnt → Staubschutzwand, Abendreinigung | **PM-090** 🔴 — „bewohnt" allein wirkt (Möbel, Zuschlag), beide Zusatzleistungen nicht. Staubschutzwand 14,00 €/m² liegt im gesperrten Abbruch ⇒ Fehlt-Eintrag; Endreinigung 45,00 €/Stunde liegt im **aktiven** Maler |

## C — Haustechnik unter dem Belag

| Thema | Stand |
|---|---|
| Fußbodenheizung: Aufpreis, Verklebung, **keine** Trittschalldämmung, CM-Messung | **PM-040** |
| Frischer Estrich, Belegreife ungeklärt | **PM-040** |
| Elektrische Heizmatte | **PM-083** 🔴 — Aufpreis FBH und CM-Zuschlag entstehen nicht |
| Estrich rissig, muss verharzt werden | **PM-091** 🔴 — Katalogzeile da und auffindbar (`Estrichriss kraftschlüssig verharzen und verklammern`, 18,00 €/lfdm), es entsteht nichts. 8 lfdm = **144,00 €** |
| Feuchter Untergrund, Sperrschicht nötig | **PM-084** 🔴 — „Sperrschicht" wirkt beim Maler, beim Boden nicht |

## D — Geometrie jenseits des Rechtecks

| Thema | Stand |
|---|---|
| Wechselnde Raumhöhe: Treppenhaus, Luftraum, Galerie | **PM-042** |
| Treppe: Stufen, Setzstufen, Wangen, Geländer | **PM-065** 🔴 — keine einzige Treppenposition entsteht |
| L-förmiger Raum | PM-035 ✅ |
| Dachschräge, Kniestock | PM-007, PM-030 ✅ |
| Runder Raum / Rundung in der Wand | **PM-085** 🔴 — **keine einzige Position**, das Angebot bleibt leer |
| Raum mit Podest / Stufe im Raum | **PM-086** 🔴 — gesagtes Podest ohne Wirkung |
| Sehr niedrige Räume (< 2,20 m, Keller) | **PM-044** |

## E — Sprache und Aufnahme *(wie Handwerker wirklich reden)*

| Thema | Stand |
|---|---|
| Selbstkorrektur mitten im Satz („nee warte, doch drei Meter") | teilweise PM-001, eigener Fall offen |
| Zahlwörter, Dialekt, „zwo", „einskommafünf" — **bei den Maßen** | PM-034, PM-035 ✅ |
| Zahlwörter bei **Stückzahlen** („vier Türen", „zwei Fenster") — anderer Codeweg, war nie geprüft | **PM-045-B** 🔴 |
| Mehrere Aufnahmen zu einem Angebot | offen — **gehört in den Live-Lauf**: das Zusammenführen passiert oberhalb der Pipeline |
| Kunde redet im Hintergrund dazwischen | offen |
| Unterbrechung, Aufnahme bricht ab und wird fortgesetzt | offen |
| Handwerker nennt Preise selbst („das mach ich für 12 den Meter") | **PM-092** 🔴 — der gesagte Preis wird verworfen, gerechnet wird mit dem Katalog. 21 m² × 16,00 € statt × 12,00 € = **84,00 € über seinem eigenen Wort**. Positivbefund: die Zahl wandert nicht ins Aufmaß |
| Handwerker nennt Stunden statt Mengen | **PM-093** 🔴 — **null Positionen, null Fehlt-Einträge.** Jedes Gewerk hat Stundenzeilen im Katalog (Maler 65,00 €/h), die Engine hat keinen Weg dorthin. 6 h = **390,00 €** |
| Sehr kurze Aufnahme („Wohnzimmer streichen, 20 Quadrat") | **PM-094** 🔴 — das ganze Angebot ist **eine Zeile, die niemand gesagt hat** („Boden schützen", 24,00 €, `automatisch_ergaenzt` **und** bepreist). Verletzt „Nichts erfinden" und K.4/K.5 zugleich |
| Widersprüchliche Angaben im selben Diktat | **PM-095** 🔴 — die spätere Zahl gewinnt wortlos, 45 m² → 30 m². Dass sie gewinnt, ist richtig (PM-001); dass es niemand erfährt, kostet **142,50 €**. Frage an den Designer: PD-018 Punkt 1 |

## F — Gewerke, die noch nie getestet wurden

| Thema | Stand |
|---|---|
| Bad / Fliesen (DIN 18352) | **PM-060 bis PM-062** 🔴 — sieben Zeilen ohne Preis, siehe Restliste |
| Treppen komplett | **PM-066** 🔴 — Stufen erkannt, alle ohne Preis |
| Türen, Zargen, Fenster lackieren | **PM-045** — drei Funde, siehe Restliste |
| Trockenbau: Wand stellen, Decke abhängen | **PM-068** 🔴 — ganzes Gewerk ohne Preis |
| Abbruch und Entsorgung, Container | **PM-067** 🔴 — bestellter Container fehlt |
| Estrich | **PM-072** 🔴 — wird zur Belagszeile ohne Preis |
| Fassade mit Gerüst | **PM-073** ✅ — Fläche, Öffnungsabzug und Gerüst stimmen |

## G — Kaufmännisches und Vertragliches

| Thema | Stand |
|---|---|
| Kleinauftrag: Anfahrt und Mindestmenge tragen den Preis | **PM-087** 🔴 — Anfahrt gesagt, keine Zeile (Mindestwert ist eine Einstellung, kein Katalogpunkt) |
| Aufmaß nachträglich korrigiert (Bearbeiten-Ansicht) | PM-031 |
| Nachtrag zu einem bestehenden Angebot | **PM-096** 🔴 — „Nachtrag" wirkt nirgends, es entsteht ein normales Erstangebot. Trägt Anfahrt und Kleinmaterial ein zweites Mal. Zusammenführen liegt oberhalb der Pipeline (Live-Lauf), das **Bemerken** nicht |
| Skonto / Zahlungsziel / Abschlagszahlungen | offen (Legal) |
| Kunde will Material selbst stellen | **PM-088** 🔴 — der Satz kommt gar nicht erst an |
| Zwei Bauabschnitte, getrennte Angebote | **PM-097** 🔴 — „wird getrennt abgerechnet" wirkt nirgends: eine Liste, eine Summe über beide Abschnitte. **17.09.: Sollstand nach DC-116 umformuliert** — nicht „zwei Abschnitte unterscheidbar" (die zweite Gruppierungsebene ist bewusst abgelehnt), sondern: ausgenommener Abschnitt raus **und** Weglassen sichtbar. Wortgleich mit PM-116. Engineering, CoS-E-074 |

---

## H — Produktregeln, die größer sind als ein Testfall

| Thema | Stand |
|---|---|
| **„Nichts erfinden"** — Manfreds Forderung vom 12.09., **von Sandy entschieden: ja.** Ausformuliert unten unter „Die Regel ‚Nichts erfinden'" | ✅ entschieden 12.09.2026 |
| Verlegeart im Titel: schwimmend / vollflächig verklebt / gespannt. Heute schweigt jeder Verlege-Titel, der Katalog unterscheidet bei jedem Eintrag → immer der Klick-Preis (vokabular-abgleich.md G.2) | offen — Auftrag ans Engineering |
| Q-Stufe erfragen in Handwerkersprache: „Nur ausbessern, oder ganz glatt für Streiflicht?", und bei Raufaser gar nicht fragen (Manfred, 12.09.) | offen — Auftrag ans Engineering |

---

### Die Regel „Nichts erfinden" — entschieden von Sandy am 12.09.2026

Manfred: *„Nur anlegen, wenn ausdrücklich genannt — nie automatisch ergänzen."*
Sandy: ja. Damit sie gebaut werden kann, ohne die Vollständigkeitsprüfung
mitzureißen, hier scharf gestellt — vier Sätze:

1. **Gesagt → Position.** Mit Menge und Preis, wie bisher.
2. **Ausdrücklich abbedungen → nie eine Position.** Auch keine abgeleitete,
   auch nicht in einem anderen Raum. „Die Möbel räum ich selbst raus" heißt
   für die ganze Wohnung nein (TN-037 — heute erzeugt die App die Position
   trotzdem, das ist der schlimmste Fall von allen: sie widerspricht dem,
   was er gesagt hat).
3. **Nicht gesagt → keine bepreiste Zeile.** Zwei erlaubte Wege: als
   **Rückfrage** vor dem Angebot, oder als **Vorschlag ohne Menge und ohne
   Preis**, den der Handwerker antippen muss, damit er ins Angebot kommt.
   Ein Vorschlag, der schon eine Zahl trägt, ist keine Frage mehr, sondern
   eine Behauptung — und genau die repariert Manfred dann von Hand
   (TN-040 Deckengrundierung, TN-042 „bewohnt").
4. **Kleinkram wird gar nicht erst zur Zeile.** Steckdosen abkleben, Boden
   auslegen beim Streichen: das steckt im Einheitspreis, weder mit noch ohne
   Preis gehört es ins Angebot. Manfred, TN-010: *„Bei mir läuft das mit
   rein."*

**Was die Vollständigkeitsprüfung bleibt:** Sie darf weiter erkennen, was
fehlt — und das als Rückfrage stellen. Die vergessene Flurdecke (TN-036) ist
derselbe Mechanismus, nur richtig herum benutzt. Sie darf nur nicht mehr
selbst ins Angebot schreiben. Das Feld dafür gibt es schon
(`automatisch_ergaenzt`, gesetzt in `vollstaendigkeit/index.ts`) und die
Vorschlag-Marke in der Oberfläche auch (TN-057, die mag er) — was fehlt, ist
dass eine so markierte Position **ohne Zahl** kommt und angetippt werden muss.

**Heute betroffen, aus Manfreds einer Session:** Möbel schützen (TN-037),
Deckenfläche grundieren (TN-040), Erschwerniszuschlag Altbau + bewohnt
(TN-042), Boden schützen und Sockelleisten abkleben in `maler.ts` (tragen das
Flag bereits), Laminat demontieren statt Teppich (TN-127).

---


---

## I — Nachtrag 15.09.2026: was die zwei neuen Fälle an Themen aufgemacht haben

| Thema | Stand |
|---|---|
| Stückzahlen als Zahlwort (`zaehleTueren` / `zaehleFenster` kennen nur Ziffern) | **PM-045-B** 🔴 |
| Stückzahl steht am Raum, wird aber nicht gelesen (Lackierzeilen bleiben bei 1) | **PM-045-A** 🔴 |
| Eine Begründung wandert vom Bauteil aufs Nachbarbauteil („die Türen sind alt" → Fenster abschleifen) | **PM-045-C** 🔴 |
| Zuschlags-/Sonderanstriche auf der falschen Bezugsfläche (Sperrgrund auf Boden statt Wand) | **PM-046-A** 🔴 |
| Zwei Grundierungen auf derselben Fläche (Isoliergrund + Tiefengrund) | **PM-046-B** 🔴 |
| Eine ausdrücklich genannte Leistung trägt `automatisch_ergaenzt` | **PM-046-C** 🔴 — **blockiert den Umbau von „Nichts erfinden"** |
| Mehrere Türen/Fenster mit verschiedenen Maßen in einem Raum | offen |
| Nur eine Seite lackieren („von innen streichen") gegen beidseitig | offen |
| Materialanteil bei Zubehörzeilen mit teurem Teil (Übergangsprofil) | **PM-057** 🔴 — gemessen: Stunden stimmen, Material fehlt |

**Der wichtigste Eintrag ist PM-046-C.** Die Regel „Nichts erfinden" (H, von
Sandy am 12.09. entschieden) macht die Marke `automatisch_ergaenzt` tragend:
Was sie trägt, kommt ohne Menge und Preis und muss angetippt werden. Solange
die Marke auch auf Zeilen sitzt, die der Handwerker ausdrücklich bestellt hat,
würde der Umbau Leistungen aus dem Angebot werfen, die gesagt wurden — das
wäre schlimmer als der heutige Stand. **Die Marke gehört sauber, bevor sie
trägt.**


*Prüfmeister · angelegt 2026-09-10 · fortgeschrieben 2026-09-15*

---

## J — Nachtrag 15.09.2026 abends: was die Fliesen-Fälle und die Preisliste aufgemacht haben

| Thema | Stand |
|---|---|
| Eine `zeit`-Zeile kann keinen festen Materialbetrag tragen (`zubehoer` ist eine Zusage, die der Preis nicht hält) | **PM-057** 🔴 |
| Dieselbe Katalogzeile steht mehrfach in einer Preisliste, mit verschiedenen Preisen | **PM-058** 🔴 |
| Zwei Dateien entscheiden dieselbe Materialfrage verschieden (`preis-ableitung.ts` gegen `materialanteil.ts`) | **PM-059** 🔴 |
| Ein aktives Gewerk erzeugt Zeilen, für die es keinen Preis gibt | **PM-060-A** 🔴 |
| `gewerkFuerPosition` entscheidet am Wort „Wand" auf Maler, auch bei Fliesenzeilen | **PM-060-B** 🔴 |
| „Nur die Wandfliesen" — die Engine schreibt trotzdem den Boden | **PM-061-A** 🔴 |
| Abstemmen: der Titel nennt das Bauteil nicht und nimmt immer den Bodenpreis | **PM-062** 🔴 |
| Verschnitt Fliesen: 10 % Boden, 5 % Wand, Verfugung und Abdichtung auf netto | **PM-060** ✅ geprüft |
| Fliesenspiegel Küche als eigene Katalogzeile (55,00 €/m², inkl. Ausschnitte) | offen |
| Bodengleiche Dusche, Gefälleestrich (550,00 € Pauschale) | offen |
| Wandhöhe über 2,50 m: Aufpreis-Zeile im Fliesenkatalog | offen |
| Sanitärobjekte ausbauen und wieder einbauen (65,00 €/Stück, beide Richtungen) | offen |
| Trockenbau, Sanitär/Heizung, Elektro — drei aktive Gewerke, nie geprüft | offen — Restliste Nr. 10 |

**Der Eintrag, der am weitesten trägt, ist PM-060-B.** `gewerkFuerPosition`
entscheidet das Gewerk am Wortlaut des Titels. Solange ein einzelnes Wort
(„Wand") stärker wiegt als das Gewerk, aus dem die Zeile stammt, ist jede neue
Gewerke-Freischaltung ein Glücksspiel: Die Zeile wird gegen den falschen
Katalog gehalten und findet ihren Preis nicht — oder, schlimmer, einen
fremden. Das gehört geprüft, **bevor** das nächste Gewerk aufgeht, nicht
danach.

*Prüfmeister · fortgeschrieben 2026-09-15 abends*

---

## K — Rückfragen an den Prüfmeister (Chief of Staff, 15.09.2026 abends)

Hier stehen die Fragen, auf deren Antwort eine andere Rolle wartet. Sie
gehören nicht in die Restliste, weil die bei jedem Lauf ersetzt wird.

### K.1 — BEANTWORTET (Prüfmeister, 15.09.2026 abends). Eingriff 3 ist frei.

**Frage 1: Wenn im Diktat nur „Sperrgrund" steht, ohne genannte Fläche —
welche Fläche gilt?**

Die Fläche folgt der **Ursache**, nie dem Auslösewort:

| im Diktat | Fläche |
|---|---|
| Wasserfleck / Fleck / „schlägt von oben durch" | **Decke** |
| Nikotin / Ruß / Rauch / „verraucht" / „gelb" | **Wand UND Decke** |
| eine genannte Fläche („die Wände sperren") | **die genannte** — schlägt alles |
| nichts davon, bloß „Sperrgrund" / „sperren" | **keine bepreiste Zeile — Rückfrage** |

Drei Sätze zur Begründung, damit niemand eine Ersatzregel bauen muss:

1. **Der Nikotin-Fall ist Wand und Decke, und das ist keine Vorsicht.** Rauch
   steigt; die Decke ist die am stärksten belastete Fläche im Raum. Wer nur
   die Wände sperrt und die Decke normal streicht, hat nach wenigen Wochen
   gelbe Schatten an der Decke und steht in der Gewährleistung. Eine halb
   gesperrte Wohnung ist keine gesperrte Wohnung.
2. **Die genannte Fläche gewinnt immer.** „Die Wände sperren, Decke normal
   grundieren" ist eindeutig und darf nicht überstimmt werden.
3. **Der letzte Fall ist Regel H Satz 3** (Sandy, 12.09.): nicht gesagt →
   keine bepreiste Zeile. Er ist ausdrücklich **nicht** „dann eben die Decke".
   Dass heute still die Decke gilt, ist kein Fachurteil, sondern die Herkunft
   der Regel aus ihrem ersten Fall.

**Frage 2: Fällt der Tiefengrund ganz weg oder nur auf der gesperrten Fläche?**

**Nur auf der gesperrten Fläche. Die Regel gilt je Fläche, nie je Angebot.**

- *Auf der gesperrten Fläche:* Der Tiefengrund fällt weg. Der Isoliergrund
  **ist** dort die Grundierung. Zwei Grundierungen auf einem Quadratmeter sind
  eine zu viel — und die Sperrwirkung braucht den saugenden Untergrund, den
  ihr ein Tiefengrund darunter gerade nimmt.
- *Auf jeder anderen Fläche:* Der Tiefengrund bleibt, wo er hingehört.

„Wände sperren, Decke normal grundieren" muss also **beide** Zeilen ergeben —
Isoliergrund auf der Wandfläche, Tiefengrund auf der Deckenfläche. Nie beide
auf derselben Zahl. Der Ausnahmefall (stark sandender Untergrund: erst
festigen, dann sperren) ist einer, den der Handwerker ansagt, nicht einer, den
die App rät.

**Bedingung, die zur Antwort gehört — sonst ist sie die halbe Reparatur:**
Ausgelöst wird die ganze Regel heute von `lower.includes('sperr')`
(`maler-sonder.ts` Z. 42), also am Wortstamm. Der steckt in Sperrmüll,
absperren, Absperrband, Sperrholz, gesperrt. Nachgemessen: „Der alte Teppich
muss raus, das ist Sperrmüll" erzeugt einen Isoliergrund über 12,00 m² plus
einen Tiefengrund — **162,00 € für eine Arbeit, von der niemand gesprochen
hat** —, und zerlegt dabei die ausdrücklich bestellte Deckenposition. Als
**PM-064** in der Fallbasis, Sperrklinken in
`pruefmeister-batch-64-68.test.ts`.

Festgehalten als Soll in `pruefmeister-batch-1509.test.ts`: PM-046-A (Fläche
folgt der Ursache), PM-046-B (je Fläche, nicht je Angebot), PM-046-D
(Wortstamm), PM-046-E („Wände sperren, Decke normal grundieren").

### K.2 — ERLEDIGT (Prüfmeister, 15.09.2026 abends). Zwei Sperrklinken waren falsch.

Engineering hatte recht, und der Befund ist unangenehmer als erwartet.
`lauf()` normalisiert den Text jetzt einmal am Eingang, wie die Pipeline es
tut (`ersetzeZahlenWorte`, extraktion-pipeline.ts Z. 83); `verarbeiteExtraktion`
bekommt weiter den rohen Text, die normalisiert selbst. Geändert in
`pruefmeister-batch-1509.test.ts` und `pruefmeister-batch-47-56.test.ts`.

**Damit fallen zwei gemeldete Funde weg — beide waren Messfehler dieser Dateien,
nicht Produktfehler:**

| war gemeldet | gemeldeter Geldweg | tatsächlich |
|---|---|---|
| **PM-045-A** alle vier Türzeilen tragen Menge 1 | 540,00 € je Angebot, „der teuerste Fund des Batches" | Menge **4**. Grün. |
| **PM-052-A** „die zwei Heizkörper" ergibt Menge 1 | 85,00 € je Angebot | Menge **2**. Grün. |

**PM-045-B** ist neu gefasst. Die alte Fassung prüfte `zaehleTueren('vier
Türen')` nackt — richtig gemessen, aber ohne Aussage über das Produkt, das die
Funktion nie mit rohem Text aufruft. Zugesichert wird jetzt der Weg, den das
Produkt geht: Zahlwort → Normalisierung → Stückzahl → Position. Bricht jemand
die Reihenfolge auf, fällt die Prüfung rot, statt als stillschweigend erfüllte
Sperrklinke stehen zu bleiben.

**Was ich daraus mitnehme, über diesen Fall hinaus:** Ein Harnisch, der die
Pipeline nachbaut, ist selbst prüfbedürftig. Zwei Funde mit Geldweg, zwei
Ticketzeilen bei Engineering, ein „teuerster Fund des Batches" — alles aus
einem Argument, das in dieser Datei anders stand als im Produkt. Eine
Sperrklinke auf einem Zustand, den das Produkt nicht hat, ist teurer als gar
kein Test.

### K.3 — GELESEN und übernommen (Prüfmeister, 15.09.2026 abends).

Die Korrektur stimmt, ich hatte `aktiv: true` der falschen Konstante
zugeschrieben. Restliste Nr. 2 und Nr. 10 sind entsprechend umgeschrieben, und
in `vokabular-abgleich.md` steht die Korrektur zu Abschnitt S jetzt als
Abschnitt T — an der Stelle, an der die falsche Begründung steht, nicht nur
hier.

Die schärfere Formulierung übernommen: Die vier Gewerke sind nicht „aktiv",
sie sind **über das Diktat erreichbar**. „Nicht aktiv" heißt nicht „nicht
erreichbar" — es heißt nur, dass niemand das Gewerk bestellt hat, während die
App es trotzdem rechnet.

**Restliste Nr. 10 ist damit auch beantwortet.** Trockenbau, Elektro und
Sanitär sind jetzt im Abgleich. Die Frage lautete „sind ihre Engines mehr als
Durchreichen?" — das war die falsche Frage: Der Abgleich prüft Titel gegen
Katalog, und eine Durchreiche-Engine schreibt genauso feste Titel wie eine
rechnende. Ergebnis: **zehn neue Lücken**, sechs davon Trockenbau, und beim
Trockenbau ist es das ganze Gewerk. Als PM-068 hinterlegt, ausführlich in
`vokabular-abgleich.md` T.

*Prüfmeister · 2026-09-15 abends (Fragen: Chief of Staff, 2026-09-15)*

### K.4 — BEANTWORTET (Prüfmeister, 15.09.2026, nachts). Eine Zeile. Die zweite muss weg.

**Gestellt:** Head of Product Engineering, 2026-09-15, 21:55 MESZ · weitergereicht
vom Chief of Staff

**Die Antwort: Die Setzstufe steckt im Stufenpreis. Die zweite Zeile bekommt
keinen Preis, sie muss weg.** Es bleiben die 770,00 €, die ich als Soll für
PM-066-A angegeben habe — 14 × 55,00 €. Engineering kann PM-066-A/B bauen.

**Warum, und zwar aus dem Katalog, nicht aus meinem Bauchgefühl.** Ich habe den
Standardkatalog danach durchgesehen, wo eine Setzstufe eigens bezahlt wird:

```
Boden – Vinyl / LVT        Vinyl auf Treppenstufen kleben              55,00 €/St
Boden – Laminat            Laminat auf Treppenstufen verlegen          48,00 €/St
Boden – Linoleum           Linoleum auf Treppenstufen verlegen         58,00 €/St
Boden – Teppichboden       Teppich auf Treppenstufen verlegen          48,00 €/St
Boden – Abschlussarbeiten  Treppenstufe mit Belag belegen              45,00 €/St
                           ── keine einzige Setzstufenzeile ──

Fliesen – Sonderarbeiten   Treppenstufe fliesen (inkl. Setz- und Trittstufe)  55,00 €/St
Fliesen – Naturstein       Naturstein Treppenstufe verlegen            75,00 €/St
Fliesen – Naturstein       Naturstein Treppensockel / Setzstufe verlegen 45,00 €/St
Schreiner – Treppen        Treppenstufe Holz (Auftrittsplatte)        180,00 €/St
Schreiner – Treppen        Setzstufe montieren / ersetzen             120,00 €/St
```

Der Katalog ist in dieser Frage **durchgehend konsequent:** Wo die Setzstufe
eine eigene Leistung ist — Naturstein, Schreiner —, steht sie als eigene Zeile
da. Wo sie es nicht ist, fehlt sie, und beim Fliesenleger sagt der Titel es
zusätzlich ausdrücklich. Im Bodenbelag fehlt sie bei **allen fünf** Zeilen.
Das ist kein Vergessen an einer Stelle, das ist die Regel des Katalogs.

**Die zweite Begründung ist die Größenordnung.** Eine Vinyl-Trittstufe misst
rund 0,27 m². Zum Flächenpreis von 16,00 €/m² wären das 4,32 €. Der Stückpreis
steht bei 55,00 €. Dieser Preis bezahlt nicht den Grundriss der Stufe, sondern
die Stufe als Bauteil: zuschneiden, an Kante und Nase anarbeiten, kleben,
andrücken. Genau diese Arbeit fällt an der Setzstufe im selben Griff mit an.
Ein zweiter Stückpreis daneben wäre dieselbe Arbeit ein zweites Mal.

**Was ich ausdrücklich dazusage, damit niemand daraus die falsche Regel baut:**

* Es gilt für den **Bodenbelag**. Beim Naturstein und beim Schreiner gilt das
  Gegenteil, und der Katalog sagt das auch.
* Bei einer **offenen Treppe** (ohne Setzstufen) bleibt derselbe Stückpreis
  stehen, obwohl weniger Arbeit anfällt. Das ist gewollt und im Handwerk
  üblich — Mischkalkulation. Wer hier zwei Preise baut, um „gerechter" zu
  werden, öffnet die Doppelberechnung von der anderen Seite.
* Es ist **kein Katalogpunkt.** Der Katalog braucht keine neue Zeile. Die
  Reparatur sitzt allein in `boden-sonder.ts`, `pruefeTreppenBoden()`:
  Der `Setzstufen belegen`-Block (Z. 213–221) fällt weg, und der übrige Titel
  muss den Katalog treffen — `Trittstufen belegen` trifft heute nichts.

**Belegt, nicht behauptet:** `pruefmeister-batch-79-88.test.ts`, Abschnitt
„K.4". K.4-A bis K.4-E halten den Katalogbefund als grüne Zusicherungen fest,
K.4-F und K.4-G stehen als Sperrklinken auf dem Soll.

**Ein Fund nebenbei, der zu PM-066 gehört (K.4-H):** Die **Treppennase** wird
im Diktat gesagt, der Katalog führt sie (`Treppennase / Kantenprofil Treppe
montieren`, 22,00 €/Stück) — `pruefeTreppenBoden()` hört aber nur auf
„kantenprofil", „treppenkante" und „rutschhemmend", nicht auf „Treppennase".
Auf vierzehn Stufen sind das **308,00 €**, die niemand abruft. Ein Wort in der
Bedingung, kein Umbau.

*Prüfmeister · 2026-09-15 nachts (Frage: Head of Product Engineering, 2026-09-15)*

### K.5 — BEANTWORTET (Prüfmeister, 15.09.2026, nachts). In die Fehlt-Liste, nicht ins Angebot.

**Gestellt:** Head of Product Engineering, 2026-09-15, 21:55 MESZ · weitergereicht
vom Chief of Staff

**Die Antwort: Eine fachlich zwingende, aber nicht gesagte Vorarbeit gehört in
die Fehlt-Liste — nicht bepreist ins Angebot.** Anschleifen und Grundieren
bleiben also stehen, aber als Eintrag, den der Handwerker antippt, nicht als
Zeile mit 45,00 €.

**Der Grund ist nicht Vorsicht, sondern Haftung.** Was im Angebot steht, ist
angeboten. Steht „Anschleifen und Grundieren, 45,00 €" auf dem Papier und der
Handwerker hat es nie gesagt, dann hat er es trotzdem verkauft — zu einem
Preis, den er nicht kalkuliert hat, an einem Untergrund, den er nicht bewertet
hat. Der Fall, in dem die Türen schon grundiert sind, ist nicht selten; er ist
der Normalfall bei einer Renovierung. Dann steht eine Leistung im Vertrag, die
niemand braucht, und der Kunde streicht sie beim ersten Hinsehen mitsamt dem
Vertrauen in den Rest.

**Die Gegenrichtung ist billiger.** Ein Fehlt-Eintrag, der übersehen wird,
kostet den Betrieb 45,00 € — einmal, und er merkt es beim Abrechnen. Eine
erfundene Zeile, die im Angebot steht, kostet ihn die Glaubwürdigkeit des
ganzen Angebots. Das ist dieselbe Abwägung, die hinter Regel „Nichts erfinden"
steht, und sie war schon einmal entschieden.

**Damit passen K.5 und PM-077 zusammen — was der Chief of Staff zu Recht
verlangt hat.** Beide sagen dasselbe in zwei Richtungen:

* **PM-077:** Was der Handwerker **gesagt** hat, darf die Marke
  `automatisch_ergaenzt` nicht tragen. Gesagt heißt bepreist.
* **K.5:** Was er **nicht gesagt** hat, darf keine bepreiste Zeile werden.
  Nicht gesagt heißt Fehlt-Liste.

Eine Regel, eine Grenze, zwei Seiten: **`automatisch_ergaenzt` und „bepreist"
schließen einander aus.** Wer die Marke trägt, hat keinen Preis; wer einen
Preis hat, trägt die Marke nicht. Nach dieser Regel kann Engineering beide
Punkte bauen, ohne zweimal zu entscheiden.

**Eine Einschränkung, die ich nicht verschweige:** Es gibt Vorarbeiten, ohne
die die Hauptleistung technisch nicht ausführbar ist — Grundierung auf
saugendem Untergrund etwa. Auch die gehören in die Fehlt-Liste, aber sie
gehören dort **nach oben und mit Nachdruck**, nicht in dieselbe Reihe wie
„Möbel abdecken". Ob die Fehlt-Liste eine solche Stufe kennt, weiß ich nicht —
das ist eine Frage an den Designer, keine an mich. Sie blockiert nichts: bis
dahin steht der Eintrag eben unmarkiert in der Liste.

*Prüfmeister · 2026-09-15 nachts (Frage: Head of Product Engineering, 2026-09-15)*

*Fragen weitergereicht vom Chief of Staff · 2026-09-15*

---

### K.6 — BEANTWORTET (Prüfmeister, 16.09.2026, abends). Es fehlt genau eine Katalogzeile.

> **Antwort in drei Sätzen:** Im `Decke streichen`-Preis ist es nicht drin —
> der Katalog preist Stuck-Streichen ausdrücklich gesondert aus
> (`Stuckleisten streichen / weißen`, 6,00 €/lfdm, für Maler **erreichbar**;
> `Deckenspiegel streichen`, 11,00 €/m²). `Stuckrosette abkleben` ist nicht
> die Ersatzantwort, sondern der **Gegenfall** — abgeklebt wird, was nicht
> mitgestrichen wird. Was fehlt, ist die **Stück-Entsprechung** zu
> `Stuckleisten streichen / weißen`; PM-070 ist damit ein **Katalogzug wie
> PM-076**, und bis die Zeile da ist gilt K.5: Fehlt-Eintrag, keine erfundene
> Menge. Ausführlich in `pruefmeister-restliste.md`.

*(ursprüngliche Frage:)*

**Gestellt:** Head of Product Engineering, 2026-09-16, nachts · direkt, nicht
über den Chief of Staff, weil sie nur den Katalog betrifft und nichts
blockiert.

**Der Anlass ist dein PM-070** („in der Mitte ist eine Deckenrosette, die muss
mit gestrichen werden" erzeugt nichts). Bevor wir dafür eine Regel bauen, muss
klar sein, **welche Zeile** sie erzeugen soll — und da sieht der Katalog anders
aus als bei PM-071.

**Was ich im Standardkatalog gemessen habe, nicht vermutet** — alle vier
Zeilen, die „osette" im Titel tragen:

```
Stuckrosette abkleben                       Maler – Stuck & Dekorative Techniken   12,00 €/St
Deckenrosette montieren                     Stuck – Dekorativ                      55,00 €/St
Deckenrosette groß montieren, über 50 cm    Stuck – Dekorativ                      90,00 €/St
Heizungsrohr-Abdeckrosette einbauen         Boden – Abschlussarbeiten               8,00 €/St
```

**Für das Streichen einer Rosette gibt es keine Zeile.** Es gibt das Abkleben
(Maler, erreichbar — gemessen: findet den Preis) und das Montieren (Kategorie
`Stuck – Dekorativ`, die **kein aktives Gewerk erreichen darf**; gemessen:
`preisKategoriePasstZuGewerk` liefert für maler, boden_parkett und fliesen je
`false`). Eine Montage ist hier ohnehin nicht gemeint — die Rosette hängt
schon da.

**Die Frage, in einem Satz:** Ist das Mitstreichen einer Rosette im Preis von
`Decke streichen` schon drin — dann ist PM-070 kein Codefund, sondern eine
grüne Kontrolle, und es fehlt höchstens `Stuckrosette abkleben` als Vorarbeit —
oder ist es eine eigene Leistung, dann fehlt dem Katalog eine Zeile und PM-070
ist ein Katalogzug wie PM-076?

**Was ich ausdrücklich nicht tue:** eine Zeile erfinden oder das Abkleben zur
Ersatzantwort machen. **Blockiert nichts** — PM-070 ist der einzige der vier
Fälle aus CoS-E-064, der daran hängt.

### K.7 — BEANTWORTET (Prüfmeister, 16.09.2026, abends). **Fragen.**

> **Antwort:** Deine Neigung war richtig, ich mache sie zur Ansage. Ein
> Standardmaß je Balken ist eine erfundene Menge mit Preis — und hier in
> achtfacher Stärke: 4,00 m × 0,20 m ergibt 6,40 m² Lasur (89,60 €), mit
> 0,30 m Breite 9,60 m² (134,40 €). **50 % Unterschied aus einer Zahl, die
> niemand gesagt hat.** Soll: Fehlt-Eintrag mit der Rückfrage nach **Länge
> und Breite eines Balkens** — der Handwerker misst den Balken, nicht die
> Decke. Keine Position, kein Standardmaß.

*(ursprüngliche Frage:)*

**Der Anlass ist dein PM-071** („die Decke hat Sichtbalken, acht Stück, die
werden lasiert"). Hier ist der Katalog vollständig und **erreichbar** —
gemessen, beide Zeilen finden ihren Preis:

```
Holzdecke / Paneele lasieren     Maler – Anstrich Innen      14,00 €/m²
Holzbalken anschleifen           Maler – Lackierarbeiten      8,00 €/lfdm
```

**Es fehlt nur die Menge.** Gesagt ist eine **Stückzahl** (acht), der Katalog
rechnet in **m²** und **lfdm**. Länge und Breite eines Balkens hat niemand
genannt.

**Die Frage:** Rechnen wir mit einem Standardmaß je Balken — und wenn ja, mit
welchem —, oder ist der richtige Ausgang hier die **Rückfrage / Fehlt-Liste**,
weil die Menge nicht gesagt wurde (K.5)? Ich neige zu „fragen" und baue nichts
anderes, bevor du es sagst — ein Standardmaß, das wir uns selbst setzen, ist
eine erfundene Menge mit Preis, und genau die Grenze hast du in K.5 gezogen.
**Blockiert nichts.**

### ✅ ÜBERNOMMEN als PM-104 (Prüfmeister, 16.09.2026, abends)

> **Beide Hälften gegengemessen, beide stimmen:** der Sockelputz erzeugt
> `Sockelleisten montieren` 3,00 lfdm (16,50 €), der Kaminsockel mit Maß im
> Folgesatz 1,00 lfdm (5,50 €), derselbe Satz ohne das Wort erzeugt nichts.
> Liegt als **PM-104** in `pruefmeister-batch-104-116.test.ts`.

*(ursprünglicher Fund, Engineering, 16.09.2026:)*

Beim Beantworten der Frage, ob PM-074 derselbe Mechanismus ist wie die
Nebensatz-Reparatur aus CoS-E-058, sind zwei Messungen abgefallen, die dir
gehören:

* **„Der Sockelputz außen ist drei Meter lang."** — in einem Laminat-Auftrag,
  ohne dass irgendwo Sockelleisten vorkommen — erzeugt
  **`Sockelleisten montieren`, 3,00 lfdm.** Ein Bauteil an der Außenwand baut
  eine Innenposition. Derselbe Fehlauslöser wie PM-074, an einem zweiten Wort,
  und er ist nicht vom Kaminsockel abhängig.
* **Das Maß muss nicht im selben Satz stehen.** „In der Ecke steht ein
  Kaminsockel. **Der ist ein mal ein Meter**, da muss ausgespart werden." →
  weiterhin `Sockelleisten montieren`, 1,00 lfdm. Der Auslöser ist also
  **nicht** der Nebensatz, sondern der **Wortstamm „sockel"** — dieselbe Form
  wie „Sperrmüll"/„absperren" in PM-064. Ohne das Wort „Sockel" („ein Kamin,
  ein mal ein Meter") entsteht keine Zeile; das ist die Kontrolle dazu.

Die Reparatur ist klein und gehört uns (Wortliste mit Wortgrenzen in
`pruefeSockelleisten`). Die **Fälle** gehören dir — insbesondere „Sockelputz",
weil er PM-074 verallgemeinert.

*Head of Product Engineering · 2026-09-16, nachts*

---

## L — Nachtrag 16.09.2026, nachmittags: abgeräumt und neu aufgemacht

**Abgeräumt in diesem Lauf** (als Batch `pruefmeister-batch-101-103.test.ts`
hinterlegt, Befunde in `pruefmeister-restliste.md`):

* **PM-101** — die qualifizierte Verneinung („nicht tapezieren, nur
  streichen"). Gehört zu E, ist aber schwerer als alles andere dort.
* **PM-102** — Material als Bauteilnennung („Ein Holzfenster, eine Tür.").
  Gehört zu A.
* **PM-103** — das unaufgelöste Rückbezugswort („Und die Türen auch.").
  Gehört zu E.

**Neu aufgemacht — Themen, die aus diesen drei Fällen fallen und noch niemand
gemessen hat:**

1. **Die Verneinung als eigene Klasse, nicht als Einzelfall.** PM-099 (Bauteil
   ausgeschlossen), PM-101 (Leistung abbestellt und zugleich eine andere
   bestellt) und der Ausschlusssatz aus Fall 18 sind drei Stufen derselben
   Sache. Offen und ungemessen ist die vierte: **die Verneinung mit Menge** —
   „Die drei Fenster nicht, nur das große." Prüfbar ohne App.
2. **Rückbezugswörter allgemein.** „auch", „ebenso", „das gleiche nochmal",
   „dito", „genauso wie im Wohnzimmer". PM-103 misst nur „auch". Die anderen
   sind ungemessen und derselbe Mechanismus. Prüfbar ohne App.
3. **Material als Auslöser über `holzfenster` hinaus.** Der Katalog kennt
   Holz, Alu, Kunststoff, Stahlzargen. Wenn `holzfenster` einen eigenen Zweig
   hat, lohnt die Frage, welche anderen Materialwörter still eine Arbeit
   auslösen. Prüfbar ohne App, am Ausdruck messbar.
4. **Nullzeilen aus dem Lackier-Zweig.** `Abdecken Umgebung` hat keinen
   Katalogpreis und entsteht in jedem Lackier-Fall mit. Das ist L-03 an einer
   zweiten Stelle — die Zeile gehört entweder in den Katalog oder nicht ins
   Angebot. Gehört zu H.
5. **Fehlt-Einträge als Pflicht, nicht als Kür.** PM-101-G und PM-103-A
   fordern beide dasselbe: Wenn die Pipeline einen Satz nicht auflösen kann,
   muss etwas übrig bleiben. Heute ist `fehlende` in beiden Fällen leer. Das
   ist eine Produktregel im Sinne von H, keine Einzelentscheidung — und die
   Gegenrichtung zu K.5.

*Prüfmeister · 2026-09-16*

---

## M — Nachtrag 16.09.2026, abends: abgeräumt und neu aufgemacht

**Abgeräumt in diesem Lauf** (als Batch `pruefmeister-batch-104-116.test.ts`
hinterlegt, 29 grün / 20 Sperrklinken, Befunde in
`pruefmeister-restliste.md`):

* **A** — Wandnische / Regalnische außerhalb des Bades → **PM-108**
* **B** — Staubschutzwand und Abendreinigung bei bewohnter Baustelle → **PM-109**
* **C** — Estrich rissig, muss verharzt werden → **PM-110**
* **E** — Handwerker nennt Preise selbst → **PM-111**
* **E** — Handwerker nennt Stunden statt Mengen → **PM-112**
* **E** — sehr kurze Aufnahme → **PM-113**
* **E** — widersprüchliche Angaben im selben Diktat → **PM-114**
* **G** — Nachtrag zu einem bestehenden Angebot → **PM-115**
* **G** — zwei Bauabschnitte, getrennte Angebote → **PM-116**
* **L.1** — die Verneinung mit Menge → **PM-105**
* **L.2** — Rückbezugswörter allgemein → **PM-106**
* **L.3** — Material als Auslöser über `holzfenster` hinaus → **PM-107** (grün)
* Engineering-Fund Sockelputz → **PM-104**
* **K.6** und **K.7** — beide beantwortet, siehe oben.

Damit ist **Abschnitt L vollständig abgearbeitet**, und von den neun Themen,
die in der Restliste als nächste standen, ist keines mehr offen.
**Fallbasis: 116 Fälle.**

**Neu aufgemacht — Themen, die aus diesen dreizehn Fällen fallen und noch
niemand gemessen hat:**

1. **Der Ausschluss auf ZEIT, nicht auf Sache.** PM-116 wirkt über „das kommt
   später". Ungemessen: „das machen wir nächstes Jahr", „erstmal nur das
   Erdgeschoss", „Rest nach Absprache". Dieselbe Klasse wie PM-099/PM-116,
   aber mit einem Zeitwort statt einem Bauteilwort. Prüfbar ohne App.
2. **Die Verneinung, die zu breit wirkt — wo noch?** PM-105 zeigt das Muster
   an Fenstern. Ungemessen: Türen, Heizkörper, Sockelleisten, ganze Räume.
   Wenn das Muster durchgeht, ist es kein Einzelfall, sondern der Zustand der
   Verneinungsmaschine. **Vor PM-101 messen, nicht danach.** Prüfbar ohne App.
3. **Das leere Angebot als Produktregel (H).** PM-113 und der Fassaden-Entwurf
   (L-02 / PD-018 a) verlangen dasselbe: Ein Angebot ohne Positionen muss
   sagen, warum. Das ist keine Einzelentscheidung, sondern die dritte
   Ausprägung derselben Regel wie L.5 und DC-112. Gehört zu H.
4. **Zwei Sprechweisen für denselben Preis.** PM-111 nimmt den genannten
   Pauschalpreis nicht. Ungemessen ist der genannte **Einheitspreis** („den
   Quadratmeter machen wir für zwölf Euro") — der ist auflösbar, wo die
   Pauschale es nicht ist, und wäre der leichtere Einstieg. Prüfbar ohne App.
5. **Erreichbare Katalogzeile, die trotzdem nie entsteht.** PM-110 ist der
   reinste Fall, PM-070/071/075 sind die älteren. Offen ist die Zählung: Wie
   viele der 147 guten Treffer im Vokabular-Abgleich entstehen aus einem
   klaren Satz überhaupt nie? Eine Messung am Ausdruck, kein Einzelfall — und
   die ehrlichste Zahl, die wir über die Vollständigkeit haben könnten.

*Prüfmeister · 2026-09-16 abends*

---

## Nachtrag 17.09.2026, mittags — vier neue Fälle, drei neue Themen

**Fallbasis: 120 Fälle** (PM-117 Bad-Preisweg · PM-118 besenreine Übergabe ·
PM-119 Ausführungsreihenfolge · PM-120 zwei Bauabschnitte ohne Trennung).
Die Zielgröße von 100 ist damit überschritten; die Liste läuft weiter, weil
die Themen weiterlaufen, nicht um eine Zahl zu erreichen.

**Stände nachgezogen:**

* **Bad / Fliesen (Abschnitt F, PM-060 bis PM-062):** der Geldweg ist jetzt
  gemessen. **PM-117** — auf einem gewöhnlichen Bad stehen 543,84 €, wo
  2.980,44 € hingehören. Der `/wand/`-Router allein trägt 652,96 € davon, der
  Rest ist Wortlaut (PM-060-A). **Beides gehört zusammen gebaut.**
* **Baustellenreinigung (Abschnitt B, PM-090 / PM-109):** entschieden.
  **PM-118** — die einmalige besenreine Übergabe wird keine bepreiste
  Position (Nebenleistung nach DIN 18299 4.1.1). Der wiederkehrende Fall
  bleibt Fehlt-Eintrag wegen fehlender Menge. Damit ist an dieser Stelle
  nichts mehr offen.
* **Bauabschnitte (Nachtrag-Thema 1, „Ausschluss auf ZEIT"):** die
  Gegenrichtung ist jetzt abgedeckt. **PM-120** — zwei Bauabschnitte, keiner
  ausgenommen, beide müssen stehen bleiben. Heute grün; sie ist die Kontrolle
  gegen einen Auslöser, der auf die Wendung „Bauabschnitt" zielt statt auf den
  Trennungssatz. Fund von Engineering, die Lücke war meine.

**Neu aufgemacht:**

6. **Die Reihenfolge INNERHALB der Hauptarbeit.** PM-119 legt sieben
   Ausführungsstufen fest und beantwortet damit L-06 — aber nicht, wie die
   Zeilen innerhalb einer Stufe stehen. Bei den Fliesen schreibt die Engine
   `Bodenfliesen verlegen · Verbundabdichtung Boden · Verfugung Boden`.
   **Abgedichtet wird VOR dem Verlegen und verfugt danach** — die Zeile, die
   im Angebot zuerst steht, ist die, die auf der Baustelle in der Mitte
   liegt. Ungemessen: ob das bei Maler und Boden auch vorkommt. Prüfbar ohne
   App, klein, gehört hinter L-06.
7. **Eine Arbeit, mehrere Katalogwörter — ohne Geldweg.** In
   `Boden – Abschlussarbeiten` stehen fünf Zeilen für einen Übergang
   (`Übergangsschiene`, `Übergangsprofil`, `Übergangsprofil / Schwelle
   einbauen`, zweimal Alu). Drei davon kosten dasselbe, es verschiebt heute
   nichts — aber es ist der Zustand, aus dem PM-058 entsteht, sobald ein
   Betrieb eine der Zeilen anfasst und die andere nicht. Ungemessen: wie oft
   dieses Muster im Katalog sonst noch steht. **Eine Messung am Katalog, kein
   Einzelfall** — die Gegenrichtung zu Abschnitt U.
8. **Die Nullzeile als Produktregel.** PM-117 legt sechs Zeilen mit 0,00 € auf
   ein Kundenpapier, L-03 legt Positionen mit Menge 0 dorthin. Zweimal
   dieselbe Frage, zweimal an einer anderen Stelle gefunden: **darf eine Zeile
   ohne Betrag überhaupt auf ein Angebot?** Das ist keine Einzelentscheidung
   mehr, sondern die vierte Ausprägung derselben Regel wie H, L.5 und DC-112.
   Gehört zu H.

*Prüfmeister · 2026-09-17, mittags*

---


## Nachtrag 17.09.2026, nachmittags — abgeräumt und neu aufgemacht

**Fallbasis: 128 Fälle.** Hinterlegt als
`src/lib/__tests__/pruefmeister-batch-121-128.test.ts` (42 Zusicherungen,
27 grün, 15 Sperrklinken), Befunde in `pruefmeister-restliste.md`.

**Abgeräumt in diesem Lauf:**

* **M.2 — „die Verneinung, die zu breit wirkt: wo noch?"** → **PM-125**.
  Gemessen an Türen, Heizkörpern und Sockelleisten: dreimal dasselbe, dreimal
  ohne Spur in `fehlende`. **Die Auflage des Themenspeichers ist damit
  erfüllt — es ist vor PM-101 gemessen.** Ergebnis: PM-105 ist kein
  Einzelfall, sondern der Zustand der Verneinungsmaschine.
* **M.4 — der genannte Einheitspreis** → **PM-127**. Er sollte der leichtere
  Fall gegenüber PM-111 sein, weil die Menge danebensteht. Er ist genauso
  spurlos. 68,75 € gegen den Betrieb, auf einem Flur.
* **Nachtrag-Punkt 6 — die Reihenfolge INNERHALB der Hauptarbeit** →
  **PM-126**. Zweimal falsch, an der Wand schlimmer als am Boden (die
  Abdichtung steht dort hinter der Verfugung). Dazu L-06 im Gewerk Fliesen,
  ein vierter Fall zu den drei in PM-119 gemessenen.
* **Die zwei Fragen des Head of Product Engineering** → **PM-121**
  (`Entsorgung Fliesenmaterial` ist `Fliesenschutt entsorgen`, 8,00 €/m²) und
  **PM-122** (der Titel der Duschnische bleibt kurz).
* **Die Auflagen, um die Engineering gebeten hat** → **PM-123** (PM-061-A,
  vier Punkte) und **PM-124** (PM-062-A wird nicht durch einen Preiswechsel
  erfüllt, sondern durch eine Trennung der Zeile).

Von den fünf Themen des Abschnitts M sind damit **M.2 und M.4 zu**; offen
bleiben M.1 (teilweise, PM-116/PM-120), M.3 und M.5. Aus dem Nachtrag vom
Mittag ist **Punkt 6 zu**, Punkt 8 ist als DC-125 beim Designer, Punkt 7
steht unverändert.

---

**Neu aufgemacht — was aus diesen acht Fällen fällt und noch niemand
gemessen hat:**

9. **Die Raumzahl aus dem Raumnamen — wo noch?** PM-128 zeigt, dass
   `anzahlAus(lower, 'zimmer', …)` in „wohnzimmer 4 mal 5" vier Zimmer liest
   und daraus vier Türen macht (540,00 € auf einem Einraum-Angebot).
   Ungemessen ist die Form, nicht der Einzelfall: **`anzahlAus` sucht eine
   Zahl neben einem Wort — wo sonst steht diese Zahl aus einem ganz anderen
   Grund da?** Kandidaten: „fenster", „tür", „raum", „meter". Eine Messung am
   Ausdruck, kein Einzelfall, und die Familie ist größer als PM-128. Prüfbar
   ohne App.
10. **Die gekennzeichnete Annahme als falsche Sicherheit.** PM-128 weist
    seine Annahme sauber aus („4 Zimmer → je 1 Tür angenommen"), und genau
    das macht sie auf dem Kundenpapier glaubwürdig. **Die Kennzeichnung einer
    Annahme ist keine Prüfung ihrer Höhe.** Ungemessen: welche der heute
    ausgewiesenen Annahmen überhaupt eine Obergrenze haben. Gehört zu H und
    ist die Gegenrichtung zu PM-023.
11. **Die Verneinungsmaschine hat einen Umfang, und den kennt niemand.**
    PM-125 misst drei Bauteile, PM-105 eines. Ungemessen ist, **welchen Text
    die Maschine eigentlich als „Block" ansieht** — Satz, Absatz, Raum oder
    Bauteilgruppe. Ohne diese Antwort ist jeder Fix an PM-101/PM-105/PM-125
    geraten. **Vor allen dreien zu messen.** Prüfbar ohne App, am Ausdruck.
12. **Zwei Preise für dieselbe Arbeit auf EINER Zeile.** PM-124 ist der erste
    Fall: `Altfliesen abstemmen` trägt Boden- und Wandfläche in einer Menge,
    der Katalog trennt sie mit 4,00 €/m² Unterschied. Ungemessen: wo sonst
    eine Engine-Zeile zwei Katalogzeilen mit verschiedenen Preisen abdeckt.
    Das ist die Gegenrichtung zu Nachtrag-Punkt 7 (mehrere Katalogwörter für
    eine Arbeit) — hier ist es ein Wort für zwei Arbeiten. **Eine Messung am
    Katalog gegen den Ausdruck.**
13. **Der Katalogtitel als gedruckter Titel.** PM-122 entscheidet den
    Einzelfall (kein Schrägstrich auf dem Kundenpapier) und macht damit eine
    Klasse auf: **wie viele Engine-Titel tragen heute Katalogsprache?**
    Klammerzusätze („(2× Anstrich)", „(einlagig)", „(Container / Absackung)"),
    Schrägstriche, Q-Stufen. Eine Messung an den 184 Engine-Titeln, klein und
    ganz ohne App — und sie gehört dem Designer so gut wie mir.

*Prüfmeister · 2026-09-17, nachmittags*

---

## Nachtrag 17.09.2026, abends — Punkt 9 ist zu, und er war größer als gedacht

**Abgeräumt:**

* **Punkt 9 — die Zahl neben dem Wort, ganz** → **PM-131 · PM-132 · PM-133**.
  Die Frage war richtig gestellt („eine Messung am Ausdruck, kein
  Einzelfall"), und die Familie ist größer und teurer als PM-128:
  * **PM-131:** PM-128 hängt an **einem Komma**. „Wohnzimmer, fünf mal
    vier" → 1 Tür, ohne Komma → 5 Türen. 720,00 € an einem Satzzeichen, das
    niemand spricht.
  * **PM-132:** der dritte Zweig `(\d+)\s*stück` kennt das gesuchte Wort
    **nicht**. „Wir liefern 50 Stück Fliesen dazu." → **50 Türen**,
    457,25 € → 9.277,25 €. Rechenweg: „50 Tür(en) **aus Transkript**".
  * **PM-133:** die Ordnungszahl am Bauteil wird Stückzahl („Fenster 3 ist
    kaputt" → 3 Fenster) — **und** der gemeinte Fall wird verpasst („3 alte
    Türen lackieren" → 1 Tür, 360,00 € gegen den Betrieb).
  Von den Kandidaten des Punkts haben „fenster", „tür" und „meter"
  getroffen; „raum" ist am Komma gescheitert wie „zimmer".
* **Marketings Bitte** (Restliste, 17.09.) → **PM-129** (Hero: zwei von drei
  Zahlen stimmen, 17,10 lfdm gibt es nicht, eine vierte Zeile fehlt auf der
  Seite) und **PM-130** (Diktat 2 erzeugt keine fünf Türen, ist aber PM-094:
  ein Angebot aus einer einzigen erfundenen Zeile).

Offen bleiben aus den älteren Abschnitten: **M.1** (teilweise, PM-116/PM-120),
**M.3**, **M.5**, Mittags-Punkt 7, und aus dem Nachmittag die **Punkte 10,
11, 12 und 13** — Punkt 11 (der Umfang der Verneinungsmaschine) bleibt der
mit dem größten Hebel, weil drei Fälle daran hängen.

---

**Neu aufgemacht — was aus diesen fünf Fällen fällt und noch niemand
gemessen hat:**

14. **Die behauptete Herkunft.** PM-132 druckt „50 Tür(en) **aus
    Transkript**" für eine Zahl, die im Transkript nicht als Türzahl steht.
    Punkt 10 fragt, ob eine gekennzeichnete Annahme geprüft ist; **hier ist
    die Kennzeichnung selbst unwahr.** Ungemessen: **wie viele
    Berechnungswege sagen „aus Transkript", und bei wie vielen steht die
    Zahl wirklich im Transkript?** Eine Messung an allen Rechenwegen gegen
    ihren Eingabetext — prüfbar ohne App und größer als ein Fall, weil
    „aus Transkript" die Zeile ist, die einen Menschen vom Nachschauen
    abhält.
15. **Die Zeichensetzung als Preisfaktor.** PM-131 zeigt, dass ein Komma
    720,00 € entscheidet, und das Komma kommt aus der Spracherkennung, nicht
    vom Sprecher. Ungemessen: **welche anderen Messungen hängen an der
    Zeichensetzung des Transkripts?** Und, praktischer: **schreibt unsere
    Spracherkennung dieses Komma zuverlässig?** Der zweite Teil ist die
    einzige offene Frage dieses Themenspeichers, die **nicht** ohne App
    prüfbar ist — sie braucht einen echten Aufnahmelauf.
16. **Jede eigene Messung hängt an derselben Zeichensetzung.** PM-128 wurde
    mit Komma nachgemessen und sah behoben aus. **Wer einen „…zimmer"-Fall
    nachmisst und das Komma tippt, sieht den Fehler nicht.** Gehört zu H:
    eine Regel für die Fallbasis selbst, keine über das Produkt — jeder
    Raumsatz in der Fallbasis wird künftig in beiden Fassungen gemessen.
17. **Was auf der Landingpage steht, ist eine Zusicherung.** PM-130 hat den
    Satz auf unserer eigenen Seite als **PM-094** erkannt — ein bekannter
    Fund, veröffentlicht als Beispiel. Ungemessen: **die übrigen Diktate und
    Beispielzahlen der Seite gegen das Produkt**, Stück für Stück. Zwei sind
    jetzt gemessen (PM-129/PM-130), das Büro war es schon
    (`pm-landingpage-buero.test.ts`). Es gehört Marketing und mir zusammen,
    und es ist die billigste Absicherung, die Gate-1-Punkt 9.1 bekommen kann.
18. **Die Rückfrage nach der Höhe ist bis heute nicht gebaut.** PM-094 nennt
    sie seit dem 16.09. als richtige Antwort, PM-130 zeigt sie auf der
    Landingpage. Ungemessen ist nichts mehr daran — **es ist ein Bauauftrag,
    der nirgends in einer Spur steht.** Gehört in Engineerings Liste, nicht
    in meine.

*Prüfmeister · 2026-09-17, abends*


---

## Nachtrag 21.09.2026 — Punkt 14 ist zu, und ein Sammelpunkt Trockenbau macht auf

**Abgeräumt:**

* **Punkt 14 — die behauptete Herkunft** → gemessen, Ergebnis in
  `pruefmeister-restliste.md` (Lauf vom 21.09.), hinterlegt als
  `pruefmeister-herkunft-transkript.test.ts` (12 Prüfungen, grün).
  **40 Stellen schreiben „aus Transkript", kein einziger unbelegter
  Rechenweg.** PM-131/132/133 sind gebaut; die drei Fälle stehen jetzt als
  Gegenproben in der Messung statt als Funde.
  **Was der Punkt darüber hinaus gelehrt hat, gehört zu H** (Regeln für die
  Fallbasis selbst): *eine Messung, die nur nach der Ziffer sucht, misst
  nichts* — bei PM-132 stand die 50 im Text, nur am falschen Bauteil. Und:
  *jede Messung braucht eine Gegenprobe an sich selbst*, sonst ist „0 Funde"
  nicht von „misst nicht" zu unterscheiden.

**Offen bleiben** aus den älteren Abschnitten: **M.1** (teilweise), **M.3**,
**M.5**, Mittags-Punkt 7, Nachmittags-**Punkte 10, 11, 12, 13** — Punkt 11
(Umfang der Verneinungsmaschine) bleibt der mit dem größten Hebel — sowie die
**Punkte 15, 16, 17, 18** vom 17.09. abends. **Punkt 10 ist ausdrücklich
nicht** mit 14 miterledigt: eine Zeile, die „angenommen" sagt, sagt damit noch
nicht, ob die Annahme stimmt.

---

**19. Sammelpunkt Trockenbau** *(Nebenprodukt, kein Auftrag — Auftrag des
Chief of Staff vom 21.09., 07:58 UTC: auffallen lassen, nicht suchen)*

* **Sieben der 25 preislosen Engine-Titel sind Trockenbau**, gemessen im
  Abgleichslauf vom 21.09.: `Abgehängte Decke` · `Abgehängte Decke (GK)` ·
  `Dämmung Ständerwand einlegen` · `Doppelbeplankung (2× GK)` ·
  `Ständerwand errichten (GK)` · `Ständerwerk CW-Profil`. Solange das Gewerk
  gesperrt ist, kostet das nichts. Wird es aufgemacht, ist es der erste
  Stolperstein: **0,00 €-Zeilen sperren den Versand.**
* **Zwei Einheiten treffen aufeinander**, die der Maler nicht kennt: `lfdm`
  für Profile neben `m²` für Fläche — dieselbe Wand ergibt zwei Mengen aus
  einer Aufnahme. Ungemessen, ob die Pipeline das trägt.
* **Doppeldeutig gegen Maler:** „Wand" heißt beim Maler eine Fläche zum
  Streichen, im Trockenbau ein Bauteil zum Errichten. Dieselbe
  Verwechslungsklasse wie „ab-DECKE-n" (PM-017), nur teurer.
* **Die Gewerke-Sperre selbst ist ungemessen.** Ein Diktat mit Trockenbau muss
  sauber „noch nicht möglich" sagen. Ob es das tut, weiß ich nicht — das wäre
  der erste Prüffall, wenn jemand ihn haben will.

*Prüfmeister · 2026-09-21*


---

**20. Ein Engine-Titel, zwei Katalogzeilen, ein Drittel Preisunterschied**
*(Nebenbefund aus der Antwort an Engineering, 21.09. abends — kein Auftrag)*

**Das ist kein neues Thema, sondern der erste am Matcher gemessene Fall von
Punkt 12** (17.09. nachmittags, „wo sonst eine Engine-Zeile zwei Katalogzeilen
mit verschiedenen Preisen abdeckt"). PM-124 hat ihn an der Menge gezeigt —
hier zeigt er sich am Treffer.


* **Gemessen am Fall:** `Voranstrich / Grundierung` trifft im Standardkatalog
  `Grundieren (Tiefengrund)` **4,50 €/m²**. In derselben Kategorie
  `Maler – Untergrundvorbereitung` steht `Grundieren (Haftgrund / Sperrgrund)`
  **6,00 €/m²**. Nimmt man die erste Zeile heraus, landet **derselbe
  Engine-Titel** auf der zweiten — der Preis steigt um ein Drittel, ohne dass
  im Angebot irgendetwas anders aussieht. Genau so kamen die 279,00 €
  zustande, die ich am 17.09. live gesehen und fälschlich als Treffer-Fehler
  notiert hatte.
* **Was daran allgemein ist:** Der Gewerke-Filter trennt die zwei Zeilen
  nicht, nur der Titel-Score entscheidet. Jeder Betrieb, der in „Deine Preise"
  eine Zeile löscht oder umbenennt, kann damit den Preis einer Position
  verschieben, die er gar nicht angefasst hat. **Das ist die Kehrseite von
  Manfreds Warnung** aus `vokabular-abgleich.md`: dort ging es um Doppelte,
  die entstehen; hier um Doppelte, die schon da sind.
* **~~Ungemessen~~ — gemessen, 16:20 UTC desselben Tages.** Die Erweiterung
  steht als `scripts/vokabular-abgleich.mjs --zweittreffer`, das Ergebnis in
  `vokabular-abgleich.md` (Nachtrag 16:20 UTC) und als Sperrklinke in
  `pruefmeister-gleichstand-katalog.test.ts` (PM-138). **16 Engine-Titel**,
  bei denen mehrere Katalogzeilen denselben Höchst-Score tragen, verschieden
  kosten und keine so heißt wie der Titel — dort entscheidet allein die
  Reihenfolge im Katalog. Die Grundierung steht mit 33 % im unteren Drittel;
  oben stehen `Wände spachteln / glätten` (+144 %) und `Schleifen` (+138 %),
  wo dem Engine-Titel die Ausführungsstufe fehlt, die der Preis braucht.
  **Widerlegt dabei:** `Wände spachteln Q4` kippt NICHT auf die 9,00-€-Zeile,
  obwohl beide Score 1,00 haben — eine gleichlautende Katalogzeile schützt.
* **Kein Bauauftrag**, kein Termin, niemand wartet darauf.

*Prüfmeister · 2026-09-21, abends*


---

## Nachtrag 21.09.2026, abends — Punkt 11 ist zu, und er war eine Antwort und drei Fälle

**Fallbasis: 137 Fälle.** Hinterlegt als
`src/lib/__tests__/pruefmeister-batch-134-137.test.ts` (17 Zusicherungen,
14 grün, 3 Sperrklinken), Befunde ausführlich in `pruefmeister-restliste.md`.

**Abgeräumt:**

* **Punkt 11 — „Die Verneinungsmaschine hat einen Umfang, und den kennt
  niemand."** → **beantwortet.** Es sind **drei** Grenzen, nicht eine:
  Gegenprobe je **Satz** (Trenner `. ! ? ;` und Zeilenumbruch),
  Raumzuordnung je **Teilsatz** (Trenner Komma), Reichweite des Ausschlusses
  **ganzer Text** (keine Entfernung, keine Richtung). **Ein Absatz ist keine
  eigene Einheit.** Festgehalten als PM-137, damit ein Fix an PM-101, PM-105
  oder PM-125 nicht wieder geraten werden muss — genau die Auflage, die
  dieser Punkt sich selbst gegeben hat.
* Aus den Nähten zwischen den drei Grenzen fallen **PM-134** (Ausschluss vor
  dem Auftrag gewinnt, 356,25 € stumm weg), **PM-135** (Komma statt Punkt
  hebelt den Ausschluss aus, 465,90 € zu viel — der erste Fall dieser Familie,
  bei dem das Geld gegen den KUNDEN läuft) und **PM-136** (Ausschluss ohne
  Raumnamen erbt den zuletzt genannten Raum, statt zu fragen).

**Neu aufgemacht:**

21. **Dieselbe Satzmechanik sitzt in zwei weiteren Bremsen.**
    `sockelleisten-ausschluss.ts` (PM-033) und `raum-ausschluss.ts` (PM-034)
    holen ihre Sätze aus demselben `satz-raum.ts`. Ob PM-134 bis PM-136 dort
    genauso sitzen, ist **ungemessen** — ich halte es für wahrscheinlich und
    behaupte es nicht. Prüfbar ohne App, am Ausdruck, klein.
22. **Die Belege der Bremse werden gesammelt und nirgends gezeigt.**
    `erkenneBauteilAusschluss` führt `belege` mit dem Satz, auf den sich der
    Wegfall stützt; außerhalb der eigenen Datei liest sie niemand. Deshalb ist
    jeder Wegfall stumm. **Gehört dem Designer** (Wo steht der Satz auf dem
    Blatt?) und steht als Notiz in `pruefmeister-notizen-fuer-designer.md`.

**Offen bleiben** aus den älteren Abschnitten: **M.1** (teilweise), **M.3**,
**M.5**, Mittags-Punkt 7, Nachmittags-**Punkte 10, 12, 13**, die **Punkte 15,
16, 17, 18** vom 17.09. abends sowie **19**. **Punkt 20 ist im selben Lauf
gemessen** (PM-138, 16:20 UTC — 16 Titel, bei denen die Katalogreihenfolge
den Preis entscheidet) und damit zu. Punkt 11 ist der mit dem größten Hebel,
der zu ist — **Punkt 12** rückt an seine Stelle; PM-138 ist bereits seine
Messung am Katalog, die Messung an der MENGE (PM-124) steht noch aus.

**Fallbasis nach diesem Lauf: 138.**

*Prüfmeister · 2026-09-21, abends*

---

## Nachtrag 21.09.2026, später Abend — Punkt 12 und Punkt 21 sind zu, beide kleiner als vermutet

**Fallbasis: 144 Fälle.** Hinterlegt als
`src/lib/__tests__/pruefmeister-batch-139-143.test.ts` (16 Zusicherungen,
12 grün / 4 Sperrklinken) und
`src/lib/__tests__/pruefmeister-pm144-zuschlag-wortlaut.test.ts`
(6 Zusicherungen, 4 grün / 2 Sperrklinken). Befunde ausführlich in
`pruefmeister-restliste.md`.

**Abgeräumt:**

* **Punkt 12 — „Zwei Preise für dieselbe Arbeit auf EINER Zeile."** →
  **gemessen, und die Klasse ist klein.** Alle **184 Engine-Titel** gegen den
  Standardkatalog: **genau zwei** tragen zwei Katalogzeilen mit verschiedenem
  Preis — `Altfliesen abstemmen` (Boden 18,00 € / Wand 22,00 €, das ist
  PM-124 selbst) und `Aufpreis Diagonalverlegung` (Parkett 10,00 € / Fliesen
  12,00 € und 14,00 €, heute latent). **Meine Vermutung einer breiten Klasse
  ist widerlegt.** `Verfugen`, `streichen`, Großformat, Naturstein,
  Wanddurchbruch spreizen im Katalog genauso und sind harmlos, weil die
  Engine dort den Ort selbst nennt: **der Unterschied ist nie der Katalog,
  immer der Engine-Titel.** **PM-139.**
* **Punkt 21 — „Dieselbe Satzmechanik sitzt in zwei weiteren Bremsen."** →
  **gemessen, und es ist ein geteiltes Bild, kein Durchschlag.**
  **PM-134 sitzt** in `sockelleisten-ausschluss.ts` (**PM-141**),
  **PM-136 sitzt in beiden** Bremsen (**PM-142**), **PM-135 sitzt in keiner**
  (**PM-143**). Der Grund für alle drei Antworten ist derselbe:
  `saetzeMitRaum()` liefert **Teilsätze**, nicht Sätze — die
  Sockelleisten-Bremse liest von Haus aus eine Stufe feiner.

**Neu aufgemacht:**

23. **Die Fliesen-Engine kennt die Verlegerichtung nicht.** `boden.ts` liest
    sie und setzt je Belag einen eigenen Aufpreis; `fliesen.ts` hat weder
    `diagonal` noch Musterverlegung. Die Katalogzeilen `Aufpreis
    Diagonalverlegung Boden` (12,00 €) und `… Wand` (14,00 €) haben damit
    **keinen Engine-Titel** — diagonal verlegte Fliesen kosten im Angebot
    dasselbe wie gerade verlegte. **PM-140** 🔴, Sperrklinke, Bauauftrag
    offen; Muster steht in `boden.ts` Z. 202–205. **Und die größere Frage
    dahinter, ungemessen: welche Katalogzeilen haben sonst noch keinen
    Engine-Titel?** Der Abgleich misst bisher nur die Gegenrichtung
    (Engine-Titel ohne Preis, 25 Stück). Klein, ohne App, am Katalog.
24. **Zwei Bremsen, ein Satzbau, zwei Antworten.** Seit CoS-E-091 hat die
    Gegenprobe der Bauteil-Bremse innerhalb des Satzes eine **Richtung**; die
    Sockelleisten-Bremse ist über das Komma in **beide** Richtungen blind.
    „… machen wir nichts, … neu" heißt in der einen Bremse *kein Ausschluss*,
    in der anderen *Ausschluss*. **PM-143-A**, Sperrklinke. Welche Antwort
    die richtige ist, gehört an **PM-134** entschieden, nicht hier.
25. **Der Wortlaut der Bemessungsgrundlage ist entschieden, der Bau steht
    aus.** `(Leistungen Maler — Wohnzimmer)`, wenn Raum **und** Gewerk
    filtern. **PM-144**, zwei Sperrklinken, eine Zeile in
    `zuschlagBerechnungsweg()`. Die Datei liegt in Engineerings Arbeitsbaum
    (CoS-E-092) — deshalb Zusicherung statt fremder Hand.

**Offen bleiben** aus den älteren Abschnitten: **M.1** (teilweise), **M.3**,
**M.5**, Mittags-Punkt 7, Nachmittags-**Punkte 10, 13**, die **Punkte 15, 16,
17, 18** vom 17.09. abends sowie **19** und **22**. **Punkt 12 und Punkt 21
sind zu.** Der größte Hebel unter den offenen ist jetzt **Punkt 13** (der
Katalogtitel als gedruckter Titel, 184 Titel, ohne App) — gefolgt von dem
neuen **Punkt 23**, der dieselbe Messung von der anderen Seite her macht.

**Fallbasis nach diesem Lauf: 144.**

*Prüfmeister · 2026-09-21, später Abend*


---

## Nachtrag 23.09.2026 — der Fenster-/Heizkörper-Fund ist gemessen und hat zwei Nummern

**Fallbasis: 146 Fälle.** Hinterlegt als
`src/lib/__tests__/pruefmeister-batch-145-146.test.ts` (12 Zusicherungen,
8 grün / 4 Sperrklinken / 0 rot). Befunde ausführlich in
`pruefmeister-restliste.md`.

**Abgeräumt — die Zuweisung des Chief of Staff vom 22.09., 05:50 UTC:**

* **PM-145 — die Dativ-Mehrzahl am Fenster und am Heizkörper.** „An den
  **Fenstern** machen wir nichts" und „An den **Heizkörpern** machen wir
  nichts" liest die Bauteil-Bremse nicht; die Einzahl liest sie. Gemessen
  über die volle Pipeline: auf einem Angebot über **835,90 €** hängen an
  diesen zwei Wörtern **370,00 €** (Fensterblock 200,00 €, Heizkörperblock
  170,00 €) — und sie fallen **stumm**, ohne Fehlt-Eintrag. Ursache: zwei
  fehlende Buchstaben in `SATZ_WORT`; das ganze `src/lib` abgesucht, **keine
  zweite Stelle**. Sperrklinken **PM-145-A/-B/-C**, Soll ist jeweils die
  Einzahl. Die Grenze des Solls steht als **PM-145-4** grün daneben, damit
  der Bau nicht zu weit greift.
* **PM-146 — der Anstrich-Auftrag ohne Zahlwort.** „Wände und Decke weiß."
  zählt für die Gegenprobe nicht als Auftrag, „zweimal weiß" schon. Nach
  einem Ausschlusssatz macht das aus **465,90 €** ein **leeres Blatt
  (0,00 €)** — die Folgepositionen fallen mit der Wand. **Entschieden: die
  Zahlangabe fällt als Bedingung.** Gründe gemessen: die Mengen-Erkennung
  eine Stufe davor liest `weiß` nackt (die Bremse ist enger als die Stufe,
  die die Zeile setzt), und die heutige Regel liegt an 17 Formulierungen
  **sechsmal** daneben — immer zu eng, nie zu weit. Wortlaut: „weiß" ist ein
  Anstrich-Auftrag, außer unmittelbar davor oder dahinter steht ein Fürwort.
  An denselben 17 Formulierungen **0 falsch**. Sperrklinke **PM-146-A**,
  Schutzzeile **PM-146-4** (grün, muss grün bleiben).

**Nichts neu aufgemacht.** Beide Fälle sind mit dem Soll zu Ende beschrieben;
was offen bleibt, ist der Bau, und der gehört Engineering.

**Offen bleiben** aus den älteren Abschnitten unverändert: **M.1**
(teilweise), **M.3**, **M.5**, Mittags-Punkt 7, Nachmittags-**Punkte 10, 13**,
die **Punkte 15, 16, 17, 18** vom 17.09. abends sowie **19**, **22**, **23**,
**24** und **25**. **Der größte Hebel unter den offenen ist weiterhin
Punkt 13** (der Katalogtitel als gedruckter Titel, 184 Titel, ohne App) —
gefolgt von **Punkt 23** (Katalogzeilen ohne Engine-Titel), der dieselbe
Messung von der anderen Seite her macht. Das ist die Reihenfolge, die der
Chief of Staff am 22.09. gesetzt hat, und sie gilt ab jetzt wieder: **der
Fund, der vorging, ist zu.**

**Fallbasis nach diesem Lauf: 146.**

*Prüfmeister · 2026-09-23*


<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
