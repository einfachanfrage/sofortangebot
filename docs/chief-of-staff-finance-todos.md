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

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->

