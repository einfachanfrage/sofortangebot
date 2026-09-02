# Dokumentation einer Verletzung des Schutzes personenbezogener Daten

**nach Art. 33 Abs. 5 DSGVO**

| | |
|---|---|
| **Interne Kennung** | VF-2026-001 (erster Eintrag im Vorfallsregister) |
| **Verantwortlicher** | Sandra Holm, Sofortangebot, Berlin |
| **Verweise** | CC-01 in `docs/legal-003-compliance-check.md` · CoS-P-001 in `docs/chief-of-staff-platform-todos.md` · `docs/platform-notiz-fuer-head-of-legal.md` |
| **Erstellt** | 2026-09-02, Head of Legal & Compliance |
| **Ergebnis** | **Keine Meldepflicht nach Art. 33 Abs. 1. Keine Benachrichtigung nach Art. 34.** Begründung unter Abschnitt 5 |
| **Status** | **abgeschlossen** — Ursachen beseitigt, Faktenlage vollständig, keine offenen Punkte |

> Diese Datei erfüllt die Dokumentationspflicht aus Art. 33 Abs. 5 DSGVO. Sie
> ist auf Verlangen der Aufsichtsbehörde vorzulegen und deshalb bewusst
> nüchtern und vollständig gehalten — auch dort, wo etwas nicht gut gelaufen
> ist.

---

## 1. Sachverhalt

**Was ist passiert.** Am **07.08.2026** wurde in der Produktionsdatenbank die
Tabelle `debug_extraktion_roh` angelegt — manuell über die Datenbank-Konsole,
nicht über eine Migration, als temporäre Hilfe zur Fehlersuche in der
KI-Extraktion. Dabei wurde die im Projekt sonst durchgängig verwendete
Zugriffsbeschränkung (Row-Level-Security) nicht aktiviert. Die Tabelle war
damit über die öffentliche REST-Schnittstelle mit der Rolle `anon` les- und
schreibbar. Der dafür nötige Schlüssel ist im ausgelieferten JavaScript der
Website enthalten und damit öffentlich bekannt.

**Welche Daten.** Rohdaten der KI-Erkennung: Sprach-Transkripte aus
Aufmaß-Diktaten und die daraus erzeugten Zwischenstrukturen. Transkripte
dieser Art können Namen und Adressen von Kunden der Handwerksbetriebe,
Objektangaben und Nebengespräche enthalten.

**Art der Verletzung.** Verletzung der Vertraulichkeit — unbefugter Zugang zu
personenbezogenen Daten wäre möglich gewesen (Art. 4 Nr. 12 DSGVO).

**Zeitraum.** 07.08.2026 bis 17.08.2026, 12:14 Uhr. **Rund 9,8 Tage.**

**Wie es entdeckt wurde.** Im Rahmen von CoS-P-001, einer beauftragten Prüfung
der Datentrennung. Der Platform & Integrations Engineer hat alle 22 Tabellen
mit Nutzerdaten direkt auf der Produktionsdatenbank per SQL geprüft, statt
sich auf den Code zu verlassen. 21 waren korrekt abgesichert; diese eine nicht.
**Der Fund ist also nicht durch Zufall oder von außen entstanden, sondern
durch eine planmäßige eigene Kontrolle.**

**Kenntniserlangung des Verantwortlichen.** 17.08.2026, im Zuge derselben
Prüfung.

---

## 2. Ergriffene Maßnahmen

| Wann | Was |
|---|---|
| 17.08.2026, 12:14 | Zugriffsbeschränkung aktiviert (RLS an, Besitzer-Regel wie bei allen anderen Tabellen), öffentlicher Zugriff entzogen, sofort verifiziert |
| 17.08.2026 | Migration `20260817180000_secure_debug_extraktion_roh.sql` nachgetragen, damit der Zustand reproduzierbar ist |
| 17.08.2026 | Zweite Runde: alle 19 Code-Stellen mit erweiterten Datenbankrechten durchgesehen; eine Stelle (`quotes/[id]/public-pdf`), die sich allein auf RLS verließ, um eine zweite unabhängige Prüfung im Code ergänzt |
| ~01./02.09.2026 | Tabelle vollständig aus der Produktionsdatenbank entfernt; der zugehörige Schreibvorgang im Code entfernt (Commit `422f14d`) |
| 02.09.2026 | Zugriffsprotokolle des gesamten Zeitraums ausgewertet (Abschnitt 3) |
| 02.09.2026 | Diese Dokumentation |

**Bewertung der Reaktion:** Die technische Behandlung war schnell und
vollständig. Zwischen Kenntnis und Schließung lagen Stunden, nicht Tage, und
die anschließende Durchsicht ging über den Einzelfall hinaus.

---

## 3. Auswertung der Zugriffsprotokolle

Supabase führt HTTP-Zugriffsprotokolle (`edge_logs`). Sie waren für den
gesamten Zeitraum 07.08. bis 17.08.2026 noch abrufbar und wurden am 02.09.2026
ausgewertet.

**Befund:**

