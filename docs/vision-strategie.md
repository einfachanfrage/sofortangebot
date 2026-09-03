# Vision & Strategie — Sofortangebot

Diese Datei ist neu (angelegt 2026-08-18) und hat einen anderen Zweck als
alle anderen Dateien in `docs/`: Die anderen sind operative
Koordinationsdateien (wer bearbeitet gerade was). Diese hier ist die
Leitplanke, gegen die der Chief of Staff jede Priorisierung abgleicht,
bevor er sie Sandy vorschlägt — „hilft das dem Ziel, oder ist es gerade nur
dringend?".

**Ablauf:** Wird beim wöchentlichen strategischen Check-in (siehe unten)
gemeinsam mit Sandy gepflegt — nicht bei jedem operativen Fix, sondern nur,
wenn sich am großen Bild tatsächlich etwas ändert.

---

## Was Sofortangebot ist

Voice-to-Quote-SaaS für deutsche Handwerker: Handwerker spricht sein
Aufmaß/seine Notizen ein, das Tool erstellt automatisch einen
Angebots-Entwurf (Positionen, Mengen, Preise) statt einer manuellen
Angebotserstellung am Abend. Kernversprechen: „gerechnet, nicht geschätzt"
— jede Position hat einen nachvollziehbaren Rechenweg, kein Blackbox-Preis.

## Aktuelle Phase — Web zuerst, App danach

**Wichtige Klarstellung von Sandy (18.08.2026):** Der erste Launch ist
bewusst eine **Website/Web-App**, keine native App. Eine native App ist
der **nächste** Schritt danach, nicht Teil des aktuellen Launches. Das
betrifft Priorisierung: Alles, was nur für eine native App nötig wäre
(App-Store-Listing, native Push-Mechanik über die Web-Push-Lösung hinaus,
Store-Reviews), ist für Gate 1–2 nicht relevant.

Aktueller Stand technisch: Next.js-Web-App mit PWA-Ansätzen (App-Icon,
Manifest — siehe `marketing-ci.md`-Bestandsaufnahme), aber (Stand 18.08.)
keine eigenständige native App.

## Wo wir im Launch-Prozess stehen

Drei Gates, siehe `docs/launch-readiness.md` für die volle Liste:

- **Gate 1 — erste begleitete Testnutzer.** Aktuelles Ziel, „baldiger
  Launch". Sandy ist bei diesen ersten Nutzern selbst dabei/erreichbar.
- **Gate 2 — öffentlicher Launch.** Erst relevant, wenn Gate 1 steht.
- **Gate 3 — danach/Skalierung.**

Der Chief of Staff hält die Gate-1-Priorität scharf: Alles, was Geld/
Vertrauen bei einem echten Nutzer beschädigen könnte (fehlerhafte
Berechnung, verschwindende Angebote) oder einen kompletten Einstieg
blockiert (Login/Registrierung/E-Mail-Zustellung) geht vor optischer
Politur (Design-Feinschliff, Marken-/CI-Umsetzung) — nicht weil Letzteres
unwichtig ist, sondern weil es Gate 2 ist, nicht Gate 1.

## Team & Aufbau

Fünf spezialisierte KI-Mitarbeiter (Prüfmeister/QA, Head of Product
Engineering, Platform & Integrations Engineer, Product Designer, Head of
Marketing) + Chief of Staff, jeweils eigenes Cowork-Projekt, Koordination
ausschließlich über `docs/`. Volles Organigramm: `docs/team-organigramm.md`.
Laut Sandy langfristig weiterer Ausbau geplant (mehr Marketing-Spezialisten
u. a.) — Details bei Bedarf.

## Was hier noch fehlt — bewusst offen, mit Sandy zu klären

Diese Datei ist ein Anfang, kein vollständiges Bild. Folgendes ist aktuell
NICHT belastbar dokumentiert und sollte in den nächsten wöchentlichen
Check-ins Stück für Stück ergänzt werden, statt es zu erfinden:

