import { inject } from 'vue'

import { AUTHING_INJECTION_KEY } from './token'

import { GuardOptions } from '@authing/guard'

import '@authing/guard/dist/esm/guard.min.css'

import { AuthingPlugin } from './plugin'

import { AuthingVueClient } from './interfaces'

export function createAuthing(options: GuardOptions) {
  return new AuthingPlugin(options)
}

export function useAuthing(): AuthingVueClient {
  return inject(AUTHING_INJECTION_KEY) as AuthingVueClient
}

