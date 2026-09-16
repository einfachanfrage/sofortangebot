# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 16.09.2026, 14:55 MESZ · Chief of Staff**
*(ersetzt die Fassung von 14:25 MESZ — diese Datei wird immer ersetzt, nie ergänzt.)*

---

## Lage in drei Zeilen

**PM-098 ist gebaut — der zweite schwere Fund aus Sandys Einsprech-Lauf, am
selben Tag zu.** „Ein Fenster, eine Tür." erzeugt keine Lackierarbeit mehr:
mit dem Satz entsteht dieselbe Liste wie ohne ihn. **Damit sind PM-099 und
PM-098 beide erledigt** — die zwei teuersten Funde des Laufs.

**Der Designer hat PD-016 Punkt 1 beantwortet (DC-112).** Der einzige Punkt,
an dem Engineering beim Designer hing, ist frei. **PM-085 ist ab sofort
baubar.**

**Sandys Stand vom 14:38-Push ist drin** (`1cb58cd`, Vercel-Produktion
`READY`). Danach ist neue Arbeit dazugekommen: **PM-098 liegt uncommittet.**

---

## Was seit 14:25 MESZ passiert ist

| Rolle | Ergebnis | Status |
|---|---|---|
| Sandy | **`9173e76` und `1cb58cd` gepusht** — PM-099-Code, DC-111, CoS-P-027, DC-109, DC-112 sind im Repository | ✅ erledigt |
| Sandy | Vercel-Produktion `1cb58cd`, **`READY`** (14:38 MESZ) — selbst über die Vercel-API gemessen | ✅ erledigt |
| Engineering | **PM-098 gebaut** — `auftragGiltFuer` in `vollstaendigkeit/helpers.ts`, 11 neue Zusicherungen, Gegenprobe über alle 142 Prüfstände | ✅ erledigt, **uncommittet** |
| Engineering | **CoS-E-071 Punkt 1 gemessen statt angenommen:** PM-098 lief **nicht** mit PM-099 mit — getrennt gebaut | ✅ erledigt |
| Designer | **DC-112 — runder Raum: Rückfrage mit Vorschlag.** PD-016 Punkt 1 beantwortet | ✅ erledigt |
| Designer | **DC-109 umgesetzt** — die drei Sätze der „Abrechnung"-Karte, Wortlaut B, genau drei Zeilen geändert | ✅ erledigt |
| CoS | **CoS-E-072** — PM-098 abgenommen, DC-112 an Engineering übersetzt, Reihenfolge nachgezogen | verteilt |
| CoS | **PM-079-A: Widerspruch offen gelegt statt glattgezogen** — Sperrklinke bleibt stehen | verteilt |
| CoS | **Drei neue Soll-Fragen an den Prüfmeister** — „nicht tapezieren, nur streichen", „ein Holzfenster", „Und die Türen auch." | verteilt |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, nicht vermutet:**

* **Alle Dateien in `docs/` und in `src/lib/` nach Änderungszeit.** Jüngste
  Schreibzeit: **14:42 MESZ** (Engineering, PM-098). Daraus folgt der Stand
  „uncommittet" unten — nicht aus einer Meldung, sondern aus dem Vergleich mit
  Sandys Push-Zeit 14:38 MESZ.
* **Vercel-API:** Produktion `1cb58cd`, `READY`, erstellt 14:38 MESZ. Davor
  `9173e76` (14:21) und `5acb0bb` (14:09), beide `READY`.
* **Die Berichte selbst gelesen**, nicht die Übersichten: PM-098 und PM-099 in
  `chief-of-staff-engineering-todos.md`, der Live-Lauf in
  `pruefmeister-restliste.md`, DC-109/DC-112 in `design-check.md`.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **🔴 Die CI. Ich habe in diesem Lauf keinen einzigen Lauf gemessen.** Die
  gefilterte GitHub-Abfrage (`?branch=main`), die um 14:25 noch ging, hat
  **dreimal `403`** geliefert; die ungefilterte Seite bricht unverändert bei
  **#187** ab. **Über die Läufe nach `7ac44c3` sage ich nichts — weder grün
  noch rot.** Letzte belegte Messung bleibt #192/#193/#194.
  → **Das ist ein neuer Punkt für Platform, siehe CoS-P-022 unten.**
* **Gate 1 rechne ich weiterhin nicht neu.** Unverändert: ein Posten liegt vor
  (Sandys Einsprech-Lauf), **Manfreds Session 3 fehlt**. Gerechnet wird, wenn
  beide da sind — nicht in Teilen.
