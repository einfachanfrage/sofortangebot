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

**🔵 CoS-M-004 (Rest) — eine Design-System-Freigabe, Head of Marketing
wartet darauf, bevor er weiterbaut:**

**Freigabe neue Funktionsfarben** `--state-success` (#4F6B45) /
`--state-danger` (#A33A2A) — im PDF selbst als „Ergänzung ohne
CI-Grundlage, Freigabe durch Sandy offen" markiert.

**🔵 CoS-L-001 (Rest) — eine offene Entscheidung aus dem ersten Bericht von
Head of Legal & Compliance** (S-1, S-2, S-3, S-5 sind entschieden, siehe
Verlauf unten):

**S-4 — Rechtsform/Versicherung, noch offen.** Du haftest aktuell als
Einzelunternehmerin persönlich und unbegrenzt — auch mit Privatvermögen,
auch für einen KI-Rechenfehler, der einem Kunden schadet. Legal empfiehlt,
das vor dem ersten zahlenden Kunden zu klären, nicht erst ein Jahr nach
Launch — genau in dem Zeitraum dazwischen läuft das Risiko live, sobald
echtes Geld fließt.

Zur Einordnung (Fakten, keine Rechts-/Steuerberatung — bitte bei der
tatsächlichen Gründung einen Steuerberater/Notar hinzuziehen):
- **UG (haftungsbeschränkt)** ist die „GmbH light" genau für deine
  Situation: ab 1 € Stammkapital gründbar (praktisch sind ein paar hundert
  Euro üblich), Notar- und Handelsregisterkosten liegen bei einer
  Einzelgründung mit Musterprotokoll grob im niedrigen dreistelligen
  Bereich, Haftungsschutz gilt ab Eintragung. Muss jährlich 25 % des
  Gewinns zurücklegen, bis 25.000 € Kapital erreicht sind (dann automatisch
  GmbH-fähig).
- **GmbH** braucht 25.000 € Stammkapital (mind. 12.500 € sofort
  eingezahlt) — bei deiner aktuellen Lage unrealistisch als Startpunkt.
- Die übliche Reihenfolge für genau diesen Fall ist deshalb: **UG jetzt,
  GmbH später**, nicht „warten, bis genug Geld für eine GmbH da ist".

Deine Sorge um die Kosten ist berechtigt, aber die UG ist im Vergleich zum
Risiko, das sie abdeckt, eine der günstigsten Positionen im ganzen Projekt.
**Deine Entscheidung:** UG jetzt (vor dem ersten zahlenden Kunden) oder
bewusst später — und falls später, wie du das Zwischenrisiko einschätzt.

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

**🔵 VOB-011 — ca. 10–54 € für echte DIN/VOB-Normtexte, drei Optionen.**
Legal braucht die echten Normtexte (18363/18365 u. a.), um mehrere offene
VOB-Fragen (u. a. VOB-006 oben) sauber zu klären, statt sich auf
Sekundärquellen zu verlassen. Drei Optionen liegen vor: **Bibliothekskarte
(~10 €)**, **komplettes VOB-Werk kaufen (~54 €)**, oder **nicht kaufen** und
mit den bisherigen Quellen weiterarbeiten. **Deine Entscheidung:** welche
der drei Optionen — Details in `docs/vob-angebot-abstimmung.md`.

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

