<template>
  <div
    class="_authing_form-group"
    style="margin-top: -15px;"
  >
    <input
      type="password"
      class="_authing_input _authing_form-control"
      id="forget-password-new-password"
      autocomplete="off"
    >
  </div>
</template>
<script>
export default {
  methods: {
    handleSubmitForgetPasswordNewPassword: function handleSubmitForgetPasswordNewPassword() {
      var that = this;
      that.setLoading();
      validAuth
        .changePassword({
          email: that.forgetPasswordForm.email,
          password: that.forgetPasswordForm.password,
          verifyCode: that.forgetPasswordForm.verifyCode
        })
        .then(function(data) {
          that.$authing.pub("resetPassword", data);
          that.unLoading();
          that.showGlobalSuccess("修改密码成功");
          that.gotoLogin();
        })
        .catch(function(err) {
          that.$authing.pub("resetPasswordError", err);
          that.unLoading();
          that.showGlobalErr(err.message.message);
        });
    },
  }
};
</script>
<style scoped>
</style>
