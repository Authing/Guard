<template>
  <div class="breadcrumb-container">
    <ol>
      <template v-for="(item, index) of crumbs">
        <li :key="`link-${index}`">
          <NavLink :item="item" :type="'bread'" />
        </li>
        <li
          class="crumbs-gutter"
          v-if="index !== crumbs.length - 1"
          :key="`gutter-${index}`"
        >
          /
        </li>
      </template>
    </ol>
  </div>
</template>

<script>
import NavLink from "@theme/components/NavLink.vue";

function findChildren(list, routePath) {
  return list.find(item => {
    if (item.path === "/concepts/") {
      // concepts 特殊处理
      return routePath === "/concepts/";
    } else if (routePath.startsWith(item.path)) {
      return true;
    } else if (item.children) {
      return findChildren(item.children, routePath);
    } else {
      return false;
    }
  });
}

function findSideBarPath(sidebars, routePath, parentPath) {
  routePath = decodeURIComponent(routePath)

  if (!sidebars) {
    return [];
  }
  const finded = findChildren(sidebars, routePath);
  if (!finded) {
    return [];
  }

  const allPath = parentPath.concat({
    link: finded.redirect ?? finded.path,
    text: finded.title || finded.path
  });
  // 当前菜单路由已经和路由相等，已找完
  if (finded.path === routePath) {
    return allPath;
  }

  return findSideBarPath(finded.children, routePath, allPath);
}

export default {
  components: {
    NavLink
  },
  props: {
    sidebars: {
      type: Array,
      required: true
    }
  },
  computed: {
    crumbs() {
      const navLinks = this.$themeLocaleConfig.nav;
      if (!navLinks) {
        return [];
      }

      const path = this.$route.path;

      const currNav = navLinks.find(item => path.startsWith(item.link));

      if (!currNav) {
        return [];
      }

      return findSideBarPath(this.sidebars, path, [
        {
          link: currNav.link,
          text: currNav.text
        }
      ]);
    }
  }
};
</script>

<style lang="stylus">
.breadcrumb-container
  margin-bottom -60px
  position relative
  z-index 1
  ol
    list-style none
    display flex
    align-items center
    padding 0em
    margin 0
    line-height 2rem
    li
      color #86909c
      font-size 14px
      p
        margin 9px 0
        line-height 1
      &.crumbs-gutter
        margin: 0 8px
        font-size 12px
      &:not(:last-child)
        .nav-link
          // color rgba(0,0,0,0.45)
          color #86909c
          &:hover
            color $accentColor
</style>
