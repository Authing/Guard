<template>
  <div>
    <div class="form-body authing-form no-shadow">
      <div class="_authing_form-group" style="margin-top: -15px;">
        <input
          type="password"
          class="_authing_input _authing_form-control"
          id="forget-password-new-password"
          autocomplete="off"
          v-model="password"
          :placeholder="opts.placeholder.newPassword"
        >
      </div>
    </div>
    <div class="_authing_form-footer login" v-show="!opts.hideUP">
      <button @click="handleSubmitForgetPasswordNewPassword" class="btn btn-primary">提交新密码</button>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      password: ""
    };
  },
  computed: {
    ...mapGetters("data", ["forgetPasswordVerifyCode", "forgetPasswordEmail"])
  },
  created() {
    this.$authing = this.$root.$data.$authing;
    this.opts = this.$root.$data.$authing.opts;
    console.log(this.opts);
  },
  methods: {
    ...mapActions("loading", ["changeLoading"]),
    ...mapActions("visibility", ["gotoLogin"]),
    ...mapActions("data", ["showGlobalMessage", "saveSignUpInfo"]),
    handleSubmitForgetPasswordNewPassword() {
      var that = this;
      this.changeLoading({ el: "form", loading: true });
      validAuth
        .changePassword({
          email: that.forgetPasswordEmail,
          password: this.password,
          verifyCode: that.forgetPasswordVerifyCode
        })
        .then(data => {
          that.$authing.pub("resetPassword", data);
          this.changeLoading({ el: "form", loading: false });
          this.showGlobalMessage({
            type: "success",
            message: "修改密码成功"
          });
          that.saveSignUpInfo({email: that.forgetPasswordEmail, password: this.password})

          that.gotoLogin();
        })
        .catch(err => {
          that.$authing.pub("resetPasswordError", err);
          this.changeLoading({ el: "form", loading: false });
          this.showGlobalMessage({
            type: "error",
            message: err.message.message
          });
        });
    }
  }
};
</script>
<style scoped>
</style>
