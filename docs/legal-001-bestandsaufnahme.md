# CoS-L-001 — Bestandsaufnahme & Lückenanalyse (Recht)

**Head of Legal & Compliance · 2026-09-01 · erster Bericht der Position**

> **Kein Ersatz für anwaltliche Beratung.** Ich bin die interne juristische
> Funktion, keine zugelassene Rechtsanwältin. Alles hier ist Einschätzung und
> Formulierungsvorschlag. Drei Punkte unten (L-1 AGB-Haftung, L-4 Rechtsform/
> Versicherung, L-5 AI-Act-Positionierung) gehören vor dem Live-Gang durch
> einen externen Anwalt — die anderen sind Handwerk, das wir selbst machen
> können.

---

## Vorbemerkung: die Grundannahme des Auftrags war falsch

Der Auftrag ging von „Stand vermutlich nichts oder sehr rudimentär" aus. Das
stimmt nicht. Vorhanden und live sind:

| Was | Wo | Qualität |
|---|---|---|
| Impressum | `/impressum` | vollständig, zwei veraltete Normverweise |
| Datenschutzerklärung | `/datenschutz` (9 Abschnitte) | strukturell gut, **zwei Auftragsverarbeiter fehlen** |
| AGB | `/agb` (12 §§, versioniert `2026-06`) | inhaltlich durchdacht, **§§ 2, 9, 11 angreifbar** |
| AVV nach Art. 28 DSGVO | `/avv` | für die Größe erstaunlich vollständig |
| Cookie-Banner | `CookieBanner.tsx` | korrekt (nur essentielle Cookies) |
| AGB-Änderungs-Zustimmung | `AgbUpdateModal.tsx` | Mechanik da, Klausel dahinter wackelig |
| Widerrufsbelehrung + Musterformular | `src/lib/widerrufsbelehrung.ts`, PDF-Anhang | amtliches Muster, **eine teure Lücke** |
| Angebots-PDF | `src/lib/pdf.tsx` | Gültigkeit, Zahlungsziel, Skonto, § 19 UStG, § 650 BGB, brutto/netto nach Kundentyp |

Das ist deutlich mehr, als die meisten Solo-SaaS zum gleichen Zeitpunkt haben.
Die Lücken unten sind deshalb überwiegend Korrekturen an Vorhandenem, nicht
Neubau. **Was fehlt, ist keine Textmenge, sondern Konsistenz:** die AGB, die
AVV-Seite, die Datenschutzerklärung und die Landingpage sagen an drei Stellen
unterschiedliche Dinge über denselben Sachverhalt. Genau das ist es, was in der
Praxis abgemahnt wird — nicht ein fehlender Absatz, sondern ein Widerspruch,
den man dem Unternehmen aus seinen eigenen Texten nachweisen kann.

---

## Teil A — SaaS-/Digitalrecht

### A1. Widersprüche zwischen unseren eigenen Texten (das dringendste Thema)

**A1.1 — Zwei Auftragsverarbeiter fehlen in der Datenschutzerklärung.**
`/avv` § 4 listet OpenAI LLC als Unterauftragnehmer, AGB § 8.3 nennt
„Groq/OpenAI". Die Datenschutzerklärung Abschnitt 3 nennt **nur Groq**. OpenAI
fehlt komplett. Ebenso fehlt **Sentry** (Functional Software Inc.) — es ist
über `withSentryConfig` in `next.config.ts` aktiv eingebunden und verarbeitet
Fehlerdaten. `beforeSend` löscht zwar E-Mail, IP und Username, aber Stack
Traces und Breadcrumbs können weiterhin personenbezogene Daten enthalten; die
Nennungspflicht entfällt dadurch nicht.
→ Verstoß gegen Art. 13 Abs. 1 lit. e DSGVO. Und selbst dokumentiert: unsere
eigene AVV-Seite widerlegt unsere eigene Datenschutzerklärung.

**A1.2 — Die FAQ auf der Landingpage sagt etwas, das nicht stimmt.**
`FAQSection.tsx`, „Sind meine Kundendaten sicher?":
> „Alles liegt verschlüsselt auf Servern in Deutschland. Kein Verkauf, kein
> Tracking, kein Teilen mit Dritten. DSGVO-konform."

Die Datenbank liegt in Frankfurt — das stimmt. Aber Sprachaufnahmen gehen an
Groq (USA), Texte an OpenAI (USA), gehostet wird bei Vercel (USA), E-Mails
gehen über Resend (USA), Zahlungen über Stripe, Fehler an Sentry. „Kein Teilen
mit Dritten" ist durch unsere eigene AVV-Seite mit sechs Unterauftragnehmern
widerlegt. Das ist eine irreführende geschäftliche Handlung nach § 5 UWG —
und zwar die unangenehme Sorte, weil der Gegenbeweis zwei Klicks entfernt auf
unserer eigenen Website liegt. „DSGVO-konform" als pauschale Selbstbescheinigung
kommt erschwerend dazu.

**A1.3 — Dieselbe FAQ beschreibt die Mengenberechnung falsch.**
> „…berechnet sie: Umfang × Höhe, **Fenster und Türen abgezogen**. An jeder
> Position steht der Rechenweg — z.B. „18 lfm × 2,60 m − Fenster 1,20 m²"."

Seit der Übermessungs-Entscheidung vom 21.08. werden Öffnungen bis 2,5 m²
gerade **nicht** abgezogen (`vob-uebermessung.ts`). Das beworbene
Rechenbeispiel ist exakt der Fall, den das Produkt heute anders rechnet. Auch
das ist § 5 UWG, und es ist zusätzlich das erste, was ein unzufriedener
Endkunde findet, wenn er wissen will, warum ihm mehr Fläche berechnet wurde,
als an der Wand ist.

**A1.4 — Zwei veraltete Normverweise.** Impressum zitiert „§ 5 TMG" und
„§§ 7–10 TMG", Datenschutzerklärung „§ 25 TTDSG". Das TMG wurde am 14.05.2024
durch das **DDG** ersetzt (Impressumspflicht jetzt § 5 DDG), das TTDSG heißt
seither **TDDDG** (§ 25 TDDDG). Die Haftungsregeln der früheren §§ 8–10 TMG
stehen inzwischen im Kern in Art. 4–6 DSA; § 7 DDG verweist darauf. Der
Textbaustein „Haftung für Inhalte/Links" gehört entsprechend angepasst.
Reine Textkorrektur, aber es ist genau der Punkt, auf den Abmahnkanzleien
automatisiert scannen.

