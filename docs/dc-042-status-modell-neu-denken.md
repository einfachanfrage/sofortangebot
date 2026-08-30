# DC-042 — Angebots-Status-Logik komplett neu gedacht

**Datum:** 2026-08-30 (Sandy, direkt im Anschluss an DC-041, Dashboard-Screenshot)

**Auftrag:** "was soll das im header heißen '4 angebote warten auf antwort'?
das ist mir zu wischiwaschi ich mag generell die statuslogik der angebote
irgendwie immer noch nicht mir ist das nicht klar und clean genug." Auf
Rückfrage zum Umfang: **komplettes Status-Modell neu denken**, nicht nur
Wording-Politur.

## Erstmal die direkte Frage beantwortet

„4 Angebote warten auf Antwort" zählt Angebote mit Status `sent` — verschickt
an den Kunden, der Kunde hat noch nicht digital unterschrieben. Dieselbe Zahl
zeigt die „OFFEN"-Kachel darunter (beide verlinken auf `/angebote?status=offen`)
— zwei verschiedene Formulierungen für exakt dieselbe Zahl. Das ist vermutlich
mit ein Grund, warum es sich „wischiwaschi" anfühlt: die Startseite sagt
zweimal fast dasselbe mit unterschiedlichen Worten, statt es einmal klar zu
sagen.

## Ist-Zustand — komplette Bestandsaufnahme (Code geprüft)

Sechs Roh-Status in der Datenbank (`src/lib/types.ts`), auf sechs Anzeige-Label
gemappt (`src/lib/status.ts`, DC-003 hat das schon auf EINE Quelle
vereinheitlicht — das Problem heute ist nicht mehr Inkonsistenz zwischen
Bildschirmen, sondern die Kette selbst):

| Roh-Status | Label heute | Wie man reinkommt |
|---|---|---|
| `draft` / `in_bearbeitung` | Entwurf (grau) | Aufnahme/Editor, noch nicht fertiggestellt |
| `bereit` | **Fertiggestellt** (gelb) | Klick auf „Fertigstellen" im Editor — Zahlen stehen, Angebotsnummer vergeben, aber noch NICHT beim Kunden |
| `sent` | Offen (blau) | E-Mail-Versand (`/api/email`) setzt das automatisch |
| `accepted` | Beauftragt (grün) | Kunde unterschreibt online (`/api/sign`) — ODER Handwerker setzt es selbst manuell (z. B. nach telefonischer Zusage) |
| `rejected` | Abgelehnt (rot) | **Nur manuell** — es gibt KEINEN Kunden-Weg, online abzulehnen. Der Handwerker trägt das selbst ein, wenn er anderweitig ein Nein erfährt (oder wenn einfach nichts mehr kommt) |
| `archived` | Archiviert (grau) | Nur manuell, über dasselbe „Status ändern"-Sheet |

Zusätzlich in vielen Filterabfragen ein siebter Wert, `viewed` — taucht in
`dashboard.ts` und `data/quotes.ts`s `STATUS_FILTERS` als möglicher „offen"-Wert
auf, wird aber **an keiner einzigen Stelle im Code je geschrieben** (bestätigt
per Volltextsuche). Reine Karteileiche — kann nie zutreffen, aber jeder, der
den Code liest, muss sich fragen, was er bedeuten soll.

### Drei konkrete strukturelle Lücken, nicht nur Wortwahl

1. **„Fertiggestellt" hat keinen eigenen Filter-Reiter.** Die Reiter auf
   `/angebote` (`DashboardFilters.tsx`) sind Alle / Entwurf / Offen /
   Beauftragt / Abgelehnt / Archiv — für `bereit` gibt es KEINEN eigenen
   Reiter (`STATUS_FILTERS` in `src/data/quotes.ts` kennt nur `entwurf`,
   `offen`, `beauftragt`, `abgelehnt`, `archived`). Ein fertiggestelltes,
   aber noch nicht verschicktes Angebot ist nur unter „Alle" zu finden —
   filtert man nach „Entwurf" (wo man es intuitiv vermuten würde, weil es ja
   noch nicht raus ist) oder nach „Offen" (wo man es vermuten würde, weil es
   ja fertig ist), verschwindet es komplett. Das ist vermutlich der Kern
   dessen, was sich „nicht clean" anfühlt — ein sichtbarer Status ohne
   Zuhause in der Navigation.
