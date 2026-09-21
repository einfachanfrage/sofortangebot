# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 21.09.2026, 19:50 UTC · Chief of Staff**
*(ersetzt die Fassung von 19:00 UTC — diese Datei wird immer ersetzt, nie ergänzt.
Wer mir etwas mitteilen will, schreibt es in seine eigene Heimat-Datei; was hier
hineingeschrieben wird, ist beim nächsten Lauf weg.)*
*Alle Uhrzeiten sind **UTC**. In Deutschland ist es gerade **MESZ = UTC + 2**,
also 21:50 Uhr Ortszeit.*

---

## Lage in drei Zeilen

**🟢 Der Server ist grün — und steht unverändert auf `b973c26`.** Selbst
gemessen um 19:44: GitHub-Actions **CI Lauf 228 auf `b973c26`
completed/success** (15:41:51 UTC, seither **kein neuer Lauf**, weil nichts
gepusht wurde), Vercel-Produktion **`b973c26` READY**, acht von acht
abgefragten Produktions-Deploys READY.

**🟡 Einunddreißig Commits liegen ungepusht** (um 19:00 waren es
fünfundzwanzig). **Keiner der einunddreißig war in der CI.** Sandy muss
einmal pushen — Block steht im Chat.

**🟢 Vier Rollen haben seit 19:00 geliefert.** Engineering **CoS-E-092 ✅**,
Marketing **CoS-M-020 ✅** plus Artefakt nachgezogen, Prüfmeister
**Themenspeicher Punkt 12 und 21 zu, Fallbasis 138 → 144**, Designer
**DC-139/DC-140 ✅**. **Engineering baut gerade PM-134** — vier Dateien liegen
offen im Arbeitsbaum, zuletzt angefasst 19:36.

---

## Was seit 19:00 UTC fertig geworden ist

| Wer | Was | Wo |
|---|---|---|
| **Engineering** | **CoS-E-092 ✅.** `zuschlag-basis.ts` Z. 168: `toFixed(2)` bleibt **vorne**, `toLocaleString` setzt nur die Gruppierung. Gemessen, warum das nicht umgekehrt geht: `1000.005` ergibt so `1.000,00` wie bisher, andersherum `1.000,01` — **er hatte `1.000,01` erwartet und in die Zusicherung geschrieben, der Prüfstand hat ihn korrigiert.** Ohne diese Reihenfolge hätte CoS-E-092 still die Rundung eines Geldbetrags geändert. Dazu: §9 des Vorlaufs aufgelöst — der fremde Index-Eintrag war der Designer bei der Arbeit, **Verdacht falsch, Vorsicht richtig.** `tsc` 0, Delta über 69 Dateien 1.268 grün / 0 rot | `5191791`, `f092524` |
| **Prüfmeister** | **Beide eigenen Themenspeicher-Punkte zu, und beide Antworten kleiner als vermutet.** Punkt 12: von **184 Engine-Titeln** tragen **genau zwei** zwei verschiedene Katalogpreise — seine eigene Vermutung einer breiten Klasse **widerlegt** (**PM-139**). Punkt 21: geteiltes Bild, kein Durchschlag — PM-134 sitzt in der Sockelleisten-Bremse (**PM-141**), PM-136 in beiden (**PM-142**), PM-135 in keiner (**PM-143**). **Zwei neue rote Funde** (siehe unten) und der Wortlaut **PM-144** entschieden. `tsc` 0 · 24 Prüfmeister-Dateien **462 grün / 88 Sperrklinken / 0 rot** | `ab725e9` |
| **Designer** | **DC-139 ✅** — `dc138-tausenderpunkt.test.ts` trägt jetzt den Bestandsangebots-Fall: `berechnungsweg` wird beim Anlegen **gespeichert**, nicht bei jeder Anzeige neu gebildet, also trägt jedes Angebot von vor `5191791` die alte Schreibweise **dauerhaft** weiter. **DC-140 ✅** — Antwort auf PD-025, kein Widerspruch zu PM-144, mit der einen nachgesehenen Stolperstelle (`ANWEISUNG_MIT_TRENNER`). 112 grün / 0 rot über 8 Dateien | **uncommittet** |
| **Marketing** | **CoS-M-020 ✅** (`pb-4` ans letzte Kind, 16 px, auf vier Breiten und bei reduzierter Bewegung gemessen). **Artefakt nachgezogen, Fassung 16** — vorher alle 911 Zeilen der veröffentlichten Fassung gelesen und gegengehalten, **nichts ging verloren, niemand hatte von innen geändert.** Zustelltest `support@` an Sandy übergeben, mit Begründung, warum er von außen kommen muss | `28b6b39`, `a5634ba` |
| **Finance** | **Plan-Deckblatt ✅** (bezifferte Verlustverrechnungs-Reserve, Sachkosten aufgeschlüsselt). Zwei Fragen an Marketing gestellt (brutto/netto · Pkw oder Bahn), daran hängen rund 230 € Vorsteuer über 24 Monate. **Nichts geändert, bis die Antwort da ist** | `0d13db6` |
| **CoS** | Lage gemessen · **CoS-E-093 (PM-144) und CoS-E-094 (PM-140) an Engineering verteilt** · **PM-143-A als Nachtrag an den laufenden PM-134-Bau gehängt** · Arbeitsreihenfolge ersetzt · Sperrdateien geräumt | diese Datei |

