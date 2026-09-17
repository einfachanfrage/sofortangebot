# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 17.09.2026, 12:45 UTC · Chief of Staff**
*(ersetzt die Fassung von 12:20 UTC — diese Datei wird immer ersetzt, nie ergänzt.)*
*Alle Uhrzeiten in dieser Fassung sind **UTC**. In Deutschland ist es gerade
**MESZ = UTC + 2**, also 14:45 Uhr Ortszeit.*

> **Korrektur an der Vorgängerfassung:** Sie trug die Überschrift „14:30 UTC"
> und die Zusicherung „alle Uhrzeiten sind UTC". Geschrieben wurde sie um
> **12:20 UTC** — 14:30 war die Ortszeit. Alle ihre Inhalte stimmen, nur die
> Kopfzeile war zwei Stunden zu spät. Ab jetzt steht die Ortszeit ausdrücklich
> daneben, damit die beiden nicht wieder verrutschen.

---

## Lage in drei Zeilen

**🟢 Die Produktion ist wieder grün — gemessen, nicht erwartet.** Sandy hat
gepusht, der Deploy auf `4d53e65` steht seit **12:19:26 UTC** auf **READY**,
CI-Lauf **#210** ist **success**. Rot war sie **68 Minuten** (11:10–12:19 UTC).

**🔴 Damit ist die teuerste Zahl des Projekts wieder die einzige, die zählt:**
auf einem gewöhnlichen Badangebot stehen **543,84 €, wo 2.980,44 € hingehören**
(PM-117). Sechs von neun Zeilen ohne Preis, jedes Bad, jeder Betrieb.
Engineering baut daran **gerade jetzt** — CoS-E-078.

**🔴 Der Push-Wächter, der die beiden roten Deploys verhindert hätte, ist auf
Sandys Rechner gar nicht eingehängt.** Gemeldet vom Designer, von mir
nachgesehen, Ursache gefunden: er wurde am 16.09. bewusst abgeschaltet
(CoS-P-024, ein BOM brach Sandys Push ab) und nie ersetzt. **Zweites Mal in
vier Tagen dieselbe Fehlerklasse.** Läuft als CoS-P-031 bei Platform.

---

## Was seit 12:20 UTC passiert ist

| Rolle | Ergebnis | Status |
|---|---|---|
| **Sandy** | **Gepusht** — `4d53e65` ist bei GitHub, Vercel und CI durch | ✅ Produktion repariert |
| **Vercel** | Deploy `4d53e65` **READY** um 12:19:26 UTC | ✅ gemessen |
| **CI** | Lauf **#210** auf `4d53e65`: **success**, 12:19:25 UTC | ✅ gemessen |
| **CoS** | **Der CI-Widerspruch vom Vormittag ist aufgelöst** — die GitHub-Abfrage lief in diesem Lauf ohne `403` durch. #206 auf `da7db10` war **grün**, die Zahl von 09:43 UTC stimmte | ✅ erledigt |
| **CoS** | **CoS-P-031 angelegt** — Push-Wächter fehlt, Ursache und Auflage in `chief-of-staff-platform-todos.md` | ✅ verteilt |
| **CoS** | **Beide Nebenbefunde des Designers beantwortet** (Push-Wächter · 265 Git-Sperrreste) in `design-check.md`; der dunkle Tabellenkopf bleibt bewusst aus DC-122 draußen | ✅ erledigt |
| **Engineering** | **CoS-E-078 / PM-117 ist in Arbeit** — `preis-matcher.ts`, `positions-gewerk.ts`, `katalog-standard.ts` und ein neuer Prüfstand `cos-e-078-bad-wandpositionen.test.ts`, zuletzt geändert 12:40 UTC | 🔄 **läuft, nicht abgenommen** |
| **Designer** | **DC-125 ist in Arbeit** — `AngebotDetail.tsx`, `AngebotVorschau.tsx`, `pdf.tsx`, `versandbereit.ts` und `dc125-preis-fehlt.test.tsx`, 12:23–12:29 UTC | 🔄 **läuft, nicht abgenommen** |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, nicht vermutet:**

