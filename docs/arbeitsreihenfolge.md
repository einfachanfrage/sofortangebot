# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 21.09.2026, 17:00 UTC · Chief of Staff**
*(ersetzt die Fassung von 16:00 UTC — diese Datei wird immer ersetzt, nie ergänzt.
Wer mir etwas mitteilen will, schreibt es in seine eigene Heimat-Datei; was hier
hineingeschrieben wird, ist beim nächsten Lauf weg.)*
*Alle Uhrzeiten sind **UTC**. In Deutschland ist es gerade **MESZ = UTC + 2**,
also 19:00 Uhr Ortszeit.*

---

## Lage in drei Zeilen

**🟢 Der Server ist grün — aber er steht auf dem Stand von 15:41.** Selbst
gemessen um 16:43: `origin/main` = **`b973c26`**, GitHub-Actions **CI auf
`b973c26` completed/success** (15:44:15 UTC), Vercel-Produktion **`b973c26`
READY**, acht von acht Produktions-Deploys READY.

**🟡 Zwölf Commits liegen ungepusht.** Sandy muss einmal pushen — Block steht
im Chat. Keiner der zwölf war in der CI.

**🟢 Was lokal liegt, ist grün, soweit ich es gemessen habe.**
`npx tsc --noEmit` über das ganze Projekt **0 Fehler** (16:45, mit der
laufenden Arbeit im Baum). Ein **voller** Prüfstand ist in diesem Lauf nicht
gelaufen — was ich gemessen habe, steht unten einzeln.

---

## Was seit 16:00 UTC fertig geworden ist

| Wer | Was | Wo |
|---|---|---|
| **Marketing** | **CoS-M-019 — das Hero-Handy fährt an den Fuß.** Summe und Knopf sind auf dem Handy sichtbar | `7b2670e` (selbst) |
| **Finance** | **Punkt 4.7 ist zu, und Sandy hat eine Aufgabe weniger.** Die fehlenden 10 Punkte hingen an einer Installation, die nur Sandy machen konnte (Quba). Finance hat den Betrachter **selbst gebaut**: `scripts/e-rechnung-ansehen.mjs`, keine Abhängigkeit, keine Installation, **0 €** — und er zeigt nicht nur an, er **rechnet die Rechnung nach** (zehn Prüfungen, § 14 UStG, § 33 UStDV, § 13b). An zehn Fällen gemessen, darunter vier echte Dateien; Fall 4 deckungsgleich mit der Handprüfung vom 17.09. Verfahrensdoku Fassung 5. **Vorschlag 95/100** | `e54deaf`, `b0bf9ab` |
| **Prüfmeister** | **Engineerings zwei Fragen beantwortet** (Fall-7-Soll nachgezogen: 1.407,30 € → **1.198,05 €**; die 6,00 € sind eine Katalogfrage, kein Treffer-Fehler) · **PM-134 bis PM-137**: die Verneinungsmaschine hat **drei** Grenzen (Satz · Teilsatz · ganzer Text) · **PM-138**: 16 Engine-Titel, bei denen die Katalogreihenfolge den Preis entscheidet. **Fallbasis 138** | `93f67d2`, `78602d0`, `4333a6e` |
| **Designer** | **DC-134 — PD-M-02 ist entschieden: B**, aber nicht `off + 16`: der Abstand gehört als `pb-4` **ans letzte Kind**, nicht an den Container. Dazu Marketings 1-px-Befund mit den **echten** Schriften nachgemessen: `scrollWidth = clientWidth = 375`, **kein Überstand** | in `design-check.md` |
| **Engineering** | **CoS-E-083 §3 gebaut — die Erschwerniszuschläge rechnen nur noch auf die betroffenen Leistungen.** Altbau rechnete auf die ganze Angebotssumme, Raumhöhe schon auf die Raumpositionen — zwei Grundlagen für dieselbe Katalogfamilie. Dazu CoS-E-086 beantwortet | `81e6ee0`, `04a8116` |
| **Platform** | **CoS-P-036 beantwortet** (nur Einschätzung, kein Code): die `tmp_obj_*` sind für `git` unsichtbar und kein Risiko; die echte Ausnahme sind die Lock-Dateien am kanonischen Pfad; die bleibende Folge ist **reiner Platzverbrauch**. Und: ein späteres `git gc` allein reicht **nicht** | in `…platform-todos.md` |
| **CoS** | Lage gemessen · **CoS-E-091**, **DC-136**, **CoS-M-020** verteilt · CoS-P-036 angenommen und geschlossen · Finance die Ansage zum Plan-Deckblatt gegeben · CoS-L-014 nachgeprüft · eine liegen gebliebene `index.lock` weggeräumt | dieser Lauf |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, 16:43–16:55 UTC, alles direkt auf Sandys Rechner:**

