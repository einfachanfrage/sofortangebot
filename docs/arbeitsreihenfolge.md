# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 15.09.2026, 16:50 MESZ · Chief of Staff**
*(ersetzt die Fassung von 16:45 — diese Datei wird immer ersetzt, nie ergänzt)*

---

## Lage in drei Zeilen

**Die CI ist grün.** Lauf **#187** auf Commit **`de1ae80`**: `success`. Damit
ist CoS-E-055 geschlossen — belegt am Lauf, nicht an einer lokalen Messung.
**Produktion grün:** `dpl_Ba3B8QBk`, `READY`, auf demselben Commit.
**`_to_delete/` ist weg** — nachgesehen, der Ordner existiert nicht mehr.
**Neu auf dem Tisch:** sechs Funde des Prüfmeisters aus PM-045 und PM-046,
drei davon mit einem Geldweg zum Kunden. Verteilt als CoS-E-058 und CoS-E-059.

---

## ✅ Die rote CI ist erledigt

| Lauf | Commit | Ergebnis |
|---|---|---|
| CI #184 | `2f93123` | failure — die sieben Zusicherungen |
| CI #186 | `caec47f` | failure — dieselben sieben |
| **CI #187** | **`de1ae80`** | **success** |

`de1ae80` („CoS-E-055: Tuer-Anker, Taetigkeiten, Materialanteil + Doku")
enthält 19 Quelldateien **und** die sechs Doku-Dateien, die vorher nur auf
Sandys Rechner lagen — PD-009 und PD-010 eingeschlossen.

Der Prüfmeister hatte geschrieben: „die Behebung liegt auf Sandys Rechner und
nicht im Repository". Genau das war es. Die Vermutung ist damit bestätigt, und
zwar an der einzigen Stelle, an der sie sich bestätigen lässt.

**Was ich weiterhin nicht behaupte:** dass damit alle Tests der Fallbasis grün
sind. #187 sagt, dass der CI-Lauf durchgeht — nicht, dass die sechs neuen
Funde unten schon abgedeckt wären. Sie sind es nicht.

---

## 🔴 Neu: sechs Funde aus PM-045 und PM-046

| Fund | Wirkung auf ein einzelnes Angebot | liegt bei |
|---|---|---|
| PM-045-A/B — „vier Türen" wird als **eine** gerechnet | **540,00 € zu wenig** | Engineering **CoS-E-058** |
| PM-045-C — Begründung an der Tür erzeugt Fensterzeilen | Zeilen, die niemand bestellt hat | Engineering **CoS-E-058** |
| PM-046-A — Sperrgrund auf Boden- statt Wandfläche | **219,60 € zu wenig**, zwei Drittel ohne Sperre | Engineering **CoS-E-059** |
| PM-046-B — Isolier- **und** Tiefengrund auf derselben Fläche | **76,95 € zu viel**, fachlich schädlich | Engineering **CoS-E-059** |
| PM-046-C — bestellte Decke trägt `automatisch_ergaenzt` | fällt aus dem Angebot, sobald „Nichts erfinden" umgebaut ist | Engineering **CoS-E-059** |

Sperrklinke für alle: `src/lib/__tests__/pruefmeister-batch-1509.test.ts` —
liegt auf Sandys Rechner, noch nicht committet.

**A und B in PM-046 zeigen in verschiedene Richtungen** — einmal zu wenig,
einmal zu viel. Ob eine Ursache oder zwei, weiß ich nicht und rate es nicht;
die Einschätzung steht bei Engineering.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | **Neu: Reihenfolge bei Engineering.** PM-045/PM-046 vor CoS-E-057 (§ 35a) oder nicht? Empfehlung und Gegenargument in `entscheidungen-fuer-sandy.md` | eine Antwort |
| 2 | **Committen.** Neun Dateien liegen nur auf ihrem Rechner — Liste unten | ein Befehl |
| 3 | Vercel-Benachrichtigung · Datenschutz-Freigabe · Versicherung · Stripe · Gewerbeanmeldung KW 41 (CoS-041) | unverändert übernommen, in diesem Lauf nicht neu geprüft |

**Erledigt und damit von der Liste:** `_to_delete/` löschen · die sechs
Doku-Dateien committen · die vier Entscheidungen von 16:45.

### Nur auf Sandys Rechner, nicht im Repository

```
docs/arbeitsreihenfolge.md
docs/chief-of-staff-engineering-todos.md
docs/entscheidungen-fuer-sandy.md
docs/pruefmeister-restliste.md
docs/pruefmeister-themenspeicher.md
docs/pruefmeister-notizen-fuer-designer.md
docs/vokabular-abgleich.md
src/lib/__tests__/pm-flaeche-oder-zeit.test.ts
src/lib/__tests__/pm-materialanteil-25.test.ts
src/lib/__tests__/pm-vorlagen-zwilling.test.ts
src/lib/__tests__/pruefmeister-batch-1509.test.ts
src/lib/__tests__/pm-vokabular-varianten.test.ts
src/lib/__tests__/pm-preisliste-material.test.ts
src/lib/__tests__/pruefmeister-batch-60-62.test.ts
scripts/vokabular-abgleich.mjs
```

**Sieben davon sind neue Dateien** — der Push-Hook blockiert, bis sie `git add`
gesehen haben. `scripts/vokabular-abgleich.mjs` ist geändert, nicht neu.

---

## Head of Product Engineering

1. **CoS-E-058 und CoS-E-059 einschätzen** — die sechs Funde. Keine Umsetzung
   gefragt, sondern: ein Eingriff oder mehrere, und hängt die Stückzahl an der
   Extraktion oder am Matching. **Das geht vor allem anderen**, weil hier
   falsche Beträge auf Kundenpapier landen
2. **CoS-E-053 weiterbauen**, mit den vier Legal-Bedingungen. Der
   Preisanpassungs-Hinweis darf **nicht** aufs Kunden-PDF, bevor Sandy einen
   Wortlaut freigegeben hat — LR-16
3. **CoS-E-056** bleibt bei Manfreds Vlies-Antwort. `taetigkeiten.ts` bis
   dahin unangetastet, wie vereinbart
4. **CoS-E-057** — angenommen, wartet auf Legals Feldliste (CoS-L-008).
   Schema-Wechsel an `companies`: Migration **und** Eintrag in
   `check_migrationen.sql`, der Abgleich ist scharf
5. **Entsperrt:** „Fläche oder Zeit" ist entschieden (PD-013), 25 % bleibt.
   Zwei Zeilen bleiben ausdrücklich offen — `Untergrund spachteln` und
   `Übergangsprofil / Schwelle einbauen`

## Product Designer

1. **DC-102 ist freigegeben** — Ablauf und Darstellung, **nicht die Zahlen**.
   PD-009 lesen, bevor die Tabelle übernommen wird; Basiswerte kommen aus
   `default-prices.ts`, nicht aus dem Prototyp
2. Der Einbau hängt weiter an CoS-E-053
3. **DC-105 ist live** (`caec47f`) — Onboarding-Schritt 4 heißt jetzt „Wie
   rechnest du ab?". In der laufenden App nachsehen
4. Live-Test von DC-101 / DC-103 / DC-104 / DC-089 am aktuellen Stand
5. DC-047 und DC-048 sind live — beide brauchen einen Blick in der App

## Platform

1. **CoS-P-023 — der Hook ist freigegeben, bauen.** Zweiter, isolierter
   Checkout gegen den tatsächlich gepushten Commit. 6–15 s pro Push sind
   akzeptiert; deutlich mehr ist eine Rückmeldung wert
2. **Mit im selben Lauf:** `pruefe-migrationsliste.mjs` in den Hook, und der
   zurückgestellte Designer-Vorschlag ist entsperrt
3. **CoS-P-020** — Fehlertext in `api/integrations/test`. Wenn er offen
   bleibt, eine Zeile, dass er bewusst offen bleibt
4. **CoS-P-021** — zwei Fragen zum Rechnungsnummernkreis. Einschätzung, keine
   Umsetzung, kein Löschen von Produktionsdaten
5. **CoS-P-022** — `docs-sichern.mjs pruefen` in die CI? Eure Entscheidung,
   steht weiter offen. **Sie wird dringender:** die Shell-Einhängung ist seit
   dem 08.09. defekt, die Sicherung läuft also seit einer Woche nicht

## Prüfmeister

1. ✅ **25 % gegen 26,1 % — entschieden: 25 % bleibt.** `pm-materialanteil-25.test.ts`
2. ✅ **„Fläche oder Zeit" gegengeprüft und entschieden** (PD-013).
   `pm-flaeche-oder-zeit.test.ts`
3. ✅ **Vorlagen ohne Katalog-Zwilling nachgemessen** — 4 von 134 finden sich
   selbst nicht, 2 davon mit anderem Preis. `vokabular-abgleich.md` Q
4. ✅ **`VARIANTEN` nachgezogen — war die falsche Diagnose.** Der Zähler
   „nicht prüfbar" lag an einem Lesefehler im Skript selbst (`literal()` zählte
   `${ … }` nicht mit und brach an verschachtelten Templates ab), nicht an einer
   Liste. Behoben, **Zähler 0**; alle sechs Titel haben einen Preis, keiner ist
   eine Lücke. `vokabular-abgleich.md` R, `pm-vokabular-varianten.test.ts`
