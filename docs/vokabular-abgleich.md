# Vokabular-Abgleich Engine ↔ Preiskatalog

**Angelegt:** 2026-09-11 · **Von:** Head of Product Engineering
**Auftrag:** Sandy — Punkt 1 aus `preisliste-konzept.md`: Katalog und Engine
müssen dasselbe Wort sprechen, **bevor** die Rückfrage im Angebot gebaut wird.
**Für:** Prüfmeister (fachliche Entscheidung) und Sandy (Überblick)

---

## Warum das zuerst kommt

Manfreds Warnung, wörtlich:

> *„Dann muss die Preisliste exakt das Vokabular der Engine benutzen, Wort für
> Wort. Sonst fragt sie mich nach ‚Sperranstrich', ich tipp 9 € ein, und jetzt
> hab ich ‚Nikotinsperre 9 €' UND ‚Sperranstrich 9 €' unter ‚Deine Preise'.
> Ihr baut die Doppelten, die ihr gerade wegräumt, im Alltag wieder auf."*

---

## Vorgehen

Alle Positionstitel aus dem Quelltext der Mengen-Engine und der
Vollständigkeitsprüfung gezogen und jeden einzelnen durch die echte
Preis-Zuordnung geschickt (inkl. Gewerke-Filter), gegen den Standardkatalog.

| | |
|---|---|
| Verschiedene Positionstitel im Engine-Vokabular (Maler + Boden) | **106** |
| davon **ohne** Katalogpreis | **14** |
| davon **knapp** getroffen (Score < 0,75 — Risiko falscher Eintrag) | **4** |

*Ehrlich zur Methode:* Titel, die die Engine aus Variablen zusammensetzt,
musste ich mit plausiblen Werten füllen. Wo das schiefging, habe ich es unten
als „mein Artefakt" markiert statt es als Fund auszugeben — vier solche Fälle
sind auf dem Weg schon rausgeflogen (u. a. die fünf Erschwerniszuschläge, die
in Wahrheit sauber matchen).

---

## A. Die 14 Lücken — Entscheidung bitte je Zeile

Legende: **W** = nur ein anderes Wort für dasselbe (dann Katalog oder Engine
angleichen) · **L** = echte Lücke (Katalogeintrag anlegen) · **?** = braucht
fachliches Urteil

| # | Engine sagt | Einheit | Katalog hat | Vermutung |
|---|---|---|---|---|
| 1 | Fugen/Unreinheiten verkitten | m² | **Fugen kitten / Risse ausspachteln** 8,00 €/m² | **W** — sieht nach demselben aus |
| 2 | Fliesenspiegel abkleben | lfdm | **Abkleben Kanten / Leisten** 0,80 €/lfdm | **W?** gleiche Einheit, gleiche Arbeit? |
| 3 | Sperranstrich / Flecken sperren — Decke | m² | nichts Ähnliches | **?** ← **das ist TN-092** |
| 4 | Heizkörper abkleben | Stück | nur „Abkleben Fenster-/Türrahmen" 8,00 €/Stück | **L?** |
| 5 | Lampen / Leuchten abkleben | Stück | nichts Ähnliches | **L?** |
| 6 | Pendelleuchten abkleben | Stück | nichts Ähnliches | **L?** — und: warum getrennt von #5? |
| 7 | Geländer abkleben | Pauschale | Abkleben-Familie, aber keine Pauschale | **L?** + Einheitenfrage |
| 8 | Rohre lackieren | lfdm | nichts Passendes | **L** |
| 9 | Betonfarbe streichen | m² | nur allgemeines Wand-/Deckestreichen | **?** eigener Preis oder wie Wand? |
| 10 | Aufpreis Spezialfarbe chlorbeständig | Pauschale | nichts Ähnliches | **L** |
| 11 | Untergrundvorbereitung für Kalkputz | m² | „Untergrund prüfen und dokumentieren" 40,00 €/Psch. | **L** |
| 12 | Fugen fräsen | lfdm | nur GK-Fugen (anderes Gewerk) | **L** |
| 13 | Stoßkanten verkleben | m² | nichts Passendes | **L** |
| 14 | Sockelleisten streichen | m² | „Sockelleisten / Fußleisten streichen" 3,50 €/**lfdm** | **mein Artefakt — aber siehe unten** |

