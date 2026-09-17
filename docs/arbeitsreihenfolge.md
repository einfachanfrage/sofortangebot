# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 17.09.2026, 13:00 UTC · Chief of Staff**
*(ersetzt die Fassung von 12:45 UTC — diese Datei wird immer ersetzt, nie ergänzt.)*
*Alle Uhrzeiten in dieser Fassung sind **UTC**. In Deutschland ist es gerade
**MESZ = UTC + 2**, also 15:00 Uhr Ortszeit.*

---

## Lage in drei Zeilen

**🟢 Die Produktion ist grün.** Deploy `4d53e65` READY seit 12:19:26 UTC,
CI-Lauf **#210** success. Rot war sie 68 Minuten (11:10–12:19 UTC).

**🔴 Die teuerste Zahl des Projekts bleibt die einzige, die zählt:** auf einem
gewöhnlichen Badangebot stehen **543,84 €, wo 2.980,44 € hingehören** (PM-117).
Sechs von neun Zeilen ohne Preis, jedes Bad, jeder Betrieb. Engineering baut
daran gerade — CoS-E-078.

**✅ CoS-P-031 ist entschieden und gebaut.** Sandy: „ja, einbauen". Die
Vollständigkeitsprüfung sitzt jetzt **beim Commit**, nicht beim Push — sie
warnt und blockiert nichts. **Sandys Push kann daran nicht mehr
hängenbleiben.**

---

## Was seit 12:20 UTC passiert ist

| Rolle | Ergebnis | Status |
|---|---|---|
| **Sandy** | **Gepusht** — `4d53e65` ist bei GitHub, Vercel und CI durch | ✅ Produktion repariert |
| **Vercel** | Deploy `4d53e65` **READY** um 12:19:26 UTC | ✅ gemessen |
| **CI** | Lauf **#210** auf `4d53e65`: **success**, 12:19:25 UTC | ✅ gemessen |
| **CoS** | **Der CI-Widerspruch vom Vormittag ist aufgelöst** — die GitHub-Abfrage lief ohne `403` durch. #206 auf `da7db10` war **grün** | ✅ erledigt |
| **Sandy** | **CoS-P-031 entschieden: „ja, einbauen"** | ✅ beantwortet |
| **CoS** | **CoS-P-031 gebaut** — `.git/hooks/pre-commit`, warnt, blockiert nichts (`exit 0`). Nachvollziehbare Fassung unter `scripts/hooks/`, Regel 5 in `AGENTS.md` | ✅ erledigt |
| **CoS** | **Eine eigene Fehlleistung richtiggestellt:** ich habe Sandy die Frage gestellt, ohne ihre eigene Anweisung vom 15.09. zu kennen — siehe unten | ✅ korrigiert |
| **CoS** | **Beide Nebenbefunde des Designers beantwortet** (Push-Wächter · 265 Git-Sperrreste); der dunkle Tabellenkopf bleibt bewusst aus DC-122 draußen | ✅ erledigt |
| **Engineering** | **CoS-E-078 / PM-117 in Arbeit** — `preis-matcher.ts`, `positions-gewerk.ts`, `katalog-standard.ts`, neuer Prüfstand `cos-e-078-bad-wandpositionen.test.ts` | 🔄 **läuft, nicht abgenommen** |
| **Designer** | **DC-125 in Arbeit** — `AngebotDetail.tsx`, `AngebotVorschau.tsx`, `pdf.tsx`, `versandbereit.ts`, `dc125-preis-fehlt.test.tsx` | 🔄 **läuft, nicht abgenommen** |

---

## 🔴 Was ich falsch gemacht habe — und wie es aufgelöst ist

**Ich habe Sandy eine Entscheidung vorgelegt, die sie vor zwei Tagen schon
einmal getroffen hatte — andersherum.** In der abgeschalteten Hook-Datei steht,
von mir am 15.09. selbst hineingeschrieben:

> `# 15.09.2026, Chief of Staff, auf Sandys ausdrueckliche Anweisung:`
> `# Ein Push darf NIE mehr blockiert werden. [...] Nicht wieder scharfschalten.`