- Ausschließlich **POST-Anfragen** — also Schreibzugriffe, mit denen der jeweils
  eingeloggte Nutzer seine eigene Zeile anlegte, jeweils mit der Rolle
  `authenticated` und gültiger Nutzer-ID im Token.
- **Keine einzige Lese-Anfrage (GET)** auf diese Tabelle im gesamten Zeitraum.
- **Keine einzige Anfrage mit der Rolle `anon`**, also kein einziger
  unangemeldeter oder öffentlicher Zugriff.

Sämtliche protokollierten Zugriffe erklären sich vollständig durch die normale
Nutzung der Anwendung durch die jeweiligen Kontoinhaber.

**Grenze der Aussagekraft, ausdrücklich festgehalten:** Die Protokolle erfassen
Zugriffe über die REST-Schnittstelle. Ein Zugriff unmittelbar über die
Datenbank-Konsole mit Administratorrechten würde dort nicht erscheinen. Solche
Rechte hatten im fraglichen Zeitraum ausschließlich die Verantwortliche selbst
und die Engineering-Session. Für den durch die Lücke eröffneten Personenkreis —
die anonyme Außenwelt — ist die Protokolllage vollständig.

---

## 4. Betroffene Personen und Daten

Die Tabelle existiert nicht mehr und konnte nicht mehr direkt abgefragt werden.
Rekonstruiert wurde über die Zugriffsprotokolle sowie die noch vorhandenen
Tabellen `companies` und `ki_usage`.

Im gesamten Zeitraum haben **genau drei Konten** Zeilen in die Tabelle
geschrieben:

