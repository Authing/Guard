<template>
  <main
    class="page content-layout-container reference-new"
    :class="{
      'full-width': $frontmatter.fullWidthPage
    }"
  >
    <slot name="top" />

    <div class="main-content">
      <!-- <slot name="sidebar"></slot> -->
      <div class="breadcrumb-content-container">
        <slot name="breadcrumb"></slot>
        <div class="sdk-banner">
          <div>
            <h1>Authing SDK</h1>
            <p>{{ $frontmatter.subtitle }}</p>
          </div>
          <img src="~@theme/assets/images/reference/banner.png" />
        </div>
        <div class="info-card">
          <svg
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1250"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            style="width: 1em; height: 1em; padding-right: 1em"
          >
            <defs><style type="text/css"></style></defs>
            <path
              d="M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024zM448 448v384h128V448H448z m0-256v128h128V192H448z"
              fill="#153FBF"
              p-id="1251"
            ></path>
          </svg>
          {{ $frontmatter.info }}
          <a :href="$frontmatter.link"
            >{{ $frontmatter.linkLabel }} <small>〉</small></a
          >
        </div>
        <div class="sdk-content">
          <div v-for="cat of $frontmatter.data">
            <h2 :id="cat.title">
              <a :href="`#${cat.title}`" class="header-anchor"></a>
              {{ cat.title }}
            </h2>
            <p>
              {{ cat.desc }}
            </p>
            <div v-for="item of cat.list">
              <SdkLink :item="item"></SdkLink>
            </div>
          </div>
        </div>
        <!-- <Content class="theme-default-content" /> -->
        <!-- <downloadDemoPage v-if="showDownloadDemo" /> -->
        <!-- <Feedback v-if="!$frontmatter.noFeedback" /> -->
      </div>
      <div v-if="!$frontmatter.noToc" class="on-this-page">
        <OnThisPage
          :items="
            $frontmatter.data.map(cat => {
              cat.slug = cat.title;
              return cat;
            })
          "
        />
      </div>
      <div v-else-if="showDownloadDemo">
        <DownloadDemo />
      </div>
    </div>
    <PageEdit />

    <slot name="bottom" />
  </main>
</template>

<script>
import PageEdit from "@theme/components/PageEdit.vue";
import PageNav from "@theme/components/PageNav.vue";
import OnThisPage from "@theme/components/OnThisPage.vue";
// // import Feedback from "@theme/components/Feedback.vue";
import DownloadDemo from "@theme/components/DownloadDemo";
import DownloadDemoPage from "@theme/components/DownloadDemo/DownloadDemoPage";
import SdkLink from "./SdkLink.vue";

export default {
  components: {
    SdkLink,
    PageEdit,
    PageNav,
    // Feedback,
    OnThisPage,
    DownloadDemo,
    DownloadDemoPage
  },
  computed: {
    showDownloadDemo() {
      const download = this.$frontmatter.downloadDemo;

      return !!(download && (download.downloadUrl || download.jumpUrl));
    }
  }
};
</script>

<style lang="stylus">
.sdk-banner
  color: #fff;
  background: $accentColor url('~@theme/assets/images/reference/sdk-mask.png') no-repeat left top;
  background-size: 470px 100%;
  position: relative;
  display: flex;
  justify-content: space-around;
  padding: 2em 0;
  margin: 3.5em 0 1.5em;
  border-radius: 6px;
  > div
    padding: 0 1em;
  &:after
    content: '';
    position: absolute;
    bottom: 0;
    right: 0;
    width: 290px;
    height: 100%;
    background: url('~@theme/assets/images/reference/circle.png') no-repeat right top;
    background-size: 290px 220px;
    opacity: 0.5;
  img
    max-height: 202px;
  p
    max-width: 372px;
    font-size: 14px;

.sdk-content
  h2
    font-size: 24px;
    line-height: 38px;
    color: #1D2129;
    padding-top: 3em;
    padding-bottom: 0;
    border-bottom: 0
  p
    font-size: 14px;
    color: #86909C;
    line-height: 1.2;


.info-card
  border-radius: 6px;
  font-size: 14px;
  background: #E8F2FF;
  line-height: 46px;
  padding: 0 1em;

@media (max-width: $MQMobile)
  .sdk-banner
    display: block
    background-position: left top;
    &:after
      background-position: right bottom;
</style>

<style lang="stylus">
.page
  padding-left: 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin 0 auto 2rem auto
  padding 0 24px
  box-sizing border-box
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
