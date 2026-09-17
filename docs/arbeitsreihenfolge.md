# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 17.09.2026, 09:00 UTC · Chief of Staff**
*(ersetzt die Fassung von 08:00 UTC — diese Datei wird immer ersetzt, nie ergänzt.)*
*Alle Uhrzeiten in dieser Fassung sind **UTC**.*

---

## Lage in drei Zeilen

**Alles Gepushte ist grün, und es hat sich seit 08:00 nichts daran geändert.**
CI-Lauf **#206 grün** auf `da7db10`, Produktion läuft auf demselben Stand
(Vercel **READY**, 07:35). **Sieben Commits liegen ungepusht** — sechs von
vorher, einer aus diesem Lauf.

**Der Designer hat drei Punkte gebaut** (DC-111, DC-119, DC-120) — die Arbeit
lag unversandt auf der Platte, ich habe sie nachgemessen und committet.

**Eine beschädigte Doku-Datei hat heute morgen das Sicherungsskript für alle
blockiert.** Ursache gefunden, repariert, nichts verloren.

---

## Was seit 08:00 UTC passiert ist

| Rolle | Ergebnis | Status |
|---|---|---|
| Designer | **DC-111 gebaut** — alle **fünf** Anmelde-Seiten teilen sich jetzt einen Rahmen (`(auth)/layout.tsx`, neu), Emoji-Bildmarken raus | ✅ gebaut, war unversandt, von mir committet |
| Designer | **DC-119 gebaut** — die App entscheidet sich bei Wandflächen-Konflikt weiter für die spätere Zahl, aber nicht mehr wortlos | ✅ dito |
| Designer | **DC-120 gebaut** — PD-018 P2 und PD-016 P2 beantwortet: die Stufe heißt „ohne das gibt es diese Position nicht" | ✅ dito |
| Legal | **Gate-1-Punkt 7.13 bewertet: 100/100** (OpenAI-Bedingungen), **L-KI-01** gefunden — ein Halbsatz der Datenschutzerklärung stimmt nicht | ✅ erledigt |
| Legal | **Nebenbefund:** die 30-Tage-Löschzusage ist bisher **nie** eingelöst worden, weil noch keine Aufnahme alt genug war | ✅ gemeldet |
| Engineering | **Zwei Ablaufbefunde** gemeldet (`git add -A` · Löschrecht) und **eine Fachfrage** an den Prüfmeister gestellt | ✅ erledigt |
| Marketing | **Lexware-Frage selbst beantwortet** (aus dem Code), Nebenfund: die Seite bewirbt 3 Anbindungen, es sind **7** | ✅ erledigt |
| CoS | **`pruefmeister-restliste.md` repariert** — Endmarkierung stand in der Mitte, das Sicherungsskript verweigerte deshalb **allen** Rollen das Sichern | ✅ erledigt |
| CoS | **Stehende Regel zum Löschrecht in 5 Dateien korrigiert** — sie behauptete das Gegenteil der Wirklichkeit | ✅ erledigt |
| CoS | **`git add -A` abgeschafft** — Dateien werden ab sofort einzeln benannt. Engineerings Vorschlag, angenommen | ✅ entschieden |
| CoS | **CoS-E-076** (zwei Ablaufbefunde beantwortet), **CoS-P-029** (Termin 19.09.), L-KI-01 an Sandy verteilt | ✅ erledigt |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, nicht vermutet:**

* **CI-Lauf-Liste über die GitHub-API (`branch=main`):** **#206 grün**
  (`da7db10`, 07:35), #205, #204, #203, #202 grün, #201 rot (16.09.).
  **Kein neuer Lauf seit 07:37** — es wurde nichts gepusht.
* **Vercel-Deploy-Liste:** Produktion **READY** auf `da7db10`, 07:35.
  **Kein neuer Deploy seit dem letzten Durchlauf.**
