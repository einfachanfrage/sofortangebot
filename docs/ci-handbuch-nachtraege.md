# CI-Handbuch — Nachträge

**Gepflegt vom Head of Marketing. Angelegt: 24.09.2026.**

Das CI-Handbuch (`docs/Sofortangebot CI Handbuch.pdf`, Stand 19.08.2026) liegt
nur als PDF vor — es kann hier nicht geändert werden. Diese Datei ist deshalb
**die verbindliche Fortschreibung**: Was hier steht, gilt zusammen mit dem PDF.
Bei der nächsten Neuausgabe des PDF wandern die Nachträge in das Dokument und
diese Datei wird geleert, nicht gelöscht.

**Wozu diese Datei da ist:** Handbuch S. 05 sagt *„In Umsetzungen wird immer die
semantische Rolle referenziert, nie der rohe Farbwert."* Wenn im Code ein Wert
steht, für den das Handbuch keine Rolle kennt, ist nicht der Code schuld,
sondern das Handbuch hat eine Lücke. Eine Lücke wird hier geschlossen — durch
eine benannte Rolle oder durch eine ausdrückliche Feststellung, dass es keine
braucht. **Kein dritter Fall.**

**Was hier NICHT hineingehört:** neue Markenfarben, neue Schriften, eine neue
Tonalität, Änderungen an Logo oder Positionierung. Das sind CI-Entscheidungen
und die trifft Sandy (Handbuch § 16). Hier stehen ausschließlich **Stufen
innerhalb bestehender Skalen** und **Feststellungen zu bestehenden Regeln**.
Jeder Nachtrag geht Sandy trotzdem zur Freigabe vor — er gilt ab Eintrag und
wird zurückgenommen, wenn sie widerspricht.

---

## Nachtrag 1 — Anthrazit 950: der Hover-Ton dunkler Flächen (24.09.2026)

**Betrifft:** Handbuch S. 04 (Anthrazit-Skala) und S. 10 (Bewegung und Zustände)
**Anlass:** CoS-M-021, aufgemacht vom Chief of Staff nach einem Fund des Product
Designers in DC-147
**Status:** gilt · Sandys Freigabe steht aus (`entscheidungen-fuer-sandy.md`)

### Die Lücke

S. 10 verlangt für Hover: *„Dunkler, nicht heller."* Für Gelb ist gesagt, wie
viel dunkler (500 → 600). Für neutrale Flächen ist gesagt, wohin
(`--surface-sunken`). **Für dunkle Flächen war es nicht gesagt** — und die
Anthrazit-Skala endet bei 900 (`#2C2C2C`), also genau bei dem Ton, der die
dunkle Fläche selbst ist (`--surface-inverse`). Es gab keinen Ton, in den ein
dunkler Knopf hovern konnte, ohne erfunden zu werden.

### Die Ergänzung

**Anthrazit-Skala S. 04 bekommt eine Stufe am dunklen Ende:**

| Stufe | Wert | Rolle |
|---|---|---|
| **950 · Hover** | **`#1A1A1A`** | `--surface-inverse-hover` |
| 900 · Basis | `#2C2C2C` | `--surface-inverse`, `--text-strong` |
| 800 | `#3A3A3A` | — |

**Einsatz:** ausschließlich als **Fläche** — der Hover-Zustand einer
Anthrazit-Fläche, die klickbar ist. **Nie als Textfarbe.** Text auf hell ist und
bleibt `--text-strong` (`#2C2C2C`). Ein `#1A1A1A` als Textfarbe ist kein Einsatz
dieser Rolle, sondern derselbe Fehler in Grün.

### Warum dieser Wert und kein runderer

Die Skala selbst legt am dunklen Ende Schritte von 14 Punkten je Kanal zurück
(900 → 800). Rein rechnerisch wäre `#1F1F1F` die nächste Stufe. **Der Wert ist
trotzdem `#1A1A1A`**, und zwar aus dem Maß, das das Handbuch für Hover selbst
anlegt:

| Schritt | Eigenkontrast |
|---|---|
| Gelb 500 → 600 (der einzige bezifferte Hover-Schritt im Handbuch) | **1,285** |
| Anthrazit 900 → **950 `#1A1A1A`** | **1,246** |
| Anthrazit 900 → `#1F1F1F` (die rechnerische Stufe) | 1,180 |
| Seite → Sunken (Hover neutraler Flächen) | 1,055 |

Der dunkle Knopf ist dieselbe Sorte Element wie der gelbe: eine **Aktionsfläche**,
kein neutraler Hintergrund. Sein Hover muss sich anfühlen wie der gelbe (1,285)
und nicht wie der einer ruhenden Fläche (1,055). `#1A1A1A` trifft das,
`#1F1F1F` liegt spürbar darunter.

