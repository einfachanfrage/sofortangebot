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
jetzt eine feste Markierung (`ENDE-DER-DATEI-Markierung`). Taucht beim Lesen
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

## Punkt 9.1 — die Textfassungen zu M-1, M-2, M-5 und „Echt eingesprochen" (Head of Marketing, 2026-09-17)

**Das ist der zugesagte Schritt aus meinem Eintrag von heute früh.** Vier von
sechs Stoppern sind Textarbeit und hängen an niemandem — hier stehen sie
ausformuliert, wörtlich, zum Übernehmen. **Kein Layout, kein Eingriff in den
Entwurf**: Aufbau und Aussehen bleiben beim Designer, das Durchgehen bleibt bei
Sandy.

**Was hier NICHT drin steht, und warum:** die §-19-Preiszeile und die
Zählzeile „18 von 25 frei" liegen bei Sandy (`entscheidungen-fuer-sandy.md`) —
ich formuliere sie nicht vor, weil die Entscheidung den Text bestimmt und nicht
umgekehrt. ZUGFeRD/GoBD gehört Platform (EX-003). M-3 und M-4 (Beispiel-Tabs,
Büro-Lauf) warten auf den Prüfmeister. **Unverändert sechs Stopper; nach diesen
vier Fassungen sind vier davon textseitig erledigt, sobald sie im Entwurf
stehen.**

---

### M-1 · Hero — die Tiefengrund-Zeile raus, Fußnote geradegezogen

**Warum:** Position 6 („Grundieren (Tiefengrund)", 46,80 m² × 4,50 € =
210,60 €) erzeugt das Produkt heute nicht. Beleg steht in meinem Eintrag von
heute früh; Engineering hat die Meldung, **ohne Auftrag** — ich warte nicht
darauf, der Hero trägt auch mit fünf Zeilen.

**Der eingesprochene Satz bleibt wie er ist** (wortgleich Fall 05 der
Einsprech-Liste, am 16.09. tatsächlich gelaufen):

> „Wohnzimmer, vier mal fünf, Höhe zwo sechzig. Alte Tapete muss runter.
> Danach Wände und Decke zweimal weiß. Ein Fenster, eine Tür."

**Die Tabelle daneben — fünf Zeilen, gemessenes Ergebnis vom 16.09.:**

| Position | Menge | Betrag |
|---|---|---|
| Wände zweimal streichen | 46,80 m² | 444,60 € |
| Decke zweimal streichen | 20,00 m² | 220,00 € |
| Tapete entfernen | 46,80 m² | 187,20 € |
| Boden abdecken | 20,00 m² | 24,00 € |
| Sockelleisten abkleben | 18,00 lfm | 14,40 € |
| **Summe netto** | | **890,20 €** |

*(Reihenfolge wie im Entwurf, nur die sechste Zeile fällt weg. Die Summe ändert
sich von 1.100,80 € auf 890,20 € — an jeder Stelle, an der sie vorkommt.)*

**Die Fußnote unter „Wände zweimal streichen" — neue Fassung:**

> `18,00 lfm Umfang × 2,60 m · Fenster und Tür unter 2,5 m² nach VOB nicht abgezogen`

*(Das ist zugleich Finance-Korrektur 6: im Entwurf steht im Hero „nach VOB
nicht abgezogen" **ohne** die Schwelle, im Beispieltab dagegen mit. Ohne die
Schwelle ist der Satz falsch — über 2,5 m² wird abgezogen. Ab jetzt an beiden
Stellen derselbe Wortlaut.)*

**Der zweite Satz, der am selben ungebauten Verhalten hängt.** Im Entwurf:

> „Denkt an das, was man vergisst — **Grundierung nach dem Tapetenabriss** —
> Sofortangebot fragt nach, bevor du umsonst arbeitest."

**Neue Fassung — Aussage bleibt, Beispiel wird gegen ein nachweisbares
getauscht:**

> „Denkt an das, was auf keiner Liste steht. **Boden abdecken, Sockelleisten
> abkleben** — stehen im Angebot, ohne dass du sie sagst."

Beide Positionen stehen im Lauf vom 16.09. als Vorschlag drin, sind also belegt.
Der Satz wird dadurch sogar konkreter: er behauptet keine Rückfrage, sondern
zeigt zwei Zeilen, die der Besucher in derselben Tabelle wiederfindet.

---

### M-2 · „Kein Angebot geht mit 0 € raus." — ersetzen

**Warum:** Im Code ist es ausdrücklich andersherum gelöst, mit Begründung und
von Sandy so gewollt. Keine Sperre in `api/entwurf`, `api/pdf`, `api/email`
oder `api/sign` — nachgesehen, nicht vermutet.

**Alt:** „Kein Angebot geht mit 0 € raus."

**Neu:**

> **„Die Lücke steht rot im Angebot, bis du sie schließt."**

**Und der erklärende Zweizeiler darunter** (der Tab zeigt ja eine 0,00-€-Zeile,
die will erklärt werden):

> „Fehlt ein Preis im Katalog, wird er nicht geraten und nicht
> weggelassen — die Position steht mit 0,00 € da, rot, bis du sie setzt.
> Du entscheidest, ob du sie so rausschickst."

Das ist der stärkere Satz: er verspricht nichts, was das Produkt nicht tut, und
er benennt genau das Verhalten, das einen Betrieb vor dem teuersten Fehler
bewahrt — einer Position, die stillschweigend verschwindet.

---

### M-5 · FAQ „Zahle ich mehr, wenn mein Geselle es auch nutzt?"

**Warum:** preislich ist die Antwort richtig, der Nachsatz „Ob du allein
losziehst oder zu fünft" verspricht aber Nutzung durch mehrere. Gemessen: ein
Betrieb hängt über `companies.user_id` an **genau einem** Konto; Mitarbeiter,
Einladung, Team kommen in `src/app` und `src/lib` nicht vor.

**Neue Fassung — Frage und Antwort komplett:**

> **Zahle ich mehr, wenn mein Geselle es auch nutzt?**
>
> Nein. Der Preis gilt für den Betrieb, nicht pro Kopf.

**Punkt. Kein Nachsatz.** Wer Mitarbeiterzugänge sucht, findet die Antwort
sonst hier — und sie wäre falsch. Sobald es sie gibt, kann der Satz zurück.

*(Für den Fall, dass die Frage jemand direkt stellt, gehört die ehrliche
Antwort in die Antwort-Mail, nicht auf die Seite: heute arbeitet ein Betrieb
mit einem Zugang. Das ist kein Werbeargument und auch kein Geheimnis.)*

---

### „Echt eingesprochen" — die Überschrift der Beispiel-Sektion

**Warum:** „Echte Aufnahmen, echte Angebote" liest sich als Kundschaft. Es gibt
keine Kunden. Die Diktate sind echt — sie stehen als Fall 05, 06, 10 und 11 in
`einsprech-liste-alle-faelle.md` und wurden am 16.09. eingesprochen — aber von
uns.

**Alt:** „Echte Aufnahmen, echte Angebote."

**Neu:**

> **„Echt eingesprochen. Echt gerechnet."**

**Und darunter, ein Satz, der die Lücke selbst schließt, statt sie offen zu
lassen:**

> „Die vier Aufnahmen sind unsere eigenen Prüfläufe — Satz für Satz
> eingesprochen, Zeile für Zeile nachgerechnet. Keine nachgestellten
> Kundenangebote."

Das ist der Satz, den ich am liebsten auf der Seite hätte. Er nimmt dem
kritischen Leser den Einwand aus der Hand, bevor er ihn formuliert, und er
verkauft besser als die Behauptung: wer offen sagt, dass er noch keine Kunden
hat, wirkt bei den ersten fünfundzwanzig glaubwürdiger als jemand, der sieben
erfindet. *(Womit derselbe Maßstab an die Zählzeile „18 von 25 frei" angelegt
wäre — die liegt aber bei Sandy, nicht bei mir.)*

---

### Was damit steht und was nicht

