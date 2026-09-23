# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 23.09.2026, 09:55 UTC · Chief of Staff**
*(ersetzt die Fassung von 23.09., 08:55 UTC — diese Datei wird immer ersetzt, nie
ergänzt. Wer mir etwas mitteilen will, schreibt es in seine eigene Heimat-Datei;
was hier hineingeschrieben wird, ist beim nächsten Lauf weg.)*
*Alle Uhrzeiten sind **UTC**. In Deutschland ist es gerade **MESZ = UTC + 2**,
also 11:55 Uhr Ortszeit.*

---

## Lage in drei Zeilen

**🟢 Die gepushte Spitze ist grün und deployt — beides selbst gemessen.**
CI-**Lauf 235** auf `84a7ce2` (= `origin/main`): **success**, 08:51 UTC.
Vercel `dpl_DcG526oK…` auf `84a7ce2`: **READY**, production (angelegt
08:51 UTC, Zustand um 09:43 UTC von mir gelesen).

**🟡 Zwei Commits liegen lokal und sind ungepusht.** `800bbf4` (CoS-E-097) und
`65c1b32` (CoS-038-A), beide von Engineering, beide mit vollem bzw.
Delta-Prüfstand auf Sandys Rechner belegt — **aber die CI hat sie noch nicht
gesehen.** Sie sind bei mir „gebaut und lokal grün", nicht „bestätigt".
**Sandy muss pushen**, sonst nichts.

**🟢 CoS-E-098 hat kein zweites Rot bekommen.** Lauf 235 lief durch den Schritt
„Produktions-Build", an dem Lauf 233 gescheitert war. Damit bleibt 233 ein
einzelner Aussetzer. Der Punkt bleibt als Beobachtung offen, **nicht als
Befund**.

---

## Was seit 23.09., 08:55 UTC passiert ist

| Wer | Was | Wo |
|---|---|---|
| **Sandy** | **Gepusht** — `origin/main` steht auf `84a7ce2`, CI 235 grün, Vercel READY | `origin/main` |
| **Engineering** | **CoS-E-097 fertig** (`800bbf4`, 09:21): Dativ-n bei Fenstern/Heizkörpern (PM-145), „weiß" ohne Zahlwort (PM-146). Vier Sperrklinken eingelöst, voller Prüfstand 216 Dateien / 3.151 grün / 0 rot — **seine Messung, nicht meine** | `chief-of-staff-engineering-todos.md`, `pruefmeister-restliste.md` |
| **Engineering** | **CoS-038-A fertig** (`65c1b32`, 09:40): 29 € Gründerpreis / 49 € regulär / 14 Tage auf allen Kundenflächen, „30 Tage gratis" ist weg, Zahlen nur noch in `pricing.ts` | `chief-of-staff-engineering-todos.md`, `-marketing-todos.md` |
| **Engineering** | **CoS-038-A-1 aufgemacht** — die AGB behaupten in § 4.2 weiter die Kleinunternehmerregelung, seit Sandys Entscheidung vom 17.09. falsch. Nicht selbst umgeschrieben, an Legal gegeben | `chief-of-staff-legal-todos.md` |
| **CoS** | CI-Lauf 235 und Vercel selbst gemessen · AGB-Zeilen 37/38 selbst aufgeschlagen · Sperrklinke als `it.fails` selbst nachgesehen · **eine falsche Zeile in Engineerings Legal-Eintrag korrigiert** (siehe unten) · CoS-038-A-1 als Legals Platz 1 gesetzt · Engineerings Eingriff in `PM-137-3` dem Prüfmeister zur Bestätigung vorgelegt · `.git/index.lock` nach `.git/_stale/` verschoben · diese Datei ersetzt | Rollen-Dateien |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, 09:43–09:55 UTC:**

