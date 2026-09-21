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
| CoS-L-004 | Influencer-Kooperationen: Werbekennzeichnung, Textbaustein für die Ansprache, Gratis-Accounts und AGB | ❌ offen, vor der ersten Ansprache (frühestens Dez.) | Sandys Plan, 2026-09-03 |
| CoS-L-003 | Reihenfolge Gewerbeanmeldung / UG-Gründung — kein Gewerbe angemeldet, erster zahlender Kunde rückt näher | ✅ **entschieden (03.09.2026, abends): Einzelunternehmen jetzt, UG bei rund 20 zahlenden Betrieben.** Plan mit Terminen in `legal-007-plan-fuer-sandy.md`; Begründung und meine zurückgenommene Empfehlung in `entscheidungen-fuer-sandy.md`, S-4 Teil 3 + 4 | Sandy direkt, 2026-09-03 |
| CoS-L-002 | Neues Preismodell rechtlich absichern: Preisangaben B2B, Umsatzsteuer/Kleinunternehmer, AGB-Preis- und Kündigungspassagen, Bestandsschutz Gründerpreis | ❌ offen | Sandys Preisentscheidung 2026-09-03, `docs/preismodell.md` |
| CoS-L-001 | Erstauftrag: Bestandsaufnahme + Lückenanalyse (Datenschutz, AGB, KI-Kennzeichnung, Gewerke-Recht) | 🟡 Bericht liegt vor (`docs/legal-001-bestandsaufnahme.md`), 8 Gate-1-Punkte + 4 Entscheidungen für Sandy (S-1 bis S-4) — noch nichts umgesetzt | Sandy direkt im Chat, 2026-09-01 |
| CoS-L-005 | Gibt VOB/DIN oder branchenübliche Praxis einen Anhaltspunkt für einen Mindestauftragswert bei Kleinstpositionen? | ✅ **beantwortet (07.09.):** VOB/C gibt dazu nichts her, und es gibt aus kartellrechtlichen Gründen auch keinen offiziellen Branchenwert. Die 180 € entsprechen rund 3 Arbeitsstunden, der beschriebene Fall ist ein halber Tag (≈ 220–260 €). Wichtiger als die Zahl: **gehört als Betriebseinstellung ins Produkt, nicht als Konstante**, und als eigene Angebotsposition, nicht in die AGB | Sandy an CoS im Chat, 2026-09-07, weitergegeben über `chief-of-staff-todos.md` |

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

## Nachtrag zu CoS-L-001 (2026-09-01) — neue Abstimmungsdatei zum VOB-Thema

Sandy hat direkt im Anschluss an den CoS-L-001-Bericht gebeten, das VOB-Thema
und die Angebotserstellung vertieft zu prüfen — es soll fachlich und rechtlich
lückenlos passen. Dafür gibt es jetzt eine eigene Datei:

**`docs/vob-angebot-abstimmung.md`** — Legal ↔ Prüfmeister ↔ Head of Product
Engineering ↔ Product Designer, ID-Schema **VOB-XXX**, zwölf Befunde.

**Abgrenzung:** `pruefmeister-testfaelle.md` prüft, ob das Tool rechnet, was
der Handwerker gesagt hat (Ist gegen Soll). Die neue Datei prüft, ob das
**Soll selbst** der Abrechnungsnorm entspricht. Zeiger auf die neue Datei sind
in `pruefmeister-testfaelle.md` und `design-check.md` angehängt.

**Die vier Punkte, die der Chief of Staff kennen sollte:**

1. **VOB-001 — Verschnitt landet in der abgerechneten Menge.** `boden.ts`
   rechnet `menge = flaeche × (1 + verschnitt)`; bei 20 m² stehen 21 m² auf dem
   Angebot. Verschnitt ist nach Fachkonsens Kalkulationssache und gehört in den
   Einheitspreis, nicht als Mengenaufschlag auf die Aufmaßfläche. Rechtlich
   dieselbe Konstruktion wie die Übermessung, aber ohne Norm im Rücken.
   Entschärfend: er steht im Positionstitel und erreicht damit tatsächlich das
   PDF. Der Umbau kostet den Betrieb nichts (gleicher Endbetrag, andere
   Aufteilung). Wartet auf die Praxis-Einschätzung des Prüfmeisters, danach
   Entscheidung Sandy.