---

## 🟡 Engineering baut gerade — ich habe seine vier Dateien NICHT angefasst

Im Arbeitsbaum liegen offen: `src/lib/bauteil-ausschluss.ts` (19:33),
`pruefmeister-batch-134-137.test.ts` (19:36),
`dc135-bauteil-ausschluss-sichtbar.test.ts` (19:36) und
`dc138-tausenderpunkt.test.ts` (19:20, vom Designer).

Die ersten drei sind **PM-134 im Bau** — in `dc135-…` steht die Begründung
wörtlich drin: der Diktattext wurde umgedreht, *„weil der spätere
ausdrückliche Auftrag seit PM-134-A den früheren Ausschluss aufhebt und ein
Hinweis über einen Wegfall, den es nicht gibt, genau der Lärm wäre, den die
Datei verbietet."*

**Ich habe davon nichts committet und nichts nachgezogen.** Um 18:43 ist mein
Commit genau an dieser Gleichzeitigkeit gestorben; zweimal muss das nicht
sein. **Die vier Dateien gehören der Rolle, die sie offen hat.**

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, 19:42–19:50 UTC, alles direkt auf Sandys Rechner:**

* **GitHub-Actions-API:** letzter Lauf ist weiter **Nr. 228 auf `b973c26`,
  completed / success**, 15:41:51 UTC. **Kein neuer Lauf seit 19:00.**
* **Vercel-API:** Produktion **`b973c26` READY**, acht von acht READY.
* **`git fetch` + `git rev-list`:** `origin/main` = `b973c26`, lokal
  `ab725e9`, **31 Commits ungepusht**.
* **Sechs neue Commits seit meinem letzten Lauf** einzeln gelesen und den
  Rollen zugeordnet.
* **Arbeitsbaum-Zeitstempel** Datei für Datei geprüft, um den laufenden Bau
  von liegengebliebener Arbeit zu unterscheiden.
* **Sperrdateien** nach `.git/_stale/` geräumt.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Ich habe in diesem Lauf keinen einzigen Test gefahren.** Alle Zahlen oben
  (1.268 grün, 462 grün, 112 grün) sind **fremde** Messungen an **fremden**
  Ständen. Wer sie zitiert, sagt das dazu.
* **Kein voller Prüfstand.** Die letzte Vollmessung (198 Dateien, 2.955 grün,
  99 erwartet fehlschlagend, 0 rot) ist Platforms und gilt für **`b973c26`** —
  **nicht** für die einunddreißig Commits darüber.
* **Gate 1 rechne ich nicht neu.** Stand bleibt **54,2 %**. Finances Vorschlag
  95/100 für Punkt 4.7 ist weiter notiert, nicht eingetragen.
* **Kein Blick ins laufende Produkt. Sechster Lauf in Folge.** Engineering und
  Designer schreiben denselben Satz inzwischen selbst in ihre Berichte.
* **`legal-007` habe ich diesmal nicht aufgeschlagen** — die Datei ist seit
  08:14 UTC unverändert (Zeitstempel geprüft, Inhalt nicht erneut gelesen).
  CoS-L-014 gilt deshalb unverändert als offen.
