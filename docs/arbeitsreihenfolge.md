# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 15.09.2026, 16:15 MESZ · Chief of Staff**
*(ersetzt die Fassung von 15:10 — diese Datei wird immer ersetzt, nie ergänzt)*

---

## Lage in drei Zeilen

**Produktion:** unverändert grün und live — `dpl_4K1yBgk`, Commit `2f93123`,
14:35 MESZ. Heute erneut bei Vercel abgefragt: **kein neueres Deployment.**
**Die CI ist rot**, an den Tests, nicht am Lint — Lauf `34969779950`,
`failure`, selbst abgefragt. **Kein neuer Lauf seit 14:35.**
**Seit der letzten Fassung ist nichts gepusht worden**, in keinem der drei
Kanäle. Es wartet an genau zwei Stellen: bei Engineering und bei Sandy.

---

## 🔴 Die rote CI — neu: die sieben Zeilen sind am Quelltext nachgesehen

Der Befund von 15:10 (keine der sieben Zeilen war je grün) hat jetzt eine
zweite Hälfte. Alle vier roten Dateien gehören zu **CoS-E-053** und halten eine
Vorgabe fest, **bevor** sie gebaut ist — das steht wörtlich in ihren eigenen
Kopfzeilen („bevor irgendetwas gebaut war", „VOR dem Knopf").

**Damit ist beides beantwortet: keine Regression, und die Zusicherungen sind
nicht versehentlich falsch.** Es fehlt an vier Stellen der Einbau:

| Datei | rot | fehlt |
|---|---|---|
| `pd010-tueranker.test.ts` | 4 | **ein einziger Wechsel** — Anker fürs Lackieren auf `Türen lackieren (2× Anstrich)` (90 €, Katalogzeile existiert), die zwei alten Innen-Zeilen raus |
| `preis-ableitung.test.ts` | 1 | ein Halbsatz bei **Fassade 1x** — bei Wand 1x und Decke 1x steht er schon |
| `taetigkeiten.test.ts` | 1 | zwei Rubriken mit Materialschalter ohne Tätigkeit (`Maler – Bodenbeschichtung` u. a.) — **fachliche Entscheidung**, nicht Reparatur |
| `materialanteil.test.ts` | 1 | **eine Zahl**: Anteil 25 % ergibt 8,62, Manfreds Beispiel 8,50 entspricht 26,1 % |

Die Nachweise Zeile für Zeile, mit Datei- und Zeilenangabe, stehen in
**CoS-E-055 Nachtrag 2**. Die Antwort „behoben (mit Commit) / offen (mit Datum
und Bedingung)" pro Zeile bleibt bei Engineering.

**Die Regel gilt weiter:** „Erwartet rot" gibt es nicht.

**Und was ich ausdrücklich nicht behaupte:** dass der Build durchgeht. Der Lauf
kam nach den Tests gar nicht mehr bis `npm run build`. Erst der nächste grüne
Testlauf sagt das.

---

## Was seit 15:10 dazugekommen ist

**Auf den drei geprüften Kanälen: nichts.** Kein Commit nach `2f93123`, kein
Deployment nach `dpl_4K1yBgk`, kein CI-Lauf nach `34969779950`.

**In `docs/` eine Datei:** `pruefmeister-notizen-fuer-designer.md` ist um
**PD-009** (Fläche oder Zeit, fachlich durchgesehen) und **PD-010** (der Anker
fürs Lackieren) gewachsen. Beides ist bei Engineering angekommen — PD-009 §3
ist in `preis-ableitung.ts` bereits eingebaut (Sockelleisten abkleben steht auf
0,015 h), PD-010 noch nicht. Das ist genau die Lücke aus Punkt 1 oben.

**Und ein Fund, der größer ist als gemeldet:** Es liegen **sieben** geänderte
Doku-Dateien auf Sandys Rechner, die nicht im Repository sind — in der Fassung
von 15:10 standen drei. Die Liste steht unten.

