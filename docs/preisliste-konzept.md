# Preisliste — wie der Handwerker da entspannt durchkommt

**Fassung 2 · 11.09.2026** — überarbeitet nach Manfreds Rückmeldung.
Die erste Fassung ist damit erledigt und ersetzt, nicht danebengelegt.

**Anlass:** Sandy, 11.09.2026 — *„es sind nun mal super viele positionen, wie
kann man das so entspannt wie möglich für den nutzer machen, dass er da nicht
beim onboarding oder später 300 preise einpflegen muss"*
**Status:** ❌ Vorschlag, noch nichts gebaut.

**Manfreds Urteil zur ersten Fassung:** *„Das ist die richtige Richtung, und
der eine Satz, der alles trägt, steht drin — ‚nicht kleiner eingegeben,
sondern kleiner gezeigt'."* Er hat zwei Lücken gefunden, die ich schlicht
übersehen hatte (Material, Fassade), und vier Stellen benannt, an denen der
Vorschlag Schaden anrichten würde. Alle sind unten eingearbeitet und als
solche gekennzeichnet.

---

## 1. Die Zahl, um die es geht

Die echte Kette durchgerechnet — Aufnahme → Mengen-Engine →
Vollständigkeitsprüfung → Preis-Zuordnung — über 23 typische Aufträge aus
Maler und Bodenleger.

| | |
|---|---|
| Standardkatalog insgesamt | **2.379 Einträge** |
| davon Rubriken „Maler …" | 220 |
| davon Rubriken „Boden …" | 189 |
| **Katalogeinträge, die dabei wirklich gebraucht wurden** | **48** |
| Positionen, die keinen Preis fanden | 0 |

Aus der echten Datenbank: Manfreds Testkonto hat **416 Preise**, in 15
Angeboten wurden **22** je getroffen. Er selbst in TN-095: *„222 Positionen,
davon gefühlt ein Drittel Varianten. Ich brauch 40."*

**Drei unabhängige Wege, dieselbe Größenordnung: 40 bis 50.**

*Ehrlich dazu:* Die 48 stammen aus 23 Szenarien; ein breiterer Korpus findet
mehr, aber keine 400 mehr. Die Engine hat ein endliches Vokabular — was sie
nie ausspricht, kann nie einen Preis brauchen.

---

## 2. Was das Problem wirklich ist

Manfred pflegt keine 300 Preise ein. Er **bekommt** 416 und soll ihnen
trauen. Die Last ist nicht Tipparbeit, sondern Misstrauen: Er kann nicht
sehen, welche Einträge je benutzt werden, und bei „Fassade streichen 2x"
**und** „Fassadenfläche streichen 2x" weiß er nicht, welcher zieht. Also
liest er im Zweifel jede Zeile nach — und da ist der Zeitgewinn weg (TN-067).

**Die Liste muss nicht kleiner eingegeben, sondern kleiner gezeigt werden.**

---

## 3. Voraussetzung — erst das, dann alles andere

> **Manfreds Punkt 1, und er hat recht:** *„Dann muss die Preisliste exakt
> das Vokabular der Engine benutzen, Wort für Wort. Sonst fragt sie mich nach
> ‚Sperranstrich', ich tipp 9 € ein, und jetzt hab ich ‚Nikotinsperre 9 €'
> UND ‚Sperranstrich 9 €' unter ‚Deine Preise'. Ihr baut die Doppelten, die
> ihr gerade wegräumt, im Alltag wieder auf."*

Das ist der Punkt, der alles andere trägt, und er geht **vor** die Rückfrage
im Angebot. Sonst richtet die Rückfrage Schaden an.

**Zwei Teile:**

**a) Der Standardkatalog spricht die Sprache der Engine.**
Alle Positionstitel, die die Engine erzeugen kann, gegen den Katalog
simulieren — dieselbe Methode wie beim Audit im August. Wo die Engine ein
Wort benutzt, das im Katalog anders heißt, wird eines von beidem angeglichen.
CoS-E-037 („Sperranstrich" ↔ „Nikotinsperre") ist der erste bekannte Fall;
**welches Wort das richtige ist, entscheidet der Prüfmeister, nicht ich.**

**b) Die Rückfrage legt nicht blind neu an.**
Wenn ein Preis fehlt, bietet sie zuerst an, die Position einem **vorhandenen**
Eintrag zuzuordnen:

> **Sperranstrich – Decke**
> Diesen Preis hast du noch nicht.
> → **Heißt das bei dir anders?** [Suche in deiner Liste]
>   *Nikotinsperre auftragen — 9,00 €/m²*  ← antippen
> → **Oder neu anlegen:** [ ____ € ]

Tippt er den vorhandenen Eintrag an, entsteht **kein neuer Preis, sondern
eine Verknüpfung**: Die App lernt, dass „Sperranstrich" bei ihm
„Nikotinsperre" heißt, und fragt nie wieder. Seine Liste wächst um null
Zeilen.

