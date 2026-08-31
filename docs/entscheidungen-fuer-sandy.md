# Entscheidungen, die auf Sandy warten

Gebündelte Liste für genau eine Sache: Punkte, die NUR Sandy entscheiden
kann (Preis, Positionierung, Personal, Risikobereitschaft — nicht fachliche
Umsetzung, die bleibt bei den Spezialisten). Bisher lagen solche Punkte
verstreut in `design-check.md`, `chief-of-staff-todos.md` etc. — hier stehen
sie gebündelt, damit nichts im Alltag untergeht. Eine Wahrheit pro Sache
gilt weiter: hier steht nur ein kurzer Verweis + der Stand, die volle
Diskussion bleibt in der jeweiligen Heimat-Datei (verlinkt über die ID).

**Ablauf:** Sobald der Chief of Staff in einer Heimat-Datei einen Punkt auf
🔵 „Entscheidung nötig" setzt (oder eine neue Entscheidung sonst wie
entsteht), kommt sofort eine Zeile hier rein. Nach Sandys Entscheidung
wandert die Zeile von „Offen" nach „Entschieden" (bleibt stehen, nicht
löschen — Verlauf ist wertvoll).

**Status-Zeichen:** 🔵 offen, wartet auf Sandy · ✅ entschieden.

---

## Offen

Stand 31.08.2026: Alle vorgelegten Punkte sind entschieden — siehe Verlauf
unten (inkl. der Buchhaltungs-Gate-Frage, siehe neueste Zeile). Die
weiterhin große, laufende Abwägung ist keine einzelne Ja/Nein-Frage, sondern
die Gate-1-Gesamtfrage „ist das Tool reif für erste echte Testnutzer?" — die
läuft über `docs/launch-readiness.md` (Stand 31.08.: ≈ 33 % gegen den vollen
Scope, nach der Hochstufung von 11.5 auf G1; volle Neuberechnung nach dem
heutigen Sync steht noch aus). Die Wettbewerbslandschafts-Frage aus
`vision-strategie.md` ist im strategischen Check-in vom 31.08. beantwortet
worden (siehe dort, „Geklärt 31.08.2026") — kein offener Punkt mehr.

---

## Entschieden (Verlauf)

| Datum | Entscheidung | Ergebnis | Quelle |
|---|---|---|---|
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
