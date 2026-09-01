# Legal-Risikobewertung — VOB & Angebotserstellung

**Datum:** 2026-09-01
**Bewertung durch:** Head of Legal & Compliance
**Gegenstand:** Rechtliche Risiken aus der Mengenermittlung und der
Angebotserstellung (VOB-001 bis VOB-012 aus
`docs/vob-angebot-abstimmung.md`), ergänzt um die zwei Punkte aus CoS-L-001,
die unmittelbar am Angebots-PDF hängen.
**Privilegiert:** nein — dieses Dokument ist nicht anwaltlich privilegiert.
Bei einem echten Streit ist es im Zweifel vorlagepflichtig. Das ist bewusst so
und ändert nichts daran, dass wir Funde offen dokumentieren; es ist nur ein
Grund, keine Formulierungen zu wählen, die schlimmer klingen als die Sache ist.

> **Kein Ersatz für anwaltliche Beratung.** Die Einstufungen sind meine
> Einschätzung, nicht die eines zugelassenen Anwalts. Drei Punkte sollten
> extern gegengeprüft werden — siehe Abschnitt „Externe Beratung".

---

## Vorbemerkung 1: Das Rahmenwerk musste angepasst werden

Die Standard-Severity-Skala misst in Prozent des Vertrags-/Deal-Werts. Das
passt hier nicht direkt, weil zwei verschiedene Verträge im Spiel sind: unser
Abo-Vertrag mit dem Handwerker (ein paar hundert Euro im Jahr) und sein
Werkvertrag mit dem Endkunden (ein paar tausend Euro je Auftrag). Ein Risiko,
das 100 % eines Werkvertrags kostet, ist absolut betrachtet klein, für den
betroffenen Betrieb aber existenziell spürbar.

Ich bewerte deshalb **Severity nach dem Schaden im jeweils betroffenen
Verhältnis** und mache die absolute Größenordnung jedes Mal dazu, damit die
Zahl nicht in der Luft hängt.

## Vorbemerkung 2: Zwei Risikoebenen, und das ist der wichtigste Gedanke hier

Fast alle VOB-Befunde erzeugen Risiko zunächst **nicht bei uns**, sondern beim
Handwerker:

- **Ebene A — Risiko des Handwerkers gegenüber seinem Endkunden.** Sein Angebot
  weist Mengen aus, die er im Streit nicht begründen kann. Er verliert Geld
  oder einen Kunden. Uns kostet das direkt nichts.
- **Ebene B — Risiko von Sofortangebot.** Erreicht uns über drei Wege:
  (1) der Handwerker nimmt uns nach § 280 BGB in Anspruch, weil unser Werkzeug
  den Schaden verursacht hat; (2) Wettbewerbsrecht — eine Werbeaussage, die
  nicht stimmt, kann jeder Mitbewerber und jede Wettbewerbszentrale angreifen;
  (3) Reputation — „KI-Software rechnet Handwerkerkunden zu viel Fläche" ist
  eine Geschichte, die sich gut erzählt, unabhängig davon, ob sie juristisch
  trägt.

**Der Fehler wäre, Ebene A als „nicht unser Problem" abzuhaken.** Das
Produktversprechen lautet, dass am Ende ein belastbares Angebot herauskommt.
Ein Werkzeug, das systematisch angreifbare Angebote erzeugt, verfehlt genau
die Pflicht, die es verkauft — und damit sind wir wieder bei der
Kardinalpflicht-Argumentation aus `legal-001-bestandsaufnahme.md`, Abschnitt
A5: Der Haftungsausschluss in AGB § 9.3 greift ausgerechnet dort am
schlechtesten, wo er am nötigsten wäre. Ebene A wandelt sich über diesen Weg in
Ebene B.

Ich gebe deshalb bei jedem Risiko an, auf welcher Ebene es zuerst wirkt.

---

## Risikoregister

