# Preisliste — wie der Handwerker da entspannt durchkommt

**Fassung 3 · 14.09.2026** — überarbeitet nach Manfreds Antwort zu CoS-E-054
und der Gegenprobe des Prüfmeisters. **Fassung 2 ist damit erledigt und
ersetzt, nicht danebengelegt.**

**Anlass:** Sandy, 11.09.2026 — *„es sind nun mal super viele positionen, wie
kann man das so entspannt wie möglich für den nutzer machen, dass er da nicht
beim onboarding oder später 300 preise einpflegen muss"*

**Status:** Abschnitt 3 und die Rechenseite von Abschnitt 4 sind gebaut
(14.09.). Was noch fehlt, ist überwiegend Oberfläche und hängt an DC-102.
Bauauftrag: CoS-E-053, Fortschritt in `chief-of-staff-engineering-todos.md`.

---

## 0. Was sich gegenüber Fassung 2 geändert hat

Eine Sache, und sie ist strukturell: **Der globale Material-Schalter aus
Schritt 0 ist weg.**

Fassung 2 fragte einmal beim Onboarding *„Sind in deinen Preisen die
Materialkosten drin?"* und leitete daraus alles ab. Manfred hat diese Frage
angestoßen — und seine eigene Antwort darauf zeigt, warum ein einzelner
Schalter sie nicht beantworten kann:

| Tätigkeit | Material bei ihm | seine Begründung |
|---|---|---|
| **Innen** (Wand, Decke, Lack, Vlies) | **drin** | *„Farbe ist bei mir Standardqualität, das kalkulier ich in den Quadratmeter, seit dreißig Jahren."* |
| **Fassade** | **getrennt** | *„Silikat oder Silikonharz ist ein Unterschied von 40 % beim Eimer, und beim Altbau kommt oft Grundierung und Armierung dazu, die ich vorher nicht seh."* |
| **Boden** | **getrennt** | *„Der Kunde sucht sich sein Laminat im Baumarkt aus, das ist einfach so."* |

**Ein Betrieb, drei Antworten.** Ein Schalter steht für zwei Drittel seiner
Arbeit falsch, egal wie er steht. Dasselbe Argument, mit dem der Chief of
Staff den globalen Schalter verworfen hat — nur eine Ebene tiefer.

Drei weitere Änderungen fallen daraus ab, alle in Abschnitt 4:
der **Materialanteil je Katalogzeile** (ohne den ist das Umschalten nicht
baubar), **Zubehör ist kein Material**, und **der Halbsatz benennt das
Material beim Namen**.

---

## 1. Die Zahl, um die es geht

Die echte Kette durchgerechnet — Aufnahme → Mengen-Engine →
Vollständigkeitsprüfung → Preis-Zuordnung — über 23 typische Aufträge aus
Maler und Bodenleger.

| | |
|---|---|
| Standardkatalog insgesamt | **2.379 Einträge** |
| **Katalogeinträge, die dabei wirklich gebraucht wurden** | **48** |
| Positionen, die keinen Preis fanden | 0 |

Manfreds Testkonto hat **416 Preise**, in 15 Angeboten wurden **22** je
getroffen. Er selbst in TN-095: *„222 Positionen, davon gefühlt ein Drittel
Varianten. Ich brauch 40."*

**Drei unabhängige Wege, dieselbe Größenordnung: 40 bis 50.**

---

## 2. Was das Problem wirklich ist

Manfred pflegt keine 300 Preise ein. Er **bekommt** 416 und soll ihnen
trauen. Die Last ist nicht Tipparbeit, sondern Misstrauen: Er kann nicht
sehen, welche Einträge je benutzt werden, und bei „Fassade streichen 2x"
**und** „Fassadenfläche streichen 2x" weiß er nicht, welcher zieht. Also
liest er im Zweifel jede Zeile nach — und da ist der Zeitgewinn weg (TN-067).

**Die Liste muss nicht kleiner eingegeben, sondern kleiner gezeigt werden.**

---

## 3. Voraussetzung: dieselbe Sprache — **erledigt**

> **Manfreds Punkt, und er hatte recht:** *„Dann muss die Preisliste exakt das
> Vokabular der Engine benutzen, Wort für Wort. Sonst fragt sie mich nach
> ‚Sperranstrich', ich tipp 9 € ein, und jetzt hab ich ‚Nikotinsperre 9 €'
> UND ‚Sperranstrich 9 €' unter ‚Deine Preise'. Ihr baut die Doppelten, die
> ihr gerade wegräumt, im Alltag wieder auf."*

