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
export default {};
</script>
<style scoped>
</style>
