<template>
  <div class="authorize">
    <img alt="Vue logo" src="../assets/logo.png">
    <div class="_authing_form-footer">
      <button class="btn btn-primary" @click="redirectURL">确认授权</button>
    </div>
    <div class="_authing_form-footer" style="margin-top:11px">
      <button class="btn btn-primary" @click="cancelAuthorize">取消</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'authorize',
  components: {
  },

  methods: {
    redirectURL() {
      // redirect to $HOST/authorize to get Authorization Code
      const state = this.$route.query.state || '';
      const appId = this.$route.query.app_id || '';
      const redirectURI = this.$route.query.redirect_uri || '';
      const responseType = this.$route.query.response_type || '';
      const scope = this.$route.query.scope || '';
      const host = this.$root.SSOHost || 'https://sso.authing.cn';
      location.href = `${host}/authorize?app_id=${appId}&state=${state}&response_type=${responseType}&redirect_uri=${redirectURI}&scope=${scope}`;
    },

    cancelAuthorize() {
      // redirect to 
    }
  }
}
</script>
