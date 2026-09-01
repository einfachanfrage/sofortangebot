# Chief of Staff ↔ Head of Legal & Compliance — Koordinations-Todos

Gemeinsame Datei von Chief of Staff und Head of Legal & Compliance (neue
Stelle seit 01.09.2026 — siehe `docs/team-organigramm.md`). Hier landen alle
Themen aus: Datenschutz (DSGVO/TTDSG), AGB/Nutzungsbedingungen, Impressum,
Haftungsausschlüsse, KI-Kennzeichnungs-/Transparenzpflichten, sowie
Gewerke-/Baurecht für die Angebotserstellung (VOB, DIN-Normen für Maler-/
Bodenlegerarbeiten, rechtssichere Pflichtangaben auf Angeboten, Prüfung der
bestehenden Zuschlags-/Abzugs-Logik).

**Ablauf:** Chief of Staff trägt neue Punkte ein, sobald sie entstehen.
Head of Legal & Compliance trägt nach Erledigung ein kurzes **Fix-Update**
direkt unter dem jeweiligen Punkt ein. Status-Zeile danach aktualisieren.

Jeder Punkt hat eine feste ID (CoS-L-XXX).

**Status-Zeichen:** ✅ erledigt & geprüft · 🟡 erledigt, noch nicht
nachgeprüft · ❌ offen · 🔵 Entscheidung von Sandy nötig · ⏳ wartet auf
Vorbedingung.

