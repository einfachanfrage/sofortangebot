# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 15.09.2026, 21:55 MESZ · Chief of Staff**
*(ersetzt die Fassung von 18:55 — diese Datei wird immer ersetzt, nie ergänzt.)*

---

## Lage in drei Zeilen

**Nichts deployt, nichts gepusht.** Produktion steht unverändert auf
`dpl_Ba3B8QBk` / `de1ae80`, `READY`, letzter Deploy **16:35 MESZ** — über die
Vercel-API in diesem Lauf nachgesehen. Seither ist kein Deploy dazugekommen,
also auch kein Push. **Die CI habe ich in diesem Lauf nicht selbst geprüft** —
der GitHub-Zugriff ist für diese Sitzung nicht freigeschaltet (HTTP 403).
Letzter belegter Stand bleibt #187 auf `de1ae80` = `success` (18:45 MESZ). Da
nichts gepusht wurde, kann es dazwischen keinen neuen Lauf geben.

**Der Prüfmeister hat einen zweiten Batch nachgelegt:** PM-069 bis PM-078,
17 grüne Prüfungen, 13 Sperrklinken. **Fallbasis 78 von 100.**
**Der Designer hat DC-107 gebaut** (`rechenweg-kundentext.ts`) — die Herkunft
fällt auf dem Kundenpapier weg. Der Prüfmeister hat gegengelesen und stimmt zu.
**Engineering hat um 21:48 Eingriff 2 von CoS-E-059 abgeliefert** und stellt
dabei zwei Fragen, die den Prüfmeister brauchen — eine davon **blockiert
PM-066-A/B**, den teuersten Punkt aus CoS-E-062 (770,00 € je Fall).

**Es wartet keine Entscheidung auf Sandy. Nur das Committen.**

---

## Was seit 18:55 dazugekommen ist — und wo es jetzt liegt

| Rolle | Ergebnis | verteilt als |
|---|---|---|
| Prüfmeister | **PM-069 bis PM-077** — sechs Fälle, in denen der Katalog die Zeile hat und das Angebot nicht. Schwerster Fund: bestellter Estrich fehlt, dafür steht ein nie genannter Bodenbelag ohne Preis da (560,00 €) | **CoS-E-064** (neu) |
| Prüfmeister | **PM-077 🔴** — eine *diktierte* Arbeit trägt `automatisch_ergaenzt: true`. Wird Regel H Satz 3 gebaut, bevor die Marke stimmt, verliert eine bestellte Arbeit ihren Preis | **in CoS-E-064, mit Vorrang vor CoS-E-059** |
| Prüfmeister | **PM-076** — Rollladenkasten streichen fehlt im **Katalog**, nicht im Code | in CoS-E-064 als eigener, kleiner Zug |
| Prüfmeister | **PM-078** — zwei Rechenweg-Texte gehen durch den neuen Filter hindurch aufs Kundenpapier | **DC-108** (neu) |
| Prüfmeister | **PD-015** — Antwort auf DC-107 Frage 3, plus die Bedingung zu `(angenommen)` | in DC-108 mitverteilt |
| Designer | **DC-107 gebaut** — `rechenweg-kundentext.ts`, eingehängt in `pdf.tsx` und `AngebotVorschau.tsx`, 18 Fälle / 20 Zusicherungen | erledigt, **nicht committet** |
| Designer | Zwei Zeilen an Engineering: `tuerQuelle` braucht einen dritten Fall · „aus Aufnahme" heißt an zwei Stellen Gegenteiliges | **CoS-E-065** (neu) |
| Prüfmeister ↔ Designer | **Wortlautstreit „Aufmaß"** — beide haben ein gutes Argument, keiner kann es entscheiden | **CoS-L-009** (neu, LR-16) |
| Engineering | **CoS-E-059 Eingriff 2 gebaut** — eine gesagte Vorarbeit bleibt bei ihrem Bauteil. PM-064 ist jetzt Teil von Eingriff 3 | erledigt, **nicht committet** |
| Engineering | **Zwei Fragen an den Prüfmeister.** Setzstufe beim Bodenbelag (blockiert PM-066-A/B) · ungenannte Vorarbeiten bepreisen oder in die Fehlt-Liste | **K.4 und K.5** in `pruefmeister-themenspeicher.md` |

