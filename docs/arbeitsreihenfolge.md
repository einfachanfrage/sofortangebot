# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 16.09.2026, 18:55 UTC · Chief of Staff**
*(ersetzt die Fassung von 17:55 UTC — diese Datei wird immer ersetzt, nie ergänzt.)*
*Alle Uhrzeiten in dieser Fassung sind **UTC**, so wie ich sie gemessen habe.
In den älteren Fassungen standen dieselben Messungen teils als „MESZ" —
das war eine Ungenauigkeit, keine andere Messung.*

---

## Lage in drei Zeilen

**Zwölf Commits liegen nur auf Sandys Platte.** Nichts davon ist gepusht,
nichts deployt, nichts von der CI gemessen: PM-098, PM-099, PM-072, der
Prüfmeister-Batch PM-104…116 und die Gate-1-Neuberechnung. **Das ist heute der
einzige Punkt, an dem alles hängt** — und der einzige, den nur Sandy lösen kann.

**Die CI ist wieder lesbar — die Blindheit aus dem 17:55-Lauf ist weg.**
#200 grün auf `5e475c3`, und `5e475c3` ist zugleich der letzte gepushte Stand.
Nicht die GitHub-API war gesperrt, sondern ihre Detail-Endpunkte.

**Keine Entscheidung wartet auf Sandy.** Offen ist ein Push, und eine Frage,
die sie in einem Satz beantwortet.

---

## Was seit 17:55 UTC passiert ist

| Rolle | Ergebnis | Status |
|---|---|---|
| CoS | **Gate 1 neu gerechnet: 50,3 % → 53,0 %** (`3c7bb9e`) — aus Sandys zwei Live-Durchläufen, ohne neuen Code: 2.3 auf 98, 3.1 auf 70, 5.3 auf 35 | ✅ erledigt |
| CoS | **Postfach `hallo@` ist für alle Rollen lesbar** (`dc24013`) — Manfreds Session 3 und die Zustelltests sind damit entsperrt | ✅ erledigt |
| CoS | **Die 13 leeren Gate-1-Felder sind auf die Rollen verteilt** (`551004b`) — 1.300 der 2.207 fehlenden Punkte liegen in Feldern, die nie jemand angesehen hat | ✅ erledigt |
| Engineering | **PM-072 gebaut** (`fb5dfb8`) — Estrich ist kein Belag, die erfundene Zeile ist weg. **Zug 3 rückt auf PM-074.** | ✅ erledigt |
| Finance/CoS | **Punkt 11.4 erstmals erhoben** (`0eff2ba`) — kein getrenntes Geschäftskonto, hängt an der Gewerbeanmeldung KW 41 | ✅ erhoben |
| CoS | **CI gemessen: #195 rot, #196 bis #200 grün** — der Satz „über die Läufe nach `7ac44c3` sage ich nichts" ist eingelöst | ✅ erledigt |
| CoS | **CoS-P-022 eingegrenzt** — der verlässliche Leseweg ist gefunden, siehe Platform | ✅ erledigt |
| Engineering | Voller Testlauf auf Sandys Rechner: **161 Dateien, 2592 Zusicherungen, 0 rot** | ✅ erledigt |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, nicht vermutet:**

* **Die CI-Lauf-Liste über die GitHub-API, zweimal abgefragt:** #195
  (`5e029e6`) rot, #196/#197/#198/#199/#200 grün. Die **Lauf-Liste**
  (`/actions/runs?branch=main`) antwortet ohne Anmeldung; die **Detail-
  Endpunkte** (`/runs/<id>`, `/runs/<id>/jobs`) liefern `403`. Damit ist das
  `403` vom 17:55-Lauf erklärt, ohne eine Sperre annehmen zu müssen.
* **Vercel-API:** Produktion ist `5e475c3`, `READY`, 14:34 UTC. **Danach gibt
  es keinen Deploy — weil es danach keinen Push gibt.** Nicht, weil etwas
  fehlgeschlagen wäre.
* **`git log origin/main..main`: zwölf Commits.** Von `86a9c75` (16:18) bis
  `0eff2ba` (18:31).
* **`git push --dry-run`:** scheitert unverändert mit *„could not read
  Username for 'https://github.com'"*. In dieser Shell liegen keine
  GitHub-Zugangsdaten, und ich nehme keine entgegen. **Pushen bleibt bei Sandy.**
* **`docs/entscheidungen-fuer-sandy.md` frisch gelesen:** letzter Eintrag
  12:22 UTC, Absendername entschieden (C). **Dort wartet nichts auf sie.**
* **Alle Dateien in `docs/` nach Änderungszeit**, und die Schlussabschnitte der
  fünf Rollen-Dateien selbst gelesen — nicht die Übersichten.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Warum #195 rot war.** Der Detail-Endpunkt ist zu. Fünf grüne Läufe danach
  → ich führe ihn als erledigt und erfinde keine Ursache.
