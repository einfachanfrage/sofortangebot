# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 17.09.2026, 16:00 UTC · Chief of Staff**
*(ersetzt die Fassung von 15:50 UTC — diese Datei wird immer ersetzt, nie ergänzt.)*
*Alle Uhrzeiten in dieser Fassung sind **UTC**. In Deutschland ist es gerade
**MESZ = UTC + 2**, also 18:00 Uhr Ortszeit.*

---

## Lage in drei Zeilen

**🟢 Die Produktion ist grün, und sie ist auf dem neuesten Stand.** Sandy hat
um 15:50 UTC gepusht; Deploy `8d07102` ist seit **15:51:33 UTC READY**.
`origin/main` = `HEAD` = `8d07102`, **nichts liegt mehr ungepusht hier.**

**🔴 Die teuerste Zahl des Projekts bleibt die einzige, die zählt:** auf einem
gewöhnlichen Badangebot stehen **543,84 €, wo 2.980,44 € hingehören** (PM-117).
Engineering baut daran — CoS-E-078, Stand 15:44 UTC unfertig im Arbeitsbaum.

**✅ Der Designer hat seine Spur leergeräumt:** **DC-125, DC-126 und DC-124**
sind fertig, alle drei mit eigener Verifikation. Neu für ihn: **DC-127**.

---

## Was seit 13:50 UTC passiert ist

| Rolle | Ergebnis | Status |
|---|---|---|
| **Designer** | **DC-124 fertig** — ein Betrieb hat ein Logo, und es wird an genau einer Stelle hochgeladen. `tsc` fehlerfrei, 9 neue Tests grün, 99 grün über alle 10 betroffenen Testdateien, eslint 0 Fehler | ✅ erledigt |
| **Designer** | **DC-126 fertig** — die Positionstitel im Landingpage-Entwurf heißen jetzt wie das Produkt | ✅ erledigt |
| **Designer** | **DC-125 fertig** — eine Position ohne Preis zeigt keinen Betrag, und eine Summe, in der sie steckt, ist kein Gesamtbetrag | ✅ erledigt |
| **CoS** | **Beide offenen Punkte aus DC-124 in der Produktionsdatenbank nachgemessen — beide lösen sich auf** (siehe unten). Keine Weitergabe an Platform, keine Rückfrage an Sandy | ✅ erledigt |
| **CoS** | **CoS-E-080 angelegt** (leere Altlast-Spalte), ganz hinten in Engineerings Spur | ✅ verteilt |
| **CoS** | **DC-127 angelegt** — der dunkle Tabellenkopf, den der Designer zweimal richtig liegen gelassen hat, ist jetzt ein eigenes Ticket bei ihm | ✅ verteilt |
| **Engineering** | **CoS-E-078 läuft weiter** — `preis-matcher.ts`, `vollstaendigkeit/fliesen-basis.ts`, `vollstaendigkeit/index.ts`, neu `src/lib/fliesen-richtung.ts` | 🔄 **läuft, nicht abgenommen** |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, nicht vermutet:**

* **Vercel-API, 15:58 UTC:** `8d07102` **READY**, gebaut 15:50:30, fertig
  **15:51:33 UTC**, ausgeliefert auf `sofortangebot.app`. Die beiden roten
  Deploys des Vormittags (`4f06c75`, `deea290`) liegen weit davor.
* **`git fetch`, 15:57 UTC:** `origin/main` steht auf **`8d07102`**,
  **0 ungepushte Commits**. Davor gemessen: `af32b14` READY (13:03:49 UTC) ·
  `a813d77` READY (12:54:24) · `4d53e65` READY (12:19:26).
* **Produktionsdatenbank (Supabase `yqlledouhfovytifeekd`), 15:47/15:48 UTC:**
  `briefpapiere` = 4, davon mit eigenem `logo_url` = **0**, betroffene
  Betriebe = **0** · `storage.objects`: `entwurf-audio` 46 · `public-pdfs` 4 ·
  `company-logos` 1 · `tts-cache` 1, **kein einziges Objekt mit `briefpapiere`
  im Pfad**.
* **Arbeitsbaum, 15:44 UTC:** `src/lib/__tests__/zz-messung-tmp.test.ts`, die
  der Designer um 15:29 als fremde Datei gemeldet hat, ist **nicht mehr da**.
* **`node scripts/docs-sichern.mjs pruefen`:** „Alle 57 Doku-Dateien in
  Ordnung", nach jedem Anhängen erneut.
* **`design-check.md` und `chief-of-staff-engineering-todos.md` frisch
  gelesen**, bevor ich über sie berichtet habe.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **🟡 Die CI ist in diesem Lauf nicht messbar.** Die GitHub-Actions-Abfrage
  ist **zweimal mit `403`** abgebrochen. Der letzte belegte Stand bleibt
  **#210 auf `4d53e65`: success** (gemessen 12:44 UTC). Über die Läufe zu
  `a813d77` und `af32b14` sage ich nichts — sie sind ungemessen, nicht rot.
  Vercel ist auf `af32b14` grün, das ist der Produktions-Build.
