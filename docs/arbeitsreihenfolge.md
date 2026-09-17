# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 17.09.2026, 05:10 UTC · Chief of Staff**
*(ersetzt die Fassung von 18:55 UTC — diese Datei wird immer ersetzt, nie ergänzt.)*
*Alle Uhrzeiten in dieser Fassung sind **UTC**.*

---

## Lage in drei Zeilen

**Sandy hat gepusht, und die CI ist grün.** Lauf **#202 grün auf `a2c8629`**,
Produktion läuft auf demselben Stand. Der gestrige Stau von zwölf Commits ist
aufgelöst. Offen ist **ein** ungeübertragener Commit (`67edfb4`, Finance).

**Ich habe gestern Abend etwas Falsches gemeldet und korrigiere es hier
zuerst:** „die CI misst seit 14:34 UTC nichts mehr“ war falsch, und das BOM in
`ci.yml` war nicht die Ursache — es blockiert nachweislich nichts. Volle
Korrektur bei Platform.

**Sandy hat zwei Website-Sätze entschieden, beide sind gebaut.** Neu offen bei
ihr sind die drei Fragen des Head of Finance zur Landingpage.

---

## Was seit 18:55 UTC passiert ist

| Rolle | Ergebnis | Status |
|---|---|---|
| Sandy | **Push durch** — elf Commits auf `main`, Produktion `a2c8629` READY (16.09. 19:09) | ✅ erledigt |
| Platform | **CoS-P-024 umgesetzt** (`4c3fac8`) — Push-Hook ersatzlos entfernt, das BOM darin hatte Sandys Push abgebrochen | ✅ erledigt |
| Designer | **DC-113 gebaut** (`730af38`) — Nullzeilen und der leere Raum sind aus Angebot, Vorschau und PDF raus | ✅ erledigt |
| Marketing | **Punkt 9.1 erstmals bewertet** (`55963a9`) — Urteil: 0 von 100 bleibt richtig, aber aus anderem Grund als angenommen (der Text liegt fertig im Code und ist nur nicht eingeschaltet) | ✅ erhoben |
| Finance | **Punkte 4.7 und 11.4 erstmals bewertet** (`a2c8629`) | ✅ erhoben |
| Finance | **Landingpage-Entwurf gegengerechnet** (`67edfb4`) — **4 Stopper, 5 Korrekturen**; 33 Positionen in den vier Beispielangeboten nachgerechnet, kein Rechenfehler | ✅ erledigt |
| CoS | **Sandys zwei Website-Entscheidungen gebaut** — FAQ-Satz auf B, Nachsatz der Wartelisten-Seite gestrichen | ✅ erledigt |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, nicht vermutet:**

* **CI-Lauf-Liste über die GitHub-API:** #202 grün (`a2c8629`, 19:09),
  **#201 rot (`4c3fac8`, 18:53)**, #200 grün (`5e475c3`, 14:34).
* **`git log origin/main..main`: ein Commit** (`67edfb4`, Finance, 19:40).
  Arbeitsverzeichnis sonst sauber.
* **Beide Textstellen selbst geändert und geprüft:** `npx tsc --noEmit`
  fehlerfrei, kein Test greift auf die zwei Sätze zu (gesucht, nicht vermutet).
* **`docs-sichern.mjs pruefen`** → alle 55 Doku-Dateien in Ordnung ·
  **`schrumpfung`** → keine Schrumpfung, 9 Dateien geprüft.
* **`entscheidungen-fuer-sandy.md` frisch gelesen** — letzter fremder Eintrag
  16.09. 20:40 MESZ (Finance, F-006 + zwei Fragen).

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Warum #201 rot war.** Der Detail-Endpunkt bleibt `403`. `4c3fac8` hat nur
  eine Doku-Datei angefasst, und beide Doku-Prüfungen laufen auf dem heutigen
  Stand sauber durch. **Ich erfinde keine Ursache.**
* **Gate 1 rechne ich nicht neu.** Stand bleibt **53,0 %** aus dem 18:00-Lauf.
  Es fehlen weiter dieselben zwei Posten: **Manfreds Session 3** und die
  Bewertung der neu erhobenen Felder.
* **Versicherung, Stripe, Gewerbeanmeldung, Vercel-Benachrichtigung** — in
  diesem Lauf nicht angefasst.
* **Die Landingpage selbst** habe ich nicht aufgerufen. Was hier dazu steht,
  stammt aus den Befunden von Marketing und Finance, nicht aus eigener Anschauung.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🟡 **Pushen.** Ein Commit von Finance plus das, was ich heute committe. | ein Befehl |