**Wichtige Governance-Regel:** Formulierungen mit echtem rechtlichem Risiko
(AGB-Text, Datenschutzerklärung, Positionierungsfragen wie „müssen wir
KI-Nutzung gegenüber Endkunden offenlegen") sind am Ende eine
Risikobereitschafts-/Positionierungs-Entscheidung — die trifft nur Sandy
(siehe `docs/team-organigramm.md`, Abschnitt Sandy). Head of Legal &
Compliance darf und soll eigene Einschätzungen und Formulierungsvorschläge
liefern, nichts geht ohne Sandys ausdrückliche Freigabe live. Entscheidungen,
die auf Sandy warten, bitte zusätzlich kurz in
`docs/entscheidungen-fuer-sandy.md` eintragen (Chief of Staff übernimmt das
in der Regel).

**Datei-Sicherheit:** Bei gleichzeitiger Bearbeitung von `docs/`-Dateien kam
es im Projekt bereits mehrfach zu Speicherfehlern. Bitte neue Einträge wenn
möglich ans Dateiende anhängen statt mitten in bestehende Abschnitte zu
schreiben. Voller Hintergrund: CoS-013 in `chief-of-staff-todos.md`.

## Stand auf einen Blick (angelegt: 2026-09-01)

| ID | Thema | Status | Quelle |
|---|---|---|---|
| CoS-L-001 | Erstauftrag: Bestandsaufnahme + Lückenanalyse (Datenschutz, AGB, KI-Kennzeichnung, Gewerke-Recht) | 🟡 Bericht liegt vor (`docs/legal-001-bestandsaufnahme.md`), 8 Gate-1-Punkte + 4 Entscheidungen für Sandy (S-1 bis S-4) — noch nichts umgesetzt | Sandy direkt im Chat, 2026-09-01 |

---

## CoS-L-001 — Erstauftrag: Bestandsaufnahme + Lückenanalyse

**Datum:** 2026-09-01
**Status:** 🟡 Bericht erstellt (2026-09-01), Umsetzung offen — Fix-Update am Dateiende

**Hintergrund:** Sandy hat diese Position dringend angefragt, weil bisher
niemand im Team juristisches Fachwissen hat — weder für die SaaS-rechtliche
Seite (Datenschutz, AGB, KI-Kennzeichnung) noch für die Gewerke-rechtliche
Seite (VOB/DIN, was auf einem Angebot stehen muss, welche Zuschläge/Abzüge
üblich und zulässig sind). Volle Rollenbeschreibung: siehe
`docs/team-organigramm.md`, Abschnitt „Head of Legal & Compliance".

**Konkrete Bitte, zwei Teile:**

**Teil A — SaaS-/Digitalrecht, Bestandsaufnahme:**
1. Prüfen, was an Datenschutzerklärung/AGB/Impressum aktuell überhaupt
   existiert (Stand vermutlich: nichts oder sehr rudimentär — bitte
   verifizieren, z. B. bei Head of Product Engineering/Platform &
   Integrations Engineer erfragen, was auf der Landingpage/im Produkt
   bereits hinterlegt ist).
2. Lücken konkret benennen: was fehlt zwingend vor dem ersten echten
   Testnutzer (Gate 1), was kann bis zum Launch warten.
3. Einschätzung: wo genau muss auf KI-Einsatz hingewiesen werden (Produkt
   selbst? Landingpage? Beides? Gegenüber den Endkunden der Handwerker, die
   das generierte Angebot nie selbst in der App sehen?) — das ist eine
   offene rechtliche Einschätzungsfrage, nicht vorausgesetzt.
4. Einschätzung Haftungsrisiko bei KI-Rechenfehlern (falsche m²/lfm-
   Berechnung führt zu falschem Angebotspreis) — wie weit trägt ein
   Disclaimer, was nicht.

**Teil B — Gewerke-/Baurecht, Bestandsaufnahme:**
5. Rechtliche Prüfung der bestehenden Übermessungsregel (VOB-Regel für
   Maler-Wandflächen, kleine Öffnungen bis 2,5 m² nicht abziehen) — bisher
   nur fachlich-praktisch von Sandy bestätigt (siehe
   `docs/pruefmeister-testfaelle.md`, Abschnitt „VOB-Übermessungsregel für
   Anstricharbeiten"), nicht juristisch geprüft.
6. Rechtliche Prüfung des bestehenden Zuschlags-/Abzugs-Katalogs
   (Erschwerniszuschlag Handabbruch, schwierige Zufahrt, Höhenzuschlag
   u. a. — siehe `docs/pruefmeister-testfaelle.md` und
   `docs/entscheidungen-fuer-sandy.md`) gegen VOB/branchenübliche Praxis.
7. Klären, welche Pflichtangaben ein rechtssicheres Angebot für Maler-/
   Bodenlegerarbeiten braucht (Gültigkeitsdauer, Zahlungsbedingungen,
   Gewährleistung/Mängelansprüche-Hinweise, ggf. Verbraucher-
   Widerrufsbelehrung, falls der Endkunde des Handwerkers Verbraucher ist)
   und mit dem aktuellen Angebots-PDF abgleichen (mit Head of Product
   Engineering/Product Designer klären, was aktuell drauf steht).
8. **Offene Klärung mit Sandy:** Sandy nannte „GOB-Regelungen" als Beispiel
   im ursprünglichen Auftrag — vermutlich VOB gemeint (im Projekt bereits
   mehrfach referenziert), aber nicht sicher. Bitte zuerst mit Sandy/Chief
   of Staff klären, falls etwas anderes gemeint war.

**Ergebnis, das gebraucht wird:** Ein klar strukturierter Bericht (nicht nur
Kritik, auch was schon passt) mit Lücken, Risiko-Einschätzung und konkretem
Vorschlag für die Reihenfolge — Chief of Staff bündelt die Punkte, die
Sandys Freigabe brauchen, danach in `docs/entscheidungen-fuer-sandy.md`.

---

## Fix-Update CoS-L-001 — Bestandsaufnahme abgeschlossen (Head of Legal & Compliance, 2026-09-01)

**Voller Bericht: `docs/legal-001-bestandsaufnahme.md`.** Hier nur das
Wesentliche, damit der Chief of Staff weiterarbeiten kann.

**Die Grundannahme des Auftrags war falsch.** Es ist nicht „nichts oder sehr
rudimentär" da: Impressum, Datenschutzerklärung (9 Abschnitte), AGB (12 §§,
versioniert `2026-06`), eine AVV-Seite nach Art. 28 DSGVO, Cookie-Banner,
AGB-Update-Modal, Widerrufsbelehrung nach amtlichem Muster samt Musterformular
sowie ein Angebots-PDF mit Bindefrist, Zahlungsziel, Skonto, § 19 UStG,
§ 650 BGB und Netto/Brutto-Umschaltung nach Kundentyp sind live. Das ist mehr,
als die meisten Solo-SaaS an dieser Stelle haben.

**Das Problem ist nicht fehlende Textmenge, sondern Widersprüche.** AGB,
AVV-Seite, Datenschutzerklärung und Landingpage sagen an drei Stellen
Unterschiedliches über denselben Sachverhalt — und der Gegenbeweis liegt jeweils
auf unserer eigenen Website. Genau das wird abgemahnt.

**Die acht Gate-1-Punkte (vor dem ersten echten Testnutzer):**

1. **G1** — Datenschutzerklärung: **OpenAI und Sentry fehlen** als
   Auftragsverarbeiter. Unsere eigene AVV-Seite listet OpenAI, Sentry ist über
   `withSentryConfig` aktiv. Art. 13 Abs. 1 lit. e DSGVO. (30 Min)
2. **G2** — FAQ „Alles liegt auf Servern in Deutschland … kein Teilen mit
   Dritten. DSGVO-konform." ist durch unsere eigene AVV-Liste mit sechs
   Unterauftragnehmern widerlegt. § 5 UWG. (20 Min)
3. **G3** — FAQ „Fenster und Türen abgezogen" beschreibt das Produkt seit der
   Übermessungs-Entscheidung vom 21.08. falsch. § 5 UWG. (15 Min)
4. **G4** — Die Registrierung fragt die **Unternehmereigenschaft nicht ab**.
   AGB § 1.2 schließt Verbraucher aus, aber das ist objektiv zu bestimmen und
   nicht per Klausel herbeizuschreiben. Rutscht ein Verbraucher rein, greifen
   §§ 312g (Widerruf), 312j Abs. 3 (Button-Lösung — ohne sie kommt der Vertrag
   gar nicht zustande) und 312k BGB (Kündigungsbutton). Eine Checkbox löst das.
   (1 Std)
5. **G5** — Der Übermessungshinweis fehlt auf dem **Kunden-PDF**.
   `vobHinweistext()` erzeugt den richtigen Satz, er landet aber in `annahmen`
   und damit nur in `AngebotDetail.tsx`. Der Endkunde sieht „50,00 m²", misst
   46,64 m² nach und bekommt keine Erklärung. (2 Std)
6. **G6** — Die Widerrufsbelehrung nennt den Wertersatz, aber es fehlt das
   Feld, in dem der Kunde den vorzeitigen Beginn ausdrücklich verlangt
   (§ 357a Abs. 2 BGB). Ohne das: Handwerker arbeitet, Kunde widerruft,
   Handwerker bekommt **nichts**. (2 Std)
7. **G7** — OS-Plattform-Absatz aus dem Impressum löschen; die Plattform wurde
   zum 20.07.2025 eingestellt (VO (EU) 2024/3228). Abmahnrisiko. (5 Min)
8. **G8** — § 5 TMG → **§ 5 DDG**, § 25 TTDSG → **§ 25 TDDDG**, §§ 7–10 TMG
   anpassen (Haftungsprivilegien stehen im Kern jetzt in Art. 4–6 DSA). Wird
   automatisiert abgemahnt. (30 Min)

G1–G3, G7 und G8 sind zusammen unter zwei Stunden reine Textarbeit.

**Zu Teil A Punkt 4 (Haftung bei KI-Rechenfehlern), Kurzfassung:** Der aktuelle
Disclaimer trägt **schlechter** als ein engerer es täte. AGB § 9.3 schließt
Haftung für KI-Fehler pauschal aus, widerspricht damit § 9.1 und fällt nach
§ 307 BGB im Zweifel **ganz** weg — eine geltungserhaltende Reduktion auf den
zulässigen Kern gibt es nicht. Dazu: richtiges Rechnen ist bei einem
Kalkulationswerkzeug plausibel die Kardinalpflicht selbst, und Werbesprache wie
„berechnet, nicht geschätzt" kann als Garantie gelesen werden, die jede
Haftungsbegrenzung aushebelt. Wirksamer als jede Klausel sind drei Dinge:
(1) das Freigabe-Ereignis beim Versenden protokollieren — macht aus der
Prüfpflicht in § 10.2 einen Beweis und aus § 254 BGB ein tragfähiges Argument;
(2) Vermögensschaden-Haftpflicht; (3) Rechtsform. Sandy haftet aktuell als
Einzelunternehmerin **persönlich und unbeschränkt** — bei einem systematischen
Rechenfehler über viele Betriebe ist das existenziell.

**Zu Teil B Punkt 5 (Übermessungsregel):** Die Umsetzung in
`vob-uebermessung.ts` ist fachlich sauber (Einzelprüfung je Öffnung, korrekte
DIN-Systematik). Rechtlich ist die Frage nicht „darf man so rechnen" (ja,
branchenüblich), sondern „gilt das gegenüber dem Endkunden" — und da gilt
VOB/C **nicht kraft Gesetzes**, sie muss einbezogen werden (§ 305 Abs. 2 BGB).
Gegenüber Verbrauchern gibt es zudem Rechtsprechung, die die Übermessung nach
§ 307 BGB kippt (berichtet: OLG Stuttgart 21.02.2008, 2 U 84/07 — Aktenzeichen
und Gegenstand bestätigt, **Volltext nicht eingesehen**, vor Verwendung
anwaltlich gegenprüfen). Die „Normgrundlagen"-Zeile im PDF (7 pt, `#BBBBBB`)
ist als Einbeziehung untauglich. Lösung: Klartextzeile in der Position (G5),
Fußtext-Baustein zur Einbeziehung, und als strukturell saubersten Ausweg ein
Pauschalfestpreis-Modus für Verbraucherangebote — dann ist die Übermessung
reine interne Kalkulation. Letzteres bitte mit Head of Product Engineering und
Product Designer besprechen.