**Zu #14, das prüfe ich selbst:** Die Engine erzeugt diese Position an zwei
Stellen. Die eine sagt sauber `lfdm` und matcht. Die andere übernimmt die
Einheit aus der Quellposition — steht dort m², entsteht eine
Sockelleisten-Position in m², und die findet keinen Preis. Das ist kein
Vokabel-, sondern ein Einheitenproblem und gehört mir, nicht dem Prüfmeister.

**Zu #5 und #6:** Die Engine kennt „Lampen / Leuchten abkleben" **und**
„Pendelleuchten abkleben" als zwei Positionen. Falls das fachlich dieselbe
Arbeit ist, erzeugt die Engine hier selbst schon eine Dopplung — dann lieber
dort zusammenlegen als zwei Katalogeinträge anlegen.

---

## B. Die 4 knappen Treffer — gefährlicher als die Lücken

Eine Lücke ist sichtbar: „Preis fehlt", 0,00 €, und seit heute ist der
Versand gesperrt. Ein **knapper** Treffer ist unsichtbar — es steht ein Preis
da, nur der falsche.

| Engine sagt | traf | Was daran stört |
|---|---|---|
| **Alten Teppichboden entfernen (verklebt)** | „Teppichboden entfernen und entsorgen" | Verklebt ist deutlich mehr Arbeit als lose. Der Betrieb rechnet zu billig. |
| **Heizkörper schleifen und lackieren** | „Heizkörper streichen / lackieren" | Das Schleifen fällt unter den Tisch — obwohl es als eigener Eintrag („Heizkörper abschleifen" 20,00 €) existiert. |
| **Ausgleichsmasse einbringen** | „Ausgleichsmasse **bis 3 mm** einbringen" | Bei dickerem Auftrag still zu billig. |
| **Fassade reinigen / Untergrundvorbereitung** | „Fassade reinigen / druckwaschen" | Vermutlich in Ordnung — bitte bestätigen. |

**Das Muster ist die eigentliche Meldung: Drei von vier gehen zulasten des
Betriebs.** Wenn ein Titel mehrere Arbeitsgänge zusammenfasst („schleifen
**und** lackieren", „**verklebt**"), greift der Matcher den einfacheren
Katalogeintrag — der Rest verschwindet, und zwar lautlos. Das ist dieselbe
Fehlerklasse wie PM-018 (Q3 bekam den Q2-Preis), nur an anderer Stelle.

**Mein Vorschlag dazu**, sobald die Wörter geklärt sind: Wenn der gesuchte
Titel ein Wort trägt, das den Aufwand erhöht (verklebt, schleifen, über X mm)
und der Treffer dieses Wort **nicht** hat, dann gilt dieselbe Regel wie bei
den Anstrichzahlen — lieber sichtbar kein Preis als still der falsche. Baue
ich aber erst, wenn die Liste dieser Wörter vom Prüfmeister kommt; selbst
ausdenken wäre genau der Fehler, der zu diesen Treffern geführt hat.

---

## C. Was ich brauche

Vom **Prüfmeister**, Zeile für Zeile aus Abschnitt A: *dasselbe Wort* oder
*eigene Leistung mit eigenem Preis*? Bei „eigene Leistung" zusätzlich ein
Richtwert, sonst entsteht ein Katalogeintrag ohne Zahl.

Von **Sandy** nur eine Entscheidung: Bei den Fällen, wo Engine und Katalog
dasselbe meinen — soll der **Katalog** auf das Wort der Engine umgestellt
werden oder umgekehrt? Ich empfehle: **der Katalog folgt der Engine.** Die
Engine-Wörter stehen im Angebot und damit vor dem Kunden; die Katalogwörter
sieht nur der Betrieb. Und Katalogzeilen lassen sich umbenennen, ohne dass
jemand etwas merkt.

---

## D. Was hier NICHT drinsteht

Positionen aus Trockenbau, Fliesen, Sanitär und Elektro habe ich
herausgefiltert. Dort fehlen naturgemäß Preise — diese Gewerke sind noch
nicht freigegeben (nur Maler und Bodenleger sind durch die
Prüfmeister-Testreihe gelaufen). Das ist keine Lücke, sondern der Stand.

*Head of Product Engineering · 2026-09-11*

---