* **Versicherung, Stripe, Gewerbeanmeldung, Buchhaltungs-Testlauf,
  OneDrive-Sicherung** — nicht angefasst.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🔵 **Einmal pushen.** Einunddreißig Commits liegen lokal, keiner war in der CI. Block steht im Chat | ein Befehl |
| 2 | 🔴 **Beim ELSTER-Fragebogen nicht der Kurzfassung in `legal-007` folgen.** Dort steht weiter „Kleinunternehmer ankreuzen" — **falsch**, und das Kreuz bindet fünf Jahre. Richtig ist **Verzicht auf die Kleinunternehmerregelung**. **Halte dich an Finances Behördenliste.** Legal zieht die zwei Zeilen nach (CoS-L-014) | nichts jetzt |
| 3 | 📧 **NEU: Zustelltest `support@`.** Von einer **privaten** Adresse eine Mail an `support@sofortangebot.app`, fünf Minuten später in `hallo@` nachsehen (auch Spam). Marketing hat nachgesehen: zehn Nachrichten im Postfach, **keine einzige an `support@`** — die Weiterleitung ist ungetestet. Volle Anleitung in `entscheidungen-fuer-sandy.md` | 2 Min |
| 4 | 🔵 **Vor der Gewerbeanmeldung in den Arbeitsvertrag sehen** — Klausel zu Nebentätigkeiten. Muss **davor** passieren | 10 Min |
| 5 | 🔵 **Löschrecht für den Projektordner.** Nur in einer **normalen** Unterhaltung möglich, nicht in einem geplanten Lauf. **Nicht dringend** | ein Klick |
| 6 | 🔵 **Ab 26.09. bzw. KW 41:** Gewerbeanmeldung → Fragebogen → Geschäftskonto → Steuerberater. Alles in `finance-002-behoerdenliste-fuer-sandy.md` | nichts jetzt |
| 7 | ⚪ **Einmal selbst einsprechen — freiwillig.** Ein Raum normal, ein zweiter mit „das kommt später und wird extra angeboten" | 2 Minuten |
| 8 | 🔵 **Buchhaltungs-Testlauf** (Lexware Office) · **Versicherung** (exali/Markel 1 Mio. €) · **Stripe** (Konto + 2 Preise) · **Vercel-Benachrichtigung** | unverändert |
| 9 | ⚪ **`_to_delete/` leeren, wenn Lust ist.** Ist in `.gitignore`, stört nichts | 1 Min |

**Es wartet keine Rolle auf Sandy.** Punkt 2 ist das Einzige, was ein Datum hat.

---

## Wer als Nächstes dran ist

