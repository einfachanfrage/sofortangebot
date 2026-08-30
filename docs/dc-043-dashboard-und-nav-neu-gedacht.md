# DC-043 — Dashboard + untere Menüleiste neu gedacht

**Datum:** 2026-08-30 (Sandy, direkt im Anschluss an DC-042)

**Auftrag:** "kannst du bitte auch das dashboard und die menüleiste unten
neu denken?? irgendwie holt mich das nicht ab...." Kein konkreter Bug,
sondern ein Bauchgefühl — das Dashboard "holt nicht ab". Ich habe den Code
von `dashboard/page.tsx`, `BottomNav.tsx`, `SideNav.tsx`, `data/dashboard.ts`
und `MobileQuoteCard.tsx` komplett durchgesehen, um das Gefühl an konkreten
Ursachen festzumachen, statt nur am Aussehen zu drehen.

## Diagnose — was ich im Code gefunden habe

**1. Zwei gelbe Buttons für exakt dieselbe Aktion.** Der große
"Aufmaß starten"-Button im Hero UND der schwebende Mikrofon-Kreis in der
`BottomNav` führen beide zu `/angebot/neu` — dieselbe Aktion, zweimal
gleichzeitig sichtbar, beide in der auffälligsten Markenfarbe. Statt einer
klaren "das ist DER Knopf"-Aussage konkurrieren zwei Elemente um dieselbe
Aufmerksamkeit. Das kostet Klarheit, ohne einen Vorteil zu bringen.

**2. Alle drei Statistik-Kacheln sind gleich gewichtet.** Umsatz · Monat,
Beauftragt · Monat und Offen stehen alle in derselben Größe nebeneinander.
Für einen Handwerker ist "wie viel habe ich diesen Monat verdient" aber die
mit Abstand emotional relevanteste Zahl — sie hat hier keine visuelle
Sonderstellung, keinen Vergleich zum Vormonat, nichts, das ein Erfolgsgefühl
auslöst. Eine reine Kennzahlen-Kachel, keine Motivation.

**3. Keine Dringlichkeit sichtbar, nur ein Link.** "● 4 Angebote warten auf
Antwort" ist eine Zahl mit Link — sie sagt nicht, WELCHES Angebot am
längsten wartet oder ob "nachfassen" sinnvoll wäre. Das deckt sich mit einem
Punkt aus DC-042 (die dort vorgeschlagene "seit X Tagen"-Anzeige) — hier
fehlt sie auf der Startseite komplett, wo sie am meisten Wirkung hätte.

**4. Wort-Inkonsistenz Mobile/Desktop.** Die `BottomNav` nennt denselben Ort
"Start", die `SideNav` (Desktop) nennt ihn "Dashboard" — kleine Sache, aber
genau die Art Detail, die sich als "nicht ganz clean" anfühlt, ohne dass man
sofort sagen kann, warum.

**5. Die Menüleiste ist rein statisch.** Vier Icons, ein Label, fertig —
kein Badge, kein Hinweis, dass z. B. gerade 4 Angebote auf Antwort warten.
Trotz Markenfarben wirkt sie wie eine austauschbare Standard-Tab-Bar, ohne
eigene Handschrift.

**6. Die Liste darunter ist reine Datenanzeige.** Status-Badge, Name, Datum,
Betrag — sachlich korrekt, aber ohne jede Wertung oder Einordnung ("das
brauchst du jetzt", "das läuft gut"). In Summe: ein technisch sauberer, aber
emotional neutraler Screen. Das erklärt vermutlich das "holt mich nicht ab"
besser als jedes einzelne Detail für sich.

## Zwei Richtungen, um daraus etwas zu machen

Weil "fühlt sich nicht gut an" eine Geschmacksfrage ist und keine reine
Logik-Lücke wie bei DC-042, zeige ich dir zwei bewusst unterschiedliche
Richtungen im Prototyp statt eines einzigen "richtigen" Vorschlags:

**A — Fokus & Dringlichkeit.** Das Dashboard beantwortet zuerst "was
braucht JETZT meine Aufmerksamkeit" statt nur Zahlen zu zeigen: das am
längsten wartende Angebot wird namentlich mit "seit X Tagen" herausgestellt,
Umsatz bekommt eine große Kachel mit Vergleich zum Vormonat, die restlichen
Kennzahlen werden kleiner/sekundär. Ein Tab in der Menüleiste bekommt einen
kleinen Punkt, wenn etwas wartet.

**B — Warm & persönlich.** Näher am heutigen Aufbau, aber mit mehr
Charakter: variablere Begrüßung, ein kleiner Erfolgsmoment, wenn diesen
Monat etwas angenommen wurde, Umsatz als große, freundlich gerahmte
Fortschritts-Kachel statt einer nüchternen Zahl unter vielen, wärmere
Formulierungen in der Liste.

**Unabhängig davon, welche Richtung dir gefällt — zwei Fixes, die so oder
so sinnvoll sind:**

- Nur noch EIN Weg zu "Aufmaß starten" auf dem Dashboard (Hero-Button ODER
  FAB, nicht beide gleichzeitig).
- "Start" (BottomNav) und "Dashboard" (SideNav) auf einen gemeinsamen
  Begriff vereinheitlichen.

## Offene Entscheidungen — bei dir

1. **Welche Richtung (A, B, oder eine Mischung) trifft dein Gefühl eher?**
   Im Prototyp umschaltbar, du kannst auch einzelne Elemente aus beiden
   Richtungen kombinieren lassen — sag mir einfach, was dir gefällt.
2. **Hero-Button oder FAB behalten** (Punkt "nur ein Weg zu Aufmaß
   starten")? Ich tendiere zum Hero-Button (mehr Platz für Kontext-Text
   "Einsprechen → Angebot fertig"), aber der FAB ist von jeder Unterseite
   aus erreichbar, der Hero-Button nur vom Dashboard — reine
   Abwägungsfrage.
3. **"Start" oder "Dashboard" als einheitlicher Begriff** für Mobile +
   Desktop?

## Prototyp

`dc-043-dashboard-nav-prototyp.html` — interaktiver Vergleich mit
Drei-Wege-Umschalter (Heute / A: Fokus / B: Warm), zeigt Hero, Statistiken,
Angebotsliste UND die untere Menüleiste zusammen, weil der Doppel-CTA-Punkt
beide Bereiche betrifft. Mit echten Beispieldaten (Lisa, 4 offene Angebote,
darunter Fischer GmbH am längsten wartend).

**Status:** 🔵 Konzept + Prototyp fertig, wartet auf dein Feedback/Go. Reine
Frontend-Änderung ohne Datenmodell-Auswirkung (die "seit X Tagen"-Anzeige
nutzt vorerst `created_at`, wie in DC-042 als einfachere Variante
besprochen) — kann nach deinem Go direkt umgesetzt werden, kein Warten auf
Head of Product Engineering nötig.
