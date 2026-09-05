# Einsprechliste — alle offenen Nachtests (Stand 2026-09-04)

**Das ist die eine Arbeitsdatei zum Einsprechen.** Hier stehen alle Fälle, die
nach den Fixes vom 03./04.09. neu eingesprochen werden müssen — jeweils das
Diktat im Wortlaut und darunter nur die Zahlen, auf die es diesmal ankommt.

**Wortlaut nicht ändern.** Ein Nachtest mit geänderter Formulierung ist keiner.
Die volle Soll-Lösung und die Historie jedes Falls stehen weiter in
`pruefmeister-testfaelle.md` — hier steht nur, was zum Einsprechen gebraucht
wird.

**Diese Datei ist ein Arbeitszettel, kein Protokoll.** Ergebnisse kommen wie
immer nach `pruefmeister-testfaelle.md`. Wenn alle Fälle durch sind, wird die
Datei gelöscht und bei Bedarf neu erzeugt — sie soll nicht neben dem
Testprotokoll herwachsen.

**Vor jedem Entwurf:** einmal auf die Aufnahme-Karte schauen. Stimmen dort die
Raummaße nicht, ist der Fehler in der Extraktion und nicht in der Rechnung —
das ist ein eigener Befund und der Entwurf danach nur noch Nebensache.

**Warum diese Liste so lang ist:** Nicht wegen des Umbaus, sondern wegen
VOB-012. Seit dem 04.09. werden Türbreiten nicht mehr von der
Sockelleistenlänge abgezogen — damit ist **jeder** Sollwert mit Sockelleisten
überholt, auch in Fällen, die seit Wochen grün waren.

---

**Neu ab 04.09.:** Bekannte Whisper-Hörfehler werden direkt nach der
Transkription geradegerückt (`src/lib/hoerfehler.ts`) — u. a. „Zockelleisten",
„Frischgrät", „Klickvenü", „Fertigpaket". Der **unveränderte** Whisper-Text
steht weiterhin in `entwurf_aufnahmen.transkript_original`; betroffene
Aufnahmen sind mit `hat_normalisierung = true` markiert. Wenn beim Einsprechen
ein Wort im Angebot auftaucht, das du nicht gesagt hast: bitte beide Spalten
nebeneinanderlegen, dann sieht man sofort, ob es Whisper oder wir waren.

## Stufe 1 — voll einsprechen, mehrere Fixes gleichzeitig

### PM-034 — Untergrund je Raum verschieden *(zuerst, hier hing der Blocker)*

> Küche, drei sechzig mal drei. Da liegen alte Fliesen, die müssen raus, und danach muss der Boden gespachtelt werden, Ausgleichsmasse, der ist ziemlich uneben. Dann Klick-Vinyl drauf, gerade verlegt. Esszimmer daneben, vier mal drei fünfzig, der Untergrund ist in Ordnung, da reicht Grundierung, dann dasselbe Vinyl. Im Flur machen wir nichts am Boden, der bleibt wie er ist. Sockelleisten in Küche und Esszimmer neu, je eine Tür.

- Kommst du mit dem **normalen Button** zum Entwurf, ohne den gelben Kasten?
- Küche **3,60 × 3,00**, Esszimmer **4,00 × 3,50** — keine 360er-Maße mehr
- Belag Küche **11,34 m²**, Esszimmer **14,70 m²**
- Altbelag + Ausgleichsmasse **nur Küche**, je 10,80 m²
- **Grundierung Esszimmer 14,00 m²** (fehlte komplett)
- **Keine** Wände-spachteln-Positionen mehr
- Sockelleisten **13,20 + 15,00 = 28,20 lfdm** ← *Rückfall vom 04.09., behoben. Zwei Wurzeln: Satz mit zwei Räumen, und Whisper schrieb „Zockelleisten" mit Z.*
- Taucht „Im Flur machen wir nichts" noch als Raum auf?
- Der Flur darf **keine** Sockelleisten bekommen

