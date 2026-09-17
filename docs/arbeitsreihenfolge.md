# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 17.09.2026, 08:00 UTC · Chief of Staff**
*(ersetzt die Fassung von 07:53 UTC — diese Datei wird immer ersetzt, nie ergänzt.)*
*Alle Uhrzeiten in dieser Fassung sind **UTC**.*

---

## Lage in drei Zeilen

**Alles Gepushte ist grün.** CI-Lauf **#206 grün** auf `da7db10`, Produktion
läuft auf demselben Stand (Vercel **READY**, 07:35). **Vier Commits liegen
ungepusht** — drei von Kollegen, einer von mir.

**Zwei Rollen haben ihre Spur leergeräumt.** Der Prüfmeister hat **alle fünf**
offenen Punkte beantwortet, Engineering hat **PM-090 und PM-109 gebaut** — die
Arbeit lag unversandt auf der Platte, ich habe sie nachgemessen und committet.

**Beim Team wartet fast nichts mehr auf jemand anderen.** Marketing, Prüfmeister
und Platform warten ausschließlich auf Sandy. Der Engpass ist ab jetzt
**Engineering**, und die Liste vor ihm ist lang.

---

## Was seit 07:00 UTC passiert ist

| Rolle | Ergebnis | Status |
|---|---|---|
| Engineering | **PM-090 + PM-109 gebaut** — `pruefeStaubschutzwand()` und `pruefeBaustellenreinigung()` in `maler-extras.ts`, beide **Fehlt-Eintrag statt Position**, aus zwei verschiedenen Gründen | ✅ gebaut, war unversandt, von mir committet |
| Prüfmeister | **Alle fünf offenen Punkte zu** — Marketings zwei Fragen, Engineerings zwei Rückfragen, PM-097-B | ✅ erledigt |
| Prüfmeister | **L-08 widerlegt** (nicht gebaut): die Kleinmaterial-Pauschale folgt einer Schwelle, nicht dem Zufall | ✅ erledigt |
| Prüfmeister | **M-4 zu** — das Büro mit „Ein Fenster, eine Tür" gemessen, PM-098 hält. **Die Krücke im Landingpage-Beispiel fällt weg** | ✅ erledigt |
| Designer | **DC-117 gebaut** — der Beleg-Satz einer Rückfrage stammt jetzt aus dem gefragten Raum (PM-100, UI-Seite) | ✅ erledigt |
| Designer | **DC-118 gebaut** — Vorschau-Umschalter und Zählzeile aus dem Landingpage-Entwurf raus, Ersatzsatz aus M-6 steht (Artefakt, kein Repo-Commit) | ✅ erledigt |
| Finance | **Reverse-Charge geklärt und eigene Falschaussage korrigiert** — nur Supabase ist ein Fall, nicht OpenAI/Vercel/Resend. Nachtrag zu F-006 mit Zahlen | ✅ erledigt |
| CoS | **CoS-E-075 angelegt** — Engineerings Arbeit nachgemessen, die fünf Prüfmeister-Antworten für sie übersetzt | ✅ erledigt |
| CoS | Prüfmeister-Antworten an **Designer** (`design-check.md`) und **Marketing** verteilt | ✅ erledigt |
| CoS | **CoS-P-013 als Frage in `entscheidungen-fuer-sandy.md` eingetragen** — stand bisher nur in der Platform-Datei, die Sandy nicht liest. Mein Fehler, jetzt behoben | ✅ erledigt |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, nicht vermutet:**

* **CI-Lauf-Liste über die GitHub-API (`branch=main`):** **#206 grün**
  (`da7db10`, 07:35), #205 grün (`116dee5`), #204 grün (`fdbedd2`),
  #203 grün (`bc877aa`), #202 grün (`a2c8629`).
* **Vercel-Deploy-Liste:** Produktion **READY** auf `da7db10`, erstellt 07:35.
* **`git log origin/main..main`** nach `git fetch`: **vier Commits** —
  `084a0ba`, `c777c53`, `9ccb6a1`, plus mein Doku-Commit aus diesem Lauf.
* **Engineerings Arbeit vollständig selbst nachgemessen**, bevor ich sie
  committe — nichts davon aus einem fremden Eintrag übernommen, den gab es
  nicht: `npx tsc --noEmit` **fehlerfrei** · **alle 132 Dateien** in
  `src/lib/__tests__`, in sieben Teilen gefahren: **2131 grün, 92
  Sperrklinken, 0 unerwartet rot** · `src/lib/vollstaendigkeit/__tests__`
  (13 Dateien) **192 grün**.
* **`entscheidungen-fuer-sandy.md`, `chief-of-staff-platform-todos.md` und
  `pruefmeister-restliste.md` frisch gelesen**, bevor ich unten „offen"
  schreibe.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Gate 1 rechne ich nicht neu.** Stand bleibt **53,0 %**. Es fehlen weiter
  Manfreds Session 3 und die Bewertung der neu erhobenen Felder.
* **Die Landingpage selbst habe ich nicht aufgerufen.** Der Prüfmeister hat die
  Zahlen gerechnet, nicht die Seite angesehen — er sagt das selbst so.
* **Die Testläufe des Designers zu DC-117** (23 Dateien / 256 grün) habe ich
  nicht wiederholt. Heimat bleibt `design-check.md`.
* **Warum Lauf #201 rot war**, bleibt unbekannt — der Detail-Endpunkt der
  GitHub-API antwortet weiter `403`, es braucht ein Token aus Sandys Konto.
  Seither sind fünf Läufe grün.
