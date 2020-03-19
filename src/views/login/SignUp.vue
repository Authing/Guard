<template>
  <div style="margin-top:-13px">
    <form class="authing-form form-body no-shadow">
      <div v-show="!opts.hideUsername" class="_authing_form-group">
        <input
          type="text"
          class="_authing_input _authing_form-control"
          id="sign-up-username"
          v-model="signUpForm.username"
          :placeholder="opts.placeholder.username"
          autocomplete="off"
          @keyup.enter="handleSignUp"
        />
      </div>
      <div class="_authing_form-group">
        <input
          type="email"
          class="_authing_input _authing_form-control"
          id="sign-up-email"
          v-model="signUpForm.email"
          @blur="checkEmail"
          :placeholder="opts.placeholder.email.replace('或用户名', '')"
          autocomplete="off"
          @keyup.enter="handleSignUp"
        />
      </div>
      <div class="_authing_form-group">
        <input
          type="password"
          class="_authing_input _authing_form-control"
          id="sign-up-password"
          v-model="signUpForm.password"
          :placeholder="opts.placeholder.password"
          autocomplete="new-password"
          @keyup.enter="handleSignUp"
        />
      </div>
      <div class="_authing_form-group">
        <input
          type="password"
          class="_authing_input _authing_form-control"
          :class="{ 'err-hint': signUpForm.password !== signUpForm.rePassword }"
          id="sign-up-re-password"
          v-model="signUpForm.rePassword"
          :placeholder="opts.placeholder.confirmPassword"
          autocomplete="off"
          @keyup.enter="handleSignUp"
        />
      </div>
      <div class="row" style="margin-bottom:0px;float:right;">
        <div class="_authing_form-group">
          <label class="_authing_label" for="login-remember" style="width:100%">
            <a class="_authing_a" @click="gotoSignUpByPhone">使用手机号注册</a>
          </label>
        </div>
      </div>
    </form>

    <div class="_authing_form-footer login" v-show="!opts.hideUP">
      <button @click="handleSignUp" class="btn btn-primary">
        <span v-show="!formLoading">注册</span>
      </button>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      signUpForm: {
        username: "",
        password: "",
        email: "",
        rePassword: ""
      }
    };
  },
  created() {
    this.$authing = this.$root.$data.$authing;
    this.opts = this.$authing.opts;
  },
  computed: {
    ...mapGetters("loading", {
      formLoading: "form"
    })
  },
  methods: {
    ...mapActions("visibility", [
      "gotoLogin",
      "changeVisibility",
      "gotoSignUpByPhone"
    ]),
    ...mapActions("loading", ["changeLoading"]),
    ...mapActions("data", [
      "showGlobalMessage",
      "saveSignUpInfo",
      "removeAnimation",
      "removeRedLine",
      "addRedLine",
      "addAnimation"
    ]),
    checkEmail: function checkEmail() {
      if (!this.$root.emailExp.test(this.signUpForm.email)) {
        this.showGlobalMessage({
          type: "error",
          message: "请输入正确格式的邮箱"
        });
        this.addAnimation("sign-up-email");
        this.removeRedLine("sign-up-username");
        this.removeRedLine("sign-up-password");
        this.removeRedLine("sign-up-re-password");
      } else {
        this.removeRedLine("sign-up-email");
      }
    },
    handleSignUp() {
      var that = this;
      this.changeLoading({ el: "form", loading: true });

      if (!this.opts.hideUsername && !this.signUpForm.username) {
        this.showGlobalMessage({
          type: "error",
          message: "请输入用户名"
        });
        this.addAnimation("sign-up-username");
        this.removeRedLine("sign-up-email");
        this.removeRedLine("sign-up-password");
        this.removeRedLine("sign-up-re-password");
        this.changeLoading({ el: "form", loading: false });
        this.$authing.pub("register-error", "请输入用户名");
        return false;
      }
      if (!this.$root.emailExp.test(this.signUpForm.email)) {
        this.showGlobalMessage({
          type: "error",
          message: "请输入正确格式的邮箱"
        });
        this.addAnimation("sign-up-email");
        this.removeRedLine("sign-up-username");
        this.removeRedLine("sign-up-password");
        this.removeRedLine("sign-up-re-password");
        this.changeLoading({ el: "form", loading: false });
        this.$authing.pub("register-error", "请输入正确格式的邮箱");
        return false;
      }
      if (!this.signUpForm.password) {
        this.showGlobalMessage({
          type: "error",
          message: "请输入密码"
        });
        this.addAnimation("sign-up-password");
        this.removeRedLine("sign-up-username");
        this.removeRedLine("sign-up-email");
        this.removeRedLine("sign-up-re-password");
        this.changeLoading({ el: "form", loading: false });
        this.$authing.pub("register-error", "请输入密码");
        return false;
      }
      if (this.signUpForm.password !== this.signUpForm.rePassword) {
        this.showGlobalMessage({
          type: "error",
          message: "两次密码不一致"
        });
        this.addAnimation("sign-up-re-password");
        this.removeRedLine("sign-up-username");
        this.removeRedLine("sign-up-email");
        this.removeRedLine("sign-up-password");
        this.changeLoading({ el: "form", loading: false });
        this.$authing.pub("register-error", "两次密码不一致");
        return false;
      }
      let validAuth = window.validAuth;
      validAuth
        .register({
          email: this.signUpForm.email,
          username: this.signUpForm.username,
          password: this.signUpForm.password
        })
        .then(function(data) {
          that.changeLoading({ el: "form", loading: false });
          that.gotoLogin();
          that.changeVisibility({ el: "loginVerifyCode", visibility: false });
          // that.loginForm = {
          //   email: that.signUpForm.email,
          //   password: that.signUpForm.password
          // };
          that.saveSignUpInfo({
            email: that.signUpForm.email,
            password: that.signUpForm.password
          });
          that.signUpForm = {
            username: "",
            password: "",
            email: "",
            rePassword: ""
          };
          // that.rememberMe = false;
          that.showGlobalMessage({
            type: "success",
            message: "注册成功"
          });
          that.$authing.pub("register", data);
        })
        .catch(function(err) {
          console.log(err);
          that.changeLoading({ el: "form", loading: false });

          that.showGlobalMessage({
            type: "error",
            message: err.message.message
          });
          that.$authing.pub("register-error", err);
          if (err.message.code === 2026) {
            that.addAnimation("sign-up-email");
            that.removeRedLine("sign-up-re-password");
            that.removeRedLine("sign-up-username");
            that.removeRedLine("sign-up-password");
          }
        });
    }
  }
};
</script>
<style scoped></style>
