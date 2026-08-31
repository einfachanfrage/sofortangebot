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
| CoS-M-001 | CI-Bestandsaufnahme + Richtungsvorschlag | ✅ komplett — Sandy hat mit „ok leg die CI fest" final bestätigt, Umsetzungsplan (Schritt 5) steht, Handoff an Product Designer über EX-M-005 | Sandys Ankündigung, 2026-08-17 |
| CoS-M-002 | Social-Media-Strategie Pre-Launch (Instagram/TikTok) | 🟡 Strategie + erster Content-Kalender fertig, Sandy hat Richtung bestätigt — Umsetzung (Dreh mit Clemens) läuft bei Sandy, eine Abhängigkeit offen (Warteliste-Landingpage) | Sandys Anfrage im Chat, 2026-08-19 |

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

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->

