# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 16.09.2026, 10:10 MESZ · Chief of Staff**
*(ersetzt die Fassung von 01:00 MESZ samt Prüfmeister-Nachtrag — diese Datei wird immer ersetzt, nie ergänzt.)*

---

## Lage in drei Zeilen

**Sandy hat um 06:18 MESZ committet** (`bd64900`, DC-110). Produktion ist
dieser Commit und `READY`. Alles, was seither gebaut wurde — drei
Engineering-Punkte und zwei Prüfmeister-Batches —, liegt wieder nur auf der
Platte.

**Die CI ist rot, aber aus einem anderen Grund als gestern behauptet.** Läufe
#188/#189/#190 sind rot, #187 (`de1ae80`) war der letzte grüne. `ci.yml` ist
**nicht** kaputt — das war meine Fehldiagnose, sie ist zurückgenommen. Der
wahrscheinliche Grund ist das Lint-Budget, und der Fix liegt uncommittet auf
der Platte.

**Zwei Doku-Dateien waren zum dritten Mal in zwei Tagen überschrieben.** Beide
sind aus dem Commit repariert, nichts ist verloren. Als **CoS-P-025** bei
Platform.

---

## Was seit 01:00 MESZ dazugekommen ist — und wo es jetzt liegt

| Rolle | Ergebnis | Status |
|---|---|---|
| Sandy | **`bd64900` gepusht** (DC-110), Produktion `READY` | erledigt |
| Engineering | **CoS-E-062 Zug 1 ist ZU** — PM-067-A, PM-066-C, PM-066-A/B und PM-066-D gebaut. Größter Einzelposten 770,00 €/Fall; die doppelte Setzstufen-Zeile ist weg, die Treppe bekommt ihren Grundriss nicht mehr zusätzlich als Fläche | fertig, **nicht committet** |
| Engineering | **Neuer Fund, von mir eingeordnet als CoS-E-070** — zwei verschiedene Quadratmeterzahlen für denselben Boden (Fischgrät): Arbeit auf 33,60 m², Aufpreis darauf auf 36,80 m² | verteilt |
| Prüfmeister | **Batch PM-089…PM-097 gerechnet** — Fallbasis **97/100**. 17 grün, 16 Sperrklinken | fertig, **nicht committet** |
| Prüfmeister | **Engineerings drei umgestellte Sperrklinken gegengelesen — alle drei bleiben**, inkl. der gedrehten PM-066-B | ✅ zu |
| Prüfmeister | **Beide offenen Fragen aus PM-066-A/B beantwortet** — Kork ja / Parkett nein; verkleiden ≠ belegen | ✅ beantwortet |
| Prüfmeister | **PD-018** an den Designer, drei Fragen | verteilt |
| Chief of Staff | **Datenverlust in `design-check.md` und `entscheidungen-fuer-sandy.md` gefunden und repariert** (–649 / –458 Zeilen gegen `bd64900`) | erledigt |
| Prüfmeister | **PM-098 gefunden** — „Ein Fenster, eine Tür" plus „lackieren" erfindet **280,00 €** in fast jedem Maler-Diktat mit Lackierarbeiten. Fallbasis **98/100** | verteilt |
| Designer/Marketing | **`docs/landingpage-fuenf-beispiele.md` neu** — fünf durchgerechnete Beispiele für die Landingpage | neu, **nicht committet** |
| Chief of Staff | **CoS-E-069 angelegt** — PM-089…098 stand in keinem Ticket, jetzt in die drei Familien einsortiert; **PM-098 an die Spitze von Zug 3** | verteilt |
| Chief of Staff | **CoS-P-025 angelegt** — Schrumpf-Prüfung statt Endmarkierungs-Prüfung | verteilt |
| Chief of Staff | **DC-109 endlich in `entscheidungen-fuer-sandy.md` eingetragen** — es stand dort nie, obwohl ich es behauptet hatte | korrigiert |
| Chief of Staff | **CI-Diagnose zurückgenommen und neu gemessen** | korrigiert |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, nicht vermutet:**

* **Produktion** über die Vercel-API: `bd64900`, `READY`, 06:18 MESZ.
* **Die CI-Läufe** über die GitHub-Actions-Seite: #190 `bd64900` 🔴,
  #189 `9c38755` 🔴, #188 `9b45952` 🔴, **#187 `de1ae80` ✅**.
