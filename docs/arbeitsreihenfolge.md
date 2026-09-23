# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 23.09.2026, 13:55 UTC · Chief of Staff**
*(ersetzt die Fassung von 23.09., 11:50 UTC — diese Datei wird immer ersetzt, nie
ergänzt. Wer mir etwas mitteilen will, schreibt es in seine eigene Heimat-Datei;
was hier hineingeschrieben wird, ist beim nächsten Lauf weg. **Das ist heute
passiert:** in der 11:50-Fassung stand eine Meldung des Prüfmeisters. Sie ist
angekommen und in seiner Datei beantwortet — aber der nächste Lauf hätte sie
gelöscht.)*
*Alle Uhrzeiten sind **UTC**. In Deutschland ist es gerade **MESZ = UTC + 2**,
also 15:55 Uhr Ortszeit.*

---

## Lage in drei Zeilen

**🟡 Die Produktion steht sieben Commits hinter uns.** `origin/main` = `ed2782c`,
lokal `2dbd722`, **7 ungepusht** — dazu mein Commit aus diesem Lauf. Vercel auf
`ed2782c` ist **READY**, aber PM-148, PM-119/L-06, die Marketing-Texte, Finance
und PM-150/151 sind **nicht** draußen. Selbst gemessen, 13:45–13:55.

**🟢 CoS-E-100 ist entschieden — die 36 Umbenennungen werden gebaut.** Engineering
hat meine Drei-Stellen-Frage mit 108 Messungen beantwortet: **kein Bestandskonto
verliert einen Preis.** Der Alt-Schlüssel ist gestrichen. Gebaut wird Engine +
Katalog + Vorlage + die drei `katalogTitel` in **einem** Commit, mit einer neuen
Sperrklinke. **Drei Schrägstrich-Titel sind ausgenommen** und liegen beim
Prüfmeister.

**🔴 Sandys Löschrecht ist von „nicht dringend" auf „blockiert stündlich"
gestiegen.** Heute lag eine tote Git-Sperre **eine Stunde und sieben Minuten** im
Ordner; in dieser Zeit konnte niemand committen. Kostet sie fünf Sekunden in
einer normalen Unterhaltung.

---

## Was seit 23.09., 11:50 UTC passiert ist

| Wer | Was | Wo |
|---|---|---|
| **Engineering** | **PM-148 gebaut und committet** (`7766149`) · **PM-119/L-06 gebaut** (`9c79ec7`), vier Sperrklinken des Prüfmeisters grün, vier seiner Zusicherungen umgeschrieben statt gelöscht · **CoS-E-100 §3 gemessen**: 108 Messungen, 33/33 Zeilen treffen nach der Umbenennung dieselbe Katalogzeile zum selben Preis · **neuer roter Fund**: 4 `katalogTitel` in `preis-ableitung.ts` vergleichen exakt und fallen sonst **still** aus | `chief-of-staff-todos.md`, `…-engineering-todos.md` |
| **Prüfmeister** | **PM-150/PM-151 committet** (`2dbd722`) — Themenspeicher 27 gemessen: von 157 bepreisten Titeln hängen **101 an mindestens einem Wort**, 9 fallen beim Kürzen auf 0,00 € · Gegenprobe zu DC-145: **36 von 36 unverändert** am Katalog eines echten Betriebs | `pruefmeister-restliste.md`, `vokabular-abgleich.md` |
| **Designer** | **DC-146 + DC-147 gebaut** (57 UI-Dateien, Hover-Regel und die zwei fehlenden Farbrollen; 13 Rechtsseiten-Links von 2,11:1 auf 13,02:1) · **DC-148**: seine eigene DC-145-Regel korrigiert, nachdem der Prüfmeister sie beanstandet hat | `design-check.md` |
| **Marketing** | Testphasen-Texte abgenommen und die Reste des abgelösten Tarif-Modells von den Kundenflächen genommen (`23ae5fa`) · **neue Zwei-Minuten-Frage an Sandy**: wie heißen die Produkte in Stripe? | `…-marketing-todos.md`, `entscheidungen-fuer-sandy.md` |
| **Finance** | Fragebogen-Zahlen nachgerechnet, Gewinn 2026/2027 korrigiert, Reserve-Spanne aktualisiert (`7d37f3b`) | `…-finance-todos.md` |
| **CoS (13:55)** | **CoS-E-100 entschieden** · die drei Schrägstrich-Titel an den Prüfmeister zurückgegeben · Themenspeicher 29 mit einer Messfrage versehen · **CoS-M-021** aufgemacht (Handbuch-Lücke) · **59 Dateien committet** (Designer + Marketing + Doku) · Löschrecht-Eskalation auf Sandys Liste · diese Datei ersetzt | Rollen-Dateien |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, 13:45–13:55 UTC:**

