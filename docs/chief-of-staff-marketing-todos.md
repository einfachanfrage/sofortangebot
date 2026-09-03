# Chief of Staff ↔ Head of Marketing — Koordinations-Todos

Gemeinsame Datei von Chief of Staff und Head of Marketing (neue Stelle seit
17.08.2026 — erste Position im geplanten Marketing-Team, siehe
`docs/team-organigramm.md`). Hier landen Themen aus: Corporate Identity
(Logo, Farben, Typografie, Tonalität), Marketing-Materialien, Landingpage-
Content/Kampagnen, später auch Social Media/Blog, sobald diese Positionen
besetzt sind.

**Nicht hier rein:** In-Produkt-UI/UX und technisches Design-System (läuft
über `docs/design-check.md` mit dem Product Designer — Head of Marketing
und Product Designer stimmen sich bei Überschneidungen direkt über
`docs/marketing-design-austausch.md` ab).

**Ablauf:** Chief of Staff trägt neue Punkte ein, sobald sie entstehen.
Head of Marketing trägt nach Erledigung ein kurzes **Fix-Update** direkt
unter dem jeweiligen Punkt ein. Status-Zeile danach aktualisieren.

Jeder Punkt hat eine feste ID (CoS-M-XXX).

**Status-Zeichen:** ✅ erledigt & geprüft · 🟡 erledigt, noch nicht
nachgeprüft · ❌ offen · 🔵 Entscheidung von Sandy nötig · ⏳ wartet auf
Vorbedingung.

**Wichtige Governance-Regel:** CI-/Marken-Änderungen sind eine
Positionierungs-Entscheidung — die trifft nur Sandy (siehe
`docs/team-organigramm.md`, Abschnitt Sandy). Head of Marketing darf und
soll radikale Vorschläge machen, Umsetzung erst nach ihrer ausdrücklichen
Zustimmung. Entscheidungen, die auf Sandy warten, bitte zusätzlich kurz in
`docs/entscheidungen-fuer-sandy.md` eintragen (Chief of Staff übernimmt das
in der Regel).

**Datei-Sicherheit (aktualisiert 20.08.2026):** Der Speicherfehler bei
gleichzeitiger Bearbeitung ist projektweit jetzt zum 6. Mal aufgetreten
(zuletzt in `chief-of-staff-todos.md`). Ganz am Ende dieser Datei steht
jetzt eine feste Markierung (`<!-- ENDE DER DATEI -->`). Taucht beim Lesen
noch Text NACH dieser Markierung auf, ist das zweifelsfrei ein
Speicherfehler — bitte nicht selbst löschen, sondern kurz dem Chief of Staff
melden. Zusätzlich: neue Einträge wenn möglich ans Dateiende anhängen statt
mitten in bestehende Abschnitte zu schreiben. Voller Hintergrund:
CoS-013 in `chief-of-staff-todos.md`.

## Stand auf einen Blick (angelegt: 2026-08-17)

