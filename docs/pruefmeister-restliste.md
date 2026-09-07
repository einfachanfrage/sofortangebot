# Restliste bis alles grün — Stand 07.09.2026

**Ersetzt `pruefmeister-einsprechliste.md`.** Die alte Liste ist abgearbeitet und
gelöscht; hier steht nur noch, was zwischen jetzt und „alles grün" liegt.

---

## Die unbequeme Antwort zuerst

**Heute kann durch Einsprechen kein einziger Fall grün werden.** Alle zwölf
offenen Diktat-Fälle hängen an acht Code-Punkten, die noch nicht gefixt sind.
Wer sie jetzt einspricht, bekommt exakt denselben Befund nochmal — das kostet
dich eine Stunde und bringt keinen Haken.

Was die Reihenfolge angeht, ist die Lage aber so gut wie nie:

- **Kein einziger offener Punkt ist ein Rechenfehler.** Die Mengen stimmen in
  allen zwölf Fällen. Es geht um Preiszuordnung, Positionstexte und zwei
  Extraktionslücken.
- Sieben der acht Punkte sind **im Code lokalisiert**, mit Datei und Zeile. Der
  Engineer muss nicht suchen.
- **Zwei Fälle kannst du heute ohne ihn schließen** (unten, Teil A).

Realistisch: wenn die Fixes heute kommen, sind die zwölf Nachtests **rund 40
Minuten Einsprechen** — die Diktate sind kurz und stehen alle unten.

---

## Teil A — was du heute ohne den Engineer erledigen kannst

### PM-014 — Gleichzeitigkeits-Nachtest *(kein Diktat, reiner Klicktest)*

Der Dubletten-Fix und der DB-Constraint sind seit dem 20.08. drin, der gezielte
Test fehlt. So geht er:

1. Ein Angebot aufnehmen, bis zum Entwurf durchgehen.
2. Auf „Angebot erstellen" (oder wie der finale Button heißt) **zweimal schnell
   hintereinander** klicken.
3. Danach die Angebotsliste öffnen: **Es darf genau ein Angebot entstanden sein.**
   Schick mir Angebotsnummer und Summe, dann setze ich PM-014 zu.

### PM-015 — Preisdatenbank bei neuem Konto *(kein Diktat)*

1. Ein **frisches Testkonto** anlegen, beim Onboarding „manuell" wählen.
2. Direkt danach auf `/preise` gehen und die **Anzahl der Positionen** ablesen.
3. Erwartet: **die volle Standardliste** (rund 340 Positionen), nicht 0 und nicht
   eine Handvoll. Zahl an mich, dann ist auch PM-015 zu.

---

## Teil B — die acht Punkte für den Product Engineer

| # | Befund | Fundort | blockiert |
|---|---|---|---|
| **F1** | Untertitel ist fest auf „2 Lagen" / „2-fach" verdrahtet und widerspricht bei 1x-Anstrich dem Titel | Positions-Untertitel (`positions-untertitel`-Logik) | PM-021 · PM-022 · PM-026 |
| **F2** | Fischgrät wirkt auf den Verschnitt, aber nicht auf Titel und Preis | `boden-normalisierer.ts:44` + Preis-Matcher | PM-025 · PM-013 · PM-033 |
| **F3** | Belagtitel streut zwischen Läufen: „Klick-Vinyl" (16 €) vs. „Vinyl-Boden" (22 €) | `boden-normalisierer.ts:42/44` | PM-032 |
| **F4** | Erschwerniszuschlag „schwieriger Untergrund" steht neben der Q2-Vollflächenspachtelung | Zuschlagslogik Maler | PM-011 |
| **F5** | „Sockelleisten abkleben" und „Sockelleisten streichen" entstehen für dieselbe Leiste | `maler.ts` Sockelleisten-Zweig | PM-012 |
| **F6** | Dachfenster wird abgezogen statt übermessen; „Sockelleisten abkleben" verschwindet zwischen Karte und Entwurf; „Raumhöhe !" im DG | Dachgeschoss-Zweig | PM-030 (+ PM-007) |
| **F7** | `daten.leibungen[]` kommt leer aus der Extraktion — der VOB-013-Fix ist unerreichbar | Extraktions-Prompt / Schema | PM-037 |
| **F8** | „So gerechnet"-Zeile zeigt eine andere Rechnung als die abgerechnete Position (zieht Öffnungen ab, VOB-widrig) | Rechenweg-Text | PM-031 · PM-021 |

**Wenn nur eines gefixt wird, dann F1.** Die anderen sieben kosten Geld oder
Nerven; F1 kostet **Rechtssicherheit**. Auf dem Kundenangebot steht schwarz auf
weiß „Deckenanstrich in 2 Lagen", abgerechnet wird eine Lage. Wenn Titel und
Leistungsbeschreibung sich widersprechen, geht der Zweifel zulasten dessen, der
das Angebot gestellt hat (§ 305c BGB) — der Handwerker schuldet dann womöglich
zwei Anstriche zum Preis von einem, und er hat den Satz nicht mal selbst
geschrieben. Der Fund steht inzwischen in **drei** unabhängigen Fällen.