**a) Der Standardkatalog spricht die Sprache der Engine — ✅ steht.**
CoS-E-037 ist entschieden (11.09.), gebaut (12.09.) und nachgemessen
(13.09.): Die Engine sagt `Isoliergrund gegen Nikotin / Ruß / Wasserflecken`
und trifft die Katalogzeile mit 9,00 €/m². Die Katalog-Dopplungen sind von
64 auf 0 unerreichbare Zeilen gefallen (CoS-E-039), die Alltagsbegriffe ohne
Preis von 6 auf 1.

**b) Die Rückfrage legt nicht blind neu an — ❌ noch zu bauen.**
Wenn ein Preis fehlt, bietet sie zuerst an, die Position einem **vorhandenen**
Eintrag zuzuordnen:

> **Sperranstrich – Decke**
> Diesen Preis hast du noch nicht.
> → **Heißt das bei dir anders?** [Suche in deiner Liste]
>   *Isoliergrund gegen Nikotin / Ruß / Wasserflecken — 9,00 €/m²*  ← antippen
> → **Oder neu anlegen:** [ ____ € ]

Tippt er den vorhandenen Eintrag an, entsteht **kein neuer Preis, sondern
eine Verknüpfung**. Seine Liste wächst um null Zeilen.

---

## 4. Material — zwei Ebenen, eine Zahl, ein Halbsatz

Das ist der Kern der Fassung 3. Manfreds Antwort in einem Satz: **zwei Ebenen
bauen, die dritte entsteht von selbst.**

### 4.1 Ebene 1: die Tätigkeit belegt vor

Nicht ein Schalter für den Betrieb, sondern ein Standard je Tätigkeit:

| Tätigkeit | Material-Standard |
|---|---|
| Innen streichen | **drin** |
| Tapezieren | **drin** |
| Lackieren | **drin** |
| Fassade | **getrennt** |
| Boden | **getrennt** |

