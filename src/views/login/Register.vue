<template>
  <div>
    <form class="authing-form no-shadow">
      <div v-show="!opts.hideUsername" class="_authing_form-group">
        <input
          type="text"
          class="_authing_input _authing_form-control"
          id="sign-up-username"
          v-model="signUpForm.username"
          :placeholder="opts.placeholder.username"
          autocomplete="off"
          @keyup.enter="handleSignUp"
        >
      </div>
      <div class="_authing_form-group">
        <input
          type="email"
          class="_authing_input _authing_form-control"
          id="sign-up-email"
          v-model="signUpForm.email"
          @blur="checkEmail"
          :placeholder="opts.placeholder.email"
          autocomplete="off"
          @keyup.enter="handleSignUp"
        >
      </div>
      <div class="_authing_form-group">
        <input
          type="password"
          class="_authing_input _authing_form-control"
          id="sign-up-password"
          v-model="signUpForm.password"
          :placeholder="opts.placeholder.password"
          autocomplete="off"
          @keyup.enter="handleSignUp"
        >
      </div>
      <div class="_authing_form-group">
        <input
          type="password"
          class="_authing_input _authing_form-control"
          :class="{'err-hint': signUpForm.password!==signUpForm.rePassword}"
          id="sign-up-re-password"
          v-model="signUpForm.rePassword"
          :placeholder="opts.placeholder.password"
          autocomplete="off"
          @keyup.enter="handleSignUp"
        >
      </div>
    </form>
  </div>
</template>
<script>
export default {
  props: {
    opts: {
      type: Object
    }
  }
};
</script>
<style scoped>
</style>
