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
