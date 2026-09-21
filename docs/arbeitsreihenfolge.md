# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 21.09.2026, 10:05 UTC · Chief of Staff**
*(ersetzt die Fassung von 08:55 UTC — diese Datei wird immer ersetzt, nie ergänzt.)*
*Alle Uhrzeiten sind **UTC**. In Deutschland ist es gerade **MESZ = UTC + 2**,
also 12:05 Uhr Ortszeit.*

---

## Lage in drei Zeilen

**🟢 Was gepusht ist, ist grün — gemessen um 09:40 UTC.** GitHub-Actions:
**CI auf `92e83e2` success**, 09:39 UTC. Vercel: jüngster Produktions-Deploy
**`92e83e2`, READY**; die sechs davor ebenfalls READY, kein einziger Fehlschlag
heute. Der einzige nicht-grüne CI-Lauf des Tages ist `2411f76` mit
`cancelled` — abgebrochen, weil `3c3dd3d` 15 Sekunden später kam, kein Fehler.

**🟢 Seit 08:55 haben vier Rollen geliefert.** Engineering (CoS-E-085,
`fb9b696`), Designer (DC-122 Teil 2, `92e83e2`), Platform (CoS-P-034-Fix,
`scripts/docs-sichern.mjs`) und Platform noch einmal (CoS-P-033 beantwortet).
**Alle vier sind fertig, keiner hängt.**

**🟡 Drei Commits liegen ungepusht.** `c997a10` (Doku-Sicherung), `f25fb12`
(Platforms Skript) und der Commit dieses Laufs. **Sandy muss einmal pushen** —
Block steht im Chat.

---

## Was seit 08:55 UTC fertig geworden ist

| Wer | Was | Wo |
|---|---|---|
| **Engineering** | **CoS-E-085 / PM-079-A + PM-079-B** — der Isoliergrund läuft jetzt über **alle** verrauchten Räume statt über den ersten. 112,00 statt 65,00 m²; im Live-Fall **116,50 m² = 463,50 €**. PM-079-B stand auf dem **falschen Raum** und steht jetzt auf dem richtigen | `fb9b696` |
| **Designer** | **DC-122 Teil 2** — die drei freien Fußzeilen-Felder stehen jetzt auf dem Kundendokument, **zusätzlich** zum festen Fuß, nach Legals Antwort B. 60-Zeichen-Grenze gerechnet, nicht geschätzt. **DC-122 ist damit ganz zu** | `92e83e2` |
| **Platform** | **CoS-P-034-Fix** — `docs-sichern.mjs sichern` läuft über einen eigenen `GIT_INDEX_FILE` außerhalb des Repos, räumt liegende Sperren durch **Verschieben** weg und zieht den geteilten Index danach nach | `f25fb12` |
| **Platform** | **CoS-P-033 beantwortet und zu** — Audiodatei nach 30 Tagen wirklich weg (Storage + `audio_url`), Datenbankzeile bleibt absichtlich. Zusage aus Datenschutzerklärung Z. 117 / AGB § 8.3 vollständig belegt | in `f25fb12` |
| **CoS** | **CoS-P-034 auf Sandys echtem Mount nachgemessen** und abgenommen; **CoS-E-087** (Richtigstellung zum roten Ausgangsstand) an Engineering; **Bereinigungsauftrag** an den Prüfmeister; **Hinweis auf die neue Rechenweg-Zeile** an den Designer; **Löschrecht** auf Sandys Liste | dieser Commit |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, 09:40–10:05 UTC:**

* **`git fetch` + `git rev-parse`:** vor diesem Lauf `origin/main` = lokal =
  **`92e83e2`**, **0 ungepusht**. Sandy hat zwischendurch selbst gepusht.
* **Vercel-API:** Produktion **`92e83e2`, READY**.
* **GitHub-Actions-API:** **CI auf `92e83e2` success**, 09:39 UTC.
* **Der Prüfstand über `pruefmeister-batch-47-56.test.ts`, dreimal** — und
  zwar sauber getrennt, mit einer `git archive`-Kopie aus `HEAD` **außerhalb
  des Arbeitsbaums**, damit niemandes laufende Arbeit angefasst wird:

  | Was | Ergebnis |
  |---|---|
  | committete Testdatei gegen committeten Code | **32 grün · 7 erwartete Fehlschläge · 0 rot** |
  | uncommittete Testdatei gegen committeten Code | **6 rot** |
  | uncommittete Testdatei im echten Arbeitsbaum | **7 rot** |

