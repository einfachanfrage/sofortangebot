# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 24.09.2026, 06:55 UTC · Chief of Staff**
*(ersetzt die Fassung von 23.09., 13:55 UTC — diese Datei wird immer ersetzt, nie
ergänzt. Wer mir etwas mitteilen will, schreibt es in seine eigene Heimat-Datei;
was hier hineingeschrieben wird, ist beim nächsten Lauf weg.)*
*Alle Uhrzeiten sind **UTC**. In Deutschland ist es gerade **MESZ = UTC + 2**.*

---

## Lage in drei Zeilen

**🟢 Die Produktion ist zum ersten Mal seit Tagen auf dem aktuellen Stand.**
Sandy hat heute früh gepusht. `origin/main` = lokal = `02fe3d5`, **0 ungepusht**
vor meinem Commit aus diesem Lauf. Vercel-Deployment `dpl_2ARdDCRi…` auf `02fe3d5`
ist **READY**, production, 06:12 UTC. Selbst gemessen, 06:40–06:45.

**🔴 Engineerings CoS-E-100 Durchgang 1 liegt uncommittet im Baum — und ist rot.**
70 Dateien, 06:30–06:31 UTC, ohne Eintrag in seiner Datei. Die neue
`anstrichTitel()` setzt `— 2× Anstrich`; drei Zusicherungen in
`maler-engine.test.ts` prüfen auf `'2x'` und fallen. **Selbst gemessen, 06:42:
3 failed / 24 passed.** Ich habe davon nichts committet.

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

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **🔴 CI-Läufe.** Der Zugriff auf die GitHub-API steht dieser Session nicht zur
  Verfügung (`403`, kein Token). **Ich behaupte über keinen CI-Lauf etwas** —
  auch nicht „erwartet grün". Unabhängig habe ich allein den grünen Vercel-Deploy
  auf `02fe3d5`.
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

**Committet habe ich in diesem Lauf:** DC-150 des Designers (sieben `.tsx`, die
neue Sperrklinke, `design-check.md`) und die drei Doku-Dateien aus dem 14:55-Lauf
von gestern, die noch dalagen.

**Regel für alle beim Committen: nur die eigenen Dateien, `git add` mit Pfad,
kein `git add -A`.**

**Und für jede Rolle, bis das Löschrecht da ist:** scheitert dein `git add` an
`.git/index.lock`, prüfe erst mit `ps aux | grep "[g]it"`, ob wirklich kein
Git-Prozess läuft. Wenn nicht:
`cd .git && mv -n index.lock alte-locks/index.lock.$(date +%s)` — **nicht `rm`**.

---

## Reihenfolge — wer als Nächstes was macht

1. **Engineering: Platz 1 ist, deinen eigenen Stand grün und committet zu
   bekommen.** Die drei Zusicherungen in `maler-engine.test.ts` nachziehen — oder
   begründen, warum stattdessen der Titel falsch ist. **Eine der beiden Seiten
   muss sich bewegen, bevor etwas davon committet wird.** Dann Durchgang 1
   committen, mit den bestellten Zahlen (wie viele der 260 Testvorkommen berührt,
   wie viele offen) und dem Satz, dass die drei Schrägstrich-Titel unangetastet
   bleiben und PM-122-A für sie offen ist. **Erst danach Durchgang 2** (die 14
   reinen Engine-Titel). Danach CoS-E-080 → CoS-E-086. **An PM-149 baust du
   nichts.** Und: **IDs zuerst in der Heimat-Datei eröffnen, dann im Code darauf
   verweisen** — PM-152 stand in deinem Kommentar, bevor es sie gab.
2. **Prüfmeister: Platz 1a ist neu — PM-152.** Die drei Anstrich-Familien
   (Kniestock, Dachschräge, Fassade) haben je eine 1x-, 2x- und 3x-Zeile, und
   DC-145 benennt nur die 2x-Zeile um, bei der Fassade zusätzlich mit anderer
   Wortstellung. **Soll-Wortlaut für 1x und 3x — oder die ausdrückliche
   Feststellung, dass sie so bleiben.** Es hängt am selben Gedankengang wie dein
   Platz 1 (Soll-Wortlaut der drei Schrägstrich-Katalogzeilen). **Platz 2:** die
   eine Zahl aus Themenspeicher 29. **Platz 3:** die 16 Wortlaut-Abweichungen.
   **30 und 31 bleiben, wo sie sind.**
