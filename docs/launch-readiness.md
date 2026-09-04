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

## Gate-Fortschritt (Stand 03.09.2026)

| Gate | Fortschritt | Punkte |
|---|---|---|
| **Gate 1** — erste Testnutzer | **≈ 48,5 %** (Neuberechnung 03.09. Abend, Stufe 1 UND Stufe 3 des Fahrplans komplett abgearbeitet) | 47 |
| **Gate 2** — öffentlicher Launch | **≈ 16,2 %** (04.09.: 2.5 und 6.3 durch CRON_SECRET-Fix bewegt, siehe unten) | 37 |
| **Gate 3** — danach/Skalierung | **17 %** (unverändert, keine neue G3-Bewegung) | 11 |

Rechenweg unverändert: jeder Punkt 0–100 nach der jeweiligen Heimat-Quelle,
0 = „offen, nicht erhoben" ist ein legitimer Wert. Ungewichteter Durchschnitt.

> ✅ **Update 04.09.2026, morgens (Chief of Staff) — CRON_SECRET-Fix live
> bestätigt, auf Sandys direkte Nachfrage.** Zwei G2-Punkte bewegt: **2.5
> Account-Löschung (55→85)** und **6.3 DSGVO-Export/-Löschung (55→70)** —
> beide hingen an derselben Cronjob-Zuverlässigkeit, die seit 02./03.09. als
> Verdacht („vermutlich fehlt CRON_SECRET") im Raum stand. Geprüft nicht nur
> per HTTP-Status, sondern direkt in der `system_laeufe`-Tabelle: der
> Aufräum-Job lief heute 03:30 Uhr zum ersten Mal überhaupt (`ok: true`) und
> hat den seit Juli aufgelaufenen Rückstand sofort mitgeräumt (182 verwaiste
> Sprachaufnahmen, 1 Foto). Der Erinnerungs-Job lief gestern 08:01 Uhr
> ebenfalls sauber (2 Erinnerungen verschickt). Nicht auf 100 %, weil die
> eigentliche 30-Tage-Konto-Löschung mangels fälliger Konten noch keinen
> echten Testfall hatte — reine Wartezeit. Gate 2 damit von ≈15 % auf
> ≈16,2 % (Δ = (30+15)/37 Punkte).

> ✅ **Neuberechnung 03.09.2026 (Chief of Staff).** Sechs Punkte bewegt: **6.5
> Leaked Password Protection (0→95)** — Sandy hat den Toggle in Supabase
> aktiviert, per Screenshot bestätigt und zusätzlich unabhängig über den
> Supabase-Security-Advisor gegengecheckt (Warnung ist weg); **6.8
> HTTPS/HSTS (50→97)** — CoS-037: Header lief erst live ohne
> `includeSubDomains`/`preload` (→90 %), Head of Product Engineering hat
> beides direkt per `next.config.ts`-Fix nachgezogen, Chief of Staff hat den
> neuen Header live gegen `www.sofortangebot.app` bestätigt; die Eintragung
> bei `hstspreload.org` selbst bleibt auf Sandys Entscheidung zurückgestellt
> (siehe `entscheidungen-fuer-sandy.md`), bewusst kein offener Rest. Dazu vier
> der fünf Doku-/Entscheidungspunkte aus Stufe 1 des Fahrplans, alle heute per
> `AskUserQuestion` mit Sandy geklärt: **10.1 Feedback-Kanal (0→85)** —
> WhatsApp direkt an Sandy; **10.4 Reaktionszeit (0→80)** — „meist binnen
> 24 Stunden"; **8.9 Eskalationsweg (0→85)** und **8.11 Rollback-Plan
> (0→85)** — beide zusammen entschieden (Sentry-Alert + manuelles Rollback),
> und beide Mechanismen liefen bei näherer Prüfung schon: Sentrys
> Standard-Regel „Send a notification for high priority issues" mailt aktive
> Mitglieder bereits automatisch, Vercels `rollback`/„Promote to Production"
> ist eine eingebaute Pro-Plan-Funktion. **10.2 Notfallplan (0→45)** bewegt
> sich schwächer — die gewählte automatische WhatsApp-Antwort ist noch nicht
> eingerichtet, Aktion an Sandy in `entscheidungen-fuer-sandy.md`.
> Durchschnitt: 36,0 % → 47,1 %.

> ✅ **Zweites Update, selber Tag (Chief of Staff).** Sandys Antworten auf die
> beiden offenen Rückfragen: **10.2 Notfallplan (45→80)** — Feedback-Kanal
> ist ihre private WhatsApp-Nummer, keine WhatsApp Business, also fällt eine
> technische Abwesenheits-Antwort weg. Plan angepasst: eine einmalige
> Willkommensnachricht an jeden neuen Testnutzer deckt 10.2 und 10.4
> gemeinsam ab, fertiger Text unten in Stufe 1. **8.9 Eskalationsweg
> (85→90)** — Sandy checkt ihr Sentry-Postfach aktuell noch nicht, hat aber
> zugesagt, das ab Gate 1 zu tun; genau der Zeitraum, in dem der Punkt zählt.
> **10.4 (80→85)**, da der Reaktionszeit-Text jetzt fertig formuliert vorliegt,
> nicht mehr nur entschieden. Durchschnitt: 47,1 % → 48,1 %. Damit ist Stufe 1
> des Fahrplans (unten) komplett abgearbeitet.

## Fahrplan zu 50 % Gate 1 (Chief of Staff, 03.09.2026)

Sandy hat gefragt, was konkret zu tun ist, um über die 50-%-Marke zu kommen.
Durchgerechnet: aktuell 36,0 % im Schnitt über 47 Punkte, für 50 % müsste der
Durchschnitt um 14 Prozentpunkte steigen — kein einzelner Fix schafft das,
aber ein konkreter Stapel aus größtenteils günstigen Einzelpunkten kommt
rechnerisch drüber (Ziel-Szenario unten: ≈ 51 %).

**Stufe 1 — quasi ohne Aufwand, reine Konfiguration/Doku, kein Code:**
~~„Leaked Password Protection" in Supabase einschalten (6.5, ein Klick,
0→~95 %, größter Einzelhebel im Gate)~~ **✅ erledigt, 03.09.**; ~~HTTPS/HSTS
kurz verifizieren (6.8)~~ **✅ erledigt, 03.09. (vom Chief of Staff selbst
geprüft)**; ~~Feedback-Kanal für Testnutzer festlegen (10.1)~~ **✅
entschieden, 03.09. (WhatsApp direkt an Sandy)**; ~~Reaktionszeit-Erwartung
kommunizieren (10.4)~~ **✅ entschieden, 03.09. (meist binnen 24h)**;
~~Eskalationsweg bei Ausfall (8.9)~~ **✅ entschieden, 03.09. (Sentry-Alert,
läuft bereits automatisch, Sandy checkt aktiv ab Gate 1)**; ~~kurzer
Rollback-Plan (8.11)~~ **✅ entschieden, 03.09. (Vercel-Rollback, eingebaute
Funktion)**; ~~Notfallplan falls Sandy nicht erreichbar ist (10.2)~~ **✅
erledigt, 03.09.** — Sandy nutzt privates WhatsApp statt WhatsApp Business,
technische Abwesenheits-Antwort fällt damit weg. Stattdessen: eine einmalige
Willkommensnachricht pro neuem Testnutzer, deckt 10.2 und 10.4 zusammen ab,
fertig formuliert:

> *„Hey! Danke, dass du sofortangebot testest. Bei Fragen, Bugs oder Ideen
> meld dich einfach direkt hier. Ich antworte meist innerhalb von 24 Stunden
> — falls's mal länger dauert, bin ich trotzdem dran und lese alles."*

**Damit ist Stufe 1 komplett** — kein offener Punkt mehr in dieser Stufe.

> ✅ **Update 03.09.2026, Abend (Chief of Staff) — Stufe 3 abgeschlossen,
> live gegengeprüft.** Sandy fragte direkt nach, ob 7.1/7.2 schon durch
> sind. Ergebnis: ja, beide waren es bereits — Head of Product Engineering
> hatte sie am 02.09. umgesetzt, Head of Legal hatte sie freigegeben, ich
> habe zusätzlich beide Live-Seiten direkt abgerufen (`/impressum` und
> `/datenschutz`) statt der Erledigt-Meldung blind zu vertrauen. **7.1
> (84→96):** vollständig live, einziger Rest ist die USt-ID (hängt an
> 11.1, nicht an Legal). **7.2 (78→85):** der ursprünglich gescopte Fix ist
> live; zwei zusätzliche Funde von Head of Legal (Stripe-Vertragspartner,
> Kundendaten-Formulierung) sind code-fertig und getestet, aber bewusst
> noch nicht deployed — Rechtstexte gehen laut Team-Regel nur mit Sandys
> Freigabe raus. Gate 1 damit von 48,1 % auf 48,5 % (Δ = (12+7)/47 Punkte).
> **Neuer Nebenfund, bisher nirgends dokumentiert:** Head of Legal ist beim
> Stripe-Check zufällig aufgefallen, dass das Stripe-Konto noch nicht
> aktiviert ist (`charges_enabled: false` u. a.) — von mir per direkter
> Kontoabfrage bestätigt und jetzt unter 4.6 (G2, kein Gate-1-Blocker)
> dokumentiert.

**Stufe 2 — ein Nachmittag „wirklich benutzen", vieles ist längst gebaut,
nur nicht live bestätigt:** Sandy: echte Registrierung + Bestätigungsmail
abwarten (2.2), Passwort-Reset komplett durchklicken (2.3), Zustellung der
drei Pflicht-Mails prüfen inkl. Spam-Ordner (3.1/3.2/3.4). Prüfmeister:
mehrere Angebote live durchsprechen für neue Preise (1.6),
Registrierung/Login (2.1), die vier UI-Fixes vom 29.08 (5.2), den
KI-Hinweis vor dem Versenden (7.10), die Übermessungsregel im PDF (1.2) —
plus den ohnehin fälligen VOB-013-Nachtest (1.1, kleinerer Bump, da die
Fallbasis der eigentliche Flaschenhals bleibt).

**Stufe 3 — zwei kleine, fertig gescopte Legal-Fixes, je ~30 Min (Head of
Legal):** ~~Impressum — toten EU-Streitschlichtungs-Absatz raus, veraltete
Gesetzesverweise aktualisieren (7.1)~~ **✅ erledigt UND live, 02.09./
bestätigt 03.09.**; ~~Datenschutzerklärung — OpenAI und Sentry als
Auftragsverarbeiter ergänzen (7.2)~~ **✅ erledigt UND live, 02.09./bestätigt
03.09.** — beide waren tatsächlich schon vor Sandys Nachfrage fertig, Head
of Product Engineering hatte sie am 02.09. umgesetzt. **Damit ist Stufe 3
komplett.** Nebenbei hat Head of Legal beim Gegenchecken zwei weitere,
kleinere Ungenauigkeiten in der Datenschutzerklärung gefunden und
korrigiert (Stripe-Vertragspartner, Kundendaten-Formulierung) — die sind
code-fertig und getestet, aber noch nicht deployed, siehe 7.2 oben und
`entscheidungen-fuer-sandy.md`.

