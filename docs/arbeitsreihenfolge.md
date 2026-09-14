# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 14.09.2026, 21:40 MESZ · Chief of Staff**
*(ersetzt die Fassung von 16:00 — diese Datei wird immer ersetzt, nie ergänzt)*

---

## 🔴 Sofort: Produktion ist wieder rot

Die beiden Deploys von **21:24** stehen auf `ERROR`:
`ba28ee1` („10 neue Dateien nachtragen") und `1ad2df3` („DC-100").

```
./src/app/(app)/onboarding/[step]/page.tsx:16
Export mischeEigenePreise doesn't exist in target module
```

**Ursache:** `mischeEigenePreise` **existiert** auf Sandys Rechner
(`src/lib/default-price-selection.ts`, Zeile 133, gespeichert 20:44) — sie ist
nur nicht im Repository. Die Onboarding-Seite, die sie importiert, ist
committet, die Datei mit der Funktion nicht.

**Live ist damit der Stand von 20:23** (`dpl_KEuEVrB2`). **DC-100 und die zehn
nachgetragenen Dateien sind NICHT live.**

**Fix (Sandy):** `git add -A`, committen, pushen.

**Und eine Beobachtung für Platform, ohne Vorwurf:** Der um 20:23
nachgeschärfte `pre-push`-Hook blockiert nur noch Dateien, die Git **komplett
unbekannt** sind (`??`). `default-price-selection.ts` ist eine *bekannte,
geänderte* Datei — sie lief durch. Das Nachschärfen war richtig (sonst hätte
der Hook fast jeden Push blockiert), aber der Fall „halb committet" ist damit
wieder offen, und er hat innerhalb einer Stunde zugeschlagen. Ob und wie man
das schließt, ohne wieder alles zu blockieren, ist eine echte Abwägung —
gehört zu CoS-P-014 Nachlauf 2.

---

## Erledigt seit der letzten Fassung

