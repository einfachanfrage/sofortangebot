# Entscheidungen & Aktionen, die auf Sandy warten

Gebündelte Liste für genau eine Sache: alles, was NUR Sandy machen kann —
Entscheidungen (Preis, Positionierung, Personal, Risikobereitschaft — nicht
fachliche Umsetzung, die bleibt bei den Spezialisten) UND Aktionen, für die
es Sandys eigene Zugänge/Hände braucht (Konto-Einstellungen, ein echter
Live-Test in der App). Bisher lagen solche Punkte verstreut in
`design-check.md`, `chief-of-staff-todos.md` etc. — hier stehen sie
gebündelt, damit nichts im Alltag untergeht. Eine Wahrheit pro Sache gilt
weiter: hier steht nur ein kurzer Verweis + der Stand, die volle Diskussion
bleibt in der jeweiligen Heimat-Datei (verlinkt über die ID).

**Ablauf:** Sobald der Chief of Staff in einer Heimat-Datei einen Punkt auf
🔵 „Entscheidung nötig" setzt (oder eine neue Entscheidung/Aktion sonst wie
entsteht), kommt sofort eine Zeile hier rein — **und nur hier**, nirgendwo
sonst. Nach Erledigung wandert die Zeile von „Offen"/„Aktionen" nach
„Entschieden" (bleibt stehen, nicht löschen — Verlauf ist wertvoll).

**Status-Zeichen:** 🔵 offen, wartet auf Sandy · 🔴 dringend · ✅ entschieden.

