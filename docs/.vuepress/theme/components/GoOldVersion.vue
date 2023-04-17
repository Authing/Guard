<template>
  <a class="old-version" :href="$site.themeConfig.oldDocUrl">
    <IconFont type="authing-fanhuijiuban" />
    {{ $themeLocaleConfig.oldVersion }}
  </a>
</template>

<script>
import IconFont from '@theme/components/IconFont/index.vue'

export default {
  name: 'GoOldVersion',
  components: {
    IconFont,
  },
  data() {
    return {}
  },
}
</script>

<style lang="stylus">
.old-version
  color #6D7278
  font-weight normal
  margin-left 24px
  cursor pointer
  font-size 14px
  &:hover
    color $accentColor
</style>