| ID | Thema | Status | Quelle |
|---|---|---|---|
| CoS-M-007 | Go-to-Market-Kanalplan (Kanäle, Anlauf, Stundenaufwand, Sachkosten, Erwartung) als Zulieferung für den Finanzplan | ❌ offen | Chief of Staff / Sandys Rückfrage zu den Szenarien, 2026-09-03 |
| CoS-M-001 | CI-Bestandsaufnahme + Richtungsvorschlag | ✅ komplett — Sandy hat mit „ok leg die CI fest" final bestätigt, Umsetzungsplan (Schritt 5) steht, Handoff an Product Designer über EX-M-005 | Sandys Ankündigung, 2026-08-17 |
| CoS-M-002 | Social-Media-Strategie Pre-Launch (Instagram/TikTok) | 🟡 Strategie + erster Content-Kalender fertig, Sandy hat Richtung bestätigt — Umsetzung (Dreh mit Clemens) läuft bei Sandy, eine Abhängigkeit offen (Warteliste-Landingpage) | Sandys Anfrage im Chat, 2026-08-19 |
| CoS-M-003 | Verbindliche Gestaltungsvorgabe für Instagram/TikTok-Posts, nach Sandys Kritik an ersten fertigen Posts | 🟡 Vorgabe umgesetzt, v1-Posts + zwei v2-Entwürfe in `docs/` gesichert; Sandy hat zusätzlich 9 neue Entwürfe im Chat gezeigt und Chief-of-Staff-Go bekommen — Abgleich mit `social-drafts-v2/` bei Head of Marketing offen | Sandy direkt im Chat, 2026-08-31 |
| CoS-M-004 | Design System — zwei Freigaben nötig (Sie/du, Funktionsfarben) | 🟡 Sie/du entschieden („immer du"), Funktionsfarben weiterhin 🔵 offen | Sandys Übergabe des PDFs, 2026-08-31 |
| CoS-M-005 | DER Slogan für Sofortangebot final festgelegt | ✅ entschieden — „Aufmaß fertig. Angebot fertig." | Sandy direkt im Chat, 2026-08-31 |

---

## CoS-M-001 — CI-Bestandsaufnahme + Richtungsvorschlag

**Datum:** 2026-08-17
**Status:** 🔵 Entscheidung von Sandy nötig — erster Auftrag der neuen Position

**Hintergrund:** Sandy möchte langfristig ein ganzes Marketing-Team aufbauen
(Social Media, Blog/Content, weitere — noch nicht besetzt). Der erste
Schritt dahin ist diese Position: jemand mit einem extrem klaren, cleanen,
aufgeräumten Ästhetik-Gefühl, der die aktuelle CI komplett neu denken darf.
Wichtig: **Vorschlagen ja, umsetzen erst nach Sandys ausdrücklicher
Zustimmung.**

**Konkrete Bitte:**
1. Aktuelle CI sichten — Landingpage, markenrelevante Teile des Produkt-UI,
   Logo, Farben, Typografie, vorhandene Marketing-Materialien — und in
   einfachen Worten zusammenfassen, wo sie heute steht (Stärken und
   Schwächen, nicht nur Kritik).
2. Eine klare Ästhetik-Richtung vorschlagen. Moodboard-/Referenz-Ebene
   reicht für den ersten Aufschlag, keine fertigen Assets nötig — dafür
   mit Begründung, nicht nur Geschmack („warum passt das zu Handwerkern,
   die schnell ein professionelles Angebot wollen").
3. Mit Product Designer abstimmen, welche Teile des Vorschlags das
   Produkt-UI/Design-System berühren würden (`docs/marketing-design-austausch.md`),
   damit der Vorschlag technisch umsetzbar ist, bevor er Sandy vorgelegt
   wird.
4. Vorschlag klar strukturiert vorlegen (Chief of Staff bündelt die
   Entscheidung zusätzlich in `docs/entscheidungen-fuer-sandy.md`, sobald
   ein konkreter Vorschlag steht).
5. Nach Sandys Zustimmung: Umsetzungsplan (was ändert sich wo, in welcher
   Reihenfolge, was ist eigene Arbeit vs. Abstimmung mit Product Designer).

**Fix-Update (Head of Marketing, 2026-08-17):** Schritt 1 (Bestandsaufnahme)
fertig — vollständige Analyse in `docs/marketing-ci.md`. Kurzfassung:
Tonalität ist bereits stark und bleibt Leitplanke; Farbpaar Gelb/Anthrazit
und das Logo-Umkehrsystem sind eine brauchbare Basis; aber die Marke hat
aktuell kein einziges echtes Bild-Asset (nur Textwortmarke + Standard-Emoji
als Icon-Ersatz), und die Typografie-Wahl wirkt nie bewusst final getroffen
(Variable heißt `--font-syne`, geladen wird aber Plus Jakarta Sans).
Zusätzlich technische Voraussetzung erkannt: Farb-/Typografie-Tokens
existieren laut DC-006 in `design-check.md`, werden aber kaum genutzt
(>1.900 hartkodierte Hex-Stellen) — das beeinflusst, wie schnell ein
Farb-Vorschlag später umsetzbar wäre. Dazu Rückfrage an Product Designer in
`docs/marketing-design-austausch.md` (EX-M-002) eingetragen.

**Fix-Update (Head of Marketing, 2026-08-18):** Sandy hat die
Bestandsaufnahme bestätigt. Schritt 2 (Richtungsvorschlag) fertig —
Arbeitstitel „Gerechnet, nicht geschätzt" als Bild: Sofortangebot soll wie
ein Präzisionswerkzeug wirken statt wie eine weitere gelbe Startup-App.
Konkret: Gelb-Nuance testen (`#D9A400` statt `#F5C400`), Typografie bewusst
entscheiden (Vorschlag Space Grotesk statt der nie final gewählten
Plus-Jakarta-Sans-Kombi), berechnete Maße in Mono-Zahlenschrift als
eigenständiges Markenmerkmal, Emoji durch selbst gezeichnetes
Werkzeug-Icon-Set ersetzen, ein echtes Logomark ergänzen (aktuell nur „sa"
als App-Icon). Volle Begründung + visuelles Moodboard in
`docs/marketing-ci.md` (Teil 2) und `moodboard.html` (an Sandy geschickt).
Vor der finalen Vorlage an Sandy fehlt noch Schritt 3: Rückmeldung von
Product Designer zur technischen Umsetzbarkeit — Rückfrage EX-M-003 in
`docs/marketing-design-austausch.md` eingetragen, Status bleibt ⏳ bis
diese da ist.

**Fix-Update (Head of Marketing, 2026-08-18, Feedback-Runde 1):** Sandy
findet die Richtung „super", zwei Nachbesserungen am Moodboard: (1)
Logomark war nicht erkennbar als Messwerkzeug — überarbeitet zu einem
klassischen Gliedermaßstab/Zollstock, jetzt in Hell- und Dunkel-Variante.
(2) Neue Off-White-Text-/Symbolfarbe (`#F7F7F5`) für dunkle Flächen
ergänzt, statt Reinweiß — dieselbe Farbe wie der helle Hintergrund
übernimmt auf Dunkel die Rolle von Weiß. Beides in `moodboard.html` und
`docs/marketing-ci.md` (Teil 2) aktualisiert, EX-M-003 an Product Designer
um beide Punkte ergänzt.

**Fix-Update (Head of Marketing, 2026-08-18, Feedback-Runde 2):** Sandy zur
Headline-Schrift: Space Grotesk „viel zu eckig", soll „flüssiger aussehen
und nicht standard, aber gleichzeitig klar" sein. Ersetzt durch
**Bricolage Grotesque** — weichere, fließendere Formen statt der starren
Space-Grotesk-Ecken, bleibt aber ein Grotesk (kein Bruch mit Inter/Mono)
und ist aktuell kein Font, den man auf jeder zweiten SaaS-Seite sieht.
Aktualisiert in `moodboard.html` und `docs/marketing-ci.md`.

**Fix-Update (Head of Marketing, 2026-08-18, Schritt 3 abgeschlossen):**
Product Designer hat EX-M-002 und EX-M-003 in
`docs/marketing-design-austausch.md` beantwortet: (1) Token-Aufräumung
(DC-006) läuft bereits unabhängig vom Ausgang dieses Vorschlags —
niedriger bis mittlerer einstelliger Tage-Bereich, danach ist die
Farbnuance eine Ein-Zeilen-Änderung. (2) Icon-Set-Empfehlung übernommen:
bewusst Marketing-/Landingpage-Scope, nicht ins Produkt-UI (bleibt bei
Lucide) — passt zur ursprünglichen Absicht. (3) Mono-Zahlenschrift nur für
berechnete Maße, nicht für Preise, ebenfalls übernommen (Begründung:
Signal „gerechnet, nicht geschätzt" soll an der Berechnung hängen bleiben,
nicht verwässern). Ein kleiner Nebenpunkt ist noch offen (EX-M-004: ob
Off-White-auf-Dunkel auch für Text/Icons im Produkt-UI sinnvoll wäre) —
blockiert die Vorlage an Sandy nicht, da rein produktseitige
Konsistenzfrage, keine Marketing-Entscheidung.

Damit ist Schritt 3 im Kern erledigt.

**Fix-Update (Head of Marketing, 2026-08-18, Feedback-Runde 3):** Logomark
noch nicht überzeugend — Sandy: „das erkennt kein Mensch" als Werkzeug.
Der Gliedermaßstab (v2) war trotz Detailtreue zu abstrakt für Icon-Größe.
Ersetzt durch **Logomark v3: ein Hammer** als volle Silhouette statt
dünner Linien — das universellste, unmissverständlichste Werkzeug-Symbol,
mit gelber Grifffläche als Markenfarben-Detail. Aktualisiert in
`moodboard.html` und `docs/marketing-ci.md`.

**Fix-Update (Head of Marketing, 2026-08-18, Feedback-Runde 4):** Der
Hammer war ein Missverständnis meinerseits — Sandy wollte gar kein
beliebiges Werkzeug, sondern ausdrücklich den Zollstock-/Maßband-Gedanken
aus v2, nur endlich erkennbar umgesetzt. **Logomark v4: das Maßband** als
geschlossene, kompakte Form statt dünner Linien — gelbe Bandkassette
(reale Maßband-Farbe) mit herausgezogenem Band und Endlasche, nur drei
Formen, keine kleinteiligen Maß-Striche mehr. Aktualisiert in
`moodboard.html` und `docs/marketing-ci.md`.

**Fix-Update (Head of Marketing, 2026-08-18, Feedback-Runde 5):** v4 immer
noch nicht erkennbar — das „Band" war nur eine dünne Linie. **Logomark
v5**: runde gelbe Rolle mit breitem, flachem Band inkl. zwei Skalenstrichen
und deutlich breiterem Haken am Ende, außerdem deutlich größer dargestellt
in `moodboard.html`, damit es sich besser beurteilen lässt.

**Fix-Update (Head of Marketing, 2026-08-18, Feedback-Runde 6):** Sandy hat
ein Referenzbild geschickt (Strich-Icon: Kreis-Kassette, offener
Feder-Bogen innen, Band mit Skalenstrichen, breiterer Endhaken).
**Logomark v6** direkt danach nachgebaut, gleiche Bauweise in unseren
Markenfarben. Aktualisiert in `moodboard.html`.

**Fix-Update (Head of Marketing, 2026-08-18, Logomark final):** Sandy hat
selbst die finale, polierte Version des Maßband-Logos geliefert und
freigegeben — „dann sind wir durch". Mit-Wortmarke- und Icon-only-Variante
in `moodboard.html` eingebaut. Damit ist CoS-M-001 inhaltlich vollständig
und von Sandy bestätigt (Bestandsaufnahme, Richtung, Farben, Typografie,
Icon-Set, Logomark).

Chief of Staff, bitte in `docs/entscheidungen-fuer-sandy.md` aufnehmen —
Schritt 4 auf meiner Seite abgeschlossen, danach folgt Schritt 5
(Umsetzungsplan: was ändert sich wo, eigene Arbeit vs. Abstimmung mit
Product Designer, inkl. offener Detailpunkte wie helle Logomark-Variante
und EX-M-004 aus `docs/marketing-design-austausch.md`).

**Chief-of-Staff-Update (2026-08-18):** Geprüft und in
`docs/entscheidungen-fuer-sandy.md` gebündelt — CoS-M-001 damit formal ✅.
Sehr saubere Arbeit über die gesamte CI-Bestandsaufnahme + Richtungsfindung:
Governance eingehalten (nur vorgeschlagen, nichts umgesetzt), technische
Umsetzbarkeit vorab mit Product Designer geklärt statt danach überrascht zu
werden, `moodboard.html` hält nur die jeweils aktuelle Version fest statt
alte Logomark-Iterationen anzusammeln.

**Ein technischer Punkt für Schritt 5, den noch niemand angesprochen hat:**
Beide Logomark-Bilder in `moodboard.html` sind als eingebettete
Base64-PNG-Rastergrafiken hinterlegt (Sandys eigene, freigegebene Lieferung
— keine Kritik an der Optik), keine Vektorgrafik. Für die eigentliche
Umsetzung (Favicon, App-Icon in mehreren Auflösungen, PDF-Kopf, Logo auf
hellem UND dunklem Grund, ggf. Druck) braucht es eine saubere SVG-Version,
sonst wirkt das Icon bei kleinen Größen unscharf und lässt sich nicht
sauber einfärben (z. B. für die noch offene helle Design-System-Variante).
Bitte in den Umsetzungsplan aufnehmen: Vektorisierung/Nachzeichnen des
Maßband-Logos als eigener kleiner Schritt, am besten in Abstimmung mit
Product Designer, bevor es in echten Code wandert.

**Fix-Update (Head of Marketing, 2026-08-18, Schritt 5 — CI final
festgelegt):** Sandy hat mit „ok leg die CI fest" direkt bestätigt (Chief
of Staff hatte den Entscheid parallel bereits in
`docs/entscheidungen-fuer-sandy.md` gebündelt — beides deckt sich).
Umsetzungsplan steht jetzt in `docs/marketing-ci.md` (Teil 3): zehn
Schritte in Reihenfolge, beginnend mit der laufenden Token-Aufräumung
(DC-006) als Vorbedingung für Farbe/Typografie, parallel dazu Icon-Set und
Logomark-Vektorisierung (inkl. der von Chief of Staff angemerkten
Notwendigkeit, Sandys Raster-Logo als SVG nachzuzeichnen, plus die noch
fehlende helle Variante), zum Schluss Mono-Zahlenschrift und
Off-White-Rollout. Klar getrennt: eigene Arbeit (Icon-Set-Gestaltung,
Logomark-Entwurf), Abstimmung mit Product Designer vor Code (Logomark-
Feinschliff, helle Variante, Favicon/App-Icon/PDF-Einbindung), reine
Product-Designer-/Engineering-Umsetzung (Farb-/Font-Token, Mono-Schrift).
Handoff an Product Designer läuft über `docs/marketing-design-austausch.md`
(EX-M-005).

**Noch offen:** Laufende Umsetzung selbst — wird ab jetzt über EX-M-005
und die jeweiligen Punkte in `docs/design-check.md` nachverfolgt, nicht
mehr über diese Datei. CoS-M-001 als Vorschlags-/Freigabe-Auftrag ist
damit inhaltlich, planerisch und mit Sandys expliziter Bestätigung
abgeschlossen.

---

## CoS-M-002 — Social-Media-Strategie Pre-Launch (Instagram/TikTok)

**Datum:** 2026-08-19
**Status:** 🟡 Strategie + erster Kalender fertig, Umsetzung läuft bei Sandy/Clemens

**Hintergrund:** Sandy will vor dem Launch (01.11. oder 01.12., noch nicht
final) schon organisch Traffic auf Instagram und ggf. TikTok aufbauen und
hat direkt im Chat gefragt, ob dafür eine neue Rolle nötig ist oder Head of
Marketing das übernehmen kann. Passt zu `vision-strategie.md`, die Social
Media bereits als bewussten, rein organischen Go-to-Market-Kanal festhält
(kein bezahltes Werbebudget zum Start).

**Rollenentscheidung (mit Sandy im Chat geklärt, keine neue Einstellung
nötig):** Head of Marketing übernimmt Strategie/Kalender/Skripte/Schnitt.
Clemens (Sandys Partner, selbst Handwerker, laut `design-check.md` DC-029
ohnehin als erster echter Testnutzer nach Gate 1 vorgesehen) wird das
Gesicht vor der Kamera. Sandy filmt/fotografiert ihn auf der Baustelle.
Eine dedizierte Social-Rolle wird erst relevant, wenn Kadenz/Community-
Antworten mehr als nebenbei zu stemmen sind — nicht jetzt.

**Fix-Update (Head of Marketing, 2026-08-19):** Vollständige Strategie in
`docs/marketing-social-media.md` (vier Content-Säulen: Pain-Point,
Fach-Autorität, Build-in-Public, Countdown/Waitlist; TikTok zuerst, IG
Reels als Zweitverwertung; 3–4 Posts/Woche zum Start). Dazu ein erster
Content-Kalender mit zwölf konkreten, ausformulierten Post-Ideen (Hook,
Skript, Caption-Entwurf, CTA, Dreh-Bedarf) für die ersten drei Wochen:
`docs/sofortangebot-content-kalender.xlsx`.

**Offene Abhängigkeit für Chief of Staff:** Für Post #8 (erste
Countdown-/Waitlist-Erwähnung, spätestens Woche 2) wird eine
Warteliste-Landingpage gebraucht, die nach aktuellem Stand noch nicht
existiert. Bitte mit Head of Product Engineering klären, ob/wann das
machbar ist, damit der Kalender nicht auf eine fehlende Seite zuläuft.

