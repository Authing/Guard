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
  methods: {
    ...mapActions("protocol", ["handleProtocolProcess"]),
    ...mapActions("data", ["recordLoginInfo", "showGlobalMessage"]),
    handleClick() {
      let leftVal = (screen.width - 500) / 2;
      let topVal = (screen.height - 700) / 2;
      let that = this;
      window.open(
        this.url,
        "_blank",
        `width=500,height=700,left=${leftVal},top=${topVal}`
      );
      window.addEventListener("message", receiveMessage, false);
      function receiveMessage(event) {
        try {
          
          let data = event.data;
          console.log("message data");
          console.log(data);
          that.recordLoginInfo(data)
          localStorage.setItem('_authing_token', data.token)
          that.handleProtocolProcess({ router: that.$router });
        } catch (e) {
          console.log(e)
          that.showGlobalMessage({type: 'error', message: e.message})
        }
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
