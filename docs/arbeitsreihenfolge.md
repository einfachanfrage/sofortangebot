# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 16.09.2026, 01:00 MESZ · Chief of Staff**
*(ersetzt die Fassung von 23:50 MESZ samt Prüfmeister-Nachtrag — diese Datei wird immer ersetzt, nie ergänzt.)*

---

## Lage in drei Zeilen

**Sandy hat seit 21:52 MESZ nicht mehr committet.** `main` steht unverändert
auf `9c38755`, Produktion ist derselbe Commit und `READY`. Alles, was seither
gebaut wurde, liegt nur auf der Platte.

**Die CI ist rot, und das ist jetzt gemessen statt vermutet.** Die beiden
Läufe zu `9b45952` und `9c38755` sind `failure`, der letzte grüne war
`de1ae80`. Ursache ist **nicht** der App-Code, sondern `.github/workflows/ci.yml`
selbst — Sandys PowerShell-Block, unverändert Punkt eins.

**Es wartet genau eine Entscheidung auf Sandy: DC-109.** Alles andere auf ihrer
Liste sind Handgriffe, keine Fragen.

---

## Was seit 23:50 MESZ dazugekommen ist — und wo es jetzt liegt

| Rolle | Ergebnis | Status |
|---|---|---|
| Engineering | **CoS-E-065 Punkt 1 gebaut** — `tuerQuelle` kennt den dritten Fall („angenommen"). Die geratene Tür sagt jetzt auf dem Kundenpapier, dass sie geraten ist. **2339 grün · 64 erwartet rot · null Rückschritte**, Testdatei gegengeprüft | fertig, **nicht committet** |
| Platform | **CoS-P-021 beantwortet** — beide Fragen zum Rechnungsnummernkreis mit Fundstellen. Stehenlassen ist das kleinere Risiko, dieselbe Entscheidung wie am 11.09. **Keine Frage an Sandy daraus** | ✅ zu |
| Platform | **Nebenbefund:** `src/lib/fehlertexte.ts` ist in `9c38755` bereits eingebaut | war nie offen |
| Engineering | **CoS-E-064 beantwortet** — PM-070…075 gemessen, zwei Fälle hängen an gesperrten Gewerken, PM-074 sitzt in `pruefeSockelleisten()`. Vorschlag: nach Mechanismus schneiden statt nach Ticket | ✅ beantwortet |
| Chief of Staff | **Schnitt entschieden** — euer Vorschlag übernommen, drei Familien, **Zug 3 vor Zug 2** | entschieden |
| Chief of Staff | **CoS-E-068 angelegt** — der Batch PM-079…PM-088 des Prüfmeisters stand in keinem Ticket, jetzt in die drei Familien einsortiert | verteilt |
| Chief of Staff | **CI-Zustand gemessen** (GitHub-Actions-API) — der Befund von Platform ist bestätigt, einschließlich Begründung | erledigt |
| Chief of Staff | **PM-085 / PD-016 in `design-check.md` verwiesen** | verteilt |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, nicht vermutet:**

* **Produktion** über die Vercel-API: `9c38755`, `READY`, 21:52 MESZ. Die
  letzten neun Produktions-Deploys sind `READY` — die Kette von CoS-P-014 ist
  nicht wieder aufgerissen.
* **Die GitHub-Actions-Läufe** (im Lauf um 23:50 war die API nicht erreichbar):
  `de1ae80` ✅, `9b45952` 🔴, `9c38755` 🔴. Der Workflow heißt in beiden roten
  Läufen `.github/workflows/ci.yml` statt `CI` — genau das zeigt GitHub, wenn
  es die Datei nicht lesen kann.
* **Alle Dateien, die sich seit 23:50 geändert haben**, frisch gelesen:
  `chief-of-staff-engineering-todos.md`, `chief-of-staff-platform-todos.md`.
* **Dass PM-079 / PM-080 / PM-085 in keinem Engineering-Ticket standen** — im
  ganzen Engineering-Todo gesucht, null Treffer. Deshalb CoS-E-068.
* **Dass Engineering die Datei nach meinem ersten Lesen erneut beschrieben
  hat** — vor dem Schreiben neu geholt, statt die ältere Fassung
  zurückzuschreiben. Die CoS-E-064-Antwort wäre sonst verloren gewesen.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Die Jobs und Schritte der beiden roten CI-Läufe.** Die API antwortet auf
  der Job-Ebene mit `403`. Der Workflow-Name belegt die Ursache; die
  Schritt-Ebene hätte nichts hinzugefügt.
* **Die Testläufe von Engineering** (2339/64) und die Lint-Messung von Platform.
  Beide Rollen haben gegen einen frischen Klon gemessen und es aufgeschrieben;
  ich habe es nicht nachgefahren.
* **Gate 1 rechne ich weiterhin nicht neu** — ich warte auf Manfreds Session 3,
  sonst steht die Zahl wieder auf „ist deployt" statt auf „funktioniert".

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | **`.github/workflows/ci.yml` reparieren, dann committen.** Unverändert Punkt eins — bis dahin bleibt jeder Push rot, egal was im Code steht | zwei Blöcke, stehen im Chat |
| 2 | **`pre-push`-Hook installieren** (CoS-P-023) — neue Datei, kein Commit nötig | ein Block |
| 3 | 🟡 **DC-109 entscheiden** — „A" oder „B", steht mit Empfehlung in `entscheidungen-fuer-sandy.md` | eine Antwort |
| 4 | 🟡 **Einmal „Passwort vergessen" durchklicken** (CoS-P-013), dann ist der Punkt zu | zwei Minuten |
| 5 | Vercel-Benachrichtigung · Datenschutz-Freigabe · Versicherung · Stripe · Gewerbeanmeldung KW 41 (CoS-041) | unverändert, in diesem Lauf nicht neu geprüft |

### Nicht im Repository

```
.github/workflows/ci.yml                             <- MUSS Sandy selbst reparieren, Block in chief-of-staff-platform-todos.md
package.json                                         <- Warnungsbudget 110 -> 120 (CoS-P-020)
src/lib/vollstaendigkeit/maler-sonder.ts             <- CoS-E-059 Eingriff 3
src/lib/vollstaendigkeit/maler-tapete.ts             <- CoS-E-059 / PM-077
src/lib/vollstaendigkeit/maler-lackieren.ts          <- CoS-E-065 Punkt 1 (geaendert, schon in Git)
src/lib/__tests__/cos-e-065-tuerquelle.test.ts       <- NEU
src/lib/__tests__/pm-vorlagen-zwilling.test.ts       <- CoS-E-066
src/lib/__tests__/pruefmeister-batch-1509.test.ts
src/lib/__tests__/pruefmeister-batch-64-68.test.ts
src/lib/__tests__/pruefmeister-batch-69-77.test.ts
src/lib/__tests__/pruefmeister-batch-79-88.test.ts   <- NEU
docs/arbeitsreihenfolge.md                           <- in diesem Lauf ersetzt
docs/chief-of-staff-engineering-todos.md             <- CoS-E-067, CoS-E-068, CoS-E-065 Punkt 1
docs/chief-of-staff-platform-todos.md                <- CoS-P-021 Ticket + Antwort + CI-Messung
docs/entscheidungen-fuer-sandy.md                    <- DC-109, CoS-P-013
docs/design-check.md                                 <- DC-106, DC-109, PM-085/PD-016
docs/pruefmeister-restliste.md                       <- PM-069…088, K.4/K.5
docs/pruefmeister-themenspeicher.md                  <- K.4 und K.5 beantwortet
docs/vokabular-abgleich.md                           <- Abschnitt V
docs/pruefmeister-notizen-fuer-designer.md           <- PD-016
```

Dazu, was Designer und Engineering sonst noch angefasst haben (DC-106 in der
Onboarding-Seite, `rechenweg-kundentext.ts` aus DC-108) — **deren Anzahl habe
ich nicht gezählt und behaupte sie nicht.** `git add -A` nimmt alles mit.

---

## Head of Product Engineering

1. ✅ **Eingriff 3 und CoS-E-065 Punkt 1 stehen.** Nichts nachzuarbeiten, nur
   committen zu lassen. **CoS-E-065 Punkt 2** (Wortlaut „aus Aufnahme") liegt
   beim Designer — ihr wartet darauf, ihr treibt es nicht.
2. ✅ **CoS-E-064 ist beantwortet, und der Schnitt ist neu — ich habe euren
   Vorschlag übernommen.** Ab jetzt wird nach Mechanismus geschnitten, nicht
   nach Ticketnummer:

   | Zug | Familie | Fälle |
   |---|---|---|
   | **1** | Titel trifft den Katalog nicht — Zeile da, Preis 0,00 € | PM-066-A/B, PM-067-A (CoS-E-062), PM-060-A-Familie |
   | **3** | Erfundene oder falsch zugeordnete Zeile muss weg | PM-072, PM-074, PM-066-D, **PM-079** |
   | **2** | Gesagt, und es entsteht nichts → Fehlt-Eintrag | PM-066-C, PM-067-B, PM-070…072, PM-075, **PM-080…084, 086…088** |

   **Reihenfolge: CoS-E-062 → Zug 3 → Zug 2 → CoS-E-061.** Zug 3 vorgezogen,
   weil eine erfundene Zeile mit Preis auf dem Angebot als Wahrheit steht.
3. **CoS-E-062 läuft weiter** — PM-067-A → PM-066-C → PM-066-A → PM-066-D.
   PM-066-A/B ist durch K.4 entsperrt (Setzstufe im Stufenpreis, zweite Zeile
   muss weg, es bleibt bei 770,00 €). **PM-068 nicht bauen.**
4. 🆕 **CoS-E-068 — der Batch PM-079…PM-088 des Prüfmeisters**, bis eben in
   keinem Ticket. PM-079 (Raumbezug fehlt, 423,00 € je Fall) in Zug 3,
   PM-080 (es fehlt der ganze Ursachen-Wortschatz, nicht ein Wort) und
   PM-081…088 in Zug 2. **PM-085 nicht bauen, bis PD-016 beantwortet ist.**
5. **Zwei Korrekturen an meinem CoS-E-064-Ticket, die ihr gemessen habt:**
   PM-072 und PM-075 hängen an **gesperrten** Gewerken — dort nichts
   Bepreistes bauen. Der Fliesenbad-Fund (`gewerkFuerPosition` schickt jeden
   Titel mit „wand" zum Maler) gehört zu CoS-E-061.
6. **CoS-E-061** — die Sperre, nach Zug 2.
7. **CoS-E-063** — Heizkörper. **CoS-E-060** — die Frage davor ist weiter offen:
   welche Datei speist die Oberfläche, `preis-ableitung.ts` oder
   `materialanteil.ts`?
8. **CoS-E-057 (§ 35a)** — CoS-L-008 ist geliefert, bauen möglich. Migration
   **und** Eintrag in `check_migrationen.sql`.
9. **CoS-E-053** weiterbauen, mit den vier Legal-Bedingungen. Preisanpassungs-
   Hinweis nicht aufs Kunden-PDF vor Sandys Freigabe (LR-16).
10. **CoS-E-067** — `no-explicit-any`-Aufräumrunde, eigener Lauf, ganz hinten.

## Product Designer

1. ✅ **DC-106 gebaut.** 🟡 **DC-109 wartet auf Sandy**, nicht auf euch. Sagt sie
   „B", baut ihr den bereitliegenden Ersatztext ein, sagt sie „A", fliegt die
   Karte.
2. **Ein Wortlaut, den Engineering von euch braucht** (CoS-E-065 Punkt 2):
   „aus Aufnahme" bedeutet in `maler-lackieren.ts` und `aufnahme-hinweise.ts`
   Gegenteiliges. **Wie sollen die beiden Fälle in der App heißen?**
3. 🆕 **PD-016, zwei Fragen vom Prüfmeister** — ob beim runden Raum (PM-085)
   gerechnet oder gefragt werden soll, und ob die Fehlt-Liste eine Stufe für
   „ohne das geht es technisch nicht" kennt. **Punkt 1 hält Engineering auf**
   (CoS-E-068 Teil C), Punkt 2 blockiert nichts.
4. **Nachzuziehen, sobald Engineering committet hat:** die eine Stelle in
   `AngebotDetail.tsx`, bewusst ausgelassen.
5. **DC-102** freigegeben — Ablauf und Darstellung, **nicht die Zahlen**.
   Einbau hängt an CoS-E-053.
6. **Live-Test von DC-105 / DC-101 / DC-103 / DC-104 / DC-089 / DC-047 /
   DC-048** — braucht Sandy am Rechner.

## Platform

1. ✅ **CoS-P-020 und CoS-P-021 sind zu.** Budget 120 mit Begründung; der
   Rechnungsnummernkreis bleibt stehen. Aus beidem entsteht für Sandy nichts.
2. ✅ **CoS-P-023** — der Hook ist gebaut, die Installation liegt bei Sandy.
3. **CoS-P-013** — der letzte Rest ist Sandys Klick-Durchlauf, kein Code.
4. **CoS-P-005** — die fehlende RLS-Policy für den Logo-Upload.
5. **CoS-P-022** — achter Tag ohne laufende Doku-Sicherung. Wird nicht kleiner,
   und `device_bash` bleibt der Grund.
6. Der frühere Punkt „Fehlertext" ist erledigt, **war aber nie offen** —
   `fehlertexte.ts` steht bereits in `9c38755`.

## Prüfmeister

1. ✅ **K.4 und K.5 sind beantwortet** — der letzte harte Block im Projekt ist
   auf. Setzstufe im Stufenpreis (PM-066-A bleibt bei 770,00 €); ungenannte
   Vorarbeit gehört in die Fehlt-Liste, nicht bepreist ins Angebot. Mit PM-077
   ergibt das **eine** Regel: `automatisch_ergaenzt` und „bepreist" schließen
   einander aus.
2. ✅ **Fallbasis 88/100.** PM-079…PM-088 in
   `src/lib/__tests__/pruefmeister-batch-79-88.test.ts` — 16 grün, 17
   Sperrklinken, jeder Fund mit Kontrolle. **Der Batch liegt jetzt als
   CoS-E-068 bei Engineering**, das fehlte bis eben.
3. ✅ **Die drei Stellen in euren Testdateien sind gegengelesen — alle drei
   bleiben.** Niemand muss etwas rückgängig machen.
4. **Als Nächstes ohne App prüfbar, Richtung 100:** Wandnische außerhalb des
   Bades · Staubschutzwand bei bewohnter Baustelle · rissiger Estrich ·
   Handwerker nennt Preise oder Stunden selbst · sehr kurze Aufnahme ·
   widersprüchliche Angaben im Diktat · Nachtrag zu einem Angebot · zwei
   Bauabschnitte. Das sind neun und reicht bis 97.
5. **Die 142 Vorlagen der gesperrten Gewerke** — jeweils vor der Freischaltung,
   nicht danach.
6. **Braucht die laufende App, unverändert offen:** PM-002 · PM-032 ·
   PM-031 Teil 2 · PM-030 · PM-014/PM-015 · G.3 · Gegenprobe aus PD-009 §7.

## Legal

1. ✅ **CoS-L-006 rechtlich erledigt** — der Produktteil daraus (CoS-P-021) ist
   bei Platform beantwortet und zu.
2. ✅ **CoS-L-008 geliefert** — Engineering kann CoS-E-057 bauen.
3. **CoS-L-009** — darf „Aufmaß" auf dem Angebot stehen? Hängt an LR-16,
   blockiert nichts.
4. **Materialangabe auf dem Kunden-PDF bewerten** — vier Bedingungen sind an
   Engineering übergeben.
5. **DC-106 Nachlauf:** der Reminder geht an den Endkunden. **Die Mail selbst**
   ist zu prüfen, nicht mehr der Onboarding-Satz.
6. CoS-L-002 · CoS-L-004 laufend. **E-Rechnungspflicht § 14 Abs. 2 UStG**
   nachholen — vor der ersten echten Rechnung, nicht vor Gate 1.

## Manfred

1. **Session 3: Registrierung end-to-end** — steht weiterhin aus. **Das ist der
   Posten, an dem die Gate-1-Zahl hängt.**
2. **DC-101 nachprüfen**: am Handy laden und **sofort** lostippen.
3. **Rückfrage aus CoS-E-056:** Gilt „Tapete extra" bei ihm auch für Vlies?
4. **Aus PD-009 §5:** Seine 75 % gegen die 63 % des Katalogs sind kein
   Widerspruch — zu bestätigen, nicht zu entscheiden.
5. **G.3** — seine zwei Szenarien in der laufenden App, offen seit 11.09.

---

## Was ich als Nächstes tue

**DC-109 nachhalten** — die einzige offene Frage an Sandy, die von einer Rolle
kommt und nicht von außen.

**Den CI-Lauf nach Sandys `ci.yml`-Reparatur erneut messen.** Erst dann ist
belegt, dass nur die Workflow-Datei kaputt war und nicht zusätzlich etwas im
Code.

**Im ganzen Projekt wartet kein harter Block mehr auf eine Rolle.** Offen sind
Sandys eigene Punkte, PD-016 (hält CoS-E-068 Teil C auf, sonst nichts) und
Manfreds Session 3.

**Zum Ablauf dieses Laufs:** `device_bash` auf Sandys Rechner ist weiterhin tot
(`no Plan9 drive shares mounted`, Windows-Update vom 08.09.). Gelesen und
geschrieben wurde über Staging/Commit; an alle drei Koordinationsdateien wurde
vor der Endmarkierung angehängt, nichts überschrieben.

---

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
