<template>
  <form class="authing-form no-shadow" style="min-height:300px">
    <div class="_authing_form-group" style="margin-top: -15px;">
      <div id="qrcode-node"></div>
    </div>
  </form>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "QRCode",
  data() {
    return {
      isWxQRCodeGenerated: false
    };
  },
  methods: {
    ...mapActions("data", ["recordLoginInfo"]),
    ...mapActions("protocol", ["handleProtocolProcess"])
  },
  created() {
    this.$authing = this.$root.$data.$authing;
    this.opts = this.$root.$data.$authing.opts;
  },
  mounted() {
    // var scanOpts = this.opts.qrcodeScanning || {
    //   redirect: true,
    //   interval: 1500,
    //   tips: "使用微信扫码登录"
    // };

    // let that = this;
    // let validAuth = window.validAuth;
    if (!this.isWxQRCodeGenerated) {
      console.log("111");
      // validAuth.startWXAppScaning({
      //   mount: "qrcode-node",
      //   enableFetchPhone: validAuth.clientInfo.useMiniLogin,
      //   useSelfWxapp: validAuth.clientInfo.useSelfWxapp,
      //   onSuccess: function(res) {
      //     console.log("bbb");
      //     that.$authing.pub("scanned-success", res.data);
      //     localStorage.setItem("_authing_token", res.data.token);
      //     that.recordLoginInfo(res.data);
      //     that.handleProtocolProcess({ router: that.$router });
      //   },

      //   onError: function(err) {
      //     that.$authing.pub("scanned-error", err);
      //     /*
      //     that.$router.replace({
      //       name: "error",s
      //       query: { message: "小程序扫码错误", code: "500" }
      //     });
      //     */
      //   },

      //   onIntervalStarting: function(interval) {
      //     that.$authing.pub("scanning-interval-starting", interval);
      //   },

      //   interval: scanOpts.interval,

      //   redirect: scanOpts.redirect,

      //   tips: scanOpts.tips
      // });
      this.isWxQRCodeGenerated = true;
    }
  }
};
</script>
<style scoped>
</style>
