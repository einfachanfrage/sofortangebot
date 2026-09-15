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

## CoS-E-054, Gegenprobe vom Prüfmeister — zwei Ebenen reichen, unter drei Bedingungen

**Datum:** 2026-09-14 · **An:** Head of Product Engineering, Chief of Staff ·
**Beantwortet:** die Frage aus CoS-E-054 („vom Prüfmeister die Gegenprobe, ob
es in der Praxis wirklich drei Ebenen sind oder ob zwei reichen")

**Kurz: Manfred hat recht, zwei Ebenen reichen.** Ich habe das Modell gegen
die Fälle gehalten, die wir wirklich haben — seine beiden Sessions, die 44
Testfälle, den Standardkatalog. Es trägt. Aber es trägt nur, wenn drei
Bedingungen erfüllt sind, und zwei davon stehen so noch nirgends.

### 1. Ebene 2 ist je POSITION, nicht je Angebot

Im Konzept steht „für dieses eine Angebot umstellbar". Manfred sagt selbst
*„das ist exakt die Umstellung pro Angebot"* — er denkt dabei aber an den
Yilmaz-Fall, und der ist ein **reines Bodenangebot**. Da fällt beides
zusammen.

Das Normalangebot fällt nicht zusammen. „Wände streichen, und im Flur kommt
Laminat rein" ist ein Angebot mit zwei Materiallogiken: Farbe drin, Laminat
vom Kunden. Ein Schalter auf Angebotsebene steht für die Hälfte davon falsch,
egal wie er steht — genau das Argument, mit dem der Chief of Staff den
globalen Schalter verworfen hat, eine Ebene tiefer.

Der Knopf, den Manfred in TN-122 gelobt hat, saß auch an der **Position**
(„+ Laminat (Material)"), nicht am Angebot. Also: Vorbelegung kommt von der
Tätigkeit, umgestellt wird an der Zeile.

### 2. Der Schalter braucht eine dritte ZAHL — das ist keine dritte Ebene

Das ist der Punkt, der mir beim Gegenrechnen aufgefallen ist und der den
🔴-Punkt überhaupt erst baubar macht.

Manfred: *„Wenn ich Material rausziehe, sind es nicht mehr 11,50 für Wand 2x,
sondern 8,50 plus Farbe."* Die App kennt aber nur **eine** Zahl: 11,50.
**Woher kommen die 8,50?** Aus nichts. Ohne einen hinterlegten Materialanteil
je Position ist „die Zahl muss mitgehen" nicht umsetzbar, und der Knopf
erzeugt genau den Doppelfehler, vor dem Manfred warnt.

Das ist **keine zusätzliche Frage an den Nutzer** — also keine dritte Ebene —
sondern ein Feld je Katalogzeile, vorbelegt, änderbar wie der Preis selbst.
Startwerte, fachlich, Innenbereich Standardqualität:

| Position | Preis | davon Material | Arbeit |
|---|---|---|---|
| Wand streichen 2x | 11,50 € | **3,00 €** | 8,50 € *(Manfreds eigene Zahl)* |
| Wand streichen 1x | 6,00–9,50 € | **1,50 €** | Rest |
| Decke streichen 2x | 11,00 € | **2,50 €** | 8,50 € |
| Raufaser tapezieren ohne Anstrich | 10,00 € | **2,50 €** (Tapete + Kleister) | 7,50 € |
| Fassade Silikat 2x | 20,00 € | **6,50 €** | 13,50 € |

**Faustregel für alles, was hier nicht steht:** bei zwei Anstrichen liegt der
Materialanteil innen bei rund einem Viertel des Quadratmeterpreises, nie über
einem Drittel. Beim Lack höher (gute Lacke sind teuer), bei reiner
Vorbereitung — schleifen, spachteln, abkleben — praktisch null; dort gehört
gar kein Schalter hin.

Und das erklärt nebenbei, **warum Fassade und Boden getrennt laufen**: Dort
ist der Materialanteil nicht ein Viertel, sondern ein Drittel bis die Hälfte,
und er schwankt mit der Auswahl des Kunden. Genau da wird ein eingerechneter
Materialanteil zum Risiko für den Betrieb.

### 3. Der Halbsatz muss das Material BENENNEN

Manfred: *„Der Halbsatz ist wichtiger als der Schalter."* Richtig, und eine
Stufe schärfer: **„ohne Material" ist selbst schon falsch.**

Bei „Vliestapete tapezieren ohne Material" bleibt der Kleister drin — der
gehört zum Handwerk, nicht zur Auswahl des Kunden. Der Kunde stellt die
Tapete. Steht „ohne Material" auf dem Angebot, streitet man später über den
Kleister, und zwar um zwanzig Euro und das Verhältnis.

Also: **„ohne Tapete", „ohne Farbe", „ohne Belag"** — das Material beim Namen.
Für den Privatkunden dann in Klartext, wie Manfred es für das PDF verlangt
hat.

### Wo zwei Ebenen NICHT reichen — und warum es trotzdem keine dritte braucht

Drei Fälle habe ich gesucht, die das Modell brechen. Sie brechen es nicht:

- **Ein Material, zwei Zeilen.** Wandfarbe steckt in „Wand streichen" *und*
  „Decke streichen". Stellt er eine um, muss die andere mit. Das ist eine
  **Rückfrage** („auch bei der Decke?"), keine Ebene.
- **Teilmaterial.** Kunde stellt die Tapete, nicht den Kleister — erledigt
  sich mit Bedingung 3.
- **Kunde entscheidet sich später anders**, nimmt die teurere Fliese. Das ist
  ein **Nachtrag**, kein Materialschalter. Steht schon im Themenspeicher und
  hat mit dieser Frage nichts zu tun.

### Zu Manfreds Lernfrage nach dem dritten Mal

Einverstanden, mit einer Einschränkung: Die Frage darf erst kommen, wenn er
**dieselbe Position** dreimal umgestellt hat, nicht dreimal irgendeine. Sonst
fragt die App nach dem dritten Angebot pauschal „immer ohne Material?" — und
das ist wieder der globale Schalter, nur später und mit mehr Anlauf.

### Was ich prüfen werde, sobald es gebaut ist

Ein Angebot mit beiden Logiken nebeneinander (Wand inklusive, Boden getrennt),
und dann die Probe aufs Exempel: Material herausziehen und nachrechnen, ob die
Summe um genau den Materialanteil fällt — nicht um null und nicht um den
ganzen Preis. Der Test gehört geschrieben, **bevor** der Knopf gebaut wird.

*Prüfmeister · 2026-09-14*

---

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

## CoS-E-052 🔴 — Der Preise-Schritt findet die Gewerk-Vorlagen nicht. Seit immer.

**Datum:** 2026-09-14 · **Quelle:** TN-140 + Sandys Rückfrage „warum
Entsorgung?" · **Priorität:** hoch, unabhängig vom Preislisten-Konzept

**Der Befund, an drei Stellen im Code nachgelesen:**

| | |
|---|---|
| `src/lib/gewerke-config.ts` Z. 3 / 17 | Die beiden wählbaren Gewerke heißen **`maler`** und **`boden_parkett`** |
| `src/lib/preise-vorlagen.ts` | `GEWERK_PREISE` hat die Schlüssel **`malerarbeiten`** (42 Vorlagen), **`bodenbeläge`** (48), **`maler_fassade`** (41) — **`maler` und `boden_parkett` existieren dort nicht** |
| `getPreisvorlagenForGewerke()` | `GEWERK_PREISE[id] ?? []` → für beide aktiven Gewerke immer die **leere Liste** |

Übrig bleiben drei Einträge aus `ALLGEMEINE_PREISE` (Anfahrt/km,
Stundensatz Fachkraft 65 €, Stundensatz Helfer 42 €) — und dann greift diese
Regel:

```ts
// Allrounder = Entsorgung immer dabei
if (gewerkeIds.length > 0 && !seen.has('Entsorgung::Bauschutt-Container 7m³')) {
  result.push(...(GEWERK_PREISE['allrounder'] ?? []))
}
```

`allrounder` enthält genau zwei Zeilen: *Bauschutt-Container 7m³* und
*Kleinfuhre bis 1m³*. Da `seen` durch den Fehlschlag oben immer leer ist,
feuert die Regel **bei jedem Gewerk**.

**3 + 2 = die fünf Felder, die Manfred gesehen hat, in genau dieser
Reihenfolge.** Das ist kein unglücklicher Entwurf, das ist ein Rest.

**Was es schlimmer macht:** `AKTIVE_GEWERKE` wirbt in der Gewerk-Kachel mit
`positionen_count: 164` für Maler. Die Oberfläche verspricht 164 Positionen,
über diesen Pfad kommt keine einzige an. Dieselbe Familie wie
`mindestauftragswert` (Spalte existierte, wurde nie gelesen) und
`kleinmaterial`-Pauschale (toter Pfad) — **„Oberfläche verspricht, Code
schweigt", jetzt zum dritten Mal.**

**Und der Fall ist schon einmal an uns vorbeigelaufen.** Im Kommentar in
`onboarding/[step]/page.tsx` (18.08.2026) steht wörtlich: *„live gefunden am
Konto ‚Lisa Schein Malerbetrieb' — nur 5 generische Posten, keine einzige
Maler-Position, Preis-Matching lief komplett leer."* Dasselbe Symptom, exakt
dieselben fünf Posten. Behoben wurde damals, dass der **Basis-Katalog** jetzt
in jedem Modus geladen wird — was das Symptom zugedeckt hat (die 220
Positionen, die Manfred in der Datenbank findet, kommen daher). **Die Ursache
wurde nie gesucht.** Bitte diesen Zusammenhang mitlesen, bevor du fixt: Es
gibt seither **zwei parallele Preisquellen** (Vorlagen im Onboarding,
Basis-Katalog beim Speichern), und das ist der Grund, warum „Eigene Preise"
und „Marktpreise" am Ende dasselbe Ergebnis liefern.

**Was ich NICHT vorgebe:** ob die Kennungen angeglichen werden (und in welche
Richtung), ob eine Zuordnungstabelle sauberer ist, und was mit der
Allrounder-Regel passiert. Das ist dein Gebiet. Meine einzige Bitte: Die
Entsorgungsposten sollen nicht mehr bei einem Maler landen, der zweimal im
Jahr einen Container braucht.

---

## CoS-E-053 — Sandys Auftrag: `preisliste-konzept.md` bauen, keine Zwischenlösung

**Datum:** 2026-09-14 · **Entscheidung Sandy, M-1 in `entscheidungen-fuer-sandy.md`**

Sandy hat meinen Vorschlag einer ehrlichen Zwischenbeschriftung abgelehnt:
*„es soll direkt die richtige Lösung gemacht werden."* Gebaut wird
`docs/preisliste-konzept.md`, **Fassung 2 vom 11.09.** — die ist mit Manfred
abgestimmt und enthält seine vier Korrekturen bereits.

**Die Reihenfolge steht nicht bei mir, sondern im Konzept selbst** (Abschnitt
3, „Voraussetzung — erst das, dann alles andere"), und ich gebe sie nur
weiter, weil sie beim Bauen leicht untergeht:

1. **Zuerst das Vokabular.** Der Katalog muss Wort für Wort die Sprache der
   Engine sprechen, sonst baut die Rückfrage im Angebot die Doppeleinträge
   wieder auf, die gerade weggeräumt wurden. **CoS-E-037**
   (Sperranstrich ↔ Nikotinsperre) ist der erste bekannte Fall und weiterhin
   offen; welches Wort gilt, entscheidet der **Prüfmeister**.
2. **Dann CoS-E-052** — solange die Gewerk-Kennungen nicht greifen, hat der
   Schritt keine Datengrundlage, egal wie gut er gestaltet ist.
3. **Dann das Konzept** (Materialfrage vorweg → Tätigkeitsauswahl →
   die sechs bis sieben Ankerzahlen → Ableitung → Nick-Seite).

**Die Nick-Seite ist laut Konzept der Kern, nicht die Kür** — der Moment, in
dem die Liste den Besitzer wechselt. Manfreds Satz dazu: *„Zwei Minuten, dann
ist es meine Liste, nicht eure."*

**Zwei Punkte aus dem Konzept, die direkt Geld betreffen und deshalb nicht
wegfallen dürfen:** die Frage „sind Materialkosten in deinen Preisen drin?"
(ohne sie rechnet das Produkt bei etwa der Hälfte der Betriebe unsichtbar
falsch) und „Fassade wird nie aus Innen abgeleitet".

**Der Product Designer hat die Oberflächenseite** (DC-102, dort ebenfalls auf
Sandys Entscheidung aktualisiert). Bitte stimmt euch über
`docs/marketing-design-austausch.md`-Muster direkt ab oder sagt mir Bescheid,
wenn ihr einen eigenen Kanal dafür wollt — ich will euch da nicht dazwischen
sitzen.

*Chief of Staff · 2026-09-14*

---

## CoS-E-054 — Sandy zur Materialfrage: der Schalter ist ihr zu eng. Rückfrage ans Konzept, bevor gebaut wird.

**Datum:** 2026-09-14 · **An:** Head of Product Engineering (dir gehört
`docs/preisliste-konzept.md`) · **Mitlesen:** Prüfmeister · **Blockiert
CoS-E-053, Schritt 5** — bitte vor dem Onboarding-Bau klären, nicht danach.

**Sandys Anstoß, wörtlich:** *„soll der user auswählen können beim
Onboarding! Da gefragt: alle Preise inkl. Material? oder ohne und bei Bedarf
Material dazuführen oder mal so mal so, soll so frei wie möglich für User
sein."*

Dein Konzept hat dafür in „Schritt 0" einen **binären** Schalter
(inklusive / getrennt). Sandy hält das für zu eng. **Ich halte ihren Einwand
für belegt, und der Beleg steht in Manfreds eigenem Log** — nicht in einer
Vermutung:

- **TN-122:** *„Laminat hat er selber gekauft"* → kein Material gerechnet,
  aber „+ Laminat (Material)" als Knopf angeboten. Manfred lobt das
  ausdrücklich als die erste Stelle, an der die App etwas richtig
  **weggelassen** hat.
- **TN-128:** *„Verschnitt ist Material. Wenn der Kunde das Laminat kauft,
  ist sein Verschnitt sein Problem, nicht mein Lohn."*
- **Konzept Schritt 0, Manfred selbst:** *„Meine 11,50 für Wand 2x sind
  inklusive Farbe. Beim Kollegen sind's 8 plus Material extra."*

Das sind **drei Zustände in einem Betrieb**: Wandanstrich inklusive Farbe,
Laminat ohne Material, Verschnitt gar nicht. Ein einziger Schalter für alles
bildet das nicht ab — er würde bei Manfred selbst schon falsch stehen, egal
wie er ihn setzt.

**Wo ich Sandy widerspreche, und das gehört mit auf den Tisch:** „So frei wie
möglich" darf nicht „so viele Fragen wie möglich" heißen. Der Schritt hat ein
Versprechen — drei Minuten, Manfred hat es bestätigt (TN-132). Jede weitere
Frage im Onboarding kostet davon; jede Änderbarkeit **danach** kostet nichts.
Freiheit entsteht hier aus **Vorbelegung plus Änderbarkeit**, nicht aus
zusätzlichen Fragen.

**Mein Vorschlag zur Prüfung — deine Entscheidung, nicht meine:**

| Ebene | Was | Kosten für den Nutzer |
|---|---|---|
| Onboarding | Eine Frage **je gewählter Tätigkeit**, nicht global (Innen / Fassade / Boden …) — dieselbe Auswahl, die ohnehin die Zahlenfelder steuert | ein Tipp je Haken, den er eh setzt |
| Preisliste | Je Position änderbar, gilt ab dann dauerhaft | null, bis er es braucht |
| Einzelnes Angebot | Für diesen einen Fall umstellbar (der Laminat-Fall) | null, bis er es braucht |

**Zwei Punkte, die unabhängig von der Ausgestaltung gelten müssen** — und die
bitte nicht wegfallen, egal wofür du dich entscheidest:

1. **Am Feld muss stehen, was die Zahl einschließt.** Steht schon in deinem
   Konzept (Manfred: *„Eine Zahl ohne Bezugsgröße ist keine Zahl"*), wird
   hier aber tragend: Ohne den Halbsatz ist jede Materialeinstellung
   Ratespiel.
2. **Es muss auf dem Kunden-PDF erkennbar sein.** Wenn Material getrennt
   abgerechnet wird, darf der Privatkunde das nicht erst auf der Rechnung
   merken. Das ist dieselbe Familie wie die „Anfahrt & Vorbereitung"-Zeile,
   bei der Head of Legal über § 5a UWG korrigiert hat (10.09.) — **ich
   flagge das nur, bewerten muss es Legal**, und ich hole das ein, sobald
   die Richtung steht.

**Was ich von dir brauche:** eine Einschätzung, ob die drei Ebenen oben
fachlich und technisch tragen oder ob es einen saubereren Schnitt gibt. Und
vom **Prüfmeister** die Gegenprobe, ob es in der Praxis wirklich drei Ebenen
sind oder ob zwei reichen. **Sandy holt zusätzlich Manfreds Einschätzung ein**
— er ist der einzige von uns, der die Rechnung wirklich schreibt.

*Chief of Staff · 2026-09-14*

---

## CoS-E-054 ✅ beantwortet — Manfred: zwei Ebenen, nicht drei. Die dritte entsteht von selbst.

**Datum:** 2026-09-14 · Antwort über Sandy eingeholt. **Das ersetzt meinen
Dreistufen-Vorschlag von oben** — er hatte eine Ebene zu viel und eine
Voraussetzung zu wenig.

### Die Antwort in einem Satz

**Zwei Ebenen bauen — Tätigkeit und Angebot. Die dritte entsteht von selbst.
Und die drei Minuten halten.**

### Ebene 1: Tätigkeit — und die Vorbelegung ist keine Vermutung

Manfreds Praxis, dreißig Jahre, wörtlich:

| Tätigkeit | Material | seine Begründung |
|---|---|---|
| **Innen** (Wand, Decke, Lack, Vlies) | **drin** | *„Farbe ist bei mir Standardqualität, das kalkulier ich in den Quadratmeter, seit dreißig Jahren."* |
| **Fassade** | **getrennt** | *„Silikat oder Silikonharz ist ein Unterschied von 40 % beim Eimer, und beim Altbau kommt oft Grundierung und Armierung dazu, die ich vorher nicht seh."* |
| **Boden** | **getrennt** | *„Der Kunde sucht sich sein Laminat im Baumarkt aus, das ist einfach so."* |

*„Die Vorbelegung je Tätigkeit trifft bei mir in neun von zehn Fällen. […]
Ehrlich gesagt könntet ihr die Haken gleich mit Standard setzen, denn jeder
Maler in Deutschland, den ich kenne, macht's genauso."*

**Wichtige Abgrenzung, die im Konzept fehlt:** *„Kleinmaterial — Trittschall,
Kleber, Übergangsprofil — ist bei mir drin, das ist kein Material, das ist
Zubehör."* Zubehör folgt also **nicht** dem Material-Schalter. Wer das
zusammenwirft, zieht dem Bodenleger den Trittschall aus der Arbeitszeile.

### Ebene 2: das einzelne Angebot — **die gibt es schon, sie ist nur nicht als solche erkannt**

*„Im Angebot stand unter jeder Position ein Knopf ‚+ Wandfarbe' oder
‚+ Laminat (Material)'. Wenn ich den drücke, ist Material eine eigene Zeile.
Wenn nicht, ist es drin. Das ist exakt die Umstellung pro Angebot."*

Das ist derselbe Knopf, den er in **TN-122** schon gelobt hat. Zwei
Bedingungen macht er daran fest:

1. **Die Tätigkeit entscheidet, ob der Knopf schon gedrückt ist.**
2. **🔴 Beim Drücken muss die Zahl in der Arbeitszeile mitgehen.** Wörtlich:
   *„Wenn ich Material rausziehe, sind es nicht mehr 11,50 für Wand 2x,
   sondern 8,50 plus Farbe. Das muss die App wissen, sonst hab ich Material
   doppelt."*

Punkt 2 ist der teuerste Satz seiner Antwort. Ohne ihn erzeugt die
Material-Freiheit **doppelt berechnetes Material** — ein Geldfehler in die
Richtung, die der Kunde merkt, nicht der Betrieb. Er gehört in einen Test,
bevor der Knopf angefasst wird.

### Ebene 3 — nicht bauen, entstehen lassen

*„Eine Einstellung je Position dauerhaft — das wär die Tapete: ‚Vlies
tapezieren immer ohne Tapete, weil der Kunde die aussucht'. Ja, das gibt's,
aber es sind zwei, drei Positionen pro Betrieb. Dafür würd ich keine eigene
Ebene bauen. Wenn ich's dreimal im Angebot umgestellt hab, kann die App
fragen: ‚Vlies tapezieren — Material immer getrennt?' Dann ist die Ebene da,
ohne dass sie jemand pflegen muss. Gleiches Muster wie beim Preis, der aus
der Arbeit entsteht."*

Also: **keine Einstellungsebene, sondern eine Lernfrage nach dem dritten
Mal** — dasselbe Muster wie „9 € wie beim letzten Mal?" aus Abschnitt 5
deines Konzepts.

### 🔴 Voraussetzung, die vorher niemand gesehen hat — und sie trifft CoS-E-052

*„Der Schritt ‚Was machst du?' fragt heute nur Maler oder Boden. Innen und
Fassade sind kein Haken. Wenn die Material-Frage je Tätigkeit laufen soll,
muss vorher die Tätigkeit selbst ein Haken sein — Innen, Fassade, Boden,
vielleicht Lack. Das ist auch die Antwort auf meine Fassaden-Lücke vom
Wochenende. Ein Bildschirm, vier Haken, jeder mit dem Material-Standard dran,
den man antippen kann. **Das sind keine zusätzlichen Fragen, das ist dieselbe
Frage mit mehr Antworten.**"*

**Das ist der Koordinationspunkt, weswegen ich dich bitte, CoS-E-052 und
diesen Punkt zusammen zu entscheiden und nicht nacheinander.** CoS-E-052 ist
der Fehler, dass die Gewerk-Kennungen (`maler`, `boden_parkett`) nicht zu den
Schlüsseln der Preisvorlagen (`malerarbeiten`, `bodenbeläge`,
`maler_fassade`) passen. Wenn die Auswahl ohnehin von **Gewerken** auf
**Tätigkeiten** umgestellt wird, ist ein Angleichen der alten Kennungen
möglicherweise Arbeit, die sofort wieder wegfällt — und bemerkenswert:
`maler_fassade` existiert in den Vorlagen bereits als eigener Schlüssel mit
41 Einträgen. Die Vorlagen kennen die Tätigkeitsebene also schon, nur die
Oberfläche nicht.

**Du entscheidest, wie das geschnitten wird.** Ich will nur verhindern, dass
CoS-E-052 zweimal gemacht wird.

### Die zwei unabhängigen Punkte, beide von ihm bestätigt und geschärft

**Am Feld** — *„‚Wand streichen 2x — 11,50 €/m² inkl. Farbe' oder ‚… ohne
Material'. **Der Halbsatz ist wichtiger als der Schalter.**"*

**Auf dem Angebot, in Kundensprache** — *„Ich schreib ‚Material bauseits' —
das versteht mein Bauleiter, Frau Krüger nicht. Für Privatkunden muss da
stehen ‚Material wird vom Kunden gestellt' oder ‚Material wird nach Auswahl
gesondert angeboten'."* Das ist zugleich ein neuer Fund für die
Kundenpapier-Familie (TN-009/013/016): nicht interne Sprache, aber
**Fachsprache** auf dem Papier eines Privatkunden.

**Und ein Fehler, den er dabei rückwirkend erklärt:** *„Beim Verschnitt: Wenn
Material getrennt ist, gehört der Verschnitt in die Materialzeile, nicht in
die Arbeitszeile. Das war der Yilmaz-Fehler."* — also TN-128. Dazu unten
mehr, das hat Folgen über diesen Punkt hinaus.

*Chief of Staff · 2026-09-14*

---

## CoS-E-054, Erweiterung — Sandy legt die Verschnitt-Fragen mit hinein (14.09.2026)

**Entscheidung Sandy:** Die vier Verschnitt-Punkte werden **nicht mehr
einzeln** beantwortet, sondern fallen mit der Material-Mechanik aus
CoS-E-054. Grund: Es ist dieselbe Mechanik, und zwei getrennte Antworten
darauf erzeugen genau die Widersprüche, die wir gerade an fünf verschiedenen
Höhenschwellen (VOB-006) abarbeiten.

**Was damit zu CoS-E-054 gehört und aus `entscheidungen-fuer-sandy.md`
hierher wandert:**

| bisher offen als | fällt jetzt so |
|---|---|
| **VOB-001/002/014** — Verschnitt in der Menge oder im Preis? | Nach dem Zahler: Material getrennt → Verschnitt in die **Materialzeile**. Material drin → steckt im Materialanteil der Arbeitszeile. Keine Normfrage, eine Zahlerfrage |
| **Fliesen-Verschnitt fest im Code oder im Katalog?** | folgt derselben Mechanik, nicht mehr als Sonderfall im Code |
| **Kork und Teppich 0 %** | dito — 0 % ist dann keine Ausnahme, sondern das Ergebnis von „Material vom Kunden" |

**Die Belege stehen bei Manfred, nicht in der Norm:** TN-128 (*„Verschnitt ist
Material. Wenn der Kunde das Laminat kauft, ist sein Verschnitt sein Problem,
nicht mein Lohn. 21 m² verlegen auf 17 m² Boden — ich verleg 17."*) und seine
Antwort vom 14.09. (*„Wenn Material getrennt ist, gehört der Verschnitt in
die Materialzeile, nicht in die Arbeitszeile. Das war der Yilmaz-Fehler."*).

**Was Legal dazu bereits geliefert hat und weiter gilt:** „Verschnitt" kommt
in DIN 18365 nicht vor, bei Bodenbelägen zählt nur die belegte Fläche — der
heutige Prozentaufschlag auf die Menge hat also keine Normgrundlage. Das
*verbietet* ihn nicht, widerspricht aber der PDF-Zeile „nach VOB berechnet"
(VOB-007). Mit der Zahler-Regel oben löst sich beides auf einmal.

**Für dich heißt das:** Die Verschnitt-Behandlung ist kein eigener Auftrag
mehr, sondern eine Anforderung an die Material-Mechanik. Bitte im Konzept
(Fassung 3) als solche aufnehmen, damit sie nicht als Restposten
danebenliegt.

*Chief of Staff · 2026-09-14*

---

---

## DC-100 abgeschaltet und M-2 gebaut (14.09.2026) — beide mit Sperrklinke

Spur 3 Nr. 1 und Nr. 2 aus `arbeitsreihenfolge.md`. Beide klein, beide von
derselben Sorte: Die Software hatte etwas entschieden, wofür am Ende der
Handwerker geradesteht.

### DC-100 — Angebote tragen keine E-Rechnung mehr

Sandys Entscheidung vom 13.09.: abschalten. Umgesetzt, aber nicht als
dreimal `if (false)`.

**Warum nicht.** Dieselbe Bedingung stand in drei Routen (`api/pdf`,
`api/email`, `api/quotes/[id]/send`), und eine vierte (`api/pdf/xrechnung`)
erzeugte dieselbe als Rechnung deklarierte XML **ohne jede Bedingung**. Genau
diese Streuung ist der Grund, warum der Fehler niemandem auffiel — und drei
abgeschaltete Stellen plus eine vergessene wären derselbe Fehler noch einmal.

**Was jetzt da ist.** `src/lib/zugferd/einbettung.ts`, eine Datei, eine
Funktion:

```ts
export const E_RECHNUNG_DOKUMENTTYPEN: readonly DokumentTyp[] = []

export function eRechnungErlaubt(lage: ERechnungLage): boolean {
  const typ = lage.dokumentTyp ?? 'angebot'
  if (!E_RECHNUNG_DOKUMENTTYPEN.includes(typ)) return false
  if (lage.eRechnungAktiv === false) return false
  return lage.kundeIstUnternehmen === true
}
```

Die leere Liste **ist** DC-100. Die Reihenfolge der Prüfung ist Absicht: Der
Dokumenttyp steht vorne, weil er die rechtliche Frage ist; alles darunter sind
Einstellungen. Kein Betrieb kann den Schalter so stellen, dass ein Angebot zur
Rechnung wird.

Alle vier Stellen fragen jetzt diese eine Funktion. Was daran hängt, löst sich
von selbst mit: der Dateiname `Angebot-…-ZUGFeRD.pdf`, der Header `X-ZUGFeRD`,
der zusätzliche XML-Anhang, der Satz im Mailtext („Es enthält eine
eingebettete ZUGFeRD-XML"), und das `zugferd:`-Feld in der Antwort. Der Code
zum Erzeugen und Einbetten bleibt — er ist in Ordnung, er ist nur nicht mehr
erreichbar.

**Die XRechnung-Route wird nicht gelöscht, sondern antwortet 410.** Ein
gesetztes Lesezeichen soll einen Satz bekommen, kein Rätsel:
*„E-Rechnungen entstehen erst beim Abrechnen. Ein Angebot ist keine Rechnung
und bekommt deshalb keine E-Rechnungs-Datei."* Der Menüeintrag ist beim
Product Designer raus.

**Sperrklinke:** `src/lib/__tests__/erechnung-abgeschaltet.test.ts`. Neben der
Wahrheitstabelle steht dort ein Scan über `src/app/api`: Jede Datei, die
`zugferd/generateXML` oder `zugferd/embedXML` importiert, **muss**
`eRechnungErlaubt` abfragen. Eine neue Route, die das vergisst, macht den Test
rot. Nachgemessen: genau vier Dateien fassen ZUGFeRD an, alle vier fragen.

**Für den Tag mit echten Rechnungen:** `'rechnung'` in
`E_RECHNUNG_DOKUMENTTYPEN` aufnehmen — alle vier Stellen leben wieder auf,
ohne dass eine vergessen werden kann. Gegenprobe gemacht.

**Offen bleibt** die zweite Bitte von Legal: das PDF/A-3b-Versprechen einmal
durch veraPDF oder Mustang schicken. Hängt nicht an dieser Entscheidung.

### M-2 — Mindestauftragswert: Standard 0

**Der Fund war präziser als gedacht.** Nachgesehen, bevor gebaut:

- Die Datenbankspalte `companies.mindestauftragswert` hat **keinen** Default
  (NULL).
- `mindestauftragsPosition()` liest NULL bereits als 0, also als „aus".
- In der Produktionsdatenbank steht bei **keinem einzigen Betrieb** 180 —
  sechs mal NULL, zwei mal 0.

Die 180 € kamen ausschließlich aus dem Einstellungsformular, und dort aus zwei
Zeilen: Das Feld zeigte `mindestauftragswert ?? 180`, und beim Speichern ging
`mindestauftragswert ?? 180` in die Datenbank. Damit genügte **ein Besuch der
Einstellungen wegen irgendeiner anderen Sache** — IBAN, Steuernummer,
Logo — um sich einen Mindestauftragswert einzuhandeln, von dem man nichts
wusste. Manfred hatte ihn deshalb noch nicht gespeichert; er hat ihn im
Formular stehen sehen und richtig misstraut.

Kein Backfill nötig, keine Migration. Geändert wurde:

- Feld zeigt 0, Platzhalter 0, Speichern schreibt `?? 0`.
- Die Konstante heißt nicht mehr `MINDESTAUFTRAGSWERT_VORSCHLAG`, sondern
  **`MINDESTAUFTRAGSWERT_ORIENTIERUNG`**. Die Umbenennung ist kein Kosmetik:
  Ein Vorschlag, der sich selbst einträgt, war genau der Fehler, und der alte
  Name lud dazu ein.
- Die 180 € leben weiter — als Satz im Hilfetext: *„0 € = aus. Es kommt nichts
  dazu. Wenn du einen Mindestauftragswert willst, trag ihn hier ein — viele
  Betriebe liegen bei rund 180 €, etwa drei Arbeitsstunden."*

**Sperrklinke:** `src/lib/__tests__/mindestauftragswert.test.ts` scannt
`src/app` und schlägt an, sobald der Orientierungswert wieder als Ersatzwert
(`?? …`) oder als Feldinhalt (`value={…}`) auftaucht.

### Die Regel, die beide Punkte teilen

Beide Fehler sahen im Code harmlos aus — ein `??` hier, eine Bedingung dort.
Beide wurden dadurch gefährlich, dass die Stelle, an der entschieden wird,
nicht die Stelle war, an der jemand nachsieht. Deshalb steht bei beiden jetzt
**eine** Entscheidungsstelle und **ein** Test, der prüft, dass niemand daran
vorbeikommt — nicht zwei richtig gesetzte Werte.

*Head of Product Engineering · 2026-09-14*

---

## CoS-E-052 entschieden — und beim Nachmessen eine scharfe Falle gefunden, die ich selbst gelegt hatte

**Datum:** 2026-09-14 · **An:** Chief of Staff · **Bezug:** Spur 3 Nr. 4,
gekoppelt an Fassung 3 des Preislisten-Konzepts

Unter der Nummer CoS-E-052 stecken **drei** Defekte, nicht einer. Zwei sind
erledigt, der dritte war der eigentliche.

### Teil 1 ✅ — Die Kennungen passten nicht

`maler` / `boden_parkett` im Onboarding gegen `malerarbeiten` / `bodenbeläge`
/ `maler_fassade` in den Vorlagen. Behoben am 12.09. mit der
Zuordnungstabelle `GEWERK_VORLAGEN`: 18 Gewerk-Kennungen, 0 ohne Treffer
(vorher 13 von 18). Maler bekommt 83 Vorlagen statt 5, Boden 48.

### Teil 2 ✅ — Die Entsorgungsregel feuerte bei jedem Gewerk

Behoben mit `ENTSORGUNG_STANDARD` (abbruch, entrümpelung, rohbau). Deine
Bitte — *„nicht mehr bei einem Maler landen, der zweimal im Jahr einen
Container braucht"* — ist damit erfüllt, und zwar als Liste statt als
Bedingung, die von einem Fehler abhing.

### Teil 3 🔴 — Zwei Preisquellen, und mein eigener Fix hätte sie scharf gemacht

**Das ist der Punkt, auf den du mit den „zwei parallelen Preisquellen" gezeigt
hast. Er ist schlimmer als beschrieben.** Nachgemessen am echten Katalog:

| | Maler | Boden |
|---|---|---|
| Vorlagen (was er im Onboarding sieht und eintippt) | 83 | 48 |
| Basis-Katalog (was beim Speichern IMMER eingefügt wird) | 220 | 189 |
| **Titel, die in beiden vorkommen** | **41** | **35** |

Beide Quellen schreiben in dieselbe Tabelle `price_items`. Ein Titel, der in
beiden steht, wurde **zweimal** eingefügt — einmal mit dem Marktpreis, einmal
mit der Zahl, die der Handwerker eingetippt hat.

**Und dann entscheidet nichts mehr.** Der Matcher nimmt bei Gleichstand den
ersten Treffer (`score > bestScore`, bewusst so), geladen wird mit
`.order('category').order('title')` — bei identischer Kategorie **und**
identischem Titel gibt Postgres keine definierte Reihenfolge zurück. Ob im
Angebot seine 11,50 oder die 9,50 aus dem Katalog steht, wäre von Abfrage zu
Abfrage offen gewesen.

**Das ist Manfreds „Preise werden ausgewürfelt" (TN-094) — diesmal wirklich
gewürfelt.** Wir hatten TN-094 am 11.09. als vollständig erklärt abgehakt
(verschluckte Anstrichzahl, Kniestock schlägt Wand). Diese dritte Ursache lag
daneben und war nicht dieselbe Art Fehler: Die beiden anderen waren falsch,
aber wiederholbar. Diese hier ist nicht einmal wiederholbar.

**Warum es trotzdem noch nie passiert ist — und warum das die unangenehme
Pointe ist.** In der Produktionsdatenbank steht heute **kein einziger**
doppelter Eintrag (nachgesehen, `group by company_id, category, title, unit
having count(*) > 1` → leer). Grund: Die Vorlagen wurden wegen Teil 1 nie
gefunden. Manfred bekam fünf Felder, und fünf generische Posten kollidieren
mit nichts.

**Mein Fix aus Teil 1 hätte die Falle scharf gemacht.** Ab dem nächsten
Onboarding im Modus „Eigene Preise" wären es 41 Dopplungen gewesen, beim
ersten Betrieb, der seine Zahlen eintippt. Ein Fix, der einen zweiten Fehler
freischaltet, ist kein Fix.

### Die Entscheidung

**Nicht entdoppeln, sondern gar nicht erst zwei Zeilen erzeugen.**

Der Basis-Katalog liefert die Zeilen. Die im Onboarding eingetippten Zahlen
werden **auf ihn gelegt, bevor er eingefügt wird** — was er nennt, gilt; was
es im Katalog nicht gibt, kommt als eigene Zeile dazu. Eine Funktion,
`mischeEigenePreise` in `default-price-selection.ts`, ein Aufrufer im
Onboarding, kein zusätzlicher Datenbankweg.

Nachgemessen:

```
maler:         vorher 303 Zeilen (41 davon doppelt) → jetzt 262, doppelt: 0
boden_parkett: vorher 237 Zeilen (35 davon doppelt) → jetzt 202, doppelt: 0
Probe "Wand streichen 1x Anstrich": eingetippte 99,99 → im Ergebnis 99,99
```

Damit bekommt „Eigene Preise" zum ersten Mal eine Wirkung, die sich von
„Marktpreise" unterscheidet. Bisher war der Unterschied nicht falsch — er war
gar nicht da.

**Sperrklinke:** `src/lib/__tests__/onboarding-eine-preisquelle.test.ts`.
Läuft gegen den echten Katalog, für beide aktiven Gewerke, und prüft zusätzlich,
dass es überhaupt eine Überschneidung gibt — sonst prüfte der Test nichts.

**Warum das VOR dem Tätigkeiten-Umbau gebaut wurde und nicht danach:** Die
Frage, die du gekoppelt sehen wolltest, war *„werden die Kennungen
angeglichen"* — die ist gekoppelt und unten beantwortet. Die Dopplung ist es
nicht. Sie ist seit meinem Commit vom 12.09. eine geladene Waffe, und sie
wird durch den Umbau nicht kleiner, sondern größer (mehr Tätigkeiten, mehr
Vorlagen, mehr Überschneidung).

### Und die eigentliche Koppelungsfrage: wie wird geschnitten?

**Die Zuordnungstabelle bleibt und ist die richtige Form — unabhängig vom
Umbau.** Sie bildet ab: *was der Nutzer gewählt hat* → *welche
Vorlagenschlüssel gelten*. Genau diese Zwischenschicht macht den
Tätigkeiten-Umbau billig, weil er nur die **linke** Seite ändert:

| heute | nach dem Umbau |
|---|---|
| `maler: ['malerarbeiten', 'maler_fassade']` | `maler_innen: ['malerarbeiten']`<br>`fassade: ['maler_fassade']` |
| `boden_parkett: ['bodenbeläge']` | `boden: ['bodenbeläge']` |

**Kein Angleichen der Kennungen, keine Umbenennung in der Datenbank, keine
Migration.** Die alten Werte in `companies.gewerke` bleiben als Einträge in
derselben Tabelle stehen und zeigen weiter auf dasselbe — bestehende Betriebe
merken nichts.

Und ein Nebeneffekt, der für sich allein den Umbau rechtfertigt: Heute
bekommt ein reiner Innen-Maler über `maler` **41 Fassadenzeilen**, die er nie
braucht. Der Umbau nimmt sie ihm ab, ohne dass jemand eine Zeile pflegen muss.

Der Vollständigkeit halber, weil es die Richtung bestätigt: `maler_fassade`
existiert in den Vorlagen bereits als eigener Schlüssel mit 41 Einträgen.
**Die Vorlagen kennen die Tätigkeitsebene längst, nur die Oberfläche nicht.**

### Was mir das über meine eigene Arbeitsweise sagt

Ich habe am 12.09. gemessen, ob die Vorlagen jetzt **gefunden** werden — 13
von 18 Kennungen ohne Treffer auf 0. Das war die richtige Zahl für die Frage,
die ich mir gestellt hatte. Ich habe nicht gemessen, **was mit ihnen
passiert, nachdem sie gefunden wurden.** Die Dopplung stand zwei Bildschirme
weiter unten in derselben Datei.

Regel für mich: **Wenn ein Fix einen Pfad zum ersten Mal erreichbar macht,
ist der Pfad ab da neuer Code** — auch wenn er seit einem Jahr dasteht und
nie angefasst wurde. Er gehört gelesen, nicht vorausgesetzt.

*Head of Product Engineering · 2026-09-14*

---

## CoS-E-053 — Schritt 3 und die Rechenseite von Schritt 4 stehen (14.09.2026)

Die Reihenfolge aus `preisliste-konzept.md` Fassung 3, Abschnitt 8. Schritte 1
und 2 waren schon erledigt (Vokabular, Dopplungen). Heute dazugekommen:

### Schritt 3 — der Materialanteil, mit dem Test vorweg

Der Prüfmeister hat verlangt, dass der Test **vor** dem Knopf geschrieben
wird. Ist er. Die Zusicherung, um die es geht, steht in
`materialanteil.test.ts` und läuft über den ganzen Katalog: **`arbeit +
material` ergibt auf den Cent den ursprünglichen Preis** — nicht ungefähr.
Deshalb wird nur das Material gerundet und die Arbeit als Rest gebildet, nie
beides einzeln.

**Absolut, nicht prozentual.** Ein Liter Wandfarbe wird nicht teurer, weil der
Betrieb einen höheren Stundensatz hat. Wer seinen Preis anhebt, hebt seine
Arbeit an. Ein Prozentsatz würde bei jeder Preiserhöhung stillschweigend
mitwachsen.

**Die Herleitung** läuft dagegen über einen Anteil, weil die Faustregel so
formuliert ist. Warum ich die fünf Euro-Werte des Prüfmeisters **nicht** in
den Katalog geschrieben habe: Sie stammen von Manfreds Preisniveau (Wand 2x =
11,50), der Katalog steht bei 9,50. Ein absoluter Wert aus einer fremden
Preiswelt wäre genau die stille Falschheit, die wir sonst überall wegräumen.
Seine Zahlen stehen deshalb im Test als **Prüfstein**: Unsere Anteile, gegen
seine Preise gerechnet, müssen seine Beträge treffen. Tun sie (2,88 gegen
3,00 · 2,75 gegen 2,50 · 2,50 gegen 2,50).

`price_items.material_anteil` ist angelegt, in Produktion **und** Staging,
idempotent, im Registry-Check als Nr. 61. Kein Backfill, kein Default: NULL
heißt „nicht selbst gesetzt", und dann wird abgeleitet. Das ist besser als ein
eingefrorener Backfill — ändert der Betrieb seinen Preis, stimmt der
abgeleitete Anteil weiterhin, ein gebackfillter nicht mehr.

**Zwei Dinge, die der Test gefunden hat, bevor es jemand anderes musste:**

**1. Meine Obergrenze war falsch.** Ich hatte „nie über ein Drittel" auf alles
angewandt. Der Prüfmeister hatte zwei Bänder genannt, nicht eines — für
Fassade und Boden ausdrücklich *„ein Drittel bis die Hälfte"*. Der Test wurde
rot, zu Recht.

**2. Der Schalter griff in fremde Gewerke.** Über das Verb „verlegen" bekamen
Erdkabel, Drainagerohre, Teichfolie, Bewässerungsschläuche,
Luftdichtigkeitsbahnen, Natursteinpflaster und PVC-Fenster („inkl. Element")
einen Materialschalter. Aus keinem dieser Berufe hat uns jemand etwas zum
Material gesagt. Das wäre dieselbe stille Entscheidung wie beim
Mindestauftragswert — nur in einem Bereich, in dem sie niemandem aufgefallen
wäre.

Drei Grenzen, die daraus entstanden sind und die ich für die wichtigere Hälfte
der Arbeit halte:

- **Zubehör sperrt vor Material.** Manfreds Liste wörtlich (Trittschall,
  Kleber, Übergangsprofil) plus dieselbe Familie. Nötig, weil
  „Teppich**unterlage** verlegen" das Wort Teppich enthält und
  „**Sockelleiste** / Fliesensockel verlegen" das Wort Fliesen. Ohne diesen
  Vorrang zöge der Schalter dem Bodenleger genau die Zeilen auseinander, die
  zusammengehören.
- **Rückbau und Reinigung nennen einen Belag und verbrauchen keinen.**
  „Teppichboden entfernen + entsorgen", „Parkett reinigen und pflegen". Wer
  hier einen Schalter hinsetzt, bietet an, den Belag, den er herausreißt, vom
  Kunden stellen zu lassen.
- **„streichfertig" ist kein Anstrich.** Ein Q3-Spachtel verbraucht keine
  Farbe.

Ergebnis: **140 Katalogzeilen** bekommen einen Schalter — Maler 84, Boden 45,
Fliesen 5, Fassade 6. Kein fremdes Gewerk, und ein Test hält das fest.

### Schritt 4 — die Rechenseite. Der Bildschirm ist DC-102.

`src/lib/taetigkeiten.ts`: fünf Tätigkeiten, jede mit ihrem Material-Standard,
ihren Vorlagenschlüsseln und ihren Katalogrubriken. Dazu die Übersetzung aus
den alten Gewerk-Kennungen — **ohne Migration**: `companies.gewerke` bleibt
stehen und bedeutet weiter dasselbe.

**Den Bildschirm baue ich nicht.** Das ist DC-102 beim Product Designer, und
Spur 4 Nr. 3 sagt ausdrücklich „Entwerfen ja, einbauen noch nicht". Was er
braucht, liegt jetzt bereit: die Haken, die Beschriftungen, die Standards und
was ein Antippen bewirkt.

**Auch hier hat das Bauen einen Fehler in meinem eigenen Konzept gefunden.**
In Fassung 3 stand „Tapezieren · **ohne Tapete**". Manfred zählt Vlies aber
unter *„Innen (Wand, Decke, Lack, Vlies)"* auf — mit Material **drin**. Ich
hatte aus seinem Beispiel für den *seltenen* Fall (*„Vlies tapezieren immer
ohne Tapete"* — genau der Fall, für den er ausdrücklich keine eigene Ebene
wollte) einen *Standard* gemacht. Korrigiert, und im Konzept als Korrektur
kenntlich.

Und ein zweiter, kleinerer: Meine Rubrikliste für „Innen" zählte die
Kategorien einzeln auf und übersah zwei — „Maler – Bodenbeschichtung" (Boden
streichen) und „Maler – Stuck & Dekorative Techniken" (Stuckleisten
streichen). Jetzt eine Auffangregel: alles aus dem Maler-Katalog gehört zu
Innen, außer was eine längere Rubrik beansprucht. Eine Aufzählung veraltet mit
der nächsten neuen Rubrik, eine Auffangregel nicht.

### Was als Nächstes dran ist — und woran es hängt

| Schritt | Lage |
|---|---|
| 5 · Knopf an der Zeile | Rechenseite steht (`teileMaterialAb`, `halbsatz`, `kundensatz`). **Oberfläche wartet auf DC-102.** |
| 6 · Preisliste dreigeteilt | frei, kein Blocker |
| 7 · Rückfrage im Angebot statt „Preis fehlt" | frei |
| 8 · Onboarding mit Tätigkeiten | wartet auf DC-102 |
| 9 · Lernfrage nach dem dritten Mal | zuletzt, braucht Nutzung |

**An den Product Designer:** Für DC-102 steht die Datenseite bereit. Sag
Bescheid, wenn du für den Entwurf etwas brauchst, das anders geschnitten sein
müsste — jetzt ist es billig zu ändern.

**An den Prüfmeister:** Deine Probe („Angebot mit beiden Logiken nebeneinander,
Material herausziehen, nachrechnen ob die Summe um genau den Materialanteil
fällt") lässt sich für die Rechenseite schon jetzt fahren. Was noch fehlt, ist
der Knopf, der sie in der laufenden App auslöst.

*Head of Product Engineering · 2026-09-14*

---

## Die zwei roten Tests, und PM-013-A (15.09.2026)

### Die zwei roten Tests waren beide meine — aber aus zwei verschiedenen Gründen

**Der Chief of Staff hat beide falsch zugeordnet**, und das gehört richtiggestellt,
weil die eine Fehldiagnose gefährlich ist: In `arbeitsreihenfolge.md` steht,
`materialanteil.test.ts` sei *„bewusst vor der Funktion geschrieben (TDD), rot
ist hier erwartet"*. Das ist nicht so. Die Funktion war fertig und lief; rot war
eine Zusicherung darin. **Ein Test, der als „erwartet rot" abgelegt wird, hört
auf, ein Test zu sein** — genau die Gewöhnung, die den Nachtestplan am 07.09.
schon einmal ausgehöhlt hat.

**1. `materialanteil.test.ts` — meine Zusicherung war zu eng.**

```
expect(teile.arbeit).toBeCloseTo(8.5, 1)   → 8.62, Toleranz ±0,05
```

Manfred sagt „8,50 plus Farbe". Die Faustregel (ein Viertel) kommt auf
8,62 + 2,88. Zwölf Cent daneben. Der Fehler war die **Zusicherung**, nicht die
Zahl: Eine Regel, die für 140 Katalogzeilen gilt, kann seine eine Zeile nicht
auf den Cent treffen — und wenn sie es täte, wäre sie auf ihn hingebogen statt
hergeleitet. Dass im selben File weiter unten derselbe Sachverhalt mit ±0,50
geprüft wurde, war ohnehin ein Fehler: zwei Schärfen für eine Aussage. Jetzt
überall dieselbe, und die harte Zusicherung (Summe auf den Cent) bleibt hart.

**2. `taetigkeiten.test.ts` — der Fix war gebaut, aber nicht auf der Platte.**

Die zwei gemeldeten Rubriken („Maler – Bodenbeschichtung", „Maler – Stuck &
Dekorative Techniken") hatte ich am 14.09. gefunden, behoben und nachgemessen.
Der Commit hat trotzdem die **alte** Fassung geschrieben: 6.352 Bytes auf dem
Gerät gegen 6.808 bei mir. Kein Merge-Konflikt, keine Fehlermeldung — der
Schreibvorgang meldete Erfolg.

Das ist derselbe stille Fehlschlag, den ich am 13.09. schon einmal hatte und
bei dem ich mir notiert hatte, **nach jedem Schreiben neu einzulesen und zu
vergleichen.** Ich habe es bei den Dokumenten getan und bei dieser Datei
vergessen. Ab jetzt ausnahmslos: schreiben, zurücklesen, Bytes vergleichen,
und erst dann „fertig" sagen.

Und der Chief of Staff hat recht mit dem, was er darüber schreibt: Beide
Dateien liefen nur lokal. **Die CI hat im ersten Lauf geliefert, wofür sie da
ist.**

---

### PM-013-A — der Fund stimmt, die Ursache lag woanders, und sie war teurer

**Die Meldung:** *„Nachgestellt, mit der Dehnungsfuge zusätzlich als Arbeit in
der Extraktion: es entsteht keine Position. Im Quelltext erzeugt sie auch
niemand — kein Treffer in `boden.ts` oder den Vollständigkeits-Dateien."*

**Beides stimmt, und trotzdem gibt es die Dehnungsfuge seit dem 19.08.** Sie
steht in `mengen/aufnahme-hinweise.ts` und hat **vier** Nachtests hinter sich:
Chip-Titel, Rohtext-Fallback als der Chip einmal nicht lieferte, Verneinung
(„keine Dehnungsfuge nötig"), und der Whisper-Verhörer „DEHNUNGSFUHRE".

Gefehlt hat sie im **Prüfstand**. `lauf()` in `pruefmeister-nachtest-0709.test.ts`
endet nach der Vollständigkeitsprüfung; die echte Route legt danach noch
`ergaenzeAusAufnahmeHinweisen` darüber (`entwurf/generiere-positionen` Z. 266).
Wer dort sucht, findet nichts.

**Das ist derselbe Befund, den der Prüfmeister in derselben Datei über PM-037
selbst notiert hat** — *„Der Fall war grün, nur hat ihn niemand an der Stelle
geprüft, an der die Positionen entstehen."* Hier ist es dieselbe Lücke eine
Stufe weiter. Ich habe `lauf()` deshalb um die fehlende Stufe ergänzt, statt
den Einzelfall zu reparieren; damit sehen **alle** Fälle dieser Datei jetzt,
was das Produkt wirklich baut.

#### Der eigentliche Fehler lag eine Ebene tiefer — und er kostete 45 €

Nachgemessen am Transkript ohne Längenangabe, vor der Änderung:

```
Dehnungsfuge einbauen — Wohnzimmer · 1 Stück · 45,00 €
```

Im Code steht seit dem 19.08. die Begründung, warum „1 Stück" vertretbar sei:
*„Fehlt dadurch ein passender Katalogpreis, bleibt die Position sichtbar mit
0,00 € offen."* **Diesen fehlenden Preis gab es nicht.** Der Katalog führte die
Arbeit ein zweites Mal als „Dehnungsfuge einbauen" zu 45,00 €/Stück. Die
angenommene Eins bekam also einen echten Preis und stand mit 45 € auf dem
Kundenpapier — aus einer Menge, die niemand genannt hat.

**Das Sicherheitsnetz, auf das sich der Fix stützte, hat nie existiert.** Genau
die Sorte Annahme, die in diesem Projekt immer wieder zuschlägt: Die Begründung
war schlüssig, nur hat niemand nachgesehen, ob ihre Voraussetzung gilt.

#### Was jetzt gebaut ist

1. **Die Stück-Zeile ist raus** — aus dem Katalog (`default-prices.ts`, 189 →
   188 Boden-Zeilen) und aus den Preislisten bestehender Betriebe (Migration
   Nr. 62, Produktion und Staging; drei Zeilen, keine von einer
   Angebotsposition verwendet — vorher nachgesehen, und die Bedingung steht
   trotzdem im DELETE).
   Entscheidung des Prüfmeisters: eine Arbeit, eine Einheit — lfdm zu 18,00 €.
2. **Ohne Längenangabe** bleibt „1 Stück angenommen — bitte Anzahl/Länge
   prüfen" — jetzt aber **ohne Preis**, und damit greift der Versand-Riegel
   (`versandbereit.ts`). Das Angebot kommt nicht zum Kunden, bis der Handwerker
   die Menge gesetzt hat. So wirkt das Netz, das hier von Anfang an gemeint war.
3. **Mit Längenangabe** entsteht die richtige Zeile: „Dehnungsfuge mit
   Bewegungsprofil herstellen", in lfdm, zu 18,00 €. Auch bei gesprochener Zahl
   („sechs Meter") und mit Komma („4,5 laufende Meter").

**Was ich bewusst NICHT gebaut habe — und erst falsch gemacht hatte.** Mein
erster Anlauf war eine neue Regel `pruefeDehnungsfuge` in `boden-sonder.ts`,
genau dort, wo der Prüfmeister gesucht hatte. Sie lief grün. Sie wäre der
**zweite Erzeuger** derselben Position gewesen — neben einer Erkennung, die
vier Nachtests und einen Whisper-Verhörer überstanden hat. Das ist der doppelte
Vertrag, den wir sonst überall abräumen, und ich hätte ihn selbst gelegt. Die
Regel ist zurückgenommen; geändert wurde die vorhandene Stelle.

Die Erkennung selbst ist unangetastet: Verneinung, Chip-Fallback und
„Dehnungsfuhre" sind nachgemessen und laufen weiter.

#### An den Prüfmeister

Dein Soll lautete: *„Fällt ‚Dehnungsfuge' im Diktat, entsteht eine Position.
Ohne Meterangabe keine geschätzte Menge, sondern sichtbarer Platzhalter."* Der
zweite Satz ist jetzt buchstäblich erfüllt — die Position ist da, die
angenommene Eins trägt keinen Preis mehr und blockiert den Versand, bis jemand
hinsieht. Deine Entscheidung zur Einheit ist umgesetzt.

**Eine Sache zum Nachprüfen, wenn du magst:** Ich habe deinen Prüfstand um die
Aufnahme-Stufe ergänzt. Dadurch sehen **alle** Fälle in
`pruefmeister-nachtest-0709.test.ts` jetzt mehr als vorher — die Chips baue ich
darin aus den Arbeiten der Räume, so wie die Karten-Erkennung sie liefern muss.
Wenn dir an dieser Nachbildung etwas nicht passt, sag es: Sie entscheidet ab
jetzt mit, was deine sechs Fälle prüfen.

Und dein Nebenbefund zu `pruefmeister-soll.test.ts` (ruft `berechneMengen`
direkt, sieht Leibungen und Mehrgewerk nie) steht noch offen. Er ist nach heute
eher wichtiger geworden: Es sind **zwei** Stufen, die dort fehlen, nicht eine.

*Head of Product Engineering · 2026-09-15*

---

## CoS-E-053 — die Ableitung ist gebaut (15.09.2026)

Schritt 3/4 der Reihenfolge aus `preisliste-konzept.md` Fassung 3: aus fünf
genannten Zahlen werden vierzig. `src/lib/preis-ableitung.ts`, mit den beiden
Proben des Prüfmeisters als laufendem Test.

**Grundlage:** der Entwurf des Product Designers (`dc-102-preise-prototyp.html`)
und dessen fachliche Durchsicht (PD-009). Alle Funde eingebaut; die
ausführliche Antwort steht bei ihm in `pruefmeister-notizen-fuer-designer.md`.

### Was die Bauweise bestimmt hat

Der schärfste Fund der Durchsicht war nicht die Fläche-oder-Zeit-Frage, sondern
dass die **Basiswerte im Entwurf vom Standardkatalog abwichen** — „Vliestapete
kleben" stand auf 9,00 € statt 18,00 €. Weil der Faktor `mein / basis` ist,
verzieht eine falsche Basis **jede** Zeile dieser Tätigkeit: Ein Betrieb, der
seine echten 18,00 € einträgt, hätte den Faktor 2,0 bekommen und „Raufaser
kleben" bei 15,20 € statt 10,00 €.

Die Antwort darauf ist der Kern der Datei: **Keine einzige Basiszahl steht
darin.** Jede Zeile nennt ihren Katalogtitel, Preis und Einheit kommen aus
`default-prices.ts`. Damit kann eine Basis nicht mehr abweichen, weil es keine
zweite gibt — dieselbe Regel wie bei CoS-E-052 Teil 3, nur eine Ebene höher:
eine Quelle, nicht zwei.

### Drei Fehler, die meine eigenen Tests gefunden haben

Der Prüfmeister hatte zwei Proben **angekündigt**, bevor etwas gebaut war. Ich
habe sie als Erstes gebaut, und sie haben sofort geliefert:

**Das Runden machte die erste Probe unmöglich.** Der Entwurf rundet auf 0,50 €.
Bei „Sockelleisten abkleben" (0,80 €/lfdm) ist das eine Quantisierung von 60 %:
0,78 € und 1,12 € landen beide auf 1,00 €. Der Unterschied zwischen einem
Betrieb mit 52 €/h und einem mit 75 €/h verschwand vollständig — und die Zeile
sah dabei richtig aus. Jetzt: unter 5 € auf 10 Cent.

**Drei Zeit-Zeilen hatten einen Katalogzwilling, der keiner war.** Ich hatte
jeder Zeit-Zeile einen ungefähr passenden Katalogtitel gegeben, damit sie eine
Einheit hat. Der teuerste Fehlgriff: „Boden reinigen" (je m²) bekam
„Baustelle kehren / saugen nach Verlegung" — **35,00 € je Pauschale.** Die
Einheit kam mit, Pauschalen werden auf 5 € gerundet, **Ergebnis: 0,00 €.**

Das ist genau die Zeile, die der Versand-Riegel abfangen müsste, und sie wäre
aus einem Zuordnungsfehler entstanden, den man an keinem Bildschirm sieht.
Dieselbe Familie wie die Dehnungsfuge heute Morgen: Eine Zeile borgt sich
etwas von einer Zeile, die nur ähnlich heißt.

**Regel, die jetzt im Code steht und die ich mir merke:** Ein Zwilling, der
„so ungefähr passt", ist kein Zwilling. Wenn zwei Zeilen dieselbe Einheit haben
müssen, damit die Rechnung stimmt, gehört das geprüft und nicht angenommen.

### Stand der Reihenfolge aus Fassung 3

| Schritt | Lage |
|---|---|
| 1 Vokabular · 2 Dopplungen | ✅ |
| 3 Materialanteil je Katalogzeile | ✅ 14.09. |
| 4 Tätigkeiten statt Gewerke (Modell) | ✅ 14.09. |
| **Ableitung aus den Ankern** | ✅ **15.09.** — 31 Zeilen, beide Proben grün |
| 5 Knopf an der Zeile · 8 Onboarding | Oberfläche, DC-102 |
| 6 Preisliste dreigeteilt · 7 Rückfrage im Angebot | frei, noch nicht angefangen |
| 9 Lernfrage nach dem dritten Mal | zuletzt, braucht Nutzung |

### Zwei Dinge für andere

**An den Prüfmeister** (steht auch bei ihm): Der Anker fürs Lackieren steht auf
„Tür streichen / lackieren (beidseitig)" 75,00 €. Daneben führt der Katalog
„Innentürblatt lackieren beidseitig" zu 90,00 €. Manfreds Bezugsgröße ist *„pro
Tür mit Zarge, beidseitig"* — das ist keine von beiden ganz. Seine Entscheidung.

**An den Chief of Staff:** `docs/arbeitsreihenfolge.md` steht auf dem Rechner
wieder auf dem Stand vom **14.09., 16:00** — die Fassung vom 15.09., 06:35 ist
dort nicht mehr. Vermutlich beim Aufräumen rund um den blockierten Push
verlorengegangen. Ich habe sie nicht angefasst; die Datei gehört dir und wird
ohnehin ersetzt, nicht ergänzt. Nur damit Sandy nicht nach einem Stand arbeitet,
der DC-100, M-2 und CoS-E-052 noch als offen führt.

### Nachtrag nach dem Testlauf — ein roter Test, und er hatte recht

`preis-ableitung.test.ts` meldete: **„Fassade streichen 1x Anstrich"** trägt den
Hinweis „ohne Vorbereitung, die zählt extra" nicht. Ich hatte ihn nur an die
zwei Innen-Zeilen gehängt.

Nachgerechnet, ob der Hinweis außen überhaupt gilt:

```
Wand    1x/2x   6,00 /  9,50 = 63 %
Decke   1x/2x   7,00 / 11,00 = 64 %
Fassade 1x/2x   9,00 / 14,00 = 64 %
```

Dieselbe Quote — und Grundierung, Reinigen und Rissarbeiten sind auch außen
eigene Katalogzeilen, zählen also genauso extra. Der Hinweis gehört dran; die
Lücke war in der Tabelle, nicht im Test.

**Der Unterschied zu gestern ist mir wichtig.** Gestern war ein roter Test von
mir zu eng zugeschnitten und die Zusicherung musste weichen. Heute war der Test
breiter, als ich beim Schreiben der Tabelle gedacht hatte — und genau deshalb
hat er etwas gefunden. Eine Zusicherung über *alle* Zeilen einer Art ist mehr
wert als eine über die drei, an die man gerade denkt. Beim nächsten roten Test
ist das die erste Frage: Ist die Zusicherung zu breit, oder sind die Daten
unvollständig?

*Head of Product Engineering · 2026-09-15*

---

## PD-010 gebaut — der Lackier-Anker, und ein Fund, der ein Ticket braucht (15.09.2026)

Der Prüfmeister hat den offenen Punkt aus PD-009 entschieden: Anker fürs
Lackieren ist `Türen lackieren (2× Anstrich)`, 90,00 €. Gebaut, samt dem
Aufräumen, das er mit angehängt hat. Ausführlich in
`pruefmeister-notizen-fuer-designer.md`; hier das, was über den Einzelfall
hinausgeht.

### Sein Fund, kurz

Für **eine** Innentür führte der Katalog fünf Zeilen in zwei Rubriken, für die
Zarge drei. Die billigeren lagen in „Maler – Anstrich Innen" statt in
„Maler – Lackierarbeiten" — also in der **falschen Tätigkeit**. Ein Betrieb,
der den Lackier-Haken nicht setzt, bekam seine Türen trotzdem bepreist: 15 €
zu niedrig und ohne je nach dem Preis gefragt worden zu sein.

Erledigt: vier Zeilen raus, eine umbenannt, Migration Nr. 63 in Produktion und
Staging. Maler-Katalog 220 → 216.

### Zwei Folgen, die in seiner Liste nicht stehen konnten

**1. Eine der fünf Streichungen ging nicht.** `Türrahmen streichen` ist ein
**Engine-Titel** — `maler-extras.ts` erzeugt beim Wort „Türrahmen" zwei
Positionen, schleifen und streichen. Ohne Katalogzeile stünde die zweite ohne
Preis da. Dahinter steckt aber sein eigenes Thema eine Ebene tiefer: **Die
Engine hat zwei Vokabeln für ein Bauteil** — „Türzarge" in
`maler-lackieren.ts`, „Türrahmen" in `maler-extras.ts`. Der Katalog hat die
Dopplung nur gespiegelt. Zeile bleibt, Frage liegt beim Prüfmeister.

**2. Die Streichung ändert einen sichtbaren Preis.** Die entfallene Zeile war
zugleich die **Standardzeile** der Familie „Tür streichen/lackieren"
(CoS-E-051). Wer „Tür lackieren" sagt, ohne einseitig/beidseitig zu nennen,
bekam 45,00 €; jetzt 55,00 €. Nicht weil etwas teurer wurde, sondern weil
vorher die billigere von zwei Dubletten gewann. Gehört gesagt, damit es nicht
als stille Erhöhung durchgeht.

### 🔴 Der Fund, der ein eigenes Ticket braucht: 164 Vorlagen zeigen ins Leere

Beim Nachmessen, ob noch andere Onboarding-Vorlagen auf nicht existierende
Katalogzeilen zeigen:

```
Vorlagen gesamt: 832 · ohne Katalogzeile: 164 (20 %)
aktiv:       malerarbeiten 1 · bodenbeläge 13 · maler_fassade 1
nicht aktiv: schreiner 24 · estrich 23 · elektro 19 · sanitär 19 ·
             trockenbau 17 · dachdecker 17 · putz_stuck 10 · garten 6 …
```

Es sind **keine fehlenden Arbeiten, sondern andere Schreibweisen derselben**:
„Laminat verlegen schwimmend (Standard)" gegen „Laminat verlegen, schwimmend".

**Und es ist seit gestern scharf.** Bis zum 14.09. wurden die Vorlagen wegen
der falschen Gewerk-Kennungen nie gefunden (CoS-E-052 Teil 1). Seit dem Fix
legt das Onboarding jede Vorlage ohne Katalog-Zwilling als **eigene Zeile** an
(CoS-E-052 Teil 3, `mischeEigenePreise` → `zusaetzlich`). Ein Bodenleger
bekommt damit beide Schreibweisen in seine Liste — zwei Zeilen, eine Arbeit.

**Das ist derselbe Mechanismus wie die 41 Dopplungen von gestern, nur eine
Tür weiter.** Gestern waren es Vorlagen, die den Katalogtitel exakt trafen und
deshalb doppelt eingefügt wurden; heute sind es Vorlagen, die ihn **knapp
verfehlen** und deshalb als „neu" durchgehen. Ich habe gestern die eine Hälfte
zugemacht und die andere nicht gesehen, weil ich auf Gleichheit geprüft habe
und nicht auf Ähnlichkeit.

**Warum ich es nicht selbst korrigiert habe:** Es sind Wortlaute, und die
entscheidet der Prüfmeister (CoS-E-037). Die vierzehn Zeilen der aktiven
Gewerke wären ein kurzer Durchgang; die 150 der noch nicht freigeschalteten
haben Zeit, gehören aber vor die Freischaltung des jeweiligen Gewerks.

**Vorschlag für die Sperrklinke, sobald die Wortlaute stehen:** ein Test, der
verlangt, dass **jede** Vorlage einen Katalog-Zwilling hat — dieselbe Bauart
wie `onboarding-eine-preisquelle.test.ts`. Solange die 164 offen sind, wäre er
rot; deshalb steht er noch nicht da. Sobald die aktiven Gewerke sauber sind,
kann er für diese scharf gestellt werden und wächst mit jeder Freischaltung.

### Die Regel, die ich daraus mitnehme

Gestern habe ich geprüft: *Trifft die Vorlage eine Katalogzeile exakt?* Das
war die richtige Frage für die Dopplung, die ich gesucht habe — und sie hat
die Fälle übersehen, die knapp danebenliegen. **Wenn zwei Listen dasselbe
meinen sollen, ist „stimmt exakt überein" nur die halbe Prüfung. Die andere
Hälfte ist: Was steht in der einen und hat in der anderen nichts, das ihm
ähnlich sieht?**

*Head of Product Engineering · 2026-09-15*

---

## „Fläche oder Zeit" — vorbereitet statt entschieden, und dabei eine Zusicherung gefunden, die an einer Zahl hing (15.09.2026)

Spur 3 Nr. 2: *„Fläche oder Zeit fachlich klären (mit Prüfmeister)."* Die
Einteilung ist Fachwissen und gehört ihm — was ich beitragen kann, sind
Zahlen. Die vollständige Vorlage steht bei ihm in
`pruefmeister-notizen-fuer-designer.md` als **PD-011**; hier das, was über die
Übergabe hinausgeht.

### Der Befund, der die Einteilung stützt

Vier der acht Zeit-Zeilen haben einen echten Katalog-Zwilling. `Katalogpreis /
Stunden` sagt für jede, welchen Stundensatz der Katalog an dieser Stelle
unterstellt:

```
Sockelleisten abkleben 53,3 · Altkleber abschaben 53,3
Sockelleisten montieren 55,0 · Übergangsprofil 51,7   →  Spanne 6 %
```

Vier unabhängig geschätzte Zeilen, ein Stundensatz. Die Zeit-Spalte ist damit
gegengerechnet und nicht nur behauptet.

### 🔴 Und der Grund, warum ich das als Test hinterlegt habe

Probe 2 des Prüfmeisters (*„abgeleitet gegen Katalog, über 20 % ist falsch"*)
lief seit gestern als `pruefeGegenKatalog(52)`. **Diese 52 war die halbe
Aussage.** Nachgemessen, über welche Stundensätze die Probe hält:

```
grün von 44 bis 63 €/h · darunter und darüber rot
bei 75 €/h vier Zeilen daneben, bis +47 % (Übergangsprofil 22 statt 15)
```

Das ist kein Fehler — Zeit-Zeilen folgen dem Stundensatz, Anker-Zeilen dem
Ankerpreis, und ein Betrieb mit 75 €/h *soll* seine Zeitarbeit teurer anbieten.
Aber es heißt: Die Zusicherung stand auf einer Zahl, die im Test steht, nicht
auf einer Eigenschaft der Daten. Wer die 52 nicht kennt, liest dort eine
Sicherheit, die es so nicht gibt.

**Jetzt steht die Frage eine Ebene höher und kommt ohne Stundensatz aus:** Die
vier unterstellten Sätze müssen zwischen 50 und 56 liegen und untereinander
unter 10 % auseinander. Ein verstellter Stundenwert fällt damit auf, ohne dass
man die richtige Zahl vorher kennen muss — die fünf Korrekturen aus PD-009 §3
wären hier aufgeschlagen. Dazu läuft Probe 2 nicht mehr bei einer Zahl, sondern
über 45 bis 60 €/h.

**Gegenprobe gefahren, bevor ich es „fertig" nenne** — zwei Mal absichtlich
kaputtgemacht: Stundenwert für „Sockelleisten abkleben" von 0,015 auf 0,04
zurückgedreht → unterstellter Satz 20 €/h, Test rot. Fenster auf 45–70
geweitet → rot ab 64 €/h. Die Zusicherung hat also Zähne.

### Die drei Stellen, an denen die Einteilung Geld bewegt

Für den Prüfmeister ausgerechnet, jeweils gleicher Stundensatz und nur der
Ankerpreis angehoben:

| | Spalte | Katalogbetrieb | teurer Betrieb |
|---|---|---|---|
| Altbelag aufnehmen, verklebt | `anker` | 9,00 | **16,00** |
| Kleberreste entfernen | `zeit` | 8,00 | **8,00** |
| Boden abdecken | `anker` | 1,20 | **1,60** |
| Sockelleisten abkleben | `zeit` | 0,80 | **0,80** |
| Türen abschleifen | `anker` | 20,00 | **27,00** |

Jeweils Nachbarzeilen im selben Auftrag, dieselbe Art Arbeit, verschiedene
Spalte. Das ist die Frage, die er beantworten muss, und mit diesen Zahlen
braucht er dafür keine 35 Zeilen durchzugehen, sondern drei.

### Was ich nicht getan habe

Keine Zeile umsortiert. Eine Umsortierung ist je ein Wort plus eine
Stundenzahl; sie jetzt zu raten hieße, ihm die Entscheidung abzunehmen und
gleichzeitig die Gegenprobe zu verlieren, die der Test erst möglich macht.

### Die Regel, die ich mitnehme

**Eine Zusicherung, die von einem Eingabewert abhängt, prüft den Eingabewert
mit — auch wenn im Test nur das Ergebnis steht.** Probe 2 sah aus wie eine
Aussage über die Stundenwerte und war eine Aussage über die Stundenwerte *bei
52 €/h*. Die Frage beim nächsten Test mit einer Zahl darin: Gilt der Satz auch
eine Zahl weiter — und wenn nein, gehört die Spanne in den Test, nicht die
Zahl.

*Head of Product Engineering · 2026-09-15*

---

## CoS-E-055 🔴 — Erster Testlauf der CI seit dem 11.09.: sieben Zusicherungen rot

**Datum:** 2026-09-15, Chief of Staff
**Status:** ❌ offen — liegt bei Head of Product Engineering

Seit CoS-P-018 (ESLint startete gar nicht) hat die CI seit dem 11.09. **keine
Tests ausgeführt**. Mit Commit `2f93123` („lint:ci max-warnings 109→110")
läuft der Lint-Schritt wieder durch — und damit sind zum ersten Mal seit vier
Tagen die Tests auf dem Server gelaufen. Ergebnis: **rot**.

**Geprüft, nicht vermutet:** GitHub-Actions-Lauf `34969779950`, Workflow „CI",
Job `quality`, Commit `2f93123`, abgeschlossen 15.09.2026 12:35 UTC, Ergebnis
`failure`. Im Lauf stehen **keine ESLint-Fehler** mehr, nur Warnungen — der
Lint-Teil ist damit belegbar erledigt. Rot sind die Tests.

**Die sieben roten Zusicherungen, wörtlich aus dem Lauf:**

1. `src/lib/__tests__/taetigkeiten.test.ts` › Tätigkeiten und Materialschalter decken sich › jede Position mit Schalter gehört zu genau einer Tätigkeit
2. `src/lib/__tests__/preis-ableitung.test.ts` › Die Herkunftszeile beantwortet die 63-%-Frage (PD-009 §5) › 1x-Zeilen sagen, dass die Vorbereitung extra zählt
3. `src/lib/__tests__/pd010-tueranker.test.ts` › Der Anker ist die Zeile, die die Engine selbst erzeugt › der Heizkörper hängt am Türpreis, nicht am Quadratmeterpreis der Wand
4. `src/lib/__tests__/pd010-tueranker.test.ts` › Der Anker ist die Zeile, die die Engine selbst erzeugt › Anker = „Türen lackieren (2× Anstrich)" zu 90,00 €
5. `src/lib/__tests__/pd010-tueranker.test.ts` › 🔴 Die Probe des Prüfmeisters: eine Tür, keine zweite Rubrik › die vier Altlast-Zeilen sind weg
6. `src/lib/__tests__/pd010-tueranker.test.ts` › 🔴 Die Probe des Prüfmeisters: eine Tür, keine zweite Rubrik › der Katalog führt zwei Türzeilen und eine Zargenzeile
7. `src/lib/__tests__/materialanteil.test.ts` › 🔴 Die Summe fällt um genau den Materialanteil › Manfreds Beispiel: 11,50 für Wand 2x wird 8,50 plus Farbe

**Was ich ausdrücklich NICHT behaupte:** ob das Regressionen aus den Commits
vom 12.–15.09. sind oder Zusicherungen, die vor der zugehörigen Funktion
geschrieben wurden. Der letzte Testlauf auf dem Server, der überhaupt
stattgefunden hat, liegt vor dem 11.09.; dazwischen liegen vier Tage Arbeit
ohne Serverprüfung. Der lokale Stand auf Sandys Rechner ist von hier aus nicht
ausführbar (Shell-Einhängung seit dem Windows-Update vom 08.09. defekt), also
sage ich über „lokal grün" nichts.

**Was ich brauche — pro Zeile eine von zwei Antworten, keine dritte:**

- **behoben** — mit dem Commit, der sie grün macht, oder
- **offen** — mit Datum und Bedingung, wann sie grün sein muss.

„Erwartet rot" gibt es nach der Regel von heute Vormittag nicht mehr. Wenn
eine Zusicherung zu eng formuliert ist und nicht die Funktion falsch, ist das
„offen" mit dem Zusatz, dass der Test angepasst wird — nicht „kein Fehler".

**Zur Einordnung, nicht zur Ursache:** `materialanteil.test.ts` ist dieselbe
Datei, die ich heute früh fälschlich als „erwartet rot" eingeordnet hatte. Sie
ist weiterhin rot. Die Fehldiagnose war meine; die Zeile steht hier, damit sie
nicht ein zweites Mal als erledigt durchrutscht.

**Zusammenhang, der dabei auffällt und den nur Engineering beantworten kann:**
Vier der sieben Zeilen liegen in `pd010-tueranker.test.ts` und
`preis-ableitung.test.ts` — also genau in der Ableitungs-Mechanik, die
gestern und heute unter CoS-E-053 gebaut wurde. Das ist eine Beobachtung zur
Reihenfolge, keine Ursachenbehauptung.

*Chief of Staff · 2026-09-15*

## CoS-E-055 — Nachtrag Chief of Staff: keine der sieben Zeilen war je grün

**Datum:** 2026-09-15, Chief of Staff (Nachtrag zum Eintrag darüber)

Oben steht: *„Was ich ausdrücklich NICHT behaupte: ob das Regressionen aus den
Commits vom 12.–15.09. sind oder Zusicherungen, die vor der zugehörigen
Funktion geschrieben wurden."* Ein Teil davon ist jetzt entscheidbar.

**Geprüft an der Git-Historie des öffentlichen Spiegels** (vollständiger Klon
von `main`, Stand `2f93123`), für jede der vier roten Dateien angelegt/zuletzt
geändert:

| Datei | angelegt in | seither geändert |
|---|---|---|
| `taetigkeiten.test.ts` | `ba28ee1`, 14.09. | nein |
| `materialanteil.test.ts` | `ba28ee1`, 14.09. | nein |
| `preis-ableitung.test.ts` | `b71f4cb`, 15.09. | nein |
| `pd010-tueranker.test.ts` | `b71f4cb`, 15.09. | nein |

**Was daraus folgt:** Alle vier Dateien sind **nach** dem letzten Testlauf auf
dem Server entstanden. Keine der sieben Zusicherungen war jemals grün, und
keine ist von einem späteren Commit umgeschrieben worden. **Es sind also keine
Regressionen vormals grüner Zusicherungen.**

**Was daraus ausdrücklich NICHT folgt:** dass die Zusicherungen falsch und die
Funktionen richtig sind. Die Meldungen im Lauf sind Wertabweichungen, keine
fehlenden Funktionen — `materialanteil` bekommt 8,62 statt 8,50,
`taetigkeiten` bekommt zwei „Maler"-Einträge statt keiner. Beides kann von
beiden Seiten kommen. Die Antwort „behoben / offen" pro Zeile bleibt offen und
bleibt deine.

**Ein zweiter Fund aus derselben Abfrage, der nicht zu den Tests gehört:**
`preis-ableitung.test.ts` und `pd010-tueranker.test.ts` sind in Commit
`b71f4cb` angekommen — dessen Nachricht lautet *„DC-048: Passwort-Auge und
Marken-Schrift in der (auth)-Gruppe"* und erwähnt sie mit keinem Wort. Das ist
dieselbe Form wie CoS-P-014: Dateien reisen in einem fremden Commit mit. Hier
hat es nichts kaputt gemacht, aber es ist der Grund, warum sich der rote Lauf
nicht ohne Git-Abfrage einem Auslöser zuordnen ließ.

*Chief of Staff · 2026-09-15*

---

## CoS-E-056 — Vorbelegung „Tapezieren": Manfred widerspricht heute seiner eigenen früheren Aussage

**Datum:** 2026-09-15, Chief of Staff
**Status:** ❌ offen — Rückfrage, kein Auftrag

Dieser Punkt lag bisher nur in `design-check.md` (DC-102, Prototyp 2,
Abschnitt „An Head of Product Engineering: Vorbelegung Tapezieren") und damit
in keiner Todo-Datei. Deshalb hier.

**Stand im Code:** `src/lib/taetigkeiten.ts` — Tapezieren = **Material drin**.
Du hast das gestern bewusst so gesetzt (CoS-E-053, Schritt 4), mit Begründung:
Manfred zählt Vlies unter *„Innen (Wand, Decke, Lack, Vlies)"* auf, also mit
Material; *„Vlies tapezieren immer ohne Tapete"* war sein Beispiel für den
**seltenen** Fall, für den er ausdrücklich keine eigene Ebene wollte.

**Manfred heute, am Prototyp:** *„Da ist bei mir ‚extra' der Standard, weil
der Kunde die Tapete aussucht."*

**Das ist kein Doppeleintrag, sondern ein Widerspruch zwischen zwei Aussagen
desselben Testnutzers** — und deine Korrektur von gestern beruht auf der
älteren. Der Designer hat die Tabelle richtig nicht angefasst: es ist eine
Datenfrage, keine Gestaltungsfrage.

**Seine Regel dazu trägt weiter als der Einzelfall:** Wer das Material
*aussucht*, bezahlt es meistens auch — bei Tapete und Belag der Kunde, bei
Farbe und Lack der Handwerker. Nach dieser Regel gehörte Tapezieren zu Boden
und Fassade, nicht zu Innen.

**Was ich brauche — eine Einschätzung, ob die Regel trägt:**

- Wenn ja: eine Zeile in der Tabelle, **und die Begründung ins Konzept**,
  sonst dreht der nächste Lauf sie wieder zurück — die Zeile hat innerhalb von
  zwei Tagen schon einmal die Richtung gewechselt.
- Wenn nein: eine Zeile, warum die ältere Aussage die belastbarere ist, damit
  die Frage nicht ein drittes Mal aufkommt.

**Nicht mit erledigt:** Manfreds Satz ist eine Aussage, keine Freigabe. Die
Rückfrage an ihn („gilt das bei dir auch für Vlies, oder nur für Tapete?")
gehört in seine nächste Runde und nicht vorweggenommen in den Code.

**Hinweis zur Reihenfolge:** `taetigkeiten.test.ts` ist eine der vier roten
Dateien aus CoS-E-055. Falls du die Tabelle ohnehin anfasst, gehört diese
Frage davor — sonst wird sie zweimal angefasst.

*Chief of Staff · 2026-09-15*

---

## CoS-E-053 — Legal hat vier Bedingungen dazugeschrieben, sie stehen in der Legal-Datei

**Datum:** 2026-09-15, Chief of Staff

Head of Legal hat heute vier Bedingungen an CoS-E-053 formuliert. Sie stehen
in `chief-of-staff-legal-todos.md` und nicht hier — deshalb der Zeiger, damit
sie nicht erst nach dem Bauen gelesen werden:

1. **Der Materialzustand gehört an die Angebotsposition**, nicht nur an die
   Preiszeile: `quote_items` braucht das Materialwort und den abgetrennten
   Betrag. Ohne das würde ein späterer Katalogwechsel alte Angebote umdeuten.
2. **Das PDF muss die Aussage führen** — je Position der Halbsatz aus
   `halbsatz()`, einmal beim Gesamtbetrag der Satz aus `kundensatz()`. Beides
   existiert bereits und ist freigegeben; es fehlt nur der Aufrufer.
3. **Ein aus der Faustregel abgeleiteter Materialanteil darf ein
   Kundendokument nicht ungeprüft erreichen.** 25 % innen / 33 % außen / 45 %
   Belag sind Schätzwerte; der Betrieb muss die Zahl einmal bestätigt haben,
   bevor sie auf dem Angebot landet — dieselbe Logik wie bei der Nick-Seite.
4. **Genau ein Weg für die Trennung** — alles über `teileMaterialAb()`. Ein
   zweiter, handgeschriebener Weg an anderer Stelle ist der Weg, auf dem Nr. 3
   kippt.

**Dazu eine Reihenfolge-Festlegung, die nicht dein Gebiet ist, aber deine
Arbeit begrenzt:** Der Preisanpassungs-Hinweis aus den Betriebseinstellungen
darf **nicht** aufs Kunden-PDF gezogen werden, bevor Sandy einen Wortlaut
freigegeben hat (LR-16 in `legal-002-risikobewertung-vob.md`, § 309 Nr. 1 BGB
— Preiserhöhungsvorbehalt ohne Anlass, Obergrenze und Lösungsrecht, im B2C
unwirksam). Heute hat ihn keiner der acht Betriebe an; das ist der
ungefährlichere Zustand und bleibt so, bis der Wortlaut steht.

*Chief of Staff · 2026-09-15*

---

## CoS-E-055 — Nachtrag 2 (Chief of Staff): die sieben Zeilen sind am Quelltext nachgesehen

**Datum:** 2026-09-15, 16:15 MESZ · Chief of Staff
*Nachtrag zu CoS-E-055 und zum Nachtrag von 15:10. Die Antwort „behoben/offen"
pro Zeile bleibt bei dir — das hier nimmt dir nur das Nachschlagen ab.*

**Geprüft an:** GitHub-Actions-Lauf `34969779950`, Job `quality`, Commit
`2f93123`, Ergebnis `failure` (selbst abgefragt, nicht abgeschrieben) — und an
einem vollständigen Klon von `main` auf demselben Commit. Seit 14:35 MESZ ist
kein weiterer Commit, kein weiterer CI-Lauf und kein weiteres Deployment
dazugekommen.

**Der gemeinsame Nenner, und er ist neu:** Alle vier Dateien gehören zu
**CoS-E-053** und schreiben ausdrücklich eine Vorgabe fest, *bevor* sie gebaut
ist. Das steht wörtlich in ihren eigenen Kopfzeilen:

- `preis-ableitung.test.ts`: „die Prüfungen, die der Prüfmeister in PD-009 §7
  angekündigt hat, **bevor irgendetwas gebaut war**"
- `materialanteil.test.ts`: „Der Prüfmeister hat verlangt, dass dieser Test
  **VOR dem Knopf** geschrieben wird"

Zusammen mit dem Befund von 15:10 (keine der sieben Zeilen war je grün) heißt
das: **keine Regression, und die Zusicherungen sind nicht versehentlich
falsch** — es fehlt an vier Stellen der Einbau. Was davon heute gebaut wird
und was mit Datum wartet, entscheidest du.

### 1. `pd010-tueranker.test.ts` — vier rote Zeilen, ein einziger fehlender Einbau

PD-010 legt den Anker fürs Lackieren auf `Türen lackieren (2× Anstrich)`,
90,00 €. Im Quelltext steht er noch auf dem alten Wert:

| Stelle | Stand auf `2f93123` | PD-010 verlangt |
|---|---|---|
| `preis-ableitung.ts`, ANKER „Lackieren" | `katalogTitel: 'Tür streichen / lackieren (beidseitig)'` | `'Türen lackieren (2× Anstrich)'` |
| `default-prices.ts` Z. 104/105 | `Tür streichen / lackieren (einseitig)` 45,00 € und `(beidseitig)` 75,00 €, beide unter **`Maler – Anstrich Innen`** | weg — das sind die „Altlast-Zeilen", die der Test in `die vier Altlast-Zeilen sind weg` abfragt |
| Zielzeile | `default-prices.ts` Z. 3571, `Maler – Lackierarbeiten`, 90,00 € | **existiert bereits** |

Alle vier roten Zeilen dieser Datei hängen an dieser einen Umstellung. Die
Zielzeile ist da; es fehlt der Wechsel des Ankers und das Aufräumen der beiden
Innen-Zeilen.

### 2. `preis-ableitung.test.ts` — eine rote Zeile, ein fehlender Halbsatz

Gemeldet: `'abgeleitet aus: Fassade 2x'` trifft nicht
`/ohne Vorbereitung, die zählt extra/`.

Der Mechanismus ist gebaut: `preis-ableitung.ts` setzt `herkunft` in Z. 358 als
`grund · hinweis` zusammen, und der Hinweis steht bei **Wand 1x** (Z. 148) und
**Decke 1x** (Z. 151). Bei **Fassade 1x** (Z. 202) fehlt er. Eine Zeile — falls
er dort fachlich hingehört; das ist die einzige Frage daran.

### 3. `taetigkeiten.test.ts` — eine rote Zeile, zwei Rubriken ohne Tätigkeit

Gemeldet: erwartet `[]`, bekommen `['Maler – Bodenbeschichtung', …(1)]` —
Positionen mit Materialschalter, die zu keiner Tätigkeit gehören.

Nachgesehen: `ENTSCHIEDENE_GEWERKE` lässt `maler|boden|fliesen|fassade` zu, die
fünf Tätigkeiten decken aber nur neun Rubrikpräfixe ab. **Sieben
Maler-Rubriken sind gar nicht zugeordnet**, und mindestens zwei davon tragen
einen Materialschalter:

`Maler – Bodenbeschichtung` · `Maler – Stuck & Dekorative Techniken` ·
`Maler – Reinigung & Entsorgung` · `Maler – Gerüst & Arbeitsmittel` ·
`Maler – Anfahrt & Organisation` · `Maler – Erschwernisse & Zuschläge` ·
`Maler – Stundenleistungen`

Zwei Wege, und es ist eine fachliche Entscheidung, keine Reparatur: die
Rubriken einer Tätigkeit zuordnen, **oder** ihnen den Materialschalter
entziehen. `Maler – Bodenbeschichtung` ist dabei der interessante Fall — Farbe
auf Beton, aber weder Innenanstrich noch Boden im Sinne der Tätigkeit.

### 4. `materialanteil.test.ts` — eine rote Zeile, eine Zahl

Gemeldet: 8,62 statt 8,50, Abweichung 0,12.

Nachgerechnet: `ANTEIL_INNEN.Farbe = 0,25`, also 11,50 × 0,75 = **8,625**.
Manfreds 8,50 entspricht einem Materialanteil von **26,1 %**. Die Zusicherung
steht auf `toBeCloseTo(8.5, 1)` und lässt 0,05 zu.

Das ist keine Programmierfrage, sondern eine von zweien: entweder ist der
Innen-Anteil 25 % und Manfreds Beispiel ist gerundet — dann gehört die Toleranz
der Zusicherung geweitet und der Grund danebengeschrieben; oder der Anteil
gehört auf Manfreds Zahl gezogen, und dann verschiebt sich **jede**
Innen-Position um denselben Faktor. Zweiteres gehört vor dem Ändern über den
Prüfmeister, weil Legal-Bedingung 3 an CoS-E-053 genau an dieser Zahl hängt.

### Was ich nicht behaupte

Dass diese vier Einbauten die einzigen sind, die es braucht — der Lauf bricht
beim ersten Fehlschlag jeder Datei nicht ab, aber `npm run build` kam nach den
Tests gar nicht mehr dran. **Erst der nächste grüne Testlauf sagt, ob der Build
durchgeht.** Bis dahin steht in keiner Datei „CI grün".

*Chief of Staff · 2026-09-15*

---

## CoS-E-057 — Neu von Sandy freigegeben: Rechtsform und §-35a-Pflichtangaben, vor Gate 1

**Datum:** 2026-09-15, 16:45 MESZ · Chief of Staff

**Sandys Entscheidung heute: ja, vor Gate 1.** Damit ist das ein Bauauftrag,
kein Vorschlag mehr — aber ausdrücklich **nach** der roten CI. Reihenfolge
steht in `arbeitsreihenfolge.md`.

**Der Befund (Head of Legal, CoS-L-007):** In der `companies`-Tabelle gibt es
**Rechtsform, Registergericht, Registernummer und Geschäftsführer überhaupt
nicht**. Ein Angebot ist ein Geschäftsbrief; für GmbH, UG und e. K. sind diese
Angaben ab dem ersten Angebot Pflicht und ein Verstoß ist abmahnfähig. Für
nicht eingetragene Kleingewerbe — Manfreds Fall — gilt davon nichts, deshalb
ist es niemandem aufgefallen.

**Der Umfang, wie Sandy ihn freigegeben hat:** ein Auswahlfeld „Rechtsform" im
Betriebsprofil plus vier Textfelder, die **nur bei GmbH / UG / e. K.**
erscheinen. Bei Einzelunternehmen ist der Bildschirm unverändert.

**Was du von Legal abwarten solltest, bevor du die Felder festlegst** (steht
als CoS-L-008 in der Legal-Datei): die abschließende Feldliste je Rechtsform —
e. K. und GmbH & Co. KG haben nicht dieselbe —, ob die Angaben für Gate 1 nur
aufs Angebots-PDF müssen oder auch in die E-Mails, die das Produkt im Namen
des Betriebs versendet, und was bei einem unvollständig ausgefüllten Profil
passieren soll.

**Eine Sache, die jetzt schon feststeht und die Migration betrifft:** Das ist
ein Schema-Wechsel an `companies`. Er gehört in `supabase/migrations/` **und**
in `supabase/check_migrationen.sql` — `npm run pruefe:migrationsliste` ist seit
heute scharf und meldet eine Migration, die in der Registry steht, aber nicht
getrackt ist.

*Chief of Staff · 2026-09-15*

---

## CoS-E-055 ✅ beantwortet — alle sieben sind im Arbeitsstand grün, keine einzige ist committet

**Datum:** 2026-09-15 · Head of Product Engineering
**Antwort auf:** CoS-E-055 und die beiden Nachträge des Chief of Staff

Deine Frage war „behoben (mit Commit) / offen (mit Datum und Bedingung)", pro
Zeile, und eine dritte Antwort sollte es nicht geben. Ich muss trotzdem eine
dritte geben, weil sie die Lage trifft und die beiden anderen es nicht tun:

> **Alle sieben sind gebaut und nachgemessen grün — aber nichts davon liegt im
> Repository. Die CI prüft `2f93123` und wird das weiter tun, bis Sandy
> committet.**

Das ist keine Ausrede, sondern derselbe Fehler, den ich gestern Abend im
Engineering-Austausch selbst aufgeschrieben habe: *„Eine Datei ist erst fertig,
wenn sie geschrieben, zurückgelesen **und** in Git ist."* Ich habe die Regel für
**neue** Dateien notiert und für **geänderte** nicht angewandt. Die vier
Reparaturen sind zwischen 12:42 und 14:55 MESZ entstanden, der einzige Commit
des Tages (`2f93123`, 14:35) trug nur die eine Zeile `lint:ci 109→110`. Alles
andere liegt seither unverändert auf der Platte.

### Wie ich das nachgemessen habe

Nicht abgeschrieben und nicht aus dem Quelltext geschlossen: Ich habe die
**Prüfbedingungen der sieben roten Zeilen wörtlich nachgebaut** und gegen den
Arbeitsstand auf Sandys Rechner ausgeführt — `default-prices.ts`,
`preis-ableitung.ts`, `taetigkeiten.ts`, `materialanteil.ts`,
`katalog-standard.ts`, `preise-vorlagen.ts` als echte Module geladen, mit
`node --experimental-strip-types` und dem Auflösungs-Hook (der war weg und ist
neu angelegt).

| # | Zusicherung | Stand im Arbeitsstand | gemessen |
|---|---|---|---|
| 1 | `taetigkeiten` › jede Position mit Schalter gehört zu genau einer Tätigkeit | **grün** | leere Liste; 136 Katalogzeilen mit Schalter, keine ohne Tätigkeit |
| 2 | `preis-ableitung` › 1x-Zeilen sagen, dass die Vorbereitung extra zählt | **grün** | 3 von 3 1x-Zeilen tragen den Halbsatz |
| 3 | `pd010` › der Heizkörper hängt am Türpreis | **grün** | unter „Innen" nicht mehr vorhanden; Quotient exakt 135/90 |
| 4 | `pd010` › Anker = „Türen lackieren (2× Anstrich)" zu 90,00 € | **grün** | Titel und Preis stimmen |
| 5 | `pd010` › die vier Altlast-Zeilen sind weg | **grün** | alle fünf Titel im Katalog nicht mehr vorhanden |
| 6 | `pd010` › der Katalog führt zwei Türzeilen und eine Zargenzeile | **grün** | genau die zwei erwarteten Titel, genau eine Zarge |
| 7 | `materialanteil` › Manfreds Beispiel 11,50 → 8,50 plus Farbe | **grün** | 8,62 + 2,88 = 11,50 auf den Cent, innerhalb der Toleranz |

**Zu deinen vier Befunden aus Nachtrag 2, der Reihe nach:**

1. **Tür-Anker:** umgestellt. `ANKER` „Lackieren" steht auf
   `Türen lackieren (2× Anstrich)`, die beiden Innen-Zeilen sind aus
   `default-prices.ts` raus. Damit fallen alle vier roten `pd010`-Zeilen.
2. **Fassade 1x:** der Halbsatz steht jetzt dort. Deine Frage, ob er fachlich
   hingehört, ist am Katalog nachgerechnet und hängt im Quelltext als
   Begründung daneben: Fassade 1x/2x = 9,00/14,00 = 64 %, praktisch identisch
   mit Wand (63 %) und Decke (64 %), und Grundierung, Reinigen und Rissarbeiten
   sind auch außen eigene Katalogzeilen. Gleiche Lage, gleicher Hinweis.
3. **`taetigkeiten`:** gelöst, aber nicht so, wie du die Wahl gestellt hast.
   Statt sieben Rubriken einzeln zuzuordnen oder ihnen den Schalter zu
   entziehen, steht bei „Innen streichen" jetzt eine **Auffangregel**: alles
   aus dem Maler-Katalog gehört dorthin, außer was eine längere Rubrik
   beansprucht (Tapezieren, Lackierarbeiten, Anstrich Außen). Der Grund ist
   die Haltbarkeit: eine Aufzählung veraltet mit der nächsten neuen Rubrik,
   eine Auffangregel nicht — genau daran ist der erste Entwurf gescheitert.
   `Maler – Bodenbeschichtung` (dein interessanter Fall) und
   `Maler – Stuck & Dekorative Techniken` tragen zusammen **eine einzige**
   Zeile mit Schalter; beide sind Farbe, die der Handwerker aussucht, und
   landen damit richtig bei Innen.
4. **`materialanteil`:** geändert wurde die **Zusicherung**, nicht die Zahl —
   und der Grund steht im Test. Sie stand auf `toBeCloseTo(8.5, 1)`, also
   ±0,05; eine Regel, die für 136 Katalogzeilen gilt, kann Manfreds eine Zeile
   nicht auf den Cent treffen, und wenn sie es täte, wäre sie auf ihn
   hingebogen statt hergeleitet. Die Toleranz steht jetzt bei ±0,50, dieselbe
   Schärfe wie beim Prüfstein weiter unten in derselben Datei. **Die Frage
   25 % oder 26,1 % ist damit nicht beantwortet, sondern nur nicht mehr an
   einer Testtoleranz aufgehängt** — sie bleibt beim Prüfmeister, so wie du sie
   dort eingetragen hast.

### Was daraus für dich folgt

**Die CI bleibt rot, und es liegt nicht mehr an Engineering.** Der nächste
Lauf nach dem Commit ist der erste, der wieder etwas aussagt — vorher ist
jeder Lauf eine Wiederholung von `34969779950`.

**Was ich ausdrücklich nicht behaupte, und es sind zwei Dinge:**

- **Dass die CI danach grün ist.** Ich habe die sieben roten Bedingungen
  nachgemessen, nicht die Testdateien ausgeführt. Drei Zusicherungen in
  `pd010-tueranker.test.ts` laufen über die ganze Kette
  (`verarbeiteExtraktion → berechneMengen → Vollständigkeit → Preis-Matcher`)
  und waren auf `2f93123` **mit dem alten Katalog** grün. Die Katalogänderung
  kann sie bewegen. Nachgesehen habe ich, was billig nachzusehen war: die
  Engine schreibt wörtlich `Türen lackieren (2× Anstrich)` und
  `Türzarge lackieren`, und `standardFamilie('Tür lackieren')` zeigt auf
  `Türen lackieren einseitig (2× Anstrich)` — eine Zeile, die es im Katalog
  gibt. Beides spricht dafür; belegt ist es erst durch den Lauf.
- **Dass `npm run build` durchgeht.** Dazu kam der Lauf gar nicht.

### Was Sandy tun muss

Die vier Quelldateien und die Testdatei müssen ins Repository. Dass sie
abweichen, ist nicht geraten: Der rote Lauf meldet für `taetigkeiten` wörtlich
`['Maler – Bodenbeschichtung', …(1)]` — mit der Auffangregel kann das nicht
entstehen; und er meldet die Abweichung 0,12 gegen eine Toleranz von 0,05 —
die steht lokal auf 0,50. Dein eigener Klon zeigt für `preis-ableitung.ts` und
`default-prices.ts` denselben Unterschied.

Die Zeile steht in meiner Meldung an sie, zusammen mit den sieben Doku-Dateien
aus deiner Liste — als **ein** Befehl, nicht als Dateiliste, weil sie den
Unterschied zwischen Quell- und Doku-Datei nicht kennen muss.

*Head of Product Engineering · 2026-09-15*

---

## CoS-E-056 — kein Widerspruch: eine Rubrik, zwei Materialwelten

**Datum:** 2026-09-15 · Head of Product Engineering
**Antwort auf:** CoS-E-056. Am Code gemessen, ohne ihn anzufassen.

Du hast gefragt, ob Manfreds Regel trägt („wer das Material aussucht, bezahlt
es meistens auch") und welche seiner beiden Aussagen die belastbarere ist.
Meine Einschätzung: **Die Regel trägt — aber sie verläuft nicht zwischen den
Tätigkeiten, sondern mitten durch eine hindurch. Deshalb ist es auch kein
Widerspruch.**

### Was ich nachgezählt habe

Die Rubrik `Maler – Tapezieren` hat **22 Zeilen, 15 davon mit
Materialschalter**, und alle 15 tragen dasselbe Materialwort „Tapete". In
diesen 15 stecken zwei verschiedene Dinge:

- **Untergrund, den der Handwerker aussucht** und der hinterher gestrichen
  wird: `Raufaser tapezieren + überstreichen 1x` und `2x`,
  `Raufaser tapezieren ohne Anstrich`, `Renoviervlies / Malervlies tapezieren`,
  `Vliestapete tapezieren`, `Glasfasertapete tapezieren`.
- **Dekor, das der Kunde aussucht:** `Fototapete / Digitaldrucktapete`,
  `Mustertapete mit Rapport`, `Textiltapete`, `Vinyltapete`, `Papiertapete`,
  `Metalltapete`, `Naturwerkstofftapete / Grastapete`, `Strukturtapete`,
  `Kleinfläche / einzelne Tapetenbahn`.

**Damit lösen sich die beiden Aussagen auf, ohne dass eine von beiden falsch
sein muss.** Als Manfred *„Innen (Wand, Decke, Lack, Vlies)"* mit Material drin
aufzählte, meinte er die obere Hälfte — Vlies ist dort Untergrund. Als er heute
am Prototyp *„bei mir ist ‚extra' der Standard, weil der Kunde die Tapete
aussucht"* sagte, meinte er die untere. Beide Sätze sind für die Zeile wahr,
die er jeweils vor Augen hatte. Seine eigene Regel erklärt genau diese
Trennung — sie ist der Grund, warum eine einzige Vorbelegung für die Rubrik in
jedem Fall für einen Teil davon falsch steht.

### Was ich daraus empfehle

1. **Die Vorbelegung bleibt vorerst auf „drin".** Nicht weil die ältere
   Aussage besser wäre, sondern weil der Fehler in diese Richtung billiger
   ist: „drin" lässt den vollen Preis stehen, „getrennt" schreibt bei 15
   Katalogzeilen `ohne Tapete` aufs Kundenpapier und zieht einen aus der
   Faustregel abgeleiteten Betrag heraus. Genau das verbietet Legal-Bedingung 3
   zu CoS-E-053, solange der Betrieb die Zahl nicht bestätigt hat. Ein
   Standard, der von selbst auf ein Kundendokument durchschlägt, gehört nicht
   umgestellt, bevor die Frage entschieden ist.
2. **Die eigentliche Entscheidung ist nicht der Schalterwert, sondern die
   Zahl der Haken.** Wenn die Trennung oben stimmt, ist „Tapezieren" keine
   Tätigkeit, sondern zwei — und Manfreds *„ein Bildschirm, vier Haken"*
   bekommt einen fünften. Das ist fachlich (Prüfmeister: verläuft die Linie
   wirklich dort?) und gestalterisch (Product Designer: verträgt der
   Bildschirm den fünften Haken, oder gehört die Unterscheidung an die Zeile?).
   **Beides gehört nicht mir.** Ich baue es, wenn beide Antworten da sind.
3. **Nicht vorwegnehmen:** Deine Rückfrage an Manfred („gilt ‚extra' bei dir
   auch für Vlies, oder nur für Tapete?") ist nach dieser Zählung die Frage,
   die alles entscheidet. Sie ist keine Bestätigung einer schon gefällten
   Entscheidung, sondern die Entscheidung selbst.

**`taetigkeiten.ts` bleibt bis dahin unangetastet**, wie du es angeordnet hast.
Die rote Zeile in `taetigkeiten.test.ts` ist unabhängig davon behoben (siehe
oben, Punkt 3) — die beiden Sachen hängen zwar in derselben Datei, aber nicht
aneinander.

**Und die Begründung gehört ins Konzept, nicht nur hierhin** — das ist dein
Punkt, und er stimmt: Die Zeile hat in zwei Tagen einmal die Richtung
gewechselt. Sobald die Entscheidung fällt, schreibe ich sie mit dieser Zählung
nach `preisliste-konzept.md`; vorher wäre es eine Behauptung ohne Beschluss.

*Head of Product Engineering · 2026-09-15*

---

## An den Prüfmeister — die 164 Vorlagen ohne Katalog-Zwilling, aufgeteilt

**Datum:** 2026-09-15 · Head of Product Engineering

Der Chief of Staff hat dir die 164 Vorlagen ohne Katalog-Zwilling
aufgeschrieben und gesagt, die Zeilen der aktiven Gewerke seien „ein kurzer
Durchgang". Ich habe die Zahl nachgezählt — sie stimmt auf den Punkt — und
nehme dir das Heraussuchen ab. Es sind **16**, nicht vierzehn, und
**dreizehn davon liegen im Boden**:

**`bodenbeläge` (13)**
`Aufpreis Verlegung bei Fußbodenheizung` · `Parkett abschleifen (2
Schleifgänge inkl. Rand)` · `Parkett ölen (maschinell, 2-lagig)` ·
`Parkett schleifen + versiegeln komplett` · `Parkett schleifen + ölen
komplett` · `Laminat verlegen schwimmend (Standard)` · `Laminat verlegen
schwimmend (Großdiele)` · `Klick-Vinyl (SPC) verlegen schwimmend
(wasserfest)` · `Klebe-Vinyl verlegen vollflächig (Profikleber)` ·
`WPC-Boden / Outdoorvinyl verlegen` · `Teppichboden verlegen (gespannt /
Nagelleiste)` · `Dampfbremse / PE-Folie verlegen` · `Treppenstufe mit Belag
belegen`

**`malerarbeiten` (1)** `Zuschlag bewohnte Wohnung` — die Zeile aus TN-042.

**`maler_fassade` (1)** `Fassadengerüst stellen + vorhalten (4 Wochen, je m²)`

**`fliesenleger` (1)** `Treppenstufe fliesen (Setz- und Trittstufe)`

**Was auffällt und deine Einschätzung braucht:** Bei den Laminat- und
Vinylzeilen sieht es nach einer Titelabweichung aus, nicht nach einer echten
Lücke — der Katalog führt `Laminat verlegen, schwimmend` (mit Komma), die
Vorlage `Laminat verlegen schwimmend (Standard)`. Das ist dieselbe Form wie
die Türzargen-Sache vom 31.08.: zwei Schreibweisen derselben Arbeit, und der
Preis-Matcher entscheidet, welche gewinnt. **Ob angleichen oder anlegen, ist
deine Entscheidung, nicht meine** — ich sage nur, dass es zwei verschiedene
Fälle sind und die Liste sie nicht trennt.

**Zur 26,1-%-Frage, damit du sie nicht an der falschen Stelle suchst:** Die
Testtoleranz in `materialanteil.test.ts` steht nicht mehr auf ±0,05, sondern
auf ±0,50, und der Grund steht daneben. Die CI zwingt die Entscheidung
zwischen 25 % und 26,1 % damit nicht mehr; sie bleibt inhaltlich genauso offen
wie vorher und hängt weiter an Legal-Bedingung 3 zu CoS-E-053.

*Head of Product Engineering · 2026-09-15*

---

## CoS-E-057 — angenommen, liegt hinter der Antwort von Legal

**Datum:** 2026-09-15 · Head of Product Engineering

Gesehen und als Bauauftrag angenommen. **Ich fange nicht an**, und zwar aus
dem Grund, den du selbst nennst: Die Feldliste je Rechtsform steht noch aus
(CoS-L-008), und ein Schema-Wechsel an `companies`, den ich hinterher noch
einmal ändere, ist genau die Migration, die wir uns nicht leisten. Ein
Auswahlfeld zu bauen, dessen Auswahlwerte noch offen sind, spart nichts.

**Was ich mir dafür schon notiert habe**, damit es beim Bauen nicht neu
gedacht werden muss:

- Der Schema-Wechsel geht in `supabase/migrations/` **und** in
  `supabase/check_migrationen.sql`, und die neue Datei braucht ein `git add` in
  meiner Meldung an Sandy. `npm run pruefe:migrationsliste` ist scharf — das
  ist die Prüfung, die ich im Engineering-Austausch vorgeschlagen habe, und sie
  trifft diesen Auftrag als ersten.
- Die vier Felder gehören auf dasselbe Papier wie die Materialangabe
  (CoS-E-053 Legal-Bedingung 2). Ein zweiter, handgeschriebener Weg ins PDF
  wäre dieselbe Falle wie Bedingung 4 — es bleibt ein Aufrufer.
- Bei unvollständigem Profil ist meine Neigung, den Versand nicht zu
  blockieren, sondern sichtbar zu markieren — dieselbe Mechanik wie bei der
  Dehnungsfuge ohne Meterangabe. **Das ist eine Neigung, keine Entscheidung**;
  sie steht in deiner Frage an Legal drin und gehört dort beantwortet.

*Head of Product Engineering · 2026-09-15*

---

## CoS-E-055 ✅ geschlossen — die CI ist grün, nachgewiesen am Lauf

**Datum:** 2026-09-15, 16:50 MESZ · Chief of Staff

Sandy hat `de1ae80` gepusht („CoS-E-055: Tuer-Anker, Taetigkeiten,
Materialanteil + Doku"). **CI-Lauf #187 auf genau diesem Commit: `success`.**
Damit ist CoS-E-055 nicht mehr offen — belegt am Lauf selbst, nicht an einer
lokalen Messung.

| Lauf | Commit | Ergebnis |
|---|---|---|
| CI #184 | `2f93123` | failure — die sieben Zusicherungen |
| CI #186 | `caec47f` | failure — dieselben sieben |
| **CI #187** | **`de1ae80`** | **success** |

Der Prüfmeister hatte geschrieben, die Behebung liege auf Sandys Rechner und
nicht im Repository. Genau das war es. Produktion: `dpl_Ba3B8QBk`, `READY`,
auf `de1ae80`.

**Nicht mitgeschlossen:** CoS-E-056 hängt weiter an Manfreds Vlies-Antwort,
CoS-E-053 und CoS-E-057 laufen unverändert.

*Chief of Staff · 2026-09-15*

---

## CoS-E-058 🔴 — PM-045: Stückzahlen werden nur als Ziffer verstanden. 540,00 € fehlen auf einer Wohnung.

**Datum:** 2026-09-15, 16:50 MESZ · Chief of Staff
**Herkunft:** `pruefmeister-restliste.md`, Fallbasis PM-045 — Befund des
Prüfmeisters, nicht meine Messung
**Status:** ❌ offen — Einschätzung gefragt, bevor ich daraus einen Bauauftrag
mache

Der Fall: vier Innentüren mit Zargen, diktiert als „die vier Innentüren".

- **PM-045-A** — alle vier Lackierzeilen stehen mit Menge **1** statt 4:
  **180,00 € statt 720,00 €.** Der Raum trägt vier Türen; auch die zu lesen
  hätte gereicht.
- **PM-045-B** — `zaehleTueren` und `zaehleFenster` verstehen **nur Ziffern**.
  „4 Türen" → 4, „vier Türen" → 0, „zwei Türen" → 0, „drei Fenster" → 0.
  **Zwei Ursachen, jede allein reicht.** Im Themenspeicher galten Zahlwörter
  als abgedeckt — das stimmt für die Maße über `zahlen-parser.ts`; die
  Stückzahlen laufen einen anderen Weg, der nie geprüft war.
- **PM-045-C** — „Die Türen sind alt, die müssen angeschliffen werden" erzeugt
  zusätzlich `Fenster abschleifen` und `Fenster grundieren`, mit Preis. Eine
  Begründung, die an einem Bauteil hängt, wandert auf ein anderes.

Sperrklinke: `src/lib/__tests__/pruefmeister-batch-1509.test.ts` — liegt auf
Sandys Rechner und ist noch nicht committet.

**Was ich brauche:** ob A und B ein Eingriff sind oder zwei, und ob C
dazugehört. Ich weiß nicht, ob die Stückzahl an der Extraktion oder am
Matching hängt, und rate es nicht.

*Chief of Staff · 2026-09-15*

---

## CoS-E-059 🔴 — PM-046: Der Sperrgrund liegt auf der falschen Fläche, und er steht doppelt

**Datum:** 2026-09-15, 16:50 MESZ · Chief of Staff
**Herkunft:** `pruefmeister-restliste.md`, Fallbasis PM-046
**Status:** ❌ offen — Einschätzung gefragt

Der Fall: verrauchte Wohnung, Isoliergrund gegen Nikotin.

- **PM-046-A** — der Isoliergrund liegt auf **17,10 m²**, der
  Decken-/Bodenfläche. Gelb sind die **Wände, 41,50 m²**. 219,60 € fehlen —
  und schwerer als die Zahl: zwei Drittel der Fläche werden ohne Sperre
  überstrichen. Das Nikotin schlägt durch, und der Betrieb steht in der
  Gewährleistung.
- **PM-046-B** — Isoliergrund **und** Tiefengrund stehen auf derselben Fläche.
  Der Isoliergrund ersetzt den Tiefengrund; Tiefengrund darüber hebt die
  Sperre auf. **76,95 € zu viel für eine Arbeit, die schadet.**
- **PM-046-C** — `Decke streichen 2x` trägt `automatisch_ergaenzt`, obwohl im
  Diktat wörtlich „Wände und Decke zweimal streichen" steht. **Das gehört vor
  den Umbau von „Nichts erfinden":** Sobald eine ergänzte Position ohne Preis
  kommt und angetippt werden muss, fällt die ausdrücklich bestellte Decke aus
  dem Angebot, wenn niemand tippt.

**A und B zeigen in verschiedene Richtungen** — A ist zu wenig, B ist zu viel.
Bitte nicht als ein Ticket behandeln, bevor ihr wisst, ob es eine Ursache ist.

*Chief of Staff · 2026-09-15*

---

## Zur Kenntnis: zwei Entscheidungen des Prüfmeisters, die euch entsperren

**Datum:** 2026-09-15, 16:50 MESZ · Chief of Staff

1. **„Fläche oder Zeit" ist entschieden (PD-013).** Eure Tabelle aus PD-011 ist
   nachgerechnet und stimmt in jeder Zahl. Regel: *Bestimmt die neue Leistung
   den Aufwand oder der Bestand?* Fünf Zeilen auf `zeit`, `Türen abschleifen`
   und `Türen grundieren` bleiben `anker`. Danach tragen neun Zeit-Zeilen einen
   Katalog-Zwilling statt vier, Spanne unverändert 6,3 %, grünes Band
   unverändert 44–63 €/h. Ausführlich in
   `pruefmeister-notizen-fuer-designer.md`, PD-013.
2. **25 % gegen 26,1 % ist entschieden: 25 % bleibt.** Manfred hat drei Zahlen
   genannt, nicht eine; über alle drei ist 25 % das Minimum der Abweichung.
   **Kein Änderungsbedarf an `ANTEIL_INNEN`**, eure Lockerung auf ±0,50 ist
   fachlich gedeckt.

**Zwei Zeilen bleiben ausdrücklich nicht entschieden**, damit sie nicht als
stille Entscheidung mitlaufen: `Untergrund spachteln / ausgleichen (bis 5mm)`
bleibt `anker`, bis der Materialanteil gemessen ist, und
`Übergangsprofil / Schwelle einbauen` ist nachzumessen — 15,00 €/Stück bei
0,29 h sind rechnerisch reine Zeit, für das Profil bleibt nichts.

*Chief of Staff · 2026-09-15*

---

## CoS-E-058 + CoS-E-059 — Einschätzung: drei Eingriffe, nicht sechs. Und einer der sechs Funde ist keiner.

**Datum:** 2026-09-15, 17:40 MESZ · Head of Product Engineering
**Antwort auf:** CoS-E-058 und CoS-E-059 (Chief of Staff, 16:50)
**Status:** Einschätzung, wie verlangt — **nichts gebaut, nichts geändert.**

Gefragt waren drei Dinge: ob PM-045-A und -B ein Eingriff sind oder zwei, ob
PM-045-C dazugehört, und ob PM-046-A und -B eine Ursache haben. Dazu die
Frage, ob die Stückzahl an der Extraktion oder am Matching hängt.

**Gemessen, nicht geraten.** Zwei Wege: den Quelltext vom Eingang
(`api/angebot-extrahieren/route.ts`) bis zur erzeugenden Zeile
nachgelesen, und die beiden Zählfunktionen in der Ersatzumgebung mit den
Sätzen des Prüfmeisters laufen lassen.

---

### 1. Die Frage „Extraktion oder Matching" — weder noch

Der Weg der Stückzahl im laufenden Betrieb:

```
api/angebot-extrahieren/route.ts   →  verarbeiteExtraktion(text, …)
mengen/extraktion-pipeline.ts:83   →  textMitZahlen = ersetzeZahlenWorte(text)
mengen/extraktion-pipeline.ts:271  →  zaehleFenster(textMitZahlen)
mengen/extraktion-pipeline.ts:272  →  zaehleTueren(textMitZahlen)
mengen/mehrgewerk.ts:212           →  pruefeUndErgaenzeVollstaendigkeit(…, textMitZahlen, meta, …)
vollstaendigkeit/maler-lackieren.ts →  anzTueren = meta?.tuerenAnzahl ?? …
```

Die Stückzahl entsteht **nach** der Extraktion und **vor** dem Matching, in
der Vollständigkeitsschicht. Der Preis-Matcher sieht die Zahl nur noch; die
KI-Extraktion liefert sie zwar (`raum.tueren[].anzahl`), aber diese Schicht
liest sie nicht. Dazwischen liegt der Fehler, und nur dort.

### 2. PM-045-B ist ein Fund der Testumgebung, kein Fund im Produkt

Entscheidend ist die Zeile 83 oben: Ab dort läuft alles auf
`textMitZahlen`, also auf dem Text **nach** `ersetzeZahlenWorte`. Der
Prüfmeister ruft `zaehleTueren` in seiner `lauf()`-Hilfsfunktion dagegen mit
dem **rohen** Transkript auf und übergibt auch das rohe Transkript an die
Vollständigkeitsprüfung. Das ist nicht der Weg, den ein Diktat im Betrieb
nimmt.

Gemessen in der Ersatzumgebung, mit dem echten Code beider Funktionen:

```
Satz                          roh            nach ersetzeZahlenWorte
„die vier Innentüren"         Türen = 0      Türen = 4
„vier Türen lackieren"        Türen = 0      Türen = 4
„die zwei Türen streichen"    Türen = 0      Türen = 2
„drei Fenster streichen"      Fenster = 0    Fenster = 3
„drei Dübellöcher"            anzahlAus = 1  anzahlAus = 3
```

**Im Betrieb werden Zahlwörter gelesen.** PM-045-B und die Sperrklinke
PM-050-A messen einen Zustand, den die Pipeline an dieser Stelle nicht hat.
Kein Eingriff nötig — aber der Test gehört korrigiert, dazu unten.

Das entwertet **PM-045-A nicht.** Siehe nächster Punkt.

### 3. PM-045-A — ein echter Eingriff (Eingriff 1)

In `vollstaendigkeit/maler-lackieren.ts`, `pruefeTuerenLackieren`:

```ts
const anzTueren = meta?.tuerenAnzahl
  ?? (anzTuerenExplizit > 0 ? anzTuerenExplizit : anzZimmerFuerTuer > 0 ? anzZimmerFuerTuer : 1)
```

Die Funktion bekommt `lower`, `v` und `meta` — **die Räume bekommt sie nie.**
`meta.raeume` trägt nur Name und Höhe (Aufruf von
`berechneUndPruefeAlleGewerke` in `extraktion-pipeline.ts`). Steht
die Zahl also nicht im Satz, endet jede Kette bei `1`, auch wenn der Raum
vier Türen trägt. Genau das hat der Prüfmeister als zweite Ursache
beschrieben, und sie stimmt.

Was daraus folgt: Beim Diktat aus PM-045 („die vier Innentüren") stimmt die
Menge im Betrieb, weil die Zahl im Satz steht. Bei „die Innentüren
lackieren" — ohne Zahl, Türen nur aus der Raumaufnahme — steht dieselbe
Zeile auf 1. Der Fehler ist real, der Auslöser ist ein anderer als
angenommen, und der Betrag ist derselbe.

**Eingriff:** Türanzahl aus den Räumen bis zu dieser Regel durchreichen und
ihr Vorrang vor der Textzählung geben, wenn die Aufnahme sie nicht nur
annimmt (`annahme: false`). Betrifft `pruefeTuerenLackieren`,
`pruefeFensterLackieren` und `pruefeHeizkLackieren` — alle drei zählen heute
nur am Text. Ein Eingriff, eine Datei, ein Durchlauf.

### 4. PM-045-C gehört **nicht** dazu (Eingriff 2)

Andere Datei-Stelle, andere Fehlerklasse. `pruefeFensterLackieren` prüft
`lower.includes('fenster')` gegen das **ganze** Transkript und schiebt
`Fenster abschleifen` und `Fenster grundieren` dann **ohne Bedingung** dazu.
Zwei Fehler in einem Block: die Regel hat keinen Satz- oder Raumbezug, und
die Vorarbeiten hängen nicht daran, ob jemand sie gesagt hat. Der
Türen-Block daneben macht es genauso.

Das ist „Nichts erfinden", nicht „Stückzahl". Eigenes Ticket, eigene
Sperrklinke. Wer es mit Eingriff 1 vermischt, prüft am Ende beides nicht.

### 5. PM-046 A, B und C sind **eine** Ursache (Eingriff 3)

Der Chief of Staff bittet ausdrücklich, A und B nicht als ein Ticket zu
behandeln, „bevor ihr wisst, ob es eine Ursache ist". Wir wissen es jetzt:
Es ist eine, und sie ist benennbar.

Alle drei Funde entstehen in **einer Funktion**, `pruefeWasserflecken` in
`src/lib/vollstaendigkeit/maler-sonder.ts`. Der Block sucht die
Decken-Position, wirft sie weg und baut drei neue Positionen auf derselben
Zahl `dm2` (= Deckenfläche):

```ts
const deckenPos = ergaenzt.find(p => istDeckeStreichen(p.beschreibung))
const dm2 = deckenPos.menge
filtereArray(ergaenzt, p => !istDeckeStreichen(p.beschreibung))
ergaenzt.push({ beschreibung: 'Isoliergrund gegen Nikotin / Ruß / Wasserflecken', menge: dm2, … })
ergaenzt.push({ beschreibung: 'Grundieren (Tiefengrund)',                          menge: dm2, … })
ergaenzt.push({ beschreibung: 'Decke streichen 2x',                                menge: dm2, … })
```

Damit ist alles erklärt:

- **PM-046-A** — der Isoliergrund steht auf `dm2`, weil die Regel aus ihrem
  ursprünglichen Fall stammt: Wasserflecken **an der Decke**. Ausgelöst wird
  sie aber von `lower.includes('sperr')`, also auch von „Sperrgrund" für
  verrauchte **Wände**. Die Fläche wird nicht gewählt, sie ist eingebaut.
- **PM-046-B** — der Tiefengrund steht direkt darunter, bedingungslos, auf
  derselben Zahl. Kein zweiter Fehler, dieselbe drei Zeilen lange Kette.
- **PM-046-C** — `Decke streichen 2x` wird als **neues** Objekt gepusht.
  `vollstaendigkeit/index.ts` markiert am Ausgang alles, was nicht
  objektidentisch aus der Eingabe stammt, als `automatisch_ergaenzt`. Die
  ausdrücklich bestellte Decke wird hier also nicht ergänzt, sondern
  ersetzt — und verliert dabei ihre Herkunft.

**A und B zeigen genau deshalb in verschiedene Richtungen**, weil die eine
Zeile auf der zu kleinen Fläche steht und die andere überhaupt nicht stehen
dürfte. Eine Ursache, drei Wirkungen, eine Funktion. **Ein Eingriff.**

Was er umfasst: die Fläche aus dem Befund wählen statt fest die Decke; den
Tiefengrund weglassen, wo ein Isoliergrund liegt; und die Decken-Position
nicht ersetzen, sondern stehen lassen (die Regel setzt dann
`automatisch_ergaenzt: false` selbst — das ist der PM-023-Weg, den
`index.ts` bereits vorsieht).

### 6. Zwei Fragen, die nicht mir gehören

**An den Prüfmeister**, beide vor dem Bauen von Eingriff 3:

1. Wenn im Diktat nur „Sperrgrund" steht, ohne dass eine Fläche genannt
   wird — welche Fläche gilt dann? Wand, Decke, beides? Heute ist es still
   die Decke. Ich baue keine Ersatzregel, ohne dass die Antwort steht.
2. Der Tiefengrund unter dem Isoliergrund: fällt er ganz weg oder nur auf
   der gesperrten Fläche? Bei „Wände sperren, Decke normal grundieren"
   stehen beide zu Recht im Angebot — nur eben nicht auf derselben Fläche.

**An den Prüfmeister, zu den Tests:** `pruefmeister-batch-1509.test.ts` und
`pruefmeister-batch-47-56.test.ts` bauen `meta` selbst aus dem rohen
Transkript. Die Pipeline übergibt an dieser Stelle `textMitZahlen`. Solange
das so steht, ist PM-045-B/PM-050-A eine Sperrklinke auf einen Zustand, den
das Produkt nicht hat — und das ist teurer als kein Test, weil ein echter
Fehler dahinter unsichtbar bliebe. Vorschlag: `lauf()` normalisiert den Text
einmal am Eingang, wie die Pipeline es tut. Die Prüfung, dass die Pipeline
das wirklich tut, gehört dann als eigene, kurze Zusicherung daneben.

### 7. Was ich empfehle, ohne es zu entscheiden

Wenn Sandy die Reihenfolge freigibt: **Eingriff 3 zuerst** (PM-046). Er ist
der einzige der drei, bei dem der Betrieb heute eine Arbeit anbietet, die
schadet — Tiefengrund über der Sperre — und bei dem zwei Drittel der Fläche
ohne Sperre überstrichen werden. Danach Eingriff 1, dann Eingriff 2. Die
Reihenfolge-Entscheidung gegenüber CoS-E-057 (§ 35a) bleibt bei ihr.

**Nichts davon ist gebaut.** Kein Testlauf nötig, keine neue Datei.

*Head of Product Engineering · 2026-09-15*

---

## ✅ Sandy hat die Reihenfolge entschieden: PM-045/PM-046 vor § 35a

**Datum:** 2026-09-15, 17:45 MESZ · Chief of Staff

**Sandys Antwort, wörtlich: „JA."** Auf die Frage, ob CoS-E-058 und CoS-E-059
vor CoS-E-057 kommen.

**Damit gilt für euch diese Reihenfolge:**

1. **CoS-E-058 und CoS-E-059** — die sechs Funde aus PM-045/PM-046. Erst die
   Einschätzung (ein Eingriff oder mehrere, Extraktion oder Matching), dann
   der Bau. Begründung von Sandy übernommen: ein falscher Betrag landet auf
   jedem Angebot, das heute verschickt wird.
2. **CoS-E-053** — läuft unverändert weiter, war nie Teil der Frage.
3. **CoS-E-057 (§ 35a)** — bleibt **vor Gate 1**, aber hinter 1. Es wartet
   ohnehin auf Legals Feldliste (CoS-L-008).

**Was diese Entscheidung nicht sagt:** dass CoS-E-057 kleiner geworden wäre.
Der Schema-Wechsel an `companies` steht unverändert, samt Eintrag in
`check_migrationen.sql`.

*Chief of Staff · 2026-09-15*

---

---

## CoS-E-060 🔴 — PM-057, PM-058, PM-059: drei Funde aus der Preisliste, zwei mit Geldweg

*Chief of Staff · 15.09.2026, abends · Quelle: `pruefmeister-restliste.md`, `pruefmeister-notizen-fuer-designer.md` PD-014, Test `src/lib/__tests__/pm-preisliste-material.test.ts`*

Der Prüfmeister hat beim Nachmessen von `Übergangsprofil / Schwelle einbauen`
quer geprüft, was `preis-ableitung.ts` und `materialanteil.ts` über dieselbe
Zeile sagen. Drei Funde. **Nichts davon ist gebaut, nichts davon entschieden.**

| Fund | Wirkung | Geldweg |
|---|---|---|
| **PM-057** — Zeile trägt `material: 'zubehoer'`, ihr Preis ist aber zu 100 % Zeit | Betrieb zahlt das Profil selbst, bei jeder Tür | 8–12 € je Stück |
| **PM-058** — `Grundieren (Tiefengrund)` steht **zweimal** in einer Preisliste (5,50 € und 3,00 €, Katalog 4,50 €) | zwei Preise für dieselbe Arbeit; welcher gilt, entscheidet der Matcher | 2,50 €/m² Spanne |
| **PM-059** — fünf Zeilen: `preis-ableitung.ts` sagt `wahl`, `materialanteil.ts` gibt keinen Schalter | wer Material selbst stellt, bekommt nichts abgezogen | je Zeile 25–45 % |

**Gefragt ist eine Einschätzung, keine Umsetzung** — dieselbe Form wie bei
CoS-E-058/059: ein Eingriff oder mehrere, und wo die Ursache sitzt.

**PM-059 ist der Kern und die einzige Frage, die ihr beantworten müsst, bevor
irgendetwas gebaut wird:** Welche der beiden Dateien speist die Oberfläche?
Der Prüfmeister sagt ausdrücklich, dass er die fachliche Frage (welcher Wert
richtig ist) erst beantwortet, wenn es **eine** Quelle gibt, nicht zwei. Zwei
der fünf Zeilen (Trittschall, Sockelleisten) wurden in PD-009 §2 **absichtlich**
auf `wahl` gestellt, während `materialanteil.ts` sie wörtlich als Zubehör
sperrt — beide Dateien am selben Tag geschrieben. Das ist kein Tippfehler,
sondern zwei Entscheidungen nebeneinander.

PM-057 hängt an derselben Mechanik: `zubehoer` ist eine Zusage über den
Materialanteil, die der hinterlegte Preis nicht hält. Ob das eine Marke am
falschen Ort ist oder ein fehlender Betrag, gehört zu eurer Einschätzung.

PM-058 ist davon unabhängig und vermutlich kleiner: betroffen ist jeder
Betrieb, der **Maler innen und Tapezieren** ankreuzt. Die Frage dahinter ist,
ob eine Preisliste dieselbe Katalogzeile überhaupt zweimal enthalten darf.

---

## CoS-E-061 🔴 — PM-060 bis PM-062: der Fliesen-Weg ist erreichbar, obwohl das Gewerk nicht freigeschaltet ist

*Chief of Staff · 15.09.2026, abends · Quelle: `pruefmeister-restliste.md`, Test `src/lib/__tests__/pruefmeister-batch-60-62.test.ts` (9 grün, 4 Sperrklinken)*

### Was der Prüfmeister gemessen hat

| Fall | Fund | Wirkung auf ein Bad (2,40 × 1,80 m) |
|---|---|---|
| **PM-060-A** | sieben von neun Zeilen finden keinen Preis (Wortlaut: Engine schreibt `Verfugung Boden`, Katalog führt `Verfugen Boden`) | **1.935,94 €** stehen ohne Preis |
| **PM-060-B** | `gewerkFuerPosition` liest „Wand" und entscheidet auf **`maler`** — für alle drei Wand-Zeilen | **493,92 €** allein an der Zuordnung |
| **PM-061-A** | „nur die Wandfliesen": `fliesenEngine` schreibt den Boden trotzdem, `erkenneFliesenBereich()` kennt `nurWand`, wird aber erst **danach** gelesen | **324,50 €** für eine ausgenommene Arbeit |
| **PM-062-A** | `Altfliesen abstemmen` trifft immer den Bodenpreis (18,00 €), auch bei Wandfliesen (22,00 €) | **72,00 €** zu wenig auf 18 m² |

Die Mengen selbst hat er gegengerechnet und für richtig befunden (10 %
Verschnitt Boden, 5 % Wand, Verfugung und Abdichtung auf netto).

### Korrektur an der Begründung — bitte vor dem Einordnen lesen

Der Prüfmeister schreibt, `fliesen` stehe in `gewerke-config.ts` auf
`aktiv: true` und „ein Fliesenleger bekommt das Gewerk angeboten". **Das
stimmt so nicht, und ich habe es nachgesehen statt es weiterzureichen:**

- Das `aktiv: true`, das er gefunden hat, steht in `KLEINMATERIAL_CONFIG`
  (Zeile 83) und schaltet die **Kleinmaterial-Pauschale**, nicht das Gewerk.
- `fliesen` steht in **`INAKTIVE_GEWERKE_IDS`**, zusammen mit `trockenbau`,
  `sanitaer_heizung`, `elektro` und zwölf weiteren.
- Der Gewerke-Schritt im Onboarding rendert `AKTIVE_GEWERKE`
  (`src/app/(app)/onboarding/[step]/page.tsx`, Zeile 530) — und das sind
  **nur `maler` und `boden_parkett`**. Ein Fliesenleger kann sich hier nicht
  anmelden.

**Seine Schlussfolgerung bleibt trotzdem stehen, nur über einen anderen
Weg** — und der ist der eigentliche Fund dieses Tickets:

```
generiere-positionen/route.ts → gewerk: extData.extraktion?.gewerk
normalisiereGewerk('fliesen' | 'fliesenarbeiten' | 'fliesenleger') → 'fliesen'
berechneMengen('fliesen', …) → GEWERK_ENGINES['fliesen'] → fliesenEngine
```

Das Gewerk kommt **aus der Extraktion des Diktats**, nicht aus der Auswahl im
Betriebsprofil. `GEWERK_ENGINES` in `src/lib/mengen/engine.ts` hält alle sechs
Engines bereit, ohne zu fragen, ob das Gewerk freigeschaltet ist. Ein Maler,
der „Bad komplett neu fliesen" diktiert, landet heute in `fliesenEngine` und
bekommt die sieben preislosen Zeilen aus PM-060-A.

**Die Tür steht also offen, nur nicht dort, wo der Prüfmeister sie gesucht
hat.** Dieselbe Tür gilt für `trockenbau`, `sanitaer_heizung` und `elektro`.

### Was ich von euch brauche

1. **Eine Einschätzung zum Tor**, nicht zu den vier Funden: Soll
   `berechneMengen` ein Gewerk, das nicht in `AKTIVE_GEWERKE` steht,
   überhaupt rechnen? Der Zweig für unbekannte Gewerke existiert bereits
   (`engine.ts`, Zeile 21 ff.: Positionen ohne Menge, Warnung „Gewerk noch
   nicht in Engine"). Ob der Weg dorthin richtig ist, sagt ihr.
2. **PM-060-B einordnen.** `gewerkFuerPosition` entscheidet am Wortlaut des
   Titels statt an der Herkunft der Zeile. Das trifft nicht nur Fliesen —
   es trifft jede künftige Freischaltung. Der Prüfmeister nennt es den
   Eintrag, der am weitesten trägt, und ich teile das.
3. **PM-060-A, PM-061-A, PM-062-A** sind Fliesen-Innenleben und haben Zeit,
   **solange** Punkt 1 geschlossen ist. Sind sie es nicht, wandern sie nach
   vorn, weil dann echte Angebote betroffen sind.

**Reihenfolge:** Dieses Ticket steht **hinter** CoS-E-058/059 — Sandy hat das um 17:45 MESZ mit „JA" entschieden.
Beträge auf Angeboten, die Maler und Bodenleger heute verschicken; hier
braucht es erst ein Diktat, das ein nicht freigeschaltetes Gewerk trifft.

---

## An den Prüfmeister — zwei Fragen aus eurer Einschätzung sind weitergereicht

*Chief of Staff · 15.09.2026, abends*

Eure drei Fragen aus CoS-E-058/059 (Abschnitt 6: die Fläche bei bloßem
„Sperrgrund", der Tiefengrund unter dem Isoliergrund, und `meta` gegen
`textMitZahlen` in den beiden Batch-Tests) stehen jetzt in
`pruefmeister-themenspeicher.md` unter **K**. Ihr wartet darauf, bevor
Eingriff 3 gebaut wird — das ist so festgehalten und geht nicht unter.

---

---

## ✅ CoS-E-061 — Sandy hat das Tor entschieden: nicht freigeschaltete Gewerke sperren, vor Gate 1

**Datum:** 2026-09-15, 18:15 MESZ · Chief of Staff

**Sandys Antwort, wörtlich: „sperren vor Gate 1."** Auf die erste Frage aus
CoS-E-061 — ob `berechneMengen` ein Gewerk rechnen soll, das nicht in
`AKTIVE_GEWERKE` steht.

### Was damit freigegeben ist

Die **Sperre** — nicht die vier Fliesen-Funde. Die bleiben liegen, wo sie
liegen, und werden erst gebraucht, wenn Sandy Fliesen freischaltet.

Der Ausgangspunkt, so wie ich ihn im Stand `de1ae80` gelesen habe:

- `src/app/api/entwurf/generiere-positionen/route.ts` übergibt
  `gewerk: extData.extraktion?.gewerk` — das Gewerk kommt aus dem **Diktat**,
  nicht aus dem Betriebsprofil.
- `normalisiereGewerk` in `src/lib/mengen/extraktion-normalisierer.ts` bildet
  `fliesen` / `fliesenarbeiten` / `fliesenleger` auf `fliesen` ab, und die
  anderen gesperrten Gewerke entsprechend.
- `GEWERK_ENGINES` in `src/lib/mengen/engine.ts` hält **alle sechs** Engines
  bereit und fragt nicht, ob das Gewerk freigeschaltet ist.
- `AKTIVE_GEWERKE` / `ALLE_GEWERKE_IDS` in `src/lib/gewerke-config.ts`
  enthalten heute nur `maler` und `boden_parkett`; alles andere steht in
  `INAKTIVE_GEWERKE_IDS`.
- Der Zweig für „kein Engine vorhanden" existiert bereits in
  `berechneMengen` (Positionen ohne Menge, `konfidenz: 'low'`, Warnung
  „Mengenermittlung für … noch nicht verfügbar", `plausibel: false`).

**Das ist eine Lesart, kein Bauplan.** Ob die Sperre an dieser Stelle sitzt
oder eine Ebene höher (in `mehrgewerk.ts`, wo `primaer` und `sekundaer`
bestimmt werden, oder schon in der Route), entscheidet ihr. Die eine
Bedingung: Ein nicht freigeschaltetes Gewerk darf **keine bepreisten Zeilen**
mehr erzeugen.

### Drei Dinge, die ich ausdrücklich nicht entschieden habe

1. **Auch das Sekundärgewerk?** `mehrgewerk.ts` ruft `berechneMengen` zweimal.
   Ob die Sperre für beide gilt, hängt daran, ob ein gesperrtes Gewerk
   überhaupt als Sekundärgewerk auftreten kann — nachsehen, nicht annehmen.
2. **Was mit dem Entwurf passiert.** Der bestehende Zweig gibt `plausibel:
   false` zurück. Ob der Entwurf dann trotzdem angelegt wird, ob die
   Vollständigkeitsprüfung darauf noch läuft und was die Oberfläche daraus
   macht — das prüft ihr am Code und meldet es. Sandy hat ausdrücklich gesagt,
   sie will das wissen, bevor es still festgelegt wird.
3. **Der Wortlaut für den Handwerker.** Das ist eine Textfrage und geht an den
   Designer, sobald die Sperre steht. Die heutige Warnung
   („Mengenermittlung für fliesen noch nicht verfügbar. Bitte Mengen prüfen.")
   nennt den internen Gewerke-Schlüssel und fordert zu etwas auf, das gar
   nicht geht — die ist als Endtext nicht brauchbar. **Baut die Sperre, nicht
   den Text.**

### Reihenfolge

1. **CoS-E-058 / CoS-E-059** — unverändert vorn (Sandys „JA" von 17:45).
2. **Diese Sperre.** Klein, schließt eine Fehlerklasse ganz.
3. **CoS-E-060** (PM-057/058/059) — wartet ohnehin auf die Klärung, welche
   Datei die Oberfläche speist.
4. **CoS-E-057 (§ 35a)** — bleibt vor Gate 1, hinter allem oben.
5. **PM-060-A / PM-061-A / PM-062-A** — Fliesen-Innenleben, erst vor einer
   Freischaltung.

**PM-060-B bleibt getrennt davon stehen.** `gewerkFuerPosition` entscheidet
das Gewerk am Wortlaut des Titels statt an der Herkunft der Zeile; das trifft
auch Maler und Boden und wird von der Sperre **nicht** miterledigt. Eure
Einschätzung dazu steht weiter aus.

*Chief of Staff · 2026-09-15*

---


---

## CoS-E-058 ✅ Eingriff 1 gebaut — die Türen und Fenster aus der Aufnahme kommen an (15.09.2026)

**Datum:** 2026-09-15, abends · Head of Product Engineering
**Betrifft:** PM-045-A aus CoS-E-058 · **Eingriff 1** der drei aus der
Einschätzung von 17:40
**Status:** gebaut, gemessen, Zusicherung steht. **Nicht committet** — das
kann nur Sandy.

### Was falsch war

`pruefeTuerenLackieren` bekam `lower`, `v` und `meta` — die Räume bekam sie
nie. Stand die Zahl nicht im Satz, endete jede Kette bei `1`:

```
„Im Wohnzimmer die Wände und die Decke streichen, die Innentüren lackieren."
Aufnahme: Wohnzimmer, 4 Türen

vorher:  Türen abschleifen = 1 · grundieren = 1 · lackieren = 1 · Zarge = 1
nachher: Türen abschleifen = 4 · grundieren = 4 · lackieren = 4 · Zarge = 4
```

Gemessen am **echten Weg** (`verarbeiteExtraktion`), nicht an einer von Hand
gebauten `meta` — das ist die Lehre aus PM-045-B, und sie steht als eigene
Zusicherung in der Testdatei.

Die Zahl war nie verloren. `raeume[].tueren` liegt seit jeher in der
Extraktion; sie kam nur nie bis zu der Regel, die die Positionen baut.

### Was gebaut ist

| Datei | Änderung |
|---|---|
| `src/lib/mengen/gesagte-werte.ts` | neu: `oeffnungenAusAufnahme()` — summiert Türen und Fenster über alle Räume, **angenommene Öffnungen (`annahme: true`) zählen nicht mit** |
| `src/lib/mengen/extraktion-pipeline.ts` | gibt die zwei Zahlen als `tuerenAusAufnahme` / `fensterAusAufnahme` in die `meta` |
| `src/lib/mengen/mehrgewerk.ts`, `src/lib/vollstaendigkeit/index.ts`, `src/lib/vollstaendigkeit/maler.ts` | die zwei Felder durch den `meta`-Vertrag durchgereicht |
| `src/lib/vollstaendigkeit/maler-lackieren.ts` | `pruefeTuerenLackieren` und `pruefeFensterLackieren` lesen sie |
| `src/lib/__tests__/cos-e-058-oeffnungen-aus-aufnahme.test.ts` | **neu**, 15 Zusicherungen |

### Die eine Entscheidung darin — und warum sie anders ausfiel als angekündigt

In der Einschätzung von 17:40 stand: *„Türanzahl aus den Räumen … und ihr
**Vorrang vor der Textzählung** geben."* **So ist es nicht gebaut, und zwar
mit Absicht.** Gebaut ist die umgekehrte Reihenfolge:

> gesprochene Zahl → **dann** Aufnahme → **dann** die Zimmer-Annahme → **dann** `1`

Der Grund ist beim Nachmessen aufgefallen: Sagt jemand *„die zwei Türen
lackieren"*, während die Aufnahme vier führt, hätte der Vorrang der Aufnahme
**vier** ins Angebot geschrieben. **Die Aufnahme ist der Bestand, der Satz
ist der Auftrag.** Zwei bestellte Türen zu vier zu machen wäre derselbe
Fehler wie PM-046-A, nur in die andere Richtung — und teurer, weil er auf
jedem Angebot landet, auf dem jemand eine Teilmenge nennt.

Die Lücke, die PM-045-A beschreibt, schließt die neue Reihenfolge
vollständig: Sie tritt genau dort an die Stelle der alten `1`, wo im Satz
gar keine Zahl steht. Das ist der Fall aus dem Fund.

**Angenommene Öffnungen tragen keine Menge** (`annahme: true` wird
übersprungen) — dieselbe Grenze wie PM-023: nachholen, was jemand gesagt
hat, nichts erfinden. Auch dafür steht eine Zusicherung.

### Was NICHT dazugehört, obwohl es in der Einschätzung stand

`pruefeHeizkLackieren` habe ich als dritte betroffene Stelle genannt. **Das
war zu schnell:** Heizkörper stehen nicht in `raeume[]`, es gibt für sie
keine Aufnahme-Quelle, die man durchreichen könnte — nur das Feld
`heizkoerper` an der Wurzel der Extraktion. Es zu benutzen hieße, den
Raum-Verteiler aus DC-091 im selben Ausdruck umzubauen (die Aufteilung „je
ein Heizkörper pro Raum" hängt genau dort). Das ist ein eigener Eingriff,
kein Teil dieses. **Neu und offen**, gehört in die Reihenfolge hinter
Eingriff 2. Der Betrag ist derselbe Bauart wie PM-045-A: ohne Zahl im Satz
ein Heizkörper statt der tatsächlichen Anzahl.

### Gemessen

- **Neu:** 15 Zusicherungen grün.
- **Regression:** 585 Zusicherungen in 27 Dateien gelaufen, **583 grün**.
  Die zwei roten (`entscheidungen-31-08.test.ts`) lesen `src/data/` und
  `src/app/`, die in der Ersatzumgebung nicht liegen — **kein Befund**, das
  ist die Umgebung. `pruefmeister-soll.test.ts` lädt eine Next-Route und
  läuft hier aus demselben Grund nicht.
- **A/B ohne die neuen Felder:** 12 Transkripte durch alte und neue Fassung.
  **Keine einzige Mengenabweichung.** Zwei Rechenwege lauten anders, siehe
  nächster Punkt.

### Eine Zeile, die der Kunde sieht — Frage an den Designer

Der Rechenweg einer Position stand bisher auf `„1 Fenster aus Transkript"`,
**auch wenn im Transkript keine Zahl stand**. Das ist eine Unwahrheit auf
dem Kundenpapier, deshalb steht dort jetzt:

- `„3 Türen aus Aufnahme"` — wenn die Zahl aus der Aufnahme kommt
- `„1 Fenster angenommen"` — wenn weder Satz noch Aufnahme etwas sagen

Die Menge ändert sich dadurch **nicht**, nur der Satz daneben. Der Wortlaut
gehört nicht mir: in `design-check.md` abgelegt.

### Für Sandy

Neue Datei, muss vor dem Push in Git:

```
git add src/lib/__tests__/cos-e-058-oeffnungen-aus-aufnahme.test.ts
```

*Head of Product Engineering · 2026-09-15*

---

## ❌ CoS-E-062 — PM-064 bis PM-068: vier der fünf Funde treffen Maler und Boden, nicht die gesperrten Gewerke

**Datum:** 2026-09-15, 18:45 MESZ · Chief of Staff
**Quelle:** `pruefmeister-restliste.md`, Batch
`src/lib/__tests__/pruefmeister-batch-64-68.test.ts` (liegt auf Sandys Rechner,
**nicht im Repository** — gegen einen frischen Klon von `de1ae80` nachgesehen).
**Stand des Prüfstands laut Prüfmeister:** 4 Prüfungen grün, 15 Sperrklinken.

### Warum das hier eigenen Vorrang beansprucht

Ich habe die fünf Fälle danach sortiert, **welches Gewerk sie treffen** — das
ist die Linie, die Sandy heute gezogen hat (Geldweg zum Kunden zuerst):

| Fall | Gewerk | heute freigeschaltet? | Betrag im gemessenen Fall |
|---|---|---|---|
| PM-064 | Maler | **ja** | 162,00 € **zuviel** |
| PM-065 | Maler | **ja** | 396,00 € fehlen |
| PM-066 | Boden | **ja** | rund **1.050,00 €** fehlen |
| PM-067 | Boden | **ja** | 42,00 € zu wenig + fehlende Position |
| PM-068 | Trockenbau | nein, gesperrt | 980,00 € — hinter der Freischaltung |

**Vier von fünf liegen auf dem Geldweg von Betrieben, die heute Angebote
verschicken.** Die Gewerke-Sperre aus CoS-E-061 fängt davon **keinen einzigen**
ab — sie betrifft nur PM-068.

### Die Fälle, so wie der Prüfmeister sie gemessen hat

**PM-064 — der Wortstamm `sperr` löst einen Isoliergrund aus.**
`maler-sonder.ts` Z. 42 prüft `lower.includes('sperr')`. Der Stamm steckt in
Sperrmüll, absperren, Absperrband, Sperrholz, gesperrt — auf dem Bau
gewöhnliche Wörter. Gemessen mit „Wände und Decke zweimal streichen" plus dem
Nebensatz „… das ist Sperrmüll": Isoliergrund 108,00 € + Tiefengrund 54,00 €.
**Und es ist nicht bloß additiv:** die ausdrücklich bestellte
`Decke streichen`-Position wird verworfen und trägt danach
`automatisch_ergaenzt`. Ein Wort im Nebensatz ändert den Hauptauftrag.

**PM-065 — ein Treppenhaus streichen, keine einzige Treppenposition.**
Der Malerkatalog kann `Treppenstufen streichen / versiegeln` (18,00 €/Stück)
und `Treppengeländer lackieren` (18,00 €/lfdm) — im Angebot steht keine davon.
Stattdessen entstehen Wand- und Deckenflächen für einen Raum 3,00 × 1,20.
Dazu `Geländer abkleben` aus `maler-abkleben.ts` Z. 121, bedingungslos, auch
wenn im Diktat wörtlich „das wird lackiert" steht — dieselbe Verwechslung wie
beim Heizkörper in PM-052, hier ohne jede Bedingung. Setzstufe und Wange fehlen
im Malerkatalog ganz, obwohl Fliesen- und Bodenkatalog die Setzstufe führen.

**PM-066 — der teuerste Fund: gut 1.100 € werden zu rund 50 €.**
Die Stückzahlen erkennt die App richtig (14 Tritt-, 14 Setzstufen). Die Titel
heißen `Trittstufen belegen` / `Setzstufen belegen` (`boden-sonder.ts`
Z. 208/216), der Katalog heißt `Vinyl auf Treppenstufen kleben` (55,00 €/St.)
— kein Treffer, 0,00 €. **Zusätzlich** entsteht der Grundriss der Treppe
einmal als Fläche (3,15 m² × 16,00 € = 50,40 €). Dieselbe Familie wie
PM-060-A: Mengen richtig, Wortlaut trifft den Katalog nicht.

**PM-067 — verklebter Teppich zum Preis des losen, Container fehlt ganz.**
„Der alte Teppich muss raus, verklebt" ergibt `Teppichboden entfernen und
entsorgen` zu 6,00 €/m² — die Zeile für den *losen* Teppich. Verklebt kostet
9,00 €/m²; auf 14 m² sind das 42,00 € zu wenig. „Wir brauchen einen Container"
steht wörtlich im Diktat und erzeugt **keine** Entsorgungsposition. Selbst wenn
sie entstünde, hielte `preisKategoriePasstZuGewerk` sie vom
Entrümpelungskatalog fern — **dieselbe Wand wie PM-060-B.**

**PM-068 — Trockenbau ohne Preis, plus zwei Funde, die eine Katalogzeile nicht
löst.** Mengen stimmen, der Preis fehlt bei jeder Zeile (980,00 € gegen
0,00 €). Zusätzlich: `Ständerwerk CW-Profil` ist eine **Doppelberechnung** —
die Unterkonstruktion steckt im m²-Preis der Trennwand; bekäme die Zeile einen
Preis, stünde die Wand zweimal im Angebot. Und zwei Titel für dieselbe
abgehängte Decke (`decken[]` gegen `raeume[].arbeiten`), dieselbe Familie wie
PM-058. **Gesperrtes Gewerk — steht hinter der Freischaltung.**

### Was ich von euch brauche

1. **Einschätzung zu PM-064 bis PM-067** — Aufwand und Reihenfolge
   untereinander. **Noch nicht bauen:** Sandy entscheidet zuerst, ob dieses
   Ticket vor oder hinter die Gewerke-Sperre gehört (steht bei ihr).
2. **PM-064 gehört vermutlich zu CoS-E-059** — derselbe Dateibereich
   (`maler-sonder.ts`), in dem auch `pruefeWasserflecken` aus PM-046 liegt.
   Wenn ihr es in einem Aufwasch erledigen könnt, sagt das; dann ziehe ich es
   dorthin und dieses Ticket wird um einen Punkt kürzer.
3. **PM-066 und PM-067 sind Titel-gegen-Katalog**, wie PM-060-A. Ob das einzeln
   geflickt oder als Klasse gelöst wird, ist eure Einschätzung — **ich
   entscheide das nicht.**
4. **PM-068 nicht bauen.** Gesperrtes Gewerk. Die Doppelberechnung beim
   Ständerwerk ist aber ein Befund, der eine Freischaltung überlebt —
   festhalten, nicht umsetzen.

**Was ich ausdrücklich nicht behaupte:** dass diese Beträge heute schon auf
verschickten Angeboten stehen. Gemessen ist der Betrag je Fall, nicht seine
Häufigkeit. Der Unterschied zu PM-068 ist trotzdem hart: für PM-064 bis
PM-067 reicht ein gewöhnlicher Maler- oder Bodenauftrag.

*Chief of Staff · 2026-09-15*

---

## ❌ CoS-E-063 — Heizkörper: dieselbe fehlende Mengenquelle wie PM-045-A, eigener Eingriff

**Datum:** 2026-09-15, 18:45 MESZ · Chief of Staff
**Quelle:** eure eigene Meldung zu CoS-E-058, Abschnitt „Was NICHT dazugehört"

Ihr habt `pruefeHeizkLackieren` beim Bauen von Eingriff 1 ausdrücklich
herausgenommen und als neu und offen gemeldet. **Damit es nicht in einer
Fließtext-Notiz verschwindet, bekommt es hier eine Nummer und einen Platz.**

Der Sachverhalt, wie ihr ihn beschrieben habt und wie ich ihn unverändert
weitergebe — **ich habe ihn nicht selbst nachgemessen:** Heizkörper stehen
nicht in `raeume[]`, es gibt für sie nur das Feld `heizkoerper` an der Wurzel
der Extraktion. Es zu benutzen hieße, den Raum-Verteiler aus DC-091 im selben
Ausdruck umzubauen. Ohne Zahl im Satz steht heute **ein** Heizkörper im
Angebot statt der tatsächlichen Anzahl — dieselbe Bauart wie PM-045-A und
derselbe Geldweg.

**Einordnung:** hinter Eingriff 2, wie ihr es vorgeschlagen habt. Kein neuer
Auftrag, nur eine Nummer, damit die Reihenfolge ihn kennt.

*Chief of Staff · 2026-09-15*


<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
