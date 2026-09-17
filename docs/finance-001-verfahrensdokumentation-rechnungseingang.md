# Verfahrensdokumentation Rechnungseingang (GoBD)

**Fassung 1 · 17.09.2026 · erstellt vom Head of Finance**
**Betrieb:** Sandra Holm, Einzelunternehmen (Gewerbeanmeldung geplant KW 41/2026)
**Geltungsbereich:** Alle Rechnungen, die der Betrieb **empfaengt** — Papier,
PDF, XRechnung, ZUGFeRD. Ausgangsrechnungen sind hier **nicht** geregelt; es
gibt heute keine.

> **Warum es dieses Dokument gibt:** Wer Belege elektronisch empfaengt, muss
> nachvollziehbar aufschreiben, wie er damit umgeht — unabhaengig von Umsatz
> und Betriebsgroesse; § 19 UStG befreit davon nicht (§ 146 Abs. 1 AO i. V. m.
> GoBD Rz. 151 f., BMF-Schreiben vom 28.11.2019). Ohne diese Dokumentation
> kann eine sonst saubere Ablage bei einer Pruefung beanstandet werden. Sie
> kostet **0 €** und war der einzige Teil von Gate-1-Punkt 4.7, der weder an
> Sandy noch an Platform haengt.

---

## Teil 1 — Allgemeine Beschreibung

| Merkmal | Stand 17.09.2026 |
|---|---|
| Rechtsform | Einzelunternehmen (Kleingewerbe); UG-Gruendung geplant, noch nicht vollzogen |
| Umsatzsteuer | **Kleinunternehmerin nach § 19 UStG** — kein Steuerausweis, kein Vorsteuerabzug |
| Gewinnermittlung | Einnahmen-Ueberschuss-Rechnung, § 4 Abs. 3 EStG |
| Beschaeftigte | keine |
| Belegmenge Eingang | rund 5–8 Rechnungen im Monat (IT-Dienste, Normtexte, Domain/Mail) |
| Buchhaltungssoftware | **noch keine** — die Entscheidung Steuerberater-Modell liegt bei Sandy (CoS-F-003, Finding 3) |
| Verantwortlich fuer die Ablage | Sandra Holm (sie allein hat Zugriff auf das Postfach) |
| Verantwortlich fuer Pruefung und Eingangsbuch | Head of Finance |

**Rechtsgrundlagen, an denen sich dieses Verfahren ausrichtet**

* §§ 145–147 AO (Ordnungsmaessigkeit, Aufbewahrung, Unveraenderbarkeit)
* § 14b Abs. 1 UStG — **8 Jahre** Aufbewahrung, Fassung seit 01.01.2025
* § 34a UStDV (Empfang), Empfangspflicht fuer E-Rechnungen seit 01.01.2025
  **ohne Uebergangsfrist, auch fuer Kleinunternehmer**
* GoBD, BMF-Schreiben vom 28.11.2019; E-Rechnungs-Ergaenzungen BMF vom
  15.10.2024 und 15.10.2025 nebst FAQ des BMF

**Die eine Erleichterung, auf die sich dieses Verfahren stuetzt:** Nach der FAQ
des Bundesfinanzministeriums stellt die Speicherung und Archivierung von
E-Rechnungen **ausserhalb eines GoBD-konformen Datenverarbeitungssystems bei
Kleinunternehmern regelmaessig keinen Verstoss** gegen die Aufbewahrungspflicht
dar. Das heisst im Klartext: **Ein gekauftes Archivsystem ist fuer Sandy nicht
noetig.** Erhalten bleiben muessen trotzdem (1) der strukturierte Teil im
Originalzustand, (2) die Unveraenderbarkeit, (3) die maschinelle
Auswertbarkeit. Genau das leisten die Schritte in Teil 2 und 4.

---

## Teil 2 — Anwenderdokumentation: der Weg einer Eingangsrechnung

### Schritt 0 — Eingangskanaele

| Kanal | Status |
|---|---|
| `hallo@sofortangebot.app` (IONOS) | aktiv, empfaengt |
| `rechnung@sofortangebot.app` als Weiterleitung auf `hallo@` | **beantragt bei Platform**, noch nicht eingerichtet |
| Selbstabholung im Kundenkonto (OpenAI, Vercel, Supabase, IONOS, Resend) | aktiv — diese Rechnungen holt Sandy im Portal ab |
| Papier an die Privatadresse | kommt vor, wird wie jede andere behandelt (eingescannt) |

### Schritt 1 — Eingang

Jede Rechnung wird **unveraendert** in
`belege/eingangsrechnungen/<Jahr>/` abgelegt. Das Original wird nicht
umgewandelt, nicht umbenannt im Inhalt, nicht "aufgeraeumt". Bei ZUGFeRD wird
die PDF-Datei als Ganzes abgelegt — das eingebettete XML darf **nicht**
herausgeloest und die PDF-Datei danach neu gespeichert werden.

