# DC-102 — Entwurf: der neue Preise-Schritt im Onboarding

*Product Designer · 14.09.2026 · **Entwurf, nicht zum Einbau.**
Grundlage: `docs/preisliste-konzept.md` (Fassung 2) und die Datenseite von Head
of Product Engineering (`src/lib/taetigkeiten.ts`, `halbsatz()`,
`kundensatz()`). Sandys Entscheidung: die vollständige Lösung, keine
Zwischenlösung.*

---

## Was hier drinsteht und was nicht

Das Preislisten-Konzept sagt, **was** gefragt wird und warum. Dieses Dokument
sagt, **wie es auf dem Bildschirm aussteht**: Reihenfolge, Zustände, Wortlaut,
und die drei Stellen, an denen es kippen kann. Ich erfinde inhaltlich nichts
neu — wo ich von der Vorlage abweiche, steht es ausdrücklich da.

Offen und **nicht** von mir zu entscheiden: die dritte Zahl (Abschnitt 4.3 des
Konzepts, 🔴), der regionale Preisfaktor (CoS-E-043) und das Vokabular
(Abschnitt 3). Zwei davon sitzen laut Chief of Staff ohnehin vor dieser Arbeit.

---

## Der rote Faden: vier Bildschirme, eine Frage pro Bildschirm

Heute ist der Preise-Schritt **ein** Bildschirm mit fünf Feldern, die nichts
miteinander zu tun haben. Neu sind es vier, und jeder beantwortet genau eine
Frage:

| | Bildschirm | Die eine Frage |
|---|---|---|
| 1 | Tätigkeiten | Was machst du? |
| 2 | Material | Sind in deinen Preisen die Materialkosten drin? |
| 3 | Zahlen | Was kostet das bei dir? |
| 4 | Nick-Seite | Stimmt der Rest? |

**Abweichung von der Vorlage, bewusst:** Das Konzept legt Tätigkeit und
Material-Standard auf **einen** Bildschirm (Haken plus antippbarer Halbsatz).
Ich trenne sie. Begründung unten — das ist die wichtigste Entwurfsentscheidung
in diesem Dokument und die einzige, bei der ich widerspreche.

---

## Bildschirm 1 — Was machst du?

```
Was machst du?
Wähle alles, was du anbietest.

☑  Innen streichen
☐  Tapezieren
☐  Lackieren
☑  Fassade
☑  Boden

                                    [ Weiter → ]
```

Fünf Haken, sonst nichts. Keine Halbsätze, keine Umschalter, keine Vorschau.

**Warum ohne den Material-Halbsatz.** Manfreds Satz *„Das sind keine
zusätzlichen Fragen, das ist dieselbe Frage mit mehr Antworten"* stimmt für den
**Haken**. Für den Material-Umschalter daneben stimmt er nicht: Das ist eine
zweite Frage, und zwar eine, die der Handwerker beim ersten Hinsehen für eine
Beschriftung hält. Fünf Zeilen mit je zwei Bedeutungen — ein Haken links, ein
antippbarer Zustand rechts — heißt, dass ein Tipp auf die falsche Hälfte etwas
anderes tut als erwartet. Auf dem Handy, mit dem Daumen, in der ersten Minute
mit der App.

Der Material-Standard ist außerdem die Zahl-bestimmende Angabe des ganzen
Schritts: Ob „Wand streichen 11 €" mit oder ohne Farbe gemeint ist, verschiebt
jede abgeleitete Zeile. So etwas gehört nicht als Beiwerk an eine Checkbox.
Es bekommt seinen eigenen Bildschirm — den nächsten.

**Was bleibt wie im Konzept:** Fassade ist ein eigener Haken und ab hier eine
eigene Preiswelt, nie aus Innen abgeleitet.

---

## Bildschirm 2 — Material

Erscheint nur für die gewählten Tätigkeiten. Bei drei Haken drei Zeilen.

```
Sind in deinen Preisen die Materialkosten drin?
Wenn du unsicher bist: So steht es später auf dem Angebot.
Du kannst es an jeder einzelnen Position ändern.

Innen streichen        [ inkl. Farbe ] [ ohne Farbe ]
Fassade                [ inkl. Farbe ] [ ohne Farbe ]
Boden                  [ inkl. Belag ] [ ohne Belag ]

                                    [ Weiter → ]
```

