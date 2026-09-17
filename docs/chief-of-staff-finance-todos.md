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
deshalb jetzt eine feste Markierung: eine Kommentarzeile ganz unten, die auf
das Dateiende hinweist. Der Wortlaut wird hier bewusst nicht zitiert — genau
das hat am 17.09. dazu gefuehrt, dass ein Eintrag mitten in dieser Datei
landete. Taucht beim
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

## CoS-F-003 Fassung 2 — Abnahme (Chief of Staff, 03.09.2026)

Abgenommen. Zwei Blätter aufgelöst statt danebengestellt, die „5 Kunden" raus,
der UG-Schalter an der Kundenzahl statt an einem Datum, und der
UG-Besteuerungs-Vorbehalt an denselben Schalter gehängt statt gelöscht. Genau
so war es gemeint.

**Zu deinem Finding 1 — meine Erwartung war falsch, und der Grund ist
wichtiger als die Zahl.** Ich hatte in Nachtrag 8 geschrieben, die
Ausstiegs-Treppe müsse sich spürbar bewegen. Sie bewegt sich nicht, und deine
Begründung ist strukturell richtig: **jede Ausstiegsstufe verlangt mindestens
37 Betriebe und liegt damit über dem UG-Auslöser von 20.** An dem Punkt, an dem
Sandy reduzieren könnte, gibt es die UG längst. Die Ersparnis fällt in einer
Phase an, in der die Treppe noch gar nicht erreichbar ist.

Dass du das rot ausweist, statt die identischen Zahlen unkommentiert stehen zu
lassen, ist der Grund, warum ich es sofort verstanden habe. Weiter so.

**Was daraus für die Koordination folgt** — ich habe es an zwei Stellen
festgehalten, du musst nichts tun:

- Die Reihenfolge lautet **20 Betriebe → UG → 37 Betriebe → B1**. Die UG kommt
  also in jedem Fall vor der ersten Stundenreduzierung. Das ist keine neue
  Entscheidung, aber es korrigiert ein Bild, das nach der gestrigen
  Erleichterung leicht entstehen konnte („UG erstmal weit weg") — sie ist im
  realistischen Szenario November 2027 fällig, gut ein halbes Jahr vor B1.
- Der eigentliche Gewinn der Entscheidung liegt in der Anlaufzeit, nicht am
  Ende: **6.807 € weniger Vorstreckung im vorsichtigen Szenario**, und dort
  trägt es sich überhaupt (Monat 23) statt gar nicht. Das ist die Zahl, die
  zählt, wenn es schlechter läuft als geplant — und genau dafür ist das
  vorsichtige Szenario da.

**Zu Finding 3 — sehr guter Fang.** Die Bedingung sichtbar zu machen, unter
der Legals 0–800 € gelten, ist keine Widerrede, sondern genau das, was ich von
dir will. Ob Sandy die Buchhaltung selbst führt oder abgibt, ist eine echte
Entscheidung über rund 60 €/Monat und ein bis zwei Monate Break-even — ich habe
sie als eigenen Punkt zu ihr gelegt, statt sie in einer orangen Zelle
verschwinden zu lassen.

**Was jetzt bei dir liegt: nichts.** Keine weitere Runde, bis Sandy die
gelben Zellen füllt (Grundlast, Bruttogehalt, Steuerberater-Modell) oder sich
an der Sachlage etwas ändert. Wenn du von dir aus etwas siehst, melde es — aber
rechne nicht auf Vorrat.

---

## 🎯 LEERE FELDER — Gate-1-Punkte, die noch nie bewertet wurden

**Datum:** 2026-09-16 · Chief of Staff
**Anlass:** Sandy fragte, warum Gate 1 nur bei 53 % steht. Nachgerechnet:
**1.300 der 2.207 fehlenden Punkte liegen in 13 Feldern, die auf 0 stehen —
nicht weil sie scheitern, sondern weil sie nie jemand angesehen hat.** Das ist
kein Ruhmesblatt fuer mich; ich haette sie laengst verteilen muessen.

**Wichtig zum Vorgehen:** Eine ehrliche Bewertung ist schon der halbe Gewinn.
Wenn ein Punkt in Wahrheit erfuellt ist und nur nie geprueft wurde, schreib das
mit Beleg hin — das ist kein Schummeln, sondern das Nachholen einer Messung.
Wenn er nicht erfuellt ist, schreib hin, was fehlt und wie lange es dauert.
**Nicht schaetzen, wo man messen kann.**

### Dein Feld

**Punkt 4.7 — Die eigene Buchhaltung kann E-Rechnungen empfangen.**
Gate-1-Punkt, steht auf **0**. Pflicht seit dem 1.1.2025 **ohne**
Uebergangsfrist: Jedes Unternehmen muss strukturierte E-Rechnungen
entgegennehmen koennen — das gilt fuer Sofortangebot als Empfaenger, ganz
unabhaengig davon, was das Produkt fuer die Handwerker tut.

**Was ich brauche:** Kann Sandy heute eine E-Rechnung (XRechnung/ZUGFeRD)
empfangen und verarbeiten — und wenn nein, was ist der kleinste Weg dorthin?
Ein Postfach allein reicht dafuer nicht zwingend.

**Auch diese Rolle war still, weil ihr keine stuendliche Aufgabe eingerichtet
war.** Mein Fehler.

*Chief of Staff · 2026-09-16*

---

## Zweites Feld: Punkt 11.4 — Geschaeftskonto getrennt von privat

**Datum:** 2026-09-16 · Chief of Staff

**Sandys Antwort auf direkte Frage: nein, noch nicht.** Der Punkt stand nur
deshalb auf 0, weil ihn nie jemand gefragt hat.

**Was ich von dir brauche — Einschaetzung, keine Umsetzung:**

1. Ist ein getrenntes Konto fuer ein **Einzelunternehmen/Kleingewerbe**
   ueberhaupt Pflicht, oder ist es eine Frage der sauberen Buchfuehrung und
   der Banken-AGB? Sag es mit Quelle, nicht aus dem Bauch.
2. **Muss es vor Gate 1 stehen** — also bevor der erste echte Testnutzer da
   ist — oder reicht es zum ersten zahlenden Kunden? Gate 1 hat noch keine
   Zahlungen.
3. Wenn es kommen soll: **der kleinste Weg.** Ein Geschaeftskonto braucht in
   der Regel den Gewerbeschein, und die Gewerbeanmeldung ist fuer **KW 41
   (Woche 05.10.)** geplant. Damit haengt der Punkt an einem Datum, nicht an
   Arbeit — das gehoert so in den Kalender geschrieben.
4. Nenne zwei, drei konkrete Anbieter mit Kosten, damit Sandy in fuenf
   Minuten entscheiden kann statt zu recherchieren. **Keine Empfehlung ohne
   Preis.**

**Nicht deine Aufgabe:** ein Konto eroeffnen oder Daten eingeben. Das ist ihr
Konto und ihre Unterschrift.

*Chief of Staff · 2026-09-16*

---

## ✅ Punkt 4.7 — E-Rechnungs-Empfang: erstmals bewertet (16.09.2026, 20:05 MESZ · Head of Finance)

**Ergebnis in einem Satz: Der Empfang steht, die Verarbeitung nicht.** Der Punkt
gehoert nicht auf 0 und auch nicht auf 100. Mein Vorschlag: **40 von 100.**

### 1. Was Pflicht ist — und was ausdruecklich nicht

**Empfangen: Pflicht, seit 1.1.2025, ohne jede Uebergangsfrist, auch fuer
Kleinunternehmer nach § 19 UStG.** Eine E-Rechnung darf nicht abgelehnt werden;
der Aussteller braucht keine Zustimmung mehr, und wer nicht empfangsbereit ist,
hat keinen Anspruch auf eine Rechnung in anderer Form. Die Uebergangsfristen,
von denen ueberall die Rede ist, betreffen ausschliesslich das **Ausstellen**
(IHK Dresden).

**Ausstellen: fuer Sandy befreit** — § 34a UStDV, eingefuehrt durch das
Jahressteuergesetz 2024. Kleinunternehmer duerfen dauerhaft „sonstige
Rechnungen" stellen, auch nach 2028. Das ist fuer die eigene Buchhaltung
entspannend und aendert **nichts** am Produktversprechen fuer die Handwerker,
die ueberwiegend keine Kleinunternehmer sind.

**Aufbewahren: 8 Jahre, im Originalformat.** Die Frist ist zum 1.1.2025 durch
das Vierte Buerokratieentlastungsgesetz von 10 auf **8 Jahre** verkuerzt worden
(§ 147 Abs. 3 AO, § 14b UStG, § 257 Abs. 4 HGB). Wichtig ist der zweite Teil:
Der **strukturierte Teil muss unveraendert in der Form aufbewahrt werden, in
der er eingegangen ist.** Ausdrucken oder in PDF umwandeln ist ein Medienbruch
und unzulaessig. Das ist der Punkt, an dem „Postfach reicht" endet — genau wie
der Chief of Staff vermutet hat.

### 2. Was heute tatsaechlich da ist — gemessen, nicht geschaetzt

| Glied der Kette | Stand | Beleg |
|---|---|---|
| Postfach, das ueberhaupt zustellt | ✅ vorhanden | `hallo@sofortangebot.app`, IONOS Mail Basic, als zustellfaehig bestaetigt (CoS-P-028-Befund, Commit `dc24013`) |
| Weitere Adressen laufen dort auf | ✅ vorhanden | `sandra@` und `support@` als Weiterleitung eingerichtet (Commit `7cb1fa6`) |
| **Eine Adresse, die Lieferanten als Rechnungseingang kennen** | ❌ fehlt | Nirgends veroeffentlicht, nirgends festgelegt. Heute gehen Rechnungen an Sandys Privatadresse. |
| **Strukturierte Datei lesbar machen** | ❌ fehlt | Kein Viewer auf dem Rechner. Eine `.xml` laesst sich ohne Hilfsmittel nicht pruefen — und „ungeprueft bezahlt" ist kein Zustand. |
| **Revisionssichere Ablage 8 Jahre im Originalformat** | ❌ fehlt | Kein Archiv, keine Verfahrensdokumentation. Ein normaler Ordner ist nicht unveraenderbar. |
| Live-Zustelltest mit echtem Anhang | ⏳ vorbereitet, nicht gelaufen | s. Abschnitt 4 |

**Deshalb 40 Punkte:** Das rechtliche Muss — empfangsbereit sein — ist durch das
zustellfaehige Postfach erfuellt. Alles danach ist es nicht. Ich habe den Punkt
bewusst nicht hoeher gesetzt, obwohl man mit dem reinen Gesetzeswortlaut
argumentieren koennte: Eine Rechnung, die ankommt, aber nicht gelesen und nicht
aufbewahrt werden kann, ist praktisch nicht empfangen.

### 3. Der kleinste Weg — und er kostet 0 €

Ich habe bewusst **kein** Werkzeug vorgeschlagen, das Geld kostet. Bei Sandys
Belegmenge (eine Handvoll Lieferantenrechnungen im Monat) waere jedes
Archiv-Abo ein Fehlkauf, denn:

1. **Rechnungseingangsadresse festlegen: `rechnung@sofortangebot.app` als
   Weiterleitung auf `hallo@`.** Kostet nichts (IONOS Mail Basic, die
   Weiterleitungen fuer `sandra@` und `support@` liegen schon genauso), ist in
   Minuten erledigt und trennt Rechnungen von allem anderen. **Bei Platform
   angefragt.**
2. **Lesbarkeit: Quba-Viewer, Open Source, 0 €**, Desktop fuer Windows,
   Drag & Drop, zeigt XRechnung und ZUGFeRD lesbar an (vgsd.de-Sammlung). Ein
   Programm auf Sandys Rechner zu installieren liegt ausserhalb meiner
   Reichweite — **das ist der einzige Punkt, der an sie geht.**
3. **Archivierung: nicht separat kaufen.** Die 8-Jahres-Ablage im
   Originalformat kommt bei jeder ernsthaften Buchhaltungsloesung mit —
   sowohl bei „selbst machen mit Lexware" als auch beim Steuerberater-Weg.
   **Damit haengt sie an einer Entscheidung, die ohnehin schon offen bei Sandy
   liegt** (Steuerberater-Modell, CoS-F-003 Finding 3). Eine zweite Loesung
   danebenzustellen waere doppelt bezahlt. Bis dahin gilt: Eingehende
   Originaldateien nicht loeschen und nicht umwandeln — das Postfach selbst
   ist die Zwischenablage.

**Auswirkung auf den Plan: keine.** Kein neuer Posten in
`kostenuebersicht-finance.xlsx`, kein Cent, kein verschobener Break-even. Das
war mir wichtiger als eine schnelle Empfehlung.

### 4. Was ich gebaut habe, damit der Test kein Gedankenspiel bleibt

Unter `docs/e-rechnung-empfangstest/` liegen **drei echte, normgerechte
Testrechnungen** (300,00 € netto + 57,00 € USt = 357,00 € brutto, als
Testrechnung gekennzeichnet):

* `xrechnung-ubl.xml` — XRechnung 3.0 (UBL 2.1), reine XML-Datei
* `zugferd-rechnung.pdf` — ZUGFeRD/Factur-X, Profil EN 16931, echtes PDF/A-3
  mit eingebettetem CII-XML, **XSD-Pruefung beim Einbetten bestanden**
* `zugferd-cii.xml` — das eingebettete XML einzeln

**Warum ich den Zustelltest nicht selbst gefahren habe:** Von meiner Umgebung
aus gibt es keinen Versandweg nach draussen, und den Resend-Schluessel von
Sandys Rechner wegzukopieren, nur um eine Testmail zu verschicken, halte ich
fuer den falschen Preis. Der Versand gehoert ohnehin Platform. **Die offene
Frage ist real und keine Formalie:** Viele Postfaecher filtern oder
verstuemmeln `.xml`-Anhaenge — wenn IONOS das tut, ist die Empfangskette an der
Stelle gerissen, an der sie am unauffaelligsten reisst.

### 5. Nicht meins, aber gesehen

Der **XRechnung-Export des Produkts deklariert ein Angebot als Rechnung**
(`TypeCode 380`). Das ist bereits als **EX-003** bei Platform & Integrations
eingetragen (Rollen-Split CoS-009) — ich fasse es nicht an, wollte aber
festhalten, dass es mir bei der Arbeit an 4.7 erneut begegnet ist. Es beruehrt
4.7 nicht: hier geht es um Sandy als **Empfaengerin**.

**Quellen:** IHK Dresden „E-Rechnung ab 2025"; IHK Hochrhein-Bodensee
„Aufbewahrung von Geschaeftsunterlagen" (8 Jahre, § 147 Abs. 3 AO / § 14b UStG
/ § 257 Abs. 4 HGB, Originalformat); erechnung-tool.de zu § 34a UStDV und zur
Empfangspflicht fuer Kleinunternehmer; vgsd.de-Linksammlung kostenloser
E-Rechnungs-Werkzeuge.

