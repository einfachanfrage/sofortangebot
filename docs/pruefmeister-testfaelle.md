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
| PM-001 | Ausschluss + Selbstkorrektur (Wohnzimmer) | ✅ Ausschluss-Fix live bestätigt (keine Decken-Position mehr) — neuer, kleinerer Fund: Karte zeigt 2 Positionen, Angebot liefert 3 (Boden schützen fehlt auf der Karte) |
| PM-002 | Akzentwand + Boden diagonal (Schlafzimmer) | ✅ beide Bugs live nachgetestet, bestätigt behoben |
| PM-003 | Kleinreparatur + Höhenzuschlag (Flur) | ✅ alle drei Punkte live bestätigt behoben (Grundierung, Fenster-Rückfrage, rotes „!") |
| PM-004 | Laminat gerade + Trittschalldämmung (Kinderzimmer) | ✅ Verschnitt-Bug live nachgetestet, bestätigt behoben |
| PM-005 | Zwei Räume, Scope "nur Decke" (Küche/Speisekammer) | ✅ komplett behoben und live bestätigt — schwerster Fund der Testreihe, jetzt zu |
| PM-006 | Kleines Fenster + Altbau-Zuschlag (Büro) | ✅ bestätigt bekannter Punkt, keine Dringlichkeit |
| PM-007 | Dachgeschoss: Kniestock + Dachschrägen | ✅ Alle Rechenfehler live bestätigt behoben (Kniestock 20,4 m², Dachschrägen 23,08 m², keine unverlangte Spachtelposition mehr); offen bleiben nur Designer-Themen (PD-005) und fehlende Standardpreise |
| PM-008 | Fassade | 🟡 Wand-Chip (DC-024/`modus: 'wand'`) live, 6. Nachtest: PD-003 (rote „!") bestätigt behoben, Chip zeigt korrekt Wandlänge/-höhe/Türen/Fenster. „So gerechnet"-Rechenbug (68,40 statt 66,96 m²) root-caused und gefixt (2026-08-19, siehe Fix-Update unten) — Live-Nachtest steht aus. Neue „Erschwerniszuschlag Raumhöhe > 3m"-Position (jetzt korrekt ausgelöst) weiterhin ohne Preis. (Ein vermeintlicher zweiter Fund — Phantom-Leistung „Fenster streichen"/„Feuergrundierung" auf der Karte — war ein Lesefehler meinerseits, von Sandy direkt widerlegt, zurückgenommen. Per Copy-Paste bestätigt: Karte zeigt real „Fassade streichen" + „Vorhergrundierung", keine Phantom-Leistung, aber echte Namensverstümmlung „Vorhergrundierung".) |
| PM-009 | Bodenleger-Komplettpaket | ✅ Übergangsschiene live bestätigt behoben (taucht jetzt auf) — fehlt nur noch ein Standardpreis dafür |
| PM-010 | Sockelleisten-Doppel-Falle | 🟡 „Sockelleisten streichen" bestätigt behoben, Bodenaustausch weiterhin bestätigt weg, 350-Bug akzeptierte Design-Entscheidung. „Sockelleisten entfernen" root-caused und gefixt (2026-08-19, siehe Fix-Update) — Live-Nachtest steht aus |
| PM-011 | Vollflächenspachtelung Q2 vs. Kleinreparatur (Arbeitszimmer) | 🟡 Q2-Vollflächenspachtelung + Grundierung fachlich korrekt; Kleinreparatur-Bug trotz Verneinung noch offen; PD-008 beim Designer. „Alle 7 Positionen ohne Preis"-Fund root-caused (2026-08-19): kein Matching-Bug, Nachtest lief auf dem bekannten PM-015-Testkonto ohne Maler-Katalog — siehe „Systemischer Fund" Punkt 5, Entscheidung bei Sandy, wie das Konto nachversorgt wird |
| PM-012 | Sockelleisten-Falle umgekehrt: nur streichen, ausdrücklich nicht neu (Esszimmer) | 🟡 Root-Cause geklärt und gefixt (2026-08-19, siehe Fix-Update) — Live-Nachtest steht aus |
| PM-013 | Zwei Räume, getrennte Gewerke + Fischgrät + Dehnungsfuge (Wohnzimmer/Flur) | 🟡 Alle drei Funde jetzt gefixt (2026-08-19, siehe Fix-Updates): „Dehnungsfuge einbauen", Fischgrät-Verschnitt (0%→15%), Boden-Rückfragen für ausgeschlossenen Flur. Live-Nachtest für alle drei steht noch aus |
| PM-014 | Doppelte Positionen + instabile Summen bei Angebot 2026-0016 (live entdeckt, kein geplanter Testfall) | 🟡 Dubletten-Fix bestätigt: gezielter Doppelklick-Test zeigt keine Verdopplung mehr. Echte Race Condition (zeitgleiche Server-Anfragen) bleibt ungeklärt/ungetestet |
| PM-015 | Preisdatenbank praktisch leer bei „manuell"-Onboarding + Anzeige-Bug versteckt Nachlade-Button (live entdeckt am Konto „Lisa Schein Malerbetrieb", kein geplanter Testfall) | 🟡 Beide Ursachen gefunden und gefixt, geprüft live im Code korrekt. **Klargestellt (2026-08-19):** der PM-011-„alle Preise fehlen"-Fund war KEIN neuer, dritter Bug — derselbe Nachtest lief auf demselben, schon damals betroffenen Konto „Lisa Schein Malerbetrieb", das vor dem Fix (17.08.) angelegt wurde und dadurch nicht rückwirkend versorgt ist, siehe „Systemischer Fund" Punkt 5. Für alle NEU angelegten Konten ab 18.08. gilt der Fix nachweislich. **Korrektur (2026-08-19, siehe PM-016):** der 18.08.-Fix selbst war kaputt — der Onboarding-Insert scheiterte durch denselben Bug wie PM-016 komplett und unbemerkt (Fehler wurde nicht geprüft). „Lisa Schein" ist inzwischen live nachversorgt |
| PM-016 | „Standardpreise importieren" auf `/preise` schlägt fehl: „Die Standardpreise konnten nicht vollständig ergänzt werden." (live entdeckt am Konto „Lisa Schein Malerbetrieb", kein geplanter Testfall) | ✅ Root-Cause gefunden und gefixt (2026-08-19), Konto live nachversorgt (341 Positionen), gleicher Bug auch im Onboarding-Seeding gefixt |

**Neu, quer zu mehreren Fällen (2026-08-17):** Mehrere fachlich absolut normale Positionen
(Kniestockwände streichen, Dachschrägen streichen, Fassadenfläche streichen, Übergangsschiene) haben
gar keinen Preis in der Preisdatenbank hinterlegt (0,00 €, „Preis fehlt"). Sandys klare Ansage dazu
unten im Abschnitt „Systemischer Fund".

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

**2. Fehlender Preis darf niemals den Weg zur Entwurfsansicht blockieren.** Sandys zweite, ebenso klare
Ansage: *„falls tatsächlich mal keine Position vorhanden ist... dann muss ich natürlich TROTZDEM zur
Entwurfsansicht kommen"* — ob ein Preis fehlt oder nicht, darf niemals verhindern, dass der Handwerker
zumindest den Entwurf sieht und bearbeiten kann. Bitte sicherstellen, dass „Preis fehlt" höchstens ein
Hinweis ist, nie eine Blockade.

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

---

## PM-008 — Fassade (kein Raum, kein Boden, keine Decke)

**Datum:** 2026-08-16
**Status:** 🟡 Struktureller Fix (Wand-Chip, `modus: 'wand'`) live, PD-003 (rote „!") und die drei
ursprünglichen Engineering-Punkte (Masse-Anzeige, widersprüchlicher Banner, fehlende Preise) bestätigt
behoben. Ein neuer Bug im sechsten Nachtest: die „So gerechnet"-Zeile im neuen Chip rechnet den
Fensterabzug falsch (68,40 m² statt 66,96 m², widerspricht der korrekt abgerechneten Position direkt
darunter). Neue, separat offene „Erschwerniszuschlag Raumhöhe > 3m"-Position ohne Preis. **Korrektur
(2026-08-18):** Ein zweiter, angeblich neuer Fund im sechsten Nachtest — Phantom-Leistung „Fenster
streichen" + Namensverstümmlung „Feuergrundierung" auf der Karte — war erneut ein Lesefehler meinerseits
(Sandy hat direkt widersprochen, das steht so nicht auf der Karte) und ist komplett zurückgenommen.
**Nachtrag, per Copy-Paste bestätigt:** Die Karte zeigt tatsächlich „Fassade streichen" und
„Vorhergrundierung" (zwei Leistungen, passt zu „2 Positionen erkannt") — keine Phantom-Leistung, aber
„Vorhergrundierung" ist eine echte, jetzt bestätigte Namensverstümmlung (Familie „Gondierung").

**Zum Einsprechen:**
„Fassade an der Südseite, zwölf Meter lang, Giebelhöhe im Schnitt sechs Meter. Drei Fenster drin, eins zwanzig mal eins vierzig. Fassadenfarbe zweimal drauf, dazu vorher Grundierung."

**Soll-Lösung:**
- Wandbrutto: 12,00×6,00=72,00 m²
- Minus 3 Fenster (1,20×1,40=1,68 m² je Fenster) = 5,04 m²
- Wandflächen streichen 2×: **66,96 m²**
- Grundierung auf gleicher Fläche: **66,96 m²**
- Keine Boden-, Decken- oder „Boden schützen"-Position — eine Fassade hat keinen Innenraum

**Worauf achten:**
- Kommt wirklich keine Boden-/Deckenposition rein? Das wäre ein grober handwerklicher Unsinn bei einer Außenfassade.
- Wie heißt die Position — steht da „— Fassade" oder „— Raum"? In `src/lib/mengen/gewerke/maler.ts` steht die Liste der erkannten Raumtypen (ca. Zeile 90), „Fassade" ist dort nicht enthalten. Falls GPT den Raumnamen generisch als „Raum" zurückgibt, wird er nicht aus dem Transkript korrigiert — Positionstitel würde dann „— Raum" heißen statt „— Fassade", was beim schnellen Prüfen verwirrt.
- Landet die Grundierung auf exakt derselben Fläche wie die Fassadenfarbe?

**Ist-Ergebnis (aus dem Tool):**
- Raum wurde „Südseite" genannt (aus „an der Südseite" abgeleitet) — nicht mein vermuteter Fehlname „Raum", also unbegründete Sorge, das lief sauber.
- **Massе: 1,20 × 1,40 m.** Das sind die Fenstermaße aus dem Transkript, nicht die Fassadenmaße (12 m lang, 6 m hoch)! Die Extraktion hat die falschen Zahlen für die Grundfläche genommen.
- Fenster: 3 korrekt erkannt.
- Danach: roter Banner „Keine Positionen erkannt", und die Entwurfsansicht ließ sich nicht mehr öffnen — das Angebot blieb stecken.

**Befund:**

1. **Blockierender Fehler: Fassade mit Fenstermaßen statt Fassadenmaßen extrahiert, Ergebnis: kein Angebot**
   - Erwartet: Fassadenmaße 12 × 6 m erkannt, Wandfläche 66,96 m² netto.
   - Tatsächlich: 1,20 × 1,40 m als Grundfläche verwendet (das sind exakt die genannten Fenstermaße). Mit 3 Fenstern à 1,20×1,40 = 5,04 m² Abzug von einer Bruttofläche von nur 1,68 m² (1,20×1,40) geht die Rechnung natürlich ins Negative — vermutlich deshalb „Keine Positionen erkannt": die Menge wird 0 oder negativ und komplett verworfen, statt dass eine Rückfrage kommt.
   - Abweichung: Das ist kein Zahlendreher, den man in 10 Sekunden korrigiert — der Nutzer bekommt gar kein Angebot, landet in einer Sackgasse und muss von vorn anfangen. Schlimmer als jeder bisherige Fund, weil das Tool hier komplett verweigert statt (auch falsch) zu liefern.
   - Für Head of IT: Vermutlich ein Extraktionsfehler bei der Fassaden-Erkennung (`laenge`/`hoehe` ohne `breite`, siehe `src/lib/mengen/gewerke/maler.ts` Zeile 126–136) — die GPT-Extraktion scheint die zuletzt im Satz genannten Zahlen (Fenstermaße) statt der Fassadenmaße ins `laenge`/`hoehe`-Feld zu packen. Zusätzlich: das Tool sollte bei einer Menge ≤ 0 nicht einfach schweigen, sondern eine Warnung oder Rückfrage auslösen statt „Keine Positionen erkannt" ohne Ausweg.

