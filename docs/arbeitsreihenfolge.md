# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 15.09.2026, 18:00 MESZ · Chief of Staff**
*(ersetzt die Fassung von 17:45 — diese Datei wird immer ersetzt, nie ergänzt.
Die Fassungen davor trugen „16:45"/„16:50", waren aber um 17:39 bzw. 17:45
geschrieben: eine Stunde zu früh gestempelt. Ab hier steht die echte Zeit.)*

---

## Lage in drei Zeilen

**Grün und unverändert.** CI **#187** auf `de1ae80`: `success`, an der
Lauf-Seite nachgesehen (Lauf-ID 34982664337). Produktion `dpl_Ba3B8QBk`:
`READY`, derselbe Commit. Seit dem letzten Lauf ist nichts deployt worden.
**Sandys „JA" ist verteilt:** CoS-E-058/059 vor § 35a.
**Engineering hat eingeschätzt:** drei Eingriffe, nicht sechs.
**Der Prüfmeister hat nachgelegt:** PM-057 bis PM-062, Fallbasis **62 von
100**. Verteilt als CoS-E-060 und CoS-E-061.
**Der Designer hat DC-014 Punkt 2 fertig** — neue `src/lib/fehlertexte.ts`.

---

## Was seit dem letzten Lauf dazugekommen ist

| Rolle | Ergebnis | liegt jetzt |
|---|---|---|
| Engineering | Einschätzung zu den sechs Funden: **drei Eingriffe**, PM-046 A/B/C sind **eine** Ursache (`pruefeWasserflecken` in `vollstaendigkeit/maler-sonder.ts`) | beim Prüfmeister (zwei Fachfragen), dann bauen |
| Prüfmeister | **PM-057 bis PM-059** (Preisliste/Material) | Engineering, **CoS-E-060** |
| Prüfmeister | **PM-060 bis PM-062** (Bad/Fliesen) | Engineering, **CoS-E-061** |
| Prüfmeister | `VARIANTEN`-Zähler war eine Fehldiagnose im Skript selbst — behoben, Zähler 0 | erledigt |
| Prüfmeister | `Übergangsprofil / Schwelle` nachgemessen: **Stunden stimmen, Material fehlt** | als PM-057 in CoS-E-060 |
| Designer | **DC-014 Punkt 2 erledigt** — keine Rohmeldung eines Systems mehr im Produkt | erledigt, nicht committet |

---

## 🔎 Eine Korrektur, die ich selbst nachgesehen habe

Der Prüfmeister schreibt in der Restliste, `fliesen` stehe auf `aktiv: true`
und ein Fliesenleger bekomme das Gewerk angeboten. **Das stimmt so nicht:**
Das gefundene `aktiv: true` gehört zur Kleinmaterial-Pauschale; `fliesen`,
`trockenbau`, `sanitaer_heizung` und `elektro` stehen in
`INAKTIVE_GEWERKE_IDS`, und der Gewerke-Schritt im Onboarding rendert nur
`maler` und `boden_parkett`.

**Sein Befund bleibt richtig, über einen anderen Weg:** Das Gewerk kommt aus
der Extraktion des **Diktats** (`extraktion.gewerk`), nicht aus dem
Betriebsprofil — und `GEWERK_ENGINES` hält alle sechs Engines bereit, ohne zu
fragen, ob das Gewerk freigeschaltet ist. Betroffen ist also nicht der
Fliesenleger, den es nicht gibt, sondern der **Maler mit einem Bad im
Diktat**. Das ist die erste Frage in CoS-E-061 und die einzige offene
Entscheidung für Sandy. Festgehalten für den Prüfmeister in
`pruefmeister-themenspeicher.md` K.3.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | **Neu: nicht freigeschaltetes Gewerk sperren?** Ein Maler, der ein Bad diktiert, bekommt sieben preislose Zeilen (1.935,94 €). Empfehlung: sperren, vor Gate 1. Steht in `entscheidungen-fuer-sandy.md` | eine Antwort |
| 2 | **Committen.** Acht Doku-Dateien, neun neue Testdateien, `src/lib/fehlertexte.ts` und die Anzeigestellen dazu | ein Befehl |
| 3 | Vercel-Benachrichtigung · Datenschutz-Freigabe · Versicherung · Stripe · Gewerbeanmeldung KW 41 (CoS-041) | unverändert übernommen, in diesem Lauf nicht neu geprüft |

