# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 16.09.2026, 13:45 MESZ · Chief of Staff**
*(ersetzt die Fassung von 13:30 MESZ — diese Datei wird immer ersetzt, nie ergänzt.)*

---

## Lage in drei Zeilen

**Sandys Block ist durch.** `7ac44c3` liegt im Repository, die fünf Doku-Dateien
sind drin, Vercel-Produktion steht auf `7ac44c3` und ist `READY`. **Nichts liegt
mehr uncommittet auf ihrer Platte.**

**Die CI ist grün — gemessen, nicht erwartet.** Drei Läufe hintereinander mit
Jobs: **#192, #193, #194 alle erfolgreich**. Damit ist auch der
Produktions-Build durch, der seit dem 15.09. der letzte unbewertete Schritt war.

**Sonst ist seit 13:30 MESZ nichts passiert.** Keine Datei in `docs/` ist nach
13:26 MESZ geschrieben worden, kein neuer Fund, keine neue Rückfrage. Die
Arbeitsaufträge unten sind unverändert — die Rollen arbeiten sie gerade ab.

---

## Was seit 13:30 MESZ passiert ist

| Rolle | Ergebnis | Status |
|---|---|---|
| Sandy | **`7ac44c3` gepusht** — die fünf Doku-Dateien aus dem 13:30-Block sind im Repository | ✅ erledigt |
| Sandy | Vercel-Produktion `7ac44c3`, **`READY`** (13:29 MESZ) | ✅ erledigt |
| CoS | **CI-Läufe #192 / #193 / #194 nachgemessen — alle drei grün** | ✅ erledigt |
| CoS | **Der offene Rest aus CoS-P-026 ist zu** — der Produktions-Build ist jetzt belegt (Nachtrag 2) | verteilt |
| CoS | **Blindstelle „GitHub-API gesperrt" aufgeklärt** — sie war es nie, die Abfrage war falsch (Nachtrag 2 bei Platform) | verteilt |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, nicht vermutet:**

* **Alle Dateien in `docs/` nach Änderungszeit.** Jüngste Schreibzeit: 13:26 MESZ
  (die fünf Dateien des vorigen Laufs). Danach nichts.
* **Vercel-API:** Produktion `7ac44c3`, `READY`, erstellt 13:29 MESZ.
* **GitHub Actions über die REST-API mit Branch-Filter:** #192 (`964ad73`) ✅ ·
  #193 (`b1a51fa`) ✅ · #194 (`7ac44c3`) ✅ — alle `completed / success`.
* **Dass Sandys Commit wirklich durch ist:** die 13:30-Fassung dieser Datei liegt
  auf `main` (`raw.githubusercontent.com` gegengelesen), nicht nur auf ihrer Platte.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Gate 1 rechne ich weiterhin nicht neu.** Unverändert: ein Posten liegt vor
  (Sandys Einsprech-Lauf), **Manfreds Session 3 fehlt**. Gerechnet wird, wenn
  beide da sind — nicht in Teilen.
* **Die Arbeitsstände der Rollen.** Seit 13:30 hat niemand geschrieben; ich habe
  keine neuen Ergebnisse gelesen und melde deshalb auch keine.
* **Versicherung, Stripe, Gewerbeanmeldung, Vercel-Benachrichtigung** — in diesem
  Lauf nicht angefasst.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | ✅ **Erledigt: der Commit-Block von 13:30.** `7ac44c3` ist durch, Produktion steht, CI grün. | — |
| 2 | 🟡 **Einmal „Passwort vergessen" durchklicken** (CoS-P-013), dann ist der Punkt zu | zwei Minuten |
| 3 | Vercel-Benachrichtigung · Versicherung · Stripe · Gewerbeanmeldung KW 41 (CoS-041) | unverändert, in diesem Lauf nicht neu geprüft |

**Keine Entscheidung wartet auf sie.**

### Nicht im Repository

