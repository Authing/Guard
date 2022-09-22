<template>
  <div class="home-container">
    <div style="margin-bottom: 30px;">{{ message }}</div>
    <button @click="toLogin">go to login page</button>
    <button @click="changeContentCSS">changeContentCSS</button>
    <button @click="changeLang">changeLang</button>
    <button @click="logout">logout</button>
    <div id="home-container"></div>
  </div>
</template>

<script scoped>
export default {
  data () {
    return {
      message: 'This is Home page',
      lang: 'zh-CN'
    }
  },
  mounted () {
    console.log('this.$guard: ', this.$guard)

    this.$guard.start('#home-container')

    this.$guard.on('login', userInfo => {
      console.log('userInfo: ', userInfo)
    })

    this.checkLoginStatus()
  },
  methods: {
    toLogin () {
      this.$router.push({
        name: 'Login'
      })
    },
    changeContentCSS () {
      this.$guard.changeContentCSS('body { background: orange }')
    },
    changeLang () {
      const lang = this.lang = this.lang === 'zh-CN' ? 'en-US' : 'zh-CN'
      this.$guard.changeLang(lang)
    },
    logout () {
      this.$guard.logout()
    },
    async checkLoginStatus () {
      const authClient = await this.$guard.getAuthClient()

      const userInfo = await authClient.getCurrentUser()
      console.log('token: ', userInfo && userInfo.token)

      const status = await authClient.checkLoginStatus(userInfo && userInfo.token || '')
      console.log('------ status: ', status)
    }
  }
}
</script>
