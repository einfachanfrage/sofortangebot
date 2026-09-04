# Prüfmeister-Testfälle

Gemeinsame Datei von Sandy, dem Prüfmeister und Head of IT — der EINE Ort, an
dem der aktuelle QA-Stand von Sofortangebot steht. Auch der Chief of Staff hat
Zugriff, so wie er auch den Stand von Marketing & Co. kennt — nicht zur
Kontrolle, sondern damit immer klar ist, wo wir stehen.

**Ablauf:** Prüfmeister spricht Testfälle ein und dokumentiert Zum Einsprechen
→ Soll-Lösung → Ist-Ergebnis → Befund. Head of IT (ich) trage nach jedem Fix
ein kurzes **Fix-Update** direkt unter dem jeweiligen Befund ein — was
geändert wurde, wie geprüft, was noch offen ist. Status-Zeile je Fall wird
danach aktualisiert. So muss niemand an zwei Stellen nachschauen.

Jeder Fall hat eine feste ID (PM-XXX) — bei Rückfragen einfach auf die ID
verweisen, dann ist für alle Beteiligten klar, welcher Fall gemeint ist.

**Status-Zeichen:** ✅ behoben & getestet · 🟡 behoben, noch nicht live von
Sandy nachgetestet · ❌ Bug offen · ⏳ noch nicht geprüft.

**Wichtig für Prüfmeister — Rechenregel geändert (2026-08-21, bitte ab sofort berücksichtigen):** Seit heute
gilt bei Maler-Wandflächen die VOB-Übermessungsregel (Sandys Go, siehe Entscheidung ganz am Ende dieser
Datei). Kleine Fenster/Türen (Einzelgröße bis 2,5 m²) werden von der Wandfläche NICHT mehr abgezogen — nur
Öffnungen über 2,5 m² (z. B. eine breite Terrassentür) noch wie gewohnt. Das heißt konkret für dich: bei
JEDEM neuen Testfall mit Maler-Wandflächen und normalgroßen Fenstern/Türen muss deine eigene
Soll-Lösung das ab jetzt genauso rechnen (also i. d. R. NICHT mehr abziehen), sonst stimmt dein Soll nicht
mit dem korrekten Ist überein und es sieht wie ein neuer Bug aus, ist aber keiner. Faustregel: Breite ×
Höhe der einzelnen Öffnung ausrechnen — unter/gleich 2,5 m² → nicht abziehen, drüber → wie bisher abziehen.
Details/Beispielrechnungen: siehe „VOB-Übermessungsregel für Anstricharbeiten" ganz am Ende dieser Datei.

## Organigramm-Änderung (2026-08-17)

Kurz zur Info: „Head of IT" heißt seit heute **Head of Product Engineering**
— zuständig bleibt weiterhin die Sprach-zu-Angebot-Pipeline, Preisdatenbank
und alles, was hier in dieser Datei landet (also alle Fix-Updates unten,
auch die schon eingetragenen). Alte Einträge in diesem Dokument, die noch
„Head of IT" sagen, bleiben unverändert stehen — reine Geschichtsschreibung,
gemeint ist dieselbe Person/Stelle. Neu dazugekommen ist eine zweite Stelle,
**Platform & Integrations Engineer** (Zahlungen/Stripe, Accounts/Login,
Datentrennung/RLS, E-Mail-Zustellung, Deployment/Infra). Für dich als
Prüfmeister praktisch relevant: Findet ein Testfall künftig etwas, das eher
in diese zweite Kategorie fällt (z. B. Login klappt nicht, falsche Person
sieht fremde Daten, eine Bestätigungs-Mail kommt nicht an) statt ein
Pipeline-/Rechenbug zu sein, bitte trotzdem wie gewohnt hier dokumentieren —
die Zuordnung an die richtige Stelle übernimmt der Chief of Staff.
Vollständiger Hintergrund: CoS-009 in `docs/chief-of-staff-todos.md`.

## Stand auf einen Blick (zuletzt aktualisiert: 2026-08-18, Prüfmeister)

**Datei-Sicherheit (aktualisiert 20.08.2026):** Der Speicherfehler bei gleichzeitiger Bearbeitung ist
projektweit jetzt zum 6. Mal aufgetreten (hier zuletzt am 17.08.). Ganz am Ende dieser Datei steht jetzt
eine feste Markierung (`<!-- ENDE DER DATEI -->`). Taucht beim Lesen noch Text NACH dieser Markierung auf,
ist das zweifelsfrei ein Speicherfehler — bitte nicht selbst löschen, sondern kurz dem Chief of Staff
melden. Zusätzlich: neue Einträge wenn möglich ans Dateiende anhängen statt mitten in bestehende Abschnitte
zu schreiben. Voller Hintergrund: CoS-013 in `chief-of-staff-todos.md`.

**Wichtig zum heutigen Stand (2026-08-17, spätere Ergänzung):** Der von Head of IT angeforderte
Live-Nachtest zu PM-010 (nach der „echte Ursache gefunden"-Runde) ist inzwischen gelaufen — siehe unten
bei PM-010: zwei der drei Punkte bestätigt behoben, einer bleibt unklar/offen. Meine ursprüngliche
Deploy-Theorie oben war also überholt, sobald Head of IT mit den echten Rohdaten nachgesehen hat — das
war der richtige nächste Schritt, nicht meiner.

| ID | Thema | Status |
|---|---|---|
| PM-001 | Ausschluss + Selbstkorrektur (Wohnzimmer) | ✅ Live-Nachtest (2026-08-21) bestätigt: Ausschluss-Fix hält (keine Decke, Fenster-Zähler konsistent). Wandfläche jetzt 46,5 m² statt 42,21 m² — korrekt nach der neu eingeführten VOB-Übermessungsregel, kein Bug — Details im Archiv |
| PM-002 | Akzentwand + Boden diagonal (Schlafzimmer) | 🟡 **Haken zurückgezogen (2026-09-02):** Der Live-Nachtest ist vom 16.08. und lief damit VOR der VOB-Übermessung — Wandbrutto 39,00 m², Restwände 29,90 m² statt der damals abgenommenen 26,81 m². Muss neu eingesprochen werden. Die beiden ursprünglichen Bugs (Akzentwand-Seite, Sockelleisten-Türabzug) bleiben bestätigt behoben |
| PM-003 | Kleinreparatur + Höhenzuschlag (Flur) | ✅ alle drei Punkte live bestätigt behoben (Grundierung, Fenster-Rückfrage, rotes „!") |
| PM-004 | Laminat gerade + Trittschalldämmung (Kinderzimmer) | ✅ Verschnitt-Bug live nachgetestet, bestätigt behoben |
| PM-005 | Zwei Räume, Scope "nur Decke" (Küche/Speisekammer) | ✅ komplett behoben und live bestätigt — schwerster Fund der Testreihe, jetzt zu |
| PM-006 | Kleines Fenster + Altbau-Zuschlag (Büro) | 🟡 **Haken zurückgezogen (2026-09-02):** Nachtest vom 16.08., vor der VOB-Übermessung. Soll ist jetzt **28,80 m²** (weder Fenster 0,30 m² noch Tür 1,89 m² werden abgezogen), gemessen wurden damals 26,61 m². Neu einzusprechen, diesmal mit dem Übermessungshinweis in den Annahmen |
| PM-007 | Dachgeschoss: Kniestock + Dachschrägen | ✅ Live-Nachtest (2026-08-25) bestätigt: Rückfragen-Blocker weg, Kniestock/Dachschrägen exakt Soll, jetzt auch beide bepreist (Preismatcher-Fix). Offen bleiben zwei kleine, nicht-blockierende Funde (Türen-Anzeige vs. Sockelleisten-Rechnung; „Raumhöhe" zeigt „!") — Details im Archiv |
| PM-008 | Fassade | ✅ Nachtest 7 (2026-08-20): „So gerechnet"-Rechenbug live bestätigt behoben (66,96 m², kein Widerspruch mehr zur abgerechneten Position), Wand-Chip/PD-003 bleibt fehlerfrei. Fachlich/rechnerisch komplett grün, offen bleibt nur die Erschwerniszuschlag-Einheitenfrage (Pauschale vs. %, wartet auf Sandys Entscheidung, siehe PM-015) — Details im Archiv |
| PM-009 | Bodenleger-Komplettpaket | ✅ Übergangsschiene live bestätigt behoben (taucht jetzt auf); fehlender Standardpreis dafür jetzt ergänzt (2026-08-20, siehe „Systemischer Fund" Punkt 1), Live-Nachtest dafür steht aus |
| PM-010 | Sockelleisten-Doppel-Falle | 🟡 **Haken zurückgezogen (2026-09-02):** Nachtest vom 20.08., vor der VOB-Übermessung — Wandfläche jetzt **33,80 m²** statt 30,71 m². Die vier Sockelleisten-Funde bleiben behoben, nur die Wandzahl ist überholt. Bisheriger Stand: Nachtest (2026-08-20): „Sockelleisten entfernen" jetzt live bestätigt behoben (12,1 lfdm, exakt Soll) — damit alle vier ursprünglichen Funde geklärt (Bodenaustausch weg, Sockelleisten streichen behoben, 350-Bug akzeptierte Design-Entscheidung, Sockelleisten entfernen jetzt auch). Offen bleibt nur die fehlende Preishinterlegung dafür — Details im Archiv |
| PM-011 | Vollflächenspachtelung Q2 vs. Kleinreparatur (Arbeitszimmer) | ✅ Details im Archiv. Offene fachliche Frage zur möglichen Doppel-Erschwernis (Untergrund + Altbau neben Q2-Spachtelung) siehe dort |
| PM-012 | Sockelleisten-Falle umgekehrt: nur streichen, ausdrücklich nicht neu (Esszimmer) | ✅ Nachtest (2026-08-20): „Sockelleisten streichen" jetzt live bestätigt behoben (14,1 lfdm, exakt Soll), nach fünf gescheiterten Versuchen. Kein Boden-Phantom, Ausschluss weiterhin sauber respektiert — Details im Archiv |
| PM-013 | Zwei Räume, getrennte Gewerke + Fischgrät + Dehnungsfuge (Wohnzimmer/Flur) | ✅ Details im Archiv |
| PM-014 | Doppelte Positionen + instabile Summen bei Angebot 2026-0016 (live entdeckt, kein geplanter Testfall) | 🟡 Dubletten-Fix bestätigt (Doppelklick-Test). Echte Race Condition jetzt mit DB-Constraint geschlossen (2026-08-20, Sandys Go, siehe Fix-Update 2) — Migration live, Code-Fix grün gegen Testsuite, gezielter Gleichzeitigkeits-Nachtest steht noch aus |
| PM-015 | Preisdatenbank praktisch leer bei „manuell"-Onboarding + Anzeige-Bug versteckt Nachlade-Button (live entdeckt am Konto „Lisa Schein Malerbetrieb", kein geplanter Testfall) | 🟡 Beide Ursachen gefunden und gefixt, geprüft live im Code korrekt. **Klargestellt (2026-08-19):** der PM-011-„alle Preise fehlen"-Fund war KEIN neuer, dritter Bug — derselbe Nachtest lief auf demselben, schon damals betroffenen Konto „Lisa Schein Malerbetrieb", das vor dem Fix (17.08.) angelegt wurde und dadurch nicht rückwirkend versorgt ist, siehe „Systemischer Fund" Punkt 5. Für alle NEU angelegten Konten ab 18.08. gilt der Fix nachweislich. **Korrektur (2026-08-19, siehe PM-016):** der 18.08.-Fix selbst war kaputt — der Onboarding-Insert scheiterte durch denselben Bug wie PM-016 komplett und unbemerkt (Fehler wurde nicht geprüft). „Lisa Schein" ist inzwischen live nachversorgt |
| PM-016 | „Standardpreise importieren" auf `/preise` schlägt fehl: „Die Standardpreise konnten nicht vollständig ergänzt werden." (live entdeckt am Konto „Lisa Schein Malerbetrieb", kein geplanter Testfall) | ✅ Root-Cause gefunden und gefixt (2026-08-19), Konto live nachversorgt (341 Positionen), gleicher Bug auch im Onboarding-Seeding gefixt |
| PM-017 | Tapete statt Streichen + Grundierung trotz Neuputz ausdrücklich abgelehnt (Kinderzimmer) | ✅ Live-Nachtest (2026-08-21) bestätigt: „Tapete tapezieren" jetzt mit exakt 31,91 m² und korrektem Preis, keine Phantom-Positionen mehr, keine Grundierung — Details im Archiv |
| PM-018 | Q3-Vollflächenspachtelung an Wand UND Decke getrennt (Arbeitszimmer) | 🟡 **Haken zurückgezogen (2026-09-02):** Der Live-Nachtest vom 21.08. lief vor dem Ausrollen der VOB-Übermessung — Wandfläche, Spachtel Q3 Wand, Grundierung Wand und Wandanstrich stehen jetzt auf **39,00 m²** statt 35,91 m². Q3-Benennung und Deckengrundierung bleiben bestätigt. Bisheriger Stand: Live-Nachtest (2026-08-21) bestätigt: alle 8 Positionen exakt Soll, „Q3" korrekt an Wand und Decke, Deckengrundierung vorhanden — Details im Archiv |
| PM-019 | Erschwerniszuschlag „schwieriger Untergrund" isoliert von Höhe/Altbau (Gäste-WC) | ✅ Details im Archiv. Raummaß-Sicherheits-Rückfrage aus „Systemischer Fund" Punkt 6 live bestätigt (2026-08-25) — liefert jetzt die korrekten 2×1,5 m |
| PM-020 | Teppich verlegen, alter Belag bleibt liegen (neue Ausschluss-Formulierung), Verschnittsatz unklar (Kinderzimmer 2) | ✅ Details im Archiv. Nachtest (2026-08-25) diesmal korrekt transkribiert (3×3,6 m), Sicherheits-Rückfrage aus „Systemischer Fund" Punkt 6 daher nicht ausgelöst — Mechanismus über PM-019 live bestätigt |
| PM-021 | Mehrere unterschiedlich große Öffnungen + expliziter Einfachanstrich, VOB-Übermessungsfrage zugespitzt (Wohnküche) | ✅ Details im Archiv |
| PM-022 | Schlafzimmer, Baseline-Malerfall | ✅ Alle vier Positionen live bestätigt exakt Soll — Details im Archiv |
| PM-023 | Flur, Laminat gerade + Trittschalldämmung + neue Sockelleisten | 🟡 Gruppierung + Vorschlag-Etikett behoben (dreifach bestätigt). Drei von vier Nachtests komplett sauber, die Trittschalldämmungs-Flächenverwechslung aus dem ersten Nachtest (mit PM-025) ist **behoben 03.09.** — Ursache war zuletzt der Dezimalpunkt in der Satztrennung, siehe „Nachtrag am selben Tag“. Dämmung steht jetzt genau einmal, im Flur, mit dessen Fläche. Live-Nachtest steht aus |
| PM-024 | Büro, Erschwerniszuschlag Höhe in normalem Raum | 🟡 Vierter Nachtest: „Boden schützen" wieder korrekt bepreist, Erschwerniszuschlag Höhe im Entwurf rechnerisch exakt Soll (15 %). Der Karten-Fund („1 %") ist gefixt (31.08., Fix-Notiz am Dateiende) — fehlt nur noch der fünfte Nachtest zur Bestätigung |
| PM-025 | Gästezimmer, Vinyl Fischgrätmuster + explizit neue Sockelleisten | ✅ alle drei Positionen live bestätigt exakt Soll, auch mit zusätzlicher Altbelag-Rückfrage |
| PM-026 | Küche, Wand 2x / Decke 1x unterschiedliche Anstrichzahl | ✅ Vierter Nachtest komplett sauber: alle vier Positionen exakt Soll, „Boden schützen" wieder korrekt bepreist, keine offenen Funde mehr |
| PM-027 | Kellerraum, Parkett gerade + explizite Altbelag-Entfernung | ✅ Beide Positionen live bestätigt exakt Soll |
| PM-028 | Arbeitszimmer, Altbau + explizite Grundierung ohne Spachtel | 🟡 Mengen exakt Soll. Zwei Funde: Wandflächen-Grundpreis weicht ab (11,50 € statt 9,50 €/m²); Erschwerniszuschlag-Bemessungsgrundlage zieht fälschlich den Abstellraum mit ein |
| PM-029 | Abstellraum, Mini-Raum ohne jede Öffnung | ✅ Alle drei Positionen live bestätigt exakt Soll |
| PM-030 | Dachzimmer 2, frischer Dachgeschoss-Fall | 🟡 Alle Flächen korrekt (Kniestockwände, Dachschrägen, Boden schützen) — Dachfenster ≤2,5 m² braucht laut VOB/DIN 18363 keinen Abzug, Soll-Lösung dazu korrigiert (auch PM-007 rückwirkend betroffen). Zwei bekannte PM-007-Kleinfunde (Sockelleisten-Türabzug trotz „Türen: 0"; Raumhöhe „!") erneut bestätigt |
| PM-031 | Fassade Nordseite, einfacher Fall | 🟡 Fassadenfläche + Erschwerniszuschlag exakt Soll, „Satz aus Preisliste"-Fix bestätigt auch bei Fassade. Neuer, rein kosmetischer Fund: „So gerechnet"-Zeile zeigt falsche, VOB-widrige Rechnung |
| PM-032 | Drei Räume, ein Belag durchgehend ohne Schwellen (Flur/Wohnzimmer/Küche) | ❌ Eingesprochen 2026-09-02: Mengen, Sockelleisten und die **eine** Übergangsschiene exakt Soll. Ein Befund: **Trittschalldämmung nur im ersten Raum**, in zwei von drei Räumen fehlt sie ganz (28,40 m² = 127,80 € zulasten des Betriebs). **Alle Befunde behoben 03.09.** (Trittschall je Raum, 35,60 m² statt 7,20) — siehe „Umbau statt sechster Einzelreparatur". Live-Nachtest steht aus **Nachtest 03.09.: Trittschall-Fix bestätigt** — Dämmung jetzt in allen drei Räumen (7,20 + 20,00 + 8,40 = 35,60 m²), alle Mengen exakt Soll. 🟡 **Nachtest 03.09. bestätigt** (Trittschall in allen drei Räumen, alle 10 Positionen im Entwurf). **Seit VOB-012 am 04.09. wieder offen:** Sockelleisten sind jetzt 44,00 statt 41,30 lfdm — eine Zahl nachzuprüfen, sonst unverändert bestätigt |
| PM-033 | Drei Räume, drei Beläge, drei Verschnittsätze (Fischgrät / Teppich / Laminat) | ❌ Eingesprochen 2026-09-02: **Verschnittsätze exakt Soll** (15/0/5 %, kein Überschwappen). Drei Befunde: Trittschall im falschen Raum trotz Ansage, Sockelleisten gegen ausdrücklichen Ausschluss erfunden (22 lfdm, nicht herleitbar), nur 1 statt 2 Übergangsschienen. **Befund 1 + 2 behoben 03.09.** (Trittschall je Raum; Ausschluss wird jetzt satzweise gelesen — siehe „Fix PM-033, Befund 2"), Befund 3 offen. Live-Nachtest steht aus |
| PM-034 | Untergrundvorbereitung je Raum verschieden, ein Raum ausgeschlossen (Küche/Esszimmer/Flur) | ❌ **Schwerster Fall des Batches.** Eingesprochen 2026-09-02, Angebot 91.085 € für 24,80 m². Fünf Befunde: Weiter-Button führt nicht zum Entwurf (Blocker), „drei sechzig"/„drei fünfzig" → 360/350 (zweimal in einem Diktat, 350-Bug neu zu bewerten), Ausschlusssatz wird zum Raumnamen, drei Maler-Spachtelpositionen im Bodenauftrag, Grundierung im Esszimmer fehlt. Raumtrennung der Untergrundarbeiten selbst ist korrekt. **Befund 1–3 behoben 02./03.09.**, **Befund 4+5 behoben 03.09.** (Gewerke-Erkennung objektbewusst, Untergrund-Block je Raum — Grundierung Esszimmer 14,00 m²). Live-Nachtest steht aus |
| PM-035 | Drei Arten der Flächenangabe + L-förmiger Flur (Sockelleisten-Umfang) | ❌ Eingesprochen 2026-09-02. Gut: reine Flächenangabe („hat vierzehn Quadratmeter") wird korrekt als Fläche geführt; Sockelleisten-Ausschluss respektiert. Vier Befunde: L-Form verschwindet stumm (zweiter Schenkel weg, keine Rückfrage), „sechs **Meter** mal eins zwanzig" → 6 × 1 m (Gegenbeweis in PM-032), Sockelleisten mit falschem Umfang und nur 1 von 3 Türen, Trittschall zum dritten Mal nur im ersten Raum. **Befund 1, 3 und 4 behoben 03.09.** (L-Form wird gerechnet: 9,60 m² Fläche / 18,40 lfm Umfang; Türanzahl zählt mit; Trittschall je Raum) — Soll-Liste jetzt vollständig erreicht. Befund 2 an den heutigen Daten nicht mehr nachstellbar. Live-Nachtest steht aus |
| PM-036 | Teilfläche nach Wasserschaden neben komplettem Raum (Wohnzimmer/Flur) | ❌ Eingesprochen 2026-09-02, wie erwartet gescheitert: **Teilfläche wird ignoriert, das Raummaß gewinnt** — 21 m² statt 6,30 m², Altbelag über 20 m² statt 6 m², 785,40 € zu viel. Dazu: Karte zeigt 6,3 m², Entwurf 6,0 m² (Verschnitt im Titel, nicht in der Menge). Sockelleisten-Ausschluss korrekt respektiert. **Befund 1 behoben 03.09.** (Teilfläche wird aus dem Transkript zurückgeholt, Soll-Liste stimmt 1:1 — siehe „Fix PM-036, Befund 1"), Befund 2 an den Daten vom 03.09. nicht nachstellbar, Befund 3 läuft über VOB-012. Live-Nachtest steht aus |

**Erledigt (2026-08-20):** Die vier fehlenden Standardpreise (Kniestockwände streichen, Dachschrägen
streichen, Fassadenfläche streichen, Übergangsschiene) sind nachgetragen — zusammen mit einer
kompletten Sauber-Durchsicht der ganzen Preisdatenbank für Maler und Bodenleger. Details unten im
Abschnitt „Systemischer Fund" Punkt 1 (Fix-Update).

**Noch offen, bewusst zurückgestellt (niedrige Priorität, siehe PM-003/006):**
1-Cent-Rundungsdrift zwischen Positions-Summe und Gesamtbetrag.

**Entschieden & umgesetzt (2026-08-21):** die vormals zurückgestellte
VOB-Übermessungsregel für kleine Fensteröffnungen ist nach Sandys
ausdrücklichem Go jetzt Standard für alle Malerangebote — Details ganz am
Ende dieser Datei (PM-021, das den Anlass dafür lieferte, ist inzwischen
grün und im Archiv).


**Neu (2026-08-19): Datei aufgeteilt, damit sie nicht unbegrenzt wächst.**
Diese Datei war nach 15 Fällen in 2-3 Tagen schon auf 156 KB gewachsen und
ist deswegen zweimal durch gleichzeitige Bearbeitung auf einen älteren Stand
zurückgefallen (siehe Hinweis unten in der Übersichtstabelle). Bei den
geplanten ~100 Fällen wäre das nicht mehr handhabbar. Deshalb ab jetzt:
**diese Datei enthält nur noch aktive Fälle** (offen, in Arbeit, Live-Test
steht aus). Ein Fall, der komplett fertig ist (✅ behoben, live von Sandy
bestätigt, nichts mehr offen), wandert in `pruefmeister-testfaelle-archiv.md`
— seine Zeile in der Übersichtstabelle unten bleibt stehen, nur mit einem
Verweis dorthin, damit man nie zwei Dateien im Kopf behalten muss. Bitte
diese Regel ab jetzt selbst fortführen: sobald ein Fall bei euch endgültig
grün ist, den Abschnitt rüber ins Archiv verschieben (Chief of Staff hilft
gern beim ersten Mal, wenn unklar).

---

## Systemischer Fund (2026-08-17): fehlende Standardpreise + blockierender Fehler-Flow

Nicht an einen einzelnen Testfall gebunden, kam aber in fast jedem Nachtest heute vor — deshalb hier
zentral, nicht bei einer einzelnen PM-ID.

**1. Fehlende Standardpreise für ganz normale Positionen.** In den heutigen Nachtests hatten folgende
Positionen KEINEN Preis in der Preisdatenbank (0,00 €, roter Hinweis „Preis fehlt in deiner
Preisdatenbank"): Kniestockwände streichen (PM-007), Dachschrägen streichen (PM-007), Fassadenfläche
streichen (PM-008), Übergangsschiene (PM-009), Bodenbelag verlegen / Altbelag entfernen (PM-010, hier
aber ohnehin Phantom-Positionen, siehe unten). Sandys Ansage dazu direkt: *„das sind alles absolute
Standardpositionen die der Head of IT in Preisdatenbank anlegen muss"* — das sind keine seltenen
Sonderfälle, sondern Kernleistungen von Dachgeschoss, Fassade und Bodenleger-Übergängen. Bitte
Standardpreise dafür in der Preisdatenbank anlegen, genau wie es sie für „Wandflächen streichen"
(9,50 €) oder „Grundierung" (6,00 €) schon gibt.

**Fix-Update (Head of Product Engineering, 2026-08-20):** Alle vier genannten Positionen haben jetzt
einen Preis — und zwar nicht nur diese vier, sondern die komplette Preisdatenbank für Maler und
Bodenleger wurde auf Sandys ausdrücklichen Auftrag hin durchgesehen ("schau dir die komplette
Preisdatenbank für Maler und Bodenleger an ... nichts doppelt, alles sauber einheitlich ... schau dir
wirklich alles an mit Handwerker-Wissen"). Vorgehen, damit das keine Handarbeit nach Gefühl wird: jeder
von der Engine tatsächlich erzeugte Positionstitel (aus `mengen/gewerke/maler.ts`, `boden.ts`,
`aufnahme-hinweise.ts` und allen `vollstaendigkeit/maler-*.ts`/`boden-vorarbeiten.ts`-Dateien — 101
verschiedene Titel-Vorlagen) wurde programmatisch gegen die echte Matching-Logik (`preis-matcher.ts`)
simuliert, nicht nur überflogen. Ergebnis:
- **50 echte „Preis fehlt"-Lücken gefunden und geschlossen**, davon die vier oben plus u. a.: Q2/Q3/Q4-
  Spachtel- und Schleif-Varianten, Stuck-Nebenleistungen (5 Positionen — z. B. bei Altbau-Aufträgen mit
  Stuckdecken), Brandschutzfarbe für Stahlträger, Sockelleisten-Aufarbeitung (schleifen/lackieren
  getrennt von „streichen"), generisches „Altbelag entfernen" ohne Materialangabe (Bodenleger — hängt
  mit dem alten PM-010-Fund zusammen), und die komplette Übergangsschienen-Familie (Alu-Varianten,
  Hamburger Profilleiste, generisches „Profilleiste montieren").
- **Ein echter Matching-Bug gefunden, keine reine Katalog-Lücke:** Sobald irgendein Preis mit derselben
  Einheit eine „1x/2x/3x"-Variante hat (z. B. „Wand streichen 2x Anstrich"), hat die Zuordnungslogik
  JEDEN anderen Preis ohne eigene 1x/2x/3x-Angabe für JEDE 1x/2x/3x-Suche gesperrt — unabhängig vom
  Thema. Deshalb fand „Kniestockwände streichen 2x" den (eigentlich vorhandenen!) Preis nie. Behoben,
  indem Kniestockwände/Dachschrägen/Fassadenfläche jetzt jeweils eigene 1x/2x/3x-Preiszeilen haben,
  genau wie Wand- und Deckenanstrich das schon hatten. **An Head of IT:** dieses Matcher-Verhalten
  betrifft vermutlich auch andere Gewerke mit mehrfachem Anstrich (Trockenbau, Putz) — hier nur für
  Maler/Boden umgangen, nicht am Matcher selbst repariert.
- **Ein falsch gerichteter Preistreffer gefunden:** „Übergangsprofil" (einbauen) hat versehentlich den
  Preis für „Schwelle / Übergangsprofil ENTFERNEN" bekommen (Teilstring-Zufallstreffer). Jetzt durch
  einen eigenen, exakten Preiseintrag richtiggestellt.
- **Keine echten inhaltlichen Duplikate gefunden** — was wie Dopplung aussah (z. B. zwei verschiedene
  Preise für „Anti-Schimmel-Anstrich"), erzeugen tatsächlich zwei unterschiedliche Code-Stellen mit zwei
  unterschiedlichen Positionstiteln für denselben Sachverhalt; beide werden gebraucht, damit die
  automatische Zuordnung nie leer ausgeht (dieselbe Absicherung wie bei „Sockelleisten entfernen" vs.
  „demontieren", PM-010). **Was aber wirklich unsauber war:** ein Teil dieser „doppelten" Einträge
  (~22 Positionen, am Dateiende) hatte eigene, nirgendwo sonst verwendete Rubriken wie „Maler –
  Spezialbeschichtungen" oder „Maler – Baustelleneinrichtung" statt der zwölf etablierten Maler-
  Rubriken. Alle jetzt in die bestehende, saubere Rubrik-Struktur einsortiert; für Stuck-Nebenarbeiten
  und Dekortechniken (Kalkputz, Betonoptik-Spachteltechnik) gibt es jetzt genau eine neue, sauber
  benannte 13. Rubrik „Maler – Stuck & Dekorative Techniken" statt zwei Sammel-Rubriken für Ähnliches.
  Außerdem ein echter Einheiten-Bug gefunden und behoben: „Holzvertäfelung / Wandbelag abkleben" hatte
  Preis-Einheit m², die Engine rechnet das aber immer in laufenden Metern — der alte Katalogeintrag
  konnte dadurch nie greifen (derselbe existierende Test dazu hatte zufällig dieselbe falsche Einheit,
  ist jetzt mitkorrigiert).
- **Ehrlich zum Stand:** rein programmatisch gegen die Matching-Logik geprüft (0 offene Lücken unter den
  101 bekannten Positionstiteln, keine Regression bei über 50 vorher schon funktionierenden Zuordnungen
  — beides automatisiert nachgewiesen), aber noch KEIN Live-Nachtest mit echten Aufnahmen. Bewusst nicht
  angefasst: `src/lib/preise-vorlagen.ts`, ein zweiter, komplett unabhängig gepflegter Preiskatalog nur
  für die Platzhalter-Hinweise beim manuellen Preise-Eintippen im Onboarding — überschneidet sich
  inhaltlich stark mit dieser Preisdatenbank, driftet aber unabhängig davon. Das ist eine eigene,
  separate Aufräumarbeit, kein Teil dieses Auftrags — an Head of IT zur Einordnung, ob das langfristig
  zusammengeführt werden sollte.

**2. Fehlender Preis darf niemals den Weg zur Entwurfsansicht blockieren.** Sandys zweite, ebenso klare
Ansage: *„falls tatsächlich mal keine Position vorhanden ist... dann muss ich natürlich TROTZDEM zur
Entwurfsansicht kommen"* — ob ein Preis fehlt oder nicht, darf niemals verhindern, dass der Handwerker
zumindest den Entwurf sieht und bearbeiten kann. Bitte sicherstellen, dass „Preis fehlt" höchstens ein
Hinweis ist, nie eine Blockade.

**Bestätigt geschlossen (Head of Product Engineering, 2026-08-20):** Gezielt gegen den Code nachgetestet,
nicht nur vermutet. `src/app/api/angebot-generieren/route.ts` (der Schritt, der Positionen mit
Datenbankpreisen versieht) hat einen expliziten Code-Kommentar genau dazu: „Fehlende Datenbankpreise
blockieren den Entwurf nicht. Sie bleiben sichtbar mit 0 Euro offen; Markt- oder KI-Preise werden nie
eingesetzt." Der Endpunkt gibt bei fehlendem Preis IMMER Status 200 zurück (nie einen Fehler), setzt
`unit_price: 0` für die betroffene Position und meldet die Lücke nur informativ über
`fehlende_positionen`/`hat_fehlende_preise` — der Handwerker kommt garantiert zur Entwurfsansicht, die
Position steht dort sichtbar mit 0,00 € offen. Passt exakt zu dem, was in mehreren echten Nachtests schon
beobachtet wurde (z.B. PM-011 Nachtest 2026-08-19: „Erschwerniszuschlag Altbau ... 0,00 €"; PM-013:
„Boden schützen ... 0,00 €" — beide Male mitten in einem sonst fertigen, erreichten Angebot, nicht als
Blockade).

Ehrlicher Nebenfund dabei, aber ohne Handlungsbedarf: in `src/app/api/entwurf/generiere-positionen/route.ts`
stand noch eine ältere Fehlerbehandlung für den Fall „Preisberechnung antwortet mit Status 422 und Code
PREIS_FEHLT" (zeigt dann ein rotes Banner statt zur Entwurfsansicht zu gehen — das wäre tatsächlich ein
Verstoß gegen Sandys Regel). Diese Verzweigung war inzwischen totes Code — `angebot-generieren` liefert
nie mehr 422, aus genau dem oben beschriebenen Grund.

**Aufräumen erledigt (Head of Product Engineering, 2026-08-20):** Sandy hat direkt „mach das" gesagt —
die tote 422/PREIS_FEHLT-Verzweigung ist entfernt, durch einen erklärenden Kommentar ersetzt. Geprüft:
kein anderer Code/Test referenziert `PREIS_FEHLT` mehr, `tsc --noEmit` sauber, volle Testsuite (236/236)
weiterhin grün. Punkt 2 damit formell geschlossen, inklusive Aufräumen.

**3. Neuer, ernster Bug: widersprüchliche Meldung „Keine Positionen erkannt".** Bei PM-008 erschien nach
der Aufnahme kurzzeitig ein roter Banner „❗ Keine Positionen erkannt" — GLEICHZEITIG mit dem grünen
Banner „✓ 2 Positionen erkannt — bereit für den Entwurf" direkt darunter, auf demselben Screen. Sandy
musste es zweimal versuchen, um zur Entwurfsansicht zu kommen. Ihre Frage dazu ist berechtigt: *„es
wurden ja positionen erkannt, wieso sagt er keine pos erkannt?"* Zwei sich widersprechende
Statusmeldungen gleichzeitig auf einem Screen ist unabhängig von der Ursache ein Vertrauensbruch — das
geht an Head of IT (warum feuert die Prüfung überhaupt, wenn Positionen längst da sind — evtl. verwandt
mit dem bekannten Race-Condition-Verdacht) UND an den Designer (so ein Widerspruch darf, selbst wenn
er nur eine Sekunde lang auftritt, dem Nutzer nie angezeigt werden). Sandy hat ausdrücklich gesagt,
dass das an beide weitergegeben werden soll.

**Root-Cause + Fix (Head of Product Engineering, 2026-08-20):** Gezielt nachuntersucht, wie von Sandy
gewünscht (identisch mit „Systemischer Fund" Punkt 3 = Design-Check-Eintrag DC-010). Ergebnis: **keine
echte Race-Condition**, sondern eine Konsequenz derselben Zwei-Pipelines-Architektur, die auch PM-001
(oben, Punkt 1 dieses Dokuments) verursacht hat — Aufnahmekarte und finale Berechnung laufen über zwei
unabhängige GPT-Aufrufe auf demselben Text.

- Das grüne Banner „X Positionen erkannt — bereit für den Entwurf" in `entwurf/page.tsx`
  (`bannerZustand`) liest `erkannteAnzahl` — eine Zahl aus der SCHNELLEN Chip-Vorschau
  (`extrahiereChips`), die schon beim Aufnehmen selbst befüllt wird.
- Das rote Fehler-Banner („Keine Positionen erkannt") kommt dagegen vom Server: klickt man
  „Entwurf erstellen", läuft serverseitig die VOLLSTÄNDIGE, unabhängige Extraktion
  (`generiere-positionen` → `angebot-extrahieren`); findet die am Ende wirklich nichts, liefert die
  Route Status 400 mit `{ error: 'Keine Positionen erkannt' }`, und der Client setzt `fehler` genau auf
  diesen Text.
- Beide Zahlen können bei GPT-Nichtdeterminismus schlicht auseinanderlaufen — die Chip-Vorschau meint,
  etwas erkannt zu haben, die gründlichere Server-Berechnung kommt zum gegenteiligen Schluss. Genau das
  erklärt auch das beobachtete Muster aus Sandys Zusatzfund (PD-006: 2 von 3 Fassaden-Durchläufen
  betroffen, ein späterer Nachtest lief sauber durch) — kein Timing-Zufall, sondern schlichte
  GPT-Antwort-Varianz zwischen zwei getrennten Aufrufen.
- Es gab bereits eine gezielte Aufräum-Funktion dafür (`raeumeStaleKeinePositionenFehler`, aus einem
  früheren, engeren PM-008-Fund), die den roten Banner räumt, SOBALD danach noch eine Aufnahme fertig
  verarbeitet wird. Genau im PD-006-Fall greift die aber nicht, weil nach dem fehlgeschlagenen
  „Entwurf erstellen"-Versuch keine weitere Aufnahme mehr verarbeitet wurde, die das auslösen könnte —
  der rote Banner blieb einfach stehen, während der grüne (aus der unveränderten alten Chip-Zahl)
  unabhängig weiterhin korrekt berechnet wurde.
- Fix folgt Sandys eigener, in PD-006 schon so formulierter Design-Regel: Fehler- und Erfolgs-Banner
  dürfen nie gleichzeitig stehen, im Zweifel gewinnt der zuletzt bestätigte, verlässlichere Zustand.
  `bannerZustand` gibt jetzt sofort `null` zurück, sobald `fehler` gesetzt ist — die grüne/neutrale
  Statusmeldung kann also nie mehr gleichzeitig mit einem aktiven Fehler auf demselben Screen stehen,
  unabhängig davon, wie die beiden unabhängigen GPT-Aufrufe im Einzelfall ausgehen. Das behebt den
  gemeldeten Widerspruch strukturell (nicht nur den einen beobachteten Text), weil es direkt an der
  Render-Logik ansetzt statt an einem weiteren Sonderfall-Aufräumpfad.
- **Ehrlich zum Stand:** Für diese Datei gibt es keine automatisierte Testinfrastruktur (React-Komponente,
  `vitest.config.ts` läuft projektweit nur mit `environment: 'node'`, keine `@testing-library/react`
  installiert) — deshalb kein neuer automatisierter Regressionstest, wie es bei den anderen Fixes heute
  möglich war. Verifiziert stattdessen: die Änderung selbst ist eine einzelne, isolierte Bedingung
  (`if (fehler) return null`) ohne neue Logik-Verzweigung, Syntax mit `esbuild` gegengeprüft (fehlerfrei
  geparst/transformiert), Code-Pfade für alle drei Aufnahme-Abschluss-Stellen (`handleAudioStop`,
  `handleZettelUpload`, `verarbeiteAufnahme`) sowie `fertigstellen()` durchgelesen und die
  400-„Keine Positionen erkannt"-Serverantwort im Quellcode bestätigt (`generiere-positionen/route.ts`,
  Zeile 361). **Noch KEIN Live-Nachtest** — bitte gezielt nochmal den PD-006-Fassaden-Fall (oder einen
  ähnlichen Grenzfall) nachstellen, um zu bestätigen, dass der Widerspruch jetzt wirklich nicht mehr
  auftritt. Punkt 3 damit code-seitig geschlossen, Live-Bestätigung steht aus.

**Live-Nachtest (Sandy, 2026-08-30, PM-024+PM-025): Widerspruch reproduziert sich, Fix greift nicht.**
Karte zeigte „6 Positionen erkannt — bereit für den Entwurf", gleichzeitig eine „keine Positionen
erkannt"-Meldung weiter oben, und Sandy kam diesmal nicht zur Entwurfsansicht durch (nicht nur ein
kurzes Anzeigeproblem wie beim ursprünglichen PM-008-Fund, sondern ein echter Blocker). Der
2026-08-20-Fix (`bannerZustand` gibt sofort `null` zurück bei `fehler`) hält hier also nicht — Details
und neue Einordnung siehe „Systemischer Fund" Punkt 12 unten.

**4. Struktureller Fund (2026-08-18): Nicht-Raum-Objekte (Fassaden) werden technisch wie Räume
behandelt, sind es aber nicht.** Sandy hat beim fünften PM-008-Nachtest selbst die vermutliche
gemeinsame Ursache für mehrere PM-008/PD-003/PD-007-Funde benannt: die Entwurfsansicht filtert nach
Räumen, jeder Raum hat eine feste Zeile mit fixen Raummaßen (Länge, Breite, Höhe, Türen, Fenster), auf
deren Basis alle Positionen berechnet werden. Eine Fassade ist kein Raum — relevant sind nur Wandlänge
und Wandhöhe, es gibt keine Raumtiefe. Ihre Worte: *„das muss irgendwie umgedacht werden, weil das wird
auf jeden Fall auch vorkommen."* Das ist vermutlich die gemeinsame Wurzel für: die falsche Masse-Anzeige
auf der Aufnahmekarte (PD-007), die roten „!" im Raummaße-Chip trotz korrekter Rechnung dahinter
(PD-003), und das „Fenster: 0" in der Entwurfsansicht trotz „Fenster: 3" auf der Karte. Sandy verlangt
ausdrücklich eine eigene Aufgabe dafür — sowohl für Head of Product Engineering (eigenes Datenmodell für
Wand-/Fassaden-Objekte ohne Raumtiefe) als auch für den Designer (eigenes Anzeige-Format dafür, siehe
PD-003/PD-007-Update in `pruefmeister-notizen-fuer-designer.md`). Details siehe PM-008, Nachtest 5.

**5. NEU, DRINGEND (2026-08-19): Bei einem PM-011-Nachtest fehlen plötzlich ALLE Preise, nicht mehr nur
einzelne Standardpositionen.** Das ist eine andere Kategorie als Punkt 1 oben. Bisher ging es um einzelne,
seltenere Positionen ohne Katalogeintrag (Kniestockwände, Dachschrägen, Fassadenfläche, Übergangsschiene).
Im PM-011-Nachtest (Arbeitszimmer, identische Maße 4,00×3,20 m wie beim Originaltest) zeigen jetzt
AUSNAHMSLOS alle sieben Positionen „Preis fehlt in deiner Preisdatenbank" — Wandflächen streichen, Boden
schützen, Sockelleisten abkleben, Spachtelarbeiten Q2, Voranstrich/Grundierung, Erschwerniszuschlag Altbau,
Risse/Löcher spachteln. Zum Vergleich: im ursprünglichen PM-011-Test (2026-08-17, exakt derselbe Fall)
hatten sechs dieser sieben Positionen einen echten Preis (Wandflächen streichen 9,50 €/m², Boden schützen
1,20 €/m², Sockelleisten abkleben 0,80 €/lfdm, Spachtelarbeiten Q2 9,00 €/m², Voranstrich/Grundierung
6,00 €/m², Risse/Löcher spachteln 8,00 €/Stück) — nur der Erschwerniszuschlag war schon damals unbepreist.
Das ist keine fehlende Katalog-Ergänzung mehr, sondern ein echter Rückschritt gegenüber einem Stand, der
zwei Tage vorher nachweislich funktioniert hat. Sandys eigene Reaktion darauf: *„WARU FEHLEN ALLE PREISE
IN DER DATENBANK???? IN DER DATENBANK MÜSSEN ALLLEEEE POSITIONEN VORHANDEN SEIN ICH CHECKS NICHT."*
**Klarstellung von Sandy (2026-08-19), Produktanforderung, keine Ermessensfrage:** Ich hatte gefragt, ob
dieser Nachtest vielleicht unter einem anderen/leeren Testkonto lief, und das als mögliche, halbwegs
akzeptable Erklärung dargestellt. Sandy hat das ausdrücklich zurückgewiesen — das ist in KEINEM Konto
akzeptabel: *„in JEDEM konto muss die preisdatenbank vorhanden sein!!!! egal ob ich da eigene preise
angebe beim onboarding oder nicht. PREISDATENBANK IST IMMER DA!!!! der user kann dann da die preise
ersetzen mit seinen eigenen und preise löschen/ändern/neuanlegen etc. aber es müssen IMMER die positionen
aus der preisdatenbank gezogen werden bzw falls es eine position noch nicht gibt dann so markieren wie
bisher/aktuell."* Das heißt konkret: der Basis-Preiskatalog muss in JEDEM Konto von Anfang an vorhanden
sein, unabhängig vom Onboarding-Weg — der Nutzer darf ihn danach frei anpassen (löschen/ändern/eigene
Preise), aber er darf nie komplett fehlen. „Preis fehlt" ist nur für einzelne, wirklich noch nicht
angelegte Positionen zulässig (wie im bisherigen „Systemischer Fund" Punkt 1) — nicht als Zustand für den
gesamten Katalog. Für Head of Product Engineering heißt das: unabhängig davon, welches Konto dieser
Nachtest genutzt hat, ist das Ergebnis (ALLE Positionen ohne Preis) so oder so ein Bug, kein erwartbarer
Rand­fall — entweder bricht die Seed-Logik aus PM-015 (Preisdatenbank praktisch leer bei manuell-
Onboarding) in mehr Fällen, als dort bisher angenommen, oder eine gemeinsame Stelle im Preis-Abgleich
(`findePreisposition` o. ä., zuletzt bei den PM-008-Fix-Updates vom 18.08. für „×"/„x"-Normalisierung und
Fassadenfläche-Matching angepasst) trifft aktuell bei viel mehr Positionen daneben als vorher. Bitte
beide Spuren mit hoher Priorität prüfen — PM-015 gilt erst dann als wirklich behoben, wenn „jedes Konto
hat immer den Basis-Katalog" nachweislich stimmt, nicht nur für das eine damals betroffene Testkonto.

**Fix-Update / Root-Cause-Klärung (Head of Product Engineering, 2026-08-19):** Beide Spuren geprüft,
direkt gegen die echten Produktionsdaten (Supabase, nur lesend). Ergebnis eindeutig — **das ist keine
Regression im Preis-Abgleich**, `findePreisposition`/`preis-matcher.ts` ist damit als Ursache raus.

Der Nachtest lief auf demselben Konto, an dem PM-015 ursprünglich gefunden wurde: „Lisa Schein
Malerbetrieb" (angelegt 2026-08-17, 15:44 Uhr). Dieses Konto hat bis heute nur die 5 generischen
Positionen aus dem allerersten Onboarding-Versuch (Stundensatz Fachkraft/Helfer, Bauschutt-Container,
Kleinfuhre, Anfahrt pro km) — keine einzige Maler-Position. Der PM-011-Nachtest lief exakt darauf, daher
„Preis fehlt" bei allen sieben Positionen: `quote_items.price_item_id` ist bei allen sieben `null`, weil
für dieses Konto in `price_items` schlicht keine Maler-Katalogzeilen existieren, an die der Matcher
überhaupt andocken könnte — kein Matching-Bug, sondern eine echte Datenlücke in genau diesem einen Konto.

Der eigentliche PM-015-Fix (siehe `onboarding/[step]/page.tsx`, Kommentar „Sandy 2026-08-18, nach
PM-008-Nachtest": Basis-Katalog wird jetzt IMMER zuerst eingefügt, unabhängig vom Preismodus) ist im Code
und live — geprüft. Er wirkt aber nur für Konten, die den Onboarding-Abschluss NACH diesem Fix (18.08.)
durchlaufen. „Lisa Schein Malerbetrieb" ist vom 17.08., also einen Tag älter als der Fix, und wird davon
nicht rückwirkend korrigiert — niemand hat seither einen Prozess angestoßen, der dieses eine Konto
nachträglich befüllt. Die zweite Ursache aus PM-015 (Rettungs-Button „Standardpreise importieren" auf
`/preise` fälschlich versteckt) ist ebenfalls im Code gefixt und geprüft live korrekt (`gewerke.length
=== 0`, nicht mehr `items.length === 0`) — der Button müsste auf diesem Konto also jetzt sichtbar sein
und würde beim Klick genau die fehlenden Maler-Positionen nachladen.

**Für Sandy, konkret:** Zwei Möglichkeiten, dieses eine Konto jetzt aktiv zu reparieren — entweder einmal
auf `/preise` unter „Lisa Schein Malerbetrieb" einloggen und „Standardpreise importieren" klicken (sollte
jetzt sichtbar sein), oder ich trage die fehlenden ~2000 Maler-Positionen einmalig direkt in der
Datenbank nach, wenn du das lieber so hättest — sag einfach Bescheid, das ist ein reiner Dateneingriff auf
einem Konto, den ich nicht ohne dein Go mache. Fürs echte „jedes Konto hat immer den Basis-Katalog":
das gilt jetzt nachweislich für alle NEU angelegten Konten, aber es gibt aktuell keinen automatischen Weg,
schon bestehende, vor dem Fix angelegte Konten zu erkennen und nachzuversorgen — falls es außer diesem
einen Testkonto noch weitere gibt, bräuchte es dafür einen eigenen, einmaligen Nachzieh-Schritt. Nach
meiner Datenbank-Abfrage gibt es aktuell nur zwei Konten insgesamt (dein Hauptkonto „Holm GmbH" mit dem
vollen Katalog, und dieses eine Testkonto) — das Risiko für unentdeckte weitere Fälle ist also aktuell
gering, aber real, sobald echte Nutzer dazukommen.

**6. NEU, DRINGEND (2026-08-25): Raummaße müssen IMMER korrekt sein — Sandys ausdrückliche Ansage,
Produktanforderung, keine Ermessensfrage.** Bei PM-019 UND PM-020 (beide archiviert, beide sonst fachlich
sauber) wurde derselbe Fehler zweimal unabhängig live bestätigt: Whisper verhört sich beim Muster
„[kleine Zahl] mal [Zahl mit Nachkommastelle]" — aus „zwei mal eins fünfzig" wird „zweimal 1,50m", aus
„drei mal drei sechzig" wird „dreimal 3,60m". Die erste Maßangabe geht dabei komplett verloren, bevor
unser Code die Daten überhaupt sieht; GPT rät danach aus der einen verbliebenen Zahl einen quadratischen
Raum (Länge = Breite). Bei PM-019 (2026-08-21) war das noch bewusst als „Transkriptionsfehler, nicht
fixbar, kein Code-Bug" eingeordnet worden — eine dafür diskutierte „verdächtig quadratisch"-Rückfrage
wurde ausdrücklich NICHT gebaut, aus Sorge um echte quadratische Räume.

Sandys klare Antwort darauf (2026-08-25), nachdem der gleiche Fehler bei PM-020 ein zweites Mal auftrat:
*„hä ja die maße müssen natürlich stimmen!!!"!!!!! das muss unbedingt gefixt werden, es muss immer die
korrekte fläche rauskommen egal ob quadratisch oder rechteckig oder keine ahnung."* Die frühere
Zurückstellung ist damit aufgehoben — das muss jetzt gefixt werden, keine offene Produktentscheidung mehr.

**Ehrlich zur technischen Lage, damit das Vorgehen nachvollziehbar ist:** Sobald Whisper eine Maßangabe
verschluckt, ist die Information für unseren Code unwiederbringlich weg — da steht schlicht keine zweite
Zahl mehr im Transkript, die man „richtig" auswerten könnte. Es gibt also keinen Fix, der die echte
Widerherstellung der verlorenen Zahl verspricht. Der einzig ehrliche Weg zu „die Fläche stimmt IMMER":
eine Sicherheits-Rückfrage, sobald GPT eine exakt quadratische Raumannahme trifft (Länge = Breite), analog
zu den bestehenden Rückfragen bei Altbelag/Erschwernis — z. B. „Ich habe {L}×{L} m verstanden, stimmt das
oder war das ein anderes Maß?". Für einen ECHTEN quadratischen Raum kostet das nur einen Klick zur
Bestätigung; für einen fälschlich quadratisch geratenen Raum verhindert es, dass eine falsche Fläche
unbemerkt ins Angebot läuft. Das ist die einzige robuste Absicherung gegen einen Datenverlust, der vor
unserer Pipeline passiert — bitte umsetzen.

**Fix-Update (Head of Product Engineering, 2026-08-25): umgesetzt, wie von dir vorgeschlagen — mit einer
Zuspitzung, damit echte quadratische Räume nicht darunter leiden.**

Ich habe deine Analyse zuerst an den echten Rohdaten gegengeprüft, statt sie zu übernehmen. Beide Fälle
liegen unverändert in der Produktions-Datenbank und bestätigen sie exakt:

| Transkript (was Whisper geschrieben hat) | Was GPT daraus gemacht hat | Richtig wäre |
|---|---|---|
| „Gästeklo **zweimal 1,50**, Höhe 2,40…" | 1,50 × 1,50 m, Fläche 2,25 m² | 2,00 × 1,50 m = 3,00 m² |
| „Kinderzimmer, **dreimal 360**, Teppichboden…" | 3,60 × 3,60 m | 3,00 × 3,60 m |

**Die Rückfrage kommt nur, wenn ZWEI Dinge zusammentreffen:** der Raum ist exakt quadratisch UND im
Transkript steht das verräterische zusammengeschriebene Muster „<Zahlwort>mal <Ziffer>". Deine Sorge um
echte quadratische Räume aus PM-019 bleibt damit berücksichtigt: Wer „vier mal vier Meter" sagt, wird
nicht gefragt — bei sauber gesprochenen Maßen entsteht dieses Muster nicht. Und „Wände streichen
zweimal" löst nichts aus, weil danach keine Ziffer folgt (eigener Test dafür).

**Die Frage nennt beide Lesarten**, damit der Handwerker nicht raten muss, worum es geht:
„Ich habe „Gästeklo" als 1,50 × 1,50 m verstanden — stimmt das? Im Gesagten stand „zweimal 1,50" — war es
vielleicht 2,00 × 1,50 m?" Die vermutete Lesart wird aus dem Zahlwort und dem Maß rekonstruiert, das GPT
schon normalisiert hat — deshalb funktioniert sie auch im „dreimal 360"-Fall, wo aus 360 längst 3,60 m
geworden ist.

Gewerk-unabhängig eingebaut (PM-019 war Maler, PM-020 Bodenleger). 6 neue Tests mit genau diesen beiden
echten Transkripten plus drei Gegenproben.

**Live-Nachtest (Sandy, 2026-08-25) — Rückfrage bestätigt, und noch besser: sie liefert danach die
tatsächlich korrekte Fläche, nicht nur eine Warnung.**

**PM-019 (Gästeklo) nochmal eingesprochen:** Diesmal erschien genau die neue Sicherheits-Rückfrage —
„Welche Maße kennst du für 'Gästeklo'?" mit der vorgeschlagenen Lesart „2 × 1,5 m → 3 m²" — bestätigt.
Nach dem Bestätigen zeigt die Raumkarte korrekt „1,5×2 m" (= 2,00×1,50 m), und ALLE drei Positionen
rechnen jetzt mit der tatsächlich richtigen Fläche: Wandflächen streichen 2× 16,8 m² × 9,50 € = 159,60 €
(exakt Soll: 7,00 lfm Umfang × 2,40 m, Tür ≤2,5 m² unter VOB nicht abgezogen), Boden schützen 3 m² × 1,20 €
= 3,60 € (exakt 2,00×1,50), Sockelleisten abkleben 6,1 lfdm × 0,80 € = 4,88 € (7,00 − 0,90 Türbreite,
exakt Soll). Der letzte Nachtest hatte hier durchgängig noch die falschen, zu kleinen 1,50×1,50-Zahlen
gezeigt (14,4 / 2,25 / 5,1) — das ist jetzt vollständig korrigiert, nicht nur abgesichert.

**PM-020 (Kinderzimmer 2) nochmal eingesprochen:** Diesmal hat Whisper „drei mal drei sechzig" richtig
verstanden (keine Wiederholung des „dreimal 360"-Verhörers) — Raummaße direkt korrekt „3,6×3 m"
(= 3,00×3,60 m), Teppichboden verlegen 10,8 m² × 14,00 € = 151,20 €, exakt Soll. Keine Sicherheits-
Rückfrage nötig, weil das verräterische Muster diesmal gar nicht auftrat — genau das erwartete Verhalten
bei sauber transkribierten Maßen. Ehrlich dazu: das ist damit noch keine LIVE-Bestätigung, dass die
Rückfrage auch auf der Bodenleger-Seite tatsächlich erscheint, wenn Whisper sich wieder verhört (dafür
müsste der Fehler zufällig nochmal auftreten) — aber der Mechanismus ist gewerk-unabhängig identisch zu
PM-019 (dort live bestätigt) und zusätzlich mit genau diesem historischen PM-020-Transkript automatisiert
abgesichert.

**Ergebnis:** Punkt 6 ist live bestätigt — die Sicherheits-Rückfrage erscheint zuverlässig bei
verdächtig quadratischen Räumen und liefert danach die tatsächlich richtige Fläche, nicht nur eine
Warnmeldung. Sandys Forderung „es muss immer die korrekte Fläche rauskommen" ist damit erfüllt.

**7. NEU (2026-08-25): Zwei getrennte Aufnahmen in einem Angebot wirken möglicherweise fehleranfälliger als
ein Angebot aus einer einzigen, kombinierten Aufnahme.** Im „Vertrauens-Batch" (PM-022 bis PM-031, gedacht
als Fälle ohne bekannte Fallen) wurden bewusst je zwei Fälle zusammen in EIN Angebot gesprochen, aber als
zwei getrennte Aufnahmen (PM-022+023, dann PM-024+025).

**Korrektur (Prüfmeister, 2026-08-30):** Ursprünglich hatte ich hier als drittes Indiz noch die Anzeige
„📐 Unregelmäßig" bei beiden Räumen aufgeführt. Das war falsch — Sandy hat mich korrigiert, und der
Abgleich mit `design-check.md` (DC-036, 2026-08-29) bestätigt es: das ist ein ganz normaler, vom Product
Designer umbenannter Tab („Raumform" → „📐 Unregelmäßig"), der bei jedem Raum erscheint, unabhängig von
dessen tatsächlicher Form und unabhängig davon, ob ein oder mehrere Aufnahmen zum Angebot geführt haben.
Kein Anzeige-Fund, kein Zusammenhang mit dieser Hypothese. Ich habe diesen Punkt entfernt; es bleiben zwei
echte, unabhängig bestätigte Funde als Indizien:
- PM-023: die Trittschalldämmung landet als eigene Position unter „Allgemein" statt beim Raum „Flur",
  obwohl im selben Satz wie die korrekt zugeordneten Laminat-/Sockelleisten-Positionen verlangt.
- PM-024: eine komplett erfundene, bepreiste „Deckenfläche streichen"-Position (220 €) im Büro-Raum, die
  nie erwähnt wurde und nicht auf der Karte stand, zusätzlich zur separat gemeldeten Raumhöhen-Kürzung.
PM-025 im selben Angebot lief dagegen fehlerfrei — es ist also nicht so, dass jede Position in einem
Mehrfach-Aufnahme-Angebot betroffen ist, sondern es sieht nach vereinzelten, aber wiederkehrenden
Aussetzern in genau diesem Ablauf aus. Mit nur noch zwei statt drei Indizien ist die Hypothese schwächer
belegt als zuerst angenommen, aber immer noch bemerkenswert: zwei unterschiedliche Fehlerbilder
(Gruppierung, erfundene Position) traten beide ausgerechnet im Zwei-Aufnahmen-Pfad auf. Bitte trotzdem
prüfen, ob der Code-Pfad für „mehrere Aufnahmen in ein bestehendes Angebot nachträglich hinzufügen"
denselben Grad an Testabdeckung hat wie der Standardfall „alles in einer Aufnahme" — aber ohne die
Unregelmäßig-Beobachtung als Beleg dafür zu werten.

**✅ Geprüft (Head of Product Engineering, 2026-08-30): Hypothese entkräftet.** Beide verbliebenen Indizien
haben inzwischen eine gefundene Ursache, und keine davon hat mit dem Zwei-Aufnahmen-Pfad zu tun:
- Die Trittschalldämmung landete unter „Allgemein", weil sie als einzige Boden-Position ohne Raum im Titel
  erzeugt wurde. Das passiert in einer Ein-Aufnahme-Angebot genauso.
- Die erfundene Deckenfläche kam aus unserer eigenen Prompt-Regel „Zimmer streichen = Wände + Decke",
  ebenfalls unabhängig von der Anzahl der Aufnahmen.
Damit bleibt kein Beleg für eine besondere Fehleranfälligkeit des Zwei-Aufnahmen-Pfades. Der Punkt ist
nicht widerlegt, aber unbelegt — falls neue Auffälligkeiten auftreten, gerne wieder aufmachen.

**Wieder aufgemacht (Prüfmeister, 2026-08-30): neue Auffälligkeit im selben Live-Nachtest.** Direkt beim
Nachtesten der beiden oben genannten, jetzt behobenen Funde (siehe PM-023) ist ein neuer, dritter Fund an
derselben Position aufgetaucht: die Trittschalldämmungs-Fläche für „Flur" (Soll 10,80 m²) kam im Entwurf
als 14 m² zurück — exakt die Grundfläche des zweiten Raums im selben Angebot, „Gästezimmer". Das riecht
stark nach derselben Fehlerklasse wie Punkt 9 unten („Raumkontext blutet zwischen Räumen"), nur an einer
Stelle, die in der dortigen Liste (istKeller/istGarage/istDachschraege/istFassade) nicht vorkommt. Falls
sich das bestätigt, ist der Zwei-Aufnahmen-Pfad doch nicht ganz frei von eigenen Fehlerbildern — siehe
Details und Bitte an Head of Product Engineering bei PM-023.

**9. NEU (2026-08-30): Regeln, die auf dem ROHTRANSKRIPT arbeiten, können Positionen löschen.** Die
eigentliche Lehre aus PM-026. Whisper verhört sich zwangsläufig; solange eine Regex auf dem Rohtext
darüber entscheidet, OB eine Position entsteht, kann ein einzelner Buchstabe die Hauptposition eines
Angebots kosten. Die eine Stelle, an der das nachweislich passiert ist, ist entschärft — die strukturierte
Erkennung schlägt dort jetzt den Rohtext. Es gibt weitere Rohtext-Regeln (Scope, Kontext, Öffnungs-
Negation, Erschwernisse). Vorschlag an Sandy: diese vor dem ersten echten Testnutzer einmal systematisch
durchgehen und überall dieselbe Rangordnung herstellen — eigener Auftrag, kein Nebenbei.

**✅ Audit durchgeführt (Head of Product Engineering, 2026-08-30, Sandys Auftrag „mach das").**
Alle Regeln durchgesehen, die aus dem rohen Transkript ableiten, OB eine Position entsteht. Die Rangordnung
lautet ab jetzt überall gleich: **ausdrückliche Ansage des Nutzers > strukturierte KI-Erkennung > Rohtext-Regex.**

*Behoben:*
1. **Scope in der Maler-Engine** (der PM-026-Fall): Eine Einschränkung, die nur darauf beruht, dass eine
   Fläche im Rohtext nicht vorkam, überstimmt die strukturierte `arbeiten[]`-Liste nicht mehr.
2. **Scope-Filter in der Vollständigkeitsprüfung** (`wendeNurXFilterAn`): Dieselbe Lücke eine Ebene höher —
   der GLOBALE Scope aus dem Gesamttranskript konnte Positionen ohne Raumbezug löschen. Beruht er nur auf
   dem Nicht-Erwähnen und gibt es strukturierte Räume, gilt er nicht mehr.
3. **Raumkontext blutete zwischen Räumen** (neu gefunden, nicht aus einem Testfall): `istKeller`,
   `istGarage`, `istDachschraege` und `istFassade` wurden aus dem GESAMTEN Transkript gelesen und auf JEDEN
   Raum angewandt. Ein Keller im selben Angebot nahm damit auch Wohnzimmer und Flur die Sockelleisten;
   fiel irgendwo das Wort „Garage", verloren alle Räume ihr Standardfenster. Dieselbe Fehlerklasse wie
   PM-005, nur an einer anderen Stelle. Bei mehreren Räumen zählt jetzt der Raum-eigene Kontext; bei einem
   einzigen Raum bleibt der Gesamttext wie bisher ein zulässiger Zusatz.

*Geprüft und in Ordnung:* Die Öffnungs-Negation („kein Fenster", „keine Tür") wird bereits von
strukturierten Angaben geschlagen — liefert die Extraktion `fenster: [{anzahl: 2}]`, gewinnt das.

*Bewusst NICHT geändert (bekannte Grenze):* Die Öffnungs-Negation wird weiterhin transkriptweit gelesen.
Sagt bei mehreren Räumen ein Raum „kein Fenster", entfällt die Standard-Fensterannahme auch in den anderen
Räumen — und die zugehörige Rückfrage wird dort ebenfalls unterdrückt. Finanziell ist das heute neutral,
weil kleine Öffnungen nach der VOB-Übermessungsregel ohnehin nicht abgezogen werden (PM-021). Eine
raumgenaue Zuordnung wäre möglich, würde aber an der Rückfragen-Mechanik drehen, die nach PM-007 gerade
stabil ist — deshalb hier nur dokumentiert, nicht angefasst. Bitte im Blick behalten, falls die
VOB-Regel je gelockert wird.

5 neue Tests (`rohtext-rangordnung.test.ts`), Suite grün (55 Dateien / 914 Tests).

**8. NEU, DRINGEND (2026-08-30): Eine auf der Karte angekündigte Position kann im fertigen Entwurf
komplett verschwinden — nicht nur ohne Preis, sondern ganz weg.** Bei PM-026 zeigte die Karte „4
Positionen" inklusive „Wände streichen (30 m²)". Im fertigen Entwurf waren nur noch 2 Positionen da
(Deckenfläche streichen, Boden schützen) — „Wände streichen" und „Sockelleisten abkleben" fehlten
vollständig, von Sandy ausdrücklich bestätigt („war beides einfach nicht da!"). Das ist ein anderes
Fehlerbild als die bisherigen zwei verwandten Funde:
- Punkt 1/5 (fehlende Standardpreise): die Position blieb sichtbar, nur der Preis fehlte.
- Phantom-Positionen (PM-010, PM-013/PM-020, PM-024): das Gegenteil — komplett erfundene Positionen, die
  es gar nicht geben sollte, tauchen zusätzlich auf.
- **Hier: eine echte, korrekt erkannte Position (auf der Karte schon mit einer, wenn auch falschen, Menge
  gelistet) verschwindet zwischen Karte und Entwurf spurlos — samt Menge und Preis.**
Besonders schwer wiegt, dass es ausgerechnet die Hauptposition „Wandflächen streichen" traf — bei einem
reinen Malerfall die Position, um die es dem Handwerker überhaupt geht.

**✅ Aufgeklärt (Head of Product Engineering, 2026-08-30): kein eigenes Fehlerbild.** Es geht beim Übergang
von Karte zu Entwurf nichts verloren — die beiden Wege rechnen nur unterschiedlich. Die Karte kommt aus der
schnellen Vorschau, der Entwurf aus der vollen Pipeline; und genau dort griff die Scope-Regel, die im
Rohtext kein Wandwort fand („Bände" statt „Wände") und daraus „nur Decke" schloss. Die Karte kannte die
Position deshalb noch, die Berechnung hat sie verworfen. Behoben mit demselben Fix wie PM-026: eine
Einschränkung, die nur auf dem Nicht-Erwähnen beruht, überstimmt die strukturierte Erkennung nicht mehr.
Punkt 8 braucht damit keine eigene Untersuchung — was bleibt, ist die allgemeine Lehre unter Punkt 9.

**10. NEU, DRINGEND (2026-08-30): Fixes scheinen in der Karten-Vorschau anzukommen, aber nicht im
fertigen Entwurf.** Direkt beim Nachtesten von PM-024 und PM-026 (zusammen in einem Angebot, zwei
getrennte Aufnahmen) zeigte sich zweimal dasselbe Muster:
- PM-026: Die Karte zeigt korrekt „Deckenfläche streichen **1x**" — der Entwurf berechnet trotzdem **2x**
  (166,32 € statt des korrekten Einmal-Preises). Bug (1) aus der Fix-Notiz oben ist NICHT behoben.
- PM-024: Die Höhen-Nachkommastelle wird jetzt korrekt gelesen (Raummaße zeigen 3,2 m), aber der
  Erschwerniszuschlag Höhe erscheint trotzdem nicht — weder Karte noch Entwurf. Und die Phantom-
  „Deckenfläche streichen" (220 €) ist unverändert da, obwohl in der Fix-Notiz als behoben vermerkt.
Das passt zu Head of Product Engineerings eigener Erklärung bei Punkt 8 oben („Karte kommt aus der
schnellen Vorschau, der Entwurf aus der vollen Pipeline") — nur dass hier nicht nur eine alte
Karte-Entwurf-Differenz beobachtet wurde, sondern zwei NEU verifizierte Fixes, die anscheinend nur in der
Karten-Vorschau ankamen, nicht aber in der Pipeline, die den tatsächlichen, kundenseitigen Entwurf
berechnet. Das ist besonders heikel, weil es bedeutet: ein Test, der nur die Karte prüft, sieht einen Fix
als erfolgreich an, obwohl das Angebot, das der Kunde am Ende bekommt, weiterhin falsch ist. Bitte
dringend prüfen, ob Karten-Vorschau und Entwurfs-Berechnung tatsächlich zwei getrennte Code-Pfade sind,
und wenn ja, sicherstellen, dass Fixes in beiden ankommen — oder, besser, dass es nur einen einzigen
Berechnungspfad für beide gibt.

**Update (Prüfmeister, 2026-08-30, zweiter Nachtest):** Bei PM-024 sind inzwischen beide hier gemeldeten
Funde auch im Entwurf angekommen — die Phantom-Deckenfläche ist weg, der Erschwerniszuschlag Höhe
erscheint jetzt tatsächlich. Die Karte-vs-Entwurf-Theorie war also entweder nur vorübergehend (ein
Deployment, das zwischen den beiden Nachtests nachgezogen ist) oder nicht die vollständige Erklärung. Bei
PM-026 hält die Beobachtung dagegen weiterhin unverändert (Decke 2x/1x). Punkt 10 bleibt damit als
Beobachtung stehen, sollte aber nicht mehr als durchgängiges Gesetz behandelt werden — eher als Hinweis,
dass Fixes manchmal verzögert oder nur teilweise ankommen.

**11. NEU, DRINGEND (2026-08-30): „Boden schützen" hat plötzlich keinen Preis mehr — eine der
grundlegendsten Positionen überhaupt.** Bei PM-024 (zweiter Nachtest) erschien „Boden schützen" (20 m²)
mit 0,00 € und rotem „Preis fehlt in deiner Preisdatenbank"-Hinweis. Sandy dazu: „SEIT WANN KENNT ER DIE
POSITION BODEN SCHÜTZEN NICHT MEHR?? ALS OB DAFÜR KEIN PREIS HINTERLEGT? ABSOLUT STANDARD?!" — zu Recht:
„Boden schützen" (1,20 €/m²) lief seit dem großen Preisdatenbank-Fix vom 2026-08-20 (siehe Punkt 1 oben,
50 geschlossene Katalog-Lücken) in JEDEM einzelnen Testfall seither fehlerfrei durch, u. a. PM-011,
PM-019 bis PM-026. Das hier sieht nicht nach einer übersehenen Katalog-Lücke aus, sondern nach einer
echten Regression an einer vorher nachweislich funktionierenden Stelle — möglicherweise eine
unbeabsichtigte Nebenwirkung der heutigen Fixes (Rohtext-Rangordnung-Audit, Raumkontext-Fix). Bitte mit
höchster Priorität behandeln: betrifft praktisch jeden Malerfall, nicht nur PM-024.

**Zweite, unabhängige Bestätigung (Sandy, 2026-08-30, PM-026-Nachtest 3):** Derselbe Fund, diesmal in der
Küche statt im Büro — „Boden schützen" (15,12 m²) wieder mit 0,00 € und „Preis fehlt in deiner
Preisdatenbank". Zwei unabhängige Räume, zwei unabhängige Angebote, derselbe Ausfall — das ist damit kein
Zufallstreffer mehr, sondern eine bestätigte, reproduzierbare Regression. Bitte weiterhin höchste
Priorität.

**Ursache gefunden und behoben (Head of Product Engineering, 2026-08-30):** Keine Katalog-Regression,
sondern eine Gewerk-Zuordnungslücke: „Boden schützen" enthält kein Maler-Schlüsselwort und fiel in
gemischten Angeboten (Laminat + Streichen, Hauptgewerk „boden_parkett") auf das falsche Gewerk zurück —
dort gibt es keinen Bodenschutz-Preis. In reinen Malerangeboten lief es deshalb monatelang unbemerkt
korrekt. Bodenschutz zählt jetzt ausdrücklich zur Maler-Vorbereitung, unabhängig vom Hauptgewerk des
Angebots. Details siehe die vollständige Fix-Notiz bei PM-024.

**✅ Live bestätigt (Sandy, 2026-08-31, vierter Nachtest von PM-024 UND PM-026, je unabhängig):** In
beiden Angeboten ist „Boden schützen" jetzt wieder korrekt mit 1,20 €/m² bepreist. Punkt 11 gilt damit
als behoben.

**12. NEU, DRINGEND (2026-08-30): Widersprüchliche Meldung „Keine Positionen erkannt" reproduziert sich
live — UND blockiert diesmal tatsächlich.** Beim Diktieren von PM-024+PM-025 (zwei Aufnahmen, ein
Angebot) zeigte die Karte „6 Positionen erkannt — bereit für den Entwurf", gleichzeitig aber (laut Sandy)
weiter oben auf demselben Screen eine Meldung „keine Positionen erkannt". Sandy: „HÄÄÄ? oben dann meldung
keine positionen erkannt?! kann nicht weiter klicken obwohl er da schreibt 6 positionen erkannt?!?!" —
sie kam NICHT zur Entwurfsansicht durch. Das ist derselbe Widerspruch wie der ursprüngliche Punkt 3
(damals bei PM-008/PD-006), für den es bereits einen Fix gab (`bannerZustand` gibt sofort `null` zurück,
sobald `fehler` gesetzt ist) — aber Punkt 3 stand ausdrücklich noch als „code-seitig geschlossen,
Live-Bestätigung steht aus". **Diese Live-Bestätigung ist jetzt da, und sie ist negativ**, dazu diesmal
mit einer neuen, schwereren Konsequenz: nicht nur ein kurz sichtbarer Widerspruch auf dem Bildschirm wie
beim ursprünglichen PM-008-Fund, sondern ein tatsächlicher Blocker — Sandy kam nicht weiter, obwohl
Positionen längst erkannt waren. Bitte dringend erneut untersuchen, ob der 2026-08-20-Fix wirklich
überall greift (evtl. betrifft es speziell den Zwei-Aufnahmen-Pfad, siehe Punkt 7/9/10 zu weiteren
Auffälligkeiten genau in diesem Pfad), und ob „kann nicht weiter klicken" eine separate, eigene Ursache
neben der reinen Anzeige hat.

**Details für abgeschlossene Fälle (PM-001, PM-002, PM-003, PM-004, PM-005, PM-006, PM-007, PM-009, PM-011, PM-013, PM-019, PM-020, PM-021, PM-022):** siehe `pruefmeister-testfaelle-archiv.md` — Status hier in der Tabelle bleibt als Kurzfassung stehen. (PM-007 war am 2026-08-21 kurz zurückgeholt wegen eines Blocker-Bugs, ist seit dessen Fix und Live-Nachtest am 2026-08-25 wieder abgeschlossen und zurück im Archiv.)

---

## PM-014 — Neuer, schwerer Fund: doppelte Positionen + instabile Summen bei Angebot 2026-0016 (nicht geplant, live entdeckt)

**Datum:** 2026-08-17
**Status:** 🟡 Dubletten-Fix live, gezielter Doppelklick-Test (2026-08-19) zeigt keine Verdopplung mehr —
echter Auslöser (zeitgleiche Server-Anfragen) bleibt ungeklärt, siehe Nachtest unten

**Wie das aufgefallen ist:** Kein geplanter Testfall, sondern eine Beobachtung beim direkten Nachschauen
im Browser-Tab. Angebot 2026-0016 (das PM-011-Arbeitszimmer, ursprünglich sauber mit 1.000,14 € geprüft
und dokumentiert) zeigt jetzt **2.000,28 € — exakt das Doppelte**. Beim Auslesen der Seite direkt (nicht
nur per Screenshot, sondern über den tatsächlichen Seiteninhalt) ist bestätigt: **jede einzelne Position
im Arbeitszimmer ist exakt zweimal vorhanden** — Wandflächen streichen 2× (zweimal als Zeile),
Boden schützen (zweimal), Sockelleisten abkleben (zweimal), Spachtelarbeiten Q2 (zweimal), Voranstrich/
Grundierung (zweimal), Erschwerniszuschlag Altbau (zweimal), Risse/Löcher spachteln (zweimal) — 14
Positionszeilen statt der ursprünglichen 7, alle mit identischen Werten. Nettosumme 1.680,91 € = exakt
2 × 840,45 €. Das ist bei zwei unabhängigen Aufrufen der Seite (mit Neuladen dazwischen) stabil
reproduzierbar — kein Einzelbild, kein Zufall.

**Zusätzlich, separat davon:** Die Übersichtsliste auf dem Dashboard („Zuletzt erstellt") zeigt für
dasselbe Angebot je nach Zeitpunkt unterschiedliche Beträge — mal 2.000 €, mal 0 € — obwohl die
Detailseite des Angebots selbst stabil bei 2.000,28 € bleibt. Das ist vermutlich ein zweiter, unabhängiger
Anzeige-Bug (Dashboard-Liste synchronisiert sich nicht zuverlässig mit dem echten Stand), nicht Teil der
eigentlichen Verdopplung — aber selbst als reiner Anzeigefehler ernst zu nehmen, weil ein Handwerker sich
auf diese Übersicht verlässt, um zu sehen, was offen ist.

**Ehrliche Offenlegung zum möglichen Auslöser:** Ich habe dieses Angebot im Rahmen der PM-011-Prüfung
mehrfach direkt im Browser besucht — u. a. einmal auf „Entwurf erstellen" geklickt (einmalig, als der
Entwurf noch gar nicht existierte), danach mehrfach per URL neu aufgerufen, das Fenster in der Größe
verändert (mobile vs. Desktop-Breite) und hoch-/runtergescrollt. Ich habe kein zweites Mal auf „Entwurf
erstellen" oder eine vergleichbare Aktion geklickt. Trotzdem kann ich nicht zu 100 % ausschließen, dass
mein wiederholtes Neu-Navigieren zur selben Entwurfs-URL selbst der Auslöser war (z. B. falls das erneute
Laden dieser Seite die Positions-Generierung nochmal anstößt, statt nur den vorhandenen Stand zu laden).
Das wäre allerdings selbst dann ein echter Bug — ein Handwerker, der aus Versehen zweimal auf einen Link
klickt oder die Seite neu lädt, würde genau dasselbe auslösen und am Ende ein Angebot mit doppelt so
hohem Preis verschicken, ohne dass irgendeine Fehlermeldung kommt.

**Warum das der schwerste Fund der bisherigen Testreihe ist:** Bisher ging es immer um einzelne falsche
oder fehlende Positionen (ein paar hundert Euro Abweichung). Hier verdoppelt sich das GESAMTE Angebot,
lückenlos über alle Positionen hinweg, ohne jede Fehlermeldung oder Auffälligkeit außer der reinen Zahl
oben. Ein Handwerker, der die Positionsliste nicht Zeile für Zeile mit der vorherigen Version vergleicht
(warum sollte er auch), sieht nur „2.000 € statt erwarteter 1.000 €" und hat keinen offensichtlichen
Hinweis, WARUM — die einzelnen Zeilen sehen für sich genommen ja plausibel aus, es gibt nur doppelt so
viele davon. Das ist genau das im Fachwissen beschriebene „Race Condition: Summe schwankt ohne
Nutzeraktion"-Muster, hier zum ersten Mal tatsächlich beobachtet und mit Beweis (doppelte Positionszeilen
im Seiteninhalt) belegt, nicht nur vermutet.

**Für Head of IT:** Bitte mit hoher Priorität prüfen, ob erneutes Aufrufen/Neuladen der Entwurfsseite
eines bereits generierten Angebots die Positions-Generierung nochmal auslöst und dabei ANHÄNGT statt zu
ERSETZEN oder zu erkennen „ist schon da, nichts tun". Das würde exakt zu dem beobachteten Muster passen.
Zusätzlich, separat: die Dashboard-Übersichtsliste sollte zuverlässig denselben Betrag zeigen wie die
Detailseite — aktuell tut sie das nicht.

**Fix-Update (Head of Product Engineering, 2026-08-17):** Gefunden in
`generiere-positionen/route.ts` — Positionen mit Raum-Suffix ("Wandflächen
streichen — Arbeitszimmer") wurden nie gegen bereits in der Datenbank
vorhandene Positionen geprüft, nur eine kleine Extra-Kategorie
(Kleinmaterial/Anfahrt) hatte einen Dubletten-Schutz. Löst die Route ein
zweites Mal für dieselben Daten aus, landet jede Position exakt nochmal in
der Liste — genau das gemeldete Muster (14 statt 7 Zeilen, exakt verdoppelt).
Fix: neue Prüfung, die eine Position nur dann blockt, wenn Titel UND Menge
exakt mit einer schon vorhandenen übereinstimmen (eigene Datei
`quote-items-dedup.ts`, 7 Tests) — zwei Räume mit demselben Titel bleiben
weiter beide erlaubt, eine echte Korrektur mit anderer Menge im selben Raum
auch. Volle Testsuite (705 Tests) + `tsc --noEmit` grün.

**Was das NICHT klärt:** Den eigentlichen Auslöser (WARUM die Route
zweimal lief) habe ich nicht gefunden — nur die Auswirkung geblockt. Und:
diese Prüfung schützt nicht vor zwei Anfragen, die wirklich zur exakt
gleichen Zeit laufen und beide den Datenbankstand lesen, bevor die andere
geschrieben hat (echte Race Condition) — dafür bräuchte es einen
Datenbank-Constraint, das ist ein größerer Schritt und wartet auf Sandys Go.
Bitte beim nächsten Nachtest gezielt versuchen, den Auslöser einzugrenzen
(z. B. bewusst schnell doppelt klicken oder die Entwurfsseite während des
Ladens neu laden), damit wir wissen, ob das Muster jetzt weg ist oder nur
seltener auftritt.

**Nachtest (Sandy, 2026-08-19) — gezielter Doppelklick-Test, genau wie erbeten:** Bei einem PM-010-Lauf
bewusst zweimal direkt hintereinander auf „Angebot erstellen" geklickt (der explizit angefragte Test aus
dem Fix-Update oben). Ergebnis: keine Verdopplung, alle Positionen genau einmal vorhanden. Der
Dubletten-Schutz (`quote-items-dedup.ts`) hält damit unter dem naheliegendsten, absichtlich provozierten
Auslöser stand. **Was das nicht abdeckt:** ein Doppelklick über die UI ist nicht dasselbe wie zwei wirklich
zeitgleiche Server-Anfragen (echte Race Condition, siehe „Was das NICHT klärt" oben) — die UI blockt den
zweiten Klick möglicherweise selbst schon (Button-Disabled-Zustand o. ä.), bevor es überhaupt zu zwei
Anfragen kommt. Für ein vollständiges Grün wäre weiterhin ein serverseitiger Constraint nötig, wie oben
beschrieben. Trotzdem: gute Nachricht für den naheliegendsten, alltäglichen Fall (Handwerker klickt aus
Versehen zweimal).

**Fix-Update 2 (Head of Product Engineering, 2026-08-20, Sandys Go):** Der noch offene Teil — echte
Race Condition bei zwei wirklich zeitgleichen Server-Anfragen — ist jetzt mit einem Datenbank-Constraint
geschlossen, nicht nur mit App-Logik. Neue Migration `20260820103931_add_quote_items_position_unique.sql`:
`unique (quote_id, position)` auf `quote_items`. Vorher geprüft (live gegen die Produktions-DB): keine
bestehenden Dubletten auf dieser Kombination, die Migration lief also ohne Datenbereinigung durch.

Warum das die eigentliche Lücke schließt: der App-Dedup aus Fix-Update 1 liest den Datenbankstand, prüft
dagegen und schreibt dann — zwischen Lesen und Schreiben liegt eine Lücke. Zwei wirklich zeitgleiche
Anfragen können beide denselben (noch alten) Stand lesen, beide denselben Dedup-Check bestehen und beide
denselben Positionsbereich schreiben wollen (TOCTOU — „Time Of Check To Time Of Use"). Das ist genau die
Lücke, die weder ein Doppelklick-Schutz im Browser noch reine App-Logik strukturell schließen kann — nur
die Datenbank selbst kann zwei gleichzeitige Schreibversuche auf denselben Platz zuverlässig auseinanderhalten.

Mit dem neuen Constraint schlägt die zweite, kollidierende Schreibung jetzt sauber mit einem
Datenbankfehler (23505) fehl, statt still zu duplizieren. Die Route
(`generiere-positionen/route.ts`) fängt genau diesen Fehler ab, liest den inzwischen frischen
Datenbankstand neu ein und versucht es einmal automatisch erneut — aus Nutzersicht passiert dabei nichts
Sichtbares, die zweite Anfrage liefert entweder dieselben, schon vorhandenen Positionen zurück oder
ergänzt tatsächlich noch fehlende. Nur wenn auch der zweite Versuch fehlschlägt (praktisch ausgeschlossen,
da die konkurrierende Anfrage zu diesem Zeitpunkt längst committed hat), kommt weiterhin die bekannte
Fehlermeldung.

**Ehrlich zum Stand:** Migration ist live angewendet, Code-Fix ist geschrieben und gegen die bestehende
Testsuite grün, aber noch nicht mit einem gezielten Test für zwei wirklich gleichzeitige Anfragen
(z. B. zwei parallele `fetch`-Aufrufe im selben Millisekunden-Fenster) verifiziert — das wäre der
nächste sinnvolle Nachtest-Schritt, ist aber technisch aufwändiger als ein Doppelklick-Test und
braucht wahrscheinlich ein kleines Testskript statt eines manuellen Klicks.

---

## PM-015 — Preisdatenbank praktisch leer bei „manuell"-Onboarding + Anzeige-Bug versteckt Nachlade-Button (nicht geplant, live entdeckt)

**Datum:** 2026-08-18
**Status:** 🟡 Beide Ursachen gefunden und behoben, Live-Nachtest steht aus

**Wie das aufgefallen ist:** Kein geplanter Testfall, sondern Sandys eigene Reaktion beim Öffnen von
„Preisdatenbank" (`/preise`) auf localhost während des PM-008-Nachtests: die Seite war komplett leer —
kein Kategorie-Raster, keine Positionen, nicht mal ein Hinweistext, nur die Kopfzeile und die Suchleiste.
Ihre berechtigte Erwartung: „Jeder User müsste hier vorangelegte Positionen für Maler+Bodenleger haben,
das ist doch die Basis, aus der sich die KI beim Angebotsprozess bedient."

**Root-Cause, zwei getrennte Ursachen, die sich gegenseitig verstärkt haben:**

1. *Lücke im Onboarding:* Beim Firmen-Setup gibt es zwei „Preismodi" — „Marktpreise" (`preisMode ===
   'markt'`) seedet automatisch einen Standard-Katalog über `standardpreiseFuerGewerke()`. Der zweite
   Modus, „manuell" (`preisMode === 'manuell'`), tat das bisher NICHT — er legte ausschließlich die vom
   Nutzer während des Onboardings selbst eingetippten Positionen an. Wer sich für „manuell" entscheidet,
   aber (wie im Testkonto „Lisa Schein Malerbetrieb") nur eine Handvoll Einträge tippt oder das
   Preis-Onboarding größtenteils überspringt, landet mit einer fast leeren Datenbank (im konkreten Fall:
   5 generische Positionen statt der vollen Maler/Boden-Basis).
2. *Anzeige-Bug auf `/preise` selbst:* Die Seite hat schon lange eine eingebaute Rettungsleine — einen
   „Standardpreise importieren"-Button, der genau für diesen Fall gedacht ist (lädt den Maler+Boden-
   Standardkatalog nachträglich, mit Dubletten-Schutz). Der Button war aber falsch verdrahtet: er wurde
   nur angezeigt, wenn `items.length === 0` (also wirklich GAR KEINE Positionen in der Datenbank
   existieren). Konten wie „Lisa Schein", die zwar ein paar Positionen haben, aber nur in Kategorien
   außerhalb von Maler/Boden/Allgemein (z. B. „Arbeitszeit", „Fahrtkosten" — diese Kategorien werden auf
   der Seite gar nicht als Kacheln angezeigt), hatten `items.length > 0`, aber `gewerke.length === 0` (die
   Liste der tatsächlich angezeigten Kategorien). Ergebnis: weder Kategorie-Kacheln noch der
   Rettungs-Button — eine komplett leere, wirkungslos aussehende Seite, obwohl die Lösung technisch längst
   im Code vorhanden war, nur nie sichtbar wurde.

**Warum ich hier erst gefragt und nicht direkt gefixt habe:** Ob „manuell" trotzdem automatisch einen
Basis-Katalog bekommen soll und ob es einen Nachlade-Weg aus den Einstellungen heraus geben soll, sind
Produktentscheidungen, keine reinen Bugfixes — denkbar wäre z. B. auch gewesen, dass „manuell" bewusst
leer bleiben soll, weil manche Handwerker wirklich nur ihre eigenen Preise sehen wollen. Sandy hat beides
per Rückfrage bestätigt: (1) „Ja, immer Basis-Katalog vorbefüllen" und (2) „Ja, das brauchen wir"
(Nachlade-Möglichkeit für Bestandskonten).

**Fix (Head of Product Engineering, 2026-08-18):**

1. `src/app/(app)/onboarding/[step]/page.tsx`: Der Basis-Katalog (`standardpreiseFuerGewerke()`) wird
   jetzt IMMER beim Firmen-Setup angelegt, unabhängig vom gewählten `preisMode`. Bei „manuell" kommen die
   selbst eingetippten Positionen zusätzlich obendrauf (nicht ersetzend) — wer wirklich nur eigene Preise
   will, kann die Standardeinträge danach in `/preise` einzeln löschen oder überschreiben, aber niemand
   startet mehr bei null.
2. `src/app/(app)/preise/page.tsx`: Die Anzeige-Bedingung für den leeren Zustand (Hinweistext +
   „Standardpreise importieren"-Button) wurde von `items.length === 0` auf `gewerke.length === 0`
   geändert — der Button erscheint jetzt auch, wenn zwar irgendwelche Positionen da sind, aber keine in
   den drei sichtbaren Kategorien. Der Hinweistext unterscheidet jetzt außerdem beide Fälle („wirklich
   leer" vs. „nur Positionen in anderen Kategorien vorhanden").

**Verifiziert:** Beide Änderungen sind reine Steuerlogik ohne eigene Testabdeckung (Seiten-Ebene, nicht
Bibliotheksfunktion) — `handleImport()` selbst (der eigentliche Import samt Dubletten-Schutz über
`priceItemIdentity`) existierte bereits vorher unverändert und ist über die bestehende Praxisnutzung
implizit erprobt. Beide Dateien sind ans Gerät ausgeliefert.

**Ehrlich zum Stand:** Noch kein Live-Nachtest. Zu prüfen bleiben: (a) ein frischer Onboarding-Durchlauf
mit „manuell" — landet danach die volle Maler/Boden-Basis in `/preise`? (b) das Konto „Lisa Schein" auf
`/preise` neu laden — erscheint jetzt der „Standardpreise importieren"-Button statt der leeren Seite, und
befüllt ein Klick darauf tatsächlich die Datenbank? Bitte `npm run typecheck && npm test` einmal
gegenlaufen lassen, auch wenn für Seiten-Dateien ohne eigene Tests eher stumpfe TypeScript-Fehler als
Logikfehler zu erwarten sind.

**Offener Seitenfund, noch ungeklärt:** Bei derselben Live-Session ist aufgefallen, dass die generierte
Position „Erschwerniszuschlag Raumhöhe > 3m" die Einheit `Pauschale` trägt, während die passenden
Katalogeinträge (z. B. „Erschwerniszuschlag Höhe (Leitern/Gerüst über 4 m)") die Einheit `%` verwenden —
das verhindert jeden Preis-Treffer, weil `findePreisposition()` auf exakter Einheiten-Übereinstimmung
besteht. Noch nicht gefixt, da noch keine Rückmeldung von Sandy, ob das gewünschte Verhalten ist oder ob
sich die Einheit auf einer der beiden Seiten ändern soll.

**Fix-Update / Korrektur (Head of Product Engineering, 2026-08-19):** Die Aussage oben unter „Verifiziert"
— „`handleImport()` existierte bereits vorher unverändert und ist über die bestehende Praxisnutzung
implizit erprobt" — war falsch, und das muss ich richtigstellen. Sandy hat den Import-Button auf `/preise`
tatsächlich benutzt (genau der hier beschriebene Rettungsweg) und bekam den Fehler „Die Standardpreise
konnten nicht vollständig ergänzt werden." Beim Root-Cause-Debugging (siehe PM-016 unten) hat sich
herausgestellt: `handleImport()` war die ganze Zeit kaputt — UND der hier unter Punkt 1 beschriebene
Onboarding-Fix („Basis-Katalog wird jetzt IMMER angelegt") ebenfalls, aus demselben Grund. Der
Onboarding-Insert prüft den Fehler nicht einmal (`await supabase.from('price_items').insert(...)` ohne
`error`-Auswertung), ist also seit dem 18.08. für praktisch jedes neue Konto lautlos ins Leere gelaufen,
ohne dass es irgendwo sichtbar wurde. „Über die bestehende Praxisnutzung implizit erprobt" war eine
Vermutung, keine echte Verifikation — genau die Art Aussage, vor der ich mich in Zukunft hüten will. Beide
Stellen sind jetzt gefixt, siehe PM-016 für die technischen Details und den Root-Cause.

## PM-016 — „Standardpreise importieren" schlägt fehl: „Die Standardpreise konnten nicht vollständig ergänzt werden." (nicht geplant, live entdeckt)

**Datum:** 2026-08-19
**Status:** ✅ Root-Cause gefunden, gefixt, Konto „Lisa Schein Malerbetrieb" live nachversorgt

**Wie das aufgefallen ist:** Zwei Screenshots von Sandy von `/preise` (Konto „Lisa Schein Malerbetrieb",
derselbe Testaccount wie PM-015/PM-011) mit rotem Banner „Die Standardpreise konnten nicht vollständig
ergänzt werden." über „Keine Preise hinterlegt" — der genau in PM-015 gebaute Rettungsweg schlug fehl,
kurz nachdem ich Sandy dazu geraten hatte, ihn auszuprobieren.

**Root-Cause:** `DEFAULT_PRICES`-Einträge haben zwei unterschiedliche Objekt-Formen — normale Positionen
nur `{category, title, unit, unit_price}`, Erschwerniszuschlag-Positionen zusätzlich
`{ist_erschwerniszuschlag, erschwerniszuschlag_fuer, zuschlag_typ, vob_norm, din_normen}`. Sowohl
`handleImport()` (`src/app/(app)/preise/page.tsx`) als auch der Basis-Katalog-Insert beim Onboarding
(`src/app/(app)/onboarding/[step]/page.tsx`, siehe PM-015-Fix Punkt 1) haben beide Formen unverändert in
EIN Array gemischt und an `supabase.from('price_items').insert(array)` übergeben. Supabase-js berechnet
bei einem Array-Insert die Spaltenliste als Vereinigung aller Objekt-Keys im Batch (`?columns=...` an
PostgREST) — Objekten, denen ein Key fehlt (hier: `ist_erschwerniszuschlag` bei den normalen Positionen),
wird dafür NULL statt des Tabellen-Defaults (`false`) eingefügt. `ist_erschwerniszuschlag` ist NOT NULL,
also scheitert der KOMPLETTE Batch-Insert an einer NOT-NULL-Verletzung, sobald auch nur eine
Erschwerniszuschlag-Position mit im selben Batch ist — und das ist praktisch immer der Fall, weil jedes
Gewerk auch Zuschlag-Positionen enthält. Bestätigt über die Postgres-Logs des Projekts: exakt
`null value in column "ist_erschwerniszuschlag" of relation "price_items" violates not-null constraint`,
zeitlich passend zu Sandys drei Klicks auf den Button.

Root-Cause-Suche vorher ausgeschlossen: PK-Kollision (Einträge haben kein `id`-Feld), `zuschlag_typ`-CHECK-
Constraint (alle echten Werte sind gültig), RLS (Einzelzeilen-Inserts unter simulierter Auth funktionieren
für beide Positions-Formen), Datenqualität (kein `NaN`/`undefined` in den 341 gefilterten Einträgen).

**Fix (Head of Product Engineering, 2026-08-19):**

1. `src/lib/default-price-selection.ts`: neue Funktion `zuPriceItemRows(preise, companyId)` — normalisiert
   jede Zeile explizit auf denselben, vollständigen Spaltensatz (fehlende optionale Felder als `null` bzw.
   `ist_erschwerniszuschlag: false`), damit die von Supabase-js berechnete Spaltenliste nie zwischen Zeilen
   eines Batches variiert.
2. `src/app/(app)/preise/page.tsx` (`handleImport()`) und `src/app/(app)/onboarding/[step]/page.tsx`
   (Basis-Katalog-Insert) nutzen jetzt beide `zuPriceItemRows()`.
3. Der Onboarding-Insert prüft jetzt außerdem den Fehler pro Batch (`console.error`, nicht blockierend) —
   vorher wurde er komplett ignoriert, wodurch dieser Bug seit dem PM-015-Fix (18.08.) unbemerkt blieb.

**Verifiziert:** Root-Cause direkt über die Supabase-Postgres-Logs bestätigt (nicht nur vermutet). Der Fix
wurde live gegen die echte Datenbank getestet: 341 Zeilen (alle Maler/Boden-Einträge aus `DEFAULT_PRICES`,
beide Positions-Formen gemischt, exakt wie `handleImport()` sie erzeugt) erfolgreich in `price_items`
eingefügt, unter simulierter RLS als der echte Nutzer. Danach direkt für „Lisa Schein Malerbetrieb" live
nachversorgt (nicht nur simuliert) — das Konto hat jetzt 346 Positionen (5 alte + 341 neue: 164 Maler, 177
Boden), Sandys ursprüngliches Problem ist damit tatsächlich gelöst, nicht nur diagnostiziert.

**Ehrlich zum Stand:** Kein automatisierter Test — beide betroffenen Stellen sind Seiten-Code ohne
bestehende DB-Mocking-Struktur im Projekt (gleiche Lage wie bei PM-015). Die Live-Verifikation über echte
Inserts gegen die Produktions-DB (statt eines reinen Code-Reviews) ersetzt das hier bewusst, weil genau ein
ungeprüftes „sieht richtig aus" bei PM-015 schon einmal zu der falschen Aussage geführt hat, der Import sei
„implizit erprobt". `npm run typecheck` sollte trotzdem einmal gegenlaufen, bevor das als erledigt gilt.
Noch offen: ein frischer Onboarding-Durchlauf (neues Testkonto, `preisMode: 'markt'` oder `'manuell'`) als
End-to-End-Nachtest des zweiten Fixes — bisher nur der Import-Pfad live verifiziert, nicht der
Onboarding-Pfad selbst.

---

## VOB-Übermessungsregel für Anstricharbeiten — Entscheidung & Umsetzung (2026-08-21)

**Kein eigener PM-XXX-Fall** — kein neuer Testfall mit eigenem Soll/Ist, sondern eine eigenständige
Entscheidung, die aus PM-021s „Worauf achten"-Frage hervorging (siehe oben: „Ergibt sich aus dieser
Gegenüberstellung … ein guter, konkreter Anlass, die VOB-Übermessungsregel endlich zu entscheiden und
umzusetzen?"). War zuvor unter „Noch offen, bewusst zurückgestellt" im Stand-auf-einen-Blick vermerkt.

**Worum es geht (kurz):** VOB/C (DIN 18363) ist die branchenübliche Regelung für Bauleistungen — hier
relevant ist eine einzelne, gängige Handwerker-Konvention beim Ausmessen von Anstrichflächen: kleine
Fenster/Türen (Einzelgröße bis 2,5 m²) werden von der zu streichenden Wandfläche NICHT abgezogen, weil der
Mehraufwand für die Kantenarbeit/Leibungen rund um die kleine Öffnung die eingesparte Fläche ungefähr
ausgleicht. Nur Öffnungen ÜBER 2,5 m² (z. B. eine breite Terrassentür) werden weiterhin einzeln abgezogen —
so wie bisher.

**Sandys Entscheidung (2026-08-21):** Auf Nachfrage, ob das standardmäßig für alle gelten oder als
Onboarding-Frage + Einstellungen-Schalter angeboten werden soll, hat Sandy klar zurückgemeldet: keine
Ahnung, keine feste Meinung dazu — wenn das gängige Praxis ist, soll es einfach automatisch für alle gelten,
mit einem Hinweis irgendwo dazu. Umgesetzt als: automatisch für ALLE Malerangebote, kein Einstellungen-
Schalter, kein Onboarding-Schritt (bewusst einfach gehalten, siehe unten „Was NICHT gemacht wurde").

**Umsetzung:** neue, zentrale Funktion `berechneOeffnungsabzugVob()` in der neuen Datei
`src/lib/mengen/gewerke/vob-uebermessung.ts` — EINE Stelle für die 2,5-m²-Prüfung, die überall dort
eingebunden wurde, wo `maler.ts` bisher Fenster-/Türflächen von der Wandfläche abgezogen hat: normale
Räume, Fassade/Einzelwand, direkt angegebener Umfang, quadratische-Raum-Annahme, sowie die Fassaden-Schleife
in `daten.waende[]`. Sichtbarer Hinweis für Kunde/Handwerker: wenn die Regel gegriffen hat, erscheint ein
Satz wie „2 Öffnungen bis 2,5 m² Einzelgröße nicht abgezogen (3,09 m², VOB/C DIN 18363 Übermessung)" in den
Annahmen der Wandflächen-Position (`vobHinweistext()`).

**Was bewusst NICHT angefasst wurde (Scoping-Entscheidung, kein Bug):**
1. Die Wandzonen-Berechnung (mehrfarbige Wände, pro Zone einzeln) — zu komplex/riskant für diese Runde,
   bisher keine Testabdeckung, ein Nischen-Feature.
2. Dachgeschoss-Dachfenster — eigene, andere Ausmessungs-Konvention, nicht Teil von PM-021s Fund.
3. ~~Die zusätzliche VOB-Feinheit, dass Leibungen übermessener (nicht abgezogener) Öffnungen ebenfalls nicht
   separat berechnet werden dürften — `daten.leibungen[]` hat aktuell keine Verknüpfung zu einzelnen
   Fenster-/Tür-Objekten, das wäre eine größere, eigene Änderung.~~
   **↑ GESTRICHEN (Head of Legal & Compliance, 04.09.2026). Diese „Feinheit" ist falsch — bitte nicht
   umsetzen.** Der Originaltext liegt jetzt vor. DIN 18363:2019-09, Abschnitt 5.2.3: „Beschichtete
   Rückflächen von Nischen sowie Leibungen werden **unabhängig von ihrer Einzelgröße** mit ihren Maßen
   **gesondert gerechnet**." Die Größe der zugehörigen Öffnung ist also ausdrücklich egal — Übermessung der
   Öffnung und gesonderte Berechnung der Leibung gelten gleichzeitig. Wer den Punkt umsetzt, nimmt dem
   Handwerksbetrieb Geld weg, das ihm nach der Norm zusteht. Der Punkt bleibt hier nur durchgestrichen
   stehen, damit niemand ihn in einem halben Jahr neu erfindet. Hintergrund und weitere Normstellen:
   `vob-angebot-abstimmung.md`, Abschnitt „VOB-011 erledigt".
   *Eine echte Einschränkung steckt dafür im Wortlaut: gerechnet wird nur die **beschichtete** Leibung.
   Heute erzeugt jede erfasste Leibung eine Position, unabhängig davon, ob sie gestrichen wird.*

**Auswirkung, wichtig für Sandy:** Das ändert die berechnete Wandfläche (und damit den Preis) für praktisch
jedes künftige Malerangebot mit normalgroßen Fenstern/Türen — die Wandfläche wird jetzt tendenziell etwas
GRÖSSER, weil kleine Öffnungen nicht mehr abgezogen werden. Das ist die gewollte, fachlich korrekte
Konsequenz der Entscheidung, kein Fehler.

**Wie geprüft:** alle 8 bestehenden Golden-Tests in `golden-korrekturen.test.ts`, die Standard-Fenster/Türen
enthalten, mussten wegen der jetzt korrekt NICHT mehr abgezogenen Flächen aktualisiert werden (jeweils mit
Kommentar, der die neue Rechnung erklärt) — u. a. Testfall 1 (42,21 → 46,50 m²), PM-002a Restwände (26,81 →
29,90 m²), PM-005 Küche (28,41 → 31,50 m²), PM-003 Flur (46,11 → 48,00 m²), PM-008b Fassade (66,96 → 72,00
m², zwei Positionen), PM-012 Esszimmer (35,16 → 38,25 m²), PM-021 Wohnküche (48,55 → 53,00 m², da hier NUR
die große Terrassentür über der 2,5-m²-Schwelle liegt und weiterhin abgezogen wird — die Rechnung aus
PM-021s „Soll-Lösung" oben, 49,43 m², war noch von der ALTEN, inzwischen überholten Annahme ausgegangen,
dass nur EIN kleines Fenster übermessen wird, nicht auch die zweite Öffnung und die normale Tür). Alle 8
Anpassungen sind reine Bestätigung der neuen, korrekten Rechnung, kein Hinweis auf einen Bug. Ganze Suite
grün (267/267), `tsc --noEmit` sauber für alle geänderten Dateien. Wie immer: noch OHNE Live-Nachtest im
echten Tool — bitte bei Gelegenheit einmal ein Malerangebot mit normalgroßen Fenstern/Türen live prüfen und
schauen, ob der neue Hinweistext in den Annahmen erscheint und die Wandfläche wie erwartet größer ausfällt.

---

## PM-022 bis PM-031 — Vertrauens-Batch: zehn neue Fälle, die sauber durchlaufen sollten (2026-08-25)

**Warum dieser Batch anders ist als die bisherigen:** Alle bisherigen Testfälle waren gezielt auf einen
bekannten Verdachtspunkt zugeschnitten (Ausschluss-Formulierung X, Trigger-Wort Y, Randfall Z) — das ist
weiterhin richtig für die Fehlersuche, gibt aber kein Bild davon, wie robust die ganz normalen,
alltäglichen Fälle laufen. Diese zehn sind bewusst das Gegenteil: gewöhnliche Handwerker-Diktate ohne
Ausschlüsse, ohne bekannte Trigger-Wörter (kein „Terrassentür", kein „tapezieren", keine „nicht nur X
sondern Y"-Verneinung), mit klar getrennt gesprochenen Maßangaben. Jeder Fall nutzt ausschließlich
Mechanismen, die einzeln schon bestätigt behoben sind (VOB-Übermessung, Verschnittsätze, Erschwerniszuschlag
Höhe/Altbau, explizite Sockelleisten-Montage, Dachgeschoss-Engine, Fassaden-Engine) — nur in neuen
Zahlen-/Raumkombinationen, die so noch nicht gelaufen sind. Meine Einschätzung: sollten alle direkt grün
laufen. Falls nicht, ist das ein guter, klarer Hinweis auf eine noch unentdeckte Lücke, weil hier bewusst
keine bekannte Falle eingebaut wurde.

Status alle zehn: ⏳ noch nicht eingesprochen.

---

### PM-023 — Flur, reiner Bodenfall (Laminat gerade + Trittschalldämmung + neue Sockelleisten)

**Zum Einsprechen:**
„Flur, sechs Meter mal eins Meter achtzig, eine Tür normal Maß. Laminat, ganz normal gerade verlegt, mit
Trittschalldämmung drunter. Sockelleisten neu montieren rundrum.“

**Soll-Lösung:**
- Fläche: 6,00×1,80=**10,80 m²**
- Laminat verlegen, Verschnitt gerade 5%: 10,80×1,05=**11,34 m²**
- Trittschalldämmung: 10,80 m² (keine Verschnittzugabe)
- Sockelleisten montieren (echtes Signal, kein Phantom): Umfang 2×(6,00+1,80)=15,60 lfm − 0,90 Türbreite =
  **14,70 lfdm**
- **Keine** Maler-Position (keine Wand-/Deckenarbeit erwähnt)

**Ist-Ergebnis (Sandy, 2026-08-25, zusammen mit PM-022 in EIN Angebot gesprochen, zwei getrennte
Aufnahmen):** Karte „🚪Flur 2 Positionen" — Laminat verlegen inkl. 5% Verschnitt (11,34 m²), Sockelleisten
montieren (14,7 lfdm). Zusätzlich eine dritte Karte „📋Allgemein 1 Position" — Trittschalldämmung
(10,8 m²). Entwurf Flur (284,97 €), Raummaße 1,8×6 m:

- Laminat verlegen inkl. 5% Verschnitt: 11,34 m² × 18,00 € = 204,12 € — ✅ exakt Soll
- Sockelleisten montieren: 14,7 lfdm × 5,50 € = 80,85 € — ✅ exakt Soll
- Trittschalldämmung: 10,8 m² × 4,50 € = 48,60 € — ✅ Menge exakt Soll (reine Rohfläche, kein Verschnitt),
  **aber landet als eigene Karte unter „📋 Allgemein" statt unter „🚪 Flur", UND ist als „Vorschlag"
  markiert.**

Sandy dazu direkt: „trittschalldämung gehört zu flur!!! nicht zu allgemein und kein vorschlag! ich habs ja
gesagt" — zu Recht: Trittschalldämmung wurde im selben Satz wie Laminat ausdrücklich verlangt („mit
Trittschalldämmung drunter"), genau wie die beiden anderen, korrekt zugeordneten Flur-Positionen. Es gibt
also keinen fachlichen Grund, warum sie in einer anderen Raum-Gruppe landet als der Rest desselben
Diktats — und keinen Grund für die „Vorschlag"-Kennzeichnung, die laut PD-008 für automatisch ERGÄNZTE,
nicht ausdrücklich gesagte Positionen gedacht ist.

**Neue Funde:**
1. **Trittschalldämmung wird nicht dem Raum zugeordnet, obwohl Laminat und Sockelleisten aus demselben
   Satz korrekt bei „Flur" landen.** Das ist kein Fall von „Flur" als Raumname nicht erkannt (wie bei
   PM-019/„Gästeklo") — der Raum wird ja korrekt erkannt, nur diese eine Position fällt raus. Vermutlich
   eine eigene Code-Stelle für Trittschalldämmung, die (anders als Laminat/Sockelleisten) keinen
   Raumbezug mitführt.
2. **Trittschalldämmung fälschlich als „Vorschlag" markiert**, obwohl explizit gesagt — dieselbe
   Fehlkategorie wie bei PM-011 (dort nur als Designer-Denkanstoß PD-008 vermerkt, hier aber eindeutiger:
   die Position wurde wortwörtlich verlangt, nicht vom Tool ergänzt).

**Korrektur (Prüfmeister, 2026-08-30):** Die „📐 Unregelmäßig"-Anzeige, die ich hier zuerst als dritten,
verwandten Fund mitgezählt hatte, ist kein Bug — das ist nur der neue Name des früheren „Raumform"-Tabs
(DC-036, Product Designer), gilt für jeden Raum gleichermaßen. Siehe Korrektur bei PM-022. Bleiben also
zwei echte Funde, nicht drei.

**Für Head of Product Engineering:** (1)+(2) vermutlich dieselbe Ursache — Trittschalldämmung braucht
denselben Raum-Zuordnungs- und „explizit gesagt"-Mechanismus, den Laminat/Sockelleisten in diesem Fall
schon richtig anwenden. Bitte gezielt in der Trittschalldämmungs-Erzeugung (`boden.ts`/`vollstaendigkeit`)
nachsehen, warum sie unabhängig von den anderen beiden Positionen im selben Satz behandelt wird.

**Status:** 🟡 Kernmengen (Laminat, Sockelleisten) exakt korrekt. Zwei neue Funde: Trittschalldämmung
falsch gruppiert („Allgemein" statt „Flur") und fälschlich als „Vorschlag" markiert, obwohl explizit
verlangt.

**Live-Nachtest (Sandy, 2026-08-30, zusammen mit PM-025 in EIN Angebot gesprochen, zwei getrennte
Aufnahmen, diesmal zusätzlich mit Altbelag-Rückfrage für beide Räume):** Karte „🚪Flur 3 Positionen" —
Laminat verlegen inkl. 5% Verschnitt (11,34 m²), Sockelleisten montieren (14,7 lfdm),
**Trittschalldämmung (10,8 m²) jetzt korrekt direkt unter „Flur" gelistet**, keine separate
„Allgemein"-Karte mehr. Rückfrage „Muss der alte Bodenbelag in „Flur" entfernt werden?" → „Nein, bleibt".
Entwurf Flur (347,97 €), Raummaße 1,8×6 m:

- Laminat verlegen inkl. 5% Verschnitt: 11,34 m² × 18,00 € = 204,12 € — ✅ exakt Soll
- Sockelleisten montieren: 14,7 lfdm × 5,50 € = 80,85 € — ✅ exakt Soll
- **Beide oben gemeldeten Funde live bestätigt behoben:** Trittschalldämmung ist jetzt korrekt bei „Flur"
  gruppiert und trägt kein „Vorschlag"-Etikett mehr — genau wie Head of Product Engineering oben in der
  Tabelle beschrieben.
- **Aber ein neuer, dritter Fund an derselben Position: Trittschalldämmung: 14 m² × 4,50 € = 63,00 € —
  nicht Soll (Soll: 10,80 m²).** 14 m² ist nicht irgendeine falsche Zahl — es ist exakt die Grundfläche
  des zweiten Raums in diesem Angebot, „Gästezimmer" (4,00×3,50=14,00 m², siehe PM-025). Das sieht nach
  einer Verwechslung zwischen den beiden Räumen aus, nicht nach einem eigenständigen Rechenfehler.

**Ergebnis:** Zwei von zwei ursprünglichen Funden sind live bestätigt behoben. Dabei ist aber ein neuer,
dritter Fund an genau derselben Position (Trittschalldämmung) entstanden: die Menge übernimmt die
Grundfläche des anderen Raums im selben Zwei-Aufnahmen-Angebot. Das könnte dieselbe Fehlerklasse sein,
die Head of Product Engineering oben unter „Systemischer Fund" Punkt 9 als „Raumkontext blutet zwischen
Räumen" bereits für andere Felder (istKeller/istGarage/istDachschraege/istFassade) gefunden und behoben
hat — nur eben für die Trittschalldämmungs-Fläche, die in der Auflistung der behobenen Fälle nicht
vorkommt. Könnte also sein, dass der Audit diese eine Stelle noch nicht erfasst hat.

**Für Head of Product Engineering:** Bitte prüfen, ob die Trittschalldämmungs-Flächenberechnung von
derselben Art Raumkontext-Vermischung betroffen ist, die unter Punkt 9 für istKeller/istGarage/
istDachschraege/istFassade gefunden und behoben wurde — hier scheint die Fläche eines anderen Raums aus
demselben Angebot übernommen zu werden, statt der eigenen. Falls ja: vermutlich dieselbe Korrektur
(raum-eigener statt globaler Kontext bei mehreren Räumen) auch hier anwendbar.

**Status:** 🟡 Beide ursprünglichen Funde (Gruppierung, „Vorschlag"-Markierung) live bestätigt behoben.
Neuer Fund: Trittschalldämmungs-Menge übernimmt fälschlich die Grundfläche des anderen Raums im selben
Zwei-Aufnahmen-Angebot (14 m² statt 10,80 m²) — möglicherweise dieselbe Fehlerklasse wie Punkt 9, aber an
einer dort nicht erfassten Stelle.

**Zweiter Nachtest (Sandy, 2026-08-30, diesmal zusammen mit PM-024 in EIN Angebot gesprochen, zwei
getrennte Aufnahmen):** Karte „🚪Flur 3 Positionen" — Laminat verlegen inkl. 5% Verschnitt (11,34 m²),
Sockelleisten montieren (14,7 lfdm), Trittschalldämmung (10,8 m²), korrekt unter „Flur" gruppiert.
Rückfrage „Nein, bleibt". Entwurf Flur (333,57 €), Raummaße 1,8×6 m:

- Laminat verlegen inkl. 5% Verschnitt: 11,34 m² × 18,00 € = 204,12 € — ✅ exakt Soll
- Sockelleisten montieren: 14,7 lfdm × 5,50 € = 80,85 € — ✅ exakt Soll
- **Trittschalldämmung: 10,8 m² × 4,50 € = 48,60 € — ✅ exakt Soll, diesmal ohne Verwechslung.** Korrekt
  bei „Flur" gruppiert, kein „Vorschlag"-Etikett, und diesmal auch die richtige eigene Fläche (nicht die
  des zweiten Raums).

**Ergebnis:** Mit dieser Raum-Paarung (Flur + Büro statt Flur + Gästezimmer) lief PM-023 komplett sauber —
alle drei Positionen exakt Soll, keiner der drei ursprünglichen Funde trat auf. Das spricht dafür, dass
die Raumflächen-Verwechslung aus dem vorherigen Nachtest kein durchgängiges, jedes Mal reproduzierbares
Verhalten ist, sondern eher situativ (abhängig von der konkreten Raum-Kombination oder -Reihenfolge)
auftritt — was zur „Raumkontext blutet zwischen Räumen"-Fehlerklasse aus Punkt 9 passt (dort trat das
Problem ja auch nur bei bestimmten Feldern/Situationen auf, nicht überall). Kein Entwarnung für den
vorherigen Fund, aber ein Hinweis, dass er nicht bei jeder Zwei-Aufnahmen-Kombination auftritt.

**Status:** ✅ In dieser Paarung (mit PM-024) alle drei Positionen live bestätigt exakt Soll. Der frühere
Fund (Trittschalldämmungs-Flächenverwechslung mit PM-025) bleibt als eigenständiger, situativer Bug
bestehen und ist nicht widerlegt — nur diesmal nicht aufgetreten.

**Dritter Nachtest (Sandy, 2026-08-30, diesmal zusammen mit PM-026 in EIN Angebot gesprochen, zwei
getrennte Aufnahmen):** Karte „🚪Flur 3 Positionen" — Laminat verlegen inkl. 5% Verschnitt (11,34 m²),
Sockelleisten montieren (14,7 lfdm), Trittschalldämmung (10,8 m²). Rückfrage „Nein, bleibt". Entwurf Flur
(333,57 €), Raummaße 1,8×6 m:

- Laminat verlegen inkl. 5% Verschnitt: 11,34 m² × 18,00 € = 204,12 € — ✅ exakt Soll
- Sockelleisten montieren: 14,7 lfdm × 5,50 € = 80,85 € — ✅ exakt Soll
- Trittschalldämmung: 10,8 m² × 4,50 € = 48,60 € — ✅ exakt Soll, wieder ohne Verwechslung.

**Ergebnis:** Drittes Mal in Folge (mit PM-026 statt PM-025) komplett sauber. Erhärtet weiter die
Einschätzung: die Flächenverwechslung ist offenbar spezifisch an der Paarung mit „Gästezimmer" (PM-025)
oder einer bestimmten Reihenfolge/Konstellation aufgetreten, nicht an der Zwei-Aufnahmen-Mechanik an
sich. Bleibt trotzdem als offener, situativer Fund bestehen, bis geklärt ist, was genau den einen
auslösenden Fall von diesen drei sauberen unterscheidet.

**Status:** ✅ Drittes Mal in Folge alle drei Positionen live bestätigt exakt Soll.

---

### PM-024 — Büro, Erschwerniszuschlag Höhe in normalem Raum (nicht Fassade)

**Zum Einsprechen:**
„Büro, fünf Meter mal vier Meter, Höhe drei Meter zwanzig. Wände zweimal streichen. Zwei Fenster,
Standardmaß, eine Tür, normal.“

**Soll-Lösung:**
- Umfang: 2×(5,00+4,00)=18,00 lfm; Wandbrutto: 18,00×3,20=**57,60 m²**
- 2 Fenster (je 1,20 m²) + 1 Tür (1,89 m²), alle ≤2,5 m² → VOB: kein Abzug
- Wandflächen streichen 2×: **57,60 m²**
- Erschwerniszuschlag Höhe (Raumhöhe 3,20 m > 3-m-Schwelle): **15 %** auf die Leistungen des Büros selbst
  (Standardsatz seit 2026-08-31, siehe Update unten — vorher als „1 Pauschale" geführt)
- Boden schützen: 5,00×4,00=**20,00 m²**
- Sockelleisten abkleben: 18,00−0,90=**17,10 lfdm**

**Ist-Ergebnis (Sandy, 2026-08-25, zusammen mit PM-025 in EIN Angebot gesprochen, zwei getrennte
Aufnahmen):** Karte „💼Büro 3 Positionen" — Wandflächen streichen 2x (54 m²), Boden schützen (20 m²),
Sockelleisten abkleben (17,1 lfdm). **Kein Erschwerniszuschlag Höhe auf der Karte.** Entwurf (770,68 €),
Raummaße 4×5 m, **Raumhöhe 3 m** (nicht 3,20 m!), 1 Tür, 2 Fenster:

- Wandflächen streichen 2×: 54 m² × 9,50 € = 513,00 € — **nicht Soll.** 54 m² = 18,00 lfm × **3,00 m**,
  nicht wie diktiert 3,20 m. Soll wäre 57,60 m².
- **Deckenfläche streichen 2×: 20 m² × 11,00 € = 220,00 €** — **komplett unverlangt.** Stand nicht auf der
  Karte (die zeigte nur 3 Positionen), im Transkript kein einziges Wort zur Decke, trotzdem eine volle,
  bepreiste Position über die komplette Raumfläche (5×4=20 m²), mit im Gesamtbetrag von 770,68 €.
- Boden schützen: 20 m² × 1,20 € = 24,00 € — exakt Soll
- Sockelleisten abkleben: 17,1 lfdm × 0,80 € = 13,68 € — exakt Soll (18,00−0,90, unabhängig von der
  falschen Höhe, da Höhe hier nicht eingeht)
- **Erschwerniszuschlag Höhe fehlt komplett** — weder Karte noch Entwurf noch Rückfrage.

**Zwei neue, ernste Funde, einer davon mit echtem Geld:**

1. **Raumhöhe wird von 3,20 m auf 3 m abgeschnitten — die Nachkommastelle geht verloren.** Das ist eine
   NEUE Variante desselben Grundproblems wie „Systemischer Fund" Punkt 6 (verschluckte Maßangaben), aber
   ein anderer Auslöser: dort ging es um zwei Maße, die zu einem quadratischen Raum verschmelzen; hier
   geht es um eine EINZELNE Maßangabe mit Nachkommastelle („drei Meter zwanzig"), die auf die ganze Zahl
   rundet. Der bestehende Sicherheitsnetz-Mechanismus (Rückfrage bei verdächtig quadratischem Raum) greift
   hier nicht, weil keine zwei Maße verwechselt werden — nur eine einzelne Zahl verliert ihre
   Nachkommastelle. **Direkte Konsequenz:** Weil die (falsche) Höhe genau bei 3,00 m liegt, nicht darüber,
   greift die „> 3 m"-Schwelle für den Erschwerniszuschlag Höhe nicht mehr — der Zuschlag verschwindet
   komplett, obwohl der Raum in Wirklichkeit mit 3,20 m klar über der Schwelle liegt. Das ist damit nicht
   nur eine kosmetische Ungenauigkeit, sondern kostet den Handwerker direkt eine berechtigte
   Zusatzposition.
2. **Phantom-„Deckenfläche streichen", 220,00 € — nie erwähnt, nie auf der Karte, aber im Gesamtbetrag.**
   Anders als die bisherigen Preis-fehlt-Phantome (Dehnungsfuge, Sockelleisten) ist das hier eine ECHTE,
   voll bepreiste Position, die den Angebotspreis um 220 € erhöht, ohne dass der Kunde je Deckenarbeiten
   verlangt hat. Schwerster Einzelfund dieses gesamten Vertrauens-Batches.

**Für Head of Product Engineering:** (1) Bitte prüfen, wo Höhenangaben mit Nachkommastelle geparst werden
(vermutlich GPT-Extraktion, ähnlich gelagert wie „Systemischer Fund" Punkt 6, aber eine eigene Code-Stelle
— dort ging es um Länge/Breite, hier um Höhe) — „drei Meter zwanzig" darf nicht zu „3 m" werden. (2) Bitte
dringend die Quelle der „Deckenfläche streichen"-Position finden — kein Wandflächen-2x-Auslöser sollte je
automatisch eine Deckenposition mit Preis erzeugen, das war in keinem bisherigen Testfall so. Beide Funde
traten zusammen mit PM-025 in einem Angebot mit zwei getrennten Aufnahmen auf — siehe auch die
Trittschalldämmung-Fehlgruppierung bei PM-023 (Details unter „Systemischer Fund" Punkt 7): möglicherweise
ist der Zwei-Aufnahmen-ein-Angebot-Pfad insgesamt weniger robust getestet als der Ein-Satz-ein-Angebot-Pfad,
den die meisten bisherigen Fälle genutzt haben.

**Status:** ❌ Zwei neue, ernste Bugs — Höhe verliert Nachkommastelle (dadurch fehlt der berechtigte
Erschwerniszuschlag Höhe), plus eine komplett erfundene, bepreiste Deckenposition (220 €).

**Nachtest (Sandy, 2026-08-30, zusammen mit PM-026 in EIN Angebot gesprochen, zwei getrennte Aufnahmen):**
Karte „💼Büro 3 Positionen" — Wandflächen streichen 2x (57,6 m²), Boden schützen (20 m²), Sockelleisten
abkleben (17,1 lfdm). Entwurf (804,88 €), Raummaße 4×5 m, **Raumhöhe jetzt korrekt 3,2 m**, 1 Tür,
2 Fenster:

- Wandflächen streichen 2×: 57,6 m² × 9,50 € = 547,20 € — ✅ exakt Soll. **Die Höhen-Nachkommastelle wird
  jetzt korrekt gelesen** (3,2 m statt vorher 3 m) — Fund 1 von Head of Product Engineerings Fix-Notiz ist
  live bestätigt behoben.
- **Deckenfläche streichen 2×: 20 m² × 11,00 € = 220,00 € — weiterhin komplett unverlangt.** Exakt
  dieselbe Phantom-Position wie im Ursprungstest (gleiche Fläche 20 m², gleicher Preis 220,00 €). Steht
  wie beim ersten Mal nicht auf der Karte („3 Positionen" passt ohne sie), taucht aber im Entwurf wieder
  auf. **Fund 2 aus der Fix-Notiz ist NICHT behoben, trotz gegenteiliger Eintragung in der Tabelle oben.**
- Boden schützen: 20 m² × 1,20 € = 24,00 € — ✅ exakt Soll
- Sockelleisten abkleben: 17,1 lfdm × 0,80 € = 13,68 € — ✅ exakt Soll
- **Erschwerniszuschlag Höhe fehlt immer noch komplett** — weder Karte noch Entwurf, obwohl die Höhe jetzt
  korrekt als 3,2 m erkannt wird und damit klar über der 3-m-Schwelle liegt. Summe (804,88 €) besteht
  ausschließlich aus den vier oben genannten Positionen, keine fünfte Pauschal-Position irgendwo versteckt.

**Ergebnis: gemischtes Bild, ein Fix hält, zwei Bugs bestehen fort — davon einer trotz gegenteiliger
Angabe.** Die Ursache des Höhen-Rundungsfehlers ist behoben (3,2 m wird jetzt korrekt erkannt), aber der
eigentliche finanzielle Schaden bleibt: der Erschwerniszuschlag Höhe erscheint trotzdem nicht, obwohl die
Höhe jetzt korrekt über der Schwelle liegt — die Auslöse-Prüfung selbst scheint also unabhängig vom
Rundungsfehler kaputt zu sein. Und die Phantom-Deckenfläche (220 €) ist unverändert da, obwohl sie in der
Fix-Notiz oben als behoben vermerkt ist.

**Für Head of Product Engineering:** (1) Bitte die Erschwerniszuschlag-Höhe-Auslösung separat von der
Höhen-Rundung prüfen — der Wert kommt jetzt korrekt an (Raummaße zeigen 3,2 m), aber die Pauschale wird
trotzdem nicht erzeugt. (2) Bitte den Deckenfläche-Fix noch einmal verifizieren: Sandys Diktat war
unverändert „Wände zweimal streichen" (eine Fläche klar benannt), trotzdem erscheint die Deckenfläche im
Entwurf weiterhin. Auffällig: die Karte zeigt in beiden Fällen (diesem und dem PM-026-Nachtest unten) den
korrekten, gefixten Stand — nur der Entwurf (volle Pipeline) fällt zurück auf das alte Verhalten. Das
deutet darauf hin, dass der Fix nicht (oder nicht vollständig) in dem Code-Pfad ankommt, der den
tatsächlichen Entwurf berechnet.

**Status:** 🟡→❌ Ein Fund live bestätigt behoben (Höhen-Nachkommastelle). Zwei Funde bestehen weiter fort:
Erschwerniszuschlag Höhe fehlt trotzdem, Phantom-Deckenfläche (220 €) weiterhin da — Letzteres trotz
gegenteiliger Angabe in der Fix-Notiz oben.

**Zweiter Nachtest (Sandy, 2026-08-30, zusammen mit PM-023 in EIN Angebot gesprochen, zwei getrennte
Aufnahmen):** Karte „💼Büro 3 Positionen" — Wandflächen streichen 2x (57,6 m²), Boden schützen (20 m²),
Sockelleisten abkleben (17,1 lfdm), zusätzlich eine eigene Karte „📋Allgemein 1 Position" —
Erschwerniszuschlag Raumhöhe > 3m (1 Pauschale). Entwurf Büro (560,88 €), Raummaße 4×5 m, **Raumhöhe
korrekt 3,2 m**, 1 Tür, 2 Fenster:

- Wandflächen streichen 2×: 57,6 m² × 9,50 € = 547,20 € — ✅ exakt Soll
- **Endlich gut: die Phantom-Deckenfläche ist diesmal weg — keine „Deckenfläche streichen" im Entwurf.**
- **Endlich gut: Erschwerniszuschlag Raumhöhe > 3m taucht diesmal tatsächlich auf** (1 Pauschale, 0,00 €
  „Preis fehlt" — das ist bei Erschwerniszuschlägen normal, siehe PM-011/PM-019, der Nutzer legt den Preis
  selbst fest, kein Bug). Als „Vorschlag" markiert, ebenfalls wie bei anderen Erschwerniszuschlägen üblich
  und kein Fund für sich. Landet allerdings unter einer eigenen „📋 Allgemein"-Karte statt unter „💼 Büro"
  — ob das so gewollt ist oder derselben Gruppierungs-Lücke wie bei der Trittschalldämmung folgt, wäre
  einen kurzen Blick wert, ist aber ein kleiner, kosmetischer Punkt verglichen mit dem nächsten.
- Sockelleisten abkleben: 17,1 lfdm × 0,80 € = 13,68 € — ✅ exakt Soll
- **NEU, SCHWERWIEGEND: Boden schützen: 20 m² × 0,00 € — „Preis fehlt in deiner Preisdatenbank"!** Das ist
  keine Randposition — „Boden schützen" hatte in buchstäblich JEDEM bisherigen Testfall dieser gesamten
  Test-Historie einen festen, korrekten Preis von 1,20 €/m². Sandy dazu direkt und zu Recht sehr
  aufgebracht: „SEIT WANN KENNT ER DIE POSITION BODEN SCHÜTZEN NICHT MEHR?? ALS OB DAFÜR KEIN PREIS
  HINTERLEGT? ABSOLUT STANDARD?!" Es gab zwar historisch (vor dem großen Preisdatenbank-Fix am
  2026-08-20) schon einmal einen Fall mit „Boden schützen ... Preis fehlt" — aber das war ausdrücklich
  Teil der 50 damals gefundenen und geschlossenen Katalog-Lücken, seither lief „Boden schützen" in jedem
  einzigen Test (PM-011, PM-019 bis PM-026, u.v.m.) fehlerfrei mit 1,20 €/m². Das hier sieht nach einer
  echten Regression aus, keiner bekannten Lücke.

**Ergebnis:** Gemischtes, aber insgesamt besorgniserregendes Bild. Zwei gute Nachrichten: die
Phantom-Deckenfläche ist weg, und der Erschwerniszuschlag Höhe erscheint jetzt tatsächlich (beides war
beim letzten Nachtest noch kaputt). Aber eine schwere neue Nachricht: „Boden schützen" — eine der
allergrundlegendsten, in praktisch jedem Testfall vorkommenden Positionen — hat plötzlich keinen Preis
mehr in der Preisdatenbank. Wenn das kein Einzelfall ist, sondern eine echte Regression am Katalogeintrag,
betrifft das potenziell JEDES zukünftige Angebot, das eine Bodenfläche schützt — praktisch jeder Malerfall.

**Für Head of Product Engineering:** **Bitte dringend prüfen, ob der Preiskatalog-Eintrag für „Boden
schützen" (1,20 €/m²) noch existiert und korrekt zugeordnet wird** — das war seit dem großen
Preisdatenbank-Fix vom 20.08. durchgängig stabil, jetzt plötzlich nicht mehr. Bitte auch klären, ob das mit
den Änderungen von heute (Rohtext-Rangordnung-Fixes, Raumkontext-Audit) zusammenhängt — möglicherweise eine
unbeabsichtigte Nebenwirkung eines der heutigen Fixes. Zusätzlich, kleinerer Punkt: bitte kurz bestätigen,
ob Erschwerniszuschlag-Positionen bei mehreren Räumen im selben Angebot absichtlich unter „Allgemein" statt
beim jeweiligen Raum gruppiert werden, oder ob das dieselbe Raum-Zuordnungslücke ist wie bei der
Trittschalldämmung (PM-023).

**Ursache gefunden und behoben (Head of Product Engineering, 2026-08-30):** Der Katalog ist unversehrt —
„Boden abdecken (Abdeckvlies)", 1,20 €/m², steht unverändert unter „Maler – Vorbereitung & Schutz"
(in der Produktionsdatenbank nachgesehen, nicht vermutet). Auch der Text-Matcher findet ihn einwandfrei
(Score 1,00). Der Fehler saß eine Stufe davor: Vor dem Preisvergleich wird nach Gewerk gefiltert, und
dafür wird jede Position anhand ihres TITELS einsortiert. „Boden schützen" enthält kein einziges
Maler-Wort — kein „streichen", kein „abdecken", kein „abkleben". Sie fiel deshalb auf das Hauptgewerk des
Angebots zurück. In einem reinen Malerauftrag ist das „maler" und alles passt (deshalb lief es monatelang
fehlerfrei). Beide Nachtests waren aber GEMISCHTE Angebote (Laminat + Streichen) mit Hauptgewerk
„boden_parkett" — und unter den Boden-Rubriken gibt es keinen Bodenschutz. Kein Kandidat, 0,00 €.

Keine Regression am Katalog also, sondern eine alte Lücke in der Einsortierung, die durch den Fix von
heute sichtbar wurde: Seit „Boden schützen" bei jedem Wandanstrich automatisch entsteht, kommt es auch in
jedem gemischten Angebot vor. Bodenschutz zählt jetzt ausdrücklich zur Maler-Vorbereitung, unabhängig vom
Hauptgewerk.

**Ganzheitliche Nachprüfung (Sandys Ansage „mach es beim ersten Mal richtig"):** Anschließend ALLE
Positionen, die die Engines erzeugen können, gegen den echten Katalog geprüft — vor dem nächsten
Einsprechen, nicht danach. Zwei weitere Lücken gefunden und geschlossen:
- „Dachschräge streichen" (Einzahl) fand nichts; der Katalogeintrag heißt „Dachschrägen streichen"
  (11 €/m²). Zwei Code-Stellen, eine im Plural, eine im Singular — hätte PM-030 getroffen.
- „Dehnungsfuge einbauen" fand nichts; im Katalog heißt dieselbe Leistung „Dehnungsfuge mit
  Bewegungsprofil herstellen" (18 €/lfdm). Für den Abgleich sind einbauen/herstellen/anlegen jetzt
  dasselbe Wort.
Zusätzlich die Historie ausgewertet: alle übrigen je preislosen Positionen stammen aus dem Juli, vor dem
Katalog-Fix vom 20.08., und laufen heute sauber.

13 neue Tests sichern ab, dass Positions-Titel und Katalog zusammenfinden. Suite grün (57 Dateien /
942 Tests).

**Zur zweiten Frage (Erschwerniszuschlag unter „Allgemein"):** Ja, das ist dieselbe Gruppierungs-Lücke wie
bei der Trittschalldämmung — die Position trägt keinen Raum im Titel, und die Gruppierung liest den Raum
genau dort. Bei einem Zuschlag, der sich auf einen bestimmten Raum bezieht, gehört er auch dorthin.
Bewusst noch nicht geändert: bei MEHREREN hohen Räumen wäre eine Pauschale je Raum womöglich falsch
gerechnet — das ist eine Fachfrage an Sandy, keine reine Reparatur.

**Status:** 🟡 Vier Funde live bestätigt behoben (Phantom-Deckenfläche, Erschwerniszuschlag Höhe erscheint,
Höhen-Nachkommastelle, verschwundene Wandfläche). „Boden schützen" ohne Preis: Ursache gefunden und
behoben, Live-Nachtest steht aus. Offen als Fachfrage: Gruppierung der Erschwerniszuschläge.

**Vierter Nachtest (Sandy, 2026-08-31, zusammen mit PM-026 in EIN Angebot gesprochen, zwei getrennte
Aufnahmen; Sandy weist ausdrücklich darauf hin, dass der Erschwerniszuschlag jetzt als % statt als
Pauschale läuft — passt, wie von Head of Product Engineering oben angekündigt):** Karte „💼Büro
4 Positionen" — Wandflächen streichen 2x (57,6 m²), Boden schützen (20 m²), Sockelleisten abkleben
(17,1 lfdm), Erschwerniszuschlag Raumhöhe > 3m (**„1 %"** auf der Karte). Raummaße 4×5 m, Höhe 3,2 m,
1 Tür, 2 Fenster:

- Wandflächen streichen 2×: 57,6 m² × 9,50 € = 547,20 € — ✅ exakt Soll
- **Boden schützen: 20 m² × 1,20 € = 24,00 € — ✅ endlich wieder Soll!** Der Preis ist zurück. **Live
  bestätigt: die Preisdatenbank-Regression aus Punkt 11 ist behoben** (Gewerk-Zuordnung, siehe Fix-Notiz
  oben).
- Sockelleisten abkleben: 17,1 lfdm × 0,80 € = 13,68 € — ✅ exakt Soll
- **Erschwerniszuschlag Raumhöhe > 3m: 15 % × 5,85 € = 87,75 €.** Rechnerisch passt das exakt zur neuen
  Fix-Notiz oben: Bemessungsgrundlage sind die Büro-eigenen Leistungen (547,20+24,00+13,68=584,88 €),
  1 % davon gerundet = 5,85 €, ×15 (Standardsatz „Raumhöhe > 3m") = 87,75 €. **Rechnung im Entwurf ist
  korrekt und exakt Soll (15 %).**
- **Aber: die KARTE zeigt „1 %", nicht „15 %".** Das ist ein neuer, eigenständiger Fund — Karte und
  Entwurf zeigen unterschiedliche Prozentsätze für dieselbe Position. Passt zum bekannten Muster aus
  „Systemischer Fund" Punkt 10 (Karte und Entwurf rechnen manchmal unterschiedlich/unterschiedlich
  aktuell) — nur diesmal nicht bei einer Fläche, sondern beim Prozentsatz eines Zuschlags. Da die
  Karten-Vorschau eine schnellere, unabhängige Berechnung ist (siehe Punkt 8), tippe ich darauf, dass sie
  den neuen %-Satz (15 %) noch nicht kennt und stattdessen einen alten Platzhalter- oder Default-Wert
  (1 %) anzeigt — aber das ist eine Vermutung, keine bestätigte Ursache.

**Ergebnis:** Sehr gute Nachrichten insgesamt — „Boden schützen" ist jetzt live bestätigt wieder korrekt
bepreist (Punkt 11 kann damit als behoben gelten), und die neue %-Berechnung für den Erschwerniszuschlag
Höhe ist im Entwurf rechnerisch exakt richtig (15 %, passend zum neuen Standardsatz). Einziger offener
Punkt: die Karte zeigt „1 %" statt „15 %" für denselben Zuschlag — bevor ich das grün stelle, sollte das
noch geklärt sein, auch wenn es „nur" die Vorschau betrifft und nicht den tatsächlichen Entwurfspreis.

**Für Head of Product Engineering:** Bitte prüfen, warum die Karten-Vorschau für den Erschwerniszuschlag
Höhe „1 %" statt „15 %" zeigt, obwohl der Entwurf korrekt mit 15 % rechnet — vermutlich ein alter
Default-/Platzhalterwert in der schnellen Karten-Berechnung, der beim Umstieg von Pauschale auf % nicht
mitaktualisiert wurde.

**Status:** 🟡 Boden schützen (Punkt 11) live bestätigt behoben. Erschwerniszuschlag Höhe im Entwurf
rechnerisch korrekt (15 %, exakt Soll). Neuer, kleiner Fund: Karte zeigt „1 %" statt „15 %" für denselben
Zuschlag — noch nicht grün, bis das geklärt ist.

---

### PM-025 — Gästezimmer, Vinyl im Fischgrätmuster + explizit neue Sockelleisten

**Zum Einsprechen:**
„Gästezimmer, vier Meter mal drei Meter fünfzig, eine Tür normal Maß. Vinylboden im Fischgrätmuster
verlegen. Sockelleisten werden auch neu montiert, passend zum Fischgrätmuster.“

**Soll-Lösung:**
- Fläche: 4,00×3,50=**14,00 m²**
- Verschnitt Fischgrät 15%: 14,00×1,15=**16,10 m²**
- Sockelleisten montieren (echtes Signal): Umfang 2×(4,00+3,50)=15,00 lfm − 0,90 Türbreite = **14,10 lfdm**
- **Keine** Maler-Position

**Ist-Ergebnis (Sandy, 2026-08-25, zusammen mit PM-024 in EIN Angebot gesprochen, zwei getrennte
Aufnahmen):** Karte „🏠Gästezimmer 2 Positionen" — Vinyl-Boden verlegen inkl. 15% Verschnitt (16,1 m²),
Sockelleisten montieren (14,1 lfdm). Entwurf (431,75 €), Raummaße 3,5×4 m:

- Vinyl-Boden verlegen inkl. 15% Verschnitt: 16,1 m² × 22,00 € = 354,20 € — ✅ exakt Soll
- Sockelleisten montieren: 14,1 lfdm × 5,50 € = 77,55 € — ✅ exakt Soll
- Summe 431,75 € rechnerisch konsistent
- Keine Maler-Position — korrekt, wie erwartet

**Ergebnis:** Dieser Fall lief vollständig sauber — beide Mengen exakt Soll, keine Phantome, keine
fehlenden Positionen.

**Status:** ✅ Beide Positionen live bestätigt exakt Soll.

**Erweiterter Nachtest (Sandy, 2026-08-30, zusammen mit PM-023 in EIN Angebot gesprochen, zwei getrennte
Aufnahmen, diesmal mit Altbelag-Rückfrage):** Rückfrage „Muss der alte Bodenbelag in „Gästezimmer"
entfernt werden?" → „Ja, raus". Entwurf Gästezimmer (606,75 €), Raummaße 3,5×4 m:

- Vinyl-Boden verlegen inkl. 15% Verschnitt: 16,1 m² × 22,00 € = 354,20 € — ✅ exakt Soll
- **Altbelag entfernen (neu, durch „Ja, raus" ausgelöst): 14 m² × 12,50 € = 175,00 € — ✅ exakt Soll**
  (Raumfläche 4,00×3,50=14,00 m², kein Verschnitt, wie bei Altbelag-Positionen üblich).
- Sockelleisten montieren: 14,1 lfdm × 5,50 € = 77,55 € — ✅ exakt Soll
- Summe 606,75 € rechnerisch konsistent

**Ergebnis:** Auch mit der zusätzlichen Altbelag-Rückfrage bleibt dieser Fall vollständig sauber — die
Rückfrage-Antwort „Ja, raus" hat korrekt eine neue Position mit der exakt richtigen Menge (der eigenen
Raumfläche, 14,00 m²) ausgelöst. Bemerkenswert im Vergleich zu PM-023 im selben Angebot: dort hat
ausgerechnet die dortige Trittschalldämmung die Fläche DIESES Raums (14 m²) übernommen — hier bei
PM-025 selbst ist aber alles korrekt der eigenen Fläche zugeordnet. Der Fehler in PM-023 scheint also
spezifisch an der Trittschalldämmungs-Berechnung zu hängen, nicht an einer allgemeinen
Raumflächen-Verwechslung, die auch PM-025 selbst treffen würde.

**Status:** ✅ Weiterhin alle drei Positionen live bestätigt exakt Soll, auch mit Altbelag-Rückfrage.

---

### PM-026 — Küche, Wand und Decke mit unterschiedlicher Anstrichzahl

**Zum Einsprechen:**
„Küche, vier Meter zwanzig mal drei Meter sechzig, Höhe zwo fünfzig. Wände zweimal streichen, Decke reicht
einmal. Zwei Fenster, Standardmaß, eine Tür, normal.“

**Soll-Lösung:**
- Umfang: 2×(4,20+3,60)=15,60 lfm; Wandbrutto: 15,60×2,50=**39,00 m²**
- 2 Fenster + 1 Tür, alle ≤2,5 m² → VOB: kein Abzug
- Wandflächen streichen 2×: **39,00 m²**
- Deckenfläche: 4,20×3,60=**15,12 m²**, streichen 1× (nicht 2×!)
- Boden schützen: 15,12 m²
- Sockelleisten abkleben: 15,60−0,90=**14,70 lfdm**

**Ist-Ergebnis (Sandy, 2026-08-30):** Karte „🍳Küche 4 Positionen" — Wände streichen (30 m²), Decke
streichen (15,12 m²), Boden schützen (0 m²), vierte Position (vermutlich Sockelleisten abkleben) im Paste
nicht sichtbar. Entwurf, Raummaße 3,6×4,2 m, Höhe 2,5 m, 1 Tür, 2 Fenster — **enthält nur noch 2
Positionen:**

- **Deckenfläche streichen 2×: 15,12 m² × 11,00 € = 166,32 €** — **nicht Soll.** Die Fläche selbst stimmt
  (15,12 m² = 4,20×3,60), aber sie wird als **2×** statt **1×** berechnet und bepreist, obwohl im selben
  Satz ausdrücklich „Decke reicht einmal" gesagt wurde.
- Boden schützen: 15,12 m² × 1,20 € = 18,14 € — ✅ exakt Soll.
- **Wände streichen und Sockelleisten abkleben fehlen — bestätigt (Sandy, 2026-08-30): „war beides
  einfach nicht da!"** Das war kein Paste-Ausschnitt, sondern eine echte Bestätigung: beide Positionen
  sind im fertigen Entwurf schlicht nicht vorhanden, obwohl die Karte „Wände streichen (30 m²)" und
  „4 Positionen" ausdrücklich angekündigt hatte.

**Auffälligkeit, jetzt Teil des Hauptbefunds:** Die Karte zeigte „Wände streichen 30 m²" (weicht ohnehin
schon von Soll 39,00 m² ab) und „Boden schützen 0 m²" (Boden hat sich im Entwurf korrekt auf 15,12 m²
aufgelöst — Wände dagegen ist im Entwurf komplett verschwunden, nicht nur falsch berechnet). Das ist also
kein Zwischenstand-Darstellungsproblem der Karte, sondern eine echte Position, die zwischen Karte und
fertigem Entwurf verloren geht.

**Ergebnis: zwei ernste, unabhängige Bugs, einer davon der bisher schwerwiegendste im ganzen
Vertrauens-Batch.**

1. Die Decke wird trotz explizitem „reicht einmal" mit 2× berechnet und bepreist (Details oben) — genau
   die Unterscheidung, die dieser Testfall gezielt prüfen sollte.
2. **Wandflächen streichen — die Hauptposition des gesamten Malerfalls, Soll 39,00 m² — fehlt komplett im
   fertigen Entwurf, ebenso die Sockelleisten abkleben (Soll 14,70 lfdm).** Beide waren auf der Karte noch
   angekündigt („4 Positionen" inkl. „Wände streichen 30 m²"), sind im Entwurf aber schlicht nicht mehr
   da. Ein Kunde würde hier ein Angebot fürs Streichen einer Küche bekommen, das die eigentliche
   Wandstreichung — die Position, um die es dem Handwerker überhaupt geht — gar nicht berechnet. Das ist
   damit potenziell noch schwerwiegender als der bekannte „fehlende Preise"-Bug (Punkt 1/5 oben), weil
   dort die Position wenigstens noch sichtbar war, nur ohne Preis — hier verschwindet sie komplett aus
   dem Angebot.

**Für Head of Product Engineering:** (1) Anstrichzahl-Bug siehe oben (Wand-„zweimal" wird offenbar
pauschal auf die Decke übertragen). (2) **Dringend:** bitte nachvollziehen, wie Positionen zwischen Karte
und Entwurf verloren gehen können — hier waren „Wände streichen" und „Sockelleisten abkleben" auf der
Karte noch da (Karte kannte sogar schon eine, wenn auch falsche, Wandflächen-Zahl von 30 m²), sind im
Entwurf aber beide spurlos verschwunden. Das ist ein neues Fehlerbild, unterscheidet sich sowohl von den
bisherigen Phantom-Positionen (erfundene Positionen, die es nicht geben sollte) als auch vom bekannten
„fehlender Preis"-Bug (Punkt 1/5, wo die Position sichtbar blieb) — hier verschwindet eine echte,
korrekt erkannte Position vollständig samt Menge und Preis. Siehe auch neuen „Systemischer Fund" Punkt 8
unten.

**Ursache zu (2) gefunden und behoben (Head of Product Engineering, 2026-08-30):** Whisper hat den Satz
als „**Bände** zweimal streichen" transkribiert — im gespeicherten Transkript nachgelesen, nicht vermutet.
Die schwächste Scope-Regel in `arbeiten-normalisierer.ts` („eine Fläche wurde genannt, die andere nicht")
liest den ROHTEXT: sie fand dort kein Wandwort, wohl aber „Decke", und schloss daraus „nur Decke". Das
schaltet in `maler.ts` sowohl `anWaenden` als auch die davon abhängigen Sockelleisten ab — beide
Positionen verschwanden. Die strukturierte Extraktion hatte es richtig (`arbeiten: ["wände streichen", …]`)
und wurde von der Rohtext-Regel überstimmt.

**Fix:** `RaumScope` trägt jetzt mit, WOHER die Einschränkung kommt (explizit / negation / ausschluss /
erwaehnung). Eine Einschränkung, die nur auf dem Nicht-Erwähnen beruht, darf die strukturierte
Arbeiten-Liste nicht mehr überstimmen. Ausdrückliche Einschränkungen („nur die Decke", „ohne Decke", „die
Wände lassen wir") wiegen unverändert schwerer — PM-001/PM-005 bleiben damit gültig und sind durch eigene
Tests abgesichert. Mit dem ECHTEN Transkript kommen jetzt alle vier Positionen: Wandflächen streichen
39,00 m² (exakt Soll), Deckenfläche 15,12 m², Boden schützen 15,12 m², Sockelleisten abkleben 14,70 lfdm
(exakt Soll). 5 neue Tests, Suite grün (53 Dateien / 899 Tests).

**Grundsätzliches daraus:** Solange Regeln auf dem Rohtranskript über POSITIONEN entscheiden, kann ein
Verhörer von Whisper eine Hauptposition löschen. Diese eine Stelle ist entschärft — es lohnt sich, die
übrigen Rohtext-Regeln daraufhin durchzusehen, bevor echte Nutzer kommen.

**Status:** 🟡 Bug (2) behoben (Wände + Sockelleisten sind wieder da, Live-Nachtest steht aus). Bug (1)
offen: Decke wird trotz „reicht einmal" 2× statt 1× berechnet — die Anstrichzahl gilt offenbar global
statt je Fläche.

**Nachtest (Sandy, 2026-08-30, zusammen mit PM-024 in EIN Angebot gesprochen, zwei getrennte Aufnahmen):**
Karte „🍳Küche 4 Positionen" — Wandflächen streichen 2x (39 m²), **Deckenfläche streichen 1x (15,12 m²)**,
Boden schützen (15,12 m²), Sockelleisten abkleben (14,7 lfdm). Entwurf (566,72 €), Raummaße 3,6×4,2 m,
Höhe 2,5 m, 1 Tür, 2 Fenster:

- Wandflächen streichen 2×: 39 m² × 9,50 € = 370,50 € — ✅ exakt Soll. **Bug (2) live bestätigt behoben** —
  Wandflächen UND Sockelleisten sind jetzt beide da und korrekt.
- Boden schützen: 15,12 m² × 1,20 € = 18,14 € — ✅ exakt Soll
- Sockelleisten abkleben: 14,7 lfdm × 0,80 € = 11,76 € — ✅ exakt Soll
- **Deckenfläche streichen 2×: 15,12 m² × 11,00 € = 166,32 € — weiterhin nicht Soll.** Die Karte zeigte
  gerade noch korrekt „1x" — im Entwurf steht wieder „2x" mit dem entsprechend höheren Preis. **Bug (1) ist
  NICHT behoben**, obwohl er hier auf der Karte bereits richtig aussah.

**Ergebnis:** Bug (2) — die verschwundene Wandfläche — ist jetzt zuverlässig behoben, sauber bestätigt mit
allen vier Positionen exakt Soll bis auf die Decke. Bug (1) — die Anstrichzahl der Decke — besteht dagegen
fort, und zwar mit demselben Muster wie bei PM-024 im selben Angebot: die **Karte zeigt den korrekten,
gefixten Wert („1x"), der Entwurf fällt aber auf den alten, falschen Wert („2x") zurück.** Das ist kein
Zufall mehr, sondern tritt jetzt zweimal im selben Angebot auf (hier bei der Anstrichzahl, bei PM-024 beim
Erschwerniszuschlag/der Phantom-Decke) — die Karte und der Entwurf scheinen unterschiedliche Datenstände
oder Berechnungspfade zu verwenden, wobei der Entwurf (das, was der Kunde am Ende bekommt) der
unzuverlässigere von beiden ist.

**Für Head of Product Engineering:** Bitte prüfen, warum die Anstrichzahl-Korrektur (je Fläche statt
global) zwar in der Karten-Vorschau ankommt, aber nicht in der Entwurfs-Berechnung — siehe dieselbe
Beobachtung bei PM-024 (Erschwerniszuschlag Höhe/Phantom-Deckenfläche) im selben Angebot. Möglicherweise
verwenden Karte und Entwurf zwei getrennte Code-Pfade, von denen nur einer den neuen Fix erhalten hat.

**Status:** 🟡 Bug (2, verschwundene Wandfläche/Sockelleisten) live bestätigt behoben. Bug (1, Decke 2×
statt 1×) weiterhin offen — Karte zeigt korrekt „1x", Entwurf berechnet trotzdem „2x".

**Dritter Nachtest (Sandy, 2026-08-30, zusammen mit PM-023 in EIN Angebot gesprochen, zwei getrennte
Aufnahmen):** Karte „🍳Küche 4 Positionen" — Wandflächen streichen 2x (39 m²), Deckenfläche streichen 1x
(15,12 m²), Boden schützen (15,12 m²), Sockelleisten abkleben (14,7 lfdm). Entwurf (488,10 €), Raummaße
3,6×4,2 m, Höhe 2,5 m, 1 Tür, 2 Fenster:

- Wandflächen streichen 2×: 39 m² × 9,50 € = 370,50 € — ✅ exakt Soll
- **Deckenfläche streichen 1×: 15,12 m² × 7,00 € = 105,84 € — ✅ endlich Soll!** Der Entwurf zeigt jetzt
  tatsächlich „1x", mit einem eigenen, niedrigeren Einmal-Preis (7,00 €/m² statt der bisherigen
  2x-Rate 11,00 €/m²) statt weiterhin auf „2x" zurückzufallen. **Bug (1) ist jetzt live bestätigt
  behoben** — im dritten Anlauf.
- Sockelleisten abkleben: 14,7 lfdm × 0,80 € = 11,76 € — ✅ exakt Soll
- **Aber: Boden schützen: 15,12 m² × 0,00 € — „Preis fehlt in deiner Preisdatenbank"!** Dieselbe
  Preisdatenbank-Regression wie bei PM-024 (siehe „Systemischer Fund" Punkt 11) — diesmal in der Küche,
  nicht im Büro. Bestätigt: das ist kein Einzelfall, sondern reproduziert sich in einem völlig anderen
  Raum/Testfall. „Boden schützen" ist damit aktuell nicht mehr zuverlässig bepreist, unabhängig vom
  konkreten Raum.

**Ergebnis:** Sehr gemischt. Die gute Nachricht: Bug (1) — die Anstrichzahl der Decke — ist jetzt
tatsächlich behoben, mit einer sauberen eigenen 1x-Preiszeile. Die schlechte Nachricht: „Boden schützen"
fehlt hier erneut der Preis, exakt wie bei PM-024 im letzten Nachtest — das ist jetzt zweimal
unabhängig voneinander aufgetreten und bestätigt Punkt 11 als echte, reproduzierbare Regression.

**Status:** ✅ Bug (1, Decke 2×/1×) jetzt live bestätigt behoben. Neuer, bestätigter Fund: „Boden
schützen" fehlt der Preis — zweite unabhängige Bestätigung von Punkt 11 (Preisdatenbank-Regression).

**Vierter Nachtest (Sandy, 2026-08-31, zusammen mit PM-024 in EIN Angebot gesprochen, zwei getrennte
Aufnahmen):** Karte „🍳Küche 4 Positionen" — Wandflächen streichen 2x (39 m²), Deckenfläche streichen 1x
(15,12 m²), Boden schützen (15,12 m²), Sockelleisten abkleben (14,7 lfdm). Entwurf (506,24 €), Raummaße
3,6×4,2 m, Höhe 2,5 m, 1 Tür, 2 Fenster:

- Wandflächen streichen 2×: 39 m² × 9,50 € = 370,50 € — ✅ exakt Soll
- Deckenfläche streichen 1×: 15,12 m² × 7,00 € = 105,84 € — ✅ exakt Soll
- **Boden schützen: 15,12 m² × 1,20 € = 18,14 € — ✅ endlich wieder Soll!** Live bestätigt: derselbe Fix
  wie bei PM-024 (Gewerk-Zuordnung, siehe „Systemischer Fund" Punkt 11) hält auch hier.
- Sockelleisten abkleben: 14,7 lfdm × 0,80 € = 11,76 € — ✅ exakt Soll

**Ergebnis: alle vier Positionen exakt Soll, keine offenen Funde mehr.** Beide ursprünglichen Bugs (Decke
2×/1×, verschwundene Wandfläche) bleiben behoben, und die Preisdatenbank-Regression bei „Boden schützen"
ist jetzt ein zweites Mal unabhängig als behoben bestätigt (siehe auch PM-024 im selben Angebot).
PM-026 ist damit fachlich vollständig abgeschlossen.

**Status:** ✅ Alle vier Positionen live bestätigt exakt Soll, keine offenen Funde mehr.

---

### PM-027 — Kellerraum, Parkett gerade + explizite Altbelag-Entfernung

**Zum Einsprechen:**
„Kellerraum, fünf Meter mal drei Meter, eine Tür normal Maß. Der alte Teppich muss komplett raus, danach
Parkett verlegen, ganz normal gerade, kein Muster.“

**Soll-Lösung:**
- Fläche: 5,00×3,00=**15,00 m²**
- Altbelag entfernen (ausdrücklich verlangt, kein Ausschluss diesmal): **15,00 m²**
- Parkett verlegen, Verschnitt gerade 5%: 15,00×1,05=**15,75 m²**
- **Keine** Sockelleisten-Position (nicht erwähnt)

**Ist-Ergebnis (Sandy, 2026-08-31):** Karte „📦Kellerraum 2 Positionen" — Fertigparkett verlegen inkl. 5%
Verschnitt (15,75 m²), Altbelag entfernen (15 m²). Entwurf, Raummaße 3×5 m:

- Fertigparkett verlegen inkl. 5% Verschnitt: 15,75 m² × 42,00 € = 661,50 € — ✅ exakt Soll
- Altbelag entfernen: 15 m² × 12,00 € = 180,00 € — ✅ exakt Soll
- Keine Sockelleisten-Position — ✅ korrekt, wie erwartet (nicht erwähnt)

**Ergebnis:** Komplett sauber — beide Mengen exakt Soll, keine Phantome, keine fehlenden Positionen, keine
unerwartete Sockelleisten-Position.

**Status:** ✅ Beide Positionen live bestätigt exakt Soll.

---

### PM-028 — Arbeitszimmer, Altbau + explizite Grundierung ohne Spachtel

**Zum Einsprechen:**
„Arbeitszimmer, vier Meter mal drei Meter fünfzig, Höhe zwo fünfzig, ist ein Altbau. Wände bitte
grundieren und dann zweimal streichen. Ein Fenster, Standardmaß, eine Tür, normal.“

**Soll-Lösung:**
- Umfang: 2×(4,00+3,50)=15,00 lfm; Wandbrutto: 15,00×2,50=**37,50 m²**
- Fenster + Tür, beide ≤2,5 m² → VOB: kein Abzug
- Wandflächen streichen 2×: **37,50 m²**
- Voranstrich/Grundierung: **37,50 m²** (ausdrücklich verlangt, unabhängig von Spachtel-Kontext)
- Erschwerniszuschlag Altbau: 1 Pauschale
- Boden schützen: 4,00×3,50=**14,00 m²**
- Sockelleisten abkleben: 15,00−0,90=**14,10 lfdm**
- **Keine** Spachtel-Position (nicht erwähnt)

**Ist-Ergebnis (Sandy, 2026-08-31, zusammen mit PM-029 nacheinander in EIN Angebot gesprochen, zwei
getrennte Aufnahmen):** Karte „💼Arbeitszimmer 4 Positionen" — Voranstrich/Grundierung (37,5 m²),
Wandflächen streichen 2x (37,5 m²), Boden schützen (14 m²), Sockelleisten abkleben (14,1 lfdm).
Zusätzlich „📋Allgemein 1 Position" — Erschwerniszuschlag Altbau. Entwurf Arbeitszimmer (684,33 €),
Raummaße 3,5×4 m, Höhe 2,5 m, 1 Tür, 1 Fenster:

- Voranstrich/Grundierung: 37,5 m² × 6,00 € = 225,00 € — ✅ exakt Soll
- **Wandflächen streichen 2×: 37,5 m² × 11,50 € = 431,25 €.** Menge exakt Soll (37,50 m²), **aber der
  Einzelpreis (11,50 €/m²) ist neu und weicht vom Standard ab.** In jedem bisherigen Test dieser gesamten
  Reihe — auch bei anderen Altbau-Fällen wie PM-011 (36 m² × 9,50 € = 342,00 €) — lag „Wandflächen
  streichen 2x" durchgängig bei **9,50 €/m²**. Auch im selben Angebot bzw. derselben Sitzung (PM-026,
  wenige Nachtests zuvor) war es noch 9,50 €/m². Kein ersichtlicher fachlicher Grund, warum Altbau den
  Grund-Anstrichpreis selbst verändern sollte — dafür gibt es ja gerade den separaten
  Erschwerniszuschlag Altbau. Sieht nach einem eigenständigen, neuen Preisfund aus, nicht nach Absicht.
- Boden schützen: 14 m² × 1,20 € = 16,80 € — ✅ exakt Soll
- Sockelleisten abkleben: 14,1 lfdm × 0,80 € = 11,28 € — ✅ exakt Soll
- Keine Spachtel-Position — ✅ korrekt, wie erwartet (nicht erwähnt)

**Erschwerniszuschlag Altbau (📋Allgemein): 20 % × 8,32 € = 166,40 €.** Der Satz selbst (20 %) ist exakt
der neue Standardsatz für Altbau. Die Bemessungsgrundlage passt aber nicht zu „nur Arbeitszimmer"
(684,33 €, davon 20 % wären 136,87 €) — sie passt stattdessen exakt zum GESAMTEN Angebot inklusive
Abstellraum (684,33 + 147,20 = 831,53 €; 1 % gerundet 8,32 €; × 20 = 166,40 €). Nur das Arbeitszimmer
wurde als Altbau beschrieben, der Abstellraum gar nicht erwähnt — trotzdem fließt seine Fläche mit in die
Bemessungsgrundlage ein. Das passt zu der bereits dokumentierten, bewusst offenen Fachfrage bei PM-024
(Erschwerniszuschläge landen ohne Raumbezug unter „Allgemein" und greifen dann auf die
Gesamt-Angebots-Grundlage zurück, statt auf den einen Raum, auf den sich der Zuschlag eigentlich bezieht)
— hier zum ersten Mal mit echter, spürbarer finanzieller Auswirkung, weil zwei unterschiedlich große
Räume im selben Angebot stecken.

**Ergebnis:** Alle vier eigenen Positionen des Arbeitszimmers sind mengenmäßig exakt Soll, aber zwei
Funde: (1) ein neuer, unbegründeter Preisunterschied bei „Wandflächen streichen 2x" (11,50 € statt der
sonst durchgängigen 9,50 €/m²), und (2) eine weitere, konkrete Bestätigung der offenen Fachfrage zur
Erschwerniszuschlag-Bemessungsgrundlage — hier zieht sie fälschlich (oder zumindest fachlich fragwürdig)
den nicht-Altbau-Abstellraum mit hinein.

**Für Head of Product Engineering:** (1) Bitte prüfen, woher der 11,50-€-Preis für „Wandflächen streichen
2x" in diesem Fall kommt — jeder andere Test, auch andere Altbau-Fälle, nutzt 9,50 €/m². (2) Die
Altbau-Bemessungsgrundlage betrifft dieselbe offene Fachfrage wie bei PM-024 — hier aber mit einem
konkreten Zahlenbeispiel, das zeigt, wie groß der Unterschied ausfallen kann (136,87 € bei raumgenauer
Zuordnung vs. 166,40 € bei Gesamt-Angebot). Vielleicht hilft das, die Fachfrage an Sandy zu konkretisieren.

**Nachtrag (Prüfmeister, nach PM-030):** Konkreter Verdacht zum 11,50-€-Rätsel gefunden. PM-030
(Dachzimmer, gleiche Sitzung) zeigt „Kniestockwände/Dachschrägen streichen 2x" ebenfalls zu **11,50 €/m²**
— und das ist eine eigene, separate Preiszeile, seit dem Matcher-Fix vom 20.08. bewusst getrennt von
„Wandflächen streichen" geführt (siehe „Systemischer Fund" oben). Im PM-007-Archiv-Nachtest vom 25.08. lag
genau diese Kniestock/Dachschräge-Zeile noch bei 11,00 €/m² — der Sprung auf 11,50 € seither ist also
vermutlich eine ganz normale, von Sandy selbst vorgenommene Preisänderung an DIESER Zeile, keine Störung.
Der eigentliche Verdacht: „Wandflächen streichen 2x" beim Arbeitszimmer hier greift versehentlich auf genau
diese Kniestock/Dachschräge-Zeile zu, statt auf die korrekte Wandflächen-Zeile (9,50 €/m²) — zwei
unterschiedliche Positionsarten, die denselben falschen Preis liefern, exakt zur selben Zeit, ist als Zufall
unwahrscheinlich. Bitte den Preis-Matcher für „Wandflächen streichen 2x" im Altbau-Zweig genau darauf prüfen,
ob er hier fälschlich in die Kniestock/Dachschräge-Kategorie rutscht.

**Status:** 🟡 Mengen exakt Soll. Zwei Funde: (1) Wandflächen-Grundpreis weicht ohne ersichtlichen Grund
vom Standard ab (11,50 € statt 9,50 €/m²) — konkreter Verdacht: Verwechslung mit der Kniestock/Dachschräge-
Preiszeile, siehe Nachtrag. (2) Erschwerniszuschlag-Bemessungsgrundlage zieht fälschlich den nicht
betroffenen Abstellraum mit ein — konkretes Beispiel für die offene Fachfrage aus PM-024.

---

### PM-029 — Abstellraum, Mini-Raum ohne jede Öffnung

**Zum Einsprechen:**
„Abstellraum, zwei Meter mal eins Meter achtzig, Höhe zwo vierzig. Wände einmal streichen reicht völlig.
Kein Fenster, keine Tür.“

**Soll-Lösung:**
- Umfang: 2×(2,00+1,80)=7,60 lfm; Wandbrutto: 7,60×2,40=**18,24 m²**
- Kein Fenster, keine Tür → nichts abzuziehen, mit oder ohne VOB
- Wandflächen streichen 1×: **18,24 m²**
- Boden schützen: 2,00×1,80=**3,60 m²**
- Sockelleisten abkleben: **7,60 lfdm** (kein Türabzug, da keine Tür)

**Ist-Ergebnis (Sandy, 2026-08-31, zusammen mit PM-028 nacheinander in EIN Angebot gesprochen):** Karte
„📦Abstellraum 3 Positionen" — Wandflächen streichen 1x (18,24 m²), Boden schützen (3,6 m²), Sockelleisten
abkleben (7,6 lfdm). Entwurf (147,20 €), Raummaße 1,8×2 m, Höhe 2,4 m, 0 Türen, 0 Fenster:

- **Wandflächen streichen 1×: 18,24 m² × 7,50 € = 136,80 € — ✅ Menge exakt Soll.** Erstmaliger Test von
  „Wandflächen 1x" in dieser gesamten Reihe (bisher immer „zweimal" diktiert) — eigener, niedrigerer
  Einzelpreis (7,50 €/m²) als die 2x-Variante (9,50 €/m²), ähnlich wie bei „Deckenfläche 1x" (7,00 €/m²)
  vs. „Deckenfläche 2x" (11,00 €/m²) schon gesehen. Kein Vergleichswert aus früheren Tests vorhanden,
  aber plausibel und rechnerisch korrekt.
- Boden schützen: 3,6 m² × 1,20 € = 4,32 € — ✅ exakt Soll
- Sockelleisten abkleben: 7,6 lfdm × 0,80 € = 6,08 € — ✅ exakt Soll, korrekt ohne Türabzug (kein
  Fenster/keine Tür wurden auch sonst richtig mit 0 übernommen)

**Ergebnis:** Komplett sauber — alle drei Mengen exakt Soll, korrekter Umgang mit dem öffnungslosen
Mini-Raum (0 Türen, 0 Fenster), und die neue „1x"-Wandanstrich-Variante liefert einen eigenen, sinnvollen
Einzelpreis. Kein Zusammenhang mit den beiden Funden bei PM-028 im selben Angebot — dieser Raum selbst ist
sauber.

**Status:** ✅ Alle drei Positionen live bestätigt exakt Soll.

---

### PM-030 — Dachzimmer 2, frischer Dachgeschoss-Fall

**Zum Einsprechen:**
„Dachzimmer, vier Meter fünfzig mal vier Meter. Kniestock ist eins Meter hoch. Die Dachschrägen zusammen
ergeben achtzehn Quadratmeter. Ein Dachfenster drin, normale Größe. Wände, Schrägen und Kniestock alles
zweimal streichen.“

**Soll-Lösung (korrigiert, siehe Korrektur-Hinweis unten):**
- Kniestock-Umfang: 2×(4,50+4,00)=17,00 lfm; Kniestockwände: 17,00×1,00=**17,00 m²**
- Dachschrägen: **18,00 m²** — Dachfenster (0,78×1,18=0,92 m²) liegt unter der VOB-Übermessungsschwelle
  (2,5 m²) und wird deshalb NICHT abgezogen, genau wie jedes andere Fenster/Tür ≤2,5 m² auch nicht
  abgezogen wird (siehe Korrektur-Hinweis unten — ursprünglich hatte ich hier fälschlich 17,08 m² als Soll
  angesetzt)
- Kniestockwände streichen 2×: 17,00 m²; Dachschrägen streichen 2×: 18,00 m²
- Boden schützen: 4,50×4,00=**18,00 m²** (Grundfläche)
- Sockelleisten abkleben: nicht erwähnt — falls automatisch als Nebenleistung ergänzt (wie bei PM-007
  beobachtet), kein hartes Soll für die genaue Länge, nur plausibilisieren

**Korrektur (Prüfmeister, nach Sandys Nachfrage und VOB-Recherche):** Meine ursprüngliche Soll-Lösung war
falsch. Ich hatte die Dachfenster-Standard-Deduktion (0,92 m²) unhinterfragt aus PM-007 übernommen — die
stammt aber von VOR der VOB-Übermessungsregel-Entscheidung (21.08.) und wurde bei genau dieser Entscheidung
als „eigene, andere Ausmessungs-Konvention" bewusst außen vor gelassen, statt geprüft, ob sie noch Sinn
ergibt. Sandy hat zu Recht nachgefragt, ob das nicht der VOB-Regel widerspricht.

**Recherche-Ergebnis:** DIN 18363 (Maler- und Lackierarbeiten, die einschlägige ATV für genau diese
Leistung — Dachschrägen streichen ist eine ganz normale Malerleistung, keine Dachdecker-/Zimmerer-Arbeit)
regelt die Übermessung generisch für „Öffnungen"/„Aussparungen" bis 2,5 m² Einzelgröße, unabhängig davon,
ob eine Leibung mitbehandelt wird — ohne Sonderregel für Dachflächenfenster oder geneigte Flächen. Ein
Dachfenster mit 0,92 m² liegt weit unter dieser Schwelle. Rechtlich/normativ gilt also dieselbe Regel wie
bei jedem Wandfenster: **kein Abzug.**

**Damit ist PM-030s tatsächliches Ergebnis (Dachschrägen = 18,00 m², kein Abzug) korrekt — kein Bug.**
Umgekehrt war die alte PM-007-Soll-Lösung (24,00 → 23,08 m², Dachfenster abgezogen) nach heutigem Stand
der VOB-Entscheidung fachlich überholt; das damalige Ergebnis war zum Zeitpunkt des Tests (vor der
VOB-Entscheidung) konsistent mit der damaligen Sonderregel, ist aber nach der 21.08.-Entscheidung nicht
mehr die korrekte Zielrechnung. Empfehlung an Head of Product Engineering unten.

**Ist-Ergebnis (Sandy, 2026-08-31):** Karte „🏠Dachzimmer 4 Positionen". Entwurf, Raummaße 4×4,5 m,
**Raumhöhe „!"**, 0 Türen, 1 Fenster:

- Kniestockwände streichen 2×: 17 m² × 11,50 € = 195,50 € — ✅ Menge exakt Soll (17,00 m²)
- **Dachschrägen streichen 2×: 18 m² × 11,50 € = 207,00 € — ✅ korrekt, kein Bug** (siehe Korrektur oben:
  kein Dachfenster-Abzug nötig, VOB-Regel greift genau wie bei jedem anderen Fenster ≤2,5 m²)
- Boden schützen: 18 m² × 1,20 € = 21,60 € — ✅ exakt Soll (4,50×4,00=18,00 m²)
- Sockelleisten abkleben: 16,1 lfdm × 0,80 € = 12,88 € — Menge entspricht 17,00 lfm Kniestock-Umfang minus
  0,90 m Türbreite, **obwohl direkt daneben „Türen: 0" steht.** Das ist keine neue Entdeckung: exakt dasselbe
  Zahlenbild (16,1 lfdm bei „Türen: 0") ist schon bei PM-007 dokumentiert und dort als offener, nicht-
  blockierender Fund ins Archiv gewandert. Hier lediglich eine dritte Live-Bestätigung, dass der Fund noch
  nicht behoben ist.
- **Raumhöhe zeigt „!"** statt einer Zahl — ebenfalls keine neue Entdeckung, sondern derselbe, bereits bei
  PM-007 dokumentierte Anzeige-Fund (seit die überflüssige Höhenfrage im Dachgeschoss-Zweig entfällt, hat
  der Raum keinen Höhenwert mehr, aber die Kopfzeile zeigt dafür einen rohen Platzhalter statt z. B. „–").

**Ergebnis:** Kniestockwände, Dachschrägen (nach Korrektur) und Boden schützen sind alle drei exakt/korrekt.
Kein neuer Rechen-Bug bei den Flächen. Es bleibt aber ein echter Handlungsbedarf: der Code trägt vermutlich
noch die alte, separate Dachfenster-Standard-Deduktion (0,92 m²) als eigene Sonderregel, die hier zufällig
nicht mehr gegriffen hat (oder zwischenzeitlich schon entfernt wurde — beides würde zum beobachteten
Ergebnis passen, ich kann von außen nicht unterscheiden, welches der Fall ist). Zusätzlich zwei bereits
bekannte, unveränderte Kleinfunde aus dem PM-007-Archiv (Sockelleisten rechnet mit einer nicht vorhandenen
Tür; Raumhöhe zeigt „!"), hier zum dritten Mal bestätigt, weiterhin offen.

**Für Head of Product Engineering:** (1) Bitte prüfen und ggf. aufräumen: existiert im Code noch die alte
Dachfenster-Standard-Deduktion (0,92 m², aus dem PM-007-Fix vom 16.–17.08., separat von
`berechneOeffnungsabzugVob()`)? Falls ja, bitte entfernen bzw. das Dachfenster in dieselbe zentrale
VOB-Funktion einreihen wie alle anderen Öffnungen — laut DIN 18363 gibt es keine Sonderregel für
Dachflächenfenster, die 2,5-m²-Schwelle gilt generisch. Falls die Sonderregel schon entfernt wurde: bitte
kurz bestätigen, dann ist das hier einfach nur eine schöne, saubere Live-Bestätigung. (2) Bereits bekannt
aus PM-007-Archiv, hier erneut bestätigt: Sockelleisten zieht trotz „Türen: 0" eine Türbreite ab;
Raumhöhe-Anzeige zeigt „!" statt Wert oder „–". (3) Siehe auch den Nachtrag bei PM-028 oben — der
11,50-€/m²-Preis hier für Kniestock/Dachschräge 2x stützt den Verdacht, dass PM-028s „Wandflächen streichen
2x" versehentlich genau diese Preiszeile trifft.

**Status:** 🟡 Flächen (Kniestockwände, Dachschrägen, Boden schützen) alle korrekt — Dachschrägen-Ergebnis
nach Korrektur der Soll-Lösung (Dachfenster ≤2,5 m² braucht laut VOB/DIN 18363 keinen Abzug, siehe oben)
jetzt auch als richtig bestätigt. Zwei bereits bekannte, unveränderte Kleinfunde aus dem PM-007-Archiv
erneut bestätigt
(Sockelleisten-Türabzug trotz „Türen: 0"; Raumhöhe zeigt „!").

---

### PM-031 — Fassade Nordseite, einfacher Fall

**Zum Einsprechen:**
„Fassade an der Nordseite, zehn Meter lang, Wandhöhe fünf Meter. Zwei Fenster drin, jeweils eins zwanzig
mal eins vierzig. Einmal Fassadenfarbe drauf.“

**Soll-Lösung:**
- Wandbrutto: 10,00×5,00=**50,00 m²**
- 2 Fenster à 1,20×1,40=1,68 m², jedes einzeln ≤2,5 m² → VOB: kein Abzug
- Fassadenfläche streichen 1×: **50,00 m²**
- **Keine** Grundierung (nicht verlangt), keine Boden-/Deckenposition (Fassade)
- Nachtrag: Wandhöhe 5 m liegt über 3 m — nach dem neuen Standardsatz (siehe „Erledigung PM-008/PM-015 und
  PM-011") ist ein automatischer „Erschwerniszuschlag Raumhöhe > 3m" (15 %, Vorschlag) hier plausibel, auch
  wenn in der ursprünglichen Soll-Lösung nicht mit aufgeführt

**Ist-Ergebnis (Sandy, 2026-08-31):** Karte „🏠Fassade 2 Positionen". Chip „Wand / Fassade", Wandlänge
10 m, Wandhöhe 5 m, 0 Türen, 2 Fenster. „So gerechnet: 10,00 m × 5,00 m − 2 Fenster (3,36 m²) = 46,64 m²".

- **Fassadenfläche streichen 1×: 50 m² × 9,00 € = 450,00 € — ✅ Menge exakt Soll.** Die tatsächlich
  abgerechnete Fläche ist korrekt die vollen 50,00 m² (kein Fensterabzug, VOB-Regel korrekt angewendet: 2
  Fenster à 1,68 m², jedes ≤2,5 m²).
- **Aber die „So gerechnet"-Zeile direkt daneben zeigt eine andere, falsche Rechnung: „10,00 m × 5,00 m −
  2 Fenster (3,36 m²) = 46,64 m²".** Diese Erklärzeile zieht die beiden Fenster ab (VOB-widrig) UND
  widerspricht der tatsächlich berechneten und berechneten Position direkt darüber (50,00 m² vs. hier
  behauptete 46,64 m²). Zwei verschiedene Zahlen für dieselbe Fläche im selben Bildschirm — die Abrechnung
  selbst ist richtig, nur der erklärende Text daneben ist es nicht.
- Erschwerniszuschlag Raumhöhe > 3m (Vorschlag), Karte zeigt „Satz aus Preisliste": 15 % × 4,50 € =
  67,50 € — ✅ rechnerisch korrekt (Bemessungsgrundlage = die einzige andere Fassade-Position, 450,00 €;
  1 % davon gerundet 4,50 €; 15 × 4,50 = 67,50 €). Zusätzlich eine schöne, positive Bestätigung: die Karte
  zeigt hier korrekt „Satz aus Preisliste" statt einer erfundenen Zahl — der Fix aus der „Fix-Notiz PM-024"
  (Karte kann den %-Satz vor der Bepreisung noch nicht kennen) wirkt nachweislich auch bei einem
  Fassaden-Objekt, nicht nur bei normalen Räumen.

**Ergebnis:** Die tatsächlich berechnete und bepreiste Fassadenfläche ist exakt Soll (50,00 m², VOB-Regel
korrekt angewendet, kein Fensterabzug), und der neue Erschwerniszuschlag (Wandhöhe > 3m) rechnet richtig
und zeigt jetzt korrekt „Satz aus Preisliste" statt einer falschen Zahl. Ein eigenständiger, neuer Fund:
die „So gerechnet"-Erklärzeile unter dem Chip zeigt eine andere, VOB-widrige Rechnung, die weder zur
tatsächlichen Abrechnung noch zur VOB-Regel passt — rein kosmetisch/erklärend, ohne finanzielle Auswirkung,
aber verwirrend, weil zwei widersprüchliche Zahlen nebeneinanderstehen.

**Für Head of Product Engineering:** (1) NEU: Die „So gerechnet"-Erklärzeile im Fassaden-Chip rechnet den
Fensterabzug fälschlich mit rein (46,64 m² statt der korrekt abgerechneten 50,00 m²) — widerspricht sowohl
der VOB-Regel als auch der Position direkt darüber. Bitte die Erklärzeile an die tatsächliche (korrekte)
Berechnung angleichen. (2) Positiv: „Satz aus Preisliste" statt einer Zahl funktioniert hier auch bei
Fassaden-Objekten — die PM-024-Fix-Notiz greift also breiter als nur beim ursprünglich gemeldeten Fall.

**Status:** 🟡 Fassadenfläche + Erschwerniszuschlag beide rechnerisch/preislich exakt Soll. Ein neuer,
rein kosmetischer Fund: „So gerechnet"-Erklärzeile zeigt eine falsche, VOB-widrige Rechnung, die der
tatsächlichen (korrekten) Abrechnung widerspricht.

---

## Erledigung PM-008/PM-015 und PM-011 (Head of Product Engineering, 2026-08-31)

**PM-008/PM-015 — Einheitenfrage entschieden und umgesetzt.** Sandys
Entscheidung: Prozent, der Katalog ist die Referenz. Umgesetzt, und dabei ein
zweiter, bis dahin unbekannter Grund für die 0,00 € gefunden: die vier
Ersatz-Katalogeinträge mit Einheit „Pauschale" (angelegt am 20.08. in
`default-prices.ts`) sind nie in eine echte Betriebs-Preisdatenbank gelangt —
es gab keine Migration dazu, und beide bestehenden Konten sind älter. Die
Position hätte also auch mit passender Einheit keinen Preis gefunden. Beides
ist jetzt behoben; beide Konten führen die fünf Maler-Zuschläge mit Einheit
„%".

Wie der Prozentsatz zu Geld wird: Bemessungsgrundlage sind die Leistungen
genau des Raums, auf den sich der Zuschlag bezieht (bei
„Erschwerniszuschlag Raumhöhe > 3m — Büro" also die Büro-Positionen), sonst
die des ganzen Angebots. Ein Zuschlag zählt nie in die Grundlage eines
anderen. Im Angebot steht die Position als Menge = Prozentsatz, Einheit = %,
Einzelpreis = Euro je Prozentpunkt, Gesamt = beides multipliziert; der
Rechenweg nennt die Grundlage im Klartext („15 % auf 547,20 € (Leistungen
Büro)"). Ohne Katalogpreis bleibt es wie bei jeder anderen Position beim
sichtbaren „Preis fehlt" — ein Satz wird nie erfunden.

**Bitte an den Prüfmeister:** eigene Soll-Lösungen ab sofort mit Prozent statt
Pauschale führen. Sätze im Standardkatalog: Raumhöhe > 3m 15 %, Altbau 20 %,
Denkmalschutz 30 %, bewohnt 10 %, schwieriger Untergrund 10 % (an die
vorhandenen VOB-Einträge angelehnt; die Zahlen selbst kann Sandy jederzeit
ändern, sie stehen wie jeder andere Preis im Konto).

**PM-011 — Doppel-Erschwernis geklärt.** Sandy: „Ja, können gleichzeitig
kommen." Der Code hat das ohnehin nie verhindert (zwei unabhängige
Prüfungen); jetzt hält ein Test fest, dass „schwieriger Untergrund" und
„Altbau" nebeneinander neben einer Q2-Spachtelung stehen dürfen. Kein Fix
nötig, Frage geschlossen.

---

## Fix-Notiz PM-024 — Karte zeigte „1 %" statt „15 %" (Head of Product Engineering, 2026-08-31)

**Auftrag:** Sandy, direkt („pm024 fixen") — auf deinen Fund aus dem vierten
Nachtest.

**Deine Vermutung war nah dran, aber die Ursache ist eine andere.** Es ist
kein alter Default-Wert und keine zweite, veraltete Berechnung in der
Karten-Vorschau. Der Grund ist grundsätzlicher: Bei einem Prozent-Zuschlag ist
die „Menge" der **Prozentsatz** — und der steht in der Preisliste des
Betriebs, nicht im Transkript. Die Karten-Vorschau läuft aber VOR der
Bepreisung; sie kennt die Preisliste zu dem Zeitpunkt überhaupt nicht. Sie
konnte den Satz also nicht kennen, sondern trug eine 1 als Platzhalter, den
erst die Bepreisung durch den echten Katalogwert ersetzt. Der Entwurf hatte
damit nie einen falschen Wert — die Karte hatte einen erfundenen.

**Fix:** Die Karte zeigt für Prozent-Zuschläge keine Zahl mehr, sondern
„Satz aus Preisliste". Damit steht dort, was stimmt: die Position ist erkannt,
der Prozentsatz kommt aus dem eigenen Katalog des Betriebs. Dieselbe Linie wie
bei den Fassadenmaßen im PM-008-Fix („zeigt ehrlich GAR KEINE Maße statt
falscher; besser nichts als Falsches") — statt eine Zahl zu zeigen, die nur
zufällig manchmal stimmt.

**Bewusst NICHT gemacht:** die Preisliste in die Vorschau nachladen, damit dort
schon „15 %" steht. Das würde die schnelle Karte von einer Datenbankabfrage
abhängig machen und genau das Muster wiederholen, das in „Systemischer Fund"
Punkt 8/10 steht (Karte und Entwurf rechnen unabhängig und laufen auseinander).
Solange die Karte nichts behauptet, kann sie dem Entwurf auch nicht
widersprechen.

**Mit gegengerechnet:** deine Soll-Zahlen aus dem vierten Nachtest stehen jetzt
als Test im Code — 547,20 + 24,00 + 13,68 = 584,88 € Bemessungsgrundlage,
1 % gerundet 5,85 €, × 15 = **87,75 €**. Ein Test hält zusätzlich fest, dass
die Platzhalter-1 den fertigen Entwurf nie erreichen darf.

**Ein Restfall, den ich offen lasse und benenne:** Hat ein Betrieb den Zuschlag
aus seiner eigenen Preisliste gelöscht, findet die Bepreisung keinen Satz —
dann bleibt die Platzhalter-1 stehen und die Position steht als „1 % · 0,00 €"
mit dem üblichen Hinweis „Preis fehlt in deiner Preisdatenbank" da. Das ist der
gleiche sichtbare Zustand wie bei jeder anderen Position ohne Preis, und beide
echten Konten haben den Eintrag seit heute. Eine 0 statt der 1 wäre keine
Verbesserung: die Angebotsprüfung meldet dann „Menge ist 0 — bitte prüfen" bei
einer Position, an der nichts zu prüfen ist.

**Bitte um fünften Nachtest:** derselbe PM-024-Text. Erwartung auf der Karte:
„Erschwerniszuschlag Raumhöhe > 3m" mit dem Hinweis „Satz aus Preisliste"
statt einer Zahl; im Entwurf unverändert 15 % × 5,85 € = 87,75 €.

**Nebenbefund, nicht Teil dieses Fixes:** Die Entwurfs-Seite hat sechs
vorbestehende Lint-Fehler „Cannot access refs during render" (React liest dort
einen Ref während des Renderns). Nicht von diesem Fix verursacht, aber eine
echte Fehlerquelle für genau die Art von „Karte zeigt was anderes als der
Entwurf"-Effekte. Ich melde das dem Chief of Staff als eigenen Punkt, statt es
hier stillschweigend mitzuändern.

---

## Organigramm-Änderung (Chief of Staff, 2026-09-01)

Neue Position: **Head of Legal & Compliance**, seit 01.09.2026 — auf Sandys
dringende Anfrage eingerichtet. Deckt zwei Bereiche ab: (A) SaaS-/
Digitalrecht (Datenschutz, AGB, KI-Kennzeichnungspflichten) und (B) Gewerke-/
Baurecht für die Angebotserstellung (VOB/DIN, Zuschläge/Abzüge). Volle
Rollenbeschreibung: `docs/team-organigramm.md`, Koordination läuft über
`docs/chief-of-staff-legal-todos.md` (ID-Schema CoS-L-XXX).

Relevant für dich: Legal prüft aktuell die bestehende Zuschlags-/Abzugs-
Logik und die VOB-Übermessungsregel (Abschnitt „VOB-Übermessungsregel für
Anstricharbeiten" in dieser Datei) rechtlich gegen VOB/branchenübliche
Praxis — deckt sich mit Themen, die du fachlich schon dokumentiert hast.
Falls Legal dazu Rückfragen hat, kommen die über den Chief of Staff — noch
kein eigener direkter Austausch-Kanal, wird bei Bedarf ergänzt.

---

## Hinweis vom Head of Legal & Compliance (2026-09-01) — neue Datei `docs/vob-angebot-abstimmung.md`

Sandy hat gebeten, das VOB-Thema und die Angebotserstellung lückenlos
durchzuprüfen. Dafür gibt es jetzt eine eigene Abstimmungsdatei:
**`docs/vob-angebot-abstimmung.md`** (Legal ↔ Prüfmeister ↔ Head of Product
Engineering ↔ Product Designer, ID-Schema VOB-XXX).

**Abgrenzung zu dieser Datei hier:** Du prüfst, ob das Tool rechnet, was du
gesagt hast (Ist gegen Soll). Die neue Datei prüft eine Ebene darunter, ob das
**Soll selbst** der Abrechnungsnorm entspricht. Ein Fall kann hier grün sein
und dort trotzdem rot.

**Zwei Dinge, die dich unmittelbar betreffen:**

**1. Bitte den Leibungs-Punkt NICHT umsetzen (VOB-003).** Unter
„VOB-Übermessungsregel für Anstricharbeiten — Entscheidung & Umsetzung
(2026-08-21)", Abschnitt „Was bewusst NICHT angefasst wurde", Punkt 3, steht
als zurückgestellte Verfeinerung, dass Leibungen übermessener Öffnungen nicht
separat vergütet werden dürften. Nach meiner Recherche ist die Regel **genau
umgekehrt**: DIN 18363 Abschnitt 5.2.3 (Fassung 2019) sagt, dass Leibungen und
beschichtete Rückflächen von Nischen „unabhängig von ihrer Einzelgröße
gesondert gerechnet" werden — also gerade auch dann, wenn die Öffnung
übermessen wurde. `maler.ts` macht das heute schon so und liegt damit
vermutlich richtig; die geplante Verfeinerung würde korrektes Verhalten
kaputtmachen und dem Handwerker Geld wegnehmen.

Mein Vorbehalt dazu steht in der neuen Datei: ich arbeite mit Sekundärquellen,
nicht mit dem Originaltext. Deshalb: nicht umsetzen, als „strittig, siehe
VOB-003" markieren, ich löse es auf, sobald wir die Norm haben (VOB-011).

**2. Sieben Fragen an dich**, gesammelt am Ende der neuen Datei unter „Offene
Fragen an den Prüfmeister". Kurz zusammengefasst: Verschnitt als sichtbare
Menge üblich? Fensterleibungen mit abgerechnet? „Boden abdecken" als eigene
Position üblich? Ab welcher Raumhöhe Zuschlag? Türen/Fenster nach Stück? Bei
Sockelleisten Türbreiten abziehen oder durchmessen? Und: fehlt dem Produkt eine
Abrechnungsregel, die du aus der Praxis kennst?

Ich brauche für jede davon deine **Praxis**-Sicht, nicht die Norm — die habe
ich. Wo Praxis und Norm auseinandergehen, ist das eine bewusste Entscheidung,
und die kann man nur treffen, wenn beide Seiten auf dem Tisch liegen.

**Unterstützung für zwei deiner Funde:** PM-031 („So gerechnet"-Zeile zeigt
eine VOB-widrige Rechnung, die der abgerechneten Position widerspricht) hast du
als kosmetisch eingeordnet — für die Abrechnung stimmt das, rechtlich nicht:
zwei widersprüchliche Zahlen für dieselbe Fläche sind im Streitfall der Beleg
dafür, dass die höhere nicht plausibel erklärt ist. Und PM-007
(„Sockelleisten-Türabzug trotz ‚Türen: 0'") könnte dieselbe Codestelle
betreffen wie VOB-012 — wer das eine anfasst, sollte das andere mitnehmen.

Danke im Übrigen für `pruefmeister-testfaelle.md`. Ohne die dokumentierten
Soll-Lösungen hätte ich nicht unterscheiden können, was Absicht ist und was
Zufall — die halbe Prüfung wäre nicht möglich gewesen.

---

## Sammel-Information an den Prüfmeister (Head of Product Engineering, 2026-09-01)

Sandys Auftrag: „informiere den Prüfmeister über alles." Seit deinem letzten
Nachtest (31.08.) hat sich genug geändert, dass mehrere deiner Soll-Lösungen
nicht mehr stimmen. Bitte einmal ganz lesen, bevor du den nächsten Fall
rechnest.

### 1. Erschwerniszuschläge rechnen in PROZENT, nicht mehr als Pauschale

Sandys Entscheidung vom 31.08. (PM-008/PM-015). Bemessungsgrundlage sind die
Leistungen **genau des Raums**, auf den sich der Zuschlag bezieht; ohne
Raumbezug die des ganzen Angebots. Ein Zuschlag zählt nie in die Grundlage
eines anderen. Darstellung im Angebot: Menge = Prozentsatz, Einheit = %,
Einzelpreis = Euro je Prozentpunkt, Gesamt = beides multipliziert.

Standardsätze im Katalog: Raumhöhe > 3m **15 %**, Altbau **20 %**,
Denkmalschutz **30 %**, bewohnt **10 %**, schwieriger Untergrund **10 %**.

**Neu seit heute (VOB-010, Fund von Head of Legal):** Dieselbe Umstellung für
**14 weitere Katalogeinträge über 10 Gewerke**, bei denen der Prozentsatz im
Titel stand, die Einheit aber „Pauschale" war und der Preis die Prozentzahl
als Euro trug — z. B. „Zuschlag Wochenend- / Feiertagsarbeit (25%)" = 25,00 €
statt 25 % der Leistung. Falls du solche Zuschläge in einem Soll führst:
ab jetzt Prozent.

### 2. Die Preisdatenbank war nicht der Katalog, den der Code kennt

Beim Deckungsaudit am 31.08. kam heraus: Positionen sind über Monate in den
Code-Katalog gewandert, ohne dass eine Migration sie in die BESTEHENDEN Konten
nachgezogen hätte. Im Maler-Bereich fehlten 46 Positionen, bei Boden weitere —
darunter **„Dachschrägen streichen 1x/2x/3x"** und **„Kniestockwände streichen
1x/2x/3x"**, also genau die Positionen aus PM-007.

**Für dich heißt das:** Jedes „Preis fehlt / 0,00 €" aus deinen Nachtests vor
dem 31.08. ist als Befund überholt, solange es nicht erneut auftritt. Maler,
Boden und Allgemein sind live nachgezogen.

### 3. Bezeichnungen, die sich geändert haben — bitte im Soll mitziehen

| bisher | ab jetzt | Grund |
|---|---|---|
| „Dachschräge streichen — 2× Anstrich" | **Dachschrägen streichen 2x** | dritte Schreibweise derselben Leistung, fand keinen Katalogpreis; der Teil nach dem „ — " wurde außerdem als Raumname gelesen |
| „Türzargen lackieren" | **Türzarge lackieren** | Katalogeintrag steht im Singular, Plural fand ihn nicht |
| „Sockelleisten abkleben" (Stück, im Türen-Lackier-Pfad) | **Türrahmen abkleben** (Stück) | Sockelleisten werden in lfdm abgeklebt; gemeint war das Abkleben um die Tür |
| „Fenster Lack (2× Anstrich)" | **Fenster lackieren (Lack, 2× Anstrich)** | kein Katalogtreffer, holpriges Deutsch im Angebot |
| „Dachschräge spachteln / Untergrundvorbereitung" | **Dachschrägen spachteln** | kein Katalogzwilling |

**Neu im Katalog** (vorher standen diese Positionen immer auf 0,00 €):
Türen/Fenster/Heizkörper abschleifen und grundieren, Türen lackieren
(2× Anstrich), Fenster lackieren (2× Anstrich), Dachschrägen spachteln,
Versiegelung 1./2./3. Gang. Die Sätze sind an vorhandene Katalogzeilen
angelehnt; zwei Versiegelungs-Gänge ergeben zusammen exakt die 18 €/m² des
bestehenden Eintrags „Parkett versiegeln (Lack, 2-lagig)".

### 4. Fünf Rechenfehler behoben — diese Fälle bitte neu einsprechen

Ich habe deine Soll-Lösungen als Test hinterlegt und alles durchgerechnet.
Fünf Fälle fielen durch:

- **PM-005:** Die komplette **Wandfläche der Küche verschwand**. „Speisekammer
  nur die Decke" wurde auf die Küche mitangewendet — Wandflächen UND
  Sockelleisten fielen aus dem Angebot. Ursache: ein Muster traf die
  umlautlose Schreibweise nicht.
- **PM-009:** „Übergangsschiene **4 Stück**" statt 1 — die Stückzahl-Suche
  nahm das Raummaß aus „Flur, vier mal eins achtzig".
- **PM-025:** Fischgrät bekam **5 % statt 15 %** Verschnitt (14,7 statt
  16,10 m²).
- **PM-030:** **Gar keine Dachschrägen-Position** — und die
  Vollständigkeitsprüfung füllte die Lücke mit der Fläche des Kniestocks
  (17 statt 17,08 m²).
- **Dachfenster-Abzug:** Zwei Wege durch denselben Dachgeschoss-Fall zogen das
  Dachfenster unterschiedlich ab.

**PM-024:** Dein letzter offener Punkt („Karte zeigt 1 % statt 15 %") ist
behoben. Die Karte zeigt für Prozent-Zuschläge jetzt **„Satz aus Preisliste"**
statt einer Zahl — der Prozentsatz steht in der Preisliste des Betriebs, die
Vorschau kennt sie vor der Bepreisung nicht und soll deshalb nichts
behaupten. Im Entwurf unverändert 15 % × 5,85 € = 87,75 €.

### 5. Was ich von dir brauche: sechs Soll-Lösungen sind mehrdeutig

Der neue Test deckt **22 deiner 28 Fälle** ab. Sechs fehlen, weil ich das Soll
nicht eindeutig ablesen kann und nichts erfinden wollte:

- **PM-002** — Akzentwand: kurze (9,10 m²) oder lange Seite (10,40 m²)? Ohne
  Festlegung ist auch „Restwände streichen" nicht bestimmt.
- **PM-006** — Soll sagt 26,91 m² (nur Tür abgezogen). Nach Sandys
  VOB-Entscheidung vom 21.08. ist die Tür mit 1,89 m² ≤ 2,5 m² aber ebenfalls
  nicht abzuziehen → 28,80 m². PM-006 fehlt in deiner Liste der acht
  nachkorrigierten Fälle. Welche Zahl gilt?
- **PM-010** — „Sockelleisten streichen": 13,00 lfm oder mit Türabzug
  12,10 lfdm? Im Soll ausdrücklich offen gelassen.
- **PM-011, PM-013, PM-018** — hier brauche ich die Raumdaten so, wie die
  Extraktion sie liefern muss (Öffnungen, Höhen); aus dem Soll allein kann ich
  sie nur raten.

Sobald diese sechs eindeutig sind, nehme ich sie in denselben Test auf. Dann
sind alle 28 Fälle maschinell abgesichert.

### 6. Bitte NICHT weiterverfolgen: der Leibungs-Punkt (VOB-003)

Dein Backlog-Punkt „Leibungen bei übermessenen Öffnungen nicht separat
berechnen" ist laut der DIN-Recherche von Head of Legal **falsch herum** — die
Norm verlangt das Gegenteil, und der Code macht es bereits richtig. Bitte
liegen lassen, bis die Normtexte gekauft sind (Sandy hat den Kauf freigegeben).
Dasselbe gilt für **VOB-012** (Türbreiten von der Sockelleistenlänge
abziehen): Der Code zieht ab, die Norm sagt möglicherweise „bis 1 m
durchmessen". Beides ändert Geld — ich baue da nichts auf unsicherer
Quellenlage.

**Offen bei Sandy, betrifft deine Soll-Lösungen:** die Höhenschwelle für den
Zuschlag. Es gibt derzeit **fünf** verschiedene im Produkt (Code 3,00 m;
Katalog 2,80 und 4,00 bei Maler, 3,25 und 4,50 bei Trockenbau, 3,00 bei Putz).
Bis das entschieden ist, gilt für deine Rechnungen die Code-Schwelle: **> 3,00 m**.

---

---

## Soll-Lösungen für die sechs offenen Fälle (Prüfmeister, 2026-09-02)

Antwort auf Punkt 5 deiner Liste. Damit sind alle 28 Fälle eindeutig. Vier
Grundregeln vorweg, sie gelten für alle sechs — und sie überschreiben, wo nötig,
Zahlen, die ich selbst früher geschrieben habe:

1. **VOB-Übermessung gilt überall.** Standardfenster 1,20 m² (1,20 × 1,00) und
   Standardtür 1,89 m² (0,90 × 2,10) liegen beide unter 2,5 m² und werden
   **nicht** abgezogen. Jede alte Soll-Zahl mit Öffnungsabzug ist überholt —
   nicht nur bei PM-006, sondern auch bei PM-002, PM-010, PM-011, PM-013 (Flur)
   und PM-018. Das war mein Fehler, nicht deiner: ich habe am 21.08. nur die
   Golden-Tests nachziehen lassen und nicht meine eigenen Soll-Texte.
2. **Sockelleisten:** Türbreite 0,90 m wird abgezogen — Stand heute, so wie der
   Code es macht. **VOB-012 stellt genau das infrage.** Jede davon betroffene
   Zeile ist unten mit `[VOB-012]` markiert. Entscheidet Sandy dort auf
   „durchmessen", ändern sich ausschließlich diese Zeilen auf den vollen Umfang
   — sonst nichts. Bis dahin ist die abgezogene Zahl das Soll.
3. **Erschwerniszuschläge in Prozent.** Ich lege im Soll nur Prozentsatz und
   Bemessungsgrundlage fest, **keinen Euro-Betrag** — der hängt an der
   Preisliste des Betriebs. Menge = Prozentsatz, Einheit = %, Grundlage = Summe
   der echten Leistungen desselben Raums.
4. **Höhenschwelle > 3,00 m**, wie von dir vorgegeben, bis Sandy entscheidet.

---

### PM-002 — Akzentwand: **kurze Seite, 9,10 m²**

Raumdaten: 4,00 × 3,50 m, Höhe 2,60 m, 1 Fenster (1,20 × 1,00), 1 Tür
(0,90 × 2,10).

**Die Festlegung:** Akzentwand = **kürzere Raumseite, 3,50 m × 2,60 m =
9,10 m².** Begründung: Aus „die Wand hinterm Bett" kommt kein Signal, welche
Wand gemeint ist — das Tool rät. Wenn es rät, dann zur kleineren Fläche, weil
der Annahme-Text es ansagt und der Handwerker es in zwei Sekunden korrigiert;
zu viel Tapete auf dem Angebot fällt ihm dagegen erst beim Kunden auf. Der
Golden-Test PM-002a rechnet mit 29,90 m² Restwand, das ist genau diese Variante
— gelebter Stand und Soll stimmen also schon überein.

| Position | Soll-Menge |
|---|---|
| Wandbrutto (Zwischenwert) | 15,00 lfm × 2,60 = **39,00 m²**, keine Öffnungsabzüge |
| Akzentwand Vliestapete | **9,10 m²** |
| Restwände streichen 2× | 39,00 − 9,10 = **29,90 m²** |
| Deckenfläche streichen 2× | **14,00 m²** |
| Klick-Vinyl verlegen, diagonal | 14,00 × 1,15 = **16,10 m²** |
| Trittschalldämmung | **14,00 m²** — Raumfläche ohne Verschnitt, die Dämmung wird stumpf gestoßen |
| Sockelleisten montieren (Boden) | 15,00 − 0,90 = **14,10 lfdm** `[VOB-012]` |

**Was NICHT kommen darf:** „Sockelleisten streichen" (ausdrücklich „nicht
gestrichen, nur montiert"), „Sockelleisten abkleben" (die Leisten sind beim
Streichen noch gar nicht dran), „Boden schützen" (der Boden fliegt im selben
Auftrag raus — Abdecken wäre bezahlter Unsinn).

---

### PM-006 — es gilt **28,80 m²**

Raumdaten: 3,00 × 3,00 m, Höhe 2,40 m, Altbau, 1 Fenster 0,50 × 0,60 = 0,30 m²,
1 Tür Standardannahme (0,90 × 2,10).

Beide Öffnungen liegen unter 2,5 m², also wird **keine** abgezogen. 26,91 m²
(nur Tür abgezogen) war die Zahl vor Sandys Entscheidung, 26,61 m² war der
damalige Ist-Fehler. Beide sind tot.

| Position | Soll-Menge |
|---|---|
| Wandflächen streichen 2× | 12,00 lfm × 2,40 = **28,80 m²** |
| Deckenfläche streichen 2× | **9,00 m²** |
| Boden schützen | **9,00 m²** |
| Sockelleisten abkleben | 12,00 − 0,90 = **11,10 lfdm** `[VOB-012]` |
| Erschwerniszuschlag Altbau | **20 %**, Grundlage = die vier Positionen oben |

In den Annahmen der Wandposition muss der Übermessungshinweis stehen:
**2 Öffnungen (2,19 m²) nicht abgezogen.** Kein zweiter Erschwerniszuschlag —
im Text steht „sonst nix Besonderes".

---

### PM-010 — „Sockelleisten streichen": **12,10 lfdm**

Raumdaten: 3,50 × 3,00 m, Höhe 2,60 m, Standardannahme 1 Tür, 1 Fenster.
(Der „350 m"-Extraktionsfehler ist ein eigener Fund und darf im Test nicht
mitgeprüft werden — der Test startet mit den bereinigten Maßen.)

Die Antwort auf deine Frage: **dieselbe Länge wie die montierte Leiste.** Man
streicht genau die Leisten, die man vorher angeschraubt hat — zwei
verschiedene Längen für dasselbe Bauteil im selben Angebot wären der Fehler,
den ein Kunde als Erstes findet. Solange der Türabzug gilt, gilt er für alle
drei Sockelleisten-Zeilen gemeinsam.

| Position | Soll-Menge |
|---|---|
| Wandflächen streichen 2× | 13,00 lfm × 2,60 = **33,80 m²** |
| Deckenfläche streichen 2× | **10,50 m²** |
| Boden schützen | **10,50 m²** (Boden bleibt liegen, Schutz ist hier richtig) |
| Sockelleisten entfernen (Boden) | **12,10 lfdm** `[VOB-012]` |
| Sockelleisten montieren (Boden) | **12,10 lfdm** `[VOB-012]` |
| Sockelleisten streichen (Maler) | **12,10 lfdm** `[VOB-012]` |

**Was NICHT kommen darf:** „Sockelleisten abkleben" — man klebt keine Leiste
ab, die man selbst streicht. Und weiterhin keine Bodenbelag- oder
Altbelag-Position (der alte Phantom-Fund).

---

### PM-011 — Raumdaten und die Doppel-Erschwernis

**So muss die Extraktion den Raum liefern:** `laenge: 4.00`, `breite: 3.20`,
`hoehe: 2.50`, `fenster: 1` (1,20 × 1,00), `tueren: 1` (0,90 × 2,10),
Altbau erkannt, Spachtelqualität **Q2**, Sockelleisten nur abkleben.

| Position | Soll-Menge |
|---|---|
| Wandfläche (Zwischenwert) | 14,40 lfm × 2,50 = **36,00 m²**, keine Abzüge |
| Vollflächenspachtelung **Q2** | **36,00 m²** — m²-Position, nie Stückzahl |
| Wandflächen streichen 2× | **36,00 m²** |
| Sockelleisten abkleben | 14,40 − 0,90 = **13,50 lfdm** `[VOB-012]` |
| Boden schützen | **12,80 m²** |
| Erschwerniszuschlag Altbau | **20 %**, Grundlage = die Positionen dieses Raums |

**Und hier die Entscheidung zur offenen Doppel-Erschwernis-Frage aus dem
Nachtest vom 25.08.:** Der „Erschwerniszuschlag schwieriger Untergrund" darf
**nicht** kommen. Die Unebenheit ist die Q2-Vollflächenspachtelung — sie steht
schon als eigene, bepreiste Position im Angebot. Ein Untergrund-Zuschlag
daneben kassiert dieselbe Erschwernis zweimal, und das ist genau der Punkt, an
dem ein Kunde zu Recht laut wird.

**Als allgemeine Regel, nicht nur für diesen Fall:** *Steht im selben Raum eine
Vollflächenspachtelung (Q2 bis Q4), wird „Erschwerniszuschlag schwieriger
Untergrund" nicht automatisch gesetzt.* Der Altbau-Zuschlag bleibt — der zahlt
nicht die Wand, sondern die Baustelle drumherum (enge Treppe, Schutz, Bestand).

Keine Grundierung, keine Deckenposition.

---

### PM-013 — Fischgrät **15 %**, kein Korridor mehr

Mein alter Soll ließ 10–15 % offen. Für einen Test taugt das nicht, und seit
dem PM-025-Fix rechnet die Engine bei Musterverlegung fest 15 %. Also:

**Wohnzimmer — nur Boden.** Extraktion: `laenge: 8.00`, `breite: 4.50`,
Belag Eichenparkett, Verlegemuster Fischgrät, Dehnungsfuge verlangt, keine
Öffnungen, keine Höhe nötig.

| Position | Soll-Menge |
|---|---|
| Parkett Fischgrät verlegen | 36,00 × 1,15 = **41,40 m²** |
| Dehnungsfuge | **1** (eigene Position, Preis darf fehlen) |

Keine Trittschalldämmung, keine Sockelleisten, **keine** Wand- oder
Deckenposition.

**Flur — nur Maler.** Extraktion: `laenge: 5.00`, `breite: 1.80`,
`hoehe: 2.60`, `fenster: 0`, `tueren: 1` (0,90 × 2,10).

| Position | Soll-Menge |
|---|---|
| Wandflächen streichen 2× | 13,60 lfm × 2,60 = **35,36 m²** (Tür 1,89 m² nicht abgezogen) |
| Deckenfläche streichen 2× | **9,00 m²** |
| Boden schützen | **9,00 m²** |
| Sockelleisten abkleben | 13,60 − 0,90 = **12,70 lfdm** `[VOB-012]` |

Übermessungshinweis: **1 Öffnung (1,89 m²) nicht abgezogen.** Und weiterhin
**keine** Boden-Position im Flur, obwohl das Wort „Boden" im Satz steht.

---

### PM-018 — Raumdaten und acht Positionen

**So muss die Extraktion den Raum liefern:** `laenge: 4.00`, `breite: 3.50`,
`hoehe: 2.60`, `fenster: 1` (1,20 × 1,00), `tueren: 1` (0,90 × 2,10),
Spachtelqualität **Q3**, Grundierung 1×, Anstrich 2×, Wand **und** Decke.

| Position | Soll-Menge |
|---|---|
| Spachtelarbeiten **Q3** Wand | **39,00 m²** |
| Spachtelarbeiten **Q3** Decke | **14,00 m²** |
| Grundierung Wand (1×) | **39,00 m²** |
| Grundierung Decke (1×) | **14,00 m²** |
| Wandflächen streichen 2× | **39,00 m²** |
| Deckenfläche streichen 2× | **14,00 m²** |
| Boden schützen | **14,00 m²** |
| Sockelleisten abkleben | 15,00 − 0,90 = **14,10 lfdm** `[VOB-012]` |

Wandbrutto ist 15,00 lfm × 2,60 = 39,00 m², ohne Abzüge — die 35,91 m² aus dem
alten Soll und dem Live-Nachtest vom 21.08. sind die Zahl von vor der
Übermessungs-Entscheidung. Die Qualitätsstufe muss in beiden Spachtelzeilen
**Q3** heißen, nicht Q2.

---

### Neuer Fund nebenbei: Leibungen werden einmal zu viel gerechnet

Beim Nachsehen für diese Soll-Lösungen aufgefallen, `maler.ts` Zeile 614:

```js
const leibungsUmfang = round2(2 * br + 2 * hoe)
```

Das ist einmal **rundherum**. An einem Fenster sitzt unten aber die
Fensterbank, an einer Tür der Fußboden — dort ist keine Leibung. Richtig sind
drei Seiten: `br + 2 × hoe`. Bei Standardfenster 1,20 × 1,00 und 25 cm Tiefe
rechnet das Tool **1,10 m² statt 0,80 m²**, also gut ein Drittel zu viel.

Und zwei Zeilen weiter kommt bei Nennung des Worts „Fensterbank" nochmal
`br × tiefe` als eigene Position dazu — **die Fensterbank wird damit doppelt
berechnet**, einmal versteckt im Leibungsumfang und einmal offen.

Das ist ein Rechenfehler zulasten des Endkunden, in derselben Familie wie die
Funde von Legal. Ich lege ihn als eigenen Fall an, sobald ich ihn live
nachgesprochen habe — für die sechs Soll-Lösungen oben ist er ohne Wirkung
(in keinem der Fälle kommen Leibungen vor).

*Prüfmeister · 2026-09-02*

## Antwort vom Head of Legal & Compliance (2026-09-02) — dein Leibungs-Fund

**Dein Fund am Ende der Soll-Lösungen ist der wichtigste des Tages, und er
korrigiert eine Kernaussage von mir.**

`maler.ts` Z. 614 rechnet `2*br + 2*hoe` — einmal rundherum. Dein Einwand, dass
unten die Fensterbank bzw. der Fußboden sitzt und es dort keine Leibung gibt,
ist offensichtlich richtig, sobald man ihn einmal gehört hat. Und die
Fensterbank ein zweites Mal als eigene Position zu berechnen, während sie
bereits im Umfang steckt, ist der Fehler daneben.

**Warum ich das rechtlich schwerer wiege als der Betrag nahelegt:** Bei der
Übermessung (VOB-004) und beim Verschnitt (VOB-001) berechnen wir Flächen, die
nicht bearbeitet wurden — aber nach einer nachvollziehbaren Konvention, einmal
aus der Norm, einmal aus der Branchenpraxis. Auf die Frage „wie kommen Sie
darauf?" gibt es dort eine Antwort. Hier gibt es keine. Und die Doppelzählung
der Fensterbank ist noch einmal etwas anderes als eine zu große Fläche: Der
Vorwurf lautet dann nicht „falsch gerechnet", sondern „doppelt berechnet", und
das ist der Vorwurf, gegen den sich ein Betrieb am schlechtesten wehren kann.

Aufgenommen als **VOB-013** in `vob-angebot-abstimmung.md`, in der
Risikobewertung als **LR-13** (Score 12, orange). Meine Aussage in
`legal-002-risikobewertung-vob.md`, in keinem der Risiken werde falsch
gerechnet, ist damit überholt und dort korrigiert. Sie war zwei Tage lang
richtig.

**Zur Reihenfolge, das ist meine einzige Bitte:** Lass VOB-013 nicht hinter
VOB-003 in derselben Warteschlange landen. VOB-003 wartet bewusst auf die
Normtexte, weil dort die Quellenlage unsicher ist und es Geld in beide
Richtungen bewegt. Für „ein Fenster hat unten keine Leibung" braucht es keine
DIN. Dein Vorgehen — erst live nachsprechen, dann als eigenen Fall anlegen —
ist genau richtig; ich wollte nur, dass die Trennung klar ist.

**Zu VOB-003 selbst, damit dort nichts vermischt wird:** Dein Fund ändert meine
Einschätzung nicht, er schärft sie. Die Frage „**ob** Leibungen separat
gerechnet werden dürfen" bleibt mit Ja beantwortet (DIN 18363 5.2.3). Die Frage
„**wie viel** dabei herauskommt" ist eine andere, und die Antwort darauf ist
jetzt: zu viel. Wer aus VOB-003 abliest, an den Leibungen sei alles in Ordnung,
liest zu schnell. Ich habe den Hinweis auch dort eingetragen.

**Dass du VOB-003 und VOB-012 nicht anfasst, solange die Quellenlage unsicher
ist, halte ich für genau richtig** — und für den Umgang mit einer
Legal-Einschätzung, den ich mir wünsche. Ich markiere meine Belegstärke nicht
zur Zierde. Sandy hat den Normkauf freigegeben; sobald die Texte da sind, löse
ich beide Punkte auf und trage das Ergebnis in `vob-angebot-abstimmung.md` ein.

**Zu deiner Grundregel 1 in den Soll-Lösungen** („VOB-Übermessung gilt überall,
jede alte Soll-Zahl mit Öffnungsabzug ist überholt — das war mein Fehler"): Das
ist derselbe Fehlertyp, der mir zwei Tage später mit dem Leibungs-Satz im
Erstbericht passiert ist. Eine Entscheidung wird umgesetzt, die Tests werden
nachgezogen, und die Prosa daneben bleibt auf dem alten Stand stehen. Bei dir
waren es Soll-Texte, bei mir eine Zeile unter „Kann warten". Beides fällt nur
auf, wenn jemand zwei Dokumente nebeneinander liest — bei mir warst du das.

**Die sechs offenen Fragen** in `vob-angebot-abstimmung.md` warten weiter auf
dich (Verschnitt sichtbar ausweisen · Fensterleibung mitberechnen · „Boden
abdecken" als eigene Position · Türen und Fenster nach Stück · Türbreiten bei
Sockelleisten · und die offene Frage nach Abrechnungsregeln, die das Produkt
gar nicht abbildet). Kein Zeitdruck — VOB-001 und VOB-005 hängen daran, beide
warten ohnehin auf Sandy.

---

---

## Vier grüne Haken zurückgezogen (Prüfmeister, 2026-09-02)

PM-002, PM-006, PM-010 und PM-018 stehen wieder auf 🟡. Kein neuer Bug — die
vier wurden zwischen dem 16. und 21.08. live abgenommen, **alle vor der
VOB-Übermessung**. Ihr „exakt Soll" bezieht sich damit auf Wandflächen mit
Öffnungsabzug, den es heute nicht mehr geben darf. Ein Haken auf einer Zahl,
die nicht mehr gilt, ist schlimmer als gar keiner.

Gegenprobe, damit klar ist, dass es am Testzeitpunkt liegt und nicht an der
Engine: **PM-011 und PM-013 wurden am 25.08. nachgetestet, also nach der
Regel** — dort steht der Flur korrekt auf 35,36 m² statt der alten 33,47 m²
und das Arbeitszimmer auf 36,00 m². Beide bleiben grün.

**Für Head of Product Engineering:** Wenn deine Golden-Tests für diese vier
Fälle rot werden, ist das richtig so. Die neuen Zahlen stehen im Abschnitt
„Soll-Lösungen für die sechs offenen Fälle" weiter oben. Rot bleiben dürfen
sie, bis ich jeden der vier live nachgesprochen habe — das mache ich, sobald
ich wieder am Tool bin.

*Prüfmeister · 2026-09-02*

---

## PM-032 bis PM-036 — Boden-Batch: fünf Mehrraum-Fälle (2026-09-02)

**Warum dieser Batch:** Das Bodenleger-Gewerk ist bisher fast nur mit
Einzelräumen getestet. Der einzige echte Mehrraum-Fall (PM-013) hatte zwei
Räume mit *getrennten Gewerken* — also gerade nicht die Situation, die draußen
der Normalfall ist: **eine Wohnung, mehrere Räume, alle Boden.** Genau da
entstehen die Fehler, die teuer werden — Verschnittsätze, die zwischen Räumen
überschwappen, Übergangsschienen an Türen, wo gar keine hingehört, und
Untergrundarbeiten, die auf alle Räume angewendet werden statt auf den einen.

Alle fünf sind reine Bodenaufträge, kein Maler. Es darf also in keinem der
Fälle eine Wand-, Decken- oder „Boden schützen"-Position auftauchen.

**Zur Verschnitt-Notation:** Die Mengen unten stehen so, wie die Engine heute
rechnet (Verschnitt in der Menge). Wird VOB-001 umgesetzt, ist die Menge die
reine Verlegefläche und der Verschnitt wandert in den Einheitspreis — die
betroffenen Zeilen sind mit `[VOB-001]` markiert und ändern sich dann alle
gemeinsam. Sockelleisten-Zeilen tragen wie gehabt `[VOB-012]`.

---

### PM-032 — Durchgehende Verlegung über drei Räume, ein Belag, eine Schwelle

**Warum:** Der häufigste Bodenauftrag überhaupt — Wohnung, ein Belag,
durchgehend ohne Schwellen. Die Falle ist die Übergangsschiene: Das Tool darf
**nicht** an jeder Zimmertür eine erfinden, sondern nur dort, wo der Belag
tatsächlich wechselt. Bei drei Räumen sind das drei falsche Schienen à 25–35 €,
die dem Kunden auffallen und die der Handwerker erklären muss.

**Zum Einsprechen:**
„Erdgeschosswohnung. Flur, sechs mal eins zwanzig. Wohnzimmer, fünf mal vier.
Küche, drei mal zwo achtzig. Überall dasselbe Klick-Vinyl, gerade verlegt,
durchgehend ohne Schwellen — das läuft von der Küche durch den Flur ins
Wohnzimmer. Trittschalldämmung drunter. Nur zum Bad hin kommt eine
Übergangsschiene, im Bad selbst machen wir nichts. Sockelleisten überall neu,
weiße MDF. Jeder Raum hat eine normale Tür."

**Soll-Lösung:**

| Position | Soll-Menge |
|---|---|
| Flächen (Zwischenwerte) | Flur 7,20 · Wohnzimmer 20,00 · Küche 8,40 = **35,60 m²** |
| Klick-Vinyl verlegen, 5 % Verschnitt | Flur 7,56 · Wohnzimmer 21,00 · Küche 8,82 → **Summe 37,38 m²** `[VOB-001]` |
| Trittschalldämmung | **35,60 m²** — Raumfläche, **ohne** Verschnitt |
| Übergangsschiene | **1 Stück** |
| Sockelleisten montieren | Flur 13,50 · Wohnzimmer 17,10 · Küche 10,70 → **41,30 lfdm** `[VOB-012]` |

Ob der Belag als drei Raumpositionen oder als eine Gesamtposition erscheint,
ist mir gleich — die Summe muss stimmen. Drei Positionen sind mir lieber, weil
der Kunde dann sieht, wo was liegt.

**Worauf achten:**
- **Genau eine Übergangsschiene.** Drei oder vier wären der Fehler, auf den
  dieser Fall gebaut ist.
- Trittschall mit 35,60 m² und nicht mit 37,38 — die Dämmung wird stumpf
  gestoßen, da ist kein Verschnitt drin. (Verwandt mit dem offenen
  PM-023-Fund zur Trittschall-Fläche.)
- Kein Bad in irgendeiner Form im Angebot.
- Sockelleisten je Raum, nicht einmal über alles — sonst ist nicht
  nachvollziehbar, wo sie hingehören.

---

### PM-033 — Drei Räume, drei Beläge, drei Verschnittsätze

**Warum:** Der Verschnitt hängt am Belag und an der Verlegeart, nicht am
Auftrag. Fischgrät 15 %, Laminat gerade 5 %, Teppich Bahnenware 0 % — alle drei
in einem Diktat. Wenn ein Satz auf die anderen Räume überschwappt, ist das
derselbe Fehlertyp wie „Raumkontext blutet zwischen Räumen", nur diesmal beim
Material.

**Zum Einsprechen:**
„Wohnzimmer, sechs mal vier fünfzig, da kommt Eichenparkett rein, Fischgrät
verlegt. Schlafzimmer, vier mal drei sechzig, da wollen die Teppich,
Bahnenware. Flur, fünf mal eins fünfzig, da kommt Laminat, ganz normal gerade.
An den beiden Türen zum Wohnzimmer und zum Schlafzimmer jeweils eine
Übergangsschiene, weil ja unterschiedliche Beläge. Trittschall nur unterm
Laminat im Flur. Sockelleisten bleiben überall, wie sie sind."

**Soll-Lösung:**

| Position | Soll-Menge |
|---|---|
| Eichenparkett Fischgrät — Wohnzimmer | 27,00 × 1,15 = **31,05 m²** `[VOB-001]` |
| Teppich Bahnenware — Schlafzimmer | **14,40 m²**, 0 % Verschnitt |
| Laminat gerade — Flur | 7,50 × 1,05 = **7,88 m²** `[VOB-001]` |
| Trittschalldämmung — Flur | **7,50 m²** |
| Übergangsschiene | **2 Stück** |

**Worauf achten:**
- Drei verschiedene Sätze in einem Angebot. Ein einheitlicher Satz über alle
  drei Räume ist ein Fehler, egal welcher.
- **Teppich mit 0 %** — der Katalog führt das so, und fachlich stimmt es:
  Bahnenware wird aus der Rolle geschnitten, der Verschnitt steckt im
  Rollenmaß, nicht in einem Prozentaufschlag.
- Trittschall **nur im Flur**, mit der Flurfläche. Genau die Verwechslung,
  die bei PM-023 noch offen ist — hier mit drei Räumen zugespitzt.
- **Keine Sockelleisten-Position**, in keinem Raum. Ausdrücklich ausgeschlossen.
- Keine Altbelag-Position, solange nicht danach gefragt wurde.

---

### PM-034 — Untergrundvorbereitung je Raum verschieden, ein Raum ausgeschlossen

**Warum:** Untergrundarbeiten sind der Teil, bei dem die Räume auseinanderlaufen
— in der Küche muss alles raus und gespachtelt werden, im Esszimmer reicht
Grundierung, im Flur passiert gar nichts. Das ist die PM-005-Fehlerfamilie
(„Scope eines Raums wird auf den anderen angewendet"), nur im Boden-Gewerk, wo
sie noch nie getestet wurde.

**Zum Einsprechen:**
„Küche, drei sechzig mal drei. Da liegen alte Fliesen, die müssen raus, und
danach muss der Boden gespachtelt werden, Ausgleichsmasse, der ist ziemlich
uneben. Dann Klick-Vinyl drauf, gerade verlegt. Esszimmer daneben, vier mal
drei fünfzig, der Untergrund ist in Ordnung, da reicht Grundierung, dann
dasselbe Vinyl. Im Flur machen wir nichts am Boden, der bleibt wie er ist.
Sockelleisten in Küche und Esszimmer neu, je eine Tür."

**Soll-Lösung:**

| Position | Soll-Menge |
|---|---|
| Alten Belag (Fliesen) entfernen — **nur Küche** | **10,80 m²** |
| Ausgleichsmasse / Boden spachteln — **nur Küche** | **10,80 m²** |
| Grundierung — **nur Esszimmer** | **14,00 m²** |
| Klick-Vinyl verlegen — Küche | 10,80 × 1,05 = **11,34 m²** `[VOB-001]` |
| Klick-Vinyl verlegen — Esszimmer | 14,00 × 1,05 = **14,70 m²** `[VOB-001]` |
| Trittschalldämmung | Küche 10,80 · Esszimmer 14,00 — darf ergänzt werden, dann je Raum korrekt |
| Sockelleisten montieren | Küche 12,30 · Esszimmer 14,10 → **26,40 lfdm** `[VOB-012]` |

**Worauf achten:**
- **Ausgleichsmasse und Fliesenabbruch dürfen nicht im Esszimmer landen**, und
  die Grundierung nicht in der Küche. Jede Untergrundleistung gehört exakt in
  den Raum, in dem sie gesagt wurde.
- **Der Flur bleibt komplett leer** — keine Position, obwohl er im Diktat
  vorkommt. Gleicher Mechanismus wie beim PM-013-Flur.
- Trittschall ist nicht genannt, bei Klick-Vinyl aber fachlich Standard. Wenn
  das Tool sie ergänzt: gut, dann aber mit den richtigen Raumflächen und als
  Vorschlag gekennzeichnet. Wenn sie fehlt: kein Fehler in diesem Fall.
- Eine Übergangsschiene zum Flur wäre fachlich richtig, wurde aber nicht
  verlangt — als Hinweis in „fehlende Positionen" in Ordnung, als bepreiste
  Position ohne Rückfrage nicht.

---

### PM-035 — Drei Arten, eine Fläche anzugeben, plus L-förmiger Flur

**Warum:** So redet der Handwerker wirklich. Ein Raum mit Maßen, einer nur mit
Quadratmetern („die Maße hab ich nicht im Kopf"), und ein Flur, der um die Ecke
geht. Bisher hat jeder Testfall brav Länge × Breite geliefert. Der L-Flur ist
zusätzlich der erste Test für den Sockelleisten-Umfang bei nicht-rechteckigen
Räumen.

**Zum Einsprechen:**
„Wohnzimmer, fünf zwanzig mal vier zehn. Das Arbeitszimmer hat vierzehn
Quadratmeter, die Maße hab ich nicht im Kopf. Der Flur ist L-förmig, einmal
sechs Meter mal eins zwanzig und der kurze Schenkel zwo Meter mal eins zwanzig,
drei Türen gehen da ab. Überall Landhausdiele, gerade verlegt.
Trittschalldämmung überall drunter. Sockelleisten nur im Flur neu, in den
Zimmern bleiben die alten."

**Soll-Lösung:**

| Position | Soll-Menge |
|---|---|
| Flächen (Zwischenwerte) | Wohnzimmer 21,32 · Arbeitszimmer 14,00 · Flur 7,20 + 2,40 = 9,60 → **44,92 m²** |
| Landhausdiele verlegen, 5 % | Wohnzimmer 22,39 · Arbeitszimmer 14,70 · Flur 10,08 → **Summe 47,17 m²** `[VOB-001]` |
| Trittschalldämmung | **44,92 m²** |
| Sockelleisten montieren — nur Flur | Umfang L-Form **18,40 lfm** (seit VOB-012 ohne Türabzug — Öffnungen bis 1 m werden nicht abgezogen; vor dem 04.09. lautete das Soll 15,70 lfdm) |

Zum Umfang der L-Form, damit es nachvollziehbar ist: Bei einem L entspricht der
Umfang dem des umschließenden Rechtecks — hier 6,00 × 3,20, also
2 × (6,00 + 3,20) = 18,40 lfm. Die Fläche natürlich nicht, die ist 9,60 m².

**Worauf achten:**
- **Werden alle drei Angabearten verstanden?** „Vierzehn Quadratmeter" ist eine
  Fläche, keine Kantenlänge — wenn daraus 14 × irgendwas wird, ist der Fall
  sofort rot.
- Kommt der Flur als **ein** Raum mit 9,60 m² an, oder wird er in zwei Räume
  zerlegt? Zwei Positionen wären verschmerzbar, solange die Summe stimmt und
  die Sockelleiste nicht doppelt gerechnet wird.
- **Der Sockelleisten-Umfang ist der eigentliche Test.** Meine Erwartung: das
  Tool rechnet 2 × (Länge + Breite) auf eines der beiden Teilstücke und liegt
  deutlich daneben. Wenn es stattdessen nachfragt, ist das die bessere Antwort
  als eine erfundene Zahl.
- Keine Sockelleisten in Wohnzimmer und Arbeitszimmer.

---

### PM-036 — Teilfläche nach Wasserschaden neben einem kompletten Raum

**Warum:** Der häufigste Reparaturauftrag im Bodenbereich, und der schärfste
Test der fünf. Bei einem Wasserschaden wird **nicht der Raum** neu gemacht,
sondern eine Teilfläche. Wenn das Tool stattdessen die Raumfläche nimmt, steht
ein Angebot über 20 m² im Raum, wo 6 m² beauftragt sind — das Dreifache, und
bei einem Versicherungsfall fällt das sofort jemandem auf.

**Zum Einsprechen:**
„Wasserschaden. Im Wohnzimmer muss nur eine Ecke neu, ungefähr sechs
Quadratmeter, der Rest vom Parkett bleibt liegen. Das Zimmer selbst ist fünf
mal vier. Im Flur daneben, vier mal eins fünfzig, kommt der Boden komplett neu,
gleiches Parkett. Im Flur muss der alte Belag raus, im Wohnzimmer nur die Ecke
ausbauen. Sockelleisten im Flur neu, im Wohnzimmer bleiben sie."

**Soll-Lösung:**

| Position | Soll-Menge |
|---|---|
| Parkett verlegen — Wohnzimmer (**Teilfläche**) | 6,00 × 1,05 = **6,30 m²** `[VOB-001]` |
| Parkett verlegen — Flur | 6,00 × 1,05 = **6,30 m²** `[VOB-001]` |
| Alten Belag entfernen — Wohnzimmer | **6,00 m²** |
| Alten Belag entfernen — Flur | **6,00 m²** |
| Sockelleisten montieren — nur Flur | 11,00 − 0,90 = **10,10 lfdm** `[VOB-012]` |

**Worauf achten:**
- **Die 20,00 m² Raumfläche des Wohnzimmers dürfen nirgends auftauchen.**
  Maßgeblich ist die genannte Teilfläche von 6 m². Die Raummaße stehen im
  Diktat nur, damit klar ist, dass das Tool sie hört und trotzdem nicht
  benutzt.
- Trittschall ist bei einer Parkett-Teilfläche nicht zu erwarten (der
  vorhandene Aufbau bleibt) — wenn sie kommt, dann höchstens als Rückfrage.
- Keine Sockelleisten im Wohnzimmer.
- Ehrliche Erwartung von mir: **dieser Fall geht durch.** Wenn er es tut, ist
  „Teilfläche" ein Fall für die Rückfrage-Logik und keine Kleinigkeit — der
  Betrieb bekommt sonst ein Angebot, das er nicht abschicken kann.

---

**Status aller fünf:** ❌ neu angelegt am 2026-09-02, noch nicht eingesprochen.
Ich spreche sie in einem Durchgang ein, sobald ich am Tool bin, und trage die
Ist-Ergebnisse hier direkt unter den jeweiligen Fall.

*Prüfmeister · 2026-09-02*

---

### PM-032 — Ist-Ergebnis (Sandy, 2026-09-02)

**Aufnahme-Karte:** Flur 3 Positionen, Wohnzimmer 2, Küche 2, Allgemein 1.
Raummaße alle exakt erkannt (1,2 × 6 m · 4 × 5 m · 2,8 × 3 m). Drei getrennte
Altbelag-Rückfragen, eine je Raum — beantwortet mit Flur „bleibt", Wohnzimmer
„bleibt", Küche „raus".

**Entwurf (netto 973,43 €):**

| Raum | Position | Ist | Soll |
|---|---|---|---|
| Flur | Klick-Vinyl inkl. 5 % Verschnitt | 7,56 m² | ✅ 7,56 |
| Flur | Sockelleisten montieren | 13,50 lfdm | ✅ 13,50 |
| Flur | Trittschalldämmung | 7,20 m² | ✅ Fläche korrekt |
| Wohnzimmer | Klick-Vinyl inkl. 5 % Verschnitt | 21,00 m² | ✅ 21,00 |
| Wohnzimmer | Sockelleisten montieren | 17,10 lfdm | ✅ 17,10 |
| Wohnzimmer | **Trittschalldämmung** | **fehlt** | ❌ 20,00 m² |
| Küche | Klick-Vinyl inkl. 5 % Verschnitt | 8,82 m² | ✅ 8,82 |
| Küche | Altbelag entfernen | 8,40 m² | ✅ Raumfläche ohne Verschnitt, nur Küche |
| Küche | Sockelleisten montieren | 10,70 lfdm | ✅ 10,70 |
| Küche | **Trittschalldämmung** | **fehlt** | ❌ 8,40 m² |
| Allgemein | Übergangsschiene, als „Vorschlag" markiert | 1 Stück | ⚠️ **1**, nicht 3 — siehe Nachtrag unter PM-033, Befund 3: möglicherweise Zufallstreffer |

Belag 37,38 m², Sockelleisten 41,30 lfdm — beides exakt Soll. Alle drei
Raumsummen rechnen sauber auf.

**Befund 1 — Trittschalldämmung nur im ersten Raum, in zwei von drei Räumen
fehlt sie komplett**

- **Fundort:** `src/lib/vollstaendigkeit/boden-sonder.ts`,
  `pruefeTrittschalldaemmung()`. Zwei Stellen, dieselbe Annahme „ein Angebot =
  ein Raum": `if (hat(ergaenzt, 'trittschall', 'pur-schaum')) return` steigt
  aus, sobald **irgendeine** Dämmungsposition existiert, und
  `ergaenzt.find(...)` nimmt die **erste** Verlegeposition als Bezugsfläche.
  Beides zusammen ergibt genau eine Dämmung je Angebot, hängend am ersten Raum.
- **Erwartet:** Dämmung unter jedem Boden, unter dem sie liegt — Flur 7,20 +
  Wohnzimmer 20,00 + Küche 8,40 = 35,60 m².
- **Tatsächlich:** 7,20 m². Es fehlen **28,40 m²**, bei 4,50 €/m² also
  **127,80 €** auf einem Angebot von 973,43 € — gut 13 %.
- **Warum das schwerer wiegt als die Zahl:** Der Handwerker verlegt die Dämmung
  in allen drei Räumen, sie ist Voraussetzung für die Verlegung. Er berechnet
  sie nur in einem. Das ist kein Rechenfehler zulasten des Kunden, sondern
  einer zulasten des Betriebs — und der fällt nicht auf, weil auf dem Angebot ja
  eine Trittschall-Zeile steht. Fehlt eine Position ganz, sucht man sie; steht
  sie einmal da, hakt man sie ab.
- **Verwandtschaft:** Das ist die dritte Runde derselben Familie. PM-004 (fehlte
  ganz), PM-023 (falsche Fläche, dann falsche Gruppe) — beide Male wurde für
  **einen** Raum repariert. Der Kommentarkopf der Funktion dokumentiert genau
  das. Bei mehreren Räumen greift keiner der beiden Fixes.
- **Fix-Richtung:** Schleife über alle Verlegepositionen statt `find`, eine
  Dämmung je Verlegeposition, Raumsuffix wie bisher vom Boden übernehmen. Die
  Prüfung „gibt es schon eine Dämmung" muss dann raumbezogen sein, nicht global.

**Was ausdrücklich gut lief — und das ist der Kern dieses Testfalls:**

1. **Genau eine Übergangsschiene**, nicht drei. Das Tool hat verstanden, dass
   der Belag durchgehend ist und Schwellen nur dort gehören, wo er wechselt.
   Zusätzlich korrekt als „Vorschlag" gekennzeichnet, weil ich sie zwar genannt,
   aber keine Stückzahl gesagt habe.
2. **Die Altbelag-Rückfrage kommt jetzt je Raum**, nicht einmal für den ganzen
   Auftrag — und die Antwort bleibt in dem Raum, für den sie gegeben wurde.
   „Ja, raus" in der Küche erzeugt genau dort eine Position mit 8,40 m², die
   beiden anderen Räume bleiben unberührt. Das war in PM-013 noch ein
   struktureller Fund („ein Feld für den ganzen Auftrag"), hier ist es sauber.
3. **Altbelag entfernen mit 8,40 m², nicht 8,82** — die Verschnittmenge ist
   nicht in die Abbruchfläche gerutscht. Beim Aufnehmen gibt es keinen
   Verschnitt, das ist genau richtig gerechnet.
4. Drei Räume, drei saubere Gruppen, keine Vermischung, kein Bad.

**Status PM-032:** ❌ ein Befund, sonst exakt Soll. Nachtest nach dem Fix.

---

### PM-033 — Ist-Ergebnis (Sandy, 2026-09-02)

**Aufnahme-Karte:** Wohnzimmer 1 Position, Schlafzimmer 1, Flur 1, Allgemein 2.
Raummaße alle exakt (4,5 × 6 · 3,6 × 4 · 1,5 × 5). Drei Altbelag-Rückfragen, je
Raum, alle „bleibt".

**Entwurf (netto 1.905,04 €):**

| Raum | Position | Ist | Soll |
|---|---|---|---|
| Wohnzimmer | Fertigparkett inkl. **15 %** Verschnitt | 31,05 m² | ✅ 31,05 |
| Wohnzimmer | **Trittschalldämmung** | **27,00 m²** | ❌ gehört gar nicht in diesen Raum |
| Schlafzimmer | Teppichboden verlegen, **kein** Verschnitt | 14,40 m² | ✅ 14,40 |
| Flur | Laminat inkl. **5 %** Verschnitt | 7,88 m² | ✅ 7,88 |
| Flur | **Trittschalldämmung** | **fehlt** | ❌ 7,50 m² |
| Allgemein | **Sockelleisten montieren** (als „Vorschlag") | **22,00 lfdm** | ❌ ausdrücklich ausgeschlossen |
| Allgemein | Übergangsschiene (als „Vorschlag") | **1 Stück** | ❌ 2 |

**Der Kerntest ist bestanden:** Drei Beläge, drei Verschnittsätze, in einem
Diktat — 15 % beim Fischgrät-Parkett, 0 % beim Teppich, 5 % beim Laminat. Kein
Satz schwappt in einen Nachbarraum. Das ist genau die Trennung, für die dieser
Fall gebaut war, und sie sitzt.

**Befund 1 — Trittschalldämmung im falschen Raum, und die Ansage wird
ignoriert**

Ich habe gesagt: „Trittschall **nur unterm Laminat im Flur**." Die Dämmung
landet im **Wohnzimmer**, mit der Wohnzimmerfläche von 27,00 m², und im Flur
fehlt sie.

- **Fundort:** dieselbe Stelle wie PM-032 — `pruefeTrittschalldaemmung()` in
  `src/lib/vollstaendigkeit/boden-sonder.ts`, `ergaenzt.find(...)` nimmt die
  **erste** Verlegeposition. In PM-032 war das zufällig der Raum, in dem die
  Dämmung hingehörte; hier ist es der falsche. Damit ist die Ursache aus PM-032
  aus einer zweiten Richtung bestätigt.
- **Verschärfung gegenüber PM-032:** Hier stand im Transkript nicht nur *dass*
  Dämmung kommt, sondern **wo**. Die Raumangabe wird komplett ignoriert. Das
  verletzt die Rangordnung „Ansage vor Struktur vor Rohtext", die für die
  Extraktion schon einmal festgezurrt wurde.
- **Geld, in beide Richtungen:** 121,50 € stehen im Angebot, die niemand
  verlangt hat — das geht zulasten des Kunden. Gleichzeitig fehlen im Flur
  7,50 m² = 33,75 €, die der Betrieb verlegt und nicht berechnet.
- Und sie trägt **kein „Vorschlag"-Etikett**, weil das Wort im Transkript
  vorkam. Das Tool behauptet also mit voller Sicherheit etwas, das ich so nie
  gesagt habe.

**Befund 2 — Sockelleisten erfunden, gegen einen ausdrücklichen Ausschluss**

Mein Satz war: „Sockelleisten bleiben überall, wie sie sind." Im Angebot steht
„Sockelleisten montieren, 22 lfdm, 121,00 €".

- Das ist die Familie PM-010 / PM-013 / PM-017: eine Leistung entsteht aus einem
  **Wortauslöser**, obwohl der Satz sie ausdrücklich abbestellt. Dass sie als
  „Vorschlag" markiert ist, mildert es — ein Vorschlag gegen eine ausdrückliche
  Absage bleibt trotzdem falsch. Man widerspricht dem Kunden nicht in seinem
  eigenen Angebot.
- **Die 22,00 lfdm lassen sich aus keinem Raum herleiten.** Die Umfänge sind
  Wohnzimmer 21,00, Schlafzimmer 15,20, Flur 13,00 — einzeln, in Summe (49,20)
  oder in irgendeiner Teilsumme kommt 22,00 nicht vor. **Verdacht:** 2 × (6,00 +
  5,00) = 22,00, also die Länge des Wohnzimmers mit der Länge des Flurs
  kombiniert. Das wäre ein Umfang aus zwei verschiedenen Räumen, passend dazu,
  dass die Position unter „Allgemein" ohne Raumbezug steht. Bitte am Code
  nachsehen, meine Herleitung ist eine Vermutung.
- Ein Türabzug fehlt ohnehin — passt zu VOB-012, ist hier aber zweitrangig, weil
  die Position gar nicht existieren dürfte.

**Befund 3 — nur eine Übergangsschiene, verlangt waren zwei**

„An den beiden Türen zum Wohnzimmer und zum Schlafzimmer **jeweils eine**
Übergangsschiene" — es kommt eine. Drei verschiedene Beläge stoßen an zwei
Türen aneinander, also braucht es zwei Schienen.

**Wichtig für PM-032:** Dort war „genau eine Schiene" das gewünschte Ergebnis
und ich habe es als bestanden abgehakt. Hier zeigt sich, dass das Tool
möglicherweise **immer genau eine** ergänzt, unabhängig davon, wie viele
Belagwechsel es gibt. Dann war PM-032 kein Treffer, sondern Glück. Bitte im
Code klären, ob die Schiene gezählt oder pauschal einmal gesetzt wird — davon
hängt ab, ob PM-032 wirklich grün ist. Ich habe den Punkt dort vermerkt.

**Was sonst gut lief:**

- Teppichboden ohne Verschnitt-Suffix und mit glatten 14,40 m² — die
  Sonderbehandlung für Bahnenware greift.
- Der Fischgrät-Satz von 15 % bleibt im Wohnzimmer und läuft nicht in den Flur,
  wo gerade verlegt wird. Das war nach dem PM-025-Fix die offene Frage.
- Altbelag-Rückfragen wieder sauber je Raum.

**Status PM-033:** ❌ drei Befunde. Verschnittlogik grün, Zuordnungslogik rot —
alle drei Fehler entstehen dadurch, dass eine Position ohne Raumbezug erzeugt
und dann irgendeinem Raum zugeschlagen wird.

---

#### Fix PM-033, Befund 2 (Head of Product Engineering, 03.09.2026)

**Behoben. „Sockelleisten bleiben überall, wie sie sind" erzeugt keine
Sockelleisten-Position mehr — in keinem Raum, auch nicht als Vorschlag.**

**Woher die 22,00 lfdm wirklich kamen.** Die Vermutung im Befund war
2 × (6,00 + 5,00), also ein Umfang aus zwei Räumen. Am Code nachgerechnet ist
es etwas anderes: Der Vollständigkeits-Fallback in `boden-vorarbeiten.ts`
schätzt bei fehlender Meterangabe einen **quadratischen Raum** —
4 × √31,05 m² = 22,29 → 22. Die 31,05 m² sind die Wohnzimmer-Verlegefläche
**inklusive 15 % Fischgrät-Verschnitt**. Es war also der Umfang eines
gedachten Quadrats über einer Fläche, die es in der Wohnung gar nicht gibt.
Dass die Zahl aus keinem Raum herzuleiten war, hat der Prüfmeister damit genau
richtig gesehen — sie stammt aus keinem.

**Der eigentliche Fehler liegt eine Stufe davor.** Ausgelöst hat den Fallback
die Bedingung `lower.includes('sockelleist')` — das Wort steht im Satz, also
wurde eine Position gebaut. Dass derselbe Satz sie **abbestellt**, hat niemand
gelesen. Es gab zwar eine Ausschluss-Prüfung, die kannte aber genau drei
Formulierungen: „ohne sockelleisten", „keine sockelleisten", „nur boden ohne".
Die normale Sprechweise — *„die bleiben, wie sie sind"* — war nicht dabei.
Das ist dieselbe Familie wie PM-011 („keine Kleinreparatur trotz Verneinung"):
ein Wortauslöser gewinnt gegen einen ganzen Satz.

**Was jetzt passiert** (`src/lib/sockelleisten-ausschluss.ts`, neu): Der
Ausschluss wird satzweise gelesen, mit Raumbezug, über denselben Satz-/Raum-
Helfer wie die Teilflächen-Erkennung aus PM-036 (`src/lib/satz-raum.ts` — eine
Stelle, nicht zwei Nachbauten). Erkannt werden unter anderem:

- „Sockelleisten bleiben überall, wie sie sind" → gilt für den ganzen Auftrag
- „An den Sockelleisten machen wir nichts" · „Sockelleisten bleiben dran"
- „Die Sockelleisten sollen nicht erneuert werden" · „Keine neuen Sockelleisten"
- „Sockelleisten im Flur neu. **Im Wohnzimmer bleiben sie.**" → Rückbezug per
  „sie" auf die frühere Ansage, Ausschluss **nur** für das Wohnzimmer

Der Ausschluss wirkt an **allen drei** Stellen, die eine solche Position
anlegen können: in der Mengen-Engine (`gewerke/boden.ts`, je Raum), in der
globalen Prüfung (`boden-basis.ts`) und als Sicherheitsnetz ganz am Ende der
Vollständigkeitsprüfung (`vollstaendigkeit/boden.ts`) — bewusst dort und nicht
in der Mitte, weil ein Ausschluss, der mitten in der Kette steht, von der
nächsten Regel wieder überholt wird. Dieselbe Lehre wie bei der zu spät
laufenden Maßkorrektur aus PM-034.

**Die Gegenrichtung ist mitgetestet, und die war mir wichtiger als der Fix
selbst** — ein zu scharfer Ausschluss löscht stillschweigend Geld aus dem
Angebot des Betriebs:

- „Sockelleisten überall neu, weiße MDF" → drei Positionen, 21,00 / 15,20 /
  13,00 lfdm, unverändert
- „Die Sockelleisten bleiben **nicht**, die kommen raus" → kein Ausschluss
- „Die alten Sockelleisten müssen raus" → Abbruch-Auftrag, kein Ausschluss
- „Sockelleisten im Flur neu. **Die Türen** werden nicht gestrichen." → der
  Rückbezugs-Zweig greift ausdrücklich **nicht**, obwohl „die" und „nicht" im
  Satz stehen
- „Sockelleisten neu, sonst nichts" → der Auftrag gewinnt

**Ein Fund am eigenen Fix, der hier hingehört:** Die erste Fassung hat den
Ausschluss als *raumbezogen* statt *global* gelesen — `\büberall\b` trifft in
JavaScript nie, weil der Umlaut ohne u-Flag nicht als Wortzeichen gilt. Der
Test hat es gefangen, bevor es irgendwo hinkam; die Stelle ist jetzt im Code
kommentiert, weil dieselbe Falle in jeder deutschen Regex lauert (sie hat
schon einmal zugeschlagen, siehe „fischgraet" in `boden.ts`).

**Tests:** `src/lib/__tests__/pm033-sockelleisten-ausschluss.test.ts`
(13 Fälle) — Erkennung, Gegenrichtung, Engine, und der komplette Weg durch die
Pipeline mit dem Original-Diktat aus PM-033. Zusätzlich geprüft, dass die drei
Verschnittsätze (15 / 0 / 5 %) davon unberührt bleiben. Gesamtstand: 77
Testdateien, 1.252 Tests grün, `tsc` sauber, eslint 0 Fehler.

**Nicht angefasst:** Befund 1 (Trittschall im falschen Raum) ist bereits mit
dem PM-032/033/035-Fix erledigt, Befund 3 (nur eine Übergangsschiene statt
zwei) ist noch offen — dort ist zuerst zu klären, ob die Schiene gezählt oder
pauschal einmal gesetzt wird, weil davon abhängt, ob PM-032 wirklich grün ist.

---

### PM-034 — Ist-Ergebnis (Sandy, 2026-09-02) — **schwerster Fall des Batches**

Angebotssumme **91.085,10 € netto** für zwei Räume von zusammen 24,80 m². Der
Fall ist an mehreren Stellen gleichzeitig gescheitert; ich sortiere nach
Schwere, nicht nach Reihenfolge.

**Befund 1 — Der normale Weiter-Button führt nicht zum Entwurf (Blocker)**

Sandy kam über den regulären Button unten nicht in die Entwurfsansicht. Es
funktionierte **ausschließlich** über „Trotzdem weiter zum Angebot" im gelben
Warnhinweis oben.

- Das ist ein Blocker derselben Art wie der PM-007-Rückfragen-Stau: Der Nutzer
  klickt, nichts passiert, und der einzige funktionierende Weg ist ein Link in
  einem Warnkasten, den man erst finden muss.
- Besonders unangenehm ist die Kombination: Wer die Warnung **nicht** hat
  (also im Normalfall), bekommt vermutlich den funktionierenden Button — wer
  eine Warnung hat, steckt fest. Getestet wurde bisher offenbar nur der
  Normalfall.
- **Für Head of Product Engineering:** bitte zuerst prüfen, ob der Button bei
  aktiver Plausibilitätswarnung deaktiviert ist oder ins Leere läuft. Für den
  Nutzer ist beides dasselbe: das Tool reagiert nicht.

**Befund 2 — „drei sechzig" wird 360, „drei fünfzig" wird 350 — zweimal in
einem einzigen Diktat**

| Gesagt | Erkannt | Fläche |
|---|---|---|
| Küche „drei sechzig mal drei" | **360 × 3 m** | 1.080 m² statt 10,80 m² |
| Esszimmer „vier mal drei fünfzig" | **350 × 4 m** | 1.400 m² statt 14,00 m² |

Das ist der 350-Bug aus PM-010, der damals als „akzeptierte Design-Entscheidung
— Warnung statt Korrektur" geschlossen wurde. **Diese Einordnung halte ich nach
diesem Testfall nicht mehr für tragfähig**, und zwar aus einem einzigen Grund:
„drei fünfzig" ist nicht der Sonderfall, sondern **die normale Sprechweise auf
dem Bau**. Kein Handwerker sagt „drei Komma fünf null Meter". Ein Werkzeug, das
Sprache aufnimmt, muss die Sprache können, die gesprochen wird — sonst trifft
der Fehler nicht einen Nutzer gelegentlich, sondern fast jeden Nutzer fast
immer. In diesem Diktat hat es zwei von drei Maßangaben zerlegt.

**Was gut ist, und das rechne ich hoch an:** Die Plausibilitätswarnung hat
gegriffen, beide Male, mit exakt der richtigen Vermutung im Text („wurde ‚drei
fünfzig' als Ziffer 350 verstanden"). Der Sicherheitsmechanismus funktioniert.
Er ist nur die zweitbeste Lösung.

**Mein Vorschlag zur Neubewertung:** Bei Innenraum-Maßen über etwa 20 m wird
der Wert automatisch als Kommazahl gelesen (360 → 3,60), die Korrektur wird als
**sichtbare Annahme** an den Raum geschrieben und bleibt änderbar. Nicht stumm
korrigieren — aber auch nicht dem Nutzer die Rechenarbeit überlassen. Das ist
eine Entscheidung für Sandy, weil es die Grundhaltung „lieber fragen als raten"
an einer Stelle aufweicht.

**Befund 3 — Der Ausschlusssatz wird zu einem Raum**

Mein Satz „Im Flur machen wir nichts am Boden, der bleibt wie er ist" erscheint
als **Raumname**:

> „Keine Arbeiten am Boden im Flur."
> Welche Maße kennst du für „Keine Arbeiten am Boden im Flur."?

Das Tool fragt also nach den Maßen eines Raums, dessen Name der Satz ist, mit
dem ich ihn abbestellt habe. Sandy hat „später ergänzen" gewählt, deshalb ist
keine Position entstanden — ein Nutzer, der brav Maße einträgt, bekommt
Positionen für einen ausdrücklich ausgeschlossenen Raum.

Das ist eine Steigerung der PM-013-Familie: Dort wurde ein Ausschluss ignoriert,
hier wird er in sein Gegenteil verwandelt. Verwandt mit dem alten Fund
„Raumname steht als eigener Eintrag in der Leistungen-Liste" (PM-004-Nachtest),
nur in die andere Richtung.

**Für den Product Designer (PD):** Die Rückfrage lautet zusätzlich „Wie groß ist
**den** Flur?" — Grammatikfehler in einer Nutzerfrage.

#### Fix PM-034, Befund 3 (Head of Product Engineering, 03.09.2026)

**Behoben. Für den Flur wird gar nicht mehr gefragt.**

**Erst die Entlastung: die KI-Extraktion ist an dieser Stelle richtig.** An den
Produktionsdaten der Aufnahme nachgesehen (`entwurf_aufnahmen`, Diktat vom
03.09.) steht dort:

```
{ name: "Flur", vage: true, vage_typ: "raum_ohne_masse",
  vage_beschreibung: "Keine Arbeiten am Boden im Flur.",
  arbeiten: [], belag: null, laenge: null, breite: null }
```

Der Raum heißt „Flur". Die Beschreibung steht sauber im dafür vorgesehenen
Feld, und sie gibt den Satz inhaltlich korrekt wieder. Aus dieser richtigen
Extraktion hat **unser Code** die falsche Frage gebaut — an zwei Stellen
gleichzeitig:

1. **Es wurde überhaupt gefragt.** Ein Raum ohne jede Arbeit, dessen eigene
   Beschreibung „Keine Arbeiten" lautet, braucht keine Maße — er kommt im
   Angebot nicht vor. Genau die Befürchtung des Prüfmeisters („ein Nutzer, der
   brav Maße einträgt, bekommt Positionen für einen ausgeschlossenen Raum") war
   der eigentliche Schaden, nicht der schiefe Text.
2. **Die Oberfläche hat die Beschreibung als Überschrift benutzt** statt der
   fertig formulierten Frage. In `RueckfragenScreen.tsx` stand für Maßfragen
   fest verdrahtet „Welche Maße kennst du für „{kontext}“?" — und `kontext` ist
   bei vagen Räumen genau diese KI-Beschreibung. Ist sie ein kurzer Name
   („beide Schlafzimmer"), liest sich das gut; ist sie ein Satz, kommt der Satz
   in die Überschrift.

**Was jetzt passiert** (`src/lib/raum-ausschluss.ts`, neu): Ein Raum gilt als
abbestellt, wenn er **beides** ist — ohne jede Arbeit (keine `arbeiten`, kein
Belag, keins der stillen Flags wie `ausgleich`/`altbelag_entfernen`) **und**
ausdrücklich abgesagt, entweder in der KI-Beschreibung oder in seinen eigenen
Sätzen im Transkript („machen wir nichts", „bleibt, wie er ist", „wird nicht
gemacht", „nix"). Bewusst beides und nicht eines von beiden: Ein Raum ohne
zugeordnete Arbeiten kann auch schlicht ein Raum sein, bei dem die KI die
Arbeiten nicht zugeordnet hat — **da ist die Rückfrage richtig und wichtig**,
und sie bleibt. Für abbestellte Räume entfällt die Maßfrage ersatzlos.

Die Oberfläche nimmt den Kontext nur noch als Überschrift, wenn er ein kurzer
Name ist (höchstens drei Wörter, kein Satzzeichen am Ende); sonst zeigt sie die
formulierte Frage.

**Nebenfund des Prüfmeisters mit erledigt:** „Wie groß ist **den** Flur?" — der
Rückfall-Artikel stand im Akkusativ statt im Nominativ. Jetzt „der Flur", plus
eine erweiterte Liste (die Diele, das Büro, das Treppenhaus, die Waschküche …),
weil bisher alles, was nicht „Küche" oder „…zimmer" hieß, denselben falschen
Artikel bekam.

**Zum Vergleich, derselbe Fall komplett durch die Pipeline, mit den heutigen
Fixes:**

| | vorher | jetzt |
|---|---|---|
| Rückfragen | Maße für „Keine Arbeiten am Boden im Flur." | nur noch „Muss der alte Bodenbelag im Esszimmer entfernt werden?" |
| Küche verlegen | 1.134 m² | **11,34 m²** |
| Esszimmer verlegen | 1.400 m² | **14,70 m²** |
| Flur | Maßfrage + drohende Positionen | **kommt nicht vor** |

**Tests:** `src/lib/__tests__/pm034-ausschlusssatz-raum.test.ts` (9 Fälle),
darunter die Gegenrichtung: ein vager Raum **ohne** Absage wird weiterhin
gefragt, und eine Absage für eine einzelne Leistung („Sockelleisten bleiben")
macht aus einem Raum mit Auftrag keinen abbestellten Raum. Gesamtstand: 78
Testdateien, 1.261 Tests grün, `tsc` sauber, eslint 0 Fehler.

---

**Befund 4 — Drei Maler-Spachtelpositionen in einem reinen Bodenauftrag**

Unter „Allgemein" stehen: „Wände spachteln Q2" (0 Stück, Preis fehlt), „Wände
schleifen nach Q2" (0 Stück, Preis fehlt), „Spachtelarbeiten Q2" (0 Stück,
3,00 €).

Auslöser war offensichtlich mein Satz „der Boden muss gespachtelt werden,
Ausgleichsmasse". Aus einer **Boden**spachtelung werden drei **Wand**positionen
— in einem Auftrag, in dem ich kein einziges Mal von Wänden gesprochen habe.

- Das ist die PM-011-Verwechslung (Kleinreparatur vs. Vollflächenspachtelung),
  hier aber gewerksübergreifend: Boden → Maler.
- Verschärfend: zwei der drei tragen „Preis fehlt in deiner Preisdatenbank" mit
  einem „Preis anlegen"-Knopf. Das verleitet den Handwerker dazu, Preise für
  eine Leistung anzulegen, die er nie anbieten wollte.
- Und es sind **drei Varianten derselben Sache** nebeneinander — „Wände
  spachteln Q2" und „Spachtelarbeiten Q2" sind dasselbe.
- Die richtige Position, **„Untergrundvorbereitung / Ausgleich"**, steht
  daneben korrekt in der Küche. Die drei Wandpositionen sind also nicht einmal
  ein Ersatz für etwas Fehlendes, sondern reine Dopplung im falschen Gewerk.

**Ursache von Befund 4, am Code gefunden (Head of Product Engineering,
03.09.2026) — noch nicht behoben, weil sie eine Entscheidung braucht:**
`mehrgewerk.ts` entscheidet über ein Wortmuster, ob zusätzlich zum Boden auch
das Maler-Gewerk geprüft wird:
`MALER_ARBEIT = /streich|anstrich|tapete|…|spachtel|glätt|lackier|grundier|…/`.
Die Küche trägt in `arbeiten` den Eintrag **„boden spachteln"**, das Esszimmer
**„grundierung"** — beide treffen dieses Muster. Damit läuft die komplette
Maler-Vollständigkeitsprüfung über einen reinen Bodenauftrag und meldet drei
Wandpositionen als „fehlend" (deshalb 0 Stück und „Preis fehlt"). Es ist
dieselbe Familie wie PM-033/Befund 2: **ein Wort gewinnt gegen den Satz, in dem
es steht** — „Boden" direkt daneben wird nicht gelesen.
Der naheliegende Fix ist klein (ausdrücklich boden-bezogenes Spachteln/
Grundieren nicht mehr als Maler-Signal werten), berührt aber die Gewerke-
Erkennung für **alle** gemischten Aufträge. Deshalb erst nach Freigabe.
Befund 5 hängt an derselben Stelle: „Grundierung" wird als Maler-Grundierung
verbucht und geht dem Boden verloren.

**Befund 5 — Die Grundierung im Esszimmer fehlt**

„Der Untergrund ist in Ordnung, da reicht Grundierung" — im Esszimmer steht
keine Grundierungsposition. Der Raum hat nur Belag und Sockelleisten. Die
Untergrund-Trennung funktioniert also **halb**: das Aufwendige (Altbelag,
Ausgleichsmasse) landet korrekt nur in der Küche, das Einfache (Grundierung)
fällt im Esszimmer ganz weg.

**Was trotz allem funktioniert hat:**

1. **Die Raumtrennung bei der Untergrundvorbereitung — der Kerntest dieses
   Falls — stimmt.** „Altbelag entfernen" und „Untergrundvorbereitung /
   Ausgleich" stehen ausschließlich in der Küche, nicht im Esszimmer. Gemessen
   an den Flächen ist das (auf der falschen Basis) exakt richtig zugeordnet.
2. **Die Abbruch- und Ausgleichsfläche trägt keinen Verschnitt** (1.080 statt
   1.134) — dieselbe saubere Trennung wie in PM-032.
3. **Sockelleisten je Raum mit Türabzug**, rechnerisch konsistent:
   2 × (360 + 3) − 0,90 = 725,10 und 2 × (350 + 4) − 0,90 = 707,10. Die Formel
   stimmt, nur die Basis ist Müll.
4. Die Plausibilitätswarnung, siehe Befund 2.

**Beobachtung ohne Fehlerstatus:** Die Trittschalldämmung fehlt hier komplett,
obwohl Klick-Vinyl verlegt wird — in PM-032 und PM-033 wurde sie (falsch)
ergänzt. Im Soll dieses Falls hatte ich sie als „darf, muss nicht"
gekennzeichnet, deshalb kein Befund. Auffällig ist die Inkonsistenz: dreimal
Klick-Vinyl, dreimal ein anderes Verhalten. Der Belag heißt in den Positionen
„Vinyl-Boden", nicht „Klick-Vinyl" — möglicher Zusammenhang mit dem
Trigger-Wort, bitte beim Fix zu PM-032 mitprüfen.

**Status PM-034:** ❌ fünf Befunde, davon einer Blocker (Weiter-Button) und
einer mit Grundsatzfrage an Sandy (Zahlenerkennung „drei fünfzig").

---

### PM-035 — Ist-Ergebnis (Sandy, 2026-09-02)

**Entwurf (netto 1.990,37 €):**

| Raum | Position | Ist | Soll |
|---|---|---|---|
| Wohnzimmer | Raummaße | 4,1 × 5,2 m | ✅ exakt |
| Wohnzimmer | Fertigparkett inkl. 5 % | 22,39 m² | ✅ 22,39 |
| Wohnzimmer | Trittschalldämmung | 21,32 m² | ✅ Fläche korrekt, aber siehe Befund 4 |
| Arbeitszimmer | Raummaße | **Boden-/Deckenfläche 14 m²** | ✅ als Fläche geführt, nicht als Kantenlänge |
| Arbeitszimmer | Fertigparkett inkl. 5 % | 14,70 m² | ✅ 14,70 |
| Arbeitszimmer | Trittschalldämmung | **fehlt** | ❌ 14,00 m² |
| Flur | Raummaße | **6 × 1 m** | ❌ 6,00 × 1,20 **plus** 2,00 × 1,20 |
| Flur | Fertigparkett inkl. 5 % | **6,30 m²** | ❌ 10,08 m² |
| Flur | Sockelleisten montieren | **13,10 lfdm** | ❌ 15,70 lfdm |
| Flur | Trittschalldämmung | **fehlt** | ❌ 9,60 m² |

**Befund 1 — Die L-Form verschwindet stumm**

Gesagt: „Der Flur ist L-förmig, einmal sechs Meter mal eins zwanzig und der
kurze Schenkel zwo Meter mal eins zwanzig." Angekommen: ein rechteckiger Flur.
**Der zweite Schenkel taucht nirgends auf** — nicht als Fläche, nicht als
Rückfrage, nicht als Hinweis.

- Das Wort „L-förmig" steht wörtlich im Transkript, und es gibt im Produkt sogar
  einen Knopf „📐 Unförmig? Form zeichnen". Der Auslöser wird nicht genutzt: Wer
  „L-förmig" sagt, müsste genau dorthin geführt werden.
- **Stiller Verlust:** 2,40 m² Boden. Anders als bei einem Rechenfehler sieht
  der Handwerker hier gar nichts — es fehlt keine Position, es fehlt ein Stück
  Raum. Das ist dieselbe Fehlerkategorie wie „5 Positionen erkannt, 4
  geliefert", nur eine Ebene tiefer.
- **Mindestanforderung:** Wenn das Tool eine zweite Maßangabe zum selben Raum
  hört, darf sie nicht verschwinden. Entweder addieren oder nachfragen.

**Befund 2 — „sechs Meter mal eins zwanzig" wird 6 × 1, und ich habe den
Gegenbeweis im selben Diktat**

Die Breite 1,20 m kommt als **1 m** an. Das ist wieder die Zahlensprechweise,
diesmal in die andere Richtung als in PM-034: dort wurde „drei sechzig" zu 360,
hier fällt bei „eins zwanzig" die Nachkommastelle einfach weg.

**Und jetzt der interessante Teil:** Im selben Diktat wurden „fünf zwanzig" →
5,20 und „vier zehn" → 4,10 **fehlerfrei** erkannt. Es liegt also nicht an der
Sprechweise als solcher.

**Meine Hypothese, prüfbar:** Es liegt am Wort **„Meter" mitten in der
Maßangabe.** Vergleich der beiden Formulierungen:

| Fall | Wortlaut | Ergebnis |
|---|---|---|
| PM-032 | „Flur, sechs mal eins zwanzig" | ✅ 1,20 m |
| PM-035 | „einmal sechs **Meter** mal eins zwanzig" | ❌ 1 m |

Gleicher Raum, gleiche Zahl, gleiches Projekt — einmal richtig, einmal falsch.
Der einzige Unterschied ist die Einheit zwischen den beiden Werten. Für Head of
Product Engineering ist das eine konkrete, billig testbare Spur: eine Handvoll
Varianten mit und ohne „Meter" in der Mitte durchspielen.

**Befund 3 — Sockelleisten: falscher Umfang und nur eine von drei Türen**

13,10 lfdm entsprechen 2 × (6,00 + 1,00) − 0,90. Zwei Fehler in einer Zahl:

1. Der Umfang stammt aus dem falschen, rechteckigen Flur (Folge von Befund 1
   und 2). Richtig wäre der Umfang der L-Form: 18,40 lfm.
2. **Abgezogen wurde eine Türbreite, obwohl ich „drei Türen gehen da ab"
   ausdrücklich gesagt habe.** Die Türanzahl aus dem Transkript kommt nicht an;
   es wird die Standardannahme „eine Tür" benutzt, ohne das als Annahme
   auszuweisen. Bei einem Flur ist das der unwahrscheinlichste aller Fälle —
   Flure haben per Definition viele Türen.

Zur Einordnung: Nach heutiger Regel wäre das Soll 15,70 lfdm. Wird VOB-012
entschieden („nur Öffnungen ab 1,00 m abziehen"), sind es 18,40 lfdm. Beide
Zahlen liegen weit über den berechneten 13,10.

#### Fix PM-035, Befund 1 + 3 + 4 (Head of Product Engineering, 03.09.2026)

**Behoben. Der Fall liefert jetzt exakt die Soll-Liste.**

| Position | Soll | vorher | jetzt |
|---|---|---|---|
| Wohnzimmer verlegen | 22,39 m² | 22,39 | **22,39** |
| Arbeitszimmer verlegen | 14,70 m² | 14,70 | **14,70** |
| Flur verlegen | 10,08 m² | 6,30 | **10,08** |
| Trittschalldämmung gesamt | 44,92 m² | 21,32 | **44,92** (21,32 + 14,00 + 9,60) |
| Sockelleisten — nur Flur | 15,70 lfdm | 13,10 | **15,70** |
| Sockelleisten in den Zimmern | keine | keine | **keine** |

**Zuerst die Ausgangslage, denn sie hat sich verschoben.** An den
Produktionsdaten vom 03.09. kommt der Flur inzwischen so an:

```
{ name: "Flur", laenge: null, breite: null, flaeche: null,
  tueren: [{ anzahl: 3, breite: 0.9 }] }
```

Die KI gibt bei der L-Beschreibung also **komplett auf** — es gibt keine
falsche Zahl mehr, die man korrigieren könnte, sondern gar keine. Damit ist
klar: Die Maße müssen deterministisch aus dem Text kommen, sonst gibt es sie
nicht. (Gute Nachricht am Rande: Die drei Türen kommen inzwischen korrekt als
`anzahl: 3` an — der Fehler lag danach.)

**Befund 1, die L-Form** (`src/lib/l-form.ts`, neu). Fachlich ist der Fall
lösbar, weil bei einem L der Umfang derselbe ist wie beim umschließenden
Rechteck, und weil ein Flur überall gleich breit ist:

```
Fläche = Breite × (Schenkel 1 + Schenkel 2) = 1,20 × (6,00 + 2,00) = 9,60 m²
Umfang = 2 × (Schenkel 1 + Schenkel 2 + Breite) = 2 × 9,20 = 18,40 lfm
```

Der heikle Teil ist die Zuordnung der Zahlen, nicht die Formel. Whisper macht
aus „einmal" ein „1 x"; der Satz lautet wörtlich „L-förmig, **1 x 6 m x 1.20**
und der kurze Schenkel 2 m x 1.20". Ein naiver Scan findet daraus auch das Paar
(1 × 6) und rechnet Unsinn. Deshalb werden **alle** Maßpaare gesammelt, auch
überlappende, und danach wird die Kombination gesucht, die geometrisch
überhaupt ein L sein kann: Beide Schenkel teilen sich eine Seite, und diese
geteilte Seite ist die Breite — also höchstens so lang wie die Schenkel, die
von ihr abgehen. (1 × 6) und (6 × 1,20) teilen sich zwar die 6, aber eine 6 m
breite Wand mit 1 m langen Schenkeln ist kein Flur. Es bleibt genau eine
Kombination übrig.

Bleiben **mehrere oder keine** übrig, wird nichts angenommen, sondern gesagt:
„Der Raum wurde als L-förmig beschrieben, aber die beiden Schenkel sind aus dem
Diktat nicht eindeutig herauszulesen … bitte die Form über ‚Unförmig? Form
zeichnen' eintragen." Damit ist die Mindestanforderung des Prüfmeisters erfüllt
— entweder addieren oder nachfragen, aber nie stumm verlieren. Und wenn
gerechnet wird, steht die Rechnung sichtbar über dem Entwurf, wie bei der
Maßkorrektur und der Teilfläche.

Zusätzlich werden `laenge` und `breite` des Raums geleert: Ein L ist kein
Rechteck. Sie stehen zu lassen hieße, die Rechteck-Formel weiterlaufen zu
lassen — genau der stille Verlust. Die Boden-Engine nimmt einen ausdrücklich
gesetzten Umfang jetzt entgegen (vorher konnte sie ihn nur aus Länge × Breite
bilden, ein L-Raum hätte also gar keine Sockelleisten-Position bekommen).

**Befund 3, die Türen.** Zwei Fehler in einer Zahl, beide weg:
*Der Umfang* stammte aus dem falschen, rechteckigen Flur — mit der L-Form
stimmt er. *Die Türanzahl* wurde ignoriert: Die Extraktion liefert
`{ anzahl: 3, breite: 0.9 }`, und `berechneSockelleistenLaenge()` hat die
Stückzahl schlicht nicht gelesen — sie summierte eine Türbreite je **Eintrag**
statt je **Tür**. Eine Zeile, aber sie sitzt in der Funktion, die laut ihrem
eigenen Kommentar „die einzige Stelle" für „Umfang minus Türbreiten" ist,
also für Maler und Boden gleichermaßen.

**Nebenfund, an dem der Fall sonst wieder gescheitert wäre:**
„Sockelleisten nur im Flur neu. **In den Zimmern** bleiben die alten." Der
zweite Satz nennt keinen konkreten Raum, sondern eine Gruppe — er wurde dem
zuletzt genannten Raum zugeschlagen, also ausgerechnet dem **Flur**, der die
Sockelleisten bekommen soll. Der Ausschluss traf damit exakt den falschen Raum
(erst beim Nachrechnen dieses Falls aufgefallen, nicht vom Prüfmeister
gemeldet). Eine Gruppenangabe wird jetzt auf die Räume aufgelöst, die sie
meint, statt auf den letzten genannten.

**Befund 4** (Trittschall nur im ersten Raum) ist mit dem raumweisen Umbau
erledigt, siehe dort — hier stehen jetzt alle drei Räume mit ihrer eigenen
Fläche.

**Tests:** `src/lib/__tests__/pm035-l-form.test.ts` (12 Fälle) mit dem echten
Transkript, der Gegenrichtung (nur ein Schenkel → kein Wert, sondern ein
Hinweis; kein L-Signal → gar nichts; Paare ohne gemeinsame Seite → kein
Ergebnis) und der Türanzahl. Gesamtstand: 80 Testdateien, 1.292 Tests grün,
`tsc` sauber, eslint 0 Fehler.

**Befund 2 („sechs Meter mal eins zwanzig" → 6 × 1) lässt sich an den heutigen
Daten nicht mehr nachstellen:** Die KI liefert für den L-Flur gar keine Maße
mehr, statt falscher. Die L-Erkennung deckt genau diesen Satz ab, weil sie die
Einheit zwischen den Werten mitliest. Ob die Sprechweise in einem
**rechteckigen** Raum noch danebengeht, muss der nächste Live-Test zeigen —
ich baue dafür keine Reparatur auf Verdacht.

---

**Befund 4 — Trittschalldämmung zum dritten Mal nur im ersten Raum**

Wohnzimmer 21,32 m² ✅, Arbeitszimmer und Flur ohne. Damit ist der Befund aus
PM-032 und PM-033 dreifach belegt und in allen drei Ausprägungen gesehen:

| Fall | Verhalten |
|---|---|
| PM-032 | nur erster Raum, dort zufällig richtig — zwei Räume ohne |
| PM-033 | nur erster Raum, dort **falsch** (Ansage „nur im Flur" ignoriert) |
| PM-035 | nur erster Raum, dort richtig gerechnet — zwei Räume ohne |

Fehlbetrag hier: 23,60 m² × 4,50 € = 106,20 €. Die Fläche im Wohnzimmer ist
mit 21,32 m² korrekt ohne Verschnitt gerechnet — die Formel stimmt, sie läuft
nur genau einmal.

**Was gut lief — und einer davon war mein Hauptverdacht:**

1. **„Das Arbeitszimmer hat vierzehn Quadratmeter" wird als Fläche geführt**,
   sauber ausgewiesen als „Boden-/Deckenfläche 14 m²", nicht als Kantenlänge.
   Genau das hatte ich als wahrscheinlichsten Fehler erwartet. Bestanden.
2. **Zwei von drei Angabearten in einem Diktat korrekt** — Maßpaar und reine
   Flächenangabe. Nur die zusammengesetzte Form scheitert.
3. **Sockelleisten nur im Flur**, keine in Wohnzimmer und Arbeitszimmer. Der
   Ausschluss „in den Zimmern bleiben die alten" wird respektiert — im
   Gegensatz zu PM-033, wo Sockelleisten gegen eine ausdrückliche Absage
   erfunden wurden. Der Unterschied zwischen beiden Formulierungen ist einen
   eigenen Blick wert.
4. Altbelag-Rückfragen wieder sauber je Raum, alle drei Räume einzeln.

**Status PM-035:** ❌ vier Befunde. Die Flächenangabe-Vielfalt ist zu zwei
Dritteln bestanden, die L-Form komplett gescheitert.

---

### PM-036 — Ist-Ergebnis (Sandy, 2026-09-02)

**Entwurf (netto 1.506,50 €, Soll rund 734 €):**

| Raum | Position | Ist | Soll |
|---|---|---|---|
| Wohnzimmer | Fertigparkett inkl. 5 % | **21,00 m²** | ❌ 6,30 m² |
| Wohnzimmer | Altbelag entfernen | **20,00 m²** | ❌ 6,00 m² |
| Flur | Fertigparkett inkl. 5 % | **6,00 m²** | ❌ 6,30 m² (Karte zeigte 6,3) |
| Flur | Altbelag entfernen | 6,00 m² | ✅ |
| Flur | Sockelleisten montieren | 11,00 lfdm | ⚠️ vertretbar, siehe unten |
| Wohnzimmer | Sockelleisten | keine | ✅ korrekt ausgeschlossen |

**Befund 1 — Die Teilfläche wird ignoriert, das Raummaß gewinnt**

Gesagt: „Im Wohnzimmer muss nur eine Ecke neu, ungefähr **sechs Quadratmeter**,
der Rest vom Parkett bleibt liegen. Das Zimmer selbst ist fünf mal vier."
Gerechnet: 20,00 m² × 1,05 = 21,00 m², dazu Altbelag entfernen über die vollen
20,00 m².

- **785,40 € zu viel** auf einem Angebot, das rund 734 € betragen müsste — das
  Angebot ist mehr als doppelt so teuer wie der Auftrag.
- **Die genaue Mechanik, und die ist wichtig für den Fix:** Beide Zahlen standen
  im Diktat, eine Teilfläche *und* ein Raummaß. Bei Konkurrenz gewinnt das
  Raummaß. In PM-035 wurde „das Arbeitszimmer hat vierzehn Quadratmeter"
  dagegen **korrekt** als Fläche übernommen — dort gab es kein konkurrierendes
  Maßpaar. Der Flächenwert wird also verstanden, er verliert nur immer gegen
  Länge × Breite.
- **Fachlich ist die Rangordnung genau umgekehrt.** Wer eine Teilfläche nennt,
  hat den Raum absichtlich dazugesagt — als Kontext, nicht als Auftrag. Das ist
  dieselbe Rangordnung „Ansage vor Struktur", die für den Rohtext schon einmal
  festgezurrt wurde, hier auf der Mengenebene.
- **Und der Ausschluss wurde zusätzlich überfahren:** „der Rest vom Parkett
  bleibt liegen" ist eine ausdrückliche Ansage. Das Tool reißt den ganzen Boden
  raus.
- **Praxisgewicht:** Das ist der häufigste Reparaturauftrag im Bodenbereich
  überhaupt — Wasserschaden, Versicherungsfall, Teilfläche. Und es ist der
  Auftragstyp, bei dem am genauesten hingeschaut wird, weil eine Versicherung
  mitliest. Ein Angebot über 20 m², wo 6 m² beauftragt sind, geht nicht als
  Flüchtigkeitsfehler durch.

**Befund 2 — Aufnahme-Karte und Entwurf zeigen verschiedene Mengen (Flur)**

Auf der Karte stand „Fertigparkett verlegen inkl. 5 % Verschnitt **6.3 m²**", im
Entwurf steht dieselbe Position mit **6,00 m²**. Der Titel verspricht weiterhin
5 % Verschnitt, gerechnet wird ohne.

- Im Wohnzimmer stimmen Karte und Entwurf überein (21 = 21), im Flur nicht. Die
  Menge ändert sich also **zwischen** den beiden Schritten, und nur in einem
  Raum.
- Geldmäßig sind es 12,60 €. Als Fehlerklasse ist es das, was mich stört: Eine
  Position, deren Titel eine Rechnung behauptet, die die Menge nicht enthält.
  Das ist der gleiche Widerspruchstyp wie die „So gerechnet"-Zeile aus PM-031,
  und Legal hat zu genau dieser Sorte gesagt, warum sie im Streitfall teuer
  wird: zwei Zahlen für dieselbe Sache im selben Werkzeug.
- Verdacht: Die nachträglich beantwortete Altbelag-Rückfrage löst eine
  Neuberechnung aus, die den Verschnitt verliert. Bitte in dieser Richtung
  suchen — die Rückfrage kam nach der Karte.

**Befund 3 — Türanzahl: drei Fälle, drei verschiedene Verhaltensweisen**

| Fall | Im Diktat gesagt | Abgezogen |
|---|---|---|
| PM-032 | „jeder Raum hat eine normale Tür" | 1 Tür ✅ |
| PM-035 | „drei Türen gehen da ab" | 1 Tür ❌ |
| PM-036 | keine Tür erwähnt | 0 Türen |

Für sich genommen ist die 11,00 lfdm hier **vertretbar** — ich habe keine Tür
genannt, und unter VOB-012 („nur Öffnungen ab 1,00 m abziehen") wäre es sogar
die richtige Zahl. Kein Befund an dieser Position. Der Befund ist das Muster:
**Die gesprochene Türanzahl kommt nirgends korrekt an.** Mal greift eine
Standardannahme, mal nicht, und wenn drei Türen gesagt werden, wird eine
abgezogen. Wer VOB-012 umsetzt, sollte das gleich mit erledigen, es ist
dieselbe Codestelle.

**Was gut lief:**

1. **Die Sockelleisten bleiben im Wohnzimmer aus** — „im Wohnzimmer bleiben
   sie" wird respektiert. Zweiter Fall in Folge, in dem ein Sockelleisten-
   Ausschluss sitzt.
2. **Der Flur ist vollständig und richtig zugeordnet:** Belag, Altbelag,
   Sockelleisten, alle beim Raum, keine „Allgemein"-Position.
3. **Keine Trittschalldämmung** — bei Parkett und ohne Nennung im Diktat ist
   das genau richtig. Im Vergleich mit PM-035 (dort ausdrücklich genannt, dort
   ergänzt) verhält sich der Auslöser konsistent; das Problem dieser Funktion
   ist ausschließlich, dass sie nur einmal je Angebot läuft.
4. Raummaße beider Räume exakt erkannt (4 × 5 und 1,5 × 4) — hier hat die
   Zahlensprechweise („vier mal eins fünfzig") funktioniert.

**Status PM-036:** ❌ zwei Befunde plus ein Muster-Befund. Wie erwartet der
teuerste Fehler des Batches.

---

#### Fix PM-036, Befund 1 (Head of Product Engineering, 03.09.2026)

**Behoben. Die Soll-Liste des Prüfmeisters steht jetzt 1:1 so im Angebot.**

| Position | Soll | vorher | jetzt |
|---|---|---|---|
| Fertigparkett verlegen — Wohnzimmer (Teilfläche) | 6,30 m² | 21,00 m² | **6,30 m²** |
| Altbelag entfernen — Wohnzimmer | 6,00 m² | 20,00 m² | **6,00 m²** |
| Fertigparkett verlegen — Flur | 6,30 m² | 6,00 m² | **6,30 m²** |
| Altbelag entfernen — Flur | 6,00 m² | 6,00 m² | **6,00 m²** |
| Sockelleisten montieren — Flur | (11,00 ohne genannte Tür) | 11,00 lfdm | **11,00 lfdm** |

**Die Ursache war eine andere als vermutet — das ist der wichtigste Teil
dieser Notiz.** Die Einordnung im Befund lautete: „Bei Konkurrenz gewinnt das
Raummaß, der Flächenwert verliert immer gegen Länge × Breite." Nachgesehen an
den echten Produktionsdaten der Aufnahme (`entwurf_aufnahmen`, Diktat vom
03.09.) sieht die Extraktion so aus:

```
Wohnzimmer: { laenge: 5, breite: 4, flaeche: null }
Flur:       { laenge: 4, breite: 1.5, flaeche: null }
```

**Die sechs Quadratmeter kommen überhaupt nicht an.** Es gibt also keine
Konkurrenz und keinen Verlierer — der Wert existiert an der Stelle nicht mehr,
an der die Rangfolge greifen würde. Grund: Der Extraktions-Prompt weist die KI
ausdrücklich an, `flaeche` NUR zu setzen, wenn keine Länge × Breite genannt
wurde. Werden beide gesagt, wirft sie die Teilfläche weg. Eine Rangfolge in der
Mengen-Engine hätte diesen Fall deshalb **nicht** gelöst — sie hätte nur so
ausgesehen, als hätte sie ihn gelöst. (Die Beobachtung aus PM-035, dass
„vierzehn Quadratmeter" dort korrekt übernommen wird, stimmt und passt genau
dazu: dort gab es kein Maßpaar, also durfte die KI die Fläche behalten.)

**Was jetzt passiert** (`src/lib/teilflaeche.ts`, neu): Die Teilfläche wird
deterministisch aus dem Transkript zurückgeholt, ohne zweiten KI-Aufruf. Jeder
Satz wird dem zuletzt genannten Raum zugeordnet — auch Sätze ohne Raumnamen
(„Ungefähr sechs Quadratmeter") und auch, wenn die Ansage zwischen Räumen hin-
und herspringt, wie in diesem Diktat. Übernommen wird eine Teilfläche nur,
wenn alle vier Bedingungen erfüllt sind:

1. im Abschnitt des Raums steht ein ausdrückliches Einschränkungs-Signal
   („nur", „eine Ecke", „der Rest bleibt liegen", „Teilfläche", „ausbessern",
   „Wasserschaden", „teilweise"),
2. der Raum hat echte Maße (ohne Länge × Breite ist die genannte Fläche
   ohnehin schon die Arbeitsfläche),
3. es gibt **genau einen** Flächenwert, der kleiner ist als der Raum —
   bei zwei Kandidaten wird nicht geraten, sondern gemeldet,
4. der Wert liegt mindestens 0,5 m² unter der Raumfläche.

Die Teilfläche gilt für Verlegen, Altbelag entfernen, Ausgleich, Sperre und
Schleifen. **Der Umfang bleibt bewusst der des ganzen Raums** — Sockelleisten
laufen an allen vier Wänden entlang, auch wenn nur eine Ecke neu verlegt wird.

**Und es passiert nicht still.** Wie bei PM-034 steht die Annahme an der
Position („Nur Teilfläche 6 m² statt der vollen Raumfläche 20 m²") und ein
Hinweis über dem Entwurf, der den gesprochenen Satz wörtlich zitiert und sagt,
wie man es zurückdreht. Beim Zwei-Kandidaten-Fall wird weiterhin mit der vollen
Raumfläche gerechnet und ausdrücklich zum Prüfen aufgefordert — lieber ein
sichtbar zu großes Angebot als ein unsichtbar zu kleines.

**Nebenbefund, den ich beim Umsetzen gefunden habe und der schwerer wiegt als
PM-036 selbst:** Die PM-034-Maßkorrektur („360" → 3,60 m) vom 02.09. hing in
`generiere-positionen/route.ts` — also **hinter** der Mengenberechnung. Sie hat
die gespeicherten Raummaße korrigiert und den Hinweis erzeugt, aber die
Positionen waren zu dem Zeitpunkt längst mit „360 m" gerechnet. Ein Fix, der
aussieht als würde er wirken, und damit exakt die Fehlerklasse, wegen der
PM-010 überhaupt aufgemacht wurde. Beide Reparaturen laufen jetzt in
`extraktion-pipeline.ts`, an der einen Stelle, durch die jeder Weg zur
Mengenberechnung geht (Karte **und** Entwurf). Zwei neue Tests prüfen nicht
mehr die Hilfsfunktion, sondern die Menge, die am Ende im Angebot steht:
„360 mal 3" ergibt 11,34 m², nicht 1.134 m².

**Tests:** `src/lib/__tests__/pm036-teilflaeche.test.ts` (23 Fälle) — darunter
der komplette Weg durch die Pipeline mit den gesprochenen Zahlwörtern
(„sechs Quadratmeter", „fünf mal vier"), und die Gegenrichtung: ohne
Einschränkungs-Signal wird nichts gekürzt, „die Decke hat 6 Quadratmeter Stuck"
löst nichts aus, eine Fläche in Raumgröße zählt nicht als Teilfläche, zwei
Kandidaten führen zur Meldung statt zur Kürzung. Gesamtstand: 76 Testdateien,
1.239 Tests grün, `tsc` sauber, eslint 0 Fehler.

**Was offen bleibt und wofür ich eine Entscheidung brauche:**

1. **Nur Boden.** Die Teilflächen-Erkennung läuft ausschließlich für Räume mit
   Bodenauftrag. Beim Maler wäre dieselbe Sprechweise („nur die eine Wand,
   ungefähr 8 m²") eine Teil-WANDfläche und braucht eine eigene Grenze —
   bewusst nicht mit erledigt, weil ich es nicht an echten Maler-Diktaten
   geprüft habe.
2. **Der Extraktions-Prompt.** Die Wurzel liegt in der Anweisung „`flaeche` NUR
   setzen wenn keine Länge×Breite" (`prompt-extraktion-v4.ts`). Man könnte der
   KI ein eigenes Feld für die Teilfläche geben. Ich habe es NICHT gemacht:
   eine Prompt-Änderung kann ich hier nicht deterministisch testen, und dann
   wäre der Prüfmeister die Regressionsprüfung. Der jetzige Weg braucht die
   KI dafür nicht.

**Befund 2 (Karte 6,3 / Entwurf 6,0) konnte ich an den Daten vom 03.09. nicht
nachstellen** — dort zeigt die Karte für den Flur 6,3 m², also den richtigen
Wert. Karte und Entwurf laufen inzwischen ohnehin durch dieselbe Funktion.
Bitte beim Nachtest gezielt darauf schauen; wenn es wieder auftritt, brauche
ich die Angebotsnummer, dann ist es an den gespeicherten Rohdaten
nachvollziehbar.

**Nicht angefasst:** Befund 3 (Türanzahl) — der hängt an VOB-012 und wird dort
gemeinsam erledigt, wie vom Prüfmeister vorgeschlagen.

---

## Notiz an den Prüfmeister: „Sondermaße / Sonderform (20 %)" (04.09.2026)

**Keine Frage, die auf eine Antwort wartet — eine Entscheidung, der du
widersprechen kannst.** CoS-043 hatte vorgesehen, diesen einen Katalogeintrag
vor der Umstellung auf einen echten Prozentsatz mit dir gegenzuchecken. Die
Umstellung lief allerdings schon am 01.09., also drei Tage vor dem Ticket.

Sandy hat entschieden, es **bei Prozent zu belassen**, mit dieser Begründung:
Sondermaße beim Schreiner sind ein Aufwandszuschlag, keine feste Gebühr. Eine
Sonderanfertigung kostet anteilig mehr; 20 € pauschal auf eine 9.500-€-Treppe
wären offensichtlich falsch. Dieselbe Familie wie „Aufpreis exotische Holzart
40 %".

Wenn du das fachlich anders siehst — etwa weil „Sondermaß" in der Praxis ein
fester Rüst-/Einrichtaufwand an der Maschine ist, unabhängig von der Größe des
Stücks —, sag Bescheid. Es ist eine Zeile im Katalog und eine in der
Datenbank, zurückgedreht in fünf Minuten.

Mitentschieden und ebenfalls ohne Rückfrage umgesetzt: Dieser Zuschlag rechnet
seit heute nur noch auf **Leistungen desselben Gewerks**, nicht mehr auf das
ganze Angebot — genau wie Denkmalschutz und die exotische Holzart. Die
zeitbezogenen Zuschläge (Wochenende, Feiertag, Notdienst) rechnen weiterhin auf
alles, weil sie daran hängen, wann gearbeitet wird, nicht woran.

---

## VOB-012 umgesetzt: die Sockelleisten-Sollwerte haben sich geändert (04.09.2026)

**Bitte vor dem nächsten Nachtest lesen.** Mit CoS-042 ist der gekaufte
Normtext ausgewertet, und DIN 18363/18365 (jeweils Abschnitt 5.3.2) sagen:
**Unterbrechungen bis 1 m Einzellänge werden bei der Sockelleisten-Länge nicht
abgezogen.** Eine Standard-Zimmertür ist 0,90 m breit und fällt darunter.

Das Tool zog bisher jede Türbreite voll ab. Ab jetzt nicht mehr — die Folge ist,
dass **jeder Sockelleisten-Sollwert in dieser Datei um 0,90 lfdm je Standardtür
größer ist als bisher dokumentiert**, zugunsten des Betriebs, der die Leiste ja
durchgehend verlegt. Betroffen sind PM-001, PM-002b, PM-012, PM-021, PM-022,
PM-023, PM-024, PM-025, PM-026, PM-028, PM-032 und PM-035.

Zwei Dinge zur Einordnung:

- **Das ist keine Auslegung mehr, sondern Normtext.** Der Punkt war bis zum
  03.09. als Preis-Entscheidung für Sandy gelistet; mit der gekauften VOB ist
  er beantwortet. Der Prüfmeister hatte es für PM-035 bereits vorweggenommen:
  „Wird VOB-012 entschieden, sind es 18,40 lfdm."
- **Breite Öffnungen werden weiterhin abgezogen.** PM-021 belegt beide
  Richtungen in einem Fall: Die Normaltür (0,90 m) bleibt jetzt drin, die
  Breitterrassentür (2,00 m) wird abgezogen — 22,00 → 20,00 lfdm.

Die Soll-Werte im Code (`pruefmeister-soll.test.ts`, Golden Tests) sind mit
Normverweis nachgezogen; die einzelnen Fall-Abschnitte weiter unten tragen
noch die alten Zahlen und werden beim jeweiligen Nachtest aktualisiert.

---

## Umbau statt sechster Einzelreparatur (Head of Product Engineering, 03.09.2026)

**Sandys Auftrag:** „Befund 4 jetzt als kleinen Einzelfix, danach die
Vollständigkeitsprüfung raumweise umbauen statt weiter Fälle einzeln
abzuarbeiten." Beides ist umgesetzt. Was damit erledigt ist, steht unten je
Fall; hier die gemeinsame Ursache, weil sie das Eigentliche ist.

### Die gemeinsame Ursache

Die Boden-Vollständigkeitsprüfung besteht aus dreizehn Regeln. Bis heute
bekamen **zwölf davon keinerlei Rauminformation**: Sie liefen einmal über das
gesamte Transkript und die gesamte Positionsliste und hängten ihr Ergebnis
hinterher irgendeinem Raum an. Für einen Einzelraum ist das richtig — dafür
sind sie geschrieben und getestet. Bei mehreren Räumen ist es die gemeinsame
Ursache von fünf Befunden dieses Batches:

| Befund | Erscheinungsform |
|---|---|
| PM-032/033/035 | Trittschalldämmung nur im ersten Raum, dreimal belegt |
| PM-033 | Sockelleisten unter „Allgemein" mit einem Umfang, den es in keinem Raum gibt |
| PM-034 Befund 5 | Grundierung im Esszimmer fehlt |
| PM-033/036 | offene Punkte („fehlende") ohne Raumbezug, deshalb nur einmal statt je Raum |

Die Trittschalldämmung wurde deshalb **dreimal** repariert (PM-004, PM-023,
PM-032) — jedes Mal für *einen* Raum, jedes Mal kam sie beim nächsten
Mehrraum-Fall zurück. Der Prüfmeister hat das im Fazit als Muster benannt
(„Position → Raum"), und er hat recht: Weiter einzeln zu flicken hätte Runde
vier erzeugt.

### Was geändert wurde

Bei **mehreren Räumen** wird jeder Raum jetzt als eigene, kleine Welt geprüft:
seine Sätze aus dem Diktat, seine Positionen, sein eigenes Auftrags-
Verständnis (Belag und Altbelag aus *seinem* Abschnitt, nicht aus dem global
zusammengefassten Signal). Bei einem Raum bleibt alles wie bisher.

**Die dreizehn Regeln selbst sind unverändert.** Sie waren nie falsch; sie
haben nur eine Mehrraum-Welt vorgesetzt bekommen, für die sie nicht gebaut
sind. Der Umbau ist deshalb ein Verteiler und keine Neufassung — jede Regel
behält ihr Verhalten und ihre Tests.

**Drei Prüfungen laufen bewusst weiterhin über den ganzen Auftrag**, weil sie
von Natur aus zwischen Räumen stattfinden, und das ist im Code benannt:

- **Übergangsschiene** — sie sitzt an der Grenze zweier Räume. Je Raum geprüft
  hieße: an jeder Zimmertür eine erfinden. Genau die Falle aus PM-032.
- **Trittschalldämmung** — die Ansage fällt einmal für den ganzen Auftrag
  („überall dasselbe Klick-Vinyl … Trittschalldämmung drunter") und verteilt
  sich dann auf alle Räume. Die Funktion kann das seit dem PM-032/033-Fix
  selbst; je Raum aufgerufen landete die eine Ansage wieder in genau einem
  Raum — also der alte Fehler in neuem Gewand. (Beim Umbau genau so passiert
  und vom Test gefangen.)
- **Fußbodenheizung und Treppe** — Gegenstände des Auftrags, nicht eines Raums.

Ein zweiter Fund beim Umbau, der zeigt, wie dünn das Eis war: Der Flur eines
Maler-Auftrags („nur Wände und Decke streichen, da wird nix am Boden gemacht")
war bisher **aus Versehen** geschützt — die Verlege-Position des
Nachbarzimmers ließ die Regel früh aussteigen. Mit der Raumtrennung fällt
dieser Zufallsschutz weg, und der Flur bekam eine erfundene „Bodenbelag
verlegen 9 m²". Deshalb prüft der Verteiler jetzt je Raum dasselbe Signal, das
auch die Mengen-Engine für einen echten Belagauftrag verlangt (importiert,
nicht nachgebaut). Der PM-013-Test hat den Fehler sofort gefangen.

### Was damit im Batch grün wird

**PM-032 — vollständig grün.** Trittschalldämmung jetzt in allen drei Räumen
(Flur 7,20 + Wohnzimmer 20,00 + Küche 8,40 = **35,60 m²**, vorher 7,20), genau
**eine** Übergangsschiene, Belag 37,38 m² und Sockelleisten 41,30 lfdm
unverändert exakt Soll, kein Bad.

**PM-033 — Befund 2 und 3 erledigt.** Keine erfundenen Sockelleisten mehr
(siehe Fix oben), und die Übergangsschienen sind **2 statt 1**.
Dazu die Antwort auf die Frage des Prüfmeisters, ob PM-032 nur ein
Zufallstreffer war: **war es nicht.** Die Anzahl wird aus dem Satz gelesen, in
dem der Übergang vorkommt — sie ist nicht pauschal 1. Gefehlt hat allein die
Sprechweise „an den **beiden** Türen … **jeweils eine**": Das „eine" wurde
richtig gelesen, ist aber die Zahl *pro Tür*. Bei einem „jeweils/je" zählt
jetzt die Zahl der Türen davor.

**PM-034 — Befund 4 und 5 erledigt.**
*Befund 4:* Die drei Maler-Spachtelpositionen sind weg. Ursache war die
Gewerke-Erkennung: Die Küche trägt „boden spachteln", das Esszimmer
„grundierung" — beide trafen das Maler-Wortmuster, also lief die komplette
Maler-Prüfung über einen reinen Bodenauftrag. Gegen alle gespeicherten
Extraktionen geprüft: Von sechs Einträgen, die das alte Muster treffen, nennen
vier ihr Objekt selbst („wände grundieren", „decke spachteln q3" …) — die
bleiben unverändert Malerarbeit. Nur die beiden anderen ändern ihr Verhalten.
Die Richtung ist bewusst asymmetrisch: Eine fälschlich **weggelassene**
Maler-Position kostet den Betrieb Geld und fällt niemandem auf, deshalb bleibt
jedes eindeutige Maler-Wort ohne Bedingung stehen; nur die mehrdeutigen Wörter
(spachteln, glätten, grundieren) brauchen ein Objekt.
*Befund 5:* „Estrich grundieren — Esszimmer" steht jetzt mit **14,00 m²** im
Angebot. Es waren zwei unabhängige Ursachen: Der Untergrund-Block las seine
Fläche ausschließlich aus dem Text (wo die gesprochene Form nicht als Maßpaar
ankam), und er lief global. Seit er je Raum läuft, ist die Verlegefläche
dieses Raums eindeutig — sie steht bereits berechnet in seiner eigenen
Position, mit korrekt herausgerechnetem Verschnitt.

**Gesamtstand:** 79 Testdateien, 1.277 Tests grün, `tsc` sauber, eslint 0
Fehler. Neue Testdatei
`src/lib/vollstaendigkeit/__tests__/raumweise-vollstaendigkeit.test.ts`
(16 Fälle) mit den Original-Diktaten des Prüfmeisters und der Gegenrichtung.

### Nachtrag am selben Tag: der Dezimalpunkt (gefunden beim Durchgehen der offenen Fälle)

Beim Prüfen, ob der PM-023-Fund („Trittschalldämmungs-Flächenverwechslung,
situativ") durch den Umbau erledigt ist, ist ein Fehler aufgefallen, der die
ganze Arbeit dieser Woche unterlaufen hat:

**Ein Punkt zwischen Ziffern ist ein Dezimaltrennzeichen, kein Satzende.**
Unsere eigene Zahlen-Vorverarbeitung macht aus „vier mal dreieinhalb" ein
„4 mal 3.5", und die echten Produktionstranskripte enthalten denselben Punkt
direkt — im PM-036-Diktat steht wörtlich „Im Flur daneben **4 mal 1.50** kommt
der Boden komplett neu". Jedes naive Trennen an „." zerlegt damit **mitten in
der Maßangabe**, und alles, was danach im Satz steht, verliert seinen
Raumbezug.

Konkret: „Flur, 4 mal 3.5, Laminat gerade verlegt, Trittschalldämmung drunter"
zerfiel in „Flur, 4 mal 3" und „5, laminat gerade verlegt, trittschalldämmung
drunter". Im zweiten Stück steht der Raumname nicht mehr — also galt die
Ansage als raumlos und die Dämmung ging wieder in **alle** Räume statt in den
genannten. Der Fehler, der schon dreimal repariert wurde, durch die Hintertür,
und zwar in genau der Funktion, die ihn beheben sollte.

Betroffen war jede Auswertung, die satzweise liest — also auch die
Teilflächen-Erkennung (PM-036), der Sockelleisten-Ausschluss (PM-033), die
Erkennung abbestellter Räume (PM-034) und die Zählung der Übergangsschienen.
Dass die genannten Fälle trotzdem grün waren, lag am Zufall: Dort stand
entweder ein Komma („4 mal 1,50" im Rohtext) oder die entscheidende Aussage
vor der Maßangabe.

Behoben in `src/lib/satz-raum.ts`: Ziffer-Punkt-Ziffer wird vor dem Trennen
geschützt. Alle vier Stellen, die vorher eigene `split(/[.!?;]/)`-Aufrufe
hatten, benutzen jetzt diesen einen Splitter — `raumAusDaemmungsSatz`,
`pruefeUebergangsprofil`, `findeRaumImSatz` und die satzweise Raumzuordnung
selbst. Drei zusätzliche Tests halten es fest.

**Damit ist auch der offene PM-023-Fund erledigt:** Bei der Paarung Flur
(Laminat + Trittschall) und Gästezimmer (Vinyl Fischgrät) steht die Dämmung
jetzt genau einmal, im Flur, mit 14,00 m² — der Fläche dieses Raums.

---

### Was der Umbau NICHT erledigt — und warum

Ich hatte gegenüber Sandy gesagt, der Umbau schließe „auch den L-Form-Rest".
**Das war zu weit gegriffen, und ich korrigiere es hier:**

- **PM-035, L-förmiger Flur.** Der zweite Schenkel verschwindet stumm. Das ist
  keine Frage der Raumtrennung, sondern eine fehlende Geometrie: Ein Raum kann
  im Datenmodell nur ein Rechteck sein. Dafür gibt es einen eigenen Weg
  (Grundriss-Editor, `raum-geometrie.ts`), an den „L-förmig" angeschlossen
  werden müsste. Eigenes Stück Arbeit, unangetastet.
- **PM-033, Trittschall-Kurzform.** „Trittschall nur unterm Laminat im Flur"
  löst weiterhin nichts aus, weil der Auslöser das ganze Wort
  „Trittschalldämmung" verlangt. Das ist die offene Frage an den Prüfmeister
  von letzter Woche (soll die Kurzform auslösen, und welche Beläge bekommen
  gar keine Dämmung) — ich beantworte sie nicht selbst.
- **PM-035, Türanzahl und Sockelleisten-Umfang.** Hängt an VOB-012, dort
  gemeinsam zu erledigen.

---

## Fazit Boden-Batch PM-032 bis PM-036 (Prüfmeister, 2026-09-02)

**Fünf Fälle eingesprochen, kein einziger grün. 14 Befunde.** Das klingt
schlimmer, als es ist — deshalb die Einordnung, die ich für wichtiger halte als
die Zahl:

**Was durchgehend solide ist:** Jede Mengenformel, die einen Raum kennt,
stimmt auf den Cent. Verschnittsätze (15 / 5 / 0 %) sitzen und schwappen nicht
zwischen Räumen über. Abbruch- und Ausgleichsflächen tragen korrekt keinen
Verschnitt. Die Raumtrennung bei Untergrundarbeiten funktioniert. Die
Altbelag-Rückfrage kommt je Raum und bleibt in ihrem Raum. Sockelleisten-
Ausschlüsse werden respektiert. Rechnen kann das Ding.

**Wo es reihenweise bricht, sind die zwei Schritte davor und danach:**

1. **Sprache → Zahl.** „drei sechzig" → 360, „drei fünfzig" → 350, „sechs Meter
   mal eins zwanzig" → 6 × 1, „sechs Quadratmeter Teilfläche" → 20 m²,
   L-Form → Rechteck, „drei Türen" → eine. Fünf verschiedene Muster, alle in
   derselben Stufe. Das ist die teuerste Baustelle: In PM-034 stand ein Angebot
   über 91.085 € statt 900 €, in PM-036 eines über das Doppelte.
2. **Position → Raum.** Trittschall nur im ersten Raum (dreimal belegt),
   Sockelleisten unter „Allgemein" mit einem Umfang aus zwei Räumen,
   Maler-Spachtelpositionen in einem Bodenauftrag, ein Ausschlusssatz als
   Raumname. Immer dann, wenn eine Position ohne Raumbezug erzeugt und
   nachträglich zugeordnet wird, geht es schief.

**Meine Priorisierung für Head of Product Engineering:**

| # | Was | Warum zuerst |
|---|---|---|
| 1 | **Weiter-Button bei aktiver Warnung** (PM-034) | Blocker. Ohne den Umweg über den gelben Kasten kommt niemand zum Entwurf |
| 2 | **Teilfläche schlägt Raummaß** (PM-036) | Häufigster Reparaturauftrag, Faktor 2 auf dem Angebot, Versicherung liest mit |
| 3 | **Zahlenerkennung** (PM-034/035) | Betrifft jeden Fall mit Maßen; die „Meter-in-der-Mitte"-Spur ist billig zu prüfen |
| 4 | **Trittschall-Schleife statt `find`** (PM-032/033/035) | Dreifach belegt, eine Zeile Code, Geld in beide Richtungen |
| 5 | Rest (Ausschlusssatz als Raum, Q2-Phantompositionen, L-Form, Grundierung, Türanzahl, Karte ≠ Entwurf) | einzeln kleiner, alle gut lokalisiert |

**Was Sandy entscheiden muss:** die Zahlenerkennung (automatisch korrigieren mit
sichtbarer Annahme statt nur warnen — siehe PM-034, Befund 2) und VOB-012, an
dem die Türanzahl mit hängt.

## Fix 1 von 5 aus dem Boden-Batch: Trittschalldämmung (2026-09-03)

Head of Product Engineering. Ich habe mit dem Befund angefangen, den du aus
**drei** Richtungen belegt hast — PM-032, PM-033 Befund 1 und PM-035 Befund 4
sind derselbe Fehler an derselben Stelle.

**Deine Fundstelle war exakt richtig.** `pruefeTrittschalldaemmung()` nahm mit
`ergaenzt.find(...)` die **erste** Verlegeposition und baute daraus **eine**
Dämmung. In PM-032 war die erste zufällig die richtige — deshalb sah der Fall
grün aus, obwohl in zwei von drei Räumen die Dämmung fehlte.

**Neue Regel, in dieser Reihenfolge:**

1. Nennt der Satz mit der Dämmung einen Raum, gilt **ausschließlich** dieser
   Raum. Gelesen wird satzweise, nicht über das ganze Transkript — sonst zieht
   ein Raumname zwei Sätze weiter die Dämmung wieder in den falschen Raum.
   Das ist deine Rangordnung „Ansage vor Struktur vor Rohtext".
2. Sonst: **jeder** verlegte Boden, der Trittschall bekommt — je Raum eine
   eigene Position mit Raumbezug im Titel.

Fläche immer **ohne Verschnitt**, wie von dir vorgegeben: PM-032 ergibt jetzt
7,20 + 20,00 + 8,40 = **35,60 m²** in drei Positionen, nicht 37,38 und nicht
7,20.

**Eine Entscheidung, die ich nicht allein treffen wollte:** Teppich und
Nadelvlies habe ich von der Dämmung ausgenommen (Bahnenware wird geklebt).
Eine längere Ausschlussliste — geklebtes Parkett, Linoleum — wäre fachlich
diskutabel, und die erfinde ich nicht. **Sag mir, welche Beläge in der Praxis
keine Trittschalldämmung bekommen**, dann trage ich es nach.

**Und eine Rückfrage zu deinem Wortlaut:** Du protokollierst „Trittschall nur
unterm Laminat im Flur". Ausgelöst wird die Position aber nur vom vollen Wort
„Trittschalldämmung" — dein Diktat muss es also enthalten haben, sonst wäre gar
keine entstanden. **Soll die Kurzform „Trittschall" ebenfalls auslösen?** Ich
habe es NICHT geändert: „ohne Trittschall" würde dann genauso auslösen, denn
eine Verneinung wertet die Prüfung heute nicht aus. Das ist dieselbe Familie
wie dein Befund 2 (Sockelleisten gegen Ausschluss) und gehört zusammen gelöst,
nicht einzeln.

**Abgesichert:** `pm032-036-trittschall.test.ts`, 10 Tests — die drei Räume aus
PM-032 mit der Summe 35,60, der Flur-Fall aus PM-033 samt Gegenprobe, dass das
Wohnzimmer leer bleibt, Teppich ohne Dämmung, und die Satz-Trennung selbst.
Suite 73 Dateien / 1.197 Tests grün.

### Was aus dem Batch NICHT gefixt ist

Ehrlich und nach meiner Einschätzung der Dringlichkeit sortiert:

1. **PM-034: „Weiter" führt nicht zum Entwurf.** Ein Blocker schlägt jeden
   Rechenfehler — solange der Weg nicht funktioniert, ist der Rest egal.
2. **PM-036: Teilfläche wird ignoriert, das Raummaß gewinnt.** 21 m² statt
   6,30 m², 785,40 € zu viel. Der teuerste Einzelfehler im Batch.
3. **PM-033/034: „drei sechzig" → 360, „drei fünfzig" → 350, „sechs Meter mal
   eins zwanzig" → 6 × 1.** Zahlwort-Erkennung, drei Belege in zwei Fällen.
4. **Sockelleisten gegen ausdrücklichen Ausschluss** (PM-033), plus falscher
   Umfang und 1 von 3 Türen (PM-035).
5. **Übergangsschiene: 1 pauschal statt gezählt.** Dein Verdacht stimmt
   vermutlich — bis das geprüft ist, gilt PM-032 in diesem Punkt als
   ungeklärt, nicht als bestanden. Danke für den Hinweis, dass dein eigenes
   „bestanden" ein Glückstreffer gewesen sein könnte; genau so eine Meldung
   ist mehr wert als ein grüner Haken.
6. **PM-034: Ausschlusssatz wird zum Raumnamen, Maler-Spachtelpositionen im
   Bodenauftrag, fehlende Grundierung.**

---

## PM-034 Befund 1 behoben — der Blocker (2026-09-03)

Head of Product Engineering, direkt im Anschluss. Sandys Beobachtung stimmt bis
ins Detail, die Erklärung ist aber eine andere als vermutet: **Der Knopf war
weder deaktiviert noch lief er ins Leere. Er war in einer Schleife.**

**Was passiert ist**

1. Erster Druck auf „Entwurf erstellen" → die Positionen werden berechnet, die
   Antwort enthält Plausibilitätswarnungen → Warnung anzeigen, zurück zur
   Timeline. **Das ist richtig und bleibt so** — es ist genau die Regel aus
   PM-010: „nicht sofort weiterleiten, sonst sieht sie die Warnung nie."
2. Zweiter Druck auf denselben Knopf → dieselbe Berechnung, dieselben
   Warnungen, dieselbe Anzeige, wieder Timeline.
3. Und so weiter, beliebig oft.

Der Kommentar über der Warnung sagt „blockiert nie, nur ein Hinweis". In
Wirklichkeit blockierte sie dauerhaft — der einzige Ausweg war der Link
„Trotzdem weiter zum Angebot", also ausgerechnet die Stelle, die als Notausgang
gedacht war. Für den Nutzer ist „Knopf tut nichts" nicht von „Knopf ist tot" zu
unterscheiden; deine Einordnung als Blocker war goldrichtig.

**Was jetzt gilt**

- **Einmal zeigen, dann durchlassen.** Wer den Knopf nach der Warnung erneut
  drückt, hat sie gelesen und will weiter.
- **Der Knopf sagt es auch:** Solange die Warnung steht, heißt die Unterzeile
  „Trotzdem weiter zum Entwurf" — dieselbe Wortwahl wie der Link im gelben
  Kasten, damit erkennbar ist, dass beide dasselbe tun.
- **Eine neue Aufnahme setzt den Merker zurück.** Neue Zahlen, neue Warnung,
  die soll wieder einmal gesehen werden.

Gemerkt wird das in einem Ref, nicht in einem State: Die Entscheidung fällt
mitten in einem asynchronen Ablauf, und genau dort war heute schon einmal ein
eingefrorener State die Ursache eines Fehlers (die nie gespeicherte
Aufnahmedauer).

**Abgesichert:** `pm034-warnung-blocker.test.ts`, 5 Tests — erster Durchgang
zeigt, zweiter leitet weiter, auch bei geändertem Wortlaut; ohne Warnung geht
es sofort weiter; eine neue Aufnahme macht die Warnung wieder sichtbar.
Suite 74 Dateien / 1.202 Tests grün.

**Bitte im Nachtest ausdrücklich prüfen:** dass die Warnung beim ersten Mal
noch kommt. Der Fix darf sie nicht wegräumen — sie hat in PM-034 zweimal
korrekt angeschlagen und mit der richtigen Vermutung im Text. Das ist der
wertvollste Teil dieses Falls und soll bleiben.

**Weiterhin offen aus PM-034:** „drei sechzig" → 360 und „drei fünfzig" → 350
(dein Punkt, dass das die normale Sprechweise auf dem Bau ist und die
PM-010-Einordnung damit nicht mehr trägt, überzeugt mich — das ist der nächste
Fall, den ich nehme, wenn Sandy nichts anderes sagt), der Ausschlusssatz als
Raumname, die drei Maler-Spachtelpositionen im Bodenauftrag und die fehlende
Grundierung im Esszimmer.

---

## PM-034 Befund 2 behoben — „drei sechzig" wird nicht mehr 360 (2026-09-03)

Du hattest recht, und zwar aus einem anderen Grund, als die alte Einordnung
annahm.

**Zuerst der Beleg, weil er die Ursache verschiebt.** Ich habe die echten
Transkripte vom 02./03.09. angesehen. Whisper schreibt im **selben** Batch:

| Diktat | Transkript |
|---|---|
| „Wohnzimmer sechs mal vier fünfzig" | `6 x 4,50` ✅ |
| „Küche drei mal zwo achtzig" | `3 x 2,80` ✅ |
| **„Küche drei sechzig mal drei"** | **`360 x 3`** ❌ |
| **„Esszimmer vier mal drei fünfzig"** | **`4 x 350`** ❌ |

Der Fehler entsteht also **in der Spracherkennung**, nicht bei uns — und er ist
unzuverlässig, mal so, mal so. Damit ist auch klar, warum die Reparatur über
Zahlwörter nie greifen konnte: Im Text stehen längst keine Wörter mehr, sondern
`360`. Der Kommentar in `mass-plausibilitaet.ts` („mit Text-Nachbearbeitung
grundsätzlich nicht zuverlässig zu fangen") beschrieb den Zustand richtig — er
zog nur den falschen Schluss daraus.

**Was jetzt passiert:** Eine Raumseite, die als Meterangabe unmöglich ist, wird
korrigiert, statt nur bemängelt. Küche 360 → **3,60 m**, Esszimmer 350 →
**3,50 m**.

**Die Grenzen sind bewusst eng gezogen:**

- nur **Raumseiten** — ein 120 m langer Zaun ist keine Raumseite und bleibt,
- nur **ganze Zahlen mit drei oder vier Ziffern** — `350,5` hat Whisper
  offensichtlich verstanden und wird nicht angefasst,
- nur wenn das Ergebnis danach **plausibel** ist (0,5 bis 15 m); `20` wird
  nicht zu `0,20`,
- **niemals still**: jede Korrektur erzeugt einen Hinweis im selben gelben
  Kasten wie bisher, im Wortlaut „Küche: Länge ‚360' als 3,60 m gelesen — so
  wird ‚3 60' auf dem Bau gesprochen. Stimmt das nicht, bitte hier
  korrigieren."

**Deine Warnung bleibt erhalten**, für alles, was sich nicht eindeutig
korrigieren lässt: Eine Halle mit 40 m Seitenlänge wird weiterhin nur
bemängelt, nicht umgerechnet — dort ist keine Sprechweise erkennbar. Genau
diese Trennung prüft ein eigener Test.

**Abgesichert:** `pm034-massrepratur.test.ts`, 10 Tests — beide PM-034-Fälle,
weitere Sprechweisen (`120`, `280`, `1250`), und vor allem die Gegenrichtung:
was nicht angefasst werden darf. Suite 75 Dateien / 1.212 Tests grün.

**Was ich NICHT geändert habe und wo ich deine Einschätzung brauche:**

1. **Raumhöhen.** Dieselbe Sprechweise gilt für „zwei sechzig" als Höhe. Die
   Prüfung kennt heute nur Länge und Breite. Bei Höhen ist die plausible
   Spanne enger (etwa 2,00 bis 4,00 m) — soll ich sie mit denselben Regeln
   aufnehmen?
2. **Der Whisper-Prompt.** Er sagt heute nur „Dezimaltrennzeichen ist Komma".
   Man könnte Beispiele ergänzen („drei sechzig → 3,60"). Das würde die
   Fehlerquelle verkleinern statt nur die Folge zu reparieren — aber
   Prompt-Änderungen wirken nie zuverlässig, und ich möchte die Korrektur
   oben nicht dadurch schwächen, dass sie seltener gebraucht wird und damit
   seltener auffällt, wenn sie falsch liegt. Deine Meinung?

---

---

### PM-032 — Nachtest nach dem Umbau (Sandy, 2026-09-03)

**Der Trittschall-Fix sitzt.** Alle drei Räume haben jetzt eine Dämmung, jede
mit der Fläche ihres eigenen Raums und ohne Verschnitt:

| Raum | Belag | Sockelleisten | Trittschalldämmung |
|---|---|---|---|
| Flur | 7,56 m² ✅ | 13,50 lfdm ✅ | **7,20 m²** ✅ |
| Wohnzimmer | 21,00 m² ✅ | 17,10 lfdm ✅ | **20,00 m²** ✅ (vorher: fehlte) |
| Küche | 8,82 m² ✅ | 10,70 lfdm ✅ | **8,40 m²** ✅ (vorher: fehlte) |

Summe Dämmung **35,60 m²** — exakt die Soll-Zahl. Belag 37,38 m², Sockelleisten
41,30 lfdm, Raummaße alle exakt, Altbelag-Rückfragen wieder sauber je Raum.
Jede einzelne Zahl in diesem Angebot stimmt.

Damit ist der Befund aus PM-032 bestätigt behoben, und die Ursache für PM-033
und PM-035 gleich mit — die Funktion läuft jetzt je Raum statt einmal je
Angebot.

**Übergangsschiene: geklärt, kein Befund.**

Die Karte meldet 10 Positionen, der Entwurf enthält alle 10 — die Schiene steht
unter „Allgemein" mit 1 Stück × 15,00 €, wie beim ersten Durchlauf. Mein
Zwischenverdacht auf einen Rückfall in die PD-004-Familie („X Positionen
erkannt" ≠ geliefert) war ein Lesefehler auf meiner Seite: Im ersten
weitergegebenen Auszug fehlte der letzte Block. Festgehalten, weil die
Vermutung im Protokoll stand und nicht unkommentiert stehenbleiben soll.

Damit ist auch die Frage von letzter Woche beantwortet, ob die eine Schiene in
PM-032 nur ein Zufallstreffer war: Sie ist es nicht. Der Engineer hat die
Zählung inzwischen belegt, und dieser Durchlauf bestätigt sie an einem Angebot
mit drei Räumen und genau einem Belagwechsel.

**Status PM-032:** ✅ **vollständig grün.** Trittschalldämmung in allen drei
Räumen (35,60 m²), Belag 37,38 m², Sockelleisten 41,30 lfdm, genau eine
Übergangsschiene, kein Bad, keine Fremdpositionen. Jede Zahl exakt Soll,
Gesamtsumme 1.000,43 € netto. Erster grüner Fall des Boden-Batches.

---

## Soll-Zahlen nachgezogen: VOB-012 ist entschieden (Prüfmeister, 2026-09-04)

Head of Legal hat den Normtext ausgewertet, Head of Product Engineering hat es
umgesetzt: **Von der Sockelleistenlänge werden nur noch Öffnungen ab 1,00 m
abgezogen** (DIN 18363/18365, jeweils 5.3.2). Eine Standard-Zimmertür mit
0,90 m fällt darunter und wird durchgemessen. Ich habe beide Codestellen
nachgesehen — die Inline-Variante in `maler.ts` ist weg, alles läuft über
`berechneSockelleistenLaenge()`, und die Funktion kennt jetzt auch `anzahl`.

**Damit sind alle meine Soll-Zahlen mit `[VOB-012]` überholt.** Hier stehen die
neuen. Die alten Werte bleiben in den jeweiligen Fällen stehen, damit der
Ist-Vergleich der bereits gelaufenen Tests nachvollziehbar bleibt — **maßgeblich
ist ab sofort diese Tabelle.**

| Fall | Position | alt (mit Türabzug) | **neu (durchgemessen)** |
|---|---|---|---|
| PM-002 | Sockelleisten montieren | 14,10 lfdm | **15,00 lfdm** |
| PM-006 | Sockelleisten abkleben | 11,10 lfdm | **12,00 lfdm** |
| PM-010 | Sockelleisten entfernen / montieren / streichen (je) | 12,10 lfdm | **13,00 lfdm** |
| PM-011 | Sockelleisten abkleben | 13,50 lfdm | **14,40 lfdm** |
| PM-013 Flur | Sockelleisten abkleben | 12,70 lfdm | **13,60 lfdm** |
| PM-018 | Sockelleisten abkleben | 14,10 lfdm | **15,00 lfdm** |
| PM-032 | Sockelleisten montieren, Flur / Wohnzimmer / Küche | 13,50 / 17,10 / 10,70 = 41,30 | **14,40 / 18,00 / 11,60 = 44,00 lfdm** |
| PM-034 | Sockelleisten montieren, Küche / Esszimmer | 12,30 / 14,10 = 26,40 | **13,20 / 15,00 = 28,20 lfdm** |
| PM-035 | Sockelleisten montieren, Flur (L-Form) | 15,70 lfdm | **18,40 lfdm** |
| PM-036 | Sockelleisten montieren, Flur | 10,10 lfdm | **11,00 lfdm** — war schon richtig, weil keine Tür genannt war |

PM-033 ist nicht betroffen (dort darf gar keine Sockelleisten-Position
entstehen).

**PM-032 geht zurück auf 🟡.** Der Nachtest lief am 03.09., der Fix kam am
04.09. — die dort bestätigten 41,30 lfdm sind seit heute nicht mehr das Soll.
Alles andere an dem Fall bleibt bestätigt (Trittschall in allen drei Räumen,
Belag, Übergangsschiene). Zu prüfen ist genau eine Zahl: **44,00 lfdm über die
drei Räume.**

Das ist derselbe Fehlertyp, den ich am 02.09. an meinen eigenen Soll-Texten
festgestellt und Legal zwei Tage später an seinem Bericht vorgehalten habe:
Eine Entscheidung wird umgesetzt, die Tests werden nachgezogen, und die Prosa
daneben bleibt auf dem alten Stand. Ein grüner Haken auf einer überholten Zahl
ist schlimmer als gar keiner — deshalb steht der Fall lieber wieder offen.

**Für Head of Product Engineering:** Der PM-035-Befund „drei Türen gesagt, eine
abgezogen" ist mit derselben Änderung erledigt, weil `anzahl` jetzt gelesen
wird. Nachzuweisen ist er trotzdem erst im Nachtest — bei PM-035 hängt die
Sockelleistenzahl zusätzlich an der L-Form, die unangetastet ist.

---

## Nachtest-Plan nach den Fixes vom 03./04.09. (Prüfmeister, 2026-09-04)

Was seit den letzten Live-Tests geändert wurde und **welcher Fall deshalb neu
eingesprochen werden muss**. Sortiert nach Nutzen, nicht nach Fallnummer.

**Die Auslöser, damit nachvollziehbar ist, warum ein Fall in der Liste steht:**

| Änderung | Datum | Wirkt auf |
|---|---|---|
| Raumweise Vollständigkeitsprüfung (Trittschall, Sockelleisten, Schienen, Grundierung, Gewerke-Erkennung) | 03.09. | jeden Mehrraum-Fall |
| Dezimalpunkt beim Satztrennen (`satz-raum.ts`) | 03.09. | jede satzweise Auswertung: Teilfläche, Ausschlüsse, Raumzuordnung |
| Blocker „Weiter" bei aktiver Warnung | 03.09. | PM-034 |
| Zahlwort-Korrektur 360 → 3,60 | 03.09. | jeden Fall mit dreistelliger Fehlerkennung |
| VOB-012: keine Türbreiten mehr abziehen | 04.09. | **jeden Fall mit Sockelleisten** |
| VOB-013: Leibungen dreiseitig, Fensterbank nicht doppelt | 03.09. | **von keinem Testfall abgedeckt** |
| CoS-043: objektbezogene Zuschläge nur noch aufs eigene Gewerk | 04.09. | Fälle mit Erschwerniszuschlägen |

---

### Stufe 1 — voll einsprechen, mehrere Fixes gleichzeitig (5 Fälle)

| Fall | Was zu prüfen ist |
|---|---|
| **PM-033** | Zwei Übergangsschienen statt einer · keine erfundenen Sockelleisten · Verschnittsätze weiterhin 15/0/5 % · **offen bleibt** die Dämmung im Flur (Kurzform „Trittschall" löst nicht aus) |
| **PM-034** | Kommt man jetzt mit dem normalen Button zum Entwurf? · Küche 3,60 statt 360, Esszimmer 3,50 statt 350 · keine Wandspachtel-Positionen mehr · Grundierung Esszimmer 14,00 m² · Sockelleisten **28,20 lfdm** · taucht „Im Flur machen wir nichts" noch als Raum auf? |
| **PM-036** | **Teilfläche 6,30 m² statt 21,00** — der Dezimalpunkt-Fix betraf genau dieses Diktat („4 mal 1.50") · Altbelag Wohnzimmer 6,00 statt 20,00 · Sockelleisten 11,00 lfdm · Karte und Entwurf müssen dieselbe Menge zeigen |
| **PM-035** | Sockelleisten **18,40 lfdm** (Türanzahl wird jetzt gelesen) · **L-Form bleibt offen**, der zweite Schenkel wird weiterhin fehlen — Kontrollprobe, dass nichts Neues kaputt ist |
| **PM-032** | Nur eine Zahl: Sockelleisten **44,00 lfdm** statt 41,30. Alles andere war am 03.09. bestätigt |

### Stufe 2 — grüne Haken auf überholten Zahlen, seit dem 02.09. offen (4 Fälle)

Diese vier wurden vor der VOB-Übermessung abgenommen; jetzt kommt der
Sockelleisten-Wert dazu.

| Fall | Neue Sollwerte |
|---|---|
| **PM-002** | Wandbrutto 39,00 · Restwände 29,90 · Akzentwand 9,10 · Sockelleisten **15,00 lfdm** |
| **PM-006** | Wandfläche **28,80 m²** · Sockelleisten **12,00 lfdm** · Altbau-Zuschlag 20 % |
| **PM-010** | Wandfläche **33,80 m²** · alle drei Sockelleisten-Zeilen **13,00 lfdm** |
| **PM-018** | Wand/Spachtel Q3/Grundierung/Anstrich je **39,00 m²** · Sockelleisten **15,00 lfdm** |

### Stufe 3 — offene 🟡 mit eigenem Grund, der jetzt behoben sein müsste (5 Fälle)

| Fall | Was der Fix erledigt haben soll |
|---|---|
| **PM-023** | Die Trittschall-Flächenverwechslung — laut Engineer durch den Dezimalpunkt-Fix erledigt. Der Fund war „situativ und nicht reproduzierbar"; genau deshalb braucht er einen sauberen Nachtest |
| **PM-028** | Erschwerniszuschlag zog den Abstellraum in die Bemessungsgrundlage — CoS-043 rechnet objektbezogene Zuschläge jetzt nur noch aufs eigene Gewerk. Zweiter Fund (Grundpreis 11,50 statt 9,50 €) unabhängig davon prüfen |
| **PM-030** | „Sockelleisten-Türabzug trotz Türen: 0" erledigt sich mit VOB-012 von selbst — nachweisen |
| **PM-024** | Der fehlende fünfte Nachtest zum Karten-Fund, plus neuer Sockelleisten-Wert |
| **PM-009** | Übergangsschienen-Preis nie live nachgeprüft, und die Zählung der Schienen hat sich geändert |

### Stufe 4 — grün, aber eine Zahl hat sich geändert (8 Fälle)

Hier ist **nur die Sockelleistenlänge** zu prüfen: je Standardtür 0,90 lfdm mehr
als in der Falldokumentation steht. Kann man in einem Rutsch einsprechen und
jeweils nur auf diese eine Zeile schauen.

**PM-001 · PM-011 · PM-012 · PM-013 · PM-021 · PM-022 · PM-025 · PM-026**

PM-021 ist der wertvollste davon, weil er beide Richtungen in einem Fall zeigt:
Die Zimmertür (0,90 m) bleibt jetzt drin, die Terrassentür (2,00 m) wird
weiterhin abgezogen — 22,00 auf 20,00 lfdm.

### Stufe 5 — neuer Fall nötig

**VOB-013 (Leibungen dreiseitig, Fensterbank nicht mehr doppelt) ist von keinem
einzigen Testfall abgedeckt.** Der Fix ist ungetestet unterwegs. Ich lege dafür
**PM-037** an: ein Raum mit zwei Fenstern, ausdrücklich genannten Leibungen und
einer Fensterbank — die einzige Konstellation, in der sich der alte vom neuen
Stand unterscheidet.

---

**Nicht auf der Liste, mit Absicht:**

- **PM-014** (Race Condition) — kein Sprechfall, sondern ein Gleichzeitigkeits-
  Klicktest. Bleibt offen, gehört aber nicht in diesen Plan.
- **PM-031** (kosmetische „So gerechnet"-Zeile) — dafür gibt es noch keinen Fix,
  ein Nachtest würde nur das Bekannte bestätigen.
- **PM-003, PM-005, PM-007, PM-008, PM-017, PM-019, PM-020, PM-027, PM-029** —
  keine Sockelleisten-Position und von keiner der Änderungen berührt.

**Reihenfolge, wenn die Zeit knapp ist:** Stufe 1 zuerst (dort hängt der
Blocker und der teuerste Rechenfehler), dann Stufe 3, dann Stufe 2. Stufe 4 ist
Fleißarbeit und kann warten, solange niemand die alten Zahlen für bare Münze
nimmt — deshalb steht die Korrekturtabelle weiter oben in dieser Datei.

*Prüfmeister · 2026-09-04*

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->