Ich habe die Datei **nach** ihrer Antwort gelesen, nicht vorher, und ihr die
Ursache deshalb halb erklärt (BOM statt: BOM **und** ihre Anweisung).
**Die Lehre ist dieselbe wie bei den Heimat-Dateien: auch eine Datei, über die
ich berichte, wird vorher gelesen — nicht nur ihr Ort, sondern ihr Inhalt.**

**Beide Anweisungen gelten jetzt gleichzeitig,** weil die Prüfung an eine
andere Stelle gewandert ist:

| Anweisung | Bleibt gültig | Wie |
|---|---|---|
| 15.09.: „Ein Push darf NIE mehr blockiert werden" | **ja** | Es gibt keinen `pre-push` und wird keinen geben |
| 17.09.: „ja, einbauen" | **ja** | Die Prüfung läuft beim Commit, wo der Fehler entsteht |

**Zweiter Fund dabei:** die Zusage vom 15.09., die Prüfungen gehörten „in die
CI", ist nie eingelöst worden — und **kann für dieses Skript gar nicht
eingelöst werden.** Es sieht im örtlichen Arbeitsbaum nach, welche Dateien git
unbekannt sind; die CI checkt das Repository aus, dort gibt es per Definition
keine. Seit 15.09. hat die Prüfung also **nirgends** stattgefunden.

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, nicht vermutet:**

* **Vercel-API, 12:44 UTC:** `980c271` 11:04:49 READY · `4f06c75` 11:10:49
  **ERROR** · `deea290` 11:40:29 **ERROR** · **`4d53e65` 12:19:26 READY**.
* **GitHub-Actions, ohne `403` durchgekommen:** #210 `4d53e65` success ·
  #209 `deea290` failure · #208 `4f06c75` failure · #207 `980c271` success ·
  **#206 `da7db10` success**. Die `403` sind **zeitweise, nicht dauerhaft**.
* **`git fetch` vor der Zählung:** `origin/main` steht auf `4d53e65`.
* **`.git/hooks/` durchgesehen**, `core.hooksPath` nicht gesetzt, kein `.husky/`.
* **Der neue Hook, Stück für Stück:** `sh -n` sauber · `file` meldet
  *POSIX shell script, ASCII text executable* · erste vier Bytes `23 21 2f 62`
  (`#!/b`, **kein BOM**) · **kein CR** · **0 Nicht-ASCII-Zeichen** ·
  **Probelauf Exit-Code 0**, 20 Hinweiszeilen, beide unerfassten Dateien
  korrekt erkannt.
* **`grep` über `.github/workflows/` und `package.json`:**
  `pruefe-unerfasste-dateien.mjs` kommt in der CI **nicht** vor.
* **🟡 `ci.yml` beginnt mit einem BOM** (`ef bb bf`). Die Commit-Nachricht zu
  CoS-P-026 sagt „ohne BOM" — das stimmt nicht. **Kein Problem gerade:**
  #210 ist grün, GitHub nimmt die Datei an. **Nicht angefasst** — eine Datei zu
  reparieren, die grün läuft, ist das größere Risiko. Nur: „ci.yml hat kein
  BOM" darf niemand mehr zitieren.
* **`.gitignore` nachgelesen:** `/_to_delete/` Zeile 51, `/Claude outputs/`
  Zeile 52. Die 265 Sperrreste können nicht mitcommittet werden.
* **`node scripts/docs-sichern.mjs pruefen`:** „Alle 57 Doku-Dateien in Ordnung",
  nach jedem Anhängen erneut.
* **`entscheidungen-fuer-sandy.md` frisch gelesen.** Die 🟡-Frage von 07:00 UTC
  (IONOS-Weiterleitung · Zustelltest) ist durch die Einträge von 10:10 und
  10:25 UTC erledigt und steht nicht mehr auf ihrer Liste.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Ob der Hook unter Git for Windows wirklich anspringt.** Diese Shell ist
  Linux. **Der Unterschied zu CoS-P-024 ist, dass es nichts kostet, wenn nicht:**
  `exit 0` und ein Hook, der gar nicht startet, haben dieselbe Wirkung — keine.
  Der Beweis kommt beim nächsten Commit einer Rolle.
* **Die laufende Arbeit von Engineering und Designer** — nicht angefasst, nicht
  gemessen, nicht committet. In einen fremden Bau hineinzumessen erzeugt nur
  falsche Zahlen.