5. ✅ **`Übergangsprofil / Schwelle` nachgemessen.** Antwort auf die Frage aus
   der Restliste: **die Stunden stimmen, das Material fehlt** — bewiesen am
   Katalog selbst (Ausbau kostet 8,00 €; steckten 8–12 € Profil im Einbaupreis
   von 15,00 €, bliebe für die Einbau-Arbeit weniger als für den Ausbau).
   0,29 h unterstellen 51,7 €/h, im Band der übrigen Zeit-Zeilen
6. ⏸ **Gegenprobe aus PD-009 §7** — wartet auf den gebauten Preise-Schritt
7. ⏸ **PM-002** braucht einen Live-Lauf
8. **Fallbasis: 62 von 100** — neu PM-057 bis PM-062, zwei Batches:
   - **Preisliste (PM-057/058/059)** — drei Funde, zwei mit Geldweg. Eine Zeile
     mit `material: 'zubehoer'` trägt das Zubehör nicht im Preis ·
     `Grundieren (Tiefengrund)` steht **zweimal** in einer Preisliste, 5,50 €
     gegen 3,00 € bei Katalog 4,50 € · **fünf** Zeilen, bei denen
     `preis-ableitung.ts` und `materialanteil.ts` dieselbe Materialfrage
     verschieden beantworten. `pm-preisliste-material.test.ts`, PD-014
   - **Bad/Fliesen (PM-060/061/062)** — erster Batch außerhalb Maler/Boden.
     `pruefmeister-batch-60-62.test.ts`