* **Gate 1 rechne ich nicht neu.** Der 18:00-Lauf hat das gerade getan
  (**53,0 %**). Unverändert gilt: **Manfreds Session 3 fehlt** — sie ist seit
  18:06 technisch möglich, aber noch nicht gelaufen.
* **Versicherung, Stripe, Gewerbeanmeldung, Vercel-Benachrichtigung** — in
  diesem Lauf nicht angefasst.
* **Der Zustand der zwölf lokalen Commits.** Kein CI-Lauf, kein Deploy. Das
  einzige Signal dafür ist die Gegenprobe von Engineering und Prüfmeister.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🔴 **Pushen.** Zwölf Commits liegen auf ihrer Platte. Alles ist committet — es fehlt nur der eine Befehl, den ich nicht habe. | ein Befehl |
| 2 | 🟡 **CoS-P-013: ein Satz fehlt** — ging „Passwort speichern" durch und konntest du dich danach neu anmelden? | ein Satz |
| 3 | Vercel-Benachrichtigung · Versicherung · Stripe · Gewerbeanmeldung KW 41 (CoS-041) | unverändert, in diesem Lauf nicht neu geprüft |

**Keine Entscheidung wartet auf sie.**

---

## Head of Product Engineering

1. ✅ **PM-072 ist gebaut und committet.** Zug 3 rückt auf **PM-074 → PM-079**.
   PM-074 sitzt bestätigt in `vollstaendigkeit/boden-vorarbeiten.ts`,
   `pruefeSockelleisten()` — Wortliste mit Wortgrenzen statt Wortstamm,
   dieselbe Reparatur wie PM-064.
2. 🔴 **PM-079-A: Sperrklinke stehen lassen, nicht bauen.** Der Widerspruch
   (euer Prüfstand zwei Räume 112 vs. 65 m², die Entwarnung des Prüfmeisters
   ein Raum über 65 m²) liegt beim Prüfmeister als offene Doku-Lücke.
   **Unverändert seit 14:55.**
3. 🟢 **PM-085 ist baubar** — DC-112 ist übersetzt, die vollständige Fassung
   steht in **CoS-E-072**: Erkennung (`vage` bei Rundform-Wort ohne
   `laenge`/`breite`), Rückfrage mit Vorschlag, π-Rechnung nur für die Anzeige,
   und die harte Grenze: ein Raum ohne Fläche erzeugt einen **Fehlt-Eintrag**,
   nie null Positionen und null Einträge.
4. **Zug 2:** PM-089, 090, 091, 093, 096, 097 **und PM-085**. **Vor dem Bauen
   die drei Warnungen in CoS-E-069 lesen, besonders PM-090.**
5. 🆕 🔴 **Aus dem Prüfmeister-Batch kommen drei Fälle mit Vorrang hoch dazu:**
   **PM-116** (ausgenommener zweiter Bauabschnitt, 305,40 € Arbeit, die der
   Satz herausnimmt), **PM-105** (Verneinung mit Menge — löscht 100,00 €
   *bestellte* Arbeit, dreht die Klasse also um), **PM-106** („ebenso", „das
   gleiche nochmal", „dito", „genauso wie" — eine Klasse, kein Einzelfall,
   720,00 € je Fall). **Warnung des Prüfmeisters mitnehmen:** die Maschine, die
   eine Verneinung in Wirkung übersetzt, ist schon da und ist zu grob — wer
   PM-101 baut, baut darauf auf, PM-105-D/E als Kontrollen mitlaufen lassen.
6. **Zahlen-Zug:** PM-092, PM-095, **CoS-E-070 Teil A**. Teil B (5 % oder 15 %)
   hängt an CoS-E-054, nicht hier.
7. **Danach CoS-E-061.**
8. **CoS-E-057 (§ 35a)** — CoS-L-008 ist geliefert, bauen möglich. Migration
   **und** Eintrag in `check_migrationen.sql`. **CoS-E-053** weiterbauen mit den
   vier Legal-Bedingungen; Preisanpassungs-Hinweis nicht aufs Kunden-PDF vor
   Sandys Freigabe (LR-16). **LR-19 / L-MAIL-01** (kein `reply_to` in Mails an
   den Endkunden) hängt an CoS-E-057.
9. **CoS-E-063** Heizkörper · **CoS-E-060** offen: welche Datei speist die
   Oberfläche, `preis-ableitung.ts` oder `materialanteil.ts`? · **CoS-E-067**
   `no-explicit-any`-Aufräumrunde, eigener Lauf, ganz hinten.
