<template>
  <div>
    <form action="#" class="authing-form animate-box no-shadow">
      <div v-show="opts.forceLogin" class="authing_force_login_tips" style="text-align:center">
        <p>输入帐号密码登录</p>
        <p>如果您没有帐号，我们会自动创建</p>
      </div>

      <div class="_authing_form-group">
        <input
          type="text"
          class="_authing_input _authing_form-control"
          id="ldap-login-username"
          v-model="email"
          placeholder="请输入 LDAP 的用户名"
          autocomplete="off"
          @keyup.enter="handleLDAPLogin"
        >
      </div>
      <div class="_authing_form-group">
        <input
          type="password"
          class="_authing_input _authing_form-control"
          id="ldap-login-password"
          v-model="password"
          :placeholder="opts.placeholder.password"
          autocomplete="off"
          @keyup.enter="handleLDAPLogin"
        >
      </div>
      <div v-show="loginVerifyCodeVisible" class="form-group verify-code">
        <input
          type="text"
          class="_authing_input _authing_form-control"
          id="ldap-verify-code"
          v-model="verifyCode"
          :placeholder="opts.placeholder.verfiyCode"
          autocomplete="off"
          @keyup.enter="handleLDAPLogin"
        >

        <div class="_authing_verify-code-loading-circle" v-show="loginVerifyCodeLoading"></div>
        <img
          :src="verifyCodeUrl"
          id="verify-code-img"
          v-show="!loginVerifyCodeLoading"
          @load="handleLoginVerifyCodeLoaded"
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
    <div class="_authing_form-footer login" v-show="!opts.hideUP">
      <button @click="handleLDAPLogin" class="btn btn-primary">登录</button>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  created() {
    this.$authing = this.$root.$data.$authing;
    this.opts = this.$root.$data.$authing.opts;
  },
  data() {
    return {
      verifyCode: "",
      verifyCodeUrl: "",
      email: "",
      password: ""
    };
  },
  computed: {
    ...mapGetters("loading", {
      loginVerifyCodeLoading: "loginVerifyCode"
    }),
    ...mapGetters("visibility", {
      loginVerifyCodeVisible: "loginVerifyCode"
    })
  },
  methods: {
    ...mapActions("visibility", [
      "changeVisibility",
      "gotoForgetPassword",
      "gotoUsingPhone"
    ]),
    ...mapActions("loading", ["changeLoading"]),
    ...mapActions("data", ["showGlobalMessage"]),
    handleLoginVerifyCodeLoaded() {
      this.changeLoading({ el: "loginVerifyCode", loading: false });
    },
    recordLoginInfo(userInfo) {
      let appToken = localStorage.getItem("appToken");

      if (appToken) {
        try {
          appToken = JSON.parse(appToken);
        } catch (error) {
          appToken = {};
        }
      } else {
        appToken = {};
      }

      appToken[appId] = {
        accessToken: userInfo.token,
        userInfo: userInfo
      };

      localStorage.setItem("appToken", JSON.stringify(appToken));
    },
    handleLDAPLogin() {
      const that = this;
      const ldapLoginInfo = {
        username: that.email,
        password: that.password
      };
      this.changeLoading({ el: "form", loading: true });
      validAuth
        .loginByLDAP(ldapLoginInfo)
        .then(data => {
          if (that.rememberMe) {
            localStorage.setItem("_authing_username", that.email);
            localStorage.setItem(
              "_authing_password",
              that.encrypt(that.password, that.$authing.opts.clientId)
            );
          } else {
            localStorage.removeItem("_authing_username");
            localStorage.removeItem("_authing_password");
          }

          this.showGlobalMessage({
            type: "success",
            message: "验证通过，欢迎你：" + data.username || data.email
          });
          that.recordLoginInfo(data);
          this.changeLoading({ el: "form", loading: false });
          that.$authing.pub("login", data);
        })
        .catch(err => {
          this.changeLoading({ el: "form", loading: false });
          this.showGlobalMessage({
            type: "error",
            message: err.message.message
          });
          that.$authing.pub("loginError", err);
          if (
            err.message.code === 2006 ||
            err.message.code === 2016 ||
            err.message.code === 2027
          ) {
            // that.addAnimation("login-password");
            // that.removeRedLine("verify-code");
            // that.removeRedLine("login-username");
          }
        });
    }
  }
};
</script>
<style scoped>
</style>
