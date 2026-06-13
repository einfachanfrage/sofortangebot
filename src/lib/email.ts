import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Sandra <sandra@sofortangebot.app>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://sofortangebot.app'

function btn(text: string, url: string) {
  return `<a href="${url}" style="display:inline-block;background:#F5C400;color:#2C2C2C;font-weight:900;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:15px;">${text}</a>`
}

function wrap(body: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:32px 20px;background:#F7F7F5;font-family:sans-serif;">
<div style="max-width:520px;margin:0 auto;background:white;border-radius:16px;padding:36px 32px;color:#2C2C2C;line-height:1.6;">
${body}
<hr style="border:none;border-top:1px solid #eee;margin:28px 0;">
<p style="color:#999;font-size:12px;margin:0;">Sofortangebot · <a href="${APP_URL}" style="color:#999;">sofortangebot.app</a></p>
</div></body></html>`
}

export interface SendResult { ok: boolean; error?: string }

// ── 1. Willkommens-E-Mail ──────────────────────────────────────────────────
export async function sendWelcomeEmail(to: string, vorname?: string): Promise<SendResult> {
  const name = vorname ?? 'du'
  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: 'Willkommen bei Sofortangebot 🎙',
    text: `Hey ${name},\n\nschön dass du dabei bist.\nDein Account ist eingerichtet — du kannst sofort loslegen.\n\n${APP_URL}/dashboard\n\nBei Fragen: einfach auf diese Mail antworten.\n\nSandra`,
    html: wrap(`
      <p style="font-size:18px;font-weight:900;margin-top:0;">Hey ${name},</p>
      <p>schön dass du dabei bist.</p>
      <p>Dein Account ist eingerichtet — du kannst sofort loslegen.</p>
      <p>${btn('Zum Dashboard →', `${APP_URL}/dashboard`)}</p>
      <p style="margin-bottom:0;">Bei Fragen: einfach auf diese Mail antworten.<br><br>Sandra</p>
    `),
  })
  return error ? { ok: false, error: error.message } : { ok: true }
}

// ── 2. Angebot versendet (interne Kopie an Handwerker) ─────────────────────
export async function sendQuoteSentConfirmation(opts: {
  to: string
  quoteNumber: string
  kundenname: string
  summe: string
  gueltigBis: string
  quoteId: string
}): Promise<SendResult> {
  const { to, quoteNumber, kundenname, summe, gueltigBis, quoteId } = opts
  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: `Angebot #${quoteNumber} an ${kundenname} versendet`,
    text: `Dein Angebot wurde versendet.\n\nKunde: ${kundenname}\nGesamtbetrag: ${summe} €\nGültig bis: ${gueltigBis}\n\n${APP_URL}/angebot/${quoteId}`,
    html: wrap(`
      <p style="font-size:16px;font-weight:900;margin-top:0;">Angebot #${quoteNumber} versendet</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;">
        <tr><td style="padding:8px 0;color:#999;font-size:13px;font-weight:600;">Kunde</td><td style="padding:8px 0;font-weight:700;">${kundenname}</td></tr>
        <tr><td style="padding:8px 0;color:#999;font-size:13px;font-weight:600;">Gesamtbetrag</td><td style="padding:8px 0;font-weight:700;">${summe} €</td></tr>
        <tr><td style="padding:8px 0;color:#999;font-size:13px;font-weight:600;">Gültig bis</td><td style="padding:8px 0;font-weight:700;">${gueltigBis}</td></tr>
      </table>
      <p>${btn('Angebot anzeigen →', `${APP_URL}/angebot/${quoteId}`)}</p>
    `),
  })
  return error ? { ok: false, error: error.message } : { ok: true }
}

