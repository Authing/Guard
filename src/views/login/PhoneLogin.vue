<template>
  <div>
    <form
      class="form-body"
      @submit.prevent="
        () => {
          return false;
        }
      "
    >
      <div style="margin-bottom:16px" class="authing-form no-shadow">
        <div class="_authing_form-group">
          <input
            type="text"
            class="_authing_input _authing_form-control"
            id="login-phone"
            v-model="phone"
            :placeholder="opts.placeholder.phone"
            autocomplete="off"
            @blur="nextStepOrSubmit"
            @focus="focusInput"
          />
          <span class="phoneTips" v-show="showTips">请输入正确的手机号码</span>
        </div>
        <div
          class="_authing_form-group"
          style="display:flex; align-items: flex-end;"
          v-if="this.loginMethod == 'code'"
        >
          <input
            type="number"
            class="_authing_input _authing_form-control"
            id="login-phoneCode"
            v-model="phoneCode"
            :placeholder="opts.placeholder.phoneCode"
            autocomplete="off"
            @keyup.enter="handleLoginByPhoneCode"
          />
          <div class="phone-code-wrapper" style="flex-basis: 50%;">
            <button
              @click="handleSendingPhoneCode"
              style="height: 40px;font-size: 12px;border-radius: 0px;border:none;"
              class="btn btn-primary"
              :class="{ 'btn-ban': countDown !== 0 }"
            >{{ countDown === 0 ? "获取验证码" : `${countDown} 秒后重试` }}</button>
          </div>
        </div>
        <el-checkbox label="隐私政策" v-model="checked" @change="changeCheck">
          <router-link
            target="_blank"
            :to="{path:'/PrivacyPolicy'}"
            style="    text-decoration: none;
    font-size: 12px;
    color: #6a5d5d;"
          >同意《隐私政策》</router-link>
        </el-checkbox>
        <br />
        <span class="privateTips" v-show="showPriTips">请同意隐私政策</span>
      </div>
    </form>
    <div class="_authing_form-footer login" v-show="!opts.hideUP">
      <button @click="handleLogin" class="btn btn-primary">
        <span v-show="!formLoading">登录</span>
      </button>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      showTips: false,
      countDown: 0,
      loginMethod: "code",
      phone: "",
      phoneCode: "",
      checked: true,
      showPriTips: false
    };
  },
  created() {
    this.$authing = this.$root.$data.$authing;
    this.opts = this.$root.$data.$authing.opts;
  },
  computed: {
    ...mapGetters("loading", {
      formLoading: "form"
    }),
    ...mapGetters("data", ["signUpPhone", "signUpPassword"])
  },
  mounted() {
    this.phone = this.signUpPhone || "";
  },
  methods: {
    ...mapActions("visibility", [
      "changeVisibility",
      "gotoForgetPassword",
      "gotoLogin",
      "gotoUsingPhonePassword"
    ]),
    ...mapActions("data", [
      "showGlobalMessage",
      "removeAnimation",
      "removeRedLine",
      "addRedLine",
      "addAnimation",
      "recordLoginInfo"
    ]),
    ...mapActions("protocol", ["handleProtocolProcess"]),
    ...mapActions("loading", ["changeLoading"]),
    handleLogin() {
      this.handleLoginByPhoneCode();
    },
    nextStepOrSubmit() {
      if (!/^1[3-8]\d{9}$/.test(this.phone)) {
        this.showTips = true;
      } else {
        this.showTips = false;
      }
    },
    focusInput() {
      this.showTips = false;
    },
    changeCheck(e) {
      if (e === true) {
        this.showPriTips = false;
      }
    },
    handleLoginByPhoneCode() {
      if (this.checked === false) {
        this.showPriTips = true;
        return false;
      }
      if (!this.phoneCode) {
        this.addAnimation("login-phoneCode");
        this.showGlobalMessage({
          type: "error",
          message: "请输入验证码"
        });
        this.$authing.pub("login-error", "请输入验证码");
        this.$authing.pub("authenticated-error", "请输入验证码");
        return;
      }
      if (this.phoneCode.length !== 4) {
        this.showGlobalMessage({
          type: "error",
          message: "验证码为四位，请重新输入"
        });
        this.addAnimation("login-phoneCode");
        this.$authing.pub("login-error", "验证码为四位，请重新输入");
        this.$authing.pub("authenticated-error", "验证码为四位，请重新输入");
        return;
      }
      this.changeLoading({ el: "form", loading: true });
      validAuth
        .loginByPhoneCode({ phone: this.phone, phoneCode: this.phoneCode })
        .then(userInfo => {
          this.showGlobalMessage({
            type: "success",
            message:
              "验证通过，欢迎你：" + (userInfo.username || userInfo.phone)
          });
          this.recordLoginInfo(userInfo);
          this.$authing.pub("login", userInfo);
          this.$authing.pub("authenticated", userInfo);
          this.handleProtocolProcess({ router: this.$router });
          this.changeLoading({ el: "form", loading: false });
        })
        .catch(err => {
          this.changeLoading({ el: "form", loading: false });
          this.showGlobalMessage({
            type: "error",
            message: err.message.message
          });
        });
    },
    handleSendingPhoneCode: function handleSendingPhoneCode() {
      if (this.countDown !== 0) {
        return;
      }
      if (this.showTips) {
        return false;
      } else {
        this.changeLoading({ el: "form", loading: true });
        this.countDown = 60;
        const timer = setInterval(() => {
          this.countDown -= 1;
          if (this.countDown <= 0) {
            clearInterval(timer);
            this.countDown = 0;
          }
        }, 1000);
        validAuth
          .getVerificationCode(this.phone)
          .then(() => {
            this.changeLoading({ el: "form", loading: false });

            this.showGlobalMessage({
              type: "success",
              message: "短信发送成功，请打开手机查看"
            });
          })
          .catch(err => {
            this.changeLoading({ el: "form", loading: false });

            this.showGlobalMessage({
              type: "error",
              message: JSON.parse(err.message).message
            });
          });
      }
    }
  }
};
</script>
<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.phone-code-wrapper > .btn {
  width: 100%;
  border-radius: 0px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 60px;
  font-size: 16px;
  background: #00a1ea;
  box-shadow: none !important;
  font-weight: 200;
  color: #fff;
  outline: 0;
  cursor: pointer;
}
.phoneTips,
.privateTips {
  color: red;
  font-size: 12px;
}
</style>
