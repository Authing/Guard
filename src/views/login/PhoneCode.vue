<template>
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
</template>
<script>
export default {};
</script>
<style scoped>
</style>