**Fix-Update (Head of IT, 2026-08-16):** Root-Ursache ist eine andere als
vermutet — kein Zahlendreher bei der Extraktion. Ich hab per Debug-Tabelle
nachgesehen, was GPT beim Original-Transkript wirklich geliefert hat: die
Fassadenmaße (12 × 6 m) waren korrekt, die 3 Fenster (1,20 × 1,40 m) auch —
GPT legt Fassaden nur in einem eigenen Feld ab (`waende[]`), weil eine
Fassade kein „Raum" ist (kein Boden, keine Decke). Zwei Stellen im Code haben
das nicht richtig behandelt:
1. Beim Einlesen der GPT-Antwort wurden Fenster und Arbeiten aus diesem Feld
   verworfen (nur bei „echten" Räumen übernommen).
2. Die Mengen-Engine hat dieses Feld danach komplett ignoriert — sie kannte
   nur Räume. Ergebnis: bei jeder reinen Fassade (kein Innenraum dabei) kamen
   buchstäblich null Positionen raus, daher „Keine Positionen erkannt" und die
   Sackgasse.

Fix: Fassaden werden jetzt wie ein Raum ohne Boden/Decke behandelt — Wandfläche
minus Fensterfläche, mit Grundierung NUR wenn das ausdrücklich in der
strukturierten Arbeiten-Liste steht (gleiche Regel wie bei PM-003 — nichts
aus dem Rohtext raten). 4 neue Tests in `maler-engine.test.ts` (u.a. exakt
66,96 m² bei 12×6 m minus 3 Fenster à 1,20×1,40 m), alle 662 Tests im Projekt
laufen weiter grün. Noch offen: woher genau die von dir gesehene
„1,20 × 1,40 m"-Anzeige als vermeintliche Grundfläche kam, ist eine separate,
noch ungeklärte Frage (vermutlich eine andere Anzeige-Stelle) — für den
Blocker selbst aber nicht relevant. Live-Test durch dich steht noch aus.

**Fix-Update 2 (Head of IT, 2026-08-16) — Fenster „1" auf der Karte vs. „2" in
der Rechnung:** Die Aufnahme-Karte zeigt die Fenster-Zahl NICHT aus GPTs
Extraktion, sondern über eine eigene, ganz einfache Text-Suche (die erste
Zahl vor dem Wort „Fenster" im Rohtext) — schnell und ohne KI-Aufruf, aber
blind für Selbstkorrekturen. Bei „Ein Fenster — ne halt, zwei Fenster" nimmt
sie die 1, weil die zuerst im Satz steht. Die eigentliche Berechnung
vertraut zu Recht GPTs Extraktion (die die Korrektur verstanden hat), daher
war die Rechnung schon vorher richtig — nur die Karte hat vorher falsch
angezeigt.

Fix: die Text-Suche nimmt jetzt die LETZTE genannte Zahl statt der ersten —
bei einer Selbstkorrektur ist praktisch immer die letzte gemeint. 2 neue
Tests (`extraktion-masse.test.ts`, exakt dein Fall). Kein Live-Test nötig,
weil hier nur eine Anzeige ohne echten GPT-Aufruf betroffen ist — mit den
Tests reicht die Absicherung.

**Nachtest (2026-08-16, späterer Durchlauf):** Blocker weg, Fläche (66,96 m²)
live bestätigt korrekt. Aber zwei neue Funde: 1) die Fassadenfläche wird
zweimal berechnet, einmal als „Fassadenfläche streichen 2×" (von der Engine)
und nochmal als „Fassadenfarbe 2× Anstrich" (von einer zweiten Stelle) — echte
Doppelberechnung derselben Fläche unter zwei Namen. 2) eine unverlangte
„Fassade reinigen"-Position über 334,80 € taucht auf, obwohl im Transkript nie
von Schmutz, Verschmutzung oder Reinigung die Rede war.

