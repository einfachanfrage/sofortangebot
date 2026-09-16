# Einsprech-Liste

**18 Aufnahmen. Bei jeder steht, was rauskommen muss — Position für Position,
mit Menge, Einheitspreis und Summe.** Du vergleichst Zeile für Zeile und hakst ab.

Schätz einen halben Tag, mit Pausen.

---

## Warum nur 18

Die 139 aus der ersten Liste waren automatische Tests, keine Einsprech-Aufgaben.
Die haben der Reihe nach ich und die stündlichen Läufe über die letzten Wochen
geschrieben — als Absicherung gegen Rechenfehler, die beim Ändern von Code
zurückkommen. Die laufen von selbst und brauchen dich nicht.

Was dich braucht, ist der Schritt davor: **versteht die App, was du sagst.** Das
kann kein automatischer Test prüfen. Die 18 hier decken jede Mechanik ab, die
dabei schiefgehen kann — Übermessung, Anstrichzahl, Ausschluss, Verschnitt,
Qualitätsstufe, Stückzahlen, mehrere Räume, mehrere Beläge. Geht eine davon
kaputt, fällt es hier auf.

---

## So gehst du vor

1. Diktat vorlesen, Angebot ansehen.
2. Die Tabelle daneben halten. **Jede Zeile muss da sein, mit genau der Menge
   und genau dem Preis.**
3. Stimmt alles → Haken bei `stimmt`.
4. Weicht was ab → Nummer notieren und in einem Halbsatz, was stattdessen
   dastand. Mehr nicht.

**Zwei Dinge zählen nicht als Abweichung:**

- Eine Zeile **Kleinmaterial und Verbrauchsmaterial** (25,00 €, beim Boden
  35,00 €). Die legt die App zusätzlich dazu — die Summe ist dann entsprechend
  höher. Ist bekannt.
- Die **Reihenfolge** der Positionen. Die stimmt heute nicht mit dem
  Arbeitsablauf überein, steht auf meiner Liste.

**Steht ⚠️ bei einem Fall**, kenne ich den Fehler schon — er steht auf meiner
Liste und wird gebaut. Bei diesen Fällen zeigt die Tabelle deshalb, was **heute**
rauskommt, Fehler inklusive. Deine Aufgabe dort: kommt genau das raus? Wenn ja,
Haken. Kommt etwas **anderes**, ist das neu und ich will es wissen.

**Zahlen sprichst du, wie du redest.** „vier mal fünf" und „4 mal 5" landen beide
als 4 × 5.

---

## Die Reihenfolge

Fall 01 bis 10 sind Maler, 11 bis 15 Boden, 16 bis 18 Sonderfälle.
**Fang bei 01 an** — wenn der schon nicht stimmt, brauchst du die anderen 17
heute nicht mehr, dann reden wir vorher.

---

## 01 · Wände und Decke, ein Raum

Der Klassiker. Wenn der nicht stimmt, stimmt gar nichts.

**Das sprichst du ein:**

> „Wohnzimmer, vier mal fünf, Höhe zwo fünfzig. Wände und Decke zweimal weiß. Ein Fenster, eine Tür."

**Das muss rauskommen:**

| Position | Menge | € / Einheit | Betrag |
|---|---|---|---|
| Wand streichen 2x — Wohnzimmer | 45 m² | 9,50 € | 427,50 € |
| Decke streichen 2x — Wohnzimmer | 20 m² | 11,00 € | 220,00 € |
| Boden schützen — Wohnzimmer | 20 m² | 1,20 € | 24,00 € |
| Sockelleisten abkleben — Wohnzimmer | 18 lfm | 0,80 € | 14,40 € |
| **Summe netto** | | | **685,90 €** |

- Fenster und Tür werden **nicht** abgezogen — 45,00 m² ist richtig, weniger wäre falsch.

**`[x] stimmt`**  ·  *eingesprochen 16.09.*

---

## 02 · Nur die Decke

Prüft, ob die App das Wort „nur" versteht.

**Das sprichst du ein:**

