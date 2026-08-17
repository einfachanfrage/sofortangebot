# Launch-Scope für den Chief of Staff

Zwei Teile: **Teil A** kommt in die Benutzerdefinierten Anweisungen des CoS-Projekts.
**Teil B** ist ein fertiges Gerüst, das der CoS als kanonische Datei `launch-readiness.md` übernimmt
(die eine Heimat für den gesamten Launch-Scope — das Dashboard leitet daraus ab, erfindet nichts dazu).

---

## TEIL A — Block für die CoS-Anweisungen

```
## Launch-Scope: denk wie ein CoS, nicht wie ein QA-Log

Die QA-Testfälle (PM-XXX) sind nur EIN Ausschnitt des Launches — nicht das Ganze.
Ein Fortschritt, der nur gegen die aktuellen Testfälle rechnet, ist irreführend:
er lässt „fast fertig" aussehen, was in Wahrheit ein kleiner Teilbereich ist.
Es kommen noch viele weitere Testfälle dazu (Richtwert ~100), UND ganze
Bereiche, die mit QA gar nichts zu tun haben: Onboarding, E-Mail-Versand,
Zahlung, Navigation, Rechtstexte, Betrieb.

Deine Aufgabe:
- Halte den VOLLSTÄNDIGEN Launch-Scope als kanonische Datei launch-readiness.md.
  Dort steht alles, was vor einem Launch eines SaaS-Produkts logischerweise
  dazugehört — nicht nur, was gerade schon getestet wird. Was noch nicht
  begonnen ist, steht als „offen" drin, nicht als Lücke im Schweigen.
- Rechne den Gesamtfortschritt ehrlich gegen diesen vollständigen Scope —
  auch wenn die Prozentzahl dadurch stark fällt. Eine niedrige, wahre Zahl
  ist wertvoller als eine hohe, die einen halben Bereich misst.
- Sortiere ALLES in drei Gates:
    Gate 1 — Erste echte Testnutzer (wenige, begleitet, geschlossen)
    Gate 2 — Öffentlicher Launch / erste zahlende Nutzer
    Gate 3 — Danach / Skalierung
  Ein Item, das erst für Gate 2 zählt, darf Gate 1 nicht blockieren.

Die Latte für Gate 1 ist Sandys Produktprinzip, NICHT Perfektion: Kann ein
echter Handwerker mit dem Mensch-in-der-Schleife-Netz echten Nutzen ziehen,
ohne sich zu blamieren? Dafür müssen die Kernrechnung tragen, Accounts und
E-Mails funktionieren, keine Nutzerdaten sich vermischen, die Basis-Rechtstexte
stehen und es einen Weg für Feedback geben — NICHT alles perfekt sein.

Wie du es mir gibst: immer priorisiert und nach Gate gefiltert. Kipp mir nie
die ganze Liste auf einmal hin — nenn mir, was für das NÄCHSTE Gate zählt und
davon die zwei, drei wichtigsten. Den vollständigen Scope hältst du im
Hintergrund, damit nichts vergessen wird; sichtbar machst du immer nur die
relevante Scheibe.

Fällt dir ein Bereich auf, der im Scope fehlt, ergänze ihn und sag mir Bescheid.
Erfinde keinen Status, der nicht in einer Heimat-Datei steht (siehe Doku-Konvention).
```

---

## TEIL B — Gerüst für `launch-readiness.md`

Gate-Tags: **[G1]** erste Testnutzer · **[G2]** öffentlicher Launch · **[G3]** danach.
Der CoS füllt Status/Prozent pro Zeile und verweist für Details nur auf IDs (PM-/DC-/PD-/CoS-XXX),
statt deren Stand zu wiederholen.

