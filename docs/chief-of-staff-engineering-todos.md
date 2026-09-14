# Chief of Staff ↔ Head of Product Engineering — Koordinations-Todos

**Neu angelegt: 10.09.2026, auf Sandys direkten Auftrag** („das soll sofort
von wem auch immer gefixt werden" — zu CoS-013, dem wiederholten
Speicherfehler in `chief-of-staff-todos.md`). Grund für diese Datei: die
beiden am häufigsten und am dichtesten aufeinanderfolgend schreibenden
Parteien — Chief of Staff und Head of Product Engineering — teilten sich
bisher eine einzige Datei (`chief-of-staff-todos.md`). Alle acht bisherigen
Vorfälle des Speicherfehlers sind in genau dieser Kollision entstanden. Die
anderen Fachrollen haben längst eigene Dateien (`chief-of-staff-platform-
todos.md`, `chief-of-staff-marketing-todos.md`, `chief-of-staff-legal-
todos.md`, `chief-of-staff-finance-todos.md`) — diese Datei hier schließt
exakt diese Lücke für Product Engineering.

**Ablauf ab sofort:**
- Neue Themen von CoS an Engineering: hier eintragen, nicht mehr in
  `chief-of-staff-todos.md`.
- Engineerings Antworten/Fix-Updates: ebenfalls hier, direkt unter dem
  jeweiligen Punkt.
- `chief-of-staff-todos.md` bleibt bestehen als **Archiv** der bisherigen
  ~250 Punkte (CoS-001 bis CoS-XXX, IDs bleiben stabil, nichts wird
  umnummeriert) — wird aber ab sofort nicht mehr aktiv von zwei Seiten
  gleichzeitig beschrieben. Bestehende offene Punkte dort (z. B. CoS-013
  selbst) werden hier weitergeführt, sobald die Gegenseite antwortet, mit
  Verweis auf die ursprüngliche ID.
- Jeder neue Punkt hier bekommt eine eigene ID (**CoS-E-XXX**), analog zu
  CoS-P-XXX bei Platform.

**Warum das den Speicherfehler wirklich behebt (nicht nur behandelt):** Der
Fehler entsteht, wenn zwei Prozesse zeitlich nah hintereinander in dieselbe
Datei schreiben, ohne dass ein Commit oder eine andere Synchronisation
dazwischenliegt. Diese Datei hier hat ab jetzt nur noch zwei Schreibende
(CoS und Engineering) statt vieler — reduziert die Kollisionsfläche aber
nicht auf null. Die einzige Konstellation, die weiterhin kollidieren kann,
ist CoS und Engineering selbst, wenn beide gleichzeitig in dieser Datei
schreiben. Deshalb zusätzlich: **möglichst ans Dateiende anhängen, nicht in
bestehende Abschnitte hineinschreiben** (Konvention aus CoS-013
übernommen), und bei Zweifel kurz nachfragen, bevor zwei Antworten
gleichzeitig entstehen.

