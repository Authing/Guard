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

<script>
export default {
  data () {
    return {
      langCache: ''
    }
  },
  mounted () {
    // 使用 start 方法挂载 Guard 组件到你指定的 DOM 节点，登录成功后返回 userInfo
    this.$guard.start('#authing-guard-container').then(userInfo => {
      console.log(userInfo)
    })

    this.$guard.on('load', ()=>{
      // 缓存中获取 Guard 默认语言类型
      this.langCache = localStorage.getItem('_guard_i18nextLng')
    })
  },
  methods: {
    changeContentCSS () {
      this.$guard.changeContentCSS('body {background: blue}')
    },

    startRegister () {
      this.$guard.startRegister()
    },

    // 登出后的回调地址请在 Authing 控制台「应用详情」-「应用配置」-「登出回调 URL」中配置
    logout () {
      this.$guard.logout()
    },

    async getUserInfo () {
      const userInfo = await this.$guard.trackSession()
      console.log('userInfo: ', userInfo)
    },

    async refreshToken () {
      const authClient = await this.$guard.getAuthClient()
      const token = await authClient.refreshToken()
      console.log('token: ', token)
    },

    changeLang (event) {
      this.$guard.changeLang(event.target.value)
      this.langCache = event.target.value
    }
  }
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
</style>
