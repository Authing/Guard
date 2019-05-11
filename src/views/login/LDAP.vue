<template>
  <form
    
    action="#"
    class="authing-form animate-box no-shadow"
  >
    <div v-show="opts.forceLogin" class="authing_force_login_tips" style="text-align:center">
      <p>输入帐号密码登录</p>
      <p>如果您没有帐号，我们会自动创建</p>
    </div>

    <div v-if="hasLDAP" class="_authing_form-group" style="font-size: 13px;color:#777">
      <input type="radio" v-model="loginMethod" value="common" checked style="width: 12px;"> 普通登录
      <input
        type="radio"
        v-model="loginMethod"
        value="ldap"
        style="width: 12px;margin-left:11px"
      > 使用 LDAP
    </div>
    <div class="_authing_form-group">
      <input
        type="text"
        class="_authing_input _authing_form-control"
        id="login-username"
        v-model="loginForm.email"
        :placeholder="loginMethod === 'common' ? opts.placeholder.email : '请输入 LDAP 的用户名'"
        autocomplete="off"
        @keyup.enter="handleLogin"
      >
    </div>
    <div class="_authing_form-group">
      <input
        type="password"
        class="_authing_input _authing_form-control"
        id="login-password"
        v-model="loginForm.password"
        :placeholder="opts.placeholder.password"
        autocomplete="off"
        @keyup.enter="handleLogin"
      >
    </div>
    <div v-show="pageVisible.verifyCodeVisible" class="form-group verify-code">
      <input
        type="text"
        class="_authing_input _authing_form-control"
        id="verify-code"
        v-model="verifyCode"
        :placeholder="opts.placeholder.verfiyCode"
        autocomplete="off"
        @keyup.enter="handleLogin"
      >

      <div class="_authing_verify-code-loading-circle" v-show="verifyCodeLoading"></div>
      <img
        :src="verifyCodeUrl"
        id="verify-code-img"
        v-show="!verifyCodeLoading"
        @load="verifyCodeLoad"
      >
    </div>
    <div class="row backup">
      <div class="_authing_form-group" style="margin-bottom:0px;">
        <label class="_authing_label" for="login-remember" style="width:100%">
          <!--<input class="_authing_input" type="checkbox" id="login-remember" style="vertical-align: middle; margin: 0"
                             v-model="rememberMe"><span
          style="vertical-align: middle"> 记住我</span>-->
          <a class="_authing_a" @click="gotoUsingPhone">使用手机登录</a>
        </label>
      </div>

      <div style="font-size:14px">
        <a class="_authing_a" @click="gotoForgetPassword">忘记密码？</a>
      </div>
    </div>
  </form>
</template>
<script>
export default {
  created() {
    this.opts = this.$root.$data.$authing
  },
  data() {
    return {
      loginMethod: 'common'
    }
  },
  methods: {
    gotoForgetPassword () {
      this.$router.push({name: 'forgetPassword'})
    },
    gotoUsingPhone() {

    },
    handleLDAPLogin: function handleLDAPLogin() {
      const that = this;
      const ldapLoginInfo = {
        username: that.loginForm.email,
        password: that.loginForm.password
      };
      validAuth
        .loginByLDAP(ldapLoginInfo)
        .then(function(data) {
          if (that.rememberMe) {
            localStorage.setItem("_authing_username", that.loginForm.email);
            localStorage.setItem(
              "_authing_password",
              that.encrypt(that.loginForm.password, that.$authing.opts.clientId)
            );
          } else {
            localStorage.removeItem("_authing_username");
            localStorage.removeItem("_authing_password");
          }

          that.showGlobalSuccess(
            "验证通过，欢迎你：" + data.username || data.email
          );
          that.$authing.pub("login", data);
          that.recordLoginInfo(data);
          that.unLoading();
        })
        .catch(function(err) {
          that.unLoading();
          that.$authing.pub("loginError", err);
          that.showGlobalErr(err.message.message);
          if (
            err.message.code === 2006 ||
            err.message.code === 2016 ||
            err.message.code === 2027
          ) {
            that.addAnimation("login-password");
            that.removeRedLine("verify-code");
            that.removeRedLine("login-username");
          }
        });
    },
  }
};
</script>
<style scoped>
</style>
