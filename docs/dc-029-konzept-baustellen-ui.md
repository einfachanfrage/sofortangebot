# DC-029 — Konzept: Baustellen-UI

**Bezug:** Datenmodell ist live (Head of Product Engineering, Fix-Update in
`chief-of-staff-todos.md` CoS-012 / `design-check.md` DC-029) — Tabelle
`baustellen`, `quotes.baustelle_id` (nullable), `getOrCreateErstbaustelle()`
in `src/lib/baustellen.ts` bereits an allen vier Stellen verdrahtet, an
denen ein Kunde einem Angebot zugewiesen wird. Das hier ist der zweite,
eigentliche Teil: wie das im Produkt sichtbar und bedienbar wird — auf
Sandys ausdrücklichen Wunsch komplett getrennt vom Datenmodell-Teil.

## Grundprinzip: unsichtbar, bis es gebraucht wird

Die überwiegende Mehrheit der Nutzer hat pro Kunde genau einen Auftrag — für
die soll sich durch dieses Feature **nichts sichtbar ändern**. Jeder Kunde
hat automatisch eine Erstbaustelle (Namensregel bereits umgesetzt: Adresse
des Kunden, sonst „Baustelle bei {Kundenname}"), aber solange es nur diese
eine gibt, zeigt die UI dazu nichts Neues — keine zusätzliche Zeile, kein
zusätzliches Feld, kein „Baustelle: X"-Label, das niemand angefordert hat.
Erst in dem Moment, in dem ein Kunde wirklich eine ZWEITE Baustelle bekommt
(der Clemens-Fall), wird die Struktur sichtbar. Das ist keine Verlegenheits-
Lösung, sondern die konsequente Fortsetzung des „Alles, was es nicht
braucht, ist weg"-Prinzips, das ich schon beim Datenmodell-Vorschlag
mitgegeben habe.

## Wo Baustelle im Produkt auftaucht

### 1. Angebot-Editor (`AngebotDetail.tsx`), Kunde-Karte

Heute zeigt die „Kunde"-Karte Name, Adresse, Telefon — die Adresse steht
schon genau da, wo später die Baustelle sichtbar würde. Vorschlag: diese
Zeile wird zur Baustellen-Zeile, sobald es mehr als eine Baustelle für
diesen Kunden gibt — vorher sieht sie exakt so aus wie heute (reine
Adresszeile, nicht antippbar, kein Unterschied).

- **Normalfall (1 Baustelle):** unverändert. Adresse steht da, fertig.
- **Mehrere Baustellen:** direkt unter der Adresse eine kleine, antippbare
  Zeile „🏗️ {Baustellen-Name} · {N} {Angebot/Angebote} ›" — öffnet ein
  Bottom-Sheet zur Auswahl/Anlage einer Baustelle für DIESES Angebot.
- **Baustelle-Wahl-Sheet:** Liste aller Baustellen dieses Kunden (aktuelle
  markiert), jede mit Name + Anzahl bereits vorhandener Angebote, ganz unten
  „+ Neue Baustelle" (Name + optionale Adresse, vorbefüllt mit nichts —
  bewusst kein Zwang zur Adresse, manche Baustellen heißen einfach „Bad OG").
  Auswahl schreibt sofort die neue `baustelle_id` aufs aktuell offene
  Angebot — keine Bestätigung nötig, das ist reine Zuordnung, kein
  destruktiver Schritt.

### 2. Kunde-Detail-Seite (`kunden/[id]/page.tsx`)

Heute: eine flache Liste aller Angebote dieses Kunden. Das ist exakt die
Stelle, an der Clemens' Problem sichtbar wird — bei mehreren Baustellen
sieht er nicht, welches Angebot zu welcher gehört.

- **Normalfall (1 Baustelle):** unverändert, flache Liste wie heute — bei
  nur einer Baustelle bringt Gruppierung keinen Mehrwert, nur eine leere
  Gruppen-Überschrift, die niemand braucht.
- **Mehrere Baustellen:** die Angebote werden nach Baustelle gruppiert,
  eine Karte pro Baustelle (🏗️ Name, Anzahl Angebote, Summe angenommener
  Angebote), darin die Angebote wie bisher als Zeilen, darunter „+ Neues
  Angebot für diese Baustelle". Über den Gruppen-Karten ein „+ Neue
  Baustelle"-Button. Bewusst dieselbe visuelle Sprache wie die Raum-Karten
  aus DC-028 (weiße rounded-2xl-Karte, Emoji + Name im Header, Liste
  darunter) — nicht, weil hier dieselbe Funktion arbeitet (andere
  Datenquelle, serverseitig gruppiert statt über Titel-Suffix), sondern
  damit es sich wie dasselbe Produkt anfühlt.

### 3. Neues Angebot anlegen

Bewusst KEINE neue Abfrage im Erstellungs-Flow („Für welche Baustelle?").
Ein neues Angebot bekommt automatisch die Erstbaustelle des gewählten
Kunden (das übernimmt bereits `getOrCreateErstbaustelle()`) — die
Baustellen-Wahl passiert danach, im Editor, nur falls der Nutzer sie
überhaupt braucht. Genau wie beim Kunden selbst: erst einsprechen, Details
später. Der einzige neue Einstiegspunkt ist „+ Neues Angebot für diese
Baustelle" auf der Kunde-Seite (Punkt 2) — der übergibt die gewählte
Baustelle direkt an den Erstellungs-Flow, statt sie erst nachträglich im
Editor umzustellen.

### Bewusst nicht Teil dieses Vorschlags

Die Angebots-Übersichtsliste (`/angebote`) bekommt hier keine
Baustellen-Spalte/-Filter — das wäre sinnvoll, sobald es echte Nutzer mit
mehreren Baustellen gibt, aber jetzt vorzugreifen wäre raten statt bauen,
was gebraucht wird. Kann als eigener, kleiner Nachtrag kommen, falls
Prüfmeister/Sandy das nach dem ersten Test vermissen.

## Prototyp

`dc-029-baustellen-prototyp.html` — vier klickbare Zustände: Angebot-Editor
normal vs. mit mehreren Baustellen (inkl. Baustelle-Wahl-Sheet), Kunde-Seite
normal vs. gruppiert. Alle im echten visuellen System der App gebaut.

— Product Designer, 2026-08-19
