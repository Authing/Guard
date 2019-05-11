<template>
  <div>
    <div class="form-body">
      <form
        @submit.prevent="() => { return false; }"
        v-show="pageVisible.loginByPhoneCodeVisible"
        class="authing-form no-shadow"
      >
        <div class="_authing_form-group">
          <input
            type="text"
            class="_authing_input _authing_form-control"
            id="login-phone"
            v-model="loginByPhoneCodeForm.phone"
            :placeholder="opts.placeholder.phone"
            autocomplete="off"
            @keyup.enter="handleLoginByPhoneCode"
          >
        </div>
        <div class="_authing_form-group">
          <div
            class="_authing_form-footer phone-code-wrapper"
            style="float: right;padding-top: 9px;padding-bottom: 9px;margin-top: -50px;height: 15px;"
          >
            <button
              @click="handleSendingPhoneCode"
              style="height: 40px;font-size: 12px;border-radius: 0px;"
              class="btn btn-primary"
            >获取验证码</button>
          </div>

          <input
            type="number"
            class="_authing_input _authing_form-control"
            id="login-phoneCode"
            v-model="loginByPhoneCodeForm.phoneCode"
            :placeholder="opts.placeholder.phoneCode"
            autocomplete="off"
            @keyup.enter="handleLoginByPhoneCode"
          >
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
      <button
        @click="handleLoginByPhoneCode"
        class="btn btn-primary"
      >登录</button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    handleLoginByPhoneCode: function handleLoginByPhoneCode() {
      if (!/^1[34578]\d{9}$/.test(this.loginByPhoneCodeForm.phone)) {
        this.showGlobalErr("请填写正确的手机号");
        this.addAnimation("login-phone");
        this.$authing.pub("loginError", "请填写正确的手机号");
        return;
      }
      if (!this.loginByPhoneCodeForm.phoneCode) {
        this.showGlobalErr("请输入验证码");
        this.addAnimation("login-phoneCode");
        this.$authing.pub("loginError", "请输入验证码");
        return;
      }
      if (this.loginByPhoneCodeForm.phoneCode.length !== 4) {
        this.showGlobalErr("验证码为四位，请重新输入");
        this.addAnimation("login-phoneCode");
        this.$authing.pub("loginError", "验证码为四位，请重新输入");
        return;
      }
      this.setLoading();
      validAuth
        .loginByPhoneCode(this.loginByPhoneCodeForm)
        .then(userInfo => {
          this.unLoading();
          this.showGlobalSuccess(
            "验证通过，欢迎你：" + userInfo.username || userInfo.phone
          );
          this.recordLoginInfo(userInfo);
          this.$authing.pub("login", userInfo);
        })
        .catch(err => {
          this.unLoading();
          this.showGlobalErr(err.message.message);
        });
    },
    handleSendingPhoneCode: function handleSendingPhoneCode() {
      if (!/^1[34578]\d{9}$/.test(this.loginByPhoneCodeForm.phone)) {
        this.showGlobalErr("请填写正确的手机号");
        this.addAnimation("login-phone");
        this.$authing.pub("loginError", "请填写正确的手机号");
        return;
      }
      this.setLoading();
      validAuth
        .getVerificationCode(this.loginByPhoneCodeForm.phone)
        .then(() => {
          this.unLoading();
          this.showGlobalSuccess("短信发送成功，请打开手机查看");
        })
        .catch(err => {
          this.unLoading();
          this.showGlobalErr(err.message);
        });
    }
  }
};
</script>
<style scoped>
</style>