| Rolle | Nächstes | Wartet auf |
|---|---|---|
| **Engineering** | **PM-134 läuft gerade** (vier Dateien offen im Arbeitsbaum, zuletzt 19:36). **Nachtrag von mir, der in denselben Bau gehört: PM-143-A** — seit CoS-E-091 antworten die Bauteil- und die Sockelleisten-Bremse auf denselben Satzbau verschieden; der Prüfmeister entscheidet ausdrücklich nicht, welche recht hat, sagt aber: *„zwei Antworten auf demselben Angebot sind nicht zu verteidigen."* Danach **CoS-E-093 (PM-144, ein Einzeiler in `zuschlagBerechnungsweg()`, die zwei Sperrklinken liegen schon committet)** → **PM-136** → **CoS-E-094 (PM-140, Fliesen-Aufpreis)** → **CoS-038 → PM-119/L-06 → CoS-E-080**, CoS-E-086 dahinter | niemanden |
| **Designer** | **Bei dir liegt nichts.** DC-139 und DC-140 sind fertig, deine Spur ist leer. **PD-021** wartet unverändert auf Engineerings Grundreihenfolge (CoS-038). Vorschlag, kein Auftrag: **das laufende Produkt hat weiter niemand angesehen — sechster Lauf.** Du hast dieselbe Zeile heute selbst in deinen Bericht geschrieben | niemanden |
| **Prüfmeister** | **Beide Punkte zu, Fallbasis 144.** Wie angekündigt als Nächstes: Themenspeicher **Punkt 13** (Katalogtitel als gedruckter Titel, 184 Titel, ohne App) und der neue **Punkt 23** (Katalogzeilen ohne Engine-Titel). **Deine zwei roten Funde sind verteilt:** PM-140 als **CoS-E-094**, PM-143-A als Nachtrag an Engineerings laufenden PM-134-Bau. PM-144 liegt als **CoS-E-093** bei Engineering, mit der Rückendeckung des Designers (DC-140) | niemanden |
| **Marketing** | **Zwei Fragen von Finance liegen bei dir** (seit 19:05 in deiner Datei): sind die 1.430 € Sachkosten im Kanalplan **brutto oder netto** gemeint, und sind die Fahrten **Pkw oder Bahn**? Zwei Stichworte genügen, daran hängen rund 230 € Vorsteuer. Danach: **CoS-M-018** nur mitnehmen, wenn die Preiszeile ohnehin drankommt — **Wortlaut vorher bei Legal holen**. Website-Schalter bleibt hinter **CoS-038** | Engineering (CoS-038) |
| **Platform** | **Bei dir liegt nichts.** Vorschlag, kein Auftrag: **sobald Sandy gepusht hat, die Vollmessung am neuen `origin/main`** — deine Zahl gilt für `b973c26`, nicht für die einunddreißig Commits darüber | Sandy (Push) |
| **Legal** | **Unverändert CoS-L-014, Platz 1 und mit Datum.** `legal-007` Zeile 342 („Kleinunternehmer ankreuzen") und Zeile 276 („0 € (Kleinunternehmer)") — Datei seit 08:14 UTC unangetastet. Danach: wie die Nebentätigkeitsklausel in Sandys Arbeitsvertrag zu lesen ist. **Und neu, klein: Marketing braucht für CoS-M-018 einen Wortlaut von dir** (Umsatzsteuerangabe an der Preiszeile, § 5a UWG) | niemanden |
| **Finance** | **Plan-Deckblatt ✅.** Danach wie geplant die **26 unbearbeiteten Belege**. Die zwei „netto"-Zeilen bleiben offen: Apple Developer hängt am Fragebogen (bis 26.09. geparkt), die Marketing-Sachkosten warten auf zwei Stichworte von Marketing — **du hast richtig gefragt statt geraten** | Marketing (2 Stichworte) |

---

## Was gerade niemanden blockiert, aber nicht untergehen darf

* **🟡 Die letzte Vollmessung gilt für `b973c26`, nicht für den lokalen Stand.**
  198 Dateien / 2.955 grün / 99 erwartet fehlschlagend / 0 rot. Darüber liegen
  **einunddreißig** ungemessene Commits. **Wer „alles grün" sagt, sagt dazu,
  an welchem Stand.**
* **🔴 Drei Begründungen des Chief of Staff waren falsch, die Fixes nicht.**
  CoS-E-088 und CoS-E-090 behaupteten, der englische Rechenweg stünde auf dem
  Kundenpapier — er stand in der App. CoS-E-091 §1 nannte eine Raumgrenze als
  Ursache — beide Teilsätze lagen im selben Raum. **Alle drei Fixes bleiben
  richtig, alle drei Begründungen waren meine.** Engineering hat jedes Mal
  nachgemessen statt übernommen. **Und der Prüfmeister hat im selben Lauf
  seine eigene Vermutung widerlegt (PM-139).** Das ist das Muster, das hier
  funktioniert: nachmessen, nicht übernehmen.
* **🟡 `toFixed` vor `toLocaleString` ist kein Schmückwerk.** Engineering hat
  gemessen, dass die umgekehrte Reihenfolge `1000.005` zu `1.000,01` statt
  `1.000,00` macht — eine stille Änderung an der Rundung eines Geldbetrags.
  **Wer an dieser Zeile arbeitet, liest E-092-B, bevor er sie „aufräumt".**
* **🟡 Bestandsangebote tragen die alte Schreibweise für immer.**
  `berechnungsweg` wird beim Anlegen gespeichert (`quotes/create`,
  `quotes/[id]/revise`), nicht bei jeder Anzeige neu gebildet. Jedes Angebot
  von vor `5191791` steht ohne Tausenderpunkt in der Spalte — **dauerhaft,
  nicht historisch.** Der Designer hat es als Zusicherung festgehalten.
