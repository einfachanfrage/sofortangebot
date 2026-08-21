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
| PM-001 | Ausschluss + Selbstkorrektur (Wohnzimmer) | ✅ Ausschluss-Fix live bestätigt (keine Decken-Position mehr). Karte-vs-Angebot-Diskrepanz (Boden schützen fehlte auf der Karte) jetzt systematisch für alle Nebentätigkeiten behoben (2026-08-20, siehe Fix-Update) — inkl. eines dabei gefundenen separaten Bugs in der echten Kalkulation (nicht nur der Vorschau). 236 Tests grün, Live-Nachtest steht noch aus |
| PM-002 | Akzentwand + Boden diagonal (Schlafzimmer) | ✅ beide Bugs live nachgetestet, bestätigt behoben |
| PM-003 | Kleinreparatur + Höhenzuschlag (Flur) | ✅ alle drei Punkte live bestätigt behoben (Grundierung, Fenster-Rückfrage, rotes „!") |
| PM-004 | Laminat gerade + Trittschalldämmung (Kinderzimmer) | ✅ Verschnitt-Bug live nachgetestet, bestätigt behoben |
| PM-005 | Zwei Räume, Scope "nur Decke" (Küche/Speisekammer) | ✅ komplett behoben und live bestätigt — schwerster Fund der Testreihe, jetzt zu |
| PM-006 | Kleines Fenster + Altbau-Zuschlag (Büro) | ✅ bestätigt bekannter Punkt, keine Dringlichkeit |
| PM-007 | Dachgeschoss: Kniestock + Dachschrägen | ✅ Alle Rechenfehler live bestätigt behoben (Kniestock 20,4 m², Dachschrägen 23,08 m², keine unverlangte Spachtelposition mehr); fehlende Standardpreise jetzt ergänzt (2026-08-20, siehe „Systemischer Fund" Punkt 1), Live-Nachtest dafür steht aus; offen bleibt nur das Designer-Thema (PD-005) |
| PM-008 | Fassade | ✅ Nachtest 7 (2026-08-20): „So gerechnet"-Rechenbug live bestätigt behoben (66,96 m², kein Widerspruch mehr zur abgerechneten Position), Wand-Chip/PD-003 bleibt fehlerfrei. Fachlich/rechnerisch komplett grün, offen bleibt nur die Erschwerniszuschlag-Einheitenfrage (Pauschale vs. %, wartet auf Sandys Entscheidung, siehe PM-015) — Details im Archiv |
| PM-009 | Bodenleger-Komplettpaket | ✅ Übergangsschiene live bestätigt behoben (taucht jetzt auf); fehlender Standardpreis dafür jetzt ergänzt (2026-08-20, siehe „Systemischer Fund" Punkt 1), Live-Nachtest dafür steht aus |
| PM-010 | Sockelleisten-Doppel-Falle | ✅ Nachtest (2026-08-20): „Sockelleisten entfernen" jetzt live bestätigt behoben (12,1 lfdm, exakt Soll) — damit alle vier ursprünglichen Funde geklärt (Bodenaustausch weg, Sockelleisten streichen behoben, 350-Bug akzeptierte Design-Entscheidung, Sockelleisten entfernen jetzt auch). Offen bleibt nur die fehlende Preishinterlegung dafür — Details im Archiv |
| PM-011 | Vollflächenspachtelung Q2 vs. Kleinreparatur (Arbeitszimmer) | 🟡 Q2-Vollflächenspachtelung + Grundierung fachlich korrekt; Kleinreparatur-Bug trotz Verneinung jetzt gefixt (2026-08-20, siehe Fix-Update), Live-Nachtest steht aus; PD-008 beim Designer. „Alle 7 Positionen ohne Preis"-Fund root-caused (2026-08-19): kein Matching-Bug, Nachtest lief auf dem bekannten PM-015-Testkonto ohne Maler-Katalog — siehe „Systemischer Fund" Punkt 5, Entscheidung bei Sandy, wie das Konto nachversorgt wird |
| PM-012 | Sockelleisten-Falle umgekehrt: nur streichen, ausdrücklich nicht neu (Esszimmer) | ✅ Nachtest (2026-08-20): „Sockelleisten streichen" jetzt live bestätigt behoben (14,1 lfdm, exakt Soll), nach fünf gescheiterten Versuchen. Kein Boden-Phantom, Ausschluss weiterhin sauber respektiert — Details im Archiv |
| PM-013 | Zwei Räume, getrennte Gewerke + Fischgrät + Dehnungsfuge (Wohnzimmer/Flur) | 🟡 Fix-Update (2026-08-21): alle fünf Nachtest-3-Funde behoben (Phantom-Parkett Flur, Phantom-Sockelleisten Wohnzimmer, verschwundenes „Sockelleisten abkleben" Flur, doppelte Fischgrät-Position, falsche „Tapete"-Rückfrage). Dehnungsfuge-Fallback weiter bestätigt. Noch ohne Live-Nachtest |
| PM-014 | Doppelte Positionen + instabile Summen bei Angebot 2026-0016 (live entdeckt, kein geplanter Testfall) | 🟡 Dubletten-Fix bestätigt (Doppelklick-Test). Echte Race Condition jetzt mit DB-Constraint geschlossen (2026-08-20, Sandys Go, siehe Fix-Update 2) — Migration live, Code-Fix grün gegen Testsuite, gezielter Gleichzeitigkeits-Nachtest steht noch aus |
| PM-015 | Preisdatenbank praktisch leer bei „manuell"-Onboarding + Anzeige-Bug versteckt Nachlade-Button (live entdeckt am Konto „Lisa Schein Malerbetrieb", kein geplanter Testfall) | 🟡 Beide Ursachen gefunden und gefixt, geprüft live im Code korrekt. **Klargestellt (2026-08-19):** der PM-011-„alle Preise fehlen"-Fund war KEIN neuer, dritter Bug — derselbe Nachtest lief auf demselben, schon damals betroffenen Konto „Lisa Schein Malerbetrieb", das vor dem Fix (17.08.) angelegt wurde und dadurch nicht rückwirkend versorgt ist, siehe „Systemischer Fund" Punkt 5. Für alle NEU angelegten Konten ab 18.08. gilt der Fix nachweislich. **Korrektur (2026-08-19, siehe PM-016):** der 18.08.-Fix selbst war kaputt — der Onboarding-Insert scheiterte durch denselben Bug wie PM-016 komplett und unbemerkt (Fehler wurde nicht geprüft). „Lisa Schein" ist inzwischen live nachversorgt |
| PM-016 | „Standardpreise importieren" auf `/preise` schlägt fehl: „Die Standardpreise konnten nicht vollständig ergänzt werden." (live entdeckt am Konto „Lisa Schein Malerbetrieb", kein geplanter Testfall) | ✅ Root-Cause gefunden und gefixt (2026-08-19), Konto live nachversorgt (341 Positionen), gleicher Bug auch im Onboarding-Seeding gefixt |
| PM-017 | Tapete statt Streichen + Grundierung trotz Neuputz ausdrücklich abgelehnt (Kinderzimmer) | ✅ Live-Nachtest (2026-08-21) bestätigt: „Tapete tapezieren" jetzt mit exakt 31,91 m² und korrektem Preis, keine Phantom-Positionen mehr, keine Grundierung — Details im Archiv |
| PM-018 | Q3-Vollflächenspachtelung an Wand UND Decke getrennt (Arbeitszimmer) | ✅ Live-Nachtest (2026-08-21) bestätigt: alle 8 Positionen exakt Soll, „Q3" korrekt an Wand und Decke, Deckengrundierung vorhanden — Details im Archiv |
| PM-019 | Erschwerniszuschlag „schwieriger Untergrund" isoliert von Höhe/Altbau (Gäste-WC) | 🟡 Fix-Update (2026-08-21): „schwieriger Untergrund"-Zuschlag ergänzt, Raum-Gruppierung für „Gästeklo" behoben. Falsche Raummaße root-caused als Whisper-Transkriptionsfehler (kein Code-Bug, nicht fixbar). Noch ohne Live-Nachtest |
| PM-020 | Teppich verlegen, alter Belag bleibt liegen (neue Ausschluss-Formulierung), Verschnittsatz unklar (Kinderzimmer 2) | 🟡 Fix-Update (2026-08-21): Altbelag-Verneinungserkennung ergänzt (boden-normalisierer.ts), Sockelleisten-Phantom-Fallback verlangt jetzt Textsignal (boden-vorarbeiten.ts). Noch ohne Live-Nachtest |
| PM-021 | Mehrere unterschiedlich große Öffnungen + expliziter Einfachanstrich, VOB-Übermessungsfrage zugespitzt (Wohnküche) | 🟡 Fix-Update (2026-08-21): Phantom-„Balkonboden streichen" behoben — „Terrassentür"/„Balkontür" zählen jetzt nur noch als Türname, nicht als Ortsangabe (maler-extras.ts). Noch ohne Live-Nachtest |

**Erledigt (2026-08-20):** Die vier fehlenden Standardpreise (Kniestockwände streichen, Dachschrägen
streichen, Fassadenfläche streichen, Übergangsschiene) sind nachgetragen — zusammen mit einer
kompletten Sauber-Durchsicht der ganzen Preisdatenbank für Maler und Bodenleger. Details unten im
Abschnitt „Systemischer Fund" Punkt 1 (Fix-Update).

**Noch offen, bewusst zurückgestellt (niedrige Priorität, siehe PM-003/006):**
1-Cent-Rundungsdrift zwischen Positions-Summe und Gesamtbetrag; fehlende
VOB-Übermessungsregel für kleine Fensteröffnungen.


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

**Details für abgeschlossene Fälle (PM-002, PM-003, PM-004, PM-005, PM-006, PM-007, PM-009):** siehe `pruefmeister-testfaelle-archiv.md` — Status hier in der Tabelle bleibt als Kurzfassung stehen.

---

## PM-001 — Ausschluss + Selbstkorrektur (Wohnzimmer)

**Datum:** 2026-08-16
**Status:** ❌ Bug real und reproduzierbar — aber KEIN Rückfall/keine Regression. Der erste Durchlauf hat den Ausschluss-Satz gar nicht enthalten (Eingabefehler beim Einsprechen, siehe Korrektur unten). Der Nachtest mit vollständigem Text war der erste echte Test dieses Falls. Höchste Priorität bleibt bestehen.

**Zum Einsprechen:**
„Also, äh, Wohnzimmer, fünf zwanzig mal vier zehn, Deckenhöhe zwo fünfzig. Wände komplett streichen, zweimal drüber. Ein Fenster — ne halt, zwei Fenster sind da drin, Standardgröße reicht. Eine Tür, normal Maß. Die Decke lassen wir, ist erst letztes Jahr gemacht worden, die bitte NICHT mitrechnen. Sockelleisten kleben wir noch ab, sind aus Holz, werden mitgestrichen.“

**Soll-Lösung:**
- Umfang: 2×(5,20+4,10) = 18,60 lfm
- Wandfläche brutto: 18,60 × 2,50 = 46,50 m²
- Abzug 2 Fenster Standard (1,20×1,00 je): 2,40 m²; 1 Tür Standard (0,90×2,10): 1,89 m²
- Wandflächen streichen 2×: **42,21 m²**
- Decke: **keine Position** (ausdrücklich ausgeschlossen)
- Sockelleisten abkleben — Maler: 18,60 − 0,90 = **17,70 lfm**

**Ist-Ergebnis (aus dem Tool):**
- Wandflächen streichen 2×: 42,21 m² × 9,50 € = 401,00 € ✓
- Boden schützen: 21,32 m² × 1,20 € = 25,58 € (nicht im ursprünglichen Soll, aber fachlich plausibel als automatisch abgeleitete Nebenleistung — kein Fehler)
- Sockelleisten abkleben: 17,7 lfdm × 0,80 € = 14,16 € ✓
- Keine Decken-Position ✓
- Summe: Netto 440,74 € / MwSt 83,74 € / Gesamt 524,48 € — rechnerisch konsistent

**Befund:** Keiner. Selbstkorrektur, expliziter Ausschluss und Gewerk-Zuordnung Sockelleiste liefen alle korrekt.

**Nachtest (2026-08-16, späterer Durchlauf):** Aufnahme-Karte zeigte diesmal nur „Wände streichen" und „Sockelleisten abkleben" (kein „Decke streichen" — die Karte hat den Ausschluss also richtig verstanden), aber das fertige Angebot enthält trotzdem „Deckenfläche streichen 2×" für 234,52 € (Netto insgesamt 675,26 € statt ursprünglich 440,74 €). Zusätzlich weiterhin die Diskrepanz „Fenster: 1" auf der Karte vs. „Fenster: 2" in der Rechnung. Das ist genau der in den Bekannten-Schwachstellen als „schlimmster Fehler" benannte Fall: ausdrücklicher Ausschluss wird von der Karte korrekt verstanden, aber von der finalen Berechnung ignoriert.

**Korrektur (Sandy, 2026-08-16, über Chief of Staff eingetragen):** Die Einordnung oben als „bestätigter Rückfall, identischer Input" war falsch, das muss ich richtigstellen. Beim allerersten Einsprechen von PM-001 hab ich nicht den Wortlaut aus dieser Datei vorgelesen, sondern eine kurze Zusammenfassung aus dem Chat gesagt — dabei ist der Ausschluss-Teil („die bitte NICHT mitrechnen") komplett weggefallen. Der erste Durchlauf hat den Ausschluss-Fall also gar nicht getestet, deshalb lief er sauber durch — das „Bestanden" von damals war kein echtes Bestanden für diesen Fall. Erst beim Nachtest hab ich den vollständigen Text aus dieser Datei eingesprochen, mit dem Ausschluss drin. Das war der erste echte Test dieses Falls, nicht ein zweiter Durchlauf mit identischem Input — und er ist fehlgeschlagen. **Kein Hinweis auf eine Regression oder Flakiness der Pipeline, sondern ein Bug, der vermutlich von Anfang an da war und jetzt zum ersten Mal richtig getestet wurde.** Bleibt trotzdem höchste Priorität, weil es genau der „schlimmster Fehler"-Fall ist — nur die Ursache ist eine andere als gedacht.

**Klärungsbedarf (Prüfmeister, 2026-08-16):** Das steht im Widerspruch zu dem, was Sandy mir direkt im Chat gesagt hat, als ich genau danach gefragt habe — dort hat sie mir bestätigt, dass sie den Nachtest „genauso" wie beim ersten Mal eingesprochen hat, und mir den vollständigen Wortlaut inklusive Ausschluss-Satz zitiert. Kann sein, dass sich diese Bestätigung nur auf den Nachtest selbst bezog (und der allererste Durchlauf tatsächlich, wie hier beschrieben, eine Zusammenfassung war) — dann widersprechen sich die beiden Aussagen gar nicht wirklich. Sandy, magst du kurz bestätigen, welche Version stimmt? Für die Einordnung „Regression/Flakiness vs. nie richtig getesteter Bug" macht das einen Unterschied, für die Priorität (fixen!) ändert sich nichts.

**Fix-Update (Head of IT, 2026-08-16):** Root-Ursache gefunden — und sie
erklärt nebenbei auch das übergreifende Muster, das der Prüfmeister an den
Chief of Staff gemeldet hat („Karte zeigt was anderes als am Ende berechnet
wird"). Karte und fertiger Entwurf lösen bei dir zwei UNABHÄNGIGE GPT-
Aufrufe auf demselben Transkript aus (kein Rückfragen-Fall hier, also kein
Wiederverwenden der ersten Extraktion). GPT ist nicht bei jedem Aufruf exakt
gleich — bei einem der beiden Aufrufe hat es den Ausschluss-Satz „die bitte
NICHT mitrechnen" übersehen (er steht weit hinten im Satz, mit viel Text
dazwischen) und die Decke doch in die Arbeiten-Liste gepackt. Das ist an
sich schon nicht ideal, aber der eigentliche Fehler war: die Sicherheitsprüfung
danach, die genau solche Fälle auffangen soll, kannte die Formulierung „X
lassen wir" / „X nicht mitrechnen" gar nicht als Ausschluss — nur die engeren
Formen „ohne X" / „keine X". Dadurch kam die fälschlich hinzugefügte Decke
ungebremst durch bis ins fertige, bepreiste Angebot.

Fix: Die Ausschluss-Erkennung (`erkenneScope` in `arbeiten-normalisierer.ts`)
kennt jetzt zusätzlich „X lassen wir" und „X nicht mitrechnen/-kalkulieren/
berücksichtigen" — bewusst als eigene, enge Formulierungen, nicht als
allgemeines „X ... nicht" (das wäre zu unsicher, siehe Code-Kommentar). Diese
Prüfung liest die ORIGINALEN Worte aus dem Transkript, ist also unabhängig
davon, ob GPT bei einem bestimmten Aufruf den Ausschluss selbst korrekt
umsetzt — sie fängt genau das nochmal ab, was GPT gelegentlich verpasst.
2 neue Tests: einer mit korrekter GPT-Extraktion (bestand schon vorher),
einer, der genau den beobachteten Fehlerfall nachstellt (GPT vergisst den
Ausschluss trotzdem) — der wäre vorher durchgerutscht, jetzt nicht mehr.
Alle 667 Tests im Projekt grün.

Noch offen, bewusst nicht mit angefasst: die Fenster-Diskrepanz („1" auf der
Karte vs. „2" in der Rechnung) aus dem Nachtest — anderes Thema, separat
prüfen. Und: diese Art Fix schützt nur Ein-Raum-Aufträge zuverlässig (bei
mehreren Räumen greift aus dem PM-005-Grund eine engere, raumbezogene
Prüfung, die den Rohtext bewusst nicht mehr querliest) — für Mehrraum-Fälle
mit demselben Muster bräuchte es einen eigenen, weiteren Schritt, aber dafür
liegt noch kein bestätigter Testfall vor. Live-Test durch dich steht aus.

**Dritter Durchlauf (Prüfmeister, 2026-08-16):** Erklärung von Head of IT passt exakt zu dem, was ich
gerade nochmal live gesehen habe. Denselben Fall ein drittes Mal eingesprochen — diesmal wieder
**korrekt**: keine Decken-Position, Wandflächen exakt 42,21 m², Sockelleisten abkleben exakt 17,7 lfdm,
alles Soll-genau. Damit stehen jetzt 2 von 3 Durchläufen korrekt gegen 1 von 3 falsch (der Nachtest mit
den 234,52 €) — passt zur „GPT nicht bei jedem Aufruf exakt gleich"-Erklärung oben. Ob dieser dritte
Durchlauf schon nach dem Fix lief oder noch davor reiner Zufallstreffer war, weiß ich nicht — aber als
zusätzlicher Datenpunkt für „das war Flakiness, kein fester Logikfehler" passt es. Sag Bescheid, wenn
du möchtest, dass ich das nochmal gezielt nach dem Fix-Deploy zum Gegenchecken einspreche.

**Nachtest nach Fix-Deploy (Sandy, 2026-08-17):** ✅ Fix bestätigt. Wohnzimmer nochmal frisch
eingesprochen (5,20×4,10×2,50, Ausschluss „Decke lassen wir, NICHT mitrechnen" wie im Original). Karte
zeigt jetzt korrekt nur „Wände streichen" + „Sockelleisten abkleben", **keine Decke** — und im fertigen
Angebot bleibt es auch dabei: keine Deckenposition. Zahlen exakt Soll: Wandflächen 42,21 m² × 9,50 € =
401,00 €, Sockelleisten abkleben 17,7 lfdm × 0,80 € = 14,16 €. Der Kernbug (Ausschluss wird ignoriert)
ist damit live bestätigt behoben.

Ein kleinerer, neuer Fund bleibt: die Karte zeigte „2 Positionen erkannt" (Wände streichen,
Sockelleisten abkleben), das fertige Angebot liefert aber **3** — zusätzlich „Boden schützen" (21,32 m²
× 1,20 € = 25,58 €), das nie im Transkript vorkam und auch nicht auf der Karte stand. Fachlich ist
„Boden schützen" beim Streichen plausibel als automatisch abgeleitete Nebenleistung (kein Rechenfehler),
aber die Karte verspricht damit wieder eine andere Zahl als das, was am Ende berechnet wird — dieselbe
Familie wie PD-001/PD-004. Kein Blocker, aber bitte beim Designer mitdenken (siehe PD-004).

**Fix-Update (Head of Product Engineering, 2026-08-20):** Sandys Ansage dazu war eindeutig: *„das
angehen!! für alle 'nebentätigkeiten', auch sockelleisten abkleben etc"* — nicht nur „Boden schützen"
reparieren, sondern das systematisch für jede automatisch ergänzte Nebentätigkeit lösen. Root-Ursache:
die Aufnahmekarte nutzt bisher ausschließlich das schnelle, günstige Chip-Modell
(`extrahiereChips`/`CHAT_MODEL_FAST`) direkt nach der Aufnahme — reine Vorschau, extra dafür so benannt
im Code-Kommentar: „Zeigt dem Nutzer sofort, WAS erkannt wurde — die echten Mengen/Preise rechnet später
die Engine". Was diese Vorschau nie sieht: die Vollständigkeits-Prüfung (`vollstaendigkeit/*.ts`), die
beim „Positionen berechnen" automatisch Nebentätigkeiten wie Boden schützen, Sockelleisten abkleben,
Grundierung, Fliesenspiegel/Lampen/Heizkörper abkleben usw. ergänzt.

Neue Datei `src/lib/chips-vervollstaendigung.ts`, direkt in beide Aufnahme-Routen eingehängt
(`aufnahme/upload` + `aufnahme/verarbeite`, der Retry-Pfad): wendet dieselbe echte
Vollständigkeits-Prüfung (`pruefeUndErgaenzeVollstaendigkeit`) auf die Chip-Liste an — keine eigene
Kopie der Regeln, also kein Drift-Risiko wie bei früheren Heuristiken (PM-012-Lehre). Ihre Regeln laufen
textbasiert auf dem Transkript, brauchen also keine Raum-Geometrie und funktionieren deshalb auch mit der
schnellen, unstrukturierten Chip-Vorschau — ohne die teurere KI-Extraktion ein zweites Mal aufzurufen
(kein Mehrkosten pro Aufnahme). Zusätzlich eine gezielte Regel für „Boden schützen" selbst: die finale
Engine setzt diese Position praktisch immer bei jedem Wand-/Deckenanstrich, weil die teure, strukturierte
KI-Extraktion das oft schon selbst als Handwerker-Wissen einträgt, auch ganz ohne Erwähnung im Transkript
— genau Sandys Originalfund. Das kann die schnelle Vorschau nicht nachbilden (andere KI, anderer Aufruf),
deshalb dafür eine eigene, deterministische Regel: jeder Raum mit erkanntem Anstrich bekommt automatisch
einen Bodenschutz-Hinweis, außer es gibt schon einen oder im selben Raum wird ohnehin ein neuer Boden
verlegt.

**Ehrlicher Nebenfund dabei:** beim Nachbauen der Logik ist aufgefallen, dass „Boden schützen /
Abdecken" in der ECHTEN, bepreisten Kalkulation bei „nur Wände streichen"-Aufträgen (der Alltagsfall bei
einem reinen Wandanstrich) bisher fälschlich verschwinden konnte — nicht nur in der Vorschau. Ursache:
„abdecken"/„abdeckfolie" enthält selbst die Zeichenkette „decke" (ab-DECKE-n), und der „nur Wände"-Filter
in `maler-basis.ts` hat trotz einer extra dafür eingebauten Ausnahme jede Position mit „decke" darin
rausgefiltert — die Ausnahme griff nicht an der richtigen Stelle. Jetzt behoben (die Ausnahme gilt jetzt
auch für die „ist das eine Decken-Position"-Prüfung selbst), mit eigenem Regressionstest in
`vollstaendigkeit.test.ts`. Betraf vermutlich einen Teil der Fälle, in denen „Boden schützen" schon vorher
unerwartet gefehlt hat.

**Ehrlich zum Stand:** 236 Tests grün (10 neue, keine Regression), inklusive dem exakten
PM-001-Originaltranskript als Testfall. Bewusst nur für Maler/Boden umgesetzt (die aktuell unterstützten
Gewerke) — Elektro/Fliesen/Sanitär/Trockenbau bleiben unangetastet. Noch KEIN Live-Nachtest mit echter
Aufnahme.

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
**Status:** 🟡 Fix-Update (2026-08-21): alle fünf Nachtest-3-Funde root-caused und behoben — Phantom-
„Fertigparkett verlegen" im Flur, Phantom-„Sockelleisten montieren" im Wohnzimmer, das dadurch verschwundene
„Sockelleisten abkleben" (Flur), die doppelte raumlose Fischgrät-Position und die falsch formulierte
„alte Tapete"-Rückfrage. Dehnungsfuge-Fallback bleibt bestätigt wirksam. Details siehe Fix-Update unten,
noch ohne Live-Nachtest.

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

## PM-019 — Erschwerniszuschlag „schwieriger Untergrund" isoliert von Höhe/Altbau (Gäste-WC)

**Datum:** 2026-08-20
**Status:** 🟡 Fix-Update (2026-08-21): Erschwerniszuschlag „schwieriger Untergrund" ergänzt, fehlende
Raum-Gruppierung behoben. Die falschen Raummaße sind KEIN Code-Bug — root-caused auf einen
Whisper-Transkriptionsfehler, der die zweite Maßangabe schon vor GPT verliert (Details siehe Fix-Update
unten). Noch ohne Live-Nachtest

**Warum dieser Fall:** Das Fachwissen nennt drei Erschwernis-Trigger: Raumhöhe > 3 m (mehrfach getestet,
z. B. PM-008), Altbau (PM-006), und „schwieriger Untergrund" — Letzterer bisher in keinem einzigen Testfall
verwendet. Damit isoliert getestet wird, ob das Tool dieses dritte Kriterium überhaupt kennt, ist der Raum
bewusst klein und niedrig (unter der 3-m-Schwelle) und ausdrücklich kein Altbau, damit keine der beiden
anderen Trigger versehentlich mitgreifen und das Ergebnis verfälschen.

**Zum Einsprechen:**
„Gästeklo, zwei mal eins fünfzig, Höhe zwo vierzig. Wände streichen, zweimal. Der Putz ist aber total
uneben und bröckelig, ein wirklich schwieriger Untergrund, das wird aufwendiger als normal. Eine Tür, kein
Fenster.“

**Soll-Lösung:**
- Umfang: 2×(2,00+1,50)=7,00 lfm; Wandbrutto: 7,00×2,40=16,80 m²
- Abzug 1 Tür Standard (1,89 m²), kein Fenster-Abzug (kein Fenster vorhanden)
- Wandflächen streichen 2×: **14,91 m²**
- Erschwerniszuschlag „schwieriger Untergrund": eigene Position (Aufschlag, egal ob schon bepreist)
- **Kein** Höhen-Erschwerniszuschlag (2,40 m liegt unter der 3-m-Schwelle)
- **Kein** Altbau-Zuschlag (nicht erwähnt)

**Worauf achten:**
- Erkennt das Tool „schwieriger Untergrund"/„uneben und bröckelig" überhaupt als eigenständigen
  Erschwernis-Trigger, oder kennt die Engine bisher nur die beiden anderen (Höhe, Altbau)?
- Schlägt fälschlich zusätzlich ein Höhen- oder Altbau-Zuschlag auf, obwohl keiner der beiden Trigger im
  Transkript vorkommt?
- Fachliche Zusatzfrage, kein harter Soll-Verstoß: „uneben und bröckelig" klingt nach echtem
  Ausbesserungsbedarf, nicht nur nach einem pauschalen Prozentaufschlag — würde ein echter Maler hier nicht
  eher eine Rückfrage zur Untergrundvorbereitung/Spachtelung erwarten, statt nur einen Zuschlag draufzusetzen?
  Kein Fehler, wenn das Tool nur den Zuschlag bringt, aber ein Gedanke für den Designer/die Rückfragen-Logik.

**Ist-Ergebnis (Sandy, 2026-08-21):** Karte: „3 Positionen erkannt" — Wandflächen streichen 2x, Boden
schützen, Sockelleisten abkleben, Tür: 1. **Kein „Erschwerniszuschlag" irgendwo auf der Karte.**

Entwurf: alle drei Positionen tragen im Titel einzeln den Zusatz „— Gästeklo" (z. B. „Wandflächen
streichen 2x — Gästeklo"), statt dass eine gemeinsame Raum-Überschrift/-Karte mit Maßen darüber steht, wie
bei jedem anderen bisherigen Test (vgl. „🚪Flur ... Raummaße ... Raumform" bei PM-013). Sandys eigene
Einschätzung dazu: der Raum scheint nicht richtig als eigenes Objekt angelegt/ausgewählt worden zu sein.

- Wandflächen streichen 2x — Gästeklo: 12,51 m² × 9,50 € = 118,84 €
- Boden schützen — Gästeklo: 2,25 m² × 1,20 € = 2,70 €
- Sockelleisten abkleben — Gästeklo: 5,1 lfdm × 0,80 € = 4,08 €
- **Keine Erschwerniszuschlag-Position** — weder als eigene Zeile noch als Rückfrage

Nachgerechnet, was diesen drei Zahlen zugrunde liegt: sie passen exakt zu einem Raum **1,50×1,50 m**
(Umfang 6,00 lfm, Wandbrutto 6,00×2,40=14,40 m², minus 1 Tür Standard 1,89 m² = 12,51 m² ✓; Bodenfläche
1,50×1,50=2,25 m² ✓; Sockelleisten 6,00−0,90 Türbreite=5,10 lfdm ✓) — **nicht zu den diktierten „zwei mal
eins fünfzig" (2,00×1,50 m).** Die Soll-Lösung wäre 16,80 m² Wandbrutto, 14,91 m² Wandfläche, 3,00 m²
Bodenfläche, 6,10 lfdm Sockelleisten gewesen. Das Tool hat also offenbar „zwei" als zweites „eins fünfzig"
verstanden bzw. eine der beiden Maßangaben verloren — ein quadratischer statt eines rechteckigen Raums.

**Befund:**

1. **Kernfrage des Testfalls beantwortet: „schwieriger Untergrund" wird nicht als Erschwernis-Trigger
   erkannt.** Anders als bei Raumhöhe (PM-008) und Altbau (PM-006) gibt es für diesen dritten,
   fachwissenmäßig gleichwertigen Trigger aktuell offenbar überhaupt keine Erkennung — weder auf der Karte
   noch im Entwurf, keine Spur, kein Aufschlag.
2. **Neuer, unabhängiger und schwerwiegender Fund: falsche Raummaße.** Der Raum wurde als 1,50×1,50 m
   statt der diktierten 2,00×1,50 m gerechnet — alle drei Positionen (Wand, Boden, Sockelleisten) sind
   dadurch zu klein. Bei diesem Mini-Raum nur ein paar Euro Differenz, aber bei einem großen Raum wäre der
   gleiche Fehler (eine Maßangabe geht verloren, wird durch die andere ersetzt) ein vierstelliger
   Rechenfehler.
3. **Neuer Fund: keine Raum-Gruppierung im Entwurf.** Statt einer gemeinsamen Raumkarte mit Maßen (wie bei
   jedem anderen Testfall) trägt jede einzelne Position nur einen angehängten „— Gästeklo"-Titel-Suffix.
   Möglicherweise dieselbe Ursache wie Punkt 2 — wenn der Raum nicht sauber als eigenes Objekt angelegt
   wurde, käme sowohl die falsche Maß-Zuordnung als auch das Fehlen der Raumkarte aus derselben Quelle.

**Für Head of Product Engineering:** Drei Themen, vermutlich zwei davon zusammenhängend:
(1) „Schwieriger Untergrund"/„uneben und bröckelig" fehlt komplett als Erschwernis-Trigger — bitte
ergänzen, analog zu Höhe/Altbau. (2) + (3) bitte zusammen untersuchen: der Raum „Gästeklo" wurde mit
1,50×1,50 statt 2,00×1,50 m gerechnet UND ohne eigene Raumkarte im Entwurf dargestellt (Titel-Suffix statt
Gruppierung) — das riecht nach dem Raum-Anlegen selbst, das hier fehlgeschlagen oder auf einen Fallback
zurückgefallen ist, nicht nach einem reinen Rechenfehler. Bitte gegen die echte GPT-Rohantwort dieses
Testfalls prüfen, ob beide Räume (Höhe „zwo vierzig", Maße „zwei mal eins fünfzig") korrekt ankamen oder
ob schon dort eine Maßangabe verlorenging.

**Fix-Update (Head of Product Engineering, 2026-08-21) — an echten Produktionsrohdaten root-caused:** Rohdaten
für genau diesen Testlauf gezogen (Supabase, `entwurf_aufnahmen`, id `dbbd79c4…`) — das beantwortet auch die
eigene Bitte oben, gegen die echte GPT-Rohantwort zu prüfen.

**Gefunden — der eigentliche Wortlaut, der bei GPT ankam:** „Gästeklo **zweimal 1,50m**, Höhe 2,40m,
Wändestreichen zweimal, …". Nicht „zwei mal eins fünfzig" wie eingesprochen — Whisper hat „zwei mal eins
fünfzig" (2,00 × 1,50 m) offenbar als „zweimal 1,50m" verstanden: „zwei mal" (Multiplikation) wurde zu
„zweimal" (Wiederholung), die zweite Maßangabe „eins fünfzig" ist dabei komplett verschwunden. GPTs
Struktur-Extraktion hat aus dem verbliebenen EINEN Maß „1,50m" dann selbst `breite: 1.5, laenge: 1.5` gemacht
— ein quadratischer Rateversuch, weil ihr schlicht keine zweite Zahl mehr vorlag.

**Punkt 2 (falsche Raummaße) ist damit kein Code-Bug, sondern ein Transkriptionsfehler, der schon VOR
unserer Pipeline entsteht** — zum Zeitpunkt, an dem unser Code die Daten bekommt, ist die zweite Maßangabe
bereits unwiederbringlich weg. Es gibt hier nichts in `mengen/`, `vollstaendigkeit/` oder `kontext-analyzer.ts`
zu reparieren, weil die Information dort nie ankommt. Bewusst NICHT gefixt: eine „verdächtig quadratische
Raummaße"-Heuristik (Rückfrage auslösen, wenn Länge = Breite exakt), die diesen Fall abfangen könnte — das
wäre eine neue, spekulative Verhaltensänderung mit Risiko für echte quadratische Räume (die es ja wirklich
gibt), nicht Teil des ursprünglichen Befunds und eine Produktentscheidung, keine Bugfix-Entscheidung. Bitte
separat besprechen, falls gewünscht.

**Punkt 1 (schwieriger Untergrund) UND Punkt 3 (keine Raumkarte) waren dagegen echte, unabhängige Bugs in
unserem Code — beide behoben, beide NICHT dieselbe Ursache wie ursprünglich vermutet:**

1. **„Schwieriger Untergrund" fehlte als Erschwernis-Trigger.** GPTs Rohantwort tagt es tatsächlich sauber
   als eigenes Feld (`erschwernisse: ["unebener und bröckeliger Putz"]`) — nur unsere Vollständigkeitsprüfung
   (`maler-extras.ts`) kannte bisher nur die beiden anderen Trigger (Höhe, Altbau). Neue Funktion
   `pruefeErschwerniszuschlagUntergrund`, bewusst wie die anderen beiden direkt gegen den Rohtranskript-Text
   geprüft (nicht gegen das `erschwernisse`-Feld) — damit dieselbe robuste Erkennung greift, egal ob GPTs
   Struktur-Tagging diesmal sauber ist oder nicht. In `maler.ts` neben `pruefeErschwerniszuschlagHoehe`
   eingehängt.
2. **Keine Raumkarte für „Gästeklo".** Das war NICHT dieselbe Ursache wie die falschen Raummaße (Sandys
   Vermutung, dass der Raum nicht sauber als Objekt angelegt wurde, stimmt nicht — GPTs Rohantwort hat
   „Gästeklo" als ganz normales, komplett wohlgeformtes Raum-Objekt mit allen Feldern). Der eigentliche Fund:
   dieselbe Fehlerkategorie wie PM-005 (dort: „Speisekammer" fehlte in der Anzeige-Gruppierung), diesmal in
   `angebot-gruppierung.ts`s `RAUM_KEYWORDS`-Liste — „Gästeklo" enthält weder „toilette" noch „wc" noch sonst
   eins der bisherigen Schlüsselwörter als Teilstring, wurde deshalb von der Anzeige nicht als echter Raum
   erkannt und landete einzeln im Allgemein-Topf statt in einer gemeinsamen Raumkarte mit Maßen — reine
   Anzeige-Lücke, keine Rechenlücke (die drei Positionen selbst waren immer korrekt berechnet). Fix: „klo" zur
   Schlüsselwortliste ergänzt (deckt „Gästeklo", „Klo" und ähnliche Kurzformen ab), plus Emoji-Zuordnung.

**Wie geprüft:** Erschwernis-Fix an den echten Produktionsrohdaten dieses Testlaufs durch die reale
`verarbeiteExtraktion`-Pipeline verifiziert — „Erschwerniszuschlag schwieriger Untergrund" erscheint jetzt,
Raummaße bleiben wie erwartet unverändert bei 1,50×1,50 (das ist der bestätigte Transkriptionsfehler, keine
Regression). Gruppierungs-Fix isoliert gegen die drei echten Gästeklo-Positionstitel getestet. 4 neue,
dauerhafte Tests: `vollstaendigkeit.test.ts` (Untergrund-Erschwernis, positiv + negativ) und ein neues
`angebot-gruppierung.test.ts` (Gästeklo-Gruppierung + Regressionsschutz für bestehende Nebenräume). Ganze
Suite weiterhin grün (247/247, vorher 243). Wie immer: noch OHNE Live-Nachtest im echten Tool.

---

## PM-020 — Teppich verlegen, alter Belag bleibt liegen (neue Ausschluss-Formulierung), Verschnittsatz unklar (Kinderzimmer 2)

**Datum:** 2026-08-20
**Status:** 🟡 Fix-Update (2026-08-21): beide Funde root-caused und behoben — Altbelag-Verneinung wird jetzt
erkannt (`boden-normalisierer.ts`), Sockelleisten-Phantom-Fallback verlangt jetzt ein echtes Textsignal
(`boden-vorarbeiten.ts`). Noch ohne Live-Nachtest.

Ursprünglicher Befund (2026-08-21): „Altbelag entfernen" stand trotz ausdrücklichem Ausschluss UND
explizit mit „Nein, bleibt" beantworteter Rückfrage im Entwurf, mit echter Menge (10,8 m²). Zusätzlich
Phantom-„Sockelleisten montieren" (13,2 lfdm), nie erwähnt — dieselbe Fehlerfamilie wie bei PM-013

**Warum dieser Fall:** Verschnitt wurde bisher nur für Laminat/Vinyl (5 % gerade, PM-004/PM-009) und Parkett
Fischgrät (15 %, PM-013) getestet — nie für Teppich, für den das Fachwissen keinen expliziten Standard-Satz
nennt. Zusätzlich testet dieser Fall eine dritte, neue Formulierung für den Boden-Ausschluss („bleiben
einfach drunter liegen"), nachdem frühere Fixes bisher nur auf „X lassen wir"/„ohne X"/„keine X" bzw. „bleibt
wie er ist" reagiert haben — jede neue Sprechweise ist ein eigener Risikofall für dieselbe Erkennung.

**Zum Einsprechen:**
„Kinderzimmer zwei, drei mal drei sechzig. Teppichboden auslegen, ganz normal, kein Muster. Die alten
Dielen bleiben einfach drunter liegen, die kommen nicht raus.“

**Soll-Lösung:**
- Fläche: 3,00×3,60=**10,80 m²**
- Teppich verlegen: 10,80 m² zzgl. Verschnitt — das Fachwissen nennt für Teppich keinen expliziten
  Standardsatz, daher kein hartes Soll für den genauen Prozentwert; zu dokumentieren ist, was das Tool
  tatsächlich ansetzt, als Referenzwert für künftige Fälle
- **Keine** Altbelag-entfernen-Position — ausdrücklich ausgeschlossen („bleiben einfach drunter liegen,
  die kommen nicht raus")
- **Keine** Trittschalldämmung — nicht erwähnt, bei Teppich fachlich auch nicht zwingend Standard wie bei
  Klick-Vinyl/Laminat

**Worauf achten:**
- Wird die neue Ausschluss-Formulierung „bleiben einfach drunter liegen" überhaupt als Ausschluss erkannt?
  Bisherige Fixes kannten explizit nur bestimmte Wortmuster — eine vierte, wieder andere Formulierung ist
  ein eigener Testfall für die Robustheit dieser Erkennung, nicht automatisch durch frühere Fixes gedeckt.
- Welchen Verschnittsatz setzt das Tool für Teppich an (0 %? 5 % wie Laminat? etwas Eigenes?) — kein
  Fehler an sich, aber wichtig zu wissen und ggf. mit Sandys fachlicher Einschätzung abzugleichen, ob der
  Wert plausibel ist.
- Wird trotz des Wortes „Boden" im Nebensatz keine unverlangte zusätzliche Boden-Position erfunden
  (Verwandtschaft zum PM-010-Phantom-Bug)?

**Ist-Ergebnis (Sandy, 2026-08-21):** Karte: „3 Positionen erkannt" — Teppichboden verlegen (10,8 m²),
Sockelleisten montieren (13,2 lfdm), Altbelag entfernen (10,8 m²). Rückfrage: „Muss der alte Bodenbelag in
'Kinderzimmer' entfernt werden?" → **„Nein, bleibt" beantwortet.**

Entwurf:
- Teppichboden verlegen: 10,8 m² × 14,00 € = 151,20 € — Fläche exakt Soll (3,00×3,60=10,80 m²), **0%
  Verschnitt angesetzt** (reine Rohfläche, kein Aufschlag). Kein hartes Soll hierzu, aber jetzt als
  Referenzwert dokumentiert: Teppich bekommt aktuell keinerlei Verschnittzuschlag.
- **Sockelleisten montieren: 13,2 lfdm × 5,50 € = 72,60 €** — nie erwähnt im Transkript. 13,2 lfdm = exakt
  der volle Raumumfang (2×(3+3,6)=13,2). Neuer Beleg für dasselbe Phantom-Muster wie bei PM-013
  (Wohnzimmer): eine Bodenverlegung scheint automatisch eine „Sockelleisten montieren"-Position mit vollem
  Raumumfang zu erzeugen, unabhängig davon, ob das gesagt wurde.
- **Altbelag entfernen: 10,8 m² × 0,00 € (Preis fehlt)** — steht trotzdem im Entwurf, mit echter Fläche
  (nicht 0), **obwohl sowohl der Transkript-Ausschluss („die kommen nicht raus") als auch die explizit mit
  „Nein, bleibt" beantwortete Rückfrage beide dagegen sprechen.** Schwerster Fund dieses Falls: hier wird
  nicht nur eine Formulierung nicht erkannt, sondern eine bereits eindeutig beantwortete Rückfrage
  im Ergebnis schlicht ignoriert.

**Befund:**

1. **Schwerster Fund: die explizit beantwortete Rückfrage wird nicht respektiert.** Sandy hat aktiv „Nein,
   bleibt" angeklickt — trotzdem taucht „Altbelag entfernen" mit voller Fläche (10,8 m²) im Entwurf auf.
   Das ist kein Erkennungsproblem mehr (die Frage wurde ja korrekt gestellt und beantwortet), sondern ein
   Bug darin, wie die Antwort in die Positions-Generierung zurückfließt — oder gar nicht zurückfließt.
   Würde ein Handwerker das nicht bemerken (Preis fehlt macht es finanziell harmlos, aber die Zeile allein
   sorgt für Verwirrung beim Kunden), würde er für eine Leistung kalkulieren, die ausdrücklich nicht
   gewünscht ist.
2. **Bestätigtes Muster: Phantom-„Sockelleisten montieren" bei jeder Bodenverlegung.** Zweiter unabhängiger
   Beleg nach PM-013 (Wohnzimmer, 25 lfdm) — hier 13,2 lfdm, wieder exakt der volle Raumumfang. Scheint eine
   feste Annahme „neuer Boden → automatisch neue Sockelleisten" zu sein, unabhängig vom Transkript.
3. **Info, kein Bug:** Teppich bekommt aktuell 0% Verschnitt. Das Fachwissen kennt für Teppich keinen
   etablierten Standardsatz — daher kein hartes Soll, aber wert, mit Sandys fachlicher Einschätzung
   abzugleichen, ob 0% realistisch ist oder ob auch hier ein kleiner Aufschlag branchenüblich wäre.

**Für Head of Product Engineering:** Zwei Themen. (1) **Priorität hoch:** die Rückfragen-Antwort „Nein,
bleibt" fließt nicht (oder nicht zuverlässig) in die finale Positionsliste zurück — bitte prüfen, ob das
isoliert bei „Altbelag entfernen" auftritt oder strukturell alle Rückfragen-Antworten betrifft, die eine
Position eigentlich unterdrücken sollen. (2) Dasselbe „Sockelleisten montieren"-Phantom wie bei PM-013 —
jetzt zweimal unabhängig bestätigt, sollte sich mit vertretbarem Aufwand an einer Stelle fixen lassen: die
Position wird offenbar automatisch bei jeder Boden-Neuverlegung erzeugt, ohne eigenes Signal im Transkript
zu prüfen.

**Fix-Update (Head of Product Engineering, 2026-08-21) — beide Funde root-caused, KEINER hing mit der
ursprünglichen Vermutung zusammen:**

1. **„Altbelag entfernen" trotz „Nein, bleibt" — Ursache war NICHT die Rückfragen-Antwortverarbeitung.**
   Erste Vermutung (Boolean- vs. Number-Typkonflikt zwischen `kontext-analyzer.ts`s `schnell_antworten` und
   `antworten-verarbeiter.ts`s `KalkulationsAntwort`) hat sich bei näherer Prüfung als falsch erwiesen —
   `rueckfragen-flow.ts`s `konvertiereKIRueckfrage` wandelt Boolean bereits sauber in 0/1 um, und
   `antworten-verarbeiter.ts` verarbeitet das korrekt weiter. Der tatsächliche Fund lag einen Schritt tiefer,
   bestätigt per Reproduktionstest gegen die exakten Produktionsdaten (auch OHNE jede Rückfragen-Antwort im
   Spiel — das Problem trat schon in Runde 1 auf): `boden-normalisierer.ts`s `erkenneBodenArbeiten` ist ein
   Regex-Fallback, der komplett unabhängig vom (hier korrekten) KI-Feld `raum.altbelag_entfernen: false`
   läuft. „Die alten Dielen bleiben einfach drunter liegen, die kommen nicht raus" hat gleich zwei seiner
   Regeln ausgelöst — `ALTBELAG_NOMEN` durch die bloße Erwähnung „alten Dielen", `SCHWACHES_ENTFERNEN` durch
   das Wort „raus" im selben Satz — beide OHNE jede Verneinungs-Prüfung, obwohl der Satz wörtlich das
   Gegenteil sagt. Verschärft durch `auftrags-verstaendnis.ts`: das KI-Signal wird dort nur einseitig auf
   `true` verodert (`if (signale.altbelagEntfernen) altbelag = true`), nie zurück auf `false` korrigiert, wenn
   der Regex-Fallback (fälschlich) `true` lieferte. Fix: neue `ALTBELAG_VERNEINT`-Regex in
   `boden-normalisierer.ts` (deckt „bleibt liegen/drunter", „kommt nicht raus", „kein/ohne Altbelag", „bleibt
   wie er ist" ab — inklusive der schon vorher beobachteten Formulierungen), pro Satz geprüft, bevor
   `ALTBELAG_NOMEN`/`SCHWACHES_ENTFERNEN` greifen dürfen.
2. **„Sockelleisten montieren"-Phantom — andere Stelle als bei PM-013, gleiche Ursache.** Der PM-013-Fix in
   `gewerke/boden.ts` (Engine) hat hier korrekt NICHTS erzeugt — bestätigt der Reproduktionstest. Trotzdem
   tauchte die Position auf, weil ein zweiter, unabhängiger Vollständigkeits-Fallback
   (`vollstaendigkeit/boden-vorarbeiten.ts`, `pruefeSockelleisten`) genau dieselbe „neuer Boden → automatisch
   neue Sockelleisten"-Annahme selbst nochmal macht: ohne explizite Meterangabe und ohne vorhandene
   Montage-Position schätzt er den Umfang blind aus der Bodenfläche (`4 × √Fläche`), ganz ohne zu prüfen, ob
   Sockelleisten je erwähnt wurden. Fix: derselbe „sockelleist"-Textsignal-Gate wie in der Engine, jetzt auch
   hier.

**Nebenfund beim Fixen:** Ein bestehender Test (`chips-vervollstaendigung.test.ts`, PM-001) hatte exakt diese
„Sockelleisten ohne jedes Signal erfinden"-Annahme als erwartetes Verhalten festgeschrieben — die
Chip-Vorschau der Aufnahmekarte nutzt bewusst dieselbe Vollständigkeits-Prüfung wie die finale Kalkulation
(Anti-Drift-Prinzip, siehe Kommentar in `chips-vervollstaendigung.ts`), lief also automatisch mit. Test
korrigiert (jetzt: keine Erfindung ohne Signal, aber weiterhin Ergänzung bei echter — nur unbezifferter —
Erwähnung) statt den alten, jetzt als Bug erkannten Zustand künstlich zu erhalten.

**Wie geprüft:** Beide Funde gegen die echten Produktionsdaten dieses Testfalls (id `2738c3a1…`) durch die
reale `verarbeiteExtraktion`-Pipeline reproduziert (Phantome vor dem Fix vorhanden, danach weg), zusätzlich
Runde-2-Test mit simulierter „Nein, bleibt"-Antwort UND ein Regressionstest mit einer echten
Altbelag-Entfernung („alter Teppich muss raus") zur Kontrolle, dass der neue Verneinungs-Filter legitime
Fälle nicht mit wegfiltert. Neuer dauerhafter Golden-Test `golden-korrekturen.test.ts` (PM-020) mit den
exakten Produktionsdaten. Ganze Suite weiterhin grün (262/262, vorher 261 inkl. der einen korrigierten
PM-001-Erwartung). Verschnittsatz für Teppich (aktuell 0%, siehe Ist-Ergebnis) unverändert offen — das war
als reine Info, kein Bug, markiert und bleibt das. Wie immer: noch OHNE Live-Nachtest im echten Tool.

---

## PM-021 — Mehrere unterschiedlich große Öffnungen + expliziter Einfachanstrich, VOB-Übermessungsfrage zugespitzt (Wohnküche)

**Datum:** 2026-08-20
**Status:** 🟡 Fix-Update (2026-08-21): Phantom-„Balkonboden streichen" behoben —
`pruefeBalkon` verwechselte „Terrassentür"/„Breitterrassentür" (reine Türbezeichnung) mit einem
tatsächlichen Balkon als Ort. Noch ohne Live-Nachtest.

Ursprünglicher Befund (2026-08-21): Alle drei Kernfragen positiv beantwortet (individuelle
Öffnungsmaße, „1x" statt „2x", Terrassentür korrekt erkannt — Wandfläche exakt Soll 48,55 m²). Aber neuer,
kurioser Fund: komplett unverlangte „Balkonboden streichen"-Position (30 m²), vermutlich durch das Wort
„Terrassentür" ausgelöst

**Warum dieser Fall:** Bisherige Tests hatten immer gleich große Fenster/Türen mit Standardmaßen oder
höchstens EINE individuell genannte Größe. Dieser Fall hat zwei unterschiedlich große Fenster UND zwei
unterschiedlich große Türen (inkl. einer breiten Terrassentür) im selben Raum — ein härterer Test dafür, ob
jede Öffnung mit ihrem EIGENEN Maß abgezogen wird, statt pauschal mit einem einzigen Standardmaß pro
Öffnungstyp zu rechnen. Zusätzlich wird bewusst „einmal streichen" statt der sonst in fast jedem Testfall
verlangten zwei Anstriche gesagt — testet, ob das Tool wirklich der Aussage folgt statt einem eingebauten
2x-Standardwert. Und: die Kombination aus einem sehr kleinen Fenster (deutlich unter der 2,5-m²-VOB-
Übermessungsschwelle) und einer sehr großen Terrassentür im selben Raum eignet sich gut, um die im Kopf der
Datei als „bewusst zurückgestellt, niedrige Priorität" vermerkte fehlende VOB-Übermessungsregel an einem
konkreten, krassen Beispiel sichtbar zu machen.

**Zum Einsprechen:**
„Wohnküche, sechs mal fünf, Höhe zwo sechzig. Zwei Fenster: eins ist eins zwanzig mal eins vierzig, das
andere achtzig mal eins zehn. Zwei Türen: eine normal Maß, die andere eine breite Terrassentür, zwei Meter
mal zwo zehn. Wände streichen, einmal drüber reicht.“

**Soll-Lösung:**
- Umfang: 2×(6,00+5,00)=22,00 lfm; Wandbrutto: 22,00×2,60=57,20 m²
- Fenster 1: 1,20×1,40=1,68 m²; Fenster 2: 0,80×1,10=0,88 m²
- Tür 1 (normal): 0,90×2,10=1,89 m²; Tür 2 (Terrassentür): 2,00×2,10=4,20 m²
- Öffnungsfläche gesamt (Standard-Abzugslogik ohne Übermessung): 1,68+0,88+1,89+4,20=8,65 m²
- Wandfläche netto: **48,55 m²**
- Wandflächen streichen **1×** (nicht 2×, ausdrücklich „einmal drüber reicht"): 48,55 m²
- Fachliche Zusatzbetrachtung zur bekannten, offenen VOB-Übermessungsfrage: Fenster 2 (0,88 m²) liegt weit
  unter der 2,5-m²-Schwelle für kleine Öffnungen und dürfte nach VOB/DIN 18363 eigentlich NICHT abgezogen
  werden (Übermessung wegen Kantenarbeit) — die Terrassentür (4,20 m²) liegt dagegen klar darüber und
  gehört in jedem Fall abgezogen. Käme die Übermessungsregel zur Anwendung, wäre die korrekte Wandfläche
  49,43 m² (nur 7,77 m² statt 8,65 m² abgezogen). Kein hartes Soll an dieser Stelle, aber ein sehr klares
  Beispiel, um diese seit Längerem zurückgestellte Entscheidung endlich zu treffen.

**Worauf achten:**
- Werden alle vier Öffnungen mit ihren INDIVIDUELLEN Maßen abgezogen, oder rechnet das Tool pauschal mit
  einem einzigen Standardmaß pro Öffnungstyp (z. B. „2 Fenster à Standardmaß" statt der beiden echten,
  unterschiedlichen Größen)?
- Wird „einmal streichen" korrekt als 1× übernommen, oder rutscht die Engine trotzdem auf den in fast
  jedem anderen Testfall gültigen 2×-Standard?
- Wird die Terrassentür überhaupt als „Tür" erkannt (ungewöhnlich groß, ungewöhnliches Wort „Terrassentür"
  statt „Tür"), oder fällt sie durchs Raster und wird gar nicht abgezogen?
- Ergibt sich aus dieser Gegenüberstellung (sehr kleines Fenster vs. sehr große Tür im selben Raum) ein
  guter, konkreter Anlass, die VOB-Übermessungsregel endlich zu entscheiden und umzusetzen?

**Ist-Ergebnis (Sandy, 2026-08-21):** Karte: „4 Positionen erkannt" — Wandflächen streichen 1x (48,55 m²),
Boden schützen (30 m²), Sockelleisten abkleben (19,1 lfdm), Balkonboden streichen (30 m²). Entwurf,
Raummaße korrekt (5×6 m, Höhe 2,6 m, 2 Türen, 2 Fenster):

- **Wandflächen streichen 1x: 48,55 m² × 6,00 € = 291,30 €** — ✅ **exakt Soll.** Rückrechnung bestätigt:
  57,20 m² Wandbrutto minus alle vier Öffnungen einzeln (1,68+0,88+1,89+4,20=8,65 m²) = 48,55 m². Damit
  sind gleich drei Kernfragen des Falls positiv beantwortet: alle vier Öffnungen wurden mit ihren
  INDIVIDUELLEN Maßen abgezogen (kein Pauschal-Standardmaß), „einmal streichen" wurde korrekt als 1×
  übernommen (nicht der sonst übliche 2×-Default), und die Terrassentür wurde trotz ungewöhnlicher
  Bezeichnung korrekt als Tür erkannt und mit ihrem echten Maß (2,00×2,10=4,20 m²) abgezogen.
- Boden schützen: 30 m² × 1,20 € = 36,00 € — normale Nebenleistung, exakt Raumfläche (5×6=30 m²)
- **Sockelleisten abkleben: 19,1 lfdm × 0,80 € = 15,28 €** — ebenfalls korrekt: 22,00 lfm Umfang minus
  BEIDER Türbreiten (0,90+2,00=2,90) = 19,10 lfdm. Auch hier wird die Terrassentür korrekt mit ihrer
  eigenen, größeren Breite berücksichtigt, nicht mit der Standard-Türbreite.
- **Balkonboden streichen: 30 m² × 0,00 € (Preis fehlt)** — komplett unverlangt. Im Transkript kommt weder
  „Balkon" noch „Terrasse" als eigener Ort vor, nur „Terrassentür" als Türbezeichnung. Menge (30 m²) ist
  exakt die Fläche des Raums selbst (5×6), nicht irgendeine plausible Balkongröße. Sieht so aus, als hätte
  das Wort „Terrassentür" die Annahme „hier gibt's auch einen Balkon/eine Terrasse, die separat gestrichen
  werden muss" ausgelöst und dafür einfach die Raumfläche wiederverwendet.
- Zur bekannten, offenen VOB-Übermessungsfrage: 48,55 m² bestätigt, dass die Übermessungsregel weiterhin
  nicht angewendet wird (wäre mit Regel 49,43 m²) — wie erwartet, das bewusst zurückgestellte Thema bleibt
  unverändert, kein neuer Fund, aber ein sauberes Rechenbeispiel für später.

**Befund:**

1. **Gute Nachricht, gleich dreifach:** individuelle Öffnungsmaße, „1x statt 2x"-Anstrich und die korrekt
   erkannte Terrassentür funktionieren alle einwandfrei — die Wandfläche trifft exakt die Soll-Lösung.
   Sowohl bei der Wandflächen- als auch bei der Sockelleisten-Berechnung wird die Terrassentür korrekt mit
   ihrer eigenen, größeren Breite (statt der Standard-Türbreite) berücksichtigt.
2. **Neuer, kurioser Fund: Phantom-„Balkonboden streichen".** Eine komplett unverlangte Position taucht auf,
   vermutlich ausgelöst durch das Wort „Terrassentür" — analog zu anderen Ein-Wort-Über-Erkennungsbugs
   dieser Testreihe (PM-010: „kommen raus" → Phantom-Bodenaustausch; PM-017: „tapezieren" → vier
   Phantom-Positionen), nur diesmal mit einer kompletten Fehlinterpretation des Ortes (ein Balkon, der nie
   erwähnt wurde). Wegen fehlendem Preis rechnerisch harmlos, aber eine Zeile im fertigen Angebot, die
   fachlich keinen Sinn ergibt und Kunden wie Handwerker verwirren würde.
3. VOB-Übermessung weiterhin nicht angewendet — erwartungsgemäß, bekannter, bewusst niedrig priorisierter
   Punkt, kein neuer Fund.

**Fix-Update (Head of Product Engineering, 2026-08-21) — an echten Produktionsdaten root-caused:** Rohdaten
für diesen Testlauf gezogen (Supabase, `entwurf_aufnahmen`, id `c4dfd8e7…`). Transkript im Original sogar
noch deutlicher als vermutet: Whisper hat „breite Terrassentür" zu „**Breitterrassentür**" verschliffen —
noch klarer erkennbar, dass das eine reine Türbezeichnung ist, kein eigener Ort.

**Ursache bestätigt: `pruefeBalkon`** (`vollstaendigkeit/maler-extras.ts`) prüfte bisher nur
`lower.includes('terrasse')` — ein bloßer Substring-Treffer, der auch in „Terrassentür"/„Breitterrassentür"
steckt. Sobald das Wort irgendwo vorkam, hat die Funktion einen kompletten Zusatz-Workflow ausgelöst: eine
„Balkonboden streichen"-Position, deren Menge einfach von der ERSTEN gefundenen „…boden…"-Position
übernommen wurde — hier „Boden schützen — Wohnküche" (30 m², die Fläche des Zimmers selbst, nicht
irgendeine Balkongröße). Exakt Sandys Strukturbeobachtung: ein einzelnes Trigger-Wort löst einen kompletten
erfundenen Workflow aus, plus Wiederverwendung einer fachlich unpassenden Fläche — dieselbe Fehlerfamilie
wie PM-010 („kommen raus" → Phantom-Bodenaustausch) und PM-017 („tapezieren" → vier Phantom-Positionen).

**Fix:** neue `BALKON_ORT`-Regex verlangt, dass „balkon"/„terrasse"/„loggia" NICHT direkt von „tür" gefolgt
wird (mit oder ohne „n"-Fuge, deckt „Terrassentür", „Breitterrassentür" UND „Balkontür" ab). Echte
Wortzusammensetzungen wie „Balkonboden" oder „Terrassenbrüstung" (kein „tür" direkt danach) lösen die
Erkennung weiterhin korrekt aus — nur die Türbezeichnung selbst zählt nicht mehr als Ortsangabe.

**Wie geprüft:** gegen die echten Produktionsdaten dieses Testfalls durch die reale
`pruefeUndErgaenzeVollstaendigkeit`-Pipeline reproduziert (Phantom vor dem Fix vorhanden — „Balkonboden
streichen", 30 m² —, danach weg; alle drei korrekten Positionen unverändert exakt Soll: Wandflächen 1×
48,55 m², Boden schützen 30 m², Sockelleisten abkleben 19,1 lfdm). 4 neue Regressionstests in
`vollstaendigkeit.test.ts` (verhindert „Terrassentür"/„Balkontür" als Auslöser, bestätigt dass ein
tatsächlich erwähnter Balkon sowie die echte Wortzusammensetzung „Balkonboden" weiterhin korrekt erkannt
werden). Neuer Golden-Test in `golden-korrekturen.test.ts` mit den exakten Produktionsdaten. Ganze Suite
grün (267/267). Bewusst NICHT angefasst: die VOB-Übermessungsfrage (Punkt 3) bleibt wie dokumentiert
zurückgestellt, kein Teil dieses Fixes. Wie immer: noch OHNE Live-Nachtest im echten Tool.

**Für Head of Product Engineering:** Die Kernlogik dieses Falls (individuelle Öffnungsmaße, 1×/2×-Anstrich,
Terrassentür-Erkennung) funktioniert sauber, keine Änderung nötig. Bitte nur die „Balkonboden
streichen"-Phantom-Position untersuchen — vermutlich löst das Wort „Terrassentür" irgendwo eine
Zusatzannahme „es gibt einen Balkon" aus, die hier fachlich nicht zutrifft (eine Terrassentür bedeutet nicht
zwingend einen Balkon, und selbst wenn, wäre dessen Fläche nicht identisch mit der Raumfläche). Die
VOB-Übermessungsregel bleibt wie besprochen bewusst zurückgestellt, hier nur als sauberes Beispiel
dokumentiert, keine Handlung nötig.

---

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->

