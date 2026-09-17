<#
  Sofortangebot - Sicherung des Projektordners nach OneDrive
  ----------------------------------------------------------
  Angelegt am 17.09.2026 auf Sandys ausdruecklichen Wunsch (F-007).
  Grund: Der Projektordner liegt auf genau einer Festplatte. Geht die kaputt,
  ist alles weg - Code, Dokumentation UND die Eingangsrechnungen, die
  bewusst nicht auf GitHub liegen.

  Was kopiert wird:  ALLES im Projektordner ...
  Was ausgelassen wird: ... ausser 'node_modules' und '.next'.
     node_modules ist rund 2,8 GB gross, besteht aus hunderttausenden
     winziger Dateien und wird von OneDrive nur schlecht verkraftet. Es ist
     ausserdem jederzeit mit EINEM Befehl wiederherstellbar: npm install
     .next ist dasselbe in gruen - ein Bauergebnis, kein Original.
     Alles andere zusammen ist nur rund 135 MB.
  Willst du das aendern: die Zeile $Auslassen weiter unten anpassen.

  WICHTIG: Es wird nichts geloescht. Dateien, die du im Projektordner
  loeschst, bleiben in der Sicherung stehen. Das ist Absicht - eine
  Sicherung, die Loeschungen mitmacht, schuetzt nicht vor Versehen.
#>

$ErrorActionPreference = 'Stop'

# --- Quelle: der Projektordner (dieses Skript liegt in dessen Unterordner 'scripts') ---
$Quelle = Split-Path -Parent $PSScriptRoot

# --- Ziel: OneDrive ---
# Wird automatisch gesucht. Stimmt der gefundene Pfad nicht, trag ihn hier
# einfach fest ein, zum Beispiel:
#   $OneDrive = 'C:\Users\runni\OneDrive'
# Fest eingetragen am 17.09.2026: Sandy hat diesen Ordner beim Einrichten
# selbst angelegt. Fest statt automatisch gesucht, damit die Sicherung nicht
# aus Versehen im OneDrive des privaten Kontos landet.
$OneDrive = 'C:\Users\runni\OneDrive-einfachanfrage'

# Falls der Ordner mal umzieht: automatische Suche als Rueckfalloption.
if (-not (Test-Path $OneDrive)) {
    $OneDrive = $env:OneDriveConsumer
    if (-not $OneDrive) { $OneDrive = $env:OneDrive }
}

if (-not $OneDrive -or -not (Test-Path $OneDrive)) {
    Write-Host ''
    Write-Host 'ABBRUCH: Es wurde kein OneDrive-Ordner gefunden.' -ForegroundColor Red
    Write-Host 'Melde dich zuerst in der OneDrive-App an (einfachanfrage@outlook.com),'
    Write-Host 'oder trag den Pfad in diesem Skript bei $OneDrive fest ein.'
    Write-Host ''
    exit 1
}

$Ziel = Join-Path $OneDrive 'Sofortangebot-Sicherung'
$Auslassen = @('node_modules', '.next')

Write-Host ''
Write-Host 'Sofortangebot - Sicherung' -ForegroundColor Cyan
Write-Host "  von : $Quelle"
Write-Host "  nach: $Ziel"
Write-Host "  ohne: $($Auslassen -join ', ')"
Write-Host ''

if (-not (Test-Path $Ziel)) { New-Item -ItemType Directory -Path $Ziel -Force | Out-Null }

$AuslassPfade = $Auslassen | ForEach-Object { Join-Path $Quelle $_ }
$Protokoll    = Join-Path $Ziel '_sicherungs-protokoll.txt'

# /E   = alle Unterordner, auch leere
# /XD  = diese Ordner auslassen
# /R:1 /W:1 = bei einer gesperrten Datei nur einmal kurz erneut versuchen
# /NFL /NDL /NP = keine seitenlange Dateiliste in der Ausgabe
robocopy $Quelle $Ziel /E /XD $AuslassPfade /R:1 /W:1 /NFL /NDL /NP /TEE /LOG+:$Protokoll
$Code = $LASTEXITCODE

Write-Host ''
if ($Code -lt 8) {
    # -Force ist hier NICHT optional: ohne ihn ueberspringt Get-ChildItem
    # versteckte Ordner - allen voran '.git', und das ist der groesste Teil
    # der Sicherung. Am 17.09.2026 hat genau das "34 MB" gemeldet, obwohl
    # robocopy 1 GB kopiert hatte.
    $Dateien = Get-ChildItem $Ziel -Recurse -File -Force -ErrorAction SilentlyContinue
    $Groesse = ($Dateien | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host ("FERTIG. In der Sicherung liegen jetzt {0:N0} Dateien / {1:N0} MB." -f $Dateien.Count, $Groesse) -ForegroundColor Green
    Write-Host "Zeitpunkt: $(Get-Date -Format 'dd.MM.yyyy HH:mm')"

    # Uebersprungene Dateien sichtbar machen, statt sie im Protokoll zu
    # begraben. Meist sind es Dateien, die beim Kopieren gerade in Benutzung
    # waren - harmlos, aber man will es wissen.
    $Fehlzeilen = Select-String -Path $Protokoll -Pattern '^\s*\d{4}-\d{2}-\d{2}|FEHLER|ERROR' -ErrorAction SilentlyContinue |
                  Where-Object { $_.Line -match 'FEHLER|ERROR' }
    if ($Fehlzeilen) {
        Write-Host ''
        Write-Host ("Hinweis: {0} Datei(en) konnten nicht kopiert werden - meist, weil sie" -f $Fehlzeilen.Count) -ForegroundColor Yellow
        Write-Host 'gerade in Benutzung waren. Alles Uebrige ist gesichert. Einzelheiten:' -ForegroundColor Yellow
        Write-Host "  $Protokoll"
    }

    Write-Host ''
    Write-Host 'OneDrive laedt das im Hintergrund hoch. Das gruene Haekchen am'
    Write-Host 'Ordner bedeutet: wirklich oben angekommen.'
    exit 0
} else {
    Write-Host "FEHLER: robocopy hat mit Code $Code abgebrochen." -ForegroundColor Red
    Write-Host "Einzelheiten stehen in: $Protokoll"
    exit $Code
}
