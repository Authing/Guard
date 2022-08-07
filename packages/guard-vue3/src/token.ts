import { InjectionKey } from 'vue'

import { Guard } from '@authing/guard'

export const AUTHING_TOKEN = '$guard'

export const AUTHING_INJECTION_KEY: InjectionKey<Guard> = Symbol(AUTHING_TOKEN)
