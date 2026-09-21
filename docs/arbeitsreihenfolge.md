# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 21.09.2026, 17:50 UTC · Chief of Staff**
*(ersetzt die Fassung von 17:00 UTC — diese Datei wird immer ersetzt, nie ergänzt.
Wer mir etwas mitteilen will, schreibt es in seine eigene Heimat-Datei; was hier
hineingeschrieben wird, ist beim nächsten Lauf weg.)*
*Alle Uhrzeiten sind **UTC**. In Deutschland ist es gerade **MESZ = UTC + 2**,
also 19:50 Uhr Ortszeit.*

---

## Lage in drei Zeilen

**🟢 Der Server ist grün — und steht weiter auf dem Stand von 15:41.** Selbst
gemessen um 17:44: `origin/main` = **`b973c26`**, GitHub-Actions **CI auf
`b973c26` completed/success** (15:44:15 UTC, Lauf 228), Vercel-Produktion
**`b973c26` READY**, zehn von zehn Produktions-Deploys READY.

**🟡 Neunzehn Commits liegen ungepusht** (um 17:00 waren es zwölf; siebzehn
um 17:44 gemessen, dazu die zwei Commits dieses Laufs). Sandy muss einmal
pushen — Block steht im Chat. **Keiner der neunzehn war in der CI.**

**🟢 Die Vollmessung des Prüfstands ist wieder aktuell — aber am gepushten
Stand.** Platform hat sie nachgeholt: **198 Dateien, 2.955 grün, 99 erwartet
fehlschlagend, 0 unerwartet rot** — gemessen an **`b973c26`**, nicht an den
siebzehn Commits darüber.

---

## Was seit 17:00 UTC fertig geworden ist

| Wer | Was | Wo |
|---|---|---|
| **Designer** | **DC-135 committet** (der abbestellte Bauteil-Wegfall ist sichtbar) · **DC-137 gebaut: die Bemessungsgrundlage eines Zuschlags überlebt den Rechenweg-Schalter.** Bei abgeschaltetem Rechenweg blieb in der Zuschlagszeile nur `20 % × 23,01 €` stehen — Euro je Prozentpunkt, nichts, was ein Kunde nachmessen kann. Jetzt bleibt die Grundlage stehen. **PD-018 §3 beantwortet.** 12 Prüfungen grün, Delta über 20 Dateien 271 grün / 0 rot | `7f9f0b5`, `511109c` |
| **Engineering** | **CoS-E-090 erledigt — und die Begründung meines Auftrags widerlegt.** Der englische Rechenweg stand **nicht** auf dem Kundenpapier, sondern in der App des Handwerkers; das Kundenpapier läuft seit DC-055 durch den deutschen Formatter. Gebaut an der Ausgabe (`mitDeutschenZahlen()` an beiden Renderstellen), **nicht** in den drei Engine-Zeilen. `tsc` 0, 61 Dateien 984 grün / 0 rot | `e1b7c76`, `390a6ea` |
| **Platform** | **Vollmessung des Prüfstands nachgeholt** (war ein Vorschlag, kein Auftrag). Am frisch geklonten `b973c26`, exakt die CI-Schritte: **198 Dateien, 2.955 grün, 99 erwartet fehlschlagend, 0 unerwartet rot**, 122,6 s. Kein Code angefasst | uncommittet gefunden, von mir committet |
| **CoS** | Lage gemessen · **CoS-E-090 abgenommen** (kein Engine-Weg) · **🆕 CoS-E-092** und **🆕 DC-138** verteilt · Platforms Vollmessung übernommen und committet · eine liegen gebliebene `index.lock` weggeräumt | dieser Lauf |

---

## 🔴 Der eine neue Fund dieses Laufs — eine Falle, die noch nicht zugeschnappt ist

Der Designer hat als Nebenbefund gemeldet: `zuschlagBerechnungsweg()`
(`src/lib/zuschlag-basis.ts` Z. 168) schreibt die Grundlage **ohne
Tausenderpunkt** — auf dem Kundenpapier steht `20 % auf 2301,14 €` und
**direkt daneben in der Betragsspalte `2.301,14 €`**. Dieselbe Zahl, zwei
Schreibweisen, eine Zeile auseinander.

**Die naheliegende Reparatur macht dabei etwas kaputt.** Ich habe
`mitDeutschenZahlen()` um 17:45 auf Sandys Rechner mit `node` gegen die
Zeichenkette laufen lassen:

| Eingabe | Ausgabe |
|---|---|
| `20 % auf 2301,14 €` | unverändert — **heute in Ordnung** |
| `20 % auf 2.301,14 €` | **`20 % auf 2,301,14 €`** |
| `Umfang 19 lfm × 2.5 m` | `… × 2,5 m` (richtig) |
| `11.09.2026` | unverändert (richtig) |

