# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 16.09.2026, 13:30 MESZ · Chief of Staff**
*(ersetzt die Fassung von 13:30 MESZ — diese Datei wird immer ersetzt, nie ergänzt.)*

---

## Lage in drei Zeilen

**Die Auswertung ist da.** Sandys 20 eingesprochene Fälle sind durchgerechnet:
**17 sauber, zwei neue Funde — PM-099 und PM-100.** Das ist die erste Messung
überhaupt, ob die App versteht, was gesprochen wird. Sie fällt besser aus als
befürchtet — und der eine Fund, der nicht gut ist, ist schwer.

**PM-099: der Ausschlusssatz hat keine Wirkung.** „An den Wänden machen wir
nichts" — und die Wandarbeiten stehen trotzdem im Angebot, 277,25 €. Nachgemessen
und systemisch: mit und ohne Ausschlusssatz entsteht Zeichen für Zeichen dieselbe
Liste. **Ich habe PM-099 vor PM-098 gezogen.**

**Verteilt ist alles.** Engineering hat PM-099/PM-100 (der Prüfmeister direkt,
plus meine Einordnung als CoS-E-071), der Designer die drei Bildschirm-Punkte
(PD-018, plus meine Reihenfolge in `design-check.md`). **Auf Sandy wartet keine
Entscheidung.**

---

## Was seit 13:30 MESZ passiert ist

| Rolle | Ergebnis | Status |
|---|---|---|
| Prüfmeister | **Auswertung fertig** — 20 Fälle, 17 sauber, PM-099 + PM-100 neu | ✅ erledigt |
| Prüfmeister | Hat PM-099/PM-100 **selbst** an Engineering (Todo-Datei) und Designer (PD-018) gegeben | ✅ erledigt |
| Prüfmeister | **PM-079-A ist erledigt** — sein Prüfstand war veraltet, die App rechnet richtig | ✅ erledigt |
| Prüfmeister | Zwei eigene Tabellenfehler korrigiert (Fall 04: 15 % ist richtig · Fall 17: `Türrahmen abkleben` ist zu Recht nicht da) | ✅ erledigt |
| CoS | **CoS-E-071** — PM-099 vor PM-098, neue Zug-3-Reihenfolge | verteilt |
| CoS | **Einordnung der drei Designer-Punkte** in `design-check.md` | verteilt |
| CoS | **Doku-Lücke in `einsprech-liste-alle-faelle.md` markiert** (Haken und Live-Blöcke um einen Fall verrutscht) | verteilt |
| Sandy | `b1a51fa` gepusht · Vercel Produktion **`b1a51fa`, `READY`** | ✅ erledigt |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, nicht vermutet:**

* **`einsprech-liste-alle-faelle.md` und `pruefmeister-restliste.md`** vollständig
  gelesen, Fall für Fall gegen die Restliste gestellt.
* **Produktion** über die Vercel-API: `b1a51fa`, `READY`, 13:19 MESZ.
* **Alle Dateien in `docs/` nach Änderungszeit**, zweimal — vor und nach meinen
  eigenen Schreibvorgängen.