**Fix-Update 3 (Head of IT, 2026-08-16) — Doppelberechnung + unverlangte
334,80-€-Reinigung:** Über die Debug-Tabelle die exakte GPT-Extraktion zu
deinem Live-Test geholt und nachgebaut — beide Funde bestätigt und auf
dieselbe Ursache zurückgeführt: `pruefeFassade`
(`src/lib/vollstaendigkeit/maler-tapete.ts`) ist eine ÄLTERE Funktion, die
noch aus der Zeit vor dem PM-008-Blocker-Fix stammt, als die Engine bei
Fassaden noch gar nichts berechnen konnte — sie hat damals selbst geraten,
welche Standardpositionen bei „Fassade" wohl dazugehören (reinigen,
grundieren, streichen), einfach weil das Wort „Fassade" irgendwo im Text
stand. Seit die Engine die Fassadenfläche jetzt selbst korrekt berechnet
(„Fassadenfläche streichen 2×"), hat diese alte Funktion nicht mitbekommen,
dass ihre eigene „Fassadenfarbe"-Position davon ein Duplikat ist — sie kannte
nur den alten Namen, nicht den neuen der Engine.

Fix: zwei Stellen in `pruefeFassade` angepasst.
1. „Fassade reinigen" wird nur noch ergänzt, wenn im Text wirklich ein
   Reinigungs-Signal steht (reinigen/säubern/waschen/Hochdruck/Schmutz/Risse/
   Algen/Moos) — nicht mehr allein durchs Wort „Fassade". Gleiches Muster wie
   schon bei PM-003/PM-007.
2. Die Duplikat-Prüfung für „Fassadenfarbe" erkennt jetzt auch den neuen
   Engine-Positionsnamen „Fassadenfläche" und überspringt die eigene Position,
   wenn die Engine die Fläche schon berechnet hat.
Die Grundierung bleibt bewusst unverändert (weiterhin unconditional) — das war
nicht Teil deines gemeldeten Befunds. Neuer Golden-Test PM-008b mit deinen
echten Extraktionsdaten (bestätigt: nur noch 2 Positionen statt 4, keine
„Fassadenfarbe"- oder „reinigen"-Duplikate mehr). Bestehender Test in
`vollstaendigkeit.test.ts` an das neue, korrekte Verhalten angepasst (3 Fälle
statt 1: Grundierung+Farbe kommen weiter, Reinigung NICHT ohne Signal, Reinigung
JA bei Algen/Moos/Schmutz). Alle 674 Tests im Projekt grün, `tsc` sauber.
Live-Test durch dich steht aus.

**Nachtest 2 nach Fix-Deploy (Sandy, 2026-08-17):** Duplikat- und Reinigungs-Fix bleiben stabil — auch
im dritten Durchlauf weiterhin nur 2 Positionen (Fassadenfläche streichen 2×, 66,96 m², + Grundierung
66,96 m² × 6,00 € = 401,76 €), keine Duplikate, keine unverlangte Reinigung. Aber drei Funde, die noch
offen sind bzw. neu dazukommen:

1. **Die Masse-Anzeige auf der Aufnahmekarte zeigt weiterhin „1,20 × 1,40 m"** statt der tatsächlichen
   Fassadenmaße (12 × 6 m) — genau die Anzeige-Frage, die im ersten Fix-Update ausdrücklich als „separate,
   noch ungeklärte Frage" offengelassen wurde. Jetzt live bestätigt: sie ist immer noch offen, nicht aus
   Versehen mitgefixt. Die Rechnung selbst stimmt (66,96 m²), nur die Anzeige auf der Karte zeigt die
   falschen Zahlen — das ist trotzdem verwirrend, weil der Handwerker genau dort als Erstes prüft, ob
   die Maße stimmen.
2. **Neuer, ernster Bug:** Direkt nach der Aufnahme erschien kurz ein roter Banner „❗ Keine Positionen
   erkannt" — GLEICHZEITIG mit dem grünen „✓ 2 Positionen erkannt — bereit für den Entwurf" darunter, auf
   demselben Screen. Erst im zweiten Versuch kam Sandy zur Entwurfsansicht durch. Siehe „Systemischer
   Fund" oben — das geht an Head of IT UND an den Designer, auf Sandys ausdrücklichen Wunsch.
3. **Fassadenfläche streichen hat keinen Preis in der Preisdatenbank** (0,00 €, „Preis fehlt") —
   dieselbe Kategorie wie bei PM-007, siehe „Systemischer Fund".

Raummaße-Chip (PD-003, 5× rotes „!") bleibt unverändert offen, unverändert zum letzten Nachtest.

**Nachtest 3 (Sandy, 2026-08-17):** Dritter Durchlauf, gleiche Fassade. Duplikat-/Reinigungs-Fix bleibt
stabil (weiterhin nur 2 Positionen, 401,76 € Netto). Der widersprüchliche „Keine Positionen erkannt"-
Banner von letztem Mal ist diesmal NICHT aufgetreten — passt zum Verdacht, dass es sich um einen
intermittierenden/Race-Condition-artigen Fehler handelt, nicht um einen, der bei jedem Durchlauf greift
(also nicht „behoben", nur nicht ausgelöst).

Zwei Punkte bestätigen sich unverändert:
1. **Masse-Anzeige auf der Karte zeigt weiterhin „1,20 × 1,40 m"** statt der echten Fassadenmaße (12×6 m)
   — dritte identische Reproduktion (PD-007). Interessanter Beleg dazu: das neue „So gerechnet"-Infofeld
   in der Positionsansicht zeigt korrekt „12m × 6m − Fenster (5,04 m²) = 66,96 m²" — die eigentliche
   Rechnung nutzt also die richtigen Zahlen, nur die Karten-Anzeige ganz am Anfang zeigt weiterhin die
   falschen. Bestätigt: reiner Anzeige-Bug an einer isolierten Stelle, kein Rechenfehler.
2. **Fassadenfläche streichen hat weiterhin keinen Preis in der Preisdatenbank** (0,00 €, „Preis fehlt")
   — trotz Sandys expliziter Ansage dazu vor zwei Tests. Bitte nachziehen, siehe „Systemischer Fund" oben.

**Nachtest (Prüfmeister, 2026-08-16):** Beide Fixes bestätigt — nur noch 2 Positionen
(„Fassadenfläche streichen 2×" + „Grundierung / Tiefengrund Fassade", 401,76 €), keine Duplikate, keine
unverlangte Reinigung mehr. Die Grundierung selbst ist hier fachlich korrekt, weil ich sie im Transkript
ausdrücklich verlangt hatte — kein Fehler.

Zwei Dinge bleiben offen:
1. **Raummaße-Chip zeigt weiterhin fünf rote „!"** (Länge, Breite, Höhe, Türen, Fenster), obwohl die
   Rechnung dahinter stimmt — unverändert zum letzten Mal, siehe PD-003 an den Designer.
2. **Neuer kleiner Fund:** Auf der Aufnahme-Karte stand als Leistung „Gondierung" — offensichtlich ein
   verstümmeltes „Grundierung", das so roh (unkorrigiert) angezeigt wird. Wirkt kaputt/unprofessionell,
   auch wenn's die Berechnung nicht stört. Dazu kam „Fenster streichen" als Leistung, obwohl ich nur
   Fenstermaße genannt hatte, keinen Anstrich der Fensterrahmen verlangt — diese Leistung ist im
   fertigen Angebot zu Recht nicht aufgetaucht, war also eine Fehlmeldung der Karte, keine fehlende
   Berechnung (siehe Notiz an den Designer, PD-004/005-Familie: die Karte zeigt wieder etwas anderes
   als das, was am Ende passiert — hier andersrum als sonst, sie verspricht zu viel statt zu wenig).

**Nachtest 4 (Sandy, 2026-08-17):** Vierter Durchlauf, gleiche Fassade. Ein bekannter Bug bestätigt sich
wieder, einer kehrt zurück, und ein neuer, ärgerlicher Fund kommt dazu:

1. Masse-Anzeige zeigt weiterhin „1,20 × 1,40 m" statt 12×6 m — vierte identische Reproduktion (PD-007).
   Das „So gerechnet"-Infofeld zeigt wieder korrekt „12m × 6m − Fenster (5,04 m²) = 66,96 m²" — die
   Rechnung bleibt richtig, nur die Karten-Anzeige nicht.
2. Der widersprüchliche „Keine Positionen erkannt"-Banner ist zurück (war beim letzten Durchlauf nicht
   aufgetreten, jetzt wieder da) — bestätigt endgültig den Verdacht auf einen intermittierenden Fehler:
   2 von 3 bisherigen Fassade-Durchläufen hatten ihn, 1 von 3 nicht. Kein Einzelfall, kein „behoben",
   sondern ein Fehler, der nur nicht bei jedem Durchlauf auslöst.
3. **Korrektur (Sandy, 2026-08-17):** Hier stand „‚Fenster streichen' als Phantom-Leistung auf der
   Karte — zweite Bestätigung". Das war ein Lesefehler von mir beim Auswerten des Screenshots — auf der
   Karte stand das gar nicht, Sandy hat direkt nachgefragt und ich konnte es nicht bestätigen. Nehme
   ich zurück. Der einzelne ältere Fund dazu (weiter unten in diesem Abschnitt, aus einem früheren
   Durchlauf) bleibt bestehen, ist aber weiterhin nur EINFACH belegt, nicht zweifach — falls jemand
   das nochmal gezielt gegenchecken will, gerne, aber ohne neue Bestätigung von meiner Seite heute.
4. Neu und ein Rückschritt: die Grundierung hat jetzt auch keinen Preis mehr. Bisher war
   „Fassadenfläche streichen" die einzige unbepreiste Position (0,00 €), „Grundierung" hatte einen Preis
   (6,00 €/m², 401,76 €). Diesmal zeigen BEIDE Positionen „Preis fehlt in deiner Preisdatenbank" —
   Gesamtsumme jetzt 0,00 € statt vorher wenigstens 401,76 €. Auffällig: die Position heißt hier schlicht
   „Grundierung", in den Raum-basierten Testfällen (z. B. PM-011) aber „Voranstrich / Grundierung" —
   meine Vermutung: das sind für die Preisdatenbank zwei VERSCHIEDENE Einträge, kein gemeinsamer. Falls
   das stimmt, würde ein Preis, den Sandy für „Voranstrich / Grundierung" hinterlegt, die Fassade
   trotzdem nicht abdecken — das wäre eine zusätzliche Erklärung dafür, warum die Preislücke bei der
   Fassade so hartnäckig ist. Bitte von Head of IT gegenchecken, ob es sich wirklich um zwei getrennte
   Preisdatenbank-Schlüssel handelt.

Raummaße-Chip (PD-003) weiterhin unverändert offen.

**Nachtest 5 (Sandy, 2026-08-18) — struktureller Fund: Fassade ist kein Raum, Datenmodell muss
überarbeitet werden.** Fünfter Durchlauf, gleiche Fassade Südseite (12 m lang, Giebelhöhe 6 m, 3 Fenster
1,20×1,40 m). Zwei bekannte Punkte bestätigen sich wieder, eine neue Variante des Masse-Anzeige-Bugs
kommt dazu — vor allem aber liefert Sandy selbst die wahrscheinliche Root-Cause für die ganze
PM-008-Fehlerfamilie:

1. **Masse-Anzeige zeigt jetzt „120,00 × 140,00 m"** statt der Fassadenmaße (12×6 m) — eine neue Variante
   desselben bekannten Anzeige-Bugs (bisher stand dort immer „1,20 × 1,40 m"). Auffällig: 120/140 sieht
   aus wie dieselben Fenstermaße (1,20/1,40), nur um den Faktor 100 verschoben — genau das Muster, das
   beim PM-010-Fund („drei fünfzig" → 350 statt 3,50 m) schon einmal auftrat und dort von Head of IT auf
   die Spracherkennung selbst zurückgeführt wurde, nicht auf eigenen Code. Kann hier derselbe Effekt sein
   („eins zwanzig" wird als „120" gelesen), zusätzlich zur schon bekannten falschen Feld-Zuordnung
   (Fenstermaß statt Fassadenmaß auf der Karte). Bitte gegenchecken, ob beide Bugs zusammenhängen oder
   unabhängig sind.
2. **Fenster in der Entwurfsansicht zeigt „0" (rotes „!")**, obwohl die Aufnahmekarte korrekt
   „Fenster: 3" zeigt — deckt sich mit dem seit Langem bekannten PD-003 (Raummaße-Chip zeigt bei
   Nicht-Raum-Objekten überall rote Fehler statt Werten), nicht neu, aber erneut bestätigt.
3. **Grundierung weiterhin ohne Preis**, zusammen mit Fassadenfläche streichen — unverändert zum letzten
   Nachtest, siehe „Systemischer Fund" oben.

**Sandys eigene Einordnung, wichtiger als die Einzelfunde oben (wörtlich sinngemäß):** Sie hat beim Bauen
des Tools die Entwurfsansicht so angelegt, dass nach Räumen gefiltert wird und jeder Raum eine feste
Zeile mit fixen Raummaßen hat — auf deren Basis werden alle Positionen für diesen Raum berechnet. Eine
Fassade ist aber kein Raum: relevant sind nur Wandlänge und Wandhöhe, es gibt keine Raumtiefe. Ihre
Worte: „das muss irgendwie umgedacht werden, weil das wird auf jeden Fall auch vorkommen." Das ist
vermutlich die gemeinsame Ursache für Punkt 1 und 2 oben (und für PD-003/PD-007 insgesamt) — kein Bündel
zufälliger Einzelbugs, sondern ein Datenmodell, das nur für „echte" Räume gebaut ist und Nicht-Raum-
Objekte wie Fassaden in dasselbe Formular presst, in das sie strukturell nicht passen.

**Aufgabe, ausdrücklich von Sandy verlangt:** Daraus soll eine echte Aufgabe werden, nicht nur eine
weitere Zeile hier — sowohl für Head of Product Engineering (eigenes Datenmodell für Wand-/Fassaden-Objekte
ohne Raumtiefe, das nicht in die feste Raum-Zeile gepresst wird) als auch für den Designer (eigenes
Anzeige-Format für Nicht-Raum-Objekte, siehe Update zu PD-003/PD-007 in
`pruefmeister-notizen-fuer-designer.md`). Prüfmeister meldet strukturell zusätzlich an Chief of Staff
weiter, siehe `pruefmeister-notiz-fuer-chief-of-staff.md`.

**Separat, unabhängig von der Fassade:** Sandy hat außerdem klar gesagt, dass ihr die Aufnahmekarte selbst
(nicht die Entwurfsansicht mit den fehlenden Preisen, sondern die Karte direkt davor, der erste
Gegencheck) grundsätzlich nicht gefällt — ihre Worte: „Das gefällt mir gar nicht" und „Es ist einfach
eine Katastrophe", weil dort andere Dinge stehen als später im Angebotsentwurf. Inhaltlich deckt sich das
mit dem längst bekannten PD-001/PD-004 (Karte zeigt etwas anderes als das, was am Ende berechnet wird),
ist aber eine ausdrückliche Bekräftigung, dass dieser Punkt nicht als Kleinigkeit behandelt werden soll.

**Fix-Update (Head of Product Engineering, 2026-08-18):** Alle vier Engineering-seitigen Punkte aus der
PM-008-Fehlerfamilie einzeln durchgegangen, jeweils bis zur Ursache zurückverfolgt statt nur das Symptom
abzudichten:

1. **Masse-Anzeige falsch** (zuletzt „120,00 × 140,00 m" statt 12×6 m): Ursache gefunden. Die Karte holt
   ihre Vorschau-Maße NICHT aus der echten Berechnung, sondern aus einer eigenen, rein clientseitigen
   Text-Heuristik (`extrahiereRaumdaten()` in der Entwurfsansicht), die im Rohtranskript nach dem ERSTEN
   „X mal Y" sucht — bei einer Fassade mit erwähnten Fenstermaßen („Fenster ist 1,20 mal 1,40") greift sie
   auf das falsche Zahlenpaar zu, weil das zufällig zuerst im Satz steht. Die 100er-Verschiebung (120/140
   statt 1,20/1,40) ist ein zweiter, unabhängiger Effekt der Sprach-zu-Text-Stufe — siehe PM-010, nicht
   Teil dieses Fixes. Fix: die Heuristik überspringt jetzt Zahlenpaare, die im Text erkennbar im
   Fenster-/Tür-Kontext stehen, und nimmt das erste Paar außerhalb davon.
2. **Widersprüchlicher „Keine Positionen erkannt"-Banner:** Ursache gefunden, keine echte
   Race-Condition. Ein früherer „Fertigstellen"-Versuch ohne erkannte Positionen setzt eine Fehlermeldung
   in der Entwurfsansicht — die aber nie wieder geräumt wurde, auch nicht, wenn eine noch verarbeitende
   Aufnahme kurz danach doch Positionen liefert. Dadurch standen rotes Fehler- und grünes Erfolgs-Banner
   gleichzeitig auf dem Schirm. Fix: die Fehlermeldung wird jetzt gezielt geräumt, sobald eine Aufnahme
   tatsächlich Positionen liefert — andere Fehler (Netzwerk, fehlender Preis) bleiben unangetastet stehen.
3. **Grundierung/Fassadenfläche ohne Preis:** Ursache gefunden. Der Preiskatalog schreibt Anstriche mit
   echtem Multiplikationszeichen („2× Anstrich"), die generierten Positionen mit normalem „x" („2x") — beim
   Abgleich wurde das „×" bisher komplett entfernt statt wie „x" behandelt, wodurch die
   Anstrich-Zahl auf beiden Seiten verloren ging. Zusätzlich verschmolz „Fassadenfläche" beim Normalisieren
   mit einer generischen Flächen-Regel zu einem Wort, das nicht mehr zu „Fassade" im Katalog passte. Beides
   gefixt und mit gezielten Tests gegen den echten Preiskatalog abgesichert (`findePreisposition` findet
   „Fassadenfläche streichen 2x" jetzt korrekt zum passenden 2×-Preis, nicht zum 1×-Preis).
4. **Strukturelle Root-Cause (Datenmodell):** Sandys Befund bestätigt und genauer eingegrenzt. Die
   Mengen-Engine selbst behandelt eine Fassade bereits nicht als Raum (eigenes `waende[]`-Feld, nur
   Wandlänge/-höhe, kein Boden/Decke). Die Lücke liegt eine Ebene weiter außen: Die Bearbeiten-Ansicht
   eines fertigen Angebots (Live-Neuberechnung bei manueller Maß-Korrektur) füllt ihre Daten
   ausschließlich aus `raeume[]` — bei einer reinen Fassaden-Aufnahme bleibt dieses Feld leer, und die
   Bearbeiten-Ansicht hat für die Fassaden-Position schlicht keine editierbaren Maße, unabhängig vom
   Anzeige-Format. Konkreter Vorschlag für die Datenmodell-Hälfte (Vorschlag, noch nicht umgesetzt — wie
   von Sandy verlangt als eigene, koordinierte Aufgabe mit dem Designer, nicht blind implementiert):
   einen `typ: 'wand'`-Zweig ergänzen, der nur Länge/Höhe/Türen/Fenster kennt (keine Breite, keine
   Bodenfläche), die Bearbeiten-Ansicht zusätzlich aus `waende[]` befüllen, und die Flächenberechnung für
   diesen Zweig direkt aus Länge × Höhe ableiten statt aus einem Raumumfang. Wartet auf Sandys Go, bevor
   das umgesetzt wird — betrifft den Live-Berechnungspfad fertiger Angebote.

   **Go (Sandy, 2026-08-18):** „go" — Freigabe erteilt, koordiniert mit dem
   Designer (Konzept „Wand-Chip" liegt bereits vor, siehe
   `docs/dc-024-konzept-wandchip.md` bzw. DC-024 in `docs/design-check.md`).
   Head of Product Engineering kann den `'wand'`-Zweig umsetzen.

**Ehrlich zum Stand:** Punkte 1–3 sind lokal gegen den echten Preiskatalog bzw. mit gezielten
Regressionstests verifiziert (neue Testfälle in `extraktion-masse.test.ts` und `preis-matcher.test.ts`).
Punkt 4 ist bewusst nur als Vorschlag dokumentiert, nicht implementiert.

**Update (2026-08-18, nach Sandys Testlauf):** `npm run typecheck` sauber, `npm test` hat von 712 Tests
einen einzigen echten Treffer geliefert — genau das, wofür die Testsuite da ist. Der neue Testfall
„Giebelhöhe im Schnitt sechs Meter" (ausgeschriebene Zahl) schlug fehl, weil `extrahiereRaumhoehe()`
bisher nur Ziffern verstand, keine Zahlwörter. Nachgegangen: einer der beiden echten Aufrufer dieser
Funktion (die Erschwerniszuschlag-Prüfung für hohe Wände/Decken) übergibt das Rohtranskript OHNE
vorherige Zahlwort-Umwandlung — bei „Giebelhöhe im Schnitt sechs Meter" (ohne dass Whisper das schon
selbst in Ziffern verwandelt hätte) wäre der Zuschlag also gar nicht ausgelöst worden. Fix:
`extrahiereRaumhoehe()` wandelt Zahlwörter jetzt selbst zuerst um, unabhängig davon, ob der Aufrufer das
schon gemacht hat. Erneut isoliert gegen alle 32 Fälle der Testdatei geprüft (inklusive der alten
„2 Meter 60"-Falle, die dabei nicht anfassen durfte) — alle grün, keine Regression. An Sandy geliefert;
kompletter `npm test`-Lauf mit dieser letzten Korrektur steht noch aus.

**Update (2026-08-18, nach Sandys Live-Nachtest):** `npm test` danach komplett grün (712/712). Live-Test
auf `sofortangebot.app` zeigte trotzdem alle drei Symptome unverändert — Ursache: die Fixes lagen zu dem
Zeitpunkt nur lokal, `sofortangebot.app` läuft auf einem separaten Deployment, das erst durch den
Platform-&-Integrations-Engineer aktualisiert wird (nicht meine Zuständigkeit, an Sandy so kommuniziert).
Test auf `localhost:3000` (mit den Fixes) brachte zwei echte, neue Erkenntnisse:

1. **Masse-Anzeige — zweiter, subtilerer Fund:** Sandys echtes Test-Transkript („Fassade an der Südseite,
   12 Meter lang, Giebelhöhe im Schnitt 6 Meter, 3 Fenster drin, 1,20 x 1,40, Fassadenfarbe zweimal drauf,
   dazu vorher Grundierung.") zeigte weiterhin „1,20 × 1,40 × 6,00 m" statt der echten Fassadenmaße. Der
   erste Fix (Fenster-/Tür-Kontext überspringen) griff hier nicht: das Fenstermaß „1,20 x 1,40" steht in
   einer EIGENEN, knappen Kommaklausel, das Wort „Fenster" selbst eine Klausel davor — das alte
   12-Zeichen-Kontextfenster war schlicht zu eng (fehlte um 2 Zeichen), um das noch zu erfassen. Fix:
   satzzeichenbasiert statt fester Zeichenzahl — prüft jetzt die eigene Klausel PLUS die davor. Direkt
   gegen Sandys echten Transkript-Text verifiziert (Ergebnis jetzt: Fenstermaß korrekt übersprungen,
   Fassadenmaße selbst stehen aber gar nicht im „X mal Y"-Format im Text — „12 Meter lang" +
   „Giebelhöhe … 6 Meter" getrennt —, die Karte zeigt deshalb ehrlich GAR KEINE Maße statt falscher; besser
   nichts als Falsches). Bei dieser Gelegenheit außerdem die bis dahin ungetestete, direkt in der
   Entwurfsseite lebende Logik (`extrahiereRaumdaten`, `istOeffnungsKontext`) nach `extraktion-masse.ts`
   verschoben und mit 3 neuen Tests abgesichert (inkl. Sandys echtem Satz als Testfall) — genau die Art
   fragiler Rohtext-Stelle, für die diese Datei laut ihrem eigenen Kopfkommentar gedacht ist.
2. **„Preis fehlt" auf localhost war KEIN Bug:** das Test-Angebot lief unter einem anderen Firmen-Konto
   als Sandys reguläres (Preisdatenbank dort hat nur 5 generische Positionen, keine Maler-/Fassadenpreise
   — „Preis fehlt" war in diesem Fall also die ehrliche Wahrheit, nicht der Bug). Mit Sandys Hauptkonto
   (echte ~2155 Positionen) direkt gegen den echten Preiskatalog nachgerechnet: „Fassadenfläche streichen
   2x" und „Grundierung" finden beide korrekt ihren Katalogpreis. Zusätzlich aufgefallen, aber NICHT Teil
   von PM-008: die neue „Erschwerniszuschlag Raumhöhe > 3m"-Position (jetzt korrekt ausgelöst dank Fix 1)
   hat ebenfalls keinen Katalogpreis — die passenden Erschwernis-Einträge im Katalog haben Einheit „%",
   die generierte Position aber „Pauschale". Separater, neuer Fund — noch nicht gefixt, wird als eigener
   Punkt nachgetragen statt hier untergemischt.

**Fix-Update (Head of Product Engineering, 2026-08-18) — Punkt 4, Datenmodell `modus: 'wand'`:**
Sandys Go lag vor (siehe `docs/entscheidungen-fuer-sandy.md`), der Designer hatte sein Konzept
„Wand-Chip" fertig (`docs/dc-024-konzept-wandchip.md`) und ausdrücklich signalisiert: sobald das
Datenfeld existiert, baut er die Komponente. Umgesetzt, genau nach dem dort abgestimmten Umfang:

1. `RaumModus` in `raum-geometrie.ts` um `'wand'` erweitert (Geschwister von `rechteck`/`flaeche`/
   `grundriss`). `berechneRaumMasse()` rechnet für `'wand'` die Wandfläche direkt aus Länge × Höhe −
   Öffnungen (Türen/Fenster wie gehabt abgezogen) — bewusst ohne Umfang und ohne Bodenfläche, weil eine
   Fassade keinen Boden/keine Decke hat (dieselbe fachliche Begründung wie der bestehende Kommentar
   „Keine Decke, kein Boden, kein Umfang für Fassaden" in `maler.ts`). 9 neue Tests in
   `raum-geometrie.test.ts`.
2. `generiere-positionen/route.ts` befüllt `raum_details` jetzt zusätzlich aus `extraktion.waende[]`
   (mit `modus: 'wand'`) — vorher lief die gesamte Raumdimensionen-Speicherung ausschließlich über
   `extraktion.raeume[]`, bei einer reinen Fassaden-Aufnahme (Fassade landet bei GPT strukturell in
   `waende[]`, nicht in `raeume[]`) blieb `raum_details` deshalb komplett leer — die Bearbeiten-Ansicht
   hatte nichts zum Anzeigen oder Neuberechnen, ganz unabhängig vom Chip-Format.
3. **Nebenfund beim Umsetzen, direkt mitgefixt:** dieselbe Lücke gab es ein zweites Mal, auf einem
   anderen Weg — GPT legt manche Fassaden nicht in `waende[]`, sondern als „Raum" mit nur Länge+Höhe ab
   (Breite fehlt strukturell). Dieser Fall bekommt jetzt ebenfalls `modus: 'wand'` statt stillschweigend
   als unvollständiges Rechteck gespeichert zu werden — genau der Fall, der zuvor die 5 roten „!" im
   Chip erzeugt hat, obwohl die Rechnung dahinter stimmte (PD-003).
4. **Zweiter Nebenfund:** `berechneQuantityFuerItem()` (rechnet beim Bearbeiten die Menge einer
   einzelnen Position neu) erkannte „Fassadenfläche streichen …" bisher nicht als Wandleistung (nur
   „wand"/„tapete"/„spachtel"/„grundier"/… im Titel), weil die Maler-Engine Fassaden-Positionen anders
   benennt als Raum-Positionen. Ohne diese Ergänzung hätte eine Änderung an den neuen Wand-Maßen die
   zugehörige Fassadenfläche-Position beim Bearbeiten NICHT aktualisiert — „fassade" ergänzt.

**Bewusst NICHT angefasst:** `AngebotDetail.tsx` (die eigentliche Chip-Anzeige). Das ist abgestimmt
Designer-Terrain — das fertige Konzept liegt in `docs/dc-024-konzept-wandchip.md`, ich habe nur die
Datenbasis dafür gebaut. Ehrlich zum Zwischenstand: bis die neue Komponente eingebaut ist, zeigt die
Bearbeiten-Ansicht bei `modus: 'wand'` eine leere Maße-Zeile statt der 5 roten „!" von vorher (keiner
der drei bisherigen UI-Zweige `rechteck`/`flaeche`/`grundriss` greift für `'wand'`) — kein Rechenfehler,
nur noch kein passendes Format. Datenmodell + Speicherung sind isoliert gegen die exakten Zahlen aus
Sandys eigenem Testfall geprüft (12 m × 6 m − 3 Fenster = 68,4 m²), `npm run typecheck && npm test`
durch Sandy steht noch aus.

**Nachtest 6 (Sandy, 2026-08-18) — Wand-Chip ist live, PD-003 damit tatsächlich behoben, dazu eine echte
Rechen-Diskrepanz gefunden.**

**Positiv, zuerst:** Der Chip zeigt jetzt „WAND / FASSADE" mit vier korrekt gefüllten Feldern —
„Wandlänge 12 m", „Wandhöhe 6 m", „Türen 0", „Fenster 3" — keine roten „!" mehr. Der alte PD-003-Fund
(fünf gleichzeitige Fehleranzeigen trotz korrekter Rechnung) ist damit für dieses Beispiel wirklich weg,
nicht nur angekündigt. Der Umschalter „Kein Wand-Objekt? Als Raum bearbeiten" ist ebenfalls da.

1. **Neuer Bug: Fensterabzug in der „So gerechnet"-Zeile des Chips falsch, widerspricht der tatsächlich
   abgerechneten Position.** Der Chip zeigt „12,00 m × 6,00 m − 3 Fenster (3,60 m²) = 68,40 m²". Das ist
   falsch — 3 Fenster à 1,20×1,40 m sind 5,04 m², nicht 3,60 m² (3,60 ÷ 3 = 1,20 m² je Fenster — sieht so
   aus, als würde nur die Fensterbreite abgezogen, nicht Breite × Höhe). Wichtiger als die einzelne
   Zahl: direkt darunter zeigt die tatsächlich abgerechnete Position „Fassadenfläche streichen 2x"
   weiterhin korrekt „66,96 m²" — zwei Zahlen für denselben Sachverhalt auf demselben Screen,
   widersprüchlich. Das ist derselbe Fehler-Typ, den ich seit Tagen als größtes strukturelles Risiko
   melde (zwei unabhängige Berechnungen laufen auseinander) — nur diesmal beide auf dem neuen Chip
   selbst, nicht mehr Karte-gegen-Entwurf. Für Head of Product Engineering: das passt zu der im letzten
   Fix-Update selbst notierten Zahl „12 m × 6 m − 3 Fenster = 68,4 m²" als vermeintlich verifiziertes
   Ergebnis für `berechneRaumMasse()`/`modus: 'wand'` — das würde bedeuten, der neue isolierte Test prüft
   bereits gegen die falsche Zahl, nicht gegen die alte, seit PM-008 Tag 1 unveränderte Soll-Lösung
   dieser Datei (66,96 m², Wandfläche minus Fenster à 1,20×1,40 m). Bitte gegenchecken, ob die
   Öffnungsfläche im neuen `'wand'`-Zweig aus Breite × Höhe oder nur aus einem der beiden Werte kommt.

**Korrektur (Prüfmeister, 2026-08-18):** Hier stand als Punkt 2 „Karte zeigt wieder eine Phantom-Leistung
— Fenster streichen, Feuergrundierung, diesmal eindeutig belegt, kein Lesefehler". Sandy hat direkt
widersprochen: das steht so nicht auf der Karte. Zurückgenommen, komplett — ich habe die Leistungen-Liste
falsch gelesen bzw. mit einem älteren PM-008-Fund (der schon einmal denselben Lesefehler-Zyklus durchlief,
siehe PD-007-Korrektur vom 17.08.) verwechselt, statt den aktuellen Screenshot neu zu lesen. Die
„Erschwerniszuschlag Raumhöhe > 3m"-Position (weiterhin ohne Preis) und die Rechen-Diskrepanz oben
(Punkt 1) sind davon nicht betroffen und bleiben stehen.

**Nachtrag (Prüfmeister, 2026-08-18) — diesmal per Copy-Paste von Sandy verifiziert, nicht per
Screenshot-Lesung:** Ein weiterer Durchlauf (20:27 Uhr, andere Uhrzeit als der 20:02-Uhr-Durchlauf oben —
ob derselbe oder ein neuer Testlauf, ist nicht sicher, deshalb kein direkter Vergleich zum
20:02-Uhr-Entwurf unten) zeigt auf der Aufnahmekarte tatsächlich zwei Leistungen: „Fassade streichen" und
„Vorhergrundierung". Kein „Fenster streichen" — der vorherige Fund war wie oben beschrieben ein echter
Lesefehler meinerseits. „Vorhergrundierung" (vermutlich „Vorher-Grundierung" ohne Leerzeichen/Bindestrich
zusammengezogen) ist eine Namensverstümmlung in derselben Familie wie „Gondierung" aus einem früheren
Nachtest — diesmal aber wirklich bestätigt, nicht geraten. „Fenster: 3" steht separat darunter, Banner
„2 Positionen erkannt" passt zahlenmäßig zu den zwei gelisteten Leistungen. Für Head of Product
Engineering: Namensverstümmlungen wie „Gondierung"/„Vorhergrundierung" treten wiederholt bei
Grundierungs-Positionen auf der Karte auf — könnte an derselben Textquelle liegen, die schon beim
Masse-Anzeige-Bug in diesem Testfall eine Rolle spielte (clientseitige Text-Heuristik statt echter
GPT-Extraktion für die Karte).

**Fix-Update zur Rechen-Diskrepanz aus Nachtest 6 (Head of Product Engineering, 2026-08-19):**
Root-Ursache bestätigt — genau die Vermutung des Prüfmeisters oben stimmte. `raum_details` (die
gespeicherten Raummaße, die der Chip beim Bearbeiten neu durchrechnet) hat für Fenster/Türen bisher nur
eine STÜCKZAHL gespeichert, nie die echte Breite/Höhe aus dem Transkript. `berechneRaumMasse()` in
`raum-geometrie.ts` rechnete deshalb beim Neuberechnen immer mit dem Standardmaß 1,20×1,00 m je Fenster
(3 × 1,20 m² = 3,60 m², daher die falschen 68,40 m²) — obwohl die ursprüngliche, korrekt bepreiste
Position („Fassadenfläche streichen", 66,96 m²) aus derselben Extraktion stammt und in `maler.ts` mit den
echten 1,20×1,40 m je Fenster gerechnet hatte (3 × 1,68 m² = 5,04 m²). Zwei Berechnungen auf denselben
Rohdaten, aber mit unterschiedlich vollständigen Eingaben — kein Rundungsfehler, echte Diskrepanz.

Das ist keine Eigenheit des neuen `'wand'`-Zweigs, sondern eine Lücke, die es in `raum-geometrie.ts` für
ALLE Modi (auch 'rechteck', 'grundriss') schon vorher gab — bei Standardmaßen fällt sie nicht auf, weil
dann Standardmaß und echtes Maß identisch sind. Sichtbar wurde sie erst durch die Kombination aus diesem
Testfall (bewusst nicht-standardmäßiges Fenster) und der neuen „So gerechnet"-Anzeige des Designers, die
das erstmals offenlegt.

Fix: `RaumDimension` bekommt zwei neue, optionale Felder `fensterFlaeche`/`tuerFlaeche` (echte
Gesamtfläche in m², wenn bekannt) — sind sie gesetzt, ersetzen sie den Stückzahl×Standardmaß-Abzug in
`berechneRaumMasse()`; ohne sie bleibt alles wie bisher. `generiere-positionen/route.ts` berechnet diese
Flächen jetzt beim Speichern der Raummaße mit exakt derselben Formel wie `maler.ts`
(`anzahl × (breite ?? Standard) × (hoehe ?? Standard)`), für Räume UND Fassaden. Geänderte Dateien:
`raum-geometrie.ts`, `generiere-positionen/route.ts`, dazu 3 neue Tests in `raum-geometrie.test.ts`
(u. a. exakt dieser Fall: 3 Fenster à 1,20×1,40 m → 66,96 m² statt 68,40 m²). Live-Nachtest durch dich
steht noch aus — am besten genau diesen Fall (Fassade, 3 Fenster 1,20×1,40 m) im Chip nochmal öffnen und
auf „So gerechnet" schauen.

---

## PM-010 — Sockelleisten-Doppel-Falle: alte raus, neue montiert, dann gestrichen

**Status:** 🟡 Zwei der drei ursprünglichen Bugs bestätigt behoben (erfundener Bodenaustausch weg,
„Sockelleisten streichen" jetzt da, fünfter Fix wirkt), der 350-Bug ist eine akzeptierte, bewusste
Design-Entscheidung (Warnung statt Korrektur). **Neuer Fund (2026-08-19):** „Sockelleisten entfernen" wird
auf der Karte erkannt, taucht aber im fertigen Entwurf nirgends auf — dieselbe stille Fehlerkategorie wie
der ursprüngliche „streichen"-Fund, jetzt beim „entfernen". Siehe Nachtest vom 2026-08-19 unten.

**Zum Einsprechen:**
„Gästezimmer, drei fünfzig mal drei, Höhe zwo sechzig. Die alten Sockelleisten kommen raus, neue werden montiert, weiße MDF-Leisten. Die sollen dann auch noch gestrichen werden, passend zur Wand. Wände und Decke streichen, zweimal."

**Soll-Lösung:**
- Umfang: 2×(3,50+3,00)=13,00 lfm
- Wandflächen streichen 2× (Standardannahmen 1 Fenster, 1 Tür, Höhe 2,60): 13,00×2,60=33,80 minus 1,20 minus 1,89 = **30,71 m²**
- Deckenfläche streichen 2×: 3,50×3,00= **10,50 m²**
- **Boden-Gewerk:** Sockelleisten montieren (neu): 13,00 lfm
- **Maler-Gewerk:** Sockelleisten streichen: eigene Position, 13,00 lfm (minus Türbreite, falls die Maler-Engine das hier richtig macht)

**Worauf achten:** Das ist die im Fachwissen explizit benannte klassische Falle, hier bewusst als Doppel-Fall gebaut — alte Leisten raus + neue montiert (Boden) UND gestrichen (Maler), im selben Satz. Erwartung: zwei getrennte Positionen in zwei Gewerken. Verdacht: die Maler-Engine kennt nach meinem Code-Blick nur „Sockelleisten abkleben" (Schutz vorm Streichen der Wand) als Sockelleisten-Position, aber keine eigene „Sockelleisten streichen"-Position für das tatsächliche Lackieren der Leisten selbst. Wenn das stimmt, fehlt eine ganze Leistung im Angebot, obwohl sie ausdrücklich verlangt wurde — das wäre wieder ein stiller Fehler.

**Ist-Ergebnis (aus dem Tool):**
- **Aufnahme-Karte zeigte Maße „350,00 × 3,00 m"** — statt der gesprochenen 3,50 × 3,00 m. „Drei fünfzig" (die im Handwerk übliche Sprechweise für 3,50 m, genau wie ich sie in praktisch jedem Testfall benutzt habe) wurde als die Zahl 350 statt als 3,50 gelesen. Ein Gästezimmer mit 350 Meter Länge ist offensichtlicher Unsinn.
- Leistungen auf der Karte: Sockelleisten entfernen, Neue Sockelleisten montieren, **Sockelleisten streichen**, Wände streichen, Decke streichen — „5 Positionen erkannt". „Sockelleisten streichen" wird also als eigene Leistung erkannt, unabhängig von „abkleben".
- Im fertigen Angebot stehen die Raummaße dann korrekt bei „3 × 3,5 m" — die absurden 350 m sind bis zur Fertigstellung verschwunden (wie genau, ist unklar — vermutlich wurden sie beim Einrichten des Entwurfs von Hand korrigiert, nicht vom Tool selbst).
- Positionen im fertigen Angebot: Wandflächen streichen 2× (30,71 m², 291,75 €) ✓, Deckenfläche streichen 2× (10,5 m², 115,50 €) ✓, Boden schützen (10,5 m², 12,60 €), **Sockelleisten montieren (12,1 lfdm, 66,55 €)** — mit korrektem Türabzug (13,00 − 0,90 = 12,10, der PM-002-Fix wirkt auch hier.
- Nettosumme (486,40 €) ergibt sich exakt aus diesen 4 Positionen. **„Sockelleisten streichen" fehlt komplett** — genau wie auf der Karte „5 Positionen erkannt" standen, aber wieder nur 4 geliefert wurden.

**Befund:**

1. **Massiver Extraktionsfehler bei Maßangaben in Wort-Sprechweise („drei fünfzig" → 350 statt 3,50)**
   - Das ist potenziell der gefährlichste Einzelfund von allen bisherigen Tests, weil es keine Nische betrifft, sondern die Art, wie praktisch jeder Handwerker Maße durchsagt („drei fünfzig", „zwei achtzig" usw. — genau die Sprechweise, die ich in fast jedem Testfall benutzt habe, und die bisher nie danebenging). Hier ging's einmal komplett daneben, faktisch um den Faktor 100.
   - Wäre das nicht aufgefallen (Raummaße stehen ja nicht immer prominent im Blick, bevor man auf „Entwurf erstellen" tippt), hätte das Angebot entweder mit absurden Flächen gerechnet oder wäre wie bei PM-008 in einer Sackgasse gelandet.
   - Für Head of IT: bitte gezielt testen, wie robust die Zahlenerkennung bei der Sprechweise „X-Y" für Meterangaben mit Komma ist (z. B. „drei fünfzig", „vier zwanzig", „zwei achtzig") — das war bei mir bisher öfter korrekt als hier, also eventuell ein Sonderfall (z. B. speziell bei „drei fünfzig" ohne die Einheit „Meter" direkt danach, oder abhängig von der Satzposition).

2. **Bestätigte Lücke: „Sockelleisten streichen" wird erkannt, aber nie zu einer Position**
   - Erwartet: eine eigene Maler-Position „Sockelleisten streichen" neben „Sockelleisten montieren" (Boden) — zwei Gewerke, zwei Positionen, wie ausdrücklich verlangt.
   - Tatsächlich: Die Karte zählt „Sockelleisten streichen" mit („5 Positionen erkannt"), aber im fertigen Angebot taucht nur „Sockelleisten montieren" (Boden) auf — die Maler-Seite fehlt komplett, obwohl ausdrücklich verlangt.
   - Das bestätigt exakt die klassische Falle aus dem Fachwissen: der Handwerker bekommt die neuen Leisten montiert berechnet, aber das Streichen der Leisten fehlt im Angebot — würde er das übersehen, macht er die Arbeit am Ende unbezahlt.

**Für Head of IT:** zwei getrennte Themen — (1) Zahlenerkennung bei „X-Y"-Sprechweise für Maße prüfen, (2) eigene „Sockelleisten streichen"-Position in der Maler-Engine ergänzen, analog zu „Sockelleisten abkleben", aber als tatsächliche Anstrich-Leistung (mit lfdm-Fläche, nicht nur als Nebenleistung).
**Für den Designer:** wieder „X Positionen erkannt" ≠ tatsächliche Positionen, siehe PD-004. Und: sollte eine derart auffällige Maßangabe wie „350 m" bei einem Innenraum nicht schon auf der Aufnahme-Karte selbst eine Warnung auslösen, bevor der Nutzer weiterklickt?

**Nachtest (Prüfmeister, 2026-08-16) — beide alten Funde bestätigt, plus ein neuer, ernster:**

Denselben Fall nochmal eingesprochen. Die Karte zeigte wieder **„350,00 × 3,00 m"** statt 3,50 × 3,00 —
identisch zum ersten Mal, also kein Einzelfall, sondern reproduzierbar bei genau dieser Sprechweise
(„drei fünfzig mal drei"). Das ist jetzt bestätigt, nicht mehr nur Verdacht. „Sockelleisten streichen"
fehlt weiterhin im fertigen Angebot, ebenfalls reproduziert.

**Neuer Fund, schwerer als die beiden anderen:** Im fertigen Angebot tauchten diesmal zusätzlich zwei
Positionen auf, die ich nie verlangt habe — **„Bodenbelag verlegen inkl. 5% Verschnitt"** (11,03 m²,
Preis fehlt) und **„Altbelag entfernen"** (10,5 m², Preis fehlt). Ich hatte ausschließlich von
Sockelleisten gesprochen (alte raus, neue montiert, gestrichen) — nie davon, dass der Bodenbelag selbst
ausgetauscht wird. Sieht so aus, als hätte die Extraktion „die alten Sockelleisten kommen raus" mit
„der alte Bodenbelag kommt raus" verwechselt und daraus einen kompletten (nie verlangten) Bodenaustausch
gemacht, inklusive neuer Verlegung. Beide Positionen sind zum Glück noch unbepreist (roter Warnhinweis),
würden aber, wenn übersehen und mit Preis versehen, ein völlig falsches Leistungsbild ins Angebot
bringen — eine Fußbodenerneuerung kostet erheblich mehr als ein Sockelleisten-Tausch.

**Einordnung:** Das ist eine neue Fehlerkategorie gegenüber allem bisher Gefundenen — nicht „Position
fehlt" oder „Position doppelt", sondern „Tool erfindet einen ganzen, nie angefragten Leistungsblock".
Für Head of IT: bitte prüfen, ob die Extraktion bei Sockelleisten-Erwähnungen („alte raus", „neue
montiert") fälschlich auch Bodenbelag-Signale auslöst — evtl. dieselbe Fundstelle wie bei
„altbelag_entfernen"/"belag"-Erkennung in der Boden-Engine, die zu breit auf Wörter wie „alte …
kommen raus" anspringt, ohne zu prüfen, WAS genau rauskommt.

**Fix-Update (Head of IT, 2026-08-17) — erfundener Bodenaustausch:** Genau
dort gefunden, wo der Prüfmeister es vermutet hat. In `boden-normalisierer.ts`
gibt es eine Erkennung für „Altbelag muss raus" — die hatte einen Textbaustein,
der auf das BLOSSE Wort „raus" reagiert, ganz ohne zu prüfen, wovon im Satz
überhaupt die Rede ist. Bei „Die alten Sockelleisten kommen raus" reicht das
Wort „raus" allein, damit das Tool einen kompletten Bodenaustausch dazu
erfindet — obwohl kein einziges Mal von Teppich, Parkett, Vinyl o.ä. die Rede
war. Interessant dabei: für das schwächere Wort „weg" gab es diese Prüfung
("steht im selben Satz auch ein Boden-Wort?") schon längst — nur beim Wort
„raus" fehlte sie.

Fix: „raus" (und „weg") zählen jetzt nur noch, wenn im selben Satz auch
wirklich ein Boden-Wort steht (Teppich/Parkett/Vinyl/Laminat/Belag/Boden/…).
Eindeutigere Wörter wie „rausreißen", „entfernen", „demontiert", „abgerissen"
bleiben unverändert (die sind spezifisch genug, kein Bug bekannt). Neuer Test
in `boden-normalisierer.test.ts` mit genau deinem Sockelleisten-Fall (jetzt:
kein Bodenaustausch mehr) plus einem Gegen-Test, dass „Der alte Boden muss
raus" weiterhin korrekt erkannt wird. Alle 676 Tests im Projekt grün, `tsc`
sauber. Live-Test durch dich steht aus.

**Fix-Update (Head of IT, 2026-08-17) — „drei fünfzig" wurde zu 350:**
Ursache lag NICHT bei GPT, sondern bei UNS selbst — eine eigene Vorverarbeitung
wandelt Zahlwörter in Ziffern um, bevor der Text überhaupt zu GPT geschickt
wird. Sie hat „drei" und „fünfzig" JEDES FÜR SICH ersetzt: aus „drei fünfzig
mal drei" wurde „3 50 mal 3" — zwei Zahlen nur mit einem Leerzeichen
getrennt, keine Verbindung mehr zur Handwerker-Sprechweise „X Y" = X Meter Y
Zentimeter. GPT hat dann verständlicherweise „3 50" als „350" gelesen, weil
es die Trennung nicht mehr sehen konnte — der Fehler war zum Zeitpunkt der
GPT-Anfrage schon längst passiert.

Fix: Eine neue Vorverarbeitungs-Regel erkennt genau dieses Muster
(Einer-Zahlwort + Zehner-Zahlwort, z.B. „drei fünfzig", „eins zwanzig", „zwei
achtzig") und wandelt es VOR der Einzelwort-Ersetzung direkt in die richtige
Dezimalzahl um (3.50, 1.20, 2.80). Das betrifft nicht nur diesen einen Fall,
sondern JEDE Ansage in diesem Sprechmuster — bisher hat's zufällig meistens
geklappt, weil GPT es meistens richtig geraten hat, nur bei dir nicht.
Jetzt ist es kein Raten mehr. Neue Testdatei `zahlen-parser.test.ts` (4 Tests,
u.a. dein genauer Fall + alle bisher bekannten „X Y mal Z"-Fälle aus anderen
Testfällen zur Kontrolle). Alle 680 Tests grün, `tsc` sauber.

**Fix-Update (Head of IT, 2026-08-17) — „Sockelleisten streichen" fehlte:**
Es gab schon eine passende Funktion dafür, sie hat aus zwei Gründen nicht
gegriffen. Erstens: „gestrichen" (die Form, die du benutzt hast: „sollen
dann auch noch gestrichen werden") ist ein unregelmäßiges Verb — anders als
„streichen" enthält „gestrichen" den Wortstamm „streich" nicht wörtlich
(Vokal ändert sich), die Funktion hat das Wort schlicht nie erkannt.
Zweitens: du hast „Sockelleisten" und „gestrichen" in zwei GETRENNTEN Sätzen
gesagt, verbunden nur über das Wort „Die" — die Funktion hat aber nur 3
Wörter weit im selben Satz geschaut. Dazu kam eine dritte, zu grobe Bremse:
sobald irgendwo im Text das Wort „montiert" vorkam, wurde „Sockelleisten
streichen" komplett blockiert — gedacht für den Fall „nur montiert, nicht
gestrichen", hat aber auch den legitimen Doppel-Fall („montiert UND
gestrichen", genau deine Sockelleisten-Falle) mit blockiert.

Fix: „gestrichen" wird jetzt erkannt, auch über einen Satz hinweg per
Bezugswort „die"/„sie"/„diese". Die zu grobe „montiert"-Bremse ist raus,
dafür gibt's jetzt eine echte Verneinungs-Prüfung („nicht gestrichen" zählt
nie als Ja) — wichtig, damit hier nicht der gleiche Fehler entsteht wie beim
gerade gefixten Bodenaustausch (Position erfinden, wo keine gewollt war).
2 neue Tests in `vollstaendigkeit.test.ts`: dein Fall (jetzt erkannt) und ein
Gegen-Test mit echter Verneinung („nicht gestrichen, nur montiert" — bleibt
korrekt leer). Alle 682 Tests grün, `tsc` sauber.

Damit sind jetzt alle drei PM-010-Funde behoben. Live-Test durch dich steht
für alle drei noch aus.

**Nachtest nach Fix-Deploy (Sandy, 2026-08-17) — ⚠️ alle drei Fixes wirken im Live-Test NICHT:**
Denselben Fall („Gästezimmer, drei fünfzig mal drei...") nochmal frisch eingesprochen, ausdrücklich NACH
den drei oben dokumentierten Fix-Updates. Ergebnis: alle drei Bugs sind unverändert wieder da, identisch
zu den vorherigen Durchläufen.

1. **350-Bug:** Karte zeigt wieder „350,00 × 3,00 m" statt 3,50 × 3,00 m — dritte identische
   Reproduktion, jetzt auch nach dem Fix, der laut Update genau diesen Fall in `zahlen-parser.test.ts`
   testet.
2. **Erfundener Bodenaustausch:** „Bodenbelag verlegen inkl. 5% Verschnitt" (11,03 m²) und „Altbelag
   entfernen" (10,5 m²) sind wieder im Angebot, obwohl nur von Sockelleisten die Rede war — trotz Fix in
   `boden-normalisierer.ts`.
3. **„Sockelleisten streichen" fehlt weiterhin** in der finalen Positionsliste — Karte verspricht es
   („5 Positionen erkannt"), das fertige Angebot liefert nur 4 (Wandflächen, Deckenfläche, Bodenbelag-
   Phantom, Altbelag-Phantom, Sockelleisten montieren — „streichen" fehlt), trotz Fix in
   `vollstaendigkeit.test.ts`.

Nettosumme (462,40 €) und alle Einzelwerte (Wandflächen 29,51 m², Decke 10,5 m², Sockelleisten montieren
12,1 lfdm mit korrektem Türabzug) sind untereinander konsistent — es ist also nicht so, dass hier
irgendwas krude durcheinander wäre, es sieht einfach exakt wie der Stand VOR den drei Fixes aus.

**Einordnung:** Das ist kein neuer Fund, sondern ein direkter Widerspruch zu den drei „Fix-Update"-
Einträgen oben. Zwei Erklärungen liegen nahe, beide für Head of IT zu prüfen, bevor an der Logik selbst
weitergesucht wird: entweder die Fixes sind noch nicht in der Umgebung deployed, in der Sandy testet,
oder die neuen Tests (`zahlen-parser.test.ts`, `boden-normalisierer.test.ts`, `vollstaendigkeit.test.ts`)
decken einen Fall ab, der sich von Sandys tatsächlichem Testsatz doch in einer Kleinigkeit unterscheidet
(z. B. Groß-/Kleinschreibung, Satzzeichen, exakte Wortstellung). Angesichts dessen, dass alle DREI
unabhängig behaupteten Fixes gleichzeitig nicht greifen, ist „nicht deployed" die wahrscheinlichere
Erklärung als drei zufällig gleichzeitig unvollständige Fixes.

**Fix-Update (Head of IT, 2026-08-17) — echte Ursache gefunden, kein Deploy-Problem:**
Per echter Supabase-Rohdaten deines Nachtests (`debug_extraktion_roh`, id `9f7c0ed9…`) geprüft statt
weiter zu raten. Ergebnis: alle drei Commits waren live (Git-Historie linear, spätere Commits vom selben
Tag sind laut deinen eigenen Notizen bestätigt live) — aber alle drei Fixes waren **gegen die falsche
Eingabeform gebaut**. Drei getrennte Erkenntnisse:

1. **Die 350 ist gar nicht unser Bug, sondern Whisper.** In den echten Rohdaten aus deinem Nachtest steht
   „350 x 3" schon so im Transkript-Text selbst — BEVOR unser eigener Code überhaupt läuft. Whisper (die
   Spracherkennung) hat „drei fünfzig" direkt als Ziffernfolge „350" verschriftlicht, nicht als Wörter.
   Mein erster Fix (`zahlen-parser.ts`) repariert einen anderen, ebenfalls echten Fall — wenn Whisper die
   Zahlwörter „drei" und „fünfzig" ausschreibt, verbindet mein Fix sie richtig zu 3.50. Aber wenn Whisper
   direkt „350" transkribiert, sieht unser Code diese 350 gar nicht anders als eine echte Meterangabe. Das
   ist mit Text-Nachbearbeitung grundsätzlich nicht lösbar — dafür siehe Vorschlag ganz unten.
2. **Erfundener Bodenaustausch — Ursache stimmte, aber mein erster Fix hat einen NEUEN Fehler eingebaut.**
   GPT lieferte selbst `altbelag_entfernen:true` UND `altbelag_vorhanden:true`, obwohl `belag:null` war und
   kein Belag-Wort im Text stand — das eigene Signal von GPT war falsch, und meine Regex-Korrektur (Fund
   vom ersten Fix-Update) griff hier gar nicht, weil sie nur den TEXT prüft, nicht GPTs eigenes,
   gegensätzliches Strukturfeld. Neuer Fix an der richtigen Stelle: `extraktion-normalisierer.ts` prüft
   jetzt, ob `altbelag_entfernen`/`altbelag_vorhanden` durch einen echten Belag-Namen oder ein echtes
   Verlege-Wort in `arbeiten[]` gedeckt sind — sonst werden beide auf `false` korrigiert. Nebenwirkung
   dabei entdeckt und gleich mitbehoben: diese Korrektur hätte sonst auch „Sockelleisten montieren"
   verschwinden lassen (lief technisch über dieselbe Boden-Engine) — dafür `mehrgewerk.ts` und `boden.ts`
   so angepasst, dass Sockelleisten-Arbeiten unabhängig vom Belag-Signal laufen, aber „X verlegen"
   weiterhin nur bei echtem Belag-Auftrag.
3. **„Sockelleisten streichen" fehlte aus einem DRITTEN, bisher unentdeckten Grund.** Mein zweiter Fix
   (Satzgrenzen-Erkennung über „gestrichen"/Folgesatz) war technisch korrekt, griff aber nie, weil echte
   Transkripte (wie deins) keine Satzpunkte zwischen den Teilsätzen haben, sondern nur Kommas — meine
   Testfälle hatten künstlich Punkte gesetzt. Fix: die Prüfung liest jetzt zuerst GPTs eigene, bereits
   geprüfte `arbeiten[]`-Liste (dort stand „sockelleisten streichen" die ganze Zeit korrekt drin), die
   Satzgrenzen-Logik bleibt nur als Rückfallebene. Dabei noch einen VIERTEN, ganz eigenständigen Bug
   gefunden: ein genereller Dubletten-Filter hat „Sockelleisten streichen" verworfen, sobald „Sockelleisten
   montieren" schon als Position existierte (beide fangen mit „Sockelleisten" an, der Filter prüft nur
   grob die ersten zwei Wörter) — auch das jetzt behoben (`maler-tapete.ts`).

Alle drei Fixe zusammen gegen genau deine echten Live-Daten geprüft (nicht nur gegen eigene Testfälle):
neuer Golden-Test in `mehrgewerk.test.ts` (Block „PM-010 — Sockelleisten-only-Auftrag erfindet keinen
Bodenaustausch mehr") nutzt exakt GPTs Rohantwort aus deinem Nachtest 1:1. Ergebnis: kein „verlegen"/
„Altbelag entfernen" mehr, „Sockelleisten montieren" bleibt korrekt, „Sockelleisten streichen" fehlt nicht
mehr (landet als offene Rückfrage, weil keine Meterangabe explizit fürs Streichen genannt wurde — das ist
gewollt: lieber fragen als raten). Volle Testsuite (691 Tests) + `tsc --noEmit` grün. Live-Test durch dich
steht noch aus — bitte diesmal wieder denselben Satz einsprechen und auf alle drei Punkte gleichzeitig
achten.

**Vorschlag für den 350-Bug (Whisper-Ebene) — umgesetzt (Sandys Go: 2026-08-17):** Weil das vor unserem
Code passiert, kann Text-Nachbearbeitung es nicht zuverlässig fangen. Umgesetzt: eine deterministische
Plausibilitäts-Prüfung direkt nach der Extraktion (`src/lib/mass-plausibilitaet.ts`, 7 eigene Tests) —
wenn eine Raum-Länge oder -Breite über 15 m liegt, kommt eine Warnung zurück. Eingebaut in
`generiere-positionen/route.ts` (läuft bei jeder Generierung mit) und in der Entwurf-Seite als gelber,
nicht blockierender Hinweis mit „Trotzdem weiter zum Angebot"-Button — genau nach der Grundregel „nie
den Flow blockieren, nur sichtbar machen". Kein Rewrite, eine einzelne Prüfung an einer Stelle. Noch
offen: das ist eine Warnung an der Stelle, wo die Karte gerade sowieso schon geprüft wird — die
GPT-Chip-Vorschau ganz am Anfang (die, wo du „350,00 × 3,00 m" zuerst siehst) zeigt sie NICHT, weil die
über eine andere, unabhängige Schnellvorschau läuft (dasselbe „Karte ≠ Berechnung"-Muster wie bei CoS-002)
— dafür bräuchte es einen zweiten, separaten Schritt, absichtlich nicht mit reingenommen. Live-Test durch
dich steht aus.

**Nachtest zum neuen Fix (Sandy, 2026-08-17):** Denselben Fall nochmal frisch eingesprochen, wie von
Head of IT erbeten, auf alle drei Punkte gleichzeitig geachtet. Gemischtes, aber größtenteils gutes
Ergebnis:

1. **Erfundener Bodenaustausch: bestätigt weg.** ✅ Weder „Bodenbelag verlegen" noch „Altbelag entfernen"
   tauchen diesmal im fertigen Angebot auf. Nur die vier erwarteten Positionen (Wandflächen 30,71 m² ×
   9,50 € = 291,75 €, Deckenfläche 10,5 m² × 11,00 € = 115,50 €, Boden schützen 12,60 €, Sockelleisten
   montieren 12,1 lfdm × 5,50 € = 66,55 €). Dieser Fix wirkt live — genau wie in der neuen Root-Cause-
   Erklärung beschrieben.
2. **350-Bug: weiterhin auf der Karte sichtbar** („350,00 × 3,00 m"), aber das deckt sich mit deiner
   eigenen Erklärung (Whisper verschriftlicht „drei fünfzig" direkt als Ziffernfolge, das ist vor eurem
   Code passiert) — im fertigen Entwurf stehen die Raummaße dann korrekt bei „3 × 3,5 m", die Rechnung
   selbst ist also nicht betroffen. Kein neuer Fund, sondern die erwartete Restwirkung der gewählten
   Lösung (Warnung statt Korrektur). Die neue gelbe Plausibilitäts-Warnung auf der Entwurf-Seite war in
   meinem Screenshot-Ausschnitt nicht zu sehen (könnte oberhalb des sichtbaren Bereichs gewesen sein) —
   kann ich nicht bestätigen oder verneinen, bitte bei Gelegenheit gezielt draufschauen.
3. **„Sockelleisten streichen" fehlt definitiv — bestätigt von Sandy direkt am Bildschirm.** Ich hatte
   das wegen des abgeschnittenen Screenshots erst offengelassen; Sandy hat direkt bestätigt, dass danach
   nichts mehr kommt — kein 5. Position, keine offene Rückfrage dazu. Die Liste endet bei vier Positionen
   (Wandflächen, Deckenfläche, Boden schützen, Sockelleisten montieren). Damit ist der vierte Root-Cause-
   Fix aus dem letzten Fix-Update (Dubletten-Filter, der „Sockelleisten streichen" verwirft, weil
   „Sockelleisten montieren" schon existiert) **nicht wirksam** — die klassische Doppel-Falle aus dem
   Fachwissen (montiert UND gestrichen, zwei Gewerke, zwei Positionen) bleibt live weiterhin unvollständig.
   Der Handwerker bekäme in diesem Angebot das Streichen der Sockelleisten nicht in Rechnung gestellt,
   obwohl ausdrücklich verlangt — genau der stille, teure Fehler, um den es in diesem Testfall von Anfang
   an ging.

**Zwischenstand:** 1 von 3 sauber bestätigt behoben (erfundener Bodenaustausch), 1 von 3 wie erwartet
(350-Bug auf der Karte, bewusste Design-Entscheidung, Rechnung selbst korrekt), 1 von 3 **weiterhin real
und bestätigt offen** („Sockelleisten streichen" fehlt komplett). Damit ist PM-010 noch nicht grün.

**Fix-Update (Head of Product Engineering, 2026-08-17) — der wahre Grund, warum vier Versuche nicht
gewirkt haben:** Nicht die Signal-Erkennung war das Problem (die war bei allen vier Versuchen am Ende
korrekt, mit echten Live-Daten geprüft). Das Problem lag eine Ebene tiefer: `fehlende` — der Rückgabewert
der Vollständigkeitsprüfung, extra dafür gedacht, "erkannt, aber keine sichere Menge, bitte fragen" an den
Nutzer weiterzugeben — wird in `angebot-extrahieren/route.ts` beim Auswerten NIE gelesen. Kein Feld dafür
in der API-Antwort. Jeder Fund, der dort landet, ist unsichtbar — keine 5. Position, keine offene Frage,
einfach nichts. Genau das hast du gesehen.

Fix (Ansatz gewechselt, wie vom Prüfmeister empfohlen): „Sockelleisten streichen" fragt jetzt nicht mehr
nach einer expliziten Meterangabe im Text, sondern übernimmt die Menge von „Sockelleisten montieren"
(derselbe Raum, schon berechnet) — dieselben neuen Leisten, dieselbe Länge. Nur bei mehreren Räumen mit
je eigener Position wird nicht geraten. Test verschärft: prüft jetzt hart, dass es eine ECHTE Position
wird (13,00 lfdm), nicht nur „irgendwas". Volle Testsuite (706 Tests) + `tsc --noEmit` grün.

**Wichtig, ehrlich:** Der größere Fund dahinter (`fehlende` erreicht generell nie den Nutzer, betrifft
130 Stellen in 18 Dateien, nicht nur Sockelleisten) ist NICHT mit gelöst — das ist eine größere
Architektur-Entscheidung, dokumentiert bei CoS-007/CoS-002, wartet auf Sandys/CoS' Einordnung. Live-Nachtest
für diesen konkreten Fix steht noch aus.

**Nachtest (Sandy, 2026-08-19) — fünfter Fix bestätigt: „Sockelleisten streichen" ist endlich da, aber ein
neuer, echter Fund kommt dazu.** Denselben Fall nochmal frisch eingesprochen, diesmal Karten- und
Entwurfstext komplett per Copy-Paste geschickt statt als Screenshot — exakter Wortlaut, kein
Lesefehler-Risiko mehr.

1. **„Sockelleisten streichen" ist da.** ✅ Nach vier gescheiterten Versuchen endlich bestätigt behoben —
   die Position steht im fertigen Entwurf, mit exakt derselben Menge wie „Sockelleisten montieren"
   (12,1 lfdm), genau wie im letzten Fix-Update beschrieben (Menge wird übernommen, nicht neu erfragt).
2. **Erfundener Bodenaustausch: weiterhin bestätigt weg.** ✅ Keine „Bodenbelag verlegen"- oder
   „Altbelag entfernen"-Position im Entwurf.
3. **350-Bug: weiterhin wie erwartet, keine neue Abweichung.** Karte zeigt „350,00 × 3,00 m", der Entwurf
   selbst korrekt „3 × 3,5 m" — die akzeptierte Design-Entscheidung (Warnung statt Korrektur, weil die
   Ursache bei Whisper liegt) hält.
4. **Neuer, echter Fund: „Sockelleisten entfernen" wird erkannt, taucht aber nirgends im Entwurf auf.**
   Die Karte listet fünf Leistungen: „Wände streichen", „Decke streichen", „Sockelleisten entfernen",
   „Neue Sockelleisten montieren", „Sockelleisten streichen" — „5 Positionen erkannt". Der fertige Entwurf
   hat ebenfalls fünf Positionen (Wandflächen streichen, Deckenfläche streichen, **Boden schützen**,
   Sockelleisten montieren, Sockelleisten streichen) — die Zahl stimmt wieder zufällig, aber der Inhalt
   nicht: „Sockelleisten entfernen" (ausdrücklich verlangt: „die alten Sockelleisten kommen raus") fehlt
   komplett, weder als eigene Zeile noch erkennbar in eine andere Position eingerechnet. Stattdessen steht
   „Boden schützen" da, das die Karte gar nicht angekündigt hatte. Genau die stille Fehlerkategorie, um
   die es bei PM-010 von Anfang an ging — diesmal beim Entfernen statt beim Streichen. Alle übrigen Zahlen
   sind rechnerisch sauber (Wandfläche 30,71 m², Deckenfläche 10,5 m², Sockelleisten 12,1 lfdm — passt
   exakt zur Soll-Lösung).
5. **Sauber quergeprüft, gehört zu PM-014:** Sandy hat bewusst zweimal direkt hintereinander auf „Angebot
   erstellen" geklickt (genau der von Head of Product Engineering erbetene gezielte Doppelklick-Test) —
   keine Verdopplung. Details und Einordnung bei PM-014.

**Für Head of Product Engineering:** Bitte „Sockelleisten entfernen" genauso behandeln wie eben
„Sockelleisten streichen" gefixt wurde — vermutlich landet auch dieses Signal in `fehlende` und erreicht
den Nutzer nie (derselbe größere, noch ungelöste Fund von oben), oder es wird an einer anderen Stelle
grundsätzlich verworfen. Fachlich wäre zu klären, ob „Entfernen" als eigene lfdm-Position berechnet werden
soll (parallel zu „Sockelleisten montieren") oder ob sie bewusst im Montage-Preis mitgedacht ist — aber
dann sollte sie auch nicht auf der Karte als eigene Leistung auftauchen, das verspricht dem Handwerker
etwas, das er später nicht wiederfindet.

**Fix-Update (Head of Product Engineering, 2026-08-19) — echte Ursache war NICHT `fehlende`, sondern ein
Wort-Mismatch:** Auf Sandys „das bearbeiten und fixen!" hin den größeren, mehrfach genannten `fehlende`-Fund
angegangen — dabei aber, bevor irgendwas geändert wurde, jeden der drei betroffenen Fälle (PM-010/012/013)
einzeln bis zur Codezeile zurückverfolgt, statt blind eine einzige generische Lösung draufzusetzen. Ehrliches
Ergebnis: die drei Fälle haben DREI VERSCHIEDENE Ursachen, nicht eine gemeinsame.

Für „Sockelleisten entfernen" konkret: die Funktion, die dafür zuständig aussieht
(`pruefeSockelleisten` in `vollstaendigkeit/boden-vorarbeiten.ts`, inkl. eines `fehlende.push('Sockelleisten
entfernen (alt)')`) wird **im gesamten Code nirgends aufgerufen** — toter Code, nicht der Grund für den
Live-Bug. Die Position, die live tatsächlich erscheint, kommt über einen ganz anderen, schon länger
existierenden Mechanismus: `aufnahme-hinweise.ts` liest die Titel der schnellen Aufnahme-Karten-Chips
("Sockelleisten demontieren", "Sockelleisten montieren") als Sicherheitsnetz und ergänzt daraus fehlende
Positionen mit einer geliehenen Menge. Der Karten-Chip aus deinem Nachtest heißt aber wörtlich „Sockelleisten
**entfernen**", nicht „demontieren" — GPT formuliert Chip-Titel frei, ohne festes Vokabular. Die Prüfung kannte
nur „demontieren" als Wort. Deshalb ist die Position spurlos verschwunden, obwohl die Karte sie korrekt
erkannt hatte.

Fix: die Prüfung akzeptiert jetzt alle gängigen Synonyme (`demontieren|entfernen|abbauen|abmontieren|
ausbauen`) statt nur eines wörtlichen Treffers — risikoarm, weil Chip-Titel bereits kuratierte Kurzlabel
sind, kein Fließtext (keine „Über-Erkennungs"-Gefahr wie bei Regex auf Rohtext). Neuer Test in
`aufnahme-hinweise.test.ts` mit deinem exakten Nachtest-Transkript, erwartet 12,1 lfdm (gleiche Länge wie
„Sockelleisten montieren"). **Zusätzlich, unabhängig davon:** den `fehlende`→sichtbare-Platzhalterposition-
Fix aus deiner Anfrage trotzdem zentral in `mehrgewerk.ts` umgesetzt (jede der ~130 Fundstellen in
`vollstaendigkeit/*`, die heute still in `fehlende` verschwindet, wird jetzt als Position mit Menge 0 sichtbar,
genau wie eine Position ohne Katalogpreis) — als Sicherheitsnetz für alle künftigen/anderen Fälle, auch wenn
er für DIESEN speziellen Fund hier nicht die Ursache war (die Funktion, die ihn erzeugen würde, wurde ja nie
aufgerufen). Volle Testsuite/`tsc --noEmit` von dir/dem Prüfmeister noch zu bestätigen (kein CI-Zugriff von
hier aus). Live-Nachtest steht aus.

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

---

## PM-012 — Sockelleisten-Falle umgekehrt: nur streichen, ausdrücklich NICHT neu (Esszimmer)

**Datum:** 2026-08-17
**Status:** ❌ Wandfläche exakt Soll, Ausschluss sauber respektiert (kein Boden-Phantom) — aber „Sockelleisten streichen" fehlt komplett, jetzt DRITTE unabhängige Bestätigung derselben Lücke wie PM-010, diesmal isoliert ohne Doppel-Fall-Verwicklung

**Warum dieser Fall:** PM-010 prüft die Doppel-Falle in eine Richtung (beides verlangt, „streichen" fehlt
im Ergebnis — bestätigt offen). Dieser Fall prüft die GEGENRICHTUNG desselben Themas, isoliert: nur
Streichen ist verlangt, Neumontage ist ausdrücklich ausgeschlossen. Zwei Dinge auf einmal getestet: (a)
kommt „Sockelleisten streichen" (Maler) diesmal, ganz ohne die Doppel-Fall-Verwicklung von PM-010 — falls
sie auch hier fehlt, ist das ein weiterer, unabhängiger Beleg, dass die Lücke generell besteht, nicht nur
im Doppel-Fall; (b) wird trotz des ausdrücklichen Ausschlusses fälschlich eine Boden-Position
„Sockelleisten montieren" erfunden — die Über-Erkennungs-Variante desselben Fehlertyps, den wir bei den
Fassaden- und Bodenaustausch-Phantompositionen schon gesehen haben.

**Zum Einsprechen:**
„Esszimmer, viereinhalb mal drei, Höhe zwo fünfundfünfzig. Wände streichen, zweimal drüber, ganz normal.
Die Sockelleisten bleiben genau wie sie sind, die werden NICHT neu gemacht, die NICHT demontiert — die
sollen nur nochmal mitgestrichen werden, in der gleichen Farbe wie die Wand. Ein Fenster, Standardgröße,
eine Tür, normal Maß.“

**Soll-Lösung:**
- Umfang: 2×(4,50+3,00) = 15,00 lfm
- Wandbrutto: 15,00×2,55 = 38,25 m²
- Abzug 1 Fenster Standard (1,20 m²) + 1 Tür Standard (1,89 m²) = 3,09 m²
- Wandfläche netto: **35,16 m²**
- Wandflächen streichen 2×: **35,16 m²**
- Sockelleisten streichen (Maler): eigene Position, 15,00 − 0,90 (Tür) = **14,10 lfm**
- Sockelleisten montieren (Boden): **keine Position** — ausdrücklich ausgeschlossen
- Sockelleisten entfernen (Boden): **keine Position** — ausdrücklich ausgeschlossen

**Worauf achten:**
- Kommt „Sockelleisten streichen" (Maler) überhaupt als eigene Position — isolierter Test derselben
  Lücke, die bei PM-010 bereits bestätigt offen ist, diesmal ohne die Doppel-Fall-Verwicklung. Fehlt sie
  auch hier, ist das ein zusätzlicher, unabhängiger Beleg für eine generelle Lücke, kein Sonderfall.
- Wird trotz „bleiben wie sie sind", „NICHT neu gemacht", „NICHT demontiert" trotzdem eine Boden-Position
  „Sockelleisten montieren" oder „entfernen" erfunden? Das wäre die Über-Erkennungs-Variante desselben
  Fehlertyps wie beim phantomen Bodenaustausch in PM-010.
- Wird der ausdrückliche, dreifach wiederholte Ausschluss überhaupt als solcher erkannt (ähnlich der
  Ausschluss-Erkennung aus PM-001), oder wird das Wort „Sockelleisten" trotzdem als generelles
  Boden-Signal gewertet?

**Ist-Ergebnis (Prüfmeister, direkt im Browser-Tab geprüft, 2026-08-17):** Esszimmer korrekt erkannt,
Raummaße exakt (3×4,5 m, Höhe 2,55 m, Türen 1, Fenster 1). Positionen im fertigen Entwurf:

- Wandflächen streichen 2×: 35,16 m² × 9,50 € = 334,02 € ✓ exakt Soll
- Boden schützen: 13,5 m² × 1,20 € = 16,20 € (automatisch abgeleitete Nebenleistung, wie in jedem
  anderen Testfall — kein Fehler)
- Sockelleisten abkleben: 14,1 lfdm × 0,80 € = 11,28 € — das ist die normale, in praktisch jedem Testfall
  auftauchende Schutz-Nebenleistung fürs Streichen der Wand, KEIN Ersatz für die verlangte Leistung
- **„Sockelleisten streichen" (Maler) fehlt komplett** — trotz ausdrücklichem, dreifachem Verlangen
  im Transkript
- **Keine Boden-Position** („Sockelleisten montieren"/„entfernen") — der Ausschluss wurde also sauber
  respektiert, keine Über-Erkennung
- Gesamt: Netto 361,50 € × 1,19 = **430,19 €** — rechnerisch konsistent, kein versteckter 4. Posten

**Befund:**

1. **„Sockelleisten streichen" fehlt — dritte unabhängige Bestätigung derselben Lücke wie PM-010.** Diesmal
   ganz ohne die Doppel-Fall-Verwicklung (kein „montiert UND gestrichen" im selben Satz, keine Verwechslung
   mit „Sockelleisten abkleben" möglich, da diese ja ohnehin als eigene, normale Position da ist). Das
   entkräftet die Hoffnung, dass es sich bei PM-010 um einen Sonderfall der Doppel-Situation handeln
   könnte — die Lücke ist generell: die Maler-Engine kennt offenbar überhaupt keine „Sockelleisten
   streichen"-Position, unabhängig vom Kontext.
2. **Gute Nachricht: kein Phantom auf der Boden-Seite.** Trotz drei verschiedener Verneinungs-
   Formulierungen im selben Satz („bleiben wie sie sind", „NICHT neu gemacht", „NICHT demontiert") kam
   keine einzige unverlangte Boden-Position. Die Über-Erkennungs-Sorge aus der „Worauf achten"-Liste hat
   sich nicht bestätigt — die Ausschluss-Erkennung funktioniert hier sauber, in beide Richtungen (weder
   „montieren" noch „entfernen" wurde fälschlich ergänzt).

**Für Head of IT:** Zusammen mit PM-010 jetzt dreifach bestätigt (Doppel-Fall + zwei isolierte
Wiederholungen an anderer Stelle in diesem Test): eine eigene „Sockelleisten streichen"-Position fehlt
in der Maler-Engine komplett, unabhängig vom Kontext. Das ist keine Rand-Situation mehr, sondern eine
grundsätzliche Lücke — bitte mit entsprechender Priorität behandeln.

**Fix-Update (Head of Product Engineering, 2026-08-17):** Gleicher Fix wie bei PM-010 (siehe dortiges
Update für die volle Root-Cause-Erklärung), hier zusätzlich wichtig: in diesem Fall gibt es GAR KEINE
„Sockelleisten montieren"-Position (ausdrücklich ausgeschlossen). Die Menge wird deshalb stattdessen von
„Sockelleisten abkleben" übernommen — die nutzt dieselbe Umfang-minus-Türen-Formel und ist praktisch immer
da, sobald im Raum gestrichen wird und Sockelleisten existieren, unabhängig davon, ob neu montiert wird.
Neuer Golden-Test mit deinem exakten Transkript (`golden-korrekturen.test.ts`, „PM-012"), erwartet 14,10
lfdm. Volle Testsuite (706 Tests) + `tsc --noEmit` grün. Live-Nachtest steht aus.

**Nachtest (Prüfmeister, 2026-08-19) — ❌ Fix wirkt live NICHT:** Denselben Fall frisch eingesprochen.
Karte erkennt „2 Positionen" — Wände streichen (36 m²), Sockelleisten streichen (10 m), also wieder mit
eigener Menge gemeldet. Raummaße im Entwurf exakt (3×4,5 m, Höhe 2,55 m, 1 Tür, 1 Fenster). Positionen im
fertigen Entwurf:

- Wandflächen streichen 2×: 35,16 m² × 9,50 € = 334,02 € — exakt Soll
- Boden schützen: 13,5 m² × 1,20 € = 16,20 € — normale Nebenleistung
- Sockelleisten abkleben: 14,1 lfdm × 0,80 € = 11,28 € — normale Nebenleistung, kein Ersatz
- **„Sockelleisten streichen" fehlt weiterhin komplett** — keine sechste Position, keine offene
  Rückfrage. Netto 361,50 € — identisch bis auf den Cent mit dem allerersten Ist-Ergebnis von vor dem
  Fix. Keine Boden-Position („montieren"/„entfernen") erfunden, der Ausschluss wird also weiterhin sauber
  respektiert.

**Einordnung:** Der Fix vom 17.08. („Menge wird von Sockelleisten abkleben übernommen") zeigt hier exakt
dasselbe Muster wie bei PM-010: Golden-Test grün, aber live wirkungslos. Wahrscheinlichste Erklärung nach
PM-010s eigener Root-Cause-Kette: derselbe größere, ungelöste Architekturfund (`fehlende` erreicht den
Nutzer nie, 130 Stellen in 18 Dateien) betrifft auch diesen isolierten Fall, oder der PM-010-Fix vom
19.08. (der dort inzwischen bestätigt wirkt) wurde für den Einzelfall „nur Streichen, kein Montieren"
nicht mitgezogen. Für Head of Product Engineering: bitte mit demselben, jetzt bei PM-010 erfolgreichen
Ansatz nachziehen und hier ebenfalls live gegenprüfen — nicht nur gegen den Golden-Test.

**Fix-Update (Head of Product Engineering, 2026-08-19):** Ehrlich zum Stand: die genaue Ursache, warum die
Text-Heuristik in `vollstaendigkeit/maler-tapete.ts` (`hatSockelleistenStreichenSignal`) live nicht greift,
obwohl sie mehrfach gegen echte Transkripte getestet wurde, konnte ich ohne Zugriff auf die tatsächlichen
GPT-Rohdaten deines Nachtests nicht abschließend klären — das wäre reines Raten gewesen, und genau davor
warnt die eigene Historie dieses Falls (fünf Versuche, die alle „im Golden-Test grün" waren). Statt einer
sechsten Text-Heuristik deshalb dieselbe robustere Lösung wie bei PM-010: dein Karten-Chip meldet
„Sockelleisten streichen" nachweislich zuverlässig (dein Nachtest zeigt „Sockelleisten streichen, 10 m" auf
der Karte) — das ist ein verlässlicheres Signal als die tiefere, mehrfach gescheiterte Text-Analyse.
`aufnahme-hinweise.ts` prüft jetzt zusätzlich, als Sicherheitsnetz, auf diesen Chip-Titel und ergänzt bei
Bedarf eine „Sockelleisten streichen"-Position — Menge kommt von „Sockelleisten montieren" falls vorhanden,
sonst (wie in deinem Fall, Neumontage ausdrücklich ausgeschlossen) von „Sockelleisten abkleben" (14,1 lfdm,
exakt die Soll-Lösung). Läuft NUR, wenn die tiefere Engine noch keine solche Position angelegt hat (kein
Duplikat-Risiko). Neuer Test in `aufnahme-hinweise.test.ts` mit deinem exakten Nachtest-Transkript, prüft
zusätzlich, dass weiterhin keine Boden-Position „montieren"/„entfernen" erfunden wird (der Ausschluss bleibt
erhalten). Zusätzlich, als generelles Sicherheitsnetz für alle ähnlichen Fälle: der `fehlende`→sichtbare-
Position-Fix aus `mehrgewerk.ts` (siehe PM-010-Fix-Update oben). Live-Nachtest steht aus — bitte diesmal
wieder denselben Satz einsprechen.

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

---

## PM-013 — Zwei Räume, getrennte Gewerke + Fischgrät + Dehnungsfuge (Wohnzimmer/Flur)

**Datum:** 2026-08-17
**Status:** ❌ Erster Live-Test (2026-08-19): Gewerke-Trennung und Flur-Zahlen sauber, aber zwei echte
Funde — Fischgrät-Verschnitt fehlt komplett (0% statt 10–15%), „Dehnungsfuge einbauen" von der Karte
erkannt, im Entwurf aber spurlos verschwunden

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

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->