* **Vercel-API, 12:44 UTC abgefragt:** `980c271` 11:04:49 READY · `4f06c75`
  11:10:49 **ERROR** · `deea290` 11:40:29 **ERROR** · **`4d53e65` 12:19:26
  READY**. Die Produktion war 68 Minuten rot und läuft jetzt auf dem aktuellen
  Stand.
* **GitHub-Actions-Laufliste, in diesem Lauf ohne `403` durchgekommen:**
  #210 `4d53e65` success · #209 `deea290` failure · #208 `4f06c75` failure ·
  #207 `980c271` success · **#206 `da7db10` success**. Damit steht fest: die
  `403` sind **zeitweise, nicht dauerhaft**, und die widersprüchliche Angabe
  vom Vormittag ist zugunsten von #206-grün aufgelöst.
* **`git fetch` vor der Zählung** (die Regel von 11:58 eingehalten):
  `origin/main` steht auf `4d53e65`, **ungepusht sind zwei Commits**
  (`533483b`, `2d0fd45`) — beide nur Doku aus dem letzten Lauf.
* **`.git/hooks/` durchgesehen:** nur `.sample`-Dateien, **kein `pre-push`**,
  `core.hooksPath` nicht gesetzt, kein `.husky/`. Die Hook-Datei liegt als
  `Claude outputs/pre-push`, die BOM-Fassung unter
  `.git/abgeschaltete-hooks/pre-push.mit-bom.185201`.
* **`node scripts/pruefe-unerfasste-dateien.mjs` selbst laufen lassen:** es
  funktioniert und meldet richtig — `cos-e-078-bad-wandpositionen.test.ts` und
  `dc125-preis-fehlt.test.tsx` sind Git unbekannt. **Nur löst den Aufruf
  niemand aus.**
* **`.gitignore` nachgelesen statt angenommen:** `/_to_delete/` Zeile 51,
  `/Claude outputs/` Zeile 52. Die 265 Sperrreste können also nicht
  versehentlich mitcommittet werden.
* **Kein aktives `.git/*.lock`** — der nächste Commit einer beliebigen Rolle
  ist nicht blockiert.
* **`node scripts/docs-sichern.mjs pruefen`:** „Alle 57 Doku-Dateien in
  Ordnung", nach meinen beiden Anhängen erneut.
* **`entscheidungen-fuer-sandy.md` frisch gelesen**, bevor unten „offen" steht.
  Dabei: die 🟡-Frage von 07:00 UTC (IONOS-Weiterleitung · Zustelltest) ist
  durch die Einträge von 10:10 und 10:25 UTC **erledigt** und steht nicht mehr
  auf ihrer Liste.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Die laufende Arbeit von Engineering und Designer habe ich nicht angefasst,
  nicht gemessen und nicht committet.** Die Dateien wurden vor Minuten zuletzt
  geändert — mitten in einen fremden Bau hineinzumessen erzeugt nur falsche
  Zahlen. Abnahme kommt, wenn die Rolle meldet.
* **Keine Prüfstände in diesem Lauf.** Ein Testlauf über einen halb fertigen
  Arbeitsbaum sagt nichts aus. Der letzte vollständige Stand bleibt der von
  11:58 UTC: **2693 grün · 94 Sperrklinken · 0 rot**.
* **Die Badrechnung des Prüfmeisters ist weiter seine Zahl.** 543,84 € habe ich
  gelesen, für schlüssig gehalten, nicht nachgerechnet.
* **Gate 1 rechne ich weiter nicht neu.** Stand bleibt **53,0 %**. Legals 7.13
  und inzwischen sechs DC-Punkte sind nicht eingerechnet — das gehört in einen
  Lauf, der `launch-readiness.md` ganz durchgeht.
* **Den Push-Wächter habe ich bewusst nicht selbst eingehängt.** ASCII und BOM
  kann ich hier prüfen, auf Windows auslösen nicht — und genau ein ungetesteter
  Hook hat am 16.09. Sandys Push abgebrochen.
* **Ob die Sicherung heute Abend um 20:00 Uhr wirklich anspringt**, ist noch
  nicht belegt. Der erste Lauf lief von Hand; der erste automatische kommt heute.
