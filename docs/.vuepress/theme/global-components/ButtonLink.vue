<template>
  <div>
    <a :href="href" target="_blank" class="button-link">
      <slot />
    </a>
  </div>
</template>

<script>
export default {
  name: "ButtonLink",
  props: {
    href: {
      type: String
    }
  }
};
</script>

<style lang="stylus">
.button-link
  color: #fff
  border: 2px solid $accentColor
  background: $accentColor
  border-radius: 4px
  padding: 6px 16px
  &:hover
    text-decoration: none !important
</style>