> **Prozess-Notiz (Chief of Staff, 02.09.2026):** Head of Product
> Engineering hatte kurzzeitig eine eigene Datei `docs/sandy-todos.md`
> direkt an Sandy geführt, parallel zu dieser hier. Auf Sandys Anweisung
> („alles in eine datei zsmfassen") ist der Inhalt jetzt komplett hier
> eingepflegt, `sandy-todos.md` verweist nur noch hierher. Diese Datei
> bleibt der einzige Kanal — auch für dringende/sicherheitsrelevante
> Punkte, nicht nur klassische Entscheidungen.

---

## Dringende Aktionen (nur du kannst das)

**🔵 1. Groq — vollständig entfernt, Key-Widerruf optional.** Bestätigt:
Groq wird nirgends im Produkt verwendet und ist aus Code, AGB, AVV und
Datenschutzerklärung entfernt (Head of Product Engineering, 02.09.) — dieser
Teil ist erledigt, kein offener Punkt mehr. Der eine Rest: der alte
API-Schlüssel selbst stand kurz im Klartext im Chat. Ob euer Groq-Konto
überhaupt eine Zahlungsmethode hinterlegt hat, weißt nur du — falls nein,
ist das reine Formsache und du kannst es ignorieren; falls ja, ist der
Widerruf unter [console.groq.com/keys](https://console.groq.com/keys)
(Papierkorb-Symbol beim Schlüssel → Revoke Key) eine 30-Sekunden-Sache, die
den Punkt endgültig schließt. Deine Entscheidung, keine Dringlichkeit mehr.

**🔴 2. Vercel: `CRON_SECRET` prüfen, Cron-Jobs kontrollieren.** Der
Erinnerungs-Job hat noch nie eine E-Mail verschickt (75 Angebote, keine
einzige Erinnerung, obwohl mehrere seit Ende August fällig sind) —
vermutlich fehlt `CRON_SECRET` in der Produktionsumgebung. Genau derselbe
Mechanismus soll jetzt auch die neue 30-Tage-Konto-Löschung ausführen: läuft
er nicht, löschen wir nichts, obwohl Datenschutzerklärung und AGB das
versprechen. **So geht's** (Vercel → Projekt `sofortangebot` → Settings):
Environment Variables prüfen, ob `CRON_SECRET` für Production existiert
(sonst anlegen, Wert selbst erzeugen statt im Chat zu teilen); unter Cron
Jobs prüfen, ob `/api/cron/reminder` und `/api/cron/aufraeumen` beide
eingetragen sind; bei einem testweise „Run now" klicken. **Danach kurz
Head of Product Engineering Bescheid geben** — er kann in `system_laeufe`
verifizieren, ob der Lauf wirklich durchging.

**Nachtrag Chief of Staff, 03.09.2026 — jetzt ist es belegt, nicht mehr
vermutet.** Platform hat beim Skalierungs-Kostenmodell (CoS-P-008) direkt in
die Produktionsdaten geschaut: Die Job-Protokoll-Tabelle `system_laeufe` führt
den Aufräum-Job selbst mit `"letzterLauf": null` und `"ueberfaellig": true` —
**er ist buchstäblich noch nie gelaufen und weiß das selbst.** Im
Sprachaufnahmen-Speicher liegen inzwischen 263 Dateien, davon **125 älter als
30 Tage**, die älteste vom 02.07. Das ist kein Kostenproblem (86 MB), sondern
ein Versprechen aus Datenschutzerklärung und AGB, das seit über zwei Monaten
nicht eingehalten wird. Es hängt weiterhin an genau diesem einen Punkt, den
nur du in Vercel prüfen kannst.

*Nachtrag Head of Product Engineering, 02.09. nachmittags:* An diesem einen
Punkt hängt inzwischen mehr als die Konto-Löschung. Beim Durchsehen der
Speicher-Buckets sind **182 verwaiste Sprachaufnahmen** aufgetaucht — Dateien
aus gelöschten Entwürfen und Angeboten, die seit Juli liegen bleiben, weil
der Objektspeicher beim Löschen nicht mitkaskadiert. Dazu 22 Aufnahmen, die
über die neue 30-Tage-Frist gelaufen sind, und ein Baustellenfoto ohne
Angebot. Das Aufräumen dafür ist gebaut und getestet, es läuft aber erst mit
dem ersten erfolgreichen Cron-Lauf. Solange `CRON_SECRET` fehlt, bleibt alles
liegen.

**🟠 3. Live nachtesten, was seit dem 31.08. gebaut wurde.** Zuschläge in
Prozent, Übermessungshinweis im Kunden-PDF, neues Statusmodell, Konto
löschen — alles über Tests abgesichert, aber noch niemand hat es in der
laufenden App gesehen.

**🔵 4. Stripe-Konto aktivieren (neu, 03.09.2026).** Nebenfund von Head of
Legal beim Prüfen der Vertragspartner-Frage, vom Chief of Staff per direkter
Stripe-Kontoabfrage bestätigt: euer Stripe-Konto ist noch nicht
vollständig eingerichtet — `charges_enabled: false`, `payouts_enabled:
false`, `details_submitted: false`. Es fehlen konkret eine hinterlegte
Bankverbindung und die Bestätigung der Stripe-AGB. Ohne das kann selbst ein
technisch fertiger Checkout kein echtes Geld entgegennehmen. Das geht nur
über dein eigenes Stripe-Dashboard (dashboard.stripe.com → Konto
vervollständigen). Kein Gate-1-Blocker (betrifft nur zahlende Kunden, die
erst mit Gate 2 kommen), aber je früher erledigt, desto weniger Überraschung
kurz vor dem ersten echten Kunden. Dokumentiert unter 4.6 in
`docs/launch-readiness.md`.

---

## Offen

**🔵 DEPLOY — zwei fertige Datenschutz-Korrekturen freigeben (neu,
03.09.2026).** Du hattest gefragt, ob Stufe 3 (Impressum/Datenschutz-Fixes)
schon durch ist — ist sie: beide ursprünglichen Fixes (7.1, 7.2) sind live.
Beim Gegenchecken hat Head of Legal aber zwei weitere kleine Ungenauigkeiten
in der Datenschutzerklärung gefunden und bereits korrigiert und getestet
(`rechtstexte-hygiene.test.ts` 11/11 grün): (1) der Vertragspartner für
Stripe stand als „Stripe Inc." drin, korrekt ist „Stripe Payments Europe,
Limited" (Irland) — eure Stripe-Kontoabfrage zeigt `country: DE`, damit
entfällt sogar die Drittland-Klausel für Stripe; (2) im Kundendaten-Abschnitt
stand ein inhaltlicher Widerspruch (gleichzeitig „Auftragsverarbeitung" und
eine eigene Rechtsgrundlage für dieselben Daten), jetzt korrekt als reine
Auftragsverarbeitung (Verweis auf die AVV) formuliert. Beide Fixes sind
absichtlich noch nicht live — Rechtstexte gehen laut Team-Regel nur mit
deiner Freigabe raus. **Deine Entscheidung:** einfaches Ja, dann geht der
nächste Deploy von Head of Product Engineering raus (zusammen mit den
übrigen anstehenden Änderungen). Details in
`docs/chief-of-staff-legal-todos.md`, Abschnitt „Stufe 3".

**🔴 Oktober-Nachmittag: Gewerbe, Versicherung, Marken-Check.** Ersetzt
die beiden Punkte, die hier bis heute Abend standen („UG gründen —
Notartermin" und „Steuerberater — drei Fragen"). **Beide sind hinfällig**,
seit du dich am 03.09. für Einzelunternehmen jetzt / UG bei rund 20 Betrieben
entschieden hast (S-4 Teil 4, unten im Verlauf). Kein Notar, kein
Stammkapital, kein Geschäftskonto. Voller Plan mit Formulierungen und Links:
**`docs/legal-007-plan-fuer-sandy.md`**.

**Woche vom 05.10. — nach Legals Zeitplan zusammen ein Nachmittag:**

1. **Gewerbe anmelden**, online über das Berliner eMeldung-Portal, 15 €,
   20 Minuten. Tätigkeitstext hat Legal wörtlich vorformuliert (wichtig, damit
   keine Rückfrage zur Handwerksrolle kommt). Startdatum = Anmeldetag.
2. **ELSTER-Fragebogen**, kommt automatisch, Frist ein Monat. Das eine Kreuz,
   auf das es ankommt: **Kleinunternehmerregelung § 19 UStG — ja.**
3. **Versicherung beantragen** — exali/Markel, 1 Mio. €, ausgestellt auf dich
   als Einzelunternehmerin. **Das ist der wichtigste Punkt des ganzen Plans**,
   nicht die Rechtsform: Fehler aus dieser Phase bleiben dauerhaft deine
   persönliche Haftung, auch nach einer späteren UG. Die Police mit
   unbegrenzter Rückwärtsdeckung ist das, was das auffängt. Legal hat fünf
   Fragen für die Anfrage vorbereitet, darunter neu: ob die Police später auf
   eine UG umgeschrieben werden kann, ohne Vertragsbeginn und Rückwärtsdeckung
   zu verlieren. **Das ist die einzige Freigabe, die noch aussteht** — sag
   Bescheid, dann läuft es.
4. **Marken-Check, 10 Minuten:** einmal im DPMAregister und bei TMview
   nachschauen, ob jemand *anderes* „Sofortangebot" eingetragen hat. **Selbst
   anmelden: nein** — Legal rät ab (beschreibender Begriff, 290 € futsch bei
   Zurückweisung).

**Ein Steuerberater ist damit kein dringender Punkt mehr**, sondern optional:
für eine EÜR als Kleinunternehmerin brauchst du keinen. Die drei Fragen, die
hier standen, waren UG-Fragen und sind vorerst gegenstandslos. Was bleibt,
ist eine einzige, und die hat Zeit: ob sich der freiwillige Verzicht auf die
Kleinunternehmerregelung wegen des Vorsteuerabzugs lohnt — Legal schätzt die
Wirkung auf grob 25 € im Monat.

**🔴 Wann geht die Website online? — die Frage hat jetzt einen Preis.**
Bisher stand sie als „keine Ahnung, vermutlich wenn das Gewerbe angemeldet ist"
im Raum. Durch deinen SEO-Plan ist sie terminlich geworden: `sofortangebot.app`
zeigt aktuell nur die Warteliste, die eigentliche Seite liegt hinter einem
Schalter. **Solange sie dunkel ist, läuft die SEO-Uhr nicht** — und SEO braucht
nach Marketings eigener Einschätzung sechs bis zwölf Monate, bis überhaupt
etwas ankommt. Jeder Monat Verzögerung ist ein Monat später Wirkung, und zwar
am hinteren Ende, wo es weh tut.

**Was dafür spricht, früh online zu gehen:** die SEO-Uhr, und dass Blogartikel
ohne sichtbare Seite nichts bringen. **Was dagegen spricht:** Impressum und
Rechtstexte müssen stimmen, und dafür braucht es das Gewerbe (KW 41) — plus
die Preisumstellung auf 49 € (CoS-038), die noch nicht live ist.

**Mein Vorschlag zur Prüfung:** Zweistufig statt ganz oder gar nicht. Ab
Gewerbeanmeldung im Oktober die Seite mit korrektem Impressum und dem Blog
online nehmen, **ohne** die Anmeldung freizuschalten — dann läuft die SEO-Uhr,
während das Produkt weiter im geschlossenen Test bleibt. Ob das rechtlich und
technisch so geht, klärt Legal (CoS-L-003, Zusatzfrage Website) bzw. Product
Engineering. **Deine Entscheidung, sobald deren Antworten da sind** — ich sage
dir Bescheid.

**🔵 Buchhaltung: selbst machen oder abgeben?** Head of Finance hat beim
Umrechnen eine Bedingung sichtbar gemacht, die vorher in einer Zahl versteckt
war. Legals „0–800 €/Jahr" gilt nur, wenn du die laufende Buchhaltung selbst
führst (z. B. mit Lexware) und höchstens die EÜR prüfen lässt. Gibst du alles
an einen Steuerberater ab, liegt die belegte Spanne bei **1.000–2.500 €/Jahr**
— rund 60 € im Monat mehr, und der Break-even verschiebt sich um ein bis zwei
Monate. **Keine Eile:** Als Kleinunternehmerin mit einer EÜR ist das gut
selbst machbar, und du kannst jederzeit wechseln. Aber der Plan rechnet
aktuell mit 800 € — sag Bescheid, wenn du eher abgeben willst, dann zieht
Head of Finance die Zelle nach.

**🔵 Zwei Eingaben, mit denen du den Finanzplan am stärksten schärfst**
(direkt an Head of Finance, beide Zellen sind gelb und in einer Minute
geändert):

1. **Deine Grundlast in Stunden pro Monat** für Produkt und Verwaltung —
   Head of Finance nimmt 25 an. Du hast zwei Monate Erfahrung mit 15–20
   Stunden die Woche; du weißt besser als jeder von uns, wie viel davon
   *nicht* Vertrieb und Support ist. Diese eine Zahl entscheidet, ob das
   optimistische Szenario an deiner Kapazität scheitert oder nicht.
2. **Dein Bruttogehalt** — Head of Finance rechnet aus den 2.500 € netto auf
   48.000 € zurück, um den Grenzsteuersatz zu bestimmen. Wenn das deutlich
   daneben liegt, verschieben sich die B1-Schwellen. Die Zahl geht nur an ihn,
   nirgends sonst hin.

**🔵 Drei Fragen von Head of Marketing** (Kanalplan CoS-M-007 liegt vor —
sehr konkret, lohnt sich zu lesen, Abschnitt 0 bis 5):

1. **Empfehlungs-Anreiz — ja oder nein?** Vorschlag: „Ein Kollege, ein Monat
   geschenkt" — wer einen Kollegen bringt, der zahlend wird, bekommt einen
   Monat frei. Kostet 49 € Umsatz pro Empfehlung, hebt Mundpropaganda spürbar.
   Es ist eine Preisentscheidung, deshalb nicht eingerechnet — Finance führt
   es als Option im Plan.
2. **Dankeschön für den Dessau-Kontakt:** Marketing rät von Provision ab (er
   macht es als Freund von Clemens, Geld würde das kaputtmachen) und schlägt
   ein sichtbares Dankeschön nach den ersten drei Testnutzern vor (Abendessen
   o. ä.). Bestätigen oder ändern.
3. **Drehtage im Oktober:** Vorschlag drei Samstage, **10., 17., 24.10.**, je
   ~2 Stunden mit Clemens auf der Baustelle, 8–10 Hooks pro Tag — das ist der
   Vorrat für November und Dezember. Passt das mit Clemens' Baustellen?

**🔵 Rundung — kaufmännisch runden, ja oder nein?** Head of Product
Engineering hat das beim VOB-013-Fix (03.09.) als Nebenbefund gemeldet und
ausdrücklich **nicht** nebenbei mitgefixt, weil es Geld betrifft: Die
Rundungsfunktion `round2()` rundet Mengen, die exakt auf einer halben
Nachkommastelle landen, wegen eines Gleitkomma-Effekts nach unten statt nach
oben (eine Tür ergibt 1,275 m², heraus kommt 1,27 statt 1,28). Wirkung pro
Fall 0,01 in der Menge — winzig, aber es ist Geld, und die Funktion existiert
in **neun** eigenen Kopien im Projekt. **Deine Entscheidung:** kaufmännisch
runden (also 1,28) — ja oder nein? Danach braucht es einen eigenen sauberen
Durchgang über alle neun Stellen plus Nachtest durch den Prüfmeister.
Details: `docs/chief-of-staff-todos.md`, Abschnitt „CoS-036 erledigt".

**🔵 CoS-M-004 (Rest) — eine Design-System-Freigabe, Head of Marketing
wartet darauf, bevor er weiterbaut:**

**Freigabe neue Funktionsfarben** `--state-success` (#4F6B45) /
`--state-danger` (#A33A2A) — im PDF selbst als „Ergänzung ohne
CI-Grundlage, Freigabe durch Sandy offen" markiert.

**🔵 CoS-L-001 (Rest) — eine offene Entscheidung aus dem ersten Bericht von
Head of Legal & Compliance** (S-1, S-2, S-3, S-5 sind entschieden, siehe
Verlauf unten):

**S-4 — Rechtsform ENTSCHIEDEN am 03.09.2026: Einzelunternehmen jetzt, UG bei
rund 20 zahlenden Betrieben (Begründung in „S-4, Teil 4" am Dateiende).
Versicherung weiterhin offen. Der folgende Absatz ist der Stand vom 02.09. und
in Punkt (2) überholt.** Legal hat jetzt eine konkrete
Doppel-Empfehlung nachgereicht (02.09., zwei Abschnitte weiter unten in
dieser Datei, „S-4" und „S-4, Teil 2").** Kurzfassung davon: **(1)
Vermögensschaden-Haftpflicht sofort abschließen**, noch vor dem ersten
echten Testnutzer — konkreter Anbieter-Vorschlag: **exali IT-Haftpflicht,
Risikoträger Markel Insurance SE, 1.000.000 € Deckungssumme** (statt der
üblichen 250.000 €, wegen der Serienschadenklausel: ein systematischer
Rechenfehler bei z. B. 200 Betrieben gleichzeitig zählt als EIN
Versicherungsfall mit EINER Deckungssumme, nicht 200 einzelne). ~~**(2) Danach
die UG gründen — und zwar vor dem ersten *zahlenden* Kunden, nicht davor
und nicht danach** (§26 HGB: wer erst als Einzelunternehmerin Kunden
gewinnt und danach in eine UG umwandelt, haftet trotzdem noch 5 Jahre lang
mit Privatvermögen für die Altverbindlichkeiten — die Umwandlung schützt
dann nicht mehr rückwirkend).~~ **Punkt (2) ist zurückgenommen, und die
§-26-HGB-Begründung war zusätzlich falsch — siehe „S-4, Teil 4" am
Dateiende.** Kosten grob: UG ~300–480 € Notar/Handelsregister
+ praktisch mindestens 1.000 € Stammkapital, dazu ~2.000 € Zusatzkosten im
ersten Jahr, danach ~1.500–2.000 €/Jahr. **Wichtiger Zusatzpunkt von
Legal:** VOB-013 (bekannter, noch nicht gefixter Rechenfehler, siehe unten)
offen zu lassen UND zu wissen, dass er da ist, kann laut Legal den
Versicherungsschutz gefährden (Obliegenheitsverletzung) — ein Grund mehr,
VOB-013 vor Gate 1 zu fixen statt danach.

**Deine Entscheidung:** Anbieter und Deckungssumme für die Versicherung
freigeben (oder Alternativangebote einholen) — das ist der Teil, der noch
offen ist. Der UG-Zeitpunkt ist am 03.09.2026 entschieden: bei rund 20
zahlenden Betrieben. Volle Details,
Vergleichsangebote und die genaue Serienschaden-Begründung stehen in den
beiden „S-4"-Abschnitten weiter unten in dieser Datei.

**🔵 L7 — Kündigungs-Button, den es technisch noch nicht gibt.** In den AGB
(§6.2) steht, Kunden können „direkt in den Einstellungen" kündigen. Aktuell
funktioniert das aber nur über die komplette Konto-Löschung — es gibt
keinen separaten „Abo kündigen"-Weg. Das ist ein Widerspruch zwischen dem,
was den Kunden versprochen wird, und dem, was das Tool tatsächlich kann.
**Deine Entscheidung:** Vor Gate 1 einen echten Kündigen-Button bauen
(kleiner Aufwand laut Head of Product Engineering, reine Umsetzungsfrage —
aber der Startschuss dafür ist eine Prioritäts-Entscheidung von dir, da es
in keinem bisherigen Scope stand), oder die AGB-Formulierung erstmal auf
das anpassen, was heute tatsächlich geht (Löschung).

**🔵 VOB-006 — fünf widersprüchliche Werte für „ab wann gilt ein Raum als
hoch" (Höhenzuschlag).** Im System stehen aktuell nebeneinander: Code 3,00 m
· Katalog Maler 2,80 m/4,00 m · Katalog Trockenbau 3,25 m/4,50 m · Katalog
Putz 3,00 m. Head of Product Engineering hat bestätigt, das ist kein
Darstellungsfehler, sondern wirklich fünf verschiedene Schwellen im Code
und in den Katalogen. Das ist eine Preis-Entscheidung, keine technische —
nur du kannst festlegen, welcher Wert (oder welche Werte je Gewerk) korrekt
sind. **Deine Entscheidung:** einen einheitlichen Wert je Gewerk festlegen
(am einfachsten mit Legal/Prüfmeister kurz abstimmen, was VOB-üblich ist),
danach setzt Head of Product Engineering das im Code um.

**🔵 Fünf Zuschlagssätze bestätigen.** Raumhöhe 15 %, Altbau 20 %,
Denkmalschutz 30 %, bewohnt 10 %, schwieriger Untergrund 10 %. Die Zahlen
stehen bisher auf Head of Product Engineerings eigener Einschätzung, nicht
auf deiner Freigabe. **Deine Entscheidung:** so bestätigen oder anpassen.

**🔵 Fliesen-Verschnitt (10 %) — fest im Code oder in den Katalog?** Maler
und Bodenleger holen ihren Verschnitt-Wert aus dem Katalog (also
anpassbar), Fliesen haben den Wert stattdessen fest im Code stehen.
**Deine Entscheidung:** so lassen, oder in den Katalog verschieben, damit
er genauso änderbar ist wie bei den anderen Gewerken.

**🔵 Kork und Teppich: 0 % Verschnitt.** Bewusst so gebaut (kein Verschnitt
bei diesen Belägen), aber nie ausdrücklich von dir abgesegnet.
**Deine Entscheidung:** bestätigen oder korrigieren.

**🔵 VOB-011 — ca. 10–54 € für echte DIN/VOB-Normtexte, drei Optionen.**
Legal braucht die echten Normtexte (18363/18365 u. a.), um mehrere offene
VOB-Fragen (u. a. VOB-006 oben) sauber zu klären, statt sich auf
Sekundärquellen zu verlassen. Drei Optionen liegen vor: **Bibliothekskarte
(~10 €)**, **komplettes VOB-Werk kaufen (~54 €)**, oder **nicht kaufen** und
mit den bisherigen Quellen weiterarbeiten. **Deine Entscheidung:** welche
der drei Optionen — Details in `docs/vob-angebot-abstimmung.md`.

**🔵 VOB-012 (neu, 02.09.) — Türbreiten-Abzug bei Sockelleisten.** Prüfmeister
hat beim Durchrechnen der 28 Testfälle festgestellt, dass diese Frage bisher
in praktisch jeder neuen Soll-Lösung als offene Variable auftaucht: wird die
Breite von Türöffnungen bei der Sockelleisten-Längenberechnung abgezogen
(wie bei anderen Öffnungen üblich) oder nicht? Aktuell nicht konsistent
geklärt. **Deine Entscheidung:** abziehen oder nicht — Details in
`docs/pruefmeister-testfaelle.md`. (Nicht zu verwechseln mit VOB-013 weiter
unten im Dringend-Bereich des Dashboards — das ist ein echter Rechenfehler,
keine Preis-Entscheidung, und liegt bei Head of Product Engineering, nicht
bei dir.)

**Erledigt, nicht mehr offen:** Der Datenleck-Altfall von oben (öffentlich
lesbare Debug-Tabelle, 07.–17.08.) ist inzwischen vollständig abgeschlossen
— Platform hat die Fakten geliefert, Legal hat bewertet: **keine Meldung
nötig**, weder an die Aufsichtsbehörde noch an Kunden. Grund: null
protokollierte Zugriffe während der zehn Tage, und alle Konten, die in dem
Zeitraum überhaupt etwas in die Tabelle geschrieben haben, waren deine
eigenen (Haupt-Account + zwei inzwischen gelöschte Testkonten) — es gab zu
dem Zeitpunkt schlicht noch keine echten Nutzer. Volle Doku in
`docs/legal-004-vorfallsdokumentation-cc01.md`. Diese Zeile wandert beim
nächsten Aufräumen in „Entschieden" unten.

Stand 31.08.2026 sonst: Alle übrigen vorgelegten Punkte sind entschieden —
siehe Verlauf unten (inkl. der Buchhaltungs-Gate-Frage, siehe neueste
Zeile). Die weiterhin große, laufende Abwägung ist keine einzelne
Ja/Nein-Frage, sondern die Gate-1-Gesamtfrage „ist das Tool reif für erste
echte Testnutzer?" — die läuft über `docs/launch-readiness.md` (Stand
31.08.: ≈ 33 % gegen den vollen Scope, nach der Hochstufung von 11.5 auf
G1; volle Neuberechnung nach dem heutigen Sync steht noch aus). Die
Wettbewerbslandschafts-Frage aus `vision-strategie.md` ist im
strategischen Check-in vom 31.08. beantwortet worden (siehe dort, „Geklärt
31.08.2026") — kein offener Punkt mehr.


---

## Entschieden (Verlauf)

| Datum | Entscheidung | Ergebnis | Quelle |
|---|---|---|---|
| 2026-09-03 | CoS-L-003: Erst Einzelunternehmen anmelden und später in die UG überführen, oder direkt UG? | **Direkt UG, so wenig Aufwand wie möglich, Verzicht auf die 17 Altbelege seit Mai** (bleiben Privatausgaben). Legal hat den Plan darauf umgestellt: Bargründung per Musterprotokoll, 4–6 Wochen, Steuerberater parallel statt davor. Nächster Schritt: Notartermin (nur Sandy) | `docs/chief-of-staff-legal-todos.md` CoS-L-003, „geänderter Plan“ |
| 2026-09-03 | Launch-Zeitplan: Thailand (02.11.–03.12.) kollidiert mit dem bisher angedachten Fenster „01.11./01.12.“ — Oktober anpeilen oder nach Thailand planen? | **Nach Thailand.** Gate 1 (begleitete Testnutzer) ab **Anfang Dezember**, öffentlicher Launch (Gate 2) **Januar 2027**. Oktober wird für Produkt, Content-Vorrat und Vorbereitung genutzt. Clemens ist im November ebenfalls in Thailand — alle Drehtage und der Dessau-Kontakt müssen vor dem 01.11. laufen | `docs/kalender.md` |
| 2026-09-03 | Startseite zeigt nur die Warteliste, volle Landingpage verborgen — gewollt? | **Ja, bewusst — aber offen, wann die Website online geht:** „vermutlich erst wenn Gewerbe angemeldet etc., oder nicht“. Damit hängt der Zeitpunkt an der Rechtsform-Reihenfolge; Head of Legal beantwortet unter CoS-L-003 zusätzlich, ab wann die volle Landingpage mit Preisen rechtlich live sein darf | `docs/chief-of-staff-legal-todos.md` CoS-L-003 |
| 2026-09-03 | Finanzplan CoS-F-003: Welchen Netto-Bedarf pro Monat soll Head of Finance für die Frage „ab wann kann ich die Anstellung loslassen“ ansetzen? | **Mindestens 2.500 € netto** (Sandys aktuelles Nettogehalt). Als **Untergrenze** in den Plan gegeben, nicht als Zielgröße — Head of Finance rechnet zusätzlich eine realistische Schwelle mit Puffer und Rücklagen, weil in der Selbstständigkeit der Arbeitgeberanteil zur Sozialversicherung wegfällt | `docs/chief-of-staff-finance-todos.md` CoS-F-003 |
| 2026-09-03 | Head of Finance, offen seit 19.08.: Ist das Claude-Pro-Abo über Apple (22 €/Monat) geschäftlich oder privat? | **Geschäftlich.** Wandert damit in die Betriebskosten. Zusatzhinweis von Sandy: es gibt bis heute **kein angemeldetes Gewerbe** — die Ausgabe ist also eine vorweggenommene Betriebsausgabe, siehe eigener offener Punkt „Gewerbeanmeldung“ | `docs/chief-of-staff-finance-todos.md` CoS-F-001 |
| 2026-09-03 | Head of Finance, offen seit 19.08.: Laufen bei Supabase ungenutzte Projekte mit (5 Referenzen bei 2 dokumentierten)? | **Erledigt — Sandy hat die übrigen Projekte selbst gekündigt.** Kein Platform-Ticket nötig. Offen bleibt nur noch die andere Hälfte der Frage: wie stark die Betriebskosten mit steigender Nutzerzahl wachsen — das ist keine Sandy-Frage, sondern an Platform geroutet (CoS-P-008) | `docs/chief-of-staff-finance-todos.md` CoS-F-001 |
| 2026-09-03 | **Preismodell komplett neu** — bisherige Preise (22 €/17 €/3 Angebote frei, DC-001) von Sandy verworfen, Chief of Staff hat auf Basis von Zielgruppe, Mehrwert und Wettbewerb neu hergeleitet | **Freigegeben („ja steht“), vollständig:** 49 € netto/Monat pro Betrieb, unbegrenzt Angebote, monatlich kündbar · kein Dauer-Gratis-Tarif, stattdessen 14 Tage voller Test ohne Kreditkarte · Gründerpreis 29 €/Monat **dauerhaft** für die ersten 25 zahlenden Betriebe gegen Feedback-Zusage · **keine** Staffelung nach Nutzer-/Mitarbeiterzahl · Jahresabo (490 €) erst ab Gate 2 · Stufe 2 „Betrieb“ ca. 89 € erst mit Buchhaltungsanbindung + Mehrbenutzer. Umsetzung geroutet: CoS-038 (Produkt), CoS-P-007 (Stripe), CoS-L-002 (AGB/Preisangaben/Steuer), CoS-F-002 (Marge) | `docs/preismodell.md` |
| 2026-09-03 | 10.2-Folgefrage: WhatsApp Business (Abwesenheits-Antwort möglich) oder private Nummer für den Feedback-Kanal (10.1)? | **Private Nummer.** Damit fällt eine technische Abwesenheits-Antwort weg. Ersatz: eine einmalige Willkommensnachricht pro neuem Testnutzer deckt Notfallplan (10.2) und Reaktionszeit-Erwartung (10.4) gemeinsam ab, Text fertig formuliert in `launch-readiness.md` 10.2 | `docs/launch-readiness.md` 10.2/10.4 |
| 2026-09-03 | 8.9-Folgefrage: Liest Sandy ihr Sentry-Postfach (`einfachanfrage@outlook.com`) aktiv mit? | **Noch nicht, aber ab Gate 1 (erster echter Testnutzer) ausdrücklich zugesagt** — genau der Zeitraum, in dem der Punkt zählt | `docs/launch-readiness.md` 8.9 |
| 2026-09-03 | 10.1: Über welchen Kanal sollen Testnutzer Feedback/Bugs melden? | **WhatsApp direkt an Sandy.** Niedrigste Hürde für Handwerker, sofort sichtbar. Noch niemandem kommuniziert — es gibt noch keine Testnutzer | `docs/launch-readiness.md` 10.1 |
| 2026-09-03 | 10.4: Welche Reaktionszeit-Erwartung wird an Testnutzer kommuniziert? | **„Meist binnen 24 Stunden."** Noch nirgendwo (z. B. Onboarding-Text) tatsächlich kommuniziert — es gibt noch keinen Testnutzer | `docs/launch-readiness.md` 10.4 |
| 2026-09-03 | 8.9 + 8.11: Wie soll bei einem technischen Ausfall reagiert werden (Alarm + Rollback)? | **Sentry-Alert an Sandy, Rollback manuell bei Bedarf.** Bei der Prüfung stellte sich heraus: beide Mechanismen existieren bereits — Sentrys Standard-Regel mailt aktive Mitglieder automatisch, Vercels Rollback ist eine eingebaute Pro-Plan-Funktion. Offen bleibt nur, ob Sandy das Sentry-Postfach aktiv mitliest (siehe „Offen" oben) | `docs/launch-readiness.md` 8.9, 8.11 |
| 2026-09-03 | 10.2: Braucht es einen Notfallplan, falls Sandy nicht erreichbar ist? | **Automatische Antwort**, die Testnutzer informiert, dass eine Antwort dauern kann. Noch nicht eingerichtet — braucht WhatsApp Business, siehe „Offen" oben | `docs/launch-readiness.md` 10.2 |
| 2026-09-03 | CoS-037, Teil 2: 6.8 HTTPS/HSTS — Domain jetzt schon bei `hstspreload.org` eintragen (macht den Header-Fix zu 100 %, legt aber für lange Zeit fest, dass JEDE jetzige und künftige Subdomain zwingend HTTPS sprechen muss) oder zurückstellen? | **Zurückstellen.** „hm ok dann also lieber später?" — Sandy folgt der Empfehlung des Chief of Staff. Die Header-Erweiterung selbst (`includeSubDomains`/`preload` im Header, ohne die Preload-Liste) läuft trotzdem sofort über Head of Product Engineering. 6.8 bleibt danach bewusst bei ~97 %, nicht 100 % — mit Begründung dokumentiert, kein vergessener Rest. Wiedervorlage: sobald absehbar ist, welche Subdomains das Projekt überhaupt bekommt (z. B. `api.`, `staging.`), dann neu entscheiden | `docs/chief-of-staff-todos.md` CoS-037, `docs/launch-readiness.md` 6.8 |
| 2026-09-02 | Lernendes Wörterbuch: ausbauen oder abschalten? Die Wörterbuch-Ansicht in den Einstellungen zeigte Begriffe an, die das Tool gelernt haben sollte — gelernt hat es nie (ein Eintrag seit dem 16.06., bei hunderten Aufnahmen), weil die Abfrage beim Erkennen und das Speichern von Bestätigungen keinen Aufrufer hatten | **Abschalten.** Ansicht aus den Einstellungen entfernt, die beiden Routen und `nutzer-learning.ts` gelöscht (211 Zeilen ohne Aufrufer). Die Tabelle `nutzer_begriffe` bleibt — die Funktion ist zurückgestellt, nicht gestrichen; die Umsetzung steht in der Git-Historie | Head of Product Engineering, `docs/chief-of-staff-todos.md` |
| 2026-09-01 | S-1: FAQ-Korrekturen (G2/G3) auf der Landingpage freigeben? | **Erledigt sich anders — komplette Landingpage wird neu gemacht.** Statt die alten FAQ-Sätze zu patchen, bekommt die neue Seite von Anfang an die korrekten Fakten (Server-Standort/Unterauftragnehmer, Übermessungs-Beschreibung). Chief of Staff hat Head of Marketing entsprechend informiert. Einziges Risiko: falls der Rebuild sich über Gate 1 hinauszieht, bleiben die fehlerhaften Sätze bis dahin live — im Auge behalten | `docs/chief-of-staff-marketing-todos.md` CoS-M-006 |
| 2026-09-01 | S-2: zwei neue PDF-Texte freigeben (Übermessungshinweis im Kunden-PDF, Widerrufs-Checkbox für vorzeitigen Arbeitsbeginn)? | **Ja, beide freigegeben.** Head of Product Engineering kann umsetzen (CoS-026, Punkte G5/G6) | `docs/legal-001-bestandsaufnahme.md`, `docs/chief-of-staff-todos.md` CoS-026 |
| 2026-09-01 | S-3: Müssen Endkunden über KI-Einsatz informiert werden? | **Nein — Legals Einschätzung übernommen**, keine Rechtsgrundlage dafür. Wichtig zur Klarstellung: das ist eine andere Frage als der interne „Bitte vor dem Versenden prüfen"-Hinweis für den Handwerker selbst (das ist R3, läuft bereits separat bei Product Designer, siehe `design-check.md` — genau der von Sandy gewünschte „wurde von KI erstellt, kann Fehler enthalten"-Reminder). AI-Act-Teilaspekt (Art. 50 Abs. 2) später extern bestätigen lassen | `docs/legal-001-bestandsaufnahme.md` §A4, `docs/design-check.md` |
| 2026-09-01 | S-5: ca. 150 € für echte DIN-Normtexte (18363/18365) freigeben? | **Ja, zeitnah.** Head of Legal kauft, Head of Finance erfasst die Ausgabe | `docs/vob-angebot-abstimmung.md` VOB-011, `docs/chief-of-staff-finance-todos.md` |
| 2026-08-31 | CoS-M-005: DER Slogan für Sofortangebot — kurz, knapp, sofort verständlich auch ohne Vorwissen über das Produkt | **„Aufmaß fertig. Angebot fertig."** Sandys finale Entscheidung. Beschreibt den kompletten Ablauf in zwei parallelen Kurzsätzen (Bricolage-Grotesque-Statement-Stil, Punkt, sentence case) — für jeden sofort verständlich, auch ohne Vorwissen: Aufmaß nehmen, Angebot ist fertig. Löst „Gerechnet, nicht geschätzt." als Haupt-Slogan ab, die als sekundäre Differenzierungs-Zeile weiterleben kann, sobald das Produkt schon bekannt ist | Sandy direkt im Chat, `docs/chief-of-staff-marketing-todos.md` CoS-M-005 |
| 2026-08-31 | CoS-M-004, Punkt 1: Tonalität „Sie" oder „du"? Das neue Design-System-PDF hatte „förmliches Sie — nie du" festgelegt, im Widerspruch zum tatsächlich im Produkt gelebten „du" | **Immer per „du"** — „imer per du!!!!!!!!!" Klare, eindeutige Entscheidung. PDF-Vorgabe war ein Fehler und wird korrigiert; Produkt und Social-Media-Texte bleiben wie bisher konsequent beim „du". Head of Marketing kann ab sofort auf „du" weiterbauen | Sandy direkt im Chat, `docs/chief-of-staff-marketing-todos.md` CoS-M-004 |
| 2026-08-31 | Buchhaltungssoftware-Anbindung (11.5, Lexware/sevDesk): G2 (nach dem Launch) oder G1 (Teil des ersten Launches)? Frage entstand aus dem wöchentlichen Strategie-Check-in — Sandy positioniert Sofortangebot bewusst über die einfache Anbindung an bestehende Buchhaltungstools kleiner Betriebe, nicht über ein eigenes CRM | **G1** — „ja ist gate 1!" Kein Nice-to-have, sondern Teil des Kern-Differenzierungsversprechens für die Zielgruppe (kleine Betriebe, 1–10 MA, die z. B. Lexware/sevDesk nutzen). Ziel bleibt eine Anbindung in 2–3 einfachen Klicks | `docs/launch-readiness.md` 11.5, `docs/vision-strategie.md` (Geklärt 31.08.2026) |
| 2026-08-31 | CoS-019 (Teil 1): „Erschwerniszuschlag Handabbruch" (25 %) und „Zuschlag schwierige Zufahrt" (40 %) — zusammenlegen zu einem Posten, oder getrennt lassen (beide können gleichzeitig auf ein Angebot kommen)? | **Getrennt lassen — „ja beides".** Beide Posten bleiben eigenständig im Katalog, können bei Bedarf auch gleichzeitig auf ein Angebot kommen (z. B. wenn ein Auftrag sowohl von Hand abgebrochen werden muss als auch schlecht mit Fahrzeug erreichbar ist). Keine Katalog-Änderung nötig, Ticket damit vollständig geschlossen. | `docs/chief-of-staff-todos.md` CoS-019 |
| 2026-08-31 | CoS-019 (Teil 2): Rubriken „Anfahrt & Organisation"/„Anfahrt & Planung"/„Anfahrt & Vorbereitung" vereinheitlichen? | **Ja, vereinheitlichen.** | `docs/chief-of-staff-todos.md` CoS-019 |
| 2026-08-31 | PM-008/PM-015: Erschwerniszuschlag-Einheit — generierte Positionen nutzen „Pauschale", Katalog nutzt „%", deshalb blockierter Preisabgleich. Welche Einheit soll gelten? | **Prozent.** Katalog ist die Referenz, die Generierung wird angepasst. | `docs/pruefmeister-testfaelle.md` PM-008/PM-015 |
| 2026-08-31 | PM-024 (neu, 30.08., noch ohne eigenes Ticket): bei MEHREREN hohen Räumen (>3m) im selben Angebot — Höhenzuschlag je Raum einzeln oder einmal fürs ganze Angebot? | **Jeder Raum einzeln.** Sandys Begründung: einzelne Räume können den Zuschlag zu Recht nicht bekommen, z. B. wegen abgehängter Decke — eine Pauschale fürs Ganze würde das verschlucken. | `docs/pruefmeister-testfaelle.md` (PM-024) |
| 2026-08-31 | PM-011: dürfen „schwieriger Untergrund" und „Altbau" gleichzeitig neben einer Q2-Spachtel-Position berechnet werden, oder schließt sich das aus? | **Ja, können gleichzeitig kommen.** | `docs/pruefmeister-testfaelle.md` PM-011 |
| 2026-08-31 | DC-033/CoS-022: sollen die 4 Alt-Angebote ohne echte Nummer nachträglich eine bekommen? | **Nein, so lassen.** Begründung: bisher gab es keine echten Nutzer, alle betroffenen Angebote wurden bislang ausschließlich von Sandy selbst angelegt. | `docs/chief-of-staff-todos.md` CoS-022 |
| 2026-08-31 | DC-042, Punkt 1: toter `viewed`-Status — ersatzlos streichen oder als echtes „Kunde hat geöffnet"-Feature bauen? | **Streichen.** | `docs/dc-042-status-modell-neu-denken.md` |
| 2026-08-31 | DC-042, Punkt 2: Wortwahl für den heutigen Status „Offen" — Vorschlag „Beim Kunden" oder Alternative? | **„Beim Kunden".** | `docs/dc-042-status-modell-neu-denken.md` |
| 2026-08-31 | DC-042, Punkt 3: soll „Abgelehnt" zwischen „Kunde hat aktiv Nein gesagt" und „nie wieder gehört" unterscheiden, oder ein Status bleiben? | **Ja, unterscheiden.** | `docs/dc-042-status-modell-neu-denken.md` |
| 2026-08-31 | DC-042, Punkt 4: „Beim Kunden seit X Tagen" auf Basis des vorhandenen `created_at` (ungenau, kein DB-Aufwand) oder neues `sent_at`-Feld (genau, Migration nötig)? | **Neues `sent_at`-Feld — genaue Variante, Migration freigegeben.** | `docs/dc-042-status-modell-neu-denken.md` |
| 2026-08-31 | DC-040-Folgefrage: soll „sind Türen/Fenster schon raus?" auch bei EINZELNEN Räumen gefragt werden (bisher nur bei „ganze Wohnung")? | **Ja, auch bei einzelnen Räumen fragen** — gezielt dann, wenn der Nutzer direkt eine Wand- oder Deckenfläche nennt (nicht nur bei Roh-Maßen, aus denen die Fläche erst berechnet wird). Auslegung von Sandy im Chat ausdrücklich bestätigt. | Head of Product Engineering, vormals in dieser Datei unter „Offen" |
| 2026-08-31 | DC-043, Punkt 1: Dashboard-Neugestaltung — Richtung A „Fokus & Dringlichkeit" oder B „Warm & persönlich" oder Mischung? | **B — warm und persönlich.** (War laut Sandy bereits vorher direkt entschieden, hier zur Vollständigkeit nachgetragen.) | `docs/dc-043-dashboard-und-nav-neu-gedacht.md` |
| 2026-08-31 | DC-043, Punkt 2: Hero-Button oder FAB (schwebendes Mikrofon-Symbol) als einziger Weg zu „Aufmaß starten"? | **FAB bleibt.** (Ebenfalls bereits vorher direkt entschieden.) | `docs/dc-043-dashboard-und-nav-neu-gedacht.md` |
| 2026-08-31 | DC-043, Punkt 3: „Start" (Mobile) oder „Dashboard" (Desktop) als einheitlicher Name? | **„Start", einheitlich für Mobile und Desktop.** | `docs/dc-043-dashboard-und-nav-neu-gedacht.md` |
| 2026-08-31 | CoS-013: Go für einen echten Git-Workflow bei `docs/`-Dateien, nach dem sechsten Datei-Korruptionsvorfall? | **Ja, Go erteilt.** | `docs/chief-of-staff-todos.md` CoS-013 |
| 2026-08-29 | CoS-020: toten Filter für Tür-/Fensterfragen wiederbeleben (weniger Fragen, stille Standard-Annahme) oder löschen (weiter fragen)? | **Löschen — es wird gefragt.** Ersatzlos entfernt, `tsc` sauber, Suite grün (49 Dateien / 875 Tests). Der Filter erreichte die echten Fragen ohnehin nicht mehr; wiederbeleben hätte auch die neue DC-040-Rückfrage mit unterdrückt | `docs/chief-of-staff-todos.md` CoS-020 |
| 2026-08-16 | DC-001: Preismodell + Gewerke-Versprechen | 22 €/Monat Standard, 17 €/Monat Jahresabo, 3 Angebote/Monat kostenlos; „Maler & Bodenleger" statt „18 Gewerke" | `docs/design-check.md` DC-001 |
| 2026-08-17 | CoS-009: Head-of-IT-Rolle splitten? | Ja — aufgeteilt in Head of Product Engineering + Platform & Integrations Engineer | `docs/chief-of-staff-todos.md` CoS-009 |
| 2026-08-18 | CoS-M-001: neue CI-Richtung „Gerechnet, nicht geschätzt" | Bestätigt (direkt mit Sandy über mehrere Feedback-Runden verfeinert): Gelb-Nuance `#D9A400` testen, Überschriften Bricolage Grotesque, Mono-Zahlenschrift nur für berechnete Maße (nicht Preise), Emoji auf Landingpage durch eigenes Werkzeug-Icon-Set ersetzt (Marketing-Scope, Produkt-UI bleibt bei Lucide), neues Logomark (Maßband-Symbol, finale Version von Sandy selbst geliefert), warmes Off-White auch als Text-/Symbolfarbe auf Dunkel. Umsetzung folgt in Schritt 5 (Umsetzungsplan) | `docs/marketing-ci.md`, `docs/moodboard.html`, `docs/chief-of-staff-marketing-todos.md` CoS-M-001 |
| 2026-08-18 | PM-008/DC-024: Datenmodell für Wand-/Fassaden-Objekte (`modus: 'wand'`) — betrifft den Live-Berechnungspfad fertiger Angebote, deshalb Go nötig statt blinder Umsetzung | Go erteilt (direkt an den Designer, Konzept „Wand-Chip" lag zu dem Zeitpunkt schon vor). Head of Product Engineering setzt jetzt den `'wand'`-Zweig um (Länge/Höhe/Türen/Fenster, keine Breite/Bodenfläche; Bearbeiten-Ansicht zusätzlich aus `waende[]`; Fläche = Länge × Höhe − Öffnungen). Diese Zeile trage nachträglich ich (Product Designer) ein, war nicht vorher als „Offen" hier gelistet — Chief of Staff bitte gegenlesen | `docs/design-check.md` DC-024, `docs/pruefmeister-testfaelle.md` PM-008 Nachtest 5 |
| 2026-08-20 | CoS-002: Bestätigungskarte-Vertrauensproblem („Karte ≠ Berechnung") — nach zweimal zurückgestelltem Auftrag (16.08. dokumentiert ohne Auftrag, 19.08. spontanes „ok los" wieder zurückgezogen, weil Umsetzung komplizierter war als gedacht) | Endgültig aktiviert: „das soll endgültig gefixt werden" — höchste Priorität im Projekt, vor Live-Test-Verifikation anderer bereits gebauter Fixes. Head of Product Engineering soll einen konkreten Umsetzungsvorschlag mit Optionen/Aufwand/Risiko liefern | `docs/chief-of-staff-todos.md` CoS-002 |
| 2026-08-20 | CoS-002, Architektur-Wahl: Head of Product Engineering hat Option 1 (echte Single-Source-of-Truth, 3 Schritte, ~2–3 Wochen) + Option 2 (Sofort-Zwischenlösung, 1–2 Tage) vorgeschlagen (`docs/cos-002-architektur-vorschlag.md`) | **Option 2 sofort + Option 1 komplett (alle 3 Schritte).** Zusätzliche Bedingung von Sandy: Schritt 3 (Geld-Pfad) muss vollständig fertig sein, bevor der erste echte Testnutzer ans Tool darf — Voraussetzung für den Beginn von Gate 1, nicht nur wünschenswert. Zwei Nebenfunde (manuelle Positions-Änderungen vs. Neu-Berechnung; kaputtes Kosten-Logging seit 20.07.) als eigene kleine Tickets | `docs/chief-of-staff-todos.md` CoS-002, `docs/cos-002-architektur-vorschlag.md` |
| 2026-08-21 | CoS-002 Schritt 3: reicht die Umsetzung nur für den Einzelaufnahme-Fall für Gate 1, oder soll auch der Mehrfach-Aufnahmen-Fall geschlossen werden? | **„mach komplett rund also das auch noch schließen"** — auch der Mehrfach-Aufnahmen-Fall soll denselben doppelten KI-Aufruf vermeiden. Head of Product Engineering hat das über einen spekulativen Vorab-Kombi-Aufruf umgesetzt (kein Merge einzelner Caches — Korrektheits-Risiko —, sondern derselbe kombinierte Aufruf nur vorgezogen). Damit ist Schritt 3 in beiden Fällen fertig | `docs/chief-of-staff-todos.md` CoS-002 |
| 2026-08-21 | PM-021-Folgefrage: soll die VOB-Übermessungsregel für Maler-Wandflächen (kleine Fenster/Türen bis 2,5 m² nicht abziehen) automatisch für alle gelten, oder per Onboarding-Frage + Einstellungen-Schalter? | „wenn du sagst es ist gängig, dann machs für alle direkt so" — automatisch für ALLE Malerangebote, kein Einstellungen-Schalter, kein Onboarding-Schritt, dafür sichtbarer Hinweistext in den Positions-Annahmen. Ändert die berechnete Wandfläche (tendenziell nach oben) für praktisch jedes künftige Malerangebot mit normalgroßen Öffnungen — gewollte Konsequenz, kein Fehler. Prüfmeister ausdrücklich informiert: eigene Soll-Lösungen müssen die Regel ab sofort mitrechnen | `docs/pruefmeister-testfaelle.md`, Abschnitt „VOB-Übermessungsregel für Anstricharbeiten" (Dateiende) |
| 2026-08-25 | DC-034: Zwei getrennte Foto-/Notiz-Systeme im Angebot (Aufnahme-Fotos vs. „Notizen & Fotos"-Tab) — beibehalten, entfernen, oder zusammenlegen? Product Designer hatte bewusst neutral nur den Ist-Zustand dokumentiert, keine eigene Empfehlung | „ja so machen wie von dir vorgeschlagen" — nicht ersatzlos streichen (echter Bedarf: Vorher-Zustand-Dokumentation im Gewerbe), aber zu einem System zusammenlegen: Aufnahme-Fotos bekommen denselben „ins PDF"-Schalter wie der heutige Tab, der separate zweite Upload-Weg entfällt. Interne Notiz bleibt als eigene, klar benannte Mini-Funktion (nie im PDF) — anderer Zweck als Fotos. Umsetzung an Head of Product Engineering (Datenmodell/PDF) + Product Designer (UI) übergeben | `docs/design-check.md` DC-034, `docs/chief-of-staff-todos.md` CoS-021 |

---

## S-4 — Rechtsform und Versicherung: Empfehlung des Head of Legal & Compliance (2026-09-02)

Sandy hat direkt gefragt: Einzelunternehmen oder UG? Hier meine Empfehlung mit
den Zahlen dahinter. **Vorbehalt vorweg:** Die Haftungsseite ist meine; die
Steuerseite gehört einer Steuerberaterin. Die Zahlen unten sind recherchiert,
aber keine Steuerberatung.

### Kurzfassung

**Beides ja — aber nicht gleichzeitig und nicht in der Reihenfolge, die man
erwartet.**

1. **Vermögensschaden-Haftpflicht: sofort**, noch vor dem ersten echten
   Testnutzer. Kostet wenig, wirkt sofort, deckt genau unseren Hauptfall.
2. **UG: ja — und der richtige Zeitpunkt ist vor dem ersten *zahlenden*
   Kunden.** Nicht heute, nicht später. Der Grund steht unter „Der Punkt, auf
   den es ankommt".
3. Bis dahin ist das Einzelunternehmen in Ordnung, weil ohne Nutzer keine
   Verbindlichkeiten entstehen.

### Warum das Risiko hier untypisch ist

Bei einer normalen Solo-Selbständigkeit ist das Haftungsrisiko ungefähr so groß
wie der Auftrag: ein Kunde, ein Projekt, ein begrenzter Schaden. **Hier nicht.**
Ein systematischer Rechenfehler in der Engine wirkt auf alle Nutzer
gleichzeitig, und der Schaden entsteht nicht bei uns, sondern in deren eigenen
Werkverträgen — Beträge, mit denen unser Abo-Preis nichts zu tun hat.

Bei 200 Betrieben mit durchschnittlich 5.000-€-Aufträgen ist ein Fehler, der
zwei Monate unentdeckt bleibt, sechsstellig, während der Umsatz vierstellig ist.
**Diese Asymmetrie ist das ganze Argument.** Sie ist nicht theoretisch: In
`pruefmeister-testfaelle.md` stehen mehrere Fehler genau dieser Bauart, und
VOB-013 ist einer, der heute im Code steckt.

### Was die UG leistet und was nicht

| | |
|---|---|
| **Gedeckt** | Vertragshaftung gegenüber Nutzern — also genau unser Fall. Schadensersatz wegen fehlerhafter Software richtet sich gegen das Gesellschaftsvermögen, nicht gegen das Privatvermögen |
| **Gedeckt** | DSGVO-Bußgelder gehen nach Art. 83 gegen die Gesellschaft |
| **Nicht gedeckt** | Eigenes deliktisches Handeln (§ 823 BGB) — trifft die handelnde Person immer |
| **Nicht gedeckt** | Persönlich übernommene Bürgschaften und Garantien. Banken und Vermieter verlangen sie bei dünner Kapitaldecke regelmäßig |
| **Nicht gedeckt** | Innenhaftung als Geschäftsführerin (§ 43 GmbHG), etwa bei verspäteter Insolvenzanmeldung |
| **Fällt weg bei** | Vermischung von Privat- und Firmenvermögen |

Für unser Szenario ist die erste Zeile die entscheidende, und sie greift voll.

### Der Punkt, auf den es ankommt — § 26 HGB

Das ist das Argument, das die Zeitfrage entscheidet, und es wird meistens
übersehen:

**Die Haftungsbeschränkung wirkt nur nach vorne.** Wechselt man später von
Einzelunternehmen zu UG, haftet die frühere Inhaberin für alles, was **vor** dem
Wechsel entstanden ist, nach § 26 HGB noch **fünf Jahre persönlich weiter** —
und die neue UG haftet nach § 25 HGB bei Firmenfortführung zusätzlich als
Gesamtschuldnerin mit.

Praktisch heißt das: Ein Rechenfehler, der heute im Code steckt und in acht
Monaten bei einem Kunden auffliegt, ist eine Verbindlichkeit aus der
Einzelunternehmer-Zeit. Eine UG, die es dann längst gibt, hilft dagegen nicht.
**Wer die Rechtsform erst wechselt, wenn es weh tut, wechselt zu spät.**

Deshalb: vor dem ersten zahlenden Kunden. Nicht danach.

### Was es kostet

**Gründung:** Notar mit Musterprotokoll und Handelsregister zusammen rund
300–480 €. Stammkapital gesetzlich ab 1 €, praktisch mindestens **1.000 €** —
sonst ist die UG nach Abzug der Gründungskosten sofort bilanziell leer.

**Laufend, das Mehr gegenüber heute:**

| Posten | Einzelunternehmen | UG |
|---|---|---|
| Buchführung | EÜR | doppelte Buchführung, Bilanz, Anhang |
| Steuerberater | ~1.000–2.100 €/Jahr | deutlich mehr; die Bilanzerstellung allein wird mit 1.500–4.000 €/Jahr angegeben |
| Offenlegung | keine | Unternehmensregister, 12 Monate nach Stichtag, 35–100 €. Bei Versäumnis Ordnungsgeld ab 500 € (§ 335 HGB) |
| IHK | 30–75 €/Jahr, bei geringem Ertrag befreibar | 150–300 €/Jahr, keine Befreiung |
| Gewerbesteuer | Freibetrag **24.500 €** | **kein** Freibetrag |
| Entnahmen | frei | 25 % des Jahresüberschusses müssen als Rücklage stehenbleiben, bis 25.000 € erreicht sind (§ 5a Abs. 3 GmbHG) |

**Realistisch: rund 2.000 € Mehrkosten im ersten Jahr, danach etwa
1.500–2.000 € jährlich.** Steuerlich ist die UG bei kleinem Gewinn schlechter —
der Kipppunkt wird üblicherweise irgendwo zwischen 60.000 und 100.000 € Gewinn
angesetzt, hängt aber stark vom Einzelfall ab. **Das ist der Punkt, an dem eine
Steuerberaterin gefragt werden sollte, nicht ich.**

### Warum die Versicherung zuerst kommt

Die beiden Maßnahmen tun verschiedene Dinge, und das wird oft verwechselt:

- **Die UG begrenzt den Schaden auf das Gesellschaftsvermögen.** Im Ernstfall
  ist die Firma weg, das Privatvermögen bleibt. Sie rettet dich, nicht das
  Unternehmen.
- **Die Versicherung zahlt.** Sie rettet das Unternehmen.

Eine IT-Vermögensschadenhaftpflicht deckt genau unseren Fall: reine
Vermögensschäden beim Kunden durch einen Programmierfehler — also der Handwerker,
der wegen einer falschen Fläche auf seinem eigenen Auftrag Geld verliert.
Einstiegstarife für IT-Betriebe beginnen bei etwa 150 € im Jahr; für ein SaaS
mit sinnvoller Deckungssumme realistisch im mittleren dreistelligen Bereich.
Anbieter mit IT-Schwerpunkt: exali, Hiscox.

**Zwei Ausschlüsse, die man kennen muss:**

1. **Erfüllungsschäden sind nicht gedeckt.** Die Kosten, den Fehler selbst zu
   beheben und die Software vertragsgemäß zum Laufen zu bringen, trägt der
   Betrieb. Versichert sind die Folgeschäden beim Kunden — und das ist bei uns
   der teure Teil.
2. **Wissentliche Pflichtverletzung ist nie gedeckt.** Das schließt an das an,
   was in `legal-001-bestandsaufnahme.md` unter A5 steht: Ein bekannter,
   dokumentierter, nicht behobener Fehler, der trotzdem live geht, ist keine
   leichte Fahrlässigkeit mehr. Dort hilft **weder der Disclaimer noch die
   Versicherung.**

Damit wird aus einer Versicherungsfrage ein Argument für etwas anderes: Die
offenen Prüfmeister-Funde vor dem Launch zu schließen, ist nicht nur
Produktqualität — es ist die Voraussetzung dafür, dass der
Versicherungsschutz im Ernstfall überhaupt greift. Das ist mir bei dieser
Recherche zum ersten Mal so klar geworden.

### Empfehlung

| Wann | Was | Kosten |
|---|---|---|
| **Jetzt, vor dem ersten Testnutzer** | Vermögensschaden-Haftpflicht abschließen. Drei Angebote einholen, auf Deckungssumme und den Ausschluss bekannter Mängel achten | ~150–600 €/Jahr |
| **Vor dem ersten zahlenden Kunden** | UG gründen, Musterprotokoll, 1.000 € Stammkapital | ~1.500 € einmalig inkl. Kapital, dann ~1.500–2.000 €/Jahr |
| **Parallel** | Steuerberaterin zur Steuerseite fragen — die gehört nicht mir | — |
| **Nicht** | Warten, bis es sich lohnt. § 26 HGB lässt das nicht zu | — |

**Wenn nur eines geht: die Versicherung.** Sie kostet ein Zehntel und wirkt
sofort. Die UG ist die richtige Entscheidung, aber sie ist die zweite.

**Ein Gegenargument, das ich ernst nehme:** Solange es keine Nutzer gibt, gibt
es kein Risiko, und jeder Euro, der jetzt in Buchhaltung statt ins Produkt geht,
fehlt. Das stimmt. Deshalb empfehle ich nicht „heute gründen", sondern „vor dem
ersten zahlenden Kunden" — das ist derselbe Moment, an dem auch
Verarbeitungsverzeichnis, Unternehmer-Checkbox und AGB-Mitteilungspflicht scharf
schalten. **Gate 1 ist dieser Moment, nicht ein Datum.**

---

---

## S-4, Teil 2 — Konkreter Versicherungsvorschlag (Head of Legal & Compliance, 2026-09-02)

Sandy wollte einen konkreten Anbieter, keine Liste. Hier ist er, mit der
Begründung und mit den vier Fragen, die vor der Unterschrift geklärt sein
müssen.

**Vorbehalt, kurz:** Ich bin keine Versicherungsmaklerin. Beiträge werden
individuell kalkuliert, und die Bedingungen ändern sich. Was ich beitragen
kann, ist die Frage, welches Risiko wir eigentlich versichern und welche
Klauseln darüber entscheiden — und da gibt es einen Punkt, der die Auswahl
komplett dreht.

### Empfehlung

**exali IT-Haftpflicht, Risikoträger Markel Insurance SE. Deckungssumme
1.000.000 €.**

Warum dieser Anbieter:

- **Als einziger nennt die Berufsbilddeckung ausdrücklich „Software as a
  Service (SaaS)"** und den „Betrieb von Internetplattformen und Apps". Die
  meisten IT-Haftpflichten sind auf Dienstleister und Freelancer zugeschnitten
  — auf jemanden, der im Kundenauftrag programmiert, nicht auf jemanden, der
  ein eigenes Produkt an viele Kunden verkauft. Das ist ein Unterschied, der im
  Schadenfall zählt.
- **Deckungssummen von 150.000 € bis 10 Mio. €** in neun Stufen, also fein genug
  wählbar.
- **Dreifache Maximierung** pro Versicherungsjahr.
- **Unbegrenzte Rückwärtsdeckung** — dazu unten mehr, das ist für uns wichtiger
  als es klingt.
- **Fünf Jahre Nachmeldefrist** nach Vertragsende.
- **Verletzung von Datenschutzgesetzen ist in der Grunddeckung enthalten**, nicht
  erst im Zusatzbaustein.
- Selbstbeteiligung standardmäßig 250 € je Fall, online wählbar.
- Abschluss online möglich, ohne Maklertermin.

**Zwei Vergleichsangebote zum Gegenrechnen:** Markel Pro IT direkt (derselbe
Risikoträger, anderer Vertriebsweg, Einstieg ab 170 €/Jahr) und Hiscox
IT-Haftpflicht. Drei Angebote sind bei dieser Größenordnung genug.

### Der Punkt, der die Deckungssumme entscheidet: Serienschaden

**Das ist die wichtigste Erkenntnis dieser Recherche, und sie widerspricht dem
Branchenrichtwert.**

Üblich empfohlen werden für eine Vermögensschadenhaftpflicht 250.000 €. Für uns
ist das zu wenig, und zwar aus einem strukturellen Grund: der
**Serienschadenklausel**. Sie besagt, dass mehrere Schäden, die auf **derselben
Ursache** beruhen, als **ein einziger Versicherungsfall** gelten — mit **einer**
Deckungssumme und **einer** Selbstbeteiligung, egal wie viele Geschädigte es
gibt.

Genau das ist unser Szenario. Ein systematischer Rechenfehler in der Engine ist
eine Ursache. Wenn er bei 200 Handwerksbetrieben gleichzeitig zu falschen
Angeboten führt, sind das nicht 200 Versicherungsfälle à 250.000 €, sondern
**ein** Fall mit **einmal** 250.000 €. Und die dreifache Jahresmaximierung hilft
dabei nicht — die greift nur bei mehreren *unabhängigen* Fällen, nicht innerhalb
einer Serie.

Dazu kommt: Alle Schäden der Serie werden dem **ersten** Schadenereignis
zugerechnet. Eine später erhöhte Deckungssumme rettet eine bereits laufende
Serie nicht mehr. **Man kann nicht nachbessern, wenn es passiert ist.**

**Was das rechnerisch heißt.** Angenommen, ein Fehler bleibt zwei Monate
unentdeckt, 50 Betriebe sind betroffen und verlieren im Schnitt 2.000 € an
ihren eigenen Aufträgen — das sind 100.000 €, plus Abwehrkosten. Bei 200
Betrieben und mehr betroffenen Angeboten je Betrieb ist die halbe Million
schnell erreicht. Deshalb 1 Mio. € und nicht 250.000 €. Der Beitragsunterschied
zwischen den Stufen ist gering; der Unterschied im Ernstfall ist der ganze
Betrieb.

### Der Zeitpunkt: jetzt ist der beste, den es je geben wird

Die exali-Deckung läuft nach dem **Anspruchserhebungsprinzip** — versichert ist,
wenn ein Kunde den Anspruch **während der Vertragslaufzeit** geltend macht, nicht
wann der fehlerhafte Code entstand. Die **Rückwärtsdeckung** schließt Fehler ein,
deren Ursache vor Vertragsbeginn liegt — **aber nur, solange bei Vertragsschluss
kein Verstoß und keine drohende Inanspruchnahme bekannt war.**

Daraus folgt etwas Praktisches:

**Solange es keine echten Nutzer gibt, kann niemand einen Anspruch haben.** Es
ist nichts passiert, es droht nichts, und die Antragsfragen lassen sich mit
gutem Gewissen verneinen. Der Code seit Juni ist damit sauber mitversichert.
Das ist die beste Ausgangslage, die dieser Vertrag je haben wird — und sie wird
mit jedem Nutzer schlechter.

**Aber Vorsicht mit den bekannten Funden.** Wir haben dokumentierte, noch nicht
behobene Rechenfehler — VOB-013 (Leibungen vierseitig statt dreiseitig,
Fensterbank doppelt) ist der klarste. Solange daraus kein Schaden entstanden ist
und niemand etwas fordert, ist das kein „bekannter Verstoß" im
versicherungsrechtlichen Sinn. Aber es ist nah dran, und es trifft sich mit dem
zweiten Ausschluss: **wissentliche Pflichtverletzung ist nie versichert.** Ein
Fehler, der dokumentiert ist, nicht behoben wird und trotzdem live geht, ist
genau der Fall, in dem ein Versicherer die Leistung verweigert.

**Deshalb die Reihenfolge: bekannte Funde schließen → Vertrag abschließen →
Nutzer aufschalten.** Nicht andersherum.

### Was die Versicherung NICHT leistet

- **Erfüllungsschäden und Nacherfüllung sind ausgeschlossen** (AVB E.1.2/E.1.3).
  Den Bug zu fixen zahlen wir selbst. Versichert ist der Vermögensschaden **beim
  Handwerker** — und das ist bei uns der teure Teil, also passt es.
- **Wissentliche Pflichtverletzung** — siehe oben.
- **DSGVO-Bußgelder selbst.** Ob sie überhaupt versicherbar sind, ist rechtlich
  ungeklärt; die herrschende Meinung sagt nein, weil das den Strafzweck
  unterlaufen würde. Gedeckt sind **Abwehr- und Beratungskosten**. Wir sollten
  das Bußgeldrisiko nicht als versichert einplanen.
- **KI-spezifische Klauseln gibt es am Markt praktisch noch nicht** — weder
  Einschluss noch Ausschluss. Die AVBs sind technologieneutral formuliert, ein
  Rechenfehler bleibt also ein Vermögensschaden, egal ob er aus einer
  KI-Extraktion oder einer if-Abfrage stammt. Das ist die gute Nachricht.
  Trotzdem gehört es gefragt, siehe unten.

### Vier Fragen, die vor der Unterschrift schriftlich beantwortet sein müssen

Diese vier waren öffentlich nicht vollständig einsehbar. Bitte per E-Mail
stellen, damit die Antwort dokumentiert ist:

1. **Wie lautet die Serienschadenklausel im Wortlaut?** Gilt ein Softwarefehler,
   der bei vielen Kunden gleichzeitig wirkt, als ein Versicherungsfall — und
   greift die dreifache Maximierung innerhalb einer Serie oder nicht?
2. **Berührt der Einsatz von OpenAI (Whisper, GPT) als Drittanbieter die
   Deckung?** Gilt das als eingesetzte Fremdsoftware, als Subunternehmer, oder
   spielt es keine Rolle?
3. **Was genau deckt der Zusatzbaustein „KI-bedingter Eigenschaden"?** Der Name
   deutet auf Eigenschäden hin — unser Kernrisiko sind aber Drittschäden beim
   Kunden. Vermutlich brauchen wir ihn nicht; ich will es aber schwarz auf weiß.
4. **Was passiert beim Wechsel Einzelunternehmen → UG?** Kann der Vertrag auf die
   UG umgeschrieben werden, und bleibt dabei die Rückwärtsdeckung für die Zeit
   als Einzelunternehmerin erhalten? Das ist wichtig, weil sonst bei der
   Umwandlung eine Deckungslücke entsteht — genau in dem Zeitraum, für den
   Sandy nach § 26 HGB ohnehin noch fünf Jahre persönlich haftet.

Frage 4 ist die, die am ehesten übersehen wird und am teuersten werden kann.

### Nächster Schritt

Online-Rechner bei exali für **1 Mio. € Deckungssumme** durchspielen, Angebot
per E-Mail anfordern und dabei die vier Fragen mitschicken. Parallel je ein
Angebot bei Markel Pro IT und Hiscox. Existenzgründerrabatt bis 15 % ist bei
mehreren Anbietern üblich — danach fragen.

**Erst nach Abschluss den ersten echten Testnutzer aufschalten**, und vorher die
bekannten Rechenfehler schließen.

Kosten: Für 1 Mio. € Deckung habe ich keinen belastbaren Beitrag gefunden — die
öffentlichen Beispiele (ab 170 €/Jahr, oder 12,50–88,50 € im Monat bei 25.000 €
Umsatz) beziehen sich auf kleinere Deckungen. Realistisch würde ich mit einem
niedrigen bis mittleren dreistelligen Jahresbeitrag rechnen, aber das ist eine
Schätzung, keine Recherche.

---

## S-4, Teil 3 — Korrektur meiner Empfehlung (Head of Legal & Compliance, 2026-09-03)

**Ich nehme den Kernsatz aus S-4 zurück.** Dort steht: „UG: ja — und der
richtige Zeitpunkt ist vor dem ersten *zahlenden* Kunden." Das war zu absolut.

**Neue Empfehlung:**

1. **Vermögensschaden-/IT-Haftpflicht sofort** — unverändert, und in der neuen
   Rangfolge sogar wichtiger als vorher. 1 Mio. € Deckung, exali/Markel. Teil 2
   dieser Reihe gilt unverändert, ergänzt um eine fünfte Frage an den
   Versicherer: Umschreibbarkeit auf eine spätere UG unter Erhalt von
   Vertragsbeginn und Rückwärtsdeckung.
2. **Einzelunternehmen (Kleingewerbe) jetzt** — Gewerbeanmeldung im Oktober
   2026, Kleinunternehmerregelung § 19 UStG.
3. **UG später**, ausgelöst durch den ersten der drei Punkte: rund 20 zahlende
   Betriebe · der Moment, in dem Sandy nicht mehr jeden Kunden persönlich prüft ·
   spätestens der Teilzeitantrag.

**Was sich geändert hat — die Sachlage, nicht meine Meinung über das Risiko:**
Als ich S-4 geschrieben habe, kannte ich die Kundenkurve nicht. CoS-F-003 liegt
seit heute vor. Mein Serienschaden-Argument ist auf 200 Betriebe gerechnet; der
Plan zeigt **1 Betrieb im Januar 2027, 3–5 nach sechs Monaten, 15 frühestens im
August 2027** (realistisches Szenario; im vorsichtigen 14,3 nach 24 Monaten).
Ein Serienschaden über fünf Betriebe liegt weit innerhalb einer
Millionen-Deckung. Das Risiko, das die UG abfängt, entsteht in dieser Zeit
schlicht noch nicht — die Police fängt es vollständig ab. Die Rechtsform-Frage
verschiebt sich damit ins Frühjahr 2027.

**Was das kostet und spart:** Der UG-Weg wäre rund 1.700 € sofort und
3.000 €/Jahr Steuerberater (Bilanzierung, Offenlegung). Der
Einzelunternehmens-Weg kostet 15 € und braucht keine Bilanz. Über zwei Jahre
grob 4.000 € Unterschied in der Liquiditätsrechnung — gemeldet an Head of
Finance, weil CoS-F-003 auf der UG-Basis gerechnet ist.

**Was Sandy dafür in Kauf nimmt, offen gesagt:** Fehler, die in der
Einzelunternehmens-Phase entstehen, bleiben dauerhaft in ihrer persönlichen
Haftung — auch nach einer späteren UG-Gründung. Eine UG wirkt nicht rückwirkend.
Deshalb ist die unbegrenzte Rückwärtsdeckung der Police in dieser Variante keine
Nebensache, sondern der tragende Teil. Zweitens müssen die laufenden
Kundenverträge beim späteren Wechsel auf die UG übergehen; bei einer Handvoll
Kunden ist das eine E-Mail, bei fünfzig wäre es Arbeit — ein weiteres Argument,
die Schwelle von 20 nicht deutlich zu überschreiten.

**Der ausführliche Plan mit Terminen steht in `legal-007-plan-fuer-sandy.md`.**
`legal-006-ug-zeitplan-fuer-sandy.md` ist als überholt markiert, bleibt aber
vollständig gültig, falls Sandy die UG trotzdem sofort will. Das ist keine
falsche Entscheidung — sie kostet nur Geld und Aufwand, der jetzt nicht nötig
ist.

---

## S-4, Teil 4 — ENTSCHIEDEN (Sandy, 2026-09-03)

**Sandys Entscheidung, wörtlich:** *„ich glaube ich fühl mich besser erstmal
mit einzelunternehmen zu starten. ich merke dass sich bei UG zum jetzigen
zeitpunkt ohne auch nur einen kunden etwas in mir zusammenzieht. und ich werde
noch 2 monate extrem weiter am code pfeilen und noch 100 testfälle durchgehen
um grobe fehler die dem user geld kosten auszuschließen. also ja, UG zu einem
späteren zeitpunkt."*

**Damit gilt ab sofort:**

| | |
|---|---|
| **Rechtsform jetzt** | Einzelunternehmen / Kleingewerbe, Kleinunternehmerregelung § 19 UStG |
| **Gewerbeanmeldung** | KW 41 (05.–09.10.2026), online, Berlin, 15 € |
| **Versicherung** | exali/Markel, 1 Mio. €, Abschluss bis Ende Oktober — **noch offen, braucht Sandys Freigabe** |
| **UG** | bei rund 20 zahlenden Betrieben · oder wenn Sandy nicht mehr jeden Kunden persönlich prüft · spätestens beim Teilzeitantrag. Frühestens Frühjahr 2027 |
| **Markenanmeldung** | nein — nur eine 10-Minuten-Recherche im DPMAregister |

Terminplan mit allen Schritten: **`legal-007-plan-fuer-sandy.md`**.
`legal-006-ug-zeitplan-fuer-sandy.md` ist zurückgestellt, bleibt aber gültig
und wird wieder aktiv, wenn die Schwelle erreicht ist.

### Zwei Korrekturen an meiner eigenen Empfehlung

**Erstens, der Zeitpunkt.** S-4 (02.09.) sagte „UG vor dem ersten zahlenden
Kunden". Das ist zurückgenommen — die Begründung steht in Teil 3: Mein
Serienschaden-Argument war auf 200 Betriebe gerechnet, der Finanzplan zeigt
1 Betrieb im Januar 2027 und 3–5 nach sechs Monaten.

**Zweitens, ein echter Fehler in der Begründung, den ich beim Nachlesen des
eigenen Textes gefunden habe.** Oben in dieser Datei steht, wer erst als
Einzelunternehmerin Kunden gewinnt und danach in eine UG umwandelt, hafte
„nach § 26 HGB noch 5 Jahre lang" mit Privatvermögen. **Das ist so nicht
richtig, und es hat in die falsche Richtung gewirkt.**

- §§ 25/26 HGB setzen ein **Handelsgeschäft mit einer Firma** voraus. Eine
  Kleingewerbetreibende, die nicht im Handelsregister steht, ist keine
  Kauffrau und hat keine Firma im Sinne des HGB — die Vorschriften greifen bei
  Sandy gar nicht.
- § 26 HGB ist außerdem eine **Haftungs*begrenzung*** auf fünf Jahre, keine
  Haftungs*begründung*. Ich habe eine Schutzvorschrift als Risiko zitiert.
- **Richtig ist der einfachere und härtere Satz:** Verbindlichkeiten, die Sandy
  als Einzelunternehmerin eingeht, bleiben ihre — unbefristet, nicht fünf
  Jahre, und eine spätere UG übernimmt sie nur bei ausdrücklicher
  Vertragsübernahme mit Zustimmung des Kunden. Eine UG wirkt nie rückwirkend.

Das Argument fällt damit nicht weg, es wandert nur an die richtige Stelle:
**Nicht die Rechtsform schützt die Anfangsphase, sondern die Police mit
unbegrenzter Rückwärtsdeckung.** Ich sage das ausdrücklich dazu, weil die
Korrektur zufällig in Richtung meiner neuen Empfehlung zeigt — gefunden habe
ich sie beim Nachlesen, nicht beim Suchen nach Argumenten.

### Was Sandys zwei Monate Testarbeit rechtlich bedeuten

Sie hat angekündigt, vor Gate 1 noch rund 100 Testfälle durchzugehen, um
Fehler auszuschließen, die den Nutzer Geld kosten. Das ist aus Legal-Sicht der
wirksamste einzelne Beitrag zur Risikolage, den es hier gibt — wirksamer als
jede Rechtsform:

- Es senkt die Eintrittswahrscheinlichkeit im Risikoregister (`legal-002`)
  direkt, statt nur die Schadenshöhe zu deckeln.
- **Es räumt die Obliegenheitsverletzung aus.** Bekannte, nicht behobene
  Rechenfehler bei Vertragsschluss können den Versicherungsschutz gefährden
  (wissentliche Pflichtverletzung). VOB-013 und die offenen Punkte aus
  `pruefmeister-testfaelle.md` gehören deshalb **vor** den Versicherungsantrag
  bzw. spätestens vor Gate 1 geschlossen — nicht danach.
- Dokumentierte Testläufe sind gleichzeitig der Nachweis nach Art. 4 AI Act
  (CC-08) und entlasten im Streitfall bei § 254 BGB.

**Konkrete Bitte an Sandy:** Die Testläufe irgendwo festhalten, auch grob —
Datum, was geprüft, was gefunden, was gefixt. Das ist später Gold wert und
kostet jetzt fünf Minuten pro Sitzung.

---
