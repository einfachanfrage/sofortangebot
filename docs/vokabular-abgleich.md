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

## F. Antwort vom Prüfmeister — 11.09.2026

Ich hab den Abgleich nicht gelesen, sondern **nachgefahren**: alle Positions-
titel aus Mengen-Engine und Vollständigkeitsprüfung (Maler + Boden) gezogen
und jeden mit seiner echten Einheit durch `findePreisposition` gegen
`default-prices.ts` geschickt, mit demselben Gewerke-Filter wie der
Angebots-Endpunkt. Stand nach den Fixes von heute Mittag:

| | |
|---|---|
| Engine-Titel mit eigener Einheit | **168** |
| davon **ohne** Preis | **29** (der erste Abgleich sagte 14) |
| davon **knapp** (< 0,75) | **9** |
| „gute" Treffer ≥ 0,75 zum Durchnicken | **130** |
| Titel, die die Engine aus Variablen baut — nicht prüfbar | 3 |

*Stand 12.09., nach dem Varianten-Ausbau (siehe G.2). Der erste Lauf am 11.09.
kannte die Belag-, Tapeten- und Q-Varianten noch nicht und zählte 107 / 22 / 3
/ 82; die Zahlen in F sind die von damals, die Entscheidungen gelten
unverändert.*

**Das Skript liegt jetzt im Repo: `node scripts/vokabular-abgleich.mjs`**
(`--alle` zeigt auch die guten Treffer, `--md` gibt Markdown aus). Damit ist
die Zahl auf Knopfdruck nachprüfbar, statt dass sie einmal im Jahr jemand von
Hand zusammensucht — und der erste Lauf hat sich prompt gelohnt: zwei
„gute Treffer" meines ersten Durchgangs waren Lesefehler meines eigenen
Skripts (abgebrochene Template-Literale wie `Sockelleisten
montieren${verlegeRaum ?`), keine echten Positionen. Sie sind raus, die
Zahlen oben sind die geprüften. Die 26 nicht prüfbaren Titel sind die
ehrliche Restlücke der Methode: Wo die Engine den Titel komplett aus
Variablen zusammensetzt (`${label} verlegen`), kann kein Skript wissen,
was drinsteht. Die gehören beim nächsten Durchgang von Hand nachgesehen.

### F.0 Drei Sachen vorweg, die die Liste ändern

**1. Der Standardkatalog HAT den Sperranstrich-Preis.** In E.3 steht: *„In
SEINEM Katalog, ja — im Standardkatalog gibt es keinen."* Das stimmt nicht.
In `default-prices.ts` stehen **drei** Zeilen dafür:

- `Isoliergrund gegen Nikotin / Ruß / Wasserflecken` — 9,00 €/m²
- `Nikotinsperre auftragen` — 9,00 €/m²  ← Manfreds Zeile, dieselbe Arbeit, derselbe Preis
- `Grundieren (Haftgrund / Sperrgrund)` — 6,00 €/m²  ← andere Arbeit, bleibt

TN-092 ist damit **kein** fehlender Preis und war es nie. Die Engine sagt
„Sperranstrich / Flecken sperren", der Katalog sagt „Nikotinsperre" — kein
gemeinsames Wort, Score 0,00. Ein reiner Vokabelfall, der uns einen Tag
Diskussion über einen Katalogeintrag gekostet hat, den es gibt.

**2. Die Lückenliste ist zehn Zeilen zu kurz.** Steht unter F.3. Acht davon
findet das Skript selbst, zwei kommen aus dem Durchsehen dazu.

**3. Zwei der 13 Lücken sind gar keine.** Der Katalog hat das Wort, nur
anders geschrieben: `Rohre lackieren` → **`Rohrleitungen lackieren` 9,00 €/lfdm**,
`Kalkputz auftragen` → **`Kalkputz aufbringen` 35,00 €/m²**. Beide standen als
„echte Lücke (L)" in der Tabelle. Wer die als neuen Katalogeintrag anlegt,
baut die Doppelten, vor denen Manfred gewarnt hat.

---

### F.1 Die Aufwandswort-Regel

**Die Regel gilt in BEIDE Richtungen.** Das ist meine wichtigste Änderung am
Vorschlag aus Abschnitt B, und sie kommt nicht aus dem Bauch, sondern aus
zwei Treffern aus der 84er-Liste:

- `Parkett schleifen` trifft mit 0,94 den Eintrag
  **`Parkett schleifen + versiegeln komplett (2x schleifen, 2x Lack)` — 38,00 €/m²**.
  Der Kunde kriegt eine Versiegelung aufs Papier, die keiner bestellt hat,
  und zahlt 38 statt 20 €. Im Angebot steht trotzdem nur „Parkett schleifen".
  Wenn er später die versprochene Versiegelung will, steht der Betrieb da.
- `Betonwände schleifen / Untergrundvorbereitung` trifft mit 0,90
  **`Wände schleifen nach Q2` — 5,50 €/m²**. Q2 ist Gipskarton-Spachtelqualität
  und hat auf einer Betonwand nichts verloren.

Ein Aufwandswort **im Treffer**, das im gesuchten Titel fehlt, ist also
genauso falsch wie umgekehrt — nur fällt es niemandem auf, weil es zugunsten
des Betriebs aussieht. Tut es aber nicht: der Betrieb schuldet die Arbeit,
die auf dem Papier steht.

#### Die Liste — acht Gruppen

**1. Ein eigener Arbeitsgang steht im Titel.** Das ist Manfreds Kern und die
mit Abstand wichtigste Gruppe:
schleifen · abschleifen · anschleifen · spachteln · grundieren · versiegeln ·
ölen · wachsen · lackieren · beizen · abbeizen · abbrennen · entsorgen ·
demontieren · ausbauen · fräsen · verschweißen · verkitten · vernähen

**2. Zustand von Untergrund oder Altlage:**
verklebt · vollflächig verklebt · mehrlagig · mehrfach · Nikotin · Ruß ·
Wasserflecken · Schimmel · Rost · Graffiti · feucht · sandend · kreidend ·
gerissen · Sinterschicht

