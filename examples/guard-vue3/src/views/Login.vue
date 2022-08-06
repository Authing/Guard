<template>
  <div class="login-container">
    <div style="margin-bottom: 30px;">
      <button v-if="!userInfo" @click="onLogin">登录</button>
      <button v-else @click="onLogout">登出</button>
    </div>

    <div v-if="userInfo">
      <div>用户信息：</div>
      <textarea cols="100" rows="30" :value="userInfo"></textarea>
    </div>
  </div>
</template>

<script setup scoped>
import { ref, onMounted } from 'vue'

import { useGuard } from '@authing/guard-vue3'

const $guard = useGuard()
const userInfo = ref('')

const getCurrentUser = async () => {
  const _userInfo = await $authing.guard.trackSession()
  userInfo.value = _userInfo && JSON.stringify(_userInfo, null, 2) || ''
}
const onLogin = () => $guard.startWithRedirect()
const onLogout = () => $guard.logout()

onMounted(() => {
  getCurrentUser()
})
</script>