> „Schlafzimmer, vier mal drei fünfzig, Höhe zwo fünfzig. Nur die Decke streichen, zweimal. Wände bleiben wie sie sind."

**Das muss rauskommen:**

| Position | Menge | € / Einheit | Betrag |
|---|---|---|---|
| Decke streichen 2x — Schlafzimmer | 14 m² | 11,00 € | 154,00 € |
| Boden schützen — Schlafzimmer | 14 m² | 1,20 € | 16,80 € |
| **Summe netto** | | | **170,80 €** |

**Darf nicht drinstehen:**

- **Keine Wandposition.** Keine Sockelleisten — es wird ja nichts an der Wand gemacht.

`[ ] stimmt`  ·  `[ ] weicht ab:` _______________________________

---

## 03 · Wand zweimal, Decke einmal

Zwei verschiedene Anstrichzahlen im selben Raum.

**Das sprichst du ein:**

> „Küche, vier Meter zwanzig mal drei Meter sechzig, Höhe zwo fünfzig. Wände zweimal streichen, Decke reicht einmal. Zwei Fenster, eine Tür."

**Das muss rauskommen:**

| Position | Menge | € / Einheit | Betrag |
|---|---|---|---|
| Wand streichen 2x — Küche | 39 m² | 9,50 € | 370,50 € |
| Decke streichen 1x — Küche | 15,12 m² | 7,00 € | 105,84 € |
| Boden schützen — Küche | 15,12 m² | 1,20 € | 18,14 € |
| Sockelleisten abkleben — Küche | 15,6 lfm | 0,80 € | 12,48 € |
| **Summe netto** | | | **506,96 €** |

- Wand steht auf **2x** zu 9,50 €, Decke auf **1x** zu 7,00 €.

**Darf nicht drinstehen:**

- Decke 2x — dann hat die App „reicht einmal" überhört.

`[ ] stimmt`  ·  `[ ] weicht ab:` _______________________________

---

## 04 · Hohe Decke — Zuschlag

Raumhöhe über 3 m. Sockelleisten 15,00 lfdm = voller Umfang, Tür nicht abgezogen.

**Das sprichst du ein:**

> „Flur, sechs mal eins fünfzig, Deckenhöhe drei Meter zwanzig. Kein Fenster, eine Tür. Wände und Decke zweimal streichen."

**Das muss rauskommen:**

| Position | Menge | € / Einheit | Betrag |
|---|---|---|---|
| Wand streichen 2x — Flur | 48 m² | 9,50 € | 456,00 € |
| Decke streichen 2x — Flur | 9 m² | 11,00 € | 99,00 € |
| Boden schützen — Flur | 9 m² | 1,20 € | 10,80 € |
| Sockelleisten abkleben — Flur | 15 lfm | 0,80 € | 12,00 € |
| Erschwerniszuschlag Raumhöhe > 3m — Flur | 1 % | 15,00 € | 15,00 € |
| **Summe netto** | | | **592,80 €** |

- Der Erschwerniszuschlag steht als Prozentsatz. **Prüf, ob im Angebot ein Betrag steht oder 0,00 €** — bei 0,00 € notieren.

`[ ] stimmt`  ·  `[ ] weicht ab:` _______________________________

---

## 05 · Tapete runter, dann streichen

Tapete runter. Fläche gleich der Wandfläche.

**Das sprichst du ein:**

> „Wohnzimmer, vier mal fünf, Höhe zwo sechzig. Alte Tapete muss runter. Danach Wände und Decke zweimal weiß. Ein Fenster, eine Tür."

**Das kommt heute raus** — steht genau das da, ist alles wie erwartet:

| Position | Menge | € / Einheit | Betrag |
|---|---|---|---|
| Wand streichen 2x — Wohnzimmer | 46,8 m² | 9,50 € | 444,60 € |
| Decke streichen 2x — Wohnzimmer | 20 m² | 11,00 € | 220,00 € |
| Boden schützen — Wohnzimmer | 20 m² | 1,20 € | 24,00 € |
| Sockelleisten abkleben — Wohnzimmer | 18 lfm | 0,80 € | 14,40 € |
| Tapete entfernen | 46,8 m² | 4,00 € | 187,20 € |
| **Summe netto** | | | **890,20 €** |