2. **Archivieren überschreibt den echten Ausgang, statt ihn zu bewahren.**
   `status` ist EIN Feld — sobald `archived` gesetzt wird, ist die Information
   „war das eigentlich angenommen, abgelehnt oder einfach nur ein alter
   Entwurf?" weg (bis auf `signed_at`/`signed_by`, die als eigene Spalten
   überleben, weil sie nicht Teil von `status` sind). Ein archiviertes,
   eigentlich abgelehntes Angebot sieht in der Statistik/Anzeige aus wie ein
   archiviertes, eigentlich angenommenes — nicht mehr unterscheidbar.
3. **„Abgelehnt" ist ausschließlich eine Selbstauskunft des Handwerkers**,
   nicht (wie „Beauftragt" per Unterschrift) ein Kundensignal — es gibt keinen
   öffentlichen Ablehnen-Weg. Das ist an sich okay (realistisch: Kunden sagen
   selten aktiv online ab), aber die Oberfläche behandelt „aktives Nein" und
   „einfach nie wieder gehört" heute gleich — beides landet nur dann als
   „Abgelehnt", wenn der Handwerker sich die Mühe macht, es händisch
   umzustellen. Vermutlich bleiben viele Angebote in Wahrheit für immer auf
   „Offen" stehen, obwohl der Kunde längst abgesprungen ist — auch das würde
   sich als „nicht klar" anfühlen: die Zahl auf dem Dashboard stimmt dann
   nicht mit der Realität überein.

### Wording-Probleme (zusätzlich zu den strukturellen)

- **„Offen"** sagt nicht, WER dran ist. Könnte genauso gut heißen „ich hab's
  noch nicht bearbeitet" wie „ich warte auf den Kunden" — das Gegenteil von
  eindeutig.
- **„Fertiggestellt"** kollidiert mit der Alltagsbedeutung von „fertig" =
  erledigt/abgeschlossen. Tatsächlich bedeutet es nur „ich bin mit dem
  Rechnen fertig, der Kunde hat es noch nicht mal gesehen" — das genaue
  Gegenteil von „abgeschlossen".
- Kein Hinweis, **wie lange** ein Angebot schon in einem Status hängt. „4
  Angebote warten auf Antwort" klingt nach einer Zahl, die einfach nur
  daliegt — kein Hinweis, ob das seit 2 Tagen oder 6 Wochen so ist, obwohl es
  genau DAS ist, was für einen Handwerker handlungsrelevant wäre („da muss
  ich nochmal nachfassen").

## Vorschlag — neues Modell

**Leitidee:** der Status soll auf einen Blick beantworten „wer ist gerade
dran, und was bedeutet das für mich" — nicht nur einen internen Zustand
benennen. Und: **Archivieren ist keine Phase im Lebensweg eines Angebots,
sondern eine Aufräum-Aktion** — es sollte den eigentlichen Ausgang nicht
überschreiben.

### 1. Der eigentliche Lebensweg bleibt linear, bekommt aber klarere Namen

| Heute | Vorschlag | Warum |
|---|---|---|
| Entwurf | **Entwurf** (unverändert) | Schon klar, keine Änderung nötig |
| Fertiggestellt | **Bereit** | Kurz, eigenständig, kollidiert nicht mehr mit „fertig = erledigt" |
| Offen | **Beim Kunden** | Sagt explizit, wer dran ist — die Kernfrage, die „Offen" offenlässt |
| Beauftragt | **Beauftragt** (unverändert) | Schon klar |
| Abgelehnt | **Abgelehnt** (unverändert) | Schon klar |

Das sind bewusst NUR zwei Umbenennungen (Fertiggestellt→Bereit,
Offen→Beim Kunden) — der Rest ist schon gut, unnötige Umbenennung würde nur
neue Gewöhnung kosten, ohne etwas zu gewinnen.

### 2. Archiviert wird ein Tag, kein Status

Statt `status: 'archived'` den echten Ausgang zu überschreiben: ein separates
Flag (z. B. `archived_at: timestamp | null`) NEBEN dem normalen Status. Ein
archiviertes Angebot zeigt weiterhin sein echtes Ergebnis („Beauftragt",
„Abgelehnt" …), zusätzlich klein „📦 archiviert" — und verschwindet trotzdem
aus der aktiven Ansicht, genau wie heute. Löst Lücke 2 vollständig, macht das
Modell nebenbei auch einfacher zu erklären („5 echte Zustände + ein
Aufräum-Schalter" statt „6 gleichrangige Zustände, von denen einer eigentlich
ein Aufräum-Schalter ist").

### 3. „Bereit" bekommt einen eigenen Filter-Reiter

Löst Lücke 1 direkt — kleine, unstrittige Änderung in `STATUS_FILTERS` +
`DashboardFilters.tsx`.

### 4. „Beim Kunden seit X Tagen"

Auf der Angebots-Karte/-Liste bei Status „Beim Kunden" das Versanddatum
mitzeigen (Tage seit `sent`, ODER — sauberer — ein neues `sent_at`-Feld, da
`created_at` nicht zwingend das Versanddatum ist). Macht „wartet auf Antwort"
konkret statt vage, und liefert nebenbei einen Hinweis, wann manuelles
Nachfassen sinnvoll wäre (der Reminder-Cron verschickt zwar schon automatisch
E-Mails an den Kunden, zeigt das aber dem Handwerker selbst nirgends an).

### 5. Dashboard-Header vereinheitlichen

Nur EINE Formulierung statt zwei für dieselbe Zahl — Vorschlag: Header-Zeile
weglassen zugunsten der ohnehin vorhandenen „BEIM KUNDEN"-Kachel, oder beide
exakt gleich formulieren. Im Prototyp als Option gezeigt.

## Offene Entscheidungen — bei dir, nicht bei mir

1. **Der tote `viewed`-Status:** ersatzlos streichen (einfachster Weg,
   Aufwand ~keiner) — ODER tatsächlich einbauen (der öffentliche
   Angebots-Link/`share_token` existiert bereits, ein Aufruf-Zähler wäre eine
   echte Backend-Ergänzung, kein reines Aufräumen). Ein „Kunde hat geöffnet,
   aber noch nicht entschieden" wäre ein echter Mehrwert (du wüsstest, ob die
   Mail überhaupt ankam), ist aber ein neues Feature, kein Aufräumen — daher
   Entscheidung bei dir, nicht automatisch mitgemacht.
2. **Wording „Beim Kunden" vs. Alternativen** (z. B. „Versendet", „Wartet auf
   Kunde") — Geschmacksfrage, im Prototyp als Umschalter zum Ausprobieren.
3. **Soll „Abgelehnt" intern zwischen „Kunde hat aktiv Nein gesagt" und
   „nichts mehr gehört" unterscheiden**, oder bleibt das bewusst EIN Status
   (einfacher, aber ungenauer)? Reine Produktentscheidung, keine technische
   Frage.
4. **„Beim Kunden seit X Tagen" — auf Basis von `created_at` (kein neues
   Feld, aber leicht ungenau, falls „Bereit" lange vor Versand lag) oder ein
   neues `sent_at`-Feld (genau, aber DB-Änderung)?**

## Umsetzungsplan, sobald du grünes Licht gibst

- **Reine Anzeige/Wording (Punkt 1, 3, 5):** Product Designer, ohne
  Backend-Änderung — `src/lib/status.ts`, `DashboardFilters.tsx`,
  `data/quotes.ts`s `STATUS_FILTERS`, Dashboard-Header.
- **Archivieren als Flag (Punkt 2) + „seit X Tagen" mit eigenem `sent_at`
  (Punkt 4, falls die genaue Variante gewählt wird):** braucht eine
  Datenbank-Migration (neue Spalten `archived_at`, ggf. `sent_at`) und
  Anpassung an allen Schreibstellen (`/api/email`, `/api/sign`, das
  „Status ändern"-Sheet) — das ist Head of Product Engineerings Bereich,
  Spec liegt hier bereit.
- **`viewed`-Entscheidung (offene Frage 1):** je nach deiner Wahl entweder
  eine reine Aufräum-PR (Product Designer + Engineering gemeinsam, klein)
  oder ein eigenständiges kleines Feature (Engineering, braucht eigene
  Schätzung).

**Prototyp:** `dc-042-status-modell-prototyp.html` — interaktiver Vorher/
Nachher-Vergleich: Dashboard-Hero, Angebote-Liste mit den neuen Reitern
(inkl. „Bereit"-Reiter), eine Angebots-Karte mit „Beim Kunden seit X Tagen",
das „Status ändern"-Sheet mit Archivieren als eigenem Schalter statt
gleichrangiger Options-Zeile. Zum Ausprobieren, welche Wortwahl sich richtig
anfühlt, bevor ich das im echten Code umbaue.

**Status:** 🔵 Konzept + Prototyp fertig, wartet auf dein Feedback/Go zu den
offenen Entscheidungen, bevor echter Code angefasst wird (Archivieren als
Flag + `sent_at` sind Datenmodell-Änderungen, nicht trivial rückgängig zu
machen).
