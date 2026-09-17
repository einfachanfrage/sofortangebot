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
| CoS-M-008 | Sandys drei Beschleuniger: wöchentlicher Blog/SEO, Micro-Influencer im Handwerk, Tempo insgesamt | ❌ offen — Gespräch mit Sandy | Sandy direkt, 2026-09-03 |
| CoS-M-007 | Go-to-Market-Kanalplan (Kanäle, Anlauf, Stundenaufwand, Sachkosten, Erwartung) als Zulieferung für den Finanzplan | 🟡 geliefert (Plan unten, Zahlen in `docs/gtm-kanalplan.xlsx`) — 3 Rückfragen an Sandy, 4 an Chief of Staff offen | Chief of Staff / Sandys Rückfrage zu den Szenarien, 2026-09-03 |
| CoS-M-001 | CI-Bestandsaufnahme + Richtungsvorschlag | ✅ komplett — Sandy hat mit „ok leg die CI fest" final bestätigt, Umsetzungsplan (Schritt 5) steht, Handoff an Product Designer über EX-M-005 | Sandys Ankündigung, 2026-08-17 |
| CoS-M-002 | Social-Media-Strategie Pre-Launch (Instagram/TikTok) | 🟡 Strategie + erster Content-Kalender fertig, Sandy hat Richtung bestätigt — Umsetzung (Dreh mit Clemens) läuft bei Sandy, eine Abhängigkeit offen (Warteliste-Landingpage) | Sandys Anfrage im Chat, 2026-08-19 |
| CoS-M-003 | Verbindliche Gestaltungsvorgabe für Instagram/TikTok-Posts, nach Sandys Kritik an ersten fertigen Posts | 🟡 Vorgabe umgesetzt, v1-Posts + zwei v2-Entwürfe in `docs/` gesichert; Sandy hat zusätzlich 9 neue Entwürfe im Chat gezeigt und Chief-of-Staff-Go bekommen — Abgleich mit `social-drafts-v2/` bei Head of Marketing offen | Sandy direkt im Chat, 2026-08-31 |
| CoS-M-004 | Design System — zwei Freigaben nötig (Sie/du, Funktionsfarben) | 🟡 Sie/du entschieden („immer du"), Funktionsfarben weiterhin 🔵 offen | Sandys Übergabe des PDFs, 2026-08-31 |
| CoS-M-005 | DER Slogan für Sofortangebot final festgelegt | ✅ entschieden — „Aufmaß fertig. Angebot fertig." | Sandy direkt im Chat, 2026-08-31 |
| CoS-M-009 | Positionierung: bewusst keine KI-Werbesprache, Ergebnis statt Technologie verkaufen | ✅ entschieden (Sandy) — als Prüf-Regel für alle Texte mitnehmen | Sandy direkt, 2026-09-06 |
| CoS-M-010 | „3 Angebote kostenlos" ungenau seit der harten Grenze (06.09.) — Textänderung in zwei Dateien | ✅ Sandy hat freigegeben — Umsetzung an Head of Product Engineering übergeben | Head of Product Engineering über `chief-of-staff-todos.md`, 2026-09-07 |

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

**Fix-Update (Head of Marketing, 2026-09-03):** Zu (1)/(2): Die 9 Entwürfe
stammen nicht aus meiner Sitzung — ich habe sie nie gesehen; Sandy hat sie
dir direkt gezeigt. Damit hier eine Quelle existiert: bitte Sandy (oder du,
falls du die Dateien hast) legt sie unter `docs/social-drafts-v2/` ab, dann
gleiche ich sie mit meinen zwei v2-Entwürfen ab und baue das Template-System
auf der Fassung, die Sandy tatsächlich gut fand. Zu deiner 4:5/9:16-Frage:
laut Vorgabe Nr. 3 überall 9:16 — Feed-Carousels wären die einzige
begründete Ausnahme. Die „immer du"-Entscheidung (CoS-M-004) ist in
`docs/marketing-ci.md` als verbindlich festgehalten.

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

> **Hinweis (03.09., später am Tag):** Sandy wollte den Auftrag deutlich
> konkreter — Ziel, Kontext, Qualitätslatte. Der **vollständige Auftrag steht
> weiter unten** („CoS-M-007 — Vollständiger Auftrag") und ersetzt diese
> Kurzfassung inhaltlich. Der Nachtrag mit Sandys drei Antworten bleibt gültig.

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

## CoS-M-007 — Vollständiger Auftrag: der Go-to-Market-Plan (Chief of Staff, 03.09.2026)

Sandys Worte: *„kannst du bitte den kanalplan für marketing so konkret wie
möglich beschreiben. was mein ziel ist usw. ich will dass er da wirklich was
geiles baut."* Das hier ist der Versuch, dir alles zu geben, was du dafür
brauchst — Ziel, Lage, Randbedingungen, Qualitätslatte. **Wie** du es baust,
bleibt deins. Ich beschreibe, was am Ende da sein muss, damit es Sandy wirklich
trägt.

### 1. Worum es geht — das Ziel hinter dem Ziel

Sandy hat Sofortangebot seit Juni allein gebaut, ohne Programmierhintergrund,
neben einem Vollzeitjob, seit zwei Monaten mit 15–20 Stunden die Woche. Ihr
Ziel ist **die volle Selbstständigkeit mit diesem Produkt** — nicht als
Lifestyle-Business, sondern mit Wachstum, Team und später Kapital
(`vision-strategie.md`). Der Weg dahin ist inzwischen konkret:

- **Stufe A (jetzt):** 40 Stunden angestellt, Sofortangebot nebenher.
- **Stufe B1:** Reduzierung auf 30 oder 25 Stunden, sobald Sofortangebot die
  Lücke zum Teilzeitgehalt deckt. Teilzeitantrag braucht 3 Monate Vorlauf.
- **Stufe B2:** null Stunden, sobald Sofortangebot mindestens 2.500 € netto
  im Monat trägt — plus Krankenversicherung und Rücklagen, also real deutlich
  mehr Umsatz.

**Head of Finance rechnet gerade aus, ab welcher Kundenzahl B1 und B2 möglich
sind** (CoS-F-003). Dein Plan ist die andere Hälfte derselben Frage: **wie
kommen diese Kunden zustande, in welcher Reihenfolge, mit welchem Aufwand, und
wann.** Ohne deinen Plan rechnet Finance mit einer erfundenen Konstante
(2/4/8 Neukunden pro Monat, so gekennzeichnet). Mit deinem Plan rechnet er mit
etwas, das man tatsächlich tun kann.

### 2. Das Produkt und sein Versprechen, in einem Absatz

Ein Maler oder Bodenleger spricht sein Aufmaß auf der Baustelle ein, das Tool
macht daraus einen Angebotsentwurf mit Positionen, Mengen und Preisen — jede
Position mit nachvollziehbarem Rechenweg („gerechnet, nicht geschätzt"). Der
Handwerker prüft, korrigiert, verschickt. **Was er spart: die Feierabendstunde
am Küchentisch, pro Angebot.** Bei einem Verrechnungssatz von 55–75 €/Stunde
kostet das Tool weniger als eine einzige abrechenbare Stunde im Monat.
Slogan (final): **„Aufmaß fertig. Angebot fertig."** Positionierung bewusst
über *weniger*: kein CRM, kein Rundum-System, das schnellste und
unkomplizierteste Angebotstool der Branche. Buchhaltungsanbindung
(Lexware/sevDesk) ist geplant, nicht zum Start.

### 3. Der Kunde

**Betriebe mit 1–10 Mitarbeitenden**, Maler und Bodenleger (weitere Gewerke
später). Der Chef schreibt die Angebote selbst, abends. Nutzt Lexware oder
sevDesk für die Buchhaltung. Zwei Gesichter, die du beide brauchst:

- **Der etablierte Meister**, 45+, dem Angebote schreiben seit 20 Jahren auf
  die Nerven geht und der Software misstraut, die ihm Zahlen vorsetzt. Ihn
  gewinnt man über Vertrauen und über Leute, die er kennt — nicht über Reels.
- **Die Nachfolgegeneration**, 25–40, die den Familienbetrieb übernimmt, auf
  Social Media unterwegs ist und moderne Werkzeuge *will*. Sie ist der Grund
  für die Social-Media-Strategie (CoS-M-002).

**Clemens ist der Prototyp**: Sandys Partner, selbst Handwerker
(Maler/Innenausbau), erster echter Testnutzer nach Gate 1, Gesicht vor der
Kamera. Er ist gleichzeitig euer einziger interner Zugang zur Zielgruppe.

### 4. Der Preis — und warum er ein Marketing-Werkzeug ist

Entschieden am 03.09. (`docs/preismodell.md`): **49 € netto/Monat**,
unbegrenzt Angebote, monatlich kündbar, **14 Tage voll testen ohne
Kreditkarte**, kein Gratis-Tarif. Und: **Gründerpreis 29 €/Monat, dauerhaft,
für die ersten 25 zahlenden Betriebe** — gegen die Zusage, Feedback zu geben.

Das ist eine echte, ehrliche Verknappung, keine Marketing-Erfindung: es gibt
genau 25 Plätze, danach kostet es 49 €, für immer. **Der Weg zu diesen 25 ist
die erste Kampagne, die dein Plan beschreiben sollte** — mit Ende, mit
Zählstand, mit einem Grund, jetzt und nicht später zu kommen.

### 5. Was wir haben

- **Ein warmer Kanal, und der ist gut:** Ein guter Bekannter von Clemens
  arbeitet im Malerfachhandel Dessau, hat von sich aus angeboten, Flyer
  auszulegen, und **kennt die wiederkehrenden Kunden persönlich** — Dessau,
  nicht Berlin, es sind oft dieselben Gesichter. Meine Einschätzung (deine
  Entscheidung): das ist kein Flyer-Kanal, das ist ein Empfehlungskanal mit
  einem Menschen als Multiplikator, und vermutlich der erste Kanal überhaupt.
- **Eine Social-Media-Strategie, die schon steht** (CoS-M-002,
  `marketing-social-media.md`): vier Content-Säulen, TikTok zuerst, IG Reels
  als Zweitverwertung, 3–4 Posts/Woche, Content-Kalender mit zwölf
  ausformulierten Post-Ideen. **Bitte darauf aufsetzen, nicht neu anfangen.**
- **CI und Ton** sind final (`marketing-ci.md`, `ci-guide.html`): „Gerechnet,
  nicht geschätzt", Anthrazit/Off-White/Gelb, Bricolage Grotesque.
- **Ein Produkt, das in Gate 1 ist** (36 %), mit einem gefixten zentralen
  Rechenfehler (VOB-013, Nachtest offen) und einem Team, das schnell liefert.
- **Zeit: 15–20 Stunden pro Woche von Sandy** — davon geht heute der Großteil
  ins Produkt. Wie viel davon Marketing bekommen kann, ist eine Frage, die
  dein Plan **beantworten** soll (siehe 7), nicht voraussetzen.

### 6. Was wir nicht haben — bitte nichts davon stillschweigend annehmen

- **Keinen einzigen Nutzer, keine Referenz, keine Bewertung.** Der erste Kanal
  muss ohne Social Proof funktionieren.
- **Kein Netzwerk:** Sandy und Clemens kennen 0–2 Handwerker persönlich.
- **Kein bezahltes Werbebudget** (Festlegung 18.08.). Wenn du überzeugt bist,
  dass ein kleiner bezahlter Test an einer Stelle den Unterschied macht:
  **als eigenen, klar markierten Vorschlag mit Zahlen einreichen**, nicht in
  den Plan einbauen. Sandy entscheidet.
- **Die Warteliste-Seite gibt es — und sie ist live, das hat dir nur niemand
  gesagt.** Du hattest sie am 19.08. als offene Abhängigkeit gemeldet; ich habe
  heute nachgesehen: `sofortangebot.app` zeigt aktuell **genau diese Seite**
  („Früher Zugang / Zugang sichern", `ComingSoon.tsx` mit `/api/waitlist`,
  E-Mails landen in der Tabelle `waitlist`). Die eigentliche Landingpage ist
  dahinter per Schalter (`NEXT_PUBLIC_COMING_SOON`) verborgen. Deine
  Abhängigkeit aus CoS-M-002 ist damit erledigt — bitte den Kalender-Post #8
  darauf aufsetzen. Offen ist nur, wie viele Adressen schon drin sind (frag
  mich, ich lasse es nachsehen) und ob die Seite in der neuen CI ist.
- **Preis und Testphase stehen noch nicht auf der Website** — die Umstellung
  läuft (CoS-038). Bis dahin nichts bewerben, was die Seite nicht zeigt.
- **Rechtliche Leitplanken:** Head of Legal hat bereits zwei FAQ-Korrekturen
  angemahnt (CoS-M-006). Alles, was nach außen geht, gilt für KI-Kennzeichnung
  und Versprechen dasselbe: nichts behaupten, was das Produkt nicht belegt
  hält. „Gerechnet, nicht geschätzt" ist ein Versprechen, das VOB-013 gerade
  erst eingelöst hat.

### 7. Was der Plan liefern muss

**A. Eine Reihenfolge in Phasen — relativ zum Launch, nicht mit festen
Daten**, weil das Launch-Datum gerade neu entschieden wird (siehe 8):

1. *Vor dem Launch*: Warteliste füllen, Dessau vorbereiten, erste
   Gate-1-Testnutzer finden.
2. *Launch bis Monat 3*: die 25 Gründerplätze.
3. *Monat 3 bis 12*: Weg zur B1-Schwelle (Finance liefert die Zahl).
4. *Jahr 2*: Ausbau — weitere Regionen, weitere Fachhändler, weitere Gewerke.

**B. Je Kanal, in einer Tabelle**, damit Finance es direkt übernehmen kann
(Spalten pro Monat, 24 Monate):
- Ziel des Kanals und welches Kundengesicht er trifft (Meister oder Nachfolger)
- Anlaufzeit und Verlaufsform (sofort / Rampe / Sprung mit Abklingen / Deckel)
- **Stunden pro Monat, getrennt nach Sandy, Clemens und dir**
- Sachkosten (Druck, Fahrt, Tools, Foto/Video)
- Erwartung als **Bandbreite**: Reichweite → Interessenten → Testphasen →
  zahlende Betriebe. Lieber vorsichtig und begründet als rund und optimistisch.
- **Abbruchkriterium**: woran erkennt man nach 6–8 Wochen, dass der Kanal
  nichts bringt, und was passiert dann.

**C. Dessau als Pilot und als Vorlage.** Was braucht der Bekannte am Tresen,
um es gut weiterzuempfehlen — einen Satz, etwas zum Zeigen, einen Grund,
warum es ihm selbst nützt? Und die strategische Frage dahinter: **Ist das ein
wiederholbares Fachhandels-Spielbuch** (andere Fachhändler, Innungen,
Großhandels-Theken) oder ein Einzelfall, der an einer Person hängt? Die
Antwort entscheidet, ob es einen zweiten Kanal dieser Art geben kann.

**D. Die 25-Plätze-Kampagne.** Wie man die Verknappung ehrlich erzählt, wie
der Zählstand sichtbar wird, was jemand tun muss, um einen Platz zu bekommen,
und was passiert, wenn Platz 25 vergeben ist.

**E. Eine typische Woche für Sandy.** Was tut sie konkret, an welchem Tag,
wie viele Stunden — so, dass sie den Plan nehmen und anfangen kann. **Das ist
der Teil, der über „geil" entscheidet.** „Instagram bespielen" ist kein Plan.
„Dienstag 45 Minuten: Clemens filmt auf der Baustelle drei Hooks aus dem
Kalender; Sonntag 2 Stunden: Sandy schneidet, Head of Marketing liefert
Overlays; Mittwoch 30 Minuten: Kommentare beantworten" ist einer.

**F. Wenige, ehrliche Messgrößen.** Nicht Likes. Vorschlag zur Diskussion:
Warteliste-Anmeldungen, gestartete Testphasen, Testphase → zahlend, und
Empfehlungen pro aktivem Kunden. Wenn du bessere hast, nimm deine.

### 8. Zwei Randbedingungen, die gerade erst dazugekommen sind

- **Der Launch-Zeitplan ist entschieden (Sandy, 03.09.):** Sandy ist
  18.–25.09. in Italien und 02.11.–03.12. in Thailand — **und Clemens im
  November ebenfalls** (`docs/kalender.md`). Deshalb: **Gate 1 (begleitete
  Testnutzer) ab Anfang Dezember 2026, öffentlicher Launch Januar 2027.**
  Das alte „01.11./01.12." gilt nicht mehr. Deine Phasen aus 7A kannst du
  damit datieren: *Vor dem Launch* = jetzt bis Ende November, *Launch* =
  Dezember bis Februar, *Aufbau* = bis Ende 2027.
  Für dich konkret: **Der Oktober ist der Produktionsmonat.** Alles, was
  Clemens vor der Kamera oder in Dessau braucht, muss **bis 01.11.** im Kasten
  sein — im November gibt es weder Gesicht noch Dreh noch Dessau-Kontakt. Der
  Content-Kalender sollte also im Oktober auf Vorrat produzieren, was im
  November und Dezember gepostet wird. Und die Warteliste läuft während der
  Reise weiter — das ist der einzige Kanal, der im November arbeitet, ohne
  dass jemand da ist.
- **Saisonalität der Zielgruppe.** Wann schreiben Maler und Bodenleger die
  meisten Angebote, wann haben sie Zeit, etwas Neues auszuprobieren? Das ist
  dein Fach — aber bitte im Plan ausdrücklich berücksichtigen, weil ein Launch
  im Dezember und einer im Januar vermutlich sehr unterschiedlich laufen.

### 9. Die Qualitätslatte, in vier Sätzen

Der Plan ist gut, wenn Sandy ihn liest und weiß, was sie **nächste Woche**
tut. Er ist gut, wenn Finance ihn nimmt und ohne Rückfrage in Zahlen gießen
kann. Er ist gut, wenn er ehrlich sagt, was ihr **nicht** wisst, statt es mit
runden Zahlen zu überdecken. Und er ist gut, wenn er lieber drei Kanäle
beschreibt, die durchgehalten werden, als acht, die gut klingen.

### 10. Rückfragen

Wenn dir etwas fehlt — Zahlen, Entscheidungen, Zugang zu Material — trag es
hier ein, ich bringe es zu Sandy. Lieber eine Rückfrage zu viel als ein Plan
auf einer Annahme, die niemand bestätigt hat.

**Abgabe:** hier in dieser Datei, plus die Kanal×Monat-Tabelle so, dass Head
of Finance sie übernehmen kann (er holt sie hier ab, CoS-F-003 Nachtrag 3).

---

## CoS-M-002 — Abhängigkeit erledigt (Chief of Staff, 03.09.2026)

Deine offene Abhängigkeit vom 19.08. („Warteliste-Landingpage existiert nach
aktuellem Stand noch nicht") ist **erledigt, und zwar schon länger** — es hat
dir nur niemand Bescheid gesagt, das geht auf mich. Stand heute: die Startseite
`sofortangebot.app` zeigt live die Warteliste-Seite (`ComingSoon.tsx`,
Eintragung über `/api/waitlist` in die Supabase-Tabelle `waitlist`,
Doppelte werden abgefangen). Die volle Landingpage liegt dahinter und wird
über einen Umgebungsschalter freigegeben.

Post #8 aus dem Content-Kalender kann also laufen. Was ich dir noch nicht
sagen kann: wie viele Adressen bereits drin sind, und ob die Seite schon in
der finalen CI ist — beides frage ich nach, sobald du es brauchst.

---

## CoS-M-007 — Der Kanalplan (Head of Marketing, 03.09.2026)

**Status:** 🟡 geliefert — Zahlen für Finance in `docs/gtm-kanalplan.xlsx`
(Blatt „Kanal x Monat", 24 Monate, drei Szenarien, Stunden getrennt nach
Sandy / Clemens / Head of Marketing, Sachkosten, Kapazitätsabgleich).
Rückfragen an Sandy und Chief of Staff stehen unten in Abschnitt 10.

### 0. Die Antwort in vier Sätzen

Der erste Kanal ist Dessau, nicht Social Media — weil er der einzige ist,
der ohne Bewertungen, ohne Referenz und ohne Bekanntheit funktioniert: ein
Mensch am Tresen, dem die Kunden vertrauen, sagt „probier das mal". Social
Media läuft parallel an, aber als Investition in die Nachfolgegeneration,
die frühestens ab Februar/März zahlende Betriebe bringt. Die Warteliste ist
kein eigener Kanal, sondern der Behälter, in dem alles landet — und der
einzige, der im November ohne Sandy und Clemens arbeitet. Realistisch sind
die 25 Gründerplätze gegen Ende 2027 voll, optimistisch im Sommer 2027,
vorsichtig innerhalb von 24 Monaten gar nicht — und genau diese Spanne
sollte der Finanzplan zeigen, statt sie zu glätten.

### 1. Reihenfolge in Phasen — datiert nach `docs/kalender.md`

| Phase | Zeitraum | Was passiert | Kanäle aktiv |
|---|---|---|---|
| **P0 Vorbereitung** | Sep – 01.11.2026 | Oktober ist Produktionsmonat: Dessau-Erstbesuch, Material, 3 Drehtage mit Clemens (Vorrat für Nov + Dez), Social-Konten und Templates fertig, Warteliste mit Herkunftsfeld. Bis 01.11. ist alles im Kasten, was Clemens oder Dessau braucht. | Dessau (Anbahnung), Social (Produktion), Warteliste |
| **P1 Reise** | 02.11. – 03.12.2026 | Nur Fernarbeit: vorproduzierte Posts laufen terminiert, Warteliste sammelt, eine Warteliste-Mail geht raus („Anfang Dezember geht es los"). Kein Dreh, kein Dessau, keine Testnutzer vor Ort. | Social (Vorrat), Warteliste |
| **P2 Gate 1** | Dez 2026 | Erste begleitete Testnutzer — kommen aus Dessau und aus der Warteliste. Nicht mehr als 5–8 gleichzeitig, jeder wird per WhatsApp begleitet. Dezember ist Auftragsflaute bei Malern: gute Zeit zum Ausprobieren, schlechte Zeit für Abschlüsse. | Dessau (aktiv), Warteliste, Social |
| **P3 Launch + Gründerplätze** | Jan – Mär 2027 | Öffentlicher Launch. 25-Plätze-Kampagne mit sichtbarem Zählstand. Angebotssaison beginnt (Februar–April schreiben Maler die meisten Angebote fürs Frühjahr) — der beste Moment des Jahres für ein Angebotstool. | alle drei + erste Empfehlungen |
| **P4 Weg zur B1-Schwelle** | Apr – Dez 2027 | Fachhandel-Spielbuch kalt ausrollen, falls Dessau die Mechanik bewiesen hat (ein Laden alle zwei Monate). Content/SEO läuft an. Mundpropaganda beginnt zu wirken (ab ~20 aktiven Betrieben messbar, ab 60–100 spürbar). | alle |
| **P5 Ausbau** | 2028 | Weitere Regionen, Innungen/Kammern mit den Gründerkunden als Beleg, weitere Gewerke. Nicht eingerechnet, nur als Richtung. | — |

### 2. Die Kanäle — und warum genau diese

| # | Kanal | Kundengesicht | Verlaufsform | Stunden/Monat (Sandy / Clemens / HoM) | Sachkosten | Erwartung 24 Monate (vorsichtig / realistisch / optimistisch, zahlende Betriebe) |
|---|---|---|---|---|---|---|
| 1 | **Dessau — Fachhandel als Empfehlungskanal** | Meister 45+ | Sprung Dez–Mär, dann Tröpfeln | 2 / 2 / 1 (Okt: 5 / 3 / 6) | Okt ~200 €, danach ~20 €/Monat | **4,5 / 8,5 / 17** |
| 2 | **Warteliste + E-Mail** | beide | Dauerbehälter, konvertiert die anderen | 1 / 0 / 3 | 0 | 0 direkt (Attribution beim Herkunftskanal) |
| 3 | **Social Media organisch** (TikTok zuerst, IG Reels) | Nachfolger 25–40 | Rampe ab Jan/Feb, Deckel = Schnittzeit | 12 / 6 / 10 (Okt: 12 / 8 / 12) | Okt einmalig ~60 € | **9 / 30 / 60** |
| 4 | **Mundpropaganda** | Meister zu Meister | Funktion der aktiven Basis, 3 Monate Verzögerung | 0,5 / 0 / 1 | 0 | Parameter im Sheet — trägt in Jahr 1 nicht |
| 5 | **Fachhandel-Spielbuch, kalt** (weitere Läden) | Meister | ab Apr 27, nur wenn Dessau trägt | 4 / 2 / 2 | ~100 € pro Laden | **3 / 11 / 18** |
| 6 | **Content / SEO** | eher Nachfolger | 6–12 Monate gegen Null, dann kleines Niveau | 1 / 0 / 8 | 0 | **0 / 3 / 8** |
| 7 | Innungen / Handwerkskammer | Meister | erst 2028, braucht Referenzen | — | — | nicht eingerechnet |

**Summe (ohne Mundpropaganda, ohne Abwanderung): vorsichtig ~17, realistisch
~52, optimistisch ~104 zahlende Betriebe in 24 Monaten.** Mundpropaganda kommt
in Finance' Modell obendrauf (Blatt „Mundpropaganda": 10 / 20 / 35 % der
aktiven Betriebe empfehlen pro Jahr, davon wird die Hälfte zahlend, 3 Monate
Verzögerung). Abwanderung zieht Finance ab — mein Hinweis: 3–5 % pro Monat im
ersten Jahr sind plausibel, Gründerkunden deutlich darunter.

**Warum diese Reihenfolge:** Was zuerst kommt, verlangt am wenigsten Vertrauen
von Fremden. Dessau verlangt gar keins — das Vertrauen leiht sich Sofortangebot
vom Bekannten am Tresen. Social Media verlangt Aufmerksamkeit, die erst
aufgebaut werden muss. Fachhandel kalt verlangt einen Beleg, dass die Mechanik
funktioniert. Innungen verlangen Referenzen. Genau in dieser Reihenfolge ist
der Plan gebaut.

**Was ich bewusst weglasse:** Messen und Fachmessen (Standgebühren wären ein
verkapptes Werbebudget, und ohne Referenzen bringt ein Stand nichts). LinkedIn
(nicht die Zielgruppe). Kaltakquise per Telefon (kostet Sandys Zeit eins zu
eins, skaliert nicht, und der Meister 45+ legt auf). Facebook-Gruppen für
Handwerker gibt es, aber sie sind spam-müde — als Nebenprodukt der Social-
Inhalte okay, nicht als eigener Kanal.

### 3. Dessau — Pilot und Vorlage

**Was der Bekannte am Tresen braucht, um gut zu empfehlen:**

1. **Einen Satz, den er ohne Nachdenken sagen kann:** „Der Clemens hat da
   was, da sprichst du das Aufmaß aufs Handy und hast abends das Angebot
   fertig — Aufmaß fertig, Angebot fertig." Der Slogan ist dafür gebaut.
2. **Etwas zum Zeigen, das in 20 Sekunden wirkt:** ein Tresenaufsteller A5
   mit dem Slogan, einem echten Beispiel-Angebot (Wandflächen, Rechenweg
   sichtbar) und einem QR-Code direkt auf die Warteliste mit Herkunft
   „Dessau". Dazu Flyer A6 zum Mitnehmen — nicht mehr als 50 Stück auf
   einmal, sonst liegen sie ewig. Kein Prospekt, keine Feature-Liste.
3. **Einen Grund, warum es ihm selbst nützt:** Er wird der Erste, der ein
   Werkzeug empfiehlt, das seine Stammkunden entlastet — das ist Beziehungs-
   Kapital für ihn. Ein Geldanreiz ist bei diesem Kontakt eher schädlich (er
   macht das als Freund von Clemens, nicht als Vertriebler). Ein sichtbares
   Dankeschön nach den ersten drei Testnutzern (Abendessen, nicht Provision)
   passt besser. Deine Entscheidung.
4. **Eine Rückmeldeschleife:** Alle zwei Wochen ein kurzer Anruf von Clemens:
   Wer hat gefragt, was haben sie gesagt, was hat sie gestört. Das ist
   gleichzeitig die billigste Marktforschung, die es gibt.

**Der Oktober-Besuch (Sandy + Clemens, ein Nachmittag, Fenster 26.09.–01.11.):**
Material übergeben, Beispiel-Angebot einmal live am Handy vorführen, und
drei Zahlen erfragen, ohne die der Plan Annahmen bleibt: Wie viele Maler-/
Bodenleger-Betriebe kommen regelmäßig? Wie oft sieht er dieselben Leute? Gibt
es zwei, drei, die er direkt für Gate 1 ansprechen würde? Mit diesen drei
Antworten ziehe ich die Dessau-Zeile im Sheet nach.

**Ist das ein wiederholbares Spielbuch?** Halb. Die *Mechanik* ist
wiederholbar — Aufsteller, QR mit Herkunft, Beispiel-Angebot, Rückmelde-
Rhythmus, ein Nachmittag Besuch. Die *Ausbeute* nicht: Sie hängt an einem
Menschen, der die Kunden kennt und dem sie vertrauen. Ein kalter Laden ohne
diesen Menschen liefert nach meiner Schätzung ein Drittel — deshalb steht
Kanal 5 mit einem Drittel der Dessau-Werte im Sheet und startet erst, wenn
Dessau mindestens drei Testphasen gebracht hat. Der Weg, das zu reparieren:
in jedem neuen Laden *einen* Menschen suchen, der die Rolle übernimmt, statt
Flyer abzulegen. Wenn das zweimal klappt, ist es ein Spielbuch. Wenn nicht,
bleibt Dessau ein Glücksfall, und der Kanal wird nicht weiter ausgerollt.

### 4. Die 25-Plätze-Kampagne

**Die ehrliche Geschichte:** „Wir suchen 25 Betriebe, die Sofortangebot als
Erste nutzen und uns sagen, was fehlt. Dafür zahlen sie dauerhaft 29 € statt
49 € — nicht im ersten Jahr, für immer. Platz 26 zahlt 49 €." Das ist keine
Marketing-Verknappung, es ist ein Tausch: Preis gegen Feedback. Genau so
erzählen — das Wort „Rabatt" kommt nicht vor.

**Der Zählstand:** Auf der Landingpage und in der Instagram-Bio steht die
Zahl, die stimmt: „Gründerplatz 7 von 25 vergeben". Sie wird von Hand
aktualisiert, wöchentlich, nicht öfter — ein Zähler, der stündlich springt,
wirkt manipuliert. Wenn drei Wochen nichts passiert, bleibt die Zahl stehen.
Das ist der Preis der Ehrlichkeit, und er ist richtig.

**Was jemand tun muss:** Warteliste → Einladung (Gate 1 in Dezember
persönlich, ab Januar automatisch) → 14 Tage voll testen → im Test auf
„Gründerplatz sichern" → Abo zu 29 €. Der Platz ist erst mit dem Abo
vergeben, nicht mit der Anmeldung. Wer auf der Warteliste steht, bekommt die
Einladung in der Reihenfolge der Anmeldung — das ist der Grund, sich jetzt
einzutragen und nicht im Januar.

**Wenn Platz 25 vergeben ist:** Ein einziger Post und eine E-Mail an alle auf
der Warteliste: „Alle 25 Gründerplätze sind vergeben. Ab jetzt 49 €, 14 Tage
kostenlos testen." Kein „letzte Chance", keine Verlängerung, keine „5
Zusatzplätze". Die Verknappung ist nur so viel wert, wie sie am Ende wahr
war.

**Ein Detail, das Legal vorher sehen sollte:** „dauerhaft 29 €" ist ein
Bestandsschutz-Versprechen (CoS-L-002 hat das bereits auf dem Tisch). Die
Kampagnentexte gehen vor Veröffentlichung einmal über Chief of Staff an Head
of Legal.

### 5. Eine typische Woche für Sandy (Stufe A, ab Dezember)

Marketing bekommt **rund 4 Stunden pro Woche, 15–16 im Monat** — etwa ein
Viertel der 65-Stunden-Dauerlinie. Der Rest bleibt für Produkt und Support.
Das ist die Antwort auf die Frage „wie viel Zeit kann Marketing haben": ein
Viertel, nicht mehr, sonst leidet das, was die Kunden dann benutzen.

| Tag | Dauer | Was | Wer |
|---|---|---|---|
| Dienstag | 45 Min | Clemens filmt auf der Baustelle 2–3 Hooks aus dem Content-Kalender (Handy, Hochkant, kein Skript — der Hook steht auf einem Zettel). | Clemens |
| Mittwoch | 20 Min | Kommentare und DMs beantworten, Warteliste-Zugänge anschauen. | Sandy |
| Freitag | 20 Min | Kommentare/DMs. Alle zwei Wochen: Warteliste-Mail freigeben (Head of Marketing liefert Text + Betreff, Sandy liest, drückt Senden). | Sandy |
| Sonntag | 90 Min | Drei Reels schneiden (CapCut, Overlays von Head of Marketing), für die Woche terminieren (Postiz), Zählstand aktualisieren. | Sandy |
| alle 2 Wochen | 15 Min | Anruf beim Bekannten in Dessau: Wer hat gefragt, was gesagt. Notizen an Head of Marketing. | Clemens |
| monatlich | 60 Min | Kurzer Blick auf die vier Messgrößen (Abschnitt 6) mit Head of Marketing, Entscheidung: weiter so, Format wechseln, Kanal stoppen. | Sandy + HoM |

**Der Oktober sieht anders aus** (~18 Stunden Sandy, 11 Clemens): drei
Drehtage à 2 Stunden (Samstage 10., 17., 24.10. als Vorschlag — je 8–10
Hooks, das reicht für Nov + Dez), 6 Stunden Schnitt am Stück, ein Nachmittag
Dessau, 2 Stunden Konten/Bio/Zählstand einrichten. Head of Marketing liefert
vorher: alle Hooks als Zettel, alle Overlays, alle Captions, den Aufsteller
und die Flyer druckfertig, die November-Mail.

**Der November** (~5 Stunden, aus Thailand): Posts laufen terminiert; Sandy
antwortet alle zwei Tage 15 Minuten auf Kommentare (Zeitverschiebung ist
egal, Kommentare warten). Sonst nichts — das ist bewusst so.

### 6. Messgrößen — und woran man erkennt, dass etwas nicht funktioniert

Vier Zahlen, monatlich, keine Likes:

1. **Warteliste-Anmeldungen pro Kanal** — dafür braucht die Warteliste ein
   Herkunftsfeld („Woher kennst du uns?" mit Dessau / Instagram / TikTok /
   Empfehlung / Suche) oder getrennte QR-/Link-Ziele. Ohne das ist keine
   Kanalbewertung möglich. → Rückfrage 10.1.
2. **Gestartete Testphasen** (und woher).
3. **Testphase → zahlend** in Prozent.
4. **Empfehlungen pro aktivem Kunden** (beim Abschluss fragen: „Wer hat's dir
   gezeigt?").

Dazu eine fünfte, nach innen: **tatsächliche Marketing-Stunden pro Woche.**
Wenn die über sechs liegen, frisst Marketing das Produkt.

**Abbruchkriterien nach 6–8 Wochen** stehen je Kanal im Sheet („Annahmen").
Kurz: Dessau ohne 3 Gespräche → Material ändern, ohne Testphase → nur noch
pflegen. Social ohne 300 Follower oder ohne einen Post über 1.000 Views →
Formate wechseln; nach 4 Monaten ohne eine Warteliste-Anmeldung → Kadenz
halbieren. Kalter Fachhandel ohne Testphase pro Laden → nicht ausrollen.
Content/SEO ohne Suchbesuche nach 6 Monaten → auf einen Artikel im Monat.

### 7. Saisonalität

Meine Einschätzung aus der Branche, nicht gemessen: Maler und Bodenleger
schreiben die meisten Angebote **Februar bis April** (Frühjahrsaufträge,
Innenrenovierungen vor Ostern) und noch einmal **September/Oktober**
(vor dem Winter). **November bis Januar** ist Flaute — wenig Angebote, aber
Zeit, etwas Neues anzusehen. **Mai bis August** ist Hochsaison auf der
Baustelle: keine Zeit für Tools, wenig Angebote, weil die Bücher voll sind.

Für den Plan heißt das: Gate 1 im Dezember trifft Leute mit Zeit — gut zum
Ausprobieren, schlecht zum Abschließen. Der Launch im Januar liegt genau vor
der Angebotssaison — der beste Zeitpunkt des Jahres. Die Gründerplätze
sollten deshalb in **Februar/März** den größten Sprung machen; im Sommer
wird es zäh, egal was wir tun. Der zweite Schub kommt im September 2027. Im
Sheet ist das grob abgebildet (Dessau und Social liegen im Feb/Mär höher).

### 8. Für Finance — die drei Dinge, die ins Modell gehören

1. **`docs/gtm-kanalplan.xlsx`, Blatt „Kanal x Monat":** Neukunden je Kanal
   je Monat in drei Szenarien (blau = meine Eingaben), Stunden getrennt nach
   Sandy / Clemens / Head of Marketing, Sachkosten, Summenzeilen, kumulierte
   Kurve und Gründerplatz-Zähler (realistisch), Kapazitätsabgleich gegen beide
   Linien aus Nachtrag 4. Insgesamt ~1.430 € Sachkosten über 24 Monate — das
   ist kein Werbebudget, das ist Druck, Fahrt und ein Mikrofon.
2. **Blatt „Mundpropaganda":** Parameter statt Monatszahlen, weil die aktive
   Basis bei dir liegt. Bitte mit Verzögerung anwenden.
3. **Das Klumpenrisiko für das vorsichtige Szenario:** In den ersten sechs
   Monaten kommen realistisch 5–6 der ersten 10 zahlenden Betriebe aus
   Dessau — aus einem Laden, über einen Menschen. Fällt der aus (Jobwechsel,
   Krankheit, Streit), fehlt die Hälfte der Anlaufkurve, und nichts ersetzt
   sie kurzfristig. Das vorsichtige Szenario im Sheet rechnet Dessau mit 4
   statt 9 — bitte genau so stehen lassen.

Zur Kapazitätsfrage: Marketing liegt Dez–Mär bei 23–25 % der 65-Stunden-
Linie, ab April 2027 bei ~30 %, weil der kalte Fachhandel dazukommt. Das
geht nur, wenn nach dem Launch die Produktzeit sinkt oder B1 greift. Wenn
beides nicht eintritt, wird Kanal 5 verschoben, nicht das Produkt gekürzt —
das ist im Sheet mit einer Eingabe pro Zeile abbildbar.

### 9. Was ich nicht weiß — und was daraus folgt

- **Wie groß Dessau ist.** Der wichtigste offene Wert. Wird im Oktober
  erfragt (Abschnitt 3).
- **Wie viele Adressen heute auf der Warteliste stehen** und ob sie eine
  Herkunft haben. Chief of Staff hat angeboten, das nachzusehen — bitte.
- **Ob Social Media in dieser Nische in sechs Monaten 800 oder 3.000 Follower
  bringt.** Ich habe mit 800–2.500 gerechnet. Die Varianz ist größer als bei
  jedem anderen Kanal; ein einziges gut laufendes Reel kann einen Monat
  Warteliste füllen. Der Plan rechnet ohne solche Ausreißer.
- **Ob Handwerker per QR-Code auf eine Warteliste gehen.** Der Meister 45+
  vermutlich nicht — der will die Telefonnummer von Clemens. Deshalb steht
  auf dem Aufsteller beides.
- **Ob das Produkt im Dezember Gate 1 erreicht.** Wenn nicht, verschiebt sich
  alles ab P2 um genau die Zeit — Dessau und die Warteliste halten das aus,
  Social Media nicht ohne Weiteres (angekündigt ist angekündigt).

### 10. Rückfragen und Entscheidungen

**An Sandy (Positionierungs-/Preisfragen, nur sie):**

1. **Empfehlungs-Anreiz — ja oder nein?** Vorschlag: „Ein Kollege, ein Monat
   geschenkt" (der Empfehlende bekommt einen Monat frei, wenn der Kollege
   zahlend wird). Kostet 49 € Umsatz pro Empfehlung, hebt Kanal 4 spürbar.
   Nicht eingerechnet, weil es eine Preisentscheidung ist.
2. **Dankeschön für den Dessau-Kontakt** — meine Empfehlung steht in
   Abschnitt 3 (keine Provision). Bitte bestätigen oder ändern.
3. **Drehtage im Oktober** — drei Samstage, Vorschlag 10./17./24.10. Passt
   das mit Clemens' Baustellen?

**An Chief of Staff (Weiterleitung):**

4. **Herkunftsfeld auf der Warteliste** (oder getrennte Link-Ziele je Kanal)
   — an Head of Product Engineering, klein, aber ohne das ist Abschnitt 6
   nicht messbar. Ideal vor dem ersten Dessau-Flyer.
5. **Aktueller Stand der Warteliste** (Anzahl, seit wann) — dein Angebot vom
   03.09., bitte einlösen.
6. **Gründerplatz-Zähler auf der Landingpage** („7 von 25") — gehört in den
   Landingpage-Rebuild (CoS-M-006/CoS-038), ein von Hand pflegbarer Wert
   reicht.
7. **Kampagnentexte an Legal** vor Veröffentlichung (Bestandsschutz „dauerhaft
   29 €", KI-Kennzeichnung auf Flyer/Aufsteller).

### 11. Optionaler bezahlter Test — eigener Vorschlag, NICHT im Plan eingerechnet

Wenn Social Media bis Ende Februar unter 300 Followern liegt, aber ein
einzelnes Reel nachweislich Warteliste-Anmeldungen gebracht hat, wäre ein
**einmaliger Test von 150 € auf genau dieses Reel** (Instagram/TikTok, Region
Sachsen-Anhalt/Berlin, Zielgruppe Handwerk) der billigste Weg, um
herauszufinden, ob Reichweite das Problem ist oder die Botschaft. Kein
Dauerbudget, kein zweiter Test ohne Auswertung. Das ist eine Entscheidung
gegen die Festlegung vom 18.08. — deshalb steht es hier und nicht im Sheet.
Sandy entscheidet, wenn der Fall eintritt, nicht vorher.

**Nächster Schritt auf meiner Seite:** Sobald Sandy die drei Fragen in
Abschnitt 10 beantwortet hat, liefere ich die Oktober-Produktion vor:
Aufsteller + Flyer druckfertig (in der CI, mit Slogan, Beispiel-Angebot,
QR), die Hook-Zettel für die drei Drehtage aus dem Content-Kalender (auf
9:16 und „du" umgestellt), die November-Warteliste-Mail und die
Kampagnentexte für die 25 Plätze zur Legal-Prüfung.

---

## CoS-M-007 — Antwort des Chief of Staff auf Abschnitt 10 (03.09.2026)

Starker Plan. Er tut genau das, was der Auftrag wollte: Sandy weiß, was sie
nächste Woche tut, Finance kann ihn ohne Rückfrage übernehmen, und er sagt,
was ihr nicht wisst. Head of Finance hat ihn seit heute als Grundlage
(CoS-F-003, Nachtrag 7).

**Zu deinen Weiterleitungen:**

- **10.4 Herkunftsfeld** → **CoS-040** bei Head of Product Engineering, mit dem
  Hinweis, dass er sich mit dir über die Link-Form abstimmt, *bevor* der
  Aufsteller gedruckt wird. Bitte melde dich bei ihm, sobald du weißt, wie
  der QR-Link aussehen soll.
- **10.5 Stand der Warteliste — nachgesehen:** **ein Eintrag**, vom
  02.08.2026, vermutlich ein Test von Sandy selbst. Kein Herkunftsfeld (die
  Tabelle hat nur `email` und `created_at`). Es gibt also keine
  Vorlauf-Nachfrage — dein Plan fängt bei null an, und das ist auch richtig
  so.
- **10.6 Gründerplatz-Zähler** → ebenfalls CoS-040, im selben Durchgang wie die
  Preisumstellung (CoS-038). Von Hand gepflegt, wie du es willst.
- **10.7 Kampagnentexte an Legal** → ja, über mich. Schick sie hier ein, sobald
  sie stehen; CoS-L-002 (Bestandsschutz „dauerhaft 29 €") läuft bei Legal
  ohnehin, ich hänge die Texte dort an.

**Deine drei Fragen an Sandy** (10.1–10.3) stehen jetzt in
`entscheidungen-fuer-sandy.md`. Zwei Dinge, die du inzwischen wissen solltest:

- **Sandy gründet direkt eine UG**, kein Einzelunternehmen (CoS-L-003, heute
  entschieden). Für dich relevant: Impressum, Flyer und Aufsteller müssen die
  UG nennen, sobald sie eingetragen ist — Legal liefert die Formulierung
  (Zusatz „UG (haftungsbeschränkt)" darf nirgends fehlen). Bitte das
  Druckmaterial so bauen, dass der Impressumsblock erst ganz zum Schluss
  eingesetzt wird.
- **Dein Abschnitt 11** (150-€-Test) habe ich Sandy bewusst *nicht* jetzt
  vorgelegt — du hast selbst geschrieben „wenn der Fall eintritt, nicht
  vorher". Ich halte ihn im Blick und bringe ihn Ende Februar zu ihr, falls
  die Bedingung eintritt.

---

## CoS-M-007 — Korrektur einer Anweisung von mir (Chief of Staff, 03.09.2026, abends)

**Ich muss eine Aussage von heute Nachmittag zurücknehmen.** In meiner Antwort
auf deinen Kanalplan steht: *„Sandy gründet direkt eine UG … Impressum, Flyer
und Aufsteller müssen die UG nennen, sobald sie eingetragen ist."*

**Das gilt nicht mehr.** Sandy hat am selben Abend, nach einem Austausch mit
Head of Legal, anders entschieden: **Einzelunternehmen jetzt, UG erst bei rund
20 zahlenden Betrieben** (S-4 Teil 4 in `entscheidungen-fuer-sandy.md`, Plan in
`legal-007-plan-fuer-sandy.md`). Der Grund war der Finanzplan: Der erste
zahlende Kunde ist einer, nach sechs Monaten sind es drei bis fünf — für diese
Größenordnung trägt die Versicherung das Risiko, nicht die Rechtsform.

**Was das für dein Druckmaterial heißt — und es macht es einfacher:**

- Die korrekte Bezeichnung ist **„Sandra Holm — Sofortangebot"**, nicht
  „Sofortangebot UG (haftungsbeschränkt)". Der volle Name muss dabei stehen,
  „Sofortangebot" allein reicht rechtlich nicht (§ 5 DDG).
- Der Zeitpunkt entspannt sich: Das Gewerbe wird in der **Woche vom 05.10.**
  angemeldet, also **vor** deinem Produktionsfenster für Aufsteller und Flyer.
  Du kannst die Angaben von Anfang an richtig setzen, statt einen Platzhalter
  zu lassen — den genauen Wortlaut inklusive Anschrift liefert Head of Legal
  direkt nach der Anmeldung (CoS-041).
- **Kein Umsatzsteuerausweis** auf irgendetwas, was nach außen geht: Sandy ist
  Kleinunternehmerin nach § 19 UStG. Für deine Preisdarstellung auf Flyer,
  Aufsteller und Landingpage ist das relevant — bitte mit CoS-L-002 abstimmen,
  bevor „49 €" irgendwo gedruckt wird.

Entschuldige die Rolle rückwärts. Es war innerhalb von 24 Stunden die zweite
Wende in der Rechtsform-Frage, und ich habe dir die mittlere Fassung als
gesichert verkauft, obwohl sie es nicht war.

---

## CoS-M-008 — Sandys drei Beschleuniger: Blog/SEO, Micro-Influencer, Tempo

**Datum:** 2026-09-03 (Chief of Staff)
**Status:** ❌ offen — Sandy will das direkt mit dir besprechen; das hier ist
die Vorbereitung, damit ihr nicht bei null anfangt.

**Sandys Ausgangspunkt, wörtlich:** *„ehrlicherweise ist mir das in der Liste
zu langsam."* Sie meint deinen Kanalplan, und sie hat recht: 47 Betriebe nach
24 Monaten im realistischen Szenario ist solide, aber es ist nicht das Tempo,
das zu ihrer Ambition passt. Sie kommt mit drei eigenen Ideen. **Bitte
bewerte sie als Kanäle — das ist dein Fach, nicht meins.** Ich liefere nur den
Rahmen und die Punkte, die außerhalb deines Zuständigkeitsbereichs liegen.

### Idee 1 — Wöchentlich ein Blogartikel für SEO, ab dem Tag, an dem die Website online ist

**Was ich dazu beisteuere, ohne dir vorzugreifen:**

- **Der Kanal ist in deinem Plan der langsamste** (6–12 Monate gegen Null, dann
  kleines Niveau, 0/3/8 Betriebe über 24 Monate) und **verlangt den größten
  laufenden Zeiteinsatz von Sandy**. Ein Artikel pro Woche ist bei ehrlicher
  Rechnung ein bis drei Stunden — das ist die Hälfte bis das Ganze ihres
  Marketing-Budgets von rund vier Stunden. Wenn dieser Kanal kommt, geht ein
  anderer, oder die Ausführung leidet überall. Das ist die Frage, die ihr
  klären müsst, bevor ihr über Themen redet.
- **Sie hat aber einen echten Vorteil, den generische Content-Strategien nicht
  haben:** Dieses Projekt hat seit Monaten fachliche Substanz aufgebaut, die
  im Netz kaum jemand sauber erklärt — Übermessungsregeln nach VOB,
  Fensterlaibungen richtig abrechnen, Verschnittsätze, Zuschlagssätze,
  Türbreiten bei Sockelleisten. Das sind Fragen, die Maler und Bodenleger
  tatsächlich suchen, und die Antworten liegen bereits in
  `vob-angebot-abstimmung.md` und `pruefmeister-testfaelle.md`. **Das ist kein
  Content-Marketing, das ist ein Nebenprodukt der Produktarbeit.** Wenn ein
  Artikel daraus in einer Stunde statt in drei entsteht, sieht die Rechnung
  völlig anders aus.
- **Mein Vorschlag zur Prüfung: ein Thema, zwei Ausspielungen.** Derselbe
  Fachinhalt wird ein Artikel *und* zwei bis drei Hooks für Clemens vor der
  Kamera. Dann ist es eine Arbeit statt zwei, und die Content-Säule
  „Fach-Autorität" aus CoS-M-002 speist sich aus derselben Quelle.
- **Sichtbarkeit heute heißt nicht nur Google.** Handwerker fragen inzwischen
  auch KI-Assistenten nach genau solchen Rechenfragen. Ob und wie man dafür
  schreibt, ist deine Einschätzung — ich flagge nur, dass „SEO" 2026 nicht
  mehr dasselbe ist wie 2020.
- **Harte Abhängigkeit, die niemand auf dem Schirm hatte:** `sofortangebot.app`
  zeigt derzeit nur die Warteliste, die eigentliche Seite liegt hinter dem
  Schalter `NEXT_PUBLIC_COMING_SOON`. **Solange die Seite dunkel ist, läuft die
  SEO-Uhr nicht.** Bei sechs bis zwölf Monaten Anlaufzeit ist jeder Monat
  Verzögerung ein Monat später Wirkung. Ich habe das als Entscheidung zu Sandy
  gelegt — bitte sag mir, ab wann du die Seite fachlich brauchst, dann kann sie
  das gegen Legals Zeitplan abwägen.

### Idee 2 — Micro-Influencer im Handwerk ansprechen

Sandys Idee: kleine Accounts von Malern und Bodenlegern (Größenordnung 2.000
Follower), die sich bei der Arbeit filmen. Deren Follower sind selbst
Handwerker. Angebot: Tool gratis nutzen, dafür Feedback — und wenn es gefällt,
vielleicht eine Story.

**Meine Einschätzung, und ich sage sie deutlich: Das ist die stärkste der drei
Ideen, und sie ist strukturell dasselbe wie Dessau.** Vertrauen wird von
jemandem geliehen, dem die Zielgruppe schon vertraut. Der Unterschied: Dessau
ist ein Mensch an einem Ort, das hier skaliert — viele Accounts, keine
Anfahrt, und es löst nebenbei Sandys größtes Startproblem, nämlich dass sie
und Clemens nur null bis zwei Handwerker persönlich kennen. **Es erzeugt warme
Kontakte, statt auf sie zu warten.** Bitte prüf, ob du das als eigenen Kanal
in den Plan aufnimmst — ich würde es erwarten.

**Vier Randbedingungen, die nicht in dein Fach fallen, aber gelten:**

1. **Werbekennzeichnung.** Gratis-Nutzung gegen Story ist eine
   Gegenleistung — das ist gekennzeichnete Werbung, und zwar auf Seiten des
   Handwerkers. Ich habe Head of Legal unter **CoS-L-004** gebeten, die Regeln
   und einen Textbaustein zu liefern, den Sandy den Leuten mitgeben kann.
   Bitte keine Ansprache verschicken, bevor das da ist.
2. **Gratis-Accounts widersprechen der Preisentscheidung**, wenn sie
   unbegrenzt sind. Sandy hat am 03.09. den Dauer-Gratis-Tarif abgeschafft.
   Eine bewusste Ausnahme für eine handvoll Testpartner ist etwas anderes als
   ein stiller Free-Tier — sie braucht eine Regel (wie viele, wie lange, was
   danach). Das ist eine Preisentscheidung, sie liegt bei Sandy und gehört in
   `docs/preismodell.md`; ich habe sie dort als offenen Punkt vermerkt.
3. **Jeder dieser Accounts ist eine Support-Beziehung.** Gate 1 ist auf fünf
   bis acht begleitete Nutzer ausgelegt, und das ist Sandys Zeit. Bitte im
   Kanalplan mit Stunden führen wie jeden anderen Kanal.
4. **Reichweite verstärkt Qualität — in beide Richtungen.** Jemand mit 2.000
   Handwerker-Followern, der ein falsch gerechnetes Angebot zeigt, ist der
   teuerste Weg, den es gibt, um einen Rechenfehler öffentlich zu machen.
   **Deshalb gehört dieser Kanal hinter den Prüfmeister-Nachtest zu VOB-013 und
   hinter Sandys 100 Testfälle**, nicht davor. Terminlich heißt das:
   Ansprache frühestens im Dezember, Ausspielung ab Januar.

### Idee 3 — das Tempo insgesamt

Sandy findet den Plan zu langsam. Meine Einordnung für euer Gespräch: **Die
Langsamkeit kommt nicht aus schlechter Kanalwahl, sondern aus zwei Zahlen** —
ein einziger warmer Kanal, und rund vier Stunden Marketing pro Woche. Ihre
Ideen greifen die erste Zahl an, die zweite nicht. Jeder neue Kanal braucht
Stunden, die es nicht gibt.

**Was ich davon für den wirksamsten Hebel halte** (deine Bewertung geht vor):
Von Sandys drei Ideen ist die Influencer-Ansprache die einzige, die **du
weitgehend übernehmen kannst** — Accounts recherchieren, Ansprache
formulieren, Nachfassen vorbereiten. Sandy müsste nur freigeben und die
Beziehung führen. Das ist der höchste Ertrag pro Sandy-Stunde von allem, was
gerade auf dem Tisch liegt. Der Blog ist das Gegenteil: fachlich muss sie
liefern, weil das Wissen bei ihr und im Produkt liegt.

**Bitte bring in euer Gespräch eine ehrliche Antwort auf die Frage mit: Was
fällt weg, wenn Blog und Influencer dazukommen?** Nicht „alles geht", sondern
eine Reihenfolge. Und wenn deine Antwort lautet, dass das Tempo ohne mehr
Stunden oder Geld nicht steigt, sag genau das — das ist eine strategische
Information und keine schlechte Nachricht.

---

## CoS-M-009 — Positionierung: bewusst keine KI-Werbesprache

**Datum:** 2026-09-06
**Status:** ✅ entschieden (Sandy direkt) — gilt ab sofort als Leitplanke für
alle Texte/Ansprache
**Quelle:** Sandy direkt im Gespräch mit dem Chief of Staff, 2026-09-06,
ausgelöst durch den Vergleich mit dem neuen Wettbewerber Kalkulai (siehe
unten)

Sandy will explizit nicht mit „KI" werben. Begründung in ihren eigenen
Worten: die Zielgruppe interessiert sich nicht dafür, was technisch
passiert — die App soll sich wie ein kleiner Helfer anfühlen, nicht wie ein
Tech-Produkt. Ziel: null Einstiegshürde, Lust es zu nutzen, über Optik/
Farben statt über die Technologie dahinter.

**Warum das mehr ist als Geschmack:** Kalkulai (neuer, ernstzunehmender
Wettbewerber, siehe unten) positioniert sich stark über „KI" — „Dein
KI-Bürokollege fürs Handwerk". Sofortangebot grenzt sich damit jetzt nicht
nur über den schärferen Funktionsumfang ab (siehe `vision-strategie.md`,
Geklärt 31.08.), sondern zusätzlich über die Tonalität: Ergebnis verkaufen,
nicht Technologie. Deckt sich mit dem bereits entschiedenen Slogan
(CoS-M-005, „Aufmaß fertig. Angebot fertig.") — das war also schon die
richtige Richtung, jetzt ist der Grund dafür explizit.

**Für dich als Auftrag:** bitte alle Copy-Bausteine (Landingpage,
Social-Media-Vorgabe CoS-M-003, künftige Ansprache-Texte für Idee 2/
Micro-Influencer unter CoS-M-008) auf Tech-/KI-Vokabular durchsehen und
gegen Handwerkervokabular tauschen, wo es sich eingeschlichen hat. Kein
akuter Fix nötig, aber bitte als stehende Prüf-Regel für alles Neue
mitnehmen.

**Nebenbei, zur Einordnung (gleicher Anlass, kein eigener Punkt):**

- **Neuer Wettbewerber: Kalkulai** (München, EXIST/TUM/UnternehmerTUM-
  gefördert). Sprache/Text → Angebot in ca. 4 Minuten, arbeitet auch mit
  VOB/C + DIN 18363. Zielgruppe Maler/Putz/Trockenbau, kein Bodenleger —
  das bleibt eine unbesetzte Nische für uns. Bündelt zusätzlich E-Mail/
  WhatsApp/Anrufe, ZUGFeRD/XRechnung, Personaleinsatzplanung, Mahnwesen,
  Projektgedächtnis — deutlich breiter als Sofortangebot. Pilotpreis
  19 €/Monat (1.9.–30.11.), danach offen. Volle Einordnung in
  `docs/vision-strategie.md`.
- **Reel-Feedback (zu CoS-M-002/Dreh mit Clemens):** erstes Reel („Vorher:
  Zettel sortieren…" → „Nachher"-Demo mit Rechenweg → Outro) vom Chief of
  Staff angeschaut. Konzept und Dramaturgie sitzen, der aufklappbare
  Rechenweg ist der stärkste Moment im Video und sollte eher betont als
  gekürzt werden. Zwei technische Punkte vor dem Posten: (1) die Datei hat
  aktuell **keine Audiospur** — für Reels/TikTok ein reales
  Reichweiten-Risiko, sollte vor Veröffentlichung noch Ton bekommen
  (Trend-Sound oder Werkstatt-Atmo, offen); (2) der Einstieg ist zwei
  Sekunden reiner Text, bevor sich etwas bewegt — ggf. mit dem visuellen
  Vorher-Chaos direkt öffnen statt mit der Textkarte.
- **Cold E-Mail als möglicher vierter Kanal** von Sandy angedacht, vom
  Chief of Staff eingeordnet: für einzelne Handwerker vermutlich ein
  schwacher Kanal (Geschäftspostfächer werden selten aktiv geprüft), eher
  denkbar als Ansprache von Multiplikatoren (Innungen, Handwerkskammern)
  statt einzelner Betriebe. Keine Entscheidung, nur als Gedanke
  festgehalten.

---

## CoS-M-010 — „3 Angebote kostenlos" ungenau seit der harten Grenze

**Datum:** 2026-09-07
**Status:** ✅ Sandy hat freigegeben (07.09.2026, im Chat) — Umsetzung an
Head of Product Engineering übergeben
**Quelle:** Head of Product Engineering an den Chief of Staff, über
`docs/chief-of-staff-todos.md`, 2026-09-07

Seit dem 06.09. ist das Freikontingent eine **harte** Grenze und zählt nur
**neu angelegte** Angebote — eine Überarbeitung eines bestehenden Angebots
zählt nicht mit (Sandys Entscheidung „A — harte Grenze"). Zwei Stellen im
Produkt sagen das nicht:

- Landingpage (`PreiseSection.tsx`): „3 Angebote kostenlos"
- Upgrade-Fenster (`PlanWahlModal.tsx`): „3 Angebote / Monat"

Beide sind ungenauer als das, was das Produkt tatsächlich tut. Die
Ungenauigkeit wirkt aktuell zugunsten des Kunden (er könnte glauben, jede
Überarbeitung zählt mit) — aber genau diese Konstellation, eine beworbene
Zahl, die anders wirkt als das, was tatsächlich passiert, hat Legal bisher
jedes Mal 🔴 gesetzt.

**Vorschlag (Head of Product Engineering, vom Chief of Staff mitgetragen):**
„3 neu angelegte Angebote pro Monat — Überarbeitungen zählen nicht mit."
Textänderung in den zwei genannten Dateien.

**Bewusst nicht umgesetzt:** Marketing-/CI-Text wird hier nicht ungefragt
angefasst, das braucht laut Governance dieser Datei Sandys Freigabe.

**Sandys Freigabe (07.09.2026, im Chat):** „hast mein ok" — Wortlaut wie
vorgeschlagen: „3 neu angelegte Angebote pro Monat — Überarbeitungen zählen
nicht mit." Geht als Ein-Zeilen-Fix an Head of Product Engineering zurück
(`PreiseSection.tsx`, `PlanWahlModal.tsx`).

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

### Dein Feld — und du bist der Grund, warum es leer ist

**Punkt 9.1 — Landingpage erklaert klar, was das Tool tut und fuer wen.**
Gate-1-Punkt, steht auf **0**. Ohne ihn weiss ein Testnutzer nicht, was er vor
sich hat, bevor er sich anmeldet.

**Die Rolle Marketing hatte bis heute keine stuendliche Aufgabe** und ist
deshalb seit dem 07.09. still. Das ist mein Versaeumnis, nicht deins.

**Erste Schritte, ohne Sandy:**

1. Die Landingpage im Browser der Claude-App ansehen (`sofortangebot.app`) und
   ehrlich bewerten: Versteht ein Malermeister in 15 Sekunden, was das ist?
2. Was fehlt, benennen — nicht gleich umschreiben.
3. Erst dann einen Vorschlag, gemeinsam mit dem Product Designer
   (`design-check.md`). **Inhalt gehoert dir, Aufbau und Aussehen ihm.**

Sandy will den Text am Ende mit euch durchgehen — sie hat ausdruecklich
gesagt, sie moechte die Landingpage inhaltlich mitgestalten. Also einen
Entwurf, keine fertige Seite.

*Chief of Staff · 2026-09-16*

---

## Punkt 9.1 — Landingpage: die Bewertung (Head of Marketing, 2026-09-16)

**Auftrag:** Chief of Staff, 16.09., „Leere Felder". Ansehen, ehrlich bewerten,
benennen was fehlt — noch nichts umschreiben. Genau das steht hier.
**Nicht geschätzt, wo gemessen werden konnte** — jede Zahl unten ist heute
nachgezählt, die Quelle steht dabei.

### 1. Was ein Besucher heute wirklich sieht — live gemessen

`sofortangebot.app`, im Browser der Claude-App aufgerufen, 16.09.:
**eine einzige Bildschirmseite, sonst nichts.** Wortlaut vollständig:

> sofortangebot · **Schluss mit stundenlangen Angeboten.** · Einfach aufs Handy
> sprechen — sofortangebot rechnet, schreibt und schickt. Für Maler,
> Bodenleger und alle, die keine Zeit verlieren wollen. · Früher Zugang — trag
> dich ein: [E-Mail] **Zugang sichern →** · Kein Spam. Einmalige Nachricht wenn
> es losgeht.

**Meine Bewertung dieser Seite, ehrlich:** für eine Wartelisten-Seite ist sie
gut. Der Satz sagt in 15 Sekunden, was das Ding tut („aufs Handy sprechen —
rechnet, schreibt, schickt") und für wen. Die Schwachstelle ist der Anhang
**„und alle, die keine Zeit verlieren wollen"** — das ist das Gegenteil von
Spezialisierung und widerspricht dem, was uns von Kalkulai unterscheidet
(CoS-M-009: „Spezialisiert. Mit Absicht."). Ein Fliesenleger trägt sich ein,
bekommt Zugang und findet sein Gewerk nicht.

**Und trotzdem ist Punkt 9.1 damit nicht erfüllt.** Nicht weil der Text
schlecht wäre, sondern weil sich hinter dieser Seite **niemand anmelden kann**.
Der Gate-1-Punkt lautet „bevor er sich anmeldet" — es gibt live keinen
Anmeldeweg, nur eine Warteliste. Die eigentliche Landingpage liegt hinter
`NEXT_PUBLIC_COMING_SOON` im Dunkeln (bekannt seit 03.09., Designer und Chief
of Staff haben es unabhängig gesehen).

**Punkt 9.1, ehrliche Bewertung: 0 von 100 bleibt richtig — aber aus einem
anderen Grund als angenommen.** Nicht der Text fehlt. Der Text ist zu 80 %
fertig und liegt im Code. **Er ist nur nicht eingeschaltet, und in drei Punkten
sagt er etwas anderes als das Produkt tut.** Das ist eine gute Nachricht: hier
liegt kein Monat Arbeit, hier liegen Korrekturen und ein Schalter.

### 2. Die eigentliche Landingpage — gelesen im Code, Sektion für Sektion

`src/app/page.tsx` baut elf Sektionen: Nav · Hero · VorherNachher ·
WieFunktioniert · Testimonial · Features · Integrationen · Preise · FAQ · CTA ·
BlogTeaser · Footer. Ich habe den sichtbaren Text aller elf gelesen.

**Der 15-Sekunden-Test für einen Malermeister — was oben steht:**

> 🖌 Für Malerbetriebe · **„Sprich dein Aufmaß ein. Fertig gerechnet, bevor du
> im Auto sitzt."** · daneben eine Sprachnachricht (0:19, „Wohnzimmer, fünf mal
> vier…"), darunter dieselbe Sache als fertige Angebotskarte mit
> „43,71 m² = 18 lfm Umfang × 2,60 m − Fenster − Tür".

**Das besteht den Test.** Überschrift, Bild und Beleg sagen dasselbe, in der
Sprache der Zielgruppe, ohne ein einziges Tech-Wort. Der Rechenweg direkt im
Hero ist der stärkste Moment der Seite — dasselbe Urteil, das der Chief of
Staff über den stärksten Moment im Reel gefällt hat (CoS-M-009). **Inhaltlich
ist der Kopf der Seite fertig. Ich fasse ihn nicht an.**

Auch stark und unverändert lassen: „Spezialisiert. Mit Absicht.", die
VorherNachher-Gegenüberstellung (22:47 Uhr / 17:03 Uhr), und die FAQ-Antwort
„Woher weiß ich, dass die Mengen stimmen?".

**KI-Vokabular-Prüfung (stehende Regel aus CoS-M-009): die Seite ist sauber.**
Ein einziges Vorkommen, in der FAQ — „Sofortangebot schätzt keine Flächen mit
KI, sondern berechnet sie". Das ist die Technologie als *Abgrenzung*, nicht als
Werbung, und genau der Satz, der uns von Kalkulais „KI-Bürokollege" trennt.
**Mein Urteil: stehen lassen.** Bewusste Ausnahme, kein Versehen.

### 3. Was fehlt — die Befunde

**🔴 A · Vier Gratis-Versprechen auf einer Seite, und alle vier sind
verschieden.** Gemessen, alle vier im Code:

| Stelle | Was dort steht |
|---|---|
| `HeroSection.tsx` | „Die ersten **5** Angebote kostenlos" |
| `PreiseSection.tsx` (Free) | „**3** neu angelegte Angebote pro Monat — Überarbeitungen zählen nicht mit" |
| `PreiseSection.tsx` (Pro-Knopf) | „**30 Tage** gratis testen" |
| `CTASection.tsx` | „**Erstes** Angebot kostenlos erstellen" |

Der Besucher kann aus derselben Seite 5, 3, 30 Tage oder 1 herauslesen. Der
Free-Satz ist der einzige korrekte — das ist CoS-M-010, sauber umgesetzt aus
`lib/pricing.ts`. Die drei anderen sind hart eingetippte Zahlen und haben die
Korrektur nicht mitbekommen. **Genau die Konstellation, die Legal bisher jedes
Mal 🔴 gesetzt hat.**

**🔴 B · Die ganze Preis-Sektion bewirbt das abgelöste Preismodell.** Sie zeigt
einen Dauer-Gratis-Tarif „Reinschnuppern 0 €" und 22 €/17 €. Entschieden ist
seit 03.09. (`docs/preismodell.md`, von Sandy freigegeben) etwas anderes:
**49 €, ein Plan · Gründerpreis 29 € dauerhaft für die ersten 25 zahlenden
Betriebe · 14 Tage voll testen ohne Kreditkarte · kein Dauer-Gratis-Tarif.**
Das Backend läuft bereits nach dem neuen Modell (`api/stripe/route.ts` vergibt
25 Gründer-Slots, `trial_ends_at` steht auf 14 Tagen) — **nur die Texte nicht.**
Die Seite würde also einen Tarif bewerben, den es nicht mehr gibt.
**„30 Tage gratis testen" ist in beiden Modellen falsch** — im alten gab es gar
keine Testphase, im neuen sind es 14 Tage.
**Nicht mein Punkt zum Beheben:** das ist CoS-038 (Engineering, ❌ offen,
`lib/pricing.ts` noch auf 22/17/3). Ich hänge hier dran und melde es, statt es
anzufassen. Der Text kommt von mir, sobald CoS-038 losgeht.

**🟠 C · Die Zielgruppe steht an drei Stellen verschieden da.** Hero-Badge:
„🖌 Für Malerbetriebe" (nur Maler). FAQ und Gewerke-Sektion: „Maler und Boden".
Wartelisten-Seite: „Maler, Bodenleger und alle". **Ausgerechnet der Hero —
die einzige Stelle, die in 15 Sekunden gelesen wird — lässt die Bodenleger
weg.** Das ist die Nische, die Kalkulai nicht bedient (CoS-M-009). Ein
Bodenleger, der auf den Hero schaut, klickt weg, bevor er zur FAQ kommt.

**🟠 D · Zwei Positionszahlen sind zu hoch. Heute nachgezählt in
`lib/default-prices.ts`:**

| Sektion behauptet | Tatsächlich im Katalog |
|---|---|
| Maler: „Über **300** vorbereitete Positionen" | **216** |
| Boden: „Über **200** vorbereitete Positionen" | **188** |

Beide Aussagen halten nicht. Ehrlich wären „über 200" (Maler) und „über 180"
(Boden) — immer noch gute Zahlen. Der Designer hatte am 03.09. 164/177
gemessen; der Katalog ist seither gewachsen, die Werbeaussage war aber schon
damals zu hoch. Vor dem Livegang korrigieren oder streichen.

**🟠 E · Die Integrationsliste behauptet mehr, als ich belegen kann.** Die
Sektion setzt einen grünen Punkt „Bereits integriert" über **Lexware, sevDesk,
DATEV**. An zwei anderen Stellen derselben Seite (Features, Preise) heißt es
dagegen nur **„Lexoffice oder sevDesk"**. Drei Widersprüche in einem: Lexware
und Lexoffice sind zwei verschiedene Produkte, DATEV taucht sonst nirgends als
fertige Anbindung auf, und „bereits integriert" ist eine Tatsachenbehauptung.
**Frage an Engineering gestellt** (siehe unten) — bis die Antwort da ist,
bewerbe ich keinen Namen aus dieser Liste.

**🟡 F · „Antwort innerhalb eines Werktages" (FAQ, Fußzeile der Sektion).**
Das ist ein Serviceversprechen, das ein Einzelbetrieb im Urlaub bricht. **Frage
an Sandy gelegt.**

**🟡 G · Das beste Material der Seite liegt nicht auf der Seite.** Seit heute
liegt `docs/landingpage-fuenf-beispiele.md` fertig: fünf durchgerechnete
Beispiele, Staffelung einfach → Boden → mehrere Räume → Spezialtätigkeit →
Rückfrage, jede Zahl durch den Prüfstand. **Das ist der stärkste Beweis, den wir
haben, und er steht in keiner der elf Sektionen.** Er gehört in die Seite. Die
Auflage aus der Arbeitsreihenfolge (Beispiel 4 umgeht PM-098 heute dadurch, dass
Fenster und Tür nicht im Satz stehen — Krücke raus) nehme ich in den Entwurf
mit.

**🟡 H · Kein Social Proof, und das ist richtig so.** Kein Nutzer, keine
Referenz (CoS-M-007, Abschnitt 6). Die Sektion heißt `TestimonialSection`,
enthält aber richtigerweise kein erfundenes Zitat, sondern die Gewerke-Liste.
**Nichts zu tun außer: erfindet niemand eines.** Der Dateiname ist eine
Kleinigkeit für den Designer, kein Inhaltsproblem.

### 4. Zusammengefasst — was 9.1 von 0 auf grün bringt

1. Vier Gratis-Versprechen auf eines zusammenführen (A) — mein Text, sobald B steht.
2. Preis-Sektion auf das entschiedene Modell (B) — **hängt an CoS-038, Engineering.**
3. Bodenleger in den Hero (C) — mein Text.
4. Zwei Zahlen korrigieren (D) — gemessen, Formulierung von mir.
5. Integrationsliste belegen oder kürzen (E) — **hängt an Engineerings Antwort.**
6. Die fünf Beispiele in die Seite (G) — Inhalt von mir, Aufbau vom Designer.
7. Schalter umlegen — **Sandys Entscheidung**, sie liegt bereits in
   `entscheidungen-fuer-sandy.md` (SEO-Uhr, CoS-M-008).

**Kein einziger Punkt braucht neue Seiten.** Fünf Textkorrekturen, ein
Einbau, ein Schalter.

**Nächster Schritt von mir, wie abgemacht:** Entwurf — kein fertiger Text, kein
fertiges Layout — gemeinsam mit dem Product Designer, zum Durchgehen mit Sandy.
Inhalt meiner, Aufbau und Aussehen seiner. Der Entwurf kommt, sobald die zwei
Rückfragen unten beantwortet sind; Punkt 3, 4 und 6 kann ich vorher schon
schreiben.

*Head of Marketing · 2026-09-16*

---

## ➜ Finance hat den Landingpage-Entwurf gegengerechnet — 4 Stopper, 5 Korrekturen (16.09.2026, 20:40 MESZ · Head of Finance)

Sandy hat mich direkt draufgesetzt. **9.1 bleibt eure Baustelle** — das hier
sind nur Befunde, kein Eingriff in euren Text. Geprueft habe ich, was ich
pruefen kann: Zahlen, Preise, Versprechen gegen den Code.

### Zuerst das Gute, und es ist nicht wenig

**Alle vier Beispielangebote rechnen sich auf — Position fuer Position, Cent
genau.** Ich habe alle 33 Zeilen nachgerechnet:

* Maler Wohnzimmer: 18 lfm × 2,60 m = 46,80 m², Summe **728,00 €** ✓
* Bodenleger Kinderzimmer: 14,00 m² + 5 % = 14,70 m², Summe **401,30 €** ✓
* Maler drei Raeume: 685,90 + 539,05 + 441,36 + 25,00 = **1.691,31 €** ✓,
  Bodenflaeche 20,00 + 14,00 + 7,20 = **41,20 m²** ✓
* Maler Buero Q3: Summe **1.543,80 €** ✓
* Hero-Handy: 24,00 + 14,40 + 187,20 + 210,60 + 220,00 + 444,60 =
  **1.100,80 €** ✓

Kein einziger Rechenfehler. Wer die Seite nachrechnet — und Handwerker tun
das — findet nichts. Das ist die halbe Miete auf einer Seite, die
„gerechnet, nicht geschaetzt" verspricht.

**Und der Gruenderpreis deckt sich exakt mit meinem Plan.** 25 × 29 € = 725 €,
plus 12 × 49 € = 588 € ergibt die **1.313 €** bei 37 Betrieben, die in
`kostenuebersicht-finance.xlsx` als Ausstiegsstufe B1 stehen. Bei 107 Betrieben:
725 + 82 × 49 = **4.743 €** — ebenfalls auf den Euro. Das dauerhafte
29-€-Versprechen ist also **schon eingepreist**, es reisst kein Loch. Wer immer
die Preisstufen gesetzt hat, hat mit demselben Modell gearbeitet.

### 🔴 Vier Stopper — so darf die Seite nicht live gehen

**1. „zzgl. MwSt. — 34,51 € brutto" widerspricht Sandys Steuerstatus.**
Sandy startet als **Kleinunternehmerin nach § 19 UStG**. Sie darf keine
Umsatzsteuer ausweisen — und weist sie doch eine aus, **schuldet sie sie
trotzdem dem Finanzamt (§ 14c Abs. 2 UStG)**, ohne sie behalten zu duerfen.
Rechnerisch: 5,51 € je Betrieb und Monat, bei 25 Gruendern **137,75 € im
Monat**, die abfliessen, ohne dass ihnen etwas gegenuebersteht. Der Kunde
bekommt dafuer keinen Vorsteuerabzug, weil die Rechnung ihn nicht traegt.
**Solange § 19 gilt, muss dort 29 € stehen — ohne Bruttozeile, mit dem
Kleinunternehmer-Hinweis.** Ironischerweise kann das Produkt genau das: „§ 19
— Hinweis statt MwSt" steht zwei Abschnitte darueber als Feature.

**2. „Gruenderplaetze: 18 von 25 frei" bei null Kunden.** Die Seite behauptet,
sieben Betriebe haetten bereits gebucht. Gate 1 hat **keine Zahlungen** — es
gibt sie nicht. Im Fuss des Entwurfs steht ausserdem ein Umschalter
„Vorschau: 18 frei · 3 frei · voll", die Zahl ist also gesetzt, nicht gezaehlt.
Eine erfundene Verknappung ist eine irrefuehrende geschaeftliche Handlung
(§ 5 UWG) und genau die Sorte Angabe, die abgemahnt wird. **Entweder echt
zaehlen oder die Zeile streichen.** „Die ersten 25 Betriebe zahlen dauerhaft
29 €" traegt auch ohne Countdown.

**3. „Echte Aufnahmen, echte Angebote."** Bei null Kunden gibt es keine echten
Aufnahmen. Die Beispiele sind gut und richtig gerechnet — aber sie sind
konstruiert. **„Echte Rechenwege, nachvollziehbar" o. ae. sagt dasselbe und
stimmt.** Wenn die Diktate tatsaechlich aus Sandys Einsprech-Laeufen stammen,
zieht ihr den Einwand mit einem Satz Beleg zurueck, dann lasse ich ihn fallen.

**4. „E-Rechnung — ZUGFeRD, GoBD, fortlaufende Nummern. Laeuft mit."** Drei
Behauptungen, und alle drei wackeln:
* Der **ZUGFeRD-Export deklariert ein Angebot als Rechnung** (`TypeCode 380`)
  — als **EX-003** bei Platform eingetragen, ungeloest.
* Der Nummernkreis „Rechnungen" existiert in den Einstellungen, **aber niemand
  zieht daraus** (Befund Engineering). Das Produkt stellt keine Rechnungen.
* **„GoBD" ist eine Aussage ueber revisionssichere Archivierung** ueber acht
  Jahre — die macht nicht das Angebotswerkzeug, sondern das Buchhaltungssystem
  dahinter. So wie es dasteht, verspricht die Seite Rechtssicherheit, die sie
  nicht liefern kann. Das ist das Feld, das am ehesten zu einer
  Kundenbeschwerde fuehrt, weil es erst beim Finanzamt auffliegt.

### 🟠 Fuenf Korrekturen — kein Stopper, aber falsch

**5. „Lexware, sevDesk und DATEV direkt, andere ueber Export."** Lexware und
sevDesk haben echte Anbindungen im Code (`api/integrations/…`). **DATEV nicht:**
in `src/lib/accounting-options.ts` steht DATEV ausdruecklich unter „CSV /
DATEV-Export … kein Key noetig". Die Aufzaehlung stellt DATEV auf dieselbe
Stufe wie die beiden anderen. **DATEV gehoert hinter das „andere ueber
Export".** Zusatzhinweis: Punkt 11.5 (Buchhaltungsanbindung) steht in
`launch-readiness.md` noch auf **0 % — nicht erhoben**. Bevor die Seite die
Anbindung verspricht, sollte jemand sie einmal live durchklicken.

**6. Die Hero-Fussnote ist fachlich unschaerfer als die Beispiele.** Im Hero
steht „Fenster und Tuer **nach VOB nicht abgezogen**", im Beispieltab dagegen
korrekt „Fenster und Tuer **unter 2,5 m²** nach VOB nicht abgezogen". Ohne die
Schwelle ist der Satz schlicht falsch — ueber 2,5 m² wird abgezogen. Der Hero
ist die Stelle, die jeder sieht. **Gleiche Formulierung an beiden Stellen.**

**7. Flur, drei Tueren, „Sockelleisten abkleben 14,40 lfm".** Bei den *Waenden*
ist „drei Tueren kuerzen den Umfang nicht" nach VOB richtig. Bei den
*Sockelleisten* bin ich mir nicht sicher: In einer Tueroeffnung gibt es keine
Sockelleiste zum Abkleben, das waeren rund 2,70 lfm weniger. **Das ist eine
Fachfrage, keine Finanzfrage — bitte vom Pruefmeister gegenlesen lassen**,
bevor ein Maler es als ersten Fehler findet.

**8. Der durchgestrichene 49-€-Ankerpreis steht direkt vor „34,51 € brutto".**
Selbst wenn Punkt 1 geloest ist: Die Brutto-Zeile bezieht sich auf die 29 €,
steht aber hinter der 49. Beim Ueberfliegen liest sich das, als seien 34,51 €
der Bruttopreis von 49 €. **Zeilen tauschen oder die Bezugsgroesse nennen.**

**9. Die Stripe-Preis-IDs passen nicht zusammen — das faellt in eure Naehe,
gehoert aber Platform.** `src/app/api/stripe/route.ts` liest
`STRIPE_PRICE_STANDARD` und `STRIPE_PRICE_FOUNDER`; in der `.env.local` auf
Sandys Rechner stehen `STRIPE_PRICE_STARTER` und `STRIPE_PRICE_PRO`. Beide
gesuchten Variablen fallen damit auf `''` zurueck. **Wenn in Vercel dieselben
Namen stehen wie lokal, kann niemand den Gruenderpreis buchen** — die Seite
bewirbt einen Tarif, der an der Kasse ins Leere laeuft. Ich habe es nicht
angefasst und nichts in Vercel nachgesehen; **Platform sollte die
Produktionsvariablen einmal gegenlesen.** Ich trage es dort nicht selbst ein,
damit es nicht doppelt liegt — sagt Bescheid, wenn ihr es nicht uebernehmt,
dann mache ich es.

### Was ich ausdruecklich nicht bewertet habe

Ton, Aufbau, Bildsprache, die Reihenfolge der Abschnitte — das ist eure
Kompetenz, nicht meine. Ebenso „Antwort innerhalb eines Werktages" und der
Datenschutzsatz („verschluesselt auf Servern in Deutschland, kein Tracking"):
Ersteres liegt schon als Entscheidung bei Sandy, Letzteres gehoert Legal —
Sprachaufnahmen laufen ueber einen KI-Anbieter, und ob dessen Verarbeitung zu
„Server in Deutschland" passt, ist Punkt 7.13, nicht meiner.

*Head of Finance · 16.09.2026*

---

## CoS-M-012 — Sandys Antwort auf eure zwei Website-Fragen (17.09.2026)

**1. „Antwort innerhalb eines Werktages“: B.** Der Satz lautet jetzt „Wir
antworten normalerweise am selben oder am nächsten Werktag.“

**2. Nachsatz der Wartelisten-Seite: streichen.** Der Text lautet jetzt „Für
Maler und Bodenleger.“

**Ihr müsst dazu nichts mehr bauen — ich habe beide Stellen selbst geändert:**
`src/components/landing/FAQSection.tsx` (Zeile 111) und
`src/components/ComingSoon.tsx` (Zeilen 63–65). `npx tsc --noEmit` läuft sauber
durch, kein Test greift auf die beiden Sätze zu (nachgesehen, nicht vermutet).
Noch nicht gepusht — der zweite Satz wird erst mit Sandys nächstem Push live.

**Was damit an euch zurückgeht:** der Rest von Punkt 9.1. Die vier
widersprüchlichen Gratis-Versprechen, die veraltete Preis-Sektion und die zwei
zu hoch gegriffenen Zahlen liegen weiter bei euch — dort hat Sandy nichts
entschieden, weil ihr sie nichts gefragt habt.

**Und ein Hinweis zum Gegenlesen des Head of Finance:** drei seiner Punkte sind
Sandy-Fragen (§-19-Preis, Zählzeile, „echte Aufnahmen“) und liegen in
`entscheidungen-fuer-sandy.md`. **Nicht selbst beantworten und nicht in den
Entwurf einbauen, bevor sie antwortet** — besonders die Zählzeile „18 von 25
frei“: die Seite darf so nicht live gehen.

*Chief of Staff · 2026-09-17*


## Punkt 9.1 — der Landingpage-Entwurf, geprüft (Head of Marketing, 2026-09-17)

**Geprüft:** der Entwurf als Artefakt („Sofortangebot — Landingpage (Entwurf,
nicht live)"), vollständig gelesen, 897 Zeilen inklusive des Skripts. Sandy hat
ihn mir direkt gegeben.

**Vorweg, damit die Reihenfolge stimmt:** Head of Finance hat gestern Abend
bereits gegengerechnet (vier Stopper, fünf Korrekturen, Eintrag direkt über
diesem). Ich wiederhole davon nichts. Ich **beantworte zwei seiner offenen
Punkte mit Beleg** und lege **fünf Befunde daneben, die noch niemand hat** —
alle gegen den Prüfstand und den Code gemessen, nicht geschätzt.

### 1. Der Entwurf hat meine gestrigen Befunde erledigt — alle

| Gestern (9.1-Bewertung) | Im Entwurf |
|---|---|
| Vier verschiedene Gratis-Versprechen (5 / 3 / 30 Tage / 1) | **Eines.** „14 Tage kostenlos testen", an allen fünf Stellen gleich ✓ |
| Preis-Sektion bewirbt das abgelöste Modell | **49 € / Gründerpreis 29 € / 14 Tage ohne Kreditkarte** — das entschiedene Modell ✓ |
| Zielgruppe an drei Stellen verschieden | **„Für Maler- und Bodenbetriebe"**, durchgehend ✓ |
| „Über 300 / über 200 vorbereitete Positionen" (real: 216 / 188) | **Ersatzlos raus** ✓ |
| KI-Vokabular (stehende Regel CoS-M-009) | **Kein einziges Vorkommen.** „Nicht geschätzt, sondern gerechnet" sagt dasselbe ohne das Wort ✓ |

Dazu, unaufgefordert und richtig: der entschiedene Slogan (CoS-M-005) steht
endlich als Überschrift auf der Seite, und der B2B-Hinweis („richtet sich
ausschließlich an Unternehmer, § 14 BGB") ist neu. **Inhaltlich ist das ein
anderer Entwurf als das, was im Code liegt, und ein deutlich besserer.**

**Nachgezählt, weil es behauptet wird:** die drei Blog-Teaser im Fuß
entsprechen genau den drei Artikeln, die es gibt (`content/blog/*.mdx`:
`kleinunternehmer-angebot-pflichtangaben`, `maler-preise-2026`,
`handwerkerangebot-schreiben`). **Keine toten Links** ✓

### 2. Zwei von Finances offenen Punkten kann ich schließen

**Finance Punkt 7 — Sockelleisten im Flur (drei Türen, 14,40 lfm): der Entwurf
hat recht, der Einwand fällt.** Das Produkt rechnet es genau so, und zwar
bewusst: `src/lib/mengen/gewerke/sockelleisten.ts` zieht eine Türöffnung erst
**ab 1 m Breite** ab (`VOB_SOCKEL_ABZUG_AB_M`), Standardtür 0,90 m. Der
Kommentar in `raum-geometrie.ts` nennt die Regel beim Namen: **VOB-012,
Unterbrechungen bis 1 m Einzellänge werden nicht abgezogen.** Drei
Standardtüren kürzen die Sockelleiste also nicht — 14,40 lfm ist richtig,
14,40 − 2,70 wäre falsch. Gilt genauso für die 18,00 lfm im Hero.
*(Die alte Landingpage im Code zeigt an derselben Stelle 17,10 lfm. Die ist
falsch, nicht der Entwurf.)*

**Finance Punkt 3 — „Echte Aufnahmen, echte Angebote": halb richtig, und ich
löse es als Textfrage.** Die vier Diktate sind **nicht erfunden** — sie stehen
fast wortgleich in `docs/einsprech-liste-alle-faelle.md` (Fall 05, 06, 10, 11)
und sind laut dieser Datei am **16.09. tatsächlich eingesprochen und
abgehakt** worden. Es sind also echte Aufnahmen, aber von uns, nicht von
Kunden — und genau das liest der Besucher hinein. **Mein Vorschlag:
„Echt eingesprochen. Echt gerechnet."** Stimmt ohne Wenn und Aber, behauptet
keine Kundschaft, und es ist der stärkere Satz. Kein Fall für Sandy, das ist
Textarbeit.

### 3. Fünf Befunde, die noch niemand hat

Ich habe die vier Beispiele **gegen die Prüfstands-Läufe vom 16.09.** gehalten
— nicht nachgerechnet (das hat Finance schon, fehlerfrei), sondern verglichen,
**ob das, was auf der Seite steht, das ist, was aus dem Produkt herauskam.**

**🔴 M-1 · Der Hero zeigt eine Position, die das Produkt heute nicht erzeugt.**
Der eingesprochene Satz im Hero-Handy ist wortgleich **Fall 05** der
Einsprech-Liste. Was das Produkt am 16.09. daraus gemacht hat:

| | Positionen | Summe |
|---|---|---|
| **Fall 05, gemessen** | 5 | **890,20 €** |
| **Hero im Entwurf** | 6 | **1.100,80 €** |

Die sechste ist **„Grundieren (Tiefengrund)" 46,80 m² × 4,50 € = 210,60 €** —
und zu genau der steht in der Einsprech-Liste der Satz: *„Nach dem
Tapetenabriss fehlt der Tiefengrund. Steht auf der Liste, ist entschieden,
**aber noch nicht gebaut**."* Ich habe nachgesehen: in
`src/lib/ergaenzungs-erkenner.ts` gibt es keine Grundierungs-Ergänzung, und der
`kontext-analyzer` fragt nur nach der Tapete selbst, nicht nach dem Grund
danach. **Die Position kommt heute nicht.**

Das ist die erste Sache, die jeder Besucher sieht, und sie ist eine Vorführung
von Verhalten, das es nicht gibt. Finance ist es nicht aufgefallen, weil es
**sauber aufgeht** — 890,20 + 210,60 = 1.100,80. Der Fehler ist nicht
rechnerisch, er ist inhaltlich.
**Zwei Wege:** Hero auf das echte Ergebnis (890,20 €, fünf Positionen) —
sofort machbar, kostet nichts außer der Zeile. Oder warten, bis der Tiefengrund
gebaut ist. **Meine Empfehlung: nicht warten.** Der Hero verliert durch die
fünfte Zeile nichts; das Argument ist der Rechenweg, nicht die Summe.
*Derselbe Befund trifft einen zweiten Satz:* „Denkt an das, was man vergisst —
**Grundierung nach dem Tapetenabriss** — Sofortangebot fragt nach, bevor du
umsonst arbeitest." Das ist dasselbe ungebaute Verhalten, als Versprechen
formuliert. **Beispiel tauschen** (Boden abdecken und Sockelleisten kommen
nachweislich von allein), Satz behalten.

**🔴 M-2 · „Kein Angebot geht mit 0 € raus." — das stimmt nicht.**
Steht im fünften Beispiel-Tab unter der 0,00-€-Zeile. Im Code ist es
ausdrücklich andersherum gelöst, mit Begründung:
`api/entwurf/generiere-positionen/route.ts` hält fest, dass die frühere
422-Sperre **entfernt** wurde — *„fehlende Preise blockieren nicht mehr,
sondern kommen mit 0,00 € sichtbar in die Positionen"*. Ich habe zusätzlich
`api/pdf`, `api/email` und `api/sign` durchsucht: **keine Sperre, an keiner
Stelle.** Wer den Preis nicht anlegt, verschickt das Angebot mit 0,00 € drin.

Das Bittere daran: die Wahrheit ist fast so gut. Das Produkt **zeigt** die
Lücke rot und unübersehbar, statt sie zu verstecken — das ist der eigentliche
Verkaufspunkt. **Vorschlag: „Die Lücke steht rot im Angebot, bis du sie
schließt."** Dasselbe Vertrauen, nachprüfbar wahr.

**🔴 M-3 · Drei von vier Beispiel-Tabs zeigen nicht das, was der Prüfstand
ausgegeben hat.** Die Datei `landingpage-fuenf-beispiele.md` verspricht im
Kopf: *„Alle Mengen und Preise sind durch den Prüfstand gelaufen — nicht
geschätzt."* Für die Seite in dieser Form gilt das nicht mehr:

| Tab | Prüfstand 16.09. | Entwurf | Differenz |
|---|---|---|---|
| Bodenleger · Laminat | Fall 11: **366,30 €** | 401,30 € | + Kleinmaterial 35,00 € |
| Maler · ganze Wohnung | Fall 10: **1.666,31 €** | 1.691,31 € | + Kleinmaterial 25,00 € |
| Maler · Büro mit Q3 | Fall 06: **1.348,80 €** | 1.543,80 € | + 3 Heizkörper-Zeilen 170,00 € + Kleinmaterial 25,00 € |
| Maler · Wohnzimmer | kein deckungsgleicher Fall (01 ist 2,50 m hoch) | 728,00 € | + Kleinmaterial 25,00 € |

**Kleinmaterial ist wahrscheinlich harmlos** — es ist als Pauschale des
Betriebs angelegt und im Testkonto offenbar nicht gesetzt, deshalb fehlte es im
Lauf. Das lässt sich in einem Satz klären, nicht raten.
**Das Büro ist der ernste Fall:** dort wurde der eingesprochene Satz
**verändert** („Die zwei Heizkörper bitte mit lackieren" ist neu) und damit
eine Variante gezeigt, die so nie durchgelaufen ist. Fachfrage an den
Prüfmeister, unten gestellt. Bis dahin steht auf der Seite eine Zahl, für die
niemand geradesteht.

**🟠 M-4 · Das Büro-Beispiel trägt immer noch die Krücke, die laut
Arbeitsreihenfolge raus muss.** Dort steht seit dem 16.09. wörtlich: *„Beispiel 4
umgeht PM-098 heute dadurch, dass Fenster und Tür nicht im Satz stehen — diese
Krücke gehört raus, bevor die Seite live geht."* Im Entwurf steht im Büro-Satz
weiterhin kein Fenster und keine Tür. **Und die Lage hat sich verschärft:**
PM-098 war „Fenster und Tür" **plus „lackieren"**, und „lackieren" ist mit den
Heizkörpern jetzt neu im Satz. PM-098 gilt als gebaut und mit Sperrklinken
abgesichert — dann kostet es einen Lauf, das zu belegen. **Das ist meine
Auflage, ich habe sie gestern zugesagt und trage sie hiermit weiter.**

**🟠 M-5 · „Ob du allein losziehst oder zu fünft" — das Produkt kennt nur einen
Zugang pro Betrieb.** Die FAQ-Antwort auf „Zahle ich mehr, wenn mein Geselle es
auch nutzt?" ist **preislich richtig** (es gibt keine Staffelung nach Köpfen,
so steht es in `preismodell.md`). Der Nachsatz verspricht aber Nutzung durch
mehrere. Gemessen: ein Betrieb hängt über `companies.user_id` an **genau einem**
Konto (`.eq('user_id', user.id).single()`, überall gleich), und Wörter wie
Mitarbeiter, Einladung oder Team kommen in `src/app` und `src/lib` **nicht
vor**. Der Geselle müsste sich Sandys Zugang teilen — was nebenbei gegen den
Sicherheitspunkt 2.7 arbeitet.
**Vorschlag:** die Antwort auf das kürzen, was stimmt — *„Nein. Der Preis gilt
für den Betrieb, nicht pro Kopf."* Punkt. Der Rest kann wieder rein, wenn es
Mitarbeiterzugänge gibt.

### 4. Mein Urteil zu 9.1

**Der Entwurf ist inhaltlich die Seite, die wir brauchen.** Aufbau, Ton und
Reihenfolge sitzen; die drei Dinge, die eine Landingpage leisten muss — was ist
das, für wen, was kostet es — beantwortet er in fünfzehn Sekunden. Das ist
gegenüber dem Stand im Code ein Sprung.

**Live gehen darf er so nicht.** Zusammen mit Finance stehen jetzt **sechs
Stopper**: MwSt./§ 19 · erfundene Gründerplätze (heute gemessen: **0 von 25
vergeben**, die Seite behauptet 7) · ZUGFeRD/GoBD · und meine drei — der
Tiefengrund im Hero, die 0-€-Zusage, die abweichenden Beispiele. **Kein
einziger davon ist ein Design- oder Textproblem.** Es sind sechsmal dieselbe
Sorte Fehler: die Seite ist dem Produkt voraus. Das ist bei einem Entwurf
normal und in einem Monat vergessen — aber nicht, wenn er live geht.

**Was ich als Nächstes tue, ohne auf jemanden zu warten:** die Textfassungen
für M-1, M-2, M-5 und „Echt eingesprochen" ausformulieren, in einem Stück, zum
Durchgehen mit Sandy. **Was ich nicht tue:** den Entwurf selbst anfassen —
Aufbau und Aussehen gehören dem Designer, und Sandy will den Text mitgestalten.

*Head of Marketing · 2026-09-17*

---

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->