* **Versicherung, Stripe, Gewerbeanmeldung, Vercel-Benachrichtigung,
  Landingpage** — in diesem Lauf nicht angefasst.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🔵 **Pushen, wenn du ohnehin am Rechner bist.** Zwei Doku-Commits liegen noch hier. **Nichts Dringendes mehr** — die Produktion ist grün, es hängt kein Fix daran | ein Befehl, nicht eilig |
| 2 | 🔵 **Nach Italien, ab 26.09.:** Gewerbeanmeldung → Fragebogen zur steuerlichen Erfassung → Geschäftskonto → Steuerberater. Finance und Legal legen die Reihenfolge fertig hin, du stößt nichts an. Termin steht in `kalender.md` | nichts jetzt |
| 3 | 🔵 **Buchhaltungs-Testlauf** (Lexware Office, fünf Minuten — er schaltet den stärksten Satz der Landingpage frei) · **E-Rechnungs-Viewer** (Quba, 0 €) | nicht eilig |
| 4 | 🔵 **Versicherung** (exali/Markel 1 Mio. €) · **Stripe** (Konto + 2 Preise) · **Vercel-Benachrichtigung** · Gewerbeanmeldung KW 41 (CoS-041) | unverändert, in diesem Lauf nicht geprüft |
| 5 | 🔵 Heute Abend nach 20:00 Uhr einmal auf `onedrive.live.com` schauen, ob der erste **automatische** Sicherungslauf angekommen ist | ein Blick |

**Nichts davon ist rot, und nichts blockiert eine Rolle.** Zum ersten Mal seit
Tagen steht auf ihrer Liste kein einziger Punkt, auf den jemand wartet.

---

## Wer als Nächstes dran ist

