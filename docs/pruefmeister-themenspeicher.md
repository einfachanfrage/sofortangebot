# Themenspeicher — was in den Testfällen noch abgedeckt werden muss

**Zweck:** Damit nichts vergessen wird. Hier steht jedes Thema, das in einem
echten Auftrag vorkommt, mit dem Stand seiner Abdeckung. Kein Thema wird aus
dieser Liste gelöscht, wenn es abgedeckt ist — es bekommt die Fallnummer
dahinter. Gelöscht wird nur, was sich als gegenstandslos erweist.

**Warum es die Liste gibt:** Die ersten 37 Fälle waren alle rechteckige Räume mit
Fenstern und Türen — die Welt, die das Datenmodell ohnehin kann. Alles, was *in*
einem Raum steht, kam nicht vor. Diese Liste ist die Gegenprobe: sie wird nicht
aus dem Datenmodell abgeleitet, sondern aus der Baustelle.

**Zielgröße:** 100 Fälle. Stand 16.09.2026: **97**
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
| Wandnische im Bad, gefliest (eigene Katalogzeile, 95,00 €/Stück) | **PM-075** 🔴 — Nischensatz ändert nichts |
| Erker (Zusatzfläche über 2,5 m²) | **PM-081** 🔴 — gesagte Zusatzfläche verschwindet spurlos |
| Wandnische / Regalnische | **PM-089** 🔴 — **Katalog-Lücke** wie PM-076: der Malerkatalog kennt die Nische nur beim Tapezieren (6,00 €/lfdm), nicht beim Streichen. Der Satz ändert heute gar nichts |
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
| Zwei Bauabschnitte, getrennte Angebote | **PM-097** 🔴 — „wird getrennt abgerechnet" wirkt nirgends: eine Liste, eine Summe über beide Abschnitte. Auftrennen liegt oberhalb der Pipeline, das **Bemerken** nicht |

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

### K.6 — OFFEN. Rosette mitgestrichen: welche Katalogzeile ist das? (Frage: Head of Product Engineering, 16.09.2026, nachts)

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

### K.7 — OFFEN. Acht Sichtbalken: rechnen oder fragen? (Frage: Head of Product Engineering, 16.09.2026, nachts)

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

### Ein Fund nebenbei, der in die Fallbasis gehört — zu PM-074 (Engineering, 16.09.2026)

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
