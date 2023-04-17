<template>
  <div class="integration-detail-card">
    <h5 class="integration-detail-card-title">{{ title }}</h5>
    <div class="integration-detail-card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "IntegrationDetailCard",
  props: {
    title: {
      type: String
      // required: true
    }
  },
  computed: {
    integrationData() {}
  },
  mounted() {
    // 如果是直接进入类似 /v2/connections/wechatwork-corp-qrconnect/1.html 的页面，要重定向到 /v2/connections/wechatwork-corp-qrconnect/?step=1
    const currPath = this.$page.path;
    if (/\d+.html$/.test(currPath)) {
      const pathArr = currPath.split("/");
      // 父级页面路由
      const parentPath = `${pathArr.slice(0, -1).join("/")}/`;
      // 第几步
      const step = pathArr.slice(-1)[0].replace(".html", "");

      if (this.$site.pages.find(item => item.path === parentPath)) {
        this.$router.replace({
          path: parentPath,
          query: {
            step
          }
        });
      }
    }
  }
};
</script>

<style lang="stylus">
.integration-detail-card {
  max-width: $mainContentWidthWithSideBar;
  background: #FFFFFF;
  box-shadow: 0px 6px 15px 0px rgba(161, 171, 200, 0.1);
  border-radius: 8px;
  border: 1px solid #DDDDDD;
  margin: 32px auto 0 auto;
  padding: 30px 62px;
  &:first-child {
    margin-top: 100px;
  }
  .integration-detail-card-title {
    font-size: 16px;
    font-weight: 400;
    color: #181818;
    line-height: 22px;
    padding: 0 17px 25px 17px;
    border-bottom: 2px solid #EEEEEE;
    margin: 0;
  }
  .integration-detail-card-content {
    padding: 20px 17px 0 17px;
    p {
      color: #666666;
      margin: 0;
    }
    img {
      display: block;
      max-height: 30rem;
      margin: .5rem 0rem 1rem;
    }
  }
}

@media (max-width: $MQMobile) {
  .integration-detail-card {
    padding: 14px 16px;
    margin-top: 64px;
    .integration-detail-card-title {
      padding-bottom: 14px;
    }
    .integration-detail-card-content {
      padding-top: 14px;
    }
  }
}
</style>
