<template>
  <NavLink class="know-more" :item="link">
    {{ $themeLocaleConfig.knowMore }}
    <ArrowRight
      :style="{
        marginLeft: '4px',
      }"
    />
  </NavLink>
</template>

<script>
import NavLink from '@theme/components/NavLink.vue'
import ArrowRight from '@theme/components/Icons/ArrowRight.vue'

export default {
  name: 'KnowMore',
  components: {
    NavLink,
    ArrowRight,
  },
  props: {
    link: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="stylus">
.know-more
  color $accentColor
  font-size 14px
  &:hover
    color #2e55cc
</style>