**Keine dieser Sachen braucht Sandy.** Alles ist an eine Rolle verteilt und
läuft ohne sie weiter.

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Nachgesehen:**

* **Produktion** über die Vercel-API: `de1ae80`, `READY`, 16:35 MESZ, nichts
  Neueres. Die drei `ERROR`-Deploys von heute Mittag liegen alle **vor** dem
  letzten `READY` und sind abgelöst.
* **Die neuen Dateien auf dem Rechner**, Verzeichnis für Verzeichnis:
  `rechenweg-kundentext.ts`, `dc107-rechenweg-kundentext.test.ts`,
  `pruefmeister-batch-69-77.test.ts` sind da.
* **Dass PM-069/077/078 in keinem Ticket standen** — in
  `chief-of-staff-engineering-todos.md` und `design-check.md` nachgezählt,
  beide null Treffer. Deshalb die vier neuen Nummern oben.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Die CI.** GitHub-Zugriff 403 in dieser Sitzung. Siehe oben.
* **Der Repository-Stand Datei für Datei.** Der Lauf um 18:55 hat gegen einen
  frischen Klon verglichen; das ging heute nicht (derselbe 403). Die Commit-Liste
  unten ist die von 18:55, **erweitert um die Dateien, die seither neu auf der
  Platte aufgetaucht sind**. `git add -A` nimmt ohnehin alles mit.
* **Ob die 13 neuen Sperrklinken laufen.** Der Prüfmeister hat sie in seiner
  Ersatzumgebung gefahren, nicht ich.

**Eine Doku-Lücke, die ich melde statt sie stillschweigend zu glätten:** Die
Fassung dieser Datei von 18:55 hatte in den Rollen-Abschnitten bereits PM-069
bis PM-078 stehen, in der Lage-Zeile und der Commit-Liste aber noch den Stand
von 18:45 (68 von 100, acht Doku-Dateien). Übersicht und Detail liefen
auseinander. Diese Fassung ist durchgehend neu geschrieben.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | **Committen.** Zwölf Doku-Dateien, vierzehn neue Testdateien, zwei neue Quelldateien und die geänderten Quelldateien | ein Befehl |
| 2 | Vercel-Benachrichtigung · Datenschutz-Freigabe · Versicherung · Stripe · Gewerbeanmeldung KW 41 (CoS-041) | unverändert übernommen, in diesem Lauf nicht neu geprüft |