* **Versicherung, Stripe, Gewerbeanmeldung, Vercel-Benachrichtigung** — in
  diesem Lauf nicht angefasst.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🟡 **Pushen.** **Vier Commits** liegen bereit. | ein Befehl |
| 2 | 🔴 **Preis bei § 19 (A/B), F-006** — tendiert zu **B** (Regelbesteuerung). **Die Landingpage darf vorher nicht live gehen.** Finance hat die Zahlen jetzt nachgeliefert. | ein Satz |
| 3 | 🟡 **F-007:** Gibt es eine laufende Sicherung deines Rechners, und liegt der Projektordner mit drin? | ein Satz |
| 4 | 🟡 **IONOS-Weiterleitung `rechnung@`** — machst du sie selbst, oder soll ich? Empfehlung: selbst, dann ist der Zustelltest dieselbe Mail. | ein Satz |
| 5 | 🟡 **CoS-P-013, jetzt richtig eingetragen** — ging „Passwort speichern" durch und konntest du dich danach neu anmelden? | ein Wort |
| 6 | 🔵 **Buchhaltungs-Testlauf** — einmal ein Angebot in deine eigene Lexware-Office-Buchhaltung schieben. Entscheidet nur, ob auf der Seite die starke oder die vorsichtige Fassung steht. Blockiert nichts. | fünf Minuten |
| 7 | 🔵 **E-Rechnungs-Viewer installieren** (Quba, 0 €) — F-004, nicht eilig | einmalig |
| 8 | Vercel-Benachrichtigung · Versicherung · Stripe · Gewerbeanmeldung KW 41 (CoS-041) | unverändert, in diesem Lauf nicht neu geprüft |

**Erledigt und weg von ihrer Liste:** nichts Neues. Punkt 5 ist nicht neu — er
stand nur an der falschen Stelle.

---

## Wer als Nächstes dran ist

| Rolle | Nächstes | Wartet auf |
|---|---|---|
| **Engineering** | **Der Engpass.** Eigener Eintrag zu PM-090/PM-109 fehlt noch in ihrer Datei. Dann **CoS-E-074** (deckt jetzt PM-097 **und** PM-116 ab — einmal bauen statt zweimal), danach **Zug 2** mit **PM-075** (bepreiste Position, Einheit Stück) und der **Tapezier-Nische** (6,00 €/lfdm, zwei Auflagen). Beides ist vom Prüfmeister beantwortet und wartet nicht mehr. | niemanden |
| **Prüfmeister** | **Spur leer.** Von seiner Seite ist nichts mehr offen. Nächstes wäre L-06 (Reihenfolge der Positionen), von ihm selbst als nicht dringend eingestuft. | niemanden |
| **Designer** | **PD-019 Punkt 2** (Nachtrag ohne Kennzeichnung, PM-115) und **Punkt 3** (zwei Bauabschnitte, PM-116). Die Hinweis-Karte zu DC-116 wird erst sinnvoll, wenn Engineering den Erkenner hat. PD-018 Punkt 3 wartet auf die Messung des Prüfmeisters. | Engineering (nur die DC-116-Karte) · Prüfmeister (nur PD-018 P3) |
| **Marketing** | **Textseitig fertig, wartet bewusst.** Beide Fragen an den Prüfmeister sind beantwortet, M-4 ist zu, der Öffnungssatz darf in den Seitensatz. Offen bleibt die Entscheidung über die Positionstitel (Raumname am Titel, bei Beispiel 3 mit drei Räumen). | Sandys A/B zu § 19 · Sandys Buchhaltungs-Testlauf |
| **Platform** | **Nichts Zugewiesenes offen.** | niemanden |
| **Finance** | F-007 gestellt, Belegablage steht, Reverse-Charge geklärt | Sandys Satz zur Sicherung · Sandys A/B zu § 19 |
| **Legal** | unverändert | niemanden |

---

## Was gerade niemanden blockiert, aber nicht untergehen darf

* **PM-097 und PM-116 haben jetzt dasselbe Soll.** Der Prüfmeister hat PM-097-B
  auf den Wortlaut von PM-116 umgestellt, statt ihn offen zu lassen. Das spart
  Engineering einen ganzen zweiten Bau — und es kippt, sobald er je einen Fall
  misst, in dem zwei Abschnitte wirklich zusammen auf ein Blatt sollen.
* **Drei Positionstitel lauten im Produkt anders als im Landingpage-Entwurf.**
  Im Produkt hängt der Raumname am Titel („Wand streichen 2x — Büro"). Bei
  einem Ein-Raum-Beispiel unschädlich, bei Beispiel 3 trägt der Raumname die
  ganze Aussage. Marketings Entscheidung, kein Befund.
* **`menge_unbekannt` ist bewusst nicht gebaut.** Eigener Fall mit eigener
  Messung — offen, wer sie macht.
* **Der Extraktions-Prompt bekommt keine Sperrklinke.** Ein Prüfstand kann
  nicht messen, ob ein Sprachmodell eine Regel befolgt; die Nachziehung im
  Normalisierer ist der Beleg.
* **Das GitHub-403 auf Schritt-Ebene bleibt.** Ohne Token sehe ich weiter nur,
  **ob** ein Lauf grün war, nie **warum** er rot war.
* **Ein Betrieb hängt an genau einem Konto.** Mitarbeiterzugänge gibt es nicht;
  die FAQ wird entsprechend gekürzt (M-5).
* **Git hinterlässt hier Lock-Dateien**, die den nächsten Commit blockieren
  (`device_bash` darf nicht löschen). Ich räume sie nach jedem Commit nach
  `.git/alte-locks/` weg. Sandy muss dort nichts tun.

*Chief of Staff · 2026-09-17, 08:00 UTC*
