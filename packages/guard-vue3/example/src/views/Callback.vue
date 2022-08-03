<template>
  <div class="callback-container">
    <div>{{ message }}</div>
  </div>
</template>

<script scoped setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthing } from '../../../dist/esm/guard.min.js'

const router = useRouter()

const $authing = useAuthing()

const message = 'This is callback page ~'

const handleAuthingLoginCallback = async () => {
  await $authing.guard.handleRedirectCallback()
  router.replace({
    name: 'Personal'
  })
}

onMounted(() => {
  handleAuthingLoginCallback()
})
</script>
