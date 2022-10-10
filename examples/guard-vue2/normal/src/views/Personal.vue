<template>
  <div class="personal-container">
    <div>{{ message }}</div>
    <div>
      <button class="authing-button" @click="logout">Logout</button>
      <button class="authing-button" @click="updateProfile">Update Profile</button>
    </div>
    <textarea id="" cols="100" rows="30" :value="userInfo"></textarea>
  </div>
</template>

<script>
export default {
  data () {
    return {
      message: 'This is Personal page ~~',
      userInfo: ''
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo () {
      const userInfo = await this.$guard.trackSession()
      console.log('userInfo: ', userInfo)
    },
    // 登出后的回调地址请在 Authing 控制台「应用详情」-「应用配置」-「登出回调 URL」中配置
    logout () {
      this.$guard.logout()
    },
    updateProfile() {
      this.$guard.getAuthClient().then(authenticationClient => {
        // 获取到 AuthenticationClient 实例之后，可以调用其提供的所有方法
        // 比如更新用户昵称
        authenticationClient.updateProfile({
          nickname: 'Nickaaa'
        })
        // 更多 AuthenticationClient 的方法，请见 authing-js-sdk 文档介绍。
        this.getUserInfo()
      })
    }
  }
}
</script>
<style scoped>
.authing-button {
  margin-bottom: 10px;
  margin-right: 10px;
}
</style>
