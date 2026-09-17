/**
 * ── DC-111 (16.09.2026) ───────────────────────────────────────────────────
 *
 * Gemeinsamer Rahmen für alle fünf Anmelde-Seiten: Login, Registrierung,
 * Passwort vergessen, Passwort zurücksetzen, Bestätigung.
 *
 * **Der Befund:** Auf einem Desktop-Fenster (~1150 px) lief auf
 * `/passwort-vergessen` und `/passwort-reset` alles über die volle
 * Fensterbreite — Eingabefelder, der gelbe „Passwort speichern"-Knopf, der
 * Fließtext. Der Knopf war fast einen Meter breit.
 *
 * **Die Ursache war nicht auf diese zwei Seiten beschränkt.** Alle fünf
 * Dateien trugen wortgleich denselben Rahmen
 * (`min-h-dvh bg-bg flex flex-col justify-center px-5`) — an neun Stellen,
 * weil mehrere Seiten mehrere Zustände haben. Keine davon hatte eine
 * Maximalbreite. Aufgefallen ist es nur dort, wo ein Formular steht.
 *
 * Deshalb hier und nicht in zwei Dateien: Ein Rahmen, den fünf Seiten teilen,
 * gehört in das Layout, das sie ohnehin schon teilen — sonst ist die nächste
 * neue Anmelde-Seite wieder telefonbreit, und niemand merkt es, bis jemand
 * ein Bildschirmfoto schickt.
 *
 * **Warum `max-w-sm` (384 px) und nicht breiter:** Das ist die Breite, für
 * die diese Seiten gestaltet sind — ein Telefon. Der Desktop zeigt damit
 * genau dieselbe Anordnung wie das Handy, statt eine zweite, nirgends
 * entworfene. `items-center` stellt den Block in die Mitte; dass oben und
 * unten gleich viel Luft bleibt, liest sich als Absicht, während das Drittel
 * Leere über einem linksbündigen Logo wie ein Fehler aussah.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg flex flex-col justify-center items-center px-5 py-10">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
