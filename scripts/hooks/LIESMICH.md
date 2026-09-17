# Git-Hooks für dieses Projekt

`.git/hooks/` liegt **nicht** im Repository — die Datei hier ist die
nachvollziehbare Fassung, aus der der Hook auf einem Rechner eingerichtet wird.

## Einrichten (einmal je Rechner / nach jedem frischen `git clone`)

```sh
cp scripts/hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

## Was der Hook tut — und was ausdrücklich nicht

`pre-commit` ruft `scripts/pruefe-unerfasste-dateien.mjs` auf und schreibt das
Ergebnis als Hinweis in die Ausgabe. **Er blockiert nichts** (`exit 0`), weder
einen Commit noch einen Push.

Das ist kein Versehen, sondern die Auflösung zweier Vorgaben von Sandy, die
gleichzeitig gelten:

* **15.09.2026:** „Ein Push darf NIE mehr blockiert werden." Ein `pre-push`,
  der anhält, ist damit ausgeschlossen — er hat am 16.09. (CoS-P-024) genau
  das getan.
* **17.09.2026:** „ja, einbauen" — die Prüfung soll wieder greifen.

Beides zusammen heißt: **die Prüfung sitzt beim Commit, wo der Fehler entsteht,
und nicht beim Push, wo Sandy steht.** Committet wird von den Rollen; eine
Rolle liest ihre eigene Ausgabe und sieht den Hinweis. Sandys Push bleibt frei.

## Warum es diesen Hook gibt

Zweimal in vier Tagen ging die Produktion an derselben Fehlerform kaputt:
eine Datei committet, die von ihr importierte zweite blieb ungebunden liegen.

* 13./14.09.2026 (CoS-P-014): 17 Stunden, acht fehlgeschlagene Deploys.
* 17.09.2026: 68 Minuten rot (11:10:49–12:19:26 UTC), `zeit-ausschluss.ts`
  committet, `satz-raum.ts` nicht.

## Regeln für die Datei selbst

* Reines ASCII, LF-Zeilenenden, **kein BOM**. Ein BOM vor der Shebang-Zeile hat
  am 16.09. dazu geführt, dass Windows den Hook nicht starten konnte und git
  Sandys Push abgebrochen hat, bevor überhaupt eine Verbindung stand
  (CoS-P-024, dieselbe Fehlerklasse wie CoS-P-026 in `ci.yml`).
* `exit 0` am Ende bleibt. Wer daraus eine Sperre macht, hebelt Sandys Vorgabe
  vom 15.09. aus.