**⚠️ Das weiß ich schon — nicht wundern, nicht notieren:**

- Nach dem Tapetenabriss fehlt der **Tiefengrund** (46,80 m² × 4,50 € = 210,60 €). Steht auf der Liste, ist entschieden, aber noch nicht gebaut.

`[ ] stimmt`  ·  `[ ] weicht ab:` _______________________________

---

## 06 · Q3 wegen Streiflicht

„Streiflicht" muss Q3 auslösen, nicht Q2.

**Das sprichst du ein:**

> „Büro, fünf mal vier, Höhe zwo sechzig. Die Wände vollflächig spachteln, Qualitätsstufe Q3, da kommt Streiflicht drauf. Danach zweimal streichen."

**Das muss rauskommen:**

| Position | Menge | € / Einheit | Betrag |
|---|---|---|---|
| Voranstrich / Grundierung — Büro | 46,8 m² | 4,50 € | 210,60 € |
| Wand streichen 2x — Büro | 46,8 m² | 9,50 € | 444,60 € |
| Boden schützen — Büro | 20 m² | 1,20 € | 24,00 € |
| Sockelleisten abkleben — Büro | 18 lfm | 0,80 € | 14,40 € |
| Spachtelarbeiten Q3 — Büro | 46,8 m² | 14,00 € | 655,20 € |
| **Summe netto** | | | **1.348,80 €** |

- Die Grundierung kommt von allein — das ist richtig so, auf frisch gespachtelte Fläche wird nicht direkt gestrichen.

**Darf nicht drinstehen:**

- **Spachtelarbeiten Q2.** Das wäre die falsche, billigere Zeile: 9,00 € statt 14,00 €, also 234,00 € zu wenig.

`[ ] stimmt`  ·  `[ ] weicht ab:` _______________________________

---

## 07 · Drei Dübellöcher

Kleinreparatur. Die Menge 3 muss aus dem Satz kommen.

**Das sprichst du ein:**

> „Küche, vier mal drei, Höhe zwo fünfzig. Wände zweimal streichen. Drei Dübellöcher müssen noch gespachtelt werden, sonst nix Großes."

**Das kommt heute raus** — steht genau das da, ist alles wie erwartet:

| Position | Menge | € / Einheit | Betrag |
|---|---|---|---|
| Wand streichen 2x — Küche | 35 m² | 9,50 € | 332,50 € |
| Boden schützen — Küche | 12 m² | 1,20 € | 14,40 € |
| Sockelleisten abkleben — Küche | 14 lfm | 0,80 € | 11,20 € |
| Dübellöcher spachteln | 3 Stück | 3,00 € | 9,00 € |
| **Summe netto** | | | **367,10 €** |

**Darf nicht drinstehen:**

- **Vollflächenspachtelung, Q2 oder Q3.** Das ist der teure Verwechsler.

**⚠️ Das weiß ich schon — nicht wundern, nicht notieren:**

- 3,00 € je Loch = 9,00 € gesamt ist zu billig. Wird auf eine Pauschale von 20,00 € umgestellt.

`[ ] stimmt`  ·  `[ ] weicht ab:` _______________________________

---

## 08 · Heizkörper lackieren

Drei Arbeitsgänge, drei Zeilen, je Menge 2.

**Das sprichst du ein:**

> „Wohnzimmer, fünf mal vier, Höhe zwo fünfzig. Wände zweimal streichen. Die zwei Heizkörper bitte mit lackieren."

**Das muss rauskommen:**

| Position | Menge | € / Einheit | Betrag |
|---|---|---|---|
| Wand streichen 2x — Wohnzimmer | 45 m² | 9,50 € | 427,50 € |
| Boden schützen — Wohnzimmer | 20 m² | 1,20 € | 24,00 € |
| Sockelleisten abkleben — Wohnzimmer | 18 lfm | 0,80 € | 14,40 € |
| Heizkörper abschleifen | 2 Stück | 20,00 € | 40,00 € |
| Heizkörper grundieren | 2 Stück | 25,00 € | 50,00 € |
| Heizkörper lackieren (2× Anstrich) | 2 Stück | 40,00 € | 80,00 € |
| **Summe netto** | | | **635,90 €** |

