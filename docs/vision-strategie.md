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

- Wettbewerbslandschaft — Sandy hat einen groben Überblick, aber keine
  systematische Einschätzung; was macht Sofortangebot anders/besser, bleibt
  noch zu schärfen
- Wann welche neue Team-Rolle wirklich gebraucht wird (über Marketing
  hinaus)
- Konkretes Zielbild für die nächsten 3–12 Monate nach Gate 1 (welche
  Gewerke als Nächstes, in welcher Reihenfolge)

**Geklärt (18.08.2026):**

- **Zielgröße/Ambition:** Wachstum mit Team/Kapital, kein Lifestyle-Business
  — betrifft Priorisierung: Tempo und Team-Aufbau nach Gate 1 dürfen
  ambitioniert gedacht werden, nicht nur schlank gehalten.
- **Wachstumsweg nach Gate 1:** organisch/Mundpropaganda + Content/SEO,
  bewusst kein bezahltes Werbebudget zum Start eingeplant.
- **Native App:** fest eingeplant, Zielzeitraum Mitte 2027 — kein
  „irgendwann vielleicht", sondern ein realer nächster Meilenstein nach
  Gate 2, den der Chief of Staff im Blick behalten sollte.

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