- Wann welche neue Team-Rolle wirklich gebraucht wird (über Marketing
  hinaus)
- Konkretes Zielbild für die nächsten 3–12 Monate nach Gate 1 — welche
  neuen Gewerke als Nächstes und in welcher Reihenfolge ist weiterhin offen,
  auch wenn seit 31.08. klar ist, dass Gewerke-Erweiterung grundsätzlich
  fest eingeplant ist (siehe unten)

**Geklärt (18.08.2026):**

- **Zielgröße/Ambition:** Wachstum mit Team/Kapital, kein Lifestyle-Business
  — betrifft Priorisierung: Tempo und Team-Aufbau nach Gate 1 dürfen
  ambitioniert gedacht werden, nicht nur schlank gehalten.
- **Wachstumsweg nach Gate 1:** organisch/Mundpropaganda + Content/SEO,
  bewusst kein bezahltes Werbebudget zum Start eingeplant.
- **Native App:** fest eingeplant, Zielzeitraum Mitte 2027 — kein
  „irgendwann vielleicht", sondern ein realer nächster Meilenstein nach
  Gate 2, den der Chief of Staff im Blick behalten sollte.

**Geklärt (31.08.2026):**

- **Wettbewerbslandschaft:** Es gibt bereits andere Sprache-zu-Angebot-
  Anbieter für Handwerker, u. a. Hero und Plankraft (beide groß) sowie
  Profiangebot. Sofortangebot grenzt sich bewusst nicht über mehr Funktionen
  ab, sondern über weniger: kein CRM-Anspruch, kein Rundum-System — reiner,
  scharfer Fokus auf Angebotserstellung, mit dem Ziel, das schnellste und
  unkomplizierteste Angebots-Tool der Handwerksbranche zu sein.
- **Zielkunde/Segment:** bewusst kleine Betriebe (ca. 1–10 Mitarbeitende),
  nicht größere Malerbetriebe mit z. B. 30 Mitarbeitenden — kein Anspruch
  auf Vollautomatisierung/Enterprise-Tiefe, sondern einfache Bedienung für
  Betriebe, die z. B. Lexware oder sevDesk zur Buchhaltung nutzen. Betrifft
  Priorisierung: die geplante Buchhaltungssoftware-Anbindung (Lexware/
  sevDesk) ist Teil dieser Positionierung, nicht nur ein Feature — Ziel ist
  eine Anbindung in 2–3 einfachen Klicks.
- **Wachstumsweg, Ergänzung:** Social Media ist ein bewusster
  Go-to-Market-Kanal, nicht nur Content/SEO — Begründung: eine jüngere
  Handwerker-Generation (Nachfolge in altersbedingt frei werdenden
  Betrieben) ist auf Social Media aktiv, dafür ist ein eigener, hochwertiger
  Social-Media-Auftritt geplant. Ergänzt, ersetzt nicht die 18.08-Festlegung
  „kein bezahltes Werbebudget zum Start".
- **Gewerke-Erweiterung:** über Maler/Bodenleger hinaus grundsätzlich fest
  eingeplant (weitere Gewerke sollen folgen) — konkrete Reihenfolge/Timing
  bleibt offen, siehe „Was hier noch fehlt" oben.

## Go-to-Market — was wir tatsächlich haben (Stand 03.09.2026)

Ergänzt vom Chief of Staff nach direkter Nachfrage bei Sandy. Diese drei
Punkte sind Randbedingungen für jede Wachstumsplanung und stehen deshalb hier
in der Leitplanke, nicht nur in einer Todo-Datei:

