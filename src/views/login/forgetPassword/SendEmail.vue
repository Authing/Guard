<template>
  <div class="_authing_form-group" style="margin-top: -15px;">
    <input
      type="text"
      class="_authing_input _authing_form-control"
      id="forget-password-email"
      autocomplete="off"
    >
  </div>
</template>
<script>
export default {
  data() {
    return {
      email: ""
    };
  },
  methods: {
    handleForgetPasswordSendEmail: function handleForgetPasswordSendEmail() {
      var that = this;
      that.setLoading();
      if (!this.$root.emailExp.test(this.forgetPasswordForm.email)) {
        this.showGlobalErr("请输入正确格式的邮箱");
        this.addAnimation("forget-password-email");
        that.unLoading();
        this.$authing.pub("emailSentError", "请输入正确格式的邮箱");
        return false;
      }
      validAuth
        .sendResetPasswordEmail({
          email: this.forgetPasswordForm.email
        })
        .then(function(data) {
          that.$authing.pub("emailSent", data);
          that.unLoading();
          that.showGlobalSuccess(
            "验证码已发送至您的邮箱：" + that.forgetPasswordForm.email
          );
          that.pageVisible.forgetPasswordSendEmailVisible = false;
          that.pageVisible.forgetPasswordVerifyCodeVisible = true;
        })
        .catch(function(err) {
          that.$authing.pub("emailSentError", err);
          that.unLoading();
          that.showGlobalErr(err.message);
        });
    }
  }
};
</script>
<style scoped>
</style>