---

## Sandy — fünf Entscheidungen, alle auch in `entscheidungen-fuer-sandy.md`

| # | Was | Aufwand |
|---|---|---|
| 1 | **Den Prototyp anschauen** — `docs/dc-102-preise-prototyp.html` im Browser. Manfred hat ihn abgenommen, aber es ist dein Produkt und der Schritt, der über die Preise entscheidet | 10 Minuten |
| 2 | **Hook-Vorschlag entscheiden** (zweiter Checkout, 6–15 s pro Push). Empfehlung: ja | eine Antwort |
| 3 | **§-35a-Pflichtangaben** für GmbH-/UG-Betriebe — vor Gate 1 einplanen oder danach. Empfehlung: vor Gate 1 | eine Entscheidung |
| 4 | **`_to_delete/` löschen?** über 250 Dateien. Empfehlung: löschen | eine Entscheidung |
| 5 | Vercel-Benachrichtigung · Datenschutz-Freigabe · Versicherung · Stripe · KW 41 | unverändert |

**Und das, was nur sie tun kann — sieben Dateien committen.** Geprüft durch
Vergleich mit einem Klon von `main` auf `2f93123`:

`docs/arbeitsreihenfolge.md` · `docs/chief-of-staff-engineering-todos.md` ·
`docs/chief-of-staff-platform-todos.md` · `docs/chief-of-staff-legal-todos.md` ·
`docs/entscheidungen-fuer-sandy.md` · `docs/engineering-austausch.md` ·
`docs/pruefmeister-notizen-fuer-designer.md`

Die letzten beiden sind die wichtigen: **PD-009 und PD-010 existieren nur auf
ihrem Rechner.** Wer das Repository liest, findet die Begründung für die
Tür-Umstellung nicht, die die CI gerade rot hält.

---

## Head of Product Engineering

1. **🔴 CoS-E-055 beantworten** — die sieben roten Zusicherungen, pro Zeile
   „behoben" (mit Commit) oder „offen" (mit Datum und Bedingung). **Nachtrag 2
   in deiner Datei nimmt dir das Nachschlagen ab**: welche Datei, welche Zeile,
   was genau fehlt. Das geht vor allem anderen, weil die CI bis dahin rot
   bleibt und der nächste rote Lauf nicht mehr von diesem zu unterscheiden ist
2. **Der Tür-Anker ist die größte Einzelwirkung**: vier der sieben Zeilen
   hängen an einer Umstellung, und die Zielzeile im Katalog existiert bereits
3. **CoS-E-056 beantworten, bevor `taetigkeiten.ts` angefasst wird** — Manfred
   hat der Vorbelegung widersprochen, die du gestern aus seiner eigenen
   früheren Aussage abgeleitet hast. `taetigkeiten.test.ts` ist ohnehin eine
   der vier roten Dateien — beides in einem Durchgang
4. **CoS-E-053 weiterbauen**, mit den vier Legal-Bedingungen (Zeiger steht in
   deiner Datei). Der Preisanpassungs-Hinweis darf **nicht** aufs Kunden-PDF,
   bevor Sandy einen Wortlaut freigegeben hat — LR-16
5. **„Fläche oder Zeit" fachlich klären** (mit Prüfmeister) — **PD-009 liegt
   jetzt vor** und beantwortet es: drei Zeilen stehen falsch, vier Zeitwerte zu
   hoch, und die Basiswerte müssen aus `default-prices.ts` gezogen statt
   abgeschrieben werden

## Product Designer

1. **Einbau des Preise-Schritts**, gemeinsam mit Engineering
2. Live-Test von DC-101 / DC-103 / DC-104 / DC-089 am aktuellen Stand
3. DC-047 und DC-048 sind live — beide brauchen noch einen Blick in der
   laufenden App, nicht nur im Code
