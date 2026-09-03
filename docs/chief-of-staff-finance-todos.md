# Chief of Staff ↔ Head of Finance — Koordinations-Todos

Gemeinsame Datei von Chief of Staff und Head of Finance (neue Stelle seit
19.08.2026, siehe `docs/team-organigramm.md`). Hier landen alle Themen rund
um Geschäftskosten, später auch Einnahmen und Kennzahlen.

**Nicht hier rein:** technische Anbindung von Buchhaltungssoftware
(Lexware/sevDesk — das läuft über den Platform & Integrations Engineer,
`docs/chief-of-staff-platform-todos.md`). Head of Finance liest und ordnet
Zahlen ein, baut aber keine Schnittstellen.

**Ablauf:** Chief of Staff trägt neue Punkte ein, sobald sie entstehen. Head
of Finance trägt nach Erledigung ein kurzes **Fix-Update**/**Update** direkt
unter dem jeweiligen Punkt ein. Status-Zeile danach aktualisieren.

Jeder Punkt hat eine feste ID (CoS-F-XXX).

**Status-Zeichen:** ✅ erledigt & geprüft · 🟡 erledigt, noch nicht
nachgeprüft · ❌ offen · 🔵 Entscheidung bei Sandy nötig · ⏳ wartet auf
Vorbedingung.

**Wichtig, unbedingt beachten:** Head of Finance hat aktuell **keinen
Zugriff auf Sandys E-Mail-Postfach** — bewusste Entscheidung, siehe
`team-organigramm.md`. Rechnungen/Belege kommen von Sandy zugeschickt bzw.
liegen in einem gemeinsamen Ordner (Sandy richtet den Ablageort ein, sobald
Head of Finance loslegt). Bitte nicht von dir aus um Postfach-Zugang bitten —
falls die Arbeit ohne echten Blick ins Postfach nicht sauber möglich ist,
das als offenen Punkt hier eintragen, Chief of Staff bespricht das dann mit
Sandy.

**Datei-Sicherheit (neu, 20.08.2026):** In anderen Koordinationsdateien
dieses Projekts ist wiederholt (6. Mal) ein Speicherfehler bei
gleichzeitiger Bearbeitung aufgetreten. Ganz am Ende dieser Datei steht
deshalb jetzt eine feste Markierung (`<!-- ENDE DER DATEI -->`). Taucht beim
Lesen noch Text NACH dieser Markierung auf, ist das zweifelsfrei ein
Speicherfehler — bitte nicht selbst löschen, sondern kurz dem Chief of Staff
melden. Zusätzlich: neue Einträge wenn möglich ans Dateiende anhängen statt
mitten in bestehende Abschnitte zu schreiben. Voller Hintergrund: CoS-013 in
`chief-of-staff-todos.md`.

## Stand auf einen Blick (angelegt: 2026-08-19)

| ID | Thema | Status | Quelle |
|---|---|---|---|
| CoS-F-003 | Finanzplan aufstellen: 24 Monate, drei Szenarien — Break-even, Einkommensersatz, Liquidität/Runway | ✅ geliefert & vom Chief of Staff abgenommen (03.09.) — sechs Plan-Blätter in `kostenuebersicht-finance.xlsx`. Kernergebnis: B1 (30 Std.) realistisch Monat 21, B2 in keinem Szenario innerhalb von 24 Monaten; Vorstrecken bis –9.280 € (realistisch). Offen: UG-Besteuerung (Steuerberater), Abwanderung und Support-/Grundlast-Stunden als wichtigste ungeprüfte Annahmen | Sandy direkt, 2026-09-03 |
| CoS-F-002 | Marge und Tragfähigkeit des neuen Preises (49 €/29 €) durchrechnen — inkl. echter Kosten pro Angebot | ✅ erledigt & geprüft (03.09.) — DB 47,89 € bzw. 28,19 € je Kunde, Vielnutzer unkritisch, Fixkosten heute 135,10 €/Monat, Kleinunternehmergrenze je nach Szenario ab Monat 35/21/12 | Sandys Preisentscheidung 2026-09-03, `docs/preismodell.md` |
| CoS-F-001 | Bestandsaufnahme laufende Kosten + Grundgerüst für monatliche Übersicht | 🔵 echte Zahlen drin, 4 Punkte brauchen Sandys Klärung | Sandys Auftrag, 2026-08-19 |

---

## CoS-F-001 — Bestandsaufnahme laufende Kosten + monatliche Übersicht aufbauen

**Datum:** 2026-08-19
**Status:** 🔵 echte Zahlen drin, 4 Punkte brauchen Sandys Klärung

**Hintergrund:** Sandy hat bereits laufende Kosten für mehrere Tools/Dienste
(u. a. Supabase, Anthropic/Claude, Vercel, OpenAI/Whisper, Resend, Domain),
aber bisher keine saubere, zentrale Übersicht darüber. Ziel dieser ersten
Aufgabe: Klarheit schaffen, bevor mehr dazukommt (Einnahmen, Prognosen —
das folgt erst in Phase 2, nach Sandys Go).

**Konkreter Auftrag:**
1. Bestandsaufnahme aller aktuell laufenden, wiederkehrenden Kosten. Was aus
   den Projektdateien bekannt ist (Supabase, Anthropic/Claude, Vercel,
   OpenAI, Resend, Domain sofortangebot.app) als Ausgangspunkt nehmen, mit
   Sandy direkt abgleichen für alles, was nur sie weiß (genaue Tarife,
   weitere Tools, Kreditkarten-Abbuchungen o. ä.).
2. Ein sauberes, wiederverwendbares Grundgerüst für die **monatliche
   Übersicht** aufbauen — Vorschlag: eine echte Tabelle (Spreadsheet), nicht
   nur Fließtext, da die Daten von Natur aus tabellarisch sind (Dienst,
   Kategorie, monatlicher Betrag, Abrechnungsrhythmus, Vertragsstand/
   Kündigungsfrist falls relevant, Trend über Zeit).
3. Kurzen Vorschlag an Sandy, wie/wo diese Übersicht dauerhaft geführt
   werden soll (z. B. eigene Datei/Tabelle unter `docs/`), bevor das zur
   laufenden Praxis wird — nicht einfach loslegen und hoffen, dass das
   Format passt.

**Bewusst nicht Teil dieses ersten Auftrags:** Einnahmen-Tracking,
Kennzahlen (Kosten pro Angebot, Runway), Prognosen — das ist Phase 2, folgt
erst nach Sandys ausdrücklichem Go, sobald Phase 1 sauber läuft.

**Für Sandy:** Sobald Head of Finance die Bestandsaufnahme hat, wird es
vermutlich ein paar Rückfragen geben (genaue Tarife, ob es weitere laufende
Kosten außerhalb der Projekt-Tools gibt). Bitte kurze Antwortzeit einplanen,
damit der erste Auftrag nicht hängen bleibt.

**Update (Head of Finance, 2026-08-19):** Grundgerüst steht —
`docs/kostenuebersicht-finance.xlsx` (drei Blätter: Kostenübersicht,
Monatsverlauf, Legende & offene Punkte). Struktur mit Sandy abgestimmt
(xlsx im Repo unter `docs/`, wie hier vorgeschlagen).

Bestandsaufnahme im Code/den Projektdateien ergänzt Sandys Ausgangsliste um
zwei bisher nicht genannte laufende Kostenpositionen: **Sentry**
(`@sentry/nextjs` im Code, Error-Monitoring) und **Stripe**
(Zahlungsabwicklung, transaktionsbasiert statt Fixkosten). Außerdem
festgestellt: Supabase läuft aktuell mit **zwei separaten Projekten**
(Staging + Produktion `yqlledouhfovytifeekd`, siehe
`docs/operations/database-and-environments.md`) — unklar, ob beide
kostenpflichtig sind. Und: die tägliche DB-Backup-Automation legt
GitHub-Actions-Artefakte mit 30/90/365 Tagen Aufbewahrung an, was je nach
GitHub-Plan Kosten verursachen kann.

Alle Beträge in der Tabelle sind aktuell Platzhalter (gelb markiert, Status
„zu bestätigen"/„neu entdeckt"/„zu prüfen") — die eigentliche
Bestandsaufnahme (Teil 1 des Auftrags) ist damit noch nicht abgeschlossen,
das hängt an Sandys Rückmeldung zu den offenen Punkten (Liste im
Legende-Blatt der Datei). Sobald die Zahlen da sind, wird der Status auf
✅ gesetzt.

**Update (Head of Finance, 2026-08-19, Teil 2):** Sandy hat einen
Belege-Ordner freigegeben (`Rechnungen/`, außerhalb des Repos — bewusst so
vorgeschlagen, damit Rechnungen mit sensiblen Daten nicht ins Git-Repo
kommen). Darin lagen 8 Rechnungen (Supabase ×3, Vercel ×3, Anthropic ×1,
OpenAI ×1) plus eine Apple/iTunes-Beleg-E-Mail. Damit sind erstmals echte
Zahlen in `docs/kostenuebersicht-finance.xlsx` eingetragen (Kostenübersicht
+ Monatsverlauf, Mai–Juli 2026 für Supabase/Vercel).

**🔵 Auffälligkeiten, die eine Entscheidung/Klärung von Sandy brauchen**
(alle orange markiert in der Tabelle, ich habe nichts davon selbst
entschieden):

1. **Supabase wird spürbar teurer:** Mai $25,00 → Juni $49,97 → Juli
   $54,30, durch Nutzungsgebühren (u. a. neu ab Juli „Realtime Peak
   Connections"). Zusätzlich tauchen in den Rechnungen **5 verschiedene
   Supabase-Projekt-Referenzen** auf, dokumentiert sind aber nur 2
   (Staging + Produktion). Möglich, dass da ungenutzte Projekte
   mitlaufen und Geld kosten — das wäre ggf. ein Punkt für den Platform &
   Integrations Engineer, aber die Entscheidung/Priorisierung liegt bei
   Sandy bzw. bei dir als Chief of Staff.
2. **Zwei offenbar getrennte Claude-Kostenpositionen:** eine direkte
   Anthropic-Rechnung („Prepaid extra usage, Individual plan", $53,55,
   Geschäftsadresse Wielandstraße 11) UND ein separates Claude-Pro-Abo
   über Apple/iTunes (22 €/Monat, andere Adresse Krampasplatz 4b, Zahlung
   per PayPal, „iPhone von Sandra"). Unklar ob das Apple-Abo geschäftlich
   oder privat ist.
3. **OpenAI-Rechnung auf fremden Namen:** ausgestellt auf „Hugo" /
   runningwithhugo@outlook.de — nicht auf Sandra Holm / das sonst genutzte
   einfachanfrage@outlook.com. Bitte prüfen, ob das der richtige Account
   für Sofortangebot ist.
4. Zwei unterschiedliche Rechnungsadressen für Sandra Holm im Umlauf
   (Wielandstraße 11 vs. Krampasplatz 4b) — vermutlich alt/neu, aber
   nicht selbst angenommen.

**Noch offen / kein Beleg gefunden:** Resend, Domain sofortangebot.app,
Sentry, GitHub-Plan (wegen der Backup-Artefakte). Komplette Liste mit
Kontext steht im Blatt „Legende & offene Punkte" der xlsx-Datei.

Status bleibt 🟡, da die Bestandsaufnahme erst mit Sandys Rückmeldung zu
den vier Punkten oben und den fehlenden Belegen wirklich abgeschlossen ist.

**Update (Head of Finance, 2026-08-19, Teil 3):** Sandy hat den Wunsch
geäußert, dass die Übersicht von Anfang an so dokumentiert wird, dass ein
künftiger Steuerberater direkt damit arbeiten kann. Daraufhin
`docs/kostenuebersicht-finance.xlsx` um ein neues Blatt **„Rechnungsjournal"**
erweitert — eine Zeile pro Beleg mit Rechnungsnummer, Leistungszeitraum,
Netto-/USt-/Brutto-Betrag, steuerlicher Einordnung (insbesondere Reverse
Charge bei Supabase/Singapur) und Verweis auf die Original-Beleg-Datei im
`Rechnungen`-Ordner. Das Blatt „Monatsverlauf" zieht seine Zahlen jetzt per
Formel direkt aus dem Journal (SUMIFS nach Monat/Dienst/Währung) und
aktualisiert sich automatisch, sobald neue Belege ergänzt werden.

Sandy hat außerdem eine zweite Apple/Claude-Pro-Beleg-Mail nachgereicht
(3.8.2026, 22 €, gleiches Abo wie im Mai-Beleg) — damit sind jetzt 10 Belege
im Journal (Mai–August 2026). Auffällig: Juni- und Juli-Abbuchung dieses
Abos fehlen noch als Beleg.

**🔵 Neue offene Grundsatzfrage:** Ist Sandy umsatzsteuerlich
Kleinunternehmerin (§19 UStG) oder in der Regelbesteuerung? Das entscheidet,
wie die Reverse-Charge-Rechnungen (Supabase) und der Vorsteuerabzug bei den
übrigen Diensten zu behandeln sind — aktuell im Journal bewusst neutral
dokumentiert, bis das geklärt ist. Bitte auch mit dem künftigen
Steuerberater besprechen.

Die aktualisierte Datei konnte noch nicht zurück ins Repo geschrieben
werden, weil sie gerade auf Sandys Rechner geöffnet war (Datei-Sperre) —
Sandy hat eine frische Kopie per Chat bekommen, ich versuche das Zurück-
schreiben erneut, sobald sie geschlossen ist.

**Update (Head of Finance, 2026-08-19, Teil 4):** Sandy hat die
Grundsatzfrage beantwortet: **noch kein Gewerbe angemeldet**, geplant ist
der Start als Kleingewerbe/Kleinunternehmerin. Datei konnte danach
erfolgreich zurückgeschrieben werden.

Eingearbeitet: Die bisherigen 10 Belege stammen damit alle aus der Zeit vor
der offiziellen Gründung — das ist normal, solche Kosten lassen sich in der
Regel später als „vorweggenommene Betriebsausgaben" geltend machen, wenn
der Beleg-Nachweis sauber ist (genau dafür ist das Rechnungsjournal gut).
Die Anthropic-Notiz zur deutschen Steuernummer auf der Rechnung habe ich
entsprechend korrigiert (vermutlich Sandys private Steuer-ID, nicht
zwingend eine Geschäfts-Steuernummer, da ja noch kein Gewerbe existiert).

Zwei Detailfragen bleiben bewusst offen (im Blatt „Legende & offene
Punkte" dokumentiert, keine verbindliche Auskunft von mir, nur Vorbereitung
für den Steuerberater):
1. Ist mit „Kleingewerbe" konkret die umsatzsteuerliche
   Kleinunternehmerregelung (§19 UStG) gemeint?
2. Wie sind die Supabase-Reverse-Charge-Rechnungen als Kleinunternehmerin
   zu behandeln (USt-Pflicht auf Auslandsleistungen kann trotzdem
   bestehen bleiben, Vorsteuerabzug bei den anderen Diensten entfällt
   i. d. R.)?

Neuer Punkt auf der offenen Liste: geplantes Datum der Gewerbeanmeldung
(hilft bei der Abgrenzung, welche Belege als vorweggenommene
Betriebsausgaben zählen).

**Update (Head of Finance, 2026-08-19, Teil 5):** Sandy hat Frage 1
konkret bestätigt: **Kleinunternehmerregelung nach §19 UStG.** In
`docs/kostenuebersicht-finance.xlsx` entsprechend nachgezogen (Journal,
Kostenübersicht, Legende) — nicht mehr als „geplant/vermutlich",
sondern als bestätigter Status vermerkt. Einzig offene Detailfrage bleibt,
wie die Supabase-Reverse-Charge-Rechnungen konkret als Kleinunternehmerin
zu behandeln sind (§13b UStG kann trotz §19 UStG greifen) — das braucht
den Steuerberater, keine eigene Auskunft von mir.

**Update (Head of Finance, 2026-08-19, Teil 6):** OpenAI-Punkt geklärt —
Sandy bestätigt, der Account gehört ihr, „Hugo" ist ein historischer
Nutzername/E-Mail-Alias bei OpenAI, der sich nachträglich nicht mehr auf
„Sandra Holm" ändern lässt. Kein falscher Account. In
`docs/kostenuebersicht-finance.xlsx` als geklärt markiert (Journal,
Kostenübersicht, Legende) — damit sind von den ursprünglich vier
Auffälligkeiten jetzt zwei abschließend geklärt (Kleinunternehmer-Status,
OpenAI-Konto), zwei bleiben offen (Supabase-Projektanzahl/Kostentrend,
Claude-Doppel-Abo geschäftlich/privat).

---

## CoS-F-Info (2026-09-01) — kleine Ausgabe kommt: DIN-Normtexte

Head of Legal & Compliance kauft in Kürze die offiziellen DIN-Normtexte
18363/18365 (ca. 150 €, von Sandy freigegeben — S-5 in
`docs/entscheidungen-fuer-sandy.md`). Kein eigenständiges Ticket nötig, nur
zur Info, damit die Ausgabe nicht als unbekannter Posten auftaucht, wenn sie
in der Kostenübersicht landet.

---

**Update (Head of Finance, 2026-09-02, Teil 7):** Sandy hat 14 neue Dateien
im `Rechnungen`-Ordner bereitgestellt. Davon waren 7 tatsächlich neue Belege
(IONOS ×5, Supabase MVGOOM-00007, Vercel TT0BDQ8S-0005), die restlichen 7
waren Zahlungsbestätigungen zu bereits erfassten Rechnungen (3× Vercel-Receipt
mit Kartendaten, 3× Supabase-Receipt). `docs/kostenuebersicht-finance.xlsx`
ist entsprechend aktualisiert, neu berechnet (0 Formelfehler) und ins Repo
zurückgeschrieben. Journal jetzt 17 Belege (2026-001 bis 2026-017).

Zwei Ergebnisse aus den Zahlungsbestätigungen, nichts Kritisches: Vercel wird
laut allen vier Zahlungsbelegen durchgängig mit **Visa •••3991** bezahlt —
bei den bestehenden Journal-Zeilen 2026-002/005/007 nachgetragen (vorher
„unbekannt"). Und im August-Supabase-Beleg taucht die fünfte, bisher nicht
dokumentierte Projekt-Referenz erstmals nicht mehr auf (nur noch 4 statt 5) —
könnte heißen, dass sich der offene Punkt „5 vs. 2 dokumentierte
Supabase-Projekte" von selbst entschärft. Bitte trotzdem noch bestätigen statt
sich darauf zu verlassen.

**🔵 Neuer, wichtigerer Fund — bitte lesen:** Die IONOS-Rechnungen (alle 5,
April–August, gleiche Vertragsnummer 111811442) bündeln **mehrere Domains in
einer Rechnung**, nicht nur sofortangebot.app. Konkret laufen darüber auch
`einfach-anfrage.com`, `einfachanfrage.com`,
`einfachanfrage-hochzeitsfotografie.de` und `einfachanfrage-tattoo.de` — das
sind erkennbar andere/ältere Projekte, keine Sofortangebot-Kosten. Ich habe
sie deshalb **nicht** mitgezählt. Um das sauber abzubilden, habe ich dem
Rechnungsjournal eine neue Spalte **„Sofortangebot-Anteil (Brutto)"**
hinzugefügt: „Brutto-Betrag" bleibt weiterhin die volle Original-
Rechnungssumme (GoBD-Vollständigkeit/Nachvollziehbarkeit), aber
„Sofortangebot-Anteil" zeigt nur den Teil, der wirklich zu Sofortangebot
gehört. Der Monatsverlauf rechnet jetzt mit dieser neuen Spalte, nicht mehr
mit dem vollen Brutto-Betrag — sonst wären fremde Domainkosten mit in die
Sofortangebot-Kostenübersicht gerutscht.

Sofortangebot.app selbst wurde am 08.06.2026 registriert (12,00 € brutto,
Juni-Rechnung) — das ist jetzt sauber im Journal (2026-013) und in der
Kostenübersicht verbucht. Zwei Positionen bleiben bewusst ungeklärt, bitte
von Sandy bestätigen: „Domain Guard" (Privatsphärenschutz, 1,00 €, exakt
gleicher Vertragszeitraum wie die Domain-Registrierung — spricht dafür, dass
es dazugehört, ist aus dem Beleg allein aber nicht sicher) und „IONOS Mail
Basic 5" (Postfach, 2,50 €/Monat, läuft seit Juni durch). Beides ist aktuell
mit 0,00 € Sofortangebot-Anteil verbucht, bis das bestätigt ist — ich wollte
hier nichts schätzen oder selbst entscheiden.

**🔵 Neues Thema von Sandy: UG-Überlegung.** Sandy erwägt, statt/neben dem
geplanten Kleingewerbe eine UG (haftungsbeschränkt) anzumelden. Das ist eine
Entscheidung, die über meinen Auftrag hinausgeht (Rechtsform-/
Gründungsfrage) und die Sandy explizit als CoS-Thema markiert hat, weil sie
mehrere Rollen betrifft (z. B. Impressum/Branding beim Marketing,
Zahlungsanbieter-Setup beim Platform Engineer). Ich habe Sandy im Chat
sachlich erklärt, was eine UG buchhalterisch bedeuten würde (u. a. Pflicht
zur doppelten Buchführung/Bilanzierung statt einfacher EÜR, Körperschaft-
und Gewerbesteuer ohne Freibetrag, 25 %-Rücklagepflicht bis 25.000 €
Stammkapital) — ohne eine Empfehlung abzugeben, das ist Sache von Sandy und
einem Notar/Steuerberater. Bitte als offenen Punkt für dich vormerken, falls
andere Rollen betroffen sind.

**Update (Head of Finance, 2026-09-02):** Zur Info gesehen — CoS-F-Info
(DIN-Normtexte, ca. 150 €, oben). Sobald der Beleg im `Rechnungen`-Ordner
liegt, wird er wie gewohnt ins Journal aufgenommen.

Stand jetzt: von den ursprünglich vier Auffälligkeiten sind zwei geklärt
(Kleinunternehmer-Status, OpenAI-Konto), zwei bleiben offen
(Supabase-Projektanzahl/-trend, Claude-Doppel-Abo). Neu dazugekommen: die
IONOS-Domain-Zuordnung (Domain Guard/Mail Basic) und die UG-Überlegung.
Status bleibt 🔵.

---

**Update (Head of Finance, 2026-09-02, Teil 8):** Sandy hat die offene
IONOS-Frage aus Teil 7 direkt beantwortet: „Domain Guard" UND „IONOS Mail
Basic 5" gehören beide zu sofortangebot.app. Damit ist die Juni-Rechnung
(2026-013) jetzt vollständig als Sofortangebot-Kosten verbucht (15,50 €
statt vorher 12,00 €), und die laufenden monatlichen 2,50 € für das
Postfach (Juli/August, 2026-014/017) sind ebenfalls drin. Datei erneut
aktualisiert, neu berechnet (0 Formelfehler) und zurückgeschrieben. Damit
sind von den in Teil 7 neu aufgeworfenen Punkten alle geklärt bis auf die
UG-Überlegung, die ohnehin eine eigenständige Entscheidung ist.

---

## Rohdaten für CoS-F-002 liegen vor — KI-Kosten je Angebot (2026-09-03)

Head of Product Engineering, Zuarbeit aus CoS-038. Die volle Erhebung steht in
**`docs/ki-kosten-messung.md`** — hier nur, was du zum Weiterrechnen brauchst.

**Die Zahl: rund 2,2 Cent netto je Angebot.** Zusammensetzung (USD):
Whisper 0,0060 · Chip-Vorschau (GPT-4o-mini) 0,0002 · volle Extraktion
(GPT-4o) 0,0172. Ein Angebot besteht im Median aus **einer** Aufnahme und
**einer** Extraktion (59 Aufnahmen seit August, Mittelwert 1,23 je Angebot).

**Für deinen Vielnutzer-Fall:** 40 Angebote/Monat ≈ **0,86 €**. Selbst ein
Betrieb, der jede Aufnahme dreimal einspricht (120 Extraktionen), liegt bei
rund 2,60 € — etwa 5 % des Gründerpreises. **„Unbegrenzt Angebote" scheitert
nicht an den KI-Kosten.** Ob es an Supabase/Vercel scheitert, ist deine
Rechnung, nicht meine.

**Drei Warnungen, ohne die die Zahl in die Irre führt:**

1. **Nimm nicht die Spalte `ki_usage.kosten_eur`.** Sie wurde bis Ende Juli
   mit den Preisen von GPT-4o-mini berechnet, während GPT-4o lief —
   **15-fach zu niedrig**. Ab August stimmt sie. Alles oben ist aus den
   Token-Zahlen neu gerechnet, die sind durchgehend verlässlich.
2. **Der Whisper-Anteil ist geschätzt, nicht gemessen.** Die Aufnahmedauer
   wurde durch einen Fehler in der Aufnahme-Oberfläche nie gespeichert (alle
   81 Aufnahmen ohne Dauer), damit war der Whisper-Posten rechnerisch immer
   exakt 0. Fehler ist gefunden und behoben; die Schätzung stützt sich
   solange auf die Dateigrößen im Speicher (263 Dateien, Median 291 KB, Opus)
   und ist mit offengelegter Annahme in der Messdatei hergeleitet. **Wenn du
   konservativ rechnen willst: 1,5 Minuten statt 1,0 → 2,5 statt 2,2 Cent.**
3. **Kein versteckter Kostenblock.** Für `matching` und `plausibilitaet` gibt
   es null Zeilen — die beiden KI-Endpunkte werden von der Anwendung gar nicht
   aufgerufen. Das Preis-Matching läuft lokal ohne KI.

**Was ich NICHT geliefert habe**, weil es nicht meine Rolle ist: Bewertung,
Deckungsbeitrag, Break-even. Nur die Messung.

---

## CoS-F-002 — Marge und Tragfähigkeit des neuen Preises durchrechnen

**Datum:** 2026-09-03
**Status:** ❌ offen

**Hintergrund:** Sandy hat am 03.09.2026 das Preismodell entschieden — 49 €
netto/Monat pro Betrieb, unbegrenzt Angebote; für die ersten 25 zahlenden
Betriebe dauerhaft 29 €. Volle Herleitung: `docs/preismodell.md`. Damit hat
deine Phase-2-Arbeit (Kennzahlen, nicht nur Kosten) zum ersten Mal eine
belastbare Einnahmenseite.

**Auftrag:**
1. **Kosten pro Angebot.** Das ist Punkt 8.5 in `docs/launch-readiness.md`
   („OpenAI-Kosten pro Angebot bekannt und tragbar") und steht dort seit jeher
   auf „nicht erhoben". Jede Zahl, die bisher irgendwo kursiert, ist geschätzt
   — auch meine. Die Rohdaten (Whisper + GPT-4o über die volle Pipeline)
   kommen von Head of Product Engineering, ich habe ihn unter CoS-038 darum
   gebeten; die Auswertung liegt bei dir.
2. **Deckungsbeitrag je Kunde** bei 49 € und bei 29 €, gegen die laufenden
   Fixkosten aus `kostenuebersicht-finance.xlsx`. Achte dabei besonders auf
   den **Vielnutzer-Fall** (ein Betrieb mit ~40 Angeboten/Monat) — dort
   entscheidet sich, ob „unbegrenzt Angebote" wirklich tragfähig ist oder ob
   es irgendwann eine faire Obergrenze braucht.
3. **Ab wann trägt sich der Betrieb?** Ab welcher Kundenzahl decken die
   Einnahmen die laufenden Kosten (Supabase steigt spürbar: Mai 25 $ → Juli
   54 $, dazu Vercel, OpenAI, Anthropic, Resend, Sentry, Domain)?
4. **Kleinunternehmergrenze.** Seit 2025 gilt 25.000 € Vorjahr / 100.000 €
   laufendes Jahr (netto). Bei 49 € reichen rund 43 zahlende Betriebe im
   Jahresdurchschnitt. Bitte rechne durch, ab welchem Monat das bei
   verschiedenen Wachstumsverläufen realistisch eintritt — Sandy braucht das
   als Grundlage für ein Steuerberater-Gespräch, das noch vor dem Launch
   stattfinden soll. Die rechtliche Einordnung dazu läuft parallel über
   CoS-L-002, die steuerliche Entscheidung trifft der Steuerberater, nicht wir.

**Nicht Teil dieses Auftrags:** Preisempfehlungen. Der Preis ist entschieden.
Wenn die Rechnung zeigt, dass er nicht trägt, ist das ein Befund an mich —
dann bringe ich das als neue Entscheidung zu Sandy zurück.

---

## CoS-F-003 — Finanzplan aufstellen

**Datum:** 2026-09-03 (Chief of Staff, direkter Auftrag von Sandy)
**Status:** ❌ offen — Auftrag steht, siehe Vorbedingungen unten

Sandy möchte einen sauberen Finanzplan. Das ist deine Rolle, nicht meine — ich
liefere hier nur den Auftrag und die Randbedingungen, damit du nicht das
Falsche baust. Das Wie liegt bei dir.

### Was der Plan beantworten soll (Sandys Auswahl, drei Fragen)

1. **Wann trägt es sich?** Ab wie vielen zahlenden Betrieben decken die
   Einnahmen die laufenden Kosten — inklusive Deckungsbeitrag pro Kunde bei
   49 € und bei 29 €.
2. **Wann kann Sandy ihre Festanstellung loslassen?** Welcher Umsatz ist
   nötig, damit sie von Sofortangebot leben kann — nach Steuern, Sozialabgaben
   und Rücklagen. **Das ist die eigentliche Kernfrage**, siehe die Warnung zur
   Steuerprogression unten.
3. **Liquidität & Runway.** Monat für Monat rein/raus: wie viel muss sie bis
   zum Break-even aus eigener Tasche vorstrecken, und wann wird es eng.

**Nicht Teil des Auftrags:** ein Businessplan-Finanzteil in Bankform. Sandy
hat das bewusst abgewählt. Wenn du beim Bauen merkst, dass es mit wenig
Zusatzaufwand mit abfällt, sag Bescheid — aber bau es nicht ungefragt.

### Rahmen

- **Horizont: 24 Monate** (September 2026 bis August 2028). Jahr 1 monatlich,
  Jahr 2 darf gröber werden.
- **Drei Szenarien** beim Kundenwachstum: vorsichtig / realistisch /
  optimistisch. Bitte die Annahme hinter jedem Szenario ausschreiben, damit
  Sandy sie beurteilen kann, statt einer Zahl vertrauen zu müssen.

### Feste Vorgaben, die du NICHT selbst setzen sollst

- **Der Preis ist entschieden** (Sandy, 03.09.2026, `docs/preismodell.md`):
  49 € netto/Monat pro Betrieb, unbegrenzt Angebote, monatlich kündbar;
  **Gründerpreis 29 €/Monat dauerhaft für die ersten 25 zahlenden Betriebe**;
  14 Tage Test ohne Kreditkarte; **kein Gratis-Tarif**; **kein Jahresabo vor
  Gate 2**. Du rechnest den Preis durch, du planst ihn nicht. Wenn die
  Rechnung zeigt, dass er nicht trägt, ist das ein Befund an mich.
- **Kein bezahltes Werbebudget zum Start** (`docs/vision-strategie.md`,
  18.08.). Wachstum organisch: Mundpropaganda, Content/SEO, Social Media. Das
  begrenzt die realistische Wachstumskurve — bitte nicht stillschweigend ein
  Marketingbudget unterstellen, um die Kurve schöner zu machen.
- **Keine Personalkosten**, aber ein Kostentreiber, den man leicht übersieht:
  das Team besteht aus KI-Rollen. Jede neue Rolle erhöht die Anthropic-Kosten,
  nicht die Lohnkosten. Bei geplantem Team-Ausbau nach Gate 1 gehört das in
  den Plan.

### Kostenbasis — bitte ziehen, nicht abtippen

Die Fixkosten stehen bereits belastbar in `docs/kostenuebersicht-finance.xlsx`
(Rechnungsjournal, 17 Belege). Der Plan soll darauf aufsetzen, damit es keine
zweite, driftende Zahlenwelt gibt — **eine Wahrheit pro Sache.** Ob als
zusätzliche Blätter in derselben Datei oder als eigene Datei, entscheidest du;
mein Vorschlag wäre dieselbe Datei, weil das Journal dort liegt.

**Was zusätzlich rein muss und heute noch nirgends steht:**

- **Einmalkosten, absehbar:** UG-Gründung (grob 300–480 € Notar/Handelsregister
  + praktisch mindestens 1.000 € Stammkapital + ca. 2.000 € Zusatzkosten im
  ersten Jahr, danach 1.500–2.000 €/Jahr laufend) · IT-Vermögensschaden-
  Haftpflicht (exali/Markel, 1 Mio. € Deckung — Beitrag noch nicht bekannt,
  Größenordnung 200–400 €/Jahr war Sandys früherer Stand, bitte als offene
  Zahl markieren statt zu raten) · DIN-Normtexte ca. 150 € (freigegeben) ·
  Markenanmeldung DPMA ca. 300 € · Steuerberater · Buchhaltungstool.
  Quelle für UG und Versicherung: `docs/entscheidungen-fuer-sandy.md`, S-4.
- **Variable Kosten pro Angebot:** hängt an **CoS-F-002**. Solange die Zahl
  nicht gemessen ist, bitte als klar markierte Annahme führen, nicht als Fakt —
  und im Vielnutzer-Fall durchspielen, weil dort „unbegrenzt Angebote" auf die
  Probe gestellt wird.
- **Zahlungsgebühren Stripe**, bei 49 € pro Kunde und Monat nicht trivial.

### Zwei Punkte, bei denen ich dich ausdrücklich warne

1. **Steuerprogression.** Sandy ist parallel fest angestellt. Der Gewinn aus
   Sofortangebot wird oben auf ihr Angestelltengehalt gerechnet und mit dem
   Grenzsteuersatz besteuert, nicht ab Null. Ein Plan, der den Gewinn wie ein
   Erstes Einkommen versteuert, zeigt „reicht zum Leben" deutlich zu früh an.
   Das ist genau die Frage 2 oben — bitte sauber trennen: Phase A (parallel zur
   Anstellung) und Phase B (Anstellung fällt weg).
2. **Krankenversicherung.** In Phase B fällt der Arbeitgeberanteil weg und die
   Beiträge kommen als eigener Posten dazu. Das ist erfahrungsgemäß der größte
   einzelne Sprung in genau dieser Rechnung und darf nicht fehlen.

**Eine Eingabegröße brauchst du von Sandy selbst:** wie viel Netto sie pro
Monat braucht, um zu leben. Bitte direkt bei ihr abfragen bzw. ihr eine Zelle
dafür bauen, in die sie den Wert selbst einträgt — ich habe die Zahl nicht und
frage sie auch nicht für dich ab.

### Vorbedingungen, die noch offen sind

Zwei Punkte aus CoS-F-001 warten seit dem 19.08. auf Sandy und sind bis heute
nicht beantwortet — mein Fehler, sie standen nie in
`docs/entscheidungen-fuer-sandy.md`, das habe ich am 03.09. nachgeholt:

1. Supabase: 5 Projekt-Referenzen in den Rechnungen bei 2 dokumentierten
   Projekten, Kosten Mai 25 $ → Juli 54 $. Im August-Beleg nur noch 4.
2. Claude-Pro-Abo über Apple (22 €/Monat): geschäftlich oder privat?

**Fang trotzdem an.** Beides betrifft die Fixkosten in einer Größenordnung von
wenigen Dutzend Euro im Monat — das verschiebt den Break-even, aber es
blockiert die Struktur des Plans nicht. Bitte die betroffenen Zellen sichtbar
als Annahme markieren und nachziehen, sobald die Antworten da sind.

### Wenn du fertig bist

Kurze Rückmeldung hier, plus die **drei Zahlen, die Sandy wirklich braucht**:
ab wie vielen Kunden trägt es sich · wie viel muss sie bis dahin vorstrecken ·
ab welchem Umsatz kann sie die Anstellung loslassen. Der Rest ist Beleg.

---

## CoS-F-001 — zwei offene Punkte beantwortet (Sandy, 2026-09-03)

1. **Claude-Pro-Abo über Apple (22 €/Monat): geschäftlich.** Bitte als
   Betriebskosten führen. Wichtiger Zusatz von Sandy im selben Atemzug: **es
   ist bis heute kein Gewerbe angemeldet.** Damit sind alle bisherigen Belege
   vorweggenommene Betriebsausgaben — deine Einordnung vom 19.08. bleibt also
   richtig, sie gilt jetzt nur für einen längeren Zeitraum als gedacht. Der
   Anmeldezeitpunkt selbst ist ein offener Punkt bei Sandy (siehe
   `entscheidungen-fuer-sandy.md`, „Gewerbeanmeldung"); Legal arbeitet unter
   CoS-L-003 die Reihenfolge Einzelunternehmen/UG aus.
2. **Supabase-Projekte: erledigt.** Sandy hat die übrigen Projekte selbst
   gekündigt. Kein Platform-Ticket nötig. Ihre Erwartung für die Zukunft:
   „bleibt wohl bei ca. 50 € im Monat, oder steigt bei mehr Nutzern?" — genau
   das ist die zweite Hälfte der Frage und **keine Sandy-Frage**. Ich habe sie
   an Platform geroutet (**CoS-P-008**, Skalierungs-Kostenmodell). Bitte deren
   Ergebnis abwarten, bevor du die Betriebskosten im Plan fortschreibst, und
   bis dahin sichtbar als Annahme führen.

---

## CoS-F-003, Nachtrag 1 (Chief of Staff, 2026-09-03) — Vollständigkeit

Sandy hat nachgeschärft: **„beim Finanzplan soll natürlich ALLES
mitberücksichtigt werden. auch kosten für anwalt, notar, UG gründung,
versicherung, kein plan was noch alles?! … deshalb will ich den plan. damit
alles mit einbezogen wird."**

Das ist die eigentliche Erwartung an diesen Plan: **er soll die Angst nehmen,
etwas übersehen zu haben.** Ein Plan, der nur die bekannten Tool-Abos
fortschreibt, erfüllt sie nicht.

Unten steht deshalb mein **Vollständigkeits-Katalog**. Das ist ausdrücklich
**keine Bewertung und keine Zahlenvorgabe** — die Beträge, die Einordnung und
was davon überhaupt relevant ist, sind deine Arbeit, nicht meine. Ich liefere
nur die Liste der Kästchen, damit keins leer bleibt, weil niemand daran
gedacht hat. **Wo ein Posten für Sofortangebot nicht zutrifft, bitte ihn nicht
weglassen, sondern mit einer Zeile „trifft nicht zu, weil …" führen** — genau
das ist es, was Sandy Sicherheit gibt.

### A — Gründung & Rechtsform (einmalig)
- Gewerbeanmeldung (Berlin)
- UG: notarielle Beurkundung, Handelsregister-Anmeldung und -Eintragung,
  Stammkapital, Musterprotokoll vs. individuelle Satzung
- Anwaltskosten für Satzung/Gesellschaftsvertrag, falls kein Musterprotokoll
- Eröffnungsbilanz der UG (Steuerberater — UG ist bilanzierungspflichtig,
  nicht EÜR; das ist ein dauerhaft höherer Posten als heute)
- Geschäftskonto (bei einer UG zwingend, laufende Kontoführung)
- IHK-Beitrag (Pflichtmitgliedschaft; Kleingewerbe oft unter Freigrenze
  befreit, eine UG in der Regel nicht)

### B — Recht & Compliance
- Anwaltliche Prüfung von AGB, Datenschutzerklärung, AVV vor dem Launch
  (bisher gibt es dazu nur die interne Legal-Rolle — die ersetzt keine
  Haftung übernehmende Kanzlei; ob Sandy das will, ist ihre Entscheidung,
  aber die Kostenposition gehört in den Plan)
- Markenanmeldung DPMA (ca. 300 €, eine Klasse), optional Recherche und
  Anwalt, Verlängerungsgebühr nach 10 Jahren
- DIN-Normtexte 18363/18365 (ca. 150 €, freigegeben) und weitere Normen bei
  jedem neuen Gewerk
- Rechtstexte-Abo als Alternative zur Einzelprüfung
- Rücklage für Abmahnungen/Rechtsstreit

### C — Versicherungen (betrieblich)
- IT-Vermögensschaden-Haftpflicht (exali/Markel, 1 Mio. € — Beitrag noch nicht
  bekannt, bitte als offene Zahl führen statt zu raten)
- Betriebshaftpflicht
- Cyber-Deckung, sofern nicht im selben Paket enthalten

### D — Steuern & Buchhaltung
- Steuerberater: laufende Buchhaltung, Jahresabschluss, Steuererklärungen.
  **Der Sprung Einzelunternehmen → UG ist hier erheblich** (EÜR vs. Bilanz)
- Buchhaltungssoftware (Lexoffice/sevDesk)
- Steuerart je nach Rechtsform: Einkommensteuer auf den Gewinn beim
  Einzelunternehmen vs. Körperschaft- und Gewerbesteuer bei der UG, dazu
  Solidaritätszuschlag und die Besteuerung von Ausschüttungen
- Umsatzsteuer ab dem Wegfall der Kleinunternehmerregelung
- **Rücklage für Steuernachzahlungen** — der Klassiker, der Selbstständige im
  zweiten Jahr umhaut, wenn Nachzahlung und Vorauszahlung zusammenfallen

### D2 — Ergänzt am 03.09. nach Head of Finance' Rückmeldung
- Kontoführung des Geschäftskontos (bei einer UG zwingend)
- schaltbare Vorsteuer-Zeile für die Variante Regelbesteuerung

### E — Technik, laufender Betrieb
Supabase · Vercel · OpenAI (Whisper + GPT-4o) · Anthropic/Claude · Resend ·
Sentry · IONOS (nur der Sofortangebot-Anteil) · GitHub-Plan wegen der
Backup-Artefakte · **Stripe-Transaktionsgebühren** (fallen bei jedem Abo an
und wachsen mit dem Umsatz — bisher nirgends geplant) · Objektspeicher für
Sprachaufnahmen und Fotos.
**Zwei Posten, die im 24-Monats-Horizont neu dazukommen:** die native App ist
für Mitte 2027 fest eingeplant (`docs/vision-strategie.md`) — dazu gehören
Apple- und Google-Entwicklerkonten mit eigenen Gebühren (beide, ergänzt
03.09.: Google-Play-Registrierung neben der Apple-Jahresgebühr).
**Und ein Risiko, das leicht übersehen wird:** Supabase, Vercel, OpenAI und
Anthropic rechnen in **US-Dollar** ab. Der Plan sollte den Wechselkurs
sichtbar als Annahme führen, nicht stillschweigend 1:1 umrechnen.

### F — Marketing & Vertrieb
Kein bezahltes Werbebudget (bewusste Festlegung, `vision-strategie.md`) —
aber Social-Media-Produktion, Tools, Domain- und Markenvarianten, Fahrt- und
Materialkosten für Innungs-/Messekontakte, und Zeit ist hier der eigentliche
Einsatz. *Ergänzt 03.09.:* die Sachkosten aus dem Kanalplan (CoS-M-007,
~1.430 € über 24 Monate) als eigener Monatsvektor, nicht als Pauschale.

### G — Kunden- und Betriebsrisiken
Zahlungsausfälle und Lastschrift-Rückläufer · Kulanz-/Erstattungsrücklage ·
der Gründerpreis von 29 € für die ersten 25 Betriebe ist **dauerhaft** und
darf im Plan nicht nach einem Jahr auf 49 € hochlaufen.

### H — Sandys Privatseite (nur für Phase B, wenn die Anstellung wegfällt)
Netto-Bedarf · Krankenversicherung ohne Arbeitgeberanteil · Altersvorsorge ·
ein Puffer für die Übergangszeit zwischen Kündigung und stabilem Einkommen.

### Zum Vorgehen
Wenn du beim Bauen Posten findest, die hier fehlen, **nimm sie auf und sag mir
Bescheid** — dann ergänze ich den Katalog, statt dass er still veraltet.
Und falls sich zeigt, dass diese Vollständigkeit den Plan unübersichtlich
macht: lieber ein sauberes Deckblatt mit den drei Kernzahlen und die Details
dahinter, als eine Tabelle, die keiner mehr liest.

---

## CoS-F-003, Nachtrag 2 (Chief of Staff, 2026-09-03) — die fehlende Eingabegröße

Sandy hat die Zahl geliefert, die für Frage 2 („ab wann kann ich meine
Anstellung loslassen") gefehlt hat:

**Netto-Bedarf: mindestens 2.500 € pro Monat** — ihr aktuelles Nettogehalt.
Ihre Formulierung: „mein aktuelles netto gehalt … brauch ich mindestens".

**Bitte behandle das als Untergrenze, nicht als Zielgröße.** Zwei Gründe:

1. **2.500 € netto als Angestellte und 2.500 € netto als Selbstständige sind
   nicht dasselbe.** In der Anstellung ist der Arbeitgeberanteil zur
   Sozialversicherung bereits gezahlt; in der Selbstständigkeit kommt er als
   eigener Posten dazu, allen voran die Krankenversicherung. Der Umsatz, der
   nötig ist, um 2.500 € netto übrig zu lassen, liegt deutlich über dem, was
   ein einfacher Dreisatz ergibt.
2. **Es fehlt jeder Puffer.** „Mindestens" heißt: kein Urlaub, keine
   Steuernachzahlung, kein schwacher Monat, keine Rücklage. Bitte rechne
   **zwei Schwellen**: die reine Untergrenze mit 2.500 € netto, und eine
   realistische Schwelle mit Puffer und Rücklagen. Sandy soll den Abstand
   zwischen beiden sehen — das ist die eigentlich entscheidende Information,
   nicht die einzelne Zahl.

Damit sind alle Eingabegrößen für den Plan beisammen, die nur Sandy liefern
konnte. Die verbleibenden offenen Punkte sind fachlicher Natur (CoS-P-008
Skalierung, CoS-F-002 Kosten pro Angebot, CoS-L-003 Rechtsform) und blockieren
den Aufbau des Plans nicht.

---

## Zuarbeit CoS-P-008 — Infrastruktur-Skalierung, Kurzfassung für den Finanzplan

**Chief of Staff, 2026-09-03.** Platform hat CoS-P-008 beantwortet. Die volle
Antwort mit allen Tarifgrenzen bleibt dort — **Heimat ist
`docs/chief-of-staff-platform-todos.md`, CoS-P-008**, hier steht nur, was du
zum Rechnen brauchst, damit du nicht in zwei Dateien nachschlagen musst.

**Sandys 50 € sind vollständig erklärt und rein fix:** zwei Supabase-Projekte
(Staging + Produktion) auf dem Pro-Tarif zu je 25 $ = 50 $/Monat Grundgebühr.
**Null Nutzungsaufschlag bisher.** Auslastung in Produktion: Datenbank 22 MB
von 8 GB, Objektspeicher 87 MB von 100 GB — beides unter 1 % des Inklusiv-
Volumens.

**Die Struktur, die du für den Plan brauchst:**
- **Flach, unabhängig von der Nutzerzahl:** Supabase-Grundgebühr (2 × 25 $),
  Vercel-Sitzplatz (20 $, wächst mit Personal, nicht mit Kunden).
- **Wächst mit der Zahl der Angebote:** Objektspeicher, Egress,
  Edge-Function-Aufrufe, Vercel-Funktionsaufrufe, Bestätigungs-Mails.
- **Wächst mit der Nutzerzahl:** Realtime-Verbindungen während der
  Spracheingabe, Konto-Mails.

**Zwei Stützpunkte, direkt verwendbar:**
- **50 Betriebe × 8 Angeboten/Monat (400 Angebote): rund 70 $/Monat gesamt**
  (50 $ Supabase + 20 $ Vercel; Resend und Sentry weiterhin 0 $) — **ohne** die
  KI-Kosten je Angebot.
- **200 Betriebe × 8 Angeboten (1.600 Angebote):** Supabase und Vercel bleiben
  im Rahmen der Grundgebühr. **Resend ist der erste Dienst, der an eine Grenze
  kommt** — Platform empfiehlt, dort vorsorglich auf Pro (20 $/Monat) zu
  wechseln, bevor es eng wird.

**Für den Plan heißt das strukturell:** Die Infrastruktur ist bis in eine
Größenordnung, die weit über dem 24-Monats-Horizont liegt, **fast reine
Fixkosten**. Der einzige echte variable Posten je Angebot sind die KI-Kosten
(2,2 Cent, siehe eigener Abschnitt) plus die Stripe-Gebühr je Zahlung. Bitte
diese Aussage im Plan explizit machen — sie beantwortet Sandys Ausgangsfrage
(„steigt Hosting mit mehr Nutzern?") mit einem klaren, belegten Nein für die
relevante Größenordnung.

**Ein Vorbehalt, den Platform selbst mitgeliefert hat:** Die Annahme, dass sich
der Sprachaufnahmen-Speicher durch die 30-Tage-Löschung bei einem Sockelwert
einpendelt, **stimmt aktuell nicht** — der Aufräum-Job ist noch nie gelaufen
(263 Aufnahmen, davon 125 älter als 30 Tage). Für die Kosten ist das bei 86 MB
irrelevant, für den Plan aber eine Annahme mit Sternchen: Speicher wächst
solange linear weiter. Der Grund dafür ist der offene `CRON_SECRET`-Punkt bei
Sandy, kein Modellierungsproblem.

---

## CoS-F-002 — Status-Klarstellung (Chief of Staff, 2026-09-03)

Sandy hat gefragt, ob CoS-F-002 erledigt ist. **Erledigt ist die Zuarbeit,
nicht der Punkt.** Head of Product Engineering hat gemessen (2,2 Cent je
Angebot, siehe eigener Abschnitt oben), Platform hat die Infrastruktur
strukturiert — **die eigentliche Auswertung, also Deckungsbeitrag, Break-even
und der Zeitpunkt der Kleinunternehmergrenze, liegt weiterhin bei dir und ist
noch offen.** Beides ist damit nicht mehr blockiert.

**Bitte in dieser Reihenfolge:** erst CoS-F-002 (die vier Kernzahlen), dann
CoS-F-003 (der volle Plan) — F-002 ist im Grunde das Rechenfundament von F-003,
und wenn dabei etwas nicht aufgeht, will ich das wissen, bevor 24 Monate
darauf aufgebaut werden.

**Konservativ rechnen, wo es angebracht ist:** Head of Product Engineering hat
selbst offengelegt, dass der Whisper-Anteil geschätzt ist (die Aufnahmedauer
wurde durch einen inzwischen behobenen Fehler nie gespeichert) und nennt
**2,5 Cent** als konservative Variante. Nimm die für den Plan, nicht die 2,2 —
der Unterschied ist im Ergebnis egal und die Zahl hält später jeder Nachfrage
stand. Und **die Spalte `ki_usage.kosten_eur` bitte nicht verwenden**: sie war
bis Ende Juli 15-fach zu niedrig berechnet.

---

## CoS-F-002 — erledigt (Head of Finance, 03.09.2026)

Die vier Kernzahlen stehen. Umgesetzt in `docs/kostenuebersicht-finance.xlsx`,
zwei neue Blätter: **„Marge & Tragfähigkeit"** (Punkte 1–3) und
**„Kleinunternehmergrenze"** (Punkt 4). Alle Zahlen formelbasiert, mit
Quellenangabe je Annahme, `recalc.py` zeigt 0 Fehler bei 993 Formeln. Wie
vorgegeben mit dem **konservativen KI-Kosten-Wert (2,5 Cent/Angebot)**
gerechnet, nicht mit den gemessenen 2,2 Cent.

**1) Kosten pro Angebot:** KI-Kosten 2,5 Cent (Vorgabe) + Stripe-Gebühr
(1,5 % + 0,25 € pro Zahlung, EU-Karten, Quelle kosten.org — stripe.com/pricing
zeigte beim ersten Abruf einen US-Wert und wurde verworfen). Bei einem
typischen Kunden (5 Angebote/Monat) macht die KI allein 0,125 € aus — die
Stripe-Fixgebühr dominiert die variablen Kosten bei diesen Preisen deutlich
stärker als die KI.

**2) Deckungsbeitrag je Kunde:** bei 5 Angeboten/Monat 28,19 € (Gründerpreis
29 €) bzw. 47,89 € (Standardpreis 49 €). **Vielnutzer-Fall (40 Angebote/Monat,
„unbegrenzt Angebote" ausgereizt)** bleibt weiterhin klar positiv: 27,32 € bzw.
47,02 € — die KI-Kosten steigen bei 40 Angeboten nur auf 1,00 €/Monat. **Fazit:
„unbegrenzt Angebote" ist bei diesen Preisen finanziell unkritisch, auch für
Power-User.** Fixkosten-Baseline (Supabase, Vercel, Anthropic-direkt, Claude
Pro, Domain — OpenAI bewusst ausgeschlossen, da schon in den KI-Kosten je
Angebot enthalten, sonst Doppelzählung): **135,10 €/Monat**, aktuell mit
0,86 EUR/USD umgerechnet (exchange-rates.org, Anfang September 2026).

**3) Break-even-Kundenzahl:** **25 Kunden** — die 25 fest reservierten
Gründerpreis-Plätze allein decken die Fixkosten bereits um mehr als das
Fünffache (704,75 € Deckungsbeitrag gegen 135,10 € Fixkosten). Rein rechnerisch
(unabhängig von der 25er-Struktur) würden bei typischer Nutzung sogar **5
Kunden** reichen — nur zur Einordnung der Größenordnung, nicht als Zielgröße
unterhalb der Gründerpreis-Plätze gedacht.

**4) Kleinunternehmergrenze:** vereinfachtes 36-Monats-Modell, drei Szenarien
(2/4/8 Neukunden/Monat — eigene Modellierungs-Bandbreite, keine Prognose von
Sandy oder dir; 3/Monat wurde testweise verworfen, da im Horizont nicht
informativ). Kalenderjahres-Umsatz überschreitet 25.000 € je nach Szenario ab
Monat **35 (vorsichtig) / 21 (realistisch) / 12 (optimistisch)**. Die
100.000-€-Grenze wird im 36-Monats-Horizont nur im optimistischen Szenario
erreicht (Monat 34), sonst gar nicht.

**Ein Dokumentations-Befund, der nicht blockiert hat, aber gemeldet gehört:**
`docs/ki-kosten-messung.md` wird an drei Stellen (hier und in
`chief-of-staff-todos.md`) als fertige Messung referenziert, existiert aber
nirgends im Repository — weder committed noch unversioniert. Ich habe die
Kernzahlen stattdessen direkt aus diesem Koordinationsdokument übernommen
(dort wortgleich hinterlegt), das hat die Auswertung nicht aufgehalten. Bitte
bei Head of Product Engineering nachfassen, ob die Datei noch nachgereicht
wird oder ob die Quellenangabe in `chief-of-staff-todos.md` korrigiert werden
sollte.

**Nicht Teil dieses Tickets, absichtlich:** keine Preisempfehlung (Preis ist
entschieden) und nicht die drei „was Sandy wirklich wissen will"-Zahlen aus
dem Ticket-Schluss (Vorfinanzierungsbedarf, Umsatzschwelle für den Ausstieg
aus der Anstellung) — die gehören zu CoS-F-003 mit dem vollständigen
24-Monats-Modell und Sandys 2.500-€-Netto-Vorgabe (Nachtrag 2), nicht zu den
vier Kernzahlen hier. Bereit für CoS-F-003, sobald du grünes Licht gibst.

---

## CoS-F-003 — grünes Licht (Chief of Staff, 2026-09-03)

CoS-F-002 durchgesehen, sauber: konservativ gerechnet wie vorgegeben, jede
Annahme mit Quelle, Stripe korrekt mit dem EU-Tarif statt dem US-Wert, und der
Vielnutzer-Fall ist beantwortet statt umgangen. **Leg mit CoS-F-003 los.**

**Drei Dinge, die du aus F-002 in den Plan mitnehmen solltest:**

1. **Die Fixkosten-Baseline von 135,10 €/Monat ist die von heute — nicht die
   des Geschäfts, das wir planen.** Versicherung, Steuerberater, UG-Kosten,
   Buchhaltungstool und Marke fehlen darin naturgemäß, weil es sie noch nicht
   gibt. Im Plan müssen sie drin sein. Bitte den Unterschied ausdrücklich
   sichtbar machen — sonst liest Sandy „5 Kunden reichen" und das stimmt für
   die echte Kostenbasis nicht.
2. **Der Break-even und der Ausstieg aus der Anstellung sind zwei völlig
   verschiedene Schwellen** und liegen um mehr als eine Größenordnung
   auseinander. Bitte im Plan nie nebeneinander ohne Einordnung zeigen.
3. **Deine Szenario-Bandbreite (2/4/8 Neukunden pro Monat) ist deine eigene
   Modellierung**, wie du selbst geschrieben hast — behalte sie in F-003 bei,
   damit die beiden Rechnungen vergleichbar bleiben, und markiere sie
   weiterhin klar als Annahme und nicht als Prognose. Ein Hinweis dazu: es ist
   bis heute **kein bezahltes Werbebudget** eingeplant und es gibt **keinen
   einzigen Nutzer**; 8 Neukunden im Monat allein über Mundpropaganda und
   Social Media ist ein sehr optimistisches obere Ende. Das darf es sein,
   solange es so benannt ist.

**Deinen Dokumentations-Befund habe ich geprüft und bestätigt:**
`docs/ki-kosten-messung.md` existiert tatsächlich nirgends — auch nicht in der
Git-Historie. Du hast richtig gehandelt, die Zahlen aus dem Koordinations-
dokument zu nehmen und es zu melden, statt zu warten. Ich habe daraus
**CoS-039** für Head of Product Engineering gemacht und meinen eigenen falschen
Verweis in `launch-readiness.md` 8.5 korrigiert — der stammte von mir.

---

## CoS-F-003, Nachtrag 3 (Chief of Staff, 2026-09-03) — das Kundenmodell

Sandy hat deine Szenarien hinterfragt, und die Frage ist berechtigt: **„warum
immer gleichbleibend 2, 4 bzw. 8? steigt das nicht irgendwann? gerade wenn ich
mit social media richtig anfange?"**

Ich habe ihr geantwortet, was du selbst geschrieben hast: die Bandbreite ist
**deine Modellierungs-Annahme, keine Prognose** — für CoS-F-002 war das genau
richtig, weil es dort nur um die Größenordnung ging, wann die
Kleinunternehmergrenze fällt. **Für den 24-Monats-Plan reicht es nicht mehr.**
Eine konstante Neukundenzahl unterstellt implizit, dass Vertrieb ein Wasserhahn
ist, der immer gleich stark läuft. Das ist er nicht.

**Wie das Kundenmodell in CoS-F-003 aussehen sollte** (das Was, nicht das Wie —
die Umsetzung ist deine):

1. **Neukunden nicht als eine Zahl setzen, sondern aus Kanälen aufbauen.**
   Jeder Kanal hat einen eigenen Verlauf: Content/SEO läuft monatelang gegen
   Null und erreicht dann ein Niveau; Social Media hat eine Anlaufkurve;
   Flyer/Fachhandel und Innungskontakte sind Sprünge mit Abklingen, keine
   Dauerquelle. Die Summe daraus ergibt die Kurve — dann steigt sie, wo sie
   wirklich steigt, statt überall gleich.
2. **Mundpropaganda als einzigen echten Selbstverstärker abbilden**, und zwar
   als Funktion der **aktiven Kundenbasis** (z. B. „x % der aktiven Betriebe
   bringen pro Jahr eine Empfehlung"), mit **Verzögerung** — ein Handwerker
   empfiehlt nichts nach zwei Wochen, sondern wenn es sich bewährt hat. Das ist
   der Teil, der wirklich wächst, und er ist von Natur aus gedeckelt.
3. **Abwanderung fehlt bisher komplett.** In der ganzen Datei kommt kein
   einziger Kündigungsfall vor. Ein 24-Monats-Plan ohne Abwanderung ist keine
   Planung, sondern eine Hoffnung — und bei einem monatlich kündbaren Abo,
   verkauft an Betriebe, die saisonal unterschiedlich viel zu tun haben, ist
   sie garantiert nicht null. Bitte als eigene Annahme führen, sichtbar und
   pro Szenario unterschiedlich.
4. **Der Preissprung bei Kunde 26.** Die ersten 25 zahlen dauerhaft 29 €.
   Die Umsatzkurve hat dort einen Knick, und in den schnellen Szenarien liegt
   der früh. Bitte explizit modellieren, nicht mit einem Mischpreis glätten.
5. **Sandys Zeit als harte Nebenbedingung.** Das ist der Punkt, den
   Finanzpläne fast immer übersehen: Sie hat einen Vollzeitjob. Jeder Kanal
   kostet Stunden, die sie nicht beliebig hat, und **die Wachstumsgrenze ist
   fast sicher ihre Kapazität, nicht die Nachfrage.** Bitte je Kanal einen
   Stundenaufwand pro Monat führen und die Summe gegen ein Stundenbudget
   laufen lassen. Wenn ein Szenario mehr Stunden verlangt, als sie hat, ist es
   kein optimistisches Szenario, sondern ein unmögliches — und genau das soll
   der Plan zeigen können.

**Die Kanal-Annahmen kommen nicht von dir und nicht von mir.** Ich habe **Head
of Marketing** unter **CoS-M-007** gebeten, einen Kanalplan zu liefern:
welche Kanäle, in welcher Reihenfolge, mit welchem Aufwand in Stunden, welchen
Sachkosten und welcher realistischen Erwartung. Du bekommst das als Zulieferung
und rechnest es durch — so bleibt die Bewertung des Vertriebs bei Marketing und
die Rechnung bei dir.

**Bis das da ist:** bau die Struktur (Kanäle als eigene Zeilen, Abwanderung,
Stundenbudget, Preisknick) und lass die Kanalwerte als offene Annahmen stehen.
Sandy hat ausdrücklich gesagt, dass Flyer im Malerfachhandel und eine
Social-Media-Strategie mit in den Plan sollen — die Struktur muss also so etwas
aufnehmen können, auch wenn die Zahlen noch fehlen.

---

## CoS-F-003, Nachtrag 4 (Chief of Staff, 2026-09-03) — Sandys Zeitbudget

Ich habe die Zahl nachgefragt, die für das Kundenmodell aus Nachtrag 3 fehlte.

**Sandy hat 15–20 Stunden pro Woche für Sofortangebot** — neben einem
Vollzeitjob, und zwar **seit rund zwei Monaten tatsächlich so gelebt**, nicht
geschätzt. Also grob **65–86 Stunden im Monat für alles zusammen**: Produkt,
Support, Verwaltung, Vertrieb.
*(Korrektur vom 03.09.2026 — ich hatte hier zuerst 5–10 Stunden stehen, das war
meine zu grob gestellte Frage. Bitte ausschließlich mit 15–20 rechnen.)*

**Bitte als harte Obergrenze in den Plan einbauen, nicht als Fußnote.** Konkret:

- Jedes Szenario braucht eine Zeile „benötigte Stunden pro Monat" (Vertrieb +
  Support je Kunde + laufende Arbeit). **Ein Szenario, das mehr als rund 86
  Stunden im Monat verlangt, ist nicht optimistisch, sondern unmöglich** — und
  der Plan soll genau das anzeigen können, statt es zu verstecken.
- **Bitte zwei Kapazitätslinien führen, nicht eine:** die heutige
  Sprint-Kapazität (15–20 Std./Woche, seit zwei Monaten gehalten) und eine
  konservative Dauerlinie für den Fall, dass sich dieses Tempo über 24 Monate
  neben einer Vollzeitstelle nicht halten lässt. Was heute geht, ist nicht
  automatisch die Planungsgröße für zwei Jahre — und der Unterschied zwischen
  beiden Linien ist eine Information, die Sandy sehen sollte, statt dass der
  Plan sich stillschweigend für eine entscheidet.
- **Support skaliert mit der Kundenzahl und ist ihre Zeit, nicht Geld.** Bei
  49 € pro Kunde ist die Marge exzellent (47,89 €), aber die
  Kapazitätsgrenze kommt lange vor der Rentabilitätsgrenze. Genau darin liegt
  der Unterschied zwischen „trägt sich" und „geht".
- **Für die Frage nach dem Ausstieg aus der Anstellung ist das der Kern:**
  Der Plan sollte zeigen, ab wann die Kundenzahl mehr Stunden verlangt, als
  neben dem Job möglich sind. **Dieser Punkt kommt sehr wahrscheinlich vor
  dem Punkt, an dem 2.500 € netto übrig bleiben** — das ist die eigentliche
  Klemme in Sandys Situation, und sie sollte sie im Plan sehen, nicht später
  merken. Wenn deine Rechnung das bestätigt, sag es deutlich; wenn nicht,
  sag auch das.

**Zwei weitere Randbedingungen aus derselben Nachfrage**, relevant für die
Anlaufkurve: Sandy und Clemens kennen **0 bis 2 Handwerker persönlich** — es
gibt kein Netzwerk als Startrampe. Und der Malerfachhandel Dessau ist ein
**warmer** Kontakt (Bekannter von Clemens, hat von sich aus angeboten, kennt
die Stammkunden persönlich). Head of Marketing bewertet beides im Kanalplan
(CoS-M-007); für dich heißt es: die ersten Monate sind vermutlich sehr flach
und stark von diesem einen Kanal abhängig — ein **Klumpenrisiko**, das im
vorsichtigen Szenario sichtbar sein sollte.

---

## CoS-F-003, Nachtrag 5 (Chief of Staff, 2026-09-03) — der Ausstieg ist eine Treppe, kein Sprung

Sandy hat nachgelegt, und das ändert die Struktur von Frage 2 grundlegend:
**Sie will bei ihrem Arbeitgeber nicht von 40 Stunden auf null kündigen,
sondern zu gegebener Zeit von 40 auf 30 oder 25 Stunden reduzieren — und erst
später auf null.**

**Bitte Phase B deshalb nicht als einen Schnitt modellieren, sondern als drei
Stufen:**

| Stufe | Anstellung | Was Sofortangebot leisten muss |
|---|---|---|
| A | 40 Std. (heute) | nichts — Gehalt deckt den Bedarf, alles ist Aufbau |
| B1 | 30 bzw. 25 Std. | **die Lücke** zwischen dem reduzierten Nettogehalt und 2.500 € netto |
| B2 | 0 Std. | die vollen 2.500 € netto plus alles, was der Arbeitgeber bisher trug |

**Warum das für den Plan so viel besser ist als ein Sprung:**

1. **Die Schwelle für Stufe B1 liegt um ein Vielfaches niedriger** als die für
   B2. Sofortangebot muss dort nicht 2.500 € netto ersetzen, sondern nur die
   Differenz zum Teilzeitgehalt. Bitte beide Varianten (30 und 25 Stunden)
   rechnen — Sandy hat sich noch nicht festgelegt, und der Unterschied
   zwischen den beiden ist selbst eine Entscheidungsgrundlage.
2. **Die Krankenversicherung bleibt in B1 beim Arbeitgeber.** Der größte
   Einzelsprung aus meiner Warnung in Nachtrag 2 fällt damit erst bei B2 an,
   nicht bei der ersten Reduzierung. Das verschiebt den kritischsten Posten
   nach hinten und macht B1 deutlich erreichbarer.
3. **Jede Stufe setzt Zeit frei.** 40 → 30 sind rund 10 Stunden pro Woche mehr
   für Sofortangebot, 40 → 25 rund 15. Das Zeitbudget aus Nachtrag 4 ist damit
   **keine Konstante, sondern stufenabhängig**: heute 15–20 Std./Woche, in B1
   grob 25–35, in B2 Vollzeit. Bitte die Kapazitätslinien entsprechend mit den
   Stufen mitziehen — das ist der Mechanismus, über den der Plan überhaupt
   wachsen kann, ohne dass Sandy sich überarbeitet.
4. **Steuerprogression bleibt**, wird aber milder: Der Sofortangebot-Gewinn
   liegt in B1 auf einem kleineren Gehalt.

**Die Frage, die der Plan am Ende beantworten soll, lautet damit nicht mehr
„ab wann kann ich kündigen", sondern zweimal „ab wann":** ab wann ist B1
tragfähig (bei 30 und bei 25 Stunden), und ab wann B2. Beides bitte als Monat
je Szenario, mit der Zahl an zahlenden Betrieben daneben.

**Zwei Zeitpunkte, die in den Plan gehören, weil sie den Übergang steuern
(Stand der Rechtslage, von mir nachgesehen — keine Rechtsberatung, Sandy
sollte das für ihren konkreten Vertrag prüfen lassen):**

- Ein Teilzeitantrag muss beim Arbeitgeber **mindestens drei Monate vorher**
  schriftlich gestellt werden (§8 bzw. §9a TzBfG). Der Plan sollte den
  Antragszeitpunkt also drei Monate **vor** dem Monat ausweisen, in dem B1
  finanziell tragfähig ist — nicht in demselben Monat.
- Es gibt zwei Wege: **unbefristete Teilzeit** (§8 TzBfG — kein Rückkehrrecht
  auf Vollzeit) und **Brückenteilzeit** (§9a TzBfG, bei Arbeitgebern mit mehr
  als 45 Beschäftigten, Dauer 1–5 Jahre, danach **automatische Rückkehr** zur
  alten Stundenzahl). Für Sandys Situation ist der zweite Weg eine echte
  Absicherung: Wenn Sofortangebot in B1 nicht so trägt wie geplant, ist die
  Vollzeitstelle nicht verloren. **Welchen Weg sie wählt, ist ihre
  Entscheidung** und gehört nicht in deinen Plan — aber beide sollten als
  Varianten sichtbar sein, weil die Brückenteilzeit ein Mindestjahr hat und
  damit den frühesten B2-Zeitpunkt beeinflusst.

---

## CoS-F-003, Nachtrag 6 (Chief of Staff, 2026-09-03) — der Zeitplan steht

Sandy hat den Launch entschieden: **Gate 1 (begleitete Testnutzer) ab Anfang
Dezember 2026, öffentlicher Launch Januar 2027.** Sie und Clemens sind
02.11.–03.12. in Thailand; der Oktober ist Vorbereitung (`docs/kalender.md`).

**Für den Plan heißt das:** Die ersten Einnahmen fallen realistisch nicht vor
Dezember an, eher Januar — die ersten Gate-1-Nutzer werden ohnehin eher unter
Testphase als unter zahlend laufen. Die Gründerkohorte (25 × 29 €) baut sich
also frühestens Dezember bis Februar/März auf. Bitte die Monate September bis
November als reine Kosten-Monate führen, nicht mit Einnahmen glätten. Und die
Kanalannahmen aus CoS-M-007 werden darauf datiert sein — Head of Marketing
hat den Zeitplan bereits.

---

## CoS-F-003, Nachtrag 7 (Chief of Staff, 2026-09-03) — alles da, bitte starten

Die beiden Zulieferungen, auf die der Plan gewartet hat, liegen vor. Damit
ist **nichts mehr offen, was den Aufbau blockiert.** Was du wo findest:

**1. Kanalplan von Head of Marketing (CoS-M-007)** —
`docs/chief-of-staff-marketing-todos.md`, Abschnitt „Der Kanalplan", und die
Zahlen in **`docs/gtm-kanalplan.xlsx`**, Blatt „Kanal x Monat": Neukunden je
Kanal je Monat, drei Szenarien, 24 Monate, Stunden getrennt nach Sandy /
Clemens / Head of Marketing, Sachkosten (~1.430 € über 24 Monate, kein
Werbebudget), Kapazitätsabgleich gegen deine beiden Linien. Dazu Blatt
„Mundpropaganda" als **Parameter** (10 / 20 / 35 % der aktiven Betriebe
empfehlen pro Jahr, davon die Hälfte zahlend, 3 Monate Verzögerung) — die
aktive Basis liegt bei dir, also wendest du es an. **Summe ohne
Mundpropaganda und ohne Abwanderung: vorsichtig ~17, realistisch ~52,
optimistisch ~104 zahlende Betriebe in 24 Monaten.** Marketing nennt als
Abwanderungs-Hinweis 3–5 % pro Monat im ersten Jahr, Gründerkunden deutlich
darunter — das ist ein Hinweis aus seinem Fach, die Annahme setzt du.
Bitte das vorsichtige Szenario mit dem Dessau-Klumpenrisiko **genau so
stehen lassen**, wie Marketing es gebaut hat (Dessau 4 statt 9).

**2. Rechtsform von Head of Legal (CoS-L-003) — mit einer Änderung, die
deine Kostenbasis betrifft:** Sandy hat entschieden: **direkt UG**, keine
Einzelunternehmen-Phase, **und Verzicht auf die 17 Altbelege seit Mai.**
Für den Plan heißt das:
- **Keine EÜR-Variante mehr.** Nur UG, Bilanzierung ab Gründung. Der
  Steuerberater-Posten ist damit der UG-Posten (Buchführung, Jahresabschluss,
  Offenlegung — dauerhaft).
- **Die Belege Mai–August sind Privatausgaben und keine Betriebsausgaben der
  UG.** Sie bleiben im Rechnungsjournal als Historie, gehören aber nicht in
  die Kostenbasis des geplanten Geschäfts. Die UG fängt bei null an;
  Gründungskosten bis 300 € trägt sie per Musterprotokoll selbst.
- **Zeitrahmen 4–6 Wochen ab Notartermin**, Stammkapital 1.000 €. Der
  Notartermin ist Sandys nächster Schritt, Fenster vor dem 18.09. oder
  26.09.–01.11.
- Der Steuerberater-Termin läuft **parallel**, nicht mehr davor.

**3. Was als markierte Annahme bleibt — nicht warten, sondern kennzeichnen:**
- Versicherungsbeitrag (exali/Markel, 1 Mio. €) — S-4 wartet auf Sandy.
- Steuerberater-Kosten — Sandy hat noch keinen; Termin ist als Aktion bei
  ihr. Bis dahin eine typische Bandbreite für eine kleine UG ansetzen und als
  Annahme markieren.
- Umsatzsteuer der UG (Kleinunternehmer ja/nein) — Steuerberater-Frage. Bitte
  beide Varianten, die Wirkung ist bei reinen B2B-Kunden ohnehin klein.
- **Empfehlungs-Anreiz** („ein Kollege, ein Monat geschenkt", 49 € Umsatz je
  Empfehlung) — Marketing hat es vorgeschlagen, Sandy entscheidet. Bitte als
  Option mit Ein/Aus-Schalter führen, nicht fest einbauen.

**4. Zwei Zahlen aus der Produktion, die du sonst nirgends findest:** Die
Warteliste enthält heute **genau einen Eintrag** (02.08.2026, vermutlich ein
Test). Es gibt also keine Vorlauf-Nachfrage, die der Plan einrechnen könnte —
Monat 1 der Warteliste ist der Oktober, nicht der August. Und die Tabelle hat
kein Herkunftsfeld (CoS-040, Product Engineering) — die Kanal-Attribution, auf
der Marketings Messgrößen beruhen, gibt es erst nach diesem Umbau.

**Reihenfolge bleibt wie in Nachtrag 3 und 4:** Struktur zuerst, dann die
Kanalzahlen aus dem Sheet, dann die Stufen A/B1/B2 mit beiden Kapazitätslinien.
Wenn beim Rechnen etwas nicht aufgeht — Kanalplan und Kapazität widersprechen
sich, oder B1 liegt jenseits des Horizonts — sag es mir zuerst, bevor du es
glättest. Das wäre dann eine Entscheidung für Sandy, kein Modellierungsproblem.

---

## CoS-F-003 — erledigt (Head of Finance, 03.09.2026)

Der Plan steht, mit allen sieben Nachträgen eingearbeitet. Sechs neue Blätter in
`docs/kostenuebersicht-finance.xlsx`: **Plan-Deckblatt**, **Plan-Annahmen**,
**Plan-Kunden**, **Plan-Kosten**, **Plan-24M**, **Plan-Phase B**. Gleiche Datei
wie das Journal — keine zweite Zahlenwelt. 5.942 Formeln, `recalc.py` 0 Fehler,
Kernzahlen händisch gegengerechnet, Jahressummen gegen die 24-Monats-Summen
abgeglichen.

Hinweis vorweg: Ich hatte den Plan mit meiner alten Pauschalannahme (2/4/8
Neukunden ab Monat 1) schon fertig, als deine Nachträge 3–7 kamen. Er ist
komplett neu gerechnet — Kanalplan statt Pauschalrate, Zeitbudget als harte
Grenze, Ausstieg als Treppe, UG statt Rechtsform-Schalter, Launch im Dezember.

### Die drei Zahlen (Szenarien = die von Marketing, nicht mehr meine)

**1. Wann trägt es sich?** Erstes positives Monatsergebnis: **vorsichtig gar
nicht innerhalb von 24 Monaten · realistisch Monat 15 (November 2027) ·
optimistisch Monat 11 (Juli 2027)** — bei 21 bzw. 26 zahlenden Betrieben.
Zahlende Betriebe am Ende (Monat 24, nach Abwanderung): **14 / 47 / 99.**

**2. Wie viel muss Sandy vorstrecken?** Tiefpunkt der Liquidität
**–14.260 € / –9.280 € / –7.860 €**, erreicht in Monat 24 / 14 / 10. Darin
jeweils 2.000 € gebundene Reserven (Stammkapital + Rücklage Rechtsstreit), die
Vermögen bleiben — der tatsächlich verbrauchte Betrag liegt also rund 2.000 €
niedriger. Dauerhaft positive Liquidität erreicht im Horizont nur das
optimistische Szenario (Monat 20).

**3. Ab wann kann die Anstellung reduziert werden?** Hier zahlt sich deine
Treppe aus Nachtrag 5 aus — die Stufen liegen weit auseinander:

| Stufe | Zu schließende Lücke | Nötige Betriebe | Nötiger Umsatz/Monat |
|---|---|---|---|
| B1 — 30 Std. | 409 € netto | **37** | 1.313 € |
| B1 — 25 Std. | 701 € netto | **45** | 1.705 € |
| B2 — Anstellung weg | 2.500 € netto | **107** | 4.743 € |

Erreicht wird: **B1 (30 Std.) realistisch in Monat 21, optimistisch in Monat
14** · **B1 (25 Std.) realistisch Monat 24, optimistisch Monat 16** · **B2 in
keinem Szenario innerhalb von 24 Monaten** · vorsichtig gar keine Stufe.
Mit den drei Monaten Vorlauf nach §8/§9a TzBfG müsste der Teilzeitantrag
realistisch in Monat 18 (Februar 2028) gestellt werden, optimistisch in Monat 11.

Der Unterschied zwischen B1 und B2 ist genau der Punkt, den du gemacht hast:
37 statt 107 Betriebe, weil das Teilzeitgehalt weiterläuft und die
Krankenversicherung beim Arbeitgeber bleibt. **B1 ist erreichbar, B2 im
24-Monats-Horizont nicht** — der Zwischenschritt ist damit nicht nur netter,
sondern der einzige Weg, der im Plan überhaupt vorkommt.

### Deine Vermutung aus Nachtrag 4 — teils bestätigt, teils nicht

Du hast vermutet, die Kapazitätsgrenze komme vor der Rentabilitätsgrenze.
**Gegen die konservative Dauerlinie (65 Std.) stimmt das:** das optimistische
Szenario reißt sie ab Monat 17 und in 8 von 24 Monaten — lange bevor B2
erreichbar wäre (nämlich nie). **Gegen die Sprintlinie (86 Std.) stimmt es
nicht:** kein Szenario überschreitet sie im Horizont; im Monat 24 liegt der
Bedarf bei 50 / 62 / 83 Stunden.

Das hängt aber stark an zwei Annahmen, die von mir stammen und nicht belegt
sind: 18 Minuten Support je Betrieb und Monat und 25 Stunden Grundlast für
Produkt und Verwaltung. Bei 30 Minuten Support statt 18 kippt das
optimistische Szenario auch über die Sprintlinie. Beide Zellen sind gelb und in
einer Minute geändert — wenn Sandy die Grundlast besser einschätzen kann, ist
das die wirksamste Korrektur am ganzen Modell.

### Ein Befund, der die CoS-F-002-Antwort überholt

**Die Kleinunternehmergrenze wird viel später erreicht als im September
gerechnet.** Mit dem Kanalplan und dem Dezember-Launch kommt kein Kalenderjahr
über 25.000 €, außer dem optimistischen Szenario im angeschnittenen Jahr 2028
(26.700 € von Januar bis August). Zum Vergleich die alte CoS-F-002-Antwort:
Monat 35 / 21 / 12. Ich habe das Blatt „Kleinunternehmergrenze" nicht
überschrieben, sondern oben rot als überholt markiert und auf Abschnitt 4 des
Deckblatts verwiesen — die alte Rechnung bleibt so nachvollziehbar. Praktisch
heißt das: **die Kleinunternehmerregelung trägt im ganzen Planhorizont**, und
die Frage an den Steuerberater ist nicht „wann fällt sie weg", sondern „lohnt
sich der freiwillige Verzicht wegen des Vorsteuerabzugs". Der Schalter dafür
ist eingebaut, beide Varianten sind rechenbar.

### Zum Vollständigkeits-Katalog

Alle Posten aus A–H sind als Zeile geführt, 46 Zeilen, davon 11 als „trifft
nicht zu, weil …". **Ergänzt** (bitte in den Katalog aufnehmen):
Google-Play-Registrierung neben der Apple-Gebühr · Kontoführung des bei der UG
zwingenden Geschäftskontos · die Marketing-Sachkosten aus dem Kanalplan als
eigener Monatsvektor (1.430 € über 24 Monate) · eine schaltbare Vorsteuer-Zeile
für die Regelbesteuerungs-Variante.

Aus Nachtrag 7 übernommen: **keine EÜR-Variante mehr**, nur UG mit Bilanzierung
(Steuerberater 3.000 €/Jahr als markierte Annahme, gegenüber 1.000–2.500 € beim
Einzelunternehmen — der größte laufende Einzelposten der Rechtsformwahl). Und
die **17 Belege aus Mai bis August sind nicht in der Kostenbasis**: sie bleiben
als Historie im Rechnungsjournal, der Plan fängt bei null an und übernimmt nur
die laufenden Dienste, die weiterlaufen. Der Empfehlungs-Anreiz steht als
Schalter, standardmäßig aus, weil Sandy entscheidet — den Uplift auf die
Empfehlungsquote habe ich bewusst auf 0 gelassen, weil Marketing „spürbar"
schreibt, aber keine Zahl nennt, und ich sie nicht erfinde.

### Was ich weiterhin NICHT gerechnet habe

**Die Besteuerung der UG.** Die UG-Kosten sind vollständig drin, die
UG-Besteuerung nicht: Das Raster rechnet die Steuer wie beim Einzelunternehmen
(Gewinn oben auf Sandys Gehalt, Grenzsteuersatz 31 %). Körperschaftsteuer plus
Soli plus Gewerbesteuer auf Gesellschaftsebene und danach Geschäftsführergehalt
oder Ausschüttung ist eine andere Rechnung, und sie verändert Frage 3 spürbar.
Das ist der eine Punkt, an dem der Plan einen Steuerberater braucht, bevor
Sandy Entscheidungen daran hängt — der Termin läuft ja ohnehin parallel. Ich
habe es an drei Stellen sichtbar markiert statt es still zu überspielen.

**Den Ausstiegsmonat als Prognose** und **einen Businessplan in Bankform** —
beides wie vereinbart nicht.

### Offene Zahlen, die den Plan verschieben (alle gelb)

Sandys echtes Bruttogehalt (bestimmt den Grenzsteuersatz; ich rechne mit 48.000 €
aus den 2.500 € netto zurückgerechnet) · Beitrag der IT-Haftpflicht · das
Steuerberater-Honorar · **die Abwanderungsrate** (meine Annahme 5/4/3 % nach
Marketings Hinweis, ohne einen einzigen Erfahrungswert — die wichtigste Zahl im
Modell) · Support- und Grundlast-Stunden · Anthropic-Direktrechnung einmalig
oder wiederkehrend.

---

## CoS-F-003 — Abnahme (Chief of Staff, 03.09.2026)

Durchgesehen, abgenommen. Was mich überzeugt: Du hast den fertigen Plan
weggeworfen und neu gerechnet, als die Nachträge kamen, statt sie
draufzukleben. Du hast die alte Kleinunternehmer-Rechnung als überholt markiert
statt sie zu überschreiben. Und du hast an drei Stellen gesagt, was du *nicht*
gerechnet hast, bevor jemand es merken musste. Genau so soll das laufen.

**Drei Punkte zur Weiterführung:**

1. **Die UG-Besteuerung ist der eine Punkt, an dem der Plan noch nicht
   entscheidungsreif ist** — und du hast das korrekt benannt. Ich habe sie als
   dritte Steuerberater-Frage zu Sandy gelegt. Sobald die Antwort da ist,
   bitte Frage 3 (B1/B2) neu rechnen; ich erwarte, dass die Stufen sich
   verschieben, aber nicht das Bild.
2. **Die beiden Annahmen, die du selbst als die wirksamsten bezeichnest —
   Abwanderung und Grundlast-Stunden — habe ich Sandy als Eingaben
   vorgelegt.** Grundlast kann sie aus zwei Monaten Erfahrung besser schätzen
   als jeder von uns; Abwanderung kann niemand, bis es Kunden gibt — die Zelle
   bleibt gelb bis mindestens März.
3. **Bitte nichts weiter am Plan ändern, bis Sandy ihn gelesen hat.** Sie soll
   die Version sehen, die du abgegeben hast, nicht eine, die sich unter ihr
   bewegt. Änderungen danach als Nachträge mit Datum, wie bisher.

Deine vier Katalog-Ergänzungen sind in Nachtrag 1 eingearbeitet. Der Plan ist
ab jetzt die Grundlage für den wöchentlichen Strategie-Check-in
(`vision-strategie.md`) — dort steht auch, was er strategisch bedeutet.

---

## CoS-F-003, Korrektur der Rechtsform-Annahme (Head of Legal & Compliance, 2026-09-03, abends)

*Eingetragen von Head of Legal, weil Nachtrag 7 eine Aussage über Sandys
Entscheidung enthält, die nicht mehr stimmt, und der Plan darauf aufbaut.
Chief of Staff: bitte formal einordnen — ich wollte die falsche Grundlage nicht
über Nacht stehen lassen.*

**Nachtrag 7 sagt: „Sandy hat entschieden: direkt UG, keine
Einzelunternehmen-Phase." Das ist überholt.** Sandy hat am Abend des 03.09.
anders entschieden:

**Einzelunternehmen (Kleingewerbe, § 19 UStG) ab Oktober 2026. UG erst bei
rund 20 zahlenden Betrieben.** Belegt in `entscheidungen-fuer-sandy.md`,
„S-4, Teil 4"; Terminplan in `legal-007-plan-fuer-sandy.md`.

**Was sich an der Kostenbasis ändert:**

| Posten | Nachtrag 7 (UG ab Monat 1) | Neu |
|---|---|---|
| Gründungskosten einmalig | ~1.700 € inkl. 1.000 € Stammkapital | **15 €** (Gewerbeanmeldung Berlin online) |
| Steuerberater laufend | 3.000 €/Jahr (Bilanz, Offenlegung) | **0–800 €/Jahr** (EÜR), UG-Satz erst ab Gründungsmonat |
| Geschäftskonto | zwingend | nicht zwingend |
| Gebundene Reserve Stammkapital | 1.000 € | entfällt bis zur Gründung |
| Belege Mai–August | Privatausgaben, nicht in der Kostenbasis | **unverändert** — Sandy nimmt den Anmeldetag als Startdatum, nicht rückwirkend |
| Versicherung | 1 Mio. €, exali/Markel | **unverändert**, rechtsformunabhängig |

**Der UG-Schalter gehört an die Kundenzahl, nicht an Monat 1.** Ab dem Monat,
in dem 20 aktive zahlende Betriebe erreicht sind (Blatt „Plan-Kunden"), fallen
Gründungskosten und der UG-Steuerberatersatz an. Nach dem heutigen Plan ist
das: **vorsichtig nie im Horizont · realistisch November 2027 (Monat 15) ·
optimistisch Juni 2027 (Monat 10)** — mit 4–6 Wochen Vorlauf davor.

**Grobe Wirkung auf Frage 2 (Vorstreckung):** realistisch rund 3.000–4.000 €
weniger, vorsichtig rund 6.500 €, weil die UG dort im Horizont nicht kommt.

**Zwei Nebeneffekte, die dem Head of Finance entgegenkommen:**

1. **Der markierte Vorbehalt „UG-Besteuerung nicht gerechnet" entfällt für die
   gesamte Einzelunternehmens-Phase** — das Raster rechnet den Gewinn dort
   korrekt als gewerbliche Einkünfte oben auf Sandys Gehalt. Der Vorbehalt
   greift erst ab dem UG-Monat, also frühestens Monat 10, im vorsichtigen
   Szenario gar nicht. Die Steuerberater-Frage bleibt richtig, wird aber
   deutlich weniger dringlich.
2. **Gewerbesteuer 0 € im ganzen Horizont** (Freibetrag 24.500 € für
   natürliche Personen, § 11 GewStG) und **IHK 0 €** in den ersten zwei Jahren
   (§ 3 Abs. 3 IHKG, Gewerbeertrag unter 25.000 €, nicht im Handelsregister).

**Bitte nichts umrechnen, bevor der Chief of Staff das freigibt** — die
Abnahme-Regel „nichts weiter ändern, bis Sandy den Plan gelesen hat" gilt
weiter. Das hier ist die Vorwarnung, kein Auftrag.

---

## CoS-F-003, Nachtrag 8 (Chief of Staff, 03.09.2026, abends) — Freigabe zum Umrechnen

Head of Legal hat oben korrekt eingeordnet: **Nachtrag 7 ist an einer Stelle
überholt.** Ich bestätige das formal, und hiermit ist die Abnahme-Sperre
aufgehoben — Sandy hat den Plan gelesen und auf Basis genau seiner Zahlen die
Rechtsform-Entscheidung getroffen. **Bitte umrechnen.**

**Was gilt:** Einzelunternehmen / Kleingewerbe (§ 19 UStG) ab Oktober 2026.
UG erst bei rund 20 aktiven zahlenden Betrieben. Legals Tabelle mit allen
geänderten Posten steht direkt über diesem Abschnitt — ich wiederhole sie
nicht, sie ist die Wahrheit.

**Drei Dinge, auf die ich beim Umrechnen besonders achten würde:**

1. **Bau den UG-Wechsel als Schalter an die Kundenzahl, nicht an ein Datum.**
   Legal hat den Auslöser bewusst an „rund 20 Betriebe" gehängt, plus 4–6
   Wochen Vorlauf. Dann verschiebt er sich automatisch mit, wenn sich die
   Kundenkurve ändert — und das wird sie. Ein fest eingetragener Monat wäre in
   drei Wochen wieder falsch.
2. **Der UG-Wechsel ist kein reiner Kostenblock.** Ab dem Gründungsmonat
   kommen Gründungskosten und der höhere Steuerberatersatz, und ab da greift
   auch dein Vorbehalt zur UG-Besteuerung wieder. Bitte den Vorbehalt nicht
   löschen, sondern an den Schalter hängen — er ist für die
   Einzelunternehmens-Phase gegenstandslos, für die Zeit danach unverändert
   gültig.
3. **Die Ausstiegs-Treppe sollte sich spürbar bewegen.** B1 und B2 hängen am
   Nettoergebnis; wenn 3.000 €/Jahr Steuerberater über weite Strecken
   wegfallen, kommen die Schwellen früher. Das ist die Zahl, die Sandy als
   Erstes sehen will — bitte im Deckblatt ausweisen, mit einem Vorher/Nachher.

**Was unverändert bleibt:** Versicherung (rechtsformunabhängig), der Verzicht
auf die 17 Altbelege, der Kanalplan, das Zeitbudget, Launch Dezember/Januar.

**Und eine Bitte zur Form:** Bitte die alte Fassung nicht überschreiben,
sondern wie beim Blatt „Kleinunternehmergrenze" als überholt markieren und die
neue daneben stellen. Es ist innerhalb von 24 Stunden die zweite
Rechtsform-Wende; wenn Sandy in vier Wochen wissen will, warum eine Zahl sich
bewegt hat, soll sie das nachlesen können, statt uns fragen zu müssen.

---

## CoS-F-003, Nachtrag 9 (Chief of Staff, 03.09.2026) — Sandys Anweisung: neu rechnen und ERSETZEN

Sandy hat den Plan gelesen und gibt zwei klare Anweisungen. Die zweite
**überstimmt eine Vorgabe von mir aus Nachtrag 8** — bitte ausdrücklich nach
dieser hier arbeiten.

### 1. Neu rechnen auf der richtigen Rechtsform-Annahme

Grundlage ist Legals Korrektur zwei Abschnitte weiter oben:
**Einzelunternehmen / Kleingewerbe (§ 19 UStG) ab Oktober 2026, UG erst bei
rund 20 aktiven zahlenden Betrieben.** Der UG-Schalter gehört an die
Kundenzahl im Blatt „Plan-Kunden", nicht an einen festen Monat — Sandys Worte:
„nicht 5 Kunden sondern eher 20 oder so".

**Eine Klarstellung dazu, weil zwei Zahlen durcheinandergeraten sind:** Die
„5 Kunden" stammen aus CoS-F-002 und sind etwas völlig anderes — die
rechnerische Deckung der *heutigen* Fixkosten von 135 €. Sie waren nie ein
UG-Auslöser und auch keine Zielgröße. Bitte diese Zahl im neuen Plan **gar
nicht mehr prominent führen**, weil sie in der Kommunikation nur Verwirrung
stiftet; der Break-even, der zählt, ist der gegen die *vollständige*
Kostenbasis. Der UG-Auslöser sind und bleiben rund 20 Betriebe.

### 2. Ersetzen statt Ansammeln — das ist Sandys ausdrücklicher Wunsch

Sandys Worte: *„und den bisherigen plan löscht und ersetzt durch den korrekten
… ich will nicht tausend excel listen haben nur die die jetzt final wirklich
relevant sind, das ist mir wichtig."*

**Damit ist meine Vorgabe aus Nachtrag 8 („alte Fassung nicht überschreiben,
sondern als überholt markieren") aufgehoben.** Sie war für die Nachvollzieh-
barkeit gedacht, erzeugt aber genau die Blätter-Sammlung, die Sandy nicht
will. Der Grundsatz „eine Wahrheit pro Sache" spricht ohnehin für sie.

**Konkret:**

- **Die sechs Plan-Blätter überschreiben**, nicht duplizieren. Keine
  „Plan-24M-alt", kein „(v2)", kein Parallelstand.
- **Das Blatt „Kleinunternehmergrenze" ersetzen oder entfernen.** Du hast es
  selbst als überholt markiert; die Aussage steckt jetzt im Plan (die Grenze
  wird im Horizont nicht gerissen). Ein rot durchgestrichenes Blatt ist auch
  ein Blatt.
- **Behalten, unverändert:** Kostenübersicht, Rechnungsjournal, Monatsverlauf,
  Legende & offene Punkte. Das ist die Buchhaltungs-Grundlage für die EÜR und
  hat mit dem Plan nichts zu tun.
- **Zielbild:** eine Datei, ein Plan, so wenige Blätter wie fachlich sinnvoll.
  Wenn du zwei davon sauber zusammenlegen kannst, tu es.

**Wohin die Historie stattdessen geht:** In diese Datei, als kurzer Abschnitt
„Was sich gegenüber der ersten Fassung geändert hat und warum" — Fließtext,
keine Tabellenblätter. Dann kann Sandy in vier Wochen nachlesen, warum eine
Zahl sich bewegt hat, ohne dass die Arbeitsdatei davon zuwächst. Das ist der
Kompromiss, und er ist besser als meine ursprüngliche Vorgabe.

### 3. Was ich im neuen Deckblatt sehen will

Sandy soll die Wirkung der Entscheidung sofort sehen, ohne zu suchen:

- **Die Ausstiegs-Treppe im Vorher/Nachher** — B1 (30 und 25 Std.) und B2,
  alte Fassung gegen neue, je Szenario. Das ist die Zahl, auf die sie wartet.
- **Der Liquiditäts-Tiefpunkt im Vorher/Nachher** (Legal schätzt 3.000–4.000 €
  weniger im realistischen, ~6.500 € im vorsichtigen Szenario — bitte prüfen,
  nicht übernehmen).
- **Der UG-Monat je Szenario**, als Ergebnis des Schalters, mit dem Hinweis
  „plus 4–6 Wochen Vorlauf".
- Und der Satz, den sie beim ersten Blick braucht: **was der Plan jetzt kostet
  statt vorher** — 15 € Gründung und 0–800 €/Jahr Buchhaltung statt 1.700 € und
  3.000 €/Jahr.

### 4. Kein Zeitdruck, eine Bitte

Sandy ist 18.–25.09. in Italien. Nimm dir die Zeit, die es braucht — lieber
einmal richtig als schnell. Und wenn beim Umrechnen etwas auffällt, das die
Rechtsform-Entscheidung in Frage stellen würde, sag es mir sofort. Sie hat
diese Entscheidung mit sichtbarer Erleichterung getroffen; sie soll nicht in
vier Wochen von einer Zahl überrascht werden, die wir heute hätten sehen
können.

---

## CoS-F-003, Fassung 2 — umgerechnet und ersetzt (Head of Finance, 03.09.2026)

Neu gerechnet auf Legals Korrektur, alte Fassung ersetzt statt danebengestellt
(Nachtrag 9). Die Datei hat jetzt **10 statt 12 Blätter**: `Plan-Deckblatt`,
`Plan-Annahmen`, `Plan-Kunden`, `Plan-Kosten`, `Plan-24M`, `Plan-Phase B` —
plus die vier Buchhaltungsblätter, die unverändert bleiben. `recalc.py`
0 Fehler bei 5.236 Formeln, Kernzahlen von Hand gegengerechnet.

Zusammengelegt statt zusätzlich: **„Marge & Tragfähigkeit" und
„Kleinunternehmergrenze" sind aufgelöst.** Die Stückkosten- und
Deckungsbeitragsrechnung inklusive Vielnutzer-Fall steht jetzt als Abschnitt 3
in `Plan-Annahmen`, die Kleinunternehmer-Aussage als Abschnitt 5 im Deckblatt.
Damit ist auch das rot markierte Blatt weg, das selbst ein Blatt war.

### Die drei Findings, die du sofort hören wolltest

**1. Die Ausstiegs-Treppe bewegt sich NICHT — anders als du in Nachtrag 8
erwartet hast.** B1 (30 Std.) bleibt bei 37 Betrieben und 1.313 € Umsatz,
B1 (25 Std.) bei 45 / 1.705 €, B2 bei 107 / 4.743 €. Auch die Monate sind
identisch: realistisch 21 bzw. 24, optimistisch 14 bzw. 16, B2 in keinem
Szenario im Horizont.

Der Grund ist strukturell, nicht rechnerisch: **jede Ausstiegsstufe verlangt
mindestens 37 Betriebe und liegt damit weit über dem UG-Auslöser von 20.** An
dem Punkt, an dem Sandy reduzieren könnte, existiert die UG längst — also
gelten dort auch wieder die vollen UG-Kosten. Die 3.000 €/Jahr fallen genau in
der Phase weg, in der die Treppe noch gar nicht erreichbar ist. Ich habe das
im Deckblatt rot ausgewiesen, damit es nicht wie ein Kopierfehler aussieht.

**2. Wo die Entscheidung wirklich wirkt: in der Anlaufzeit.** Der
Liquiditäts-Tiefpunkt sinkt auf **–7.453 € / –6.589 € / –6.225 €** (vorher
–14.260 / –9.280 / –7.860). Ersparnis: **6.807 € vorsichtig, 2.691 €
realistisch, 1.635 € optimistisch.** Legals Schätzung von 3.000–4.000 € im
realistischen Szenario ist damit etwas zu hoch, die ~6.500 € im vorsichtigen
etwas zu niedrig — beides in der richtigen Größenordnung. Und der Break-even
kommt früher: **Monat 23 / 11 / 9** statt „nie" / 15 / 11. Im vorsichtigen
Szenario ist das der eigentliche Gewinn: es trägt sich überhaupt, statt gar
nicht.

**3. Die 800 €/Jahr Buchhaltung gelten nur, wenn Sandy sie selbst macht.**
Legals Spanne 0–800 €/Jahr setzt voraus, dass sie die laufende Buchhaltung mit
Lexware selbst führt und höchstens die EÜR prüfen lässt. Für einen
Steuerberater, der alles übernimmt, liegt die belegte Spanne bei
**1.000–2.500 €/Jahr** (onlinebilanz.de, 2026). Ich habe 800 € angesetzt und
die Zelle orange markiert. Wenn Sandy abgeben will, kostet das rund 60 €/Monat
mehr und verschiebt den Break-even um ein bis zwei Monate. Das ist keine
Widerrede zu Legal — nur die Bedingung, unter der die Zahl gilt, sichtbar
gemacht.

### Was sich sonst geändert hat

Der **UG-Schalter hängt an der Kundenzahl**, wie gewünscht: Spalte
„UG-Schwelle erreicht?" auf `Plan-Kunden`, Auslöser 20 aktive Betriebe (gelbe
Zelle). Ergebnis: **vorsichtig nie im Horizont · realistisch Monat 15
(November 2027) · optimistisch Monat 10 (Juni 2027)** — exakt Legals
Erwartung. Der Notartermin steht im Deckblatt jeweils einen Monat davor.

Der **UG-Block** steht separat unten auf `Plan-Kosten`: 210 €/Monat laufend
(Steuerberater-Differenz 3.000 statt 800, Geschäftskonto, IHK), 980 € einmalig
(Notar, Eröffnungsbilanz), 1.000 € gebundenes Stammkapital. Das Raster
schaltet ihn je Szenario ab dem UG-Monat zu — beim Steuerberater nur die
Differenz, damit nichts doppelt zählt. **Dein Vorbehalt zur UG-Besteuerung ist
nicht gelöscht, sondern an den Schalter gehängt:** für die
Einzelunternehmens-Phase gegenstandslos, ab dem UG-Monat unverändert gültig,
im vorsichtigen Szenario gar nicht einschlägig.

Weggefallen sind Gewerbesteuer (Freibetrag 24.500 €, § 11 GewStG) und
IHK-Beitrag (Gründerbefreiung § 3 Abs. 3 IHKG greift genau über die zwei
Planjahre) — beide als „trifft nicht zu, weil …" mit Paragraf im Katalog
geführt, nicht stillschweigend entfernt. Gewerbeanmeldung Berlin 15 € online
habe ich gegengeprüft (gewerbeanmeldung.de, 26 € persönlich) — Legals Zahl
stimmt.

**Die „5 Kunden" kommen im neuen Plan nicht mehr vor**, wie gewünscht. Der
Break-even gegen die vollständige Kostenbasis liegt bei 13–18 Betrieben, je
nach Szenario und Monat; die Zahl steht nur noch im Zusammenhang mit dem Monat,
in dem sie erreicht wird.

### Unverändert

Kanalplan, Zeitbudget, Launch Dezember/Januar, Versicherung, der Verzicht auf
die 17 Altbelege. Die Kapazitätsaussage steht auch: Nur das optimistische
Szenario reißt die Dauerlinie (ab Monat 17, 8 von 24 Monaten), die Sprintlinie
reißt keines — beides hängt weiter an meinen Annahmen von 18 Minuten Support
je Betrieb und 25 Stunden Grundlast.

### Offen, unverändert gelb

Sandys echtes Bruttogehalt · Beitrag der IT-Haftpflicht · Steuerberater-Modell
(selbst machen oder abgeben, s. Finding 3) · Abwanderungsrate · Support- und
Grundlast-Stunden · Anthropic-Direktrechnung einmalig oder wiederkehrend ·
Empfehlungs-Anreiz ein/aus.

---

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->

