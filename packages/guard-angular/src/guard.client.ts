import { InjectionToken } from '@angular/core'

import { Guard } from '@authing/guard'

import { GuardClientConfig } from './guard.config'

export const GuardClientService = new InjectionToken<Guard>('guard.client')

export class GuardClientFactory {
  static createClient(configFactory: GuardClientConfig): Guard {
    const options = configFactory.get();

    if (!options) {
      throw new Error(
        'Configuration must be specified either through AuthModule.forRoot or through AuthClientConfig.set'
      );
    }

    return new Guard(options)
  }
}