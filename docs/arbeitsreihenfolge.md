# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 16.09.2026, 14:10 MESZ · Chief of Staff**
*(ersetzt die Fassung von 13:55 MESZ — diese Datei wird immer ersetzt, nie ergänzt.)*

---

## Lage in drei Zeilen

**Sandys Block ist durch.** `7ac44c3` liegt im Repository, die fünf Doku-Dateien
sind drin, Vercel-Produktion steht auf `7ac44c3` und ist `READY`. **Nichts liegt
mehr uncommittet auf ihrer Platte.**

**Die CI ist grün — gemessen, nicht erwartet.** Drei Läufe hintereinander mit
Jobs: **#192, #193, #194 alle erfolgreich**. Damit ist auch der
Produktions-Build durch, der seit dem 15.09. der letzte unbewertete Schritt war.

**PM-099 ist gebaut.** Engineering hat um 13:46 MESZ abgelegt: neue Datei
`src/lib/bauteil-ausschluss.ts`, 13 Zusicherungen, Gegenprobe über alle 121
Prüfstände — Unterschied ausschließlich in den sieben Zusicherungen, um die es
geht. Der schwerste Fund aus Sandys Live-Lauf ist damit **am selben Tag zu**.
Der Code liegt uncommittet auf Sandys Platte.

---

## Was seit 13:30 MESZ passiert ist

| Rolle | Ergebnis | Status |
|---|---|---|
| Sandy | **`7ac44c3` gepusht** — die fünf Doku-Dateien aus dem 13:30-Block sind im Repository | ✅ erledigt |
| Sandy | Vercel-Produktion `7ac44c3`, **`READY`** (13:29 MESZ) | ✅ erledigt |
| CoS | **CI-Läufe #192 / #193 / #194 nachgemessen — alle drei grün** | ✅ erledigt |
| CoS | **Der offene Rest aus CoS-P-026 ist zu** — der Produktions-Build ist jetzt belegt (Nachtrag 2) | verteilt |
| CoS | **Blindstelle „GitHub-API gesperrt" aufgeklärt** — sie war es nie, die Abfrage war falsch (Nachtrag 2 bei Platform) | verteilt |
| Engineering | **PM-099 gebaut** (13:46 MESZ) — `bauteil-ausschluss.ts`, Sperrklinken umgestellt, Beleg-Test umgedreht | ✅ erledigt, **uncommittet** |
| Sandy | **Passwort-Durchlauf gemacht** — Anforderung, Mail, Formular belegt; letzter Klick nicht | teilweise belegt |
| CoS | **DC-111** — beide Passwort-Seiten ohne Desktop-Breite, Stellen benannt | verteilt |
| CoS | **CoS-P-027** — alle acht System-Mails kommen von „Sandra", auch die Sicherheitsmails | verteilt |
| CoS | **Entscheidung für Sandy gestellt:** Absendername A/B/C | wartet auf sie |

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
| 1 | 🔴 **Neuer Block im Chat** — committet den PM-099-Fix (Code + Tests) und zwei Doku-Dateien | ein Block |
| 2 | 🟡 **Absendername entscheiden: A, B oder C** (steht in `entscheidungen-fuer-sandy.md`) | ein Satz |
| 3 | 🟡 **CoS-P-013: ein Satz fehlt** — ging „Passwort speichern" durch und konntest du dich neu anmelden? | ein Satz |
| 4 | Vercel-Benachrichtigung · Versicherung · Stripe · Gewerbeanmeldung KW 41 (CoS-041) | unverändert, in diesem Lauf nicht neu geprüft |

**Eine Entscheidung wartet auf sie: der Absendername.**

### Nicht im Repository

```
src/lib/bauteil-ausschluss.ts                        <- NEU, PM-099
src/lib/__tests__/pm099-bauteil-ausschluss.test.ts   <- NEU, 13 Zusicherungen
src/lib/vollstaendigkeit/index.ts                    <- Bremse angeschlossen
src/lib/__tests__/pruefmeister-batch-47-56.test.ts   <- Sperrklinken umgestellt
docs/chief-of-staff-engineering-todos.md             <- PM-099-Bericht
docs/arbeitsreihenfolge.md                           <- in diesem Lauf ersetzt
docs/chief-of-staff-platform-todos.md                <- CoS-P-026 Nachtrag 2, CoS-P-027, CoS-P-013
docs/design-check.md                                 <- DC-111
docs/entscheidungen-fuer-sandy.md                    <- Absendername
```

Der Block committet den ganzen Ordner, offene Reste von anderen Rollen nimmt er
mit.

---

## Head of Product Engineering

*Unverändert gegenüber 13:30 MESZ — bitte weiterarbeiten, nichts davon ist
zurückgezogen.*

