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
| CoS-E-019 | TN-045 | Gesprochener Ausführungstermin („in 3 Wochen fertig") wird nirgends gespeichert, kein Feld dafür vorgesehen | mittel | ❌ offen — braucht Prompt-Änderung + Edge-Deploy, siehe Batch 2 |
| CoS-E-020 | TN-051 | Leerzeichen verschwinden beim Umbenennen bestehender Positionen, 3× reproduziert, tritt nur im Bearbeiten-Pfad auf (nicht bei neuen Positionen) | hoch | ❌ offen |
| CoS-E-021 | TN-052 | Wechsel 1×→2× verlangt manuelles Ändern von Titel, Untertitel UND Preis statt eines Umschalters, obwohl die App den Preis kennt | mittel | ❌ offen |
| CoS-E-022 | TN-053 | Neue Positionen landen immer unter „Allgemein", auch wenn sie eindeutig zu einem Raum gehören | mittel | ❌ offen |
| CoS-E-023 | TN-054 | „Senden" ist aktiv, obwohl kein Kunde zugewiesen ist | hoch | ✅ erledigt — gleiche Regel |
| CoS-E-024 | TN-060 | Vorgeschlagene Einheit bei „Preis anlegen" war falsch (m² statt Stück bei „Heizkörper abkleben – 1 Stück") | mittel | ❌ offen |
| CoS-E-025 | TN-063 | Drei verschiedene Angebotsnummer-Formate gleichzeitig sichtbar in der App | mittel | ❌ offen |
| CoS-E-026 | TN-064 | Deckenpositionen landen unter „Allgemein" statt beim zugehörigen Raum (siehe auch DC-091/TN-104) | mittel | ❌ offen |
| CoS-E-027 | TN-066 | Nach „Abbrechen" im Bearbeiten-Modus springt der Status zurück auf grauen Punkt statt „Bereit" | mittel | ❌ offen |
| CoS-E-028 | TN-068/TN-069 | „+ Kunde" im Angebot bietet nur Suche, kein „Neu anlegen" — Umweg über anderes Menü nötig, betrifft laut Manfred rund 80 % seiner Angebote (Erstkunden) | hoch | 🟡 erledigt — „Neu anlegen" direkt im Angebot |
| CoS-E-029 | TN-071 | Erster Tipp auf „Kunde anlegen" reagiert nicht | mittel | ❌ offen |
| CoS-E-030 | TN-078 | WhatsApp-Versand zeigt „PDF wird vorbereitet…" ohne erkennbaren Abschluss nach 2 Sekunden | mittel | ❌ offen |
| CoS-E-031 | TN-081 | „Gültig bis" bleibt leer trotz 30-Tage-Standard in den Einstellungen (gleiche Familie wie CoS-E-013/CoS-E-042) | hoch | 🟡 erledigt — gleiche Ursache wie CoS-E-013 |
| CoS-E-032 | TN-083 | Feld „Interne Notiz" bleibt leer, obwohl genau dort ein gesprochener Termin hingehört hätte (siehe TN-045/CoS-E-019) | niedrig | ❌ offen |
| CoS-E-033 | TN-086 | Rechnungsnummer = Angebotsnummer, obwohl die Einstellungen getrennte Nummernkreise vorsehen | hoch | ✅ erledigt — mit dem Reiter weg; echter Nummernkreis erst mit echter Rechnung |
| CoS-E-034 | TN-088 | Interne Prüfhinweise und „bitte Angebot prüfen"-Fußzeile erscheinen auch auf der Rechnung, nicht nur auf dem Angebot | hoch | 🟡 teilweise — interne Hinweise raus, Rest an der Rechnungs-Entscheidung |
| CoS-E-035 | TN-090 | Ein Testangebot mit 0,00-€-Position wurde als „beauftragt/angenommen" markiert, ohne dass die fehlende Bepreisung vorher auffiel | hoch | ✅ erledigt — gleiche Regel; kann nicht mehr unbemerkt beauftragt werden |
| CoS-E-036 | TN-091 | Kein auffindbarer Weg, aus einem beauftragten Angebot eine Rechnung zu erzeugen | hoch | ✅ erledigt — hinfällig, es gibt keine Rechnung mehr zu erzeugen |
| CoS-E-037 | TN-092 | Preis-Matching findet einen vorhandenen Datenbankeintrag nicht, weil intern ein anderer Begriff verwendet wird als in der Preisdatenbank | hoch | ❌ offen — Vokabelfrage (Sperranstrich/Isoliergrund), bitte an den Prüfmeister |
| CoS-E-038 | TN-093/TN-094 | Angebotspreise weichen von der Preisdatenbank ab, uneinheitlich zwischen zwei Angeboten desselben Betriebs für dieselbe Position | hoch | ✅ erledigt — zwei reproduzierte Fehler behoben, an Manfreds echten Daten nachgestellt |
| CoS-E-039 | TN-095 | Preisdatenbank hat viele Dopplungen mit identischen Preisen unter leicht anderem Namen | mittel | ✅ 12.09. — **keine Dopplungen, sondern Staffeln**: 64 von 2379 Zeilen waren über ihren eigenen Namen unerreichbar und bekamen still den billigeren Preis. Jetzt 22, alle 22 durch ein Wort unterscheidbar → Entscheidungsliste für Manfred / Prüfmeister, siehe unten |
| CoS-E-040 | TN-097 | Erschwerniszuschläge „Altbau"/„bewohnt" lassen sich in den Einstellungen nirgends abschalten | mittel | ❌ offen |
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

*Head of Product Engineering · 2026-09-12*

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