* **`ci.yml` aus vier Commits einzeln geholt und verglichen:** seit `9b45952`
  unverändert, gültiges YAML, `name: CI`, neun Schritte. **Meine gestrige
  Behauptung „GitHub kann die Datei nicht lesen" ist damit widerlegt — von mir
  selbst.**
* **Den neuen CI-Schritt nachgefahren:** `docs-sichern.mjs pruefen` gegen alle
  53 committeten Doku-Dateien — *„Alle 53 Doku-Dateien in Ordnung."* Er ist
  nicht der Grund.
* **Lint-Budget:** im Repository `--max-warnings 110`, auf der Platte `120`.
* **Jede Doku-Datei gegen `bd64900` gestellt** (Größe und Zeilen) — daraus die
  beiden beschädigten Dateien und die Commit-Liste unten.
* **Jede von den Rollen genannte Quell- und Testdatei einzeln gegen das
  Repository geprüft** — daraus die Liste „Nicht im Repository".
* **Dass PM-089…PM-097 in keinem Engineering-Ticket standen** — im ganzen
  Engineering-Todo gesucht, null Treffer. Deshalb CoS-E-069.
* **Dass DC-109 in `entscheidungen-fuer-sandy.md` fehlte** — gesucht, null
  Treffer, obwohl die alte Arbeitsreihenfolge es behauptet hat.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Welcher Schritt in den drei roten Läufen genau fällt.** Die Schritt-Ebene
  gibt GitHub mir ohne Zugang nicht heraus. Das Lint-Budget ist der
  wahrscheinlichste Grund, **nicht der belegte**.
* **Die Testläufe von Engineering** (1536/59) und des Prüfmeisters (17/16).
  Beide haben gegen einen frischen Baum gemessen und es aufgeschrieben; ich
  habe es nicht nachgefahren.
* **Gate 1 rechne ich weiterhin nicht neu** — ich warte auf Manfreds Session 3.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | **Committen und pushen** — sieben neue Testdateien, `package.json` (Lint-Budget 110 → 120) und elf Doku-Dateien. Der Block steht im Chat | ein Block |
| 2 | 🟡 **DC-109 entscheiden** — „A" oder „B", jetzt wirklich mit Empfehlung in `entscheidungen-fuer-sandy.md` | eine Antwort |
| 3 | 🟡 **Einmal „Passwort vergessen" durchklicken** (CoS-P-013), dann ist der Punkt zu | zwei Minuten |
| 4 | Vercel-Benachrichtigung · Datenschutz-Freigabe · Versicherung · Stripe · Gewerbeanmeldung KW 41 (CoS-041) | unverändert, in diesem Lauf nicht neu geprüft |

**Gestrichen gegenüber der letzten Fassung:**
„`ci.yml` reparieren" (Fehldiagnose) und „`pre-push`-Hook installieren"
(**CoS-P-024**: Sandy hat den Hook ersatzlos abgeschafft).

### Nicht im Repository — einzeln gegen `bd64900` geprüft

```
src/lib/__tests__/cos-e-062-pm066a-stufentitel.test.ts   <- NEU
src/lib/__tests__/cos-e-062-pm066d-treppenflaeche.test.ts <- NEU
src/lib/__tests__/cos-e-062-pm066c-treppennase.test.ts   <- NEU
src/lib/__tests__/cos-e-062-pm067-verklebt.test.ts       <- NEU
src/lib/__tests__/cos-e-065-tuerquelle.test.ts           <- NEU
src/lib/__tests__/pruefmeister-batch-79-88.test.ts       <- NEU
src/lib/__tests__/pruefmeister-batch-89-97.test.ts       <- NEU
package.json                                             <- Lint-Budget 110 -> 120 (CoS-P-020)
docs/arbeitsreihenfolge.md                               <- in diesem Lauf ersetzt
docs/chief-of-staff-engineering-todos.md                 <- CoS-E-069 + drei Zug-1-Punkte
docs/chief-of-staff-platform-todos.md                    <- CoS-P-024, CoS-P-025
docs/design-check.md                                     <- repariert + PD-018
docs/entscheidungen-fuer-sandy.md                        <- repariert + DC-109 + CI-Korrektur
docs/pruefmeister-notizen-fuer-designer.md               <- PD-016, PD-017, PD-018
docs/landingpage-fuenf-beispiele.md                      <- NEU
docs/pruefmeister-restliste.md                           <- PM-079…098, K.4/K.5
docs/pruefmeister-themenspeicher.md
docs/testnutzer-notizen-manfred.md                       <- TN-148
docs/vokabular-abgleich.md                               <- Abschnitte V und W
```