**Noch offen:** Rückmeldung, ob/wann die Warteliste-Seite kommt; danach
laufende Beobachtung, welche Formate performen, um Woche 2/3 ggf.
anzupassen, bevor gedreht wird.

---

## CoS-M-003 — Klare Anweisung: Instagram/TikTok-Postgestaltung entspricht nicht dem Anspruch

**Datum:** 2026-08-31 (Sandy direkt im Chat, nach den ersten fertig
erstellten Posts)

**Status:** ❌ offen — verbindliche neue Vorgabe, gilt ab sofort für jeden
weiteren Post

**Sandys Rückmeldung, unverändert wiedergegeben:** Die gerade erstellten
Posts sehen **katastrophal** aus. Nicht nur die Optik — auch das Wording
trifft nicht. Es fehlte bisher eine konkrete Anweisung dazu, wie ein
Instagram-/TikTok-Post auszusehen hat; das wird hiermit nachgeholt, gilt ab
sofort für alles Weitere (Instagram jetzt, TikTok in gleichem Maß, sobald
es losgeht).

**Woran es bisher gefehlt hat:** `docs/marketing-ci.md` und
`docs/marketing-social-media.md` legen die Marke und die Content-Strategie
fest, aber es gab nie eine eigene, konkrete Gestaltungsvorgabe für das
fertige visuelle Post-Ergebnis selbst (Layout, Bildaufbau, Text-Overlay-
Regeln) — nur den Rahmen drumherum (Farben/Fonts abstrakt, Skript-Ideen
ohne visuelle Umsetzung). Diese Lücke hat jetzt sichtbar zu Ergebnissen
geführt, die nicht dem Marken-Anspruch entsprechen. Diese Vorgabe schließt
genau diese Lücke.

