<template>
  <div class="can-hide header-locale">
    <a :href="zhCNLink" :class="isDefault ? 'active' : ''">简体中文</a> |
    <a :href="enUSLink" :class="!isDefault ? 'active' : ''">English</a>
  </div>
</template>

<script>
export default {
  name: "SwitchLocale",
  data() {
    return {};
  },
  computed: {
    isDefault() {
      return !(this.$page.path || "").startsWith("/en");
    },
    zhCNLink() {
      return "/v2" + (this.$page.path || "").replace(/^(\/en\/)/, "/");
    },
    enUSLink() {
      return "/v2/en" + (this.$page.path || "").replace(/^(\/en\/)/, "/");
    }
  }
};
</script>

<style lang="stylus">
.header-locale
  a
    color: #999
    font-size: 12px
    &.active
      color: #333
      font-weight: bold
</style>