1. ✅ **PM-099 ist gebaut, CoS-E-071 ist damit zu.** Angekommen, gegengelesen:
   die Bremse sitzt am Ausgang, die drei Grenzen sind als Test belegt, die
   Sperrklinken sind umgestellt, der Beleg-Test ist umgedreht.
2. 🔴 **Zug 3 läuft weiter mit PM-098** → PM-072 → PM-074 → PM-079.
   **Offen und ausdrücklich zu messen:** ob die neue Bremse einen Teil von
   PM-098 schon miterledigt. Messen, nicht annehmen — der Befund über den
   Befund hinaus (vier Zeilen statt drei, `Voranstrich / Grundierung` trägt die
   Wandfläche ohne die Wand im Titel) spricht dafür, dass sich beide berühren.
3. **Der Vier-Zeilen-Fund gehört zurück an den Prüfmeister.** Der Schaden je
   Fall ist höher als die gemeldeten 277,25 € — ich habe es ihm unten notiert.
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
10. 🟠 **DC-111 — die beiden Passwort-Seiten haben kein Desktop-Layout.** Aus
    Sandys echtem Durchlauf, nicht aus einem Testfall. Die fünf Stellen stehen
    mit Zeilennummern in `design-check.md`. **Hinter PD-018 einsortieren**,
    nicht davor. Zweiter Punkt derselben Datei: das Emoji 📬 als Bildmarke —
    Frage an euch, keine Ansage.

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
9. 🟠 **CoS-P-027 — `FROM` in `src/lib/email.ts` bedient alle acht Mails mit
   „Sandra".** Kein Fehler, sondern Absicht — deshalb geht es an Sandy, nicht an
   euch. **Nichts bauen, bis sie A/B/C beantwortet hat.**
10. **CoS-P-013 bleibt offen**, aber nur noch am letzten Klick. Die ersten drei
    Schritte sind über Sandys Bildschirmfotos belegt, inklusive: der
    `CoS-P-003`-Fix greift — das Reset-Formular erscheint, statt nach vier
    Sekunden in „Link ungültig" zu kippen.

## Prüfmeister

*Unverändert gegenüber 13:30 MESZ.*

1. ✅ **PM-099 ist gebaut** — noch am selben Tag. Euer Beleg-Test ist umgedreht
   worden, so wie ihr ihn gemeint habt: er verlangt jetzt **verschiedene**
   Listen mit und ohne Ausschlusssatz und hält die Zahl der wegfallenden Zeilen
   fest (4).
2. 🆕 **Nachtrag zu eurem PM-099-Befund: es sind vier Zeilen, nicht drei.**
   `Voranstrich / Grundierung — Flur` trägt die Wandfläche (27,50 m²), nennt die
   Wand im Titel aber nicht — sie fehlt in eurer Aufstellung der 277,25 €. Der
   Schaden je Fall ist entsprechend höher. Bitte in der Restliste nachziehen.
3. ✅ **PM-100 und die drei Bildschirm-Punkte sind verteilt** (Engineering bzw.
   Designer).
4. 🔴 **Doku-Lücke in `einsprech-liste-alle-faelle.md`, bitte geradeziehen.**
   Übersicht und Restliste stimmen überein (16 weicht ab, 17 weicht ab, 18
   sauber) — die Haken bei den Einzelfällen und die zwei Live-Ergebnis-Blöcke
   sind je einen Fall verrutscht. **Kein Zahlenfehler, nur die Zuordnung.**
5. 🔴 **`docs/pruefmeister-einsprechen-47-56.md` vom 15.09. liegt weiter neben
   der neuen Liste.** Zwei Einsprech-Listen nebeneinander sind der Parallelstand,
   den Sandys Datei-Regel ausschließt: bitte durch einen Verweis ersetzen.
6. **Nachzumessen, vorgemerkt von euch selbst:** 15 % **wovon**? Der Designer
   baut Punkt (c) nicht, bevor diese Zahl dasteht.
7. **Fallbasis 98/100.** Die Sperrklinke für PM-098 in
   `pruefmeister-batch-47-56.test.ts` fehlt noch.
8. **Die letzten zwei Fälle bis 100, ohne App prüfbar:** Selbstkorrektur mitten
   im Satz · Kunde redet im Hintergrund dazwischen · Aufnahme bricht ab und wird
   fortgesetzt.
9. **Die 142 Vorlagen der gesperrten Gewerke** — jeweils vor der Freischaltung.

## Legal · Marketing · Finance

**In diesem Lauf nichts Neues von mir.** Eure offenen Punkte stehen unverändert
in euren eigenen Todo-Dateien.