// ── 3. Zahlung fehlgeschlagen ──────────────────────────────────────────────
export async function sendPaymentFailedEmail(to: string): Promise<SendResult> {
  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: 'Zahlung fehlgeschlagen — bitte prüfen',
    text: `Hallo,\n\ndeine letzte Zahlung konnte nicht verarbeitet werden.\n\nBitte aktualisiere deine Zahlungsmethode:\n${APP_URL}/einstellungen\n\nDein Zugang bleibt noch 7 Tage aktiv.\n\nSandra`,
    html: wrap(`
      <p style="font-size:16px;font-weight:900;margin-top:0;">Zahlung fehlgeschlagen</p>
      <p>Deine letzte Zahlung konnte nicht verarbeitet werden.</p>
      <p>Bitte aktualisiere deine Zahlungsmethode:</p>
      <p>${btn('Zahlungsmethode aktualisieren →', `${APP_URL}/einstellungen`)}</p>
      <p style="margin-bottom:0;">Dein Zugang bleibt noch 7 Tage aktiv.<br><br>Sandra</p>
    `),
  })
  return error ? { ok: false, error: error.message } : { ok: true }
}

// ── 4. Kündigung bestätigt ─────────────────────────────────────────────────
export async function sendCancellationEmail(to: string, ablaufdatum: string): Promise<SendResult> {
  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: 'Dein Sofortangebot-Abo wird beendet',
    text: `Hallo,\n\ndeine Kündigung ist eingegangen.\nDein Zugang läuft am ${ablaufdatum} aus. Bis dahin kannst du alles wie gewohnt nutzen.\n\nDeine Daten bleiben 30 Tage gespeichert und können exportiert werden.\n\nFalls du es dir anders überlegst:\n${APP_URL}/einstellungen\n\nSandra`,
    html: wrap(`
      <p style="font-size:16px;font-weight:900;margin-top:0;">Dein Abo wird beendet</p>
      <p>Deine Kündigung ist eingegangen.</p>
      <p>Dein Zugang läuft am <strong>${ablaufdatum}</strong> aus. Bis dahin kannst du alles wie gewohnt nutzen.</p>
      <p>Deine Daten bleiben 30 Tage gespeichert und können exportiert werden.</p>
      <p>${btn('Abo fortsetzen →', `${APP_URL}/einstellungen`)}</p>
      <p style="margin-bottom:0;">Sandra</p>
    `),
  })
  return error ? { ok: false, error: error.message } : { ok: true }
}

// ── 5. Account gelöscht ────────────────────────────────────────────────────
export async function sendAccountDeletedEmail(to: string): Promise<SendResult> {
  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: 'Dein Account wurde gelöscht',
    text: `Hallo,\n\ndein Account und alle Daten wurden gelöscht. Danke dass du Sofortangebot genutzt hast.\n\nFalls das ein Versehen war — antworte auf diese Mail innerhalb von 30 Tagen.\n\nSandra`,
    html: wrap(`
      <p style="font-size:16px;font-weight:900;margin-top:0;">Dein Account wurde gelöscht</p>
      <p>Dein Account und alle Daten wurden gelöscht.</p>
      <p>Danke dass du Sofortangebot genutzt hast.</p>
      <p style="margin-bottom:0;color:#666;">Falls das ein Versehen war — antworte auf diese Mail innerhalb von 30 Tagen.<br><br>Sandra</p>
    `),
  })
  return error ? { ok: false, error: error.message } : { ok: true }
}

// ── 6. Daten-Export ────────────────────────────────────────────────────────
export async function sendDataExportEmail(opts: {
  to: string
  quotesCsv: string
  customersCsv: string
  datum: string
}): Promise<SendResult> {
  const { to, quotesCsv, customersCsv, datum } = opts
  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: 'Dein Daten-Export ist fertig',
    text: `Hallo,\n\nim Anhang findest du deinen Daten-Export vom ${datum}.\n\nSandra`,
    html: wrap(`
      <p style="font-size:16px;font-weight:900;margin-top:0;">Dein Daten-Export ist fertig</p>
      <p>Im Anhang findest du deinen Daten-Export vom ${datum}.</p>
      <p style="margin-bottom:0;color:#666;">Enthalten: Angebote (CSV) und Kundendaten (CSV).<br><br>Sandra</p>
    `),
    attachments: [
      { filename: `angebote-${datum}.csv`, content: Buffer.from(quotesCsv, 'utf-8') },
      { filename: `kunden-${datum}.csv`, content: Buffer.from(customersCsv, 'utf-8') },
    ],
  })
  return error ? { ok: false, error: error.message } : { ok: true }
}