---

## 4. Onboarding — Schritt für Schritt

### Schritt 0 — Die Frage, die ich vergessen hatte: **mit oder ohne Material?**

> **Manfred:** *„Meine 11,50 für Wand 2x sind inklusive Farbe. Beim Kollegen
> sind's 8 plus Material extra. Wenn die App das nicht einmal fragt, rechnet
> sie bei jedem zweiten Betrieb falsch — bei mir kommt Material doppelt rein,
> beim Kollegen fehlt's. Das ist eine einzige Frage, ein Schalter, und sie
> ist wichtiger als Zahl vier bis sechs."*

Er hat recht, und das war eine echte Lücke. Ein Schalter, ganz vorn:

> **Sind in deinen Preisen die Materialkosten drin?**
> ( ) Ja, meine Preise sind inklusive Material
> ( ) Nein, Material rechne ich getrennt ab

Die Antwort steuert zweierlei: welche Vorschlagswerte gezeigt werden, und ob
die App überhaupt Materialpositionen erzeugt. **Ohne diese Frage rechnet das
Produkt bei etwa der Hälfte der Betriebe falsch** — und zwar unsichtbar.

### Schritt 1 — Was machst du hauptsächlich?

> **Manfred:** *„Was fehlt, ist die Fassade. Ich mach Fassaden, das ist bei
> mir ein Drittel vom Umsatz, und das ist eine andere Preiswelt — Gerüst,
> Material, Wetter. Wenn die App mir Fassade aus der Wand-Innen-Zahl
> ableitet, ist das falsch, egal wie klug der Faktor ist."*

Auch das war eine Lücke: Sechs feste Zahlen unterstellen, dass alle Maler
dasselbe machen. Stattdessen erst die Frage, dann die Felder:

> **Was machst du am meisten?** (Mehrfachauswahl)
> ☑ Innen streichen  ☑ Fassade  ☐ Tapezieren  ☐ Lackieren  ☐ Boden

Jeder Haken bringt ein bis zwei Felder mit. Wer nur Innen macht, bekommt
vier Felder; wer Fassade dazunimmt, bekommt seine eigene Fassaden-Zahl statt
einer abgeleiteten.

### Schritt 2 — Die Zahlen, die er im Kopf hat

Manfred hat bestätigt, welche das sind — *„die sag ich dir am Telefon, ohne
aufzustehen"*:

| Feld | Einheit | kommt bei | Anmerkung |
|---|---|---|---|
| Wand streichen, 2 Anstriche | €/m² | Innen | |
| Decke streichen, 2 Anstriche | €/m² | Innen | |
| Tapete ablösen | €/m² | Innen / Tapezieren | |
| Vliestapete neu | €/m² | Tapezieren | |
| **Fassade streichen, 2 Anstriche** | €/m² | Fassade | **eigene Zahl, nie abgeleitet** |
| Tür lackieren | €/Stück | Lackieren | **muss dabeistehen, was gemeint ist** |
| Dein Stundensatz | €/Std | immer | |

> **Manfred zur Tür:** *„Tür lackieren auch, wobei das bei mir ‚pro Tür mit
> Zarge, beidseitig' ist — da muss klar sein, was die Zahl meint."*

Gilt für jedes Feld: Unter der Beschriftung steht in einem Halbsatz, was
eingeschlossen ist. Eine Zahl ohne Bezugsgröße ist keine Zahl.

### Schritt 3 — Der Rest wird abgeleitet

Aus den Ankern skaliert die App die übrigen gebrauchten Preise. Die
*Verhältnisse* im Standardkatalog sind Handwerkswissen, das *Niveau* kommt
aus seinen Zahlen. **Fassade wird nie aus Innen abgeleitet** (siehe oben).

### Schritt 4 — Die Nick-Seite. **Das ist der Kern, nicht die Kür.**

> **Manfred:** *„Wand 2x = 11 € → 1x = 6,90 €. Das ist bei mir falsch. Der
> erste Anstrich hat die ganze Arbeit drin — Kanten, Ecken, Grundieren mit —,
> der zweite läuft. 1x ist bei mir eher 75 % von 2x, nicht 63. Damit will ich
> nicht sagen, euer Faktor ist falsch, sondern: Jeder Meister hat seine
> eigenen Verhältnisse, und die App weiß meine nicht."*

Das ist das stärkste Argument im ganzen Feedback. Deshalb ist Schritt 4 keine
Bestätigungsseite zum Wegklicken, sondern der Moment, in dem die Liste den
Besitzer wechselt:

- Rund 40 Zeilen, jede mit dem Hinweis **„abgeleitet aus: Wand 2x"**
- Ein Knopf **„Passt alles"**
- Was nicht passt, tippt er an und ändert es

*„Zwei Minuten, dann ist es meine Liste, nicht eure."*

### Zur Frage „Überspringen"