**Verbindliche Anforderungen an jeden Post ab sofort:**

1. **Marke zuerst, ohne Ausnahme.** Nur die in `docs/marketing-ci.md`
   final festgelegten Werte verwenden — Gelb `#D9A400` (nicht das alte
   `#F5C400` oder irgendein anderes Gelb), Anthrazit + warmes Off-White
   `#F7F7F5`, Überschriften in Bricolage Grotesque, das Maßband-Logomark
   (Icon-only-Variante, klein, meist unten platziert) in jedem Post
   sichtbar, aber nie aufdringlich. Kein Emoji als Icon-Ersatz — dafür gibt
   es das eigene Werkzeug-Icon-Set. Kein Font, keine Farbe, kein Icon, das
   nicht aus der CI-Datei stammt.
2. **Hook in der ersten Sekunde, nicht erst im Text.** Instagram/TikTok
   entscheiden in Sekundenbruchteilen. Die größte, klarste Aussage steht
   groß im Bild selbst (nicht nur in der Caption) — bei Video: die erste
   Einstellung MUSS die Aufmerksamkeit halten, bei Grafik: eine einzige,
   große Kernaussage pro Bild, keine drei Botschaften gleichzeitig.
3. **Wie eine echte, aktuelle Social-Media-Marke aussehen, nicht wie eine
   Powerpoint-Folie mit Firmenfarben drauf.** Konkret: vertikales 9:16-
   Format, großzügig Weißraum/Luft statt vollgestopfter Fläche, maximal
   2–3 kurze Textzeilen pro Bild/Frame (keine Fließtext-Blöcke), ein klarer
   visueller Fokuspunkt statt gleichrangiger Elemente, Kontrast so stark,
   dass der Post auch als Daumennagel-Vorschau in einem schnell
   scrollenden Feed sofort lesbar ist. Bewusst roh/authentisch bei Video
   (siehe `marketing-social-media.md`) — das ist kein Widerspruch zu
   professionellem Look, sondern die aktuelle Instagram-Ästhetik selbst:
   kein Hochglanz-Stockfoto-Gefühl, keine generische Startup-Slide.
