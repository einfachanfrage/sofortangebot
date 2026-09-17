# Verfahrensdokumentation Rechnungseingang (GoBD)

**Fassung 3 · 17.09.2026 · erstellt und fortgeschrieben vom Head of Finance**
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
| Umsatzsteuer | **Regelbesteuerung — beschlossen, aber noch nicht erklaert.** Sandy hat am 17.09.2026 den Verzicht auf die Kleinunternehmerregelung gewaehlt (Entscheidung F-006, Variante B; Heimat der Entscheidung: `docs/preismodell.md`). **Erklaert wird der Verzicht erst im Fragebogen zur steuerlichen Erfassung nach der Gewerbeanmeldung in KW 41** — bis dahin gilt nach aussen unveraendert § 19 UStG. Fuer dieses Verfahren heisst das: Vorsteuerbetraege werden **ab sofort erfasst und nicht mehr als Kosten verbucht**, weil der Verzicht rueckwirkend fuer das Kalenderjahr 2026 wirkt. |
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
| `rechnung@sofortangebot.app` als Weiterleitung auf `hallo@` | **aktiv seit 17.09.2026** — von Sandy selbst im IONOS-Dashboard eingerichtet, Typ Weiterleitung, Ziel `hallo@sofortangebot.app`, Abwesenheitsnotiz inaktiv. Beleg: Bildschirmfoto der IONOS-E-Mail-Einstellungen |
| Selbstabholung im Kundenkonto (OpenAI, Vercel, Supabase, IONOS, Resend) | aktiv — diese Rechnungen holt Sandy im Portal ab |
| Papier an die Privatadresse | kommt vor, wird wie jede andere behandelt (eingescannt) |

### Schritt 1 — Eingang

Jede Rechnung wird **unveraendert** in
`belege/eingangsrechnungen/<Jahr>/` abgelegt. Das Original wird nicht
umgewandelt, nicht umbenannt im Inhalt, nicht "aufgeraeumt". Bei ZUGFeRD wird
die PDF-Datei als Ganzes abgelegt — das eingebettete XML darf **nicht**
herausgeloest und die PDF-Datei danach neu gespeichert werden.

**Der Dateiname des Lieferanten bleibt unveraendert** (geaendert in Fassung 3).
Die erste Fassung schrieb ein eigenes Namensschema
`JJJJ-MM-TT_Lieferant_Rechnungsnummer` vor. **Das ist zurueckgenommen**, aus
zwei Gruenden, die beim ersten echten Durchgang sichtbar wurden:

1. Umbenennen ist ein Eingriff in einen empfangenen Beleg. Er aendert zwar den
   Inhalt nicht, aber er kostet die Spur zurueck zur Quelle — der
   Lieferantenname ist bei Portalrechnungen (Vercel, Supabase, IONOS) zugleich
   die Wiederfindungs-Kennung im Kundenkonto.
2. Die Zuordnung leistet ohnehin das Eingangsbuch: es fuehrt zu jeder Datei
   Lieferant, Rechnungsnummer, Datum, Betrag und Beleg-Nummer. Ein zweites
   Ordnungssystem im Dateinamen waere eine zweite Wahrheit.

**Verbindlich ist damit:** Datei so ablegen, wie sie gekommen ist; die Ordnung
macht das Eingangsbuch. Nur bei Papierscans ohne eigenen Namen wird
`JJJJ-MM-TT_Lieferant.pdf` vergeben.

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
ueber. **Das gilt unabhaengig von § 19** — die Kleinunternehmerregelung
schuetzt die eigenen Verkaeufe, nicht die Einkaeufe. Zu melden ist es in der
Voranmeldung in der Zeile fuer Leistungen eines im Ausland ansaessigen
Unternehmers (§ 18 Abs. 4a UStG).

**Was sich durch die Entscheidung F-006 (Regelbesteuerung) geaendert hat —
aktualisiert in Fassung 3:** Die frueheren Fassungen schrieben hier, die 19 %
seien „echte Kosten". **Das gilt nicht mehr.** Unter Regelbesteuerung ist der
Reverse-Charge-Betrag ein **durchlaufender Posten**: im selben Voranmeldungs-
zeitraum als Steuer angemeldet und als Vorsteuer abgezogen, Saldo null. Beim
Pruefen aendert das nichts an der Handhabung, wohl aber an der Bewertung —
**der Betrag gehoert nicht in die Kostenrechnung.**

