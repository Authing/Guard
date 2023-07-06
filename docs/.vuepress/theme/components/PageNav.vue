<template>
  <div v-if="prev || next" class="page-nav">
    <div class="inner">
      <template v-if="prev">
        <a
          v-if="prev.type === 'external'"
          class="prev"
          :href="prev.path"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="arrow-outline"></span>
          {{ $themeLocaleConfig.prevDoc }}:
          {{ prev.title || prev.path }}
          <OutboundLink />
        </a>

        <RouterLink v-else class="prev" :to="prev.path">
          <span class="arrow-outline">
          </span>
          {{ $themeLocaleConfig.prevDoc }}:
          {{ prev.title || prev.path }}
        </RouterLink>
      </template>

      <template v-if="next">
        <a
          v-if="next.type === 'external'"
          class="next"
          :href="next.path"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ $themeLocaleConfig.nextDoc }}:
          {{ next.title || next.path }}
          <span class="arrow-outline"></span>
          <OutboundLink />
        </a>

        <RouterLink v-else :to="next.path" class="next">
          {{ $themeLocaleConfig.nextDoc }}:
          {{ next.title || next.path }}
          <span class="arrow-outline">
          </span>
        </RouterLink>
      </template>
    </div>
  </div>
</template>

<script>
import { resolvePage } from '../util'
import isString from 'lodash/isString'
import isNil from 'lodash/isNil'

export default {
  name: 'PageNav',

  props: ['sidebarItems'],

  computed: {
    prev() {
      return resolvePageLink(LINK_TYPES.PREV, this)
    },

    next() {
      return resolvePageLink(LINK_TYPES.NEXT, this)
    },
  },
}

function resolvePrev(page, items) {
  return find(page, items, -1)
}

function resolveNext(page, items) {
  return find(page, items, 1)
}

const LINK_TYPES = {
  NEXT: {
    resolveLink: resolveNext,
    getThemeLinkConfig: ({ nextLinks }) => nextLinks,
    getPageLinkConfig: ({ frontmatter }) => frontmatter.next,
  },
  PREV: {
    resolveLink: resolvePrev,
    getThemeLinkConfig: ({ prevLinks }) => prevLinks,
    getPageLinkConfig: ({ frontmatter }) => frontmatter.prev,
  },
}

function resolvePageLink(
  linkType,
  { $themeConfig, $page, $route, $site, sidebarItems }
) {
  const { resolveLink, getThemeLinkConfig, getPageLinkConfig } = linkType

  // Get link config from theme
  const themeLinkConfig = getThemeLinkConfig($themeConfig)

  // Get link config from current page
  const pageLinkConfig = getPageLinkConfig($page)

  // Page link config will overwrite global theme link config if defined
  const link = isNil(pageLinkConfig) ? themeLinkConfig : pageLinkConfig

  if (link === false) {
    return
  } else if (isString(link)) {
    return resolvePage($site.pages, link, $route.path)
  } else {
    return resolveLink($page, sidebarItems)
  }
}

function find(page, items, offset) {
  // lxp yysd!
  const resWithEmptyVal = []
  flatten(items, resWithEmptyVal)
  const res = resWithEmptyVal.filter(item => item.path)
  for (let i = 0; i < res.length; i++) {
    const cur = res[i]
    if (cur.path === decodeURIComponent(page.path)) {
      // 如果是当前页面
      // 先判断是不是最后一个或者第一个
      if ( (i + offset) === res.length || (i + offset) < 0) {
        // 如果是最后一个或者第一个，那就不显示下一个了
        return ;
      } else {
        // 如果不是最后一页
        return res[i + offset]
      }
    }
  }
}

function flatten(items, res) {
  for (let i = 0, l = items.length; i < l; i++) {
    if (items[i].type === 'group') {
      res.push({
        ...items[i],
        children: null
      })
      flatten(items[i].children || [], res)
    } else {
      res.push(items[i])
    }
  }
}
</script>

<style lang="stylus" scoped>
.page-nav
  a
    color #4E5969
    font-weight normal
    font-size 14px
    display flex
    align-items center
    &:hover
      color #396aff
  .inner
    min-height 2rem
    margin-top 0
    border-radius 4px
    text-align center
  .arrow-outline
    display inline-block
    height 1rem
    width 1rem
    img
      width 100%
    // border 1px solid #999
    // border-left-color transparent
    // border-bottom-color transparent
  .next
    .arrow-outline
      // transform rotate(45deg)
      margin-right 5px
      background url('../assets/images/arrow-right-s-line.svg')
      background-size 100% 100%
  .prev
    .arrow-outline
      background url('../assets/images/arrow-left-s-line.svg')
      background-size 100% 100%
      // transform rotate(-135deg)
      margin-left 5px

@media only screen and (max-width: 650px)
  .inner
    display flex
    flex-wrap wrap
    justify-content space-between
  .prev
    display flex
    justify-content center
    align-items center
    width 100%
    height 32px
    line-height 32px
    background #F2F3F5
    border-radius 4px
  .next
    display flex
    justify-content center
    align-items center
    width 100%
    height 32px
    line-height 32px
    background #F2F3F5
    margin-top 16px
    border-radius 4px
  .arrow-outline
    display none !important

@media only screen and (min-width: 651px)
  .inner
    display flex
    flex-wrap wrap
    justify-content space-between
@media (max-width: $MQMobile)
  a:hover
    color #4E5969 !important
</style>