* **GitHub Actions über die API:** Lauf **235 CI / `84a7ce2` / success**
  (08:51), Lauf 234 `b65c1d2` success, Lauf **233 `4d7e172` failure**
  (Schritt „Produktions-Build"), Lauf 232 `4a3c33a` success.
* **Vercel:** `dpl_DcG526oK…` / `84a7ce2` / **READY** / production.
* **`git fetch` + `git rev-list origin/main..HEAD`: 2** — `800bbf4`, `65c1b32`.
  `origin/main` = `84a7ce2`. **Arbeitsbaum sauber**, 0 offene Dateien.
* **`src/app/agb/page.tsx` Zeile 37 und 38** einzeln aufgeschlagen: § 4.1
  („verschiedenen Tarifplänen") und § 4.2 („Kleinunternehmer gemäß § 19 UStG")
  stehen beide **unverändert** da.
* **`cos-038-a-preis-und-texte.test.ts` Zeile 193:** die Sperrklinke
  `CoS-038-A-1` ist **`it.fails`** — sie hält die CI nicht rot.
* **`grep -rn 'Kleinunternehmer' src/`** plus `einstellungen/page.tsx` und
  `onboarding/[step]/page.tsx` im Zusammenhang gelesen — daraus die Korrektur
  unten.
* **`docs/entscheidungen-fuer-sandy.md`, Überschriften ab Zeile 3047 einzeln
  aufgeschlagen:** der `support@`-Zustelltest (3161) und das Löschrecht (3081)
  stehen **weiterhin offen**, dahinter kommt nur noch der erledigte
  Dessau-Punkt (3238).

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Engineerings zwei Prüfstände.** 216 Dateien / 3.151 grün / 0 rot und der
  Delta-Lauf über 8 Dateien sind **seine** Zahlen. Nicht nachgefahren.
  **Hier steht keine Abnahme** — die kommt von CI-Lauf 236 nach Sandys Push.
* **Die 370,00 € und 465,90 € des Prüfmeisters.** Unverändert nicht nachgerechnet.
* **Das Log von CI-Lauf 233.** Weiterhin nur Job- und Schritt-Ergebnis gelesen.
* **Ob Engineerings Entscheidung in `PM-137-3` fachlich richtig ist.** Ich habe
  sie weitergegeben, nicht bewertet — das gehört dem Prüfmeister.
* **`npm run typecheck`, `npm run lint:ci`, voller Prüfstand.** Brechen auf
  diesem Mount an der Zeitgrenze ab. Unverändert.
* **Gate 1 rechne ich nicht neu.** Stand bleibt **54,2 %**.
* **Kein Blick ins laufende Produkt. Vierzehnter Lauf in Folge.**
* **Versicherung, Stripe, Gewerbeanmeldung, Buchhaltungs-Testlauf,
  OneDrive-Sicherung** — nicht angefasst.

---

## 🔴 Eine Korrektur, die ich an Engineerings Eintrag anbringen musste

Engineering schreibt in seinem Legal-Eintrag, „Kleinunternehmer" und „§ 19"
stünden **ausschließlich** in der AGB-Datei, „sonst nirgends im Quellcode".
**Das stimmt nicht** — es gibt sechs weitere Dateien (`einstellungen`,
`onboarding`, `AngebotDetail`, `api/email`, `api/pdf`, `api/pdf/xrechnung`).

**In der Sache hat er recht:** alle sechs hängen an `company.vat_rate` und
beschreiben den Steuerstatus **des Handwerksbetriebs**, nicht unseren eigenen.
Nur seine Begründung trägt nicht. **Beide Einträge sind nachgetragen** — bei
Engineering als Korrektur, bei Legal als ausdrückliches „fass diese sechs
Stellen nicht an", damit sie beim eigenen Nachsehen nicht darüber stolpert.

---

## 🟡 Was uncommittet im Arbeitsbaum liegt

**Nichts.** Der Arbeitsbaum ist sauber, selbst gemessen um 09:44 UTC.

**Sandy muss nur pushen** — ein Befehl, Block steht im Chat.

---

## Reihenfolge — wer als Nächstes was macht

1. **Engineering:** **CoS-038-B** (kein Gratis-Kontingent in `plan-limit.ts`,
   14 Tage im Produkt) — mit dem **vollen** Prüfstand, wie du es selbst gesetzt
   hast, weil sich die Sperre ändert. Danach unverändert **PM-119/L-06 →
   CoS-E-080 → CoS-E-086**. **CoS-E-098 ist kein Bauauftrag.** Wenn du
   committest: nur deine Dateien, `git add` mit Pfad, kein `git add -A`.
2. **Legal:** **CoS-038-A-1 ist dein Platz 1** und deine einzige offene
   Zuweisung von mir. § 4.2 ersetzen, § 4.1 einschätzen, den CoS-M-018-Wortlaut
   gegenlesen. **Schreib den Ersatzabsatz als Vorschlag fertig und warte nicht
   auf Sandy** — ich setze ihre Freigabe gebündelt auf ihre Liste, sie ist bis
   25.09. weg.
3. **Prüfmeister:** **zuerst `PM-137-3`** — Engineering hat eine deiner Zeilen
   von `['wand']` auf `[]` geändert, weil sie deiner Sperrklinke `PM-146-A`
   widersprach. Bestätigen oder widersprechen; es entscheidet, ob ein bereits
   gebauter Stand richtig ist. Dann der **Titel** derselben Zusicherung (eine
   Zeile). Danach unverändert **Themenspeicher-Punkt 13, dann 23**.
   **PD-026 ist zu** (DC-143, in Lauf 235 durchgelaufen).
4. **Designer:** keine offene Zuweisung von mir. Unverändert offen: **PD-021**
   („nach Arbeitsablauf" sortiert nicht nach Arbeitsablauf) — hing an
   CoS-038-A, **das ist jetzt gebaut**, du kannst also ran, sobald der Push
   durch ist.
5. **Finance:** unverändert — Sandys Antwort (Deutschlandticket, keine
   zusätzlichen Fahrtkosten) liegt bei dir. `Plan-Kosten!AL47`/`AM47` stehen
   noch auf den widerlegten 440 €. Ob 0 € oder ein Teilbetrag, ist **deine**
   Entscheidung, ggf. eine für den Steuerberater ab KW 41. Dazu die Frage, ob
   eine Übernachtungszeile fehlt.
6. **Marketing:** unverändert — `gtm-kanalplan.xlsx`, Blatt „Annahmen", Feld
   `F4` (440 € Fahrten) ist überholt. **Mit Finance abstimmen, wer die Zelle
   zieht** — nicht beide. Neu zur Kenntnis: deine Preis-Sektion steht jetzt im
   Code, Wortlaut aus deinem Entwurf. Der Gründerplatz-Zähler (CoS-040) ist
   bewusst **nicht** dabei.
7. **Platform:** keine offene Zuweisung von mir.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🔵 **Einmal pushen.** Zwei Commits liegen fertig, du brauchst nur den Push. Block steht im Chat | ein Befehl |
| 2 | 📧 **Zustelltest `support@`.** Von einer **privaten** Adresse eine Mail an `support@sofortangebot.app`, fünf Minuten später in `hallo@` nachsehen (auch Spam). Volle Anleitung in `entscheidungen-fuer-sandy.md` ab Zeile 3161 | 2 Min |
| 3 | 🔵 **Vor der Gewerbeanmeldung in den Arbeitsvertrag sehen** — Klausel zu Nebentätigkeiten. Legal hat die Bewertung als Schritt 0 in `legal-007` fertig; das Nachsehen im Vertrag kann nur du | 10 Min |
| 4 | 🔵 **Löschrecht für den Projektordner.** Nur in einer **normalen** Unterhaltung möglich, nicht in einem geplanten Lauf. **Nicht dringend** | ein Klick |
| 5 | 🔵 **Ab 26.09. bzw. KW 41:** Gewerbeanmeldung → Fragebogen → Geschäftskonto → Steuerberater. Alles in `finance-002-behoerdenliste-fuer-sandy.md` | nichts jetzt |
| 6 | 🟡 **Kommt auf dich zu, noch nicht jetzt:** die AGB-Änderung aus CoS-038-A-1 braucht deine Freigabe, sobald Legal den Ersatzabsatz fertig hat. Ich bündle sie mit den zwei Datenschutz-Korrekturen, die schon warten | später |


<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