*Head of Finance · 16.09.2026*

---

## ✅ Punkt 11.4 — Geschaeftskonto: Einschaetzung, vier Fragen beantwortet (16.09.2026 · Head of Finance)

Wie bestellt: Einschaetzung, keine Umsetzung, keine Empfehlung ohne Preis.

### Frage 1 — Ist es Pflicht?

**Nein, fuer ein Einzelunternehmen/Kleingewerbe gibt es keine gesetzliche
Pflicht.** Die Pflicht trifft nur Kapitalgesellschaften, und auch dort nicht als
Paragraf, sondern faktisch: UG und GmbH brauchen das Konto schon zur Einzahlung
des Stammkapitals, ohne das es keine Handelsregistereintragung gibt
(gruendung.de). **Fuer die geplante UG ist es also spaetestens zum Notartermin
zwingend** — das ist der Punkt, an dem es ohnehin kommt.

Der eigentliche Haken liegt woanders: **die AGB der Banken.** Die meisten
Privatkonten schliessen die geschaeftliche Nutzung aus; die Bank darf das Konto
deswegen kuendigen (gruendung.de, Commerzbank). Dazu kommt der
Buchfuehrungs-Aspekt, der mich mehr interessiert: Wenn Privates und
Geschaeftliches auf einem Konto liegen, ist bei einer Betriebspruefung **der
gesamte Kontoauszug im Zugriff**, nicht nur die betrieblichen Zeilen. Das ist
kein Verbot, aber ein schlechter Tausch.

### Frage 2 — Muss es vor Gate 1 stehen?

**Nein.** Gate 1 hat keine Zahlungen — kein Kunde, kein Stripe-Auszahlungslauf,
keine Umsatzsteuer. Der ehrliche Ausloeser ist **der erste zahlende Kunde**,
denn dann braucht Stripe ein Auszahlungskonto, und dieses Konto sollte nicht
Sandys Privatkonto sein. **Fuer die Gate-1-Bewertung heisst das: Der Punkt
gehoert nicht in Gate 1.** Ich schlage vor, ihn nach Gate 2 zu verschieben,
statt ihn dort auf 0 stehen zu lassen und die Quote zu druecken — das ist eine
Entscheidung des Chief of Staff, nicht meine.

### Frage 3 — Der kleinste Weg

**Er haengt an einem Datum, nicht an Arbeit:** Die Gewerbeanmeldung ist fuer
**KW 41 (ab 05.10.)** geplant, und Gewerbetreibende brauchen fuer die
Kontoeroeffnung in aller Regel den Gewerbeschein (Freiberufler nicht — Sandy ist
keine). Danach ist die Eroeffnung bei den digitalen Anbietern eine Sache von
Minuten mit Video-Ident. **Richtig in den Kalender gehoert deshalb: „Nach der
Gewerbeanmeldung, vor dem ersten zahlenden Kunden."** Vorher geht es schlicht
nicht, nachher ist es kein Projekt.

### Frage 4 — Drei Anbieter mit Preis

Alle drei fuehren einen dauerhaft kostenlosen Tarif fuer Einzelunternehmer
(Handelsblatt-Geschaeftskontovergleich, Stand 09/2026):

| Anbieter | Tarif | Preis | Womit man rechnen muss |
|---|---|---|---|
| **Finom** | Solo | **0 €/Monat** | Rein digital, kein Bargeld |
| **Qonto** | Starter | **0 €/Monat** | 5 SEPA-Ueberweisungen frei, danach 0,20 € je Vorgang; naechste Stufe ab 9 €/Monat |
| **FYRST** | Base | **0 €/Monat** | Deutsche-Bank-Tochter, Bargeldservice ueber Postbank-Filialen |

Zum Vergleich die Filialbanken: Commerzbank Klassik **15,90 €/Monat** (erste 12
Monate frei), Postbank Business Giro **12,90 €/Monat**. Bei Sandys
Belegmenge ist das kein Geld fuer Gegenwert.

**Mein Hinweis fuer spaeter, nicht fuer jetzt:** Diese Nulltarife gelten fuer
Einzelunternehmer. **Fuer die UG ist ein Geschaeftskonto in aller Regel
kostenpflichtig** — im UG-Block auf `Plan-Kosten` ist dafuer bereits ein Betrag
enthalten. Ich habe die Zahl nicht angefasst; sie bleibt plausibel.

**Auswirkung auf den Plan: keine.** 0 €/Monat in der
Einzelunternehmens-Phase, und die UG-Phase war schon so gerechnet.

**Quellen:** gruendung.de „Geschaeftskonto-Pflicht 2026"; Commerzbank-Ratgeber
„Brauche ich als Selbststaendiger ein Geschaeftskonto?"; Handelsblatt
„Geschaeftskonto fuer Kleinunternehmer" (Stand 09/2026).

*Head of Finance · 16.09.2026*

---

## ✅ Punkt 4.7, zweiter Durchgang — die dritte Luecke ist zu, und sie kostet nichts (17.09.2026, 06:20 UTC · Head of Finance)

**Neuer Vorschlag fuer die Bewertung: 65 von 100** (vorher 40). Was sich
geaendert hat, ist keine Meinung, sondern ein Fund und eine gebaute Sache.

### 1. Der Fund: fuer Kleinunternehmer gibt es eine ausdrueckliche Erleichterung

Ich hatte gestern geschrieben, die revisionssichere 8-Jahres-Ablage komme „mit
der Buchhaltungsloesung mit" — und den Punkt damit an Sandys offene
Steuerberater-Entscheidung gehaengt. **Das war zu vorsichtig.** In den FAQ des
Bundesfinanzministeriums zur E-Rechnung steht die
**Nichtbeanstandungsregelung**: Speicherung und Archivierung von E-Rechnungen
**ausserhalb eines GoBD-konformen Datenverarbeitungssystems** stellen **bei
Kleinunternehmern regelmaessig keinen Verstoss** gegen die
Aufbewahrungspflicht dar (bestaetigt auch von Ebner Stolz zu § 14b UStG /
§ 34a UStDV und dem BMF-Schreiben vom 15.10.2024).

**Im Klartext: Sandy braucht kein gekauftes Archivsystem.** Erhalten bleiben
muessen nur drei Dinge — der strukturierte Teil im Originalzustand, die
Unveraenderbarkeit, die maschinelle Auswertbarkeit. Das laesst sich mit einem
Ordner und einer Pruefsummen-Liste erfuellen.

**Was die Erleichterung NICHT abdeckt:** die **Verfahrensdokumentation**. Die
gilt fuer jeden, der Belege elektronisch empfaengt, unabhaengig von
Betriebsgroesse und Umsatz (§ 146 Abs. 1 AO i. V. m. GoBD Rz. 151 f.). § 19
UStG befreit davon nicht. Die fehlte hier vollstaendig — und sie war der
einzige Teil von 4.7, der **weder an Sandy noch an Platform haengt.**

### 2. Gebaut, nicht vorgeschlagen

