# Belege — Eingangsrechnungen

Hier liegen die **Originale** aller Rechnungen, die der Betrieb empfaengt.
Geregelt ist das in `docs/finance-001-verfahrensdokumentation-rechnungseingang.md`
(Verfahrensdokumentation nach GoBD).

**Drei Regeln, mehr ist es nicht:**

1. **Original hineinlegen, nichts umwandeln.** Eine ZUGFeRD-PDF wird als
   ganze Datei abgelegt, nicht "in PDF und XML zerlegt".
2. **Nichts loeschen, nichts ueberschreiben.** Falsch Abgelegtes wandert nach
   `2026/storniert/`.
3. **Dateiname:** `JJJJ-MM-TT_Lieferant_Rechnungsnummer.endung`

`eingangsbuch.csv` fuehrt der Head of Finance — dort steht zu jeder Datei eine
SHA-256-Pruefsumme, damit eine nachtraegliche Aenderung auffaellt.

**Dieser Ordner liegt bewusst ausserhalb der Versionsverwaltung** (`.gitignore`):
Lieferantenrechnungen gehoeren nicht in ein Code-Repository. Nur die
Pruefsummen-Liste ist versioniert (`docs/finance-001-hashliste.md`).

**Aufbewahrung: 8 Jahre** (§ 14b Abs. 1 UStG). Belege aus 2026 bis Ende 2034.