10. 🆕 **Euer Nebenbefund `altbelag_entfernen` ist angekommen und bleibt
    liegen, wie ihr es vorgeschlagen habt.** Ein von Hand gesetztes Feld wird
    von der Pipeline überschrieben, nicht nur ergänzt. **Eigener Fall, gehört
    gemessen, bevor jemand daran baut** — nicht in PM-074 hineinziehen.
11. ⚠️ **Zur CI: #200 ist grün, aber #200 ist der letzte GEPUSHTE Stand.** Für
    eure zwölf lokalen Commits existiert kein Lauf. **Bis Sandy gepusht hat,
    bleibt eure eigene Gegenprobe das einzige Signal** — sie ist hier auch mehr
    wert: 161 Dateien / 2592 Zusicherungen / 0 rot auf dem echten Rechner.
12. 🆕 **Zu eurer Meldung „mein Stand wurde mir wegcommittet":** aufgenommen,
    Punkt liegt bei mir, nicht bei euch. Ihr habt richtig gehandelt (geprüft,
    nicht gehofft). **Ihr müsst daraus nichts ableiten.**

## Product Designer

1. 🆕 🔴 **PD-019 vom Prüfmeister — drei Sätze, keine Rechenfrage:** das leere
   Angebot (**PM-113, Vorrang hoch** — es ist derselbe Screen, den ihr für den
   runden Raum in DC-112 schon entschieden habt), der Nachtrag ohne
   Kennzeichnung (PM-115), die Formfrage bei zwei Bauabschnitten (PM-116 — der
   Fehler dahinter gehört Engineering, nicht euch).
2. 🔴 **Drei Punkte aus dem Live-Lauf, in dieser Reihenfolge** — Inhalt in
   **PD-018** (zweiter Block): **(a)** Fassaden-Entwurf (leerer Raum mit 0,00 €
   unter der richtigen Fassade, Vorrang hoch, erster Kundenscreen) · **(b)**
   Nullzeilen mit Menge 0 gehören nicht aufs Angebot · **(c)** Prozentzuschlag
   ohne Bezugsgröße — **noch nicht bauen**, der Prüfmeister misst die
   Bemessungsgrundlage nach.
3. ⚠️ **Beim Fassaden-Entwurf:** der leere Raum selbst ist **nicht** euer
   Fehler (Phantomraum L-02 / PM-053-A bei Engineering). Eure Seite ist die
   Gruppierung. Nicht warten, aber auch nicht deren Aufgabe übernehmen.
4. **PD-018 erster Block, drei Fragen.** Punkt 2 liefert zugleich den Beleg für
   **PD-016 Punkt 2**. **Keiner der drei blockiert etwas.**
5. **Nachzuziehen, jetzt möglich:** die eine Stelle in `AngebotDetail.tsx`,
   bewusst ausgelassen.
6. **DC-102** freigegeben — Ablauf und Darstellung, **nicht die Zahlen**.
   Einbau hängt an CoS-E-053.
7. 🟢 **`docs/landingpage-fuenf-beispiele.md`: die Sperre ist gefallen**
   (PM-098 und PM-099 sind beide gebaut). **Eine Auflage bleibt:** Beispiel 4
   umgeht PM-098 heute dadurch, dass Fenster und Tür nicht im Satz stehen —
   diese Krücke gehört raus, bevor die Seite live geht.
8. 🟠 **DC-111 — die beiden Passwort-Seiten haben kein Desktop-Layout.** Fünf
   Stellen mit Zeilennummern in `design-check.md`. **Hinter PD-018
   einsortieren.** Zweiter Punkt derselben Datei: das Emoji 📬 als Bildmarke —
   Frage an euch, keine Ansage.
9. 🟢 **Live-Tests braucht Sandy nicht mehr** (DC-105 / DC-101 / DC-103 /
   DC-104 / DC-089 / DC-047 / DC-048). Der Browser in der Claude-App läuft,
   **und seit 18:06 ist auch `hallo@` für alle Rollen lesbar** — der letzte
   Grund, auf sie zu warten, ist damit weg. Ihr testet selbst, Ende zu Ende.
10. 🆕 **Marketing kommt auf euch zu (Punkt 9.1, Landingpage).** Abgemacht ist:
    **Inhalt gehört Marketing, Aufbau und Aussehen euch.** Erst ein Entwurf,
    keine fertige Seite — Sandy will den Text mitgestalten.

## Platform

1. 🆕 🟢 **CoS-P-022 ist eingegrenzt — und deutlich kleiner geworden.** Nicht
   die GitHub-API ist gesperrt, sondern ihre **Detail-Endpunkte**. Die
   **Lauf-Liste** (`/actions/runs?branch=main&per_page=N`) antwortet ohne
   Anmeldung, zweimal hintereinander geprüft. Volle Messung in eurer Datei.
   **Eure Restfrage:** lohnt ein Lese-Token (`actions:read`) für die
   Schritt-Ebene, oder reicht die Lauf-Ebene? **Nicht dringend.** Wenn ihr zum
   Token ratet: das ist ein Sandy-Punkt (ihr Konto), also meldet es mir mit
   einem Satz Begründung, statt es selbst anzulegen.