### 1. Kernfunktion & QA — die Sprach-zu-Angebot-Pipeline
- [G1] Kernrechnungen tragen über eine breite Fallbasis (Richtwert ~100 statt 10), nicht nur die heutigen Fälle
- [G1] Abdeckung über beide Gewerke (Maler, Boden), verschiedene Raumtypen, Sonderfälle, Verneinungen, Selbstkorrekturen
- [G1] Bestätigungskarte = Endberechnung (Karte-≠-Berechnung-Muster geschlossen — siehe PD-001/PD-004/CoS-002)
- [G1] Alle bestätigten Fälle als Golden Tests grün; kein Fix bricht still einen alten Fall
- [G2] Zahlen-/Größenordnungsfehler ausgeschlossen (siehe PM-010: „drei fünfzig" → 350)

### 2. Accounts & Onboarding
- [G1] Registrierung, Login, Logout laufen sauber durch — komplett, nicht in Teilen
- [G1] E-Mail-Verifizierung beim neuen Account funktioniert wirklich (nicht nur „ausgelöst", sondern zugestellt)
- [G1] Passwort-Zurücksetzen funktioniert
- [G1] Der komplette erste Durchlauf (erste Anmeldung bis erstes Angebot) einmal end-to-end durchgespielt
- [G2] Account-Löschung möglich (auch DSGVO-relevant)

### 3. Transaktions-E-Mails
- [G1] Alle Pflicht-Mails werden wirklich versendet: Willkommen, Verifizierung, Passwort-Reset
- [G1] Absender korrekt, Links funktionieren, Inhalt stimmt, landen nicht im Spam
- [G2] Weitere Mails je nach Flow (z.B. Quittung/Rechnung, Angebot fertig)

### 4. Zahlung & Abrechnung (Stripe)
- [G2] Checkout/Abo funktioniert, korrekte Preise, MwSt korrekt behandelt
- [G2] Rechnungen werden erzeugt und sind korrekt
- [G2] Fehlgeschlagene Zahlung und Kündigung sauber behandelt
- [G1] Falls Testnutzer kostenlos starten: sicherstellen, dass kein Zahlungsschritt sie blockiert

### 5. Navigation & UX-Integrität (mit Product Designer)
- [G1] Man kommt von überall leicht zurück und leicht zur Startseite — keine Sackgassen
- [G1] Jeder Button an sinnvoller Stelle; nichts Wichtiges fehlt (siehe DC-002 „Angebote" in Desktop-Nav)
- [G1] Funktioniert auf Handy UND Desktop (Handwerker ist mobil auf der Baustelle)
- [G2] Leere Zustände, Fehlerzustände, Ladezustände überall sinnvoll gestaltet
- [G2] Statusfarben & Design-Tokens konsistent (siehe DC-003, DC-006)

### 6. Datenschutz & Datensicherheit (technisch)
- [G1] Nutzer sehen ausschließlich ihre eigenen Daten (Supabase Row-Level-Security greift überall)
- [G1] Keine Secrets/Keys im Frontend oder in Logs sichtbar
- [G2] Daten-Export und -Löschung für DSGVO-Anfragen umsetzbar

### 7. Rechtstexte & Compliance
- [G1] Impressum vorhanden und korrekt
- [G1] Datenschutzerklärung vorhanden (inkl. der eingesetzten Dienste)
- [G1] AGB mit klarem B2B-Ausschluss vom Fernabsatzrecht
- [G2] DSGVO-Verzeichnis von Verarbeitungstätigkeiten (intern)
- [G2] Auftragsverarbeitungsverträge / DPAs mit Subprozessoren geklärt (OpenAI, Supabase, Stripe, Vercel)
- [G2] Cookie-/Consent-Banner, falls einwilligungspflichtige Dienste
- [G2] Berufshaftpflicht für Softwareanbieter
- [G3] Marke „Sofortangebot" beim DPMA anmelden
- [G3] ZUGFeRD-Pflicht ab 2027 für eigene Rechnungen

### 8. Technik, Betrieb & Zuverlässigkeit
- [G1] Observability: jede Pipeline-Stufe ist nachvollziehbar geloggt (nicht mehr blind fixen)
- [G1] Race Condition ausgeschlossen (Summe stabil ohne Nutzeraktion)
- [G2] Backups eingerichtet und einmal ein Restore getestet
- [G2] Fehler-Monitoring: du merkst, wenn im Betrieb etwas bricht
- [G2] OpenAI-Kosten pro Angebot bekannt und tragbar; Rate-Limits bedacht
- [G2] Domain, SSL, Hosting-Konfiguration sauber

### 9. Inhalte & Landingpage
- [G1] Landingpage erklärt klar, was das Tool tut und für wen (Wert in einem Satz)
- [G1] Preis-/Gewerke-Text final (siehe CoS-001, DC-001)
- [G2] In-App-Wording durchgängig klar und menschlich (kein KI-/Amtsdeutsch)
- [G2] Preisseite verständlich

### 10. Support & Notfall
- [G1] Ein klarer Kanal, über den Testnutzer Bugs und Feedback melden können
- [G1] Notfallplan, wenn Sandy nicht verfügbar ist (Auto-Reply, Kontaktweg bei kritischem Bug)
- [G2] Kurze Hilfe/FAQ für die häufigsten Fragen

### 11. Business & Steuer
- [G2] Kleinunternehmergrenze (25.000 €) im Blick; Konsequenzen bei Überschreitung bekannt
- [G2] Separate EÜR für Sofortangebot-Einnahmen
- [x] Gewerbeanmeldung (erledigt)

### 12. Go-to-Market (nach der Entwicklungsphase)
- [G3] Erste Nutzer-Gewinnung (z.B. über Instagram/Clemens' Netzwerk)
- [G3] Feedback-Schleife mit den ersten echten Nutzern
- [G3] Rollen Social Media/Content und Legal Advice besetzen

---

**Hinweis für den CoS:** Diese Liste ist eine Grundlage, kein Gesetz. Ergänze, was fehlt,
und justiere die Gate-Zuordnung, wenn eine andere Einteilung fachlich sinnvoller ist —
aber halte sie vollständig, damit vor dem Launch nichts durchrutscht.
