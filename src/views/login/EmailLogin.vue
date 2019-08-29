<template>
  <div>
    <div class="form-body">
      <!-- 暂时隐藏 社会化登录 按钮们 -->
      <SocialButtonsList
        v-if="!socialButtonsListLoading && socialButtonsList.length > 0 && !opts.hideUP"
      />

      <P
        class="_authing_form-tip"
        v-show="!socialButtonsListLoading && socialButtonsList.length > 0 && !opts.hideUP"
      >或者</P>

      <form style="margin-bottom:16px" class="authing-form animate-box no-shadow">
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
          />
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
          />
        </div>
        <div v-show="loginVerifyCodeVisible" class="form-group verify-code">
          <input
            type="text"
            class="_authing_input _authing_form-control"
            id="verify-code"
            v-model="verifyCode"
            :placeholder="opts.placeholder.verfiyCode"
            autocomplete="off"
            @keyup.enter="handleLogin"
          />

          <div class="_authing_verify-code-loading-circle" v-show="loginVerifyCodeLoading"></div>
          <img
            :src="verifyCodeUrl"
            id="verify-code-img"
            v-show="!loginVerifyCodeLoading"
            @load="handleLoginVerifyCodeLoaded"
          />
        </div>
        <div class="row backup">
          <div class="_authing_form-group" style="margin-bottom:0px;" v-if="!opts.hidePhone">
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
    <div class="_authing_form-footer login">
      <button @click="handleLogin" class="btn btn-primary">
        <span v-show="!formLoading">登录</span>
      </button>
    </div>
  </div>