**Vercel, OpenAI, Anthropic, Apple, IONOS und DIN Media weisen die Steuer
dagegen selbst aus** (EU-OSS, irische bzw. deutsche USt). **Diese Betraege sind
ab dem Wirksamwerden des Verzichts abziehbare Vorsteuer und deshalb ab sofort
zu erfassen** — sie sind kein Aufwand mehr. Der Verzicht wirkt rueckwirkend
fuer das Kalenderjahr, fuer das er erklaert wird; erklaert wird er im
Fragebogen zur steuerlichen Erfassung nach der Gewerbeanmeldung (KW 41).
**Bis dahin ist nichts beim Finanzamt und nichts unwiderruflich** — die
Erfassung laeuft trotzdem, weil ein nicht erfasster Betrag spaeter nicht mehr
auffindbar ist.

Beim Pruefen heisst das: **Eine auslaendische Rechnung ohne ausgewiesene USt
ist kein Fehler, sondern ein Reverse-Charge-Fall und gehoert gesondert
vermerkt.** Und: **eine Rechnung ohne vollstaendige Pflichtangaben nach § 14
UStG kostet den Vorsteuerabzug** — unter § 19 war die Pruefliste oben eine
Ordnungsfrage, unter Regelbesteuerung ist sie eine Geldfrage.

### Schritt 2b — Zuerst pruefen: ist es eine Kleinbetragsrechnung?

**Diese Frage steht vor der Pruefliste, nicht dahinter** (neu in Fassung 3,
nach einem berechtigten Einwand von Sandy am 17.09.2026 — ich hatte drei
Belege als fehlerhaft gemeldet, die keine sind).

**Bis 250 € Gesamtbetrag (brutto) gilt § 33 UStDV.** Dann reichen **fuenf**
Angaben, und die Pruefliste oben schrumpft entsprechend:

| # | Pflichtangabe bei Kleinbetragsrechnungen |
|---|---|
| 1 | Vollstaendiger Name und Anschrift des **leistenden Unternehmers** |
| 2 | Ausstellungsdatum |
| 3 | Menge und handelsuebliche Bezeichnung der Leistung |
| 4 | **Bruttobetrag** (Entgelt und Steuer in einer Summe) |
| 5 | Steuersatz — oder bei Steuerbefreiung der Hinweis darauf |

**Was ausdruecklich NICHT verlangt wird: Name und Anschrift des
Leistungsempfaengers.** Auch keine Rechnungsnummer, keine Steuernummer des
Lieferanten, kein getrennt ausgewiesener Steuerbetrag. **Der Vorsteuerabzug
ist trotzdem in voller Hoehe moeglich**, wenn die uebrigen Voraussetzungen des
§ 15 UStG vorliegen.

**Warum das hier so wichtig ist:** Von 18 Belegen dieses Betriebs liegen
**17 unter 250 €**. Eine abweichende oder fehlende Empfaengeranschrift ist bei
ihnen also **kein Mangel** — und wer sie als Mangel meldet, schickt Sandy
hinter Rechnungskorrekturen her, die niemand braucht.

**Vier Faelle, in denen die Erleichterung NICHT gilt** und § 14 Abs. 4 UStG
voll anzuwenden ist — hier relevant ist der zweite:

* innergemeinschaftliche Lieferungen
* **Reverse-Charge-Umsaetze nach § 13b UStG** → betrifft **Supabase**
* Reiseleistungen
* Differenzbesteuerung

**Was die Erleichterung nicht heilt:** Sie betrifft nur die **Form** der
Rechnung. Ob die Leistung **betrieblich veranlasst** ist, bleibt davon
unberuehrt — ein privat genutztes Abo wird durch eine formell einwandfreie
Kleinbetragsrechnung nicht abziehbar. Das ist die Frage, die bei den
Apple-Belegen offen ist, und sie ist eine andere.

**Lesbarkeit einer `.xml`-Rechnung:** ohne Viewer nicht moeglich. Empfehlung
steht (Quba-Viewer, Open Source, 0 €), Installation liegt bei Sandy — F-004.
**Bis dahin gilt: keine reine XML-Rechnung bezahlen.**

### Schritt 2a — Fremdwaehrung umrechnen

**Betrifft heute Supabase, Vercel, OpenAI und Anthropic — alle vier rechnen in
US-Dollar.**