**Erledigt und damit von der Liste:** die Reihenfolge-Entscheidung („JA", 17:45)
· das Gewerke-Tor („sperren vor Gate 1", 18:15) · die Einordnung von CoS-E-062
(„vor", 18:55) · `_to_delete/` auf dem Rechner.

**Nichts Neues wartet auf eine Antwort von dir.**

### Nicht im Repository

Doku (elf wie um 18:55, vier davon habe ich in diesem Lauf selbst ergänzt):
```
docs/arbeitsreihenfolge.md                     <- in diesem Lauf ersetzt
docs/chief-of-staff-engineering-todos.md       <- CoS-E-064, CoS-E-065 ergänzt
docs/chief-of-staff-legal-todos.md             <- CoS-L-009 ergänzt
docs/chief-of-staff-platform-todos.md
docs/design-check.md                           <- DC-108 ergänzt
docs/entscheidungen-fuer-sandy.md
docs/pruefmeister-einsprechen-47-56.md
docs/pruefmeister-notizen-fuer-designer.md
docs/pruefmeister-restliste.md
docs/pruefmeister-themenspeicher.md            <- K.4, K.5 ergänzt
docs/vokabular-abgleich.md
```
Neue Testdateien (vierzehn — drei mehr als um 18:55):
```
src/lib/__tests__/pruefmeister-batch-69-77.test.ts        <- neu, 21:32
src/lib/__tests__/dc107-rechenweg-kundentext.test.ts      <- neu, 21:27
src/lib/__tests__/cos-e-059-vorarbeit-am-bauteil.test.ts  <- neu, 21:44
src/lib/__tests__/cos-e-058-oeffnungen-aus-aufnahme.test.ts
src/lib/__tests__/pruefmeister-batch-64-68.test.ts
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
Neue Quelldateien: `src/lib/fehlertexte.ts` und **`src/lib/rechenweg-kundentext.ts`**
(4.182 Bytes, 21:27). Dazu die geänderten Quelldateien aus CoS-E-058, DC-014 und
DC-107 (`pdf.tsx` 21:27, `AngebotVorschau.tsx`) — **deren Anzahl habe ich nicht
gezählt und behaupte sie nicht.**

**`_to_delete/`** — beim letzten Lauf mit 261 Dateien im Repository nachgezählt,
heute nicht erneut geprüft. Der nächste `git add -A` trägt die Löschung mit ein.

---

## Head of Product Engineering

1. ✅ **CoS-E-059 Eingriff 2 ist gebaut** (`cos-e-059-vorarbeit-am-bauteil.test.ts`).
   **Eingriff 3 läuft**, entsperrt durch K.1. **Neu und mit Vorrang: PM-077
   gehört als erste Zeile mit hinein** — solange eine diktierte Arbeit
   `automatisch_ergaenzt: true` trägt, nimmt Regel H Satz 3 ihr den Preis
   (180,00 € im gemessenen Fall). **Eure Frage 2 an den Prüfmeister (ungenannte
   Vorarbeiten) steht als K.5** und hängt fachlich mit PM-077 zusammen — beide
   Antworten müssen zusammenpassen, das habe ich ihm dazugeschrieben.
2. **CoS-E-062** — freigegeben. **PM-064 habt ihr zu Eingriff 3 gezogen**, das
   beantwortet die erste meiner zwei Fragen. Eure Reihenfolge (PM-067-A →
   PM-066-C → PM-066-A → PM-066-D) übernehme ich unverändert. ⏸ **PM-066-A/B
   ist blockiert** bis der Prüfmeister K.4 beantwortet — 770,00 € je Fall, der
   teuerste Punkt. PM-066-C und PM-067-A laufen währenddessen.
   **PM-068 nicht bauen.**
3. **CoS-E-064 — neu.** PM-069 bis PM-077. Sechs Fälle, ein Muster: gesagt,
   Katalogzeile vorhanden, keine Zeile im Angebot. **Zwei Fragen an euch im
   Ticket** — ob das dieselbe Klasse ist wie PM-066/067 (dann gehören CoS-E-062
   und CoS-E-064 zusammengezogen), und ob PM-074 derselbe Mechanismus ist wie
   die Nebensatz-Menge aus CoS-E-058. **Dauert es spürbar länger, meldet es —
   Sandy will den Aufwand vorher wissen.**
4. **CoS-E-061 — die Sperre.** Entschieden, steht hinter CoS-E-062 **und
   CoS-E-064**: alle sechs neuen Fälle treffen Maler und Boden, die Sperre fängt
   keinen davon ab. Drei Punkte offen: Sekundärgewerk, was mit dem Entwurf
   passiert, Wortlaut (gehört dem Designer). PM-060-B bleibt getrennt.
5. **CoS-E-063** — Heizkörper. Hinter Eingriff 2, wie vorgeschlagen.
6. **CoS-E-065 — neu, klein.** `tuerQuelle` braucht einen dritten Fall
   (`maler-lackieren.ts` Z. 48, wie `fensterQuelle` Z. 92) — **daran hängt ein
   Designer-Punkt**. Dazu: „aus Aufnahme" bedeutet in `maler-lackieren.ts` und
   `mengen/aufnahme-hinweise.ts` Gegenteiliges; auf dem Papier seit DC-107 egal,
   in der App nicht.
7. **CoS-E-060** (PM-057/058/059). **Die Frage davor bleibt unbeantwortet:**
   welche Datei speist die Oberfläche — `preis-ableitung.ts` oder
   `materialanteil.ts`? Der Prüfmeister beantwortet die Fachfrage erst danach.
8. **CoS-E-053** weiterbauen, mit den vier Legal-Bedingungen. Der
   Preisanpassungs-Hinweis darf **nicht** aufs Kunden-PDF, bevor Sandy einen
   Wortlaut freigegeben hat — LR-16.
9. **CoS-E-056** bleibt bei Manfreds Vlies-Antwort. `taetigkeiten.ts` bis dahin
   unangetastet.
10. **CoS-E-057 (§ 35a)** — vor Gate 1, hinter allem oben. **CoS-L-008 ist
    geliefert**, ihr könnt bauen. Schema-Wechsel an `companies`: Migration
    **und** Eintrag in `check_migrationen.sql`.
11. **Eine Zeile Antwort an den Designer** zu `api/cron/reminder` — DC-106 hängt
    seit drei Läufen nur daran.

## Product Designer

1. **DC-108 — neu.** PM-078: zwei `berechnungsweg`-Texte gehen durch euren
   Filter hindurch aufs Kundenpapier („Erkannt, aber Menge nicht sicher
   berechenbar — bitte manuell ergänzen" · „Umfang ≈ 4 × √20 m² = 18 lfdm").
   Dazu die Bedingung aus PD-015 zu `(angenommen)`. **Ob am Ausgang gefiltert
   oder in den Engines repariert wird, entscheidet ihr.**
2. ✅ **DC-107 Punkt 1 und 2 gebaut.** Der Prüfmeister hat gegengelesen und sagt
   ausdrücklich, eure Begründung sei besser als seine. Punkt 3 hängt an
   CoS-E-065.
3. ✅ DC-014 Punkt 2 und DC-020 erledigt. Punkt 1 bleibt bei Platform (CoS-P-005).
4. **Nachzuziehen, sobald Engineering committet hat:** die eine Stelle in
   `AngebotDetail.tsx`, bewusst ausgelassen.
5. **DC-102 ist freigegeben** — Ablauf und Darstellung, **nicht die Zahlen**.
   PD-009 lesen, bevor die Tabelle übernommen wird. Einbau hängt an CoS-E-053.
6. **Live-Test von DC-105 / DC-101 / DC-103 / DC-104 / DC-089 / DC-047 / DC-048**
   — braucht Sandy am Rechner. Der eine Posten, den sie in zwei Minuten selbst
   abhaken kann.

## Platform

1. **CoS-P-023 — der Hook ist freigegeben, bauen.** Zweiter, isolierter Checkout
   gegen den tatsächlich gepushten Commit.
2. **Im selben Lauf:** `pruefe-migrationsliste.mjs` in den Hook, und der
   zurückgestellte Designer-Vorschlag ist entsperrt.
3. **CoS-P-020** — Fehlertext in `api/integrations/test`. `src/lib/fehlertexte.ts`
   mit `nutzerFehler()` liegt bereit — vermutlich eine Zeile.
4. **CoS-P-021** — zwei Fragen zum Rechnungsnummernkreis. Einschätzung, keine
   Umsetzung, kein Löschen von Produktionsdaten.
5. **CoS-P-022** — `docs-sichern.mjs pruefen` in die CI? **Wird dringender:** die
   Shell-Einhängung ist seit dem 08.09. defekt, die Sicherung läuft seit einer
   Woche nicht. In diesem Lauf erneut bestätigt.
6. **CoS-P-005** — die fehlende RLS-Policy für den Logo-Upload. Der Designer hat
   den *Text* erledigt, die *Ursache* liegt weiter bei euch.

## Prüfmeister

1. 🔴 **Zwei Fragen von Engineering, neu — K.4 und K.5 in
   `pruefmeister-themenspeicher.md`. K.4 ist die dringende:** Ist die Setzstufe
   beim Bodenbelag eine eigene bepreiste Zeile oder steckt sie im Stufenpreis?
   Beide Engine-Titel treffen dieselbe Katalogzeile — mit Preis auf beiden
   stünden 14 Stufen zweimal im Angebot (1.540,00 € statt deiner 770,00 €).
   **Engineering baut PM-066-A/B nicht, bis du antwortest.** K.5 (ungenannte
   Vorarbeiten bepreisen oder in die Fehlt-Liste) gehört mit PM-077 zusammen.
2. ✅ **Batch PM-069 bis PM-078 abgeliefert.** Verteilt: PM-069…PM-077 als
   **CoS-E-064**, PM-078 als **DC-108**, PM-076 als Katalogzug innerhalb von
   CoS-E-064, PM-077 mit Vorrang in CoS-E-059. **Von dir ist dazu nichts offen.**
3. ✅ **PD-015 geschrieben**, DC-107 gegengelesen. Deine Wortlautfrage zu
   „Aufmaß" liegt jetzt bei Legal — **CoS-L-009**, nicht mehr bei dir.
4. **Nächste Themen aus dem Speicher**, alle ohne App prüfbar: Erker und
   Wandnische außerhalb des Bades · Bodenluke / Revisionsklappe · elektrische
   Heizmatte · feuchter Untergrund · runder Raum · Podest · Kleinauftrag mit
   Anfahrt und Mindestmenge · Kunde stellt Material selbst. **„Mehrere Aufnahmen
   zu einem Angebot" bleibt draußen.**
5. **Die 142 Vorlagen der gesperrten Gewerke** — jeweils vor der Freischaltung.
   Mit PM-068 ist klar, worauf zu achten ist: auf das Paar aus Engine-Titel und
   Katalogzeile, nicht auf die Vorlage allein.
6. **`Untergrund spachteln / ausgleichen (bis 5mm)`** bleibt `anker`, bis die
   Materialzahl da ist. Ausdrücklich keine stille Entscheidung.
7. ⏸ **Gegenprobe aus PD-009 §7** — wartet auf den gebauten Preise-Schritt.
8. **Braucht die laufende App, unverändert offen:** PM-002 (seit 14.09.) ·
   PM-032 · PM-031 Teil 2 · PM-030 · PM-014/PM-015 · G.3.

**Für den nächsten Lauf, Ersatzumgebung:** `npm install vitest` bricht im
Container mit `Cannot read properties of null (reading 'edgesOut')` ab —
`--legacy-peer-deps` löst es. Kein Befund am Projekt.

## Legal

1. **CoS-L-009 — neu, nicht dringend.** Darf „Aufmaß" auf dem Angebot stehen?
   Prüfmeister und Designer haben je ein gutes Argument, beide im Ticket. Hängt
   an der ohnehin laufenden LR-16-Runde. **Blockiert nichts**, der Bau steht.
2. ✅ **CoS-L-008 geliefert** — Engineering kann CoS-E-057 bauen. Offen ist dort
   nur noch die Freigabe von Sandy für den Wortlaut zweier Oberflächentexte, und
   die blockiert das Bauen nicht.
3. **§ 14 UStG — Pflichtangabenliste nachholen**, sobald die Normtexte abrufbar
   sind (CoS-L-006).
4. **Materialangabe auf dem Kunden-PDF bewerten** — die vier Bedingungen sind an
   Engineering übergeben.
5. CoS-L-002 · CoS-L-004 laufend.

## Manfred

1. **Session 3: Registrierung end-to-end** — steht weiterhin aus. **Das ist der
   Posten, an dem die Gate-1-Zahl hängt.**
2. **DC-101 nachprüfen**: am Handy laden und **sofort** lostippen.
3. **Rückfrage aus CoS-E-056:** Gilt „Tapete extra" bei ihm auch für Vlies?
4. **Aus PD-009 §5:** Seine 75 % gegen die 63 % des Katalogs sind kein
   Widerspruch — zu bestätigen, nicht zu entscheiden.
5. **G.3** — seine zwei Szenarien in der laufenden App, offen seit 11.09.

---

## Was ich als Nächstes tue

**Die Kette K.4 → PM-066-A/B im Auge behalten.** Das ist der einzige harte
Block gerade: Engineering wartet auf den Prüfmeister, und dahinter liegt der
teuerste Einzelposten aus CoS-E-062. Beide Rollen laufen an anderen Punkten
weiter, es steht also nichts still — es kostet nur Reihenfolge.

**Engineerings Einschätzung zu CoS-E-064 einsammeln:** ob
PM-070/071/072/075 dieselbe Klasse sind wie PM-066/PM-067. Wenn ja, ziehe ich
die Tickets zusammen und trage Sandy den Aufwand vor, bevor gebaut wird. Sonst
läuft alles ohne sie.

**Gate 1 rechne ich weiterhin nicht neu** — ich warte auf Manfreds Session 3,
sonst steht die Zahl wieder auf „ist deployt" statt auf „funktioniert".

**Zum Ablauf dieses Laufs:** `node scripts/docs-sichern.mjs` ist erneut nicht
gelaufen — die Shell-Einhängung auf Sandys Rechner ist seit dem Windows-Update
vom 08.09. defekt, in diesem Lauf wieder bestätigt (`no Plan9 drive shares
mounted`). Gelesen und geschrieben wurde über Staging/Commit mit
`expectedMtimeMs`. **Neu und schlechter als beim letzten Lauf:** der
GitHub-Zugriff ist in dieser Sitzung nicht freigeschaltet (403), deshalb weder
CI-Prüfung noch Klon-Vergleich. Produktion ging über die Vercel-API, die neuen
Dateien über das Verzeichnis auf Sandys Rechner.

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
