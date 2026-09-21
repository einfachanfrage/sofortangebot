# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 21.09.2026, 08:55 UTC · Chief of Staff**
*(ersetzt die Fassung von 08:05 UTC — diese Datei wird immer ersetzt, nie ergänzt.)*
*Alle Uhrzeiten sind **UTC**. In Deutschland ist es gerade **MESZ = UTC + 2**,
also 10:55 Uhr Ortszeit.*

---

## Lage in drei Zeilen

**🟢 Alles ist gepusht, und der gepushte Stand ist grün — gemessen.**
Sandy hat zwischendurch selbst gepusht: `origin/main` und der lokale Stand
sind beide **`3c3dd3d`**, **null ungepushte Commits**. Vercel-Produktion:
`3c3dd3d`, **READY**. GitHub-Actions-CI auf demselben `3c3dd3d`: **success**,
08:27 UTC. (Ein Lauf auf `2411f76` steht auf „cancelled" — der wurde vom
nächsten Push überholt, das ist normal und kein Fehler.)

**🟢 In den vier Stunden seit dem letzten Stand haben vier Rollen geliefert.**
Designer (DC-128 gebaut **und** committet, PD-023 beantwortet), Legal (L-KI-01
gebaut, CoS-L-011 mit **B** beantwortet, CoS-L-012 abgearbeitet, ein roter
Fund in Sandys eigenem Behördenplan korrigiert), Platform (CoS-P-033
beantwortet), Engineering (läuft in diesem Moment). Der Stillstand vom
17.–20.09. ist vorbei.

**🔴 Der teuerste Fund des Tages kommt von Legal und betrifft alle acht
Rollen: `docs-sichern.mjs sichern` committet auf diesem Rechner nichts.**
Die Doku-Sicherung, die Sandy am 31.08. freigegeben hat, läuft seit unbekannter
Zeit **lautlos** ins Leere. `pruefen` ist nicht betroffen. Auftrag liegt als
**CoS-P-034** bei Platform.

---

## Was seit dem 21.09., 08:05 UTC fertig geworden ist

| Rolle | Ergebnis | Status |
|---|---|---|
| **Designer** | **DC-128 gebaut und committet** (`3c3dd3d`, fünf Dateien): der ausgenommene Bauabschnitt wird im Entwurf angezeigt — Hinweis **plus Belegzitat**. Die vier Tage uncommitteten Designer-Dateien sind damit weg | ✅ erledigt |
| **Designer** | **PD-023 beantwortet.** Auf dem Kundenpapier steht „aus Transkript" gar nicht mehr (`kundenRechenweg()` streicht es). In der App stehen die zwei Wörter nebeneinander — er ändert die Schrift **bewusst nicht**: der Zeile fehlt der Beleg, nicht das Gewicht | ✅ erledigt |
| **Legal** | **L-KI-01 eingebaut** (`bcd6916`, freigegebener Wortlaut, `datenschutz/page.tsx`) | ✅ erledigt |
| **Legal** | **CoS-L-011 beantwortet: B.** Die drei freien Fußzeilen kommen **zusätzlich** und ersetzen nichts. Dazu die Richtigstellung: **DC-122 hing nie an Sandy** — der Fuß trägt die Daten des Handwerksbetriebs, nicht ihre | ✅ erledigt |
| **Legal** | **CoS-L-012 abgearbeitet**, mit einem roten Fund in der eigenen Datei: `legal-007-plan-fuer-sandy.md` nannte Sandy **das falsche Kreuz** für den Fragebogen zur steuerlichen Erfassung (§ 19 statt Verzicht) und behauptete, es lasse sich später ändern — der Verzicht bindet **fünf Jahre**. Korrigiert, Korrekturkasten sichtbar | ✅ erledigt |
| **Platform** | **CoS-P-033 beantwortet und zu.** Die vier Aufnahmen vom 19.08.: `audio_url` auf `null`, kein Storage-Objekt mehr im Bucket, Code löscht erst die Datei und dann den Verweis. Die Datenbankzeile bleibt **absichtlich** (Transkript). Datenschutzerklärung Z. 117 / AGB § 8.3 sind damit **vollständig belegt** | ✅ erledigt |
| **Sandy** | **Gepusht.** Alle vier Commits von heute früh sind auf `origin/main`, Produktion ist darauf | ✅ erledigt |
| **CoS** | **CoS-P-034 an Platform** (`docs-sichern.mjs`), **CoS-E-086 an Engineering** (Beleg-Feldpaar), **CoS-M-018 an Marketing** (Preiszeile ohne USt-Kennzeichnung), **CoS-L-013 an Legal** (Löschfrist zu, kommt nicht zurück), **DC-122-Freigabe** an den Designer | 🆕 verteilt |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, 08:42–08:55 UTC:**

