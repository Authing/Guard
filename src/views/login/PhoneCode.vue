<template>
  <div>
    <div class="form-body">
      <form @submit.prevent="() => { return false; }" style="margin-bottom:16px" class="authing-form no-shadow">
        <div class="_authing_form-group">
          <input
            type="text"
            class="_authing_input _authing_form-control"
            id="login-phone"
            v-model="phone"
            :placeholder="opts.placeholder.phone"
            autocomplete="off"
            @keyup.enter="handleLoginByPhoneCode"
          >
        </div>
        <div class="_authing_form-group" style="display:flex; align-items: flex-end;">
          <input
            type="number"
            class="_authing_input _authing_form-control"
            id="login-phoneCode"
            v-model="phoneCode"
            :placeholder="opts.placeholder.phoneCode"
            autocomplete="off"
            @keyup.enter="handleLoginByPhoneCode"
          >
          <div class="_authing_form-footer phone-code-wrapper" style="flex-basis: 50%;">
            <button
              @click="handleSendingPhoneCode"
              style="height: 40px;font-size: 12px;border-radius: 0px;"
              class="btn btn-primary"
            >获取验证码</button>
          </div>
        </div>
        <div class="row">
          <div class="_authing_form-group" style="margin-bottom:0px;">
            <label class="_authing_label" for="login-remember" style="width:100%">
              <a class="_authing_a" @click="gotoLogin">使用邮箱登录</a>
            </label>
          </div>
        </div>
      </form>
    </div>
    <div class="_authing_form-footer login" v-show="!opts.hideUP">
      <button @click="handleLoginByPhoneCode" class="btn btn-primary">登录</button>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      phone: "",
      phoneCode: ""
    };
  },
  created() {
    this.$authing = this.$root.$data.$authing;
    this.opts = this.$root.$data.$authing.opts;
  },
  methods: {
    ...mapActions("visibility", [
      "changeVisibility",
      "gotoForgetPassword",
      "gotoLogin"
    ]),
    ...mapActions("data", [
      "showGlobalMessage",
      'removeAnimation',
      'removeRedLine',
      'addRedLine',
      'addAnimation',
      'recordLoginInfo'
    ]),
    ...mapActions("protocol", [
      'handleProtocolProcess'
    ]),
    ...mapActions("loading", ["changeLoading"]),
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
            message: "验证通过，欢迎你：" + userInfo.username || userInfo.phone
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
            message: err.message
          });
        });
    },
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
</style>
