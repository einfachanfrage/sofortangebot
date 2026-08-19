# Launch-Readiness — Sofortangebot

Kanonische Datei für den **vollständigen Launch-Scope**, geführt vom Chief of
Staff. Das ist die eine Heimat für alles, was vor einem Launch dazugehört —
nicht nur QA. Was noch nie geprüft wurde, steht hier trotzdem als offener
Punkt drin, nicht als Lücke im Schweigen.

**Regel:** Für Punkte mit einer eigenen ID (PM-/DC-/PD-/CoS-XXX) gilt deren
Heimat-Datei als Wahrheit — hier steht nur die ID + der übernommene Status,
nie ein eigener Wert. Für Punkte ohne eigene ID ist diese Datei selbst die
Heimat; der Status kommt entweder aus einer direkt verifizierten Quelle
(Code, Betriebsdatei, Web-Recherche — dann mit Quellenangabe) oder heißt
ehrlich „offen — nicht erhoben", nie eine geschätzte Prozentzahl ohne
Kennzeichnung.

**Gates:** [G1] erste echte Testnutzer (wenige, begleitet, geschlossen) ·
[G2] öffentlicher Launch / erste zahlende Nutzer · [G3] danach / Skalierung.
Ein [G2]-Punkt blockiert Gate 1 nicht.

**Maßstab für Gate 1** (Sandys Produktprinzip, keine Perfektion): Kann ein
echter Handwerker mit dem Mensch-in-der-Schleife-Netz echten Nutzen ziehen,
ohne sich zu blamieren? Kernrechnung muss tragen, Accounts/E-Mails müssen
funktionieren, keine Datenvermischung, Basis-Rechtstexte müssen stehen, es
muss einen Feedback-Weg geben — nicht alles perfekt sein.