**Platform** — ✅ **CoS-P-016**, der Hauptblocker: `token_hash` + `verifyOtp`
über `/auth/callback`, **beide** Wege live bestätigt (Bestätigungslink führt
ins Onboarding, Reset-Link auf das Passwort-Formular). ✅ CoS-P-014 Nachlauf 2
(Skript + Hook). ✅ CoS-P-017 (Kachel „Buchhaltung: Key fehlt noch"), live
bestätigt.

**Legal** — ✅ CoS-L-007 beide Fragen. 7-%-Kachel kann raus (Anlage 2 zu § 12
UStG ist abschließend; alle acht Betriebe stehen auf 19 %). Steuernummer auf
dem Angebot ist **nicht** nötig (§ 14 UStG gilt für Rechnungen). ✅ Vorab-
Kriterien zur Materialangabe geliefert.

**Head of Product Engineering** — ✅ DC-100 abgeschaltet (zentral über
`zugferd/einbettung.ts` statt drei einzelne Abschaltungen plus eine
vergessene). ✅ M-2 Mindestauftragswert auf 0. ✅ CoS-E-052 Teil 1 und 2
(Zuordnungstabelle `GEWERK_VORLAGEN`: Maler bekommt 83 Vorlagen statt 5;
Entsorgung nur noch bei abbruch/entrümpelung/rohbau). ✅ Konzept **Fassung 3**.
🟡 CoS-E-053 Schritt 3 + Rechenseite Schritt 4 (Materialanteil, Test vorweg
geschrieben, Migration Nr. 61 in Produktion und Staging).

**Product Designer** — 🟡 DC-101 gebaut (drei Ursachen, zwei davon in jedem
Browser). ✅ DC-103 Logo-Satz ersatzlos raus. ✅ DC-102 Entwurf als eigene
Datei `dc-102-konzept-preise-schritt.md`.

**Prüfmeister** — ✅ Nachtestplan vom 07.09. abgearbeitet: die dreizehn Fälle
sind nachgerechnet und als Code hinterlegt statt eingesprochen (631 Tests,
628 grün). ✅ Gegenprobe zu CoS-E-054, in Fassung 3 eingeflossen. ✅ Vokabular
und Dopplungen (Schritte 1 und 2 des Konzepts).

---

## Neue Funde, die vorher niemand auf dem Zettel hatte

| Fund | Wer hat ihn | Wo er hingehört |
|---|---|---|
| **Geschäftsbrief-Pflichtangaben** (§ 35a GmbHG, § 125a/§ 37a HGB): Rechtsform, Registergericht, HRB, Geschäftsführer existieren im Produkt **gar nicht**. Eine GmbH kann heute kein vollständiges Angebot erzeugen — Pflicht ab dem **ersten Angebot**, nicht erst ab der Rechnung, und abmahnfähig | Legal | Sandy sortiert ein; Legals Empfehlung: vor Gate 1, klein (Rechtsform-Auswahl, dann bedingte Felder). Für Kleingewerbe gilt nichts davon — deshalb ist es niemandem aufgefallen |
| **§ 13b Reverse Charge** fehlt komplett. Bei Subunternehmer-Aufträgen der Normalfall. Hängt am **Auftrag**, nicht am Betrieb — gehört ans Angebot, nicht ins Onboarding | Legal | notiert, scharf erst mit Rechnungen (CoS-L-006) |
| **PM-013-A:** „Dehnungsfuge mit rein" wird gesagt, es entsteht **keine Position** | Prüfmeister | Engineering |
| **`lexware` fehlt in `apiKeyFields`** im Onboarding-Schritt 7 — wer Lexware Office wählt und einen Key einträgt, dessen Key wird nicht gespeichert | Platform (Nebenfund) | noch niemandem zugewiesen |
| **CoS-E-052 Teil 3:** zwei parallele Preisquellen — *„mein eigener Fix hätte sie scharf gemacht"* | Head of PE selbst | er, in Arbeit |

---

## Offen, je Rolle

### Sandy 🔴
1. **Deploy reparieren** — `git add -A`, commit, push
2. **Vercel-Benachrichtigung** — Settings → Notifications → „Deployment Failed" an. 30 Sekunden, Platform kann das nicht für sie tun (keine API dafür)
3. **Entscheidung: ein Bildschirm oder zwei?** Der Designer weicht bewusst vom Konzept ab — er trennt Tätigkeit und Material-Standard, weil der Umschalter *„eine zweite Frage ist, die beim ersten Hinsehen wie eine Beschriftung aussieht"*. Head of PE hat es zusammen geplant. Beide haben recht begründet; entschieden ist es nicht
4. **Legal-Fund Geschäftsbrief** einsortieren: vor Gate 1 oder später?
5. Unverändert offen: Datenschutz-Freigabe · Versicherungsfreigabe · Stripe · KW 41 · gebündelte Preis-Entscheidungsrunde

### Platform
1. Abwägung zum Hook (siehe oben, halb committete Dateien)
2. `lexware`-Nebenfund — wer macht ihn?

### Head of Product Engineering
1. **CoS-E-052 Teil 3** — die zwei Preisquellen zu Ende bringen
2. **CoS-E-053** weiter: Oberfläche, sobald DC-102 abgenickt ist
3. **PM-013-A** — Dehnungsfuge

### Product Designer
1. **DC-104** — 7-%-Kachel raus. **Legal hat freigegeben, der Weg ist frei**
2. **Prototyp der Nick-Seite** — sein eigener nächster Schritt, sobald der Entwurf abgenickt ist
3. DC-101/DC-103 Live-Test nach dem nächsten grünen Deploy

### Prüfmeister
1. **PM-002** braucht einen Live-Lauf (Gewerke-Aufteilung kommt erst aus dem KI-Schritt)
2. Fallbasis Richtung 100 — läuft durchgehend

### Legal
1. Materialangabe bewerten, sobald die Richtung aus Fassung 3 gebaut ist (Kriterien liegen vor)

### Manfred
1. **Session 3 ist jetzt möglich** — CoS-P-016 ist live, der Bestätigungslink funktioniert
2. DC-101 nachprüfen: am Handy sofort lostippen, ohne zu warten
3. G.3 — seine zwei Szenarien in der App, offen seit 11.09.

---

## Was ich als Nächstes tue

Gate 1 neu rechnen, sobald der Deploy wieder grün ist — 2.1, 2.3 und 3.1
bewegen sich durch CoS-P-016 deutlich, aber erst wenn es auch live steht.

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
