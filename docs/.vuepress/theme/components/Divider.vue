<template>
  <div
    :style="{
      height,
    }"
    class="authing-divider"
  ></div>
</template>

<script>
export default {
  props: {
    height: {
      type: String,
      default: '21px',
    },
  },
  name: 'Divider',
}
</script>

<style lang="stylus">
.authing-divider {
  width 1px
  min-width 1px
  background-color #eee
  margin 0 11px
  display inline-block
  vertical-align middle
}
</style>