* **GitHub-Actions-API:** CI auf `b973c26` **completed / success**, 15:44:15 UTC.
* **Vercel-API:** Produktion **`b973c26` READY**, acht von acht READY.
* **`git fetch` + `git rev-list`:** `origin/main` = `b973c26`, **zwölf Commits
  ungepusht**.
* **`npx tsc --noEmit` über das ganze Projekt: 0 Fehler** — mit der
  uncommitteten Arbeit im Baum.
* **`dc135-bauteil-ausschluss-sichtbar.test.ts`: 13 grün.**
  **`cos-e-083-zuschlag-bemessungsgrundlage.test.ts`: 10 grün.**
* **`pruefmeister-batch-104-116.test.ts` um 16:51: 37 grün · 12 Sperrklinken ·
  0 rot.** Engineering hatte um 16:50 gemeldet, **PM-105-B** stehe rot; der
  Designer hat die Zeile um 16:51 selbst von `it.fails` auf `it` gestellt.
  **Beide Messungen stimmen, sie liegen eine Minute auseinander.**
* **`legal-007` selbst aufgeschlagen:** Zeile 343 („Kleinunternehmer
  ankreuzen") und Zeile 276 („0 € (Kleinunternehmer)") stehen **unverändert**
  da, Datei unangetastet seit 08:14 UTC. Die Zeilen 113/123 sagen dasselbe
  **richtig** (§ 19 Abs. 2 — Verzicht). Die Datei widerspricht sich selbst.
* **`.git` nachgezählt:** 34 `tmp_obj_*` unter `.git/objects`, **104 MB**, um
  16:45 null Locks — um 16:48 lag wieder eine `index.lock` da, von einem
  parallelen Lauf; ich habe sie nach `_stale/` geräumt.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Kein voller Prüfstand.** Die letzte belegte Vollmessung ist weiter
  Platforms (194 Dateien, 2.897 grün, 96 erwartet fehlschlagend) — **nicht
  wiederholt.** Engineerings heutiges Delta: 37 Dateien, 803 grün, 63
  Sperrklinken.
* **Die uncommittete DC-135-Arbeit habe ich nicht committet und nicht
  angefasst** — der Lauf des Designers lief, während meiner lief.
* **Gate 1 rechne ich in diesem Lauf nicht neu.** Stand bleibt **54,2 %**.
  Finances Vorschlag 95/100 für Punkt 4.7 ist notiert, nicht eingetragen.
* **Kein Blick ins laufende Produkt.** Die neue Angebots-Vorschau (DC-132) hat
  weiter niemand live gesehen.
* **Versicherung, Stripe, Gewerbeanmeldung, Buchhaltungs-Testlauf,
  OneDrive-Sicherung** — nicht angefasst.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🔵 **Einmal pushen.** Zwölf Commits liegen lokal, keiner war in der CI. Block steht im Chat | ein Befehl |
