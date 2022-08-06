<template>
  <div class="personal-container">
    <div>{{ message }}</div>
    <textarea cols="100" rows="30" :value="userInfo"></textarea>
  </div>
</template>

<script scoped setup>
import { ref, onMounted } from 'vue'

import { useAuthing } from '@authing/guard-vue3'

const $authing = useAuthing()

const userInfo = ref('')

const message = 'This is Personal page ~~'

const getCurrentUser = async () => {
  const _userInfo = await $authing.guard.trackSession()
  userInfo.value = _userInfo && JSON.stringify(_userInfo, null, 2) || ''
}

onMounted(() => {
  getCurrentUser()
})
</script>