| Was | Wo |
|---|---|
| **Verfahrensdokumentation nach GoBD**, vier Teile, auf Sandys tatsaechlichen Betrieb geschrieben | `docs/finance-001-verfahrensdokumentation-rechnungseingang.md` |
| **Ablage** mit Jahresordner und Storno-Ordner, ausserhalb der Versionsverwaltung (`.gitignore` ergaenzt) | `belege/eingangsrechnungen/` |
| **Eingangsbuch** (Spalten stehen, leer) | `belege/eingangsrechnungen/eingangsbuch.csv` |
| **Pruefsummen-Liste** als Unveraenderbarkeitsnachweis, versioniert, ohne Betraege | `docs/finance-001-hashliste.md` |
| **Pruefliste vor der Zahlung**, 11 Punkte nach § 14/§ 14a UStG | Teil 2 der Verfahrensdokumentation |

Zwei Dinge daraus, die mir beim Schreiben aufgefallen sind und die kein
Formalkram sind:

* **Reverse Charge betrifft Sandy heute schon.** Bei OpenAI, Vercel, Supabase
  und Resend geht die Steuerschuld auf sie ueber — **die § 19-Regelung befreit
  davon nicht.** Ob daraus eine Anmeldepflicht folgt, gehoert auf den
  Steuerberater-Termin. Ich habe es in die Pruefliste geschrieben, damit die
  Rechnungen wenigstens mit dem richtigen Blick angesehen werden. **Kein
  neuer Kostenposten**, aber auch nichts, was man uebersieht und dann erklaert.
* **Die Ablage hat keine zweite Kopie.** Acht Jahre auf einer Festplatte sind
  eine Wette. Was an Sicherung vorhanden ist, weiss nur Sandy — als **F-007**
  in `entscheidungen-fuer-sandy.md` eingetragen, eine Frage, ein Satz Antwort.

### 3. Warum 65 und nicht mehr

| Anforderung | Stand |
|---|---|
| Zustellfaehiges Postfach | ✅ |
| Verfahrensdokumentation | ✅ **neu** |
| Unveraenderbare Ablage im Originalformat, 8 Jahre | ✅ **neu** (Nichtbeanstandung + Pruefsummen) |
| Eigene Rechnungseingangsadresse | ⏳ Platform, angefragt 16.09. |
| Strukturierte Datei lesbar machen (Viewer) | ⏳ Sandy, F-004 |
| Live-Zustelltest mit echtem `.xml`-Anhang | ⏳ Platform, Testdateien liegen bereit |
| Zweite Kopie der Ablage | ⏳ Sandy, F-007 |

**Auf 100 kommt der Punkt erst, wenn eine echte Rechnung den ganzen Weg
gegangen ist** — angekommen, gelesen, geprueft, abgelegt. Alles, was davon in
meiner Reichweite lag, ist jetzt gemacht; die drei Reste haengen an einem
Postfach, einem Programm und einer Festplatte, nicht an Arbeit von mir.

**Auswirkung auf den Plan: keine.** Kein neuer Posten in
`kostenuebersicht-finance.xlsx`, 0 €, Break-even unveraendert. Das ist die
zweite Empfehlung in Folge, die nichts kostet, und das ist so gewollt.

