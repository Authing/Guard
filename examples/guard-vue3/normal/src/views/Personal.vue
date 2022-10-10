<template>
  <div class="personal-container">
    <div>
      <button class="authing-button" @click="logout">Logout</button>
    </div>
    <textarea id="" cols="100" rows="30" :value="userInfo"></textarea>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useGuard } from '@authing/guard-vue3'

const userInfo = ref(null)

const guard = useGuard()

const getUserInfo = async () => {
  const _userInfo = await guard.trackSession()
  userInfo.value = JSON.stringify(_userInfo || '', null, 2)
}

// 登出后的回调地址请在 Authing 控制台「应用详情」-「应用配置」-「登出回调 URL」中配置
const logout = () => guard.logout()

onMounted(() => {
  getUserInfo()
})
</script>