| 2 | 🔴 **Drei Fragen vom Head of Finance zur Landingpage** — Preis bei § 19 (**A/B**), die Zählzeile „18 von 25 frei“, „Echte Aufnahmen, echte Angebote“. **Die Seite darf vorher nicht live gehen.** | drei Sätze |
| 3 | 🟡 **CoS-P-013: ein Satz fehlt** — ging „Passwort speichern“ durch und konntest du dich danach neu anmelden? | ein Satz |
| 4 | 🔵 **E-Rechnungs-Viewer installieren** (Quba, 0 €) — F-004, nicht eilig | einmalig |
| 5 | Vercel-Benachrichtigung · Versicherung · Stripe · Gewerbeanmeldung KW 41 (CoS-041) | unverändert, in diesem Lauf nicht neu geprüft |

**Erledigt und weg von ihrer Liste:** der Push-Stau, und die zwei Website-Sätze
(entschieden: **B** und **streichen**, beide gebaut).

**Sie ist ab morgen, 18.09., bis 25.09. in Italien.** Was bis heute Abend keine
Antwort hat, liegt eine Woche.

---

## Head of Product Engineering

1. **Zug 3: PM-074 → PM-079.** PM-074 sitzt bestätigt in
   `vollstaendigkeit/boden-vorarbeiten.ts`, `pruefeSockelleisten()` — Wortliste
   mit Wortgrenzen statt Wortstamm, dieselbe Reparatur wie PM-064.
2. 🔴 **PM-079-A: Sperrklinke stehen lassen, nicht bauen.** Der Widerspruch
   liegt beim Prüfmeister als offene Doku-Lücke. **Unverändert.**
3. 🟢 **PM-085 ist baubar** — vollständige Fassung in **CoS-E-072**.
4. **Zug 2:** PM-089, 090, 091, 093, 096, 097 **und PM-085**. **Vor dem Bauen
   die drei Warnungen in CoS-E-069 lesen, besonders PM-090.**
5. 🔴 **Drei Fälle mit Vorrang hoch aus dem Prüfmeister-Batch:** **PM-116**
   (ausgenommener zweiter Bauabschnitt, 305,40 €) · **PM-105** (Verneinung mit
   Menge, löscht 100,00 € *bestellte* Arbeit) · **PM-106** („ebenso“, „dito“,
   „genauso wie“ — eine Klasse, 720,00 € je Fall). Warnung des Prüfmeisters
   mitnehmen: die Maschine, die eine Verneinung in Wirkung übersetzt, ist schon
   da und ist zu grob; PM-105-D/E als Kontrollen mitlaufen lassen.
6. **Zahlen-Zug:** PM-092, PM-095, **CoS-E-070 Teil A**. Teil B hängt an CoS-E-054.
7. **Danach CoS-E-061.**
8. **CoS-E-057 (§ 35a)** — CoS-L-008 ist geliefert, bauen möglich. Migration
   **und** Eintrag in `check_migrationen.sql`. **CoS-E-053** weiterbauen mit den
   vier Legal-Bedingungen; Preisanpassungs-Hinweis nicht aufs Kunden-PDF vor
   Sandys Freigabe (LR-16). **LR-19 / L-MAIL-01** hängt an CoS-E-057.
9. **CoS-E-063** Heizkörper · **CoS-E-060** offen · **CoS-E-067**
   `no-explicit-any`-Aufräumrunde, eigener Lauf, ganz hinten.
10. **Nebenbefund `altbelag_entfernen`** bleibt liegen wie vorgeschlagen —
    eigener Fall, gehört gemessen, bevor jemand daran baut.
11. 🆕 🟠 **Aus Finance' Gegenrechnung kommen zwei Punkte zu euch:** der
    **ZUGFeRD-Export deklariert ein Angebot als Rechnung** (`TypeCode 380`,
    liegt als EX-003 bei Platform — der Fehler selbst ist eurer), und der
    **Nummernkreis „Rechnungen“, aus dem niemand zieht**. Beide sind der Grund,
    warum die Landingpage heute etwas verspricht, das das Produkt nicht hält.
12. ✅ **Die CI ist wieder ein verlässliches Signal** — #202 grün auf dem
    gepushten Stand. Der Satz aus der letzten Fassung („für eure lokalen
    Commits existiert kein Lauf“) ist erledigt.

## Product Designer

1. ✅ **DC-113 ist gebaut** — Punkt (b) der drei Live-Lauf-Punkte ist damit zu.
2. 🔴 **PD-019 vom Prüfmeister — drei Sätze, keine Rechenfrage:** das leere
   Angebot (**PM-113, Vorrang hoch** — derselbe Screen wie der runde Raum in
   DC-112), der Nachtrag ohne Kennzeichnung (PM-115), die Formfrage bei zwei
   Bauabschnitten (PM-116 — der Fehler dahinter gehört Engineering).
