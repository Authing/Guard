
<template>
  <div
    class="authing-oauth-form"
  >
    <div style="height: 60px;" v-show="oAuthloading">
      <div class="authing-loading-circle margin-top-11"></div>
    </div>

    <SocialButton v-for="(item) in OAuthList" :key="item._id" class="_authing_form-group"/>
  </div>
</template>
<script>
import SocialButton from '../components/SocialButton'
export default {
  name: 'OAuthList',
  components: {
    SocialButton
  }
};
</script>
<style scoped>
</style>