**A1.5 — Der OS-Plattform-Link im Impressum muss weg.** Die EU-Plattform zur
Online-Streitbeilegung wurde zum **20.07.2025** eingestellt (Verordnung (EU)
2024/3228 hebt die ODR-Verordnung auf). Ein Link auf eine tote Pflichtangabe
ist selbst abmahnfähig. Der Satz „Wir sind nicht bereit oder verpflichtet, an
Streitbeilegungsverfahren … teilzunehmen" kann bleiben, der Absatz darüber
nicht.

### A2. Die B2B-Beschränkung existiert nur auf dem Papier

AGB § 1.2: „richtet sich ausschließlich an Unternehmer im Sinne des § 14 BGB.
Die Nutzung durch Verbraucher ist ausgeschlossen." Die Registrierung
(`src/app/(auth)/register/page.tsx`) fragt danach **nicht**. Es gibt eine
AGB-Checkbox, sonst nichts.

Das ist mehr als ein Formfehler. Die Unternehmereigenschaft ist objektiv zu
bestimmen — eine AGB-Klausel kann sie nicht herbeischreiben. Registriert sich
jemand, der bei objektiver Betrachtung Verbraucher ist (der Meister, der sich
privat anmeldet, bevor der Betrieb existiert; der Nebenerwerbler), gilt für
ihn der ganze Verbraucherschutz-Stack:

- **§ 312g BGB** — 14 Tage Widerrufsrecht auf das Abo. Ohne Belehrung
  verlängert sich die Frist auf 12 Monate + 14 Tage.
