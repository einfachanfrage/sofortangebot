# Themenspeicher — was in den Testfällen noch abgedeckt werden muss

**Zweck:** Damit nichts vergessen wird. Hier steht jedes Thema, das in einem
echten Auftrag vorkommt, mit dem Stand seiner Abdeckung. Kein Thema wird aus
dieser Liste gelöscht, wenn es abgedeckt ist — es bekommt die Fallnummer
dahinter. Gelöscht wird nur, was sich als gegenstandslos erweist.

**Warum es die Liste gibt:** Die ersten 37 Fälle waren alle rechteckige Räume mit
Fenstern und Türen — die Welt, die das Datenmodell ohnehin kann. Alles, was *in*
einem Raum steht, kam nicht vor. Diese Liste ist die Gegenprobe: sie wird nicht
aus dem Datenmodell abgeleitet, sondern aus der Baustelle.

**Zielgröße:** 100 Fälle. Stand 15.09.2026, nachts: **78**
(46 + PM-047 bis PM-056 + PM-057 bis PM-063 + PM-064 bis PM-068
+ PM-069 bis PM-078).

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
| Erker (Zusatzfläche über 2,5 m²) | offen |
| Wandnische / Regalnische | offen |
| Rollladenkästen | **PM-076** 🔴 — **Katalog-Lücke**, nicht Code |
| Bodenluke, Bodentank, Revisionsklappe | offen |

## B — Zustand der Baustelle *(bewohnt, belegt, dreckig)*

| Thema | Stand |
|---|---|
| Bewohnte Wohnung, Möbel rücken und abdecken (Besondere Leistung, DIN 18363 4.2) | **PM-039** |
| Möbel komplett ausräumen und zurückräumen | **PM-069** 🔴 — beide Katalogzeilen da, keine kommt |
| Küche/Bad im Betrieb, nur abkleben | **PM-041** |
| Bodenbelag bleibt und muss geschützt werden vs. Boden wird neu (dann **kein** Abdecken) | **PM-038** |
| Fliesenspiegel wird ausgespart | **PM-041** |
| Schimmelbefall, Behandlung vor Anstrich | **PM-043** |
| Nikotin-/Rußbelastung, Sperrgrund nötig | **PM-046** (fünf Funde) + **PM-064** — Auslöser am Wortstamm |
| Alte Tapete muss runter, Zustand unbekannt | **PM-077** — Zeile stimmt, trägt aber `automatisch_ergaenzt` |
| Baustelle bewohnt → Staubschutzwand, Abendreinigung | offen |

## C — Haustechnik unter dem Belag

| Thema | Stand |
|---|---|
| Fußbodenheizung: Aufpreis, Verklebung, **keine** Trittschalldämmung, CM-Messung | **PM-040** |
| Frischer Estrich, Belegreife ungeklärt | **PM-040** |
| Elektrische Heizmatte | offen |
| Estrich rissig, muss verharzt werden | offen |
| Feuchter Untergrund, Sperrschicht nötig | offen |

## D — Geometrie jenseits des Rechtecks

| Thema | Stand |
|---|---|
| Wechselnde Raumhöhe: Treppenhaus, Luftraum, Galerie | **PM-042** |
| Treppe: Stufen, Setzstufen, Wangen, Geländer | **PM-065** 🔴 — keine einzige Treppenposition entsteht |
| L-förmiger Raum | PM-035 ✅ |
| Dachschräge, Kniestock | PM-007, PM-030 ✅ |
| Runder Raum / Rundung in der Wand | offen |
| Raum mit Podest / Stufe im Raum | offen |
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
| Handwerker nennt Preise selbst („das mach ich für 12 den Meter") | offen |
| Handwerker nennt Stunden statt Mengen | offen |
| Sehr kurze Aufnahme („Wohnzimmer streichen, 20 Quadrat") | offen |
| Widersprüchliche Angaben im selben Diktat | offen |

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
| Kleinauftrag: Anfahrt und Mindestmenge tragen den Preis | offen |
| Aufmaß nachträglich korrigiert (Bearbeiten-Ansicht) | PM-031 |
| Nachtrag zu einem bestehenden Angebot | offen |
| Skonto / Zahlungsziel / Abschlagszahlungen | offen (Legal) |
| Kunde will Material selbst stellen | offen |
| Zwei Bauabschnitte, getrennte Angebote | offen |

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


