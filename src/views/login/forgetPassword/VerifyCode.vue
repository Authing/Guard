<template>
  <div
    class="_authing_form-group"
    style="margin-top: -15px;"
  >
    <input
      type="text"
      class="_authing_input _authing_form-control"
      id="forget-password-verify-code"
      :placeholder="opts.placeholder.verfiyCode"
      autocomplete="off"
      v-model="forgetPasswordForm.verifyCode"
      @keyup.enter="handleSubmitForgetPasswordVerifyCode"
    >
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
</style>
