<template>
  <div class="download-demo">
    <div class="download-demo-content">
      <span class="demo-content-title">
        {{ data.title || "本页资源" }}
      </span>
      <span v-if="data.description" class="demo-content-description">
        {{ data.description }}
      </span>
      <a
        v-if="data.downloadUrl"
        :href="data.downloadUrl"
        :download="data.downloadFileName || fileName(data.downloadUrl)"
        target="_Blank"
        class="download-demo-button nav-link"
        style="background: #215AE5; color: #ffffff"
      >
        下载
      </a>
      <a
        v-if="data.jumpUrl"
        :href="data.jumpUrl"
        target="_Blank"
        class="download-demo-button nav-link"
        style="background: #ffffff; color: #215AE5"
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
      return this.$frontmatter.downloadDemo;
    },
  },
  methods: {
    fileName(url) {
      const urlArr = url.split("/");

      return urlArr[urlArr.length - 1];
    },
  },
};
</script>

<style lang="stylus">
.download-demo {
  align-self: flex-start;
  max-height: 'calc(%s - %s - %s)' % (100vh $navbarHeight $headerContentGutter);
  position: sticky;
  overflow-y: auto;
  top: calc(3.6rem + 36px);
  box-shadow: 0 0 16px rgba(214, 217, 226, 0.41);
  border-radius: 6px;
  padding: 19px 16px;

  .download-demo-content {
    width: 196px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    .demo-content-title {
      font-size: 16px;
      font-weight: bold;
      line-height: 9px;
      color: #333333;
    }

    .demo-content-description {
      font-size: 14px;
      line-height: 22px;
      color: #333333;
      margin-top: 20px;
      margin-bottom: 11px;
    }
  }

  .download-demo-button {
    width: 156px;
    height: 27px;
    border: 2px solid $accentColor;
    opacity: 1;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    margin-top: 14px;
  }
}

@media screen and (max-width: 1400px) {
  .download-demo {
    display: none;
  }
}
</style>