**Erledigt und damit von der Liste:** die Reihenfolge-Entscheidung
(„JA", 17:45 MESZ) · `_to_delete/` auf dem Rechner · die sechs Doku-Dateien
von 17:15.

### Nicht im Repository (gegen `de1ae80` verglichen, frischer Klon)

Doku (acht):
```
docs/arbeitsreihenfolge.md
docs/chief-of-staff-engineering-todos.md
docs/chief-of-staff-platform-todos.md
docs/design-check.md
docs/entscheidungen-fuer-sandy.md
docs/pruefmeister-notizen-fuer-designer.md
docs/pruefmeister-restliste.md
docs/pruefmeister-themenspeicher.md
docs/vokabular-abgleich.md
```
Neue Testdateien (neun):
```
src/lib/__tests__/dc014-fehlertexte.test.ts
src/lib/__tests__/pm-flaeche-oder-zeit.test.ts
src/lib/__tests__/pm-materialanteil-25.test.ts
src/lib/__tests__/pm-preisliste-material.test.ts
src/lib/__tests__/pm-vokabular-varianten.test.ts
src/lib/__tests__/pm-vorlagen-zwilling.test.ts
src/lib/__tests__/pruefmeister-batch-1509.test.ts
src/lib/__tests__/pruefmeister-batch-47-56.test.ts
src/lib/__tests__/pruefmeister-batch-60-62.test.ts
```
Neue Quelldatei: `src/lib/fehlertexte.ts`.
Dazu die Anzeigestellen aus DC-014 und `api/upload-logo` — **deren Anzahl habe
ich nicht gezählt und behaupte sie nicht.** `git add -A` nimmt alles mit.

**`_to_delete/` liegt noch im Repository** — 261 Dateien, 4,4 MB, in `de1ae80`
nachgezählt. `.gitignore` entfernt nichts, was schon eingecheckt ist. Der
nächste `git add -A` trägt die Löschung mit ein.

---

## Head of Product Engineering

1. **CoS-E-058/059 bauen — freigegeben, Reihenfolge steht.** Sandys „JA" vom
   17:45 MESZ. Eure eigene Empfehlung: Eingriff 3 (PM-046) zuerst, dann 1,
   dann 2. **Eingriff 3 wartet auf zwei Antworten des Prüfmeisters** (K.1) —
   ohne die wird keine Ersatzregel gebaut, so steht es bei euch, und so bleibt
   es. Eingriff 1 und 2 hängen nicht daran
2. **CoS-E-060 einschätzen** (PM-057/058/059). **Die eine Frage, die vorher
   geklärt sein muss:** welche Datei speist die Oberfläche —
   `preis-ableitung.ts` oder `materialanteil.ts`? Der Prüfmeister beantwortet
   die fachliche Frage erst, wenn es *eine* Quelle gibt
3. **CoS-E-061 einschätzen** (Fliesen). Zuerst das **Tor**: Soll
   `berechneMengen` ein Gewerk rechnen, das nicht in `AKTIVE_GEWERKE` steht?
   Dann PM-060-B (`gewerkFuerPosition` entscheidet am Wort, nicht an der
   Herkunft der Zeile) — das trifft jede künftige Freischaltung
4. **CoS-E-053 weiterbauen**, mit den vier Legal-Bedingungen. Der
   Preisanpassungs-Hinweis darf **nicht** aufs Kunden-PDF, bevor Sandy einen
   Wortlaut freigegeben hat — LR-16
5. **CoS-E-056** bleibt bei Manfreds Vlies-Antwort. `taetigkeiten.ts` bis
   dahin unangetastet
6. **CoS-E-057 (§ 35a)** — bleibt vor Gate 1, aber hinter 1. Wartet ohnehin
   auf Legals Feldliste (CoS-L-008). Schema-Wechsel an `companies`: Migration
   **und** Eintrag in `check_migrationen.sql`
7. **Entsperrt:** „Fläche oder Zeit" ist entschieden (PD-013), 25 % bleibt.
   `Untergrund spachteln` und `Übergangsprofil / Schwelle einbauen` bleiben
   ausdrücklich offen

## Product Designer

1. ✅ **DC-014 Punkt 2 erledigt.** Punkt 1 (RLS-Migration) bleibt bei
   Platform, CoS-P-005
2. **Nachzuziehen, sobald Engineering committet hat:** die eine Stelle in
   `AngebotDetail.tsx`, bewusst ausgelassen. Kein neuer Auftrag nötig
3. **DC-102 ist freigegeben** — Ablauf und Darstellung, **nicht die Zahlen**.
   PD-009 lesen, bevor die Tabelle übernommen wird; Basiswerte kommen aus
   `default-prices.ts`. Der Einbau hängt weiter an CoS-E-053
4. **DC-105 ist live** (`caec47f`) — Onboarding-Schritt 4 in der App nachsehen
5. Live-Test von DC-101 / DC-103 / DC-104 / DC-089; DC-047 und DC-048 sind
   live und brauchen einen Blick

## Platform

1. **CoS-P-023 — der Hook ist freigegeben, bauen.** Zweiter, isolierter
   Checkout gegen den tatsächlich gepushten Commit
2. **Mit im selben Lauf:** `pruefe-migrationsliste.mjs` in den Hook, und der
   zurückgestellte Designer-Vorschlag ist entsperrt
3. **CoS-P-020** — Fehlertext in `api/integrations/test`. Bleibt er offen,
   eine Zeile, dass er bewusst offen bleibt. **Hinweis:** der Designer hat mit
   `src/lib/fehlertexte.ts` jetzt eine `nutzerFehler()`-Funktion gebaut — die
   Stelle lässt sich damit vermutlich in einer Zeile erledigen
4. **CoS-P-021** — zwei Fragen zum Rechnungsnummernkreis. Einschätzung, keine
   Umsetzung, kein Löschen von Produktionsdaten
5. **CoS-P-022** — `docs-sichern.mjs pruefen` in die CI? Eure Entscheidung,
   weiter offen. **Wird dringender:** die Shell-Einhängung ist seit dem 08.09.
   defekt, die Sicherung läuft seit einer Woche nicht
6. **CoS-P-005** — die fehlende RLS-Policy für den Logo-Upload. Der Designer
   hat den *Text* erledigt, die *Ursache* liegt weiter bei euch

## Prüfmeister

1. **K.1 beantworten — das blockiert Engineerings Eingriff 3.** Zwei Fragen in
   `pruefmeister-themenspeicher.md` K: welche Fläche gilt bei bloßem
   „Sperrgrund", und fällt der Tiefengrund ganz weg oder nur auf der
   gesperrten Fläche
2. **K.2 — die Batch-Tests.** `meta` gegen `textMitZahlen`: Engineering hält
   die Sperrklinke PM-045-B/PM-050-A für auf einen Zustand gesetzt, den das
   Produkt nicht hat. Vorschlag steht in K.2
3. **K.3 lesen — Korrektur an „aktive Gewerke".** Der Befund bleibt, die
   Begründung nicht. Für Restliste Nr. 2 und Nr. 10 heißt das: die vier
   Gewerke sind nicht „aktiv", sie sind über das **Diktat erreichbar** — das
   ist die schärfere Formulierung, nicht die weichere
4. ✅ Erledigt in diesem Lauf: `VARIANTEN` (Zähler 0), `Übergangsprofil /
   Schwelle` nachgemessen, Batch PM-057 bis PM-062
5. ⏸ **Gegenprobe aus PD-009 §7** — wartet auf den gebauten Preise-Schritt
6. **Fallbasis: 62 von 100.** Nächste Themen laut Speicher: Treppen komplett,
   Abbruch und Entsorgung, mehrere Aufnahmen pro Angebot, Trockenbau
7. **Offen ohne App:** die 142 Vorlagen der gesperrten Gewerke, jeweils
   **vor** der Freischaltung

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

**Auf zwei Dinge warten:** Sandys Entscheidung zum Gewerke-Tor und die
Antworten des Prüfmeisters auf K.1. Beides zusammen entsperrt, was Engineering
als Nächstes baut.

**Gate 1 rechne ich weiterhin nicht neu** — ich warte auf Manfreds Session 3,
sonst steht die Zahl wieder auf „ist deployt" statt auf „funktioniert".

**Zum Ablauf dieses Laufs:** `node scripts/docs-sichern.mjs` ist erneut nicht
gelaufen (Shell-Einhängung seit dem Windows-Update vom 08.09. defekt). Gelesen
und geschrieben wurde über Staging/Commit, jeweils mit `expectedMtimeMs` —
drei Dateien wurden dabei einmal zurückgewiesen, weil ein paralleler Lauf sie
verändert hatte; neu gelesen und darauf aufgesetzt. Der Repository-Stand wurde
gegen einen frischen Klon von `de1ae80` verglichen, die CI am einzelnen Lauf
geprüft, nicht an der Übersichtsliste.

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