- **Zeitbudget: 15–20 Stunden pro Woche** (von Sandy korrigiert am 03.09.2026;
  eine erste Angabe von 5–10 beruhte auf einer zu grob gestellten Frage des
  Chief of Staff). Neben einem Vollzeitjob, **seit rund zwei Monaten
  tatsächlich so gelebt** — also grob 65–86 Stunden im Monat für Produkt,
  Support, Verwaltung und Vertrieb zusammen. Zeit bleibt die knappste
  Ressource im Vorhaben — nicht die Nachfrage, nicht das Geld, nicht die
  Technik —, aber der Spielraum ist deutlich größer als zunächst angenommen.
  Offen und bewusst nicht beantwortet: ob sich dieses Tempo über 24 Monate
  halten lässt. Der Finanzplan führt deshalb zwei Kapazitätslinien.
- **Kein eigenes Handwerker-Netzwerk.** Sandy und Clemens kennen 0 bis 2
  Handwerker persönlich, die als Testnutzer in Frage kämen.
- **Ein warmer Kanal, und der ist gut:** Ein guter Bekannter von Clemens
  arbeitet im Malerfachhandel Dessau, hat von sich aus angeboten, Flyer
  auszulegen, und kennt die wiederkehrenden Kunden persönlich (Dessau, nicht
  Berlin — es sind oft dieselben Gesichter). Damit ist das kein Flyer-Kanal,
  sondern ein Empfehlungskanal mit einem Menschen als Multiplikator.

**Folgerung für die Priorisierung:** Der erste Kanal ist aller Voraussicht nach
Dessau, nicht Social Media — Social Media bleibt richtig und geplant
(CoS-M-002), braucht aber Zeit und Reichweiteaufbau, die es beides noch nicht
gibt. Bewertung und Reihenfolge liegen bei Head of Marketing (CoS-M-007), nicht
beim Chief of Staff. Gleichzeitig ist die Abhängigkeit von diesem einen Kontakt
ein **Klumpenrisiko**, das im Finanzplan im vorsichtigen Szenario sichtbar sein
muss.

## Was der Finanzplan strategisch sagt (Chief of Staff, 03.09.2026)

Der erste vollständige Finanzplan (CoS-F-003, Head of Finance) liegt vor —
24 Monate, drei Szenarien, aufgebaut auf dem Kanalplan von Marketing
(CoS-M-007). Er ist das Ergebnis der **aktuellen Strategie**: rein organisch,
kein Werbebudget, ein warmer Kanal, 15–20 Stunden die Woche neben dem Job.
Die Zahlen:

- **Erstes positives Monatsergebnis:** realistisch November 2027, optimistisch
  Juli 2027, vorsichtig nicht innerhalb von 24 Monaten.
- **Vorstrecken:** bis –9.280 € (realistisch), davon 2.000 € gebundene Reserven.
- **Anstellung auf 30 Stunden reduzieren (B1):** braucht 37 zahlende Betriebe —
  realistisch **Monat 21 (Mai 2028)**, optimistisch Monat 14 (Oktober 2027).
- **Anstellung ganz aufgeben (B2):** braucht 107 Betriebe — **in keinem
  Szenario innerhalb von 24 Monaten.**
- Zahlende Betriebe nach 24 Monaten: 14 / 47 / 99.

**Die strategische Folgerung, für den nächsten Check-in:** Die Ambition in
dieser Datei lautet „Wachstum mit Team und Kapital, kein Lifestyle-Business".
Der Plan zeigt, was die *heutige* Strategie dazu hergibt: einen soliden, aber
langsamen Weg, auf dem die volle Selbstständigkeit erst jenseits des
Horizonts liegt. Das ist kein Fehler im Plan — es ist die ehrliche Rechnung
für „organisch, allein, nebenher". Wenn das Tempo nicht reicht, gibt es genau
vier Hebel, und keiner davon ist „mehr Stunden": (1) ein zweiter warmer Kanal
wie Dessau — ein Mensch, nicht ein Flyer; (2) ein bezahlter Reichweiten-Test,
sobald ein Reel nachweislich zieht (Marketing hat den Rahmen: 150 €, einmal,
mit Auswertung); (3) das Klumpenrisiko Dessau früh mit einem zweiten Laden
absichern; (4) Kapital, um Stufe B1 vorzuziehen statt sie zu erwarten — das
wäre der Moment für den Businessplan. Die Frage für den Check-in ist nicht
„stimmt der Plan", sondern **„ist der Weg, den er zeigt, der, den du gehen
willst"**.