* **🟢 Das Landingpage-Artefakt ist NICHT mehr hinter der Datei.** Marketing
  hat es auf Fassung 16 nachgezogen und die veröffentlichte Fassung vorher
  vollständig gegengelesen. **Der alte Warnsatz ist hier raus.**
* **🟢 Der Shell-Zugriff auf Sandys Rechner lebt — für alle Rollen außer
  Platform.** Platform kann auf diesem Mount nur lesen und schreiben, nicht
  ausführen, und misst deshalb am geklonten Spiegel.
* **🔴 Zwei Grenzen gelten weiter.** (1) **Ein Hintergrundprozess überlebt den
  Shell-Aufruf nicht** — in Blöcken unter 175 Sekunden fahren, **ins Log
  sehen, nicht in die Prozessliste**. (2) **Löschen geht nicht** — `mv -n
  <datei> _to_delete/` ist der Weg, `_to_delete/` ist in `.gitignore` Z. 51.
* **🔴 `/tmp` im Shell-Container ist NICHT leer und NICHT nur deins.**
  Zwischendateien mit eindeutigem Namen anlegen und nach dem Schreiben die
  Größe gegenprüfen.
* **🟡 Die Sperrdateien entstehen weiter.** Der Weg ohne Löschrecht:
  `mkdir -p .git/_stale && for f in .git/*.lock; do [ -e "$f" ] && mv -n "$f" ".git/_stale/$(basename $f).$(date +%s%N)"; done`
* **🟡 Zwei Rollen committen gleichzeitig, und das scheitert sichtbar.**
  **Wer nach einem gescheiterten Commit weitermacht, räumt erst den
  Index-Zustand auf, den er hinterlassen hat.** Nachzug über
  `node scripts/docs-sichern.mjs nachziehen <dieselben Dateien>`.
* **🟡 „written" ist keine Zusage, dass die Datei angekommen ist.** Nach jedem
  Schreiben die Bytegröße gegenprüfen.
* **🟡 Eine Zahl, die grün aussieht, kann an der falschen Stelle gemessen
  sein. Wer einen Stand meldet, sagt dazu, wo er gemessen hat.**
* **🟡 Die live Preiszeile** (`PreiseSection.tsx`) nennt „0 €" und den
  Monatspreis **ohne jede Umsatzsteuerangabe** (§ 5a UWG). Kein
  Gate-1-Blocker. **CoS-M-018**, Wortlaut bei Legal.
* **🟡 „Der Browser in der Claude-App kommt an beide Adressen" stimmt nicht.**
  Er stimmt für `sofortangebot.app`, **nicht** für den Landingpage-Entwurf —
  der liegt hinter Vercel Deployment Protection (302 auf `vercel.com/login`).
* **LR-17 ist die eigentliche Fußzeilen-Lücke, nicht DC-122.** Rechtsform,
  Registergericht, Registernummer, Vertretungsberechtigte kennt das Produkt
  bis heute nicht. Gebaut wird das in **CoS-E-057**.
* **PM-080 ist bewusst nicht mitgenommen worden.** Ohne Auslösewort entsteht
  weiter keine bepreiste Zeile.
* **Die Vollständigkeitsprüfung warnt beim Commit** (`pre-commit`, `exit 0`,
  blockiert nichts). Ein `pre-push`-Hook existiert in diesem Klon **nicht** —
  uncommittete Dateien blockieren Sandys Push nicht.
* **🟡 `ci.yml` hat ein BOM, und die CI läuft trotzdem grün.** Nicht angefasst.
* **Es gibt keine echten Betriebe — nur Sandys Testkonto.**
* **Die Landingpage bewirbt drei Buchhaltungs-Anbindungen. Es sind sieben.**
  Und dieselbe Anbindung heißt an zwei Stellen verschieden.
* **`lfdm` und `lfm` stehen auf derselben Angebotszeile.** Vor dem Umbenennen
  `dc050-rechenweg-pdf.test.ts` und `dc119-wandflaechen-konflikt.test.ts` ansehen.
* **`menge_unbekannt` ist bewusst nicht gebaut.** Offen, wer die Messung macht.

*Chief of Staff · 2026-09-21, 19:50 UTC*

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
