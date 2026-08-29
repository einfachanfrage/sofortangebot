# DC-039 — "+ Position" smart machen (Preisdatenbank-Suche) + Verständlichkeit der Aktionsleiste

**Datum:** 2026-08-29 (Sandy, Screenshots der "Positionen"-Aktionsleiste im
Angebots-Entwurf)

## Teil 1 — Ist die Aktionsleiste (Aufnahme / Position / Raum) selbsterklärend?

**Kurze Antwort: größtenteils ja, mit einer kleinen Unschärfe bei "Raum".**

Code geprüft (`AngebotDetail.tsx`): Alle drei Buttons haben Icon UND
Text-Label darunter (nicht nur Icons) — das ist der wichtigste Faktor für
Verständlichkeit, und der ist schon erfüllt. Im Detail:

- **"Aufnahme"** (Mikro-Icon) — eindeutig, führt zurück zur
  Sprachaufnahme-Ansicht.
- **"Position"** (Plus-Icon) — eindeutig als "etwas hinzufügen", aber das
  Ergebnis dahinter ist bisher NICHT smart (siehe Teil 2) — das ist eher
  ein Funktions- als ein Verständlichkeitsproblem.
- **"Raum"** (Haus-Icon) — öffnet ein sauberes, gut gemachtes Sheet
  ("Raum hinzufügen" mit 12 typischen Räumen als Kacheln + eigenem
  Namensfeld) — sobald man draufgetippt hat, ist es sofort klar. Die
  Unschärfe ist NUR der Moment davor: "Raum" als Button-Label neben
  "Position" könnte kurz die Frage aufwerfen, was der Unterschied ist
  ("ist ein Raum nicht auch eine Position?"). Sobald man einmal getippt
  hat, klärt sich das von selbst.
- Kleinere Beobachtung, kein Blocker: die drei Icons sind sehr blass
  (`text-[#2C2C2C]/40`, 40% Deckkraft) — dezent gewollt, aber an der
  Grenze zur Übersehbarkeit auf einem hellen Hintergrund.

**Einschätzung:** Ich würde hier NICHT strukturell umbauen (drei
gleichwertige, klar beschriftete Buttons sind ein bewährtes Muster) —
die eigentliche Verbesserung, um die es dir laut deiner Beschreibung
wirklich geht, ist Teil 2: was NACH dem Antippen von "Position" passiert.
Kleine Politur, die ich bei der Umsetzung von Teil 2 gleich mitnehme:
Icon-Deckkraft leicht erhöhen (~55% statt 40%) für bessere Lesbarkeit,
sonst nichts strukturell verändert.

## Teil 2 — "+ Position": smarte Suche gegen die Preisdatenbank

**Ist-Zustand (Code geprüft):** `addEditItem()` legt heute eine komplett
leere Zeile an — Titel leer, Menge 1, Einheit "Stk", Preis 0,00 € — ohne
jede Verbindung zur Preisdatenbank. Man tippt den Titel frei, muss Einheit
und Preis danach manuell einstellen. Kein Bezug zu bereits hinterlegten
Preisen, keine Wiederverwendung.

**Gute Nachricht: die Grundlage ist schon fast komplett da.**

- Die komplette Preisdatenbank des Betriebs (`price_items`: Titel, Einheit,
  Preis) wird in genau dieser Komponente bereits vollständig geladen
  (`loadPriceItems()`, für den vorhandenen "Preis fehlt"-Reparatur-Flow) —
  liegt also schon im Speicher, sobald die Seite offen ist. Für eine
  Live-Suche beim Tippen braucht es dafür KEINEN Netzwerk-Aufruf.
- Es gibt bereits einen ausgereiften Text-Matcher (`preis-matcher.ts`,
  `findePreisposition`/`normalisierePreistext`/`tokenScore`) — aktuell
  für den automatischen KI-Extraktions-Abgleich gebaut, aber technisch
  wiederverwendbar für eine Live-Suche (reine Funktionen, kein
  Server-Zugriff nötig).