* **`git fetch` + `git rev-parse`:** `origin/main` = lokal = **`3c3dd3d`**,
  **0 ungepushte Commits**.
* **Vercel-API:** jüngster Produktions-Deploy **`3c3dd3d`, READY**; die drei
  davor (`2411f76`, `954c6e6`, `69222b6`) ebenfalls READY.
* **GitHub-Actions-API:** **CI auf `3c3dd3d` success**, 08:27 UTC.
* **`git status`:** uncommittet liegen **fünf** Dateien — siehe unten, und
  **vier davon gehören einem laufenden Vorgang**, nicht einem liegengebliebenen.
* **Die Sperrdatei selbst:** `.git/index.lock` liegt in diesem Moment da,
  0 Byte, und `git status` meldet beim Versuch, sie zu entfernen,
  `Operation not permitted`. **Legals Befund ist damit von mir nachgemessen,
  nicht übernommen.**
* **`_git-sperrreste-zum-loeschen/` gibt es nicht.** Legal schreibt, der Ordner
  liege im Projektordner und Sandy müsse ihn löschen. `ls` und `git status`
  sagen: nein. Die leeren Sperrdateien liegen in **`.git/_locks/`** — innerhalb
  von `.git`, unsichtbar für `git status`, nicht mitcommittbar. **Für Sandy ist
  nichts zu tun, und ich habe ihr nichts auf die Liste gesetzt.**
* **`node scripts/docs-sichern.mjs pruefen`:** „Alle 58 Doku-Dateien in
  Ordnung", vor und nach meinem Anhängen.
* **Gelesen, bevor ich darüber berichte:** Legal-Liste (ganzer Tagesbericht),
  Platform-Liste, `design-check.md`, `entscheidungen-fuer-sandy.md`,
  `arbeitsreihenfolge.md` der 08:05-Fassung.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Kein eigener Prüfstand.** Letzter belegter Stand bleibt Engineerings
  Messung vom 17.09., 17:15 UTC (190 Testdateien, 2.954 Prüfungen, 0 rot),
  plus CI grün auf `3c3dd3d`.
* **Was Engineering in diesem Moment baut**, ist nicht fertig und wird von mir
  nicht als erledigt geführt — siehe unten.
* **Gate 1 rechne ich in diesem Lauf nicht neu.** Stand bleibt **54,2 %**.
* **Versicherung, Stripe, Gewerbeanmeldung, Buchhaltungs-Testlauf,
  OneDrive-Sicherung** — nicht angefasst.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🔵 **Wieder einmal pushen**, sobald Engineering und Prüfmeister ihre Läufe committet haben. Block steht unten im Chat | ein Befehl |
| 2 | 🔵 **Ab 26.09.:** Gewerbeanmeldung → Fragebogen zur steuerlichen Erfassung → Geschäftskonto → Steuerberater. **Neu: beim Fragebogen die aktuelle Fassung von `legal-007-plan-fuer-sandy.md` lesen**, nicht eine gemerkte — das Kreuz hat sich mit ihrer eigenen Entscheidung vom 17.09. geändert, und es bindet fünf Jahre | nichts jetzt |
| 3 | ⚪ **Einmal selbst einsprechen — freiwillig, nicht dringend.** Der Designer kann das Bernsteinbanner mit einer echten Sprachaufnahme auf dem Handy nicht prüfen: ein Raum normal, ein zweiter mit „das kommt später und wird extra angeboten". Ohne Mikrofon ist die Kette nicht auslösbar | 2 Minuten |
| 4 | ⚪ **Freigabe für den Landingpage-Entwurf — freiwillig**, nur falls eine Messung bei echter Handy-Breite (375 px) gewünscht ist | freiwillig |
| 5 | 🔵 **Buchhaltungs-Testlauf** (Lexware Office) · **E-Rechnungs-Viewer** (Quba, 0 €) · **Versicherung** (exali/Markel 1 Mio. €) · **Stripe** (Konto + 2 Preise) · **Vercel-Benachrichtigung** | unverändert |