```
docs/arbeitsreihenfolge.md                 <- in diesem Lauf ersetzt
docs/chief-of-staff-platform-todos.md      <- CoS-P-026 Nachtrag 2 angehängt
```

---

## Head of Product Engineering

*Unverändert gegenüber 13:30 MESZ — bitte weiterarbeiten, nichts davon ist
zurückgezogen.*

1. 🔴 **Zug 3, Reihenfolge: PM-099 → PM-098 → PM-072 → PM-074 → PM-079.**
   Begründung in **CoS-E-071**: der Auftrag zu PM-098 verweist auf die Mechanik
   von **PM-034**, und PM-099 ist die Messung, dass genau diese Mechanik die
   Pipeline nicht erreicht. Erst die Bremse, dann das, was darauf aufsetzt.
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
14. ✅ **Die Warte-Anweisung von Mittag bleibt aufgehoben.** Ihr könnt bauen.
15. 🆕 **Die CI ist wieder ein verlässliches Signal.** #192/#193/#194 grün, mit
    Jobs. Ein roter Lauf heißt ab jetzt wieder: etwas ist wirklich gefallen.

## Product Designer

*Unverändert gegenüber 13:30 MESZ.*

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
   UND PM-099 gebaut sind.**
9. **Live-Test von DC-105 / DC-101 / DC-103 / DC-104 / DC-089 / DC-047 /
   DC-048** — braucht Sandy am Rechner.

## Platform

1. ✅ **CoS-P-026 ist vollständig zu.** `ci.yml` repariert, und der offene Rest
   ist jetzt belegt: **#192, #193, #194 alle grün** — inklusive
   Produktions-Build. Steht als **Nachtrag 2** in eurer Todo-Datei.
2. 🆕 **Die GitHub-API war nie gesperrt.** Mit `?branch=main` liefert
   `api.github.com/…/actions/runs` den aktuellen Stand; ohne den Filter kommt
   eine veraltete Liste, die bei #189 abbricht — das war die vermeintliche
   Sperre. Für **CoS-P-022** relevant: vor „geht nicht" die gefilterte Form
   probieren.
3. 🔴 **CoS-P-025 — die Schrumpf-Prüfung, und sie deckt jetzt auch
   `.github/workflows/` ab.** Zweiter Teil unverändert: ist **CoS-P-022** ohne
   `device_bash` überhaupt lösbar?
4. 🔴 **CoS-P-024 — der Push-Hook wird ersatzlos abgeschafft.** Sandys Anweisung.
   **Noch nicht als umgesetzt eingetragen.**
5. ✅ **CoS-P-020 und CoS-P-021 sind zu.**
6. **CoS-P-013** — der letzte Rest ist Sandys Klick-Durchlauf, kein Code.
7. **CoS-P-005** — die fehlende RLS-Policy für den Logo-Upload.
8. **DC-109 ist entschieden (B)** — der Designer ändert drei Sätze in der
   „Abrechnung"-Karte, in der euer CoS-P-009-Kommentar sitzt. Wenn ihr dort
   gerade schreibt, sagt Bescheid.

## Prüfmeister

*Unverändert gegenüber 13:30 MESZ.*

1. ✅ **Die Auswertung ist abgeholt und verteilt.** PM-099 und PM-100 liegen bei
   Engineering, die drei Bildschirm-Punkte beim Designer.
2. 🔴 **Doku-Lücke in `einsprech-liste-alle-faelle.md`, bitte geradeziehen.**
   Übersicht und Restliste stimmen überein (16 weicht ab, 17 weicht ab, 18
   sauber) — die Haken bei den Einzelfällen und die zwei Live-Ergebnis-Blöcke
   sind je einen Fall verrutscht. **Kein Zahlenfehler, nur die Zuordnung.**
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

## Legal · Marketing · Finance

**In diesem Lauf nichts Neues von mir.** Eure offenen Punkte stehen unverändert
in euren eigenen Todo-Dateien.