- **Kein Schalter, sondern zwei Knöpfe nebeneinander.** Ein Schalter hat einen
  Zustand, den man ablesen muss („ist das jetzt an oder aus?"). Zwei
  beschriftete Knöpfe zeigen beide Möglichkeiten gleichzeitig; man erkennt die
  Antwort, ohne sie zu interpretieren.
- **Das Material heißt beim Namen** — `inkl. Farbe`, `inkl. Lack`,
  `inkl. Tapete`, `inkl. Belag`, `inkl. Fliesen`, jeweils auch mit `ohne`.
  Genau die zehn Fassungen, die `halbsatz()` liefert. Der Prüfmeister hat
  recht: „ohne Material" wäre selbst schon falsch, weil bei Tapete der
  Kleister drinbliebe.
- **Die Vorbelegung kommt aus `taetigkeiten.ts`** (innen/tapezieren/lackieren
  drin, Fassade/Boden getrennt) und ist nur das — eine Vorbelegung.
- **Der zweite Satz ist kein Beiwerk.** „Du kannst es an jeder einzelnen
  Position ändern" nimmt der Frage die Endgültigkeit. Ohne ihn ist das die
  Stelle, an der jemand hängenbleibt, weil er es bei Raufaser anders hält als
  bei Vliestapete.

---

## Bildschirm 3 — Die Zahlen

Nur die Felder der gewählten Tätigkeiten, plus der Stundensatz.

```
Was kostet das bei dir?
Grob reicht — du kannst alles später ändern.

Wand streichen, 2 Anstriche                    [  11,00 ] €/m²
   Fertige Wand, inkl. Farbe. Abkleben und Abdecken zählen extra.

Decke streichen, 2 Anstriche                   [   ____ ] €/m²
   Wie oben, für Decken.

Fassade streichen, 2 Anstriche                 [   ____ ] €/m²
   Eigene Zahl — wird nie aus deinen Innenpreisen abgeleitet.

Tür lackieren                                  [   ____ ] €/Stück
   Pro Tür mit Zarge, beidseitig.

Dein Stundensatz                               [   ____ ] €/Std
   Für alles, was nach Aufwand geht.

                                    [ Weiter → ]
```

- **Jede Zahl trägt ihren Halbsatz.** Manfred: *„Eine Zahl ohne Bezugsgröße ist
  keine Zahl."* Der Halbsatz steht **unter** der Beschriftung und **nicht** im
  Platzhalter des Feldes — ein Platzhalter verschwindet beim Tippen, also genau
  dann, wenn man ihn braucht.
- **Der Halbsatz nennt auch das Material**, passend zu Bildschirm 2. Wer dort
  „ohne Farbe" gewählt hat, liest hier „Fertige Wand, **ohne** Farbe".
- **Leere Felder sind erlaubt.** Wer nur zwei Zahlen weiß, kommt weiter; der
  Rest wird abgeleitet. Ein Pflichtfeld auf diesem Bildschirm wäre der
  sicherste Weg, jemanden zum Erfinden einer Zahl zu bringen.
- **Vorschlagswerte:** Falls der regionale Preisfaktor bleibt (CoS-E-043,
  Sandys Entscheidung), justiert er genau hier die Vorbelegung vor — und
  danach nie wieder. Bis das entschieden ist, zeichne ich die Felder leer.
- **„Grob reicht"** ist bewusst der erste Satz. Er ist die Erlaubnis, nicht
  perfekt zu sein, und er ist der Grund, warum jemand diesen Bildschirm nicht
  wegklickt.

---

## Bildschirm 4 — Die Nick-Seite

Das Konzept nennt sie den Kern und nicht die Kür. Entsprechend ist sie hier
kein Abschluss-Haken, sondern ein eigener Bildschirm mit eigenem Ton.

```
Das hat die App daraus gemacht
40 Preise, abgeleitet aus deinen 5 Zahlen.
Schau drüber — was nicht passt, tippst du an.

  Wand streichen 1x                    8,25 €/m²   ✎
     abgeleitet aus: Wand 2x

  Wand grundieren                      4,40 €/m²   ✎
     abgeleitet aus: Wand 2x

  Decke streichen 1x                   7,50 €/m²   ✎
     abgeleitet aus: Decke 2x
  …

                        [ Passt alles ]   [ Später ]
```

- **„Das hat die App daraus gemacht"**, nicht „Deine Preisliste". Solange er
  nicht genickt hat, gehört die Liste der App. Das ist der ganze Punkt des
  Bildschirms: Der Besitz wechselt beim Nicken, nicht beim Anzeigen.
- **Die Herkunftszeile steht unter jeder Zeile**, nicht nur bei den auffälligen
  — sie ist die Einladung zum Widerspruch. Manfreds Beispiel (1x ist bei ihm
  75 % von 2x, nicht 63 %) findet man nur, wenn dransteht, woraus die Zahl
  kommt.
- **Antippen ändert die Zeile an Ort und Stelle**, kein neuer Bildschirm. Wer
  eine Zahl ändert, will gleich die nächste sehen.
- **Änderungen brechen die Ableitung nur für diese Zeile.** Eine geänderte
  Zeile bekommt statt „abgeleitet aus" ein schlichtes **„von dir"**. Ob eine
  spätere Änderung des Ankers sie wieder überschreiben darf, ist eine
  Datenfrage an Engineering — aus Nutzersicht ist die Antwort klar: **nein,
  was er angefasst hat, bleibt seins.**
- **40 Zeilen sind viel.** Sie werden nach Tätigkeit gruppiert (dieselben
  Überschriften wie Bildschirm 1), damit man sie überfliegen kann, statt sie
  zu lesen.

### Der „Später"-Knopf und seine Folge

Das Konzept fordert: Wenn der Knopf bleibt, dann mit Folge. Vorschlag für die
Umsetzung:

> Auf jedem Angebot, oben: **„Diese Preise sind Durchschnittswerte, keine
> eigenen."** Daneben ein Link **„Jetzt durchgehen"**, der auf die Nick-Seite
> führt. Verschwindet, sobald sie einmal durchlaufen ist.

Bewusst **kein** roter Warnbalken: Es ist kein Fehler, mit
Durchschnittspreisen zu starten. Es ist ein Zustand, den er kennen muss —
dieselbe Tonlage wie der „fehlende Preise"-Balken, den Manfred bereits als
„klar und ehrlich" gelobt hat (DC-069).

---

## Die drei Stellen, an denen es kippen kann

1. **Bildschirm 3 wirkt wie eine Prüfung.** Fünf leere Zahlenfelder direkt
   hintereinander sind der Moment, in dem jemand „überspringen" sucht. Gegenmittel
   im Entwurf: „Grob reicht", leere Felder erlaubt, Halbsätze, die die Frage
   beantworten statt sie zu stellen. Das ist der Bildschirm, den ein Prototyp
   als erstes belegen muss.
2. **Die Nick-Seite wird weggeklickt.** 40 Zeilen und ein großer grüner Knopf
   heißen „hier muss ich nichts tun". Deshalb steht „Passt alles" **neben**
   „Später" und nicht darüber, und deshalb heißt die Überschrift, was sie
   heißt.
3. **Material wird zweimal gefragt.** Wenn Bildschirm 2 und die Halbsätze auf
   Bildschirm 3 nicht exakt dieselben Worte benutzen, entsteht der Eindruck,
   es seien zwei verschiedene Fragen. Beide ziehen deshalb aus `halbsatz()`,
   keine handgeschriebene zweite Fassung.

---

## Was als Nächstes kommt — und was nicht

**Nicht:** einbauen. Der Chief of Staff hat zwei Abhängigkeiten benannt, die
davor sitzen (Vokabular-Angleich, CoS-E-052), und Sandys Go zum Entwurf steht
noch aus.

**Als Nächstes von mir, sobald der Entwurf abgenickt ist:** ein Prototyp der
**Nick-Seite**. Nur dieser eine Bildschirm — die anderen drei sind Formulare,
die sich aus Text beurteilen lassen. Die Nick-Seite nicht: Ob 40 Zeilen mit
Herkunftsangabe überfliegbar sind oder erschlagen, ob das Antippen sich
richtig anfühlt, und ob „Passt alles" nach Zustimmung oder nach Wegklicken
aussieht, entscheidet sich am Daumen, nicht am Absatz. Dieselbe Lehre wie bei
DC-038 (Freihand-Zeichnen): Interaktionen, die man noch nie gesehen hat,
lassen sich nicht aus Text beurteilen.