3. 🔴 **Aus dem Live-Lauf bleiben zwei Punkte** (Inhalt in **PD-018**,
   zweiter Block): **(a)** Fassaden-Entwurf, Vorrang hoch, erster Kundenscreen ·
   **(c)** Prozentzuschlag ohne Bezugsgröße — **noch nicht bauen**, der
   Prüfmeister misst die Bemessungsgrundlage nach.
4. ⚠️ **Beim Fassaden-Entwurf:** der leere Raum selbst ist **nicht** euer Fehler
   (Phantomraum L-02 / PM-053-A bei Engineering). Eure Seite ist die Gruppierung.
5. **PD-018 erster Block, drei Fragen.** Punkt 2 liefert zugleich den Beleg für
   **PD-016 Punkt 2**. **Keiner der drei blockiert etwas.**
6. **Nachzuziehen:** die eine Stelle in `AngebotDetail.tsx`, bewusst ausgelassen.
7. **DC-102** freigegeben — Ablauf und Darstellung, **nicht die Zahlen**.
   Einbau hängt an CoS-E-053.
8. 🆕 🔴 **Die Landingpage ist jetzt euer größter Posten — aber erst nach
   Sandys drei Antworten.** Marketing hat bewertet, Finance hat gegengerechnet:
   **vier Stopper**, fünf Korrekturen. **Aufbau und Aussehen gehören euch,
   Inhalt Marketing.** Drei der vier Stopper sind Textfragen, nicht Gestaltung —
   ihr wartet auf Marketing, nicht umgekehrt.
9. 🟠 **DC-111 — die beiden Passwort-Seiten haben kein Desktop-Layout.** Fünf
   Stellen mit Zeilennummern in `design-check.md`. **Hinter PD-018 einsortieren.**
   Zweiter Punkt derselben Datei: das Emoji 📬 als Bildmarke — Frage an euch.
10. 🟢 **Live-Tests braucht Sandy nicht mehr.** Browser in der Claude-App plus
    Postfach `hallo@` — ihr testet selbst, Ende zu Ende.
11. **`docs/landingpage-fuenf-beispiele.md`: die Sperre ist gefallen.** Eine
    Auflage bleibt: Beispiel 4 umgeht PM-098 heute dadurch, dass Fenster und
    Tür nicht im Satz stehen — diese Krücke gehört raus, bevor die Seite live geht.

## Platform

1. 🆕 ⚠️ **Korrektur zu CoS-P-022 — lest den Nachtrag in eurer Datei zuerst.**
   Meine Meldung „die CI misst seit 14:34 nichts mehr“ war falsch: #201 und
   #202 sind gelaufen. **Auch das BOM in `ci.yml` blockiert nichts** — beide
   Läufe sind mit dem BOM gestartet. Ich habe es stehen lassen; ob ihr es
   entfernt, ist eure Entscheidung (CoS-P-025 prüft `.github/workflows/` mit).
2. 🟠 **#201 war rot auf `4c3fac8`** — einem Commit, der nur eine Doku-Datei
   angefasst hat. Ursache unbekannt, der Detail-Endpunkt ist `403`. **Damit ist
   eure Restfrage nach dem Lese-Token (`actions:read`) etwas mehr wert als
   gestern** — aber weiter nicht dringend. Wenn ihr zum Token ratet: Sandy-Punkt,
   also mit einem Satz Begründung an mich, nicht selbst anlegen.
3. 🆕 🔴 **Aus Finance' Gegenrechnung: die Stripe-Preis-Variablen in Vercel
   gegenlesen.** Der Code sucht `STRIPE_PRICE_STANDARD` und
   `STRIPE_PRICE_FOUNDER`, in Sandys `.env.local` stehen `STRIPE_PRICE_STARTER`
   und `STRIPE_PRICE_PRO`. **Stehen in Vercel dieselben Namen wie lokal, kann
   niemand den Gründerpreis buchen.** Finance hat es ausdrücklich euch
   überlassen und nichts angefasst — **das ist jetzt eurer.**
4. 🔴 **Vier leere Gate-1-Felder liegen bei euch:** **2.7** Session-Sicherheit ·
   **4.1** kostenloser Start ohne Zahlungs-Blocker · **6.6**
   Rate-Limiting/Brute-Force auf dem Login (hier erwarte ich echte Arbeit, nicht
   nur eine Messung) · **13.2** Notausschalter.
5. 🔴 **CoS-P-025** — die Schrumpf-Prüfung, sie deckt jetzt auch
   `.github/workflows/` ab.
6. 🔴 **EX-003 — ZUGFeRD deklariert ein Angebot als Rechnung** (`TypeCode 380`).
   Von Finance als einer der vier Landingpage-Stopper wieder aufgerufen.
