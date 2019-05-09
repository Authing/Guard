
<template>
  <div
    class="authing-oauth-form"
    v-show="!pageVisible.forgetPasswordVisible && !pageVisible.wxQRCodeVisible && !opts.hideOAuth"
  >
    <div style="height: 60px;" v-show="oAuthloading">
      <div class="authing-loading-circle margin-top-11"></div>
    </div>

    <div v-for="(item) in OAuthList" :key="item._id" class="_authing_form-group">
      <div class="_authing-logmod__alter">
        <div class="logmod__alter-container">
          <a
            :href="item.url"
            :class="{'_authing_a': true, '_authing-connect': true, 'github': item.alias === 'github', 'wechat': item.alias === 'wechatpc'}"
          >
            <div class="_authing-connect__icon">
              <i class="_authing_iconfont" v-if="item.alias === 'github'">&#xea0a;</i>
              <i class="_authing_iconfont" v-if="item.alias === 'wechatpc'">&#xf262;</i>
            </div>
            <div class="_authing-connect__context">
              <span>{{item.description}}</span>
            </div>
          </a>
        </div>
      </div>
    </div>
    <P class="_authing_form-tip" v-show="!oAuthloading && OAuthList.length > 0 && !opts.hideUP">或者</P>
  </div>
</template>
<script>
export default {};
</script>
<style scoped>
</style>
