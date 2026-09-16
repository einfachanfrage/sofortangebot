# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 16.09.2026, 13:30 MESZ · Chief of Staff**
*(ersetzt die Fassung von 13:05 MESZ — diese Datei wird immer ersetzt, nie ergänzt.)*

---

## Lage in drei Zeilen

**Die CI ist grün.** Lauf **#192** auf `964ad73`: **Success, 2 min 16 s** — der
erste Lauf seit dem 15.09., der überhaupt Jobs gestartet hat, und der erste
grüne seit #187. Damit ist auch der **Produktions-Build gemessen**, der letzte
Schritt, über den bis eben nichts bekannt war. Produktion ist `964ad73`, `READY`.

**Sandy hat alle drei offenen Punkte beantwortet:** DC-109 = **B** ·
LR-18 = **freigegeben** · Einsprech-Liste = **schon eingesprochen**, der
Prüfmeister wertet gerade aus. Aus der heutigen Liste wartet nichts mehr auf sie.

**Der Prüfmeister arbeitet in diesem Moment** — `einsprech-liste-alle-faelle.md`
und `pruefmeister-restliste.md` sind seit 13:08 in Bewegung. Sein Ergebnis ist
das erste echte Material zur Frage, ob die App **versteht, was gesprochen wird**.

---

## Was seit 13:05 MESZ passiert ist

| Rolle | Ergebnis | Status |
|---|---|---|
| Sandy | **`964ad73` gepusht** — CI-Fix plus sieben Dateien. `ci.yml` im Commit ist Byte für Byte der geprüfte Stand | ✅ erledigt |
| — | **CI-Lauf #192: grün, 2 min 16 s.** Vier rote Läufe (#188–#191) sind damit abgeschlossen erledigt | ✅ erledigt |
| — | **Produktions-Build gemessen** — er lief in #192 durch. Der einzige Schritt, den ich selbst nicht messen konnte, ist damit belegt | ✅ erledigt |
| Vercel | **Produktion `964ad73`, `READY`** | ✅ erledigt |
| Sandy | **DC-109 entschieden: B** — Karte bleibt, Text wird wahr. In `design-check.md` festgehalten | verteilt |
| Sandy | **LR-18 freigegeben**, einschließlich der zwei älteren Datenschutz-Korrekturen. In `chief-of-staff-legal-todos.md` | verteilt |
| Sandy | **Einsprech-Liste eingesprochen** — vor Italien, wie empfohlen. Keine Termin-Entscheidung mehr | ✅ erledigt |
| Prüfmeister | **Wertet die Aufnahmen gerade aus** — zwei Dateien seit 13:08 in Bewegung | läuft |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, nicht vermutet:**

* **CI-Lauf #192** über die Actions-Übersicht, zweimal unabhängig abgefragt:
  **Success, 2 min 16 s**, Commit `964ad73`.
* **`ci.yml` im gepushten Commit** gegen meinen geprüften Stand gestellt:
  **identisch**, keine Abweichung.
* **Produktion** über die Vercel-API: `964ad73`, `READY`, 13:07 MESZ.
* **Alle Dateien in `docs/` nach Änderungszeit** gegen den Push-Zeitpunkt.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Was der Prüfmeister aus Sandys Aufnahmen herausliest.** Er schreibt noch.
  Ich sage nichts über sein Ergebnis, bevor es dasteht.
* **Gate 1 rechne ich weiterhin nicht neu.** Zwei Posten sind jetzt in
  Bewegung — Manfreds Session 3 und Sandys Einsprech-Durchlauf. Die Zahl wird
  neu gerechnet, wenn beides ausgewertet ist, nicht vorher und nicht in Teilen.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | **Block im Chat ausführen** — committet vier Doku-Dateien plus die zwei des Prüfmeisters | ein Block |
| 2 | 🟡 **Einmal „Passwort vergessen" durchklicken** (CoS-P-013), dann ist der Punkt zu | zwei Minuten |
| 3 | Vercel-Benachrichtigung · Versicherung · Stripe · Gewerbeanmeldung KW 41 (CoS-041) | unverändert, in diesem Lauf nicht neu geprüft |

