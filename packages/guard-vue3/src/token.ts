import { InjectionKey } from 'vue'

import { AuthingVueClient } from './interfaces'

export const AUTHING_TOKEN = '$authing'

export const AUTHING_INJECTION_KEY: InjectionKey<AuthingVueClient> = Symbol(AUTHING_TOKEN)