**Nicht entscheidungsreif, bewusst:** Die Besteuerung der UG ist noch nicht
gerechnet (Steuerberater-Frage 1), und Abwanderung sowie Support-/
Grundlast-Stunden sind Annahmen ohne Erfahrungswert. Die Stufen können sich
verschieben. Das Bild — B1 erreichbar, B2 nicht im Horizont — hält das
vermutlich aus.

## Wöchentlicher strategischer Check-in

Eingerichtet 18.08.2026: einmal pro Woche ein kurzer Termin NUR auf dieser
Ebene — sind wir noch auf Kurs zum Launch, hat sich am großen Bild etwas
verändert, was kommt strategisch als Nächstes. Kein Ticket-Status, keine
Bug-IDs. Details/Historie unten anhängen, sobald der erste Check-in
stattgefunden hat.

### Verlauf

**18.08.2026 (erster Check-in):** Stand Richtung Launch: auf Kurs zu Gate 1,
aber noch nicht so weit — mehr echte Fortschritte als neue Risiken in der
letzten Woche, ein offenes Vertrauensthema bei der Kernrechnung hält uns
bewusst zurück. Keine akute strategische Entscheidung diese Woche. Frage aus
„Was hier noch fehlt" an Sandy weitergegeben: Zielgröße/Ambition
(Lifestyle-Business vs. Wachstum mit Team/Kapital) — Antwort steht noch aus,
daher unten unverändert gelassen.

**24.08.2026 (zweiter Check-in):** Stand Richtung Launch: weiter auf Kurs zu
Gate 1, mit spürbarer Bewegung seit letzter Woche (Gate 1 von 23 % auf
25 %) — die vermeintliche Deploy-Blockade war ein Fehlalarm und ist gelöst,
dafür fand der erste echte Live-Test der Bestätigungskarte sofort einen
echten (inzwischen gefixten) Bug; Sandys Bestätigungs-Retest steht noch aus
und ist damit der nächste Schritt vor dem eigentlichen
Vertrauensthema bei der Kernrechnung. Keine akute strategische
Entscheidung diese Woche (`entscheidungen-fuer-sandy.md`: aktuell nichts
offen). Frage aus „Was hier noch fehlt" an Sandy weitergegeben:
Wettbewerbslandschaft — was macht Sofortangebot aus ihrer Sicht anders/
besser als bestehende Alternativen? Antwort steht noch aus, daher unten
unverändert gelassen.

**31.08.2026 (dritter Check-in):** Stand Richtung Launch: weiter auf Kurs zu
Gate 1 (aktuell 34 %), aber die Zahl bewegt sich kaum, obwohl in der letzten
Woche mehrere echte Fortschritte passiert sind (u. a. Login/Registrierung
und die Pflicht-Mails technisch fertig, mehrere neue Design-/UX-Funde
größtenteils schon umgesetzt) — die Einzelbewegungen sind über zu viele
kleine Punkte verteilt, um die große Zahl sichtbar zu heben. Keine akute
strategische Entscheidung diese Woche (`entscheidungen-fuer-sandy.md`:
offene Punkte sind operativer Natur, keine Weichenstellung fürs große
Bild). Frage aus „Was hier noch fehlt" erneut an Sandy weitergegeben, da die
Frage vom 24.08. weiterhin unbeantwortet ist: Wettbewerbslandschaft — was
macht Sofortangebot aus ihrer Sicht anders/besser als bestehende
Alternativen? Antwort steht weiter aus, daher unten unverändert gelassen.
