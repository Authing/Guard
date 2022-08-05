import { Injectable, Optional, Inject, InjectionToken } from '@angular/core'

import { GuardOptions } from '@authing/guard'

export const GuardConfigService = new InjectionToken<GuardOptions>('guard.client')

@Injectable({ providedIn: 'root' })
export class GuardClientConfig {
  private options?: GuardOptions

  constructor(@Optional() @Inject(GuardConfigService) options?: GuardOptions) {
    if (options) {
      this.set(options)
    }
  }

  set(options: GuardOptions): void {
    this.options = options
  }

  get(): GuardOptions {
    return this.options as GuardOptions
  }
}