* **`git fetch` + `git rev-list origin/main..HEAD`: 7.** `origin/main` =
  `ed2782c`, lokal `2dbd722`. **Die Produktion ist sieben Commits alt.**
* **Vercel über die API:** jüngstes Deployment `dpl_4q4ArxJv…` / `ed2782c` /
  **READY** / production. Seit 11:14 UTC kein neues Deployment.
* **Die 57 UI-Dateien vor dem Commit geprüft, auf genau den Fehler, der bei einem
  Klassen-Umbau auftritt:** alle neu benutzten Utilities (`bg-sunken`,
  `text-accent`, `hover:bg-sunken`, `hover:text-accent`, die
  `disabled:hover:`-Varianten) haben einen Token im `@theme inline`-Block, **129
  Vorkommen, kein Waisenkind**; `text-signal-yellow` kommt **null**-mal mehr vor;
  `bg-accent` nur im erklärenden Kommentar; die drei von Marketing importierten
  Konstanten stehen **committet** in `src/lib/pricing.ts`.
* **Zwei tote Git-Sperren** (`index.lock`, `HEAD.lock`, 0 Byte, 13:25, kein
  laufender Git-Prozess) nach `.git/alte-locks/` geschoben, nicht gelöscht.
* **ENDE-Markierung** aller sechs von mir berührten Dateien nach dem Schreiben
  nachgesehen: alle sechs in Ordnung.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **🔴 CI-Läufe.** Der Zugriff auf die GitHub-API steht dieser Session nicht zur
  Verfügung (`403`, kein Token). **Ich behaupte über keinen CI-Lauf etwas** —
  auch nicht „erwartet grün". Unabhängig habe ich allein den grünen Vercel-Deploy
  auf `ed2782c`.
* **`npm run typecheck`, `npm run lint:ci`, voller Prüfstand.** Brechen auf
  diesem Mount an der Zeitgrenze ab. Unverändert. **Der erste CI-Lauf nach
  Sandys Push ist die erste echte Prüfung der 57 UI-Dateien.**
* **Engineerings 108 Messungen.** Seine Messung, nicht nachgefahren. Die
  Gegenprobe am Katalog eines echten Betriebs ist die des Prüfmeisters.
* **Die Zahlen aus PM-150/151** (101 von 157, 9 auf 0,00 €). Seine Messung.
* **Die 13 Kontrastwerte aus DC-147.** Angaben des Designers.
* **Gate 1 rechne ich nicht neu. Stand bleibt 54,2 %.** Themenspeicher 29 (43 von
  184 Engine-Titeln ohne Gewerk) kann das ändern — aber erst, wenn die Zahl
  dasteht, die ich beim Prüfmeister angefragt habe: wie viele der 43 ein Betrieb
  mit `maler` oder `boden_parkett` überhaupt erreicht.
* **Kein Blick ins laufende Produkt. Siebzehnter Lauf in Folge.**
* **Versicherung, Stripe, Gewerbeanmeldung, Buchhaltungs-Testlauf,
  OneDrive-Sicherung** — nicht angefasst.

---

## 🟡 Was uncommittet im Arbeitsbaum liegt

**Nichts.** Ich habe in diesem Lauf alles committet, was dalag — 57 UI-Dateien
aus zwei Händen (Designer, Marketing), das neue Messskript von Engineering und
die Doku-Dateien. **Es liegen jetzt 9 Commits ungepusht.**

**Regel für alle beim Committen: nur die eigenen Dateien, `git add` mit Pfad,
kein `git add -A`.**

**Und für jede Rolle, bis das Löschrecht da ist:** scheitert dein `git add` an
`.git/index.lock`, prüfe erst mit `ps aux | grep "[g]it"`, ob wirklich kein
Git-Prozess läuft. Wenn nicht:
`cd .git && mv -n index.lock alte-locks/index.lock.$(date +%s)` — **nicht `rm`**.

---

## Reihenfolge — wer als Nächstes was macht

1. **Engineering:** **PM-147-A + CoS-E-100 in einem Durchgang.** Die
   Vormessung entfällt, deine Frage ist entschieden: Engine, Katalog, Vorlage
   **und** die vier `katalogTitel` in **einem** Commit, plus die neue
   Zusicherung *jeder `katalogTitel` trifft eine Zeile in `DEFAULT_PRICES`*.
   **Die drei Schrägstrich-Titel bleiben unangetastet, PM-122-A bleibt für sie
   offen** — schreib das im Commit so hin. Lies vorher **DC-148**: der zweite
   Halbsatz von R5 ist zurückgezogen. Danach **CoS-E-080 → CoS-E-086**. **An
   PM-149 baust du nichts.**
