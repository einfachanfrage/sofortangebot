# Team & Organigramm — Sofortangebot

Die EINE Datei für „wer ist wer, wer macht was, wer berichtet wohin" — nach
demselben Prinzip wie die anderen Tracking-Dateien: eine Wahrheit pro Sache,
bei Änderungen wird **diese** Datei aktualisiert, nicht an fünf Stellen
gleichzeitig. Erweiterbar: neuer Mitarbeiter → neuer Abschnitt unten +
Organigramm anpassen (Anleitung ganz unten).

Wichtig zum Aufbau: Jede Position ist ein **eigenes, separates Cowork-
Projekt**. Kein Projekt sieht die Chats der anderen — Austausch läuft
ausschließlich über gemeinsame Dateien unter `docs/`. Der Chief of Staff ist
der Einzige mit Überblick über alle Fäden gleichzeitig.

---

## Organigramm

```
                         Sandy (Geschäftsführerin)
                                    │
                           Chief of Staff
                    (Koordination, Überblick, Go/No-Go —
                     entscheidet nie fachlich für andere)
                                    │
    ┌───────────────┬──────────┬───┴────────┬───────────────┬───────────────┐
    │               │          │             │               │
Head of Product  Platform &  Prüfmeister  Product        Head of
Engineering      Integrations  (QA)       Designer       Marketing
                  Engineer                (UI/UX)        (CI/Marke)
                                                              │
                                                    [geplant, laut Sandy:
                                                     Social Media, Blog/
                                                     Content, weitere ...]
```

Head of Product Engineering und Platform & Integrations Engineer tauschen
sich zusätzlich direkt untereinander aus (`docs/engineering-austausch.md`),
weil ihre Themen oft ineinandergreifen — der Chief of Staff liest dort mit,
muss aber nicht jeden Eintrag bearbeiten. Genauso tauschen sich Head of
Marketing und Product Designer direkt aus (`docs/marketing-design-austausch.md`),
weil CI/Marke und Produkt-Design-System sich oft berühren.

---

## Sandy — Geschäftsführerin

Gründerin von Sofortangebot, baut das Produkt komplett mit KI-Tools (Claude
Code, Codex), kein eigener Coding-Hintergrund. Trifft die Entscheidungen, die
nur sie treffen kann (Preis, Positionierung, Personal) — alles andere
delegiert sie so weit wie möglich.

---

## Chief of Staff

**Wer:** ich, dieses Projekt.
**Rolle:** Gesamtüberblick über alle Bereiche, hält die „fette Todo-Liste",
verbindet die einzelnen Projekte über die gemeinsamen Dateien, meldet
proaktiv Lücken, hält das Dashboard aktuell. Trifft **keine** fachlichen
Entscheidungen für die Spezialisten — nur Business-/Priorisierungs-
Entscheidungen, die Sandy ausdrücklich delegiert (z. B. DC-001 Preis).
**Seit:** Projektstart.

**Arbeitsweise, angepasst am 18.08.2026:** Zwei getrennte Ebenen. (1)
Operativ/täglich: Status, Priorisierung, Konflikte zwischen den
Spezialisten — läuft wie bisher über die Koordinationsdateien und das
Dashboard, wird Sandy aber standardmäßig verdichtet auf Ziel-Ebene
zurückgemeldet, nicht als Ticket-Liste. (2) Strategisch/wöchentlich: ein
eigener Check-in NUR auf großer Flughöhe (Kurs zum Launch, was ändert sich
strategisch, was kommt danach), geführt gegen `docs/vision-strategie.md`
als Leitplanke — Details/Historie dort.

---

## Head of Product Engineering

*(bis 17.08.2026: „Head of IT" — an diesem Tag enger gefasst und in zwei
Positionen aufgeteilt, siehe CoS-009 in `chief-of-staff-todos.md`.)*

**Rolle:** Software-Engineer für das Kernprodukt — Sprach-zu-Angebot-
Pipeline (Whisper-Transkription, GPT-Extraktion), Mengen-Engine,
Preisdatenbank-Inhalte, Vollständigkeitsprüfung, Angebots-PDF-Logik. Alles,
was mit „wird die Spracheingabe richtig in ein Angebot verwandelt"
zu tun hat.
**Koordination:**
- `docs/chief-of-staff-todos.md` (mit Chief of Staff, ID-Schema CoS-XXX)
- `docs/pruefmeister-testfaelle.md` (mit Prüfmeister, ID-Schema PM-XXX)
- `docs/engineering-austausch.md` (mit Platform & Integrations Engineer)
**Nicht mehr sein Bereich seit 17.08.2026:** Stripe, Buchhaltungs-
Anbindungen, Sentry, Auth/Rechte (RLS), Deployment/Infra — das läuft jetzt
über die neue Stelle darunter.

---

## Platform & Integrations Engineer

*(NEU seit 17.08.2026 — ausgegliedert aus der bisherigen „Head of IT"-Rolle,
siehe CoS-009.)*