* **Versicherung, Stripe, Gewerbeanmeldung, Vercel-Benachrichtigung** — in
  diesem Lauf nicht angefasst.
* **Legal, Marketing, Finance** haben seit dem 15.09. bzw. 07.09. und 03.09.
  nichts geschrieben. Keine neuen Ergebnisse, also melde ich keine.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🔴 **Neuer Block im Chat** — committet den PM-098-Fix (4 Dateien) und drei Doku-Dateien | ein Block |
| 2 | 🟡 **CoS-P-013: ein Satz fehlt** — ging „Passwort speichern" durch und konntest du dich danach neu anmelden? | ein Satz |
| 3 | Vercel-Benachrichtigung · Versicherung · Stripe · Gewerbeanmeldung KW 41 (CoS-041) | unverändert, in diesem Lauf nicht neu geprüft |

**Keine Entscheidung wartet auf sie.**

### Nicht im Repository

```
src/lib/vollstaendigkeit/helpers.ts                                <- auftragGiltFuer
src/lib/vollstaendigkeit/maler-lackieren.ts                        <- Auslöser gebremst
src/lib/__tests__/pruefmeister-batch-47-56.test.ts                 <- PM-098-A umgestellt
src/lib/__tests__/pm098-oeffnung-ist-keine-beauftragung.test.ts    <- NEU, 11 Zusicherungen
docs/chief-of-staff-engineering-todos.md                           <- PM-098-Bericht + CoS-E-072
docs/pruefmeister-restliste.md                                     <- Engineering-Notiz + 4 CoS-Punkte
docs/arbeitsreihenfolge.md                                         <- in diesem Lauf ersetzt
```

Der Block committet den ganzen Ordner, offene Reste von anderen Rollen nimmt er
mit.

---

## Head of Product Engineering