* **Keine Prüfstände in diesem Lauf.** Letzter vollständiger Stand bleibt der
  von 11:58 UTC: **2693 grün · 94 Sperrklinken · 0 rot**.
* **Die Badrechnung des Prüfmeisters** ist weiter seine Zahl. Nicht nachgerechnet.
* **Gate 1 rechne ich weiter nicht neu.** Stand bleibt **53,0 %**. Legals 7.13
  und sechs DC-Punkte sind nicht eingerechnet.
* **Ob `pruefe-gepushten-commit.mjs` irgendwo läuft.** Nicht nachgesehen.
* **Ob die Sicherung heute um 20:00 Uhr Ortszeit anspringt.** Der erste Lauf
  lief von Hand; der erste automatische kommt heute Abend.
* **Versicherung, Stripe, Gewerbeanmeldung, Vercel-Benachrichtigung,
  Landingpage** — in diesem Lauf nicht angefasst.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🔵 **Pushen, wenn du ohnehin am Rechner bist.** Vier Doku-Commits liegen hier. **Nichts Dringendes** — die Produktion ist grün, es hängt kein Fix daran | ein Befehl, nicht eilig |
| 2 | 🔵 **Nach Italien, ab 26.09.:** Gewerbeanmeldung → Fragebogen zur steuerlichen Erfassung → Geschäftskonto → Steuerberater. Finance und Legal legen die Reihenfolge fertig hin | nichts jetzt |
| 3 | 🔵 **Buchhaltungs-Testlauf** (Lexware Office, fünf Minuten — schaltet den stärksten Satz der Landingpage frei) · **E-Rechnungs-Viewer** (Quba, 0 €) | nicht eilig |
| 4 | 🔵 **Versicherung** (exali/Markel 1 Mio. €) · **Stripe** (Konto + 2 Preise) · **Vercel-Benachrichtigung** · Gewerbeanmeldung KW 41 (CoS-041) | unverändert |
| 5 | 🔵 Heute Abend nach 20:00 Uhr einmal auf `onedrive.live.com` schauen, ob der erste **automatische** Sicherungslauf angekommen ist | ein Blick |

**Nichts davon ist rot, und nichts blockiert eine Rolle.**

---

## Wer als Nächstes dran ist