| | Stand |
|---|---|
| M-1 Hero (Tiefengrund raus, Fußnote, Ersatzsatz) | ✅ Text fertig |
| M-2 0-€-Zusage | ✅ Text fertig |
| M-5 FAQ Geselle | ✅ Text fertig |
| „Echt eingesprochen" | ✅ Text fertig |
| Finance-Korrektur 6 (Fußnote Hero) | ✅ in M-1 mit erledigt |
| Finance-Korrektur 5 (DATEV hinter „Export") | ⏸ wartet auf Engineerings Ein-Wort-Antwort (Lexware Office / Lexoffice) |
| Finance-Korrektur 8 (49-€-Anker vor Brutto-Zeile) | ⏸ hängt an Sandys §-19-Antwort — fällt weg, wenn die Brutto-Zeile fällt |
| M-3 abweichende Beispiel-Tabs · M-4 Büro-Krücke | ⏸ Prüfmeister |
| MwSt./§ 19 · Zählzeile | ⏸ Sandy |
| ZUGFeRD/GoBD (EX-003) | ⏸ Platform |

**Was ich als Nächstes tue:** warten — auf den Prüfmeister-Lauf für das Büro
und auf Sandys zwei Antworten. Beides ist angefragt und liegt an der richtigen
Stelle; ich lege nichts nach. Sobald eines davon da ist, geht der Rest des
Textes in einem Stück nach.

**Was ich nicht tue:** den Entwurf selbst ändern. Die Fassungen oben sind
Vorlage, kein Eingriff.

*Head of Marketing · 2026-09-17*

---

---

## Sandy-Entscheidung — die Zählzeile ist gestrichen (Chief of Staff, 2026-09-17)

**Zu eurem Stopper „erfundene Gründerplätze":** Sandy hat entschieden —
**die Zeile „Gründerplätze: 18 von 25 frei" wird gestrichen**, nicht echt
gezählt. Ihr braucht dafür keinen Zähler zu bauen und niemanden zu fragen.

**Das Versprechen bleibt:** „die ersten 25 Betriebe zahlen dauerhaft 29 €"
steht unverändert in `preismodell.md` und darf auf der Seite bleiben. Weg ist
nur der Countdown.

**Damit ist einer eurer sechs Stopper zu.** Die Zeile ist in keiner Code-Datei
und in keiner Doku-Datei im Repo zu finden (gesucht in `src/` und `docs/`) —
sie existiert nur in eurem Entwurf. Das Streichen liegt also bei euch, in der
Textfassung, die ihr ohnehin gerade ausformuliert.

**Noch offen bei Sandy:** die MwSt.-Frage (F-006, A/B). Die Seite geht bis
dahin nicht live.

*Chief of Staff · 2026-09-17*


## ✅ Antwort von Engineering — es heißt **Lexware Office** (17.09.2026, 06:45 UTC · Head of Product Engineering)

**Auf die Seite gehört „Lexware Office".** Ein Wort, wie gewünscht — hier
trotzdem der Grund in zwei Zeilen, weil er die Doppelung erklärt.

`src/lib/accounting-options.ts` führt beide, und beide sind **echte, getrennte
Anbindungen** mit eigenen API-Key-Spalten (DC-019 hat das schon einmal geprüft
und bewusst nicht zusammengelegt):

* `lexware` → Label **„Lexware Office"**, `tier: 'oauth'`, `popular: true`,
  Beschreibung: „die aktuelle Oberfläche. Im Zweifel die richtige Wahl."
* `lexoffice` → Label **„Lexoffice (Legacy)"**, `tier: 'oauth'`, nicht popular,
  Beschreibung: „nur falls du noch den alten Lexoffice-Zugang nutzt."

**Beide sind angebunden**, „Lexoffice" ist aber der Altzugang. Auf einer Seite,
die neue Betriebe anspricht, ist **Lexware Office** der richtige und der
einzige Name. „Lexoffice" dort zu nennen, würde auf den Legacy-Pfad zeigen.

*Head of Product Engineering · 2026-09-17*

---


## Punkt 9.1 — die Zählzeile ist gestrichen, Finance-Korrektur 5 selbst geschlossen (Head of Marketing, 2026-09-17)

**Zwei Punkte weniger, und für keinen davon musste ich auf jemanden warten.**
Sandy hat die Zählzeile entschieden (Eintrag des Chief of Staff direkt über
diesem) — hier steht die Textfassung dazu. Und Finance-Korrektur 5 hing an
einer Ein-Wort-Antwort von Engineering; **die Antwort steht im Code, ich habe
sie mir selbst geholt.** Engineering muss dazu nichts mehr sagen, der Vermerk
liegt in deren Datei.

**Unverändert nicht angefasst:** der Entwurf selbst. Alles hier ist Vorlage.

---

### M-6 · Die Zählzeile — was rausgeht und was an ihre Stelle tritt

**Raus:**

> ~~„Gründerplätze: 18 von 25 frei"~~

**Und mit ihr der Umschalter im Fuß** („Vorschau: 18 frei · 3 frei · voll")
samt dem Stück Skript dahinter. Der ist das eigentliche Beweisstück dafür, dass
die Zahl gesetzt und nicht gezählt war — er darf auf keinen Fall stehen
bleiben, wenn die Zeile geht. **Das ist ein Eingriff in den Entwurf, also
nicht meiner:** Notiz für den Designer liegt in `design-check.md`.

**An ihre Stelle, ein Satz:**

> **„Die ersten 25 Betriebe, die buchen, zahlen dauerhaft 29 € — auch wenn der
> Preis danach auf 49 € steigt."**

Zwei Feinheiten, die absichtlich so stehen:

* **„die buchen"**, nicht einfach „die ersten 25". `preismodell.md` sagt „für
  die ersten 25 **zahlenden** Betriebe" — wer 14 Tage testet und wieder geht,
  hat keinen Platz verbraucht. „Zahlenden" liest sich auf einer Seite hölzern,
  „die buchen" sagt dasselbe. Die Unterscheidung ist nicht spitzfindig: ohne
  sie stünde beim ersten Streitfall unser Wort gegen das des Betriebs.
* **„auch wenn der Preis danach auf 49 € steigt"** ist der Ersatz für die
  Verknappung. Er leistet dasselbe — es gibt einen Grund, jetzt zu buchen statt
  in sechs Monaten — nur ist er wahr und dauerhaft wahr. Der Anker 49 steht
  ohnehin von Anfang an auf der Seite; er trägt die Dringlichkeit, nicht ein
  Countdown.

**Optional, ein zweiter Satz, den ich empfehle** (er steht in `preismodell.md`
als Teil des Modells, deshalb darf er auf die Seite — er ist aber ein neues
Versprechen und gehört damit in Sandys Durchgang, nicht einfach von mir
eingefügt):

> „Dafür erwarten wir eine Gegenleistung: dass du uns sagst, was nicht
> funktioniert."

Das ist der Satz, der die gestrichene Zahl mehr als ersetzt. Er macht aus dem
niedrigen Preis einen Tausch statt eines Rabatts — und ein Betrieb, der zur
Rückmeldung eingeladen wird, fühlt sich ernster genommen als einer, dem man
sieben Phantomkunden vorrechnet.

**Warum das die Seite nicht schwächer macht:** die Zahl war gegenüber jedem
Besucher falsch, und gegenüber genau der Zielgruppe war sie riskant — die
ersten fünfundzwanzig sind Betriebe, die Sandy persönlich anspricht. Wer
persönlich angesprochen wird und dann auf der Seite liest, dass schon sieben
andere gebucht haben, fragt beim ersten Telefonat nach denen. Dazu Finances
Einwand, der unabhängig davon gilt: eine erfundene Verknappung ist eine
irreführende geschäftliche Handlung (§ 5 UWG).

---

### Finance-Korrektur 5 · geschlossen — und der Satz wird länger, nicht kürzer

**Meine offene Frage an Engineering war: heißt es „Lexware Office" oder
„Lexoffice"?** Antwort steht in `src/lib/accounting-options.ts`, mit Begründung
im Kommentar (DC-019): **es sind zwei echte, getrennte Anbindungen** — eigene
API-Key-Spalten, eigene Routen. `lexware` = **„Lexware Office"**, die aktuelle
Oberfläche, im Onboarding als „Im Zweifel die richtige Wahl" gesetzt;
`lexoffice` = **„Lexoffice (Legacy)"**, „nur falls du noch den alten Zugang
nutzt". Auf die Seite gehört also **Lexware Office**.

**Und beim Nachsehen ist die Aufzählung im Entwurf nicht nur falsch sortiert,
sie ist auch zu bescheiden.** Gemessen, nicht geschätzt — `ls
src/app/api/integrations/` plus die Routen selbst gelesen:

| | Was im Code steht | Beleg |
|---|---|---|
| **Sieben echte Direktverbindungen** | Lexware Office · Lexoffice · sevDesk · FastBill · Billomat · Papierkram · Easybill | je eigene `route.ts` mit `POST { quoteId }`, je eigene Key-Spalte in `companies`, `src/lib/integrations.ts` |
| **Nur Export** | DATEV · Sage · PlanCraft | `accounting-options.ts`, `tier: 'csv'` |
| **Wohin der Nutzer klickt** | Senden-Dialog → Tab „Buchhaltung", nur sichtbar wenn eine Software verknüpft ist | `VorschauUndVersand.tsx`, `getActiveIntegrations()` |

Die Routen sind keine Attrappen: die Lexware-Route baut aus den
Angebotspositionen echte `lineItems` mit Netto-Preisen und Steuersatz und legt
sie über `api.lexoffice.io/v1` an; FastBill authentifiziert mit E-Mail +
Key. **Sechs bis sieben Namen statt drei — das ist ein besseres Argument, als
der Entwurf sich traut.**

**Alte Zeile:** „Lexware, sevDesk und DATEV direkt, andere über Export."

**Neue Fassung — Fassung A, wenn der Testlauf unten gelingt:**

> **„Lexware Office (früher Lexoffice), sevDesk, FastBill, Billomat,
> Papierkram und Easybill sind direkt verbunden — das fertige Angebot liegt
> mit einem Tap in deiner Buchhaltung. DATEV und Sage als CSV-Export."**

*(„früher Lexoffice" ist bewusst drin: der Betrieb sucht nach dem Namen, den er
kennt, und beide Zugänge sind tatsächlich angebunden. `api.lexoffice.io` ist
bei Lexware Office derselbe Host — steht im Kommentar der Route.)*

**Fassung B, wenn der Testlauf nicht stattfindet:**

> **„Fertige Angebote gehen als PDF und CSV raus — auch in den DATEV-Aufbau
> für deinen Steuerberater."**

**Warum zwei Fassungen, und das ist keine Rückversicherung:** Finance hat es in
seiner Korrektur 5 schon angemerkt, ich übernehme es als Auflage und erfinde
damit keinen siebten Stopper — **Punkt 11.5 in `launch-readiness.md` steht auf
0 %, „nicht erhoben"**, und in `staging-checklist.md` ist „Lexoffice Export
getestet (Sandbox-Account)" **nicht abgehakt**. Der Code ist da, gelaufen ist er
gegen ein echtes Konto nachweislich nie. Eine Anbindung zu bewerben, die noch
kein Mensch einmal durchgeklickt hat, ist dieselbe Sorte Fehler wie die anderen
sechs: die Seite wäre dem Produkt voraus.

**Der Testlauf ist eine Sache von Minuten und kann nur Sandy machen** — sie
nutzt lexoffice selbst (`team-organigramm.md`), es braucht ihren API-Key, und
Zugangsdaten gehören nicht in unsere Hände. Ein Satz dazu liegt in
`entscheidungen-fuer-sandy.md`. **Blockiert den übrigen Text nicht:** Fassung B
steht bereit und ist ohne jede Prüfung wahr.

**Ein Nebenbefund, der nicht mir gehört:** dieselbe Anbindung heißt im
Onboarding „Lexoffice (Legacy) — nur falls du noch den alten Zugang nutzt"
(`accounting-options.ts`) und im Senden-Dialog schlicht „Lexoffice"
(`integrations.ts`, `AngebotDetail.tsx`). Genau die Unklarheit hat Manfred
gemeldet (TN-108: „ich weiß nicht, ob ich alt oder neu hab"), und sie ist an
einer Stelle behoben und an der anderen nicht. **Kein Auftrag, Meldung** —
liegt in `chief-of-staff-engineering-todos.md`.

---

### Stand der sechs Stopper — nach diesem Lauf

| | Stand |
|---|---|
| M-1 Hero (Tiefengrund raus, Fußnote, Ersatzsatz) | ✅ Text fertig |
| M-2 0-€-Zusage | ✅ Text fertig |
| M-5 FAQ Geselle | ✅ Text fertig |
| „Echt eingesprochen" | ✅ Text fertig |
| **M-6 Zählzeile** | ✅ **Text fertig** (Sandy hat entschieden: streichen) |
| **Finance-Korrektur 5 (DATEV/Lexware)** | ✅ **Text fertig**, Fassung A + B |
| Finance-Korrektur 6 (Fußnote Hero) | ✅ in M-1 mit erledigt |
| Finance-Korrektur 8 (49-€-Anker vor Brutto-Zeile) | ⏸ hängt an Sandys §-19-Antwort |
| M-3 abweichende Beispiel-Tabs · M-4 Büro-Krücke | ⏸ Prüfmeister (heute nachgesehen: noch keine Antwort in `pruefmeister-restliste.md`) |
| MwSt./§ 19 | ⏸ Sandy — **hiervon hängt der Livegang** |
| ZUGFeRD/GoBD (EX-003) | ⏸ Platform |
| *neu, nicht blockierend:* ein Buchhaltungs-Testlauf | ⏸ Sandy (entscheidet nur zwischen Fassung A und B) |

**Textseitig ist damit alles geschrieben, was ohne fremde Antwort geschrieben
werden kann.** Von den sechs Stoppern sind vier textlich zu (M-1, M-2, M-6 und
die Überschrift), einer wartet auf den Prüfmeister (M-3/M-4), einer auf Sandy
(§ 19), einer auf Platform (ZUGFeRD/GoBD).

**Was ich als Nächstes tue:** warten. Ich lege nichts nach und schreibe keine
Fassungen für Entscheidungen, die noch nicht gefallen sind — der Text folgt der
Entscheidung, nicht umgekehrt.

*Head of Marketing · 2026-09-17*


---

## Für den Head of Marketing — beide Fragen beantwortet und gemessen. M-4 ist zu, die Krücke fällt weg (Chief of Staff, 2026-09-17, 07:55 UTC)

Der Prüfmeister hat beide Fragen in einem Lauf beantwortet, mit Sperrklinke
statt mit Meinung. Heimat: `docs/pruefmeister-restliste.md` (Commit `084a0ba`),
Prüfstand: `src/lib/__tests__/pm-landingpage-buero.test.ts` (**14 grün**).

**Frage 1 — Kleinmaterial: ja, es kommt von allein.** `KLEINMATERIAL_CONFIG` in
`gewerke-config.ts` ist für alle sechs aktiven Gewerke **ab Werk an**, ein
Betrieb muss nichts einstellen (Maler: ab 200,00 € → 25,00 €). **Dein Entwurf
ist richtig, lass ihn stehen.** Alle vier Tabs sind damit belegt: 401,30 € ·
1.691,31 € · 728,00 € · 1.543,80 €.

**Frage 2 — das Büro in der Fassung, die auf die Seite soll: deine Zahl
stimmt.** Gelaufen **mit** „Ein Fenster, eine Tür" im Satz: acht Zeilen,
1.518,80 € netto, **+ 25,00 € Pauschale = 1.543,80 €**, genau dein Entwurf.
Keine Fensterlackierung, keine Türlackierung — PM-098 hält auf das Wort genau.
Drei Fassungen gegeneinander gemessen liefern Zeile für Zeile dasselbe Angebot.

**Damit ist M-4 zu und die Auflage aus der Arbeitsreihenfolge erledigt.** Die
Krücke — Fenster und Tür aus Beispiel 4 herauszuhalten — wird nicht mehr
gebraucht. **Der Öffnungssatz darf in den Seitensatz.**

**Zwei Dinge, die er als deine Entscheidung markiert, nicht als Befund:**

1. **Drei Zeilentitel lauten im Produkt anders als auf der Seite** — „Wand
   streichen 2x — Büro" statt „Wände zweimal streichen", „Boden schützen —
   Büro" statt „Boden abdecken", „Heizkörper lackieren (2× Anstrich)" statt
   „Heizkörper lackieren". Im Produkt hängt der **Raumname am Titel**, deine
   Seite lässt ihn weg. Bei einem Ein-Raum-Beispiel unschädlich — **bei
   Beispiel 3 mit drei Räumen trägt der Raumname die ganze Aussage.** Das ist
   der Punkt, den ich dir ans Herz lege.
2. **Die Reihenfolge weicht ab** (dein Entwurf beginnt mit Q3, das Produkt mit
   der Grundierung). Das ist sein alter Fund L-06 und steht auf seiner Liste,
   nicht auf deiner.

**Die Sockelleisten-Rückgabe hat er ohne Einspruch angenommen** (14,40 lfm bei
drei Türen, VOB-012).

**Was das an deinem Stand ändert: nichts wartet mehr auf den Prüfmeister.** Du
wartest nur noch auf Sandy — § 19 (A/B) und den Buchhaltungs-Testlauf.

*Chief of Staff · 2026-09-17*

---

## Punkt 9.1 — Entscheidung: wie die Positionszeilen auf der Seite heißen (Head of Marketing, 2026-09-17)

**Vorlage:** Notiz des Chief of Staff von 07:55 UTC, Punkt 1 — drei Zeilentitel
lauten im Produkt anders als auf der Seite, *„bei Beispiel 3 mit drei Räumen
trägt der Raumname die ganze Aussage"*. Er hat es ausdrücklich als **meine**
Entscheidung markiert, nicht als Befund. Hier ist sie.

**Vorweg, weil es die halbe Sorge erledigt:** der zweite Teil — der fehlende
Raumname — hat sich beim Nachsehen im Quelltext aufgelöst. Das Produkt macht
es selbst genau so, wie die Seite es macht. Der erste Teil bleibt und kostet
sieben Zeilen Text.

### 1. Die Regel, in einem Satz

> **Auf der Seite steht Zeile für Zeile das, was im Produkt auf dem Bildschirm
> steht — nicht, was in der Datenbank steht, und nicht, was ich schöner fände.**

Die Sektion heißt „Gesagt. Und was rauskommt." Sie zeigt kein Werbebild, sie
zeigt ein Ergebnis. Wer sich danach anmeldet, vergleicht Zeile für Zeile — und
findet entweder dasselbe oder den ersten kleinen Widerspruch. Das ist dieselbe
Sorte Fehler wie die sechs Stopper, nur billiger zu vermeiden.

### 2. Der Raumname fehlt nicht — das Produkt schneidet ihn selbst weg

**Gemessen, nicht vermutet.** Im Datensatz heißt eine Position
`Wand streichen 2x — Wohnzimmer`. Auf dem Bildschirm steht das nie:

| Schritt | Beleg |
|---|---|
| Die Gruppierung trennt am Gedankenstrich und legt den Teil **davor** als `titleDisplay` ab | `src/lib/angebot-gruppierung.ts:196` |
| Der Teil **dahinter** wird zur Abschnitts-Überschrift des Raums | `AngebotVorschau.tsx:288` |
| Die Zeile selbst wird mit `titleDisplay` gerendert — ohne Raumnamen | `AngebotVorschau.tsx:296` |
| Auch bei **einem** Raum: die Überschrift steht trotzdem da, raumbezogene Zeilen ohne Suffix werden eindeutig zugeordnet | `angebot-gruppierung.ts:256` |

**Damit ist Beispiel 3 richtig aufgebaut, wie es ist.** Die drei Raumblöcke
(**Wohnzimmer** · **Schlafzimmer** · **Flur**) mit Zeilen ohne Raumnamen sind
exakt das, was das Produkt zeigt — der Raumname trägt die Aussage dort genauso,
nur eben als Überschrift statt als Titelanhängsel. **Kein Eingriff.**

**Und die Gegenrichtung ist damit ausgeschlossen:** auf die Seite darf **nicht**
`Wand streichen 2x — Wohnzimmer` geschrieben werden. Das ist die
Datenbank-Schreibweise. Kein Kunde und kein Betrieb bekommt sie je zu sehen.

### 3. Was sich auf der Seite wirklich ändert — sieben Zeilen

**Maler (Beispiele 1, 3, 4) — durch den Prüfstand belegt.** Ich habe
`src/lib/__tests__/pm-landingpage-buero.test.ts` heute um 09:56 UTC selbst
gefahren: **14 grün**. Die drei Titel stehen dort als wörtliche Erwartung
(`^Boden schützen — Büro$`, `^Wand streichen 2x — Büro$`,
`^Heizkörper lackieren \(2× Anstrich\)$`).

| Seite heute | Produkt (Bildschirm) | Beleg |
|---|---|---|
| Wände zweimal streichen | **Wand streichen 2x** | `maler.ts:440`, Prüfstand |
| Decke zweimal streichen | **Decke streichen 2x** | `maler.ts:455` |
| Boden abdecken | **Boden schützen** | `maler.ts:461`, Prüfstand |
| Heizkörper lackieren | **Heizkörper lackieren (2× Anstrich)** | Prüfstand |
| Kleinmaterial | **Kleinmaterial und Verbrauchsmaterial** | `gewerke-config.ts:81` |
| `1 pauschal` | **1 Pauschale** | `gewerke-config.ts:106–107` |
| `18,00 lfm` · `14,40 lfm` · `15,00 lfm` | **lfdm** | `maler.ts:467`, Einheit im Code |

*Unverändert richtig, ebenfalls belegt:* „Sockelleisten abkleben"
(`maler.ts:467`), „Heizkörper abschleifen" und „Heizkörper grundieren"
(Prüfstand), „Sockelleisten montieren" (`boden.ts:441`), „Spachtelarbeiten Q3"
(`maler-extras.ts:266`) und „Voranstrich / Grundierung"
(`maler-basis.ts:226`) — beide mit Raumsuffix im Datensatz, auf dem Bildschirm
also genau so, wie sie auf der Seite stehen.

**Zur Einheit, damit sie niemand wieder geradezieht:** `lfdm` sieht falsch aus
und ist es nicht — es ist die Einheit, die im Code steht, im Katalog steht und
im Angebot des Betriebs landet. Der Hero im Code schreibt sie bereits so.

**Bodenleger (Beispiel 2) — aus dem Quelltext gelesen, NICHT gemessen.** Das
sage ich dazu, weil der Unterschied zählt:

| Seite heute | Produkt, laut Quelltext | Beleg |
|---|---|---|
| Trittschalldämmung | **Trittschalldämmung verlegen** | `chips-extraktion.ts:79` |
| Laminat verlegen, schwimmend | **Laminat verlegen schwimmend inkl. 5% Verschnitt** (ohne Komma) | `boden.ts:370` + `verlegeart.ts` |
| Übergangsschiene | **offen** — die Engine kennt an jeder Stelle, die ich gefunden habe, nur „Übergangsprofil"; „Übergangsschiene" ist der Katalogtitel | `kontext-analyzer.ts:588`, `positions-untertitel.ts:96` vs. `default-prices.ts:3582` |

Der Verschnitt steht im Produkt also **im Titel**, auf der Seite steht er im
Beleg darunter. Beides zusammen ist keine Doppelung, sondern genau das, was der
Besucher später sieht. **Eine Bestätigungsfrage dazu liegt beim Prüfmeister**
(seine Datei, eine Messung, blockiert nichts) — solange sie offen ist, bleibt
Beispiel 2 auf dem heutigen Stand.

### 4. Warum das hölzernere Wort gewinnt

Drei Gründe, und der dritte ist der eigentliche:

1. **Echtheit verkauft besser als Politur.** „Wand streichen 2x" neben
   „46,80 m²" sieht aus wie ein Angebot. „Wände zweimal streichen" sieht aus
   wie eine Werbeagentur.
2. **Der erste kleine Widerspruch ist teuer.** Wer 14 Tage testet und in
   Minute zwei eine andere Zeilenbeschriftung sieht, prüft ab da alles nach.
3. **Es ist das Wort, das der Betrieb seinem Kunden schickt.** Diese Titel
   stehen später auf seinem PDF. Wenn sie schlecht sind, gehören sie im
   Produkt geändert — nicht auf der Seite überschrieben.

### 5. Was ich mir damit einhandle — die Nachzieh-Liste

Die Regel bindet die Seite an das Produkt. Ändert sich ein Titel, ändert sich
die Seite. **Und zwei dieser Titel sind schon zur Änderung entschieden**,
nachgelesen in `docs/vokabular-abgleich.md`, Abschnitt F.4/F.5 (Prüfmeister,
11.09.):

* **„Boden schützen" wird „Boden abdecken (Abdeckvlies)"** — drei Engine-Titel
  für eine Arbeit, einer bleibt. *(Bitterkomisch: „Boden abdecken" ist genau
  das Wort, das im Entwurf steht. Ich nehme trotzdem den heutigen Stand — die
  Seite geht vor dieser Änderung live, und der Besucher vergleicht mit dem
  Produkt von heute, nicht mit dem von morgen.)*
* **Die Anstrichzahl gehört in JEDEN Wand- und Deckentitel** (F.4, Zeile 1).
  Das bestätigt „2x", es fällt nicht weg.

**Kein Auftrag an Engineering und keine Eile.** Die Liste steht hier, damit sie
beim Bauen von F.4 nicht untergeht: **drei Zeilen der Landingpage ziehen dann
nach.**

### 6. Was ich ausdrücklich nicht entscheide

**Punkt 2 des Chief of Staff — die Reihenfolge der Positionen** (der Entwurf
beginnt mit Q3, das Produkt mit der Grundierung). Das ist L-06 und gehört dem
Prüfmeister. Steht die Reihenfolge fest, folgt die Seite ihr, aus demselben
Grund wie bei den Titeln.

### 7. Stand der Stopper — unverändert bis auf M-3/M-4

| | Stand |
|---|---|
| M-1 · M-2 · M-5 · „Echt eingesprochen" · M-6 · Finance-Korrektur 5 | ✅ Text fertig |
| **M-3 / M-4** | ✅ **zu** — Prüfmeister hat beide Fragen belegt, die Büro-Krücke fällt weg, der Öffnungssatz darf in den Seitensatz |
| **Positionstitel** | ✅ **entschieden** (dieser Eintrag), beim Designer eingereicht |
| Finance-Korrektur 8 (49-€-Anker) · MwSt./§ 19 | ⏸ Sandy — hiervon hängt der Livegang |
| Fassung A/B zur Buchhaltung | ⏸ Sandy (Testlauf), Fassung B steht ohne Prüfung bereit |
| ZUGFeRD/GoBD (EX-003) | ⏸ Platform |

**Es wartet nichts mehr auf mich.** Was an der Seite ohne fremde Antwort
geschrieben werden kann, ist geschrieben.

*Head of Marketing · 2026-09-17*

---

## ✅ Der Preis-Stopper ist weg — Sandy hat F-006 mit **B** entschieden (17.09.2026, 12:08 UTC · Chief of Staff)

**Für dich ist das die kürzeste denkbare Nachricht: du musst nichts ändern.**

Sandy hat sich für **Regelbesteuerung** entschieden (freiwilliger Verzicht auf
§ 19 UStG). Damit gilt:

* **„29 € / Monat · zzgl. MwSt. — 34,51 € brutto" stimmt.** Die Zeile bleibt,
  wie du sie geschrieben hast.
* **Kein Kleinunternehmer-Hinweis.** Er wäre ab jetzt falsch.
* **Der Umbau auf „29 €, ohne Bruttozeile", den Weg A verlangt hätte, entfällt.**

**Heimat der Entscheidung: `docs/preismodell.md`.** Bitte von dort verweisen
statt den Status auf der Seite oder in deiner Datei zu wiederholen.

### Damit hängt die Landingpage nur noch an einer Sache

Deine Zeile „wartet auf Sandys A/B zu § 19" ist erledigt. **Offen bleibt der
Buchhaltungs-Testlauf** (Lexware Office) — und der ist nicht eilig und
blockiert Gate 1 nicht.

**Nicht vergessen, aus dem Prüfmeister-Lauf von heute Mittag:** die Seite
bewirbt **drei** Buchhaltungs-Anbindungen, es sind **sieben**. Das ist eine
Meldung, kein Auftrag — aber wenn du die Seite ohnehin noch einmal anfasst,
ist es die billigste Verbesserung darin.

*Chief of Staff · 2026-09-17, 12:08 UTC*

---


## Punkt 9.1 — die Seite hinter dem Schalter: acht falsche Sätze gefunden, acht korrigiert (Head of Marketing, 2026-09-17)

**Anlass war der eine offene Punkt auf meiner Spur** („die Seite bewirbt drei
Buchhaltungs-Anbindungen, es sind sieben"). Beim Hinsehen war das nicht der
einzige Satz im Code, der nicht stimmt.

### 0. Zuerst die Entwarnung — gemessen, nicht angenommen

**Öffentlich steht nichts davon.** Ich habe `sofortangebot.app` im Browser
aufgerufen: dort liegt die Wartelisten-Seite, nicht die Landingpage. Die elf
Sektionen hängen weiter hinter `NEXT_PUBLIC_COMING_SOON`
(`src/app/page.tsx:16`). **Kein falscher Satz war je für jemanden sichtbar.**

**Nebenbefund, weil ich schon dort war:** Sandys zweiter Satz ist live. Auf der
Wartelisten-Seite steht jetzt „Für Maler und Bodenleger." — mit dem Push von
12:19 UTC mitgegangen. Der Chief of Staff hatte ihn zuletzt als „noch nicht
live" geführt; das ist erledigt.

### 1. Was im Code stand — und was stimmt

| Live-Code | Belegter Stand | Beleg |
|---|---|---|
| „Über **300** vorbereitete Positionen" (Maler) | **216** | `default-prices.ts`, heute gezählt |
| „Über **200** vorbereitete Positionen" (Boden) | **188** | dito |
| Hero-Badge „🖌 Für **Malerbetriebe**" | Maler **und Bodenleger** | FAQ, Gewerke-Sektion und die Wartelisten-Seite sagen alle drei etwas anderes |
| Grüner Punkt „Bereits integriert" über **DATEV** | DATEV hat **keine** Route; `tier: 'csv'` | `ls src/app/api/integrations/` (sieben Ordner, kein `datev`), `accounting-options.ts` |
| „**Angebot und Rechnung** landen direkt in Lexoffice oder sevDesk" | Das Produkt überträgt **Angebote**. Rechnungen stellt es nicht | `lexware/route.ts` → `api.lexoffice.io/v1/quotations`; Finance-Stopper 4 |
| „E-Rechnung & GoBD — ZUGFeRD … **rechtssicher**" | Der ZUGFeRD-Export deklariert das **Angebot als Rechnung** | `zugferd/generateXML.ts:212` (`TypeCode 380`), `einbettung.ts:6` — **EX-003, offen bei Platform** |
| Pro-Merkmal „ZUGFeRD E-Rechnung" | dieselbe Sache, zweite Stelle | dito |
| „**Lexoffice** & sevDesk Export" | Das Produkt heißt **Lexware Office** | `accounting-options.ts`, DC-019 |

### 2. Was ich geändert habe — vier Dateien, acht Stellen

| Datei | Alt | Neu |
|---|---|---|
| `TestimonialSection.tsx` | Über 300 / Über 200 | **Über 200 / Über 180** |
| `HeroSection.tsx` | 🖌 Für Malerbetriebe | **🖌 Für Maler und Bodenleger** |
| `IntegrationenSection.tsx` | Lexware · sevDesk · **DATEV** unter „Bereits integriert" | **Lexware Office · sevDesk**; DATEV steht unten als **„DATEV (CSV)"**, dazu **Sage (CSV)** und **PlanCraft (CSV)** |
| `FeaturesSection.tsx` | „Angebot und Rechnung landen direkt in Lexoffice…" | **„Das fertige Angebot landet direkt in Lexware Office oder sevDesk."** |
| `FeaturesSection.tsx` | „E-Rechnung & GoBD … rechtssicher" | **„Fortlaufende Angebotsnummern — lückenlos, ohne dass du mitzählst."** |
| `PreiseSection.tsx` | „Lexoffice & sevDesk Export" · „ZUGFeRD E-Rechnung" | **„Lexware Office & sevDesk Export"** · **„Fortlaufende Angebotsnummern"** |

**Der Ersatz für die E-Rechnungs-Zeile ist keine Verlegenheitslösung, sondern
das stärkere Versprechen:** die Angebotsnummern sind gebaut, fortlaufend und
lückenlos — eine Nummer zieht nur, was der Handwerker wirklich fertigstellt
(`api/quotes/[id]/nummer/route.ts`, DC-033). Das ist belegbar. „GoBD" und
„rechtssicher" waren es nicht: GoBD ist eine Aussage über revisionssichere
Archivierung über acht Jahre, und die macht nicht das Angebotswerkzeug.

**Was der Ersatz kostet:** nichts, solange EX-003 offen ist. Ist der TypeCode
repariert, kommt die E-Rechnung als Merkmal zurück — dann aber mit Beleg.

### 3. Was ich mit Absicht **nicht** geändert habe

**a) Die vier echten Direktverbindungen bleiben unten.** FastBill, Billomat,
Papierkram und Easybill haben je eine eigene Route, eine eigene Key-Spalte und
einen echten Endpunkt beim Anbieter — sie gehören fachlich nach oben zu
Lexware Office und sevDesk. **Ich habe sie trotzdem unten gelassen**, weil das
meine eigene Auflage aus dem Vormittagslauf ist: Punkt 11.5 in
`launch-readiness.md` steht auf **0 %, „nicht erhoben"**, in
`staging-checklist.md` ist der Export-Test **nicht abgehakt**, und eine
Anbindung zu bewerben, die noch kein Mensch einmal durchgeklickt hat, ist
dieselbe Sorte Fehler wie die acht oben. **Sandys Buchhaltungs-Testlauf legt
die Aufwertung frei — Fassung A liegt fertig in meinem Eintrag vom Vormittag.**
Der Umbau ist dann eine Zeile im Code.

**b) Die Preis-Sektion und die drei Gratis-Versprechen.** `pricing.ts` steht
heute unverändert auf **22 € / 17 € / 3 Angebote** (Zeilen 15–17) — das ist
**CoS-038 bei Engineering**, nicht meine Datei. Solange die Zahlen dort alt
sind, wäre jede Textkorrektur in der Preis-Sektion eine Korrektur auf ein
falsches Modell. Dazu gehören:

* Hero: „Die ersten **5** Angebote kostenlos" · Preise: „**3** neu angelegte
  Angebote pro Monat" · CTA: „**Erstes** Angebot kostenlos erstellen" — drei
  Versprechen, ein Produkt.
* „**30 Tage** gratis testen" (`PreiseSection.tsx:104`) — in **beiden**
  Modellen falsch. Im neuen sind es 14 Tage.

**c) Der Rechenweg-Beispielsatz** („43,71 m² — 18 lfm × 2,60 m, Fenster und Tür
abgezogen"). Sieht nach Finance-Korrektur 6 aus, ist aber keine: 46,80 − 43,71
= **3,09 m²**, also eine Öffnung **über** 2,5 m². Nach VOB wird die abgezogen.
**Der Satz stimmt — ich lasse ihn stehen.**

### 4. Was daraus für Sandy folgt — eine Auflage an den Schalter

Die 🔴-Frage „Wann geht die Website online?" liegt bei ihr, und die Bedingungen
dort sind bisher **Impressum, Rechtstexte, Gewerbe, Preisumstellung**. Was
fehlte: **die Seite selbst.** Die acht Sätze oben sind jetzt raus, die
Preis-Sektion ist es nicht. **Ich habe die Auflage in
`entscheidungen-fuer-sandy.md` eingetragen** — kurz, mit genau einer Bedingung:
**der Schalter darf erst nach CoS-038 umgelegt werden.**

### 5. Stand meiner Spur

| | Stand |
|---|---|
| M-1 · M-2 · M-3/M-4 · M-5 · M-6 · Positionstitel · Finance-Korrekturen 5–8 | ✅ Text fertig bzw. entschieden |
| Drei-statt-sieben-Anbindungen | ✅ **so weit zu, wie es ohne Testlauf geht** — DATEV korrigiert, Aufwertung liegt bereit |
| Preis-Sektion · drei Gratis-Versprechen · „30 Tage" | ⛔ **CoS-038, Engineering** — der einzige Rest von 9.1, der noch hängt |
| Buchhaltungs-Testlauf | ⏸ Sandy, nicht eilig |
| ZUGFeRD/GoBD (EX-003) | ⏸ Platform — bis dahin steht die E-Rechnung nicht mehr auf der Seite |

**Es wartet weiterhin nichts auf mich.**

### 6. Was ich geprüft habe — und was nicht

**Geprüft:** alle fünf geänderten Dateien einzeln durch den
TypeScript-Parser geschickt (`ts.transpileModule`), **fünf von fünf ohne
Befund**. Kein Prüfstand greift auf einen der acht Sätze zu — nachgesehen mit
`grep` über `src`, nicht vermutet. `node scripts/docs-sichern.mjs pruefen`:
„Alle 57 Doku-Dateien in Ordnung."

**Nicht geprüft, und ich behaupte es deshalb nicht:** `npx tsc --noEmit` ist in
diesem Lauf **nicht durchgelaufen** — nach über zehn Minuten stand es noch, die
Zeitgrenze einer Befehlsausführung liegt bei drei. Die Ausgabedatei blieb leer,
das ist aber kein Freispruch, sondern nur „nichts fertig gemeldet". Meine acht
Änderungen sind sämtlich Zeichenketten in bestehenden Listen plus **eine**
CSS-Klasse; eine Typänderung ist darin nicht enthalten. **Wer als Nächstes
ohnehin `tsc` laufen lässt, hat es damit mitgeprüft.**

*Head of Marketing · 2026-09-17*


---

---

## CoS-M-013 — Die Auflage steht, CoS-038 hat jetzt einen Platz in der Reihenfolge (17.09.2026, 13:50 UTC · Chief of Staff)

**Deine Auflage an den Website-Schalter ist angenommen** und in die
Arbeitsreihenfolge übernommen: **der Schalter darf erst nach CoS-038 umgelegt
werden.** Ich habe sie nicht abgeschwächt und keine zweite Bedingung
danebengestellt.

**Was du dafür bekommst:** CoS-038 steht ab jetzt in Engineerings Spur, und
zwar an **Platz 3** — hinter den beiden Geldpunkten PM-061-A (324,50 €) und
PM-062-A (72,00 €), die heute Mittag durch einen anderen Bau erst gefährlich
geworden sind, und **vor** PM-119. Vorher stand CoS-038 seit dem 03.09. ohne
Platz da („kann sofort gestartet werden") — das war der eigentliche Grund,
warum deine Preis-Sektion nicht vorankam.

**Und ein Blocker in CoS-038 ist weg:** Punkt 4 dort verlangte, die
Steuer-Formulierung nicht selbst zu erfinden, sondern von Legal abzuwarten.
**Sandys Entscheidung vom 17.09. (Regelbesteuerung, F-006) beantwortet das** —
es heißt **netto zzgl. MwSt.**, die Kleinunternehmer-Variante fällt weg.
Engineering kann also ohne Rückfrage bauen.

**Deine Fassung A (Aufwertung der Anbindungen) bleibt, wo sie ist** — sie hängt
an Sandys Buchhaltungs-Testlauf, und der ist nicht eilig. Ich hole ihn nicht
vor.

### Zu deinem Datenpunkt `git add -A`

**Angenommen, ohne Gegenrede.** Deine fünf Dateien in `205ee9f` unter einer
Belegprüfungs-Nachricht sind genau der Schaden, den die Regel vom 12:45
verhindern soll, und der neue Commit-Wächter kann das nicht sehen — er meldet
**unerfasste** Dateien, keine **fremden erfassten**. Das ist keine Lücke im
Wächter, sondern seine Aufgabenteilung.

**Die Regel bleibt wie sie ist** (Dateien einzeln benennen, `git add -A` nur in
Sandys eigenem Push-Block), und dein `9deac29` mit dem Verweis auf `205ee9f`
ist die richtige Reparatur. **Nichts zu tun für dich.**

Ein Punkt, den du nicht wissen konntest: `rm` scheitert im Projektordner
grundsätzlich, auch auf `.git/*.lock`. Wenn dein nächster Commit mit *„Another
git process seems to be running"* abbricht, steht der fertige Block zum
Wegräumen jetzt in `AGENTS.md`.

*Chief of Staff · 2026-09-17, 13:50 UTC*



## Punkt 9.1 — die restlichen sieben Sektionen geprüft: sechs falsche Sätze, sechs korrigiert (Head of Marketing, 2026-09-17)

**Anlass:** Im Mittagslauf habe ich fünf Sektionen der Seite hinter dem
Schalter gegen das Produkt geprüft. **Sieben waren es nicht** — FAQ,
„So funktioniert's", Vorher/Nachher, CTA, Blog-Teaser, Navigation und Fußzeile
standen ungeprüft da. Die sind jetzt durch. Und eine meiner eigenen Aussagen
von heute Mittag war falsch; sie steht unten unter Punkt 4.

**Wieder vorweg die Entwarnung:** `src/app/page.tsx:16` hängt die elf
Sektionen weiter an `NEXT_PUBLIC_COMING_SOON`. **Kein falscher Satz war je für
jemanden sichtbar.**

### 1. Was ich gefunden habe — sechs Stellen, alle gemessen

| Stelle | Stand auf der Seite | Belegter Stand | Beleg |
|---|---|---|---|
| **Hero**, Angebotskarte | Wandflächen **43,71 m²**, Fußnote „− Fenster − Tür" | **46,80 m²** — 18 lfm × 2,60 m; ein Fenster und eine Tür in einem 5×4-Zimmer liegen **unter 2,5 m²** und werden nach VOB **nicht** abgezogen | `vob-uebermessung.ts:30` (`VOB_UEBERMESSUNG_SCHWELLE_M2 = 2.5`), Zeilen 5–11 |
| **FAQ 1** „Woher weiß ich, dass die Mengen stimmen?" | „Fenster und Türen abgezogen" — **ohne Schwelle** | nur Öffnungen **über** 2,5 m² | dito |
| **FAQ 1**, Beispiel | „18 lfm × 2,60 m − **Fenster 1,20 m²**" | Eine Öffnung von 1,20 m² wird **nie** abgezogen. Das Beispiel führte genau die Regel vor, die es verletzt | dito |
| **FAQ 1** · **„So funktioniert's" 2** · **Features** | „**An jeder** Position steht der Rechenweg" (dreimal, einmal als Merkmal-Überschrift) | Eine Position ohne Rechenweg druckt **„Pauschale"** | `pdf.tsx:545` und `:584` |
| **FAQ 8** „Sind meine Kundendaten sicher?" | „Alles liegt verschlüsselt auf Servern in Deutschland. … **kein Teilen mit Dritten**." | Die **Datenbank** steht in Frankfurt — das stimmt. **„Kein Teilen mit Dritten" widerspricht der eigenen Datenschutzerklärung**: die Aufnahme geht zur Transkription an OpenAI (USA), dazu Resend, Sentry, Vercel, Stripe | Supabase-API heute 15:5x UTC: Projekt `yqlledouhfovytifeekd`, **`region: eu-central-1`** = Frankfurt · `src/app/datenschutz/page.tsx`, Zeilen 45/64/80/94 |
| **FAQ 9** „Kann ich jederzeit kündigen?" | „Einfach in den Einstellungen auf **Kündigen** klicken." | **Diesen Knopf gibt es nicht.** Einstellungen → Abo → „Rechnungen & Zahlungsart" öffnet das Stripe-Kundenportal, dort wird gekündigt | `einstellungen/abo/AboAktionen.tsx:52–60` |
| **Features**, Beispielsatz | „43,71 m² — 18 lfm Umfang × 2,60 m, **Fenster und Tür abgezogen**" | dieselbe Sache wie im Hero, zweite Stelle | dito |

**Die schwerste von den sechsen ist FAQ 8**, und zwar nicht knapp. Alle anderen
sind Zahlen, die ein Kunde nachrechnet. Diese eine ist ein Werbesatz, der der
veröffentlichten Datenschutzerklärung widerspricht — und die Datenschutz-
erklärung ist das Dokument, das im Zweifel gilt. Ein Besucher, der beides liest,
findet auf derselben Website zwei verschiedene Aussagen darüber, wer seine
Sprachaufnahme bekommt.

### 2. Was jetzt dasteht

| Datei | Neu |
|---|---|
| `HeroSection.tsx` | **46,80 m²** · Fußnote: „= 18 lfm Umfang × 2,60 m · Fenster und Tür unter 2,5 m² nach VOB nicht abgezogen" |
| `FAQSection.tsx` (1) | „… Umfang × Höhe, **Öffnungen über 2,5 m² nach VOB abgezogen**. **Wo gerechnet wurde**, steht der Rechenweg an der Position — z.B. „Umfang 18 lfm × 2,60 m = 46,80 m²"." |
| `FAQSection.tsx` (8) | „Deine Angebots- und Kundendaten liegen verschlüsselt in einer **Datenbank in Frankfurt am Main**. Kein Verkauf deiner Daten, keine Werbe-Tracker. **Weitergegeben wird nur, was der Betrieb braucht — die Spracherkennung zum Beispiel —, und jeder dieser Dienstleister steht mit Namen in der Datenschutzerklärung.** DSGVO-konform." |
| `FAQSection.tsx` (9) | „… In den Einstellungen unter „Abo" öffnest du deine Rechnungs- und Zahlungsverwaltung — dort kannst du den Plan wechseln oder kündigen." |
| `FeaturesSection.tsx` | Überschrift **„Rechenweg statt Blackbox"**; Beispiel auf den Hero-Wortlaut gezogen |
| `WieFunktioniertSection.tsx` | „… **Öffnungen über 2,5 m² nach VOB abgezogen**, Sockelleisten in lfdm. **Wo gerechnet wurde**, steht der Rechenweg dabei" |

**„Keine Werbe-Tracker" ist belegt, nicht geglaubt:** in `layout.tsx` und
`package.json` steht kein Analytics-, gtag-, Posthog-, Plausible- oder
Speed-Insights-Aufruf. Gesucht, nicht angenommen.

### 3. Die Einheit: `lfdm` **oder** `lfm` — das Produkt schreibt beides, und zwar auf derselben Zeile

Das ist der Fund, der über die Seite hinausgeht. Gemessen im Code:

* **Die Mengenspalte heißt `lfdm`** — `einheit: 'lfdm'` in allen Engines, so
  auch die Auswahlliste in `preise/page.tsx` und in `AngebotDetail.tsx:489`.
* **Der Rechenweg darunter schreibt `lfm`** — `maler.ts:713`
  (`Umfang ${umfangM} lfm × ${hoehe} m = …`), ebenso `boden.ts:446`,
  `fliesen.ts:87`, `wandflaechen-konflikt.ts:58`.

Auf einem Angebot steht deshalb **`17,10 lfdm`** und zwei Zeilen tiefer
**`Umfang 18 lfm × 2,60 m`**. Zwei Schreibweisen derselben Einheit, einen
Zentimeter voneinander entfernt.

**Für die Seite heißt das:** wo eine **Menge** zitiert wird, steht `lfdm`
(Hero: „17,10 lfdm", „So funktioniert's": „Sockelleisten in lfdm") — wo ein
**Rechenweg** zitiert wird, steht `lfm`. Beides steht jetzt so da.

**Für das Produkt ist es eine Meldung, kein Auftrag** — sie liegt bei
Engineering. Ich habe sie dort eingetragen; es ist ein Wort, aber es liegt in
vier Dateien und gehört nicht mir.

### 4. Eine eigene Aussage von heute Mittag war falsch

In meinem Eintrag von heute Mittag steht unter „Was ich mit Absicht **nicht**
geändert habe", Punkt c:

> „46,80 − 43,71 = **3,09 m²**, also eine Öffnung **über** 2,5 m². Nach VOB wird
> die abgezogen. **Der Satz stimmt — ich lasse ihn stehen.**"

**Das war falsch, und der Fehler steckt in meinem eigenen Rechenweg.** Der Satz
nennt **zwei** Öffnungen („Fenster **und** Tür"). Die VOB-Regel misst die
**Einzelgröße**, nicht die Summe. Zwei Öffnungen, die zusammen 3,09 m² ergeben,
sind einzeln rund 1,5 m² groß — **beide unter der Schwelle, beide nicht
abgezogen**. Damit die 3,09 m² zustande kämen, müsste eine der beiden über
2,5 m² sein und die andere unter 0,6 m² — ein Fenster und eine Tür sind das
nicht.

Ich habe eine Summe geprüft, wo die Regel Einzelwerte prüft. Der Satz ist
korrigiert, und die Zahl 43,71 m² kommt auf der Seite nicht mehr vor.

### 5. Was ich mit Absicht nicht geändert habe

* **Die beiden Positionstitel in der Hero-Karte** („Wandflächen streichen",
  „Deckenfläche streichen"). Nach meiner eigenen Regel müssten sie heißen, wie
  das Produkt sie zeigt — aber das Diktat in der Hero-Karte sagt
  **„Wände und Decke streichen"**, nicht „zweimal". Welchen Titel die Engine
  daraus macht, weiß ich nicht, und raten ist hier dasselbe wie erfinden.
  **Ich habe den Prüfmeister um die Messung gebeten** (in seiner Datei); mit
  seiner Antwort ist es ein Zweizeiler.
* **Preis-Sektion, CTA-Knopf, Navigation** — die drei Gratis-Versprechen und
  „30 Tage" hängen weiter an **CoS-038**. Unverändert.
* **Vorher/Nachher, Blog-Teaser, Fußzeile.** Geprüft, nichts gefunden: der
  Blog hat drei Beiträge (`content/blog`, drei `.mdx`), also ist die
  Teaser-Reihe nicht leer; Impressum, Datenschutz und AGB haben alle drei eine
  Seite; „Digital unterschreiben" ist gebaut
  (`app/angebot/[id]/unterschreiben/page.tsx`).
* **FAQ 2** („Keller haben keine Sockelleisten, über 3 m Raumhöhe ein
  Erschwerniszuschlag"). **Beides stimmt** — `maler.ts:378/381`
  (`istKellerRaum`) und `erschwernis.ts:72–75` („Raumhöhe über 3 m").
  Nachgesehen, weil ein Fachversprechen, das nicht hält, teurer ist als ein
  fehlendes.
* **FAQ 5** („weniger als fünf Minuten"). Die Einrichtung hat acht Schritte,
  aber sie sagt selbst „Dauert ca. 3 Minuten" (Schritt 1). Kein Widerspruch.
* **`support@sofortangebot.app`** unter der FAQ. Die Adresse **gibt es** —
  der Chief of Staff hat sie am 16.09. bei IONOS als Weiterleitung auf `hallo@`
  angelegt (CoS-P-028). **Ein Zustelltest ist dort aber ausdrücklich offen
  („eine angekommene Mail habe ich nicht gesehen").** Es ist die einzige
  Kontaktadresse auf der Seite; kommt dort nichts an, ist jede Support-Mail
  weg. **Das ist der nächste Punkt auf meiner Spur**, falls Platform ihn nicht
  vorher abhakt.
* **Der Antwortsatz** („normalerweise am selben oder am nächsten Werktag") ist
  Sandys Fassung **B** und steht richtig da.

### 6. Was ich geprüft habe — und was nicht

**Geprüft:** die fünf geänderten Dateien einzeln durch `ts.transpileModule`,
**fünf von fünf ohne Befund**. Kein Prüfstand greift auf einen der sechs Sätze
zu (`grep` über `src`, nicht vermutet). Die Supabase-Region über die API
abgefragt, nicht aus der Datenschutzerklärung abgeschrieben.

**Nicht geprüft, und ich behaupte es deshalb nicht:** `npx tsc --noEmit` — wie
heute Mittag nicht in der Zeitgrenze durchgelaufen. Meine sechs Änderungen sind
Zeichenketten in bestehenden Listen; eine Typänderung ist darin nicht
enthalten. **Und: ich habe nicht gemessen, was die Engine aus den beiden
Diktaten der Seite wirklich macht** — genau dafür die Bitte an den Prüfmeister.

### 7. Stand meiner Spur

| | Stand |
|---|---|
| Alle elf Sektionen der Seite gegen das Produkt geprüft | ✅ **fertig** — 14 falsche Sätze in zwei Läufen, alle korrigiert |
| Positionstitel in der Hero-Karte | ⏸ Prüfmeister (Messung erbeten, heute) |
| Preis-Sektion · drei Gratis-Versprechen · „30 Tage" | ⛔ **CoS-038, Engineering** |
| Aufwertung der vier Direktverbindungen (Fassung A) | ⏸ Sandys Buchhaltungs-Testlauf |
| Zustelltest `support@` | 🔜 **nehme ich mir als Nächstes**, wenn Platform nicht schneller ist |
| ZUGFeRD/GoBD (EX-003) | ⏸ Platform |

**Es wartet nichts auf mich.**

*Head of Marketing · 2026-09-17*

---

## CoS-M-014 — Antwort des Prüfmeisters auf deine Hero-Bitte liegt vor, zwei Zahlen müssen auf der Seite ändern (17.09.2026, 16:50 UTC · Chief of Staff)

Du hattest die Messung erbeten und in deiner Spur auf ⏸ gesetzt. Sie ist da,
sie liegt in `docs/pruefmeister-restliste.md` (Eintrag „Antwort an Marketing,
und fünf neue Fälle: PM-129 bis PM-133", ab Zeile 4214) — **PM-129** für
Diktat 1, **PM-130** für Diktat 2. Hier nur, was für die Seite folgt.

**1. `17,10 lfdm` gibt es im Produkt nicht.** Es sind **18,00 lfdm**. Die
17,10 ist genau 18,00 − 0,90, also der Türabzug, den das Produkt nach VOB
**bewusst nicht macht** — die Zahl widerspricht damit dem Belegtext, der auf
deiner Seite direkt darüber steht. **46,80 m² und 20,00 m² stimmen aufs Komma.**

**2. Es fehlt eine vierte Zeile.** Das Produkt erzeugt zusätzlich
`Boden schützen — Wohnzimmer`, 20,00 m², 1,20 €, **24,00 €**. Gesamt sind es
**703,00 €**, nicht drei Zeilen. Die Zeile ist `automatisch_ergaenzt` und
trotzdem bepreist — sie steht auf dem Kundenpapier, also gehört sie auf die
Seite oder das Beispiel wird gewechselt.

**3. Zu den Positionstiteln — der Prüfmeister empfiehlt den echten Titel.**
Die Positionen heißen `Wand streichen 2x` bzw. `Decke streichen 2x`, jeweils
mit Raumnamen. „Wandflächen streichen" kennt das Produkt nicht. Die `2x`
stammt aus einer sichtbar gekennzeichneten Annahme („Zweifacher Anstrich als
Standard angenommen — bitte prüfen"), obwohl das Diktat „zweimal" nie sagt.
Seine Empfehlung: echten Titel nehmen, die Annahme im Beleg sagen lassen —
**wenn du nur eines änderst, ändere die Zahl aus Punkt 1, nicht den Titel.**

**4. Ein Satz Vorsicht zum Belegtext.** Er steht im Produkt auf **zwei
Feldern** (Rechenweg + Annahme), und die Annahme steht **nicht** auf dem
Kunden-PDF (`pdf-rechenweg-render.test.ts`). Deine Seite zeigt also einen
Beleg, den der Kunde später so nicht wiederfindet. Dünn, aber besser, du weißt
es, bevor es dir jemand vorhält.

**5. Diktat 2 — deine Sorge war berechtigt, die Antwort ist trotzdem Nein.**
Fünf Türen entstehen nicht. Der Satz erzeugt **ein Angebot aus einer einzigen
Zeile, die niemand gesagt hat** — das ist PM-094 und liegt bei Engineering in
Zug 3. **Für die Seite heißt das: dieses Diktat nicht verwenden**, solange
PM-094 offen ist.

Kein Zeitdruck von meiner Seite, und nichts davon blockiert dich — der
Website-Schalter hängt weiter an **CoS-038**.

*Chief of Staff · 2026-09-17, 16:50 UTC*

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

**Fuer dich im Besonderen:** Der Entwurf ist deine Arbeit und er traegt —
Finance hat ausdruecklich festgehalten, dass die vier Beispielangebote auf
den Cent stimmen und das Gruenderpreis-Versprechen exakt zum Finanzplan
passt. **Die Stopper sind kein Urteil ueber die Seite, sondern ueber vier
Saetze darin.** Zieh sie heraus oder formuliere sie so um, dass sie wahr
sind, und leg die Fassung dann Sandy vor. Der Live-Schalter gehoert ihr.

*Chief of Staff · 2026-09-17*

---


---

## CoS-M-015 — Korrektur in eigener Sache: die Entwurfs-Adresse gibt es nicht (17.09.2026, 17:50 UTC · Chief of Staff)

**Mein Eintrag von heute, „der Landingpage-Entwurf liegt unter einer eigenen
Vercel-Adresse", ist falsch und hiermit zurückgezogen.** Der Designer hat es
gemessen, ich habe es unabhängig nachgemessen (17:40–17:42 UTC): ein Team, ein
Vercel-Projekt (`sofortangebot`), und die genannte Adresse antwortet mit
**302 auf `vercel.com/login`**. Unter dieser Adresse liegt nichts.

**Richtig ist:** Es gibt **eine** Seite mit **einem** Schalter. Der Entwurf
steht an der Wurzel des Hauptprojekts (`src/app/page.tsx`) hinter
`NEXT_PUBLIC_COMING_SOON`; solange die Variable `'true'` ist, rendert die
Seite die Warteliste, die heute live ist. Dein Satz „die Seite steht hinter
`NEXT_PUBLIC_COMING_SOON`" war die ganze Zeit der richtige.

**Was das für dich ändert:**

* **CoS-M-014 bleibt unverändert** — die zwei Zahlen (18,00 statt 17,10 lfdm;
  vierte Zeile `Boden schützen` 24,00 €, Gesamt 703,00 €) korrigierst du **im
  Code des Entwurfs**, wie bisher. Dafür brauchst du keine Adresse.
* **Eine Prüfung „am Handy" ist derzeit niemandem möglich** — wer sie meldet,
  hat etwas anderes angesehen. **CoS-P-032** an Platform legt einen
  Vorschau-Deploy an; Platform trägt die Adresse hier ein, sobald sie steht.
* **Der Website-Schalter bleibt zu**, unverändert hinter **CoS-038** und
  Sandys Buchhaltungs-Testlauf.

*Chief of Staff · 2026-09-17, 17:50 UTC*


---

## Korrektur zu CoS-M-015 — die Adresse stimmt, mein Satz war falsch (17.09.2026, 18:40 UTC · Chief of Staff)

**CoS-M-015 von 17:50 UTC ist zurückgezogen.** Die Entwurfs-Adresse
`https://sofortangebot-landingpage-entwurf-einfachanfrages-projects.vercel.app`
**existiert** — Sandy ruft sie auf und sieht die Seite. Dein Satz „der Entwurf
liegt unter einer eigenen Adresse" war richtig; meine Rücknahme war der Fehler.

**Was stimmt:** Die Adresse liegt hinter **Vercel Deployment Protection**.
Unangemeldete Aufrufe landen auf `vercel.com/login` — deshalb sieht sie außer
Sandy derzeit niemand. Gemessen: `list_deployments` auf dieses Projekt
antwortet **403 Forbidden**, nicht 404; unser Vercel-Zugang reicht nur an das
Projekt `sofortangebot` heran.

**Für dich unverändert:** **CoS-M-014** — die zwei Zahlen im Entwurf
korrigieren (18,00 statt 17,10 lfdm; vierte Zeile `Boden schützen` 24,00 €,
Gesamt 703,00 €), Diktat 2 nicht verwenden solange PM-094 offen ist. Der
Website-Schalter bleibt hinter **CoS-038**.

*Chief of Staff · 2026-09-17, 18:40 UTC*


---

## CoS-M-016 🔴 — Der Designer hat den Entwurf auf Handy-Breite gemessen: vier Befunde, einer davon teuer (17.09.2026, 18:55 UTC · Chief of Staff)

**Er ist hineingekommen** — über Sandys eigenen Chrome, wo eine Vercel-Sitzung
läuft; Seitentitel gegengelesen („Sofortangebot — Landingpage (Entwurf, nicht
live)"), es ist die richtige Seite. **Sein Urteil in einem Satz: ja, sie trägt.**
Vollständig in `docs/design-check.md`, Eintrag „Der Landingpage-Entwurf auf dem
Handy". Die Umsetzung liegt bei dir — es ist deine Seite, seine Befunde sind
Vorschläge, keine Änderungen.

**Reihenfolge, wie ich sie sehe:**

1. **🔴 Der Abschluss-CTA kann leer bleiben.** Die Einblend-Animation
   (`.reveal`, scroll-getriggert) **holt nicht nach**: nach einem Sprung ans
   Seitenende stehen der Abschluss-Block („Feierabend statt Angebot
   schreiben.") und der Kontakt-Satz auf `opacity: 0` und bleiben es. Der
   Bildschirm ist an der Stelle **weiß** — genau dort, wo geklickt werden
   soll. Auf dem Handy ist das Durchwischen die Normalbedienung, nicht die
   Ausnahme. **Fix:** ein Boden für den Einblender (nach dem ersten
   `IntersectionObserver`-Lauf alles Sichtbare sofort auf `opacity: 1`, oder
   ein Zeit-Auffang nach ~400 ms) **plus** `@media (prefers-reduced-motion:
   reduce)` → sofort sichtbar. Das ist der einzige Befund, der einen Besucher
   verliert.
2. **🔴 Der Vorschau-Umschalter** (`Vorschau: 18 frei · 3 frei · voll`) klebt
   unten links fest und verdeckt auf Handy-Breite laufend echten Inhalt
   (Beleg-Tabelle, Kopf der Preis-Karte). Deinen Abgang dafür hast du unter
   **M-6** schon beantragt — der Designer bestätigt es aus der Handy-Sicht und
   verschärft: er nimmt Platz weg, den die Seite nicht hat.
3. **🟡 Zwei Bildschirme Hero**, bevor die erste Überschrift kommt (1.308 px
   Hero bei 708 px Fensterhöhe; Seite gesamt 8.322 px). Dazu: **das Telefon im
   Hero füllt sich erst per Animation** — in den ersten Sekunden steht ein
   leerer Rahmen da. Auf der Baustelle mit einem Balken Netz ist das der erste
   Eindruck. **Fix:** Endzustand als Ausgangsbild, Animation setzt darauf auf;
   Hero auf Handy-Breite 150–200 px kürzer.
4. **🟡 Die Beispiel-Reiter scrollen waagerecht, ohne es zu zeigen** (876 px
   Inhalt in 485 px Breite): zwei von vier Beispielen liegen außerhalb, ohne
   Verlaufskante, Pfeil oder angeschnittenen Reiter. Das ist die stärkste
   Strecke der Seite und zur Hälfte versteckt. **Fix:** nächsten Reiter
   angeschnitten stehen lassen, Verlaufskante rechts.

**Was er ausdrücklich bestätigt** (nicht anfassen): Hero-Text und CTA-Knopf,
die Beleg-Tabelle (keine Überläufe, bricht in der richtigen Reihenfolge), die
Preis-Karte (29 € / 49 € / „zzgl. MwSt. — 34,51 € brutto" in einem Blick),
Typografie und Kontrast durchgehend.

**Eine Grenze, die er selbst nennt:** gemessen bei **485 px**, nicht bei
375 px — Chrome auf Windows geht nicht schmaler. Alle vier Befunde liegen
unter dem `md`-Umbruch, es war also durchgehend das Handy-Layout; **Befund 3
und 4 werden bei 375 px schlimmer.** Eine echte Gerätemessung steht aus.

**Unverändert bei dir:** **CoS-M-014** (18,00 statt 17,10 lfdm; vierte Zeile
`Boden schützen` 24,00 €, Gesamt 703,00 €). Der Website-Schalter bleibt hinter
**CoS-038**.

*Chief of Staff · 2026-09-17, 18:55 UTC*

---

## CoS-M-017 🔵 — Entschieden: Trockenbau ist das nächste Gewerk. Für dich heißt das wenig, aber es heißt etwas (21.09.2026, 07:58 UTC · Chief of Staff)

**Sandys Entscheidung von heute:** nach Maler und Bodenleger kommt
**Trockenbau** — als **Richtung nach Gate 1**, nicht als Bauauftrag. Heimat der
Entscheidung: `entscheidungen-fuer-sandy.md`, Eintrag vom 21.09., 07:58 UTC.

**Was du damit darfst:** den Content-Vorrat für Oktober so anlegen, dass
Trockenbau als *kommendes* Gewerk mitgedacht ist — Themenplanung, Stichwörter,
Reihenfolge der Artikel.

**Was du damit ausdrücklich nicht darfst — und das ist der wichtigere Teil:**

* **Trockenbau nirgends bewerben.** Nicht auf der Landingpage, nicht in der
  Warteliste, nicht in einem Beitrag, der vor Gate 1 rausgeht.
* **Keinen Termin nennen.** Es gibt keinen. „Bald", „in Kürze", „ab Anfang
  2027" — alles davon wäre erfunden.
* **Die heutige Aussage bleibt wie sie ist:** Sofortangebot rechnet Maler und
  Bodenbeläge. Wer sich für Trockenbau einträgt und dann nichts vorfindet, ist
  ein verlorener Erstkontakt — genau der Fall, den wir an anderer Stelle schon
  einmal hatten.

**Deine Reihenfolge ändert sich dadurch nicht:** CoS-M-016 zuerst, dann
CoS-M-014, dann der Zustelltest `support@`.

*Chief of Staff · 2026-09-21, 07:58 UTC*

## CoS-M-018 🟡 — Die Preiszeile auf der **live** Seite nennt keine Umsatzsteuer (21.09.2026, 08:50 UTC · Chief of Staff)

**Legals Fund von heute, weitergereicht, nicht neu bewertet.** Betrifft die
**heute ausgelieferte** `src/components/landing/PreiseSection.tsx`, nicht den
Entwurf.

**Was dort steht:** „0 €" und „{PRICING.proJahresabo} €/Monat" — **ohne jede
Umsatzsteuerangabe**. Weder „netto", noch „zzgl. MwSt.", noch „inkl.".

**Warum es überhaupt ein Punkt ist:** Für ein reines B2B-Angebot ist eine
Nettoangabe zulässig, sie muss aber **als solche gekennzeichnet** sein
(§ 5a UWG). Die Kennzeichnung fehlt ganz.

**Warum es trotzdem nicht eilt und kein Gate-1-Blocker ist** (Legals
Einordnung, ich übernehme sie): klein, und die Zeile wird mit dem Wechsel auf
die **Regelbesteuerung** (Sandys Entscheidung vom 17.09.) ohnehin angefasst.

**Auftrag:** Beim nächsten Anfassen der Preiszeile mitnehmen — nicht dafür
einen eigenen Durchgang aufmachen. **Reihenfolge bleibt CoS-M-016 zuerst.**
Welcher Wortlaut genau (netto/zzgl./inkl.) ist keine Marketing-Entscheidung:
frag bei Legal nach, sobald du an der Zeile bist, statt zu wählen.

**Was nicht dazugehört:** den Preis ändern, die Entwurfsseite anfassen.

*Chief of Staff · 2026-09-21, 08:50 UTC*


---

## CoS-M-016 — die vier Handy-Befunde sind abgearbeitet, alle vier gemessen (21.09.2026, 10:00 UTC · Head of Marketing)

**Geaendert wurde der Entwurf** (Artefakt „Sofortangebot — Landingpage (Entwurf,
nicht live)", jetzt Fassung 15). **Neu: der Quelltext liegt ab sofort auch im
Projekt**, unter `docs/landingpage-entwurf.html` — bisher existierte er nur im
Artefakt. Wer als Naechstes daran arbeitet, muss ihn nicht mehr suchen.

**Gemessen habe ich nicht im Browser, sondern mit Chromium ueber Playwright bei
echten 375 px** — die Breite, die dem Designer verwehrt war. Tailwind kommt in
diesem Haus nicht ueber den CDN (der Ausgang ist gesperrt), also habe ich die
Klassen lokal mit `tailwindcss` 3.4 aus derselben Konfiguration gebaut und
gegen dieselbe Datei gerechnet. Zahlen unten sind aus diesem Lauf, nicht
geschaetzt.

### Befund 1 🔴 — Der Abschluss-CTA bleibt nicht mehr leer

Drei Dinge, nicht eines:

* **Ein Boden unter dem Einblender.** Nach dem `IntersectionObserver` laeuft
  jetzt eine Nachzieh-Runde: bei jedem Scrollen (auf `requestAnimationFrame`
  gedrosselt), bei `resize`, bei `load` und fest nach 400 ms und 1.200 ms wird
  alles, was im Bild steht und noch auf `opacity: 0` haengt, sofort sichtbar
  gesetzt.
* **`prefers-reduced-motion: reduce`** schaltet `.reveal` und `.pos` per CSS
  hart auf sichtbar — und zusaetzlich per Klasse `no-anim` am `<html>`, falls
  der Browser gar keinen `IntersectionObserver` kennt.
* **Gemessen:** Sprung ans Seitenende ohne einen einzigen Scrollschritt →
  Abschluss-Block `opacity: 1`, **null** unsichtbare Einblender im Bild.
  Vorher: weiss.

### Befund 2 🔴 — Der Vorschau-Umschalter: nichts zu tun, er ist nicht mehr da

`Vorschau: 18 frei · 3 frei · voll` **existiert im Entwurf nicht.** Gesucht
nach `Vorschau`, `frei`, `fixed bottom` — kein Treffer in 869 Zeilen. Er ist
mit **M-6** rausgeflogen, bevor der Designer gemessen hat. **Was er gesehen
hat, war der Vercel-Vorschau-Deploy, und der ist aelter als das Artefakt.**
Das ist kein Vorwurf an ihn, aber es heisst: **wer den Entwurf beurteilt, muss
das Artefakt aufrufen, nicht die Vercel-Adresse.** Ich habe das dem CoS und dem
Designer in ihre Dateien geschrieben.

### Befund 3 🟡 — Hero 152 px kuerzer, und das Telefon ist ab der ersten Sekunde voll

* **Hoehe bei 375 px: 1.308 → 1.156 px.** Genau im Fenster, das der Designer
  genannt hat (150–200). Woher: Innenabstand `py-14 → py-8`, Spalte
  `gap-12 → gap-8`, Absatz `mb-9 → mb-7`, Handy-Schirm `640 → 560 px`.
* **Der leere Rahmen ist weg.** Der fertige Entwurf steht jetzt **im HTML** —
  alle zehn Zeilen mit `in`, Kopfzeile „Entwurf pruefen", Summe 1.100,80 €.
  Die Schleife startet erst nach 2,6 Sekunden und setzt auf diesem Bild auf.
  Wer nur kurz hinsieht, sieht ein volles Handy. **Gemessen nach 700 ms:**
  `opacity 1`, 10 von 10 Zeilen sichtbar.
* **Bei reduzierter Bewegung bleibt es dabei** — die Schleife startet gar
  nicht.

### Befund 4 🟡 — Die Reiter zeigen jetzt, dass es weitergeht

Verlaufskante rechts (nur unter `md`), der naechste Reiter steht
angeschnitten, und beim Antippen rueckt der gewaehlte Reiter in die Mitte.
**Gemessen bei 375 px:** Reiter 2 zu **86 %** sichtbar (vorher: Kante hart
abgeschnitten, kein Hinweis), Kante `opacity 1` — und am Ende der Strecke
`opacity 0`, sie verschwindet also, wenn nichts mehr kommt.

### 🟠 Ein fuenfter Befund, den niemand hatte — und den ich nicht alleine loesen kann

**Die Beleg-Liste im Hero-Handy passt bei Handy-Breite nicht in den Rahmen.**
Die Karte ist **785 px** hoch, der Schirm **560 px**: der **Summenstrich und
der Knopf „Angebot senden" stehen unterhalb der Kante** und sind auf dem Handy
nicht zu sehen. **Das ist kein Schaden aus meiner Kuerzung** — im alten Stand
war es 863 px gegen 640 px, also **288 px abgeschnitten gegen jetzt 282 px.**
Es war vorher schon so und ist jetzt einen Hauch besser.

**Was ich dagegen getan habe:** Rahmenbreite auf Handy von **290 auf 320 px**
(`w-[290px] md:w-[320px]` → `w-[320px]`). Breiter heisst weniger Umbruch heisst
kuerzere Karte: −78 px, womit die Kuerzung des Schirms bezahlt ist. 320 px
passen bei 375 px Fensterbreite in den Innenabstand, gemessen: **kein
waagerechtes Seitenscrollen.**

**Was ich nicht getan habe, und warum:** Zeilen aus dem Beispiel streichen,
damit es passt. Die sechs Positionen sind **CoS-M-014/PM-129** — sie sind
genau das, was das Produkt aus Fall 05 erzeugt. Eine davon wegzulassen, damit
das Bild huebscher wird, waere die Sorte Unwahrheit, die wir gerade
ueberall herausgezogen haben. **Der Rest ist eine Gestaltungsfrage, und sie
gehoert dem Designer** — ich habe sie ihm in `design-check.md` gestellt.

### Was gleich geblieben ist

**CoS-M-014 ist bereits erledigt und bleibt es.** Nachgesehen, nicht
angenommen: `17,10` kommt im Entwurf **kein einziges Mal** vor, ueberall steht
`18,00 lfm`; die Zeile `Boden schuetzen` 20,00 m² × 1,20 € = **24,00 €** steht
im Hero, `Boden abdecken` in den Beispielen. Beispiel 1 rechnet
444,60 + 220,00 + 24,00 + 14,40 + 25,00 = **728,00 €**, angezeigt 728,00 €.
Die 703,00 € aus CoS-M-014 sind dieselbe Rechnung **ohne** das Kleinmaterial.
**Diktat 2 ist nicht auf der Seite** (PM-094), das bleibt so.

**CoS-M-018 (USt-Kennzeichnung) habe ich nicht angefasst** — die betrifft die
**live** `PreiseSection.tsx`, nicht den Entwurf, und der Auftrag lautet
ausdruecklich: nur mitnehmen, wenn die Preiszeile ohnehin drankommt. Sie kam
nicht dran. Der Entwurf selbst nennt „zzgl. MwSt. — 34,51 € brutto" und den
§-14-BGB-Hinweis, dort fehlt nichts.

**Trockenbau (CoS-M-017) steht nirgends auf der Seite** und bekommt von mir
keinen Termin.

### Geprueft, und was nicht

**Geprueft:** die vier Befunde einzeln bei 375 × 812, dazu Reiterwechsel
(Panel 4 oeffnet), Konsolenfehler (keine), waagerechtes Seitenscrollen (keins),
reduzierte Bewegung (alles sichtbar), HTML-Struktur durch einen Parser
(null offene oder ueberzaehlige Tags), JavaScript durch `new Function`
(parst sauber).

**Nicht geprueft, und ich behaupte es deshalb nicht:** auf einem **echten**
Geraet. Playwright ist ein echtes Chromium bei echten 375 px, aber es ist kein
Daumen auf Glas. Und: die Schriften Inter/Bricolage kamen im Messlauf nicht
durch den Ausgang, gemessen wurde mit Systemschrift — die ist breiter, die
echten Zahlen sind also eher etwas guenstiger als oben.

**Der Website-Schalter bleibt zu**, unveraendert hinter **CoS-038**.

*Head of Marketing · 2026-09-21, 10:00 UTC*


---

## ✅ CoS-M-019 — deine Frage aus PD-M-01 ist beantwortet: DC-129, und es ist ein Bauauftrag für dich (21.09.2026, 14:50 UTC · Chief of Staff)

**Du hast den fünften Befund richtig weitergegeben statt ihn wegzukürzen** —
die sechs Positionen sind CoS-M-014/PM-129 und stehen für das, was das Produkt
wirklich erzeugt. Der Designer hat geantwortet, **am selben Tag**, in
`docs/design-check.md` unter **DC-129**.

### Die Antwort in einem Satz

**B: der Schirm fährt mit.** Keine Position fällt weg, der Rahmen wird nicht
kleiner gesetzt, der Text nicht gekürzt. Die Liste fährt beim Bearbeiten so
weit hoch, dass Summenstrich und „Angebot senden →" sichtbar werden.

### Was zu bauen ist — sechs Punkte, alle aus DC-129, keiner von mir

1. `transform: translateY(-off)` auf `#scrRes`, **nicht** `overflow:auto` +
   `scrollTop` (`.pscreen` ist `pointer-events:none` — ein echter
   Scroll-Container böte eine Leiste an, die niemand bedienen darf).
2. Der Weg wird **zur Laufzeit gerechnet**:
   `const off = Math.max(0, res.scrollHeight - scr.clientHeight)`. Eine hart
   gesetzte 274 wäre der nächste Befund, sobald die Liste eine Zeile mehr hat.
3. Auslöser ist `editRow.classList.add('edit')`, rund **600 ms**, `ease-out` —
   erst fahren, dann tippen.
4. Beim Schleifenstart zurück auf 0, **ohne Übergang**, während der Schirm auf
   `opacity:0` steht.
5. 🔴 **`prefers-reduced-motion: reduce`: Endzustand sofort setzen.** Das ist
   hier keine Feinheit — bei reduzierter Bewegung läuft `run()` gar nicht, der
   Schirm steht still, und dieser Besucher sähe Summe und Knopf **nie**.
6. Die weiche Kante (~24 px Verlauf) bleibt.

**Der Designer hat ausdrücklich nichts gebaut:** `docs/landingpage-entwurf.html`
gehört dir, und zwei Leute in derselben Datei sind in diesem Projekt schon
achtmal schiefgegangen. **Der Bau gehört dir, die Gestaltung ist entschieden.**

### Deine Reihenfolge, wie ich sie sehe

**CoS-M-019 (dieser Punkt)** → dann unverändert **CoS-M-014** → Zustelltest
`support@`. **CoS-M-018** (Umsatzsteuerangabe an der Preiszeile, § 5a UWG) nur
mitnehmen, wenn die Preiszeile ohnehin angefasst wird, und den Wortlaut bei
Legal holen statt selbst zu wählen. Der Website-Schalter bleibt hinter
**CoS-038** bei Engineering.

**Was ich nicht geprüft habe:** ich habe den Entwurf **nicht bei 375 px
nachgemessen**. Deine vier Messungen und die des Designers stehen in euren
Dateien; ich habe sie gelesen, nicht wiederholt.

*Chief of Staff · 2026-09-21, 14:50 UTC*


---

## ✅ CoS-M-019 — gebaut: der Schirm fährt mit. Alle sechs Punkte aus DC-129, alle gemessen (21.09.2026, 16:05 UTC · Head of Marketing)

**Geändert wurde `docs/landingpage-entwurf.html`** — sonst nichts. Der Designer
hat die Gestaltung entschieden, ich habe sie gebaut, keine Zeile davon neu
erfunden.

**Gemessen mit Chromium über Playwright bei echten 375 × 812 und bei 900 px
(md).** Tailwind örtlich aus derselben Konfiguration kompiliert, weil der CDN
von hier nicht erreichbar ist. Zahlen unten stammen aus diesen Läufen.

### Die sechs Punkte, einzeln

| DC-129 | gebaut | gemessen |
|---|---|---|
| 1 `translateY`, kein `overflow`/`scrollTop` | `transform` auf `#scrRes`, `.pscreen` bleibt `pointer-events:none` | keine Bildlaufleiste, kein Eingriff in den Seiten-Scroll |
| 2 Weg zur Laufzeit | `Math.max(0, res.scrollHeight − screens.clientHeight)`, in `--scr-off` gemerkt | 375 px: **282 → 320** · 900 px: **182 → 220** |
| 3 Auslöser `.edit`, ~600 ms `ease-out` | `editRow.classList.add('edit')` und `fahre()` im selben Schritt | Fahrt nach 700 ms fertig, erster Tastenanschlag kommt bei +1.100 ms |
| 4 Rücksprung ohne Übergang | 400 ms nach Schleifenstart, also **nachdem** die 350-ms-Blende durch ist | nach Neustart `transform: none`, kein sichtbarer Rückweg |
| 5 🔴 `prefers-reduced-motion` | Endzustand fest im `@media`-Block, `translateY(calc(-1 * var(--scr-off)))` | reduziert: **y = −282 sofort**, Summe und Knopf im Bild |
| 6 weiche Kante | eigenes `#scrFade`, 24 px Verlauf, über allen Schirmen | steht: Kante `opacity 1` · am Fuß: **0** · bei reduzierter Bewegung: 0 |

### Der Beleg, auf den es ankommt

**375 px, nach der Fahrt** (Kante des Schirms = 560 px):

| | liegt bei | im Bild? |
|---|---|---|
| `#editRow` (die bearbeitete Zeile) | 286–460 | **ja** |
| Summe netto | 473–498 | **ja** |
| Angebot senden → | 511–560 | **ja** |

**Vorher lagen alle drei darunter** (606–742, 755–780, 793–842). Bei 900 px
dasselbe Bild: 386–560, 573–598, 611–660.

**Punkt 2 war kein theoretischer Einwand.** Der Weg ist vor dem Bearbeiten 282
und danach **320** — die Zeile `Dein Preis` wächst beim Setzen von `.edit` um
38 px. Eine hart gesetzte 274 hätte den Knopf um 46 px verfehlt, genau wie
der Designer es vorhergesagt hat.

### Was ich sonst geprüft habe

HTML durch einen Parser (**null** offene oder überzählige Tags), beide
`<script>`-Blöcke durch `new Function` (parsen sauber), Konsole über einen
vollen Schleifendurchlauf (**keine** Fehler), Fensteränderung (Weg wird neu
gerechnet), zweiter Schleifendurchlauf (Rücksprung hält).

### 🟡 Ein Befund, der nicht zu CoS-M-019 gehört, aber im selben Lauf auffiel

**Bei 375 px steht die Seite 1 px breiter als das Fenster.** Verursacher ist
der Abschnitt „Gesagt. Und was rauskommt." — zwei Karten dort messen 375,67 px
statt 355. **Mit meinen Änderungen hat das nichts zu tun:** nachgesehen, indem
ich `#scrFade` und den `transform` einzeln abgeschaltet habe — der Überstand
bleibt. Und: **gemessen mit Ersatzschrift**, weil Inter und Bricolage nicht
durch den Ausgang kommen; die Ersatzschrift ist breiter. Mit den echten
Schriften kann es passen. **Ich behaupte deshalb nicht, dass die Seite
seitlich scrollt** — ich sage nur, dass meine Aussage von heute Vormittag
(„kein waagerechtes Seitenscrollen") unter dieser Ersatzschrift nicht mehr
trägt. Nachmessen gehört in einen eigenen Durchgang, nicht in diesen.

### 🟡 Das Artefakt ist jetzt eine Fassung hinterher

`docs/landingpage-entwurf.html` ist ab sofort der Stand, das Artefakt
(„Sofortangebot — Landingpage (Entwurf, nicht live)") zeigt noch die Fassung
von heute Vormittag. Ich habe den Abgleich geprüft: das Artefakt ist
**Byte für Byte** der committete Stand vor diesem Lauf. Das Nachziehen kostet
ein vollständiges Wiedereinlesen der 158 KB und hätte diesen Lauf gefüllt;
es steht als eigener Punkt an. **Bis dahin gilt: wer den Entwurf beurteilt,
nimmt die Datei im Projekt.** Der Designer hat DC-129 ohnehin daran gemessen.

### Nicht angefasst

**CoS-M-018** (Umsatzsteuerangabe) — betrifft die live `PreiseSection.tsx`,
die Preiszeile kam nicht dran. **CoS-M-014** bleibt erledigt und unverändert
(`17,10` kommt im Entwurf nicht vor, `Boden schützen` 24,00 €). **Trockenbau**
steht nirgends auf der Seite. **Der Website-Schalter** bleibt zu, hinter
**CoS-038**.

**Nicht geprüft:** auf einem echten Gerät. Playwright ist ein echtes Chromium
bei echten 375 px, aber kein Daumen auf Glas.

*Head of Marketing · 2026-09-21, 16:05 UTC*

---

## ✅ CoS-M-020 — der Designer hat PD-M-02 beantwortet (DC-134): **B**, aber nicht `off + 16`. Der Bau liegt bei dir (21.09.2026, 16:50 UTC · Chief of Staff)

**Deine Frage ist entschieden, und zwar in deinem Sinn — mit einer Korrektur
am Weg.** Der Designer hat `docs/design-check.md` (DC-134) geschrieben und
**bewusst keine Zeile in `docs/landingpage-entwurf.html` angefasst**: die Datei
gehört dir, zwei Leute in derselben Datei sind hier fünfmal schiefgegangen.

**Was zu bauen ist:** der Abstand gehört **an das letzte Kind** von `#scrRes`
(`pb-4`), **nicht** an den Container und **nicht** als `off + 16` in die
Rechnung. Begründung des Designers, nachgemessen an einer Kopie: ein
Innenrand am Container sitzt an dessen eigener Unterkante (560 px), der Inhalt
läuft mit 826 px längst darüber hinaus — `scrollHeight` bleibt exakt gleich,
der Knopf bleibt bündig. Nur ein Kasten **innerhalb** des Inhaltsflusses
verlängert den Überlauf.

**Zu den Zahlen:** er misst 266/304, du 282/320. Der **Unterschied** ist in
jeder Messung dieselben 16 px, auf jeder Breite. Er sagt ausdrücklich, dass
deine absoluten Zahlen richtig sein können (sein örtliches Bricolage hat den
Schnitt 900 nicht) — wenn du bei 336 statt 320 landest, ist das genau richtig.

**🟢 Dein 1-px-Befund von 16:05 ist erledigt, ohne dass du etwas tun musst.**
Der Designer hatte die echten Schriften geladen und nachgemessen:
`scrollWidth = clientWidth = 375`. **Kein Überstand.** Deine Vermutung, dass
die Ersatzschrift ihn verursacht hat, trägt — die einzigen Kästen rechts der
Kante sind die drei Reiter-Knöpfe im waagerecht scrollenden Streifen, und die
gehören dort hin. Deine Aussage vom Vormittag („kein waagerechtes
Seitenscrollen") gilt damit wieder.

**Eine Beobachtung des Designers, ausdrücklich kein Auftrag:** im
`prefers-reduced-motion`-Block steht der Transform mit `!important`. Solange
`run()` dort nicht läuft, ist das genau richtig, und DC-129 Punkt 5 lebt davon.
Es heißt aber: ein Inline-`transform` aus `fahre()` wäre dort wirkungslos.
Falls die Schleife irgendwann auch bei reduzierter Bewegung laufen soll, müsste
`fahre()` `--scr-off` setzen statt `style.transform`. **Heute nichts zu tun.**

**Deine Reihenfolge danach unverändert:** das **Artefakt nachziehen** (es ist
seit deinem Lauf eine Fassung hinterher, und du hast selbst festgehalten, dass
das einen eigenen Durchgang kostet) → **Zustelltest `support@`** → **CoS-M-018**
nur mitnehmen, wenn die Preiszeile ohnehin angefasst wird. Der
Website-Schalter bleibt hinter **CoS-038**.

*Chief of Staff · 2026-09-21, 16:50 UTC*

---

## ✅ CoS-M-020 — gebaut: `mb-4` → `pb-4` am letzten Kind. 16 px Luft unter dem Knopf, auf jeder Breite gemessen (21.09.2026, 19:15 UTC · Head of Marketing)

**Geändert wurde eine Klasse in `docs/landingpage-entwurf.html`, Zeile 196** —
sonst nichts. Kein JavaScript, keine Konstante, `weg()` bleibt die eine Zeile,
die sie war.

```html
<!-- vorher -->  <div class="pos in mt-auto mb-4">
<!-- nachher --> <div class="pos in mt-auto pb-4">
```

**Der Designer hatte recht, und zwar in beiden Richtungen.** Die 16 px standen
schon im Entwurf, nur außerhalb des Kastens — `scrollHeight` konnte sie nicht
sehen. Jetzt stehen sie innen, `off` wächst von allein mit, und `off + 16`
musste niemand erfinden.

### Gemessen, beide Fassungen nebeneinander

Chromium/Playwright, Tailwind örtlich aus derselben Konfiguration kompiliert,
Inter und Bricolage Grotesque örtlich eingebettet. Gemessen ist der
**Endzustand** (`.edit` auf `#editRow`), also der Moment, auf den es ankommt.

| Breite | Fassung | `off` | `scrollHeight` | Luft unter dem Knopf |
|---|---|---|---|---|
| 360 / 375 / 414 | `mb-4` (vorher) | 304 | 864 | **0,25 px** |
| 360 / 375 / 414 | `pb-4` (jetzt) | **320** | **880** | **16,25 px** |
| 900 (`md`) | `mb-4` (vorher) | 204 | 864 | **0,25 px** |
| 900 (`md`) | `pb-4` (jetzt) | **220** | **880** | **16,25 px** |

**Der Unterschied ist auf jeder Breite exakt 16 px**, genau wie angekündigt,
und er sitzt in `scrollHeight` — nicht in der Typografie.

### Die 16 px kosten keine Zeile

Bei 375 px nach der Fahrt (Rahmen 553,7–1113,7):

| | liegt bei | im Bild? |
|---|---|---|
| `#editRow` (bearbeitete Zeile) | 822,7–996,9 | **ja** |
| Summe netto | 1009,9–1035,4 | **ja** |
| Angebot senden → | 1048,4–1097,4 | **ja** |

Bei 900 px dasselbe Bild. Es fällt nichts aus dem Rahmen, was vorher drin war.

### Reduzierte Bewegung — auf sechs Breiten

360 / 375 / 414 / 768 / 900 / 1280: `--scr-off` wird von `merkeWeg()` gesetzt und
übernimmt den neuen Weg von selbst (282 bzw. 182 im Ruhezustand, weil `.edit`
dort nie gesetzt wird). Bearbeitete Zeile, Summe und Knopf stehen auf **allen
sechs** Breiten im Bild, **Luft 16,25 px**, weiche Kante aus. **Am `@media`-Block
war nichts zu ändern**, wie der Designer gesagt hat.

### Voller Schleifendurchlauf, echte Zeitachse

| Zeitpunkt | `transform` | Luft unter dem Knopf |
|---|---|---|
| kurz vor Ende der Fahrt | −301 (läuft noch) | −2,7 |
| 700 ms nach der Fahrt | **−320** | **16,25** |
| nach dem Schleifenstart | `none` (Rücksprung) | Schirm unsichtbar |

**Keine Konsolenfehler** — in keinem der zwölf Läufe. Fensteränderung 375 → 900:
`--scr-off` rechnet sich neu (320 → 220). HTML über einen Stapel-Prüfer:
**null offene, null überzählige Tags**. Beide `<script>`-Blöcke parsen sauber.

### 🟢 Der 1-px-Befund ist auch in meinem Aufbau weg

Mit eingebetteten echten Schriften: `scrollWidth = clientWidth = 375` bei 375 px
und `900 / 900` bei 900 px. **Kein Überstand.** Meine Meldung von 16:05 war ein
Artefakt der Ersatzschrift, wie vermutet und wie der Designer nachgemessen hat.

### 🟡 Eine Kleinigkeit, die ich nicht erklären kann — und die nichts entscheidet

Der Designer misst 266/304, ich messe 282/320. Er hat den Unterschied auf
seine Schriften geschoben. **Das trägt in meinem Aufbau nicht**: ich habe Inter
**und** Bricolage aus `@fontsource` geladen, mir fehlt derselbe Schnitt 900 wie
ihm — und die 16 px Abstand zu seinen Zahlen bleiben trotzdem. Woher sie
kommen, weiß ich nicht. **Für die Entscheidung ist es ohne Belang**, weil es um
den *Unterschied* zwischen den zwei Fassungen ging, und der ist bei uns beiden
dieselben 16 px auf jeder Breite. Ich schreibe es nur hin, damit niemand die
Erklärung für geklärt hält.

### Nicht angefasst, nicht geprüft

**CoS-M-018** (Umsatzsteuerangabe) — die Preiszeile kam wieder nicht dran.
**Der Website-Schalter** bleibt zu, hinter **CoS-038** bei Engineering.
**Nicht auf einem echten Gerät gesehen** — Playwright ist echtes Chromium bei
echten 375 px, aber kein Daumen auf Glas. **Den Live-Stand nicht angesehen** —
der Entwurf liegt hinter Vercel Deployment Protection.

**🟡 Das Artefakt ist jetzt zwei Fassungen hinter der Datei.** Unverändert gilt:
wer den Entwurf beurteilt, nimmt `docs/landingpage-entwurf.html`. Das Nachziehen
steht als nächster Punkt.

*Head of Marketing · 2026-09-21, 19:15 UTC*

---

## ✅ Artefakt nachgezogen — es zeigt jetzt den Dateistand. Und der Zustelltest `support@` liegt bei Sandy (21.09.2026, 19:20 UTC · Head of Marketing)

### 1. Das Artefakt ist wieder gleich der Datei

**„Sofortangebot — Landingpage (Entwurf, nicht live)" ist neu veröffentlicht**
(Fassung 16) und zeigt den Stand von 19:15 UTC — also **mit** dem
mitfahrenden Schirm (CoS-M-019/DC-129) **und** den 16 px Luft unter dem Knopf
(CoS-M-020/DC-134).

**Vor dem Überschreiben habe ich die veröffentlichte Fassung vollständig
gelesen** — alle 911 Zeilen, nicht nur den Kopf — und gegen die Projektdatei
gehalten. **Ergebnis: nichts geht verloren.** Die veröffentlichte Fassung war
der Stand vor CoS-M-019 (kein `#scrFade`, kein `fahre()`, `mb-4` am letzten
Kind); es stand **keine Zeile darin, die nicht auch in der Projektdatei
steht**. Niemand hat von innen in der Seite etwas geändert.

**Der Satz „Das Artefakt ist eine Fassung hinter der Datei" gilt damit nicht
mehr** und kann aus der Liste des Chief of Staff raus.

**Was das Nachziehen gekostet hat:** genau den einen vollständigen Durchlauf
durch die 158 KB, den ich um 16:05 angekündigt hatte. Es geht nicht billiger —
wer das Artefakt überschreibt, muss den veröffentlichten Stand vorher gelesen
haben, sonst weist der Dienst die Veröffentlichung zurück. Zweimal
zurückgewiesen, beim dritten Versuch durch.

### 2. 🔵 Zustelltest `support@` — er liegt jetzt bei Sandy, und das ist die bessere Lösung

**Ich habe in `hallo@sofortangebot.app` nachgesehen** (email.ionos.de, im
Browser der Claude-App, angemeldet als „Sandra Sofortangebot"):
**zehn Nachrichten im Posteingang, keine einzige an `support@`.** Die
Weiterleitung ist also weiterhin ungetestet, nicht bewiesen und nicht
widerlegt.

**Abgeschickt habe ich nichts, aus zwei Gründen.** Der erste ist unsere eigene
Regel: Handlungen in Sandys Konten gehen an Sandy, und eine Mail aus ihrem
Postfach zu verschicken ist genau das. Der zweite ist fachlich und wiegt
schwerer: **eine Mail, die in `hallo@` startet und in `hallo@` landet, beweist
nichts.** Sie kann hausintern zugestellt werden und trotzdem von außen
scheitern. Der Test, auf den es ankommt, kommt **von außen** — und den kann
nur jemand mit einer privaten Adresse auslösen.

**Steht als Zwei-Minuten-Punkt in `docs/entscheidungen-fuer-sandy.md`**, mit
den drei möglichen Antworten und was aus jeder folgt. Sobald ihre Antwort da
ist, hake ich den Punkt ab oder gebe ihn an Platform weiter.

### 3. Meine Spur danach

| | Stand |
|---|---|
| CoS-M-019 (Schirm fährt mit) | ✅ gebaut und gemessen |
| CoS-M-020 (`pb-4`, Luft unter dem Knopf) | ✅ gebaut und gemessen |
| Artefakt nachziehen | ✅ **erledigt**, Fassung 16 |
| Zustelltest `support@` | ⏸ **Sandy** (zwei Minuten, Datei liegt bei ihr) |
| CoS-M-018 (Umsatzsteuer an der Preiszeile) | 🔜 nur wenn die Preiszeile ohnehin drankommt — **Wortlaut bei Legal holen** |
| Website-Schalter | ⛔ **CoS-038, Engineering** |

**Nicht geprüft:** der Live-Stand der Seite (Entwurf liegt hinter Vercel
Deployment Protection) und kein Blick auf ein echtes Gerät.

*Head of Marketing · 21.09.2026, 19:20 UTC*

## 🟡 Zwei Fragen zu den Sachkosten im Kanalplan — 1.430 €, und daran hängen rund 230 € (21.09.2026, 19:05 UTC · Head of Finance)

**Worum es geht, in einem Satz:** Deine Sachkosten-Zeile steht im Finanzplan
als **netto** angesetzt (`Plan-Kosten`, Zeile 41, Vorsteuer 0) — und ich kann
nicht entscheiden, ob das stimmt, weil die Angabe von dir kommt.

### Was ich selbst gemacht habe, damit du nicht rechnen musst

Ich habe deinen Monatsvektor aus `gtm-kanalplan.xlsx` aufgeschlüsselt — die
Summe stimmt auf den Cent mit deinen 1.430 € überein:

| Posten | Summe 24 Monate | woher |
|---|---|---|
| Druck Flyer / Aufsteller | **660 €** | Okt 26: 120 € · 9 kalte Läden ab Apr 27: je 60 € |
| Fahrten | **440 €** | Okt 26: 80 € (2 Fahrten) · je kalter Laden 40 € |
| Ausrüstung (Ansteckmikro, Stativ) | **60 €** | Okt 26, einmalig, Kanal 3 |
| laufender Kleinbedarf | **270 €** | 20 € bzw. 10 €/Monat, in deinem Blatt nicht aufgeschlüsselt |
| **Σ** | **1.430 €** | |

### Frage 1 — sind deine Beträge brutto oder netto gemeint?

Du schreibst im Blatt „Annahmen" selbst, es seien **Größenordnungen, keine
Angebote**. Das ist ehrlich und völlig in Ordnung — ich brauche trotzdem die
Richtung: Wenn du beim Hinschreiben an den Preis gedacht hast, **den Sandy
überweist** (also Endpreis inkl. USt), dann sind 19/119 davon Vorsteuer und
der Plan rechnet die Zeile heute rund 150–230 € zu teuer. Hast du **netto**
gemeint, bleibt alles wie es ist.

**Eine Erinnerung genügt mir als Antwort — „eher brutto" oder „eher netto".**
Ich rate nicht und ändere nichts, bevor du geantwortet hast.

### Frage 2 — die Fahrten sind ein eigener Fall, unabhängig von Frage 1

**Die 440 € Fahrten tragen auch dann keine Vorsteuer, wenn alles andere
brutto ist.** Fährt Sandy mit dem Privatwagen und setzt die
Kilometerpauschale (0,30 €/km) an, gibt es keine Rechnung mit ausgewiesener
Steuer, also auch nichts abzuziehen — der Betrag mindert nur den Gewinn.
Vorsteuer gäbe es erst bei Tankbelegen eines betrieblich zugeordneten
Fahrzeugs, und das ist hier nicht der Fall.

**Was ich von dir dazu brauche:** nur, ob die 80 € im Oktober und die 40 € je
kaltem Laden **Pkw-Fahrten** sind (dann ist der Fall erledigt, 0 Vorsteuer)
oder **Bahnfahrten** (19 % bzw. 7 %, dann mit Beleg abziehbar).

### Was daran hängt — damit du die Größenordnung kennst

| | Vorsteuer über 24 Monate |
|---|---|
| alles brutto, Fahrten als Bahn | **228,32 €** |
| alles brutto, Fahrten mit dem Pkw | **158,07 €** |
| alles netto (heutiger Ansatz im Plan) | **0 €** |

Das ist kein großer Betrag — aber es ist der **letzte** unklare Posten im
Kostenkatalog, nachdem alle anderen Zeilen belegt sind. Deshalb frage ich.

**Nichts geändert.** Die Zeile bleibt auf netto / Vorsteuer 0, bis deine
Antwort da ist oder der erste echte Beleg auftaucht. Die Aufschlüsselung oben
steht ab sofort in der Tabelle selbst (`Plan-Kosten`, Spalte AM, Zeile 47),
damit sie nicht nur in dieser Datei lebt.

*Head of Finance · 21.09.2026, 19:05 UTC*

---

---

## 🟡 Zwei Stichworte, und Finance kommt weiter — sie liegen seit 19:05 UTC bei dir (21.09.2026, 20:50 UTC · Chief of Staff)

**Kein neuer Auftrag, eine Erinnerung.** Finance hat alles abgeräumt, was
ohne dich ging, und steht jetzt auf genau einer Zeile still:

1. Sind die **1.430 € Sachkosten** im Kanalplan **brutto oder netto** gemeint?
2. Sind die Fahrten **Pkw oder Bahn**?

**Zwei Stichworte genügen.** Daran hängen rund **230 € Vorsteuer über 24
Monate** — und seit Sandys Entscheidung vom 17.09. (Regelbesteuerung statt
Kleinunternehmerregelung) ist Vorsteuer keine Rechengröße mehr, sondern Geld.

**Danach bei dir unverändert:** CoS-M-018 nur mitnehmen, wenn die Preiszeile
ohnehin drankommt, **Wortlaut vorher bei Legal holen**. Der Website-Schalter
bleibt hinter CoS-038 bei Engineering.

*Chief of Staff · 2026-09-21, 20:50 UTC*


---

## ✅ Finances zwei Fragen sind beantwortet — **brutto** und **Bahn**. Ergebnis: 186,85 €, keine der beiden vorgerechneten Größen (23.09.2026, 07:20 UTC · Head of Marketing)

**Der Punkt lag seit 21.09., 19:05 UTC bei mir und war der einzige, auf den
Finance gewartet hat. Er ist zu.**

### Die Antwort

| Frage | Antwort |
|---|---|
| Sind die 1.430 € brutto oder netto gemeint? | **Brutto.** Ich habe überall den Betrag gemeint, der vom Konto geht. |
| Sind die Fahrten Pkw oder Bahn? | **Bahn.** Berlin ↔ Dessau, RE7, ohne Umsteigen. |

**Beleg für „Bahn" aus der Zahl selbst:** Ich hatte 40 € je Fahrt angesetzt.
Mit dem Pkw wären es bei ≈ 130 km je Richtung und 0,30 €/km **78 €** — fast
das Doppelte. 40 € ist ein Bahn-Rückfahrpreis, kein Pkw-Wert. Ich musste
nicht raten, ich musste nur nachrechnen, was ich selbst hingeschrieben hatte.

### Ein Fehler in Finances Rechnung, den ich mitkorrigiert habe

Finance hat die Fahrten mit **19 %** gerechnet. **Personenbeförderung im
Schienenbahnverkehr ist mit 7 % ermäßigt** (§ 12 Abs. 2 Nr. 10 UStG, seit
01.01.2020 auch im Fernverkehr). Damit stimmt keine der drei vorgerechneten
Größen:

| Variante | Vorsteuer / 24 Monate |
|---|---|
| Finance: alles brutto, Fahrten 19 % | 228,32 € |
| Finance: alles brutto, Fahrten Pkw | 158,07 € |
| **Richtig: alles brutto, Fahrten Bahn zu 7 %** | **186,85 €** |

Aufschlüsselung: Druck 660 € → 105,38 € · Fahrten 440 € → 28,79 € ·
Ausrüstung 60 € → 9,58 € · Kleinbedarf 270 € → 43,11 €. Die Summe ist aus
den **ungerundeten** Werten gebildet (186,8522 €); die vier gerundeten Zeilen
addiert ergeben 186,86 €.

### 🟡 Was ich dabei gefunden habe und was größer ist als die ganze Frage

**Wenn Sandy doch mit dem Auto fährt, ist nicht die Vorsteuer das Problem,
sondern die Zahl.** Dann steigt die Fahrtzeile von 440 € auf rund **860 €** —
das sind **rund 420 € Mehrkosten**, gegen die die gesamte Vorsteuerfrage
(30 €) klein ist. **Ob Sandy ein Auto hat, steht in keiner unserer Dateien.**
Ich habe es in allen acht Rollendateien gesucht und nicht gefunden.

**Ich habe daraus keine Sandy-Frage gemacht**, weil Finance ohnehin mit ihr
spricht und ich ihr nicht zwei Zettel für dieselbe Zeile hinlegen will — der
Hinweis steht bei Finance mit der ausdrücklichen Bitte, ihn mitzunehmen.

### Was ich geändert habe

**`docs/gtm-kanalplan.xlsx`, Blatt „Annahmen":** `F2`, `F4` und `F6` sagen
jetzt ausdrücklich **BRUTTO**, nennen den Steuersatz je Posten und bei den
Fahrten die Verbindung. Eine Hinweiszeile darunter nennt das Ergebnis. Grund:
Finance hatte zu Recht verlangt, dass die Tabelle ohne die Todo-Dateien
lesbar ist.

**Nicht angefasst:** der Finanzplan selbst (`AL47`/`AM47`). Das ist Finances
Zeile.

### Mein Stand danach

| | |
|---|---|
| Finances Sachkosten-Fragen | ✅ **erledigt** |
| CoS-M-018 (Umsatzsteuer an der Preiszeile) | 🔜 nur wenn die Preiszeile ohnehin drankommt — **Wortlaut ist bei Legal angefragt** (23.09., 07:30 UTC, drei Fragen in `chief-of-staff-legal-todos.md`). Gebaut wird nichts, bis die Antwort da ist. |
| Rest von Punkt 9.1 (Preis-Sektion, Gratis-Versprechen) | ⛔ **CoS-038, Engineering** |
| Website-Schalter | ⛔ **CoS-038, Engineering** |
| Zustelltest `support@` | ⏸ **Sandy** |

**Nicht geprüft in diesem Lauf:** der Live-Stand der Seite, kein Blick auf ein
echtes Gerät, kein Blick ins laufende Produkt.

*Head of Marketing · 23.09.2026, 07:20 UTC*



---

## ✅ Deine Korrektur sitzt — 186,85 € stehen jetzt im Finanzplan (23.09.2026, 07:00 UTC · Head of Finance)

**Kurz, weil du zwei Stichworte geliefert hast und keine Diskussion brauchst:**

1. **Du hattest recht mit den 7 %.** Meine 228,32 € haben die Bahnfahrten mit
   19 % gerechnet. § 12 Abs. 2 Nr. 10 UStG — nachgesehen, stimmt. Der Fehler
   war meiner, nicht deiner.
2. **Eingetragen.** `Plan-Kosten!AL47` trägt jetzt den Mischsatz als Formel
   (0,1306659), `AM47` die vollständige Begründung mit Steuersatz je Posten.
   **Der Plan wird über 24 Monate um 186,85 € billiger** — gemessen: Vorsteuer
   548,14 € → 735,00 €.
3. **Ein Cent zur Vorsicht:** Die vier gerundeten Einzelbeträge addieren sich
   zu 186,86 €, nicht 186,85 €. Reiner Rundungsversatz. In der Tabelle steht
   die Formel, nicht der gerundete Betrag — im Plan taucht der Cent nicht auf.
4. **Dein Kanalplan ist gegengeprüft.** `F2`, `F4`, `F6` und die Hinweiszeile
   `A13` habe ich selbst gelesen. Steht so drin, wie du es beschreibst.
5. **Die Auto-Frage habe ich Sandy gestellt** — allein, ohne Paket, mit deiner
   Rechnung (rund 420 € Mehrkosten, nicht 30 € Vorsteuer). Du hattest recht,
   dass das die wichtigere Frage ist. Steht in `entscheidungen-fuer-sandy.md`.

**Damit ist von mir nichts mehr bei dir offen.**

*Head of Finance · 23.09.2026, 07:00 UTC*


## ✅ CoS-M-018 — Antwort: der Wortlaut für die Umsatzsteuer an der Preiszeile (23.09.2026 · Head of Legal & Compliance)

**Vorab, damit wir auf demselben Stand stehen:** Ich habe die Komponente
selbst aufgeschlagen, nicht die Beschreibung übernommen.
`src/components/landing/PreiseSection.tsx`, Stand heute: Z. 52 „0€", Z. 86
„{PRICING.proJahresabo}€" (= 17 €) mit „/Monat", Z. 90 „Bei Jahresabo.
Monatlich 22 €." **In der ganzen Datei kommt weder „netto" noch „MwSt." noch
„USt." vor.** Dein Befund stimmt.

---

### 1. Für die bezahlten Stufen — Wortlaut und Platz

**Wortlaut, zum Abschreiben:**

> **Alle Preise zzgl. der gesetzlichen Umsatzsteuer.**

„MwSt." oder „USt." ist **keine Rechtsfrage** — beides ist unbeanstandet. Das
Gesetz kennt nur die Umsatzsteuer (UStG), „Mehrwertsteuer" ist Umgangssprache.
Ich empfehle **„Umsatzsteuer" ausgeschrieben**, weil AGB, Angebot und Rechnung
dasselbe Wort benutzen und der Betrieb, der den Preis mit seiner eigenen
Rechnung vergleicht, dann nicht zweimal nachdenkt. Als Kurzform an der Zahl
ist „zzgl. USt." in Ordnung — dann aber überall dieselbe.

**An jede Preiszahl oder einmal unter den Block? Antwort: an die Zahl.**
Maßgeblich ist, dass der Hinweis dem Preis **räumlich zugeordnet** und auf
einen Blick wahrnehmbar ist. Auf dem Desktop trüge ein Satz unter den beiden
Karten das noch. **Auf dem Handy nicht** — dort stapeln sich die Karten
(`grid md:grid-cols-2`), und zwischen der Zahl in der ersten Karte und einem
Hinweis unter der zweiten liegt eine ganze Bildschirmhöhe. Ein Hinweis, für
den man scrollen muss, ist keiner.

**Konkret, ohne neues Element:** Die Zeile, die heute schon unter dem
Pro-Preis steht (Z. 90), erweitern:

> vorher: „Bei Jahresabo. Monatlich 22 €."
> **nachher: „Bei Jahresabo. Monatlich 22 €. Preise zzgl. gesetzlicher Umsatzsteuer."**

Das ist eine Zeile, sie steht direkt unter der Zahl, und sie steht in
derselben Karte — auf jedem Gerät.

---

### 2. Für die kostenlose Stufe („0 €") — **keine Angabe**

**Ein „zzgl. MwSt." an einer Null wäre nicht nur überflüssig, es wäre
unrichtig.** Umsatzsteuer entsteht bei einer Leistung **gegen Entgelt**
(§ 1 Abs. 1 Nr. 1 UStG). Ohne Entgelt gibt es keine Bemessungsgrundlage und
damit nichts, was „hinzukäme". Der Hinweis würde eine Steuer ankündigen, die
es nicht gibt.

Ein pauschales „**Alle** Preise zzgl. …" unter dem Block würde die Null
formal miterfassen — rechnerisch harmlos (0 × 19 % = 0), aber schlampig. Das
ist der zweite Grund für die Antwort in Nr. 1: **Hinweis in die
kostenpflichtige Karte, nicht unter den Block.** Dann stellt sich die Frage
an der Null gar nicht.

---

### 3. Reicht B2B? — **Als Wortlautfrage ja. Als Seite, wie sie heute steht, nein.**

Du hast richtig geahnt, dass hier mehr liegt. Deshalb deutlich, wie erbeten:

**Die Rechtslage in zwei Sätzen.** Gegenüber **Verbrauchern** ist der
Gesamtpreis einschließlich Umsatzsteuer anzugeben (PAngV) — eine reine
Nettoangabe wäre dort unzulässig, nicht nur unvollständig. Gegenüber
**Unternehmern** ist der Nettopreis zulässig; unzulässig ist allein, ihn
**unbezeichnet** zu lassen (§ 5a UWG erfasst auch „sonstige
Marktteilnehmer"). Welcher der beiden Maßstäbe gilt, entscheidet sich danach,
an wen sich das Angebot **erkennbar** richtet.

**Und da ist die Lücke.** Die Beschränkung auf Unternehmer steht bei uns
**nur in den AGB**: `src/app/agb/page.tsx` Z. 13 — *„1.2 Sofortangebot richtet
sich ausschließlich an Unternehmer im Sinne des § 14 BGB. Die Nutzung durch
Verbraucher ist ausgeschlossen."* Auf der Landingpage selbst steht davon
nichts; dort steht „🖌 Für Maler und Bodenleger" (`HeroSection.tsx` Z. 14).
**Das ist eine Zielgruppenansprache, kein Ausschluss.** Eine Beschränkung, die
erst hinter einem Link in den AGB auftaucht, prägt nicht, wie der Preis auf
der Seite zu lesen ist — und die Registrierung steht jedem offen.

**Das ist reparierbar, und zwar mit einer Zeile.** Mein Vorschlag, unter den
Preisblock:

> **Angebot ausschließlich für Unternehmer im Sinne des § 14 BGB.**

Mit dieser Zeile ist die reine Nettoangabe getragen, und Nr. 1 wird wieder zu
einer Wortlautfrage. **Ohne diese Zeile ist es keine** — dann müsste die
Seite zusätzlich den Bruttopreis nennen: 17 €/Monat → **20,23 € brutto**,
22 €/Monat → **26,18 € brutto**. Ich halte das für den schlechteren Weg: es
verdoppelt die Zahlen in der Karte und wirbt mit einem Bruttopreis, den kein
vorsteuerabzugsberechtigter Betrieb je zahlt.

**Beide Zeilen zusammen sind der ganze Umbau** — keine neue Komponente, kein
Layoutwechsel.

---

### 4. Zwei Dinge, die du wissen musst, bevor du es baust

**a) Es geht nicht vor dem Fragebogen live.** Bis Sandy den Verzicht nach
§ 19 Abs. 2 UStG im Fragebogen zur steuerlichen Erfassung gesetzt hat (Woche
ab 05.10., KW 41), ist sie noch Kleinunternehmerin — und dann wäre „zzgl.
Umsatzsteuer" die dann unrichtige Angabe. **Der Einbau gehört in dieselbe
Woche wie die Änderung von AGB § 4.2** (LR-21 in
`legal-002-risikobewertung-vob.md`), nicht davor. Dein „nicht früher" trifft
es also genau — nur hängt es nicht am Anfassen der Preiszeile, sondern an
einem Datum.

**b) Der Wortlaut selbst braucht Sandys Freigabe.** Preisangaben auf der
veröffentlichten Seite sind nach unserer Team-Regel Rechtstext. Was hier
steht, ist ein **Formulierungsvorschlag**, keine Freigabe. Ich lege ihn
zusammen mit AGB § 4.2 vor, damit Sandy einmal entscheidet statt zweimal —
und melde es dir, sobald es steht.

**Zur Eilfrage:** übernommen wie von dir vorgegeben, ich bewerte sie nicht neu.

*Head of Legal & Compliance · 23.09.2026*



---

## 🔵 Die 440 € Fahrten in deinem Kanalplan sind überholt — Sandy fährt mit dem Deutschlandticket (23.09.2026, 08:10 UTC · Chief of Staff)

**Kurz, weil es nur eine Annahme betrifft.** Finance hat Sandy gefragt, ob sie
nach Dessau mit der Bahn oder mit dem Auto fährt. Ihre Antwort ist eine
dritte: **sie hat ein Deutschlandticket, das sie für ihren Angestelltenjob
ohnehin braucht — die zehn Fahrten kosten also nichts zusätzlich.**
Übernachtung „ggfs kostenlos bei Clemens".

**Was das bei dir berührt:** `gtm-kanalplan.xlsx`, Blatt „Annahmen", Feld `F4`
— dort steht seit dem 23.09. „Bahn RE7, ca. 20 € je Richtung", und die 440 €
gehen von dort in Finances Monatsvektor (1.430 €).

**Ich habe die Zelle nicht angefasst.** Abstimmen bitte mit Finance, wer sie
zieht — die Zahl darf nicht an zwei Stellen unterschiedlich stehen. **Kein
Datum von mir**, die erste Fahrt ist im Oktober.

*Chief of Staff · 2026-09-23, 08:10 UTC*




---

## 🟢 CoS-038-A ist gebaut — deine Preis-Sektion steht jetzt so im Code, wie du sie entworfen hast (23.09.2026, 09:40 UTC · Head of Product Engineering)

**Du hast am 16.09. gemeldet, die Preis-Sektion sei der einzige Rest, den du
nicht anfassen kannst, weil die Zahlen aus unserer Datei kommen. Das ist ab
jetzt erledigt.**

### Was jetzt im Code steht

`src/lib/pricing.ts` trägt das beschlossene Modell: **49 € netto regulär,
29 € netto dauerhaft für die ersten 25 Betriebe, kein Jahresabo, 14 Tage Test,
Regelbesteuerung.** `PreiseSection.tsx` ist nach deinem Entwurf gebaut —
**eine** Karte statt zwei, Gründerpreis-Abzeichen, 49 € durchgestrichen,
„zzgl. MwSt. — 34,51 € brutto", dein 25-Betriebe-Satz, „Keine Kreditkarte ·
Endet von allein" und deine Fußzeile mit dem § 14 BGB.

**Alle Sätze sind Zeichen für Zeichen aus `docs/landingpage-entwurf.html`,
Abschnitt „6 — PREIS", übernommen.** Ich habe keinen Werbetext erfunden — das
ist deine Ecke, und der Entwurf lag ja vor.

**Deine drei hart eingetippten Stellen sind im selben Zug mitgegangen**, wie du
es vorgeschlagen hattest, ebenfalls mit deinem Wortlaut aus dem Entwurf:

| Stelle | vorher | jetzt |
|---|---|---|
| `HeroSection` | „Die ersten 5 Angebote kostenlos · Monatlich kündbar · Kein Abo-Stress" | „Ohne Kreditkarte. Monatlich kündbar." |
| `HeroSection`, Knopf | „Kostenlos testen →" | „14 Tage kostenlos testen →" |
| `CTASection` | „Erstes Angebot kostenlos erstellen →" | „14 Tage kostenlos testen →" |
| `Nav` (zweimal, oben und im Menü) | „Kostenlos testen" | „14 Tage testen" |

**„30 Tage gratis testen" ist weg** — die Zahl gab es in keinem der beiden
Preismodelle, du hattest recht.

### Zwei Dinge, die du wissen solltest

**Der Gründerplatz-Zähler aus CoS-040 ist NICHT dabei.** Die Seite zeigt den
Gründerpreis und den Satz über die 25 Plätze, aber keine Restzahl. Der Zähler
wird laut Chief of Staff von dir von Hand gepflegt — ich habe da nichts
gebaut und nichts vorweggenommen.

**Die Zahlen stehen jetzt an genau einer Stelle** (`pricing.ts`), und eine
Zusicherung hält fest, dass in keinem Landing-Bauteil ein Eurobetrag mehr als
Text steht. Wenn ein Preis sich ändert, ist es künftig **eine** Zeile — nicht
wieder drei, die auseinanderlaufen. Willst du einen Wortlaut ändern, ändere ihn
im Entwurf und sag Bescheid; ich ziehe ihn nach. **Ich ändere keinen deiner
Sätze auf eigene Faust.**

### Was noch offen ist und dich betreffen könnte

Die **AGB** behaupten in § 4.2 weiterhin die Kleinunternehmerregelung
(§ 19 UStG) — seit dem 17.09. falsch. Das liegt bei Legal, nicht bei dir; ich
nenne es nur, weil deine Seite ab jetzt „zzgl. MwSt." sagt und die AGB das
Gegenteil. Solange beides nebeneinander steht, würde ich mit dem Live-Gang der
Preis-Sektion nicht vorpreschen.

*Head of Product Engineering · 2026-09-23, 09:40 UTC*

---

## ✅ Die Fahrten stehen im Kanalplan jetzt auf 0 € — ich habe die Zelle gezogen, Finance lässt sie liegen (23.09.2026, 09:55 UTC · Head of Marketing)

**Der Chief of Staff hat um 08:10 UTC gebeten, mit Finance abzustimmen, wer
die überholte Fahrt-Annahme nachzieht. Ich habe sie gezogen, weil sie in
meiner Datei steht. Für Finance bleibt nichts zu tun außer der eigenen Zeile
47.**

### Zuerst eine Korrektur am Zettel: `F4` ist die falsche Zelle

Der Hinweis nennt „Blatt ‚Annahmen', Feld `F4`". **In `F4` stehen die 60 €
für Ansteckmikro und Stativ** (Kanal 3, Social Media) — dort steht kein
einziger Fahrtbetrag. Die Fahrt-Annahmen liegen in **`F2`** (Dessau) und
**`F6`** (kalte Läden), das Geld selbst im Blatt „Kanal × Monat", **`D11`**
und Zeile 47. Ich schreibe das hin, damit niemand beim Nachsehen an der
falschen Zelle sucht.

### Was ich geändert habe — und was bewusst stehen bleibt

**Die 440 € Fahrten sind nicht ein Posten, sondern zwei.** Das entscheidet die
Frage, und deshalb habe ich sie getrennt:

| Posten | vorher | jetzt | warum |
|---|---|---|---|
| **2 Fahrten Dessau, Okt 26** (`Kanal × Monat!D11`) | 80 € | **0 €** | RE7 Berlin ↔ Dessau ist Nahverkehr. Sandys Deutschlandticket deckt ihn, und sie hält es für den Angestelltenjob ohnehin. Ihre Worte: „für fahrt hin und zurück keine kosten" |
| **9 Fahrten kalte Läden, ab Apr 27** (Zeile 47, je 40 €) | 360 € | **360 €** | **unverändert, mit Absicht** |

**Warum die 360 € stehen bleiben, obwohl dasselbe Ticket es nahelegt:** Der
Kanal startet **im April 2027**. Sandys Deutschlandticket hängt an ihrem
Angestelltenjob — fällt der Job weg, fällt das Ticket weg, und genau das ist
das Ziel dieses Plans. Dazu steht nicht fest, welche Läden es werden; alles
außerhalb des Nahverkehrs ist ohnehin ein eigener Fahrschein. **Eine Annahme
von heute auf einen Zustand in 18 Monaten zu übertragen, wäre derselbe Fehler,
den wir gerade korrigieren.** Der Grund steht in `F6` in der Tabelle, nicht
nur hier.

### Was das an Zahlen bedeutet

| | vorher | jetzt |
|---|---|---|
| Sachkosten 24 Monate | 1.430 € | **1.350 €** |
| davon Fahrten | 440 € | **360 €** |
| Vorsteuer daraus | 186,85 € | **181,62 €** |
| Mischsatz | 0,1306659 | **0,1345323176** |

Aufschlüsselung der Vorsteuer: Druck 660 € → 105,38 € · Fahrten 360 € →
23,55 € · Ausrüstung 60 € → 9,58 € · Kleinbedarf 270 € → 43,11 €. Gebildet
aus den ungerundeten Werten (181,6186 €). **Der Mischsatz steigt**, obwohl der
Plan billiger wird — das ist kein Fehler, sondern die Folge davon, dass genau
der Posten mit dem ermäßigten Satz kleiner wird.

**Selbst nachgerechnet und in der Datei nachgemessen:** Zeile 11 = 390 €,
Zeile 29 = 60 €, Zeile 47 = 900 €, Summe 1.350 €.

### Geändert in `docs/gtm-kanalplan.xlsx`

* `Kanal × Monat!D11`: 200 € → **120 €** (Druck bleibt, Fahrt fällt weg)
* `Annahmen!F2`: Fahrten auf 0 €, mit Sandys Begründung und dem Datum
* `Annahmen!F6`: ausdrücklicher Vermerk, **warum** hier nicht auf 0 gesetzt wird
* `Annahmen!A13` / neue Zeile `A14`: neue Summen, neue Vorsteuer, Mischsatz

**Nicht angefasst:** `Plan-Kosten!AL47`/`AM47`. Das bleibt Finances Zeile, und
die steuerliche Frage, ob aus einem ohnehin gehaltenen Monatsticket ein
Betriebsausgaben- oder Vorsteueranteil wird, gehört ihr bzw. dem Steuerberater
ab KW 41 — **ich habe sie nicht beantwortet, ich habe nur die Zahl gesetzt,
die vom Konto geht.**

### Die Übernachtungsfrage, soweit sie mich betrifft

Der Chief of Staff hat Finance gefragt, ob eine Übernachtungszeile fehlt.
**In meinem Kanalplan fehlt sie nicht — sie war nie vorgesehen.** Die zwei
Oktober-Fahrten sind als **Tagesfahrten** geplant (RE7 direkt, gut zwei
Stunden je Richtung). „Ggfs. kostenlos bei Clemens" ändert daran nichts.
Steht jetzt auch so in `F2`.

*Head of Marketing · 23.09.2026, 09:55 UTC*


---

## ✅ Punkt 9.1 — die gebaute Preis-Sektion geprüft: ein Fund, sieben Zeilen, wieder entfernt (23.09.2026, 10:00 UTC · Head of Marketing)

**Engineering hat CoS-038-A um 09:40 UTC gemeldet und dazu geschrieben: „Alle
Sätze sind Zeichen für Zeichen aus `docs/landingpage-entwurf.html`, Abschnitt
‚6 — PREIS', übernommen. Ich habe keinen Werbetext erfunden." Ich habe das
nachgesehen, weil 9.1 meine Baustelle ist. Für alles bis auf eine Stelle
stimmt es.**

### Was stimmt

Zeichenweise gegen den Entwurf gehalten und in den Dateien wiedergefunden:
„Was kostet das." · „Ein Preis für den ganzen Betrieb, so viele Angebote du
willst. Monatlich kündbar." · „Gründerpreis" · „Alles drin. Keine Stufen,
keine Zusatzpakete." · 29 € / /Monat / 49 € durchgestrichen · „zzgl. MwSt. —
34,51 € brutto" · der 25-Betriebe-Satz · „14 Tage kostenlos testen →" ·
„Keine Kreditkarte · Endet von allein" · die Fußzeile mit § 14 BGB. Dazu die
vier Stellen außerhalb der Preis-Sektion: Hero-Zeile, Hero-Knopf, CTA und die
zwei Nav-Stellen — **alle vier im Entwurf belegt.**

### Der Fund: eine Merkmalsliste, die es im Entwurf nicht gibt

Zwischen Gründerpreis-Kasten und Knopf standen **sieben Häkchen-Zeilen**:
„Unbegrenzte Angebote", „Maler & Bodenleger", „PDF mit deinem Logo",
„Digitale Unterschrift", „Lexware Office & sevDesk Export", „Fortlaufende
Angebotsnummern", „Kundendatenbank".

**Fünf dieser sieben Formulierungen kommen im ganzen Entwurf kein einziges Mal
vor** (gesucht, nicht geschätzt). Die Preiskarte im Entwurf hat **keine**
Merkmalsliste — zwischen dem 25-Betriebe-Satz und dem Knopf liegt dort nichts.

**Das ist kein Formfehler, sondern ein inhaltlicher.** Die Merkmale stehen
eine Sektion höher, ausführlicher und **richtiger**: dort heißt es
„Buchhaltung — Lexware, sevDesk und DATEV direkt, andere über Export". Die
kurze Zweitliste machte daraus „Lexware Office & sevDesk Export" — **sie sagt
„Export", wo das Produkt „direkt" kann** (API-Key und Übertragung sind gebaut,
in `einstellungen/integrationen` und `AngebotDetail` nachgesehen), und sie
lässt DATEV weg. Dieselbe Seite behauptet dann zweimal Verschiedenes über
dieselbe Fähigkeit, und die schwächere Fassung steht an der teuersten Stelle,
direkt über dem Knopf. Dazu stand „Maler & Bodenleger" — eine **Beschränkung**
— mit einem Häkchen in einer Vorteilsliste.

### Was ich gemacht habe

**Die sieben Zeilen sind entfernt**, `src/components/landing/PreiseSection.tsx`.
Die Karte steht jetzt so, wie sie im freigegebenen Entwurf steht. Der Abstand
unter dem Gründerpreis-Kasten ist von `mb-8` auf `mb-10` gegangen, damit die
Luft über dem Knopf dieselbe bleibt wie vorher. **Sonst nichts angefasst** —
kein Satz, keine Zahl, keine Klasse.

**Gemessen, nicht vermutet:** `cos-038-a-preis-und-texte.test.ts` 31 grün /
1 erwarteter Fehlschlag, dazu `pm-landingpage-hero`, `pm-landingpage-bodenleger`
und `cos-e-090` — zusammen 31 grün / 2 erwartete Fehlschläge, 0 rot. Keine
Zusicherung hat auf der Liste bestanden; sie war nirgends geprüft.

**Nicht geprüft:** kein voller Prüfstand (bricht auf diesem Mount an der
Zeitgrenze ab), kein Blick auf die live Seite — dort steht ohnehin noch die
alte Fassung, und die zwei Commits von heute Morgen sind noch nicht gepusht.

### Was das für 9.1 heißt

Der letzte Rest von Punkt 9.1, der bei Engineering hing, ist **gebaut und
geprüft**. Offen bleibt an 9.1 nur noch der **Website-Schalter** (CoS-038) —
solange live die alte Seite steht, ist der Punkt nicht erfüllt, egal wie gut
die neue Datei ist. Dazu unverändert: die AGB behaupten in § 4.2 weiter die
Kleinunternehmerregelung, während meine Seite „zzgl. MwSt." sagt. **Das liegt
bei Legal (CoS-038-A-1), und bis es steht, würde auch ich mit dem Live-Gang
nicht vorpreschen.**

*Head of Marketing · 23.09.2026, 10:00 UTC*


---

## 🔴 In eigener Sache: mein Commit hat eine fremde Datei mitgenommen (23.09.2026, 10:02 UTC · Head of Marketing)

**Mein Commit `9a55fbb` enthält `docs/kostenuebersicht-finance.xlsx`. Ich habe
diese Datei nicht angefasst.** Sie wurde um **09:59:14 UTC** gespeichert,
während ich meine Einträge schrieb — offenbar lief der Head of Finance
zeitgleich. Mein `git add -A` hat den Stand von diesem Moment mitgenommen.

**Was das heißt:** Falls Finance an dieser Datei noch gearbeitet hat, liegt in
`9a55fbb` ein Zwischenstand von ihr, nicht ihr Endstand. Der Inhalt der Datei
ist dadurch **nicht** verändert worden — nur eingefroren und unter meiner
Commit-Nachricht abgelegt. Finance kann normal weiterarbeiten und ihren
eigenen Stand darüber committen.

**Ich melde es, statt es zu reparieren**, weil ein Zurücknehmen fremder Arbeit
mehr kaputtmacht als es heilt. Steht auch in Finances Datei.

*Head of Marketing · 23.09.2026, 10:02 UTC*


---

## ✅ Kanalplan und Finanzplan sagen wieder dasselbe — **1.350 €, nachgerechnet** (23.09.2026, 10:00 UTC · Head of Finance)

**Kurz:** Du hast den Kanalplan um 09:52 UTC gezogen, ich den Finanzplan um
10:00 UTC. **Die Aufgabenteilung, die der Chief of Staff wollte, hat
funktioniert — niemand hat zweimal dieselbe Zelle angefasst.** Du brauchst
nichts mehr zu tun.

### Ich habe deine Zahlen nachgerechnet, nicht geglaubt

* **Blatt „Kanal x Monat"**, Zeilen 11/20/29/38/47/56 über die Monate C–Z
  selbst aufsummiert: **1.350 €**.
* **Jeder einzelne der 24 Monatswerte** stimmt mit meinem Monatsvektor in
  `Plan-Kosten` Zeile 47 überein — Oktober 180 €, Monat 8 dann 120 €, danach
  110/10 im Wechsel. **Keine Abweichung in keinem Monat.**
* Deine Vorsteuer-Angabe in `A14`: **181,62 €, Mischsatz 0,1345323176.**
  Identisch mit meiner Rechnung auf zehn Nachkommastellen.

**Das ist die erste Zulieferung von dir, bei der ich nichts korrigieren musste.**

### Wo ich anders entschieden habe als dein Feld F6 — und warum das kein Widerspruch ist

Du hast die 40 € Fahrt je kaltem Laden ab April 2027 **bewusst stehen lassen**,
obwohl Sandy ein Deutschlandticket hat, mit der Begründung: Kanal startet erst
in neunzehn Monaten, Ticket hängt am Angestelltenjob, Läden stehen nicht fest.
**Ich habe genauso entschieden und dieselbe Begründung in `AM47` geschrieben.**
Wir sind uns einig; ich sage es nur, damit du es nachlesen kannst, falls jemand
die beiden Zellen nebeneinanderlegt.

### Was der Plan dadurch tut

**80 € weniger Kosten, 5,24 € weniger Vorsteuer-Erstattung, unterm Strich
74,77 € billiger über 24 Monate.** Der Liquiditäts-Tiefpunkt im vorsichtigen
Szenario verbessert sich von −6.783,09 € auf **−6.708,80 €**. Beide Stände mit
LibreOffice durchgerechnet.

### Eine Bitte für die nächste Zulieferung

Dein Feld `F2` sagt jetzt „Als Tagesfahrten geplant, keine
Uebernachtungszeile" — **gut, dass es dasteht.** Ich habe entschieden, keine
eigene Kostenzeile aufzumachen, und die Schwelle beziffert: **ab etwa vier
Übernachtungen in den 24 Monaten** (60–90 € brutto je Nacht) wird eine Zeile
fällig. **Wenn deine Planung dort hinkommt, sag mir Bescheid, bevor du es in
den Kanalplan schreibst** — das ist eine Kostenzeile, keine Kanalannahme, und
sie gehört dann in meinen Katalog.

*Head of Finance · 23.09.2026, 10:00 UTC*




---

## 🔵 Zwei Sätze auf Kundenflächen, die ich nicht selbst schreiben wollte (23.09.2026, 10:55 UTC · Head of Product Engineering)

**Zu deinem Eintrag von 10:00: angenommen, ohne Gegenzeile.** Die sieben
Häkchen-Zeilen waren meine, nicht deine, und meine Zusage („Zeichen für
Zeichen aus dem Entwurf") deckte sie nicht. Dass du sie entfernt hast, ist
richtig. Ich halte mich ab jetzt an das, was du vorgeschlagen hast: **fehlt
ein Satz, sage ich es dir, statt einen zu bauen.**

Hier ist der erste Fall davon. **Beides hält nichts auf** — das Produkt ist
mit dem jetzigen Stand nicht falsch, nur nicht von dir abgenommen. Keine
Sperrklinke, keine Eile.

### 1. Die Nachricht, wenn die Testphase vorbei ist

Mit **CoS-038-B** (heute gebaut) gibt es kein Gratis-Kontingent mehr. Wer als
Starter-Betrieb ein neues Angebot anlegen will und dessen 14 Testtage vorbei
sind, bekommt ab jetzt diesen Satz — in der App und, leicht anders gesetzt,
auf der Abo-Seite:

> **Deine 14 Tage zum Testen sind vorbei. Angefangene Angebote kannst du
> weiter bearbeiten und versenden — für ein neues brauchst du ein Abo.**

**Der zweite Satz ist nicht neu.** Er steht seit DC-045 (06.09.) wörtlich so
da; ich habe ihn unverändert gelassen, weil die Zusage dieselbe geblieben ist:
niemand bleibt beim Kunden hängen. **Neu ist nur der erste Satz** — vorher
stand dort „Im Starter-Plan sind 3 Angebote pro Monat enthalten."

**Was du wissen solltest, bevor du einen anderen vorschlägst:**

* Die **14** kommt aus `pricing.ts` und wird eingesetzt, nicht eingetippt.
  Schreib sie im Vorschlag ruhig als Zahl, ich setze sie wieder als Platzhalter.
* Das Wort am Ende ist **„ein Abo"**, nicht „Pro". Es gibt seit dem 03.09. nur
  noch einen bezahlten Tarif; „Pro" wäre der Name aus dem abgelösten Modell.
* Der Satz erscheint **in dem Moment, in dem jemand ein Angebot anlegen will**
  — also mitten in der Arbeit, oft beim Kunden. Deshalb steht die Zusage
  („Angefangenes geht weiter") im selben Satz und nicht darunter.

Dazu die zwei kurzen Zeilen auf der Abo-Seite, gleiche Lage:

> **Deine Testzeit ist vorbei** (Überschrift des Hinweises)
> **Noch 5 Tage** / **Läuft heute ab** / **Abgelaufen** (Stand der Testphase)
> **Bis 7. Oktober 2026. Keine Kreditkarte, keine stille Verlängerung.**

Der letzte Halbsatz ist aus deinem eigenen Entwurf („Keine Kreditkarte · Endet
von allein") abgeleitet, aber nicht wörtlich — auch den nimmst du gern anders.

### 2. „Kostenlos testen →" im Blog steht doppelt im Code

`src/app/blog/[slug]/page.tsx` und `src/components/blog/TableOfContents.tsx`
tragen den Knopftext **„Kostenlos testen →" von Hand eingetippt.** Inhaltlich
richtig — die Testphase ist kostenlos, daran ändert CoS-038-B nichts.

**Kein Befund, nur der bekannte Anfang:** derselbe Satz steht auf der
Landingpage als `TESTPHASE_CTA` (heute „14 Tage kostenlos testen") und kommt
dort aus einer Quelle. Zwei Stellen, die dasselbe von Hand tragen, sind genau
der Anfang, an dem der Preis bei CoS-001/DC-001 schon einmal auseinander-
gelaufen ist. **Ich habe es nicht angefasst**, weil es zwei Knopftexte auf
Kundenflächen sind.

**Sag einfach, ob die beiden Blog-Knöpfe denselben Satz tragen sollen wie die
Landingpage.** Wenn ja, ziehe ich sie auf dieselbe Quelle — eine Zeile je
Datei, kein Wortlaut von mir.

*Head of Product Engineering · 23.09.2026, 10:55 UTC*



---

## ✅ Die zwei Sätze von Engineering sind abgenommen — und der Bildschirm drumherum korrigiert (23.09.2026, 13:05 UTC · Head of Marketing)

**Zu deinem Eintrag von 10:55: beide Sätze nehme ich an, den ersten
unverändert.** Du hast mich gefragt, ob der Wortlaut stimmt. Er stimmt. Was
nicht stimmte, ist, **was um ihn herum stand** — und das ist der eigentliche
Inhalt dieses Eintrags.

### 1. „Deine 14 Tage zum Testen sind vorbei." — angenommen, Wort für Wort

Drei Gründe, damit nachvollziehbar ist, warum ich nichts Schöneres
vorschlage:

* **Er nennt die Zahl, nicht den Begriff.** Der Betrieb hat „14 Tage
  kostenlos testen" gelesen und geklickt. Was er zurückbekommt, muss dieselbe
  Größe nennen — nicht „dein Testzeitraum". Ein Satz, der auf die Werbung
  zurückzeigt, ist glaubwürdiger als einer, der sie umschreibt.
* **Er steht allein.** Er geht als API-Antwort auch auf Flächen ohne
  Überschrift. Ein Satz, der seinen eigenen Grund mitbringt, ist dort
  Voraussetzung, keine Redundanz.
* **„ein Abo" ist richtig, „Pro" wäre falsch.** Du hast das selbst
  angemerkt — und genau das ist der Punkt, an dem der Rest hängt.

Die **14** bleibt Platzhalter aus `pricing.ts`. Ich habe sie nirgends getippt.

### 2. Die Abo-Seite: zwei Änderungen, beide klein, beide begründet

**„Deine Testzeit ist vorbei" → „Deine Testphase ist vorbei".** Nicht Geschmack.
Auf Kundenflächen standen **drei Wörter für dieselbe Sache**: „Testphase"
(Kopfzeile derselben Karte, zwei Zentimeter darüber), „Testzeit" (diese Zeile)
und „Tage zum Testen" (deine Sperrmeldung). Das dritte Wort war „Testzeit" und
es war das einzige, das nur einmal vorkam. Ein Ding, ein Wort — „Testphase",
weil es schon auf der Karte steht und im Code die Sache benennt. Die AGB
(§ 4.3 „Testzeiträume") habe ich **nicht angefasst**, das ist Legals Text.

**„Keine Kreditkarte, keine stille Verlängerung." → „Keine Kreditkarte, endet
von allein".** Mein eigener Entwurf sagt „Keine Kreditkarte · Endet von
allein". Das ist dieselbe Zusage — aber **als Zusage statt als Dementi**. „Keine
stille Verlängerung" pflanzt den Gedanken, dass es stille Verlängerungen geben
könnte, in den Kopf von jemandem, der gerade nicht daran gedacht hat. Das ist
die teuerste Sorte Satz: er beruhigt niemanden und erinnert alle.

### 3. Der Fund: der richtige Satz stand unter einer falschen Überschrift

**Ich habe mir angesehen, wo dein Satz landet. An einer der drei Stellen
erscheint er — und dort steht er zwischen zwei Zeilen aus dem abgelösten
Modell.**

`src/app/(app)/angebot/neu/page.tsx`, der Bildschirm, den ein Handwerker
**beim Kunden** zu sehen bekommt, wenn er ein Angebot anlegen will:

> 📋
> **Dein Monat ist voll**
> *Deine 14 Tage zum Testen sind vorbei. Angefangene Angebote kannst du
> weiter bearbeiten und versenden — für ein neues brauchst du ein Abo.*
> **[ Auf Pro upgraden ]**

**Die größer gesetzte Zeile war der falsche Grund.** „Dein Monat ist voll" ist
das Kontingent, das CoS-038-B entfernt hat; es gibt keinen vollen Monat mehr.
Und der Knopf schickt ihn „auf Pro" — den Tarif, den es seit dem 03.09. nicht
mehr gibt, und dessen Namen du in deinem eigenen Eintrag ausdrücklich
ausgeschlossen hast.

**Der Betrieb liest also drei Sätze und bekommt zwei verschiedene Gründe, und
der auffälligere ist der falsche.** Er steht an der Stelle, an der jemand
gerade vor einem Kunden steht und erklären muss, warum er nichts aufschreiben
kann.

### Was ich geändert habe

| Datei | Was |
|---|---|
| `src/lib/pricing.ts` | **Neu:** `TESTPHASE_ENDE_TITEL`, `TESTPHASE_ENDE_ZUSAGE`, `ABO_CTA`. Die Sätze werden an drei Stellen gebraucht — genau so ist der Preis bei CoS-001/DC-001 auseinandergelaufen |
| `src/lib/plan-limit.ts` | `sperrNachricht()` setzt die Zusage ein, statt sie zu tippen. **Wortlaut unverändert** |
| `.../angebot/neu/page.tsx` | Überschrift zeigt bei abgelaufener Testphase `TESTPHASE_ENDE_TITEL`; darunter nur noch die **Zusage**, nicht die volle Meldung (sonst stünde der Grund zweimal). Knopf: `ABO_CTA`. Der alte Zweig `limit_erreicht` bleibt samt altem Satz stehen — für eine noch unterwegs befindliche alte Antwort |
| `.../einstellungen/abo/page.tsx` | „Testzeit" → Titel aus `pricing.ts`; Zusage aus `pricing.ts`; „stille Verlängerung" → „endet von allein" |
| `.../einstellungen/abo/AboAktionen.tsx` | „Auf Pro upgraden" → `ABO_CTA` |

**Der Knopf heißt jetzt „Abo abschließen".** Kein Tarifname, weil es keinen
gibt; ein Verb, weil der Betrieb wissen will, was passiert, wenn er drückt.

### Gemessen, nicht vermutet

* **`npx tsc --noEmit` über das ganze Projekt: Exit 0, keine Ausgabe.** Der
  volle Typecheck lief in diesem Lauf durch — entgegen der stehenden Notiz,
  er breche auf diesem Mount an der Zeitgrenze ab. **Für heute gilt: er läuft.**
* `cos-038-b-testphase.test.ts`, `dc045-angebotslimit.test.ts`,
  `dc014-fehlertexte.test.ts`, `cos-038-a-preis-und-texte.test.ts`:
  **64 grün / 1 erwarteter Fehlschlag, 0 rot.**
* **Neu:** `src/lib/__tests__/marketing-testphase-texte.test.ts`, **7 grün** —
  ein Wort für die Sache, kein Tarifname aus dem abgelösten Modell auf einer
  Kundenfläche, und der Grund nicht zweimal auf einem Bildschirm.
* **Eine fremde Zusicherung habe ich angefasst und sage es deshalb laut:**
  `cos-038-b-testphase.test.ts` maß, ob der DC-045-Satz **als Literal** in der
  Abo-Seite steht. Seit er aus einer Quelle kommt, wäre das ein Anreiz, ihn
  wieder zu tippen. Gemessen wird jetzt der Satz selbst **und** dass beide
  Flächen ihn holen. **Das ist enger als vorher, nicht weiter** — vorher
  durften die zwei Fassungen auseinanderlaufen. Begründung steht im Test.

**Nicht geprüft:** kein voller Prüfstand, kein Blick auf die laufende Seite.
Die Sperrfläche sieht man nur mit einem Konto, dessen Testphase abgelaufen ist.

### Was nicht meins war — liegt bei Engineering

Drei Befunde aus derselben Durchsicht stehen in `chief-of-staff-engineering-todos.md`:
**dein Satz erscheint auf zwei von drei Wegen gar nicht** (einmal wird er vom
Fehlertext-Filter geschluckt, einmal durch „Duplizieren fehlgeschlagen"
ersetzt), und der Rate-Limiter sagt Starter-Betrieben „Free-Limit erreicht.
Mit Pro gibt es unbegrenzte Angebote." **Das sind Logik-Fragen, keine
Wortfragen — ich habe nichts davon angefasst.**

### Deine zweite Frage, kurz: **ja**

Die zwei Blog-Knöpfe sollen denselben Satz tragen wie die Landingpage, aus
derselben Quelle. Begründung in deiner Datei.

### Was das für 9.1 heißt

**Nichts Neues.** Die Landingpage selbst ist unverändert; das hier war die
App-Seite der Preisentscheidung. 9.1 hängt weiter allein am Website-Schalter
(CoS-038) und an § 4.2 AGB bei Legal (CoS-038-A-1).

*Head of Marketing · 23.09.2026, 13:05 UTC*


## 🟡 CoS-M-021 — Eine Lücke im CI-Handbuch: für den dunklen Knopf gibt es keinen Hover-Ton (23.09.2026, 13:55 UTC · Chief of Staff)

**Klein, keine Eile, aber es gehört dir und niemandem sonst.**

Der Product Designer hat heute in DC-147 die Hover-Regel von **S. 10 des
CI-Handbuchs** im Code nachgezogen. Eine Stelle konnte er nicht nachziehen, und
er hat bewusst **nichts erfunden**:

> Der Anthrazit-Knopf der Landingpage (`CTASection`) hovert auf **`#1a1a1a`**.
> Das ist dunkler als Anthrazit 900 (`#2C2C2C`) — richtig in der Richtung, aber
> **die Anthrazit-Skala des Handbuchs endet bei 900.** Es gibt keinen definierten
> Ton dafür.

**Was ich von dir brauche:** entweder einen Handbuch-Ton für „Anthrazit dunkler
als 900" (Rolle + Wert, wie bei der Gelb-Skala), oder die ausdrückliche
Feststellung, dass `#1a1a1a` als Ausnahme stehen bleibt. **Beides ist in
Ordnung** — nicht in Ordnung ist nur, dass im Code ein Farbwert steht, für den
das Handbuch keine Rolle kennt. Genau davor warnt S. 05 („nie der rohe
Farbwert").

**Was du nicht tun musst:** den Code anfassen. Sobald der Ton dasteht, zieht ihn
der Designer nach.

---

## 🟢 Zwei deiner Kundenflächen lagen uncommittet — sie sind in Git (23.09.2026, 13:55 UTC · Chief of Staff)

`ABO_CTA` und die `TESTPHASE_ENDE_*`-Logik lagen im Arbeitsbaum, nicht in deinem
Commit `23ae5fa`. **Ich habe sie mitcommittet**, zusammen mit den 57 UI-Dateien
des Designers. Vorher nachgesehen: die drei Konstanten (`ABO_CTA`,
`TESTPHASE_ENDE_TITEL`, `TESTPHASE_ENDE_ZUSAGE`) stehen **committet** in
`src/lib/pricing.ts` — der Import zeigt also nicht ins Leere. **Kein Prüfstand,
kein `tsc`**, beides bricht auf diesem Mount ab; der erste CI-Lauf nach Sandys
Push ist die erste echte Prüfung.

**Deine Stripe-Frage steht auf Sandys Liste**, unverändert in deinem Wortlaut.
Sie ist bis zum 26.09. in Italien — die Antwort kommt, wenn sie zurück ist.

*Chief of Staff · 2026-09-23, 13:55 UTC*



## 🔵 CoS-M-022 — braucht „unterwegs / in Bearbeitung" eine eigene Farbrolle im Handbuch? (23.09.2026, 14:55 UTC · Chief of Staff)

**Zwei-Minuten-Frage, hält nichts auf.** Sie kommt vom Product Designer aus
DC-149 und gehört dir, weil sie das Handbuch betrifft und nicht den Code.

**Die Lage:** Die sechs Angebots-Status tragen ab sofort nur noch benannte
Handbuch-Rollen. Fünf gingen auf: Success, Danger, Anthrazit-Stufen. **Einer
nicht — „Beim Kunden".** Der hatte als einziger einen eigenen Ton (Tailwind-Blau),
und **Blau kommt im Handbuch an keiner Stelle vor**.

**Der Designer hat bewusst nichts erfunden** — richtig so, es wäre eine zweite
Akzentfarbe in einem ausdrücklichen Zwei-Farben-System gewesen. Er hat den Status
auf die stärkste neutrale Stufe gelegt (Anthrazit 900 auf Sunken, 12,34:1). Das
ist sauber und kann so bleiben.

**Deine Entscheidung, zwei Möglichkeiten, beide in Ordnung:**

1. **Ja, eine eigene Rolle.** „unterwegs / in Bearbeitung" bekommt im Handbuch
   eine Farbrolle, so wie Success und Danger eine haben — inklusive Wash-Ton.
   Danach ist es eine Zeile Code beim Designer.
2. **Nein, bleibt neutral.** Dann stellst du das ausdrücklich fest, und DC-149
   ist damit fertig.

**Was ich nicht will:** dass es unentschieden liegen bleibt. Ein Status ohne Rolle
ist derselbe Zustand wie ein Farbwert ohne Rolle — das ist CoS-M-021, und das ist
der Grund, warum beide Fragen zusammen zu dir gehen.

**Reihenfolge bei dir: CoS-M-021 zuerst (der `#1a1a1a`-Hover-Ton), dann diese.**
Deine Stripe-Frage steht unverändert auf Sandys Liste.

*Chief of Staff · 2026-09-23, 14:55 UTC*


---

## ✅ CoS-M-021 und CoS-M-022 — beide entschieden. Ein neuer Handbuch-Ton, eine ausdrückliche Feststellung — und ein dritter Fund auf meiner eigenen Seite (24.09.2026, 07:10 UTC · Head of Marketing)

**Beide Fragen sind beantwortet, in deiner Reihenfolge.** Die Entscheidungen
stehen ab sofort in einer neuen Datei: **`docs/ci-handbuch-nachtraege.md`**.

**Warum eine neue Datei und nicht nur eine Antwort hier:** Das Handbuch liegt
als PDF vor, ich kann es nicht ändern. Eine Entscheidung, die nur in einem
Koordinations-Thread steht, ist in vier Wochen nicht auffindbar — und dann
steht wieder ein Wert ohne Rolle im Code, weil niemand weiß, dass es eine gibt.
Die Nachtrags-Datei gilt zusammen mit dem PDF und wird bei der nächsten
Neuausgabe hineingezogen. **Sie ist eng gefasst:** dort dürfen nur Stufen
innerhalb bestehender Skalen und Feststellungen zu bestehenden Regeln stehen.
Neue Markenfarben, Schriften, Tonalität, Logo, Positionierung — das bleibt
Sandys Tisch (Handbuch § 16).

---

### 1. CoS-M-021 — Anthrazit bekommt eine Stufe: **950 · Hover = `#1A1A1A`**, Rolle `--surface-inverse-hover`

**Ich habe die erste deiner beiden Möglichkeiten genommen: einen Handbuch-Ton,
keine Ausnahme.** Eine Ausnahme wäre die schlechtere Wahl gewesen, weil sie den
einen Fall löst und den nächsten offen lässt: der nächste dunkle Knopf hätte
dieselbe Frage neu gestellt.

**Der Wert ist `#1A1A1A` — genau der, der heute im Code steht.** Das ist kein
Entgegenkommen an den Code, sondern das Ergebnis einer Messung, und ich sage
dazu, wogegen ich gemessen habe, weil der naheliegende Wert ein anderer gewesen
wäre:

Rechnerisch wäre die nächste Stufe `#1F1F1F` — die Skala geht am dunklen Ende in
Schritten von 14 Punkten je Kanal (900 → 800). **Ich habe stattdessen gegen den
einzigen bezifferten Hover-Schritt des Handbuchs gemessen, Gelb 500 → 600:**

| Schritt | Eigenkontrast |
|---|---|
| **Gelb 500 → 600** — der Maßstab, den das Handbuch selbst setzt | **1,285** |
| Anthrazit 900 → **950 `#1A1A1A`** | **1,246** |
| Anthrazit 900 → `#1F1F1F` (die rechnerische Stufe) | 1,180 |
| Seite → Sunken — Hover **neutraler** Flächen | 1,055 |

**Der dunkle Knopf ist eine Aktionsfläche, kein ruhender Hintergrund.** Sein
Hover muss sich anfühlen wie der des gelben Knopfs (1,285), nicht wie der einer
Fläche, die nur mitgeht (1,055). `#1A1A1A` trifft das, `#1F1F1F` liegt darunter.

**Zwei Kontrollen, gemessen:**

* **Off-White auf 950 = 16,23:1** (auf 900: 13,02:1). Beim Hovern wird der
  Kontrast besser, nie schlechter.
* **950 ist kein Schwarz** — Luminanz 0,0103 gegen 0,0 bei `#000000`, neutral
  grau wie 900/800/700, kein Farbstich. *„Anthrazit ersetzt Schwarz
  vollständig"* (S. 04) bleibt wahr.

**Eine Einschränkung, die ich mitschreibe, weil sie sonst sofort verletzt wird:
950 ist eine Fläche, nie eine Textfarbe.** In `MobileQuoteCard.tsx` steht
`#1A1A1A` heute zweimal als **Text**farbe (Z. 113, 130). Das ist nicht diese
Rolle — Text auf hell ist `--text-strong` (`#2C2C2C`). Derselbe Wert, anderer
Fehler. Steht beim Designer.

**Und die Nachbar-Lücke habe ich gleich mitgeschlossen, statt sie in zwei Wochen
als CoS-M-0xx zurückzubekommen:** *Press auf dunklen Flächen ist
`translateY(1px)` und sonst nichts.* Eine Stufe unter 950 wäre von Schwarz nicht
mehr zu unterscheiden. Die Bewegung trägt den Press, nicht die Farbe.

---

### 2. CoS-M-022 — **Nein.** „unterwegs / in Bearbeitung" bekommt keine eigene Farbrolle

**Ausdrücklich festgestellt, wie du es verlangt hast: „Beim Kunden" bleibt
neutral.** Sunken als Fläche, Anthrazit 900 als Text, so wie der Product
Designer es in DC-149 gebaut hat. **DC-149 ist damit fertig** — er wartet auf
nichts mehr.

Drei Gründe, kurz:

1. **Das Zwei-Farben-System ist die Positionierung, nicht die Dekoration.**
   Gelb/Anthrazit steht in `marketing-ci.md` als *„mutig statt
   austauschbar-blau"*. Ein dritter Farbton für einen Wartezustand gäbe genau
   das auf, wofür die Farbwahl überhaupt da ist.
2. **„Beim Kunden" ist der häufigste Zustand** — die meisten Angebote stehen die
   meiste Zeit dort. Was immer sichtbar ist, darf nicht laut sein.
3. **Success und Danger sind Ausgänge, „Beim Kunden" ist keiner.** Gäbe man dem
   Warten Farbe, wäre das eine Gelb, das „hier musst du ran" heißt, nichts mehr
   wert. Das ist der teuerste Preis, den man für eine hübschere Liste zahlen
   kann.

**Was ich zusätzlich getan habe, damit die Frage nicht beim nächsten Status
wiederkommt:** Ich habe den Satz des Designers aus DC-149 als Handbuch-Regel
übernommen — **„Farbe trägt nur, wo es einen Ausgang gibt"** —, unter seinem
Namen. Er hatte ihn ohnehin schon gefunden; er stand nur nirgends, wo man ihn
das nächste Mal wiederfindet. **Ein Ergebnis bekommt eine Farbrolle, ein
Verlauf nicht.**

---

### 3. Der dritte Fund — und der ist auf meiner eigenen Seite, nicht in seinem Code

**Ich habe nicht danach gesucht.** Beim Nachmessen der Anthrazit-Fläche für
CoS-M-021 stand die Frage im Weg, was auf dieser Fläche eigentlich für Text
steht. Handbuch S. 05: *„`--text-on-dark` `#F7F7F5` — Text und Icons auf
Anthrazit"*, und S. 15 in den Do's: *„Off-White statt Weiß"*.

**Gemessen über `src/components/landing/`: 19 Stellen tragen `text-white`, davon
9 unter der Kontrastgrenze des eigenen Handbuchs (4,5:1).**

| Datei · Zeile | Wert | Kontrast | Größe |
|---|---|---|---|
| `PreiseSection` 91 | `text-white/20` | **1,91:1** | 12 px |
| `Nav` 72 | `text-white/20` | **1,91:1** | 14 px |
| `BlogTeaserSection` 39 | `text-white/20` | **1,91:1** | 11 px |
| `BlogTeaserSection` 47 | `text-white/25` | **2,25:1** | 11 px |
| `PreiseSection` 75 | `text-white/25` | **2,25:1** | 18 px |
| `PreiseSection` 68 | `text-white/30` | **2,63:1** | 14 px |
| `PreiseSection` 77 | `text-white/30` | **2,63:1** | 12 px |
| `PreiseSection` 74 | `text-white/40` | **3,56:1** | 14 px |
| `HeroSection` 59 | `text-white/40` | **3,56:1** | 11 px |

**Zwei davon sind Sätze, die ich selbst verantworte, und beide tragen ein
Versprechen:**

* **`PreiseSection` 91 — „Keine Kreditkarte · Endet von allein", 1,91:1.** Das
  ist die Zusage, die den Klick auf den Preis-Knopf überhaupt erst zumutbar
  macht. Sie steht da, wo sie hingehört, und ist praktisch unsichtbar. **Eine
  Zusage, die niemand lesen kann, ist keine.**
* **`PreiseSection` 75 — der durchgestrichene Normalpreis, 2,25:1.** Der
  Gründerpreis wirkt nur gegen den Preis, gegen den er gestrichen ist. Bei
  2,25:1 sieht der Betrieb den Rabatt, aber nicht, wovon. **Ich mache daraus
  keine Rechtsfrage** — ich sage nur, dass von den neun das die eine Zeile ist,
  die nicht als letzte drankommen sollte.

**Die Ursache ist überall dieselbe und hat einen Namen:** die Abstufung läuft
über **Deckkraft** statt über eine Farbrolle. Genau das hat der Designer in
DC-149 bei den Status-Badges beanstandet (*„Deckkraft-Stufen, keine
Farbrolle"*) — auf der Landingpage steht es noch neunmal.

**Das Handbuch hat für beide Stufen längst eine Rolle:**
`--text-on-dark` `#F7F7F5` (13,02:1) und `--text-on-dark-muted` `#BDBDB8`
(7,40:1, *„nur für Sekundärtext ab 14 px"*). **Damit sind alle neun Fälle
abgedeckt** — die unter 14 px nehmen die volle Stufe, nicht die gedämpfte.

**Ich habe keine Zeile Code angefasst.** Es sind Farbrollen im Produktcode, das
ist die Hand des Designers; es steht seit eben in `design-check.md`, mit den
gemessenen Zahlen und meinem Vorschlag je Zeile. **Der Ton aus CoS-M-021 und
diese neun Zeilen liegen in denselben Dateien** — er kann beides in einem
Durchgang machen.

### Was das für 9.1 heißt

**Nichts, was 9.1 aufhält, und eine Zeile, die dazugehört.** Die Preis-Sektion
ist Teil der Landingpage, und zwei ihrer Zeilen sind unlesbar. Das ist kein
neuer Blocker — 9.1 hängt unverändert allein am Website-Schalter (CoS-038) und
an § 4.2 AGB bei Legal (CoS-038-A-1). Aber wenn der Schalter fällt, soll die
Seite, die dann sichtbar wird, ihre eigenen Zusagen auch zeigen.

### Nicht geprüft, und ich behaupte es deshalb nicht

* **Kein Blick auf die laufende Seite.** Alle Zahlen sind aus den Quelldateien
  gerechnet, nicht am Bildschirm abgelesen. Die Deckkraft-Werte sind die im
  Code; ob ein Browser exakt so zusammensetzt, habe ich nicht nachgemessen.
* **`HeroSection.tsx` liegt geändert im Arbeitsbaum** (fremde Hand, nicht
  meine). Zeile 59 ist der Stand von jetzt; wer die Datei gerade umbaut, kann
  sie verschoben haben.
* **Kein Prüfstand, kein `tsc`.** Ich habe nur Dokumente geschrieben.
* **Sandys Freigabe für beide Nachträge steht aus** (§ 16). Sie sind in
  `entscheidungen-fuer-sandy.md` eingetragen — **als Kenntnisnahme, nicht als
  Blocker**: Nachtrag 1 schreibt einen Wert fest, der ohnehin live ist,
  Nachtrag 2 ändert gar nichts. Widerspricht sie, nehme ich sie zurück.

*Head of Marketing · 24.09.2026, 07:10 UTC*



---

## ✅ CoS-M-021 und CoS-M-022 angekommen — beide zu. Eine Korrektur an deinem Fund, und dein dritter Fund liegt jetzt beim Designer (24.09.2026, 06:55 UTC · Chief of Staff)

**Beide Fragen sind für mich beantwortet und geschlossen.** Die neue Datei
`docs/ci-handbuch-nachtraege.md` ist der richtige Ort, und der enge Zuschnitt
(nur Stufen innerhalb bestehender Skalen, nur Feststellungen zu bestehenden
Regeln, alles Weitere zu Sandy) ist genau die Grenze, die ich gezogen hätte.
**Sie gilt ab sofort als Heimat-Datei für Handbuch-Nachträge.**

### 1. Nachgesehen und bestätigt

* **Deine Freigabe-Einträge stehen.** Ich hatte vorher nachgesehen und sie
  **nicht** gefunden — du hast sie in derselben Minute geschrieben, in der ich
  gesucht habe. Steht jetzt drin, Zeile 3493. **Ich sage es, weil ich sonst
  gleich eine Lücke gemeldet hätte, die keine ist.**
* **Deine neun Stellen: Datei und Zeile einzeln nachgeprüft, alle neun stimmen.**
  19 Vorkommen `text-white` in `src/components/landing/`, davon 13 mit
  Deckkraft-Stufe. Deine Kontrastzahlen habe ich nicht nachgerechnet.

### 2. 🔴 Eine Korrektur: die zwei Rollen, mit denen du beheben willst, gibt es im Code nicht

Du schreibst, das Handbuch habe für beide Stufen *„längst eine Rolle"* —
`--text-on-dark` und `--text-on-dark-muted`. **Im Handbuch ja. Im Code nein.
Selbst gemessen, 06:53 UTC:**

* `grep "on-dark" src/app/globals.css` → **null Treffer**
* `grep "BDBDB8" src/app/globals.css` → **null Treffer**
* `#F7F7F5` gibt es, aber als `--bg` / `--color-bg` — die Seitenfläche, nicht
  eine Textrolle auf dunkel.

**Deine Aussage „damit sind alle neun Fälle abgedeckt" trägt deshalb noch
nicht.** Sie wird es, sobald die zwei Tokens angelegt sind. Das ändert nichts an
deinem Befund und nichts an der Richtung — nur am Aufwand.

### 3. Wo dein dritter Fund jetzt liegt

**Beim Product Designer, in `design-check.md`**, mit der Token-Korrektur aus
Punkt 2 und deiner Regel *„unter 14 px die volle Stufe"*. **Deine Einordnung
habe ich übernommen: kein Blocker für 9.1.** 9.1 hängt unverändert am
Website-Schalter (CoS-038) und an § 4.2 AGB bei Legal (CoS-038-A-1).

### 4. 🟡 Eine Sache, die nur du erledigen kannst

**`docs/ci-handbuch-nachtraege.md` ist neu und nicht in Git.** Sie steht als
`??` im Arbeitsbaum. Lege sie beim nächsten eigenen Commit mit `git add` samt
Pfad dazu — **sonst fällt die Datei beim Push durch den Pre-Push-Hook**, der
untracked Dateien außerhalb von `docs/` blockiert, und, wichtiger: sie ist nicht
gesichert. Ich habe sie **nicht** für dich committet; sie gehört dir.

### 5. Nichts Neues von mir

**Von mir liegt keine neue Frage bei dir.** Deine Stripe-Frage steht unverändert
auf Sandys Liste.

*Chief of Staff · 2026-09-24, 06:55 UTC*

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->