</template>
<script>
import SocialButtonsList from "./SocialButtonsList";
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  name: "EmailLogin",
  components: {
    SocialButtonsList
  },
  created() {
    this.$authing = this.$root.$data.$authing;
    this.opts = this.$root.$data.$authing.opts;
  },
  mounted() {
    this.loginForm.email = this.signUpEmail || "";
    this.loginForm.password = this.signUpPassword || "";
  },
  watch: {
    // 为了能够在注册后自动跳转到登录页面时自动填充用户名和密码

    emailLoginVisible: function(newVal) {
      if (
        newVal === true &&
        !this.loginForm.email &&
        !this.loginForm.password
      ) {
        this.loginForm.email = this.signUpEmail || "";
        this.loginForm.password = this.signUpPassword || "";
      }
    }
  },
  data() {
    return {
      verifyCode: "",
      verifyCodeUrl: "",
      loginForm: {
        email: "",
        password: ""
      }
    };
  },
  computed: {
    ...mapGetters("loading", {
      socialButtonsListLoading: "socialButtonsList",
      loginVerifyCodeLoading: "loginVerifyCode",
      formLoading: "form"
    }),
    ...mapGetters("visibility", {
      loginVerifyCodeVisible: "loginVerifyCode",
      emailLoginVisible: "emailLogin"
    }),
    ...mapGetters("data", [
      "socialButtonsList",
      "signUpEmail",
      "signUpPassword",
      "loginFormStash"
    ])
  },
  methods: {
    ...mapMutations("data", ["setLoginFormStash", "setLoginType"]),
    ...mapActions("loading", ["changeLoading"]),
    ...mapActions("visibility", [
      "changeVisibility",
      "gotoForgetPassword",
      "gotoUsingPhone",
      "gotoMFACode"
    ]),
    ...mapActions("data", [
      "showGlobalMessage",
      "removeAnimation",
      "removeRedLine",
      "addRedLine",
      "addAnimation",
      "recordLoginInfo"
    ]),
    ...mapActions("protocol", ["handleProtocolProcess"]),
    handleLoginVerifyCodeLoaded() {
      this.changeLoading({ el: "loginVerifyCode", loading: false });
    },
    handleLogin() {
      this.changeLoading({ el: "form", loading: true });
      let that = this;
      let info = {
        email: this.loginForm.email,
        password: this.loginForm.password
      };

      if (!this.$root.emailExp.test(this.loginForm.email)) {
        // this.showGlobalMessage({
        //   type: "error",
        //   message: "请输入正确格式的邮箱"
        // });
        info = {
          username: this.loginForm.email,
          password: this.loginForm.password
        };
        // this.addAnimation("login-username");
        // this.removeRedLine("login-password");
        // this.removeRedLine("verify-code");
        // this.changeLoading({ el: "form", loading: false });
        // this.$authing.pub("login-error", "请输入正确格式的邮箱");
        // this.$authing.pub("authenticated-error", "请输入正确格式的邮箱");
        // return false;
      } else {
        info = {
          email: this.loginForm.email,
          password: this.loginForm.password
        };
      }

      if (!this.loginForm.password) {
        this.showGlobalMessage({
          type: "error",
          message: "请输入密码"
        });
        this.addAnimation("login-password");
        this.removeRedLine("verify-code");
        this.removeRedLine("login-username");
        this.changeLoading({ el: "form", loading: false });
        this.$authing.pub("login-error", "请输入密码");
        this.$authing.pub("authenticated-error", "请输入密码");
        return false;
      }

      if (this.loginVerifyCodeVisible) {
        info.verifyCode = this.verifyCode;
      }
      let infoCopy = {...info}
      validAuth
        .login(info)
        .then(data => {
          /*
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
          */
          that.showGlobalMessage({
            type: "success",
            message: "验证通过，欢迎你：" + (data.username || data.email)
          });
          that.recordLoginInfo(data);
          that.$authing.pub("login", data);
          that.$authing.pub("authenticated", data);
          setTimeout(() => {
            this.handleProtocolProcess({ router: this.$router });
          }, 500)
          that.changeLoading({ el: "form", loading: false });
        })
        .catch(err => {
          console.log(err);
          that.changeLoading({ el: "form", loading: false });
          that.$authing.pub("login-error", err);
          that.$authing.pub("authenticated-error", err);
          that.showGlobalMessage({
            type: "error",
            message: err.message.message
          });
          // 验证码错误
          if (err.message.code === 2000 || err.message.code === 2001) {
            that.addAnimation("verify-code");
            that.removeRedLine("login-username");
            that.removeRedLine("login-password");

            that.changeLoading({ el: "loginVerifyCode", loading: true });
            that.changeVisibility({
              el: "loginVerifyCode",
              visibility: true
            });
            that.verifyCodeUrl = err.message.data.url;
          }
          // 需要提供 MFA 口令
          /*
          {
            message: '用户开启了二次验证，需输入 MFA 口令',
            code: 1635,
          }
          */
          else if (err.message.code === 1635) {
            that.showGlobalMessage({
              type: "error",
              message: err.message.message
            });
            that.setLoginType({loginType: 'UP'})
            that.setLoginFormStash({
              ...infoCopy,
              verifyCode: this.verifyCode
            });
            that.gotoMFACode();
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
              that.changeLoading({ el: "form", loading: true });
              validAuth
                .register({
                  email: that.loginForm.email,
                  password: that.loginForm.password
                })
                .then(function(data) {
                  that.changeLoading({ el: "form", loading: false });
                  that.showGlobalMessage({
                    type: "success",
                    message:
                      "验证通过，欢迎你：" + (data.username || data.email)
                  });
                  that.$authing.pub("login", data);
                  that.$authing.pub("authenticated", data);
                  // @TODO 进行协议后续流程
                  that.handleProtocolProcess(data);
                  that.recordLoginInfo(data);
                })
                .catch(function(err) {
                  that.changeLoading({ el: "form", loading: false });
                  that.showGlobalMessage({
                    type: "error",
                    message: err.message.message
                  });
                  that.$authing.pub("login-error", err);
                  that.$authing.pub("authenticated-error", err);
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
            if (err.message.data.url) {
              that.verifyCodeUrl = err.message.data.url;
            } else {
              that.verifyCodeUrl = "";
              that.changeVisibility({
                el: "loginVerifyCode",
                visibility: false
              });
            }
          }
        });

      // if (this.loginMethod === "ldap") {
      //   this.handleLDAPLogin();
      // }
    }
  }
};
</script>
<style scoped>
</style>
