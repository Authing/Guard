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

<script scoped>
export default {
  data () {
    return {
      langCache: ''
    }
  },
  mounted () {
    this.$guard.start('#authing-guard-container').then(userInfo => {
      console.log(userInfo)
    })

    this.langCache = localStorage.getItem('_guard_i18nextLng') || 'zh-CN'
  },
  methods: {
    changeContentCSS () {
      this.$guard.changeContentCSS('body {background: blue}')
    },

    startRegister () {
      this.$guard.startRegister()
    },

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
</style>