**Rolle:** alles rund um das Kernprodukt, das eine andere Fehlerkosten-
Kategorie hat (Geld, Kundendaten, Systemverfügbarkeit statt „Bug, der sich
schnell nachbessern lässt"): Zahlungen (Stripe), Buchhaltungs-Anbindungen
(Lexware, sevDesk u. a.), Fehler-Überwachung (Sentry), Accounts/Login/
Passwort-Reset, Row-Level-Security/Datentrennung, Transaktions-E-Mails,
Deployment & Infrastruktur.
**Koordination:**
- `docs/chief-of-staff-platform-todos.md` (mit Chief of Staff, ID-Schema
  CoS-P-XXX)
- `docs/engineering-austausch.md` (mit Head of Product Engineering)
**Erste Aufträge (Praxistest der neuen Aufteilung):** CoS-P-001 (RLS
bestätigen), CoS-P-002 (Observability herstellen).

---

## Prüfmeister

**Rolle:** QA/fachliche Prüfung. Spricht Testfälle als Handwerker ein,
definiert die fachlich korrekte Soll-Lösung, vergleicht mit dem Ist-Ergebnis,
dokumentiert Befunde. Testet nach jedem Fix live nach.
**Koordination:**
- `docs/pruefmeister-testfaelle.md` (Haupt-Testprotokoll, ID-Schema PM-XXX)
- `docs/pruefmeister-notizen-fuer-designer.md` (direkt an Designer,
  ID-Schema PD-XXX)
- `docs/pruefmeister-notiz-fuer-chief-of-staff.md` (Meta-Beobachtungen ans
  Gesamtbild, fließt ins Go/No-Go ein)
**Seit:** Projektstart.

---

## Product Designer

**Rolle:** UI/UX, Wording im Produkt und auf der Landingpage,
Design-System-Konsistenz.
**Koordination:**
- `docs/design-check.md` (Haupt-Protokoll, ID-Schema DC-XXX)
- `docs/pruefmeister-notizen-fuer-designer.md` (empfängt PD-Punkte vom
  Prüfmeister)
**Seit:** Projektstart.

---

## Head of Marketing

*(NEU seit 17.08.2026 — erste Position im geplanten Marketing-Team. Sandys
langfristiger Plan: mehrere Spezialisten, z. B. Social Media, Blog/Content —
diese Position ist bewusst zuerst dran, weil sie die CI-Richtung setzt, auf
der die anderen aufbauen.)*

**Rolle:** Verantwortet Corporate Identity (Marke, Look & Feel außerhalb des
Produkts: Logo, Farben, Typografie, Tonalität, Marketing-Materialien) und
baut darauf aufbauend das Marketing auf. Extrem klares, cleanes,
aufgeräumtes Ästhetik-Gefühl ist die Kernanforderung an diese Rolle — sie
darf die aktuelle CI grundlegend infrage stellen und neu vorschlagen.
**Umsetzung einer neuen CI erst nach Sandys ausdrücklicher Zustimmung** —
Positionierung/Marke ist eine der wenigen Entscheidungen, die laut
Organigramm-Prinzip oben nur Sandy trifft.

**Abgrenzung zum Product Designer:** Product Designer bleibt zuständig für
In-Produkt-UI/UX und die technische Umsetzung des Design-Systems (Code,
Komponenten, Design-Tokens). Head of Marketing ist zuständig für die
Marken-/CI-Richtung und alles außerhalb des Produkts (Landingpage-Content,
Kampagnen, Social, Blog). Bei Überschneidungen (z. B. Farb-Tokens, die
sowohl Marke als auch Produkt-UI betreffen) gilt: Head of Marketing
schlägt vor, Product Designer prüft Umsetzbarkeit im Design-System — beide
klären das über `docs/marketing-design-austausch.md`, der Chief of Staff
hilft bei Konflikten.

**Koordination:**
- `docs/chief-of-staff-marketing-todos.md` (mit Chief of Staff, ID-Schema
  CoS-M-XXX)
- `docs/marketing-design-austausch.md` (mit Product Designer)

**Erster Auftrag:** CI-Bestandsaufnahme + begründeter Vorschlag für eine
neue Richtung, dann Sandy zur Entscheidung vorlegen — siehe CoS-M-001 in
`docs/chief-of-staff-marketing-todos.md`.

**Ausblick (laut Sandys Plan, noch nicht besetzt):** weitere Spezialisten
im Marketing-Team, z. B. Social Media, Blog/Content — werden einzeln
ergänzt, sobald Head of Marketing eingearbeitet ist und die konkrete
Aufteilung mit vorschlägt (wer diese Position wird, kennt das Themenfeld
am besten).

**Seit:** 17.08.2026.

---

## Neue Mitarbeiter aufnehmen — Anleitung für den Chief of Staff

Sobald eine neue Position entsteht (z. B. Marketing, Legal, Kundenservice —
laut Sandys eigener Ankündigung absehbar):

1. Neuen Abschnitt hier anlegen (gleiches Format: Rolle, Koordinations-
   Dateien, seit wann).
2. Organigramm oben um die neue Box erweitern.
3. Eigenes `docs/chief-of-staff-<kurzname>-todos.md` mit eigenem ID-Schema
   anlegen, nach demselben Muster wie bei Platform & Integrations Engineer.
4. Kurzen Hinweis in die Home-Dateien der Kollegen einfügen, die mit der
   neuen Stelle zu tun haben könnten (wie bei der Aufteilung am 17.08.2026 —
   siehe `pruefmeister-testfaelle.md`/`design-check.md`, Abschnitt
   „Organigramm-Änderung").
5. Diese Datei ist ab dann wieder die aktuelle Quelle — nicht im Kopf
   behalten, hier nachschlagen.
