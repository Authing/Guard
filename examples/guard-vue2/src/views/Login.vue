<template>
  <div class="login-container">
    <div style="margin-bottom: 30px;">
      <button v-if="!userInfo" @click="onLogin">登录</button>
      <button v-else @click="onLogout">登出</button>
    </div>

    <div v-if="userInfo">
      <div>用户信息：</div>
      <textarea cols="100" rows="30" :value="userInfo"></textarea>
    </div>
  </div>
</template>

<script scoped>
export default {
  data () {
    return {
      loginState: null,
      userInfo: null,
      
    }
  },
  methods: {
    onLogin () {
      this.$authing.loginWithRedirect()
    }
  }
}
</script>
