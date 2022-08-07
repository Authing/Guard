<template>
  <div class="callback-container">
    <div>{{ message }}</div>
  </div>
</template>

<script scoped setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useGuard } from '@authing/guard-vue3'

const router = useRouter()

const guard = useGuard()

const message = 'This is callback page ~'

const handleAuthingLoginCallback = async () => {
  await guard.handleRedirectCallback()
  router.replace({
    name: 'Personal'
  })
}

onMounted(() => {
  handleAuthingLoginCallback()
})
</script>