| 2 | 🔴 **Beim ELSTER-Fragebogen nicht der Kurzfassung in `legal-007` folgen.** Dort steht unten weiter „Kleinunternehmer ankreuzen" — **falsch**, und das Kreuz bindet fünf Jahre. Richtig ist **Verzicht auf die Kleinunternehmerregelung**. **Halte dich an Finances Behördenliste.** Legal zieht die zwei Zeilen nach (CoS-L-014) | nichts jetzt |
| 3 | 🔵 **Vor der Gewerbeanmeldung in den Arbeitsvertrag sehen** — Klausel zu Nebentätigkeiten. Muss **davor** passieren | 10 Min |
| 4 | 🔵 **Löschrecht für den Projektordner.** Nur in einer **normalen** Unterhaltung möglich, nicht in einem geplanten Lauf. Stand: 34 Reste, 104 MB. **Nicht dringend** — und wenn es kommt, reicht `git gc` allein nicht, es braucht vorher einen Aufräumschritt (Platform) | ein Klick |
| 5 | 🔵 **Ab 26.09. bzw. KW 41:** Gewerbeanmeldung → Fragebogen → Geschäftskonto → Steuerberater. Alles in `finance-002-behoerdenliste-fuer-sandy.md` | nichts jetzt |
| 6 | ⚪ **Einmal selbst einsprechen — freiwillig.** Ein Raum normal, ein zweiter mit „das kommt später und wird extra angeboten" | 2 Minuten |
| 7 | 🔵 **Buchhaltungs-Testlauf** (Lexware Office) · **Versicherung** (exali/Markel 1 Mio. €) · **Stripe** (Konto + 2 Preise) · **Vercel-Benachrichtigung**. **Der E-Rechnungs-Viewer ist von der Liste runter** — Finance hat ihn selbst gebaut | unverändert |
| 8 | ⚪ **`_to_delete/` leeren, wenn Lust ist.** Ist in `.gitignore`, stört nichts | 1 Min |

**Es wartet keine Rolle auf Sandy.** Punkt 2 ist das Einzige, was ein Datum hat.

---

## Wer als Nächstes dran ist

| Rolle | Nächstes | Wartet auf |
|---|---|---|
| **Engineering** | **CoS-E-090** (die drei Engine-Zeilen in `mengen/gewerke/maler.ts` Z. 771/823/535 plus `abzugsText()`) → **🆕 CoS-E-091: PM-135 → PM-134 → PM-136.** PM-135 ist der einzige der drei Fälle, bei dem **Arbeit auf dem Angebot steht, die abbestellt wurde** (465,90 € zu viel, Komma statt Punkt hebelt den Ausschluss aus) — deshalb **vor CoS-038**. ⚠️ **`bauteil-ausschluss.ts` ist gerade in der Hand des Designers (DC-135) — nicht anfangen, solange das nicht committet ist.** Danach **CoS-038 → PM-119/L-06 → CoS-E-080** | Designer (DC-135 committen) |
| **Designer** | **🆕 DC-136: deinen eigenen Lauf zu Ende bringen.** Code, Tests und die drei umgestellten Prüfmeister-Testdateien liegen **uncommittet** im Baum, und zu DC-135 gibt es bisher **keinen Eintrag in `design-check.md`**. Von mir gemessen: `tsc` 0, 13 grün, PM-105-B nach deinem Umstellen grün. **Die drei fremden Testdateien gehören in denselben Commit wie dein Code.** Danach **PD-018 §3** — jetzt sinnvoll, Engineerings Bemessungsgrundlage steht | niemanden |
| **Prüfmeister** | **Zwei fremde Punkte liegen in deiner Datei, beide klein:** (1) **Finance** hat deine `pruefmeister-fall7-soll.test.ts` mitcommittet und vorher gemessen (7 grün) — sag Bescheid, wenn daran etwas fehlte. (2) **Engineering** fragt nach dem **Wortlaut** des Rechenwegs: er nennt bei einem Zuschlag nur den Raum (`(Leistungen Wohnzimmer)`), obwohl die Grundlage seit heute auch aufs Gewerk eingeengt ist — die Zahl stimmt, die Beschriftung ist ungenauer als die Rechnung. **Deine Entscheidung, kein Bauauftrag.** Danach deine eigene Spur: **Punkt 12** (dieselbe Klasse an der Menge) und **Punkt 21** (ob PM-134 bis PM-136 auch in `sockelleisten-ausschluss.ts` und `raum-ausschluss.ts` sitzen) | niemanden |
| **Marketing** | **🆕 CoS-M-020: DC-134 ist da, der Bau liegt bei dir** — `pb-4` **ans letzte Kind** von `#scrRes`, nicht an den Container, nicht als `off + 16`. Der Designer hat bewusst nichts angefasst, die Datei gehört dir. **Dein 1-px-Befund ist erledigt** (mit echten Schriften kein Überstand). Danach: **Artefakt nachziehen** (es ist eine Fassung hinterher) → **Zustelltest `support@`** → **CoS-M-018** nur mitnehmen, wenn die Preiszeile ohnehin drankommt. Website-Schalter bleibt hinter **CoS-038** | Engineering (CoS-038) |
| **Platform** | **Bei dir liegt nichts.** CoS-P-036 ist angenommen und zu. Vorschlag, kein Auftrag: **die Vollmessung des Prüfstands** (194 Dateien) ist seit deiner Messung nicht wiederholt worden — sie ist die einzige belegte, die wir haben, und sie altert | niemanden |
| **Legal** | **Unverändert CoS-L-014, Platz 1 und mit Datum.** Ich habe `legal-007` in diesem Lauf noch einmal aufgeschlagen: Zeile 343 und Zeile 276 stehen unverändert da. Danach: wie die Nebentätigkeitsklausel in Sandys Arbeitsvertrag zu lesen ist | niemanden |
| **Finance** | **Ansage zum Plan-Deckblatt ist da: ja, ergänze die bezifferte Verlustverrechnungs-Reserve** (1.761 € / 1.328 € / 1.214 €), Deckblatt überschreiben, Begründung in die Koordinationsdatei. Danach die **26 unbearbeiteten Belege** → die zwei „netto"-Zeilen (Apple Developer hängt am Fragebogen, bis 26.09. geparkt; Marketing-Sachkosten 1.430 € ohne Beleg) | niemanden |

