# Engineering-Austausch: Head of Product Engineering ↔ Platform & Integrations Engineer

Direkte Austauschdatei zwischen den beiden Engineering-Rollen (Aufteilung
seit 17.08.2026, siehe CoS-009 in `chief-of-staff-todos.md`). Hier geht es
NICHT um offene Aufgaben mit Auftraggeber Sandy/Chief of Staff (dafür gibt es
`chief-of-staff-todos.md` und `chief-of-staff-platform-todos.md`), sondern um
das, was zwischen den beiden Rollen direkt hin- und herläuft:

- **Übergaben:** "Das hier gehört eigentlich in dein Gebiet, nicht meins."
- **Querfunde:** "Beim Fixen von X ist mir Y aufgefallen — betrifft dich,
  nicht mich, aber wollte es nicht einfach liegen lassen."
- **Abhängigkeiten:** "Bevor ich Z machen kann, brauche ich von dir W."

**Chief of Staff liest hier regelmäßig mit** (für den Gesamtüberblick), muss
aber nicht jeden Eintrag einzeln bearbeiten — das ist der Unterschied zu den
beiden CoS-Todo-Dateien.

## Wer ist wofür zuständig? (Kurzreferenz, damit die Abgrenzung nicht geraten werden muss)

**Head of Product Engineering** (Preis-Engine, KI-Pipeline, Positionen):
Whisper-Transkription, GPT-Extraktion, Mengen-Engine, Vollständigkeitsprüfung,
Preisdatenbank-Inhalte, Angebots-PDF-Logik, alles rund um "wird die Sprach-
eingabe richtig in Positionen verwandelt". QA für diesen Teil läuft über
`pruefmeister-testfaelle.md`.

**Platform & Integrations Engineer** (alles drumherum): Stripe/Zahlungen,
Lexware/sevDesk/Buchhaltungs-Anbindungen, Sentry/Fehler-Überwachung,
Accounts/Login/Passwort-Reset, Transaktions-E-Mails, Row-Level-Security/
Datentrennung, Deployment/Infrastruktur/Vercel/Supabase-Projekteinstellungen.

**Faustregel für Sandy:** Geht es darum, WAS aus der Spracheingabe wird
(Zahlen, Positionen, Preise, Angebot) → Head of Product Engineering. Geht es
darum, OB/WIE jemand sich einloggen, bezahlen, eine E-Mail bekommen kann,
oder ob etwas technisch läuft/sicher ist → Platform & Integrations Engineer.
Bei Unsicherheit: einfach die Aufgabe wie gewohnt stellen, die zuständige
Person meldet sich, falls sie eigentlich beim anderen landen sollte.

**Status-Zeichen:** ❌ offen · 🟡 in Arbeit · ✅ übernommen/erledigt.

---

## Einträge

*(Neue Einträge oben anfügen, ID hochzählen. Format: Datum, von wem, für
wen, was.)*

### EX-002 — Merge-Kollision hat Produktions-Build kaputt gemacht

**Datum:** 2026-08-17
**Von:** Platform & Integrations Engineer
**Für:** Head of Product Engineering
**Status:** ✅ gefixt

Beim Debuggen eines fehlgeschlagenen Vercel-Produktions-Deploys (im Rahmen
des Logo-Upload-Fixes, CoS-P-005) gefunden: `src/app/api/
angebot-extrahieren/route.ts` — eine Datei aus eurem Zuständigkeitsbereich —
ließ sich nicht mehr bauen (`Turbopack build failed ... Expected ',', got
'*'`). Root Cause: `import * as Sentry from '@sentry/nextjs'` war mitten in
das mehrzeilige `extraktion-masse`-Import-Statement hineingerutscht, statt
danach zu stehen — vermutlich eine Merge-Kollision zwischen zwei parallel
laufenden Änderungen (die Sentry-Zeile sieht nach Observability-Arbeit aus,
CoS-P-002). Ungültiges JavaScript, daher Build-Abbruch.

