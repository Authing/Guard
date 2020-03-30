<template>
  <div>
    <div class="form-body authing-form no-shadow">
      <div class="_authing_form-group" style="margin-top: -15px;">
        <input
          type="text"
          class="_authing_input _authing_form-control"
          id="forget-password-email"
          :placeholder="opts.placeholder.MFACode"
          autocomplete="off"
          v-model="MFACode"
          @keydown.13="handleSubmitMFA"
        />
      </div>
    </div>

    <div class="_authing_form-footer login" v-show="!opts.hideUP">
      <button @click="handleSubmitMFA" class="btn btn-primary">
        <span v-show="!formLoading">提交</span>
      </button>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  created() {
    this.$authing = this.$root.$data.$authing;
    this.opts = this.$root.$data.$authing.opts;
    console.log(this.opts.placeholder);
  },
  data() {
    return {
      MFACode: ""
    };
  },
  computed: {
    ...mapGetters("loading", {
      formLoading: "form"
    }),
    ...mapGetters("data", ["loginFormStash", "loginType", "loginOpt"])
  },
  methods: {
    ...mapActions("loading", ["changeLoading"]),
    ...mapActions("visibility", ["gotoForgetPasswordVerifyCode"]),
    ...mapActions("data", [
      "showGlobalMessage",
      "saveForgetPasswordEmail",
      "addAnimation",
      "recordLoginInfo"
    ]),
    ...mapActions("protocol", ["handleProtocolProcess"]),

    handleSubmitMFA() {
      var that = this;
      this.changeLoading({ el: "form", loading: true });

      if (/^\d{6}$/.test(this.MFACode) === false) {
        this.showGlobalMessage({
          type: "error",
          message: "请输入正确 6 位数字动态口令"
        });
        this.addAnimation("forget-password-email");
        this.changeLoading({ el: "form", loading: false });
        this.$authing.pub("MFA-format-error", "请输入正确 6 位数字动态口令");
        return false;
      }
      let info;
      if (this.loginType === "UP") {
        console.log(this.loginFormStash);
        info = { ...this.loginFormStash };
      } else if (this.loginType === "social") {
        info = { ...this.loginOpt };
      }
      info.MFACode = this.MFACode;
      console.log("info23y543");
      console.log(info);
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
          }, 500);
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
            that.setLoginFormStash(info);
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
                .then(() => {
                  return validAuth.login({
                    email: that.loginForm.email,
                    password: that.loginForm.password
                  });
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
                  that.handleProtocolProcess({ router: that.$router });
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
    }
  }
};
</script>
<style scoped></style>
