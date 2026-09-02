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
| PM-022 | Schlafzimmer, Baseline-Malerfall | ✅ Alle vier Positionen live bestätigt exakt Soll — Details im Archiv |
| PM-023 | Flur, Laminat gerade + Trittschalldämmung + neue Sockelleisten | 🟡 Gruppierung + Vorschlag-Etikett behoben (dreifach bestätigt). Drei von vier Nachtests komplett sauber, aber die Trittschalldämmungs-Flächenverwechslung aus dem ersten Nachtest (mit PM-025) bleibt offen und situativ — nicht bei jeder Raum-Paarung reproduzierbar, aber nicht behoben |
| PM-024 | Büro, Erschwerniszuschlag Höhe in normalem Raum | 🟡 Vierter Nachtest: „Boden schützen" wieder korrekt bepreist, Erschwerniszuschlag Höhe im Entwurf rechnerisch exakt Soll (15 %). Der Karten-Fund („1 %") ist gefixt (31.08., Fix-Notiz am Dateiende) — fehlt nur noch der fünfte Nachtest zur Bestätigung |
| PM-025 | Gästezimmer, Vinyl Fischgrätmuster + explizit neue Sockelleisten | ✅ alle drei Positionen live bestätigt exakt Soll, auch mit zusätzlicher Altbelag-Rückfrage |
| PM-026 | Küche, Wand 2x / Decke 1x unterschiedliche Anstrichzahl | ✅ Vierter Nachtest komplett sauber: alle vier Positionen exakt Soll, „Boden schützen" wieder korrekt bepreist, keine offenen Funde mehr |
| PM-027 | Kellerraum, Parkett gerade + explizite Altbelag-Entfernung | ✅ Beide Positionen live bestätigt exakt Soll |
| PM-028 | Arbeitszimmer, Altbau + explizite Grundierung ohne Spachtel | 🟡 Mengen exakt Soll. Zwei Funde: Wandflächen-Grundpreis weicht ab (11,50 € statt 9,50 €/m²); Erschwerniszuschlag-Bemessungsgrundlage zieht fälschlich den Abstellraum mit ein |
| PM-029 | Abstellraum, Mini-Raum ohne jede Öffnung | ✅ Alle drei Positionen live bestätigt exakt Soll |
| PM-030 | Dachzimmer 2, frischer Dachgeschoss-Fall | 🟡 Alle Flächen korrekt (Kniestockwände, Dachschrägen, Boden schützen) — Dachfenster ≤2,5 m² braucht laut VOB/DIN 18363 keinen Abzug, Soll-Lösung dazu korrigiert (auch PM-007 rückwirkend betroffen). Zwei bekannte PM-007-Kleinfunde (Sockelleisten-Türabzug trotz „Türen: 0"; Raumhöhe „!") erneut bestätigt |
| PM-031 | Fassade Nordseite, einfacher Fall | 🟡 Fassadenfläche + Erschwerniszuschlag exakt Soll, „Satz aus Preisliste"-Fix bestätigt auch bei Fassade. Neuer, rein kosmetischer Fund: „So gerechnet"-Zeile zeigt falsche, VOB-widrige Rechnung |

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

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->

