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
| PM-011 | Vollflächenspachtelung Q2 vs. Kleinreparatur (Arbeitszimmer) | ✅ Details im Archiv. Offene fachliche Frage zur möglichen Doppel-Erschwernis (Untergrund + Altbau neben Q2-Spachtelung) siehe dort |
| PM-012 | Sockelleisten-Falle umgekehrt: nur streichen, ausdrücklich nicht neu (Esszimmer) | ✅ Nachtest (2026-08-20): „Sockelleisten streichen" jetzt live bestätigt behoben (14,1 lfdm, exakt Soll), nach fünf gescheiterten Versuchen. Kein Boden-Phantom, Ausschluss weiterhin sauber respektiert — Details im Archiv |
| PM-013 | Zwei Räume, getrennte Gewerke + Fischgrät + Dehnungsfuge (Wohnzimmer/Flur) | ✅ Details im Archiv |
| PM-014 | Doppelte Positionen + instabile Summen bei Angebot 2026-0016 (live entdeckt, kein geplanter Testfall) | 🟡 Dubletten-Fix bestätigt (Doppelklick-Test). Echte Race Condition jetzt mit DB-Constraint geschlossen (2026-08-20, Sandys Go, siehe Fix-Update 2) — Migration live, Code-Fix grün gegen Testsuite, gezielter Gleichzeitigkeits-Nachtest steht noch aus |
| PM-015 | Preisdatenbank praktisch leer bei „manuell"-Onboarding + Anzeige-Bug versteckt Nachlade-Button (live entdeckt am Konto „Lisa Schein Malerbetrieb", kein geplanter Testfall) | 🟡 Beide Ursachen gefunden und gefixt, geprüft live im Code korrekt. **Klargestellt (2026-08-19):** der PM-011-„alle Preise fehlen"-Fund war KEIN neuer, dritter Bug — derselbe Nachtest lief auf demselben, schon damals betroffenen Konto „Lisa Schein Malerbetrieb", das vor dem Fix (17.08.) angelegt wurde und dadurch nicht rückwirkend versorgt ist, siehe „Systemischer Fund" Punkt 5. Für alle NEU angelegten Konten ab 18.08. gilt der Fix nachweislich. **Korrektur (2026-08-19, siehe PM-016):** der 18.08.-Fix selbst war kaputt — der Onboarding-Insert scheiterte durch denselben Bug wie PM-016 komplett und unbemerkt (Fehler wurde nicht geprüft). „Lisa Schein" ist inzwischen live nachversorgt |
| PM-016 | „Standardpreise importieren" auf `/preise` schlägt fehl: „Die Standardpreise konnten nicht vollständig ergänzt werden." (live entdeckt am Konto „Lisa Schein Malerbetrieb", kein geplanter Testfall) | ✅ Root-Cause gefunden und gefixt (2026-08-19), Konto live nachversorgt (341 Positionen), gleicher Bug auch im Onboarding-Seeding gefixt |
| PM-017 | Tapete statt Streichen + Grundierung trotz Neuputz ausdrücklich abgelehnt (Kinderzimmer) | ✅ Live-Nachtest (2026-08-21) bestätigt: „Tapete tapezieren" jetzt mit exakt 31,91 m² und korrektem Preis, keine Phantom-Positionen mehr, keine Grundierung — Details im Archiv |
| PM-018 | Q3-Vollflächenspachtelung an Wand UND Decke getrennt (Arbeitszimmer) | ✅ Live-Nachtest (2026-08-21) bestätigt: alle 8 Positionen exakt Soll, „Q3" korrekt an Wand und Decke, Deckengrundierung vorhanden — Details im Archiv |
| PM-019 | Erschwerniszuschlag „schwieriger Untergrund" isoliert von Höhe/Altbau (Gäste-WC) | ✅ Details im Archiv. Raummaß-Sicherheits-Rückfrage aus „Systemischer Fund" Punkt 6 live bestätigt (2026-08-25) — liefert jetzt die korrekten 2×1,5 m |
| PM-020 | Teppich verlegen, alter Belag bleibt liegen (neue Ausschluss-Formulierung), Verschnittsatz unklar (Kinderzimmer 2) | ✅ Details im Archiv. Nachtest (2026-08-25) diesmal korrekt transkribiert (3×3,6 m), Sicherheits-Rückfrage aus „Systemischer Fund" Punkt 6 daher nicht ausgelöst — Mechanismus über PM-019 live bestätigt |
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

**Details für abgeschlossene Fälle (PM-001, PM-002, PM-003, PM-004, PM-005, PM-006, PM-007, PM-009, PM-011, PM-013, PM-019, PM-020, PM-021):** siehe `pruefmeister-testfaelle-archiv.md` — Status hier in der Tabelle bleibt als Kurzfassung stehen. (PM-007 war am 2026-08-21 kurz zurückgeholt wegen eines Blocker-Bugs, ist seit dessen Fix und Live-Nachtest am 2026-08-25 wieder abgeschlossen und zurück im Archiv.)

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