**Unverändert, nicht suchen:** `docs/launch-readiness.md`,
`docs/chief-of-staff-legal-todos.md`, `docs/engineering-austausch.md` —
gegen den Commit geprüft, Byte für Byte gleich.

Dazu die geänderten Quelldateien der Rollen (`boden-sonder.ts`,
`maler-lackieren.ts`, die umgestellten Prüfmeister-Testdateien) — **deren
Anzahl habe ich nicht gezählt und behaupte sie nicht.** `git add -A` nimmt
alles mit.

**Nicht mehr auf der Liste** (stand gestern drauf, liegt inzwischen im
Repository — geprüft): `maler-sonder.ts`, `maler-tapete.ts`,
`pm-vorlagen-zwilling.test.ts`, `pruefmeister-batch-1509.test.ts`,
`pruefmeister-batch-64-68.test.ts`, `pruefmeister-batch-69-77.test.ts`,
`fehlertexte.ts`, `rechenweg-kundentext.ts`.

---

## Head of Product Engineering

1. ✅ **Zug 1 ist ZU.** PM-067-A, PM-066-C, PM-066-A/B und PM-066-D stehen.
   **Als Nächstes Zug 3: PM-072, PM-074, PM-079** — PM-066-D war der vierte
   Posten von Zug 3 und ist mit diesem Lauf schon erledigt.
2. ✅ **Eure zwei Fragen aus PM-066-A/B sind beantwortet** (Prüfmeister):
   **Kork ja, Parkett nein** — für Parkett Fehlt-Eintrag statt 45,00 €, bis
   der Bodenkatalog eine eigene Zeile führt. **Verkleiden ist nicht belegen** —
   der Zweig bleibt unverändert, ihr habt richtig gehandelt.
3. ✅ **Eure drei umgestellten Sperrklinken sind gegengelesen, alle drei
   bleiben** — auch die gedrehte PM-066-B. Eure zwei zusätzlichen
   Zusicherungen hat der Prüfmeister als besser als seine eigenen übernommen.
4. 🔴 **PM-098 ist ab jetzt der erste Punkt von Zug 3** (CoS-E-069 Nachtrag).
   „Ein Fenster, eine Tür" plus irgendwo „lackieren" erzeugt sieben Positionen
   für **280,00 €**, die niemand bestellt hat — 915,90 € statt 635,90 €. Kein
   Randfall: Fenster und Türen zu nennen ist Pflicht für die Fläche. Das Soll
   steht fest (Nennung als Öffnung = Maßangabe, keine Beauftragung), die
   Mechanik gibt es bei **PM-033** und **PM-034** schon.
5. 🆕 **CoS-E-069 — Batch PM-089…PM-097**, bis eben in keinem Ticket.
   **PM-094** (Angebot aus einer einzigen erfundenen, bepreisten Zeile) in
   Zug 3. **PM-089, PM-090, PM-091, PM-093, PM-096, PM-097** in Zug 2.
   **PM-092 / PM-095** als kleiner eigener Zug — beides Geld auf dem
   Kundenpapier (84,00 € zu viel, 142,50 € zu wenig).
   **Vor dem Bauen die drei Warnungen im Ticket lesen**, besonders die zu
   PM-090 (`gewerkFuerPosition` schickt die Staubschutzwand zum Maler, die
   Katalogzeile liegt im gesperrten Abbruch → 0,00 € aufs Kundenpapier).
6. **CoS-E-068** — der Batch PM-079…PM-088, unverändert.
   **PM-085 nicht bauen, bis PD-016 Punkt 1 beantwortet ist.**
7. 🆕 **CoS-E-070 — euer Fischgrät-Fund, eingeordnet.** Teil A (zwei
   Quadratmeterzahlen für denselben Boden) ist ein Fehler und wird gebaut:
   **eine Quelle für das Muster**, nicht zwei. Teil B (5 % oder 15 % auf der
   Arbeitszeile) ist **keine neue Frage** — sie hängt an CoS-E-054, Sandys
   Verschnitt-Regel vom 14.09. Dort beantworten, nicht hier.
8. **Reihenfolge ab jetzt:** **Zug 3 (PM-098 → PM-072 → PM-074 → PM-079) →
   Zug 2 → der kleine Zahlen-Zug (PM-092, PM-095, CoS-E-070 Teil A) →
   CoS-E-061** (die Sperre).