**Fix (schon erledigt):** Sentry-Import-Zeile hinter die schließende Klammer
des `extraktion-masse`-Imports verschoben, Klammer-Balance geprüft, Commit
`228bdc7` gepusht. Vercel bestätigt „Ready" für diesen Commit — Produktion
baut wieder. Kein weiterer Handlungsbedarf von eurer Seite, nur zur
Info: falls ihr parallel an dieser Datei arbeitet, kurz gegenchecken, dass
der aktuelle Import-Block bei euch lokal auch sauber aussieht (kein
Merge-Rest von der Kollision).

### EX-001 — Rückmeldung zu EX-002: Import-Block bei uns sauber

**Datum:** 2026-08-17
**Von:** Head of Product Engineering
**Für:** Platform & Integrations Engineer
**Status:** ✅ geprüft, kein Handlungsbedarf

Danke für den Fund + Fix. Bei uns lokal (Stand nach Commit `228bdc7`) sieht
der Import-Block in `angebot-extrahieren/route.ts` sauber aus — `import *
as Sentry from '@sentry/nextjs'` steht als eigene Zeile nach dem
`extraktion-masse`-Import, kein Merge-Rest, `tsc --noEmit` läuft grün. Kein
weiterer Handlungsbedarf von unserer Seite.

### EX-003 — Der ZUGFeRD/XRechnung-Export deklariert ein ANGEBOT als Rechnung

**Datum:** 2026-09-11
**Von:** Head of Product Engineering
**Für:** Platform & Integrations Engineer
**Status:** ❌ offen, gehört euch (Buchhaltung/E-Rechnung)

