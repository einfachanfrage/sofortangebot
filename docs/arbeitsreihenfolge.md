# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 24.09.2026, 07:15 UTC · Chief of Staff**
*(zwei Nachträge aus einem zweiten Lauf um 06:55: die CI-Aussage war falsch und ist
richtiggestellt, und Marketings Landingpage-Fund liegt jetzt beim Designer.)*
*(ersetzt die Fassung von 23.09., 13:55 UTC — diese Datei wird immer ersetzt, nie
ergänzt. Wer mir etwas mitteilen will, schreibt es in seine eigene Heimat-Datei;
was hier hineingeschrieben wird, ist beim nächsten Lauf weg.)*
*Alle Uhrzeiten sind **UTC**. In Deutschland ist es gerade **MESZ = UTC + 2**.*

---

## Lage in drei Zeilen

**🟢 Die Produktion ist auf dem aktuellen Stand — Sandy hat heute früh gepusht.**
`origin/main` = `02fe3d5`, Vercel-Deployment `dpl_2ARdDCRi…` darauf **READY**,
production, 06:12 UTC. Selbst gemessen, 06:40–06:45. **Danach sind in diesem Lauf
zwei Commits dazugekommen: `2b95fdb` und `6e2899c` — 2 ungepusht.**

**🟡 Engineerings CoS-E-100 Durchgang 1 liegt weiter uncommittet im Baum — die
drei roten Zusicherungen hat er inzwischen nachgezogen.** 70 Dateien,
06:30–06:31 UTC. Die neue `anstrichTitel()` setzt `— 2× Anstrich`; drei
Zusicherungen in `maler-engine.test.ts` prüften auf `'2x'` und fielen (**selbst
gemessen, 06:42: 3 failed / 24 passed**). Um 07:05 stehen sie auf `'2×'` bzw.
`'2× Anstrich'` — **nachgezogen, aber noch nicht committet und noch ohne Eintrag
in seiner Datei.** Ich habe davon nichts committet.

**🟢 DC-150 des Designers ist fertig, gemessen und committet.** Die zwei
erfundenen Töne aus DC-149 sind aus sieben Dateien raus, mit eigener Sperrklinke.

---

## Was seit 23.09., 13:55 UTC passiert ist

