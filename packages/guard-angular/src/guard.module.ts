import { NgModule, ModuleWithProviders } from '@angular/core'

import { GuardService } from './guard.service'
import { GuardClientService, GuardClientFactory } from './guard.client'
import { GuardConfigService, GuardClientConfig } from './guard.config'

import { GuardOptions } from '@authing/guard'

@NgModule()
export class GuardModule {
  static forRoot(config: GuardOptions): ModuleWithProviders<GuardModule> {
    return {
      ngModule: GuardModule,
      providers: [
        GuardService,
        {
          provide: GuardConfigService,
          useValue: config
        },
        {
          provide: GuardClientService,
          useFactory: GuardClientFactory.createClient,
          deps: [GuardClientConfig]
        }
      ]
    }
  }
}