| Rolle | Nächstes | Wartet auf |
|---|---|---|
| **Engineering** | **🔴 PM-117 + PM-060-A, zusammen** (1.961,38 € auf jedem Bad) — **läuft gerade**. Die Auflage steht: `/wand/` im Router trägt nur 652,96 €, die beiden anderen Wandzeilen scheitern zusätzlich am Wortlaut. **Ein halber Fix sieht behoben aus und ist es nicht.** Danach **PM-119/L-06** | niemanden |
| **Designer** | **DC-125** läuft gerade. Danach **DC-124**, dazu **PD-021**. Der Fußzeilenteil von **DC-122** bleibt liegen, bis Legal antwortet | Legal (nur Fußzeile DC-122) |
| **Prüfmeister** | **Spur leer.** Fallbasis 120. Wartet auf neue Bitten, sonst Fallbasis weiter | niemanden |
| **Legal** | **Zuerst L-KI-01 einbauen** (freigegeben, Wortlaut unverändert) und melden, wenn er drin ist; dabei prüfen, ob dieselbe Zusage noch woanders steht. Dann **CoS-L-011** (dürfen freie Fußzeilen die Pflichtangaben ersetzen — A/B/C?), dann **CoS-L-012** | niemanden |
| **Platform** | **CoS-P-031 ist zu** — nichts mehr zu bauen, nur der Termin **CoS-P-029:** am **19.09. nach 03:30 UTC** einmal `system_laeufe` prüfen (`aufnahmen.dateien > 0`?) | niemanden |
| **Marketing** | **Kein Stopper mehr.** Offen nur: drei statt sieben Buchhaltungs-Anbindungen auf der Seite | Sandys Buchhaltungs-Testlauf (nicht eilig) |
| **Finance** | **CoS-F-009** (Vorsteuer in die Kostenübersicht, Reverse-Charge auf „durchlaufend", Voranmeldungsrhythmus als Frage für den Steuerberater) · Behördenliste für Sandy bis 26.09. · **26 unbearbeitete Belege** prüfen, ins Eingangsbuch, Prüfsummen · drei Fragen von mir: reicht OneDrive als zweiter Ort für die 8 Jahre? · gehört die Sicherung in die Verfahrensdokumentation (mit **Kontrolle am Zielort**)? · **CoS-F-008** · steigt Gate-1-Punkt 4.7 über die 40/100? | niemanden |

---

## Was gerade niemanden blockiert, aber nicht untergehen darf

* **🔴 PM-117 — 543,84 € statt 2.980,44 € auf einem gewöhnlichen Bad.**
  Sechs von neun Zeilen ohne Preis. CoS-E-078, in Arbeit.
* **Die Vollständigkeitsprüfung warnt ab jetzt beim Commit.** Wer „ist
  committet" meldet, ohne die `[pre-commit]`-Zeilen gelesen zu haben, meldet
  einen Stand, der bei Vercel rot werden kann. Regel 5 in `AGENTS.md`.
  **`exit 0` im Hook bleibt** — daraus eine Sperre zu machen hebelt Sandys
  Anweisung vom 15.09. aus.
* **🟡 `ci.yml` hat ein BOM, und die CI läuft trotzdem grün.** Nicht angefasst.
  Die Aussage „ci.yml hat kein BOM" ist falsch und sollte nicht zitiert werden.
* **DC-125 — eine Zeile ohne Betrag darf ein Kundenangebot nicht verlassen.**
  Produktregel, nicht Einzelfall. Vierte Ausprägung derselben Frage
  (H, L.5, DC-112, PM-117).
* **Die Briefpapier-Auswahl am einzelnen Angebot war nie sichtbar** — seit
  Monaten, weil eine Abfrage ins Leere lief. Behoben in DC-123. **Es sah nie
  kaputt aus** — die Fehlerform, die keine Prüfliste findet.
* **Die Mini-Vorschau auf der Briefpapier-Seite zeigt eine Wirkung, die es
  nicht gibt** (Fußzeilen). Rest von DC-122, wartet auf Legal.
* **Dunkler Tabellenkopf in beiden Vorschauen, graue Spaltentitel im PDF.**
  Gehört in die DC-049-Linie, **nicht** in DC-122.
* **Zwei Stellen laden ein Logo hoch**, das Briefpapier gewinnt stillschweigend.
  DC-124.
* **Die 30-Tage-Löschzusage ist bis heute nie eingelöst worden.** Der erste
  Lauf, der wirklich löschen muss, ist der vom **19.09., 03:30 UTC**. Löscht er
  nichts, sind zwei veröffentlichte Rechtstexte unrichtig. **CoS-P-029.**
* **Die Sicherung läuft, der erste automatische Lauf steht noch aus.** Die
  Empfehlung an Finance bleibt: **Kontrolle am Zielort** ins Verfahren
  aufnehmen — ein Skript-Abbruch ersetzt sie nicht.
* **265 Git-Sperrreste von heute** in `_to_delete/git-reste-2026-09-17/`.
  Für git harmlos (`.gitignore` Zeile 51). **Löschrecht anfordern geht in einem
  geplanten Lauf nicht** — der Dialog braucht einen Menschen. `mv` bleibt die
  Vorgehensweise.
* **Die Landingpage bewirbt drei Buchhaltungs-Anbindungen. Es sind sieben.**
* **Dieselbe Anbindung heißt an zwei Stellen verschieden** („Lexoffice" vs.
  „Lexoffice (Legacy)"). Ein Wort in `integrations.ts`. Kein Auftrag, eine
  Meldung.
* **`menge_unbekannt` ist bewusst nicht gebaut.** Offen, wer die Messung macht.
* **`git add -A` ist abgeschafft.** Dateien werden einzeln benannt.
* **Eine Datei, über die ich berichte, wird vorher gelesen** — nicht nur ihr
  Ort, sondern ihr Inhalt. Heute hat mich das eine Frage an Sandy gekostet, die
  sie schon beantwortet hatte.

*Chief of Staff · 2026-09-17, 13:00 UTC*