* **Was diese sechs wirklich sind:** fünf sind `it.fails` und melden
  `Expect test to fail` — **der Fehler tritt nicht mehr auf**. Der sechste ist
  ein Beleg-Test, der seine eigene Behauptung widerlegt. **PM-098 und PM-099
  sind auf dem committeten Stand nicht mehr reproduzierbar.** Der siebte rote
  gehört Engineerings gerade laufender Arbeit (PM-107).
* **Der CoS-P-034-Fix auf dem echten Mount:** `.git/index.lock` lag da
  (0 Byte, 09:37), `node scripts/docs-sichern.mjs sichern` **hat trotzdem
  committet** (`c997a10`), Hash in der Ausgabe, fremde uncommittete Dateien
  blieben draußen. `git log -1` als Gegenprobe.
* **`scripts/docs-sichern.mjs` lag uncommittet** und enthält den Fix —
  Bytegröße und Inhalt gegengeprüft, nicht der „written"-Meldung geglaubt.
* **Das Löschrecht für den Ordner:** 09:44 UTC selbst angefragt,
  **abgewiesen** — in einem geplanten Lauf erreicht die Frage Sandy nicht.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Kein eigener voller Prüfstand.** Letzte belegte Vollmessungen:
  Engineering 09:20 UTC im Arbeitsbaum (193 Dateien) und Platform im
  GitHub-Spiegel auf `92e83e2` (**194 Dateien, 2.897 grün, 96 erwartet
  fehlschlagend, 0 rot**). Die beiden Zahlen widersprechen sich nicht — der
  Unterschied ist genau die uncommittete Fremddatei.
* **Warum** PM-098/PM-099 nicht mehr auftreten. Ich habe den Stand gemessen,
  nicht die Ursache gesucht.
* **Gate 1 rechne ich in diesem Lauf nicht neu.** Stand bleibt **54,2 %**.
* **Versicherung, Stripe, Gewerbeanmeldung, Buchhaltungs-Testlauf,
  OneDrive-Sicherung** — nicht angefasst.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🔵 **Einmal pushen.** Drei Commits liegen lokal. Block steht im Chat | ein Befehl |
| 2 | 🔵 **Löschrecht für den Projektordner — NEU.** Ein Klick, aber nur in einer **normalen** Unterhaltung möglich, nicht in einem geplanten Lauf. Spart jeder Rolle einen Handgriff und einen möglichen Fehlschlag. **Nicht dringend** | ein Klick |
| 3 | 🔵 **Ab 26.09.:** Gewerbeanmeldung → Fragebogen zur steuerlichen Erfassung → Geschäftskonto → Steuerberater. Beim Fragebogen die **aktuelle** Fassung von `legal-007-plan-fuer-sandy.md` lesen — das Kreuz hat sich am 17.09. geändert und bindet fünf Jahre | nichts jetzt |
| 4 | ⚪ **Einmal selbst einsprechen — freiwillig.** Der Designer kann das Bernsteinbanner ohne echte Sprachaufnahme nicht prüfen: ein Raum normal, ein zweiter mit „das kommt später und wird extra angeboten" | 2 Minuten |
| 5 | ⚪ **Freigabe für den Landingpage-Entwurf — freiwillig**, nur falls eine Messung bei echter Handy-Breite (375 px) gewünscht ist | freiwillig |
| 6 | 🔵 **Buchhaltungs-Testlauf** (Lexware Office) · **E-Rechnungs-Viewer** (Quba, 0 €) · **Versicherung** (exali/Markel 1 Mio. €) · **Stripe** (Konto + 2 Preise) · **Vercel-Benachrichtigung** | unverändert |

**Es wartet keine Rolle auf Sandy, und nichts davon ist dringend.**

---

## Wer als Nächstes dran ist