1. ✅ **PM-098 ist abgenommen — CoS-E-069 Nachtrag ist zu.** Die Staffelung in
   vier Stufen ist die richtige Form, Stufe 1 („Lackier-Wort gar nicht im
   Rohtext → unverändert") genau die richtige Vorsicht. Ausdrücklich
   gutgeschrieben: ihr habt CoS-E-071 Punkt 1 **gemessen** statt angenommen —
   und das Ergebnis war das unbequeme.
2. 🟢 **PD-016 Punkt 1 ist beantwortet, CoS-E-068 Teil C ist frei.**
   **PM-085 ist ab sofort baubar.** Die vollständige Übersetzung von DC-112
   steht in **CoS-E-072** — Erkennung (`vage` bei Rundform-Wort ohne
   `laenge`/`breite`), Rückfrage mit Vorschlag, π-Rechnung nur für die Anzeige,
   und die harte Grenze: ein Raum ohne Fläche erzeugt einen **Fehlt-Eintrag**,
   nie null Positionen und null Einträge.
3. 🔴 **PM-079-A: Sperrklinke stehen lassen, nicht bauen.** Euer Prüfstand
   (zwei Räume, 112 vs. 65 m²) und die Entwarnung des Prüfmeisters (ein Raum
   über 65 m²) meinen nicht dasselbe. Der Widerspruch liegt beim Prüfmeister
   als offene Doku-Lücke — bis dort ein Satz steht, bleibt er rot.
4. 🔴 **Zug 3 läuft weiter mit PM-072 → PM-074 → PM-079.** PM-098 und PM-099
   sind raus, beide gebaut.
5. **Zug 2:** PM-089, 090, 091, 093, 096, 097 — **und jetzt PM-085 mit dazu**.
   **Vor dem Bauen die drei Warnungen in CoS-E-069 lesen, besonders PM-090.**
6. **Zahlen-Zug:** PM-092, PM-095, **CoS-E-070 Teil A** (eine Quelle für das
   Fischgrät-Muster). Teil B (5 % oder 15 %) hängt an CoS-E-054, nicht hier.
7. **Danach CoS-E-061.**
8. **Die drei Fälle, die ihr beim Messen gefunden habt, liegen beim
   Prüfmeister** — „ein Holzfenster", „Und die Türen auch.", und der
   `Tapete tapezieren`-Fund. Alle drei sind Soll-Fragen. **Nichts davon hängt
   bei euch.**
9. **LR-19 / L-MAIL-01** — kein `reply_to` in den Mails an den Endkunden.
   Bauauftrag von Legal, hängt an **CoS-E-057**. Keine Frage an euch.
10. **CoS-E-057 (§ 35a)** — CoS-L-008 ist geliefert, bauen möglich. Migration
    **und** Eintrag in `check_migrationen.sql`.
11. **CoS-E-053** weiterbauen, mit den vier Legal-Bedingungen. Preisanpassungs-
    Hinweis nicht aufs Kunden-PDF vor Sandys Freigabe (LR-16).
12. **CoS-E-063** — Heizkörper. **CoS-E-060** — offen: welche Datei speist die
    Oberfläche, `preis-ableitung.ts` oder `materialanteil.ts`?
13. **CoS-E-067** — `no-explicit-any`-Aufräumrunde, eigener Lauf, ganz hinten.
14. ⚠️ **Die CI ist in diesem Lauf nicht gemessen worden.** Der Satz von 14:25
    („wieder ein verlässliches Signal") gilt weiter für #192–#194, aber die
    Läufe danach kenne ich nicht. **Verlasst euch bis auf Weiteres auf eure
    eigene Gegenprobe, nicht auf die CI-Anzeige.**

## Product Designer

1. ✅ **DC-112 ist angekommen und weitergereicht.** Die Entscheidung
   „Rückfrage mit Vorschlag statt leerem Angebot" ist übersetzt und liegt bei
   Engineering. **Ihr habt damit Engineerings einzigen Wartepunkt aufgelöst.**
2. ✅ **DC-109 abgenommen.** Drei Zeilen, keine vierte, der CoS-P-009-Block von
   Platform unberührt, vorher frisch geholt — genau die zwei Auflagen.
3. 🔴 **Drei Punkte aus dem Live-Lauf, in dieser Reihenfolge** — Inhalt in
   **PD-018** (zweiter Block), Abgrenzung in `design-check.md`:
   **(a)** der Fassaden-Entwurf (leerer Raum mit 0,00 € unter der richtigen
   Fassade — Vorrang hoch, erster Kundenscreen) · **(b)** Nullzeilen mit Menge 0
   gehören nicht aufs Angebot · **(c)** der Prozentzuschlag ohne Bezugsgröße —
   **noch nicht bauen**, der Prüfmeister misst die Bemessungsgrundlage nach.
4. ⚠️ **Beim Fassaden-Entwurf:** der leere Raum selbst ist **nicht** euer
   Fehler, der kommt aus dem Phantomraum (L-02 / PM-053-A) bei Engineering.
   Eure Seite ist die Gruppierung. Nicht warten, aber auch nicht deren Aufgabe
   übernehmen.
5. **PD-018 erster Block, drei Fragen.** Punkt 2 liefert zugleich den Beleg für
   **PD-016 Punkt 2**. **Keiner der drei blockiert etwas.**
6. **Nachzuziehen, jetzt möglich:** die eine Stelle in `AngebotDetail.tsx`,
   bewusst ausgelassen.
7. **DC-102** freigegeben — Ablauf und Darstellung, **nicht die Zahlen**.
   Einbau hängt an CoS-E-053.
8. 🟢 **`docs/landingpage-fuenf-beispiele.md`: die Sperre ist gefallen.**
   Bedingung war „nicht live, bevor PM-098 UND PM-099 gebaut sind" — beide sind
   gebaut. **Eine Auflage bleibt:** Beispiel 4 umgeht PM-098 heute dadurch, dass
   Fenster und Tür nicht im Satz stehen. Diese Krücke gehört raus, bevor die
   Seite live geht — der Fehler dahinter ist weg.
9. 🟠 **DC-111 — die beiden Passwort-Seiten haben kein Desktop-Layout.** Fünf
   Stellen mit Zeilennummern in `design-check.md`. **Hinter PD-018
   einsortieren.** Zweiter Punkt derselben Datei: das Emoji 📬 als Bildmarke —
   Frage an euch, keine Ansage.
10. **Live-Test von DC-105 / DC-101 / DC-103 / DC-104 / DC-089 / DC-047 /
    DC-048** — braucht Sandy am Rechner.

## Platform

1. 🆕 🔴 **CoS-P-022 hat einen neuen, harten Anlass: die GitHub-Abfrage ist
   heute dreimal mit `403` zurückgekommen** — dieselbe gefilterte Form
   (`?branch=main`), die vor einer halben Stunde noch funktioniert hat. Ohne
   sie ist die CI für uns **blind**: die ungefilterte Seite bricht bei #187 ab.
   **Das ist jetzt der Kern von CoS-P-022** — wir brauchen einen Weg, den
   CI-Stand verlässlich zu lesen, der nicht an einer ungezählten Abfrage hängt.
2. ✅ **CoS-P-026 ist vollständig zu.** #192/#193/#194 grün gemessen,
   inklusive Produktions-Build.
3. 🔴 **CoS-P-025 — die Schrumpf-Prüfung, und sie deckt jetzt auch
   `.github/workflows/` ab.**
4. 🔴 **CoS-P-024 — der Push-Hook wird ersatzlos abgeschafft.** Sandys
   Anweisung. **Noch nicht als umgesetzt eingetragen.**
5. 🟢 **CoS-P-027 ist entschieden: C.** Zwei Absender. Die Zuordnung aller acht
   Versandwege steht fertig in Nachtrag 1 — ihr müsst nichts ableiten. Zwei
   Punkte nicht übersehen: `hallo@sofortangebot.app` muss zustellbar sein
   (falls nicht: **melden**, nicht still auf `sandra@` zurückfallen), und die
   `Sandra`-Signaturen im Fließtext der Marken-Mails ziehen im selben Zug mit.
6. **CoS-P-013** — der letzte Rest ist Sandys Klick-Durchlauf, kein Code. Die
   ersten drei Schritte sind über ihre Bildschirmfotos belegt.
7. **CoS-P-005** — die fehlende RLS-Policy für den Logo-Upload.
8. ✅ **CoS-P-020 und CoS-P-021 sind zu.**
9. **DC-109 ist gebaut.** Der Designer hat die Datei vor dem Schreiben frisch
   geholt; euer CoS-P-009-Kommentarblock und der Hinweisabsatz darunter sind
   unverändert drin — nachgelesen, nicht angenommen.

## Prüfmeister

1. ✅ **PM-099 und PM-098 sind beide gebaut** — die zwei schwersten Funde eures
   Live-Laufs, am selben Tag. Bei PM-098 sind eure zwei Sperrklinken umgestellt;
   dort sind noch **7** offen statt 9.
2. 🔴 **PM-079-A — ihr müsst einen Satz sagen.** Eure Entwarnung (ein Raum,
   65,00 m², live belegt) und Engineerings Prüfstand (zwei Räume, Soll 112 m²,
   Ist 65 m²) meinen nicht dasselbe. **Ich habe den Widerspruch als offene
   Doku-Lücke eingetragen statt ihn glattzuziehen.** War die Entwarnung auf den
   Einzelraum gemeint, oder auf beides? Bis dahin baut Engineering nicht.
3. 🆕 **Drei neue Soll-Fragen, alle in `pruefmeister-restliste.md`:**
   **(a)** „Die Wände **nicht tapezieren, nur streichen**." → `Tapete
   tapezieren` über 45,00 m² steht trotzdem im Entwurf. Dieselbe Klasse wie
   PM-099, eine Stufe schwerer, Vorrang aus meiner Sicht hoch ·
   **(b)** „Ein **Holzfenster**, eine Tür." — Material schon Beauftragung, oder
   wie „ein Fenster" nur Bestand? · **(c)** „Heizkörper lackieren. **Und die
   Türen auch.**" — die Tür fällt jetzt weg; bewusster Preis der Regel, aber
   euer Soll.
4. 🔴 **Doku-Lücke in `einsprech-liste-alle-faelle.md`, weiterhin offen.**
   Übersicht und Restliste stimmen überein — die Haken bei den Einzelfällen und
   die zwei Live-Ergebnis-Blöcke sind je einen Fall verrutscht. **Kein
   Zahlenfehler, nur die Zuordnung.**
5. 🔴 **`docs/pruefmeister-einsprechen-47-56.md` vom 15.09. liegt weiter neben
   der neuen Liste.** Parallelstand, den Sandys Datei-Regel ausschließt: bitte
   durch einen Verweis ersetzen.
6. **Nachzumessen, vorgemerkt von euch selbst:** 15 % **wovon**? Der Designer
   baut PD-018 Punkt (c) nicht, bevor diese Zahl dasteht.
7. **Fallbasis 98/100.** Die letzten zwei Fälle, ohne App prüfbar:
   Selbstkorrektur mitten im Satz · Kunde redet im Hintergrund dazwischen ·
   Aufnahme bricht ab und wird fortgesetzt.
8. **Die 142 Vorlagen der gesperrten Gewerke** — jeweils vor der Freischaltung.

## Legal · Marketing · Finance

**In diesem Lauf nichts Neues von mir, und nichts Neues von euch** — eure
Dateien sind seit dem 15.09. (Legal), 07.09. (Marketing) und 03.09. (Finance)
unverändert. Eure offenen Punkte stehen dort.

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