**Regel, und sie ist nicht waehlbar:** Umgerechnet wird mit dem
**Durchschnittskurs des Monats, den das Bundesfinanzministerium nach
§ 16 Abs. 6 UStG monatlich bekanntgibt.** Massgeblich ist der **Monat des
Rechnungsdatums**; bei den monatlich nachlaufend abgerechneten
Dauerleistungen (Supabase) ist das zugleich der Monat, in dem die Leistung
endet und die Steuer nach § 13b UStG entsteht. Ein selbst gewaehlter Kurs —
Tageskurs der Bank, Kurs der Kreditkartenabrechnung, Jahresdurchschnitt — ist
hier **nicht zulaessig**.

**Reihenfolge:** erst das **Netto**-Entgelt umrechnen, dann die 19 % darauf
rechnen. Nicht umgekehrt, sonst entstehen Rundungsdifferenzen gegen die
Voranmeldung.

**Wo die Kurse stehen:** `docs/kostenuebersicht-finance.xlsx`, Blatt
`Rechnungsjournal`, Kurstabelle unterhalb der Journaltabelle. Ein neuer Monat
wird **dort** eingetragen — die Spalte „Betrag EUR" rechnet dann von selbst.
Die Kurse kommen aus der monatlich fortgeschriebenen Uebersicht des BMF
(zuletzt Schreiben vom 01.09.2026, Gz. III C 3 - S 7329/00014/008/112).

**Fuer die Einnahmenueberschussrechnung wird derselbe Kurs verwendet.** Das
Einkommensteuerrecht schreibt ihn nicht vor, aber zwei Methoden im selben
Betrieb sind eine Fehlerquelle ohne Gegenwert — und die Wahl einer Methode
gehoert genau hierher dokumentiert.

**Nicht verwechseln:** Im Finanzplan (Blatt `Plan-Annahmen`) steht ein
**Planungs**kurs fuer kuenftige Monate. Der ist eine Schaetzung und darf
abweichen; der amtliche Monatskurs gilt fuer Belege, die bereits vorliegen.
Die beiden Werte werden **nicht** aneinander angeglichen.

### Schritt 3 — Eingangsbuch und Fingerabdruck

Der Head of Finance traegt jede neue Datei in
`belege/eingangsrechnungen/eingangsbuch.csv` ein: Eingangsdatum, Lieferant,
Rechnungsnummer, Datum, Betrag, Format, Dateiname, **SHA-256-Pruefsumme**.

**Stand 17.09.2026: 25 Dateien zu 18 Belegen erfasst** (Rechnungen und
Zahlungsnachweise; ein Beleg kann mehrere Dateien haben). Als Eingangsdatum
ist das **Dateidatum** eingetragen — der frueheste nachweisbare Zeitpunkt, zu
dem die Datei auf dem Rechner lag. Das ist bewusst nicht als
„Posteingangsdatum" bezeichnet: die Belege wurden bis August in den
Lieferantenportalen abgeholt, ein gemessenes Zugangsdatum gibt es dafuer nicht.
Ab Beleg 2026-018 und dem Kanal `rechnung@sofortangebot.app` ist das
Eingangsdatum echt.

**Kontrolle, ein Befehl** — prueft, ob jede gefuehrte Datei noch da und
unveraendert ist, ob eine Datei ohne Eintrag im Ordner liegt und ob
Eingangsbuch und versionierte Pruefsummenliste dasselbe sagen:

```
node scripts/belege-pruefen.mjs
```

**Ein Befund wird nicht „repariert".** Weder Datei ersetzen noch Pruefsumme
ueberschreiben — melden und in `chief-of-staff-finance-todos.md`
dokumentieren (Teil 4, Fehlerbehandlung).

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
| Viewer fuer strukturierte Rechnungen | **fehlt weiterhin** (Quba vorgesehen, F-004). Der erste echte ZUGFeRD-Eingang (Beleg 2026-018) war trotzdem pruefbar, weil das Sichtformat des PDF vollstaendig ist und der strukturierte Teil sich auslesen laesst. **Bei einer reinen `.xml`-Rechnung waere das nicht so** — dort bleibt es bei: nicht bezahlen, was nicht lesbar ist. |
| Buchhaltungssoftware | **keine im Einsatz** |
| Datensicherung | **eingerichtet seit 17.09.2026.** Taeglich 20:00 Uhr kopiert die Windows-Aufgabe `Sofortangebot Sicherung` (`scripts/sicherung-onedrive.ps1`) den gesamten Projektordner — einschliesslich `belege/` — nach `OneDrive\\Sofortangebot-Sicherung`, Konto `einfachanfrage@outlook.com`. **Es wird nichts geloescht.** Einzelheiten und die Kontrollpflicht: Teil 4. |
| Versionsverwaltung | Die Belege liegen **bewusst ausserhalb von Git** (`.gitignore`). Git-Historie laesst sich umschreiben und ist deshalb kein Unveraenderbarkeitsnachweis; ausserdem gehoeren Lieferantenrechnungen nicht in ein Code-Repository. |

