# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 15.09.2026, 16:45 MESZ · Chief of Staff**
*(ersetzt die Fassung von 16:15 — diese Datei wird immer ersetzt, nie ergänzt)*

---

## Lage in drei Zeilen

**Produktion:** grün und live — `dpl_4K1yBgk`, Commit `2f93123`.
**Die CI ist rot**, an den Tests, nicht am Lint — Lauf `34969779950`, `failure`.
Die sieben Zeilen sind am Quelltext nachgesehen (CoS-E-055 Nachtrag 2).
**Sandy hat gepusht:** `db5d9d9` liegt auf `main`, selbst nachgeprüft. Die
Doku ist damit vollständig im Repository — PD-009 und PD-010 eingeschlossen.
**Und sie hat vier Entscheidungen auf einmal beantwortet.** Alle vier sind
verteilt. Die Sandy-Tabelle ist zum ersten Mal seit Tagen fast leer.

---

## ✅ Vier Entscheidungen von Sandy, alle verteilt

| Was | Antwort | liegt jetzt bei |
|---|---|---|
| Push-Hook, zweiter Checkout | **ja** | Platform — **CoS-P-023** |
| § 35a Pflichtangaben | **ja, vor Gate 1** | Legal **CoS-L-008** (Feldliste) · Engineering **CoS-E-057** (Einbau) |
| `_to_delete/` löschen | **ja** | Sandy selbst — ich habe keinen Shell-Zugriff auf ihren Rechner |
| DC-102-Prototyp | **freigegeben** | Designer — **DC-102 ✅** |

**Wichtig zur Prototyp-Freigabe:** Sie betrifft **Ablauf und Darstellung**,
nicht die Zahlen im Prototyp. Die hat der Prüfmeister in PD-009 durchgesehen,
und dort stehen drei falsch eingeordnete Zeilen, vier zu hohe Zeitwerte und
abweichende `basis`-Werte. Beim Einbau werden die Basiswerte aus
`default-prices.ts` gezogen, nicht aus dem Prototyp abgeschrieben.

---

## 🔴 Die rote CI — unverändert, aber vollständig aufgeschlüsselt

Kein neuer CI-Lauf seit 14:35; `db5d9d9` ist ein reiner Doku-Commit. Der Stand
von 16:15 gilt: **keine Regression, und die Zusicherungen sind nicht
versehentlich falsch** — an vier Stellen fehlt der Einbau.

| Datei | rot | fehlt |
|---|---|---|
| `pd010-tueranker.test.ts` | 4 | **ein einziger Wechsel** — Anker fürs Lackieren auf `Türen lackieren (2× Anstrich)` (90 €, Katalogzeile existiert), die zwei alten Innen-Zeilen raus |
| `preis-ableitung.test.ts` | 1 | ein Halbsatz bei **Fassade 1x** — bei Wand 1x und Decke 1x steht er schon |
| `taetigkeiten.test.ts` | 1 | zwei Rubriken mit Materialschalter ohne Tätigkeit — **fachliche Entscheidung**, nicht Reparatur |
| `materialanteil.test.ts` | 1 | **eine Zahl**: Anteil 25 % ergibt 8,62, Manfreds Beispiel 8,50 entspricht 26,1 % |

Nachweise mit Datei- und Zeilenangabe: **CoS-E-055 Nachtrag 2**. Die Antwort
„behoben (mit Commit) / offen (mit Datum und Bedingung)" pro Zeile bleibt bei
Engineering. **„Erwartet rot" gibt es nicht.**

**Und was ich weiterhin nicht behaupte:** dass der Build durchgeht. Der Lauf
kam nach den Tests gar nicht mehr bis `npm run build`.

---

## Sandy — was noch offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | **`_to_delete/` löschen** — entschieden, aber ich kann es nicht ausführen. Befehl liegt ihr vor | ein Befehl |
| 2 | Vercel-Benachrichtigung · Datenschutz-Freigabe · Versicherung · Stripe · KW 41 | unverändert |
| 3 | **Neu, sobald Engineering antwortet:** der Materialanteil innen — 25 % oder Manfreds 26,1 %. Kommt erst zu ihr, wenn Prüfmeister und Engineering sich nicht einig sind | noch nicht fällig |

**Zu committen ist nichts mehr offen gewesen** — bis zu diesem Lauf. Die
Dateien dieses Laufs liegen wieder auf ihrem Rechner und nicht im Repository:
`arbeitsreihenfolge.md`, `chief-of-staff-engineering-todos.md`,
`chief-of-staff-platform-todos.md`, `chief-of-staff-legal-todos.md`,
`design-check.md`, `entscheidungen-fuer-sandy.md`.

---

## Head of Product Engineering

1. **🔴 CoS-E-055 beantworten** — die sieben roten Zusicherungen, pro Zeile
   „behoben" (mit Commit) oder „offen" (mit Datum und Bedingung). **Nachtrag 2
   nimmt dir das Nachschlagen ab.** Das geht vor allem anderen
2. **Der Tür-Anker ist die größte Einzelwirkung**: vier der sieben Zeilen
   hängen an einer Umstellung, und die Zielzeile im Katalog existiert bereits
3. **CoS-E-056 beantworten, bevor `taetigkeiten.ts` angefasst wird** —
   `taetigkeiten.test.ts` ist ohnehin eine der vier roten Dateien
4. **CoS-E-053 weiterbauen**, mit den vier Legal-Bedingungen. Der
   Preisanpassungs-Hinweis darf **nicht** aufs Kunden-PDF, bevor Sandy einen
   Wortlaut freigegeben hat — LR-16
