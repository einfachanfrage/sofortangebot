# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 15.09.2026, 18:55 MESZ · Chief of Staff**
*(ersetzt die Fassung von 18:45 — diese Datei wird immer ersetzt, nie ergänzt.)*

---

## Lage in drei Zeilen

**Grün und unverändert.** CI **#187** auf `de1ae80`: `success` — ebenso #185
und #186, an der Lauf-Liste nachgesehen. Produktion `dpl_Ba3B8QBk`: `READY`,
derselbe Commit, letzter Deploy 16:35 MESZ. **Seit über zwei Stunden ist nichts
deployt worden.**
**Engineering hat Eingriff 1 gebaut** (CoS-E-058 / PM-045-A) — Türen und
Fenster aus der Aufnahme kommen an, 15 Zusicherungen grün.
**Der Prüfmeister hat einen Batch nachgelegt:** PM-064 bis PM-068, Fallbasis
**68 von 100**. Verteilt als **CoS-E-062**.
**Sandy hat entschieden (18:55): „vor"** — CoS-E-062 steht vor der
Gewerke-Sperre. **Es wartet damit keine Entscheidung mehr auf sie, nur noch das
Committen.**

---

## Was seit dem letzten Lauf dazugekommen ist

| Rolle | Ergebnis | liegt jetzt |
|---|---|---|
| Engineering | **CoS-E-058 Eingriff 1 gebaut.** `oeffnungenAusAufnahme()` neu; 15 Zusicherungen grün, 583 von 585 in der Regression grün (die zwei roten sind die Ersatzumgebung, kein Befund) | erledigt, **nicht committet** |
| Engineering | Reihenfolge bewusst **anders gebaut als angekündigt**: gesprochene Zahl → Aufnahme → Zimmer-Annahme → 1. Begründung: die Aufnahme ist der Bestand, der Satz ist der Auftrag | zur Kenntnis, überzeugt mich |
| Engineering | **Heizkörper herausgenommen** — eigener Eingriff, war ohne Nummer | verteilt als **CoS-E-063** |
| Engineering | Frage an den Designer zum Wortlaut zweier Rechenweg-Zeilen | verteilt als **DC-107** |
| Prüfmeister | **PM-064 bis PM-068**, 4 grün / 15 Sperrklinken. Schwerster Fund: eine Treppe mit Belag kommt mit rund 50 € heraus statt gut 1.100 € | Engineering, **CoS-E-062** |

---

## 🔎 Was ich an dem neuen Batch selbst nachgesehen habe

Der Prüfmeister meldet die fünf Fälle der Reihe nach. **Ich habe sie nach dem
betroffenen Gewerk sortiert, und das ändert die Reihenfolge:**

| Fall | Gewerk | freigeschaltet? | Betrag im gemessenen Fall |
|---|---|---|---|
| PM-064 | Maler | **ja** | 162,00 € zuviel |
| PM-065 | Maler | **ja** | 396,00 € fehlen |
| PM-066 | Boden | **ja** | rund 1.050,00 € fehlen |
| PM-067 | Boden | **ja** | 42,00 € zu wenig + fehlende Position |
| PM-068 | Trockenbau | **nein** | 980,00 € — hinter der Freischaltung |

**Vier von fünf treffen die zwei Gewerke, die heute verkauft werden.** Die
Gewerke-Sperre aus CoS-E-061, die Sandy um 18:15 entschieden hat, fängt davon
**keinen einzigen** ab — sie betrifft nur PM-068. Daraus folgte die Frage an
Sandy, ob CoS-E-062 vor oder hinter die Sperre gehört. **Sie hat um 18:55 mit
„vor" geantwortet** — die Reihenfolge unten ist entsprechend gesetzt.

**Was ich ausdrücklich nicht behaupte:** dass diese Beträge heute schon auf
verschickten Angeboten stehen. Gemessen ist der Betrag je Fall, nicht seine
Häufigkeit.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | **Committen.** Elf Doku-Dateien, elf neue Testdateien, `src/lib/fehlertexte.ts` und die geänderten Quelldateien | ein Befehl |
| 2 | Vercel-Benachrichtigung · Datenschutz-Freigabe · Versicherung · Stripe · Gewerbeanmeldung KW 41 (CoS-041) | unverändert übernommen, in diesem Lauf nicht neu geprüft |

