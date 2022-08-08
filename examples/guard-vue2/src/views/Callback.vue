<template>
  <div class="callback-container">
    <div>{{ message }}</div>
  </div>
</template>

<script scoped>

export default {
  data () {
    return {
      message: 'This is callback page ~',
      loginState: ''
    }
  },
  mounted () {
    if (this.$authing.isRedirectCallback()) {
      console.log("redirect");
      this.$authing.handleRedirectCallback().then((res) => {
        this.loginState = res;
        // window.location.replace("/");
      });
    } else {
      this.getLoginState();
    }
  },
  methods: {
    async getLoginState() {
      const state = await this.$authing.getLoginState();
      this.loginState = state;
    }
  }
}
</script>