**Update 17.08.2026 (später Nachmittag):** Auf Sandys ausdrücklichen Wunsch
("erster Launch, will auf Nummer sicher gehen, wirklich alles nochmal sauber
durchgehen") von 12 auf 13 Bereiche und von 54 auf 92 Einzelpunkte erweitert
— u. a. um IT-Sicherheit im Detail, aktuelle Rechtspflichten (EU-AI-Act,
E-Rechnung), Zahlungs-/Kündigungsrecht, und eine eigene Tag-X-Checkliste für
den Moment des ersten echten Testnutzers. Die Prozentzahlen können dadurch
schwanken, obwohl real etwas passiert ist — das ist gewollt: ein größerer,
ehrlicherer Nenner ist besser als ein kleiner, falscher.

---

## Gate-Fortschritt (Stand 18.08.2026, Abend)

| Gate | Fortschritt | Punkte |
|---|---|---|
| **Gate 1** — erste Testnutzer | **22 %** (↑ von 19 %) | 46 |
| **Gate 2** — öffentlicher Launch | **10 %** (unverändert) | 35 |
| **Gate 3** — danach/Skalierung | **17 %** (unverändert) | 11 |

Rechenweg unverändert: jeder Punkt 0–100 nach der jeweiligen Heimat-Quelle,
0 = „offen, nicht erhoben" ist ein legitimer Wert. Ungewichteter Durchschnitt.
**Update 18.08.2026 (Abend), echte Neubewertung, keine Schätzung:** Alle 46
Gate-1-Punkte einzeln gegen den heutigen Stand der jeweiligen Heimat-Datei
durchgegangen (nicht nur die, die offensichtlich betroffen waren). Ergebnis:
+3 Prozentpunkte, von 19 % auf 22 %. Das wirkt nach einem starken Tag wenig —
der Grund ist der große, ehrliche Nenner: von den 46 Gate-1-Punkten hat sich
heute an 8 konkret etwas verbessert, die übrigen 38 stehen unverändert (viele
davon bei „0 %, nicht erhoben" — Accounts-End-to-End, E-Mail-Zustellung,
Rate-Limiting u. a. — dort ist heute schlicht nichts passiert). Die 8
verbesserten Punkte im Einzelnen: 8.2 Race Condition (5→45, Auslöser
gefunden + Fix, Live-Nachtest fehlt), 9.2 Preis-Text (40→80, umgesetzt,
Live-Check fehlt), 5.2 Buttons/Listen (15→40, DC-011 behoben), 1.3
Bestätigungskarte (25→30, kleiner Fortschritt, Kernproblem laut Prüfmeister
weiterhin ungelöst), 2.8 erster Eindruck (10→20, PM-015-Fix), 1.1/1.2/1.4
(Fallbasis/Abdeckung/Golden-Tests, je kleine Zuwächse). Gate 2 und Gate 3
unverändert — heute war reine Gate-1-Arbeit, an keinem G2/G3-Punkt hat sich
etwas bewegt.

> ✓ **Größte Verbesserung seit gestern:** Die beiden bisher schwersten
> Einzelfunde sind auf der Zielgeraden statt offen. Verschwindende Angebote
> (**DC-011**) sind live bestätigt behoben — betraf alle 56 in Produktion
> gespeicherten Angebote. Bei der Angebots-Verdopplung (**CoS-010**,
> **8.2**) ist der wahre Auslöser gefunden (fehlender Doppel-Tap-Schutz auf
> „Fertigstellen"), Fix ist drin, 706/706 Tests grün — fehlt nur noch Sandys
> bewusster Live-Test (zweimal schnell tippen). Bis dahin bleibt 8.2 der
> wichtigste offene Einzelpunkt im ganzen Projekt.

Zweiter wichtiger Befund, diesmal eine Entwarnung: der am 17.08. vormittags
vermutete „Deploy-Lücke" bei PM-010 (drei gemeldete Fixes wirkten live nicht)
ist **keine Deploy-Lücke** — Head of Product Engineering hat gegen echte
Produktionsdaten nachgesehen und die wahre Ursache gefunden (Tests liefen
gegen zu saubere, künstliche Testfälle). Die Kette Code→Deploy→live ist
damit als grundsätzlich zuverlässig bestätigt (Punkt 8.7 stark nach oben).
Was bleibt: eine der drei Einzellücken („Sockelleisten streichen" fehlt in
der Maler-Engine) übersteht jetzt vier Fix-Versuche und ist dreifach
unabhängig bestätigt — ein hartnäckiges Einzelthema, kein System-Risiko
mehr, weiterhin **CoS-007** in `chief-of-staff-todos.md`.

Dritter, neuer Befund (Chief-of-Staff-Recherche, 17.08.): **Art. 50 EU AI
Act, die Pflicht, Nutzer über eine KI-Interaktion zu informieren, ist seit
dem 2. August 2026 in Kraft** — also bereits jetzt, nicht erst zukünftig.
Sofortangebot verarbeitet Spracheingaben per KI (Whisper/GPT) und zeigt
KI-erkannte Ergebnisse an — das dürfte darunterfallen. Bußgeld-Rahmen laut
Gesetz bis 15 Mio. € oder 3 % des weltweiten Jahresumsatzes (realistisches
Risiko für ein Startup dieser Größe: eher gering, aber die Pflicht selbst
ist günstig und schnell umsetzbar — ein klarer Hinweistext reicht). Neuer
Punkt 7.10, als G1 eingestuft, weil er jetzt schon gilt und kaum Aufwand
macht. Quelle: [re.think Consulting, Transparenzpflichten Art. 50 AI Act](https://rethink.consulting/transparenzpflichten-nach-artikel-50-des-eu-ai-acts-alles-zur-kennzeichnungspflicht-fur-ki-inhalte-ab-august-2026/).

Vierter Befund, zwei Entwarnungen bei aktuell viel diskutierten Gesetzen:
**NIS2** (EU-Cybersicherheitsrichtlinie, in Deutschland seit 6.12.2025 in
Kraft) gilt erst ab 50 Mitarbeitenden oder 10 Mio. € Jahresumsatz in einem
von 18 definierten Sektoren — Sofortangebot liegt deutlich darunter, aktuell
nicht einschlägig, aber im Blick behalten bei Wachstum (Punkt 7.11). Das
**Barrierefreiheitsstärkungsgesetz** (BFSG) richtet sich an Verbraucher-
Dienstleistungen — da Sofortangebot per AGB ausdrücklich nur an Unternehmer
(§ 14 BGB) verkauft, spricht viel dafür, dass es nicht greift, das ist aber
nicht abschließend anwaltlich bestätigt (Punkt 7.12).

Gute Nachricht nebenbei, unverändert: die Rechtstexte (Abschnitt 7) sind
deutlich weiter als ursprünglich vermutet (echter § 14 BGB-B2B-Ausschluss,
vollständige Auftragsverarbeiter-Liste). Neue Fortschritte seit dem letzten
Stand: Row-Level-Security ist jetzt bestätigt UND eine akute Lücke
(öffentlich lesbare Debug-Tabelle) wurde vom Platform & Integrations
Engineer sofort gefixt (Punkt 6.1). Erster Observability-Schritt ist
umgesetzt (Sentry im Kernpfad, Punkt 8.1).

---

## 1. Kernfunktion & QA — die Sprach-zu-Angebot-Pipeline

| # | Punkt | Gate | Status |
|---|---|---|---|
| 1.1 | Kernrechnungen tragen über breite Fallbasis (Richtwert ~100 statt 14) | G1 | 🔴 20 % — jetzt 15 von ~100 Fällen (PM-001–015), 7 davon komplett abgeschlossen und archiviert; neuer Fund PM-015 (leere Preisdatenbank bei „manuell"-Onboarding) zeigt weiter, dass die Fallbasis selbst der Engpass bleibt, nicht die Einzelfixes. Quelle: `docs/pruefmeister-testfaelle.md` |
| 1.2 | Abdeckung über beide Gewerke, Raumtypen, Sonderfälle, Verneinungen, Selbstkorrekturen | G1 | 🟡 50 % (CoS-Schätzung) — Fassade (kein Raum) jetzt mit eigenem Datenmodell abgedeckt (DC-024/PM-008), Fischgrät/Dehnungsfuge (PM-013) noch ungeprüft |
| 1.3 | Bestätigungskarte = Endberechnung (Karte-≠-Berechnung-Muster geschlossen) | G1 | 🔴 30 % — kleiner Fortschritt (DC-023-Fix lokal verifiziert, Wand-Chip zeigt jetzt „So gerechnet"-Zeile), aber Prüfmeister bestätigt ausdrücklich: der Kern-Vertrauensmechanismus hält weiterhin nicht durchgängig, was er verspricht (DC-021/022). Quelle: CoS-002 |
| 1.4 | Alle bestätigten Fälle als Golden Tests grün, kein Fix bricht still einen alten Fall | G1 | 🟡 70 % — Praxis weiter gefestigt (706/706 Tests nach jedem Fix bestätigt, u. a. heute bei CoS-010, DC-025), kein direkter CI-Dashboard-Zugriff |
| 1.5 | Zahlen-/Größenordnungsfehler ausgeschlossen (siehe PM-010: „drei fünfzig" → 350) | G2 | 🟡 40 % — bleibt als bewusste Design-Entscheidung stehen (Whisper-Ebene, Rechnung selbst korrekt, Warnung statt stiller Korrektur) |
| 1.6 | Neu erkannte Positionstypen haben hinterlegte Standardpreise | G1 | 🔴 20 % — weiterhin: Kniestock/Dachschräge/Fassadenfläche streichen, Übergangsschiene ohne Preis |
| 1.7 | KI-Grenzen/Fehlerrate den Nutzern gegenüber transparent kommuniziert (kein 100 %-Versprechen) | G2 | ⚪ offen — nicht erhoben (neu) |
| 1.8 | Lasttest: mehrere gleichzeitige Aufnahmen/Nutzer ohne Fehler | G2 | ⚪ offen — nicht erhoben (neu) |
| 1.9 | Bekannte Sprach-/Dialekt-/Störgeräusch-Grenzen dokumentiert | G3 | ⚪ offen — nicht erhoben (neu) |

## 2. Accounts & Onboarding

| # | Punkt | Gate | Status |
|---|---|---|---|
| 2.1 | Registrierung, Login, Logout laufen sauber durch — komplett | G1 | ⚪ offen — nicht erhoben. Jetzt CoS-P-003 beim Platform Engineer |
| 2.2 | E-Mail-Verifizierung wirklich zugestellt (nicht nur ausgelöst) | G1 | ⚪ offen — nicht erhoben |
| 2.3 | Passwort-Zurücksetzen funktioniert | G1 | ⚪ offen — nicht erhoben |
| 2.4 | Kompletter erster Durchlauf (erste Anmeldung → erstes Angebot) end-to-end | G1 | ⚪ offen — nicht erhoben |
| 2.5 | Account-Löschung möglich | G2 | 🟡 vermutlich vorhanden (Code existiert), kein QA-Test |
| 2.6 | Schutz vor automatisierten Massen-Registrierungen (Captcha/Rate-Limit) | G2 | ⚪ offen — nicht erhoben (neu) |
| 2.7 | Session-Sicherheit: Token-Ablauf sinnvoll, Logout wirklich überall wirksam | G1 | ⚪ offen — nicht erhoben (neu) |
| 2.8 | Erster Eindruck für brandneue Nutzer durchdacht (leere Zustände) | G1 | 🔴 20 % — DC-009 (leere Aufnahme als Erfolg) weiterhin offen, aber PM-015-Fix behebt einen konkreten, echten Fall: „manuell"-Onboarding landete bisher mit fast leerer Preisdatenbank |

## 3. Transaktions-E-Mails

| # | Punkt | Gate | Status |
|---|---|---|---|
| 3.1 | Pflicht-Mails werden wirklich versendet (Willkommen, Verifizierung, Reset) | G1 | ⚪ offen — nicht erhoben. Jetzt CoS-P-004 |
| 3.2 | Absender korrekt, Links funktionieren, Inhalt stimmt, landen nicht im Spam | G1 | ⚪ offen — nicht erhoben |
| 3.3 | Weitere Mails je nach Flow (Quittung/Rechnung, Angebot fertig) | G2 | ⚪ offen — nicht erhoben |
| 3.4 | SPF/DKIM/DMARC korrekt gesetzt (Zustellbarkeit, kein Spam-Ordner) | G1 | ⚪ offen — nicht erhoben (neu) |

## 4. Zahlung & Abrechnung (Stripe)

| # | Punkt | Gate | Status |
|---|---|---|---|
| 4.1 | Falls Testnutzer kostenlos starten: kein Zahlungsschritt blockiert sie | G1 | ⚪ offen — nicht erhoben |
| 4.2 | Checkout/Abo funktioniert, korrekte Preise, MwSt korrekt behandelt | G2 | ⚪ offen — nicht erhoben. Preis-Text selbst hängt an CoS-001 |
| 4.3 | Rechnungen werden erzeugt und sind korrekt | G2 | ⚪ offen — nicht erhoben |
| 4.4 | Fehlgeschlagene Zahlung und Kündigung sauber behandelt | G2 | ⚪ offen — nicht erhoben |
| 4.5 | Kündigungsbutton nach § 312k BGB leicht auffindbar und funktionsfähig (gesetzlich seit Juli 2022 Pflicht für Online-Verträge mit Verbrauchern; bei reinem B2B nicht zwingend, aber gute Praxis und ggf. bei Grenzfällen relevant) | G2 | ⚪ offen — nicht erhoben (neu) |
| 4.6 | Stripe live-scharf konfiguriert, kein Test-Modus-Rest, Webhook-Secret produktionsecht | G2 | ⚪ offen — nicht erhoben (neu) |
| 4.7 | Eigene Buchhaltung kann E-Rechnungen empfangen (seit 1.1.2025 Pflicht für alle inländischen Unternehmen, ohne Übergangsfrist für den Empfang) | G1 | ⚪ offen — nicht erhoben (neu). Quelle: [IHK Stuttgart, E-Rechnungspflicht B2B](https://www.ihk.de/stuttgart/fuer-unternehmen/recht-und-steuern/steuerrecht/steuermeldungen/e-rechnungen-5864496) |
| 4.8 | Missbrauchsschutz beim Free-Kontingent (Mehrfachkonten für Gratisnutzung) | G2 | ⚪ offen — nicht erhoben (neu) |

## 5. Navigation & UX-Integrität (mit Product Designer)

| # | Punkt | Gate | Status |
|---|---|---|---|
| 5.1 | Man kommt von überall leicht zurück/zur Startseite — keine Sackgassen | G1 | ⚪ offen — nicht erhoben |
| 5.2 | Jeder Button an sinnvoller Stelle, nichts Wichtiges fehlt/kaputt | G1 | 🟡 40 % — **DC-011 behoben + live bestätigt** (fertiges Angebot verschwand aus der Liste, betraf alle 56 Angebote in Produktion). Weiterhin offen: DC-002 (Nav fehlt), DC-009/010 (irreführende Erfolgs-Anzeige, fehlende Guardrail) |
| 5.3 | Funktioniert auf Handy UND Desktop | G1 | ⚪ offen — nicht erhoben |
| 5.4 | Leere/Fehler-/Ladezustände überall sinnvoll gestaltet | G2 | 🔴 10 % — DC-009/010 bestätigt: widersprüchliche Fehler-/Erfolgs-Banner gleichzeitig |
| 5.5 | Statusfarben & Design-Tokens konsistent | G2 | 🟡 30 % — siehe DC-003, DC-006, DC-007 |
| 5.6 | Barrierefreiheit (BFSG) bewusst geprüft statt nur angenommen | G3 | 🟢 60 % — wahrscheinlich nicht einschlägig (reines B2B, Verbraucher per AGB ausgeschlossen), rechtlich nicht abschließend bestätigt (neu). Quelle: [accessgo.de, BFSG B2B](https://www.accessgo.de/wissen/barrierefreiheitsstaerkungsgesetz/b2b/) |

## 6. Datenschutz & Datensicherheit (technisch)

| # | Punkt | Gate | Status |
|---|---|---|---|
| 6.1 | Nutzer sehen ausschließlich eigene Daten (Supabase RLS greift überall) | G1 | 🟢 95 % — **erledigt und geprüft, CoS-P-001**: 22 Tabellen + ~19 Umgehungsstellen direkt in Produktion geprüft, eine akute Lücke (`debug_extraktion_roh`, öffentlich ohne RLS) gefunden und sofort gefixt |
| 6.2 | Keine Secrets/Keys im Frontend oder in Logs sichtbar | G1 | ⚪ offen — nicht erhoben |
| 6.3 | Daten-Export und -Löschung für DSGVO-Anfragen umsetzbar | G2 | 🟡 vermutlich vorhanden (Code existiert), kein QA-Test |
| 6.4 | Supabase-Security-Advisor regelmäßig geprüft (nicht nur einmalig) | G1 | 🟡 60 % — seit 17.08. Teil des täglichen automatischen Chief-of-Staff-Checks, aber erst seit heute (neu) |
| 6.5 | Passwort-Sicherheit: „Leaked Password Protection" (HaveIBeenPwned-Abgleich) aktiv | G1 | 🔴 0 % — laut Supabase-Advisor aktuell **aus** (neu, bestätigter Fund) |
| 6.6 | Rate-Limiting/Brute-Force-Schutz auf dem Login | G1 | ⚪ offen — nicht erhoben (neu) |
| 6.7 | Externer Sicherheits-Review/Penetrationstest vor öffentlichem Launch | G2 | ⚪ offen — nicht erhoben (neu) |
| 6.8 | HTTPS/TLS überall erzwungen (inkl. HSTS) | G1 | 🟡 50 % — vermutlich durch Vercel-Standardkonfiguration gegeben, nicht explizit verifiziert (neu) |

## 7. Rechtstexte & Compliance

| # | Punkt | Gate | Status |
|---|---|---|---|
| 7.1 | Impressum vorhanden und korrekt | G1 | 🟢 90 % — verifiziert per Code-Einsicht (§5 TMG, Kontakt, Streitschlichtung, Haftung). Einzige Lücke: USt-ID hängt an Abschnitt 11 |
| 7.2 | Datenschutzerklärung vorhanden (inkl. eingesetzter Dienste) | G1 | 🟢 85 % — verifiziert per Code-Einsicht: vollständige Auftragsverarbeiter-Liste, Drittlandtransfer-Klausel (SCC + DPF) |
| 7.3 | AGB mit klarem B2B-Ausschluss vom Fernabsatzrecht | G1 | 🟢 90 % — verifiziert: expliziter § 14 BGB-B2B-Ausschluss |
| 7.4 | DSGVO-Verzeichnis von Verarbeitungstätigkeiten (intern) | G2 | ⚪ offen — nicht erhoben |
| 7.5 | AVV/DPAs mit Subprozessoren geklärt (OpenAI, Supabase, Stripe, Vercel) | G2 | 🟡 40 % — Datenschutzerklärung nennt AVV-Abdeckung, Details nicht einzeln geprüft |
| 7.6 | Cookie-/Consent-Banner, falls einwilligungspflichtige Dienste | G2 | ⚪ offen — nicht erhoben |
| 7.7 | Berufshaftpflicht für Softwareanbieter | G2 | ⚪ offen — nicht erhoben, Sandys Bereich |
| 7.8 | Marke „Sofortangebot" beim DPMA anmelden | G3 | ⚪ offen |
| 7.9 | ZUGFeRD-Pflicht ab 2027 für eigene Rechnungen | G3 | ⚪ offen |
| 7.10 | **EU AI Act Art. 50 — Transparenzpflicht KI-Interaktion (seit 2.8.2026 in Kraft, JETZT schon geltendes Recht)** | G1 | 🔴 0 % — offen, neu entdeckt. Nutzer müssen erkennen, dass Spracheingabe/-Extraktion durch KI läuft; günstig umsetzbar (Hinweistext). Bußgeldrahmen bis 15 Mio. €/3 % Jahresumsatz, praktisches Risiko für ein Startup dieser Größe eher gering, aber Pflicht ist aktiv. Quelle: [re.think Consulting](https://rethink.consulting/transparenzpflichten-nach-artikel-50-des-eu-ai-acts-alles-zur-kennzeichnungspflicht-fur-ki-inhalte-ab-august-2026/) |
| 7.11 | NIS2-Cybersicherheitspflichten geprüft | G3 | 🟢 85 % — **geprüft, aktuell nicht einschlägig** (Schwelle 50 Mitarbeitende/10 Mio. € Jahresumsatz in einem von 18 Sektoren, Sofortangebot deutlich darunter). Bei Wachstum erneut prüfen. Quelle: [secjur.com, NIS2 Umsetzung](https://www.secjur.com/blog/nis2-umsetzung) |
| 7.12 | Barrierefreiheitsstärkungsgesetz (BFSG) geprüft | G3 | 🟡 40 % — wahrscheinlich nicht einschlägig (B2B), nicht abschließend anwaltlich bestätigt, siehe 5.6 |
| 7.13 | KI-Anbieter-Nutzungsbedingungen eingehalten (OpenAI/Whisper), Kundendaten nicht ungewollt fürs KI-Training freigegeben | G1 | ⚪ offen — nicht erhoben (neu) |
| 7.14 | Haftungsregelung für KI-generierte Angebotsfehler in AGB explizit abgedeckt | G2 | ⚪ offen — nicht erhoben (neu) |

## 8. Technik, Betrieb & Zuverlässigkeit

| # | Punkt | Gate | Status |
|---|---|---|---|
| 8.1 | Observability: jede Pipeline-Stufe nachvollziehbar geloggt | G1 | 🟡 30 % — erster Schritt umgesetzt (CoS-P-002: Sentry meldet jetzt 8 Fehlerstellen im Kernpfad), Rest (Edge-Functions, ~27 weitere Stellen, 2 tote Logging-Spalten) noch offen |
| 8.2 | Race Condition ausgeschlossen (Summe stabil ohne Nutzeraktion) | G1 | 🟡 45 % — **wahrer Auslöser gefunden** (fehlender Doppel-Tap-Schutz auf „Fertigstellen", kein reines DB-Race), Fix drin, 706/706 Tests grün. Bewusst nicht auf höher gesetzt: Sandys Live-Nachtest (bewusst doppelt tippen) steht noch aus, und der Fix schließt kein DB-seitiges Unique-Constraint für echte Gleichzeitigkeit ein. Höchste Priorität bis zur Bestätigung, CoS-010 |
| 8.3 | Backups eingerichtet und einmal ein Restore getestet | G2 | 🟡 65 % — tägliches verschlüsseltes Backup läuft produktiv, Restore-Prozess definiert, aber kein protokollierter Restore-Test-Durchlauf sichtbar |
| 8.4 | Fehler-Monitoring: du merkst, wenn im Betrieb etwas bricht | G2 | 🔴 20 % — Health-Checks (`/api/health*`) und Kosten-Alarm existieren und funktionieren, aber Sentry deckt bisher nur den Kernpfad ab |
| 8.5 | OpenAI-Kosten pro Angebot bekannt und tragbar; Rate-Limits bedacht | G2 | ⚪ offen — nicht erhoben |
| 8.6 | Domain, SSL, Hosting-Konfiguration sauber | G2 | 🟡 50 % — läuft auf `www.sofortangebot.app` über Vercel, kein separater Sicherheitscheck dokumentiert |
| 8.7 | Verlässliche Kette Code-Fix → Deploy → tatsächlich live | G1 | 🟢 80 % — **Entwarnung**: der Verdacht auf eine Deploy-Lücke hat sich nicht bestätigt, Head of Product Engineering hat die echte Ursache (Testmethodik) direkt an Produktionsdaten nachgewiesen — die Kette selbst ist zuverlässig |
| 8.8 | Status-Seite für Nutzer (zeigt Verfügbarkeit) | G2 | ⚪ offen — nicht erhoben (neu) |
| 8.9 | Eskalationsweg bei Ausfall definiert (wer wird wann wie alarmiert) | G1 | ⚪ offen — nicht erhoben (neu) |
| 8.10 | Kostenbudget-Alarme (OpenAI/Vercel/Supabase) gegen Kostenexplosion | G1 | 🟡 40 % — Kostenalarm bei ungewöhnlich hohen KI-Kosten eines Nutzers existiert bereits (CoS-P-002), projektweite Budget-Alarme offen |
| 8.11 | Rollback-Plan bei fehlerhaftem Deployment | G1 | ⚪ offen — nicht erhoben (neu) |
| 8.12 | Automatisierte Abhängigkeits-/Sicherheitslücken-Scans (z. B. Dependabot) | G2 | ⚪ offen — nicht erhoben (neu) |

## 9. Inhalte & Landingpage

| # | Punkt | Gate | Status |
|---|---|---|---|
| 9.1 | Landingpage erklärt klar, was das Tool tut und für wen | G1 | ⚪ offen — nicht erhoben |
| 9.2 | Preis-/Gewerke-Text final | G1 | 🟢 80 % — Entscheidung umgesetzt: Landingpage, Upgrade-Dialog, `/vorschau` (leitet jetzt weiter) und zentrale `pricing.ts` fertig. Nicht auf 100 %, weil noch niemand im Browser draufgeschaut hat. CoS-001 |
| 9.3 | In-App-Wording durchgängig klar und menschlich | G2 | ⚪ offen — nicht erhoben |
| 9.4 | Preisseite verständlich | G2 | ⚪ offen — nicht erhoben |
| 9.5 | SEO-Grundlagen (Meta-Tags, Sitemap, robots.txt, Ladezeit) | G3 | ⚪ offen — nicht erhoben (neu) |
| 9.6 | Social-Media-Vorschaubilder (Open-Graph) | G3 | ⚪ offen — nicht erhoben (neu) |

## 10. Support & Notfall

| # | Punkt | Gate | Status |
|---|---|---|---|
| 10.1 | Klarer Kanal für Testnutzer-Feedback/Bugs | G1 | ⚪ offen — nicht erhoben |
| 10.2 | Notfallplan, wenn Sandy nicht verfügbar ist | G1 | ⚪ offen — nicht erhoben |
| 10.3 | Kurze Hilfe/FAQ für häufigste Fragen | G2 | ⚪ offen — nicht erhoben |
| 10.4 | Reaktionszeit-Erwartung an Testnutzer kommuniziert (auch informell reicht) | G1 | ⚪ offen — nicht erhoben (neu) |
| 10.5 | Bekannte-Probleme-Liste für Testnutzer einsehbar (Transparenz schafft Vertrauen) | G2 | ⚪ offen — nicht erhoben (neu) |

## 11. Business & Steuer

| # | Punkt | Gate | Status |
|---|---|---|---|
| 11.1 | Kleinunternehmergrenze (25.000 €) im Blick, steuerliche Anmeldung abgeschlossen | G2 | ⚪ offen — Sandys Bereich. Hängt mit 7.1 zusammen (USt-ID noch offen) |
| 11.2 | Separate EÜR für Sofortangebot-Einnahmen | G2 | ⚪ offen — Sandys Bereich |
| 11.3 | Gewerbeanmeldung | — | ✅ erledigt (Sandy) |
| 11.4 | Geschäftskonto getrennt von privat | G1 | ⚪ offen — nicht erhoben, Sandys Bereich (neu) |
| 11.5 | Buchhaltungssystem angebunden (Lexware/sevDesk) | G2 | ⚪ offen — nicht erhoben, jetzt Platform-Engineer-Scope (neu) |

## 12. Go-to-Market (nach der Entwicklungsphase)

| # | Punkt | Gate | Status |
|---|---|---|---|
| 12.1 | Erste Nutzer-Gewinnung | G3 | ⚪ offen |
| 12.2 | Feedback-Schleife mit ersten echten Nutzern | G3 | ⚪ offen |
| 12.3 | Rollen Social Media/Content und Legal Advice besetzen | G3 | ⚪ offen |
| 12.4 | Messbare „Gate-2-bereit"-Kriterien festgelegt statt Bauchgefühl | G2 | ⚪ offen — nicht erhoben (neu) |

## 13. Tag X — der Moment, an dem der erste echte Testnutzer live geht

Neuer Bereich (17.08.2026): kein technischer Punkt wie oben, sondern eine
kleine Checkliste für den konkreten Tag selbst — extra wichtig, weil das
Sandys allererster Launch überhaupt ist.

| # | Punkt | Gate | Status |
|---|---|---|---|
| 13.1 | Sandy ist an dem Tag wirklich erreichbar/eingeplant, kein Vollzeit-Termin parallel | G1 | ⚪ offen — nicht erhoben |
| 13.2 | Rollback/Notausschalter bereit, falls in den ersten Stunden etwas kracht | G1 | ⚪ offen — nicht erhoben |
| 13.3 | Erste 24–48 Stunden aktiv beobachtet (nicht nur „läuft schon irgendwie") | G1 | ⚪ offen — nicht erhoben |
| 13.4 | Nach dem ersten echten Nutzer: kurze Manöverkritik dokumentiert (was lief gut/schlecht) | G1 | ⚪ offen — nicht erhoben |

---

*Diese Liste ist eine Grundlage, kein Gesetz — Chief of Staff ergänzt fehlende
Bereiche und justiert Gate-Zuordnungen, wenn fachlich sinnvoller, und meldet
das jeweils an Sandy. Vollständigkeit hat Vorrang, damit vor dem Launch
nichts durchrutscht. Diese Erweiterung (17.08.2026) ist die erste
Vollständigkeits-Runde auf Sandys ausdrücklichen Wunsch — weitere Lücken
werden ergänzt, sobald sie auffallen, nicht erst beim nächsten großen
Rundumschlag.*
