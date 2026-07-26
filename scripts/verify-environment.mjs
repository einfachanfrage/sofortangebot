const environment = process.env.NEXT_PUBLIC_APP_ENV
const appUrl = process.env.NEXT_PUBLIC_APP_URL
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

const allowed = new Set(['development', 'staging', 'production', 'ci'])
const errors = []

if (!allowed.has(environment)) {
  errors.push(`NEXT_PUBLIC_APP_ENV muss ${[...allowed].join(', ')} sein`)
}

let projectRef = ''
try {
  projectRef = new URL(supabaseUrl).hostname.split('.')[0]
} catch {
  errors.push('NEXT_PUBLIC_SUPABASE_URL ist keine gültige URL')
}

if (environment === 'production') {
  if (!/^https:\/\/(www\.)?sofortangebot\.app\/?$/.test(appUrl ?? '')) {
    errors.push('Produktion muss NEXT_PUBLIC_APP_URL=https://www.sofortangebot.app verwenden')
  }
  if (projectRef && process.env.PRODUCTION_SUPABASE_PROJECT_REF && projectRef !== process.env.PRODUCTION_SUPABASE_PROJECT_REF) {
    errors.push('Produktion zeigt nicht auf PRODUCTION_SUPABASE_PROJECT_REF')
  }
}

if (environment === 'staging') {
  if (appUrl?.includes('www.sofortangebot.app')) {
    errors.push('Staging darf nicht die Produktionsdomain verwenden')
  }
  if (projectRef && process.env.PRODUCTION_SUPABASE_PROJECT_REF && projectRef === process.env.PRODUCTION_SUPABASE_PROJECT_REF) {
    errors.push('Staging darf nicht auf das Produktions-Supabase-Projekt zeigen')
  }
}

if (errors.length) {
  console.error(errors.map(error => `- ${error}`).join('\n'))
  process.exit(1)
}

console.log(`Umgebung gültig: ${environment} / Supabase ${projectRef || 'unbekannt'}`)