## E. Nachtrag 11.09.2026 — Manfreds Rückmeldung, und was daraus schon gebaut ist

Manfred hat den Abgleich durchgesehen. Zwei Punkte waren Aufträge ans
Engineering, beide sind umgesetzt; die übrigen liegen beim Prüfmeister.

### E.1 Einheiten-Eimer ✅ gebaut

> *„Vier von den 14 Lücken sind gar keine Wortlücken, sondern falsche
> Einheiten. Fugen und Kanten sind immer laufende Meter, in jedem Betrieb in
> Deutschland. Und ich würd mal schauen, ob die Engine an anderen Stellen auch
> Einheiten von der Quellposition erbt — wo das einmal passiert, passiert's
> öfter."*

**Es war schlimmer als ein falsches Etikett.** Nicht nur die Einheit stand auf
m² — auch die **Menge war die Bodenfläche**. Eine Fuge wurde nach
Quadratmetern berechnet. Bei „Stoßkanten verkleben" in einem 55-m²-Raum
hätte ein Nahtpreis das Vier- bis Fünffache ergeben.

Aufgefallen ist es nur deshalb nicht, weil zu genau diesen Positionen **kein
Katalogpreis existiert** — sie standen mit 0,00 € da. Der eine Fehler hat den
anderen verdeckt. Wer die fehlenden Preise anlegt, ohne das zu wissen, holt
sich den Rechenfehler sofort ins Angebot. Das ist der stärkste Beleg dafür,
dass Manfreds Reihenfolge stimmt.

Gebaut:
- **Fugen/Unreinheiten verkitten** → lfdm, Menge aus den gesprochenen
  Fugenmetern
- **Stoßkanten verkleben** → lfdm, ebenso
- Beide: **Ist keine Meterzahl gesagt, wird keine geschätzt.** Aus der
  Bodenfläche auf Fugenmeter zu schließen wäre genau die erfundene Zahl, für
  die am Ende der Handwerker geradesteht. Die Position geht dann als
  sichtbarer Platzhalter („Menge nicht sicher berechenbar — bitte manuell
  ergänzen") ins Angebot, und seit CoS-E-004 sperrt eine unbepreiste Position
  den Versand. Der Handwerker kommt also nicht daran vorbei.
- Die Meter-Erkennung liegt jetzt an **einer** Stelle (`fugenMeterAusText`)
  statt zweimal nebeneinander.

**Zur Erb-Frage — nachgesehen, eine einzige Stelle:** „Sockelleisten
streichen" übernahm die Einheit von der Schwester-Position (montieren bzw.
abkleben). Heute liefern beide lfdm, es ging also gut. Fragil war es
trotzdem: Ändert eine Quelle ihre Einheit, entsteht still eine Sockelleiste
in m², die keinen Preis findet. Jetzt ausgeschrieben statt geerbt. **Damit
war auch Zeile #14 der Lückenliste erledigt — die war mein Artefakt, kein
echter Fund.**

**Nicht gebaut: „Geländer abkleben" (Pauschale → lfdm).** Manfred hat recht
mit der Einheit, aber es gibt **keine Längenquelle** — die Position entsteht
aus einer Treppenhaus-Erkennung mit Menge 1. Die Einheit auf lfdm zu
schalten, ohne die Meter zu kennen, würde die Menge um etwa den Faktor zehn
verfälschen. Braucht eine eigene Mengenquelle; bis dahin bewusst unverändert.

### E.2 Bauteile aus den Positionsnamen ✅ gebaut

> *„Das Bauteil gehört nicht in den Positionsnamen. ‚Decke' ist die Zeile im
> Raum, nicht der Preis. Wenn die Engine Bauteile in Titel schreibt, findet
> sie nie einen Katalogpreis, egal wie sauber der Katalog ist."*

Im gesamten Maler- und Boden-Vokabular gab es **genau eine** solche Stelle —
und dieselbe Funktion war die Quelle von **zwei** Funden dieses Tages:

| vorher | nachher | |
|---|---|---|
| `Sperranstrich / Flecken sperren — Decke` | `Sperranstrich / Flecken sperren` | Manfreds Bauteil-Fund. Der zweite Zweig derselben Funktion benutzte den kurzen Namen ohnehin schon — die beiden waren uneinheitlich. |
| `Deckenfläche streichen — 2× Anstrich` | `Deckenfläche streichen 2x` | **Das ist der Titel aus TN-093.** Überall sonst trennt der Gedankenstrich den RAUM ab; hier stand dahinter die Anstrichzahl, der Matcher schnitt sie weg und griff den 1x-Preis (7,00 € statt 11,00 €). |

