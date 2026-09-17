# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 17.09.2026, 17:00 UTC · Chief of Staff**
*(ersetzt die Fassung von 16:00 UTC — diese Datei wird immer ersetzt, nie ergänzt.)*
*Alle Uhrzeiten in dieser Fassung sind **UTC**. In Deutschland ist es gerade
**MESZ = UTC + 2**, also 19:00 Uhr Ortszeit.*

---

## Lage in drei Zeilen

**🟢 Produktion grün, CI grün, beides gemessen.** Deploy `8d07102` ist READY,
CI-Lauf **#213 auf `8d07102` ist success** (15:50:28 UTC). Damit ist der gelbe
Punkt der letzten Fassung („die CI ist nicht messbar, zweimal 403") **erledigt**
— die 403 waren zeitweise, die Läufe #211, #212 und #213 sind alle grün.

**🔵 Es liegen wieder 5 Commits ungepusht hier** — alle reine Doku, seit Sandys
Push um 15:50 dazugekommen. `origin/main` = `8d07102`, `HEAD` = `f345447`.

**🔴 Zwei teure Zahlen statt einer.** PM-117 (543,84 € statt 2.980,44 € auf
jedem Bad) läuft bei Engineering. Neu dazu: **PM-132 — ein Nebensatz im Diktat
macht aus 457,25 € 9.277,25 €**, und das Kundenpapier nennt die erfundene Zahl
„aus Transkript". Das ist jetzt **CoS-E-081**.

---

## Was seit 16:00 UTC passiert ist

| Rolle | Ergebnis | Status |
|---|---|---|
| **Prüfmeister** | **Abendlauf fertig, Commit `f345447`** — PM-129/PM-130 (Marketings Hero-Bitte beantwortet), **PM-131/132/133** (Themenspeicher-Punkt 9 ganz), fünf neue Themenspeicher-Punkte (14–18), **PD-023** an den Designer. Fallbasis **133** | ✅ erledigt |
| **Designer** | **DC-126 Nachtrag** — `lfdm`/`lfm` pro Zeile entschieden: Mengenspalte `lfdm`, Rechenweg `lfm`. Zwei Zeilen in `landingpage-fuenf-beispiele.md` geändert, eine davon ungefragt mitgefunden | ✅ erledigt |
| **Marketing** | Meldung an Engineering: dieselbe Einheit heißt auf **derselben Angebotszeile** `lfdm` (Mengenspalte) und `lfm` (Rechenweg). Kein Auftrag, ein Wunsch: `lfdm` überall | ✅ gemeldet |
| **CoS** | **CoS-E-081 angelegt** — die `anzahlAus`-Familie als **ein** Auftrag, Vorrang direkt nach CoS-E-078 | ✅ verteilt |
| **CoS** | **CoS-M-014 angelegt** — die zwei Zahlen, die auf der Landingpage ändern müssen (17,10 lfdm gibt es nicht; eine vierte Zeile fehlt) | ✅ verteilt |
| **CoS** | **Themenspeicher-Punkt 18 aufgelöst statt weitergereicht** — die „nirgends beauftragte" Rückfrage nach der Höhe ist das Soll von PM-094 und hängt längst in Engineerings Zug 3. Kein zweites Ticket | ✅ erledigt |
| **Engineering** | **CoS-E-078 läuft weiter**, unverändert uncommittet im Arbeitsbaum | 🔄 läuft |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, nicht vermutet:**

* **GitHub-Actions-API, 16:47 UTC:** #213 `8d07102` **success** · #212
  `af32b14` success · #211 `a813d77` success · #210 `4d53e65` success · #209
  `deea290` failure. Kein 403 in diesem Lauf.
* **Vercel-API, 16:45 UTC:** jüngster Produktions-Deploy ist **`8d07102`,
  READY**. Seit 15:51:33 UTC kein neuer Deploy — es ist auch nichts gepusht
  worden.
* **`git fetch` + `git log`, 16:44 UTC:** `origin/main` = `8d07102`,
  **5 ungepushte Commits** (`f345447`, `c26b496`, `0bb4e64`, `dba736d`,
  `bd526aa`) — **alle nur Doku**.
* **Der Ort von CoS-E-081 im Code selbst aufgeschlagen:**
  `src/lib/vollstaendigkeit/helpers.ts`, `anzahlAus()` ab Zeile 175, drei
  Zweige. **17 Aufrufstellen** in `src/` außerhalb der Prüfstände — selbst
  gezählt, nicht aus der Meldung übernommen.
* **`node scripts/docs-sichern.mjs pruefen`:** „Alle 57 Doku-Dateien in
  Ordnung", nach dem Anhängen erneut.
* **Restliste, Themenspeicher, Notizen an den Designer, Engineering- und
  Marketing-Liste frisch gelesen**, bevor ich über sie berichtet habe.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Keine Prüfstände in diesem Lauf** — siehe den offenen Punkt unten.
* **Engineerings laufende Arbeit** — nicht angefasst, nicht gemessen.
* **Gate 1 rechne ich weiter nicht neu.** Stand bleibt **53,0 %**.
* **Versicherung, Stripe, Gewerbeanmeldung, Vercel-Benachrichtigung,
  Landingpage-Schalter, Sicherungslauf um 20:00 Uhr** — nicht angefasst.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🔵 **Einmal pushen.** 5 Commits liegen hier, alle reine Doku, nichts davon Code. Block steht unten im Chat | ein Befehl |
| 2 | 🔵 **Nach Italien, ab 26.09.:** Gewerbeanmeldung → Fragebogen zur steuerlichen Erfassung → Geschäftskonto → Steuerberater. Finance und Legal legen die Reihenfolge fertig hin | nichts jetzt |
| 3 | 🔵 **Buchhaltungs-Testlauf** (Lexware Office, fünf Minuten — schaltet den stärksten Satz der Landingpage frei) · **E-Rechnungs-Viewer** (Quba, 0 €) | nicht eilig |
| 4 | 🔵 **Versicherung** (exali/Markel 1 Mio. €) · **Stripe** (Konto + 2 Preise) · **Vercel-Benachrichtigung** · Gewerbeanmeldung KW 41 (CoS-041) | unverändert |
| 5 | 🔵 Heute Abend nach 20:00 Uhr einmal auf `onedrive.live.com` schauen, ob der erste **automatische** Sicherungslauf angekommen ist | ein Blick |

**Nichts davon ist rot, und nichts blockiert eine Rolle.** Neu dazugekommen ist
in diesem Lauf nur Punkt 1.

---

## Wer als Nächstes dran ist

| Rolle | Nächstes | Wartet auf |
|---|---|---|
| **Engineering** | **🔴 PM-117 + PM-060-A, zusammen** (CoS-E-078, läuft gerade). **Danach neu: CoS-E-081** — `anzahlAus`, drei Zweige zusammen, plus der falsche Herkunftstext „aus Transkript". Erst dann **PM-061-A → PM-062-A → CoS-038 → PM-119/L-06 → CoS-E-080**. Dazu liegt Marketings `lfdm`/`lfm`-Meldung in der Liste — eine Entscheidung, kein Auftrag | niemanden |
| **Designer** | **DC-127** — der dunkle Tabellenkopf (beide Vorschauen dunkel, PDF grau über dünner Linie). Auflage: nur eine der beiden Seiten ändern. Neu zum Lesen, ohne Auftrag: **PD-023** (die zwei Herkunftswörter „angenommen" und „aus Transkript" tragen ihr verschiedenes Gewicht heute nicht sichtbar). Danach **PD-021** (erst nach PM-119); Fußzeilenteil **DC-122** bleibt liegen, bis Legal antwortet | Legal (nur Fußzeile DC-122) |
| **Prüfmeister** | **Spur leer, Fallbasis 133.** Vorschlag von mir, seine Entscheidung: **Themenspeicher-Punkt 14** — alle Rechenwege gegen ihren Eingabetext messen („wie viele sagen *aus Transkript*, und bei wie vielen steht die Zahl wirklich im Transkript?"). **Punkt 17** (restliche Landingpage-Diktate) erst, wenn Marketing CoS-M-014 eingearbeitet hat | niemanden |
| **Legal** | **Zuerst L-KI-01 einbauen** (freigegeben, Wortlaut unverändert) und melden, wenn er drin ist; dabei prüfen, ob dieselbe Zusage noch woanders steht. Dann **CoS-L-011** (dürfen freie Fußzeilen die Pflichtangaben ersetzen — A/B/C?), dann **CoS-L-012** | niemanden |
| **Platform** | **Nichts zu bauen.** Nur der Termin **CoS-P-029:** am **19.09. nach 03:30 UTC** einmal `system_laeufe` prüfen (`aufnahmen.dateien > 0`?) | niemanden |
| **Marketing** | **🆕 CoS-M-014** — zwei Zahlen auf der Seite korrigieren (18,00 statt 17,10 lfdm; vierte Zeile `Boden schützen` 24,00 €, Gesamt 703,00 €), Diktat 2 nicht verwenden solange PM-094 offen ist. Danach Zustelltest `support@`. Der Website-Schalter darf erst nach **CoS-038** umgelegt werden | Engineering (CoS-038) · Sandys Buchhaltungs-Testlauf |
| **Finance** | **CoS-F-009** (Vorsteuer in die Kostenübersicht, Reverse-Charge auf „durchlaufend", Voranmeldungsrhythmus als Frage für den Steuerberater) · Behördenliste für Sandy bis 26.09. · **26 unbearbeitete Belege** · drei Fragen von mir: reicht OneDrive als zweiter Ort für die 8 Jahre? · gehört die Sicherung mit **Kontrolle am Zielort** in die Verfahrensdokumentation? · **CoS-F-008** · steigt Gate-1-Punkt 4.7 über die 40/100? | niemanden |

---

## Was gerade niemanden blockiert, aber nicht untergehen darf

* **🔴 PM-117 — 543,84 € statt 2.980,44 € auf einem gewöhnlichen Bad.**
  Sechs von neun Zeilen ohne Preis. CoS-E-078, in Arbeit.
* **🔴 PM-132 — „Wir liefern 50 Stück Fliesen dazu" macht 50 Türen.**
  8.820,00 € Unterschied auf einem normalen Malerdiktat, mit dem Rechenweg
  „50 Tür(en) **aus Transkript**" auf dem Kundenpapier. CoS-E-081, noch nicht
  angefangen.
* **🟡 Der volle Prüfstand ist seit 11:58 UTC nicht mehr durchgelaufen.**
  Nicht rot — **ungemessen**: `npx vitest run` hat im Abendlauf des
  Prüfmeisters nach gut vier Minuten aufgehört, Ausgabe zu schreiben, und lief
  danach sechzehn Minuten ohne eine weitere Zeile. Der letzte belegte volle
  Stand bleibt **2693 grün · 94 Sperrklinken · 0 rot**, und seither ist in
  `preis-matcher.ts`, `vollstaendigkeit/*` und zwei Testdateien gearbeitet
  worden. Wer „alles grün" sagt, meint 11:58 UTC. Beobachtung erbeten, kein
  Auftrag.
* **Uncommittet im Arbeitsbaum liegt Engineerings unfertiges CoS-E-078**
  (`preis-matcher.ts`, `vollstaendigkeit/fliesen-basis.ts`,
  `vollstaendigkeit/index.ts`, `cos-e-078-bad-wandpositionen.test.ts`, neu
  `src/lib/fliesen-richtung.ts`) **und die DC-127-Arbeit des Designers**
  (`AngebotVorschau.tsx`, `einstellungen/briefpapier/[id]/page.tsx`,
  `dc127-tabellenkopf.test.tsx`). **Das darf niemand mitnehmen.** `git add -A`
  bleibt abgeschafft.
* **Der Index ist bei fünf Rollen an einem Arbeitsbaum geteilt.** Zwischen
  `git add` und `git commit` gehört nichts als eine Sekunde; bei fremder
  `index.lock` einen eigenen Index benutzen (`GIT_INDEX_FILE`), Sperrdateien
  **verschieben**, nicht löschen.
* **Die Vollständigkeitsprüfung warnt beim Commit** (`pre-commit`, `exit 0`,
  blockiert nichts). Wer „ist committet" meldet, ohne die
  `[pre-commit]`-Zeilen gelesen zu haben, meldet einen Stand, der bei Vercel
  rot werden kann. Regel 5 in `AGENTS.md`.
* **🟡 `ci.yml` hat ein BOM, und die CI läuft trotzdem grün** — heute wieder
  belegt (#213 success). Nicht angefasst.
* **Es gibt keine echten Betriebe — nur Sandys Testkonto.** Wer über
  „betroffene Betriebe" schreibt, zählt sie vorher.
* **`briefpapiere.logo_url` ist eine leere Altlast**, keine Einstellung.
  CoS-E-080, ganz hinten.
* **Die 30-Tage-Löschzusage ist bis heute nie eingelöst worden.** Der erste
  Lauf, der wirklich löschen muss, ist der vom **19.09., 03:30 UTC**. Löscht er
  nichts, sind zwei veröffentlichte Rechtstexte unrichtig. **CoS-P-029.**
* **Die Sicherung läuft, der erste automatische Lauf steht heute Abend an.**
  Empfehlung an Finance bleibt: **Kontrolle am Zielort** ins Verfahren
  aufnehmen — ein Skript-Abbruch ersetzt sie nicht.
* **Git-Sperrreste und ein Worktree-Rest** (`.git/worktrees/alt`) liegen weiter
  da. Für git harmlos, `/_to_delete/` steht in `.gitignore`. Löschrecht
  anfordern geht in einem geplanten Lauf nicht — der Dialog braucht einen
  Menschen.
* **Die Landingpage bewirbt drei Buchhaltungs-Anbindungen. Es sind sieben.**
  Und dieselbe Anbindung heißt an zwei Stellen verschieden („Lexoffice" vs.
  „Lexoffice (Legacy)").
* **`lfdm` und `lfm` stehen auf derselben Angebotszeile.** Kein Geld daran, aber
  der Kunde sieht es auf dem PDF. Entscheidung liegt bei Engineering; vor dem
  Umbenennen `dc050-rechenweg-pdf.test.ts` und
  `dc119-wandflaechen-konflikt.test.ts` ansehen.
* **`menge_unbekannt` ist bewusst nicht gebaut.** Offen, wer die Messung macht.
* **Eine Datei, über die ich berichte, wird vorher gelesen. Eine Zahl, mit der
  ich ein Risiko begründe, wird vorher gezählt. Und ein „nirgends beauftragter"
  Punkt wird gesucht, bevor ich ein zweites Ticket dafür aufmache** — heute hat
  das letzte ein überflüssiges Engineering-Ticket verhindert.

*Chief of Staff · 2026-09-17, 17:00 UTC*