* **`git log origin/main..main`:** **sieben Commits** ungepusht.
* **Die Arbeit des Designers vollständig selbst nachgemessen**, bevor ich sie
  committe: `npx tsc --noEmit` **fehlerfrei** · `dc111-auth-rahmen` **11 grün**
  · `dc119-wandflaechen-konflikt` **22 grün** · `src/lib/mengen/__tests__`
  (23 Dateien) **256 grün** · die 7 Dateien in `src/lib/__tests__`, die die
  geänderten Module einlesen, **122 grün** · die 6 Prüfmeister-Batches
  **112 grün, 59 Sperrklinken, 0 unerwartet rot**.
* **`node scripts/docs-sichern.mjs pruefen`** vor und nach der Reparatur:
  vorher „18.365 Zeichen NACH der Endmarkierung", jetzt **„Alle 57 Doku-Dateien
  in Ordnung."**
* **`entscheidungen-fuer-sandy.md`, `chief-of-staff-legal-todos.md`,
  `pruefmeister-restliste.md` und `chief-of-staff-todos.md` frisch gelesen**,
  bevor ich unten „offen" schreibe.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Gate 1 rechne ich nicht neu.** Stand bleibt **53,0 %**. Legals 7.13 mit
  100/100 und die drei DC-Punkte sind noch nicht eingerechnet — das gehört in
  einen Lauf, in dem ich `launch-readiness.md` ganz durchgehe, nicht nebenbei.
* **Die restlichen ~96 Dateien in `src/lib/__tests__`** habe ich nicht
  gefahren, nur die, die die geänderten Module einlesen.
* **Ein Prüfstand sieht keine Breite.** Dass die fünf Anmelde-Seiten auf einem
  echten Desktop-Fenster richtig aussehen, ist weiter ungeprüft.
* **Die Landingpage selbst habe ich nicht aufgerufen.**
* **Warum Lauf #201 rot war**, bleibt unbekannt — der Detail-Endpunkt der
  GitHub-API antwortet weiter `403`, es braucht ein Token aus Sandys Konto.
* **Versicherung, Stripe, Gewerbeanmeldung, Vercel-Benachrichtigung** — in
  diesem Lauf nicht angefasst.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🟡 **Pushen.** **Sieben Commits** liegen bereit. | ein Befehl |
| 2 | 🔴 **Preis bei § 19 (A/B), F-006** — tendiert zu **B** (Regelbesteuerung). **Die Landingpage darf vorher nicht live gehen.** | ein Satz |
| 3 | 🟢 **NEU: Datenschutz-Halbsatz freigeben (L-KI-01).** „unwiderruflich entfernt" stimmt nicht, solange OpenAI 30 Tage vorhalten darf. Wortlaut liegt fertig vor. Empfehlung: ja. | ein Wort |
| 4 | 🟡 **F-007:** Gibt es eine laufende Sicherung deines Rechners, und liegt der Projektordner mit drin? | ein Satz |
| 5 | 🟡 **IONOS-Weiterleitung `rechnung@`** — selbst machen oder ich? Empfehlung: selbst. | ein Satz |
| 6 | 🟡 **CoS-P-013** — ging „Passwort speichern" durch und konntest du dich danach neu anmelden? **Wenn du das ohnehin durchklickst: schau dir dabei die Anmelde-Seiten am großen Bildschirm an** — der Designer hat sie heute umgebaut. | ein Wort |
| 7 | 🔵 **Buchhaltungs-Testlauf** (Lexware Office) · **E-Rechnungs-Viewer** (Quba, 0 €) | nicht eilig |
| 8 | Vercel-Benachrichtigung · Versicherung · Stripe · Gewerbeanmeldung KW 41 (CoS-041) | unverändert, in diesem Lauf nicht geprüft |

**Erledigt und weg von ihrer Liste:** nichts.

---

## Wer als Nächstes dran ist