### PM-036 — Teilfläche nach Wasserschaden

> Wasserschaden. Im Wohnzimmer muss nur eine Ecke neu, ungefähr sechs Quadratmeter, der Rest vom Parkett bleibt liegen. Das Zimmer selbst ist fünf mal vier. Im Flur daneben, vier mal eins fünfzig, kommt der Boden komplett neu, gleiches Parkett. Im Flur muss der alte Belag raus, im Wohnzimmer nur die Ecke ausbauen. Sockelleisten im Flur neu, im Wohnzimmer bleiben sie.

- Wohnzimmer **6,30 m²**, nicht 21,00 — die 20 m² Raumfläche darf nirgends auftauchen
- Altbelag Wohnzimmer **6,00 m²**, nicht 20,00
- Flur **6,30 m²** — Karte und Entwurf müssen dieselbe Zahl zeigen (letztes Mal 6,3 vs. 6,0)
- Sockelleisten nur Flur, **11,00 lfdm** — im Wohnzimmer **keine** Position ← *Rückfall vom 04.09., behoben (gleiche Wurzel wie PM-034)*
- Altbelag Wohnzimmer muss **weiterhin da sein** (6,00 m²) — die Teilsatz-Trennung hätte ihn fast verloren

### PM-033 — drei Räume, drei Beläge

> Wohnzimmer, sechs mal vier fünfzig, da kommt Eichenparkett rein, Fischgrät verlegt. Schlafzimmer, vier mal drei sechzig, da wollen die Teppich, Bahnenware. Flur, fünf mal eins fünfzig, da kommt Laminat, ganz normal gerade. An den beiden Türen zum Wohnzimmer und zum Schlafzimmer jeweils eine Übergangsschiene, weil ja unterschiedliche Beläge. Trittschall nur unterm Laminat im Flur. Sockelleisten bleiben überall, wie sie sind.

