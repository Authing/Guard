<template>
  <form
    v-show="pageVisible.wxQRCodeVisible && !opts.hideQRCode"
    style="height:300px"
    class="authing-form no-shadow"
  >
    <div class="_authing_form-group" style="margin-top: -15px;">
      <div id="qrcode-node"></div>
    </div>
  </form>
</template>
<script>
export default {
  methods: {
    gotoWxQRCodeScanning: function gotoWxQRCodeScanning() {
      if (!(this.opts.hideOAuth && this.opts.hideUP)) {
        this.pageStack.push(this.getPageState());
      }
      this.turnOnPage("wxQRCodeVisible");

      var scanOpts = this.$authing.opts.qrcodeScanning || {
        redirect: true,
        interval: 1500,
        tips: "使用 微信 或小程序 身份管家 扫码登录"
      };

      let that = this;

      if (!this.isWxQRCodeGenerated) {
        validAuth.startWXAppScaning({
          mount: "qrcode-node",

          onSuccess: function(res) {
            that.$authing.pub("scanning", res);
            localStorage.setItem("_authing_token", res.data.token);
            that.recordLoginInfo(res.data);
          },

          onError: function(err) {
            that.$authing.pub("scanningError", err);
          },

          onIntervalStarting: function(interval) {
            that.$authing.pub("scanningIntervalStarting", interval);
          },

          interval: scanOpts.interval,

          redirect: scanOpts.redirect,

          tips: scanOpts.tips
        });
        this.isWxQRCodeGenerated = true;
      }
    },
  }
};
</script>
<style scoped>
</style>
