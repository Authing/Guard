<template>
  <div>
    <SocialButtonsList
      v-if="
        !socialButtonsListLoading &&
        socialButtonsList.length > 0 &&
        !opts.hideUP &&
        !this.needNextStep
      "
    />

    <P
      class="_authing_form-tip"
      v-show="
        !socialButtonsListLoading &&
        socialButtonsList.length > 0 &&
        !opts.hideUP &&
        !this.needNextStep
      "
      >或者</P
    >

    <form
      class="form-body"
      @submit.prevent="
        () => {
          return false;
        }
      "
    >
      <div style="margin-bottom: 16px;" class="authing-form no-shadow">
        <div class="__authing_force_login_tips" style="text-align: center;">
          <p>使用手机号验证码登录</p>
          <p>如果您没有帐号，我们会自动创建</p>
        </div>
        <div class="_authing_form-group">
          <input
            type="text"
            class="_authing_input _authing_form-control"
            id="login-phone"
            v-model="phone"
            :placeholder="opts.placeholder.phone"
            autocomplete="off"
            @keydown.13="nextStepOrSubmit"
          />
        </div>
        <div
          class="_authing_form-group"
          style="display: flex; align-items: flex-end;"
          v-if="this.loginMethod == 'code'"
        >
          <input
            type="number"
            class="_authing_input _authing_form-control"
            id="login-phoneCode"
            v-model="phoneCode"
            :placeholder="opts.placeholder.phoneCode"
            autocomplete="off"
            @keydown.13="handleLoginByPhoneCode"
          />
          <div class="phone-code-wrapper" style="flex-basis: 50%;">
            <button
              @click="handleSendingPhoneCode"
              style="
                height: 40px;
                font-size: 12px;
                border-radius: 0px;
                border: none;
              "
              class="btn btn-primary"
              :class="{ 'btn-ban': countDown !== 0 }"
            >
              {{ countDown === 0 ? "获取验证码" : `${countDown} 秒后重试` }}
            </button>
          </div>
        </div>
        <div class="_authing_form-group" v-if="this.loginMethod == 'password'">
          <input
            type="password"
            class="_authing_input _authing_form-control"
            id="login-password"
            v-model="password"
            :placeholder="opts.placeholder.password"
            autocomplete="off"
            @keydown.13="handleLogin"
          />
        </div>
        <div class="row" v-if="this.needNextStep">
          <div class="_authing_form-group" style="margin-bottom: 0px;">
            <label
              class="_authing_label"
              for="login-remember"
              tyle="width:100%"
              v-if="!opts.hidePhonePassword"
            >
              <a class="_authing_a" @click="loginMethod = 'password'"
                >使用密码登录</a
              >
            </label>
          </div>
          <div class="_authing_form-group" style="margin-bottom: 0px;">
            <label
              class="_authing_label"
              for="login-remember"
              tyle="width:100%"
              v-if="!opts.hidePhonePassword"
            >
              <a class="_authing_a" @click="handleChoosePhoneCodeLogin"
                >使用验证码登录</a
              >
            </label>
          </div>
        </div>
        <div
          v-show="!opts.hideUP && !this.needNextStep"
          class="_authing_form-group"
          style="margin-bottom: 0;"
        >
          <label
            class="_authing_label"
            for="login-remember"
            style="width: 100%;"
          >
            <a class="_authing_a" @click="gotoLogin">使用邮箱登录</a>
          </label>
        </div>
      </div>
    </form>

    <div
      class="_authing_form-footer login"
      v-show="!opts.hideUP && !this.needNextStep"
    >
      <button @click="nextStep" class="btn btn-primary">
        <span v-show="!formLoading">下一步 </span>
      </button>
    </div>
    <div
      class="_authing_form-footer login"
      v-show="!opts.hideUP && this.needNextStep"
    >
      <button @click="handleLogin" class="btn btn-primary">
        <span v-show="!formLoading">登录 </span>
      </button>
    </div>
  </div>
