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
export default {
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
    },
    isNative: {
      type: Boolean,
      default: false
    },
    loginType: {
      type: String,
      default: ""
    }
  },
  methods: {
    handleClick() {
      if (this.isNative) {
        this.$emit("post-start-native-login-message", this.loginType);
      } else {
        this.$emit("social-btn-click", this.url);
      }
    }
  }
};
</script>
<style scoped>
</style>
