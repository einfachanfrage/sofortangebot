# Compliance-Check: Sofortangebot vor dem ersten echten Testnutzer

**Datum:** 2026-09-01 · **Prüfung durch:** Head of Legal & Compliance
**Auftrag:** Sandy, „check alles"
**Gegenstand:** Alle Pflichtenkreise, die für den Livegang gelten — nicht nur
Datenschutz.

> **Kein Ersatz für anwaltliche Beratung.** Regulatorische Anforderungen
> ändern sich laufend; Stichtage und Fassungen sind mit Stand 01.09.2026
> geprüft.

**Abgrenzung zu den drei bestehenden Dokumenten**, damit nichts doppelt steht:
`legal-001-bestandsaufnahme.md` hat die Rechtstexte geprüft (was steht auf der
Website), `vob-angebot-abstimmung.md` die Abrechnungsregeln, und
`legal-002-risikobewertung-vob.md` hat beides bewertet. **Dieser Check prüft
die operative Seite:** nicht ob die richtigen Texte dastehen, sondern ob die
Prozesse dahinter existieren und ob das, was die Texte versprechen, tatsächlich
passiert. Genau dort liegen die neuen Funde — und der schwerwiegendste des
ganzen Projekts.

---

## Zusammenfassung

**Ergebnis: Weitere Prüfung erforderlich — ein Punkt vor allen anderen.**

Im August gab es eine Datenschutzverletzung, die technisch sauber und schnell
geschlossen, aber **nie als datenschutzrechtlicher Vorfall bewertet wurde**.
Die Tabelle `debug_extraktion_roh` war vom 07.08. bis 17.08.2026 in Produktion
ohne jede Zugriffsbeschränkung erreichbar — jeder mit dem öffentlichen
Website-Schlüssel konnte sämtliche Sprach-Transkripte und KI-Rohdaten aller
Nutzer auslesen. Der Fund wurde als Sicherheitslücke behandelt und behoben
(CoS-P-001). Als Ereignis nach Art. 33 DSGVO wurde er nicht geprüft, nicht
bewertet und nicht dokumentiert. **Diese Dokumentation ist unabhängig von der
Meldepflicht vorgeschrieben** (Art. 33 Abs. 5), und sie fehlt seit fünfzehn
Tagen. Ob eine Meldung fällig gewesen wäre, kann ich ohne drei Angaben nicht
beantworten — siehe CC-01.

Daneben zwei Befunde, bei denen unsere eigenen Texte etwas versprechen, das
technisch nicht passiert: die Kontolöschung löscht nichts (CC-02), und die
Frist zur Meldung von Sicherheitsvorfällen in unserem AVV ist falsch herum
konstruiert (CC-03).

**Was gut ist, und das ist mehr als üblich:** Die Zugriffstrennung wurde für
alle 22 Tabellen direkt auf der Datenbank geprüft, nicht nur im Code
behauptet. Es gibt Endpunkte für Datenexport und Kontolöschung überhaupt.
XRechnung und ZUGFeRD sind gebaut, bevor sie Pflicht werden. Die
Passwort-Leak-Prüfung ist an. Für ein Einzelunternehmen ist das ein
überdurchschnittlicher Stand — die Lücken unten sind Prozesslücken, keine
Bauqualitätslücken.

---

## Anwendbare Regelwerke

| Regelwerk | Relevanz | Kernpflichten für uns |
|---|---|---|
| **DSGVO** | Voll anwendbar. Doppelrolle: **Verantwortlicher** für die Daten der Handwerker, **Auftragsverarbeiter** für deren Kundendaten | Art. 13 Information · Art. 15–21 Betroffenenrechte · Art. 28 AVV · Art. 30 Verzeichnis · Art. 32 TOM · Art. 33/34 Meldung · Art. 35 DSFA-Prüfung · Art. 44 ff. Drittland |
| **BDSG** | Ergänzend | § 38 DSB-Pflicht (greift nicht, siehe CC-09) |
| **TDDDG** (vormals TTDSG) | § 25 Endgeräte-Zugriff | Nur technisch notwendige Cookies → keine Einwilligung nötig. **Erfüllt** |
| **DDG** (vormals TMG) | § 5 Impressum | Erfüllt, zwei Normverweise veraltet (G8) |
| **EU AI Act (VO 2024/1689)** | Anbieter oder Betreiber eines KI-Systems | **Art. 4 KI-Kompetenz seit 02.02.2025** (CC-08) · Art. 50 Transparenz seit 02.08.2026 (offen, S-3) |
| **UWG** | Werbeaussagen auf der Landingpage | §§ 5, 5a — drei Aussagen unzutreffend (G2, G3) |
| **BGB Verbraucherrecht** | Nur falls Verbraucher durchrutschen | §§ 312g, 312j, 312k — siehe LR-05 |
| **PAngV** | Preisangaben gegenüber Verbrauchern | Netto/Brutto nach Kundentyp — **erfüllt und gut gelöst** |
| **BFSG** | Barrierefreiheit seit 28.06.2025 | **Nicht anwendbar** (B2B; zusätzlich Kleinstunternehmen-Ausnahme) |
| **UStG / GoBD / E-Rechnung** | Sobald Rechnungen erzeugt werden | Siehe CC-10 — wir sind hier voraus, nicht hinterher |
| **CCPA/CPRA, LGPD, PIPL, UK GDPR u. a.** | **Nicht anwendbar** | Angebot richtet sich an deutsche Handwerksbetriebe, kein Marktbezug außerhalb der EU. Bei internationaler Öffnung neu zu prüfen |

