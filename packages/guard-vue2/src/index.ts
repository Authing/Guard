import { VueConstructor } from 'vue'

import { GuardOptions, Guard } from '@authing/guard'

import '@authing/guard/dist/esm/guard.min.css'

declare module 'vue/types/vue' {
  interface VueConstructor {
    $authing: {
      guard: Guard
    }
  }
}

export function AuthingPlugin (Vue: VueConstructor, options: GuardOptions) {
  const guard = new Guard(options)

  Vue.prototype.$authing = {
    guard
  }
}