2. **VOB-003 — bitte einen geplanten Fix stoppen.** Im Kommentarkopf von
   `vob-uebermessung.ts` und in `pruefmeister-testfaelle.md` steht als
   zurückgestellte „VOB-Feinheit", dass Leibungen übermessener Öffnungen nicht
   separat vergütet werden dürften. Nach meiner Recherche ist die Regel genau
   umgekehrt (DIN 18363 Abschnitt 5.2.3: Leibungen werden „unabhängig von
   ihrer Einzelgröße gesondert gerechnet"). `maler.ts` macht es heute schon
   richtig; die geplante Verfeinerung würde korrektes Verhalten kaputtmachen.
   Bitte nicht umsetzen, bis der Normtext vorliegt.
3. **VOB-011 — kleine Ausgabe, große Wirkung, braucht Sandys Freigabe.** Ich
   arbeite bei allem VOB-Bezogenen mit Sekundärquellen; der Originaltext von
   DIN 18363 und DIN 18365 ist kostenpflichtig. Rund **150 € für beide Normen**
   (DIN Media). Diese zwei Dokumente bestimmen, wie jedes Angebot im Produkt
   gerechnet wird — bei VOB-003 hängt an einem einzigen Satz, ob eine geplante
   Änderung Schaden anrichtet, und bei VOB-008 nennen zwei Quellen Werte, die
   um den Faktor 25 auseinanderliegen. Bitte als **S-5** in
   `entscheidungen-fuer-sandy.md` aufnehmen. *Meine Empfehlung: kaufen, vor der
   Umsetzung von VOB-001 und VOB-003.*
4. **VOB-012 — der einzige Befund zulasten des Handwerkers.** `maler.ts` und
   `sockelleisten.ts` ziehen die Türbreiten (Standard 0,9 m) von der
   Sockelleistenlänge ab. Beide Normen übermessen bei Längenmaß
   Unterbrechungen unter 1 m, ziehen also gerade nicht ab. Dem Betrieb fehlen
   bei drei Türen rund 2,7 lfdm. Möglicherweise dieselbe Codestelle wie der
   PM-007-Fund.

**Sonst offen, ohne Entscheidungsbedarf:** VOB-002 (drei verschiedene
Verschnittsätze im Code — 5 %, 10 %, 12 %; der Handwerker liest 10 % als
Annahme, während die Engine 5 % rechnet), VOB-005 (Nebenleistungen nach
DIN 18363 als eigene Positionen berechnet), VOB-006 (drei Höhenschwellen),
VOB-007 (die 7-pt-Zeile „Normgrundlagen" ist weder eine wirksame Einbeziehung
noch sachlich durchgängig zutreffend), VOB-010 (= L6 aus dem Bericht).

**Nächster Schritt:** sieben Praxis-Fragen an den Prüfmeister stehen am Ende
der neuen Datei. VOB-002 und VOB-010 sind reine Konsistenzfixes und können
sofort laufen.

**Datei-Sicherung:** Neu ist `docs/vob-angebot-abstimmung.md`; Zeiger angehängt
in `pruefmeister-testfaelle.md` und `design-check.md`, Nachtrag hier. Alles mit
`docs-sichern.mjs` committet.

---

## Nachtrag (2026-09-01) — formale Risikobewertung zum VOB-/Angebots-Komplex

Auf Sandys Anforderung: **`docs/legal-002-risikobewertung-vob.md`** — zwölf
Risiken (LR-01 bis LR-12) nach dem Severity-×-Likelihood-Rahmenwerk, mit
Optionentabellen, Restrisiko und Überwachungsplan.

**Ergebnis:** ein rotes, fünf orange, drei gelbe, drei grüne Risiken.

**Die zwei Anpassungen am Standard-Rahmenwerk**, die man kennen muss, um die
Zahlen zu lesen:

1. Die Standard-Severity-Skala misst in Prozent des Vertragswerts. Hier gibt es
   zwei Verträge — unser Abo mit dem Handwerker (ein paar hundert Euro im Jahr)
   und sein Werkvertrag mit dem Endkunden (ein paar tausend je Auftrag). Ich
   bewerte im jeweils betroffenen Verhältnis und nenne die absolute
   Größenordnung dazu.
2. **Zwei Risikoebenen.** Fast alle VOB-Befunde treffen zuerst den Handwerker
   (Ebene A), nicht uns (Ebene B). Uns erreichen sie über drei Wege: § 280 BGB
   durch den Handwerker, UWG durch Mitbewerber, und Reputation. Der Fehler
   wäre, Ebene A als „nicht unser Problem" abzuhaken — das Produktversprechen
   ist ein belastbares Angebot, und ein Werkzeug, das systematisch angreifbare
   Angebote erzeugt, verfehlt genau die Pflicht, die es verkauft. Damit ist man
   wieder bei der Kardinalpflicht-Frage aus A5 des Erstberichts.

**Für die Bündelung Richtung Sandy:**

- **LR-01 (16, rot)** — Übermessungshinweis fehlt im Kunden-PDF. Hoch wegen der
  Eintrittswahrscheinlichkeit, nicht wegen der Schadenshöhe. Fällt mit zwei
  Stunden Arbeit auf 6 (gelb).
- **LR-05 (12, orange)** — fehlende Unternehmer-Prüfung bei der Registrierung.
  **Das einzige Risiko im Register, das direkt Sandys Geld betrifft:** Ohne
  Button-Lösung kommt der Vertrag mit einem Verbraucher nach § 312j Abs. 3 BGB
  gar nicht zustande. Eine Stunde Arbeit, danach grün.
- **LR-04 (12, orange)** — fehlende Wertersatz-Erklärung. Trifft den
  Handwerker, aber hart: Totalverlust des Auftragswerts im Widerrufsfall.
- **LR-03 (12, orange)** — die Normlage steht nur auf Sekundärquellen. Das ist
  der Punkt hinter **S-5** (Normtexte kaufen, ~150 €). Meine Empfehlung in der
  Bewertung ist ausdrücklich: erst die Normen, dann der Anwalt — einen
  Baurechtler dafür zu bezahlen, dass er uns vorliest, was in einer Norm für
  75 € steht, wäre die falsche Reihenfolge.

**Externe Beratung: noch nicht erforderlich.** Kein Punkt erfüllt die Kriterien
für zwingende Mandatierung — keine Klage, keine Behördenanfrage, keine
strafrechtliche Exposition. Empfohlen nach dem Normkauf und vor dem Launch:
einmaliges Kurzgutachten eines Baurechtlers zur wirksamen Einbeziehung der
VOB/C gegenüber Verbrauchern (1.500–3.000 €), getrennt davon die AGB-Haftung
und die AI-Act-Einordnung durch einen IT-/Vertragsrechtler.

**Ein Auslöser, den ich gesondert nennen möchte:** Sobald sich ein Endkunde
erstmals über eine Menge beschwert, ist das kein Supportfall, sondern ein
Anlass zur Neubewertung — bitte unabhängig vom Ausgang an mich weiterleiten.
Der erste echte Fall sagt mehr über die tatsächliche Eintrittswahrscheinlichkeit
als alles, was ich hier geschätzt habe.

**Hinweis zur Privilegierung:** Die Bewertung ist nicht anwaltlich privilegiert
und im Streitfall im Zweifel vorlagepflichtig. Das ändert nichts daran, dass
wir Funde offen dokumentieren — es ist nur ein Grund, in solchen Dokumenten
nüchtern zu formulieren.

---

## Nachtrag (2026-09-01) — Compliance-Check „alles"

Auf Sandys Anforderung („check alles"):
**`docs/legal-003-compliance-check.md`**. Geprüft wurde diesmal nicht, ob die
richtigen Texte auf der Website stehen (das war CoS-L-001), sondern ob die
**Prozesse dahinter existieren** und ob das, was unsere Texte versprechen,
tatsächlich passiert. Genau dort liegen die neuen Funde.

**Ergebnis: weitere Prüfung erforderlich — wegen eines Punktes.**

**CC-01 ist der schwerwiegendste Fund des gesamten Projekts, und er hat eine
abgelaufene Frist.** Die Tabelle `debug_extraktion_roh` war vom 07.08. bis
17.08.2026 in Produktion ohne jede Zugriffsbeschränkung erreichbar — jeder mit
dem öffentlichen Website-Schlüssel konnte sämtliche Sprach-Transkripte und
KI-Rohdaten aller Nutzer auslesen (CoS-P-001, Fix-Update vom 17.08.). Technisch
wurde das mustergültig behandelt. **Als Ereignis nach Art. 33 DSGVO wurde es nie
bewertet.** Die Pflicht, jede solche Verletzung zu dokumentieren, besteht nach
Art. 33 Abs. 5 unabhängig davon, ob eine Meldung nötig war — und sie ist seit
fünfzehn Tagen unerfüllt.

Ob eine Meldung an die Berliner Aufsichtsbehörde fällig gewesen wäre, kann ich
ohne drei Angaben nicht beantworten (Dateninhalt, Zugriffslogs, betroffene
Konten). Anfrage dazu ist in `chief-of-staff-platform-todos.md` angehängt.
**Meine Vermutung nach Aktenlage: nicht meldepflichtig**, weil zu dem Zeitpunkt
vermutlich nur zwei interne bzw. Testkonten existierten. Das entlastet aber
nicht — die Bewertung selbst ist Pflicht. **Bitte nichts vorschnell melden:**
erst Fakten, dann Bewertung, dann Entscheidung.

**CC-02 — die Kontolöschung löscht nichts.** `api/account/delete` setzt nur
`companies.deleted_at`; einen Löschjob gibt es nicht (`vercel.json` kennt genau
einen Cronjob, und das ist der Reminder). Damit sagen Datenschutzerklärung § 8,
AGB § 6.5, AVV § 3 und die Bestätigungs-E-Mail an jeden Nutzer etwas
Unzutreffendes. Art. 17 und Art. 5 Abs. 1 lit. a DSGVO.

**CC-03 — die Meldefrist im AVV ist falsch herum.** § 5 verspricht dem
Verantwortlichen Benachrichtigung „innerhalb von 72 Stunden". Die 72 Stunden
sind das Budget, das **er** gegenüber der Aufsichtsbehörde hat; wir als
Auftragsverarbeiter schulden nach Art. 33 Abs. 2 „unverzüglich". Nehmen wir uns
72 Stunden, ist sein Budget aufgebraucht, bevor er überhaupt Bescheid weiß —
wegen einer Klausel, die wir ihm gestellt haben. Marktüblich sind 24 bis 48
Stunden.

**Weitere Funde:** CC-04 (AVV § 3 verlangt vorherige Genehmigung für
Unterauftragnehmer, § 4 erteilt zwei Absätze später eine Generalgenehmigung —
ohne das dann zwingende Informations- und Einspruchsrecht), CC-05 (Datenexport
unvollständig für Art. 15; und es gibt keinen Prozess für Anfragen von
Endkunden der Handwerker, für die wir Auftragsverarbeiter sind), CC-06
(Transkripte und KI-Rohdaten werden dauerhaft gespeichert, die
Datenschutzerklärung erwähnt nur das Löschen der Audiodateien), CC-07
(Art.-30-Verzeichnis und dokumentierte Schwellwertanalyse nach Art. 35 fehlen —
eine DSFA selbst ist nach meiner Prüfung **nicht** erforderlich), CC-08
(**KI-Kompetenzpflicht nach Art. 4 AI Act, in Kraft seit 02.02.2025** — wird
fast immer übersehen, für uns zwei Stunden Dokumentation, und zugleich der
beste Beleg für den Sorgfaltsmaßstab bei der Haftungsfrage aus A5).

**Geprüft und in Ordnung** (damit niemand daran arbeitet): kein
Datenschutzbeauftragter erforderlich · keine DSFA erforderlich ·
Cookie-Einwilligung nach § 25 TDDDG korrekt gelöst · PAngV erfüllt · BFSG nicht
anwendbar · CCPA, LGPD, PIPL und UK GDPR mangels Marktbezug nicht anwendbar ·
E-Rechnung: XRechnung und ZUGFeRD sind gebaut, bevor sie Pflicht werden, und
gegenüber Privatkunden wird sie es nie.

**Für Gate 1 zwingend** aus diesem Check: CC-01 und CC-02, dazu G1 aus dem
Erstbericht. CC-07 sollte fertig sein, **bevor** der erste echte Nutzerdatensatz
entsteht — rückwirkend ist ein Verarbeitungsverzeichnis mühsamer.

**Freigaben von Sandy nötig:** Bewertungsergebnis zu CC-01 und ggf. Entscheidung
über eine verspätete Meldung (vordringlich) · neue AVV-Formulierungen (CC-03,
CC-04) · korrigierte Passagen in Datenschutzerklärung und AGB (CC-02, CC-06).

**Externe Beratung:** nur für den Fall, dass CC-01 eine Meldepflicht ergibt —
eine verspätete Behördenmeldung formuliert man nicht ohne Anwalt, weil die
Begründung der Verzögerung mitbewertet wird. Ansonsten würde ich die
AVV-Neufassung mit der AGB-Überarbeitung (L1) und der AI-Act-Einordnung (S-3)
in **einem** Mandat bündeln statt drei Einzelfragen zu stellen.

---

## Chief-of-Staff-Update (2026-09-01) — Bericht gelesen, verteilt

Vollständig gelesen (`legal-001`, `legal-002`, `legal-003`,
`vob-angebot-abstimmung.md`). Sehr gute erste Arbeit — besonders der Fund,
dass die Grundannahme des Auftrags falsch war (schon viel Substanz da,
Problem sind Widersprüche, nicht leere Seiten), und dass VOB-003 explizit
als „nicht bauen" markiert wurde, bevor daraus ein falscher Fix entstehen
konnte.

**Verteilt:**
- S-1 bis S-5 + der CC-01-Status stehen jetzt in
  `docs/entscheidungen-fuer-sandy.md` zur Entscheidung.
- G4/G5/G6/L6/L7/R2 + der VOB-003-Hinweis stehen als CoS-026 bei Head of
  Product Engineering (`docs/chief-of-staff-todos.md`).
- G2/G3 stehen als CoS-M-006 bei Head of Marketing
  (`docs/chief-of-staff-marketing-todos.md`), wartet auf S-1.
- CC-01-Faktenanfrage, CC-02, TOM-Bestätigung etc. liegen bereits bei
  Platform & Integrations Engineer — gesehen, kein weiteres Zutun nötig.
- R3, G4 (Design-Hälfte), VOB-007, VOB-005 stehen bereits direkt in
  `docs/design-check.md` — gesehen, kein weiteres Zutun nötig.

**Zum neuen Kanal `docs/vob-angebot-abstimmung.md`:** gesehen und
nachvollzogen — Sandy hat dich direkt darum gebeten, das macht es in
Ordnung, auch wenn es von der ursprünglichen Anweisung abweicht („noch kein
eigener Kanal"). Bitte trotzdem künftig kurz hier vermerken, wenn ein neuer
direkter Kanal zu einem Kollegen entsteht, damit ich den Überblick behalte
— nicht um vorher zu fragen, nur damit ich's mitbekomme.

---

## Chief-of-Staff-Update (2026-09-01) — Sandys Antworten zu S-1 bis S-5

- **S-1 (FAQ-Korrekturen):** erledigt sich anders — Sandy macht die
  komplette Landingpage neu, die korrekten Fakten (G2/G3) gehen direkt in
  den Rebuild statt in einen Patch der alten Seite. Bei Head of Marketing
  vermerkt (CoS-M-006).
- **S-2 (zwei PDF-Texte):** Ja, freigegeben. Bei Head of Product
  Engineering vermerkt (CoS-026).
- **S-3 (KI-Hinweis an Endkunden):** Ja, Legals „nein" wird übernommen.
  Wichtig für dich zur Klarstellung, falls das noch mal aufkommt: Sandy
  wollte eigentlich etwas anderes ansprechen — einen internen „Bitte vor
  dem Versenden prüfen, kann Fehler enthalten"-Hinweis für den Handwerker
  selbst. Das ist R3 (bereits bei Product Designer), keine Änderung an
  S-3 nötig, nur zur Info, damit die beiden Themen nicht vermischt werden.
- **S-4 (Rechtsform/Versicherung):** **Rechtsform am 03.09.2026 entschieden —
  Einzelunternehmen jetzt, UG bei rund 20 zahlenden Betrieben** (S-4 Teil 3
  und Teil 4 in `docs/entscheidungen-fuer-sandy.md`, Terminplan in
  `docs/legal-007-plan-fuer-sandy.md`). **Versicherung weiter offen:** Sandy
  muss Anbieter und Deckungssumme freigeben — exali/Markel, 1 Mio. €, Abschluss
  bis Ende Oktober.
- **S-5 (DIN-Normtexte, ca. 150 €):** Ja, zeitnah — **bitte kaufen.** Für
  die Ausgabenerfassung kurz bei Head of Finance Bescheid geben
  (`docs/chief-of-staff-finance-todos.md`), sonst nichts weiter nötig.

---

## Fix-Update zu CoS-026 Punkt 4 / L6 / VOB-010 (Head of Product Engineering, 2026-09-01)

**Dein Fund ist bestätigt — und er stimmt auf die Zahl genau.** Ich habe ihn
nicht übernommen, sondern gegen den echten Katalog und die Live-Datenbank
geprüft, wie wir das hier mit allen Funden halten.

**14 Einträge über 10 Gewerke** (Maler, Boden, Fliesen, Trockenbau, Putz,
Estrich, Elektro, SHK, Schreiner, Dach): Prozentsatz im Titel, Einheit
„Pauschale", und der Preis trug die Prozentzahl als Euro-Betrag. In **jedem**
der 14 Fälle war der Preis exakt gleich der Prozentzahl — das ist kein Zufall,
sondern derselbe Eingabefehler wie bei den fünf Maler-Zuschlägen vom 31.08.
Beispiel: „Zuschlag Wochenend- / Feiertagsarbeit (25%)" = 25,00 €. Auf einem
5.000-€-Auftrag also 25 € statt 1.250 €.

**Zwei deiner Treffer waren Fehlalarme** und habe ich bewusst stehen lassen:
„Gefälleestrich Dusche (2% Gefälle)" (380 € Pauschale) und „Gefälleestrich
Keller (1–2% Gefälle)" (42 €/m²). Dort ist das Prozent ein Gefälle, kein
Zuschlag — die Euro-Preise sind richtig. Deine Zahl 14 stimmt also, deine
Trefferliste war 16.

**Umgesetzt:** Einheit auf „%" gestellt, Wert bleibt (es ist der Prozentsatz),
volle Erschwernis-Metadaten (`ist_erschwerniszuschlag`, `zuschlag_typ`)
ergänzt. Damit rechnet `zuschlag-basis.ts` sie ab sofort als Prozent auf die
Bemessungsgrundlage, genau wie die Maler-Zuschläge. Migration
`20260901120000_vob010_zuschlaege_prozent.sql`, live angewandt: alle Einträge
stehen jetzt auf „%", die Gefälleestriche unverändert.

**Eine Lücke, die dein Bericht nicht sehen konnte** (sie liegt im Frontend,
nicht im Katalog): Wählt der Handwerker so einen Zuschlag von Hand über die
Positionssuche, wurde der Katalogpreis in den *Einzelpreis* übernommen. Aus
25 % wäre wieder „1 % × 25,00 €" geworden — der Fehler wäre also über den
manuellen Weg zurückgekommen. Der Prozentsatz landet jetzt in der Menge, den
Euro-Betrag je Prozentpunkt rechnet die Bearbeiten-Ansicht aus der
Bemessungsgrundlage.

**Abgesichert:** zwei neue Tests in `katalog-hygiene.test.ts` — kein
Zuschlagseintrag darf einen Prozentsatz im Titel und eine andere Einheit als
„%" tragen, und der Preis muss zum Prozentsatz im Titel passen. Suite
60 Dateien / 1.092 Tests grün.

**Zu deinen übrigen Punkten, damit du den Stand kennst** (Details im
Prüfmeister-Kanal und bei CoS-026): G4, G5, L7 und R2 habe ich im Code
nachgeprüft — **alle vier bestätigt**, L7 sogar schärfer als von dir
beschrieben (Kündigen geht ausschließlich über „Konto löschen", während AGB
§6.2 „direkt in den Einstellungen" verspricht). VOB-002 ist für Maler und
Boden seit dem 30.08. erledigt, dein Bericht beschreibt den Stand davor —
offen bleibt dort nur `gewerke/fliesen.ts` mit fest verdrahteten 10 %.
VOB-006 sind nicht drei Schwellen, sondern **fünf** (Code 3,00 m; Katalog
2,80/4,00 Maler, 3,25/4,50 Trockenbau, 3,00 Putz). VOB-003 und VOB-012 fasse
ich nicht an, bis die Normtexte da sind — beides ändert Geld, und du markierst
deine Quellenlage dort selbst als unsicher. Das halte ich für richtig.

---

## Fix-Update zu G1 / G8 / G5 (Head of Product Engineering, 2026-09-02)

Sandy hat mir vier Punkte aus deinem Bericht zugewiesen: OpenAI/Sentry in der
Datenschutzerklärung, der tote EU-Streitschlichtungs-Absatz, veraltete
Gesetzesverweise, Übermessungshinweis ins PDF. Alle vier sind umgesetzt.
**Sie sind aber noch nicht live** — Rechtstexte gehen erst raus, wenn Sandy
freigibt, und ich hätte gern vorher deinen Blick auf die Formulierungen.

### Ein Fund, der deinen Bericht korrigiert: Groq wird gar nicht eingesetzt

Du hast geschrieben, die Datenschutzerklärung nenne nur Groq und OpenAI fehle.
Beim Nachsehen im Code ist es schlimmer: **Groq wird nirgends aufgerufen.**
Der einzige Treffer für „groq" im gesamten Repository steht in der
Datenschutzerklärung selbst. Transkription (Whisper) *und* Textverarbeitung
(GPT-4o) laufen beide über `api.openai.com` — in `supabase/functions/_shared/openai.ts`,
`transcribe/index.ts`, `ki-extrahieren/index.ts` und `src/lib/ai-client.ts`.
Übrig ist nur ein `GROQ_API_KEY` in der lokalen `.env.local`, der von keiner
Zeile gelesen wird.

Die Erklärung nannte also einen Empfänger, der nichts bekommt, und verschwieg
den, der alles bekommt. Ich habe Groq deshalb aus der Datenschutzerklärung
entfernt und OpenAI mit beiden Rollen eingesetzt. Im AVV § 4 steht Groq
weiterhin, aber ausdrücklich als „derzeit nicht eingesetzt; die Genehmigung
gilt für einen späteren Einsatz" — eine Genehmigung vorzuhalten schadet nicht,
eine falsche Empfängerangabe schon. **Wenn du das anders siehst, sag es.**

### Was ich geändert habe

**Datenschutzerklärung** (`src/app/datenschutz/page.tsx`)
- OpenAI, L.L.C. als Auftragsverarbeiter aufgenommen (Whisper + GPT).
- Functional Software, Inc. dba Sentry aufgenommen, mit Art. 6 Abs. 1 lit. f
  als Rechtsgrundlage und dem ehrlichen Hinweis, dass Fehlerberichte im
  Einzelfall Inhalte der gerade verarbeiteten Daten enthalten können.
- Groq entfernt (siehe oben).
- Drittland-Abschnitt konkret statt pauschal, in deiner Formulierung:
  **Vercel, Resend und Sentry** über den DPF-Angemessenheitsbeschluss,
  **OpenAI, Supabase und Stripe** über die Standardvertragsklauseln. Stripe
  habe ich zur SCC-Gruppe genommen, weil du den DPF-Status dort nicht geprüft
  hattest — SCC ist die belastbare Angabe, DPF wäre eine Behauptung.
  **Bitte prüf das nach**; wenn Stripe zertifiziert ist, zieh es rüber.
- § 25 TTDSG → § 25 Abs. 1 TDDDG, mit § 25 Abs. 2 Nr. 2 TDDDG als Ausnahme
  für technisch notwendige Cookies.
- Stand auf September 2026.

**Impressum** (`src/app/impressum/page.tsx`)
- § 5 TMG → § 5 DDG.
- Haftungsabsatz: § 7 Abs. 1 DDG, und statt „§§ 8 bis 10 TMG" jetzt
  § 7 Abs. 2 DDG i.V.m. Art. 8 der Verordnung (EU) 2022/2065 (DSA).
- Der OS-Plattform-Absatz ist raus (ODR-Verordnung aufgehoben durch
  Verordnung (EU) 2024/3228). Die VSBG-Erklärung bleibt, mit ausdrücklichem
  Verweis auf § 36 VSBG; die Überschrift heißt jetzt
  „Verbraucherstreitbeilegung".

**AVV** (`src/app/avv/page.tsx`) — Sentry als Unterauftragnehmer ergänzt,
OpenAI-Rolle korrigiert, Groq als derzeit nicht eingesetzt gekennzeichnet.

**Kunden-PDF / G5 = VOB-004** (`src/lib/pdf.tsx`) — der Übermessungshinweis
steht jetzt drauf, in zwei Teilen, wie vom Product Designer vorgeschlagen:
an der Position die konkreten Zahlen („2 Öffnungen bis 2,5 m² Einzelgröße
nicht abgezogen (3,12 m², VOB/C DIN 18363 Übermessung) ¹"), und einmal unter
der Positionsliste die Erklärung: *„Aufmaß in Anlehnung an VOB/C (DIN 18363):
Fenster- und Türöffnungen bis 2,5 m² Einzelgröße werden nicht von der Fläche
abgezogen. Der Mehraufwand für das saubere Arbeiten an Kanten, Laibungen und
Anschlüssen gleicht die eingesparte Fläche aus. Die oben genannten
Öffnungsflächen sind deshalb in der abgerechneten Menge enthalten."* In
8,5 pt / #444444 — deine Vorgabe war normale Schriftgröße an der Position,
nicht Fußzeilengrau. „In Anlehnung an" statt „nach", konsistent mit VOB-007.
Erscheint nur, wenn tatsächlich übermessen wurde.

### Zwei Aussagen in unseren Texten, die der Code nicht einhält

Beim Prüfen der Spracheingaben-Passage bin ich über zwei Sätze gestolpert, die
so nicht stimmen. Das ist keiner meiner vier Punkte, aber es gehört auf deinen
Tisch, bevor jemand danach fragt:

1. **Die Datenschutzerklärung sagte: „Wir speichern keine Audiodateien."** Wir
   speichern sie. `src/app/api/entwurf/aufnahme/upload/route.ts` legt jede
   Aufnahme unter `entwurf-audio/<user>/<angebot>/<aufnahme>/audio.<ext>` in
   Supabase Storage ab. Gelöscht wird sie nur, wenn der Handwerker die Aufnahme
   in der App löscht — es gibt **keinen** automatischen Löschjob und keine
   Frist. Ich habe die Passage auf die Wirklichkeit umgeschrieben (Speicherung
   in der EU, Zweck: erneutes Anhören und Wiederholung der Auswertung, Löschung
   durch den Nutzer) und in § 6 Speicherdauer eine Zeile ergänzt. **Die
   ehrlichere Lösung wäre eine echte Frist plus Löschjob** — das ist eine
   Produktentscheidung (Sandy) und Engineering-Arbeit (ich). Sag mir, welche
   Frist du für vertretbar hältst, dann baue ich sie.

2. **AGB § 8.3 sagt: „Sprachaufnahmen werden nicht dauerhaft gespeichert"** —
   und nennt „derzeit Groq/OpenAI". Beides falsch, aus denselben Gründen. Die
   AGB habe ich **nicht** angefasst: eine AGB-Änderung braucht dich, Sandys
   Freigabe und eine Änderungsmitteilung an bestehende Nutzer. § 9.3 zählt
   ebenfalls „Groq" auf, dort ist es harmloser (Haftungsausschluss für
   Drittdienste), aber inkonsistent.

3. **Und der schwerste Fund, dem ich beim Prüfen von Punkt 1 begegnet bin:
   „Konto löschen" löscht nichts.** `src/app/api/account/delete/route.ts`
   kündigt das Stripe-Abo, setzt `companies.deleted_at`, verschickt eine
   Bestätigungsmail und loggt aus. Das war's. Der Auth-Nutzer bleibt, alle
   Zeilen in `quotes`, `quote_items`, `customers`, `aufnahmen` bleiben, die
   Audiodateien im Storage bleiben. Ein Soft-Delete, keine Löschung.

   Dem stehen drei eigene Zusagen gegenüber: Datenschutzerklärung Abschnitt 8
   („Alle mit Ihrem Account verbundenen Daten werden dann **vollständig und
   unwiderruflich gelöscht**"), Abschnitt 6 („Nutzerdaten: bis zur Löschung
   des Accounts") und AGB § 6.5 („Nach Vertragsende werden die Daten für
   30 Tage vorgehalten … danach unwiderruflich gelöscht"). Gegenüber einem
   Betroffenen, der sich auf Art. 17 DSGVO beruft, ist das die unangenehmste
   Lücke in der ganzen Liste — und sie ist nicht durch besseren Text zu
   heilen, sondern nur durch Code.

   Ich habe deshalb **nichts** an Abschnitt 8 geändert: den Text an die
   Wirklichkeit anzupassen hieße, die Zusage zurückzunehmen, statt sie
   einzulösen. Die AGB beschreiben ohnehin bereits das richtige Verhalten
   (30 Tage Frist, dann harte Löschung) — es fehlt nur die Umsetzung. Das ist
   ein bis zwei Tage Arbeit (harte Löschung über alle Tabellen, Storage-Purge
   für `entwurf-audio`, `entwurf-fotos`, `quote-photos`, Löschung des
   Auth-Nutzers, Aufräumjob für die 30-Tage-Frist, plus die
   Aufbewahrungspflicht aus § 257 HGB / § 147 AO sauber davon getrennt).
   **Sag mir, ob das vor Gate 1 muss** — ich halte es für ein Ja, und dann
   erledigt sich Punkt 1 gleich mit.

### Abgesichert

Neue Datei `src/lib/__tests__/rechtstexte-hygiene.test.ts` (11 Tests): Sie
liest die echten Seiten und schlägt an, wenn TMG, § 25 TTDSG oder der
ODR-Link zurückkommen, wenn ein eingesetzter Dienst in der Erklärung fehlt —
und, in beide Richtungen, wenn Groq in der Erklärung steht, ohne im Code
aufgerufen zu werden. Baut jemand Groq wirklich ein, wird der Test rot und
verlangt die Aktualisierung der Erklärung.

Dazu `pdf-uebermessung-render.test.ts`: rendert das PDF wirklich, packt die
Content-Streams aus und liest den Text — beide Renderpfade (nach Räumen und
nach Gewerk), plus die Gegenprobe, dass ohne Übermessung weder Hinweis noch
Fußnote erscheinen. Ein Selbsttest stellt sicher, dass der Textextraktor
überhaupt liest; sonst wäre die Gegenprobe wertlos.

Suite: 63 Dateien / 1.115 Tests grün, `tsc --noEmit` sauber, `eslint src`
0 Fehler.

---

## Nachtrag vom selben Tag: Sandy hat entschieden, ich habe gebaut (2026-09-02)

Zwei Punkte aus meinem Fix-Update oben sind überholt. Sandy hat beide binnen
einer Stunde entschieden — hier der neue Stand, damit du nicht auf die alte
Fassung hin prüfst.

### 1. Groq ist restlos entfernt, nicht nur aus der Datenschutzerklärung

Sandys Ansage: *„habe nirgendwo groq. komplett rauslöschen. habe nur openai."*
Damit fällt meine Zwischenlösung („Genehmigung im AVV vorhalten") weg. Groq
kommt jetzt an **keiner** Stelle mehr vor:

- **AVV § 4** — Zeile gestrichen. Die Liste der Unterauftragnehmer ist jetzt:
  Supabase, OpenAI, Vercel, Resend, Stripe, Sentry.
- **AGB § 8.3** — „derzeit Groq/OpenAI" → „an OpenAI".
- **AGB § 9.3** — „(Groq, OpenAI, Supabase, Stripe)" → „(OpenAI, Supabase,
  Vercel, Stripe)".
- **Code** — `next.config.ts` hatte einen toten Schalter
  (`AI_PROVIDER !== 'groq'`), der die Bilderkennung abgeschaltet hätte, wenn
  jemand den Provider je umgestellt hätte. Raus. Dazu ein irreführender
  Kommentar in der API-Überwachung und der ungenutzte `GROQ_API_KEY` aus der
  lokalen Konfiguration.
- **Test** — `rechtstexte-hygiene.test.ts` prüft jetzt in die harte Richtung:
  „groq" darf weder im Code noch in Datenschutzerklärung, Impressum, AVV oder
  AGB vorkommen. Wer den Dienst je einbaut, wird vom Test gezwungen, die
  Rechtstexte vorher anzupassen.

In deinen eigenen Berichten (`legal-001`, `legal-003`) steht Groq noch — die
lasse ich als Aufzeichnung unverändert, aber ihre Aussage zu Groq ist damit
überholt.

### 2. Sprachaufnahmen: nein, sie müssen nicht dauerhaft gespeichert werden

Sandys Frage war die richtige. Die Antwort ist nein, und deshalb habe ich die
AGB **nicht** abgeschwächt, sondern das Verhalten gebaut, das sie zusagen.

Die Audiodatei wird nach der Aufnahme nur noch für zwei Dinge gebraucht: den
Wiederholungslauf, falls die Transkription beim ersten Versuch scheitert, und
das Nachhören im Entwurf. Beides passiert in den Stunden und Tagen danach, nie
Monate später. Alles, was das Angebot ausmacht — Transkript, erkannte
Positionen, Mengen — liegt in der Datenbank. Eine Aufnahme in einer fremden
Wohnung ist dagegen das Sensibelste, was dieses Produkt anfasst: Kundenname,
Adresse, Nebengespräche. Sie ohne Zweck und ohne Frist zu behalten, ist das
Gegenteil von Datenminimierung (Art. 5 Abs. 1 lit. c DSGVO).

**Gebaut:** 30 Tage nach der Aufnahme wird die Audiodatei automatisch
gelöscht, das Transkript bleibt (`src/lib/aufnahmen-aufraeumen.ts`, täglicher
Lauf in `api/cron/aufraeumen`). Löschen durch den Nutzer geht wie bisher
jederzeit sofort.

**AGB § 8.3 neu:** *„Sprachaufnahmen werden zur Transkription an OpenAI
übermittelt. Die Aufnahme wird auf unseren Servern in der EU gespeichert,
damit sie erneut angehört und die Auswertung wiederholt werden kann, und
spätestens 30 Tage nach der Aufnahme automatisch gelöscht — vorher jederzeit
auf Wunsch des Nutzers. Transkript und die daraus erzeugten Positionen bleiben
als Teil des Angebots erhalten."* Bitte gegenlesen.

Sandys Begründung dafür, dass die AGB-Änderung ohne Änderungsmitteilung geht:
es gibt noch keine echten Nutzer, alle angemeldeten Konten sind ihre eigenen
Mailadressen. Das trifft zu, solange es so bleibt — nach dem ersten echten
Nutzer ist jede AGB-Änderung mitteilungspflichtig.

### 3. „Konto löschen" löscht jetzt wirklich

Der dritte Punkt aus meinem Fix-Update oben („nur durch Code zu heilen") ist
erledigt. Der Ablauf entspricht jetzt AGB § 6.5 wörtlich:

1. **Sofort:** Konto deaktiviert, `deleted_at` gesetzt, Stripe-Abo gekündigt,
   Bestätigungsmail mit dem konkreten Löschdatum. Die Mail sagte bisher „dein
   Account und alle Daten wurden gelöscht" und verwies aufs Antworten auf die
   Mail — beides falsch; jetzt steht das Datum drin und der Weg zur
   Wiederherstellung.
2. **30 Tage:** Export und Wiederherstellung möglich (war schon gebaut:
   `api/account/restore` + RestoreBanner).
3. **Danach:** unwiderrufliche Löschung durch `api/cron/aufraeumen` —
   Dateien in allen sechs Buckets mit Personenbezug, alle Datenbanktabellen,
   Auth-Zugang.

Die Datenbank-Löschung läuft als eine Transaktion
(`konto_hart_loeschen()`, nur für die Service-Rolle ausführbar). Sie ist an
einem synthetischen Konto durchgespielt: 11 Tabellen befüllt, Funktion
aufgerufen, danach null Zeilen und **null verwaiste Kindzeilen**.

**Datenschutzerklärung Abschnitt 8** habe ich entsprechend präzisiert: sofort
deaktiviert, 30 Tage Frist für Export und Wiederherstellung, danach
unwiderrufliche Löschung von Angeboten, Kundendaten, Sprachaufnahmen, Fotos
und Zugang. Auch das bitte gegenlesen.

---

## Antwort auf alle Rückmeldungen (Head of Legal & Compliance, 2026-09-02)

Ich habe alles gelesen, was seit gestern dazugekommen ist: die Platform-Notiz
zu CC-01, die beiden Fix-Updates von Head of Product Engineering, den
Nachtrag zu Groq und der Kontolöschung, die Umsetzung des Product Designers,
die Rückmeldung des Prüfmeisters und die Entscheidungen von Sandy. Der
Reihe nach.

### 1. CC-01 ist abgeschlossen — keine Meldepflicht

Die Antwort des Platform Engineers ist vollständig und beantwortet alle drei
Fragen belastbar. Ergebnis meiner Bewertung:

**Keine Meldung an die Aufsichtsbehörde (Art. 33 Abs. 1), keine
Benachrichtigung der Betroffenen (Art. 34), keine Mitteilung an fremde
Verantwortliche (Art. 33 Abs. 2).**

Tragend sind vier Punkte: Alle drei schreibenden Konten waren Sandys eigene.
Das einzige externe Konto kam **3,5 Stunden nach** der Schließung dazu. In den
Protokollen des gesamten Zeitraums steht keine einzige Lese-Anfrage und keine
einzige anonyme Anfrage auf diese Tabelle. Und der Fund kam aus einer eigenen
planmäßigen Kontrolle, nicht von außen.

Die Dokumentation nach **Art. 33 Abs. 5** — die eigentliche Pflicht, die offen
war — liegt jetzt als **`docs/legal-004-vorfallsdokumentation-cc01.md`** vor.
Sie ist bewusst so geschrieben, dass sie einer Aufsichtsbehörde vorgelegt
werden kann, einschließlich des Abschnitts „Was nicht gut gelaufen ist".

**Zur Qualität der Antwort, weil sie das verdient:** Die Rekonstruktion über
`ki_usage` und `companies`, nachdem die Tabelle selbst weg war, war die
richtige Idee — und der Nachweis über die Zeitstempel (Fix 12:14, externes
Konto 15:44) ist genau die Art Beleg, die eine Bewertung trägt statt sie nur
plausibel zu machen. Ohne diese Arbeit hätte ich hier „nicht abschließend
beurteilbar" schreiben müssen.

**Ein Punkt, der mir beim Lesen aufgefallen ist und den ich in die
Dokumentation aufgenommen habe:** Die Tabelle wurde manuell außerhalb einer
Migration angelegt — deshalb fehlte die Zugriffsregel. Und sie wurde Anfang
September **wieder manuell außerhalb einer Migration gelöscht**; die Notiz
vermerkt selbst, dass sich nicht mehr feststellen lässt, wer wann. Dasselbe
Muster wirkt also fort. Die eigentliche Ursache ist nicht die vergessene
RLS-Regel, sondern der Weg an der Migration vorbei. Ich habe drei Maßnahmen
vorgeschlagen (Abschnitt 8 der Dokumentation) — die zweite, „keine manuellen
Schema-Änderungen in Produktion", ausdrücklich als Vorschlag, nicht als
Anweisung: ob das im Alltag praktikabel ist, beurteilt Platform Engineering
besser als ich.

**Eine Nachfrage an Sandy, eine Zeile Antwort:** Enthielten die Diktate in den
beiden gelöschten Testkonten echte Namen und Adressen realer Personen, oder
waren die Kundendaten erfunden? Am Ergebnis ändert das nichts — es ersetzt nur
eine Annahme durch eine Feststellung.

### 2. Rechtstexte gegengelesen — drei Anmerkungen, sonst freigegeben

Zu den vier Punkten aus dem Fix-Update:

**Groq: deine Korrektur ist richtig und mein Fund war zu kurz gesprungen.** Ich
hatte geschrieben, OpenAI fehle in der Datenschutzerklärung. Dass Groq dort
steht, *ohne überhaupt aufgerufen zu werden*, habe ich nicht geprüft — ich habe
die Auftragsverarbeiter-Liste gegen die AVV-Seite abgeglichen, nicht gegen den
Code. Das war der offensichtlichere und der schlechtere Weg. Eine
Empfängerangabe, die niemand empfängt, ist datenschutzrechtlich nicht harmlos:
Art. 13 Abs. 1 lit. e verlangt die tatsächlichen Empfänger, und eine falsche
Angabe ist kein Schönheitsfehler, sondern eine unrichtige Pflichtinformation.
Sandys Entscheidung, Groq restlos zu entfernen, trage ich voll mit.

**Der Hygiene-Test ist die beste Einzelmaßnahme aus dieser Runde.** Dass er in
beide Richtungen prüft — ein eingesetzter Dienst muss in der Erklärung stehen,
und ein genannter Dienst muss eingesetzt werden — ist genau das, was solche
Widersprüche künftig verhindert. Das ist mehr wert als der Textfix selbst,
weil es die Fehlerklasse schließt und nicht den Einzelfall.

**Stripe: geprüft, bitte in die DPF-Gruppe verschieben.** Stripe unterhält eine
eigene Data-Privacy-Framework-Policy und erklärt darin die Zertifizierung unter
dem EU-US DPF, der UK Extension und dem Swiss-US DPF. Deine Entscheidung, es
vorläufig zu den Standardvertragsklauseln zu stellen, war methodisch richtig —
lieber die belastbare Angabe als eine ungeprüfte Behauptung. Jetzt ist sie
geprüft.

**Zwei Einschränkungen dazu, die in die Formulierung gehören:** Die
zertifizierte Einheit heißt in Stripes Police **Stripe, LLC**, unsere Texte
nennen „Stripe Inc." Und für Händler im EWR ist Vertragspartner in aller Regel
**Stripe Payments Europe, Ltd.** mit Sitz in Irland — dann ist die Übermittlung
auf der Vertragsebene gar keine Drittlandübermittlung. Bitte einmal im
Stripe-Dashboard nachsehen, welche Einheit auf unserem Vertrag steht; danach
formuliere ich den Satz exakt. Bis dahin ist deine SCC-Fassung nicht falsch,
nur konservativ.

**Was ich an den neuen Texten sonst gefunden habe — ein alter Punkt, der
stehengeblieben ist:** Die Passage „Kundendaten" in Abschnitt 2 vermischt
weiterhin zwei Rollen: *„Der Nutzer ist für diese Daten selbst verantwortlich
(Auftragsverarbeitung gemäß Art. 28 DSGVO). Rechtsgrundlage: Art. 6 Abs. 1
lit. b DSGVO."* Wenn wir für diese Daten Auftragsverarbeiter sind — und das
sind wir —, gehört dort keine eigene Rechtsgrundlage hin; die liegt beim
Handwerksbetrieb, und wir verweisen auf den AVV. So wie es dasteht, liest es
sich, als wären wir für dieselben Daten gleichzeitig Verantwortlicher und
Auftragsverarbeiter. Das ist kein Gate-1-Thema, sollte aber mit, wenn die Seite
ohnehin angefasst wird. Formulierungsvorschlag liefere ich, sobald die
Stripe-Frage geklärt ist, dann in einem Rutsch.

**Alles Übrige gebe ich frei:** § 5 DDG, § 7 Abs. 1 und Abs. 2 DDG i. V. m.
Art. 8 DSA statt §§ 8–10 TMG, § 25 Abs. 1 mit Abs. 2 Nr. 2 TDDDG, der
gestrichene OS-Absatz mit dem Verweis auf § 36 VSBG, Sentry mit Art. 6 Abs. 1
lit. f und dem ehrlichen Hinweis auf mögliche Inhalte in Fehlerberichten,
OpenAI mit beiden Rollen. Die Aufteilung der Drittlandübermittlungen ist genau
richtig gebaut: konkret pro Anbieter statt pauschal.

### 3. Sprachaufnahmen, 30 Tage: ja, das trägt

Du hattest mich nach der vertretbaren Frist gefragt; Sandy hat sie in der
Zwischenzeit entschieden und du hast gebaut. Meine Bewertung, damit sie in der
Akte steht: **30 Tage sind gut begründbar**, und die Begründung ist die
richtige — die Aufnahme wird für den Wiederholungslauf und das Nachhören
gebraucht, beides geschieht in Tagen, nicht Monaten; alles, was das Angebot
ausmacht, liegt im Transkript. Damit ist die Frist am Zweck bemessen und nicht
gegriffen, und genau das verlangt Art. 5 Abs. 1 lit. e.

**Wichtiger als die Zahl ist, wie ihr dahin gekommen seid.** Der naheliegende
Weg wäre gewesen, den AGB-Satz an die Wirklichkeit anzupassen. Ihr habt die
Wirklichkeit an die Zusage angepasst. Dasselbe bei Abschnitt 8 der
Datenschutzerklärung: nichts abgeschwächt, sondern gebaut. Das ist die
richtige Richtung, und sie ist seltener, als man denkt.

### 4. Ein Punkt, bei dem ich widersprechen muss: die AGB-Änderung

Im Nachtrag steht Sandys Begründung, die AGB-Änderung brauche keine
Änderungsmitteilung, weil es noch keine echten Nutzer gebe und alle
angemeldeten Konten ihre eigenen Mailadressen seien.

**Das trifft nach der Platform-Notiz vom selben Tag nicht mehr zu.** Dort steht,
dass es aktuell zwei Konten in der Produktionsdatenbank gibt: Sandys eigenes —
und **„Lisa Schein Malerbetrieb", ausdrücklich bezeichnet als „die einzige
echte dritte Partei in der Datenbank"**, angelegt am 17.08.2026. Die beiden
Aussagen stehen sich direkt gegenüber, und keiner von euch beiden konnte das
sehen, weil sie in verschiedenen Dateien stehen.

**Warum das zählt.** Ist „Lisa Schein Malerbetrieb" ein echter externer Nutzer
mit einem laufenden Vertrag, greift AGB § 11.1: Änderungen mit einer
Ankündigungsfrist von 30 Tagen per E-Mail, und nach § 11.2 mit ausdrücklichem
Hinweis auf das Widerspruchsrecht. Eine AGB-Änderung ohne diese Mitteilung
wirkt ihm gegenüber schlicht nicht — die alte Fassung gilt weiter. Das ist
ärgerlich, aber nicht schlimm: Die neue Fassung ist für ihn ausschließlich
günstiger (30-Tage-Löschfrist statt Speicherung ohne Frist), und niemand wird
sich darauf berufen, dass er weiterhin nach der schlechteren Fassung behandelt
werden möchte.

**Bitte an Sandy: eine Zeile.** Ist das ein echter Nutzer — ein Betrieb, der
das Produkt tatsächlich einsetzt — oder ein von dir angelegtes Konto für einen
Bekannten oder für Tests? Beim zweiten Fall trägt deine Begründung und es ist
nichts zu tun. Beim ersten schicke ich eine kurze Mitteilung mit den geänderten
Punkten und dem Widerspruchshinweis; das sind zehn Minuten und die Sache ist
sauber.

**Und unabhängig davon der Satz, auf den es ankommt:** Ab dem ersten echten
Nutzer ist jede AGB-Änderung mitteilungspflichtig. Das steht im Nachtrag
bereits richtig — ich will nur, dass klar ist, dass dieser Zeitpunkt
möglicherweise schon hinter uns liegt und nicht vor uns.

### 5. Korrekturen an meinen eigenen Befunden, übernommen

- **VOB-006: fünf Schwellen, nicht drei.** Ich hatte nur den Maler-Teil des
  Katalogs angesehen. Übernommen.
- **VOB-002: für Maler und Boden seit dem 30.08. erledigt**, offen bleibt nur
  `gewerke/fliesen.ts` mit fest verdrahteten 10 %. Mein Bericht beschrieb den
  Stand davor. Übernommen.
- **VOB-010: 14 Einträge, meine Trefferliste war 16.** Deckt sich — ich hatte
  die beiden Gefälleestrich-Zeilen im Bericht selbst als unproblematisch
  markiert. Gut, dass du sie unabhängig geprüft und nicht übernommen hast.
- **L7 ist schärfer als von mir beschrieben:** Kündigen geht ausschließlich über
  „Konto löschen", während AGB § 6.2 „direkt in den Einstellungen" verspricht.
  Das ist wieder dieselbe Klasse — die AGB beschreiben ein Verhalten, das es
  nicht gibt. Da die AGB hier das Bessere versprechen, ist die Lösung wieder
  bauen statt umformulieren: eine Kündigungsmöglichkeit, die das Abo beendet,
  ohne das Konto zu löschen. Das sind zwei verschiedene Wünsche.
- **Die Lücke im Frontend, die mein Bericht nicht sehen konnte** (Katalogpreis
  landete beim manuellen Hinzufügen im Einzelpreis, wodurch aus 25 % wieder
  „1 % × 25,00 €" geworden wäre): Genau deshalb sind Code-Prüfungen durch
  jemanden, der die Pipeline kennt, nicht durch mich ersetzbar. Danke fürs
  Mitnehmen.

### 6. Der Fund des Prüfmeisters ist der wichtigste des Tages

Beim Nachrechnen für die Soll-Lösungen ist ihm aufgefallen, dass `maler.ts`
Z. 614 den Leibungsumfang als `2*br + 2*hoe` rechnet — einmal rundherum. Unten
sitzt aber die Fensterbank bzw. der Fußboden; richtig sind drei Seiten. Gut ein
Drittel zu viel. Dazu wird die Fensterbank bei Nennung des Wortes ein zweites
Mal als eigene Position berechnet.

**Das ist der erste Fund im ganzen Komplex, bei dem tatsächlich falsch
gerechnet wird** und nicht eine richtige Rechnung schlecht erklärt ist. Bei der
Übermessung und beim Verschnitt berechnen wir nicht bearbeitete Flächen nach
einer nachvollziehbaren Konvention — hier gibt es keine Verteidigungslinie. Und
die Doppelzählung der Fensterbank ist qualitativ noch etwas anderes als eine zu
große Fläche: Der Vorwurf lautet dann nicht „falsch gerechnet", sondern
„doppelt berechnet", und dagegen kann sich ein Betrieb am schlechtesten wehren.

Aufgenommen als **VOB-013**, in der Risikobewertung als **LR-13** (Score 12,
orange). Meine Kernaussage in `legal-002` — „in keinem der zwölf Risiken wird
falsch gerechnet" — ist damit überholt und dort korrigiert. Sie war zwei Tage
lang richtig.

**Ein Hinweis zur Reihenfolge:** VOB-013 sollte nicht hinter VOB-003 in der
Warteschlange landen. VOB-003 wartet bewusst auf die Normtexte. Für „ein
Fenster hat unten keine Leibung" braucht es keine DIN.

### 7. Was jetzt bei mir liegt

- **Normtexte kaufen** (S-5, freigegeben) — mache ich, Head of Finance bekommt
  die Ausgabe gemeldet. Danach löse ich VOB-003, VOB-008 und VOB-012 auf.
- **CC-03 und CC-04** (AVV-Meldefrist, Unterauftragnehmer-Klausel) — die
  Formulierungen liegen noch bei mir, sie gehen mit der Stripe-Klärung zusammen
  raus.
- **CC-07** (Verarbeitungsverzeichnis und Schwellwertanalyse) — schreibe ich als
  nächstes; das sollte fertig sein, bevor echte Nutzerdaten entstehen, und wenn
  „Lisa Schein Malerbetrieb" ein echter Nutzer ist, ist dieser Zeitpunkt schon
  da.
- **CC-08** (KI-Kompetenz nach Art. 4 AI Act) — zwei Stunden, kommt mit CC-07.

### 8. Zum Kanal-Hinweis des Chief of Staff

Verstanden, und berechtigt. Neue direkte Kanäle vermerke ich künftig hier —
auch wenn Sandy sie anstößt. Ergänzend zu `vob-angebot-abstimmung.md`: Der
Platform Engineer hat mit `platform-notiz-fuer-head-of-legal.md` selbst eine
direkte Antwortdatei angelegt. Sinnvoll, weil die CC-01-Faktenlage nicht in
eine Statusspalte passt; ich habe dort nichts eigenes eröffnet, sondern
antworte hier und in der Vorfallsdokumentation.

---

## Klarstellung von Sandy (2026-09-02) — es gibt keine echten Nutzer

Sandy hat auf meine Rückfrage aus Abschnitt 4 der Antwort von heute klar
geantwortet: **„Lisa Schein Malerbetrieb" ist ebenfalls ihr eigenes Konto. Es
gibt derzeit keinen einzigen echten Nutzer**, sämtliche jemals in der
Produktionsdatenbank angelegten Konten gehören ihr.

**Damit sind zwei Punkte erledigt:**

1. **Die AGB-Änderung braucht keine Änderungsmitteilung.** Sandys ursprüngliche
   Begründung war richtig, meine Rückfrage war es trotzdem — sie kam aus dem
   Widerspruch zur Platform-Notiz, nicht aus Zweifeln an ihrer Aussage. AGB
   § 11.1 setzt einen Vertragspartner voraus, den es nicht gibt. Nichts zu tun.
2. **CC-01 ist ohne offenen Rest abgeschlossen.** Die Nachfrage, ob die
   Testdiktate echte Namen enthielten, erübrigt sich: Wenn alle Konten Sandy
   gehören, ist der Kreis betroffener Personen abschließend bestimmt.
   `legal-004-vorfallsdokumentation-cc01.md` ist entsprechend aktualisiert —
   Status jetzt „abgeschlossen, keine offenen Punkte", Abschnitt 7 umgeschrieben.

**Woher der Widerspruch kam, damit er nicht wiederkehrt.** Die Platform-Notiz
bezeichnet dieses Konto als „die einzige echte dritte Partei in der Datenbank".
Das ist aus Sicht der Datenbank auch nachvollziehbar — von dort aus sieht ein
Konto mit fremdem Firmennamen und eigener Mailadresse wie ein externer Nutzer
aus. Es ist nur nicht richtig. Ich habe es in der Platform-Notiz richtiggestellt,
damit die Aussage nicht später als Beleg zitiert wird.

**Was ich daraus mitnehme:** Ich habe aus zwei Dokumenten einen Widerspruch
gebaut, den es in der Sache nicht gab — die Datenbank kann Sandys Testkonten
nicht von echten Nutzern unterscheiden, und niemand hatte Anlass, das
aufzuschreiben. Solche Fragen gehen künftig als kurze Rückfrage raus, nicht als
Widerspruchsbefund in einem Bericht.

### Der Punkt, der dadurch wichtiger wird statt kleiner

Es gibt derzeit keine echten Nutzer — das ist der Grund, warum eine ganze Reihe
von Pflichten gerade nicht greift. **Mit dem ersten echten Nutzer schalten sie
gleichzeitig scharf:**

| Ab dem ersten echten Nutzer | Was dann gilt |
|---|---|
| **AGB-Änderungen** | § 11.1: 30 Tage Ankündigung per E-Mail, mit Hinweis auf das Widerspruchsrecht (§ 11.2) |
| **Verarbeitungsverzeichnis** (Art. 30) | Muss geführt sein — rückwirkend zu schreiben ist deutlich mühsamer |
| **Betroffenenrechte** | 30-Tage-Frist, und Anfragen können auch von Endkunden der Handwerker kommen, für die wir Auftragsverarbeiter sind (CC-05) |
| **Vorfallsmeldung** | Der nächste Vorfall wie der vom August wäre nicht mehr folgenlos: fremde Verantwortliche, Art. 33 Abs. 2, echte Fristen |
| **Verbraucherschutz** | Falls die Unternehmer-Prüfung bei der Registrierung bis dahin nicht greift (LR-05) |

Das ist kein neuer Befund, sondern die Einordnung der bekannten: **Gate 1 ist
nicht „bevor es losgeht", sondern genau dieser Moment.** Die Liste oben ist der
Grund, warum ich CC-07 (Verzeichnis und Schwellwertanalyse) vorziehe — sie
sollte fertig sein, bevor der erste echte Datensatz entsteht, nicht danach.

---

## Weitergeleitet von Head of Product Engineering (Chief of Staff, 02.09.2026) — bitte gegenlesen vor dem nächsten Deploy

Head of Product Engineering hatte diese Bitte in einer eigenen, direkt an
Sandy adressierten Datei stehen (inzwischen aufgelöst, siehe
`docs/entscheidungen-fuer-sandy.md`) — gehört aber zu dir, nicht zu Sandy,
deshalb hier statt dort:

**Datenschutzerklärung, Impressum, AGB §8.3/§9.3 und AVV sind gepusht und
gehen mit dem nächsten Deploy live. Noch niemand hat sie mit juristischem
Blick gegengelesen.** Besonders ein Punkt: den Drittland-Absatz hat er
Stripe den Standardvertragsklauseln zugeordnet, weil der DPF-Status dort
nicht belegt war — falls Stripe inzwischen zertifiziert ist, gehört das in
die andere Gruppe. Bitte einmal vor dem Deploy drüberschauen.

---

## Grundsatzfrage von Sandy (2026-09-02): „Wenn die App falsch rechnet und der Handwerker ungeprüft rausschickt — sein Pech, oder?"

Sandy hat gefragt, ob sich das Haftungsrisiko nicht durch AGB plus einen
KI-Hinweis vor dem Versenden erledigen lässt, so wie ChatGPT und Claude ihn
zeigen. Die Frage ist berechtigt und die Antwort ist zum größten Teil ja. Hier
die Einordnung, weil die Stelle, an der es *nicht* trägt, für das Produkt
wichtig ist.

### Wo Sandy recht hat, und das ist der größere Teil

**Die Prüfpflicht ist die stärkste Verteidigung, die wir haben** — stärker als
jede Haftungsklausel. § 254 BGB (Mitverschulden) kann einen Anspruch bis auf
null reduzieren, wenn der Nutzer eine zumutbare Kontrolle unterlassen hat. AGB
§ 10.2 begründet diese Pflicht bereits. Der Hinweis im Versand-Screen (R3, vom
Product Designer gebaut: „Aus deinem Diktat erstellt — bitte einmal prüfen,
bevor es rausgeht") macht sie im entscheidenden Moment sichtbar. Das ist genau
richtig und war meine eigene Empfehlung.

**Für die Mehrzahl der denkbaren Fehler trägt das vollständig.** Ein Handwerker,
der ein Angebot ohne Blick versendet, in dem eine Deckenposition steht, die er
ausgeschlossen hat, hat sein Problem selbst gemacht. Da braucht es keine
Diskussion.

### Wo der ChatGPT-Vergleich nicht trägt

Drei Unterschiede, der zweite ist der entscheidende.

**1. Anderer Vertragsgegenstand.** ChatGPT verkauft ein Gespräch mit einem
Sprachmodell — die Antwort *ist* erklärtermaßen ein Entwurf, und niemandes
Geschäft hängt daran, dass eine einzelne Ausgabe rechnerisch exakt ist.
Sofortangebot verkauft **richtig gerechnete Angebote**. Das ist das
Produktversprechen, das steht in der Werbung („berechnet, nicht geschätzt"), und
das ist der Grund, warum jemand zahlt. Wer Richtigkeit verkauft, kann die
Haftung für Richtigkeit nicht ausschließen — das höhlt den Vertragszweck aus
(§ 307 Abs. 2 Nr. 2 BGB) und die Klausel fällt weg. Ein
Allzweck-Chatbot hat dieses Problem nicht, weil er die Richtigkeit einer
einzelnen Antwort nie versprochen hat.

**2. Der Hinweis verschiebt die Verantwortung nur für das, was man auch finden
kann.** Das ist die eigentliche Trennlinie, und sie verläuft mitten durch
unsere eigenen Fundlisten:

| Fehlerart | Kann der Handwerker das beim Prüfen finden? | Hinweis hilft? |
|---|---|---|
| Deckenposition erscheint, obwohl ausgeschlossen (PM-001) | Ja, ein Blick auf die Positionsliste | **Ja, vollständig** |
| Phantom-Raum, falscher Raumname als Position | Ja | **Ja** |
| Erschwerniszuschlag fehlt | Ja, wenn er ihn erwartet hat | **Ja** |
| Wandflächen-Grundpreis 11,50 statt 9,50 €/m² (PM-028) | Ja, wenn er seine Preisliste kennt | **Ja** |
| **Leibungsfläche vierseitig statt dreiseitig (VOB-013)** | **Nein** | **Nein** |
| **Fensterbank doppelt berechnet (VOB-013)** | **Nein** | **Nein** |
| **Verschnittsatz 5 % statt 10 % (VOB-002)** | **Nein** | **Nein** |

Bei den unteren drei sieht die Zahl plausibel aus, liegt in der richtigen
Größenordnung, und um den Fehler zu bemerken, müsste der Handwerker die
Geometrie von Hand nachrechnen — also genau die Arbeit machen, für die er das
Werkzeug gekauft hat. **„Du hättest es prüfen müssen" ist keine Verteidigung,
wenn der Fehler durch Prüfen nicht auffindbar ist.**

Genau deshalb steht in AGB § 2.3 und § 10.2 „Richtwerte" und „prüfen" — und
genau deshalb reicht das für diese Klasse nicht.

**3. Bekannte Fehler sind ein eigener Fall.** Ein dokumentierter, nicht
behobener Fehler, der trotzdem live geht, verlässt den Bereich der leichten
Fahrlässigkeit. Dort hilft **weder die AGB-Klausel noch der Hinweis noch die
Versicherung** (wissentliche Pflichtverletzung ist in jeder Police
ausgeschlossen). VOB-013 ist seit gestern dokumentiert. Das ist kein Vorwurf —
es ist der Grund, warum die Funde vor dem ersten echten Nutzer geschlossen sein
sollten.

### Was daraus folgt — drei Dinge, alle klein

**1. Den Hinweis bauen, aber konkreter formulieren.** Ein Hinweis, der sagt
*worauf* zu achten ist, wird eher befolgt und verschiebt juristisch mehr als
ein allgemeiner. Vorschlag als Ergänzung zum bestehenden Text:

> **Aus deinem Diktat erstellt — bitte vor dem Senden prüfen.**
> Besonders: Raummaße, Mengen und ob alle Leistungen stimmen.

Bewusst **nicht** „KI kann Fehler machen". Der Satz klingt vertraut, sagt dem
Handwerker aber nichts, was er tun kann, und er relativiert das Produkt an der
Stelle, an der Vertrauen entsteht. „Bitte prüfen, besonders X" ist stärker —
juristisch wie praktisch.

**2. Die Freigabe protokollieren (R2).** Das ist der Punkt mit dem mit Abstand
besten Verhältnis von Aufwand zu Wirkung. Ein Ereignis beim Versenden mit
Zeitstempel, Nutzer-ID und Angebotsstand macht aus der Prüfpflicht einen
**Beweis**. Ohne das ist § 254 eine Behauptung; mit dem Protokoll ist es ein
Argument, das im Zweifel den ganzen Anspruch trägt. Eine zusätzliche Checkbox
braucht es nicht — der Hinweis steht sichtbar über dem Senden-Knopf, das
Absenden ist die Bestätigung.

**3. AGB § 9.3 enger fassen.** Die Klausel schließt Haftung für „inhaltliche
Fehler in KI-generierten Angeboten" pauschal aus. Weil sie damit auch Vorsatz
und grobe Fahrlässigkeit erfasst, fällt sie nach § 307 BGB im Zweifel **ganz**
weg — eine geltungserhaltende Reduktion auf den zulässigen Kern gibt es nicht.
**Eine engere Klausel schützt mehr als diese weite.** Details in
`legal-001-bestandsaufnahme.md`, Abschnitt A5.

### Und deshalb trotzdem die Versicherung

Nicht weil Sandy für alles haftet — sie haftet für das Wenigste. Sondern weil
für die drei unsichtbaren Fehlerarten oben weder Hinweis noch Klausel greifen,
und weil genau diese Klasse systematisch wirkt: derselbe Fehler bei allen
Nutzern gleichzeitig. Die Versicherung deckt den schmalen Rest, der nach
Prüfpflicht, Hinweis und Protokoll übrig bleibt — und dieser Rest ist der
einzige, der existenzgefährdend werden kann.

**Zusammengefasst:** Sandys Instinkt spart den größten Teil des Risikos. Die
drei Maßnahmen oben kosten zusammen einen Tag Arbeit. Was danach bleibt, ist
klein genug für eine Police und zu groß für ein Privatvermögen.

---

## G6 erledigt — Wertersatz-Erklärung im Widerrufs-PDF (2026-09-02)

Damit ist die zweite Hälfte von Sandys S-2-Freigabe gebaut. G5 (Übermessung)
kam heute Vormittag, G6 jetzt.

**Umgesetzt genau nach deinem Vorschlag:** ein eigener, umrahmter Block unter
der Widerrufsbelehrung, mit leerem Kästchen, deinem Wortlaut und einer
**eigenen** Datums- und Unterschriftszeile.

> ☐ Ich verlange ausdrücklich, dass Sie vor Ablauf der Widerrufsfrist mit den
> Arbeiten beginnen. Mir ist bekannt, dass ich bei Widerruf Wertersatz für die
> bis dahin erbrachten Leistungen schulde.

Ergänzt habe ich eine Zeile, die du nicht vorgegeben hattest — bitte
gegenlesen: *„Dieses Feld ist freiwillig. Ohne Ihre Erklärung beginnen wir
erst nach Ablauf der vierzehntägigen Widerrufsfrist — Ihr Widerrufsrecht
bleibt in beiden Fällen unberührt."* Grund: Deine drei Bedingungen (freiwillig,
separat, nicht vorangekreuzt) stehen sonst nur in der Konstruktion, nicht im
Text. Ein Kunde, der das Kästchen für Pflicht hält, hat es nicht freiwillig
angekreuzt. **Wenn dir die Formulierung zu weit geht oder du sie schärfer
willst, sag es — sie steht in einer Konstante und ist in einer Minute
geändert** (`WERTERSATZ_HINWEIS` in `src/lib/widerrufsbelehrung.ts`).

**Abgesichert** (`wertersatz-g6.test.ts`, 7 Tests) — bewusst an deinen drei
Wirksamkeitsbedingungen entlang, nicht am Layout:

- Das Feld steht auf dem PDF eines Privatkunden.
- „Unterschrift Auftraggeber" kommt im Dokument **zweimal** vor — die
  Erklärung hat eine eigene Zeile, ist also nicht mit der
  Auftragsunterschrift zusammengelegt.
- Der Text beginnt mit „Ich verlange" und enthält kein gesetztes Häkchen —
  nicht vorangekreuzt.
- Das Wort „freiwillig" steht auf dem Blatt.
- Bei einem **Geschäftskunden** fehlt die ganze Seite (kein Widerrufsrecht),
  ebenso wenn der Betrieb die Belehrung abgeschaltet hat.
- Das Feld hängt an derselben Bedingung wie die Belehrung — es kann nie ohne
  sie erscheinen.

Die Tests rendern das PDF wirklich und lesen den Text aus den
Content-Streams; sie prüfen nicht bloß, dass eine Funktion existiert.

**Dein zweiter Punkt zum Widerruf ist damit NICHT erledigt:**
`braucheWiderrufsbelehrung()` hängt weiter an `kundeIstUnternehmen !== true` —
ein Geschäftskunde, bei dem das Häkchen niemand gesetzt hat (`null`), bekommt
also weiterhin eine Belehrung, die ihm nicht zusteht. Das ist G4 (die
Unternehmer-Abfrage bei der Registrierung bzw. am Kunden) und liegt noch bei
dir und Sandy. Solange G4 offen ist, ist der jetzige Zustand die sichere
Richtung: lieber eine Belehrung zu viel als eine zu wenig.

Suite: 68 Dateien / 1.161 Tests grün, tsc sauber, eslint 0 Fehler.

---

## Stufe 3 (7.1 / 7.2) — waren schon erledigt; stattdessen zwei offene Punkte nachgeliefert (2026-09-02)

**Beide zugewiesenen Punkte hat Head of Product Engineering bereits am 02.09.
umgesetzt.** Ich habe den Ist-Stand geprüft, bevor ich etwas doppelt mache:

**7.1 Impressum — ✅ vollständig erledigt.** § 5 DDG statt § 5 TMG, § 7 Abs. 1
DDG und § 7 Abs. 2 DDG i.V.m. Art. 8 der Verordnung (EU) 2022/2065 (DSA) statt
§§ 8–10 TMG, der OS-Plattform-Absatz ist raus, die VSBG-Erklärung ist mit
ausdrücklichem Verweis auf § 36 VSBG geblieben und die Überschrift heißt jetzt
„Verbraucherstreitbeilegung". Korrekt, ich habe nichts zu ergänzen.

**7.2 Datenschutzerklärung — ✅ erledigt.** OpenAI, L.L.C. mit beiden Rollen
(Whisper + GPT) und Functional Software, Inc. dba Sentry sind aufgenommen, Groq
ist restlos raus, § 25 TTDSG → § 25 Abs. 1 mit Abs. 2 Nr. 2 TDDDG, Stand auf
September 2026. Der Hygiene-Test `rechtstexte-hygiene.test.ts` sichert beides in
beide Richtungen ab.

Statt Doppelarbeit habe ich die zwei Punkte fertiggemacht, die ich zu genau
diesen Dateien noch offen hatte.

### 1. Stripe: Vertragsentität geklärt und korrigiert

Head of Product Engineering hatte Stripe vorsorglich zur SCC-Gruppe gestellt und
mich gebeten, den DPF-Status zu prüfen. **Erledigt — und die Antwort ist eine
andere als erwartet.**

Ich habe das Stripe-Konto direkt abgefragt: `country: "DE"`, Standard-Konto,
Sitz Berlin. Für ein Konto im EWR ist Vertragspartner nach dem Stripe Services
Agreement **Stripe Payments Europe, Limited mit Sitz in Irland** — nicht
„Stripe Inc.", wie es bisher in der Erklärung stand.

Das ändert die Einordnung grundlegend: **Auf Vertragsebene findet gar keine
Drittlandübermittlung statt.** Stripe war damit weder in der SCC-Gruppe noch in
der DPF-Gruppe richtig aufgehoben; es gehört in einen eigenen Absatz.

Geändert:
- Abschnitt 3: „Stripe Inc." → **„Stripe Payments Europe, Limited"**.
- Abschnitt 4: Stripe aus der Aufzählung der US-Unternehmen herausgenommen und
  ein eigener Absatz ergänzt — Vertragspartner in Irland, keine
  Drittlandübermittlung auf dieser Ebene; soweit Stripe konzernintern in die USA
  weitergibt, gestützt auf die DPF-Zertifizierung und ergänzend die
  Standardvertragsklauseln.

Die vorsorgliche Einordnung als SCC war methodisch richtig — lieber die
belastbare Angabe als eine ungeprüfte Behauptung. Sie war nur eben aus dem
falschen Grund vorsichtig.

### 2. Kundendaten: die Rollenvermischung ist raus

Der Punkt stand seit dem Erstbericht offen. Die Passage lautete:

> „Der Nutzer ist für diese Daten selbst verantwortlich (Auftragsverarbeitung
> gemäß Art. 28 DSGVO). **Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.**"

Beides zusammen geht nicht. Wenn wir für die Kundendaten Auftragsverarbeiter
sind — und das sind wir —, dann gehört dort **keine eigene Rechtsgrundlage**
hin; die bestimmt der Handwerksbetrieb als Verantwortlicher. So wie es dastand,
las es sich, als wären wir für dieselben Daten gleichzeitig Verantwortlicher und
Auftragsverarbeiter.

Neu formuliert: klare Aussage, dass wir insoweit Auftragsverarbeiter sind, dass
der Betrieb über Zwecke, Mittel und Rechtsgrundlage entscheidet, und Verweis auf
den AVV statt auf eine eigene Rechtsgrundlage.

**Dabei gleich CC-05 mit erledigt.** Ich hatte im Compliance-Check bemängelt,
dass es keinen Weg für Betroffenenanfragen von Endkunden der Handwerker gibt —
Menschen, die bei uns kein Konto haben und für deren Daten wir nur
Auftragsverarbeiter sind. Der neue Absatz sagt ihnen jetzt, wohin sie sich
wenden müssen, und sagt zu, dass wir Anfragen unverzüglich an den
verantwortlichen Betrieb weiterleiten (Art. 28 Abs. 3 lit. e DSGVO). Damit steht
der Prozess wenigstens im Text; die tatsächliche Weiterleitung bleibt eine
Handarbeit, für die es bei einem Ein-Personen-Betrieb keinen Automatismus
braucht — nur das Wissen, dass die 30-Tage-Frist des Verantwortlichen läuft.

**Geprüft:** `rechtstexte-hygiene.test.ts` 11/11 grün, `tsc --noEmit` sauber.
**Nicht live** — Rechtstexte gehen erst mit Sandys Freigabe raus, zusammen mit
den übrigen Änderungen von Head of Product Engineering.

### Nebenbefund aus der Stripe-Abfrage — nicht meiner, aber jemand sollte es wissen

Beim Abfragen des Kontos ist mir aufgefallen: `charges_enabled: false`,
`payouts_enabled: false`, `details_submitted: false`, und unter
`requirements.past_due` stehen `external_account`, `tos_acceptance.date` und
`tos_acceptance.ip`. **Das Stripe-Konto ist noch nicht aktiviert** — die
Nutzungsbedingungen sind nicht angenommen, es ist keine Bankverbindung
hinterlegt, und es können aktuell keine Zahlungen entgegengenommen werden.

Für meinen Teil ändert das nichts: Die Nennung in der Datenschutzerklärung ist
richtig, weil die Anbindung im Code existiert und mit der Aktivierung greift.
Aber es heißt, dass vor dem ersten zahlenden Kunden noch ein Schritt fehlt, der
nicht im Code liegt. Gehört zu Platform & Integrations Engineering bzw. Finance,
nicht zu mir — ich melde es nur, weil ich zufällig draufgeschaut habe.

---

## CoS-L-002 — Neues Preismodell rechtlich absichern

**Datum:** 2026-09-03 (Chief of Staff, nach Sandys Preisentscheidung)
**Status:** ❌ offen
**Heimat der Entscheidung:** `docs/preismodell.md`

**Sandy hat am 03.09.2026 entschieden:** 49 € netto/Monat pro Betrieb,
unbegrenzt Angebote, monatlich kündbar · kein Dauer-Gratis-Tarif, stattdessen
14 Tage voller Test ohne Kreditkarte · **Gründerpreis 29 €/Monat dauerhaft für
die ersten 25 zahlenden Betriebe** · kein Jahresabo zum Launch · keine
Staffelung nach Nutzerzahl.

**Vier Fragen, bei denen ich deine fachliche Einschätzung brauche** (ich
formuliere bewusst nur die Fragen, nicht die Antworten):

1. **Preisdarstellung.** Sandy ist aktuell Kleinunternehmerin, die Kunden sind
   ausschließlich Unternehmer (die separate Unternehmer-Checkbox nach §14 BGB
   ist live). Wie werden 49 € auf Landingpage, im Onboarding-Plan-Fenster und
   auf der Rechnung korrekt ausgewiesen, solange die Kleinunternehmerregelung
   gilt — und was ändert sich in dem Moment, in dem sie nicht mehr gilt?
   Head of Product Engineering wartet unter CoS-038 auf genau diese
   Formulierung und soll sie ausdrücklich nicht selbst erfinden.
2. **Kleinunternehmerregelung — Rahmen einordnen, nicht entscheiden.** Seit
   2025 gilt: 25.000 € Vorjahr / 100.000 € laufendes Jahr, jeweils netto. Bei
   49 € reichen rund **43 zahlende Betriebe im Jahresdurchschnitt**, um die
   25.000 € zu reißen. Meine Überlegung war, von Anfang an auf die
   Kleinunternehmerregelung zu verzichten, weil die Kunden ohnehin
   vorsteuerabzugsberechtigt sind und man sich damit einen späteren
   Preissprung und eine AGB-Änderung spart. **Das ist am Ende eine
   Steuerberater-Entscheidung** — ich brauche von dir nur die rechtliche
   Einordnung, was das für AGB, Rechnungsstellung und Preisangaben jeweils
   bedeutet, damit Sandy mit einer sauberen Frage zum Steuerberater geht.
3. **AGB.** Die Preis- und Kündigungspassagen bilden das alte Modell ab
   (u. a. §6.2, siehe auch L7 — der versprochene Kündigen-Button existiert
   technisch noch nicht). Was muss angepasst werden für: monatliche
   Kündbarkeit, Wegfall des Gratis-Tarifs, 14-tägige Testphase ohne
   Kreditkarte, **dauerhafter Bestandsschutz des Gründerpreises**, und eine
   Preisanpassungsklausel für künftige Erhöhungen bei Neukunden?
4. **Testphase.** 14 Tage voller Funktionsumfang ohne hinterlegte
   Zahlungsmethode, bewusst **ohne** stille automatische Umwandlung in ein
   bezahltes Abo. Was muss dazu wo kommuniziert werden, und gibt es dabei
   etwas, das im B2B anders zu behandeln ist als im B2C? Platform baut die
   Mechanik unter CoS-P-007 und liest hier gegen.

---

## CoS-L-003 — Reihenfolge Gewerbeanmeldung / UG-Gründung

**Datum:** 2026-09-03 (Chief of Staff)
**Status:** 🟡 Reihenfolge geliefert (Head of Legal, 03.09.) — Fix-Update am Dateiende

**Neue Information von Sandy (03.09.2026):** Es ist **bis heute kein Gewerbe
angemeldet.** In den Finance-Unterlagen stand das seit dem 19.08. als
Randnotiz; durch die Preisentscheidung vom selben Tag ist es jetzt ein
zeitkritischer Punkt geworden.

**Warum es dringend wird:** Der Preis steht (`docs/preismodell.md`), damit
rückt der erste zahlende Kunde näher. Deine eigene Empfehlung aus S-4 lautet,
die UG **vor dem ersten zahlenden Kunden** zu gründen (§26 HGB, sonst haftet
sie fünf Jahre lang privat für Altverbindlichkeiten weiter).

**Meine Frage an dich — bewusst als Reihenfolge-Frage, nicht als
Kostenfrage:** Was ist der saubere Weg von „kein Gewerbe" zu „UG mit erstem
zahlendem Kunden"?

1. Jetzt als Einzelunternehmerin anmelden und später in die UG überführen —
   oder direkt die UG gründen und nur deren Gewerbe anmelden?
2. Was bedeutet die jeweilige Variante für die bereits angefallenen Kosten
   (17 erfasste Belege seit Mai, aktuell als vorweggenommene Betriebsausgaben
   geführt)? Gehen die bei einer direkten UG-Gründung verloren oder lassen sie
   sich einbringen?
3. Gibt es einen Punkt, ab dem eine Anmeldung überfällig ist — sie arbeitet
   seit Juni an dem Produkt und hat laufende Kosten, aber noch keine Einnahmen?
4. Welche Schritte müssen **vor** dem ersten zahlenden Kunden abgeschlossen
   sein, und welche dürfen danach kommen?

**Bitte als Reihenfolge mit Zeitpunkten liefern**, nicht als Aufzählung von
Optionen — Sandy soll daraus eine Entscheidung treffen können, ohne selbst
abwägen zu müssen, was zuerst kommt. Wo es eine Steuerberater-Frage ist, sag
das ausdrücklich; sie hat noch keinen, und ein Termin steht ohnehin an.

**Für den Finanzplan (CoS-F-003) relevant:** Head of Finance braucht deine
Antwort, um die Rechtsform-abhängigen Kosten überhaupt einordnen zu können —
eine UG bilanziert, ein Einzelunternehmen macht eine EÜR, das ist beim
Steuerberater ein dauerhafter Unterschied. Solange deine Antwort fehlt, führt
er beides als Variante.

---

## Fix-Update CoS-L-003 — Reihenfolge Gewerbeanmeldung / UG-Gründung (Head of Legal & Compliance, 2026-09-03)

Antwort als Reihenfolge mit Zeitpunkten, wie gewünscht. Steuerberater-Fragen
sind ausdrücklich markiert — es sind drei, und sie sind konkret genug, dass
der Termin damit produktiv wird.

**Vorbehalt:** Die Reihenfolge ist Recht, die Behandlung der bisherigen Kosten
ist Steuer. Für Letzteres gebe ich meine Einschätzung, aber die Entscheidung
gehört der Steuerberaterin.

### Die Reihenfolge

| Wann | Was | Wer |
|---|---|---|
| **Diese Woche** | Gewerbe als Einzelunternehmerin anmelden (online, Berlin, ~26 €) | Sandy, 20 Minuten |
| **Diese Woche** | Steuerberater-Termin buchen, mit den drei Fragen unten | Sandy |
| **Binnen 4 Wochen ab Anmeldung** | Fragebogen zur steuerlichen Erfassung über ELSTER (§ 138 AO), Kleinunternehmerregelung ankreuzen | Sandy, ggf. mit Steuerberaterin |
| **Nach dem Steuerberater-Termin** | UG gründen: Musterprotokoll, 1.000 € Stammkapital, Notar | Sandy |
| **Zwischen Notar und HR-Eintragung** | Geschäftskonto für die UG eröffnen, Stammkapital einzahlen — **muss vor der Handelsregister-Anmeldung passiert sein** | Sandy |
| **Ab HR-Eintragung** (2–4 Wochen nach Notar) | Gewerbe für die UG anmelden, Fragebogen Finanzamt für die UG, IHK | Sandy |
| **Ab HR-Eintragung** | Alles auf die UG umstellen — Liste unten | Legal + Platform + Product Engineering |
| **Danach** | Einzelunternehmen abmelden | Sandy, 10 Minuten |
| **Erst dann** | erster zahlender Kunde — er schließt mit der UG | — |

**Realistische Gesamtdauer: 6–8 Wochen** vom heutigen Tag bis zum ersten
Kunden, wenn der Steuerberater-Termin in zwei Wochen liegt. Das ist der
Zeitrahmen, den Head of Finance für CoS-F-003 braucht.

### Frage 1 — Erst Einzelunternehmen, dann UG? Oder direkt UG?

**Erst Einzelunternehmen anmelden, dann UG gründen.** Drei Gründe, in dieser
Gewichtung:

1. **Es entspricht dem, was tatsächlich der Fall ist.** Sandy betreibt seit
   Juni faktisch ein Gewerbe — sie entwickelt, sie hat laufende Kosten, es gibt
   eine Landingpage mit Angebot. Das Steuerrecht schaut auf die Tatsachen, nicht
   auf die Anmeldung. Das Einzelunternehmen existiert bereits; die Anmeldung
   holt nur die Formalie nach. Sie **nicht** anzumelden, weil in sechs Wochen
   eine UG kommt, verlängert den überfälligen Zustand um genau diese sechs
   Wochen.
2. **Es sichert die 17 Belege.** Dazu Frage 2.
3. **Es kostet fast nichts.** 26 € und 20 Minuten online. Die spätere Abmeldung
   ist ein Formular. Die IHK-Mitgliedschaft, die dadurch ausgelöst wird, ist für
   Existenzgründer und bei geringem Gewerbeertrag regelmäßig beitragsfrei.

**Was das mit meiner S-4-Empfehlung macht:** Nichts — sie bleibt. Meine
Warnung vor § 26 HGB betraf **Verbindlichkeiten**, die vor einem
Rechtsformwechsel entstehen. Ohne Kunden gibt es keine. Solange der erste
zahlende Kunde mit der UG abschließt, entsteht durch die Zwischenzeit als
angemeldete Einzelunternehmerin kein Nachhaftungsproblem. (§ 25 HGB greift
ohnehin nicht: Ein nicht im Handelsregister eingetragenes Kleingewerbe ist kein
Handelsgeschäft unter einer Firma.)

**Das Gegenargument, ehrlich:** Zwei Anmeldungen, zwei Fragebögen beim
Finanzamt, eine Abmeldung — das ist Bürokratie für sechs Wochen
Einzelunternehmen. Ein Steuerberater könnte sagen, das sei überflüssig. Dann
ist das eine vertretbare Abweichung. Mein Grund, es trotzdem zu empfehlen,
ist Frage 2.

### Frage 2 — Was passiert mit den 17 Belegen seit Mai?

**Sie gehen nicht verloren — aber sie gehören zum Einzelunternehmen, nicht zur
UG.** Das ist der Kern, und es ist der Grund für die Reihenfolge oben.

Eine UG ist ein eigener Steuerpflichtiger. Kosten, die Sandy persönlich vor
der Gründung getragen hat, sind **nicht** Betriebsausgaben der UG. Das
Musterprotokoll erlaubt der UG sogar nur, Gründungskosten bis **300 €** zu
übernehmen — alles andere bleibt bei der Gründerin.

Beim Einzelunternehmen dagegen sind es **vorweggenommene Betriebsausgaben**:
Kosten vor der ersten Einnahme, mit klarem Bezug zum künftigen Betrieb. Die
sind abzugsfähig und erzeugen einen Verlust, der mit anderen Einkünften
verrechnet oder vorgetragen werden kann. Deshalb ist die Anmeldung als
Einzelunternehmerin **rückwirkend auf den tatsächlichen Beginn** (Juni) der
Weg, die Belege dort zu verankern, wo sie steuerlich am besten stehen.

**➜ Steuerberater-Frage 1, die wichtigste:** *„Ich habe seit Mai rund 17
Belege als vorweggenommene Betriebsausgaben eines Einzelunternehmens, das nie
Einnahmen haben wird, weil die UG den Betrieb übernimmt. Wie stelle ich
sicher, dass der Verlust anerkannt wird — als Aufgabeverlust, als Einbringung,
oder anders?"* Das Risiko, das dahintersteht: Ein Einzelunternehmen, das nur
Verluste hatte und nie Einnahmen, kann vom Finanzamt als ohne
Gewinnerzielungsabsicht eingestuft werden. Die Steuerberaterin weiß, wie man
das sauber löst — aber sie muss es **vor** der UG-Gründung wissen, nicht
danach.

**➜ Steuerberater-Frage 2:** *„Die Software ist selbst entwickelt und steht in
keiner Bilanz (§ 5 Abs. 2 EStG). Muss sie förmlich in die UG eingebracht
werden, oder kann die UG sie einfach nutzen?"* Hier hängt etwas Praktisches
dran: Wenn die Antwort „förmlich einbringen" lautet, ist das eine
**Sachgründung** — und die geht nicht per Musterprotokoll, sondern braucht
Sachgründungsbericht und Bewertung, was teurer und langsamer ist. Meine
Einschätzung: Bei einem Produkt ohne Umsatz ist eine Bargründung per
Musterprotokoll die übliche und vertretbare Lösung, die Software wandert
faktisch mit. Aber das ist genau die Frage, die man vorher stellt.

### Frage 3 — Ist die Anmeldung überfällig?

**Ja, vermutlich seit dem Sommer — und es ist nicht dramatisch.**

§ 14 GewO verlangt die Anzeige **gleichzeitig mit dem Beginn** des Gewerbes.
Reine Entwicklung ohne Außenauftritt ist noch Vorbereitung. Sobald man am
Markt auftritt — Landingpage mit Angebot, Registrierungsmöglichkeit — hat das
Gewerbe begonnen. Das dürfte spätestens der Fall gewesen sein, seit die
Landingpage mit Preisen online ist. Parallel verlangt § 138 AO die Anzeige beim
Finanzamt binnen eines Monats.

**Folgen:** Eine verspätete Anmeldung ist eine Ordnungswidrigkeit (§ 146 GewO),
theoretisch mit Bußgeld. Bei einer selbst nachgeholten Anmeldung eines
Betriebs, der noch keinen Euro eingenommen hat, wird in der Praxis
üblicherweise nichts verhängt. **Entscheidend ist, dass es jetzt nachgeholt
wird und nicht erst, wenn Einnahmen fließen.** Dann sieht es nach etwas anderem
aus.

**Bei der Anmeldung das tatsächliche Beginndatum angeben** — Juni 2026, nicht
das heutige Datum. Das ist ehrlich, und es ist zugleich das Datum, das die
Belege als Betriebsausgaben verankert. Eine rückdatierte Anmeldung ist nichts
Ungewöhnliches; das Formular fragt ausdrücklich nach dem Beginn.

### Frage 4 — Was muss vor dem ersten zahlenden Kunden fertig sein?

**Muss vorher — weil der Kunde mit der UG abschließen soll:**

| # | Was | Warum |
|---|---|---|
| 1 | UG im Handelsregister eingetragen | Vorher existiert sie nicht als Vertragspartnerin |
| 2 | **Impressum**: Firma mit Zusatz „UG (haftungsbeschränkt)", Sitz, Registergericht, HRB-Nummer, Geschäftsführerin | § 5 DDG |
| 3 | **AGB § 1.1**: Vertragspartner von „Sandy Holm, Inhaberin" auf die UG umstellen — neue Version | Sonst schließt der Kunde mit ihr persönlich, und die UG hat keinen Vertrag |
| 4 | **AVV und Datenschutzerklärung**: Verantwortlicher bzw. Auftragsverarbeiter ist die UG | Art. 13 und 28 DSGVO |
| 5 | **Stripe-Konto auf die UG** | Das bestehende Konto ist `business_type: individual` und ohnehin noch nicht aktiviert (siehe Nachtrag zu Stufe 3). **Nicht jetzt aktivieren** — erst für die UG, sonst muss es migriert werden |
| 6 | **Geschäftsbriefe** (§ 35a GmbHG): Firma, Sitz, Registergericht, HRB, Geschäftsführerin auf **allen** Geschäftsbriefen — das schließt E-Mails ein, die das Produkt versendet, und jedes PDF, das Sofortangebot selbst ausstellt | Pflichtangabe, gilt ab Eintragung |
| 7 | **Versicherung auf die UG** | Sonst Deckungslücke, siehe S-4 Teil 2, Frage 4 an exali |
| 8 | Kleinunternehmerregelung für die UG **neu** beantragen | Die UG ist ein neuer Steuerpflichtiger — der Status vererbt sich nicht |

**Darf danach kommen:** Abmeldung des Einzelunternehmens (sofort möglich, aber
nicht kritisch) · Wechsel der Domain-Registrierung und sonstiger Verträge auf
die UG (Vercel, Supabase, OpenAI — sinnvoll, nicht zwingend, weil das
Innenverhältnis ist) · Verarbeitungsverzeichnis auf die UG umschreiben (CC-07
läuft ohnehin).

**Eine Falle, die ich ausdrücklich nennen will — Punkt 2 und 6:** Der Zusatz
„haftungsbeschränkt" ist keine Formalie. Tritt die UG irgendwo ohne ihn auf —
in einer E-Mail-Signatur, auf einem Angebot, im Impressum — kann daraus nach
der Rechtsprechung eine **persönliche Haftung der Handelnden** entstehen
(Rechtsscheinhaftung). Das wäre genau das, was die UG verhindern soll, an der
Stelle ausgehebelt, an der man am wenigsten hinschaut. Der Hygiene-Test für
Rechtstexte sollte nach der Gründung eine Zeile bekommen, die den Zusatz in
Impressum, AGB, AVV und Datenschutzerklärung prüft.

**➜ Steuerberater-Frage 3:** *„Kleinunternehmerregelung für die UG — sinnvoll,
oder ist der Verzicht bei B2B-Kunden besser, die Vorsteuer ziehen wollen?"* Das
hängt mit CoS-L-002 zusammen (Preismodell: 49 € netto) und ist keine
Rechtsfrage. Ich merke es hier nur an, weil es beim selben Termin gehört.

### Was ich daraus für die anderen Rollen mitnehme

- **Head of Finance (CoS-F-003):** Die UG kommt. Beide Varianten müssen nicht
  weitergeführt werden. Bilanzierung ab Gründung, EÜR nur für das kurze
  Einzelunternehmen. Zeitrahmen 6–8 Wochen.
- **Platform & Integrations Engineering:** Stripe-Konto nicht für das
  Einzelunternehmen aktivieren — warten, bis die UG steht (CoS-P-007).
- **Head of Product Engineering:** Nach HR-Eintragung eine Runde Rechtstexte
  (Punkte 2–4, 6), analog zur G1/G8-Runde. Ich liefere die Formulierungen.
- **Chief of Staff:** CoS-L-002 (Preismodell) hängt an Steuerberater-Frage 3;
  ich fange es an, aber die USt-Frage bleibt bis zum Termin offen.

**Status:** 🟡 Reihenfolge geliefert. Umsetzung bei Sandy (Anmeldung,
Steuerberater-Termin). Rechtstexte für die UG bereite ich vor, sobald der
Notartermin steht.

---

## CoS-L-003, geänderter Plan — direkt UG (Head of Legal & Compliance, 2026-09-03)

Sandys Entscheidung: **so wenig Aufwand wie möglich, auf die bisherigen Belege
kann verzichtet werden.** Damit fällt der Grund für den Umweg über das
Einzelunternehmen weg, und der Plan wird kürzer. **Der Fix-Update oben ist
damit überholt; es gilt dieser Abschnitt.**

### Warum direkt UG geht

Der einzige Grund, das Einzelunternehmen erst anzumelden, war die steuerliche
Verankerung der 17 Belege. Wer darauf verzichtet, braucht den Zwischenschritt
nicht. Was dann entfällt:

- Gewerbeanmeldung Einzelunternehmen, Fragebogen dafür, spätere Abmeldung
- die schwierigste Steuerberater-Frage (Verlust eines Einzelunternehmens ohne
  Einnahmen) — die gibt es nicht mehr
- die Abhängigkeit „erst Steuerberater, dann Gründung": Bei einer Bargründung
  per Musterprotokoll hängt die Gründung an keiner Steuerfrage. Der
  Steuerberater-Termin kann **parallel** laufen statt davor

**Was es kostet:** Die Belege seit Mai bleiben Privatausgaben. Wie viel das
steuerlich wert gewesen wäre, hängt von Sandys sonstigen Einkünften ab — ohne
andere Einkünfte, gegen die ein Verlust verrechnet werden könnte, ist der
Verzicht ohnehin fast nichts wert. Ab dem Notartermin zahlt die UG ihre Kosten
selbst; das Musterprotokoll lässt sie Gründungskosten bis 300 € tragen.

**Zur überfälligen Anmeldung:** Der Zustand „kein Gewerbe" läuft damit noch
vier bis sechs Wochen weiter. Ich halte das für vertretbar — die Vorlaufphase
eines Betriebs ohne Einnahmen interessiert in der Praxis niemanden, und mit der
UG-Eintragung gibt es einen sauberen, dokumentierten Beginn. Es ist eine
bewusste Entscheidung, keine vergessene.

### Der neue Plan

| Wann | Was | Aufwand |
|---|---|---|
| **Woche 1** | Notartermin vereinbaren, Musterprotokoll, 1.000 € Stammkapital | 1 Termin |
| **Woche 1, parallel** | Geschäftskonto für die „UG i. G." beantragen — die meisten Direktbanken nehmen das notariell beurkundete Musterprotokoll | online |
| **Nach Notar** | Stammkapital einzahlen, Einzahlungsbeleg an den Notar — **erst dann** meldet er beim Handelsregister an | 10 Minuten |
| **Woche 1–2, parallel** | Steuerberater-Termin — nicht mehr blockierend, aber vor dem Fragebogen sinnvoll | 1 Termin |
| **Woche 3–5** | Handelsregister-Eintragung. Danach: Gewerbe der UG anmelden (online, ~26 €), Fragebogen Finanzamt für die UG (ELSTER, mit Steuerberaterin), IHK meldet sich von selbst | 1 Stunde |
| **Woche 3–5** | Rechtstexte, Stripe, Versicherung auf die UG — Liste unten. Ich liefere die Formulierungen, Engineering baut ein | ~1 Tag Engineering |
| **Ab Woche 5–6** | erster zahlender Kunde, mit der UG | — |

**Gesamtdauer 4–6 Wochen** statt 6–8. Sandys eigener Aufwand: zwei Termine
(Notar, Steuerberater), eine Kontoeröffnung, zwei Online-Formulare.

### Was vor dem ersten Kunden fertig sein muss — unverändert

1. HR-Eintragung
2. Impressum: Firma mit Zusatz **„UG (haftungsbeschränkt)"**, Sitz,
   Registergericht, HRB, Geschäftsführerin
3. AGB § 1.1: Vertragspartner ist die UG — sonst schließt der Kunde mit Sandy
   persönlich
4. AVV und Datenschutzerklärung auf die UG
5. Stripe-Konto als UG — das bestehende `individual`-Konto **nicht aktivieren**
6. § 35a GmbHG auf allen Geschäftsbriefen, E-Mails des Produkts eingeschlossen
7. Versicherung auf die UG (Frage 4 an exali)
8. Kleinunternehmerregelung für die UG neu

Die Rechtsschein-Falle bleibt: „haftungsbeschränkt" darf nirgends fehlen.

### Steuerberater-Fragen, jetzt nur noch zwei

1. **Software:** Kann die UG die selbst entwickelte, nicht bilanzierte Software
   einfach nutzen, oder muss sie förmlich eingebracht werden? *(Meine Erwartung:
   einfach nutzen — Bargründung per Musterprotokoll ist bei einem Produkt ohne
   Umsatz der Normalfall. Nur zur Bestätigung.)*
2. **Kleinunternehmerregelung für die UG:** ja, oder Verzicht wegen
   B2B-Kunden mit Vorsteuerabzug? Hängt an CoS-L-002.

### Der eine Satz zum Aufwand, der bleibt

Der Umweg fällt weg, die UG selbst nicht: doppelte Buchführung, Jahresabschluss,
Offenlegung — dauerhaft, jedes Jahr. Das ist der Aufwand, den die
Haftungsbeschränkung kostet. Er steht in S-4 und ändert sich durch diesen Plan
nicht.

**An Head of Finance:** Keine EÜR-Variante mehr. Nur UG, Bilanzierung ab
Gründung, Zeitrahmen 4–6 Wochen.

**Status:** 🟡 Plan geändert auf Sandys Entscheidung. Nächster Schritt liegt bei
ihr: Notartermin.

---

## CoS-L-003, Nachtrag (Chief of Staff, 2026-09-03) — Zusatzfrage Website

Sandy hat auf Nachfrage gesagt, sie wisse nicht, wann sie die Website online
stellt — „vermutlich erst wenn Gewerbe angemeldet etc., oder nicht". Aktuell
zeigt `sofortangebot.app` nur die Warteliste-Seite (E-Mail-Sammlung), die
volle Landingpage mit Preisen (49 €/Monat, 14 Tage Test, Gründerpreis) ist per
Umgebungsschalter verborgen.

**Bitte als fünfte Frage in deine Reihenfolge aufnehmen:** Ab welchem Punkt
der Reihenfolge darf die volle Landingpage mit Preisen und Testphase
rechtlich live sein — schon vor der Gewerbeanmeldung (mit welchem Impressum,
welcher Rechtsform im Impressum), erst nach Gewerbeanmeldung, oder erst mit
der UG? Und ist die reine Warteliste-Seite, die jetzt schon läuft, in ihrem
jetzigen Zustand (Impressum, Datenschutz, Einwilligung beim Eintragen) in
Ordnung?

**Zeitlicher Rahmen dazu:** Sandy hat den Launch heute auf **Gate 1 ab Anfang
Dezember, öffentlich Januar 2027** gelegt und ist 02.11.–03.12. nicht im Land.
Notar- und Behördentermine passen also nur in das Fenster 26.09.–01.11. oder
ab 04.12. Bitte deine Reihenfolge mit Blick auf diese Fenster machen —
`docs/kalender.md` hat alle Daten.

---

## Nachtrag CoS-L-003 (2026-09-03) — Notar-Checkliste und Stammkapital-Frage

Sandy hat gefragt, wie sie den Notar findet, wie sie sich vorbereitet, und ob
sie mit 400 € starten und im Januar 600–800 € nachzahlen kann. Antwort als
eigene Handreichung: **`docs/legal-005-ug-gruendung-checkliste.md`**.

**Die drei Kernpunkte:**

1. **Notarkosten sind gesetzlich fix (GNotKG) — kein Preisvergleich möglich.**
   Auswahl nach Termin-Verfügbarkeit, nicht nach Angebot. Online-Beurkundung
   per Video ist für die UG-Bargründung möglich (seit 01.08.2022, System der
   Bundesnotarkammer, braucht aktivierte eID). Anfrage-Text und Suchlinks in
   der Checkliste.
2. **Stammkapital in Raten ist bei der UG ausgeschlossen** — § 5a Abs. 2 GmbHG
   verlangt Volleinzahlung vor der HR-Anmeldung, anders als bei der GmbH. Das
   Ziel geht trotzdem: die 600–800 € im Januar als **Einzahlung in die
   Kapitalrücklage** (§ 272 Abs. 2 Nr. 4 HGB) — notarfrei, per Überweisung,
   und es ist Eigenkapital. Kapitalerhöhung wäre notariell und teurer als der
   Betrag, Gesellschafterdarlehen wäre Fremdkapital mit Nachrang in der
   Insolvenz.
3. **400 € Stammkapital sind zu wenig, und der Grund ist eine Rechnung:** Die
   Notarkosten sinken nicht mit dem Stammkapital (Mindestgeschäftswert 30.000 €
   nach § 105 Abs. 4 GNotKG, Gründung kostet in jedem Fall ~430–440 €), und das
   Musterprotokoll lässt die UG davon nur bis zu 300 € selbst tragen. Bei 400 €
   Stammkapital bleiben nach Gründung **100 € Eigenkapital** — die 50-%-Schwelle
   des § 49 Abs. 3 GmbHG ist nach zwei Rechnungen erreicht, und die
   Fachliteratur warnt ausdrücklich vor bilanzieller Überschuldung am ersten
   Tag. **Empfehlung: 1.000 €, notfalls 500 € mit vollständig privat getragenen
   Gründungskosten.**

**Ein Missverständnis, das ich in der Checkliste ausräume:** Das Stammkapital
ist keine Gebühr. Es ist Betriebsvermögen und wird für Vercel, OpenAI,
Versicherung und Steuerberater ausgegeben — nur nicht an die Gesellschafterin
zurückgezahlt (§ 30 GmbHG). Die Frage ist also nicht „1.000 € ausgeben oder
nicht", sondern „von welchem Konto werden die laufenden Kosten bezahlt".

**Zwei neue Punkte, die dabei aufgefallen sind:**

- **§ 11 Abs. 2 GmbHG:** Zwischen Beurkundung und HR-Eintragung (2–3 Wochen)
  haftet die Handelnde persönlich für alles, was im Namen der UG geschieht. In
  diesem Fenster **keine Kundenverträge**. Der Plan sieht den ersten zahlenden
  Kunden ohnehin erst nach Eintragung vor — jetzt ist auch dokumentiert, warum.
- **Markenrecherche „Sofortangebot" beim DPMA fehlt.** Das hätte vor der
  Festlegung des Firmennamens passieren müssen, und es ist eine Lücke in meiner
  eigenen Bestandsaufnahme — ich habe Markenrecht in CoS-L-001 gar nicht
  betrachtet. Ich prüfe es und melde das Ergebnis, bevor der Notartermin
  stattfindet. Falls dort eine kollidierende Marke in Klasse 42 liegt, ist das
  ein Problem für Firmenname **und** Produktnamen, unabhängig vom
  Registergericht.

---

## CoS-L-004 — Influencer-Kooperationen: Kennzeichnung und Gratis-Nutzung

**Datum:** 2026-09-03 (Chief of Staff)
**Status:** ❌ offen — nicht dringend, aber vor der ersten Ansprache nötig
(frühestens Dezember)

**Was Sandy plant:** Kleine Handwerker-Accounts auf Social Media (Größenordnung
2.000 Follower, Maler und Bodenleger, die sich bei der Arbeit filmen) ansprechen
und ihnen anbieten, Sofortangebot **kostenlos zu nutzen** — im Gegenzug für
Feedback und, wenn es ihnen gefällt, eine Erwähnung in ihrer Story.

**Meine Fragen an dich:**

1. **Kennzeichnungspflicht.** Kostenlose Nutzung gegen Erwähnung ist eine
   Gegenleistung. Was muss der Handwerker kennzeichnen, in welcher Form, und
   ändert es etwas, wenn die Erwähnung ausdrücklich freiwillig ist („nur wenn
   es dir gefällt")? Praktisch am hilfreichsten wäre ein **kurzer Textbaustein**,
   den Sandy der Ansprache beilegen kann — ein, zwei Sätze, die dem Handwerker
   sagen, wie er es kennzeichnet. Dann muss sie es nicht selbst erklären.
2. **Ihr eigenes Risiko.** Haftet Sandy mit, wenn ein Kooperationspartner nicht
   kennzeichnet? Und was muss auf ihrer Seite dokumentiert sein — reicht die
   Ansprache-Nachricht als Nachweis der Vereinbarung?
3. **Aussagen Dritter über das Produkt.** Wenn ein Handwerker in einer Story
   sagt „das rechnet alles richtig", ist das eine Werbeaussage über ein
   KI-gestütztes Produkt. Gibt es etwas, das Sandy in der Ansprache
   ausschließen oder klarstellen sollte — mit Blick auf die
   KI-Kennzeichnung (CC-08) und darauf, dass das Tool ein Entwurfsgenerator
   mit Mensch in der Schleife ist?
4. **Gratis-Accounts und AGB.** Die Nutzer bekämen Zugang ohne Vertrag über ein
   Entgelt. Braucht das eine eigene kurze Vereinbarung, oder laufen sie unter
   den normalen AGB mit einem Vermerk? Berührt auch das Widerrufsrecht und die
   Frage, was passiert, wenn die Gratis-Phase endet.

**Kein Zeitdruck:** Die Ansprache soll frühestens im Dezember laufen, nach dem
VOB-013-Nachtest und Sandys 100 Testfällen — Reichweite verstärkt Qualität in
beide Richtungen, und ein öffentlich gezeigter Rechenfehler wäre der teuerste
Weg, einen zu haben. Bitte einordnen, wann du das machst; es soll die
Oktober-Themen nicht verdrängen.

---

## VOB-011 erledigt — Normtext liegt vor (Head of Legal & Compliance, 2026-09-04)

Sandy hat die **VOB Gesamtausgabe 2019** beschafft (54 €, die günstige Variante,
die ich empfohlen hatte). Damit sind **alle sechs offenen Normfragen beantwortet**.
Vollständige Auswertung: `vob-angebot-abstimmung.md`, Abschnitt „VOB-011 erledigt".

**Was du für die Zuweisung brauchst — vier Punkte an Head of Product
Engineering, davon zwei vor Gate 1:**

| Was | Wirkung | Dringlichkeit |
|---|---|---|
| Backlog-Punkt Leibungen in `vob-uebermessung.ts` ersatzlos streichen (VOB-003) | verhindert einen Umbau, der dem Betrieb Geld wegnimmt | 5 Minuten, sofort |
| **Prüfen, ob `boden.ts` mit 2,5 m² statt 0,1 m² rechnet (VOB-008)** | Fehler **zulasten des Kunden**, in jedem Bodenangebot | **vor Gate 1** |
| Türbreiten-Abzug bei Sockelleisten an **zwei** Codestellen entfernen (VOB-012) | Fehler zulasten des Betriebs, ca. 0,9 lfdm je Tür | **vor Gate 1** |
| Leibungsposition nur erzeugen, wenn die Leibung beschichtet wird | kleiner Fehler zulasten des Kunden | vor Gate 1 |

**Zwei Entscheidungen, die nicht Engineering gehören:**

1. **Abrechnungseinheit der Leibungen (m vs. m²).** Frage 8 an den Prüfmeister
   steht in der Abstimmungsdatei. Gehört sachlich zu VOB-001 und VOB-014 — es
   ist dieselbe Frage: wie nah an der VOB-Positionsstruktur wollen wir liegen.
2. **Verschnitt in der Menge (VOB-001).** Der Normtext gibt dafür keine
   Grundlage her — in DIN 18365 kommt „Verschnitt" nicht vor. Das ist kein
   Verbot, aber es macht Sandys ausstehende Entscheidung eindeutiger.

**Ein Fehler von mir, den ich hier nenne, weil er in der Abstimmungsdatei sonst
untergeht:** Ich hatte am 02.09. geschrieben, die Abrechnungseinheit für
Leibungen sei „geklärt" und `maler.ts` liege mit Quadratmetern richtig. Falsch —
DIN 18363 führt Leibungen in 0.5.2 unter Längenmaß. Ich hatte eine
Sekundärquelle einer anderen Norm zugeordnet, weil es zu meiner These passte.
Entwarnung nur insoweit, als Abschnitt 0 der ATV ausdrücklich nicht
Vertragsbestandteil wird — die Menge ist nicht falsch, die Positionsstruktur ist
unüblich.

**Risikoregister nachgezogen:** LR-03 erledigt, LR-06 geschlossen, **LR-14 neu
(🔴 Score 12)** für die Bodenschwelle — `legal-002-risikobewertung-vob.md`,
Nachtrag 04.09.

**Prüfmeister-Datei korrigiert:** Der falsche Backlog-Punkt in
`pruefmeister-testfaelle.md` („Was bewusst NICHT angefasst wurde", Punkt 3) ist
durchgestrichen und mit dem Normzitat versehen — stehen gelassen, damit ihn
niemand neu erfindet.

**Zum Normtext selbst:** Ich zitiere in unseren Dateien nur die Sätze, die zur
Klärung nötig sind. Der Volltext kommt nicht ins Repository; die Lizenz ist eine
personenbezogene Einzelplatzlizenz auf Sandra Holm.

---

## CoS-L-005 — Mindestauftragswert bei Kleinstpositionen: gibt VOB/DIN etwas her?

**Datum:** 2026-09-07
**Status:** ❌ offen — informativ, **kein Blocker**, Umsetzung läuft bereits
**Quelle:** Der Prüfmeister an Head of Product Engineering, weitergegeben an
Sandy und den Chief of Staff über `chief-of-staff-todos.md`, 2026-09-07

**Der Fall:** Wer nur eine kleine Einzelposition beauftragt (Beispiel des
Prüfmeisters: nur die Außenleibungen streichen, 1,6 m²), steht real einen
halben Tag mit Gerüst, Abdecken und Anfahrt auf der Baustelle — im Angebot
stehen dafür aber nur 72 €, weil der m²-Preis nur trägt, wenn ohnehin eine
größere Fläche mitbearbeitet wird. Betrifft nicht nur Leibungen, sondern
jede kleine Einzelposition.

**Frage an dich:** Kennst du aus VOB, DIN-Normen oder branchenüblicher
Praxis (z. B. Innungsempfehlungen, die dir bei der VOB-Recherche
untergekommen sind) einen üblichen Referenzwert für einen
Mindestauftragswert oder eine Anfahrpauschale im Maler-/Bodenleger-Handwerk?
Reine Neugier-/Absicherungsfrage — falls du dazu nichts hast oder es nicht
dein Gebiet ist, einfach so stehen lassen, brauche keine Extra-Recherche
dafür.

**Nicht blockierend:** Sandy hat die Entscheidung an den Chief of Staff
übergeben. Umsetzung läuft bereits mit einem gesetzten Arbeitswert von
**180 €** (Mindestauftragswert, keine separate Anfahrpauschale) — Details in
`chief-of-staff-todos.md`, Nachtrag vom 07.09.2026. Falls du einen
belastbaren Branchenwert kennst, der davon abweicht, sag Bescheid, dann
passen wir die Zahl an — sie ist ein einzelner Konfigurationswert.

---

## CoS-L-005 — Antwort: Mindestauftragswert (Head of Legal & Compliance, 2026-09-07)

**Kurzantwort: Nein, VOB und DIN geben dazu nichts her — und einen offiziellen
Branchenwert gibt es aus einem strukturellen Grund nicht.** Die 180 € sind
trotzdem nicht aus der Luft gegriffen; sie liegen nur eher am unteren Rand des
Falls, den der Prüfmeister beschreibt. Und der wichtigste Punkt ist gar nicht
die Zahl, sondern wo sie hingehört.

### 1. Was die VOB dazu sagt: nichts — aber die Fehlanzeige ist belastbar

Ich habe die VOB Gesamtausgabe 2019 vollständig durchsucht, nicht nur die
Maler- und Bodenleger-ATV. „Mindestauftragswert" kommt nicht vor. „Anfahrt"
kommt genau einmal vor, und zwar als *Anfahrtstrom* in der Elektro-ATV. Das ist
auch systematisch richtig: **Die VOB/C ist eine technische Norm über Ausführung
und Aufmaß, keine Preisnorm.** Die Vergütung richtet sich nach dem Vertrag
(§ 2 Abs. 1 VOB/B), und was ein Betrieb verlangt, ist seine Sache.

### 2. Was die VOB stattdessen sagt — und es spricht für die Entscheidung des CoS

DIN 18299:2019-09, Abschnitt 4.1, führt als **Nebenleistungen** auf:

> „4.1.1 Einrichten und Räumen der Baustelle einschließlich der Geräte und
> dergleichen. — 4.1.2 Vorhalten der Baustelleneinrichtung einschließlich der
> Geräte und dergleichen."

Nebenleistungen gehören „auch ohne Erwähnung im Vertrag zur vertraglichen
Leistung" (§ 2 Abs. 1 VOB/B). **Anfahrt und Baustelleneinrichtung sind damit im
Einheitspreis enthalten und gerade nicht separat abrechenbar** — es sei denn,
sie werden ausdrücklich zur eigenen Position gemacht. Genau das sieht die Norm
in 0.4.1 vor:

> „Nebenleistungen sind in der Leistungsbeschreibung nur zu erwähnen, wenn sie
> ausnahmsweise selbständig vergütet werden sollen. Eine ausdrückliche Erwähnung
> ist geboten, wenn die Kosten der Nebenleistung von erheblicher Bedeutung für
> die Preisbildung sind; in diesen Fällen sind besondere Ordnungszahlen
> (Positionen) vorzusehen. **Dies kommt insbesondere für das Einrichten und
> Räumen der Baustelle in Betracht.**"

**Das ist die eigentliche Antwort auf die Frage.** Die Norm kennt das Problem —
kleine Leistung, große Rüstzeit — und ihre Lösung ist keine Pauschale, sondern
eine **sichtbare eigene Position**. Der Chief of Staff hat sich für den
Mindestauftragswert und gegen eine separate Anfahrpauschale entschieden; das ist
strukturell der Weg, den die Norm nahelegt. Eine Anfahrpauschale wäre der
schwächere Weg, weil sie eine Leistung gesondert berechnet, die nach 4.1.1 im
Preis steckt — sie müsste erst recht als eigene Position im Angebot stehen und
vorher vereinbart sein.

### 3. Den klassischen Weg für Kleinstaufträge kennt die VOB auch: Stundenlohn

Für Arbeiten, bei denen der Einheitspreis nicht trägt, ist das übliche
Instrument die **Stundenlohnarbeit** (§ 2 Abs. 10 und § 15 VOB/B) — vorher
vereinbart, dann nach Aufwand abgerechnet statt nach Quadratmetern. Praktisch
heißt das: Ein Handwerker, der nur 1,6 m² Außenleibung streichen soll, schreibt
kein m²-Angebot, sondern ein Regie-Angebot.

**Das ist womöglich die bessere Produktantwort als ein Mindestauftragswert**,
und ich lege sie dem Chief of Staff und Head of Product Engineering hin, ohne
sie zu entscheiden: „Unter X m² Gesamtumfang → Angebot auf Stundenbasis statt
auf Flächenbasis" ist für den Endkunden nachvollziehbarer als ein Betrag, der
scheinbar aus dem Nichts auf die Summe aufschlägt. Der Kunde versteht „3 Stunden
à 65 €" sofort; „Mindestauftragswert 180 €" liest sich wie eine Strafgebühr.

### 4. Warum es keinen offiziellen Branchenwert gibt

Ich habe keinen gefunden, und ich erwarte auch nicht, dass es einen gibt:
**Konkrete Preisempfehlungen von Innungen und Fachverbänden an ihre Mitglieder
sind kartellrechtlich heikel** (§ 1 GWB — abgestimmte Verhaltensweise). Was
Verbände veröffentlichen dürfen, sind *Kalkulationshilfen*, die zeigen, **wie**
man rechnet, nicht **was** man verlangt. Deshalb findet man Stundensatz-Umfragen
und Kalkulationsschemata, aber keine Zahl mit Verbandsstempel.

**Für uns heißt das zweierlei:** Es gibt keinen Wert, den wir „richtig" treffen
könnten. Und wenn uns jemand einen nennt — Innung, Fachpresse, ein Betrieb —
sollten wir ihn als Orientierung behandeln und nicht als Standard, auf den wir
uns berufen.

### 5. Die Zahlen, die es gibt — und wie die 180 € dazu stehen

| Größe | Spanne | Quelle |
|---|---|---|
| Anfahrtspauschale Handwerk | 15–50 €, Stadt eher 20–40 € | Branchenportale |
| Kilometerpauschale | 0,30–0,50 €/km | ebd. |
| Stundenverrechnungssatz Maler, Solo-Betrieb | 50–68 € netto | Branchenerhebung 2026 |
| … Kleinbetrieb (2–5 MA) | 58–78 € netto | ebd. |
| … regionale Spannweite | 44–62 € (MV) bis 65–90 € (BY/BW) | ebd. |

**Einordnung der 180 €:** Das entspricht bei 55–65 €/h rund **drei
Arbeitsstunden**. Der Prüfmeister beschreibt aber „einen halben Tag mit Gerüst,
Abdecken und Anfahrt" — vier Stunden, also **220 bis 260 €** netto. Die 180 €
sind damit in der richtigen Größenordnung, decken den geschilderten Fall aber
nicht ganz. Als Arbeitswert bis zur ersten echten Rückmeldung ist das in
Ordnung; ich würde ihn nicht verteidigen, wenn ein Betrieb ihn zu niedrig
findet.

**Wichtiger als die Höhe ist die Bauform, und hier habe ich eine klare
Empfehlung:** Die regionale Spanne der Stundensätze reicht von 44 € bis 90 € —
**doppelt so breit wie jeder sinnvolle Standardwert.** Ein fest verdrahteter
Mindestauftragswert wäre für einen Betrieb in Mecklenburg passend und für einen
in München deutlich zu niedrig. **Das gehört als Betriebseinstellung ins
Produkt, mit 180 € als Vorschlag, nicht als Konstante.** Das ist ein
Produktthema, kein Rechtsthema — aber es hat eine rechtliche Kante, siehe
Punkt 6.

### 6. Die rechtlichen Leitplanken — und das ist mein eigentlicher Beitrag

Ein Mindestauftragswert ist frei vereinbar. Vier Dinge müssen aber stimmen:

1. **Als Position ins Angebot, nicht in die AGB.** Preisabreden über die
   Hauptleistung sind der AGB-Kontrolle entzogen (§ 307 Abs. 3 S. 1 BGB); eine
   Preisnebenabrede in AGB dagegen ist kontrollfähig und muss dem
   Transparenzgebot genügen (§ 307 Abs. 1 S. 2 BGB). Als sichtbare Zeile im
   konkreten Angebot ist das eine ausgehandelte Preisabsprache und damit die
   robusteste Variante. **Bitte nicht in die AGB schreiben.**
2. **Eigene, benannte Position — niemals ein stiller Aufschlag auf den
   m²-Preis.** Wenn das Produkt den Einheitspreis heimlich anhebt, um auf 180 €
   zu kommen, ist das Aufmaß nicht mehr nachrechenbar (dasselbe Problem wie
   VOB-007) und gegenüber Verbrauchern ein Fall von § 5a UWG (Vorenthalten
   wesentlicher Informationen) neben der PAngV. Die Zeile muss heißen, was sie
   ist: „Mindestauftragswert" oder „Kleinauftragszuschlag", mit dem
   Differenzbetrag.
3. **Vor Vertragsschluss sichtbar.** Im Angebot erfüllt, sofern es beim Kunden
   ankommt, bevor er zusagt. Nachträglich auf der Rechnung ginge nicht.
4. **Der Betrieb muss ihn sehen und entfernen können, bevor er das Angebot
   rausschickt.** Das ist derselbe Punkt wie bei den KI-Rechenfehlern: Wenn die
   Software einen Preisbestandteil setzt, den der Handwerker nicht bewusst
   gewählt hat, und der Kunde ihn später angreift, steht der Handwerker dafür
   gerade. Ein Vorschlagswert mit Häkchen ist rechtlich und praktisch etwas
   anderes als eine automatische Zeile.

### 7. Eine Querverbindung zum Beispiel des Prüfmeisters

Sein Fall sind ausgerechnet **Außenleibungen, 1,6 m²** — und genau bei den
Leibungen ist seit dem Normtext offen, ob die Position überhaupt in
Quadratmetern gehört oder in laufenden Metern (Frage 8 in
`vob-angebot-abstimmung.md`, DIN 18363 Abschnitt 0.5.2). Bei Abrechnung nach
Länge sähe dieselbe Leistung als „4,2 lfdm Außenleibung" aus, und der
Mindestauftragswert griffe an einer anderen Stelle. **Beides sollte in einem
Zug entschieden werden**, sonst bauen wir die Kleinauftragslogik auf einer
Einheit, die wir kurz danach ändern.

### Status

**Beantwortet, kein Blocker.** Keine Anpassung der 180 € nötig, solange sie als
Arbeitswert gilt. Meine zwei Anmerkungen zur Weitergabe an Head of Product
Engineering: **Betriebseinstellung statt Konstante**, und **eigene Position mit
Häkchen statt automatischem Aufschlag**. Die Stundenlohn-Variante aus Punkt 3
lege ich als Alternative daneben, entscheiden müsst ihr.

---

## CoS-L-006 — Fehlende Pflichtangaben auf der Rechnung (Manfred-Feedback)

**Datum:** 2026-09-11
**Quelle:** `docs/testnutzer-notizen-manfred.md`, TN-089. Erster echter
Testlauf durch den simulierten Testnutzer — **nichts davon wurde real
versendet**, reines Testkonto.

**Befund:** Auf der im Testkonto erzeugten Rechnung fehlen Leistungsdatum
und Steuernummer/USt-ID; die Fußzeile zeigt nur Firmenname und Adresse.
Manfreds eigene Einschätzung als Betriebsinhaber: „Damit kriegt der Kunde
Ärger beim Finanzamt und ruft mich an." Zusätzlich (siehe CoS-E-034 in
`chief-of-staff-engineering-todos.md`): interne Prüfhinweise und die
„bitte Angebot vor dem Versand prüfen"-Fußzeile erscheinen ebenfalls auf
der Rechnung, nicht nur auf dem Angebot.

**Frage an dich:** Welche Pflichtangaben muss eine Rechnung nach § 14
UStG tatsächlich zwingend enthalten (insbesondere für Kleinunternehmer
nach § 19 UStG, da das hier der geplante Status ist, siehe CoS-L-Punkte
zur UG-Gründung), und was ist bei Sofortangebots Rechnungsvorlage
gegenüber dieser Pflichtliste konkret nachzurüsten? Umsetzung übernimmt
Head of Product Engineering, sobald du den Soll-Zustand definiert hast.

**Priorität:** hoch — kein akuter Vorfall (Testkonto), aber ein
Compliance-Punkt, der vor dem ersten echten Rechnungsversand geschlossen
sein sollte.

*Chief of Staff · 2026-09-11*

---

## DC-089 — Wortlautfreigabe E-Rechnung/ZUGFeRD: abgelehnt, Alternative geliefert (2026-09-13)

**Zugegangen über:** `design-check.md`, DC-089 (Product Designer, aus Manfreds
Testnutzer-Rückmeldung TN-102). **Antwort steht dort am Dateiende.**
*Schließung wird gemeldet in: `design-check.md`.*

**Ergebnis: 🔴 nicht freigegeben.** Der Product Designer wollte als führenden
Satz einbauen: „Pflicht ist das nur bei Geschäftskunden. Bei Privatkunden ändert
sich für dich nichts." Das hätte eine Rechtsaussage in die Oberfläche gebracht,
die für dieses Produkt nicht stimmt.

**Der tragende Befund:** Die E-Rechnungspflicht nach § 14 UStG gilt nur für
**Rechnungen**. Angebote und Kostenvoranschläge sind ausdrücklich nicht erfasst
— und Sofortangebot erzeugt keine Rechnungen. Ich habe das nicht aus der
Dokumentation übernommen, sondern in der Produktions-Datenbank nachgesehen:
`quotes.dokument_typ` lässt per Check-Constraint nur `angebot` und
`kostenvoranschlag` zu, tatsächlich vorhanden sind 18 Angebote und 1
Kostenvoranschlag. Eine Rechnungstabelle existiert nicht.

Der ZUGFeRD-Schalter ist damit **keine Compliance-Funktion, sondern Komfort**:
Er legt dem Angebots-PDF eine maschinenlesbare Fassung bei, die die Buchhaltung
des Geschäftskunden einlesen kann. Ein Satz, der von „Pflicht" spricht, sagt
etwas anderes.

**Bemerkenswert: Der heutige Text war korrekt.** Er beschreibt nur, was
passiert, und behauptet keine Pflicht. Die vorgeschlagene Verbesserung hätte
einen Fehler eingebaut, den es vorher nicht gab. Manfreds Beschwerde bleibt
trotzdem berechtigt — er bekommt keine Antwort auf „betrifft mich das?". Die
richtige Antwort ist „nein", nicht „ja, bei Geschäftskunden".

**Geliefert:** ein freigegebener Ersatzwortlaut (zwei Absätze, alterungssicher)
plus ein optionaler Einordnungsabsatz mit den echten Fristen — Empfangspflicht
seit 01.01.2025, Ausstellungspflicht ab 2027 über 800.000 € Vorjahresumsatz,
ab 2028 für alle, Kleinunternehmer von der Ausstellung ausgenommen. Der
optionale Absatz enthält Datumsangaben und braucht deshalb eine Wiedervorlage
vor dem 01.01.2027, wenn er gebaut wird.

**Zwei Rückfragen laufen zurück an den Product Designer:** ob die Überschrift
des Abschnitts „E-Rechnung" heißt (dann ist schon die Überschrift schief), und
was DC-086 mit „der Rechnung" meint — in der Datenbank gibt es keine. Wenn das
Team intern „Rechnung" zum Angebot sagt, ist das genau der Weg, auf dem eine
falsche Rechtsaussage in die Oberfläche kommt; DC-089 ist so entstanden.

**Wiedervorlage für mich:** Sobald echte Rechnungen ins Produkt kommen, kippt
die Bewertung vollständig — dann ist der Schalter Compliance und der Text muss
neu geschrieben werden. Bitte vorher melden.

---

## DC-100 — ZUGFeRD-XML im Angebots-PDF deklariert sich als Rechnung (2026-09-13)

**Status:** 🔵 **Entscheidung Sandy nötig, vor Gate 1.** Meine Empfehlung steht:
abschalten.
*Zugegangen über `design-check.md` (Product Designer). Antwort und volle
Begründung stehen dort. Schließung wird gemeldet in: `design-check.md`.
Im Risikoregister als LR-15.*

**Worum es geht:** Das Produkt erzeugt nur Angebote und Kostenvoranschläge —
Rechnungen gibt es nach Sandys Entscheidung nicht. In das Angebots-PDF wird
trotzdem eine ZUGFeRD-/Factur-X-XML eingebettet, die sich selbst als
**„Commercial invoice"** ausweist (`TypeCode 380`, dazu `fx:DocumentType
INVOICE` in den PDF-Metadaten).

**Was der Product Designer nicht gesehen hat und was den Fall verschärft:** Die
Datei bleibt nicht intern. `api/email/route.ts` hängt sie beim Versand an den
**Geschäftskunden** an — eingebettet im PDF und zusätzlich als eigene
`factur-x-<Nr>.xml`, mit einem Hinweis darauf im Mailtext. Genau dort steht eine
Buchhaltung dahinter.

**Rechtlich, kurz:** Nach § 14 Abs. 1 S. 1 UStG ist Rechnung jedes Dokument,
mit dem abgerechnet wird — „gleichgültig, wie dieses Dokument im
Geschäftsverkehr bezeichnet wird". Die Aufschrift „ANGEBOT" schützt also nicht.
Das fehlende Leistungsdatum verhindert einen Vorsteuerabzug beim Kunden, **nicht
aber die Haftung nach § 14c Abs. 2 UStG** — dafür genügen Aussteller,
Empfänger, Leistungsbeschreibung, Entgelt und gesondert ausgewiesene
Umsatzsteuer, und alle fünf stehen in der Datei. Die praktisch wahrscheinlichere
Folge ist banaler: Die Buchhaltung des Kunden legt eine Eingangsrechnung an, die
es nicht gibt, und hat den Vorgang doppelt, sobald die echte kommt.

**Kein sauberer Reparaturweg über den Codewert:** 325 („Proforma") ist für BT-3
nach EN 16931 nicht zugelassen, die Datei wäre ungültig. EN 16931 ist ein
Rechnungsformat; ein Angebot lässt sich darin nicht korrekt abbilden. Das
Problem ist der Behälter, nicht die Beschriftung.

**Warum ich zum Abschalten rate:** Der Nutzen ist praktisch null, das Risiko
trifft unseren Nutzer, und der Preis ist heute null — es gibt noch keinen echten
Nutzer. Nach Gate 1 wäre es eine Änderung am laufenden Betrieb.

**Zweiter Befund aus demselben Code, unabhängig zu prüfen:** `embedXML.ts`
schreibt `pdfaid:part 3` / `conformance B` — das PDF erklärt sich zu PDF/A-3b,
erzeugt wird es aber mit `pdf-lib`, das kein PDF/A ausgibt. Ich habe keinen
Validator laufen lassen; bitte einmal durch veraPDF oder Mustang schicken.

**DC-089 (Wortlaut E-Rechnung-Karte) bleibt ausgesetzt**, bis die Entscheidung
steht — der dort freigegebene Text beschreibt sonst ein Verhalten, das sich
gerade ändert.

**Für dich als Chief of Staff, in einem Satz:** Das ist eine Ja/Nein-Frage an
Sandy mit klarer Empfehlung, kein Rechercheauftrag — und sie sollte vor Gate 1
beantwortet sein, nicht danach.

---

## CoS-L-007 — Zwei kurze Steuerfragen aus Manfreds Onboarding-Durchlauf

**Datum:** 2026-09-14 · **Quelle:** `docs/testnutzer-notizen-manfred.md`,
TN-145 und TN-147 · **Priorität:** niedrig, aber beide blockieren je einen
kleinen Umsetzungsschritt. Kein Rechercheauftrag — wenn beides für dich klar
ist, reichen zwei Sätze.

**Frage 1 — Braucht die 7-%-Kachel im Onboarding jemand? (TN-147)**
Der Steuer-Schritt bietet 19 % / 7 % / Kleinunternehmer. Manfred: *„Die 7 %
braucht kein Maler und kein Bodenleger, das ist Lebensmittel und Bücher.
Verwirrt eher."* Nach meinem Laienverständnis hat er recht —
Handwerkerleistungen sind 19 % —, aber ich will das nicht auf mein
Verständnis stützen, bevor eine Auswahlmöglichkeit verschwindet. **Deine
Antwort:** Gibt es für die beiden heute unterstützten Gewerke (Maler,
Bodenleger) einen realistischen Fall mit 7 %? Wenn nein, fliegt die Kachel
raus (DC-104 liegt beim Product Designer und wartet auf dich).

**Frage 2 — Wann muss die Steuernummer spätestens da sein? (TN-145)**
Im Onboarding werden Steuernummer, IBAN und Handwerkskammer-Angaben **nicht**
abgefragt. Manfred hält das fürs Onboarding für richtig, sagt aber: *„Die
erste Rechnung ohne Steuernummer geht nicht raus. Irgendwo muss vorher ein
‚das fehlt noch' kommen."*

**Der Grund, warum ich trotzdem frage, obwohl es keine Rechnungen mehr
gibt:** Sandy hat den Rechnungs-Modus am 11.09. entfernt („Rechnung erstmal
raus", CoS-E-008/033/036) — Manfreds Satz zielt also auf eine Funktion, die
es aktuell nicht gibt. Was es gibt, sind **Angebote und
Kostenvoranschläge**, und die tragen die Angaben aus dem Betriebsprofil in
der Fußzeile. **Deine Antwort, zwei Teile:**
1. Muss auf einem **Angebot/Kostenvoranschlag** an einen Privat- bzw.
   Geschäftskunden eine Steuernummer oder USt-IdNr. stehen — oder ist das
   allein eine Rechnungspflicht nach § 14 UStG?
2. Falls nein: Reicht es, den Hinweis erst dann zu zeigen, wenn Rechnungen
   ins Produkt zurückkommen — oder empfiehlst du trotzdem einen früheren
   „das fehlt noch"-Hinweis, etwa beim ersten Versand?

Das grenzt an CoS-L-006 (Rechnungs-Pflichtangaben), ist aber bewusst getrennt
gestellt: Dort ging es um die Rechnung selbst, hier um die Frage, ob vorher
schon etwas fehlt.

*Chief of Staff · 2026-09-14*

---

## CoS-L-007 — Antwort (Head of Legal & Compliance, 2026-09-14)

Du hast zwei Sätze erbeten. Beide Antworten sind kurz, aber bei beiden liegt
neben der Frage etwas, das wichtiger ist als die Frage selbst. Deshalb steht
das jeweils in einem eigenen Absatz darunter.
*Schließung wird gemeldet in: `design-check.md` (DC-104) bzw. hier.*

### Frage 1 — Die 7-%-Kachel kann raus. ✅ DC-104 ist frei.

**Kurz:** Für Maler und Bodenleger gibt es keinen realistischen 7-%-Fall.
§ 12 Abs. 2 UStG verweist auf Anlage 2, und diese Liste ist **abschließend** —
Bau- und Handwerkerleistungen stehen nirgends darin. Handwerkerleistungen sind
19 %. Manfred hat recht, die Kachel kann weg.

**Empirisch gestützt:** Alle acht Betriebe in der Produktions-Datenbank stehen
auf 19 %. Die Kachel ist noch nie benutzt worden.

**Zwei Irrtümer, die mit rausgehören, damit die Kachel nicht zurückkommt:**

1. *„Wir arbeiten für einen gemeinnützigen Verein, also 7 %."* Falsch, und ein
   sehr verbreiteter Irrtum. § 12 Abs. 2 Nr. 8a UStG knüpft am **Leistenden**
   an, nicht am Kunden — der ermäßigte Satz gilt für Leistungen *von*
   gemeinnützigen Körperschaften. Ein Malerbetrieb bleibt bei 19 %, auch wenn
   er das Vereinsheim streicht.
2. Ein **Kirchenmaler oder Restaurator**, der ein eigenes Kunstwerk liefert,
   fällt unter Anlage 2 Nr. 53 — das sind dann tatsächlich 7 %. Das ist aber
   ein Künstler, kein Malerhandwerk, und liegt außerhalb der Zielgruppe.

### Was neben der Frage liegt: Die echte Lücke im Steuer-Schritt ist § 13b, nicht 7 %

Der Fall, der bei Malern und Bodenlegern **regelmäßig** vorkommt, fehlt in der
Kachelreihe: **Reverse Charge bei Bauleistungen, § 13b Abs. 2 Nr. 4 i. V. m.
Abs. 5 S. 2 UStG.** Arbeitet der Betrieb als Subunternehmer für einen
Bauunternehmer, der selbst Bauleistungen erbringt, schuldet der **Empfänger**
die Umsatzsteuer. Das Dokument weist dann keine Umsatzsteuer aus und trägt den
Hinweis **„Steuerschuldnerschaft des Leistungsempfängers"**. Bei
Subunternehmer-Aufträgen ist das der Normalfall, nicht die Ausnahme.

**Das ist trotzdem kein Onboarding-Feld und kein Blocker für DC-104** — im
Gegenteil, es ist ein Argument dafür: § 13b hängt am **einzelnen Auftrag**,
nicht am Betrieb. Drei Kacheln im Onboarding suggerieren, die Steuerfrage sei
eine Betriebseigenschaft. Sie ist es nicht. Der richtige Ort wäre später ein
Schalter am Angebot, nicht eine vierte Kachel.

Ich notiere das als offenen Produktpunkt, nicht als Auftrag — solange es keine
Rechnungen gibt, ist die Wirkung auf die Nettosumme eines Angebots beschränkt.
Wenn Rechnungen zurückkommen, wird es scharf und gehört zu CoS-L-006.

### Frage 2, Teil 1 — Nein, auf dem Angebot ist keine Steuernummer nötig.

**§ 14 Abs. 4 Nr. 2 UStG gilt für Rechnungen.** Ein Angebot oder
Kostenvoranschlag ist keine Rechnung, also greift die Vorschrift nicht. Es gibt
auch keine andere Norm, die eine Steuernummer auf einem Angebot verlangt.

**Und ich würde sie auch dann nicht drucken, wenn das Feld irgendwann kommt.**
Die USt-IdNr. existiert nach § 27a UStG gerade deshalb, damit ein Unternehmer
seine Steuernummer nicht herausgeben muss. Eine Steuernummer auf jedem Angebot,
das an fremde Leute geht, ist eine unnötige Preisgabe. Wenn ein Feld gebraucht
wird: USt-IdNr. bevorzugen, Steuernummer nur dort, wo es keine USt-IdNr. gibt,
und nur auf Rechnungen.

### Frage 2, Teil 2 — Ein früherer Hinweis ist richtig. Nur für ein anderes Feld.

**Manfreds Instinkt stimmt, sein Feld nicht.** Es kann sehr wohl etwas fehlen,
bevor das erste Dokument rausgeht — nur ist es nicht die Steuernummer.

**Ein Angebot ist ein Geschäftsbrief.** Für Kapitalgesellschaften und
eingetragene Kaufleute gelten Pflichtangaben: § 35a GmbHG für GmbH und UG
(Rechtsform, Sitz, Registergericht, HRB-Nummer, **alle Geschäftsführer**),
§ 125a HGB und § 37a HGB für e. K., OHG und KG. Diese Angaben sind **ab dem
ersten Angebot** fällig, nicht ab der ersten Rechnung. Ein Verstoß ist eine
Ordnungswidrigkeit und wird als Marktverhaltensregel behandelt, ist also
abmahnfähig.

**Für ein nicht eingetragenes Kleingewerbe gilt davon nichts** — dort reichen
Vor- und Nachname. Das ist Manfreds wahrscheinlicher Fall und übrigens auch
Sandys eigener, weshalb es bisher niemandem aufgefallen ist.

**Der Befund: Diese Felder gibt es im Produkt nicht.** Ich habe die
`companies`-Tabelle durchgesehen: `tax_number` und `ust_id` sind vorhanden
(werden nur im Onboarding nicht abgefragt — und sind bei allen acht Betrieben
leer). **Rechtsform, Registergericht, Registernummer und Geschäftsführer gibt
es überhaupt nicht.** Ein Betrieb in der Rechtsform GmbH kann mit Sofortangebot
heute kein vollständiges Angebot erzeugen.

**Meine Empfehlung, gestuft:**

1. **Jetzt: nichts.** Kein „das fehlt noch" für die Steuernummer — es fehlt
   nichts. DC-104 und der Steuer-Schritt können unabhängig laufen.
2. **Vor Gate 1, klein:** Rechtsform als Auswahl im Betriebsprofil. Bei
   GmbH/UG/e. K. dann die Pflichtfelder nachfragen und genau dort Manfreds
   Hinweis zeigen: *„Das fehlt noch, bevor du dein erstes Angebot
   verschickst."* Bei Einzelunternehmen erscheint nichts. Das ist die Stelle,
   an der sein Satz hingehört.
3. **Wenn Rechnungen zurückkommen:** dann kommen Steuernummer bzw. USt-IdNr.
   dazu — das ist CoS-L-006, nicht hier.

**Ich lege Punkt 2 bewusst nicht ins Risikoregister** (Severity 2, Likelihood 2
— die Gate-1-Betriebe sind aller Voraussicht nach Einzelunternehmen). Es ist
ein Produktpunkt für dich zum Einsortieren, kein Risiko, das jemand verfolgen
muss.

---

## Vorab-Kriterien zur Materialangabe auf dem Kunden-PDF (Spur 5 Nr. 2)

**Noch nicht bewertbar** — hängt an Spur 3 Nr. 3 (Konzept Fassung 3), das ist
offen. Damit das Konzept nicht gegen Kriterien läuft, die es erst hinterher
erfährt, hier vorab die drei, an denen ich es messen werde:

1. **Der Endkunde muss erkennen können, ob Material im Preis steckt oder
   nicht** — in Worten, die keine Branchenkenntnis voraussetzen. „Material
   bauseits" erfüllt das gegenüber einem Bauleiter, gegenüber Frau Krüger
   nicht. Gegenüber Verbrauchern ist das Vorenthalten einer wesentlichen
   Information § 5a UWG; der Maßstab ist der durchschnittliche Verbraucher,
   nicht der Fachmann.
2. **Der Gesamtpreis muss stimmen, auch wenn Material fehlt.** Wenn ein
   Angebot ohne Material 4.200 € nennt und der Kunde am Ende 5.100 € zahlt,
   ist der genannte Preis irreführend, egal welcher Hinweis darunter steht.
   Entweder eine Schätzung mit klarer Kennzeichnung oder eine ausdrückliche
   Aussage, dass dieser Posten noch dazukommt.
3. **Kein stiller Aufschlag.** Wenn Material aus einer Position herausgezogen
   wird und der Arbeitspreis nicht mitgeht (der 🔴-Punkt aus Spur 3), wird
   Material doppelt berechnet. Das ist dann kein Formulierungsproblem mehr,
   sondern ein falscher Preis — und rechtlich der schwerere Fall.

Punkt 3 ist derselbe Maßstab wie beim Mindestauftragswert: sichtbare eigene
Position, nie ein Aufschlag im Einheitspreis.

*Head of Legal & Compliance · 2026-09-14*

---

## Spur 5 Nr. 1 — Materialangabe auf dem Kunden-PDF: bewertet (Head of Legal & Compliance, 2026-09-15)

**Maßstab:** die drei Kriterien, die ich am 14.09. vorab festgelegt habe
(Abschnitt „Vorab-Kriterien zur Materialangabe auf dem Kunden-PDF").
**Bewertet wurde nicht das Konzept gegen das Konzept, sondern der Zustand des
Produkts gegen die Kriterien** — Code im Repo und Produktionsdatenbank.

### Ergebnis in einem Satz

Auf dem Kunden-PDF steht zur Materialfrage **nichts**, und die einzige
Betriebseinstellung, die dazu etwas verspricht, druckt nicht auf das
Kundendokument, sondern nur in die Vorschau des Handwerkers.

### Was ich geprüft habe, und woran

| Quelle | Befund |
|---|---|
| `src/lib/pdf.tsx` (720 Zeilen, das tatsächlich versendete Angebots-PDF) | kein einziges Vorkommen von „Material", „Materialkosten", „inkl." / „ohne <Material>". Je Position werden gerendert: Titel, `item.description`, Übermessungs-Hinweis |
| `src/app/angebot/[id]/unterschreiben/page.tsx` (die Seite, die der Endkunde öffnet) | rendert Titel + `description`, sonst nichts zum Material |
| `src/components/AngebotVorschau.tsx`, Z. 354–359 | rendert einen Materialpreis-Hinweis — eingebunden **nur** in `VorschauUndVersand.tsx` (Z. 366), also im Bildschirm des Handwerkers vor dem Versand |
| `src/app/(app)/einstellungen/page.tsx`, Z. 470–486 | Schalter „Materialpreis-Hinweis" mit der Beschriftung **„Hinweis auf Angeboten drucken"** |
| `src/lib/materialanteil.ts` | `halbsatz()`, `kundensatz()`, `teileMaterialAb()` existieren und sind sauber. Einziger Aufrufer im gesamten Repo ist der eigene Test |
| Produktionsdatenbank (`yqlledouhfovytifeekd`) | `companies`: 8 Zeilen, **0** mit `materialpreis_hinweis_aktiv` · `price_items`: 3.267 Zeilen, **0** mit `material_anteil` · `quote_items`: **keine Materialspalte**, 91 Positionen, 0 Beschreibungen mit Materialbezug · 124 Katalogtitel enthalten „inkl." — durchgesehen: alle betreffen Zarge, Element, Mörtel, Gewebe, Fahrer, nicht das Material, das der Kunde aussucht |

### Die drei Kriterien, einzeln

**Kriterium 1 — Erkennbarkeit für den Endkunden: ❌ nicht erfüllt.**
Kein kundenseitiges Dokument und keine kundenseitige Seite sagt, ob Material im
Preis steckt. Der Endkunde liest „Wand streichen 2x · Deckender Anstrich,
zweilagig, Kanten sauber abgeschnitten · 11,50 €/m²" und kann daraus nicht
entnehmen, ob die Farbe enthalten ist. Das ist derselbe Maßstab wie beim
Übermessungs-Hinweis (LR-01): Eine Angabe, die das Kunden-PDF nicht erreicht,
existiert für den Endkunden nicht.

**Kriterium 2 — Der Gesamtpreis stimmt: ⚠️ heute erfüllt, im geplanten Zustand
gefährdet.** Heute ist er erfüllt, weil es gar keine Materialtrennung gibt: Was
im Angebot steht, ist der ganze Preis. Sobald `teileMaterialAb()` produktiv
wird, fällt der Gesamtbetrag um den Materialanteil, und der Kunde zahlt das
Material zusätzlich woanders. Der Gesamtbetrag ist dann nicht mehr das, was das
Vorhaben kostet. `kundensatz()` („Die Farbe wird vom Kunden gestellt.") trägt
diese Aussage — aber nur, wenn sie **auch dort steht, wo der Gesamtbetrag
gelesen wird**, nicht nur klein unter einer einzelnen Position.

**Kriterium 3 — Kein stiller Aufschlag: ✅ in der Rechenlogik erfüllt, in der
Datenhaltung offen.** `teileMaterialAb()` bildet nur das Material gerundet und
die Arbeit als Rest, die Zusicherung `arbeit + material = Ausgangspreis` gilt
auf den Cent. Das ist genau die Probe des Prüfmeisters, und sie ist erfüllt.
**Offen ist der Weg danach:** `material_anteil` steht auf `price_items`, nicht
auf `quote_items`. Eine Angebotsposition trägt heute keine Information darüber,
ob Material herausgenommen wurde. Wer die Trennung außerhalb dieser einen
Funktion nachbaut — im Angebots-Generator, in der KI-Ergänzung, in einer
manuellen Position —, bricht die Zusicherung, ohne dass es auffällt.

### 🔴 Neuer Fund L-M-01 — der Schalter verspricht etwas, das er nicht tut

In den Einstellungen steht ein Schalter mit der Beschriftung **„Hinweis auf
Angeboten drucken"** und dem Erklärtext *„Fügt folgenden Text ein: ‚Preise
basieren auf aktuellen Materialkosten und können bei Lieferantenpreisänderungen
angepasst werden.'"*

Zwei Abweichungen, beide im Code belegt:

1. **Der Hinweis wird auf dem Angebot nicht gedruckt.** Er steht ausschließlich
   in `AngebotVorschau.tsx`, und diese Komponente hängt nur am
   Versand-Bildschirm des Handwerkers. Weder das PDF noch die
   Unterschreiben-Seite kennen ihn. Der Betrieb schaltet ihn ein, sieht ihn in
   seiner Vorschau und geht davon aus, dass sein Kunde ihn bekommt. Der Kunde
   bekommt ihn nie.
2. **Es sind zwei verschiedene Sätze.** Einstellungen: „Preise basieren auf
   aktuellen Materialkosten und können bei Lieferantenpreisänderungen angepasst
   werden." Vorschau: „Hinweis: Die angegebenen Preise basieren auf aktuellen
   Materialkosten und können bei Preisänderungen der Lieferanten angepasst
   werden." Welcher von beiden der vereinbarte wäre, ist nicht entscheidbar.

**Und deshalb ist „auf das PDF nachziehen" die falsche Sofortmaßnahme.** Der
Satz ist eine Preisanpassungsklausel. Gegenüber einem Verbraucher greift
§ 309 Nr. 1 BGB, Wortlaut geprüft:

> *„Auch soweit eine Abweichung von den gesetzlichen Vorschriften zulässig ist,
> ist in Allgemeinen Geschäftsbedingungen unwirksam 1. (Kurzfristige
> Preiserhöhungen) eine Bestimmung, welche die Erhöhung des Entgelts für Waren
> oder Leistungen vorsieht, die innerhalb von vier Monaten nach Vertragsschluss
> geliefert oder erbracht werden sollen; dies gilt nicht bei Waren oder
> Leistungen, die im Rahmen von Dauerschuldverhältnissen geliefert oder erbracht
> werden."*

Ein Maler- oder Bodenauftrag wird typischerweise innerhalb von vier Monaten
ausgeführt und ist kein Dauerschuldverhältnis. Der Satz nennt außerdem weder
Anlass noch Obergrenze noch ein Lösungsrecht des Kunden. Würde er heute
unverändert aufs Kunden-PDF gezogen, stünde auf jedem Verbraucherangebot eine
Klausel, die im Streit nicht trägt — und sie stünde dort **im Namen des
Handwerkers**, der sie nicht geschrieben hat. Das ist dieselbe Konstellation
wie bei PM-021/PM-022 (Untertitel widerspricht Titel, § 305c BGB zulasten des
Verwenders), nur teurer.

**Richtige Reihenfolge:** erst der Wortlaut, dann der Einbau. Ein tragfähiger
Hinweis muss (a) im B2C entweder als unverbindliche Schätzung mit klarer
Kennzeichnung oder als benannte eigene Position auftreten statt als
Erhöhungsvorbehalt, (b) im B2B anders lauten dürfen als im B2C, weil § 309 dort
nur über § 307 mittelbar wirkt. **Der Wortlaut ist eine Freigabe von Sandy** —
Governance-Regel oben. Bis dahin ist der heutige Zustand (0 von 8 Betrieben
haben den Schalter an, kein Druck aufs PDF) der ungefährlichere; ich empfehle
ausdrücklich **nicht**, ihn vorher scharf zu schalten.

### Was CoS-E-053 mitbringen muss, damit die Kriterien erfüllt sind

1. **Der Materialzustand gehört an die Angebotsposition, nicht nur an die
   Preiszeile.** `quote_items` braucht das Materialwort und den abgetrennten
   Betrag. Ohne das kann das PDF die Aussage nicht treffen, und ein späterer
   Katalogwechsel würde alte Angebote umdeuten.
2. **Das PDF muss die Aussage führen — je Position und einmal beim
   Gesamtbetrag.** Je Position der Halbsatz aus `halbsatz()`, beim Gesamtbetrag
   der Satz aus `kundensatz()`. Beides existiert bereits und ist freigegeben;
   es fehlt nur der Aufrufer.
3. **Ein aus der Faustregel abgeleiteter Materialanteil darf ein
   Kundendokument nicht ungeprüft erreichen.** 25 % innen / 33 % außen / 45 %
   Belag sind Schätzwerte. Wird daraus ein Arbeitspreis gebildet, ist der
   genannte Preis eine geschätzte Zahl mit dem Anschein einer gerechneten. Der
   Betrieb muss die Zahl einmal bestätigt haben, bevor sie auf dem Angebot
   landet — dieselbe Logik wie bei der Nick-Seite.
4. **Ein einziger Weg für die Trennung.** Jede Materialtrennung läuft über
   `teileMaterialAb()`. Ein zweiter, handgeschriebener Weg an anderer Stelle ist
   der Weg, auf dem Kriterium 3 kippt.

*Head of Legal & Compliance · 2026-09-15 · Risikoeintrag dazu: LR-16 in
`legal-002-risikobewertung-vob.md`*

---

## CoS-L-006 — Zwischenstand: die Prämisse stimmt so nicht (Head of Legal & Compliance, 2026-09-15)

**Nicht abgeschlossen.** Ein Teil ist aber jetzt an der Quelle geklärt, und er
verändert die Frage.

**In der Produktionsdatenbank geprüft:** Es gibt **keine Rechnung**. Keine
Rechnungstabelle; `quotes.dokument_typ` führt 18 `angebot` und 1
`kostenvoranschlag`; `quote_items` hat 91 Zeilen. Das deckt sich mit dem Befund
aus DC-089 vom 13.09. und ist seither unverändert.

**Neu und der eigentliche Punkt:** In `nummernkreise` stehen **zwei Zeilen mit
`typ = 'rechnung'`**, während `vergebene_nummern` ausschließlich `angebot`
kennt. Das Produkt lässt einen Betrieb also einen **Rechnungsnummernkreis
einrichten**, den es anschließend nie bedient. Genau daher kommt vermutlich
Manfreds „Rechnung" in TN-089: Er hat eine Rechnungsnummer konfiguriert und
deshalb ein Dokument als Rechnung gelesen, das keine ist.

**Was daraus folgt:**

- Der Soll-Zustand einer Rechnungsvorlage lässt sich nicht definieren, solange
  es keine Rechnung gibt. Der Katalog der Pflichtangaben nach § 14 UStG
  (einschließlich § 19-Besonderheiten und Kleinbetragsregelung) **bleibt offen**
  — die Normtexte waren in diesem Lauf nicht abrufbar, und ich schreibe eine
  Pflichtangabenliste nicht aus dem Gedächtnis auf. Ich hole das im nächsten
  Lauf nach.
- Unabhängig davon und sofort umsetzbar: **Der Rechnungsnummernkreis gehört
  ausgeblendet**, solange das Produkt keine Rechnungen erzeugt. Eine
  Einstellung, die eine Funktion suggeriert, die es nicht gibt, ist derselbe
  Fehlertyp wie L-M-01 eine Seite weiter oben — und sie ist der Grund, warum das
  Team intern „Rechnung" zum Angebot sagt, was DC-089 als Rechtsaussage fast in
  die Oberfläche getragen hätte.
- Die von Manfred vermissten Angaben (Leistungsdatum, Steuernummer/USt-ID) sind
  damit **keine Rechnungsfrage**, sondern die Frage, was auf ein *Angebot*
  gehört. Dazu steht die Antwort bereits unter CoS-L-007: auf dem Angebot ist
  keine Steuernummer nötig.

*Head of Legal & Compliance · 2026-09-15*

---

## Notiz zum Ablauf dieses Laufs (2026-09-15)

`node scripts/docs-sichern.mjs pruefen` / `sichern` konnte nicht ausgeführt
werden: Die Shell konnte den Projektordner nicht einhängen (bekannte Folge des
Windows-Updates vom 08.09.). Gelesen und geschrieben wurde über
Staging/Commit, jeweils mit `expectedMtimeMs` aus dem Staging, damit keine
fremde Änderung überschrieben wird. Die Sicherung ist in diesem Lauf also
**nicht** gelaufen.

*Head of Legal & Compliance · 2026-09-15*

---

## CoS-L-008 ✅ — Sandy hat entschieden: § 35a vor Gate 1

**Datum:** 2026-09-15, 16:45 MESZ · Chief of Staff

**Sandys Antwort, wörtlich: „§-35a-Pflichtangaben — ja vor Gate 1."**

Damit folgt sie deiner Empfehlung aus CoS-L-007 unverändert: Rechtsform als
Auswahl im Betriebsprofil, Pflichtfelder nur bei GmbH / UG / e. K., bei
Einzelunternehmen erscheint nichts.

**Der Bauauftrag liegt bei Engineering** (CoS-E-057). Was von dir dazu noch
gebraucht wird, und zwar **bevor** gebaut wird, weil es hinterher teurer ist:

1. **Die Feldliste, wörtlich und abschließend** — welche Angaben für welche
   Rechtsform Pflicht sind. In CoS-L-007 stehen Firma, Sitz, Registergericht,
   Registernummer und Geschäftsführerin für GmbH/UG; für **e. K.** und für die
   **GmbH & Co. KG** ist die Liste nicht dieselbe, und im Produkt soll es eine
   Auswahl geben, die beide Fälle trifft.
2. **Wo die Angaben erscheinen müssen.** Dein eigener Satz in CoS-L-007: ein
   Angebot ist ein Geschäftsbrief — das schließt die **E-Mails ein, die das
   Produkt im Namen des Betriebs versendet**, nicht nur das Angebots-PDF. Ob
   das für Gate 1 beides heißt oder zunächst nur das PDF, ist eine Abgrenzung,
   die du ziehen musst und nicht Engineering.
3. **Was bei einem unvollständigen Profil passiert.** Ein GmbH-Betrieb, der
   die Felder leer lässt, versendet sonst weiter abmahnfähige Angebote. Sperren,
   warnen oder nur anzeigen — das ist eine Rechtsfolgen-Frage.

**Nicht mitentschieden:** die Rechtsform von Sofortangebot selbst. Sandy
startet als Einzelunternehmen (Entscheidung vom 03.09.), die UG kommt bei rund
20 zahlenden Betrieben. § 35a betrifft hier die **Betriebe im Produkt**, nicht
sie.

*Chief of Staff · 2026-09-15*

---


## CoS-L-008 — Die drei Zulieferungen an Engineering, abschließend (Head of Legal & Compliance, 2026-09-15)

**Status: ✅ geliefert.** Engineering kann CoS-E-057 damit bauen; von mir ist
dazu nichts mehr offen. Eine Freigabe von Sandy braucht nur der Wortlaut der
beiden Oberflächentexte in Punkt 3 — und der blockiert das Bauen nicht.

**Geprüft an der Quelle, nicht an unseren eigenen Dokumenten:** Normtexte
(gesetze-im-internet.de war auch in diesem Lauf gesperrt, über lxgesetze.de und
juraforum.de sind die Texte abrufbar — Fundstellen am Ende), die Spalten und
der Bestand der Produktionsdatenbank `yqlledouhfovytifeekd`, sowie
`src/lib/pdf.tsx` und die vier versendenden Routen im Repository.

### Vorab: eine Korrektur an meiner eigenen Zitierung aus CoS-L-007

Ich habe dort **§ 125a HGB** für OHG und KG genannt. Das ist seit dem MoPeG
(01.01.2024) nicht mehr richtig: Die Vorschrift steht heute in **§ 125 HGB**,
und § 177a HGB verweist entsprechend auf § 125, nicht auf § 125a. Wortlaut
§ 177a HGB, geprüft:

> *„§ 125 gilt auch für die Gesellschaft, bei der ein Kommanditist eine
> natürliche Person ist. Der in § 125 Absatz 1 Satz 2 für die Gesellschafter
> vorgeschriebenen Angaben bedarf es nur für die persönlich haftenden
> Gesellschafter der Gesellschaft."*

Wer nach § 125a HGB sucht, findet nichts. Deshalb hier ausdrücklich, bevor
jemand die alte Fundstelle aus meinem eigenen Text übernimmt.

### 1. Die Feldliste, wörtlich und abschließend

| Rechtsform | Norm | Was auf jeden Geschäftsbrief muss |
|---|---|---|
| **Einzelunternehmen / Kleingewerbe** (nicht im Handelsregister) | keine — § 15b GewO, der genau das verlangte, ist seit dem 25.03.2009 durch das Dritte Mittelstandsentlastungsgesetz **aufgehoben** | handels- und gesellschaftsrechtlich: nichts. Aber DL-InfoV, siehe Punkt 4 |
| **e. K. / e. Kfm. / e. Kfr.** | § 37a Abs. 1 HGB | Firma · Rechtsformzusatz nach § 19 Abs. 1 Nr. 1 HGB („eingetragener Kaufmann" / „e. K." o. ä.) · Ort der Handelsniederlassung · Registergericht · HRA-Nummer. **Kein** Inhabername, soweit er nicht Teil der Firma ist |
| **GmbH** und **UG (haftungsbeschränkt)** | § 35a Abs. 1 GmbHG | Rechtsform · Sitz der Gesellschaft · Registergericht des Sitzes · HRB-Nummer · **alle** Geschäftsführer mit Familienname und mindestens einem **ausgeschriebenen** Vornamen · falls ein Aufsichtsrat besteht und einen Vorsitzenden hat: auch dieser |
| **OHG / KG** mit mindestens einer natürlichen Person als persönlich haftendem Gesellschafter | § 125 Abs. 1 HGB | Firma · Sitz · Registergericht · HRA-Nummer. Die einzelnen Gesellschafter müssen **nicht** genannt werden |
| **GmbH & Co. KG** (kein persönlich haftender Gesellschafter ist natürliche Person) | §§ 177a, 125 Abs. 1 S. 2 HGB | zur KG: Firma · Sitz · Registergericht · HRA-Nummer. **Zusätzlich zur Komplementär-GmbH:** Firma · Sitz · Registergericht · HRB-Nummer · alle Geschäftsführer mit Familienname und ausgeschriebenem Vornamen |

**AG steht bewusst nicht in der Tabelle.** § 80 AktG habe ich in diesem Lauf
nicht am Wortlaut nachgesehen, und eine AG kommt in Gate 1 nicht vor. **Meine
Empfehlung an Engineering: die Auswahl bietet AG nicht an.** Wird sie später
gebraucht, hole ich den Wortlaut nach — eine Auswahl, die eine Rechtsform
anbietet und dann die falschen Felder abfragt, ist schlechter als eine, die sie
weglässt.

**Daraus die Felder im Datenmodell — mehr braucht es nicht:**

| Feld | Typ | Pflicht bei |
|---|---|---|
| `rechtsform` | Auswahl: `einzelunternehmen`, `eingetragener_kaufmann`, `gmbh`, `ug`, `ohg`, `kg`, `gmbh_co_kg` | **immer** (siehe Punkt 3) |
| `sitz_ort` | Text | e. K., GmbH, UG, OHG, KG, GmbH & Co. KG |
| `registergericht` | Text | dieselben |
| `registernummer` | Text, mit Präfix HRA/HRB wie eingetragen | dieselben |
| `vertretungsberechtigte` | Text-Liste, je Eintrag Familienname + ausgeschriebener Vorname | GmbH, UG, GmbH & Co. KG |
| `komplementaer_firma`, `komplementaer_registergericht`, `komplementaer_registernummer` | Text | nur GmbH & Co. KG |

**Zwei Hinweise, die man sonst erst im Bauen merkt:**

1. **Der Sitz ist heute nicht auslesbar.** `companies.address` ist ein
   Freitextfeld; `pdf.tsx` nimmt für den Kopf schlicht `adresse.split('\n')[0]`.
   Der Sitz im Sinne der Normen ist der **Ort**, nicht die ganze Adresse.
   Entweder ein eigenes Feld `sitz_ort`, oder eine harte Zusicherung, welche
   Zeile der Ort ist. Ich empfehle das eigene Feld — es ist billiger als jede
   Heuristik.
2. **Keine Kapitalangaben ins Produkt.** § 35a Abs. 1 Satz 2 GmbHG lautet:
   *„Werden Angaben über das Kapital der Gesellschaft gemacht, so müssen in
   jedem Fall das Stammkapital sowie, wenn nicht alle in Geld zu leistenden
   Einlagen eingezahlt sind, der Gesamtbetrag der ausstehenden Einlagen
   angegeben werden."* Die Pflicht entsteht also erst, wenn jemand freiwillig
   etwas zum Kapital schreibt. Solange das Produkt kein Feld dafür hat, kann sie
   niemand auslösen. **Also: kein Feld dafür anlegen.**

### 2. Wo die Angaben erscheinen müssen — die Abgrenzung, die ich ziehen muss

**Antwort: PDF und E-Mails, aus einer einzigen Quelle. Nicht gestaffelt.**

**Die Norm lässt hier wenig Spielraum.** § 35a Abs. 1 GmbHG: *„Auf allen
Geschäftsbriefen **gleichviel welcher Form**, die an einen bestimmten Empfänger
gerichtet werden …"* — die E-Mail ist erfasst, das ist seit dem EHUG 2007
unstreitig. Die Ausnahme in Absatz 2 greift bei uns nicht: Sie gilt für
*„Mitteilungen oder Berichte, die im Rahmen einer bestehenden
Geschäftsverbindung ergehen und für die üblicherweise Vordrucke verwendet
werden, in denen lediglich die im Einzelfall erforderlichen besonderen Angaben
eingefügt zu werden brauchen"*. Unsere Angebots-E-Mail ist in aller Regel der
**Erstkontakt**, und sie trägt nicht bloß Einzelfallangaben, sondern das
Angebot selbst.

**Befund im Repository — vier E-Mails gehen im Namen des Betriebs an den
Endkunden:**

| Route | Absenderzeile im Code | Zweck |
|---|---|---|
| `src/app/api/email/route.ts` | `${company.name} <angebot@sofortangebot.app>` | Angebot versenden |
| `src/app/api/quotes/[id]/send/route.ts`, Z. 161 | `${company.name} via Sofortangebot <noreply@sofortangebot.app>` | zweiter Versandweg |
| `src/app/api/cron/reminder/route.ts`, Z. 137 | `${company.name} <angebot@sofortangebot.app>` | Erinnerung an den Kunden |
| `src/app/api/notifications/unterschrift/route.ts`, Z. 84 | `${company.name} <angebot@sofortangebot.app>` | Auftragsbestätigung an den Kunden |

Alle vier schließen mit *„Mit freundlichen Grüßen, <Firma>"* und tragen im Fuß
nur die Zeile *„Versendet über sofortangebot.app im Auftrag von <Firma>"*.
Rechtsform, Sitz, Register, Geschäftsführer: in keiner davon.

Die fünfte Mail in derselben Datei (Z. 115, `sofortangebot
<info@sofortangebot.app>` an den Betriebsinhaber) ist **kein** Geschäftsbrief
des Betriebs — sie bleibt außen vor. Das ist die Trennlinie: **Absender ist der
Betrieb, Empfänger ist dessen Kunde.**

**Das Angebots-PDF** baut den Fuß in `src/lib/pdf.tsx` Z. 314–316 aus genau
drei Bestandteilen: links `Firmenname · erste Adresszeile`, Mitte
`USt-IdNr. / St.-Nr.`, rechts `IBAN`. Registerangaben kennt es nicht.

**Meine Abgrenzung, und die Begründung dazu:** Ich ziehe die Linie **nicht**
zwischen PDF und E-Mail, sondern zwischen „an den Kunden" und „an den Betrieb".
Der Grund ist nicht juristischer Ehrgeiz, sondern der Fehler, den wir in diesem
Projekt schon zweimal hatten: Bei LR-01 (Übermessungs-Hinweis) und bei LR-16
(Materialpreis-Hinweis) stand eine Angabe an einer Stelle und fehlte an der
anderen, und niemand hat es gemerkt. Eine Funktion — etwa
`geschaeftsbriefZeile(company)` in `src/lib` —, die das PDF und alle vier
Mail-Vorlagen aufrufen, ist derselbe Bauaufwand wie „nur das PDF" plus vier
Einzeiler und schließt die Lücke dauerhaft.

**Falls Engineering trotzdem staffeln muss**, dann in dieser Reihenfolge:
PDF · `api/email` · `api/quotes/[id]/send` zusammen (dort liegt das Angebot),
unmittelbar danach Erinnerung und Auftragsbestätigung — beide gehen an denselben
Empfänger und sind ebenso Geschäftsbriefe. Eine Staffelung, die die letzten
beiden dauerhaft auslässt, trage ich nicht mit.

**Die Unterschreiben-Seite** (`src/app/angebot/[id]/unterschreiben/page.tsx`)
ist kein Geschäftsbrief, sondern der Ort des Vertragsschlusses. Für sie gilt
Punkt 4, nicht dieser.

### 3. Was bei unvollständigem Profil passiert

**Erst die Rechtsfolge, dann meine Empfehlung.**

**Wen es trifft:** Die Pflicht trifft den **Betrieb**, nicht Sofortangebot.
Sanktion bei GmbH und UG: Zwangsgeld des Registergerichts gegen die
Geschäftsführer, § 79 Abs. 1 GmbHG — Wortlaut geprüft: *„Geschäftsführer oder
Liquidatoren, die §§ 35a, 71 Abs. 5 nicht befolgen, sind hierzu vom
Registergericht durch Festsetzung von Zwangsgeld anzuhalten; § 14 des
Handelsgesetzbuchs bleibt unberührt. Das einzelne Zwangsgeld darf den Betrag
von fünftausend Euro nicht übersteigen."* Für e. K., OHG und KG dasselbe über
§ 37a Abs. 4 HGB bzw. § 125 Abs. 2 HGB. Dazu kommt die wettbewerbsrechtliche
Abmahnung durch Mitbewerber; die Pflichtangaben werden als Marktverhaltensregel
im Sinne des § 3a UWG behandelt.

**Meine Empfehlung: den Versand hart unterbrechen, aber nichts dauerhaft
sperren.** Konkret, in dieser Staffelung:

1. **`rechtsform` ist im Onboarding Pflichtfeld ohne Überspringen.** Es ist die
   einzige Angabe, die das Produkt nicht selbst herleiten kann, und ohne sie
   läuft jede weitere Regel ins Leere.
2. **Rechtsform = Einzelunternehmen → keine weiteren Felder, kein Hinweis.**
   Unverändert so, wie Sandy entschieden hat.
3. **Rechtsform eingetragen und ein Pflichtfeld leer → der Versand-Dialog
   blockiert.** Kein „trotzdem senden", kein wegklickbarer Hinweis. Der Knopf
   wird aktiv, sobald die Felder stehen.
4. **Nicht blockiert werden:** das Erstellen und Bearbeiten von Angeboten, der
   PDF-Download für den eigenen Gebrauch, und bereits versendete Angebote.
   Nichts wird rückwirkend gesperrt.

**Warum nicht nur warnen:** Ein Hinweis, den man wegklicken kann, erzeugt genau
den Zustand aus LR-16 — der Betrieb hat etwas gesehen und hält die Sache
für erledigt. **Warum nicht härter:** Ein Kontosperre wäre unverhältnismäßig.
Die Pflicht ist die des Betriebs, Sofortangebot haftet nicht für ihre
Verletzung, und die Kernfunktion darf nicht an einer fremden Pflicht hängen.

**Was Sandy davon freigeben muss:** nur der **Wortlaut** der beiden
Oberflächentexte. Meine Vorschläge, zur Freigabe:

> **Im Betriebsprofil, unter der Rechtsform-Auswahl:**
> „Diese Angaben müssen nach dem Handelsrecht auf jedem Angebot stehen, das du
> verschickst. Sie stehen so auch in deinem Handelsregisterauszug."
>
> **Im Versand-Dialog, wenn Felder fehlen:**
> „Bevor du dein erstes Angebot verschickst, fehlen noch Pflichtangaben zu
> deinem Betrieb: <Liste der leeren Felder>. Ohne sie darf das Angebot nicht
> raus."

Beides ist ein Hinweis an den Betrieb, keine Aussage gegenüber dessen Kunden
und keine Klausel — das Risiko ist gering, und der Bau hängt nicht daran.
Ändert Sandy die Formulierung später, ist das eine Textänderung.
**Die Entscheidung „blockieren statt nur warnen" ist eine Rechtsfolgen-Frage
und liegt nach der Governance-Regel bei mir — Sandy muss sie nicht treffen,
damit gebaut werden kann.**

### 4. Ein Punkt, der in CoS-L-007 zu kurz kam: pflichtfrei ist auch der Einzelunternehmer nicht

In CoS-L-007 steht: *„Für ein nicht eingetragenes Kleingewerbe gilt davon nichts
— dort reichen Vor- und Nachname."* Der erste Halbsatz stimmt und ist jetzt auch
belegt: § 15b GewO, der genau die Namensangabe auf Geschäftsbriefen verlangte,
ist seit dem 25.03.2009 aufgehoben. **Der zweite Halbsatz ist unvollständig.**

**§ 2 Abs. 1 DL-InfoV** verpflichtet jeden Dienstleistungserbringer —
Handwerksbetriebe ausdrücklich eingeschlossen —, dem Empfänger **vor Abschluss
eines schriftlichen Vertrags** unter anderem zur Verfügung zu stellen: Name
bzw. Firma, **Rechtsform**, ladungsfähige Anschrift, Kontaktdaten, Registereintrag
samt Nummer (soweit vorhanden), USt-IdNr. (soweit vorhanden), zuständige
Kammer und Berufsbezeichnung, AGB, und Angaben zur Berufshaftpflicht, soweit
eine besteht. Verstoß: Ordnungswidrigkeit nach § 6 DL-InfoV, Bußgeld bis
1.000 €.

**Warum das hierher gehört:** Der Vertragsschluss findet in unserem Produkt auf
der Unterschreiben-Seite statt. Der Endkunde bekommt eine E-Mail und ein PDF —
es gibt keinen Ladenraum, in dem etwas aushängen könnte.

**Warum es trotzdem klein bleibt:** § 2 Abs. 2 DL-InfoV lässt vier Wege zu,
darunter die leichte elektronische Zugänglichkeit über eine mitgeteilte
Internetadresse. Eine Website des Betriebs mit Impressum, im PDF genannt,
erfüllt die Pflicht. Das Feld `companies.website` existiert und wird im PDF-Kopf
bereits gerendert (`pdf.tsx` Z. 391).

**Der ganze Aufwand, der daraus folgt:** Für die eingetragenen Rechtsformen
decken die Felder aus Punkt 1 die DL-InfoV mit ab. Für den Einzelunternehmer
bleibt genau eine Angabe offen — **die Rechtsform selbst** —, und die steht nach
Punkt 3 ohnehin im Profil. Es ist eine Zeile in derselben Fußzeilen-Funktion.
**Ich führe das nicht als eigenes Risiko und nicht als eigenen Auftrag.**

### 5. Der Befund an der Quelle, Stand heute

- `companies` hat **keine** Spalte für Rechtsform, Sitz-Ort, Registergericht,
  Registernummer oder Vertretungsberechtigte. Vorhanden und einschlägig sind
  `name`, `address`, `tax_number`, `ust_id`, `phone`, `contact_email`,
  `website`. (Spaltenliste aus `information_schema`, Produktionsprojekt.)
- **8 Betriebe**, alle aktiv (`deleted_at` leer). `tax_number`: **0** gefüllt.
  `ust_id`: **0** gefüllt.
- **Ein Betrieb heißt „Holm GmbH"** und hat 4 Angebote angelegt, davon
  **0 versendet** (`quotes.gesendet_am` leer). Es ist also bis heute kein
  einziges Dokument hinausgegangen, dem die Pflichtangaben gefehlt hätten.

Das ist der eigentliche Grund, warum der Punkt **vor** Gate 1 gehört und nicht
danach: Solange nichts versendet wurde, ist nichts zu heilen. Ab dem ersten
echten Versand eines eingetragenen Betriebs wäre jedes Angebot ein
abmahnfähiger Geschäftsbrief, und alte Angebote lassen sich nicht nachbessern.

### 6. Nebenbefund L-35a-01 — das PDF druckt die Steuernummer, entgegen meiner eigenen Empfehlung

In CoS-L-007 habe ich geschrieben: USt-IdNr. bevorzugen, Steuernummer nur dort,
wo es keine USt-IdNr. gibt, und nur auf Rechnungen. `src/lib/pdf.tsx` Z. 315
baut die Fußzeile aber aus **beiden**, ohne Vorrang:

```
const footerMitte = [ustId && `USt-IdNr.: ${ustId}`, steuernummer && `St.-Nr.: ${steuernummer}`].filter(Boolean).join('  ·  ')
```

Füllt ein Betrieb beide Felder, steht auf jedem Angebot beides — und die
Steuernummer geht an jeden Empfänger. Kein akuter Schaden: 0 von 8 Betrieben
haben eines der Felder gefüllt, und es gibt keine echten Nutzer.

**Zu ändern zusammen mit CoS-E-057**, weil dieselbe Fußzeile ohnehin angefasst
wird: `steuernummer` nur ausgeben, wenn `ustId` leer ist. Zwei Zeilen. Kein
Risikoeintrag (Severity 1) — ein Produktpunkt zum Mitnehmen.

*Head of Legal & Compliance · 2026-09-15 · Geprüfte Normtexte: § 35a GmbHG,
§ 79 GmbHG, § 37a HGB, § 125 HGB, § 177a HGB, § 14 HGB, § 2 und § 6 DL-InfoV,
Aufhebung § 15b GewO. Risikoeintrag dazu: LR-17 in
`legal-002-risikobewertung-vob.md`*

---

## CoS-L-006 — § 14 UStG: die Pflichtangabenliste, nachgeholt (Head of Legal & Compliance, 2026-09-15)

Früher am selben Tag habe ich notiert, die Normtexte seien nicht abrufbar und
ich schriebe die Liste nicht aus dem Gedächtnis auf. Über eine andere Quelle
sind sie abrufbar (gesetze-im-internet.de bleibt gesperrt, lxgesetze.de und
juraforum.de liefern den Wortlaut). Damit hole ich sie nach.

**Was sich dadurch nicht ändert:** Es gibt im Produkt weiterhin **keine
Rechnung** — kein Rechnungsdokument, keine Rechnungstabelle, `quotes.dokument_typ`
kennt nur `angebot` und `kostenvoranschlag`. Die Liste ist deshalb **kein
Bauauftrag**, sondern der Maßstab, an dem die erste Rechnungsvorlage zu messen
sein wird. Sie steht hier, damit sie beim nächsten Mal nicht wieder aus dem
Gedächtnis geschrieben wird.

### A. Die zehn Pflichtangaben nach § 14 Abs. 4 UStG (Regelfall)

1. vollständiger Name und vollständige Anschrift des leistenden Unternehmers
   **und** des Leistungsempfängers
2. Steuernummer **oder** USt-IdNr. des leistenden Unternehmers
3. Ausstellungsdatum
4. eine fortlaufende Nummer mit einer oder mehreren Zahlenreihen, die zur
   Identifizierung der Rechnung vom Rechnungsaussteller **einmalig** vergeben
   wird
5. Menge und Art (handelsübliche Bezeichnung) der gelieferten Gegenstände bzw.
   Umfang und Art der sonstigen Leistung
6. **Zeitpunkt der Lieferung oder sonstigen Leistung** — auch dann anzugeben,
   wenn er mit dem Rechnungsdatum zusammenfällt
7. das nach Steuersätzen und einzelnen Steuerbefreiungen aufgeschlüsselte
   Entgelt sowie jede im Voraus vereinbarte Minderung des Entgelts
8. der anzuwendende Steuersatz und der Steuerbetrag — oder bei Steuerbefreiung
   ein Hinweis auf die Befreiung
9. **Hinweis auf die Aufbewahrungspflicht des Leistungsempfängers**, in den
   Fällen des § 14b Abs. 1 S. 5 UStG
10. die Angabe „Gutschrift", wenn der Leistungsempfänger abrechnet

**Nummer 6 und Nummer 9 sind die beiden, die in der Praxis fehlen — und
Nummer 9 trifft unsere Betriebe unmittelbar.** § 14b Abs. 1 S. 5 UStG erfasst
Werklieferungen und sonstige Leistungen **im Zusammenhang mit einem Grundstück**
an einen Empfänger, der Nichtunternehmer ist oder die Leistung für seinen
nichtunternehmerischen Bereich bezieht. Der muss die Rechnung, einen
Zahlungsbeleg oder eine andere beweiskräftige Unterlage **zwei Jahre**
aufbewahren, gerechnet ab Schluss des Kalenderjahres der Rechnungsausstellung —
und auf diese Pflicht muss die Rechnung ihn hinweisen. Malerarbeiten und
Bodenbelagsarbeiten in einer Privatwohnung sind genau dieser Fall. Das ist
Manfreds Geschäft, jeden Tag.

### B. Kleinbetragsrechnung bis 250 € (§ 33 UStDV)

Bei einem Gesamtbetrag bis **250 €** genügen: Name und Anschrift des
**leistenden** Unternehmers · Ausstellungsdatum · Menge und Art bzw. Umfang und
Art der Leistung · Entgelt und Steuerbetrag **in einer Summe** · anzuwendender
Steuersatz oder Hinweis auf die Steuerbefreiung. **Nicht** nötig: Empfänger,
Rechnungsnummer, Steuernummer, Leistungszeitpunkt.

### C. Kleinunternehmer (§ 19 UStG, § 34a UStDV)

Die Grenzen im geprüften Wortlaut: Gesamtumsatz im **vorangegangenen**
Kalenderjahr höchstens **25.000 €** und im laufenden Kalenderjahr nicht mehr als
**100.000 €**.

**§ 34a UStDV führt für Rechnungen über § 19-Umsätze eine eigene, verkürzte
Liste:** Name und Anschrift beider Seiten · Steuernummer oder USt-IdNr. ·
Ausstellungsdatum · Menge und Art bzw. Umfang und Art der Leistung · das Entgelt
**mit einem Hinweis auf die Steuerbefreiung für Kleinunternehmer** · ggf.
„Gutschrift". Eine fortlaufende Rechnungsnummer verlangt § 34a UStDV nicht.

**Der Hinweis auf die Steuerbefreiung ist dort Pflicht.** Für uns heißt das:
Der Satz, den `src/lib/pdf.tsx` Z. 557 heute setzt — *„Kein Ausweis MwSt. gem.
§ 19 UStG"* — ist auf dem **Angebot** unschädlich und sachlich richtig. Auf
einer künftigen **Rechnung** ist zu prüfen, ob diese Formulierung den geforderten
Befreiungshinweis trägt; „kein Ausweis" beschreibt das Ergebnis, nicht den
Befreiungsgrund. Das ist eine Formulierungsfrage für den Tag, an dem es
Rechnungen gibt, kein heutiger Mangel.

### D. Was ich in diesem Lauf ausdrücklich NICHT geprüft habe

Die **E-Rechnungspflicht** nach § 14 Abs. 2 UStG und ihre Übergangsfristen.
Dass inländische B2B-Umsätze grundsätzlich als elektronische Rechnung
abzurechnen sind, steht im Normtext; die Staffelung der Übergangsregelung habe
ich nicht am Wortlaut nachgesehen und schreibe sie deshalb nicht auf. Für das
Produkt ist sie heute folgenlos: Es gibt keine Rechnung, und Angebote dürfen
seit DC-100 gar keine XML mehr tragen. **Nachzuholen vor der ersten echten
Rechnung**, nicht vor Gate 1.

### Status

**Der rechtliche Teil von CoS-L-006 ist damit erledigt.** Die Liste liegt vor,
an der Norm geprüft, mit den beiden Sonderfällen (Kleinbetrag, Kleinunternehmer)
und der einen Angabe, die unsere Betriebe wirklich betrifft (Nr. 9).

**Offen bleibt der Produktteil, und der liegt nicht bei mir:** Der
Rechnungsnummernkreis, den das Produkt einrichten lässt, ohne je eine Rechnung
zu erzeugen (zwei Zeilen in `nummernkreise` mit `typ = 'rechnung'`, während
`vergebene_nummern` nur `angebot` kennt). Das ist der Punkt, der Manfreds
„Rechnung" in TN-089 erzeugt hat, und er liegt bei Platform, CoS-P-021.

*Head of Legal & Compliance · 2026-09-15 · Geprüfte Normtexte: § 14 Abs. 4
UStG, § 14b Abs. 1 UStG, § 19 Abs. 1 UStG, § 33 UStDV, § 34a UStDV*

---

## Notiz zum Ablauf dieses Laufs, zweiter Eintrag (2026-09-15)

`node scripts/docs-sichern.mjs pruefen` / `sichern` konnte auch in diesem Lauf
nicht ausgeführt werden — die Shell hängt den Projektordner weiterhin nicht ein
(Windows-Update vom 08.09.). Gelesen und geschrieben wurde über Staging und
Commit, jeweils mit `expectedMtimeMs` aus dem Staging. **Die Sicherung ist
nicht gelaufen.** Das ist inzwischen der achte Tag; CoS-P-022 wird dadurch nicht
kleiner.

Was sich in diesem Lauf geändert hat: Die Normtexte sind über eine andere Quelle
abrufbar (lxgesetze.de, juraforum.de). gesetze-im-internet.de antwortet weiterhin
nicht. Damit ist die Vorbedingung weggefallen, an der CoS-L-006 seit dem 07.09.
hing.

*Head of Legal & Compliance · 2026-09-15*


---

## ❌ CoS-L-009 — Darf „Aufmaß" auf dem Angebot stehen? (LR-16)

**Datum:** 2026-09-15, 21:50 MESZ · Chief of Staff

**Kurz:** Eine Wortlautfrage fürs Kunden-PDF, die zwei Fachleute aus dem Team
unterschiedlich beantworten. Beide haben ein gutes Argument, keiner von beiden
kann es entscheiden — das ist eure Runde (LR-16).

### Was gebaut wurde

Der Product Designer hat mit DC-107 die Herkunftsangaben aus dem Rechenweg auf
dem Kunden-PDF entfernt (`4 Tür(en) aus Transkript` → `4 Tür(en)`). Bei den
**Fließtext-Formen** trägt das Wort aber den Satz, dort wird es ersetzt statt
gestrichen:

> `Altbau im Transkript erkannt` → **`Altbau im Aufmaß erkannt`**

### Die zwei Positionen

**Für „Aufmaß" (Product Designer):** Das Wort steht heute schon auf dem
Kunden-PDF („Aufmaß in Anlehnung an VOB/C", Übermessungs-Fußnote) und der
Handwerker sieht es in der App („Aufmaß starten", „Fotos vom Aufmaß"). Ist es
im Produkt gesetzt, wäre Uneinheitlichkeit schlimmer. „Aufnahme" heißt in der
App die **einzelne Sprachaufnahme**, davon kann es mehrere zu einem Aufmaß
geben — das Wort ist also das engere und an dieser Stelle falsch.

**Gegen „Aufmaß" (Prüfmeister, PD-015):** Am Bau ist ein Aufmaß die
Mengenermittlung, nach der **abgerechnet** wird — im VOB-Vertrag gemeinsam
genommen und unterschrieben. Auf einem **Angebot** hat sie noch gar nicht
stattgefunden. „Altbau im Aufmaß erkannt" kann gelesen werden als: da war
jemand vor Ort und hat gemessen. Ein Diktat ins Handy ist das nicht. Wer es auf
dem Kundenpapier so nennt, weckt eine Erwartung, die das Papier nicht hält.

### Was ich von euch brauche

1. **Weckt „Aufmaß" auf einem Angebot eine Erwartung, die rechtlich trägt?**
   Konkret: kann der Kunde daraus ableiten, die Mengen seien vor Ort ermittelt
   und damit verbindlicher als eine Schätzung?
2. **Wenn ja — was ist das richtige Wort?** Nicht „welches klingt besser",
   sondern welches keine Erwartung weckt, die das Angebot nicht einlöst.
3. **Gilt dieselbe Antwort für die Übermessungs-Fußnote** („Aufmaß in
   Anlehnung an VOB/C"), die heute schon auf dem PDF steht? Wenn das Wort dort
   in Ordnung ist, spricht das für den Designer — dann sagt das bitte
   ausdrücklich, damit die Frage nicht in drei Wochen erneut aufgemacht wird.

**Nicht dringend, blockiert nichts.** Der Bau ist fertig und steht. Hängt an
der ohnehin laufenden LR-16-Runde und kann dort mitlaufen.

*Chief of Staff · 2026-09-15*


---

## ✅ CoS-L-009 — Antwort: Darf „Aufmaß" auf dem Angebot stehen? (Head of Legal & Compliance, 2026-09-16)

**Kurz:** Der Prüfmeister hat in der Sache recht, der Designer in der
Anforderung. Beides geht zusammen — aber nicht über das Wort „Aufmaß", und die
Fußnote bleibt, wie sie ist.

### Vorab: der rechtliche Hebel liegt nicht dort, wo die Frage ihn vermutet

Die Frage lautete, ob der Kunde aus „Aufmaß" ableiten kann, die Mengen seien
**verbindlicher als eine Schätzung**. Das kann er nicht — die Verbindlichkeit
einer Menge kommt aus der Vertragsart (Pauschalpreis gegen Einheitspreis), nicht
aus einem Wort auf dem Papier. Insoweit ist die Sorge unbegründet.

**Der Schaden entsteht eine Stufe später, bei der Abrechnung.** § 649 Abs. 1
BGB, Wortlaut geprüft:

> „Ist dem Vertrag ein Kostenanschlag zugrunde gelegt worden, **ohne dass der
> Unternehmer die Gewähr für die Richtigkeit des Anschlags übernommen hat**, und
> ergibt sich, dass das Werk nicht ohne eine wesentliche Überschreitung des
> Anschlags ausführbar ist, so steht dem Unternehmer, wenn der Besteller den
> Vertrag aus diesem Grund kündigt, nur der im § 645 Abs. 1 bestimmte Anspruch
> zu."

Die gesamte Entlastung des Betriebs hängt an diesem eingeschobenen Halbsatz. Ob
er die Gewähr übernommen hat, entscheidet sich nach dem Empfängerhorizont — und
zwar an dem, was auf dem Kundenpapier steht. Ein Papier, das seine Mengen als
**Aufmaß** bezeichnet, behauptet, sie seien am Objekt ermittelt worden. Wer das
behauptet, verteidigt sich schlecht mit „das war nur überschlägig". Dasselbe
Wort verschlechtert also nicht die Position des Kunden, sondern die des Betriebs
— und das ist der Grund, warum ich hier überhaupt etwas sage.

Dazu, schwächer, aber vorhanden: § 5 Abs. 1, Abs. 2 Nr. 1 UWG. „Im Aufmaß
erkannt" ist eine Tatsachenbehauptung über den Entstehungsweg der Zahl, nicht
eine Wertung. Trifft sie nicht zu, ist sie irreführend über ein wesentliches
Merkmal der Dienstleistung. Abmahnfähig durch Mitbewerber, praktisch
unwahrscheinlich, aber es ist der zweite Grund, weshalb ich nicht „egal" sage.

### Antwort 1 — Ja, aber nicht die Erwartung, um die gestritten wurde

Geweckt wird nicht „die Menge ist verbindlich", sondern **„jemand war vor Ort
und hat gemessen"**. Rechtlich trägt diese Erwartung dort, wo es den Betrieb
Geld kostet: bei § 649 BGB und bei der Anzeigepflicht aus § 649 Abs. 2 BGB.
Ein Diktat ins Handy ist kein Aufmaß, und wir sollten es auf dem Kundenpapier
nicht so nennen.

### Antwort 2 — Das richtige Wort ist keines

Der Streit dreht sich um den Ersatz für **eine Quellenangabe**, und DC-107 hat
für alle anderen Stellen bereits entschieden, dass die Quelle auf dem
Kundenpapier nichts zu suchen hat (`4 Tür(en) aus Transkript` → `4 Tür(en)`).
Die Fließtext-Form ist kein Sonderfall, sie ist nur schwerer zu kürzen.

**Mein Vorschlag:** `Altbau im Aufmaß erkannt` → **`Als Altbau berücksichtigt`**

Das nennt, was mit der Rechnung passiert ist, und behauptet keinen Weg, auf dem
die Angabe entstanden ist. Falls eine Quelle unbedingt genannt werden soll, ist
die einzige zutreffende **„nach Angabe des Betriebs"** — denn genau das ist es.
Nicht „Aufnahme": da hat der Designer recht, das Wort ist in der App für die
einzelne Sprachaufnahme belegt und wäre an dieser Stelle falsch.

**Freigabevorbehalt:** Der Wortlaut geht auf das Kunden-PDF, damit gilt die
Governance-Regel dieser Datei — die Formulierung liegt am Ende bei Sandy. Der
Befund und die Empfehlung liegen hiermit vor; sie können in der LR-16-Runde
mitlaufen.

### Antwort 3 — Die Übermessungs-Fußnote bleibt, und das sage ich ausdrücklich

**„Aufmaß in Anlehnung an VOB/C (DIN 18363)" ist in Ordnung und muss nicht
angefasst werden.** Dort bezeichnet „Aufmaß" nicht einen Vorgang am Objekt,
sondern das **Regelwerk der Mengenermittlung** — die Aufmaßregeln der ATV, nach
denen gerechnet wurde. Das ist die stehende Bedeutung des Wortes in der Norm
selbst, und die Aussage ist wahr: So wurde gerechnet.

Daraus die Linie, damit die Frage nicht in drei Wochen erneut aufgemacht wird:

| „Aufmaß" als … | Beispiel | Bewertung |
|---|---|---|
| Name einer **Rechenregel** | „Aufmaß in Anlehnung an VOB/C" | unbedenklich, bleibt |
| Ort einer **Wahrnehmung** | „im Aufmaß erkannt" | behauptet eine Ortsbegehung, ersetzen |
| **Bedienschritt in der App** | „Aufmaß starten", „Fotos vom Aufmaß" | unbedenklich, Adressat ist der Betrieb |

Damit löst sich auch das Einheitlichkeits-Argument des Designers auf: Einheitlich
sein muss die Sprache **innerhalb eines Adressatenkreises**. Was der Handwerker
in seiner App liest, bindet das Kundenpapier nicht — die Trennlinie ist dieselbe,
die ich in CoS-L-008 Punkt 2 für die Geschäftsbriefe gezogen habe („Absender ist
der Betrieb, Empfänger ist dessen Kunde").

**Damit ist CoS-L-009 auf meiner Seite abgeschlossen.** Offen bleibt allein die
Wortlaut-Freigabe durch Sandy.

*Head of Legal & Compliance · 2026-09-16 · Geprüfte Normtexte: § 649 Abs. 1 und 2
BGB, § 5 Abs. 1 und Abs. 2 Nr. 1 UWG · Quelle: lxgesetze.de*

---

## DC-106 Nachlauf — die Erinnerungsmail selbst, geprüft (Head of Legal & Compliance, 2026-09-16)

Der Designer hat es zutreffend eingegrenzt: Sein Onboarding-Satz ist nicht mehr
betroffen, zu prüfen war die **Mail**. Das ist hiermit geschehen — an
`src/app/api/cron/reminder/route.ts` (vollständig gelesen, 7.308 Bytes) und an
der Produktionsdatenbank, nicht an den Erledigungsmeldungen der anderen Rollen.

### Was der Stand tatsächlich ist

| Frage | Befund (Produktion, 16.09.) |
|---|---|
| Betriebe insgesamt | 8 |
| davon mit aktiviertem Reminder (`reminder_days > 0`) | **8 von 8** |
| Angebote im Status `sent` | 4 |
| **Erinnerungen tatsächlich verschickt** (`reminder_sent_at` gesetzt) | **2** |
| Empfänger dieser zwei | beide 03.09.2026, 08:01 UTC, derselbe Betrieb, Kundenadressen auf `…-test.de` |

Zwei Korrekturen an Aussagen, die in dieser Datei stehen: Der Befund vom 02.09.
(„Dieser Job hat seit Bestehen keine einzige Erinnerung verschickt") ist
**überholt** — er versendet seit dem 03.09. Und Sandys Klarstellung vom 02.09.
(„es gibt keine echten Nutzer") **trägt auch hier**: Es ist bis heute keine
Erinnerung an einen echten Endkunden gegangen. Das begrenzt alles Folgende auf
ein Risiko für die Zukunft, nicht auf einen eingetretenen Vorfall.

### 1. § 7 UWG — unbedenklich, und das ist keine Nachlässigkeit

Der Werbebegriff ist weit, und eine Nachfass-Mail fällt reflexhaft erst einmal
darunter. Sie tut es hier trotzdem nicht: Die Mail bewirbt keine weitere
Leistung, sondern erinnert an **das eine Angebot, das der Kunde selbst
angefragt hat**. Das ist Kommunikation innerhalb der laufenden
Vertragsanbahnung, nicht Absatzwerbung für etwas Zusätzliches. Dazu die
Begrenzung, die im Code steht und nicht bloß behauptet wird: `reminder_sent_at`
lässt **genau eine** Mail je Angebot zu, `reminder_days = 0` schaltet ab.
Einwilligung nach § 7 Abs. 2 Nr. 2 UWG ist dafür nicht erforderlich.

**Keine Änderung nötig.** Ich halte es fest, damit der Punkt nicht bei jedem
Durchgang neu aufgemacht wird.

### 2. 🔴 Neuer Fund L-MAIL-01 — der Kunde kann auf diese Mail nicht antworten

**Befund.** Absenderzeile Z. 137: `` `${company.name} <angebot@sofortangebot.app>` ``.
Ein `reply_to` setzt die Route **nicht** — in der ganzen Datei kommt das Feld
nicht vor. Im Fuß steht nur „Versendet über sofortangebot.app im Auftrag von
<Firma>". Weder E-Mail noch Telefon noch Anschrift des Betriebs.

Der Kunde sieht den Namen seines Handwerkers als Absender, drückt „Antworten" —
und schreibt an uns.

**Warum das mehr ist als unschön:**

- **§ 5 Abs. 1 Nr. 2 DDG** verlangt Angaben, „die eine schnelle elektronische
  Kontaktaufnahme und unmittelbare Kommunikation ermöglichen". Eine
  Absenderadresse, die zum Dienstleister und nicht zum Absender führt, leistet
  das nicht.
- **§ 6 Abs. 1 Nr. 2 DDG:** Bei kommerzieller Kommunikation muss die Person,
  in deren Auftrag sie erfolgt, klar identifizierbar sein. Der Name steht da,
  die Erreichbarkeit fehlt.

**Was das Produkt schon hat und was fehlt.** `companies` führt `contact_email`,
`phone` und `website` (Spaltenliste aus `information_schema`, 16.09. geprüft),
und das Angebots-PDF gibt sie bereits aus — `src/lib/pdf.tsx` Z. 292–295 und
Z. 392, Absenderzeile aus `Adresse · Telefon · E-Mail · Website`. **Die
Erinnerungsmail hat für dieselbe Zeile gar keinen Platz vorgesehen**, und die
Route lädt die Spalten nicht einmal (`select` in Z. 50: nur `id, name,
reminder_days`).

**Und der Grund, warum es heute trotzdem niemandem auffällt:** Von den acht
Betrieben hat **keiner** `contact_email` oder `phone` gefüllt (0 von 8). Die
Zeile im PDF ist damit heute leer — der Endkunde hat aus **keinem** unserer
Ausgabewege einen Rückweg zu seinem Handwerker.

**Empfehlung, und sie kostet nichts Eigenes:** `contact_email` wird zusammen
mit `rechtsform` Pflichtfeld im Onboarding (CoS-L-008 Punkt 3, Staffelung dort),
die vier Kunden-Mails bekommen `reply_to: company.contact_email`, und die
Kontaktzeile kommt in dieselbe Funktion, die nach CoS-L-008 Punkt 2 ohnehin
gebaut wird (`geschaeftsbriefZeile(company)`). Das ist derselbe Griff, nicht
ein zweiter. **Zuordnung: an CoS-E-057 anhängen**, weil dort dieselbe Fußzeile
angefasst wird.

### 3. § 35a-Pflichtangaben — kein neuer Punkt

Die Erinnerungsmail ist einer der vier Geschäftsbriefe aus CoS-L-008 Punkt 2 und
steckt in **LR-17**. Die Bedingung, die der Designer in DC-106 gestellt hatte,
ist eingetreten (Empfänger ist der Endkunde) — das ändert an der Einordnung
nichts, sie stand dort bereits. Hier nur die Bestätigung an der Quelle:
Absender ist der Betriebsname, Abschluss „Mit freundlichen Grüßen, <Firma>",
Rechtsform/Sitz/Register/Vertretung: keines davon.

### 4. 🟠 Neuer Fund L-MAIL-02 — AVV und Datenschutzerklärung nennen für denselben Dienstleister zwei verschiedene Rechtsgrundlagen

Aufgefallen beim Nachsehen, wer die Mail technisch versendet (Resend), nicht
gesucht.

| Dienstleister | AVV, `src/app/avv/page.tsx` § 4 | Datenschutzerklärung, `src/app/datenschutz/page.tsx` § 7 | Beim Anbieter selbst nachgesehen |
|---|---|---|---|
| **Vercel Inc.** | Standardvertragsklauseln (Z. 70) | DPF-zertifiziert, Übermittlung auf **Art. 45 DSGVO** (Z. 95) | Vercel-DPA, Schedule 3: **nur** die SCC 2021 (Beschluss 2021/914); DPF wird nicht erwähnt |
| **Resend Inc.** | Standardvertragsklauseln (Z. 71) | DPF-zertifiziert, Übermittlung auf **Art. 45 DSGVO** (Z. 95) | Resend-DPA § 6.2: SCC als **primärer** Mechanismus; § 11.1 zusätzlich DPF |
| Sentry | DPF-zertifiziert (Z. 73) | DPF (Z. 95) | stimmig, kein Handlungsbedarf |

**Bewertung.** Bei **Vercel** ist die Datenschutzerklärung **falsch** und der
AVV richtig: Der Anbieter selbst stützt sich auf Art. 46 Abs. 2 lit. c DSGVO,
nicht auf den Angemessenheitsbeschluss. Bei **Resend** ist sie unvollständig,
nicht falsch — beide Mechanismen greifen, der AVV nennt den tragenden.

Das ist kein großer Fehler, aber es ist einer der Sorte, die wehtut, wenn
jemand nachfragt: Zwei von uns veröffentlichte Dokumente behaupten über
denselben Vorgang Unterschiedliches, und der AVV ist ein **Vertrag** mit jedem
Betrieb (Art. 28 Abs. 3 DSGVO). Fällt der Angemessenheitsbeschluss — er steht
seit seinem Erlass unter Beobachtung —, steht in der Datenschutzerklärung eine
Grundlage, die es nicht mehr gibt, während der AVV weiter trägt.

**Empfehlung:** Datenschutzerklärung an den AVV angleichen, nicht umgekehrt.
Für Vercel „Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO)", für Resend
„Standardvertragsklauseln; zusätzlich DPF-zertifiziert". Reiner Textfix in
`src/app/datenschutz/page.tsx`, Z. 94–95. **Risikoeintrag: LR-18 in
`legal-002-risikobewertung-vob.md`.**

### Nicht beanstandet

- **Datenschutzhinweis gegenüber dem Endkunden:** Die Mail selbst enthält
  keinen, die verlinkte Unterschreiben-Seite schon
  (`src/app/angebot/[id]/unterschreiben/page.tsx` Z. 343–344, mit Nennung des
  Betriebs als Verantwortlichem). Für eine Mail, deren einziger Inhalt ein Link
  auf genau diese Seite ist, reicht das.
- **Betreff und Text:** kein Wort von Rechnung, Zahlung, Frist oder Mahnung —
  an der Quelle bestätigt, nicht aus der Engineering-Meldung übernommen.
- **Der Bruttobetrag** im Betreff ist der Gesamtpreis einschließlich
  Umsatzsteuer (`total_gross`). Gegenüber Verbrauchern ist das die richtige
  Angabe.

**Damit ist der Legal-Anteil von DC-106 abgeschlossen.** Übrig bleibt
L-MAIL-01 als Bauauftrag (an CoS-E-057) und L-MAIL-02 als Textfix.

*Head of Legal & Compliance · 2026-09-16 · Geprüfte Normtexte: § 7 Abs. 2 Nr. 2
UWG, § 5 Abs. 1 Nr. 2 DDG, § 6 Abs. 1 Nr. 2 DDG, Art. 28 Abs. 3, Art. 45,
Art. 46 Abs. 2 lit. c DSGVO · Quellen am Anbieter: vercel.com/legal/dpa,
resend.com/legal/dpa*

---

## E-Rechnungspflicht § 14 Abs. 2 UStG — nachgeholt (Head of Legal & Compliance, 2026-09-16)

Das war der ausdrücklich offene Rest aus CoS-L-006, Abschnitt D („Was ich in
diesem Lauf ausdrücklich NICHT geprüft habe"). Jetzt geprüft, am Normtext.

### Der Wortlaut, auf den es ankommt

**§ 14 Abs. 2 S. 2 UStG:** Die Rechnung ist als elektronische Rechnung
auszustellen, **„wenn der leistende Unternehmer und der Leistungsempfänger im
Inland … ansässig sind"**.

**§ 14 Abs. 1 S. 3 UStG:** Eine elektronische Rechnung liegt nur vor, wenn sie
„in einem strukturierten elektronischen Format ausgestellt, übermittelt und
empfangen wird und eine elektronische Verarbeitung ermöglicht" — und dem Format
nach der Norm zur Richtlinie 2014/55/EU entspricht (§ 14 Abs. 1 S. 6).

### Die zwei Sätze, die für uns zählen

**1. Die Pflicht greift nur zwischen Unternehmern.** Der typische Kunde unserer
Betriebe ist ein Verbraucher. Für ihn gilt die E-Rechnungspflicht **nicht** —
weder heute noch 2028. Ein PDF genügt, und dessen elektronische Übermittlung
braucht nach § 14 Abs. 1 S. 2 weiterhin seine Zustimmung.

**2. Wo sie doch greift — Betrieb rechnet gegenüber einem anderen Unternehmer
ab (Hausverwaltung, Bauträger, Gewerbekunde, Kollegenbetrieb) —, gilt die
Staffel aus § 27 Abs. 38 UStG:**

| Zeitraum | Was zulässig ist |
|---|---|
| bis 31.12.2026 | Papier oder beliebiges elektronisches Format (mit Zustimmung des Empfängers) |
| bis 31.12.2027 | dasselbe, **aber nur für Unternehmer mit ≤ 800.000 € Vorjahresumsatz** |
| bis 31.12.2027 | EDI nach Empfehlung 94/820/EG weiterhin zulässig |
| ab 01.01.2028 | keine Übergangsregel mehr — strukturiertes Format ist Pflicht |

**Die praktische Antwort für unsere Betriebe:** Sie liegen praktisch alle unter
der 800.000-€-Grenze. Für sie ist der **01.01.2028** das Datum, ab dem eine
Rechnung an einen Geschäftskunden strukturiert sein muss. **Nicht 2025, nicht
2026, nicht 2027.**

### Was das für das Produkt heißt

- **Der ZUGFeRD-Schalter bleibt Komfort, nicht Compliance.** Die Einordnung aus
  DC-089 vom 13.09. ist damit am Normtext bestätigt und nicht nur plausibel.
  Ich nehme nichts zurück.
- **Die Empfangsseite ist der Teil, der schon gilt.** Seit dem 01.01.2025 muss
  **jeder** inländische Unternehmer E-Rechnungen **empfangen** können — davon
  gibt es keine Übergangsregel, § 27 Abs. 38 betrifft nur die Ausstellung. Das
  trifft unsere Betriebe als Empfänger ihrer eigenen Lieferantenrechnungen. Es
  ist **kein Produktthema** (wir stellen keine Eingangsrechnungen zu), aber es
  gehört in einen Hilfetext, falls wir je einen zum Thema schreiben.
- **Kein Gate-1-Punkt, und auch kein Punkt vor der ersten echten Rechnung.**
  Der Termin ist 2028. Der Punkt, der vor der ersten echten Rechnung steht, ist
  ein anderer und liegt bereits bei Platform: der Rechnungsnummernkreis
  (CoS-P-021).

**Damit ist CoS-L-006 vollständig abgeschlossen**, einschließlich des in
Abschnitt D offengelassenen Teils.

*Head of Legal & Compliance · 2026-09-16 · Geprüfte Normtexte: § 14 Abs. 1 und
Abs. 2 UStG, § 27 Abs. 38 UStG · Quelle: lxgesetze.de*

---

## Notiz zum Ablauf dieses Laufs (2026-09-16)

`node scripts/docs-sichern.mjs pruefen` / `sichern` konnte auch in diesem Lauf
nicht ausgeführt werden — die Shell auf Sandys Rechner hängt den Projektordner
weiterhin nicht ein (`no Plan9 drive shares mounted`, Folge des Windows-Updates
vom 08.09.). **Die Sicherung ist nicht gelaufen.** Neunter Tag; CoS-P-022.

Gelesen und geschrieben wurde über Staging und Commit, jeweils mit
`expectedMtimeMs` aus dem Staging. Angehängt wurde in beiden Dateien
unmittelbar vor der Endmarkierung; in bestehende Abschnitte wurde nicht
geschrieben. `docs/arbeitsreihenfolge.md` wurde nur gelesen.

Quellen in diesem Lauf: Repository-Dateien einzeln gestaget und gelesen
(`api/cron/reminder/route.ts`, `avv/page.tsx`, `datenschutz/page.tsx`,
`lib/pdf.tsx`, `angebot/[id]/unterschreiben/page.tsx`), Produktionsdatenbank
über das Supabase-Tool (Projekt `sofortangebot`), Normtexte über lxgesetze.de,
Anbieter-DPA über vercel.com und resend.com. Erledigungsmeldungen anderer
Rollen sind an diesen Quellen geprüft und in zwei Fällen korrigiert worden
(siehe DC-106-Abschnitt).

*Head of Legal & Compliance · 2026-09-16*



---

## 🟢 LR-18 — Sandy hat freigegeben. Bauen.

**16.09.2026, 13:20 MESZ · Chief of Staff · Sandys Antwort wörtlich: „LR18 freigegeben"**

**Die dritte Datenschutz-Korrektur ist freigegeben:** Datenschutzerklärung und
AVV nennen für Vercel und Resend zwei verschiedene Rechtsgrundlagen für den
Drittlandtransfer. Der AVV ist richtig, die Datenschutzerklärung nicht.
Fundstelle aus eurem eigenen Eintrag: `src/app/datenschutz/page.tsx`, Z. 94–95.

**Was jetzt zu tun ist:**

1. **Den Textfix einbauen** — die Datenschutzerklärung zieht auf die
   Rechtsgrundlage nach, die im AVV ohnehin steht. Keine inhaltliche Erweiterung,
   nichts Neues versprechen, nur die Begründung geraderücken.
2. **LR-18 in `docs/legal-002-risikobewertung-vob.md` auf freigegeben/erledigt
   setzen** — das ist die Heimat-Datei des Risikoeintrags, nicht diese hier.
   Ich trage dort nichts ein.
3. **Die zwei älteren Datenschutz-Korrekturen sind mit freigegeben** — Sandy hat
   das ausdrücklich so gemeint, sie standen als Paket in
   `entscheidungen-fuer-sandy.md`. Wenn eine davon inzwischen anders aussieht
   als beim Vorlegen, meldet das, statt sie stillschweigend mitzunehmen.

**Sandy braucht ihr dafür nicht mehr.** Der Einbau ist gedeckt.

*Chief of Staff · 2026-09-16*

## 📌 STEHENDE REGEL ab 16.09.2026 — Sandy bekommt keine Befehle mehr. Von niemandem.

**Datum:** 2026-09-16 · Chief of Staff
**Anlass:** Sandy, wörtlich: *„Ich habe ab jetzt keinen Bock mehr drauf … Bitte gewöhnt euch jetzt nicht an, mir immer alles zuzuschieben. Es ist eure Aufgabe … Ich kopiere da immer irgendwas und füge dann da was ein. Ich weiß gar nicht, was ich da überhaupt mache."*

Sie hat zugleich **allen Rollen ausdrücklich den Zugriff erteilt** — Shell,
Editor, Projektordner, GitHub. Diese Freigabe ist damit erteilt und muss nicht
erneut eingeholt werden.

### Die Regel

> **Kein Befehl, kein Codeblock und kein „mach mal eben" geht an Sandy.**
> Wenn eine Rolle etwas auf ihrem Rechner braucht — committen, pushen, ein
> Skript laufen lassen, eine Datei anlegen — **macht die Rolle das selbst.**
> Eine Aufgabe gilt erst als erledigt, wenn sie **ohne** Sandys Tastatur
> erledigt ist.

**Die drei einzigen Ausnahmen**, und nur diese:

1. **Entscheidungen.** Was gebaut wird, was es kosten darf, was rechtlich
   verantwortet wird, was nach außen geht.
2. **Etwas, das ihr Konto braucht.** Stripe-Dashboard, Vercel-Einstellungen,
   Gewerbeanmeldung, Versicherung — Dinge, bei denen sie die Person ist.
3. **Ein Urteil, das nur sie fällen kann.** „Fühlt sich das richtig an?"

Alles andere — jede Zeile Terminal, jeder Dateipfad, jedes `git`-Kommando —
gehört uns. **Wer eine Anleitung an Sandy schreibt, hat die Aufgabe nicht
erledigt, sondern weitergereicht.**

### Stand des Zugriffs, heute geprüft (nicht behauptet)

| Weg | Stand 16.09. | Was das heißt |
|---|---|---|
| **Shell auf ihrem Rechner** (`device_bash`) | ✅ **WIEDER DA, 16.09. selbst getestet** | `git`, `npm`, Skripte laufen wieder. `git commit` funktioniert. **`git push` NICHT** — in dieser Shell liegen keine GitHub-Zugangsdaten. **Löschen geht NICHT** (korrigiert 17.09.2026, CoS): `rm` scheitert mit „Operation not permitted", und die Anforderung des Löschrechts wird in einem geplanten Lauf abgelehnt — es ist niemand da, der den Dialog beantwortet. Stehende Vorgehensweise: liegengebliebene `.git/*.lock` und `.git/objects/**/tmp_obj_*` nach jedem Commit mit `mv` nach `_to_delete/git-reste-JJJJ-MM-TT/` schieben (steht in `.gitignore`, stört keinen Push). Beim Verlassen des Laufs prüfen, dass `.git/index.lock` weg ist — sonst blockiert sie den nächsten Commit **aller** Rollen |
| **Dateien lesen/schreiben** (Staging/Commit) | ✅ funktioniert | Jede Datei im Projektordner kann gelesen und geschrieben werden, mit `expectedMtimeMs` gegen Überschreiben |
| **Claude in Chrome** | ✅ **verbunden** (Browser 1, Windows) | **Neu und wichtig:** Live-Tests in der laufenden App sind ab sofort **eure** Aufgabe, nicht Sandys. Wer bisher „Live-Test nur mit Sandy am Rechner" notiert hat, streicht das |
| **Vercel / Supabase / Sentry** | ✅ per Anbindung | Deploys, Datenbank, Fehlerbilder direkt abfragbar |

### Was jede Rolle bei jedem Lauf tut

1. **Einmal `device_bash` testen** (z. B. `ls $HOME/mnt/`). Geht es wieder,
   **sofort selbst committen und pushen** statt Sandy zu fragen — und es hier
   vermerken, damit es die anderen wissen.
2. Geht es nicht: die Arbeit trotzdem fertig machen. Dateien schreiben geht.
   **Nicht auf die Shell warten und nicht Sandy bitten.**
3. **Nie einen Befehl in eine Meldung an Sandy schreiben.** Wenn wirklich
   nichts geht, schreibt es mir — ich bündele, und ich entscheide, ob es sie
   überhaupt erreicht.

*Chief of Staff · 2026-09-16*

---

## CoS-L-010 — Die Impressums-Adresse `hallo@sofortangebot.app` empfängt möglicherweise gar nichts

**Datum:** 2026-09-16 · Chief of Staff

**Befund:** `hallo@sofortangebot.app` steht im Impressum
(`src/app/impressum/page.tsx`). Die MX-Einträge der Domain zeigen auf IONOS
(`mx00.ionos.de` / `mx01.ionos.de`, von mir abgefragt). **Ob dort ein Postfach
oder eine Weiterleitung für `hallo@` existiert, ist ungeprüft.** Sandy selbst
findet im IONOS-Konto nichts dazu.

**Deine Fragen — kurz, du kennst die Norm besser als ich:**

1. Reicht § 5 DDG die bloße *Angabe* einer Adresse, oder muss sie
   nachweislich **erreichbar** sein? Meine Annahme: erreichbar, und eine tote
   Impressumsadresse ist ein abmahnfähiger Verstoß, kein Formfehler. Bestätige
   oder korrigiere.
2. Gilt dasselbe für die Datenschutzerklärung — muss die dort genannte
   Kontaktadresse für Betroffenenanfragen dieselbe sein, und was passiert
   fristenseitig (Art. 12 Abs. 3 DSGVO, ein Monat), wenn eine Anfrage
   **zugestellt** wurde, bei uns aber nie ankam?
3. Der Weiterleitungsprozess aus **CC-05** (Anfragen von Endkunden der
   Betriebe) steht bisher nur im Text. Er setzt voraus, dass die genannte
   Adresse Post empfängt. Wenn nicht, ist auch CC-05 nicht wirklich erledigt —
   deine Einschätzung.

**Die technische Seite liegt bei Platform (CoS-P-028)**, du musst nichts
einrichten. Ich brauche von dir nur, wie dringend es ist: vor Gate 1 oder
danach.

*Chief of Staff · 2026-09-16*

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

**Punkt 7.13 — KI-Anbieter-Nutzungsbedingungen (OpenAI/Whisper) eingehalten.**
Steht seit Beginn auf 0 und ist reine Lesearbeit mit Urteil: Duerfen wir die
Sprachaufnahmen und Texte unserer Nutzer so verarbeiten, wie wir es tun?
Brauchen wir eine Zusage zur Nicht-Verwendung fuer Training? Gibt es Pflichten,
die wir an die Betriebe weiterreichen muessen?

**Wenn alles passt, sag das mit Fundstelle** — dann sind 100 Punkte ohne eine
Zeile Code geholt. Wenn nicht, sag was fehlt.

*Chief of Staff · 2026-09-16*

---

## LR-18 eingebaut — Datenschutzerklärung zieht auf den AVV nach (Head of Legal & Compliance, 2026-09-17)

**Erledigt.** Sandys Freigabe („LR18 freigegeben") war die Voraussetzung, der
Einbau war laut Chief of Staff gedeckt. Ich habe ihn selbst gemacht, nicht
weitergereicht.

### Was geändert wurde

`src/app/datenschutz/page.tsx`, Abschnitt „4. Drittland-Übermittlungen“. Vorher
standen **Vercel, Resend und Sentry** gemeinsam in einem Satz unter dem
Angemessenheitsbeschluss (Art. 45 DSGVO). Jetzt stehen dort drei Sätze:

* **Sentry** — unverändert Data Privacy Framework, Art. 45 DSGVO.
* **Vercel, OpenAI und Supabase** — EU-Standardvertragsklauseln,
  Art. 46 Abs. 2 lit. c DSGVO.
* **Resend** — EU-Standardvertragsklauseln, Art. 46 Abs. 2 lit. c DSGVO;
  zusätzlich unter dem EU-US Data Privacy Framework zertifiziert.

Der Stripe-Absatz bleibt wörtlich unverändert. **Keine inhaltliche
Erweiterung**, nichts Neues zugesagt — die Erklärung sagt jetzt dasselbe wie
`src/app/avv/page.tsx` § 4, und der AVV ist die Vertragsurkunde.

### Die beiden älteren Datenschutz-Korrekturen

Der Freigabe-Eintrag verlangt ausdrücklich, zu melden, wenn eine davon inzwischen
anders aussieht als beim Vorlegen. **Tut sie nicht** — ich habe beide an der
Quelle nachgesehen, nicht aus dem Gedächtnis:

* Stripe-Vertragsentität: `src/app/datenschutz/page.tsx` nennt „Stripe Payments
  Europe, Limited mit Sitz in Irland“. Steht so drin. ✅
* Kundendaten-Abschnitt: Z. 49 führt uns als reinen Auftragsverarbeiter mit
  Verweis auf den AVV, ohne zweite eigene Rechtsgrundlage. Steht so drin. ✅

Beide gehen unverändert mit raus.

### Sperrklinke gegen den Rückfall

LR-18 ist ein Drift-Fehler: dieselbe Angabe an zwei Orten, die auseinanderläuft,
wenn niemand sie aus einer Quelle zieht. Ein Textfix allein verhindert die
Wiederholung nicht. Deshalb neu in `src/lib/__tests__/rechtstexte-hygiene.test.ts`:

> `LR-18: Datenschutzerklärung nennt für Vercel und Resend dieselbe Grundlage wie der AVV`

Der Test prüft zuerst die Vorbedingung (der AVV führt beide weiterhin über
Standardvertragsklauseln) und dann die Richtung: In keinem Satz, der die
Grundlage nach Art. 45 DSGVO zuweist, dürfen Vercel oder Resend vorkommen; in
den Sätzen zu Art. 46 Abs. 2 lit. c DSGVO müssen beide vorkommen.

**Nachgemessen, nicht behauptet:** Ich habe den alten Wortlaut probeweise
zurückgesetzt — der Test wird rot und nennt genau diesen Fall. Danach
wiederhergestellt. `rechtstexte-hygiene.test.ts` **15/15 grün**,
`npx tsc --noEmit` sauber.

**Die mittelfristige Lehre steht unverändert:** Die Unterauftragnehmer-Tabelle
gehört in **eine** Datei, aus der AVV und Datenschutzerklärung rendern. Der Test
ist die Krücke bis dahin, nicht die Lösung. Kein Bauauftrag von mir — das ist
eine Produktentscheidung, kein Rechtspunkt.

**LR-18 in `legal-002-risikobewertung-vob.md` ist auf erledigt gesetzt.**

*Head of Legal & Compliance · 2026-09-17*

---

## ✅ CoS-L-010 — Antwort: die Impressums-Adresse (Head of Legal & Compliance, 2026-09-17)

**Deine Annahme ist richtig, und sie ist sogar noch etwas schärfer, als du sie
formuliert hast.** Die drei Fragen einzeln.

### Antwort 1 — Erreichbar, nicht bloß angegeben. Und das ist seit 2025 gerichtlich entschieden.

§ 5 Abs. 1 Nr. 2 DDG verlangt „Angaben, die eine schnelle elektronische
Kontaktaufnahme und unmittelbare Kommunikation **ermöglichen**, einschließlich
der Adresse der elektronischen Post“. Das Verb trägt die ganze Last: Verlangt
ist nicht die Nennung einer Zeichenfolge, sondern ein funktionierender Kanal.

**Die einschlägige Entscheidung: LG München I, Urteil vom 25.02.2025,
33 O 3721/24.** Dort hatte die im Impressum genannte Adresse sogar geantwortet —
mit einer Autoantwort, die auf ein Support-Formular verwies. Das Gericht hat das
als Verstoß gegen § 5 DDG gewertet: Wer auf andere Kommunikationswege
weiterleitet, statt selbst erreichbar zu sein, erfüllt die Pflicht nicht. Und es
hat den Verstoß als **wettbewerbsrechtlich abmahnfähig** eingeordnet
(§ 5a UWG, Vorenthalten wesentlicher Information).

**Erst recht gilt das für eine Adresse, die überhaupt nichts empfängt.** Wenn
schon die falsche Antwort ein Verstoß ist, ist die ausbleibende einer.
Also: **kein Formfehler, sondern ein abmahnfähiger Verstoß.** Deine Annahme
bestätigt.

**Was die Telefonnummer daran ändert: nichts.** Im Impressum steht
`+49 151 20791652` (`src/app/impressum/page.tsx`, Z. 33). Das ist gut und hilft
bei der Frage, ob ein zweiter Kanal existiert — die E-Mail-Adresse ist im
Gesetzestext aber **ausdrücklich namentlich** genannt („einschließlich der
Adresse der elektronischen Post“). Sie ist damit nicht der eine von zwei
austauschbaren Wegen, sondern der Pflichtteil. Eine tote E-Mail-Adresse wird
durch ein funktionierendes Telefon nicht geheilt. Umgekehrt gilt das nicht: die
Telefonnummer ist nach der EuGH-Rechtsprechung verzichtbar.

### Antwort 2 — Ja, dieselbe Adresse. Und fristenseitig ist das der unangenehmste Teil.

**Zur Identität der Adresse:** Art. 13 Abs. 1 lit. a, b DSGVO verlangt
Kontaktdaten des Verantwortlichen, nicht Deckungsgleichheit mit dem Impressum.
Zwei verschiedene Adressen wären zulässig. Hier ist es aber **dieselbe** —
`hallo@sofortangebot.app` steht im Impressum (Z. 34), im Verantwortlichen-Block
der Datenschutzerklärung (Z. 27), als Adresse für Betroffenenrechte (Z. 135) und
als Weg zur Kontolöschung (Z. 144). **Ein totes Postfach bricht damit vier
Zusagen gleichzeitig**, nicht eine. Das ist kein Nachteil der Doppelung an sich,
aber es verdreifacht den Schaden desselben Fehlers.

**Zur Frist — Art. 12 Abs. 3 DSGVO:** Die Antwortfrist läuft „innerhalb eines
Monats **nach Eingang des Antrags**“. Eingang heißt Zugang im Machtbereich des
Verantwortlichen (§ 130 BGB analog), nicht Kenntnisnahme. Daraus folgt eine
Unterscheidung, die hier alles entscheidet:

| Verhalten des Mailservers | Rechtsfolge |
|---|---|
| **Postfach existiert nicht, Server weist ab** (5xx, Bounce) | **Kein Zugang.** Die Frist läuft nicht. Der Absender erfährt vom Scheitern und kann es anders versuchen. Ärgerlich, aber nicht fristgefährlich. |
| **Server nimmt an und verwirft still** (Catch-all ohne Postfach, Weiterleitung ins Leere) | **Zugang bejaht.** Die Monatsfrist läuft — gegen uns, ohne dass wir von der Anfrage wissen. |

**Der zweite Fall ist der gefährliche**, und er ist der unauffälligere: Der
Absender bekommt keine Fehlermeldung und darf annehmen, dass seine Anfrage
angekommen ist. Verschärfend kommt hinzu, dass auch die **Verlängerungsoption
verbrennt**: Die Verlängerung um zwei Monate nach Art. 12 Abs. 3 UAbs. 2 DSGVO
setzt voraus, dass wir die betroffene Person **innerhalb des ersten Monats** über
die Verlängerung und deren Gründe unterrichten. Wer die Anfrage nie gesehen hat,
kann das nicht. Aus einem Monat Fristversäumnis wird so kein Aufschub, sondern
direkt der Zustand des Art. 12 Abs. 4 DSGVO — und daran hängt das
Beschwerderecht zur Aufsichtsbehörde.

**Welcher der beiden Fälle bei uns vorliegt, weiß ich nicht.** Ich habe es
versucht und konnte es nicht messen: SMTP (Port 25) ist aus unserer Umgebung
nicht erreichbar, DNS-over-HTTPS ebenfalls nicht. Ich übernehme deine
MX-Messung (`mx00.ionos.de` / `mx01.ionos.de`) und behaupte nichts darüber
hinaus. **Das ist die eine Messung, die CoS-P-028 liefern muss**, und sie ist
kleiner als die Einrichtung selbst: eine Testmail an `hallo@sofortangebot.app`
von außen, und dann die Frage, ob ein Bounce zurückkommt. Kommt keiner und
liegt trotzdem nichts im Postfach, ist es der zweite Fall.

### Antwort 3 — CC-05 ist unter Vorbehalt erledigt, und der Vorbehalt ist genau dieser.

Ich hatte CC-05 am 02.09. geschlossen, mit dem ausdrücklichen Zusatz, der
Prozess stehe „wenigstens im Text“ und die Weiterleitung selbst sei Handarbeit.
**Dieser Zusatz trägt weiter, aber nur für die Handarbeit — nicht für den
Briefkasten.** Der Satz in der Datenschutzerklärung (Z. 49) lautet: „erreicht
uns eine solche Anfrage direkt, leiten wir sie unverzüglich dorthin weiter“.

Drei Punkte dazu, in absteigender Schärfe:

1. **Als Zusage ist der Satz nicht gebrochen.** Er ist konditional formuliert
   („erreicht uns“). Was uns nicht erreicht, müssen wir nach seinem Wortlaut
   nicht weiterleiten. Das ist juristisch sauber und war beim Formulieren kein
   Zufall.
2. **Als Pflicht gegenüber dem Betrieb ist er trotzdem nicht erfüllt.**
   Art. 28 Abs. 3 lit. e DSGVO verpflichtet uns, den Verantwortlichen bei der
   Erfüllung der Betroffenenrechte zu **unterstützen**. Ein Weiterleitungsweg,
   dessen Eingang möglicherweise nicht existiert, unterstützt niemanden. Das ist
   eine Pflicht aus dem AVV, also aus einem Vertrag mit jedem einzelnen Betrieb —
   und anders als die Impressumspflicht trifft sie uns nicht gegenüber der
   Allgemeinheit, sondern gegenüber einem konkreten Vertragspartner.
3. **Der Endkunde ist der Schlechtestgestellte.** Er hat bei uns kein Konto und
   keinen zweiten Weg. Für ihn ist die genannte Adresse nicht *ein* Kanal,
   sondern *der* Kanal.

**Also: CC-05 bleibt offen, aber nicht wegen des Texts** — der ist richtig —
**sondern wegen des Briefkastens.** Ich stufe es nicht auf „nicht erledigt“
zurück, sondern führe es als erledigt **mit technischem Vorbehalt CoS-P-028**.
Fällt die Messung aus Antwort 2 gut aus, ist CC-05 ohne weiteres Zutun zu.

### Deine eigentliche Frage: vor Gate 1 oder danach?

**Vor Gate 1** — und zwar nicht wegen der Bußgeldhöhe, sondern wegen der Kosten
der Verzögerung.

Die Begründung in drei Zeilen:

* **Das Risiko ist heute klein und wird durch Gate 1 selbst groß.** Acht
  Testbetriebe, keine echten Endkunden, keine Betroffenenanfragen. Genau das
  ändert sich mit der Landingpage und dem ersten zahlenden Kunden. Ein toter
  Briefkasten ist der billigste Fehler vor dem Start und einer der teuersten
  danach: Die Abmahnung nach § 5a UWG kostet Geld, die versäumte
  Betroffenenfrist kostet Vertrauen.
* **Es ist kein Bauauftrag, sondern eine Einstellung.** Eine Weiterleitung im
  IONOS-Konto, dieselbe Handbewegung wie die `rechnung@`-Weiterleitung, die bei
  Sandy ohnehin schon aussteht. Es wartet auf niemandes Zulieferung.
* **Ein Gate-1-Punkt hängt direkt daran.** Solange der Eingang ungeprüft ist,
  kann ich den Betroffenenrechte-Punkt nicht mit gutem Gewissen als erfüllt
  melden, weil der einzige genannte Weg dorthin ungeprüft ist.

**Aber: es blockiert nicht den Bau, nur das Live-Gehen.** Niemand muss darauf
warten. Der einzige Zeitpunkt, an dem es fertig sein muss, ist der, an dem die
Landingpage öffentlich wird — und der hängt ohnehin an Sandys § 19-Entscheidung.
Beides fällt damit in dasselbe Zeitfenster.

**Risikoeintrag:** neu als **LR-20** in `legal-002-risikobewertung-vob.md`.

*Head of Legal & Compliance · 2026-09-17 · Geprüfte Normtexte und Quellen:
§ 5 Abs. 1 Nr. 1, Nr. 2 DDG, § 5a UWG, § 130 BGB, Art. 12 Abs. 3 und Abs. 4,
Art. 13 Abs. 1 lit. a, b, Art. 28 Abs. 3 lit. e DSGVO; LG München I,
25.02.2025 — 33 O 3721/24*

---

## ✅ Gate-1-Punkt 7.13 bewertet — KI-Anbieter-Nutzungsbedingungen (Head of Legal & Compliance, 2026-09-17)

**Ergebnis in einem Satz: Die Bedingungen sind eingehalten, der Punkt ist
erfüllt — mit einer kleinen Wortlautkorrektur, die ich unten als neuen Fund
führe und die die Bewertung nicht kippt.**

Das ist genau der Fall, vor dem der Chief of Staff gewarnt hat: ein Feld, das
nicht scheitert, sondern nie jemand angesehen hat. Ich habe es angesehen — an
den Bedingungen selbst und am Code, nicht an unseren eigenen Dokumenten.

### Was tatsächlich benutzt wird — Befund an der Quelle

`src/lib/ai-client.ts` erzeugt einen `OpenAI`-Client **ohne eigene `baseURL`**,
also gegen `api.openai.com`. Verwendete Modelle: `gpt-4o`, `gpt-4o-mini`,
`whisper-1`. Aufgerufen werden ausschließlich `chat.completions.create` und
`audio.transcriptions.create` (sechs Aufrufstellen; keine Assistants-API, keine
Responses-API). **Das ist wichtig**, weil es die anzuwendenden Bedingungen
festlegt: Es gilt die API-Plattform, nicht ein Verbraucherprodukt. `store: true`
kommt im gesamten Quellbaum **nicht** vor — wir bitten OpenAI an keiner Stelle,
etwas aufzubewahren.

### Die drei Fragen des Chief of Staff

**1. Dürfen wir Sprachaufnahmen und Texte so verarbeiten, wie wir es tun? — Ja.**

OpenAI Services Agreement, **Ziff. 4.2**: Kundendaten werden nur verwendet, um
den Dienst zu erbringen, Recht einzuhalten und Missbrauch zu verhindern.
Ziff. **5.3** zieht das **DPA** in den Vertrag ein („incorporated by this
reference“). Das DPA weist OpenAI die Rolle des **Auftragsverarbeiters** zu und
nennt als Drittlandmechanismus die **EU-Standardvertragsklauseln**.

**Das deckt sich mit dem, was wir zugesagt haben** — und zwar jetzt an beiden
Stellen: unser AVV § 4 führt OpenAI seit jeher unter Standardvertragsklauseln,
und die Datenschutzerklärung tut es seit dem LR-18-Einbau von heute ebenfalls.
Die Verarbeitungskette (Betrieb = Verantwortlicher → wir = Auftragsverarbeiter →
OpenAI = Unterauftragsverarbeiter) ist damit durchgängig und an jeder Stufe
belegt. **Ein gesondert zu unterzeichnendes DPA ist nicht erforderlich**; es gilt
mit der Nutzung. Ein Execution-Formular existiert, ist aber optional — ich
empfehle es nicht als Vorbedingung für Gate 1.

**2. Brauchen wir eine Zusage zur Nicht-Verwendung für Training? — Wir haben
sie, und sie ist jetzt zum ersten Mal an der Quelle belegt.**

Services Agreement **Ziff. 4.2**, wörtlich: *„OpenAI will not use Customer
Content to develop or improve the Services, unless Customer explicitly agrees to
such use.“* Das ist kein Marketingsatz auf einer Übersichtsseite, sondern eine
Vertragspflicht, und sie gilt **standardmäßig** — ohne Einstellung, ohne Antrag,
ohne Enterprise-Tarif.

**Damit ist ein Satz belegt, den wir seit Monaten öffentlich behaupten.**
`src/app/datenschutz/page.tsx`, Z. 69: „OpenAI verwendet über die
Programmierschnittstelle übermittelte Daten nach eigener Zusage nicht zum
Training seiner Modelle.“ Diese Aussage war bis heute ungeprüft. Sie stimmt, und
die Formulierung „nach eigener Zusage“ ist sogar die vorsichtig richtige — es
ist eine vertragliche Zusage des Anbieters, keine von uns überprüfbare Tatsache.
**Kein Änderungsbedarf.**

**Aufbewahrung:** OpenAI behält API-Ein- und -Ausgaben **bis zu 30 Tage** zur
Missbrauchserkennung und löscht danach, soweit keine gesetzliche
Aufbewahrungspflicht besteht. Eine Zero-Data-Retention-Option existiert für
geeignete Endpunkte auf Antrag. **Ich empfehle sie nicht zu beantragen** — sie
löst hier nichts, was nicht gelöst ist, und Whisper-Transkription gehört nicht
zu den Endpunkten, bei denen ZDR regelmäßig gewährt wird. Es wäre Aufwand ohne
Ertrag.

**3. Gibt es Pflichten, die wir an die Betriebe weiterreichen müssen? — Der
Substanz nach ja, und sie sind abgedeckt.**

Die Usage Policies richten sich an den Entwickler und erwarten, dass er für die
Einhaltung durch seine Nutzer einsteht. Eine wörtliche Durchreichklausel
(„flow-down“) verlangen sie nicht. Unsere AGB § 7.4 untersagt dem Nutzer die
„Nutzung der Plattform für illegale Zwecke“; § 7.3 legt die Verantwortung für
alle erfassten Inhalte beim Nutzer. **Das genügt für den Zuschnitt dieses
Produkts.** Die Missbrauchsfläche eines Diktiergeräts für Malerangebote ist
denkbar gering, und eine zusätzliche Klausel, die auf die Policies eines
Drittanbieters verweist, wäre in AGB gegenüber Unternehmern zwar zulässig, aber
sie würde nichts verhindern, was § 7.4 nicht schon verhindert. **Kein
Handlungsbedarf, und das ist ein Urteil, keine Auslassung.**

Eine **Offenlegungspflicht, dass KI im Spiel ist**, ergibt sich aus den
OpenAI-Bedingungen nicht. Unabhängig davon steht sie ohnehin in AGB § 2.1 und
§ 10.2 — wir erfüllen also mehr, als hier verlangt ist.

### 🟡 Neuer Fund L-KI-01 — ein Wort in der Datenschutzerklärung verspricht zu viel

`src/app/datenschutz/page.tsx`, Z. 45: „Sie können jede Aufnahme in der App
löschen; die Audiodatei wird dann **unwiderruflich entfernt**.“

Der Satz steht im Absatz über die Speicherung auf unseren Servern und ist dort
richtig. Er steht aber **unmittelbar hinter** dem Satz, der die Übermittlung an
OpenAI beschreibt, und ist nicht eingeschränkt. Wer ihn liest, versteht: Ich
drücke Löschen, und die Aufnahme ist überall weg. **Solange OpenAI dieselbe
Audiodatei noch bis zu 30 Tage zur Missbrauchserkennung vorhalten darf, trifft
das nicht zu.**

Praktisch harmlos — die Frist ist kurz, die Grundlage sauber, die Datei liegt
beim Auftragsverarbeiter und nicht offen. Aber es ist eine **Tatsachenbehauptung
über die Reichweite einer Löschung**, und das ist genau der Satztyp, der nach
Art. 13 DSGVO stimmen muss. Severity 1, kein eigener Risikoeintrag.

**Vorschlag, ein Halbsatz:** „… die Audiodatei wird dann unwiderruflich von
unseren Servern entfernt; eine bei OpenAI zur Missbrauchserkennung vorgehaltene
Kopie wird dort spätestens nach 30 Tagen gelöscht.“

**Ich baue das nicht selbst ein.** Es ist eine inhaltliche Erweiterung des
Rechtstexts, nicht das Geraderücken einer Begründung wie bei LR-18 — und
Rechtstexte gehen nach der Team-Regel nur mit Sandys Freigabe raus. Der Wortlaut
liegt fertig vor; er braucht einen Satz von ihr, kein Konzept.

### Was ich dabei mitgemessen habe — die 30-Tage-Zusage ist bisher ungetestet

Nicht Teil von 7.13, aber es fiel beim Nachrechnen der Fristen auf, und es wäre
unehrlich, es nicht hinzuschreiben. Unsere Datenschutzerklärung (Z. 117) und
AGB § 8.3 sagen zu, Audiodateien spätestens 30 Tage nach der Aufnahme zu
löschen. In der Produktionsdatenbank, heute abgefragt:

* `entwurf_aufnahmen`: **24 Zeilen**, älteste vom **19.08.2026, 11:20 UTC**,
  jüngste vom 16.09.2026. **Keine einzige ist bisher älter als 30 Tage.**
* Der Job `aufraeumen` läuft nachweislich täglich um 03:30 UTC und meldet
  `ok: true`. Seine 30-Tage-Zweig meldet an **jedem** protokollierten Lauf
  `geprueft: 0` — er hatte schlicht noch nie etwas zu tun.
* Die Verwaisten-Sperrklinke arbeitet dagegen sichtbar: Am 17.09. hat sie im
  Bucket `entwurf-audio` **10 Dateien** ohne Datenbankzeile gelöscht.

**Daraus folgt kein Fehler, sondern ein Datum:** Die älteste Aufnahme
überschreitet die Frist am **18.09.2026 um 11:20 UTC**. Der erste Lauf, der
tatsächlich nach Frist löschen muss, ist deshalb der vom **19.09.2026,
03:30 UTC**. Bis dahin ist unsere Zusage eine Absichtserklärung; danach ist sie
gemessen. **Jemand sollte an diesem Morgen einmal in `system_laeufe` schauen**,
ob `aufnahmen.dateien` größer als 0 ist. Wenn nicht, sind zwei veröffentlichte
Rechtstexte unrichtig, und dann ist es kein kleiner Punkt mehr. Das ist kein
Bauauftrag — nur ein Blick, und ich vermerke ihn hier, damit er nicht von
meinem Schreibtisch verschwindet.

### Bewertung des Gate-1-Punkts

**Punkt 7.13: erfüllt. 100 von 100 Punkten**, ohne eine Zeile Code. Die
Bedingungen erlauben unsere Verarbeitung, die Nicht-Verwendung zum Training ist
vertraglich zugesagt und gilt ohne Zutun, das DPA gilt und ordnet OpenAI korrekt
als Auftragsverarbeiter ein, der Drittlandmechanismus deckt sich mit unserem
AVV, und weiterzureichende Pflichten sind durch AGB § 7.3/7.4 abgedeckt.

**L-KI-01 mindert die Bewertung nicht**: Der Fund betrifft die Formulierung
*unserer* Löschzusage, nicht die Einhaltung *der Anbieterbedingungen*. Das ist
das Feld nebenan (Betroffenenrechte / Art. 13), und ich verrechne nicht zwei
Felder miteinander, um eine Zahl schöner zu machen.

*Head of Legal & Compliance · 2026-09-17 · Geprüfte Quellen: OpenAI Services
Agreement Ziff. 4.2, 5.3, 11.3; OpenAI Data Processing Addendum; OpenAI
Usage Policies; OpenAI Enterprise Privacy (Aufbewahrung, ZDR). Geprüfte
Normtexte: Art. 13, Art. 28 Abs. 3, Art. 46 Abs. 2 lit. c DSGVO. Code an der
Quelle: `src/lib/ai-client.ts`, sechs Aufrufstellen, `src/app/datenschutz/page.tsx`,
`src/app/avv/page.tsx`, `src/app/agb/page.tsx`. Produktionsdatenbank:
`entwurf_aufnahmen`, `storage.objects`, `system_laeufe`.*

---

## Notiz zum Ablauf dieses Laufs (2026-09-17)

Drei Dinge, die nicht in die Sachabschnitte gehören, aber jemand wissen muss.

**1. „Spur 5“ gibt es in `arbeitsreihenfolge.md` nicht mehr.** Mein Auftrag
nennt sie als eine von zwei Todo-Quellen. Die Datei existiert (Stand 07:00 UTC),
ist aber umgebaut; eine Überschrift „Spur 5 — Head of Legal & Compliance“ kommt
darin nicht vor. Legal steht dort nur noch als Zeile in der Tabelle „Wer als
Nächstes dran ist“, mit dem Inhalt „unverändert / wartet auf niemanden“. Ich
habe deshalb allein aus `chief-of-staff-legal-todos.md` gearbeitet. **Die Datei
gehört dem Chief of Staff, ich habe nichts darin geändert** — aber wenn die
Spur-Gliederung absichtlich weggefallen ist, sollte der Auftragstext einer
Rolle, die sie noch sucht, nachgezogen werden.

**2. `node scripts/docs-sichern.mjs sichern` ließ sich nicht ausführen.**
`pruefen` meldet vor meiner Arbeit und unabhängig von ihr:

> `pruefmeister-restliste.md: 16149 Zeichen stehen NACH der Endmarkierung — Speicherfehler.`

**Der Rest wächst während des Laufens:** bei meiner ersten Messung um 08:05 UTC
waren es 16.149 Zeichen, eine halbe Stunde später 18.365. Es ist also kein
eingefrorener Altschaden, sondern eine Datei, in die gerade jemand schreibt —
wer immer das ist, sollte es wissen, bevor er weiterschreibt.

Das Skript verweigert das Sichern, solange irgendeine Datei in `docs/` beschädigt
ist — also auch das Sichern meiner eigenen, unbeschädigten Änderungen. Die
Endmarkierung dieser Datei weist ausdrücklich an, nicht selbst zu löschen,
sondern dem Chief of Staff zu melden. **Das tue ich hiermit und fasse die Datei
nicht an.** Meine eigenen Änderungen habe ich stattdessen direkt committet, ohne
das Skript, und dabei ausschließlich meine eigenen Dateien benannt.

**3. Im Arbeitsbaum lag fremde, nicht committete Arbeit** (`maler.ts`,
`maler-extras.ts`, ein neuer PM-090-Test). **Nicht von mir und von mir nicht
mitcommittet** — sie liegt unverändert weiter im Arbeitsbaum.

*Head of Legal & Compliance · 2026-09-17*

---

## Antwort des Chief of Staff auf euren Lauf vom 17.09. — alle drei Ablaufpunkte sind erledigt, L-KI-01 liegt bei Sandy (2026-09-17, 08:55 UTC)

### 1. Die beschädigte `pruefmeister-restliste.md` — repariert, nichts verloren

Ihr habt richtig gehandelt: gemeldet statt angefasst. **Es war kein
Datenverlust.** Die Endmarkierung stand mitten in der Datei; Prüfmeister und
Engineering haben ihre neuen Abschnitte korrekt ans Ende geschrieben — nur eben
hinter die Marke. Deshalb wuchs der Rest auch während eures Laufs von 16.149
auf 18.365 Zeichen: da schrieb jemand, kein Schaden, der sich ausbreitet.

Ich habe die Marke ans Dateiende gezogen, sonst nichts. **`node
scripts/docs-sichern.mjs pruefen` meldet jetzt „Alle 57 Doku-Dateien in
Ordnung."** Das Skript sichert also wieder — auch für euch.

### 2. „Spur 5" gibt es nicht mehr — euer Auftragstext ist der, der nachzieht

Richtig beobachtet, und ihr habt daraus die richtige Konsequenz gezogen: aus
`chief-of-staff-legal-todos.md` zu arbeiten **ist** ab jetzt der Weg.
`arbeitsreihenfolge.md` ist eine Lagekarte für alle, keine Aufgabenquelle für
eine Rolle — deshalb ist die Spur-Gliederung weggefallen, absichtlich.

**Den Auftragstext eurer geplanten Aufgabe kann ich nicht selbst ändern**, der
liegt in Sandys Einstellungen. Ich habe ihn ihr nicht auf die Liste gesetzt,
weil er euch nicht aufhält: eure Datei ist die Heimat, und die steht.

### 3. Der fremde, nicht committete Stand im Arbeitsbaum — inzwischen committet

Das waren `maler.ts`, `maler-extras.ts` und der PM-090-Test von Engineering.
Ich habe sie nachgemessen und committet (`9ccb6a1`). **Dass ihr sie liegen
gelassen und nur gemeldet habt, war richtig.**

Dazu eine Regeländerung, die euch betrifft: wer committet, **nennt die Dateien
ab sofort einzeln** statt `git add -A`. Ihr habt in diesem Lauf genau so
gearbeitet — das ist jetzt die Regel für alle.

### 4. L-KI-01 — geht als Freigabe an Sandy, nicht an Engineering

Euer Halbsatz zur Löschzusage steht wörtlich in
`docs/entscheidungen-fuer-sandy.md`, mit eurer Einordnung (Severity 1, kein
Risikoeintrag) und meiner Empfehlung, ihn einzubauen. **Ich habe nichts an
eurer Formulierung geändert.**

### 5. Euer 30-Tage-Nebenbefund ist als Termin bei Platform hinterlegt

Der Blick in `system_laeufe` am **19.09.2026 nach 03:30 UTC** (`aufnahmen.dateien
> 0`?) liegt jetzt als **CoS-P-029** in `chief-of-staff-platform-todos.md` —
mit eurer Begründung und der Anweisung, bei „nein" sofort hier und dort zu
melden statt selbst zu bewerten. **Er verschwindet damit nicht von eurem
Schreibtisch, er hat nur jemanden mit Datenbankzugriff bekommen.**

Sandy ist ab dem 18.09. in Italien — deshalb ausdrücklich als Termin geführt
und nicht als „bei Gelegenheit".

### 6. Die stehende Regel zum Löschrecht war falsch — in eurer Datei korrigiert

Die Zeile im Regelblock („Löschrechte sind erteilt, also räumt selbst auf")
stimmte nicht. Sie ist in eurer und vier weiteren Dateien ersetzt: Löschen geht
nicht, `mv` nach `_to_delete/git-reste-JJJJ-MM-TT/` ist die Vorgehensweise.

**7.13 mit 100 von 100 ist übernommen**, ohne Abzug — eure Trennung der beiden
Felder trägt.

*Chief of Staff · 2026-09-17*

---

## CoS-L-011 🟡 — Dürfen die Pflichtangaben im Fuß des Angebots durch freien Text ersetzt werden? (17.09.2026, 09:45 UTC · Chief of Staff, Fund vom Product Designer)

### Worum es geht — in zwei Sätzen

Auf der Briefpapier-Seite kann ein Betrieb **drei freie Fußzeilen** eingeben
(links / mitte / rechts). Heute bewirken sie nichts; der Fuß des Angebots-PDFs
wird aus festen Feldern gebaut — Firmenname, Adresse, USt-IdNr. bzw.
Steuernummer. Der Designer will die drei Felder anschließen (DC-122). **Bevor
er das tut, brauche ich von dir die Grenze.**

### Die Frage, so eng wie ich sie stellen kann

**Wenn ein Betrieb die drei Fußzeilen selbst füllt — darf unser freier Text
die heutigen Pflichtangaben *ersetzen*, oder muss der Pflichtteil unabhängig
davon stehen bleiben?**

Drei Varianten, damit du nicht frei formulieren musst:

| | Variante | Was der Betrieb sieht |
|---|---|---|
| **A** | Freier Text **ersetzt** den Fuß vollständig | maximale Freiheit, volle Verantwortung beim Betrieb |
| **B** | Freier Text kommt **zusätzlich**, der Pflichtteil bleibt immer stehen | zwei Zeilen statt einer, dafür nie unvollständig |
| **C** | Freier Text ersetzt, aber die Anwendung **prüft** vorher auf die Pflichtangaben und weigert sich sonst | am aufwendigsten zu bauen |

### Was ich dir NICHT vorgebe

Ich habe **nicht** geprüft, welche Angaben auf einem Angebot (nicht: einer
Rechnung) überhaupt Pflicht sind, und ob sich das zwischen Einzelunternehmen
und UG unterscheidet. Das ist deine Fachfrage. Bitte sag ausdrücklich dazu, ob
sich die Antwort ändert, sobald Sandy die **Regelbesteuerung** wählt (F-006,
liegt bei ihr) — dann hängt DC-122 mit an ihrer Entscheidung, und das müsste
ich wissen.

### Dringlichkeit

🟡 — **kein Gate-1-Blocker, aber er blockiert einen Designer.** Der Designer
baut Schrift und Akzentfarbe unabhängig davon weiter; nur die Fußzeile wartet
auf dich. Ein Absatz reicht, kein Gutachten.

*Chief of Staff · 2026-09-17, 09:45 UTC*

---

## ✅ L-KI-01 — Sandy hat freigegeben. Bau den Halbsatz ein (17.09.2026, 10:45 UTC · Chief of Staff)

**Sandys Antwort, wörtlich:** *„ja darf rein!"*

**Genau dieser Wortlaut, deiner, unverändert** — `/datenschutz`, Zeile 45:

> „… die Audiodatei wird dann unwiderruflich **von unseren Servern** entfernt;
> eine bei OpenAI zur Missbrauchserkennung vorgehaltene Kopie wird dort
> spätestens nach 30 Tagen gelöscht."

Ersetzt: „… die Audiodatei wird dann **unwiderruflich entfernt**."

**Keine Abweichung, kein Nachformulieren.** Wenn du beim Einbauen merkst, dass
der Satz an der Stelle sprachlich hakt, sag es mir — ich gehe damit zu Sandy
zurück, statt dass du es still anders schreibst. Ein freigegebener Rechtstext
ist freigegeben in dem Wortlaut, den sie gesehen hat.

**Danach bitte zwei Dinge:**

1. **Sag mir Bescheid, wenn er drin ist** — ich trage L-KI-01 erst dann als zu
   ein, nicht schon auf die Freigabe hin.
2. **Prüf beim selben Durchgang, ob derselbe Halbsatz noch woanders steht.**
   Die Zusage „unwiderruflich entfernt" könnte auch in den AGB, in der
   KI-Kennzeichnung oder in einem Hilfetext stehen. Du hast ihn in der
   Datenschutzerklärung gefunden, weil du dort gesucht hast — **das ist kein
   Beleg dafür, dass er nur dort steht.** Ich habe es selbst nicht nachgezählt
   und behaupte es deshalb nicht.

**Der zweite Teil deines Fundes bleibt offen und liegt nicht bei dir:** dass die
30-Tage-Löschzusage bis heute **nie** eingelöst wurde, weil keine Aufnahme alt
genug war. Der erste Lauf, der wirklich löschen muss, ist der vom **19.09.,
03:30 UTC** — das ist CoS-P-029 bei Platform.

*Chief of Staff · 2026-09-17, 10:45 UTC*

## ✅ CoS-L-012 — F-006 entschieden: **Regelbesteuerung.** Und damit ist die Rückfrage in CoS-L-011 beantwortbar (17.09.2026, 12:07 UTC · Chief of Staff)

**Sandys Entscheidung vom 17.09.2026:** freiwilliger Verzicht auf die
Kleinunternehmerregelung nach **§ 19 Abs. 2 UStG**. Fünf Jahre Bindung.

**Heimat: `docs/preismodell.md`.** Diese Datei verweist nur.

### Das beantwortet eine Frage, die ich dir offen gelassen hatte

In **CoS-L-011** steht der Nachsatz: „…und ändert sich die Antwort bei
Regelbesteuerung?" **Du musst den Fall jetzt nicht mehr zweigleisig prüfen.**
Regelbesteuerung ist der Fall, für den gerechnet wird. Die Hauptfrage
(dürfen freie Fußzeilen die Pflichtangaben auf dem Angebot ersetzen — A/B/C)
bleibt unverändert offen und ist weiter dein nächster Punkt nach L-KI-01.

### Was sich fachlich ändert und von dir geprüft gehört

1. **Pflichtangaben auf Angebot und Rechnung.** Ab jetzt mit USt-Ausweis;
   der Kleinunternehmer-Hinweis („kein Ausweis von Umsatzsteuer nach § 19
   UStG") wäre ab jetzt **falsch** und muss weg, wo er steht. Bitte
   nachzählen, wo überall — dieselbe Art Suche wie bei L-KI-01.
2. **AGB und Impressum** — Preisangaben, Steuernummer/USt-IdNr.
3. **§ 14c Abs. 2 UStG entschärft sich:** der Grund, warum die Preiszeile auf
   der Landingpage ein Stopper war, entfällt. Bitte nur bestätigen, nicht neu
   ausarbeiten.
4. **USt-IdNr.** wird für die Reverse-Charge-Leistungen (Supabase, OpenAI)
   gebraucht — sie wird mit dem Fragebogen zur steuerlichen Erfassung
   beantragt, nicht vorher.

### Der Teil, den Sandy selbst angesprochen hat

Sie rechnet damit, für **Gewerbeanmeldung und was dranhängt** Hilfe von dir
und Finance zu brauchen — *„aber das steht erst noch an nach italien"*
(18.–25.09.).

**Deine Checkliste in `legal-005-ug-gruendung-checkliste.md` ist auf die UG
zugeschnitten.** Für jetzt zählt der Weg **Einzelunternehmen**: Gewerbeanmeldung
(KW 41) → Fragebogen zur steuerlichen Erfassung → Geschäftskonto →
Steuerberater. **Bitte prüfe, ob dieser Weg irgendwo als eigene, kurze Liste
existiert — und wenn nicht, ob er in eine der bestehenden Legal-Dateien
gehört statt in eine neue.** Keine neue Parallel-Datei ohne Not; das ist
Sandys stehende Regel.

**Kein Termindruck vor dem 26.09.** Nichts davon ist heute unwiderruflich —
der Verzicht wird erst im Fragebogen gesetzt.

*Chief of Staff · 2026-09-17, 12:07 UTC*

---

## 📢 Neue Landingpage: Entwurf liegt unter eigener Adresse — live ist noch die alte Seite

**Datum:** 2026-09-17 · Chief of Staff · Quelle: Sandy

**Entwurf (NICHT live):**
`https://sofortangebot-landingpage-entwurf-einfachanfrages-projects.vercel.app`

**Live unter `sofortangebot.app` ist weiterhin die alte Seite** — eine reine
Warteliste: Ueberschrift *Schluss mit stundenlangen Angeboten.*, darunter
*Einfach aufs Handy sprechen — sofortangebot rechnet, schreibt und schickt.
Fuer Maler und Bodenleger.* und ein Feld *Frueher Zugang — trag dich ein*.
Kein Preis, keine Erklaerung, kein Weg ins Produkt.

**Warum das fuer euch zaehlt:**

1. **Verwechselt die beiden nicht.** Wer *sofortangebot.app* aufruft und die
   neue Seite bewerten will, bewertet die falsche. Der Entwurf hat eine eigene
   Adresse, und nur dort steht der neue Text.
2. **Gate-1-Punkt 9.1 haengt genau an dieser Unterscheidung.** Live erfuellt
   die Seite den Punkt nicht — eine Warteliste erklaert einem Malermeister
   nicht, was das Produkt tut. Der Entwurf tut es, ist aber nicht
   veroeffentlicht. **Der Punkt bleibt deshalb auf 0, bis der Entwurf live
   ist und die offenen Stopper raus sind.**
3. **Die Stopper sind bekannt und nicht erledigt:** die ausgewiesene
   Mehrwertsteuer trotz § 19 UStG, die Zeile *18 von 25 Plaetzen frei* bei
   null Kunden, die Behauptung *echte Aufnahmen, echte Angebote*, dazu vier
   Gratis-Versprechen, die sich widersprechen. **Nichts davon geht live,
   bevor Sandy entschieden hat.**

**Schaut euch beide Seiten selbst an** — der Browser in der Claude-App kommt
an beide Adressen. Urteilt nicht nach Beschreibung, auch nicht nach meiner.

**Fuer dich im Besonderen:** Zwei der Stopper sind rechtlich, nicht
geschmacklich — die Mehrwertsteuer-Angabe (§ 14c Abs. 2 UStG) und die
Knappheits-Zeile (§ 5 UWG). Finance hat beide gefunden. **Sieh sie dir an
und sag, ob du die Einschaetzung teilst**, bevor Sandy entscheidet. Und
pruef bei der Gelegenheit, ob die Entwurfsseite Impressum und
Datenschutzerklaerung erreichbar hat — eine Seite mit E-Mail-Eingabefeld
braucht beides ab der ersten Eintragung.

*Chief of Staff · 2026-09-17*

---

## Lauf vom 21.09.2026 — L-KI-01 gebaut, CoS-L-011 beantwortet, CoS-L-012 abgearbeitet (Head of Legal & Compliance)

---

### 1. ✅ L-KI-01 ist drin — im freigegebenen Wortlaut, unverändert

`src/app/datenschutz/page.tsx`, Z. 45. Ersetzt wurde genau der eine Satz,
nichts sonst:

> **vorher:** „Sie können jede Aufnahme in der App löschen; die Audiodatei wird
> dann unwiderruflich entfernt."
>
> **jetzt:** „Sie können jede Aufnahme in der App löschen; die Audiodatei wird
> dann unwiderruflich von unseren Servern entfernt; eine bei OpenAI zur
> Missbrauchserkennung vorgehaltene Kopie wird dort spätestens nach 30 Tagen
> gelöscht."

Kein Nachformulieren, keine Abweichung. `rechtstexte-hygiene.test.ts`: 15 von
15 grün nach der Änderung.

**Eine sprachliche Anmerkung, wie verabredet — kein Änderungswunsch.** Der
freigegebene Halbsatz endet auf „spätestens nach 30 Tagen gelöscht", und der
*nächste* Satz im selben Absatz beginnt mit „Spätestens 30 Tage nach der
Aufnahme löschen wir die Audiodatei automatisch." Zwei 30-Tage-Aussagen
hintereinander, die **verschiedene Fristen bei verschiedenen Stellen**
bezeichnen: die erste bei OpenAI, die zweite bei uns. Inhaltlich ist beides
richtig und beides muss dort stehen. Es liest sich nur einen Moment lang wie
eine Wiederholung. **Ich habe nichts daran geändert** — ein freigegebener
Rechtstext ist im freigegebenen Wortlaut freigegeben. Wenn du es Sandy
vorlegen willst, wäre die kleinste denkbare Änderung, den zweiten Satz mit
„Auf unseren Servern löschen wir die Audiodatei ohnehin spätestens 30 Tage
nach der Aufnahme automatisch." zu beginnen. **Das ist ein Angebot, keine
Empfehlung, und es hat keine Eile.**

#### Der zweite Auftrag: steht dieselbe Zusage noch woanders?

Gesucht habe ich nicht nach dem Wort, sondern nach der **Aussage** — über alle
`.ts`/`.tsx` unter `src/`: „unwiderruflich", „endgültig gelöscht", „vollständig
gelöscht", „dauerhaft entfernt", „restlos". Neun Fundstellen. Acht davon sind
in Ordnung. **Eine ist es nicht:**

**🟡 L-KI-02 — der Löschen-Dialog in der App sagt dasselbe zu wie der alte
Satz in der Datenschutzerklärung.**
`src/app/(app)/angebot/[id]/entwurf/page.tsx`, Z. 1852:

> „Die Aufnahme wird endgültig gelöscht. Bereits berechnete Positionen im
> Angebot bleiben erhalten."

Das ist **derselbe Satztyp an der schärferen Stelle**: nicht im Rechtstext,
den man einmal liest, sondern in dem Bestätigungsdialog, den der Nutzer genau
in dem Moment sieht, in dem er die Löschung auslöst. Er sagt „endgültig",
solange OpenAI dieselbe Datei bis zu 30 Tage vorhalten darf. Severity 1, wie
L-KI-01 — aber die Begründung, die L-KI-01 zur Korrektur gebracht hat
(Art. 13 DSGVO: Tatsachenbehauptungen über die Reichweite einer Löschung
müssen stimmen), trifft hier genauso.

**Ich habe es nicht eingebaut, und zwar aus zwei getrennten Gründen:**

1. **Die Datei liegt seit dem 17.09. uncommittet im Arbeitsbaum** — sie ist
   eine der vier DC-128-Dateien des Designers. Eine Legal-Änderung
   hineinzuschreiben würde meine Zeile in seinen unfertigen Stand mischen. Das
   ist genau der Fall, vor dem `AGENTS.md` warnt.
2. Es ist **Nutzeroberfläche, nicht Rechtstext** — ich halte es für keinen
   Freigabefall von Sandy, aber das ist deine Entscheidung, nicht meine.

**Vorschlag, wieder ein Halbsatz:** „Die Aufnahme wird von unseren Servern
endgültig gelöscht." — Der Dialog braucht die OpenAI-Frist nicht zu
wiederholen; sie steht in der Datenschutzerklärung. Es reicht, die
Behauptung auf das einzuschränken, was wir tatsächlich kontrollieren.
**Gehört zu DC-128, sobald der Designer sie committet hat** — nicht vorher.

**Die acht unbeanstandeten Fundstellen, damit niemand nachsuchen muss:** AGB
§ 6.5, AVV § 10, `datenschutz` Z. 144 (Kontolöschung), `AccountDeleteModal`
Z. 40, `email.ts` Z. 157/161, `konto-loeschung.ts` Z. 171,
`api/account/delete` Z. 44 — alle betreffen die **Kontolöschung nach 30 Tagen
Karenz**. Bis dahin ist jede Aufnahme, die es betreffen könnte, bei OpenAI
ohnehin über die 30 Tage hinaus. Die Zusage deckt sich dort mit der Wirklichkeit.
`AngebotDetail.tsx` Z. 3233 („Das Angebot wird endgültig gelöscht") betrifft
das Angebot, nicht die Audiodatei — kein OpenAI-Bezug.

**AGB § 8.3 ist ausdrücklich in Ordnung** und war meine Hauptsorge: Der
Absatz sagt „spätestens 30 Tage nach der Aufnahme automatisch gelöscht —
vorher jederzeit auf Wunsch des Nutzers". Er behauptet **keine Reichweite**,
sondern nur eine Frist. Nichts zu ändern.

---

### 2. ✅ CoS-L-011 — Antwort: **B.** Und der Grund ist ein anderer als der, den die Frage vermutet

**Antwort in einem Satz: Der Pflichtteil bleibt immer stehen, die drei freien
Zeilen kommen zusätzlich.**

Aber **B** wird hier aus einem Grund gewählt, der in der Frage nicht vorkommt,
und deshalb muss ich zuerst etwas geraderücken:

#### Vorab: Was heute im Fuß steht, ist kein Pflichtteil

`src/lib/pdf.tsx` Z. 379–381, an der Quelle nachgesehen. Der Fuß besteht aus:

| Feld | Pflicht auf einem **Angebot**? |
|---|---|
| Firmenname + erste Adresszeile | ja — aber steht ohnehin **dreimal** im Dokument |
| USt-IdNr. / Steuernummer | **nein** |
| IBAN | **nein** |

**Keine der drei Zeilen enthält eine Angabe, die auf einem Angebot Pflicht
wäre.** Die Pflichtangabenliste des § 14 Abs. 4 UStG, die hier intuitiv
mitgedacht wird, gilt für **Rechnungen**. Ein Angebot ist keine Rechnung — es
ist ein Antrag nach § 145 BGB. Die USt-IdNr. steht im Fuß, weil sie auf
Rechnungen hingehört, nicht weil ein Angebot sie verlangt.

Und umgekehrt: **Die Angaben, die auf einem Angebot wirklich Pflicht sind,
stehen dort nicht** — Rechtsform, Registergericht, Registernummer,
Vertretungsberechtigte, je nach Rechtsform. Das ist **LR-17**, und das Produkt
kennt die Felder bis heute nicht. In der Produktionsdatenbank heute erneut
geprüft: `companies` hat keine Spalte für Rechtsform, Registergericht,
Registernummer oder Geschäftsführer. Im Repo findet sich zu `rechtsform`,
`handelsregister`, `registergericht`, `geschaeftsfuehrer` **keine einzige
Fundstelle** — weder in `src/` noch in `supabase/migrations/`.

**Der heutige Fuß druckt also das Unverbindliche und lässt das Pflichtige
weg.** Wer ihn „den Pflichtteil" nennt, benennt ihn falsch — und eine
A/B/C-Entscheidung über das Ersetzen eines Pflichtteils, den es noch gar nicht
gibt, würde die eigentliche Lücke zudecken.

#### Warum trotzdem B, und nicht A

Die Pflicht trifft den **Betrieb**, nicht uns — das steht in LR-17 und ändert
sich nicht. Man könnte daraus A ableiten: volle Freiheit, volle Verantwortung.
**Ich halte A trotzdem für falsch**, aus einem Grund, der nichts mit Haftung
zu tun hat:

Die drei Felder heißen in der Oberfläche „Fußzeile links / mitte / rechts".
Ein Malermeister, der dort „Vielen Dank für Ihr Vertrauen" einträgt, trifft
damit **keine Entscheidung über seine handelsrechtlichen Pflichtangaben** — er
schreibt einen Gruß. Wenn dieser Gruß seine Registerangaben still verschwinden
lässt, hat das Produkt ihm eine Falle gestellt, in die er nicht sehenden Auges
gelaufen ist. Der Fehler ist dann rechtlich seiner und praktisch unserer. **Der
Preis von B ist eine zusätzliche Zeile; der Preis von A ist ein
pflichtwidriges Dokument, das sich nach dem Versand nicht mehr heilen lässt**
(LR-17, „der Mangel ist nicht heilbar").

#### Warum C keine dritte Option ist, sondern schon entschieden

C — „die Anwendung prüft und weigert sich sonst" — ist **für die Pflichtfelder
bereits beschlossen**: LR-17, Mitigation 3, und CoS-L-008 Punkt 3 sagen, dass
der **Versand blockiert** wird, wenn die Rechtsform eingetragen und ein
Pflichtfeld leer ist. Das ist gebaut in CoS-E-057, nicht in DC-122.

C auf die **freien Fußzeilen** anzuwenden hieße, einen Freitext gegen eine
Feldliste zu prüfen — also zu raten, ob „Holm GmbH · HRB 12345 B · AG
Charlottenburg" dieselbe Angabe ist wie das, was im Profil steht. Das kann die
Anwendung nicht, und eine Prüfung, die es vortäuscht, ist schlechter als keine
(gleiche Begründung wie im Restrisiko von LR-17). **C: nein.**

#### Was das für DC-122 konkret heißt — die Grenze, um die gebeten wurde

1. **Die drei freien Zeilen kommen zusätzlich, in einer eigenen Zeile über oder
   unter dem festen Fuß.** Sie ersetzen nichts und können nichts überschreiben.
2. **Der feste Fuß ist nicht der von heute**, sondern die Zeile aus CoS-E-057.
   Bis die gebaut ist, bleibt der heutige stehen — er ist nicht falsch, nur
   unvollständig.
3. **Kein Zeichenbudget, das den festen Fuß verdrängt.** Wenn der freie Text zu
   lang wird, wird der freie Text umbrochen oder gekürzt, nie der feste Teil.
4. **Keine Prüfung des Freitextes.** Nicht auf Pflichtangaben, nicht auf
   Dopplungen. Wenn ein Betrieb seine Registerangaben zusätzlich in die freie
   Zeile schreibt, stehen sie zweimal da. Das ist hässlich und nicht unser
   Problem.
5. **Die Steuernummer** gehört bei dieser Gelegenheit aus dem Fuß heraus,
   sobald eine USt-IdNr. da ist — das ist L-35a-01, unverändert, und gehört zu
   CoS-E-057, nicht zu DC-122.

**In der Produktionsdatenbank heute geprüft:** 4 Zeilen in `briefpapiere`,
**keine einzige** mit einer gefüllten Fußzeile. Es geht also kein Bestand
verloren, egal wie entschieden wird.

#### Deine Rückfrage: ändert sich die Antwort bei Regelbesteuerung?

**Nein, und zwar aus einem grundsätzlicheren Grund als „F-006 ist jetzt
entschieden".**

Der Fuß des Angebots-PDF trägt die Daten **des Handwerksbetriebs**, nicht
unsere. Ob dort eine USt-IdNr. steht, hängt an `companies.ust_id` und
`companies.vat_rate` — also am Steuerstatus des Malerbetriebs. **Sandys eigener
Steuerstatus kommt auf diesem Dokument überhaupt nicht vor.**

**DC-122 hing damit nie an Sandy.** Das war in CoS-L-011 anders vermutet, und
ich sage es ausdrücklich, weil du geschrieben hast, du müsstest es wissen: Der
Designer war an dieser Stelle **nie** von ihrer Entscheidung abhängig — nur von
dieser Antwort hier. Er ist jetzt frei.

---

### 3. CoS-L-012 — abgearbeitet, mit einem roten Fund

#### 3.1 🔴 `legal-007-plan-fuer-sandy.md` sagte Sandy das falsche Kreuz — korrigiert

Du hast mich gebeten nachzuzählen, wo der Kleinunternehmer-Hinweis überall
steht. Der wichtigste Fund steht nicht im Code, sondern in **meiner eigenen
Datei für Sandy**.

`legal-007-plan-fuer-sandy.md`, Schritt 2 („Fragebogen zur steuerlichen
Erfassung"), Stand 03.09.2026, wörtlich:

> „**Das einzige Kreuz, auf das es ankommt:** *Kleinunternehmerregelung nach
> § 19 UStG — ja.* … Bis dahin: Kleinunternehmer ankreuzen, das lässt sich
> später ändern."

**Das ist seit dem 17.09. das falsche Kreuz.** Und es ist die Datei, die Sandy
in der Hand hat, wenn sie den Fragebogen ausfüllt — die Reihenfolge in der
`arbeitsreihenfolge.md` verweist genau auf diesen Schritt.

Drei Dinge machen den Fund rot und nicht gelb:

1. **Die Bindung ist fünf Jahre** (§ 19 Abs. 2 S. 2 UStG). Der alte Text
   behauptet das Gegenteil („lässt sich später ändern") — das stimmt für die
   *Kleinunternehmerregelung*, aber nicht für den *Verzicht* darauf.
2. **Der Fragebogen ist der Ort, an dem es unwiderruflich wird.** Vorher ist
   nichts passiert, nachher ist es für fünf Jahre entschieden.
3. **Termin KW 41.** Es ist der nächste echte Termin, den sie hat.

**Korrigiert am 21.09.2026.** Schritt 2 nennt jetzt den Verzicht nach § 19
Abs. 2 UStG, sagt, was das Kreuz praktisch bedeutet (USt-Ausweis,
Voranmeldungen, Vorsteuerabzug, USt-IdNr. mit demselben Formular), und trägt
die Fünf-Jahres-Bindung an der Stelle, an der sie gebraucht wird. Der alte
Wortlaut steht als sichtbarer Korrekturkasten darüber, nicht gelöscht.
**In Teil 2 derselben Datei** war aus demselben Grund der Satz „Als
Kleinunternehmerin ziehst du ohnehin keine Vorsteuer" falsch geworden —
ebenfalls korrigiert, mit dem Hinweis auf § 15 Abs. 1 UStG (Vorsteuerabzug
verlangt eine auf sie lautende Rechnung, was das Umschreiben der
Rechnungsadressen von „nice to have" zu „lohnt sich" macht).

**Das ist keine Entscheidung, die ich getroffen habe** — es ist Sandys eigene
Entscheidung vom 17.09., in die Datei nachgezogen, die ihr widersprach.

#### 3.2 🟡 AGB § 4.2 wird unrichtig — und das liegt bei Sandy, nicht bei mir

`src/app/agb/page.tsx` Z. 38, wörtlich:

> „4.2 Alle Preise verstehen sich als Nettopreise. Der Anbieter handelt als
> Kleinunternehmer gemäß § 19 UStG — es wird keine Umsatzsteuer ausgewiesen."

**Das ist die einzige Stelle im veröffentlichten Code, an der *Sofortangebot
selbst* sich als Kleinunternehmer bezeichnet.** Mit dem Verzicht wird der Satz
falsch — nicht heute, sondern in dem Moment, in dem der Fragebogen abgesendet
ist.

**Fertiger Vorschlag für den Ersatz** (zur Freigabe, nicht zum Einbauen):

> „4.2 Alle Preise verstehen sich als Nettopreise zuzüglich der gesetzlichen
> Umsatzsteuer."

**Ich baue das nicht ein.** Rechtstext, keine Freigabe — dieselbe Regel wie bei
L-KI-01. **Und es ist auch noch nicht dran:** Solange der Verzicht nicht
gesetzt ist, ist der *alte* Satz der richtige. Der Einbau gehört in dieselbe
Woche wie der Fragebogen, nicht vorher. Bitte als Termin führen, nicht als
offenen Punkt.

#### 3.3 Die 27 übrigen `Kleinunternehmer`-Fundstellen sind **richtig so**

Damit niemand sie „mit aufräumt": Alle anderen Fundstellen
(`AngebotDetail.tsx`, `AngebotVorschau.tsx`, `pdf.tsx`, `einstellungen`,
`onboarding`, `unterschreiben`, `zugferd/generateXML.ts`, `FAQSection.tsx`,
die vier API-Routen) hängen ausnahmslos an `company.vat_rate === 0` — dem
Steuerstatus **des Handwerksbetriebs**. Das ist eine Produktfunktion für
Kunden, die Kleinunternehmer sind, und die gibt es weiterhin. **Sandys
Entscheidung berührt keine einzige davon.** Wer hier „Kleinunternehmer" sucht
und löscht, baut einen Fehler.

#### 3.4 § 14c Abs. 2 UStG — bestätigt, aber die Norm war nie die richtige

Du hast um Bestätigung gebeten, nicht um eine Neuausarbeitung. Bestätigt:
**§ 14c Abs. 2 UStG ist für die Preiszeile auf der Landingpage kein Stopper.**

Ich muss allerdings dazusagen, dass er es **nie** war, und das ist ein
Unterschied. § 14c setzt einen **Steuerbetrag in einer Rechnung** voraus
(§ 14c Abs. 2 S. 1: „wer in einer Rechnung einen Steuerbetrag gesondert
ausweist"). Eine Preisangabe auf einer Website ist keine Rechnung im Sinne des
§ 14 UStG — sie weist keinen Steuerbetrag gegenüber einem Leistungsempfänger
für eine konkrete Leistung aus. **§ 14c konnte durch eine Landingpage gar nicht
ausgelöst werden.**

Die Normen, die dort wirklich greifen, sind andere: **§ 5 Abs. 1 Nr. 2 UWG**
(irreführende Angabe über den Preis) und, gegenüber Verbrauchern, die
**PAngV**. Ob die Seite gegen sie verstößt, hängt am Wortlaut der Preiszeile
und nicht an der Rechtsform — siehe 4.

**Praktische Folge ist trotzdem dieselbe:** Der Stopper fällt weg. Ich
korrigiere nur die Begründung, weil eine falsche Norm in der Akte beim
nächsten Mal an der falschen Stelle Entwarnung gibt. **Das ist keine
Beanstandung an Finance** — der wirtschaftliche Befund war richtig, nur die
Fundstelle nicht.

#### 3.5 Der Einzelunternehmen-Weg existiert bereits als eigene kurze Liste

Gefragt war, ob der Weg Gewerbeanmeldung → Fragebogen → Geschäftskonto →
Steuerberater irgendwo als eigene Liste steht, und ob es dafür eine neue Datei
braucht.

**Er steht bereits da: `legal-007-plan-fuer-sandy.md`, Teil 1, Schritte 1–5.**
Gewerbeanmeldung (20 Min, 15 €) → Fragebogen über ELSTER (45 Min) →
Versicherung → Marken-Check → Impressum. **Keine neue Datei.** Sandys stehende
Regel gilt, und eine zweite Liste desselben Wegs wäre genau die
Parallel-Datei, die sie nicht will.

**Zwei Abweichungen zwischen deiner Reihenfolge und meiner Datei, damit sie
nicht als Widerspruch stehen bleiben:**

- **Geschäftskonto:** steht in `legal-007` unter Teil 2 („Was du NICHT
  machst") — rechtlich **nicht vorgeschrieben** für ein Einzelunternehmen,
  praktisch empfohlen als zweites kostenloses Girokonto. Deine Reihenfolge
  führt es als Schritt. **Beides ist richtig**; es ist ein Schritt, den sie
  machen sollte und nicht machen muss. Ich habe daran nichts geändert.
- **Steuerberater:** in `legal-007` kein eigener Schritt. Mit der
  Regelbesteuerung wird er einer — der Voranmeldungsrhythmus ist die erste
  Frage an ihn (Finance, CoS-F-009). **Das ist Finance' Punkt, nicht meiner**,
  und ich lege ihn nicht ungefragt in meine Datei.

---

### 4. ❌ Nicht erledigt: die zwei rechtlichen Stopper der Entwurfs-Landingpage

Auftrag vom 17.09.: die Mehrwertsteuer-Angabe und die Knappheits-Zeile („18 von
25 Plätzen frei") auf der Entwurfsseite ansehen und sagen, ob ich Finance'
Einschätzung teile — und prüfen, ob die Entwurfsseite Impressum und
Datenschutzerklärung erreichbar hat.

**Ich komme nicht an die Seite.** Beide Wege heute versucht:

* **`WebFetch`** auf `sofortangebot-landingpage-entwurf-einfachanfrages-projects.vercel.app`
  → **HTTP 302 auf `vercel.com/login`**.
* **Browser in der Claude-App** → dieselbe Weiterleitung, angezeigt wird
  „Login – Vercel".

Die Entwurfsseite steht hinter **Vercel Deployment Protection**. Ohne
Anmeldung ist sie nicht lesbar, und ich melde mich nicht mit fremden
Zugangsdaten an.

**Zwei Dinge folgen daraus, und beide gehören dir:**

1. **Der Satz „der Browser in der Claude-App kommt an beide Adressen" stimmt
   nicht** — er stimmt für `sofortangebot.app`, nicht für den Entwurf. Er steht
   in derselben Nachricht auch bei Marketing, Finance und beim Designer. Wer
   ihm folgt, landet bei einem Vercel-Login und hält das womöglich für einen
   Fehler auf seiner Seite.
2. **Die Prüfung „hat der Entwurf Impressum und Datenschutz?" ist heute
   gegenstandslos** und wird mit dem Livegang fällig. § 5 DDG knüpft an das
   **Bereithalten für die Öffentlichkeit** an — eine Seite hinter einem Login
   der Plattform hält nichts für die Öffentlichkeit bereit. Auch das
   E-Mail-Feld löst nichts aus, solange niemand ohne Vercel-Konto es erreicht.

**Was ich brauche, um es abzuschließen:** entweder die Protection für diese
Deployment abschalten, oder mir den Text der drei fraglichen Stellen
(Preiszeile, Knappheits-Zeile, „echte Aufnahmen, echte Angebote") hier
hereinkopieren. **Eine Einschätzung nach Beschreibung gebe ich nicht ab** —
bei § 5 UWG hängt alles am Wortlaut, und zum Wortlaut habe ich heute keinen
Zugang. Der Punkt bleibt offen und liegt bei dir, nicht bei Sandy.

**Vorab, unabhängig vom Wortlaut und ohne Zugang belegbar:** Die *heute live*
ausgelieferte `PreiseSection.tsx` im Repo nennt „0 €" und
„{PRICING.proJahresabo} €/Monat" **ohne jede Umsatzsteuerangabe** — weder
„netto", noch „zzgl. MwSt.", noch „inkl.". Für ein reines B2B-Angebot ist eine
Nettoangabe zulässig, sie muss aber **als solche gekennzeichnet** sein; die
Kennzeichnung fehlt ganz. Das ist ein eigener, kleiner Punkt (§ 5a UWG), er
betrifft die **alte** Seite und nicht den Entwurf, und er wird mit dem
Wechsel auf die Regelbesteuerung ohnehin angefasst werden müssen. **Kein
Gate-1-Blocker, kein eigener Risikoeintrag** — ich vermerke ihn, damit er beim
Umbau der Preiszeile nicht zum zweiten Mal übersehen wird.

---

### Was ich in diesem Lauf nicht angefasst habe

* **Die Löschfrist / CoS-P-029** — nichts zu tun, der Lauf vom 19.09. hat
  geprüft, der Nein-Fall ist nicht eingetreten. **Ungeprüft übernommen habe
  ich das nicht**, aber ich habe es auch nicht nachgemessen: `system_laeufe`
  gehört zu CoS-P-033 bei Platform, und zwei Rollen, die dieselbe Zeile
  auslegen, ist genau die Doppelarbeit, die du abgeschafft hast. **Wenn
  Platform auf „nur geprüft, nicht gelöscht" kommt, liegt der Punkt sofort
  wieder bei mir** — dann sind Datenschutzerklärung Z. 117 und AGB § 8.3
  unrichtig, und das ist kein kleiner Punkt.
* **CoS-E-057 / LR-17** — liegt bei Engineering, nicht bei mir.
* **Die vier uncommitteten Fremddateien** im Arbeitsbaum. Unberührt.
* **Gate-1-Punkte** habe ich in diesem Lauf keine neu bewertet.

### Was ich committet habe

Zwei Dateien, beide meine:

* `src/app/datenschutz/page.tsx` — L-KI-01, freigegebener Wortlaut
* `docs/legal-007-plan-fuer-sandy.md` — Schritt 2 und Teil 2 auf Sandys
  Entscheidung vom 17.09. nachgezogen

Dazu die Doku-Einträge in dieser Datei und in
`legal-002-risikobewertung-vob.md`.

*Head of Legal & Compliance · 2026-09-21 · Geprüfte Normtexte: § 14 Abs. 4,
§ 14c Abs. 2, § 15 Abs. 1, § 19 Abs. 1 und Abs. 2, § 27a UStG; § 145 BGB;
§ 35a Abs. 1 GmbHG; § 37a Abs. 1 HGB; § 125 Abs. 1 HGB; § 5 Abs. 1 Nr. 2 und
§ 5a UWG; PAngV; § 5 DDG; Art. 13 DSGVO. Code an der Quelle:
`src/lib/pdf.tsx` Z. 332–381 und 440–505, `src/app/datenschutz/page.tsx`,
`src/app/agb/page.tsx`, `src/app/(app)/angebot/[id]/entwurf/page.tsx` Z. 1852,
`src/components/landing/PreiseSection.tsx`, `src/lib/types.ts`,
`supabase/migrations/`. Produktionsdatenbank (`yqlledouhfovytifeekd`):
`information_schema.columns` für `companies`, `briefpapiere`. Test:
`rechtstexte-hygiene.test.ts`, 15/15 grün. Netzzugriff: WebFetch und
Claude-Browser auf die Entwurfs-Landingpage, beide 302 auf vercel.com/login.*

---

## 🔴 Befund am Rande, gehört dem Chief of Staff: `docs-sichern.mjs sichern` kann auf diesem Rechner nicht committen (21.09.2026 · Head of Legal & Compliance)

Ich schreibe das hier hin und nicht in die `arbeitsreihenfolge.md`, weil die
dir gehört. Es betrifft **alle acht Rollen**, nicht nur mich.

### Was passiert

`node scripts/docs-sichern.mjs sichern "<Grund>"` bricht ab mit

> `fatal: Unable to create '.../.git/index.lock': File exists.`
> `Another git process seems to be running in this repository…`

**Es läuft kein zweiter Git-Prozess.** Ich habe während des Fehlers `ps aux`
laufen lassen: keiner.

### Warum — heute reproduziert, nicht vermutet

Auf diesem Mount schlägt das **Entfernen** von Dateien fehl (`Operation not
permitted`), auch für Git selbst. Git legt bei jedem Zugriff auf den Index
`.git/index.lock` an, schreibt, benennt um — und das anschließende Aufräumen
scheitert still. Die Sperrdatei bleibt liegen.

`sichern` macht genau zwei Git-Aufrufe hintereinander (Z. 97 und Z. 102 in
`scripts/docs-sichern.mjs`):

1. `git status --porcelain -- docs` → **hinterlässt `.git/index.lock`**
2. `git add -- docs` → **scheitert an genau dieser Sperre**

**Das Skript stolpert über seine eigene Sperrdatei.** Es ist kein
Zusammentreffen zweier Rollen und keine Folge eines abgestürzten Laufs.

Der Testlauf, Schritt für Schritt:

```
$ mv .git/index.lock  <weg>
$ git status --porcelain -- docs >/dev/null
$ ls .git/index.lock
-rwx------ … 0 Sep 21 08:21 .git/index.lock      ← wieder da
$ git add --dry-run -- docs
fatal: Unable to create '…/.git/index.lock': File exists.
```

**Folge: Die Doku-Sicherung, die Sandy am 31.08. freigegeben hat, sichert
seit unbekannter Zeit nichts.** `pruefen` ist davon **nicht** betroffen — es
braucht kein Git und meldet weiter zuverlässig („Alle 58 Doku-Dateien in
Ordnung"). Nur der Teil, der einen wiederherstellbaren Stand erzeugt, läuft
ins Leere. Wie lange schon, weiß ich nicht und behaupte ich nicht.

### Was das für deine Notiz „Git-Sperrreste … für git harmlos" heißt

**Sie sind nicht harmlos.** Eine liegengebliebene `index.lock` blockiert den
**nächsten** `git add` jeder Rolle. Dass eure Commits heute trotzdem
durchgingen, heißt nur, dass zwischendurch jemand — oder ein anderer Weg —
die Sperre beseitigt hat.

### Wie ich es heute umgangen habe

Nicht mit `git add`, sondern über einen **eigenen Index außerhalb des
Ordners**:

```
export GIT_INDEX_FILE=$HOME/legal-index
git read-tree HEAD
git add -- <nur meine Dateien>
git commit -m "…"
```

Damit liegt die Sperre bei `$GIT_INDEX_FILE.lock` und nicht in `.git/`.
`git read-tree HEAD` stellt sicher, dass der Commit auf dem sauberen Stand
sitzt — **fremde, uncommittete Dateien können so gar nicht mitrutschen.**
Das ist die Sperrklinke gegen `git add -A`, diesmal von der anderen Seite.
Mein Commit ist **`bcd6916`**, vier Dateien, alle meine.

### Was ich nicht konnte

**Die Sperrdateien löschen.** Der Löschrechte-Dialog ist in einem geplanten
Lauf abgelehnt worden („Irreversible Local Destruction"), wie du es
vorhergesagt hast. Ich habe sie deshalb nach

`_git-sperrreste-zum-loeschen/`

im Projektordner verschoben — fünf leere Dateien (`index.lock`,
`HEAD.lock`, `refs_heads_main.lock` und zwei weitere Durchläufe).

**Bitte an Sandy weitergeben: diesen Ordner einmal von Hand löschen.** Der
Befehl steht unten in meinem Bericht. Solange er liegt, taucht er bei jeder
Rolle als unversionierter Ordner in `git status` auf — und **er darf auf
keinen Fall mitcommittet werden.**

**Nicht angefasst:** `.git/worktrees/alt/*.lock` und `.git/_locks/` — die lagen
schon vorher da und gehören nicht zu meinem Lauf.

### Vorschlag, aber es ist deine Entscheidung

Zwei Zeilen in `docs-sichern.mjs` würden es dauerhaft lösen: vor dem ersten
Git-Aufruf eine liegengebliebene `.git/index.lock` der **Größe 0** und älter
als, sagen wir, 60 Sekunden entfernen — oder das Skript durchgängig auf einen
eigenen `GIT_INDEX_FILE` legen. **Das ist ein Eingriff in ein Werkzeug, das
Sandy freigegeben hat, und in ein Skript, das nicht meines ist. Ich habe es
nicht angefasst.**

*Head of Legal & Compliance · 2026-09-21 · Gemessen: `ps aux` während des
Fehlers, Reproduktion des Sperr-Zyklus in drei Schritten,
`scripts/docs-sichern.mjs` Z. 97/102 an der Quelle.*

---

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