| Rolle | Nächstes | Wartet auf |
|---|---|---|
| **Engineering** | **Der Engpass, unverändert.** **CoS-E-074** (deckt PM-097 **und** PM-116 — einmal bauen statt zweimal), danach **Zug 2** mit **PM-075** (bepreiste Position, Stück, 95,00 €) und der **Tapezier-Nische** (6,00 €/lfdm, zwei Auflagen). Alles beantwortet. | niemanden |
| **Prüfmeister** | **Eine Frage von Engineering:** wird die **einmalige** Baustellenreinigung eine bepreiste Position (40,00 € Pauschale) oder bleibt sie ein Fehlt-Eintrag? Kalkulationsfrage, keine Messung. Danach L-06. | niemanden |
| **Designer** | **Spur leer.** DC-111, DC-119, DC-120 sind zu. Die Hinweis-Karte zu DC-116 wird erst sinnvoll, wenn Engineering den Erkenner hat. | Engineering (nur die DC-116-Karte) |
| **Marketing** | **Textseitig fertig, wartet bewusst.** Neu einzuarbeiten: es sind **sieben** Buchhaltungs-Anbindungen, nicht drei. Offen bleibt die Entscheidung über die Positionstitel. | Sandys A/B zu § 19 · Sandys Buchhaltungs-Testlauf |
| **Platform** | **CoS-P-029 — ein Termin, kein Auftrag:** am **19.09. nach 03:30 UTC** einmal `system_laeufe` prüfen (`aufnahmen.dateien > 0`?). | niemanden |
| **Finance** | F-007 gestellt, Belegablage steht, Reverse-Charge geklärt | Sandys Satz zur Sicherung · Sandys A/B zu § 19 |
| **Legal** | **Spur leer.** 7.13 bewertet, L-KI-01 liegt bei Sandy, der 30-Tage-Termin bei Platform. | Sandys Freigabe zu L-KI-01 |

---

## Was gerade niemanden blockiert, aber nicht untergehen darf

* **Die 30-Tage-Löschzusage ist bis heute nie eingelöst worden.** Nicht weil
  etwas kaputt ist, sondern weil keine Aufnahme alt genug war. Der erste Lauf,
  der wirklich löschen muss, ist der vom **19.09., 03:30 UTC**. Löscht er
  nichts, sind zwei veröffentlichte Rechtstexte unrichtig. **CoS-P-029.**
* **`git add -A` ist abgeschafft.** Dreimal hintereinander hat es fremde
  Arbeit mitgenommen und ist gutgegangen; einmal stand dabei für zwei Minuten
  ein abgeschalteter Aufruf in `maler.ts`. Das wäre grün durchgegangen. Ab
  jetzt werden Dateien einzeln benannt.
* **Löschen geht in dieser Shell nicht**, und die Anforderung des Löschrechts
  wird in einem geplanten Lauf abgelehnt — niemand ist da, der den Dialog
  beantwortet. `mv` nach `_to_delete/git-reste-JJJJ-MM-TT/` ist ab sofort die
  Vorgehensweise, nicht der Notbehelf. Die falsche Zeile ist aus fünf
  Rollen-Dateien raus.
* **Die Endmarkierung ist die einzige Stelle, an der das Sicherungsskript
  hängt.** Eine Datei mit Text dahinter blockiert das Sichern **aller**
  Doku-Dateien, auch der unbeschädigten. Heute hat es Legal aufgehalten.
* **PM-097 und PM-116 haben dasselbe Soll.** Spart Engineering einen zweiten
  Bau — kippt, sobald der Prüfmeister einen Fall misst, in dem zwei Abschnitte
  wirklich zusammen auf ein Blatt sollen.
* **Die Landingpage bewirbt drei Buchhaltungs-Anbindungen. Es sind sieben.**
* **Dieselbe Anbindung heißt an zwei Stellen verschieden** („Lexoffice" vs.
  „Lexoffice (Legacy)"). Genau die Unklarheit, die Manfred gemeldet hat
  (TN-108). Ein Wort in `integrations.ts`. Kein Auftrag, eine Meldung.
* **`menge_unbekannt` ist bewusst nicht gebaut.** Offen, wer die Messung macht.
* **Das GitHub-403 auf Schritt-Ebene bleibt.** Ohne Token sehe ich nur, **ob**
  ein Lauf grün war, nie **warum** er rot war.

*Chief of Staff · 2026-09-17, 09:00 UTC*