> **Manfred:** *„Der Knopf wird gedrückt, das kenn ich von mir selbst. Dann
> hat der Betrieb 40 Durchschnittspreise und glaubt, es sind seine."*

Wenn der Knopf bleibt, dann mit Folge: **Jedes Angebot bekommt oben einen
Balken „Preise sind Durchschnittswerte, nicht deine"**, bis er die Nick-Seite
einmal durchgegangen ist. Sonst passiert genau das, was wir mit CoS-E-004
gerade verhindert haben — ein Angebot geht mit fremden Zahlen raus.

### Wo der regionale Preisfaktor hingehört
**Nur hier:** Er justiert die *Vorschlagswerte* in Schritt 2 vor. Sobald
eigene Zahlen drinstehen, ist er erledigt. Manfreds *„Wenn ich meine
Preisliste pflege, warum noch ein Faktor drauf?"* ist damit beantwortet:
**gar nicht mehr.** *(Er wird aktuell ohnehin nirgends gelesen.)*

---

## 5. Im Alltag

**Der Normalfall ändert sich nicht.** Er spricht, bekommt sein Angebot, die
Preise kommen aus seiner Liste.

**Wenn ein Preis fehlt** — der Dialog aus Abschnitt 3b, also erst „heißt das
bei dir anders?", dann erst neu anlegen.

**Und der Durchschnittswert wird nicht mehr vorbelegt zum Wegtippen:**

> **Manfred:** *„Freitag 18 Uhr, ‚9,00 € — Übernehmen', ich tipp drauf, weil
> ich weiter will. Jetzt steht ein Preis in meiner Liste, den ich nie
> entschieden hab, und beim nächsten Angebot kommt er ohne Rückfrage."*

Sein Vorschlag, übernommen: „Übernehmen" bleibt, aber der Preis wird in der
Liste als **„Durchschnitt, noch nicht bestätigt"** geführt, und beim zweiten
Mal fragt die App kurz nach: *„9 € wie beim letzten Mal?"* **Dann** ist er
seiner.

**Die Preislisten-Seite, dreigeteilt:**

1. **Deine Preise** — bei Manfred 22 Zeilen. Die, die er aufmacht.
2. **Vorschläge** — abgeleitet oder Durchschnitt, noch nicht bestätigt.
3. **Selten gebraucht** — eingeklappt, über Suche erreichbar.

> **Manfreds Bedingung dazu:** *„Abgeleitete Preise, die ich nicht bestätigt
> hab, dürfen nicht unter ‚Deine Preise' stehen. Die stehen unter
> ‚Vorschläge', bis sie einmal im Angebot waren und ich das Angebot
> rausgeschickt hab."*

Übernommen. Die Grenze ist **der Versand**, nicht das Erzeugen.

---

## 6. Reihenfolge

Manfred hat die Reihenfolge bestätigt und eine Verschiebung verlangt — das
Vokabular **vor** die Rückfrage, *„sonst macht die Rückfrage Schaden"*:

1. **Vokabular dicht machen** (Abschnitt 3). Katalog und Engine sprechen
   dasselbe Wort. Ohne das baut alles Weitere neue Doppelte.
2. **Doppelte weg** (CoS-E-039 / TN-095). Reine Katalogpflege.
3. **Preisliste dreigeteilt anzeigen.** Kleiner Eingriff, nimmt sofort Druck.
4. **Rückfrage im Angebot** statt „Preis fehlt" — mit Zuordnung zu
   vorhandenen Einträgen.
5. **Onboarding** mit Material-Schalter, Gewerke-Auswahl und Nick-Seite.

---

## 7. Vorgemerkt, nicht jetzt

> **Manfred:** *„Bei mir hat die Fischer GmbH andere Preise als Frau Krüger —
> Stammkunde, Mengen, netto. Muss nicht ins Onboarding, aber irgendwann
> brauch ich ‚Preis für Gewerbe' als zweite Spalte, sonst pfleg ich doch
> wieder zwei Listen."*

Zweite Preisspalte für Gewerbekunden. Nicht jetzt, aber es sollte beim Bauen
der Liste mitgedacht werden, damit es später kein Umbau wird.

---

## 8. Was ich aus diesem Feedback mitnehme

Zwei der vier wichtigsten Punkte — Material und Fassade — waren **Lücken in
meinem Vorschlag, nicht Verfeinerungen.** Beide hätten dazu geführt, dass das
Produkt bei einem großen Teil der Betriebe still falsch rechnet. Beide fand
jemand in zehn Minuten, der den Beruf macht.

Für die nächsten Konzepte in diesem Bereich: **erst fragen, was der Preis
überhaupt einschließt, dann über Zahlen reden.** Material, Bezugsgröße
(„pro Tür mit Zarge"), und ob eine Arbeit überhaupt zur selben Preiswelt
gehört, kommen vor jeder Ableitung.

*Head of Product Engineering · 2026-09-11*

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
