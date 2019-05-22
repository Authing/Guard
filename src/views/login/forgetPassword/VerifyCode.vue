<template>
  <div>
    <div class="form-body authing-form no-shadow">
      <div class="_authing_form-group" style="margin-top: -15px;">
        <input
          type="text"
          class="_authing_input _authing_form-control"
          id="forget-password-verify-code"
          autocomplete="off"
          :placeholder="opts.placeholder.verfiyCode"
          v-model="verifyCode"
        >
      </div>
    </div>
    <div class="_authing_form-footer login" v-show="!opts.hideUP">
      <button @click="handleSubmitForgetPasswordVerifyCode" class="btn btn-primary">提交验证码</button>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  created() {
    this.$authing = this.$root.$data.$authing;
    this.opts = this.$root.$data.$authing.opts;
    console.log(this.opts);
  },
  data() {
    return {
      verifyCode: ""
    };
  },
  computed: {
    ...mapGetters("data", ["forgetPasswordEmail"])
  },
  methods: {
    ...mapActions("loading", ["changeLoading"]),
    ...mapActions("visibility", ["gotoForgetPasswordNewPassword"]),
    ...mapActions("data", ["showGlobalMessage", "saveForgetPasswordVerifyCode", "addAnimation"]),
    handleSubmitForgetPasswordVerifyCode: function handleSubmitForgetPasswordVerifyCode() {
      var that = this;
      this.changeLoading({ el: "form", loading: true });
      if (!this.verifyCode) {
        this.changeLoading({ el: "form", loading: false });
        this.addAnimation("forget-password-verify-code");
        this.showGlobalMessage({
          type: "error",
          message: "请输入验证码"
        });
        this.$authing.pub("reset-password-error", "请输入验证码");
        return false;
      }
      ``;
      validAuth
        .verifyResetPasswordVerifyCode({
          email: that.forgetPasswordEmail,
          verifyCode: that.verifyCode
        })
        .then(data => {
          that.$authing.pub("reset-password", data);
          this.changeLoading({ el: "form", loading: false });
          this.showGlobalMessage({
            type: "success",
            message: data.message
          });
          this.saveForgetPasswordVerifyCode({verifyCode: this.verifyCode})
          this.gotoForgetPasswordNewPassword();
        })
        .catch(err => {
          that.$authing.pub("reset-password-error", err);
          this.changeLoading({ el: "form", loading: false });
          that.addAnimation("forget-password-verify-code");
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