**Zwei Kontrollen, damit die Stufe nicht an anderer Stelle Schaden anrichtet:**

* **Off-White auf 950 = 16,23:1** (auf 900: 13,02:1). Der Kontrast wird beim
  Hovern besser, nie schlechter.
* **950 ist kein Schwarz.** Luminanz 0,0103 gegen 0,0 bei `#000000`, neutral
  grau wie 900/800/700, kein Farbstich. Der Satz *„Anthrazit ersetzt Schwarz
  vollständig"* (S. 04) bleibt wahr.

**Nebenbei:** `#1A1A1A` ist genau der Wert, der heute in `CTASection` steht. Das
ist kein Zufall und auch kein Grund — er wurde nachgemessen und hat bestanden.
Wäre er durchgefallen, stünde hier ein anderer.

### Und der Press-Zustand? Kein eigener Ton. Ausdrücklich.

Damit dieselbe Lücke nicht eine Zeile weiter wieder aufgeht:

> **Press auf dunklen Flächen ist `translateY(1px)` und sonst nichts.**

S. 10 gibt dem Press nur für Gelb einen Ton (Gelb 700). Eine Stufe unter 950
wäre von Schwarz nicht mehr zu unterscheiden — sie würde die Regel brechen, die
diese Skala überhaupt begründet. Die Bewegung trägt den Press, nicht die Farbe.

---

## Nachtrag 2 — Wann ein Zustand eine eigene Farbrolle verdient (24.09.2026)

**Betrifft:** Handbuch S. 04 (Funktionsfarben) und S. 05 (Semantische Farbrollen)
**Anlass:** CoS-M-022, aufgemacht vom Chief of Staff nach einer Frage des Product
Designers aus DC-149
**Status:** gilt · Sandys Freigabe steht aus (`entscheidungen-fuer-sandy.md`)

### Die Regel

> **Farbe trägt nur, wo es einen Ausgang gibt.**
> Gelb = du bist dran. Success = zugesagt. Danger = abgesagt.
> **Alles andere ist neutral und unterscheidet sich über die Textstufe,
> nicht über die Fläche.**

Der Satz stammt vom Product Designer (DC-149). Er ist nicht neu erfunden,
sondern das, was das Handbuch ohnehin tut — hier nur zum ersten Mal
aufgeschrieben, damit die Frage *„braucht dieser Status eine eigene Farbe?"*
nicht bei jedem neuen Status wieder von vorn beginnt.

**Ein Zustand bekommt eine eigene Farbrolle, wenn er ein Ergebnis ist** —
etwas ist entschieden, gelungen oder gescheitert. **Ein Zustand bekommt keine,
wenn er ein Verlauf ist** — etwas ist unterwegs, wird bearbeitet, wartet.
Wartezustände sind die häufigsten; gäbe man ihnen Farbe, wäre die Liste bunt
und das eine Gelb, das „hier musst du ran" heißt, wäre nichts mehr wert.

### Die Anwendung: „unterwegs / in Bearbeitung" bekommt keine

**Ausdrücklich festgestellt: Nein.** Der Status „Beim Kunden" bleibt neutral —
Sunken als Fläche, Anthrazit 900 als Text (12,34:1), so wie der Product
Designer ihn in DC-149 gebaut hat. **DC-149 ist damit fertig.**

Drei Gründe, damit die Feststellung nachlesbar ist:

1. **Das Zwei-Farben-System ist die Positionierung, nicht die Dekoration.**
   Gelb/Anthrazit steht in `marketing-ci.md` ausdrücklich als *„mutig statt
   austauschbar-blau"*. Eine dritte Farbe für einen Wartezustand gäbe genau
   das auf, wofür die Farbwahl da ist.
2. **„Beim Kunden" ist der häufigste Zustand.** Die meisten Angebote stehen die
   meiste Zeit dort. Was immer sichtbar ist, darf nicht laut sein.
3. **Success und Danger sind Ausgänge, „Beim Kunden" ist keiner.** Das Handbuch
   sagt zu den Funktionsfarben *„ausschließlich für Validierung und Status"* —
   gemeint ist das Ergebnis, nicht der Weg dahin.

**Ausdrücklich nicht entschieden:** ob es je einen vierten Funktionston geben
darf. Wenn ein echtes Ergebnis auftaucht, für das Success und Danger nicht
reichen, ist das eine neue Frage an Sandy — und keine, die diese Regel schon
beantwortet.

---

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
