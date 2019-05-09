<template>
  <div
    class="_authing_form-group"
    style="margin-top: -15px;"
  >
    <input
      type="password"
      class="_authing_input _authing_form-control"
      id="forget-password-new-password"
      :placeholder="opts.placeholder.newPassword"
      autocomplete="off"
      v-model="forgetPasswordForm.password"
      @keyup.enter="handleSubmitForgetPasswordNewPassword"
    >
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
</style>
