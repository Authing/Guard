<template>
  <DropdownLink class="lang-select-outline" :item="languageLinks">
    <template #arrow>
      <div class="lang-select-outline-arrow"></div>
    </template>
  </DropdownLink>
</template>

<script>
import { resolveNavLinkItem } from '@theme/util'
import DropdownLink from '@theme/components/DropdownLink.vue'

export default {
  name: 'LangSelectOutline',
  components: {
    DropdownLink,
  },
  computed: {
    languageDropdown() {
      const { locales } = this.$site
      const currentLink = this.$page.path
      const themeLocales = this.$site.themeConfig.locales || {}
      const routes = this.$router.options.routes

      return {
        text: this.$themeLocaleConfig.selectText || 'Languages',
        ariaLabel: this.$themeLocaleConfig.ariaLabel || 'Select language',
        items: Object.keys(locales).map((path) => {
          const locale = locales[path]
          const text =
            (themeLocales[path] && themeLocales[path].label) || locale.lang
          let link
          // Stay on the current page
          if (locale.lang === this.$lang) {
            link = currentLink
          } else {
            // Try to stay on the same page
            link = currentLink.replace(this.$localeConfig.path, path)
            // fallback to homepage
            if (!routes.some((route) => route.path === link)) {
              link = path
            }
          }
          return { text, link }
        }),
      }
    },
    languageLinks() {
      return Object.assign(this.languageDropdown, {
        items: this.languageDropdown.items.map(resolveNavLinkItem),
      })
    },
  },
}
</script>

<style lang="stylus">
.lang-select-outline
  position relative
  border 1px solid #D9D9D9
  border-radius 2px
  padding-left 10px
  padding-right 30px
  line-height 32px
  height 32px
  padding-top 1px
  box-sizing border-box
  .nav-dropdown
    // transform translateY(4px)
    width 100%
  .title
    color #999
  .lang-select-outline-arrow
    width 8px
    height 8px
    position absolute
    right 12px
    transform rotate(45deg)
    top: 8px
    border 1px solid #999999
    border-left-color transparent
    border-top-color transparent
</style>