**Zu Teil B Punkt 6 (Zuschlagskatalog):** Rechtlich unbedenklich, die
Zuschlagsarten bilden die anerkannten Erschwernistatbestände ab, und Zuschläge
sind frei kalkulierbar (keine verbindliche Preisverordnung im Bauhandwerk).
**Ein konkreter Fund, größer als zunächst gedacht:** **14 Katalogeinträge über
neun Gewerke** tragen einen Prozentsatz im Titel, aber eine Euro-Pauschale im
Preis — durchgehend nach demselben Muster (`unit_price` == die Zahl aus dem
Titel). Beispiele: `Zuschlag Wochenend-/Feiertagsarbeit (25%)` mit
`unit: 'Pauschale'` und `unit_price: 25.00` in sechs Gewerken; Elektro 50 %;
`Zuschlag Notdienst (…, 100%)` bei SHK und Elektro mit 100,00 €; Denkmalschutz
30 %/35 % bei Putz, Schreiner und Dach. Auf dem Kundenangebot verspricht der
Titel 25 % und berechnet werden 25 €; bei einem 3.000-€-Auftrag ist das der
Unterschied zwischen 750 € und 25 €, und § 305c Abs. 2 BGB legt Zweifel zulasten
des Verwenders aus. Beim Notdienst-Zuschlag ist es am krassesten: der Titel
verspricht Verdopplung, berechnet werden 100 €. Das ist derselbe Einheiten-Bug,
den Head of Product Engineering am 31.08. für die fünf Maler-Erschwerniszuschläge
schon behoben hat — er ist nur breiter, als damals angenommen. Wegen des
regelmäßigen Musters sollte eine Migration reichen.