**Darf nicht drinstehen:**

- **Heizkörper abkleben** — wer lackiert, klebt nicht ab.
- **Türen oder Fenster lackieren** — die hat keiner bestellt.

`[ ] stimmt`  ·  `[ ] weicht ab:` _______________________________

---

## 09 · Verraucht — Sperrgrund

Verraucht heißt Sperrgrund.

**Das sprichst du ein:**

> „Wohnzimmer, vier mal fünf, Höhe zwo fünfzig. Wände und Decke streichen, alles verraucht, da muss Sperrgrund drauf."

**Das kommt heute raus** — steht genau das da, ist alles wie erwartet:

| Position | Menge | € / Einheit | Betrag |
|---|---|---|---|
| Wand streichen 2x — Wohnzimmer | 45 m² | 9,50 € | 427,50 € |
| Boden schützen — Wohnzimmer | 20 m² | 1,20 € | 24,00 € |
| Sockelleisten abkleben — Wohnzimmer | 18 lfm | 0,80 € | 14,40 € |
| Isoliergrund gegen Nikotin / Ruß / Wasserflecken | 20 m² | 9,00 € | 180,00 € |
| Grundieren (Tiefengrund) | 20 m² | 4,50 € | 90,00 € |
| Decke streichen 2x | 20 m² | 11,00 € | 220,00 € |
| **Summe netto** | | | **955,90 €** |

**⚠️ Das weiß ich schon — nicht wundern, nicht notieren:**

- Der Sperrgrund liegt nur auf **20,00 m²** — das ist die Deckenfläche. Verraucht sind aber auch die Wände: richtig wären 65,00 m². Bekannter Fund (PM-079-A).

`[ ] stimmt`  ·  `[ ] weicht ab:` _______________________________

---

## 10 · Drei Räume auf einmal

Drei Räume aus einem Satz, jeder für sich gerechnet.

**Das sprichst du ein:**

> „Wohnung komplett streichen. Wohnzimmer vier mal fünf, Schlafzimmer drei fünfzig mal vier, Flur eins zwanzig mal sechs. Überall zwo fünfzig hoch. Wände und Decken zweimal weiß. Im Flur gehen drei Türen ab."

**Das muss rauskommen:**

| Position | Menge | € / Einheit | Betrag |
|---|---|---|---|
| Wand streichen 2x — Wohnzimmer | 45 m² | 9,50 € | 427,50 € |
| Decke streichen 2x — Wohnzimmer | 20 m² | 11,00 € | 220,00 € |
| Boden schützen — Wohnzimmer | 20 m² | 1,20 € | 24,00 € |
| Sockelleisten abkleben — Wohnzimmer | 18 lfm | 0,80 € | 14,40 € |
| Wand streichen 2x — Schlafzimmer | 37,5 m² | 9,50 € | 356,25 € |
| Decke streichen 2x — Schlafzimmer | 14 m² | 11,00 € | 154,00 € |
| Boden schützen — Schlafzimmer | 14 m² | 1,20 € | 16,80 € |
| Sockelleisten abkleben — Schlafzimmer | 15 lfm | 0,80 € | 12,00 € |
| Wand streichen 2x — Flur | 36 m² | 9,50 € | 342,00 € |
| Decke streichen 2x — Flur | 7,2 m² | 11,00 € | 79,20 € |
| Boden schützen — Flur | 7,2 m² | 1,20 € | 8,64 € |
| Sockelleisten abkleben — Flur | 14,4 lfm | 0,80 € | 11,52 € |
| **Summe netto** | | | **1.666,31 €** |

- Flur: Wand 36,00 m² bei 14,40 m Umfang — die drei Türen kürzen den Umfang **nicht**.