| ID | Risiko | Ebene | Kategorie | Sev | Lik | Score | Level | Owner |
|---|---|---|---|---|---|---|---|---|
| **LR-01** | Übermessung erreicht das Kunden-PDF nicht — VOB/C nicht einbezogen | A → B | Vertrag / Verbraucher | 4 | 4 | **16** | 🔴 RED | Head of Product Eng. |
| **LR-02** | Verschnitt als Mengenaufschlag statt im Einheitspreis | A → B | Vertrag / Verbraucher | 3 | 4 | **12** | 🟠 ORANGE | Prüfmeister → Sandy |
| **LR-03** | Normlage nur über Sekundärquellen belegt | B | Compliance-Grundlage | 3 | 4 | **12** | 🟠 ORANGE | Sandy (VOB-011) |
| **LR-04** | Wertersatz-Erklärung fehlt auf der Widerrufsseite | A | Verbraucher | 4 | 3 | **12** | 🟠 ORANGE | Head of Product Eng. |
| **LR-05** | Keine Unternehmer-Prüfung bei der Registrierung | B | Verbraucher / Vertrag | 4 | 3 | **12** | 🟠 ORANGE | Head of Product Eng. |
| **LR-06** | Geplanter Leibungs-„Fix" würde korrektes Verhalten zerstören | A | Produktqualität | 3 | 4→1 | **12→3** | 🟠→🟢 | Head of Product Eng. |
| **LR-07** | Drei verschiedene Verschnittsätze — Angebot widerspricht sich selbst | A → B | Vertrag / UWG | 3 | 3 | **9** | 🟡 YELLOW | Head of Product Eng. |
| **LR-08** | „Normgrundlagen"-Zeile behauptet nicht eingehaltene Konformität | A → B | UWG / Vertrag | 3 | 3 | **9** | 🟡 YELLOW | Product Designer |
| **LR-09** | Zuschlagstitel nennt Prozent, Preis ist Euro (14 Einträge) | A | Vertrag / § 305c BGB | 3 | 3 | **9** | 🟡 YELLOW | Head of Product Eng. |
| **LR-10** | Nebenleistungen nach DIN 18363 als eigene Positionen berechnet | A | Vertrag | 2 | 2 | **4** | 🟢 GREEN | Prüfmeister |
| **LR-11** | Türbreiten von Sockelleistenlänge abgezogen | A | Produktqualität | 2 | 2 | **4** | 🟢 GREEN | Head of Product Eng. |
| **LR-12** | Drei verschiedene Höhenschwellen im Produkt (Konsistenz) | A | Produktqualität | 2 | 2 | **4** | 🟢 GREEN | Head of Product Eng. |

**Gesamtbild:** ein rotes, fünf orange, drei gelbe, drei grüne Risiken.
Bemerkenswert daran ist weniger die Verteilung als die Ursachenstruktur: **acht
der zwölf Risiken haben dieselbe Wurzel** — die Rechenmethode ist im Werkzeug
dokumentiert, aber nicht auf dem Dokument, das der Endkunde bekommt. Das ist
eine gute Nachricht, weil eine Ursache auch eine Lösung bedeutet.

### Verteilung in der Matrix

```
                          LIKELIHOOD
                Remote  Unlikely  Possible  Likely  Fast sicher
                  (1)      (2)       (3)      (4)       (5)
SEVERITY
Critical (5)  |        |        |        |        |          |
High     (4)  |        |        | LR-04  | LR-01  |          |
              |        |        | LR-05  |        |          |
Moderate (3)  | LR-06▲ |        | LR-07  | LR-02  |          |
              |        |        | LR-08  | LR-03  |          |
              |        |        | LR-09  | LR-06  |          |
Low      (2)  |        | LR-10  |        |        |          |
              |        | LR-11  |        |        |          |
              |        | LR-12  |        |        |          |
Negligible(1) |        |        |        |        |          |
```
▲ LR-06 nach der Dokumentation in `vob-angebot-abstimmung.md` — siehe Memo.

---

## LR-01 🔴 — Übermessung erreicht das Kunden-PDF nicht

**Score 16 (Severity 4 × Likelihood 4) · Ebene A → B · VOB-004 / G5**

### Risikobeschreibung
Der Endkunde erhält ein Angebot über „Wandfläche streichen — 50,00 m²". Misst
er nach, kommt er auf 46,64 m². Auf dem PDF steht nirgends, warum. Der
erklärende Satz existiert (`vobHinweistext()`), landet aber im `annahmen`-Array
und damit nur in der App des Handwerkers.

### Severity 4 — High
Pro Angebot geht es um rund 7 % der Wandflächenposition; bei einem
5.000-€-Malerauftrag also etwa 300–350 €. Das allein wäre Severity 3. Auf 4
hebt es dreierlei:

- Der Fehler wirkt auf **jedes** Malerangebot mit normalen Fenstern und Türen,
  also praktisch alle. Es ist kein Einzelfall, sondern ein Muster.
- Ohne den Hinweis ist die VOB/C nicht nach § 305 Abs. 2 BGB einbezogen. Damit
  fehlt nicht nur die Erklärung, sondern die **Rechtsgrundlage** für den
  Aufschlag. Der Handwerker steht mit einer Mehrforderung da, die er nicht
  begründen kann — und der Endkunde hat mit dem OLG Stuttgart ein Argument,
  das auch bei ordentlicher Einbeziehung noch trägt.
- Die Geschichte „KI-Software berechnet Handwerkerkunden Flächen, die nicht
  gestrichen wurden" ist medial anschlussfähig, ganz unabhängig davon, dass die
  Übermessung fachlich völlig in Ordnung ist. Reputationsschaden für ein
  Produkt, dessen ganzes Versprechen Verlässlichkeit ist.