**Bewusst NICHT auf dieser Liste, weil kein Quick-Win:** 1.1 bleibt trotz
VOB-013-Fix strukturell begrenzt (28 von angestrebten ~100 Testfällen,
Prüfmeisters langsamste Baustelle); 11.4 (Geschäftskonto trennen) und 11.5
(Buchhaltungsanbindung) sind eigene, echte Aufgaben; 6.6 (Rate-Limiting
Login), 7.13 (KI-Nutzungsbedingungen-Check) und 9.1 (Landingpage) brauchen
echte Arbeit, keine Formsache.

> ✅ **Zweite Neuberechnung heute (Chief of Staff, 02.09.2026, Abend).** Seit
> der Neuberechnung heute Mittag ist an einem Tag ungewöhnlich viel passiert
> — vier weitere G1-Punkte bewegt: **7.10 EU-AI-Act-Hinweis (65→72)** — der
> R3-Hinweis war vormittags nur als „gesehen, gilt als gebaut" im
> Chief-of-Staff-Kanal vermerkt, jetzt per echtem Code-Commit (`353f5dd`)
> bestätigt; **1.2 Abdeckung (72→76)** — der Übermessungshinweis steht jetzt
> wirklich live im Kunden-PDF (Fußnote + Sammelerklärung), nicht mehr nur
> code-fertig — damit ist Legals einziger 🔴-Befund aus der Risikobewertung
> (LR-01) geschlossen; **2.1 Registrierung (55→62)** — eine eigene
> Pflicht-Checkbox „Ich melde mich als Unternehmer an (§14 BGB)", getrennt
> von der AGB-Zustimmung, ist jetzt sowohl im Frontend als auch serverseitig
> bestätigt (G4, komplett); **6.2 Secrets-Hygiene (15→25)** — Sandy hat
> bestätigt, dass Groq im Produkt nirgends verwendet wird (nur OpenAI ist im
> Einsatz), damit ist das praktische Risiko kleiner als zunächst angenommen;
> ob am Groq-Konto selbst eine Zahlungsmethode hinterlegt ist, ist weiterhin
> nicht verifiziert, und der Schlüssel ist weiterhin nicht widerrufen
> (optionale Formsache, deshalb nicht höher bewertet).
> **Update 03.09.2026 (Chief of Staff, per Code-Prüfung bestätigt):** VOB-013
> ist gefixt. Head of Product Engineering hat `leibungsUmfang` von
> `2×br + 2×hoe` auf `br + 2×hoe` korrigiert (Commit `330743f`), die
> Fensterbank-Doppelzählung ist als Nebeneffekt mitgelöst (Bank wird jetzt
> genau einmal gezählt, nicht mehr versteckt im Umfang UND als eigene
> Position). Abgesichert durch 8 dedizierte Unit-Tests
> (`vob013-leibungen.test.ts`) — von mir per Hand nachgerechnet, Zahlen
> stimmen (Standardfenster 1,10→0,80 m², Tür 1,50→1,27 m²). **Noch nicht
> „live bestätigt" im Sinne dieser Datei:** Prüfmeister hat den konkreten
> Nachtest (3 Fenster 1,20×1,00 m, 25 cm tief → muss 2,40 m² ergeben) noch
> nicht live gegen das Tool gesprochen — bis das steht, zählt der Punkt als
> code-fertig, nicht als voll verifiziert. Legal stuft es weiterhin als den
> schwerwiegendsten Einzelfund im Projekt ein (Risikobewertung LR-13); mit
> dem Fix ist das Risiko jetzt behoben, nicht mehr nur benannt. **Neu
> entdeckt, noch nicht in eine Prozentzahl gefasst:** VOB-012
> (Türbreiten-Abzug bei Sockelleisten) taucht inzwischen in praktisch jeder
> Prüfmeister-Soll-Lösung als offene Variable auf — eine weitere
> Preis-Entscheidung, die nur Sandy treffen kann, siehe
> `entscheidungen-fuer-sandy.md`.

> ✅ **Echte Neuberechnung (Chief of Staff, 02.09.2026), keine Schätzung.**
> Alle 94 Einzelpunkte gegen den aktuellen Stand aller Heimat-Dateien
> abgeglichen (Sandys Wunsch: „berechne neu", nachdem die letzte vollständige
> Neuberechnung vom 20.08. stammte und die 33 %/13 %/17 % seit dem 31.08. nur
> hochgerechnet, nicht neu gerechnet waren). Acht G1-Punkte und vier
> G2-Punkte bewegt, ein neuer G2-Punkt ergänzt (**7.15**, AI-Act-
> Kompetenzpflicht, von Legal neu identifiziert). Größte Einzelbewegungen:
> **7.10 EU-AI-Act-Transparenzpflicht (0→65)** — der in-App-KI-Hinweis (R3)
> ist gebaut, das war der bisher schwerwiegendste offene Rechtsfund im
> ganzen Projekt; **1.6 Standardpreise (65→78)** — 21-Positionen-
> Katalog-Lücke geschlossen (CoS-028); **1.1 Fallbasis (38→42)** und **1.2
> Abdeckung (68→72)** — Prüfmeister hat jetzt für alle 28 Testfälle eine
> eindeutige Soll-Lösung, dabei aber einen neuen echten Rechenfehler
> gefunden (VOB-013, Fensterlaibung ~33 % zu groß, noch nicht gefixt — siehe
> Warnhinweis bei 1.1). Zwei Punkte bewusst nach unten korrigiert, weil sie
> vorher „nicht erhoben" waren und jetzt echt (negativ) geprüft sind, nicht
> weil etwas kaputtging: **6.2 Secrets-Hygiene (0→15)** — ein Groq-API-Key
> wurde ungefiltert im Chat ausgegeben, muss widerrufen werden; **7.14
> KI-Haftungsklausel (0→20)** — Legal hat die bestehende AGB-Klausel §9.3
> geprüft und für nach §307 BGB wahrscheinlich vollständig unwirksam
> befunden. Details je Punkt unten in den Tabellen. Trotz der sichtbaren
> Bewegung bleibt der Grundsatz: „code-fertig" zählt weiterhin nicht wie
> „live bestätigt" — die meisten der oben genannten Fixes warten noch auf
> einen echten Nachtest.

> ⚠ **Punkte-Verschiebung (Chief of Staff, 31.08.2026):** Sandy hat 11.5
> (Buchhaltungssystem-Anbindung Lexware/sevDesk) von G2 auf G1 hochgestuft
> — Details siehe Zeile 11.5 unten und `entscheidungen-fuer-sandy.md`. Der
> Punkt selbst steht bei 0 % (offen), verschiebt sich also nur zwischen den
> Nennern: Gate 1 47 statt 46 Punkte, Gate 2 36 statt 37. Die neuen
> Prozentzahlen (≈ 33 % / ≈ 13 %) sind aus den zuletzt gerundeten Werten
> hochgerechnet (34 %×46÷47 bzw. 13 %×37÷36), **keine frische
> Einzelpunkt-Neuberechnung** — nächste vollständige Neuberechnung sollte
> das auf die exakte Zahl trüben.

> ⚠ **Korrektur-Hinweis (Chief of Staff, 25.08.2026):** Der zuletzt hier
> gezeigte Stand „25 %" war stehengeblieben — mein eigenes Update vom
> 24.08. (das die Rechnung von damals bereits auf 31 % gebracht hätte) ist
> durch einen technischen Zwischenfall nie tatsächlich in dieser Datei
> angekommen, obwohl es als erfolgreich gemeldet wurde. Dabei ist außerdem
> aufgefallen: Platform & Integrations Engineer hatte direkt in dieser
> Datei eigenen Fließtext für 2.1/2.2/2.3/3.1/3.2/3.4 hinterlegt, teils
> ohne Prozentzahl, teils mit einer inzwischen überholten Aussage (z. B.
> „Bug behoben" bei 2.3, obwohl der Passwort-Reset-Bug laut
> `chief-of-staff-platform-todos.md` weiterhin NICHT gefixt ist). Nach der
> Ein-Wahrheit-pro-Sache-Regel wurde das jetzt anhand der echten Heimat-
> Datei korrigiert, siehe die einzelnen Zeilen unten.

> ⚠ **Zweiter Korrektur-Hinweis (Chief of Staff, 29.08.2026):** Beim
> heutigen Nachschauen kam heraus, dass ich selbst hier ebenfalls hinter
> der Wahrheit hergehinkt bin — und das mehrere Tage lang. `chief-of-
> staff-platform-todos.md` verzeichnet schon seit dem 25.08. (Sandys
> direkten Freigaben „003 ja bitte direkt reparieren" und „004 bitte b)")
> **beide Fixes als umgesetzt**: der Passwort-Reset-Bug (CoS-P-003) läuft
> jetzt über den korrekten PKCE-Tausch, und alle drei Pflicht-Mails
> (CoS-P-004) laufen über die eigene Resend-Anbindung. Ich hatte den
> Passwort-Reset-Bug mehrere Tage lang gegenüber Sandy fälschlich als
> „weiterhin ungefixt, wichtigster offener Sicherheitsfund" bezeichnet,
> obwohl der Fix längst dokumentiert war — reiner Lesefehler meinerseits,
> keine neue Information. Punkte 2.2/2.3/3.1 unten sind jetzt korrigiert.
> Verbleibend, und das kann tatsächlich niemand aus einer Session heraus
> erledigen: ein echter Klick-Durchlauf mit echtem Postfach — Sandys
> Aufgabe, keine Kollegen-Aufgabe mehr. Außerdem hat sich das reale Datum
> in der Zwischenzeit auf 29.08. bewegt (vier Tage, in denen ich nicht neu
> gerechnet hatte) — Details dazu im „Update 29.08.2026" unten.

**Update 29.08.2026 — Nachtrag der ausstehenden PKCE-/Mail-Korrektur, ein
neuer Design-Fund (DC-035), CoS-022/DC-033 als „behoben" bestätigt.**

- **2.2/2.3/3.1 korrigiert** (siehe Zeilen unten und zweiter
  Korrektur-Hinweis oben): +25/+45/+25 Prozentpunkte auf den jeweiligen
  Einzelpunkt.
- **DC-033/CoS-022 von Head of Product Engineering als „🟡 behoben"
  bestätigt** (25.08., in `design-check.md` nachgezogen): Nummer wird
  jetzt beim Fertigstellen vergeben, verschluckte RPC-Fehler sind jetzt
  sichtbar geloggt. Live-Nachtest und Sandys Entscheidung zu den 4
  Alt-Angeboten weiterhin offen (siehe `entscheidungen-fuer-sandy.md`).