| Rolle | Nächstes | Wartet auf |
|---|---|---|
| **Engineering** | **🔴 PM-117 + PM-060-A, zusammen** (1.961,38 € auf jedem Bad) — **läuft gerade**. Die Auflage steht: `/wand/` im Router trägt nur 652,96 €, die beiden anderen Wandzeilen scheitern zusätzlich am Wortlaut. **Ein halber Fix sieht behoben aus und ist es nicht.** Danach **PM-119/L-06** (Soll liegt vor) | niemanden |
| **Designer** | **DC-125** läuft gerade. Danach: **DC-124**, dazu **PD-021**. Der Fußzeilenteil von **DC-122** bleibt liegen, bis Legal antwortet | Legal (nur Fußzeile DC-122) |
| **Prüfmeister** | **Spur leer.** Fallbasis 120. Nächstes: wartet auf neue Bitten, sonst Fallbasis weiter | niemanden |
| **Legal** | **Zuerst L-KI-01 einbauen** (freigegeben, Wortlaut unverändert) und melden, wenn er drin ist; dabei prüfen, ob dieselbe Zusage noch woanders steht. Dann **CoS-L-011** (dürfen freie Fußzeilen die Pflichtangaben ersetzen — A/B/C?), dann **CoS-L-012** (Pflichtangaben mit USt-Ausweis, Kleinunternehmer-Hinweis überall raus) | niemanden |
| **Platform** | **Neu: CoS-P-031** — Push-Wächter BOM-frei neu bauen **und auf Sandys Rechner einmal wirklich auslösen**, bevor er als eingebaut gilt. Dazu der Termin **CoS-P-029:** am **19.09. nach 03:30 UTC** einmal `system_laeufe` prüfen (`aufnahmen.dateien > 0`?) | niemanden |
| **Marketing** | **Kein Stopper mehr.** Offen nur: drei statt sieben Buchhaltungs-Anbindungen auf der Seite | Sandys Buchhaltungs-Testlauf (nicht eilig) |
| **Finance** | **CoS-F-009** (Vorsteuer in die Kostenübersicht, Reverse-Charge auf „durchlaufend", Voranmeldungsrhythmus als Frage für den Steuerberater) · Behördenliste für Sandy bis 26.09. · **26 unbearbeitete Belege** prüfen, ins Eingangsbuch, Prüfsummen · drei Fragen von mir: reicht OneDrive als zweiter Ort für die 8 Jahre? · gehört die Sicherung in die Verfahrensdokumentation (mit **Kontrolle am Zielort**)? · **CoS-F-008** · steigt Gate-1-Punkt 4.7 über die 40/100? | niemanden |

---

## Was gerade niemanden blockiert, aber nicht untergehen darf

* **🔴 PM-117 — 543,84 € statt 2.980,44 € auf einem gewöhnlichen Bad.**
  Sechs von neun Zeilen ohne Preis. CoS-E-078, in Arbeit.
* **🔴 CoS-P-031 — der Push-Wächter fehlt.** Er hätte heute 68 Minuten rote
  Produktion verhindert und am 13./14.09. siebzehn Stunden. **Solange er nicht
  auf Sandys Rechner ausgelöst wurde, bleibt er draußen** — ein Wächter, der
  ihren Push abbricht, kostet mehr als er einbringt.
* **DC-125 — eine Zeile ohne Betrag darf ein Kundenangebot nicht verlassen.**
  Produktregel, nicht Einzelfall. Vierte Ausprägung derselben Frage
  (H, L.5, DC-112, PM-117).
* **Die Briefpapier-Auswahl am einzelnen Angebot war nie sichtbar** — seit
  Monaten, weil eine Abfrage ins Leere lief. Behoben in DC-123. **Es sah nie
  kaputt aus** — die Fehlerform, die keine Prüfliste findet.
* **Die Mini-Vorschau auf der Briefpapier-Seite zeigt eine Wirkung, die es
  nicht gibt** (Fußzeilen). Rest von DC-122, wartet auf Legal.
* **Dunkler Tabellenkopf in beiden Vorschauen, graue Spaltentitel im PDF.**
  Beide Vorschauen einig, beide weichen vom Papier ab. Gehört in die
  DC-049-Linie, **nicht** in DC-122.
* **Zwei Stellen laden ein Logo hoch**, das Briefpapier gewinnt stillschweigend.
  DC-124.
* **Die 30-Tage-Löschzusage ist bis heute nie eingelöst worden.** Der erste
  Lauf, der wirklich löschen muss, ist der vom **19.09., 03:30 UTC**. Löscht er
  nichts, sind zwei veröffentlichte Rechtstexte unrichtig. **CoS-P-029.**
* **Die Sicherung läuft, aber der erste automatische Lauf steht noch aus**
  (heute 20:00 Uhr Ortszeit). Die Empfehlung an Finance bleibt: eine
  **Kontrolle am Zielort** ins Verfahren aufnehmen — ein Skript-Abbruch ersetzt
  sie nicht. Aufgefallen ist der Fehler nur, weil **Sandy** in der
  Weboberfläche nachgesehen hat.
* **265 Git-Sperrreste von heute** in `_to_delete/git-reste-2026-09-17/`.
  Für git harmlos (`.gitignore` Zeile 51), aber das Muster bleibt: wer hier
  `git` auch nur trocken laufen lässt, hinterlässt eine Sperre, die er nicht
  aufräumen kann. **Löschrecht anfordern geht in einem geplanten Lauf nicht** —
  der Dialog braucht einen Menschen. `mv` bleibt die Vorgehensweise.
* **Die Landingpage bewirbt drei Buchhaltungs-Anbindungen. Es sind sieben.**
* **Dieselbe Anbindung heißt an zwei Stellen verschieden** („Lexoffice" vs.
  „Lexoffice (Legacy)"). Ein Wort in `integrations.ts`. Kein Auftrag, eine
  Meldung.
* **`menge_unbekannt` ist bewusst nicht gebaut.** Offen, wer die Messung macht.
* **`git add -A` ist abgeschafft.** Dateien werden einzeln benannt.
* **Das GitHub-403 ist zeitweise, nicht dauerhaft** — in diesem Lauf lief die
  Abfrage ohne Token durch. Wer nicht messen konnte, schreibt „nicht gemessen",
  nicht „gesperrt".

*Chief of Staff · 2026-09-17, 12:45 UTC*