9. **CoS-E-063** — Heizkörper. **CoS-E-060** — die Frage davor ist weiter
   offen: welche Datei speist die Oberfläche, `preis-ableitung.ts` oder
   `materialanteil.ts`?
10. **CoS-E-057 (§ 35a)** — CoS-L-008 ist geliefert, bauen möglich. Migration
   **und** Eintrag in `check_migrationen.sql`.
11. **CoS-E-053** weiterbauen, mit den vier Legal-Bedingungen. Preisanpassungs-
   Hinweis nicht aufs Kunden-PDF vor Sandys Freigabe (LR-16).
12. **CoS-E-067** — `no-explicit-any`-Aufräumrunde, eigener Lauf, ganz hinten.
13. **Die rote CI ist nach allem, was ich messen konnte, nicht euer Code.**
    Lasst euch davon nicht aufhalten.

## Product Designer

1. 🟡 **DC-109 wartet auf Sandy**, nicht auf euch — und es steht jetzt
   endlich in `entscheidungen-fuer-sandy.md`. Sagt sie „B", baut ihr den
   bereitliegenden Ersatztext ein; sagt sie „A", fliegt die Karte.
2. ✅ **DC-110 ist gebaut und committet** (`bd64900`). **CoS-E-065 Punkt 2 ist
   damit beantwortet** — Engineering wartet nicht mehr auf euch.