**F2 hat eine Nebenwirkung, die man einplanen muss:** Sobald Fischgrät auf den
Preis wirkt, ändern sich auch die Summen in PM-013 und PM-033, die heute grün
sind. Beide müssen deshalb mit in den Nachtest — das ist kein Rückschritt,
sondern die Folge des Fixes.

---

## Teil C — die zwölf Nachtests, wenn die Fixes stehen

Wortlaut nicht ändern. Ein Nachtest mit anderer Formulierung ist keiner.

### Nach F1 — der Untertitel *(drei kurze Fälle)*

| Fall | Diktat | worauf schauen |
|---|---|---|
| **PM-021** | „Wohnküche, sechs mal fünf, Höhe zwo sechzig. Zwei Fenster: eins ist eins zwanzig mal eins vierzig, das andere achtzig mal eins zehn. Zwei Türen: eine normal Maß, die andere eine breite Terrassentür, zwei Meter mal zwo zehn. Wände streichen, einmal drüber reicht." | Untertitel zur Wand muss **einlagig** sagen. Mengen bleiben: Wand 53,00 m², Sockel 20,00 lfdm. Und die Klammer im Rechenweg darf nur die **abgezogene** Tür listen (F8) |
| **PM-022** | „Schlafzimmer, vier Meter fünfzig mal drei Meter achtzig, Höhe zwo fünfzig. Wände zweimal streichen, Decke einmal mit. Ein Fenster, Standardmaß, eine Tür, normal." | Wand-Untertitel 2-lagig, **Decken-Untertitel 1-lagig**. Sockel 16,60 lfdm |
| **PM-026** | „Küche, vier Meter zwanzig mal drei Meter sechzig, Höhe zwo fünfzig. Wände zweimal streichen, Decke reicht einmal. Zwei Fenster, Standardmaß, eine Tür, normal." | Derselbe Test in einem Raum: Wand 2x/2-lagig, Decke 1x/**1-lagig**. Mengen 39,00 · 15,12 · 15,12 · 15,60 |

### Nach F2 — Fischgrät kostet Fischgrätpreis *(drei Fälle)*

| Fall | Diktat | worauf schauen |
|---|---|---|
| **PM-025** | „Gästezimmer, vier Meter mal drei Meter fünfzig, eine Tür normal Maß. Vinylboden im Fischgrätmuster verlegen. Sockelleisten werden auch neu montiert, passend zum Fischgrätmuster." | **36,00 €/m²** (`Designbelag im Fischgrätmuster kleben`) oder Grundpreis + ausgewiesener Aufpreis. Menge bleibt 16,10 m², Sockel 15,00 lfdm |
| **PM-013** | „Wohnzimmer, acht mal viereinhalb. Eichenparkett, Fischgrät verlegt, das braucht ja mehr Verschnitt. Ist schon ne große Fläche, da muss wahrscheinlich ne Dehnungsfuge rein, mach das bitte mit rein. Boden nur, an den Wänden machen wir nix. — Flur daneben, fünf mal eins achtzig, Höhe zwo sechzig. Kein Fenster da, aber eine Tür, normal Maß. Nur Wände und Decke streichen, zweimal. Da wird nix am Boden gemacht, der bleibt wie er ist." | Parkett-Fischgrät: **68,00 €/m²** (`Stabparkett im Fischgrätmuster verlegen`). Menge bleibt 41,40 m², Flur-Sockel 13,60 lfdm, Wohnzimmer weiter ohne Wandposition |
| **PM-033** | „Wohnzimmer, sechs mal vier fünfzig, da kommt Eichenparkett rein, Fischgrät verlegt. Schlafzimmer, vier mal drei sechzig, da wollen die Teppich, Bahnenware. Flur, fünf mal eins fünfzig, da kommt Laminat, ganz normal gerade. An den beiden Türen zum Wohnzimmer und zum Schlafzimmer jeweils eine Übergangsschiene, weil ja unterschiedliche Beläge. Trittschall nur unterm Laminat im Flur. Sockelleisten bleiben überall, wie sie sind." | Fischgrätpreis **nur im Wohnzimmer** — Teppich und Laminat behalten ihre Sätze. Mengen bleiben 31,05 / 14,40 / 7,88 m², zwei Schienen, keine Sockelleisten |

### Nach F3 bis F8 — je ein Fall