### Likelihood 4 — Likely
Die Wandfläche nachzumessen ist die klassischste aller Handwerker-Streitigkeiten
— dafür braucht der Kunde nur einen Zollstock. Mit einer nennenswerten Zahl
Nutzer ist ein Streitfall zu erwarten, nicht bloß denkbar. Präzedenz ist
vorhanden (OLG Stuttgart 21.02.2008, 2 U 84/07 — Volltext nicht eingesehen).
Auslösendes Ereignis: jedes Angebot mit einem Fenster.

### Verstärkende Faktoren
- Die Zeile „Normgrundlagen: … DIN 18363" in 7 pt Hellgrau **lädt den Kunden
  ein**, die Norm nachzuschlagen, ohne ihm den Text zugänglich zu machen. Das
  ist schlechter als gar kein Verweis (→ LR-08).
- PM-031: Die „So gerechnet"-Zeile zeigt an einer Stelle eine andere Fläche
  (46,64 m²) als die abgerechnete Position (50,00 m²). Im Streit ist das der
  Beleg dafür, dass die höhere Zahl nicht plausibel erklärt ist — geliefert vom
  eigenen Werkzeug.
- Die Zielgruppe des Handwerkers ist überwiegend Verbraucher. Genau dort ist
  die Rechtslage am ungünstigsten.

### Mitigierende Faktoren
- Die Rechenmethode selbst ist **korrekt und branchenüblich**. Wir verteidigen
  eine richtige Rechnung, nur schlecht dokumentiert. Das ist die weit bessere
  Ausgangslage als umgekehrt.
- Der Satz existiert bereits und ist gut formuliert. Es ist ein Transportproblem
  von etwa zwei Stunden, keine Konzeptfrage.
- Sofortangebot wird nicht Vertragspartei des Werkvertrags. Ebene B wird nur
  mittelbar erreicht.

### Optionen

| Option | Wirksamkeit | Aufwand | Empfohlen |
|---|---|---|---|
| Übermessungssatz als Positionsuntertitel ins PDF (`annahmen` → `description`) | Hoch | Niedrig (~2 h) | **Ja** |
| Zusätzlich Fußtext-Baustein zur wirksamen Einbeziehung der VOB/C | Hoch | Mittel | **Ja**, direkt danach |
| Pauschalfestpreis-Modus für Verbraucherangebote | Sehr hoch — die Frage entfällt strukturell | Hoch | Ja, mittelfristig |
| Übermessung ganz abschalten | Hoch | Niedrig | **Nein** — verschenkt eine korrekte, branchenübliche Regel und Geld des Handwerkers |
| Nichts tun, auf den Disclaimer in den AGB verweisen | Sehr niedrig | Null | **Nein** — die AGB binden den Endkunden nicht, er ist nicht unser Vertragspartner |

### Empfehlung
Die ersten beiden Optionen zusammen, vor dem ersten echten Testnutzer. Der
Formulierungsvorschlag steht in VOB-004 und braucht Sandys Freigabe (S-2). Den
Pauschalpreis-Modus mit Head of Product Engineering und Product Designer als
eigenes Vorhaben aufsetzen — er löst LR-01 und LR-02 gemeinsam.

### Restrisiko
Nach Umsetzung: **Severity 3 × Likelihood 2 = 6 🟡 YELLOW.** Der Streit bleibt
möglich, aber der Handwerker hat dann ein Dokument, mit dem er ihn gewinnt.
Ein rotes Risiko wird für zwei Stunden Arbeit gelb — das ist das beste
Aufwand-Wirkung-Verhältnis in diesem ganzen Register.

---

## LR-02 🟠 — Verschnitt als Mengenaufschlag statt im Einheitspreis

**Score 12 (Severity 3 × Likelihood 4) · Ebene A → B · VOB-001**

### Risikobeschreibung
`boden.ts` rechnet `menge = flaeche × (1 + verschnitt)`. Bei 20 m² stehen
21,00 m² auf dem Angebot. Verlegt wird auf 20 m². Verschnitt ist nach
durchgängigem Fachkonsens Kalkulations-, nicht Abrechnungsgröße.

### Severity 3 — Moderate
5 % einer Bodenposition, bei 4.000 € Auftragswert also rund 200 €. Anders als
bei der Übermessung gibt es hier **keine Norm, auf die man sich berufen
könnte** — ein Verschnittzuschlag auf die Abrechnungsmenge ist auch bei
wirksam einbezogener VOB/C nicht vorgesehen. Die Verteidigungslinie ist damit
schwächer als bei LR-01, der Betrag pro Fall aber kleiner.

