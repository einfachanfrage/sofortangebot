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

## Gate-Fortschritt (Stand 21.08.2026, Abend/Tagesabschluss)

| Gate | Fortschritt | Punkte |
|---|---|---|
| **Gate 1** — erste Testnutzer | **25 %** (von 23 % — echte Bewegung, kein Rauschen, siehe unten) | 46 |
| **Gate 2** — öffentlicher Launch | **13 %** (unverändert, keine neue G2-Bewegung heute) | 37 |
| **Gate 3** — danach/Skalierung | **17 %** (unverändert) | 11 |

Rechenweg unverändert: jeder Punkt 0–100 nach der jeweiligen Heimat-Quelle,
0 = „offen, nicht erhoben" ist ein legitimer Wert. Ungewichteter Durchschnitt.

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
| 1.1 | Kernrechnungen tragen über breite Fallbasis (Richtwert ~100 statt 14) | G1 | 🔴 30 % — weiter 21 von ~100 Fällen (PM-001–021), aber jetzt sind ALLE 21 mindestens einmal getestet (keiner mehr „ungeprüft" wie noch heute Vormittag). PM-019–021 fanden je einen echten Bug, alle drei bereits gefixt, noch ohne Live-Nachtest. Trefferquote „neuer Sondertestfall findet neuen Bug" bleibt bei 100 % (PM-017 bis PM-021). Quelle: `docs/pruefmeister-testfaelle.md` |
| 1.2 | Abdeckung über beide Gewerke, Raumtypen, Sonderfälle, Verneinungen, Selbstkorrekturen | G1 | 🟡 60 % (CoS-Schätzung) — weitere Sonderfälle getestet (isolierter Erschwerniszuschlag, Altbelag-Verneinung beim Teppich, zugespitzte VOB-Übermessungsfrage), VOB-Regel daraus jetzt als Standard umgesetzt |
| 1.3 | Bestätigungskarte = Endberechnung (Karte-≠-Berechnung-Muster geschlossen) | G1 | 🟢 75 % — **21.08.2026 Abend: code-fertig, deployt UND erster Live-Test gelaufen.** Sandys Test fand einen echten Bug (Karte zeigte „Boden schützen 0 m²" statt 12 — leere `supabase_realtime`-Publication, nicht die Berechnung war falsch), Ursache gefunden und per DB-Migration gefixt. **Sandys Bestätigungs-Retest steht noch aus**, deshalb nicht höher. Quelle: CoS-002, `docs/cos-002-architektur-vorschlag.md` |
| 1.4 | Alle bestätigten Fälle als Golden Tests grün, kein Fix bricht still einen alten Fall | G1 | 🟡 75 % — **24.08.:** Head of Product Engineering meldet bei anderer Gelegenheit (CoS-017), dass 4 von 763 Tests bereits VOR seiner Arbeit rot waren, unabhängig davon (2 veraltete Katalog-Zählungen, 2 im PM-008-/Sockelleisten-Umfeld, noch nicht gegen die „live bestätigt behoben"-Fälle abgeglichen) — bisher nirgends gemeldet. Deshalb nicht mehr auf 80 %, obwohl CoS-002-Kernpfad weiterhin 236/236 grün bleibt. Aufräumen als **CoS-018** an Head of Product Engineering delegiert, kein direkter CI-Dashboard-Zugriff |
| 1.5 | Zahlen-/Größenordnungsfehler ausgeschlossen (siehe PM-010: „drei fünfzig" → 350) | G2 | 🟡 40 % — bleibt als bewusste Design-Entscheidung stehen (Whisper-Ebene, Rechnung selbst korrekt, Warnung statt stiller Korrektur) |
| 1.6 | Neu erkannte Positionstypen haben hinterlegte Standardpreise | G1 | 🟡 55 % — Kniestock, Dachschräge, Fassadenfläche streichen und Übergangsschiene jetzt alle mit Preis hinterlegt (20.08.), Live-Nachtest dafür steht noch aus |
| 1.7 | KI-Grenzen/Fehlerrate den Nutzern gegenüber transparent kommuniziert (kein 100 %-Versprechen) | G2 | ⚪ offen — nicht erhoben (neu) |
| 1.8 | Lasttest: mehrere gleichzeitige Aufnahmen/Nutzer ohne Fehler | G2 | ⚪ offen — nicht erhoben (neu) |
| 1.9 | Bekannte Sprach-/Dialekt-/Störgeräusch-Grenzen dokumentiert | G3 | ⚪ offen — nicht erhoben (neu) |

## 2. Accounts & Onboarding

| # | Punkt | Gate | Status |
|---|---|---|---|
| 2.1 | Registrierung, Login, Logout laufen sauber durch — komplett | G1 | 🟡 Registrierung/Login/Logout per Code-Review geprüft, sauber — Live-Nachtest steht aus (CoS-P-003) |
| 2.2 | E-Mail-Verifizierung wirklich zugestellt (nicht nur ausgelöst) | G1 | 🟢 läuft jetzt über unsere eigene Resend-Anbindung statt Supabase-eigenes Mailsystem — Fix umgesetzt, Live-Test steht aus (CoS-P-004) |
| 2.3 | Passwort-Zurücksetzen funktioniert | G1 | 🟢 Bug behoben (PKCE-Code-Tausch läuft jetzt über /auth/callback, „Link ungültig"-Anzeige statt Endlos-Ladeseite) — Live-Test steht aus (CoS-P-003) |
| 2.4 | Kompletter erster Durchlauf (erste Anmeldung → erstes Angebot) end-to-end | G1 | ⚪ offen — nicht erhoben |
| 2.5 | Account-Löschung möglich | G2 | 🟡 vermutlich vorhanden (Code existiert), kein QA-Test |
| 2.6 | Schutz vor automatisierten Massen-Registrierungen (Captcha/Rate-Limit) | G2 | ⚪ offen — nicht erhoben (neu) |
| 2.7 | Session-Sicherheit: Token-Ablauf sinnvoll, Logout wirklich überall wirksam | G1 | ⚪ offen — nicht erhoben (neu) |
| 2.8 | Erster Eindruck für brandneue Nutzer durchdacht (leere Zustände) | G1 | 🔴 30 % — DC-009 (leere Aufnahme als Erfolg) jetzt über DC-028 code-seitig mitgefixt, Live-Nachtest steht aus; PM-015-Fix behebt zusätzlich einen konkreten Fall: „manuell"-Onboarding landete bisher mit fast leerer Preisdatenbank |

## 3. Transaktions-E-Mails

| # | Punkt | Gate | Status |
|---|---|---|---|
| 3.1 | Pflicht-Mails werden wirklich versendet (Willkommen, Verifizierung, Reset) | G1 | 🟢 alle drei Mails laufen jetzt über dieselbe eigene Resend-Anbindung — Fix umgesetzt, Live-Zustellung ungetestet (CoS-P-004) |
| 3.2 | Absender korrekt, Links funktionieren, Inhalt stimmt, landen nicht im Spam | G1 | 🟡 DNS für sofortangebot.app geprüft: DKIM für Resend korrekt gesetzt, DMARC nur im Beobachtungsmodus (p=none) — Live-Spam-Test steht aus |
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
| 5.4 | Leere/Fehler-/Ladezustände überall sinnvoll gestaltet | G2 | 🔴 20 % — DC-009/010: widersprüchliche Fehler-/Erfolgs-Banner code-seitig gefixt (20.08., Root Cause war GPT-Nichtdeterminismus, nicht Race Condition), Live-Nachtest steht aus; die fehlende Guardrail beim Fertigstellen leerer Angebote (zweiter Teil von DC-010) bleibt offen |
| 5.5 | Statusfarben & Design-Tokens konsistent | G2 | 🟡 35 % — erste Migrationsrunde von DC-006 abgeschlossen (5 Kernkomponenten auf Tokens umgestellt), Großteil der >1.900 Fundstellen weiterhin offen; siehe auch DC-003, DC-007 |
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
| 8.2 | Race Condition ausgeschlossen (Summe stabil ohne Nutzeraktion) | G1 | 🟡 65 % — App-seitiger Doppel-Tap-Schutz UND (neu, 20.08., laut PM-014) ein DB-seitiges Unique-Constraint (`unique(quote_id, position)`, Migration `20260820103931`) mit Retry-bei-Konflikt sind jetzt beide live, 706/706 Tests grün. Bewusst nicht auf höher gesetzt: ein gezielter Gleichzeitigkeits-Test (zwei echte parallele Anfragen) ist noch nicht gefahren. Siehe Governance-Hinweis oben zu CoS-010 vs. PM-014 |
| 8.3 | Backups eingerichtet und einmal ein Restore getestet | G2 | 🟡 65 % — tägliches verschlüsseltes Backup läuft produktiv, Restore-Prozess definiert, aber kein protokollierter Restore-Test-Durchlauf sichtbar |
| 8.4 | Fehler-Monitoring: du merkst, wenn im Betrieb etwas bricht | G2 | 🔴 20 % — Health-Checks (`/api/health*`) und Kosten-Alarm existieren und funktionieren, aber Sentry deckt bisher nur den Kernpfad ab |
| 8.5 | OpenAI-Kosten pro Angebot bekannt und tragbar; Rate-Limits bedacht | G2 | ⚪ offen — nicht erhoben |
| 8.6 | Domain, SSL, Hosting-Konfiguration sauber | G2 | 🟡 50 % — läuft auf `www.sofortangebot.app` über Vercel, kein separater Sicherheitscheck dokumentiert |
| 8.7 | Verlässliche Kette Code-Fix → Deploy → tatsächlich live | G1 | 🟢 80 % — **21.08.2026 Abend: CoS-016 geklärt, kein offener Blocker mehr.** War kein System-/Architekturproblem, sondern ein technisches Detail von Head of Product Engineerings Fernzugriff (Git-Lock-Dateien nicht löschbar, nur verschiebbar) — inzwischen selbst gelöst, Sandy hat beide CoS-002-Commits gepusht, `main`/`origin/main` gleichauf. Nicht auf 100 %, weil der anschließende Live-Test zeigte, dass „deployt" allein nicht „korrekt live" garantiert (siehe 1.3) |
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
| 9.7 | Eigene Marke/CI final festgelegt (Farbe, Typografie, Logo, Icon-Sprache) | G2 | 🟡 35 % — **neu, 20.08.2026, ergänzt vom Chief of Staff** (Lücke aufgefallen: eine komplette neue Team-Rolle + fertige CI-Entscheidung hatten noch keinen Platz in dieser Datei). Richtung von Sandy final bestätigt („ok leg die CI fest", CoS-M-001), Referenz-Guide fertig (`docs/ci-guide.html`). Umsetzung im Produkt-Code läuft erst an (Schritt 1 von 10, Token-Aufräumung DC-006, in Arbeit; Farbe/Typografie/Mono-Zahlen/Icon-Set/Logomark-Vektorisierung noch offen) |

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
| 11.1 | Kleinunternehmergrenze (25.000 €) im Blick, steuerliche Anmeldung abgeschlossen | G2 | 🔴 20 % — Sandy hat bestätigt: noch kein Gewerbe für Sofortangebot separat angemeldet, Plan ist Kleingewerbe/Kleinunternehmerin nach §19 UStG (CoS-F-001). Entscheidung steht, Anmeldung selbst noch offen. Hängt weiterhin mit 7.1 zusammen (USt-ID) |
| 11.2 | Separate EÜR für Sofortangebot-Einnahmen | G2 | ⚪ offen — Sandys Bereich |
| 11.3 | Gewerbeanmeldung | — | ✅ erledigt (Sandy) |
| 11.4 | Geschäftskonto getrennt von privat | G1 | ⚪ offen — nicht erhoben, Sandys Bereich (neu) |
| 11.5 | Buchhaltungssystem angebunden (Lexware/sevDesk) | G2 | ⚪ offen — nicht erhoben, jetzt Platform-Engineer-Scope. Erste Machbarkeits-Prüfung (CoS-P/DC-029): kein natives Projekt-/Lieferadressfeld in der Lexware-API, Workaround als Freitext identifiziert, kein Blocker |
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
