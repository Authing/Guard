<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="`#${type}`"></use>
  </svg>
</template>

<script>
export default {
  name: 'IconFont',
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  mounted() {
    import('./iconfont.js').then((icon) => {})
  },
}
</script>

<style>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