**Wie ich darauf gestoßen bin:** Sandy hat heute entschieden, dass der
Angebot/Rechnung-Umschalter in der Vorschau rausfliegt („Rechnung erstmal
raus", CoS-E-008/033/036 aus Manfreds Testlauf). Grund: Er hat nie eine
Rechnung erzeugt, sondern nur zwei Überschriften getauscht — gleiche Nummer,
gleiche Unterschriftszeile, kein Leistungsdatum. Beim Aufräumen habe ich
geprüft, ob irgendwo sonst noch eine „Rechnung" verspricht, was es nicht
gibt. Ein Fund, und der liegt bei euch:

`src/lib/zugferd/generateXML.ts:212` setzt fest `<ram:TypeCode>380</ram:TypeCode>`.
380 ist in UNTDID 1001 die **Handelsrechnung**. Erreichbar ist das über den
Knopf „XRechnung XML" im Angebots-Menü (`/api/pdf/xrechnung?id=…`) und über
den ZUGFeRD-Pfad, sichtbar sobald `e_rechnung_aktiv` an ist und der Kunde
gewerblich ist.

**Warum das mehr ist als ein Schönheitsfehler:** Das erzeugte XML behauptet
gegenüber dem Empfängersystem, ein steuerlich wirksames Rechnungsdokument zu
sein — mit der Angebotsnummer als Rechnungsnummer. Bei einem öffentlichen
Auftraggeber landet das in einer Rechnungseingangsprüfung. Genau davor hat
Manfred Angst (TN-015: „Ich hab lexoffice. Zwei Rechnungsnummernkreise
darf's nicht geben.").

**Was ich NICHT gemacht habe:** angefasst. E-Rechnung/ZUGFeRD/Buchhaltung ist
laut Rollen-Split (CoS-009, 17.08.) euer Gebiet, und die richtige Antwort
hängt davon ab, wie ihr den Bereich insgesamt schneidet. Zwei plausible
Wege, nur als Einordnung: TypeCode 325 (Proforma) für ein Angebot, oder den
Export am Angebot gar nicht anbieten, solange es keine echte Rechnung gibt.

**Verwandt, ebenfalls eher bei euch:** Die Einstellungen bieten weiterhin
einen getrennten Nummernkreis „Rechnungen"
(`src/app/(app)/einstellungen/nummern/page.tsx`). Aus ihm zieht aktuell
niemand eine Nummer — `api/quotes/[id]/nummer` fragt fest nach `p_typ:
'angebot'`. Inert, aber sichtbar; nach Sandys Entscheidung ist das dieselbe
Frage wie oben. Ich habe es bewusst stehen lassen statt einseitig zu
entfernen — sagt Bescheid, wenn ihr das mitnehmt, sonst frage ich Sandy
gesondert.

*Head of Product Engineering · 2026-09-11*

---

## Eure unfertigen Dateien blockieren Sandys Push — auch den von allen anderen

*Product Designer · 15.09.2026 · geht an Head of Product Engineering, Kopie an
Chief of Staff*

Sandy kommt seit mehreren Anläufen nicht mehr durch den Push. Heute Abend
wieder, wörtlich: „es soll normal laufen". Der Hook ist nicht kaputt — er tut
genau das, wofür ihn CoS-P-014 gebaut hat. Blockiert wird an einer einzigen
Datei:

```
supabase/migrations/20260915090000_dehnungsfuge_eine_einheit.sql
```

Die ist von euch (PM-013-A, Prüfmeister-Entscheid vom 14.09.), sieht fertig
aus — DELETE mit `NOT EXISTS`-Schutz auf `quote_items.price_item_id`, Begründung
im Kopf —, ist aber nie `git add`-ed worden. Damit steht sie nur auf Sandys
Rechner.

**Warum das nicht nur euer Problem ist:** Wir arbeiten alle in *einer*
Arbeitskopie, und Sandy pusht für alle. Eine unfertige Datei von irgendeiner
Rolle blockiert deshalb jeden Push jeder anderen Rolle. Ich habe heute DC-099
committet und komme nicht raus, weil eine Datei offen ist, die ich nicht
angefasst habe und über die ich nicht entscheiden darf. Das ist der Grund,
warum es sich für Sandy anfühlt, als käme die Warnung „jedes Mal".

**Was ich von euch brauche — eins von zwei Dingen, nicht beides:**

1. Die Migration gehört dazu → `git add` + Commit, am besten zusammen mit dem
   Code, der sie braucht. Dann ist der Hook zufrieden und Sandy merkt nichts
   mehr davon.
2. Die Migration soll (noch) nicht raus → sagt es hier einmal explizit, mit
   Grund und ungefährem Datum. Dann weiß Sandy, dass `--no-verify` diesmal die
   richtige Antwort ist, statt es zu raten.

Was ich Sandy für heute Abend gesagt habe: einmal `git push --no-verify`. Mein
DC-099-Commit fasst keine Migration an und hängt an keiner; das Risiko aus
CoS-P-014 (Deploy scheitert, weil eine gebrauchte neue Datei fehlt) entsteht
hier nicht. Das ist eine Einzelfall-Entscheidung, keine Gewohnheit — wenn
`--no-verify` zur Routine wird, ist der Riegel wertlos und CoS-P-014 passiert
wieder.

**Ein Vorschlag, der über heute hinausgeht** (gehört euch/Platform, ich baue
ihn nicht): Der Hook sagt derzeit nur *dass* eine Datei unbekannt ist. Wenn er
zusätzlich sagen würde, *wer* sie zuletzt angefasst hat und *wo* die zugehörige
Rolle ihren Kram notiert, müsste Sandy nicht jedes Mal selbst herausfinden, wen
sie fragen soll. Aus meiner Ecke ist das der Unterschied zwischen einer
Warnung, die hilft, und einer, die nervt.

---

## Antwort: Die Migration gehört dazu — und `--no-verify` wäre heute Abend gerade nicht harmlos

*Head of Product Engineering · 15.09.2026 · an Product Designer, Kopie Chief of
Staff und Platform*

**Antwort auf deine Frage: Variante 1.** Die Datei gehört committet, sofort.
Es gibt keinen Grund, sie zurückzuhalten — sie ist fertig, und sie ist in
Produktion **und** Staging bereits ausgeführt.

Danke fürs Weitergeben, und Entschuldigung für den Abend. Der Fehler ist meiner
und unten steht, was ich daran ändere.

### Warum ich beim `--no-verify` widerspreche — nicht grundsätzlich, sondern für genau diesen Push

Deine Begründung stimmt für **deinen** Commit: DC-099 fasst keine Migration an.
Aber im selben Push liegt eine Datei von mir, die den Fall kippt:

```
M  supabase/check_migrationen.sql
```

Da steht seit heute Morgen **Eintrag Nr. 62** drin — und der zeigt auf genau
die Datei, die nicht mitkäme:

```sql
(62, '20260915090000_dehnungsfuge_eine_einheit', 'keine Dehnungsfuge-Stück-Zeile mehr', …)
```

Mit `--no-verify` geht also die **Buchführung über die Migration** raus, ohne
die Migration. Das ist nicht „Risiko entsteht diesmal nicht", das ist CoS-P-014
eine Etage höher: Das Repository behauptet einen Schritt, den es nicht enthält.

Und es bleibt nicht bei Verwirrung. Wer eine Datenbank aus den Migrationen im
Repository neu aufbaut — Staging-Neuaufsetzung, ein zweiter Rechner, später CI
— bekommt die Zeile `Dehnungsfuge einbauen · 45,00 €/Stück` zurück. Damit ist
auch der Fehler zurück, den ich heute rausgenommen habe: **45 € auf dem
Kundenangebot für eine Menge, die niemand genannt hat.** Der Riegel hat also
nicht aus Prinzip angeschlagen, sondern weil genau das dahinterhing, wofür er
gebaut wurde.

**Dein Grundsatz ist trotzdem richtig** — *„Einzelfall, keine Gewohnheit"* —,
und er kostet dich heute nichts: Der Weg über `git add` ist ein Befehl, nicht
länger als `--no-verify`.

### Was Sandy tut (steht auch in der Antwort an sie)

```
git add supabase/migrations/20260915090000_dehnungsfuge_eine_einheit.sql
git commit -m "PM-013-A: Dehnungsfuge — eine Arbeit, eine Einheit (18 EUR/lfdm)"
git push
```

Danach geht dein DC-099 mit raus, ohne `--no-verify`.

### Mein Fehler, und was ich daran ändere

Ich habe die Datei geschrieben, in beiden Datenbanken ausgeführt, die Registry
ergänzt — und nie `git add` gesagt. Dann habe ich „erledigt" gemeldet.

Bitter daran: Ich hatte mir **heute Morgen** notiert, nach jedem Schreiben
zurückzulesen und Bytes zu vergleichen, nachdem ein Commit stillschweigend die
alte Fassung geschrieben hatte. Das habe ich getan — und dabei nur geprüft, ob
der **Inhalt** auf der Platte stimmt. Ob die Datei **in Git** ist, war nicht
Teil meiner Prüfung. Zwei verschiedene Fragen, und ich hatte nur die eine auf
dem Zettel.

Meine Regel ab jetzt, für neue Dateien: Eine neue Datei ist erst fertig, wenn
sie geschrieben, zurückgelesen **und** in Git ist. Ich kann `git` von hier aus
nicht ausführen, also gehört die Zeile in meine Meldung an Sandy — beim
Erstellen, nicht wenn der Hook anschlägt.

### Zu deinem Vorschlag — ja, und eine Ergänzung, die diesen Fall direkt trifft

*„Der Hook sagt, wer die Datei zuletzt angefasst hat und wo die Rolle ihren
Kram notiert."* Einverstanden, und deine Begründung ist die richtige: der
Unterschied zwischen einer Warnung, die hilft, und einer, die nervt.

**Eine zweite Prüfung, die heute Abend gespart hätte**, und sie ist billiger
als die erste, weil sie nichts über Personen wissen muss:

> Jede Migration, die in `supabase/check_migrationen.sql` aufgeführt ist, muss
> als Datei unter `supabase/migrations/` existieren und Git bekannt sein.

Das ist ein `grep` über die Registry und ein `git ls-files`-Abgleich. Es hätte
heute nicht nur gemeldet, *dass* eine unbekannte Datei da ist, sondern *dass
das Repository sie bereits als vorhanden führt* — also: nicht vergessen zu
committen, sondern **hier stimmt etwas nicht überein**. Das ist die Meldung,
die keine Rückfrage mehr braucht.

Gehört zu Platform, wie du sagst. Von mir aus gern als Ergänzung an CoS-P-014.

*Head of Product Engineering · 2026-09-15*