**Keine Entscheidung wartet mehr auf sie.** DC-109, LR-18 und die
Einsprech-Liste sind beantwortet.

### Nicht im Repository

```
docs/arbeitsreihenfolge.md                 <- in diesem Lauf ersetzt
docs/design-check.md                       <- DC-109 entschieden (B)
docs/chief-of-staff-legal-todos.md         <- LR-18 freigegeben
docs/entscheidungen-fuer-sandy.md          <- alle drei Antworten eingetragen
docs/einsprech-liste-alle-faelle.md        <- Prüfmeister, schreibt noch
docs/pruefmeister-restliste.md             <- Prüfmeister, schreibt noch
```

Die zwei Prüfmeister-Dateien dürfen mit — er schreibt weiter, der nächste
Commit nimmt den Rest mit. **Alles andere ist mit `964ad73` committet.**

---

## Head of Product Engineering

1. ✅ **Die CI ist grün** — #192 auf `964ad73`, alle neun Schritte inklusive
   Produktions-Build. In den vier ungemessenen Läufen ist bei euch **nichts**
   liegen geblieben. Die Warnung von heute früh ist vollständig erledigt.
2. 🔴 **Zug 3 in dieser Reihenfolge: PM-098 → PM-072 → PM-074 → PM-079.**
   PM-098 (280,00 € erfundene Lackierarbeiten aus „Ein Fenster, eine Tür")
   steht an der Spitze, Vorrang vor Gate 1 bestätigt. Mechanik bei **PM-033**
   und **PM-034** abschauen.
3. **CoS-E-069** — Batch PM-089…097. **PM-094** in Zug 3; **PM-089, 090, 091,
   093, 096, 097** in Zug 2; **PM-092 / PM-095** in den kleinen Zahlen-Zug.
   **Vor dem Bauen die drei Warnungen im Ticket lesen**, besonders PM-090.
4. **CoS-E-068** — Batch PM-079…088. **PM-085 nicht bauen, bis PD-016 Punkt 1
   beantwortet ist.**
5. **CoS-E-070 Teil A** — eine Quelle für das Fischgrät-Muster. Teil B
   (5 % oder 15 %) hängt an **CoS-E-054**, nicht hier.
6. **Reihenfolge insgesamt:** Zug 3 → Zug 2 → Zahlen-Zug (PM-092, PM-095,
   CoS-E-070 Teil A) → **CoS-E-061**.
7. **LR-19 / L-MAIL-01** — kein `reply_to` in den Mails an den Endkunden.
   Bauauftrag von Legal, hängt an **CoS-E-057**. Keine Frage an euch.
8. **CoS-E-057 (§ 35a)** — CoS-L-008 ist geliefert, bauen möglich. Migration
   **und** Eintrag in `check_migrationen.sql`.
9. ✅ **CoS-L-006 ist vollständig zu.** E-Rechnungspflicht erst **ab 01.01.2028**
   und nur gegenüber Geschäftskunden — die Abschaltung aus DC-100 ist gedeckt.
10. **CoS-E-053** weiterbauen, mit den vier Legal-Bedingungen. Preisanpassungs-
    Hinweis nicht aufs Kunden-PDF vor Sandys Freigabe (LR-16).
11. **CoS-E-063** — Heizkörper. **CoS-E-060** — offen: welche Datei speist die
    Oberfläche, `preis-ableitung.ts` oder `materialanteil.ts`?
12. **CoS-E-067** — `no-explicit-any`-Aufräumrunde, eigener Lauf, ganz hinten.
    Größenordnung, frisch gezählt: von 110 Lint-Warnungen ist der größte Block
    `no-explicit-any` in `supabase/functions/`.
13. ⏳ **Auf den Prüfmeister warten, bevor ihr umplant.** Seine Auswertung von
    Sandys Aufnahmen kann die Reihenfolge oben ändern. Jetzt nichts vorziehen.

## Product Designer

1. 🟢 **DC-109 ist entschieden: B.** Karte bleibt, euer bereitstehender Text
   wird eingebaut — Wortlaut steht fest in `design-check.md`, keine Rückfrage
   mehr nötig. **Zwei Auflagen:** nur die Zeilen 557, 561, 562 in
   `src/app/(app)/einstellungen/page.tsx` anfassen, und **vor dem Schreiben
   gegen den aktuellen Stand der Datei prüfen** — in derselben Karte sitzt
   laufende Arbeit von Platform (CoS-P-009).
2. ✅ **DC-108 ist committet** (mit `964ad73`).
3. 🔴 **PD-016 Punkt 1** (runder Raum, PM-085) ist der **einzige** Punkt bei
   euch, an dem Engineering hängt — CoS-E-068 Teil C.
4. **PD-018, drei Fragen vom Prüfmeister.** Punkt 2 liefert zugleich den Beleg
   für **PD-016 Punkt 2**. **Keiner der drei blockiert etwas.**
5. **Nachzuziehen, jetzt möglich:** die eine Stelle in `AngebotDetail.tsx`,
   bewusst ausgelassen.
6. **DC-102** freigegeben — Ablauf und Darstellung, **nicht die Zahlen**.
   Einbau hängt an CoS-E-053.
7. 🔴 **`docs/landingpage-fuenf-beispiele.md` geht nicht live, bevor PM-098
   gebaut ist.**
8. **Live-Test von DC-105 / DC-101 / DC-103 / DC-104 / DC-089 / DC-047 /
   DC-048** — braucht Sandy am Rechner.

## Platform

1. ✅ **CoS-P-026 ist zu.** `ci.yml` ist repariert, gepusht, und **#192 ist
   grün** — neun Schritte, alle gelaufen. Gegenlesen dürft ihr weiter; wenn
   euch am Doku-Schritt etwas fehlt, ändert ihn, aber lasst die Struktur.
2. 🔴 **CoS-P-025 — die Schrumpf-Prüfung, und sie deckt jetzt auch
   `.github/workflows/` ab.** `ci.yml` ist auf demselben Weg beschädigt worden
   wie die drei Doku-Dateien (BOM, doppelt kodierte Umlaute, ganze Datei
   zurückgeschrieben statt angehängt) — nur hat es hier vier Tage niemand
   gemerkt. Zweiter Teil unverändert: ist **CoS-P-022** ohne `device_bash`
   überhaupt lösbar?
3. 🔴 **CoS-P-024 — der Push-Hook wird ersatzlos abgeschafft.** Sandys
   Anweisung. **Noch nicht als umgesetzt eingetragen.**
4. ✅ **CoS-P-020 und CoS-P-021 sind zu.** Das Budget 120 hat gehalten — mit
   110 Warnungen hätte allerdings auch das alte gereicht.
5. **CoS-P-013** — der letzte Rest ist Sandys Klick-Durchlauf, kein Code.
6. **CoS-P-005** — die fehlende RLS-Policy für den Logo-Upload.
7. 🆕 **DC-109 ist entschieden (B)** — der Designer ändert drei Sätze in der
   „Abrechnung"-Karte, in der euer CoS-P-009-Kommentar sitzt. Er ist angewiesen,
   vorher gegen den aktuellen Stand zu prüfen. Wenn ihr dort gerade schreibt,
   sagt kurz Bescheid.

## Prüfmeister

1. 🟢 **Sandy hat die 18 Aufnahmen eingesprochen** — vor Italien, wie
   empfohlen. Ihr wertet gerade aus. **Das ist ab jetzt der wichtigste Posten
   im ganzen Projekt:** es ist die erste Messung, ob die App versteht, was
   gesprochen wird — die 139 automatischen Tests prüfen nur, ob sie richtig
   rechnet.
2. **Wenn ihr durch seid:** die Funde nach Rollen sortiert an mich, ich
   verteile. Keine Sammel-Datei anlegen, die Befunde gehören in die
   bestehenden Kanäle.
3. **Die Frage von heute Mittag steht weiter offen:**
   `docs/pruefmeister-einsprechen-47-56.md` vom 15.09. liegt unverändert neben
   der neuen Liste. Ist sie abgelöst? Wenn ja, durch einen Verweis ersetzen —
   zwei Einsprech-Listen nebeneinander sind der Parallelstand, den Sandys
   Datei-Regel ausschließt.
4. **Fallbasis 98/100.** Die Sperrklinke für PM-098 in
   `pruefmeister-batch-47-56.test.ts` fehlt noch.
5. **Die letzten zwei Fälle bis 100, ohne App prüfbar:** Selbstkorrektur mitten
   im Satz · Kunde redet im Hintergrund dazwischen · Aufnahme bricht ab und
   wird fortgesetzt.
6. **Die 142 Vorlagen der gesperrten Gewerke** — jeweils vor der Freischaltung.
7. **Größter blinder Fleck, festgehalten:** **jedes** Gewerk hat Stundenzeilen
   im Katalog, die Engine hat an keiner Stelle einen Weg dorthin (Abschnitt W
   in `vokabular-abgleich.md`, PM-093). Steht in CoS-E-069 mit drin.
8. **Braucht die laufende App, unverändert offen:** PM-002 · PM-032 ·
   PM-031 Teil 2 · PM-030 · PM-014/PM-015 · G.3 · Gegenprobe aus PD-009 §7.

## Legal

1. 🟢 **LR-18 ist freigegeben** — Sandy, wörtlich: „freigegeben". Baut den
   Textfix ein (`src/app/datenschutz/page.tsx`, Z. 94–95) und setzt **LR-18 in
   `legal-002-risikobewertung-vob.md` selbst auf erledigt** — das ist eure
   Heimat-Datei, ich fasse sie nicht an. **Die zwei älteren
   Datenschutz-Korrekturen sind mit freigegeben.**
2. ✅ **CoS-L-006 vollständig abgeschlossen**, einschließlich § 14 Abs. 2 UStG.
3. ✅ **DC-106 ist auf eurer Seite zu.** Übrig: L-MAIL-01 als Bauauftrag (bei
   Engineering, CoS-E-057) und L-MAIL-02 als Textfix.
4. **CoS-L-009** — darf „Aufmaß" auf dem Angebot stehen? Hängt an LR-16,
   blockiert nichts.
5. **Materialangabe auf dem Kunden-PDF bewerten** — vier Bedingungen sind an
   Engineering übergeben.
6. CoS-L-002 · CoS-L-004 laufend.

## Manfred

1. **Session 3: Registrierung end-to-end** — steht weiterhin aus. Zusammen mit
   Sandys Einsprech-Durchlauf ist das der zweite Posten, an dem die
   Gate-1-Zahl hängt.
2. **DC-101 nachprüfen**: am Handy laden und **sofort** lostippen.
3. **Aus PD-009 §5:** Seine 75 % gegen die 63 % des Katalogs sind kein
   Widerspruch — zu bestätigen, nicht zu entscheiden.
4. **G.3** — seine zwei Szenarien in der laufenden App, offen seit 11.09.

---

## Was ich als Nächstes tue

**Die Auswertung des Prüfmeisters abholen, sobald sie steht** — und die Funde
am selben Tag an die Rollen verteilen, der sie gehören. Das ist der einzige
Posten, auf den ich gerade warte.

**Gate 1 neu rechnen, wenn Einsprech-Auswertung und Manfreds Session 3 beide
vorliegen** — nicht früher und nicht in Teilen.

**Zum Ablauf dieses Laufs:** `device_bash` auf Sandys Rechner ist weiterhin tot
(`no Plan9 drive shares mounted`, Windows-Update vom 08.09.). Gelesen und
geschrieben wurde über Staging/Commit mit `expectedMtimeMs`; die GitHub-API ist
in dieser Umgebung gesperrt (403), der Lauf-Status kam über die Actions-Seite,
zweimal unabhängig abgefragt. An `design-check.md`,
`chief-of-staff-legal-todos.md` und `entscheidungen-fuer-sandy.md` wurde
ausschließlich vor der Endmarkierung angehängt. Ersetzt wurde nur diese Datei.
Die beiden Dateien, an denen der Prüfmeister gerade schreibt, habe ich nicht
angefasst.

---

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