7. 🟢 **CoS-P-027 ist entschieden: C.** Zuordnung aller acht Versandwege steht
   in Nachtrag 1. Zwei Punkte nicht übersehen: `hallo@sofortangebot.app` muss
   zustellbar sein (falls nicht: **melden**, nicht still auf `sandra@`
   zurückfallen), und die `Sandra`-Signaturen im Fließtext ziehen mit.
8. **CoS-P-013** — der letzte Rest ist Sandys Klick-Durchlauf, kein Code.
9. ✅ **CoS-P-024, CoS-P-026, CoS-P-020, CoS-P-021, CoS-P-005 sind zu.**
10. **Regel zum Postfach, unverändert:** Lesen ja, um Tests zu belegen. **Keine
    Mails von dort verschicken, nichts löschen, nichts als gelesen markieren.**

## Prüfmeister

1. ✅ **Batch PM-104 bis PM-116 liegt — Fallbasis 116**, und er ist jetzt auch
   gepusht und von #202 gemessen.
2. 🔴 **Offen bei euch: der Widerspruch PM-079-A.** Euer Prüfstand und eure
   Entwarnung meinen nicht dasselbe. **Bis dort ein Satz steht, bleibt
   Engineerings Sperrklinke stehen** — das blockiert real.
3. 🔴 **Nachzumessen: die Bemessungsgrundlage beim Prozentzuschlag** (Designer
   Punkt (c) wartet darauf, baut aber nicht).
4. 🔴 **Manfreds Session 3** — seit 18:06 entsperrt, noch nicht gelaufen. **Sie
   ist einer der zwei fehlenden Posten für die nächste Gate-1-Rechnung** und
   inzwischen der einzige, der nur an euch hängt.
5. **Acht Fälle mit Soll-Satz** liegen fertig: PM-110, PM-109, PM-113, PM-104,
   PM-111, PM-112, PM-114, PM-115, PM-108.
6. ✅ **K.6 und K.7 sind beantwortet.**
7. **Die 142 Vorlagen der gesperrten Gewerke** — unverändert, jeweils vor der
   Freischaltung, nicht danach.

## Marketing

1. ✅ **Punkt 9.1 ist erhoben** — und das Urteil ist die eigentliche Nachricht:
   der Text liegt zu 80 % fertig im Code und ist nur **nicht eingeschaltet**
   (`NEXT_PUBLIC_COMING_SOON`). Hier liegt kein Monat Arbeit, hier liegen
   Korrekturen und ein Schalter.
2. ✅ **Sandys zwei Antworten sind da: B und streichen.** **Ihr müsst dazu nichts
   bauen** — ich habe beide Stellen selbst geändert, Einzelheiten in CoS-M-012.
3. 🔴 **Vier Stopper von Finance, alle vier vor dem Livegang:** §-19-Preis ·
   Zählzeile „18 von 25 frei“ · „Echte Aufnahmen“ · die
   E-Rechnungs-/GoBD-Zeile. **Drei davon hängen an Sandys Antwort — nicht
   vorher umschreiben.** Die vierte (GoBD/ZUGFeRD) hängt an Engineering.
4. 🟠 **Fünf Korrekturen von Finance**, kein Stopper, aber falsch — beginnend
   mit DATEV, das im Text auf einer Stufe mit Lexware und sevDesk steht, im Code
   aber nur ein Export ist.
5. **Euer eigener Rest aus 9.1:** die vier widersprüchlichen Gratis-Versprechen,
   die veraltete Preis-Sektion, die zwei zu hoch gegriffenen Zahlen.

## Legal · Finance

* **Legal — Punkt 7.13:** KI-Anbieter-Nutzungsbedingungen (OpenAI/Whisper).
  Reine Lesearbeit mit Urteil. **Wenn alles passt, mit Fundstelle sagen.**
  🆕 **Dazu kommt jetzt ein zweiter Anlass:** Marketing verspricht auf der Seite
  „verschlüsselt auf Servern in Deutschland, kein Tracking“ — Finance hat das
  ausdrücklich an euch verwiesen, weil Sprachaufnahmen über einen KI-Anbieter
  laufen. **Derselbe Punkt, zwei Anlässe.** Daneben unverändert offen: die
  Erreichbarkeit der Impressumsadresse.
* **Finance — 4.7 und 11.4 sind erhoben, die Landingpage ist gegengerechnet.**
  Das war viel und es war gut belegt. **Der nächste Posten ist nicht neu:** die
  Zustelltests, die ihr an Platform übergeben habt, liegen dort — verfolgt sie,
  Punkt 4.7 hängt an ihrem Ergebnis.

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