**Datei-Sicherheit:** Ganz am Ende dieser Datei steht eine feste
Markierung (`---

## CoS-E-039 / TN-095 — das Ticket hieß falsch (12.09.2026)

Manfreds Satz war: *„222 Positionen, davon gefühlt ein Drittel Varianten. Ich
brauch 40."* Daraus wurde das Ticket „Katalog-Dopplungen aufräumen". Ich habe
zuerst gemessen statt aufgeräumt, und die Messung sagt etwas anderes.

### Was tatsächlich da war

Es sind **fast keine Dopplungen**. Es sind **Staffeln** — zwei Zeilen, die
sich nur durch eine Angabe in Klammern unterscheiden:

```
PV-Anlage elektrisch anschließen (bis 10 kWp)        850,00 €
PV-Anlage elektrisch anschließen (>10 kWp)         1.400,00 €
```

Der Preis-Matcher wirft Klammern weg, bevor er vergleicht. Danach heißen
beide Zeilen gleich — und es gewinnt die, die im Katalog weiter oben steht.
Bei einer Staffel ist das die kleinste.

**Die Richtung ist deshalb nie zufällig: Der Betrieb rechnet systematisch zu
billig ab.** Beim Personenaufzug waren es 10.000 €, bei der Küche 2.400 € je
laufendem Meter, bei der beidseitig lackierten Tür 30 € — und die Tür kommt
jeden Tag vor.

Das ist der **vierte Fall derselben Familie** an einem Tag, nach der
Millimeterspanne, der Grundierungsart und der Epoxid-Schicht: *Was eine Zeile
von der anderen unterscheidet, steht in Klammern — und Klammern wirft die
Normalisierung weg.*

### Was gemessen wurde

`node scripts/katalog-dopplungen.mjs` schickt **jede** Katalogzeile als
gesuchten Titel durch denselben Matcher wie der Angebots-Endpunkt, mit den
Zeilen ihres eigenen Gewerks als Kandidaten. Kommt etwas anderes zurück als
sie selbst, ist sie über ihren eigenen Namen unerreichbar.

| | Zeilen |
|---|---|
| Katalog gesamt | 2379 |
| unerreichbar, Stand morgens | **64** |
| davon mit gleichem Preis (harmlos fürs Geld) | 0 |
| davon mit **anderem** Preis | 64 |
| unerreichbar nach dem Fix | **22** |

Die 22 sind der Rest, den kein Muster lösen kann — dazu unten.

### Was ich repariert habe

Die Gruppe `Maßschwelle` in `src/lib/preis-aufwandswoerter.ts` kannte nur
mm/cm/km. Sie heißt jetzt **`Staffel`** und liest am Rohtitel:

- Zahl + Einheit dahinter (`10 kWp`, `8 Haltestellen`, `3-Zimmer`, `bis 8t`)
- Einheit **vor** der Zahl (`DN 150`, `R90`, `M25`) — das kann kein
  Suffix-Muster, und daran sind SHK, Elektro und Brandschutz hängen geblieben
- zwei Maße mit `x`/`×` (`114x118cm`) — sonst sind `78x118cm` und
  `114x118cm` für den Vergleich dasselbe, nämlich `118cm`
- der Vergleichswert enthält die Vorsilbe, sonst sähen `bis 10 kWp` und
  `>10 kWp` gleich aus

Dazu zwei kleinere Gruppen:

- **`Umfang`** (neu): `einseitig` / `beidseitig` / `allseitig`. Das ist
  **unser eigenes Gewerk**: `Tür streichen / lackieren (beidseitig)` kostet
  75,00 €, `(einseitig)` 45,00 € — und die beidseitige Tür bekam den
  einseitigen Preis.
- **`Schicht/Gang`**: `2-lagig` als Zahl, nicht nur `zweilagig` als Wort.
  `Parkett ölen (2-lagig)` bekam den 1-lagig-Preis.

Alle drei Regeln arbeiten mit `nur-unterschied`: Sie sperren **nur**, wenn
beide Seiten eine Angabe tragen und die Angaben sich widersprechen. Sagt der
Handwerker bloß „Tür lackieren", bekommt er weiter einen Preis. Das ist die
Lehre aus der Verlegeart (Abschnitt G): Eine Sperre, die auch dann greift,
wenn eine Seite gar nichts sagt, macht mehr kaputt als sie heilt.

**Gemessen gegengeprüft:** die 25 bekannten Maler- und Boden-Paare (Wand
streichen 9,50 €, Decke 11,00 €, Heizkörper 40,00 €, Kalkputz 35,00 €,
Laminat 14,00 €, Parkett abschleifen 20,00 €, Spachtelarbeiten Q3 14,00 € …)
sind Zeichen für Zeichen unverändert.

### Was jetzt einen Menschen braucht — Entscheidungsliste

Die verbliebenen 22 Zeilen unterscheiden sich **nicht durch eine Zahl,
sondern durch ein Wort**: „gewendelt" statt „gerade", „Beton" statt
„Mauerwerk", „Gips" statt „PU-Hartschaum", „hochwertig" statt „einfach". Das
kann kein Muster entscheiden — das ist eine Benennungsfrage.

**Die Frage an Manfred bzw. den Prüfmeister lautet für jede Zeile gleich:**
Wie heißt diese Position, wenn man sie **ohne Klammer** schreiben müsste?
`Treppe abbrechen (Beton)` → `Betontreppe abbrechen`. Steht das
unterscheidende Wort **vor** der Klammer, findet die Suche sie wieder — ohne
jede Codeänderung.

Die Liste erzeugt sich selbst neu mit
`node scripts/katalog-dopplungen.mjs --liste`. Stand 12.09.2026:

## Abbruch

- **Garage abbrechen (Leichtbau / Fertiggarage)** — 1.200,00 €/Stück
  bekommt heute: *Garage abbrechen (Beton / Massiv, bis 25 m²)* — 2.800,00 €
- **Treppe abbrechen (Holz)** — 280,00 €/Stück
  bekommt heute: *Treppe abbrechen (Beton)* — 850,00 €
- **Wandöffnung / Durchbruch herstellen (bis 1 m², Beton / Stahlbeton)** — 650,00 €/Stück
  bekommt heute: *Wandöffnung / Durchbruch herstellen (bis 1 m², Mauerwerk)* — 280,00 €
- **Vollabbruch je m² BGF (Stahlbeton / aufwändig)** — 110,00 €/m²
  bekommt heute: *Vollabbruch je m² BGF (Massivbau, Richtwert)* — 75,00 €

## Aufzugstechnik

- **Treppenlift einbauen (gewendelte Treppe)** — 9.500,00 €/Pauschale
  bekommt heute: *Treppenlift einbauen (gerade Treppe, komplett)* — 5.500,00 €

## Boden

- **Massivholzdielen verlegen vollflächig verklebt** — 52,00 €/m²
  bekommt heute: *Landhausdiele verlegen vollflächig verklebt* — 40,00 €
- **Klebe-Vinyl verlegen vollflächig (Profikleber, Nasskleber)** — 28,00 €/m²
  bekommt heute: *Klebe-Vinyl verlegen vollflächig (Dünnbett, Self-Adhesive)* — 22,00 €
- **Aufpreis Verlegung bei Fußbodenheizung (FBH-geeignet)** — 4,00 €/m²
  bekommt heute: *Aufpreis Verlegung bei Fußbodenheizung (elastischer Kleber)* — 8,00 €
- **Laminat verlegen schwimmend (Großdiele / breites Format)** — 16,00 €/m²
  bekommt heute: *Laminat verlegen schwimmend (Klick-System, Standard)* — 14,00 €

## Dach

- **Oberste Geschossdecke dämmen (begehbar, Trittschutzplatte)** — 55,00 €/m²
  bekommt heute: *Oberste Geschossdecke dämmen (nicht begehbar, MW 160mm)* — 35,00 €

## Estrich

- **Wärmedämmung verlegen (Mineralwolle / Steinwolle)** — 22,00 €/m²
  bekommt heute: *Wärmedämmung verlegen (EPS, bis 60mm)* — 14,00 €

## Fenster

- **Außenrollladen (elektrisch, 230V) einbauen inkl. Kasten** — 580,00 €/Stück
  bekommt heute: *Außenrollladen (manuell, Gurt) einbauen inkl. Kasten* — 380,00 €

## Garten

- **Gartenpflege allgemein (Hilfsarbeiter, je Stunde)** — 30,00 €/Stunde
  bekommt heute: *Gartenpflege allgemein (Fachkraft, je Stunde)* — 45,00 €

## Schreiner

- **Holztreppe Massiv (gewendelt / Sonderform)** — 9.500,00 €/Pauschale
  bekommt heute: *Holztreppe Massiv (gerade, bis 10 Stufen, inkl. Geländer)* — 5.500,00 €
- **Küche Planung + Fertigung + Montage (hochwertig, je lfdm)** — 4.200,00 €/lfdm
  bekommt heute: *Küche Planung + Fertigung + Montage (einfach, je lfdm)* — 1.800,00 €
- **Küche Planung + Fertigung + Montage (mittel, je lfdm)** — 2.800,00 €/lfdm
  bekommt heute: *Küche Planung + Fertigung + Montage (einfach, je lfdm)* — 1.800,00 €

## Stuck

- **Deckenrosette montieren (groß, >50cm Durchmesser)** — 90,00 €/Stück
  bekommt heute: *Deckenrosette montieren (PU / Gips, Fertigteil)* — 55,00 €
- **Stuckleiste montieren (Gips, profiliert / aufwändig)** — 40,00 €/lfdm
  bekommt heute: *Stuckleiste montieren (PU-Hartschaum, einfach)* — 18,00 €
- **Stuckleiste montieren (PU-Hartschaum, profiliert / aufwändig)** — 28,00 €/lfdm
  bekommt heute: *Stuckleiste montieren (PU-Hartschaum, einfach)* — 18,00 €
- **Stuckleiste montieren (Gips, einfach)** — 25,00 €/lfdm
  bekommt heute: *Stuckleiste montieren (PU-Hartschaum, einfach)* — 18,00 €
- **Stuckleiste montieren (EPS / Styropor, einfach)** — 12,00 €/lfdm
  bekommt heute: *Stuckleiste montieren (PU-Hartschaum, einfach)* — 18,00 €

## Echte Dopplungen — gleicher Titel, zwei Preise

- **Aufpreis Estrichdicke je zusätzlicher cm** (Estrich – Anhydritestrich): 2,80 € und 2,50 € — eine der beiden muss weg.

Die letzte ist die einzige **echte** Dopplung im ganzen Katalog: derselbe
Titel, zwei Preise. Da muss eine der beiden Zeilen weg — das ist keine
Benennungsfrage, sondern ein Fehler in den Daten.

### Was daraus als Regel bleibt

**Eine Klammer darf nie das Einzige sein, was zwei Preise auseinanderhält.**
Wer eine Katalogzeile anlegt, deren Unterscheidungsmerkmal in Klammern steht,
legt eine Zeile an, die niemand finden kann. Das gilt für den Standardkatalog
und genauso für die Zeilen, die ein Betrieb sich selbst anlegt — und beim
Betrieb fällt es niemandem auf, weil er seinen eigenen Preis für gesetzt hält.

Für die Zukunft gehört das in die Oberfläche: Wer beim Anlegen einer Position
einen Titel eingibt, der sich von einem vorhandenen **nur** in der Klammer
unterscheidet, sollte einen Hinweis bekommen. Das ist kein Ticket für heute,
aber es ist der einzige Ort, an dem das Problem nicht wieder entsteht.

*Head of Product Engineering · 2026-09-12*

---

## CoS-E-050 — gebaut. 64 → 0. (12.09.2026, abends)

Auftrag war „jetzt bauen, nicht nur dokumentieren". Ist gebaut.

**Ergebnis:** `node scripts/katalog-dopplungen.mjs` meldet **0** — keine
einzige der 2379 Katalogzeilen ist über ihren eigenen Namen mehr
unerreichbar. Morgens waren es 64.

| Schritt | unerreichbar |
|---|---|
| Ausgangslage | 64 |
| Staffel-Erkennung (Zahlen im Titel) | 22 |
| Manfreds Dielen-Fund (Synonymregel) | 21 |
| **Umbenennungs-Zug, dieser Auftrag** | **0** |

**Was geändert wurde:**

- **40 Titel** in `src/lib/default-prices.ts`, davon 38 nach Manfreds Liste
  und 2 für die Estrichdicke (dazu unten).
- **16 davon** auch in `src/lib/preise-vorlagen.ts` — dieselben Zeilen werden
  dort als Vorlage angeboten, und zwei Dateien mit verschiedenen Namen für
  dieselbe Leistung wären genau der Zustand, aus dem das Problem kam.
- Die Sperrklinke in `katalog-staffeln.test.ts` steht jetzt auf **0**, nicht
  mehr auf einer Obergrenze. Bei null ist sie am schärfsten: Jede neue
  Katalogzeile, die sich von einer vorhandenen nur in der Klammer
  unterscheidet, macht den Test rot, bevor sie jemandem Geld kostet.

**Die 25 bekannten Maler- und Boden-Paare sind unverändert** — bis auf eine
Zeile, die denselben Preis unter dem neuen Namen ausweist (Laminat 14,00 €).

### Die Estrichdicke war keine Dopplung

Manfred hatte gesagt: *„Erst prüfen, ob die Zeile überhaupt in Maler/Boden
gehört. Wenn sie bleibt: 2,80, die 2,50 weg."* Beim Nachsehen: **Es sind zwei
verschiedene Estricharten**, nicht zwei Fassungen derselben Zeile.

```
Estrich – Zementestrich    Aufpreis Estrichdicke je zusätzlicher cm   2,50 €
Estrich – Anhydritestrich  Aufpreis Estrichdicke je zusätzlicher cm   2,80 €
```

Beide Preise sind richtig, nur trug der Titel die Estrichart nicht. Sie
heißen jetzt `Aufpreis Zementestrich je zusätzlicher cm` und
`Aufpreis Anhydritestrich je zusätzlicher cm`. **Keine Zeile gelöscht** —
genau Manfreds Regel angewandt: Das Unterscheidende gehört nach vorn.

### Zwei Funde beim Bauen, beide hätten Geld gekostet

Das Umbenennen war nicht der schwierige Teil. Das Nachmessen war es.

**1. Die Einzahl sperrte gegen die Mehrzahl.** Nach der Umbenennung auf
`Massivholzdiele verlegen, vollflächig verklebt` traf die alte Schreibweise
`Massivholzdielen …` (mit n) plötzlich **Fertigparkett für 35,00 €** — ein
anderes Produkt. Nach einer Zwischenkorrektur sogar **PVC-Belag für 18,00 €**
statt 52,00 €.

Ursache: In `aufwandMarker` hing es an `regel === 'nur-unterschied'`, ob als
Merkmal der gefundene Wortlaut oder der kanonische Name zählt. Für Zahlen ist
der Wortlaut richtig („bis 10 kWp" ≠ „>10 kWp"). Für Wörter ist er falsch —
ein Buchstabe Unterschied, und dieselbe Kennung sperrt gegen sich selbst.
Das war eine stille Kopplung zweier Dinge, die nichts miteinander zu tun
haben. Es gibt jetzt ein eigenes Flag `genauerWortlaut`, gesetzt auf genau
den zwei Zahlen-Gruppen.

Wichtig für den Bestand: **Alte Angebote und Handwerker, die weiter die
Mehrzahl tippen, bekommen wieder 52,00 €.** Dafür gibt es einen eigenen Test.

**2. Parkett ist kein Dielenboden.** Damit eine Dielen-Anfrage nie wieder auf
Parkett ausweicht, hat Parkett jetzt eine eigene Kennung.

### Was sich für den Betrieb spürbar ändert — bitte weitergeben

Das ist kein Fehler, sondern die gewollte Richtung, aber es fällt auf, und
Manfred sollte es vorher wissen, nicht nachher merken:

**Wer den alten, allgemeinen Namen sucht, bekommt jetzt oft gar nichts mehr
angeboten statt still eine der Varianten.** Betroffen sind:

| gesucht (alte Schreibweise) | vorher | jetzt |
|---|---|---|
| Außenrollladen einbauen inkl. Kasten | 380,00 € (die manuelle) | kein Preis |
| Gartenpflege allgemein | 45,00 € (die Fachkraft) | kein Preis |
| Oberste Geschossdecke dämmen | 35,00 € | kein Preis |
| Treppenlift einbauen | 5.500,00 € | kein Preis |
| Küche Planung + Fertigung + Montage | 1.800,00 € | kein Preis |
| Wandöffnung / Durchbruch herstellen | 280,00 € | kein Preis |
| Klebe-Vinyl verlegen vollflächig | 22,00 € | kein Preis |
| Aufpreis Verlegung bei Fußbodenheizung | 8,00 € | kein Preis |

Vorher hat die Suche in all diesen Fällen **eine** Variante genommen, ohne zu
sagen welche. Jetzt muss der Betrieb sich entscheiden — das ist PM-018 in
Reinform, und es ist der Preis dafür, dass die teure Variante überhaupt
auffindbar ist. Die neuen Namen sind dabei die, die ein Handwerker ohnehin
tippt („Rollladen elektrisch", „Betontreppe").

**Eine Ausnahme, die ich nicht allein entscheide:** `Wärmedämmung verlegen`
ohne Materialangabe liefert jetzt 20,00 € statt 14,00 €. Grund ist nicht die
Umbenennung selbst, sondern dass die Familie ein drittes Mitglied hat, das
nicht auf Manfreds Liste stand (`Wärmedämmung verlegen (EPS, bis 100mm)`).
**Frage an Manfred: soll die auch umbenannt werden (`Wärmedämmung EPS 100 mm
verlegen`)?** Sonst ist die Familie halb umbenannt, und der allgemeine Fall
zeigt auf die teuerste statt auf die günstigste Zeile.

### Was offen bleibt (unverändert, nicht durch diesen Zug erledigt)

1. **Laminat Großdiele, die 2,00 €** — Preisfrage an den Prüfmeister, nicht
   Benennung. Die Zeile heißt jetzt `Laminat Großdiele verlegen, schwimmend`;
   ob der Aufpreis stimmt, ist unabhängig davon zu klären.
2. **Einbauküche „mittel" / „hochwertig"** — steht jetzt so im Katalog, weil
   Manfred es so vorgeschlagen hat. Wenn ein Schreiner „Standardfront" /
   „Echtholzfront" sagt, ist das ein Zweizeiler.
3. **Der Hinweis beim Anlegen einer eigenen Position** in der Oberfläche —
   der Ort, an dem das Problem gar nicht erst entsteht. Noch nicht gebaut,
   und dafür brauche ich von dir ein eigenes Ticket, weil es die Oberfläche
   berührt und nicht nur den Katalog.

### Nachzumessen (blockiert, sobald der Shell-Zugriff zurück ist)

```
npx vitest run
node scripts/katalog-dopplungen.mjs
node scripts/vokabular-abgleich.mjs
```

Der Abgleich ist der wichtigste der drei: Er sagt, ob die Umbenennungen der
**Engine** etwas kaputt gemacht haben. Meine eigene Messung sagt nein (die
Engine erzeugt keinen der 40 Titel, und die 25 Kontrollpaare stehen), aber
das ist meine Messung, nicht seine.

*Head of Product Engineering · 2026-09-12*

---

## Manfreds zweite Runde — und der Fund, der dabei herausfiel (12.09.2026, spät)

### 1. Wärmedämmung: ganze Familie, ein Muster — erledigt

Manfred: *„Eine Familie, ein Muster, keine Ausnahme."* Ist umgesetzt:

| neu | Preis |
|---|---|
| Wärmedämmung EPS verlegen, bis 60 mm | 14,00 € |
| Wärmedämmung EPS verlegen, bis 100 mm | 20,00 € |
| Wärmedämmung Mineralwolle verlegen | 22,00 € |

**Und seine Begründung ist beim Nachmessen sogar noch stärker, als er
dachte.** Er sagte, die zurückgebliebene Zeile werde zum Ziel der
allgemeinen Suche. Gemessen: Auch wenn die ganze Familie umbenannt ist,
trifft „Wärmedämmung verlegen" weiterhin eine der drei — jetzt die
Mineralwolle für 22,00 €, also die teuerste. Nicht weil sie Standard wäre,
sondern **weil ihr Titel das kürzeste ist**. Der Matcher rechnet
Wortüberlappung; der kürzeste passende Titel gewinnt.

Das heißt: Ein Muster allein löst den allgemeinen Fall nicht. Es braucht
genau das, was Manfred vorgeschlagen hat — siehe Punkt 4.

### 2. Die acht Begriffe, nach Gewerk sortiert

Er wollte wissen, ob Maler oder Boden dabei ist:

**Maler: keiner. Boden: zwei.**

| Begriff | Gewerk | vorher | jetzt |
|---|---|---|---|
| Klebe-Vinyl verlegen vollflächig | **Boden** | 22,00 € | kein Preis |
| Aufpreis Verlegung bei Fußbodenheizung | **Boden** | 8,00 € | kein Preis |
| Außenrollladen einbauen inkl. Kasten | Fenster | 380,00 € | kein Preis |
| Gartenpflege allgemein | Garten | 45,00 € | kein Preis |
| Oberste Geschossdecke dämmen | Dach | 35,00 € | kein Preis |
| Treppenlift einbauen | Aufzugstechnik | 5.500,00 € | kein Preis |
| Küche Planung + Fertigung + Montage | Schreiner | 1.800,00 € | kein Preis |
| Wandöffnung / Durchbruch herstellen | Abbruch | 280,00 € | kein Preis |

Zu den beiden Boden-Begriffen: Beide sind die **alte Katalogschreibweise**,
nicht das, was ein Bodenleger tippt. Wer „Klebe-Vinyl verlegen" sucht,
bekommt 28,00 € (Nasskleber); wer „Aufpreis Fußbodenheizung" sucht, bekommt
8,00 €. Verloren geht nur, wer das Wort „vollflächig" bzw. „Verlegung bei"
mitschreibt. **Kein Alltagsbegriff ist betroffen** — dazu Punkt 3.

### 3. Seine eigentliche Sorge war berechtigt — nur lag es nicht an der Umbenennung

*„Wenn ‚Tür lackieren' oder ‚Laminat verlegen' ohne Zusatz jetzt 0 € und
Versandsperre gibt, dann fällt das nicht auf."*

Ich habe 32 Alltagsbegriffe aus Maler und Boden gemessen, einmal mit und
einmal ohne die Umbenennungen. **Ergebnis identisch — die Umbenennung ist an
keinem einzigen schuld.**

Aber die Messung hat etwas gefunden, das schon vorher da war: **Sechs der 32
fanden überhaupt keinen Preis.**

```
Tür streichen          kein Preis   (obwohl „Tür streichen / lackieren" für 45 € dasteht)
Türen lackieren        kein Preis
Fenster lackieren      kein Preis   (obwohl „Fenster lackieren (2× Anstrich)" für 55 € dasteht)
Heizkörper lackieren   kein Preis   (obwohl „Heizkörper streichen / lackieren" für 40 € dasteht)
Raufaser tapezieren    kein Preis   (obwohl „Raufaser tapezieren ohne Anstrich" für 10 € dasteht)
Estrich grundieren     kein Preis
```

**Ursache: Der Schrägstrich wurde als „und" gelesen.** `Tür streichen /
lackieren` heißt „streichen ODER lackieren, gleicher Preis". Die
Arbeitsgang-Sperre hat daraus „streichen UND lackieren" gemacht und deshalb
jede Anfrage gesperrt, die nur einen der beiden Gänge nennt. Genau Manfreds
Freitagabend-Szenario, nur ohne Umbenennung als Auslöser.

**Repariert** (`sammelzeile` in `preis-aufwandswoerter.ts`): Nennt eine
Katalogzeile mehrere Arbeitsgänge mit Schrägstrich, genügt eine
Übereinstimmung. **Zwei Grenzen bleiben scharf**, und beide sind geprüft:

- **Bündel bleiben gesperrt.** `Raufaser tapezieren + überstreichen 1x`
  (14,00 €) ist kein Entweder-oder — dort zahlt man einen Anstrich mit, den
  niemand bestellt hat. Wer „Raufaser tapezieren" sucht, bekommt jetzt die
  richtige Zeile: `ohne Anstrich`, 10,00 €. Erkannt am „+", „und" und „inkl.".
- **`Parkett schleifen` bleibt ohne Preis.** Der Kopf-Fall des Prüfmeisters:
  Der Katalog kennt nur die Komplettbündel. Unverändert.
- **Eine Anfrage mit zwei Gängen fällt nicht auf eine Zeile mit einem.**
  `Wand spachteln und streichen` bleibt ohne Preis — sonst verschenkt der
  Betrieb das Spachteln.

**Stand jetzt: 1 von 32 ohne Preis** statt 6. Der eine ist
`Estrich grundieren` — die Zeile `Estrich grundieren (Haftgrund)` für 6,00 €,
die wir heute früh mit Manfred vereinbart haben, ist **noch nicht angelegt**.
Sie gehört zum offenen Katalog-Zug (CoS-E-048), nicht hierher.

Festgehalten in `src/lib/__tests__/alltagsbegriffe.test.ts`.

### 4. Sein Standard-Vorschlag: richtig, und er löst genau das, was übrig ist

Manfreds Vorschlag, wörtlich: *„Jede Familie hat eine Zeile, die als Standard
markiert ist … Der allgemeine Begriff trifft den Standard und schreibt ihn
sichtbar in den Titel (‚Tür lackieren, einseitig'), damit der Handwerker
sieht, was angenommen wurde."*

Das ist derselbe Gedanke wie beim Anstrich („2x als Standard angenommen"), und
die Messung zeigt, dass er gebraucht wird: Ohne Standard-Markierung gewinnt
beim allgemeinen Begriff **der kürzeste Titel**, nicht der sinnvollste. Bei
der Wärmedämmung ist das die teuerste Zeile.

**Ich baue das nicht im Alleingang heute Abend**, und zwar aus einem Grund,
der nichts mit Aufwand zu tun hat: Es ändert, was auf dem Bildschirm des
Handwerkers in der Position steht, und es braucht pro Familie eine
Entscheidung, welche Zeile Standard ist — das ist Handwerkerwissen, keine
Ableitung. Manfred hat drei genannt (Tür: einseitig, Laminat: Klick Standard,
Dämmung: EPS bis 60). Es gibt mehr Familien als drei.

**Was ich dafür brauche, Sandy: ein eigenes Ticket.** Es berührt die
Oberfläche und das Datenmodell des Katalogs (ein Standard-Kennzeichen je
Familie), nicht nur Titel. Zusammen mit dem Hinweis beim Anlegen eigener
Positionen ist das ein Paket — beides sind Antworten auf dieselbe Frage: Was
passiert, wenn der Handwerker sich nicht festlegt?

### 5. Ein Fund, den ich NICHT allein entscheide — 65 € an einer Tür

Beim Messen aufgefallen, unabhängig von allem heute:

```
„Tür lackieren"  →  110,00 €   Außentür lackieren beidseitig
```

Eine Zimmertür bekommt den Außentürpreis. Ursache ist eine Stufe im
Preis-Matcher, die Teilzeichenketten ohne Rücksicht auf Wortgrenzen belohnt:
„außentür" enthält „tür".

Ich habe den Gegenversuch gemacht — die Stufe abgeschaltet und alles
nachgemessen:

| | mit Stufe | ohne Stufe |
|---|---|---|
| `Tür lackieren` | 110,00 € (Außentür) | **45,00 €** (Zimmertür, einseitig) |
| `Zarge lackieren` | 55,00 € (Stahlzarge) | kein Preis |
| die 25 Kontrollpaare | unverändert | unverändert |
| unerreichbare Katalogzeilen | 0 | 0 |

Die Stufe bringt an einer Stelle Schaden und an einer anderen Nutzen, und
beide sind Ermessensfragen für einen Handwerker, nicht für mich: **Soll „Tür
lackieren" die Zimmertür meinen? Soll „Zarge lackieren" die Stahlzarge
treffen oder nachfragen?** Ich habe nichts geändert und lege es Manfred vor.

*Head of Product Engineering · 2026-09-12*

---

## CoS-E-051 — Standardzeilen. Gebaut. (12.09.2026, nachts)

Sandy: *„du kennst das Ziel, das diese App hat. Es soll einfach perfekt sein.
Nimm einfach die perfekte Lösung."* Also gebaut, nicht vorgelegt.

### Was jetzt gilt

Es gibt drei Zustände, und alle drei sind benannt statt zufällig:

| Der Titel … | … und dann |
|---|---|
| **legt sich fest** („Tür beidseitig lackieren") | die Sperren entscheiden. Unverändert. |
| **legt sich nicht fest** und es gibt eine Standardzeile | sie gilt — und der Handwerker sieht als Annahme, was angenommen wurde |
| **legt sich nicht fest** und es gibt keine Standardzeile | weiter kein Preis. PM-018 bleibt die Grundlinie. |

Der Standard ist damit kein Raten mehr, sondern eine **benannte, sichtbare
Entscheidung**, und sie steht an einer Stelle, an der ein Handwerker sie
lesen und ändern kann: `src/lib/katalog-standard.ts`.

### Was dabei herauskam, und es war schlimmer als gedacht

Manfred vermutete, ohne Standard gewinne „die oberste Zeile, also die
billigste". Gemessen gewinnt **der kürzeste Titel** — mit beiden Vorzeichen:

```
Tür lackieren            110,00 €  Außentür lackieren beidseitig     → jetzt  45,00 €
Wärmedämmung verlegen     22,00 €  Mineralwolle (die teuerste)       → jetzt  14,00 €
Wand streichen             6,00 €  1x Anstrich (die billigste)       → jetzt   9,50 €
```

Die 110 € an der Zimmertür kamen daher, dass „außentür" das Wort „tür"
enthält. Es war nie eine Regel, es war immer ein Nebeneffekt der
Wortüberlappung.

Der dritte Fall ist der, der mich am meisten überrascht hat: **Der
2x-Standard existierte längst** — seit Sandys „klopf fest" vom 24.08. —, aber
nur in der Mengen-Engine. Wer eine Position von Hand „Wand streichen" nannte,
bekam den 1x-Preis. Derselbe Standard, zwei Orte, nur an einem umgesetzt.
Jetzt an beiden.

### Die elf Familien

Maler: Tür · Fenster · Wand · Decke · Fassade (die letzten drei über die
Anstrichzahl). Boden: Laminat · Parkett · Vinyl · Teppichboden. Estrich:
Wärmedämmung.

**Drei davon hat Manfred selbst gesetzt** (Tür einseitig, Laminat Klick
Standard, Dämmung EPS bis 60). Drei kommen aus Sandys Anstrich-Entscheidung
vom 24.08. **Fünf habe ich vorgeschlagen und sie sind im Code als
„bitte bestätigen" markiert** — Fenster innen, Parkett Fertigparkett
schwimmend, Vinyl Klick, Teppichboden gespannt. Jede Zeile trägt ihre
Quelle, damit niemand sie stillschweigend ändert.

### Wo die Annahme landet — und warum nicht im Titel

Manfred wollte sie „sichtbar im Titel … nur eben auf dem Bildschirm, nicht
auf dem Kunden-PDF". Beides zusammen geht nicht, solange der Titel die Zeile
auf dem Kundenpapier IST.

Deshalb geht sie in `annahmen` — den Kanal, den es dafür schon gibt, der im
Entwurf angezeigt und auf dem Kunden-PDF weggelassen wird (festgehalten seit
`pdf-rechenweg-render.test.ts`: „die Annahme steht NICHT auf dem
Kunden-PDF"). Gleiches Ziel, vorhandene Leitung, ein Mechanismus statt zwei.

Der Handwerker liest im Entwurf:

```
Tür streichen / lackieren (einseitig)      3 Stück     45,00 €
   └─ Annahme: Einseitig angenommen — beidseitig kostet mehr
```

Auch `node scripts/probe-angebot.mjs` zeigt die Annahmen jetzt mit an.

### Drei Schutzlinien, alle geprüft

1. **Eine Ansage schlägt den Standard, immer.** `Tür streichen / lackieren
   (beidseitig)` bleibt 75,00 €, `Türen lackieren (2× Anstrich)` bleibt
   90,00 €. Ein Standard, der eine ausdrückliche Angabe überstimmt, wäre
   schlimmer als gar keiner.
2. **Wer sein Produkt vornweg nennt, hat sich festgelegt.** Beim ersten Lauf
   bekam `Loose-Lay-Vinyl verlegen` (18,00 €) den Vinyl-Standard für 16,00 €.
   Die Begriffe sind jetzt am Titelanfang verankert — das ist Manfreds Regel
   („was unterscheidet, steht vor dem Verb") von der anderen Seite gelesen.
3. **Kein Betrieb bekommt eine Zeile untergeschoben, die er nicht hat.**
   Fehlt die Standardzeile im Katalog des Betriebs, passiert nichts.

### Gemessen

| | |
|---|---|
| Unerreichbare Katalogzeilen | **0** (unverändert) |
| Die 25 Maler/Boden-Kontrollpaare | **unverändert** |
| Alltagsbegriffe ohne Preis | **1 von 32** |

Der eine ist `Estrich grundieren` — die Zeile `Estrich grundieren
(Haftgrund)` für 6,00 € aus dem offenen Katalog-Zug (CoS-E-048) ist noch
nicht angelegt. Kein Fehler, eine offene Lieferung.

Neue Tests: `katalog-standard.test.ts` (31 Fälle) und
`alltagsbegriffe.test.ts`.

### Was jetzt noch offen ist

1. **Fünf Standardzeilen brauchen Manfreds Bestätigung** — sie sind im Code
   markiert. Bis dahin gilt mein Vorschlag; falsch ist er allenfalls im
   Detail, nicht in der Richtung.
2. **Der Hinweis beim Anlegen einer eigenen Position.** Immer noch nicht
   gebaut, und immer noch der einzige Ort, an dem das Problem gar nicht erst
   entsteht. Braucht die Oberfläche.
3. **Weitere Familien.** Elf sind die, die täglich vorkommen. Das Muster ist
   jetzt da; jede weitere ist vier Zeilen in `katalog-standard.ts`.

*Head of Product Engineering · 2026-09-12*

---

## CoS-E-024 / TN-060 — erledigt (13.09.2026)

Manfred legte für „Heizkörper abkleben – 1 Stück“ einen Preis an und bekam
**m²** vorgeschlagen.

**Der Code war richtig, die Anzeige nicht.** Die Einheit der Position wird
sauber übernommen (`setNewDatabaseUnit(item.unit)`), im State stand die ganze
Zeit „Stück“. Die Auswahlliste in `AngebotDetail.tsx` kannte aber nur „Stk“
und „pauschal“ — die Engine schreibt „Stück“ (44 Positionstypen) und
„Pauschale“ (10), der Katalog ebenso (597 bzw. 321 Zeilen). **Ein `<select>`,
dessen `value` in keiner Option vorkommt, zeigt die erste Option**, und die
war m².

Die teure Sorte Anzeigefehler: Wer ihm glaubt und die Einheit „korrigiert“,
legt den Preis unter der falschen Einheit an — und weil der Matcher Einheiten
hart vergleicht, bleibt die Position danach dauerhaft bei 0,00 €. Der Fehler
repariert sich nicht von selbst.

**Repariert:**

- Liste auf die Schreibweisen, die wirklich vorkommen: `m² · Stück · lfdm ·
  m · Pauschale · Stunde · m³ · kg · km · Tag · %`.
- `einheitenFuer()` hängt eine unbekannte Einheit **vorne an**, statt sie
  stillschweigend zu ersetzen. Der Katalog kennt Randfälle wie „m²/cm“
  (Aufpreis Estrichdicke) oder „Fahrt“; die gehören nicht in eine Liste für
  alle, dürfen aber auch nicht falsch angezeigt werden.
- Beide Stellen versorgt: der Dialog „Fehlenden Preis anlegen“ **und** der
  Einheiten-Picker beim Bearbeiten einer Position — der hatte denselben
  Fehler, nur leiser: Bei einer Stück-Position war schlicht keine Kachel
  markiert.

**Warum die Liste jetzt in `src/lib/einheiten.ts` steht und nicht mehr in der
Seite:** Sie stand in einer 170-KB-Komponente, die kein Test je angefasst hat,
und sie sah richtig aus. Als eigenes Modul kann ein Test sie gegen das prüfen,
was Engine und Katalog tatsächlich erzeugen —
`src/lib/__tests__/einheiten.test.ts` tut das, inklusive der Zusicherung, dass
**jede** der 38 Katalogeinheiten korrekt angezeigt wird. Dasselbe Muster wie
bei `positions-gewerk.ts`: Logik, die geprüft werden soll, gehört nicht in
einen Endpunkt oder eine Seite.

*Head of Product Engineering · 2026-09-13*

---

## CoS-E-022 / CoS-E-026 — erledigt, und die Meldung war die Spitze (13.09.2026)

Manfreds zwei Meldungen lauteten „Positionen landen unter Allgemein statt im
Raum“. Beim Nachmessen waren es **drei** Ursachen, und die dritte war keine
Anzeigefrage.

### 1. Die Raumerkennung war eine Stichwortliste

32 Raumwörter, viermal nachträglich erweitert — PM-005 (Speisekammer),
PM-019 (Gästeklo), DC-040 (Wohnung) — jedes Mal **nachdem** es schiefging.

Gemessen mit 52 Raumnamen, die in einem Angebot vorkommen können:
**21 wurden nicht erkannt.** Darunter Atelier, Salon, Wintergarten, Ankleide,
Praxis, Vorraum, Schlafraum — und „Raum 2“, denn das Wort *Raum* stand
selbst nicht in der Liste.

Eine Liste, die man erweitern muss, sobald ein Kunde sein Zimmer anders
nennt, ist keine Regel, sondern eine Wartungsaufgabe ohne Ende.

**Jetzt in dieser Reihenfolge:**

1. **Die Wahrheit, wenn wir sie haben.** Das Angebot kennt seine Räume
   (`quote.raum_details`). Steht der Name dort, ist es ein Raum. Punkt. Alle
   vier Anzeigestellen (Entwurf, Angebotsansicht, Vorschau, PDF) geben die
   Liste jetzt mit.
2. **Sonst die Form, nicht das Vokabular.** Ein Raumname sieht aus wie ein
   Name: ein bis drei Wörter, Buchstaben, keine Klammern, keine Maßangaben,
   kein Komma. Was dahinter steht und nicht so aussieht, ist eine
   Ausführungsangabe („2× Anstrich“, „Schicht 2“) — und die kennen wir
   abschließend, weil die Engine sie selbst erzeugt.

Der Unterschied ist grundsätzlich: **Die alte Regel musste jeden möglichen
Raumnamen kennen. Die neue muss nur die endlich vielen Dinge kennen, die kein
Raum sind.** Ergebnis: 52 von 52.

### 2. Unbekannter Name hieß nicht „Allgemein“, sondern gar keine Räume

Erkennt die Gruppierung **keinen einzigen** Raum, liefert sie null — und das
Angebot wird flach angezeigt. Bei einem Auftrag „Atelier und Salon streichen“
war die Raumstruktur damit komplett weg, nicht nur eine Position.

Das stand in keinem Ticket, weil es niemandem als derselbe Fehler auffiel.

### 3. Der teure Teil: eine Deckengrundierung für zwei Räume

`maler-basis.ts` baute die Deckengrundierung mit `ergaenzt.find(...)` — der
**ersten** Deckenposition, ohne Raum im Titel. Bei zwei Räumen entstand
daraus:

- **eine** Grundierung statt zwei, mit der Fläche des ersten Raums,
- und die landete unter „Allgemein“.

Manfred hat den zweiten Teil gemeldet. Der erste stand darunter und war
schlimmer: **Der zweite Raum bekam seine Deckengrundierung gar nicht.**
Bezahlte Arbeit, die im Angebot schlicht fehlt — dieselbe Klasse wie die
stillen Preisfehler von gestern, nur eine Schicht höher.

Die Wandgrundierung hatte denselben Fehler. An ihr war am 30.08. (PM-028) nur
die Hälfte repariert worden: Sie bekam den Raum in den Titel, blieb aber ein
`.find()`. **Beide laufen jetzt je Raum**, mit der Fläche und dem Raum der
Position, aus der sie abgeleitet werden. Auch die Doppel-Prüfung („gibt es
schon eine?“) war global und ist jetzt pro Raum — sonst verhindert die
Grundierung im Wohnzimmer die im Bad.

Gemessen an einem Zwei-Raum-Auftrag (Wohnzimmer 45/20 m², Bad 30/10 m²):
vorher 1 Deckengrundierung à 20 m² unter „Allgemein“, jetzt 2 mit 20 und 10
m², jede in ihrem Raum.

### Die Regel, die daraus folgt

**Wer eine Position aus einer anderen ableitet, muss den Raum mitnehmen.**
Der Raum steht immer in der Quelle; er geht nur verloren, wenn man ihn beim
Bauen des neuen Titels vergisst. Dafür gibt es jetzt `raumAusTitel()` in
`positions-titel.ts` — eine Stelle statt eines Ausdrucks, den jeder neu
hinschreibt und einer vergisst.

### Gemessen und festgehalten

- Die 22 bestehenden Zusicherungen der Gruppierung: **unverändert grün**
  (inklusive PM-005, PM-019, DC-040 und der Treppenhaus-Emoji-Falle).
- PM-018 (Q-Stufe) und der Grundierungs-Vertrag aus `titel-vertraege`:
  **unverändert grün**.
- Neu: `src/lib/__tests__/raum-zuordnung.test.ts` — 52 Raumnamen, 7
  Nicht-Räume, die bekannten Räume als Vorrang, und die Grundierung je Raum
  mit ihrer eigenen Fläche.

*Head of Product Engineering · 2026-09-13*

---

## CoS-E-021 / TN-052 — erledigt (13.09.2026)

Manfred: *„Wechsel 1× → 2× verlangt manuelles Ändern von Titel, Untertitel
UND Preis statt eines Umschalters, obwohl die App den Preis kennt."*

**Er hat mit dem Nebensatz recht, und der macht es ernster als eine
Bequemlichkeitsfrage.** Der Matcher liest die Anstrichzahl als harten Filter
(Regel 1 vom 24.08.: ein 2x-Auftrag bekommt nie einen 1x-Preis). Wer den Titel
von Hand auf 2× stellt und den Preis vergisst, stellt genau den Zustand
wieder her, den diese Regel verhindern soll: eine Position, die zwei
Anstriche verspricht und einen kostet. Die Handarbeit war eine Fehlerquelle,
nicht nur eine Lästigkeit.

**Jetzt:** Im Bearbeiten-Panel einer Position mit Anstrichzahl stehen drei
Knöpfe — 1×, 2×, 3×. Ein Klick stellt um:

| | |
|---|---|
| Titel | `Wand streichen 1x — Wohnzimmer` → `Wand streichen 2x — Wohnzimmer` |
| Untertitel | „Deckender Anstrich, **einlagig**…" → „… **zweilagig**…" |
| Preis | 6,00 € → 9,50 € — **aus der Preisdatenbank des Betriebs** |

### Warum der Preis gesucht und nicht gerechnet wird

Weil × 2 falsch wäre. Der zweite Anstrich kostet nicht so viel wie der
erste:

```
Wand streichen 1x     6,00 €      Decke 1x     7,00 €
Wand streichen 2x     9,50 €      Decke 2x    11,00 €      (nicht 12,00 / 14,00)
Wand streichen 3x    13,00 €      Decke 3x    15,00 €
```

Grundierung, Abkleben und Anfahrt fallen einmal an. Genau deshalb führt der
Katalog drei eigene Zeilen — und genau deshalb fragt der Umschalter ihn,
statt zu multiplizieren.

### Was passiert, wenn es die Stufe nicht gibt

`Türen lackieren (3× Anstrich)` steht im Standardkatalog nicht. Der Titel
wird trotzdem umgestellt — der Handwerker darf sagen, was er tut — aber der
Preis geht **sichtbar auf 0,00 €** und ein Hinweis sagt es. Damit ist der
Versand gesperrt, bis der Betrieb den Preis einträgt. Lieber sichtbar kein
Preis als still der falsche (PM-018).

### Ein Fund beim Bauen

Die Zahlenerkennung hatte im ersten Anlauf ein `\b` hinter dem Malzeichen.
Nach dem „×" in `Türen lackieren (2× Anstrich)` steht ein Leerzeichen — zwei
Zeichen ohne Wortcharakter, also **gar keine Wortgrenze**. Ausgerechnet die
Schreibweise des Katalogs blieb unerkannt, und bei einer der häufigsten
Positionen wäre der Umschalter nicht erschienen. Dieselbe Fehlerklasse wie
`\bölen\b` gestern.

Ein Test hält jetzt fest, dass Umschalter und Preis-Matcher **dieselbe**
Anstrichzahl lesen — sonst bietet die Oberfläche einen Schalter an, den die
Preissuche ignoriert.

*Head of Product Engineering · 2026-09-13*

---

## CoS-E-040 / TN-097 — erledigt (13.09.2026) — **eine Migration wartet**

Manfred: *„Erschwerniszuschläge ‚Altbau'/‚bewohnt' lassen sich in den
Einstellungen nirgends abschalten."*

**Jetzt:** In den Einstellungen gibt es die Karte „Erschwerniszuschläge“ mit
fünf Schaltern — Altbau, Denkmalschutz, bewohnter Zustand, schwieriger
Untergrund, Raumhöhe über 3 m. Was dort aus ist, **entsteht gar nicht erst
als Position**.

### Warum das eine Einstellung sein muss und keine Regel im Code

Ein Zuschlag ist keine technische Eigenschaft, sondern eine
Kalkulationsentscheidung. Ob „bewohnt“ Mehraufwand bedeutet, weiß der
Betrieb und nicht die App: Wer ausschließlich im Altbau arbeitet, hat den
Aufwand längst im Quadratmeterpreis — bei ihm ist der Zuschlag eine
Doppelberechnung, die er in jedem Angebot von Hand löscht. Das ist Handarbeit
gegen die eigene Software.

### Die Regel, die dabei am wichtigsten war

**Nichts eingestellt heißt: alles wie bisher.** `NULL` in der Datenbank
bedeutet „nie angefasst“ und lässt alle fünf an; ein fehlender Schlüssel
gilt ebenfalls als eingeschaltet. Ein Update darf niemandem still einen
Zuschlag wegnehmen, den er bisher bekommen hat — das wäre derselbe stille
Schaden wie die Preisfehler von gestern, nur in die andere Richtung.

### Gefiltert wird an EINER Stelle

Die Zuschläge entstehen an fünf Orten in drei Dateien, und der nächste
entsteht an einem sechsten. Statt einer Abfrage an jedem `push(...)` fallen
die abgeschalteten am **Ausgang** der Vollständigkeitsprüfung raus —
dieselbe Überlegung, die dort schon für die „vom Tool ergänzt“-Markierung
getroffen wurde („bewusst EINE zentrale Stelle statt eines Flags an ~117
Fundstellen“). Eine zentrale Filterung kann man nicht vergessen.

Dazu ein zweites Netz in `generiere-positionen`: Dort können Positionen aus
einem **Zwischenspeicher** kommen, der noch unter der alten Einstellung
entstanden ist. Ohne das taucht ein gerade abgeschalteter Zuschlag im
nächsten Angebot wieder auf, und der Betrieb hält die Einstellung für kaputt.

### Die Migration ist gelaufen — Sandy muss nichts tun

Ich hatte sie ihr zuerst als Hausaufgabe gegeben. Falsch: Der
Supabase-Zugang liegt in dieser Sitzung vor, und eine Spalte anzulegen ist
kein Handgriff, für den jemand eine SQL-Oberfläche aufmachen muss, der SQL
nicht liest.

`companies.erschwernis_config` steht jetzt in **Produktion und Staging**,
nachgeprüft über `information_schema`.

### Nebenbei repariert: der Migrations-Check war blind

`supabase/check_migrationen.sql` endete bei Nummer 56. Die **beiden
Migrationen vom 11.09.** (`zeige_rechenweg_auf_pdf`, `erkannter_kundenname`)
standen nicht darin, obwohl die README das ausdrücklich verlangt.

Das ist schlimmer als eine vergessene Zeile: **Ein Check, der eine Migration
nicht kennt, meldet sie auch nicht als fehlend.** Er sagt „allesgrün“ über
einen Stand, den er gar nicht geprüft hat. Beide sind nachgetragen (57, 58),
meine ist 59.

**Und der Verdacht hat sofort etwas gefunden.** Beim Nachsehen in beiden
Datenbanken:

| | Produktion | Staging |
|---|---|---|
| `quotes.zeige_rechenweg_auf_pdf` (11.09.) | ✅ | ❌ **fehlte** |
| `quotes.erkannter_kundenname` (11.09.) | ✅ | ✅ |
| `companies.erschwernis_config` (heute) | ✅ | ✅ |

Staging lief seit dem 11.09. ohne die Rechenweg-Spalte. Nichts ist deshalb
kaputtgegangen — aber ein Test auf Staging hätte das PDF-Verhalten nicht
geprüft, sondern nur den Fall „Spalte gibt es nicht“. Nachgezogen.

Genau dafür ist der Check da, und genau deshalb war seine Lücke teurer als
sie aussah.

*Head of Product Engineering · 2026-09-13*

---

## CoS-E-019 / TN-045 (+ CoS-E-032) — erledigt (13.09.2026)

Manfred: *„Gesprochener Ausführungstermin (‚in 3 Wochen fertig') wird
nirgends gespeichert, kein Feld dafür vorgesehen."*

Er sagt den Termin im selben Atemzug wie die Maße. Beim Kundennamen war es
dieselbe Geschichte (CoS-E-018): erkannt, gelesen, von niemandem angefasst.
Hier war es eine Stufe früher — es gab nicht einmal ein Feld.

### Der Weg, den die alte Notiz vorgeschlagen hatte, war nicht nötig

Im Ticket stand: *„braucht Prompt-Änderung + Edge-Deploy"*. Ich habe einen
**deterministischen Leser** gebaut (`src/lib/termin.ts`), aus zwei Gründen:

1. Ein Prompt-Feld braucht einen Deploy und ist danach nur so verlässlich
   wie das Modell an dem Tag. Der Leser ist prüfbar: 30 Sprechweisen, 30
   Testfälle, kein Deploy.
2. **Es gibt hier nichts zu verstehen.** „In drei Wochen" ist keine
   Bedeutungsfrage, sondern eine Schreibweise — dieselbe Art Aufgabe wie
   `zahlen-parser.ts` oder `extraktion-masse.ts`, und die sind aus genau
   diesem Grund deterministisch.

Kommt später doch ein KI-Feld dazu, hat es Vorrang und der Leser bleibt der
Rückfall — dasselbe Muster wie `baueVerstaendnis(transkript, signale)`.

### Die eigentliche Entscheidung: der Wortlaut, nicht das Datum

**„In drei Wochen" rechnet sich vom Tag des Diktats — nicht vom Tag, an dem
der Kunde zusagt.** Zwischen beiden liegen oft Wochen. Ein daraus
errechnetes Datum sähe aus wie eine Zusage und wäre keine.

Gespeichert wird deshalb, was er gesagt hat. Ein Datum kommt nur dazu, wenn
er eines GENANNT hat:

```
„in drei Wochen fertig"        →  Termin aus dem Diktat: „in drei Wochen"
„bis zum 30. Oktober bitte"    →  Termin aus dem Diktat: „Bis zum 30. Oktober" (30.10.2026)
```

Dieselbe Regel wie PM-018 beim Preis: lieber sichtbar eine Formulierung, die
der Handwerker selbst einordnet, als still ein Datum, das ihn festnagelt.

### Was erkannt wird

| Art | Beispiele |
|---|---|
| Datum | am 15. Oktober · bis zum 30.10. · ab 1.11. · am 15.3.2027 |
| Spanne | in drei Wochen · in 10 Tagen · in einem Monat · innerhalb von zwei Wochen |
| Ungefähr | Ende Oktober · nächste Woche · KW 42 · bis Freitag |

Ein Monat, der dieses Jahr schon vorbei ist, meint das nächste („am 15.
März", gesagt im September → 2027).

### Die andere Hälfte: was NICHT erkannt werden darf

Ein Termin, den niemand genannt hat, ist schlimmer als gar keiner — er sieht
aus wie eine Zusage. Der Test fährt deshalb acht echte Diktate voller Zahlen
und Maßangaben durch („drei Zimmer, insgesamt 120 Quadratmeter", „Treppenhaus
über 4 Etagen", „Fliesen bis 2 Meter Höhe") und verlangt: **nichts erkannt.**

### CoS-E-032 fällt dabei mit ab

Der Ticket-Text dort lautete: *„Feld ‚Interne Notiz' bleibt leer, obwohl
genau dort ein gesprochener Termin hingehört hätte."* Genau da steht er
jetzt — als Vorschlagskarte über dem Notizfeld, mit einem Tipp zum
Übernehmen.

**Bewusst nicht automatisch hineingeschrieben** und erst recht nicht ins
Kundendokument: Ein Termin ist eine Zusage, und die macht der Handwerker.
Dasselbe Prinzip wie beim Kundennamen — Entwurfsgenerator mit Prüfpflicht.

### Datenbank

`quotes.erkannter_termin` steht in **Produktion und Staging**; ich habe die
Migration in dieser Sitzung ausgeführt. Die Route fängt eine fehlende Spalte
trotzdem ab — dieselbe Vorsicht wie beim Kundennamen: Eine fehlende Spalte
darf nicht das Speichern der Extraktion selbst mitreißen.

`check_migrationen.sql` kennt sie als Nummer 60.

*Head of Product Engineering · 2026-09-13*

---

## Testlauf 13.09.2026 — vollständig grün

```
Test Files  122 passed (122)
     Tests  1942 passed (1942)
  Duration  31,40s
```

**Der erste vollständig grüne Lauf, seit der Zugriff auf Sandys Rechner weg
ist.** Gestern Abend standen 117 Dateien / 1752 Tests mit zwei roten
(eine Kopie im Ordner „Claude outputs“ und mein Katalog-Test im
5-Sekunden-Standardtimeout). Beides erledigt; dazu **190 neue Tests** aus der
heutigen Arbeit:

| | |
|---|---|
| `raum-zuordnung.test.ts` | 66 — 52 Raumnamen, Nicht-Räume, Grundierung je Raum |
| `katalog-standard.test.ts` | 36 — Standardzeilen, Festlegung schlägt Standard |
| `termin.test.ts` | 25 — was gesagt wurde, und was nicht erfunden werden darf |
| `alltagsbegriffe.test.ts` | 23 — findet ein Betrieb noch einen Preis? |
| `anstrichzahl.test.ts` | 19 — Umschalter liest dasselbe wie der Matcher |
| `katalog-staffeln.test.ts` | 19 — Sperrklinke auf 0 unerreichbaren Zeilen |
| `einheiten.test.ts` | 9 — jede Katalogeinheit wird richtig angezeigt |
| `erschwernis.test.ts` | 8 — abgeschaltet heißt weg, nichts eingestellt heißt alles |

Was der Lauf **nicht** beweist, damit es niemand verwechselt: Er prüft die
Logik, nicht das laufende Programm. G.3 — Manfreds zwei Szenarien in der
echten App — steht weiter aus und braucht einen Menschen vor dem Bildschirm.

*Head of Product Engineering · 2026-09-13*

<!-- ENDE DER DATEI -->`). Taucht beim Lesen noch Text NACH
dieser Markierung auf, ist das zweifelsfrei ein Speicherfehler — bitte
nicht selbst löschen, sondern dem Chief of Staff melden.

**Status-Zeichen:** ✅ erledigt & geprüft · 🟡 erledigt, noch nicht
nachgeprüft · ❌ offen · ⏳ wartet auf Vorbedingung.

---

## Übersicht

| ID | Thema | Status | Quelle |
|---|---|---|---|
| CoS-E-001 | Fortführung von CoS-013 (`chief-of-staff-todos.md`) — diese Datei selbst als struktureller Teil der Lösung | 🟡 umgesetzt (diese Datei existiert jetzt), Rest der Lösung (Git-Workflow für die verbleibende Kollisionsfläche CoS↔Engineering) bleibt offen | Sandys Auftrag „sofort fixen", 10.09.2026 | ❌ offen |

---

## CoS-E-001 — Diese Datei als struktureller Fix für CoS-013

**Datum:** 2026-09-10
**Auftrag:** Sandy, direkt — „das soll sofort von wem auch immer gefixt
werden", als Antwort auf den 8. Vorfall des Speicherfehlers.

**Was ich (Chief of Staff) umgesetzt habe:** Diese Datei angelegt, um die
Haupt-Kollisionsquelle (CoS ↔ Engineering in derselben Datei) zu
beseitigen — nach demselben Muster, das für Platform, Marketing, Legal und
Finance bereits funktioniert (dort ist der Speicherfehler nie aufgetreten).
`chief-of-staff-todos.md` bleibt als Archiv stehen, wird aber ab sofort
nicht mehr aktiv beschrieben.

**Was noch offen bleibt, ehrlich:** Diese Datei selbst könnte theoretisch
denselben Fehler bekommen, wenn CoS und Engineering exakt gleichzeitig
hineinschreiben — das strukturelle Risiko ist kleiner (nur noch zwei
Parteien statt vieler), aber nicht null. Die vollständige Lösung
(Git-Commits statt Direkt-Überschreiben für `docs/`-Änderungen) bräuchte
weiterhin, dass alle schreibenden Parteien denselben Workflow nutzen —
das kann ich nicht einseitig erzwingen. Kurzfristig reduziert diese Datei
das Risiko spürbar; sie behebt es nicht zu 100 %.

**Für Head of Product Engineering:** Bitte ab sofort neue Einträge hier
statt in `chief-of-staff-todos.md`. Offene Punkte von dort, die noch eine
Antwort von dir brauchen, verweise ich hier mit ihrer ursprünglichen ID,
sobald sie anstehen.

*Chief of Staff · 2026-09-10*

---

## Manfred-Feedback — Batch 1 (11.09.2026)

**Quelle:** `docs/testnutzer-notizen-manfred.md` — erster echter Testlauf
durch den simulierten Testnutzer (siehe `docs/team-organigramm.md`, Rolle
noch nachzutragen). Sandys Anweisung: alles außer der fachlichen
Extraktions-Korrektheit („Diktat → Positionen", die geht an den
Prüfmeister) an die jeweils zuständige Stelle verteilen, wirklich jeden
Punkt, nach Priorität sortiert. Wichtig: **nichts davon wurde real
versendet** — Manfred hat ausschließlich im Testkonto gearbeitet und
Status von Hand verändert, um Abläufe zu prüfen. Die Prioritäten unten
sind Produktrisiko-Einschätzungen, keine „ist schon passiert"-Meldungen.

Format: ID · TN-Referenz · Kurzbeschreibung · Priorität (hoch/mittel/
niedrig). Positiv-Meldungen sind ebenfalls aufgenommen, damit nichts beim
nächsten Umbau kaputtgeht.

| ID | TN-Ref | Thema | Prio | Status Engineering |
|---|---|---|---|---|
| CoS-E-002 | TN-005 | Mikro-Tippfehler navigierte in die Vorschau eines alten Angebots mit aktivem „Senden"-Knopf daneben | hoch | ❌ offen |
| CoS-E-003 | TN-006 | (positiv) Schalter „Rechenweg auf PDF zeigen?" kommt gut an | niedrig | ❌ offen |
| CoS-E-004 | TN-008 | 0,00-€-Position erscheint auf dem Kunden-PDF (Erschwerniszuschlag) | hoch | ✅ erledigt — Versand gesperrt, solange ein Preis fehlt (3 Tore) |
| CoS-E-005 | TN-009 | Internes Wort „Transkript" steht auf einer Position im Kunden-PDF | hoch | 🟡 erledigt — Annahmen raus, Live-Nachtest offen |
| CoS-E-006 | TN-011 | Rechnungssprache „Zahlungsziel: 14 Tage" auf einem ANGEBOT statt Gültigkeitsdauer | hoch | 🟡 erledigt — Zahlungsbedingungen statt Zahlungsziel |
| CoS-E-007 | TN-013 | **Zu klären, bitte zuerst:** Steht „Sofortangebot haftet nicht für fehlerhafte Berechnungen" nur in Manfreds eigener Vorschau oder auch auf dem Kunden-PDF? Bei „auch auf dem Kunden-PDF" sofort an Head of Legal weiterreichen | hoch | ✅ geklärt — nur Vorschau, NICHT auf dem Kunden-PDF |
| CoS-E-008 | TN-015 | Reiter „Angebot/Rechnung" unklar, Sorge um doppelte Rechnungsnummernkreise (siehe auch CoS-E-033/TN-086) | mittel | ✅ erledigt — Reiter entfernt (Sandy: „Rechnung erstmal raus") |
| CoS-E-009 | TN-016 | Interne Notiz „bitte prüfen" landet auf dem Kunden-PDF | hoch | 🟡 erledigt — gleiche Ursache wie CoS-E-005 |
| CoS-E-010 | TN-017 | Widerspruch auf dem PDF: „Fenster 0 m²" direkt neben „3 Öffnungen nicht abgezogen (4,29 m²)" | hoch | 🟡 erledigt — keine 0-Abzüge im Rechenweg mehr |
| CoS-E-011 | TN-018 | Tippfehler im Positionstitel landet unverändert auf dem PDF (gleiche Ursache wie CoS-E-020/TN-051) | mittel | ❌ offen |
| CoS-E-012 | TN-019 | PDF ohne zugewiesenen Kunden ist trotzdem sendbar, Feld bleibt leer | hoch | ✅ erledigt — gleiche Regel: ohne Kunde kein Versand |
| CoS-E-013 | TN-020 | Gültigkeitsdauer aus den Einstellungen (30 Tage) erscheint auf dem PDF nirgends (gleiche Familie wie TN-081/TN-100, siehe CoS-E-031/CoS-E-042) | hoch | 🟡 erledigt — „Gültig bis" wird gerechnet |
| CoS-E-014 | TN-021 | Ladeanimation „Aufmaß wird angelegt…" startet, bevor überhaupt gesprochen wurde | niedrig | ❌ offen |
| CoS-E-015 | TN-026 | „Satz aus Preisliste" bei Zuschlägen zeigt keine Zahl, anders als alle übrigen Positionen | mittel | ❌ offen |
| CoS-E-016 | TN-027/TN-028 | Abgebrochene „Neues Angebot"-Versuche hinterlassen leere Dauer-Entwürfe „Kunde offen" — zu klären, ob die gegen das Monats-Kontingent im Starter-Plan zählen | hoch | ❌ offen |
| CoS-E-017 | TN-030 | Getippte (nicht gesprochene) Notizen werden gar nicht verarbeitet — keine Meldung, einfach nichts | hoch | ❌ offen |
| CoS-E-018 | TN-044/TN-129 | Kunde wird trotz genannten Namens nicht verknüpft, „Kein Kunde zugewiesen" — in beiden Testszenarien identisch reproduziert, spricht für einen systematischen Bug | hoch | 🟡 erledigt — Migration liegt jetzt auf Staging + Produktion, Live-Nachtest offen |
| CoS-E-019 | TN-045 | Gesprochener Ausführungstermin („in 3 Wochen fertig") wird nirgends gespeichert, kein Feld dafür vorgesehen | mittel | ✅ 13.09. — deterministischer Leser statt Prompt-Änderung, kein Edge-Deploy nötig. Spalte `quotes.erkannter_termin`, Migration ausgeführt |
| CoS-E-020 | TN-051 | Leerzeichen verschwinden beim Umbenennen bestehender Positionen, 3× reproduziert, tritt nur im Bearbeiten-Pfad auf (nicht bei neuen Positionen) | hoch | ❌ offen |
| CoS-E-021 | TN-052 | Wechsel 1×→2× verlangt manuelles Ändern von Titel, Untertitel UND Preis statt eines Umschalters, obwohl die App den Preis kennt | mittel | ✅ 13.09. — Umschalter 1×/2×/3× im Bearbeiten-Panel; Titel, Untertitel und Preis in einem Griff, Preis aus der Preisdatenbank (nicht × 2) |
| CoS-E-022 | TN-053 | Neue Positionen landen immer unter „Allgemein", auch wenn sie eindeutig zu einem Raum gehören | mittel | ✅ 13.09. — drei Ursachen: Raum-Stichwortliste (31 von 52 Namen erkannt), Totalausfall der Gruppierung bei unbekannten Namen, und eine Deckengrundierung, die es bei mehreren Räumen nur EINMAL gab |
| CoS-E-023 | TN-054 | „Senden" ist aktiv, obwohl kein Kunde zugewiesen ist | hoch | ✅ erledigt — gleiche Regel |
| CoS-E-024 | TN-060 | Vorgeschlagene Einheit bei „Preis anlegen" war falsch (m² statt Stück bei „Heizkörper abkleben – 1 Stück") | mittel | ✅ 13.09. — Anzeigefehler: Die Auswahlliste kannte „Stk“, die Engine schreibt „Stück“. Ein `<select>` mit unbekanntem value zeigt die erste Option — m². Liste liegt jetzt in `src/lib/einheiten.ts` mit Test |
| CoS-E-025 | TN-063 | Drei verschiedene Angebotsnummer-Formate gleichzeitig sichtbar in der App | mittel | ❌ offen |
| CoS-E-026 | TN-064 | Deckenpositionen landen unter „Allgemein" statt beim zugehörigen Raum (siehe auch DC-091/TN-104) | mittel | ✅ 13.09. — drei Ursachen: Raum-Stichwortliste (31 von 52 Namen erkannt), Totalausfall der Gruppierung bei unbekannten Namen, und eine Deckengrundierung, die es bei mehreren Räumen nur EINMAL gab |
| CoS-E-027 | TN-066 | Nach „Abbrechen" im Bearbeiten-Modus springt der Status zurück auf grauen Punkt statt „Bereit" | mittel | ❌ offen |
| CoS-E-028 | TN-068/TN-069 | „+ Kunde" im Angebot bietet nur Suche, kein „Neu anlegen" — Umweg über anderes Menü nötig, betrifft laut Manfred rund 80 % seiner Angebote (Erstkunden) | hoch | 🟡 erledigt — „Neu anlegen" direkt im Angebot |
| CoS-E-029 | TN-071 | Erster Tipp auf „Kunde anlegen" reagiert nicht | mittel | ❌ offen |
| CoS-E-030 | TN-078 | WhatsApp-Versand zeigt „PDF wird vorbereitet…" ohne erkennbaren Abschluss nach 2 Sekunden | mittel | ❌ offen |
| CoS-E-031 | TN-081 | „Gültig bis" bleibt leer trotz 30-Tage-Standard in den Einstellungen (gleiche Familie wie CoS-E-013/CoS-E-042) | hoch | 🟡 erledigt — gleiche Ursache wie CoS-E-013 |
| CoS-E-032 | TN-083 | Feld „Interne Notiz" bleibt leer, obwohl genau dort ein gesprochener Termin hingehört hätte (siehe TN-045/CoS-E-019) | niedrig | ✅ 13.09. — mit CoS-E-019 erledigt: Der gehörte Termin steht als Vorschlag über der internen Notiz, ein Tipp übernimmt ihn |
| CoS-E-033 | TN-086 | Rechnungsnummer = Angebotsnummer, obwohl die Einstellungen getrennte Nummernkreise vorsehen | hoch | ✅ erledigt — mit dem Reiter weg; echter Nummernkreis erst mit echter Rechnung |
| CoS-E-034 | TN-088 | Interne Prüfhinweise und „bitte Angebot prüfen"-Fußzeile erscheinen auch auf der Rechnung, nicht nur auf dem Angebot | hoch | 🟡 teilweise — interne Hinweise raus, Rest an der Rechnungs-Entscheidung |
| CoS-E-035 | TN-090 | Ein Testangebot mit 0,00-€-Position wurde als „beauftragt/angenommen" markiert, ohne dass die fehlende Bepreisung vorher auffiel | hoch | ✅ erledigt — gleiche Regel; kann nicht mehr unbemerkt beauftragt werden |
| CoS-E-036 | TN-091 | Kein auffindbarer Weg, aus einem beauftragten Angebot eine Rechnung zu erzeugen | hoch | ✅ erledigt — hinfällig, es gibt keine Rechnung mehr zu erzeugen |
| CoS-E-037 | TN-092 | Preis-Matching findet einen vorhandenen Datenbankeintrag nicht, weil intern ein anderer Begriff verwendet wird als in der Preisdatenbank | hoch | ❌ offen — Vokabelfrage (Sperranstrich/Isoliergrund), bitte an den Prüfmeister |
| CoS-E-038 | TN-093/TN-094 | Angebotspreise weichen von der Preisdatenbank ab, uneinheitlich zwischen zwei Angeboten desselben Betriebs für dieselbe Position | hoch | ✅ erledigt — zwei reproduzierte Fehler behoben, an Manfreds echten Daten nachgestellt |
| CoS-E-039 | TN-095 | Preisdatenbank hat viele Dopplungen mit identischen Preisen unter leicht anderem Namen | mittel | ✅ 12.09. — **keine Dopplungen, sondern Staffeln**: 64 von 2379 Zeilen waren über ihren eigenen Namen unerreichbar und bekamen still den billigeren Preis. Jetzt 22, alle 22 durch ein Wort unterscheidbar → Entscheidungsliste für Manfred / Prüfmeister, siehe unten |
| CoS-E-040 | TN-097 | Erschwerniszuschläge „Altbau"/„bewohnt" lassen sich in den Einstellungen nirgends abschalten | mittel | ✅ 13.09. — Schalter je Zuschlagsart in den Einstellungen; abgeschaltete entstehen gar nicht erst. Migration in Produktion und Staging ausgeführt |
| CoS-E-041 | TN-098 | Kleinmaterial-Pauschale „automatisch ab 200 €" griff bei einem 1.700-€-Angebot nicht | hoch | ✅ erledigt — Pauschale war an einem toten Pfad, jetzt im echten Weg |
| CoS-E-042 | TN-100 | „Zahlungsziel" und „Gültigkeitsdauer" sind zwischen Einstellungen und PDF vertauscht (gleiche Familie wie CoS-E-013/CoS-E-031) | hoch | 🟡 erledigt — gleiche Ursache wie CoS-E-013 |
| CoS-E-043 | TN-105 | Regionaler Preisfaktor kennt Bochum/Ruhrgebiet nicht als Kategorie; zusätzlich Produktfrage, ob ein pauschaler Faktor über der eigenen Preisliste überhaupt sinnvoll ist (möglicher Zusammenhang mit CoS-E-038) | mittel | ❌ offen — Fund: der Faktor wird NIRGENDS gelesen; drei Wege zur Entscheidung, siehe Batch 4 |
| CoS-E-044 | TN-115 | Kein sichtbarer Status, ob/wann/was beim „Angebots-Nachfassen" passiert | mittel | ❌ offen |
| CoS-E-045 | TN-116 | Zwei Reiter zeigen unterschiedliche Flächenwerte für denselben Raum (einer leer, obwohl 53,2 m² längst berechnet) | hoch | ❌ offen |
| CoS-E-046 | TN-117 | „Unregelmäßig" öffnet den Grundriss-Editor mit Standardmaßen 4×3 statt den bereits erfassten Raummaßen | mittel | ❌ offen |
| CoS-E-047 | TN-119 | Grundriss-Editor akzeptiert keine halben Meter (weder Komma noch Punkt) — macht das laut Manfred beste Feature der App (TN-118) für echte Räume unbrauchbar | hoch | ❌ offen |

**Nicht als Ticket, aber wichtig für dich (Sandy) direkt:** TN-067 — Manfreds
ehrliches Fazit nach dem Bearbeiten-Test: „Beim dritten Angebot trau ich
dem ersten Wurf nicht mehr und lese jede Zeile — dann ist der Zeitgewinn
weg." Kein Einzelbug, sondern ein Vertrauens-/Produktrisiko-Signal, das
sich erst auflöst, wenn die Extraktions-Bugs (Prüfmeister-Seite) und die
Bugs oben zusammen spürbar weniger werden.

*Chief of Staff · 2026-09-11*

---

## Antwort Head of Product Engineering — Batch 1 (11.09.2026)

**Vorgehen:** Nicht CoS-E-002 bis CoS-E-047 der Reihe nach, sondern nach
Ursachen sortiert. Mehrere Tickets sind derselbe Fehler an derselben Stelle —
einzeln abgearbeitet hätte ich dieselbe Zeile viermal angefasst. Batch 1 ist
alles, was auf dem Papier steht, das der **Kunde** bekommt.

Stand: umgesetzt, Typecheck sauber, komplette Testsuite (105 Dateien) grün,
Lint ohne neue Fehler. Live-Nachtest steht aus.

---

### CoS-E-007 / TN-013 — GEKLÄRT, kein Fall für Legal ✅

Der Satz „Bitte Angebot vor dem Versand prüfen. Sofortangebot haftet nicht
für fehlerhafte Berechnungen" steht **ausschließlich in Manfreds eigener
Vorschau**, nicht auf dem Kunden-PDF.

Nachgeprüft: Der Satz sitzt in `src/components/AngebotVorschau.tsx` und dort
*außerhalb* des Dokument-Rahmens — er hängt unter der Vorschau-Karte, nicht
auf dem Blatt. Das echte PDF entsteht in einer anderen Datei
(`src/lib/pdf.tsx`) und kennt den Satz überhaupt nicht. Ein Test hält das
jetzt fest.

Damit entfällt die Weitergabe an Head of Legal.

---

### CoS-E-005 + CoS-E-009 + Teil von CoS-E-034 — eine Ursache ✅

TN-009 („Transkript"), TN-016 („bitte prüfen"), TN-088 (dasselbe auf der
Rechnung) sind **ein** Fehler, nicht drei.

**Ursache:** Jede Position trägt intern ein Feld `annahmen` — das ist die
Notiz an den *Handwerker* („Zweifacher Anstrich als Standard angenommen —
bitte prüfen", „Leitungsmeter nicht angegeben — bitte Menge manuell
anpassen", „… im Transkript erkannt"). Als am 10.09. der Rechenweg aufs
Kunden-PDF kam (DC-049/DC-050), rutschte dieses Feld direkt mit drauf. Der
Kunde las also Arbeitsanweisungen an den Betrieb.

**Fix:** `annahmen` erreicht das Kundendokument nicht mehr — weder im PDF noch
in der Vorschau. Bewusst nicht „den Block gelöscht", sondern die Trennung
hart gezogen: das interne Array wird gar nicht erst bis zur Anzeige
durchgereicht. Wer künftig einen Satz daraus aufs Kundenpapier bringen will,
muss ihn ausdrücklich einzeln herausziehen.

**Was bewusst bleibt:** Der Rechenweg selbst (die reine Rechnung). Der ist
laut CI-Handbuch das Beweisstück für den Kunden, und Manfred hat ihn in
TN-006 ausdrücklich gelobt.

**Nebenbefund, mitgefixt:** Der Übermessungs-Hinweis (VOB-004/Legal G5 — „3
Öffnungen bis 2,5 m² nicht abgezogen") stand im PDF, in der Vorschau aber
noch nie. Die Vorschau zeigte also weniger als das Blatt, das rausgeht.
Jetzt zeigen beide dasselbe, aus derselben Quelle.

---

### CoS-E-010 / TN-017 — „Fenster 0 m²" neben „nicht abgezogen" ✅

Beide Zahlen waren richtig. Die Null war die ehrliche Folge der
VOB-Übermessung: es *wurde* nichts abgezogen. Nur liest sich ein Abzug von
null wie ein übersehener Posten — Manfred: „Kunde sieht ‚Fenster 0' und
denkt, ich hab nicht hingeguckt."

**Fix:** Der Rechenweg nennt nur noch Abzüge, die es wirklich gibt. Kein
Abzug → der Rechenweg endet nach der Bruttofläche, und warum nichts
abgezogen wurde, steht weiterhin im Hinweis darunter (der ist für den Kunden
geschrieben). Eine gemeinsame Stelle für alle vier Fundorte statt vier
gleichlautender Textbauten.

---

### CoS-E-006 + CoS-E-013 + CoS-E-031 + CoS-E-042 — eine Ursachenfamilie ✅

Vier Tickets, ein Befund. Die Einstellung „Angebot gültig für 30 Tage" wurde
im Code zwar sauber aufgelöst — und dann **von niemandem benutzt**. Das
Dokument las ausschließlich das Feld `valid_until` am Angebot, und der Weg,
auf dem Angebote heute wirklich entstehen (der Aufnahme-Flow), setzt dieses
Feld überhaupt nicht. Ergebnis: keine Gültigkeitsdauer auf dem Papier, dafür
prominent im Kopf „Zahlungsziel: 14 Tage". Genau die Verwechslung, die
Manfred in TN-100 beschrieben hat.

**Fix:**
1. „Gültig bis" wird **gerechnet statt gelesen**: Dokumentdatum + eingestellte
   Tage. Bewusst gerechnet und nicht gespeichert — so erreicht es auch die
   rund 100 Angebote, die schon in der Datenbank liegen, und ein Entwurf, der
   drei Wochen liegen bleibt, bringt keine halb abgelaufene Frist mit.
   Ein von Hand gesetztes Datum (Zahnrad) schlägt die Rechnung weiterhin.
2. „Zahlungsziel" verschwindet aus dem Kopfblock des Angebots. Dort steht
   jetzt die Frist, die es auf einem Angebot wirklich gibt.
3. Die Zahlungsbedingungen bleiben im Text, aber als Bedingung formuliert:
   **„Zahlungsbedingungen: 14 Tage nach Rechnungserhalt ohne Abzug."**
   Auf einem Angebot gibt es noch keine Rechnung, ab der eine Frist laufen
   könnte. Auf der Rechnung bleibt die alte Formulierung.
4. Die alte Anlege-Route hatte 30 Tage fest verdrahtet — wer in den
   Einstellungen 14 eintrug, bekam trotzdem 30. Jetzt dieselbe Einstellung
   wie überall.

**Für Sandy, eine Frage:** Punkt 3 ist eine Formulierung auf deinem
Kundendokument. Ich hab die aus meiner Sicht fachlich richtige gewählt.
Sag Bescheid, wenn du sie anders willst — das ist ein Einzeiler.

---

### Was Batch 1 NICHT abdeckt — zwei Befunde, die eine Entscheidung brauchen

**1. CoS-E-018 / TN-044 / TN-129 — der gesprochene Kundenname (hoch).**
Ursache gefunden und sie ist eindeutig: Der Name **wird** aus dem Diktat
erkannt und sauber ausgelesen (Feld `kunde` mit Name, Adresse, Ort) — und
dann liest ihn **niemand mehr**. Er endet in einer Sackgasse. Deshalb hat
sich das bei Manfred zweimal identisch reproduziert; es ist kein
Erkennungsproblem, sondern eine nicht angeschlossene Leitung.

Dasselbe gilt für CoS-E-019 / TN-045 (Ausführungstermin): Da ist es noch
eine Stufe früher — nach einem Termin wird gar nicht erst gefragt, es gibt
kein Feld dafür.

Das hängt direkt an CoS-E-028 (TN-068: „+ Kunde" bietet nur Suche, kein
„Neu anlegen" — laut Manfred 80 % seiner Angebote sind Erstkunden). Beides
zusammen ist EIN Stück Arbeit: der gesprochene Name kommt am Kundenfeld an,
als Vorschlag mit einem Tipp zum Bestätigen.

Meine Empfehlung, passend zur Produktphilosophie: **vorschlagen, nicht
anlegen.** Ein verhörter Name („Krüger"/„Grüger") darf nicht still einen
Kundendatensatz erzeugen. Steht als Batch 2 an.

**2. CoS-E-008 + CoS-E-033 + CoS-E-036 (+ TN-087/TN-089) — „Rechnung" ist
heute kein Dokument.** Der Reiter „Angebot/Rechnung" in der Vorschau ist
reine Anzeige: er tauscht zwei Wörter aus und zeigt dasselbe Blatt. Es wird
keine Rechnungsnummer gezogen (obwohl der getrennte Nummernkreis in den
Einstellungen existiert und die Datenbank ihn könnte), nichts gespeichert,
und es gibt folgerichtig auch keinen Weg vom beauftragten Angebot zur
Rechnung. Deshalb steht auf der „Rechnung" auch die Unterschriftszeile und
der Angebots-Schlusstext.

Das ist keine Bugliste, das ist eine **Produktentscheidung** — und sie hat
eine Größe, die ich nicht einseitig treffen will. Manfred sagt selbst: „Wär
gut, aber ich hab lexoffice. Zwei Rechnungsnummernkreise darf's nicht
geben." Drei mögliche Wege, kurz:

- **A — Reiter raus.** Sofortangebot macht Angebote, Rechnungen macht die
  Buchhaltung. Kleinster Eingriff, löst CoS-E-008/033/036 ehrlich auf,
  nimmt aber ein Versprechen weg, das die App gerade macht.
- **B — Rechnung richtig bauen.** Eigener Nummernkreis, eigenes Layout,
  Leistungsdatum, Steuernummer, Knopf „Rechnung erstellen". Das ist ein
  eigenes Vorhaben, kein Fix — und ein gutes Stück davon (Buchhaltung,
  Nummernkreise) liegt ohnehin bei Platform & Integrations, nicht bei mir.
- **C — dazwischen:** Reiter bleibt, wird aber als das beschriftet, was er
  ist (eine Vorschau „so sähe die Rechnung aus"), plus Export in die
  Buchhaltung. Löst Manfreds Sorge um doppelte Nummernkreise, ohne ein
  Rechnungsmodul zu bauen.

Ich mach hier nichts, bis du entschieden hast.

*Head of Product Engineering · 2026-09-11*

---

## Antwort Head of Product Engineering — Batch 2 (11.09.2026)

**Thema:** Der Kunde aus dem Diktat. CoS-E-018 (TN-044/TN-129) und
CoS-E-028 (TN-068/TN-069) gehören zusammen — beide enden am selben Feld.

Stand: umgesetzt, Typecheck sauber, Testsuite (105 Dateien) grün, Lint ohne
neue Fehler. **Eine Migration ist noch nicht auf der Datenbank** — siehe
unten, das ist der einzige offene Handgriff.

---

### CoS-E-018 / TN-044 / TN-129 — der gesprochene Kundenname ✅

**Ursache, eindeutig:** Kein Erkennungsproblem. Der Name **wird** sauber
ausgelesen — GPT wird ausdrücklich danach gefragt, die Antwort wird
normalisiert und landet als Feld `kunde` (Name, Adresse, Ort) im Ergebnis.
Danach liest ihn **niemand mehr**. Er endete in einer Sackgasse. Deshalb hat
es sich bei Manfred zweimal identisch reproduziert: es ist kein
Wahrscheinlichkeitsproblem, sondern eine nicht angeschlossene Leitung.

**Fix:** Der gehörte Name wird jetzt ans Angebot geheftet — als **Vorschlag**.
In der Kundenkarte steht er unter „Aus der Aufnahme gehört" mit zwei Knöpfen:
*Übernehmen* und *Anderer Kunde*.

**Warum nicht einfach automatisch zuweisen** — das ist die eigentliche
Entscheidung hier: Ein verhörter Name („Krüger"/„Grüger") würde still einen
echten Kundendatensatz anlegen, den danach niemand mehr findet oder
aufräumt. Und weil bei Manfred rund 80 % der Angebote Erstkunden sind,
passiert genau das nicht selten, sondern fast immer. Sofortangebot ist ein
Entwurfsgenerator mit Prüfpflicht — der Name ist ein Vorschlag, den der
Handwerker mit einem Tipp bestätigt. Erst dann entsteht ein Kunde.

Zwei Regeln, die das absichern und die per Test festgehalten sind:
- Der Vorschlag wird nur geschrieben, solange das Angebot **keinen** Kunden
  hat. Hat der Handwerker schon zugewiesen, spielt ihm kein späterer Lauf
  einen alten Vorschlag zurück.
- Leerzeichen oder nichts Gehörtes erzeugen keinen Vorschlag.

---

### CoS-E-028 / TN-068 — „Neu anlegen" fehlt im Angebot ✅

Manfreds Beobachtung stimmt exakt: „+ Kunde" öffnete nur eine Suche. Wer
nicht gefunden wurde, war von hier aus nicht anzulegen — Umweg über das
Kunden-Menü und zurück. Bei 80 % Erstkunden ist das der Normalfall, nicht
die Ausnahme.

**Fix:** In der Suche steht jetzt — **unter** den Treffern, damit niemand
einen vorhandenen Kunden doppelt anlegt — ein Knopf
„+ „Krüger" als neuen Kunden anlegen". Danach läuft exakt derselbe Weg wie
bei jeder anderen Zuweisung, inklusive automatischer Erstbaustelle
(CoS-012/DC-029). Kein zweiter Pfad, der auseinanderlaufen könnte.

Bewusst nur der Name, kein Formular: Adresse, Telefon und Mail stehen beim
Anruf oft noch gar nicht fest, und ein Pflichtformular an dieser Stelle wäre
wieder ein Umweg. Der Kunde existiert danach und lässt sich in Ruhe
vervollständigen (TN-070 lobt das Kundenformular ausdrücklich) — wichtig ist
der Weg **zurück ins Angebot**.

Zusammen greifen die beiden: „Übernehmen" öffnet die Suche mit dem gehörten
Namen. Gibt es den Kunden schon (Manfreds TN-069: „Lina" → Lina Meier),
steht er als Treffer da. Gibt es ihn nicht (Krüger, Yilmaz), steht der
Anlegen-Knopf darunter. Ein Tipp hin, ein Tipp fertig.

---

### ⚠️ Offener Handgriff: eine Migration muss noch auf die Datenbank

`supabase/migrations/20260911160000_erkannter_kundenname.sql` — eine neue,
leere Spalte `quotes.erkannter_kundenname` (TEXT, nullable, **kein**
Backfill, additiv). Solange sie fehlt, ist das Verhalten exakt wie vorher:
Die Route merkt, dass die Spalte nicht da ist, lässt das Feld weg und
speichert den Rest normal — **nichts geht kaputt**, der Vorschlag erscheint
nur noch nicht. Dieselbe Vorsicht wie bei `baustelle_id`/`share_token`.

Warum eine eigene Spalte und nicht eines der vorhandenen JSON-Felder —
geprüft und verworfen, steht ausführlich in der Migration:
`extraktion_final` enthält den Namen zwar, ist aber ausdrücklich ein
**Logging**-Feld; wer die Logs eines Tages ausdünnt, bräche still die
Kundenzuweisung. Die beiden Extraktions-Caches dürfen per Entwurf lückenhaft
sein.

Das Anwenden auf Staging/Produktion ist ein Deployment-Schritt. **Sandy, sag
mir, ob ich sie anwenden soll** — oder ob das über Platform & Integrations
laufen soll. Ich rühre die Produktionsdatenbank nicht ohne dein Wort an.

---

### CoS-E-019 / TN-045 — Ausführungstermin: eine Stufe früher ❌

Beim Kundennamen war die Leitung nicht angeschlossen. Beim Termin gibt es
die Leitung gar nicht: Nach einem Termin („in drei Wochen fertig") wird GPT
überhaupt nicht gefragt, es existiert kein Feld dafür. Manfred hat das
richtig beobachtet — es wird nicht verschluckt, es wird nie erhoben.

Das zu ändern heißt, den Extraktions-Prompt zu erweitern, und der lebt in
einer Edge Function, die **deployt** werden muss. Das ist ein anderer
Handgriff als ein App-Release und ich lege ihn deshalb nicht einfach dazu.
Steht als eigener Punkt an, gebündelt mit CoS-E-032 (TN-083, interne Notiz
bleibt leer) — beide wollen dasselbe: gesprochene Nebeninformationen sollen
irgendwo landen statt zu verpuffen.

*Head of Product Engineering · 2026-09-11*

---

## Antwort Head of Product Engineering — Rechnung raus + Migration (11.09.2026)

**Sandys Entscheidungen, beide heute:** „rechnung erstmal raus… wird aber
eventuell auch nochmal geändert" und „du darfst migration machen".

---

### CoS-E-008 + CoS-E-033 + CoS-E-036 (+ TN-087/TN-089) — Rechnung raus ✅

Der Umschalter „Angebot/Rechnung" in der Vorschau ist entfernt. Er hat nie
eine Rechnung erzeugt: Er tauschte zwei Überschriften aus und zeigte
dasselbe Blatt — dieselbe Nummer (daher TN-086 „Rechnungsnummer =
Angebotsnummer"), dieselbe Unterschriftszeile (TN-087), denselben
Angebots-Schlusstext, ohne Leistungsdatum und Steuernummer (TN-089). Und
weil es keine Rechnung gab, gab es folgerichtig auch keinen Weg vom
beauftragten Angebot zu einer (TN-091).

**Entfernt statt umbeschriftet.** Ein Reiter, der eine Rechnung verspricht,
kostet genau das Vertrauen, um das es in TN-067 geht („beim dritten Angebot
trau ich dem ersten Wurf nicht mehr"). Und Manfreds Sorge war berechtigt:
„Zwei Rechnungsnummernkreise darf's nicht geben."

**Auch der Modus im Code ist weg**, nicht nur der Knopf. Ein stillgelegter
Pfad, den niemand mehr erreicht, ist in diesem Projekt schon zweimal teuer
geworden (PM-010 toter Code, CoS-020 toter Filter). Sandy sagt, das Thema
kommt eventuell wieder — dann aber als echte Rechnung, nicht als
wiederbelebter Zwei-Wörter-Tausch.

**Was eine echte Rechnung später bräuchte** (damit es nicht neu erhoben
werden muss, wenn das Thema zurückkommt):
1. Eigener Nummernkreis. Die Datenbank kann das längst — die Tabelle und die
   Vergabe-Funktion kennen `typ = 'rechnung'`, und die Einstellungen zeigen
   den Kreis schon an. Es zieht nur niemand daraus: `api/quotes/[id]/nummer`
   fragt fest nach `'angebot'`.
2. Eigenes Layout: **keine** Unterschriftszeile, Rechnungs-Schlusstext statt
   „Wir freuen uns auf Ihre Auftragserteilung", Fälligkeit statt Gültigkeit.
3. **Leistungsdatum und Steuernummer/USt-IdNr.** — Manfred in TN-089: ohne
   die kriegt sein Kunde Ärger beim Finanzamt und ruft ihn an. Das sind
   Pflichtangaben nach § 14 UStG, keine Kür.
4. Ein Zustandsübergang „beauftragt → Rechnung erstellt", damit aus einem
   Angebot genau eine Rechnung wird und nicht bei jedem Klick eine neue.

Punkte 1 und 4 berühren Nummernkreise und Buchhaltung und gehören damit
mindestens zur Hälfte zu Platform & Integrations.

---

### ⚠️ Querfund beim Aufräumen — gehört Platform, nicht mir

Ich habe danach geprüft, ob noch woanders eine „Rechnung" verspricht, was es
nicht gibt. Ein Fund, und er ist ernster als der Reiter:

Der **ZUGFeRD/XRechnung-Export deklariert ein Angebot als Rechnung.**
`src/lib/zugferd/generateXML.ts` setzt fest `TypeCode 380` — das ist in der
Norm die *Handelsrechnung*. Erreichbar über „XRechnung XML" im
Angebots-Menü. Das erzeugte XML behauptet gegenüber dem Empfängersystem, ein
steuerlich wirksames Rechnungsdokument zu sein, mit der Angebotsnummer als
Rechnungsnummer. Bei einem öffentlichen Auftraggeber läuft das in die
Rechnungseingangsprüfung.

**Nicht angefasst.** E-Rechnung/ZUGFeRD/Buchhaltung ist laut Rollen-Split
(CoS-009) Platform & Integrations. Eingetragen als **EX-003** in
`docs/engineering-austausch.md`, mit Einordnung und zwei möglichen Wegen.

Ebenfalls dort vermerkt und bewusst stehen gelassen: Die Einstellungen
zeigen weiterhin einen Nummernkreis „Rechnungen", aus dem niemand zieht.
Inert, aber sichtbar. **Sandy, wenn du willst, dass der auch verschwindet,
sag einmal Bescheid** — ich wollte an den Einstellungen nicht einseitig
herumräumen.

---

### CoS-E-018 — Migration ist angewendet ✅

`quotes.erkannter_kundenname` liegt jetzt auf **Staging und Produktion**
(nachgeprüft: TEXT, nullable). Damit ist der Vorschlag aus Batch 2 scharf:
Der im Diktat genannte Kundenname landet ab dem nächsten Entwurf in der
Kundenkarte, mit einem Tipp zum Übernehmen.

Additiv, kein Backfill — bestehende Angebote bleiben leer und verhalten sich
wie bisher.

*Head of Product Engineering · 2026-09-11*

---

## Antwort Head of Product Engineering — Batch 3 (11.09.2026)

**Thema:** Was zwischen einem halbfertigen Angebot und dem Kunden steht.
Fünf Tickets, zwei Ursachen.

Stand: umgesetzt, Typecheck sauber, Testsuite (105 Dateien + 2 neue) grün,
Lint ohne neue Fehler. Live-Nachtest steht aus.

---

### CoS-E-004 + CoS-E-012 + CoS-E-023 + CoS-E-035 — gewarnt wurde, gehindert nicht ✅

Vier Meldungen, ein Befund. Die App hat **überall** gewarnt: roter Kasten
„Bei 2 Positionen fehlen noch Preise", ein „Preis fehlt"-Vermerk an der
Position, ein leerer Empfängerblock im PDF. Nur **gehindert hat niemand.**

Deshalb konnte passieren, was Manfred in TN-090 beschreibt: Ein Angebot mit
„Boden schützen 0,00 €" ging raus **und** wurde als beauftragt markiert, ohne
dass es jemandem auffiel. Und „Senden" war aktiv ohne zugewiesenen Kunden
(TN-054), das PDF mit leerem Empfänger versendbar (TN-019).

Eine Warnung, die man wegklicken kann, ist bei einem Dokument, das der Kunde
als verbindliches Angebot liest, keine Sicherung. Sie verschiebt die
Verantwortung nur auf den müden Donnerstagabend.

**Fix — eine Regel, drei Tore:**
1. **Fertigstellen** ist gesperrt, solange ein Kunde oder ein Preis fehlt.
   Der Knopf sagt im Tooltip, was fehlt.
2. **Der Versand-Dialog** zeigt die Gründe als Liste und sperrt alle drei
   Wege (E-Mail, WhatsApp, Link). Die **Vorschau bleibt offen** — der
   Handwerker muss sein Angebot ansehen dürfen, gerade wenn noch was fehlt;
   er soll ja sehen, wo. Der Buchhaltungs-Export bleibt ebenfalls frei, der
   geht nicht an den Kunden.
3. **Die Versand-Route auf dem Server** prüft dasselbe noch einmal. Das ist
   die eigentliche Sicherung: Ein gesperrter Knopf ist eine Bitte, kein
   Riegel. Alle drei Versandwege laufen durch diese eine Route, deshalb
   genügt dort ein Riegel — und jeder künftige Versandweg erbt ihn.

Alle drei fragen dieselbe Stelle (`src/lib/versandbereit.ts`), damit sie
nicht auseinanderlaufen können.

**Was bewusst NICHT passiert:** Die unbepreiste Position stillschweigend
weglassen. Dann verschwände die Arbeit aus dem Angebot, und der Handwerker
führte sie aus, ohne sie berechnet zu haben — schlimmer als die 0,00-€-Zeile.
Die App sagt nur, dass es ohne nicht weitergeht, und welche Position es
betrifft.

**Eine Feinheit, die wichtig ist:** Eine 0,00-€-Position gilt nur dann als
Fehler, wenn ihr **kein Eintrag aus der Preisdatenbank** zugeordnet ist. Ein
Handwerker darf etwas bewusst mit 0 € anbieten („mach ich mit") — dann hängt
die Zeile an einem echten Preiseintrag und ist eine Entscheidung, kein Loch.
Genau dieselbe Bedingung, die die Bearbeiten-Ansicht seit jeher für ihren
roten Kasten benutzt.

---

### CoS-E-041 / TN-098 — Kleinmaterial-Pauschale: dritter toter Pfad heute ✅

Manfred: „Kleinmaterial-Pauschale stand auf ‚automatisch ab 200 €'. In meinem
1.700-€-Angebot war sie nicht drin. Warum nicht?"

**Weil sie nie irgendwo eingehängt war.** Die Regel gibt es, die Einstellung
gibt es, beide rechnen richtig — aufgerufen wurden sie nur aus der Route
`api/angebot-verfeinern`, und **diese Route ruft niemand auf.** Toter Pfad.

Dieselbe Klasse wie der Kundenname (CoS-E-018) und, davor, der
Mindestauftragswert: nicht falsch gerechnet, sondern gar nicht erst gefragt.
Das ist heute der dritte Fund dieser Art — es lohnt sich, künftig bei jeder
neuen Einstellung einmal nachzusehen, wer sie eigentlich liest.

**Mit betroffen: die An-/Abfahrt-Pauschale.** Manfred notiert in TN-106
„An-/Abfahrt automatisch – gut, war aus". Sie war nicht aus, sie war
unerreichbar.

**Fix:** Beide hängen jetzt im echten Weg (dort, wo auch der
Mindestauftragswert entsteht), nach demselben Muster: eigene benannte Zeile,
gefahrlos wiederholbar — anlegen, nachziehen wenn der Auftrag wächst, wieder
entfernen wenn der Grund entfällt.

**Ein Fehler, den ich dabei fast eingebaut hätte** (steht so auch im Code):
Die drei Pauschalen dürfen **nicht in die Bemessungsgrundlage der jeweils
anderen** zählen. Sonst hebt die Kleinmaterial-Pauschale die Summe über den
Mindestauftragswert, dessen Zeile schrumpft beim nächsten Durchlauf, die
Summe fällt wieder — und der Handwerker sieht bei jedem Neuberechnen andere
Zahlen, ohne etwas geändert zu haben. Für die Mindestauftragszeile war das
schon bedacht; mit zwei weiteren Pauschalen braucht es eine gemeinsame
Erkennung.

Die wurde bewusst als **exakter Namensvergleich** gebaut, nicht als
„enthält 'anfahrt'": Die Mindestauftragszeile heißt „Anfahrt & Vorbereitung",
die Fahrtkosten-Pauschale „An- und Abfahrt". Eine Teilstring-Suche hätte
beide über einen Kamm geschoren — und eine echte Arbeitsposition
„Anfahrtsweg absichern" gleich mit.

**Und die Angebotssumme** wird jetzt aus dem tatsächlichen Stand der
Positionen gelesen statt nachgerechnet. Mit drei Pauschalzeilen, die je nach
Lage entstehen, wachsen oder verschwinden, wäre eine Handrechnung genau die
Stelle, an der Summe und Positionsliste auseinanderlaufen — und das fällt
erst dem Kunden auf.

---

### Nebenbei geklärt: CoS-E-008 Nachtrag — Nummernkreis „Rechnungen" ✅

Auf Sandys „ja weg": Der zweite Reiter in den Nummern-Einstellungen ist raus.
Aus ihm hat nie jemand eine Nummer gezogen, aber er hat Manfred genau den
falschen Schluss nahegelegt (TN-015: „Zwei Rechnungsnummernkreise darf's
nicht geben"). Ein Einstellungsfeld, das etwas verspricht, was das Produkt
nicht tut, ist schlimmer als ein fehlendes.

Die Zeile in der Datenbank bleibt unangetastet — sie schadet nicht, kostet
nichts, und wenn eine echte Rechnung kommt, fängt sie genau dort an.

*Head of Product Engineering · 2026-09-11*

---

## Antwort Head of Product Engineering — Batch 4 (11.09.2026)

**Manfreds Prio 4: „Preise kommen nicht aus meiner Preisliste"** (TN-092,
TN-093, TN-094). Das ist mein Kerngebiet, deshalb habe ich nicht vermutet,
sondern **an seinen echten Daten nachgestellt** — Katalogzeilen und
Angebotszeilen direkt aus der Produktionsdatenbank geholt und den echten
Matcher darauf laufen lassen, bevor ich eine Zeile geändert habe. Dieselbe
Methode wie beim Preisdatenbank-Audit im August.

Stand: umgesetzt, Typecheck sauber, alle 105 Testdateien grün, Lint 0 Fehler.
Live-Nachtest steht aus.

---

### Was ich gefunden habe

Manfreds Verdacht war „die Preise werden ausgewürfelt". Er hatte recht, dass
etwas systematisch falsch ist — aber es war kein Zufall, sondern **zwei
saubere, reproduzierbare Fehler.** Beide ließen sich auf den Cent nachstellen.

**Fehler 1 — die Anstrichzahl fiel hinten runter (CoS-E-038 / TN-093).**

In seinem Angebot stand „Deckenfläche streichen — 2× Anstrich — **7,00 €**".
7,00 € ist in seinem Katalog der Preis für **1x**. Also genau das, was seit
dem 24.08. per Regel ausgeschlossen sein sollte: *Ein 2x-Auftrag bekommt nie
einen 1x-Preis.*

Die Regel war nicht kaputt — sie kam nie zum Zug. Der Matcher schneidet
jeden Titel am Gedankenstrich ab, weil dort normalerweise der Raum steht
(„… — Wohnzimmer"). Bei dieser Position stand hinter dem Strich aber die
Anstrichzahl. Gesucht wurde also nach „Decke streichen" ohne jede Variante,
die Sperre hatte nichts zu vergleichen, und unter 1x/2x/3x gewann der
alphabetisch erste — 1x.

*Fix:* Die Anstrichzahl wird jetzt am **ganzen Titel** gelesen, nicht am
abgeschnittenen. Genau so, wie es für die Qualitätsstufe (Q2/Q3) seit dem
04.09. schon festgelegt war und im Code begründet steht: **Sie ist ein
Filter, kein Textmerkmal.** Wo im Titel sie steht, darf nicht darüber
entscheiden, ob sie gilt.

**Fehler 2 — „Kniestockwände" schlug „Wand" (CoS-E-038 / TN-094).**

Nachgestellt: „Wandflächen streichen 2x" traf **„Kniestockwände streichen 2x"
(11,50 €)** statt „Wand streichen 2x Anstrich" (9,50 €). Das erklärt Manfreds
9,50 hier / 11,50 dort.

Der Grund ist fies: Nach der internen Vereinheitlichung heißt die gesuchte
Position „flaeche streichen 2x" und der Kniestock-Eintrag
„kniestock**flaeche streichen 2x**" — er *enthält* den gesuchten Text, aber
mitten im Wort. Dafür gab es pauschal die Bestnote, dieselbe wie für den
richtigen Eintrag. Bei Gleichstand entschied die Sortierung, also K vor W.

*Fix:* Ein Treffer an der Wortgrenze zählt jetzt mehr als einer im
Wortinneren. Damit gewinnt „Wand streichen 2x" klar.

**Ein Zwischenschritt, den ich wieder zurückgenommen habe — gehört dazu:**
Mein erster Versuch war strenger: Treffer im Wortinneren gar nicht mehr
zählen. Das hat **13 bestehende Tests gerissen**, und die hatten recht. Im
Deutschen ist die Zusammensetzung der Normalfall: „fein**spachteln**" enthält
„spachteln" mitten im Wort und meint dieselbe Arbeit. Ein Treffer im
Wortinneren ist also nicht falsch — nur schwächer. Genau diese Abstufung
hatte gefehlt. Die Tests haben mich vor einem Fix bewahrt, der schlimmer
gewesen wäre als der Fehler.

Dasselbe bei einer zweiten Idee: „Bei Gleichstand mit verschiedenen Preisen
lieber gar keinen Preis." Klingt sauber, riss aber die Anstrich-Familie —
fragt die Engine ohne Anstrichzahl, stehen 1x/2x/3x naturgemäß gleichauf mit
verschiedenen Preisen. Auch zurückgenommen.

---

### Was damit NICHT gelöst ist — ehrlich

**CoS-E-037 / TN-092 (Nikotinsperre) bleibt offen.** Manfreds Diagnose stimmt
wörtlich: „Der Preis fehlt nicht, sie hat ihn nur nicht gefunden, weil sie
sich ein anderes Wort ausgedacht hat." Die Engine erzeugt „Sperranstrich",
der Katalog kennt „Nikotinsperre auftragen" und „Isoliergrund gegen Nikotin /
Ruß / Wasserflecken" (beide 9,00 €). Zwischen den Wörtern gibt es keine
Verbindung.

Das ist **keine Matcher-Logik, sondern eine Vokabelfrage** — und ob
„Sperranstrich", „Isoliergrund" und „Nikotinsperre" fachlich dieselbe
Leistung sind, entscheide ich nicht im Alleingang. **Bitte einmal an den
Prüfmeister**; sobald die Antwort da ist, ist es ein Dreizeiler.

Der systematische Weg dahinter ist derselbe wie im August: alle von der
Engine erzeugbaren Positionstitel gegen den echten Katalog simulieren und die
Lücken einsammeln. Das ist ein eigener Durchgang und lohnt sich erst nach
diesen Fixes, weil sie das Ergebnis verschieben.

**CoS-E-039 / TN-095 (Doppeleinträge) bleibt offen.** Zwei echte Doppel mit
verschiedenen Preisen liefern weiterhin still einen davon. Die Antwort darauf
ist, den Katalog aufzuräumen — nicht, den Matcher raten zu lassen. Manfred
sagt es selbst: „222 Positionen, davon gefühlt ein Drittel Varianten. Ich
brauch 40."

**CoS-E-043 / TN-105 — und hier ein Fund, der dich betrifft, Sandy:**
Manfred vermutet, der regionale Preisfaktor sei die Ursache für die falschen
Preise („Vielleicht der Grund für TN-093/094"). Ist er nicht — aber aus einem
Grund, der eigenständig zählt: **Der regionale Preisfaktor wird nirgends
gelesen.** Die Einstellung lässt sich setzen und speichern, und danach
passiert nichts. Kein Angebot hat je einen Faktor auf den Preis bekommen.

Das ist heute der **vierte** Fund dieser Art — nach dem Kundennamen
(CoS-E-018), der Kleinmaterial-/Anfahrt-Pauschale (CoS-E-041) und dem
Mindestauftragswert (07.09.). Es zieht sich, und es hat ein Muster: eine
Einstellung wird gebaut, die Oberfläche verspricht etwas, und niemand prüft,
wer den Wert eigentlich liest. Ich nehme das ab sofort in meine eigene
Routine auf: bei jeder Einstellung einmal nachsehen, wer sie liest.

Für den Faktor selbst braucht es aber deine Entscheidung, weil Manfreds
zweite Frage die bessere ist: *„Wenn ich meine Preisliste pflege, warum noch
ein Faktor drauf?"* Drei Wege:
- **A — Einstellung raus.** Wer seine eigenen Preise pflegt, hat den Aufschlag
  schon drin. Kleinster Eingriff, und er nimmt nichts weg, was heute wirkt.
- **B — Faktor wirklich anschließen.** Dann muss er aufs Kundendokument
  sichtbar werden (sonst ist das Aufmaß nicht nachrechenbar — dieselbe
  Begründung wie beim Mindestauftragswert), und Bochum/Ruhrgebiet fehlt als
  Kategorie.
- **C — Nur für den Erstbefüllungs-Katalog.** Der Faktor formt die
  Standardpreise beim Onboarding, danach gehört die Liste dem Betrieb. Das
  passt am ehesten zu Manfreds Einwand.

Meine Empfehlung ist **C**, mit **A** als ehrlicher Alternative. **B** würde
ich nicht empfehlen: ein stiller Aufschlag über der eigenen Preisliste ist
genau die Sorte Zahl, für die am Ende der Handwerker geradesteht, ohne sie
bewusst gewählt zu haben.

*Head of Product Engineering · 2026-09-11*


---

## Aufwandswörter gebaut (12.09.2026)

Punkt 1 und 3 der Prüfmeister-Liste sind gebaut und gemessen. Vollständige
Begründung in `docs/vokabular-abgleich.md`, Abschnitt H. Kurz:

**Was jetzt nicht mehr passiert.** Ein Arbeitsgang kann nicht mehr still aus
einem Angebot verschwinden oder still hineinrutschen. `Parkett schleifen` bekam
bis heute den Preis für `Parkett schleifen + versiegeln komplett` (38,00 €) —
in einem Angebot, das die Versiegelung ohnehin schon als zwei eigene Zeilen
führt. Doppelt berechnet, und auf dem Kundenpapier stand eine Lackversiegelung,
obwohl im Transkript „ölen" steht. Der Betrieb schuldet, was auf dem Papier
steht.

**Die Zahl „ohne Preis" steigt von 29 auf 31, und das ist die gewollte
Richtung.** Beide neuen Null-Positionen (Ausgleichsmasse bis 10 mm und bis
30 mm) trugen vorher still den Preis für „bis 3 mm". Jetzt stehen sie sichtbar
auf 0,00 € mit Versandsperre, bis der Betrieb den Preis einträgt — PM-018,
*„lieber sichtbar kein Preis als still der falsche"*. Fünf andere Positionen
haben den richtigen Preis bekommen, darunter Manfreds verklebter Teppich
(6,00 € → 9,00 €).

**Drei Fehler, die die Messung nicht gezeigt hat.** `\b` kennt in JavaScript
keine Umlaute, ein verlorenes `u`-Flag schaltet Unicode-Grenzen still ab, und
der Katalog schreibt „Schleifgang" mit a statt mit ä. Alle drei ließen die
Regel wirkungslos oder schädlich laufen, ohne dass die Summen sich auffällig
verhielten. Gefunden nur durch den Zeilenvergleich „mit Regel gegen ohne
Regel". **Eine Filterregel, die nicht greift, ist in der Messung nicht von
einer zu unterscheiden, die greift und nichts findet.**

**Ein fünfter toter Pfad.** Beim Umbenennen von `Parkett schleifen` →
`Parkett abschleifen (2 Schleifgänge)` lieferte eine Flächenermittlung in
`boden-sonder.ts` wortlos `null`, weil sie den alten Titel als stillen Vertrag
las — Versiegelung und Verkitten rutschten aus dem Angebot in die Fehlt-Liste.
Neue Routine, neben „wer LIEST diese Einstellung": **Wer einen Engine-Titel
ändert, sucht vorher nach Stellen, die ihn lesen.**

**Eine Abweichung vom Papier, bewusst.** Die Verlegeart (verklebt / schwimmend
/ gespannt) sperrt nur in eine Richtung. Beidseitig gelesen hätte sie
`Laminat verlegen` von 14,00 € auf 24,00 € und `Parkett verlegen` von 22,00 €
auf 52,00 € gehoben — derselbe Schaden mit umgedrehtem Vorzeichen, weil die
Engine die Verlegeart heute fast nie in den Titel schreibt. Die Gegenrichtung
wird aufgemacht, sobald G.2 gebaut ist.

Testabdeckung: `src/lib/__tests__/preis-aufwandswoerter.test.ts`, 16 Fälle in
beide Richtungen. Gesamte Suite (110 Dateien) grün, `tsc` sauber.

*Head of Product Engineering · 2026-09-12*

---

## G.2 gebaut — Verlegeart im Titel (12.09.2026)

Die Engine schreibt die Verlegeart jetzt in den Positionstitel, wo sie
feststeht. Vollständig in `docs/vokabular-abgleich.md`, Abschnitt I. Drei
Punkte, die hierher gehören:

**Manfreds Fall ist jetzt ganz zu.** `Teppichboden verlegen vollflächig
verklebt` trifft die 18-€-Zeile statt zwischen 10, 14 und 18 € zu würfeln.
Laminat, Linoleum, Kork und Parkett ebenso, alle mit exaktem Treffer.

**Der wichtigste Fund stand in keinem Papier: Ein Zusatz ohne passende
Katalogzeile ist schlimmer als gar keiner.** `Vinyl-Boden verlegen vollflächig
verklebt` landete auf `Fertigparkett verlegen vollflächig verklebt` —
**35,00 € statt 16,00 €**. Der Zusatz macht den Titel der Parkettzeile so
ähnlich, dass der Belagname nicht mehr entscheidet. Vinyl, Eichenparkett und
der nackte „Teppich" bekommen deshalb keinen Zusatz; sie brauchen erst die
Umbenennung (F.6). Das ist jetzt ein Test, keine Fußnote.

**Ich habe mich gestern geirrt, und korrigiere es.** Ich hatte angekündigt, die
Verlegeart dürfe nach G.2 in beide Richtungen sperren. Die Messung sagt
deutlich Nein: beidseitig steigt `Fertigparkett verlegen` von 22 € auf 52 €
und `Vinyl-Boden verlegen` von 16 € auf 25 €. Nach G.2 schweigt der Titel
nämlich nur noch dort, wo die Verlegeart wirklich offen ist — und genau dort
darf sie kein Filter sein. Die einseitige Sperre bleibt dauerhaft; für die
offenen Fälle ist die Rückfrage im Angebot die richtige Antwort.

**Nebenbefund, der Beachtung verdient:** Beim ersten Bau sprang die Zahl
„Titel aus Variablen, nicht prüfbar" von 4 auf 17 — das Messgerät war blind
für genau das Stück, das gerade dazugekommen war. Wer die Engine ändert, muss
das Prüfskript mitziehen, sonst misst es still weniger, als es behauptet.

Gesamte Suite (112 Dateien) grün, `tsc` und `eslint` sauber.

*Head of Product Engineering · 2026-09-12*

---

## F.5/4 Ausgleichsmasse — Korrektur an mir selbst (12.09.2026)

Ich hatte geschrieben, für 10 mm und 30 mm führe der Standardkatalog keine
Zeile und die Richtwerte des Prüfmeisters müssten angelegt werden. **Das war
falsch.** Der Katalog führt beide seit jeher:
`Ausgleichsmasse 3–10 mm einbringen` 16,00 € und `10–30 mm einbringen`
26,00 €. Ich hatte es behauptet, ohne nachzusehen.

Die Lücke war im ENGINE-Titel. Er schrieb `(bis 10mm)` — eine Schreibweise,
die im Katalog nicht vorkommt; die Klammer fällt in der Normalisierung weg,
also bekamen alle drei Stärken den 3-mm-Preis. 10,00 € statt 16,00 € oder
26,00 €, bei 60 m² Estrich knapp tausend Euro.

Gebaut: Die Stärke aus dem Diktat wird jetzt in die Staffel des Katalogs
übersetzt (`ausgleichsmasseTitel()` in `boden-basis.ts`), Titel wörtlich wie
im Katalog. Über 30 mm bleibt sichtbar ohne Preis — dort hört der
Boden-Katalog auf.

**Folge für den Rest der Liste:** Erst nachsehen, was der Katalog führt, dann
anlegen. Mehrere Zeilen in F.2/F.3 sind ohnehin als „W" markiert — das sind
Umbenennungen, keine neuen Einträge.

**Noch nicht nachgemessen.** Die Shell auf Sandys Rechner ist während dieser
Änderung ausgefallen (Windows-Update vom 08.09.). Die Änderung ist am echten
Standardkatalog geprüft, aber in einer Ersatzumgebung — Testsuite und
`vokabular-abgleich.mjs` sind noch nicht gelaufen und müssen nachgeholt
werden, sobald der Zugriff wieder da ist.

*Head of Product Engineering · 2026-09-12*

---

## CoS-E-048 — Sandys Entscheidung: Umbenennungen jetzt, neue Katalogeinträge + Migration in einem Zug (12.09.2026)

Bezug: deine Frage an Sandy zu den restlichen Prüfmeister-Punkten —
Umbenennungen vs. neue Katalogeinträge mit Migration (F.5/F.6 in
`vokabular-abgleich.md`).

**Wichtige Klarstellung zuerst, für alle künftigen Migrations-/Rollout-
Fragen:** Es gibt aktuell keine echten Betriebe außer Sandys eigenem
Testkonto. „Bestehende Betriebe sehen die neue Position mit 0,00 €" ist als
Architektur-Feststellung richtig, aber operativ folgenlos — niemand ist
heute davon betroffen. Sandys Entscheidung unten ist deshalb **nicht** aus
Vorsicht für echte Kunden gefallen, sondern aus reiner Sauberkeit.

**Entscheidung: deine eigene Empfehlung, genau so.**
1. Umbenennungen jetzt bauen — kein Risiko, kein Datenbank-Zugriff nötig.
2. Neue Katalogeinträge (Geländer abkleben, Fugen fräsen, Betonwände
   streichen, etc.) zurückstellen, bis der Prüfmeister alle Richtwerte final
   bestätigt hat. Dann alles in einem Zug bauen — Katalogeinträge und
   Migration zusammen, vollständig, nicht gestückelt.

Begründung für die Reihenfolge: nicht Risiko-Vermeidung (den gibt es nicht),
sondern Vermeidung doppelter Migrationsarbeit. Sandys Grundsatz dazu, gilt ab
jetzt generell: „Alles muss perfekt laufen, alles soll direkt richtig
gefixt werden" — einmal vollständig und korrekt ist unter diesem Grundsatz
immer die bessere Lösung als zweimal halb, unabhängig von Kunden-Risiko.

*Chief of Staff · 2026-09-12*

---

## CoS-E-048 — Zug 1 der Umbenennungen gebaut (12.09.2026)

Entscheidung umgesetzt, erster Zug: nur Titel, bei denen der Katalog den Preis
schon führt. Vollständig in `vokabular-abgleich.md`, Abschnitt K.

**Drei Positionen, die mit 0,00 € im Angebot standen, haben jetzt einen
Preis** — einen, der die ganze Zeit im Katalog stand: Tiefengrund Beton →
4,50 €/m², Kalkputz → 35,00 €/m², Rohrleitungen → 9,00 €/lfdm. Dazu zwei
Positionen, die den richtigen Betrag über die falsche Katalogzeile bekamen
(Fassade reinigen, Fassadengrundierung) — gleicher Preis, jetzt der richtige
Name auf dem Kundenpapier.

Raus ist außerdem der Stück-Zweig bei den Rohren: Ohne Meterangabe wurde „1
Stück pro Heizkörper" erfunden. Erfundene Menge und falsche Einheit in einer
Zeile. Steht jetzt sichtbar in der Fehlt-Liste.

**Ein Fund, der die Reihenfolge für den Rest bestimmt.** Eine der
Umbenennungen aus der Prüfmeister-Tabelle hätte einen funktionierenden Preis
zerstört: `Estrich schleifen / Untergrundvorbereitung` → `Estrich anschleifen`
wäre von 8,00 € auf 0,00 € gefallen, weil der Katalog die Zeile ausgerechnet
mit dem Werkzeugwort führt und die schöner benannte unter einem anderen Gewerk
steht. Zurückgestellt in den Katalog-Zug.

Daraus die Regel, die ab jetzt für jede Umbenennung gilt:

> Eine Umbenennung ist nur für sich allein sicher, wenn der Katalog das neue
> Wort schon führt. Sonst gehören Engine-Titel und Katalogzeile in denselben
> Zug.

Ich prüfe deshalb jede weitere Umbenennung vorher gegen den echten Katalog,
unter dem richtigen Gewerk — dieselbe Zeile kann unter Maler existieren und
unter Boden nicht.

**Noch nicht nachgemessen.** Mein Zugriff auf Sandys Rechner ist weiterhin
unterbrochen (Windows-Update vom 08.09.). Jede einzelne Umbenennung ist gegen
den echten Standardkatalog geprüft, aber in einer Ersatzumgebung — Testsuite
und `vokabular-abgleich.mjs` laufen bei Sandy.

*Head of Product Engineering · 2026-09-12*

---

## CoS-E-048 — Zug 2a gebaut, Zusammenlegungen (12.09.2026)

Drei weitere Positionen haben einen Preis bekommen, den der Katalog schon
führte: die beiden Sperranstriche (je **9,00 €/m²**) und der Fliesenspiegel
(**0,80 €/lfdm**). Die drei Leuchten-Zeilen sind zu einer zusammengelegt.
Details in `vokabular-abgleich.md`, Abschnitt L.

**Zwei Titel aus der Prüfmeister-Tabelle funktionieren nicht — gemessen, nicht
vermutet.** Sein `Isoliergrund auftragen (… / Schimmel)` findet gar nichts,
weil die Aufwandswort-Regel „Schimmel" im Titel gegen eine Katalogzeile ohne
Schimmel sperrt — und damit recht hat. Sein `Estrich grundieren (Haftgrund)`
trifft weiter den Tiefengrund-Preis, weil die Normalisierung Klammern wegwirft.
Ersteres ist gelöst (Katalogtitel wörtlich, Anlass in den Rechenweg), das
zweite ist eine **Preisfrage für Manfred**: 4,50 € oder 6,00 € für Estrich
grundieren.

Zug 2b (`Wandflächen` → `Wand`, `Deckenfläche` → `Decke`) folgt separat. Der
ändert gemessen keinen einzigen Preis, streut aber über sieben Testdateien —
das gehört nicht in denselben ungeprüften Schwung wie eine Änderung, die Geld
bewegt.

*Head of Product Engineering · 2026-09-12*

---

## CoS-E-048 — Zug 2b + Haftgrund-Korrektur (12.09.2026)

**Manfred hat mich zweimal korrigiert, beide Male zu Recht.** Mein „sichtbar
statt still" für den 4,50-€-Haftgrund war eine Ausrede — für den Betrieb steht
da ein Preis, den er für seinen hält. Und der richtige Preis ist 6,00 €, aus
Materialgründen: Haftgrund ist mit Quarzsand gefüllt und kostet das Drei- bis
Vierfache vom Tiefengrund.

**Sein eigener Lösungsvorschlag trug allerdings auch nicht** — gemessen. Wir
haben beide auf der falschen Seite gesucht: Die Klammer stört nicht im
gesuchten Titel, sondern im KATALOG. `Grundieren (Tiefengrund)` und
`Grundieren (Haftgrund / Sperrgrund)` heißen nach der Normalisierung beide
„grundieren", und bei Gleichstand gewinnt die obere Zeile. Gelöst als Filter
am Rohtitel — dieselbe Bauweise wie Q-Stufe und Anstrichzahl. `Estrich
grundieren (Haftgrund)` trifft jetzt 6,00 €, ohne Eingriff in die
Normalisierung.

**Zug 2b ist gebaut:** `Wandflächen streichen` → `Wand streichen`,
`Deckenfläche` → `Decke`. Keine Preisänderung, reine Kundenpapier-Hygiene.

**Der Ertrag steckt woanders:** Drei Stellen im Code lasen die alten Titel als
stillen Vertrag, und zwei davon hätten Geld gekostet — die Streichposition
wäre neben der Tapete stehen geblieben (doppelt berechnet), und die
Raumzählung für die Heizkörper wäre auf null gefallen. **Keine davon hätte
einen Test zwingend rot gemacht.** Gefunden durch die Routine aus dem
`Parkett schleifen`-Fall. Die Erkennung steht jetzt an einer Stelle
(`istWandStreichen()`), damit der nächste Umbenenner sie über die Aufrufer
findet.

**Zu Sandys Frage, ob Manfred alle Preise setzen soll:** Meine Empfehlung ist
nein — seine beiden Gewerke ja, die übrigen nicht (er kann Elektro und SHK
nicht bepreisen, und aus dem Standardkatalog würde „Manfreds Preisliste", was
den regionalen Faktor später unbeurteilbar macht). Wichtiger: Der Preis ist
nicht das Wertvollste an ihm. Alle fünf teuren Funde heute waren **Struktur**,
kein Preis — Verlegeart, Schleifgänge, Millimeterstaffel, Einheit, Werkstoff.
Da ist er unersetzlich, und da verbrennt man ihn, wenn man ihn 300 Zahlen
abtippen lässt. Vorschlag: Preise zur Bestätigung, aber immer mit der Frage
„warum", nicht nur „wie viel" — die Begründung ist das, was für andere
Betriebe verallgemeinerbar ist.

*Head of Product Engineering · 2026-09-12*

---

## CoS-E-049 — O und P des Prüfmeisters abgearbeitet (12.09.2026)

**An den Chief of Staff, nicht an Sandy.** Sie hat heute gesagt, sie kann die
Engineering-Berichte nicht mehr prüfen und will nur noch hören, was sie oder
ein Kollege TUN muss. Das ist berechtigt — die Details gehören hierher, nicht
in den Chat. Ich halte mich ab jetzt daran.

### 1. Was gebaut wurde

**O.3 — der einzige wirklich neue Punkt seiner Liste, und er ist älter als
die Umbenennung.** Drei Funktionen kennzeichnen die Streichposition
nachträglich mit dem Material (Feuchtraumfarbe, abwaschbare Farbe,
chlorbeständige Spezialfarbe). Alle drei machten es unterschiedlich falsch:

| | Fehler | Folge |
|---|---|---|
| `pruefeFeuchtraum` | ersetzte mit `/streichen(\s*—\s*.+)?$/` | Seit der Anstrichzahl endet der Titel auf „… streichen **2x** — Bad". Muster greift nicht → **Zusage verschwand wortlos vom Kundenpapier** |
| `pruefeAbwaschbar` | `.replace(/streichen/, …)` | Zusatz landete VOR der Anstrichzahl |
| `pruefeChlor` | `beschreibung += ' (…)'` | Zusatz landete HINTER dem Raum → der Raum hieß „Bad (chlorbeständige Spezialfarbe)"; jede Stelle, die den Raum ausliest, bekam Müll |

Alle drei laufen jetzt über `mitTitelZusatz()` in `positions-titel.ts`, das den
Zusatz vor den Raum-Gedankenstrich setzt.

**O.1/O.2 waren bereits erledigt** — unsere Notizen haben sich überkreuzt. Er
fand sechs Stellen, ich hatte zwölf gefunden und umgestellt. Seine Liste ist
damit vollständig abgedeckt.

**O.4/2 — zwölf Tests**, einer je stiller Vertrag, in
`src/lib/__tests__/titel-vertraege.test.ts`. Wie von ihm verlangt auf das
ERGEBNIS geprüft, nicht auf den Titel im Code. Inklusive der Zusicherung, dass
Angebote mit der ALTEN Schreibweise weiter erkannt werden.

**P.2 — die drei Wortgruppen** sind in `preis-aufwandswoerter.ts`:
`Arbeitsgang` um `streichen`/`überstreichen`/`anstreichen`/`anstrich` (eine
Kennung) und `tapezieren`/`aufziehen` (eine Kennung) erweitert; neue Gruppen
`Sondermaterial` und `Materialbeistellung`.

**P.1 — die drei Umbenennungen ohne Katalogänderung:**

| Engine sagte | heißt jetzt | vorher | jetzt |
|---|---|---|---|
| `Raufaser tapezieren` | `Raufaser tapezieren ohne Anstrich` | 14,00 € | **10,00 €/m²** |
| `Raufaser/Malervlies/Vliestapete/Tapete streichen` | `Tapete / Raufaser überstreichen Nx` | **0,00 €** | **11,00 €/m²** (1x: 7,00 €) |

Die Raufaser-Zeile traf `Raufaser tapezieren + überstreichen 1x` — ein
Anstrich, den niemand bestellt hat, 4,00 €/m² zu viel, und der Betrieb schuldet
die Arbeit. Dieselbe Familie wie `Parkett schleifen` → Komplettpaket. Seit
`streichen` und `anstrich` eine Kennung sind, ist das gesperrt.

### 2. Der Beinahe-Schaden, der beim Bauen auffiel

`chlorbeständig` sollte laut P.2 ein Sperrwort werden — und `pruefeChlor`
schrieb genau dieses Wort in **jede** Streichposition. Ein Schwimmbad-Auftrag
hätte damit **sämtliche Anstrichpreise verloren**. Der Prüfmeister hatte das in
F.2 #10 vorhergesagt, nur aus dem anderen Blickwinkel: Die Umbenennung war
ohnehin eine unbezahlte Zusage („das Versprechen steht auf dem Papier, bezahlt
wird der Normalpreis"). Sie ist jetzt raus; der Aufpreis läuft auf die
Streichfläche statt pauschal.

**Merksatz für den Themenspeicher:** Ein Wort, das die Engine SELBST in Titel
schreibt, darf nicht ohne Prüfung zum Sperrwort werden. Die Aufwandswörter
beschreiben, was der Kunde bestellt hat — nicht, was wir hineingeschrieben
haben.

### 3. Bewusst offen, gehört in den Katalog-Zug

- `Silikatfarbe 2× Anstrich` steht jetzt sichtbar auf **0,00 €** (traf vorher
  den Fassadenfarben-Preis 14,00 €; Silikat-Fassade kostet laut seiner P.1-Liste
  20,00 €). Gewollte Richtung nach PM-018.
- `Tapete tapezieren` ohne genannte Art rät weiter die teuerste Sorte
  (Vliestapete, 18,00 €). Er will dafür **keinen Titel, sondern eine
  Rückfrage** — das ist F.5/6.
- Die komplette Anlageliste aus P.1 (14 neue Zeilen + 2 Änderungen an
  bestehenden) wartet auf Sandys Katalog-Zug (CoS-E-048).

### 4. Was Sandy tun muss

Nur zwei Befehle, sonst nichts. Sie hat keinen anderen Weg, den Stand zu
prüfen — meine Shell auf ihrem Rechner ist seit dem Windows-Update vom 08.09.
tot, und das ist der Flaschenhals des ganzen Tages gewesen.

```
npx vitest run 2>&1 | Out-File -Encoding utf8 testlauf.txt
node scripts/vokabular-abgleich.mjs 2>&1 | Out-File -Encoding utf8 abgleich.txt
```

### 5. Eine Bitte an den Chief of Staff

Sandy hat heute geschrieben: *„ich hab irgendwie Sorge, dass ich jetzt einen
komplett normalen Testfall einspreche und plötzlich nur Scheiße rauskommt, weil
du hier gefühlt alles umbaust und ich nichts checke."*

Das ist der wichtigste Satz des Tages. Eine grüne Testsuite beweist ihr nichts,
weil sie sie nicht lesen kann. Ich habe deshalb `scripts/probe-angebot.mjs`
gebaut: Es druckt vier vollständige Angebote aus — Positionen, Mengen, Preise,
Summe, Fehlt-Liste — über dieselbe Kette wie der echte Endpunkt.

**Vorschlag: Das gehört nicht mir, sondern in die Routine.** Nach jedem
größeren Eingriff an der Preis- oder Mengenlogik ein Probeangebot, das ein
Mensch ohne Programmierkenntnisse lesen kann. Manfred sollte es ebenfalls
bekommen — er erkennt in dreißig Sekunden, ob ein Angebot Hand und Fuß hat, und
das kann keine Testsuite.

### Nachtrag am selben Abend — die Testsuite hat zwei Dateien mitgefahren, die keine Tests sind

Der erste Lauf war rot, und zwar aus zwei Gründen, die beide nichts mit dem
Katalog zu tun hatten:

**1. `Claude outputs/titel-vertraege.test.ts`.** Im Projektordner liegt ein
Ordner „Claude outputs", in dem gelieferte Dateien landen. Dort lag eine
**Kopie** eines Tests. vitest durchsucht standardmäßig den ganzen
Projektordner, hat die Kopie gefunden, und die scheitert an ihren relativen
Importen — sie liegt ja woanders als das Original. Das Original unter `src/`
war die ganze Zeit grün.

`vitest.config.ts` sucht ab jetzt nur noch unter `src/`. Damit ist auch
`_to_delete/zz-diag.test.ts` draußen, eine alte Diagnose, die bis heute
stillschweigend mitlief.

**Das ist kein Schönheitsfehler.** Eine rote Suite, die nichts über den Code
aussagt, ist schlimmer als gar keine — sie gewöhnt einem das Hinschauen ab.
Und Sandy ist die Person, die als Einzige die Suite laufen lässt und dabei
auf „grün oder rot" angewiesen ist, weil sie den Inhalt nicht lesen kann.
Rot ohne Bedeutung nimmt ihr das einzige Signal, das sie hat.

**2. Mein neuer Test lief in den 5-Sekunden-Standardtimeout.** Er schickt
alle 2379 Katalogzeilen durch den echten Matcher und braucht dafür rund 20
Sekunden. Ich habe ihm ausdrücklich 60 Sekunden gegeben und im Test
dazugeschrieben, warum: Die 2379 Aufrufe **sind** die Prüfung, nicht ihr
Rahmen. Wer das schneller haben will, macht den Matcher schneller, nicht die
Prüfung kleiner.

Er ist damit der langsamste Test der Suite (die insgesamt rund 53 Sekunden
braucht). Das ist ein bewusster Preis für die Prüfung, die heute den
10.000-€-Fehler gefunden hat.

**Stand vor dem Nachlauf:** 115 Testdateien, 1751 Tests grün, 1 rot (der
Timeout oben). Nach diesen zwei Änderungen sollte die Suite vollständig grün
sein.

### Manfreds Antwort auf die Liste — und ein Fund, der nicht auf der Liste stand

Manfred hat die 22 Zeilen durchgesehen und zwei Dinge gesagt. Das zweite ist
das wichtigere.

**Zum Ersten:** *„Das mit ‚immer billiger' ist der eigentliche Fund, nicht die
22 Zeilen. Wer 64 Mal still zu billig rechnet, merkt das nicht im Angebot,
sondern erst in der Bilanz."* — Genau so ist es gemeint.

**Zum Zweiten, und das war mir entgangen:** *„‚Massivholzdielen verlegen
vollflächig verklebt' trifft ‚Landhausdiele verlegen vollflächig verklebt'. Da
steht das unterscheidende Wort nicht in der Klammer – es steht ganz vorn, und
trotzdem wird's zusammengeworfen. Das gehört in eine eigene Zeile: Der Matcher
darf ein Produktwort vorne nicht überstimmen. Nicht, dass ihr 22 Zeilen
umbenennt und der Fall bleibt."*

Er hat recht, und die Ursache ist schärfer als seine Vermutung. Er tippte auf
eine knappe Mehrheit — vier von fünf Wörtern stimmen. Tatsächlich steht in
`preis-matcher.ts` eine Synonymregel:

```
[/landhausdielen?|massivholzdielen?|holzdielen?/g, 'diele']
```

**Drei verschiedene Produkte werden zu einem Wort gemacht.** Danach heißen die
beiden Zeilen buchstabengleich, und der Score ist nicht knapp — er ist
**1,000**. Massivholz (52,00 €/m²) bekam den Landhausdielen-Preis (40,00 €).
12,00 € je Quadratmeter, und Manfreds Warnung trifft: Umbenennen hätte nichts
geholfen, die Namen sind längst verschieden.

**Wie groß ist diese Klasse?** Ich habe es gemessen statt geschätzt. Von 87
Titelpaaren im Katalog, die nach der Normalisierung gleich heißen und
verschieden kosten:

| Ursache | Fälle |
|---|---|
| die Klammer (Titel sonst identisch) | 81 |
| die Normalisierung selbst (Titel verschieden) | **6** |
| davon von einem Filter abgefangen (Q-Stufe, Staffel) | 5 |
| **davon ungedeckt** | **1 — genau Manfreds Fall** |

Erkennungsmerkmal für die Zukunft: Unterscheiden sich zwei kollidierende Titel
auch **ohne** Klammer, ist es kein Benennungsfall, sondern ein Matcherfall.

**Repariert:** neue Gruppe `Bodenwerkstoff` in `preis-aufwandswoerter.ts`, mit
eigenen Kennungen für Massivholzdiele und Landhausdiele. Die Synonymregel
bleibt, denn sie ist richtig für die *Suche* — „Holzdielen verlegen" soll
etwas finden. Sie ist nur falsch für das *Geld*. Großzügig suchen, hart
trennen: dasselbe Muster wie bei der Q-Stufe (PM-018).

Der Oberbegriff „Holzdielen" bekommt bewusst keine Kennung. Wer sich nicht
festlegt, bekommt weiter einen Preis — den günstigeren.

**Unerreichbare Zeilen: 64 → 22 → 21.** Die 25 bekannten Maler- und
Boden-Paare unverändert.

### Manfreds Benennungsvorschläge — der fertige Umbenennungs-Zug

Das ist keine Diskussionsgrundlage mehr, sondern eine Arbeitsliste. Sie gehört
in den Katalog-Zug (CoS-E-048), nicht in den Code. **Vorher zu klären: Nach
Regel K.1 ist eine Umbenennung nur allein sicher, wenn der Katalog das neue
Wort schon führt — hier wird der Katalog selbst umbenannt, also fällt das weg.
Aber jede dieser Zeilen muss nach der Umbenennung erneut durch
`katalog-dopplungen.mjs`, sonst tauscht man ein stilles Problem gegen ein
anderes.**

**Boden (sein Fach):**

| alt | neu | Preis |
|---|---|---|
| Landhausdiele verlegen vollflächig verklebt | Landhausdiele Mehrschicht verlegen, vollflächig verklebt | 40,00 € |
| Massivholzdielen verlegen vollflächig verklebt | Massivholzdiele verlegen, vollflächig verklebt | 52,00 € |
| Klebe-Vinyl verlegen vollflächig (Profikleber, Nasskleber) | Klebe-Vinyl verlegen, Nasskleber | 28,00 € |
| Klebe-Vinyl verlegen vollflächig (Dünnbett, Self-Adhesive) | Selbstklebendes Vinyl verlegen | 22,00 € |
| Aufpreis Verlegung bei Fußbodenheizung (FBH-geeignet) | Aufpreis Fußbodenheizung, schwimmend verlegt | 4,00 € |
| Aufpreis Verlegung bei Fußbodenheizung (elastischer Kleber) | Aufpreis Fußbodenheizung, verklebt mit Elastikkleber | 8,00 € |
| Laminat verlegen schwimmend (Klick-System, Standard) | Laminat verlegen, schwimmend | 14,00 € |
| Laminat verlegen schwimmend (Großdiele / breites Format) | Laminat Großdiele verlegen, schwimmend | 16,00 € |

Sein Kommentar zum Aufpreis Fußbodenheizung ist mehr als eine Umbenennung:
*„Das ist der eigentliche Unterschied: schwimmend braucht nur die Freigabe,
verklebt braucht den teuren Kleber. ‚FBH-geeignet' sagt niemand."* Der alte
Titel beschrieb eine Eigenschaft des Belags, der neue beschreibt die Arbeit.

**Stuck (macht er mit):**

| alt | neu | Preis |
|---|---|---|
| Deckenrosette montieren (PU / Gips, Fertigteil) | Deckenrosette montieren | 55,00 € |
| Deckenrosette montieren (groß, >50cm Durchmesser) | Deckenrosette groß montieren, über 50 cm | 90,00 € |
| Stuckleiste montieren (Gips, einfach) | Gipsstuckleiste montieren | 25,00 € |
| Stuckleiste montieren (Gips, profiliert / aufwändig) | Gipsstuckleiste profiliert montieren | 40,00 € |
| Stuckleiste montieren (PU-Hartschaum, einfach) | PU-Stuckleiste montieren | 18,00 € |
| Stuckleiste montieren (PU-Hartschaum, profiliert / aufwändig) | PU-Stuckleiste profiliert montieren | 28,00 € |
| Stuckleiste montieren (EPS / Styropor, einfach) | Styroporleiste montieren | 12,00 € |

Zu „PU / Gips, Fertigteil" sagt er: *„Die Klammer sagt nichts
Unterscheidendes, nur was es ist. Kann ganz weg."* Das ist die Regel in einem
Satz.

**Nicht sein Fach, aber so redet man:**

| alt | neu | Preis |
|---|---|---|
| Garage abbrechen (Leichtbau / Fertiggarage) | Fertiggarage abbrechen | 1.200,00 € |
| Garage abbrechen (Beton / Massiv, bis 25 m²) | Massivgarage abbrechen | 2.800,00 € |
| Treppe abbrechen (Holz) | Holztreppe abbrechen | 280,00 € |
| Treppe abbrechen (Beton) | Betontreppe abbrechen | 850,00 € |
| Wandöffnung / Durchbruch herstellen (bis 1 m², Mauerwerk) | Durchbruch Mauerwerk bis 1 m² | 280,00 € |
| Wandöffnung / Durchbruch herstellen (bis 1 m², Beton / Stahlbeton) | Durchbruch Beton bis 1 m² | 650,00 € |
| Vollabbruch je m² BGF (Massivbau, Richtwert) | Vollabbruch Massivbau je m² | 75,00 € |
| Vollabbruch je m² BGF (Stahlbeton / aufwändig) | Vollabbruch Stahlbeton je m² | 110,00 € |
| Treppenlift einbauen (gerade Treppe, komplett) | Treppenlift gerade Treppe | 5.500,00 € |
| Treppenlift einbauen (gewendelte Treppe) | Treppenlift gewendelte Treppe | 9.500,00 € |
| Holztreppe Massiv (gerade, bis 10 Stufen, inkl. Geländer) | Holztreppe gerade | 5.500,00 € |
| Holztreppe Massiv (gewendelt / Sonderform) | Holztreppe gewendelt | 9.500,00 € |
| Oberste Geschossdecke dämmen (nicht begehbar, MW 160mm) | Geschossdecke dämmen, nicht begehbar | 35,00 € |
| Oberste Geschossdecke dämmen (begehbar, Trittschutzplatte) | Geschossdecke dämmen, begehbar mit Trittschutz | 55,00 € |
| Wärmedämmung verlegen (EPS, bis 60mm) | Wärmedämmung EPS verlegen | 14,00 € |
| Wärmedämmung verlegen (Mineralwolle / Steinwolle) | Wärmedämmung Mineralwolle verlegen | 22,00 € |
| Außenrollladen (manuell, Gurt) einbauen inkl. Kasten | Rollladen manuell einbauen | 380,00 € |
| Außenrollladen (elektrisch, 230V) einbauen inkl. Kasten | Rollladen elektrisch einbauen | 580,00 € |
| Gartenpflege allgemein (Hilfsarbeiter, je Stunde) | Gartenpflege Hilfskraft je Stunde | 30,00 € |
| Gartenpflege allgemein (Fachkraft, je Stunde) | Gartenpflege Fachkraft je Stunde | 45,00 € |
| Küche Planung + Fertigung + Montage (einfach, je lfdm) | Einbauküche einfach je lfdm | 1.800,00 € |
| Küche Planung + Fertigung + Montage (mittel, je lfdm) | Einbauküche mittel je lfdm | 2.800,00 € |
| Küche Planung + Fertigung + Montage (hochwertig, je lfdm) | Einbauküche hochwertig je lfdm | 4.200,00 € |

### Drei offene Fragen, die Manfred an den Prüfmeister weiterreicht

1. **Laminat Großdiele, die 2,00 €.** *„Ehrlich: Großdiele liegt schneller,
   nicht langsamer, der Aufpreis ist Verschnitt, nicht Arbeit. Prüfmeister
   soll gucken, ob die 2 € überhaupt stimmen."* — Das ist keine
   Benennungsfrage, sondern eine Preisfrage. Nicht mit umbenennen, sondern
   getrennt klären.
2. **Einbauküche „mittel" / „hochwertig".** *„Auf einem Kundenangebot komisch.
   Der Schreiner schreibt eher ‚Einbauküche Standardfront' / ‚Echtholzfront',
   aber das soll er sagen."* — Die Umbenennung oben nimmt vorerst seine
   Formulierung; wenn ein Schreiner das anders nennt, gilt dessen Wort.
3. **Aufpreis Estrichdicke je zusätzlicher cm (2,80 € / 2,50 €).** Manfred:
   *„Erst prüfen, ob die Zeile überhaupt in Maler/Boden gehört. Wenn sie
   bleibt: 2,80, die 2,50 weg."* Die einzige echte Dopplung im Katalog.

### Eine Sache, die ich Manfred schuldig bin

Er schreibt zur Deckenrosette: *„‚>50cm' müsste eure neue Staffel-Regel
eigentlich schon lesen."* Sie liest es — und sperrt trotzdem nicht, absichtlich:
Die Regel greift nur, wenn **beide** Seiten eine Angabe tragen. Die
Gegenzeile („PU / Gips, Fertigteil") trägt keine. Das ist die Lehre aus der
Verlegeart: Eine Sperre, die auch dann greift, wenn eine Seite nichts sagt,
nimmt dem Handwerker den Preis für den Normalfall weg. Sein Vorschlag „groß
nach vorn" ist deshalb genau der richtige — und der einzige, der hier wirkt.

### Manfreds Fassung der Regel ist besser als meine

Ich hatte geschrieben: *„Eine Klammer darf nie das Einzige sein, was zwei
Preise auseinanderhält."* Er macht daraus:

> **Die Klammer ist für Erklärung („inkl. Kasten", „Fertigteil"), nicht für
> Unterscheidung. Was unterscheidet, steht vor dem Verb.**

Dazu sein Grund, der mir nicht eingefallen wäre: *„Dann liest sich's auch auf
dem Angebot besser – ‚Betontreppe abbrechen' versteht Frau Krüger, ‚Treppe
abbrechen (Beton)' liest sich wie aus einem Katalog."* Dieselbe Regel löst das
Preisproblem **und** macht das Kundenpapier lesbarer. So etwas ist selten;
seine Fassung ist ab jetzt die gültige, auch für den Hinweis beim Anlegen
eigener Positionen.

*Head of Product Engineering · 2026-09-12*

---

## CoS-E-050 — Sandys grünes Licht: die 22 Umbenennungen jetzt bauen (12.09.2026)

Bezug: CoS-E-048 (Umbenennungen zuerst, neue Katalogeinträge später) und
Abschnitt Q in `vokabular-abgleich.md` (die 22 Klammer-Kollisionsstellen,
Sperrklinke in `katalog-staffeln.test.ts`).

**Stand laut Sandy:** Manfred hat für alle 22 Zeilen die finalen neuen Namen
geliefert. Die Liste ist damit fertig zum Abarbeiten — die alt→neu-Tabellen
dazu stehen bereits vollständig in `vokabular-abgleich.md` (Abschnitte K–P,
u. a. „Stuck (macht er mit)" und „Nicht sein Fach, aber so redet man") und
im Spiegel hier oben in diesem File.

**Auftrag: bitte jetzt bauen.** Sandy will das erledigt sehen, nicht nur
dokumentiert. Nach dem Bau bitte kurz bestätigen:
- Sperrklinke in `katalog-staffeln.test.ts` von 22 auf 0 (oder auf den neuen,
  niedrigeren Stand, falls einzelne Fälle noch offene Rückfragen sind).
- `node scripts/katalog-dopplungen.mjs` erneut laufen lassen zur Kontrolle.

**Zum Shell-Zugriff:** Der ist gerade wegen des Windows-Updates auf Sandys
Rechner unterbrochen (siehe deine eigene Notiz oben, „Noch nicht
nachgemessen"). Das blockiert nur das *Ausführen* von Tests/Skripten auf
ihrem Rechner — Dateien bearbeiten geht weiterhin ganz normal. Bau die
Umbenennungen wie gewohnt; der volle Testlauf zur Bestätigung kann warten,
bis der Zugriff zurück ist, das Bauen selbst nicht.

*Chief of Staff · 2026-09-12*

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