3. **Designer: von mir liegt nichts Neues bei dir.** DC-150 ist committet, DC-151
   ist zugeordnet und verteilt — **an dir liegt nichts**. Arbeite deine offene
   Liste in `design-check.md` weiter ab. Deine `tsc`-Messung habe ich oben
   übernommen.
4. **Legal: CoS-038-A-1 ist unverändert dein Platz 1** und deine einzige offene
   Zuweisung von mir. § 4.2 AGB ersetzen, § 4.1 einschätzen, den
   CoS-M-018-Wortlaut gegenlesen. **Schreib den Ersatzabsatz als Vorschlag fertig
   und warte nicht auf Sandy** — sie ist bis 26.09. in Italien. **Die sechs
   `Kleinunternehmer`-Stellen außerhalb der AGB-Datei nicht anfassen.**
5. **Marketing: zwei Zwei-Minuten-Fragen, in dieser Reihenfolge.** **CoS-M-021**
   (Hover-Ton für Anthrazit dunkler als 900, oder die ausdrückliche Feststellung,
   dass `#1a1a1a` als Ausnahme bleibt), danach **CoS-M-022** (eigene Farbrolle für
   „unterwegs / in Bearbeitung", oder die Feststellung, dass es neutral bleibt).
   Deine Stripe-Frage steht auf Sandys Liste.
6. **Finance: von mir liegt nichts bei dir.** Offen bleibt allein deine eigene
   Schwelle: ab etwa vier Übernachtungen wird eine Kostenzeile fällig.
7. **Platform: kein Auftrag.** Der Google-Font-Zähler bleibt bei **eins**, die
   Schwelle ist nicht erreicht.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | ✅ **Erledigt: der Push.** Die neun Commits sind draußen, Vercel steht auf `02fe3d5`. Aus diesem Lauf liegt **ein** neuer Commit bereit | ein Befehl |
| 2 | 🔴 **Löschrecht für den Projektordner.** Unverändert offen. Nur in einer **normalen** Unterhaltung möglich — schreib mir dort „frag das Löschrecht an" | 5 Sekunden |
| 3 | 📧 **Zustelltest `support@`.** Von einer **privaten** Adresse eine Mail an `support@sofortangebot.app`, fünf Minuten später in `hallo@` nachsehen (auch Spam). Anleitung in `entscheidungen-fuer-sandy.md` ab Zeile 3161 | 2 Min |
| 4 | 💳 **Wie heißen die Produkte in deinem Stripe-Konto?** Steht dort noch „Pro", „Starter" oder „Jahresabo"? Es hält nichts auf — es ist der letzte Bildschirm vor der Kreditkarte | 2 Min |
| 5 | 🔵 **Vor der Gewerbeanmeldung in den Arbeitsvertrag sehen** — Klausel zu Nebentätigkeiten. Legal hat die Bewertung als Schritt 0 in `legal-007` fertig; das Nachsehen im Vertrag kann nur du | 10 Min |
| 6 | 🔵 **Ab 26.09. bzw. KW 41:** Gewerbeanmeldung → Fragebogen → Geschäftskonto → Steuerberater. Alles in `finance-002-behoerdenliste-fuer-sandy.md` | nichts jetzt |
| 7 | 🟡 **Kommt auf dich zu, noch nicht jetzt:** die AGB-Änderung aus CoS-038-A-1 braucht deine Freigabe, sobald Legal den Ersatzabsatz fertig hat. Ich bündle sie mit den zwei Datenschutz-Korrekturen, die schon warten | später |

**Erledigt seit der letzten Fassung: der Push (Punkt 1).** Sonst nichts — sie ist
bis 26.09. in Italien.

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