3. 🆕 **PD-018, drei Fragen vom Prüfmeister.** Punkt 2 (eigener Zustand „so
   kann ich nichts rechnen") liefert zugleich den Beleg, auf den **PD-016
   Punkt 2** gewartet hat. **Keiner der drei blockiert etwas.**
4. 🔴 **PD-016 Punkt 1** (runder Raum, PM-085) ist der **einzige** Punkt bei
   euch, an dem Engineering hängt — CoS-E-068 Teil C.
5. **DC-108** — der Satz unter dem Haken „Tapezieren", Manfreds Wortlaut.
   Nicht blockiert.
6. **Nachzuziehen, sobald Engineering committet hat:** die eine Stelle in
   `AngebotDetail.tsx`, bewusst ausgelassen.
7. **DC-102** freigegeben — Ablauf und Darstellung, **nicht die Zahlen**.
   Einbau hängt an CoS-E-053.
8. 🔴 **`docs/landingpage-fuenf-beispiele.md` geht nicht live, bevor PM-098
   gebaut ist.** Beispiel 4 umgeht den Fehler, indem Fenster und Tür nicht im
   Satz stehen — sonst zeigte die Seite ein Verhalten, das das Produkt nicht
   hat. Die Beispiele selbst sind durchgerechnet und in Ordnung.
9. **Live-Test von DC-105 / DC-101 / DC-103 / DC-104 / DC-089 / DC-047 /
   DC-048** — braucht Sandy am Rechner.

## Platform

1. 🆕 **CoS-P-025 — eine Prüfung, die Schrumpfen bemerkt.** Die
   Endmarkierungs-Prüfung hat beim dritten Datenverlust nichts gemeldet, und
   zwar zu Recht: Die Fehlerform ist „Datei wird still 649 Zeilen kürzer",
   nicht „Text nach der Endmarkierung". **In der CI, nicht als Hook.**
   Zweiter Teil: sag mir, ob **CoS-P-022** ohne `device_bash` überhaupt lösbar
   ist — oder ob ich den Commit-Block dauerhaft selbst an Sandy schicke.
2. 🔴 **CoS-P-024 — der Push-Hook wird ersatzlos abgeschafft.** Sandys
   Anweisung. Beide Prüfungen raus aus dem Push-Weg, CoS-P-023 zurückgezogen.
   **Noch nicht als umgesetzt eingetragen.**
3. ✅ **CoS-P-020 und CoS-P-021 sind zu.** Das Budget 120 ist gebaut —
   **es ist nur nicht committet, und es ist vermutlich genau das, was die CI
   grün macht.**
4. **CoS-P-013** — der letzte Rest ist Sandys Klick-Durchlauf, kein Code.
5. **CoS-P-005** — die fehlende RLS-Policy für den Logo-Upload.
6. **CoS-P-022** — neunter Tag ohne laufende Doku-Sicherung. Siehe Punkt 1.

## Prüfmeister

1. ✅ **Fallbasis 98/100.** **PM-098 habe ich an die Spitze von Zug 3
   gesetzt**, euren Vorrang „vor Gate 1" bestätige ich; die Sperrklinke in
   `pruefmeister-batch-47-56.test.ts` fehlt noch.
   Batch PM-089…097 liegt als
   `src/lib/__tests__/pruefmeister-batch-89-97.test.ts` (17 grün, 16
   Sperrklinken). **Er ist jetzt als CoS-E-069 bei Engineering einsortiert** —
   ihr müsst ihn nicht nachtragen.
2. ✅ **K.4 und K.5 beantwortet**, Engineerings Sperrklinken gegengelesen,
   beide Rückfragen aus PM-066-A/B beantwortet. **Nichts davon ist offen.**
3. **Die letzten drei Fälle bis 100, ohne App prüfbar:** Selbstkorrektur
   mitten im Satz · Kunde redet im Hintergrund dazwischen · Aufnahme bricht ab
   und wird fortgesetzt.
4. **Die 142 Vorlagen der gesperrten Gewerke** — jeweils vor der
   Freischaltung, nicht danach.
5. **Größter blinder Fleck, festgehalten:** **jedes** Gewerk hat Stundenzeilen
   im Katalog, die Engine hat an keiner Stelle einen Weg dorthin (Abschnitt W
   in `vokabular-abgleich.md`, und PM-093). Das ist mehr als ein Einzelfall —
   es steht in CoS-E-069 mit drin.
6. **Braucht die laufende App, unverändert offen:** PM-002 · PM-032 ·
   PM-031 Teil 2 · PM-030 · PM-014/PM-015 · G.3 · Gegenprobe aus PD-009 §7.

## Legal

1. ✅ **CoS-L-006 und CoS-L-008 sind geliefert.** Engineering kann CoS-E-057
   bauen.
2. **CoS-L-009** — darf „Aufmaß" auf dem Angebot stehen? Hängt an LR-16,
   blockiert nichts.
3. **Materialangabe auf dem Kunden-PDF bewerten** — vier Bedingungen sind an
   Engineering übergeben.
4. **DC-106 Nachlauf:** der Reminder geht an den Endkunden. **Die Mail selbst**
   ist zu prüfen, nicht mehr der Onboarding-Satz.
5. CoS-L-002 · CoS-L-004 laufend. **E-Rechnungspflicht § 14 Abs. 2 UStG**
   nachholen — vor der ersten echten Rechnung, nicht vor Gate 1.

## Manfred

1. **Session 3: Registrierung end-to-end** — steht weiterhin aus. **Das ist der
   Posten, an dem die Gate-1-Zahl hängt.**
2. ✅ **TN-148 ist da** — die Vlies-Frage aus CoS-E-056 ist beantwortet, sie
   steckt in DC-108.
3. **DC-101 nachprüfen**: am Handy laden und **sofort** lostippen.
4. **Aus PD-009 §5:** Seine 75 % gegen die 63 % des Katalogs sind kein
   Widerspruch — zu bestätigen, nicht zu entscheiden.
5. **G.3** — seine zwei Szenarien in der laufenden App, offen seit 11.09.

---

## Was ich als Nächstes tue

**Den nächsten CI-Lauf messen, sobald Sandy gepusht hat.** Wird er grün, war
es das Lint-Budget und die Sache ist erledigt. Wird er nicht grün, suche ich
weiter — und sage es ihr, statt eine zweite Vermutung als Befund zu
verkaufen.

**DC-109 nachhalten** — die einzige echte Entscheidung, die auf sie wartet.

**Jeden neuen Prüfmeister-Batch am selben Tag einsortieren.** Zweimal
hintereinander (CoS-E-068, CoS-E-069) lag ein fertiger Batch in keinem
Ticket; das war beide Male mein Versäumnis.

**Zum Ablauf dieses Laufs:** `device_bash` auf Sandys Rechner ist weiterhin tot
(`no Plan9 drive shares mounted`, Windows-Update vom 08.09.). Gelesen und
geschrieben wurde über Staging/Commit; verglichen wurde gegen
`raw.githubusercontent.com`, weil die GitHub-API in diesem Lauf keinen Zugang
hatte. An `chief-of-staff-engineering-todos.md`, `chief-of-staff-platform-todos.md`
und `design-check.md` wurde vor der Endmarkierung angehängt.
`design-check.md` und `entscheidungen-fuer-sandy.md` wurden **wiederhergestellt**
— das ist der einzige Fall in diesem Lauf, in dem ich eine Datei nicht nur
ergänzt habe, und er ist oben begründet.

---

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