**Zu Teil B Punkt 8 („GOB"):** Ich habe keine passende Regelungsmaterie „GOB"
gefunden und auf **VOB** gearbeitet — alles im Projekt Referenzierte ist VOB.
Denkbare Verwechslung wären die **GoBD** (elektronische Buchführung und
Aufbewahrung); die wären relevant, aber als Steuer-/Archivthema für Finance,
nicht für die Gewerke-Seite. **Bitte kurz bei Sandy rückfragen.**

**Vier Punkte für `docs/entscheidungen-fuer-sandy.md`** (Chief of Staff, bitte
übernehmen — Details und Formulierungsvorschläge im Bericht):

- **S-1** — Freigabe der korrigierten FAQ-Texte (G2, G3). *Meine Empfehlung: ja.*
- **S-2** — Freigabe der beiden neuen Endkunden-Texte im Angebots-PDF:
  Übermessungshinweis (G5) und Wertersatz-Erklärung (G6). *Meine Empfehlung: ja,
  beide — der Übermessungshinweis ist verkaufsfördernd, nicht defensiv.*
- **S-3** — **Positionierung KI-Kennzeichnung gegenüber dem Endkunden des
  Handwerkers.** *Meine Empfehlung: nein.* Keine Rechtsgrundlage — das Angebot
  ist die eigene Willenserklärung des Handwerkers, er macht es sich durch
  Prüfung und Unterschrift zu eigen. Ein „KI-generiert"-Vermerk würde die
  Verbindlichkeit schwächen und ein Risiko schaffen, das ohne ihn nicht besteht.
  KI-Transparenz gehört zum Handwerker (Landingpage, Produkt, AGB), nicht auf
  sein Angebot. **Wichtig für die Terminplanung: Art. 50 AI Act gilt seit dem
  02.08.2026, also bereits — keine Zukunftsfrage.** Die Kennzeichnungspflicht
  für synthetische Inhalte (Abs. 2) erfasst ausdrücklich auch Text; ich halte
  sie hier für wahrscheinlich nicht einschlägig (die Zahlen entstehen
  deterministisch in unserer eigenen Engine, nicht im Modell), aber das ist der
  eine Punkt, bei dem ich zusätzlich anwaltliche Bestätigung empfehle, weil ein
  Irrtum bußgeldbewehrt ist.
- **S-4** — **Rechtsform (UG/GmbH) und Vermögensschaden-Haftpflicht** vor dem
  ersten zahlenden Kunden. *Meine Empfehlung: beides ja.* Kein Rechtsthema im
  engeren Sinn, aber kein Disclaimer ändert etwas an der persönlichen Haftung.

**Weitergegeben an andere Rollen** (Details im Bericht): Head of Product
Engineering — G5, G6, Zuschlags-Einheiten, Kündigungsmöglichkeit im Produkt
(die FAQ verspricht sie, ich habe sie im Code nicht gefunden), und als
wichtigste Einzelmaßnahme das Protokollieren des Freigabe-Ereignisses.
Product Designer — KI-Hinweis an der Freigabestelle im Entwurf,
Registrierungs-Checkbox. Platform & Integrations Engineering — Bestätigung der
TOM-Zusagen der AVV-Seite (AES-256, tägliche Backups) und vollständige Liste
aller Dienste, die Daten sehen.

**Was gut ist, nicht nur was fehlt:** Die AVV-Seite ist für diese
Unternehmensgröße überdurchschnittlich. Die Netto/Brutto-Umschaltung nach
Kundentyp macht etablierte Handwerkersoftware oft falsch. Der § 650-BGB-Hinweis
beim Kostenvoranschlag und die Baustellenfotos als Zustandsdokumentation sind
eigenständig klug. Und `pruefmeister-testfaelle.md` ist das wertvollste
Compliance-Asset im Projekt — mit der Kehrseite, dass dokumentierte und
trotzdem ausgelieferte Funde schwerer wiegen als nie bemerkte. Deshalb: bekannte
Funde vor dem Live-Gang schließen oder bewusst und schriftlich akzeptieren.

**Hinweis zur Datei-Sicherung:** Neu angelegt wurde
`docs/legal-001-bestandsaufnahme.md`, geändert wurde diese Datei (Statuszeile
oben plus dieses Fix-Update). Beides mit `docs-sichern.mjs` committet.

**Status:** 🟡 Bericht vollständig, nichts davon umgesetzt. Nächster Schritt:
Chief of Staff bündelt S-1 bis S-4 für Sandy; parallel können G1–G3, G7 und G8
sofort laufen (unter zwei Stunden Textarbeit, keine Entscheidung nötig).

---

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
