# Themenspeicher — was in den Testfällen noch abgedeckt werden muss

**Zweck:** Damit nichts vergessen wird. Hier steht jedes Thema, das in einem
echten Auftrag vorkommt, mit dem Stand seiner Abdeckung. Kein Thema wird aus
dieser Liste gelöscht, wenn es abgedeckt ist — es bekommt die Fallnummer
dahinter. Gelöscht wird nur, was sich als gegenstandslos erweist.

**Warum es die Liste gibt:** Die ersten 37 Fälle waren alle rechteckige Räume mit
Fenstern und Türen — die Welt, die das Datenmodell ohnehin kann. Alles, was *in*
einem Raum steht, kam nicht vor. Diese Liste ist die Gegenprobe: sie wird nicht
aus dem Datenmodell abgeleitet, sondern aus der Baustelle.

**Zielgröße:** 100 Fälle. Stand heute 37 + 7 in Arbeit = 44.

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
| Deckenrosette | offen |
| Sichtbalken / Balkendecke, Altbau | offen |
| Einbauküche bleibt stehen, wird abgeklebt | **PM-041** |
| Einbauschrank vor der Wand | offen |
| Kamin / Kaminsockel im Raum (Boden: Aussparung) | offen |
| Erker (Zusatzfläche über 2,5 m²) | offen |
| Wandnische / Regalnische | offen |
| Rollladenkästen | offen |
| Bodenluke, Bodentank, Revisionsklappe | offen |

## B — Zustand der Baustelle *(bewohnt, belegt, dreckig)*

| Thema | Stand |
|---|---|
| Bewohnte Wohnung, Möbel rücken und abdecken (Besondere Leistung, DIN 18363 4.2) | **PM-039** |
| Möbel komplett ausräumen und zurückräumen | offen |
| Küche/Bad im Betrieb, nur abkleben | **PM-041** |
| Bodenbelag bleibt und muss geschützt werden vs. Boden wird neu (dann **kein** Abdecken) | **PM-038** |
| Fliesenspiegel wird ausgespart | **PM-041** |
| Schimmelbefall, Behandlung vor Anstrich | **PM-043** |
| Nikotin-/Rußbelastung, Sperrgrund nötig | offen |
| Alte Tapete muss runter, Zustand unbekannt | offen |
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
| Treppe: Stufen, Setzstufen, Wangen, Geländer | **PM-042** (nur Geländer), Rest offen |
| L-förmiger Raum | PM-035 ✅ |
| Dachschräge, Kniestock | PM-007, PM-030 ✅ |
| Runder Raum / Rundung in der Wand | offen |
| Raum mit Podest / Stufe im Raum | offen |
| Sehr niedrige Räume (< 2,20 m, Keller) | **PM-044** |

## E — Sprache und Aufnahme *(wie Handwerker wirklich reden)*

| Thema | Stand |
|---|---|
| Selbstkorrektur mitten im Satz („nee warte, doch drei Meter") | teilweise PM-001, eigener Fall offen |
| Zahlwörter, Dialekt, „zwo", „einskommafünf" | PM-034, PM-035 ✅ |
| Mehrere Aufnahmen zu einem Angebot | teilweise, eigener Fall offen |
| Kunde redet im Hintergrund dazwischen | offen |
| Unterbrechung, Aufnahme bricht ab und wird fortgesetzt | offen |
| Handwerker nennt Preise selbst („das mach ich für 12 den Meter") | offen |
| Handwerker nennt Stunden statt Mengen | offen |
| Sehr kurze Aufnahme („Wohnzimmer streichen, 20 Quadrat") | offen |
| Widersprüchliche Angaben im selben Diktat | offen |

## F — Gewerke, die noch nie getestet wurden

| Thema | Stand |
|---|---|
| Bad / Fliesen (DIN 18352) | offen — eigener Batch |
| Treppen komplett | offen |
| Türen, Zargen, Fenster lackieren (Katalog + Felder da, **kein Testfall**) | offen |
| Trockenbau: Wand stellen, Decke abhängen | offen |
| Abbruch und Entsorgung, Container | offen |
| Estrich | offen |
| Fassade mit Gerüst | teilweise PM-008, PM-031 |

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


*Prüfmeister · angelegt 2026-09-10 · wird bei jedem neuen Batch fortgeschrieben*
