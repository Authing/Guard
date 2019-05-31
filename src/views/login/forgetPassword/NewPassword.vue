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
      <button @click="handleSubmitForgetPasswordNewPassword" class="btn btn-primary"><span v-show="!formLoading">提交新密码</span></button>
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
    ...mapGetters("data", ["forgetPasswordVerifyCode", "forgetPasswordEmail"]),
    ...mapGetters("loading", {
      formLoading: "form"
    }),
  },
  created() {
    this.$authing = this.$root.$data.$authing;
    this.opts = this.$root.$data.$authing.opts;
    console.log(this.opts);
  },
  methods: {
    ...mapActions("loading", ["changeLoading"]),
    ...mapActions("visibility", ["gotoLogin"]),
    ...mapActions("data", ["showGlobalMessage", "saveSignUpInfo", "addAnimation"]),
    handleSubmitForgetPasswordNewPassword() {
      var that = this;
      this.changeLoading({ el: "form", loading: true });
      // 密码非空检验
      if (!this.password) {
        this.showGlobalMessage({
          type: "error",
          message: "请输入密码"
        });
        this.addAnimation("forget-password-new-password");
        this.changeLoading({ el: "form", loading: false });
        this.$authing.pub("reset-password-error", "请输入密码");
        return false;
      }
      if (this.password.length < 6) {
        this.showGlobalMessage({
          type: "error",
          message: "密码长度不能小于 6 位"
        });
        this.addAnimation("forget-password-new-password");
        this.changeLoading({ el: "form", loading: false });
        this.$authing.pub("reset-password-error", "密码长度不能小于 6 位");
        return false;
      }
      validAuth
        .changePassword({
          email: that.forgetPasswordEmail,
          password: this.password,
          verifyCode: that.forgetPasswordVerifyCode
        })
        .then(data => {
          that.$authing.pub("reset-password", data);
          this.changeLoading({ el: "form", loading: false });
          this.showGlobalMessage({
            type: "success",
            message: "修改密码成功"
          });
          that.saveSignUpInfo({email: that.forgetPasswordEmail, password: this.password})
          that.gotoLogin();
        })
        .catch(err => {
          that.$authing.pub("reset-password-error", err);
          this.changeLoading({ el: "form", loading: false });
          this.showGlobalMessage({
            type: "error",
            message: err.message.message || err.message
          });
        });
    }
  }
};
</script>
<style scoped>
</style>