- **Zwei** Übergangsschienen, nicht eine
- **Keine** Sockelleisten-Position, in keinem Raum
- Verschnitt weiter 31,05 / 14,40 / 7,88 m²
- Erwartet offen: Dämmung im Flur fehlt weiterhin (Kurzform „Trittschall")

### PM-035 — gemischte Maßangaben, L-Flur

> Wohnzimmer, fünf zwanzig mal vier zehn. Das Arbeitszimmer hat vierzehn Quadratmeter, die Maße hab ich nicht im Kopf. Der Flur ist L-förmig, einmal sechs Meter mal eins zwanzig und der kurze Schenkel zwo Meter mal eins zwanzig, drei Türen gehen da ab. Überall Landhausdiele, gerade verlegt. Trittschalldämmung überall drunter. Sockelleisten nur im Flur neu, in den Zimmern bleiben die alten.

- Trittschall in **allen drei** Räumen: 21,32 + 14,00 + 9,60 m²
- Sockelleisten **18,40 lfdm** (drei Türen, keine davon wird abgezogen)
- Erwartet offen: L-Form, der kurze Schenkel wird weiter fehlen — Kontrollprobe

### PM-032 — durchgehende Verlegung *(nur eine Zahl)*

> Erdgeschosswohnung. Flur, sechs mal eins zwanzig. Wohnzimmer, fünf mal vier. Küche, drei mal zwo achtzig. Überall dasselbe Klick-Vinyl, gerade verlegt, durchgehend ohne Schwellen — das läuft von der Küche durch den Flur ins Wohnzimmer. Trittschalldämmung drunter. Nur zum Bad hin kommt eine Übergangsschiene, im Bad selbst machen wir nichts. Sockelleisten überall neu, weiße MDF. Jeder Raum hat eine normale Tür.

- Sockelleisten **14,40 + 18,00 + 11,60 = 44,00 lfdm** (vorher 41,30)
- Rest war am 03.09. bestätigt: Dämmung 35,60 m², Belag 37,38 m², eine Schiene

---

## Stufe 2 — die vier zurückgezogenen Haken

### PM-002 — Akzentwand + Boden diagonal

> Schlafzimmer, vier mal dreieinhalb, Höhe zwo sechzig. Drei Wände weiß streichen, zweimal. Die Wand hinterm Bett kriegt Tapete, sozusagen Akzentwand, der Rest bleibt weiß. Ein Fenster, eine Tür, normal. Boden kriegt Klick-Vinyl, diagonal verlegt. Sockelleisten werden neu montiert, nicht gestrichen, nur montiert.

- Wandbrutto **39,00 m²** (keine Öffnungsabzüge), Akzentwand **9,10 m²** (kurze Seite), Restwände **29,90 m²**
- Decke 14,00 · Vinyl diagonal **16,10 m²** · Trittschall **14,00 m²**
- Sockelleisten montieren **15,00 lfdm**
- Kein „Sockelleisten streichen", kein „Boden schützen"

### PM-006 — kleines Fenster + Altbau

> Büro, Altbau, drei mal drei, Höhe zwo vierzig. Ein kleines Fenster, fünfzig mal sechzig, sonst nix Besonderes. Wände und Decke streichen, zweimal.

- Wandfläche **28,80 m²** (weder Fenster 0,30 noch Tür 1,89 abziehen)
- Decke 9,00 · Boden schützen 9,00
- Sockelleisten abkleben **12,00 lfdm**
- Erschwerniszuschlag Altbau **20 %** auf die Leistungen dieses Raums

### PM-010 — Sockelleisten-Doppelfalle

> Gästezimmer, drei fünfzig mal drei, Höhe zwo sechzig. Die alten Sockelleisten kommen raus, neue werden montiert, weiße MDF-Leisten. Die sollen dann auch noch gestrichen werden, passend zur Wand. Wände und Decke streichen, zweimal.

- Wandfläche **33,80 m²**, Decke 10,50, Boden schützen 10,50
- **Alle drei** Sockelleisten-Zeilen je **13,00 lfdm**: entfernen, montieren, streichen
- Kein „Sockelleisten abkleben", keine Bodenbelag-Position
- Achtung: „drei fünfzig" — kommt die Küche als 3,50 an oder wieder als 350?

### PM-018 — Q3 an Wand und Decke

> Arbeitszimmer, vier mal dreieinhalb, Höhe zwo sechzig. Wände UND Decke komplett spachteln, Qualitätsstufe Q3, weil später Streiflicht draufscheint. Danach beides einmal grundieren und zweimal streichen. Eine Tür, normal Maß, ein Fenster, normale Größe.

- Wand **39,00 m²** in vier Positionen: Spachtel Q3, Grundierung, Anstrich 2× — Decke jeweils 14,00
- Qualitätsstufe muss **Q3** heißen, nicht Q2
- Boden schützen 14,00 · Sockelleisten abkleben **15,00 lfdm**

---

## Stufe 3 — offene Fälle, die jetzt behoben sein müssten

### PM-023 — Trittschall-Flächenverwechslung

> Flur, sechs Meter mal eins Meter achtzig, eine Tür normal Maß. Laminat, ganz normal gerade verlegt, mit Trittschalldämmung drunter. Sockelleisten neu montieren rundrum.

- Trittschall **10,80 m²** = Fläche dieses Raums, nicht die eines anderen
- Laminat 10,80 × 1,05 = **11,34 m²**
- Sockelleisten **15,60 lfdm**
- Der Fund war situativ — wenn möglich zweimal hintereinander einsprechen

### PM-028 — Zuschlag zog den falschen Raum in die Bemessungsgrundlage

> Arbeitszimmer, vier Meter mal drei Meter fünfzig, Höhe zwo fünfzig, ist ein Altbau. Wände bitte grundieren und dann zweimal streichen. Ein Fenster, Standardmaß, eine Tür, normal.

- Wandfläche **37,50 m²** (Umfang 15,00 × 2,50, keine Öffnungsabzüge), Grundierung dieselbe Fläche
- Sockelleisten abkleben **15,00 lfdm**
- **Altbau-Zuschlag 20 % nur auf diesen Raum** — kein fremder Raum in der Grundlage
- Zweiter Punkt: Grundpreis Wandfläche, 9,50 € oder wieder 11,50 €?

### PM-030 — Dachgeschoss

> Dachzimmer, vier Meter fünfzig mal vier Meter. Kniestock ist eins Meter hoch. Die Dachschrägen zusammen ergeben achtzehn Quadratmeter. Ein Dachfenster drin, normale Größe. Wände, Schrägen und Kniestock alles zweimal streichen.

- Kniestock 17,00 lfm × 1,00 = **17,00 m²**, Dachschrägen **18,00 m²** (Dachfenster ≤ 2,5 m², kein Abzug)
- **Sockelleisten 17,00 lfdm ohne jeden Türabzug** — hier steckte der alte Fund „Abzug trotz Türen: 0"
- Zeigt „Raumhöhe" noch das rote „!"?

### PM-024 — Erschwerniszuschlag Höhe

> Büro, fünf Meter mal vier Meter, Höhe drei Meter zwanzig. Wände zweimal streichen. Zwei Fenster, Standardmaß, eine Tür, normal.

- Wandfläche **57,60 m²** (18,00 × 3,20, keine Abzüge), Sockelleisten abkleben **18,00 lfdm**
- Erschwerniszuschlag Raumhöhe **15 %**, Karte zeigt „Satz aus Preisliste", nicht „1 %"
- Fünfter Nachtest — danach ist der Fall zu

### PM-009 — Bodenleger-Komplettpaket

> Flur, vier mal eins achtzig. Alter Teppich muss komplett raus und entsorgt werden, Untergrund ist uneben, den gleich mit ausgleichen. Dann Vinylboden drauf, ganz normal gerade verlegt. Neue Sockelleisten drumrum. Am Übergang zum Wohnzimmer brauchen wir noch ne Übergangsschiene.

- Altbelag + Ausgleich je **7,20 m²**, Vinyl **7,56 m²**
- Sockelleisten **11,60 lfdm**
- **Übergangsschiene 1 Stück mit Preis** — der Standardpreis wurde nie live geprüft

---

## Stufe 4 — grün, nur die Sockelleistenzahl kippt

Am Stück einsprechen, jeweils nur auf die eine Zeile schauen. Alles andere war
bestätigt und darf sich nicht ändern.

| Fall | Diktat | neue Sockelleistenzahl |
|---|---|---|
| **PM-001** | „Also, äh, Wohnzimmer, fünf zwanzig mal vier zehn, Deckenhöhe zwo fünfzig. Wände komplett streichen, zweimal drüber. Ein Fenster — ne halt, zwei Fenster sind da drin, Standardgröße reicht. Eine Tür, normal Maß. Die Decke lassen wir, ist erst letztes Jahr gemacht worden, die bitte NICHT mitrechnen. Sockelleisten kleben wir noch ab, sind aus Holz, werden mitgestrichen." | **18,60 lfdm** |
| **PM-011** | „Ähm, Arbeitszimmer, vier mal drei zwanzig, Höhe zwo fünfzig. Ist n Altbau, die Wände sind ordentlich uneben — die müssen komplett gespachtelt werden, Qualitätsstufe Q2, nicht nur ne kleine Ausbesserung, wirklich die ganze Fläche. Danach zweimal streichen. Ein Fenster, Standardmaß, eine Tür, normal. Sockelleisten kleben wir ab, die bleiben wie sie sind." | **14,40 lfdm** · und weiterhin **kein** Zuschlag „schwieriger Untergrund" neben der Q2-Spachtelung |
| **PM-012** | „Esszimmer, viereinhalb mal drei, Höhe zwo fünfundfünfzig. Wände streichen, zweimal drüber, ganz normal. Die Sockelleisten bleiben genau wie sie sind, die werden NICHT neu gemacht, die NICHT demontiert — die sollen nur nochmal mitgestrichen werden, in der gleichen Farbe wie die Wand. Ein Fenster, Standardgröße, eine Tür, normal Maß." | **15,00 lfdm** (Position „Sockelleisten streichen") |
| **PM-013** | „Wohnzimmer, acht mal viereinhalb. Eichenparkett, Fischgrät verlegt, das braucht ja mehr Verschnitt. Ist schon ne große Fläche, da muss wahrscheinlich ne Dehnungsfuge rein, mach das bitte mit rein. Boden nur, an den Wänden machen wir nix. — Flur daneben, fünf mal eins achtzig, Höhe zwo sechzig. Kein Fenster da, aber eine Tür, normal Maß. Nur Wände und Decke streichen, zweimal. Da wird nix am Boden gemacht, der bleibt wie er ist." | Flur **13,60 lfdm** · Wohnzimmer weiterhin ohne jede Wandposition |
| **PM-021** | „Wohnküche, sechs mal fünf, Höhe zwo sechzig. Zwei Fenster: eins ist eins zwanzig mal eins vierzig, das andere achtzig mal eins zehn. Zwei Türen: eine normal Maß, die andere eine breite Terrassentür, zwei Meter mal zwo zehn. Wände streichen, einmal drüber reicht." | **20,00 lfdm** — der wichtigste Fall der Stufe: Zimmertür bleibt drin, Terrassentür (2,00 m) wird abgezogen |
| **PM-022** | „Schlafzimmer, vier Meter fünfzig mal drei Meter achtzig, Höhe zwo fünfzig. Wände zweimal streichen, Decke einmal mit. Ein Fenster, Standardmaß, eine Tür, normal." | **16,60 lfdm** |
| **PM-025** | „Gästezimmer, vier Meter mal drei Meter fünfzig, eine Tür normal Maß. Vinylboden im Fischgrätmuster verlegen. Sockelleisten werden auch neu montiert, passend zum Fischgrätmuster." | **15,00 lfdm** · Fischgrät weiterhin 15 % → 16,10 m² |
| **PM-026** | „Küche, vier Meter zwanzig mal drei Meter sechzig, Höhe zwo fünfzig. Wände zweimal streichen, Decke reicht einmal. Zwei Fenster, Standardmaß, eine Tür, normal." | **15,60 lfdm** |