2. 🔴 **Vier leere Gate-1-Felder liegen bei euch** (Datei, 18:18): **2.7**
   Session-Sicherheit · **4.1** kostenloser Start ohne Zahlungs-Blocker ·
   **6.6** Rate-Limiting/Brute-Force auf dem Login (hier erwarte ich echte
   Arbeit, nicht nur eine Messung) · **13.2** Notausschalter. Der Weg dafür ist
   jetzt komplett begehbar: Browser der Claude-App **plus** Postfach `hallo@`.
3. 🔴 **CoS-P-025** — die Schrumpf-Prüfung, sie deckt jetzt auch
   `.github/workflows/` ab.
4. 🔴 **CoS-P-024 — der Push-Hook wird ersatzlos abgeschafft.** Sandys
   Anweisung. **Noch immer nicht als umgesetzt eingetragen.**
5. 🟢 **CoS-P-027 ist entschieden: C.** Zwei Absender, Zuordnung aller acht
   Versandwege steht fertig in Nachtrag 1. Zwei Punkte nicht übersehen:
   `hallo@sofortangebot.app` muss zustellbar sein (falls nicht: **melden**,
   nicht still auf `sandra@` zurückfallen), und die `Sandra`-Signaturen im
   Fließtext der Marken-Mails ziehen im selben Zug mit.
6. **CoS-P-013** — der letzte Rest ist Sandys Klick-Durchlauf, kein Code.
7. ✅ **CoS-P-026, CoS-P-020, CoS-P-021, CoS-P-005 sind zu.**
8. **Regel zum Postfach, unverändert:** Lesen ja, um Tests zu belegen. **Keine
   Mails von dort verschicken, nichts löschen, nichts als gelesen markieren,
   was Sandy noch nicht gesehen hat.**

## Prüfmeister

1. ✅ **Batch PM-104 bis PM-116 liegt — Fallbasis 116.** 29 grün, 20
   Sperrklinken, Befunde in `pruefmeister-restliste.md`. **Committet
   (`c4ef0dd`), aber wie alles von heute noch nicht gepusht.**
2. 🔴 **Die drei schweren Funde sind an Engineering verteilt:** PM-116, PM-105,
   PM-106 — alle drei mit Vorrang hoch, Einordnung dort.
3. 🔴 **Offen bei euch: der Widerspruch PM-079-A.** Euer Prüfstand und eure
   Entwarnung meinen nicht dasselbe. **Bis dort ein Satz steht, bleibt
   Engineerings Sperrklinke stehen** — das blockiert real.
4. 🔴 **Nachzumessen: die Bemessungsgrundlage beim Prozentzuschlag** (Designer
   Punkt (c) wartet darauf, baut aber nicht).
5. **Acht Fälle mit Soll-Satz** liegen fertig: PM-110, PM-109, PM-113, PM-104,
   PM-111, PM-112, PM-114, PM-115, PM-108.
6. ✅ **K.6 und K.7 sind beantwortet — Engineering hängt an nichts mehr bei euch.**
7. **Die 142 Vorlagen der gesperrten Gewerke** — unverändert, jeweils vor der
   Freischaltung, nicht danach.
8. 🆕 **Manfreds Session 3 ist entsperrt** (Postfach `hallo@` seit 18:06 für
   alle Rollen lesbar). Sie ist der zweite fehlende Posten für die nächste
   Gate-1-Rechnung — der erste (Sandys Einsprech-Lauf) liegt bereits vor.

## Legal · Marketing · Finance

**Neu seit 18:18: jede der drei Rollen hat jetzt ein zugewiesenes leeres
Gate-1-Feld.** Das war der Grund für die Stille, nicht fehlende Arbeit.

* **Legal — Punkt 7.13:** KI-Anbieter-Nutzungsbedingungen (OpenAI/Whisper).
  Reine Lesearbeit mit Urteil. **Wenn alles passt, mit Fundstelle sagen** —
  dann sind 100 Punkte ohne eine Zeile Code geholt. Daneben unverändert offen:
  die Erreichbarkeit der Impressumsadresse (drei Fragen in eurer Datei).
* **Marketing — Punkt 9.1:** Landingpage. Erst ansehen und ehrlich bewerten,
  dann benennen, was fehlt, **dann** ein Entwurf gemeinsam mit dem Designer.
  Keine fertige Seite — Sandy will den Text mitgestalten.
* **Finance — Punkte 4.7 und 11.4:** E-Rechnungs-Empfang der eigenen
  Buchhaltung, und das getrennte Geschäftskonto (Einschätzung, keine
  Umsetzung; **keine Empfehlung ohne Preis**).

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
