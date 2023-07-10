<template>
  <div class="quickstarts">
    <slot name="sidebar"></slot>

    <div class="top">
      <div class="title">快速开始</div>
      <div class="description">请选择你的应用类型和开发语言</div>
    </div>

    <div class="app-types">
      <QuickstartsCard
        v-for="(appType, index) in appTypes"
        :app-type="appType"
        :key="index"
        class="app-type"
      />
    </div>
  </div>
</template>

<script>
import QuickstartsCard from './QuickstartsCard'

export default {
  components: {
    QuickstartsCard
  },
  computed: {
    appTypes() {
      return this.$frontmatter.appTypes
    }
  }
}
</script>

<style lang="stylus">

.quickstarts {
  padding-top: $navbarHeight;
  padding-bottom: 100px;
  max-width: $mainContentWidthWithoutSideBar;
  box-sizing: border-box;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;

  .app-types {
    display: flex;
    flex-wrap: wrap;

    .app-type {
      margin-top: 20px;
      margin-right: 20px
    }

    .app-type:nth-child(2n) {
      margin-right: 0
    }
  }

  .top {
    margin-top: 43px;
    margin-bottom: 6px;


    .title {
      font-size: 36px;
      font-weight: bold;
      line-height: 50px;
      color: #181818;
      opacity: 1;
    }
    .description {
      font-size: 20px;
      line-height: 28px;
      color: #9BA1A7;
      opacity: 1;
      margin-top: 8px
    }
  }
}

@media (max-width: 1300px) {
  .quickstarts {
    .app-types {

      .app-type {
        margin-right: 0
      }
    }
  }
}
</style>
