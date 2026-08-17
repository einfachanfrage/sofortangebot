# Fortschritt-Log — Sofortangebot

Laufendes Protokoll vom Chief of Staff. Ein Eintrag pro Tag mit nennenswertem
Fortschritt, jeweils oben angehängt (neueste zuerst). Ziel: Sandy kann hier
in wenigen Minuten nachlesen, was an einem Tag passiert ist, ohne alle
Detaildateien einzeln durchzugehen. Die Details bleiben in
`docs/pruefmeister-testfaelle.md`, `docs/design-check.md`,
`docs/pruefmeister-notizen-fuer-designer.md`,
`docs/pruefmeister-notiz-fuer-chief-of-staff.md` und
`docs/chief-of-staff-todos.md` — dieses Log verlinkt dorthin, statt sie zu
duplizieren.

Ein visuelles Dashboard mit Fortschritts-Balken gibt es zusätzlich als
HTML-Datei (vom Chief of Staff verschickt, bei Bedarf erneut anfragen).

---

## 2026-08-17 — Logo-Upload-Bug (RLS) gefixt, auf Produktion deployt, unterwegs zusätzlichen Deploy-Fehler gefunden und behoben

**Kurzfassung:** Sandy meldete aus einem Onboarding-Testlauf einen
zuverlässig reproduzierbaren Fehler beim Logo-Upload (RLS-Policy-Verletzung).
Platform & Integrations Engineer hat die Root Cause gefunden, gefixt, die
Migration auf Staging und danach mit Sandys ausdrücklicher
`DEPLOY-PRODUCTION`-Bestätigung auf Produktion angewendet. Auf dem Weg dorthin
zwei zusätzliche Funde: ein Resend-API-Key lag im Klartext in der
Git-Historie (von GitHub Push Protection abgefangen, behoben, Key rotiert),
und der Produktions-Build war durch eine Merge-Kollision in einer fremden
Datei kaputt (nicht durch diesen Fix verursacht) — ebenfalls gefunden und
behoben. Details in `docs/chief-of-staff-platform-todos.md`, CoS-P-005.

### Logo-Upload-Fix (CoS-P-005, Details in `docs/chief-of-staff-platform-todos.md`)

Root Cause: der Storage-Bucket `company-logos` war laut Doku nur manuell im
Supabase-Dashboard angelegt worden — dabei entstehen keine
Row-Level-Security-Policies, wodurch jeder Upload abgelehnt wurde. Fix: neue
Migration legt Bucket + vier Policies (SELECT/INSERT/UPDATE/DELETE, Ordner =
`auth.uid()`) idempotent an, plus eine kleine Pfad-Korrektur im
Upload-Endpunkt, damit das erste Pfadsegment tatsächlich der User-ID
entspricht. Migration verifiziert auf Staging (`bkldyddstovvkkhpiqiy`) und
Produktion (`yqlledouhfovytifeekd`), keine neuen Security-Warnungen. **Noch
offen:** Live-Test im echten Onboarding-Flow steht aus — DB- und
deploy-seitig ist alles bereit.

### Nebenfunde unterwegs

- **Sicherheitsfund:** GitHub Push Protection blockierte den ersten
  Push-Versuch wegen eines im Klartext committeten Resend-API-Keys in
  `.claude/settings.local.json`. Zeile entfernt, Commit bereinigt, Sandy hat
  den Key im Resend-Dashboard rotiert und in Vercel aktualisiert. Noch offen:
  kurzer Gegencheck, ob der neue Key in Vercel für Prod UND Preview gesetzt
  ist.
- **Produktions-Build war kaputt, jetzt wieder grün:** Ein früherer Push auf
  `main` hatte einen Vercel-Deploy ausgelöst, der fehlschlug (Turbopack-
  Fehler). Ursache: eine Merge-Kollision zwischen zwei parallelen
  Änderungen in `src/app/api/angebot-extrahieren/route.ts` (Zuständigkeit
  Head of Product Engineering) — ein Sentry-Import war mitten in ein anderes
  Import-Statement gerutscht. Gefixt (Commit `228bdc7`), Vercel bestätigt
  „Ready". Cross-Referenz dazu in `docs/engineering-austausch.md` (EX-002),
  da die betroffene Datei nicht im Platform-Zuständigkeitsbereich liegt.

### Prozess-Abweichungen (dokumentiert, nicht rückgängig zu machen)

Migration wurde direkt über die Supabase-Verwaltungs-API angewendet statt
über den `Database migrations`-GitHub-Actions-Workflow, da diese Session
keinen Actions-Zugriff auf das Repo hat (nur Lesezugriff). Inhaltlich
verifiziert, aber ohne die üblichen Workflow-Artefakte. Der Push landete
außerdem direkt auf `main` statt über `develop`/Staging, da das lokale
Terminal zum Zeitpunkt des Commits bereits auf `main` stand.