9. 🔴 **Der größte Fund des Laufs: `fliesen` ist ein aktives Gewerk und kann
   ein Bad nicht bepreisen.** Sieben von neun Zeilen eines Bades (2,40 × 1,80 m)
   finden keinen Preis — **1.935,94 €**, Versand gesperrt. Zwei Ursachen,
   getrennt gemessen: Wortlaut (Engine `Verfugung Boden`, Katalog
   `Verfugen Boden`) und **Gewerke-Zuordnung** — `gewerkFuerPosition` liest
   „Wand" und entscheidet auf `maler`, für alle drei Wand-Zeilen. Allein daran
   hängen 493,92 €, denn `Verbundabdichtung Wand` hätte im Fliesenkatalog mit
   Score 0,94 getroffen. Dazu: „nur die Wandfliesen" erzeugt trotzdem drei
   Bodenzeilen (324,50 €), und `Altfliesen abstemmen` nimmt immer den
   Bodenpreis (72,00 € auf 18 m²). **Gehört zu Engineering, vor der nächsten
   Gewerke-Freischaltung**
10. **Offen ohne App:** die drei übrigen aktiven Gewerke (Trockenbau,
    Sanitär/Heizung, Elektro) stehen weiterhin nicht im Abgleich — nachsehen,
    bevor jemand eine Zahl daraus zitiert · `Untergrund spachteln` bleibt
    `anker`, bis der Materialanteil gemessen ist · die 142 Vorlagen der
    gesperrten Gewerke, jeweils **vor** der Freischaltung

## Legal

1. **CoS-L-008 — vordringlich:** die abschließende Feldliste je Rechtsform
   (e. K. und GmbH & Co. KG sind nicht dieselbe wie GmbH/UG), die Abgrenzung
   PDF gegen Produkt-E-Mails, und was bei unvollständigem Profil passiert.
   Engineering wartet darauf und fängt bewusst nicht an
2. **§ 14 UStG — Pflichtangabenliste nachholen**, sobald die Normtexte
   abrufbar sind (CoS-L-006)
3. **Materialangabe auf dem Kunden-PDF bewerten** — die vier Bedingungen sind
   an Engineering übergeben
4. CoS-L-002 · CoS-L-004 laufend

## Manfred

1. **Session 3: Registrierung end-to-end** — steht weiterhin aus
2. **DC-101 nachprüfen**: am Handy laden und **sofort** lostippen
3. **Rückfrage aus CoS-E-056:** Gilt „Tapete extra" bei ihm auch für Vlies?
4. **Aus PD-009 §5:** Seine 75 % gegen die 63 % des Katalogs sind kein
   Widerspruch — zu bestätigen, nicht zu entscheiden
5. G.3 — seine zwei Szenarien in der laufenden App, offen seit 11.09.

---

## Was ich als Nächstes tue

**Auf Engineerings Einschätzung zu CoS-E-058/059 warten** und auf Sandys
Antwort zur Reihenfolge. Beides zusammen entscheidet, was als Nächstes gebaut
wird.

**Gate 1 rechne ich weiterhin nicht neu** — ich warte auf Manfreds Session 3,
sonst steht die Zahl wieder auf „ist deployt" statt auf „funktioniert". Die
grüne CI ändert daran nichts.

**Zum Ablauf dieses Laufs:** `node scripts/docs-sichern.mjs` ist erneut nicht
gelaufen (Shell-Einhängung seit dem Windows-Update vom 08.09. defekt).
Gelesen und geschrieben wurde über Staging/Commit, jeweils mit
`expectedMtimeMs`. CI-Ergebnisse sind an den einzelnen Lauf-Seiten geprüft,
nicht an der Übersichtsliste — die Liste hat in diesem Lauf einen roten Lauf
als grün angezeigt.

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
