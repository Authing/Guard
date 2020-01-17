<template>
  <div style="margin-top:-13px">
    <div style="margin-bottom:16px" class="authing-form no-shadow">
      <div v-show="!opts.hideUsername" class="_authing_form-group">
        <input
          type="text"
          class="_authing_input _authing_form-control"
          id="sign-up-phone"
          v-model="signUpForm.phone"
          :placeholder="opts.placeholder.phone"
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
          autocomplete="off"
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
      <div
        class="_authing_form-group"
        style="display:flex; align-items: flex-end;"
      >
        <input
          type="number"
          class="_authing_input _authing_form-control"
          id="sign-up-phoneCode"
          v-model="signUpForm.phoneCode"
          :placeholder="opts.placeholder.phoneCode"
          autocomplete="off"
          @keyup.enter="handleSignUp"
        />
        <div class="phone-code-wrapper" style="flex-basis: 50%;">
          <button
            @click="handleSendingPhoneCode"
            style="height: 40px;font-size: 12px;border-radius: 0px;border:none;"
            class="btn btn-primary"
            :class="{ 'btn-ban': countDown !== 0 }"
          >
            {{ countDown === 0 ? "获取验证码" : `${countDown} 秒后重试` }}
          </button>
        </div>
      </div>
      <div class="row" style="margin-bottom:0px;float:right;">
        <div class="_authing_form-group">
          <label class="_authing_label" for="login-remember" style="width:100%">
            <a class="_authing_a" @click="gotoSignUp">使用邮箱注册</a>
          </label>
        </div>
      </div>
    </div>

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
      countDown: 0,
      signUpForm: {
        phone: "",
        password: "",
        phoneCode: "",
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
      "gotoSignUp"
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
    handleSendingPhoneCode() {
      if (this.countDown !== 0) {
        return;
      }
      if (!/^1[3-8]\d{9}$/.test(this.signUpForm.phone)) {
        this.showGlobalMessage({
          type: "error",
          message: "请填写正确的手机号"
        });
        this.addAnimation("sign-up-phone");
        this.$authing.pub("login-error", "请填写正确的手机号");
        this.$authing.pub("authenticated-error", "请填写正确的手机号");
        return;
      }
      this.changeLoading({ el: "form", loading: true });
      this.countDown = 60;
      const timer = setInterval(() => {
        this.countDown -= 1;
        if (this.countDown <= 0) {
          clearInterval(timer);
          this.countDown = 0;
        }
      }, 1000);
      validAuth
        .sendRegisterPhoneCode(this.signUpForm.phone)
        .then(() => {
          this.changeLoading({ el: "form", loading: false });

          this.showGlobalMessage({
            type: "success",
            message: "短信发送成功，请打开手机查看"
          });
        })
        .catch(err => {
          this.changeLoading({ el: "form", loading: false });

          this.showGlobalMessage({
            type: "error",
            message: err.message
          });
        });
    },
    handleSignUp() {
      var that = this;

      this.changeLoading({ el: "form", loading: true });
      if (!/^1[3-8]\d{9}$/.test(this.signUpForm.phone)) {
        this.showGlobalMessage({
          type: "error",
          message: "请填写正确的手机号"
        });
        this.addAnimation("sign-up-phone");
        this.$authing.pub("login-error", "请填写正确的手机号");
        this.$authing.pub("authenticated-error", "请填写正确的手机号");
        this.removeRedLine("sign-up-phoneCode");
        this.removeRedLine("sign-up-password");
        this.removeRedLine("sign-up-re-password");
        this.changeLoading({ el: "form", loading: false });
        this.$authing.pub("register-error", "请输入正确格式的邮箱");
        return false;
      }
      if (this.signUpForm.phoneCode.length !== 4) {
        this.showGlobalMessage({
          type: "error",
          message: "验证码为四位，请重新输入"
        });
        this.addAnimation("sign-up-phoneCode");
        this.$authing.pub("register-error", "验证码为四位，请重新输入");
        this.$authing.pub("authenticated-error", "验证码为四位，请重新输入");
        return;
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
          phone: this.signUpForm.phone,
          phoneCode: this.signUpForm.phoneCode,
          password: this.signUpForm.password
        })
        .then(function(data) {
          that.changeLoading({ el: "form", loading: false });
          that.gotoLogin();
          that.changeVisibility({ el: "loginVerifyCode", visibility: false });
          that.saveSignUpInfo({
            phone: that.signUpForm.phone,
            password: that.signUpForm.password,
            username: that.signUpForm.phone
          });
          that.signUpForm = {
            phone: "",
            password: "",
            phoneCode: "",
            rePassword: ""
          };
          console.log(that.signUpForm.phone);
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
<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.phone-code-wrapper > .btn {
  width: 100%;
  border-radius: 0px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 60px;
  font-size: 16px;
  background: #00a1ea;
  box-shadow: none !important;
  font-weight: 200;
  color: #fff;
  outline: 0;
  cursor: pointer;
}
</style>