| Konto | Einordnung |
|---|---|
| `sandraholm95@gmail.com` („Holm GmbH") | Konto der Verantwortlichen selbst |
| Konto `301245f9…` | Eigenes Testkonto der Verantwortlichen; am 02.09.2026 von ihr bestätigt; inzwischen gelöscht |
| Konto `2bca059b…` | ebenso |

**Kein unabhängiges Drittkonto war betroffen — und es existiert auch keines.**
Das zweite heute vorhandene Konto („Lisa Schein Malerbetrieb") ist ebenfalls ein
Konto der Verantwortlichen; sie hat das am 02.09.2026 ausdrücklich bestätigt.
Die Platform-Notiz vom selben Tag bezeichnet es als „die einzige echte dritte
Partei in der Datenbank" — das ist nach Sandys Klarstellung **unzutreffend** und
hier richtiggestellt, damit spätere Leser nicht davon ausgehen.

Unabhängig davon war dieses Konto ohnehin nicht betroffen: Es wurde am
17.08.2026 um 15:44 Uhr angelegt — **drei Stunden und dreißig Minuten nach der
Schließung der Lücke** um 12:14 Uhr — und es wurden nachweislich keine Daten für
es in die Tabelle geschrieben.

**Zum Stichtag dieser Dokumentation gibt es keinen einzigen echten Nutzer des
Produkts.** Sämtliche jemals angelegten Konten gehören der Verantwortlichen.

**Betroffene Kategorien personenbezogener Daten:** Sprach-Transkripte und
KI-Zwischenstrukturen aus Aufmaß-Diktaten der drei genannten Konten. Da alle
drei Konten der Verantwortlichen selbst zuzurechnen sind, handelt es sich um
Daten aus ihrer eigenen Nutzung und Erprobung des Systems.

**Ungefähre Zahl betroffener Personen:** eine — die Verantwortliche selbst.

---

## 5. Bewertung der Meldepflicht

**Art. 33 Abs. 1 DSGVO** verlangt eine Meldung an die Aufsichtsbehörde, es sei
denn, die Verletzung führt voraussichtlich nicht zu einem Risiko für die
Rechte und Freiheiten natürlicher Personen.

**Ergebnis: Eine Meldung ist nicht erforderlich.** Tragende Gründe:

1. **Es waren keine Daten unbeteiligter Dritter betroffen.** Alle drei
   schreibenden Konten sind der Verantwortlichen selbst zuzurechnen. Der
   einzige externe Handwerksbetrieb kam nachweislich erst nach der Schließung
   hinzu.
2. **Es gibt keinen Hinweis auf einen tatsächlichen Zugriff.** Die Protokolle
   des gesamten Zeitraums enthalten keine einzige Lese-Anfrage und keine
   einzige anonyme Anfrage auf diese Tabelle.
3. **Die Lücke war zwar öffentlich erreichbar, aber nicht auffindbar.** Ein
   Zugriff hätte die Kenntnis des Tabellennamens vorausgesetzt; die Tabelle war
   in keiner Oberfläche und in keinem ausgelieferten Code referenziert.
4. **Die Verletzung wurde durch eigene planmäßige Kontrolle entdeckt und
   innerhalb weniger Stunden geschlossen.**

**Art. 34 DSGVO** (Benachrichtigung der betroffenen Personen) setzt ein *hohes*
Risiko voraus. Ein solches liegt erst recht nicht vor. Die einzige betroffene
Person ist zudem die Verantwortliche selbst und über den Vorgang vollständig
im Bilde.

**Art. 33 Abs. 2 DSGVO** (Meldung des Auftragsverarbeiters an den
Verantwortlichen) ist nicht einschlägig, weil kein fremder Verantwortlicher
betroffen war.

---

## 6. Was nicht gut gelaufen ist

Dieser Abschnitt gehört in die Dokumentation, weil die Aufsichtsbehörde ihn
ohnehin stellen würde, und weil er die eigentliche Lehre enthält.

**Die Bewertung nach Art. 33 hat 16 Tage zu lang gedauert.** Die Lücke wurde am
17.08. erkannt und geschlossen, aber ausschließlich als Sicherheitsbefund
behandelt. Die Frage, ob es sich zugleich um eine meldepflichtige Verletzung
handelt, hat niemand gestellt. Hätte die Faktenlage anders ausgesehen — ein
echter Drittbetrieb mit echten Kundendaten —, wäre die 72-Stunden-Frist
versäumt worden. Dass das Ergebnis am Ende „nicht meldepflichtig" lautet, ist
in dieser Hinsicht Glück und kein Verdienst.

**Ursache:** Zum Zeitpunkt des Vorfalls gab es im Team keine Rolle, deren
Aufgabe diese Frage gewesen wäre. Die Position Head of Legal & Compliance
besteht seit dem 01.09.2026. Der Vorfall ist damit kein individuelles
Versäumnis, sondern eine Lücke in der Aufbauorganisation.

**Die eigentliche technische Ursache ist nicht die fehlende RLS-Regel,
sondern der Weg dorthin.** Die Tabelle wurde manuell und außerhalb jeder
Migration direkt in Produktion angelegt. Genau deshalb durchlief sie keine der
Prüfungen, die für migrierte Änderungen gelten. Bemerkenswert und unbedingt
festzuhalten: **Auch ihre Löschung Anfang September erfolgte wieder manuell
und außerhalb einer Migration** — die Platform-Notiz vermerkt ausdrücklich,
dass sich nicht mehr feststellen lässt, wer sie wann entfernt hat. Dasselbe
Muster, das den Vorfall verursacht hat, wirkt also fort. Ein Verfahren, das
diesen Weg abschneidet, ist die wirksamste Einzelmaßnahme aus diesem Vorfall.

---

## 7. Keine offenen Punkte

Die Faktenlage ist vollständig. Sandra Holm hat am 02.09.2026 bestätigt, dass
**alle** jemals in der Produktionsdatenbank angelegten Konten ihre eigenen sind
— die drei im fraglichen Zeitraum schreibenden ebenso wie das später angelegte
Konto „Lisa Schein Malerbetrieb". Echte Nutzer gibt es zum Stichtag nicht.

Damit ist der Kreis betroffener Personen abschließend bestimmt und die
Bewertung in Abschnitt 5 stützt sich auf Feststellungen, nicht auf Annahmen.

---

## 8. Maßnahmen für die Zukunft

| # | Maßnahme | Zuständig | Status |
|---|---|---|---|
| 1 | **Jeder Sicherheitsbefund, bei dem personenbezogene Daten zugänglich waren oder gewesen sein könnten, geht parallel zur technischen Behebung an Legal.** Die 72-Stunden-Frist läuft ab Kenntnis, nicht ab Behebung | alle | ab sofort verbindlich |
| 2 | **Keine manuellen Schema-Änderungen in Produktion.** Neue Tabellen entstehen über eine Migration; die Migration ist die Stelle, an der die Zugriffsbeschränkung mitgeprüft wird. Gilt ausdrücklich auch für temporäre Debug-Hilfen und für das Löschen | Platform & Integrations Engineering | vorgeschlagen |
| 3 | Automatische Prüfung, die eine Tabelle ohne aktivierte Zugriffsbeschränkung meldet — analog zu den bestehenden Hygiene-Tests für Rechtstexte und Preiskatalog | Platform & Integrations Engineering | vorgeschlagen |
| 4 | Vorfallsregister — diese Datei ist der erste Eintrag; weitere Vorfälle werden nach demselben Muster erfasst | Head of Legal & Compliance | eingerichtet |

**Zu Maßnahme 2:** Ich schlage sie als Vorschlag vor, nicht als Anweisung — ob
sie im Alltag praktikabel ist, kann Platform & Integrations Engineering besser
beurteilen als ich. Falls es Fälle gibt, in denen ein direkter Eingriff nötig
ist, wäre die Alternative, ihn zuzulassen und nachträglich verbindlich per
Migration nachzuziehen, mit Vermerk hier.

---

*Erstellt am 2026-09-02 durch Head of Legal & Compliance auf Grundlage von
`docs/platform-notiz-fuer-head-of-legal.md` (Platform & Integrations Engineer,
02.09.2026), CoS-P-001 und den Bestätigungen durch Sandra Holm vom 02.09.2026 (eigene Testkonten;
sämtliche Konten der Datenbank sind ihre eigenen, es gibt keine echten Nutzer).*

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