### Likelihood 4 — Likely
Bodenflächen sind noch leichter nachzumessen als Wandflächen, und die Differenz
steht offen im Positionstitel. Ein aufmerksamer Kunde fragt nach.

### Verstärkende Faktoren
- Dasselbe Muster steckt als Anweisung im GPT-Prompt
  (`angebot-verfeinern/route.ts`): 12 % Fliesen, 10 % GK-Platten. Es ist also
  nicht auf einen Codepfad begrenzt.
- LR-07 macht es schlimmer: Wer 5 % berechnet und 10 % als Annahme ausweist,
  kann keine der beiden Zahlen erklären.

### Mitigierende Faktoren — und die sind hier stark
- **Der Verschnitt steht im Positionstitel** („Vinyl verlegen inkl. 5 %
  Verschnitt") und der Titel erreicht anders als `annahmen` tatsächlich das
  PDF. Der Kunde wird nicht getäuscht — er sieht genau, was passiert. Das ist
  der entscheidende Unterschied zu LR-01 und der Grund, warum dieses Risiko
  orange und nicht rot ist.
- Ein Verschnittaufschlag ist in der Branche verbreitet und plausibel
  erklärbar. Es ist kein Trick, sondern eine schlecht gewählte Darstellungsform
  für eine reale Kostenposition.

### Optionen

| Option | Wirksamkeit | Aufwand | Empfohlen |
|---|---|---|---|
| Menge = verlegte Fläche, Verschnitt in den Einheitspreis | Hoch | Mittel | **Ja**, nach Rückmeldung Prüfmeister |
| Verschnitt als erklärender Untertitel statt als Menge | Mittel–hoch | Mittel | Alternative, falls die Branche die Sichtbarkeit will |
| So lassen, Titel-Transparenz genügt | Niedrig | Null | Nein — verteidigbar, aber ohne Not angreifbar |

Die erste Option kostet den Betrieb **nichts**: 20,00 m² × 47,25 € ergibt
denselben Endbetrag wie 21,00 m² × 45,00 €. Gleiche Marge, nachmessbare Menge.

### Empfehlung
Erst die Praxis-Frage an den Prüfmeister (VOB-001, Frage 1), dann Entscheidung
Sandy. Ich dränge hier bewusst weniger als bei LR-01, weil ich die
Branchenpraxis nicht kenne und die Titel-Transparenz einiges auffängt.

### Restrisiko
Nach Umstellung: **2 × 2 = 4 🟢 GREEN.**

---

## LR-03 🟠 — Die Normlage steht nur auf Sekundärquellen

**Score 12 (Severity 3 × Likelihood 4) · Ebene B · VOB-011**

### Risikobeschreibung
Sämtliche Normaussagen in `vob-angebot-abstimmung.md` und in dieser Bewertung
stammen aus Innungs-PDFs, Fachpresse und Betriebs-Websites. Der Originaltext
von DIN 18363:2019-09 und DIN 18365:2019-09 ist kostenpflichtig und war mir
nicht zugänglich.

### Severity 3 — Moderate
Kein unmittelbarer Schaden, aber jede Entscheidung, die wir auf diese Basis
stellen, kann falsch sein. Bei LR-06 hängt an einem einzigen Satz, ob eine
geplante Änderung Schaden anrichtet; bei DIN 18365 nennen zwei Quellen
Schwellenwerte, die um den Faktor 25 auseinanderliegen (0,1 m² gegen 2,5 m²).

### Likelihood 4 — Likely
Wir werden auf dieser Grundlage handeln — das ist ja der Zweck der
Dokumente. Die Wahrscheinlichkeit, dass mindestens eine Entscheidung auf einer
ungenauen Quelle beruht, halte ich für hoch.

### Mitigierende Faktoren
- Jede Aussage ist in `vob-angebot-abstimmung.md` mit Belegstärke markiert
  ([belegt] / [unsicher] / [Praxis] / [Einschätzung]). Wer dort liest, weiß,
  worauf er sich stützt.
- Bei den kritischen Punkten habe ich mehrere unabhängige Quellen
  gegengeprüft.

### Optionen

| Option | Wirksamkeit | Aufwand | Empfohlen |
|---|---|---|---|
| DIN 18363:2019-09 und DIN 18365:2019-09 kaufen (~150 €) | Hoch | ~150 €, halber Tag | **Ja** |
| Zusätzlich die Verbändekommentare | Sehr hoch — liefern die Auslegung mit | ~200–300 € mehr | Später, wenn Bedarf bleibt |
| Anwalt mit Baurechtsschwerpunkt einmalig beauftragen | Sehr hoch | 1.500–3.000 € | Nein, noch nicht — erst die Normen lesen |
| So weitermachen | Null | Null | Nein |

### Empfehlung
Kaufen, und zwar **vor** der Umsetzung von LR-02 und der Auflösung von LR-06.
Das ist der billigste Posten mit dem größten Hebel im ganzen Projekt: 150 € für
die Dokumente, die bestimmen, wie jedes Angebot im Produkt gerechnet wird.

**Lizenzhinweis:** DIN-Normen sind urheberrechtlich geschützt. Danach rechnen
und darauf verweisen ist erlaubt; den Normtext ins Produkt kopieren oder an
Nutzer weitergeben nicht. Für die Einbeziehung gegenüber dem Endkunden (LR-01)
heißt das: auf die Bezugsquelle verweisen, nicht den Text beilegen.

### Restrisiko
Nach Kauf: **2 × 2 = 4 🟢 GREEN** — Restunsicherheit bleibt bei
Auslegungsfragen, dafür gäbe es die Kommentare.

---

## LR-04 🟠 — Wertersatz-Erklärung fehlt auf der Widerrufsseite

**Score 12 (Severity 4 × Likelihood 3) · Ebene A · G6 aus CoS-L-001**

### Risikobeschreibung
Die Widerrufsbelehrung nennt den Wertersatz („Haben Sie verlangt, dass die
Arbeiten während der Widerrufsfrist beginnen sollen…"), aber das PDF enthält
kein Feld, in dem der Kunde genau das erklären kann.

### Severity 4 — High
Nach § 357a Abs. 2 BGB entsteht der Wertersatzanspruch nur, wenn der
Verbraucher den vorzeitigen Beginn ausdrücklich verlangt hat — bei Verträgen
außerhalb von Geschäftsräumen auf einem dauerhaften Datenträger — und vorher
über die Wertersatzpflicht informiert wurde. Fehlt das, **schuldet der Kunde
nichts.** Der Handwerker streicht drei Tage und geht leer aus. Bezogen auf den
einzelnen Werkvertrag ist das ein Totalverlust; absolut typischerweise
2.000–8.000 €.

### Likelihood 3 — Possible
Ein Widerruf nach Arbeitsbeginn ist nicht alltäglich, aber jedem Handwerker als
Schreckensszenario bekannt. Über viele Nutzer und viele Aufträge tritt der Fall
irgendwann ein. Auslösendes Ereignis: Streit über Qualität oder ein besseres
Konkurrenzangebot innerhalb der ersten 14 Tage.

### Mitigierende Faktoren
- Die Belehrung selbst folgt dem amtlichen Muster und ist korrekt — die
  14-Tage-Frist wird also überhaupt erst in Gang gesetzt. Ohne Belehrung wären
  es 12 Monate und 14 Tage, das wäre deutlich schlimmer.
- Betrifft nur Verbraucherkunden bei Haustürgeschäften.

### Optionen

| Option | Wirksamkeit | Aufwand | Empfohlen |
|---|---|---|---|
| Separates, nicht vorangekreuztes Ankreuzfeld mit eigener Unterschrift | Hoch | ~2 h | **Ja** |
| An die Auftragsunterschrift koppeln | Null — wäre unwirksam | Niedrig | **Nein** |
| Nur einen Hinweistext ergänzen, ohne Feld | Niedrig | Niedrig | Nein |

Formulierungsvorschlag steht in `legal-001-bestandsaufnahme.md`, Abschnitt B3;
braucht Sandys Freigabe (S-2).

### Restrisiko
**3 × 2 = 6 🟡 YELLOW** — Streit über die Höhe des Wertersatzes bleibt möglich,
der Anspruch dem Grunde nach besteht dann aber.

---

## LR-05 🟠 — Keine Unternehmer-Prüfung bei der Registrierung

**Score 12 (Severity 4 × Likelihood 3) · Ebene B · G4 aus CoS-L-001**

Das einzige Risiko in diesem Register, das **direkt Sandys Geld** betrifft, und
deshalb hier mit aufgeführt, obwohl es nicht zum VOB-Komplex gehört.

### Severity 4 — High
AGB § 1.2 schließt Verbraucher aus, das Registrierungsformular fragt es nicht
ab. Die Unternehmereigenschaft ist objektiv zu bestimmen und lässt sich nicht
per Klausel herbeischreiben. Für einen Nutzer, der objektiv Verbraucher ist:
§ 312j Abs. 3 BGB — ohne Button-Lösung **kommt der Vertrag nicht zustande**,
es gibt keinen Zahlungsanspruch. Dazu ein Widerrufsrecht, das mangels Belehrung
12 Monate und 14 Tage läuft.

### Likelihood 3 — Possible
Ein Teil der Anmeldungen wird objektiv von Verbrauchern kommen — der Meister,
der sich anmeldet, bevor der Betrieb existiert; der Nebenerwerbler. Bei
Handwerksbetrieben ist die Quote vermutlich niedrig, aber nicht null.

### Optionen

| Option | Wirksamkeit | Aufwand | Empfohlen |
|---|---|---|---|
| Pflicht-Checkbox „Ich melde mich als Unternehmer (§ 14 BGB) an", mit Zeitstempel und Version gespeichert | Hoch | ~1 h | **Ja** |
| Zusätzlich Button-Lösung und Kündigungsbutton vorsorglich umsetzen | Sehr hoch — dann ist die Frage egal | Mittel | Erwägenswert |
| Auf AGB § 1.2 vertrauen | Sehr niedrig | Null | **Nein** |

### Restrisiko
**2 × 2 = 4 🟢 GREEN.** Eine Stunde Arbeit nimmt ein ganzes Regelwerk aus dem
Risiko — nach LR-01 das zweitbeste Aufwand-Wirkung-Verhältnis hier.

---

## LR-06 🟠→🟢 — Der geplante Leibungs-„Fix"

**Score vor Dokumentation 12 (3 × 4) · nach Dokumentation 3 (3 × 1) · VOB-003**

### Risikobeschreibung
In `vob-uebermessung.ts` und in `pruefmeister-testfaelle.md` steht als
zurückgestellte „VOB-Feinheit", dass Leibungen übermessener Öffnungen nicht
separat vergütet werden dürften. Nach meiner Recherche sagt DIN 18363
Abschnitt 5.2.3 das Gegenteil: Leibungen und beschichtete Rückflächen von
Nischen werden „unabhängig von ihrer Einzelgröße gesondert gerechnet".
`maler.ts` macht es heute schon richtig.

### Severity 3 — Moderate
Würde der Punkt umgesetzt, nähme das Produkt dem Handwerker systematisch Geld
weg, das ihm nach der Norm zusteht — und wir würden es tun, während wir
„DIN 18363" auf das Angebot schreiben. Kein Kundenschaden, aber ein
Vertrauensschaden bei genau der Gruppe, die uns bezahlt.

### Likelihood: von 4 auf 1
Vor der Dokumentation stand der Punkt als offener Verbesserungsvorschlag im
Code und im QA-Dokument — er wäre irgendwann abgearbeitet worden, das ist der
Zweck solcher Notizen. **Likelihood 4.**

Seit dem 01.09. ist er in `vob-angebot-abstimmung.md` als VOB-003 mit
ausdrücklicher Bitte „nicht bauen" markiert, plus Hinweis im
Prüfmeister-Dokument. **Likelihood 1**, solange die Markierung steht.

### Warum das hier trotzdem steht
Es ist das einzige Risiko im Register, das durch das bloße Aufschreiben von
orange auf grün gefallen ist. Das illustriert etwas, das für den ganzen Rest
gilt: Ein dokumentierter Fund, den man liegen lässt, ist eine Belastung
(siehe `legal-001-bestandsaufnahme.md`, A5 — bekannt und ignoriert wiegt
schwerer als nie bemerkt). Ein dokumentierter Fund mit klarer Handlungsanweisung
ist eine Mitigation.

### Restrisiko
**3 🟢 GREEN**, aber mit einer Bedingung: LR-06 fällt auf grün nur, solange die
Markierung nicht kommentarlos entfernt wird. Endgültig erledigt ist der Punkt
erst nach LR-03 (Normtext). Bis dahin: **⏳ nicht bauen.**

---

## Die gelben und grünen Risiken, kurz

**LR-07 (9 🟡) — Drei Verschnittsätze.** Die Engine rechnet 5 %, die Annahme im
Angebot nennt 10 %, der GPT-Prompt 10 % und 12 %. Rechtlich ist die
Selbstwidersprüchlichkeit das Problem, nicht die Höhe: Wer zwei Zahlen für
dieselbe Sache im selben Dokument hat, kann keine davon verteidigen. Als
Engineering-Defekt ist die Eintrittswahrscheinlichkeit übrigens 5, nicht 3 — er
ist heute schon da. Fix ohne Entscheidung möglich.

**LR-08 (9 🟡) — Die „Normgrundlagen"-Zeile.** 7 pt, `#BBBBBB`. Als Einbeziehung
nach § 305 Abs. 2 BGB untauglich, und in der Sache nicht durchgängig zutreffend
(LR-02 und LR-10 weichen ab, dazu die fehlende Einbeziehung). Eine Normangabe, die man punktuell nicht
einhält, ist schlechter als keine — sie liefert dem Endkunden den Maßstab.
Lösung in VOB-007: sachliche Erklärung an der Position, Einbeziehung als
optionaler Fußtext, pauschale Zeile weg.

**LR-09 (9 🟡) — Prozent im Titel, Euro im Preis.** 14 Katalogeinträge über
neun Gewerke. §§ 133, 157 BGB, bei AGB-Charakter § 305c Abs. 2 BGB — Zweifel
zulasten des Verwenders, also des Handwerkers. Die betroffenen Maler- und
Bodeneinträge (Wochenend-/Feiertagszuschlag 25 %) sind launchrelevant, die
SHK-/Elektro-Einträge noch nicht. Migration, keine Entscheidung nötig.

**LR-10 (4 🟢) — Nebenleistungen als eigene Positionen.** „Boden abdecken"
1,20 €/m², „Möbel abdecken" 1,50 €/m² sind nach DIN 18363 4.1.3 Nebenleistungen
und im Einheitspreis enthalten; „Abkleben" ist nach 4.2.11 zu Recht extra. Rund
24 € pro Auftrag, und ein Kunde müsste die Norm lesen. Grün — aber es zahlt auf
LR-08 ein.

**LR-11 (4 🟢) — Türbreiten von der Sockelleistenlänge abgezogen.** Das einzige
Risiko im Register **zulasten des Handwerkers**. Beide Normen übermessen
Unterbrechungen unter 1 m; eine 0,90-m-Tür wird nicht abgezogen. Bei drei Türen
fehlen ihm 2,7 lfdm. Niemand verklagt uns, weil er zu wenig berechnet hat —
deshalb grün. Fixen sollte man es trotzdem, weil es dieselbe Inkonsistenz ist
wie LR-01, nur in die andere Richtung.

**LR-12 (4 🟢) — Drei verschiedene Höhenschwellen.** *Begründung am 2026-09-01
nach Rückmeldung des Prüfmeisters korrigiert.* Ursprünglich hatte ich hier die
Gerüst-Nebenleistungsgrenze der DIN 18363 (3,50 m) gegen den
Erschwerniszuschlag für hohe Räume gestellt. Das waren zwei verschiedene
Fragen: Die Norm sagt, das **Gerüst** darf bis 3,50 m nicht separat abgerechnet
werden — sie sagt nichts darüber, ob ein Betrieb für hohe Räume einen Zuschlag
verlangen darf. Laut Prüfmeister ist ein Zuschlag ab drei Metern völlig üblich,
weil man dort Böcke statt Leiter braucht. Die Schwelle ist also fachlich
richtig.

Was bleibt, ist keine Normabweichung, sondern eine Inkonsistenz: 2,80 m im
Katalog, 3,00 m in der Engine, 4,00 m für die nächste Stufe, dazu €/m² gegen %.
Derselbe Raum bekommt je nach Weg 2,50 €/m² oder 15 %. Rechtlich harmlos —
unangenehm wird es erst, wenn zwei Angebote desselben Betriebs denselben Fall
unterschiedlich berechnen und ein Kunde beide sieht. Bleibt grün, aber die
Zuordnung zu LR-08 entfällt: die Höhenschwelle ist kein Argument gegen die
Zeile „Normgrundlagen", die drei anderen sind es.

---

## Was ich NICHT als Risiko führe, und warum

Damit das Register nicht mit Scheinrisiken aufgebläht wird:

- **Die Übermessungsregel als solche.** Fachlich korrekt, branchenüblich,
  sauber implementiert. Das Risiko liegt ausschließlich in der fehlenden
  Dokumentation gegenüber dem Endkunden, nicht in der Rechnung.
- **Türen und Fenster nach Stück statt nach Fläche** (VOB-009). Ein Stückpreis
  ist ein Pauschalpreis, Pauschalpreise sind zulässig und für Verbraucher
  verständlicher als eine abgewickelte Fläche. Kein Risiko, nur ein weiteres
  Argument gegen die pauschale Normbehauptung.
- **Die Höhe der Zuschläge.** Es gibt im Bauhandwerk keine verbindliche
  Preisverordnung. Was ein Betrieb verlangt, ist seine Sache, solange es
  transparent ausgewiesen ist.
- **KI-Kennzeichnung gegenüber dem Endkunden.** Siehe
  `legal-001-bestandsaufnahme.md` A4: Es gibt keine Rechtsgrundlage, und ein
  Hinweis würde ein Risiko schaffen, das ohne ihn nicht besteht. Das Angebot ist
  die eigene Willenserklärung des Handwerkers.

---

## Externe Beratung

**Noch nicht erforderlich.** Kein Punkt in diesem Register erfüllt die Kriterien
für zwingende Mandatierung: keine Klage, keine Behördenanfrage, keine
strafrechtliche Exposition, kein Board-Thema.

**Empfohlen, in dieser Reihenfolge:**

1. **Zuerst die Normen kaufen (LR-03, ~150 €), nicht den Anwalt.** Drei der
   offenen Fragen lösen sich damit von selbst. Einen Baurechtler zu bezahlen,
   damit er uns vorliest, was in einer Norm für 75 € steht, wäre die falsche
   Reihenfolge.
2. **Danach, wenn Fragen bleiben: einmalige Beauftragung eines Anwalts mit
   Schwerpunkt Bau-/Werkvertragsrecht**, konkret zu zwei Punkten — (a) welche
   Formulierung die VOB/C gegenüber einem Verbraucher wirksam einbezieht, und
   ob das nach OLG Stuttgart überhaupt zu halten ist; (b) Volltext und
   Tragweite dieser Entscheidung. Größenordnung 1.500–3.000 €. Sinnvoll vor
   dem Launch, nicht vor dem ersten Testnutzer.
3. **Unabhängig davon, aus CoS-L-001:** AGB-Haftungsklausel (§ 9.3) und die
   AI-Act-Einordnung gehören durch einen IT-/Vertragsrechtler. Anderes
   Fachgebiet, andere Kanzlei, anderer Zeitpunkt — das ist ein Launch-Thema.

**Bei der Auswahl** würde ich auf Erfahrung mit Handwerksbetrieben und
VOB-Praxis achten, nicht auf allgemeines Baurecht — die Fragen hier sind sehr
konkret. Ein Festpreis für ein schriftliches Kurzgutachten ist der Stundensatz
vermutlich wert.

---

## Überwachung

| Was | Wie oft | Auslöser für Neubewertung |
|---|---|---|
| LR-01, LR-04, LR-05 | wöchentlich bis erledigt | — |
| LR-02, LR-03, LR-06 | bei Rückmeldung Prüfmeister / nach Normkauf | Prüfmeister widerspricht meiner Einschätzung |
| Gesamtes Register | monatlich, bzw. vor jedem Gate | **erster echter Testnutzer** · **erster zahlender Kunde** · **erste Kundenbeschwerde über eine Menge** |
| Neue Gewerke | vor Freischaltung | Jedes neue Gewerk bringt eine eigene ATV mit eigenen Abrechnungsregeln — dann ist dieses Register neu zu führen |

**Der wichtigste Auslöser, den ich gesondert nennen will:** Sobald sich ein
Endkunde erstmals über eine Menge beschwert, ist das kein Supportfall, sondern
ein Anlass zur Neubewertung — bitte an mich weiterleiten, unabhängig davon, wie
er ausgeht. Der erste Fall sagt uns mehr über die tatsächliche Likelihood als
alles, was ich hier geschätzt habe.

---

## Nächste Schritte

| # | Was | Owner | Bis |
|---|---|---|---|
| 1 | LR-01 — Übermessungssatz ins PDF (nach Freigabe S-2) | Head of Product Engineering | vor erstem Testnutzer |
| 2 | LR-05 — Unternehmer-Checkbox | Head of Product Engineering | vor erstem Testnutzer |
| 3 | LR-04 — Wertersatz-Feld (nach Freigabe S-2) | Head of Product Engineering | vor erstem Testnutzer |
| 4 | LR-07, LR-09 — Konsistenzfixes, keine Entscheidung nötig | Head of Product Engineering | sofort möglich |
| 5 | LR-03 — Normen bestellen (S-5) | Sandy | vor Umsetzung LR-02/LR-06 |
| 6 | LR-02, LR-10, LR-11 — sechs verbleibende Praxis-Fragen (LR-12 am 01.09. beantwortet) | Prüfmeister | vor Entscheidung Sandy |
| 7 | LR-08 — Konzept „Normgrundlagen"-Zeile | Product Designer | vor Launch |
| 8 | LR-06 — auflösen, sobald Normtext vorliegt | Head of Legal & Compliance | nach Schritt 5 |

---

## Einordnung zum Schluss

Für ein Produkt in dieser Phase ist ein rotes Risiko wenig, und dieses eine ist
für zwei Stunden Arbeit gelb zu machen. Der Grund dafür ist bemerkenswert: **Es
gibt in diesem Register keinen einzigen Fall, in dem falsch gerechnet wird.**
Die Übermessung stimmt, die Zuschläge sind branchenüblich, die Leibungen sind
richtig. Was fehlt, ist durchgehend die Erklärung auf dem Papier, das beim
Kunden landet — und an zwei Stellen die Konsistenz zwischen dem, was das
Werkzeug rechnet, und dem, was es darüber schreibt.

Das ist die deutlich bessere Ausgangslage als umgekehrt. Eine richtige Rechnung
zu dokumentieren ist Arbeit von Stunden. Eine falsche Rechnung zu reparieren,
nachdem sie in dreihundert Angeboten steht, wäre etwas anderes.

---

*Head of Legal & Compliance · 2026-09-01 · Bewertung nach Severity × Likelihood
· nächste Überprüfung: beim ersten echten Testnutzer*

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
