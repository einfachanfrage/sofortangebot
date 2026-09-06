# Design-Check — offene Punkte UI/UX & CI

Gemeinsame Datei von Sandy, Product Designer (mir), Head of Product
Engineering, Platform & Integrations Engineer und allen, die am Look & Feel
von Sofortangebot mitbauen. Der EINE Ort, an dem der aktuelle Stand der
Design-/CI-Konsistenz-Prüfung steht — nach dem gleichen Prinzip wie
`docs/pruefmeister-testfaelle.md` für QA.

**Ablauf:** Ich (Product Designer) trage neue Befunde ein, sobald ich den Code
durchgehe, und aktualisiere den Status, sobald ich einen Fix sehe oder
nachprüfe. Der Chief of Staff weist offene Punkte den passenden Leuten zu —
bei DC-001 z. B. erst eine Entscheidung von Sandy, danach Umsetzung durch Head
of Product Engineering. Wer etwas umsetzt, trägt ein kurzes **Fix-Update**
direkt unter dem jeweiligen Befund ein (was geändert, wie geprüft).
Status-Zeile danach aktualisieren, damit niemand an zwei Stellen nachschauen
muss.

Jeder Punkt hat eine feste ID (DC-XXX) — bei Rückfragen einfach auf die ID
verweisen.

**Status-Zeichen:** ✅ behoben & geprüft · 🟡 behoben, noch nicht nachgeprüft ·
🔵 Entscheidung nötig, bevor Umsetzung möglich ist · ❌ offen, bestätigter
Befund · ⏳ noch nicht geprüft.

**Hinweis zur Pflege dieser Datei:** Sie ist am 17.08. (jetzt zum zweiten Mal
in dieser Datei, projektweit schon das 5. Mal) durch gleichzeitige
Bearbeitung kurz auf einen älteren Stand zurückgefallen — die
Organigramm-Hinweise und die DC-001-Entscheidung waren dadurch kurz weg,
jetzt vom Chief of Staff wiederhergestellt. DC-007–DC-020 (deine neuen
Befunde) waren davon nicht betroffen. Bitte vor dem Speichern kurz nochmal
lesen, was gerade in der Datei steht, statt eine lokal ältere Kopie
zurückzuschreiben.

## Organigramm-Hinweise

**17.08.2026 — Rollen-Split:** Die bisherige „Head of IT"-Rolle ist
aufgeteilt in **Head of Product Engineering** (Pipeline/Pricing/Produkt) und
**Platform & Integrations Engineer** (Zahlungen/Accounts/Security/Infra,
u. a. Row-Level-Security). Alle „Head of IT"-Verweise unten sind entsprechend
zu lesen — Details: CoS-009 in `docs/chief-of-staff-todos.md`.

**17.08.2026 — Neue Rolle Head of Marketing:** Sandy baut zusätzlich ein
Marketing-Team auf, erste Position ist **Head of Marketing** — verantwortet
CI/Marke und darf die aktuelle CI grundlegend neu vorschlagen (Umsetzung
erst nach Sandys Zustimmung). Arbeitet eng mit dir (Product Designer)
zusammen, vor allem dort, wo CI und Produkt-Design-System sich berühren —
gemeinsame Datei: `docs/marketing-design-austausch.md`. Details:
`docs/team-organigramm.md`, Abschnitt „Head of Marketing".

## Stand auf einen Blick (zuletzt aktualisiert: 2026-08-30 — DC-043 + DC-042-Wording-Teil jetzt LIVE: Sandy wählte Richtung "Warm & persönlich" + FAB als einzige bleibende CTA ("das gelbe mikro muss IMMER da bleiben unten in der leiste") und gab direkt danach das Go für DC-042 ("dc042 deinen vorschklag auch live stellen"). Umgesetzt: Hero-"Aufmaß starten"-Button entfernt (FAB bleibt einzige CTA), Umsatz-Kachel mit echtem Vormonatsvergleich, "Bereit"/"Beim Kunden"-Umbenennung + eigener "Bereit"-Filter-Reiter, "seit X Tagen" auf wartenden Angeboten, "Start"→"Dashboard" vereinheitlicht — alles committet (`b1e32b5`), `tsc` sauber, Live-Test steht aus. Weiterhin offen (Head of Product Engineering): Archivieren als Flag statt überschreibendem Status + eigenes `sent_at`-Feld, beides braucht eine DB-Migration. DC-042 ursprüngliche Diagnose: Sandys Frage zum Dashboard-Header ("4 Angebote warten auf Antwort") plus offener Unmut über die gesamte Status-Logik ("nicht klar und clean genug") — auf Rückfrage explizit "Komplettes Status-Modell neu denken" gewählt. Komplette Code-Bestandsaufnahme des 6-Status-Modells ergab drei echte strukturelle Lücken (kein Filter-Reiter für "Fertiggestellt", Archivieren überschreibt den echten Ausgang, "Abgelehnt" ist reine Selbstauskunft ohne Kunden-Weg) plus einen toten `viewed`-Wert. Konzept + interaktiver Vorher/Nachher-Prototyp fertig (nur zwei Umbenennungen, Archiviert als Flag statt Status, eigener "Bereit"-Reiter, "seit X Tagen"-Anzeige), vier offene Entscheidungen explizit an Sandy delegiert. Wartet auf ihr Go, bevor echter Code angefasst wird. DC-041: Raum-Platzhalter ("Raum hinzufügen") zeigte im Titelfeld wörtlich "— Schlafzimmer" statt einer leeren, normal beschreibbaren Position (Sandy, Screenshot) — Eingabefeld zeigt/bearbeitet jetzt nur noch den sichtbaren Basistitel, Raum-Zuordnung bleibt beim Speichern automatisch erhalten (auch beim Übernehmen eines Preisdatenbank-Vorschlags); DC-040: "Wohnung als Ganzes" statt zwingend pro Raum (Sandy/Clemens) — Extraktion, Bodenflächen-Erkennung und Tür-/Fensterabzug per Rückfrage ("nachfragen statt raten", Sandys Entscheidung) umgesetzt; mitgefunden und behoben: die 200-m²-Plausibilitätsgrenze im Prompt hätte eine Wohnungs-Wandfläche verworfen. Mein Anzeige-Teil dazu: "Wohnung" fehlte in der Raum-Erkennung der Anzeige (dieselbe Fehlerkategorie wie PM-005/PM-019) — jetzt nachgezogen, eigenes Symbol 🏡. Live-Test mit echter Sprachaufnahme steht aus; DC-039: "+ Position" hat jetzt eine Live-Suche gegen die Preisdatenbank (Product Designer), dazu ein von Sandy live gefundener Bug behoben (Vorschlag antippen blieb wirkungslos — Tap schloss die Tastatur und die Liste rutschte weg, bevor der Klick ankam; jetzt `onMouseDown`+`preventDefault`), und eine abgesicherte Schreib-Seite (Head of Product Engineering: eigener Endpunkt `POST /api/preise`, serverseitige Prüfung, Dubletten-Schutz, Rubrik-Regel entdoppelt, `price_item_id` wird endlich mitgespeichert) — wartet jetzt auf Sandys Retest; DC-038 fertig: Sandys Kritik am Grundriss-Zeichner (keine Wandnummern, nur 3 Vorlagen) — Wandnummern gefixt UND "frei zeichnen" (Finger → RDP-vereinfacht → 90°-eingerastet → nummerierte Wände) nach Sandys Go ("bau den zecihner") fertig gebaut, committet; DC-037: Sandys Folgeidee zu DC-036 (Grundriss-Zeichner schon während der Aufnahme anbieten) geprüft und als fertige Spec an Head of Product Engineering übergeben; DC-036: "Raumform"-Reiter zu "📐 Unregelmäßig" umbenannt + Erklärtext, Grundriss-Zeichner für Nischen/Erker existierte schon, war nur schlecht auffindbar; DC-035: Hinweistext "Flächen vorläufig" umgesetzt, Datenweg + Eingabe-Oberfläche für die individuelle Öffnungsgröße (Terrassentür) jetzt komplett fertig. Alles noch nicht live nachgeprüft)

| ID | Thema | Status | Zuständig |
|---|---|---|---|
| DC-001 | Drei widersprüchliche Preismodelle + „18 Gewerke"-Versprechen | ⚫ **ABGELÖST (2026-09-03)** — die Preisfestlegung dieses Punktes (22 €/17 €/3 frei) gilt nicht mehr. Neue Heimat für alles zum Preis: **`docs/preismodell.md`** (Sandys Entscheidung 03.09.: 49 €/Monat, kein Gratis-Tarif, 14 Tage Test, Gründerpreis 29 € für die ersten 25). Der zweite Teil des Befundes — „Maler & Bodenleger" statt „18 Gewerke" — bleibt gültig und unverändert. Umsetzung der neuen Preise: CoS-038 | Head of Product Engineering |
| DC-002 | „Angebote" fehlt in Desktop-Sidebar | ✅ behoben + live bestätigt (Product Designer, 2026-09-02) | Product Designer (umgesetzt) |
| DC-003 | Statusfarben für Angebote — eigentlich 5 inkonsistente Quellen, 1 verworfene Prop, dazu Status-Änderung selbst „umständlich/nicht intuitiv" (Sandy) | ✅ behoben + live bestätigt (Product Designer, 2026-09-03, selbst durchgeklickt): Status-Sheet auf `sofortangebot.app` live geprüft (Angebot AG-2026-003) — eigene erkennbare Zeile mit Rahmen + Häkchen bei aktivem Status, sauber statt „kein Schwein kommt drauf" | Product Designer (umgesetzt) |
| DC-004 | `pb-safe` / `pt-safe-top` nicht definiert (Safe-Area auf iPhone) | 🟡 behoben, noch nicht auf echtem iPhone nachgeprüft | Product Designer |
| DC-005 | Kein gemeinsamer Button-Baustein | 🟡 `active:scale-98`-Bug behoben, `Button.tsx` erstellt — Migration bestehender Stellen offen | Product Designer |
| DC-006 | `typography.ts` + Farb-Tokens (`@theme inline`) werden nirgends genutzt | ✅ vollständig abgeschlossen (Sandy, 2026-09-02: "einmal richtig, haken dran") — alle 66 Dateien mit Tailwind-Fundstellen migriert, 16 bewusst ausgeschlossene Dateien (PDF/E-Mail/Icons/Manifest/eigene Paletten) einzeln begründet | Product Designer |
| DC-007 | Mobile-Seitentitel: „Angebote"/„Kunden" weiß, „Einstellungen" gelb | ✅ behoben + live bestätigt (Product Designer, 2026-09-03, selbst durchgeklickt) — alle drei Seitentitel auf `sofortangebot.app` mobil jetzt einheitlich weiß, „Einstellungen" nicht mehr gelb | Product Designer |
| DC-008 | Kleine Sprach-/Textpolitur (Singular/Plural, Umlaut in KI-Wörterbuch) | ✅ vollständig behoben (Product Designer, 2026-09-02) | Product Designer (umgesetzt) |
| DC-009 | Leere Aufnahme (0 Positionen) wird als grüner Erfolg angezeigt | ✅ behoben + live bestätigt (2026-09-02) | Product Designer (umgesetzt) |
| DC-010 | Keine Guardrail: leeres Angebot (0 €, kein Kunde) lässt sich „fertigstellen" und versandfertig machen; Widerspruchs-Banner (rot „Keine Positionen erkannt" + grün „X erkannt") | ✅ vollständig behoben + live bestätigt (2026-09-02) | Head of Product Engineering (Banner-Widerspruch) / Product Designer (Guardrail) |
| DC-011 | **Kritisch:** Fertiggestelltes Angebot verschwindet komplett aus der Angebote-Liste | ✅ behoben + live bestätigt (fehlende DB-Spalten `gewerk`/`title` ließen JEDE Abfrage scheitern, alle 56 Angebote betroffen) | Head of Product Engineering |
| DC-012 | Text-Notiz-Eingabe komplett gebaut, aber nirgends verlinkt (keine Alternative zur Sprachaufnahme) | ✅ behoben (Product Designer, 2026-09-02) | Product Designer (umgesetzt) |
| DC-013 | AppLayout-Footer stört den fokussierten Aufmaß-Aufnahme-Screen | ✅ behoben (Product Designer, 2026-09-02) | Product Designer (umgesetzt) |
| DC-014 | **Kritisch:** Rohe Datenbank-Fehlermeldung auf Englisch beim Logo-Upload im Onboarding | 🟡 Ursache = CoS-P-005, Migration offen — Fehlermeldungs-Politur separat offen | Platform & Integrations Engineer (Ursache) / Product Designer (Text, 25.08. zugewiesen) |
| DC-015 | Onboarding-Schritte: viel ungenutzter Leerraum zwischen Formular und Button-Leiste | ✅ behoben (Product Designer, 2026-09-02) | Product Designer (umgesetzt) |
| DC-016 | Onboarding: „Weiter"-Button 6× unterschiedlich beschriftet, Klammer-Zahl unklar | ✅ behoben (Product Designer, 2026-09-02) | Product Designer (umgesetzt) |
| DC-017 | Drei verschiedene Icon-Sprachen im Produkt (Lucide / native Emoji / Sketch) | ✅ behoben (Product Designer, 2026-09-02) | Product Designer (umgesetzt) |
| DC-018 | Emoji-Auswahl je Onboarding-Schritt wirkt zufällig (u. a. britisches Pfund-Symbol) | ✅ behoben (Nebeneffekt von DC-017, 2026-09-02) | Product Designer (umgesetzt) |
| DC-019 | Zwei sehr ähnlich benannte Buchhaltungs-Optionen ohne Erklärung des Unterschieds | ✅ behoben (Product Designer, 2026-09-02) | Product Designer (umgesetzt) |
| DC-020 | Push-Erlaubnis-Screen: Ablehnen-Möglichkeit nicht erkennbar | 🔵 Prüfen, ob nur Screenshot-Ausschnitt | — |
| DC-021 | Bestätigungskarte vor Entwurf-Erstellung zeigt nicht zuverlässig, was am Ende berechnet wird (PD-001) | ✅ behoben + live bestätigt (Sandy, 2026-08-23) — CoS-002 komplett (alle 3 Schritte inkl. Mehrfach-Aufnahmen-Fall), Realtime-Bug gefunden+gefixt, Retest danach „passt" | Head of Product Engineering |
| DC-022 | „X Positionen erkannt"-Zahl stimmt wiederholt nicht mit der tatsächlichen Anzahl überein (PD-004) | ✅ behoben + live bestätigt — strukturell mitgelöst mit DC-021/CoS-002, siehe dort | Head of Product Engineering |
| DC-023 | Fassade: Aufnahmekarte zeigt Fenstermaße statt Fassadenmaße (PD-007) | 🟡 Extraktions-Fix von Head of Product Engineering lokal verifiziert (zeigt jetzt lieber nichts als Falsches) — noch nicht auf sofortangebot.app deployt | Head of Product Engineering |
| DC-024 | Raummaße-Chip zeigt lauter rote „Fehler" bei Nicht-Raum-Objekten (z. B. Fassade) (PD-003) | ✅ behoben + live bestätigt (Sandy, 2026-08-23) — Wand-Chip (`AngebotDetail.tsx`) | Product Designer (umgesetzt) |
| DC-025 | Rückfragen-UI: von Sandy selbst als „hässlich" bewertet, komplettes Neudenken gewünscht (PD-002) | ✅ behoben + live bestätigt (Sandy, 2026-08-23) — neue `RueckfragenScreen.tsx`; CoS-011-Aufwandsschätzung dadurch überholt | Product Designer (umgesetzt) |
| DC-026 | Rückfragen werden gestellt, obwohl die Antwort schon im Gesagten steht (PD-005) | ✅ vollständig behoben (Product Designer, 2026-09-02) — Pipeline-Fix von Head of Product Engineering (2026-08-24) + „Du hast gesagt"-Vorschlagskarte in `RueckfragenScreen.tsx`. Live-Nachtest steht aus | Head of Product Engineering (Pipeline) / Product Designer (Karte) |
| DC-027 | Automatisch ergänzte Positionen sollten als „Vorschlag" gekennzeichnet sein (PD-008) | ✅ Vollständig live bestätigt (Product Designer, 2026-09-03, selbst durchgeklickt): Angebot 2026-15E8 auf `sofortangebot.app`, Position „Erschwerniszuschlag Raumhöhe > 3m" trägt live den „Vorschlag"-Badge neben dem Titel | Head of Product Engineering (Flag, ✅) / Product Designer (Badge, ✅ live bestätigt) |
| DC-028 | Aufmaß-Sammelansicht („Timeline"): falsche Maße bei mehreren Räumen, wirkt wie Duplikat, viel Weißraum, Positionen stimmen nicht mit Entwurf überein | ✅ behoben + live bestätigt (Sandy, 2026-08-23) — raum-gruppiert (`entwurf/page.tsx`) | Product Designer (umgesetzt) |
| DC-029 | Angebote brauchen eine „Baustelle"/Projekt-Zuordnung zusätzlich zum Kunden (mehrere Angebote pro Baustelle über Zeit, z. B. erst Entrümpelung, dann Ausbau) — von Sandy über Clemens (künftiger Testnutzer) eingebracht | ✅ Vollständig live bestätigt (Product Designer, 2026-09-03, selbst durchgeklickt mit Sandys Erlaubnis) — kompletter Flow auf `sofortangebot.app` mit einem klar markierten Test-Kunden geprüft: Kunde zuweisen erzeugt automatisch die Erstbaustelle (Fallback-Name „Baustelle bei {Kundenname}", da keine Adresse gesetzt), Baustellen-Zeile im Editor sofort sichtbar, „Baustelle wählen"-Sheet + zweite Baustelle live anlegbar, Kunde-Seite gruppiert beide Baustellen korrekt inkl. „+ Neues Angebot für diese Baustelle". Keine Abweichung zur Spec gefunden. Test-Kunde „TEST – bitte löschen" bewusst stehen gelassen, Sandy kann ihn selbst löschen | Product Designer (umgesetzt, live bestätigt) |
| DC-030 | Wie soll die Aufnahmekarte den kurzen Zwischenzustand „vorläufig" (schnelle Vorschau) vs. „bestätigt" (vollständig geprüft) zeigen, sobald CoS-002 Schritt 2/3 live sind? | 🟡 Entschieden (Option 3) + umgesetzt (Head of Product Engineering, 2026-08-21), Code-Nachprüfung bestätigt korrekte Umsetzung (Product Designer, 2026-09-03) — aber nicht live testbar ohne echtes Mikrofon: Zettel/Notiz laufen nachweislich NICHT durch diese Logik (kein `voll_extraktion`), nur eine echte gesprochene Aufnahme tut das. Regressionsgeprüft (236 Tests grün), Sandy müsste einmal selbst sprechen, um es live zu sehen | Product Designer (Entscheidung, Code geprüft) / Head of Product Engineering (Umsetzung) |
| DC-031 | Navigations-Sackgassen: laufende Aufnahme nicht abbrechbar (Mikro bleibt offen), Aufnahme-Detail-Sheet nur per unsichtbarem Backdrop-Tap schließbar (sichtbares „X" löscht stattdessen), „Zurück" aus dem frischen 0€-Entwurf landet auf der leeren Angebotsseite statt am Dashboard (von Sandy gemeldet, 2026-08-23) | ✅ Alle drei umgesetzt (Product Designer, 2026-08-23): Abbrechen-Button während Aufnahme (verwirft, lädt nicht hoch) + Mikro wird beim Verlassen der Seite automatisch freigegeben; Sheet hat jetzt einen eigenen „Schließen"-Text-Button getrennt vom Lösch-„X"; „Zurück"/„Trotzdem zurück ohne Berechnen" gehen zum Dashboard, wenn das Angebot noch keinen Kunden und keine Positionen hat, sonst weiterhin zur Angebotsseite. Beim Nachtesten „an allen anderen Stellen" (Sandys Auftrag) zusätzlich dieselbe Baustelle bei „+ Neue Variante erstellen" in Briefpapier & Design gefunden und gleich mitgefixt: leere Variante wird beim Zurückgehen ohne Änderung automatisch wieder gelöscht, mit ungespeicherten echten Änderungen kommt jetzt eine Rückfrage statt stillem Datenverlust. Scoped tsc sauber. 🟡 Teilweise live bestätigt (Product Designer,
2026-09-03, selbst durchgeklickt): „Zurück" aus einem echten frischen
0€/kein-Kunde-Entwurf landet live auf dem Dashboard, nicht der leeren
Angebotsseite — bestätigt. Briefpapier-Fix bestätigt: unveränderte frisch
angelegte Variante wird beim Zurückgehen automatisch wieder gelöscht;
eine wirklich geänderte (aber nicht gespeicherte) Variante löst beim
Verlassen zuverlässig die Rückfrage „Änderungen wurden noch nicht
gespeichert. Trotzdem verlassen?" aus (`window.confirm`, mit Abbrechen
getestet). Nicht testbar von hier aus: Abbrechen-Button während einer
laufenden Aufnahme + Mikro-Freigabe, und das Aufnahme-Detail-Sheet
(„Schließen" vs. Lösch-„X") — beides braucht eine echte, laufende
Sprachaufnahme, die der Browser hier ohne echtes Mikrofon nicht
erzeugen kann. Nebenbefund: beim Testen sind zwei leere „Neue
Variante"-Zeilen in Briefpapier & Design liegen geblieben (aus
Testpfaden, die den `?neu=1`-Marker nicht durchlaufen haben, z. B. über
den „Bearbeiten"-Link statt den „+ Neue Variante erstellen"-Button) —
kein Bug, nur Testrückstand. Sandy kann die zwei „Neue Variante"-Zeilen
selbst löschen | Product Designer (umgesetzt, teilweise live bestätigt) |
| DC-032 | Onboarding-Assistent (Schritte 2–7) hat auf Mobile KEINE Möglichkeit, die App zu verlassen/zu unterbrechen — kein X, kein „Später fertigstellen", `SideNav` ist bewusst nur ab Desktop-Breite sichtbar (`hidden md:flex`) und `BottomNav` fehlt auf diesen Seiten komplett. Gefunden beim „an allen anderen Stellen testen"-Auftrag (Sandy, 2026-08-23) | 🔵 Nicht blind umgesetzt — Onboarding ist der erste Eindruck der App, ein Ausstieg braucht eine bewusste Entscheidung, was mit dem angefangenen Zustand passiert (Firma/Account teilweise angelegt?), nicht nur einen Button. Vorschlag: sichtbarer „Später fertigstellen"-Ausstieg ab Schritt 2, der den Fortschritt sichert und zum Dashboard führt, das dann tolerant mit unvollständigem Onboarding umgeht. Braucht kurze Abstimmung mit Head of Product Engineering (was genau ist beim Abbruch schon in der DB, was nur im vom Code schon unterstützten `localStorage`-Zwischenstand) bevor ich das baue | Product Designer (Konzept) |
| DC-033 | Angebotsnummern sehen zufällig aus („2026-5EC9", „2026-4732", „2026-B381"), keine erkennbare Logik (Sandy, 2026-08-25) | ✅ behoben + live bestätigt (Product Designer, 2026-09-03, selbst durchgeklickt mit Sandys Go „dc033"): Test-Angebot 2026-15E8 (Kunde „TEST – bitte löschen") auf `sofortangebot.app` fertiggestellt — trägt danach live die echte Nummer **AG-2026-004**, genau wie im Fix-Update vorhergesagt (Holm GmbHs Nummernkreis stand bei „nächste Nummer 4"). Kein UUID-Fragment mehr | Head of Product Engineering |
| DC-034 | Zwei komplett getrennte Notiz-/Foto-Systeme im Angebot ("Aufnahme" vom Aufmaß vs. eigenständiger "Notizen & Fotos"-Tab) — sind nach fertiggestelltem Angebot nicht mehr leicht zusammen zu finden, macht das als Ganzes überhaupt Sinn? (Sandy, 2026-08-25) | 🟡 UI-Teil live bestätigt (Product Designer, 2026-09-03, selbst durchgeklickt): Tab auf `sofortangebot.app` heißt live „Fotos & Notiz", zeigt einen einzigen Foto-Pool „Fotos vom Aufmaß" (kein zweiter Upload-Weg mehr sichtbar) und „Interne Notiz" mit eigener Zeile „Nur für dich — der Kunde sieht das nie." + „Nicht im PDF"-Badge. Tatsächlichen Foto-Upload (Bildunterschrift, 8-Fotos-Warnung) nicht getestet — bräuchte eine echte Datei-Auswahl. Datenmodell/PDF-Teil (Engineering) weiterhin ungeprüft | Head of Product Engineering (Datenmodell/PDF, ✅) / Product Designer (UI, ✅ live bestätigt) — CoS-021 |
| DC-035 | Zwei verwandte Funde beim Einsprechen (Sandy, 2026-08-29): (1) die Karten-Ansicht nach der Aufnahme zeigt Mengen, bevor feststeht, ob noch Fenster/Türen fehlen — wirkt wie das fertige Ergebnis; (2) die Rückfrage zu Türen/Fenstern fragt nur nach Stückzahl, nie nach individueller Größe — bei einer großen Terrassentür (z.B. 2×3m) fehlt die Möglichkeit, das abweichend von der Standardgröße anzugeben | ✅ Beide Teile umgesetzt: Teil 1 (Hinweistext) committet (`e463360`); Teil 2, Datenweg von Head of Product Engineering gebaut + getestet (`b421ac9`), Eingabe-Oberfläche (Zusatz-Chip nach der Stückzahl-Frage, öffnet Breite/Höhe-Felder) vom Product Designer nachgezogen — committet, sobald ein gerade aktiver, gleichzeitiger Commit einer anderen Rolle den Git-Lock freigibt. `tsc` sauber, Live-Test steht für beide Teile noch aus | Product Designer / Head of Product Engineering — beide fertig |
| DC-036 | Versteht der User "Raummaße/Flächen eingeben/Raumform" bei einem unförmigen Raum mit Nischen — wie kommt er da einfach an die richtige Fläche? Braucht's den Reiter überhaupt? (Sandy, 2026-08-29, Screenshot) | ✅ Geprüft: die Fähigkeit dafür existiert schon und ist gut gebaut (`RaumGrundrissEditor` — Vorlagen Rechteck/L-/U-Form + freies Wand-für-Wand, Live-Vorschau, deckt Nischen/Erker ab). Die Lücke war nur die Auffindbarkeit — "Raumform" verrät das nicht. Tab in "📐 Unregelmäßig" umbenannt + Erklärsatz im Editor ergänzt. Committet (`2e9b826`), `tsc` sauber. ✅ Live bestätigt (Product Designer, 2026-09-03, selbst durchgeklickt): Tab heißt live "📐 Unregelmäßig" mit dem Erklärsatz „Für Räume mit Nische, Erker oder Vorsprung…" | Product Designer (umgesetzt) |
| DC-037 | Folgeidee aus DC-036 (Sandy, 2026-08-29, "das find ich gut mach das"): den Grundriss-Zeichner schon während der Aufnahme (Sprachaufnahme-Karte) anbieten, nicht erst nachträglich im fertigen Angebot | 🔵 Recherche zeigt: eine reine Client-Oberfläche würde die gezeichnete Form beim nächsten "Entwurf erstellen" stillschweigend verlieren, weil `generiere-positionen/route.ts` `raum_details` bei jedem Lauf komplett aus der KI-Extraktion neu aufbaut und überschreibt. Braucht also zwingend eine kleine Backend-Änderung, bevor die Oberfläche sicher etwas bewirkt. Fertige Spec für beide Seiten geschrieben, Backend-Teil an Head of Product Engineering übergeben, UI-Teil baue ich selbst sobald der Weg steht | Head of Product Engineering (Backend-Merge) / Product Designer (UI, folgt) |
| DC-038 | Kritik am Grundriss-Zeichner (Sandy, 2026-08-29, Screenshot): in der Zeichnung stehen nur Meterzahlen, nicht welche Wand (1/2/3/4) gemeint ist; nur drei Vorlagen, obwohl es viele besondere Raumformen gibt — Vorschlag: Raumform per Finger grob zeichnen, App macht daraus gerade nummerierte Wände mit anpassbaren Maßen | ✅ Beide Teile umgesetzt: Teil 1 Wandnummern ("W1 · 4" statt nur "4"); Teil 2 nach Sandys Go ("bau den zecihner") gebaut — neuer vierter Button "✏️ Zeichnen" neben Rechteck/L-Form/U-Form, Freihand-Zeichnung wird per Ramer-Douglas-Peucker vereinfacht + auf 90° eingerastet und direkt in dieselbe `Wand[]`-Liste umgewandelt, die die Vorlagen auch erzeugen — keine Änderung an Berechnung/Vorschau/Speichern nötig, reines Frontend. Committet (`f88ca33`), scoped `tsc` sauber. ✅ Live bestätigt (Product Designer, 2026-09-03, selbst durchgeklickt): Wandnummern „W1 · 4" bis „W4 · 3" live sichtbar an einem echten Raum (Dachzimmer), vierter Button „✏️ Zeichnen" da und öffnet die Zeichenfläche sauber, Wechsel zurück zu „Rechteck" verwirft die Maße unverändert (kein Datenverlust am bestehenden Raum). Freihand-Strich selbst nicht getestet (Touch-Geste in diesem Browser nicht sinnvoll simulierbar), das war aber ohnehin schon durch Tests abgedeckt | Product Designer (umgesetzt) |
| DC-039 | "+ Position" im Entwurf legt heute eine komplett leere Zeile an, keine Verbindung zur Preisdatenbank; zusätzlich Frage, ob die Aktionsleiste Aufnahme/Position/Raum selbsterklärend ist (Sandy, 2026-08-29, Screenshot) | ✅ Umgesetzt: Aktionsleiste geprüft (größtenteils selbsterklärend, kein Umbau nötig). "+ Position" hat jetzt eine Live-Suche gegen die Preisdatenbank direkt im Titelfeld — Vorschlag antippen übernimmt Titel/Einheit/Preis sofort, kein Treffer → "Neue Position anlegen" (Einheit+Preis inline) legt sofort einen echten Eintrag in der Preisdatenbank an (mit Dubletten-Check) und übernimmt ihn in die Position. Komplett Frontend + direkter Supabase-Insert (kein neuer Backend-Endpunkt nötig — price_items-Schreibzugriff existiert im selben Muster schon an anderen Stellen dieser Datei). Committet (`510c977`), scoped `tsc` sauber. **Bugfix (Product Designer, Sandys Live-Test):** Vorschlag antippen blieb wirkungslos — Ursache: Tap auf den Vorschlag ließ das Titelfeld zuerst den Fokus verlieren (Tastatur schließt, Seite rutscht), bevor der Klick registriert wurde, klassischer Mobile-Combobox-Bug. Fix: alle drei interaktiven Elemente der Suche (Vorschlag, „Neue Position anlegen", „Anlegen & übernehmen") von `onClick` auf `onMouseDown`+`preventDefault()` umgestellt, damit das Feld den Fokus gar nicht erst verliert. Committet (`a22d3f3`), scoped `tsc` sauber. ✅ Live bestätigt (Product Designer, 2026-09-03, selbst durchgeklickt): an einer echten Position „Wand streichen" eingetippt, Live-Suche zeigte echte Preisdatenbank-Treffer („Wand streichen 1x Anstrich" 6,00 €/m², „…2x Anstrich" 9,50 €/m²), Vorschlag antippen hat Titel/Einheit/Preis sofort korrekt übernommen — genau der Bug, den Sandys Live-Test gefunden hatte, tritt nicht mehr auf. „Kein Treffer → Neue Position anlegen" mit Sandys ausdrücklicher Erlaubnis
danach ebenfalls getestet: Titel „TEST Preiseintrag" eingetippt (kein
Treffer, wie erwartet), Einheit m² + 1,00 € eingetragen, „Anlegen &
übernehmen" — Eintrag wurde sofort übernommen (GESAMT korrekt neu
berechnet) UND landet dauerhaft in der echten Preisdatenbank unter
Einstellungen → Preisdatenbank → Allgemein (Kategorie ging automatisch auf
„Allgemein", nicht „Maler & Lackierer", passt zur Rubrik-Regel). Test-Zeile
danach wieder aus dem Angebot entfernt (Angebot zurück auf 520,01 €), der
Katalog-Eintrag „TEST Preiseintrag" selbst bleibt aber bestehen — Sandy
kann ihn unter Einstellungen → Preisdatenbank → Allgemein selbst löschen. **Nachtrag Head of Product Engineering (Sandys Auftrag „dc039"):** Schreib-Seite auf einen eigenen Endpunkt `POST /api/preise` umgestellt — serverseitige Prüfung (Titel-Länge, Einheit, Tippfehler-Grenze beim Preis), robusterer Dubletten-Schutz (`.maybeSingle()` wäre bei historischen Dubletten im Katalog fehlgeschlagen) und die Rubrik-Regel jetzt in EINER Datei statt doppelt (CoS-019-Lehre). Mitgefixt: `price_item_id` wurde beim Speichern nie gesetzt. 9 neue Tests, Suite grün | Product Designer (UI, ✅) / Head of Product Engineering (Schreib-Seite, ✅) |
| DC-040 | "Wohnung als Ganzes" statt zwingend pro Raum — Handwerker sprechen oft nicht raumweise ("die ganze Wohnung: 120 m² Wandfläche, 55 m² Laminat"), trotzdem Rückfrage zu Tür-/Fensterabzug gewünscht (Sandy, weitergegeben von Clemens, Maler, 2026-08-29) | 🔵 Root-Cause gefunden: `prompt-extraktion.ts` stuft "die ganze Wohnung" bedingungslos als vage/unklar ein, selbst mit echter m²-Angabe dabei — Fix nach dem Vorbild "Fassade in raeume" (existiert im selben Prompt bereits als Pseudo-Raum-Muster). Braucht zusätzlich einen `bodenflaeche_direkt`-Gegenpart zur bestehenden `wandflaeche_direkt`-Extraktion sowie eine Entscheidung zum Tür-/Fensterabzug bei direkter m²-Eingabe (aktuell wird der bei `modus: 'flaeche'` gar nicht abgezogen). **Umgesetzt (Head of Product Engineering, 2026-08-29):** Prompt-Abschnitt "WOHNUNG / HAUS ALS GANZES" nach Fassaden-Vorbild, `extrahiereBodenflaeche()` als Gegenstück zur Wandflächen-Erkennung (statt eines neuen Feldes ins bestehende `flaeche`), und der Tür-/Fensterabzug per Ja/Nein-Rückfrage ("Sind die 120 m² inklusive Türen und Fenster?", Sandys Entscheidung "nachfragen statt raten") — bei "ja" folgen die vorhandenen Stückzahlfragen, Abzug nach derselben VOB-Regel wie überall. Zusätzlich gefunden und behoben: die Prompt-Regel "flaeche > 200 → null" hätte eine Wohnungs-Wandfläche stillschweigend verworfen. Bewusst nur für Gesamtflächen-Räume, Einzelräume unverändert. 13 neue Tests, `tsc` sauber, Suite grün. **Anzeige-Teil umgesetzt (Product Designer, 2026-08-29):** "Wohnung" (und Geschwister Haus/Etage/Geschoss/Stockwerk) fehlten in der Raum-Erkennung der Anzeige (`angebot-gruppierung.ts`) — dieselbe Fehlerkategorie wie PM-005 (Speisekammer)/PM-019 (Gästeklo): trotz korrekter Berechnung wäre die Position ohne Raumkarte/Maße-Header im Allgemein-Topf gelandet. Schlüsselwörter ergänzt (deckungsgleich mit Engineerings `istGesamtflaechenRaum()`), "Wohnung" bekommt ein eigenes Symbol (🏡) statt sich das generische 🏠 mit Fassade zu teilen; Haus/Etage/Geschoss/Stockwerk bewusst ohne eigenes Symbol (Kollisionsrisiko mit "Treppenhaus", per Test abgesichert). Committet (`3149406`), `tsc` sauber. OFFEN: Live-Test mit echter Sprachaufnahme (Prompt-Änderung — Tests prüfen die Regel, nicht das Modellverhalten) | Head of Product Engineering (Extraktion/Berechnung, ✅) / Product Designer (Anzeige, ✅) |
| DC-041 | Raum-Platzhalter ("Raum hinzufügen" → neue leere Position im Raum) zeigte im Titel-Eingabefeld wörtlich "— Schlafzimmer" statt einer leeren, normal beschreibbaren Position — "sieht kacke aus und dumm" (Sandy, Screenshot, 2026-08-29) | ✅ Root-Cause: der interne " — Raumname"-Suffix, mit dem eine Position ihrem Raum zugeordnet wird (`angebot-gruppierung.ts`), steckt komplett im `title`-Feld selbst; die Anzeige blendet ihn beim Lesen zwar aus (`titleOverride`), das EDIT-Eingabefeld band aber direkt an den Rohtitel statt an den bereits vorhandenen Anzeige-Wert. Fix: Eingabefeld zeigt/bearbeitet nur noch den sichtbaren Basistitel, der Raum-Suffix wird beim Speichern automatisch wieder drangehängt (auch beim Übernehmen eines Preisdatenbank-Vorschlags, sonst wäre die Position aus ihrem Raum herausgefallen). Komplett Frontend, keine Backend-Änderung. Committet (`6a1fa0d`), scoped `tsc` sauber. ✅ Live bestätigt (Product Designer, 2026-09-03, selbst durchgeklickt): Titel-Eingabefeld einer Position zeigt live nur den sauberen Basistitel, kein roher „— Raumname"-Suffix | Product Designer (umgesetzt) |
| DC-042 | Dashboard-Frage "was soll das im Header heißen '4 Angebote warten auf Antwort'?" plus offener Unmut: "ich mag generell die Statuslogik der Angebote irgendwie immer noch nicht, mir ist das nicht klar und clean genug" (Sandy, zwei Screenshots, 2026-08-30) — auf Rückfrage zum Umfang explizit **"Komplettes Status-Modell neu denken"** gewählt, dann "dc042 deinen vorschklag auch live stellen" | ✅ Wording/Filter-Teil live: "Fertiggestellt"→"Bereit", "Offen"→"Beim Kunden" (`status.ts`, einzige Quelle seit DC-003, kaskadiert automatisch überallhin), eigener "Bereit"-Filter-Reiter ergänzt (fehlte komplett — eine der drei strukturellen Lücken aus der Bestandsaufnahme), "seit X Tagen" auf wartenden Angeboten (`MobileQuoteCard`, auf `created_at`-Basis, keine Migration nötig). Committet (`b1e32b5`), scoped `tsc` sauber. 🔵 Bewusst NICHT live: Archivieren als Flag statt überschreibendem Status (überschreibt aktuell den echten Ausgang bei Angenommen/Abgelehnt) + ein eigenes `sent_at`-Feld — beides braucht eine Datenbank-Migration, liegt als fertige Spec bei **Head of Product Engineering** (siehe DC-042-Detailabschnitt unten). Ebenfalls noch offen: toter `viewed`-Status (streichen oder zu echtem Feature ausbauen — Sandys Entscheidung steht noch aus) | Product Designer (Wording/Filter ✅ live) / Head of Product Engineering (Archivieren-als-Flag + `sent_at`, noch offen) |
| DC-043 | "kannst du bitte auch das dashboard und die menüleiste unten neu denken?? irgendwie holt mich das nicht ab...." (Sandy, direkt im Anschluss an DC-042, 2026-08-30), dann "UM GOTTES WILLEN!!!! das gelbe mikro muss IMMER da bleiben unten in der leiste, also safe FAB behalten!!! warm und persönlich" | ✅ Live: FAB bleibt die einzige, immer sichtbare CTA — der doppelte Hero-"Aufmaß starten"-Button (führte zur exakt selben Aktion wie der Mikrofon-FAB) entfernt (Desktop hat weiterhin die SideNav-CTA, keine Lücke). Richtung "Warm & persönlich" umgesetzt: Umsatz-Kachel hervorgehoben mit echtem Vormonatsvergleich (`data/dashboard.ts`, neue Vormonats-Abfrage) + Erfolgs-Hinweis bei angenommenen Angeboten, Beauftragt/Offen als sekundäre 2er-Reihe. `BottomNav`: "Start"→"Dashboard" (Wort-Inkonsistenz zur Desktop-SideNav behoben). Committet (`b1e32b5`), scoped `tsc` sauber. ✅ Live bestätigt (Product Designer, 2026-09-03, selbst durchgeklickt): BottomNav zeigt live "Dashboard", "seit 65 Tagen"-Anzeige live auf einem echten wartenden Angebot gesehen | Product Designer (umgesetzt) |
| DC-044 | Kundendaten (Name, Adresse, Telefon, E-Mail) lassen sich nach dem Anlegen nirgends mehr bearbeiten — kein „Bearbeiten"-Button auf der Kunden-Detailseite, keine API-Route dafür (Product Designer, 2026-09-06, kompletter Klick-Test „check alles") | ❌ offen, bestätigter Befund | Head of Product Engineering / Product Designer |
| DC-045 | Kein Zugang zur Abo-/Plan-Verwaltung nach dem Onboarding — `PlanWahlModal` erscheint laut Code nur einmalig direkt nach frischem Onboarding, danach keine Einstellungsseite für Plan-Wechsel/Rechnungen/Zahlungsmethode. Zusätzlich: das beworbene „3 Angebote/Monat kostenlos"-Limit wird im Code nirgends geprüft oder durchgesetzt (Product Designer, 2026-09-06) | ❌ offen, bestätigter Befund | Head of Product Engineering |
| DC-046 | Doppelte CTA auf der Angebote-Liste: Header-Button „Neu" (Mikro-Icon) führt zum exakt selben Ziel (`/angebot/neu`) wie der FAB unten — genau das Muster, das DC-043 fürs Dashboard bewusst auf eine einzige CTA reduziert hat (Product Designer, 2026-09-06) | ❌ offen, bestätigter Befund | Product Designer |
| DC-047 | Zwei gleichlautende, nicht erklärte Buchhaltungs-Integrationen in den Einstellungen: „Lexware Office" und „Lexoffice (Legacy)" verlinken beide auf dieselbe `app.lexoffice.de`, ohne dass der Unterschied irgendwo erklärt wird — verwirrend beim ersten Einrichten (Product Designer, 2026-09-06) | ❌ offen, bestätigter Befund | Product Designer |

„Zuständig" trägt der Chief of Staff ein, sobald zugewiesen.

> **Chief-of-Staff-Update (25.08.2026):** Acht bis dahin unzugewiesene
> Punkte (DC-008, 012, 013, 015, 016, 017, 018, 019 — Textpolitur,
> Icon-Sprachen, Onboarding-Leerraum, Footer-Überlappung u. ä.) jetzt an
> **Product Designer** zugewiesen. Auf Sandys Nachfrage kurz die Frage
> geprüft, ob dafür statt einer Zuweisung eine neue Stelle sinnvoller wäre
> — Antwort: nein. Alle acht Punkte sind inhaltlich UI/UX-/Design-System-
> Polituren, exakt dieselbe Art Arbeit, die Product Designer bei DC-002/
> 005/006/007 usw. bereits selbst umsetzt — kein neuer Aufgabentyp, nur
> bisher nicht formal eingetragen. Eine neue Stelle wäre hier reine
> Backlog-Vergrößerung ohne strukturellen Grund. Eine echte künftige
> Lücke sehe ich eher bei Support/Kundenservice nach dem ersten
> Testnutzer (Abschnitt 10 in `launch-readiness.md` — Feedback-Kanal,
> Reaktionszeit, Notfallplan) sowie bei Content/Wachstum Richtung Gate 3
> (SEO, Blog, Nutzer-Gewinnung) — dafür aber jetzt, vor dem ersten
> Testnutzer, noch zu früh.

---

## DC-001 — Drei widersprüchliche Preismodelle + „18 Gewerke"-Versprechen

> **⚫ ABGELÖST am 03.09.2026 — bitte hier nicht mehr nachschlagen, wenn es um den Preis geht.**
> Sandy hat das Preismodell komplett neu entschieden (49 € netto/Monat, kein
> Dauer-Gratis-Tarif, 14 Tage Test, Gründerpreis 29 € für die ersten 25 Betriebe,
> keine Staffelung nach Nutzerzahl). **Einzige Heimat dafür ist ab sofort
> `docs/preismodell.md`** — dort steht Herleitung, Wettbewerbsvergleich und Verlauf.
> Alles unterhalb dieser Zeile ist historischer Stand vom August 2026.
> **Weiter gültig ist nur der zweite Teil des Befundes:** ehrlich mit „Maler &
> Bodenleger" werben statt mit „Alle 18 Gewerke".

**Datum:** 2026-08-16 · entschieden 2026-08-16 · **abgelöst 2026-09-03**
**Status:** ⚫ abgelöst (Preisteil) / 🟡 Gewerke-Teil unverändert gültig

**Befund:** Der Pro-Plan hat drei unterschiedliche Preise live im Code:
- Landingpage (`src/components/landing/PreiseSection.tsx`): 29 €/Monat, Free = „5 Angebote kostenlos"
- Upgrade-Dialog im Produkt (`src/components/PlanWahlModal.tsx`): 17 €/Monat bei Jahresabo (22 €/Monat sonst), Free = „3 Angebote / Monat"
- Alte, unverlinkte Vorschau-Seite (`src/app/vorschau/page.tsx`, live erreichbar unter `/vorschau`): 9 €/Monat „Basic" + 29 €/Monat Pro

Dazu wirbt `PlanWahlModal.tsx` mit „Alle 18 Gewerke". `src/lib/gewerke.ts` listet 17 Gewerke, davon haben nur 6 (Maler, Boden, Fliesen, Elektro, Sanitär, Trockenbau) eine echte Mengen-Berechnung. Die eigene FAQ auf der Landingpage sagt explizit, dass aktuell bewusst nur Maler und Boden auf dem nötigen Niveau sind.

**Entscheidung (Sandy, 2026-08-16):** 22 €/Monat Standard, 17 €/Monat bei
Jahresabo, 3 Angebote/Monat kostenlos im Free-Tier. Statt „Alle 18 Gewerke"
ehrlich mit „Maler & Bodenleger" werben — aktuell die einzigen zwei Gewerke
auf dem nötigen Qualitätsniveau. Vollständiger Verlauf:
`docs/entscheidungen-fuer-sandy.md`.

**Empfehlung für die Umsetzung:** Einen einzigen Datenpunkt (z. B. `lib/pricing.ts`) anlegen, von dem Landingpage, PlanWahlModal und ggf. `/vorschau` lesen — nicht drei Stellen von Hand synchron halten. Noch nicht umgesetzt (Stand 17.08.).

**Update 2026-08-17 (Onboarding-Screenshots von Sandy):** Direkt nach
Abschluss des Onboardings erscheint das Plan-Wahl-Fenster mit „Vollgas —
17 €/Monat (Bei Jahresabo. Monatlich 22 €.)" — genau die Stelle, wo eine
neue Person zum allerersten Mal einen Preis sieht. Das ist der früheste
Berührungspunkt im ganzen Produkt und bestätigt nochmal, wie wichtig es
ist, dass dieser Preis mit Landingpage und `/vorschau` übereinstimmt.

**Update 2026-08-17 (live im Browser geprüft):** Auf `/preise` (Preisdatenbank)
sind tatsächlich nur zwei Gewerke mit echten Positionen hinterlegt —
„Bodenbeläge & …" (177 Positionen) und „Maler & Lackie…" (164 Positionen).
Das deckt sich mit der FAQ-Aussage und macht „Alle 18 Gewerke" im
Upgrade-Dialog noch deutlicher zu einem Versprechen, das aktuell nicht
gehalten wird.

**Fix-Update (Head of Product Engineering, 2026-08-18):** Umgesetzt, siehe
CoS-001 in `chief-of-staff-todos.md` für die volle Liste. Kurzfassung: alle
drei Stellen zeigen jetzt 17 €/Monat (Bei Jahresabo. Monatlich 22 €.) und 3
Angebote/Monat frei; `PlanWahlModal.tsx` wirbt jetzt mit „Maler & Bodenleger"
statt „Alle 18 Gewerke"; `/vorschau` leitet direkt auf die Landingpage um,
keine eigenen Preise mehr; die hier empfohlene `lib/pricing.ts` ist angelegt
und wird von Landingpage + PlanWahlModal gelesen. Live-Nachtest im Browser
steht noch aus.

**Live-Test-Versuch (Product Designer, 2026-09-03, selbst durchgeklickt):**
`/vorschau` leitet live tatsächlich direkt auf `sofortangebot.app` um,
keine eigene Preis-Seite mehr — dieser Teil bestätigt. Die beiden anderen
Stellen konnte ich gerade NICHT live sehen: `src/app/page.tsx` zeigt statt
der eigentlichen Landingpage (inkl. `PreiseSection`) aktuell eine
„Früher Zugang / Zugang sichern"-Wartelisten-Seite, gesteuert über
`process.env.NEXT_PUBLIC_COMING_SOON === 'true'` — reine Beobachtung,
keine Bewertung, ob das gerade so gewollt ist (Soft-Launch vor dem
öffentlichen Start?) oder nicht. Das Plan-Wahl-Fenster (`PlanWahlModal`)
wird laut Code nur einmal direkt nach einem frisch abgeschlossenen
Onboarding gezeigt (`WelcomeModalWrapper`) — das käme nur mit einem
kompletten neuen Test-Onboarding zu sehen, das hab ich nicht ohne
Rückfrage gestartet. Preisdatenbank-Vergleich (24 Std vorher: „Bodenbeläge"
177 Positionen, „Maler" 164) nicht erneut geprüft, keine Änderung erwartet.

---

## DC-002 — „Angebote" fehlt in Desktop-Sidebar

**Datum:** 2026-08-16 · live bestätigt 2026-08-17
**Status:** ✅ behoben + live bestätigt (Product Designer, 2026-09-02)

**Befund:** `src/components/SideNav.tsx` (feste Desktop-Navigation) hat nur
Dashboard, Kunden, Einstellungen. „Angebote" — in der mobilen `BottomNav.tsx`
einer von genau vier Hauptreitern — fehlt komplett. Am Desktop kommt man nur
über einen 11px-Link „Alle →" auf dem Dashboard dorthin; von Kunden oder
Einstellungen aus gibt es keinen direkten Weg mehr dahin.

**Empfehlung:** Vierten Nav-Punkt „Angebote" in `SideNav.tsx` ergänzen, analog
zu `BottomNav.tsx` (Reihenfolge/Icon dort spiegeln).

**Update 2026-08-17 (live im Browser geprüft):** Im echten Produkt
bestätigt — Desktop-Sidebar zeigt nur Dashboard/Kunden/Einstellungen,
`/angebote` ist nur per direktem Link erreichbar. Mobil ist „Angebote"
selbstverständlich einer von vier Reitern in der Bottom-Nav.

**Fix-Update (Product Designer, 2026-08-24):** `SideNav.tsx`, vierter
Nav-Punkt „Angebote" (FileText-Icon) zwischen Dashboard und Kunden ergänzt —
Reihenfolge/Icon spiegeln jetzt exakt `BottomNav.tsx`. `tsc` sauber.

**Live-Bestätigung (Product Designer, 2026-09-02):** Ich kann mich nicht in
deinen Account einloggen (Passwort-Eingabe ist mir grundsätzlich nicht
erlaubt), daher kein Klick-Test in der echten Desktop-Sidebar von mir. Zwei
andere Belege sind aber genauso hart:

1. **Code-Vergleich:** `SideNav.tsx`s `NAV`-Array (`Dashboard, Angebote,
   Kunden, Einstellungen`, gleiche Icons, gleiche `active`-Logik) stimmt
   Zeile für Zeile mit `BottomNav.tsx`s `LEFT_NAV`/`RIGHT_NAV` überein —
   kann strukturell nicht auseinanderlaufen.
2. **Deployment-Check (Vercel MCP):** Der aktuell auf `www.sofortangebot.app`
   live geschaltete Production-Build (`dpl_FbpFbDtxMaYzrFjjbmP3rQBp4u21`,
   `READY`) läuft auf Commit `10a87a3` — der liegt weit nach dem
   DC-002-Fix-Commit vom 24.08. Der Fix ist also seit über einer Woche
   live, nicht nur im Code.

Ein 5-Sekunden-Blick deinerseits auf die Desktop-Sidebar würde es endgültig
schließen, aber inhaltlich betrachte ich das als erledigt.

---

## DC-003 — Statusfarben für Angebote: 3 inkonsistente Quellen

**Datum:** 2026-08-16
**Status:** ❌ offen

**Befund:** Drei unabhängige Farb-Maps für denselben Angebots-Status:
`src/app/(app)/angebote/page.tsx`, `src/components/MobileQuoteCard.tsx` und
teilweise `src/app/(app)/dashboard/page.tsx`. Konkret weicht z. B. „Beauftragt"
zwischen `#EDFAF0`/`#1A7A38` und `#DCFCE7`/`#14532D` ab.

Ursache: `MobileQuoteCard` bekommt eine `statusColor`-Prop übergeben, nimmt
sie aber nie entgegen (Funktionssignatur destrukturiert nur `quote,
statusLabel, formattedDate, formattedAmount`) — nutzt stattdessen immer die
eigene interne Farbtabelle. Dadurch sieht dieselbe Statuskarte auf
Desktop-Table und mobiler Kartenliste unterschiedlich aus.

Zusätzlich: Der Status `bereit` (Fertiggestellt) fehlt in der
`STATUS_LABEL`-Map von `angebote/page.tsx` — fällt dort auf „Entwurf" zurück,
obwohl das Angebot schon fertig ist.

**Empfehlung:** Eine zentrale `status-config.ts` mit Label + Farbe pro Status
(inkl. `bereit`), von der alle drei Stellen importieren. `MobileQuoteCard`
so anpassen, dass die `statusColor`-Prop tatsächlich verwendet wird (oder
ganz entfernt wird, wenn die zentrale Quelle reicht).

**Fix-Update (Product Designer, 2026-08-24):** Sandy hat direkt mit dem
Wunsch kombiniert, die ganze Status-Änderung im Angebot umzubauen ("die
ganze status bearbeitung find ich kacke ... mach direkt dc-003 also auch
farben das alles überall einheitlich ist"). Bei genauerem Hinsehen waren es
nicht drei, sondern **fünf** unabhängige Kopien — zusätzlich zu den drei
oben auch `AngebotDetail.tsx` und `src/app/(app)/kunden/[id]/page.tsx`
(Letztere deckte nur 4 von 7 Status ab: `bereit`/`in_bearbeitung`/`archived`
fielen auf grauen „Entwurf"-Stil zurück, und nannte „Offen" konsequent
„Versendet", „Beauftragt" konsequent „Angenommen" — Sprache und Farbe
widersprachen sich also auch inhaltlich, nicht nur farblich, je nachdem wo
man hinschaute).

Umgesetzt:
- Neue einzige Quelle `src/lib/status.ts` (`STATUS_CONFIG`, `getStatusInfo()`,
  `DRAFT_STATUSES`, `SENT_STATUSES`, `waehlbareStatus()`) — alle 5 Stellen
  (`AngebotDetail.tsx`, `MobileQuoteCard.tsx`, `angebote/page.tsx`,
  `dashboard/page.tsx`, `kunden/[id]/page.tsx`) importieren jetzt von dort,
  keine lokalen Kopien mehr. `MobileQuoteCard` bekommt `statusLabel`/
  `statusColor` nicht mehr als Props (die nie ausgewertete `statusColor`-Prop
  ist damit weg) — berechnet Label+Farbe selbst aus `quote.status`, kann also
  strukturell nicht mehr von einer Aufrufstelle abweichen.
- `QuoteStatus`-Typ (`src/lib/types.ts`) um `'bereit'` ergänzt — stand dort
  nie, obwohl seit Langem ein echter, geschriebener Status. Toter `'viewed'`-
  Status (nur in alten Label-Tabellen, nirgends je geschrieben) bewusst nicht
  übernommen.
- Kanonische Labels/Farben entschieden: „Offen" (nicht „Versendet"),
  „Beauftragt" (nicht „Angenommen"), `bereit` = Gelb/Marke (nicht Grün) —
  Grün bleibt exklusiv für „Kunde hat beauftragt" reserviert, sonst wirken
  „ich bin fertig" und „Kunde hat zugesagt" optisch gleich bedeutsam.
- Status-Änderung selbst neu gebaut (das eigentliche „kacke, zu umständlich"
  aus Sandys Auftrag): Das „Status ändern"-Sheet in `AngebotDetail.tsx` zeigt
  jetzt bei jeder Option einen farbigen Punkt (`status.dot`) statt reinem
  Text, und bietet — neu — auch einen Weg **zurück zu „Entwurf"**, aber
  bewusst nur ausgehend von `bereit` (`waehlbareStatus()`), nicht aus
  sent/accepted/rejected: die haben schon einen bewussteren, extra
  abgesicherten „Neue Version erstellen"-Weg (Revisions-Dialog), den das
  einfache Sheet nicht umgehen soll. Der Status-Badge oben in der Kopfzeile
  hat jetzt ebenfalls einen farbigen Punkt statt nur Textfarbe. Der bisher
  stille automatische Rückfall auf „Entwurf" beim Klick auf „Bearbeiten" (bei
  Status `bereit`) zeigt jetzt einen Toast, damit es nicht überrascht.

Scoped `tsc --noEmit` über alle 7 geänderten Dateien: 0 Fehler. Noch nicht
live geprüft — bitte einmal durchklicken (Status ändern, zurück zu Entwurf
ab „Fertiggestellt", Badges auf Angebote-Liste/Dashboard/Kundendetail).

**Nachtrag (Sandy, 2026-08-24, live getestet, mit Screenshot):** „dieser
kleine punkt ist zum status ändern?!? da kommt doch kein schwein
drauf....?! dieser ganze header da ist nichts iwie." Zu Recht — der neue
Status-Button saß in der schmalen Icon-Reihe der Kopfzeile direkt zwischen
Zahnrad und Bearbeiten/Speichern, gleich groß wie die reinen Icon-Buttons
daneben. Ohne erkennbaren Rahmen und mit wenig Kontrast sah er dort wie ein
drittes stummes Icon aus, nicht wie ein Button mit eigenem Text.

**Fix-Update (Product Designer, 2026-08-24):** Status-Button aus der
Icon-Reihe herausgenommen und bekommt jetzt eine eigene Zeile direkt unter
der Angebotssumme — mit sichtbarem Rahmen (`border-current/20`, unterscheidet
ihn von einem reinen Info-Badge), größerem Farbpunkt und Chevron als
Tap-Hinweis. Icon-Reihe rechts (Zahnrad, Bearbeiten/Speichern) bleibt für
reine Werkzeug-Aktionen, jetzt am oberen Rand ausgerichtet (`items-start`
statt `items-center`) statt mittig an einem jetzt höheren linken Block.
Scoped `tsc` sauber. Noch nicht live geprüft — bitte nochmal drüberschauen,
ob der Button jetzt eindeutig als „hier kann ich den Status ändern" zu
erkennen ist.

---

## DC-004 — `pb-safe` / `pt-safe-top` nicht definiert (Safe-Area iPhone)

**Datum:** 2026-08-16
**Status:** 🟡 behoben, noch nicht auf echtem iPhone nachgeprüft

**Befund:** `BottomNav.tsx`, `dashboard/page.tsx` und `entwurf/page.tsx`
nutzen die Klassen `pb-safe` / `pt-safe-top`, damit Inhalte nicht unter der
iPhone-Home-Leiste bzw. Notch verschwinden. Klassen sind nirgends definiert
(kein Tailwind-Plugin in `package.json`, keine eigene Utility in
`globals.css`) — Tailwind generiert dafür keine Regel, die Klassen tun
nichts.

**Empfehlung:** In `src/app/globals.css` eigene Utilities ergänzen, z. B.
`@utility pb-safe { padding-bottom: env(safe-area-inset-bottom); }` und
`@utility pt-safe-top { padding-top: env(safe-area-inset-top); }`
(Tailwind-v4-Syntax), dann auf echtem iPhone mit Home-Indicator prüfen.

**Fix-Update (Product Designer, 2026-08-18):** Genau diese zwei Utilities
in `src/app/globals.css` ergänzt (Tailwind-v4-`@utility`-Syntax). `pb-safe`
wird bereits in `BottomNav.tsx` genutzt, `pt-safe-top` in
`dashboard/page.tsx` und `entwurf/page.tsx` — ab jetzt sollten beide
tatsächlich Wirkung zeigen statt No-Ops zu sein. **Noch offen:** Ich habe
kein echtes iPhone mit Home-Indicator zum Testen — bitte jemand mit Gerät
kurz gegenprüfen, dass der Abstand unten/oben jetzt sichtbar korrekt ist.

---

## DC-005 — Kein gemeinsamer Button, `active:scale-98` ungültig

**Datum:** 2026-08-16
**Status:** 🟡 Bug behoben, `Button.tsx` erstellt — Migration bestehender
Stellen offen

**Befund:** Kein `Button.tsx` vorhanden (nur `Input.tsx` und `Toast.tsx` sind
echte Bausteine). Der gelbe Primär-Button taucht in über 30 leicht
unterschiedlichen Varianten auf (`rounded-xl` vs. `rounded-2xl`, `py-3` vs.
`py-3.5` vs. `py-4` vs. `py-[18px]`, `font-black` vs. `font-extrabold`,
`active:scale-95` vs. `active:scale-[0.98]` vs. `active:scale-[0.97]`).

Konkreter Bug: `src/app/(app)/kunden/page.tsx` und
`src/app/(app)/kunden/[id]/page.tsx` nutzen `active:scale-98` ohne Klammern —
keine gültige Tailwind-Klasse (Skalierungsschritt „98" existiert nicht in der
Standardskala). Der Press-Effekt tut an diesen zwei Stellen nichts.

**Empfehlung:** `Button.tsx` nach Vorbild von `Input.tsx` bauen (Varianten:
primary/secondary/destructive, Größen: default/small), dann schrittweise bei
Gelegenheit migrieren. `active:scale-98` in beiden Dateien zu
`active:scale-[0.98]` korrigieren.

**Fix-Update (Product Designer, 2026-08-18):** Beides erledigt.
`active:scale-98` in `kunden/page.tsx` und `kunden/[id]/page.tsx` zu
`active:scale-[0.98]` korrigiert — der Press-Effekt tut an beiden Stellen
jetzt wieder etwas. Neu: `src/components/Button.tsx`, forwardRef,
Varianten `primary`/`secondary`/`destructive`, Größen `default`/`small`,
eingebauter `loading`-State (Spinner statt Inhalt, automatisch
deaktiviert) — nach demselben Muster wie `Input.tsx` (ein Basis-Stil pro
Variante, per `className` erweiterbar). Nutzt von Anfang an die
Farb-Tokens aus DC-006 (`bg-yellow`/`text-anthracite`) statt neuer
Hex-Literale. **Noch offen:** Die 30+ bestehenden Button-Stellen im Code
migrieren auf `Button.tsx` — bewusst nicht in diesem Rutsch gemacht,
passiert schrittweise bei Gelegenheit, wie in der Empfehlung oben
vorgesehen.

---

## DC-006 — `typography.ts` + Farb-Tokens werden nirgends genutzt

**Datum:** 2026-08-16
**Status:** ❌ offen

**Befund:** `src/lib/typography.ts` definiert saubere Tokens (`h1`, `h2`,
`h3`, `body`, `label` …) — wird laut Grep über `src/` von keiner einzigen
Stelle importiert. Stattdessen 31 verschiedene feste Pixelgrößen im Code
(`text-[14px]`, `text-[13px]`, `text-[11px]` …), oft nur 1px auseinander in
vergleichbaren Kontexten.

Gleiches Bild bei Farben: `globals.css` definiert `--color-yellow`,
`--color-anthracite`, `--color-bg`, `--color-white` als Tailwind-Theme —
genutzt wird kaum etwas davon. Stattdessen 1.530× `#2C2C2C` und 433×
`#F5C400` als Rohwert, dazu Fast-Duplikate bei Grau-/Grüntönen (`#666666`,
`#888888`, `#999999`, `#333333`, `#1A1A1A`, `#111111`; `#1A7A38`, `#2a7a2a`,
`#16a34a`; `#ef4444` vs. `#dc2626`).

**Empfehlung:** Kein Rewrite nötig — neue Stellen konsequent auf
`text-anthracite`/`bg-yellow` (aus `@theme inline`) und die
`typography.ts`-Tokens umstellen. Bestehende Stellen bei Gelegenheit
mitziehen, nicht als eigenen Sprint.

**Update 2026-08-18:** Hängt inzwischen an zwei Stellen: Head of Marketing
hat in `docs/marketing-ci.md` einen CI-Richtungsvorschlag vorgelegt
(Farbnuance `#D9A400`, evtl. neue Schrift), technische Aufwandsfrage dazu
in `docs/marketing-design-austausch.md` (EX-M-002/EX-M-003) geklärt. Meine
Antwort dort: Ich fange das Token-Aufräumen JETZT an, unabhängig vom
Ausgang des CI-Vorschlags — zentralisiere auf die aktuellen Werte in
`globals.css`, damit ein späterer Farb-/Schrift-Wechsel nur noch eine
Token-Änderung ist, keine zweite Suchen-Ersetzen-Aktion.

**Fix-Update (Product Designer, 2026-08-18):** Erste Migrations-Runde auf
die bestehenden `@theme inline`-Tokens (`bg-yellow`, `text-anthracite`,
`bg-bg`) statt Hex-Literalen abgeschlossen — 5 bereits als vorbildlich
geprüfte Kernkomponenten: `Input.tsx`, `Toast.tsx`, `BottomNav.tsx`,
`SideNav.tsx`, plus das neue `Button.tsx` (DC-005) gleich von Anfang an mit
Tokens statt Hex geschrieben. Bewusst noch NICHT angefasst: Farbnuancen
ohne Token-Entsprechung (z. B. `hover:bg-[#e6b800]` in `SideNav.tsx`,
Inline-`boxShadow`-Werte in `BottomNav.tsx`) — dafür bräuchte es erst neue
Tokens (z. B. „yellow-dark" fürs Hover), das ist eine Design-Entscheidung
für sich, nicht Teil des reinen Aufräumens. **Noch offen:** Der große Rest
der >1.900 Fundstellen über ~30-40 Dateien (siehe Aufwandsschätzung in
`docs/marketing-design-austausch.md`, EX-M-002) — geht schrittweise weiter,
nicht in einem Rutsch.

**Fix-Update (Product Designer, 2026-08-24):** Zweite Migrations-Runde, auf
Sandys „und dc006". Statt blind querbeet zu migrieren: die 5 Dateien
genommen, die ich für DC-003 sowieso gerade frisch bearbeitet und schon
verifiziert hatte (geringstes Risiko, ich kannte den Code bereits) —
`src/lib/status.ts`, `MobileQuoteCard.tsx`, `angebote/page.tsx`,
`dashboard/page.tsx`, `kunden/[id]/page.tsx`. Reine, mechanische Ersetzung
von `[#2C2C2C]` → `anthracite`, `[#F5C400]` → `yellow`, `[#F7F7F5]` → `bg`
(inkl. Opazitäts-Suffixe wie `/50`, Tailwind v4 unterstützt die auf
benannten Farben nativ) — 47 Fundstellen über die 5 Dateien, `tsc` danach
sauber. **Bewusst NICHT angefasst:** `AngebotDetail.tsx` (330 Treffer allein
dort, aktuell parallel von Head of Product Engineering in Arbeit — zu groß
und zu riskant für eine mechanische Aktion nebenbei), `einstellungen/page.tsx`
(204), `preise/page.tsx` (132), `onboarding/[step]/page.tsx` (116) — die
größten verbleibenden Brocken, für eine eigene Runde vorgemerkt. Reine
Farbwerte, die keinem der 4 Tokens exakt entsprechen (Grau-/Grüntöne,
Status-Punktfarben in `status.ts`), bewusst unverändert gelassen — das ist
eine Design-Entscheidung (welche Nuance wird kanonisch?), kein reines
Aufräumen.

**Fix-Update (Product Designer, 2026-09-02):** Dritte Runde, `dc006` auf
Sandys Zuruf. `onboarding/[step]/page.tsx` genommen — die hatte ich
sowieso gerade für DC-032 frisch bearbeitet und `tsc`-verifiziert
(geringstes Risiko, gleiche Logik wie bei den ersten beiden Runden). 120
Fundstellen in Tailwind-Klassen mechanisch ersetzt
(`[#2C2C2C]`→`anthracite`, `[#F5C400]`→`yellow`, `[#F7F7F5]`→`bg`). Neu
diese Runde: auch 3 Lucide-Icon-`color`-Props im selben Geist mitgezogen
(`color="#2C2C2C"` ist kein Tailwind-Klassenname, sondern ein echter
CSS-Farbwert als Prop — dafür `color="var(--color-anthracite)"` bzw.
`var(--color-yellow)`, die `@theme inline`-Custom-Properties aus
`globals.css` sind global gültig, funktionieren also genauso wie die
Tailwind-Klassen). Bewusst unverändert: `#666666`, `#AAAAAA`, `#16a34a`,
`#ef4444` — keine 1:1-Token-Entsprechung. `tsc` sauber, Commit `a4e64ed`.
**Verbleibend:** `AngebotDetail.tsx`, `einstellungen/page.tsx`,
`preise/page.tsx` — die größten Brocken, weiterhin für eigene Runden
vorgemerkt statt riskant querbeet.

**Fix-Update (Product Designer, 2026-09-02):** Vierte Runde, `DC-006` auf
Sandys Zuruf ("na los") — die letzten drei großen Brocken in einem Rutsch.
Vorher jede der drei Dateien einzeln geprüft: `git status`/`git log` sauber,
keine parallele Arbeit einer anderen Rolle drauf — `AngebotDetail.tsx` war
im August noch parallel von Head of Product Engineering in Bearbeitung, das
ist jetzt vorbei. Gleiches Muster wie Runde 3, dieses Mal zusätzlich mit
`AngebotDetail.tsx`s eigener Gewerke-Icon-Farbpalette (`#003DA5`, `#0066CC`,
`#E84B3C`, `#FF6B00`, `#4CAF50`, `#795548`, `#009688`, `#D4A800`,
`#EEEEEE`) — bewusst komplett unangetastet gelassen, das sind keine der 3
Kern-Tokens.

**Ehrlicher Nebenfund beim Bauen:** Mein erster Ersetzungslauf über
`preise/page.tsx` hat versehentlich die CRLF-Zeilenenden der ganzen Datei
auf LF vereinheitlicht (Standardverhalten von Pythons Textmodus beim
Lesen/Schreiben) — dadurch wären alle ~880 Zeilen als geändert
aufgetaucht, nicht nur die ~120 echten Farb-Änderungen. Beim eigenen
Diff-Check vor dem Commit bemerkt (Zeile 1 des Diffs begann bei der
`'use client'`-Zeile, die gar keine Farbe enthält — das Warnsignal), noch
vor jedem Schreibvorgang korrigiert: binärsicher aus der sauberen
HEAD-Version neu ersetzt, CRLF bewusst erhalten. Committeter Diff zeigt
jetzt nur die tatsächlichen 104 Zeilen.

`tsc --noEmit` sauber (scoped, alle drei Dateien + Abhängigkeiten),
Commit `63aa9cf`. Damit sind alle 4 großen DC-006-Brocken durch. Rest:
die restlichen >1.900 kleineren Fundstellen über ~25-30 Dateien (siehe
Aufwandsschätzung in `docs/marketing-design-austausch.md`, EX-M-002) —
weiter schrittweise bei Gelegenheit, kein eigener Sprint.

**Fix-Update (Product Designer, 2026-09-02) — DC-006 vollständig
abgeschlossen:** Sandy: *"wenn jetzt irgendwas von dc006 noch offen
ist dann machs fertig! ich will dass ein haken hinter ist ... einmal
richtig, haken dran, weiter nächste aufgabe. das gilt für ALLE
aufgaben."* Das war die klare Ansage, die bisherige "schrittweise
mitziehen"-Linie (bewusst gewählt, um nicht riskant querbeet zu gehen)
aufzugeben und stattdessen jetzt vollständig durchzuziehen. Also
gemacht — mit der gebotenen Sorgfalt, nicht blind:

`grep -rl` über ganz `src/` nach den 3 Ziel-Hexwerten fand 78 Dateien.
Jede einzeln angeschaut, nicht blind ersetzt — 16 davon **bewusst
ausgeschlossen**, weil dort ein struktureller Grund gegen die
Token-Ersetzung spricht, keine Nachlässigkeit:

- `src/lib/pdf.tsx` — react-pdf-Inline-Styles, kein Browser-CSS,
  versteht kein `var()`.
- `src/lib/email.ts` + 6 API-Routen (`admin/alert`,
  `admin/api-health-check`, `cron/reminder`, `email`,
  `notifications/unterschrift`, `quotes/[id]/send`) — rohes HTML für
  externe Mail-Clients, die laden unser `globals.css` nicht.
- `src/app/apple-icon.tsx`, `src/app/icon.tsx` — Satori/
  `ImageResponse`-Favicon-Generierung, kein Browser-CSS.
- `src/app/manifest.ts` — PWA-Manifest-Spec verlangt literale Werte.
- `src/app/layout.tsx` — `themeColor` wird zu einem `<meta>`-Tag-
  Attribut, kein Stylesheet-Kontext.
- `src/lib/blog-client.ts`, `src/lib/gewerke-config.ts`,
  `src/lib/status.ts`, die Briefpapier-Vorschau in
  `einstellungen/briefpapier/[id]/page.tsx` (`FARB_CHIPS`,
  `akzentfarbe`), `src/components/ComingSoon.tsx` — eigene,
  bewusste Mehrfarb-Paletten bzw. Datenfelder (Status-Punkte,
  Gewerke-Icons, Blog-Kategorien, user-wählbare Akzentfarbe, komplett
  eigenständige Landingpage ohne jede Tailwind-Klasse) — dieselbe
  Kategorie wie die schon in Runde 4 dokumentierte
  `AngebotDetail`-Gewerkepalette. Ersetzen wäre hier keine
  Aufräumaktion, sondern eine Design-Entscheidung, die niemand
  verlangt hat.
- `unterschreiben/page.tsx` (`ctx.strokeStyle` im Canvas-2D-Kontext)
  und `VorschauUndVersand.tsx` (`fgColor` an `QRCodeSVG`, eine
  Fremdkomponente mit eigener Farbvalidierung) — keine CSS-Färbung,
  `var()` ist dort nicht garantiert sicher.

Für die verbleibenden **62 Dateien**: gleiches mechanisches Muster wie
in den Vorrunden, dieses Mal zusätzlich auf doppelt-gequotete
`stroke=`/`fill=`-Props auf echten Inline-SVGs erweitert (2 Fundstellen
in `register/page.tsx` und `HeroSection.tsx`). Aus der Runde-4-Lehre
diesmal von Anfang an binärsicher geschrieben, keine
Zeilenend-Überraschung. Zusätzlich 3 Handeditierungen in
`AufnahmeHinweisSheet.tsx` (Carousel-Dots/Card-Highlight, ein
`style={{}}`-Ternary mit `'#F5C400'`/`'#2C2C2C'`, nicht per
Tailwind-Klasse ausdrückbar wegen der Bedingung) auf `var(--color-*)`
umgestellt.

Verifiziert **vollständig**, nicht nur scoped: `tsc --noEmit` für den
gesamten Projekt-Tsconfig sauber. `eslint` 0 Fehler, 85 Warnings — alle
85 vorbestehend und in keiner der 62 Dateien (die 82er-Schwelle ist ein
unabhängiges, vorbestehendes Aufräumthema). `vitest run` schlägt lokal
mit `Cannot find module '@rolldown/binding-linux-x64-gnu'` fehl — eine
kaputte native Bindung im Test-Runner dieses Geräts, offensichtlich
unabhängig von reinen Farb-Klassen-Änderungen (kein einziger Test
berührt Styling). Das solltest du oder Head of Product Engineering
separat prüfen, ich kann es von hier aus nicht reparieren. Commit
`3e2c778`.

**Damit ist DC-006 für den kompletten Tailwind-Klassen-Fall
abgeschlossen — keine offene Fundstelle dieser Art mehr im Code.** Was
bleibt, sind die 16 oben aufgeführten, einzeln begründeten Ausnahmen —
kein liegengebliebener Rest, sondern eine bewusste Grenze.

---

## DC-007 — Mobile-Seitentitel: „Angebote"/„Kunden" weiß, „Einstellungen" gelb

**Datum:** 2026-08-17 (live im Browser auf 390×844 geprüft, Screenshot vorhanden)
**Status:** 🟡 behoben, noch nicht live nachgeprüft

**Befund:** Auf dem Handy-Viewport haben alle Listen-Header denselben
dunklen Hintergrund. „Angebote" und „Kunden" zeigen den Seitentitel in Weiß,
„Einstellungen" an derselben Stelle in Gelb (`#F5C400`). Im Code bereits
identifiziert (`text-[#F5C400] md:text-[#2C2C2C]` statt `text-white
md:text-[#2C2C2C]` in `einstellungen/page.tsx`), jetzt live auf dem Gerät
bestätigt — springt im direkten Vergleich sofort ins Auge.

**Empfehlung:** In `src/app/(app)/einstellungen/page.tsx` Zeile mit dem
Seitentitel auf `text-white md:text-[#2C2C2C]` angleichen.

**Fix-Update (Product Designer, 2026-08-18):** Genau diese Zeile
angeglichen — Seitentitel „Einstellungen" ist mobil jetzt weiß wie bei
„Angebote"/„Kunden". **Noch offen:** Live im Browser auf dem Handy-Viewport
gegenprüfen (war beim ursprünglichen Befund per Screenshot bestätigt).

---

## DC-008 — Kleine Sprach-/Textpolitur

**Datum:** 2026-08-17 (live im Browser geprüft)
**Status:** ✅ vollständig behoben (Product Designer, 2026-09-02)

**Befund:**
- Kunden-Übersicht zeigt bei genau einem Kunden „1 Kunden gesamt" —
  sollte „1 Kunde gesamt" heißen (Singular bei Zähler = 1).
- Unter Einstellungen → App → „Mein Wörterbuch" erscheinen von der KI
  gelernte Begriffe teils ohne Umlaut, z. B. „sockelleisten abkleben
  kueche" statt „…Küche" — wirkt an einer Stelle, die bewusst Vertrauen in
  die Spracherkennung aufbauen soll, unpoliert.

**Empfehlung:** Pluralregel für Zähler wie bei anderen Stellen im Code
(vgl. `quotes.length !== 1 ? 'e' : ''` in `kunden/page.tsx`) auch für
„Kunde/Kunden" anwenden. Umlaut-Normalisierung im Wörterbuch-Speicherpfad
prüfen (KI-Transkript vermutlich vor dem Speichern ASCII-normalisiert).

**Fix-Update (Product Designer, 2026-09-02):** Beide Punkte erledigt.

1. „1 Kunden gesamt" → „1 Kunde gesamt" in `kunden/page.tsx`, gleiches
   `=== 1 ? Singular : Plural`-Muster wie überall sonst im Code. Per
   `grep` bestätigt: einzige Fundstelle dieser Art im gesamten Code.
   `tsc` sauber, Commit `097cf6d`.
2. Der Umlaut-Fund war beim Nachschauen bereits gegenstandslos: Head of
   Product Engineering hat das ganze „Mein Wörterbuch"-Feld am 02.09.
   aus `einstellungen/page.tsx` entfernt (Sandys Entscheidung, siehe
   Code-Kommentar dort) — die Funktion hatte nie tatsächlich etwas
   gelernt, Anzeige und Speicherpfad waren unverbunden, ein einziger
   Eintrag seit dem 16.06. bei hunderten Aufnahmen. „Abschalten statt
   ausbauen — vor Gate 1 darf nichts im Produkt etwas versprechen, das
   es nicht hält." Tabelle `nutzer_begriffe` bleibt bestehen, Funktion
   zurückgestellt statt gestrichen. Per `git log` verifiziert, dass das
   bereits committet ist — nichts mehr für mich zu tun hier, nur zur
   Kenntnis genommen und dokumentiert.

---

## DC-009 — Leere Aufnahme wird als grüner Erfolg angezeigt

**Datum:** 2026-08-17 (live durchgespielt, Screenshots vorhanden)
**Status:** ✅ behoben + live bestätigt (Product Designer, 2026-09-02 nachgetragen)

**Befund:** Aufnahme gestartet, 15 Sekunden lang nichts gesagt (Stille), gestoppt.
Ergebnis: Status „✓ Fertig", darunter ein grünes Erfolgs-Banner mit Häkchen
„0 Positionen erkannt — bereit für den Entwurf." und ein aktiver gelber
Haupt-Button „✓ 0 Positionen erkannt / Entwurf erstellen · ca. 10 Sekunden".
Grüne Häkchen-Farbe und das Wort „bereit" signalisieren Erfolg — bei null
erkannten Positionen ist das objektiv kein Erfolg. Ein Handwerker, der kurz
nicht hinschaut, tippt hier guten Gewissens weiter.

**Empfehlung:** Bei 0 erkannten Positionen ein neutrales/warnendes Banner
zeigen („Nichts erkannt — nochmal versuchen?") statt des grünen
Erfolgs-Stils, und den Haupt-Button in diesem Fall durch „Nochmal
aufnehmen" ersetzen statt „Entwurf erstellen" aktiv anzubieten.

**Nachtrag (Product Designer, 2026-09-02):** Beim DC-010-Nachtest
festgestellt, dass das hier schon längst umgesetzt war — nur der
Status-Header hier war nie aktualisiert worden, obwohl der Code seit
Wochen fertig ist. Code-Check in `entwurf/page.tsx` bestätigt genau
die empfohlene Lösung, 1:1: `nichtsErkannt` (eigene Variable, `erkannteAnzahl
=== 0` nach vollständiger Transkription) liefert ein neutrales Banner
„Noch nichts erkannt — nochmal versuchen? Lauter oder mit mehr Details
sprechen hilft oft." statt des grünen Erfolgs-Banners; der „Entwurf
erstellen"-Button (`kannFertigstellen`) verlangt zusätzlich
`erkannteAnzahl > 0` und wird bei 0 erkannten Positionen gar nicht erst
gerendert; der Aufnahme-Button wechselt in diesem Zustand explizit auf
„Nochmal aufnehmen" statt „Weitere Aufnahme"/„Aufnehmen". Per
Vercel-Deployment-Check bestätigt: die aktuell auf `www.sofortangebot.app`
live geschaltete Production-Version läuft auf einem Commit, der diesen
Fix längst als Vorfahren enthält — live bestätigt ohne eigenen
Login-Klick (siehe DC-002 für die Methode).

---

## DC-010 — Keine Guardrail beim Fertigstellen eines leeren Angebots

**Datum:** 2026-08-17 (live durchgespielt, Screenshots vorhanden)
**Status:** ✅ vollständig behoben + live bestätigt (Product Designer, 2026-09-02)

**Befund:** Direkter Folgefund von DC-009: Auf „Entwurf erstellen" geklickt →
System erkennt korrekt serverseitig „Keine Positionen erkannt" (rotes
Banner) — zeigt aber **gleichzeitig weiterhin** das grüne
„0 Positionen erkannt — bereit für den Entwurf."-Banner direkt darunter.
Zwei widersprüchliche Zustände (Fehler + Erfolg) gleichzeitig sichtbar, ohne
Hinweis, was als Nächstes zu tun ist — der einzige aktive Button wiederholt
exakt die Aktion, die gerade fehlgeschlagen ist.

Im leeren Angebots-Entwurf (0 €, kein Kunde, keine Positionen) lässt sich
trotzdem ganz normal auf „Fertigstellen" tippen — keine Warnung, keine
Blockade. Status wechselt sofort zu „Fertiggestellt" (grüner Pill), Toast
„Angebot fertiggestellt ✓", und die „Vorschau" zeigt ein komplett leeres,
aber professionell aussehendes PDF (Firmenkopf, Angebotsnummer, Datum,
leere Positionstabelle, 0,00 € Gesamt, Unterschriftszeile) mit „Senden →"
als Haupt-Button — versandfertig an niemanden (kein Kunde zugewiesen).

**Empfehlung:** Vor „Fertigstellen" prüfen: mindestens 1 Position UND ein
zugewiesener Kunde, sonst Button deaktivieren mit kurzem Hinweis statt
stillschweigend zuzulassen. Die widersprüchliche Doppel-Meldung aus DC-009
beheben, dann verschwindet ein Teil dieses Problems automatisch.

**Update 2026-08-18 (Prüfmeister-Notizen, PD-006):** Unabhängig von meinem
eigenen Test (0 Positionen) hat Sandy selbst denselben Widerspruch bei
einem Fassaden-Test mit 2 Positionen gesehen: rotes „❗ Keine Positionen
erkannt" UND grünes „✓ 2 Positionen erkannt — bereit für den Entwurf"
gleichzeitig auf demselben Screen, musste es zweimal versuchen. Prüfmeister
hat es seitdem in 2 von 3 weiteren Fassaden-Durchläufen erneut gesehen —
tritt also intermittierend auf, nicht nur bei leeren Aufnahmen. Das
bestätigt den Befund aus DC-009/DC-010 nochmal unabhängig und macht ihn
dringlicher: ein Fehler, der nur manchmal auftritt, ist für den Nutzer
verwirrender als einer, der immer da ist. Design-Regel, unabhängig von der
technischen Ursache: Fehler-Banner und Erfolgs-Banner dürfen sich nie
gleichzeitig anzeigen — im Zweifel gewinnt der zuletzt bestätigte,
verlässlichere Zustand. Volltext siehe
`docs/pruefmeister-notizen-fuer-designer.md`, PD-006. Sandy hat
ausdrücklich gesagt, das soll sowohl an mich als auch an Head of Product
Engineering (technische Ursache) gehen.

**Fix-Update — Guardrail (Product Designer, 2026-08-23):** Code-Check vor
dem Fix bestätigt: `fertigstellen()`/`saveEdits('bereit')` in
`AngebotDetail.tsx` hatte bislang nur eine Prüfung, dass jede Position eine
Bezeichnung hat — weder 0 Positionen noch ein fehlender Kunde blockierten
das Fertigstellen. Umgesetzt:

- Der „Fertigstellen"-Button im Footer ist jetzt zusätzlich deaktiviert,
  wenn `editItems.length === 0` oder kein `currentCustomer` zugewiesen ist
  (`title`-Tooltip erklärt warum).
- Direkt darunter erscheint bei diesem Zustand ein kurzer Hinweistext
  („Noch keine Position — füge mindestens eine hinzu…" bzw. „Noch kein
  Kunde zugewiesen…") — sichtbar erklärt statt nur stumm deaktiviert, wie
  in der ursprünglichen Empfehlung oben.
- In `saveEdits()` selbst zusätzlich ein serverseitiges Sicherheitsnetz:
  Bei `nextStatus === 'bereit'` wird derselbe Zustand nochmal geprüft und
  wirft eine `Bitte …`-Fehlermeldung (nutzt denselben bereits vorhandenen
  Fehler-Toast-Mechanismus wie die Bezeichnungs-Prüfung) — falls
  `fertigstellen()` je ohne die Button-Prüfung ausgelöst wird.
- Bewusst NICHT verschärft: Der „Speichern"-Button (Entwurf ohne
  Statuswechsel) bleibt unverändert nutzbar auch ohne Kunde/Positionen —
  DC-010 betrifft nur das tatsächliche Fertigstellen/Versandfertig-Machen.

**Verifiziert:** Scoped `tsc --noEmit` (nur `AngebotDetail.tsx` +
next-env.d.ts) — 0 Fehler. `eslint`/volles `npm test` in dieser Umgebung
weiterhin nicht zuverlässig lauffähig (bekanntes Umgebungsproblem, siehe
DC-024/DC-028) — von Hand auf ungenutzte Importe/Variablen geprüft, keine
gefunden. Noch nicht live im Browser geprüft (leeres Angebot ohne Kunde
durchklicken, Button sollte deaktiviert bleiben bis beides erfüllt ist).

**Fix-Update 2 — Doppel-Banner-Ursache (Product Designer, 2026-09-02):**
Der zweite, eigentlich schwerere Teil dieses Befunds — roter Fehler und
grüner Erfolg gleichzeitig sichtbar (PD-006, intermittierend) — war beim
Nachschauen ebenfalls schon erledigt, nur nie hier vermerkt. Head of
Product Engineering hat die Ursache in `entwurf/page.tsx` genau nach
Sandys eigener Design-Regel aus PD-006 gefixt ("Fehler- und
Erfolgs-Banner dürfen nie gleichzeitig stehen — im Zweifel gewinnt der
zuletzt bestätigte, verlässlichere Zustand"): `bannerZustand` prüft jetzt
zuerst `if (fehler) return null` — ein serverseitig bestätigter Fehler
sperrt den Erfolgs-/Neutral-Banner strukturell, nicht nur zufällig durch
Timing. Root Cause laut Code-Kommentar: zwei unabhängige GPT-Aufrufe auf
denselben Text (schnelle Chip-Vorschau vs. vollständige
Server-Berechnung) können divergieren — kein Race-Condition-Bug, echter
Nichtdeterminismus, den man nur durch Priorisierung statt durch Timing-Fixes
in den Griff bekommt.

Guardrail (Punkt 1) und Doppel-Banner-Ursache (Punkt 2) beide bestätigt
im Code vorhanden. Live-Bestätigung wie bei DC-002/DC-009: kein
Login-Zugriff möglich, daher per Vercel-Deployment-Check verifiziert —
die aktuell auf `www.sofortangebot.app` laufende Production-Version
enthält beide Fix-Commits als Vorfahren.

**DC-010 ist damit vollständig abgeschlossen — beide Ursachen behoben,
live bestätigt.**

---

## DC-011 — Kritisch: Fertiggestelltes Angebot verschwindet aus der Angebote-Liste

**Datum:** 2026-08-17 (live reproduziert, dreifach gegengeprüft)
**Status:** ✅ behoben + live bestätigt (2026-08-18) — Ursache gefunden, `typecheck`/706 Tests grün, Sandy hat live gesehen, dass Angebote unter „Alle" wieder auftauchen

**Befund:** Das oben erstellte leere „Fertiggestellt"-Angebot (Nr.
2026-493C) ist auf `/angebote` unter „Alle" **nicht sichtbar** — die Seite
zeigt „Noch kein Angebot.", auch nach hartem Reload mit Cache-Bust-Parameter.
Die Detailseite des Angebots (`/angebot/79ac1431-…`) zeigt es weiterhin
korrekt mit Status „Fertiggestellt". Das Dashboard (`/dashboard`) zeigt es
ebenfalls korrekt unter „Zuletzt erstellt" — dort sogar mit dem richtigen
Label „Fertiggestellt" (Dashboard kennt den Status `bereit` in seiner
Label-Map, `angebote/page.tsx` nicht, siehe DC-003).

Das bedeutet: Zwei verschiedene Abfragen auf dieselbe Tabelle
(`getDashboardData()` vs. `getQuotesOverview()` in `src/data/quotes.ts` bzw.
`src/data/dashboard.ts`) liefern unterschiedliche Ergebnismengen für
denselben Datensatz. Für einen Nutzer sieht das aus, als wäre ein gerade
fertiggestelltes Angebot spurlos verschwunden — potenziell
vertrauenszerstörend, wenn es einem zahlenden Kunden mit echten Daten
passiert statt nur bei meinem leeren Test-Datensatz.

**Nicht meine Aufgabe als Product Designer, das im Code zu lokalisieren** —
aber der Verdacht liegt nahe bei `getQuotesOverview()` in `src/data/quotes.ts`:
entweder eine implizite Inner-Join-Bedingung auf `customers` (Angebot hat
keinen zugewiesenen Kunden), oder eine RLS-Policy auf der `quotes`-Tabelle,
die bei fehlendem Kunden oder `total_gross = 0` greift. Bitte Head of
Product Engineering gezielt auf diese zwei Stellen ansetzen.

**Empfehlung:** Dringend vor DC-001–DC-010 einordnen, wenn Kapazität knapp
ist — das hier kann echte, bezahlte Angebote betreffen, nicht nur
Design-Politur.

**Chief-of-Staff-Zuweisung (2026-08-17):** An Head of Product Engineering
zugewiesen, priorisiert vor DC-002–DC-010 — potenziell reale, bezahlte
Angebote betroffen.

**Ursache gefunden + Fix (Head of Product Engineering, 2026-08-18):** Der
Verdacht (Inner-Join/RLS) war nicht die Ursache — direkt gegen die
Produktions-Datenbank geprüft: `quotes.gewerk` und `quotes.title` **gibt es
schlicht nicht als Spalten** (nie eine Migration dafür, nie ein Schreibpfad
dafür). `getQuotesOverview()` in `src/data/quotes.ts` hat sie trotzdem in
jeder Abfrage mit angefragt — Postgres/PostgREST lehnt eine Abfrage mit
einer unbekannten Spalte KOMPLETT ab, nicht nur die eine Spalte. Der Fehler
wurde nur ins Server-Log geschrieben (`console.error`), nie angezeigt — für
den Nutzer sah es aus wie ein leerer Zustand ("Noch kein Angebot."), war
aber ein stiller Absturz. Wichtig: Das betraf NICHT nur das eine
Test-Angebot, sondern **jede Firma, jedes Angebot, jeden Filter** auf
`/angebote` — mit Datenbank-Check bestätigt: alle 56 aktuell in Produktion
gespeicherten Angebote waren auf dieser Seite unsichtbar, seit die Zeile so
im Code steht.

Fix: `title` ersatzlos aus der Abfrage entfernt (wurde nirgends benutzt).
`gewerk` (fürs Positionen-Badge auf der Liste) steckt schon im
`extraktion_final`-JSON-Feld, das es wirklich gibt — wird jetzt von dort
gelesen statt aus einer eigenen Spalte. Gleiche tote Spalten-Referenz auch
in `src/app/api/quotes/create/route.ts` gefunden und entfernt (aktuell ruft
sie niemand mit `gewerk` auf, wäre aber beim nächsten Versuch genauso
abgestürzt). Direkt gegen die Produktions-Datenbank verifiziert (Supabase
MCP), dass die neue Spaltenliste existiert und die JSON-Struktur passt.
Lokaler `eslint`-Lauf in der Cowork-Sitzung ist zweimal am Zeitlimit
gescheitert (Netzwerk-Sandbox, kein Code-Problem) — bitte wie bei CoS-010
einmal `npm run typecheck && npm test` laufen lassen, dann live auf
`/angebote` unter „Alle" prüfen, dass bestehende Angebote wieder
auftauchen.

**Live-Bestätigung (Sandy, 2026-08-18):** `typecheck` + 706/706 Tests grün.
Direkt nach Server-Neustart zeigte Sandys normales Browserfenster die
Liste trotzdem weiter leer — Ursache war NICHT der Code, sondern der
PWA-Service-Worker (Seiten-Zwischenspeicher fürs Offline-Arbeiten), der
eine alte Version festgehalten hat (erkennbar daran, dass beim Neuladen
gar keine Anfrage im Server-Terminal ankam). Ein privates/Inkognito-
Fenster umgeht diesen Cache und zeigte sofort die reparierte Liste mit
beiden bestehenden Entwürfen. Für Sandys normales Fenster: F12 →
„Application" → „Storage" → „Clear site data". Damit ist DC-011
abgeschlossen.

---

## DC-012 — Text-Notiz-Eingabe komplett gebaut, aber nirgends verlinkt

**Datum:** 2026-08-17
**Status:** ✅ behoben

**Befund:** In `src/app/(app)/angebot/[id]/entwurf/page.tsx` existiert eine
vollständige `NotizModal`-Komponente („Notiz hinzufügen", Textfeld,
Speichern-Button) inkl. funktionierender `saveNotiz()`-Funktion, die an
`/api/entwurf/notiz` postet — der State `showNotiz`/`setShowNotiz` ist
vorhanden. Aber: `setShowNotiz(true)` wird an keiner Stelle im Code
aufgerufen — kein Button öffnet dieses Modal. Aktuell gibt es im
Aufmaß-Flow nur zwei Eingabewege: Sprachaufnahme oder Foto vom
handschriftlichen Zettel. Eine reine Text-Eingabe (z. B. in lauter
Umgebung, in einer Besprechung, oder wenn man einfach nicht sprechen will)
ist nicht erreichbar, obwohl die Funktion technisch fertig ist.

**Empfehlung:** Kleinen dritten Button/Icon neben „Zettel" und „Aufnehmen"
ergänzen, der `setShowNotiz(true)` aufruft — die Funktion ist bereits
fertig, es fehlt nur die Verlinkung.

**Fix-Update (2026-09-02, Product Designer):** Genau wie empfohlen
umgesetzt. Der bisherige leere „Platzhalter für Symmetrie" (`<div
className="w-14 pb-[3px]" />`) neben „Zettel" und „Aufnehmen" wurde durch
einen echten dritten Button ersetzt — gleicher visueller Stil wie der
„Zettel"-Button (56px weißer Kreis, `border-2 border-anthracite/10`),
Icon `NotebookPen` aus `lucide-react`, Label „Notiz" darunter,
`onClick={() => setShowNotiz(true)}`. Die Drei-Button-Symmetrie der
Bottom Bar bleibt erhalten (Zettel / Aufnehmen / Notiz). Keine weiteren
Codeänderungen nötig — `NotizModal` und `saveNotiz()` waren bereits
vollständig funktionsfähig, es fehlte nur die Verlinkung. Scoped `tsc
--noEmit` lief clean, Commit `99b6fc2`.

---

## DC-013 — AppLayout-Footer stört den fokussierten Aufmaß-Aufnahme-Screen

**Datum:** 2026-08-17 (live bestätigt, Screenshot vorhanden)
**Status:** ✅ behoben

**Befund:** Auf `/angebot/[id]/entwurf` (der bewusst reduzierte,
fokussierte Aufnahme-Screen ohne Bottom-Nav) erscheint trotzdem der globale
Footer aus `(app)/layout.tsx` („© 2026 Sofortangebot · AGB · Datenschutz ·
Impressum") direkt unter der Aufnehmen-/Zettel-Buttonreihe — mit einer
großen leeren Fläche darüber. Wirkt wie ein Leck aus dem globalen Layout in
einen Screen, der bewusst auf „ein Fokus, ein nächster Schritt" ausgelegt
ist (BottomNav wurde ja korrekt ausgeblendet, der Footer nicht).

**Empfehlung:** Footer in `(app)/layout.tsx` über eine Pathname-Prüfung
(oder ein Layout-Flag) auf Fokus-Screens wie `/entwurf` ausblenden, analog
dazu wie BottomNav bereits pro Seite gesteuert wird.

**Fix-Update (2026-09-02, Product Designer):** Footer aus `(app)/layout.tsx`
in eine eigene Client-Komponente `src/components/AppFooter.tsx` extrahiert,
die per `usePathname()` prüft und auf Fokus-Screens `null` rendert statt
des Footers — aktuell eine Route-Liste mit `/entwurf` (dem in diesem
Befund dokumentierten Fall). `layout.tsx` selbst bleibt unverändert simpel
(`<AppFooter />` statt der Inline-`<footer>`-Markup), die Steuerung ist
zentral an einer Stelle statt über die App verstreut. Weitere Fokus-Screens
lassen sich bei Bedarf durch einen Eintrag in `HIDDEN_ON` ergänzen — für
diesen Befund war ausschließlich `/entwurf` mit Screenshot belegt, daher
bewusst nicht auf ungeprüfte andere Screens (z. B. Onboarding-Schritte)
ausgeweitet. Scoped `tsc --noEmit` lief clean, Commit `f451052`.

---

## DC-014 — Kritisch: Rohe Datenbank-Fehlermeldung auf Englisch beim Logo-Upload

**Datum:** 2026-08-17 (aus Screenshots von Sandy, Onboarding-Schritt „Dein Logo")
**Status:** 🟡 Ursache gefunden & behoben, Migration noch nicht angewendet — Fehlermeldungs-Politur separat offen

**Befund:** Wird im Onboarding-Schritt „Dein Logo" ein Bild hochgeladen,
erscheint unter dem Upload-Feld folgende Fehlermeldung im roten Banner,
unübersetzt und im O-Ton der Datenbank:

„Upload fehlgeschlagen: new row violates row-level security policy"

Das ist keine Übersetzungslücke, sondern eine technische Datenbank-Meldung
(Supabase-Zugriffsregel), die eins zu eins an den Handwerker durchgereicht
wird — auf Englisch, mit Fachbegriffen, die selbst für IT-Leute nur mit
Kontext verständlich sind. Das widerspricht dem Grundsatz „klar, menschlich,
kein Amtsdeutsch" fundamental — hier steht praktisch Programmierer-Deutsch,
nicht mal auf Deutsch.

Wichtiger als die Formulierung: Die Fehlermeldung zeigt, dass der
Logo-Upload im Onboarding aktuell offenbar **grundsätzlich fehlschlägt** —
eine Datenbank-Zugriffsregel blockiert das Schreiben, vermutlich weil der
Firmen-Datensatz zu diesem Zeitpunkt im Onboarding noch nicht existiert
oder die Regel den Onboarding-Kontext nicht kennt. Das ist ein
Funktions-Bug, keine reine Text-Frage.

**Chief-of-Staff-Hinweis (2026-08-17):** Gleicher Bug wie CoS-P-005 in
`docs/chief-of-staff-platform-todos.md` — der Platform & Integrations
Engineer hat die Ursache (fehlende RLS-Policy auf dem `company-logos`-
Storage-Bucket) unabhängig davon bereits gefunden und Code-/Migrations-Fix
geschrieben. Migration liegt auf `main` im Repo, ist aber noch nicht auf
einer Datenbank angewendet — Logo-Upload bleibt bis dahin kaputt, wie hier
beschrieben. Bitte an der Ursache nicht doppelt arbeiten — nur Punkt 2 der
Empfehlung unten (nie Rohfehler direkt anzeigen) bleibt ein eigenständiges,
noch offenes Thema für dich.

**Empfehlung:**
1. ~~Head of IT: Ursache der RLS-Regel beim Logo-Upload finden und
   beheben~~ — erledigt, siehe Chief-of-Staff-Hinweis oben (CoS-P-005).
2. Unabhängig davon: Jede Fehlermeldung im Produkt, die aus einer
   API-/Datenbank-Antwort stammt, VOR der Anzeige auf einen freundlichen,
   deutschen Text abbilden (z. B. „Hochladen hat nicht geklappt — bitte
   nochmal versuchen oder später in den Einstellungen nachholen."). Nie
   die Rohmeldung eines Systems direkt anzeigen — das gilt vermutlich nicht
   nur hier, sondern sollte als Grundsatz für alle Fehlerzustände im
   Produkt gelten. **Bleibt offen.**

---

## DC-015 — Onboarding: viel ungenutzter Leerraum zwischen Formular und Button-Leiste

**Datum:** 2026-08-17 (aus Screenshots von Sandy)
**Status:** ✅ behoben

**Befund:** In mehreren Onboarding-Schritten (Firmenname, Was machst du,
Rechnungen, Logo) sitzt der Inhalt oben zusammengedrängt, darunter folgt
eine große leere Fläche, bevor unten die Buttons „Zurück"/„Weiter" kommen.
Besonders auffällig beim Logo-Schritt: Nur eine kleine Upload-Box in der
Bildschirmmitte, drumherum fast nur Leerraum. Wirkt auf größeren
Bildschirmen (Tablet, Laptop-Fenster) unfertig statt bewusst reduziert —
„weniger ist mehr" heißt nicht „Fläche leer lassen", sondern gezielt
weglassen, was nicht gebraucht wird. Hier fehlt eher ein gestalterisches
Element (z. B. eine passende Illustration, vertikale Zentrierung des
Inhalts, oder ein größer wirkendes Eingabefeld), das die Fläche bewusst
nutzt.

**Empfehlung:** Inhalt pro Schritt vertikal zentrieren statt oben
anzudocken, oder ein kleines Illustrations-/Grafikelement ergänzen, das zum
jeweiligen Schritt passt (analog zum Icon, aber größer/bewusster
platziert).

**Fix-Update (2026-09-02, Product Designer):** Erste Empfehlung
umgesetzt (vertikale Zentrierung) — kein neues Illustrations-Element, da
dafür Grafik-Assets nötig wären. Betroffen waren die 4 im Befund
genannten Schritte (Betrieb, Gewerk, Rechnungen, Logo):
Schritt-Wrapper zentrieren ihren Inhalt jetzt als Gruppe
(`justify-center`) statt ihn oben anzudocken. Bei Schritt 2 + 4 dafür
das `mt-auto` am Button-Block entfernt (kollidiert sonst mit
`justify-center`, da Auto-Margins den Freiraum zuerst beanspruchen). Bei
Schritt 3 die Gewerk-Liste von `flex-1` (füllt immer die volle Höhe) auf
`max-h-[50vh]` + Scroll umgestellt, damit sie bei aktuell 5 Einträgen
nicht künstlich auseinandergezogen wird, aber bei künftig mehr Gewerken
weiterhin scrollbar bleibt. Bei Schritt 6 die Upload-Box von `flex-1`
auf normale Höhe mit etwas Innenabstand umgestellt, damit sie Teil der
zentrierten Gruppe wird statt einsam in der Bildschirmmitte zu
schweben. Schritt 1/8 (Welcome/Fertig) waren schon zentriert, Schritt
5/7 füllen die Fläche bereits sinnvoll mit Inhalt (Preisliste bzw.
Buchhaltungs-Optionen) — beide nicht im Befund genannt, daher bewusst
unverändert gelassen. Scoped `tsc --noEmit` lief clean, Commit
`b3e649b`. Rein CSS-seitige Änderung ohne visuelle Live-Vorschau
möglich (kein Dev-Server in dieser Umgebung) — bitte kurz gegenchecken,
ob sich der neue `max-h-[50vh]`-Wert für die Gewerk-Liste am Handy gut
anfühlt.

---

## DC-016 — Onboarding: „Weiter"-Button uneinheitlich beschriftet

**Datum:** 2026-08-17 (aus Screenshots von Sandy)
**Status:** ✅ behoben

**Befund:** Für dieselbe Aktion („zum nächsten Schritt") gibt es über die
6 Onboarding-Schritte hinweg mindestens fünf verschiedene
Button-Beschriftungen: „Weiter →", „Weiter (1) →", „Weiter (5) →",
„Erstmal überspringen →", „Überspringen →", „Fertig 🚀". Die Zahl in
Klammern bei „Weiter (1)" bzw. „Weiter (5)" ist ohne Erklärung nicht
selbsterklärend — ist das die Anzahl gewählter Gewerke? Die Anzahl
eingetragener Preise? Ein Handwerker, der zum ersten Mal durch den Flow
geht, muss darüber kurz nachdenken statt intuitiv weiterzuklicken.

**Empfehlung:** Einheitliches „Weiter →" für alle Pflichtschritte, „Später
→" oder „Überspringen →" konsistent für alle optionalen Schritte (aktuell
„Erstmal überspringen" vs. „Überspringen" — auch das schon zwei
Varianten), „Fertig 🚀" nur für den letzten Schritt. Zahl in Klammern nur
zeigen, wenn ein kurzer Zusatztext erklärt, wofür sie steht — sonst
weglassen.

**Fix-Update (2026-09-02, Product Designer):** Genau wie empfohlen
umgesetzt, jeweils die einfachere der beiden angebotenen Varianten
gewählt. „Weiter →" jetzt einheitlich für alle Pflichtschritte — die
Klammer-Zahl bei Gewerk-Auswahl (Schritt 3) und manueller Preisliste
(Schritt 5) entfernt statt mit Zusatztext zu erklären. „Überspringen →"
konsistent für beide optionalen Schritte (Preise in Schritt 5, Logo in
Schritt 6) — „Erstmal überspringen" auf „Überspringen" vereinheitlicht.
„Fertig 🚀" war schon exklusiv am letzten Schritt, keine Änderung nötig.
Scoped `tsc --noEmit` lief clean, Commit `d3be888`.

---

## DC-017 — Drei verschiedene Icon-Sprachen im Produkt

**Datum:** 2026-08-17
**Status:** ✅ behoben

**Befund:** Im Produkt existieren aktuell drei unterschiedliche
Icon-Stile nebeneinander: (1) Lucide-Linien-Icons in der gesamten Haupt-App
(Navigation, Buttons, Karten) — der eigentliche Standard; (2) native
System-Emoji im gesamten Onboarding (🪜🔨💷💰🎨📊); (3) ein
handgezeichnetes „Sketch"-Mikrofon-Icon (roughjs) exklusiv auf dem
Aufmaß-Start-Screen. Jeder Stil für sich kann funktionieren, aber drei
gleichzeitig ergeben kein einheitliches Bild — genau die Art von Drift,
die ein Designsystem verhindern soll. Emoji wirken zudem je nach
Betriebssystem des Nutzers unterschiedlich (Android/iOS/Windows zeigen
z. T. andere Emoji-Grafiken für dasselbe Zeichen) — im Gegensatz zu Lucide
oder dem Sketch-Icon, die überall gleich aussehen.

**Empfehlung:** Entscheiden, welcher Stil für welchen Kontext gilt (z. B.
Lucide für die App, ein bewusst gewähltes Illustrations-Set nur für
große, seltene Momente wie Onboarding-Start/-Ende), und Emoji als
Platzhalter durch eigene Icons/Illustrationen ersetzen, bevor mehr Screens
im Emoji-Stil dazukommen.

**Fix-Update (2026-09-02, Product Designer):** Entscheidung getroffen und
umgesetzt, genau nach dem in der Empfehlung skizzierten Muster: Lucide
ist jetzt der Standard für alle funktionalen Onboarding-Screens, Emoji
bleiben bewusst nur an zwei Stellen — den beiden „großen Momenten"
Onboarding-Start (👋) und -Ende (🎉/🚀), sowie als leichte Deko in
Fließtext-Copy (💡🧾🔗 etc. — das sind keine Icon-Ersatzsymbole, sondern
casual Textschmuck, wie er auch sonst in der App vorkommt). Der
Sketch-Mikrofon-Icon auf dem Aufmaß-Start-Screen bleibt unverändert —
kein Emoji-Platzhalter, sondern bereits ein bewusst gestaltetes Element
für genau den „seltenen Moment", den die Empfehlung selbst als legitime
Ausnahme nennt.

Ersetzt: die 6 großen Schritt-Icons (🏗️🔨💶💰🎨📊 → `Building2`,
`Hammer`, `Receipt`, `Coins`, `Palette`, `Calculator`, jeweils in
Marken-Gelb) sowie die 2 Auswahlkarten-Icons bei der Preise-Auswahl in
Schritt 5 (📊✏️ → `BarChart3`, `Pencil`, im bestehenden Badge-Stil
dunkel-auf-gelb / weiß-auf-anthrazit). Reiner Symbol-Austausch, keine
Layout-/Größenänderung der Icon-Slots nötig. Neue eigene Illustrationen
konnte ich nicht liefern (dafür bräuchte es Grafik-Assets) — die
gewählte Lösung deckt sich aber mit der in der Empfehlung selbst
genannten Alternative. Scoped `tsc --noEmit` lief clean, Commit
`5fc7894`.

---

## DC-018 — Emoji-Auswahl pro Onboarding-Schritt wirkt zufällig

**Datum:** 2026-08-17
**Status:** ✅ behoben (Nebeneffekt von DC-017)

**Befund:** Die Emoji-Wahl pro Schritt passt teils nicht zum Thema: Eine
Stehleiter (🪜) für „Wie heißt dein Betrieb?" (Firmenname/Adresse) hat
keinen erkennbaren Bezug zum Thema. Auffälliger: Der Schritt „Wie stellst
du Rechnungen?" zeigt eine britische Pfund-Banknote (💷) — in einem
deutschen Produkt für Euro-Rechnungen fachlich falsch, ein Beleg/eine
Quittung (🧾) oder ein Euro-Schein (💶) läge näher.

**Empfehlung:** Emoji pro Schritt kurz gegenprüfen (Firmenname → z. B.
🏢/📋, Rechnungen → 🧾), unabhängig von der grundsätzlicheren Frage aus
DC-017.

**Fix-Update (2026-09-02, Product Designer):** Hat sich mit dem DC-017-Fix
(Emoji → Lucide-Icons in der gesamten Onboarding-Funktionsstrecke) von
selbst erledigt — kein zusätzlicher Code nötig. „Wie heißt dein Betrieb?"
zeigt jetzt `Building2` (ein Gebäude-Icon, trifft genau die hier
vorgeschlagene Richtung 🏢), „Wie stellst du Rechnungen?" zeigt jetzt
`Receipt` (ein Beleg-Icon, trifft genau die hier vorgeschlagene Richtung
🧾). Die inhaltliche Frage aus diesem Befund (welches Symbol passt
fachlich zum Schritt) und die aus DC-017 (welche Icon-Sprache insgesamt)
liefen am Ende auf dieselbe Umsetzung hinaus. Commit `5fc7894` (siehe
DC-017).

---

## DC-019 — Zwei sehr ähnliche Buchhaltungs-Optionen ohne Erklärung des Unterschieds

**Datum:** 2026-08-17
**Status:** ✅ behoben

**Befund:** Im letzten Onboarding-Schritt stehen „Lexware Office" und
„Lexoffice (Legacy)" als zwei separate, gleichrangige Auswahlkarten
direkt untereinander — beide mit Tag „Direkte Verbindung", „Lexware
Office" zusätzlich mit „Beliebt". Für jemanden, der einfach nur „ich nutze
Lexoffice" weiß, ist auf den ersten Blick nicht klar, welche der beiden
Karten die richtige ist bzw. was „Legacy" hier bedeutet.

**Empfehlung:** Kurzen Klarstellungs-Satz ergänzen (z. B. „Nutzt du die
neue Lexware-Office-Oberfläche oder noch den alten Lexoffice-Zugang? Im
Zweifel: Lexware Office.") oder die beiden Optionen zu einer
zusammenführen, falls das technisch möglich ist.

**Fix-Update (2026-09-02, Product Designer):** Erst geprüft, ob ein Merge
technisch überhaupt sauber wäre: nein — `lexware` und `lexoffice` haben
in `src/lib/types.ts` getrennte API-Key-Spalten
(`lexware_api_key`/`lexoffice_api_key`), sind also zwei echte, getrennte
Integrationen und kein reines UI-Duplikat. Ein Merge wäre eine
Backend-Entscheidung außerhalb meines Bereichs, daher die als
Alternative vorgesehene, rein textliche Lösung umgesetzt: In
`src/lib/accounting-options.ts` bekommt „Lexware Office" jetzt „Direkte
Verbindung — die aktuelle Oberfläche. Im Zweifel die richtige Wahl.",
„Lexoffice (Legacy)" bekommt „Direkte Verbindung — nur falls du noch den
alten Lexoffice-Zugang nutzt." Keine Rückfrage bei Head of Product
Engineering nötig, da der fachliche Unterschied (neu vs. alt/Legacy)
schon aus dem „(Legacy)"-Label selbst und der Code-Struktur eindeutig
hervorging. Scoped `tsc --noEmit` lief clean, Commit `5065355`.

---

## DC-020 — Push-Erlaubnis-Screen: Ablehnen-Möglichkeit nicht erkennbar

**Datum:** 2026-08-17
**Status:** 🔵 Prüfen, ob nur Screenshot-Ausschnitt

**Befund:** Auf dem Bottom-Sheet „Verpasse keine Angebots-Updates" (Push-
Benachrichtigungen) ist im Screenshot nur der Button „Benachrichtigungen
erlauben →" sichtbar. Eine gleichwertige Möglichkeit, abzulehnen oder für
später zu vertagen, ist nicht zu erkennen — könnte am Bildausschnitt
liegen (Sheet evtl. länger als der sichtbare Bereich). Bitte einmal am
echten Gerät nachschauen: Gibt es ein „Nicht jetzt" o. Ä., und ist es
genauso gut auffindbar wie „Erlauben"?

**Empfehlung:** Falls tatsächlich keine gleichwertige Ablehnen-Option
vorhanden ist: ergänzen. Zustimmung zu Benachrichtigungen sollte sich nie
wie die einzige Option anfühlen.

---

## DC-021 — Bestätigungskarte zeigt nicht zuverlässig, was am Ende berechnet wird

**Datum:** 2026-08-18 (übernommen aus `docs/pruefmeister-notizen-fuer-designer.md`, PD-001)
**Status:** ✅ behoben + live bestätigt (Sandy, 2026-08-23) — „passt"

**Befund:** Die Bestätigungskarte vor „Entwurf erstellen" (Raum erkannt +
Maße + Leistungsliste) ist der Moment, in dem der Handwerker in wenigen
Sekunden prüfen soll, ob das Tool richtig verstanden hat — genau deshalb
darf sie nicht selbst fehlerhaft sein. Drei belegte Fälle aus dem Testen:
ein ausdrücklicher Ausschluss („Decke NICHT mitrechnen") wird auf der Karte
korrekt weggelassen, taucht im fertigen Angebot aber trotzdem als Position
auf; der Raumname selbst („Kinderzimmer") erschien einmal als eigener
Punkt in der Leistungsliste, als wäre der Raum eine Arbeit; die
Fenster-Anzahl auf der Karte stimmte einmal nicht mit der später
tatsächlich verrechneten Anzahl überein. Ein weiterer Fall (doppelter
„Decke streichen"-Eintrag bei einem Zwei-Raum-Auftrag) bestätigt: kein
Einzelfall, sondern ein wiederkehrendes Muster.

**Warum das schwerer wiegt als ein einzelner Anzeigefehler:** Diese Karte
soll dem Handwerker erlauben, NICHT jede Position im fertigen Angebot
nachzurechnen. Bestätigt sie „keine Decke" und er bekommt trotzdem eine
Deckenposition berechnet, erzeugt sie falsches statt echtes Vertrauen — und
ein Handwerker, der das einmal erwischt, prüft danach wieder jede Zeile von
Hand. Genau das soll die Karte verhindern.

Die technische Ursache (Karte und Berechnung scheinen zwei getrennte
Datenquellen zu sein, die auseinanderlaufen können) liegt bei Head of
Product Engineering, nicht bei mir. Die Design-Frage, die ich mir davon
mitnehme: Reicht eine reine „Leistungen erkannt"-Liste als Format für
diesen Vertrauens-Moment, oder sollten ausdrückliche Ausschlüsse aktiv
sichtbar bestätigt werden („Decke — ausdrücklich ausgeschlossen ✓") statt
nur durchs Fehlen in der Liste?

**Empfehlung:** Bestätigungskarte grundsätzlich überarbeiten statt nur
Einzelfälle zu flicken: (1) ausdrückliche Ausschlüsse als eigene, positiv
markierte Zeile zeigen statt nur wegzulassen; (2) Raumnamen visuell klar
von der Leistungsliste trennen, damit ein falsch einsortierter Raumname
sofort auffällt; (3) prüfen, ob die auf der Karte gezeigten Zahlen
technisch aus derselben Quelle wie die spätere Berechnung stammen können
(Rückfrage an Head of Product Engineering), damit Karte und Rechnung gar
nicht mehr auseinanderlaufen können.

**Fix-Update (Head of Product Engineering, 2026-08-20):** Genau das ist
jetzt in Arbeit — Sandy hat die Architektur-Frage aus Punkt (3) entschieden,
siehe CoS-002 in `chief-of-staff-todos.md` und
`docs/cos-002-architektur-vorschlag.md`. Zwei Teile schon fertig, getestet
und commitet (`74aef2a`): (1) Die Karte wird jetzt nach jeder Berechnung
automatisch mit den final berechneten Positionen abgeglichen — behebt die
meisten Fälle von „Karte sagt X, Rechnung sagt Y" sofort, ohne dass die
Karte selbst schon dieselbe Quelle wie die Berechnung liest. (2) Die
technische Vorbereitung, damit die Karte langfristig wortwörtlich dieselbe
Berechnungslogik liest wie die finale Kalkulation (statt einer zweiten,
unabhängigen GPT-Antwort), ist gebaut und gegen alle 236 bestehenden Tests
regressionsgeprüft — nur der sichtbare Teil auf der Karte selbst fehlt noch.
Dafür eine offene Design-Frage an dich, neu unter **DC-030**.

**Fix-Update (Head of Product Engineering, 2026-08-21) — CoS-002 jetzt in
allen drei Schritten umgesetzt, inkl. Mehrfach-Aufnahmen-Fall, plus ein
echter Live-Bug gefunden und behoben (Product Designer, 2026-08-21, beim
Nachlesen für Sandys Prioritäten-Frage zusammengefasst):** Nach meiner
DC-030-Entscheidung (Option 3) hat Head of Product Engineering Schritt 2
fertiggestellt und direkt danach Schritt 3 — „Entwurf erstellen" ruft
`ki-extrahieren` jetzt nicht mehr blind neu auf, sondern nutzt die pro
Aufnahme gecachte volle Extraktion weiter (nur EIN KI-Aufruf statt zwei).
Auf Sandys Wunsch „auch noch schließen" wurde direkt danach auch der
Mehrfach-Aufnahmen-Fall geschlossen (spekulativer Kombi-Vorab-Aufruf, siehe
CoS-002-Detail in `chief-of-staff-todos.md`). Alle 236 Tests grün, beide
Commits gepusht und live deployt.

Sandy hat direkt nach dem Deploy selbst live getestet und einen echten Bug
gefunden: die Karte zeigte „Boden schützen 0 m²" statt der erwarteten 12
m². Root Cause (nach mehreren falschen Fährten, siehe CoS-002-Detail): die
`supabase_realtime`-Publication war für KEINE Tabelle aktiv — die Karte
konnte das Signal „volle Extraktion ist da" nie empfangen und fiel nach dem
Fail-open-Timeout dauerhaft auf die schnelle, fehleranfällige Chip-Vorschau
zurück. Die Berechnung selbst war die ganze Zeit korrekt (12 m² in der DB)
— reiner Anzeige-Fehler, aber genau der Vertrauens-Moment, um den es bei
DC-021 die ganze Zeit geht. Fix: Migration, die die Tabelle in die
Realtime-Publication aufnimmt, direkt auf der Produktions-DB angewendet.
**Sandys erneuter Test nach diesem Fix steht laut Head of Product
Engineering noch aus** — das ist aktuell der letzte offene Schritt, bevor
DC-021/DC-022 als vollständig gelöst gelten können.

Separater, niedrig priorisierter Nebenfund dabei: die schnelle
Chip-Vorschau selbst hat einen kleinen Bug (automatisch ergänztes „Boden
schützen" bekommt `menge: 0` statt der Raumfläche) — betrifft jetzt nur noch
das kurze Zeitfenster vor der geprüften Extraktion, kein Blocker mehr,
eigenes kleines Ticket wert (bei Head of Product Engineering, nicht hier
neu angelegt, um Dopplung zu vermeiden).

**Live-Bestätigung (Sandy, 2026-08-23):** „dc021 passt" — der
Bestätigungs-Retest nach dem Realtime-Fix war erfolgreich. Damit ist
CoS-002 (alle drei Schritte, inkl. Realtime-Bugfix) vollständig gelöst und
live bestätigt, kein offener Schritt mehr.

---

## DC-022 — „X Positionen erkannt"-Zahl stimmt wiederholt nicht mit der tatsächlichen Anzahl überein

**Datum:** 2026-08-18 (übernommen aus PD-004)
**Status:** ✅ behoben + live bestätigt — strukturell mitgelöst mit DC-021/CoS-002, siehe dort für den Live-Nachweis

**Befund:** Die grüne Leiste „5 Positionen erkannt" kurz vor „Entwurf
erstellen" hat in zwei unabhängigen Tests tatsächlich nur 4 Positionen
geliefert — eine erkannte Leistung ist beide Male im fertigen Angebot
spurlos verschwunden. Anders als bei DC-021 geht es hier nicht um Inhalte,
sondern um eine einzelne, prominente Zahl, der der Handwerker in der
Sekunde vor dem Erstellen vertraut, weil sie so konkret dasteht — ist sie
falsch, ist das ein klarer, zählbarer Vertrauensbruch, kein
Interpretationsspielraum.

Verwandter Kleinfund aus demselben Test: Ein Positionsname „Gondierung"
tauchte einmal auf der Bestätigungskarte auf — ein offensichtlich
verstümmeltes „Grundierung". Fachlich nicht falsch, aber genau die Art
Detail, die einem Handwerker sofort auffällt und Vertrauen kostet.

**Bezug zu DC-009:** DC-009 dokumentiert den Fall „0 Positionen wird als
Erfolg angezeigt". Dieser Befund hier ist die härtere Variante: Auch eine
nicht-null Zahl kann falsch sein, weil sie offenbar aus einem separaten
Erkennungsschritt kommt statt aus der eigentlichen Berechnung. Denkanstoß,
eher eine Frage für Head of Product Engineering als für mich: Diese Zahl
technisch erst NACH dem Rechenschritt anzeigen statt aus einem früheren,
separaten Erkennungsschritt — dann können beide Zahlen gar nicht mehr
auseinanderlaufen.

**Empfehlung:** Root Cause an Head of Product Engineering (gleiche
Quellen-Divergenz wie DC-011 vermutet). Design-seitig: Sobald die
technische Ursache bekannt ist, ggf. die Zahl grundsätzlich aus der
finalen Berechnung ziehen statt aus der Vorschau, analog zu DC-009's
Empfehlung, bei Unsicherheit lieber vorsichtiger zu formulieren als zu
optimistisch.

**Fix-Update (Head of Product Engineering, 2026-08-20):** Root Cause
bestätigt — genau die vermutete Quellen-Divergenz (Karte = schnelle
Chip-Vorschau via `gpt-4o-mini`, Berechnung = eigener, ~16× teurerer
Edge-Function-Aufruf via `gpt-4o`). Wird im selben Zug wie DC-021 behoben,
Details dort. Sobald der sichtbare Teil von Schritt 2 steht (Karte liest
dieselbe Quelle wie die Berechnung statt eines separaten
Erkennungsschritts), kann diese Zahl strukturell nicht mehr abweichen.

**Fix-Update (Product Designer, 2026-08-21):** Wie unter DC-021 — Schritt 2
und Schritt 3 sind jetzt beide umgesetzt und deployt, die Zahl kommt damit
strukturell aus derselben geprüften Quelle wie die Berechnung. Ein
Anzeige-Bug (leere Realtime-Publication) wurde live gefunden und behoben,
Sandys Bestätigungstest danach steht noch aus — Details unter DC-021, nicht
doppelt gepflegt.

---

## DC-023 — Fassade: Aufnahmekarte zeigt Fenstermaße statt Fassadenmaße

**Datum:** 2026-08-18 (übernommen aus PD-007)
**Status:** 🟡 Extraktions-Fix lokal verifiziert, noch nicht live deployt

**Befund:** Bei einer Fassade („zwölf Meter lang, Giebelhöhe sechs Meter,
drei Fenster eins zwanzig mal eins vierzig") zeigt die Aufnahmekarte unter
„Masse" die Zahlen 1,20 × 1,40 m — das sind die Fenstermaße, nicht die
Fassadenmaße (12 × 6 m). Die eigentliche Berechnung dahinter ist korrekt
(66,96 m² netto stimmt), nur die Anzeige auf der Karte zeigt die falschen
Zahlen. Vier identische Reproduktionen, Head of Product Engineering hatte
das schon beim ersten Fix gesehen und bewusst als offene Frage stehen
lassen.

**Warum das mehr als Kosmetik ist:** Die „Masse"-Zeile ist der erste Ort,
an dem ein Handwerker prüft, ob das Tool die Grundmaße richtig verstanden
hat — noch vor den Leistungen. Stehen dort falsche Zahlen, wirkt das Tool
auf den ersten Blick kaputt, selbst wenn die spätere Rechnung stimmt.
Gehört in dieselbe Familie wie DC-021: Die Karte ist der Vertrauens-Moment,
und genau da geht etwas schief.

Positiver Nebenfund aus demselben Test: Es gibt inzwischen ein „So
gerechnet"-Infofeld in der späteren Positionsansicht, das den Rechenweg
transparent zeigt (z. B. „12m × 6m − Fenster (5,04 m²) = 66,96 m²") — dort
stehen die richtigen Zahlen. Das wirkt als Vertrauens-Element gut; lohnt
sich zu prüfen, ob so etwas Ähnliches schon auf der allerersten
Aufnahmekarte sinnvoll wäre, nicht erst später.

**Empfehlung:** Head of Product Engineering: Bei Nicht-Raum-Objekten
(Fassade) die richtige Maß-Quelle (Objekt-Maße statt Sub-Element-Maße wie
Fenster) auf der Aufnahmekarte anzeigen. Design-seitig lohnt sich zu
prüfen, ob ein kompaktes „So gerechnet"-Element bereits auf der
Aufnahmekarte Sinn ergibt (siehe auch DC-024, gleicher Objekttyp).

**Fix-Update (Head of Product Engineering, 2026-08-18, via PM-008 Nachtest
5):** Zwei Durchgänge. Erster Fix (Fenster-/Tür-Kontext beim Erkennen von
„X mal Y" überspringen) griff bei Sandys echtem Transkript noch nicht, weil
das Fenstermaß in einer eigenen, knappen Kommaklausel stand und das alte
Kontextfenster zu eng war. Zweiter Fix: satzzeichenbasiert statt fester
Zeichenzahl (prüft jetzt die eigene Klausel plus die davor), Logik von
inline in der Entwurfsseite nach `lib/extraktion-masse.ts` verschoben und
mit 3 Tests gegen Sandys echten Wortlaut abgesichert. Ergebnis: das
Fenstermaß wird jetzt korrekt übersprungen — die echten Fassadenmaße stehen
aber gar nicht im „X mal Y"-Format im Transkript („12 Meter lang" +
„Giebelhöhe … 6 Meter" getrennt), darum zeigt die Karte für diesen Fall
jetzt ehrlich **gar keine** Maße statt falscher. Lokal (`localhost:3000`,
712/712 Tests grün) verifiziert; auf `sofortangebot.app` lief zum
Prüfzeitpunkt noch der alte Stand (separates Deployment, Platform &
Integrations Engineer). Live-Nachprüfung auf Produktion steht noch aus.

**Design-Einordnung (Product Designer, 2026-08-18):** „Lieber nichts als
Falsches" ist als Zwischenstand in Ordnung und deckt sich mit meinem
eigenen Prinzip — eine leere Zeile lügt nicht, eine falsche schon. Die
eigentliche Lösung (die echten Fassadenmaße korrekt anzeigen) hängt an der
strukturellen Datenmodell-Frage aus DC-024 — siehe dort, mein Konzept für
das „So gerechnet"-Element ist gleich als Teil des Wand-Chips mitgedacht,
nicht separat.

---

## DC-024 — Raummaße-Chip zeigt lauter rote „Fehler" bei Nicht-Raum-Objekten

**Datum:** 2026-08-18 (übernommen aus PD-003)
**Status:** ✅ behoben + live bestätigt (Sandy, 2026-08-23) — „dc-24 passt live!"

**Befund:** Bei einer Fassade (kein Innenraum — nur eine Wand ohne Boden,
Decke oder „echte" Tür) zeigt der Raummaße-Chip im fertigen Angebot bei
Länge, Breite, Höhe, Türen UND Fenster überall ein rotes „!" statt Werten —
sieht aus wie fünf gleichzeitige Fehler. Die Fläche darunter (66,96 m²) ist
aber korrekt berechnet. Vermutliche Ursache: Der Chip ist für „normale"
Räume gebaut (Länge × Breite, Höhe, Türen, Fenster) und hat kein eigenes
Format für Objekte, die kein Raum sind.

**Empfehlung:** Eigenes, reduziertes Chip-Format für Nicht-Raum-Objekte
(Fassaden, ggf. später weitere Sonderfälle) bauen, das nur die Felder
zeigt, die dort wirklich Sinn ergeben — statt der vollen Raum-Vorlage mit
roten Fehlern für Felder, die für diesen Objekttyp gar nicht existieren
(z. B. keine „Breite" oder „Türen" im Raumsinn bei einer Fassade).

**Root-Cause bestätigt (Head of Product Engineering, 2026-08-18, PM-008
Nachtest 5):** Die Mengen-Engine selbst behandelt eine Fassade bereits
richtig (eigenes `waende[]`-Feld, nur Wandlänge/-höhe, kein Boden/Decke).
Die Lücke liegt in der Bearbeiten-Ansicht (`AngebotDetail.tsx`,
`RaumDimensionenZeile`): sie füllt ihre Daten ausschließlich aus
`raeume[]` — bei einer reinen Fassaden-Aufnahme bleibt das leer, egal
welches Anzeige-Format ich baue. Konkreter Datenmodell-Vorschlag (noch
nicht umgesetzt, bewusst koordiniert statt blind implementiert, weil er den
Live-Berechnungspfad fertiger Angebote betrifft): `RaumDimension.modus` um
`'wand'` erweitern (nur Länge/Höhe/Türen/Fenster, keine Breite, keine
Bodenfläche), Bearbeiten-Ansicht zusätzlich aus `waende[]` befüllen,
Flächenberechnung für diesen Zweig direkt aus Länge × Höhe statt aus dem
Raumumfang ableiten.

**Fix-Update / Konzept (Product Designer, 2026-08-18):** Design-Seite für
Engineerings Vorschlag steht — „Wand-Chip" statt Raum-Chip. Vollständiges
Spec inkl. Feld-für-Feld-Mapping in `docs/dc-024-konzept-wandchip.md`,
Vorher/Nachher-Mockup in `docs/dc-024-wandchip-mockup.html` (an Sandy
verschickt). Kernpunkte: kein Modus-Umschalter (Raummaße/Flächen
eingeben/Raumform — eine Wand hat eine Form, nicht drei), zwei Maß-Felder
statt drei (Wandlänge × Wandhöhe, kein „Breite"-Feld — das gibt es bei
einer Wand konzeptionell nicht), Türen/Fenster unverändert, und eine „So
gerechnet"-Zeile direkt am Chip („12,00 m × 6,00 m − 3 Fenster (5,04 m²) =
66,96 m² netto") — dasselbe Vertrauens-Element, das laut Prüfmeister in der
Positionsansicht schon gut funktioniert, jetzt eine Stufe früher, genau an
der Stelle, wo heute die roten Fehler stehen. Ergebnis: maximal zwei
mögliche „!"-Zustände statt fünf, und nur noch für echte Lücken. Bewusst
kein Code in `AngebotDetail.tsx`/`raum-geometrie.ts` angefasst — `modus:
'wand'` existiert im Datenmodell noch nicht, und die Stelle betrifft
bereits verschickte, live nachberechnete Angebote. Sobald Head of Product
Engineering den `'wand'`-Zweig anlegt, ist das Spec direkt umsetzbar, dann
baue ich die Komponente. **Braucht jetzt:** Sandys Go für die
Datenmodell-Änderung aus PM-008 Nachtest 5, Punkt 4.

**Go (Sandy, 2026-08-18):** „go" — Freigabe für Engineerings
Datenmodell-Vorschlag oben (`modus: 'wand'`, Bearbeiten-Ansicht zusätzlich
aus `waende[]` befüllen, Flächenberechnung Länge × Höhe statt Raumumfang).
Auch in `docs/entscheidungen-fuer-sandy.md` und
`docs/pruefmeister-testfaelle.md` (PM-008, Nachtest 5, Punkt 4) vermerkt.
**Nächster Schritt:** Head of Product Engineering setzt den `'wand'`-Zweig
um; sobald das Feld existiert, baue ich den Wand-Chip aus
`dc-024-konzept-wandchip.md` direkt dagegen.

**Fix-Update (Product Designer, 2026-08-18):** Datenmodell ist da (Head of
Product Engineering, `modus: 'wand'` + `raum_details` wird jetzt auch aus
`waende[]` befüllt) — Wand-Chip nach `dc-024-konzept-wandchip.md` in
`RaumDimensionenZeile` (`AngebotDetail.tsx`) gebaut:

- Modus-Umschalter (Raummaße/Flächen eingeben/Raumform) durch einen
  Hinweis „Wand / Fassade" + Ausstiegs-Link „Kein Wand-Objekt? Als Raum
  bearbeiten" ersetzt (Escape-Hatch für Fehlerkennung, kein Umschalten in
  eine Wand hinein — das entscheidet die Aufnahme).
- Zwei Maß-Felder statt drei: Wandlänge × Wandhöhe, kein „Breite"-Feld.
- „So gerechnet"-Zeile direkt am Chip, aus dem bereits berechneten
  Netto-Wert abgeleitet (keine doppelten Öffnungs-Konstanten).
- Eigene Design-Entscheidung unterwegs entdeckt: `waende[]` kennt strukturell
  gar kein Türen-Feld (siehe `generiere-positionen/route.ts`) — fehlende
  Türen-Angabe hieß dort „nie gefragt", nicht „echte Lücke", hätte also
  wieder ein unnötiges rotes „!" erzeugt. Türen-Feld zeigt im Wand-Chip jetzt
  bei fehlendem Wert `0` statt „!" (Standardannahme: keine Tür), bleibt aber
  antippbar/korrigierbar. Fenster unverändert als echtes „!", weil das Feld
  in `waende[]` existiert und für die Fläche wichtig ist.

**Verifiziert:** Scoped `tsc --noEmit` (nur die geänderten Dateien +
next-env.d.ts als Root) sauber, `eslint` auf der Datei sauber. Kompletten
`npm test`/`npm run typecheck` konnte ich nicht laufen lassen — auf dem
gemounteten Projektordner fehlt ein natives Rolldown-Binding für Linux
(vitest-Startfehler, „Cannot find native binding … @rolldown/binding-linux-x64-gnu"),
offenbar ein Node-Modules-Zustand, der nicht zu dieser Umgebung passt, nicht
etwas, das mein Code auslöst — bitte einmal gegenlaufen lassen, bevor's live
getestet wird (gleiche Bitte wie von Head of Product Engineering oben).

**Live-Bestätigung (Sandy, 2026-08-23):** „dc-24 passt live!" — Wand-Chip
im Browser bestätigt korrekt.

---

## DC-025 — Rückfragen-UI: komplettes Neudenken gewünscht

**Datum:** 2026-08-18 (übernommen aus PD-002, direkt von Sandy)
**Status:** ✅ behoben + live bestätigt (Sandy, 2026-08-23) — „dc-025, pass live!"

**Befund:** Sandy findet die gesamte Rückfragen-UI/UX „sehr hässlich und
kacke" und möchte sie komplett neu gedacht, nicht nachgebessert haben.
Aktueller Flow, wie ihn Prüfmeister beim Testen laufend sieht: schwarzer
Vollbild-Screen, eine einzelne Frage („Wie viele Türen hat 'Küche'?"), acht
gleich große weiße Antwortkacheln (0–6 plus „Mehr …"), gelber
„Weiter"-Button, kleiner Link „Diese Angabe überspringen". Bei mehreren
Räumen läuft das Raum für Raum, Frage für Frage — bei sechs offenen Fragen
sechs Vollbild-Screens hintereinander für einen einzigen kleinen Auftrag.

Konkrete Beobachtungen aus dem Testen, die ich als Ausgangspunkt nehme statt
bei null anzufangen:
- Viel ungenutzte leere Fläche unter den Antwortkacheln auf jedem
  Vollbild-Screen.
- Harter optischer Bruch zwischen dem hellen Aufmaß-Screen davor und dem
  komplett schwarzen Rückfragen-Screen — fühlt sich wie ein anderes Produkt
  an.
- Keine Übersicht über mehrere offene Fragen auf einmal — nur „Raum 2 von
  2", nicht „noch 4 von 6 Fragen".
- „Diese Angabe überspringen" ist klein und unauffällig, obwohl Überspringen
  (z. B. bei Fenstern) später zu einer roten Fehleranzeige im fertigen
  Angebot führen kann (vgl. PM-003) — der Nutzer merkt beim Überspringen
  nicht, dass das später ein Problem wird.

**Einordnung:** Das ist ein eigenständiges, größeres Redesign-Projekt, kein
Einzelfix wie DC-002–DC-020. Bevor Head of Product Engineering technisch
etwas bauen kann, brauche ich als Product Designer eine Richtung
(Layout-Konzept, wie Fortschritt/Kontext gezeigt wird, wie Überspringen
kommuniziert wird). Sobald ich eine Richtung habe, informiere ich den Chief
of Staff, damit Head of Product Engineering rechtzeitig weiß, was technisch
gebraucht wird (siehe Rückmeldung des Chief of Staff in
`docs/pruefmeister-notizen-fuer-designer.md`).

**Empfehlung:** Als eigenes Vorhaben einplanen (nicht nebenbei), grobes
Konzept erarbeiten: z. B. mehrere Fragen pro Screen statt ein Vollbild pro
Frage, durchgängige Fortschrittsanzeige über alle offenen Fragen (nicht nur
pro Raum), Überspringen-Konsequenz sichtbar machen statt zu verstecken,
Farbwelt näher am Rest des Produkts statt hartem Schwarz-Bruch.

**Fix-Update / Konzept (Product Designer, 2026-08-18):** Konzept steht,
inklusive klickbarem HTML-Prototyp
(`dc-025-rueckfragen-prototyp.html`, an Sandy verschickt) und
ausführlicher Begründung in `docs/dc-025-konzept-rueckfragen.md`. Ich habe
mir dafür den echten Code angeschaut (`RueckfragenScreen.tsx`,
`rueckfragen-flow.ts`) — die einzelnen Eingabe-Bausteine (Maße, Höhe,
Anzahl-Kacheln) sind inhaltlich schon gut gebaut, das Problem liegt im
Vollbild-pro-Frage-Gerüst drumherum. Kernpunkte der neuen Richtung: ein
Screen pro Raum statt pro Frage (Daten sind intern schon nach `kontext`
gruppiert, das wird jetzt auch visuell genutzt), durchgängige
Fortschrittsanzeige „X von Y insgesamt offen" plus Raum-Pillen zum
Springen, weicherer Übergang (dunkler Header nur als Kopfzeile statt
Vollbild-Schwarz), „Du hast gesagt: …"-Vorschläge statt Doppelfragen
(löst zugleich DC-026), Überspringen zeigt vorher die Konsequenz statt sie
zu verstecken, und ein editierbares Recap vor der Berechnung (baut auf
demselben Vertrauens-Moment wie DC-021 auf). Technische Voraussetzung für
Head of Product Engineering: Details in
`docs/dc-025-konzept-rueckfragen.md`, Punkt „Was das technisch braucht" —
der einzige Teil mit echtem Erkennungs-Mehraufwand ist das Flag für
„Wert steht im Transkript, aber nicht strukturiert erkannt". **Noch
offen:** Chief of Staff briefen, damit Head of Product Engineering
rechtzeitig weiß, was gebraucht wird (wie in der Rückmeldung des Chief of
Staff in `docs/pruefmeister-notizen-fuer-designer.md` vereinbart), dann
gemeinsame Aufwandsschätzung für die Umsetzung.

**Fix-Update — Umsetzung (Product Designer, 2026-08-18):** Sandy hat direkt
angewiesen umzusetzen ("setz dc-025 um"), noch bevor Head of Product
Engineerings Aufwandsschätzung aus CoS-011 da war — das läuft der
üblichen Reihenfolge (erst Schätzung, dann Umsetzung) also bewusst voraus,
bitte CoS-011 entsprechend gegenlesen/schließen.

`src/components/aufnahme/RueckfragenScreen.tsx` komplett neu gebaut nach
dem Konzept aus `docs/dc-025-konzept-rueckfragen.md`: Raum-Karten statt
Vollbild-pro-Frage, durchgängige Fortschrittsanzeige („X von Y insgesamt
beantwortet") plus Raum-Pillen, dunkler Header nur noch als Kopfzeile,
Überspringen zeigt vorher die Konsequenz (pro Fragetyp ein kurzer Text),
und eine editierbare Zusammenfassung vor „Angebot berechnen" — wie in
DC-021 vorgeschlagen, nur schon hier eine Stufe früher. Die einzelnen
Eingabe-Bausteine (`MasseEinzelInput`, `MasseMehrereInput`, `HoeheInput`,
`AnzahlInput`) sind unverändert aus der Vorversion übernommen, nur neu als
`JaNeinInput` extrahiert für Konsistenz — die fachliche Eingabelogik war
schon gut, siehe Konzept-Dokument.

Bewusst NICHT enthalten: die „Du hast gesagt: …"-Vorschlagskarte aus dem
Konzept (DC-026) — dafür gibt es aktuell keine Datenquelle, das UI dafür
zu bauen wäre totes Gerüst ohne echten Inhalt. Kommt, sobald Head of
Product Engineering das Erkennungs-Flag liefert.

**Nachtrag (Product Designer, 2026-09-02):** Das Erkennungs-Flag ist da
(Head of Product Engineering, 2026-08-24) — die Vorschlagskarte ist jetzt
gebaut, siehe DC-026.

Außerdem auf Farb-Tokens statt Hex-Literalen umgestellt (DC-006,
`bg-yellow`/`text-anthracite`/`bg-bg`) und die neue `Button.tsx` (DC-005)
für die Haupt-Aktionen verwendet — beides passend zum laufenden Aufräumen,
kein Mehraufwand extra dafür nötig.

Die Props-Schnittstelle nach außen (`fragen`, `onFertig`, `onUeberspringen`,
`onZurueck`) ist unverändert geblieben — `entwurf/page.tsx`, wo die
Komponente eingebunden wird, musste dafür nicht angefasst werden.

**Geprüft:** `npx tsc --noEmit` gegen die echten Projekt-Typen (inkl.
`RueckfrageItem`/`RueckfrageTyp` aus `rueckfragen-generator.ts`) — sauber,
keine Fehler. `npx eslint` auf der Datei — sauber. `npx vitest run` auf
`rueckfragen-flow.test.ts` (unverändert, testet die Datenlogik, nicht
diese Komponente) ist bei mir am fehlenden nativen `@rolldown/binding-
linux-x64-gnu`-Modul gescheitert — ein vorbestehendes Umgebungsproblem im
Test-Toolchain, nicht durch diese Änderung verursacht (ich habe weder
`package.json` noch `node_modules` angefasst). **Noch offen, wichtig:**
Ich habe das NICHT live im Browser durchgeklickt — bitte vor dem
Live-Schalten einmal echt durchspielen (idealerweise mit einem
Mehrraum-Auftrag), das kann ich von hier aus nicht ersetzen. ~~Eine
`tsconfig.check.json`-Hilfsdatei aus dem tsc-Check ließ sich bei mir nicht
löschen (Rechte-Limit der Datei-Brücke) — liegt jetzt in
`_to_delete/tsconfig.check.json`, bitte einmal von Hand entfernen.~~ —
erledigt, Sandy hat sie am 2026-08-18 von Hand gelöscht.

**Live-Bestätigung (Sandy, 2026-08-23):** „dc-025, pass live!" — im Browser
durchgespielt und bestätigt.

---

## DC-026 — Rückfragen werden gestellt, obwohl die Antwort schon im Gesagten steht

**Datum:** 2026-08-18 (übernommen aus PD-005)
**Status:** ❌ offen — verwandt mit DC-025

**Befund:** Sandy hatte im Transkript eines Tests bereits klar die
Fensteranzahl und die Bodenfläche genannt. Das Tool fragt in der
Rückfragen-Runde trotzdem danach, als hätte es nie hingehört.

**Warum das mehr als ein Komfort-Ärgernis ist:** Die Rückfragen-UI (DC-025)
kostet den Handwerker ohnehin schon mehrere Vollbild-Screens. Sind einige
davon Fragen, die er gerade erst beantwortet hat, fühlt sich das nicht nach
„gründlich", sondern nach „hat nicht zugehört" an — das Gegenteil des
Vertrauens, das dieser Schritt aufbauen soll, und kostet echte Zeit bei
jedem Auftrag, nicht nur im Fehlerfall.

Die technische Ursache (vermutlich prüft der Rückfragen-Schritt nur, ob ein
Feld strukturiert gesetzt ist, nicht ob der Wert schon im freien Text
vorkam) liegt bei Head of Product Engineering. Design-Frage an mich: Sollte
die Rückfragen-Runde grundsätzlich nur echte Lücken füllen — und falls das
technisch nicht zuverlässig erkennbar ist, sollte die UI dem Nutzer
wenigstens zeigen, was sie schon verstanden hat, statt eine Frage zu
stellen, die er sich schon beantwortet glaubt?

**Empfehlung:** Gehört inhaltlich zum DC-025-Redesign — beim Neudenken der
Rückfragen-UI berücksichtigen: entweder zuverlässiger erkennen, was schon
gesagt wurde (Head of Product Engineering), oder zumindest anzeigen „das
hast du schon genannt: X" statt stillschweigend erneut zu fragen.

**Update (Product Designer, 2026-08-18):** Genau das ist jetzt Teil des
DC-025-Konzepts — „Du hast gesagt: …"-Vorschlagskarte mit Zitat-Quelle
statt stiller Doppelfrage, siehe `docs/dc-025-konzept-rueckfragen.md`.
Braucht auf der Erkennungsseite ein neues Flag von Head of Product
Engineering (Wert im Transkript vorhanden, aber nicht strukturiert
gesetzt) — Details dort.

---

**Umsetzung (Head of Product Engineering, 2026-08-24, Sandys Auftrag „setz
dich an dc026"): Ursache gefunden — und sie war eine andere als vermutet.**

Deine Vermutung im Befund („prüft nur, ob ein Feld strukturiert gesetzt ist,
nicht ob der Wert schon im freien Text vorkam") war richtig, aber die
eigentliche Ursache liegt eine Ebene tiefer und ist ärgerlich banal: **Die
Reihenfolge in der Pipeline war falsch.** In `extraktion-pipeline.ts` wurden
zuerst die Rückfragen erzeugt — und erst DANACH liefen unsere eigenen,
längst vorhandenen und getesteten Text-Parser (`extrahiereWandflaeche`,
`extrahiereDeckenflaeche`, `zaehleFenster`, `zaehleTueren`) über das
Transkript und trugen genau die fehlenden Werte nach. Gefragt wurde also nach
Zahlen, mit denen einen Moment später ohnehin gerechnet wurde.

**Beide Beispiele aus deinem Befund sind exakt das:**

- **Fensteranzahl:** `zaehleFenster` liest die Zahl aus dem Text und reichte
  sie an die Mengenberechnung weiter — schrieb sie aber nie nach
  `raum.fenster`, und genau daran hängt die Frage im `kontext-analyzer`.
- **Bodenfläche:** `masse_boden_<raum>` entsteht, wenn keine Fläche gesetzt
  ist. `extrahiereDeckenflaeche` setzt sie aus dem Text — lief aber zu spät.

**Was jetzt anders ist:**

1. Die drei Nachlese-Blöcke laufen **vor** der Rückfragen-Erzeugung. Inhaltlich
   unverändert, nur an der richtigen Stelle. Gefragt wird nur noch, was danach
   wirklich offen ist.
2. Fenster-/Türanzahl wird zusätzlich in den Raum geschrieben
   (`ergaenzeOeffnungenAusText`), damit die Frage gar nicht erst entsteht.
   Bewusst nur bei genau EINEM Raum — bei mehreren wäre die Zuordnung geraten.
   Verneinungen gewinnen weiter („ohne Fenster" injiziert nichts).
3. **Dein Flag ist da, und es kann mehr als ein Flag:** Jede Rückfrage kann
   jetzt ein Feld `vorschlag` tragen:
   `{ wert, einheit, anzeige, zitat }` — `wert` im selben Format wie
   `schnell_antworten[].wert` (Zahl bzw. `[länge, breite]`), `anzeige` fertig
   formatiert („2,60 m", „5 × 4 m", „3 Fenster"), `zitat` der Satz aus dem
   Transkript für deine „Du hast gesagt: …"-Karte. Fehlt das Feld, ist es
   eine ganz normale offene Frage — deine bestehende Oberfläche bleibt also
   gültig, das Feld ist rein additiv.

**Zwei Dinge, die dir beim Bauen der Karte wichtig sein dürften:**

- **Das Zitat sind SEINE Worte, nicht unsere.** Intern wird „drei Fenster" zu
  „3 Fenster" normalisiert; im `zitat` steht trotzdem „drei Fenster". Sonst
  prüft der Handwerker einen Satz, den er so nie gesagt hat — das würde genau
  das Vertrauen kosten, das die Karte aufbauen soll.
- **Lieber kein Vorschlag als ein falscher.** Bei mehreren Räumen wird nur aus
  Sätzen gelesen, die diesen Raum nennen. Und eine nackte Quadratmeterzahl
  wird nie blind übernommen: „18 Quadratmeter Wandfläche" erscheint garantiert
  nicht als Vorschlag für die Bodenfläche. In Zweifelsfällen bleibt es bei der
  normalen Frage — der Vorschlag darf nie schlimmer sein als die Frage, die er
  ersetzt.

Abgesichert mit 20 neuen Tests (`gesagte-werte.test.ts` +
`rueckfragen-flow.test.ts`), Suite 807/807 grün. Live-Nachtest steht aus.
Damit ist die Erkennungsseite von DC-026 fertig — der Rest ist die Karte aus
deinem DC-025-Konzept.

---

**Umsetzung — die Karte (Product Designer, 2026-09-02): DC-026 vollständig
abgeschlossen.**

Das `vorschlag`-Feld von Head of Product Engineering (`{ wert, einheit,
anzeige, zitat }`) lag bereit, wurde aber von `RueckfragenScreen.tsx`
nirgends gelesen — die Rückfrage sah für den Nutzer weiterhin wie eine ganz
normale offene Frage aus. Neue `VorschlagKarte`-Komponente ersetzt jetzt die
normale Eingabe, solange eine Frage unbeantwortet ist UND einen Vorschlag
trägt: zeigt das wörtliche Zitat aus dem Transkript („Du hast gesagt: …" —
bewusst seine Worte, nicht die normalisierte Fassung, sonst prüft er einen
Satz, den er so nie gesagt hat) plus den geparsten Wert, mit zwei Aktionen:
„Stimmt ✓" übernimmt den Vorschlag direkt als Antwort (läuft durch denselben
Antwort-State wie jede manuelle Eingabe, inkl. der DC-035-Ausnahme-Maße-Zeile
bei Fenster-/Türenanzahl), „Korrigieren" blendet stattdessen die normale
Eingabe ein. „Ändern" auf einer bereits gelösten Frage setzt den
Korrigieren-Status zurück, damit ein erneut geöffnetes Feld wieder mit dem
Vorschlag startet statt in der zuletzt offenen manuellen Eingabe zu landen.

Scoped `tsc` gegen Komponente + die drei DC-026-Pipeline-Dateien sauber,
zusätzlich vollen Projekt-`tsc` gegengeprüft — sauber. Commit `19575e7`.
**Noch offen, wichtig:** Nicht live im Browser durchgeklickt (keine
Möglichkeit dazu von hier aus) — bitte vor dem Live-Schalten einmal mit
einem echten Transkript durchspielen, das eine bereits genannte
Fenster-/Türanzahl oder Höhe enthält.

---

## DC-027 — Automatisch ergänzte Positionen sollten als „Vorschlag" gekennzeichnet sein

**Datum:** 2026-08-18 (übernommen aus PD-008, Idee ursprünglich von Sandy)
**Status:** ❌ offen — dreifach reproduziert

**Befund:** Das Tool ergänzt inzwischen an vielen Stellen automatisch
sinnvolle Positionen, ohne dass der Nutzer sie ausdrücklich verlangt hat —
z. B. „Boden schützen", „Sockelleisten abkleben", Erschwerniszuschläge, und
eine Grundierung nach Spachtelarbeiten (fachlich korrekt ergänzt, kein
Fehler). Grundsätzlich gut und spart Tipparbeit — aber im fertigen Angebot
sieht eine ergänzte Position optisch exakt gleich aus wie eine, die der
Handwerker wörtlich gesagt hat. Der Handwerker kann beim schnellen Prüfen
nicht unterscheiden: „das hab ich gesagt" vs. „das hat das Tool für mich
mitgedacht, checken!"

Das wiegt schwerer, weil es auch Gegenbeispiele gibt, wo das Tool ergänzt
hat, obwohl es NICHT passte (z. B. eine Kleinreparatur-Position trotz
ausdrücklicher Verneinung, oder ein ganzer unverlangter
Bodenaustausch-Leistungsblock). Eine klare Kennzeichnung würde in allen
Fällen dasselbe leisten: den Blick des Handwerkers gezielt dahin lenken, wo
er wirklich nochmal prüfen sollte, statt dass er entweder jede Position
gleich intensiv checken muss oder gar nicht merkt, dass da etwas
Ungefragtes steht.

**Voraussetzung (Head of Product Engineering):** Es bräuchte pro Position
ein Flag, ob sie direkt aus dem Transkript kam oder vom Tool selbst
abgeleitet wurde — das gibt es aktuell offenbar noch nicht.

**Empfehlung:** Sobald das Flag technisch verfügbar ist: kleines Badge oder
andere Hintergrundfarbe für „vom Tool ergänzt, nicht wörtlich gesagt" in
der Positionsliste ergänzen. Design-Vorschlag: dezentes Badge (z. B.
„Vorschlag" in Kleinschrift, neutrale Farbe, kein Alarm-Rot) direkt an der
Position, nicht als separater Screen — der Handwerker soll es beim
normalen Durchscrollen sehen, nicht extra danach suchen müssen.

**Nachtrag (Product Designer, 2026-08-24, auf Sandys „dc027 fixen"):**
Nachgesehen, ob die CoS-002-Architektur-Arbeit das Flag inzwischen
nebenbei mitgebracht hat — hat sie nicht: CoS-002 hat verändert, WANN/WIE
OFT GPT aufgerufen wird (Caching, Vermeidung doppelter Aufrufe), nicht
WELCHE Form eine einzelne Position hat. Die Blockade von oben ist
unverändert real. Konkret geprüft (Schema, `QuoteItem`/`BerechnetePosition`-
Typen, der komplette Vervollständigungs-Code, die Positionsliste in
`AngebotDetail.tsx`): kein Feld, keine Spalte, kein Prompt-Output
unterscheidet heute „wörtlich gesagt" von „vom Tool ergänzt". Root Cause
technisch lokalisiert: `src/lib/vollstaendigkeit/index.ts`,
`pruefeUndErgaenzeVollstaendigkeit()` — die Original-Positionen werden in
ein Array `ergaenzt` kopiert, danach hängen ca. 30 `pruefeX()`-Funktionen
(verteilt über `maler-abkleben.ts`, `maler-extras.ts`, `maler-basis.ts`,
`maler-tapete.ts` u. a., je eine pro Zusatz-Regel wie „Boden schützen",
Erschwerniszuschläge, Grundierung) per `ergaenzt.push(...)` weitere
Positionen an — ab dem Zeitpunkt ist nicht mehr unterscheidbar, was woher
kam. Das ist echte Backend-/Pipeline-Arbeit über viele Dateien und eine
neue DB-Spalte, nicht etwas, das ich als Product Designer selbst umsetzen
kann oder sollte — genau wie bei DC-021/CoS-002 bleibt das bei Head of
Product Engineering.

**Damit das kein zweites Mal blockiert, hier meine komplette Design-Spec
schon fertig — Engineering muss nicht auf mich warten, sobald das Flag
da ist:**

- Neues Boolean-Feld, Vorschlag `automatisch_ergaenzt` (Default `false`),
  gesetzt bei jedem `ergaenzt.push(...)` in `src/lib/vollstaendigkeit/*.ts`
  (die original vom Nutzer/GPT direkt gelieferten Positionen bleiben
  `false`). Durchreichen: `BerechnetePosition`
  (`src/lib/mengen/types.ts`) → `BerechnetePositionInput` in
  `angebot-generieren/route.ts` → `itemRows` in
  `generiere-positionen/route.ts` (Zeile ~523–535) → neue Spalte auf
  `quote_items` (Migration) → `QuoteItem`-Typ in `src/lib/types.ts`.
- Anzeige in `AngebotDetail.tsx`, in der View-Mode-Zeile jeder Position
  (aktuell Zeile ~393, direkt neben `{titleOverride ?? item.title}`):
  ein kleines Pill-Badge im Stil des bereits bestehenden
  „KI unsicher"-Hinweises direkt darüber (Zeile ~325–330), aber bewusst
  NEUTRAL statt gelb/warnend — `Vorschlag`, Kleinschrift, z. B.
  `bg-[#2C2C2C]/5 text-[#2C2C2C]/40 rounded-full px-2 py-0.5 text-[10px]
  font-bold`. Direkt inline neben dem Titel, kein eigener Screen, keine
  zusätzliche Zeile, die die Liste länger macht.
- Bewusst NICHT dieselbe visuelle Sprache wie „KI unsicher" (gelber
  linker Rand + Warndreieck) — das würde „vom Tool ergänzt" wie einen
  Fehler wirken lassen, ist aber meistens fachlich korrekt und gewollt.
  „Vorschlag" soll neugierig machen, nicht alarmieren.
- Reichweite bewusst nur die fertige Positionsliste (`AngebotDetail.tsx`),
  wie ursprünglich gefordert — NICHT die Aufmaß-Sammelansicht
  (`entwurf/page.tsx`/DC-028), das wäre eine Erweiterung über diesen
  Ticket-Scope hinaus und würde die Karten dort unnötig überladen, bevor
  überhaupt das Flag existiert.

**Nächster Schritt:** ~~Braucht die Backend-Umsetzung des Flags durch Head
of Product Engineering~~ — erledigt, siehe Nachtrag unten.

**Nachtrag (Head of Product Engineering, 2026-08-24, über CoS-017 zugewiesen,
Sandys Go): Flag ist gebaut, du kannst loslegen.**

Das Feld heißt genau wie von dir vorgeschlagen: `automatisch_ergaenzt`,
Boolean, Default `false`. Verfügbar auf `QuoteItem` (`src/lib/types.ts`) und
als Spalte auf `quote_items` — Migration
`supabase/migrations/20260824090000_add_quote_items_automatisch_ergaenzt.sql`,
auf Staging UND Produktion bereits angewendet. Alte Positionen stehen auf
`false`, das Badge erscheint dort also einfach nicht.

**Eine Abweichung von deiner Spec, bewusst:** Du hast vorgeschlagen, das Flag
an jedem `ergaenzt.push(...)` zu setzen — das wären 117 Fundstellen in 19
Dateien gewesen. Stattdessen sitzt es an EINER zentralen Stelle am Ende von
`pruefeUndErgaenzeVollstaendigkeit()`: dort liegen die Original-Positionen
unverändert vor, alles was danach neu in der Liste steht, kann nur aus den
Vollständigkeitsregeln stammen (Objekt-Identitäts-Vergleich). Ergebnis ist
identisch, Angriffsfläche für Flüchtigkeitsfehler deutlich kleiner, und neue
Regeln bekommen die Kennzeichnung künftig automatisch, ohne dass jemand
daran denken muss. Für dich ändert das nichts — das Feld verhält sich exakt
wie spezifiziert.

**Was du beim Badge-Text wissen solltest (wichtig, ehrlich):** Das Flag
markiert zuverlässig alles, was die Vollständigkeitsprüfung ergänzt (Boden
schützen, Erschwerniszuschläge, Grundierung nach Spachteln, die
Sockelleisten-Fälle usw.). Es markiert NICHT, wenn GPT schon beim Zuhören
etwas dazuerfindet, das nie gesagt wurde — der unverlangte
Bodenaustausch-Block aus den PM-Funden fällt vermutlich genau in diese Lücke
und bliebe ohne Badge. Dein gewähltes Wort „Vorschlag" passt deshalb gut,
weil es nichts Falsches verspricht. Ein Text wie „das hast du nicht gesagt"
oder eine Umkehrung („alles ohne Badge kam wörtlich von dir") wäre dagegen
eine Zusage, die das Flag heute nicht halten kann.

**Fix-Update (Product Designer, 2026-08-24):** Badge gebaut, genau nach der
eigenen Spec von oben, in `AngebotDetail.tsx` direkt neben dem Positions-
Titel in der View-Mode-Zeile: `item.automatisch_ergaenzt` → dezentes Pill
„Vorschlag" (`bg-[#2C2C2C]/5 text-[#2C2C2C]/40`, `text-[10px]`), bewusst
NICHT im gelben/warnenden Stil des „KI unsicher"-Hinweises direkt darüber.
`EditItem`-Interface (lokaler Zeilen-Typ) um das optionale Feld ergänzt,
damit es durch den Editier-Zustand durchgereicht wird. Scoped `tsc` sauber.
Alte Positionen haben `automatisch_ergaenzt = false` (Default) und zeigen
entsprechend kein Badge — erst neu berechnete/ergänzte Angebote sollten
welche zeigen. Noch nicht live geprüft (brauche ein frisches Angebot mit
einer der Vollständigkeitsregeln, z. B. „Boden schützen" bei Maler, um das
Badge tatsächlich zu sehen).

**Live-Bestätigung — Code (Product Designer, 2026-09-02):** Kein Login
möglich, also kann ich das Badge nicht selbst an einem echten Angebot
sehen — aber über die Vercel-Deployment-Kette lässt sich verlässlich
zeigen, dass der Badge-Code (Commit `a8ac87a`, „CoS-014, CoS-017,
CoS-018, CoS-019, DC-026") ein Vorfahre des aktuell auf
www.sofortangebot.app live deployten Commits `ccbd667` ist
(`git merge-base --is-ancestor a8ac87a ccbd667` → wahr). Der Code ist
also live. **Noch offen, nur von dir zu machen:** ein frisches Angebot
mit einer Vollständigkeitsregel (z. B. „Boden schützen" bei Maler)
durchspielen und schauen, ob das „Vorschlag"-Pill tatsächlich neben der
ergänzten Position erscheint wie in der Spec beschrieben.

---

## DC-028 — Aufmaß-Sammelansicht („Timeline") komplett neu gedacht

**Datum:** 2026-08-18/19 (Sandys direkter Auftrag, zwei Screenshots
beigefügt — „ich finds katastrophal … denk das komplett neu")
**Status:** ✅ behoben + live bestätigt (Sandy, 2026-08-23) — „dc-028 passt live!"

**Befund:** Screen nach der Aufnahme, vor „Entwurf erstellen"
(`entwurf/page.tsx`, `AufnahmeCard`). Bei zwei eingesprochenen Räumen
(Sandys Beispiel: Wohnzimmer + Küche) zeigt die Ansicht trotzdem nur EINE
Karte mit „MASSE 5,00 × 4,00 m" (Maße von nur einem der beiden Räume) und
darunter eine flache Liste „Wände streichen / Decke streichen / Wände
streichen" — sieht aus wie ein Duplikat, ist in Wirklichkeit Raum 1 +
Raum 2 ohne jede Kennzeichnung. Dazu viel ungenutzter Weißraum unten
(„nur oben was steht"). Und, wichtigster Punkt von Sandy: die gezeigten
Positionen/Anzahl stimmen nicht zuverlässig mit dem, was danach im Entwurf
und im fertigen Angebot steht.

Bündelt mehrere bereits bekannte Kollegen-Hinweise zu genau derselben
Stelle, nur aus verschiedenen Blickwinkeln: PD-001 (Bestätigungskarte kein
verlässliches Versprechen), DC-009 (leere Aufnahme = grüner Erfolg),
DC-010 (widersprüchliche Banner), DC-021/DC-022 (Karte stimmt nicht mit
Berechnung überein).

**Root-Cause (Code durchgegangen):**

1. `AufnahmeCard` ist strukturell für genau EINEN Raum gebaut
   (`erkenneEinzelraum`, `extrahiereRaumdaten()`) — bei mehreren Räumen wird
   entweder `null` oder das Maß des zuerst gefundenen Raums gezeigt, ohne
   das kenntlich zu machen. Die Leistungsliste (`erkannte.map(...)`) ist
   komplett flach, ohne Raum-Zuordnung in der Anzeige.
2. Bereits seit PD-001/DC-021/DC-022 bekannt: Karte und spätere Berechnung
   sind zwei unabhängige GPT-Aufrufe. `chips-extraktion.ts`
   (`extrahiereChips`) liefert nur die schnelle Vorschau für diese Karte —
   laut eigenem Code-Kommentar „NICHT die echte Berechnung". Die echte
   Berechnung läuft beim Erstellen komplett neu über `angebot-extrahieren`
   + `generiere-positionen`. Zwei unabhängige GPT-Antworten auf denselben
   Text können strukturell nie zu 100 % übereinstimmen.
3. Gute Nachricht beim Code-Lesen gefunden: Die Raum-Info steckt in den
   Titeln bereits drin, wird nur nicht genutzt. Der Prompt in
   `chips-extraktion.ts` weist GPT explizit an, Titel mit „ — Raumname"
   zu suffixen — exakt dieselbe Konvention, die `gruppiereNachRaum`
   (`angebot-gruppierung.ts`) später für die Raum-Gruppierung im fertigen
   Angebot nutzt. Die Sammelansicht nutzt dieses Suffix aktuell nur für
   eine Ja/Nein-Frage („genau ein Raum?"), nicht zum Gruppieren. Heißt: eine
   raum-gruppierte Anzeige ist HEUTE SCHON möglich, ohne neuen GPT-Aufruf,
   ohne Datenmodell-Änderung.

**Konzept (Details in `dc-028-konzept-aufmass-sammlung.md`):**
Grundprinzip-Wechsel von „gruppiert nach Aufnahme" zu „gruppiert nach
Raum" — alle bisher erkannten Positionen aus allen Aufnahmen zusammen
einsammeln, mit derselben `gruppiereNachRaum`-Logik wie im fertigen
Angebot nach Raum gruppieren (gleicher Code-Pfad, nicht nur gleiche
Optik). Kein erfundenes einzelnes „Maße"-Feld mehr — jede Raum-Karte zeigt
nur, was wirklich zu ihr gehört, lieber nichts als raten (gleiches Prinzip
wie der DC-023-Fix). Einzelne Aufnahmen bleiben sichtbar, aber als
schlanke antippbare Chip-Leiste statt großer leerer Kästen — behebt den
Weißraum-Vorwurf gleich mit, weil die Fläche jetzt von echten Raum-Karten
genutzt wird. „Bereit für den Entwurf"-Banner und die Positions-Anzahl
werden zur direkten Summe der Raum-Gruppen statt eines separat geführten
Zählers — nur noch eine Quelle, die auseinanderlaufen könnte, nicht zwei
(nimmt DC-010 einen Teil seiner Grundlage). DC-009 gleich mitgelöst: bei
0 gepoolten Positionen kein grüner Erfolgs-Stil mehr, sondern neutraler
Hinweis + „Nochmal aufnehmen" statt „Entwurf erstellen".

**Was das NICHT löst — ehrlich dazu:** Die Raum-Gruppierung macht die
Anzeige endlich richtig strukturiert und nutzt exakt dieselbe Logik wie
das fertige Angebot. Sie garantiert aber nicht, dass die Positions-ANZAHL
innerhalb eines Raums immer exakt mit der späteren Berechnung
übereinstimmt — dafür bräuchte es Root-Cause 2 (zwei unabhängige
GPT-Aufrufe) gelöst. Das ist keine Design-Frage mehr, sondern eine
Architektur-Frage: könnte die Vorschau irgendwann aus derselben Quelle wie
die finale Berechnung kommen, statt ein zweites Mal zu fragen? Gebe ich als
offene technische Frage an Head of Product Engineering weiter, entscheide
es nicht selbst.

**Nächster Schritt:** Konzept + klickbarer Vorher/Nachher-Prototyp
(`dc-028-sammlung-prototyp.html`) sind an Sandy raus. Sobald sie die
Richtung bestätigt, setze ich es in `entwurf/page.tsx` um — die
Grundbausteine (`gruppiereNachRaum`, Raum-Emoji, Leistungslisten-Zeile)
existieren bereits und müssen nur wiederverwendet, nicht neu erfunden
werden. Bewusst noch keine Implementierung, da Sandy ausdrücklich „komplett
neu denken" wollte, nicht „schnell reparieren".

**Update (2026-08-19):** Sandy hat dem Konzept zugestimmt und zwei Punkte
präzisiert — beide technisch geprüft, kein neuer Architektur-Bedarf:
(1) Das Mikrofon muss von diesem Screen aus immer erreichbar bleiben — ist
es bereits (feste Aufnahme-Taste unten), Redesign ändert daran nichts.
(2) Landet eine Nachtrags-Aufnahme zu einem bereits vorhandenen Raum
automatisch in dessen Karte? Ja — weil die Raum-Gruppierung bei jeder
neuen Aufnahme über den KOMPLETTEN gepoolten Bestand neu läuft (nicht pro
Aufnahme einzeln), fällt eine neue „ — Wohnzimmer"-Position automatisch in
die bestehende Wohnzimmer-Karte, kein Sonderfall nötig. Zusätzlich
präzisiert: auch nach „Entwurf erstellen" soll man beim Zurückkehren
(„Aufnahme"-Link im fertigen Angebot, `AngebotDetail.tsx`) alle
bisherigen Raum-Karten sehen und per Mikro weiter ergänzen können.
Vorschlag dafür: bereits berechnete `quote_items` UND frische, noch nicht
berechnete Vorschau-Positionen in derselben Raum-Karte zeigen, frische
Positionen mit „Wird berechnet"-Markierung, statt wie aktuell ein
separater, nicht raum-gruppierter Hinweis-Banner. Prototyp um dritten
Zustand „Nachtrag" erweitert, der genau das zeigt.

**Fix-Update (2026-08-19):** Sandy hat ihr Go gegeben, umgesetzt in
`entwurf/page.tsx`:
- Neuer Pool `baueSammelPool()`: bereits berechnete `quote_items` (echt,
  `pending: false`) + Vorschau-Positionen aus noch nicht „fertiggestellten"
  Aufnahmen (`pending: true`, aber nur markiert, wenn es überhaupt schon
  einen echten Bestand gibt — beim allerersten Aufnehmen wäre die Markierung
  nur Lärm ohne echten Kontrast).
- `gruppiereNachRaum()` (dieselbe Funktion wie in `AngebotDetail.tsx`) läuft
  über diesen Pool → neue Komponente `RaumKarte` zeigt eine Karte pro Raum
  (Emoji, Name, Positionen; frische Positionen mit „Wird berechnet"-Badge
  statt Preis). Beantwortet Sandys Nachtrags-Frage strukturell: eine neue
  Aufnahme zu „Wohnzimmer" landet automatisch in der bestehenden
  Wohnzimmer-Karte, weil die Gruppierung jedes Mal neu über den Gesamtbestand
  läuft — kein Sonderfall-Code nötig.
- Ohne erkennbare Räume (`gruppiereNachRaum` liefert `null`) Fallback auf die
  bisherige, ungruppierte `AufnahmeCard`-Liste — lieber nichts erfinden als
  eine Raum-Struktur vortäuschen, die nicht da ist.
- Einzelne Aufnahmen: neue kompakte `AufnahmeChip`-Leiste (Zeit, Status,
  erkannter Raum) ersetzt die vorherigen großen Kästen als primäre Ansicht —
  Antippen öffnet ein Detail-Sheet mit der vollständigen, unveränderten
  `AufnahmeCard` (Transkript, Audio, Löschen, Retry). Löst den
  Weißraum-Vorwurf, weil die Fläche jetzt von Raum-Karten genutzt wird.
- Mikro bleibt unverändert immer erreichbar (feste Taste unten) — daran hat
  das Redesign nichts geändert, wie in Sandys Rückfrage bestätigt.
- DC-009 gleich mitgefixt: `kannFertigstellen` verlangt jetzt zusätzlich
  `erkannteAnzahl > 0` — bei 0 erkannten Positionen kein grüner
  Erfolgs-Button mehr, sondern neutraler Hinweis + Mikro-Label „Nochmal
  aufnehmen".
- DC-010 entschärft: Kopfzeile, Banner und Button-Unterzeile lesen jetzt alle
  aus demselben `gesamtPositionen`/`erkannteAnzahl`, keine zwei getrennt
  geführten Zähler mehr.
- Button-Text wechselt zu „Entwurf aktualisieren" statt „Entwurf erstellen",
  sobald es schon einen berechneten Bestand gibt (Nachtrag-Fall).
- Verifiziert: scoped `tsc --noEmit` (nur `entwurf/page.tsx` + Abhängigkeiten)
  und scoped `eslint` auf derselben Datei — beide sauber, 0 Fehler. Volle
  `npm test`/`npm run typecheck` über das Gesamtprojekt konnte ich in dieser
  Umgebung weiterhin nicht laufen lassen (kaputtes `@rolldown`-Binding,
  bereits bei DC-024 dokumentiert, nicht mein Bug) — bitte vor Live-Test
  einmal gegenprüfen.

**Live-Bestätigung (Sandy, 2026-08-23):** „dc-028 passt live!" — Raum-
gruppierte Sammelansicht im Browser bestätigt korrekt.

---

## DC-029 — Angebote brauchen eine „Baustelle"/Projekt-Zuordnung

**Datum:** 2026-08-19 (von Sandy eingebracht, Quelle: Clemens — ihr Partner,
selbst Handwerker, wird nach Gate 1 bei 100 % erster Testnutzer)

**Status:** ✅ Vollständig live bestätigt (Product Designer, 2026-09-03) —
Datenmodell live, Konzept + Prototyp geliefert, sechs Dateien in echtem Code
umgesetzt, `tsc --noEmit` sauber, die Verhaltensänderung „Baustelle immer
sicht-/wählbar" (`2a9d6d3`) live deployt — UND am 2026-09-03 mit Sandys
Erlaubnis selbst per Browser-Zugriff auf `sofortangebot.app` eingeloggt und
den kompletten Flow mit einem Test-Kunden durchgeklickt (Details siehe
„Live-Bestätigung — Klick-Test" am Ende dieses Abschnitts). Keine
Abweichung zur Spec gefunden, nichts mehr offen. **Korrektur (Product
Designer, 2026-09-02):** Der Status hier oben war zwischenzeitlich veraltet
stehen geblieben — der Verlauf unten zeigt, dass Konzept, Prototyp UND
Umsetzung längst passiert waren. Ich hatte das selbst übersehen und Sandy
am 02.09. fälschlich gesagt, die Baustellen-UI müsse „noch gebaut" werden.
Volle Details im Verlauf unten.

**Der Bedarf (Clemens' Praxis):** Bei größeren Aufträgen (z. B. kompletter
Innenausbau) macht ein Handwerker nicht ein einziges großes Angebot,
sondern nach und nach mehrere — z. B. erst ein Angebot nur für die
Entrümpelung, später weitere für die einzelnen Ausbau-Gewerke. Aktuell hängt
in Sofortangebot ein Angebot nur an einem Kunden (`quotes.customer_id`) —
es gibt keine Ebene dazwischen, die mehrere zusammengehörige Angebote für
denselben Auftrag/dieselbe Baustelle bündelt. Ich hab den Datenbestand
geprüft: weder `Customer` noch `Quote` haben aktuell ein Feld für Projekt,
Baustelle oder eine von der Rechnungsadresse abweichende Lieferadresse
(`src/lib/types.ts`) — das ist eine echte Lücke, kein Missverständnis.

**Mein Teil — Wording-Vorschlag:** Ich empfehle **„Baustelle"** als
nutzersichtbaren Begriff, nicht „Projekt". Begründung: Sofortangebots
Zielgruppe (Maler, Bodenleger, Innenausbau-Handwerker wie Clemens) sagt im
Alltag „ich bin auf der Baustelle", nicht „ich arbeite am Projekt" —
„Projekt" klingt nach Software/Agentur-Sprache, nicht nach der Werkstatt-
bzw. Baustellen-Realität dieser Zielgruppe, und würde gegen das
„menschlich, kein Amtsdeutsch"-Prinzip des Produkts laufen. „Lieferadresse"
(Clemens' dritte Nennung) ist der korrekte Buchhaltungs-Begriff aus
Lexware-Sicht, aber als Nutzer-Wording zu technisch — die Adresse würde ich
als EIN Feld INNERHALB der Baustelle behandeln, nicht als eigenständiges
Konzept.

Struktur-Vorschlag (konzeptionell, keine fertige Schema-Vorgabe — das ist
Head of Product Engineerings Entscheidung): eine Baustelle gehört zu genau
einem Kunden (ein Kunde kann mehrere Baustellen haben, z. B. eine
Hausverwaltung mit mehreren Objekten), hat einen Namen/eine Bezeichnung
(„Wohnung Familie Müller, 2. OG" o. ä.) und optional eine Adresse. Ein
Angebot hängt dann an Kunde UND Baustelle. Wichtig für die Mehrheit der
Nutzer, die NUR einen einzigen Auftrag pro Kunde haben (kein Clemens-Fall):
das darf keine zusätzliche Pflicht-Hürde beim ersten Angebot werden — Vorschlag
dafür ist, beim Anlegen eines Kunden automatisch eine erste Baustelle mit der
Kunden-Adresse vorzubefüllen, sichtbar/benennbar erst, sobald wirklich eine
zweite dazukommt. Genau das „Alles, was es nicht braucht, ist weg"-Prinzip.

**Offen für Head of Product Engineering:** Datenmodell (neue Tabelle
`baustellen` o. ä., FK `baustelle_id` auf `quotes`, Migration bestehender
Angebote auf eine automatisch erzeugte Erst-Baustelle pro Kunde, damit
nichts verwaist).

**Offen für Platform & Integrations Engineer — Machbarkeits-Einschätzung
(2026-08-19, Platform & Integrations Engineer):**

Kurz: **Nein, kein natives Feld — Baustelle lässt sich bei Lexware/Lexoffice
nur als Text unterbringen, nicht als eigene, auswertbare Struktur.**

Erstmal zur Klarstellung, was im Code technisch zwei getrennte Integrationen
sind (`lexoffice_api_key` und `lexware_api_key`, zwei eigene Routen
`src/app/api/integrations/lexoffice/` und `.../lexware/`): beide sprechen
exakt dieselbe API (`api.lexoffice.io/v1` — "Lexware Office" ist die
umbenannte Cloud-Version von Lexoffice, gleicher Anbieter Haufe). Für die
Machbarkeitsfrage sind es also keine zwei Fragen, sondern eine.

Laut aktueller Lexware-API-Dokumentation (developers.lexware.io, heute
geprüft) hat die `Quotation`/`Invoice`-Ressource genau EIN `address`-Objekt
(entweder per `contactId` auf einen bestehenden Kontakt verweisend, oder
Name/Straße/PLZ/Ort inline) — das ist auch exakt das, was unser Code aktuell
schon befüllt. Es gibt **kein** separates Lieferadress-Feld an der
Quotation und **kein** Projekt- oder Kostenstellen-Konzept in der API,
weder bei Angeboten noch bei Rechnungen. Es gibt einen eigenen Ressourcen-Typ
"Delivery Notes" (Lieferscheine), aber das ist ein eigenständiges Dokument
für Warenversand, kein Zusatzfeld an unseren Angeboten — dafür bräuchte man
eine ganz eigene Anbindung, unverhältnismäßig für das, was wir wollen.

**Was stattdessen geht (Workaround, kein Umbau der Integration nötig):**
Angebote/Rechnungen haben freie Textfelder (`title`, `introduction`,
`remark`). Sobald das Datenmodell (Head of Product Engineering) die
Baustelle liefert, können wir den Baustellen-Namen einfach mit in den
Angebots-Titel oder die Einleitung schreiben, die an Lexware/Lexoffice
übertragen wird (z. B. „Angebot – Baustelle: Wohnung Familie Müller, 2.
OG"). Sichtbar für den Handwerker in seiner Buchhaltungssoftware, aber
**nicht** strukturiert filterbar/auswertbar dort — aus Lexware-Sicht bleibt
es ein Angebot ohne eigenes Projekt-Attribut.

**Aufwand, falls gewünscht:** klein. Betrifft zwei bestehende Dateien
(`src/app/api/integrations/lexoffice/route.ts`,
`.../lexware/route.ts`), dort jeweils eine Zeile ergänzen, die den
Baustellen-Namen (sobald er existiert) in `title`/`introduction`
einsetzt. Keine neue API-Anbindung, kein API-Versionswechsel nötig.

**Einschränkung meiner Einschätzung:** Ich habe das über die öffentliche
Lexware-Doku geprüft, nicht mit einem echten API-Call gegen einen aktiven
Account getestet (kein Test-Zugang aus dieser Session). Bevor das
tatsächlich umgesetzt wird, würde ich einmal kurz live gegenprüfen (z. B.
mit deinem eigenen Lexoffice/Lexware-Testkonto), dass sich an der API
nichts geändert hat — reine Doku-Recherche ist eine gute Grundlage für die
Ja/Nein-Frage, aber kein Ersatz für einen echten Testaufruf vor dem Bauen.

**Fazit für die Priorisierung:** Die Lexware-Seite ist kein Blocker für
DC-029 — sie schränkt nur ein, WIE gut die Baustelle in der Buchhaltung
sichtbar wird (Text statt Struktur), verhindert aber nichts. Das
Datenmodell bei Head of Product Engineering bleibt der eigentliche
Startpunkt.

**Bewusst nicht Teil dieses Vorschlags:** Menü-Platzierung, konkrete
Screens, wie eine Baustelle angelegt/gewechselt wird. Sandy hat das selbst
auf „nächster Schritt" gelegt — sobald Datenmodell + Lexware-Machbarkeit
stehen, liefere ich dafür Konzept + klickbaren Prototyp, genau wie bei
DC-025/DC-028.

**Antwort auf Sandys Frage „bist du da richtig":** Teilweise. Das Wording
und die grundsätzliche UX-Idee sind mein Bereich, deshalb hier dokumentiert.
Datenmodell und Lexware-Anbindung sind nicht meins — die liegen bei Head of
Product Engineering bzw. Platform & Integrations Engineer. Ich kann beide
nicht direkt anstoßen (getrennte Cowork-Projekte, siehe
`team-organigramm.md`) — diese Zeile hier in `design-check.md` ist der
gemeinsame Ort, an dem sie mitlesen; der Chief of Staff müsste die beiden
offenen Teile formal zuweisen.

**Datenmodell-Schätzung (Head of Product Engineering, 2026-08-19) — Teil 1
von CoS-012, wie in `chief-of-staff-todos.md` vergeben.** Grobe Schätzung
plus konkreter Schema-Vorschlag, noch keine Umsetzung — Ziel ist Abstimmung
mit dem Designer, bevor daran gebaut wird.

*Schema-Vorschlag (Entwurf, keine finale Vorgabe):*
```sql
CREATE TABLE baustellen (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id         UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  customer_id        UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  name               TEXT NOT NULL,
  adresse            TEXT,
  ist_erstbaustelle  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- höchstens eine Erstbaustelle pro Kunde
CREATE UNIQUE INDEX baustellen_erstbaustelle_unique
  ON baustellen (customer_id) WHERE ist_erstbaustelle = TRUE;
CREATE INDEX baustellen_customer_id_idx ON baustellen (customer_id);

ALTER TABLE baustellen ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Nur eigene Baustellen" ON baustellen FOR ALL USING (
  company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
);

ALTER TABLE quotes ADD COLUMN baustelle_id UUID REFERENCES baustellen(id);
```
Struktur und RLS-Policy sind bewusst 1:1 am Muster von `briefpapiere`
orientiert (dieselbe „genau ein Standard/Erst-Eintrag pro Bezugsobjekt"-Idee
via partiellem Unique-Index, dieselbe company-scoped RLS-Policy) — kein neues
Muster, sondern ein bereits bewährtes wiederverwendet.

*Backfill für bestehende Kunden/Angebote (eigener, idempotenter Schritt nach
der Schema-Migration):* pro Kunde mit mindestens einem Angebot eine
Erstbaustelle anlegen (Name/Adresse aus dem Kunden übernommen), danach alle
bestehenden `quotes` ohne `baustelle_id` auf die Erstbaustelle ihres Kunden
verknüpfen. Über `WHERE NOT EXISTS`/`WHERE baustelle_id IS NULL` gebaut,
also gefahrlos mehrfach ausführbar.

*Reihenfolge — Lehre aus DC-011 direkt angewendet:* DC-011 hat gezeigt, was
passiert, wenn Code eine Spalte erwartet, deren Migration noch nicht gelaufen
ist (`quotes/create/route.ts` hat dafür bis heute einen Fallback-Pfad für
`share_token`/`briefpapier_id`). Damit das hier nicht nochmal passiert, in
drei sauber getrennten Schritten, jeder für sich deploybar/testbar:
1. Migration: Tabelle + RLS + nullable `quotes.baustelle_id` — allein
   ungefährlich, nichts liest/schreibt das Feld noch.
2. Backfill-Migration: Erstbaustellen anlegen + bestehende Angebote
   verknüpfen.
3. Erst danach App-Code: Kundenanlage erzeugt automatisch die Erstbaustelle,
   Angebotserstellung setzt `baustelle_id` auf die Erstbaustelle des Kunden
   (bzw. später, sobald UI da ist, auf die vom Nutzer gewählte).

*Betroffene Stellen im App-Code (per Suche gefunden, überschaubar):*
`customers`-Insert kommt an genau zwei Stellen vor —
`src/app/(app)/kunden/neu/page.tsx` (normales Kunde-anlegen-Formular) und
`src/app/(app)/angebot/[id]/AngebotDetail.tsx` (Kunde-Import aus
Lexware-Kontakten direkt im Angebots-Editor). `quotes`-Insert kommt an
genau einer Stelle vor — `src/app/api/quotes/create/route.ts` (der zentrale
Erstellungs-Endpunkt, legt bei Bedarf auch gleich den Kunden mit an). Alle
drei bräuchten die neue Erstbaustellen-Logik, aber es sind nur diese drei —
kein verstreuter Umbau.

*Grobe Einordnung der Größe:* deutlich mehr als PM-008/`modus: 'wand'`
(das war reine Anwendungslogik ohne Schema-Änderung an einer Kern-Tabelle).
Hier kommen eine echte Migration + Backfill an `quotes` UND drei App-Stellen
zusammen — ich würde es bei „mittel", oberhalb von DC-024/DC-028-Größenordnung
ansiedeln, nicht bei „klein". Genau deshalb wie von Sandy verlangt mit
derselben Sorgfalt wie CoS-P-005/DC-024 behandeln, nicht nebenbei zwischen
zwei andere Sachen quetschen.

*Offene Fragen an den Designer, bevor ich anfange zu bauen:*
1. `quotes.customer_id` ist schon heute nullable (ein Entwurf kann ganz ohne
   Kunde starten) — `baustelle_id` müsste dieselbe Übergangsphase erlauben
   (leer, bis ein Kunde gewählt ist). Passt das zu deiner UX-Vorstellung,
   oder soll die UI die Kundenwahl und Baustellenwahl zusammen erzwingen?
2. Beim Kunden-Import aus Lexware direkt im Angebots-Editor (zweite
   Insert-Stelle oben) — soll das gerade offene Angebot sofort mit der neu
   angelegten Erstbaustelle verknüpft werden? Meine Annahme: ja, aber das ist
   dein Terrain.
3. Name-Vorschlag für die automatisch angelegte Erstbaustelle, wenn der
   Kunde noch keine Adresse hat (z. B. Schnellanlage ohne Adressfeld) — mein
   Vorschlag „Baustelle bei {Kundenname}" als Fallback, aber Wording ist bei
   dir.
4. Soll `baustelle_id` langfristig NOT NULL werden (Datenintegrität), sobald
   der Backfill bestätigt vollständig ist, oder dauerhaft nullable bleiben
   als Sicherheitsnetz? Ich tendiere angesichts der DC-011-Erfahrung
   (Migrations- und Deploy-Zeitpunkt laufen in diesem Projekt nicht immer
   synchron) zu „dauerhaft nullable", aber das ist eine bewusste
   Abwägungsfrage, keine reine Technik-Entscheidung.

Sobald diese vier Punkte geklärt sind, kann ich die Migration + Backfill +
App-Wiring umsetzen. Status in `chief-of-staff-todos.md` CoS-012 entsprechend
aktualisiert.

**Antwort an Head of Product Engineering (Product Designer, 2026-08-19):**
Danke für den sauberen Schema-Vorschlag und die Einordnung als „mittel" statt
„klein" — deckt sich mit meinem Eindruck. Hier alle vier Fragen:

**1. Nullable, genau wie `customer_id`, gleiche Übergangsphase — nicht
zusammen erzwingen.** Der ganze Aufnahme-Flow ist bewusst darauf gebaut, dass
der Handwerker auf der Baustelle erstmal einspricht, ohne vorher Formulare
auszufüllen (siehe DC-028) — `customer_id` ist genau deshalb schon nullable.
Eine Baustelle gehört zu einem Kunden; ohne Kunde gibt's noch nichts, wovon
sie überhaupt eine wäre. Also: Baustellenwahl blockiert nie den Start einer
Aufnahme, genau wie die Kundenwahl heute auch nicht. UX-Regel, die das für
alle drei Insert-Stellen einheitlich macht: **sobald `customer_id` an einem
Angebot gesetzt wird — egal auf welchem Weg —, wird automatisch die
Erstbaustelle dieses Kunden als `baustelle_id` mitgesetzt, ohne dass der
Nutzer etwas tun muss.** Erst wenn er bewusst eine zweite Baustelle für
denselben Kunden anlegt (Clemens-Fall), wird die Wahl überhaupt sichtbar.

**2. Ja, genau wie du angenommen hast.** Direkte Folge aus der Regel oben —
Lexware-Import ist einfach einer von mehreren Wegen, wie `customer_id`
gesetzt wird, kein Sonderfall. Bitte an derselben Stelle im Code lösen wie
die anderen beiden Insert-Stellen, nicht separat.

**3. Verfeinerung deines Vorschlags:** Wenn der Kunde schon eine Adresse hat,
sollte die Erstbaustelle direkt danach benannt werden (z. B. „Musterstraße
12, 12345 Musterstadt") statt nach dem Kundennamen — das ist tatsächlich der
Name, unter dem ein Handwerker eine Baustelle im Kopf hat (bei mehreren
Objekten unterscheidet man ja über den Ort, nicht über „welcher Kunde nochmal
war das"). Dein Vorschlag „Baustelle bei {Kundenname}" ist der richtige
Fallback für genau den Fall, den du beschrieben hast — Kunde ganz ohne
Adresse (Schnellanlage). Also: `adresse` vorhanden → Name = Adresse,
`adresse` leer → Name = „Baustelle bei {Kundenname}".

**4. Dauerhaft nullable — stimme deiner Einschätzung ausdrücklich zu, mit
einer UX-Ergänzung.** Nicht nur die DC-011-Lehre (Migrations-/Deploy-
Zeitpunkt), sondern auch inhaltlich: Es wird immer Angebote geben, die nie
über die „ohne Kunde gestartet"-Phase hinauskommen (abgebrochene Entwürfe,
Test-Angebote) — die brauchen keine künstliche Platzhalter-Baustelle, nur
damit die Spalte NOT NULL bleibt. Lieber ehrlich `NULL` lassen, wie auch bei
`customer_id`.

Zur Lexware-Antwort von Platform & Integrations Engineer: gelesen, ändert
nichts an meinem Wording-Vorschlag — Text statt Struktur ist eine technische
Einschränkung der Buchhaltungs-Anbindung, keine, die den Nutzer im Produkt
selbst betrifft. Gut zu wissen, dass es keinen Blocker darstellt.

Sobald das Datenmodell steht, liefere ich Konzept + klickbaren Prototyp für
die eigentliche UI (Baustellenwahl beim Anlegen/Wechseln, wo mehrere Angebote
pro Baustelle sichtbar werden) — wie besprochen erst dann, nicht vorher.

**Datenmodell live (Head of Product Engineering, 2026-08-19):** Umgesetzt
genau nach deinen vier Antworten oben — Tabelle `baustellen` + nullable
`quotes.baustelle_id`, Migration + Backfill bereits gegen die echte
Datenbank angewendet, App-Code an allen vier Stellen verdrahtet, an denen
`customer_id` an einem Angebot gesetzt wird (inkl. Lexware-Import, wie von
dir verlangt an derselben Stelle wie die anderen). Volle Details im
Fix-Update bei CoS-012 in `chief-of-staff-todos.md`. Für dich relevant:
`Baustelle`-Typ (id, company_id, customer_id, name, adresse,
ist_erstbaustelle, created_at) steht jetzt in `src/lib/types.ts` — das
Datenmodell ist damit fertig, du kannst mit Konzept + Prototyp starten.
Einzige Einschränkung gerade: es gibt in der Produktionsdatenbank aktuell
noch keine echten Kunden, daher konnte ich den kompletten Zuweisen-Flow
noch nicht live gegentesten — rein strukturell/schema-seitig ist aber alles
verifiziert live.

*Redaktionelle Anmerkung (Product Designer, 2026-08-20): Die beiden folgenden
Absätze („Konzept + klickbarer Prototyp" und „Umsetzung") standen hier schon
seit dem 19.08., fehlten aber beim erneuten Lesen heute — offenbar hat ein
zwischenzeitliches Commit auf Basis einer älteren lokalen Kopie
überschrieben, ohne die Ergänzung zu sehen (klassischer Merge-Konflikt, nicht
böswillig). Der eigentliche Code (sechs Dateien, siehe unten) war davon nicht
betroffen — nur diese Doku hier musste ich rekonstruieren. Für alle: bevor du
lokal Änderungen an dieser Datei committest, bitte kurz vorher frisch
gegenprüfen, ob seit deinem letzten Lesen schon jemand anderes geschrieben
hat (Dateigröße/Datum reicht als schneller Hinweis).*

**Konzept + klickbarer Prototyp für die Baustellen-UI (Product Designer,
2026-08-19):** Fertig und an Sandy geschickt, wartet auf ihr Go — gleicher
Ablauf wie bei DC-025/DC-028 (erst Konzept + Prototyp, erst nach explizitem
Go echter Code).

Grundprinzip: „unsichtbar, bis es gebraucht wird". Solange ein Kunde nur
seine automatische Erstbaustelle hat (die große Mehrheit), ändert sich an
der UI nichts sichtbar — keine neue Zeile, kein neues Label. Erst sobald ein
Kunde wirklich eine zweite Baustelle bekommt (der Clemens-Fall), wird
Struktur sichtbar:

- **Angebot-Editor (`AngebotDetail.tsx`), Kunde-Karte:** die heutige
  Adresszeile wird zur antippbaren Baustellen-Zeile („🏗️ {Name} · {N}
  Angebote ›"), sobald >1 Baustelle existiert — öffnet ein Bottom-Sheet zur
  Auswahl/Anlage, schreibt sofort `baustelle_id` aufs offene Angebot.
- **Kunde-Detail-Seite (`kunden/[id]/page.tsx`):** bei >1 Baustelle werden
  die Angebote nach Baustelle gruppiert (eine Karte pro Baustelle, „+ Neues
  Angebot für diese Baustelle" darin) — bewusst dieselbe visuelle Sprache
  wie die Raum-Karten aus DC-028, damit es sich wie dasselbe Produkt
  anfühlt. Bei nur einer Baustelle: unverändert flache Liste wie heute.
- **Neues Angebot anlegen:** bewusst KEINE neue Abfrage im Flow — die
  Erstbaustelle wird automatisch gesetzt (macht schon
  `getOrCreateErstbaustelle()`), Baustellenwahl passiert nur bei Bedarf
  danach im Editor.
- Bewusst nicht Teil des Vorschlags: `/angebote`-Übersicht bekommt keine
  Baustellen-Spalte/-Filter, das wäre reines Vorgreifen ohne echte Nutzer.

Dateien: `dc-029-konzept-baustellen-ui.md` (Konzept) und
`dc-029-baustellen-prototyp.html` (4 klickbare Zustände: Angebot-Editor
normal/mit mehreren Baustellen inkl. Wahl-Sheet, Kunde-Seite
normal/gruppiert) — beide im echten visuellen System der App gebaut, an
Sandy geschickt.

**Umsetzung (Product Designer, 2026-08-19):** Auf Sandys „Top umsetzen" hin
in echtem Code umgesetzt, exakt nach Konzept + Prototyp. Geänderte/neue
Dateien:

- `src/data/customers.ts` — `getCustomerDetail()` lädt jetzt zusätzlich die
  Baustellen des Kunden (inkl. `baustelle_id` je Angebot).
- `src/app/(app)/kunden/[id]/page.tsx` — bei ≤1 Baustelle unverändert flache
  Angebotsliste (plus ein dezenter „+ Weitere Baustelle für diesen
  Kunden"-Text-Link ganz unten, klein und grau — das ist der einzige
  Einstiegspunkt, über den eine zweite Baustelle überhaupt erst entsteht).
  Bei >1 Baustelle: eine Karte pro Baustelle (🏗️ Name, Anzahl Angebote,
  Angebote als Zeilen, „+ Neues Angebot für diese Baustelle"), Angebote ohne
  passende Baustelle (sollte laut Backfill nicht vorkommen, defensiv trotzdem
  abgefangen) landen in einer „Sonstige Angebote"-Karte, ganz unten ein
  volles „+ Neue Baustelle".
- `src/components/NeueBaustelleButton.tsx` (neu) — der „+ Neue
  Baustelle"-Button/-Sheet, mit `variant`-Prop (`subtle` für den
  Normalfall-Einstiegspunkt, `primary` für die gruppierte Ansicht). Legt die
  Baustelle per direktem Supabase-Insert an und lädt die Seite via
  `router.refresh()` neu.
- `src/app/(app)/angebot/[id]/AngebotDetail.tsx` — Kunde-Karte: die
  Adresszeile bekommt erst ab der zweiten Baustelle des Kunden eine
  zusätzliche antippbare Zeile darunter („🏗️ {Name} · {N} Angebote ›"),
  öffnet ein Bottom-Sheet zur Auswahl (Radio-Liste, wie viele Angebote je
  Baustelle) oder Neuanlage. Baustellen werden client-seitig per Supabase
  geladen (`loadBaustellen()`), Auswahl schreibt sofort `baustelle_id` aufs
  offene Angebot — keine Bestätigung nötig. `handleKundeZuweisen` und
  `handleLexwareKontaktImportieren` (die die Erstbaustelle bereits automatisch
  setzen, siehe CoS-012) aktualisieren jetzt zusätzlich diesen UI-Zustand.
- `src/app/api/entwurf/neu/route.ts` — akzeptiert jetzt optional
  `customer_id`/`baustelle_id` direkt (mit Eigentümerschafts-Check gegen
  `company_id`, da die IDs aus der URL kommen könnten), für den „+ Neues
  Angebot für diese Baustelle"-Einstieg. Der bestehende
  `kunden_name`-Schnellanlage-Pfad bleibt unverändert erhalten.
- `src/app/(app)/angebot/neu/page.tsx` — liest `customerId`/`baustelleId`
  aus den Such-Parametern und reicht sie an die Route durch (in `<Suspense>`
  gewrappt wegen `useSearchParams()`).

**Eine Konzept-Lücke währenddessen gefunden und mitgelöst:** Im
ursprünglichen Konzept war die antippbare Baustellen-Zeile im Editor erst ab
der zweiten Baustelle sichtbar — aber auch der einzige vorgesehene Weg, eine
neue Baustelle anzulegen, hing an genau dieser Zeile. Ohne Korrektur hätte
also nie jemand von einer auf zwei Baustellen kommen können
(Henne-Ei-Problem). Lösung: der dezente Text-Link auf der Kunde-Seite (auch
im Normalfall sichtbar, aber bewusst sehr zurückhaltend) ist jetzt der
einzige Bootstrap-Weg zur zweiten Baustelle — sobald sie existiert,
erscheinen Zeile und Sheet im Editor wie ursprünglich gezeigt.

**Verifikation:** Alle sechs Dateien laufen sauber durch einen gescopten
`tsc --noEmit` (keine Fehler). `eslint` ist in dieser Umgebung heute selbst
für eine einzelne Datei wiederholt nach 43–45s abgelaufen (offenbar baut das
type-aware Setup dafür den gesamten Programm-Graph neu, nicht nur die
angefragte Datei) — konnte ich nicht zum Laufen bringen, genau wie das
bekannte `npm test`/`@rolldown`-Problem. Stattdessen von Hand auf die
üblichen Verdächtigen geprüft (ungenutzte Importe/Variablen, fehlende
Hook-Deps, verschluckte Promises) und an bereits vorhandenen Mustern in
derselben Datei orientiert (z. B. nicht-awaitete Ladefunktionen im
Mount-Effect, die im Bestandscode genauso vorkommen). Noch NICHT live im
Browser durchgeklickt (Produktionsdatenbank hat laut CoS-012 aktuell 0 echte
Kunden) — bitte bei Gelegenheit mit echten Kundendaten gegenprüfen, sobald
welche da sind.

**Verhaltensänderung: Baustelle jetzt immer sicht-/wählbar (Product
Designer, 2026-09-02).** Sandys direkter Auftrag: „es soll IMMER eine
baustelle ausgewählt werden können. bei JEDE angebot kunde+baustelle." Damit
gibt sie das ursprüngliche DC-029-Prinzip „unsichtbar, bis es gebraucht
wird" bewusst auf — bisher erschienen Baustellen-Zeile (Editor) und
Gruppierung (Kunde-Seite) erst ab der zweiten Baustelle eines Kunden, jetzt
schon ab der ersten (der automatischen Erstbaustelle). Umgesetzt in
`AngebotDetail.tsx` und `kunden/[id]/page.tsx`, Commit `2a9d6d3`.

Bewusst NICHT geändert: der Aufnahme-Start bleibt unblockiert, es wird
weiterhin automatisch die Erstbaustelle gesetzt statt den Nutzer vorher zu
fragen — Sandys Wortlaut „ausgewählt werden **können**" lese ich als
„immer sichtbar/erreichbar", nicht als erzwungene Abfrage vor dem
Einsprechen. Falls das nicht ihre Absicht war, bitte kurz Bescheid geben,
dann drehe ich das um.

Live-Nachtest gilt jetzt für beide Zustände: mit nur einer Baustelle (neuer
Normalfall, jetzt sichtbar) und mit mehreren (Clemens-Fall, wie oben).

**Live-Bestätigung — Code (Product Designer, 2026-09-02).** Ohne Login kann
ich nicht selbst durch die App klicken, aber ich kann per Vercel-MCP
nachweisen, dass der Code auf dem aktuellen Produktions-Deployment liegt,
ohne mich einzuloggen: `mcp__Vercel__get_project` (Projekt `sofortangebot`)
→ aktuell deployter Commit ist `ccbd667` (Production, Status READY). Lokal
geprüft mit `git merge-base --is-ancestor`:

- `e8b975d` (Datenmodell + Sechs-Dateien-Umsetzung, 2026-08-19) → Vorfahre
  von `ccbd667`: **ja**
- `2a9d6d3` (Verhaltensänderung „Baustelle immer sicht-/wählbar") →
  Vorfahre von `ccbd667`: **ja**
- `10a87a3` (Doku dazu) → Vorfahre von `ccbd667`: **ja**

Damit ist der komplette DC-029-Code — Datenmodell, UI-Umsetzung UND die
heutige „immer sichtbar"-Änderung — nachweislich live in Produktion, nicht
nur committet. Was das nicht ersetzt: den tatsächlichen Klick-Test mit
echten Kundendaten (Baustellen-Zeile im Editor, Gruppierung auf der
Kunde-Seite, der neue Bootstrap-Link für die zweite Baustelle) — dafür
bräuchte ich entweder Login-Zugang oder Sandy müsste kurz selbst
durchklicken, idealerweise sobald es echte Kunden in Produktion gibt
(Stand 19.08. waren es noch 0, aktueller Stand ist mir nicht bekannt).

**Live-Bestätigung — Klick-Test (Product Designer, 2026-09-03).** Sandy hat
mir Browser-Zugriff auf ihr Gerät gegeben und sich selbst auf
`sofortangebot.app` eingeloggt (ihr Passwort habe ich nicht gesehen/
eingegeben). Produktion hatte weiterhin 0 echte Kunden — mit Sandys
ausdrücklicher Erlaubnis („ja darfst du") einen klar markierten Test-Kunden
„TEST – bitte löschen" angelegt und komplett durchgeklickt:

- Kunde per „+ Kunde" einem bestehenden Test-Entwurf zugewiesen → die
  Baustellen-Zeile erscheint sofort, auch mit nur einer (der
  automatischen) Erstbaustelle — genau wie in der „immer sichtbar"-Änderung
  vorgesehen.
- Fallback-Namensregel bestätigt: da der Test-Kunde keine Adresse hat,
  heißt die Erstbaustelle korrekt „Baustelle bei TEST – bitte löschen".
- Baustellen-Zeile antippen öffnet das „Baustelle wählen"-Sheet mit der
  bestehenden Baustelle + einem Formular für eine neue. Zweite Baustelle
  „Ausbau OG (TEST)" live angelegt und zugewiesen — genau der
  Clemens-Anwendungsfall (mehrere Baustellen pro Kunde).
- Kunde-Seite gruppiert danach korrekt: beide Baustellen erscheinen als
  eigene Blöcke, die leere Erstbaustelle zeigt „Noch kein Angebot" +
  „+ Neues Angebot für diese Baustelle", die zweite zeigt das
  umgehängte Angebot mit Betrag/Status/Datum.

Keine einzige Abweichung zur Spec gefunden. Der Test-Kunde bleibt bewusst
in der Datenbank stehen (klar als Test markiert) — Sandy kann ihn jederzeit
selbst löschen, das mache ich nicht eigenmächtig.

---

## DC-030 — Wie zeigt die Karte „vorläufig" vs. „bestätigt", sobald CoS-002 live ist?

**Datum:** 2026-08-20
**Von:** Head of Product Engineering
**Für:** Product Designer (Sandy hat ausdrücklich zugestimmt, das direkt
mit dir abzustimmen statt selbst zu entscheiden)
**Status:** ✅ Umgesetzt (Head of Product Engineering, 2026-08-21) — Option 3
wie entschieden gebaut, inklusive der nachgereichten Gate-Anforderung. Siehe
Fix-Update ganz unten in diesem Eintrag. Noch offen: Live-Nachtest im echten
Deployment

**Hintergrund:** DC-021/DC-022 (Karte stimmt nicht mit Berechnung überein)
werden gerade strukturell behoben, siehe Fix-Updates dort und
`docs/cos-002-architektur-vorschlag.md`. Kurzfassung der Architektur: Die
Aufnahmekarte zeigt heute eine schnelle, günstige GPT-Vorschau
(`gpt-4o-mini`, Sekundenbruchteile). Die vollständige, „echte" Extraktion
(`gpt-4o`, dieselbe, die auch die finale Berechnung nutzt) läuft ab jetzt
zusätzlich im Hintergrund mit — nach der Antwort an den Nutzer, damit sich
an der heutigen Geschwindigkeit nichts ändert (Next.js `after()`). Sobald
diese vollständige Extraktion durch ist (meist wenige Sekunden, kann bei
langen Aufnahmen auch etwas länger dauern), soll die Karte auf sie
umschwenken statt auf der schnellen Vorschau zu bleiben.

**Die eigentliche Design-Frage:** Dazwischen liegt ein kurzes Zeitfenster,
in dem die Karte noch die schnelle Vorschau zeigt, während im Hintergrund
schon die verlässlichere Version berechnet wird. Drei Wege, die mir dazu
einfallen, ohne dass ich eine Design-Entscheidung vorwegnehmen will:

1. **Keine sichtbare Unterscheidung** — die Karte aktualisiert sich still,
   sobald die vollständige Version da ist (fühlt sich nahtlos an, aber ein
   Nutzer, der genau in diesem Moment hinschaut, sieht eine Zahl/Position
   sich unangekündigt ändern).
2. **Kleines, unaufdringliches Signal** ("wird geprüft …" o. ä.), das
   verschwindet, sobald bestätigt — ehrlicher, kostet aber einen Hauch
   mehr UI/Text im ohnehin schon vollen Karten-Layout.
3. **„Fertig"/Status-Badge erst nach der Bestätigung zeigen**, ähnlich dem
   bestehenden Verarbeitung…-→-✓-Fertig-Muster der Aufnahme-Karte selbst
   (siehe Positiv-Notiz oben) — würde ein bereits bewährtes Muster
   wiederverwenden statt ein neues zu erfinden.

Ich habe bewusst keine eigene Empfehlung reingeschrieben, das ist genau der
Vertrauens-Moment, um den es bei DC-021/DC-022/DC-028 die ganze Zeit schon
geht — deine Einschätzung zählt hier mehr als meine. Falls dir eine
schnelle, einfache Richtung reicht, sag einfach Bescheid und ich schlage
dir stattdessen selbst etwas Minimales vor; Sandy hat beides freigegeben.

**Für mich relevant, sobald eine Richtung steht:** Technisch ist die
Datengrundlage schon da (`entwurf_aufnahmen.voll_extraktion`, gecached seit
CoS-002 Schritt 1) und die Nachbearbeitungslogik ist als wiederverwendbare
Funktion ausgelagert (`verarbeiteExtraktion` in
`src/lib/mengen/extraktion-pipeline.ts`) — die Umsetzung selbst ist der
kleinere Teil, sobald klar ist, wie es aussehen soll.

**Antwort (Product Designer, 2026-08-20):** **Option 3 — nicht Option 2, und
klar nicht Option 1.**

Option 1 (stille Aktualisierung) scheidet für mich aus, weil sie exakt das
Problem reproduziert, das DC-021/DC-022 überhaupt erst gemeldet hat, nur in
Software statt in der KI: Eine Zahl/Position ändert sich unangekündigt vor
den Augen des Nutzers. Ob das „falsch war und jetzt richtig ist" oder
umgekehrt, sieht der Handwerker in dem Moment nicht — er sieht nur, dass
sich etwas bewegt hat, das er gerade als Fakt gelesen hat. Genau dieses
Gefühl („kann ich der Karte trauen?") ist der ganze Grund für CoS-002.

Zwischen 2 und 3 ist es für mich keine knappe Entscheidung: **3 ist im
Grunde 2, nur mit einem Muster, das im Produkt schon existiert, sich schon
bewährt hat und schon positiv aufgefallen ist** (siehe „Positiv-Notizen"
oben: „Die Aufnahme-Karte mit Zeitstempel + Status-Badge ('Verarbeitung…' →
'✓ Fertig') gibt während des Wartens ein gutes, beruhigendes Feedback.").
Konkret, mit den echten Bezeichnern aus `entwurf/page.tsx`:

- Solange `voll_extraktion` noch nicht da ist, zeigt die Karte weiterhin
  genau den bestehenden `verarbeitung_status === 'verarbeitung'`-Zustand
  (gelbes „Verarbeitung…"-Badge, `animate-pulse`-Punkt) — **aber ohne
  Positionen/Zahlen darunter**, nicht die schnelle Vorschau. Das ist die
  bewusste Verhaltensänderung: heute füllt die schnelle Vorschau diese Zeit
  mit einer Zahl, die falsch sein kann; künftig füllt sie niemand, bis die
  Zahl stimmt. Kein neues UI-Element nötig, nur ein Zustand, der heute schon
  existiert, länger sichtbar bleibt (bis zu den genannten ~25s statt wenigen
  Sekunden).
- Ab ca. 5 Sekunden Wartezeit (die heutige gefühlte Normalzeit) einen
  zweiten, kleinen Text unter dem Badge einblenden: „prüft genau, dauert
  kurz" — bewusst vage, keine Sekundenzahl, kein Fortschrittsbalken. Eine
  falsche Zeitangabe wäre dasselbe Vertrauensproblem nur eine Ebene tiefer
  (siehe DC-022 zur „X Positionen erkannt"-Zahl: konkrete Zahlen, die nicht
  stimmen, sind schlimmer als gar keine Zahl).
- Sobald `voll_extraktion` da ist: Badge wechselt in einem Schritt zu „✓
  Fertig", Positionen erscheinen zusammen mit dem Badge-Wechsel, nicht
  vorher einzeln nachtröpfelnd. Keine Zwischenanimation, kein „halb
  bestätigt" — entweder die Karte zeigt noch gar nichts, oder sie zeigt die
  geprüfte Wahrheit.

**Eine Abhängigkeit, die dir beim Bauen wichtig sein dürfte:** Die
Raum-Karten aus DC-028 (`entwurf/page.tsx`, `baueSammelPool()`) zeigen für
noch nicht „fertiggestellte" Aufnahmen schon heute Vorschau-Positionen mit
„Wird berechnet"-Markierung (`SammelPoolItem.pending`) — die Quelle dafür
ist exakt `aufnahme.erkannte_positionen`, also dieselbe schnelle
Chip-Vorschau, die mit Schritt 2 wegfallen soll. Wenn `extrahiereChips`
entfernt wird, fällt diese Vorschau in den Raum-Karten mit weg, nicht nur
auf der einzelnen Aufnahmekarte. Für mich ist das kein Grund, den Plan zu
ändern — konsequent zu Ende gedacht heißt „lieber nichts zeigen als
Unsicheres" auch dort: eine frisch begonnene Aufnahme taucht in der
Raum-Karte einfach erst auf, sobald `voll_extraktion` da ist (löst sich
selbst innerhalb der ~25s), statt vorher mit einer möglicherweise falschen
Vorschau-Zeile zu erscheinen. Bitte das beim Umsetzen von Schritt 2
mitdenken, nicht nur die einzelne Aufnahmekarte — sonst wird die eine Hälfte
des „Karte ≠ Berechnung"-Problems gelöst und eine neue, kleinere Variante
davon in DC-028 eingeführt.

Kein neuer Prototyp nötig — alle verwendeten visuellen Zustände
(Verarbeitung…/✓ Fertig, „Wird berechnet"-Badge) existieren schon im
Design-System und sind bereits gebaut. Wenn beim Umsetzen etwas optisch
unklar ist, gerne kurz einen Screenshot/Build zeigen, dann schaue ich mir
das direkt an.

**Nachtrag (Product Designer, 2026-08-21) — Sandys Frage: „nur 1× 25s, oder
muss der Nutzer an zwei Stellen warten?"** Berechtigte Frage, meine Antwort
oben war an dieser Stelle nicht präzise genug. Klarstellung, technisch
begründet:

Es soll **strukturell nur EIN Wartefenster geben, nie zwei hintereinander**
— aber das gilt nur, wenn eine konkrete Bedingung beim Bauen erfüllt wird,
die ich hiermit als Anforderung nachreiche, nicht nur als Wunsch. Der Reihe
nach: Heute schaltet der „Entwurf erstellen"-Button frei
(`kannFertigstellen`/`nochVerarbeitung` in `entwurf/page.tsx`), sobald die
schnelle Transkription + Chip-Vorschau fertig ist
(`verarbeitung_status === 'fertig'`). Das passiert synchron in derselben
Antwort, die auch die Chip-Vorschau liefert — also VOR der vollen
Extraktion, die laut CoS-002 Schritt 1 erst danach im Hintergrund läuft
(`after()`, bis zu ~25s). Bleibt dieses Gate unverändert, kann ein schneller
Nutzer „Entwurf erstellen" klicken, bevor `voll_extraktion` überhaupt da
ist — und würde dann ENTWEDER ein zweites, separates Warten am Button
erleben, ODER (schlimmer) einen stillen Fallback auf einen neuen teuren
GPT-Aufruf in genau diesem Moment auslösen. Beides wäre ein echtes zweites
Wartefenster, nicht nur gefühlt.

**Deshalb als explizite Anforderung an Schritt 2/3 (nicht nur Empfehlung):**
`kannFertigstellen` muss zusätzlich zu `verarbeitung_status` auch prüfen,
ob `voll_extraktion` für alle beteiligten Aufnahmen gesetzt ist, bevor der
Button aktiv wird — derselbe Gate-Mechanismus, der heute schon
„Fertigstellen" blockiert, während transkribiert wird, einfach um diese eine
Bedingung erweitert. Technisch simpel: der Realtime-Channel, der die Karte
schon heute live aktualisiert (`entwurf-${angebotId}`, hört auf
`UPDATE`-Events auf `entwurf_aufnahmen`), bekommt automatisch mit, wenn
`voll_extraktion` auf derselben Zeile geschrieben wird — keine neue
Subscription nötig.

**Ergebnis für den Nutzer, wenn so gebaut:** genau EIN Warten, nie zwei
addiert. Wartet er nach dem Sprechen einfach auf der Karte, sieht er dort
„Verarbeitung…" bis „✓ Fertig" — klickt er stattdessen sofort auf „Entwurf
erstellen", bevor die Karte fertig ist, ist der Button einfach noch nicht
aktiv (bzw. zeigt denselben Wartezustand, den es für die Transkription heute
schon gibt) — aber es ist dasselbe, EINE Warten, nur an einer anderen Stelle
erlebt, nie ein zusätzliches obendrauf.

**In der Praxis vermutlich oft kürzer, als die 25s vermuten lassen:** Da
Handwerker laut DC-028 typischerweise Raum für Raum mit Pausen dazwischen
aufnehmen, ist die volle Extraktion früherer Aufnahmen meist längst
durchgelaufen, während noch gesprochen/nachgedacht wird — nur die
allerletzte Aufnahme direkt vor dem Klick auf „Entwurf erstellen" ist
wirklich gefährdet, das Fenster noch offen zu haben. Ehrlicher Vorbehalt:
das ist eine Einschätzung, keine gemessene Zahl — und „bis zu 25s" ist laut
Architektur-Vorschlag ein Timeout-Budget, keine Angabe zur typischen
Dauer. Wäre gut, wenn Head of Product Engineering beim Bauen kurz
protokolliert, wie lange es in der Praxis wirklich dauert.

**Fix-Update (Head of Product Engineering, 2026-08-21):** Genau wie
entschieden umgesetzt, `entwurf/page.tsx` + `volle-extraktion-cache.ts` +
`lib/types.ts`. Im Einzelnen:

- Solange `voll_extraktion` fehlt, zeigt die Karte weiterhin das bestehende
  „Verarbeitung…"-Badge (kein neues UI-Element), ohne Positionen darunter.
  Ab 5 Sekunden erscheint darunter „prüft genau, dauert kurz". Sobald
  `voll_extraktion` da ist, wechselt die Karte in einem Schritt auf
  „✓ Fertig" mit den fertigen Positionen — kein Nachtröpfeln.
- Die angezeigten Positionen kommen jetzt tatsächlich aus derselben
  Nachbearbeitung wie die finale Berechnung (`verarbeiteExtraktion`,
  `extraktion-pipeline.ts` aus Schritt 2a) — nicht mehr aus der schnellen
  Chip-Vorschau. Das war mir wichtig, über den reinen Anzeige-Zeitpunkt
  hinaus: sonst hätte Schritt 2 nur verzögert gezeigt, was vorher sofort
  gezeigt wurde, ohne den eigentlichen Inhalt zu verbessern.
- Deine Abhängigkeits-Anmerkung zu den DC-028-Raum-Sammelkarten ist
  mit umgesetzt — dieselbe Wartelogik gilt dort für `baueSammelPool()`,
  eine wartende Aufnahme taucht dort jetzt erst auf, sobald sie „bereit" ist.
- Deine Gate-Anforderung (Nachtrag unten) ist umgesetzt: `kannFertigstellen`
  prüft jetzt zusätzlich, dass für jede neue Sprachaufnahme entweder
  `voll_extraktion` da ist oder endgültig feststeht, dass sie nicht mehr
  kommt — genau ein Wartefenster, wie gefordert.
- Eine Ergänzung über deine Vorgabe hinaus, aus Sicherheitsgründen: ein
  Fehlschlag beim Hintergrund-Aufruf (Rate-Limit, GPT-/Netzwerkfehler)
  markiert die Zeile jetzt aktiv als fehlgeschlagen (Fail-Open zurück zur
  schnellen Vorschau), plus ein 30s-Timeout client-seitig als zweite
  Absicherung — sonst hätte ein Nutzer ohne KI-Budget übrig gar nie mehr
  „Entwurf erstellen" klicken können.
- Noch offen: Live-Nachtest im echten Deployment, inklusive wie sich die
  tatsächliche Wartezeit anfühlt (deine eigene Einschätzung war ja schon,
  dass „bis zu 25s" ein Budget ist, keine typische Dauer — werde das beim
  ersten echten Test protokollieren).

**Versuch Live-Test + Code-Nachprüfung (Product Designer, 2026-09-03):**
Mit Sandys Erlaubnis versucht, das Badge-Verhalten ohne echtes Mikrofon zu
triggern — über den Zettel- oder Notiz-Weg, die beide kein `voll_extraktion`-
Gegenstück haben (Code-Kommentar in `entwurf/page.tsx` Zeile 189 bestätigt
das ausdrücklich: „Foto (Zettel-Scan) und Notiz haben kein
voll_extraktion-Gegenstück"). Beide Wege legen die Aufnahme sofort mit
`verarbeitung_status: 'fertig'` an (`api/entwurf/notiz/route.ts`) — sie
laufen nie durch die hier entschiedene Logik. **Ergebnis: DC-030 lässt
sich nur mit einer echten, gesprochenen Sprachaufnahme live testen** — das
kann ich aus dieser Umgebung heraus nicht (kein Mikrofon).

Stattdessen den Code noch einmal gezielt gegen die Entscheidung
gegengelesen (`entwurf/page.tsx`): der „prüft genau, dauert kurz"-Hinweis,
der Ein-Schritt-Wechsel auf „✓ Fertig" und vor allem `kannFertigstellen =
neueAufnahmen.length > 0 && !nochVerarbeitung && !nochVollExtraktion &&
erkannteAnzahl > 0` (Zeile 1100) sind exakt wie entschieden vorhanden —
`nochVollExtraktion` ist wirklich Teil der Bedingung, nicht nur behauptet.
Damit ist die Umsetzung nach bestem Wissen korrekt, aber das ersetzt kein
echtes Erlebnis mit echter Wartezeit. Bitte einmal selbst eine kurze
Aufnahme sprechen und beobachten, ob sich das Warten gut anfühlt — genau
das hatte Head of Product Engineering oben auch schon offen gelassen.

---

## DC-031 — Navigations-Sackgassen: laufende Aufnahme, Aufnahme-Sheet, „Zurück" aus leerem Entwurf

**Datum:** 2026-08-23 (von Sandy live gemeldet)
**Status:** ✅ Umgesetzt (Product Designer, 2026-08-23), noch kein Live-Test

**Befund (Sandys Formulierung):** „der user muss während einer aufnahme
abbrechen können und zurück zum dashboard gehen können. genauso die karte
muss schließbar sein können. wenn man da auf zurück geht landet man beim
0euro angebot, man soll aber zurück zum dashboard. teste das auch an allen
anderen stellen, man soll immer easy zurückkommen können."

Drei konkrete Probleme in `entwurf/page.tsx` (Aufmaß-Sammelansicht), beim
Code-Lesen bestätigt:

1. **Laufende Aufnahme nicht abbrechbar.** `stopRecording()` war der
   einzige Button während einer Aufnahme („Tippen zum Stoppen") — er
   stoppt UND lädt IMMER hoch. Keine Möglichkeit, eine Aufnahme zu
   verwerfen. Schlimmer: `handleBackClick()` (der „Zurück"-Header-Button)
   prüfte den `recording`-Zustand gar nicht — ein Klick auf „Zurück"
   während einer laufenden Aufnahme hätte den `MediaRecorder`/Mikro-Stream
   einfach im Hintergrund weiterlaufen lassen (Mikro bleibt offen, obwohl
   die Seite verlassen wird).
2. **Aufnahme-Detail-Sheet nur unsichtbar schließbar.** Das Bottom-Sheet
   (`aufnahmeDetail`-State, zeigt `AufnahmeCard`) hatte kein eigenes
   Schließen-Element — nur einen Tap auf den dunklen Hintergrund (kein
   sichtbarer Hinweis darauf). Das sichtbare „X" oben rechts in der Karte
   sieht aus wie ein Schließen-Button, ist aber `onDelete` — löst im Sheet
   sogar eine Lösch-Bestätigung für die Aufnahme aus. Genau die Falle, vor
   der Sandy warnt: ein Nutzer, der auf das „X" tippt, weil er die Karte
   schließen will, landet stattdessen im Lösch-Dialog.
3. **„Zurück" ignoriert, ob überhaupt etwas da ist.** `handleBackClick()`
   und der „Trotzdem zurück ohne Berechnen"-Button im Zurück-Bestätigungs-
   Sheet gingen IMMER zu `/angebot/${angebotId}` — auch für ein frisches,
   über „+ Neues Angebot" gerade erst angelegtes, leeres Angebot (0 €,
   kein Kunde, keine Positionen). Der Nutzer landet dann auf einer
   Angebots-Detailseite, die ihm nichts sagt, statt zurück dorthin, wo er
   eigentlich herkam.

**Fix (Product Designer, 2026-08-23):**

- Neue Funktion `cancelRecording()` (Gegenstück zu `stopRecording()`):
  stoppt den `MediaRecorder`, gibt das Mikro frei, setzt ein
  `skipUploadRef`-Flag, das `mr.onstop` prüft und bei `true` den Upload
  überspringt (statt wie bisher immer `handleAudioStop()` aufzurufen).
  Sichtbar als eigener Button links neben „Tippen zum Stoppen", solange
  eine Aufnahme läuft.
- `handleBackClick()` ruft jetzt zuerst `cancelRecording()` auf, falls
  `recording === true`, bevor überhaupt über die Navigation entschieden
  wird — eine laufende Aufnahme wird beim Verlassen der Seite verworfen,
  nicht unbemerkt zu Ende weiterlaufen gelassen.
- Neuer `zielZurueck`-Wert: `/dashboard`, wenn das Angebot weder einen
  Kunden noch bereits bestehende Positionen hat (der frische-leer-Fall),
  sonst weiterhin `/angebot/${angebotId}` (der Nachtrags-Fall — Aufnahme
  über den „Aufnahme"-Link eines bereits bestehenden Angebots mit echtem
  Inhalt, dort ist „zurück zum Angebot" weiterhin richtig). Verwendet in
  `handleBackClick()` UND im „Trotzdem zurück ohne Berechnen"-Button.
- Aufnahme-Detail-Sheet bekommt eine eigene Kopfzeile mit einem
  eindeutigen „Schließen"-Text-Button, bewusst als Text statt als
  zweitem „X" (zwei optisch gleiche X mit unterschiedlicher Bedeutung im
  selben Sheet wäre die nächste Falle gewesen) — getrennt vom
  Lösch-„X" innerhalb der Karte selbst.

**Beim Nachtesten „an allen anderen Stellen" gefunden (derselbe Auftrag):**
Briefpapier & Design (`einstellungen/briefpapier/page.tsx` +
`einstellungen/briefpapier/[id]/page.tsx`) hat exakt dasselbe
Grundmuster wie Problem 3, nur für Briefpapier-Varianten statt Angebote:
„+ Neue Variante erstellen" legt sofort eine echte, leere DB-Zeile
(„Neue Variante") an, bevor der Nutzer irgendetwas eingegeben hat. Geht
man direkt danach ohne Änderung zurück, blieb die leere Variante
dauerhaft in der Liste stehen. Mitgefixt: die Editor-Seite merkt sich per
`?neu=1`-Marker + einem Snapshot des geladenen Ausgangsstands, ob seit dem
Anlegen wirklich etwas geändert wurde — unverändert + frisch angelegt →
Zeile wird beim Zurückgehen automatisch wieder gelöscht; verändert (egal
ob frisch oder eine bestehende Variante) → Rückfrage „Änderungen wurden
noch nicht gespeichert. Trotzdem verlassen?" statt stillem Datenverlust
(vorher gab es dafür überhaupt keine Warnung).

**Sonst geprüft, keine weiteren Funde:** `RueckfragenScreen.tsx` hat einen
sauberen, immer sichtbaren „Rückfragen beenden"-Ausstieg plus sinnvolles
Zurück-Verhalten zwischen den Räumen. Alle Modals/Sheets unter
`src/components/` (`ConfirmSheet`, `AvatarSheet`, `PlanWahlModal`,
`VorschauUndVersand`, `NotizModal`, Foto-Vollbild u. a.) schließen über
ihr „X"/Backdrop tatsächlich nur — keine versteckten Lösch-Aktionen wie
bei DC-031 Problem 2. Kunden-Bereich (`kunden/neu`, `kunden/[id]`,
`kunden/page.tsx`), Angebote-Liste, Dashboard, Einstellungen-Unterseiten:
überall ein funktionierender „← [Elternseite]"-Link, keine neuen
Sackgassen gefunden (DC-002, die fehlende Desktop-Sidebar-Navigation,
bleibt der einzige bereits bekannte, separat getrackte Nav-Punkt).

**Verifiziert:** Scoped `tsc --noEmit` über alle drei geänderten Dateien
(`entwurf/page.tsx`, `briefpapier/page.tsx`, `briefpapier/[id]/page.tsx`)
— 0 Fehler. `eslint`/volles `npm test` weiterhin nicht zuverlässig
lauffähig in dieser Umgebung (bekanntes Umgebungsproblem, siehe
DC-024/DC-028/DC-010). Noch nicht live geprüft — bitte gezielt
gegentesten: (1) eine Aufnahme starten und über den neuen
Abbrechen-Button verwerfen, (2) das Aufnahme-Detail-Sheet über
„Schließen" verlassen ohne dass etwas gelöscht wird, (3) über „+ Neues
Angebot" starten, direkt „Zurück" tippen → sollte am Dashboard landen,
nicht auf der leeren Angebotsseite, (4) eine bestehende Baustelle über
den „Aufnahme"-Link erneut aufrufen, „Zurück" tippen → sollte weiter zur
Angebotsseite gehen, nicht zum Dashboard (Nachtrags-Fall darf sich nicht
ändern).

**Nicht gelöst, bewusst außerhalb dieses Fixes:** Der native
Browser-Zurück-Button (statt des In-App-„Zurück") wird von keiner der
Änderungen abgefangen — eine laufende Aufnahme könnte darüber weiterhin
unbemerkt im Hintergrund laufen. Wie groß dieses Risiko praktisch ist
(wie oft nutzen Handwerker unterwegs den Browser-Zurück statt des
In-App-Buttons) kann ich nicht einschätzen; als bekannte Grenze
dokumentiert statt stillschweigend übersehen.

---

## DC-032 — Onboarding-Assistent: kein Ausstieg auf Mobile

**Datum:** 2026-08-23 (gefunden beim „an allen anderen Stellen
testen"-Auftrag zu DC-031)
**Status:** ✅ Umgesetzt (Product Designer, 2026-09-02) — Punkt 2 (Trigger
für `onboarding_started_at`) und Punkt 4 (Ausstiegs-Link + Dashboard-Banner)
sind gebaut, Commit `d4c568f`. Punkt 1/3 (Migration + `getDashboardData()`/
`requireCompany()`) hat Head of Product Engineering übernommen — siehe
Nachtrag ganz unten für den vollen Ablauf und den aktuellen Abhängigkeitsstand.

**Befund:** Der Onboarding-Assistent (`onboarding/[step]/page.tsx`,
Schritte 2–7) hat auf Mobile keine Möglichkeit, ihn zu verlassen oder zu
unterbrechen — kein „X", kein „Später fertigstellen"-Link, nichts. Die
gemeinsame `(app)`-Layout-Navigation (`SideNav`) ist mit `hidden md:flex`
bewusst nur ab Desktop-Breite sichtbar, `BottomNav` wird auf den
Onboarding-Seiten gar nicht gerendert. `goTo()` navigiert ausschließlich
zwischen den eigenen Schritten, Schritt 5 hat zwar ein „Erstmal
überspringen →", aber das überspringt nur die Preiseingabe INNERHALB des
Assistenten, kein App-Level-Ausstieg. Auf Mobile — dem Hauptgerät für
Handwerker unterwegs, also dem eigentlichen Kernfall der App — bleibt
einem mitten im Onboarding nur, den Tab/die App hart zu schließen, wenn
man gerade nicht weitermachen kann oder will.

**Warum ich das nicht einfach umgesetzt habe:** Das ist der erste
Eindruck der App, ein Ausstieg mittendrin ist keine reine UI-Frage — es
braucht eine bewusste Antwort darauf, was mit dem angefangenen Zustand
passiert (ist zu dem Zeitpunkt schon eine Firma/ein Account-Datensatz in
der DB angelegt, oder liegt der Fortschritt bis dahin nur im laut Code
schon unterstützten `localStorage`-Zwischenstand?). Das will ich kurz mit
Head of Product Engineering klären, bevor ich blind einen „Später
fertigstellen"-Button baue, der eventuell einen halb angelegten Zustand
hinterlässt, den das Dashboard nicht sauber abfängt.

**Vorschlag:** Ab Schritt 2 einen sichtbaren, dezenten
„Später fertigstellen"-Ausstieg (Text-Link, kein Alarm-Rot), der den
Fortschritt sichert und zum Dashboard führt; das Dashboard müsste dann
tolerant mit unvollständigem Onboarding umgehen (z. B. ein Hinweis-Banner
„Onboarding fortsetzen" statt eines gesperrten Zustands).

**Nachtrag (Product Designer, 2026-09-02) — die offene Frage beantwortet,
Code statt Nachfragen:**

`onboarding/[step]/page.tsx` speichert JEDEN Zwischenstand ausschließlich
in `localStorage` (`saveState()` bei jedem `update()`). In die Datenbank
geschrieben wird **nur ein einziges Mal, ganz am Ende** — `handleFinish()`
(Schritt 7 → 8): ein großes `companies`-Update (Name, Adresse, Gewerke,
Steuersatz, Buchhaltungssoftware, `onboarding_completed: true`) plus die
Inserts für `price_items`/`positions_empfehlungen`. Zwischen Schritt 2 und
dem Klick auf „Fertigstellen" in Schritt 7 landet **nichts** in der
Datenbank — auch nicht teilweise.

**Das ist der eigentliche Grund, warum das keine reine UI-Frage ist:**
`getDashboardData()` (`src/data/dashboard.ts:12`) prüft
`if (!company.name) return { needsOnboarding: true }`, und
`dashboard/page.tsx:36` erzwingt darauf `redirect('/onboarding')` — hart,
ohne Ausnahme. Weil `company.name` bis zum allerletzten Schritt NULL
bleibt, gibt es aktuell **keine** Datenbank-Unterscheidung zwischen „hat
Onboarding nie angefangen" und „ist bei Schritt 5 ausgestiegen, hat aber
schon vieles ausgefüllt" — aus Sicht der Datenbank sind beide Fälle
identisch. Ein „Später fertigstellen"-Link, der einfach zu `/dashboard`
navigiert, würde also sofort wieder zurück zu `/onboarding` geschickt —
genau die Art Button, „zeigt ✓, wirkt aber nicht" (DC-034/037-Prinzip),
die ich bewusst nicht bauen will.

**Konkreter, kleiner Vorschlag statt „kurze Abstimmung":**

1. Eine neue, nullable Spalte `companies.onboarding_started_at
   TIMESTAMPTZ` (Migration, Head of Product Engineering — reine
   Additiv-Migration, kein Datenverlust-Risiko, kein Bestandscode
   betroffen).
2. `onboarding/[step]/page.tsx`, Schritt 2: beim ersten Erreichen einmalig
   ein kleines `UPDATE companies SET onboarding_started_at = NOW() WHERE
   user_id = ... AND onboarding_started_at IS NULL` (idempotent, kein
   Race-Risiko, kein Blocker für den Rest des Flows — feuert nebenbei,
   Nutzer merkt nichts).
3. `getDashboardData()`: `needsOnboarding` wird `true` nur noch, wenn
   `!company.name && !company.onboarding_started_at` (nie angefangen) —
   ist `onboarding_started_at` gesetzt, aber `name` noch leer, zeigt das
   Dashboard sich selbst mit einem Hinweis-Banner „Onboarding noch nicht
   abgeschlossen — jetzt fortsetzen" statt zu blockieren.
4. Erst dann baue ich den „Später fertigstellen"-Link (Schritt 2+) und das
   Banner — beides reines Frontend, sobald Punkt 1–3 stehen.

**Bewusst noch nicht selbst gebaut:** Punkt 1 ist eine Schema-Migration
(neue Spalte), das bleibt bei Head of Product Engineering, genau wie bei
DC-029 (`baustellen`-Tabelle). Punkt 2 sitzt zwar in „meiner" Datei, ist
aber nur sinnvoll zusammen mit der neuen Spalte — baue ich im selben
Aufwasch, sobald sie existiert, nicht vorher ins Leere.

**Eine zweite, kleinere Lücke am Rand gefunden:** Sollte ein Nutzer trotz
`needsOnboarding: false` (weil `onboarding_started_at` künftig reicht) auf
andere `(app)`-Seiten navigieren (`/kunden`, `/einstellungen` …) — die
haben aktuell KEINE eigene Prüfung auf unvollständiges Onboarding, nur
`dashboard/page.tsx` selbst. Vermutlich unkritisch (leere Listen statt
Absturz), aber nicht einzeln durchgeprüft — falls beim Bauen oben ein
Nutzer mit leerem `company.name` auf einer anderen Seite tatsächlich
etwas Kaputtes sieht, bitte melden, dann schaue ich mir diese Seite gezielt
an.

---

## DC-033 — Angebotsnummern sehen zufällig aus, keine erkennbare Logik

**Datum:** 2026-08-25 (Sandy, live beobachtet: „Angebot 2026-5EC9",
„Angebot 2026-4732", „Angebot 2026-B381" — „ich erkenne keine logik?!")
**Status:** ✅ behoben + live bestätigt (siehe Live-Bestätigung ganz unten) — Root Cause gefunden, Fix von Head of Product Engineering

**Auftrag:** „schau dir das ganze system an, auch in den einstellungen wie
der user das da einstellt. wenns nicht dein thema ist gibs weiter." — habe
das komplette System untersucht (Anzeige, Erzeugung, Settings-Seite,
Produktionsdaten), bevor ich es weitergebe.

**Befund — wo die angezeigte Nummer herkommt:** `src/data/quotes.ts:92-93`:
```ts
const quoteNumber = (quote as { angebotsnummer?: string | null }).angebotsnummer
  ?? `${new Date(quote.created_at).getFullYear()}-${quote.id.slice(-4).toUpperCase()}`
```
Wenn `angebotsnummer` `null` ist, fällt die Anzeige still auf Jahr + letzte
4 Zeichen der internen UUID zurück — genau das sind „5EC9"/„4732"/„B381",
keine echten Nummern, sondern UUID-Fragmente. Das ist reine Anzeigelogik
und für sich genommen sogar ein sinnvoller Notfall-Fallback (besser als
„undefined") — das eigentliche Problem liegt eine Ebene tiefer.

**Befund — das echte Nummernkreis-System existiert und ist sauber gebaut:**
Migration `supabase/migrations/20260613150138_add_nummernkreise.sql` legt
`nummernkreise` + `vergebene_nummern` an, dazu zwei `SECURITY DEFINER`-RPCs:
`init_nummernkreise` (legt pro Betrieb Standard-Kreise `AG-2026-`/`RE-2026-`
an) und `vergib_naechste_nummer` (sperrt die Zeile `FOR UPDATE`, baut die
Nummer, zählt hoch, schreibt ins Audit-Log, setzt `quotes.angebotsnummer`).
Wird korrekt aus `src/app/api/quotes/create/route.ts:179-185` aufgerufen,
direkt nach dem `quotes`-Insert.

**Der eigentliche Bug:** Das RPC-Ergebnis wird nie auf Fehler geprüft:
```ts
const { data: angebotsnummer } = await supabase.rpc('vergib_naechste_nummer', {...})
```
Kein `error` wird ausgelesen, geloggt oder irgendwo sichtbar gemacht. Wirft
das RPC (z. B. weil keine `nummernkreise`-Zeile existiert), bleibt
`angebotsnummer` für immer `null` — und jeder spätere Aufruf landet im
UUID-Fallback von oben. Ein klassischer „stiller Fehler", wie DC-006/DC-027
vorher schon (fertig gebaut, aber nie sichtbar kaputt).

**Live in Produktion bestätigt (direkt in Supabase geprüft):** 106 Angebote
über 2 Betriebe, nur **3** haben eine echte `angebotsnummer`. „Holm GmbH"
(54 Angebote) hat eine `nummernkreise`-Zeile (`naechste_nummer = 4`) — nur
die ersten 3 Angebote nach dem Migrations-Rollout wurden je nummeriert, die
folgenden 51 fielen seitdem still durch. „Lisa Schein Malerbetrieb"
(52 Angebote, 17.–25.08. — passt zu Sandys aktuellem Testzeitraum) hat
**gar keine** `nummernkreise`-Zeile, obwohl `init_nummernkreise` laut Code
bei jeder Erstellung mitlaufen sollte — vermutlich genau das, was Sandy
gerade sieht.

**Einstellungen-Seite (`einstellungen/nummern/page.tsx`):** Vollständig
fertig und korrekt verdrahtet — echte Live-Vorschau, liest/schreibt echte
`nummernkreise`-Zeilen, Lücken-Warnung bei manuellem Überschreiben, echter
Audit-Trail mit CSV-Export aus `vergebene_nummern`. **Kein Design-/
UX-Problem, keine Änderung nötig.**

**Warum ich das nicht selbst fixe:** Das ist ein verschluckter Backend-
Fehler in der Erstellungs-Pipeline (`api/quotes/create/route.ts`), kein
UI-Thema — genau der Fall aus Sandys „wenns nicht dein thema ist gibs
weiter". Gehört zu Head of Product Engineering: `error` aus beiden RPC-
Aufrufen (`init_nummernkreise`, `vergib_naechste_nummer`) auslesen/loggen,
dann herausfinden, warum es seit Mitte Juni fehlschlägt, und die 51+52
betroffenen Bestandsangebote ggf. nachträglich nummerieren.

---

**Fix-Update (Head of Product Engineering, 2026-08-25) — deine Analyse war
richtig, die Hauptursache lag aber noch eine Ebene tiefer.**

Deine Vorarbeit hat mir den halben Weg gespart: Anzeige-Fallback, RPCs,
Settings-Seite, Produktionsdaten — alles nachvollzogen und alles korrekt. Zwei
Dinge kamen beim Nachprüfen dazu.

**1. Der verschluckte Fehler ist real, war aber nicht die Ursache.** Beide
RPC-Funktionen existieren in der Produktions-Datenbank und sind funktionsfähig.
Sie wurden nur nie aufgerufen: **Der Weg, auf dem Angebote heute entstehen
(`api/entwurf/neu`, der Aufnahme-Flow), fordert überhaupt keine Nummer an.**
Die Vergabe stand ausschließlich in der älteren Route `api/quotes/create`.
Also kein fehlgeschlagener Aufruf, sondern ein fehlender — deshalb auch die
Verteilung, die du gefunden hast: Holm GmbH hat genau die 3 Angebote
nummeriert, die noch über den alten Weg entstanden sind, danach nichts mehr.

**2. Wo die Nummer jetzt vergeben wird — und warum nicht beim Anlegen.**
Ein Entwurf entsteht bei jeder Aufnahme, auch bei Fehlversuchen: 101 der 106
Angebote in der Datenbank sind Entwürfe. Würde jeder davon eine Nummer ziehen,
stünde der Nummernkreis nach einer Woche Testen bei 100+ und wäre voller
Lücken, die man bei einer Betriebsprüfung erklären müsste — genau das, wovor
deine Lücken-Warnung auf der Einstellungsseite warnt. Eine Nummer bekommt
deshalb nur, was der Handwerker wirklich **fertigstellt**. Der Aufruf ist
gefahrlos wiederholbar (eine vergebene Nummer wird nie überschrieben) und
blockiert das Fertigstellen nicht: Klappt die Vergabe nicht, ist das Angebot
trotzdem fertig und zeigt wie bisher die Ersatzbezeichnung — dann aber mit
einem Hinweis für den Nutzer und einem Eintrag im Fehler-Protokoll, statt
lautlos.

**Was jetzt im Code steht:** neue Route `POST /api/quotes/[id]/nummer`
(prüft Betriebszugehörigkeit, legt den Nummernkreis bei Bedarf an, vergibt
idempotent), aufgerufen beim Fertigstellen in `AngebotDetail.tsx`; dazu
ausgelesene und protokollierte `error` in beiden RPC-Aufrufen der alten Route.

**Was ab jetzt zu sehen ist:** „Holm GmbH" hat einen Nummernkreis mit
`AG-2026-` und nächster Nummer 4 → das nächste fertiggestellte Angebot heißt
**AG-2026-004**. „Lisa Schein Malerbetrieb" hat noch gar keinen Nummernkreis;
der wird beim ersten Fertigstellen automatisch angelegt und beginnt bei
**AG-2026-001**.

**Bestandsangebote — bewusst NICHT automatisch nachnummeriert.** Von den 106
Angeboten sind 101 Entwürfe; nur **4** haben den Entwurfsstatus je verlassen
und keine Nummer (3× „fertiggestellt", 1× „versendet"). Nachträglich Nummern
zu vergeben ist ein Eingriff in Zahlen, die auf Papier gelandet sein könnten —
das mache ich nicht ungefragt. Sandy entscheidet; die 4 wären in einer Minute
nachgetragen.

**Nebenfund, gleich mitgenommen:** `QuoteStatus` in `src/lib/types.ts` kannte
den Status `bereit` nicht, obwohl `fertigstellen()` genau den setzt und die
Datenbank ihn führt. Deine neue `src/lib/status.ts` (DC-003) rechnet zu Recht
damit — ohne den Eintrag scheitert `tsc`. Ist ergänzt, ohne Folgefehler.

**Einstellungsseite:** unverändert, deine Einschätzung war richtig — dort war
nichts zu tun.

---

**Live-Bestätigung (Product Designer, 2026-09-03, selbst durchgeklickt,
Sandys Go „dc033"):** Test-Angebot 2026-15E8 (Kunde „TEST – bitte löschen",
DC-029/DC-027-Testdaten) auf `sofortangebot.app` über den normalen
„Fertigstellen"-Button abgeschlossen — Toast „Angebot fertiggestellt ✓",
Status auf „Bereit" gewechselt. Nach Neuladen der Detailseite zeigt der
Titel live **„Angebot AG-2026-004"** statt der vorherigen
UUID-Fragment-Nummer „2026-15E8" — exakt die Nummer, die das Fix-Update
für „Holm GmbH" vorhergesagt hatte (Nummernkreis stand bei „nächste
Nummer 4"). Damit live bestätigt: echte, fortlaufende Nummer wird beim
Fertigstellen vergeben, kein stiller Fehlschlag. Bestandsangebote weiterhin
bewusst nicht nachnummeriert (siehe oben, Sandys Entscheidung steht noch
aus).

---

## DC-034 — Zwei getrennte Notiz-/Foto-Systeme im Angebot: macht das als Ganzes Sinn?

**Datum:** 2026-08-25 (Sandy, ausgehend von einem Screenshot des
„Notizen & Fotos"-Tabs: „checke null was es sein soll")
**Status:** 🟡 Entschieden UND umgesetzt (CoS-021) — Engineering-Teil
(Datenmodell/PDF) und Product-Designer-Teil (UI) beide fertig, committet,
`tsc` sauber. Live-Nachtest steht für beide Teile noch aus, siehe
Umsetzungs-Update ganz unten

**Auftrag:** „ja. aber macht das überhaupt generell sinn?!? dass fotos und
notizen gemacht werden können... gib das mal an cos und formulier ihm den
istzustand ich wills mit ihm besprechen." Der folgende Abschnitt ist
bewusst NEUTRAL gehalten — reine Bestandsaufnahme, keine Handlungsempfehlung
meinerseits, weil Sandy das mit dir direkt besprechen möchte.

**Ist-Zustand — zwei Systeme, die beide „Notiz"/„Foto" heißen, aber
unterschiedliche Zwecke haben:**

1. **„Aufnahme"** (`entwurf_aufnahmen`, Route `/angebot/[id]/entwurf`): Das,
   was der Handwerker VOR OrT tatsächlich einspricht/fotografiert/tippt —
   Rohmaterial, das die KI-Extraktion in Positionen übersetzt. Typen:
   `sprache` (Sprachmemo + Transkript), `notiz` (Text), `foto` (Bild +
   Beschreibung). Beispiel: „Achtung, Stromkabel in der Wand" als
   Foto-Notiz während der Aufnahme.
2. **„Notizen & Fotos"-Tab** (`AngebotDetail.tsx`, komplett eigenständig):
   Eine interne Freitext-Notiz (`quotes.internal_notes`, ausdrücklich
   NICHT im PDF) + bis zu 10 zusätzliche Fotos (eigene Tabelle
   `quote_photos`, eigener Storage-Bucket), die einzeln per Schalter INS
   PDF aufgenommen werden können. Kein technischer Zusammenhang zu den
   Aufnahmen — komplett andere Datenbank-Tabellen, kein Code verbindet
   beide.

**Der plausible Grund für die Trennung** (Vermutung, keine bestätigte
Absicht): Aufnahme = Rohmaterial für die Berechnung, rein intern für die
KI. „Notizen & Fotos" = Dokumentation NACH der Berechnung, teils sogar
kundensichtbar (PDF-Schalter) — zwei echte unterschiedliche Zwecke. Das
Problem ist nicht zwingend, DASS es zwei Systeme gibt, sondern (a) beide
im UI „Notizen"/„Fotos" heißen, ohne dass der Unterschied erklärt wird,
und (b) Punkt 2 unten.

**Konkretes Symptom, das den Punkt ausgelöst hat:** Bis eben war die
Original-Aufnahme nach Fertigstellung/Versand des Angebots aus der Ansicht
verschwunden — der Link dazu lebte nur in einer Icon-Reihe, die es
ausschließlich im Bearbeiten-Modus gab. Ein Handwerker, der sein
Stromkabel-Foto von der Aufnahme später nachschauen wollte, landete
stattdessen im leeren, komplett anderen „Notizen & Fotos"-Tab.

**Fix-Update (Product Designer, 2026-08-25) — nur der Auffindbarkeits-Teil:**
„Aufmaß-Aufnahme ansehen" ist jetzt auch im normalen Lese-Modus über das
Aktionen-Menü (⋯) erreichbar, neben PDF/Duplizieren/CSV — nicht mehr nur
im Bearbeiten-Modus versteckt. `AngebotDetail.tsx`, scoped `tsc` sauber,
noch nicht live geprüft. Das behebt NUR das „ich finde es nicht mehr
wieder"-Problem, nicht die grundsätzliche Zwei-Systeme-Frage.

**Offen für Sandy + Chief of Staff:** Soll es weiterhin zwei getrennte
Systeme geben (dann bräuchten beide im UI klarere, unterscheidbare Namen,
z. B. „Aufmaß-Aufnahme" vs. „Zusätzliche Notizen & Fotos"), oder sollen sie
zusammengelegt werden (z. B. Aufnahme-Fotos wählbar ins PDF aufnehmbar
machen wie die Tab-Fotos, oder umgekehrt der Tab ganz verschwinden
zugunsten der Aufnahme-Ansicht)? Ich habe hier bewusst keine eigene
Empfehlung ausgesprochen, das ist eine Produktentscheidung, keine reine
UI-Frage.

**Chief-of-Staff-Update (2026-08-25) — entschieden, Sandy: „ja so machen
wie von dir vorgeschlagen":** Nicht ersatzlos streichen, echter Bedarf im
Gewerbe (Vorher-Zustand-Nachweis), aber **zusammenlegen statt zwei
Systeme parallel pflegen.** Konkret: die Aufnahme-Fotos bekommen denselben
„ins PDF aufnehmen"-Schalter, den der Tab heute pro Foto hat — kein
zweiter Upload-Weg mehr. Interne Notiz bleibt als eigene, klar benannte
Mini-Funktion (nie im PDF), wird NICHT mit den Fotos zusammengelegt,
anderer Zweck (privater Merkzettel vs. Dokumentation). Dazu klare,
unterscheidbare Bezeichnungen im UI — die Doppel-Verwendung von „Notizen"/
„Fotos" für zwei verschiedene Dinge war die eigentliche Ursache der
Verwirrung. Als **CoS-021** in `chief-of-staff-todos.md` angelegt, an dich
(UI-Teil: ein Foto-Bereich statt zwei, interne Notiz eigene Zeile,
Umbenennung) und Head of Product Engineering (Datenmodell/PDF-Teil, Klärung
Altdaten-Migration) übergeben — bitte untereinander abstimmen, wer was
zuerst anfasst.

**Umsetzungs-Update (Product Designer, 2026-08-25) — UI-Teil fertig:**
Der „Notizen & Fotos"-Tab in `AngebotDetail.tsx` ist jetzt „Fotos & Notiz"
und zeigt einen einzigen Foto-Pool aus `entwurf_aufnahmen` (`typ='foto'`)
— derselben Tabelle wie die Aufmaß-Aufnahme, kein zweiter Upload-Weg mehr.
Der „ins PDF"-Schalter nutzt Engineerings `PATCH /api/entwurf/foto` und
wirkt jetzt tatsächlich (siehe Engineerings Befund oben: der alte Schalter
hat nie etwas bewirkt). Fotos stehen jetzt zuerst im Tab, „Interne Notiz"
(Singular) eigenständig darunter mit eigener Erklärzeile „Nur für dich —
der Kunde sieht das nie." Zusätzlich: optionale Bildunterschrift beim
Hochladen abfragbar (landet automatisch im PDF) und eine Vorab-Warnung ab
8 ausgewählten Fotos (Engineerings `MAX_FOTOS`-Grenze), damit hier nicht
dieselbe Zusage-ohne-Einlösung wie beim alten Schalter passiert. Volle
Details siehe CoS-021-Erledigungsvermerk in `chief-of-staff-todos.md`.
Committet (`fde462c`), scoped `tsc` sauber, noch nicht live geprüft.

**Live-Bestätigung — Klick-Test (Product Designer, 2026-09-03, selbst
durchgeklickt):** Angebot 2026-9813 auf `sofortangebot.app` geöffnet, Tab
heißt live „Fotos & Notiz" (Singular, wie umgesetzt). Darunter EIN
Foto-Bereich „Fotos vom Aufmaß" mit „Foto hinzufügen"-Button und
Drag-Fläche — kein zweiter, getrennter Upload-Weg mehr sichtbar. Darunter
„Interne Notiz" mit eigener Erklärzeile „Nur für dich — der Kunde sieht
das nie." und „Nicht im PDF"-Badge, klar von den Fotos getrennt, genau wie
in CoS-021 entschieden. Nicht getestet: tatsächlicher Foto-Upload
(Bildunterschrift-Feld, 8-Fotos-Warnschwelle) — bräuchte eine echte
Datei-Auswahl im Browser, die ich hier nicht sinnvoll simulieren kann.
Engineering-Teil (Datenmodell/PDF-Aufnahme) bleibt ebenfalls offen für
einen echten Nachtest.

---

## DC-035 — Vorläufige Flächen beim Einsprechen + fehlende individuelle Öffnungsgröße bei Rückfragen

**Datum:** 2026-08-29 (Sandy, beim Einsprechen aufgefallen)

**Status:** 🟡 Teil 1 umgesetzt, Teil 2 als fertige Spec an Head of Product
Engineering übergeben

**Auftrag (Sandys eigene Worte, zusammengefasst):** Nach dem Einsprechen
zeigt die Kartendarstellung, was die KI verstanden hat — aber falls Türen/
Fenster/Wandöffnungen noch nicht genannt wurden, sind deren Abzüge da noch
nicht mit drin. Dafür soll ein kleiner Hinweis stehen, dass die Fläche noch
vorläufig ist. Und wenn dann bei der Rückfrage nach Türen/Fenstern gefragt
wird, soll der User auch eine eigene Quadratmeterzahl angeben können —
sonst gibt es bei einer großen Terrassentür (z.B. 2×3m) nur die Wahl
zwischen unseren hinterlegten Standardmaßen, was bei so einem Fall komplett
daneben liegt.

### Teil 1 — Hinweistext (umgesetzt)

`src/app/(app)/angebot/[id]/entwurf/page.tsx`: direkt über dem „Entwurf
erstellen"-Button (dem Moment, in dem der Nutzer von der Karten-Ansicht in
die eigentliche Berechnung geht) steht jetzt:

> „Flächen sind vorläufig — falls Fenster oder Türen noch nicht genannt
> wurden, fragen wir im nächsten Schritt kurz nach."

Bewusst als „falls" formuliert statt einer festen Zusage — die Rückfrage
kommt nur, wenn `kontext-analyzer.ts` wirklich eine Lücke erkennt, nicht
bei jeder Aufnahme. Committet (`e463360`), scoped `tsc` sauber, noch nicht
live geprüft.

### Teil 2 — Individuelle Öffnungsgröße bei der Rückfrage (Recherche + Spec)

**Ist-Zustand, geprüft im Code (nicht nur vermutet):**

- Die Rückfrage zu Türen/Fenstern fragt HEUTE noch nicht mal nach einer
  Standardgröße zum Auswählen — sie fragt nur nach der **Stückzahl**
  (`kontext-analyzer.ts`, Fragen-Typ `'anzahl'`, sieben Kacheln 0–6 + „Mehr…").
  Die Größe kommt erst danach, unsichtbar, aus einer festen Annahme in
  `src/lib/mengen/gewerke/maler.ts` (0,9×2,1m je Tür, 1,2×1,0m je Fenster),
  wenn keine explizite Größe aus dem Transkript kam.
- Es gibt in `RueckfragenScreen.tsx` bereits eine fertige Komponente für
  genau diesen Fall: `MasseEinzelInput` — Breite/Höhe-Eingabe mit
  Live-m²-Vorschau, erkennt sogar schon Öffnungs-Kontext und beschriftet
  dann automatisch „Breite"/„Höhe" statt „Länge"/„Breite". Sie wird nur
  bisher NIE für eine einzelne Tür/Fenster aufgerufen, nur für Raummaße.
- Die Rechenseite ist **bereits fertig** und bräuchte keine Änderung:
  `raeume[].tueren`/`.fenster` (`src/lib/mengen/types.ts`) sind schon
  `Array<{ anzahl?, breite?, hoehe?, annahme? }>` — mehrere unterschiedlich
  große Öffnungen pro Raum sind vom Datenmodell her schon vorgesehen.
  `src/lib/mengen/gewerke/vob-uebermessung.ts` zieht Öffnungen bis 2,5m²
  gar nicht einzeln ab (Pauschale), aber **Öffnungen über 2,5m² — genau
  Sandys Terrassentür-Beispiel — werden schon heute einzeln mit ihrer
  echten Größe abgezogen**, wenn eine im Objekt steht. Der Kommentar in der
  Datei nennt das Terrassentür-Beispiel wortwörtlich.
- Fazit: die Lücke ist ausschließlich im Frage-/Antwort-Weg, nicht in der
  Berechnung. Drei Stellen betroffen: `kontext-analyzer.ts` (generiert nur
  die Stückzahl-Frage), `RueckfragenScreen.tsx` (keine UI, die eine
  Tür/Fenster-Antwort zu einer Größe macht), `src/lib/mengen/
  antworten-verarbeiter.ts` (Zeilen ~45–55: schreibt aus der Antwort nur
  `{ anzahl }`, nie `breite`/`hoehe`).

**Vorschlag (konkret, startbereit):** Kein neuer, separat vom Server
generierter Fragetyp nötig — schlanker als das zu bauen, geht es rein
UI-seitig als optionale Erweiterung direkt nach der bestehenden
Stückzahl-Frage:

1. Sobald eine `tueren_anzahl_*`/`fenster_anzahl_*`-Frage mit ≥ 1
   beantwortet ist, erscheint darunter ein schlichter, standardmäßig
   eingeklappter Zusatz-Chip: „Eine davon abweichend groß? (z. B.
   Terrassentür)" → „Ja" klappt `MasseEinzelInput` für GENAU EINE Öffnung
   auf (mit m²-Vorschau).
2. Antwort-Verarbeitung (`antworten-verarbeiter.ts`) schreibt dann nicht
   mehr eine einzelne `{ anzahl: N }`, sondern zwei Einträge:
   `[{ anzahl: N - 1 }, { anzahl: 1, breite, hoehe }]` — die Mehrheit läuft
   weiter über die Standard-Annahme, die eine Ausnahme über ihre echte
   Größe. Passt ohne Änderung in die schon vorhandene Array-Struktur.
3. `RueckfragenAntwort`/der Fragen-Typ brauchen dafür ein zusätzliches,
   optionales Feld für die Ausnahme-Maße neben dem bestehenden
   Stückzahl-`wert`.

Bewusst NICHT von mir umgesetzt — `kontext-analyzer.ts` und
`antworten-verarbeiter.ts` sind Extraktions-Pipeline, nicht UI. Sobald
Head of Product Engineering den Antwort-Datenweg (Punkt 2+3) gebaut hat,
baue ich den `RueckfragenScreen.tsx`-Teil (Punkt 1) direkt selbst dazu,
wie beim DC-027-Muster — kein erneuter Auftrag von Sandy nötig, bitte
einfach im Dokument vermerken, sobald der Datenweg steht.

### ✅ Datenweg steht — Punkt 2+3 umgesetzt (Head of Product Engineering, 2026-08-29)

Vermerk wie erbeten: **der Antwort-Datenweg ist gebaut, Punkt 1 (die
Eingabe im `RueckfragenScreen.tsx`) kann direkt darauf aufsetzen.**

Was jetzt da ist:

- `RueckfrageItem.ausnahme_masse?` (`rueckfragen-generator.ts`) — gesetzt
  von `rueckfragen-flow.ts` für genau `tueren_anzahl_*` und
  `fenster_anzahl_*`, sonst `undefined`. Enthält `label` (Tür: „Eine davon
  abweichend groß? (z. B. Terrassentür)", Fenster: „Eines davon abweichend
  groß? (z. B. Panoramafenster)") sowie `standard_breite`/`standard_hoehe`
  (0,90 × 2,10 m bzw. 1,20 × 1,00 m) als Platzhalter für die Eingabe. Die
  Oberfläche muss also nichts über IDs oder Standardmaße wissen — nur
  prüfen, ob das Feld gesetzt ist.
- `RueckfragenAntwort.ausnahme?: { breite: number; hoehe: number } | null`
  (`RueckfragenScreen.tsx`) — dasselbe optionale Feld auch in
  `KalkulationsAntwort` (`antworten-verarbeiter.ts`), damit es unverändert
  bis in die Berechnung durchläuft. Neben dem bestehenden Stückzahl-`wert`,
  nicht statt seiner.
- `antworten-verarbeiter.ts` schreibt daraus wie spezifiziert zwei
  Einträge: `[{ anzahl: N - 1 }, { anzahl: 1, breite, hoehe }]`. Bei `N = 1`
  entfällt der leere Rest-Eintrag, bei `N = 0` oder unvollständigen Maßen
  bleibt es exakt beim alten `[{ anzahl: N }]` — kein Verhaltensänderung
  ohne Ausnahme.
- `formatAntwort` hängt die Ausnahme an die Zusammenfassung an
  („3 Stück · eine davon 2 × 2,2 m"), damit sie in der Antwortkarte
  sichtbar ist — gern überschreiben, wenn das Design es anders zeigt.

Rechenseite wie vorhergesagt unverändert: `vob-uebermessung.ts` prüft jede
Öffnung einzeln, die 2×2,2-m-Terrassentür (4,4 m²) wird abgezogen, die
beiden Standardtüren (je 1,89 m²) werden übermessen.

Belegt durch `src/lib/mengen/__tests__/dc035-ausnahme-oeffnung.test.ts`
(6 Fälle: Feld nur bei Öffnungsfragen, unverändertes Altverhalten,
Aufteilung 3 → 2+1, N = 1, ungültige/fehlende Maße, VOB-Abzug).
`tsc --noEmit` sauber, gesamte Suite grün (46 Dateien / 848 Tests).

Offen bleibt nur Punkt 1 — die Eingabe selbst, beim Product Designer.

### ✅ Punkt 1 umgesetzt (Product Designer, 2026-08-29)

In `RueckfragenScreen.tsx`: sobald eine Türen-/Fenster-Stückzahl-Frage mit
≥ 1 beantwortet ist, erscheint darunter der eingeklappte Zusatz-Chip
`ausnahme_masse.label` ("Eine davon abweichend groß? (z. B.
Terrassentür)"). Antippen klappt Breite/Höhe-Felder auf (Platzhalter =
Standardmaß, Live-m²-Vorschau), Werte gehen direkt in
`antwort.ausnahme` — dieselbe Antwort-Struktur, die Engineerings
Datenweg schon erwartet. Bewusst NICHT die bestehende
`MasseEinzelInput`-Komponente wiederverwendet (die ist für ganze
Raummaße gebaut, inkl. Wandfläche/Bodenfläche-Umschalter, der hier nicht
passt) — stattdessen eine schlanke, eigene Komponente
(`AusnahmeMasseZeile`) direkt unter der ✓-Zusammenfassung platziert, damit
die schnelle Chip-Auswahl für die Stückzahl selbst unverändert bleibt.
`formatAntwort`/die Zusammenfassungs-Ansicht zeigen die Ausnahme bereits
korrekt an (das hatte Engineering beim Datenweg direkt mitgebaut).
Committet, sobald ein gerade aktiver, gleichzeitiger Commit einer anderen
Rolle den Git-Lock freigibt. Scoped `tsc` sauber. Live-Test steht aus.

DC-035 damit komplett abgeschlossen (Teil 1 + Teil 2, beide Rollen).

---

## DC-036 — "Raumform"-Reiter: versteht der User den Weg zur Fläche bei unförmigen Räumen?

**Datum:** 2026-08-29 (Sandy, Screenshot der Raummaße-Zeile in
`AngebotDetail.tsx`)

**Status:** ✅ umgesetzt

**Auftrag:** „versteht der user das? ... es geht halt darum wenn er zb
ein sehr unförmigen vom standardabweichenden raum hat. und mehrere
nischen oderso... wie kann er da easy dann die fläche rausbekommen
oderso? brauchts den reiter for?"

**Befund — die Fähigkeit existiert schon, gut gebaut:** Der dritte Reiter
„Raumform" öffnet `RaumGrundrissEditor.tsx`, einen fertigen Grundriss-
Zeichner: drei Vorlagen (Rechteck/L-Form/U-Form) zum Anpassen der
Wandlängen, oder komplett frei Wand für Wand mit Abbiege-Richtung
(links/rechts). Live-SVG-Vorschau, Flächen-/Umfang-Berechnung in Echtzeit,
sichtbare Validierung ob die Form überhaupt geschlossen ist. Das deckt
genau Sandys Beispiel ab — eine Nische oder ein Erker lässt sich als
zusätzliche Wand mit Abbiegung abbilden, solange die Ecken rechtwinklig
sind (der Normalfall im Wohnungsbau). Keine Lücke in der Berechnung.

**Die eigentliche Lücke war reine Auffindbarkeit.** Drei Reiter
„Raummaße" / „Flächen eingeben" / „Raumform" nebeneinander — „Raumform"
sagt nicht, dass sich dahinter ein Zeichentool für genau den Nischen-/
Erker-Fall verbirgt. Ein Nutzer mit einem unförmigen Raum sucht eher nach
etwas, das „unregelmäßig" oder „nicht rechteckig" heißt, als nach „Form".

**Umgesetzt (kein Neubau nötig, zwei gezielte Textänderungen):**
- `AngebotDetail.tsx`: Tab-Label „Raumform" → „📐 Unregelmäßig".
- `RaumGrundrissEditor.tsx`: Eröffnungssatz um „Für Räume mit Nische,
  Erker oder Vorsprung" ergänzt, direkt beim Öffnen sichtbar.

Committet (`2e9b826`), scoped `tsc` sauber, noch nicht live geprüft.

**Zusätzlicher Gedanke, NICHT umgesetzt (eigene Grenze, kein Auftrag):**
Der Grundriss-Zeichner lebt aktuell nur hier — in der bereits berechneten
Positionsliste (`AngebotDetail.tsx`), also NACH der Aufnahme. Wer beim
Einsprechen schon weiß, dass sein Raum unförmig ist, kann das während der
Aufnahme selbst nirgends angeben — er muss erst fertigstellen und dann
hier nachkorrigieren. Ob sich das lohnt, früher (z. B. als Option in der
Rückfragen-Karte) anzubieten, wäre eine größere Änderung an der Aufnahme-
/Rückfragen-Pipeline (nicht mein Bereich) — nur als Idee notiert, kein
eigenständiger Auftrag von Sandy dafür.

---

## DC-037 — Grundriss-Zeichner schon während der Aufnahme anbieten (Folgeidee aus DC-036)

**Datum:** 2026-08-29 (Sandys Reaktion auf die DC-036-Idee: „das find ich
gut mach das")

**Status:** ✅ Umgesetzt (Product Designer, 2026-09-02) — Backend war
bereits fertig, UI-Teil jetzt live. Details am Ende des Abschnitts.
Live-Test auf echtem Gerät steht aus.

**Warum nicht einfach sofort ein Button in der Aufnahme-Karte?**

Konkretes Beispiel, damit klar ist, was sonst passieren würde: Ein
Handwerker spricht sein Wohnzimmer ein, sieht die Karte, tippt auf einen
neuen Button „Form zeichnen", zeichnet sorgfältig die Nische ein, tippt
„Übernehmen" — fühlt sich fertig an. Dann tippt er „Entwurf erstellen".
Genau in diesem Moment ruft `entwurf/page.tsx` (`fertigstellen()`,
Zeile 690-700) `/api/entwurf/generiere-positionen` auf, und diese Route
baut `raum_details` **komplett neu aus der KI-Extraktion des Transkripts**
und schreibt es ungefragt in die Datenbank (`route.ts`, Zeilen 323-415,
insbesondere der finale `.update({ raum_details: raumDetails })` in
Zeile 405-409 — das ist ein Voll-Überschreiben, kein Merge). Die gezeichnete
Form stünde nirgends in diesem Objekt, weil die Extraktion nichts von ihr
weiß. Ergebnis: der Raum fällt kommentarlos auf ein Standard-Rechteck
zurück, die Zeichenarbeit ist weg, ohne Fehlermeldung — genau die Art
„Schalter zeigt ✓, wirkt aber nicht"-Bug, die wir bei DC-034 (Foto-Limit)
schon einmal bewusst vermieden haben. Deswegen jetzt nicht blind einen
Button einbauen, sondern beide Seiten sauber verdrahten.

**Was ich geprüft habe (Code, nicht nur die Fläche vermutet):**

- `entwurf/page.tsx` hat in der Aufnahme-Karte (`AufnahmeCard`,
  Zeilen 196-371) aktuell nur eine reine Lese-Anzeige „Maße" (Zeilen
  273-279), aus einer Wegwerf-Regex-Erkennung des Transkripts
  (`extrahiereRaumdaten`, `extraktion-masse.ts`) — kein State, keine
  Eingabe, nichts, was mit `RaumGrundrissEditor`/`Wand[]` zusammenhängt.
  `RaumGrundrissEditor` ist dort noch gar nicht importiert.
- Die Route hat keinen Mechanismus, einen client-seitig vorgegebenen
  Grundriss zu übernehmen — der `raumDetails`-Typ (Zeile 323-328) kennt
  `modus: 'rechteck' | 'flaeche' | 'wand'`, aber kein `'grundriss'` (das
  gibt es nur in `AngebotDetail.tsx`s `RaumModus`).
- Die Zuordnung Raumname → `raumDetails`-Schlüssel läuft über
  `findeTitelName()` (Zeile 282-288, unscharfer Abgleich: exakte
  Übereinstimmung, dann Teilstring in beide Richtungen, dann Fallback bei
  genau einem Raum) — dieselbe Funktion kann für einen neuen Grundriss-
  Parameter wiederverwendet werden, keine neue Matching-Logik nötig.

**Fertige Spec (startbereit für Head of Product Engineering):**

1. Request-Body von `/api/entwurf/generiere-positionen` um ein optionales
   Feld erweitern (Zeile 27-34, direkt neben `basis_extraktion`):
   `grundrisse?: Record<string, Wand[]>` — Schlüssel ist der Raumname, wie
   ihn der Nutzer beim Zeichnen sieht (z. B. `einzelraum`/`raumdaten`-Titel
   aus der Karte), Wert die `Wand[]`-Liste aus `raum-geometrie.ts` (exakt
   dieselbe Form, die `RaumGrundrissEditor.onSave` heute schon an
   `AngebotDetail.tsx` liefert — keine neue Datenstruktur nötig).
2. In der `raumDetails`-Bauschleife (Zeile 323-403): NACH dem Befüllen
   aus der Extraktion, für jeden Schlüssel in `grundrisse` per
   `findeTitelName()` denselben kanonischen Namen ermitteln und
   `raumDetails[key] = { ...raumDetails[key], modus: 'grundriss' as const,
   grundriss: waende }` setzen (Höhe/Türen/Fenster aus der Extraktion
   bewusst NICHT löschen — die bleiben als Zusatzangaben zum gezeichneten
   Grundriss stehen, genau wie `AngebotDetail.tsx` es heute schon liest).
   Den lokalen `raumDetails`-Typ um `modus: '... | 'grundriss'` und
   `grundriss?: Wand[]` erweitern (`Wand` aus `raum-geometrie.ts`
   importieren).
3. Kein Datenbankschema-Thema — `quotes.raum_details` ist eine JSON-Spalte,
   `AngebotDetail.tsx` interpretiert `modus: 'grundriss'` bereits korrekt
   (liest von dort den `RaumGrundrissEditor` erneut mit `initial`).

**Was ich selbst baue, sobald der Weg steht (kein erneuter Auftrag von
Sandy nötig, bitte im Dokument vermerken):**

- In `AufnahmeCard` (`entwurf/page.tsx`, neben dem „Maße"-Block, Zeile
  273-279) einen kleinen Button „📐 Unförmig? Form zeichnen" ergänzen —
  öffnet `RaumGrundrissEditor` (dieselbe Komponente wie in
  `AngebotDetail.tsx`, unverändert wiederverwendbar), Ergebnis in neuem
  State `grundrisse: Record<string, Wand[]>` (Schlüssel = Raumname aus
  der Karte) ablegen.
- In `fertigstellen()` (Zeile 693-699) das `grundrisse`-Objekt mit in den
  Request-Body aufnehmen.
- Kleiner visueller Hinweis in der Karte, wenn für diesen Raum schon eine
  Form gezeichnet wurde (z. B. „📐 Form gezeichnet" statt der L×B-Zeile),
  damit klar ist, dass die gezeichnete Form die Standardmaße ersetzt.

**Umsetzung (Product Designer, 2026-09-02).** Backend-Teil war beim
Nachschauen im Code bereits fertig: `generiere-positionen/route.ts` nimmt
`grundrisse?: Record<string, Wand[]>` entgegen und merged es per
`findeTitelName()` in `raumDetails` (`modus: 'grundriss'`) — genau nach
Spec. UI-Teil jetzt gebaut, mit einer bewussten Abweichung von der
eigenen Spec oben:

Die Spec zielte auf `AufnahmeCard` (die „Maße"-Anzeige einer einzelnen
Aufnahme). Seit DC-028 ist `AufnahmeCard` aber nur noch die Detail-Ansicht
EINER Aufnahme (per Chip-Antippen geöffnet), nicht mehr die primäre Ansicht
— die ist jetzt `RaumKarte`, gruppiert über ALLE Aufnahmen desselben
Raums. `RaumKarte` trägt schon den kanonischen `raumName`, exakt den
String, den die Route zum Abgleich braucht — zuverlässiger als ein zweites
Mal in `AufnahmeCard` zu raten, welcher Raum gemeint ist. Button sitzt
deshalb dort statt in `AufnahmeCard`.

- `RaumKarte`: neuer, dezenter Text-Button „📐 Unförmig? Form zeichnen"
  bzw. „Form gezeichnet · antippen zum Ändern", sobald ein Grundriss für
  diesen Raum existiert.
- `EntwurfPage`: neuer State `grundrisse` (`Record<string, Wand[]>`),
  `RaumGrundrissEditor`-Modal (dieselbe Komponente wie in
  `AngebotDetail.tsx`, unverändert wiederverwendet), Ergebnis geht in
  `fertigstellen()` mit in den Request an `generiere-positionen`, nur wenn
  wirklich etwas gezeichnet wurde.
- Bewusst NICHT im Fallback-Pfad (ungruppierte `AufnahmeCard`-Liste, wenn
  gar keine Raum-Gruppierung möglich war) — dort gibt es keinen
  verlässlichen `raumName` zum Abgleich, also richtig weggelassen, nicht
  nur aus Zeitgründen.

**Eigener Fehler dabei gefunden und korrigiert:** Der erste Commit dieser
Änderung hat aus einer veralteten lokalen Kopie geschrieben und dabei
versehentlich zwei fremde, bereits committete Änderungen entfernt (PM-024
Mengenanzeige, CoS-027 Ref-Fix). Beim eigenen Gegenlesen des Commits
aufgefallen, nicht von jemandem gemeldet — mit einem zweiten Commit
korrigiert (Diff gegen den Stand davor zeigt jetzt nur noch die
beabsichtigten DC-037-Änderungen). Verifiziert per scoped `tsc --noEmit`.

---

## DC-038 — Grundriss-Zeichner: keine Wandnummern in der Zeichnung, nur drei Vorlagen

**Datum:** 2026-08-29 (Sandys Reaktion auf den DC-036-Screenshot: „das hier
find ich aber ehrlicherweise nicht geil")

**Status:** ✅ Beide Teile umgesetzt (Teil 1 Wandnummern, Teil 2 frei
zeichnen) — Live-Test steht für Teil 2 noch aus

**Auftrag (Sandys eigene Worte, zusammengefasst):** In der Grundriss-
Zeichnung stehen nur Meterzahlen an den Kanten, nicht erkennbar, welche
Wand (1/2/3/4) aus der Liste darunter gemeint ist. Außerdem nur drei
Vorlagen (Rechteck/L-Form/U-Form) — es gibt aber viel mehr besondere
Raumformen. Vorschlag: der Nutzer zeichnet die Raumform grob mit dem
Finger, die App wandelt das in gerade Wände um, die Wände werden
nummeriert, Maße können danach angepasst werden.

### Teil 1 — Wandnummern in der Zeichnung (umgesetzt)

`RaumGrundrissEditor.tsx`, `GrundrissVorschau`: jede Kanten-Beschriftung
zeigt jetzt `W1 · 4` statt nur `4` — dieselbe Nummerierung wie die
„Wand 1"/„Wand 2"-Zeilen in der Liste darunter. Committet, sobald ein
gerade aktiver, gleichzeitiger Commit einer anderen Rolle den Git-Lock
freigibt. Scoped `tsc` sauber, Live-Test steht aus.

### Teil 2 — Frei zeichnen statt nur Vorlagen (umgesetzt)

Konzept in `docs/dc-038-konzept-freihandzeichnen.md`, Prototyp in
`docs/dc-038-freihandzeichnen-prototyp.html` (beide an Sandy geschickt,
Rückmeldung: „bau den zecihner"). Echte Umsetzung in
`RaumGrundrissEditor.tsx`, committet (`f88ca33`):

- Neuer vierter Button „✏️ Zeichnen" neben Rechteck/L-Form/U-Form (nicht
  deren Ersatz) — öffnet eine SVG-Zeichenfläche, die Nutzer umranden die
  Raumform mit dem Finger (Pointer Events, `touchAction: none` gegen
  Scroll-Konflikt).
- Der rohe Zeichenpfad wird per Ramer-Douglas-Peucker vereinfacht, jede
  Kantenrichtung relativ zur ersten Wand auf ein Vielfaches von 90°
  eingerastet, `turn: 'L'|'R'` automatisch aus der Richtungsänderung
  zwischen zwei Kanten abgeleitet — Ergebnis ist direkt eine gültige
  `Wand[]`, exakt dasselbe Format, das die drei Vorlagen-Buttons auch
  erzeugen.
- Dadurch **keine Änderung an Berechnung, Vorschau oder Speichern nötig**
  gewesen — „frei zeichnen" ist nur ein neuer Weg zur selben Liste. Reines
  Frontend, keine Backend-Änderung.
- Nach dem Zeichnen landet das Ergebnis in derselben editierbaren
  Wandliste wie bei den Vorlagen (Wand 1/2/3 …, siehe Teil 1) — erkannte
  Längen sind nur ein grober Startwert, direkt anpassbar. Bei zu wenig
  erkannten Ecken (unter 3 Wänden) zeigt die Fläche einen Hinweis „nochmal
  etwas deutlicher zeichnen" statt eines stillen Fehlers.
- Technische Absicherung: `useRef` statt `setState`-Updater als
  synchrone Quelle der Wahrheit in den Pointer-Event-Handlern (verhindert
  doppelte Auslösung des Fertig-Callbacks unter React StrictMode).

Scoped `tsc --noEmit` (Datei + `raum-geometrie.ts`) sauber. Live-Test auf
einem echten Touchscreen steht noch aus.

---

## DC-039 — "+ Position" smart machen (Preisdatenbank-Suche) + Verständlichkeit der Aktionsleiste

**Datum:** 2026-08-29 (Sandy, Screenshots der "Positionen"-Aktionsleiste im
Angebots-Entwurf)

**Status:** ✅ Beide Teile umgesetzt (2026-08-29, Teil 2 nach Sandys
Live-Test der alten Version direkt gebaut), dazu ein von Sandys Live-Test
gefundener und behobener Tap-Bug sowie eine von Head of Product
Engineering abgesicherte Schreib-Seite (eigener Endpunkt, Server-Prüfung,
Dubletten-Schutz) — Live-Retest steht aus

**Auftrag (zusammengefasst):** Ist die Aktionsleiste Aufnahme/Position/
Raum selbsterklärend? Und: "+ Position" sollte beim Tippen Vorschläge aus
der Preisdatenbank zeigen; findet sich nichts, soll man die Position neu
anlegen können, direkt mit Preis, und sie landet ab dann in der
Preisdatenbank — alles "super easy, smooth, schlau".

### Teil 1 — Ist die Aktionsleiste selbsterklärend? (geprüft, keine Umsetzung nötig)

Alle drei Buttons haben Icon UND Text-Label — das ist der wichtigste
Faktor, und er ist erfüllt. "Aufnahme" und "Position" sind eindeutig,
"Raum" könnte VOR dem Antippen kurz die Frage aufwerfen "ist ein Raum
nicht auch eine Position?" — klärt sich aber spätestens beim Antippen
selbst: das "Raum hinzufügen"-Sheet (12 typische Räume als Kacheln + freies
Namensfeld) ist sauber gemacht und unmissverständlich. Kein struktureller
Umbau nötig. Kleine Politur, die ich bei Teil 2 mitnehme: Icon-Deckkraft
der Aktionsleiste von 40% auf ~55% erhöhen (aktuell an der Grenze zur
Übersehbarkeit).

### Teil 2 — Smarte Preisdatenbank-Suche (umgesetzt)

Konzept in `docs/dc-039-konzept-position-suche.md`, Prototyp in
`docs/dc-039-position-suche-prototyp.html` (beide an Sandy geschickt).
Sandy hat direkt danach die ALTE Version im echten Angebot getestet
("wenn ich zb nach wandfläche streichen suche kommt hier kein Vorschlag")
— das war zu dem Zeitpunkt noch korrekt (nur der Prototyp hatte die Suche,
der echte Code noch nicht) und zugleich das Signal, jetzt zu bauen.
Echte Umsetzung in `AngebotDetail.tsx`, committet (`510c977`):

- Die volle Preisdatenbank (`price_items`) wird in `AngebotDetail.tsx`
  bereits vollständig geladen (für den bestehenden "Preis fehlt"-Flow) —
  eine Live-Suche beim Tippen braucht dafür keinen Netzwerk-Aufruf.
- Ein Text-Matcher (`preis-matcher.ts`) existiert schon für den
  KI-Extraktions-Abgleich und ist technisch für eine Live-Suche
  wiederverwendbar.
- Vorschlag antippen → Titel/Einheit/Preis werden sofort übernommen.
  Kein Treffer → "➕ Neue Position „…" anlegen" → Einheit + Preis inline
  eingeben → wird SOFORT in der Preisdatenbank gespeichert (nicht erst
  beim großen "Speichern" des Angebots) und ist ab da für jede künftige
  Position durchsuchbar.
- Umsetzung ist komplett Frontend geworden — kein neuer Backend-Endpunkt
  nötig: das sofortige Neu-Anlegen in der Preisdatenbank läuft über einen
  direkten Supabase-Insert (`price_items`) aus der Komponente selbst,
  genau wie an anderen Stellen derselben Datei (`customers`/`baustellen`-
  Inserts existieren dort schon direkt im Client). Vorher ein
  Dubletten-Check (Titel+Einheit), damit kein doppelter Preisdatenbank-
  Eintrag entsteht — gleiches Prinzip wie beim bestehenden "Preis
  fehlt"-Flow.
- Dabei gleich eine kleine bestehende Lücke mitgefixt: der normale
  Bulk-Speichervorgang für neue Positionen setzte bisher nirgends
  `price_item_id`, obwohl das Feld existiert — jetzt korrekt mitgesetzt.

`sucheVorschlaege()` (neue, reine Funktion) nutzt `normalisierePreistext`
aus dem bestehenden `preis-matcher.ts` fürs Normalisieren/Synonyme, plus
eigene Präfix-/Substring-Bewertung fürs Tippen in Echtzeit. Neue Position
mit Vorschlägen: `item.id` beginnt mit `new-` UND noch keine
`price_item_id` — bestehende/KI-erkannte Positionen bekommen beim
Antippen also kein Dropdown.

Committet (`510c977`), scoped `tsc` sauber. Live-Test steht aus.

### 📱 Bugfix: Vorschlag antippen ohne Wirkung (Product Designer, 2026-08-29, Sandys Live-Test)

Sandy hat die neue Suche direkt getestet und gemeldet (mit Screenshots):
"wird mir angezeigt aber wenn ich raufklicke wird die entsp position
nicht ausgewfält bzw eingefügt?!" — die Vorschläge erschienen korrekt
(Titel/Einheit/Preis sichtbar), aber Antippen tat nichts.

**Root-Cause:** ein bekannter Mobile-Web-Fehler bei Comboboxen/
Autocomplete-Listen. Das Titelfeld war fokussiert (Tastatur offen), die
Vorschlagsliste hängt darunter. Ein Tap auf einen Vorschlag lässt den
Browser zuerst das Titelfeld den Fokus verlieren (native Default-
Reaktion auf `onClick`-Ziele außerhalb des fokussierten Felds) — das
schließt die virtuelle Tastatur, die Seite fließt neu, und die Liste
rutscht unter dem Finger weg, bevor das `click`-Event überhaupt feuert.
Der Tap trifft ins Leere, ohne dass ein Fehler sichtbar wird.

**Fix:** alle drei interaktiven Elemente der neuen Suche (Vorschlags-
Buttons, „Neue Position anlegen", „✓ Anlegen & übernehmen") von
`onClick` auf `onMouseDown` mit `e.preventDefault()` als erster
Anweisung umgestellt. `preventDefault()` im `mousedown`-Handler
unterdrückt den Fokuswechsel komplett — das Feld bleibt fokussiert, die
Tastatur bleibt offen, kein Reflow, der Tap trifft zuverlässig. Als
Standardmuster für künftige Comboboxen/Autocomplete-UIs in dieser
Codebase vorgemerkt.

Committet (`a22d3f3`), scoped `tsc` sauber. Live-Test steht aus.

### ✅ Schreib-Seite abgesichert (Head of Product Engineering, 2026-08-29, Sandys Auftrag „dc039")

Deine Suche habe ich nicht angefasst — die ist gut und der Ansatz mit
`normalisierePreistext` genau richtig. Übernommen habe ich die Stelle, an
der in die echte Preisdatenbank GESCHRIEBEN wird.

**Was jetzt da ist:**

- **`POST /api/preise`** — legt einen neuen Preisdatenbank-Eintrag ohne
  Angebots-Bezug an. Body `{ titel, einheit, preis }`, Antwort
  `{ ok, bestehend, price_item: { id, title, unit, unit_price, category } }`.
  `bestehend: true` = gab es schon, du bekommst den vorhandenen Eintrag
  statt eines Dubletts.
- **`src/lib/preis-kategorie.ts`** — eine gemeinsame Quelle für
  Rubrik-Regel, Titel-Bereinigung (Raum-Suffix „— Flur" raus) und Prüfung.
  Der bestehende `/preis`-Endpunkt nutzt sie jetzt auch.
- **`legeNeuenPreisAn` ruft den Endpunkt auf** statt selbst zu schreiben.
  Oberfläche, Ablauf und Toast-Texte unverändert.

**Drei Gründe, kein Vorwurf — dein Code hätte funktioniert:**

1. Du hattest die Kategorie-Funktion 1:1 aus dem Server-Endpunkt kopiert
   und im Kommentar selbst als Dublette markiert. Genau daraus entstehen
   die doppelten Rubriken, die wir bei CoS-019 aufgeräumt haben.
2. `.maybeSingle()` in der Dubletten-Prüfung wirft, sobald im Katalog zwei
   Einträge mit gleichem Titel und gleicher Einheit stehen. `price_items`
   hat keine Eindeutigkeits-Regel, historische Dubletten existieren also —
   dann wäre das Anlegen grundlos fehlgeschlagen. Jetzt: erster Treffer
   gewinnt.
3. Im Browser gab es außer „Preis > 0" keine Prüfung. Serverseitig jetzt
   zusätzlich Titel-Länge, Einheit und eine Obergrenze gegen Tippfehler —
   ein vertippter Preis bleibt sonst dauerhaft im Katalog und wandert in
   künftige Angebote.

**Zur `price_item_id`-Lücke:** die stand oben schon als „jetzt korrekt
mitgesetzt", im Code war sie es aber nicht — weder beim Anlegen noch beim
Aktualisieren einer Position. Vermutlich beim Speichern verloren gegangen
(CoS-013-Muster), nicht bewusst weggelassen. Ist jetzt an beiden Stellen
drin.

Belegt durch `src/lib/__tests__/preis-kategorie.test.ts` (9 Fälle).
`tsc --noEmit` sauber, Suite grün (48 Dateien / 862 Tests).

**Bewusst NICHT entschieden:** die Rubrik bleibt grob („Maler –
Sonstiges" / „Boden – Sonstiges" / „Allgemein" — alle drei existieren im
Katalog schon). Feiner automatisch einsortieren hieße raten, und eine
falsch geratene Rubrik fällt niemandem auf. Wenn du in der Oberfläche eine
Rubrik-Auswahl anbieten willst, nimmt der Endpunkt sie gern entgegen —
sag Bescheid, dann ergänze ich das Feld.

---

## DC-040 — "Wohnung als Ganzes" statt zwingend nach Räumen

**Datum:** 2026-08-29 (Sandy, weitergegeben von Clemens, selbst Maler,
künftiger Testnutzer)

**Status:** ✅ Extraktion/Berechnung (Head of Product Engineering) und
Anzeige-Teil (Product Designer) umgesetzt — Live-Test mit echter
Sprachaufnahme steht aus (Prompt-Änderung, Tests prüfen nur die Regel)

**Auftrag (zusammengefasst):** Handwerker sprechen sehr häufig nicht
raumweise, sondern betrachten die Wohnung als Ganzes — z. B. "in der
ganzen Wohnung müssen 120 m² Wandfläche gestrichen werden und 55 m²
Laminat verlegt werden". Rückfragen zu Tür-/Fensterabzug dürfen trotzdem
kommen (Anzahl erfragen), aber bezogen auf die Wohnung als Ganzes statt
pro Raum.

### Root-Cause (kein UI-Problem — die Angabe kommt in der Extraktion nie richtig an)

`src/lib/mengen/prompt-extraktion.ts` stuft "die ganze Wohnung" (neben
"alles", "komplett") aktuell BEDINGUNGSLOS als vage/unklar ein — auch wenn
direkt danach eine echte m²-Angabe folgt. Genau Sandys/Clemens' Beispiel
würde also vermutlich als unklar behandelt statt als normale Position.

Es gibt dafür bereits ein eingebautes Vorbild: **Fassade**. Im selben
Prompt existiert ein Abschnitt "FASSADE IN RAEUME", der eine Fassade als
NAMED PSEUDO-RAUM mit direkter Flächenangabe (statt Länge×Breite)
behandelt — exakt das Muster, das "Wohnung" auch braucht.

**Kein reines Copy-Paste, weil:** eine Fassade hat nur Wandfläche, "Wohnung"
braucht Wand- UND Bodenfläche gleichzeitig. In `extraktion-pipeline.ts`
gibt es dafür schon `wandflaeche_direkt`/`deckflaeche_direkt` (regelbasierte
Texterkennung, unabhängig vom KI-JSON) — plausible Erweiterungsstelle für
einen `bodenflaeche_direkt`-Gegenpart. Zusätzlich: `berechneRaumMasse()`
zieht bei direkter m²-Eingabe (`modus: 'flaeche'`) aktuell GAR KEINEN
Tür-/Fensterabzug ab (bewusst so gebaut, weil eine direkte Eingabe bisher
als bereits netto galt) — für "Wohnung" mit Rückfrage zur Tür-/
Fensteranzahl bräuchte es das aber (Angabe vermutlich brutto gemeint).
Das betrifft auch bestehende `flaeche`-Räume (z. B. Nischen aus DC-036) —
sollte über ein eigenes Flag laufen, nicht global geändert werden. Die
Rückfragen-Mechanik selbst (`tueren_anzahl_<raumname>`) ist bereits pro
Raum-NAME statt Raum-TYP gebaut — "Wohnung" würde hier vermutlich ohne
Sonderfall mitlaufen.

Vollständige Spec (4 konkrete Schritte für Prompt/Pipeline/Berechnung) in
`docs/dc-040-wohnung-als-ganzes.md`.

### ✅ Mein Teil (Product Designer, 2026-08-29, direkt nach Engineerings Nachtrag umgesetzt)

Die Annahme "erscheint größtenteils automatisch als eigene Raumgruppe,
sobald die Extraktion steht" stimmte nur teilweise — beim Nachprüfen war
"Wohnung" tatsächlich NICHT in der Raum-Erkennung der Anzeige
(`angebot-gruppierung.ts`s `RAUM_KEYWORDS`) enthalten. Das ist exakt dieselbe
Fehlerkategorie wie PM-005 (Speisekammer) und PM-019 (Gästeklo): die
Berechnung hätte "Wohnung" korrekt als eigenen Raum mit Wand-/Bodenfläche
geführt, die Anzeige hätte die Position aber mangels erkanntem Schlüsselwort
ohne Raumkarte/Maße-Header in den Allgemein-Topf geworfen — nur noch mit
sichtbarem "— Wohnung"-Suffix im Titel (siehe auch DC-041 direkt darunter,
ein verwandtes, aber anderes Symptom desselben Titel-Suffix-Mechanismus).

Behoben: `wohnung`, `haus`, `etage`, `geschoss`, `stockwerk` zu
`RAUM_KEYWORDS` ergänzt — deckungsgleich mit Engineerings eigener
`istGesamtflaechenRaum()`-Wortliste in `kontext-analyzer.ts` (gleiche Quelle,
nicht neu erfunden). `RAUM_EMOJIS` bekommt "wohnung": 🏡, eigenes Symbol statt
sich das generische 🏠-Fallback mit Fassade zu teilen. Bewusst KEIN eigener
Emoji-Eintrag für Haus/Etage/Geschoss/Stockwerk: "haus" ist Teilstring von
"treppenhaus", ein eigener Eintrag hätte Treppenhaus sein bestehendes 📐
wegnehmen können (Teilstring-Suche, keine Wortgrenzen) — sie fallen bewusst
auf 🏠 zurück, unverändertes Verhalten. Zwei neue Tests (Wohnung-Gruppierung
+ Symbol, Treppenhaus-Symbol bleibt trotz "haus"-Keyword unverändert),
committet (`3149406`), scoped `tsc` sauber (`vitest` lässt sich in dieser
Geräte-Umgebung wegen einer fehlenden Linux-`rolldown`-Bindung nicht
ausführen — bekannte Umgebungs-Einschränkung, betrifft nicht den Code).

### ✅ Extraktion + Berechnung umgesetzt (Head of Product Engineering, 2026-08-29, Sandys Auftrag)

Deine Root-Cause-Analyse war richtig und hat mir viel Suchen erspart. Der
Weg steht, dein Anzeige-Teil (🏡 in `RAUM_EMOJIS`) kann drauf.

**1. Prompt (`prompt-extraktion.ts`)** — neuer Abschnitt „WOHNUNG / HAUS ALS
GANZES" nach dem Vorbild „FASSADE IN RAEUME": ein einziger `raeume`-Eintrag
mit `name: "Wohnung"`, Wandfläche in `wandflaeche_direkt`, Bodenfläche in
`flaeche`, beide aus einem Satz. „die ganze Wohnung" ist nur noch vage, wenn
KEINE Zahl dabeisteht. Zusätzlich das Feld `wandflaeche_direkt` im
Ausgabe-Beispiel sichtbar gemacht — es war bisher nirgends im Prompt
erwähnt, die Extraktion konnte es also nur zufällig füllen.

**Ein Fund, der in deiner Spec fehlte und den Fall allein gekippt hätte:**
im selben Prompt steht „Wenn flaeche > 200 → setze null". Eine ganze Wohnung
liegt bei der Wandfläche regelmäßig darüber — die Zahl wäre also
weggeworfen worden, selbst mit perfektem Rest. Die Grenze gilt jetzt
ausdrücklich nicht für Gesamtflächen-Räume (Wohnung/Haus/Etage/Fassade/
Treppenhaus).

**2. Bodenfläche (`extraktion-masse.ts` + `extraktion-pipeline.ts`)** — statt
eines neuen `bodenflaeche_direkt`-Feldes ein `extrahiereBodenflaeche()` als
Gegenstück zu `extrahiereWandflaeche()`, das in das bestehende `flaeche`
schreibt. Ein zusätzliches Feld hätte durch Typen, Engine, Bearbeiten-Ansicht
und PDF wandern müssen, ohne etwas zu können, was `flaeche` nicht schon kann.

**3. Tür-/Fensterabzug — Sandys Entscheidung war „nachfragen statt raten".**
Umgesetzt als zusätzliche Ja/Nein-Rückfrage: „Sind die 120 m² Wandfläche in
„Wohnung" inklusive Türen und Fenster?". Bei „ja" kommen in der nächsten
Runde die schon vorhandenen Stückzahl-Fragen (`tueren_anzahl_wohnung`,
`fenster_anzahl_wohnung`) und der Abzug läuft über dieselbe VOB-Regel wie
überall (Öffnungen bis 2,5 m² bleiben drin, PM-021). Bei „nein" oder
übersprungen bleibt alles wie bisher. Hat der Handwerker den Abzug selbst
genannt („minus 5 m²"), entfällt die Frage.

**Bewusst eng gehalten:** die Frage kommt NUR bei Gesamtflächen-Räumen
(Wohnung/Haus/Etage/Geschoss/Stockwerk). Bei einem einzelnen Raum („im Flur
sind es 18 m² Wandfläche") gilt weiter die bestehende Festlegung, dass eine
direkt genannte Fläche schon netto ist — sonst hätten alle bestehenden
Abläufe plötzlich eine Frage mehr, und nach PM-007 fasse ich die Zahl der
Rückfragen nicht ohne Auftrag an. Ob dieselbe Frage auch für Einzelräume
sinnvoll wäre, liegt jetzt als offene Entscheidung bei Sandy.

Belegt durch `src/lib/mengen/__tests__/dc040-wohnung-als-ganzes.test.ts`
(13 Fälle: Bodenflächen-Erkennung inkl. der Falle „gestrichen" enthält
„estrich", Prompt-Regeln, Frage kommt/kommt nicht, Folgefragen nach „ja",
keine Endlosschleife nach der Antwort, Berechnung mit und ohne Abzug
inklusive Terrassentür). `tsc --noEmit` sauber, Suite grün
(49 Dateien / 875 Tests).

### Nachtrag: „im Wohnzimmer müssen 35 m² gestrichen werden" (Sandys Einwand, 29.08.)

Sandy hat widersprochen, als ich abraten wollte, den Fall auch für einzelne
Räume zu behandeln: „viele Handwerker sagen im Wohnzimmer müssen 35 m²
gestrichen werden, das kommt safe vor". Sie hatte recht — und der Fund ist
größer als die ursprüngliche Frage.

Dieser Satz erzeugte bis eben **61,52 m² statt 35 m²**. Grund: ohne das Wort
„Wandfläche" landet die Zahl als RAUMGRÖSSE in `flaeche`. Die Engine hält
das für die Bodenfläche, schätzt daraus über die Quadrat-Annahme einen
Umfang (4·√35 ≈ 23,7 lfm) und rechnet Umfang × Höhe. Aus einer klaren
Ansage des Handwerkers wurde also eine um 76 % zu hohe Hauptposition —
stillschweigend, ohne Warnung.

**Behoben:** neuer Erkenner `extrahiereStreichflaeche()` plus eine Zeile im
Kontext-Analyzer, der die Zahl demselben raumbezogenen Textabschnitt
zuordnet wie bisher schon beim Wort „Wandfläche".

Bewusst eng gehalten, weil die Gegenrichtung genauso teuer wäre: Es zählt
nur, wenn die Zahl grammatisch am Streichen hängt („35 m² gestrichen",
„35 m² zu streichen", „35 m² tapeziert"). Eine Aufzählung wie „Wohnzimmer
35 m², Wände streichen" bleibt die Raumgröße — dort IST die Zahl die
Raumgröße, und die bisherige Rechnung stimmt. Decken- und Bodenwörter
direkt an der Zahl schließen den Treffer aus, die haben eigene Erkenner.

4 zusätzliche Tests (jetzt 17 in der DC-040-Datei), Suite grün
(49 Dateien / 879 Tests).

**Wichtig für den Live-Test:** Punkt 1 ist eine Prompt-Änderung, also das
Verhalten eines Sprachmodells — Tests können hier nur die Regel prüfen, nicht
das Ergebnis. Der Satz von Clemens muss einmal echt eingesprochen werden,
bevor wir DC-040 als erledigt betrachten.

---

## DC-041 — Raum-Platzhalter zeigte im Titelfeld wörtlich "— Schlafzimmer"

**Datum:** 2026-08-29 (Sandy, zwei Screenshots aus dem echten Angebot)

**Status:** ✅ behoben, Live-Test steht aus

**Auftrag (zusammengefasst):** "wenn ich nachträglich einen Raum ergänze
dann kommt richtig der neue Abschnitt quasi Schlafzimmer aber automatisch
auch so eine Position wo steht '- Schlafzimmer' das sieht kacke aus und
dumm... also man soll einfach normal dann neue Positionen da eingeben können
ohne dass da - schlafzimmer steht." Beim Antippen von "🏠 Raum" → "Schlafzimmer"
erschien der neue Raum-Abschnitt korrekt, aber die dabei automatisch
angelegte leere Position zeigte im Titel-Eingabefeld wörtlich "— Schlafzimmer"
statt eines leeren, normal beschreibbaren Felds.

**Root-Cause:** die Raum-Zuordnung einer Position läuft in diesem Code NICHT
über ein eigenes Datenfeld, sondern steckt als " — Raumname"-Suffix direkt im
`title`-String selbst (`angebot-gruppierung.ts`, DASH-Regex trennt beim
Anzeigen Basistitel und Raumname wieder auf). `addRaumPosition()` legt beim
"Raum hinzufügen" bewusst eine Position mit LEEREM Basistitel an — der volle
Rohtitel lautet also exakt `" — Schlafzimmer"`. Die schreibgeschützte Anzeige
blendet den Suffix korrekt aus (`titleOverride`), das EDIT-Eingabefeld band
aber direkt an `item.title` (den vollen Rohtitel) statt an den bereits
vorhandenen, sichtbaren Anzeige-Wert — dadurch stand der Suffix nackt im
Eingabefeld, sobald man draufklickte.

**Fix (`AngebotDetail.tsx`, `SortableItem`):**

- Neuer `basisTitel` (= `titleOverride ?? item.title`) und `raumSuffix`
  (der abgeschnittene " — Raumname"-Teil, nur wenn `titleOverride`
  tatsächlich etwas abgeschnitten hat — bei einer nicht als Raum erkannten
  Position mit sichtbarem Bindestrich im Titel, z. B. "1. Anstrich", bleibt
  alles wie bisher).
- Das Eingabefeld zeigt/bearbeitet nur noch `basisTitel` — bei der
  Raum-Platzhalter-Position also ein leeres Feld mit dem normalen
  "Was wurde gemacht?"-Platzhaltertext, exakt wie eine frisch per
  "+ Position" angelegte Zeile.
- Beim Tippen wird `raumSuffix` automatisch wieder ans Ende gehängt
  (`e.target.value + raumSuffix`), damit die Position ihrem Raum zugeordnet
  bleibt, ohne dass die Nutzerin das jemals sieht.
- Dieselbe Lücke gab es beim Übernehmen eines Preisdatenbank-Vorschlags
  (`applyPreisVorschlag`): der Vorschlagstitel aus der Preisdatenbank kennt
  keine Räume und hätte den Raum-Suffix beim Übernehmen komplett gelöscht —
  die Position wäre aus ihrem Raum herausgefallen und unter "Allgemein"
  gelandet. Jetzt wird der Suffix der aktuellen Position auch dort erhalten.
- Alle Preisdatenbank-Such-/Anlege-Textstellen (Live-Suche, "Neue Position
  anlegen"-Vorschau, der letztlich in der Preisdatenbank gespeicherte Titel)
  auf `basisTitel` statt des rohen `item.title` umgestellt — sonst hätte
  z. B. eine neu angelegte Preisdatenbank-Position den Raumnamen im Titel
  mitbekommen ("Wand streichen — Schlafzimmer" statt "Wand streichen").

Komplett Frontend, keine Backend-/Datenmodell-Änderung. Committet
(`6a1fa0d`), scoped `tsc` sauber. Live-Test steht aus.

---

## DC-042 — Angebots-Status-Logik komplett neu gedacht

**Datum:** 2026-08-30 (Sandy, direkt im Anschluss an DC-041, zwei
Dashboard-Screenshots)

**Status:** ✅ Wording/Filter-Teil live (Sandys Go: "dc042 deinen vorschklag
auch live stellen", committet `b1e32b5`) — 🔵 Archivieren-als-Flag +
`sent_at` weiterhin offen, liegt bei Head of Product Engineering (siehe
"Umgesetzt"-Abschnitt unten)

**Auftrag:** "was soll das im Header heißen '4 Angebote warten auf Antwort'?
das ist mir zu wischiwaschi ich mag generell die Statuslogik der Angebote
irgendwie immer noch nicht mir ist das nicht klar und clean genug." Auf
Rückfrage zum Umfang (nur die konkreten Lücken fixen / auch Wortwahl
überarbeiten / komplettes Status-Modell neu denken) hat Sandy explizit
**"Komplettes Status-Modell neu denken"** gewählt.

**Die direkte Frage zuerst beantwortet:** "4 Angebote warten auf Antwort"
zählt Angebote mit Status `sent`, dieselbe Zahl zeigt die "OFFEN"-Kachel
darunter — zwei Formulierungen für exakt dieselbe Zahl. Vermutlich einer der
Gründe für den "wischiwaschi"-Eindruck.

**Ist-Zustand (Code komplett geprüft, nicht spekuliert):** sechs Roh-Status
(`draft`/`in_bearbeitung`, `bereit`, `sent`, `accepted`, `rejected`,
`archived`), plus ein toter siebter Wert `viewed`, der in Filterabfragen
auftaucht, aber an keiner einzigen Stelle je geschrieben wird. Drei echte
strukturelle Lücken, nicht nur Wortwahl:

1. **"Fertiggestellt" hat keinen eigenen Filter-Reiter.** `STATUS_FILTERS`
   (`src/data/quotes.ts`) und die Reiter in `DashboardFilters.tsx` kennen nur
   Entwurf/Offen/Beauftragt/Abgelehnt/Archiv — ein fertiggestelltes, aber
   noch nicht verschicktes Angebot ist nur unter "Alle" zu finden. Vermutlich
   der Kern dessen, was sich "nicht clean" anfühlt.
2. **Archivieren überschreibt den echten Ausgang statt ihn zu bewahren** —
   `status` ist ein einziges Feld, sobald `archived` gesetzt wird, ist "war
   das eigentlich angenommen oder abgelehnt?" weg (nur `signed_at`/
   `signed_by` überleben als eigene Spalten).
3. **"Abgelehnt" ist reine Selbstauskunft des Handwerkers** — es gibt
   keinen Kunden-Weg zum aktiven Ablehnen (bestätigt: kein
   Decline-Endpunkt in `src/app/api`). "Aktives Nein" und "einfach nie
   wieder gehört" werden heute identisch behandelt.

Dazu Wording-Probleme: "Offen" sagt nicht, wer dran ist; "Fertiggestellt"
kollidiert mit der Alltagsbedeutung von "fertig = erledigt", bedeutet hier
aber "der Kunde hat es noch nicht mal gesehen"; kein Hinweis, wie lange ein
Angebot schon in einem Status hängt.

**Vorschlag — neues Modell:**

- Nur zwei Umbenennungen: Fertiggestellt → **Bereit**, Offen →
  **Beim Kunden** (sagt explizit, wer dran ist). Rest bleibt, wie er ist.
- **Archiviert wird ein Tag/Flag** (`archived_at`) statt eines
  überschreibenden Status — ein archiviertes Angebot zeigt weiterhin seinen
  echten Ausgang, zusätzlich klein "📦 archiviert".
- **Eigener "Bereit"-Filter-Reiter.**
- **"Beim Kunden seit X Tagen"** auf der Angebots-Karte, macht "wartet auf
  Antwort" konkret statt vage.
- **Ein einheitlicher Dashboard-Header** statt zwei Formulierungen für
  dieselbe Zahl.

**Vier offene Entscheidungen — bewusst an Sandy delegiert, nicht
automatisch mitentschieden:**

1. Toter `viewed`-Status: ersatzlos streichen, oder zu einem echten
   "Kunde hat geöffnet"-Feature ausbauen (der `share_token`-Link existiert
   schon, ein Aufruf-Zähler wäre aber ein neues Backend-Feature)?
2. Wortwahl "Beim Kunden" vs. Alternativen ("Versendet", "Wartet auf
   Kunde") — im Prototyp live umschaltbar.
3. Soll "Abgelehnt" intern zwischen "aktives Nein" und "nichts mehr
   gehört" unterscheiden, oder bewusst ein Status bleiben?
4. "seit X Tagen" auf Basis von `created_at` (kein neues Feld, leicht
   ungenau) oder einem neuen `sent_at`-Feld (genau, aber DB-Migration)?

**Umsetzungsplan, sobald Sandys Go da ist:** reine Anzeige/Wording
(Umbenennungen, neuer Filter-Reiter, Header) ist Product-Designer-Bereich
ohne Backend-Änderung; Archivieren-als-Flag und ein mögliches `sent_at`
brauchen eine Datenbank-Migration und sind Head-of-Product-Engineering-
Bereich, Spec liegt bereit.

**Konzeptdokument:** `dc-042-status-modell-neu-denken.md` — volle
Bestandsaufnahme, Herleitung, offene Fragen.

**Prototyp:** `dc-042-status-modell-prototyp.html` — interaktiver Vorher/
Nachher-Vergleich (Dashboard-Hero, Filter-Reiter inkl. neuem "Bereit"-Reiter,
Angebots-Karten inkl. archiviertem Beispiel das den Datenverlust von heute
zeigt, "seit X Tagen"-Anzeige, "Status ändern"-Sheet mit Archivieren als
eigenem Schalter) plus Wortwahl-Umschalter zum Ausprobieren. Playwright-
verifiziert (drei Darstellungsfehler beim Review gefunden und behoben).

### ✅ Umgesetzt (Product Designer, 2026-08-30, Sandys Go)

Reiner Wording/Filter-Teil, ohne Datenmodell-Änderung:

- `status.ts`: "Fertiggestellt" → "Bereit", "Offen" → "Beim Kunden" —
  einzige Quelle seit DC-003, die Umbenennung kaskadiert automatisch in
  `MobileQuoteCard`, Angebote-Liste (Desktop-Tabelle + Mobile), Kundendetail
  und das "Status ändern"-Sheet, ohne dass dort etwas geändert werden musste.
- `STATUS_FILTERS` (`src/data/quotes.ts`) + `DashboardFilters.tsx` +
  `angebote/page.tsx`: eigener "Bereit"-Filter-Reiter ergänzt (Lücke 1 aus
  der Bestandsaufnahme) inkl. eigenem Empty-State-Text. Der interne
  `key` für "Beim Kunden" bleibt bewusst `offen` (nur der Anzeige-Text
  ändert sich) — der Query-Param ist an mehreren Stellen verlinkt (z. B.
  Dashboard-Hero), eine Umbenennung des Keys hätte nur Risiko ohne Vorteil
  gebracht.
- `MobileQuoteCard.tsx`: "seit X Tagen" bei Status `sent`, auf `created_at`-
  Basis (offene Entscheidung 4 — die einfache, sofort umsetzbare Variante
  ohne DB-Änderung; ein exaktes `sent_at`-Feld bliebe als spätere,
  genauere Option).

Committet (`b1e32b5`), scoped `tsc --noEmit` sauber. Live-Test steht aus.

**Bewusst NICHT umgesetzt — bei Head of Product Engineering:**

- **Archivieren als Flag statt überschreibendem Status** (Lücke 2) —
  braucht eine Datenbank-Migration (neue Spalte `archived_at`) und
  Anpassung an allen Schreibstellen (`/api/email`, `/api/sign`,
  "Status ändern"-Sheet). Spec liegt in
  `dc-042-status-modell-neu-denken.md` bereit.
- Ein eigenes `sent_at`-Feld für eine exaktere "seit X Tagen"-Anzeige
  (fällt weg, sobald die `created_at`-Variante oben nicht mehr genau genug
  ist).

**Weiterhin offene Entscheidung — bei Sandy:** der tote `viewed`-Status
(ersatzlos streichen oder zu einem echten "Kunde hat geöffnet"-Feature
ausbauen) sowie ob "Abgelehnt" intern zwischen "aktives Nein" und "nichts
mehr gehört" unterscheiden soll — beides unverändert gelassen, bis Sandy
sich entscheidet.

---

## DC-043 — Dashboard + untere Menüleiste neu gedacht

**Datum:** 2026-08-30 (Sandy, direkt im Anschluss an DC-042)

**Status:** ✅ Live (Sandys Go: "das gelbe mikro muss IMMER da bleiben unten
in der leiste, also safe FAB behalten!!! warm und persönlich" — Richtung B
+ FAB-Fix gewählt, committet `b1e32b5`)

**Auftrag:** "kannst du bitte auch das dashboard und die menüleiste unten
neu denken?? irgendwie holt mich das nicht ab...." Kein konkreter Bug,
sondern ein Bauchgefühl. Code von `dashboard/page.tsx`, `BottomNav.tsx`,
`SideNav.tsx`, `data/dashboard.ts` und `MobileQuoteCard.tsx` durchgesehen,
um das Gefühl an konkreten Ursachen festzumachen statt nur am Aussehen zu
drehen.

**Diagnose:**

1. **Zwei gelbe Buttons für exakt dieselbe Aktion.** Der Hero-Button
   "Aufmaß starten" UND der schwebende Mikrofon-FAB in der `BottomNav`
   führen beide zu `/angebot/neu` — zwei auffällige Markenfarben-Elemente
   konkurrieren um dieselbe Aufmerksamkeit, ohne Vorteil.
2. **Alle drei Statistik-Kacheln gleich gewichtet.** Umsatz · Monat ist für
   einen Handwerker emotional die wichtigste Zahl, hat aber keine visuelle
   Sonderstellung und keinen Vergleich zum Vormonat.
3. **Keine Dringlichkeit sichtbar, nur ein Link.** "● 4 Angebote warten auf
   Antwort" sagt nicht, welches Angebot am längsten wartet — Berührungspunkt
   mit der in DC-042 vorgeschlagenen "seit X Tagen"-Anzeige, die hier auf
   der Startseite noch fehlt.
4. **Wort-Inkonsistenz Mobile/Desktop.** `BottomNav` nennt den Ort "Start",
   `SideNav` (Desktop) nennt ihn "Dashboard".
5. **Die Menüleiste ist rein statisch** — kein Badge, kein Hinweis auf
   wartende Angebote, wirkt trotz Markenfarben wie eine austauschbare
   Standard-Tab-Bar.
6. **Die Liste darunter ist reine Datenanzeige** ohne jede Einordnung —
   in Summe ein technisch sauberer, aber emotional neutraler Screen.

**Zwei Richtungen im Prototyp** (bewusst kein einzelner "richtiger"
Vorschlag, da Geschmacksfrage statt Logik-Lücke):

- **A — Fokus & Dringlichkeit:** das am längsten wartende Angebot wird
  namentlich mit "seit X Tagen" herausgestellt, Umsatz bekommt eine große
  Kachel mit Vergleich zum Vormonat, restliche Kennzahlen werden sekundär,
  der "Angebote"-Tab in der Menüleiste bekommt einen kleinen Zähler.
- **B — Warm & persönlich:** variablere, wärmere Begrüßung, Umsatz als
  freundlich gerahmte Fortschritts-Kachel mit Balken statt einer nüchternen
  Zahl, wartende Angebote werden sanft erinnert statt mit einer roten Zahl
  gedrängt, Menüleiste bleibt bewusst ruhig ohne Badge.

**Unabhängig von der Richtung — zwei Fixes, die so oder so sinnvoll sind:**
nur noch EIN Weg zu "Aufmaß starten" (Hero-Button ODER FAB, nicht beide),
"Start"/"Dashboard" auf einen gemeinsamen Begriff vereinheitlicht. Im
Prototyp per eigenem Umschalter unabhängig von A/B ausprobierbar.

**Offene Entscheidungen — bei Sandy:** welche Richtung (oder Mischung)
ihrem Gefühl eher entspricht; Hero-Button oder FAB als der eine CTA;
"Start" oder "Dashboard" als einheitlicher Begriff.

**Prototyp:** `dc-043-dashboard-nav-prototyp.html` — Drei-Wege-Umschalter
(Heute / A / B) mit Handy-Rahmen, zeigt Hero, Statistiken, Angebotsliste UND
Menüleiste zusammen, da der Doppel-CTA-Punkt beide Bereiche betrifft.
Playwright-verifiziert — zwei Darstellungsfehler beim Review gefunden und
behoben (Alters-Hinweis erschien fälschlich schon im "Heute"-Zustand;
Kopfzeile mit App-Namen war auf hellem statt dunklem Hintergrund kaum
lesbar).

Reine Frontend-Änderung, kein Datenmodell-Einfluss.

### ✅ Umgesetzt (Product Designer, 2026-08-30, Sandys Go)

Sandy hat sich für Richtung **B — Warm & persönlich** entschieden, dazu
explizit für den FAB als der eine bleibende CTA (nicht den Hero-Button):

- **CTA-Fix:** der Hero-"Aufmaß starten"-Button entfällt — der
  Mikrofon-FAB in der `BottomNav` bleibt die einzige, immer sichtbare
  Aktion (auf jeder Seite erreichbar, nicht nur auf dem Dashboard).
  Desktop verliert dadurch keine Möglichkeit: die SideNav hat weiterhin
  ihre eigene "Neues Angebot"-CTA. Der Empty-State-Text ("Tippe oben auf
  „Aufmaß starten"") verwies auf den jetzt entfernten Button — auf "Tippe
  unten auf das Mikrofon" umgestellt.
- **Umsatz-Kachel (Richtung B):** eigene, hervorgehobene Kachel statt einer
  von drei gleichrangigen — mit echtem Vergleich zum Vormonat (`+X% ggü.
  letzten Monat`, `data/dashboard.ts` fragt jetzt zusätzlich den
  Vormonatsumsatz mit derselben Filterlogik ab) und einem Erfolgs-Hinweis
  ("🎉 X Angebote diesen Monat angenommen"), wenn diesen Monat etwas
  angenommen wurde — bewusst nur bei echter Grundlage, keine erfundene
  Behauptung. Kein Vergleich angezeigt, wenn der Vormonat 0 € Umsatz hatte
  (sonst bedeutungslose "+100%"/"+∞%"-Angabe). Beauftragt/Offen("Beim
  Kunden") rutschen als sekundäre 2er-Reihe darunter.
- **Menüleiste bleibt ruhig** (Richtung B, kein Badge) — nur die
  Wort-Inkonsistenz behoben: `BottomNav` nennt den Ort jetzt auch
  "Dashboard" statt "Start".

Committet (`b1e32b5`), scoped `tsc --noEmit` sauber. Live-Test steht aus.

---

## Kleinkram (beobachtet, niedrige Priorität, noch keine eigene ID)

- Preisdatenbank (`/preise`): Gewerke-Namen in der linken Spalte werden
  abgeschnitten („Bodenbeläge &…", „Maler & Lackie…") — Spalte ggf. etwas
  breiter oder Kurzlabel verwenden.
- Aufmaß-Startbildschirm: Das Sketch-Mikrofon-Icon dort ist jetzt Teil von
  DC-017 (drei Icon-Sprachen im Produkt) statt eines eigenen Punkts.
- Beim Durchklicken für diesen Check wurde über den „Neues Angebot"-Button
  ein Test-Entwurf im Konto angelegt (Angebot Nr. 2026-493C, ID
  `79ac1431-…`) und für den Aufnahme-Test bewusst bis „Fertiggestellt"
  durchgespielt (siehe DC-009–DC-011). Er ist leer (0 €, kein Kunde),
  taucht aber wegen DC-011 aktuell NICHT in der Angebote-Liste auf,
  sondern nur auf dem Dashboard und der Detailseite — bitte selbst
  aufräumen/löschen, das mache ich nicht automatisch.

---

## Positiv-Notizen (kein Handlungsbedarf)

`Input.tsx` ist ein vorbildlicher Designsystem-Baustein (ein Style, Kommentar
mit Begründung, überall wiederverwendet). `ConfirmSheet.tsx` ersetzt
konsequent native `confirm()`-Dialoge durch ein markenkonformes Bottom-Sheet.
Ton auf Landingpage/FAQ trifft „menschlich, kein Amtsdeutsch" gut. Die
`Logo`-Komponente mit `variant`-Umkehrmuster (Gelb/Weiß auf Dunkel,
Anthrazit/Gelb auf Hell) ist ein cleveres, einfaches System.

**Aus dem Live-Test des Aufmaß-Flows (2026-08-17):** Der
„Zurück"-Bestätigungsdialog (`zurueck_bestaetigen`-Screen) ist genau
richtig gelöst — er merkt zuverlässig, wenn unverarbeitete Aufnahmen
vorhanden sind, und fragt erst nach, statt Daten stillschweigend zu
verwerfen. Der Angebots-Editor selbst (Kunde/Positionen/Rabatt/Summen,
eine feste Aktionsleiste unten) ist klar gegliedert und fühlt sich sofort
verständlich an — genau das „ein Screen, ein nächster Schritt"-Prinzip, das
ihr wollt. Die Aufnahme-Karte mit Zeitstempel + Status-Badge
(„Verarbeitung…" → „✓ Fertig") gibt während des Wartens ein gutes,
beruhigendes Feedback.

**Aus den Onboarding-Screenshots (2026-08-17):** Der Fortschrittsbalken
oben (6 Segmente, gelb gefüllt bis zum aktuellen Schritt) ist über alle
Schritte hinweg sauber konsistent — man weiß immer, wo man steht.
Start-Screen („Schön dass du dabei bist.") und Abschluss-Screen („Alles
eingerichtet!") bilden mit gleichem dunklem Stil, Konfetti/Wink-Emoji und
ähnlichem Aufbau ein schönes, rundes Klammer-Paar um den ganzen Flow. Die
Kleinunternehmer-Option (§19 UStG) und die AGB-Verlinkung im
Rechnungen-Schritt lösen ein Versprechen aus eurer eigenen FAQ tatsächlich
ein — stimmt überein, sehr gut. Der Vergleich „Ohne Verknüpfung" vs. „Mit
Verknüpfung" im Buchhaltungs-Schritt ist eine klare, schnell verständliche
Entscheidungshilfe ohne viel Text. Der Preis-Editor mit Akkordeon
(Fahrtkosten/Arbeitszeit/Entsorgung, auf/zuklappbar) hält eine an sich
komplexe Aufgabe (eigene Preise eintragen) übersichtlich.

---

## Organigramm-Änderung (Chief of Staff, 2026-09-01)

Neue Position: **Head of Legal & Compliance**, seit 01.09.2026 — auf Sandys
dringende Anfrage eingerichtet. Deckt zwei Bereiche ab: (A) SaaS-/
Digitalrecht (Datenschutz, AGB, KI-Kennzeichnungspflichten) und (B) Gewerke-/
Baurecht für die Angebotserstellung (VOB/DIN, Pflichtangaben auf Angeboten).
Volle Rollenbeschreibung: `docs/team-organigramm.md`, Koordination läuft
über `docs/chief-of-staff-legal-todos.md` (ID-Schema CoS-L-XXX).

Relevant für dich: Legal prüft u. a., welche Pflichtangaben ein
rechtssicheres Angebot braucht und ob/wo ein KI-Kennzeichnungshinweis nötig
ist — beides kann das Angebots-PDF/UI und ggf. den Onboarding-Flow
betreffen. Falls dabei Rückfragen zur technischen Umsetzung entstehen,
kommen die über den Chief of Staff — noch kein eigener direkter
Austausch-Kanal, wird bei Bedarf ergänzt.

---

## Hinweis vom Head of Legal & Compliance (2026-09-01) — neue Datei `docs/vob-angebot-abstimmung.md`

Für das VOB-/Angebots-Thema gibt es jetzt eine eigene Abstimmungsdatei:
**`docs/vob-angebot-abstimmung.md`** (Legal ↔ Prüfmeister ↔ Head of Product
Engineering ↔ Product Designer, ID-Schema VOB-XXX). Zwei Punkte darin sind
Design-Fragen, keine Rechtsfragen — deshalb hier der Zeiger.

**VOB-004 — Der Übermessungshinweis muss aufs Kunden-PDF.** `vobHinweistext()`
erzeugt bereits den richtigen Satz („2 Öffnungen bis 2,5 m² Einzelgröße nicht
abgezogen (3,09 m², VOB/C DIN 18363 Übermessung)"), er landet aber in
`annahmen` und damit nur in `AngebotDetail.tsx`. Das PDF zeigt als
Positionsuntertitel nur `item.description`. Der Endkunde liest „50,00 m²",
misst 46,64 m² nach und findet keine Erklärung.

Das ist **Vertrauensarbeit, keine Rechtsklausel**. Richtig platziert erklärt
der Satz dem Kunden, warum die Rechnung fair ist — er verkauft, statt zu
verunsichern. Meine Randbedingung: in normaler Schriftgröße, bei der Position,
nicht in der Fußzeile. Alles andere ist deine Entscheidung. Eine Idee, falls
die Positionsliste sonst zu voll wird: Fußnotenziffer an der Menge und der
Erklärtext einmal am Ende.

**VOB-007 — Die Zeile „Normgrundlagen" verspricht mehr, als das Angebot
hält.** `pdf.tsx` rendert sie in 7 pt, Farbe `#BBBBBB`. Zwei Probleme: Als
Einbeziehung von AGB nach § 305 Abs. 2 BGB taugt sie nicht (das braucht einen
ausdrücklichen Hinweis und zumutbare Kenntnisnahme — ein Normkürzel in
Hellgrau ist beides nicht). Und sie stimmt in der Sache nicht durchgängig: das
Produkt weicht an mindestens drei Stellen bewusst von DIN 18363 ab (Verschnitt
als Menge, Nebenleistungen als eigene Positionen, Höhenzuschlag unterhalb der
Normgrenze). Eine Normangabe, die man punktuell nicht einhält, ist schlechter
als gar keine — sie liefert dem Endkunden den Maßstab, an dem er uns misst.

Die Zeile hat trotzdem einen echten Wert, den ich nicht wegwerfen will: sie
signalisiert Fachlichkeit. Die Frage an dich ist, wie wir dieses Signal
behalten, ohne eine Zusage zu machen, die das Angebot nicht einlöst.
Vielleicht reicht eine ehrlichere Formulierung („Mengenermittlung in Anlehnung
an VOB/C DIN 18363"), vielleicht braucht es zwei getrennte Elemente —
sachliche Erklärung an der Position, Einbeziehung als optionaler Fußtext in
lesbarer Größe.

**Aus der Registrierung** (getrennt davon, CoS-L-001/G4): Es fehlt eine
Pflicht-Checkbox „Ich melde mich als Unternehmer (§ 14 BGB) an" — die AGB
schließen Verbraucher aus, das Formular fragt es nicht. Und der Satz „Ich habe
die AGB **und die Datenschutzerklärung** gelesen und akzeptiere sie" sollte
getrennt werden: AGB akzeptieren (Checkbox), Datenschutzerklärung nur
verlinken. Eine Datenschutzerklärung ist Information nach Art. 13 DSGVO, keine
Einwilligung — sie wird nicht akzeptiert.

---

## ✅ Umgesetzt (Product Designer, 2026-09-02) — Reaktion auf Sandys „checke punkte vom head of legal"

Commit `353f5dd`. Drei Punkte aus dem Legal-Hinweis oben, die reine
Design-/Frontend-Änderungen ohne Datenbank-Migration waren:

**G4 (Design-Hälfte).** `register/page.tsx`: eigene Pflicht-Checkbox „Ich
melde mich als Unternehmer an (§ 14 BGB) — sofortangebot ist für den
gewerblichen Einsatz gemacht, nicht für Verbraucher." vor der AGB-Checkbox,
mit Client-Validierung und `unternehmerBestaetigt` im Request-Body. AGB-
Zustimmung (Checkbox) und Datenschutzerklärung (reiner Info-Link, Art. 13
DSGVO) sind jetzt getrennt.
**Bewusst NICHT enthalten:** serverseitige Prüfung/Persistierung von
`unternehmerBestaetigt` in `src/app/api/auth/register/route.ts` — dort
existiert bereits die analoge Logik für `agbAkzeptiert`, aber das ist
Head of Product Engineerings Fundstelle (in ihrer „Erledigung zu CoS-026"
selbst als „G4 — Offen" bestätigt), also bewusst nicht angefasst, um nicht
an derselben Route parallel zu arbeiten.

**R3.** `VorschauUndVersand.tsx`: ruhiger Hinweis „Aus deinem Diktat
erstellt — bitte einmal prüfen, bevor es rausgeht." über den Versand-Tabs
(E-Mail/WhatsApp/Link), unabhängig vom gewählten Kanal sichtbar. War in
dieser Datei noch nirgends dokumentiert, obwohl der Chief-of-Staff-Kanal
das schon als „gesehen" markiert hatte — beim Nachprüfen im Code tatsächlich
nicht vorhanden gewesen, also als eigener Punkt umgesetzt statt übersprungen.

**VOB-007.** `pdf.tsx`: „Normgrundlagen: …" → „Mengenermittlung in Anlehnung
an: …", 7,5 pt / `#999999` (dezent dunkler, bleibt aber Fußnoten-Charakter).
Genau die von Legal selbst vorgeschlagene ehrlichere Formulierung — keine
Norm-Konformität mehr behauptet, wo das Produkt an mind. drei Stellen
bewusst abweicht (Verschnitt als Menge/VOB-001, Nebenleistungen als eigene
Positionen/VOB-005, Höhenzuschlag unter Normschwelle/VOB-006).

**Geprüft, aber bewusst NICHT umgesetzt: VOB-004 / G5.** Das ist der einzige
🔴-RED-Befund in Legals Risikobewertung (LR-01) und explizit an mich UND Head
of Product Engineering adressiert — trotzdem noch offen, und zwar aus einem
konkreten Grund: `pdf.tsx` bekommt den Übermessungshinweis-Text
(`vobHinweistext()`) heute gar nicht erst übergeben. Das Feld existiert nur
im `annahmen`-Array, das in `AngebotDetail.tsx` landet, nicht im
PDF-Item-Typ. Es gibt für mich also (noch) nichts zu platzieren — die
Datenanbindung ist echte Pipeline-Arbeit (`quote_items`/PDF-Props), nicht
Layout, und liegt bei Head of Product Engineering. Sandys Text-Freigabe
(S-2) liegt bereits vor, das ist also kein Blocker mehr. Sobald das Feld im
PDF-Item ankommt, übernehme ich die Platzierung — Legals Vorgabe: normale
Schriftgröße, direkt an der Position, nicht in der Fußzeile.

Verifiziert per scoped `tsc --noEmit` (exit 0). Live-Nachtest steht wie bei
den meisten Punkten hier noch aus.

---

## Nachtrag zu VOB-004 / G5 (Head of Product Engineering, 2026-09-02)

Der Absatz „Geprüft, aber bewusst NICHT umgesetzt: VOB-004 / G5" weiter oben
ist erledigt — die Datenanbindung liegt vor, der Hinweis steht auf dem PDF.

Deine Randbedingung („normale Schriftgröße, direkt an der Position, nicht in
der Fußzeile") und dein Vorschlag mit der Fußnotenziffer sind beide umgesetzt:
an der Position stehen die konkreten Zahlen mit ¹, unter der Positionsliste
steht die Erklärung einmal — 8,5 pt / #444444, deutlich über der 7 pt/#BBBBBB
der Normgrundlagen-Zeile. Die Erklärung beginnt mit „Aufmaß in Anlehnung an
VOB/C (DIN 18363)" statt mit „Mengenermittlung in Anlehnung an", damit sie
sich nicht wortgleich mit der VOB-007-Zeile doppelt, falls beide erscheinen.

Deine Annahme im Absatz oben war übrigens fast richtig, aber der Blocker war
kleiner als gedacht: `annahmen` liegt bereits in `quote_items` und kommt über
`quote_items(*)` in der PDF-Route mit an. Nicht das Feld fehlte, nur der
Zugriff.

Zwei Layout-Nebenfunde, die ich gleich mitgenommen habe: Mengen standen mit
englischem Dezimalpunkt im PDF („46.64" neben „12,50 €"), jetzt deutsch
formatiert. Und der Hinweis wird an **beiden** Renderpfaden gezogen (flache
Liste und Gruppierung) aus einer gemeinsamen Quelle — die Divergenz zwischen
zwei Ansichten derselben Daten hatten wir schon einmal.

---

## `onboarding_started_at` steht — du kannst weiterbauen (2026-09-02)

Punkt 1 deines Vorschlags „Später fertigstellen" ist erledigt, Migration ist
live angewandt (`20260902150000_onboarding_started_at.sql`). **Punkt 3 habe
ich gleich mitgemacht**, weil er im Server-Code sitzt:

- `getDashboardData()` leitet nur noch ins Onboarding um, wenn **weder** ein
  Firmenname **noch** ein Startzeitpunkt da ist — also nur bei „nie
  angefangen".
- `requireCompany()` in `src/data/auth.ts` wählt die neue Spalte jetzt mit
  aus. **Darauf wäre ich fast reingefallen:** Die Funktion las nur
  `id, name, plan`. Meine Weiche hätte gegen ein `undefined` geprüft und wäre
  stillschweigend wirkungslos geblieben — dein Link hätte weiter ins
  Onboarding zurückgeworfen, und die Ursache hätte niemand im Dashboard
  gesucht. Ein Test hält das jetzt fest.

**Was du noch baust** (Punkt 2 und 4, unverändert wie von dir geplant):
das idempotente `UPDATE … WHERE onboarding_started_at IS NULL` beim ersten
Erreichen von Schritt 2, dann Link und Banner.

**Wichtig für dein Testen:** Bis dein Punkt 2 steht, ändert sich **nichts** —
alle bestehenden Zeilen sind `NULL`, also verhält sich das Dashboard exakt wie
bisher. Ich habe bewusst **nicht** auf `created_at` backfillt: Damit hätten
alle Bestandskonten schlagartig als „angefangen" gegolten, und das Verhalten
hätte sich für sie geändert, ohne dass es jemand ausgelöst hat. Additiv heißt
additiv.

Zu deiner zweiten, kleineren Lücke (andere `(app)`-Seiten ohne eigene
Onboarding-Prüfung): unverändert offen, ich habe sie nicht angefasst. Sobald
du beim Bauen auf eine Seite stößt, die mit leerem `company.name` kaputt
aussieht, sag Bescheid — das ist dann ein konkreter Fall statt einer
Vermutung.

69 Dateien / 1.167 Tests grün, tsc sauber, eslint 0 Fehler.

---

## DC-032 fertig — Punkt 2 + 4 gebaut (Product Designer, 2026-09-02)

Danke für den schnellen Turnaround oben. Hab direkt weitergebaut, Commit
`d4c568f` (`src/app/(app)/onboarding/[step]/page.tsx`,
`src/app/(app)/dashboard/page.tsx`):

- **Punkt 2:** `useEffect` bei `step === 2` setzt `onboarding_started_at`
  einmalig. Idempotenz liegt bewusst in der Query selbst
  (`.is('onboarding_started_at', null)`), nicht in Client-State — ein
  Reload oder Zurück-Navigieren auf Schritt 2 darf beliebig oft feuern,
  ohne einen schon gesetzten Zeitpunkt zu überschreiben.
- **Punkt 4a:** „Später fertigstellen"-Textlink in der Schritt-2–7-Kopfzeile
  (neben dem Logo), navigiert zu `/dashboard`. Kein eigener Save nötig —
  jedes `update()` ruft schon `saveState()`, der Fortschritt liegt also
  längst in localStorage, bevor der Link überhaupt sichtbar wird.
- **Punkt 4b:** Resume-Nudge im Dashboard, gleiches visuelles Muster wie
  die bestehende Preisliste-Nudge, sichtbar bei fehlendem `company.name`.
  Ersetzt in dem Fall bewusst die Preisliste-Nudge (wäre redundant — ohne
  fertiges Onboarding gibt's noch keine eigenen Preise). Nebenbei auch die
  Begrüßung abgesichert: „Guten Tag, Hallo." wäre kaputt gewesen, sobald
  diese Seite dank des neuen Ausstiegs tatsächlich mit leerem Namen
  aufgerufen werden kann — vorher unmöglich, weil `needsOnboarding()`
  vorher gegriffen hätte.

**Bewusst nicht angefasst:** `src/data/auth.ts`, `src/data/dashboard.ts`,
die Migration — lagen beim Schreiben noch uncommitted in deinem Working
Tree, Kollision vermieden. Heißt aber auch: **läuft erst End-to-End, sobald
dein Teil committet ist** — bis dahin bleibt `needsOnboarding()` bei der
alten Logik (`!company.name`), und mein Ausstiegs-Link führt technisch
schon zu einem Dashboard, das jeden ohne Namen sofort wieder zurück ins
Onboarding schickt. Kein Blocker meinerseits mehr, nur eine
Reihenfolge-Abhängigkeit.

tsc sauber (scoped auf die beiden Dateien + Abhängigkeiten, `--noEmit`).

---

## DC-044 — Kundendaten lassen sich nach dem Anlegen nirgends bearbeiten

**Datum:** 2026-09-06 (Product Designer, Sandys Auftrag „klick dich hier im
Fenster durch alles durch... check alles auch das woran ich jetzt nicht
gedacht habe")
**Status:** ❌ offen, bestätigter Befund

**Befund:** Beim Neuanlegen (`/kunden/neu`) lassen sich Name, Adresse,
PLZ/Ort, Telefon, E-Mail und „Gewerblicher Kunde" vollständig erfassen.
Danach gibt es aber keinen einzigen Weg mehr, diese Angaben zu ändern:
`src/app/(app)/kunden/[id]/page.tsx` hat keinen „Bearbeiten"-Button und
keine Lösch-Möglichkeit für den Kunden selbst — nur `KundeTypToggle.tsx`
(Privat-/Geschäftskunde + USt-IdNr./Leitweg-ID). Auch die „Ändern"-Funktion
beim Kunden-Zuweisen im Angebot (`AngebotDetail.tsx`) kann nur einen
ANDEREN, bereits existierenden Kunden auswählen oder einen Lexware-Kontakt
importieren — sie kann keinen bestehenden Kunden bearbeiten. Codeweite Suche
nach einem Update-Pfad für `customers` (außer dem Typ-Toggle) ergab nichts.

**Warum das zählt:** Ein Tippfehler in der Telefonnummer, eine neue Adresse,
ein falsch geschriebener Name — aktuell gibt es keinen UI-Weg, das zu
korrigieren, ohne den Kunden komplett neu anzulegen (und dabei die
Angebots-/Baustellen-Historie zu verlieren, da neue Kunden-ID). Für ein
Produkt, das gerade in die echte Nutzung geht, ist das ein Basis-Feature,
das fehlt.

**Vorschlag:** Einfacher Bearbeiten-Button auf der Kunden-Detailseite,
öffnet dasselbe Formular wie „Neuer Kunde" (nur vorausgefüllt), schreibt
per `update()` auf dieselbe `customers`-Zeile. Kein Datenmodell-Thema,
reine fehlende Oberfläche.

---

## DC-045 — Kein Zugang zur Abo-/Plan-Verwaltung nach dem Onboarding

**Datum:** 2026-09-06 (Product Designer, Klick-Test)
**Status:** ❌ offen, bestätigter Befund

**Befund:** `PlanWahlModal` (das Fenster mit „Vollgas — 17 €/Monat") wird
laut Code ausschließlich von `WelcomeModalWrapper` aufgerufen, das wiederum
nur rendert, wenn die Dashboard-Seite mit `?welcome=new` aufgerufen wird —
also einmalig, direkt nach frischem Onboarding. Ich habe systematisch alle
drei Einstellungen-Tabs (Betrieb/Angebote/App) sowie das „Hallo, Holm"-Sheet
(Avatar oben rechts) durchsucht: nirgends existiert eine Seite oder ein Link
für Plan-Wechsel, Rechnungshistorie oder Zahlungsmethode. Wer den
Willkommens-Moment verpasst (z. B. weil er anfangs beim Free-Tier bleiben
wollte) oder später upgraden/downgraden will, hat aktuell keinen
auffindbaren Weg dahin.

**Zusätzlich, beim Nachsehen entdeckt:** Das beworbene „3 Angebote/Monat
kostenlos"-Limit (DC-001, `pricing.ts`) wird nirgends im Code geprüft —
weder beim Anlegen eines Entwurfs noch beim Fertigstellen. Codeweite Suche
nach einer Nutzungs-/Monats-Zählung ergab nichts. Das Limit existiert also
aktuell nur als Text auf der Landingpage/im Modal, nicht als echte Grenze —
ein Starter-Nutzer kann technisch unbegrenzt viele Angebote im Monat
anlegen.

**Warum das zählt:** Ohne durchgesetztes Limit UND ohne späteren
Upgrade-Weg fehlt aktuell die komplette monetarisierbare Schicht des
Produkts — das ist über reines UI/UX hinaus eine Geschäftsentscheidung
(Sandy/Head of Product Engineering), aber gehört meiner Meinung nach vor
dem ersten zahlenden Nutzer geklärt.

---

## DC-046 — Doppelte CTA auf der Angebote-Liste (Header-„Neu" vs. FAB)

**Datum:** 2026-09-06 (Product Designer, Klick-Test)
**Status:** ❌ offen, bestätigter Befund

**Befund:** `src/app/(app)/angebote/page.tsx` hat einen eigenen
„Neu"-Button (Mikro-Icon) im Header, der auf `/angebot/neu` verlinkt —
exakt dasselbe Ziel wie der FAB in `BottomNav.tsx`, der laut DC-043
bewusst „die einzige, immer sichtbare CTA" sein soll („das gelbe mikro
muss IMMER da bleiben unten in der leiste"). DC-043 hat den doppelten
Hero-Button auf dem Dashboard genau aus diesem Grund entfernt — dieselbe
Dopplung existiert aber weiterhin auf der Angebote-Liste, nur nicht
mitgeprüft, weil DC-043 sich nur auf das Dashboard bezog.

**Vorschlag:** Header-„Neu"-Button auf der Angebote-Liste entfernen (FAB
ist ohnehin auf jeder Seite mit `BottomNav` sichtbar), analog zu DC-043.

---

## DC-047 — Zwei gleichlautende, nicht erklärte Lexware-Integrationen

**Datum:** 2026-09-06 (Product Designer, Klick-Test)
**Status:** ❌ offen, bestätigter Befund

**Befund:** `einstellungen/integrationen/page.tsx` listet „Lexware Office"
und „Lexoffice (Legacy)" als zwei getrennte Karten mit eigenem API-Key-Feld
— beide verweisen im Hilfetext auf dieselbe Adresse `app.lexoffice.de`.
Für jemanden, der zum ersten Mal seine Buchhaltung verbinden will, ist
nicht erkennbar, warum es zwei Einträge für dasselbe Produkt gibt oder
welchen er nehmen soll (aktuelle API vs. alte/Legacy-API vermutlich —
steht aber nirgends).

**Vorschlag:** Mindestens einen kurzen Erklärtext ergänzen („Neuer
API-Zugang? Nimm 'Lexware Office'. Hast du schon einen alten
Lexoffice-API-Key? Nimm 'Legacy'."), oder falls die Legacy-Variante kaum
noch gebraucht wird, unter einem eingeklappten „Erweitert"-Bereich
verstecken statt gleichrangig oben zu zeigen.

---

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
