<template>
  <div
    class="_authing_form-group"
    style="margin-top: -15px;"
  >
    <input
      type="text"
      class="_authing_input _authing_form-control"
      id="forget-password-email"
      :placeholder="opts.placeholder.email"
      autocomplete="off"
      v-model="forgetPasswordForm.email"
      @keyup.enter="handleForgetPasswordSendEmail"
    >
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
</style>