* **Die laufende Arbeit von Engineering** — nicht angefasst, nicht gemessen,
  nicht committet.
* **Keine Prüfstände in diesem Lauf.** Letzter vollständiger eigener Stand
  bleibt der von 11:58 UTC: **2693 grün · 94 Sperrklinken · 0 rot.** Die 99
  grünen Tests zu DC-124 sind die Messung des Designers, nicht meine.
* **Ob außerhalb von `briefpapier-logo.ts`, `pdf.tsx` und
  `AngebotVorschau.tsx` noch etwas `briefpapiere.logo_url` liest.** Nicht
  selbst über das Repository gesucht.
* **Gate 1 rechne ich weiter nicht neu.** Stand bleibt **53,0 %**.
* **Versicherung, Stripe, Gewerbeanmeldung, Vercel-Benachrichtigung,
  Landingpage, Sicherungslauf um 20:00 Uhr** — in diesem Lauf nicht angefasst.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | ✅ **Erledigt — du hast um 15:50 UTC gepusht.** Alles ist bei GitHub und bei Vercel durch. **Hier liegt nichts mehr** | — |
| 2 | 🔵 **Nach Italien, ab 26.09.:** Gewerbeanmeldung → Fragebogen zur steuerlichen Erfassung → Geschäftskonto → Steuerberater. Finance und Legal legen die Reihenfolge fertig hin | nichts jetzt |
| 3 | 🔵 **Buchhaltungs-Testlauf** (Lexware Office, fünf Minuten — schaltet den stärksten Satz der Landingpage frei) · **E-Rechnungs-Viewer** (Quba, 0 €) | nicht eilig |
| 4 | 🔵 **Versicherung** (exali/Markel 1 Mio. €) · **Stripe** (Konto + 2 Preise) · **Vercel-Benachrichtigung** · Gewerbeanmeldung KW 41 (CoS-041) | unverändert |
| 5 | 🔵 Heute Abend nach 20:00 Uhr einmal auf `onedrive.live.com` schauen, ob der erste **automatische** Sicherungslauf angekommen ist | ein Blick |

**Nichts davon ist rot, und nichts blockiert eine Rolle. Es ist in diesem Lauf
kein einziger Punkt für sie dazugekommen** — die zwei Fragen, die dazu
gehört hätten, sind in der Datenbank beantwortet worden.

---

## Wer als Nächstes dran ist

