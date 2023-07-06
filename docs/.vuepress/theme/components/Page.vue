<template>
  <main
    class="page content-layout-container"
    :class="{
      'full-width': $frontmatter.fullWidthPage,
      isInConsole: isInConsole
    }"
  >
    <slot name="top" />

    <div class="main-content">
      <slot name="sidebar"></slot>
      <div class="breadcrumb-content-container">
        <slot name="breadcrumb"></slot>
        <Content class="theme-default-content" />
        <downloadDemoPage v-if="showDownloadDemo" />
        <ClientOnly>
          <Feedback v-if="!$page.frontmatter.noFeedback" />
        </ClientOnly>
        <PageNav
          v-show="!$page.frontmatter.noPageNav"
          v-bind="{ sidebarItems }"
        />
      </div>
      <div v-if="!$page.frontmatter.noToc" class="on-this-page">
        <OnThisPage :isInConsole="isInConsole" />
      </div>
      <div v-else-if="showDownloadDemo">
        <DownloadDemo />
      </div>
    </div>
    <!-- <PageEdit /> -->

    <slot name="bottom" />
  </main>
</template>

<script>
import PageEdit from "@theme/components/PageEdit.vue";
import PageNav from "@theme/components/PageNav.vue";
import OnThisPage from "@theme/components/OnThisPage.vue";
import Feedback from "@theme/components/Feedback.vue";
import DownloadDemo from "@theme/components/DownloadDemo";
import DownloadDemoPage from "@theme/components/DownloadDemo/DownloadDemoPage";

export default {
  components: {
    PageEdit,
    PageNav,
    Feedback,
    OnThisPage,
    DownloadDemo,
    DownloadDemoPage
  },
  props: ["sidebarItems", "isInConsole"],
  computed: {
    showDownloadDemo() {
      const download = this.$frontmatter.downloadDemo;

      return !!(download && (download.downloadUrl || download.jumpUrl));
    }
  }
};
</script>

<style lang="stylus">
.page
  padding-left: 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin 0 auto 2rem auto
  padding 0 24px
  box-sizing border-box
  &.isInConsole
    padding: 0
    .main-content
      margin-top 0
    .breadcrumb-content-container
      margin: 0
  &.full-width
    max-width unset
    padding-right 0
    padding-left 0
    .breadcrumb-content-container
      margin 0
      max-width $mainContentWidthWithSideBar
      margin 0 auto
  .main-content
    display flex
    margin-top 'calc(%s + %s)' % ($navbarHeight $headerContentGutter)
  .theme-default-content
    position relative
    margin 0
    flex 1
    padding 0
    max-width unset
    min-height 'calc(%s - %s - %s - %s - %s)' % (100vh $navbarHeight $headerContentGutter $footerHeight 150px)

  .breadcrumb-content-container
    margin-left $leftSidebarContentGutter
    margin-right $rightSidebarContentGutter
    flex 1
    min-width 0
    @media (max-width: $MQNarrow)
      // padding 2rem
      margin 0
    @media (max-width: $MQMobileNarrow)
      // padding 1.5rem
      margin 0
</style>
