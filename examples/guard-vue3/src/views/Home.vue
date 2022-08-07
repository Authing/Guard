<template>
  <div class="home-container">
    <div style="margin-bottom: 30px;">{{ message }}</div>
    <button @click="toLogin">go to login page</button>
    <div id="home-container"></div>
  </div>
</template>

<script scoped setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { useGuard } from '@authing/guard-vue3'

const router = useRouter()

const guard = useGuard()

// const message = 'This is home page ~~'
const toLogin = () => router.push({
  path: '/login'
})

onMounted(() => {
  guard.start('#home-container')
})
</script>
