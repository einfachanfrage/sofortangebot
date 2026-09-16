# DC-102 — Entwurf: der neue Preise-Schritt im Onboarding

*Product Designer · 14.09.2026, Fassung 2 vom 16.09.2026 (DC-108) · **Entwurf, nicht zum Einbau.**
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

## Der rote Faden: drei Bildschirme, eine Frage pro Bildschirm

*(Fassung 2 dieses Dokuments, 16.09.2026. Fassung 1 hatte vier Bildschirme und
Material auf einem eigenen. Head of Product Engineering hat am 15.09. anders
entschieden — mein Einwand war richtig, seine Lösung ist besser als meine.
Die alte Fassung steht nicht mehr hier; nachlesbar ist der Verlauf in
`docs/design-check.md`, Abschnitt „DC-102 — Entscheidung".)*

Heute ist der Preise-Schritt **ein** Bildschirm mit fünf Feldern, die nichts
miteinander zu tun haben. Neu sind es drei, und jeder beantwortet genau eine
Frage:

| | Bildschirm | Die eine Frage |
|---|---|---|
| 1 | Tätigkeiten + Material | Was machst du — und steckt das Material im Preis? |
| 2 | Zahlen | Was kostet das bei dir? |
| 3 | Nick-Seite | Stimmt der Rest? |

---

## Bildschirm 1 — Was machst du?

```
Was machst du?
Wähle alles, was du anbietest.
Du kannst das später an jeder einzelnen Position ändern.

☑  Innen streichen
       MATERIAL     [ Farbe inkl. ]  [ Farbe extra ]

☑  Tapezieren
       Kundentapeten (Muster, Foto, Textil) rechnet die App
       immer getrennt ab.
       MATERIAL
       [ Malerware inkl. ]  [ Malerware extra ]

☐  Lackieren

☑  Fassade
       MATERIAL     [ Farbe inkl. ]  [ Farbe extra ]

☑  Boden
       MATERIAL     [ Belag inkl. ]  [ Belag extra ]

                                    [ Weiter → ]
```

**Eine Frage pro Zeile statt einer Frage pro Bildschirm.** Mein ursprünglicher
Einwand galt der Hakenzeile mit zwei Bedeutungen — Haken links, antippbarer
Zustand rechts. Zwei Bedeutungen in einer Zeile sind zwei Ziele für einen
Daumen. Der Einwand ist damit erledigt, nicht umgangen: Die Materialzeile
steht **unter** dem Haken, über die volle Breite, mit eigener Beschriftung.
Ein zweiter Bildschirm, der dieselbe Liste noch einmal zeigt, hätte dagegen
genau den Eindruck erzeugt, gegen den Manfreds Satz zielt.

- **Ungesetzte Haken zeigen nichts.** Der Bildschirm startet als fünf saubere
  Checkboxen und wächst nur um das, was er wirklich braucht.
- **Kein Schalter, sondern zwei Knöpfe nebeneinander.** Ein Schalter hat einen
  Zustand, den man ablesen muss („ist das jetzt an oder aus?"). Zwei
  beschriftete Knöpfe zeigen beide Möglichkeiten gleichzeitig.
- **Das Material heißt beim Namen** — nie „ohne Material". Der Prüfmeister hat
  recht: Bei „Vliestapete tapezieren ohne Material" bliebe der Kleister drin,
  und man streitet später über zwanzig Euro.
- **Die Vorbelegung kommt aus `taetigkeiten.ts`** (innen/tapezieren/lackieren
  drin, Fassade/Boden getrennt) und ist nur das — eine Vorbelegung.
- **Fassade ist ein eigener Haken** und ab hier eine eigene Preiswelt, nie aus
  Innen abgeleitet.

### DC-108 — der Satz unter „Tapezieren", und warum der Schalter dort anders heißt

Unter „Tapezieren" liegen zwei Welten. **Malerware** (Raufaser, Malervlies,
Glasfaser) kauft der Betrieb selbst, sie steckt im m²-Preis wie die Farbe.
**Kundentapete** (Foto, Muster, Textil) sucht der Kunde aus und kostet mal 12,
mal 90 € die Rolle — sie wird **immer** getrennt abgerechnet.

Manfred will dafür ausdrücklich **keinen zweiten Haken**: *„Der Unterschied
liegt nicht in dem, was ich anbiete, sondern in der Tapete selbst — und die
steht ja in der Position drin."* Ein Betrieb kann daran nichts einstellen,
also soll er auch nichts einstellen müssen. Das ist richtig, und es ist
dieselbe Regel wie beim Zubehör: **Ein Schalter, der nichts bewegt, ist eine
Einladung zum Missverständnis.**

Umgesetzt sind daher zwei Dinge, beide im Prototyp
(`docs/dc-102-preise-prototyp.html`):

1. **Ein Hinweissatz, kein Bedienelement.** Wortlaut:
   > **Kundentapeten** (Muster, Foto, Textil) rechnet die App immer getrennt ab.

   Das ist Manfreds Satz mit einer Änderung: Er sagt *„rechnen wir immer
   getrennt ab"*. Der Satz steht aber auf einem Bildschirm, der den Chef
   fragt, was **er** macht — und der ganze Punkt ist, dass er hier nichts tut.
   Deshalb sagt der Satz, was die **App** tut, nicht was er tun soll. Er
   erscheint **nur bei gesetztem Haken** und **über** der Materialzeile: Er ist
   der Grund, warum die darunter „Malerware" heißt.
2. **Der Schalter heißt nach dem, wofür er wirklich gilt** — `Malerware inkl.`
   / `Malerware extra` statt `Tapete inkl.` / `Tapete extra`. Manfreds Wort,
   und es trennt die beiden Welten schon in der Beschriftung.

**Trägt der Satz an dieser Stelle, oder kippt er den Bildschirm?** Er trägt —
mit einer gemessenen Einschränkung, die eine Änderung nötig gemacht hat. Im
Prototyp bei 390 px Breite gerendert:

- Der Satz ist **zweizeilig (48 px)**. Die Tapezieren-Karte wird dadurch knapp
  doppelt so hoch wie die anderen vier. Das ist vertretbar, **weil der Haken
  nicht vorgesetzt ist**: Wer nicht tapeziert, sieht eine gewöhnliche
  Checkbox-Zeile und nie diesen Satz. Der Bildschirm startet unverändert als
  fünf saubere Haken.
- **„Malerware" ist zu lang für die alte Materialzeile.** Mit dem festen
  62-px-Label daneben bleiben je Knopf 107 px — „Malerware inkl." brach dort
  auf **zwei Zeilen Knopftext** um (56 px statt 41 px). Zwei Zeilen Text auf
  einem Knopf sehen aus wie zwei Knöpfe. Regel jetzt: **Materialwörter über
  sechs Zeichen bekommen die volle Breite** — Beschriftung auf eigener Zeile,
  darunter die beiden Knöpfe nebeneinander (je 133 px, einzeilig). Kurze
  Wörter („Farbe", „Belag", „Lack") stehen unverändert einzeilig neben der
  Beschriftung.
- **Ein längerer Satz trägt nicht.** Meine erste Fassung erklärte zusätzlich,
  was Malerware ist („Raufaser, Vlies, Glasfaser") — 85 px, dreizeilig, und
  die Karte kippte optisch in Richtung Textblock. Das Wort erklärt sich für
  einen Maler selbst; es ist seine eigene Vokabel. Die Erklärung ist
  gestrichen.

**Für Engineering, wenn der Bildschirm gebaut wird:** Das Materialwort auf
**Haken-Ebene** ist eine Anzeigeentscheidung und gehört zur Tätigkeit
(`tapezieren` → „Malerware"), nicht zu `MATERIAL_WORTE` in
`materialanteil.ts`. Auf **Positions-Ebene** bleibt alles, wie es ist:
`halbsatz()` liefert weiter `inkl. Tapete` an der Katalogzeile, und
`kundensatz()` weiter *„Die Tapete wird vom Kunden gestellt."* — auf dem
Kundenpapier ist „Malerware" das falsche Wort, dort geht es um genau die
Tapete, die in der Position steht. Zwei Ebenen, zwei Wörter, und das ist kein
Widerspruch, sondern der Inhalt von DC-108.

---

## Bildschirm 2 — Die Zahlen

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
- **Der Halbsatz nennt auch das Material**, passend zu Bildschirm 1. Wer dort
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

## Bildschirm 3 — Die Nick-Seite

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

1. **Bildschirm 2 wirkt wie eine Prüfung.** Fünf leere Zahlenfelder direkt
   hintereinander sind der Moment, in dem jemand „überspringen" sucht. Gegenmittel
   im Entwurf: „Grob reicht", leere Felder erlaubt, Halbsätze, die die Frage
   beantworten statt sie zu stellen. Das ist der Bildschirm, den ein Prototyp
   als erstes belegen muss.
2. **Die Nick-Seite wird weggeklickt.** 40 Zeilen und ein großer grüner Knopf
   heißen „hier muss ich nichts tun". Deshalb steht „Passt alles" **neben**
   „Später" und nicht darüber, und deshalb heißt die Überschrift, was sie
   heißt.
3. **Material wird zweimal gefragt.** Wenn die Materialzeilen auf Bildschirm 1
   und die Halbsätze auf Bildschirm 2 nicht exakt dieselben Worte benutzen, entsteht der Eindruck,
   es seien zwei verschiedene Fragen. Beide ziehen deshalb aus `halbsatz()`,
   keine handgeschriebene zweite Fassung.

---

## Was als Nächstes kommt — und was nicht

**Nicht:** einbauen. Der Chief of Staff hat zwei Abhängigkeiten benannt, die
davor sitzen (Vokabular-Angleich, CoS-E-052), und Sandys Go zum Entwurf steht
noch aus.

**Als Nächstes von mir, sobald der Entwurf abgenickt ist:** ein Prototyp der
**Nick-Seite**. Nur dieser eine Bildschirm — die anderen beiden sind Formulare,
die sich aus Text beurteilen lassen. Die Nick-Seite nicht: Ob 40 Zeilen mit
Herkunftsangabe überfliegbar sind oder erschlagen, ob das Antippen sich
richtig anfühlt, und ob „Passt alles" nach Zustimmung oder nach Wegklicken
aussieht, entscheidet sich am Daumen, nicht am Absatz. Dieselbe Lehre wie bei
DC-038 (Freihand-Zeichnen): Interaktionen, die man noch nie gesehen hat,
lassen sich nicht aus Text beurteilen.