</template>
<script>
import SocialButtonsList from "./SocialButtonsList";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    SocialButtonsList
  },
  data() {
    return {
      countDown: 0,
      loginMethod: null,
      needNextStep: false,
      password: "",
      phone: "",
      phoneCode: ""
    };
  },
  created() {
    this.$authing = this.$root.$data.$authing;
    this.opts = this.$root.$data.$authing.opts;
  },
  computed: {
    ...mapGetters("loading", {
      socialButtonsListLoading: "socialButtonsList",
      formLoading: "form"
    }),
    ...mapGetters("data", [
      "socialButtonsList",
      "signUpPhone",
      "signUpPassword"
    ])
  },
  mounted() {
    this.phone = this.signUpPhone || "";
    this.password = this.signUpPassword || "";
  },
  methods: {
    ...mapActions("visibility", [
      "changeVisibility",
      "gotoForgetPassword",
      "gotoLogin",
      "gotoUsingPhonePassword"
    ]),
    ...mapActions("data", [
      "showGlobalMessage",
      "hideGlobalMessage",
      "removeAnimation",
      "removeRedLine",
      "addRedLine",
      "addAnimation",
      "recordLoginInfo"
    ]),
    ...mapActions("protocol", ["handleProtocolProcess"]),
    ...mapActions("loading", ["changeLoading"]),
    nextStep() {
      if (!/^1[3-8]\d{9}$/.test(this.phone)) {
        this.showGlobalMessage({
          type: "error",
          message: "请填写正确的手机号"
        });
        this.addAnimation("login-phone");
        this.$authing.pub("login-error", "请填写正确的手机号");
        this.$authing.pub("authenticated-error", "请填写正确的手机号");
        return;
      } else {
        this.removeRedLine("login-phone");
      }

      if (!this.opts.hidePhonePassword) {
        this.showGlobalMessage({
          type: "info",
          message: "请选择登录方式"
        });
        this.needNextStep = true;
      } else {
        // 隐藏了手机号密码登录
        this.needNextStep = true;
        this.handleChoosePhoneCodeLogin();
      }
    },
    handleLogin() {
      switch (this.loginMethod) {
        case "password":
          this.handleLoginByPhonePassword();
          break;
        case "code":
          this.handleLoginByPhoneCode();
          break;
        default:
          break;
      }
    },
    handleLoginByPhonePassword() {
      if (!/^1[3-8]\d{9}$/.test(this.phone)) {
        this.showGlobalMessage({
          type: "error",
          message: "请填写正确的手机号"
        });
        this.addAnimation("login-phone");
        this.$authing.pub("login-error", "请填写正确的手机号");
        this.$authing.pub("authenticated-error", "请填写正确的手机号");
        return;
      }
      if (!this.password) {
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
      this.changeLoading({ el: "form", loading: true });
      validAuth
        .loginByPhonePassword({ phone: this.phone, password: this.password })
        .then(userInfo => {
          this.showGlobalMessage({
            type: "success",
            message:
              "验证通过，欢迎你：" + (userInfo.username || userInfo.phone)
          });
          this.recordLoginInfo(userInfo);
          this.$authing.pub("login", userInfo);
          this.$authing.pub("authenticated", userInfo);
          this.handleProtocolProcess({ router: this.$router });
          this.changeLoading({ el: "form", loading: false });
        })
        .catch(err => {
          this.changeLoading({ el: "form", loading: false });
          this.showGlobalMessage({
            type: "error",
            message: err.message.message
          });
        });
    },
    nextStepOrSubmit() {
      if (!this.needNextStep) {
        this.nextStep();
      } else {
        this.handleLogin();
      }
    },
    handleLoginByPhoneCode() {
      if (!/^1[3-8]\d{9}$/.test(this.phone)) {
        this.showGlobalMessage({
          type: "error",
          message: "请填写正确的手机号"
        });
        this.addAnimation("login-phone");
        this.$authing.pub("login-error", "请填写正确的手机号");
        this.$authing.pub("authenticated-error", "请填写正确的手机号");
        return;
      }
      if (!this.phoneCode) {
        this.addAnimation("login-phoneCode");
        this.showGlobalMessage({
          type: "error",
          message: "请输入验证码"
        });
        this.$authing.pub("login-error", "请输入验证码");
        this.$authing.pub("authenticated-error", "请输入验证码");
        return;
      }
      if (this.phoneCode.length !== 4) {
        this.showGlobalMessage({
          type: "error",
          message: "验证码为四位，请重新输入"
        });
        this.addAnimation("login-phoneCode");
        this.$authing.pub("login-error", "验证码为四位，请重新输入");
        this.$authing.pub("authenticated-error", "验证码为四位，请重新输入");
        return;
      }
      this.changeLoading({ el: "form", loading: true });

      validAuth
        .loginByPhoneCode({ phone: this.phone, phoneCode: this.phoneCode })
        .then(userInfo => {
          this.showGlobalMessage({
            type: "success",
            message:
              "验证通过，欢迎你：" + (userInfo.username || userInfo.phone)
          });
          this.recordLoginInfo(userInfo);
          this.$authing.pub("login", userInfo);
          this.$authing.pub("authenticated", userInfo);
          this.handleProtocolProcess({ router: this.$router });
          this.changeLoading({ el: "form", loading: false });
        })
        .catch(err => {
          this.changeLoading({ el: "form", loading: false });
          this.showGlobalMessage({
            type: "error",
            message: err.message.message
          });
        });
    },
    handleSendingPhoneCode: function handleSendingPhoneCode() {
      if (this.countDown !== 0) {
        return;
      }
      if (!/^1[3-8]\d{9}$/.test(this.phone)) {
        this.showGlobalMessage({
          type: "error",
          message: "请填写正确的手机号"
        });
        this.addAnimation("login-phone");
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
        .getVerificationCode(this.phone)
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
            message: JSON.parse(err.message).message
          });
        });
    },
    handleChoosePhoneCodeLogin() {
      this.loginMethod = "code";
      this.handleSendingPhoneCode();
      this.hideGlobalMessage();
    }
  }
};
</script>
<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
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
