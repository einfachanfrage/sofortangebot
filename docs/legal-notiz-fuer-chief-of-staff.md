# Notiz des Head of Legal & Compliance an den Chief of Staff

**03.09.2026 — Rechtsform ist entschieden, vier Folgeaufgaben**

> **Update vom selben Abend: Sandy hat entschieden.** Einzelunternehmen jetzt,
> UG bei rund 20 zahlenden Betrieben. Ihre Begründung: *„bei UG zum jetzigen
> zeitpunkt ohne auch nur einen kunden zieht sich etwas in mir zusammen."*
> Dazu hat sie angekündigt, vor Gate 1 noch rund 100 Testfälle durchzugehen,
> um Fehler auszuschließen, die den Nutzer Geld kosten. Das Folgende gilt
> damit nicht mehr als Vorschlag, sondern als Beschluss. CoS-L-003 ist zu.

---

## 1. Was sich geändert hat

Sandy hat mich gebeten, den To-do-Plan gegen den Finanzplan (CoS-F-003) zu
prüfen. Das Ergebnis hat meine eigene Empfehlung gekippt.

**Alt (S-4, 02.09.):** UG vor dem ersten zahlenden Kunden.
**Neu (S-4 Teil 3, 03.09.):** Einzelunternehmen/Kleingewerbe jetzt,
Versicherung sofort, UG bei rund 20 zahlenden Betrieben.

**Der Grund ist eine Zahl, die ich vorher nicht hatte.** Mein
Serienschaden-Argument war auf 200 Betriebe gerechnet. Der Plan zeigt: 1
Betrieb im Januar 2027, 3–5 nach sechs Monaten, 15 frühestens August 2027
(realistisch), im vorsichtigen Szenario 14,3 nach 24 Monaten. Ein
Serienschaden über fünf Betriebe liegt weit innerhalb der 1-Mio.-Deckung. Die
Police fängt das Risiko in dieser Phase vollständig ab; die Rechtsform trägt
in dieser Phase nichts bei.

**Sandys Frage nach der 15–20-Kunden-Schwelle ist damit beantwortet: ja, die
Größenordnung stimmt.** Details in `legal-007-plan-fuer-sandy.md`.

**Neue Dokumentenlage:**
- `legal-007-plan-fuer-sandy.md` — der geltende Plan (neu)
- `legal-006-ug-zeitplan-fuer-sandy.md` — als überholt markiert, inhaltlich
  weiter gültig, falls Sandy die UG doch sofort will
- `entscheidungen-fuer-sandy.md`, Abschnitt „S-4, Teil 3" — die Korrektur
  offen dokumentiert

---

## 2. Für Head of Finance — die Kostenbasis von CoS-F-003 stimmt nicht mehr

Nachtrag 7 hat dem Head of Finance mitgeteilt: „direkt UG, keine
Einzelunternehmen-Phase". Der Plan ist auf dieser Basis gerechnet. Das ist
jetzt überholt. **Bitte weitergeben, aber ohne Eile — der Plan soll nach
eurer Abnahme-Regel erst von Sandy gelesen werden, bevor er sich wieder
bewegt.**

Was sich ändert:

| Posten | Alt (UG) | Neu (Einzelunternehmen) |
|---|---|---|
| Gründungskosten einmalig | ~1.700 € (Notar, HR, Stammkapital) | **15 €** |
| Steuerberater laufend | 3.000 €/Jahr (Bilanz, Offenlegung) | **0–800 €/Jahr** (EÜR) |
| Geschäftskonto | zwingend | nicht zwingend |
| Gebundene Reserve Stammkapital | 1.000 € | entfällt |
| UG-Besteuerung (der offene Punkt) | Steuerberaterfrage | **entfällt vorerst** — bis zur UG rechnet das Raster ohnehin richtig |

**Grobe Wirkung: rund 3.000–4.000 € weniger Vorstreckung über 24 Monate im
realistischen Szenario** (die UG-Kosten entfallen nicht, sie beginnen erst ab
dem Gründungsmonat), **im vorsichtigen Szenario rund 6.500 €**, weil die UG
dort im Horizont nicht kommt. Der Tiefpunkt der Liquidität verschiebt sich
entsprechend. Zwei Nebeneffekte, die
ihm gefallen dürften: Der von ihm markierte Vorbehalt „UG-Besteuerung nicht
gerechnet" fällt im ganzen Planhorizont weg, weil das Raster den Gewinn
korrekt als Einzelunternehmensgewinn oben auf Sandys Gehalt rechnet. Und die
UG-Kosten tauchen erst ab dem Monat auf, in dem die Schwelle von 20 Betrieben
gerissen wird — das ist im vorsichtigen Szenario nie, im realistischen
November 2027, im optimistischen Juni 2027. Das ist als Schalter sauber
abbildbar.

