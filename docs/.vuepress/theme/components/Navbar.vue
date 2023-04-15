<template>
  <header class="navbar fixed-header">
    <div
      class="navbar-container content-layout-container"
      :class="{
        'content-layout-container__without-sidebar': $frontmatter.noSidebar
      }"
    >
      <div class="nav-bar-logo-container">
        <a :href="$site.themeConfig.officeSiteUrl" class="nav-bar-new-logo">
          <img
            v-if="$site.themeConfig.logo"
            v-tooltip="{
              content: $themeLocaleConfig.logoTooltip,
            }"
            class="logo"
            :src="$withBase($site.themeConfig.logo)"
            :alt="$siteTitle"
          />
        </a>

        <Divider />

        <a href="https://docs.authing.cn/v2/" class="home-link">
          <span ref="siteName" class="site-name">{{
            $localeConfig.navbarTitle
          }}</span>
        </a>
      </div>

      <div
        class="links can-hide"
        :style="
          linksWrapMaxWidth
            ? {
                'max-width': linksWrapMaxWidth + 'px'
              }
            : {}
        "
      >

        <NavLinks class="can-hide" :navLinks="userNavLinks" />

        <select v-model="version" @change="onChangeVersion" class="version-selector">
          <option v-for="item in versionList" :value="item.text">{{ item.text }}</option>
        </select>
      </div>

      <SearchInput :placeholder="$themeLocaleConfig.searchInDoc" />

      <SidebarButton @toggle-sidebar="$emit('toggle-sidebar')" />
    </div>
  </header>
</template>

<script>
import SidebarButton from "@theme/components/SidebarButton.vue";
import NavLinks from "@theme/components/NavLinks.vue";
import Divider from "@theme/components/Divider.vue";
import SearchInput from "@theme/components/SearchInput.vue";
import IconFont from "@theme/components/IconFont/index.vue";
import { getUserNavLinks, getLanguageNavLinks } from "@theme/util/navLinks";
import SwitchLocale from "@theme/components/SwitchLocale.vue";

export default {
  name: "Navbar",

  components: {
    SwitchLocale,
    SidebarButton,
    NavLinks,
    Divider,
    SearchInput,
    IconFont
  },

  data() {
    return {
      linksWrapMaxWidth: null,
      version: 'v6',
      versionList: [{
        text: 'v6'
      }, {
        text: 'v5',
        link: 'https://docs.authing.cn/v2/reference/guard/v2/web.html'
      }, {
        text: 'v4',
        link: 'https://docs.authing.cn/v2/reference/guard/v2/react.html'
      }]
    };
  },

  computed: {
    algolia() {
      return (
        this.$themeLocaleConfig.algolia || this.$site.themeConfig.algolia || {}
      );
    },

    isAlgoliaSearch() {
      return this.algolia && this.algolia.apiKey && this.algolia.indexName;
    },

    userNavLinks() {
      return getUserNavLinks(this);
    },

    languageNavLinks() {
      return getLanguageNavLinks(this);
    }
  },

  mounted() {
    const MOBILE_DESKTOP_BREAKPOINT = 719; // refer to config.styl
    const NAVBAR_VERTICAL_PADDING =
      parseInt(css(this.$el, "paddingLeft")) +
      parseInt(css(this.$el, "paddingRight"));
    const handleLinksWrapWidth = () => {
      if (document.documentElement.clientWidth < MOBILE_DESKTOP_BREAKPOINT) {
        this.linksWrapMaxWidth = null;
      } else {
        this.linksWrapMaxWidth =
          this.$el.offsetWidth -
          NAVBAR_VERTICAL_PADDING -
          ((this.$refs.siteName && this.$refs.siteName.offsetWidth) || 0);
      }
    };
    handleLinksWrapWidth();
    window.addEventListener("resize", handleLinksWrapWidth, false);
  },

  watch: {
    version: (newValue) => {
      console.log(newValue)
    }
  },

  methods: {
    getUserNavLinks,
    getLanguageNavLinks,
    onChangeVersion (e) {
      const selectedVersion = this.versionList.find(version => version.text === e.target.value)
      this.version = 'v6'
      if (selectedVersion && selectedVersion.link) {
        window.open(selectedVersion.link, true)
      }
    }
  }
};

function css(el, property) {
  // NOTE: Known bug, will return 'auto' if style value is 'auto'
  const win = el.ownerDocument.defaultView;
  // null means not to return pseudo styles
  return win.getComputedStyle(el, null)[property];
}
</script>

<style lang="stylus">
$navbar-vertical-padding = 0.7rem
$navbar-horizontal-padding = 0

.navbar
  padding $navbar-vertical-padding $navbar-horizontal-padding
  line-height $navbarHeight - 1.4rem
  background-color white
  box-shadow 0px 0px 4px 0px rgba(0, 0, 0, 0.02)
  border-bottom 1px solid #DDDDDD
  .nav-bar-logo-container
    width 249px
    padding-right 1.5rem
    box-sizing border-box
    display flex
    align-content center
    align-items center
  a, span, img
    display inline-block
  .navbar-container
    box-sizing border-box
    padding 0 24px
    display flex
    align-items center
    margin 0 auto
  .logo
    // height $navbarHeight - 1.4rem
    // min-width $navbarHeight - 1.4rem
    width 90px
    margin-right 0
    vertical-align top
  .site-name
    font-size 16px
    font-weight 400
    color $textColor
    line-height 22px
  .links
    padding-left 24px
    box-sizing border-box
    background-color white
    white-space nowrap
    font-size 0.9rem
    display flex
    flex 1
    justify-content flex-start
    .search-box
      flex: 0 0 auto
      vertical-align top
    .nav-link
      color $subTitleColor
      // padding: 0 20px;
  .authing-search-box
    width 235px
    margin 0
  .contact-us
    color $subTitleColor
    background-color transparent
    border 1px solid #ddd
    outline none
    padding 7px 17px
    border-radius 2px
    cursor pointer
    margin-left 24px
    margin-right 24px
    &:focus, &:active
      outline none
  .navbar-lang-container
    margin-left 30px
    .navbar-lang-icon
      color #6D7278
    .lang-navs
      .title
        color #6D7278
      .arrow
        border-top-color #6D7278

.nav-bar-new-logo
  position relative
  width 90px
.nav-bar-new-logo .logo
  position absolute
  top 50%
  transform translateY(-50%)

@media (max-width: $MQMobile)
  .navbar
    padding 0 1.25rem
    .navbar-container
      padding 0
      height 100%
    .can-hide
      display none
    .links
      padding-left 1.5rem
    .site-name
      width calc(100vw - 9.4rem)
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
    .sidebar-button
      position static
      padding 0
    .nav-bar-logo-container
      // width auto
      .logo
        width auto
        height 1.5rem
        vertical-align middle
    .authing-search-box
      margin-right 0.25rem
      margin-left auto
      width auto
      > input
        box-sizing border-box
        // padding-left 1rem
        width 1rem
        background #fff url(../assets/images/search-mobile.svg) 0.6rem 50% no-repeat
        background-size 1.2rem
        transform: translateY(-1px);
        transition width .3s

        &:focus
          width 10.75rem
          background #fff url(../assets/images/search.svg) 0.6rem 50% no-repeat
          background-size 1rem
    .navbar-lang-container
      display none
    .site-name
      vertical-align middle
      width auto
.version-selector {
  margin-left: 1.5rem;
  margin-top: 5px;
  height: 24px;
  padding: 0 10px;
  box-sizing: border-box;
  border: 1px solid #d9d9d9;
}
</style>