`[ ] stimmt`  ·  `[ ] weicht ab:` _______________________________

---

## 11 · Laminat komplett

Der Standard-Bodenfall.

**Das sprichst du ein:**

> „Kinderzimmer, vier mal drei fünfzig. Laminat, gerade verlegt, Trittschalldämmung drunter. Sockelleisten neu, weiße MDF. An der Tür eine Übergangsschiene."

**Das muss rauskommen:**

| Position | Menge | € / Einheit | Betrag |
|---|---|---|---|
| Laminat verlegen schwimmend inkl. 5% Verschnitt — Kinderzimmer | 14,7 m² | 14,00 € | 205,80 € |
| Sockelleisten montieren — Kinderzimmer | 15 lfm | 5,50 € | 82,50 € |
| Übergangsschiene | 1 Stück | 15,00 € | 15,00 € |
| Trittschalldämmung — Kinderzimmer | 14 m² | 4,50 € | 63,00 € |
| **Summe netto** | | | **366,30 €** |

- Verschnitt **nur** auf den Belag (14,70), **nicht** auf die Dämmung (14,00). Das ist der Punkt.

`[ ] stimmt`  ·  `[ ] weicht ab:` _______________________________

---

## 12 · Parkett Fischgrät

Fischgrät: 15 % Verschnitt statt 5 %, plus Aufpreiszeile.

**Das sprichst du ein:**

> „Wohnzimmer, acht mal viereinhalb. Eichenparkett, Fischgrät verlegt. Boden nur, an den Wänden machen wir nichts."

**Das muss rauskommen:**

| Position | Menge | € / Einheit | Betrag |
|---|---|---|---|
| Fertigparkett verlegen inkl. 15% Verschnitt — Wohnzimmer | 41,4 m² | 22,00 € | 910,80 € |
| Aufpreis Fischgrät-Verlegemuster — Wohnzimmer | 41,4 m² | 14,00 € | 579,60 € |
| **Summe netto** | | | **1.490,40 €** |

- 36,00 m² + 15 % = 41,40 m². Der Aufpreis läuft über dieselbe Menge.

**Darf nicht drinstehen:**

- **Wandpositionen.** „An den Wänden machen wir nichts."

`[ ] stimmt`  ·  `[ ] weicht ab:` _______________________________

---

## 13 · Kork vollflächig verklebt

Die Verlegeart muss im Titel stehen und den teureren Preis treffen.

**Das sprichst du ein:**

> „Arbeitszimmer, vier mal drei. Korkboden, vollflächig verklebt."

**Das kommt heute raus** — steht genau das da, ist alles wie erwartet:

| Position | Menge | € / Einheit | Betrag |
|---|---|---|---|
| Kork verlegen vollflächig verklebt — Arbeitszimmer | 12 m² | 24,00 € | 288,00 € |
| **Summe netto** | | | **288,00 €** |

**Darf nicht drinstehen:**

- Ein billigerer Korkpreis — dann wurde „vollflächig verklebt" überlesen.

**⚠️ Das weiß ich schon — nicht wundern, nicht notieren:**

- 12,00 m² ohne Verschnitt. Richtig wären **12,60 m²** — Verschnitt gilt ab der Umstellung für jeden Belag, nicht nur für schwimmenden.

`[ ] stimmt`  ·  `[ ] weicht ab:` _______________________________

---

## 14 · Teppich raus, Laminat rein

Altbelag raus und neu rein.

**Das sprichst du ein:**

> „Schlafzimmer, vier mal drei fünfzig. Der alte Teppichboden ist vollflächig verklebt und muss raus und entsorgt werden. Danach Laminat, gerade verlegt."

**Das kommt heute raus** — steht genau das da, ist alles wie erwartet:

| Position | Menge | € / Einheit | Betrag |
|---|---|---|---|
| Laminat verlegen schwimmend inkl. 5% Verschnitt — Schlafzimmer | 14,7 m² | 14,00 € | 205,80 € |
| Laminat demontieren und entsorgen — Schlafzimmer | 14 m² | 5,00 € | 70,00 € |
| Altbelag entfernen — Schlafzimmer | 14 m² | 7,00 € | 98,00 € |
| **Summe netto** | | | **373,80 €** |