**Namensschema:** `JJJJ-MM-TT_Lieferant_Rechnungsnummer.<endung>`
Beispiel: `2026-09-01_OpenAI_INV-4711.pdf`

### Schritt 2 — Pruefung vor der Zahlung

Nicht bezahlen, was nicht geprueft ist. Pruefliste:

| # | Pruefpunkt | Rechtsgrundlage |
|---|---|---|
| 1 | Vollstaendiger Name und Anschrift des Lieferanten **und** von Sandra Holm | § 14 Abs. 4 Nr. 1 UStG |
| 2 | Steuernummer oder USt-IdNr. des Lieferanten | Nr. 2 |
| 3 | Ausstellungsdatum | Nr. 3 |
| 4 | Fortlaufende Rechnungsnummer | Nr. 4 |
| 5 | Menge und handelsuebliche Bezeichnung der Leistung | Nr. 5 |
| 6 | Zeitpunkt der Leistung | Nr. 6 |
| 7 | Entgelt, aufgeschluesselt nach Steuersaetzen | Nr. 7 |
| 8 | Steuersatz und Steuerbetrag **oder** Hinweis auf Steuerbefreiung | Nr. 8 |
| 9 | Bei auslaendischen Anbietern: Hinweis **Reverse Charge / Steuerschuldnerschaft des Leistungsempfaengers** | § 14a Abs. 5 UStG |
| 10 | Sachlich richtig: Leistung wurde bezogen, Preis entspricht der Vereinbarung | — |
| 11 | Rechnerisch richtig: Summen stimmen | — |

**Hinweis zu Punkt 9, der Sandy konkret betrifft** (korrigiert am
17.09.2026 — die erste Fassung nannte hier zusaetzlich OpenAI, Vercel und
Resend; das war falsch, siehe Belegpruefung in
`chief-of-staff-finance-todos.md`):

**Genau ein Anbieter faellt heute unter das Reverse-Charge-Verfahren:
Supabase Pte. Ltd. (Singapur).** Die Rechnung weist keine Umsatzsteuer aus;
die Steuerschuld geht nach § 13b Abs. 2 Nr. 1 i. V. m. Abs. 5 UStG auf Sandy
ueber. **Das gilt auch fuer Kleinunternehmer** — § 19 schuetzt die eigenen
Verkaeufe, nicht die Einkaeufe, und der Vorsteuerabzug ist nach § 19 Abs. 1
i. V. m. § 15 UStG ausgeschlossen. Die 19 % sind damit echte Kosten. Daraus
folgt eine Voranmeldung fuer die betroffenen Zeitraeume (§ 18 Abs. 4a UStG),
gemeldet in der Zeile fuer Drittlandsleistungen.

**Vercel, OpenAI, Anthropic, Apple und IONOS weisen die 19 % dagegen selbst
aus** (EU-OSS bzw. deutsche USt) — dort ist nichts zu melden, aber als
Kleinunternehmerin gibt es auch nichts zurueck. Beim Pruefen heisst das:
**Eine auslaendische Rechnung ohne ausgewiesene USt ist kein Fehler, sondern
ein Reverse-Charge-Fall und gehoert gesondert vermerkt.**

**Lesbarkeit einer `.xml`-Rechnung:** ohne Viewer nicht moeglich. Empfehlung
steht (Quba-Viewer, Open Source, 0 €), Installation liegt bei Sandy — F-004.
**Bis dahin gilt: keine reine XML-Rechnung bezahlen.**

### Schritt 3 — Eingangsbuch und Fingerabdruck

Der Head of Finance traegt jede neue Datei in
`belege/eingangsrechnungen/eingangsbuch.csv` ein: Eingangsdatum, Lieferant,
Rechnungsnummer, Datum, Betrag, Format, Dateiname, **SHA-256-Pruefsumme**.

### Schritt 4 — Zahlung

Erst nach Schritt 2. Zahlungsnachweis (Ueberweisungsbeleg, Kartenabrechnung)
kommt in denselben Jahresordner, Namensschema mit dem Zusatz `_zahlung`.

### Schritt 5 — Monatsabschluss

Einmal im Monat gleicht der Head of Finance das Eingangsbuch gegen den Ordner
ab, prueft die Pruefsummen nach und haelt das Ergebnis in
`chief-of-staff-finance-todos.md` fest. Abweichung = Vorfall (Teil 4).

---

## Teil 3 — Technische Systemdokumentation

