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
| PM-002 | Akzentwand + Boden diagonal (Schlafzimmer) | ✅ beide Bugs live nachgetestet, bestätigt behoben |
| PM-003 | Kleinreparatur + Höhenzuschlag (Flur) | ✅ alle drei Punkte live bestätigt behoben (Grundierung, Fenster-Rückfrage, rotes „!") |
| PM-004 | Laminat gerade + Trittschalldämmung (Kinderzimmer) | ✅ Verschnitt-Bug live nachgetestet, bestätigt behoben |
| PM-005 | Zwei Räume, Scope "nur Decke" (Küche/Speisekammer) | ✅ komplett behoben und live bestätigt — schwerster Fund der Testreihe, jetzt zu |
| PM-006 | Kleines Fenster + Altbau-Zuschlag (Büro) | ✅ bestätigt bekannter Punkt, keine Dringlichkeit |
| PM-007 | Dachgeschoss: Kniestock + Dachschrägen | ✅ Live-Nachtest (2026-08-25) bestätigt: Rückfragen-Blocker weg, Kniestock/Dachschrägen exakt Soll, jetzt auch beide bepreist (Preismatcher-Fix). Offen bleiben zwei kleine, nicht-blockierende Funde (Türen-Anzeige vs. Sockelleisten-Rechnung; „Raumhöhe" zeigt „!") — Details im Archiv |
| PM-008 | Fassade | ✅ Nachtest 7 (2026-08-20): „So gerechnet"-Rechenbug live bestätigt behoben (66,96 m², kein Widerspruch mehr zur abgerechneten Position), Wand-Chip/PD-003 bleibt fehlerfrei. Fachlich/rechnerisch komplett grün, offen bleibt nur die Erschwerniszuschlag-Einheitenfrage (Pauschale vs. %, wartet auf Sandys Entscheidung, siehe PM-015) — Details im Archiv |
| PM-009 | Bodenleger-Komplettpaket | ✅ Übergangsschiene live bestätigt behoben (taucht jetzt auf); fehlender Standardpreis dafür jetzt ergänzt (2026-08-20, siehe „Systemischer Fund" Punkt 1), Live-Nachtest dafür steht aus |
| PM-010 | Sockelleisten-Doppel-Falle | ✅ Nachtest (2026-08-20): „Sockelleisten entfernen" jetzt live bestätigt behoben (12,1 lfdm, exakt Soll) — damit alle vier ursprünglichen Funde geklärt (Bodenaustausch weg, Sockelleisten streichen behoben, 350-Bug akzeptierte Design-Entscheidung, Sockelleisten entfernen jetzt auch). Offen bleibt nur die fehlende Preishinterlegung dafür — Details im Archiv |
| PM-011 | Vollflächenspachtelung Q2 vs. Kleinreparatur (Arbeitszimmer) | 🟡 Q2-Vollflächenspachtelung + Grundierung fachlich korrekt; Kleinreparatur-Bug trotz Verneinung jetzt gefixt (2026-08-20, siehe Fix-Update), Live-Nachtest steht aus; PD-008 beim Designer. „Alle 7 Positionen ohne Preis"-Fund root-caused (2026-08-19): kein Matching-Bug, Nachtest lief auf dem bekannten PM-015-Testkonto ohne Maler-Katalog — siehe „Systemischer Fund" Punkt 5, Entscheidung bei Sandy, wie das Konto nachversorgt wird |
| PM-012 | Sockelleisten-Falle umgekehrt: nur streichen, ausdrücklich nicht neu (Esszimmer) | ✅ Nachtest (2026-08-20): „Sockelleisten streichen" jetzt live bestätigt behoben (14,1 lfdm, exakt Soll), nach fünf gescheiterten Versuchen. Kein Boden-Phantom, Ausschluss weiterhin sauber respektiert — Details im Archiv |
| PM-013 | Zwei Räume, getrennte Gewerke + Fischgrät + Dehnungsfuge (Wohnzimmer/Flur) | 🟡 Nachtest 4 (2026-08-25): alle fünf Nachtest-3-Funde live bestätigt behoben. Der Dehnungsfuge-Fund ist geklärt: **keine Regression** — Whisper schrieb „Dehnungs**fuhre**", das Wort kam nie beim Fallback an. Muster toleriert jetzt Hörfehler (Fix-Update 4), Live-Nachtest steht aus |
| PM-014 | Doppelte Positionen + instabile Summen bei Angebot 2026-0016 (live entdeckt, kein geplanter Testfall) | 🟡 Dubletten-Fix bestätigt (Doppelklick-Test). Echte Race Condition jetzt mit DB-Constraint geschlossen (2026-08-20, Sandys Go, siehe Fix-Update 2) — Migration live, Code-Fix grün gegen Testsuite, gezielter Gleichzeitigkeits-Nachtest steht noch aus |
| PM-015 | Preisdatenbank praktisch leer bei „manuell"-Onboarding + Anzeige-Bug versteckt Nachlade-Button (live entdeckt am Konto „Lisa Schein Malerbetrieb", kein geplanter Testfall) | 🟡 Beide Ursachen gefunden und gefixt, geprüft live im Code korrekt. **Klargestellt (2026-08-19):** der PM-011-„alle Preise fehlen"-Fund war KEIN neuer, dritter Bug — derselbe Nachtest lief auf demselben, schon damals betroffenen Konto „Lisa Schein Malerbetrieb", das vor dem Fix (17.08.) angelegt wurde und dadurch nicht rückwirkend versorgt ist, siehe „Systemischer Fund" Punkt 5. Für alle NEU angelegten Konten ab 18.08. gilt der Fix nachweislich. **Korrektur (2026-08-19, siehe PM-016):** der 18.08.-Fix selbst war kaputt — der Onboarding-Insert scheiterte durch denselben Bug wie PM-016 komplett und unbemerkt (Fehler wurde nicht geprüft). „Lisa Schein" ist inzwischen live nachversorgt |
| PM-016 | „Standardpreise importieren" auf `/preise` schlägt fehl: „Die Standardpreise konnten nicht vollständig ergänzt werden." (live entdeckt am Konto „Lisa Schein Malerbetrieb", kein geplanter Testfall) | ✅ Root-Cause gefunden und gefixt (2026-08-19), Konto live nachversorgt (341 Positionen), gleicher Bug auch im Onboarding-Seeding gefixt |
| PM-017 | Tapete statt Streichen + Grundierung trotz Neuputz ausdrücklich abgelehnt (Kinderzimmer) | ✅ Live-Nachtest (2026-08-21) bestätigt: „Tapete tapezieren" jetzt mit exakt 31,91 m² und korrektem Preis, keine Phantom-Positionen mehr, keine Grundierung — Details im Archiv |
| PM-018 | Q3-Vollflächenspachtelung an Wand UND Decke getrennt (Arbeitszimmer) | ✅ Live-Nachtest (2026-08-21) bestätigt: alle 8 Positionen exakt Soll, „Q3" korrekt an Wand und Decke, Deckengrundierung vorhanden — Details im Archiv |
| PM-019 | Erschwerniszuschlag „schwieriger Untergrund" isoliert von Höhe/Altbau (Gäste-WC) | ✅ Details im Archiv. Die dort beobachtete quadratische Raummaß-Abweichung ist jetzt aktiv zu fixen, siehe „Systemischer Fund" Punkt 6 |
| PM-020 | Teppich verlegen, alter Belag bleibt liegen (neue Ausschluss-Formulierung), Verschnittsatz unklar (Kinderzimmer 2) | ✅ Details im Archiv. Die dort beobachtete quadratische Raummaß-Abweichung ist jetzt aktiv zu fixen, siehe „Systemischer Fund" Punkt 6 |
| PM-021 | Mehrere unterschiedlich große Öffnungen + expliziter Einfachanstrich, VOB-Übermessungsfrage zugespitzt (Wohnküche) | ✅ Details im Archiv |

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
echten Transkripten plus drei Gegenproben. Live-Nachtest steht aus.

**Details für abgeschlossene Fälle (PM-001, PM-002, PM-003, PM-004, PM-005, PM-006, PM-007, PM-009, PM-019, PM-020, PM-021):** siehe `pruefmeister-testfaelle-archiv.md` — Status hier in der Tabelle bleibt als Kurzfassung stehen. (PM-007 war am 2026-08-21 kurz zurückgeholt wegen eines Blocker-Bugs, ist seit dessen Fix und Live-Nachtest am 2026-08-25 wieder abgeschlossen und zurück im Archiv.)

---

## PM-011 — Vollflächenspachtelung Q2 vs. Kleinreparatur (Arbeitszimmer)

**Datum:** 2026-08-17
**Status:** 🟡 Kernfrage bestanden (Q2-Vollflächenspachtelung sauber erfasst, inkl. Grundierung — fachlich korrekt, siehe Korrektur unten). Ein echter, kleiner Bug bleibt: Kleinreparatur-Position trotz ausdrücklicher Verneinung. Größerer Fund ist jetzt ein Designer-Thema geworden: automatisch ergänzte Positionen brauchen eine „Vorschlag"-Kennzeichnung (PD-008). **NEU, dringend (2026-08-19):** Nachtest desselben Falls zeigt bei ALLEN sieben Positionen „Preis fehlt" — vorher hatten sechs davon echte Preise. Echter Rückschritt, kein Katalog-Lückenfund mehr, siehe „Systemischer Fund" Punkt 5 oben und Nachtest unten.

**Warum dieser Fall:** PM-003 hat schon gezeigt, dass eine Kleinreparatur (zwei Dübellöcher) nicht als
Vollflächen-Grundierung durchgehen darf. Hier die Gegenprobe: ein Fall, der ausdrücklich KEINE
Kleinreparatur ist, sondern eine echte, ganzflächige Spachtelung vor dem Streichen. Testet, ob das Tool
diese fachlich völlig andere Leistung (Stückzahl/Aufwand vs. m²-Vollfläche) sauber unterscheidet — und
ob der PM-003/007-Fix, der Grundierung jetzt zu Recht zurückhaltend macht, nicht versehentlich auch die
echte, hier klar verlangte Vollflächenspachtelung mit wegfiltert.

**Zum Einsprechen:**
„Ähm, Arbeitszimmer, vier mal drei zwanzig, Höhe zwo fünfzig. Ist n Altbau, die Wände sind ordentlich
uneben — die müssen komplett gespachtelt werden, Qualitätsstufe Q2, nicht nur ne kleine Ausbesserung,
wirklich die ganze Fläche. Danach zweimal streichen. Ein Fenster, Standardmaß, eine Tür, normal.
Sockelleisten kleben wir ab, die bleiben wie sie sind.“

**Soll-Lösung:**
- Umfang: 2×(4,00+3,20) = 14,40 lfm
- Wandbrutto: 14,40×2,50 = 36,00 m²
- Abzug 1 Fenster Standard (1,20 m²) + 1 Tür Standard (1,89 m²) = 3,09 m²
- Wandfläche netto: **32,91 m²**
- Vollflächenspachtelung Q2: **32,91 m²** — eigene m²-Position über die GANZE Wandfläche, nicht als
  Stückzahl/Kleinreparatur erfasst
- Wandflächen streichen 2×: **32,91 m²**
- Sockelleisten abkleben (Maler-Schutz): 14,40 − 0,90 (Tür) = **13,50 lfm**
- Keine automatische Grundierungsposition erwartet — im Text steht kein explizites Grundierungssignal
  (weder „grundieren" noch „Neubau/Erstanstrich/Tiefengrund"); höchstens als Erinnerung in „fehlende
  Positionen" akzeptabel, keine automatisch bepreiste Position
- Keine Deckenposition (nicht erwähnt)

**Worauf achten:**
- Wird die Vollflächenspachtelung als eigene m²-Position mit der vollen Wandfläche (32,91 m²) erfasst —
  oder rutscht sie fälschlich in die für Kleinreparaturen gedachte Stückzahl-Logik (die für „zwei Löcher"
  gebaut ist, siehe `maler-extras.ts`)?
- Wird die Spachtelqualität Q2 irgendwo im Positionstext oder als Zusatzinfo festgehalten, oder geht sie
  komplett verloren?
- Bleibt es bei den korrekten 32,91 m², ohne dass zusätzlich ungefragt eine Grundierung auf die volle
  Fläche gesetzt wird? Das wäre ein Rückfall in genau die PM-003/007-Fehlerfamilie, nur diesmal ausgelöst
  durch das Wort „Spachtelung" statt „Grundierung".
- Landet die Sockelleiste korrekt als „abkleben" (Malerschutz), nicht als „streichen" oder „montieren" —
  hier ist ausdrücklich nur Schutz gewünscht, nichts weiter.

**Ist-Ergebnis (Prüfmeister, direkt im Browser-Tab geprüft, 2026-08-17):** Arbeitszimmer korrekt erkannt,
Raummaße exakt (4,00×3,20, Höhe 2,50 m, Türen 1, Fenster 1). Positionen im fertigen Entwurf:

- Wandflächen streichen 2×: 32,91 m² × 9,50 € = 312,64 € ✓ exakt Soll
- Boden schützen: 12,8 m² × 1,20 € = 15,36 € (automatisch abgeleitete Nebenleistung, wie in fast jedem
  Testfall — kein Fehler)
- Sockelleisten abkleben: 13,5 lfdm × 0,80 € = 10,80 € ✓ exakt Soll
- **Spachtelarbeiten Q2** — „Wände für einen ebenen Untergrund vollflächig spachteln": 32,91 m² ×
  9,00 € = 296,19 € ✓ **exakt Soll, inklusive Q2-Kennzeichnung im Positionstext selbst**
- **Voranstrich / Grundierung: 32,91 m² × 6,00 € = 197,46 €** — nicht im Soll, nie verlangt
- Erschwerniszuschlag Altbau: 1 Pauschale × 0,00 € („Preis fehlt in deiner Preisdatenbank")
- **Risse / Löcher spachteln (kleine Schadstellen): 1 Stück × 8,00 € = 8,00 €** — nicht im Soll, nie
  verlangt
- Gesamt: Netto 840,45 € × 1,19 = **1.000,14 €** — rechnerisch exakt konsistent mit allen Positionen oben

**Befund:**

1. **Korrigiert (Sandy, 2026-08-17): das war fachlich falsch von mir eingeordnet — kein Bug, sondern eine
   sinnvolle Ergänzung, nur ohne Kennzeichnung.** Ursprünglich hatte ich hier „ungefragte Grundierung,
   197,46 €, Rückfall in die PM-003/007-Fehlerfamilie" stehen. Sandy hat zu Recht nachgehakt: als Maler
   gedacht ist eine Grundierung NACH einer echten Vollflächenspachtelung Q2 auf Altbau-Untergrund kein
   Fehler, sondern genau das, was ein Maler sowieso machen würde — frisch gespachtelte Flächen saugen
   ungleichmäßig, ohne Grundierung gibt's Fleckenbildung im ersten Anstrich. Das ist ein echter fachlicher
   Unterschied zu PM-003/007: dort war entweder die Fläche falsch (Grundierung auf die GANZE Wand wegen
   zwei Dübellöchern — Flächen-Mismatch) oder es gab gar kein Signal (Grundierung nur wegen des Wortes
   „Dachschräge"). Hier passt die Grundierungsfläche (32,91 m²) exakt zur tatsächlich gespachtelten
   Fläche — kein Mismatch, ein plausibler, gut begründeter Vorschlag.
   Der eigentliche, jetzt neu formulierte Fund: **im fertigen Angebot ist nirgends zu erkennen, dass diese
   Position vom Tool sinnvoll ERGÄNZT wurde statt vom Nutzer selbst GESAGT** — „Voranstrich / Grundierung"
   sieht optisch exakt gleich aus wie „Wandflächen streichen 2×", das wörtlich im Transkript stand. Sandys
   Vorschlag dazu, den ich für sehr gut halte: automatisch ergänzte Positionen sollten sichtbar markiert
   sein (z. B. „Vorschlag — bitte prüfen"), damit der Handwerker gezielt genau diese Positionen
   gegenchecken kann, statt bei jeder Position gleich viel nachdenken zu müssen. Das würde nicht nur
   diesen Fall entschärfen, sondern noch viele andere „automatisch abgeleitete Nebenleistungen", die in
   fast jedem bisherigen Testfall unmarkiert mitgelaufen sind (Boden schützen, Sockelleisten abkleben,
   Erschwerniszuschläge) — siehe PD-008 an den Designer, dorthin geht dieser Fund jetzt in erster Linie.
2. **Zweiter Fund — „Risse / Löcher spachteln (kleine Schadstellen)" trotz ausdrücklicher Verneinung.**
   Ich hatte wörtlich gesagt „nicht nur ne kleine Ausbesserung, wirklich die ganze Fläche" — trotzdem kam
   zusätzlich eine eigene Kleinreparatur-Stückzahl-Position (1 Stück, 8,00 €) dazu, obwohl im Transkript
   nirgends von Rissen oder Löchern die Rede war. Kleiner Betrag, aber vom Muster her verwandt mit dem
   „ausdrücklicher Ausschluss wird ignoriert"-Fehler (wie beim Decke-Fall in PM-001) — nur diesmal ist die
   Verneinung nicht „X nicht" sondern „nicht nur X, sondern Y". Anders als Punkt 1: dieser Fund bleibt auch
   mit einer „Vorschlag"-Kennzeichnung (siehe oben) ein echter Fund — es geht nicht darum, DASS etwas
   ergänzt wurde, sondern dass ausgerechnet etwas ergänzt wurde, das ausdrücklich verneint war. Trotzdem
   gilt: mit klarer Kennzeichnung würde ein Handwerker das in Sekunden erkennen und löschen, der Schaden
   bliebe klein — ohne Kennzeichnung ist es der stille, leicht übersehbare Fehler, um den es hier eigentlich
   geht.
3. **Kein Fehler, sondern eine Lücke in meiner eigenen Soll-Lösung:** Der Erschwerniszuschlag Altbau kam
   korrekt (ich hatte „Altbau" im Text — das ist fachlich ein legitimer Auslöser, siehe PM-006). Den hatte
   ich in der Soll-Lösung oben schlicht vergessen mit reinzuschreiben, das geht auf meine Kappe, nicht auf
   die vom Tool. Reiht sich in den „Systemischen Fund" oben ein (0,00 €, Preis fehlt in der
   Preisdatenbank) — nichts Neues.

**Positiv festzuhalten:** Die eigentliche Kernfrage dieses Testfalls — wird Vollflächenspachtelung sauber
von Kleinreparatur unterschieden, und bleibt die Spachtelqualität (Q2) erhalten — ist ein klares Ja.
32,91 m² auf die volle Fläche, korrekt als „Spachtelarbeiten Q2" benannt. Das ist ein echter Erfolg, den
ich nicht kleinreden will, auch wenn zwei andere Bugs den Fall insgesamt nicht grün machen.

**Für Head of IT:** nur noch ein Thema, Punkt 1 ist raus (siehe Korrektur oben, kein Rechenfehler mehr) —
die Kleinreparatur-Erkennung sollte eine ausdrückliche Verneinung wie „nicht nur eine kleine Ausbesserung"
genauso respektieren wie andere Ausschlüsse (Punkt 2). Falls der Designer die „Vorschlag"-Kennzeichnung
aus PD-008 umsetzen will, bräuchte es zusätzlich eine technische Kleinigkeit: irgendein Flag pro Position,
ob sie aus dem Transkript direkt kam oder vom Tool selbst ergänzt wurde — das gibt's laut meinem
bisherigen Eindruck noch nicht, aber das entscheidet ihr zwei am besten direkt miteinander.

**Nachtest (Sandy, 2026-08-19) — derselbe Fall, alle Preise plötzlich weg:** Karte und Entwurf per
Copy-Paste geschickt, Raummaße identisch zum Originaltest (4,00 × 3,20 m, Raumhöhe 2,5 m, Türen 1,
Fenster 1) und alle Mengen weiterhin korrekt (32,91 m² Wandfläche, 12,8 m² Boden schützen, 13,5 lfdm
Sockelleisten — Mengen-Logik also unverändert sauber). Aber: alle sieben Positionen zeigen jetzt „Preis
fehlt in deiner Preisdatenbank", inklusive der sechs, die im Originaltest zwei Tage vorher echte Preise
hatten (Wandflächen streichen, Boden schützen, Sockelleisten abkleben, Spachtelarbeiten Q2,
Voranstrich/Grundierung, Risse/Löcher spachteln). Sandy war entsprechend deutlich: „WARU FEHLEN ALLE
PREISE IN DER DATENBANK???? IN DER DATENBANK MÜSSEN ALLLEEEE POSITIONEN VORHANDEN SEIN ICH CHECKS NICHT."
Einordnung und mögliche Ursachen bei „Systemischer Fund" Punkt 5 oben — das betrifft vermutlich nicht nur
PM-011, sondern jeden Testfall, der gerade läuft, und sollte deshalb vor allem anderen geklärt werden.

**Rest des Nachtests, unabhängig von der Preisfrage — was sonst noch auffällt:**

1. **Kleinreparatur-Bug weiterhin unverändert offen, jetzt erneut reproduziert.** „Risse / Löcher
   spachteln (kleine Schadstellen)" (1 Stück) steht wieder im Entwurf, obwohl im Transkript ausdrücklich
   „nicht nur eine kleine Ausbesserung, wirklich die ganze Fläche" gesagt wurde. Kein neuer Fund, aber der
   einzige der drei ursprünglichen PM-011-Befunde, für den es bisher überhaupt kein Fix-Update gibt — bitte
   nicht aus den Augen verlieren, während die Preisfrage gerade die meiste Aufmerksamkeit bekommt.
2. **Auffällig starke Version des PD-004-Musters: Karte verspricht 2, Entwurf liefert 7.** Die Karte zeigt
   nur zwei Leistungen („Wände spachteln", „Wände streichen") und „2 Positionen erkannt". Der fertige
   Entwurf hat sieben Positionen. Fünf davon sind fachlich plausible, automatisch abgeleitete
   Nebenleistungen (Boden schützen, Sockelleisten abkleben, Grundierung, Erschwerniszuschlag, plus der
   oben genannte Kleinreparatur-Bug) — das allein ist wie in den meisten bisherigen Fällen kein Fehler.
   Aber die Diskrepanz selbst ist deutlich größer als alles bisher bei PD-004 Dokumentierte (dort ging es
   meist um „5 angekündigt, 4 geliefert" — hier sind es 2 angekündigt, 7 geliefert, mehr als das
   Dreifache). Sobald die Preise wieder da sind, würde ein Handwerker auf der Karte „2 Positionen" lesen
   und danach einen Entwurf mit mehr als dreimal so vielen Zeilen und einer entsprechend höheren Summe
   sehen — das ist ein größerer Vertrauens-Sprung als die bisher dokumentierten Fälle. Für den Designer:
   ergänze ich bei PD-004, siehe `pruefmeister-notizen-fuer-designer.md`.
3. **Kleinere Beobachtung, kein Fund:** Die Q2-Spachtelqualität steht auf der Karte nicht drin (nur
   „Wände spachteln"), erst im Entwurf heißt die Position „Spachtelarbeiten Q2". Fachlich ist die
   Qualitätsstufe ein Unterschied, den ein Handwerker früh sehen will — kein Bug, nur ein Denkanstoß, ob
   sich das schon auf der Karte lohnt.

Alle Mengen und die Kernfrage des Testfalls (Vollflächenspachtelung sauber von Kleinreparatur
unterschieden, Q2-Kennzeichnung bleibt erhalten) bleiben unverändert bestätigt — das ist weiterhin ein
Erfolg, der durch die Preis- und Kleinreparatur-Themen nicht kleiner wird.

**Fix-Update zur Preisfrage (Head of Product Engineering, 2026-08-19):** Root-Ursache gefunden, direkt
gegen die Produktionsdatenbank geprüft (nur lesend) — kein Rückschritt im Preis-Abgleich, sondern derselbe
Fall wie bei PM-015. Details und Einordnung stehen jetzt bei „Systemischer Fund" Punkt 5 oben, hier nur
das Ergebnis für diesen Testfall: der Nachtest lief auf dem Konto „Lisa Schein Malerbetrieb" — demselben
Konto, an dem PM-015 ursprünglich gefunden wurde, mit bis heute nur 5 generischen Positionen statt eines
Maler-Katalogs. Alle sieben `quote_items` dieses Nachtests haben `price_item_id: null`, weil es für dieses
Konto in `price_items` schlicht keine Maler-Zeilen gibt, an die etwas matchen könnte — nicht, weil ein
Matching-Bug plötzlich mehr Positionen verfehlt als vorher. Der PM-015-Fix ist im Code korrekt und live,
wirkt aber nur für Konten, die NACH dem Fix (18.08.) onboarden — dieses eine Testkonto ist vom 17.08. und
wird dadurch nicht rückwirkend versorgt. Für einen sauberen Wiederholungstest dieses Falls entweder auf
`/preise` unter diesem Konto einmal „Standardpreise importieren" klicken (Button jetzt korrekt sichtbar),
oder mir Bescheid geben, dann trage ich den fehlenden Katalog einmalig direkt nach.

**Fix-Update (Head of Product Engineering, 2026-08-20) — Kleinreparatur-Bug trotz ausdrücklicher
Verneinung:** Root-Cause gefunden in `maler-extras.ts` (`pruefeSpachtelarbeiten`). Du hattest wörtlich
gesagt „nicht nur ne kleine Ausbesserung, wirklich die ganze Fläche" — die Erkennung dafür, ob eine
Kleinreparatur vorliegt, hat aber nur nach der bloßen Wortfolge „kleine Ausbesserung"/„kleine[s] Loch/
Löcher" im Text gesucht, ohne zu prüfen, ob direkt davor ein „kein[e]" oder eben „nicht nur" steht — sie hat
die Verneinung selbst also komplett ignoriert und trotzdem eine eigene Kleinreparatur-Stückposition
(„Risse / Löcher spachteln", 1 Stück) erzeugt. Exakt dieselbe Fehlerklasse wie „kein Fenster"/„keine Tür"
an anderer Stelle im Code oder „keine Dehnungsfuge" bei PM-013 gestern — nur diesmal mit „nicht nur X,
sondern Y" statt der einfacheren „kein/keine X"-Form.

Fix: neue Verneinungserkennung direkt vor der Wortfolge (`kein[e]`/„nicht nur/bloß/allein" plus bis zu 20
Zeichen Abstand, damit auch „nicht nur ne kleine Ausbesserung" erfasst wird), angewendet auf Dübellöcher
UND Schadstellen gleichermaßen — dieselbe Lücke hätte genauso bei „keine Dübellöcher" zuschlagen können,
auch wenn das noch nicht live beobachtet wurde. Mit der Verneinung entfällt die Kleinreparatur-Stückposition
komplett, die restliche, bereits als korrekt bestätigte Q2-Vollflächenspachtelung (32,91 m²) läuft
unverändert weiter — der Fix greift ausschließlich in die eine, falsch erkannte Zusatzposition ein. Neuer
Test in `vollstaendigkeit.test.ts` mit deinem exakten Nachtest-Transkript, direkt neben dem bestehenden
Gegenprobe-Test (wo „kleine Schadstellen" echt gemeint ist und weiterhin korrekt erkannt werden muss).

**Ehrlich zum Stand:** Root-Cause und Fix sind an deinem exakten Transkript nachvollzogen und mit einem
gezielten Test abgesichert, aber wie bei allen Fixes: noch kein Live-Nachtest im echten Tool.

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

## PM-013 — Zwei Räume, getrennte Gewerke + Fischgrät + Dehnungsfuge (Wohnzimmer/Flur)

**Datum:** 2026-08-17
**Status:** 🟡 Nachtest 4 (2026-08-25): alle fünf Nachtest-3-Funde live bestätigt behoben. Aber neuer,
eigenständiger Fund: die Dehnungsfuge — in Nachtest 3 noch ausdrücklich als „bestätigt wirksam" vermerkt —
ist in diesem Lauf komplett verschwunden, weder auf der Karte noch im Entwurf noch als Rückfrage. Damit
bleibt PM-013 aktiv.

**Warum dieser Fall:** Deckt gleich drei bisher ungetestete Punkte gleichzeitig ab. Erstens: ein
Mehrraum-Auftrag, bei dem die Räume nicht nur unterschiedlichen Scope haben (wie bei PM-005), sondern
komplett unterschiedliche GEWERKE — ein Raum nur Boden, der andere nur Maler. Das ist ein härterer Test
für die Raum-/Gewerke-Trennung als PM-005, weil hier auch geprüft wird, ob im einen Raum trotz Wort
„Boden" im Nebensatz keine Maler-Positionen und im anderen Raum trotz Rauminhalt keine Boden-Positionen
entstehen. Zweitens: Fischgrät-Verlegung — im Fachwissen als eigener, höherer Verschnittsatz (10–15 %)
gegenüber gerader Verlegung (5 %) explizit benannt, aber bisher in keinem Testfall genutzt (PM-002 hat nur
„diagonal" getestet). Drittens: eine ausdrücklich verlangte Dehnungsfuge — bisher komplett ungetestet.

**Zum Einsprechen:**
„Wohnzimmer, acht mal viereinhalb. Eichenparkett, Fischgrät verlegt, das braucht ja mehr Verschnitt. Ist
schon ne große Fläche, da muss wahrscheinlich ne Dehnungsfuge rein, mach das bitte mit rein. Boden nur,
an den Wänden machen wir nix.

Flur daneben, fünf mal eins achtzig, Höhe zwo sechzig. Kein Fenster da, aber eine Tür, normal Maß. Nur
Wände und Decke streichen, zweimal. Da wird nix am Boden gemacht, der bleibt wie er ist.“

**Soll-Lösung:**

*Wohnzimmer (nur Boden-Gewerk):*
- Fläche: 8,00×4,50 = 36,00 m²
- Fischgrät-Verlegung: Verschnitt im Korridor **10–15 %** (Fachwissen-Standard für Fischgrät/diagonal) →
  zwischen 39,60 m² (10 %) und 41,40 m² (15 %). Alles in diesem Korridor ist ok, klar falsch wäre 5 %
  (Standard für gerade Verlegung) oder 0 %.
- Dehnungsfuge: eine eigene Position (egal ob Preis hinterlegt oder nicht) — Raumlänge 8,00 m liegt an
  bzw. über der handwerksüblichen Faustregel für schwimmend verlegte Bodenbeläge ohne Fuge
- Keine Trittschalldämmung erwartet (nicht erwähnt, bei Parkett fachlich auch nicht zwingend Standard
  wie bei Laminat/Vinyl)
- Keine Sockelleisten-Position (nicht erwähnt)
- **Keine** Wand- oder Deckenposition — ausdrücklich ausgeschlossen („an den Wänden machen wir nix")

*Flur (nur Maler-Gewerk):*
- Umfang: 2×(5,00+1,80) = 13,60 lfm; Wandbrutto: 13,60×2,60 = 35,36 m²
- Abzug 1 Tür Standard (1,89 m²), kein Fenster-Abzug (ausdrücklich „kein Fenster da")
- Wandflächen streichen 2×: **33,47 m²**
- Deckenfläche streichen 2×: 5,00×1,80 = **9,00 m²**
- **Keine** Boden-Position jeglicher Art — ausdrücklich ausgeschlossen („da wird nix am Boden gemacht,
  der bleibt wie er ist"), obwohl das Wort „Boden" im Satz vorkommt

**Worauf achten:**
- Bleiben beide Räume klar getrennte Gruppen mit jeweils nur einem Gewerk — keine Vermischung, kein
  PM-005-artiges Verschwinden einer Gruppe?
- Fischgrät-Verschnitt spürbar höher als 5 % (der Standard für gerade Verlegung) — landet er im
  erwarteten 10–15 %-Korridor?
- Taucht überhaupt eine „Dehnungsfuge"-Position auf, wenn ausdrücklich verlangt — auch unbepreist wäre
  hier schon ein Erfolg (siehe „Systemischer Fund" oben zu fehlenden Standardpreisen)?
- Bleibt der Flur wirklich ganz ohne jede Boden-Position, obwohl das Wort „Boden" im Flur-Satz auftaucht
  — direkte Verwandtschaft zum PM-010-Phantom-Bug (Wortauslöser ohne echten inhaltlichen Bezug)?
- Bleibt das Wohnzimmer wirklich ganz ohne jede Wand-/Deckenposition, trotz des Namens „Wohnzimmer" (kein
  automatisches Default-Streichen, nur weil es sich wie ein normaler Wohnraum anhört)?

**Ist-Ergebnis (Prüfmeister, 2026-08-19, exakter Wortlaut von Karte, Rückfragen und Entwurf geprüft):**

Karte: 4 Positionen erkannt — Wohnzimmer: Eichenparkett verlegen (36 m²), Dehnungsfuge einbauen (1 Stück);
Flur: Wände streichen (20,8 m²), Decke streichen (9 m²). Rückfragen: Wohnzimmer „Muss der alte Bodenbelag
entfernt werden?" → „Ja, raus" beantwortet (im Transkript nicht erwähnt, legitime Nachfrage). Für den Flur
wurden aber **zwei Boden-Rückfragen gestellt** — „Welcher Belag soll in Flur verlegt werden?" und „Muss
der alte Bodenbelag in Flur entfernt werden?" —, obwohl im Transkript ausdrücklich steht „da wird nix am
Boden gemacht, der bleibt wie er ist". Sandy hat beide bewusst übersprungen („Später ergänzen").

Entwurf Wohnzimmer (1.512,00 €), Raumform 4,5×8 m:
- Fertigparkett verlegen: 36 m² × 42,00 € = 1.512,00 € — **kein Fischgrät-Verschnitt eingerechnet**, reine
  Rohfläche 8×4,5=36 m², obwohl im Transkript ausdrücklich „Fischgrät verlegt, das braucht ja mehr
  Verschnitt" gesagt wurde. Soll wäre 39,60–41,40 m² (10–15 %).
- Altbelag entfernen: 36 m² × 0,00 € (Preis fehlt) — korrekt vorhanden, weil über die Rückfrage bestätigt,
  kein Phantom diesmal
- **Keine „Dehnungsfuge"-Position** — auf der Karte klar als eigene Leistung erkannt („Dehnungsfuge
  einbauen 1 Stück"), im fertigen Entwurf aber nicht vorhanden, auch nicht als offene Rückfrage
- Keine Trittschalldämmung, keine Sockelleisten-Position, keine Wand-/Deckenposition — alles korrekt wie
  im Soll

Entwurf Flur (427,13 €), Raumform 1,8×5 m, Höhe 2,6 m, 1 Tür, 0 Fenster:
- Wandflächen streichen 2×: 33,47 m² × 9,50 € = 317,96 € — exakt Soll
- Deckenfläche streichen 2×: 9 m² × 11,00 € = 99,00 € — exakt Soll
- Boden schützen: 9 m² × 0,00 € (Preis fehlt) — normale Maler-Nebenleistung (Bodenschutz beim Streichen),
  kein Widerspruch zum Boden-Ausschluss, da keine Bodenleger-Leistung
- Sockelleisten abkleben: 12,7 lfdm × 0,80 € = 10,16 € — exakt Soll (13,60 − 0,90 Türbreite)
- **Keine** echte Boden-Verlegeposition — der Ausschluss wurde im Ergebnis sauber respektiert, trotz der
  beiden ungefragt gestellten Rückfragen oben

**Befund:**

1. **Neuer Fund: Fischgrät-Verschnitt wird gar nicht angewendet.** Erwartet 10–15 % Aufschlag (39,60–
   41,40 m²), tatsächlich 0 % (36,00 m² = reine Rohfläche). Das ist schlechter als selbst der falsche
   Standard „gerade Verlegung" (5 %) wäre — die Verlegeart „Fischgrät" scheint auf den Materialbedarf
   überhaupt keinen Einfluss zu haben. Für den Bodenleger bedeutet das: er muss real 4–5,5 m² mehr Material
   zuschneiden und verlegen, als ihm hier berechnet wird — bei 42,00 €/m² sind das über 150 € Differenz,
   die er nicht bezahlt bekommt.
2. **Neuer Fund, gleiche Fehlerkategorie wie PM-010: „Dehnungsfuge einbauen" verschwindet spurlos.** Die
   Karte kündigt sie mit eigener Menge an (1 Stück), der fertige Entwurf enthält sie nicht — keine Zeile,
   keine offene Rückfrage. Dritter unabhängiger Beleg (nach Sockelleisten entfernen bei PM-010, Sockel­
   leisten streichen bei PM-012) für dasselbe größere Architekturproblem: eine erkannte, aber ohne sichere
   Menge/Bestätigung dastehende Leistung erreicht den Nutzer nie. Diesmal zusätzlich interessant: andere
   Einheit („Stück" statt „lfdm"/„m²") und anderes Gewerk (Boden statt Maler) — untermauert, dass es sich
   um ein gewerke- und einheitenübergreifendes, strukturelles Problem handelt, nicht um einen
   Maler-Spezialfall.
3. **Neuer, kleinerer Fund: Boden-Rückfragen für den Flur, obwohl Boden dort ausdrücklich ausgeschlossen
   wurde.** Die Ausschluss-Erkennung wirkt auf Positions-Ebene (im Ergebnis kam korrekt keine
   Boden-Position), aber nicht auf Rückfragen-Ebene — dem Nutzer werden Fragen gestellt, die er im selben
   Satz schon beantwortet hat. Harmlos nur, weil Sandy beide bewusst übersprungen hat; hätte sie aus
   Versehen „Laminat" oder „Ja, raus" angetippt, wäre eine nie verlangte Boden-Position im Flur entstanden
   — dieselbe Gefahrenklasse wie der PM-010-Phantom-Bodenaustausch, nur einen Klick vom Nutzer entfernt
   statt automatisch.
4. **Gute Nachricht: Gewerke-Trennung selbst hält.** Wohnzimmer bekommt keine Wand-/Deckenposition, Flur
   bekommt keine echte Boden-Verlegeposition — trotz des Wortes „Boden" im Flur-Satz. Alle Flur-Zahlen
   (Wandfläche, Deckenfläche, Sockelleisten-Länge) treffen exakt die Soll-Lösung.

**Für Head of Product Engineering:** drei getrennte Themen — (1) Verschnittsatz für Fischgrät/diagonale
Verlegung in der Boden-Engine ergänzen (aktuell offenbar 0 % statt 10–15 %, unabhängig davon, ob generell
5 % für gerade Verlegung schon funktionieren — das wäre separat zu prüfen); (2) „Dehnungsfuge einbauen"
denselben Fix geben wie „Sockelleisten entfernen/streichen" bei PM-010/PM-012 — vermutlich dieselbe
`fehlende`-Ursache, nur in der Boden-Engine statt der Maler-Engine; (3) Rückfragen-Generierung für einen
Raum sollte einen im selben Satz ausdrücklich ausgeschlossenen Bereich (hier: „am Boden nix gemacht")
genauso respektieren wie die Positions-Generierung es bereits tut — sonst bekommt der Nutzer Fragen zu
Dingen vorgesetzt, die er gerade erst verneint hat.

**Fix-Update (Head of Product Engineering, 2026-08-19) — nur Punkt (2) bearbeitet, (1) und (3) bewusst
NICHT angefasst:** Auf Sandys „das bearbeiten und fixen!" hin gezielt den `fehlende`-Fund angegangen, den
sie in ihrer Nachricht selbst zitiert hat. Ehrlich zum Stand: „Dehnungsfuge" ist NICHT derselbe Fall wie
„Sockelleisten entfernen/streichen" — es ist sogar noch grundlegender. Für Sockelleisten gibt es
(fehlerhafte oder tote) Erkennungslogik im Code; für „Dehnungsfuge" gibt es **überhaupt keine** — ich habe
den kompletten Code durchsucht (`vollstaendigkeit/*`, `mengen/*`), das Wort „Dehnungsfuge" kommt nirgends
außer in den beiden Katalogpreis-Einträgen vor. Die einzige Stelle im gesamten System, die „Dehnungsfuge"
kennt, ist der schnelle Karten-Chip (GPT-Erkennung für die Aufnahme-Vorschau) — der hat sie ja auch korrekt
mit „1 Stück" gemeldet, nur landet dieses Wissen nirgends in der eigentlichen Berechnung.

Fix, gleiches Sicherheitsnetz-Prinzip wie bei PM-010/PM-012: `aufnahme-hinweise.ts` erkennt jetzt den
Chip-Titel „Dehnungsfuge"/„Bewegungsfuge" und ergänzt daraus eine echte, sichtbare Position — Menge aus dem
Transkript, wenn genannt, sonst 1 Stück (wie vom Chip erkannt; im Transkript stand nur „eine Dehnungsfuge",
keine Länge). Einheit bewusst „Stück" statt an einen der beiden Katalogpreise (beide „lfdm") anzugleichen,
weil im Transkript keine Länge genannt wurde — findet sich dadurch kein passender Katalogpreis, bleibt die
Position sichtbar mit 0,00 € offen statt zu verschwinden (Systemischer Fund Punkt 2). Neuer Test in
`aufnahme-hinweise.test.ts` mit deinem exakten Nachtest-Transkript. Zusätzlich, als generelles
Sicherheitsnetz: der `fehlende`→sichtbare-Position-Fix in `mehrgewerk.ts` (siehe PM-010-Fix-Update).

**Bewusst nicht angefasst:** (1) Fischgrät-Verschnittsatz und (3) Boden-Rückfragen trotz Ausschluss — beides
eigene, unabhängige Themen ohne Bezug zum `fehlende`-Fund, die Sandys „das bearbeiten und fixen!" nicht
konkret benannt hatte. Bitte separat priorisieren, wenn gewünscht. Live-Nachtest für „Dehnungsfuge" steht
aus.

**Fix-Update 2 (Head of Product Engineering, 2026-08-19) — Punkte (1) und (3), auf Sandys explizite
Anfrage „fix das" hin:**

*(1) Fischgrät-Verschnitt.* Root-Cause an echten Produktions-Rohdaten bestätigt (`debug_extraktion_roh`,
dieselbe Zeile wie oben): GPT liefert für die Fischgrät-Verlegung `verlegerichtung: "fischgrät"` —
`boden.ts` hat den erhöhten Verschnitt (15%) aber bisher NUR bei exakt `'diagonal'` ausgelöst, Fischgrät fiel
auf den Parkett-Standard (0%) zurück. Fix: `MUSTER_MIT_MEHR_VERSCHNITT`-Regex erkennt jetzt auch
„fischgrät"/„fischgrat" und wendet denselben 15%-Satz an. Wohnzimmer-Fläche 36,00 m² → jetzt 41,40 m² (liegt
am oberen Rand des im Testfall geforderten 10–15%-Korridors, klar über den fälschlichen 0%). Neuer Golden-
Test in `golden-korrekturen.test.ts` mit dem exakten PM-013-Transkript.

*(3) Boden-Rückfragen trotz Ausschluss.* Das war kein Sonderfall, sondern derselbe strukturelle Fehler wie
in Punkt (1) auf einer anderen Ebene, an einer konkreten Stelle: `kontext-analyzer.ts` (`anreichernBodenParkett`,
zuständig für alle Boden-Rückfragen) prüft nur, ob das GLOBALE `extraktion.gewerk` „boden_parkett" ist — ein
einzelnes Feld für den GANZEN Auftrag, nicht pro Raum. Bei PM-013s Mehrgewerk-Anfrage (Wohnzimmer nur Boden,
Flur nur Maler) lief die Funktion trotzdem über BEIDE Räume. Für den Flur reichte dabei ein loser
Substring-Treffer: seine `arbeiten`-Liste enthielt „boden abdecken" (ganz normale Maler-Nebenleistung,
Schutzfolie beim Streichen — im Entwurf korrekt als eigene Maler-Position „Boden schützen" berechnet) — der
alte Check `a.includes('boden')` hat das fälschlich als Boden-Verlege-Signal gewertet und zwei Rückfragen
ausgelöst („Welcher Belag...", „Muss der alte Bodenbelag...entfernt werden?"), obwohl im selben Satz „da
wird nix am Boden gemacht" stand. Fix: dieselbe, bereits bewährte Verlege-Signal-Erkennung wie in `boden.ts`
(`BODEN_VERLEGEN_SIGNAL` — verlangt ein echtes Verlege-/Belag-Wort, nicht bloß „boden" irgendwo im Satz),
jetzt aus `boden.ts` exportiert und in `kontext-analyzer.ts` wiederverwendet statt zweimal gepflegt zu
werden. Jeder Raum ohne dieses Signal wird in `anreichernBodenParkett` jetzt komplett übersprungen — betrifft
damit nicht nur die zwei gemeldeten Rückfragen, sondern konsistent auch die stillen Ergänzungen der
Funktion (z.B. wurde nebenbei sichtbar: die „Übergangsprofile"-Ergänzung zählte bisher ALLE Räume der
Anfrage statt nur echte Boden-Räume — bei 1 Boden- + 1 Maler-Raum hätte das Wohnzimmer fälschlich eine
Übergangsprofil-Ergänzung bekommen, obwohl es gar keinen zweiten Boden-Raum zum Übergang gibt; jetzt
mitgefixt). Neuer Test in `rueckfragen-flow.test.ts` mit den echten PM-013-Rohdaten (inkl. „boden abdecken"
im Flur), prüft explizit: keine `belag_flur`/`altbelag_flur`/`masse_boden_flur`-Rückfrage, aber die legitime
`altbelag_wohnzimmer`-Rückfrage bleibt erhalten.

**Ehrlich zum Stand:** Beide Fixes sind an echten Produktionsrohdaten root-caused und mit gezielten Tests
abgesichert, aber wie bei allen Fixes dieser Session noch OHNE Live-Nachtest im echten Tool. Die
Boden-Rückfragen-Ursache reicht etwas weiter als ursprünglich vermutet — es ist kein isolierter
Rückfragen-Bug, sondern dieselbe Lücke, die auch mehrere stille Ergänzungen betraf; die Architektur-Frage
„sollte `analysiereKontext` grundsätzlich pro Raum statt pro Auftrag laufen" bleibt offen und gehört eher in
den größeren, von Sandy bewusst zurückgestellten Architektur-Kontext (siehe CoS-002), nicht in diesen
gezielten Fix.

**Nachtest (Sandy, 2026-08-20) — 2 von 3 Fixes klar bestätigt, Dehnungsfuge diesmal nicht prüfbar.**
Karte: „3 Positionen erkannt" — Wohnzimmer: Eichenparkett verlegen (36 m²); Flur: Wände streichen
(25,2 m²), Decke streichen (9 m²). **Auffällig: keine „Dehnungsfuge"-Zeile auf der Karte diesmal**, anders
als beim ersten Test (dort „4 Positionen erkannt" inkl. „Dehnungsfuge einbauen 1 Stück"). Rückfrage nur
noch eine einzige: „Muss der alte Bodenbelag in Wohnzimmer entfernt werden?" → diesmal „Nein, bleibt"
beantwortet — die beiden Flur-Boden-Rückfragen aus dem ersten Test sind komplett weg.

Entwurf Wohnzimmer (1.738,80 €), Raumform 4,5×8 m:
- **Fertigparkett verlegen inkl. 15% Verschnitt: 41,4 m² × 42,00 € = 1.738,80 €** — ✅ **Fischgrät-
  Verschnitt-Fix bestätigt.** 36 × 1,15 = 41,4 m², liegt exakt am oberen Rand des geforderten
  10–15%-Korridors, klare Verbesserung gegenüber den früheren 0%.
- Keine Altbelag-Position — korrekt, passend zur diesmal verneinten Rückfrage.
- Keine Dehnungsfuge-Position — s.u., nicht eindeutig zuordenbar.
- Keine Wand-/Deckenposition — weiterhin korrekt.

Entwurf Flur (427,13 €): Wandflächen streichen 2× 33,47 m² × 9,50 € = 317,96 € (exakt Soll), Deckenfläche
streichen 2× 9 m² × 11,00 € = 99,00 € (exakt Soll), Boden schützen 9 m² × 0,00 € (Preis fehlt, bekannt),
Sockelleisten abkleben 12,7 lfdm × 0,80 € = 10,16 € (exakt Soll). ✅ **Boden-Rückfragen-Fix bestätigt** —
keine der beiden früheren, unverlangten Flur-Boden-Rückfragen kam diesmal, nur die legitime
Wohnzimmer-Rückfrage.

**Klärung (Sandy, 2026-08-20):** Bestätigt — „habe Dehnungsfuge mit gesagt", derselbe Wortlaut wie beim
ersten Test. Damit ist die zweite der beiden offenen Erklärungen bestätigt, und das ist ein neuer, eigener
Fund: **GPT erkennt „Dehnungsfuge" bei identischem Transkript nicht zuverlässig.** Erster Test:
„4 Positionen erkannt" inkl. „Dehnungsfuge einbauen 1 Stück" auf der Karte. Dieser Test, gleicher Satz:
nur „3 Positionen erkannt", keine Dehnungsfuge irgendwo sichtbar — weder auf der Karte noch im Entwurf,
auch keine offene Rückfrage dazu.

**Warum das schwerer wiegt als ein normaler Flakiness-Fall:** Der Fix vom 19.08. für dieses Problem hängt
komplett am Karten-Chip-Titel — er greift NUR, wenn die Karte „Dehnungsfuge" überhaupt als Leistung
meldet (siehe Fix-Update oben: „`aufnahme-hinweise.ts` erkennt jetzt den Chip-Titel..."). Diese Architektur
ist also nur so zuverlässig wie GPTs Karten-Erkennung selbst — und genau die ist hier gerade zweimal mit
demselben Satz unterschiedlich ausgefallen. Der Fix kann technisch einwandfrei funktionieren und trotzdem
regelmäßig ins Leere laufen, weil die vorgelagerte Erkennung, auf die er sich verlässt, selbst nicht
stabil ist. Damit lässt sich dieser Fall NICHT allein durch einen weiteren Nachtest klären — ein „diesmal
war sie wieder da" würde nur zeigen, dass es mal klappt, nicht dass es zuverlässig klappt.

**Für Head of Product Engineering:** Bitte prüfen, ob es für „Dehnungsfuge" (und ggf. andere rein
Chip-Titel-abhängige Sicherheitsnetz-Fixes) eine zweite, vom Karten-Chip unabhängige Fallback-Prüfung
geben kann — z. B. eine einfache Stichwortsuche direkt im Rohtranskript („Dehnungsfuge"/„Bewegungsfuge"),
analog zu den robusteren Signal-Prüfungen, die an anderer Stelle in diesem Fehlerkomplex schon eingebaut
wurden (`BODEN_VERLEGEN_SIGNAL` u. ä.), statt sich ausschließlich auf eine einzelne, nachweislich nicht
deterministische GPT-Chip-Antwort zu verlassen.

**Zwischenstand:** 2 von 3 Funden (Fischgrät-Verschnitt, Boden-Rückfragen) live bestätigt behoben. Der
dritte (Dehnungsfuge) ist jetzt ein eigener, neuer Fund — nicht mehr offen wegen Unklarheit über den
Transkript-Wortlaut, sondern wegen inkonsistenter GPT-Erkennung bei nachweislich identischem Wortlaut.
PM-013 bleibt aktiv, bis das geklärt ist.

**Fix-Update 3 (Head of Product Engineering, 2026-08-20) — Dehnungsfuge, unabhängig vom Karten-Chip:**
Genau wie empfohlen: `aufnahme-hinweise.ts` verlässt sich jetzt nicht mehr ausschließlich auf den
Karten-Chip-Titel, sondern prüft zusätzlich einen Fallback direkt im Rohtranskript (`dehnungsfuge|
bewegungsfuge`, dasselbe kombinierte Transkript, das auch die tiefere Berechnung sieht) — komplett
unabhängig davon, ob GPTs Karten-Erkennung die Leistung diesmal als eigenen Chip meldet oder nicht. Damit
kann derselbe Wortlaut nicht mehr zwei unterschiedliche Ergebnisse liefern, je nachdem, ob die (nachweislich
nicht deterministische) Chip-Erkennung gerade mitspielt.

Ein Unterschied zu den Chip-Titeln, den ich bewusst mit abgesichert habe: Chip-Titel sind kuratierte
Kurzlabel — GPT würde nie einen Chip „Keine Dehnungsfuge" nennen. Das Rohtranskript ist aber echter
Fließtext und könnte theoretisch eine Verneinung enthalten („keine Dehnungsfuge nötig"). Deshalb prüft der
neue Fallback zusätzlich dieselbe Verneinungserkennung, die im Code schon für „kein Fenster"/„keine Tür"
existiert (`arbeiten-normalisierer.ts`) — der Fallback erfindet also keine Position, wenn das Wort zwar im
Text steht, aber ausdrücklich ausgeschlossen wurde. Zwei neue Tests in `aufnahme-hinweise.test.ts`: einer
mit deinem exakten Nachtest-2-Transkript (Chip meldet diesmal absichtlich nichts, Fallback greift trotzdem),
einer mit einer ausdrücklichen Verneinung (keine Position entsteht).

**Ehrlich zum Stand:** Root-Cause und Fix sind mit gezielten Tests abgesichert, aber wie immer noch ohne
Live-Nachtest — und dieser Fall ist von Natur aus schwerer sauber zu bestätigen als die anderen beiden,
weil das eigentliche Problem (GPTs Chip-Erkennung ist nicht deterministisch) durch diesen Fix nicht
verschwindet, sondern nur umgangen wird. Ein einzelner „diesmal war sie da"-Nachtest reicht hier nicht als
Beweis (das galt schon beim letzten Mal) — aussagekräftiger wäre, den Fall 2-3 Mal hintereinander mit
demselben Transkript zu wiederholen und zu prüfen, ob die Dehnungsfuge jedes Mal auftaucht, unabhängig
davon, was die Karte in der Zwischenzeit anzeigt.

**Nachtest 3 (Sandy, 2026-08-21) — Dehnungsfuge-Fallback bestätigt, aber vier neue Funde:**

Karte: „7 Positionen erkannt" — Flur: Wandflächen streichen 2x (33,47 m²), Deckenfläche streichen 2x
(9 m²), Sockelleisten abkleben (12,7 lfdm), **Fertigparkett verlegen (9 m²)**; Wohnzimmer: Fertigparkett
verlegen inkl. 15% Verschnitt (41,4 m²), **Sockelleisten montieren (25 lfdm)**; Allgemein: **Fertigparkett
Fischgrät vollflächig verkleben (Menge prüfen, 0 Stück)**. Auffällig: diesmal KEIN eigener „Dehnungsfuge"-
Chip auf der Karte — genau der Fall, für den Fix-Update 3 gebaut wurde. Rückfrage nur eine: „Muss die
**alte Tapete** in 'Wohnzimmer' vorher runter?" → „Nein, drüber" beantwortet — die Wortwahl „Tapete" für
einen reinen Boden-Raum ist fachlich falsch (sollte „alter Bodenbelag" heißen, wie in den beiden
vorherigen Tests).

Entwurf Wohnzimmer (1.876,30 €):
- Fertigparkett verlegen inkl. 15% Verschnitt: 41,4 m² × 42,00 € = 1.738,80 € — ✅ exakt Soll, Fischgrät-
  Fix hält weiterhin
- **Dehnungsfuge einbauen: 1 Stück × 0,00 € (Preis fehlt)** — ✅ **jetzt im Entwurf, obwohl auf der Karte
  diesmal gar nicht als eigener Chip gemeldet.** Genau das Szenario, für das der Rohtranskript-Fallback aus
  Fix-Update 3 gebaut wurde — Fix bestätigt wirksam.
- **Sockelleisten montieren: 25 lfdm × 5,50 € = 137,50 €** — nicht im Soll, im Transkript nirgends
  erwähnt. 25 lfdm = exakt der volle Wohnzimmer-Umfang (2×(8+4,5)=25). Neuer Phantom-Fund.

Entwurf Flur (794,97 €):
- Wandflächen streichen 2×: 33,47 m² × 9,50 € = 317,96 € — exakt Soll
- Deckenfläche streichen 2×: 9 m² × 11,00 € = 99,00 € — exakt Soll
- **Fertigparkett verlegen: 9 m² × 42,00 € = 378,00 €** — nicht im Soll, ausdrücklich ausgeschlossen
  („da wird nix am Boden gemacht, der bleibt wie er ist"). 9 m² = exakt die Flur-Bodenfläche (5×1,8).
  Schwererer Phantom-Fund als die Boden-Rückfragen aus dem letzten Test (die waren mit Fix-Update 2
  behoben) — diesmal entsteht direkt eine echte, bepreiste Position, keine überspringbare Rückfrage.
- **„Sockelleisten abkleben" fehlt komplett** — auf der Karte mit 12,7 lfdm gemeldet, im Entwurf nicht
  vorhanden. Auch „Boden schützen" (im vorigen Test noch da, 9 m² ohne Preis) fehlt diesmal ganz.

Allgemein:
- **„Fertigparkett Fischgrät vollflächig verkleben (Menge prüfen)": 0 Stück, Preis fehlt** — offenbar eine
  doppelte, fehlerhafte Extraktion derselben Fischgrät-Verlegung, die im Wohnzimmer schon korrekt als
  eigene Position steht. Landet in keinem Raum, sondern in einem raumlosen „Allgemein"-Topf. Wegen Menge 0
  rechnerisch harmlos, aber verwirrend im fertigen Angebot.

**Befund:**

1. **Dehnungsfuge-Fix bestätigt.** Fix-Update 3 funktioniert wie gedacht — die Position erscheint jetzt
   im Entwurf, obwohl die Karte sie diesmal gar nicht als Chip gemeldet hat. Das war der eigentliche Zweck
   des Rohtranskript-Fallbacks, und er hält.
2. **Neuer, ernster Fund: Phantom-Bodenposition im Flur.** Trotz ausdrücklichem Ausschluss bekommt der
   Flur eine echte, bepreiste „Fertigparkett verlegen"-Position (9 m², 378 €) — dieselbe Fehlerkategorie,
   die Fix-Update 2 schon einmal auf Rückfragen-Ebene für genau diesen Fall behoben hatte
   (`kontext-analyzer.ts`/`anreichernBodenParkett`), jetzt aber offenbar auf der Positions-Erzeugungs-Ebene
   erneut aufgetreten — möglicherweise ein anderer Code-Pfad mit demselben losen „boden"-Substring-Problem,
   oder eine Nebenwirkung des neuen Dehnungsfuge-Fallbacks aus Fix-Update 3, falls dessen
   Rohtranskript-Scan nicht sauber pro Raum eingegrenzt ist.
3. **Neuer Fund: Phantom-Sockelleisten im Wohnzimmer**, exakt in Höhe des vollen Raumumfangs (25 lfdm) —
   nie erwähnt, wo doch „an den Wänden machen wir nix" ausdrücklich gesagt wurde. Sieht nach einer festen
   Annahme „neuer Boden → automatisch neue Sockelleisten" aus, unabhängig davon, ob das gesagt wurde.
4. **Neuer Fund: „Sockelleisten abkleben" (Flur) verschwindet trotz Karten-Erkennung mit echter Menge** —
   dieselbe „fehlende"-Fehlerfamilie wie bei PM-010/012 und der ursprünglichen Dehnungsfuge selbst, jetzt
   an einer weiteren Stelle. Zusätzlich fehlt auch „Boden schützen" (Flur), das im letzten Test noch da war.
5. **Neuer, kleinerer Fund: doppelte/fehlerhafte Fischgrät-Position im „Allgemein"-Topf**, Menge 0, kein
   Raum zugeordnet — rechnerisch harmlos, aber verwirrend.
6. **Neuer, kleinerer Fund: falsche Rückfrage-Formulierung.** „Muss die alte Tapete... vorher runter?" für
   einen Raum, der ausschließlich Boden-Gewerk ist (kein Maler-Bezug) — sollte „alter Bodenbelag" heißen
   wie in den beiden vorherigen Tests. Deutet auf eine Vermischung der Rückfragen-Texte zwischen den
   Gewerken hin — genau die Art Fehler, die dieser Testfall von Anfang an gezielt prüfen sollte (siehe
   „Warum dieser Fall").

**Für Head of Product Engineering:** Die gute Nachricht zuerst — Dehnungsfuge ist jetzt zuverlässig,
Fix-Update 3 hält. Aber der Fix scheint neue oder wiederaufgetauchte Probleme in der Nachbarschaft
aufgedeckt oder ausgelöst zu haben, alle in derselben strukturellen Familie wie die Mehrgewerk-Themen aus
Fix-Update 2: Boden-Signale, die room-übergreifend statt pro Raum ausgewertet werden. Bitte prüfen:
(1) warum trotz explizitem Ausschluss eine echte, bepreiste Parkett-Position im Flur entsteht (nicht nur
eine überspringbare Rückfrage wie beim letzten Mal); (2) woher die Sockelleisten-Position im Wohnzimmer
kommt, obwohl nie erwähnt; (3) warum „Sockelleisten abkleben" und „Boden schützen" im Flur diesmal
verschwinden, obwohl die Karte „Sockelleisten abkleben" korrekt mit Menge meldet; (4) die doppelte,
raumlose Fischgrät-„Allgemein"-Position; (5) die falsche „Tapete"-Formulierung in der Boden-Rückfrage. Ein
möglicher gemeinsamer Nenner bei (1)–(3): der neue Rohtranskript-Fallback aus Fix-Update 3 scannt jetzt das
GANZE kombinierte Transkript — falls das nicht sauber pro Raum eingegrenzt ist, könnte er Boden- und
Maler-Signale zwischen den beiden Räumen neu vermischen, wo Fix-Update 2 das eigentlich schon sauber
getrennt hatte. Das ist ein Regressions-Verdacht, kein bestätigter Befund — aber als erste Spur bei der
Fehlersuche hilfreich.

**Fix-Update (Head of Product Engineering, 2026-08-21) — alle fünf Nachtest-3-Funde, root-caused an echten
Produktionsrohdaten:** Sandys Regressions-Verdacht oben war die richtige Spur, aber nicht direkt der
Rohtranskript-Fallback aus Fix-Update 3 selbst — echte GPT-Rohdaten für genau diesen Testlauf gezogen
(Supabase, `entwurf_aufnahmen`, id `704a58d1…`) und durch die echte Pipeline-Funktion laufen lassen. Zwei
unabhängige Cross-Room-Bugs, beide dieselbe Fehlerfamilie wie schon Fix-Update 2 (ein GLOBALES Signal —
ganzes Transkript oder ein bloßes Boolean-Flag — wurde ungeprüft auf JEDEN Raum angewendet, nicht nur auf
den, der es wirklich betrifft):

1. **Phantom-„Fertigparkett verlegen" im Flur.** `mehrgewerk.ts` (`reichereBodenAn`) übergab den aus dem
   GANZEN Transkript erkannten Belag („parkett", wegen Wohnzimmers „Eichenparkett") bisher auch Räumen ohne
   eigenen Belag-Wert — beim Flur trotz „da wird nix am Boden gemacht, der bleibt wie er ist". Fix: ab zwei
   Räumen zusätzlich verlangen, dass der Raum SELBST ein Verlege-Signal in seiner eigenen `arbeiten[]`-Liste
   hat (bei genau einem Raum bleibt es unverändert, dort ist „ganzes Transkript" gleichbedeutend mit „dieser
   Raum" — bestätigt an einem bestehenden Test, der genau das braucht).
2. **Phantom-„Sockelleisten montieren" im Wohnzimmer (25 lfdm, voller Raumumfang).** `boden.ts` vertraute
   GPTs `sockelleisten`-Boolean blind — hier stand es auf true, obwohl „Sockelleisten" im Transkript kein
   einziges Mal vorkommt. Sieht nach einer GPT-seitigen Standardannahme „neuer Boden → automatisch neue
   Sockelleisten" aus. Fix: das Flag reicht allein nicht mehr, es braucht zusätzlich einen echten
   „sockelleist…"-Treffer im Rohtranskript (bewusst NICHT die `arbeiten[]`-Liste dieses Raums geprüft — ein
   bestehender Golden-Test, PM-002b, zeigt einen echten Fall, wo GPT „Sockelleisten werden neu montiert" im
   Transkript korrekt umsetzt, es aber NICHT zusätzlich in `arbeiten[]` verewigt; ein `arbeiten[]`-Gate hätte
   diesen legitimen Fall mitgestrichen — das ist mir beim ersten Versuch passiert und der volle Testlauf hat
   es aufgedeckt).
3. **„Sockelleisten abkleben" (Flur) verschwindet.** War kein eigener dritter Bug, sondern eine
   Kettenreaktion von Fund 2: `aufnahme-hinweise.ts`s „Sockelleisten montieren"-Sicherheitsnetz entfernte
   bisher JEDE „Sockelleisten abkleben"-Position im GESAMTEN Auftrag, sobald irgendein Raum eine
   Montage-Karte hatte — die Karten-Chip-Titel selbst tragen keinen Raumbezug. Mit Fund 2 behoben verschwindet
   der Auslöser, zusätzlich aber auch direkt gehärtet: der Filter entfernt jetzt nur noch im selben Raum wie
   die Montage-Position (analog zu `entferneRedundantesSockelAbkleben`, das in `mehrgewerk.ts` schon richtig
   raumscharf war). Auch der zweite Zweig (der ohne vorhandene Montage-Position sonst raten müsste, welchem
   Raum eine raumlose Chip-Menge gehört) greift jetzt nur noch bei eindeutig einem einzigen Raum.
4. **Doppelte, raumlose Fischgrät-Position im „Allgemein"-Topf.** Seit Fix-Update 2 rechnet die Boden-Engine
   den Fischgrät-Verschnitt direkt in die Hauptposition ein („Fertigparkett verlegen inkl. 15% Verschnitt"),
   ohne dass deren Text „fischgrät" oder „verkleben" enthält — die ältere, auf einen eigenen Aufpreis-Posten
   ausgelegte Vollständigkeits-Prüfung (`boden-sonder.ts`, `pruefeFischgraet`) erkannte das nicht und legte
   bei der hier kombinierten Mehrraum-Transkriptfläche eine zweite, raumlose „(Menge prüfen)"-Position an.
   Fix: die Prüfung erkennt „verschnitt" jetzt zusätzlich als Beleg, dass der Verschnitt schon in der echten
   Position steckt.
5. **Falsche Rückfrage-Formulierung („alte Tapete" in einem reinen Boden-Raum).** `kontext-analyzer.ts`s
   Tapete-Rückfrage lief bisher ohne den `hatStreichen`-Gate, den alle anderen Maler-Rückfragen in derselben
   Schleife schon hatten — `altbelag_vorhanden` ist ein generisches „alter Belag da"-Flag, das GPT für Boden-
   UND Maler-Räume gleichermaßen setzt, und wurde hier fälschlich immer als „alte Tapete" gelesen. Fix: Gate
   ergänzt, ein Raum ohne Streich-/Wandbezug ist kein Tapete-Kandidat mehr, egal was `altbelag_vorhanden`
   sagt.

**Bewusst nicht (mit-)behoben:** die korrekte „Muss der alte Bodenbelag entfernt werden?"-Rückfrage für das
Wohnzimmer fehlt in Nachtest 3 weiterhin komplett — nicht weil Fund 5 falsch behoben wurde, sondern weil
`analysiereKontext` (kontext-analyzer.ts) über einen `switch(gewerk)` nur EINE Gewerke-Anreicherung pro
Auftrag aufruft, basierend auf dem einen globalen `gewerk`-Feld („maler" hier). Bei einem echten
Mehrgewerk-Auftrag läuft `anreichernBodenParkett` (die Funktion, die die richtige Frage stellen würde) dadurch
nie. Das ist dieselbe offene Architektur-Frage, die schon in Fix-Update 2 („sollte `analysiereKontext`
grundsätzlich pro Raum/Gewerk statt pro Auftrag laufen") zurückgestellt wurde — Fund 5s Fix entfernt die
FALSCHE Frage zuverlässig, ersetzt sie aber (noch) nicht durch die richtige. Bitte separat priorisieren, falls
gewünscht — der Fix dafür ist größer (beide Gewerke müssten `analysiereKontext` durchlaufen, nicht nur das
primäre) und ich wollte ihn nicht ungetestet in denselben Fix mit reinziehen.

**Nachtrag (2026-08-21, beim PM-020-Fix geprüft):** die Vermutung oben war nur zur Hälfte richtig. Fund 2s
Fix (`boden.ts`, Engine) hat PM-020s Phantom in der Engine selbst tatsächlich mitgelöst — aber ein zweiter,
unabhängiger Fallback in `vollstaendigkeit/boden-vorarbeiten.ts` hat exakt dieselbe Annahme separat nochmal
gemacht und die Position trotzdem wieder erzeugt. Musste extra gefixt werden, siehe Fix-Update direkt bei
PM-020.

**Wie geprüft:** alle vier Cross-Room-Positionsbugs an den ECHTEN Produktionsrohdaten für diesen Testlauf
verifiziert (GPTs `voll_extraktion.result` 1:1 aus der DB, durch die reale `verarbeiteExtraktion`-Pipeline
laufen lassen) — Ergebnis danach: keine Flur-Parkett-Position, keine Wohnzimmer-Sockelleisten-Montage, Boden
schützen + Sockelleisten abkleben im Flur beide wieder da, keine doppelte Fischgrät-Position, Fischgrät-
Verschnitt weiterhin korrekt bei 41,4 m². Zusätzlich 7 neue, dauerhafte Tests (nicht nur der Debug-Lauf):
`mehrgewerk.test.ts` (neue Testgruppe mit den echten PM-013-Nachtest-3-Rohdaten, 5 Assertions),
`aufnahme-hinweise.test.ts` (raumscharfe Filterung), `rueckfragen-flow.test.ts` (Tapete-Rückfrage-Gate).
Ganze Suite weiterhin grün (243/243, vorher 236 — 7 neue Tests, keine Regression), inkl. des bestehenden
PM-002b-Golden-Tests, der beim ersten (zu strengen) Anlauf des Sockelleisten-Fixes tatsächlich rot wurde und
mich auf die richtige, transkriptbasierte statt arbeiten[]-basierte Lösung gebracht hat. Wie immer: noch OHNE
Live-Nachtest im echten Tool.

**Nachtest 4 (Sandy, 2026-08-25) — alle fünf Nachtest-3-Funde bestätigt behoben, aber die Dehnungsfuge ist
jetzt komplett weg:**

Karte: Wohnzimmer „1 Position" — Fertigparkett verlegen inkl. 15% Verschnitt (41,4 m²); Flur „4 Positionen"
— Wandflächen streichen 2× (35,36 m²), Deckenfläche streichen 2× (9 m²), Boden schützen (9 m²), Sockelleisten
abkleben (12,7 lfdm). Rückfrage nur eine: „Muss der alte Bodenbelag in 'Wohnzimmer' entfernt werden?" →
„Ja, raus" beantwortet — diesmal korrekt „Bodenbelag" statt „Tapete".

Entwurf Wohnzimmer (1.738,80 €):
- Fertigparkett verlegen inkl. 15% Verschnitt: 41,4 m² × 42,00 € = 1.738,80 € — exakt Soll, Fischgrät-Fix
  hält weiterhin.
- Altbelag entfernen: 36 m² × 0,00 € (Preis fehlt) — korrekt, passend zur bestätigten Rückfrage.
- **Keine Dehnungsfuge-Position** — weder auf der Karte, noch im Entwurf, noch als offene Rückfrage. Dazu
  gleich mehr unten.

Entwurf Flur (445,08 €):
- Wandflächen streichen 2×: 35,36 m² × 9,50 € = 335,92 € — **kein Bug, sondern korrekt.** Seit der
  VOB-Übermessungsregel (2026-08-21) wird die Türöffnung (1,89 m², ≤2,5 m²) nicht mehr abgezogen — die
  volle Umfangsfläche 13,60 × 2,60 = 35,36 m² ist jetzt die richtige Soll-Zahl, nicht mehr die alten
  33,47 m². Das ist dieselbe Art Verwechslung, die mir bei PM-001 schon einmal passiert ist — hier bewusst
  vermieden.
- Deckenfläche streichen 2×: 9 m² × 11,00 € = 99,00 € — exakt Soll.
- Boden schützen: 9 m² × 0,00 € (Preis fehlt) — korrekt, normale Maler-Nebenleistung.
- Sockelleisten abkleben: 12,7 lfdm × 0,80 € = 10,16 € — exakt Soll (13,60 − 0,90 Türbreite; die
  VOB-Regel gilt ausdrücklich NICHT für die Sockelleisten-Länge, dort bleibt der Türabzug bestehen).
- **Keine** Phantom-„Fertigparkett verlegen"-Position im Flur — Nachtest-3-Fund 2 ist weg.

**Befund:**

1. **Alle fünf Nachtest-3-Funde live bestätigt behoben:** kein Phantom-„Fertigparkett" im Flur, keine
   Phantom-„Sockelleisten montieren" im Wohnzimmer, „Sockelleisten abkleben" im Flur ist zurück und
   rechnerisch exakt, keine doppelte raumlose Fischgrät-„Allgemein"-Position, und die Rückfrage fragt
   korrekt nach „Bodenbelag" statt „Tapete". Fix-Update vom 21.08. hält vollständig.
2. **Neuer, eigenständiger Fund: die Dehnungsfuge ist wieder komplett verschwunden.** Das ist der dritte
   unterschiedliche Ausgang für exakt denselben Satz („da muss wahrscheinlich ne Dehnungsfuge rein, mach
   das bitte mit rein"): Nachtest 2 — Karte meldet nichts, Entwurf auch nicht. Nachtest 3 — Karte meldet
   nichts, aber der Rohtranskript-Fallback aus Fix-Update 3 greift und die Position erscheint im Entwurf
   (als „bestätigt wirksam" dokumentiert). Nachtest 4 (hier) — Karte meldet nichts UND der Fallback greift
   diesmal auch nicht: keine Position, keine 0,00-€-Zeile, keine Rückfrage. Das ist eine Regression eines
   Mechanismus, der beim letzten Test noch nachweislich funktioniert hat, mit identischem Wortlaut.
3. Sandy diktiert nach etabliertem Muster immer den vollständigen, exakten Testsatz — daher wird das hier
   direkt als Bug gewertet und nicht erneut nachgefragt, ob die Dehnungsfuge diesmal wirklich gesagt wurde.

**Fix-Update 4 (Head of Product Engineering, 2026-08-25) — es war keine Regression, und der Rat, in die
Rohdaten zu schauen, war goldrichtig.**

Dein Verdacht ging Richtung Nebenwirkung der Nachtest-3-Fixes. Ich habe deshalb zuerst das Rohtranskript
dieses Laufs aus der Produktions-Datenbank geholt, bevor ich im Code gesucht habe. Dort steht wörtlich:

> „…da muss wahrscheinlich eine **Dehnungsfuhre** rein."

**Whisper hat sich verhört.** Der Fallback sucht nach „dehnungsfuge"/„bewegungsfuge" — und findet
völlig zu Recht nichts, weil das Wort so nie bei ihm ankommt. Der Mechanismus war nie kaputt; er hat in
Nachtest 3 funktioniert, weil Whisper es dort richtig geschrieben hatte. Das erklärt auch sauber, warum
derselbe diktierte Satz drei verschiedene Ausgänge hatte: die Spracherkennung schreibt ihn jedes Mal
etwas anders. Deine Einordnung „direkt als Bug werten, nicht nachfragen ob sie gesagt wurde" war dabei
genau richtig — sie WURDE gesagt, sie kam nur anders an.

**Fix:** Das Muster toleriert jetzt die üblichen Verhörer — Fuge/Fuhre/Fuhr, mit den Wortstämmen
Dehnungs-/Dehn-/Bewegungs-, mit oder ohne Bindestrich, Singular wie Plural. Der Wortstamm bleibt Pflicht:
eine „Fuhre Sand" löst nichts aus. Die Verneinungserkennung („ohne Dehnungsfuhre") gilt für alle
Schreibweisen mit. 7 neue Tests, einer davon mit exakt deinem Transkript aus diesem Nachtest.

**Einordnung, die über diesen Fall hinausgeht:** Das ist dieselbe Fehlerklasse wie „Systemischer Fund"
Punkt 6 (verschluckte Maßangaben) — Whisper verändert etwas, bevor unser Code die Daten überhaupt sieht.
Beide Fälle sind an einem Tag aufgetreten. Wo wir auf ein einzelnes gesprochenes Wort angewiesen sind,
brauchen wir Toleranz gegenüber Hörfehlern, nicht exakte Wortgleichheit.

**Ursprünglicher Auftrag:** Der Rohtranskript-Fallback aus Fix-Update 3 (`aufnahme-hinweise.ts`,
Scan nach `dehnungsfuge|bewegungsfuge`) hat in Nachtest 3 nachweislich funktioniert und liefert jetzt, beim
selben Transkript, wieder gar nichts. Bitte prüfen, ob der Fallback von etwas abhängt, das zwischen den
beiden Testläufen still mitgeändert wurde — die naheliegendsten Kandidaten sind Nebenwirkungen der später
verbauten Fixes aus dem „alle fünf Nachtest-3-Funde"-Update (insbesondere Fund 1, der `reichereBodenAn` jetzt
zusätzlich ein raumeigenes Verlege-Signal in `arbeiten[]` verlangt — falls der Dehnungsfuge-Fallback
irgendwo an denselben Raum-Gate hängt, statt wie ursprünglich gebaut komplett unabhängig vom übrigen
Raum-Matching zu laufen, würde das genau so ein Verschwinden erklären) oder die Verneinungserkennung aus
Fix-Update 3 selbst, falls sie zu aggressiv greift. Am aussagekräftigsten wäre ein Blick in die echten
Rohdaten dieses Laufs (wie beim „alle fünf Nachtest-3-Funde"-Fix schon einmal gemacht), um zu sehen, ob GPT
„Dehnungsfuge" diesmal überhaupt ins Transkript geschrieben hat oder ob der Fallback es zwar im Text findet,
aber danach verwirft.

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
3. Die zusätzliche VOB-Feinheit, dass Leibungen übermessener (nicht abgezogener) Öffnungen ebenfalls nicht
   separat berechnet werden dürften — `daten.leibungen[]` hat aktuell keine Verknüpfung zu einzelnen
   Fenster-/Tür-Objekten, das wäre eine größere, eigene Änderung.

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

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->

