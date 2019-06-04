<template>
  <div class="_authing-logmod__alter">
    <div class="logmod__alter-container">
      <a
        :href="url"
        class="_authing_a _authing-connect"
        :style="buttonStyle"
        @click.prevent="handleClick"
      >
        <div class="_authing-connect__icon" :style="iconStyle">
          <i class="_authing_iconfont">{{icon}}</i>
        </div>
        <div class="_authing-connect__context">
          <span>{{name}}</span>
        </div>
      </a>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
  mounted() {
    window.addEventListener("message", this.receiveMessage, false);
  },
  methods: {
    ...mapActions("protocol", ["handleProtocolProcess"]),
    ...mapActions("data", ["recordLoginInfo", "showGlobalMessage"]),
    ...mapActions("loading", ["changeLoading"]),
    handleClick() {
      let leftVal = (screen.width - 500) / 2;
      let topVal = (screen.height - 700) / 2;
      let that = this;
      that.changeLoading({ el: "form", loading: true });
      let popup = window.open(
        this.url,
        "_blank",
        `width=500,height=700,left=${leftVal},top=${topVal}`
      );
      let timer = setInterval(function() {
        // 每秒检查登录窗口是否已经关闭
        if (popup.closed) {
          clearInterval(timer);
          that.changeLoading({ el: "form", loading: false });
          if (!localStorage.getItem("_authing_token")) {
            that.showGlobalMessage({
              type: "error",
              message: "未在第三方完成登录"
            });
          }
        }
      }, 1000);
    },
    receiveMessage(event) {
      try {
        let data = event.data;
        let userInfo = data.data
        this.recordLoginInfo(userInfo);
        localStorage.setItem("_authing_token", userInfo.token);
        this.handleProtocolProcess({ router: this.$router });
        this.changeLoading({ el: "form", loading: false });
      } catch (e) {
        console.log(e);
        this.changeLoading({ el: "form", loading: false });
        this.showGlobalMessage({ type: "error", message: e.message });
      }
    }
  },
  props: {
    name: {
      type: String,
      default: "默认名称"
    },
    icon: {
      type: String,
      default: ""
    },
    buttonStyle: {
      type: Object
    },
    iconStyle: {
      type: Object
    },
    url: {
      type: String
    }
  }
};
</script>
<style scoped>
</style>