4. DC-105 („Wie stellst du Rechnungen?") ist eine Zeile und hängt an nichts

## Platform

1. **Wartet auf Sandys Hook-Entscheidung** (Punkt 2 oben)
2. **CoS-P-020** — Fehlertext in `api/integrations/test`, Mitnehmer vom
   Designer. Wenn er offen bleibt, eine Zeile, dass er bewusst offen bleibt
3. **CoS-P-021** — zwei Fragen zum Rechnungsnummernkreis. Einschätzung, keine
   Umsetzung, und ausdrücklich kein Löschen von Produktionsdaten
4. **CoS-P-022** — `docs-sichern.mjs pruefen` in die CI? Vorschlag liegt vor,
   Entscheidung bei euch
5. Migrations-Abgleich: gebaut, ausgeliefert, gegen `main` geprüft —
   **erledigt**

## Prüfmeister

1. **PD-009 und PD-010 sind geliefert** — Engineering hat sie. Was bleibt: die
   Gegenprobe aus PD-009 §7, sobald der Preise-Schritt gebaut ist (zwei
   Betriebe, 52 €/h und 75 €/h)
2. **Die 26,1 % aus Manfreds Beispiel** gegen die 25 % der Faustregel — eine
   Einschätzung, welche Zahl gilt. Sie hängt an Legal-Bedingung 3 zu CoS-E-053
   und verschiebt im Zweifel jede Innen-Position
3. **164 Vorlagen ohne Katalog-Zwilling** — die vierzehn Zeilen der aktiven
   Gewerke sind ein kurzer Durchgang, die 150 der gesperrten haben Zeit,
   gehören aber vor die jeweilige Freischaltung
4. **PM-002** braucht einen Live-Lauf
5. Fallbasis Richtung 100 — bleibt der limitierende Faktor für Gate-1-Punkt 1.1

## Legal

1. **§ 14 UStG — Pflichtangabenliste nachholen**, sobald die Normtexte
   abrufbar sind (CoS-L-006)
2. **Materialangabe auf dem Kunden-PDF bewerten** — Konzept Fassung 3 und
   Prototyp liegen vor; die vier Bedingungen sind an Engineering übergeben
3. CoS-L-002 · CoS-L-004 laufend

## Manfred

1. **Session 3: Registrierung end-to-end** — steht weiterhin aus. Beide
   Auth-Wege sind live bestätigt, er hat es noch nicht selbst durchlaufen
2. **DC-101 nachprüfen**, wie er es selbst verlangt hat: am Handy laden und
   **sofort** lostippen
3. **Rückfrage aus CoS-E-056:** Gilt „Tapete extra" bei ihm auch für Vlies,
   oder nur für Tapete?
4. **Neu, aus PD-009 §5:** Seine 75 % gegen die 63 % des Katalogs sind kein
   Widerspruch, sondern hängen daran, ob die Vorbereitung im m²-Preis steckt.
   Bei ihm steckt sie nicht drin — das ist zu bestätigen, nicht zu entscheiden
5. G.3 — seine zwei Szenarien in der laufenden App, offen seit 11.09.

---

## Was ich als Nächstes tue

**Den CI-Stand weiterverfolgen.** Der nächste Lauf nach Engineerings Antwort
ist der erste, der wieder etwas aussagt.

**Gate 1 rechne ich weiterhin nicht neu** — ich warte bewusst auf Manfreds
Session 3, sonst steht die Zahl wieder auf „ist deployt" statt auf
„funktioniert".

**Zum Ablauf dieses Laufs:** `node scripts/docs-sichern.mjs` ist erneut nicht
gelaufen (Shell-Einhängung seit dem Windows-Update vom 08.09. defekt). Gelesen
und geschrieben wurde über Staging/Commit, jeweils mit `expectedMtimeMs` aus
dem Staging. Die roten Zusicherungen wurden nicht abgeschrieben, sondern am
Quelltext eines frischen Klons von `main` (`2f93123`) nachgesehen.

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
