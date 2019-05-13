<template>
  <form class="authing-form no-shadow"><!--style="height:300px"-->
    <div class="_authing_form-group" style="margin-top: -15px;">
      <div id="qrcode-node"></div>
    </div>
  </form>
</template>
<script>
export default {
  name: 'QRCode',
  data() {
    return {
      isWxQRCodeGenerated: false
    }
  },
  created() {
    this.$authing = this.$root.$data.$authing;
    this.opts = this.$root.$data.$authing.opts;
  },
  mounted() {
    var scanOpts = this.opts.qrcodeScanning || {
      redirect: true,
      interval: 1500,
      tips: "使用 微信 或小程序 身份管家 扫码登录"
    };

    let that = this;
    let validAuth = window.validAuth
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
  }
};
</script>
<style scoped>
</style>
