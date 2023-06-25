<template>
  <div class="home-container">
    <Guard :appId="appId" @login="onLogin"></Guard>
  </div>
</template>

<script lang="ts" scoped>
import { defineComponent } from 'vue'

import { Guard } from '@authing/vue-ui-components'

import '@authing/vue-ui-components/dist/esm/guard.min.css'

import type { User } from '@authing/vue-ui-components'

export default defineComponent({
  components: {
    Guard
  },
  setup () {
    const appId = 'AUTHING_APP_ID'

    const onLogin = (userInfo: User) => {
      console.log(userInfo)
    }

    return {
      appId,
      onLogin
    }
  }
})
</script>
