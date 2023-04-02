import { VueConstructor } from 'vue'

import { GuardOptions, Guard } from '@authing/guard'

import '@authing/guard/dist/index.min.css'

declare module 'vue/types/vue' {
  interface VueConstructor {
    $authing: {
      guard: Guard
    }
  }
}

export function GuardPlugin(Vue: VueConstructor, options: GuardOptions) {
  Vue.prototype.$guard = new Guard(options)
}

export * from '@authing/guard'