| Fall | Diktat | worauf schauen |
|---|---|---|
| **PM-032** *(F3)* | „Erdgeschosswohnung. Flur, sechs mal eins zwanzig. Wohnzimmer, fünf mal vier. Küche, drei mal zwo achtzig. Überall dasselbe Klick-Vinyl, gerade verlegt, durchgehend ohne Schwellen — das läuft von der Küche durch den Flur ins Wohnzimmer. Trittschalldämmung drunter. Nur zum Bad hin kommt eine Übergangsschiene, im Bad selbst machen wir nichts. Sockelleisten überall neu, weiße MDF. Jeder Raum hat eine normale Tür." | Titel **„Klick-Vinyl"** mit **16,00 €/m²**, nicht „Vinyl-Boden" mit 22,00. Belag 37,38 m², Dämmung 35,60 m², eine Schiene, Sockel 44,00 lfdm. **Dieser Fall braucht zwei Läufe** — der Fehler trat in einem von vier Durchgängen auf, ein einzelner grüner Lauf beweist nichts |
| **PM-011** *(F4)* | „Ähm, Arbeitszimmer, vier mal drei zwanzig, Höhe zwo fünfzig. Ist n Altbau, die Wände sind ordentlich uneben — die müssen komplett gespachtelt werden, Qualitätsstufe Q2, nicht nur ne kleine Ausbesserung, wirklich die ganze Fläche. Danach zweimal streichen. Ein Fenster, Standardmaß, eine Tür, normal. Sockelleisten kleben wir ab, die bleiben wie sie sind." | **Kein** „Erschwerniszuschlag schwieriger Untergrund" neben der Q2-Spachtelung. Altbau-Zuschlag darf bleiben. Sockel 14,40 lfdm, Grundierung als Vorschlag ist richtig |
| **PM-012** *(F5)* | „Esszimmer, viereinhalb mal drei, Höhe zwo fünfundfünfzig. Wände streichen, zweimal drüber, ganz normal. Die Sockelleisten bleiben genau wie sie sind, die werden NICHT neu gemacht, die NICHT demontiert — die sollen nur nochmal mitgestrichen werden, in der gleichen Farbe wie die Wand. Ein Fenster, Standardgröße, eine Tür, normal Maß." | Genau **eine** Sockelleisten-Position: „streichen", 15,00 lfdm. Kein „abkleben" daneben. Karte und Entwurf müssen dieselbe Positionszahl zeigen |
| **PM-030** *(F6)* | „Dachzimmer, vier Meter fünfzig mal vier Meter. Kniestock ist eins Meter hoch. Die Dachschrägen zusammen ergeben achtzehn Quadratmeter. Ein Dachfenster drin, normale Größe. Wände, Schrägen und Kniestock alles zweimal streichen." | Dachschrägen **18,00 m²** in Karte *und* Entwurf (kein Dachfensterabzug). „Sockelleisten abkleben" **17,00 lfdm** muss im Entwurf noch da sein. Kein rotes „!" bei Raumhöhe |
| **PM-037** *(F7)* | „Wohnzimmer, fünf mal vier, Höhe zwo sechzig. Wände zweimal streichen. Zwei Fenster, jeweils eins zwanzig mal einen Meter, die Leibungen werden mitgestrichen, fünfundzwanzig Zentimeter tief. Die Fensterbänke werden auch gestrichen. Eine Tür, normal Maß." | Leibungen **1,60 m²** (dreiseitig, nicht 2,20 rundherum), Fensterbänke **0,60 m²** separat und nicht doppelt. Wand 46,80 m², Sockel 18,00 lfdm |
| **PM-031** *(F8)* | „Fassade an der Nordseite, zehn Meter lang, Wandhöhe fünf Meter. Zwei Fenster drin, jeweils eins zwanzig mal eins vierzig. Einmal Fassadenfarbe drauf." | „So gerechnet" muss **50,00 m²** zeigen, dieselbe Zahl wie die Position — nicht 46,64 |

---

## Teil D — zwei Entscheidungen, die bei dir liegen

1. **Erschwerniszuschlag: Pauschale oder Prozent?** Blockiert den Restpunkt in
   PM-008. Meine Empfehlung steht: Prozent, weil der Zuschlag mit der Fläche
   wächst — ein Gerüstaufbau ist eine Pauschale, erschwertes Arbeiten ist keine.
2. **Einheit für Fensterleibungen.** Meine Antwort an Legal war: **lfm oder je
   Fenster, nicht m²** — der Handwerker denkt in laufenden Metern Leibung. Für
   PM-037 muss das entschieden sein, sonst prüfe ich gegen ein bewegliches Ziel.

---

## Teil E — was danach kommt (Richtung 100)

Wenn diese zwölf grün sind, stehen **37 Fälle** und die Engine hat in Maler und
Boden keinen bekannten Rechenfehler mehr. Die Lücken, die ich für die nächsten
Batches sehe, in der Reihenfolge, in der sie mir wehtun:

- **Bad / Fliesen** — komplett ungetestet, eigenes Gewerk, eigene Normen (DIN 18352)
- **Treppen** — Stufen, Setzstufen, Wangen; im Katalog vorhanden, nie geprüft
- **Fenster und Türen lackieren** — Maler, aber ganz andere Mengenlogik (Stück, Ansichtsflächen)
- **Abrisse und Entsorgung** — Container, Kubikmeter, Entsorgungsnachweise
- **Mehrere Aufnahmen zu einem Angebot** — heute nur punktuell getestet
- **Der Kunde redet dazwischen** — Korrekturen mitten im Diktat („nee, warte, doch drei Meter")

Das sind sechs Batches à fünf bis zehn Fälle. Damit ist die 100 kein Selbstzweck
mehr, sondern eine Abdeckung.

---

*Prüfmeister · 2026-09-07 · Arbeitszettel, wird gelöscht wenn alles grün ist ·
Ergebnisse wie immer nach `pruefmeister-testfaelle.md`*