Die Regel `\d+(?:\.\d+)+` unterscheidet einen Tausenderpunkt nicht von einem
Dezimalpunkt — und seit `e1b7c76` läuft genau dieser String in der App durch
diese Hilfe. **Wer nur Z. 168 repariert, repariert das Kundenpapier und macht
die App im selben Zug kaputt.** Deshalb ist **CoS-E-092** ein Auftrag über
zwei Dateien, kein Einzeiler. Engineering hat die Voraussetzung in E-090-G
selbst benannt („keine Rechenweg-Stelle erzeugt eine gruppierte Zahl") —
CoS-E-092 ist der Punkt, an dem diese Voraussetzung wegfällt.

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, 17:42–17:50 UTC, alles direkt auf Sandys Rechner:**

* **GitHub-Actions-API:** CI auf `b973c26` **completed / success**, 15:44:15 UTC.
* **Vercel-API:** Produktion **`b973c26` READY**, zehn von zehn READY.
* **`git fetch` + `git rev-list`:** `origin/main` = `b973c26`, **17 Commits ungepusht**.
* **`node scripts/docs-sichern.mjs pruefen`: alle 59 Doku-Dateien in Ordnung** —
  vor und nach meinen Änderungen.
* **`mitDeutschenZahlen()` mit `node` gegen vier Zeichenketten** — die Tabelle oben.
* **`zuschlag-basis.ts` Z. 168 und `zahlen-text.ts` selbst aufgeschlagen.**
* **`legal-007` zum dritten Mal selbst aufgeschlagen:** Zeile 342
  („Kleinunternehmer ankreuzen") und Zeile 276 („0 € (Kleinunternehmer)")
  stehen **unverändert** da, Datei unangetastet seit 08:14 UTC. **CoS-L-014
  ist weiter offen.**
* **Eine `index.lock` lag da** und ist nach `.git/_stale/` geräumt.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Ich habe in diesem Lauf keinen Test und kein `tsc` gefahren.** Die Zahlen
  oben sind Platforms (am gepushten Stand), Engineerings und des Designers
  (je am eigenen Stand). **Für den lokalen Stand `390a6ea` gibt es keine
  Vollmessung.**
* **Gate 1 rechne ich nicht neu.** Stand bleibt **54,2 %**. Finances Vorschlag
  95/100 für Punkt 4.7 ist weiter notiert, nicht eingetragen.
* **Kein Blick ins laufende Produkt.** DC-132 (neue Vorschau) und DC-137 (PDF
  mit abgeschaltetem Rechenweg) sind durch Tests belegt, nicht durch ein Blatt
  in der Hand. Das gilt jetzt seit vier Läufen.
* **Versicherung, Stripe, Gewerbeanmeldung, Buchhaltungs-Testlauf,
  OneDrive-Sicherung** — nicht angefasst.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🔵 **Einmal pushen.** Neunzehn Commits liegen lokal, keiner war in der CI. Block steht im Chat | ein Befehl |
| 2 | 🔴 **Beim ELSTER-Fragebogen nicht der Kurzfassung in `legal-007` folgen.** Dort steht weiter „Kleinunternehmer ankreuzen" — **falsch**, und das Kreuz bindet fünf Jahre. Richtig ist **Verzicht auf die Kleinunternehmerregelung**. **Halte dich an Finances Behördenliste.** Legal zieht die zwei Zeilen nach (CoS-L-014, seit 08:14 unverändert) | nichts jetzt |
| 3 | 🔵 **Vor der Gewerbeanmeldung in den Arbeitsvertrag sehen** — Klausel zu Nebentätigkeiten. Muss **davor** passieren | 10 Min |
| 4 | 🔵 **Löschrecht für den Projektordner.** Nur in einer **normalen** Unterhaltung möglich, nicht in einem geplanten Lauf. **Nicht dringend** — und wenn es kommt, reicht `git gc` allein nicht, es braucht vorher einen Aufräumschritt (Platform) | ein Klick |
| 5 | 🔵 **Ab 26.09. bzw. KW 41:** Gewerbeanmeldung → Fragebogen → Geschäftskonto → Steuerberater. Alles in `finance-002-behoerdenliste-fuer-sandy.md` | nichts jetzt |
| 6 | ⚪ **Einmal selbst einsprechen — freiwillig.** Ein Raum normal, ein zweiter mit „das kommt später und wird extra angeboten" | 2 Minuten |
| 7 | 🔵 **Buchhaltungs-Testlauf** (Lexware Office) · **Versicherung** (exali/Markel 1 Mio. €) · **Stripe** (Konto + 2 Preise) · **Vercel-Benachrichtigung** | unverändert |
| 8 | ⚪ **`_to_delete/` leeren, wenn Lust ist.** Ist in `.gitignore`, stört nichts | 1 Min |

**Es wartet keine Rolle auf Sandy.** Punkt 2 ist das Einzige, was ein Datum hat.

---

## Wer als Nächstes dran ist

| Rolle | Nächstes | Wartet auf |
|---|---|---|
| **Engineering** | **CoS-E-091 ist frei** (`bauteil-ausschluss.ts` ist seit `7f9f0b5` committet, die Sperre ist weg): **PM-135 → PM-134 → PM-136.** PM-135 ist der einzige der drei, bei dem **Geld auf dem Angebot steht, das abbestellt wurde** (465,90 € zu viel, Komma statt Punkt hebelt den Ausschluss aus). Danach **🆕 CoS-E-092** (Tausenderpunkt + `zahlen-text.ts` in EINEM Commit, siehe oben — klein, aber kundensichtbar), dann **CoS-038 → PM-119/L-06 → CoS-E-080**, der Beleg je Position (CoS-E-086) dahinter | niemanden |
| **Designer** | **🆕 DC-138: eine Zeile Antwort an Engineering.** Er hat `AngebotDetail.tsx` angefasst (vier Aufrufe `mitDeutschenZahlen()`, Commit `e1b7c76`) und bietet an, es zurückzunehmen. **Deine Datei, dein Wort.** DC-135 und DC-137 sind abgenommen, deine Spur ist sonst leer. **PD-021** wartet unverändert auf Engineerings Grundreihenfolge (CoS-038). Vorschlag, kein Auftrag: **das laufende Produkt hat weiter niemand angesehen** | niemanden |
| **Prüfmeister** | **Unverändert zwei fremde Punkte in deiner Datei:** (1) Finance hat deine `pruefmeister-fall7-soll.test.ts` mitcommittet und vorher gemessen (7 grün). (2) Engineering fragt nach dem **Wortlaut** des Zuschlags-Rechenwegs (`(Leistungen Wohnzimmer)` ist ungenauer als die Rechnung, seit die Grundlage auch aufs Gewerk eingeengt ist). **Neu dazu:** der Designer hat in DC-137 bewusst **nichts** am Wortlaut geändert — was immer du entscheidest, erscheint ohne weitere Arbeit auch in der abgeschalteten Fassung. Danach deine eigene Spur: **Punkt 12** und **Punkt 21** | niemanden |
| **Marketing** | **Unverändert CoS-M-020: DC-134 ist da, der Bau liegt bei dir** — `pb-4` **ans letzte Kind** von `#scrRes`, nicht an den Container, nicht als `off + 16`. Danach: **Artefakt nachziehen** → **Zustelltest `support@`** → **CoS-M-018** nur mitnehmen, wenn die Preiszeile ohnehin drankommt. Website-Schalter bleibt hinter **CoS-038** | Engineering (CoS-038) |
| **Platform** | **Bei dir liegt nichts.** Deine Vollmessung ist angenommen und abgelegt. Vorschlag, kein Auftrag: **sobald Sandy gepusht hat, dieselbe Messung am neuen `origin/main`** — deine Zahl gilt für `b973c26`, nicht für die neunzehn Commits darüber | Sandy (Push) |
| **Legal** | **Unverändert CoS-L-014, Platz 1 und mit Datum.** Ich habe `legal-007` auch in diesem Lauf aufgeschlagen: Zeile 342 und Zeile 276 stehen unverändert da, Datei seit 08:14 unangetastet. Danach: wie die Nebentätigkeitsklausel in Sandys Arbeitsvertrag zu lesen ist | niemanden |
| **Finance** | **Unverändert: Plan-Deckblatt** (bezifferte Verlustverrechnungs-Reserve 1.761 € / 1.328 € / 1.214 €, Deckblatt überschreiben, Begründung in die Koordinationsdatei). Danach die **26 unbearbeiteten Belege** → die zwei „netto"-Zeilen (Apple Developer hängt am Fragebogen, bis 26.09. geparkt; Marketing-Sachkosten 1.430 € ohne Beleg) | niemanden |

---

## Was gerade niemanden blockiert, aber nicht untergehen darf

* **🟡 Die Vollmessung gilt für `b973c26`, nicht für den lokalen Stand.** 198
  Dateien / 2.955 grün / 99 erwartet fehlschlagend / 0 rot. Darüber liegen
  neunzehn ungemessene Commits, darunter CoS-E-083 §3, CoS-E-088, CoS-E-090,
  DC-132, DC-135, DC-137. **Wer „alles grün" sagt, sagt dazu, an welchem Stand.**
* **🔴 Zwei Begründungen des Chief of Staff waren falsch, die Fixes nicht.**
  CoS-E-088 und CoS-E-090 behaupteten beide, der englische Rechenweg stünde
  auf dem Kundenpapier. Er stand in der App. **Beide Fixes bleiben richtig,
  beide Begründungen waren meine.** Engineering hat nachgemessen statt
  übernommen — genau so ist es gedacht.
* **🟢 Der Shell-Zugriff auf Sandys Rechner lebt — für alle Rollen außer
  Platform.** `git`, `node v22.23.2`, `npx vitest`, `npx tsc`, `node scripts/…`
  laufen direkt dort. Platform kann auf diesem Mount weiterhin nur lesen und
  schreiben, nicht ausführen — deshalb misst Platform am geklonten Spiegel.
* **🔴 Zwei Grenzen gelten weiter.** (1) **Ein Hintergrundprozess überlebt den
  Shell-Aufruf nicht** — in Blöcken unter 175 Sekunden fahren, **ins Log
  sehen, nicht in die Prozessliste**. (2) **Löschen geht nicht** — `mv -n
  <datei> _to_delete/` ist der Weg, `_to_delete/` ist in `.gitignore` Z. 51.
* **🟡 Die Sperrdateien entstehen weiter.** Der Weg ohne Löschrecht:
  `mkdir -p .git/_stale && for f in .git/*.lock; do [ -e "$f" ] && mv -n "$f" ".git/_stale/$(basename $f).$(date +%s%N)"; done`
* **🟡 Nachtrag nach jedem Commit über einen eigenen `GIT_INDEX_FILE`:**
  `git reset -q -- <eigene Pfade>`, ohne `GIT_INDEX_FILE` (AGENTS.md Punkt 4).
* **🟡 „written" ist keine Zusage, dass die Datei angekommen ist.** Nach jedem
  Schreiben die Bytegröße gegenprüfen.
* **🟡 Eine Zahl, die grün aussieht, kann an der falschen Stelle gemessen
  sein. Wer einen Stand meldet, sagt dazu, wo er gemessen hat.**
* **🟡 DC-135 macht das Weglassen sichtbar, nicht richtig.** Zeigt das Blatt
  danach einen Hinweis, ist PM-134 **nicht** gelöst — die Reichweite des
  Ausschlusses stimmt weiter nicht. Das ist CoS-E-091.
* **🟡 Die live Preiszeile** (`PreiseSection.tsx`) nennt „0 €" und den
  Monatspreis **ohne jede Umsatzsteuerangabe** (§ 5a UWG). Kein
  Gate-1-Blocker. **CoS-M-018.**
* **🟡 „Der Browser in der Claude-App kommt an beide Adressen" stimmt nicht.**
  Er stimmt für `sofortangebot.app`, **nicht** für den Landingpage-Entwurf —
  der liegt hinter Vercel Deployment Protection (302 auf `vercel.com/login`).
* **🟡 Das Landingpage-Artefakt ist eine Fassung hinter der Datei.** Wer den
  Entwurf beurteilt, nimmt `docs/landingpage-entwurf.html`, nicht das Artefakt.
* **LR-17 ist die eigentliche Fußzeilen-Lücke, nicht DC-122.** Rechtsform,
  Registergericht, Registernummer, Vertretungsberechtigte kennt das Produkt
  bis heute nicht. Gebaut wird das in **CoS-E-057**.
* **PM-080 ist bewusst nicht mitgenommen worden.** Ohne Auslösewort entsteht
  weiter keine bepreiste Zeile.
* **Die Vollständigkeitsprüfung warnt beim Commit** (`pre-commit`, `exit 0`,
  blockiert nichts).
* **🟡 `ci.yml` hat ein BOM, und die CI läuft trotzdem grün.** Nicht angefasst.
* **Es gibt keine echten Betriebe — nur Sandys Testkonto.**
* **Die Landingpage bewirbt drei Buchhaltungs-Anbindungen. Es sind sieben.**
  Und dieselbe Anbindung heißt an zwei Stellen verschieden.
* **`lfdm` und `lfm` stehen auf derselben Angebotszeile.** Vor dem Umbenennen
  `dc050-rechenweg-pdf.test.ts` und `dc119-wandflaechen-konflikt.test.ts` ansehen.
* **`menge_unbekannt` ist bewusst nicht gebaut.** Offen, wer die Messung macht.

*Chief of Staff · 2026-09-21, 17:50 UTC*

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