4. **Zielgruppe zuerst formuliert, nicht Marketing-Sprache.** Zielgruppe
   ist der Maler/Bodenleger/Innenausbauer aus `marketing-social-media.md`,
   nicht ein SaaS-Publikum. Wording direkt, konkret, auf Augenhöhe wie ein
   Kollege redet — kein „innovative Lösung", „revolutionär",
   „digitalisieren Sie Ihren Workflow" oder ähnliche Buzzwords. Die bereits
   vorhandenen Caption-Entwürfe im Content-Kalender
   (`sofortangebot-content-kalender.xlsx`) treffen diesen Ton bereits gut
   („Der Teil vom Job, den keiner mag. Kennt ihr das?") — genau dieses
   Register für JEDEN Post halten, auch wenn er nicht aus dem Kalender
   stammt.
5. **Ein Template-System bauen, nicht zwölf Einzeldesigns.** Bevor der
   nächste Post entsteht: 2–3 wiederverwendbare Vorlagen pro Content-Säule
   (Pain-Point, Fach-Autorität, Build-in-Public, Countdown) entwerfen, in
   denen sich nur Text/Bild austauschen lässt. Das sichert Konsistenz über
   alle Posts hinweg und ist schneller als jeden Post von null zu gestalten
   — genau das fehlt aktuell sichtbar.

**Neuer Prozess-Schritt, ab sofort verbindlich:** Bevor ein ganzer Batch
Posts final produziert wird, **erst 1–2 Beispiel-Posts als Entwurf zeigen**
(Sandy direkt oder über Chief of Staff) und Go einholen — nicht wie
diesmal direkt fertig produzieren und erst danach zeigen. Das verhindert,
dass ein grundlegendes Problem sich über mehrere Posts wiederholt, bevor es
auffällt.

**Für Chief of Staff, offen:** Die tatsächlichen kritisierten Posts wurden
bei diesem Audit nicht als Datei in `docs/` gefunden (nur Skript-Ideen im
Content-Kalender, keine fertigen Grafiken/Videos) — vermutlich in einem
separaten Tool entstanden. Bitte von Head of Marketing verlinken/anhängen
lassen, sobald verfügbar, damit Sandys Feedback beim nächsten Entwurf
konkret an den tatsächlichen Bildern nachvollzogen werden kann, statt nur
an dieser allgemeinen Vorgabe.

**Update (Sandy, 31.08.):** Vollständiges Design-System-PDF geliefert
(„hier vollständige neue ci") — jetzt abgelegt unter
`docs/sofortangebot-ci-guide.pdf` (19 Seiten, Stand 19.08.2026, Sandys
Freigabe 18.08.2026). Deutlich präziser als die bisherige Kurzfassung in
`marketing-ci.md`: exakte Hex-Werte, Typografie-Skala, Icon-Stilregeln
(monoline, Strichstärke 1.6, 24×24-Raster, „kein eigenes Icon-Gelb"),
präzise Ton-Regeln mit So/Nicht-so-Beispielen (Sie-Form, Sentence Case,
keine Ausrufezeichen, keine Emoji, deutsche Zahlenformatierung), Logo-
Nutzungsregeln, sowie Bestätigung, dass die Token-Aufräumung (DC-006)
inzwischen zu einem echten, codierten Design System mit 25 Komponenten
geführt hat (Governance-Tabelle: CI-Konzept/Pflege bleibt bei Head of
Marketing über `marketing-ci.md`, technische Umsetzung bei Product
Designer/Engineering über `design-check.md`). Anweisung oben (CoS-M-003)
ist bereits mit den präzisen Werten aus diesem PDF geschärft.

**Zwei Lücken, die das PDF selbst offenlegt und die Head of Marketing
kennen sollte, bevor er weiterarbeitet:** Das eigene Marketing-Icon-Set
existiert noch nicht als echte SVG-Dateien (im PDF nur durch Lucide-Icons
ersetzt, als Platzhalter markiert) — falls er das eigene Icon-Set aus
CoS-M-001 tatsächlich für Posts einsetzen will, muss er es selbst zeichnen
oder anfragen, es liegt nicht fertig vor. Das Logo liegt bisher nur als
Raster-Bild vor, keine Vektor-/SVG-Version — für Social Media in der Regel
ausreichend, für andere Einsatzzwecke (Favicon, Druck) nicht.

**Fix-Update (Head of Marketing, 2026-08-31):** Danke für die Ablage —
kleiner Dopplungs-Hinweis: Ich hatte dieselbe Datei (identisch, Sandy hat
sie mir zeitgleich direkt geschickt) parallel unter `docs/design-system.pdf`
gesichert, bevor ich diese Fassung hier unter `docs/sofortangebot-ci-guide.pdf`
gesehen habe — beide Dateien sind bytegleich, keine Widersprüche, einfach
zweimal hochgeladen. Ich referenziere ab jetzt `sofortangebot-ci-guide.pdf`.

Zu den kritisierten Posts: Die 8 Original-Posts sind jetzt unter
`docs/social-drafts-v1-kritisiert/` abgelegt. Rückblickend nachvollziehbar,
woran es lag: 4:5-Feed-Format statt der eigentlich priorisierten 9:16-Reels/
Stories, dekorative Radial-Verläufe (widerspricht der im PDF dokumentierten
Regel „keine Verläufe, keine Texturen"), zu viel Fläche/Text statt einem
Fokuspunkt pro Bild. Zwei neue Entwürfe nach den neuen Vorgaben gebaut
(9:16, ein Claim, viel Weißraum, kleines unaufdringliches Logomark, keine
Verläufe) liegen unter `docs/social-drafts-v2/` — wie im neuen
Prozess vorgesehen zeige ich diese zwei zuerst und hole ein Go ein, bevor
ich das Template-System auf alle vier Content-Säulen ausrolle.

Zu den zwei offenen Lücken: genau richtig erkannt, beide sind Schritt 2/3
aus meinem Umsetzungsplan (`docs/marketing-ci.md`, Teil 3) und jetzt
priorisiert, da Product Designer sichtbar darauf wartet.

**Eine zusätzliche Sache, die mir beim genauen Lesen aufgefallen ist und
die noch niemand angesprochen hat:** Das PDF legt unter „Mechanik"
(Tonalität) fest: „Sprache Deutsch, förmliches Sie — nie du." Das
widerspricht der tatsächlichen, im Produkt bereits verwendeten Sprache
(`design-check.md` zeigt durchgehend „du"-Ansprache im Onboarding: „Was
machst du", „Wie heißt dein Betrieb?") und allen Social-Media-Texten, die
ich bisher mit Sandy abgestimmt habe. Das ist eine Positionierungsfrage,
die nur Sandy entscheiden kann — Details und eine zweite offene Frage
(Freigabe der neuen Funktionsfarben `--state-success`/`--state-danger`,
im PDF selbst als ungeklärt markiert) stehen unter CoS-M-004 unten. Bitte
zusätzlich in `docs/entscheidungen-fuer-sandy.md` aufnehmen, falls Sandy
das nicht direkt im Chat beantwortet.

**Chief-of-Staff-Update (2026-08-31):** Beide offenen Punkte (Sie/du,
Funktionsfarben) als CoS-M-004 in `docs/entscheidungen-fuer-sandy.md`
aufgenommen — Sandy hat sie noch nicht beantwortet.

Sandy hat mir direkt im Chat 9 neue Post-Entwürfe geschickt und gefragt, ob
die Richtung jetzt stimmt. Meine Einschätzung: ja, klar richtige Richtung —
Farben/Logo/Bricolage-Grotesque-Überschriften mit Punkt, Mono-Schrift nur
bei berechneten Maßen, deutsche Zahlenformatierung, keine Ausrufezeichen/
Emoji, großzügiger Weißraum, ein Fokuspunkt pro Bild, Verb+Objekt-CTA —
alles sauber nach der neuen Vorgabe. Zwei kleine Punkte mitgegeben: gerade
Anführungszeichen in Dialog-Posts statt „..." (deutsche Form), und eine
Rückfrage, ob 4:5 bei manchen Posts bewusst so gewählt ist oder überall
9:16 sein soll.

**Wichtig — Abgleich mit den hier abgelegten Dateien:** Diese 9 Bilder sind
NICHT dieselben wie die zwei Entwürfe unter `docs/social-drafts-v2/`
(„Angebot raus. Noch auf der Baustelle." / „Ein Angebot. Jede Position
erklärt.") — ich habe beide v2-Dateien und zum Vergleich einen der acht
`social-drafts-v1-kritisiert/`-Posts („Gerechnet, nicht geschätzt.", mit
sichtbarem Radial-Verlauf und wirkt eher 4:5 als 9:16) geöffnet und direkt
verglichen. Die zwei offiziellen v2-Entwürfe sind ebenfalls stark und
CI-konform, aber andere Motive/Texte als die 9, die Sandy mir gezeigt hat.
Für mich sieht das nach einer dritten, bisher nirgends in `docs/`
dokumentierten Charge aus. Zwei Fragen, die Head of Marketing bitte kurz
einordnet: (1) Sind die 9 eine Erweiterung von `social-drafts-v2/` über die
im neuen Prozess vorgesehenen „erst 2 zeigen" hinaus, oder ein separates
Set? (2) Bitte die 9 (falls noch nicht geschehen) ebenfalls unter
`docs/social-drafts-v2/` oder einem eigenen Ordner ablegen, damit hier eine
einzige, vollständige Quelle für alle aktuellen Entwürfe existiert statt
verstreuter Chat-Anhänge.

---

## CoS-M-004 — Design System: zwei offene Freigaben an Sandy

**Datum:** 2026-08-31
**Status:** 🟡 Punkt 1 entschieden, Punkt 2 weiterhin 🔵 offen

1. ~~**Tonalität „Sie" statt „du"?**~~ **Entschieden von Sandy, 2026-08-31:
   immer „du"** — „imer per du!!!!!!!!!" Eindeutig. Die PDF-Vorgabe
   „förmliches Sie — nie du" war ein Fehler und ist damit korrigiert; das
   Produkt bleibt wie bisher durchgehend beim „du" (Onboarding, Social-
   Media-Texte), keine Umstellung nötig. Bitte im Design-System-PDF
   (`docs/sofortangebot-ci-guide.pdf`, Abschnitt Mechanik/Tonalität) intern
   vermerken, dass „Sie" nicht gilt — eine Korrektur der PDF-Datei selbst
   ist nicht nötig/möglich, aber `docs/marketing-ci.md` sollte das „du"
   explizit als verbindlich festhalten, damit es nicht erneut zur
   Fehlannahme kommt.
2. **Freigabe neue Funktionsfarben** (`--state-success` / `--state-danger`)
   — weiterhin offen, im PDF selbst als „Ergänzung ohne CI-Grundlage —
   Freigabe durch Sandy offen" markiert.

---

## CoS-M-005 — DER Slogan für Sofortangebot: final festgelegt

**Datum:** 2026-08-31
**Status:** ✅ entschieden — Positionierungs-Entscheidung von Sandy, direkt im
Chat

**Sandys finale Entscheidung:** „Aufmaß fertig. Angebot fertig."

**Hintergrund/Begründung, damit die Wahl nachvollziehbar bleibt:** Ein
erster Vorschlag von Chief of Staff („Gerechnet, nicht geschätzt.") war ein
reiner Differenzierungs-Slogan — er funktioniert nur, wenn jemand das
Produkt schon kennt, nicht beim allerersten Kontakt. Sandys eigener
Einwand dazu: „wenn man sofortangebot noch gar nicht kennt... weiß man
doch null worum es bei sofortangebot geht, man denkt iwie ein kalkulator
oderso" — zu Recht. „Aufmaß fertig. Angebot fertig." behebt das: zwei
parallele Kurzsätze, die den kompletten Produkt-Ablauf in vier Wörtern
zeigen (Aufmaß nehmen → Angebot ist fertig), verständlich auch ganz ohne
Vorwissen.

**Für die Umsetzung:**
- Das ist jetzt DER Haupt-Slogan — Landingpage-Hero, Social-Media-Bio,
  überall wo ein neuer, kalter Kontakt zuerst landet.
- Format passt bereits 1:1 in die bestehende CI (Bricolage-Grotesque-
  Statement-Stil, Punkt am Satzende, sentence case, keine Ausrufezeichen) —
  keine Sonderbehandlung nötig.
- „Gerechnet, nicht geschätzt." muss nicht verschwinden — kann als
  sekundäre Differenzierungs-Zeile weiterleben (z. B. Subline unter dem
  Haupt-Slogan, oder in einzelnen Posts), aber nicht mehr als das, was ein
  völlig neuer Betrachter zuerst liest.
- Bitte in `docs/marketing-ci.md` als finalen Slogan festhalten, damit er
  an einer Stelle verbindlich steht.

---

## Organigramm-Änderung (Chief of Staff, 2026-09-01)

Neue Position: **Head of Legal & Compliance**, seit 01.09.2026 — auf Sandys
dringende Anfrage eingerichtet. Deckt zwei Bereiche ab: (A) SaaS-/
Digitalrecht (Datenschutz, AGB, KI-Kennzeichnungspflichten) und (B) Gewerke-/
Baurecht für die Angebotserstellung. Volle Rollenbeschreibung:
`docs/team-organigramm.md`, Koordination läuft über
`docs/chief-of-staff-legal-todos.md` (ID-Schema CoS-L-XXX).

Relevant für dich: die KI-Kennzeichnungspflicht kann auch die Landingpage/
Warteliste-Seite betreffen (Cookies/Tracking, Datenschutzerklärung für die
Anmeldung), und Legal wird vermutlich prüfen, ob/wo „KI-gestützt" in der
Außenkommunikation auftauchen muss — relevant für Wording auf Landingpage
und Social. Falls Rückfragen entstehen, kommen die über den Chief of Staff —
noch kein eigener direkter Austausch-Kanal, wird bei Bedarf ergänzt.

---

## CoS-M-006 — Zwei FAQ-Korrekturen von Head of Legal (wartet auf Sandys Textfreigabe)

**Datum:** 2026-09-01
**Status:** 🟡 Sandys Antwort da — geht in den Landingpage-Rebuild ein, kein
Patch der alten Seite

Head of Legal hat zwei Widersprüche auf der Landingpage-FAQ gefunden, beide
mit echtem Abmahnrisiko (§5 UWG), weil der Gegenbeweis auf der eigenen
Website liegt:

- **G2** — „Alles liegt auf Servern in Deutschland … kein Teilen mit
  Dritten. DSGVO-konform." widerspricht der eigenen AVV-Seite (6
  Unterauftragnehmer, teils USA).
- **G3** — „Fenster und Türen abgezogen" beschreibt das Produkt seit der
  Übermessungs-Entscheidung vom 21.08. falsch.

**Update (Sandy, 01.09.):** „egal — werde komplette Landingpage noch neu
machen." Kein Patch der bestehenden FAQ-Sätze nötig — bitte stattdessen die
korrekten Fakten direkt in die neue Seite einbauen: Serverstandort/
Unterauftragnehmer korrekt darstellen (Legals Formulierungsvorschlag als
Ausgangspunkt: `docs/legal-001-bestandsaufnahme.md`, Abschnitt G2), und die
Übermessungs-Beschreibung an die Entscheidung vom 21.08. anpassen (Abschnitt
G3). **Ein Risiko, das im Auge zu behalten ist:** falls der Rebuild sich bis
über Gate 1 hinauszieht, bleiben die beiden fehlerhaften Sätze bis dahin
live auf der aktuellen Seite stehen — bitte kurz Bescheid geben, mit welchem
Zeitrahmen für den Rebuild zu rechnen ist, damit Chief of Staff das
gegenchecken kann.

---

## CoS-M-007 — Go-to-Market-Kanalplan als Zulieferung für den Finanzplan

**Datum:** 2026-09-03 (Chief of Staff)
**Status:** ❌ offen

**Anlass:** Head of Finance baut den 24-Monats-Finanzplan (CoS-F-003, drei
Szenarien). Für die Neukunden-Kurve hat er bisher eine eigene Annahme gesetzt
(konstant 2/4/8 pro Monat) und das auch so gekennzeichnet. Sandy hat das
hinterfragt — zu Recht: eine konstante Zahl unterstellt, dass Vertrieb immer
gleich stark läuft. **Die Kanal-Annahmen gehören zu dir, nicht zu Finance und
nicht zu mir.**

**Was gebraucht wird — pro Kanal, nicht als Gesamtsumme:**

1. **Welche Kanäle**, in welcher Reihenfolge, und ab wann jeweils. Sandy nennt
   ausdrücklich zwei, die noch nirgends geplant sind: **Flyer im
   Malerfachhandel auslegen** (sie nannte Dessau als Beispiel) und ein
   ernsthafter **Social-Media-Auftritt** (dafür gibt es bereits CoS-M-002 —
   bitte darauf aufsetzen statt neu anzufangen). Dazu kommt, was aus der
   Strategie ohnehin gesetzt ist: Content/SEO und Mundpropaganda. Wenn du
   weitere siehst — Innungen, Fachhandels-Partnerschaften, Handwerkskammer,
   Fachgruppen — nimm sie auf.
2. **Verlaufsform je Kanal.** Läuft er sofort oder erst nach Monaten an? Ist es
   eine Dauerquelle oder ein einmaliger Sprung mit Abklingen? Gibt es eine
   Obergrenze? Finance braucht das, um daraus eine Kurve statt einer Konstanten
   zu bauen.
3. **Aufwand in Stunden pro Monat je Kanal.** Das ist der wichtigste Wert und
   der, der am ehesten vergessen wird. **Sandy hat einen Vollzeitjob** — die
   Wachstumsgrenze ist mit hoher Wahrscheinlichkeit ihre Zeit und nicht die
   Nachfrage. Ein Kanal, der 20 Stunden im Monat kostet, ist keine Option,
   auch wenn er gut wäre.
4. **Sachkosten je Kanal.** Flyerdruck, Fotos/Video, Tools, Fahrtkosten,
   Standgebühren. Es gibt **kein bezahltes Werbebudget** (Festlegung vom
   18.08., `docs/vision-strategie.md`) — Sachkosten für organische Kanäle sind
   davon nicht betroffen, aber bitte nichts unterstellen, was einem Werbebudget
   gleichkäme, ohne es als solches zu benennen.
5. **Eine ehrliche Erwartung je Kanal**, als Bandbreite: wie viele Betriebe
   erreicht man realistisch, und wie viele davon werden zahlende Kunden.
   **Lieber vorsichtig und begründet als optimistisch und rund.** Wenn du für
   einen Kanal keine belastbare Erwartung hast, schreib das hin — eine
   ausgewiesene Unsicherheit ist für den Plan mehr wert als eine erfundene
   Zahl.

**Wichtige Randbedingung:** Es gibt bis heute **keinen einzigen Nutzer** und
keine Referenz. Der erste Kanal muss ohne Bewertungen, ohne Fallbeispiele und
ohne Bekanntheit funktionieren. Bitte in der Reihenfolge berücksichtigen —
was zuerst kommt, ist vermutlich das, was am wenigsten Vertrauen von Fremden
verlangt.

**Format:** Eine Tabelle reicht völlig, dazu ein paar Sätze Begründung je
Kanal. Bitte hier eintragen, nicht in einer neuen Datei — Head of Finance holt
es sich von hier ab (CoS-F-003, Nachtrag 3).

---

## CoS-M-007, Nachtrag — drei Antworten von Sandy (03.09.2026)

Ich habe direkt bei Sandy nachgefragt, bevor du anfängst. Die Antworten ändern
den Zuschnitt spürbar — bitte den Kanalplan darauf aufbauen, nicht auf
allgemeinen Annahmen.

**1. Zeitbudget — korrigiert von Sandy am 03.09.2026: 15–20 Stunden pro
Woche**, neben einem Vollzeitjob, und zwar so **seit rund zwei Monaten
tatsächlich gelebt**, nicht geschätzt. Das sind grob **65–86 Stunden im Monat
für alles zusammen** — Produkt, Support, Verwaltung, Vertrieb.
*(Ich hatte hier zuerst 5–10 Stunden stehen; das war meine Frage, die zu grob
gestellt war. Bitte ausschließlich mit den 15–20 rechnen.)*

Damit ist deutlich mehr möglich als zunächst angenommen — ein Kanal mit
regelmäßiger Produktion ist realistisch. **Trotzdem bleibt Zeit die knappste
Ressource**, aus zwei Gründen: Der größte Teil dieser Stunden fließt heute ins
Produkt, und nach dem Launch kommt Support obendrauf, der mit jedem Kunden
wächst. Bitte je Kanal weiterhin den Stundenaufwand ausweisen und lieber zwei
Kanäle vorschlagen, die durchgehalten werden, als fünf, die nach sechs Wochen
einschlafen.

**2. Der Malerfachhandel in Dessau ist ein warmer Kontakt** — und deutlich mehr
als „Flyer auslegen". Sandys Worte: ein guter Bekannter von Clemens arbeitet
dort, hat **von sich aus angeboten**, Flyer auszulegen, und **kennt die immer
wiederkehrenden Kunden** — Dessau, nicht Berlin, es sind oft dieselben
Gesichter.

Meine Einschätzung dazu, die du gern verwerfen kannst, weil Kanalbewertung dein
Fach ist und nicht meins: **Das ist kein Flyer-Kanal, das ist ein
Empfehlungskanal mit einem Menschen als Multiplikator.** Der Unterschied ist
riesig — ein Flyer im Ständer wird überblättert, „der Kollege am Tresen sagt,
das taugt was" wird ausprobiert. Wenn das stimmt, gehört Dessau nicht als
Nebenkanal in den Plan, sondern als **erster Kanal überhaupt**, und die Frage
ist nicht „wie viele Flyer", sondern „was braucht dieser eine Mensch, um es gut
weiterempfehlen zu können" (etwas zum Zeigen, eine Erklärung in einem Satz, ein
Grund, warum es ihm selbst nützt). Bitte prüf das und entscheide.

**3. Sandy und Clemens kennen 0 bis 2 Handwerker persönlich**, die als
Testnutzer in Frage kämen. Es gibt also **kein eigenes Netzwerk**, aus dem die
ersten Gate-1-Nutzer kommen könnten — außer über Dessau. Das verschärft Punkt 2
zusätzlich: der warme Kontakt ist nicht einer von mehreren Wegen, er ist
aktuell der einzige.

**Was ich mir vom Kanalplan erhoffe:** eine ehrliche Reihenfolge unter diesen
Bedingungen. Nicht „diese acht Kanäle wären gut", sondern „mit 5–10 Stunden die
Woche und einem warmen Kontakt fängt man hier an, dann kommt das, und das hier
lohnt sich erst ab X Kunden".

---

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->