Beim Preis-Matcher war das schon behoben (er liest die Anstrichzahl seit
CoS-E-038 am ganzen Titel). Das hier ist die andere Hälfte: **den Titel gar
nicht erst falsch bauen.**

### E.3 Manfreds Bauch-Antworten zu den 14 Zeilen

Er hat zu jeder Zeile ein Urteil und meist einen Richtwert geliefert — steht
in seiner Rückmeldung, geht so an den Prüfmeister. Zwei Sachen daraus, die
nicht in die Tabelle passen:

- **#3 Sperranstrich:** *„Der Katalog hat den Preis. Ich hab ihn heute selbst
  gesehen: ‚Nikotinsperre auftragen 9,00 €/m²'."* In SEINEM Katalog, ja — im
  Standardkatalog gibt es keinen. Beides stimmt, und beides muss geklärt
  werden.
- **#5/#6 Lampen und Pendelleuchten:** *„Dieselbe Arbeit, in der Engine
  zusammenlegen. Ehrlich: Ich schreib das nie einzeln auf, das ist Kleinkram
  im m²-Preis."* → Erst zusammenlegen, dann entscheiden, ob es überhaupt eine
  eigene Position sein soll.

### E.4 Was noch offen ist — in Manfreds Reihenfolge

1. ~~Einheiten-Eimer~~ ✅
2. ~~Bauteile aus den Titeln~~ ✅
3. **Aufwandswort-Regel** — wartet auf die Prüfmeister-Liste. Manfreds
   Bauch-Vorschlag als Startpunkt: *verklebt, schleifen, abbeizen, abbrennen,
   abgehängt, über 3 mm, Q3, Q4, dreifach, Decke über 3 m, Treppenhaus,
   bewohnt.* **Das ist seine Liste, nicht die Entscheidung.** Ich denke mir
   die Wörter nicht selbst aus — das wäre genau der Fehler, der zu den
   knappen Treffern geführt hat.
4. **Die 14 Zeilen** — Prüfmeister (Zeile #14 ist erledigt, siehe E.1).
5. **Die 88er-Liste durchnicken** — Manfred: *„Gut heißt Score über 0,75,
   nicht: richtig. Wenn irgendwo ‚Decke streichen 2x' auf ‚Decke streichen
   3x' trifft, ist der Score hoch und der Preis falsch."* Er hat recht, und
   die Liste kann ich jederzeit erzeugen. Eine Stunde Durchsehen, dann ist
   die Sache dicht.

**Erst danach die Rückfrage im Angebot bauen.** So hat Manfred es sortiert,
und die Einheiten-Funde oben bestätigen, warum.

### E.5 Zwei Bedingungen von Manfred zu „Katalog folgt Engine"

> *„Dann müssen die Engine-Wörter Handwerkersprache sein. ‚Sperranstrich /
> Flecken sperren — Decke' ist keine. ‚Nikotinsperre auftragen' ist eine.
> Sonst zwing ich die gute Liste auf die schlechten Wörter."*

Angenommen. Die 106 Engine-Titel müssen einmal sprachlich durchgesehen
werden, **bevor** der Katalog ihnen folgt — sinnvollerweise im selben Durchgang
wie die 88er-Liste aus Punkt 5.

> *„Wenn ich eine Katalogzeile umbenannt hab, weil ich ‚Nikotinsperre' sag
> und nicht ‚Sperranstrich', dann darf die App das nicht beim nächsten Update
> überschreiben. Mein Name bleibt, dahinter merkt sich die App das
> Engine-Wort. Sonst pflege ich und ihr löscht."*

Auch angenommen, und es ist technisch dieselbe Sache wie die Verknüpfung aus
Abschnitt 3b: **Anzeigename und Engine-Wort sind zwei Felder, nicht eins.**
Der Betrieb besitzt den Anzeigenamen, die App besitzt die Zuordnung. Gehört
mit ins Datenmodell, sobald an der Preisliste gebaut wird.

*Head of Product Engineering · 2026-09-11*

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