> **Korrektur an mir selbst, 14.09. beim Bauen:** Hier stand zuerst
> „Tapezieren · **ohne Tapete**". Das widerspricht Manfreds Tabelle in
> derselben Antwort — er zählt *„Innen (Wand, Decke, **Lack, Vlies**)"*
> zusammen auf, mit Material **drin**. Vlies ist Vliestapete. Ich hatte aus
> seinem Beispiel in 4.6 (*„Vlies tapezieren immer ohne Tapete, weil der
> Kunde die aussucht"*) einen Standard gemacht — dabei war es sein Beispiel
> für den **seltenen** Fall, für den er ausdrücklich keine eigene Ebene
> wollte. Tapezieren und Lackieren erben jetzt den Standard von Innen; wer es
> anders hält, stellt es an der Zeile um.

> *„Die Vorbelegung je Tätigkeit trifft bei mir in neun von zehn Fällen. […]
> Ehrlich gesagt könntet ihr die Haken gleich mit Standard setzen, denn jeder
> Maler in Deutschland, den ich kenne, macht's genauso."*

Der Betrieb kann jeden Standard antippen und umstellen. **Aber er muss
nicht** — das ist der Punkt. Die neun von zehn sind vorbelegt.

### 4.2 Ebene 2: umgestellt wird an der ZEILE, nicht am Angebot

Manfred sagt *„das ist exakt die Umstellung pro Angebot"* — der Prüfmeister
hat nachgerechnet, warum das trotzdem eine Stufe zu grob ist:

> Manfred denkt beim Sagen an den Yilmaz-Fall, und der ist ein **reines
> Bodenangebot**. Da fallen Angebot und Position zusammen. Das Normalangebot
> fällt nicht zusammen: *„Wände streichen, und im Flur kommt Laminat rein"*
> ist ein Angebot mit zwei Materiallogiken — Farbe drin, Laminat vom Kunden.
> Ein Schalter auf Angebotsebene steht für die Hälfte davon falsch.

Und der Knopf, den Manfred in **TN-122** selbst gelobt hat, saß an der
Position, nicht am Angebot: *„Im Angebot stand unter jeder Position ein Knopf
‚+ Wandfarbe' oder ‚+ Laminat (Material)'. Wenn ich den drücke, ist Material
eine eigene Zeile. Wenn nicht, ist es drin."*

**Also: Vorbelegung von der Tätigkeit, Umschaltung an der Zeile.**

### 4.3 🔴 Die dritte ZAHL — ohne sie ist der Knopf nicht baubar

Der teuerste Satz der ganzen Antwort:

> *„Wenn ich Material rausziehe, sind es nicht mehr 11,50 für Wand 2x,
> sondern 8,50 plus Farbe. Das muss die App wissen, sonst hab ich Material
> doppelt."*

Die App kennt heute **eine** Zahl: 11,50. **Woher kommen die 8,50?** Aus
nichts. Ohne einen hinterlegten Materialanteil je Position erzeugt der Knopf
genau den Doppelfehler, vor dem Manfred warnt — und zwar in die Richtung, die
der Kunde merkt, nicht der Betrieb.

Das ist **keine dritte Ebene** — es ist keine zusätzliche Frage an den
Nutzer, sondern ein Feld je Katalogzeile, vorbelegt und änderbar wie der
Preis selbst. Startwerte vom Prüfmeister, Innenbereich Standardqualität:

| Position | Preis | davon Material | Arbeit |
|---|---|---|---|
| Wand streichen 2x | 11,50 € | **3,00 €** | 8,50 € *(Manfreds eigene Zahl)* |
| Wand streichen 1x | 6,00–9,50 € | **1,50 €** | Rest |
| Decke streichen 2x | 11,00 € | **2,50 €** | 8,50 € |
| Raufaser tapezieren ohne Anstrich | 10,00 € | **2,50 €** (Tapete + Kleister) | 7,50 € |
| Fassade Silikat 2x | 20,00 € | **6,50 €** | 13,50 € |

**Faustregel für alles Übrige:** bei zwei Anstrichen liegt der Materialanteil
innen bei rund einem Viertel des Quadratmeterpreises, nie über einem Drittel.
Beim Lack höher. Bei reiner Vorbereitung — schleifen, spachteln, abkleben —
praktisch null; **dort gehört gar kein Schalter hin.**

Das erklärt nebenbei, warum Fassade und Boden getrennt laufen: Dort ist der
Anteil nicht ein Viertel, sondern ein Drittel bis die Hälfte, und er schwankt
mit der Auswahl des Kunden. Genau da wird ein eingerechneter Materialanteil
zum Risiko für den Betrieb.

**Die Probe, die vor dem Knopf geschrieben wird** (Prüfmeister): Material
herausziehen und nachrechnen, ob die Summe um **genau den Materialanteil**
fällt — nicht um null und nicht um den ganzen Preis.

### 4.4 Zubehör ist kein Material

> *„Kleinmaterial — Trittschall, Kleber, Übergangsprofil — ist bei mir drin,
> das ist kein Material, das ist Zubehör."*

Zubehör folgt dem Material-Schalter **nicht**. Wer das zusammenwirft, zieht
dem Bodenleger den Trittschall aus der Arbeitszeile.

Die Trennlinie, die dabei trägt: **Material ist, was der Kunde aussuchen
kann.** Tapete, Farbe, Belag, Fliese. Kleister, Trittschall, Kleber und
Profil sucht niemand aus — die gehören zum Handwerk und bleiben drin.

### 4.5 Der Halbsatz benennt das Material

> **Manfred:** *„Der Halbsatz ist wichtiger als der Schalter."*

Der Prüfmeister eine Stufe schärfer: **„ohne Material" ist selbst schon
falsch.** Bei „Vliestapete tapezieren ohne Material" bleibt der Kleister drin
— steht „ohne Material" auf dem Angebot, streitet man später über zwanzig
Euro Kleister und das Verhältnis.

Also **„ohne Tapete", „ohne Farbe", „ohne Belag"** — das Material beim Namen.

**Am Feld** steht dann: *„Wand streichen 2x — 11,50 €/m² inkl. Farbe"* bzw.
*„… 8,50 €/m², ohne Farbe"*.

**Auf dem Kundenangebot in Kundensprache**, und das ist ein eigener Fund für
die Kundenpapier-Familie (TN-009/013/016):

> *„Ich schreib ‚Material bauseits' — das versteht mein Bauleiter, Frau
> Krüger nicht. Für Privatkunden muss da stehen ‚Material wird vom Kunden
> gestellt' oder ‚Material wird nach Auswahl gesondert angeboten'."*

Nicht interne Sprache, aber **Fachsprache** auf dem Papier eines
Privatkunden. Head of Legal bewertet den Wortlaut (Spur 5 Nr. 2, § 5a UWG).

### 4.6 Ebene 3 wird nicht gebaut, sie entsteht

> *„Eine Einstellung je Position dauerhaft — das wär die Tapete: ‚Vlies
> tapezieren immer ohne Tapete, weil der Kunde die aussucht'. Ja, das gibt's,
> aber es sind zwei, drei Positionen pro Betrieb. Dafür würd ich keine eigene
> Ebene bauen. Wenn ich's dreimal im Angebot umgestellt hab, kann die App
> fragen."*

Also eine **Lernfrage nach dem dritten Mal**, dasselbe Muster wie „9 € wie
beim letzten Mal?" aus Abschnitt 6.

**Einschränkung des Prüfmeisters, übernommen:** Die Frage darf erst kommen,
wenn er **dieselbe Position** dreimal umgestellt hat, nicht dreimal
irgendeine. Sonst fragt die App nach dem dritten Angebot pauschal „immer ohne
Material?" — und das ist wieder der globale Schalter, nur später und mit mehr
Anlauf.

### 4.7 Ein Material in zwei Zeilen

Wandfarbe steckt in „Wand streichen" *und* „Decke streichen". Stellt er eine
um, muss die andere mit. Das ist eine **Rückfrage** („auch bei der Decke?"),
keine Ebene.

---

## 5. Verschnitt folgt dem Zahler

Sandy hat die vier Verschnitt-Punkte (VOB-001/002/014, Fliesen-Verschnitt,
Kork/Teppich 0 %) ausdrücklich in diese Mechanik hineingelegt, statt sie
einzeln zu beantworten. Sie fallen damit so:

| Lage | Verschnitt gehört |
|---|---|
| Material **getrennt** | in die **Materialzeile** |
| Material **drin** | in den **Materialanteil** der Arbeitszeile |

> **TN-128:** *„Verschnitt ist Material. Wenn der Kunde das Laminat kauft, ist
> sein Verschnitt sein Problem, nicht mein Lohn. 21 m² verlegen auf 17 m²
> Boden — ich verleg 17."*
>
> **14.09.:** *„Wenn Material getrennt ist, gehört der Verschnitt in die
> Materialzeile, nicht in die Arbeitszeile. Das war der Yilmaz-Fehler."*

Damit ist **Kork und Teppich 0 %** keine Ausnahme mehr, sondern das Ergebnis
von „Material vom Kunden", und der Fliesen-Verschnitt keine Konstante im Code
mehr. Und die Normfrage löst sich mit: „Verschnitt" kommt in DIN 18365 nicht
vor, bei Bodenbelägen zählt nur die belegte Fläche — der heutige
Prozentaufschlag auf die **Menge** hatte keine Normgrundlage und widersprach
der PDF-Zeile „nach VOB berechnet" (VOB-007). Die Zahler-Regel löst beides
auf einmal.

**Keine Normfrage. Eine Zahlerfrage.**

---

## 6. Onboarding — Tätigkeiten statt Gewerke

### Schritt 1 — Was machst du?

> *„Der Schritt ‚Was machst du?' fragt heute nur Maler oder Boden. Innen und
> Fassade sind kein Haken. […] Ein Bildschirm, vier Haken, jeder mit dem
> Material-Standard dran, den man antippen kann. **Das sind keine
> zusätzlichen Fragen, das ist dieselbe Frage mit mehr Antworten.**"*

> **Was machst du?**
> ☑ Innen streichen · *Material drin* ⇄
> ☐ Tapezieren · *Material drin* ⇄
> ☐ Lackieren · *Material drin* ⇄
> ☑ Fassade · *Material getrennt* ⇄
> ☑ Boden · *Material getrennt* ⇄

Ein Bildschirm, ein Haken pro Tätigkeit, der Material-Standard als antippbarer
Halbsatz daneben. Das ist zugleich die Antwort auf Manfreds Fassaden-Lücke:
Fassade ist ab hier eine eigene Preiswelt und wird **nie** aus Innen
abgeleitet.

**Wie das mit CoS-E-052 zusammengeht** — der Punkt, den der Chief of Staff
zurecht gekoppelt sehen wollte: Die Zuordnungstabelle
`GEWERK_VORLAGEN` ist **keine verlorene Arbeit**. Sie bildet ab, *was der
Nutzer gewählt hat* → *welche Vorlagenschlüssel gelten*, und genau diese
Zwischenschicht macht den Tätigkeiten-Umbau billig. Der Umbau ändert nur die
linke Seite. Ausführlich in CoS-E-052.

Bemerkenswert dabei: `maler_fassade` existiert in den Vorlagen **bereits als
eigener Schlüssel mit 41 Einträgen**. Die Vorlagen kennen die
Tätigkeitsebene schon, nur die Oberfläche nicht. Heute bekommt deshalb ein
reiner Innen-Maler 41 Fassadenzeilen, die er nie braucht — der Umbau nimmt
sie ihm ab.

### Schritt 2 — Die Zahlen, die er im Kopf hat

*„Die sag ich dir am Telefon, ohne aufzustehen"*:

| Feld | Einheit | kommt bei |
|---|---|---|
| Wand streichen, 2 Anstriche | €/m² | Innen |
| Decke streichen, 2 Anstriche | €/m² | Innen |
| Tapete ablösen | €/m² | Innen / Tapezieren |
| Vliestapete neu | €/m² | Tapezieren |
| **Fassade streichen, 2 Anstriche** | €/m² | Fassade — **eigene Zahl, nie abgeleitet** |
| Tür lackieren | €/Stück | Lackieren |
| Dein Stundensatz | €/Std | immer |

> **Manfred zur Tür:** *„Tür lackieren auch, wobei das bei mir ‚pro Tür mit
> Zarge, beidseitig' ist — da muss klar sein, was die Zahl meint."*

Gilt für jedes Feld: Unter der Beschriftung steht in einem Halbsatz, was
eingeschlossen ist — **einschließlich, ob Material drin ist.** Eine Zahl ohne
Bezugsgröße ist keine Zahl.

### Schritt 3 — Der Rest wird abgeleitet

Aus den Ankern skaliert die App die übrigen gebrauchten Preise. Die
*Verhältnisse* im Standardkatalog sind Handwerkswissen, das *Niveau* kommt
aus seinen Zahlen. Der Materialanteil skaliert mit.

### Schritt 4 — Die Nick-Seite. **Das ist der Kern, nicht die Kür.**

> *„Wand 2x = 11 € → 1x = 6,90 €. Das ist bei mir falsch. Der erste Anstrich
> hat die ganze Arbeit drin — Kanten, Ecken, Grundieren mit —, der zweite
> läuft. 1x ist bei mir eher 75 % von 2x, nicht 63. Damit will ich nicht
> sagen, euer Faktor ist falsch, sondern: Jeder Meister hat seine eigenen
> Verhältnisse, und die App weiß meine nicht."*

Deshalb ist Schritt 4 keine Bestätigungsseite zum Wegklicken, sondern der
Moment, in dem die Liste den Besitzer wechselt:

- Rund 40 Zeilen, jede mit dem Hinweis **„abgeleitet aus: Wand 2x"**
- Ein Knopf **„Passt alles"**
- Was nicht passt, tippt er an und ändert es

*„Zwei Minuten, dann ist es meine Liste, nicht eure."*

### Zur Frage „Überspringen"

> *„Der Knopf wird gedrückt, das kenn ich von mir selbst. Dann hat der Betrieb
> 40 Durchschnittspreise und glaubt, es sind seine."*

Wenn der Knopf bleibt, dann mit Folge: **Jedes Angebot bekommt oben einen
Balken „Preise sind Durchschnittswerte, nicht deine"**, bis er die Nick-Seite
einmal durchgegangen ist.

### Wo der regionale Preisfaktor hingehört

**Nur hier:** Er justiert die *Vorschlagswerte* in Schritt 2 vor. Sobald
eigene Zahlen drinstehen, ist er erledigt. Manfreds *„Wenn ich meine
Preisliste pflege, warum noch ein Faktor drauf?"* ist damit beantwortet:
**gar nicht mehr.** *(Offen als CoS-E-043, wartet auf Sandy.)*

---

## 7. Im Alltag

**Der Normalfall ändert sich nicht.** Er spricht, bekommt sein Angebot, die
Preise kommen aus seiner Liste — mit dem Material so, wie die Tätigkeit es
vorbelegt.

**Wenn ein Preis fehlt** — der Dialog aus 3b: erst „heißt das bei dir
anders?", dann erst neu anlegen.

**Der Durchschnittswert wird nicht vorbelegt zum Wegtippen:**

> *„Freitag 18 Uhr, ‚9,00 € — Übernehmen', ich tipp drauf, weil ich weiter
> will. Jetzt steht ein Preis in meiner Liste, den ich nie entschieden hab,
> und beim nächsten Angebot kommt er ohne Rückfrage."*

„Übernehmen" bleibt, aber der Preis wird als **„Durchschnitt, noch nicht
bestätigt"** geführt, und beim zweiten Mal fragt die App: *„9 € wie beim
letzten Mal?"* **Dann** ist er seiner.

**Die Preislisten-Seite, dreigeteilt:**

1. **Deine Preise** — bei Manfred 22 Zeilen.
2. **Vorschläge** — abgeleitet oder Durchschnitt, noch nicht bestätigt.
3. **Selten gebraucht** — eingeklappt, über Suche erreichbar.

> *„Abgeleitete Preise, die ich nicht bestätigt hab, dürfen nicht unter ‚Deine
> Preise' stehen. Die stehen unter ‚Vorschläge', bis sie einmal im Angebot
> waren und ich das Angebot rausgeschickt hab."*

Die Grenze ist **der Versand**, nicht das Erzeugen.

---

## 8. Reihenfolge

1. ~~**Vokabular dicht machen**~~ — ✅ CoS-E-037 gebaut und nachgemessen.
2. ~~**Doppelte weg**~~ — ✅ CoS-E-039, 64 → 0 unerreichbare Zeilen.
3. ~~**Materialanteil je Katalogzeile.**~~ ✅ **14.09. gebaut** —
   `src/lib/materialanteil.ts`, Spalte `price_items.material_anteil`, Test
   aus 4.3 vorweg geschrieben. 140 Katalogzeilen bekommen einen Schalter.
4. ~~**Tätigkeiten statt Gewerke**~~ — ✅ **14.09. das Modell gebaut**
   (`src/lib/taetigkeiten.ts`, mit CoS-E-052). Der **Bildschirm** dazu ist
   DC-102 beim Product Designer und noch offen.
5. **Der Knopf an der Zeile** — „+ Farbe", „+ Belag" — samt Halbsatz und
   Kundenklartext. Die Rechenseite steht, die Oberfläche wartet auf DC-102.
6. **Preisliste dreigeteilt anzeigen.** Kleiner Eingriff, nimmt sofort Druck.
7. **Rückfrage im Angebot** statt „Preis fehlt" (3b).
8. **Onboarding** mit Tätigkeiten und Nick-Seite.
9. **Lernfrage nach dem dritten Mal** (4.6). Zuletzt, weil sie Nutzung braucht.

**Die Reihenfolge von 3 vor 5 ist nicht verhandelbar.** Der Knopf ohne die
Zahl ist doppelt berechnetes Material.

---

## 9. Vorgemerkt, nicht jetzt

> *„Bei mir hat die Fischer GmbH andere Preise als Frau Krüger — Stammkunde,
> Mengen, netto. Muss nicht ins Onboarding, aber irgendwann brauch ich ‚Preis
> für Gewerbe' als zweite Spalte, sonst pfleg ich doch wieder zwei Listen."*

Zweite Preisspalte für Gewerbekunden. Beim Bauen mitdenken, damit es später
kein Umbau wird. **Hinweis:** Zusammen mit dem Materialanteil hat eine
Katalogzeile dann drei Zahlen statt einer. Die Datenstruktur sollte das von
Anfang an tragen, statt zweimal erweitert zu werden.

---

## 10. Was ich aus diesen zwei Runden mitnehme

**Fassung 1 → 2:** Material und Fassade waren Lücken, keine Verfeinerungen.
Beide hätten dazu geführt, dass das Produkt still falsch rechnet. Beide fand
in zehn Minuten jemand, der den Beruf macht.

**Fassung 2 → 3:** Ich hatte Manfreds Lücke erkannt und **mit einem Schalter
beantwortet, den er selbst so nicht gemeint hat.** Seine drei Zeilen — Innen
drin, Fassade getrennt, Boden getrennt — standen in derselben Antwort, in der
ich den Schalter für richtig hielt. Die Tabelle widerlegte den Vorschlag, den
sie belegen sollte.

Und der Prüfmeister hat gefunden, was weder Manfred noch ich gesehen haben:
**dass die Zahl fehlt.** Manfred hat „8,50 plus Farbe" gesagt, ich habe es
notiert, und keiner von uns hat gefragt, woher die 8,50 kommen sollen.

Für die nächsten Konzepte: **Wenn jemand eine Lücke nennt, ist seine
Begründung wichtiger als seine Lösung** — und wenn in einer Antwort eine
Zahl auftaucht, die die App nicht hat, ist das der eigentliche Auftrag.

*Head of Product Engineering · 2026-09-14*

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