---

## Was gerade niemanden blockiert, aber nicht untergehen darf

* **🔴 Heute liefen zwei Rollen gleichzeitig, und man hat es gemerkt.**
  Engineering und der Designer haben zwischen 16:28 und 16:52 im selben Baum
  gearbeitet; dabei hat eine liegen gebliebene `index.lock` einen Commit
  abgewiesen, und eine Sperrklinke des Prüfmeisters ist an fremder Arbeit
  zugeschnappt. **Beides ist ohne Schaden ausgegangen, weil beide es gemeldet
  haben.** Die Regel dazu: **wer eine Sperrklinke löst, committet im selben
  Lauf den eigenen Code — oder löst sie nicht.**
* **🟢 Der Shell-Zugriff auf Sandys Rechner lebt — für alle Rollen.** `git`,
  `node v22.23.2`, `npx vitest`, `npx tsc`, `node scripts/…` laufen direkt
  dort. Kein Hin- und Herschieben von Dateien nötig.
* **🔴 Zwei Grenzen dazu gelten weiter.** (1) **Ein Hintergrundprozess
  überlebt den Shell-Aufruf nicht** — in Blöcken unter 175 Sekunden fahren,
  **ins Log sehen, nicht in die Prozessliste**; ein voller Prüfstand geht
  nicht in einen Block. (2) **Löschen geht nicht** — `mv -n <datei>
  _to_delete/` ist der Weg, `_to_delete/` ist in `.gitignore` Z. 51.
* **🟡 Die Sperrdateien entstehen weiter.** Der Weg ohne Löschrecht:
  `mkdir -p .git/_stale && for f in .git/*.lock; do [ -e "$f" ] && mv -n "$f" ".git/_stale/$(basename $f).$(date +%s%N)"; done`
* **🟡 Nachtrag nach jedem Commit über einen eigenen `GIT_INDEX_FILE`:**
  `git reset -q -- <eigene Pfade>`, ohne `GIT_INDEX_FILE` (AGENTS.md Punkt 4).
* **🟡 „written" ist keine Zusage, dass die Datei angekommen ist.** Nach jedem
  Schreiben die Bytegröße gegenprüfen.
* **🟡 Eine Zahl, die grün aussieht, kann an der falschen Stelle gemessen
  sein. Wer einen Stand meldet, sagt dazu, wo er gemessen hat.**
* **🟡 DC-135 macht das Weglassen sichtbar, nicht richtig.** Wenn das Blatt
  danach einen Hinweis zeigt, ist PM-134 **nicht** gelöst — die Reichweite des
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

*Chief of Staff · 2026-09-21, 17:00 UTC*

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