- **§ 312j Abs. 3 BGB** — Button-Lösung („zahlungspflichtig bestellen").
  Fehlt sie, kommt der Vertrag **gar nicht zustande** — kein Zahlungsanspruch.
- **§ 312k BGB** — Kündigungsbutton. Der FAQ verspricht „einfach in den
  Einstellungen auf Kündigen klicken", einen normkonformen Kündigungsbutton
  konnte ich im Code nicht finden.

Beide Normen gelten ausschließlich gegenüber Verbrauchern — solange die
B2B-Beschränkung tatsächlich greift, sind wir sauber. Der Fix ist billig: eine
Pflicht-Checkbox „Ich melde mich als Unternehmer (§ 14 BGB) an" mit Speicherung
von Zeitstempel und Version. Das kostet eine Stunde und nimmt ein ganzes
Regelwerk aus dem Risiko.

Nebenbei: Der Satz „Ich habe die AGB **und die Datenschutzerklärung** gelesen
und akzeptiere sie" ist eine verbreitete, aber falsche Konstruktion. Eine
Datenschutzerklärung ist Information nach Art. 13 DSGVO, keine Einwilligung —
sie wird nicht „akzeptiert". Das Vermischen kann eine Verarbeitung, die auf
Art. 6 Abs. 1 lit. b beruht, fälschlich als einwilligungsbasiert erscheinen
lassen. Besser: AGB akzeptieren (Checkbox), Datenschutzerklärung nur verlinken
(„Wie wir deine Daten verarbeiten, steht in der Datenschutzerklärung").

Erfreulich: Das **BFSG** (seit 28.06.2025) greift bei reiner B2B-Dienstleistung
nicht, und selbst wenn Verbraucher dazukämen, dürfte die
Kleinstunternehmen-Ausnahme (< 10 Beschäftigte, ≤ 2 Mio. € Umsatz) tragen.
Kein Handlungsbedarf, aber ein Grund mehr, die B2B-Grenze durchzusetzen.

### A3. Die DPF-Behauptung ist eine ungedeckte Tatsachenbehauptung

Datenschutzerklärung Abschnitt 4: „Alle genannten Anbieter sind im Data Privacy
Framework zertifiziert oder haben entsprechende Garantien getroffen."

Nach meiner Recherche weisen **Vercel, Resend und Sentry** eine DPF-Zertifizierung
selbst aus; bei **Groq, OpenAI und Supabase** habe ich in deren eigenen
Datenschutzerklärungen keine eigene DPF-Zertifizierung gefunden (Supabase
verweist auf Standardvertragsklauseln). Die amtliche DPF-Liste ist eine
JavaScript-Anwendung und war für mich nicht maschinell abfragbar — ich konnte
den Status also **nicht abschließend verifizieren**, und genau das ist das
Problem: wir behaupten in einem Pflichtdokument etwas, das wir nicht belegt
haben.

Der saubere Weg: pro Anbieter DPF-Status auf dataprivacyframework.gov prüfen
und den Nachweis ablegen; wo keine Zertifizierung besteht, den AVV mit
Standardvertragsklauseln herunterladen und archivieren. Die Formulierung wird
dann konkret statt pauschal („Vercel, Resend und Sentry sind im DPF
zertifiziert; für Groq, OpenAI und Supabase stützen wir die Übermittlung auf
Standardvertragsklauseln nach Art. 46 Abs. 2 lit. c DSGVO"). Das ist Fleißarbeit
von etwa zwei Stunden und sie bringt uns gleichzeitig die AVV-Sammlung, die wir
für Art. 28 Abs. 3 DSGVO ohnehin brauchen.

Weiterer Punkt: Die AVV-Seite behauptet in § 5 „verschlüsselte Speicherung
(AES-256)" und „tägliche automatische Datenbankbackups". Das sind zusicherbare
Tatsachen gegenüber unseren Nutzern. Bitte einmal von Platform &
Integrations Engineering bestätigen lassen, dass beides tatsächlich so
konfiguriert ist — eine unzutreffende TOM-Zusage ist ein Garantieversprechen
und hebelt jede Haftungsbegrenzung aus.

### A4. Wo muss auf den KI-Einsatz hingewiesen werden?

Der Auftrag stellt das ausdrücklich als offene Frage. Meine Einschätzung, in
drei Ebenen getrennt, weil die Antwort je Ebene anders ausfällt:

**Ebene 1 — Landingpage und Produkt gegenüber dem Handwerker: ja, und das ist
unstrittig.** Der Nutzer muss wissen, dass eine KI beteiligt ist, weil daran
seine eigene Prüfpflicht hängt. Faktisch ist das erfüllt (AGB § 2.1, § 10.2,
„KI-gestützt" in der Kommunikation), es ist nur nirgends an der Stelle sichtbar,
wo es zählt — nämlich im Entwurf, unmittelbar vor dem Absenden. Siehe R3 unten.

**Ebene 2 — AI Act: rechtlich unklar, praktisch beherrschbar.**
Art. 50 der KI-Verordnung gilt **seit dem 2. August 2026**, also seit einem
Monat — das ist keine Zukunftsfrage mehr. Die Fallgruppen im Einzelnen:

- Abs. 1 (Interaktion mit natürlichen Personen / Chatbot): greift nicht, der
  Nutzer weiß, dass er ein Kalkulationswerkzeug bedient.
- Abs. 3 (Emotionserkennung, biometrische Kategorisierung): greift nicht.
- Abs. 4 Deepfakes: greift nicht. Abs. 4 Text: greift nicht — Handwerker-
  angebote sind keine „Information der Öffentlichkeit über Angelegenheiten von
  öffentlichem Interesse".
- **Abs. 2** (maschinenlesbare Kennzeichnung synthetischer Inhalte) erfasst
  ausdrücklich auch **Text**, nicht nur Bild/Audio/Video. Das ist die einzige
  ernsthaft diskutable Fallgruppe.

Meine Position zu Abs. 2: **wahrscheinlich nicht einschlägig**, aber nicht
sicher. Argumente dagegen: Die Zahlen entstehen deterministisch in unserer
eigenen Rechen-Engine (`maler.ts`, `vob-uebermessung.ts`), nicht im Modell —
die KI extrahiert Maße aus Sprache, sie erfindet keine Flächen. Positionstitel
und Mengen sind strukturierte Daten, kein „synthetischer Inhalt" im Sinne der
Norm, die auf Inhalte zielt, die mit authentischen verwechselt werden könnten.
Und die Pflicht trifft den *Anbieter*; ob wir gegenüber Groq/OpenAI Anbieter
eines eigenen KI-Systems oder Betreiber eines fremden Modells sind, ist eine
Einzelfallfrage. Argument dafür: Wir bringen das System unter eigenem Namen in
Verkehr, und der Wortlaut nennt Text ohne Einschränkung.

**Empfehlung:** nicht darauf verlassen, dass wir draußen sind — aber auch
nicht als Kennzeichnungsfall behandeln. Der Aufwand für die pragmatische
Absicherung ist gering (Hinweis im Produkt, Absatz in den AGB, kurze
Einordnung als Aktenvermerk), und wir sind damit sowohl bei Abs. 2 als auch
bei § 5 UWG auf der sicheren Seite. **Das ist ein Positionierungsthema und
braucht Sandys Freigabe (→ S-3), und es ist der eine Punkt, bei dem ich
zusätzlich anwaltliche Bestätigung empfehle**, weil ein Irrtum hier
bußgeldbewehrt ist.

**Ebene 3 — gegenüber dem Endkunden des Handwerkers: nein, und ich rate
ausdrücklich davon ab.**

Das ist die schwierigste der drei Fragen und ich sage bewusst nein:

- Es gibt keine Rechtsgrundlage dafür. Das Angebot ist die eigene
  Willenserklärung des Handwerkers (§ 145 BGB). Er prüft es, unterschreibt es
  und macht es sich damit zu eigen — womit er kalkuliert hat, ist rechtlich so
  irrelevant wie die Frage, ob er Excel oder einen Taschenrechner benutzt hat.
  Der AI Act adressiert den Handwerker nicht: er bringt kein KI-System in
  Verkehr, und Art. 50 Abs. 4 erfasst diesen Fall nicht.
- Ein Vermerk „KI-generiert" auf dem PDF würde aktiv schaden. Er relativiert
  die Erklärung, die gerade verbindlich sein soll, und lädt den Endkunden ein,
  bei jedem Streit zu argumentieren, das Angebot sei nicht ernstlich abgegeben
  worden. Wir würden ein Haftungsrisiko erzeugen, das ohne den Hinweis nicht
  besteht.
- Es widerspricht dem Produktversprechen. Der Handwerker kauft ein Werkzeug,
  das ihm Arbeit abnimmt — nicht eines, das seine Angebote als maschinell
  markiert.

**Was der Endkunde stattdessen erfahren muss, ist etwas ganz anderes: wie die
Fläche zustande kommt.** Das ist die echte Transparenzpflicht in diesem
Dreieck, und die ist heute nicht erfüllt — siehe B1. Auf die Rechenmethode
hinweisen, nicht auf das Werkzeug.

### A5. Haftung bei KI-Rechenfehlern — wie weit trägt der Disclaimer?

Der Auftrag fragt, wie weit ein Disclaimer trägt und was nicht. Die kurze
Antwort: **der aktuelle Disclaimer trägt schlechter als ein engerer es täte.**

**Das Schadensszenario.** Die Engine berechnet 15 % zu wenig Fläche. Der
Handwerker prüft flüchtig, schickt das Angebot, der Kunde nimmt an. Das Angebot
ist jetzt bindend — die Differenz trägt der Handwerker. Ein Einzelfall liegt
bei einigen hundert Euro. Das eigentliche Risiko ist nicht der Einzelfall,
sondern der systematische Fehler: eine falsche Regel oder ein
Erschwerniszuschlag, der nicht auslöst, wirkt auf alle Angebote aller Nutzer
gleichzeitig, bis er auffällt. Genau diese Klasse Fehler ist in
`pruefmeister-testfaelle.md` mehrfach dokumentiert (PM-024: Erschwerniszuschlag
Höhe erschien über vier Nachtests hinweg nicht; PM-028: Wandflächen-Grundpreis
11,50 € statt 9,50 €).

**Wo die AGB halten.** § 9.1 und § 9.2 sind handwerklich korrekt aufgebaut
(unbeschränkt bei Vorsatz/grober Fahrlässigkeit und Personenschäden, sonst
Kardinalpflichten-Begrenzung). § 10.2 mit der ausdrücklichen Prüfpflicht des
Nutzers ist gut und wichtig.

**Wo sie nicht halten.** § 9.3 schließt Haftung „für inhaltliche Fehler in
KI-generierten Angeboten oder Preisen" pauschal aus. Diese Klausel hat drei
Probleme, und sie verstärken sich gegenseitig:

1. Sie widerspricht § 9.1. Nach ihrem Wortlaut gilt sie auch bei Vorsatz und
   grober Fahrlässigkeit. Solche Klauseln sind nach § 307 BGB unwirksam — auch
   im B2B, weil § 309 Nr. 7 über § 307 ausstrahlt.
2. Es gibt **keine geltungserhaltende Reduktion**. Eine zu weit gefasste
   AGB-Klausel wird nicht auf ihren zulässigen Kern zurückgeschnitten, sondern
   fällt **ganz** weg. Ausgerechnet die Klausel, die das KI-Risiko abfangen
   soll, ist damit die wahrscheinlichste Kandidatin, im Streitfall komplett zu
   entfallen. Eine engere Klausel würde mehr schützen als diese weite.
3. Richtiges Rechnen ist bei einem Kalkulationswerkzeug plausibel die
   **Kardinalpflicht** selbst. Wer sie ausschließt, höhlt den Vertragszweck
   aus (§ 307 Abs. 2 Nr. 2 BGB). Auch die 12-Monats-Deckelung in § 9.2 ist
   angreifbar, wenn sie regelmäßig unter dem vertragstypisch vorhersehbaren
   Schaden liegt — bei einem Tarif von wenigen hundert Euro im Jahr ist das
   schnell der Fall.

**Was ein Disclaimer nie abdeckt, egal wie gut formuliert:** Vorsatz und grobe
Fahrlässigkeit; Personenschäden; und **übernommene Garantien**. Der letzte
Punkt ist der, den ich hier am gefährlichsten finde: Marketingsprache wie
„schätzt keine Flächen mit KI, sondern berechnet sie" kann als Zusicherung
einer Beschaffenheit gelesen werden. **Werbetexte können eine Haftungsbegrenzung
aushebeln, die in den AGB einwandfrei formuliert ist.** Das ist ein weiterer
Grund, A1.3 ernst zu nehmen — es ist nicht nur ein UWG-Thema.

**Und der Punkt, der mir am meisten Sorge macht:** ein bekannter, dokumentierter,
nicht behobener Fehler, der trotzdem live geht, verlässt den Bereich der
leichten Fahrlässigkeit. Dort hilft keine Klausel mehr. Die
Prüfmeister-Dokumentation ist fachlich hervorragend — sie ist aber im Streitfall
auch der Nachweis, dass wir es wussten. Der Umkehrschluss ist wichtiger als er
klingt: **je sauberer wir Funde dokumentieren, desto konsequenter müssen wir sie
vor dem Live-Gang schließen oder bewusst und schriftlich als akzeptiert
markieren.**

**Was tatsächlich mehr schützt als jeder Disclaimer** (in dieser Reihenfolge):

1. **Die Prüfung des Nutzers beweisbar machen.** § 10.2 verlangt sie bereits.
   Wenn beim Freigeben ein Ereignis mit Zeitstempel, Nutzer-ID und Angebotsstand
   protokolliert wird, wird aus einer Behauptung ein Beweis — und aus § 254 BGB
   (Mitverschulden) ein Argument, das im Zweifel den ganzen Anspruch trägt.
   Das ist die mit Abstand wirksamste Einzelmaßnahme und rein technisch.
   → an Head of Product Engineering, R2 unten.
2. **Vermögensschaden-Haftpflicht für IT-Dienstleister.** Versicherung schlägt
   Klausel. Bei einem systematischen Fehler über viele Nutzer ist sie der
   einzige Schutz, der tatsächlich zahlt.
3. **Rechtsform.** Sofortangebot wird als Einzelunternehmen betrieben
   (Impressum, AGB § 1.1). Sandy haftet damit **persönlich und unbeschränkt mit
   ihrem Privatvermögen**. Beim Szenario „systematischer Rechenfehler über 200
   Betriebe" ist das existenziell und durch keine AGB begrenzbar. Eine UG oder
   GmbH vor dem ersten zahlenden Kunden kostet wenig und ändert die Risikolage
   grundlegender als jede Klausel. Das ist eine unternehmerische Entscheidung,
   keine juristische — ich lege sie aber ausdrücklich auf den Tisch (→ S-4).

---

## Teil B — Gewerke-/Baurecht

### B0. Vorab: „GOB" war vermutlich VOB (CoS-L-001 Punkt 8)

Ich habe keine baurechtliche Regelungsmaterie „GOB" gefunden, die hier passen
würde. Alles im Projekt Referenzierte (VOB/C, DIN 18363, DIN 18365) ist VOB.
Ich habe auf dieser Annahme gearbeitet. **Falls Sandy etwas anderes meinte,
bitte kurz melden** — dann prüfe ich nach. Eine denkbare Verwechslung wären die
GoBD (Grundsätze zur ordnungsmäßigen Führung und Aufbewahrung von Büchern … in
elektronischer Form). Die wären für uns tatsächlich relevant, aber als
Steuer-/Archivierungsthema (Finance), nicht als Gewerke-Thema. Ich habe sie hier
nicht behandelt.

### B1. Die Übermessungsregel — fachlich richtig, rechtlich an einer Stelle offen

**Die Umsetzung selbst ist sauber.** `vob-uebermessung.ts` prüft die
2,5-m²-Schwelle je Öffnung einzeln (nicht in Summe), was der DIN-Systematik
entspricht. Der Kommentarkopf ist präzise, der bewusst zurückgestellte Teil
(Leibungen übermessener Öffnungen dürfen nicht separat vergütet werden) ist als
offen dokumentiert statt stillschweigend übergangen. Fachlich habe ich daran
nichts auszusetzen.

**Rechtlich sind es zwei getrennte Fragen, und nur die zweite ist ein Problem.**

**Frage 1: Darf man so rechnen?** Ja. Die Übermessung bis 2,5 m² Einzelgröße
ist die branchenübliche Abrechnungsregel der VOB/C. Zwischen Unternehmern und
im öffentlichen Bau ist sie Standard.

**Frage 2: Gilt sie gegenüber dem Endkunden des Handwerkers?** Hier wird es
ernst, und die Antwort lautet: **nicht automatisch, und gegenüber einem
Verbraucher womöglich gar nicht.**

- **VOB/C gilt nicht kraft Gesetzes.** Sie muss wie AGB in den Vertrag
  einbezogen werden. Ohne Einbeziehung gilt der reine BGB-Werkvertrag — und
  dort wird die tatsächlich bearbeitete Fläche geschuldet, nicht die
  übermessene.
- **Gegenüber Verbrauchern verschärft sich das.** Nach § 305 Abs. 2 BGB
  braucht es einen ausdrücklichen Hinweis und die zumutbare Möglichkeit der
  Kenntnisnahme — bei DIN-Normen praktisch: den Text vor Vertragsschluss
  aushändigen. Die Privilegierung des § 310 Abs. 1 S. 3 BGB (VOB/B „als
  Ganzes") greift gegenüber Verbrauchern nicht, es findet volle
  Inhaltskontrolle statt.
- **Es gibt Rechtsprechung, die die Regel gegenüber Verbrauchern kippt.**
  Berichtet wird eine Entscheidung des **OLG Stuttgart vom 21.02.2008, Az.
  2 U 84/07** (Vorinstanz LG Ellwangen 4 O 95/07), wonach die
  Übermessungsklausel gegenüber einem Verbraucher nach § 307 BGB unangemessen
  benachteiligt, weil der Auftraggeber Flächen bezahlt, an denen keine Leistung
  erbracht wurde. **Belastbarkeit:** Ich habe Aktenzeichen und Gegenstand über
  Rechtsprechungs-Metadaten bestätigt, den **Volltext aber nicht eingesehen**
  (juris/IBR sind kostenpflichtig). Die Entscheidung ist außerdem von 2008 und
  keine BGH-Rechtsprechung. Ich stütze meine Empfehlung deshalb nicht auf sie
  allein, sondern auf die unstrittige Einbeziehungsfrage — die Entscheidung
  zeigt nur, dass das Risiko real ist und nicht theoretisch. **Vor einer
  Formulierung, die live geht, sollte ein Anwalt den Volltext prüfen.**

**Der konkrete Fund im Produkt.** `vobHinweistext()` erzeugt genau den Satz,
der das lösen würde — „2 Öffnungen bis 2,5 m² Einzelgröße nicht abgezogen
(3,09 m², VOB/C DIN 18363 Übermessung)". Er landet im `annahmen`-Array. Ich
habe verfolgt, wohin `annahmen` geht: nach `AngebotDetail.tsx` Zeile 2648 —
**die App-Ansicht des Handwerkers.** Ins PDF geht er nicht. `pdf.tsx` rendert
als Positionsuntertitel nur `item.description`, und die kommt aus
`waehleUntertitel()`. Auch `berechnungsweg` bleibt in der App.

**Damit sieht der Endkunde auf seinem PDF: „Wandfläche streichen — 50,00 m²".
Nachmessen ergibt 46,64 m². Ohne jede Erklärung.** Genau das ist die
Konstellation, aus der Streit entsteht — und sie ist besonders ärgerlich, weil
die richtige Erklärung bereits erzeugt wird und nur zwei Zeilen von der
richtigen Stelle entfernt liegt.

Die einzige Spur der Norm auf dem PDF ist die Zeile „Normgrundlagen: …" in
7 pt Schriftgröße und der Farbe `#BBBBBB`. Als **Einbeziehung** von AGB nach
§ 305 Abs. 2 BGB taugt das nicht — es ist ein Verweis, kein Hinweis, und in
dieser Auszeichnung ein Musterbeispiel dessen, was Gerichte als nicht
ausreichend deutlich verwerfen.

**Mein Vorschlag** (Formulierung braucht Sandys Freigabe, → S-2):

1. **Klartext-Zeile in der Positionsbeschreibung im PDF**, in normaler
   Schriftgröße, dort wo die Menge steht — nicht in der Fußzeile. Etwa:
   *„Abrechnung nach VOB/C (DIN 18363): Fenster- und Türöffnungen bis 2,5 m²
   Einzelgröße werden nicht abgezogen, da der Mehraufwand für Kanten und
   Leibungen die eingesparte Fläche ausgleicht. 2 Öffnungen (3,09 m²) sind
   entsprechend in der Fläche enthalten."* Das ist Transparenz und Werbung in
   einem: es erklärt dem Kunden, warum das fair ist.
2. **Fußtext, der die VOB/C einbezieht**, als Standard-Fußtext-Baustein für
   Betriebe, die nach VOB abrechnen wollen — mit Hinweis darauf, wo der
   Normtext zugänglich ist.
3. **Ausweg für den Zweifelsfall:** Bei einem **Pauschalfestpreis** ist die
   Frage entschärft — dann schuldet der Kunde einen Preis für ein Gewerk, nicht
   für eine Fläche, und die Übermessung ist reine interne Kalkulation. Das
   Produkt kennt bereits `dokument_typ` und die Struktur-Optionen; ein
   Pauschalpreis-Modus wäre der eleganteste Weg, das Problem für
   Verbraucherangebote strukturell zu umgehen. Das ist ein Produktthema, kein
   reines Rechtsthema → mit Head of Product Engineering und Product Designer
   klären.

Zusatzfund, dem Prüfmeister zu verdanken (PM-031): Die „So gerechnet"-Zeile im
Fassaden-Chip zeigt eine VOB-widrige Rechnung, die der tatsächlich
abgerechneten Fläche widerspricht (46,64 m² vs. 50,00 m²). Als reiner
UI-Fehler ist er kosmetisch, wie dort eingeordnet. **Rechtlich ist er es
nicht:** wenn dieselbe Fläche im selben Werkzeug mit zwei verschiedenen Zahlen
erscheint, ist das im Streitfall der Beleg dafür, dass die höhere Zahl nicht
plausibel erklärt ist. Ich unterstütze die Priorisierung als Fix nachdrücklich.

### B2. Zuschlags-/Abzugskatalog — branchenüblich, aber mit einem Datenfehler

**Rechtlich unbedenklich, was die Zuschlagsarten angeht.** Der Katalog in
`default-prices.ts` (Höhe/Gerüst, bewohnte Wohnung, schwieriger Untergrund,
enge Räume und Treppenhäuser, Feuchtraum, Brand- und Schallschutz,
Kleinflächen, Wochenend- und Feiertagsarbeit, Winterbetrieb, Denkmalschutz,
bleihaltiger Altanstrich) bildet die anerkannten Erschwernistatbestände der
ATV DIN 18299/18363/18365 ab. Zuschläge sind **frei kalkulierbar** — es gibt in
Deutschland keine verbindliche Preisverordnung für Bauhandwerk (anders als bei
HOAI-Leistungen). Die Preishöhe ist damit kein Rechtsthema, solange sie
transparent ausgewiesen wird. Was **nicht** geht, ist dieselbe Erschwernis
doppelt zu berechnen; die in PM-011 aufgeworfene Frage zur möglichen
Doppel-Erschwernis (Untergrund + Altbau neben Q2-Spachtelung) ist deshalb auch
juristisch relevant, nicht nur fachlich.

Positiv: Dass ein Erschwerniszuschlag als eigene, benannte Position mit
Prozentsatz und Bemessungsgrundlage im Angebot erscheint statt in einem
Grundpreis versteckt zu werden, ist genau richtig — versteckte Zuschläge sind
das eigentliche rechtliche Problem, offen ausgewiesene sind es nie.

**Ein konkreter Fund, der aufs Kundenangebot durchschlägt.** Mehrere
Katalogeinträge tragen einen Prozentsatz im Titel, aber eine Euro-Pauschale im
Preis:

| Eintrag | `unit` | `unit_price` | Problem |
|---|---|---|---|
| `Zuschlag Wochenend- / Feiertagsarbeit (25%)` (in 6 Gewerken) | `Pauschale` | `25.00` | 25 % ≠ 25,00 € |
| `Zuschlag Denkmalschutz / besondere Sorgfalt (30%)` | `Pauschale` | `30.00` | 30 % ≠ 30,00 € |

Auf einem Angebot steht dann „Zuschlag Wochenend-/Feiertagsarbeit (25%) ·
1 Pauschale · 25,00 €". Der Titel verspricht einen Aufschlag von 25 % auf die
Leistung, berechnet werden 25 Euro. Bei einem Auftrag über 3.000 € ist die
Differenz zwischen 750 € und 25 € erheblich — und der Endkunde hat aus dem
Wortlaut der Position einen guten Anhaltspunkt, die höhere Auslegung zu
verlangen (§§ 133, 157 BGB; bei AGB-Charakter zusätzlich § 305c Abs. 2 BGB:
Zweifel gehen zulasten des Verwenders, hier des Handwerkers). Es funktioniert
auch andersherum: rechnet der Betrieb den Titel wörtlich als Prozentsatz, ist
er 725 € über dem, was seine eigene Preisliste hergibt.

Das ist derselbe Einheiten-Bug, den Head of Product Engineering am 31.08. für
die fünf Maler-Zuschläge bereits gelöst hat (Umstellung auf `%`). Die
verbleibenden Einträge in den anderen Gewerken sind offenbar bei der Migration
übrig geblieben. Entweder auf `unit: '%'` umstellen oder den Prozentsatz aus
dem Titel entfernen — beides ist vertretbar, aber die Mischung ist es nicht.
→ an Head of Product Engineering.

### B3. Pflichtangaben auf dem Angebot — Abgleich mit dem PDF

**Vorhanden und korrekt** (`pdf.tsx`, `angebot-optionen.ts`):

| Pflicht-/Empfehlungsangabe | Status |
|---|---|
| Absender-, Empfängerdaten, Angebotsnummer, Datum | ✅ |
| Bindefrist („Gültig bis", Standard 30 Tage) | ✅ |
| Zahlungsziel (Standard 14 Tage), Skonto optional | ✅ |
| Leistungsverzeichnis mit Menge/Einheit/Einzelpreis/Gesamtpreis | ✅ |
| Netto/Brutto je nach Kundentyp | ✅ gut gelöst — Verbraucher erhalten Endpreise (PAngV), Unternehmer netto |
| Kleinunternehmerhinweis § 19 UStG | ✅ |
| Kostenvoranschlag mit Hinweis auf § 650 BGB | ✅ sehr sauber |
| Unterschriftsfeld für beide Seiten | ✅ |
| Widerrufsbelehrung + Musterformular für Verbraucher | ✅ amtliches Muster, aber siehe unten |
| Baustellenfotos als Zustandsdokumentation | ✅ eigenständig klug — hilft bei Streit über Vorschäden |

**Die teure Lücke: der Wertersatz beim Widerruf.**

Die Belehrung enthält den Standardsatz „Haben Sie verlangt, dass die Arbeiten
während der Widerrufsfrist beginnen sollen…". Auf dem PDF gibt es aber **kein
Feld, in dem der Kunde genau das erklären kann.**

Die Rechtsfolge ist unangenehm konkret: Nach § 357a Abs. 2 BGB schuldet der
Verbraucher Wertersatz für vor dem Widerruf erbrachte Leistungen nur, wenn er
den vorzeitigen Beginn **ausdrücklich verlangt** hat — bei Verträgen außerhalb
von Geschäftsräumen zusätzlich **auf einem dauerhaften Datenträger** — und
vorher über die Wertersatzpflicht informiert wurde. Fehlt das, gibt es
**keinen Wertersatz**: Der Handwerker hat drei Tage gestrichen, der Kunde
widerruft am zehnten, und der Handwerker bekommt nichts.

**Vorschlag:** ein zweites Ankreuzfeld unter der Unterschriftszeile, nur wenn
`widerrufBeilegen` greift, mit eigener Unterschrift. Etwa:

> ☐ *Ich verlange ausdrücklich, dass Sie vor Ablauf der Widerrufsfrist mit den
> Arbeiten beginnen. Mir ist bekannt, dass ich bei Widerruf Wertersatz für die
> bis dahin erbrachten Leistungen schulde.*
> \_\_\_\_\_\_\_\_\_\_\_\_ Datum, Unterschrift

Wichtig: als **freiwilliges, separates** Feld — nicht vorangekreuzt und nicht
mit der Auftragsunterschrift verbunden, sonst ist es unwirksam. Formulierung
braucht Sandys Freigabe (→ S-2).

**Zweiter Punkt zum Widerruf.** `braucheWiderrufsbelehrung()` hängt die
Belehrung an **jedes** Verbraucherangebot, wenn der Betrieb sie aktiviert hat.
Gesetzlich nötig ist sie aber nur bei Verträgen außerhalb von Geschäftsräumen
(§ 312b) oder im Fernabsatz (§ 312c). Belehrt man ohne Not, kann daraus ein
**vertraglich eingeräumtes** Widerrufsrecht werden, das der Handwerker
gesetzlich nicht schuldete. In der Praxis ist der Aufmaßtermin beim Kunden fast
immer ein Haustürgeschäft, die Voreinstellung ist also meistens richtig — aber
der Betrieb sollte es pro Angebot abwählen können (das kann er bereits,
`quote.widerruf_beilegen`). Ich würde die Bezeichnung im UI schärfen, damit
klar ist, wann man abwählen darf. Kein Blocker.

**Was fehlt, aber bewusst fehlen darf: Gewährleistung.** Auf dem PDF steht
nichts zu Mängelansprüchen. Das ist **kein Fehler** — schweigt der Vertrag,
gilt das Gesetz: fünf Jahre bei Arbeiten an einem Bauwerk (§ 634a Abs. 1 Nr. 2
BGB), sonst zwei Jahre. Eine falsche Angabe wäre schlimmer als keine. Aber
Endkunden fragen danach, und ein Betrieb, der VOB/B vereinbaren will (vier
Jahre), braucht dafür eine korrekte Einbeziehung. **Mein Vorschlag:** ein
optionaler, vorformulierter Fußtext-Baustein, den der Betrieb aktiv einschaltet
— keine Voreinstellung. Kann bis zum Launch warten.

**Kleinigkeit:** Der Standard-Schlusstext lautet „…sichern eine fachgerechte
und einwandfreie Ausführung zu." Das Wort **„zusichern"** ist juristisch
aufgeladen — es klingt nach Garantie. „…und führen die Arbeiten fachgerecht
aus" sagt dasselbe, ohne die Assoziation. Ein Wort, kein Aufwand.

---

## Reihenfolge

Der Auftrag fragt, was zwingend vor dem ersten echten Testnutzer muss und was
bis zum Launch warten kann. Ich trenne das an einer klaren Linie: **Gate 1 ist
alles, was falsch oder widersprüchlich ist und einem echten Menschen schaden
kann.** Alles, was nur unvollständig ist, kann warten.

### Gate 1 — vor dem ersten echten Testnutzer

| # | Was | Warum jetzt | Aufwand |
|---|---|---|---|
| **G1** | Datenschutzerklärung: **OpenAI und Sentry** ergänzen | Art. 13 DSGVO; unsere eigene AVV-Seite widerlegt uns | 30 Min |
| **G2** | FAQ: „Server in Deutschland / kein Teilen mit Dritten / DSGVO-konform" korrigieren | § 5 UWG, Gegenbeweis auf eigener Website | 20 Min |
| **G3** | FAQ: „Fenster und Türen abgezogen" korrigieren | § 5 UWG; beschreibt das Produkt falsch | 15 Min |
| **G4** | **Unternehmer-Checkbox** bei der Registrierung | Sonst greift der ganze B2C-Stack (§§ 312g, 312j, 312k BGB) | 1 Std |
| **G5** | Übermessungs-Hinweis **ins Kunden-PDF** | Der Endkunde zahlt Fläche, die er nicht nachmessen kann | 2 Std |
| **G6** | Wertersatz-Erklärung ins Widerrufs-PDF | Ohne sie arbeitet der Handwerker im Widerrufsfall umsonst | 2 Std |
| **G7** | OS-Plattform-Absatz aus dem Impressum löschen | Plattform seit 20.07.2025 tot, Abmahnrisiko | 5 Min |
| **G8** | § 5 TMG → § 5 DDG, § 25 TTDSG → § 25 TDDDG, §§ 7–10 TMG anpassen | Wird automatisiert abgemahnt | 30 Min |

G1–G3, G7 und G8 sind zusammen unter zwei Stunden reine Textarbeit und nehmen
den größten Teil des akuten Abmahnrisikos vom Tisch. G4 bis G6 brauchen
Engineering.

### Bis zum Launch

| # | Was |
|---|---|
| **L1** | **AGB überarbeiten**: § 9.3 eng fassen statt pauschal; § 9.2-Deckelung prüfen; § 2.2 (Verfügbarkeitsausschluss höhlt den Vertragszweck aus); § 11.2 (Zustimmungsfiktion bei AGB-Änderungen ist auch im B2B angreifbar) — **anwaltliche Prüfung empfohlen** |
| **L2** | DPF-Status je Anbieter belegen, AVVs herunterladen und ablegen, Formulierung konkretisieren; TOM-Zusagen (AES-256, Backups) technisch bestätigen lassen |
| **L3** | Verarbeitungsverzeichnis (Art. 30 DSGVO), TOM-Dokument, Löschkonzept — bei Prüfung sofort vorzulegen, existiert aktuell nicht |
| **L4** | **Rechtsform** (UG/GmbH) und **Vermögensschaden-Haftpflicht** — Sandy haftet derzeit persönlich unbeschränkt |
| **L5** | AI-Act-Positionierung festlegen und als Vermerk dokumentieren; KI-Hinweis im Produkt an der Freigabestelle |
| **L6** | Zuschlagskatalog: Prozent-im-Titel/Euro-im-Preis in den übrigen Gewerken bereinigen |
| **L7** | Kündigungsmöglichkeit im Produkt prüfen — FAQ verspricht sie, ich habe sie im Code nicht gefunden |
| **L8** | Optionaler Gewährleistungs-Baustein; „zusichern" im Schlusstext ersetzen |

### Kann warten

VOB-Leibungsregel für übermessene Öffnungen (bereits bewusst zurückgestellt,
korrekt so) · Barrierefreiheit nach BFSG (bei B2B nicht anwendbar, Ausnahme für
Kleinstunternehmen greift zusätzlich) · Verbraucher-Streitschlichtung
(Teilnahme bereits zutreffend abgelehnt) · Vollständige DIN-18365-Prüfung für
den Bodenleger-Teil (habe ich noch nicht im Detail gegen den Code geprüft —
kommt als eigener Punkt, sobald das Bodenleger-Gewerk auf demselben Stand ist
wie Maler).

---

## Für Sandy — Entscheidungen, die nur sie treffen kann

Diese vier gehören nach `docs/entscheidungen-fuer-sandy.md` (Chief of Staff
trägt sie ein). Meine Empfehlung steht jeweils dabei, die Entscheidung nicht.

| ID | Frage | Meine Empfehlung |
|---|---|---|
| **S-1** | Sollen die korrigierten FAQ-Texte (G2, G3) so live gehen, wie ich sie vorschlage? | Ja — der Text wird ehrlicher und verliert nichts an Überzeugungskraft. „Deine Kundendaten liegen in Frankfurt. Für Spracherkennung und Textverarbeitung arbeiten wir mit spezialisierten Dienstleistern — alle mit Vertrag nach Art. 28 DSGVO, keiner nutzt deine Daten für eigenes Training." |
| **S-2** | Freigabe der Endkunden-Texte im Angebots-PDF: Übermessungshinweis (G5) und Wertersatz-Erklärung (G6) | Ja, beide. Der Übermessungshinweis ist verkaufsfördernd, nicht defensiv — er erklärt dem Endkunden, warum die Rechnung fair ist. |
| **S-3** | **Positionierung KI-Kennzeichnung:** Weisen wir den Endkunden des Handwerkers auf den KI-Einsatz hin? | **Nein.** Keine Rechtsgrundlage, und es würde die Verbindlichkeit des Angebots schwächen. KI-Transparenz gehört zum Handwerker (Landingpage, Produkt, AGB), nicht auf sein Angebot. Art. 50 AI Act gilt seit 02.08.2026 — die Einordnung sollte trotzdem ein Anwalt gegenzeichnen. |
| **S-4** | **Rechtsform und Versicherung** vor dem ersten zahlenden Kunden? | Beides ja, und zwar vor dem ersten zahlenden Kunden. Kein Rechtsthema im engeren Sinn, aber die Risikolage ist bei einem KI-Kalkulationstool im Einzelunternehmen unangemessen. Kein Disclaimer ändert daran etwas. |

---

## Was ich an andere weitergebe

**An Head of Product Engineering:**
- G5 — `vobHinweistext()` erzeugt bereits den richtigen Satz, er landet nur in
  `annahmen` (nur `AngebotDetail.tsx`) statt im PDF. `pdf.tsx` rendert als
  Untertitel nur `item.description`.
- G6 — Wertersatz-Ankreuzfeld auf der Widerrufsseite des PDF.
- L6 — Prozent-im-Titel/Euro-im-Preis in `default-prices.ts` (Wochenend-/
  Feiertagszuschlag in sechs Gewerken, Denkmalschutz bei Putz).
- L7 — gibt es eine Kündigungsmöglichkeit im Produkt? Die FAQ verspricht sie.
- **R2 (wichtigste Einzelmaßnahme):** Freigabe-Ereignis mit Zeitstempel,
  Nutzer-ID und Angebotsstand protokollieren, wenn der Nutzer ein Angebot
  versendet. Das macht aus der Prüfpflicht in AGB § 10.2 einen Beweis und ist
  haftungsrechtlich mehr wert als jede Klauselverbesserung.
- Unterstützung für PM-031: die widersprüchliche „So gerechnet"-Zeile ist als
  UI-Fehler kosmetisch, im Streitfall aber ein Beleg gegen uns.

**An Product Designer:**
- **R3:** Der KI-Hinweis fehlt an der Stelle, wo er wirkt — im Entwurf,
  unmittelbar vor dem Absenden. Nicht als Warnbanner, eher als ruhiger Satz an
  der Freigabe („Aus deinem Diktat erstellt — bitte einmal prüfen, bevor es
  rausgeht"). Er stützt gleichzeitig AGB § 10.2 und die Mitverschuldens-
  Argumentation.
- Registrierung: Unternehmer-Checkbox (G4) und Entkopplung von AGB-Zustimmung
  und Datenschutz-Hinweis.

**An Platform & Integrations Engineering:**
- Bestätigung, dass die TOM-Zusagen der AVV-Seite stimmen: Verschlüsselung im
  Ruhezustand (AES-256) und tägliche Backups. Es sind zusicherbare Tatsachen
  gegenüber Nutzern.
- Vollständige Liste aller Dienste, die Daten sehen — ich bin über Code und
  Konfiguration gegangen, aber Umgebungsvariablen und Vercel-Integrationen kann
  ich von hier nicht abschließend prüfen.

**An Chief of Staff:**
- S-1 bis S-4 nach `entscheidungen-fuer-sandy.md`.
- Rückfrage zu „GOB" (B0) — vermutlich VOB, ggf. GoBD als Finance-Thema.

---

## Was mir gut gefällt

Damit der Bericht nicht nur Mängelliste ist, und weil es die Einschätzung des
Risikos verändert:

- Die AVV-Seite ist für ein Unternehmen dieser Größe überdurchschnittlich. Die
  meisten Solo-SaaS haben gar keine.
- Die Netto/Brutto-Umschaltung nach Kundentyp ist ein Detail, das viele
  etablierte Handwerkersoftware falsch macht — Verbraucher bekommen Endpreise
  nach PAngV, Unternehmer netto. Sauber gelöst.
- Der Hinweis auf § 650 BGB beim Kostenvoranschlag zeigt, dass jemand
  mitgedacht hat.
- Die Baustellenfotos im PDF sind eine eigenständig kluge Idee mit echtem
  Beweiswert bei Streit über Vorschäden.
- Die Prüfmeister-Dokumentation ist das wertvollste Compliance-Asset im
  Projekt. Sie zeigt, dass Fehler systematisch gesucht und dokumentiert werden
  — das ist genau die Sorgfalt, auf die es bei einem KI-Produkt ankommt. Sie
  ist zugleich der Grund, warum bekannte Funde vor dem Live-Gang geschlossen
  sein müssen: dokumentiert und ignoriert wiegt schwerer als nie bemerkt.

---

*Head of Legal & Compliance · CoS-L-001 · 2026-09-01*

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