**⚠️ Das weiß ich schon — nicht wundern, nicht notieren:**

- **Zwei Entfernen-Zeilen statt einer.** 70,00 € + 98,00 € = 168,00 € für eine Arbeit. Richtig wäre eine Zeile: Teppichboden verklebt entfernen, 14,00 m² × 9,00 € = 126,00 €.
- Die **Entsorgungsfahrt** fehlt ganz (Kleinfuhre bis 1 m³, 110,00 €).
- Keine der beiden Zeilen nennt Teppich oder verklebt.

`[ ] stimmt`  ·  `[ ] weicht ab:` _______________________________

---

## 15 · Drei Räume, verschiedene Beläge

Drei Räume, drei verschiedene Beläge, Trittschall nur an einer Stelle.

**Das sprichst du ein:**

> „Wohnzimmer, sechs mal vier fünfzig, da kommt Eichenparkett rein, Fischgrät verlegt. Schlafzimmer, vier mal drei sechzig, da wollen die Teppich, Bahnenware. Flur, fünf mal eins fünfzig, da kommt Laminat, ganz normal gerade. Trittschall nur unterm Laminat im Flur. Sockelleisten bleiben überall wie sie sind."

**Das muss rauskommen:**

| Position | Menge | € / Einheit | Betrag |
|---|---|---|---|
| Fertigparkett verlegen inkl. 15% Verschnitt — Wohnzimmer | 31,05 m² | 22,00 € | 683,10 € |
| Aufpreis Fischgrät-Verlegemuster — Wohnzimmer | 31,05 m² | 14,00 € | 434,70 € |
| Teppichboden verlegen — Schlafzimmer | 14,4 m² | 14,00 € | 201,60 € |
| Laminat verlegen schwimmend inkl. 5% Verschnitt — Flur | 7,88 m² | 14,00 € | 110,32 € |
| Trittschalldämmung — Flur | 7,5 m² | 4,50 € | 33,75 € |
| **Summe netto** | | | **1.463,47 €** |

- Fischgrät-Aufpreis **nur** im Wohnzimmer.
- Trittschall **nur** im Flur.

**Darf nicht drinstehen:**

- **Sockelleisten** in irgendeinem Raum — „bleiben überall wie sie sind."

`[ ] stimmt`  ·  `[ ] weicht ab:` _______________________________

---

## 16 · Fassade mit Gerüst

Fassade, Gerüst stellen wir selbst.

**Das sprichst du ein:**

> „Fassade Nordseite, zwölf Meter lang, Wandhöhe sechs Meter. Zwei Fenster, jeweils eins zwanzig mal eins vierzig. Fassade zweimal streichen, vorher grundieren. Wir stellen das Gerüst."

**Das kommt heute raus** — steht genau das da, ist alles wie erwartet:

| Position | Menge | € / Einheit | Betrag |
|---|---|---|---|
| Fassadenfläche streichen 2x — Fassade | 72 m² | 14,00 € | 1.008,00 € |
| Erschwerniszuschlag Raumhöhe > 3m — Fassade | 1 % | 15,00 € | 15,00 € |
| Gerüst stellen und abbauen | 1 Pauschale | 450,00 € | 450,00 € |
| Fassadengrundierung auftragen | 72 m² | 6,00 € | 432,00 € |
| **Summe netto** | | | **1.905,00 €** |

- Die Grundierung muss den **Fassadenpreis** 6,00 € haben, nicht den Innenpreis 4,50 €.

**⚠️ Das weiß ich schon — nicht wundern, nicht notieren:**

- Der **Erschwerniszuschlag Raumhöhe** gehört bei einer Fassade mit Gerüst nicht ins Angebot — das Gerüst ist die Erschwernis. Live steht er mit 0,00 € drin und hängt an einem leeren Zweitraum, nach dem die App zusätzlich Maße fragt.

`[ ] stimmt`  ·  `[ ] weicht ab:` _______________________________

