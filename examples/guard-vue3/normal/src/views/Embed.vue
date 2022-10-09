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
    
    <div class="item">
      <button @click="changeContentCSS">Change Content CSS</button>
    </div>
    
    <div class="item">
      <button @click="startRegister">Start Register</button>
    </div>

    <div class="item">
      <button @click="logout">Logout</button>
    </div>
    
    <div class="item">
      <button @click="getUserInfo">Get User Info</button>
    </div>
    
    <div class="item">
      <button @click="refreshToken">Refresh Token</button>
    </div>

    <div id="authing-guard-container"></div>
  </div>
</template>

<script scoped setup>
import { ref, onMounted } from 'vue'

import { useGuard } from '@authing/guard-vue3'

const langCache = ref('')

const guard = useGuard()

onMounted(() => {
  guard.start('#authing-guard-container').then(userInfo => {
    console.log(userInfo)
  })

  langCache.value = localStorage.getItem('_guard_i18nextLng') || 'zh-CN'
})

const changeContentCSS = () => guard.changeContentCSS('body {background: blue}')

const startRegister = () => guard.startRegister()

const logout = () => guard.logout()

const getUserInfo = async () => {
  const userInfo = await guard.trackSession()
  console.log('userInfo: ', userInfo)
}

const refreshToken = async () => {
  const authClient = await guard.getAuthClient()
  const token = await authClient.refreshToken()
  console.log('token: ', token)
}

const changeLang = (event) => {
  guard.changeLang(event.target.value)
  langCache.value = event.target.value
}
</script>

<style scoped>
  .embed-container .item {
    margin-bottom: 10px;
  }
</style>