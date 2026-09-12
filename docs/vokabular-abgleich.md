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

Für beide führt der Standardkatalog keine Zeile — das ist F.2/F.3, seine
Richtwerte liegen vor, gehört zum Katalog-Schritt.

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

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
