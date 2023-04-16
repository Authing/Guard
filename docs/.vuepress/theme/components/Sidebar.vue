<template>
  <aside ref="sidebarRef" class="sidebar">   
    <SidebarLinks :depth="0" :items="items" :check-index="dataIndex" />
  </aside>
</template>

<script>
import SidebarLinks from "@theme/components/SidebarLinks.vue";
import NavLinks from "@theme/components/NavLinks.vue";
import { getUserNavLinks, getLanguageNavLinks } from "@theme/util/navLinks";
import GoOldVersion from "@theme/components/GoOldVersion.vue";
import PageSidebar from "@theme/components/PageSidebar.vue";
import SidebarSearch from "@theme/components/SidebarSearch.vue";

export default {
  name: "Sidebar",

  components: {
    SidebarLinks,
    NavLinks,
    GoOldVersion,
    PageSidebar,
    SidebarSearch
  },

  props: ["items"],

  data() {
    return {
      dataIndex: ''
    }
  },

  computed: {
    currentNavText() {
      const path = this.$route.path;

      const navLinks = this.$themeLocaleConfig.nav;

      if (!navLinks) {
        return "";
      }

      const currNav = navLinks.find(item => path.startsWith(item.link));

      return currNav && currNav.text;
    },

    userNavLinks() {
      return getUserNavLinks(this);
    },

    languageNavLinks() {
      return getLanguageNavLinks(this);
    }
  },
  mounted() {
    const sidebar = this.$refs.sidebarRef;
    const activeItem = sidebar && sidebar.querySelector(".active");

    if (sidebar && activeItem) {
      sidebar.scrollTop = activeItem.getBoundingClientRect().top - 200;
    }

    if (activeItem) {
      let parentNode = activeItem.parentNode
      while(parentNode) {
        if (parentNode.getAttribute('data-index')) {
          this.dataIndex = parentNode.getAttribute('data-index')
          parentNode = null
        } else {
          parentNode = parentNode.parentNode
        }
      }
    }
    this.$eventBus.$on('onChangeIndex', (index) => {
      this.dataIndex = index || ''
    })
  },
  watch: {
    $route: {
      immediate: true,
      handler(to, from) {
        const trimEndSlash = (str = '') => str.endsWith('/') ? str.replace(/\/$/, '') : str;
        const toPath = trimEndSlash(to?.path).split('/');
        const fromPath = trimEndSlash(from?.path).split('/');
        if(fromPath.length > 0 && toPath.length > 0 && fromPath[1] !== toPath[1]) {
          const sidebar = typeof document !== 'undefined' && document.querySelector('.sidebar-links');
          if(sidebar) sidebar.scrollTop = 0;
        }
      }
    }
  },
  methods: {
    getUserNavLinks,
    getLanguageNavLinks,
  }
};
</script>

<style lang="stylus">
.sidebar
  position sticky
  max-height 'calc(%s - %s - %s)' % (100vh $navbarHeight $headerContentGutter)
  top calc(3.6rem + 36px)
  align-self flex-start
  width 286px
  overflow-y unset
  .sidebar-search
    width: 94%
    .suggestions
      li
        padding: 16px;
  .current-nav-text
    margin-bottom: 16px
    font-size: 20px
    font-weight: 500
    color: #1D2129
    line-height: 32px

  .old-version
    display none

  ul:not(.sidebar-group-items)
    padding 0

  ul
    line-height 1
    margin 0
    list-style-type none

  a
    display inline-block

  .nav-links
    display none
    border-bottom 1px solid $borderColor
    padding 0.5rem 0 0.75rem 0

    .nav-item, .repo-link
      display block
      line-height 26px
      font-size 14px
      padding 0.5rem 0 0.5rem 1.5rem

  & > .sidebar-links
    margin-top: 0
    margin-left -8px
    overflow-y: scroll
    max-height 'calc(%s - %s - %s - 100px)' % (100vh $navbarHeight $headerContentGutter)

    & > li > a.sidebar-link
      // font-size 14px
  .depth-0 > ul > li
    & > .sidebar-group > .sidebar-heading, & > .sidebar-link
      // font-size: 14px
      line-height 22px
      padding 10px 1.5rem
  & > .sidebar-links > li > a {
    padding-left 1.5rem
  }

@media (max-width: $MQMobile)
  .sidebar
    position fixed
    top 0
    left unset
    right 0
    max-height unset
    width 296px
    height 100%
    transform translateX(100%)
    border-right none
    border-left 1px solid #eee

    .sidebar-search
      margin-left 1.5rem
      width 82%

    .nav-links
      display block

      .dropdown-wrapper .nav-dropdown .dropdown-item a.router-link-active::after
        top calc(1rem - 2px)

    & > .sidebar-links
      padding 0 0 1rem 1.5rem !important
      margin-top 0

    .current-nav-text
      padding 1rem 0 1rem 1.5rem

    .old-version
      margin-top 1rem
@media (max-width: $MQMobile)
  .sidebar
    overflow-y auto
  .current-nav-text
    padding-bottom 0 !important
    margin-bottom 0.67rem !important
</style>