2. **Prüfmeister:** **Platz 1 ist neu und klein:** ein **Soll-Wortlaut für die
   drei Schrägstrich-Katalogzeilen** (`Isoliergrund gegen Nikotin / Ruß /
   Wasserflecken`, `Boden schützen / Abdeckfolie`, `Betonwände schleifen /
   Untergrundvorbereitung`). Der Designer schlägt dafür bewusst nichts vor —
   es ist eine Katalogfrage, und der Katalog gehört dir. Gemessen wie immer,
   kein Bauauftrag. **Platz 2: Themenspeicher 29**, aber zuerst nur die eine
   Zahl — **wie viele der 43 gewerklosen Engine-Titel erreicht ein Betrieb mit
   `maler` oder `boden_parkett`?** Davon hängt ab, ob es Gate 1 ist oder hinter
   Gate 1 gehört. **30 und 31** bleiben, wo sie sind.
3. **Designer:** **von mir liegt nichts Neues bei dir.** DC-146/147 sind
   committet, DC-148 ist angenommen und geht so an Engineering. Deine
   Handbuch-Lücke (`#1a1a1a`) liegt als **CoS-M-021** bei Marketing — bis der
   Ton dasteht, bleibt der Wert stehen. Arbeite deine offene Liste in
   `design-check.md` weiter ab.
4. **Legal:** **CoS-038-A-1 ist unverändert dein Platz 1** und deine einzige
   offene Zuweisung von mir. § 4.2 AGB ersetzen, § 4.1 einschätzen, den
   CoS-M-018-Wortlaut gegenlesen. **Schreib den Ersatzabsatz als Vorschlag
   fertig und warte nicht auf Sandy** — sie ist bis 26.09. in Italien. **Die
   sechs `Kleinunternehmer`-Stellen außerhalb der AGB-Datei nicht anfassen.**
5. **Marketing:** **CoS-M-021** — ein Hover-Ton für Anthrazit dunkler als 900,
   oder die ausdrückliche Feststellung, dass `#1a1a1a` als Ausnahme bleibt.
   Beides ist in Ordnung; ein Farbwert ohne Rolle ist es nicht. Deine zwei
   Kundenflächen sind committet. Deine Stripe-Frage steht auf Sandys Liste.
6. **Finance:** von mir liegt nichts bei dir. Offen bleibt allein deine eigene
   Schwelle: ab etwa vier Übernachtungen wird eine Kostenzeile fällig.
7. **Platform:** **kein Auftrag.** Der Google-Font-Zähler bleibt bei **eins**,
   die Schwelle ist nicht erreicht. Hinweis ohne Auftrag: die nächste Spitze
   trägt 57 ungeprüfte UI-Dateien.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🔵 **Einmal pushen.** **9 Commits** liegen bereit, die Produktion ist sieben Commits alt. Block steht im Chat | ein Befehl |
| 2 | 🔴 **Löschrecht für den Projektordner.** **Neu hochgestuft:** heute lag eine tote Git-Sperre 1 h 07 min im Ordner, in der Zeit konnte niemand committen. Nur in einer **normalen** Unterhaltung möglich — schreib mir dort „frag das Löschrecht an" | 5 Sekunden |
| 3 | 📧 **Zustelltest `support@`.** Von einer **privaten** Adresse eine Mail an `support@sofortangebot.app`, fünf Minuten später in `hallo@` nachsehen (auch Spam). Anleitung in `entscheidungen-fuer-sandy.md` ab Zeile 3161 | 2 Min |
| 4 | 💳 **Neu (Marketing): Wie heißen die Produkte in deinem Stripe-Konto?** Steht dort noch „Pro", „Starter" oder „Jahresabo"? Es hält nichts auf — es ist nur der letzte Bildschirm vor der Kreditkarte | 2 Min |
| 5 | 🔵 **Vor der Gewerbeanmeldung in den Arbeitsvertrag sehen** — Klausel zu Nebentätigkeiten. Legal hat die Bewertung als Schritt 0 in `legal-007` fertig; das Nachsehen im Vertrag kann nur du | 10 Min |
| 6 | 🔵 **Ab 26.09. bzw. KW 41:** Gewerbeanmeldung → Fragebogen → Geschäftskonto → Steuerberater. Alles in `finance-002-behoerdenliste-fuer-sandy.md` | nichts jetzt |
| 7 | 🟡 **Kommt auf dich zu, noch nicht jetzt:** die AGB-Änderung aus CoS-038-A-1 braucht deine Freigabe, sobald Legal den Ersatzabsatz fertig hat. Ich bündle sie mit den zwei Datenschutz-Korrekturen, die schon warten | später |

**Erledigt seit der letzten Fassung:** nichts von Sandys Liste — sie ist bis
26.09. in Italien. Der Push von heute Morgen ist durch, aber es liegen wieder
neun Commits.

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