---

## CC-01 🔴 — Der Vorfall vom August wurde nie datenschutzrechtlich bewertet

**Das ist der wichtigste Punkt dieses Checks, und er hat eine abgelaufene
Frist.**

### Sachverhalt

Aus `chief-of-staff-platform-todos.md` (CoS-P-001, Fix-Update vom 17.08.2026)
und der Migration `20260817180000_secure_debug_extraktion_roh.sql`:

- Am **07.08.2026** wurde die Tabelle `debug_extraktion_roh` manuell — nicht
  per Migration — direkt in **Produktion** angelegt, als temporäre Debug-Hilfe.
- Sie hatte **keine Row-Level-Security** und volle Lese- und Schreibrechte für
  `anon`, also für nicht eingeloggte Besucher über die öffentliche REST-API.
  Der dafür nötige Schlüssel steht im ausgelieferten JavaScript und ist damit
  öffentlich.
- Inhalt laut Migrationskommentar: „alle Sprach-Transkripte und KI-Rohdaten
  aller Nutzer".
- Entdeckt und geschlossen am **17.08.2026**.
- **Expositionsfenster: zehn Tage.**
- Die Tabelle **existiert weiterhin in Produktion**; ihre Entfernung wurde als
  „möglicher Folgepunkt, falls gewünscht" notiert.

Die technische Behandlung war vorbildlich: direkt auf Produktion geschlossen,
sofort verifiziert, Migration nachgetragen, anschließend alle 19 Stellen mit
erweiterten Rechten durchgesehen. Daran gibt es nichts auszusetzen.

**Was fehlt, ist die datenschutzrechtliche Seite.** Der Vorfall wurde als
Sicherheitsbefund abgelegt, nicht als das, was er zusätzlich ist.

### Rechtliche Einordnung

Eine „Verletzung des Schutzes personenbezogener Daten" ist nach Art. 4 Nr. 12
DSGVO auch die **unbefugte Offenlegung von oder der unbefugte Zugang zu**
personenbezogenen Daten. Sprach-Transkripte aus Aufmaß-Diktaten enthalten
typischerweise Kundennamen, Adressen, Objektdaten — personenbezogene Daten,
und zwar überwiegend solche, für die wir **Auftragsverarbeiter** sind.

Daraus folgen zwei getrennte Pflichten:

| | Für die Daten der Handwerker (wir = Verantwortlicher) | Für deren Kundendaten (wir = Auftragsverarbeiter) |
|---|---|---|
| **Norm** | Art. 33 Abs. 1 | Art. 33 Abs. 2 |
| **An wen** | Berliner Beauftragte für Datenschutz und Informationsfreiheit | An jeden betroffenen Handwerker als Verantwortlichen |
| **Frist** | 72 Stunden ab Kenntnis | **unverzüglich** — nicht 72 Stunden, siehe CC-03 |
| **Ausnahme** | wenn voraussichtlich kein Risiko für Betroffene | keine Ausnahme |
| **Dokumentation** | **Art. 33 Abs. 5: immer, auch ohne Meldepflicht** | — |

**Der Punkt, der unabhängig von allem anderen gilt:** Art. 33 Abs. 5 verlangt,
**jede** Verletzung zu dokumentieren — Fakten, Auswirkungen, ergriffene
Maßnahmen — damit die Aufsichtsbehörde die Einhaltung überprüfen kann. Diese
Pflicht besteht auch dann, wenn keine Meldung nötig war. **Sie ist nicht
erfüllt.** Genau das ist der Punkt, an dem eine Behörde bei einer späteren
Prüfung ansetzt: nicht am Vorfall, sondern daran, dass er nicht bewertet wurde.

### Was ich nicht weiß und wissen muss

Ich kann von hier aus nicht beurteilen, ob eine Meldung fällig war. Dafür
brauche ich drei Angaben — von Platform & Integrations Engineering und Sandy:

