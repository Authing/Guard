import some from 'lodash/some'

import { getGuardWindow } from '../Guard/core/useAppendConfig'

import { i18n } from './locales'

const isOriginMatched = (whitelist: string[], corsWhitelist: string[], origin: string) => {
  const wildcard = require('wildcard')

  if (corsWhitelist.includes(origin)) {
    return true
  }

  if (
    some(corsWhitelist, allowedOrigin => {
      return !!wildcard(allowedOrigin, origin)
    })
  ) {
    return true
  }

  if (whitelist.includes(origin)) {
    return true
  }

  if (
    some(whitelist, allowedOrigin => {
      return !!wildcard(allowedOrigin, origin)
    })
  ) {
    return true
  }
  return false
}

export const corsVerification = (allowedOrigins: string[] = [], corsWhitelist: string[] = []) => {
  const guardWindow = getGuardWindow()

  if (guardWindow && allowedOrigins.length > 0) {
    const origin = guardWindow.location.origin
    const allowed = isOriginMatched(allowedOrigins, corsWhitelist, origin)
    if (!allowed) {
      throw new Error(`${i18n.t('common.corsErrorMessage')}${i18n.t('common.corsErrorMessage2')}`)
    }
  }
}
