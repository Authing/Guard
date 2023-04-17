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

    <button class='authing-button' @click="changeViewToPassword">Change View to Password</button>

    <button class='authing-button' @click="changeViewToPhoneCode">Change View to PhoneCode</button>

    <button class='authing-button' @click="changeViewToForgetPassword">Change View to ForgetPassword</button>

    <button class='authing-button' @click="changeViewToAppQrcode">Change View to AppQrcode</button>

    <button class='authing-button' @click="changeViewToRegister_UserName">Change View To Register - UserName</button>

    <button class='authing-button' @click="changeViewToRegister_EmailPassword">Change View To Register - EmailPassword</button>

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
      console.log('userInfo in start: ', userInfo)
    })

    this.$guard.on('load', () => {
      // 缓存中获取 Guard 默认语言类型
      this.langCache = localStorage.getItem('_guard_i18nextLng')
    })

    this.$guard.on('login', (userInfo) => {
      console.log('userInfo in login: ', userInfo)
    })
  },
  methods: {
    changeContentCSS () {
      this.$guard.changeContentCSS(`
        #authing-guard-container {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `)
    },

    startRegister () {
      this.$guard.startRegister()
    },

    // 登出后的回调地址请在 Authing 控制台「应用详情」-「应用配置」-「登出回调 URL」中配置
    logout () {
      this.$guard.logout({
        quitCurrentDevice: true // 只退出当前设备用户，其他设备不影响登录状态(默认为 false，一端登出后其他设备也会登出)
      })
    },

    async getUserInfo () {
      const userInfo = await this.$guard.trackSession()
      console.log('userInfo: ', userInfo)
    },

    async refreshToken () {
      const authenticationClient = await this.$guard.getAuthClient()
      const refreshedToken = await authenticationClient.refreshToken()
      console.log('refreshedToken: ', refreshedToken)
    },

    changeLang (event) {
      this.$guard.changeLang(event.target.value)
      this.langCache = event.target.value
    },

    changeViewToForgetPassword () {
      this.$guard.changeView({
        module: 'forgetPassword'
      })
    },

    changeViewToPassword() {
      this.$guard.changeView('login:password')
    },

    changeViewToPhoneCode () {
      this.$guard.changeView({
        module: 'login',
        tab: 'phone-code'
      })
    },

    changeViewToRegister_UserName() {
      this.$guard.changeView('register:username-password')
    },

    changeViewToRegister_EmailPassword() {
      this.$guard.changeView('register:email-password')
    },

    changeViewToAppQrcode () {
      this.$guard.changeView('login:app-qrcode')
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

  @media only screen and (min-width: 450px) {
    #authing-guard-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