## 2026-08-16 — Erster kompletter QA-Testlauf + Design-Erstcheck

**Kurzfassung:** Zehn Testfälle des Prüfmeisters (PM-001 bis PM-010) einmal
komplett durchgetestet, die meisten Bugs noch am selben Tag gefixt und live
nachgetestet. Product Designer hat parallel einen ersten Design-/CI-Check
geliefert (6 Punkte) plus vier UX-Beobachtungen an den Prüfmeister
weitergegeben. Größter Einzelfund des Tages: eine strukturelle Erklärung
dafür, warum die Bestätigungskarte wiederholt etwas anderes zeigt als die
finale Berechnung.

### QA (Prüfmeister-Testfälle, Details in `docs/pruefmeister-testfaelle.md`)

- **PM-001** (Ausschluss + Selbstkorrektur): Bug gefunden — expliziter
  Ausschluss „Decke NICHT mitrechnen" wurde von der Bestätigungskarte korrekt
  verstanden, aber von der finalen Berechnung ignoriert. Root-cause: Karte
  und Berechnung rufen GPT zweimal unabhängig auf demselben Text auf, GPT ist
  nicht deterministisch. Fix: eine zusätzliche, text-basierte
  Sicherheitsprüfung fängt das jetzt ab (aktuell nur für Ein-Raum-Fälle
  abgesichert). Live-Test steht aus. **Korrektur zum Vortag:** ursprünglich
  fälschlich als „Regression" eingeordnet — tatsächlich war der erste
  Testdurchlauf ungültig (Ausschluss-Satz fehlte beim Einsprechen), kein
  Hinweis auf Pipeline-Instabilität.
- **PM-002** (Akzentwand + Boden diagonal): ✅ beide Bugs gefixt, live
  bestätigt.