---

## Stufe 5 — neuer Fall

### PM-037 — Leibungen dreiseitig und Fensterbank nur einmal *(neu, 2026-09-04)*

**Warum:** VOB-013 ist gefixt (Leibung dreiseitig statt rundherum, Fensterbank
nicht mehr doppelt), aber **kein einziger Testfall deckt das ab**. Der Fix wirkt
auf jedem Malerangebot mit Fenstern und ist bisher ungeprüft unterwegs.

> Wohnzimmer, fünf mal vier, Höhe zwo sechzig. Wände zweimal streichen. Zwei Fenster, jeweils eins zwanzig mal einen Meter, die Leibungen werden mitgestrichen, fünfundzwanzig Zentimeter tief. Die Fensterbänke werden auch gestrichen. Eine Tür, normal Maß.

- Wandfläche **46,80 m²** (Umfang 18,00 × 2,60, keine Öffnungsabzüge)
- **Fensterleibungen streichen: 1,60 m²** — 2 × (1,20 + 2×1,00) × 0,25. Kommt 2,20 m² raus, rechnet das Tool noch rundherum
- **Fensterbänke streichen: 0,60 m²** — 2 × 1,20 × 0,25, und diese Fläche darf **nicht** zusätzlich in der Leibung stecken
- Boden schützen 20,00 · Sockelleisten abkleben **18,00 lfdm**

---

*Prüfmeister · 2026-09-04 · 23 Fälle · Ergebnisse nach `pruefmeister-testfaelle.md`*