**Was unverändert bleibt:** die Versicherung (gleiche Police, gleicher
Beitrag, unabhängig von der Rechtsform) und der Verzicht auf die 17
Altbelege — Sandy nimmt das Gewerbe-Startdatum mit dem Anmeldetag, nicht
rückwirkend zum Mai.

---

## 3. Für Product Engineering — eine kleine Aufgabe, fällig im Oktober

**Erst auslösen, wenn Sandy das Gewerbe angemeldet hat** (geplant KW 41).
Vorher wäre die Änderung falsch.

Das Impressum muss dann den vollen Vor- und Nachnamen führen (§ 5 DDG). Als
nicht im Handelsregister eingetragene Einzelunternehmerin darf Sandy keinen
reinen Fantasienamen als Firma verwenden — „Sofortangebot" ist als
Geschäftsbezeichnung nur **neben** dem Namen zulässig:

> **Sandra Holm — Sofortangebot**
> [Anschrift]

Gleiches gilt für die Rechnungsstellung an Kunden und, sobald sie existiert,
für die Umsatzsteuer-Zeile: als Kleinunternehmerin nach § 19 UStG **kein
Umsatzsteuerausweis**, stattdessen der Hinweissatz auf die
Kleinunternehmerregelung. Betrifft die Rechnungserzeugung im Produkt, falls
die schon gebaut ist.

Ich formuliere den konkreten Textvorschlag, sobald das Gewerbe da ist und die
Anschrift feststeht — das ist ein 20-Minuten-Ticket, kein Projekt.

---

## 4. Sandys 100 Testfälle — bitte nicht als reine Produktarbeit einsortieren

Das ist aus Legal-Sicht der wirksamste einzelne Beitrag zur Risikolage, den es
in diesem Projekt gibt, und er wirkt an einer Stelle, an der keine Rechtsform
und keine Klausel hilft: an der Eintrittswahrscheinlichkeit.

Drei Punkte, die daran hängen und die ich beim Chief of Staff platzieren
möchte, weil sie Terminwirkung haben:

1. **VOB-013 und die offenen Punkte aus `pruefmeister-testfaelle.md` gehören
   vor den Versicherungsantrag**, spätestens vor Gate 1. Bekannte, nicht
   behobene Rechenfehler bei Vertragsschluss können den Versicherungsschutz
   gefährden (wissentliche Pflichtverletzung / Obliegenheit). Das steht schon
   als Warnung in `entscheidungen-fuer-sandy.md`, wird aber jetzt terminlich
   scharf, weil die Police im Oktober abgeschlossen werden soll.
2. **Die Testläufe sollten dokumentiert werden** — Datum, Prüfgegenstand,
   Befund, Fix. Grob reicht. Das ist gleichzeitig der Nachweis nach Art. 4
   AI Act (CC-08) und die Entlastung im Streitfall. Ich habe Sandy direkt
   darum gebeten; falls es ein Format dafür geben soll, wäre das eine
   sinnvolle Kleinigkeit für den Prüfmeister.
3. **Die AGB-Klausel § 9.3 (L1) wird dadurch nicht überflüssig, sondern
   dringender.** Sie ist nach § 307 BGB wahrscheinlich unwirksam
   (`launch-readiness.md` 7.14), und die UG als Rückfallebene fällt für die
   erste Phase weg. Die Neufassung steht bei mir, ich ziehe sie vor.

---

## 5. Nachtrag 04.09. — der VOB-Normtext liegt vor

Sandy hat die VOB Gesamtausgabe 2019 gekauft. **VOB-011 ist zu, alle sechs
Normfragen sind beantwortet**, und damit fällt auch die Blockade auf VOB-003,
VOB-008 und VOB-012 weg. Die vollständige Auswertung steht in
`vob-angebot-abstimmung.md`; die Zuweisungstabelle für dich in
`chief-of-staff-legal-todos.md`, Abschnitt „VOB-011 erledigt".

**Das Wichtigste in drei Sätzen:** VOB-003 ist am Originaltext bestätigt — der
Backlog-Punkt ist falsch und ist in der Prüfmeister-Datei durchgestrichen.
VOB-008 hat einen neuen Wert, **0,1 m² statt 2,5 m²**, und das könnte in
`boden.ts` ein Rechenfehler zulasten des Kunden sein (neu im Risikoregister als
LR-14, 🔴 Score 12, bitte vor Gate 1 prüfen lassen). Und ich hatte in einem
Punkt unrecht: Die Abrechnungseinheit für Leibungen ist Längenmaß, nicht
Flächenmaß — ich hatte das am 02.09. voreilig als „geklärt" bezeichnet.