- **PM-003** (Kleinreparatur + Höhenzuschlag): Größter Einzelfund des
  Tages — Grundierung wurde bei zwei Dübellöchern auf die volle Wandfläche
  berechnet (276,66 € statt ein paar Euro). Gefixt, live bestätigt. Kleinerer
  Anzeige-Bug (rotes „!" bei 0 Fenstern) zusätzlich gefunden und gefixt.
- **PM-004** (Laminat gerade + Trittschalldämmung): ✅ Verschnitt-Bug
  (10% statt 5% bei gerader Verlegung, betraf vermutlich jedes Angebot mit
  Plattenware) gefixt, live bestätigt.
- **PM-005** (Zwei Räume, Scope „nur Decke"): Schwerster struktureller Fund —
  Speisekammer verschwand als eigener Raum, Küche verlor ihre Wände. Zwei
  Fixes nötig: erst der Scope-Fehler (behoben, live bestätigt), dann ein
  zweiter, unabhängiger Anzeige-Fehler (Speisekammer fehlte in einer
  Raumnamen-Liste für die Gruppierung — auch behoben). Live-Test des zweiten
  Fixes steht aus.
- **PM-006** (Kleines Fenster + Altbau): ✅ keine neuen Funde, bekannter
  Punkt (VOB-Übermessung) bestätigt.
- **PM-007** (Dachgeschoss): Ganze Produktkategorie war kaputt (GPT-Felder
  wurden beim Einlesen verworfen). Root-cause gefixt, dazu eine zweite,
  unabhängige unverlangte Grundierungs-Position (136,80 €) gefunden und
  gefixt. Live-Test steht aus.
- **PM-008** (Fassade): Blockierender Fehler (Tool erzeugte gar kein
  Angebot) root-cause gefixt — Fassaden wurden komplett ignoriert, weil GPT
  sie in einem eigenen Datenfeld ablegt. Zusätzlich eine Karten-Anzeige
  (Fenster „1" statt „2") gefixt. **Offener Punkt:** die Übersichtstabelle
  nennt eine weitere, noch nicht dokumentierte Auffälligkeit
  („Doppelberechnung" + unverlangte 334,80-€-Position) — Detailbeschreibung
  fehlt noch in der Datei, nachfragen.
- **PM-009** (Bodenleger-Komplettpaket): **Dokumentationslücke** — die
  Übersichtstabelle nennt bereits Ergebnisse (Verschnitt-Fix bestätigt,
  Übergangsschiene fehlt), der ausführliche Testfall-Eintrag selbst enthält
  aber noch kein Ist-Ergebnis. Nicht als abgeschlossen werten, bis das
  nachgetragen ist.
- **PM-010** (Sockelleisten-Doppelfalle): ❌ Zwei reale, ungefixte Bugs.
  (1) Schwerwiegender Zahlenerkennungsfehler: die im Handwerk übliche
  Sprechweise „drei fünfzig" (3,50 m) wurde einmal als die Zahl 350 gelesen —
  kein Nischenfall, sondern Alltagssprache. (2) Bestätigte Lücke: „Sockelleisten
  streichen" wird erkannt, taucht aber nie als Position im fertigen Angebot
  auf.

### Design-Check (Product Designer, Details in `docs/design-check.md`)

Sechs Punkte (DC-001 bis DC-006) geprüft und zugeordnet. DC-001 (drei
widersprüchliche Preise + „18 Gewerke"-Versprechen) war blockierend — Sandy
hat den Chief of Staff gebeten, den Startpreis festzulegen: **22 €/Monat
Standard, 17 €/Monat bei Jahresabo, 3 Angebote/Monat kostenlos**, Werbung auf
„Maler & Bodenleger" statt „18 Gewerke". Umsetzung jetzt bei Head of IT
(`docs/chief-of-staff-todos.md`, CoS-001). DC-002 bis DC-006 sind reine
Frontend-/Designsystem-Arbeit im Zuständigkeitsbereich des Designers
(fehlender Desktop-Nav-Punkt, inkonsistente Statusfarben, kaputte
Safe-Area-CSS, kein gemeinsamer Button, ungenutzte Typografie-Tokens). Kein
neuer Angestellter nötig.

### UX-Notizen an den Designer (Details in `docs/pruefmeister-notizen-fuer-designer.md`)

Vier Punkte (PD-001 bis PD-004), alle „wie fühlt sich das Produkt an", keine
Rechenfragen: unzuverlässige Bestätigungskarte (PD-001, PD-004 als
Verschärfung — die Zahl „X Positionen erkannt" stimmte in zwei Tests nicht),
Sandys eigener Wunsch nach einem kompletten Neudenken der Rückfragen-UI
(PD-002), ein Anzeige-Format-Problem bei Nicht-Raum-Objekten wie Fassaden
(PD-003, sieht aus wie 5 Fehler, ist aber nur ein fehlendes Format).

### Strukturelle Erkenntnis (neu, `docs/chief-of-staff-todos.md` CoS-002)

Der Prüfmeister hat dem Chief of Staff eine Ebene-höher-Beobachtung gemeldet
(eigene Datei `docs/pruefmeister-notiz-fuer-chief-of-staff.md`): in 6 von 10
Testfällen zeigte die Bestätigungskarte etwas anderes als das Endergebnis —
kein Einzelfall, sondern ein Muster. Beim PM-001-Fix hat Head of IT die
technische Ursache bestätigt: Karte und Berechnung sind zwei unabhängige,
nicht-deterministische GPT-Aufrufe auf demselben Text. Als strukturelles
Thema dokumentiert (CoS-002), aktuell kein Umbau-Auftrag — nur damit es nicht
verloren geht, falls später priorisiert werden soll.

### Prüfmeisters ehrliche Gesamteinschätzung (wörtlich sinngemäß)

Fachlich macht das Tool inzwischen einen guten Eindruck — mehrere Bugs
wurden an einem Tag sauber gefixt und mit Tests abgesichert. Was ihn zögern
lässt, „reif für echte Nutzer" zu sagen, ist nicht ein einzelner
Rechenfehler, sondern dass der Vertrauens-Mechanismus selbst (die
Bestätigungskarte) wiederholt nicht hält, was er verspricht — ein Handwerker,
der das einmal erlebt, prüft danach jede Position von Hand, und das Tool hat
seinen Kernnutzen verloren, selbst wenn die Rechnung am Ende stimmt. Das ist
seine Perspektive, nicht die einzige, die zählt — aber sie wiegt schwer.

### Korrektur im Laufe des Tages

PM-001 wurde zwischenzeitlich fälschlich als „Regression" eingestuft. Sandy
hat selbst gemeldet, dass der allererste Testdurchlauf keine gültige
Bestätigung war (Ausschluss-Satz fehlte beim Einsprechen). Korrigiert in
`docs/pruefmeister-testfaelle.md` — der Bug selbst blieb genauso real und
dringend, nur die Ursachen-Geschichte hat sich geändert.

### Go/No-Go-Stand am Ende des Tages

Noch nicht bereit für echte Testnutzer. Nicht wegen eines einzelnen Bugs,
sondern weil der zentrale Vertrauens-Mechanismus (Bestätigungskarte) mehrfach
nicht verlässlich war — deckt sich mit der Einschätzung des Prüfmeisters.
Größter Fortschritt: fast alle bekannten Rechenfehler sind an einem Tag
gefixt worden. Größte offene Fäden: PM-010 (zwei ungefixte, teils schwere
Bugs), fehlende Live-Bestätigung für die meisten heutigen Fixes,
Dokumentationslücken bei PM-008/PM-009, und die strukturelle
Karte-vs-Berechnung-Frage (CoS-002).
