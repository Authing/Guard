
<template>
  <div class="authing-oauth-form">
    <div style="height: 60px;" v-show="socialButtonsListLoading">
      <div class="authing-loading-circle margin-top-11"></div>
    </div>

    <SocialButton
      v-for="(item) in socialButtonsList"
      :key="item._id"
      :name="item.description"
      :icon="socialButtonsThemes[item.alias].icon"
      :iconStyle="socialButtonsThemes[item.alias].iconStyle"
      :buttonStyle="socialButtonsThemes[item.alias].buttonStyle"
      :url="item.url"
      :isNative="item.isNative"
      :loginType="item.alias"
      @social-btn-click="handleClick"
      @post-start-native-login-message="postStartNativeLoginMessage"
      class="_authing_form-group"
    />
  </div>
</template>
<script>
import SocialButton from "../components/SocialButton";
import { mapGetters, mapActions, mapMutations } from "vuex";
import themes from "../themes/themes";

export default {
  name: "SocialButtonsList",
  components: {
    SocialButton
  },
  created() {
    this.$authing = this.$root.$data.$authing;
    this.opts = this.$root.$data.$authing.opts;
  },

  mounted() {
    window.addEventListener("message", this.receiveMessage, false);
  },
  data() {
    return {
      socialButtonsThemes: themes.socialButton
    };
  },

  methods: {
    ...mapActions("protocol", ["handleProtocolProcess"]),
    ...mapActions("data", ["recordLoginInfo", "showGlobalMessage"]),
    ...mapActions("loading", ["changeLoading"]),
    ...mapActions("visibility", ["gotoMFACode"]),
    ...mapMutations("data", ["setLoginOpt", "setLoginType"]),
    handleClick(url) {
      let leftVal = (screen.width - 500) / 2;
      let topVal = (screen.height - 700) / 2;
      let that = this;
      that.changeLoading({ el: "form", loading: true });
      let popup = window.open(
        url,
        "_blank",
        `width=500,height=700,left=${leftVal},top=${topVal}`
      );
      this.showGlobalMessage({ type: "warn", message: "正在进行社会化登录" });
      let timer = setInterval(function() {
        // 每秒检查登录窗口是否已经关闭
        if (popup.closed) {
          clearInterval(timer);
          that.changeLoading({ el: "form", loading: false });
          if (
            !localStorage.getItem("_authing_token") &&
            that.globalMessage === "正在进行社会化登录"
          ) {
            that.showGlobalMessage({
              type: "error",
              message: "取消社会化登录"
            });
          }
        }
      }, 1000);
    },
    receiveMessage(event) {
      try {
        let data = event.data;
        let code = data.code;
        let message = data.message;
        // 判断是不是来自 authing 社会化登录的 post message
        if (typeof code === "number") {
          if (code === 1635) {
            this.setLoginType({ loginType: "social" });
            this.setLoginOpt(data.loginOpt);
            this.showGlobalMessage({
              type: "error",
              message: message.replace(/"/g, "")
            });
            this.gotoMFACode();
            return;
          }
          if (code !== 200) {
            console.log(data);
            throw Error(message);
          }
          let userInfo = data.data;
          this.recordLoginInfo(userInfo);
          localStorage.setItem("_authing_token", userInfo.token);
          this.handleProtocolProcess({ router: this.$router });
          this.$authing.pub("authenticated", data.data);
          this.showGlobalMessage({
            type: "success",
            message: "验证通过，欢迎你：" + data.data.username
          });
          this.changeLoading({ el: "form", loading: false });
        }
      } catch (e) {
        console.log(e);
        this.changeLoading({ el: "form", loading: false });
        this.showGlobalMessage({ type: "error", message: e.message });
      }
    },

    postStartNativeLoginMessage(loginType) {
      this.$authing.pub("start-native-login", loginType);
      this.showGlobalMessage({ type: "warn", message: "正在进行社会化登录" });
      const self = this;

      function waitForNativeResponse() {
        if (
          window.ReactNativeWebView &&
          window.ReactNativeWebView.nativeLoginResponse
        ) {
          // console.log(window.ReactNativeWebView.nativeLoginResponse)
          const {
            loginMethod,
            success,
            data
          } = window.ReactNativeWebView.nativeLoginResponse;
          console.log(window.ReactNativeWebView.nativeLoginResponse);
          if (success) {
            self.showGlobalMessage({
              type: "success",
              message: "验证通过，欢迎你：" + data.nickname || data.username
            });
            data._loginMethod = "支付宝";
            self.$authing.pub("login", data);
            self.$authing.pub("authenticated", data);
          } else {
            const errmsg = !!data ? "登录失败：" + data : "登录失败";
            self.showGlobalMessage({
              type: "error",
              message: errmsg
            });
            self.$authing.pub(
              "login-error",
              `${loginType} 登录失败：${errmsg}`
            );
          }
          delete window.ReactNativeWebView.nativeLoginResponse;
        } else {
          setTimeout(waitForNativeResponse, 200);
        }
      }

      waitForNativeResponse();
    }
  },
  computed: {
    ...mapGetters("loading", { socialButtonsListLoading: "socialButtonsList" }),
    ...mapGetters("data", {
      socialButtonsList: "socialButtonsList",
      globalMessage: "globalMessage"
    })
  }
};
</script>
<style scoped>
</style>