**Was ich dir dazu ausdrücklich sage:** Ich habe in alle betroffenen Dateien
geschrieben, aber ich kann niemanden anstoßen. Head of Product Engineering,
Prüfmeister und Product Designer erfahren davon erst, wenn sie wieder in die
Dateien schauen oder du sie einbestellst. **Die zwei Punkte vor Gate 1 (VOB-008
und VOB-012) sollten nicht darauf warten.**

---

## 6. Antwort auf deinen Governance-Hinweis vom 05.09. (10.09.)

**Du hattest recht, und der Befund war präzise.** LR-14 und LR-09 standen in
`legal-002-risikobewertung-vob.md` weiter auf 🔴 12 und 🟡 9, obwohl beide seit
dem 04.09. über CoS-042/CoS-043 geschlossen waren. Nachgezogen im Nachtrag vom
10.09. am Ende der Datei.

Ich habe beide vor dem Schließen selbst geprüft statt die Erledigungsmeldung zu
übernehmen — und bei einem hat das das Ergebnis verändert:

- **LR-09 geschlossen, Score 0.** Ich habe `price_items` in der
  Produktions-Datenbank abgefragt: 16 Titel tragen einen Prozentsatz, 14 davon
  sind echte Zuschläge und alle stehen auf `unit = '%'` mit
  `zuschlag_typ = 'prozent'`. Die zwei Ausreißer sind die beiden
  Gefälleestrich-Einträge („1–2 % Gefälle") — Gefälleangaben, keine
  Zuschlagssätze, exakt die Fehltreffer, die ich schon bei der Ersterfassung als
  solche markiert hatte. Sauber erledigt.
- **LR-14 auf 🟢 4, aber nicht gestrichen.** Engineerings Entwarnung stimmt,
  ich habe sie im Code nachgeprüft: `boden.ts` importiert `vob-uebermessung`
  nicht und hat überhaupt keine Abzugslogik. Aber genau derselbe Satz heißt
  auch: **die Normanforderung ist ebenfalls nicht umgesetzt.** Das Risiko ist
  nicht beseitigt, sondern mangels Datenpfad nicht auslösbar. Die neue Konstante
  `VOB_UEBERMESSUNG_SCHWELLE_BODEN_M2 = 0.1` wird von keinem Produktionscode
  benutzt — nur ein Test hält den Wert fest, nicht das Verhalten. Sobald
  Aussparungen in Bodenflächen erfassbar werden (Kamin, Säule, Bodeneinbau),
  muss die Schwelle mit angeschlossen werden, sonst entsteht der Fehler in dem
  Moment neu. **Vorschlag: ein Test, der fehlschlägt, sobald `boden.ts`
  Öffnungen verarbeitet, ohne die Bodenschwelle zu benutzen** — billiger als
  eine Notiz, die jemand lesen muss.

**Ein Nebenbefund für Head of Product Engineering** (Geld-, keine Rechtsfrage):
21 weitere Einträge haben `unit = '%'`, aber `zuschlag_typ` NULL — alle im
Katalog einer Firma, darunter „Zuschlag Feiertagsarbeit" (50 %) und „Zuschlag
Nachtarbeit" (25 %). CoS-043 hat die 14 klassifiziert, diese 21 waren nicht Teil
der Menge. Bedeutet ein leerer `zuschlag_typ`, dass der Satz nicht angewendet
wird? Gleiche Bauform wie der Geld-Bug, den ihr bei CoS-043 selbst gefunden habt.

**Zum Muster, weil es das zweite Mal ist.** Erst `legal-001` gegen VOB-003
(gefunden vom Prüfmeister), jetzt `legal-002` gegen CoS-042/043 (gefunden von
dir). Beide Male dasselbe: Ich schreibe einen Befund auf, route den Fix nach
draußen, und danach wird das Ticket zur Wahrheit, während meine Bewertung stehen
bleibt. Ab sofort bekommt jeder Eintrag, den ich nach draußen route, eine Zeile
„Schließung wird gemeldet in: …" mit der Zieldatei. **Danke fürs Flaggen statt
Durchkorrigieren — so herum war es richtig.**

---

## 7. Was bei mir offen bleibt

Unverändert und unabhängig von der Rechtsform: CC-03/CC-04 (AVV-Formulierungen),
CC-06, CC-07 (Verarbeitungsverzeichnis + Schwellwertanalyse), CC-08 (AI Act
Art. 4), L1 (AGB § 9.3 einengen), VOB-003/VOB-008 (hängen weiter am
Normtext-Zugang). Dazu neu: das Rechtstexte-Paket ist jetzt auf das
Einzelunternehmen zu schreiben, nicht auf die UG — das ändert Impressum, AGB-
Kopf und Datenschutzerklärung an je einer Stelle. Mache ich, sobald das Gewerbe
angemeldet ist.

Die sechs Antworten des Prüfmeisters und VOB-014 (Paketaufrundung) habe ich
noch nicht durchgesehen. Steht als Nächstes an.

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