**Es wartet keine Rolle auf Sandy, und nichts davon ist dringend.**

---

## Wer als Nächstes dran ist

| Rolle | Nächstes | Wartet auf |
|---|---|---|
| **Engineering** | **Der laufende Vorgang zuerst zu Ende und committet** (uncommittet im Baum: `maler-sonder.ts` plus die neue `cos-e-085-isoliergrund-alle-raeume.test.ts` — nach dem Namen ist das **PM-079-A**, Platz 1). Danach **CoS-E-083 weiter:** **PM-106 + PM-107 zusammen** → **PM-105**, dann unverändert **CoS-038 → PM-119/L-06 → CoS-E-080**. **🆕 CoS-E-086** (kann eine Position den Satz mitführen, aus dem ihre Zahl stammt?) ist eine **Antwortfrage, kein Bauauftrag** und drängt sich nicht vor | niemanden |
| **Designer** | **🆕 DC-122 ist frei** — Legal hat mit **B** geantwortet, die fünf Grenzzeilen stehen in `design-check.md`. Punkt 2 beachten: der feste Fuß ist der aus CoS-E-057, bis dahin bleibt der heutige. Danach **DC-127** (dunkler Tabellenkopf, nur eine der beiden Seiten). **PD-018 §3** sinnvoll erst nach Engineerings Umstellung. DC-128 ist gebaut und committet | niemanden |
| **Platform** | **🆕 CoS-P-034 — rot, und es betrifft alle:** `docs-sichern.mjs sichern` stolpert über seine eigene `.git/index.lock` und committet nichts. Weg erster Wahl: das Skript durchgängig auf einen eigenen `GIT_INDEX_FILE` außerhalb des Repos legen, `git read-tree HEAD` davor. **Melden mit Commit-Hash, nicht mit „müsste jetzt gehen".** Die eigene Liste ist außerdem uncommittet — mitnehmen | niemanden |
| **Prüfmeister** | **Zuerst die Frage beantworten, die Engineering ihm zurückgegeben hat:** zählt „Altbauwohnung"/„Altbauhaus" als Zustandsaussage (**A** nur freistehendes Wort · **B** Wohnung/Haus zählen mit · **C** es braucht ein Zustandswort daneben)? Bis dahin steht A. Danach: **seine zwei Testdateien committen** (`pruefmeister-batch-47-56`, `pruefmeister-batch-79-88`, liegen seit dem 17.09.), dann **Themenspeicher-Punkt 14**. Trockenbau-Beobachtungen sammelt er nebenbei im Themenspeicher | niemanden |
| **Legal** | **🆕 CoS-L-013: nichts zu tun** — die Löschfrist ist durch Platform vollständig belegt, kein Rechtstext-Mangel, der Punkt kommt **nicht** zurück. Danach frei für die eigene Reihenfolge. **`docs-sichern.mjs` nicht selbst anfassen**, das liegt bei Platform. Bitte beim nächsten Lauf gegenprüfen, wohin das `mv` der Sperrdateien tatsächlich gelaufen ist | niemanden |
| **Marketing** | **CoS-M-017 zuerst lesen** (Trockenbau ist Richtung, wird **nirgends beworben**, bekommt keinen Termin). Dann **CoS-M-016** (Abschluss-CTA kann auf dem Handy leer bleiben), Vorschau-Umschalter raus (M-6), Hero kürzen, Reiter-Kante. Dann **CoS-M-014**, danach Zustelltest `support@`. **🆕 CoS-M-018** nur mitnehmen, wenn die Preiszeile ohnehin angefasst wird — den Wortlaut bei Legal holen, nicht selbst wählen. Website-Schalter bleibt hinter **CoS-038** | Engineering (CoS-038) |
| **Finance** | **CoS-F-009** (Vorsteuer in die Kostenübersicht, Reverse-Charge auf „durchlaufend", Voranmeldungsrhythmus als Frage für den Steuerberater) · **Behördenliste für Sandy bis 26.09.** — kürzester Vorlauf, und sie muss zum korrigierten Schritt 2 in `legal-007-plan-fuer-sandy.md` passen · **26 unbearbeitete Belege** · **CoS-F-008** · steigt Gate-1-Punkt 4.7 über die 40/100? | niemanden |

---

## Was gerade niemanden blockiert, aber nicht untergehen darf

* **🔴 Die Doku-Sicherung sichert nichts.** `docs-sichern.mjs sichern` bricht
  an der eigenen Sperrdatei ab, seit unbekannter Zeit, lautlos. **CoS-P-034.**
  `pruefen` ist nicht betroffen und meldet weiter zuverlässig.
* **🔴 Richtigstellung meiner eigenen Notiz vom 08:05-Lauf:** Ich hatte
  geschrieben, die Git-Sperrreste seien „für git harmlos". **Das war falsch.**
  Eine liegengebliebene `index.lock` blockiert den nächsten `git add` **jeder**
  Rolle. Dass die vier Commits heute durchgingen, liegt daran, dass Legal einen
  eigenen Index benutzt hat — nicht daran, dass die Sperre folgenlos wäre.
  **Der Weg, der heute nachweislich funktioniert:**
  `export GIT_INDEX_FILE=$HOME/<rolle>-index; git read-tree HEAD; git add -- <nur eigene Dateien>; git commit`.
  Er hat den Nebennutzen, dass fremde uncommittete Dateien gar nicht
  mitrutschen können.
* **🟡 Uncommittet im Arbeitsbaum, fünf Dateien — aber nicht alle gleich:**
  Engineerings `maler-sonder.ts` + `cos-e-085-…test.ts` gehören einem **jetzt
  laufenden** Vorgang; Platforms eigene Liste ist von heute früh; die zwei
  Prüfmeister-Testdateien liegen seit dem **17.09.** **`git add -A` bleibt
  abgeschafft.** Wer seine Arbeit fortsetzt, committet **seine** Dateien.
* **🟡 „Der Browser in der Claude-App kommt an beide Adressen" stimmt nicht.**
  Er stimmt für `sofortangebot.app`, **nicht** für den Landingpage-Entwurf —
  der liegt hinter Vercel Deployment Protection und antwortet mit 302 auf
  `vercel.com/login`. Der falsche Satz ging an Marketing, Finance und den
  Designer. Wer ihm folgt, hält den Login für einen eigenen Fehler.
* **🟡 Legals kleiner Fund, bewusst klein gehalten:** die **live** Preiszeile
  (`PreiseSection.tsx`) nennt „0 €" und den Monatspreis **ohne jede
  Umsatzsteuerangabe** (§ 5a UWG). Kein Gate-1-Blocker. **CoS-M-018.**
* **LR-17 ist die eigentliche Fußzeilen-Lücke, nicht DC-122.** Rechtsform,
  Registergericht, Registernummer, Vertretungsberechtigte kennt das Produkt bis
  heute nicht — weder in `companies` noch irgendwo in `src/` oder
  `supabase/migrations/`. Gebaut wird das in **CoS-E-057**, nicht vom Designer.
* **Die Vollständigkeitsprüfung warnt beim Commit** (`pre-commit`, `exit 0`,
  blockiert nichts). Wer „ist committet" meldet, ohne die
  `[pre-commit]`-Zeilen gelesen zu haben, meldet einen Stand, der bei Vercel
  rot werden kann.
* **🟡 `ci.yml` hat ein BOM, und die CI läuft trotzdem grün.** Nicht angefasst.
* **Es gibt keine echten Betriebe — nur Sandys Testkonto.**
* **Die Landingpage bewirbt drei Buchhaltungs-Anbindungen. Es sind sieben.**
  Und dieselbe Anbindung heißt an zwei Stellen verschieden.
* **`lfdm` und `lfm` stehen auf derselben Angebotszeile.** Entscheidung liegt
  bei Engineering; vor dem Umbenennen `dc050-rechenweg-pdf.test.ts` und
  `dc119-wandflaechen-konflikt.test.ts` ansehen.
* **`menge_unbekannt` ist bewusst nicht gebaut.** Offen, wer die Messung macht.
* **403 ist nicht 404.** Eine Schnittstelle, die „keine Berechtigung" sagt,
  sagt nicht „nicht vorhanden". Dieselbe Vorsicht hat heute zum zweiten Mal
  geholfen — diesmal bei einem Ordner, den es nicht gibt.

*Chief of Staff · 2026-09-21, 08:55 UTC*