| Wer | Was | Wo |
|---|---|---|
| **Sandy** | **gepusht** — die neun Commits sind draußen, Vercel steht auf `02fe3d5` | — |
| **CoS (23.09., 14:50/14:55)** | DC-149 committet (`02fe3d5`) · **CoS-E-100 Zuschnitt auf A1 entschieden** (21 Katalogzeilen + 4 `katalogTitel` + 3 Vorlagen in Durchgang 1, die 14 reinen Engine-Titel als Durchgang 2) · Punkt 3 des eigenen Auftrags als falsch begründet zurückgenommen · **CoS-M-022** aufgemacht (Farbrolle für „Beim Kunden") · dem Prüfmeister Platz 3 gegeben (16 Wortlaut-Abweichungen) | Rollen-Dateien |
| **Designer (24.09., 06:22–06:34)** | **DC-150 gebaut**: `#8B7000` und `#1A7A38` aus sieben Dateien entfernt, Anthrazit auf Gelb-100 statt Dunkelgelb auf Gelb-Deckkraft, neue Sperrklinke `dc150-erfundene-toene.test.ts` · **DC-151** gemeldet: drei rote Tests in `maler-engine.test.ts` | `design-check.md` |
| **Engineering (24.09., 06:30–06:31)** | **CoS-E-100 Durchgang 1 in den Baum geschrieben** — `anstrichTitel()` in `maler.ts`, `default-prices.ts`, `preis-ableitung.ts`, `preise-vorlagen.ts`, ~40 nachgezogene Testdateien. **Uncommittet, undokumentiert, drei Zusicherungen rot** | — (noch kein Eintrag) |
| **CoS (24.09., 06:55)** | DC-151 zugeordnet und richtiggestellt · Engineering die drei roten Zusicherungen gemeldet · **PM-152 eröffnet** (Engineering hatte die ID im Code-Kommentar vergeben, ohne dass sie existierte) · DC-150 committet · diese Datei ersetzt | Rollen-Dateien |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, 06:40–06:45 UTC:**

* **`git fetch` + `git rev-list origin/main..HEAD`: 0.** `origin/main` = lokal =
  `02fe3d5`. **Der Push ist durch.**
* **Vercel über die API:** `dpl_2ARdDCRi…` / `02fe3d5` / **READY** / production /
  06:12 UTC. Das ist derselbe Commit, auf dem wir lokal stehen.
* **`npx vitest run src/lib/mengen/__tests__/maler-engine.test.ts`: 3 failed,
  24 passed**, 06:42 UTC. Meldung in allen drei Fällen
  `expected '… — 2× Anstrich — …' to contain '2x'`.
* **Die Zuordnung dieser drei Tests**: am committeten Stand `02fe3d5` baut
  `maler.ts` den Titel aus `` `${anstriche}x` `` — die Zusicherung geht dort auf.
  Der Fall ist durch Engineerings uncommitteten Durchgang entstanden.
* **`PM-152` in den Prüfmeister-Dateien vor diesem Lauf: null Treffer** in
  `pruefmeister-restliste.md` und `pruefmeister-testfaelle.md`.
* **Die sieben `.tsx` des Designers durchgesehen**: keine Titelzeile angefasst,
  nur Farbklassen — seine Aussage in DC-151 stimmt.
* **ENDE-Markierung** aller drei von mir berührten Dateien nach dem Schreiben
  nachgesehen: in Ordnung.

* **🟢 CI-Läufe — Korrektur einer stehenden Falschaussage von mir.** In achtzehn
  Fassungen stand hier, die GitHub-API sei dieser Session nicht zugänglich
  (`403`, kein Token). **Das stimmt nicht mehr. Selbst gemessen, 06:44 UTC:**
  `api.github.com/repos/einfachanfrage/sofortangebot/actions/runs` → **HTTP 200,
  ohne Token**. **Lauf 238 auf `02fe3d5`: success, 06:12 UTC** — derselbe Commit,
  auf dem `origin/main`, der lokale Stand vor diesem Lauf und das
  Vercel-Production-Deployment stehen. **Sandys Push ist durch die CI und grün**,
  die 57 UI-Dateien vom 23.09. sind damit geprüft, nicht nur deployt. Davor:
  237/236/235/234 grün, **233 rot** (der bekannte vom 23.09., Schritt 11).
  Einzelheiten in `chief-of-staff-platform-todos.md`.
* **🟡 Neuer Fund von Marketing, von mir an den Designer gegeben:** **neun
  Textstellen auf der Landingpage unter 4,5:1**, alle über Deckkraft statt über
  eine Farbrolle abgestuft. **Datei und Zeile aller neun selbst nachgeprüft, alle
  neun stimmen** (19 `text-white` in `src/components/landing/`, 13 davon mit
  Deckkraft). **Und der Teil, der Marketing nicht aufgefallen ist: die zwei
  Rollen, mit denen sie beheben wollen (`--text-on-dark`,
  `--text-on-dark-muted`), gibt es im Code nicht** — null Treffer für `on-dark`
  und `BDBDB8` in `globals.css`, selbst gemessen 06:53. Der Designer legt erst
  die zwei Tokens an. **Kein Blocker für 9.1.**

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Die Job-Schritte innerhalb von CI-Lauf 238.** Ich habe das Gesamtergebnis
  der Läufe gelesen, nicht die Schritt-Logs.
* **Marketings Kontrastzahlen** zu den neun Landingpage-Stellen (1,91:1 …
  3,56:1). Ihre Rechnung, nicht nachgerechnet — die Fundstellen selbst schon.
* **`npx vitest run` über das ganze Projekt** bricht auf diesem Mount an der
  Zeitgrenze ab. **Korrektur gegenüber der letzten Fassung:** `npx tsc --noEmit`
  über das ganze Projekt läuft durch (Exit 0) — das ist die Messung des
  Designers aus DC-151, nicht meine.
* **Engineerings 108 Messungen und seine Preis-Scores** zu den drei
  Anstrich-Familien. Seine Messung, nicht nachgefahren.
* **Die Kontrastwerte aus DC-150** (3,82:1 / 3,99:1 / 4,06:1 / 4,22:1 und die
  Gegenrechnung zu `--text-accent`). Angaben des Designers.
* **Gate 1 rechne ich nicht neu. Stand bleibt 54,2 %.** Themenspeicher 29 und
  PM-152 können das bewegen — erst, wenn die Zahlen dastehen.
* **Kein Blick ins laufende Produkt. Achtzehnter Lauf in Folge.**
* **Versicherung, Stripe, Gewerbeanmeldung, Buchhaltungs-Testlauf,
  OneDrive-Sicherung** — nicht angefasst.

---

## 🟡 Was uncommittet im Arbeitsbaum liegt

**Engineerings 70 Dateien aus CoS-E-100 Durchgang 1.** Ich habe sie bewusst
liegen lassen: sie sind rot, und es steht kein Eintrag von ihm dazu. Sie gehören
ihm, nicht mir.

**Committet wurde in diesem Lauf:** `2b95fdb` = DC-150 des Designers (sieben
`.tsx`, die neue Sperrklinke) und die Doku-Dateien — `6e2899c` = der
Finance-Stand plus mein DC-150-Nachtrag (siehe die Korrektur oben, die Nachricht
dieses Commits stimmt nicht).

**Außerdem liegen im Baum:** Marketings neue `docs/ci-handbuch-nachtraege.md`
(untracked) und weitere Finance-Änderungen. Beides gehört nicht mir.

**Regel für alle beim Committen: nur die eigenen Dateien, `git add` mit Pfad,
kein `git add -A`.**

**Und für jede Rolle, bis das Löschrecht da ist:** scheitert dein `git add` an
`.git/index.lock`, prüfe erst mit `ps aux | grep "[g]it"`, ob wirklich kein
Git-Prozess läuft. Wenn nicht:
`cd .git && mv -n index.lock alte-locks/index.lock.$(date +%s)` — **nicht `rm`**.

---

## 🔴 Zwei Vorfälle aus diesem Lauf, die jede Rolle angehen

**1. Mehrere Rollen haben gleichzeitig committet — und `6e2899c` trägt deshalb
eine Nachricht, die nicht zu seinem Inhalt passt.** Die Nachricht spricht von
DC-150/DC-151/PM-152; die liegen in **`2b95fdb`**. Im Index lagen beim Commit
zusätzlich Finance-Dateien (`chief-of-staff-finance-todos.md`,
`entscheidungen-fuer-sandy.md`, `finance-001-…`, `scripts/jahresausleitung.mjs`)
— **die sind der eigentliche Inhalt von `6e2899c`**, zusammen mit meinem
DC-150-Nachtrag. Ich habe versucht, die Nachricht mit `--amend` zu berichtigen;
das ist an Vorfall 2 gescheitert. **Diese Zeilen hier sind die Korrektur.**
Der Inhalt ist vollständig und nichts ist verloren — nur die Beschriftung von
`6e2899c` stimmt nicht.

**2. `.git/index` stand um 06:51 auf 0 Byte.** Zwei Läufe haben gleichzeitig
geschrieben; danach beantwortete jedes `git status` und jedes `git commit` nur
noch `fatal: .git/index: index file smaller than expected`. **Mit
`git read-tree HEAD` neu aufgebaut, 07:08 UTC — Commits, Objekte und
Arbeitsbaum unberührt, nichts verloren.** Wenn dich dieselbe Meldung trifft:
`cd .git && mv -n index alte-locks/index.kaputt.$(date +%s)` und dann
`git read-tree HEAD`. **Nicht neu klonen, nicht `reset --hard`.**

**Die Regel, die daraus folgt, für alle:** vor jedem `git commit` einmal
`git diff --cached --name-only` und gegen die eigene Liste halten. Liegt etwas
Fremdes drin, wieder raus mit `git restore --staged <pfad>` — committ es nicht
mit.


---

## Reihenfolge — wer als Nächstes was macht

1. **Engineering: Platz 1 ist, deinen eigenen Stand committet zu bekommen.**
   Die drei Zusicherungen in `maler-engine.test.ts` hast du um 07:05 auf `2×`
   nachgezogen — **lass die Datei einmal laufen und schreib die Zahl in die
   Commit-Nachricht**, ich habe deinen Stand nach der Änderung nicht mehr
   gemessen und behaupte deshalb nichts darüber. Dann Durchgang 1
   committen, mit den bestellten Zahlen (wie viele der 260 Testvorkommen berührt,
   wie viele offen) und dem Satz, dass die drei Schrägstrich-Titel unangetastet
   bleiben und PM-122-A für sie offen ist. **Erst danach Durchgang 2** (die 14
   reinen Engine-Titel). Danach CoS-E-080 → CoS-E-086. **An PM-149 baust du
   nichts.** Und: **IDs zuerst in der Heimat-Datei eröffnen, dann im Code darauf
   verweisen** — PM-152 stand in deinem Kommentar, bevor es sie gab.
2. **Prüfmeister: Platz 1, 1a, 2 und 3 sind am 24.09., 07:10 UTC erledigt.**
   Antworten in `pruefmeister-restliste.md`, Tabellen in
   `vokabular-abgleich.md`, Zusicherungen **PM-152** (8 grün) und
   **PM-153/154/155** (13 grün). Platz 1 und 2 sind gegen `02fe3d5` gemessen,
   PM-152 gegen den Arbeitsbaum mit Engineerings Umbau — steht so dabei. Kurz:
   **Soll-Wortlaut steht für alle drei Schrägstrich-Titel**, kein Preis bewegt
   sich (36 Messungen); zwei der drei sind gar keine Katalogzeilen, und nur
   beim Isoliergrund wird der Katalog mit umbenannt — dann aber auch
   `preis-ableitung.ts` Z. 155. **PM-152: 1x und 3x folgen dem 2x-Muster**
   (`— 1× Anstrich` / `— 3× Anstrich`), Preis in allen sechs Fällen
   unverändert; dabei sind Manfreds Fassaden-Zwillinge (TN-095) wieder
   aufgetaucht. **Themenspeicher 29: 43 von 43 — es ist Gate 1**, und die
   größere Klasse sind 44 Titel, die ihr Gewerk durch ein fehlendes Wort
   verlieren (bis 650,00 €/m²). **Die 16 Vorlagen-Abweichungen bewegen kein
   Geld.** **Ohne neue Zuweisung** arbeite ich an Themenspeicher **30/31/32**
   und an der Fallbasis weiter.
3. **Designer: doch, jetzt liegt etwas Neues bei dir — die neun Landingpage-
   Stellen.** DC-150 ist committet (`2b95fdb`, deine Sperrklinke vor dem Commit
   selbst gefahren: **29 passed / 0 failed**), DC-151 ist zugeordnet. **Neu:**
   Marketings Fund von neun Textstellen unter 4,5:1 in
   `src/components/landing/`, abgestuft über Deckkraft statt über eine
   Farbrolle — dieselbe Sache, die du in DC-149 beanstandet hast. **Erst die
   zwei fehlenden Tokens anlegen** (`--color-text-on-dark`,
   `--color-text-on-dark-muted` — es gibt sie im Code nicht), dann umstellen,
   dann Sperrklinke. Voller Auftrag in `design-check.md`. **Nach deiner
   laufenden Liste, nicht davor — kein Blocker für 9.1.** Deine `tsc`-Messung
   habe ich oben übernommen.
4. **Legal: CoS-038-A-1 ist unverändert dein Platz 1** und deine einzige offene
   Zuweisung von mir. § 4.2 AGB ersetzen, § 4.1 einschätzen, den
   CoS-M-018-Wortlaut gegenlesen. **Schreib den Ersatzabsatz als Vorschlag fertig
   und warte nicht auf Sandy** — sie ist bis 26.09. in Italien. **Die sechs
   `Kleinunternehmer`-Stellen außerhalb der AGB-Datei nicht anfassen.**
5. **Marketing: zwei Zwei-Minuten-Fragen, in dieser Reihenfolge.** **CoS-M-021**
   (Hover-Ton für Anthrazit dunkler als 900, oder die ausdrückliche Feststellung,
   dass `#1a1a1a` als Ausnahme bleibt), danach **CoS-M-022** (eigene Farbrolle für
   „unterwegs / in Bearbeitung", oder die Feststellung, dass es neutral bleibt).
   Deine Stripe-Frage steht auf Sandys Liste. **Deine neue Datei
   `docs/ci-handbuch-nachtraege.md` liegt untracked im Baum** — ich habe sie
   nicht committet, weil ich nicht beurteilen kann, ob sie fertig ist. Nimm sie
   beim nächsten eigenen Commit mit.
6. **Finance: von mir liegt nichts bei dir.** Offen bleibt allein deine eigene
   Schwelle: ab etwa vier Übernachtungen wird eine Kostenzeile fällig.
7. **Platform: kein Auftrag.** Der Google-Font-Zähler bleibt bei **eins**, die
   Schwelle ist nicht erreicht.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | ✅ **Erledigt: der Push.** Die neun Commits sind draußen, Vercel steht auf `02fe3d5`. Aus diesem Lauf liegen **zwei** neue Commits bereit (`2b95fdb`, `6e2899c`) | ein Befehl |
| 2 | 🔴 **Löschrecht für den Projektordner.** Unverändert offen. Nur in einer **normalen** Unterhaltung möglich — schreib mir dort „frag das Löschrecht an" | 5 Sekunden |
| 3 | 📧 **Zustelltest `support@`.** Von einer **privaten** Adresse eine Mail an `support@sofortangebot.app`, fünf Minuten später in `hallo@` nachsehen (auch Spam). Anleitung in `entscheidungen-fuer-sandy.md` ab Zeile 3161 | 2 Min |
| 4 | 💳 **Wie heißen die Produkte in deinem Stripe-Konto?** Steht dort noch „Pro", „Starter" oder „Jahresabo"? Es hält nichts auf — es ist der letzte Bildschirm vor der Kreditkarte | 2 Min |
| 5 | 🔵 **Vor der Gewerbeanmeldung in den Arbeitsvertrag sehen** — Klausel zu Nebentätigkeiten. Legal hat die Bewertung als Schritt 0 in `legal-007` fertig; das Nachsehen im Vertrag kann nur du | 10 Min |
| 6 | 🔵 **Ab 26.09. bzw. KW 41:** Gewerbeanmeldung → Fragebogen → Geschäftskonto → Steuerberater. Alles in `finance-002-behoerdenliste-fuer-sandy.md` | nichts jetzt |
| 7 | 🟡 **Kommt auf dich zu, noch nicht jetzt:** die AGB-Änderung aus CoS-038-A-1 braucht deine Freigabe, sobald Legal den Ersatzabsatz fertig hat. Ich bündle sie mit den zwei Datenschutz-Korrekturen, die schon warten | später |

**Erledigt seit der letzten Fassung: der Push (Punkt 1).** Sonst nichts — sie ist
bis 26.09. in Italien.

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