5. **CoS-E-057 — neu, von Sandy freigegeben:** Rechtsform-Auswahl und die
   §-35a-Pflichtfelder im Betriebsprofil, vor Gate 1. **Nach** der roten CI,
   und erst, wenn Legal die Feldliste geliefert hat (CoS-L-008). Es ist ein
   Schema-Wechsel an `companies` — Migration **und** Eintrag in
   `check_migrationen.sql`, der Abgleich ist seit heute scharf

## Product Designer

1. **DC-102 ist von Sandy freigegeben** — die Freigabe-Sperre ist weg. Der
   Einbau hängt weiter an CoS-E-053 und an der roten CI; vier der sieben roten
   Zusicherungen gehören zu genau diesem Schritt
2. **Die Zahlen im Prototyp sind nicht mitfreigegeben** — PD-009 lesen, bevor
   die Tabelle übernommen wird
3. Live-Test von DC-101 / DC-103 / DC-104 / DC-089 am aktuellen Stand
4. DC-047 und DC-048 sind live — beide brauchen noch einen Blick in der
   laufenden App, nicht nur im Code

## Platform

1. **CoS-P-023 — der Hook ist freigegeben, bauen.** Zweiter, isolierter
   Checkout gegen den tatsächlich gepushten Commit. 6–15 s pro Push sind
   akzeptiert; deutlich mehr ist eine Rückmeldung wert
2. **Mit im selben Lauf:** `pruefe-migrationsliste.mjs` in den Hook, und der
   zurückgestellte Designer-Vorschlag ist entsperrt
3. **CoS-P-020** — Fehlertext in `api/integrations/test`. Wenn er offen
   bleibt, eine Zeile, dass er bewusst offen bleibt
4. **CoS-P-021** — zwei Fragen zum Rechnungsnummernkreis. Einschätzung, keine
   Umsetzung, kein Löschen von Produktionsdaten
5. **CoS-P-022** — `docs-sichern.mjs pruefen` in die CI? **Nicht** von Sandy
   mitentschieden, das ist eure Entscheidung und steht weiter offen

## Prüfmeister

1. **Die 26,1 % aus Manfreds Beispiel gegen die 25 % der Faustregel** — eine
   Einschätzung, welche Zahl gilt. Sie hängt an Legal-Bedingung 3 zu CoS-E-053
   und verschiebt im Zweifel jede Innen-Position. Das ist die einzige der
   sieben roten Zeilen, die fachlich bei dir liegt und nicht bei Engineering
2. Die Gegenprobe aus PD-009 §7, sobald der Preise-Schritt gebaut ist (zwei
   Betriebe, 52 €/h und 75 €/h)
3. **164 Vorlagen ohne Katalog-Zwilling** — die vierzehn Zeilen der aktiven
   Gewerke sind ein kurzer Durchgang, die 150 der gesperrten haben Zeit
4. **PM-002** braucht einen Live-Lauf
5. Fallbasis Richtung 100 — bleibt der limitierende Faktor für Gate-1-Punkt 1.1

## Legal

1. **CoS-L-008 — neu und vordringlich:** Sandy hat § 35a vor Gate 1
   freigegeben. Engineering wartet auf die abschließende Feldliste je
   Rechtsform (e. K. und GmbH & Co. KG sind nicht dieselbe wie GmbH/UG), auf
   die Abgrenzung PDF gegen Produkt-E-Mails, und darauf, was bei einem
   unvollständigen Profil passieren soll
2. **§ 14 UStG — Pflichtangabenliste nachholen**, sobald die Normtexte
   abrufbar sind (CoS-L-006)
3. **Materialangabe auf dem Kunden-PDF bewerten** — Konzept Fassung 3 und
   Prototyp liegen vor; die vier Bedingungen sind an Engineering übergeben
4. CoS-L-002 · CoS-L-004 laufend

## Manfred

1. **Session 3: Registrierung end-to-end** — steht weiterhin aus
2. **DC-101 nachprüfen**: am Handy laden und **sofort** lostippen
3. **Rückfrage aus CoS-E-056:** Gilt „Tapete extra" bei ihm auch für Vlies?
4. **Aus PD-009 §5:** Seine 75 % gegen die 63 % des Katalogs sind kein
   Widerspruch — sie hängen daran, ob die Vorbereitung im m²-Preis steckt. Bei
   ihm steckt sie nicht drin; das ist zu bestätigen, nicht zu entscheiden
5. G.3 — seine zwei Szenarien in der laufenden App, offen seit 11.09.

---

## Was ich als Nächstes tue

**Den CI-Stand weiterverfolgen.** Der nächste Lauf nach Engineerings Antwort
ist der erste, der wieder etwas aussagt.

**Gate 1 rechne ich weiterhin nicht neu** — ich warte bewusst auf Manfreds
Session 3, sonst steht die Zahl wieder auf „ist deployt" statt auf
„funktioniert".

**Zum Ablauf dieses Laufs:** `node scripts/docs-sichern.mjs` ist erneut nicht
gelaufen (Shell-Einhängung seit dem Windows-Update vom 08.09. defekt) —
derselbe Grund, aus dem ich `_to_delete/` trotz Sandys Freigabe nicht selbst
löschen kann. Gelesen und geschrieben wurde über Staging/Commit, jeweils mit
`expectedMtimeMs`. `design-check.md` wurde vor dem Schreiben neu eingelesen,
weil der Designer-Lauf sie zwischenzeitlich verlängert hatte.

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
