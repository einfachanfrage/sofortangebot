# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 17.09.2026, 06:20 UTC · Chief of Staff**
*(ersetzt die Fassung von 05:50 UTC — diese Datei wird immer ersetzt, nie ergänzt.)*
*Alle Uhrzeiten in dieser Fassung sind **UTC**.*

---

## Lage in drei Zeilen

**Alles ist gepusht und alles ist grün.** Sandy hat um 05:16 gepusht,
**CI-Lauf #203 grün auf `bc877aa`**, Produktion läuft auf demselben Stand.
`git log origin/main..main` ist leer.

**Neu seit 05:10:** der Product Designer hat **PD-019 Punkt 1 gebaut** — die
Arbeit liegt fertig, aber unversandt auf der Platte. Ich habe sie geprüft
(`tsc` fehlerfrei, vier Testdateien grün) und committe sie in diesem Lauf.

**Eine Frage weniger für Sandy:** Marketing hat die dritte Finance-Frage
selbst beantwortet. Von den drei Landingpage-Fragen bleiben **zwei**.

---

## Was seit 05:10 UTC passiert ist

| Rolle | Ergebnis | Status |
|---|---|---|
| Sandy | **Push durch** (05:16) — `bc877aa`, CI #203 grün, Produktion READY | ✅ erledigt |
| Designer | **PD-019 Punkt 1 gebaut** — Auffanglinie für das leere Ergebnis (`src/lib/leeres-ergebnis.ts`, Entwurfsseite, zwei neue Testdateien) | ✅ gebaut, war unversandt |
| Designer | **Ursache dahinter benannt** — der Extraktions-Prompt kennt keine allgemeine `vage`-Regel | ✅ gemeldet |
| Marketing | **Urteil zu 9.1 abgegeben** — Entwurf inhaltlich richtig, **sechs Stopper** vor dem Livegang | ✅ erhoben |
| Marketing | Finance-Frage 3 („Echte Aufnahmen") **selbst geschlossen**, Sockelleisten-Einwand (VOB-012) geschlossen | ✅ erledigt |
| CoS | **CoS-E-073 angelegt** — Designer-Befund an Engineering weitergereicht | ✅ erledigt |
| CoS | Hinweis in `entscheidungen-fuer-sandy.md` — nur noch zwei Finance-Fragen offen | ✅ erledigt |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, nicht vermutet:**

* **CI-Lauf-Liste über die GitHub-API (`branch=main`):** **#203 grün**
  (`bc877aa`, 05:16), #202 grün (`a2c8629`), **#201 rot** (`4c3fac8`),
  #200 grün (`5e475c3`).
* **Vercel-Deploy-Liste:** Produktion **READY** auf `bc877aa`, erstellt 05:16.
* **`git log origin/main..main`** nach `git fetch`: **leer**. Nichts hängt.
* **Die Arbeit des Designers selbst geprüft:** `npx tsc --noEmit` fehlerfrei ·
  `vitest` über die vier betroffenen Dateien → **69 bestanden, 32 erwartet
  rot, keine unerwartete rote**.
* **`entscheidungen-fuer-sandy.md` und `chief-of-staff-platform-todos.md`
  frisch gelesen**, bevor ich unten „offen" schreibe.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Warum #201 rot war.** Unverändert offen, der Detail-Endpunkt bleibt `403`.
  **Ich erfinde keine Ursache.**
* **Gate 1 rechne ich nicht neu.** Stand bleibt **53,0 %**. Es fehlen weiter
  Manfreds Session 3 und die Bewertung der neu erhobenen Felder.
* **Die Landingpage selbst habe ich nicht aufgerufen.** Alles dazu stammt aus
  den Befunden von Marketing und Finance.
* **Die sechs Stopper habe ich nicht nachgemessen** — sie sind Marketings und
  Finances Fund, Heimat `chief-of-staff-marketing-todos.md`.
* **Versicherung, Stripe, Gewerbeanmeldung, Vercel-Benachrichtigung** — in
  diesem Lauf nicht angefasst.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🟡 **Pushen.** Ein Commit von mir (Designer-Arbeit + Doku). | ein Befehl |
| 2 | 🔴 **Eine Frage zur Landingpage** — Preis bei § 19 (**A/B**). Sandy tendiert zu **B** (Regelbesteuerung), hat aber noch nicht bestätigt. **Die Seite darf vorher nicht live gehen.** | ein Satz |
| 3 | 🟡 **CoS-P-013: ein Satz fehlt** — ging „Passwort speichern" durch und konntest du dich danach neu anmelden? | ein Satz |
| 4 | 🔵 **E-Rechnungs-Viewer installieren** (Quba, 0 €) — F-004, nicht eilig | einmalig |
| 5 | Vercel-Benachrichtigung · Versicherung · Stripe · Gewerbeanmeldung KW 41 (CoS-041) | unverändert, in diesem Lauf nicht neu geprüft |

**Erledigt und weg von ihrer Liste:** die dritte Finance-Frage („Echte
Aufnahmen") — Marketing hat sie selbst beantwortet und formuliert den Satz um.
Und **die Zählzeile „18 von 25 frei" — Sandy hat entschieden: streichen.** Das
Versprechen „die ersten 25 zahlen dauerhaft 29 €" bleibt, nur der Countdown
geht weg. Marketing ist verständigt, einer der sechs Stopper ist damit zu.

---

## Wer als Nächstes dran ist

| Rolle | Nächstes | Wartet auf |
|---|---|---|
| **Engineering** | **CoS-E-073** — allgemeine `vage`-Regel in den Extraktions-Prompt, plus die Architekturfrage zu den drei übrigen `vage_typ`-Werten. Dazu die Ein-Wort-Antwort an Marketing: **Lexware Office oder Lexoffice?** | niemanden |
| **Prüfmeister** | Marketings zwei Fragen in `pruefmeister-restliste.md` — Kleinmaterial-Pauschale, und **das Büro einmal in der Fassung laufen lassen, die auf die Seite soll** (Fenster + Tür + zwei Heizkörper, sitzt auf PM-098) | niemanden |
| **Marketing** | Textfassungen für M-1, M-2, M-5 und „Echt eingesprochen" ausformulieren — **plus die Zählzeile streichen** (entschieden) | Sandys A/B zu § 19 |
| **Designer** | PD-019 Punkt 2 (Nachtrag ohne Kennzeichnung, PM-115) und Punkt 3 (zwei Bauabschnitte, PM-116) · PD-018 Punkt 3 wartet auf die Messung des Prüfmeisters | Prüfmeister (nur PD-018 P3) |
| **Platform** | unverändert: Lese-Token `actions:read` (nicht dringend), BOM in `ci.yml` nach eigenem Ermessen | niemanden |
| **Finance** | unverändert | Sandys A/B zu § 19 |
| **Legal** | unverändert | niemanden |

---

## Was gerade niemanden blockiert, aber nicht untergehen darf

* **Drei von vier Zweigen des Rückfragen-Generators haben heute keinen
  Auslöser** (CoS-E-073). Die gebaute Auffanglinie greift erst danach.
* **Der Tiefengrund nach dem Tapetenabriss ist entschieden, aber nicht
  gebaut.** Marketing nimmt die Zeile aus dem Hero, statt darauf zu warten.
* **Die 0-€-Zusage** wird von Marketing gestrichen, nicht von Engineering
  gebaut — so ist es von Sandy gewollt, und es ist hiermit festgehalten.
* **Ein Betrieb hängt an genau einem Konto.** Mitarbeiterzugänge gibt es
  nicht; die FAQ wird entsprechend gekürzt (M-5).

*Chief of Staff · 2026-09-17, 06:20 UTC*