---

## 17 · Türen und Zargen lackieren

Vier Türen mit Zargen, drei Arbeitsgänge.

**Das sprichst du ein:**

> „Flur, vier mal eins fünfzig, Höhe zwo fünfzig. Die vier Innentüren mit Zargen abschleifen, grundieren und weiß lackieren. An den Wänden machen wir nichts."

**Das kommt heute raus** — steht genau das da, ist alles wie erwartet:

| Position | Menge | € / Einheit | Betrag |
|---|---|---|---|
| Türen abschleifen | 4 Stück | 20,00 € | 80,00 € |
| Türen grundieren | 4 Stück | 25,00 € | 100,00 € |
| Türen lackieren (2× Anstrich) | 4 Stück | 90,00 € | 360,00 € |
| Türzarge lackieren | 4 Stück | 45,00 € | 180,00 € |
| Türrahmen abkleben | 4 Stück | 8,00 € | 32,00 € |
| **Summe netto** | | | **752,00 €** |

- Je Tür eine Zarge — überall Menge 4.

**Darf nicht drinstehen:**

- **Wandpositionen.** „An den Wänden machen wir nichts."

**⚠️ Das weiß ich schon — nicht wundern, nicht notieren:**

- **Türrahmen abkleben** 4 × 8,00 € = 32,00 €: wer die Zarge lackiert, klebt den Rahmen nicht ab. Prüfen und notieren, wenn es dasteht.

`[ ] stimmt`  ·  `[ ] weicht ab:` _______________________________

---

## 18 · Ausschluss — Decke NICHT

Ausschluss mitten im Satz. Der härteste Fall der Liste.

**Das sprichst du ein:**

> „Wohnzimmer, fünf Meter zwanzig mal vier Meter zehn, Deckenhöhe zwo fünfzig. Wände komplett streichen, zweimal drüber. Zwei Fenster, eine Tür. Die Decke lassen wir, ist erst letztes Jahr gemacht worden, die bitte NICHT mitrechnen."

**Das muss rauskommen:**

| Position | Menge | € / Einheit | Betrag |
|---|---|---|---|
| Wand streichen 2x — Wohnzimmer | 46,5 m² | 9,50 € | 441,75 € |
| Boden schützen — Wohnzimmer | 21,32 m² | 1,20 € | 25,58 € |
| Sockelleisten abkleben — Wohnzimmer | 18,6 lfm | 0,80 € | 14,88 € |
| **Summe netto** | | | **482,21 €** |

**Darf nicht drinstehen:**

- **Decke streichen**, in keiner Form. Das ist der ganze Zweck dieses Falls.

`[ ] stimmt`  ·  `[ ] weicht ab:` _______________________________


---

## Zwei Sachen ohne Diktat

Die gehen nur mit Klicken, nicht mit Sprechen. Wenn du Luft hast.

### 19 · Zweimal auf „Angebot erstellen"

Eine Aufnahme machen, dann **zweimal schnell hintereinander** auf „Angebot
erstellen" klicken.

**Muss stimmen:** es entsteht **ein** Angebot, nicht zwei.

`[ ] stimmt`  ·  `[ ] weicht ab:` _______________________________

### 20 · Raummaß nachträglich ändern

Ein fertiges Angebot öffnen, in die Bearbeiten-Ansicht, **ein Raummaß ändern**
(z. B. Länge von 4 auf 5 m).

**Muss stimmen:** Wandfläche, Deckenfläche, Sockelleisten und Summe rechnen sich
alle neu. Bleibt eine Zahl stehen, ist das der Fund.

`[ ] stimmt`  ·  `[ ] weicht ab:` _______________________________

---

## Wenn du durch bist

Schick mir die Nummern, bei denen was abwich, mit einem Halbsatz dazu. Fertig.

---

*Prüfmeister · 2026-09-16 · Jede Zahl in dieser Datei ist durch die Rechenkette
gelaufen, keine ist geschätzt.*

<!-- ENDE DER DATEI — 18 Aufnahmen plus 2 Klick-Prüfungen. -->