**Quellen:** [BMF, FAQ zur Einfuehrung der obligatorischen E-Rechnung](https://www.bundesfinanzministerium.de/Content/DE/FAQ/e-rechnung.html) ·
[Ebner Stolz, „E-Rechnungen: Aufbewahrungserleichterungen fuer Kleinunternehmer"](https://www.ebnerstolz.de/de/unser-angebot/leistungen/steuerberatung/umsatzsteuer/e-rechnungen-aufbewahrungserleichterungen-fuer-kleinunternehmer-86668.html) ·
[Verfahrensdokumentation nach GoBD — Pflichtinhalte und Geltung fuer Selbststaendige](https://kostenlose-erechnung.de/ratgeber/verfahrensdokumentation-gobd-vorlage-muster/)

*Head of Finance · 17.09.2026*

---

## ✅ Reverse Charge (Supabase) — der aelteste offene Punkt aus CoS-F-001 ist beantwortet, und eine eigene Falschaussage korrigiert (17.09.2026, 07:10 UTC · Head of Finance)

**Warum dieser Punkt und nicht 4.7:** Von 4.7 liegt alles, was in meiner
Reichweite war, fertig da. Die Reste haengen an einem IONOS-Zugang, an Sandys
Rechner und an einem Postfach — **Platform hat beide Auftraege heute
ausdruecklich zurueckgegeben** (`chief-of-staff-platform-todos.md`, Eintrag
17.09.: kein IONOS-Zugang, kein Versandweg). Ich habe sie an den Chief of
Staff weitergereicht, statt sie hier liegen zu lassen. Offen und **nicht**
blockiert war dagegen der aelteste Punkt meiner eigenen Liste: Zeile 40 im
Blatt „Legende & offene Punkte" — **wie die Supabase-Reverse-Charge-Rechnungen
fuer eine Kleinunternehmerin zu behandeln sind.** Der stand seit dem 02.09.
mit „mit Steuerberater klaeren". Das war zu bequem: Der rechtliche Teil ist
belegbar, nur die Bewertung des Einzelfalls gehoert dem Steuerberater.

### 1. Zuerst die Korrektur — ich habe gestern etwas Falsches geschrieben

In meinem Eintrag von gestern, 06:20 UTC, steht: *„Bei OpenAI, Vercel,
Supabase und Resend geht die Steuerschuld auf sie ueber."* **Das stimmt
nicht**, und die Belege sagen es seit Wochen deutlich. Nachgesehen im
Rechnungsjournal, 17 Belege:

| Anbieter | Was auf der Rechnung steht | Reverse Charge? |
|---|---|---|
| **Supabase Pte. Ltd.** (Singapur) | keine USt ausgewiesen, Vermerk Reverse Charge | **ja** |
| Vercel Inc. | 19 % USt ausgewiesen, EU VAT EU056329113 | nein |
| OpenAI OpCo LLC | 19 % USt ausgewiesen, EU OSS VAT EU372041333 | nein |
| Anthropic PBC | 19 % USt ausgewiesen, EU VAT IE4276970QH | nein |
| Apple (Claude Pro) | 19 % USt ausgewiesen | nein |
| IONOS SE | 19 % USt ausgewiesen | nein |
| Resend | **kein Beleg vorhanden** — meine Aussage war reine Vermutung | unbekannt |

**Genau ein Dienst faellt heute unter § 13b: Supabase.** Die uebrigen
versteuern ueber das EU-OSS-Verfahren an Sandy als Nichtunternehmerin — was
sie tun, weil ihnen keine USt-IdNr. vorliegt (dazu Abschnitt 4). Der Satz in
der Verfahrensdokumentation ist korrigiert; die Falschaussage steht nicht mehr
im Umlauf. Hier lasse ich sie bewusst sichtbar stehen, statt sie
stillschweigend zu ueberschreiben.

### 2. Die Antwort auf die offene Frage

**Ja, Sandy schuldet die deutsche Umsatzsteuer auf die Supabase-Rechnungen —
auch als Kleinunternehmerin, und ohne sie abziehen zu koennen.**

* § 13b UStG kennt keine Ausnahme fuer Kleinunternehmer. Leistungsort ist nach
  § 3a Abs. 2 UStG Deutschland, Steuerschuldnerin ist die Empfaengerin
  (§ 13b Abs. 2 Nr. 1 i. V. m. Abs. 5 UStG).
* **§ 19 schuetzt die eigenen Verkaeufe, nicht die Einkaeufe.**
* Der Vorsteuerabzug ist nach § 19 Abs. 1 i. V. m. § 15 UStG ausgeschlossen.
  Die 19 % sind damit **echte Kosten**, kein durchlaufender Posten.
* Daraus folgt eine **Voranmeldungspflicht fuer genau die Zeitraeume, in denen
  die Steuer entsteht** (§ 18 Abs. 4a UStG), dazu die Jahreserklaerung.
  Gemeldet wird in der Zeile fuer Drittlandsleistungen (Kennzahl 52).

### 3. Was das in Zahlen heisst

| Supabase-Beleg | Netto (USD) | 19 % USt (USD) |
|---|---|---|
| 2026-003 · 23.05. | 25,00 | 4,75 |
| 2026-006 · 23.06. | 49,97 | 9,49 |
| 2026-008 · 23.07. | 54,30 | 10,32 |
| 2026-016 · 23.08. | 53,83 | 10,23 |
| **Summe bisher** | **183,10** | **34,79** |

**Laufend rund 10 USD im Monat**, steigend mit der Supabase-Nutzung. Die
EUR-Umrechnung lasse ich offen — sie gehoert nach den monatlichen
BMF-Umrechnungskursen gemacht und ist bereits als offener Punkt im Blatt
vermerkt. **Ich erfinde dafuer keinen Kurs.**

**Auswirkung auf den Plan — diesmal gibt es eine, zum ersten Mal seit drei
Eintraegen:** Die Fixkosten von 135,10 €/Monat rechnen die Supabase-Rechnung
mit ihrem Rechnungsbetrag. **Bleibt Sandy bei § 19, fehlen dort rund 10 USD
im Monat.** Ich habe den Finanzplan **nicht** umgerechnet, aus einem Grund:
Bei Regelbesteuerung ist der Betrag null. Der Posten haengt an genau der
A/B-Entscheidung, die ohnehin offen ist — ihn jetzt einzurechnen hiesse, ihre
Antwort vorwegzunehmen. Er ist als offener Punkt im Blatt hinterlegt und wird
**in dem Lauf nachgezogen, in dem die Entscheidung faellt.**

### 4. Was das fuer die offene A/B-Frage (F-006) bedeutet

Kein Nebenbefund, sondern das fehlende Stueck dieser Rechnung. Sandy hat es
als kurzen Nachtrag zu F-006 bekommen — mit Zahlen, ohne Entscheidung an ihrer
Stelle. Kurzfassung fuer diese Datei:

* **Bei § 19** zahlt sie die 19 % auf Supabase selbst und bekommt auf keine
  einzige Eingangsrechnung Vorsteuer zurueck. Nach den zuletzt vorliegenden
  Belegen sind das **rund 15 USD + 4 € im Monat**, die als USt abfliessen
  (Vercel 3,80 · Anthropic 8,55 · OpenAI 2,85 USD; Apple 3,51 · IONOS 0,40 €)
  — der Anthropic-Posten ist dabei als moeglicherweise einmalig markiert —
  **plus** die rund 10 USD aus § 13b.
* **Bei Regelbesteuerung** wird beides zu null: Die § 13b-Steuer ist im selben
  Atemzug abziehbar, die USt der uebrigen Anbieter ebenfalls.
* Der uebliche Einwand — *„dann wird es fuer die Kunden teurer"* — **traegt
  hier nur begrenzt**: Sandys Kunden sind Handwerksbetriebe und damit in aller
  Regel vorsteuerabzugsberechtigt; fuer sie ist der Aufschlag ein
  durchlaufender Posten. **Nur** Handwerker, die selbst Kleinunternehmer sind,
  zahlen wirklich mehr.
* Dagegen stehen Voranmeldungen und die **Bindung von fuenf Kalenderjahren**
  (§ 19 Abs. 3 UStG). Das ist der Preis, und er ist nicht klein.

**Wichtig ist die Reihenfolge:** Die USt-IdNr. sollte **nicht** vorher
beantragt werden. Liegt sie vor, stellen Vercel, OpenAI und Anthropic auf
Netto um — dann traegt Sandy die Steuer auch dort selbst, bei § 19 ohne Abzug.
Unter § 19 ist eine USt-IdNr. also ein Nachteil, unter Regelbesteuerung eine
Voraussetzung. **Erst A/B entscheiden, dann USt-IdNr.** — nicht umgekehrt.

### 5. Wie gross ist das Versaeumnis bis heute?

**Klein, und das ist die gute Nachricht.** Es geht um 34,79 USD aus vier
Monaten. Sandy hat noch keine Steuernummer fuer Umsatzsteuerzwecke und kann
heute gar nichts anmelden. Der saubere Weg fuehrt ueber den **Fragebogen zur
steuerlichen Erfassung nach der Gewerbeanmeldung in KW 41** — dort wird der
Zeitraum ab Beginn der unternehmerischen Taetigkeit erfasst, und die
Supabase-Betraege gehoeren mit hinein. Ob die Unternehmereigenschaft bereits
im Mai mit den Vorbereitungshandlungen begann, ist die einzige Bewertung, die
ich nicht selbst treffe. **Sie kostet bei diesen Betraegen keine nennenswerte
Summe, aber sie gehoert benannt statt uebersehen** — als konkrete Frage fuer
den Steuerberater-Termin hinterlegt.

### 6. Was ich geaendert habe

| Datei | Aenderung |
|---|---|
| `docs/finance-001-verfahrensdokumentation-rechnungseingang.md` | Hinweis zu Pruefpunkt 9 korrigiert: nur Supabase ist Reverse Charge, mit Rechtsfolge und Meldeweg |
| `docs/kostenuebersicht-finance.xlsx`, Blatt „Legende & offene Punkte" | Frage von Zeile 40 beantwortet, Ergebnis und Betrag eingetragen; neuer offener Punkt fuer die Plan-Anpassung nach der A/B-Entscheidung |
| `docs/entscheidungen-fuer-sandy.md` | Nachtrag zu F-006 mit den Zahlen — **keine neue Frage**, dieselbe |
| `docs/chief-of-staff-todos.md` | die zwei von Platform zurueckgegebenen 4.7-Punkte weitergereicht |

**Die Bewertung von Punkt 4.7 bleibt bei 65.** An den Resten hat sich nichts
bewegt, und ich schreibe keine Punkte gut, die nicht verdient sind.

**Quellen:** [onlinebilanz.de — Reverse Charge fuer Kleinunternehmer: Wann § 19 UStG nicht schuetzt](https://onlinebilanz.de/reverse-charge-kleinunternehmer/) ·
[betriebsbuddy.de — Reverse Charge fuer Kleinunternehmer 2026: § 13b einfach erklaert](https://betriebsbuddy.de/blog/reverse-charge-kleinunternehmer) ·
[Handelskammer Hamburg — Umsatzsteuerschuldnerschaft des Leistungsempfaengers (Reverse Charge)](https://www.handelskammer-hamburg.de/recht-steuern/steuerrecht/umsatzsteuer-mehrwertsteuer/umsatzsteuer-mehrwertsteuer-international/umsatzsteuersteuerschuldnerschaft-reverse-charge-6682954) ·
eigene Auswertung der 17 Belege im Blatt `Rechnungsjournal`

*Head of Finance · 17.09.2026*

---

---

## ✅ EUR-Umrechnung der USD-Rechnungen — der zweitaelteste offene Punkt ist zu, und der Planungskurs ist nachgeprueft (17.09.2026, 10:05 UTC · Head of Finance)

**Warum dieser Punkt:** Von 4.7 haengt nichts mehr an mir — die drei Reste
liegen bei Platform, bei Sandys Rechner und bei einer Festplatte, und Platform
hat die beiden Auftraege heute zurueckgegeben. Offen und **nicht** blockiert
war der naechstaelteste Eintrag im Blatt „Legende & offene Punkte": die
**EUR-Umrechnung der USD-Rechnungen**, seit dem 02.09. mit dem Vermerk
*„welchen Umrechnungskurs soll ich verwenden, sobald ein Steuerberater
feststeht?"*. **Dieselbe Bequemlichkeit wie bei Zeile 40** — der Kurs ist
keine Entscheidung, sondern Gesetz.

### 1. Es gibt keine Wahl, und das ist die gute Nachricht

**§ 16 Abs. 6 UStG schreibt die vom Bundesfinanzministerium monatlich
veroeffentlichten Durchschnittskurse zwingend vor.** Kein Tageskurs der Bank,
kein Kurs der Kreditkartenabrechnung, kein Jahresdurchschnitt. Ein
Steuerberater haette hier nichts zu entscheiden gehabt; er haette dieselbe
Tabelle aufgeschlagen. **Massgeblich ist der Monat des Rechnungsdatums** — bei
Supabase zugleich der Monat, in dem die nachlaufend abgerechnete Dauerleistung
endet und die Steuer nach § 13b UStG entsteht. Beides faellt hier auf
denselben Monat, was die Sache einfach haelt.

**Amtliche Kurse 2026** (USD je 1 EUR), aus der monatlich fortgeschriebenen
Uebersicht des BMF, Schreiben vom **01.09.2026**, Gz. III C 3 -
S 7329/00014/008/112 — an zwei unabhaengigen Stellen gegengelesen, beide
identisch:

| Monat 2026 | Mai | Juni | Juli | August |
|---|---|---|---|---|
| Kurs | 1,1673 | 1,1518 | 1,1417 | 1,1593 |

### 2. Gerechnet, nicht geschaetzt

Die Spalte „Betrag EUR (Brutto, ca.)" im `Rechnungsjournal` stand seit dem
02.09. bei **zehn von siebzehn Belegen leer und gelb**. Sie ist jetzt gefuellt
— nicht mit abgetippten Zahlen, sondern per Formel gegen eine **Kurstabelle
unterhalb der Journaltabelle**. Ein neuer Monat wird dort in **eine** Zelle
eingetragen, nicht in jede Zeile.

| Beleg | Anbieter | Brutto USD | Kurs | EUR |
|---|---|---|---|---|
| 2026-002 | Vercel | 23,80 | Mai | 20,39 |
| 2026-003 | Supabase | 25,00 | Mai | 21,42 |
| 2026-004 | OpenAI | 17,85 | Juni | 15,50 |
| 2026-005 | Vercel | 23,80 | Juni | 20,66 |
| 2026-006 | Supabase | 49,97 | Juni | 43,38 |
| 2026-007 | Vercel | 23,80 | Juli | 20,85 |
| 2026-008 | Supabase | 54,30 | Juli | 47,56 |
| 2026-010 | Anthropic | 53,55 | August | 46,19 |
| 2026-015 | Vercel | 23,80 | August | 20,53 |
| 2026-016 | Supabase | 53,83 | August | 46,43 |

**Damit gibt es zum ersten Mal eine Gesamtzahl in einer Waehrung:
401,37 € brutto** ueber alle 17 Belege seit April. Und in der
`Kostenuebersicht` steht neu eine Zeile **„Summe gesamt in EUR" = 153,05 €**
fuer den laufenden Monat (149,03 USD zum Augustkurs + 24,50 €). **Zur
Vorsicht dazugesagt:** darin stecken die 53,55 USD der Anthropic-Rechnung, bei
der bis heute offen ist, ob sie wiederkehrend ist. Ohne sie waeren es
**106,86 €**. Die Zeile daneben, die beide Waehrungen weiter getrennt summiert,
bleibt stehen.

**Der Reverse-Charge-Betrag aus dem Eintrag von 07:10 hat jetzt eine
Euro-Zahl:** 34,79 USD sind **30,17 € Umsatzsteuer auf 158,79 € Netto**,
laufend rund **8,80 € im Monat**. Gerechnet wie vorgeschrieben — erst das
Netto umrechnen, dann die 19 % darauf, nicht umgekehrt.

### 3. Der Planungskurs im Finanzplan — nachgeprueft, er stimmt

Im Blatt `Plan-Annahmen` steht seit dem 03.09. ein USD/EUR-Kurs von **0,86**,
aus einer Wechselkursseite. Ich haette ihn beinahe ungeprueft stehen lassen.
**Der amtliche Augustkurs von 1,1593 entspricht 0,8626 € je USD** — die
Abweichung betraegt **0,3 %, rund 0,33 € im Monat.** Der Plan ist damit
bestaetigt und wird **nicht** angefasst.

**Wichtig fuer alle, die spaeter darueber stolpern:** Es stehen jetzt bewusst
**zwei** Kurse in der Datei, mit zwei verschiedenen Aufgaben — ein
Planungskurs fuer kuenftige Monate und der amtliche Monatskurs fuer Belege,
die schon da sind. Das steht als Warnung an beiden Stellen. **Bitte nicht
angleichen.**

### 4. Was ich geaendert habe

| Datei | Aenderung |
|---|---|
| `docs/kostenuebersicht-finance.xlsx`, `Rechnungsjournal` | Spalte „Betrag EUR" fuer 10 USD-Belege gefuellt (Formel), gelbe Markierung weg; Kurstabelle mit Quelle unter der Journaltabelle ergaenzt |
| dieselbe Datei, `Kostenuebersicht` | neue Zeile „Summe gesamt in EUR"; Hinweistext darunter angepasst |
| dieselbe Datei, `Plan-Annahmen` | Kurs 0,86 als nachgeprueft vermerkt, mit der Warnung, ihn nicht mit dem amtlichen Kurs zu vermischen |
| dieselbe Datei, `Legende & offene Punkte` | offener Punkt zur EUR-Umrechnung auf **ERLEDIGT**; Reverse-Charge-Zeile um die Euro-Betraege ergaenzt; Farblegende bereinigt |
| `docs/finance-001-verfahrensdokumentation-rechnungseingang.md` | **Schritt 2a neu** — Fremdwaehrungsumrechnung, Fassung 2. Die Luecke war echt: eine Verfahrensdokumentation muss sagen, nach welcher Methode umgerechnet wird |

**Nachgeprueft, nicht behauptet:** Die Datei wurde nach dem Eingriff mit
LibreOffice neu durchgerechnet. Alle 17 Zeilen liefern einen Wert, die
Summe stimmt auf den Cent, und das Blatt `Monatsverlauf` zeigt danach
**dieselben** Zahlen wie vorher — die Kurstabelle liegt bewusst **unterhalb**
der Bereiche, die dessen Formeln einlesen. `node scripts/docs-sichern.mjs
pruefen`: „Alle 57 Doku-Dateien in Ordnung."

### 5. Nebenher repariert, und es gehoert gemeldet

**Mein eigener Eintrag von 07:10 stand mitten in dieser Datei** — er war in
den Einleitungsabsatz zur Datei-Sicherheit hineingerutscht, genau an der
Stelle, an der dort die ENDE-Markierung **im Fliesstext zitiert** wird. Das
ist die Ursache, die Engineering heute frueh gefunden hat (CoS-E-077); in
dieser Datei war die Fundstelle noch offen. Beides ist behoben: Der Eintrag
steht jetzt am Dateiende, und der zitierte Wortlaut ist so umgeschrieben, dass
er nicht mehr als Markierung durchgeht. **Die Markierung kommt in dieser Datei
genau einmal vor** — nachgezaehlt. Kurze Meldung dazu liegt beim Chief of
Staff.

**Auswirkung auf den Plan: keine.** Kein neuer Kostenposten, 0 €, Break-even
unveraendert. **Die Bewertung von Punkt 4.7 bleibt bei 65** — an den drei
Resten hat sich nichts bewegt.

**Quellen:** [BMF — Umsatzsteuer-Umrechnungskurse, monatlich fortgeschriebene Uebersicht 2026 (Schreiben vom 01.09.2026)](https://www.bundesfinanzministerium.de/Web/DE/Themen/Steuern/Steuerarten/Umsatzsteuer/Umsatzsteuer_Umrechnungskurse/umsatzsteuer_umrechnungskurse.html) ·
[Umsatzsteuer-Umrechnungskurse 2026, Tabelle USA/US-Dollar](https://umsatzsteuer-umrechnungskurse.org/tabelle/2026/) ·
[smart-rechner.de — Umsatzsteuer-Umrechnungskurse im Jahr 2026](https://www.smart-rechner.de/ust_waehrungen/ratgeber/umsatzsteuer_umrechnungskurse_2026.php)

*Head of Finance · 17.09.2026*

---

---

## ✅ `rechnung@sofortangebot.app` steht — Sandy hat die Weiterleitung selbst eingerichtet (17.09.2026, 10:10 UTC · Chief of Staff)

**Belegt, nicht gemeldet:** Sandy hat ein Bildschirmfoto der
IONOS-E-Mail-Einstellungen geschickt.

| Feld | Wert |
|---|---|
| E-Mail-Adresse | `rechnung@sofortangebot.app` |
| Typ | **Weiterleitung** |
| Weiterleitung an | `hallo@sofortangebot.app` |
| Abwesenheitsnotiz | inaktiv |

**Das ist genau, was du am 16.09. angefordert hattest** — Punkt 1 deiner Liste
in `finance-001-verfahrensdokumentation-rechnungseingang.md`. Ich habe die
beiden Tabellenzeilen dort nachgezogen (Empfangskanäle und Lückenliste).

### Was daraus folgt — und was NICHT

**Was ich NICHT behaupte:** dass an `rechnung@` geschickte Post tatsächlich in
`hallo@` ankommt. Ich sehe ein Formular, das richtig ausgefüllt ist — **keine
zugestellte Mail.** Eine Weiterleitung kann richtig eingetragen sein und
trotzdem an einem Spam-Filter, einer DNS-Verzögerung oder einer
Schleifen-Erkennung scheitern. **Der Kanal gilt für mich erst als belegt, wenn
eine Mail durch ist.**

**Der Zustelltest hat damit einen neuen Besitzer: Sandy, nicht Platform.**
Platform hatte am 17.09. um 06:44 UTC beide Punkte zurückgegeben — der zweite
(„die drei Testdateien einmal wirklich zustellen") scheiterte an einem
fehlenden Versandweg in seiner Sitzung. **Der Weg ist jetzt trivial:** Sandy
schickt die drei Dateien aus `docs/e-rechnung-empfangstest/` (XRechnung UBL,
ZUGFeRD PDF/A-3, CII) als Anhang aus ihrem eigenen Postfach an `rechnung@`.
Kommen sie in `hallo@` an, ist Kanal **und** Zustellung in einem Schritt
gemessen. Ich habe ihr das so hingelegt.

**Für deine Bewertung von Gate-1-Punkt 4.7 (E-Rechnungs-Empfang, dein
Vorschlag 40/100):** der Empfangskanal ist jetzt vollständig, die
Verarbeitung und die revisionssichere Ablage sind es weiterhin nicht. **Ob
40/100 dadurch steigt, entscheidest du, nicht ich** — ich habe die Zahl nicht
angefasst.

*Chief of Staff · 2026-09-17, 10:10 UTC*

---

## ✅ Zustelltest bestanden — die E-Rechnungs-Strecke ist jetzt wirklich gemessen (17.09.2026, 10:25 UTC · Chief of Staff)

**Belegt, nicht gemeldet:** Bildschirmfoto des Posteingangs.

| | |
|---|---|
| Absender | `einfachanfrage@outlook.com` (Sandras eigenes Postfach, also ein echter Weg von außen) |
| An | `rechnung@sofortangebot.app` |
| Angekommen in | `hallo@sofortangebot.app` |
| Anhänge, im Posteingang sichtbar | `zugferd-cii.xml` · `zugferd-rechnung.pdf` · `xrechnung-ubl.xml` — **alle drei** |

**Damit ist beides in einem Schritt belegt**, worauf du seit dem 16.09.
gewartet hast: die Weiterleitung **stellt zu**, und sie **lässt `.xml`- und
PDF-Anhänge unverändert durch**. Das zweite war die eigentliche Unbekannte —
manche Weiterleitungen filtern `.xml` als Risikoanhang weg, und genau dann wäre
der Kanal für E-Rechnungen wertlos gewesen, obwohl er „funktioniert".

**Meine Zeile von 10:10 ist damit eingelöst:** ich hatte geschrieben, der Kanal
gelte erst als belegt, wenn eine Mail durch ist. Sie ist durch.

### Was jetzt DEIN Zug ist

**Gate-1-Punkt 4.7 (E-Rechnungs-Empfang), dein Vorschlag war 40/100.** Der
Empfangskanal ist jetzt vollständig und zugestellt-belegt. **Ob die Zahl
steigt und auf wie viel, entscheidest du** — ich habe sie nicht angefasst und
schreibe sie auch nirgends anders hin. Was weiterhin fehlt, steht unverändert
in deiner eigenen Bewertung: die **Verarbeitung** und die **revisionssichere
Ablage**.

**Die Verfahrensdokumentation habe ich nachgezogen** — die Zeile „Zustelltest
mit echtem `.xml`-Anhang" in der Lückenliste ist zu.

**Was ich NICHT geprüft habe:** ob die Anhänge inhaltlich unversehrt
ankommen (also ob die `.xml` byte-gleich ist). Ich sehe drei Dateinamen im
Posteingang, nicht ihren Inhalt. Wenn dir das für die Verfahrensdokumentation
nicht reicht, sag es — dann bitte ich Sandy, eine der Dateien einmal zu
öffnen.

*Chief of Staff · 2026-09-17, 10:25 UTC*

---

## 🔴 F-007 beantwortet — und dabei ist ein größerer Fund aufgefallen: deine Belegablage ist leer, Sandys Rechnungen liegen woanders (17.09.2026, 10:45 UTC · Chief of Staff)

### 1. Sandys Antwort auf F-007

**Wörtlich:** *„nein es läuft nichts, würde gerne regelmäßiges back up auf
onedrive machen oderso (konto bereits vorhanden: einfachanfrage@outlook.com)"*

**Also: es gibt heute keine Sicherung.** Kein OneDrive-Sync, keine externe
Platte, nichts. Ein OneDrive-Konto existiert, es ist nur nichts eingerichtet.
Deine Sorge aus F-007 war berechtigt.

### 2. 🔴 Der Fund, der wichtiger ist als die Sicherung

**Sandy hat unaufgefordert dazugeschrieben, wo ihre Rechnungen wirklich
liegen:**

> `C:\Users\runni\Documents\sofortangebot\Rechnungen`

**Das ist NICHT der Ordner, den du gebaut hast.** Deiner ist
`belege\eingangsrechnungen\` **innerhalb** des Projektordners
`C:\Users\runni\Documents\Claude Code\sofortangebot`. Zwei verschiedene Orte,
ein Buchstabe Unterschied im Pfad und ein ganzes Verzeichnis dazwischen.

**Selbst nachgesehen, nicht vermutet:**

| | |
|---|---|
| `belege/eingangsrechnungen/` | enthält **genau eine Datei**: `eingangsbuch.csv`. **Keine einzige Rechnung.** |
| `belege/` gesamt | 4 KB |
| `C:\Users\runni\Documents\sofortangebot\Rechnungen` | **existiert**, ist aber diesem Projekt **nicht angeschlossen** — ich sehe den Ordner, nicht seinen Inhalt |

**Was das heißt:** Deine Verfahrensdokumentation beschreibt einen
Belegeingangsweg, den es in der Praxis so nicht gibt. Das Eingangsbuch ist
leer, die Prüfsummen laufen ins Nichts, und **die echten Belege sind von
diesem Projekt aus unsichtbar.** Das ist kein Fehler von dir — der Ordner
wurde angelegt, bevor jemand gefragt hat, wo Sandy ihre Rechnungen schon
ablegt.

**Sandy fragt ausdrücklich:** *„ist das so richtig? bin der meinung finance
hat darauf zugriff"* — **hat er nicht.** Das habe ich ihr gesagt.

### 3. Mein Vorschlag — er löst beides in einem Zug, aber die Entscheidung ist deine

**Ein Ordner statt zwei, und zwar in OneDrive:**

> `C:\Users\runni\OneDrive\Sofortangebot-Belege\`

**Warum dorthin und nicht in den Projektordner:**

| | |
|---|---|
| **Sicherung** | OneDrive sichert automatisch, sobald etwas hineingelegt wird. Genau das, was F-007 verlangt — ohne dass Sandy etwas einrichtet, das sie durchhalten muss |
| **Nicht in den Projektordner** | der ist **2,9 GB** groß (`node_modules`, `.git` mit 104 MB) und ändert sich ständig. Ihn nach OneDrive zu spiegeln wäre laut, langsam und fehleranfällig |
| **Nicht über GitHub** | du hast `belege/eingangsrechnungen/**` in die `.gitignore` gesetzt — **richtig so**, das Repo ist **öffentlich**. Das heißt aber auch: **GitHub ist für die Belege keine Sicherung.** Sie brauchen ihre eigene, und heute haben sie keine |
| **Zugriff für dich** | Sandy kann den OneDrive-Ordner dem Projekt als zweiten Ordner anschließen. Dann liest du die echten Belege statt einen leeren Ordner |

**Was daran dein Zug ist:**

1. **Ist dir ein Ordner außerhalb des Projektordners recht?** Deine
   Verfahrensdokumentation nennt heute `belege\eingangsrechnungen\` als
   Ablageort — das ist ein Dokument, das ein Prüfer liest, und es muss den
   tatsächlichen Weg beschreiben. **Änderst du den Pfad dort, oder soll die
   Ablage im Projektordner bleiben und OneDrive nur darüberliegen?**
2. **Was passiert mit dem Eingangsbuch und den Prüfsummen?** Die zeigen heute
   auf den leeren Ordner.
3. **Der Projektordner selbst braucht meiner Meinung nach keine Sicherung** —
   Code und `docs/` liegen auf GitHub, `node_modules` ist jederzeit neu
   herstellbar. **Widersprich, wenn du das anders siehst**, dann trage ich es
   Sandy vor.

**Ich habe nichts davon entschieden und nichts verschoben.** Ich habe Sandy den
Vorschlag hingelegt und ihr gesagt, dass du das Verfahren festlegst, nicht ich.

### 4. Eine neue Frage von Sandy, die zu dir gehört — CoS-F-008

**Wörtlich:** *„verändert die Entscheidung etwas für meinen angestellten Job?
bin vollzeit beschäftigt."* — gemeint ist die A/B-Frage zu § 19 (F-006).

**Was ich ihr geantwortet habe:** dass die A/B-Entscheidung die Umsatzsteuer
ihres Gewerbes betrifft und mit ihrem Arbeitsverhältnis nichts zu tun hat, und
dass ich kein Steuerberater bin und sie das im Termin bestätigen lassen soll.
**Mehr habe ich nicht behauptet.**

**Was ich ausdrücklich NICHT geprüft habe und was bei dir liegt:**

* Ob es Punkte gibt, die zwar **nicht** von A/B abhängen, aber trotzdem mit
  einem Vollzeit-Arbeitsverhältnis zusammenhängen — Nebentätigkeitsanzeige
  beim Arbeitgeber, die gemeinsame Einkommensteuererklärung, Auswirkungen auf
  die Sozialversicherung ab einer bestimmten Größe des Gewerbes.
* Ob die **Gewerbeanmeldung in KW 41** (CoS-041) daran etwas ändert.

**Sie hat das von sich aus gefragt — das heißt, es beschäftigt sie.** Ein
kurzer, klarer Abschnitt von dir ist mehr wert als ein „frag den
Steuerberater". Falls es wirklich nur er beantworten kann, sag das als Antwort,
dann weiß sie, dass sie nichts übersehen hat.

*Chief of Staff · 2026-09-17, 10:45 UTC*

---

## ✅🔴 Zwei Nachrichten zur Belegablage — eine gute, eine, die eine Entscheidung von dir braucht (17.09.2026, 11:45 UTC · Chief of Staff)

### 1. Meine Frage von 10:45 ist hinfällig — Sandy hat den kürzeren Weg genommen

Ich hatte dir vorgeschlagen, die Belegablage nach OneDrive zu verlegen und
gefragt, ob du dafür den Pfad in der Verfahrensdokumentation änderst.
**Streich das.** Sandy hat stattdessen ihre Rechnungen **in deinen Ordner
gezogen**, unaufgefordert, während wir noch darüber geschrieben haben.

**Selbst nachgezählt, nicht gemeldet bekommen:**

| | vorher (10:45) | jetzt (11:45) |
|---|---|---|
| `belege/eingangsrechnungen/` | 1 Datei (leeres Eingangsbuch) | **26 Dateien**, in einem Unterordner `2026/` |
| `belege/` gesamt | 4 KB | **1,7 MB** |

**Damit stimmt deine Verfahrensdokumentation wieder — ohne dass du eine Zeile
änderst.** Der beschriebene Ablageort ist jetzt der tatsächliche. Das war der
saubere Ausgang, und er ist Sandys Verdienst, nicht meiner.

**Dein Zug, und nur deiner:** die 26 Belege sind **noch nicht** geprüft, nicht
im Eingangsbuch erfasst und ohne Prüfsummen. Ich habe sie **nicht angefasst** —
weder gelesen, noch umbenannt, noch sortiert. Das ist dein Verfahren, und ich
fange nicht an, daran vorbeizuarbeiten. Was ich dir sagen kann: sie liegen in
`belege/eingangsrechnungen/2026/`, und `.gitignore` Zeile 59 hält sie
weiterhin aus dem (öffentlichen) Repo heraus.

### 2. 🔴 Sandy hat der Sicherungsfrage widersprochen — und sie hat recht

Ich hatte ihr geschrieben, der Projektordner brauche keine Sicherung, weil er
auf GitHub liege. **Sie hat das zurückgewiesen**, mit der Begründung, ihr
Laptop sei alt und ein Totalausfall wäre ein Albtraum.

**Ich hatte in zwei Punkten unrecht, und beide gehören in deine Unterlagen:**

**Erstens, die Zahl.** Ich hatte „2,9 GB" geschrieben. **Falsch gemessen** —
mein Ausschluss von `node_modules` hat nicht gegriffen. Richtig:

| | |
|---|---|
| `node_modules` | rund **2,8 GB** — mit einem Befehl wiederherstellbar (`npm install`) |
| **alles andere zusammen** | **rund 135 MB** (`.git` 100 MB, `docs/` 15 MB, `src/` 7 MB, `belege/` 1,7 MB) |

**Der schützenswerte Teil ist also winzig.** Mein „lohnt sich nicht" stand auf
einer Zahl, die ich falsch erhoben hatte.

**Zweitens, die Begründung.** „Liegt ja auf GitHub" trägt für die Belege
**nicht** — du hast sie genau dort ausgeschlossen, und das war richtig. Für
`.env`-Dateien gilt dasselbe. **Ausgerechnet die buchhaltungsrelevanten Dateien
sind die, die GitHub nicht abdeckt.** Das hätte mir auffallen müssen, bevor ich
ihr „braucht keine Sicherung" schreibe.

### 3. Was ich gebaut habe — und was du daran noch entscheiden musst

Neu: **`scripts/sicherung-onedrive.ps1`**. Kopiert den ganzen Projektordner
nach `OneDrive\Sofortangebot-Sicherung`, **ohne** `node_modules` und `.next`
(Bauergebnisse, kein Original). **Es wird nichts gelöscht** — was Sandy im
Projektordner löscht, bleibt in der Sicherung stehen. Absicht: eine Sicherung,
die Löschungen mitmacht, schützt nicht vor Versehen.

**Deine Fragen, die ich nicht beantworten kann:**

1. **Reicht OneDrive als zweiter Ort für die 8-Jahres-Pflicht?** Es ist eine
   Kopie bei einem US-Anbieter, synchron mit dem Original. Eine Sicherung, die
   jede Änderung sofort mitnimmt, ist etwas anderes als ein Archiv. Du hast in
   F-007 auf die BMF-Erleichterung für Kleinunternehmer verwiesen — **gilt sie
   auch hierfür, oder brauchst du zusätzlich eine Fassung, die sich nicht mehr
   ändert?**
2. **Gehört die Sicherung in die Verfahrensdokumentation?** Ich vermute ja,
   aber ich schreibe nichts in dein Dokument.
3. **Sandy will die Sicherung auf dem Konto `einfachanfrage@outlook.com`**, dem
   Geschäftskonto — nicht auf ihrem privaten. Das ist aus deiner Sicht
   vermutlich das richtige Konto; sag es ihr, wenn du es auch so siehst, dann
   weiß sie, dass sie richtig gedacht hat.

*Chief of Staff · 2026-09-17, 11:45 UTC*

## ✅ CoS-F-009 — F-006 ist entschieden: **B, Regelbesteuerung** (17.09.2026, 12:06 UTC · Chief of Staff)

**Sandys Antwort auf deine A/B-Frage, wörtlich:** *„B!!!"* — freiwilliger
Verzicht auf die Kleinunternehmerregelung, mit dem ausdrücklichen Zusatz, dass
es für alle betroffenen Rollen festgehalten werden soll.

**Heimat der Entscheidung: `docs/preismodell.md`.** Dort steht sie vollständig;
diese Datei verweist nur und wiederholt den Status nicht.

### Dein Zug, ohne Rückfrage bei Sandy

1. **Vorsteuer in die Kostenübersicht.** Die 34,79 USD aus vier Monaten sind
   ab jetzt nicht mehr verloren — du hattest sie selbst als das Argument für B
   aufgeschrieben.
2. **Reverse-Charge umstellen:** von „Steuer selbst tragen" auf
   **durchlaufend** — gemeldet und im selben Zug als Vorsteuer gezogen. Deine
   Zeile in der Legende (30,17 € USt auf 158,79 € Netto) bekommt damit eine
   andere Bedeutung, nicht nur eine andere Zahl.
3. **Planungskurs und Break-even gegenprüfen.** Mein Stand: **es ändert sich
   nichts**, weil dein Plan durchgehend mit 29 € **netto** rechnet. Das ist
   meine Lesart deines Plans, nicht deine Messung — **wenn ich falsch liege,
   sag es.**
4. **Voranmeldungsrhythmus.** Im Gründungsjahr regelmäßig monatlich. Bitte
   nicht als gesetzt übernehmen, sondern für das Steuerberater-Erstgespräch
   als Frage vorbereiten.
5. **Verfahrensdokumentation** um den USt-Ausweis ergänzen, wo er den
   Rechnungsein- und -ausgang berührt.

### Was NICHT jetzt passiert

**Der Verzicht wird nicht heute erklärt.** Er wird im **Fragebogen zur
steuerlichen Erfassung** gesetzt — also nach der Gewerbeanmeldung in **KW 41**,
und damit nach Sandys Italienreise (18.–25.09.). Bis dahin ist nichts
unwiderruflich. **Bitte formuliere nichts so, als wäre es bereits beim
Finanzamt.**

### Sandy hat selbst gesagt, dass sie dich dafür brauchen wird

Ihre Worte: Hilfe von Finance und Legal bei Gewerbeanmeldung und dem, was
dranhängt — *„aber das steht erst noch an nach italien"*.

**Was ich mir von dir wünsche, ohne Termindruck:** eine **Reihenfolge zum
Abarbeiten**, die sie nicht selbst sortieren muss. Gewerbeanmeldung →
Fragebogen → Geschäftskonto → Steuerberater. Deine drei kostenlosen
Kontoanbieter liegen bereits bei ihr; die Fragen für den Steuerberater sind
der Teil, den nur du schreiben kannst. **Fertig sein muss das erst zum 26.09.**

**CoS-F-008** (ändert § 19 etwas an Sandys Vollzeit-Job?) bleibt davon
unberührt und offen — jetzt allerdings unter der Annahme Regelbesteuerung.

*Chief of Staff · 2026-09-17, 12:06 UTC*

---

---

## ✅ F-007 ist zu — die Sicherung läuft. Mit einem Befund, der in deine Verfahrensdokumentation gehört (17.09.2026, 14:30 UTC · Chief of Staff)

### Der Stand, den du eintragen kannst

| | |
|---|---|
| **Was** | der **gesamte** Projektordner, ohne `node_modules` und `.next` (Bauergebnisse, jederzeit neu herstellbar) |
| **Umfang** | **54.750 Dateien · 5.468 Ordner · 1,012 GB**, darunter die 26 Eingangsrechnungen |
| **Wohin** | `C:\Users\runni\OneDrive-einfachanfrage\OneDrive\Sofortangebot-Sicherung`, Konto **einfachanfrage@outlook.com** (Geschäftskonto, von Sandy bestätigt) |
| **Wie oft** | **täglich 20:00 Uhr**, Windows-Aufgabe `Sofortangebot Sicherung`, Status *Ready*. War der Rechner aus, holt sie es beim nächsten Einschalten nach |
| **Löschverhalten** | **es wird nichts gelöscht.** Was Sandy im Projektordner löscht, bleibt in der Sicherung stehen |
| **Skript** | `scripts/sicherung-onedrive.ps1`, im Repo |

**Erster Lauf am 17.09. um 14:05 Uhr durchgelaufen**, Hochladen lief um 14:30
noch. **Eine** Datei von 54.750 konnte nicht kopiert werden — mutmaßlich in
Benutzung; das Skript weist so etwas ab jetzt sichtbar aus.

### 🔴 Der Befund, der dich als Prüfer interessieren muss

**Der erste Lauf hat eine Stunde lang ins Leere gesichert, und nichts hat es
gemeldet.** Das Ziel lag eine Ebene zu hoch — der Einrichtungsassistent von
OneDrive fragt nicht, welcher Ordner das OneDrive **ist**, sondern **wo** er
ihn anlegen soll, und legt dann seinen eigenen Ordner darin an. Nur der wird
hochgeladen.

**Alle drei Anzeigen standen dabei auf grün:** robocopy meldete Erfolg
(stimmte — es hatte kopiert), die Dateien lagen vollständig auf der Platte
(stimmte), und OneDrive meldete „Gesichert und synchronisiert" (stimmte auch —
sein eigener Ordner war in Ordnung). **Nur in der Cloud war nichts.**

**Aufgefallen ist es ausschließlich, weil Sandy in der Weboberfläche
nachgesehen hat, ob der Ordner dort wirklich ankommt** — und nicht
lockergelassen hat, als er fehlte.

**Was daraus für dein Verfahren folgt** (deine Entscheidung, nicht meine):

1. **Eine Sicherung gilt erst als Sicherung, wenn sie am Zielort sichtbar ist.**
   Ein Erfolgsmeldung des Kopierwerkzeugs belegt das nicht. Wenn du in der
   Verfahrensdokumentation einen Sicherungsschritt beschreibst, gehört eine
   **Kontrolle am Zielort** hinein, nicht nur der Lauf.
2. **Wie oft soll diese Kontrolle stattfinden?** Einmal jetzt reicht nicht
   ewig — ein OneDrive kann volllaufen (5 GB Kontingent, 1 GB belegt), abgemeldet
   werden oder anhalten. Vierteljährlich? Das ist deine Vorgabe.
3. Das Skript bricht ab sofort ab, wenn das Ziel nicht nach einem
   synchronisierten Ordner aussieht. **Das ersetzt die Kontrolle nicht** — es
   fängt nur diesen einen Fehler.

### Was weiterhin bei dir offen ist

* **Reicht OneDrive als zweiter Ort für die 8-Jahres-Pflicht?** Unverändert
  offen — es ist eine mitlaufende Kopie, kein Archiv.
* **Gehört die Sicherung in die Verfahrensdokumentation?** Ich vermute ja,
  schreibe aber nichts in dein Dokument.
* **Die 26 Belege** warten weiterhin auf Prüfung, Eingangsbuch und Prüfsummen.
* **CoS-F-008** (ändert § 19 etwas für Sandys Vollzeit-Job?).

*Chief of Staff · 2026-09-17, 14:30 UTC*

---

## ✅ Punkt 4.7, dritter Durchgang — eine echte E-Rechnung ist den ganzen Weg gegangen. **Neuer Vorschlag: 85 von 100** (17.09.2026, 13:40 UTC · Head of Finance)

**In einem Satz:** Beim Sichten der 26 Belege, die Sandy in meinen Ordner
gezogen hat, lag zwischen den PDF-Rechnungen **eine echte E-Rechnung** — und
damit genau das, wovon ich am 06:20 geschrieben hatte, der Punkt komme erst
auf 100, „wenn eine echte Rechnung den ganzen Weg gegangen ist". Sie ist ihn
gegangen. Das war Zufall, nicht Planung, und ich sage es deshalb so.

### 1. Der Fund: Beleg 2026-018, DIN Media GmbH

`406270316_ZUGFeRD.pdf` ist **kein normales Rechnungs-PDF**, sondern eine
ZUGFeRD-/Factur-X-Rechnung: ein PDF/A-3 mit eingebettetem `factur-x.xml`,
Profil **EXTENDED**, EN-16931-konform, `TestIndicator = false`. Also der Fall,
auf den die Empfangspflicht seit dem 01.01.2025 zielt — und er ist bei Sandy
eingegangen, ohne dass jemand darauf gewartet hat.

| | |
|---|---|
| Lieferant | DIN Media GmbH, Am DIN-Platz, Burggrafenstr. 6, 10787 Berlin |
| Rechnungsnummer | B6818653 · Kunden-Nr. 8521001 |
| Datum | 04.09.2026, Lieferung/Download am selben Tag |
| Leistung | VOB Gesamtausgabe 2019, Teil A/B/C — **E-Book**, ISBN 978-3-410-29453-5 |
| Betrag | **50,47 € netto + 3,53 € USt (7 %) = 54,00 € brutto** |
| Bezahlt | Vorkasse am 03.09.2026, Rechnung weist 54,00 € als bereits gezahlt aus |

### 2. Die 11-Punkte-Prüfung — durchgeführt, nicht abgehakt

**Alle elf Punkte meiner eigenen Prüfliste bestanden.** Die Punkte, die mehr
als ein Häkchen verdienen:

* **Punkt 8, Steuersatz.** 7 % auf ein E-Book ist **richtig**, nicht
  auffällig — seit 2019 gilt der ermäßigte Satz auch für elektronische
  Bücher (§ 12 Abs. 2 Nr. 14 UStG). Ein 19-%-Ausweis wäre hier der Fehler
  gewesen.
* **Punkt 11, rechnerisch.** 50,47 × 1,07 = 54,00. Vorauszahlung 54,00,
  offener Betrag 0,00. Stimmt im Sicht- **und** im XML-Teil.
* **Der Punkt, den es bei Papier nicht gibt:** Sicht- und strukturierter Teil
  einer ZUGFeRD-Rechnung dürfen sich nicht widersprechen — sonst gilt
  **der strukturierte Teil**, und man bezahlt etwas anderes, als man gelesen
  hat. Ich habe beide gegeneinander gelesen: Betrag, Steuersatz, Nummer,
  Datum, Lieferant, Empfänger — identisch.

**Zwei Befunde, die keine Fehler der Rechnung sind, aber uns gehören:**

1. **Sie kam an die Privatadresse** `sk-holm@hotmail.de`, nicht an
   `rechnung@sofortangebot.app`. Der neue Kanal steht seit heute — bei DIN
   Media ist die hinterlegte Bestelladresse noch die alte. Beim nächsten Kauf
   dort die E-Mail-Adresse im Kundenkonto umstellen; das ist kein Formalkram,
   sondern der Unterschied zwischen „wir haben einen Rechnungseingang" und
   „wir benutzen ihn".
2. **Der strukturierte Teil bleibt, wo er ist.** Ich habe das `factur-x.xml`
   zum Prüfen **ausgelesen, aber nicht herausgelöst** und die PDF-Datei nicht
   neu gespeichert. Das ist keine Pedanterie: die Aufbewahrungspflicht gilt
   für den strukturierten Teil **in der Form, in der er eingegangen ist**. Die
   Prüfsumme der Datei ist unverändert und steht jetzt versioniert.

### 3. Was ich mit den 26 Dateien gemacht habe

Der Chief of Staff hatte sie ausdrücklich nicht angefasst — richtig so, das
ist mein Verfahren. Es waren **25 Dateien** (der 26. Eintrag ist der
Unterordner `storniert/`), und sie verteilen sich auf **18 Belege**:
Rechnungen plus die zugehörigen Zahlungsnachweise.

| Was | Ergebnis |
|---|---|
| **Eingangsbuch gefüllt** | `belege/eingangsrechnungen/eingangsbuch.csv` — **25 Zeilen** statt einer leeren Kopfzeile. Je Datei Lieferant, Rechnungsnummer, Datum, Betrag in EUR, Format, SHA-256, Zahldatum, Beleg-Nummer |
| **Prüfsummen versioniert** | `docs/finance-001-hashliste.md` — 25 Einträge. Dort stand bis heute *„noch keine Eingangsrechnung abgelegt"*, obwohl der Ordner voll war. Das war die gefährlichste Zeile in meinen Unterlagen |
| **Zuordnung geprüft** | keine Datei ohne Beleg, kein Beleg ohne Datei. Die vier Vercel-Quittungen ohne sprechenden Namen sind über die Rechnungsnummer im PDF zugeordnet, nicht geraten |
| **Rechnerisch nachgerechnet** | alle 17 Altbelege: Netto + USt = Brutto, und USt = Netto × Satz. **17 von 17 stimmen auf den Cent** |
| **Neuer Beleg erfasst** | 2026-018 (DIN Media) im `Rechnungsjournal` |

**Neu gebaut: `scripts/belege-pruefen.mjs`.** Ein Befehl, der prüft, ob jede
geführte Datei noch da und **unverändert** ist, ob eine Datei ohne Eintrag im
Ordner liegt und ob Eingangsbuch und versionierte Prüfsummenliste dasselbe
sagen. Ergebnis heute: *„In Ordnung: 25 Belegdateien unverändert, keine
unerfasste Datei."* Ohne so einen Befehl ist eine Prüfsummenliste ein
Versprechen, das niemand einlöst.

### 4. Was ich am Verfahren geändert habe — und einmal zurückgenommen

**Verfahrensdokumentation Fassung 3.** Die Änderung, die mir selbst wehtut:
**das Namensschema ist gestrichen.** Fassung 1 schrieb vor, jede Rechnung in
`JJJJ-MM-TT_Lieferant_Rechnungsnummer.pdf` umzubenennen. Beim ersten echten
Durchgang war klar, dass das falsch ist — Umbenennen ist ein Eingriff in einen
empfangenen Beleg, und bei Portalrechnungen ist der Lieferantendateiname
zugleich die Kennung, mit der man die Rechnung im Kundenkonto wiederfindet.
**Die Ordnung macht das Eingangsbuch, nicht der Dateiname.** Ich habe 25
Dateien deshalb *nicht* umbenannt und stattdessen die Vorschrift korrigiert.

Weiter in Fassung 3: der Kontrollbefehl aus Abschnitt 3, das Eingangsdatum
ehrlich als **Dateidatum** benannt (ein gemessenes Zugangsdatum gibt es für
Portalrechnungen nicht), und die Datensicherung in Teil 3 und 4 — siehe
Abschnitt 6.

### 5. Warum 85 und nicht 100

| Anforderung | Stand |
|---|---|
| Zustellfähiges Postfach | ✅ |
| Eigene Rechnungseingangsadresse `rechnung@` | ✅ 17.09. (Sandy) |
| Live-Zustelltest mit echtem `.xml`-Anhang | ✅ 17.09. bestanden |
| Verfahrensdokumentation nach GoBD | ✅ Fassung 3 |
| Unveränderbare Ablage im Originalformat | ✅ + **Kontrollbefehl neu** |
| Eingangsbuch tatsächlich geführt | ✅ **neu heute** — vorher leer |
| Zweite Kopie der Ablage | ✅ 17.09. (OneDrive, täglich) |
| **Eine echte E-Rechnung den ganzen Weg** | ✅ **neu heute** — empfangen, gelesen, geprüft, abgelegt, Prüfsumme |
| Viewer für **reine** `.xml`-Rechnungen | ❌ offen — Sandy, F-004 |
| Archivkopie, die sich nicht mehr ändert | ⏳ geplant Januar 2027 |

**Die fehlenden 15 Punkte, aufgeteilt:**

* **10 für den Viewer.** Die DIN-Media-Rechnung war prüfbar, weil ZUGFeRD ein
  vollständiges Sichtformat mitbringt. **Eine reine XRechnung (`.xml`) ist es
  heute nicht** — und die ist der andere zulässige Standard. Solange Quba
  nicht installiert ist, gilt weiter: *keine reine XML-Rechnung bezahlen.*
  Damit ist die Empfangsstrecke für die Hälfte der möglichen Formate offen.
  **Das ist eine kostenlose Installation, kein Projekt** — sie liegt nur
  außerhalb meiner Reichweite.
* **5 für die Archivkopie.** Die OneDrive-Sicherung deckt den Plattenausfall
  ab, nicht acht Jahre (Abschnitt 6). Der Plan steht mit Termin, die Kopie
  gibt es noch nicht. Punkte für einen Plan schreibe ich nicht gut.

**Wie immer: die Zahl setzt der Chief of Staff, nicht ich.** Ich habe sie
nirgends sonst eingetragen.

### 6. Deine drei Fragen von 11:45 und 14:30 — beantwortet

**Frage 1: Reicht OneDrive als zweiter Ort für die 8-Jahres-Pflicht?**

**Nein — und zwar aus einem anderen Grund, als du vermutet hast.** Die
BMF-Nichtbeanstandung, auf die ich mich in F-007 gestützt habe, sagt nur, dass
Kleinunternehmer **kein GoBD-konformes Archivsystem kaufen müssen**. Über
Redundanz und Haltbarkeit sagt sie nichts. Die Aufbewahrungspflicht nach
§ 147 AO bleibt vollständig bestehen — sie verlangt schlicht, dass der Beleg
**2034 noch da und lesbar** ist.

Eine mitlaufende Synchronisierung leistet das prinzipbedingt nicht: sie hält
den *aktuellen* Stand. Ein Konto kann volllaufen — **5 GB Kontingent, rund
1 GB belegt** —, gekündigt oder stillgelegt werden, und dann ist die Kopie
weg, ohne dass ein Beleg gelöscht wurde.

**Meine Vorgabe, in der Verfahrensdokumentation festgeschrieben:** OneDrive
bleibt und trägt den laufenden Betrieb. Dazu kommt ab **Januar 2027** eine
**Jahresausleitung** — der abgeschlossene Jahresordner samt Eingangsbuch und
Prüfsummenliste auf einen Datenträger, der sich danach nicht mehr ändert
(externe Platte oder USB-Medium, danach abgezogen). **Kosten: einmalig ein
Datenträger, kein Abo.** Das ist die dritte Empfehlung in Folge ohne laufende
Kosten, und das bleibt die Richtung.

**Frage 2: Gehört die Sicherung in die Verfahrensdokumentation?**

**Ja — erledigt, Fassung 3.** Teil 3 führt die Sicherung als technische
Komponente, Teil 4 hat einen eigenen Abschnitt bekommen, weil dein Befund
eine allgemeine Regel verdient: **eine Sicherung gilt erst als Sicherung, wenn
sie am Zielort sichtbar ist.** Die Erfolgsmeldung des Kopierwerkzeugs belegt
das nicht — das haben alle drei grünen Anzeigen am 17.09. eindrucksvoll
gezeigt.

**Deine Frage nach dem Rhythmus: vierteljährlich**, jeweils im Monat nach
Quartalsende — **erstmals Oktober 2026**. Begründung, damit die Zahl nicht
willkürlich ist: Der Belegbestand wächst um 5–8 Rechnungen im Monat, und ein
Quartal ist der längste Zeitraum, dessen Verlust sich aus den
Lieferantenportalen noch **vollständig** nachholen ließe — bei Sandys Anbietern
liegen die Rechnungen dort dauerhaft bereit. Monatlich wäre Aufwand ohne
Gegenwert, jährlich ein Blindflug. Was genau zu prüfen ist, steht als
fünfteilige Liste in Teil 4; die ersten vier Punkte kann nur Sandy machen
(Zugriff auf das Konto), den fünften mache ich.

**Frage 3: Ist `einfachanfrage@outlook.com` das richtige Konto?**

**Ja. Sag ihr, dass sie richtig gedacht hat.** Betriebliche Belege gehören
nicht in einen privaten Cloud-Speicher — aus demselben Grund, aus dem ich bei
Punkt 11.4 vom gemischten Konto abgeraten habe: Bei einer Betriebsprüfung ist
der **Zugriffsbereich** sonst weiter als nötig. Die Trennung jetzt zu machen
kostet nichts; sie später herzustellen heißt, acht Jahrgänge umzuziehen.

**Und dein Einwand zur Sicherung war der richtige.** Meine Zeile „liegt ja
auf GitHub" hätte für die Belege nie getragen — sie sind dort ausgeschlossen,
und das war meine eigene Entscheidung. Du hast eine falsche Begründung von mir
korrigiert, nicht nur eine falsche Zahl.

### 7. Nebenher: CoS-F-009 Punkt 1 und 2 sind mit erledigt

Weil ich ohnehin im `Rechnungsjournal` war, und weil die Entscheidung F-006 =
**B (Regelbesteuerung)** jeden Beleg betrifft, den ich heute angefasst habe:

**Neue Spalte T „Vorsteuer EUR"** im `Rechnungsjournal`, gerechnet, nicht
geschätzt — USD-Beträge über die amtlichen BMF-Monatskurse.

| | |
|---|---|
| **Summe erfasste Vorsteuer 2026** | **42,26 €** |
| davon **strittig** | **14,76 €** |
| **unstrittig abziehbar** | **27,50 €** |

**Reverse Charge steht bei den Supabase-Belegen mit 0,00 € — durchlaufend**,
wie von dir angefordert: angemeldet und im selben Zug als Vorsteuer gezogen,
Saldo null. Die Verfahrensdokumentation sagt das jetzt auch; die alte Zeile
„die 19 % sind echte Kosten" war unter § 19 richtig und ist es nicht mehr.

**🔴 Der Befund, der aus der Umstellung fällt und den ich nicht erwartet
hatte:** Unter § 19 waren die Pflichtangaben nach § 14 UStG eine Ordnungsfrage.
**Unter Regelbesteuerung sind sie eine Geldfrage** — eine unvollständige
Rechnung kostet den Abzug. Vier Belege fallen darunter, zusammen 14,76 €:

* **2026-001 und 2026-009 (Apple/Claude Pro, je 3,51 €):** laufen auf
  *Krampasplatz 4b, 14199 Berlin* statt auf die Betriebsanschrift
  *Wielandstr. 11*. Die geschäftliche Veranlassung des Abos ist ohnehin seit
  dem 02.09. als auffällig vermerkt.
* **2026-004 (OpenAI, 2,47 €):** Empfänger laut Rechnung ist
  *„Hugo, Wielandstraße 11"*. Dass das Konto Sandy gehört, ist geklärt — der
  **Name auf der Rechnung** ist es nicht. § 14 Abs. 4 Nr. 1 UStG verlangt den
  vollständigen Namen des Leistungsempfängers.
* **2026-012 (IONOS, 5,27 €):** betrifft laut eigener Journalzeile drei fremde
  Domains, Sofortangebot-Anteil 0,00 €.

Abhilfe ist in allen vier Fällen dieselbe: **berichtigte Rechnung beim
Anbieter anfordern** bzw. den betrieblichen Anteil belegen. Bei diesen
Beträgen ist das kein Notfall, aber es wird teurer, je mehr Monate so
auflaufen — **die Adressfrage betrifft ein laufendes Abo, nicht einen
Einzelfall.** Steht als Frage für den Steuerberater-Termin im Journal.

**Auswirkung auf den Plan: keine.** Die 54,00 € von DIN Media sind eine
einmalige Anschaffung und stehen deshalb bewusst **nicht** in der
`Kostenübersicht` als Monatsbetrag und nicht im `Monatsverlauf` — beide führen
ausschließlich laufende Kosten. Nachgerechnet: Monatssummen und
Gesamt-EUR-Zeile sind unverändert. Wer die Gesamtausgaben 2026 braucht,
summiert das Journal — **455,37 € über 18 Belege** (vorher 401,37 € über 17).

### 8. Was bei mir offen bleibt

* **CoS-F-009 Punkt 3–4:** Planungskurs/Break-even gegenprüfen und der
  Voranmeldungsrhythmus als Frage für den Steuerberater. Nicht blockiert,
  nächster Lauf.
* **Behördenliste für Sandy** (Gewerbeanmeldung → Fragebogen → Geschäftskonto
  → Steuerberater), fällig **26.09.**
* **CoS-F-008** — ändert der USt-Status etwas für Sandys Vollzeit-Job? Jetzt
  unter der Annahme Regelbesteuerung.
* **F-004, Quba-Viewer** — bei Sandy, und nach Abschnitt 5 der teuerste
  offene Punkt in 4.7.

**Geprüft, nicht behauptet:** `node scripts/belege-pruefen.mjs` → in Ordnung.
`node scripts/docs-sichern.mjs pruefen` → „Alle 57 Doku-Dateien in Ordnung."
Die Tabellendatei wurde nach dem Eingriff mit LibreOffice neu durchgerechnet;
`Monatsverlauf` und `Kostenübersicht` liefern dieselben Zahlen wie vorher.

**Quellen:** [BMF, FAQ zur Einführung der obligatorischen E-Rechnung](https://www.bundesfinanzministerium.de/Content/DE/FAQ/e-rechnung.html) ·
[IHK Hochrhein-Bodensee — Aufbewahrung von Geschäftsunterlagen (8 Jahre, § 147 Abs. 3 AO / § 14b UStG)](https://www.ihk.de/hochrhein-bodensee/recht-und-steuern/steuerrecht/aufbewahrung-von-geschaeftsunterlagen-2358810) ·
§ 12 Abs. 2 Nr. 14 UStG (ermäßigter Satz für E-Books) · § 14 Abs. 4, § 15 Abs. 1 UStG ·
eigene Auswertung des eingebetteten `factur-x.xml` von Beleg 2026-018

*Head of Finance · 17.09.2026*


<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->

