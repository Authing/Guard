<template>
  <div>
    <div class="form-body">
      <SocialButtonsList/>

      <P
        class="_authing_form-tip"
        v-show="!socialButtonsListLoading && socialButtonsList.length > 0 && !opts.hideUP"
      >或者</P>

      <form action="#" class="authing-form animate-box no-shadow">
        <div v-show="opts.forceLogin" class="authing_force_login_tips" style="text-align:center">
          <p>输入帐号密码登录</p>
          <p>如果您没有帐号，我们会自动创建</p>
        </div>
        <div class="_authing_form-group">
          <input
            type="text"
            class="_authing_input _authing_form-control"
            id="login-username"
            v-model="loginForm.email"
            :placeholder="opts.placeholder.email"
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
        <div v-show="verifyCodeVisible" class="form-group verify-code">
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
    </div>
    <div class="_authing_form-footer login" v-show="!opts.hideUP">
      <button @click="handleLogin" class="btn btn-primary">登录</button>
    </div>
  </div>
</template>
<script>
import SocialButtonsList from "./SocialButtonsList";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "EmailLogin",
  components: {
    SocialButtonsList
  },
  created() {
    this.$authing = this.$root.$data.$authing;
    this.opts = this.$root.$data.$authing.opts;
    console.log(this.opts);
  },
  data() {
    return {
      verifyCodeVisible: false,
      verifyCodeLoading: false,
      verifyCode: "",
      verifyCodeUrl: "",
      loginMethod: "common",
      loginForm: {
        email: "",
        password: ""
      }
    };
  },
  computed: {
    ...mapGetters("loading", {
      socialButtonsListLoading: "socialButtonsList"
    }),
    ...mapGetters("data", ["socialButtonsList"])
  },
  methods: {
    ...mapActions("loading", ["changeLoading"]),
    ...mapActions("data", ["changeLoading", "showGlobalMessage"]),
    verifyCodeLoad: function() {
      this.verifyCodeLoading = false;
    },
    gotoForgetPassword() {
      this.$router.push({ name: "forgetPassword" });
    },
    gotoUsingPhone() {},
    handleLogin() {
      this.changeLoading({ el: "form", loading: true });
      var that = this;
      var info = {
        email: this.loginForm.email,
        password: this.loginForm.password
      };

      if (this.loginMethod === "common") {
        if (!this.$root.emailExp.test(this.loginForm.email)) {
          this.showGlobalMessage({
            type: "error",
            message: "请输入正确格式的邮箱"
          });
          // this.addAnimation("login-username");
          // this.removeRedLine("login-password");
          // this.removeRedLine("verify-code");
          this.changeLoading({ el: "form", loading: false });
          this.$authing.pub("loginError", "请输入正确格式的邮箱");
          return false;
        }
      }

      if (!this.loginForm.password) {
        this.showGlobalMessage({
            type: "error",
            message: "请输入密码"
          });
        // this.addAnimation("login-password");
        // this.removeRedLine("verify-code");
        // this.removeRedLine("login-username");
        this.changeLoading({ el: "form", loading: false });
        this.$authing.pub("loginError", "请输入密码");
        return false;
      }

      if (this.pageVisible.verifyCodeVisible) {
        info.verifyCode = this.verifyCode;
      }

      if (this.loginMethod === "common") {
        validAuth
          .login(info)
          .then(function(data) {
            if (that.rememberMe) {
              localStorage.setItem("_authing_username", that.loginForm.email);
              localStorage.setItem(
                "_authing_password",
                that.encrypt(
                  that.loginForm.password,
                  that.$authing.opts.clientId
                )
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
            // 验证码错误
            if (err.message.code === 2000 || err.message.code === 2001) {
              that.addAnimation("verify-code");
              that.removeRedLine("login-username");
              that.removeRedLine("login-password");

              that.verifyCodeLoading = true;
              that.pageVisible.verifyCodeVisible = true;
              that.verifyCodeUrl = err.message.data.url;
            }
            // 用户名错误
            else if (
              err.message.code === 2003 ||
              err.message.code === 2204 ||
              err.message.code === 2208
            ) {
              that.addAnimation("login-username");
              that.removeRedLine("login-password");
              that.removeRedLine("verify-code");
            }
            // 用户名不存在
            else if (err.message.code === 2004) {
              // 如果开启登录时创建不存在的用户功能
              if (this.$authing.opts.forceLogin) {
                that.setLoading();
                validAuth
                  .register({
                    email: that.loginForm.email,
                    password: that.loginForm.password
                  })
                  .then(function(data) {
                    that.unLoading();
                    that.showGlobalSuccess(
                      "验证通过，欢迎你：" + data.username || data.email
                    );
                    that.$authing.pub("login", data);
                    that.recordLoginInfo(data);
                  })
                  .catch(function(err) {
                    that.unLoading();
                    that.showGlobalErr(err.message.message);
                    that.$authing.pub("loginError", err);
                  });
                return false;
              } else {
                that.addAnimation("login-username");
                that.removeRedLine("login-password");
                that.removeRedLine("verify-code");
              }
            }
            // 密码错误
            else if (
              err.message.code === 2006 ||
              err.message.code === 2016 ||
              err.message.code === 2027
            ) {
              that.addAnimation("login-password");
              that.removeRedLine("verify-code");
              that.removeRedLine("login-username");
            }
          });
      }

      if (this.loginMethod === "ldap") {
        this.handleLDAPLogin();
      }
    }
  }
};
</script>
<style scoped>
</style>
