import { resolveNavLinkItem } from '@theme/util'

export const formatNavLinks = (links) => {
  return (links || []).map((link) => {
    return Object.assign(resolveNavLinkItem(link), {
      items: (link.items || []).map(resolveNavLinkItem),
    })
  })
}

export const getUserNavLinks = (vm) => {
  return formatNavLinks(
    vm.$themeLocaleConfig.nav || vm.$site.themeConfig.nav || []
  )
}

export const getLanguageNavLinks = (vm) => {
  const { locales } = vm.$site

  if (locales && Object.keys(locales).length > 1) {
    const currentLink = vm.$page.path
    const routes = vm.$router.options.routes
    const themeLocales = vm.$site.themeConfig.locales || {}
    const languageDropdown = {
      text: vm.$themeLocaleConfig.selectText || 'Languages',
      ariaLabel: vm.$themeLocaleConfig.ariaLabel || 'Select language',
      items: Object.keys(locales).map((path) => {
        const locale = locales[path]
        const text =
          (themeLocales[path] && themeLocales[path].label) || locale.lang
        let link
        // Stay on the current page
        if (locale.lang === vm.$lang) {
          link = currentLink
        } else {
          // Try to stay on the same page
          link = currentLink.replace(vm.$localeConfig.path, path)
          // fallback to homepage
          if (!routes.some((route) => route.path === link)) {
            link = path
          }
        }
        return { text, link }
      }),
    }

    return formatNavLinks([languageDropdown])
  }

  return []
}