**Erledigt und damit von der Liste:** die Reihenfolge-Entscheidung („JA",
17:45) · das Gewerke-Tor („sperren vor Gate 1", 18:15) · **die Einordnung von
CoS-E-062 („vor", 18:55)** · `_to_delete/` auf dem Rechner.

### Nicht im Repository — diesmal Datei für Datei gegen einen frischen Klon von `de1ae80` verglichen

**Die Liste von 18:15 war unvollständig.** Es sind elf Doku-Dateien, nicht
acht, und elf neue Testdateien, nicht neun.

Doku (elf):
```
docs/arbeitsreihenfolge.md
docs/chief-of-staff-engineering-todos.md
docs/chief-of-staff-legal-todos.md         <- fehlte
docs/chief-of-staff-platform-todos.md
docs/design-check.md
docs/entscheidungen-fuer-sandy.md
docs/pruefmeister-einsprechen-47-56.md     <- fehlte, ganz neue Datei
docs/pruefmeister-notizen-fuer-designer.md
docs/pruefmeister-restliste.md
docs/pruefmeister-themenspeicher.md
docs/vokabular-abgleich.md
```
Neue Testdateien (elf):
```
src/lib/__tests__/cos-e-058-oeffnungen-aus-aufnahme.test.ts    <- neu
src/lib/__tests__/pruefmeister-batch-64-68.test.ts             <- neu
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
Neue Quelldatei: `src/lib/fehlertexte.ts` (7.215 Bytes auf dem Rechner, im
Repository nicht vorhanden). Dazu die geänderten Quelldateien aus CoS-E-058
und DC-014 — **deren Anzahl habe ich nicht gezählt und behaupte sie nicht.**
`git add -A` nimmt alles mit.

**`_to_delete/` liegt noch im Repository** — 261 Dateien, 4,4 MB, im Klon
nachgezählt. Der nächste `git add -A` trägt die Löschung mit ein.

---

## Head of Product Engineering

1. ✅ **CoS-E-058 Eingriff 1 ist gebaut.** Bleibt uncommittet, bis Sandy pusht
2. **CoS-E-059 / Eingriff 2 und 3 bauen** — freigegeben (Sandys „JA" von
   17:45). **Eingriff 3 ist entsperrt:** der Prüfmeister hat K.1 beantwortet
   (Fläche folgt der Ursache: Wasserfleck → Decke · Nikotin/Ruß → Wand und
   Decke · genannte Fläche schlägt alles · nichts davon → keine bepreiste
   Zeile, Rückfrage; Tiefengrund fällt nur auf der gesperrten Fläche weg).
   **Zwei Zeilen weniger als gemeldet:** PM-045-A und PM-052-A hat der
   Prüfmeister als eigene Messfehler zurückgenommen
3. **CoS-E-062 — freigegeben, bauen. Sandys „vor" von 18:55.** PM-064 bis
   PM-067, die vier Funde auf Maler und Boden. Steht **vor** der Sperre.
   **Zwei Fragen in eure Einschätzung mitnehmen:** gehört PM-064 (Wortstamm
   `sperr`) zu CoS-E-059, weil es dieselbe Datei ist? Und sind PM-066/PM-067
   einzeln zu flicken oder als Klasse (Titel gegen Katalog, wie PM-060-A)?
   Wird es eine Klasse und dauert spürbar länger, meldet es — das will Sandy
   vorher wissen. **Die Reihenfolge innerhalb des Tickets entscheidet ihr.**
   **PM-068 nicht bauen** — gesperrtes Gewerk
4. **CoS-E-061 — die Sperre.** Entschieden („sperren vor Gate 1"), steht jetzt
   **hinter** CoS-E-062. Wo sie sitzt, entscheidet ihr. Drei Punkte
   ausdrücklich offen: Sekundärgewerk, was mit dem Entwurf passiert, Wortlaut
   (gehört dem Designer). **PM-060-B bleibt davon getrennt** — Einschätzung
   steht aus
5. **CoS-E-063 — neu, Heizkörper.** Hinter Eingriff 2, wie ihr vorgeschlagen
   habt. Nur eine Nummer, kein neuer Auftrag
6. **CoS-E-060** (PM-057/058/059). **Die Frage davor:** welche Datei speist die
   Oberfläche — `preis-ableitung.ts` oder `materialanteil.ts`?
7. **CoS-E-053 weiterbauen**, mit den vier Legal-Bedingungen. Der
   Preisanpassungs-Hinweis darf **nicht** aufs Kunden-PDF, bevor Sandy einen
   Wortlaut freigegeben hat — LR-16
8. **CoS-E-056** bleibt bei Manfreds Vlies-Antwort. `taetigkeiten.ts` bis dahin
   unangetastet
9. **CoS-E-057 (§ 35a)** — vor Gate 1, hinter allem oben. Wartet ohnehin auf
   Legals Feldliste (CoS-L-008). Schema-Wechsel an `companies`: Migration
   **und** Eintrag in `check_migrationen.sql`
10. **Eine Zeile Antwort an den Designer** zu `api/cron/reminder` — DC-106
    hängt seit zwei Läufen nur daran

## Product Designer

1. **DC-107 — neu.** Wortlaut der zwei Rechenweg-Zeilen aus CoS-E-058:
   „aus Aufnahme" oder „aus Aufmaß"? Ist „angenommen" der richtige Satz? Und
   muss eine angenommene Menge auf dem Kundenpapier stärker auffallen? **Nicht
   blockiert**, braucht keine App
2. ✅ **DC-014 Punkt 2 und DC-020 erledigt.** Punkt 1 von DC-014
   (RLS-Migration) bleibt bei Platform, CoS-P-005
3. **Nachzuziehen, sobald Engineering committet hat:** die eine Stelle in
   `AngebotDetail.tsx`, bewusst ausgelassen. Kein neuer Auftrag nötig
4. **DC-102 ist freigegeben** — Ablauf und Darstellung, **nicht die Zahlen**.
   PD-009 lesen, bevor die Tabelle übernommen wird. Einbau hängt an CoS-E-053
5. **Live-Test von DC-105 / DC-101 / DC-103 / DC-104 / DC-089 / DC-047 /
   DC-048** — der Browser eures Laufs kommt ohne Sandys Freigabe nicht an
   `sofortangebot.app`. **Nicht blockiert im Sinne dieser Datei**, aber ohne
   Sandy am Rechner auch nicht zu machen. Das ist der eine Posten, den sie in
   zwei Minuten selbst abhaken kann

## Platform

1. **CoS-P-023 — der Hook ist freigegeben, bauen.** Zweiter, isolierter
   Checkout gegen den tatsächlich gepushten Commit
2. **Mit im selben Lauf:** `pruefe-migrationsliste.mjs` in den Hook, und der
   zurückgestellte Designer-Vorschlag ist entsperrt
3. **CoS-P-020** — Fehlertext in `api/integrations/test`. Der Designer hat mit
   `src/lib/fehlertexte.ts` eine `nutzerFehler()`-Funktion gebaut — vermutlich
   eine Zeile
4. **CoS-P-021** — zwei Fragen zum Rechnungsnummernkreis. Einschätzung, keine
   Umsetzung, kein Löschen von Produktionsdaten
5. **CoS-P-022** — `docs-sichern.mjs pruefen` in die CI? **Wird dringender:**
   die Shell-Einhängung ist seit dem 08.09. defekt, die Sicherung läuft seit
   einer Woche nicht. Heute erneut bestätigt
6. **CoS-P-005** — die fehlende RLS-Policy für den Logo-Upload. Der Designer
   hat den *Text* erledigt, die *Ursache* liegt weiter bei euch

## Prüfmeister

1. ✅ **Batch PM-069 bis PM-078 abgeliefert** — zehn Themen aus dem Speicher,
   **17 grüne Prüfungen, 13 Sperrklinken**, jeder Fund mit einer Kontrolle
   daneben. Neue Datei `src/lib/__tests__/pruefmeister-batch-69-77.test.ts`.
   **Fallbasis: 78 von 100.** Die drei, die Geld bewegen:
   **PM-072** (Estrich wird zu „Bodenbelag verlegen" ohne Preis, 560,00 €) ·
   **PM-069** (Möbel ausräumen fehlt, 220,00 €; und „der Kunde räumt selbst"
   erzeugt trotzdem Folie und Zuschlag — TN-037-Klasse) ·
   **PM-075** (Wandnische im Bad, 95,00 €, Katalogzeile vorhanden).
   Ausführlich in `pruefmeister-restliste.md`
2. 🔴 **Einer davon gehört vor CoS-E-059, nicht danach: PM-077.** Eine
   diktierte Arbeit (`Tapete entfernen`, 45,00 m², 4,00 €/m²) trägt
   `automatisch_ergaenzt: true`. Wird Regel H Satz 3 gebaut, ohne diese Marke
   vorher zu reparieren, verliert eine **ausdrücklich beauftragte** Arbeit
   ihren Preis. Gehört in CoS-E-059 mit hinein
3. ✅ **DC-107 Frage 3 beantwortet** — als **PD-015** in
   `pruefmeister-notizen-fuer-designer.md`. Kurz: auf dem Kundenpapier soll
   eine angenommene Menge **gar nicht** als Annahme erscheinen, sie muss vor
   dem Versand auffallen. Dazu ein nachgesehener Nebenbefund für den Designer:
   `annahmen` kommt absichtlich nicht ins Kunden-PDF, der `berechnungsweg` mit
   „aus Aufnahme" **schon** — die sichere Zahl trägt beim Kunden ein
   Herkunftsetikett, die geratene keins. Zu den beiden anderen Fragen steht
   dort ein Fachhinweis („Aufmaß" ist am Bau ein belegtes Wort — eine Frage
   für die Legal-Runde, keine Forderung von mir).
   **Der Designer hat DC-107 noch am selben Abend gebaut**
   (`rechenweg-kundentext.ts`, in `pdf.tsx` eingehängt). Gegengelesen: seine
   Begründung ist besser als meine und stimmt. Zwei Punkte bleiben, beide in
   PD-015: „(angenommen)" darf nur beim Kunden stehen, **wenn** den
   Handwerker vorher etwas aufhält — und **PM-078**: „Erkannt, aber Menge
   nicht sicher berechenbar — bitte manuell ergänzen" geht durch den neuen
   Filter hindurch aufs Kundendokument
4. ✅ **Neue Katalog-Richtung aufgemacht** — `vokabular-abgleich.md` **U**:
   Katalogzeilen, nach denen kein Engine-Titel je fragt (fünf gemessen), plus
   eine echte Katalog-Lücke: **Rollladenkasten streichen gibt es im Katalog
   nicht** (PM-076). Das Abgleich-Skript kann diese Richtung nicht messen,
   dafür braucht es Testfälle
5. **Nächste Themen aus dem Speicher**, alle ohne App prüfbar: Erker und
   Wandnische außerhalb des Bades, Bodenluke, elektrische Heizmatte, feuchter
   Untergrund, runder Raum, Podest, Kleinauftrag mit Anfahrt, Kunde stellt
   Material selbst. **„Mehrere Aufnahmen zu einem Angebot" bleibt draußen** —
   das Zusammenführen passiert oberhalb der Pipeline, gehört in den Live-Lauf
6. ⏸ **Gegenprobe aus PD-009 §7** — wartet auf den gebauten Preise-Schritt

**Für den nächsten Lauf, Ersatzumgebung:** `npm install vitest` bricht im
Container mit `Cannot read properties of null (reading 'edgesOut')` ab —
`--legacy-peer-deps` löst es. Kein Befund am Projekt.

## Legal

1. **CoS-L-008 — vordringlich:** die abschließende Feldliste je Rechtsform,
   die Abgrenzung PDF gegen Produkt-E-Mails, und was bei unvollständigem Profil
   passiert. Engineering wartet darauf und fängt bewusst nicht an
2. **§ 14 UStG — Pflichtangabenliste nachholen**, sobald die Normtexte abrufbar
   sind (CoS-L-006)
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

**Auf Engineerings Einschätzung zu CoS-E-062 warten** — besonders auf die
Frage, ob PM-066/PM-067 eine Klasse sind. Wenn ja, trage ich Sandy den Aufwand
vor, bevor gebaut wird. Sonst ist alles verteilt und läuft ohne sie:
Engineering an Eingriff 2 und 3, Platform an CoS-P-023, der Designer an DC-107.

**Gate 1 rechne ich weiterhin nicht neu** — ich warte auf Manfreds Session 3,
sonst steht die Zahl wieder auf „ist deployt" statt auf „funktioniert".

**Zum Ablauf dieses Laufs:** `node scripts/docs-sichern.mjs` ist erneut nicht
gelaufen — die Shell-Einhängung auf Sandys Rechner ist seit dem Windows-Update
vom 08.09. defekt, heute wieder bestätigt. Gelesen und geschrieben wurde über
Staging/Commit mit `expectedMtimeMs`. **Neu in diesem Lauf:** der
Repository-Stand wurde nicht geschätzt, sondern gegen einen frischen Klon von
`de1ae80` Datei für Datei verglichen — daher die zwei zusätzlichen Doku-Dateien
und die zwei zusätzlichen Testdateien gegenüber 18:15. Die CI wurde an der
Lauf-Liste geprüft (#185/#186/#187, alle `success`), die Produktion über die
Vercel-API (`READY`, `de1ae80`).

**Eine Kleinigkeit repariert:** `entscheidungen-fuer-sandy.md` hatte keine
Endmarkierung mehr. Sie steht wieder darunter.

**Nachtrag 18:55:** Sandy hat live geantwortet („vor"). Die Entscheidung ist in
`entscheidungen-fuer-sandy.md` und in CoS-E-062 festgehalten; diese Datei ist
darauf neu geschrieben. An CI und Produktion hat sich seit 18:45 nichts
geändert — nicht erneut geprüft, weil in der Zwischenzeit nichts gepusht wurde.

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