| Rolle | Nächstes | Wartet auf |
|---|---|---|
| **Prüfmeister** | **Spur vom 21.09. ist abgearbeitet, nichts offen.** (1) `pruefmeister-batch-47-56.test.ts` aufgeräumt und committet — **45 grün · 8 Sperrklinken · 0 rot**. Vor dem Entsperren an der **ganzen Positionsliste** nachgerechnet, nicht am Ausbleiben einer Zeile: PM-098 liefert mit und ohne den Satz Zeile für Zeile dasselbe, PM-099 nimmt **genau** den Wandblock weg (277,25 €) und lässt die vier Türzeilen stehen. Beleg-Test umgedreht, er kann von einem leergeräumten Angebot nicht mehr bestanden werden. (2) **A/B/C beantwortet: B** — „Altbauwohnung"/„Altbauhaus" zählen mit, als **geschlossene Liste, kein Präfix** `altbau*`. Gegen A spricht `Altgebäude`: löst heute ohne jedes Zustandswort aus, „Altbauwohnung" nicht — das ist Typografie als Preisgrenze. Gegen C spricht, dass es „Wir sind hier im Altbau" abschaltet und eine Wortliste braucht, die man nur durch Schaden pflegt. **Drei Sperrklinken liegen für Engineering bereit**, Begründung in `pruefmeister-pm103-altbau-grenze.test.ts`. (3) **Themenspeicher-Punkt 14 gemessen und zu**: 40 Stellen schreiben „aus Transkript", **kein einziger unbelegter Rechenweg**; PM-131/132/133 sind gebaut und stehen jetzt als Gegenproben. `pruefmeister-batch-79-88` war bereits committet (`fb9b696`). | niemanden |
| **Engineering** | **CoS-E-083 weiter, ab Platz 4:** der laufende Vorgang (PM-106 + PM-107, uncommittet im Baum: `maler.ts`, `maler-basis.ts`, `cos-e-083-ansage-gilt-fuer-alle.test.ts`) **zuerst zu Ende und committet**. Danach **PM-105**, dann **CoS-038 → PM-119/L-06 → CoS-E-080**. **CoS-E-086** (Beleg je Position) bleibt eine **Antwortfrage**, kein Bauauftrag, und hängt hinter PM-105. **🆕 CoS-E-087 lesen** — der „rote Ausgangsstand von 6" ist keiner | niemanden |
| **Designer** | **DC-122 ist zu, beide Teile.** Als Nächstes **DC-127** (dunkler Tabellenkopf, nur eine der beiden Seiten). **PD-018 §3** sinnvoll erst nach Engineerings Umstellung. **🆕 Zur Kenntnis:** der Rechenweg nennt ab jetzt den Raum, sobald die Aufnahme mehrere hat (`Wandfläche Wohnzimmer 45 m² + …`) — das steht auf dem Kundenpapier, die Gestaltung ist bewusst nicht angefasst und gehört dir | niemanden |
| **Platform** | **CoS-P-034 ist abgenommen und zu**, CoS-P-033 ebenfalls. Damit frei für die eigene Reihenfolge. **Dein Skript ist jetzt committet** (`f25fb12`) — du konntest auf dem Mount nicht committen, ich habe nur diese eine Datei genommen | niemanden |
| **Marketing** | **CoS-M-017 zuerst lesen** (Trockenbau ist Richtung, wird **nirgends beworben**, kein Termin). Dann **CoS-M-016** (Abschluss-CTA kann auf dem Handy leer bleiben), Vorschau-Umschalter raus (M-6), Hero kürzen, Reiter-Kante. Dann **CoS-M-014**, danach Zustelltest `support@`. **CoS-M-018** nur mitnehmen, wenn die Preiszeile ohnehin angefasst wird — Wortlaut bei Legal holen, nicht selbst wählen. Website-Schalter bleibt hinter **CoS-038** | Engineering (CoS-038) |
| **Legal** | **CoS-L-013: nichts zu tun** — die Löschfrist ist durch Platform vollständig belegt, kein Rechtstext-Mangel, der Punkt kommt **nicht** zurück. Danach frei für die eigene Reihenfolge. **`docs-sichern.mjs` ist repariert und abgenommen** — dein Befund war der erste und er war richtig | niemanden |
| **Finance** | **CoS-F-009** (Vorsteuer in die Kostenübersicht, Reverse-Charge auf „durchlaufend", Voranmeldungsrhythmus als Frage für den Steuerberater) · **Behördenliste für Sandy bis 26.09.** — kürzester Vorlauf, muss zum korrigierten Schritt 2 in `legal-007-plan-fuer-sandy.md` passen · **26 unbearbeitete Belege** · **CoS-F-008** · steigt Gate-1-Punkt 4.7 über die 40/100? **Finance hat heute noch nicht gelaufen** | niemanden |

---

## Was gerade niemanden blockiert, aber nicht untergehen darf

* **🟢 Die Doku-Sicherung sichert wieder.** `docs-sichern.mjs sichern` läuft
  über einen eigenen Index, verschiebt liegende Sperren statt sie zu löschen
  und nennt den Commit-Hash in der Ausgabe. **Auf dem echten Mount mit
  liegender Sperre gemessen**, nicht nur im Spiegel.
* **🟡 Die Sperrdateien entstehen weiter.** Der Fix räumt sie vor dem eigenen
  Lauf weg, aber jeder `git status` jeder Rolle legt neue an. Ursache ist das
  fehlende Löschrecht. **Der Weg, der ohne dieses Recht funktioniert** — und
  den jede Rolle vor dem Commit fahren soll:
  `mkdir -p .git/_stale && for f in .git/*.lock; do [ -e "$f" ] && mv -n "$f" ".git/_stale/$(basename $f).$(date +%s%N)"; done`
  danach `export GIT_INDEX_FILE=$HOME/<rolle>-index; git read-tree HEAD;
  git add -- <nur eigene Dateien>; git commit`.
* **🟡 „written" ist keine Zusage, dass die Datei angekommen ist.** Der
  Designer hat heute erneut erlebt, dass eine Datei als geschrieben gemeldet
  wurde und nicht ankam — aufgefallen nur durch den Bytegrößen-Vergleich.
  **Verfahren für alle Rollen: nach jedem Schreiben die Größe gegenprüfen.**
* **🟡 Uncommittet im Arbeitsbaum, vier Dateien:** Engineerings `maler.ts`,
  `maler-basis.ts` und `cos-e-083-…test.ts` gehören einem **laufenden**
  Vorgang; die Prüfmeister-Testdatei liegt seit dem **17.09.**
  **`git add -A` bleibt abgeschafft.**
* **🟡 „Der Browser in der Claude-App kommt an beide Adressen" stimmt nicht.**
  Er stimmt für `sofortangebot.app`, **nicht** für den Landingpage-Entwurf —
  der liegt hinter Vercel Deployment Protection und antwortet mit 302 auf
  `vercel.com/login`.
* **🟡 Die live Preiszeile** (`PreiseSection.tsx`) nennt „0 €" und den
  Monatspreis **ohne jede Umsatzsteuerangabe** (§ 5a UWG). Kein
  Gate-1-Blocker. **CoS-M-018.**
* **LR-17 ist die eigentliche Fußzeilen-Lücke, nicht DC-122.** Rechtsform,
  Registergericht, Registernummer, Vertretungsberechtigte kennt das Produkt
  bis heute nicht. Gebaut wird das in **CoS-E-057**, nicht vom Designer.
* **PM-080 ist bewusst nicht mitgenommen worden.** Ohne Auslösewort entsteht
  weiter keine bepreiste Zeile. Das ist eine offene Bauentscheidung des
  Prüfmeisters und als Zusicherung festgehalten (E-085-6), damit sie niemand
  versehentlich nebenbei ändert.
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
* **Eine rote Zahl ist nicht immer ein Fehler.** Sechs „rote Tests" waren
  heute in Wahrheit sechs Meldungen, dass ein Fehler **weg** ist. Wer eine
  Zahl weiterreicht, ohne sie einmal aufzumachen, reicht die falsche Lage
  weiter — dreimal messen war heute billiger als einmal raten.

*Chief of Staff · 2026-09-21, 10:05 UTC*
