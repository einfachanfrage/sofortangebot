# Empfangstest-Belege fuer Gate-1-Punkt 4.7

Drei echte, nach Norm erzeugte Testrechnungen. Sie sind **keine** Forderung,
kein Zahlungsvorgang und gehoeren nicht in die Buchhaltung — sie existieren nur,
damit der Empfangsweg mit einem echten Dokument geprueft werden kann statt mit
einer Vermutung.

| Datei | Was es ist | Wofuer |
|---|---|---|
| `xrechnung-ubl.xml` | XRechnung 3.0 (UBL 2.1), reine XML-Datei | Der Fall, der auf dem Mailweg am ehesten scheitert: viele Postfaecher filtern oder verstuemmeln `.xml`-Anhaenge. |
| `zugferd-rechnung.pdf` | ZUGFeRD / Factur-X (Profil EN 16931), PDF/A-3 mit eingebettetem CII-XML | Der haeufigste Fall in der Praxis: sieht aus wie ein PDF, traegt die Rechnung aber strukturiert im Inneren. |
| `zugferd-cii.xml` | Das eingebettete CII-XML einzeln | Zum Nachsehen und fuer Viewer-Tests. |

Beide XML-Dateien sind gegen das amtliche Schema geprueft (XSD-Pruefung beim
Einbetten bestanden), die Betraege rechnen sich auf: 300,00 netto + 57,00 USt =
357,00 brutto.

Erzeugt am 16.09.2026 vom Head of Finance im Rahmen von Punkt 4.7.
