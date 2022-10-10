<template>
  <div class="personal-container">
    <div>{{ message }}</div>
    <div>
      <button class="authing-button" @click="logout">Logout</button>
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
    getUserInfo () {
      this.$guard.trackSession().then(res => {
        this.userInfo = JSON.stringify(res || '', null, 2)
      })
    },
    // 登出后的回调地址请在 Authing 控制台「应用详情」-「应用配置」-「登出回调 URL」中配置
    logout () {
      this.$guard.logout()
    }
  }
}
</script>