| Rolle | Nächstes | Wartet auf |
|---|---|---|
| **Engineering** | **🔴 PM-117 + PM-060-A, zusammen** (1.961,38 € auf jedem Bad) — **läuft gerade**. Die Auflage steht: `/wand/` im Router trägt nur 652,96 €, die beiden anderen Wandzeilen scheitern zusätzlich am Wortlaut. **Ein halber Fix sieht behoben aus und ist es nicht.** Danach **PM-061-A → PM-062-A → CoS-038 → PM-119/L-06 → CoS-E-080** | niemanden |
| **Designer** | **🆕 DC-127** — der dunkle Tabellenkopf (beide Vorschauen dunkel, das PDF grau über dünner Linie). **Seine Entscheidung, nicht Sandys.** Auflage: nur eine der beiden Seiten ändern. Danach **PD-021** (erst nach PM-119 sinnvoll); der Fußzeilenteil von **DC-122** bleibt liegen, bis Legal antwortet | Legal (nur Fußzeile DC-122) |
| **Prüfmeister** | **Spur leer.** Fallbasis **133**. Marketings Bitte ist beantwortet (**PM-129** Hero: 17,10 lfdm gibt es nicht, es sind 18,00 — und eine vierte Zeile fehlt auf der Seite · **PM-130** Diktat 2 erzeugt keine fünf Türen, ist aber PM-094: ein Angebot aus einer erfundenen Zeile). Themenspeicher-Punkt 9 ist zu (**PM-131/132/133**). Teuerster neuer Fund: **PM-132 — „50 Stück Fliesen" im Nebensatz macht 50 Türen, 8.820,00 €, mit dem Rechenweg „aus Transkript".** Wartet auf neue Bitten, sonst Fallbasis weiter | niemanden |
| **Legal** | **Zuerst L-KI-01 einbauen** (freigegeben, Wortlaut unverändert) und melden, wenn er drin ist; dabei prüfen, ob dieselbe Zusage noch woanders steht. Dann **CoS-L-011** (dürfen freie Fußzeilen die Pflichtangaben ersetzen — A/B/C?), dann **CoS-L-012** | niemanden |
| **Platform** | **Nichts zu bauen.** Nur der Termin **CoS-P-029:** am **19.09. nach 03:30 UTC** einmal `system_laeufe` prüfen (`aufnahmen.dateien > 0`?). Das Bucket-Aufräumen aus DC-124 entfällt — es gibt die Dateien nicht | niemanden |
| **Marketing** | **Kein Stopper mehr.** Offen nur: drei statt sieben Buchhaltungs-Anbindungen auf der Seite. Der Website-Schalter darf erst nach **CoS-038** umgelegt werden | Engineering (CoS-038) · Sandys Buchhaltungs-Testlauf |
| **Finance** | **CoS-F-009** (Vorsteuer in die Kostenübersicht, Reverse-Charge auf „durchlaufend", Voranmeldungsrhythmus als Frage für den Steuerberater) · Behördenliste für Sandy bis 26.09. · **26 unbearbeitete Belege** prüfen, ins Eingangsbuch, Prüfsummen · drei Fragen von mir: reicht OneDrive als zweiter Ort für die 8 Jahre? · gehört die Sicherung in die Verfahrensdokumentation (mit **Kontrolle am Zielort**)? · **CoS-F-008** · steigt Gate-1-Punkt 4.7 über die 40/100? | niemanden |

---

## Was gerade niemanden blockiert, aber nicht untergehen darf

* **🔴 PM-117 — 543,84 € statt 2.980,44 € auf einem gewöhnlichen Bad.**
  Sechs von neun Zeilen ohne Preis. CoS-E-078, in Arbeit.
* **🟡 Die CI ist seit 12:44 UTC nicht mehr gemessen worden** — zweimal `403`.
  Wer „die CI ist grün" sagt, meint den Lauf **#210 auf `4d53e65`** und sollte
  das dazusagen. Vercel ist auf `af32b14` grün, gemessen.
* **DC-124 ist committet und ausgeliefert** (`8d07102`). Uncommittet liegt
  nur noch Engineerings **unfertiges** CoS-E-078 (`preis-matcher.ts`,
  `vollstaendigkeit/fliesen-basis.ts`, `vollstaendigkeit/index.ts`,
  `cos-e-078-bad-wandpositionen.test.ts`, neu `src/lib/fliesen-richtung.ts`).
  **Das darf niemand mitnehmen.** `git add -A` bleibt abgeschafft.
* **Mein eigener Datenpunkt von heute:** meine neun Doku-Dateien lagen
  vorbereitet im gemeinsamen Index, als Sandys Commit lief — sie sind
  deshalb unter der Nachricht *„DC-124: Ein Betrieb hat ein Logo"*
  mitgegangen. Inhaltlich richtig, nur unter fremdem Titel. **Der Index ist
  bei fünf Rollen an einem Arbeitsbaum geteilt**: zwischen `git add` und
  `git commit` gehört nichts als eine Sekunde.
* **Die Vollständigkeitsprüfung warnt beim Commit** (`pre-commit`, `exit 0`,
  blockiert nichts). Wer „ist committet" meldet, ohne die
  `[pre-commit]`-Zeilen gelesen zu haben, meldet einen Stand, der bei Vercel
  rot werden kann. Regel 5 in `AGENTS.md`.
* **🟡 `ci.yml` hat ein BOM, und die CI läuft trotzdem grün.** Nicht angefasst.
  Die Aussage „ci.yml hat kein BOM" ist falsch und sollte nicht zitiert werden.
* **Es gibt keine echten Betriebe — nur Sandys Testkonto.** Heute hat diese
  Zahl zwei offene Punkte aufgelöst, die als Bestandsschutz-Risiken
  dastanden. Wer über „betroffene Betriebe" schreibt, zählt sie vorher.
* **`briefpapiere.logo_url` ist ab heute eine leere Altlast**, keine
  Einstellung. CoS-E-080, ganz hinten.
* **Dunkler Tabellenkopf in beiden Vorschauen, graue Spaltentitel im PDF.**
  Jetzt **DC-127**, nicht mehr Randnotiz in DC-122.
* **Die 30-Tage-Löschzusage ist bis heute nie eingelöst worden.** Der erste
  Lauf, der wirklich löschen muss, ist der vom **19.09., 03:30 UTC**. Löscht er
  nichts, sind zwei veröffentlichte Rechtstexte unrichtig. **CoS-P-029.**
* **Die Sicherung läuft, der erste automatische Lauf steht heute Abend an.**
  Die Empfehlung an Finance bleibt: **Kontrolle am Zielort** ins Verfahren
  aufnehmen — ein Skript-Abbruch ersetzt sie nicht.
* **Git-Sperrreste und ein Worktree-Rest** (`.git/worktrees/alt`, vom
  Prüfmeister) liegen weiter da. Für git harmlos, `/_to_delete/` steht in
  `.gitignore`. **Löschrecht anfordern geht in einem geplanten Lauf nicht** —
  der Dialog braucht einen Menschen. `mv` bleibt die Vorgehensweise.
* **Die Landingpage bewirbt drei Buchhaltungs-Anbindungen. Es sind sieben.**
* **Dieselbe Anbindung heißt an zwei Stellen verschieden** („Lexoffice" vs.
  „Lexoffice (Legacy)"). Ein Wort in `integrations.ts`. Kein Auftrag, eine
  Meldung.
* **`menge_unbekannt` ist bewusst nicht gebaut.** Offen, wer die Messung macht.
* **Eine Datei, über die ich berichte, wird vorher gelesen** — nicht nur ihr
  Ort, sondern ihr Inhalt. **Und eine Zahl, mit der ich ein Risiko begründe,
  wird vorher gezählt.** Heute hat das zweite eine Rückfrage an Sandy erspart.

*Chief of Staff · 2026-09-17, 16:00 UTC*
