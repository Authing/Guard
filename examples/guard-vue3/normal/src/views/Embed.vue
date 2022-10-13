<template>
  <div class="embed-container">
    <div class="item">
      <label>Change Lang: </label>
      <select v-model="langCache" @change="changeLang">
        <option value="zh-CN">zh-CN</option>
        <option value="zh-TW">zh-TW</option>
        <option value="en-US">en-US</option>
        <option value="ja-JP">ja-JP</option>
      </select>
    </div>

    <button class="authing-button" @click="changeContentCSS">Change Content CSS</button>

    <button class="authing-button" @click="startRegister">Start Register</button>

    <button class="authing-button" @click="logout">Logout</button>

    <button class="authing-button" @click="getUserInfo">Get User Info</button>

    <button class="authing-button" @click="refreshToken">Refresh Token</button>

    <div id="authing-guard-container"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

import { useGuard  } from '@authing/guard-vue3'

import type { User, RefreshToken, AuthenticationClient } from '@authing/guard-vue3'

const langCache = ref('')

const guard = useGuard()

onMounted(() => {
  // 使用 start 方法挂载 Guard 组件到你指定的 DOM 节点，登录成功后返回 userInfo
  guard.start('#authing-guard-container').then((userInfo: User) => {
    console.log("userInfo: ", userInfo)
  })

  guard.on('load', ()=>{
    // 缓存中获取 Guard 默认语言类型
    langCache.value = localStorage.getItem('_guard_i18nextLng') || ''
  })

  guard.on('login', (userInfo: User) => {
    console.log('userInfo in login: ', userInfo)
  })
})

const changeContentCSS = () => guard.changeContentCSS(`
  #authing-guard-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`)

const startRegister = () => guard.startRegister()

// 登出后的回调地址请在 Authing 控制台「应用详情」-「应用配置」-「登出回调 URL」中配置
const logout = () => guard.logout()

const getUserInfo = async () => {
  const userInfo: User | null = await guard.trackSession()
  console.log('userInfo: ', userInfo)
}

const refreshToken = async () => {
  const authenticationClient: AuthenticationClient = await guard.getAuthClient()
  const refreshedToken: RefreshToken = await authenticationClient.refreshToken()
  console.log('refreshedToken: ', refreshedToken)
}

const changeLang = (event: any) => {
  guard.changeLang(event.target.value)
  langCache.value = event.target.value
}
</script>

<style scoped>
  .embed-container .item {
    margin-bottom: 10px;
  }
  .authing-button {
    margin-bottom: 10px;
    margin-right: 10px;
  }

  #authing-guard-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
