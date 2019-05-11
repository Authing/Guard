<template>
  <button class="_authing-logmod__alter">
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
  </button>
</template>
<script>
export default {
  methods: {}
};
</script>
<style scoped>
</style>