**3. Stufen und Lagen:**
Q1–Q4 · 1x/2x/3x · einlagig · zweilagig · dreilagig · Schicht 1 / Schicht 2 ·
1 / 2 / 3 Schleifgänge · grob · fein
*(Q-Stufe und Anstrichzahl sind bereits harte Filter im Matcher — die bleiben
wie sie sind. Manfreds „Q3, Q4, dreifach" stehen also schon im Code.)*

**4. Maßschwellen — jede Zahl mit Maßeinheit im Titel:**
bis 3 mm · 3–10 mm · 10–30 mm · bis 15 mm · über 3 m · über 4 m · bis 20 km
Das sind die leisesten von allen. `Ausgleichsmasse einbringen` → `bis 3 mm`
(10,00 €) statt `3–10 mm` (16,00 €) oder `10–30 mm` (26,00 €): 16 € Unterschied
pro Quadratmeter, unsichtbar.

**5. Ort und Zugang:**
Treppenhaus · Dachschräge · Kniestock · Giebel · Fassade · außen · Keller ·
Garage · bewohnt · möbliert · Altbau
*(Manfreds „Treppenhaus, bewohnt, Decke über 3 m" gehören hier hin. Achtung:
als Erschwernis sind das eigene Zuschlagspositionen — hier geht es nur darum,
dass ein Katalogtitel, der eins dieser Wörter trägt, nicht auf einen Auftrag
ohne dieses Wort passt, und umgekehrt.)*

**6. Verlegeart und Muster:**
diagonal · Fischgrät · französisches Fischgrät · Schiffsboden · Muster ·
**schwimmend · verklebt · vollflächig · gespannt · getackert**
*(die fett gesetzten kamen am 12.09. dazu — siehe G.2: kein einziger
Verlege-Titel der Engine sagt heute, ob schwimmend oder verklebt, und der
Katalog sagt es bei jedem Eintrag)*

**7. Sondermaterial:**
Silikat · Latex · Lehm · Kalk · Epoxid · chlorbeständig · Brandschutz ·
Anti-Schimmel · Isolier- / Sperr-

**8. Materialbeistellung:**
inkl. Material · ohne Material · Material bauseits · nur verlegen
*(TN-122/TN-128: wer das Material selbst kauft, darf es nicht mitbezahlen —
und wer es stellt, darf nicht drauf sitzen bleiben.)*

#### Was ausdrücklich KEIN Aufwandswort ist

Bauteile (Wand, Decke, Boden — die sind seit E.2 ohnehin raus aus den
Titeln), Raumnamen, Farbtöne („weiß"), Markennamen, und Füllwörter wie
„fachgerecht", „komplett", „nach VOB". Wer die mit aufnimmt, sperrt sich den
halben Katalog weg, und dann tippt der Handwerker jeden zweiten Preis von
Hand — das ist kein besseres Produkt, das ist Word mit Extraschritten.

#### Zwei Dinge müssen vorher raus, sonst kann die Regel nicht greifen

Die Textnormalisierung wirft heute genau die Stellen weg, an denen die
Aufwandswörter stehen:

- `.replace(/\([^)]*\)/g, ' ')` — **Klammerinhalte fliegen raus.** Dort stehen
  die Millimeterspannen (Gruppe 4), die Schleifgänge (Gruppe 3) und
  „(vollflächig verklebt)" (Gruppe 2).
- `text.split(/\s+[—–-]\s+/)[0]` — **alles hinter dem Gedankenstrich fliegt
  raus.** Auf der Katalogseite steht dort „Schicht 1" bzw. „Schicht 2". Dass
  `Epoxid / Versiegelung — Schicht 2` heute den Schicht-1-Eintrag trifft, fällt
  nur deshalb nicht auf, weil beide 9,00 € kosten. Ändert einer davon sich,
  ist es derselbe Fehler wie TN-093.

Erst wenn die Wörter überhaupt bis zum Vergleich durchkommen, ist die Regel
mehr als eine Liste.

#### Was passiert, wenn ein Aufwandswort sperrt

Kein Preis, sichtbar, 0,00 €, Versand gesperrt (CoS-E-004). So weit richtig.
**Aber die bessere Antwort ist oft, die Position aufzuteilen statt sie zu
sperren.** `Heizkörper schleifen und lackieren` ist der Beweis: der Katalog hat
alle drei Schritte einzeln —
`Heizkörper abschleifen` 20,00 € + `Heizkörper grundieren` 25,00 € +
`Heizkörper streichen / lackieren` 40,00 € = **85,00 €/Stück**. Statt einer
gesperrten Zeile stehen dann drei bepreiste im Angebot, und der Kunde sieht
sogar, wofür er zahlt. Wo die Engine Arbeitsgänge in einen Titel packt,
gehören sie auseinander.

---

### F.2 Die 13 Zeilen — Entscheidung, Zeile für Zeile

**W** = dasselbe Wort, Katalog folgt der Engine · **L** = eigene Leistung,
Katalogeintrag anlegen · Richtwerte sind Netto-Einheitspreise auf dem Niveau
des Standardkatalogs.

| # | Engine sagt | Entscheidung | Richtwert |
|---|---|---|---|
| 1 | Fugen/Unreinheiten verkitten (lfdm) | **L + Katalog teilen.** `Fugen kitten / Risse ausspachteln` (8,00 €/m²) sind **zwei** Leistungen in einer Zeile. Verkitten ist Acryl in die Fuge (lfdm), Ausspachteln ist Fläche (m²). Engine-Titel → **„Fugen verkitten"** | neu **2,50 €/lfdm** (Manfred, G.1); Alt-Zeile bleibt als „Risse / Unreinheiten ausspachteln (Fläche)" 8,00 €/m² |
| 2 | Fliesenspiegel abkleben (lfdm) | **W** auf `Abkleben Kanten / Leisten`. Dieselbe Arbeit, die Folie über die Fliesen ist Nebenleistung. **Der Pauschale-Zweig derselben Position muss weg** — eine Arbeit, eine Einheit | 0,80 €/lfdm (vorhanden) |
| 3 | Sperranstrich / Flecken sperren (m²) | **W, Preis ist da.** Zwei Katalogzeilen zusammenführen, Titel **„Isoliergrund auftragen (Nikotin / Ruß / Wasserflecken / Schimmel)"**, Manfreds „Nikotinsperre" bleibt als Anzeigename (E.5) | 9,00 €/m² (vorhanden) |
| 4 | Heizkörper abkleben (Stück) | **L.** Nicht dasselbe wie ein Türrahmen (8,00 €): der ist Band auf glatter Fläche, der Heizkörper heißt Nische, Folie drumrum, Ventil, Rohre | **18,00 €/Stück** (nach Manfreds Einwand, G.1 — 6,00 € war zu billig) |
| 5+6 | Lampen / Leuchten + Pendelleuchten abkleben | **Zusammenlegen in der Engine** zu **„Leuchten / Spots abkleben"** (Stück), zusammen mit „Einbauspots abkleben" (F.3). Manfred hat recht: Kleinkram. Deshalb zusätzlich: **nur anlegen, wenn ausdrücklich genannt** — nie automatisch ergänzen | **3,00 €/Stück** (wie Schalter/Steckdosen) |
| 7 | Geländer abkleben (Pauschale) | **L, Einheit bleibt Pauschale.** Manfred hat mit lfdm fachlich recht, aber ohne Meterquelle ist die Pauschale die ehrlichere Zahl. Ein Treppenhausgeländer abkleben ist eine gute halbe Stunde | **35,00 €/Pauschale** |
| 8 | Rohre lackieren (lfdm) | **W** — keine Lücke: `Rohrleitungen lackieren` steht im Katalog. Engine-Titel angleichen. **Stück-Zweig derselben Position weg**, Rohre rechnet man in lfdm | 9,00 €/lfdm (vorhanden) |
| 9 | Betonfarbe streichen (m²) | **L.** Achtung: das ist eine **Wand**, nicht der Garagenboden — die Position ersetzt die Wandposition. `Garagenboden Betonfarbe` (12,00 €) wäre das falsche Bauteil | **13,50 €/m²** („Betonwände streichen (Betonfarbe, 2x)") |
| 10 | Aufpreis Spezialfarbe chlorbeständig (Pauschale) | **L, aber als m²-Aufpreis, nicht pauschal.** Chlorfeste Farbe kostet pro Quadratmeter mehr, nicht pro Auftrag. **Und die Umbenennung raus:** `pruefeChlor` hängt „(chlorbeständige Spezialfarbe)" an jede Streichposition, ohne dass sich der Preis ändert — das Versprechen steht auf dem Papier, bezahlt wird der Normalpreis | **6,00 €/m²** auf die Streichfläche |
| 11 | Untergrundvorbereitung für Kalkputz (m²) | **L.** Kalkputz will Haftgrund/Vorspritzer, nicht Tapetenwechselgrund | **8,00 €/m²** |
| 12 | Fugen fräsen (lfdm) | **L.** Nahtfräsen vor dem Verschweißen bei Vinyl/Linoleum | **3,50 €/lfdm** |
| 13 | Stoßkanten verkleben (lfdm) | **L.** Nicht dasselbe wie `Teppich vernähen / Naht verkleben` (8,00 €) — das ist Teppich. Manfreds Bauch sagte ~3 € | **3,50 €/lfdm** |
| 14 | — | erledigt (E.1) | — |

---

### F.3 Zehn Lücken, die in der Liste fehlten

Alle mit eigener Einheit, alle ohne Preis, alle heute im Code:

| Engine sagt | Entscheidung | Richtwert |
|---|---|---|
| Fugen thermisch verschweißen (inkl. Schweißdraht) — lfdm | **L.** `Linoleum verschweißen` (10,00 €) bündelt Fräsen + Schweißen; hier ist nur das Schweißen gemeint | **7,00 €/lfdm** |
| Kalkputz auftragen — m² | **W** → `Kalkputz aufbringen` | 35,00 €/m² (vorhanden) |
| Tiefengrund Beton — m² | **W** → `Grundieren (Tiefengrund)`. Tiefengrund ist Tiefengrund | 4,50 €/m² (vorhanden) |
| Betonwände schleifen / Untergrundvorbereitung — m² | **L.** Trifft heute `Wände schleifen nach Q2` — falsche Baustelle. Beton anschleifen heißt Sinterschicht runter | **7,50 €/m²** |
| Sperranstrich nach Schimmelbehandlung — m² | **W** auf dieselbe Isoliergrund-Zeile wie #3 (deshalb „Schimmel" im Titel) | 9,00 €/m² |
| Einbauspots abkleben — Stück | mit #5/#6 zusammenlegen | 3,00 €/Stück |
| Boden schützen / Abdeckfolie — **Pauschale** | **L.** Die m²-Variante matcht, die Pauschale-Variante (wenn keine Fläche bekannt ist) steht mit 0,00 € da — **das ist TN-090** | **25,00 €/Pauschale je Zimmer** |
| Abdecken Umgebung — Pauschale | **L.** Beim Lackieren wird die Umgebung abgeklebt, nicht der ganze Boden vliesbelegt | **20,00 €/Pauschale** |
| Fliesenspiegel abkleben — Pauschale | Zweig raus (siehe F.2 #2) | — |
| Parkett schleifen 2-fach / 3-fach (grob bis fein) — m² | **W.** Katalog: `Parkett abschleifen (maschinell, 2 Schleifgänge inkl. Rand)` 20,00 € und `(3 Schleifgänge)` 30,00 €. Heute findet die Engine mit „2-fach" **gar nichts** | 20,00 € / 30,00 €/m² (vorhanden) |

---

### F.4 Die 84er-Liste ist durchgesehen — neun fallen durch

Manfred hatte recht: „gut" heißt Score über 0,75, nicht richtig. Neun von 82
sind still falsch. **Die restlichen 73 nicke ich ab.**

| Engine sagt | trifft | Was daran falsch ist |
|---|---|---|
| **Deckenfläche streichen** (ohne Anstrichzahl) | `Decke streichen 1x Anstrich` 7,00 € | **Das ist TN-093, nochmal.** Der Wandzonen-Zweig in `maler.ts` schreibt die Anstrichzahl nicht in den Titel; ohne Zahl gewinnt unter 1x/2x/3x der alphabetisch erste. Jede Decke in einem Angebot mit Farbzonen wird zum 1x-Preis kalkuliert. **Kein Titel ohne Anstrichzahl** |
| **Parkett schleifen** | `Parkett schleifen + versiegeln komplett` 38,00 € | 38 statt 20 €, und eine versprochene Versiegelung, die keiner bestellt hat |
| **Tapete entfernen** | `Tapete ablösen (einlagig)` 4,00 € | `(mehrlagig, Aufpreis)` und `mit Dampfgerät` sind über die Engine **nie** erreichbar. Bei Altbau-Raufaser in drei Lagen rechnet der Maler sich arm |
| **Grundierung / Tiefengrund Fassade** | `Grundieren (Tiefengrund)` 4,50 € | `Fassadengrundierung auftragen` kostet 6,00 €. Auf einer Fassade sind das schnell 150 € |
| **Betonwände schleifen / Untergrundvorbereitung** | `Wände schleifen nach Q2` 5,50 € | Q-Stufe im Treffer, die im Auftrag nicht steht (siehe F.1) |
| **Epoxid / Versiegelung — Schicht 2** | `… — Schicht 1` | Alles hinter dem Gedankenstrich wird weggeschnitten, auch auf der Katalogseite. Heute gleicher Preis, morgen nicht |
| **Aufpreis Fischgrät-Verlegemuster (vollflächig verklebt)** | `Aufpreis Fischgrät-Verlegemuster` 14,00 € | Klammerinhalt weg. Fischgrät vollflächig verklebt ist mehr Arbeit als schwimmend |
| **Boden schützen** / **… / Abdecken** / **… / Abdeckfolie** | dieselbe Zeile | Drei Engine-Titel für eine Arbeit. Einer reicht: **„Boden abdecken (Abdeckvlies)"** |
| **Gerüst stellen und abbauen** | `Gerüst stellen (Pauschale)` 450,00 € | Der Abbau steht in keinem Katalogtitel. Wenn 450 € beides meint, muss die Katalogzeile so heißen |

Die drei knappen Treffer aus Abschnitt B bestätige ich alle drei, inklusive
`Fassade reinigen / Untergrundvorbereitung` → `Fassade reinigen / druckwaschen`
(in Ordnung, gleiche Arbeit). Der vierte (`Ausgleichsmasse einbringen`) taucht
in meinem Lauf nicht auf, weil der Titel aus Variablen entsteht — er bleibt
gültig und ist der Musterfall für Gruppe 4 der Aufwandswörter.

---

### F.5 Reihenfolge, wie ich sie machen würde

1. **Die zwei Mechanik-Lecks zuerst** (Klammern, Gedankenstrich) — ohne die
   ist die Aufwandswort-Regel ein Papier.
2. **Anstrichzahl in JEDEN Decken-/Wandtitel**, auch im Wandzonen-Zweig.
   Das ist ein Einzeiler und der teuerste Fehler auf dieser Seite.
3. **Aufwandswort-Regel, beide Richtungen**, mit der Liste aus F.1.
4. **Katalogzeilen anlegen/umbenennen** nach F.2 und F.3 — und die drei
   Dubletten einsammeln (Isoliergrund/Nikotinsperre, Fugen kitten,
   Boden abdecken).
5. **Doppelte Engine-Titel zusammenlegen** (Leuchten, Bodenschutz,
   Fliesenspiegel, Rohre) — das ist billiger als für jede Schreibweise
   einen Katalogeintrag zu pflegen.
6. **Dann** die Rückfrage im Angebot.

Zu Sandys Frage aus Abschnitt C: **Katalog folgt der Engine, ja** — mit
Manfreds Bedingung, und die ist mehr Arbeit, als sie klingt. Von den 107
Engine-Titeln ist ungefähr ein Dutzend keine Handwerkersprache
(„Untergrundvorbereitung für Kalkputz", „Boden schützen / Abdeckfolie",
„Betonwände schleifen / Untergrundvorbereitung"). Die gehören im selben
Durchgang umbenannt, sonst zwingen wir die gute Liste auf die schlechten
Wörter. Die Namen, die in F.2/F.3 fett stehen, sind mein Vorschlag dafür.

*Prüfmeister · 11.09.2026*

---

### F.6 Sandys Entscheidung — und die Umbenennungen, die vorher fällig sind

> **Katalog folgt der Engine — mit Manfreds Bedingung, dass die Engine-Wörter
> vorher Handwerkersprache werden.** (Sandy, 12.09.2026)

Damit ist Abschnitt C beantwortet und die Reihenfolge steht: **erst umbenennen,
dann den Katalog nachziehen.** Andersherum wäre es genau das, wovor Manfred
gewarnt hat — die gute Liste auf die schlechten Wörter zwingen.

Hier sind die Titel, die vorher dran müssen. Nichts davon ist Geschmack: es
sind Tool-Wörter („-fläche", „Untergrundvorbereitung" als Titel), doppelte
Schreibweisen für dieselbe Arbeit, und ein Fall, der dem Matcher aktiv
schadet.

**Doppelte Schreibweisen — eine Arbeit, ein Titel**

| Engine sagt heute | soll heißen |
|---|---|
| `Boden schützen` · `Boden schützen / Abdecken` · `Boden schützen / Abdeckfolie` | **`Boden abdecken (Abdeckvlies)`** |
| `Möbel schützen / Abdecken` | **`Möbel abdecken (Folie)`** |
| `Lampen / Leuchten abkleben` · `Pendelleuchten abkleben` · `Einbauspots abkleben` | **`Leuchten / Spots abkleben`** |
| `Dachschräge Grundierung` · `Dachschrägen grundieren` · `Deckenfläche grundieren` · `Voranstrich / Grundierung Decke` · `Tiefengrund Beton` | **`Grundieren (Tiefengrund)`** — ein Preis (4,50 €/m²), fünf Schreibweisen |
| `Estrich grundieren` | **`Estrich grundieren (Haftgrund)`** — eigener Titel, nicht in den Tiefengrund einsammeln (Manfred, G.1) |
| `Sperranstrich / Flecken sperren` · `Sperranstrich nach Schimmelbehandlung` | **`Isoliergrund auftragen (Nikotin / Ruß / Wasserflecken / Schimmel)`** |
| `Gerüst stellen und abbauen` · `Gerüst stellen (Pauschale)` | **`Gerüst stellen und abbauen`** (und die Katalogzeile genauso benennen) |

**Tool-Sprache — kein Handwerker sagt das so**

| Engine sagt heute | soll heißen |
|---|---|
| `Wandflächen streichen 2x` | **`Wand streichen 2x`** |
| `Wandflächen streichen 2x (ohne Akzentwand)` | **`Wand streichen 2x (ohne Akzentwand)`** |
| `Deckenfläche streichen 2x` | **`Decke streichen 2x`** |
| `Betonwände schleifen / Untergrundvorbereitung` | **`Betonwände anschleifen (Sinterschicht entfernen)`** |
| `Estrich schleifen / Untergrundvorbereitung` | **`Estrich anschleifen`** |
| `Fassade reinigen / Untergrundvorbereitung` | **`Fassade reinigen (druckwaschen)`** |
| `Untergrundvorbereitung für Kalkputz` | **`Untergrund für Kalkputz vorbereiten (Haftgrund / Vorspritzer)`** |
| `Grundierung / Tiefengrund Fassade` | **`Fassade grundieren`** — eigener Preis (6,00 €), nicht der Innen-Tiefengrund |
| `Abdecken Umgebung` | **`Umgebung abdecken (Lackierarbeiten)`** |
| `Fugen/Unreinheiten verkitten` | **`Fugen verkitten`** |

**Falsches Wort — der Katalog hat ein anderes** *(siehe F.2/F.3)*

| Engine sagt heute | soll heißen |
|---|---|
| `Rohre lackieren` | **`Rohrleitungen lackieren`** |
| `Kalkputz auftragen` | **`Kalkputz aufbringen`** |
| `Betonfarbe streichen` | **`Betonwände streichen (Betonfarbe, 2x)`** |
| `Parkett schleifen` · `Parkett schleifen 2-fach (grob bis fein)` | **`Parkett abschleifen (2 Schleifgänge)`** — Zahl der Schleifgänge gehört in den Titel |

**Ein Titel, der dem Matcher aktiv schadet**

`Epoxid / Versiegelung — Schicht 1` bzw. `— Schicht 2`. Der Gedankenstrich ist
im ganzen Produkt der Raumtrenner; alles dahinter wird abgeschnitten. Hier
steht dahinter die Schichtnummer — dieselbe Falle wie bei TN-093, nur an
anderer Stelle. Muss **`Epoxid-Versiegelung Schicht 1`** / **`Schicht 2`**
heißen, ohne Gedankenstrich. Kein Positionstitel darf einen Gedankenstrich
tragen, der nicht den Raum abtrennt.

**Eine offene Frage, die ich nicht allein entscheiden will:** `Wände spachteln
/ glätten` trägt keine Q-Stufe. Es trifft `Fläche spachteln (Flächenspachtel)`
zu 9,00 €. Solange kein Q im Titel steht, greift der Stufen-Filter nie, und
eine Q3-Fläche kann still zum Q2-Preis rausgehen — genau PM-018. Entweder die
Engine schreibt die Stufe rein (dann muss sie sie erfragen), oder die Position
heißt ausdrücklich `Wände spachteln (ohne Qualitätsstufe — bitte prüfen)`.
Ich tendiere zum Erfragen: bei Raufaser auf Altbau ist Q2 richtig, bei glatter
Wand mit Streiflicht nicht, und das kann nur der Handwerker sagen.

*Prüfmeister · 12.09.2026*

---

## G. Manfreds Rückmeldung zu F — und der Fund, den sie ausgelöst hat

### G.1 Seine fünf fachlichen Einwände

**1. Heizkörper abkleben 6 € ist zu billig — angenommen.** *„Ein Türrahmen
sind fünf Meter Band auf glatter Fläche. Ein Heizkörper heißt: dahinter,
Nische, Folie drumrum, Ventil, Rohre. Ich nehm 20, unter 15 würd ich's nicht
ansetzen."* Er hat recht und ich lag daneben — ich hatte die Nische nicht
gerechnet. **Richtwert jetzt 18,00 €/Stück** (F.2 #4 geändert).

**2. Fugen verkitten 4,50 € ist zu hoch — angenommen.** *„Acryl in die Fuge,
glattziehen, das sind 2–3 €."* **Richtwert jetzt 2,50 €/lfdm** (F.2 #1
geändert).

**3. „Grundieren (Tiefengrund)" für sechs Schreibweisen, auch für den
Estrich — angenommen, und der Einwand ist besser als mein Vorschlag.**
*„Estrich kriegt Haftgrund oder Epoxi-Grund vor der Ausgleichsmasse, nicht
Tiefengrund. Preis kann gleich bleiben, aber das Wort ist auf dem Boden
falsch."* Stimmt, und es steht sogar im Katalog: `Untergrund grundieren
(Haftbrücke / Tiefengrund)` unter Boden. **Also zwei Titel statt einem:**
`Grundieren (Tiefengrund)` für Wand und Decke, **`Estrich grundieren
(Haftgrund)`** für den Boden (F.6 geändert).

**4. Die Q-Rückfrage in seiner Sprache — angenommen, komplett.** *„‚Q2 oder
Q3?' versteht mein Geselle, mein Kunde am Telefon nicht. Die Rückfrage muss
heißen: ‚Nur ausbessern, oder ganz glatt für Streiflicht?' — und bei Raufaser
gar nicht erst fragen, da ist Q2 immer richtig. Fragen nur, wenn ‚glatt',
‚Streiflicht' oder ‚Vliestapete' gefallen ist."*

Damit ist die offene Frage aus F.6 beantwortet, und zwar besser als von mir
gestellt. Für den Engineer heißt das:

- Rückfragetext: **„Nur ausbessern, oder ganz glatt für Streiflicht?"**
  Antwort „ausbessern" → Q2, „glatt / Streiflicht" → Q3.
- **Auslöser:** nur wenn im Diktat „glatt", „Streiflicht" oder „Vliestapete"
  vorkommt. Fällt „Raufaser", wird nicht gefragt — Q2 ist gesetzt.
- Q4 fragt die App nicht ab. Wer Q4 braucht, sagt Q4.

**5. Der Kundenname des Isoliergrunds — angenommen.** *„Auf dem Angebot an
Frau Krüger will ich ‚Isoliergrund gegen Nikotinflecken' lesen, nicht eine
Klammer mit vier Möglichkeiten, von denen drei nicht bei ihr sind. Ist das
Anzeigename-Feld aus E.5 dafür da?"*

**Nein, ist es nicht** — und das ist ein wichtiger Unterschied, der bisher
nirgends stand. Das Feld aus E.5 hält fest, wie der **Betrieb** eine
Katalogzeile nennt (einmal, für alle Angebote). Was Manfred hier will, ist
etwas anderes: der Titel auf **diesem einen** Angebot, abhängig davon, was im
Diktat stand. Also drei Ebenen, nicht zwei:

| Ebene | Beispiel | wer besitzt sie |
|---|---|---|
| Engine-Wort (Zuordnung) | `Isoliergrund auftragen (Nikotin / Ruß / Wasserflecken / Schimmel)` | die App |
| Anzeigename im Katalog | „Nikotinsperre" | der Betrieb |
| Titel auf dem Angebot | „Isoliergrund gegen Nikotinflecken" | ergibt sich aus dem Diktat |

Die Klammer ist ein Suchbegriff, kein Kundentext. Sobald erkannt ist, was
gesperrt wird, gehört genau das in den Titel — und sonst nichts. Gehört mit
ins Datenmodell, wenn E.5 gebaut wird.

---

### G.2 Sein Punkt 6 — er hat recht, und es ist schlimmer als gedacht

> *„Die 26 Titel aus Variablen sind nicht die Restlücke der Methode, die sind
> der Kern vom Boden. Wenn da einer ‚Vinyl Klick verlegen' auf ‚Vinyl
> vollflächig verkleben' trifft, ist das der Teppich-verklebt-Fehler in groß."*

Ich hab die Werte ausgeschrieben — Belagnamen, Tapetentypen, Q-Stufen,
Versiegelungsgänge, Millimeterspannen, alle aus dem Code abgeschrieben und im
Skript hinterlegt, mit Quellenangabe je Liste. Neuer Stand:

| | vorher | jetzt |
|---|---|---|
| geprüfte Titel | 107 | **168** |
| ohne Preis | 22 | **29** |
| knapp (< 0,75) | 3 | **9** |
| nicht prüfbar | 26 | **3** |

**Der Fund: Kein einziger Verlege-Titel der Engine sagt, ob schwimmend oder
verklebt. Der Katalog sagt es bei jedem Eintrag. Also gewinnt immer der
Klick-Preis.**

| Engine sagt | bekommt | im Katalog steht auch |
|---|---|---|
| `Vinyl-Boden verlegen` · `Designboden verlegen` | `Klick-Vinyl (LVT) verlegen schwimmend` 16,00 € | Designbelag vollflächig kleben (deutlich teurer) |
| `Parkett verlegen` | `Fertigparkett verlegen schwimmend (Klick)` 22,00 € | Parkett vollflächig verkleben |
| `Laminat verlegen` | `Laminat verlegen schwimmend (Klick)` 14,00 € | — |
| `Kork verlegen` | `Korkboden verlegen schwimmend (Klick)` 18,00 € | Kork vollflächig verkleben |
| **`Nadelvlies-Teppichboden verlegen`** | **`Teppichboden verlegen (gespannt / Tackern auf Nagelleiste)` 14,00 €** | **`Nadelvlies vollflächig verkleben` 16,00 €** |

Die letzte Zeile ist die schlimmste: **Nadelvlies wird nie getackert, das wird
immer vollflächig verklebt.** Da steht nicht der falsche Preis von zwei
möglichen — da steht eine Arbeit, die es bei diesem Belag gar nicht gibt.

Dazu drei weitere aus demselben Lauf:

- **`Raufaser tapezieren`** trifft **`Raufaser tapezieren + überstreichen 1x`**
  (14,00 €). Ein Anstrich, den keiner bestellt hat, ist im Tapezierpreis
  versteckt — und die Position `Raufaser streichen`, die daneben steht, findet
  **gar keinen Preis**. Der Anstrich ist also gleichzeitig doppelt drin und
  nicht bepreist.
- **`Tapete tapezieren`** (der Fall, wo der Belag unklar ist) trifft
  `Vliestapete tapezieren` 18,00 € — die teuerste Tapetenart, geraten.
- **`Ausgleichsmasse einbringen (bis 10mm)`** und **`(bis 30mm)`** treffen
  beide `Ausgleichsmasse bis 3 mm einbringen` **10,00 €**, obwohl der Katalog
  16,00 € und 26,00 € dafür führt. **Die Engine schreibt die Millimeter in den
  Titel — die Normalisierung löscht sie, weil sie in Klammern stehen.** Das ist
  der Beweis für das Klammer-Leck aus F.1: Die Information ist da, sie wird
  weggeworfen.

**Was daraus folgt — zwei Aufträge:**

1. **Der Verlegeart-Titel.** Die Engine kennt das Wort schon (`GEKLEBT =
   /verkleb|vollflächig|geklebt/` in `boden.ts`), benutzt es aber nur für den
   Verschnitt, nicht für den Titel — dieselbe halbe Regel wie damals bei
   Fischgrät (PM-025). Der Titel muss **`… verlegen (schwimmend)`** bzw.
   **`… vollflächig verkleben`** heißen. Bei Nadelvlies gibt es nur eine
   Möglichkeit: verkleben.
2. **„verkleben", „vollflächig", „schwimmend", „gespannt", „getackert"** kommen
   in die Aufwandswortliste, Gruppe 6. Solange der Titel schweigt, greift keine
   Regel.

Ohne Preis stehen jetzt zusätzlich: `Bodenbelag verlegen`, `Teppich verlegen`,
`Eichenparkett verlegen`, `Raufaser streichen`, `Malervlies streichen`,
`Vliestapete streichen`, `Tapete streichen`. Die ersten drei sind
Sammelbegriffe, die entstehen, wenn der Belag im Diktat unklar bleibt — dafür
gehört **kein** Katalogeintrag angelegt. Da muss die App nachfragen, welcher
Belag es ist, sonst bepreist sie eine Leistung, die niemand beschreiben kann.
Die vier Streich-Titel dagegen sind echte Lücken: **`Raufaser streichen` /
`Malervlies streichen` / `Vliestapete streichen` — Richtwert 7,00 €/m²**
(1x Anstrich auf Tapete), `Tapete streichen` fällt weg, sobald der Typ
erkannt wird.

---

### G.3 Sein Punkt 7 — nein, seine zwei Fälle sind nicht durchgelaufen

> *„Sind meine zwei Fälle nochmal durchgelaufen? Das Krüger-Angebot müsste
> jetzt ‚Isoliergrund' mit 9 € bringen. Bevor ich das nicht gesehen hab, ist
> das für mich ein Papier, kein Fix."*

Klare Antwort: **nein — und mit dem heutigen Code würde es auch noch nicht
klappen.** Nachgeprüft, nicht vermutet:

- `Sperranstrich / Flecken sperren` findet weiterhin **keinen** Preis. Gebaut
  ist bisher nur, dass das Bauteil aus dem Titel raus ist (E.2). Die
  Umbenennung auf das Katalogwort ist **beschlossen, aber nicht gebaut** —
  sie ist Punkt 4 der Reihenfolge in F.5.
- Die Deckenposition im Farbzonen-Zweig trägt weiterhin keine Anstrichzahl,
  bekommt also weiterhin den 1x-Preis.

Sein Wohnzimmer sieht heute also aus wie gestern. Das ist kein Versäumnis,
sondern die Reihenfolge: erst die zwei Mechanik-Lecks, dann die Anstrichzahl,
dann die Umbenennungen. **Danach** läuft sein Diktat neu — und zwar bevor
irgendwer „grün" sagt. Ich trage das als festen Schritt in den Nachtestplan
ein: Szenario 1 und 2 aus seiner Session vom 11.09. komplett, gegen den
gefixten Stand.

---

### G.4 Was er noch angemerkt hat

**„Nur anlegen, wenn ausdrücklich genannt — nie automatisch ergänzen" soll
nicht nur für die Leuchten gelten.** Richtig, und das ist eine größere
Entscheidung als diese Datei — sie betrifft Möbel abdecken, Deckengrundierung,
„bewohnt" (TN-037/040/042). Gehört nicht hier hinein, sondern in die
Produktregel. Ich nehme sie in den Themenspeicher auf, damit sie nicht
zwischen den Zeilen dieser Datei verschwindet.

**Zum Eindampfen der Datei (sein Punkt an Sandy):** Er hat recht, 580 Zeilen
mit E, F, G und einem widerlegten E.3 liest in vier Wochen keiner mehr. Sobald
die Umbenennungen gebaut sind, wird daraus eine Seite: Regel, Wortliste,
Umbenennungstabelle, Reihenfolge. Vorher nicht — solange gebaut wird, ist die
Begründung das, was Rückfragen spart.

*Prüfmeister · 12.09.2026*

---

## H. Gebaut — die Aufwandswörter (Head of Product Engineering, 12.09.2026)

Punkt 1 und 3 seiner Liste sind gebaut. Regel und Wortliste stehen in
`src/lib/preis-aufwandswoerter.ts`, geprüft in
`src/lib/__tests__/preis-aufwandswoerter.test.ts`.

### H.1 Nicht wie im Papier — und warum

Er wollte die zwei Mechanik-Lecks der Normalisierung stopfen (Klammern und
alles hinter dem Gedankenstrich). Gebaut ist der andere Weg: Die Wörter
laufen gar nicht erst durch die Normalisierung, sondern werden **wie die
Q-Stufe und die Anstrichzahl als Filter am Rohtitel** gelesen.

Das ist kleiner und sicherer. Beide Lecks sind damit erledigt, ohne die
Normalisierung anzufassen — und ein Aufwandswort kann nicht mehr von einem
hohen Textscore überstimmt werden. Farbtöne in Klammern stören weiterhin
nichts, so wie er es verlangt hat.

### H.2 Drei Fehler, die die Messung nicht gezeigt hat

Die Regel sah nach dem zweiten Anlauf in der Messung gut aus und war an drei
Stellen unwirksam oder schädlich. Alle drei standen **nicht** in den Zahlen —
sie sind erst beim Zeile-für-Zeile-Vergleich „mit Regel gegen ohne Regel"
aufgefallen. Deshalb steht das hier:

**1. `\b` kennt kein Umlaut.** In JavaScript sind `\b` und `\w` nur ASCII.
`/\bölen\b/` trifft deshalb NIE — links vom „ö" steht ein Leerzeichen, und
zwei Nicht-Wortzeichen ergeben keine Grenze. Folge: Sein Hauptfall war nur
halb behoben. `Parkett schleifen` landete weiter auf einem Komplettpaket, nur
auf `+ ölen` (45,00 €) statt `+ versiegeln` (38,00 €). Dasselbe bei „Ruß".
Jetzt Unicode-Grenzen statt `\b`.

**2. Ein verlorenes Flag schaltet die Grenzen still ab.** Beim Markieren wurde
das Muster mit `new RegExp(quelle, 'gi')` neu gebaut — ohne `u`. Ohne `u` ist
`\p{L}` keine Unicode-Eigenschaft mehr, sondern der Buchstabe „p", und
`(?![\p{L}])` heißt plötzlich „nicht p, {, L oder }". Damit war jede Grenze
wirkungslos: `Ölfarbe` zählte als Arbeitsgang „ölen", und
`Fenster lackieren (Ölfarbe, 2× Anstrich)` verlor seine 55,00 €. Er hat
Materialien und Farbtöne ausdrücklich als Nicht-Aufwandswörter benannt — der
Fehler hat genau dagegen verstoßen, und zwar unsichtbar.

**3. Der Katalog schreibt „Schleifgang" mit a.** Das Muster kannte nur
„Schleifgänge" mit ä. Der Einzahl-Eintrag trug damit keinen Marker, und
`Parkett abschleifen (2 Schleifgänge)` bekam mit Score 1,00 den 12-€-Preis
für EINEN Gang. Die Sperre sah aus wie eine Sperre und war keine.

Die Lehre, festgehalten: **Eine Filterregel, die nicht greift, ist in der
Messung nicht von einer Regel zu unterscheiden, die greift und nichts
findet.** Der Beweis ist der Zeilenvergleich, nicht die Summe.

### H.3 Die Verlegeart sperrt nur in EINE Richtung

Seine Gruppe 6 (verklebt / schwimmend / gespannt) ist gebaut, aber
asymmetrisch — und das ist der einzige Punkt, an dem ich von seinem Papier
abweiche, ohne dass ein Fehler der Grund wäre.

- **Gesuchter Titel sagt „verklebt", Katalog sagt „lose" → gesperrt.** Das ist
  Manfreds Fall, und er trägt: `Alten Teppichboden entfernen (verklebt)`
  bekommt jetzt 9,00 € (`Teppichboden verklebt entfernen`) statt 6,00 €
  (`entfernen und entsorgen`).
- **Gesuchter Titel sagt nichts, Katalog sagt „schwimmend" → NICHT gesperrt.**

Der zweite Halbsatz ist das Zugeständnis. Die Engine schreibt die Verlegeart
heute an genau einer Stelle in den Titel, der Katalog nennt sie bei fast jedem
Eintrag. Beidseitig gelesen fallen dann alle ehrlichen Katalogzeilen weg und
übrig bleibt die exotische. Gemessen, am 12.09., mit beidseitiger Regel:

| Engine-Titel | vorher | mit beidseitiger Regel |
|---|---|---|
| `Laminat verlegen` | 14,00 € (schwimmend, Klick) | **24,00 €** (Fischgrätmuster) |
| `Parkett verlegen` | 22,00 € (Fertigparkett schwimmend) | **52,00 €** (Industrieparkett) |
| `Fertigparkett verlegen` | 22,00 € | **52,00 €** |
| `Klick-Vinyl verlegen` | 16,00 € (LVT schwimmend) | **17,00 €** (Einzelplanken) |

Das ist derselbe Schaden, den die Regel verhindern soll, nur mit umgedrehtem
Vorzeichen. Die Gegenrichtung wird aufgemacht, **sobald G.2 gebaut ist** — die
Engine muss die Verlegeart selbst in den Titel schreiben. Vorher richtet sie
mehr Schaden an, als sie verhindert. Steht als Bedingung im Code.

Ein Wort ist dazugekommen, das im Papier fehlt: **„Klick"**. Ein Klick-Belag
wird nie verklebt, das Wort IST die Aussage „schwimmend". Ohne es verlor
`Klick-Vinyl verlegen` seinen eigenen Katalogeintrag an einen Loose-Lay-Preis.

### H.4 Drei Umbenennungen aus F.6 gleich mitgebaut

Die Regel war ohne sie nicht auslieferbar — sie hätte sonst Positionen
gesperrt, die es gar nicht hätte treffen dürfen:

| Engine-Titel alt | neu | Grund |
|---|---|---|
| `Parkett schleifen` · `Parkett schleifen 3-fach (grob bis fein)` | `Parkett abschleifen (N Schleifgänge)` | Seine F.6-Tabelle wörtlich. Der alte Titel fand entweder gar nichts oder das 38-€-Komplettpaket **zusätzlich** zu den zwei Versiegelungs-Positionen, die im selben Angebot schon einzeln stehen. Doppelt berechnet, und eine Lackversiegelung auf dem Kundenpapier, obwohl im Transkript „ölen" steht. Ohne Angabe im Transkript: **2 Gänge** (grob + fein) — vorher stand dort still 1 Gang, also der 12-€-Eintrag statt 20 €. |
| `Aufpreis Fischgrät-Verlegemuster (vollflächig verklebt)` | `Aufpreis Fischgrät-Verlegemuster` | Der Zusatz beschreibt die Verlegeart der HAUPTposition, nicht die Arbeit dieser Zeile; ein Aufpreis aufs Muster ist verlegeartneutral. Derselbe Aufpreis hieß in `boden.ts` ohnehin schon so. Die Information steht weiter in den Annahmen. |
| `Heizkörper schleifen und lackieren` | `Heizkörper abschleifen` + `Heizkörper streichen / lackieren` | Seine eigene Empfehlung: *„Wo die Engine Arbeitsgänge in einen Titel packt, gehören sie auseinander."* Zwei bepreiste Zeilen (20,00 € + 40,00 €) statt einer gesperrten. **Grundieren (25,00 €) habe ich NICHT ergänzt** — das Transkript sagt „schleifen und lackieren", und eine Grundierung dazuzuerfinden wäre eine Entscheidung, keine Ableitung. |

Beim Umbenennen ist prompt ein toter Pfad aufgetaucht — der fünfte in zwei
Tagen: In `boden-sonder.ts` las eine Flächenermittlung den Titel
`/parkett schleifen/` als stillen Vertrag mit. Nach der Umbenennung lieferte
sie wortlos `null`, und Versiegelung und Verkitten rutschten aus dem Angebot
in die Fehlt-Liste. **Wer einen Engine-Titel ändert, muss nach Stellen suchen,
die ihn lesen.** Ich nehme das in die Routine auf.

### H.5 Was die Messung jetzt sagt

```
                                    vorher   nachher
Engine-Titel mit eigener Einheit       166       165
davon ohne Preis                        29        31
davon knapp (Score < 0,75)               9         7
gute Treffer (Score >= 0,75)           128       127
```

**Die Zahl „ohne Preis" steigt, und das ist die gewollte Richtung.** Jede der
neuen Null-Positionen ist eine, die vorher still einen falschen Preis trug:

| Position | stand vorher da | jetzt |
|---|---|---|
| `Ausgleichsmasse einbringen (bis 10mm)` | 10,00 € (der bis-3-mm-Preis) | 0,00 €, Versand gesperrt |
| `Ausgleichsmasse einbringen (bis 30mm)` | 10,00 € (derselbe) | 0,00 €, Versand gesperrt |

**Nachtrag 12.09., und es ist eine Korrektur an mir selbst:** Der Satz „für
beide führt der Katalog keine Zeile" war falsch. Er führt sie — sie heißen nur
anders (`Ausgleichsmasse 3–10 mm einbringen` 16,00 €,
`10–30 mm` 26,00 €). Siehe Abschnitt J. Es war also nie ein Katalog-Schritt,
sondern eine Umbenennung.

Und die Treffer, die sich **verbessert** haben:

| Position | vorher | jetzt |
|---|---|---|
| `Alten Teppichboden entfernen (verklebt)` | 6,00 € (lose) | **9,00 €** (verklebt) |
| `Epoxid / Versiegelung — Schicht 2` | Schicht-1-Eintrag | **Schicht-2-Eintrag** |
| `Grundierung / Tiefengrund Fassade` | 4,50 € (innen) | **6,00 €** (Fassade) |
| `Parkett abschleifen (2 Schleifgänge)` | 38,00 € (inkl. Versiegelung) | **20,00 €** (nur Schliff) |
| `Heizkörper schleifen + lackieren` | 40,00 € (ohne Schliff) | **20 + 40 = 60,00 €** |

Ein Rest bleibt sichtbar offen: `Grundierung / Tiefengrund Fassade` trifft den
richtigen PREIS, aber über den Eintrag `Grundierung Fassade nach Graffiti`.
`Fassadengrundierung auftragen` (6,00 €) kommt textlich nicht über die
Schwelle. Der richtige Betrag auf dem Kundenpapier, der falsche Name — das
löst die Umbenennung aus F.6, nicht der Matcher.

### H.6 Was als Nächstes dran ist

1. **G.2** — die Engine muss die Verlegeart in den Titel schreiben
   (`… verlegen (schwimmend)` / `… vollflächig verkleben`; Nadelvlies ist
   IMMER verklebt). Erst danach darf die Verlegeart beidseitig sperren.
2. **F.5/4** — die Katalogeinträge aus F.2/F.3 anlegen (Ausgleichsmasse
   10 mm / 30 mm zuerst, die stehen jetzt sichtbar auf 0,00 €).
3. **F.5/5** — die restlichen Umbenennungen aus F.6 (Leuchten, Bodenschutz,
   Fliesenspiegel, Rohre, Fassadengrundierung).
4. **F.5/6** — erst dann die Rückfrage im Angebot.
5. **G.3** — seine beiden Szenarien vom 11.09. komplett neu fahren.
   *„Bevor ich das nicht gesehen hab, ist das für mich ein Papier, kein Fix."*

*Head of Product Engineering · 12.09.2026*

---

## I. Gebaut — G.2, die Verlegeart im Titel (12.09.2026)

`src/lib/verlegeart.ts`, geprüft in `src/lib/__tests__/verlegeart.test.ts`.

### I.1 Die Regel hört da auf, wo das Raten anfängt

Geschrieben wird die Verlegeart nur dort, wo sie **feststeht** — weil sie im
Diktat gesagt wurde oder weil der Belag sie technisch vorgibt. Wo sie eine
echte Wahl ist, bleibt der Titel stumm.

| | Verlegeart | woher |
|---|---|---|
| Laminat, Feuchtraumlaminat | schwimmend | technisch — Laminat wird nicht verklebt |
| Klick-Belag | *(kein Zusatz)* | der Name sagt es schon |
| Linoleum | vollflächig verklebt | technisch — Rollenware wird geklebt |
| Nadelvlies | vollflächig verklebt | Manfred + Prüfmeister: schwimmend gibt es bei dem Belag nicht |
| Fertigparkett, Parkett, Kork | das Diktat entscheidet | beide Arten kommen vor |
| Teppichboden | verklebt, wenn gesagt — **nie** schwimmend | gespannt / geklebt / lose |
| Bodenbelag (unbekannt) | *(kein Zusatz)* | wir wissen nichts |

Gesagtes schlägt Technik nur dort, wo die Technik offen ist. Ein „Nadelvlies
schwimmend" im Diktat bleibt verklebt — ein Verhörer darf die Kalkulation
nicht kippen.

### I.2 Der Zusatz kann selbst Schaden anrichten

Der wichtigste Fund an diesem Stück, und er stand in keinem Papier:

**Ein Zusatz OHNE passende Katalogzeile ist schlimmer als gar keiner.**

`Vinyl-Boden verlegen vollflächig verklebt` traf `Fertigparkett verlegen
vollflächig verklebt` — **35,00 € statt 16,00 €**. Der Zusatz macht den Titel
textlich so ähnlich zur Parkettzeile, dass der Belagname allein nicht mehr den
Ausschlag gibt. Der Katalog führt Vinyl unter anderen Wörtern
(`Klebe-Vinyl verlegen vollflächig`, `Dryback-Designbelag vollflächig kleben`).

Dasselbe bei `Eichenparkett` und beim nackten `Teppich`. Diese Beläge bekommen
deshalb **keinen** Zusatz; sie gehören in die Umbenennungstabelle F.6, wo der
Titel wörtlich wie im Katalog heißt. Welcher Vinyl-Kleber der Standard ist —
Dünnbett 22,00 € oder Profikleber 28,00 € — ist eine Preisfrage für Manfred,
keine Ableitung.

Zwei weitere Fälle derselben Art, beide vorher gefunden und abgestellt:

- `Teppichboden verlegen schwimmend` (ein „Klick-Vinyl" in einem ANDEREN Raum
  reichte) traf `Fertigparkett verlegen schwimmend`, **22,00 €/m² für einen
  Teppich**. Teppich kann nicht schwimmend — steht jetzt in der Tabelle.
- `Klick-Vinyl verlegen schwimmend` traf die SPC-Variante (18,00 €) statt der
  Standard-LVT (16,00 €), weil „, Standard" ein Token zu viel war. Ein
  Klick-Belag bekommt deshalb gar keinen Zusatz — der Name genügt.

Das steht jetzt als Test, nicht als Fußnote: Jede Kombination, die
`verlegeart.ts` erzeugen kann, muss im Standardkatalog eine Zeile mit
demselben Belagwort finden. Wer einen Belag aufnimmt, dessen Zeile fehlt,
merkt es dort und nicht im Angebot eines Handwerkers.

### I.3 Was jetzt im Angebot steht

Alle Kombinationen treffen exakt (Score 1,00), bis auf eine:

| Engine-Titel | Katalogzeile | |
|---|---|---|
| `Laminat verlegen schwimmend` | Laminat verlegen schwimmend (Klick-System, Standard) | 14,00 € |
| `Fertigparkett verlegen schwimmend` | Fertigparkett verlegen schwimmend (Klick-System) | 22,00 € |
| `Fertigparkett verlegen vollflächig verklebt` | Fertigparkett verlegen vollflächig verklebt | 35,00 € |
| `Kork verlegen schwimmend` | Korkboden verlegen schwimmend (Klick-System) | 18,00 € |
| `Kork verlegen vollflächig verklebt` | Korkboden verlegen vollflächig verklebt | 24,00 € |
| `Linoleum verlegen vollflächig verklebt` | Linoleum verlegen vollflächig verklebt (Rollenware) | 22,00 € |
| `Teppichboden verlegen vollflächig verklebt` | Teppichboden verlegen vollflächig verklebt | 18,00 € |
| `Nadelvlies-Teppichboden verlegen vollflächig verklebt` | Teppichboden verlegen vollflächig verklebt | 18,00 € ⚠ |

⚠ Der Katalog führt `Nadelvlies vollflächig verkleben` für 16,00 €. Der
Nadelvlies-Titel trifft ihn textlich nicht und landet 2,00 € zu hoch. Vorher
traf er `Teppichboden verlegen (gespannt)` für 14,00 € — also eine Verlegeart,
die es bei Nadelvlies gar nicht gibt. Besser, aber noch nicht richtig: gehört
in F.6.

### I.4 Das Messgerät musste mit

Die Verlegeart steht als Funktionsaufruf im Template. Nach dem ersten Bau
sprang `Titel aus Variablen, nicht prüfbar` von 4 auf 17 — der Abgleich war
blind für genau das Stück, das gerade dazugekommen war. Das Skript fragt
`verlegeartZusatz()` jetzt selbst und wirft anschließend die Kombinationen
weg, die die Engine gar nicht schreiben kann (`Laminat verlegen vollflächig
verklebt`). Sonst stünden dort erfundene Lücken — genau der Fehler, den der
Prüfmeister am ersten, handgeschriebenen Abgleich nachgewiesen hat.

Geprüfte Titel: **172** (vorher 165), unauflösbar: **3** (vorher 4).

### I.5 Die Verlegeart sperrt weiterhin nur in eine Richtung — dauerhaft

Meine Ankündigung nach H war: Sobald die Engine die Verlegeart schreibt, darf
auch die Gegenrichtung sperren. **Das war falsch, und die Messung sagt es
deutlich.** Beidseitig, nach G.2 gemessen:

| Engine-Titel | einseitig | beidseitig |
|---|---|---|
| `Fertigparkett verlegen` | 22,00 € | **52,00 €** (Industrieparkett) |
| `Parkett verlegen` | 22,00 € | **52,00 €** |
| `Vinyl-Boden verlegen` | 16,00 € | **25,00 €** (WPC / Outdoorvinyl) |
| `Vinyl / Designboden verlegen` | 17,00 € | **42,00 €** (mit Fries / Bordüre) |

Der Grund ist einleuchtend, sobald man ihn sieht: Nach G.2 schweigt der
Engine-Titel nur noch dort, wo die Verlegeart **wirklich offen** ist. Genau
dort darf man sie nicht als Filter benutzen — man wirft alle ehrlichen
Katalogzeilen weg und behält die exotische. Die richtige Antwort auf einen
offenen Fall ist die **Rückfrage im Angebot** (F.5/6), nicht eine Sperre, die
so tut, als wüsste sie etwas.

Damit ist auch klar, was die Rückfrage später fragen muss — und zwar nur dann,
wenn der Titel stumm geblieben ist:

- Teppich: *„Gespannt, verklebt oder lose?"* (14 / 18 / 10 €)
- Parkett, Kork: *„Schwimmend oder vollflächig verklebt?"* (22 / 35 €, 18 / 24 €)
- Vinyl: *„Klick oder geklebt?"* (16 / 28 €)

*Head of Product Engineering · 12.09.2026*

---

## J. Ausgleichsmasse — und warum F.5/4 kleiner war als gedacht (12.09.2026)

Ich wollte die zwei fehlenden Katalogeinträge anlegen und habe zuerst
nachgesehen, was der Katalog wirklich führt. **Er führt sie schon:**

```
Ausgleichsmasse bis 3 mm einbringen      10,00 €/m²
Ausgleichsmasse 3–10 mm einbringen       16,00 €/m²
Ausgleichsmasse 10–30 mm einbringen      26,00 €/m²
```

Die Lücke war nie im Katalog, sondern im Engine-Titel: Er schrieb
`Ausgleichsmasse einbringen (bis 10mm)` — eine Schreibweise, die es im Katalog
nicht gibt. Die Klammer fällt in der Normalisierung weg, also bekamen **alle
drei Stärken den 3-mm-Preis**: 10,00 € statt 16,00 € oder 26,00 €. Bei 60 m²
Estrich sind das knapp tausend Euro, die niemandem auffallen — der
Prüfmeister: *„Das sind die leisesten von allen."*

Seit die Maßschwellen ein Filter sind (H), war der falsche Preis weg und die
Position stand sichtbar auf 0,00 €. Richtig, aber unbrauchbar: Der Preis war
ja da. Jetzt baut `ausgleichsmasseTitel()` in `boden-basis.ts` die Stärke aus
dem Diktat in die Staffel des Katalogs:

| im Diktat | Titel | Preis |
|---|---|---|
| nichts gesagt | `Ausgleichsmasse einbringen` | 10,00 € (Grundfall) |
| bis 3 mm | `Ausgleichsmasse bis 3 mm einbringen` | 10,00 € |
| 4–10 mm | `Ausgleichsmasse 3–10 mm einbringen` | 16,00 € |
| 11–30 mm | `Ausgleichsmasse 10–30 mm einbringen` | 26,00 € |
| über 30 mm | `Ausgleichsmasse einbringen (45 mm)` | **kein Preis, sichtbar** |

Über 30 mm hört der Boden-Katalog auf; weiter geht es nur unter „Estrich –
Ausgleich & Spachtelung", einem anderen Gewerk. Lieber sichtbar ohne Preis als
still der 26-€-Satz für eine anderthalbmal so dicke Schicht (PM-018).

Geprüft in `src/lib/__tests__/ausgleichsmasse.test.ts`, inklusive der Zusage,
dass keine Stärke den Preis einer anderen bekommt.

### J.1 Was das für die restliche F.5/4-Liste heißt

**Erst nachsehen, was der Katalog führt, dann Einträge anlegen.** Von den
Richtwerten aus F.2/F.3 sind mehrere schon als „**W**" markiert (dasselbe
Wort, Katalog folgt der Engine) — das sind Umbenennungen, keine neuen
Einträge. Ich gehe die Liste vor dem Anlegen einzeln durch, so wie hier.

### J.2 Das Messgerät, zum zweiten Mal

Der Titel kommt jetzt aus einer Funktion statt aus einem Template. Das
Abgleich-Skript liest nur Text-Literale — die vier Ausgleichsmasse-Titel wären
also stillschweigend aus der Messung verschwunden, genau wie bei G.2. Das
Skript ruft `ausgleichsmasseTitel()` deshalb selbst auf, mit je einem
Vertreter pro Stufe. Zum zweiten Mal an einem Tag dieselbe Lehre:

**Wer die Engine ändert, muss das Prüfskript mitziehen — sonst misst es still
weniger, als es behauptet.**

### J.3 Offen: nicht nachgemessen

Meine Shell auf Sandys Rechner ist während dieser Änderung ausgefallen (ein
Windows-Update vom 08.09. blockiert den Zugriff). Geprüft ist diese Änderung
am echten Standardkatalog, aber in einer Ersatzumgebung — **die Testsuite und
`node scripts/vokabular-abgleich.mjs` sind noch nicht gelaufen.** Beides muss
nachgeholt werden, bevor der Stand als fertig gilt.

*Head of Product Engineering · 12.09.2026*

---

## K. Umbenennungen, Zug 1 (12.09.2026)

Sandys Entscheidung (CoS-E-048): Umbenennungen jetzt, neue Katalogeinträge
später in einem Zug mit der Migration. Das hier ist der erste Zug — nur die
Titel, bei denen der Katalog den Preis **schon führt**.

| Engine sagte | heißt jetzt | vorher | jetzt |
|---|---|---|---|
| `Tiefengrund Beton` | `Grundieren (Tiefengrund)` | **0,00 €** | **4,50 €/m²** |
| `Kalkputz auftragen` | `Kalkputz aufbringen` | **0,00 €** | **35,00 €/m²** |
| `Rohre lackieren` | `Rohrleitungen lackieren` | **0,00 €** | **9,00 €/lfdm** |
| `Fassade reinigen / Untergrundvorbereitung` | `Fassade reinigen (druckwaschen)` | 5,00 € (Treffer 0,67) | 5,00 € (Treffer 0,94) |
| `Grundierung / Tiefengrund Fassade` | `Fassadengrundierung auftragen` | 6,00 € über die **Graffiti**-Zeile | 6,00 € über die richtige Zeile |

Drei Positionen, die im Angebot mit 0,00 € standen, haben jetzt einen Preis —
und zwar einen, der die ganze Zeit im Katalog stand. Niemand musste etwas
anlegen.

Dazu aus F.2 #8: **Der Stück-Zweig bei den Rohren ist raus.** Ohne Meterangabe
wurde bisher „1 Stück pro Heizkörper" erfunden und als Stück-Position
ausgegeben — eine Einheit, die der Katalog für diese Arbeit nicht führt, mit
einer Menge, die niemand gesagt hat. Jetzt steht die Position sichtbar in der
Fehlt-Liste mit der Bitte um die Meter.

### K.1 Der wichtigste Fund: Eine Umbenennung kann einen Preis zerstören

`Estrich schleifen / Untergrundvorbereitung` → `Estrich anschleifen` steht in
seiner Tabelle, ist fachlich richtig — und **hätte 8,00 € gegen 0,00 €
getauscht.**

Der Standardkatalog führt die Zeile wörtlich mit dem Werkzeugwort:
`Estrich schleifen / Untergrundvorbereitung`, Maler, 8,00 €/m², Treffer 1,00.
Die Zeile mit dem besseren Wort (`Estrich anschleifen und absaugen`, 8,50 €)
steht unter **Boden** und fällt für eine Malerposition durch den
Gewerke-Filter.

Daraus die Regel für den Rest der Tabelle:

> **Eine Umbenennung ist nur dann für sich allein sicher, wenn der Katalog das
> neue Wort schon führt. Sonst gehören Engine-Titel und Katalogzeile in
> denselben Zug.**

Das ist das Spiegelbild der G.2-Lehre („ein Zusatz ohne passende Katalogzeile
ist schlimmer als gar keiner"). Ich prüfe deshalb jede weitere Umbenennung
vorher gegen den echten Katalog, unter dem **richtigen Gewerk** — dieselbe
Zeile kann unter Maler existieren und unter Boden nicht.

### K.2 Eine Abweichung vom Papier, gemessen

Er schlägt `Fassade grundieren` vor. Das trifft mit 0,80 den Eintrag
`Grundierung Fassade nach Graffiti` — richtiger Betrag, falscher Name auf dem
Kundenpapier. Der Katalog führt die neutrale Zeile als
`Fassadengrundierung auftragen`, ebenfalls 6,00 €, Treffer 1,00. Also die
Katalogschreibweise, wie überall heute. Handwerkersprache bleibt es auch.

### K.3 Was noch aussteht, und warum

**Zurückgestellt in den Katalog-Zug** (Engine + Katalogzeile zusammen):
`Estrich anschleifen`, `Epoxid-Versiegelung Schicht 1/2` (die Katalogzeile
trägt den Gedankenstrich selbst; die Falle ist seit den Aufwandswörtern
ohnehin entschärft), `Gerüst stellen und abbauen`.

**Wartet auf Richtwerte des Prüfmeisters** (neue Katalogzeilen):
`Betonwände anschleifen`, `Betonwände streichen (Betonfarbe, 2x)`,
`Untergrund für Kalkputz vorbereiten`, `Umgebung abdecken`, `Fugen verkitten`,
`Geländer abkleben`, `Fugen fräsen`, `Stoßkanten verkleben`,
`Fugen thermisch verschweißen`, `Boden abdecken (Pauschale)`,
`Heizkörper abkleben`, `Leuchten / Spots abkleben`.

**Nächster Zug, ohne Katalogänderung:** die Tool-Sprache im Kundenpapier
(`Wandflächen streichen` → `Wand streichen`, `Deckenfläche` → `Decke`) und die
Zusammenlegungen (Leuchten/Spots, Boden abdecken, Möbel abdecken,
Sperranstrich → Isoliergrund). Die fasse ich als eigenen Zug an, weil sie
breit streuen — der Wand-/Decken-Titel steckt in der Maler-Engine, in den
Farbzonen und in vielen Tests.

**Nicht meine Entscheidung, liegt weiter bei Manfred:** die offene Frage am
Ende von F.6 — `Wände spachteln / glätten` ohne Q-Stufe. Solange kein Q im
Titel steht, greift der Stufen-Filter nie, und eine Q3-Fläche kann still zum
Q2-Preis rausgehen. Der Prüfmeister will das nicht allein entscheiden, ich
auch nicht.

*Head of Product Engineering · 12.09.2026*

---

## L. Umbenennungen, Zug 2a — die Zusammenlegungen (12.09.2026)

| Engine sagte | heißt jetzt | vorher | jetzt |
|---|---|---|---|
| `Sperranstrich / Flecken sperren` | `Isoliergrund gegen Nikotin / Ruß / Wasserflecken` | **0,00 €** | **9,00 €/m²** |
| `Sperranstrich nach Schimmelbehandlung` | dieselbe Zeile | **0,00 €** | **9,00 €/m²** |
| `Fliesenspiegel abkleben` (lfdm) | `Abkleben Kanten / Leisten` | **0,00 €** | **0,80 €/lfdm** |
| `Boden schützen / Abdeckfolie` | `Boden abdecken (Abdeckvlies)` | 1,20 € (0,94) | 1,20 € (1,00) |
| `Möbel schützen / Abdecken` | `Möbel abdecken mit Folie` | 1,50 € (0,80) | 1,50 € (1,00) |
| `Deckenfläche grundieren` · `Dachschräge Grundierung` | `Grundieren (Tiefengrund)` | 4,50 € (0,94) | 4,50 € (1,00) |
| `Lampen / Leuchten` · `Pendelleuchten` · `Einbauspots abkleben` | `Leuchten / Spots abkleben` | 3 × 0,00 € | **1 ×** 0,00 € |

Dazu zwei Zweige, die erfundene Mengen ausgaben und jetzt in der Fehlt-Liste
stehen: der Pauschale-Zweig beim Fliesenspiegel (Menge 1 für eine Leistung,
die in laufenden Metern abgerechnet wird — „eine Arbeit, eine Einheit") und,
schon in Zug 1, der Stück-Zweig bei den Rohren.

### L.1 Zwei Titel aus dem Papier funktionieren nicht — gemessen

**`Isoliergrund auftragen (Nikotin / Ruß / Wasserflecken / Schimmel)` findet
nichts.** Der Grund ist die Aufwandswort-Regel von heute Morgen: „Schimmel"
steht im gesuchten Titel, nicht in der Katalogzeile → harte Sperre. Und die
Regel hat recht. Der Titel verspricht Arbeit am Schimmel, die diese Zeile
nicht bepreist; die Behandlung selbst steht als eigene Position darüber.
Gebaut ist deshalb der Katalogtitel wörtlich, der Anlass steht im
**Rechenweg** — der erscheint auf dem Kundendokument, die Annahmen nicht
(CoS-E-002).

**`Estrich grundieren (Haftgrund)` erreicht sein Ziel nicht.** Der Titel ist
gebaut, aber er trifft weiter `Grundieren (Tiefengrund)` 4,50 € statt
`Grundieren (Haftgrund / Sperrgrund)` 6,00 € — die Normalisierung wirft
Klammerinhalte weg, für den Matcher sehen beide gleich aus. Das ist keine
Nachlässigkeit: **Ob Estrich grundieren 4,50 € oder 6,00 € kostet, ist
Manfreds Entscheidung, nicht die des Matchers.** Bis dahin steht der richtige
Arbeitsgang auf dem Papier und der bisherige Preis daneben — sichtbar, nicht
still.

Beide Fälle bestätigen die Regel aus K.1 in der Gegenrichtung: Auch ein
Titel, der fachlich besser ist, muss gegen den echten Katalog gemessen werden,
bevor er gebaut wird.

### L.2 Was Zug 2b noch bringt

Die reine Tool-Sprache: `Wandflächen streichen 2x` → `Wand streichen 2x`,
`Deckenfläche streichen 2x` → `Decke streichen 2x`. Gemessen ändert das
**keinen einzigen Preis** (beide Schreibweisen treffen dieselbe Katalogzeile
mit 0,94), es streut aber über die Maler-Engine, die Farbzonen und sieben
Testdateien. Deshalb als eigener Zug — eine breite Änderung ohne Preiswirkung
gehört nicht in denselben ungeprüften Schwung wie eine, die Geld bewegt.

*Head of Product Engineering · 12.09.2026*

---

## L.3 Nachtrag zu Zug 2a — der Golden Corpus hatte recht (12.09.2026)

Von 1722 Tests waren nach Zug 2a zwei rot. Einer war eine reine Umbenennung im
Test. Der andere war ein echter Einwand, und er kam aus dem Golden Corpus:

> `MUSS enthalten: "fliesenspiegel"` — hat: `wandflächen streichen 2x — küche`

Ich hatte `Fliesenspiegel abkleben` in `Abkleben Kanten / Leisten` umbenannt.
Der Preis stimmte (0,80 €/lfdm), aber **das Wort des Handwerkers war weg**.
Manfred diktiert „Fliesenspiegel abkleben" und findet auf dem Papier eine
Zeile, die das Wort nicht mehr enthält — weder er noch sein Kunde erkennen sie
wieder. Genau die Sorte Schaden, die keine Preisspalte anzeigt.

Gelöst mit der Klammer: **`Abkleben Kanten / Leisten (Fliesenspiegel)`**. Die
Normalisierung wirft Klammerinhalte weg, der Treffer bleibt bei 1,00 und
0,80 €/lfdm — sichtbar bleibt das Wort trotzdem.

Derselbe Griff funktioniert beim Isoliergrund **nicht**: `(nach
Schimmelbehandlung)` wird von der Aufwandswort-Regel am Rohtitel gelesen und
sperrt hart (gemessen: kein Preis). Dort steht der Anlass deshalb im
Rechenweg, der auf dem Kundendokument erscheint.

Daraus die dritte Regel dieses Tages, neben K.1 und der G.2-Regel:

> **Der Katalog bestimmt, was die Zeile kostet. Der Handwerker bestimmt, wie
> er sie wiedererkennt. Wo beides auseinanderfällt, trägt die Klammer das
> Handwerkerwort — außer ein Aufwandswort steckt darin, dann gehört es in den
> Rechenweg.**

Bemerkenswert daran: Das hat kein Mensch gemeldet, sondern ein Test, den
jemand vor Wochen geschrieben hat, weil ihm genau dieser Fall wichtig war.

*Head of Product Engineering · 12.09.2026*

---

## M. Grundierungsart als Filter — und Zug 2b (12.09.2026)

### M.1 Manfred hat zwei Dinge korrigiert, ich hatte in beiden unrecht

**Erstens das „sichtbar statt still".** Ich hatte `Estrich grundieren
(Haftgrund)` mit dem alten Preis von 4,50 € stehen lassen und das für ehrlich
gehalten. Manfred: *„Für dich ist das sichtbar, weil du's weißt. Für den
Betrieb steht da ‚Estrich grundieren (Haftgrund)' mit 4,50 € — und er denkt,
das ist sein Preis. Das ist still, nur anders."* Er hat recht. Es war kein
Argument, es war eine Ausrede. *„Halb geht nicht."*

**Zweitens der Preis selbst: 6,00 €, nicht 4,50 €** — und die Begründung ist
Material, nicht Arbeit:

> *„Tiefengrund ist Wasser mit ein bisschen Bindemittel, der Eimer kostet fast
> nichts. Haftgrund für Estrich ist gefüllt, mit Quarzsand, damit die
> Ausgleichsmasse greift — der Eimer kostet das Drei- bis Vierfache, und du
> brauchst mehr davon pro Quadratmeter, weil der Estrich saugt."*

Epoxi-Grund (feuchter Estrich) liegt bei ~10 € und ist ausdrücklich **eine
eigene Position** „Estrich sperren (Epoxi)", nicht dieselbe.

### M.2 Sein Lösungsvorschlag trägt auch nicht — und das war der Fund

Manfred schlug vor, den Titel ohne Klammer zu bauen („Estrich grundieren
Haftgrund"), damit er heute schon trifft. Gemessen: **trifft weiter 4,50 €.**

Der Grund ist, dass wir beide auf der falschen Seite gesucht haben. Die
Klammer stört nicht im gesuchten Titel, sondern **im Katalog**:

```
Grundieren (Tiefengrund)             4,50 €   → normalisiert: „grundieren"
Grundieren (Haftgrund / Sperrgrund)  6,00 €   → normalisiert: „grundieren"
```

Beide Kandidaten sind für den Matcher identisch. Gleichstand, und es gewinnt
die obere Zeile. Was im Suchtitel steht, ist dabei völlig egal.

**Gelöst als Filter am Rohtitel** — dieselbe Bauweise wie Q-Stufe und
Anstrichzahl seit PM-018, neue Gruppe `Grundierungsart` in
`preis-aufwandswoerter.ts`. Tiefengrund, Haftgrund und Epoxi sind jetzt drei
unterscheidbare Werkstoffe, gelesen am ungeschnittenen Titel, auf **beiden**
Seiten. Kein Eingriff in die Normalisierung, die Klammer darf bleiben.

Ergebnis: `Estrich grundieren (Haftgrund)` → **6,00 €**. Alle anderen
Grundierungszeilen gegengeprüft, keine hat sich bewegt.

Neue Regelart dabei: **'kein-schnitt'**. Sammelzeilen wie
`Untergrund grundieren (Haftgrund / Tiefengrund)` decken beide Materialien ab
und dürfen für beide gelten — gesperrt wird erst, wenn sich die Werkstoffe gar
nicht überschneiden. Das ist der Unterschied zwischen „anderes Material" und
„auch anderes Material".

### M.3 Zug 2b — die Tool-Sprache

| Engine sagte | heißt jetzt |
|---|---|
| `Wandflächen streichen 2x` | `Wand streichen 2x` |
| `Wandflächen streichen 2x (ohne Akzentwand)` | `Wand streichen 2x (ohne Akzentwand)` |
| `Deckenfläche streichen 2x` | `Decke streichen 2x` |

Gemessen **keine Preisänderung** — beide Schreibweisen trafen dieselbe
Katalogzeile mit 0,94. Rein das, was auf dem Kundenpapier steht. Nebenbei ist
damit auch eine Unstimmigkeit weg: Der Farbzonen-Zweig schrieb längst „Wand
streichen", der Hauptzweig „Wandflächen streichen" — zwei Namen für dieselbe
Arbeit im selben Angebot.

### M.4 Drei stille Verträge, zwei davon hätten Geld gekostet

Die Umbenennung selbst war trivial. Gefährlich war, wer den Titel LIEST:

| Stelle | was sie tut | ohne Anpassung |
|---|---|---|
| `maler-tapete.ts` | entfernt die Streichposition, wenn stattdessen tapeziert wird | Position bleibt stehen → **doppelt berechnet** |
| `maler-lackieren.ts` | zählt die Räume anhand dieser Positionen | null Räume → **falsche Heizkörperzahl** |
| `mengen/gewerke/maler.ts` | warnt, wenn die Wandfläche kleiner ist als die Bodenfläche | Warnung läuft wortlos nie wieder an |

Keine davon hätte einen Test zwingend rot gemacht. Gefunden wurden sie durch
die Routine, die aus dem `Parkett schleifen`-Fall entstanden ist: **vor jeder
Umbenennung nach Stellen suchen, die den Titel lesen.**

Damit das nicht beim nächsten Mal wieder passiert, steht die Erkennung jetzt
an einer Stelle: `istWandStreichen()` in `vollstaendigkeit/helpers.ts`. Wer
den Titel ändert, ändert ihn dort mit — und findet über die Aufrufer sofort
alle betroffenen Stellen.

Nachgezogen: 90 Stellen in acht Testdateien und der Platzhalter im
Abgleich-Skript. Historische Kommentare blieben bewusst unangetastet — sie
beschreiben, was damals war.

*Head of Product Engineering · 12.09.2026*

---

## N. Nachgemessen: H bis M (Prüfmeister, 12.09.2026)

Meine Shell auf Sandys Rechner ist am selben Windows-Update gescheitert wie
seine. Ich habe die Dateien einzeln rübergeholt und den Abgleich in einer
Ersatzumgebung gefahren, gegen genau den Stand, der jetzt auf ihrer Platte
liegt.

**J.3 ist damit zur Hälfte erledigt: `scripts/vokabular-abgleich.mjs` läuft
wieder und ist gelaufen. Die Vitest-Suite konnte ich nicht fahren** (die
Ersatzumgebung hat die Abhängigkeiten nicht) — die steht weiter aus, und
solange sie aussteht, gilt der Stand nicht als fertig.

```
Engine-Titel mit eigener Einheit   166
davon ohne Preis                    20
davon knapp (Score < 0,75)           4
gute Treffer (Score >= 0,75)       142
Titel aus Variablen, nicht prüfbar   3
```

Von 31 Nullpreisen nach H auf 20, von 7 knappen auf 4. Der Weg stimmt.

### N.1 Was ich bestätigen kann

Alles einzeln nachgemessen, nicht aus dem Text übernommen:

| | |
|---|---|
| `Isoliergrund gegen Nikotin / Ruß / Wasserflecken` | 9,00 € · Treffer 1,00 |
| `Estrich grundieren (Haftgrund)` | 6,00 € — die Grundierungsart als Filter trägt |
| `Parkett abschleifen (2 Schleifgänge)` | 20,00 € statt 38,00 € Komplettpaket |
| `Alten Teppichboden entfernen (verklebt)` | 9,00 € statt 6,00 € |
| `Ausgleichsmasse bis 3 / 3–10 / 10–30 mm` | 10 / 16 / 26 € — jede Stufe exakt, keine erbt den Preis der anderen |
| alle Verlegeart-Kombinationen aus I.3 | wie beschrieben, Score 1,00 |
| `Abkleben Kanten / Leisten (Fliesenspiegel)` | 0,80 € und das Handwerkerwort steht wieder da |

**Und mein Hauptfund aus F.4 ist weg:** Beide Decken-Zweige in `maler.ts`
schreiben die Anstrichzahl jetzt in den Titel. `Decke streichen 2x` trifft
11,00 €, nicht mehr den 1x-Preis. Das war die teuerste Zeile auf der Liste.

Die Regel aus L.3 („der Katalog bestimmt den Preis, der Handwerker das
Wiedererkennen, die Klammer trägt sein Wort") ist die beste Formulierung, die
in diesen zwei Tagen gefallen ist. Die gilt über diese Datei hinaus.

### N.2 Fünf Stellen, die noch falsch rechnen

**1. Raufaser — 7,00 €/m² zu billig, und der Preis steht die ganze Zeit im
Katalog.** Der schwerste der fünf.

| | heute | richtig |
|---|---|---|
| `Raufaser tapezieren` | `Raufaser tapezieren + überstreichen 1x` **14,00 €** | `Raufaser tapezieren ohne Anstrich` **10,00 €** |
| `Raufaser streichen` | **0,00 €**, kein Treffer | `Tapete / Raufaser überstreichen 2x` **11,00 €** |
| zusammen | 14,00 € | **21,00 €** |

Auf 50 m² Wandfläche sind das 350 €. Und der Anstrich ist doppelt im Angebot:
einmal versteckt im Tapezierpreis, einmal als leere Zeile daneben. Dasselbe
gilt für `Malervlies streichen` und `Vliestapete streichen` — beide 0,00 €,
beide haben mit `Tapete / Raufaser überstreichen 1x/2x` (7,00 / 11,00 €) eine
Katalogzeile.

Ursache: siehe N.3.

**2. Silikat-Fassade — 14,00 € statt rund 20,00 €.** `Silikatfarbe 2× Anstrich`
trifft `Fassadenfarbe 2× Anstrich` (14,00 €). Silikat ist teurer als
Dispersion, im Material und im Auftrag. Der Katalog führt
`Fassadenbeschichtung mineralisch (Silikatfarbe)` für 22,00 € — aber unter
**Fassade**, und die Position läuft als Maler-Position durch den
Gewerke-Filter, kommt dort also nie an. Unter Maler gibt es nur
`Silikatfarbe auftragen (2×)` 13,00 €, und das ist eine Innenzeile.

Das ist eine echte Katalog-Lücke, keine Umbenennung: **`Fassade mit
Silikatfarbe streichen 2x`, Richtwert 20,00 €/m²**, Rubrik „Maler – Anstrich
Außen". (`Dispersionsfarbe 2× Anstrich` → `Fassadenfarbe` ist dagegen
richtig, Fassadenfarbe *ist* Dispersion.)

**3. `Tapete tapezieren` bekommt 18,00 € — den Preis der Vliestapete.** Das
ist der Fall, in dem die Engine die Tapetenart NICHT erkannt hat. Sie rät dann
die teuerste. Richtig ist dieselbe Antwort wie bei `Bodenbelag verlegen`
(steht korrekt auf 0,00 €): **Wenn die Art unklar ist, wird gefragt, nicht
geraten.**

**4. Vinyl, zwei Namen, zwei Preise.** `Vinyl-Boden verlegen` → 16,00 €,
`Vinyl / Designboden verlegen` → 17,00 € (`Vinyl-Planken, Einzelplanken`).
Dieselbe Arbeit, zwei Beträge, je nachdem welches Wort die Erkennung erwischt
hat — genau TN-094. Die beiden Label-Listen (`belagLabel` in `boden.ts`,
`erkenneBelagName` in `boden-normalisierer.ts`) müssen dieselben Namen liefern.

**5. Ausgleichsmasse ohne Angabe → 10,00 €, die dünnste Stufe.** In J als
„Grundfall" gesetzt. Das ist die einzige Stelle, an der wieder die billigste
Variante als Annahme steht, und es ist dieselbe Fehlerform wie der 1x-Anstrich:
Wer nichts sagt, meint nicht automatisch das Dünnste — er hat die Dicke nur
noch nicht gemessen. Gehört in die Rückfrage („Wie dick muss ausgeglichen
werden?"), nicht in eine Annahme. Bis dahin lieber sichtbar ohne Preis.

*(Der Nadelvlies-Fall aus I.3 — 18,00 € statt 16,00 € — ist bekannt und liegt
richtig in F.6.)*

### N.3 Meine Wortliste hatte drei Löcher — das ist mein Fehler, nicht seiner

Er hat gebaut, was ich geliefert habe. Beim Nachmessen sieht man, was ich
vergessen habe:

**Gruppe 1 (Arbeitsgang) ohne `streichen`.** Drin sind schleifen, spachteln,
grundieren, versiegeln, ölen, lackieren, beizen, fräsen, verschweißen,
verkitten — aber nicht der häufigste Arbeitsgang des Malers. Deshalb darf
`Raufaser tapezieren` weiter auf `+ überstreichen 1x` treffen (N.2/1).

Nachzutragen: **`streichen`, `überstreichen`, `anstreichen`, `anstrich`,
`tapezieren`, `demontieren`, `ausbauen`**.

⚠ **Wichtig für den Bau: `streichen`, `anstrich` und `überstreichen` müssen
EINE Kennung sein, nicht drei.** Sonst sperrt
`Heizkörper lackieren (2× Anstrich)` gegen `Heizkörper streichen / lackieren`
— zwei Wörter für denselben Arbeitsgang, und die Regel würde einen richtigen
Treffer wegwerfen. Dasselbe gilt für `tapezieren` / `aufziehen`.

**Gruppe 7 (Sondermaterial) fehlt ganz.** Silikat, Latex, Lehm, Kalk,
chlorbeständig, Brandschutz, Anti-Schimmel. Ursache von N.2/2. Epoxid ist
über die neue Grundierungsart schon abgedeckt.

**Gruppe 8 (Materialbeistellung) fehlt ganz.** `inkl. Material`,
`ohne Material`, `Material bauseits`, `nur verlegen`. Das ist TN-122/TN-128 —
wer sein Laminat selbst kauft, darf es nicht mitbezahlen.

**Gruppe 5 (Ort und Zugang) nur mit `fassade`.** Treppenhaus, Dachschräge,
Kniestock, Keller, Garage fehlen. Weniger dringend, aber es gehört
nachgetragen, damit die Liste nicht wieder halb gelesen wird.

### N.4 Zu H.3 und I.5 — die Verlegeart bleibt einseitig, einverstanden

Seine Messung ist der Beweis, nicht seine Meinung: beidseitig springt
`Parkett verlegen` von 22,00 € auf 52,00 € (Industrieparkett). Wo der Titel
schweigt, WEIL die Sache offen ist, darf man nicht filtern — da muss gefragt
werden. Das ist richtig und bleibt so.

Eine Anmerkung zu den Rückfragetexten aus I.5: Sie sind gut. Nur beim Teppich
würde ich den heutigen Standardtreffer nicht so lassen — ohne Angabe landet
`Teppichboden verlegen` auf **gespannt / Tackern auf Nagelleiste** (14,00 €).
Gespannt auf Nagelleiste ist heute die Ausnahme, verklebt der Normalfall.
Solange die Rückfrage nicht steht, ist das die falsche Voreinstellung.

### N.5 Was offen bleibt

1. **Vitest-Suite** — nicht gelaufen, weder bei ihm noch bei mir. Erst danach
   ist der heutige Stand fertig.
2. **G.3, Manfreds zwei Szenarien** — braucht die laufende App, nicht das
   Skript. Sein Satz gilt: *„Bevor ich das nicht gesehen hab, ist das für mich
   ein Papier, kein Fix."*
3. Die fünf Stellen aus N.2 und die drei Wortgruppen aus N.3.

*Prüfmeister · 12.09.2026*

---

## O. Rot: Zug 2b hat fünf Stellen abgeschaltet (Prüfmeister, 12.09.2026)

**Das hier zuerst lesen. Es kostet Geld, es ist heute entstanden, und es ist
nicht die Umbenennung selbst — es sind die Stellen, die den alten Titel
gelesen haben.**

Ich habe die Testsuite in der Ersatzumgebung so weit zum Laufen gebracht, wie
die Abhängigkeiten es hergeben: **27 Testdateien, 400 Tests, 399 grün — einer
rot.** Der rote ist echt:

```
FAIL  maler-engine.test.ts > Vollständigkeits-Check: Raufaser entfernen
      + Spachteln mit echter Wandfläche, KEIN neu Aufziehen
      → const entfernen = find(positionen, 'tapete entfern')
        expected undefined to be defined
```

### O.1 Die Ursache — und sie steht in M.4 als gelöst

`pruefeTapeteWegDannStreich` in `maler-tapete.ts:217` sucht die Wandposition
so:

```js
ergaenzt.find(p => p.beschreibung.toLowerCase().includes('wandfläch'))
```

Seit Zug 2b heißt die Position **`Wand streichen 2x`**. Das Wort „wandfläch"
gibt es nicht mehr. Der Fund geht ins Leere, und die Funktion fällt in ihren
Else-Zweig: **`Tapete entfernen` und `Wände spachteln / glätten` wandern aus
dem Angebot in die Fehlt-Liste.**

Bei „Tapete runter, spachteln, streichen" auf 50 m²:
4,00 €/m² Tapete ablösen + 9,00 €/m² spachteln = **650 € weniger im Angebot**,
und der Handwerker sieht nur zwei Zeilen in einer Liste, die er selbst
nachtragen muss.

M.4 hat drei solcher stillen Verträge gefunden und `istWandStreichen()`
gebaut, damit es nicht wieder passiert. **Die Suche war nicht vollständig.**

### O.2 Fünf Stellen, gemessen — nicht vermutet

Ich habe die betroffenen Funktionen einzeln aufgerufen, einmal mit dem alten
und einmal mit dem neuen Titel. Ergebnis wörtlich aus dem Lauf:

```
BETON  [Wandflächen streichen 2x — Zimmer] → Betonwände schleifen /
       Untergrundvorbereitung · Grundieren (Tiefengrund) · Betonfarbe streichen
BETON  [Wand streichen 2x — Zimmer]        → Wand streichen 2x — Zimmer

KALK   [Wandflächen streichen 2x — Zimmer] → Untergrundvorbereitung für
       Kalkputz · Kalkputz aufbringen
KALK   [Wand streichen 2x — Zimmer]        → Wand streichen 2x — Zimmer
```

| Stelle | was sie tut | Stand heute |
|---|---|---|
| `maler-tapete.ts:217` | Tapete entfernen + Spachteln mit echter Wandfläche | **tot** — roter Test, 650 € auf 50 m² |
| `maler-sonder.ts:128/131` `pruefeBetonwand` | ersetzt die Wandposition durch schleifen + grundieren + Betonfarbe | **tot** — Betonwand wird als normale Wand berechnet |
| `maler-sonder.ts:151/154` `pruefeKalkputz` | ersetzt die Wandposition durch Untergrund + Kalkputz | **tot** — Kalkputz (35,00 €/m²) wird als Wandanstrich (9,50 €/m²) berechnet: **25,50 €/m² zu billig** |
| `maler-sonder.ts:98` `pruefeAbwaschbar` | schreibt „(abwaschbare Farbe)" in den Titel | **tot** — Zusage verschwindet vom Kundenpapier |
| `maler-basis.ts:177` | hängt die Wand-Grundierung an die Wandposition | **tot** — Grundierung fehlt, inkl. Raumzuordnung |

Die Kalkputz-Zeile ist die teuerste: Der Kunde bekommt „Wand streichen 2x" auf
ein Papier, auf dem Kalkputz stehen müsste. Falscher Preis **und** falsche
Leistung.

### O.3 Eine sechste Stelle war schon vorher tot — nicht von heute

`pruefeFeuchtraum` (`maler-sonder.ts:87`) fällt mit **beiden** Titeln durch.
Sie ersetzt per `/streichen(\s*—\s*.+)?$/`, der Titel endet aber seit der
Anstrichzahl auf `… streichen 2x — Zimmer`. Zwischen „streichen" und dem
Gedankenstrich steht das „2x", also greift das Muster nicht. Das ist älter als
heute und war bisher unentdeckt — dieselbe Wortsuche hat es mitgefunden.

### O.4 Das Soll

1. **Alle sechs Stellen auf `istWandStreichen()` umstellen** (die Funktion aus
   M.4 gibt es ja bereits) — nicht auf eine neue Zeichenkette, sonst steht in
   drei Wochen dieselbe Meldung hier.
2. **Für jede der sechs einen Test**, der die Position im Ergebnis erwartet —
   nicht den Titel im Code. Fünf davon waren durch keinen Test gedeckt; nur
   die Tapete hatte einen, und den gibt es, weil ihn jemand vor Wochen für
   genau diesen Fall geschrieben hat. Dasselbe Muster wie beim Golden Corpus
   in L.3.
3. **Die Routine aus M.4 erweitern:** nicht nur nach dem Titel suchen, sondern
   nach seinen *Bestandteilen* — „wandfläch", „deckenfläch", „sperranstrich",
   „fliesenspiegel", „parkett schleifen". Ein Titel wird selten ganz gelesen,
   meistens nur ein Wortstück davon.
4. **Die Suchtreffer von heute prüfen, nicht nur die Umbenennung.** Ich habe
   für „wandfläch" acht Fundstellen gehabt, zwei davon lesen nur das
   Transkript und sind in Ordnung. Für „deckenfläch" ist dieselbe Suche noch
   nicht gemacht.

---

## P. Meine zwei offenen Lieferungen

### P.1 Die Katalog-Anlageliste (K.3 wartet darauf)

Alles, was neu angelegt werden muss, mit Rubrik, Einheit und Richtwert. Netto,
Ruhrgebiet-Niveau, auf dem Stand des Standardkatalogs. Das sind **Vorschläge
für den Standardkatalog** — der eigene Preis des Betriebs schlägt sie immer.

| Titel | Rubrik | Einheit | Richtwert |
|---|---|---|---|
| Betonwände anschleifen (Sinterschicht entfernen) | Maler – Untergrundvorbereitung | m² | **7,50 €** |
| Betonwände streichen (Betonfarbe, 2x) | Maler – Anstrich Innen | m² | **13,50 €** |
| Untergrund für Kalkputz vorbereiten (Haftgrund / Vorspritzer) | Maler – Untergrundvorbereitung | m² | **8,00 €** |
| Fassade mit Silikatfarbe streichen 2x | Maler – Anstrich Außen | m² | **20,00 €** |
| Aufpreis chlorbeständige Spezialfarbe | Maler – Anstrich Innen | m² | **6,00 €** |
| Umgebung abdecken (Lackierarbeiten) | Maler – Vorbereitung & Schutz | Pauschale | **20,00 €** |
| Boden abdecken (Abdeckvlies), je Zimmer | Maler – Vorbereitung & Schutz | Pauschale | **25,00 €** |
| Geländer abkleben | Maler – Vorbereitung & Schutz | Pauschale | **35,00 €** |
| Heizkörper abkleben | Maler – Vorbereitung & Schutz | Stück | **18,00 €** |
| Leuchten / Spots abkleben | Maler – Vorbereitung & Schutz | Stück | **3,00 €** |
| Fugen verkitten (Acryl / Fugenkitt) | Boden – Parkett Aufarbeitung | lfdm | **2,50 €** |
| Naht fräsen (Vinyl / Linoleum) | Boden – PVC / Elastisch | lfdm | **3,50 €** |
| Stoßkanten / Nähte verkleben (Vinyl / PVC) | Boden – PVC / Elastisch | lfdm | **3,50 €** |
| Naht thermisch verschweißen (inkl. Schweißdraht) | Boden – PVC / Elastisch | lfdm | **7,00 €** |

**Zwei Änderungen an bestehenden Zeilen** (keine neuen Einträge):

- `Fugen kitten / Risse ausspachteln` (8,00 €/m²) ist zweierlei in einer Zeile.
  Der Kitt geht raus in die neue lfdm-Zeile oben; die Restzeile heißt
  **`Risse / Unreinheiten ausspachteln (Fläche)`**, Preis bleibt 8,00 €/m².
- `Nadelvlies vollflächig verkleben` (16,00 €) wird vom Engine-Titel textlich
  nicht getroffen (I.3). Zeile umbenennen in
  **`Nadelvlies-Teppichboden verlegen vollflächig verklebt`**, Preis bleibt.

**Und drei, die KEINEN neuen Eintrag brauchen** — der Preis steht schon da,
es fehlt nur der richtige Titel (siehe N.2/1):

| Engine sagt | soll heißen | Preis, der schon existiert |
|---|---|---|
| `Raufaser tapezieren` | `Raufaser tapezieren ohne Anstrich` | 10,00 €/m² |
| `Raufaser streichen` · `Malervlies streichen` · `Vliestapete streichen` | `Tapete / Raufaser überstreichen 2x` | 11,00 €/m² (1x: 7,00 €) |
| `Tapete tapezieren` (Art unbekannt) | **kein Titel** — Rückfrage stellen | — |

### P.2 Die drei fehlenden Wortgruppen, baufertig

Aus N.3, jetzt als Liste zum Eintragen in `preis-aufwandswoerter.ts`.

**Ergänzung Gruppe „Arbeitsgang":**
`streichen` · `überstreichen` · `anstreichen` · `anstrich` · `tapezieren` ·
`aufziehen` · `demontieren` · `ausbauen`

> ⚠ `streichen`, `überstreichen`, `anstreichen` und `anstrich` müssen **eine
> Kennung** sein, ebenso `tapezieren` und `aufziehen`. Als getrennte Kennungen
> würde `Heizkörper lackieren (2× Anstrich)` gegen
> `Heizkörper streichen / lackieren` sperren — zwei Wörter für denselben
> Arbeitsgang, und ein richtiger Treffer flöge weg.

**Neue Gruppe „Sondermaterial"** (beidseitig, wie Arbeitsgang):
`silikat` · `latex` · `lehm` · `kalk` · `chlorbeständig` · `brandschutz` ·
`anti-schimmel` · `mineralisch`
*(Epoxid ist über die Grundierungsart aus M.2 schon abgedeckt.)*

**Neue Gruppe „Materialbeistellung"** (beidseitig):
`inkl. material` · `ohne material` · `material bauseits` · `nur verlegen` ·
`nur liefern` · `liefern und montieren`
*(TN-122/TN-128: Wer sein Laminat selbst kauft, darf es nicht mitbezahlen —
und wer es stellt, darf nicht darauf sitzen bleiben.)*

**Nachtrag Gruppe „Ort und Zugang"** (heute nur `fassade`):
`treppenhaus` · `dachschräge` · `kniestock` · `giebel` · `keller` · `garage`

### P.3 Was ich prüfen konnte, und was nicht

**Gelaufen:** `scripts/vokabular-abgleich.mjs` (166 Titel, 20 ohne Preis, 4
knapp, 142 gut) und 27 Testdateien mit 400 Tests, davon der eine rote aus O.

**Nicht gelaufen:** die restlichen Testdateien — sie brauchen Module, die ich
in der Ersatzumgebung nicht habe (`extraktion-pipeline`, `status-uebergang`,
`preise-vorlagen`, `aufnahme-hinweise`). Das ist eine Grenze meiner Umgebung,
kein Befund. Der vollständige Lauf (`npm test`, 1722 Tests) steht weiter aus,
sobald der Zugriff auf Sandys Rechner wieder da ist. **Erst dann ist der
heutige Stand fertig** — mit dem roten Test aus O ist er es ohnehin nicht.

**Weiterhin offen und unverändert:** G.3, Manfreds zwei Szenarien. Die
brauchen die laufende App.

*Prüfmeister · 12.09.2026*

---

## Q. Die Vorlagen gegen den Katalog — 167 Lücken, zwei davon bewegen Geld (Prüfmeister, 15.09.2026)

In der Arbeitsreihenfolge stand „164 Vorlagen ohne Katalog-Zwilling". Die Zahl
stimmte, sie beantwortet nur die falsche Frage. Nachgemessen, Stand heute:

```
Vorlagen gesamt (je Gruppe einmal)          : 832
ohne titelgleichen Katalog-Zwilling         : 167
  aktive Gewerke (Maler, Boden)             :  15
  gesperrte Gewerke                         : 142
  in Gruppen, die kein Gewerk erreicht      :  10
```

**Warum die Zahl nicht die Frage beantwortet:** Eine Vorlage ist nicht deshalb
kaputt, weil die Katalogzeile denselben Titel mit einem Klammerzusatz trägt.
Die Normalisierung wirft Klammern ohnehin weg (PM-018). Kaputt ist sie, wenn
der Handwerker eine Zahl einträgt und **eine andere im Angebot steht**.

### Die richtige Messung — dieselbe wie bei `katalog-dopplungen.mjs`

Jede der 134 Zeilen, die ein Maler und Bodenleger im Onboarding wirklich
vorgesetzt bekommt, durch den echten Matcher gegen die eigene Liste geschickt
und gefragt, ob sie sich selbst findet:

```
Zeilen, die sich selbst NICHT finden : 4 von 134
  davon harmlos (derselbe Preis)     : 2
  davon mit ANDEREM Preis            : 2
```

Von den 15 Lücken der aktiven Gewerke sind **dreizehn harmlos**: Der Matcher
trifft die Katalogzeile mit Score 1,00 und identischem Preis, der Titel ist
nur kürzer. Zwei bewegen Geld.

### Q.1 — „Laminat verlegen schwimmend (Großdiele)": 2,00 €/m², die nie ankommen

```
eingetragen : Laminat verlegen schwimmend (Großdiele)   16,00 €/m²
im Angebot  : Laminat verlegen schwimmend (Standard)    14,00 €/m²
```

Beide Vorlagen heißen nach der Normalisierung `laminat verlegen schwimmend`,
beide in m². Der Unterschied steht in Klammern am Ende — und Klammern fallen
weg, aus dem guten Grund, der seit PM-018 im Code steht. Der Handwerker füllt
zwei Felder aus und kann eines davon nie erreichen. Bei 40 m² Großdiele sind
das 80,00 € je Auftrag, zu Lasten des Betriebs.

**Entscheidung:** Die Vorlage heißt künftig wörtlich wie die Katalogzeile, die
es längst gibt — **`Laminat Großdiele verlegen, schwimmend`** (16,00 €). Damit
steht das Unterscheidende vor dem Verb, genau nach Manfreds Regel, und der
Matcher kann sie treffen. Kein neuer Eintrag, keine neue Sonderregel, ein
Titel.

### Q.2 — „Kleinstauftrag pauschal": drei Quellen für einen Mindestbetrag

```
Fassade – Stundenleistungen : Kleinstauftrag pauschal (Mindestbetrag)  150,00 €
Boden   – Stundenleistungen : Kleinstauftrag pauschal (Mindestbetrag)  110,00 €
```

Gleicher Titel, gleiche Einheit, zwei Rubriken. Wer Maler **und** Boden macht,
bekommt auf jeden kleinen Bodenauftrag die 150,00 € — 40,00 € zu viel, und die
zahlt der Kunde.

Dahinter steckt mehr als eine Dopplung. Den Mindestauftragswert gibt es längst
als **Einstellung** (`MINDESTAUFTRAGSWERT_ORIENTIERUNG`, Orientierung 180,
Standard 0, Zeile „Anfahrt & Vorbereitung"), und am 14.09. wurde ausdrücklich
entschieden, dass ein Vorschlag sich nicht selbst einträgt — der Name der
Konstanten sagt das seitdem selbst. Zwei bepreiste Vorlagenzeilen für dieselbe
Sache machen genau das wieder auf: drei Quellen, drei Zahlen (180 · 150 · 110).

**Entscheidung:** Der Mindestauftragswert ist eine Eigenschaft des
**Betriebs**, nicht des Gewerks. Ein Betrieb hat einen Mindestbetrag, nicht
zwei. Eine Quelle, und das ist die Einstellung; beide Vorlagenzeilen gehören
weg. Weil Betriebe sie ausgefüllt haben können, ist das eine Migration und
keine Streichung nebenbei — der Wert gehört in die Einstellung übernommen.

### Q.3 — Zwei Vorlagen, die im Standardkatalog gar nichts treffen

```
Aufpreis Verlegung bei Fußbodenheizung     8,00 €/m²   → kein Treffer
Klebe-Vinyl verlegen vollflächig (Profikleber)  28,00 €/m² → kein Treffer
```

Keine falschen Preise, sondern Zeilen, nach denen das Onboarding fragt und die
hinterher niemand benutzt — dieselbe Falle wie CoS-E-052, nur kleiner.

**Entscheidung:** beide Titel auf die Katalogzeile ziehen, die es schon gibt,
Preis bleibt in beiden Fällen unverändert:

| Vorlage heute | soll heißen | Preis |
|---|---|---|
| Aufpreis Verlegung bei Fußbodenheizung | `Aufpreis Fußbodenheizung, verklebt mit Elastikkleber` | 8,00 € |
| Klebe-Vinyl verlegen vollflächig (Profikleber) | `Klebe-Vinyl verlegen, Nasskleber` | 28,00 € |

„Profikleber" ist kein Verlegeverfahren, „Nasskleber" schon.

### Q.4 — CoS-E-052 in der Gegenrichtung: 36 Zeilen, die kein Gewerk erreicht

`preisvorlagen-gewerke.test.ts` fragt: Findet jedes Gewerk seine Gruppen? Die
Gegenfrage stand nirgends. Gemessen: **zwei Gruppen mit zusammen 36 Vorlagen
werden von keinem Gewerk abgerufen** — `aufzug` (18) und `luftdichtigkeit`
(18). Entweder fehlt die Gewerk-Kennung in `gewerke-config.ts`, oder die
Zeilen sind tot. (`allrounder` ist in Ordnung: die Gruppe hängt an
`ENTSORGUNG_STANDARD`, nicht an `GEWERK_VORLAGEN`.)

Das ist keine Geldfrage, aber es ist derselbe Fehler wie CoS-E-052, nur von
der anderen Seite — und er gehört entschieden, **bevor** jemand eines dieser
Gewerke freischaltet.

### Q.5 — Was ausdrücklich NICHT auffiel

Sechs Vorlagenpaare heißen nach der Normalisierung gleich und tragen
verschiedene Preise — `Tapete ablösen` einlagig/mehrlagig, `Grundieren`
Tiefengrund/Sperrgrund, `Zuschlag hohe Räume` >2,80/>4 m, `Untergrund
spachteln` 5/20 mm, `Regiearbeit Geselle` 65/68. **Alle sechs finden sich
selbst.** Die Filter für Staffeln, Grundierungsart und Rubrik greifen. Sie
stehen hier, damit niemand sie später „findet" und repariert, was nicht kaputt
ist.

### Die 142 der gesperrten Gewerke

Unverändert Zeit, aber sie gehören vor die jeweilige Freischaltung — nicht
danach. Verteilung: Schreiner 24 · Estrich 23 · Sanitär 20 · Elektro 19 ·
Trockenbau 18 · Dachdecker 17 · Putz/Stuck 10 · Garten 6 · Brandschutz 2 ·
Fliesen 1 · Entrümpelung 1 · Rohbau 1.

### Nachtrag zum Abgleich-Skript

`node scripts/vokabular-abgleich.mjs` heute in der Ersatzumgebung gefahren:
**155 Titel, 15 ohne Preis, 3 knapp, 137 gut.** Gegen den Stand vom 12.09.
(158 / 16 / 3 / 139) ist eine Lücke zu: `Teppich verlegen` findet jetzt einen
Preis. Die übrigen 15 sind unverändert die aus P.1, die auf die
Katalog-Anlageliste warten.

**Eine Verschlechterung, die niemand gemeldet hat:** „Titel aus Variablen,
nicht prüfbar" ist von **3 auf 6** gestiegen. Das Skript prüft damit still
weniger, als es behauptet — genau das, wovor sein eigener Kopfkommentar warnt.
Die `VARIANTEN`-Liste ist nachzuziehen; steht in der Restliste.

## R. Der Zähler „nicht prüfbar" war kein Messfehler, sondern ein Lesefehler (Prüfmeister, 15.09.2026, nachmittags)

Der Nachtrag oben meldete „von 3 auf 6 gestiegen" und schob die Ursache auf
eine nachzuziehende `VARIANTEN`-Liste. Das war die falsche Fährte. Nachgesehen,
welche sechs Titel es sind:

```
maler.ts              Wand streichen 2x${zoneZusatz}
boden-vorarbeiten.ts  Sockelleisten montieren${verlegeRaum ?
maler-basis.ts        Voranstrich / Grundierung Decke${raum ?
maler-basis.ts        Voranstrich / Grundierung${raumSuffix ?
maler-lackieren.ts    ${titel} — ${raumName}
maler-lackieren.ts    ${titel}
```

Vier von sechs brechen **mitten im Ausdruck** ab. Die Ursache sitzt in
`literal()`: Der Leser zählte `${ … }` nicht mit und hielt den ersten Backtick
eines **verschachtelten** Templates für das Ende des Titels. Jeder Raum-Anhang,
der als Ternär geschrieben ist — `${raum ? ` — ${raum}` : ''}` — erhöhte den
Zähler um eins. Die Titel dahinter sind ganz normale, prüfbare Titel.

Das ist derselbe Fehler, gegen den das Skript gebaut wurde, nur eine Etage
tiefer: eine Zahl, die still kleiner wird, ohne dass jemand es merkt.

**Behoben, drei Eingriffe, alle in `scripts/vokabular-abgleich.mjs`:**

1. `literal()` liest Template-Literale mit `${ … }`-Tiefe, verschachtelte
   Templates eingeschlossen.
2. Zwei Füllregeln für den Raum-Anhang in seinen anderen Schreibweisen —
   `${x ? ` — ${x}` : ''}` und `${x ?? 'Bereich'}` — **vor** den
   Einzelplatzhaltern, sonst ist das innere `${raum}` schon ersetzt.
3. `${titel}` (die drei Heizkörper-Schritte aus `maler-lackieren.ts:136`) und
   `${zoneZusatz}` stehen in `VARIANTEN`.

**Zähler jetzt 0.** Steigt er wieder, fehlt ein Eintrag — dann ist es eine
echte Lücke und kein Lesefehler mehr.

### Was die sechs Titel kosten

Keiner ist eine Lücke. Gemessen, nicht angenommen:

| Engine sagt | trifft | Preis |
|---|---|---|
| Heizkörper abschleifen | Heizkörper abschleifen | 20,00 €/Stück |
| Heizkörper grundieren | Heizkörper grundieren | 25,00 €/Stück |
| Heizkörper lackieren (2× Anstrich) | Heizkörper streichen / lackieren | 40,00 €/Stück |
| Voranstrich / Grundierung | Grundieren (Tiefengrund) | 4,50 €/m² |
| Voranstrich / Grundierung Decke | Grundieren (Tiefengrund) | 4,50 €/m² |
| Sockelleisten montieren | Sockelleisten montieren (Holz / MDF / Kunststoff) | 5,50 €/lfdm |

Zum Zonen-Zusatz gibt es **keine Liste zum Abschreiben** — Zone und Farbe sind
freier Text aus dem Diktat. Deshalb gemessen statt aufgezählt: Der
Klammerzusatz bewegt den Treffer nicht. „Wand streichen 2x", „… (Zone oben)"
und „… (Blau, Zone oben)" landen alle auf 9,50 €/m², und „3x (Zone oben)"
bleibt bei 13,00 €. Festgehalten als
`src/lib/__tests__/pm-vokabular-varianten.test.ts`.

---

## S. Das Skript las zwei von sechs aktiven Gewerken (Prüfmeister, 15.09.2026, nachmittags)

Beim Nachziehen ist eine größere Lücke aufgefallen als der Zähler: `QUELLEN`
enthielt Maler und Boden. **`fliesen` steht in `gewerke-config.ts` auf
`aktiv: true`** — ein Fliesenleger bekommt das Gewerk angeboten, geprüft hat es
nie jemand. Ein Abgleich, der „Engine ↔ Standardkatalog" heißt und ein Drittel
der aktiven Gewerke liest, prüft still weniger als er behauptet.

`fliesen.ts` und `vollstaendigkeit/fliesen*.ts` sind jetzt in `QUELLEN`.

```
                                   vorher    nachher
Engine-Titel mit eigener Einheit     155        170
davon ohne Preis                      15         22
davon knapp (Score < 0,75)             3          3
gute Treffer                         137        145
Titel aus Variablen, nicht prüfbar     6          0
```

**Alle sieben neuen Lücken sind Fliesen**, und es sind die tragenden Zeilen
eines Bades, nicht die Ränder:

```
Bodenfliesen verlegen              Verfugung Boden
Wandfliesen verlegen               Verfugung Wand
Verbundabdichtung Wand             Fliesensockel / Abschlussleiste
Entsorgung Fliesenmaterial
```

Auf einem Bad von 2,40 × 1,80 m mit 2,10 m Fliesenhöhe sind das **1.935,94 €**
ohne Preis — bei neun erzeugten Zeilen insgesamt. Zwei Ursachen, sauber
getrennt:

- **Wortlaut.** Die Engine schreibt `Verfugung Boden`, der Katalog führt
  `Verfugen Boden`; `Bodenfliesen verlegen` gegen
  `Bodenfliesen Standard (30×30 bis 60×60cm), gerade, Q2`. Kein Treffer über
  der Schwelle.
- **Gewerke-Zuordnung.** `gewerkFuerPosition` liest „Wand" und entscheidet auf
  **`maler`** — für `Wandfliesen verlegen`, `Verfugung Wand` und
  `Verbundabdichtung Wand`. Danach wird gegen den Malerkatalog gehalten.
  `Verbundabdichtung Wand` hätte im Fliesenkatalog mit Score 0,94 auf
  28,00 €/m² getroffen: **493,92 € allein an dieser Zuordnung.**

Ausführlich als Fälle PM-060 bis PM-062 in
`src/lib/__tests__/pruefmeister-batch-60-62.test.ts`; dort auch der zweite
Fund (die Engine schreibt Bodenzeilen, obwohl „nur die Wandfliesen" gesagt
wurde) und der dritte (`Altfliesen abstemmen` nimmt immer den Bodenpreis).

**Offen und ausdrücklich nicht still entschieden:** Die übrigen drei aktiven
Gewerke — Trockenbau, Sanitär/Heizung, Elektro — sind weiterhin nicht im
Abgleich. Ob sie hineingehören, hängt daran, ob ihre Engines mehr sind als
Durchreichen; das ist nachzusehen, bevor jemand eine Zahl daraus zitiert.

*Prüfmeister · 15.09.2026*

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