- **Neu: DC-035 (Sandy, 29.08., beim Einsprechen selbst aufgefallen).**
  Zwei Funde: (1) die Karten-Ansicht zeigt Flächen, bevor feststeht, ob
  noch Fenster/Türen fehlen — wirkt wie das fertige Ergebnis, ist es aber
  nicht immer. Teil 1 (Hinweistext „Flächen sind vorläufig…") ist bereits
  umgesetzt und committet, Live-Test steht aus. (2) Die Rückfrage zu
  Türen/Fenstern erlaubt keine individuelle Größenangabe (z. B. große
  Terrassentür) — nur Standardmaße. Product Designer hat das Datenmodell
  bereits als bereit befunden (keine Änderung nötig) und eine fertige
  Umsetzungs-Spec an Head of Product Engineering übergeben. Fließt noch
  nicht in eine eigene Prozentzahl ein, siehe `design-check.md` DC-035.

**Update 29.08.2026, Teil 2 — vollständiger Nachtrag nach Sandys „schau dir
ALLES an": sechs weitere neue Design-Punkte (DC-036–DC-041) gefunden, die
weder hier noch in `chief-of-staff-todos.md` verzeichnet waren.** Sandy
hatte nach der PKCE-Korrektur ausdrücklich einen vollständigen Sync
angefordert. Ergebnis (volle Details in `design-check.md`, neue Sammel-
Ticket **CoS-024** in `chief-of-staff-todos.md`):

- **DC-036** (Reiter „Raumform" → „📐 Unregelmäßig" umbenannt, Grundriss-
  Zeichner für Nischen war nur schlecht auffindbar): ✅ committet, Live-Test
  aus. Kosmetisch, keine eigene Prozentzahl.
- **DC-037** (Sandys Folgeidee: Grundriss-Zeichner schon während der
  Aufnahme anbieten): **einziges der sechs Items, das noch NICHT gebaut
  ist** — fertige Spec an Head of Product Engineering übergeben, Backend-
  Teil (Merge-Konflikt mit der bestehenden KI-Extraktion, die `raum_details`
  sonst überschreiben würde) noch nicht begonnen.
- **DC-038** (Kritik am Grundriss-Zeichner: keine Wandnummern, nur 3
  Vorlagen): ✅ beide Teile umgesetzt (Wandnummern + neues „frei zeichnen"),
  → **1.2 (+3), 5.2 (siehe dort)**.
- **DC-039** („+ Position" Live-Suche gegen Preisdatenbank + abgesicherter
  Schreib-Endpunkt, dabei Tap-Bug und einen alten `price_item_id`-Bug
  gefunden+gefixt): ✅ beide Teile umgesetzt → **1.6 (+10), 5.2**.
- **DC-040** („Wohnung als Ganzes" statt zwingend pro Raum, Clemens'
  Rückmeldung über Sandy): ✅ Extraktion + Anzeige umgesetzt, **aber
  Prompt-Änderung — automatisierte Tests prüfen nur die Regel, kein Ersatz
  für einen echten Live-Test mit echter Sprachaufnahme** → **1.2 (+3,
  gemeinsam mit DC-038 gewertet)**. Nebenbei einen echten Bug gefunden+
  gefixt: die 200-m²-Plausibilitätsgrenze hätte eine echte
  Wohnungs-Wandfläche verworfen.
- **DC-041** (Raum-Platzhalter zeigte den literalen Text „— Schlafzimmer"
  im Titelfeld statt eines leeren Felds): ✅ committet, reiner Frontend-Fix
  → **5.2**.
- **Neue offene Entscheidung (DC-040-Folgefrage, bereits in
  `entscheidungen-fuer-sandy.md`):** soll die „schon ohne Fenster/Türen?"-
  Rückfrage auch bei EINZELNEN Räumen kommen, nicht nur bei ganzen
  Wohnungen? Hängt mit der offenen CoS-020-Frage zusammen, am besten
  zusammen entschieden.

> ⚠ **Governance-Hinweis (Chief of Staff, 29.08.):** Zwei Kleinigkeiten aus
> `design-check.md`, nicht selbst korrigiert (nicht meine Heimat-Datei):
> (1) DC-033s eigene Abschnitts-Kopfzeile sagt noch „❌ offen", obwohl der
> darunterstehende Fix-Update-Text und die Zusammenfassungstabelle „🟡
> behoben" sagen — für die Bewertung wurde wie immer der neuere Inhalt
> verwendet, nicht die veraltete Kopfzeile. (2) Bei DC-035 Teil 2 und
> DC-038 Teil 1 ist laut Formulierung nicht ganz eindeutig, ob der Commit
> schon durch ist oder noch an einem Git-Lock hängt („sobald der Lock
> freigegeben ist") — für Gate 1 hier als „code-fertig" gewertet, aber
> beim Live-Test-Termin lohnt sich ein kurzer Blick, ob der Commit
> tatsächlich gelandet ist.
>
> Zusätzlich: ein Wegwerf-Testangebot (Nr. 2026-493C, leer, 0 €, Status
> „Fertiggestellt") steht laut Product Designer weiterhin in der
> Produktions-Datenbank und wartet auf manuelle Löschung durch Sandy —
> kein Kollege räumt das automatisch weg.
>
> **Effekt auf Gate 1:** trotz sechs neuer, echter Fortschritte bleibt die
> Gate-1-Zahl bei **34 %** — die Einzelbewegungen (1.2 +3, 1.6 +10, 5.2 +8)
> sind über 46 Punkte verteilt zu klein, um die gerundete Gesamtzahl zu
> bewegen. Echter Fortschritt, der in der einen großen Zahl nicht sichtbar
> wird — deshalb stehen die Einzelheiten hier ausführlich.

**Update 25.08.2026, Abend — Tagesabschluss: großer QA-Meilenstein (praktisch
der komplette Testfall-Rückstand live bestätigt) plus zwei abgeschlossene
Tickets (CoS-021, CoS-022), UND CoS-002 endgültig geschlossen.**

- **1.3 Bestätigungskarte (80→95): CoS-002 endgültig abgeschlossen.** Sandy
  hat heute live „Wohnzimmer streichen, 3x4 Meter" erneut getestet —
  „Boden schützen" zeigt jetzt korrekt 12 m², der Realtime-Fix hält. Beim
  Nachschauen kam heraus: Product Designer hatte diese Bestätigung
  eigentlich schon am 23.08. in `design-check.md` (DC-021, „dc021 passt")
  festgehalten — das war hier nur nie übernommen worden (eigener
  Sync-Fehler, nicht Product Designers). Damit ist CoS-002 nach fünf Tagen
  „Live-Nachtest steht aus" tatsächlich fertig, mit zwei unabhängigen
  Bestätigungen.
- **Größte Einzelbewegung sonst: 1.1 Fallbasis (30→38) und 1.2 Abdeckung (60→65).**
  Praktisch der gesamte QA-Rückstand ist heute live durchgetestet worden —
  von den 21 geplanten Testfällen (PM-001–021) steht keiner mehr auf
  „code-fertig, Nachtest offen"; nur noch PM-014 (gezielter
  Gleichzeitigkeits-Test) und PM-015 (praktisch erledigt, formal 🟡) sind
  nicht vollständig grün. Dazu ein echter neuer Sicherheits-Mechanismus:
  Whisper verhört sich gelegentlich bei Mustern wie „zwei mal eins
  fünfzig" und macht daraus einen falschen quadratischen Raum — nach
  Sandys ausdrücklicher Ansage („die Maße müssen immer stimmen") jetzt
  eine Rückfrage gebaut, die bei verdächtig quadratischen Räumen
  nachfragt und danach die tatsächlich richtige Fläche liefert, nicht nur
  warnt. Heute live bestätigt (PM-019 erneut eingesprochen, Rückfrage kam,
  lieferte korrekte 3,00 m²), gewerk-unabhängig für Maler UND Bodenleger.
  Quelle: `docs/pruefmeister-testfaelle.md`.
- **1.4 Golden Tests (75→92):** Suite jetzt bei 842/842 (weiter gewachsen
  seit CoS-018, u. a. durch CoS-021- und PM-019/020-Sicherheitstests), kein
  Fund einer Regression.
- **CoS-021 (DC-034) abgeschlossen, dabei ein echter Bug gefunden:** die
  Frage „brauchen wir zwei getrennte Foto-/Notiz-Systeme im Angebot"
  (Sandys „checke null was es sein soll") wurde entschieden
  (zusammenlegen) und umgesetzt. Dabei kam heraus: der „ins PDF
  aufnehmen"-Schalter im alten Tab hat **noch nie etwas bewirkt** — kein
  PDF-Code-Pfad hat das Flag je gelesen, ein Handwerker bekam ein PDF ohne
  Fotos trotz „✓ im PDF". Jetzt echt gebaut (eigene PDF-Seite „Fotos zur
  Baustelle"), **5.2 Buttons (40→62)**. Live-Nachtest steht aus.
- **CoS-022 (DC-033) fast abgeschlossen:** Angebotsnummern fielen seit
  Mitte Juni auf UUID-Fragmente zurück, weil der aktuelle Erstellungsweg
  die Nummernvergabe nie aufrief (nicht wie zuerst vermutet ein
  verschluckter Fehler — die Vergabe wurde schlicht nie angefordert).
  Betroffen: nur 4 echte Angebote (3 fertiggestellt, 1 versendet), nicht
  die zunächst befürchteten 103 (der Rest waren Wegwerf-Testentwürfe, die
  bewusst keine Nummer bekommen sollen). Fix ist committet, **Live-Nachtest
  und Sandys Entscheidung zu den 4 betroffenen Alt-Angeboten stehen noch
  aus** — siehe `entscheidungen-fuer-sandy.md`.

**Update 24.08.2026, Abend — Tagesabschluss nach dem „großen Push" (dieser
Abschnitt existierte gestern schon, ist aber wegen des oben beschriebenen
Speicherproblems erst heute tatsächlich in der Datei gelandet):**

- **2.1 Registrierung/Login/Logout (0→55):** CoS-P-003, per Code-Review
  geprüft, strukturell sauber. Live-Nachtest steht aus.
- **2.2 E-Mail-Verifizierung (0→30) — korrigiert:** läuft über Supabase-
  eigenes Mailsystem, NICHT über die eigene Resend-Anbindung (das stand
  vorher fälschlich hier). Ob eigenes SMTP im Supabase-Dashboard hinterlegt
  ist, lässt sich nur dort prüfen, nicht per Code.
- **2.3 Passwort-Zurücksetzen (0→15) — korrigiert, 🔴 wahrscheinlicher Bug
  weiterhin ungefixt:** hier stand vorher fälschlich „Bug behoben" — laut
  `chief-of-staff-platform-todos.md` ist das Gegenteil der Fall: der
  PKCE-Code aus dem Reset-Link wird nirgends aktiv gegen eine Session
  getauscht (bekanntes Supabase/Next.js-Fehlerbild). Weiterhin ungefixt,
  weiterhin der wichtigste offene Einzelfund.
- **3.1 Pflicht-Mails (0→35) — korrigiert:** nur die Willkommens-Mail läuft
  über die eigene Resend-Anbindung, Verifizierung/Reset über Supabase.
- **3.2 Absender/Spam (0→55), 3.4 SPF/DKIM/DMARC (0→60):** echter DNS-Check
  von sofortangebot.app — DKIM für Resend korrekt, SPF deckt Resend nicht
  direkt ab (über DMARC-Alignment kompensiert), DMARC bewusst nur im
  Beobachtungsmodus.
- **1.4 Golden Tests (75→90 an diesem Tag):** CoS-018 abgeschlossen, alle
  vier vorbestehenden Testfehlschläge als veralteter Testcode aufgeklärt
  (VOB-/Sockelleisten-Regeländerungen), kein verlorener Fix, Suite 807/807.
- **1.3 Bestätigungskarte (75→80):** CoS-014 — echter Schutz gegen stilles
  Überschreiben manueller Positions-Änderungen (Ändern UND Löschen).
  Sandys Bestätigungs-Retest für den Realtime-Fix bleibt weiterhin der
  größte einzelne Hebel, steht seit mehreren Tagen aus.
- **5.5 Statusfarben, G2 (35→50):** DC-003 vereinheitlicht Status-Farben
  auf eine Quelle an allen 5 Stellen, plus zweite DC-006-Migrationsrunde.

**Update 21.08.2026, Abend — Tagesabschluss: die Deploy-Blockade war ein
Fehlalarm meinerseits und ist aufgelöst, dafür hat der erste echte
Live-Test von CoS-002 sofort einen echten (jetzt gefixten) Bug gefunden.**
Zusammengefasst, was seit dem Vormittags-Update heute noch passiert ist:

- **CoS-016 beantwortet, Punkt 8.7 springt von 35 % auf 80 %.** Die
  „App-seitige Git/Deploy-Blockade" war keine strukturelle Sache, sondern
  ein technisches Detail von Head of Product Engineerings Fernzugriff auf
  Sandys Rechner (konnte Git-Lock-Dateien nicht löschen, nur verschieben)
  — inzwischen selbst gelöst (Lock-Dateien landen jetzt in einem
  `_to_delete/`-Ordner statt gelöscht zu werden). Sandy hat beide
  CoS-002-Commits (`434ba16`, `d582048`) gepusht, `main`/`origin/main`
  gleichauf. Kein offener Deploy-Blocker mehr.
- **Direkt nach dem Deploy: Sandys Live-Test fand einen echten Bug in
  genau der Bestätigungskarte, die CoS-002 reparieren sollte.** Test
  „Wohnzimmer streichen, 3x4 Meter" zeigte „Boden schützen 0 m²" statt der
  erwarteten 12 m². Nach mehreren falschen Fährten (PM-013-Fallback,
  Browser-Cache, Vercel-Branch) die echte Ursache: die
  `supabase_realtime`-Publication war für keine einzige Tabelle aktiv —
  die Karte wartete auf ein Signal, das nie ankam, und fiel nach 30
  Sekunden dauerhaft auf die fehleranfällige Schnell-Vorschau zurück. Die
  eigentliche Berechnung war die ganze Zeit korrekt (per Datenbank-Check
  bestätigt) — der Fehler saß ausschließlich in der Anzeige. **Fix:**
  eine Migration, die Realtime für die richtige Tabelle aktiviert, direkt
  auf der Produktions-DB angewendet, kein neuer Code-Deploy nötig. Sandys
  Bestätigungs-Retest steht noch aus — deshalb 1.3 auf 75 %, nicht höher.
- **1.1 Fallbasis (27→30) und 1.2 Abdeckung (57→60):** die drei zuvor
  ungeprüften Fälle PM-019/020/021 sind jetzt alle getestet — und alle
  drei haben wie schon PM-017/018 einen echten Bug gefunden (isolierter
  Erschwerniszuschlag, Altbelag-Verneinung beim Teppich, Phantom-Position
  „Balkonboden streichen" durch Wortverwechslung). Alle drei sind bereits
  gefixt, aber noch ohne Live-Nachtest. Positiv: kein einziger der 21
  Fälle steht mehr komplett ungeprüft da. Negativ, ehrlich gesagt: die
  Trefferquote „neuer Sondertestfall findet neuen Bug" bleibt bei 100 %
  über PM-017 bis PM-021 — noch kein Anzeichen einer Verlangsamung.
- **Nebenbei entschieden und sofort umgesetzt:** die VOB-Übermessungsregel
  für kleine Fensteröffnungen (aus PM-021 aufgeworfen) ist jetzt Standard
  für alle Malerangebote, nach Sandys ausdrücklichem Go — kein
  Einstellungs-Schalter, kein Onboarding-Schritt, nur ein sichtbarer
  Hinweistext. Details: `entscheidungen-fuer-sandy.md`.
- **1.4 Golden Tests (78→80):** weiterhin 236/236 grün, auch nach den
  PM-019–021-Fixes.

Damit ist der eigentliche Engpass heute Abend nicht mehr die
Deploy-Kette, sondern wieder das, was es strukturell immer war: eine
lange Kette von Live-Bestätigungstests, die noch aussteht (CoS-002-Retest
plus PM-001/007/008/009/011/013/014/015/019/020/021).

**Update 21.08.2026, früher Vormittag — wichtigster Befund des Tages: die
Gate-1-Zahl steht still, aber nicht weil nichts passiert ist.** Zwei fast
gleich große Bewegungen heben sich gegenseitig auf:
- **Punkt 1.3 (Bestätigungskarte) springt von 35 % auf 65 %** — CoS-002 ist
  jetzt in allen drei Schritten UND für den Mehrfach-Aufnahmen-Fall
  vollständig im Code umgesetzt (Head of Product Engineering, 20./21.08.,
  Sandys Folgeauftrag „mach komplett rund" bereits erledigt). Laut Head of
  Product Engineering erfüllt das Sandys Gate-1-Bedingung inhaltlich
  vollständig — **sobald der App-Code live ist.**
- **Genau daran hakt es gerade neu: Punkt 8.7 (verlässliche Kette
  Code→Deploy→live) fällt von 80 % auf 35 %.** Im selben Fix-Update schreibt
  Head of Product Engineering beiläufig, der App-Code sei „wegen der
  App-seitigen Git/Deploy-Blockade (separates, bereits gemeldetes Thema)"
  noch nicht live. Ich finde dazu **kein eigenes Ticket** in keiner der
  Koordinationsdateien — das ist entweder an einer Stelle gemeldet, die ich
  nicht kenne, oder es ist neu und wurde nur beiläufig erwähnt. Habe eine
  direkte Rückfrage dazu in `chief-of-staff-todos.md` (CoS-016) hinterlassen.
  Bis das geklärt ist, bleibt das der eigentliche Flaschenhals für den Start
  von Gate 1 — nicht mehr CoS-002 selbst.
- Daneben kleinere Bewegungen: 1.1 Fallbasis (25→27, jetzt 21 statt 16 Fälle
  — aber zwei davon, PM-017/018, sind neue, bestätigte Bugs, drei weitere
  noch ungeprüft), 1.2 Abdeckung (55→57, neue Sonderfälle wie Tapete- statt
  Streich-Erkennung und Q2/Q3-Verwechslung getestet), 1.4 Golden Tests
  (75→78, 236/236 Tests bleiben auch nach dem großen CoS-002-Umbau grün),
  11.6 Kostenübersicht (60→75, zwei von vier Finance-Auffälligkeiten von
  Sandy geklärt: Kleinunternehmer-Status bestätigt, OpenAI-Konto geklärt).

> ✅ **Update, Abend — CoS-016 geklärt, kein offener Deploy-Blocker mehr:**
> war ein technisches Detail von Head of Product Engineerings Fernzugriff
> (Git-Lock-Dateien ließen sich nicht löschen, nur verschieben), kein
> eigenes Ticket wert gewesen, jetzt beantwortet und selbst gelöst. Sandy
> hat beide CoS-002-Commits gepusht, `main`/`origin/main` gleichauf. Dafür
> hat der erste Live-Test nach dem Deploy sofort einen echten Bug in der
> Bestätigungskarte selbst gefunden (leere `supabase_realtime`-Publication)
> — bereits gefixt, Sandys Bestätigungs-Retest steht noch aus. Siehe Punkte
> **1.3** und **8.7** unten.

> ✓ **Zwei von vier Finance-Auffälligkeiten geklärt (Head of Finance,
> 21.08.):** Kleinunternehmer-Status ist bestätigt §19 UStG, das
> OpenAI-Konto ist echt Sandys eigenes (historischer Alias „Hugo", kein
> Fremdkonto). Offen bleiben: steigende Supabase-Kosten/Projektanzahl und
> die zwei getrennten Claude-Kostenströme (geschäftlich/privat).

> ✅ **Update, Abend — PM-017/018 live bestätigt behoben, PM-019/020/021
> neu getestet:** Beide Vormittags-Bugs (Tapete-Position verschwand,
> Q2/Q3-Verwechslung + fehlende Deckengrundierung) sind im Live-Nachtest
> (21.08.) bestätigt korrekt. Die drei bis dahin ungeprüften Fälle
> PM-019–021 sind jetzt durchgetestet — alle drei fanden wieder einen
> echten Bug (Erschwerniszuschlag-Isolation, Altbelag-Verneinung,
> Phantom-Position durch Wortverwechslung), alle drei bereits gefixt, noch
> ohne Live-Nachtest. Details: `pruefmeister-testfaelle.md` PM-017–021.

**Update 20.08.2026 (Vormittag), echte Neubewertung, keine Schätzung:** Alle
46 Gate-1-Punkte frisch gegen `pruefmeister-testfaelle.md`,
`design-check.md`, `chief-of-staff-todos.md` und
`chief-of-staff-platform-todos.md` abgeglichen (Stand dieser Dateien:
20.08. vormittags — seit dem letzten Dashboard-Update am 18.08. lag viel
neue Arbeit an, u. a. PM-001/011/013/014 Fix-Updates, DC-023/024/025/028
Umsetzung, CoS-P-001 abgeschlossen). Ergebnis: nur **+1 Prozentpunkt**, von
22 % auf 23 % — bewusst nicht mehr, obwohl fachlich viel passiert ist: die
meisten Fixes der letzten zwei Tage sind „code-fertig, Live-Nachtest steht
aus" (PM-001, PM-008, PM-011, PM-013 Dehnungsfuge, PM-014, DC-023, DC-024,
DC-025, DC-028) — nach der eigenen Regel dieser Datei zählt „im Code fertig"
nicht wie „live bestätigt". Größte Einzelbewegungen: 1.6 Standardpreise
(20→55, Kniestock/Dachschräge/Fassade/Übergangsschiene ergänzt), 8.2 Race
Condition (45→65, DB-seitiges Unique-Constraint jetzt live, siehe Flag
unten), 1.1 Fallbasis (20→25, jetzt 16 statt 15 Fälle, mehrere davon näher
an „fertig"), 1.3 Bestätigungskarte (30→35, DC-023/024 verringern konkrete
Fälle, Kernproblem laut Prüfmeister aber unverändert ungelöst), 2.8 erster
Eindruck (20→30, DC-009-Fix über DC-028 mitgeliefert). Gate 3 unverändert —
keine neue G3-Bewegung seit 18.08.

**Gate 2 (10→13 %, neuer Nenner 35→37):** Zwei neue Punkte ergänzt, weil in
den letzten Tagen echte, bisher nicht erfasste Arbeit entstanden ist: **9.7**
(CI/Marke final festgelegt) und **11.6** (laufende Kostenübersicht) — siehe
unten. Daneben drei bestehende Punkte bewegt: 5.4 Leere/Fehlerzustände
(10→20, DC-009/010-Fix code-fertig), 5.5 Statusfarben/Tokens (30→35, erste
Migrationsrunde von DC-006 abgeschlossen), 11.1 Kleinunternehmergrenze
(0→20, Sandy hat §19 UStG/Kleinunternehmer-Status bestätigt, Anmeldung
selbst noch offen).

> ⚠ **Governance-Hinweis, nicht in die Prozentzahl eingerechnet:** Beim
> Abgleich sind in `pruefmeister-testfaelle.md` und `design-check.md`
> mehrfach veraltete Status-Kopfzeilen aufgefallen, die einem später in
> derselben Sektion dokumentierten Fix-Update widersprechen (u. a. PM-001,
> PM-011, PM-014, DC-009, DC-024, DC-028). Nach der Ein-Wahrheit-pro-Sache-
> Regel wurde für die Bewertung hier jeweils der **neueste Inhalt der
> Sektion** verwendet, nicht die veraltete Kopfzeile — das ist aber eine
> offene Doku-Lücke bei Prüfmeister und Designer selbst, nicht von mir
> korrigiert (nicht mein Home-File). Bitte beide bei Gelegenheit bitten,
> ihre eigenen Status-Kopfzeilen nachzuziehen. — Chief of Staff, 20.08.2026

> ⚠ **Zweiter Governance-Hinweis:** `chief-of-staff-todos.md` (CoS-010,
> Stand 19.08.) sagt, das DB-seitige Unique-Constraint gegen echte
> Gleichzeitigkeit warte noch auf Sandys Go. `pruefmeister-testfaelle.md`
> (PM-014, Stand 20.08., neuer) beschreibt dieselbe Sache bereits als
> **umgesetzt und live** (Migration `20260820103931_add_quote_items_position_
> unique.sql`, mit Sandys Go, Retry-bei-Konflikt eingebaut) — nur ein
> gezielter Gleichzeitigkeits-Test fehlt noch. Für Punkt 8.2 unten wurde der
> neuere PM-014-Stand verwendet. Bitte Head of Product Engineering bitten,
> CoS-010 entsprechend nachzuziehen. — Chief of Staff, 20.08.2026

> ✅ **UPDATE 21.08.2026 — CoS-002 code-seitig komplett fertig, inkl.
> Mehrfach-Aufnahmen-Fall.** Sandys Bedingung war: Schritt 3 (Geld-Pfad) muss
> fertig sein, bevor der erste echte Testnutzer ran darf. Head of Product
> Engineering meldet alle drei Schritte fertig, 236/236 Tests grün, Sandys
> Folgefrage („auch den Mehrfach-Fall schließen?") bereits mit „ja" beantwortet
> und umgesetzt. **Einziger verbleibender Haken: der App-Code selbst ist
> laut Head of Product Engineering aktuell wegen einer noch ungeklärten
> „Git/Deploy-Blockade" nicht live zu bringen** — dazu existiert kein
> eigenes Ticket, ich habe nachgefragt (CoS-016 in `chief-of-staff-todos.md`).
> Bis das geklärt ist, ist das der eigentliche Flaschenhals vor Gate 1, nicht
> mehr CoS-002 selbst. Details: `docs/cos-002-architektur-vorschlag.md`,
> Punkt **1.3** und **8.7** unten.

> ✓ **Größte Verbesserung seit dem letzten Update:** Bei der
> Angebots-Verdopplung (**CoS-010**/**PM-014**, **8.2**) ist nicht nur der
> App-seitige Doppel-Tap-Schutz drin, sondern jetzt auch ein DB-seitiges
> Unique-Constraint mit automatischem Retry — die strukturelle Absicherung,
> die vorher fehlte. Offen bleibt nur ein gezielter
> Gleichzeitigkeits-Test. Bei den Standardpreisen (1.6) sind alle bekannten
> Lücken (Kniestock, Dachschräge, Fassadenfläche, Übergangsschiene) jetzt
> nachgepflegt — Live-Nachtest dafür steht noch aus.

Zweiter wichtiger Befund, weiterhin gültig (18.08.): der am 17.08. vormittags
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
| 1.1 | Kernrechnungen tragen über breite Fallbasis (Richtwert ~100 statt 14) | G1 | 🔴 42 % — **02.09.: alle 28 Testfälle haben jetzt eine eindeutige Soll-Lösung** (vorher 21), Prüfmeister hat dabei aber einen neuen, echten, systematischen Rechenfehler gefunden: **VOB-013** — Fensterlaibung wurde ca. 33 % zu groß berechnet, Fensterbank zusätzlich doppelt gezählt, betraf jedes Angebot mit Fenstern/Türen. **03.09.: Code gefixt** (Commit `330743f`, 8 eigene Tests, per Hand nachgerechnet — stimmt), Live-Nachtest durch Prüfmeister steht noch aus, deshalb noch nicht als voll verifiziert gezählt (Prozentzahl unverändert, bis das steht). Breite (28 von ~100) bleibt der limitierende Faktor. **04.09.: Normtext (VOB-011) ausgewertet, vier weitere Funde** — VOB-003 (toter Backlog-Punkt), **VOB-008 (Verdacht LR-14, Score 12)**, VOB-012 (Türbreiten-Abzug), Leibungsposition nur bei Beschichtung — alle vier als CoS-042 an Head of Product Engineering geroutet. **Noch am selben Tag umgesetzt und getestet (1.306 Tests grün, `tsc`/eslint sauber):** VOB-003 gestrichen; **VOB-008 geprüft — Entwarnung, kein Fund:** `boden.ts` ruft die Malerschwelle nirgends auf, zieht überhaupt keine Öffnungen ab — **LR-14 kann geschlossen werden, ohne dass eine Zahl korrigiert werden musste**; VOB-012 gefixt (ändert zehn dokumentierte Soll-Werte um +0,90 lfdm je Standardtür, mit Normverweis nachgezogen); Leibungsposition übersprungen nur bei eindeutig fehlender Beschichtung. Live-Nachtest durch Prüfmeister steht noch aus (wie bei VOB-013), deshalb Prozentzahl weiterhin unverändert bis dahin. **Neu, 04.09.: VOB-010/LR-09** (14 Zuschlagspositionen mit Prozent im Titel, Pauschale im Preis) — Sandy hat „echter Prozentaufschlag" entschieden, Ticket CoS-043 an Head of Product Engineering, noch offen. Quelle: `docs/pruefmeister-testfaelle.md`, `docs/vob-angebot-abstimmung.md` VOB-013/VOB-011/VOB-010, `docs/chief-of-staff-todos.md` CoS-036/CoS-042/CoS-043, `docs/legal-002-risikobewertung-vob.md` LR-14/LR-09 |
| 1.2 | Abdeckung über beide Gewerke, Raumtypen, Sonderfälle, Verneinungen, Selbstkorrekturen | G1 | 🟡 76 % — **02.09., Abend:** der Übermessungshinweis (VOB-004/G5) steht jetzt wirklich live im Kunden-PDF (Fußnote an der Position + Sammelerklärung am Ende, konsistent über beide Renderpfade) — vorher nur code-fertig. Damit ist Legals einziger 🔴-Befund aus der Risikobewertung (LR-01) geschlossen. Alle 28 Testfälle weiterhin konsistent nach der VOB-Übermessungsregel bewertet. Weiterhin größtenteils ohne breiten Live-Nachtest |
| 1.3 | Bestätigungskarte = Endberechnung (Karte-≠-Berechnung-Muster geschlossen) | G1 | 🟢 95 % — **25.08.: CoS-002 endgültig abgeschlossen.** Zusätzlich zum Realtime-Fix bereits echter Schutz gegen stilles Überschreiben manueller Positions-Änderungen, inkl. Löschfall (CoS-014). **Sandys Bestätigungs-Retest ist bestanden** — zweifach dokumentiert: Product Designer hatte es schon am 23.08. in `design-check.md` (DC-021) festgehalten (dort korrekt, hier durch einen eigenen Sync-Fehler nicht übernommen), und Sandy hat heute unabhängig denselben Test live wiederholt („Boden schützen 12 m²" korrekt) und bestätigt. Nicht auf 100 %, weil nur gezielte Testfälle bestätigt sind, keine breite Testserie. Quelle: CoS-002/CoS-014, `docs/cos-002-architektur-vorschlag.md`, DC-021 |
| 1.4 | Alle bestätigten Fälle als Golden Tests grün, kein Fix bricht still einen alten Fall | G1 | 🟢 92 % — **24.08.: CoS-018 abgeschlossen**, alle vier vorbestehenden Fehlschläge als veralteter Testcode aufgeklärt (VOB-/Sockelleisten-Regeländerungen), kein verlorener Fix. **25.08.:** Suite weiter gewachsen auf 842/842, u. a. durch CoS-021- und PM-019/020-Sicherheitstests, weiterhin kein Fund einer Regression. **02.09.: vermutlich weiter gewachsen** (mehrere neue Fixes diese Woche, typischerweise mit eigenen Tests), aber keine harte aktuelle Zahl vorliegend — bewusst nicht in die Prozentzahl eingerechnet, um nicht zu schätzen. Kein direkter CI-Dashboard-Zugriff |
| 1.5 | Zahlen-/Größenordnungsfehler ausgeschlossen (siehe PM-010: „drei fünfzig" → 350) | G2 | 🟡 40 % — bleibt als bewusste Design-Entscheidung stehen (Whisper-Ebene, Rechnung selbst korrekt, Warnung statt stiller Korrektur) |
| 1.6 | Neu erkannte Positionstypen haben hinterlegte Standardpreise | G1 | 🟡 78 % — Kniestock, Dachschräge, Fassadenfläche streichen und Übergangsschiene jetzt alle mit Preis hinterlegt (20.08.). **29.08. (DC-039):** „+ Position" hat jetzt eine Live-Suche gegen die Preisdatenbank plus einen eigenen, serverseitig abgesicherten Schreib-Endpunkt. **02.09.: eine 21-Positionen-Katalog-Lücke geschlossen** (CoS-028) — deutlich breitere Preisabdeckung. Live-Nachtest weiterhin für alles offen |
| 1.7 | KI-Grenzen/Fehlerrate den Nutzern gegenüber transparent kommuniziert (kein 100 %-Versprechen) | G2 | ⚪ offen — nicht erhoben (neu) |
| 1.8 | Lasttest: mehrere gleichzeitige Aufnahmen/Nutzer ohne Fehler | G2 | ⚪ offen — nicht erhoben (neu) |
| 1.9 | Bekannte Sprach-/Dialekt-/Störgeräusch-Grenzen dokumentiert | G3 | ⚪ offen — nicht erhoben (neu) |

## 2. Accounts & Onboarding

| # | Punkt | Gate | Status |
|---|---|---|---|
| 2.1 | Registrierung, Login, Logout laufen sauber durch — komplett | G1 | 🟡 62 % — per Code-Review geprüft (CoS-P-003): strukturell sauber, Account-Enumeration-Schutz, generische Fehlermeldungen. **02.09.: G4 komplett** — eigene Pflicht-Checkbox „Ich melde mich als Unternehmer an (§14 BGB)", getrennt von der AGB-Zustimmung, jetzt im Frontend UND serverseitig bestätigt (Commit `353f5dd`). Live-Nachtest weiterhin aus |
| 2.2 | E-Mail-Verifizierung wirklich zugestellt (nicht nur ausgelöst) | G1 | 🟡 55 % — **korrigiert, 29.08.:** auf Sandys Freigabe „004 bitte b)" läuft die Verifizierungs-Mail jetzt über die eigene Resend-Anbindung statt Supabase (CoS-P-004, neue Route `api/auth/register`). Code fertig, **echter Zustellungs-Test mit echtem Postfach steht aus** — das kann nur Sandy selbst machen |
| 2.3 | Passwort-Zurücksetzen funktioniert | G1 | 🟡 60 % — **korrigiert, 29.08.: Bug ist bereits gefixt, nicht mehr offen.** Auf Sandys Freigabe „003 ja bitte direkt reparieren" läuft der Reset-Link jetzt über `/auth/callback` (korrekter PKCE-Tausch, wie bei der Registrierung), plus aktive Session-Prüfung und eine „Link abgelaufen"-Seite statt Endlos-Laden (CoS-P-003). Diese Zeile stand hier fälschlich seit mehreren Tagen auf „weiterhin ungefixt" — eigener Sync-Fehler des Chief of Staff, der Fix war schon am 25.08. dokumentiert. **Einziger verbleibender Schritt: ein echter Klick-Durchlauf mit echtem Postfach**, aus keiner Session heraus möglich — Sandys Aufgabe |
| 2.4 | Kompletter erster Durchlauf (erste Anmeldung → erstes Angebot) end-to-end | G1 | ⚪ offen — nicht erhoben |
| 2.5 | Account-Löschung möglich | G2 | 🟢 85 % — **Update 04.09.2026 (Chief of Staff, direkt verifiziert):** Sandy fragte nach, ob der Cron heute Nacht durchgelaufen ist — Prüfung via Vercel-Runtime-Logs UND direkter Abfrage der `system_laeufe`-Tabelle in Supabase (nicht nur „200 OK" vertraut). Ergebnis: `CRON_SECRET`-Problem ist behoben, der Aufräum-Job lief heute 03:30 Uhr zum ersten Mal überhaupt erfolgreich (`ok: true`) und hat direkt 182 verwaiste Sprachaufnahmen + 1 Foto gelöscht. Die Lösch-Infrastruktur ist damit technisch bewiesen lauffähig. Bewusst nicht 100 %: die eigentliche 30-Tage-Konto-Löschung selbst hat noch keinen echten Testfall gehabt (`Konten: geprüft 0, gelöscht 0`, weil noch kein Konto die Frist erreicht hat) — reine Wartezeit, kein bekanntes Problem |
| 2.6 | Schutz vor automatisierten Massen-Registrierungen (Captcha/Rate-Limit) | G2 | ⚪ offen — nicht erhoben (neu) |
| 2.7 | Session-Sicherheit: Token-Ablauf sinnvoll, Logout wirklich überall wirksam | G1 | ⚪ offen — nicht erhoben (neu) |
| 2.8 | Erster Eindruck für brandneue Nutzer durchdacht (leere Zustände) | G1 | 🔴 30 % — DC-009 (leere Aufnahme als Erfolg) jetzt über DC-028 code-seitig mitgefixt, Live-Nachtest steht aus; PM-015-Fix behebt zusätzlich einen konkreten Fall: „manuell"-Onboarding landete bisher mit fast leerer Preisdatenbank |

## 3. Transaktions-E-Mails

| # | Punkt | Gate | Status |
|---|---|---|---|
| 3.1 | Pflicht-Mails werden wirklich versendet (Willkommen, Verifizierung, Reset) | G1 | 🟡 60 % — **korrigiert, 29.08.:** alle drei Pflicht-Mails laufen jetzt über die eigene Resend-Anbindung (CoS-P-004, Sandys Freigabe „004 bitte b)"), nicht mehr nur die Willkommens-Mail. Code fertig, echte Zustellung noch nicht live beobachtet |
| 3.2 | Absender korrekt, Links funktionieren, Inhalt stimmt, landen nicht im Spam | G1 | 🟡 55 % — DNS für sofortangebot.app geprüft: DKIM für Resend korrekt gesetzt, SPF deckt Resend nicht direkt ab (über DMARC-Alignment kompensiert), DMARC nur im Beobachtungsmodus (p=none) — Live-Spam-Test steht aus |
| 3.3 | Weitere Mails je nach Flow (Quittung/Rechnung, Angebot fertig) | G2 | ⚪ offen — nicht erhoben |
| 3.4 | SPF/DKIM/DMARC korrekt gesetzt (Zustellbarkeit, kein Spam-Ordner) | G1 | 🟡 60 % — echter DNS-Check (CoS-P-004): DKIM ✅ korrekt, SPF-Lücke über DMARC-Alignment kompensiert, DMARC bewusst nur `p=none` (Beobachtungsmodus, für den Start okay) |

## 4. Zahlung & Abrechnung (Stripe)

| # | Punkt | Gate | Status |
|---|---|---|---|
| 4.1 | Falls Testnutzer kostenlos starten: kein Zahlungsschritt blockiert sie | G1 | ⚪ offen — nicht erhoben |
| 4.2 | Checkout/Abo funktioniert, korrekte Preise, MwSt korrekt behandelt | G2 | ⚪ offen — nicht erhoben. Preis-Text selbst hängt an CoS-001 |
| 4.3 | Rechnungen werden erzeugt und sind korrekt | G2 | ⚪ offen — nicht erhoben |
| 4.4 | Fehlgeschlagene Zahlung und Kündigung sauber behandelt | G2 | ⚪ offen — nicht erhoben |
| 4.5 | Kündigungsbutton nach § 312k BGB leicht auffindbar und funktionsfähig (gesetzlich seit Juli 2022 Pflicht für Online-Verträge mit Verbrauchern; bei reinem B2B nicht zwingend, aber gute Praxis und ggf. bei Grenzfällen relevant) | G2 | ⚪ offen — nicht erhoben (neu) |
| 4.6 | Stripe live-scharf konfiguriert, kein Test-Modus-Rest, Webhook-Secret produktionsecht | G2 | 🔴 15 % — **neu, 03.09.2026, Nebenfund von Head of Legal (bei der Prüfung der Vertragspartner-Frage entdeckt), vom Chief of Staff per direkter Stripe-Kontoabfrage bestätigt:** `charges_enabled: false`, `payouts_enabled: false`, `details_submitted: false`, `requirements.past_due` listet fehlende Bankverbindung (`external_account`) sowie ausstehende AGB-Bestätigung (`tos_acceptance.date`/`.ip`). Das Stripe-Konto kann aktuell keine echten Zahlungen annehmen. Kein Gate-1-Blocker (betrifft nur echte, bezahlte Nutzer), aber ohne diesen Schritt ist auch bei sonst fertigem Checkout kein Geld einnehmbar — gehört zu Platform & Integrations Engineering bzw. Finance, siehe `chief-of-staff-finance-todos.md` |
| 4.7 | Eigene Buchhaltung kann E-Rechnungen empfangen (seit 1.1.2025 Pflicht für alle inländischen Unternehmen, ohne Übergangsfrist für den Empfang) | G1 | ⚪ offen — nicht erhoben (neu). Quelle: [IHK Stuttgart, E-Rechnungspflicht B2B](https://www.ihk.de/stuttgart/fuer-unternehmen/recht-und-steuern/steuerrecht/steuermeldungen/e-rechnungen-5864496) |
| 4.8 | Missbrauchsschutz beim Free-Kontingent (Mehrfachkonten für Gratisnutzung) | G2 | ⚪ offen — nicht erhoben (neu) |

## 5. Navigation & UX-Integrität (mit Product Designer)

| # | Punkt | Gate | Status |
|---|---|---|---|
| 5.1 | Man kommt von überall leicht zurück/zur Startseite — keine Sackgassen | G1 | ⚪ offen — nicht erhoben |
| 5.2 | Jeder Button an sinnvoller Stelle, nichts Wichtiges fehlt/kaputt | G1 | 🟡 70 % — **DC-011 behoben + live bestätigt** (fertiges Angebot verschwand aus der Liste). **24.08.: DC-002** (fehlender „Angebote"-Nav-Punkt) behoben. **25.08. (CoS-021/DC-034):** kaputter „ins PDF"-Schalter bei Fotos gefunden und gebaut. **29.08., gebündelter Nachtrag (DC-036/038/039/041):** vier weitere UI-Punkte abgearbeitet — Reiter „Raumform" umbenannt + auffindbar gemacht (DC-036); Grundriss-Zeichner bekam Wandnummern + neue „frei zeichnen"-Funktion (DC-038); „+ Position"-Suche gebaut, dabei ein von Sandy live gefundener Tap-Bug behoben (Vorschlag antippen blieb wirkungslos, jetzt `onMouseDown`+`preventDefault`) (DC-039); Raum-Titelfeld zeigte den literalen Platzhalter „— Schlafzimmer" statt eines leeren Felds, gefixt (DC-041). Alle vier code-fertig/committet, **keines davon live nachgetestet** — deshalb spürbarer, aber kein voller Sprung. Weiterhin offen: DC-009/010 (Erfolgs-Anzeige/Guardrail) |
| 5.3 | Funktioniert auf Handy UND Desktop | G1 | ⚪ offen — nicht erhoben |
| 5.4 | Leere/Fehler-/Ladezustände überall sinnvoll gestaltet | G2 | 🔴 20 % — DC-009/010: widersprüchliche Fehler-/Erfolgs-Banner code-seitig gefixt (20.08., Root Cause war GPT-Nichtdeterminismus, nicht Race Condition), Live-Nachtest steht aus; die fehlende Guardrail beim Fertigstellen leerer Angebote (zweiter Teil von DC-010) bleibt offen |
| 5.5 | Statusfarben & Design-Tokens konsistent | G2 | 🟡 50 % — DC-003 vereinheitlicht Status-Farben auf eine Quelle an allen 5 Stellen, plus zweite DC-006-Migrationsrunde; Großteil der >1.900 Fundstellen weiterhin offen; siehe auch DC-007 |
| 5.6 | Barrierefreiheit (BFSG) bewusst geprüft statt nur angenommen | G3 | 🟢 60 % — wahrscheinlich nicht einschlägig (reines B2B, Verbraucher per AGB ausgeschlossen), rechtlich nicht abschließend bestätigt (neu). Quelle: [accessgo.de, BFSG B2B](https://www.accessgo.de/wissen/barrierefreiheitsstaerkungsgesetz/b2b/) |

## 6. Datenschutz & Datensicherheit (technisch)

| # | Punkt | Gate | Status |
|---|---|---|---|
| 6.1 | Nutzer sehen ausschließlich eigene Daten (Supabase RLS greift überall) | G1 | 🟢 95 % — **erledigt und geprüft, CoS-P-001**: 22 Tabellen + ~19 Umgehungsstellen direkt in Produktion geprüft, eine akute Lücke (`debug_extraktion_roh`, öffentlich ohne RLS) gefunden und sofort gefixt |
| 6.2 | Keine Secrets/Keys im Frontend oder in Logs sichtbar | G1 | 🔴 25 % — **02.09.:** ein Groq-API-Key wurde ungefiltert (unmaskiert) im Chat-Verlauf ausgegeben. Sandy hat bestätigt: Groq wird im Produkt nirgends genutzt (nur OpenAI im Einsatz), das praktische Risiko ist damit kleiner als zunächst angenommen. Ob am Groq-Konto eine Zahlungsmethode hinterlegt ist, ist weiterhin nicht verifiziert; der Schlüssel selbst ist weiterhin nicht widerrufen (optionale Formsache, keine Dringlichkeit mehr). Kein systematischer Scan der übrigen Secrets, nur dieser eine konkrete Fund |
| 6.3 | Daten-Export und -Löschung für DSGVO-Anfragen umsetzbar | G2 | 🟢 70 % — **Update 04.09.2026:** die Cronjob-Zuverlässigkeit, die diesen Punkt bisher gedeckelt hat, ist jetzt live bestätigt (siehe 2.5). Export weiterhin ungeprüft, deshalb nicht höher |
| 6.4 | Supabase-Security-Advisor regelmäßig geprüft (nicht nur einmalig) | G1 | 🟡 60 % — seit 17.08. Teil des täglichen automatischen Chief-of-Staff-Checks, aber erst seit heute (neu) |
| 6.5 | Passwort-Sicherheit: „Leaked Password Protection" (HaveIBeenPwned-Abgleich) aktiv | G1 | 🟢 95 % — **03.09.: erledigt.** Sandy hat den Toggle in Supabase (Authentication → Sign In / Providers → Email → „Prevent use of leaked passwords") aktiviert und gespeichert. Per Screenshot bestätigt (Toggle grün) UND unabhängig gegengecheckt: der Supabase-Security-Advisor listet die Warnung „Leaked Password Protection aus" nicht mehr. Nicht auf 100 %, weil die verwandten Felder (Minimum-Passwortlänge 6 Zeichen, „Password requirements" auf „No required characters") bewusst nicht mit angefasst wurden — eigenes, kleineres Thema |
| 6.6 | Rate-Limiting/Brute-Force-Schutz auf dem Login | G1 | ⚪ offen — nicht erhoben (neu) |
| 6.7 | Externer Sicherheits-Review/Penetrationstest vor öffentlichem Launch | G2 | ⚪ offen — nicht erhoben (neu) |
| 6.8 | HTTPS/TLS überall erzwungen (inkl. HSTS) | G1 | 🟢 97 % — **03.09.: CoS-037 umgesetzt und live verifiziert.** Head of Product Engineering hat `next.config.ts` um einen `headers()`-Block erweitert, Header trägt jetzt `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (per Vercel-Direktabruf bestätigt, `www.sofortangebot.app`). Nicht auf 100 %, bewusst: die Domain ist noch nicht bei `hstspreload.org` eingetragen — Sandys Entscheidung, siehe `docs/entscheidungen-fuer-sandy.md` (03.09.) und `docs/chief-of-staff-todos.md` CoS-037. Kein offener Rest, sondern eine begründet zurückgestellte Entscheidung |

## 7. Rechtstexte & Compliance

| # | Punkt | Gate | Status |
|---|---|---|---|
| 7.1 | Impressum vorhanden und korrekt | G1 | 🟢 96 % — **Update 03.09.2026 (Chief of Staff, live gegengeprüft):** beide Funde vom 02.09. sind umgesetzt UND live (`www.sofortangebot.app/impressum` direkt abgerufen) — toter EU-Streitschlichtungs-Absatz weg, §5 DDG/§7 DDG/Art. 8 DSA-Verweis korrekt, Überschrift „Verbraucherstreitbeilegung" mit §36 VSBG. Einziger offener Rest: USt-ID-Platzhalter in Abschnitt 11, hängt an der noch nicht abgeschlossenen Gewerbeanmeldung (siehe 11.1), kein Legal-Defekt mehr |
| 7.2 | Datenschutzerklärung vorhanden (inkl. eingesetzter Dienste) | G1 | 🟢 85 % — **Update 03.09.2026 (Chief of Staff, live gegengeprüft):** der ursprüngliche Fund vom 02.09. ist live — OpenAI und Sentry stehen als Auftragsverarbeiter drin, §25 TDDDG vorhanden, Groq komplett raus. **Zwei Nachfunde von Head of Legal sind code-fertig und getestet (`rechtstexte-hygiene.test.ts` 11/11 grün), aber NICHT live:** (1) Stripe-Vertragspartner korrigiert von „Stripe Inc." auf „Stripe Payments Europe, Limited" (Irland) — live steht noch „Stripe Inc.", Abschnitt 4 gruppiert Stripe noch fälschlich unter die Drittland-SCC-Klausel; (2) Kundendaten-Abschnitt (2) enthielt einen inhaltlichen Widerspruch (gleichzeitig „Auftragsverarbeitung nach Art. 28 DSGVO" UND eine eigene „Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO" für dieselben Daten) — Head of Legal hat das korrigiert, live steht aber noch die alte, widersprüchliche Formulierung. Beide Fixes warten auf Sandys Freigabe für den nächsten Deploy, siehe `entscheidungen-fuer-sandy.md` |
| 7.3 | AGB mit klarem B2B-Ausschluss vom Fernabsatzrecht | G1 | 🟢 90 % — verifiziert: expliziter § 14 BGB-B2B-Ausschluss |
| 7.4 | DSGVO-Verzeichnis von Verarbeitungstätigkeiten (intern) | G2 | ⚪ offen — nicht erhoben |
| 7.5 | AVV/DPAs mit Subprozessoren geklärt (OpenAI, Supabase, Stripe, Vercel) | G2 | 🟡 40 % — Datenschutzerklärung nennt AVV-Abdeckung, Details nicht einzeln geprüft |
| 7.6 | Cookie-/Consent-Banner, falls einwilligungspflichtige Dienste | G2 | ⚪ offen — nicht erhoben |
| 7.7 | Berufshaftpflicht für Softwareanbieter | G2 | ⚪ offen — nicht erhoben, Sandys Bereich |
| 7.8 | Marke „Sofortangebot" beim DPMA anmelden | G3 | ⚪ offen |
| 7.9 | ZUGFeRD-Pflicht ab 2027 für eigene Rechnungen | G3 | ⚪ offen |
| 7.10 | **EU AI Act Art. 50 — Transparenzpflicht KI-Interaktion (seit 2.8.2026 in Kraft, JETZT schon geltendes Recht)** | G1 | 🟡 72 % — **02.09., Abend: per echtem Code-Commit bestätigt (`353f5dd`)**, vormittags stand der R3-Hinweis nur als „gesehen, gilt als gebaut" im Chief-of-Staff-Kanal, jetzt real verifiziert. Product Designer hat den von Legal geforderten in-App-KI-Hinweis gebaut (R3: „Aus deinem Diktat erstellt — bitte einmal prüfen, bevor es rausgeht.", zeigt sich dem Handwerker vor dem Versenden). Legal hat zusätzlich geklärt (S-3), dass eine separate Information der Endkunden des Handwerkers rechtlich NICHT nötig ist — der Scope war also kleiner als zunächst befürchtet. Nicht höher, weil der R3-Hinweis noch nicht live nachgetestet ist. Bußgeldrahmen weiterhin bis 15 Mio. €/3 % Jahresumsatz, praktisches Risiko eher gering. Quelle: `docs/design-check.md` R3, `docs/legal-001-bestandsaufnahme.md` S-3, [re.think Consulting](https://rethink.consulting/transparenzpflichten-nach-artikel-50-des-eu-ai-acts-alles-zur-kennzeichnungspflicht-fur-ki-inhalte-ab-august-2026/) |
| 7.11 | NIS2-Cybersicherheitspflichten geprüft | G3 | 🟢 85 % — **geprüft, aktuell nicht einschlägig** (Schwelle 50 Mitarbeitende/10 Mio. € Jahresumsatz in einem von 18 Sektoren, Sofortangebot deutlich darunter). Bei Wachstum erneut prüfen. Quelle: [secjur.com, NIS2 Umsetzung](https://www.secjur.com/blog/nis2-umsetzung) |
| 7.12 | Barrierefreiheitsstärkungsgesetz (BFSG) geprüft | G3 | 🟡 40 % — wahrscheinlich nicht einschlägig (B2B), nicht abschließend anwaltlich bestätigt, siehe 5.6 |
| 7.13 | KI-Anbieter-Nutzungsbedingungen eingehalten (OpenAI/Whisper), Kundendaten nicht ungewollt fürs KI-Training freigegeben | G1 | ⚪ offen — nicht erhoben (neu) |
| 7.14 | Haftungsregelung für KI-generierte Angebotsfehler in AGB explizit abgedeckt | G2 | 🔴 20 % — **02.09., jetzt echt geprüft statt unerhoben, Ergebnis negativ:** Head of Legal hat die bestehende Klausel §9.3 (Haftungsausschluss für KI-Fehler) geprüft und für nach §307 BGB wahrscheinlich vollständig unwirksam befunden — deutsches AGB-Recht kennt keine „geltungserhaltende Reduktion", eine ganze Klausel fällt weg, nicht nur der überzogene Teil. Der vermeintliche Haftungsschutz ist damit unzuverlässiger als angenommen; macht die Rechtsform-Frage (S-4, UG) wichtiger als Rückfallebene. Neue Klausel noch nicht entworfen. **Nachtrag 03.09.: Sandy hat entschieden, als Einzelunternehmen zu starten (S-4 Teil 4) — die UG als Rückfallebene steht in Phase 1 also NICHT zur Verfügung. Damit hängt der Haftungsschutz in dieser Phase allein an der IT-Haftpflicht und an der Fehlerfreiheit der Berechnung. Head of Legal zieht die Neufassung von § 9.3 vor.** |
| 7.15 | **KI-Anbieter-Kompetenzpflicht nach Art. 4 EU AI Act (Sorgfaltspflicht für den Einsatz von KI-Systemen)** | G2 | ⚪ 0 % — **neu, 02.09.2026, von Head of Legal identifiziert (CC-08)** — andere Pflicht als 7.10 (dort: Nutzer informieren; hier: eigene Sorgfalt beim KI-Einsatz). Noch nicht begonnen, als nächstes in Legals Warteschlange |

## 8. Technik, Betrieb & Zuverlässigkeit

| # | Punkt | Gate | Status |
|---|---|---|---|
| 8.1 | Observability: jede Pipeline-Stufe nachvollziehbar geloggt | G1 | 🟡 38 % — erster Schritt umgesetzt (CoS-P-002: Sentry meldet jetzt 8 Fehlerstellen im Kernpfad). **02.09.: sieben zuvor still fehlschlagende Datenbank-Schreibvorgänge** (u. a. Signatur-Erfassung, Angebotserstellung, Stripe-Webhook) **jetzt sichtbar/abgesichert** (CoS-029) — verwandtes Zuverlässigkeits-Update, kein direkter Observability-Ausbau, deshalb moderater statt großer Sprung. Rest (Edge-Functions, ~27 weitere Stellen, 2 tote Logging-Spalten) weiterhin offen |
| 8.2 | Race Condition ausgeschlossen (Summe stabil ohne Nutzeraktion) | G1 | 🟡 65 % — App-seitiger Doppel-Tap-Schutz UND (neu, 20.08., laut PM-014) ein DB-seitiges Unique-Constraint (`unique(quote_id, position)`, Migration `20260820103931`) mit Retry-bei-Konflikt sind jetzt beide live, 706/706 Tests grün. Bewusst nicht auf höher gesetzt: ein gezielter Gleichzeitigkeits-Test (zwei echte parallele Anfragen) ist noch nicht gefahren. Siehe Governance-Hinweis oben zu CoS-010 vs. PM-014 |
| 8.3 | Backups eingerichtet und einmal ein Restore getestet | G2 | 🟡 65 % — tägliches verschlüsseltes Backup läuft produktiv, Restore-Prozess definiert, aber kein protokollierter Restore-Test-Durchlauf sichtbar |
| 8.4 | Fehler-Monitoring: du merkst, wenn im Betrieb etwas bricht | G2 | 🔴 20 % — Health-Checks (`/api/health*`) und Kosten-Alarm existieren und funktionieren, aber Sentry deckt bisher nur den Kernpfad ab |
| 8.5 | OpenAI-Kosten pro Angebot bekannt und tragbar; Rate-Limits bedacht | G2 | 🟢 85 % — **erhoben am 03.09.2026** (Zuarbeit aus CoS-038, Herleitung im Abschnitt „Rohdaten für CoS-F-002" in `docs/chief-of-staff-finance-todos.md`; die dort genannte Datei `docs/ki-kosten-messung.md` existiert nicht — siehe CoS-039): rund **2,2 Cent netto je Angebot** (Whisper 0,0060 $ + GPT-4o-mini 0,0002 $ + GPT-4o 0,0172 $), konservativ 2,5 Cent. Vielnutzer mit 40 Angeboten/Monat ≈ 0,86 € — bei 49 €/29 € klar tragbar. Infrastruktur separat erhoben (CoS-P-008): bei 50 Betrieben ~70 $/Monat, praktisch reine Fixkosten. Rest bis 100 %: Whisper-Anteil ist geschätzt statt gemessen (Aufnahmedauer wurde nie gespeichert, Fehler behoben — eine Nachmessung mit echten Dauern schließt den Punkt), und **Rate-Limits sind weiterhin nicht geprüft** |
| 8.6 | Domain, SSL, Hosting-Konfiguration sauber | G2 | 🟡 50 % — läuft auf `www.sofortangebot.app` über Vercel, kein separater Sicherheitscheck dokumentiert |
| 8.7 | Verlässliche Kette Code-Fix → Deploy → tatsächlich live | G1 | 🟢 80 % — **21.08.2026 Abend: CoS-016 geklärt, kein offener Blocker mehr.** War kein System-/Architekturproblem, sondern ein technisches Detail von Head of Product Engineerings Fernzugriff (Git-Lock-Dateien nicht löschbar, nur verschiebbar) — inzwischen selbst gelöst, Sandy hat beide CoS-002-Commits gepusht, `main`/`origin/main` gleichauf. Nicht auf 100 %, weil der anschließende Live-Test zeigte, dass „deployt" allein nicht „korrekt live" garantiert (siehe 1.3) |
| 8.8 | Status-Seite für Nutzer (zeigt Verfügbarkeit) | G2 | ⚪ offen — nicht erhoben (neu) |
| 8.9 | Eskalationsweg bei Ausfall definiert (wer wird wann wie alarmiert) | G1 | 🟢 90 % — **03.09.: entschieden + größtenteils schon live.** Sandys Entscheidung: Sentry-Alert an sie, Rollback manuell bei Bedarf. Per Sentry-API geprüft: die Standard-Regel „Send a notification for high priority issues" ist bereits aktiv und mailt alle aktiven Projektmitglieder bei jedem neuen/bestehenden High-Priority-Fehler — das läuft schon, nicht erst neu gebaut. Sandy checkt das Postfach (`einfachanfrage@outlook.com`) aktuell noch nicht aktiv, hat aber ausdrücklich zugesagt, das **ab Gate 1** (erster echter Testnutzer) zu tun — genau der Zeitraum, in dem der Punkt zählt. Nicht auf 100 %, weil das erst ab dann gilt, nicht schon jetzt |
| 8.10 | Kostenbudget-Alarme (OpenAI/Vercel/Supabase) gegen Kostenexplosion | G1 | 🟡 40 % — Kostenalarm bei ungewöhnlich hohen KI-Kosten eines Nutzers existiert bereits (CoS-P-002), projektweite Budget-Alarme offen |
| 8.11 | Rollback-Plan bei fehlerhaftem Deployment | G1 | 🟢 85 % — **03.09.: entschieden + Mechanismus bereits vorhanden.** Sandys Entscheidung: manuelles Rollback bei Bedarf (siehe 8.9). Per Vercel-Doku bestätigt: `vercel rollback` bzw. „Promote to Production" ist eine eingebaute Pro-Plan-Funktion (Vercel-Team ist auf Pro) — jede frühere Production-Deployment ist mit einem Befehl sofort wieder live, kein eigener Aufbau nötig. Nicht auf 100 %, weil noch nirgendwo schriftlich steht, WER im Ernstfall den Rollback ausführt (Sandy selbst oder Head of Product Engineering) |
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
| 9.7 | Eigene Marke/CI final festgelegt (Farbe, Typografie, Logo, Icon-Sprache) | G2 | 🟡 40 % — Richtung von Sandy final bestätigt („ok leg die CI fest", CoS-M-001), Referenz-Guide fertig (`docs/ci-guide.html`). **31.08.: finaler Slogan „Aufmaß fertig. Angebot fertig." entschieden** — eine weitere offene Teilentscheidung geschlossen. Umsetzung im Produkt-Code läuft erst an (Token-Aufräumung DC-006 in Arbeit; Farbe/Typografie/Mono-Zahlen/Icon-Set/Logomark-Vektorisierung noch offen) |

## 10. Support & Notfall

| # | Punkt | Gate | Status |
|---|---|---|---|
| 10.1 | Klarer Kanal für Testnutzer-Feedback/Bugs | G1 | 🟢 85 % — **03.09.: entschieden.** WhatsApp direkt an Sandy (private Nummer, kein WhatsApp Business) — niedrigste Hürde für Handwerker, sofort sichtbar für sie. Nicht auf 100 %, weil das noch niemandem kommuniziert wurde (es gibt noch keine Testnutzer) — reine Formsache, sobald der erste Testnutzer startet |
| 10.2 | Notfallplan, wenn Sandy nicht verfügbar ist | G1 | 🟢 80 % — **03.09.: Plan angepasst, jetzt konkret umsetzbar.** Sandy nutzt für 10.1 ihre private WhatsApp-Nummer, keine WhatsApp Business — eine technische Abwesenheits-Antwort fällt damit weg. Statt eines eigenen Notfallplans deckt eine einmalige Willkommensnachricht an jeden neuen Testnutzer beides ab (10.2 + 10.4 zusammen, fertiger Text unten). Nicht auf 100 %, weil der Text noch niemandem geschickt wurde — es gibt noch keinen Testnutzer |
| 10.3 | Kurze Hilfe/FAQ für häufigste Fragen | G2 | ⚪ offen — nicht erhoben |
| 10.4 | Reaktionszeit-Erwartung an Testnutzer kommuniziert (auch informell reicht) | G1 | 🟢 85 % — **03.09.: entschieden, Text fertig formuliert** (siehe 10.2): „Meist binnen 24 Stunden." Nicht auf 100 %, weil das noch nirgendwo tatsächlich an einen Testnutzer kommuniziert wurde — es gibt noch keinen |
| 10.5 | Bekannte-Probleme-Liste für Testnutzer einsehbar (Transparenz schafft Vertrauen) | G2 | ⚪ offen — nicht erhoben (neu) |

## 11. Business & Steuer

| # | Punkt | Gate | Status |
|---|---|---|---|
| 11.1 | Kleinunternehmergrenze (25.000 €) im Blick, steuerliche Anmeldung abgeschlossen | G2 | 🔴 20 % — Sandy hat bestätigt: noch kein Gewerbe für Sofortangebot separat angemeldet, Plan ist Kleingewerbe/Kleinunternehmerin nach §19 UStG (CoS-F-001). Entscheidung steht, Anmeldung selbst noch offen. Hängt weiterhin mit 7.1 zusammen (USt-ID) |
| 11.2 | Separate EÜR für Sofortangebot-Einnahmen | G2 | ⚪ offen — Sandys Bereich |
| 11.3 | Gewerbeanmeldung | — | ✅ erledigt (Sandy) |
| 11.4 | Geschäftskonto getrennt von privat | G1 | ⚪ offen — nicht erhoben, Sandys Bereich (neu) |
| 11.5 | Buchhaltungssystem angebunden (Lexware/sevDesk), Ziel: Anbindung in 2–3 einfachen Klicks | G1 | ⚪ offen — nicht erhoben, Platform-Engineer-Scope. Erste Machbarkeits-Prüfung (CoS-P/DC-029): kein natives Projekt-/Lieferadressfeld in der Lexware-API, Workaround als Freitext identifiziert, kein Blocker. **Von G2 auf G1 hochgestuft (Sandy, 31.08.2026):** kein Nice-to-have, sondern Teil des Kern-Differenzierungsversprechens für die Zielgruppe kleiner Betriebe (siehe `vision-strategie.md`, Geklärt 31.08.) |
| 11.6 | Laufende Kostenübersicht als Grundlage für Preis-/Runway-Entscheidungen | G2 | 🟡 75 % — **21.08.2026:** zwei von vier Auffälligkeiten von Sandy geklärt (Kleinunternehmer-Status §19 UStG bestätigt, OpenAI-Konto ist echt Sandys eigenes). Offen bleiben: steigende Supabase-Kosten/Projektanzahl, zwei getrennte Claude-Kostenströme (geschäftlich/privat), plus fehlende Belege (Resend/Domain/Sentry/GitHub) |

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