* **Engineering- und Designer-Kanal** darauf geprüft, ob der Prüfmeister seine
  Funde schon selbst abgelegt hat. Hat er. Ich habe nur eingeordnet, nicht
  wiederholt.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Der CI-Lauf zu `b1a51fa`.** Die Actions-Seite liefert in dieser Umgebung
  heute einen veralteten Stand (sie endet bei Lauf #187), die GitHub-API ist
  gesperrt. Der letzte von mir **belegte** grüne Lauf bleibt **#192 auf
  `964ad73`**. `b1a51fa` ist ein reiner Doku-Commit — das ist kein Grund, ihn
  für grün zu erklären, nur einer, ihn nicht für dringend zu halten.
* **Gate 1 rechne ich weiterhin nicht neu.** Von den zwei Posten ist jetzt einer
  da (Sandys Einsprech-Lauf), der zweite fehlt (**Manfreds Session 3**). Die Zahl
  wird gerechnet, wenn beide vorliegen — nicht in Teilen. Dass zwei neue rote
  Funde dazugekommen sind, schätze ich nicht in Punkte um.
* **Versicherung, Stripe, Gewerbeanmeldung, Vercel-Benachrichtigung** — in
  diesem Lauf nicht angefasst.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | **Block im Chat ausführen** — committet fünf Doku-Dateien | ein Block |
| 2 | 🟡 **Einmal „Passwort vergessen" durchklicken** (CoS-P-013), dann ist der Punkt zu | zwei Minuten |
| 3 | Vercel-Benachrichtigung · Versicherung · Stripe · Gewerbeanmeldung KW 41 (CoS-041) | unverändert, in diesem Lauf nicht neu geprüft |

**Keine Entscheidung wartet auf sie.** Aus dem Live-Lauf ist keine entstanden.

### Nicht im Repository

```
docs/arbeitsreihenfolge.md                 <- in diesem Lauf ersetzt
docs/chief-of-staff-engineering-todos.md   <- CoS-E-071 angehängt
docs/design-check.md                       <- Einordnung PD-018 angehängt
docs/einsprech-liste-alle-faelle.md        <- Doku-Lücke markiert
docs/entscheidungen-fuer-sandy.md          <- Nachtrag 13:25
```

Falls die Dateien, an denen der Prüfmeister um 13:15 geschrieben hat, nicht in
`b1a51fa` gelandet sind, nimmt der Block sie mit — er committet den ganzen
`docs/`-Ordner.

---

## Head of Product Engineering

1. 🔴 **Zug 3, neue Reihenfolge: PM-099 → PM-098 → PM-072 → PM-074 → PM-079.**
   Begründung steht in **CoS-E-071**, kurz: der Auftrag zu PM-098 verweist auf
   die Mechanik von **PM-034**, und PM-099 ist die Messung, dass genau diese
   Mechanik die Pipeline nicht erreicht. Erst die Bremse, dann das, was darauf
   aufsetzt.
2. **Beim Bauen messen, ob PM-098 mitläuft.** Eine Bremse, die nach der
   Mengenberechnung greift, *könnte* einen Teil von PM-098 miterledigen. Messen,
   nicht annehmen.
3. **Der Beleg-Test des Prüfmeisters ist zum Umstellen gedacht** — er hält fest,
   dass heute mit und ohne Ausschlusssatz dasselbe herauskommt. Wird er rot, hat
   die Bremse gewirkt.
4. ✅ **PM-079-A: nichts zu bauen.** Der Isoliergrund über 65,00 m² stimmt, der
   Prüfstand war veraltet. Nur die Sperrklinke umstellen.
5. **CoS-E-069** — Batch PM-089…097. **PM-094** in Zug 3; **PM-089, 090, 091,
   093, 096, 097** in Zug 2; **PM-092 / PM-095** in den kleinen Zahlen-Zug.
   **Vor dem Bauen die drei Warnungen im Ticket lesen**, besonders PM-090.
6. **CoS-E-068** — Batch PM-079…088. **PM-085 nicht bauen, bis PD-016 Punkt 1
   beantwortet ist.**
7. **CoS-E-070 Teil A** — eine Quelle für das Fischgrät-Muster. Teil B
   (5 % oder 15 %) hängt an **CoS-E-054**, nicht hier.
8. **Reihenfolge insgesamt:** Zug 3 → Zug 2 → Zahlen-Zug (PM-092, PM-095,
   CoS-E-070 Teil A) → **CoS-E-061**.
9. **LR-19 / L-MAIL-01** — kein `reply_to` in den Mails an den Endkunden.
   Bauauftrag von Legal, hängt an **CoS-E-057**. Keine Frage an euch.
10. **CoS-E-057 (§ 35a)** — CoS-L-008 ist geliefert, bauen möglich. Migration
    **und** Eintrag in `check_migrationen.sql`.
11. **CoS-E-053** weiterbauen, mit den vier Legal-Bedingungen. Preisanpassungs-
    Hinweis nicht aufs Kunden-PDF vor Sandys Freigabe (LR-16).
12. **CoS-E-063** — Heizkörper. **CoS-E-060** — offen: welche Datei speist die
    Oberfläche, `preis-ableitung.ts` oder `materialanteil.ts`?
13. **CoS-E-067** — `no-explicit-any`-Aufräumrunde, eigener Lauf, ganz hinten.
14. ✅ **Die Warte-Anweisung von heute Mittag ist aufgehoben.** Der Prüfmeister
    ist durch, die Reihenfolge oben ist die endgültige. Ihr könnt loslegen.

## Product Designer

1. 🔴 **Drei Punkte aus dem Live-Lauf, in dieser Reihenfolge** — Inhalt in
   **PD-018** (zweiter Block), Reihenfolge und Abgrenzung in `design-check.md`:
   **(a)** der Fassaden-Entwurf (leerer Raum mit 0,00 € unter der richtigen
   Fassade — Vorrang hoch, erster Kundenscreen) · **(b)** Nullzeilen mit Menge 0
   gehören nicht aufs Angebot · **(c)** der Prozentzuschlag ohne Bezugsgröße —
   **noch nicht bauen**, der Prüfmeister misst die Bemessungsgrundlage nach.
2. ⚠️ **Beim Fassaden-Entwurf:** der leere Raum selbst ist **nicht** euer Fehler,
   der kommt aus dem Phantomraum (L-02 / PM-053-A) bei Engineering. Eure Seite
   ist die Gruppierung. Nicht warten, aber auch nicht deren Aufgabe übernehmen.
3. 🟢 **DC-109 ist entschieden: B.** Wortlaut steht fest in `design-check.md`.
   **Zwei Auflagen:** nur die Zeilen 557, 561, 562 in
   `src/app/(app)/einstellungen/page.tsx` anfassen, und **vor dem Schreiben
   gegen den aktuellen Stand prüfen** — in derselben Karte sitzt laufende Arbeit
   von Platform (CoS-P-009).
4. 🔴 **PD-016 Punkt 1** (runder Raum, PM-085) ist der **einzige** Punkt bei
   euch, an dem Engineering hängt — CoS-E-068 Teil C.
5. **PD-018 erster Block, drei Fragen.** Punkt 2 liefert zugleich den Beleg für
   **PD-016 Punkt 2**. **Keiner der drei blockiert etwas.**
6. **Nachzuziehen, jetzt möglich:** die eine Stelle in `AngebotDetail.tsx`,
   bewusst ausgelassen.
7. **DC-102** freigegeben — Ablauf und Darstellung, **nicht die Zahlen**.
   Einbau hängt an CoS-E-053.
8. 🔴 **`docs/landingpage-fuenf-beispiele.md` geht nicht live, bevor PM-098
   UND PM-099 gebaut sind.** Bisher stand dort nur PM-098.
9. **Live-Test von DC-105 / DC-101 / DC-103 / DC-104 / DC-089 / DC-047 /
   DC-048** — braucht Sandy am Rechner.

## Platform

1. ✅ **CoS-P-026 ist zu.** `ci.yml` repariert, #192 grün.
2. 🔴 **CoS-P-025 — die Schrumpf-Prüfung, und sie deckt jetzt auch
   `.github/workflows/` ab.** `ci.yml` war auf demselben Weg beschädigt wie die
   drei Doku-Dateien (BOM, doppelt kodierte Umlaute, ganze Datei zurückgeschrieben
   statt angehängt) — hier hat es vier Tage niemand gemerkt. Zweiter Teil
   unverändert: ist **CoS-P-022** ohne `device_bash` überhaupt lösbar?
3. 🔴 **CoS-P-024 — der Push-Hook wird ersatzlos abgeschafft.** Sandys Anweisung.
   **Noch nicht als umgesetzt eingetragen.**
4. ✅ **CoS-P-020 und CoS-P-021 sind zu.**
5. **CoS-P-013** — der letzte Rest ist Sandys Klick-Durchlauf, kein Code.
6. **CoS-P-005** — die fehlende RLS-Policy für den Logo-Upload.
7. **DC-109 ist entschieden (B)** — der Designer ändert drei Sätze in der
   „Abrechnung"-Karte, in der euer CoS-P-009-Kommentar sitzt. Er prüft vorher
   gegen den aktuellen Stand. Wenn ihr dort gerade schreibt, sagt Bescheid.
8. **In diesem Lauf nichts Neues von mir.**

## Prüfmeister

1. ✅ **Die Auswertung ist abgeholt und verteilt.** PM-099 und PM-100 liegen bei
   Engineering, die drei Bildschirm-Punkte beim Designer. Ihr müsst nichts
   nachreichen.
2. 🔴 **Doku-Lücke in `einsprech-liste-alle-faelle.md`, bitte geradeziehen.**
   Übersicht und Restliste stimmen überein (16 weicht ab, 17 weicht ab, 18
   sauber) — die Haken bei den Einzelfällen und die zwei Live-Ergebnis-Blöcke
   sind je einen Fall verrutscht. Steht ausführlich am Ende der Datei. **Kein
   Zahlenfehler, nur die Zuordnung.**
3. 🔴 **`docs/pruefmeister-einsprechen-47-56.md` vom 15.09. liegt weiter neben
   der neuen Liste.** Zwei Einsprech-Listen nebeneinander sind der Parallelstand,
   den Sandys Datei-Regel ausschließt: bitte durch einen Verweis ersetzen.
4. **Nachzumessen, vorgemerkt von euch selbst:** 15 % **wovon**? Der Designer
   baut Punkt (c) nicht, bevor diese Zahl dasteht.
5. **Fallbasis 98/100.** Die Sperrklinke für PM-098 in
   `pruefmeister-batch-47-56.test.ts` fehlt noch.
6. **Die letzten zwei Fälle bis 100, ohne App prüfbar:** Selbstkorrektur mitten
   im Satz · Kunde redet im Hintergrund dazwischen · Aufnahme bricht ab und wird
   fortgesetzt.
7. **Die 142 Vorlagen der gesperrten Gewerke** — jeweils vor der Freischaltung.
8. **Größter blinder Fleck, festgehalten:** **jedes** Gewerk hat Stundenzeilen im
   Katalog, die Engine hat an keiner Stelle einen Weg dorthin (Abschnitt W in
   `vokabular-abgleich.md`, PM-093). Steht in CoS-E-069 mit drin.
9. **Braucht die laufende App, unverändert offen:** PM-002 · PM-032 ·
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
7. 🆕 **Zur Kenntnis, kein Auftrag:** PM-099 heißt, dass heute Positionen auf dem
   Angebot stehen können, die der Kunde ausdrücklich abbestellt hat. Solange
   nichts live ist, ist das kein Rechtsthema — sagt Bescheid, wenn ihr das
   anders seht.

## Manfred

1. 🔴 **Session 3: Registrierung end-to-end** — steht weiterhin aus. **Das ist
   jetzt der einzige Posten, an dem die Gate-1-Zahl noch hängt**, der andere ist
   seit heute erledigt.
2. **DC-101 nachprüfen**: am Handy laden und **sofort** lostippen.
3. **Aus PD-009 §5:** Seine 75 % gegen die 63 % des Katalogs sind kein
   Widerspruch — zu bestätigen, nicht zu entscheiden.
4. **G.3** — seine zwei Szenarien in der laufenden App, offen seit 11.09.

---

## Was ich als Nächstes tue

**Manfreds Session 3 abholen, sobald sie steht** — dann ist der zweite von zwei
Posten da und **Gate 1 wird neu gerechnet**. Das ist der einzige Posten, auf den
ich noch warte.

**Den CI-Lauf zu `b1a51fa` nachtragen**, sobald die Actions-Seite in dieser
Umgebung wieder einen aktuellen Stand liefert. Bis dahin bleibt #192 auf
`964ad73` der letzte belegte grüne Lauf.

**Zum Ablauf dieses Laufs:** `device_bash` auf Sandys Rechner ist weiterhin tot
(`no Plan9 drive shares mounted`, Windows-Update vom 08.09.). Gelesen und
geschrieben wurde über Staging/Commit mit `expectedMtimeMs`. An
`chief-of-staff-engineering-todos.md`, `design-check.md`,
`einsprech-liste-alle-faelle.md` und `entscheidungen-fuer-sandy.md` wurde
ausschließlich vor der Endmarkierung angehängt. Ersetzt wurde nur diese Datei.
`pruefmeister-restliste.md` und `pruefmeister-notizen-fuer-designer.md` habe ich
gelesen, aber nicht angefasst — es sind Heimat-Dateien des Prüfmeisters.

---

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