**Dieser Punkt war bis zum 17.09.2026 offen** (F-007) und ist es nicht mehr:
die zweite Kopie steht. Was daran **nicht** geloest ist, steht in Teil 4 unter
„Sicherung ist kein Archiv" — eine mitlaufende Cloud-Kopie deckt den Ausfall
der Platte ab, nicht die volle Acht-Jahres-Frist.

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

### Datensicherung — und warum eine Sicherung noch kein Archiv ist

**Was laeuft** (seit 17.09.2026): Windows-Aufgabe `Sofortangebot Sicherung`,
taeglich 20:00 Uhr, `scripts/sicherung-onedrive.ps1`, Ziel
`OneDrive\\Sofortangebot-Sicherung` im Geschaeftskonto
`einfachanfrage@outlook.com`. Der gesamte Projektordner ohne `node_modules`
und `.next`. **Geloescht wird nichts** — was im Projektordner verschwindet,
bleibt in der Sicherung stehen.

**Das deckt den Plattenausfall ab. Es deckt die Acht-Jahres-Frist nicht ab**,
und diese Unterscheidung gehoert hierher, weil sie sonst verloren geht:

| | mitlaufende Sicherung (OneDrive) | was § 147 AO ueber acht Jahre verlangt |
|---|---|---|
| Plattendefekt | ✅ abgedeckt | — |
| versehentliches Loeschen | ✅ abgedeckt (es wird nichts geloescht) | — |
| **Bestand ueber acht Jahre** | ❌ nicht zugesichert — ein Konto kann volllaufen (5 GB Kontingent, rund 1 GB belegt), gekuendigt oder stillgelegt werden | verlangt, dass der Beleg 2034 noch da und lesbar ist |
| Unveraenderbarkeit | ❌ leistet OneDrive nicht | leisten hier die Pruefsummen (oben) |

**Verbindliche Folge, damit das nicht in acht Jahren auffaellt:**

1. **Jahresausleitung.** Nach Jahresabschluss — erstmals im Januar 2027 fuer
   2026 — wird der Jahresordner **zusaetzlich** auf einen Datentraeger gezogen,
   der sich nicht mehr von selbst aendert (externe Platte oder USB-Medium,
   danach abgezogen), zusammen mit dem Eingangsbuch und der Pruefsummenliste
   des Jahres. Das ist der Teil, den eine Synchronisierung prinzipbedingt nicht
   leisten kann: sie haelt den *aktuellen* Stand, kein Archiv.
   Kosten: einmalig ein Datentraeger, kein Abo.
2. **Bis dahin traegt die OneDrive-Kopie.** Sie ist besser als nichts und war
   der richtige erste Schritt.

### Kontrolle am Zielort — ein Erfolgsprotokoll ist kein Nachweis

**Der Befund vom 17.09.2026, der das ausgeloest hat:** Der erste
Sicherungslauf hat eine Stunde lang ins Leere kopiert. Das Kopierwerkzeug
meldete Erfolg, die Dateien lagen auf der Platte, OneDrive meldete
„Gesichert und synchronisiert" — **in der Cloud war trotzdem nichts**, weil
das Ziel eine Ordnerebene zu hoch lag. Aufgefallen ist es nur, weil jemand in
der Weboberflaeche nachgesehen hat.

**Regel:** Eine Sicherung gilt erst als Sicherung, wenn sie **am Zielort
sichtbar** ist. Die Erfolgsmeldung des Kopierwerkzeugs belegt das nicht.

