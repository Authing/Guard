import { inject } from 'vue'

import { AUTHING_INJECTION_KEY } from './token'

import { GuardOptions, Guard } from '@authing/guard'

import '@authing/guard/dist/guard.min.css'

import { GuardPlugin } from './plugin'

export function createGuard(options: GuardOptions) {
  return new GuardPlugin(options)
}

export function useGuard(): Guard {
  return inject(AUTHING_INJECTION_KEY) as Guard
}

export * from '@authing/guard'
