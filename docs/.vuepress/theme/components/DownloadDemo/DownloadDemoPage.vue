<template>
  <div class="download-demo-page">
    <div class="download-demo-page-header">
      <span class="demo-content-title">
        {{ data.title || '本页资源' }}
      </span>
      <span v-if="data.description" class="demo-content-description">
        {{ data.description }}
      </span>
    </div>
    <div class="download-demo-page-bottom">
      <a
        v-if="data.downloadUrl"
        :href="data.downloadUrl"
        :download="data.downloadFileName || fileName(data.downloadUrl)"
        target="_Blank"
        class="download-demo-page-button nav-link"
        style="background: #215AE5; color: #FFFFFF"
      >
        下载
      </a>
      <a
        v-if="data.jumpUrl"
        :href="data.jumpUrl"
        target="_Blank"
        class="download-demo-page-button nav-link"
        style="background: #FFFFFF; color: #215AE5"
      >
        在 GitHub 查看
      </a>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    data() {
      return this.$frontmatter.downloadDemo
    }
  },
  methods: {
    fileName(url) {
      const urlArr = url.split('/')

      return urlArr[urlArr.length - 1]
    }
  }
}
</script>

<style lang="stylus">
.download-demo-page
  display none
  justify-content space-between
  align-items center
  border 1px solid #EEEEEE
  border-radius 4px
  padding 24px

  .download-demo-page-header
    display flex
    flex-direction column
    margin-right 10px

    .demo-content-title
      font-size 16px
      font-weight bold
      line-height 9px
      color #333333

    .demo-content-description
      font-size 14px
      line-height 16px
      color #333333
      margin-top 20px

  .download-demo-page-button
    width 156px
    height 27px
    border 2px solid $accentColor
    opacity 1
    border-radius 4px
    display flex
    align-items center
    justify-content center
    font-size 12px
    font-weight bold
    margin-bottom 20px

  .download-demo-page-button:last-child
    margin-bottom 0


@media screen and (max-width: 1400px) {
  .download-demo-page{
    display flex
  }
}
</style>
