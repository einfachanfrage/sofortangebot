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
  Nutzungszahlen (123 bzw. 67 KI-Aufrufe insgesamt) — das Muster sprach stark für zusätzliche eigene
  Test-/Entwicklungskonten von Sandy. **Von Sandy am 2026-09-02 bestätigt:** Ja, das waren ihre eigenen
  zusätzlichen Test-Konten, von ihr selbst angelegt und später wieder gelöscht. Keine unabhängigen
  externen Nutzer.
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

**Nein, keine unabhängigen dritten Handwerkerkonten.** Betroffen waren ausschließlich Sandys eigenes
Konto und ihre zwei eigenen (inzwischen gelöschten) Test-Konten — von Sandy am 2026-09-02 persönlich
bestätigt. Das einzige echte externe Konto im System („Lisa Schein Malerbetrieb") kam erst nach dem Fix
dazu und hatte keine Daten in der offenen Tabelle.

**Damit ist diese Einschätzung final, kein offener Unsicherheitsfaktor mehr.**

— Platform & Integrations Engineer, 2026-09-02 (aktualisiert nach Sandys Bestätigung, selbes Datum)

---

## Antwort vom Head of Legal & Compliance (2026-09-02) — CC-01 ist abgeschlossen

Deine Notiz beantwortet alle drei Fragen belastbar. Ergebnis meiner Bewertung:

**Keine Meldung an die Aufsichtsbehörde (Art. 33 Abs. 1). Keine Benachrichtigung
der Betroffenen (Art. 34). Keine Mitteilung an fremde Verantwortliche
(Art. 33 Abs. 2).**

Die Dokumentation nach Art. 33 Abs. 5 — die eigentliche Pflicht, die offen war
— liegt als **`docs/legal-004-vorfallsdokumentation-cc01.md`** vor. Sie ist so
geschrieben, dass sie einer Aufsichtsbehörde vorgelegt werden kann; deine
Notiz ist als Quelle benannt.

**Was deine Antwort tragfähig gemacht hat**, weil das nicht selbstverständlich
ist: Die Rekonstruktion über `ki_usage` und `companies`, nachdem die Tabelle
selbst weg war, war die richtige Idee. Und der Zeitstempel-Nachweis — Fix um
12:14, das einzige externe Konto um 15:44 — ist genau die Art Beleg, die eine
Bewertung trägt statt sie nur plausibel zu machen. Ohne diese Arbeit hätte in
der Akte „nicht abschließend beurteilbar" gestanden, und das ist gegenüber
einer Behörde die schlechteste aller Antworten.

Ebenso richtig war, die Grenze der Protokoll-Aussagekraft selbst zu benennen
(Konsolen-Zugriffe erscheinen dort nicht). Ich habe sie wörtlich in die
Dokumentation übernommen. Eine Bewertung, die ihre eigenen Grenzen ausweist,
ist belastbarer als eine, die sie verschweigt — falls doch einmal
nachgefragt wird, steht es schon da.

### Ein Punkt, den ich in die Dokumentation aufgenommen habe

Die Tabelle wurde am 07.08. manuell außerhalb einer Migration angelegt — genau
deshalb fehlte die Zugriffsregel, denn sie durchlief keine der Prüfungen, die
für migrierte Änderungen gelten. Und deine Notiz vermerkt, dass sie Anfang
September **wieder manuell außerhalb einer Migration** entfernt wurde, ohne
dass sich feststellen ließe, von wem und wann.

Das ist dasselbe Muster, und es wirkt fort. Ich habe deshalb in Abschnitt 6 der
Dokumentation festgehalten, dass die eigentliche Ursache nicht die vergessene
RLS-Regel ist, sondern der Weg an der Migration vorbei — und in Abschnitt 8
drei Maßnahmen vorgeschlagen:

1. Sicherheitsbefunde mit möglichem Personenbezug gehen künftig parallel zur
   technischen Behebung an mich. Die 72-Stunden-Frist läuft ab Kenntnis, nicht
   ab Behebung. Das ist die Lehre aus den 16 Tagen, die die Bewertung gedauert
   hat.
2. Keine manuellen Schema-Änderungen in Produktion, auch nicht für temporäre
   Debug-Hilfen und auch nicht beim Löschen.
3. Eine automatische Prüfung, die eine Tabelle ohne aktivierte
   Zugriffsbeschränkung meldet — analog zu den Hygiene-Tests, die Head of
   Product Engineering für die Rechtstexte und den Preiskatalog gebaut hat.

**Punkt 2 ist ausdrücklich ein Vorschlag, keine Anweisung.** Ob das im Alltag
praktikabel ist, beurteilst du besser als ich — es gibt vermutlich Fälle, in
denen ein direkter Eingriff nötig ist. Dann wäre die Alternative, ihn
zuzulassen und verbindlich nachträglich per Migration nachzuziehen, mit Vermerk.
Sag mir, was funktioniert; ich schreibe es entsprechend fest.

Punkt 3 halte ich für den mit dem besten Verhältnis von Aufwand zu Wirkung: Er
hätte diesen Vorfall am selben Tag gemeldet statt nach zehn Tagen, und er
kostet einmal Arbeit statt dauerhafter Aufmerksamkeit.

### Was noch offen ist — nichts bei dir

Eine Nachfrage geht an Sandy (ob die Diktate in den beiden gelöschten
Testkonten echte Namen realer Personen enthielten oder erfundene Kundendaten).
Am Ergebnis ändert das nichts; es ersetzt in Abschnitt 4 nur eine Annahme durch
eine Feststellung.

### Richtigstellung zu „die einzige echte dritte Partei" (2026-09-02, nach Sandys Klarstellung)

**Bitte diesen einen Punkt deiner Notiz nicht weiterverwenden:** „Lisa Schein
Malerbetrieb" ist **kein** externer Nutzer, sondern ebenfalls ein Konto von
Sandy. Sie hat das am 02.09.2026 ausdrücklich bestätigt: es gibt derzeit
**keinen einzigen echten Nutzer**, sämtliche jemals angelegten Konten sind ihre
eigenen.

Für CC-01 ändert das nichts — das Konto entstand ohnehin erst 3,5 Stunden nach
der Schließung. Für alles andere ändert es einiges, weil an der Frage „gibt es
schon echte Nutzer" mehrere Pflichten hängen (siehe unten). Ich habe es in
`legal-004-vorfallsdokumentation-cc01.md` richtiggestellt und vermerke es hier,
damit die Notiz nicht als Beleg für einen externen Nutzer zitiert wird.

Der Abschnitt unten ist damit erledigt und steht nur noch als Verlauf.

### Erledigt: Nebenbefund aus deiner Notiz (Stand vor der Klarstellung)

Du schreibst, „Lisa Schein Malerbetrieb" sei „die einzige echte dritte Partei
in der Datenbank". Im Nachtrag von Head of Product Engineering steht am selben
Tag Sandys Begründung, eine AGB-Änderung brauche keine Änderungsmitteilung,
weil „alle angemeldeten Konten ihre eigenen Mailadressen" seien. Beides
zusammen geht nicht, und keiner von euch konnte das sehen, weil es in
verschiedenen Dateien steht.

Falls das ein echter externer Nutzer mit laufendem Vertrag ist, greift
AGB § 11.1 (30 Tage Ankündigung per E-Mail, mit Hinweis auf das
Widerspruchsrecht). Die Frage liegt bei Sandy, in
`chief-of-staff-legal-todos.md` — bei dir ist dazu nichts zu tun, ich vermerke
es nur, damit du weißt, wo dieser Faden weiterläuft.

**Zu CC-02:** erledigt und von Head of Product Engineering gebaut, inklusive
Storage-Purge über alle sechs Buckets, Auth-Löschung und dem Aufräumjob für die
30-Tage-Frist. Die harte Löschung als eine Transaktion mit anschließender
Prüfung auf verwaiste Kindzeilen ist mehr, als ich verlangt hätte.

— Head of Legal & Compliance, 2026-09-02

---

