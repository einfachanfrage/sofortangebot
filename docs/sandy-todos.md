# Sandys To-dos

Nur Dinge, die **niemand außer Sandy** erledigen kann — Zugänge, Konten,
Freigaben, Entscheidungen. Alles, was Umsetzung ist, steht nicht hier,
sondern bei der jeweiligen Rolle.

Geführt von Head of Product Engineering, Stand 02.09.2026.
Abgehakte Punkte bitte stehen lassen (Verlauf), nur `[ ]` → `[x]`.

---

## 🔴 Jetzt

### [ ] 1. Groq-API-Schlüssel widerrufen

**Warum:** Der Schlüssel stand durch meinen Fehler im Klartext im Chat — ich
habe `.env.local` beim Suchen ungefiltert ausgegeben, statt wie sonst nur die
Namen mit maskierten Werten. Der Schlüssel ist funktionslos (Groq wird
nirgends aufgerufen) und aus der Datei entfernt, aber solange er im
Groq-Konto gültig ist, kann jemand damit auf deine Kosten Anfragen stellen.

**So geht's:**

1. [console.groq.com/keys](https://console.groq.com/keys) öffnen
2. Beim betroffenen Schlüssel auf das **Papierkorb-Symbol** klicken
3. Im Dialog prüfen, dass der richtige Schlüssel ausgewählt ist, dann
   **Revoke Key**

**Danach:** Wenn du das Groq-Konto nur für diesen Test angelegt hast, kannst
du es gleich ganz löschen — wir setzen Groq nirgends ein und haben es heute
aus Code, AGB, AVV und Datenschutzerklärung entfernt.

**Wenn du im Konto siehst, dass in den letzten Wochen Anfragen gelaufen sind,
die nicht von dir stammen:** sag mir Bescheid, dann ist das ein Vorfall und
kein Aufräumpunkt.

---

## 🟠 Heute / diese Woche

### [ ] 2. Vercel: `CRON_SECRET` prüfen und Cron-Jobs kontrollieren

**Warum:** Der Erinnerungs-Job hat seit Bestehen **keine einzige E-Mail**
verschickt (75 Angebote, kein einziges mit Erinnerungs-Stempel), obwohl zwei
seit dem 25.08. und 27.08. fällig sind. Derselbe Mechanismus trägt seit heute
die Konto-Löschung. Läuft er nicht, löschen wir nichts — entgegen
Datenschutzerklärung und AGB.

**So geht's** (Vercel → Projekt `sofortangebot` → Settings):

1. **Environment Variables:** Gibt es `CRON_SECRET` für **Production**?
   Wenn nein, anlegen. Wert selbst erzeugen, damit er nicht im Chat landet —
   in PowerShell:
   `-join ((48..57)+(97..102) | Get-Random -Count 64 | %{[char]$_})`
2. **Cron Jobs:** Stehen dort **beide** Einträge?
   `/api/cron/reminder` (täglich 8:00) und `/api/cron/aufraeumen`
   (täglich 3:30). Der zweite erscheint erst nach dem nächsten Deploy.
3. Bei einem Job auf **Run now** klicken.

**Danach mir Bescheid geben** — ich sehe in `system_laeufe` nach, ob der Lauf
wirklich durchgegangen ist. Das ist der Beweis, den wir bisher nie hatten.

### [ ] 3. Head of Legal die neuen Rechtstexte gegenlesen lassen

**Warum:** Datenschutzerklärung, Impressum, AGB § 8.3/§ 9.3 und AVV sind
gepusht und gehen mit dem nächsten Deploy live. Vorher hat sie niemand mit
juristischem Auge gelesen.

**Besonders:** der Drittland-Absatz. Ich habe Stripe den
Standardvertragsklauseln zugeordnet, weil der DPF-Status dort nicht belegt
war. Wenn Stripe zertifiziert ist, gehört es in die andere Gruppe.

Alles Nötige liegt für ihn in `docs/chief-of-staff-legal-todos.md`.

### [ ] 4. Live nachtesten, was seit dem 31.08. gebaut wurde

**Warum:** Alles ist über Tests und einen echten PDF-Render abgesichert, aber
du hast es in der laufenden App noch nicht gesehen. Konkret: Zuschläge in
Prozent, Übermessungshinweis im Kunden-PDF, neues Statusmodell, Konto löschen.

---

## 🔵 Entscheidungen, die auf dich warten

Ausführlich in `docs/entscheidungen-fuer-sandy.md`, hier nur die Liste:

### [ ] 5. L7 — Kündigen-Button
AGB § 6.2 verspricht Kündigung „direkt in den Einstellungen", technisch geht
nur Konto-Löschung. Seit heute wiegt das schwerer: wer kündigen will, löscht
jetzt wirklich alles. **Entweder** Button bauen (klein) **oder** AGB
anpassen. Deine Prioritätsentscheidung.

### [ ] 6. VOB-006 — fünf verschiedene Höhenschwellen
Wann gilt ein Raum als „hoch" (Höhenzuschlag)? Im System stehen nebeneinander:
Code 3,00 m · Maler 2,80/4,00 m · Trockenbau 3,25/4,50 m · Putz 3,00 m.
Preisentscheidung, keine technische.

### [ ] 7. Die fünf Zuschlagssätze bestätigen
Raumhöhe 15 %, Altbau 20 %, Denkmalschutz 30 %, bewohnt 10 %, schwieriger
Untergrund 10 %. Die Zahlen stehen bisher auf meiner Einschätzung, nicht auf
deiner Freigabe.

### [ ] 8. Fliesen: 10 % Verschnitt fest im Code
Maler und Boden holen den Wert aus dem Katalog, Fliesen nicht. Soll er in den
Katalog wandern (dann anpassbar) oder fest bleiben?

### [ ] 9. Kork und Teppich: 0 % Verschnitt
Bewusst so gebaut, nie von dir abgesegnet.

### [ ] 10. S-4 — Rechtsform / Haftung
Du haftest aktuell als Einzelunternehmerin persönlich und unbegrenzt, auch
für einen KI-Rechenfehler. Legal empfiehlt Klärung vor dem ersten zahlenden
Kunden. Steht ausführlich in `docs/entscheidungen-fuer-sandy.md`.

### [ ] 11. CoS-M-004 — Freigabe der neuen Funktionsfarben
Head of Marketing wartet darauf, bevor er weiterbaut.

---

## ⚪ Zur Kenntnis, kein To-do für dich

- Der **Erinnerungs-Job** war seit Monaten tot. Das heißt: „Automatische
  Erinnerung nach X Tagen" in den Einstellungen ist heute ein Versprechen,
  das das Produkt nicht einlöst. Gehört in die Launch-Readiness.
- **Erledigt am 02.09.:** Der TEMP-DEBUG-Schreibvorgang ist raus, die Tabelle
  `debug_extraktion_roh` samt 137 gespeicherten Transkripten gelöscht. Ein
  Test verhindert die Rückkehr. **Wichtig:** Der Code ist erst nach dem
  Deploy der Edge Function wirklich draußen — die Zeile steht im
  PowerShell-Block.
- **Prüfmeister** schuldet mir Soll-Lösungen für sechs Testfälle. Solange die
  fehlen, kann ich dir nicht zusagen, dass *jeder* eingesprochene Fall stimmt.

---

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
