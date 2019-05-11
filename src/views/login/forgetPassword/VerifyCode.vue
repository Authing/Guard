<template>
  <div
    class="_authing_form-group"
    style="margin-top: -15px;"
  >
    <input
      type="text"
      class="_authing_input _authing_form-control"
      id="forget-password-verify-code"
      autocomplete="off"
    >
  </div>
</template>
<script>
export default {
  methods: {
    handleSubmitForgetPasswordVerifyCode: function handleSubmitForgetPasswordVerifyCode() {
      var that = this;
      that.setLoading();
      if (!this.forgetPasswordForm.verifyCode) {
        that.unLoading();
        this.addAnimation("forget-password-verify-code");

        that.showGlobalErr("请输入验证码");
        this.$authing.pub("resetPasswordError", "请输入验证码");
        return false;
      }
      validAuth
        .verifyResetPasswordVerifyCode({
          email: that.forgetPasswordForm.email,
          verifyCode: that.forgetPasswordForm.verifyCode
        })
        .then(function(data) {
          that.$authing.pub("resetPassword", data);
          that.unLoading();
          that.showGlobalSuccess(data.message);
          that.pageVisible.forgetPasswordVerifyCodeVisible = false;
          that.pageVisible.forgetPasswordNewPasswordVisible = true;
        })
        .catch(function(err) {
          that.$authing.pub("resetPasswordError", err);
          that.unLoading();
          that.addAnimation("forget-password-verify-code");
          that.showGlobalErr(err.message.message);
        });
    },
  }
};
</script>
<style scoped>
</style>
