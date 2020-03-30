<template>
  <div>
    <div class="form-body authing-form no-shadow">
      <div class="_authing_form-group" style="margin-top: -15px;">
        <input
          type="text"
          class="_authing_input _authing_form-control"
          id="forget-password-email"
          :placeholder="opts.placeholder.email"
          autocomplete="off"
          v-model="email"
          @keydown.13="handleForgetPasswordSendEmail"
        />
      </div>
    </div>

    <div class="_authing_form-footer login" v-show="!opts.hideUP">
      <button @click="handleForgetPasswordSendEmail" class="btn btn-primary">
        <span v-show="!formLoading">发送邮件</span>
      </button>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  created() {
    this.$authing = this.$root.$data.$authing;
    this.opts = this.$root.$data.$authing.opts;
  },
  data() {
    return {
      email: ""
    };
  },
  computed: {
    ...mapGetters("loading", {
      formLoading: "form"
    })
  },
  methods: {
    ...mapActions("loading", ["changeLoading"]),
    ...mapActions("visibility", ["gotoForgetPasswordVerifyCode"]),
    ...mapActions("data", [
      "showGlobalMessage",
      "saveForgetPasswordEmail",
      "addAnimation"
    ]),

    handleForgetPasswordSendEmail() {
      var that = this;
      this.changeLoading({ el: "form", loading: true });

      if (!this.$root.emailExp.test(this.email)) {
        this.showGlobalMessage({
          type: "error",
          message: "请输入正确格式的邮箱"
        });
        this.addAnimation("forget-password-email");
        this.changeLoading({ el: "form", loading: false });
        this.$authing.pub("email-sent-error", "请输入正确格式的邮箱");
        return false;
      }
      validAuth
        .sendResetPasswordEmail({
          email: this.email
        })
        .then(data => {
          that.$authing.pub("email-sent", data);
          this.changeLoading({ el: "form", loading: false });
          this.showGlobalMessage({
            type: "success",
            message: "验证码已发送至您的邮箱：" + that.email
          });
          this.saveForgetPasswordEmail({ email: this.email });
          that.gotoForgetPasswordVerifyCode();
        })
        .catch(err => {
          that.$authing.pub("email-sent-error", err);
          that.changeLoading({ el: "form", loading: false });
          this.showGlobalMessage({
            type: "error",
            message: err.message.message
          });
        });
    }
  }
};
</script>
<style scoped></style>