1. **Welche und wessen Daten lagen zwischen dem 07. und 17.08. tatsächlich in
   der Tabelle?** Meine Vermutung nach Aktenlage: zu diesem Zeitpunkt gab es
   zwei Konten, beide interne bzw. Testkonten (vgl. den Hinweis „beide
   bestehenden Konten sind älter" in `pruefmeister-testfaelle.md`). Wenn dort
   ausschließlich Daten des Teams und erfundener Testkunden lagen, ist das
   Risiko für natürliche Personen sehr gering und eine Meldung war
   voraussichtlich **nicht** erforderlich. Das ist aber eine Vermutung, keine
   Feststellung.
2. **Gibt es Zugriffsprotokolle?** Supabase-/PostgREST-Logs für den Zeitraum:
   Wurde die Tabelle von außen abgefragt? Wenn ja, von wo und wie oft? Wenn
   sich ein Zugriff sicher ausschließen lässt, ändert das die Bewertung
   erheblich. Falls die Logs inzwischen rotiert sind, ist auch **das** ein zu
   dokumentierendes Ergebnis.
3. **Waren echte Handwerkerkunden betroffen?** Falls ja, schuldeten wir dem
   jeweiligen Handwerker als Verantwortlichem eine unverzügliche Mitteilung
   nach Art. 33 Abs. 2 — die bisher nicht erfolgt ist.

### Bewertung und Empfehlung

**Wahrscheinlichstes Ergebnis:** Der Vorfall war nicht meldepflichtig, weil
keine echten Betroffenendaten in nennenswertem Umfang betroffen waren. **Das
entlastet aber nicht** — die Bewertung selbst und ihre Dokumentation sind
Pflicht, und beide fehlen.

**Nicht nachträglich melden, ohne vorher die Fakten zu haben.** Eine Meldung
15 Tage nach Fristablauf mit unklarer Faktenlage schafft mehr Probleme, als sie
löst. Die richtige Reihenfolge ist: Fakten feststellen → bewerten →
dokumentieren → und **nur dann** melden, wenn die Bewertung ergibt, dass eine
Meldung geschuldet war. In dem Fall gehört die Verspätung offen begründet
(Art. 33 Abs. 1 S. 2 sieht das ausdrücklich vor).

| Option | Wirksamkeit | Aufwand | Empfohlen |
|---|---|---|---|
| Fakten feststellen, Vorfall dokumentieren, Ergebnis ablegen | Hoch — erfüllt Art. 33 Abs. 5 | ~1 Tag inkl. Log-Auswertung | **Ja, sofort** |
| Vorfallsregister anlegen (dieser Fall als erster Eintrag) | Hoch — verhindert Wiederholung | ~2 h | **Ja** |
| `debug_extraktion_roh` in Produktion löschen | Hoch — beseitigt die fortbestehende Ursache | gering | **Ja** |
| Sofort melden, ohne Faktenlage | Niedrig | gering | **Nein** |
| Nichts tun, ist ja behoben | Null | Null | **Nein** — die Dokumentationspflicht besteht fort |

**Zur laufenden Ursache:** Die Tabelle enthält weiterhin Roh-Transkripte ohne
definierte Löschfrist. Das ist unabhängig vom Vorfall ein Verstoß gegen die
Speicherbegrenzung (Art. 5 Abs. 1 lit. e) und die Datenminimierung (lit. c).
Der als optional notierte Aufräumpunkt sollte verbindlich werden.

**Und eine Regel für die Zukunft, die ich gern verbindlich hätte:** Jeder
Sicherheitsbefund, bei dem personenbezogene Daten zugänglich waren oder
gewesen sein könnten, geht ab sofort **zusätzlich** an Legal — nicht statt der
technischen Behebung, sondern parallel dazu. Die 72-Stunden-Uhr läuft ab
Kenntnis, nicht ab Behebung.

---

## CC-02 🟠 — Die Kontolöschung löscht nichts

### Sachverhalt

`src/app/api/account/delete/route.ts` tut Folgendes: Stripe-Abo kündigen,
`companies.deleted_at` auf den aktuellen Zeitstempel setzen,
Bestätigungs-E-Mail senden, ausloggen. **Mehr nicht.** Es gibt einen
Wiederherstellungs-Endpunkt (`account/restore`) und ein Banner, das die
Rückkehr anbietet.

`vercel.json` definiert genau **einen** Cronjob: `/api/cron/reminder`, täglich
8 Uhr. **Einen Job, der nach Ablauf der Frist tatsächlich löscht, gibt es
nicht.** `deleted_at` wird ausschließlich vom Wiederherstellungs-Banner
gelesen.

### Warum das ein Problem ist

Ein Soft-Delete mit 30-tägiger Rückholfrist ist eine **gute** Konstruktion —
sie schützt Nutzer vor Fehlklicks. Es fehlt nur der zweite Halbschritt. Solange
er fehlt, sagen drei Dokumente etwas Unzutreffendes:

| Dokument | Aussage | Tatsächlich |
|---|---|---|
| Datenschutzerklärung § 8 | „Alle mit Ihrem Account verbundenen Daten werden dann **vollständig und unwiderruflich gelöscht**" | nichts wird gelöscht |
| AGB § 6.5 | „Nach Vertragsende werden die Daten … für 30 Tage vorgehalten … Danach werden sie **unwiderruflich gelöscht**" | keine Löschung nach 30 Tagen |
| AVV § 3 | „Löschung oder Rückgabe aller Daten nach Vertragsende" | nicht erfüllt |
| Bestätigungs-E-Mail | bestätigt die Löschung | trifft nicht zu |

Rechtlich sind das drei verschiedene Verstöße: **Art. 17** (Recht auf
Löschung nicht erfüllt), **Art. 5 Abs. 1 lit. a** (Transparenz — wir
informieren unzutreffend), und gegenüber dem Handwerker als Verantwortlichem
eine **Verletzung der AVV-Zusage** nach Art. 28 Abs. 3 lit. g.

Erschwerend: Der Nutzer bekommt eine E-Mail, die ihm die Löschung bestätigt. Er
hat damit keinen Anlass, nachzufassen — und wir haben eine schriftliche,
unzutreffende Bestätigung in seinem Postfach.

### Empfehlung

Cronjob, der Konten mit `deleted_at` älter als 30 Tage vollständig entfernt:
`quotes`, `quote_items`, `customers`, `companies`, die Extraktions-Caches, den
Auth-Nutzer und die Storage-Objekte (Logos, Briefpapier, Baustellenfotos).
Handelsrechtlich aufbewahrungspflichtige Unterlagen nach § 257 HGB / § 147 AO
gehören dabei in einen definierten, gesonderten Bestand — nicht als Begründung
dafür, einfach alles zu behalten.

Bis der Job läuft, ist die ehrlichere Formulierung: „Ihre Daten werden nach
30 Tagen gelöscht" **erst schreiben, wenn es stimmt**.

**Ein Detail für Platform Engineering:** Die Bestätigungs-E-Mail sollte
sprachlich zwischen „Konto deaktiviert, Rückholung bis TT.MM. möglich" und der
späteren tatsächlichen Löschung unterscheiden. Das ist ehrlicher und
gleichzeitig besser für die Rückgewinnung.

---

## CC-03 🟠 — Die Meldefrist im AVV ist falsch herum konstruiert

`/avv` § 5, letzter Spiegelstrich:

> „Benachrichtigung des Verantwortlichen bei Sicherheitsvorfällen **innerhalb
> von 72 Stunden**"

Das klingt nach der bekannten Frist, verwechselt aber zwei Rollen. Die 72
Stunden aus Art. 33 Abs. 1 sind das Budget, das der **Verantwortliche**
gegenüber der Aufsichtsbehörde hat. Der **Auftragsverarbeiter** schuldet nach
Art. 33 Abs. 2 eine Meldung an den Verantwortlichen **unverzüglich** — ohne
feste Stundenzahl, aber ohne schuldhaftes Zögern.

Nehmen wir uns selbst 72 Stunden, ist das Budget des Handwerkers vollständig
aufgebraucht, bevor er überhaupt erfährt, dass etwas passiert ist. Er kann
seine eigene Pflicht dann nur noch verspätet erfüllen — und zwar wegen einer
Klausel, die wir ihm gestellt haben. Marktüblich und für den Verantwortlichen
brauchbar sind **24 bis 48 Stunden**.

**Vorschlag:** „Benachrichtigung des Verantwortlichen über Verletzungen des
Schutzes personenbezogener Daten unverzüglich, spätestens innerhalb von 24
Stunden nach Kenntniserlangung, mit allen Angaben nach Art. 33 Abs. 3 DSGVO."

Formulierung braucht Sandys Freigabe (AVV-Text = rechtliches Risiko).

---

## CC-04 🟡 — Der AVV widerspricht sich bei den Unterauftragnehmern

`/avv` § 3 verpflichtet uns zum „Einsatz von Unterauftragnehmern nur mit
**vorheriger Genehmigung** des Verantwortlichen". § 4 erteilt zwei Absätze
später eine **pauschale Generalgenehmigung** für sechs namentlich genannte
Dienstleister.

Beides zusammen geht nicht. Nach Art. 28 Abs. 2 DSGVO ist eine allgemeine
Genehmigung zulässig — dann aber **muss** der Verantwortliche über beabsichtigte
Änderungen informiert werden und ein **Einspruchsrecht** haben. Genau diese
zwei Elemente fehlen. Damit ist die Konstruktion in ihrer jetzigen Form
unvollständig, und § 3 macht sie zusätzlich widersprüchlich.

Das ist der klassischste aller DPA-Fehler und in jeder Prüfliste der erste
Punkt. Praktisch relevant wird er, sobald wir einen Dienstleister wechseln —
zum Beispiel von Groq zu einem anderen Transkriptionsanbieter.

**Vorschlag:** § 3 auf „allgemeine Genehmigung nach Maßgabe von § 4" umstellen
und § 4 um zwei Sätze ergänzen: Information über beabsichtigte Änderungen mit
angemessener Vorlauffrist (üblich 30 Tage, per E-Mail und auf der
AVV-Seite), Einspruchsrecht des Verantwortlichen mit Sonderkündigungsrecht,
falls wir am Wechsel festhalten.

**Zusätzlich fehlt im AVV, was Art. 28 Abs. 3 sonst noch verlangt:** die
ausdrückliche Zusicherung, dass Unterauftragnehmer dieselben Pflichten
vertraglich auferlegt bekommen und dass wir für sie einstehen. § 3 nennt das
nicht.

---

## CC-05 🟡 — Der Datenexport ist für Art. 15 und 20 unvollständig

`src/app/api/account/export/route.ts` exportiert zwei Tabellen als CSV
(`customers`, `quotes`) und schickt sie per E-Mail an die Kontoadresse.

Dass es den Endpunkt überhaupt gibt, ist mehr, als die meisten haben. Für eine
vollständige Auskunft nach Art. 15 fehlen aber:

- die **Betriebsdaten** selbst (`companies` — Firmenname, Adresse,
  Steuernummer, IBAN, Einstellungen),
- die **Positionen** der Angebote (`quote_items`) — ohne sie ist der Export
  inhaltlich leer, weil die eigentliche Leistung dort steht,
- die **Sprach-Transkripte und Extraktionsdaten** (`extraktion_roh`,
  `extraktion_final`, die Caches, `debug_extraktion_roh`) — das sind
  personenbezogene Daten, und für sie interessiert sich ein Auskunftsersuchen
  in der Praxis besonders,
- die **Baustellen** und hochgeladenen Dateien,
- die **Begleitinformationen** nach Art. 15 Abs. 1 lit. a–h: Zwecke,
  Empfänger, Speicherdauer, Herkunft, Hinweis auf Beschwerderecht. Eine
  CSV-Datei allein erfüllt Art. 15 nicht.

Für Art. 20 (Datenübertragbarkeit) ist CSV ein tauglich strukturiertes,
maschinenlesbares Format — das passt.

**Der Punkt, der mir am wichtigsten ist:** Ein Auskunftsersuchen kann auch von
einem **Endkunden eines Handwerkers** kommen, der bei uns gar kein Konto hat.
Für dessen Daten sind wir Auftragsverarbeiter; wir dürfen und sollen nicht
selbst Auskunft erteilen, sondern müssen die Anfrage an den Handwerker
weiterleiten und ihn unterstützen (Art. 28 Abs. 3 lit. e). **Dieser Prozess
existiert nicht — es gibt nicht einmal eine Festlegung, wer solche E-Mails an
`hallo@sofortangebot.app` bearbeitet und in welcher Frist.** Bei einem
Ein-Personen-Unternehmen ist das kein Organigramm-Thema, sondern eine
Merkzettel-Frage: 30 Tage Frist, Verlängerung um zwei Monate möglich, aber nur
mit Begründung innerhalb des ersten Monats.

---

## CC-06 🟡 — Transkripte werden dauerhaft gespeichert, die Datenschutzerklärung sagt das nicht

Die Datenschutzerklärung, Abschnitt 2 „Spracheingaben":

> „Aufgenommene Spracheingaben werden zur Transkription an Groq übermittelt und
> unmittelbar danach gelöscht. Wir speichern keine Audiodateien."

Das stimmt — für die **Audiodateien**. Was daraus entsteht, bleibt jedoch
dauerhaft:

- `quotes.extraktion_roh` und `quotes.extraktion_final` (jsonb) — die rohe
  GPT-Struktur vor und nach der Nachbearbeitung, angelegt am 07.08.
- `voll_extraktion_cache`, `kombinierte_extraktion_cache`
- `debug_extraktion_roh` (siehe CC-01)

Die AGB sagen es in § 8.3 zutreffend („nur das Transkript und die daraus
erzeugten Positionen werden in der Datenbank abgelegt"), die
Datenschutzerklärung nicht. Da die Datenschutzerklärung das Dokument nach
Art. 13 ist, ist die Lücke dort relevant — und die Formulierung „unmittelbar
danach gelöscht" liest sich so, als bliebe nichts übrig.

**Zwei Dinge:** Abschnitt 2 um einen Satz ergänzen, der Transkript und
Extraktionsdaten benennt, und für diese Daten eine **Löschfrist** festlegen.
Die Caches brauchen keine unbegrenzte Lebensdauer; die Debug-Rohdaten
überhaupt keine.

---

## CC-07 🟡 — Verarbeitungsverzeichnis und DSFA-Schwellwertanalyse fehlen

**Art. 30 Verzeichnis:** existiert nicht. Die Ausnahme für Unternehmen unter
250 Beschäftigten greift **nicht**, weil die Verarbeitung nicht nur
gelegentlich erfolgt (Art. 30 Abs. 5). Das Verzeichnis ist damit Pflicht und
auf Anforderung binnen kurzer Frist vorzulegen.

Der Aufwand ist überschaubar, weil das Material verstreut schon existiert: Die
Datenschutzerklärung nennt Zwecke und Rechtsgrundlagen, der AVV nennt
Datenarten und Unterauftragnehmer, CoS-P-001 hat die 22 Tabellen erfasst. Es
zusammenzuziehen ist ein halber Tag.

**Art. 35 DSFA:** Ich habe geprüft, ob eine Datenschutz-Folgenabschätzung
verpflichtend ist. Die Muss-Listen der deutschen Aufsichtsbehörden führen
Sprachverarbeitung nicht auf; einschlägig wären am ehesten „KI-Systeme zur
Bewertung oder Vorhersage persönlicher Aspekte" — das trifft auf uns nicht zu,
weil wir Flächen berechnen und keine Personen bewerten. Es gibt keine
Verarbeitung besonderer Kategorien, kein Profiling, keine systematische
Überwachung, und der Umfang ist klein.

**Mein Ergebnis: eine DSFA ist nicht erforderlich.** Aber: Steht eine
Verarbeitung nicht auf der Liste, heißt das nicht automatisch, dass keine DSFA
nötig ist — es ist dann eine individuelle Risikobewertung durchzuführen, die
sogenannte **Schwellwertanalyse, und die ist dokumentationspflichtig**. Sie
umfasst zwei Seiten und ist genau die Art Dokument, nach der eine Behörde als
erstes fragt. Ich schreibe sie zusammen mit dem Verzeichnis.

---

## CC-08 🟡 — KI-Kompetenz nach Art. 4 AI Act, seit Februar 2025 in Kraft

Übersehen wird dieser Artikel fast immer, weil die Aufmerksamkeit bei den
Transparenzpflichten liegt. **Art. 4 der KI-Verordnung gilt bereits seit dem
02.02.2025** — mehr als anderthalb Jahre — und richtet sich an Anbieter *und*
Betreiber von KI-Systemen. Verlangt wird, dass das eigene Personal und
sonstige Personen, die in unserem Auftrag mit KI-Systemen umgehen, über ein
ausreichendes Maß an KI-Kompetenz verfügen: Verständnis für Funktionsweise,
Chancen, Risiken und mögliche Schäden.

Für ein Einzelunternehmen ist das kein Schulungsprogramm. Es ist eine
Dokumentationsaufgabe von zwei Stunden: festhalten, welche KI-Systeme wir
einsetzen (Whisper/Groq zur Transkription, GPT-4o zur Extraktion), welche
Risiken bekannt sind (Fehlextraktion, Halluzination von Positionen — beides in
`pruefmeister-testfaelle.md` reichlich belegt), welche Maßnahmen dagegen
bestehen (deterministische Rechen-Engine, Prüfpflicht des Nutzers,
QA-Testfälle), und wer davon Kenntnis genommen hat.

**Nebeneffekt, der den Aufwand rechtfertigt:** Dieses Dokument ist zugleich der
beste Beleg für den Sorgfaltsmaßstab, wenn es je um Haftung für einen
KI-Rechenfehler geht (vgl. `legal-001-bestandsaufnahme.md`, A5). Es ist damit
weniger Pflichtübung als Absicherung.

---

## CC-09 ✅ — Punkte, die geprüft und in Ordnung sind

Damit klar ist, was **nicht** offen ist:

| Prüfpunkt | Ergebnis |
|---|---|
| **Datenschutzbeauftragter** (Art. 37 DSGVO, § 38 BDSG) | **Nicht erforderlich.** Unter 20 Personen mit ständiger automatisierter Verarbeitung; keine Kerntätigkeit mit umfangreicher Verarbeitung besonderer Kategorien; keine umfangreiche systematische Überwachung |
| **DSFA** (Art. 35) | Nicht erforderlich — Schwellwertanalyse ist aber zu dokumentieren, siehe CC-07 |
| **Datenlokalisierung** | Datenbank in Frankfurt. Für die US-Dienste greifen SCC bzw. DPF — die Belege fehlen noch (L2), die Konstruktion ist aber tragfähig |
| **Cookie-Einwilligung** (§ 25 TDDDG) | **Erfüllt.** Nur Session-Cookies, kein Tracking, keine Analyse. Der Banner ist informativ, nicht einwilligungsbasiert — korrekt so |
| **Zugriffstrennung** | 22 Tabellen direkt auf der Datenbank geprüft, 21 korrekt, die 22. behoben. Zusätzlich 19 Service-Rollen-Stellen durchgesehen. Deutlich mehr als üblich |
| **Passwortsicherheit** | Leak-Protection in beiden Umgebungen aktiv |
| **BFSG** | Nicht anwendbar (B2B, zusätzlich Kleinstunternehmen-Ausnahme) |
| **PAngV** | Erfüllt — Verbraucher erhalten Bruttopreise, Unternehmer netto, automatisch nach Kundentyp |
| **Ausländische Datenschutzregime** | Nicht anwendbar mangels Marktbezug |

---

## CC-10 ℹ️ — E-Rechnung: hier sind wir voraus

Kein Befund, sondern eine Einordnung, weil im Repo bereits
`api/pdf/xrechnung`, `lib/zugferd/generateXML.ts` und `embedXML.ts` liegen und
Nummernkreise für „Rechnung" vorbereitet sind, während `dokument_typ` nur
„angebot" und „kostenvoranschlag" kennt.

Der deutsche Zeitplan: **Empfangspflicht** für inländische B2B-Umsätze seit
01.01.2025. **Ausstellungspflicht** ab 01.01.2027 für Unternehmen mit über
800.000 € Vorjahresumsatz, ab 01.01.2028 für alle übrigen. **Gegenüber
Privatkunden gilt sie nicht** — weder jetzt noch später. Kleinunternehmer nach
§ 19 UStG sind vom **Versand** dauerhaft befreit, müssen aber empfangen können.

Für unsere Zielgruppe heißt das: Die meisten Maler- und Bodenlegerbetriebe
rechnen überwiegend gegenüber Privatkunden ab und sind dort nie betroffen; für
gewerbliche Auftraggeber wird es 2028 relevant. **Wir haben die Technik, bevor
der Bedarf da ist.** Zwei Hinweise für den Zeitpunkt, an dem der
Rechnungsteil scharf geschaltet wird: Dann gelten § 14 UStG (Pflichtangaben)
und die GoBD (Unveränderbarkeit, Aufbewahrung, Verfahrensdokumentation) — das
ist ein eigener Compliance-Block, den ich rechtzeitig aufsetze. Und bis dahin
sollte der AVV § 1 nicht „Angebots- **und Rechnungserstellung**" als Zweck
nennen, weil wir das noch nicht tun.

---

## Anforderungen im Überblick

| # | Anforderung | Status | Was zu tun ist |
|---|---|---|---|
| 1 | Art. 33 Abs. 5 — Vorfall dokumentieren | **Nicht erfüllt** | CC-01: Fakten feststellen, bewerten, ablegen |
| 2 | Art. 33 Abs. 1/2 — Meldung, falls geschuldet | **Unbekannt** | CC-01: erst nach Faktenlage entscheiden |
| 3 | Art. 5 Abs. 1 lit. e — Speicherbegrenzung | Nicht erfüllt | `debug_extraktion_roh` löschen, Fristen für Caches |
| 4 | Art. 17 — Recht auf Löschung | Nicht erfüllt | CC-02: Löschjob bauen |
| 5 | Art. 5 Abs. 1 lit. a — Transparenz | Nicht erfüllt | CC-02, CC-06: Texte an die Realität angleichen |
| 6 | Art. 28 Abs. 2 — Unterauftragnehmer | Nicht erfüllt | CC-04: AVV §§ 3 und 4 angleichen |
| 7 | Art. 33 Abs. 2 — Meldefrist im AVV | Nicht erfüllt | CC-03: „unverzüglich, spätestens 24 h" |
| 8 | Art. 15 — Auskunft vollständig | Teilweise | CC-05: Export ergänzen, Begleitinfos beilegen |
| 9 | Art. 28 Abs. 3 lit. e — Anfragen von Endkunden | Nicht erfüllt | CC-05: Weiterleitungsprozess festlegen |
| 10 | Art. 30 — Verzeichnis | Nicht erfüllt | CC-07 |
| 11 | Art. 35 — Schwellwertanalyse | Nicht erfüllt | CC-07 |
| 12 | Art. 13 — Auftragsverarbeiter vollständig | Nicht erfüllt | G1: OpenAI und Sentry ergänzen |
| 13 | Art. 44 ff. — Drittlandbelege | Nicht erfüllt | L2: DPF-Status je Anbieter, AVVs ablegen |
| 14 | AI Act Art. 4 — KI-Kompetenz | Nicht erfüllt | CC-08 |
| 15 | AI Act Art. 50 — Transparenz | Offen | S-3, Positionierung Sandy |
| 16 | § 25 TDDDG, PAngV, BFSG, DSB-Pflicht | **Erfüllt / nicht anwendbar** | — |

---

## Empfohlene Reihenfolge

1. **CC-01 — Fakten zum Augustvorfall feststellen und dokumentieren.** Vor
   allem anderen. Die Dokumentationspflicht läuft seit fünfzehn Tagen.
   Zusätzlich: `debug_extraktion_roh` in Produktion löschen.
2. **CC-02 — Löschjob bauen.** Solange er fehlt, steht in drei Dokumenten und
   einer E-Mail an jeden Nutzer etwas Unzutreffendes.
3. **G1 (aus CoS-L-001) — OpenAI und Sentry in die Datenschutzerklärung.**
   30 Minuten, und der Widerspruch zur eigenen AVV-Seite ist weg.
4. **CC-03 und CC-04 — AVV korrigieren.** Beide brauchen Sandys Freigabe, weil
   AVV-Text rechtliches Risiko ist.
5. **CC-07 — Verzeichnis und Schwellwertanalyse.** Ein halber Tag, danach sind
   wir bei einer Behördenanfrage auskunftsfähig.
6. **CC-05, CC-06, CC-08.** Kein Zeitdruck, aber alle klein.

**Für Gate 1 zwingend** sind aus meiner Sicht CC-01, CC-02 und G1. Alles
andere kann bis zum Launch warten — mit einer Einschränkung: CC-07 sollte
fertig sein, **bevor** der erste echte Nutzerdatensatz entsteht, weil das
Verzeichnis dann ohnehin geführt werden muss und rückwirkend zu schreiben
mühsamer ist.

---

## Freigaben

| Wer | Wofür | Status |
|---|---|---|
| **Sandy** | Bewertungsergebnis zu CC-01 und, falls einschlägig, Entscheidung über eine verspätete Meldung an die Berliner Aufsichtsbehörde | **offen — vordringlich** |
| **Sandy** | Neue AVV-Formulierungen (CC-03, CC-04) — AVV-Text ist rechtliches Risiko | offen |
| **Sandy** | Korrigierte Passagen in Datenschutzerklärung und AGB (CC-02, CC-06) | offen |
| **Platform & Integrations Engineering** | Faktenlage zum Vorfall: Dateninhalt, Zugriffslogs, betroffene Konten | **offen — Vorbedingung für CC-01** |
| **Platform & Integrations Engineering** | Löschjob (CC-02), Tabelle entfernen (CC-01) | offen |

---

## Weitere Prüfung empfohlen

**Anwaltlich, aber nicht dringend:**

- **CC-01, falls die Faktenlage eine Meldepflicht ergibt.** Eine verspätete
  Meldung an eine Aufsichtsbehörde ist nichts, was man ohne anwaltliche
  Begleitung formuliert — die Begründung der Verzögerung ist Teil der Meldung
  und wird mitbewertet. **Nur in diesem Fall**, und dann kurzfristig.
- **AVV-Neufassung insgesamt.** CC-03 und CC-04 sind die zwei sichtbaren
  Fehler; ein Fachanwalt für IT-Recht würde den Text in zwei Stunden komplett
  durchgehen. Sinnvoll gebündelt mit der AGB-Überarbeitung (L1) und der
  AI-Act-Einordnung (S-3) in einem Mandat, statt drei einzelne Fragen zu
  stellen.

**Ausdrücklich nicht erforderlich:** externe Datenschutzberatung für
Verzeichnis, Schwellwertanalyse und KI-Kompetenzdokumentation. Das sind
Standarddokumente, die ich schreibe; sie extern einzukaufen wäre gut angelegtes
Geld erst dann, wenn die Verarbeitung deutlich komplexer wird.

---

## Einordnung

Der Stand ist besser, als dieser Bericht auf den ersten Blick wirkt. Was hier
fehlt, sind fast durchweg **Prozesse und Nachweise**, nicht Bauqualität: ein
Löschjob, ein Verzeichnis, eine Vorfallsdokumentation, drei korrigierte
Absätze. Die Substanz darunter — Zugriffstrennung auf Datenbankebene, EU-Server
für die Datenbank, keine Tracker, Export- und Löschendpunkte, XRechnung vor der
Pflicht — ist für ein Einzelunternehmen ungewöhnlich weit.

Der Augustvorfall passt in dieses Bild und ist trotzdem der Grund, warum oben
„weitere Prüfung erforderlich" steht: Er wurde technisch schnell und richtig
behandelt, aber die Frage „ist das ein meldepflichtiger Vorfall?" hat niemand
gestellt, weil zu dem Zeitpunkt niemand da war, dessen Aufgabe das gewesen
wäre. Seit heute gibt es diese Rolle. Der erste Schritt ist, die Frage
nachzuholen — nicht, sie zu beantworten, indem man sie erneut nicht stellt.

---

*Head of Legal & Compliance · 2026-09-01 · nächste Überprüfung: nach Klärung
der Faktenlage zu CC-01*

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
