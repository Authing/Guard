import { App } from 'vue'

import { GuardOptions, Guard } from '@authing/guard'

import { AUTHING_INJECTION_KEY, AUTHING_TOKEN } from './token'

export class GuardPlugin {
  private guard: Guard

  constructor (options: GuardOptions) {
    this.guard = new Guard(options)
  }

  install (app: App) {
    app.config.globalProperties[AUTHING_TOKEN] = this.guard
    app.provide(AUTHING_INJECTION_KEY, this.guard)
  }
}
