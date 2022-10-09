<template>
  <div class="callback-container">
    <div>{{ message }}</div>
  </div>
</template>

<script scoped>

export default {
  data () {
    return {
      message: 'This is callback page ~'
    }
  },
  mounted () {
    this.handleAuthingLoginCallback()
  },
  methods: {
    async handleAuthingLoginCallback () {
      try {
        // 1. 触发 guard.handleRedirectCallback() 方法完成登录认证
        // 用户认证成功之后，我们会将用户的身份凭证存到浏览器的本地缓存中
        await this.$guard.handleRedirectCallback()

        // 2. 处理完 handleRedirectCallback 之后，你需要先检查用户登录态是否正常
        const loginStatus = await this.$guard.checkLoginStatus()

        if (!loginStatus) {
          this.$guard.startWithRedirect({
            scope: 'openid profile',
            // 默认情况下，会使用你在 Authing 控制台中配置的第一个回调地址为此次认证使用的回调地址。
            // 如果你配置了多个回调地址，也可以手动指定（此地址也需要加入到应用的「登录回调 URL」中）：
            redirectUri: 'http://localhost:3000/callback'
          })
          return
        }

        // 3. 获取到登录用户的用户信息
        const userInfo = await this.$guard.trackSession()

        console.log(userInfo)

        // 你也可以重定向到你的任意业务页面，比如重定向到用户的个人中心
        // 如果你希望实现登录后跳转到同一页面的效果，可以通过在调用 startWithRedirect 时传入的自定义 state 实现
        // 之后你在这些页面可以通过 trackSession 方法获取用户登录态和用户信息

        // 示例一：跳转到固定页面
        this.$router.replace('/personal')

        // 示例二：获取自定义 state，进行特定操作
        // const search = window.location.search
        // 从 URL search 中解析 state
      } catch (e) {
        // 登录失败，推荐再次跳转到登录页面
        this.$guard.startWithRedirect({
          scope: 'openid profile',
          // 默认情况下，会使用你在 Authing 控制台中配置的第一个回调地址为此次认证使用的回调地址。
          // 如果你配置了多个回调地址，也可以手动指定（此地址也需要加入到应用的「登录回调 URL」中）：
          redirectUri: 'http://localhost:3000/callback'
        })
      }
    }
  }
}
</script>