- Es gibt bereits eine "Preis anlegen"-Modal-Mechanik (`priceItemToAdd` +
  `/api/quotes/[id]/items/[itemId]/preis`) für den Fall "Titel bekannt,
  Preis fehlt" — schreibt direkt in `price_items` UND übernimmt den Preis
  in die Position. Exakt dasselbe Prinzip, nur bisher nicht für einen
  KOMPLETT NEUEN Titel gebaut.

**Vorgeschlagener Ablauf (siehe Prototyp):**

1. Antippen von "+ Position" öffnet wie heute eine neue Zeile — aber das
   Titelfeld ist jetzt eine Such-Eingabe statt eines leeren Texts.
2. Ab dem ersten Buchstaben erscheinen Live-Vorschläge aus der
   Preisdatenbank (Titel, Einheit, Preis sichtbar, Treffer optisch
   hervorgehoben), sortiert nach Trefferqualität.
3. Antippen eines Vorschlags übernimmt Titel + Einheit + Preis sofort in
   die Position — fertig, kein weiterer Schritt.
4. Kein Treffer (oder der Nutzer will trotzdem etwas Neues) → letzter
   Eintrag in der Liste: "➕ Neue Position „…" anlegen" → kurze Inline-
   Eingabe (Einheit + Preis, zwei Felder) → "Anlegen & übernehmen".
   Ergebnis wird SOFORT in der Preisdatenbank gespeichert (Hinweistext
   direkt dabei: "beim nächsten Mal direkt als Vorschlag da") — ab dann
   für jede zukünftige Position durchsuchbar, exakt wie du es beschrieben
   hast.

**Aufteilung Umsetzung:**

- **Die Suche selbst (Schritte 1–3) ist reines Frontend** — die
  Preisdatenbank ist ja schon geladen, der Matcher schon vorhanden. Baue
  ich komplett selbst, keine Backend-Änderung nötig.
- **Schritt 4 (sofortiges Speichern in die Preisdatenbank für einen
  komplett neuen Titel) braucht einen kleinen, neuen Endpunkt** — der
  bestehende `/preis`-Endpunkt setzt eine bereits in der DB gespeicherte
  Position voraus (`itemId`), unsere neue Position existiert in diesem
  Moment aber nur lokal im Browser. Nötig: ein einfacher neuer Endpunkt
  (z. B. `POST /api/preise`), der NUR `price_items` befüllt (company_id,
  Kategorie automatisch via die schon vorhandene `kategorieFuerTitel()`-
  Logik, Titel, Einheit, Preis) und die neue `price_item_id` zurückgibt —
  ohne Bezug zu einem Angebot. Rest (Zeile im Angebot selbst) läuft über
  den normalen "Speichern"-Mechanismus, der neue Positionen schon heute
  per Bulk-Insert anlegt (dabei fällt mir eine kleine bestehende Lücke
  auf: dieser Bulk-Insert setzt aktuell nirgends `price_item_id` mit,
  obwohl das Feld existiert und von der KI-Extraktion genutzt wird — sollte
  beim Umsetzen gleich mit ergänzt werden, sonst "vergisst" eine gespeicherte
  Position ihre Verknüpfung zur Preisdatenbank).
  Spec für Head of Product Engineering, sobald du grünes Licht gibst.

**Prototyp:** `dc-039-position-suche-prototyp.html` — Suche gegen eine
Beispiel-Preisdatenbank (z. B. "wand streich" oder "laminat" eintippen),
inkl. "nichts gefunden → neu anlegen"-Flow. Bewusst als Prototyp statt
direkt Code, weil hier zwei Dinge zusammenkommen, die sich nicht rein aus
einer Beschreibung beurteilen lassen: wie sich das Tippen/Antippen auf dem
Handy anfühlt, UND — wichtiger — dass hier eine SCHREIBENDE Aktion in
deine echte Preisdatenbank passiert. Eine unpassende Kategorisierung oder
ein Dubletten-Titel wäre in Produktion nicht einfach rückgängig zu machen
wie ein UI-Fehler, deshalb lieber einmal gegentesten, bevor es an die
echten Daten geht.

**Status:** 🔵 Prototyp fertig, wartet auf dein Feedback/Go, bevor der
echte Code gebaut wird.
