# Platform & Integrations Engineer → Head of Legal & Compliance: CC-01

Antwort auf die Anfrage vom 2026-09-01 zu **CoS-P-001** (bei mir unter dieser Nummer dokumentiert,
nicht als eigenes Ticket — daher vermutlich nicht gefunden, wenn nach „CC-01" gesucht wurde). Betrifft
die offene Debug-Tabelle `debug_extraktion_roh`, die vom 2026-08-07 bis 2026-08-17 ohne Zugriffsschutz
(RLS) in Produktion lag. Volldokumentation des ursprünglichen Funds: `docs/chief-of-staff-platform-todos.md`,
Abschnitt CoS-P-001, sowie die Migration `supabase/migrations/20260817180000_secure_debug_extraktion_roh.sql`.

Die drei angefragten Punkte, Stand 2026-09-02:

## 1. Welche/wessen Daten lagen in der offenen Tabelle?

Die Tabelle selbst existiert nicht mehr — sie wurde irgendwann zwischen 2026-08-24 und heute außerhalb
jeder Migration manuell aus der Produktionsdatenbank entfernt (von wem/wann ist aus den mir verfügbaren
Quellen nicht feststellbar). Eine direkte Abfrage der Tabelle selbst ist deshalb nicht mehr möglich.

Ersatzweise rekonstruiert über die Zugriffsprotokolle (siehe Punkt 2) plus die noch vorhandenen Tabellen
`companies` und `ki_usage`: Im gesamten Zeitraum haben genau **3 unterschiedliche, echte, eingeloggte
Nutzerkonten** Zeilen in die Tabelle geschrieben (jede Schreib-Anfrage trägt eine echte Nutzer-ID aus
einem gültigen Login-Token, keine anonymen Schreibzugriffe):

- `sandraholm95@gmail.com` (Firma „Holm GmbH") — das ist Sandys eigenes Konto, seit Projektstart aktiv.
- Zwei weitere Konten (IDs `301245f9…` und `2bca059b…`), die **heute nicht mehr existieren** — weder
  als Login-Konto noch als Firmen-Eintrag, komplett gelöscht. Ihre Nutzungshistorie in `ki_usage` reicht
  bis zum 2026-06-14 bzw. 2026-06-17 zurück (also bis fast zum Projektstart) und zeigt sehr hohe
  Nutzungszahlen (123 bzw. 67 KI-Aufrufe insgesamt) — beides spricht stark dafür, dass es sich um
  zusätzliche Test-/Entwicklungskonten von Sandy selbst handelt und nicht um unabhängige externe
  Nutzer. **Das ist aber eine Einschätzung aus den Datenmustern, keine bestätigte Tatsache** — nur Sandy
  kann sicher sagen, ob sie (oder jemand im Team) diese beiden Konten selbst angelegt und wieder
  gelöscht hat.
- Die einzige echte dritte Partei in der Datenbank, „Lisa Schein Malerbetrieb", wurde erst am 2026-08-17
  um 15:44 Uhr angelegt — **3,5 Stunden nachdem** die Lücke bereits geschlossen war (Fix um 12:14 Uhr
  selben Tages). Für dieses Konto wurde nachweislich nichts in die offene Tabelle geschrieben.

Aktuell (heute) gibt es in der Produktionsdatenbank insgesamt nur diese 2 Konten — Sandys eigenes und
„Lisa Schein Malerbetrieb". Es gab zu keinem Zeitpunkt im fraglichen Fenster mehr als diese 3 Konten mit
Schreibzugriff auf die Tabelle.

## 2. Zugriffsprotokolle für den Zeitraum

Verfügbar und geprüft — Supabase führt HTTP-Zugriffsprotokolle (`edge_logs`), die für den gesamten
Zeitraum 2026-08-07 bis 2026-08-17 noch abrufbar waren (Stand heute; wie lange das so bleibt, hängt vom
Supabase-eigenen Aufbewahrungslimit ab, nicht von uns).

**Zentraler Befund:** Für die komplette Offenzeit (rund 9,8 Tage) gibt es in den Protokollen
ausschließlich **POST-Anfragen** (Schreiben der eigenen Zeile durch den jeweils eingeloggten Nutzer,
via `role: authenticated`, mit korrekter Nutzer-ID im Token) an die betroffene Tabelle. Es gibt **keine
einzige protokollierte Lese-Anfrage (GET)** und **keine einzige Anfrage mit der Rolle `anon`**
(unangemeldeter/öffentlicher Zugriff) an diese Tabelle im gesamten Zeitraum.

Übersetzt: Die Tür stand offen, aber es gibt in den vorhandenen Protokollen keinen Beleg dafür, dass
sie in dieser Zeit von irgendjemandem — intern oder extern — tatsächlich zum **Lesen** fremder Zeilen
benutzt wurde. Alle protokollierten Zugriffe erklären sich vollständig durch normale App-Nutzung durch
die eigenen Kontoinhaber.

Einschränkung zur Vollständigkeit: Protokolle zeigen HTTP-Zugriffe über die reguläre REST-Schnittstelle.
Ein Zugriff direkt über die Datenbank-Konsole (z. B. Supabase-Dashboard-SQL-Editor mit Admin-Zugang)
würde dort nicht auftauchen — das beträfe aber nur Personen mit vollem Projekt-Zugriff (aktuell nur
Sandy und diese Engineering-Session), nicht die vom Fund betroffene Außenwelt.

## 3. Waren echte Handwerkerkonten betroffen?

Nach aktuellem Kenntnisstand: **nein, keine unabhängigen dritten Handwerkerkonten.** Betroffen waren
ausschließlich Sandys eigenes Konto und — mit hoher Wahrscheinlichkeit, aber nicht zu 100 % bestätigt —
zwei ihrer eigenen (mittlerweile gelöschten) Test-Konten. Das einzige echte externe Konto im System
(„Lisa Schein Malerbetrieb") kam erst nach dem Fix dazu und hatte keine Daten in der offenen Tabelle.

**Bitte von Sandy bestätigen lassen, bevor das als endgültig gilt:** ob die beiden gelöschten Konten
(`301245f9…`, `2bca059b…`) tatsächlich ihre eigenen Test-Konten waren. Das ist der einzige verbleibende
Unsicherheitsfaktor in dieser Einschätzung.

— Platform & Integrations Engineer, 2026-09-02
