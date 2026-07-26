import { describe, expect, it } from 'vitest'
import { isPublicPagePath } from '@/proxy'

describe('isPublicPagePath', () => {
  it.each([
    '/',
    '/login',
    '/register',
    '/passwort-vergessen',
    '/passwort-reset',
    '/auth/callback',
    '/vorschau',
    '/agb',
    '/avv',
    '/impressum',
    '/datenschutz',
    '/blog',
    '/blog/angebotssoftware',
    '/angebot/share-token-123/unterschreiben',
  ])('erlaubt die öffentliche Seite %s', path => {
    expect(isPublicPagePath(path)).toBe(true)
  })

  it.each([
    '/dashboard',
    '/angebote',
    '/angebot/neu',
    '/angebot/quote-id',
    '/preise',
    '/einstellungen',
    '/admin',
    '/angebot/share-token-123/unterschreiben/extra',
  ])('schützt die private Seite %s', path => {
    expect(isPublicPagePath(path)).toBe(false)
  })
})
