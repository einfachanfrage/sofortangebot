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

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
