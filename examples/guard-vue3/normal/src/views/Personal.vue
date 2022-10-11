<template>
  <div class="personal-container">
    <div>
      <button class="authing-button" @click="logout">Logout</button>
      <button class="authing-button" @click="updateProfile">Update Profile</button>
    </div>
    <textarea id="" cols="100" rows="30" :value="userInfo"></textarea>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

import { useGuard } from '@authing/guard-vue3'

import type { User, AuthenticationClient } from '@authing/guard-vue3'

const userInfo = ref<string>('')

const guard = useGuard()

const getUserInfo = async () => {
  const _userInfo: User | null = await guard.trackSession()
  userInfo.value = JSON.stringify(_userInfo, null, 2)
}

// 登出后的回调地址请在 Authing 控制台「应用详情」-「应用配置」-「登出回调 URL」中配置
const logout = () => guard.logout()

const updateProfile = async () => {
  const authenticationClient: AuthenticationClient = await guard.getAuthClient()

  // 获取到 AuthenticationClient 实例之后，可以调用其提供的所有方法
  // 比如更新用户昵称
  const userProfile: User = await authenticationClient.updateProfile({
    nickname: 'Nick'
  })

  console.log(userProfile)

  // 更多 AuthenticationClient 的方法，请见 authing-js-sdk 文档介绍。
}

onMounted(() => {
  getUserInfo()
})
</script>
<style scoped>
.authing-button {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