| | |
|---|---|
| **Wie oft** | **vierteljaehrlich**, jeweils im Monat nach Quartalsende: Januar, April, Juli, Oktober. Zusaetzlich sofort nach jeder Aenderung am Sicherungsziel oder am Speicherort der Belege |
| **Warum vierteljaehrlich** | Der Belegbestand waechst um rund 5–8 Rechnungen im Monat. Ein Quartal ist der laengste Zeitraum, dessen Verlust sich aus den Lieferantenportalen noch vollstaendig nachholen liesse — bei Sandys Anbietern liegen die Rechnungen dort dauerhaft bereit. Monatlich waere Aufwand ohne Gegenwert, jaehrlich waere ein Blindflug |
| **Was geprueft wird** | (1) Der Ordner `Sofortangebot-Sicherung` ist **in der OneDrive-Weboberflaeche** sichtbar — nicht im Explorer. (2) Er enthaelt `belege/eingangsrechnungen/<Jahr>/` mit der erwarteten Dateizahl. (3) Eine Stichprobe laesst sich oeffnen. (4) Das Kontingent ist nicht ausgeschoepft. (5) `node scripts/belege-pruefen.mjs` laeuft ohne Befund |
| **Wer** | Punkt 1–4 nur Sandy (Zugriff auf das Konto), Punkt 5 der Head of Finance |
| **Wohin** | Ergebnis mit Datum in `chief-of-staff-finance-todos.md`. Kein Eintrag = nicht geprueft |
| **Naechster Termin** | **Oktober 2026** |

---

## Was heute noch fehlt — ehrlich aufgelistet

| Luecke | Bei wem | Status |
|---|---|---|
| Viewer fuer XRechnung/ZUGFeRD | Sandy (F-004) | offen, nicht eilig |
| `rechnung@sofortangebot.app` | — | ✅ **erledigt 17.09.** (Sandy, IONOS) |
| Zustelltest mit echtem `.xml`-Anhang | — | ✅ **bestanden 17.09.2026.** Sandy hat aus `einfachanfrage@outlook.com` an `rechnung@` geschickt, die Mail ist in `hallo@` angekommen — mit allen drei Anhaengen (`zugferd-cii.xml`, `zugferd-rechnung.pdf`, `xrechnung-ubl.xml`). Beleg: Bildschirmfoto des Posteingangs |
| Zweite Kopie der Ablage (Datensicherung) | — | ✅ **erledigt 17.09.2026.** OneDrive-Sicherung taeglich 20:00 Uhr, am Zielort geprueft. Teil 4 |
| Archivkopie, die sich nicht mehr aendert (8-Jahres-Frist) | Head of Finance | **offen, Termin Januar 2027** — Jahresausleitung nach Abschluss 2026, Teil 4 |
| Vierteljaehrliche Kontrolle am Zielort | Sandy + Head of Finance | **eingeplant, erstmals Oktober 2026**, Teil 4 |
| Buchhaltungsloesung / Steuerberater-Modell | Sandy | offen seit CoS-F-003 |

**Kein Punkt davon kostet Geld**, mit Ausnahme der Buchhaltungsloesung, die
ohnehin im Plan steht.

---

## Aenderungshistorie

| Fassung | Datum | Was geaendert | Von |
|---|---|---|---|
| 1 | 17.09.2026 | Erstfassung im Rahmen von Gate-1-Punkt 4.7 | Head of Finance |
| 2 | 17.09.2026 | Hinweis zu Pruefpunkt 9 korrigiert (nur Supabase ist Reverse Charge); **Schritt 2a Fremdwaehrungsumrechnung neu** (§ 16 Abs. 6 UStG, amtliche BMF-Monatskurse) | Head of Finance |
| 3 | 17.09.2026 | **Schritt 2b Kleinbetragsrechnungen neu** (§ 33 UStDV, 250-€-Grenze) — Korrektur nach Einwand von Sandy. Erster echter Durchgang mit 25 abgelegten Dateien. **Namensschema zurueckgenommen** (Schritt 1) — der Lieferantendateiname bleibt, die Ordnung macht das Eingangsbuch. **Kontrollbefehl `scripts/belege-pruefen.mjs`** neu (Schritt 3). **Datensicherung und Kontrolle am Zielort** in Teil 3 und 4 aufgenommen, mit vierteljaehrlichem Rhythmus und der Unterscheidung Sicherung/Archiv. **USt-Status auf Regelbesteuerung** umgestellt (Entscheidung F-006 = B, erklaert wird sie erst im Fragebogen) | Head of Finance |

*Diese Dokumentation ist fortzuschreiben, sobald eine Buchhaltungsloesung
eingefuehrt wird oder sich der Eingangsweg aendert. Alte Fassungen bleiben in
der Git-Historie erhalten — das ist ihr Zweck hier, nicht der Belegnachweis.*
