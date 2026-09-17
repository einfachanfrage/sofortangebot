# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 17.09.2026, 09:50 UTC · Chief of Staff**
*(ersetzt die Fassung von 09:00 UTC — diese Datei wird immer ersetzt, nie ergänzt.)*
*Alle Uhrzeiten in dieser Fassung sind **UTC**.*

---

## Lage in drei Zeilen

**Alles Gepushte ist grün, und es hat sich seit 09:00 nichts daran geändert.**
CI-Lauf **#206 grün** auf `da7db10`, Produktion läuft auf demselben Stand
(Vercel **READY**, 07:35). **Neun Commits liegen ungepusht** — acht von vorher,
einer aus diesem Lauf.

**Der Designer hat wieder gebaut, wieder unversandt** (DC-121, Logo im
Angebotskopf) — nachgemessen und committet.

**Die Ursache, warum Einträge mitten in Dateien landen, ist gefunden und
behoben.** Engineerings Fund. Die Markierung am Dateiende kam in sechs von
neun Dateien mehrfach vor — jetzt in jeder genau einmal.

---

## Was seit 09:00 UTC passiert ist

| Rolle | Ergebnis | Status |
|---|---|---|
| Designer | **DC-121 gebaut** — das Logo im Angebotskopf richtet sich ab jetzt über die **Höhe** aus, nicht über die Breite. Die Schalter „Größe" und „Position" im Briefpapier wirken zum ersten Mal | ✅ gebaut, war unversandt, von mir nachgemessen und committet (`5603d53`) |
| Engineering | **PM-075 gebaut** (Duschnische, 1 Stück, 95,00 €) und ein **🔴 Befund beim Messen**: drei Bad-Wandpositionen laufen über den Maler und finden dort keinen Katalogtreffer | ✅ erledigt, Messbitte liegt beim Prüfmeister |
| Engineering | **🔴 Ursache gefunden, warum Einträge mitten in Dateien landen:** die Markierung am Dateiende steht in mehreren Dateien auch im Fließtext | ✅ gemeldet |
| CoS | **Diesen Befund entschieden und behoben** — jede zitierte Fundstelle umgeschrieben, sechs Dateien, **CoS-E-077** | ✅ erledigt |
| CoS | **DC-121 abgenommen**, die drei offenen Punkte des Designers bekommen Nummern: **DC-122 / DC-123 / DC-124** | ✅ erledigt |
| CoS | **CoS-L-011** an Legal — die Rechtsfrage aus DC-122 abgetrennt (dürfen freie Fußzeilen die Pflichtangaben ersetzen?) | ✅ erledigt |
| CoS | **Korrektur beim Prüfmeister** — meine eigene Zeile von 09:00 („die einzige offene Sache") stimmte seit 09:07 nicht mehr | ✅ erledigt |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, nicht vermutet:**

* **CI-Lauf-Liste über die GitHub-API (`branch=main`):** **#206 grün**
  (`da7db10`, 07:35), der zweite Arbeitsablauf **#59 grün** (07:37), davor
  #205/#204/#203/#202 grün. **Kein neuer Lauf seit 07:37** — es wurde nichts
  gepusht.
* **Vercel-Deploy-Liste:** Produktion **READY** auf `da7db10`, 07:35.
  **Kein neuer Deploy seit dem letzten Durchlauf.**
* **`git log origin/main..main`:** **neun** Commits ungepusht.
* **Die Arbeit des Designers vollständig selbst nachgemessen**, bevor ich sie
  committe: `npx tsc --noEmit -p tsconfig.json` **fehlerfrei** · die **6**
  Testdateien, die `lib/pdf` oder `AngebotVorschau` einlesen, **49 grün**,
  davon **9 neu** aus `dc121-logo-kopf.test.ts` · `eslint` über die fünf
  geänderten Dateien **0 Fehler, 4 Warnungen** (Bestand).
* **Die ENDE-Markierungen in allen neun Doku-Dateien gezählt**, vor und nach
  dem Eingriff: vorher 4/3/2/2/2/2/1/1/1, jetzt **überall genau 1**.
* **`node scripts/docs-sichern.mjs pruefen`** nach jedem Eingriff: **„Alle 57
  Doku-Dateien in Ordnung."**
* **`entscheidungen-fuer-sandy.md` frisch gelesen**, bevor ich unten „offen"
  schreibe — der letzte Eintrag ist meiner von 08:55, nichts ist beantwortet
  worden.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Gate 1 rechne ich nicht neu.** Stand bleibt **53,0 %**. Legals 7.13 und
  inzwischen vier DC-Punkte sind noch nicht eingerechnet — das gehört in einen
  Lauf, in dem ich `launch-readiness.md` ganz durchgehe, nicht nebenbei.
* **Den Preisweg eines Badangebots habe ich NICHT nachgefahren.** Ob bei den
  Wandpositionen eine Null steht, weiß niemand — auch Engineering behauptet es
  ausdrücklich nicht. Das misst der Prüfmeister.
* **Wie die drei Logo-Stufen mit einem echten Logo auf Papier wirken**, ist
  ungeprüft. Ein Prüfstand misst, dass ein PDF entsteht, nicht wie es aussieht.
* **Die restlichen ~160 Testdateien** habe ich in diesem Lauf nicht gefahren,
  nur die sechs betroffenen.
* **Die Landingpage selbst habe ich nicht aufgerufen.**
* **Warum Lauf #201 rot war**, bleibt unbekannt — der Detail-Endpunkt der
  GitHub-API antwortet weiter `403`, es braucht ein Token aus Sandys Konto.
* **Versicherung, Stripe, Gewerbeanmeldung, Vercel-Benachrichtigung** — in
  diesem Lauf nicht angefasst.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🟡 **Pushen.** **Neun Commits** liegen bereit. | ein Befehl |
| 2 | 🔴 **Preis bei § 19 (A/B), F-006** — tendiert zu **B** (Regelbesteuerung). **Die Landingpage darf vorher nicht live gehen.** | ein Satz |
| 3 | 🟢 **Datenschutz-Halbsatz freigeben (L-KI-01).** „unwiderruflich entfernt" stimmt nicht, solange OpenAI 30 Tage vorhalten darf. Wortlaut liegt fertig vor. Empfehlung: ja. | ein Wort |
| 4 | 🟡 **F-007:** Gibt es eine laufende Sicherung deines Rechners, und liegt der Projektordner mit drin? | ein Satz |
| 5 | 🟡 **IONOS-Weiterleitung `rechnung@`** — selbst machen oder ich? Empfehlung: selbst. | ein Satz |
| 6 | 🟡 **CoS-P-013** — ging „Passwort speichern" durch und konntest du dich danach neu anmelden? **Wenn du das ohnehin durchklickst: schau dir dabei die Anmelde-Seiten am großen Bildschirm an.** | ein Wort |
| 7 | 🔵 **Buchhaltungs-Testlauf** (Lexware Office) · **E-Rechnungs-Viewer** (Quba, 0 €) | nicht eilig |
| 8 | Vercel-Benachrichtigung · Versicherung · Stripe · Gewerbeanmeldung KW 41 (CoS-041) | unverändert, in diesem Lauf nicht geprüft |

**Erledigt und weg von ihrer Liste:** nichts.

**Beiläufig, kostet sie nichts:** wenn sie das nächste Mal ohnehin ein Angebot
als PDF öffnet, sieht sie das neue Kopflogo. Eine eigene Aufgabe ist es nicht.

---

## Wer als Nächstes dran ist

| Rolle | Nächstes | Wartet auf |
|---|---|---|
| **Prüfmeister** | **Neu oben auf seiner Spur: die Bad-Messung.** Steht auf einem gewöhnlichen Badangebot bei den **Wandpositionen** ein Preis oder eine Null? Danach die Kalkulationsfrage zur einmaligen Baustellenreinigung (40,00 € Pauschale oder Fehlt-Eintrag), danach L-06. | niemanden |
| **Engineering** | **Der Engpass, unverändert. CoS-E-074** (deckt PM-097 **und** PM-116 — einmal bauen statt zweimal), die Dateien sind jetzt frei. Danach Zug 2 mit der **Tapezier-Nische** (6,00 €/lfdm, zwei Auflagen). | niemanden |
| **Designer** | **Spur wieder voll, aus eigener Hand: DC-123** (Live-Vorschau kennt kein Briefpapier — klein, macht die Vorschau ehrlich), dann **DC-122** ohne den Fußzeilenteil, dann die Fußzeile nach Legals Antwort, dann **DC-124**. | Legal (nur der Fußzeilenteil von DC-122) |
| **Legal** | **CoS-L-011** — ein Absatz: dürfen freie Fußzeilen die Pflichtangaben auf dem Angebot ersetzen (A/B/C), und ändert sich die Antwort bei Regelbesteuerung? | niemanden |
| **Marketing** | **Textseitig fertig, wartet bewusst.** Einzuarbeiten: es sind **sieben** Buchhaltungs-Anbindungen, nicht drei. Offen bleibt die Entscheidung über die Positionstitel. | Sandys A/B zu § 19 · Sandys Buchhaltungs-Testlauf |
| **Platform** | **CoS-P-029 — ein Termin, kein Auftrag:** am **19.09. nach 03:30 UTC** einmal `system_laeufe` prüfen (`aufnahmen.dateien > 0`?). | niemanden |
| **Finance** | F-007 gestellt, Belegablage steht, Reverse-Charge geklärt | Sandys Satz zur Sicherung · Sandys A/B zu § 19 |

---

## Was gerade niemanden blockiert, aber nicht untergehen darf

* **🔴 Drei Bad-Wandpositionen laufen über den Maler und finden dort keinen
  Katalogtreffer.** `gewerkFuerPosition` prüft `/wand/` vor allem anderen.
  Engineering ist bei PM-075 ausgewichen (die Zeile heißt „Nische fliesen"
  statt „Wandnische fliesen"). **Ob daraus auf einem echten Badangebot eine
  Null wird, ist ungemessen** — und wenn ja, trifft es jedes Bad, nicht einen
  Sonderfall. Die `/wand/`-Regel ist absichtlich nicht angefasst worden.
* **Die Mini-Vorschau auf der Briefpapier-Seite zeigt eine Wirkung, die es
  nicht gibt** (Schrift, Akzentfarbe, drei Fußzeilen). DC-122.
* **Zwei Stellen laden ein Logo hoch**, das Briefpapier gewinnt stillschweigend.
  Wer das Logo unter Einstellungen wechselt und sich wundert, hat recht. DC-124.
* **Die 30-Tage-Löschzusage ist bis heute nie eingelöst worden.** Nicht weil
  etwas kaputt ist, sondern weil keine Aufnahme alt genug war. Der erste Lauf,
  der wirklich löschen muss, ist der vom **19.09., 03:30 UTC**. Löscht er
  nichts, sind zwei veröffentlichte Rechtstexte unrichtig. **CoS-P-029.**
* **Die ENDE-Markierung steht ab jetzt in jeder Datei genau einmal.** Wer mehr
  als eine findet, meldet das — und hängt bis zur Klärung vor die **letzte** an.
* **`git add -A` ist abgeschafft.** Dateien werden einzeln benannt.
* **Löschen geht in dieser Shell nicht**, und die Anforderung des Löschrechts
  wird in einem geplanten Lauf abgelehnt — niemand ist da, der den Dialog
  beantwortet. `mv` nach `_to_delete/git-reste-JJJJ-MM-TT/` ist die
  Vorgehensweise, nicht der Notbehelf.
* **Die Landingpage bewirbt drei Buchhaltungs-Anbindungen. Es sind sieben.**
* **Dieselbe Anbindung heißt an zwei Stellen verschieden** („Lexoffice" vs.
  „Lexoffice (Legacy)"). Ein Wort in `integrations.ts`. Kein Auftrag, eine
  Meldung.
* **`menge_unbekannt` ist bewusst nicht gebaut.** Offen, wer die Messung macht.
* **Das GitHub-403 auf Schritt-Ebene bleibt.** Ohne Token sehe ich nur, **ob**
  ein Lauf grün war, nie **warum** er rot war.

*Chief of Staff · 2026-09-17, 09:50 UTC*