| Komponente | Stand |
|---|---|
| Rechner | Windows-Arbeitsplatz von Sandra Holm, Einzelplatz |
| Ablageort | `C:\Users\runni\Documents\Claude Code\sofortangebot\belege\eingangsrechnungen\` |
| Dateiformate | `.pdf` (auch PDF/A-3 mit eingebettetem XML), `.xml` (UBL/CII), `.jpg`/`.png` nur als Scan von Papier |
| Viewer fuer strukturierte Rechnungen | **fehlt** (Quba vorgesehen, F-004) |
| Buchhaltungssoftware | **keine im Einsatz** |
| Datensicherung | **ungeklaert** — offener Punkt, siehe unten |
| Versionsverwaltung | Die Belege liegen **bewusst ausserhalb von Git** (`.gitignore`). Git-Historie laesst sich umschreiben und ist deshalb kein Unveraenderbarkeitsnachweis; ausserdem gehoeren Lieferantenrechnungen nicht in ein Code-Repository. |

**Offener technischer Punkt, den ich nicht selbst schliessen kann:** Ein
einzelner Ordner auf einem einzelnen Rechner ueberlebt keinen Festplattendefekt
— acht Jahre sind lang. Es braucht eine zweite Kopie (Cloud-Ordner oder externe
Platte). Was davon vorhanden ist, weiss nur Sandy; die Frage liegt als **F-007**
in `entscheidungen-fuer-sandy.md`.

---

## Teil 4 — Betriebsdokumentation und internes Kontrollsystem

**Unveraenderbarkeit (§ 146 Abs. 4 AO).** Ein Windows-Ordner ist technisch
nicht schreibgeschuetzt. Ersatz und Nachweis: Zu jeder Datei steht die
SHA-256-Pruefsumme im Eingangsbuch, und eine Kopie dieser Pruefsummen-Liste —
**nur Dateiname, Datum, Pruefsumme, keine Betraege** — liegt versioniert unter
`docs/finance-001-hashliste.md` im Projekt-Repository. Wird eine abgelegte
Rechnung nachtraeglich veraendert, passt ihre Pruefsumme nicht mehr zu dem
Eintrag, der nachweislich frueher entstanden ist. Das ist keine
Revisionssicherheit im Sinne eines Archivsystems, aber es macht jede
Veraenderung sichtbar — und mehr verlangt die Nichtbeanstandungsregelung fuer
Kleinunternehmer nicht.

**Vier-Augen-Prinzip.** Gibt es in einem Einzelunternehmen nicht. Ersatz:
**Rollentrennung** — Sandy legt ab und zahlt, der Head of Finance prueft und
fuehrt das Eingangsbuch. Beide Spuren sind schriftlich.

**Fehlerbehandlung.** Falsch abgelegte Datei: nicht loeschen, sondern nach
`belege/eingangsrechnungen/<Jahr>/storniert/` verschieben und im Eingangsbuch
mit Grund vermerken. **Es wird nichts geloescht und nichts ueberschrieben.**

**Stornos und Korrekturrechnungen.** Die Korrekturrechnung ist ein eigener
Beleg mit eigenem Eintrag; die urspruengliche Rechnung bleibt liegen. Verweis
in der Spalte „Bemerkung".

**Zugriff.** Nur Sandra Holm hat Zugriff auf das Postfach. Der Head of Finance
arbeitet ausschliesslich auf den abgelegten Dateien — das ist so gewollt
(`team-organigramm.md`).

**Aufbewahrungsfrist.** 8 Jahre, beginnend mit dem Ende des Kalenderjahres, in
dem die Rechnung ausgestellt wurde. Belege aus 2026 sind also bis Ende 2034 zu
halten.

---

## Was heute noch fehlt — ehrlich aufgelistet

| Luecke | Bei wem | Status |
|---|---|---|
| Viewer fuer XRechnung/ZUGFeRD | Sandy (F-004) | offen, nicht eilig |
| `rechnung@sofortangebot.app` | Platform | angefragt 16.09. |
| Zustelltest mit echtem `.xml`-Anhang | Platform | Testdateien liegen bereit |
| Zweite Kopie der Ablage (Datensicherung) | Sandy (F-007) | neu, ungeklaert |
| Buchhaltungsloesung / Steuerberater-Modell | Sandy | offen seit CoS-F-003 |

**Kein Punkt davon kostet Geld**, mit Ausnahme der Buchhaltungsloesung, die
ohnehin im Plan steht.

---

## Aenderungshistorie

| Fassung | Datum | Was geaendert | Von |
|---|---|---|---|
| 1 | 17.09.2026 | Erstfassung im Rahmen von Gate-1-Punkt 4.7 | Head of Finance |

*Diese Dokumentation ist fortzuschreiben, sobald eine Buchhaltungsloesung
eingefuehrt wird oder sich der Eingangsweg aendert. Alte Fassungen bleiben in
der Git-Historie erhalten — das ist ihr Zweck hier, nicht der Belegnachweis.*
