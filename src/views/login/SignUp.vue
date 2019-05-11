<template>
  <div>
    <form v-show="pageVisible.signUpVisible" class="authing-form no-shadow">
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

    <button
      v-show="pageVisible.signUpVisible && !loading"
      @click="handleSignUp"
      class="btn btn-primary"
    >注册</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      signUpForm: {
        username: "",
        password: "",
        email: "",
        rePassword: ""
      }
    };
  },
  methods: {
    handleSignUp: function handleSignUp() {
      var that = this;
      that.setLoading();

      if (!this.$authing.opts.hideUsername && !this.signUpForm.username) {
        this.showGlobalErr("请输入用户名");
        this.addAnimation("sign-up-username");
        this.removeRedLine("sign-up-email");
        this.removeRedLine("sign-up-password");
        this.removeRedLine("sign-up-re-password");
        that.unLoading();
        this.$authing.pub("registerError", "请输入用户名");
        return false;
      }
      if (!this.$root.emailExp.test(this.signUpForm.email)) {
        this.showGlobalErr("请输入正确格式的邮箱");
        this.addAnimation("sign-up-email");
        this.removeRedLine("sign-up-username");
        this.removeRedLine("sign-up-password");
        this.removeRedLine("sign-up-re-password");
        that.unLoading();
        this.$authing.pub("registerError", "请输入正确格式的邮箱");
        return false;
      }
      if (!this.signUpForm.password) {
        this.showGlobalErr("请输入密码");
        this.addAnimation("sign-up-password");
        this.this.removeRedLine("sign-up-username");
        this.removeRedLine("sign-up-email");
        this.removeRedLine("sign-up-re-password");
        that.unLoading();
        this.$authing.pub("registerError", "请输入密码");
        return false;
      }
      if (this.signUpForm.password !== this.signUpForm.rePassword) {
        this.showGlobalErr("两次密码不一致");
        this.addAnimation("sign-up-re-password");
        this.removeRedLine("sign-up-username");
        this.removeRedLine("sign-up-email");
        this.removeRedLine("sign-up-password");
        that.unLoading();
        this.$authing.pub("registerError", "两次密码不一致");
        return false;
      }
      validAuth
        .register({
          email: this.signUpForm.email,
          username: this.signUpForm.username,
          password: this.signUpForm.password
        })
        .then(function(data) {
          that.unLoading();
          that.errVisible = false;
          that.gotoLogin();
          that.loginForm = {
            email: that.signUpForm.email,
            password: that.signUpForm.password
          };
          that.signUpForm = {
            username: "",
            password: "",
            email: "",
            rePassword: ""
          };
          that.rememberMe = false;
          that.showGlobalSuccess("注册成功");
          that.$authing.pub("register", data);
        })
        .catch(function(err) {
          that.unLoading();
          that.showGlobalErr(err.message.message);
          that.$authing.pub("registerError", err);
          if (err.message.code === 2026) {
            that.addAnimation("sign-up-email");
            that.emoveRedLine("sign-up-re-password");
            that.removeRedLine("sign-up-username");
            that.removeRedLine("sign-up-password");
          }
        });
    }
  }
};
</script>
<style scoped>
</style>
