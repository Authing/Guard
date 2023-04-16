<template>
  <div
    class="theme-container"
    :class="pageClasses"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    :key="appId"
  >
    <notifications
      classes="top-center-vue-notification vue-notification"
      group="message"
      position="top center"
    />

    <Navbar v-if="shouldShowNavbar" @toggle-sidebar="toggleSidebar" />

    <div class="sidebar-mask" @click="toggleSidebar(false)" />

    <Home v-if="$page.frontmatter.home">
      <template #sidebar>
        <Sidebar :items="sidebarItems" @toggle-sidebar="toggleSidebar">
          <template #top>
            <slot name="sidebar-top" />
          </template>
          <template #bottom>
            <slot name="sidebar-bottom" />
          </template>
        </Sidebar>
      </template>
    </Home>

    <ApplicationIntegration v-else-if="$page.frontmatter.integrationList">
      <template #sidebar>
        <Sidebar :items="sidebarItems" @toggle-sidebar="toggleSidebar">
          <template #top>
            <slot name="sidebar-top" />
          </template>
          <template #bottom>
            <slot name="sidebar-bottom" />
          </template>
        </Sidebar>
      </template>
    </ApplicationIntegration>

    <Quickstarts v-else-if="$page.frontmatter.quickstarts">
      <template #sidebar>
        <Sidebar :items="sidebarItems" @toggle-sidebar="toggleSidebar">
          <template #top>
            <slot name="sidebar-top" />
          </template>
          <template #bottom>
            <slot name="sidebar-bottom" />
          </template>
        </Sidebar>
      </template>
    </Quickstarts>

    <Reference v-else-if="$page.frontmatter.guide">
      <template #sidebar>
        <Sidebar :items="sidebarItems" @toggle-sidebar="toggleSidebar">
          <template #top>
            <slot name="sidebar-top" />
          </template>
          <template #bottom>
            <slot name="sidebar-bottom" />
          </template>
        </Sidebar>
      </template>
      <!-- <template #breadcrumb>
        <Breadcrumb :sidebars="sidebarItems" />
      </template> -->
      <template #top>
        <slot name="page-top"></slot>
      </template>
      <template #bottom>
        <slot name="page-bottom"> </slot>
      </template>
    </Reference>

    <Page v-else :sidebar-items="sidebarItems" :isInConsole="isInConsole">
      <template #sidebar>
        <Sidebar :items="sidebarItems" @toggle-sidebar="toggleSidebar">
          <template #top>
            <slot name="sidebar-top" />
          </template>
          <template #bottom>
            <slot name="sidebar-bottom" />
          </template>
        </Sidebar>
      </template>
      <!-- <template #breadcrumb>
        <Breadcrumb :sidebars="sidebarItems" />
      </template> -->
      <template #top>
        <slot name="page-top"></slot>
      </template>
      <template #bottom>
        <slot name="page-bottom"> </slot>
      </template>
    </Page>

    <Footer v-if="!$page.frontmatter.home" />
  </div>
</template>

<script>
import Home from "@theme/components/Home/index.vue";
import ApplicationIntegration from "@theme/components/ApplicationIntegration/index.vue";
import Navbar from "@theme/components/Navbar.vue";
import Page from "@theme/components/Page.vue";
import Sidebar from "@theme/components/Sidebar.vue";
import { setCookie, delCookie } from "@theme/util";
import Footer from "@theme/components/Footer/index.vue";
import Breadcrumb from "@theme/components/Breadcrumb.vue";
import Quickstarts from "@theme/components/Quickstarts/index.vue";
import PageSidebar from "@theme/components/PageSidebar.vue";
import Reference from "@theme/components/Reference/index.vue";
import querystring from "query-string";

import { sidebarList } from "@dynamic/sidebar-caches";

export default {
  name: "Layout",
  components: {
    Home,
    Page,
    Sidebar,
    Navbar,
    Footer,
    Breadcrumb,
    PageSidebar,
    ApplicationIntegration,
    Quickstarts,
    Reference,
  },

  data() {
    return {
      isSidebarOpen: false,
      isInConsole: "",
      appId: "",
    };
  },

  computed: {
    shouldShowNavbar() {
      const { themeConfig } = this.$site;
      const { frontmatter } = this.$page;
      if (frontmatter.navbar === false || themeConfig.navbar === false) {
        return false;
      }
      return (
        this.$title ||
        themeConfig.logo ||
        themeConfig.repo ||
        themeConfig.nav ||
        this.$themeLocaleConfig.nav
      );
    },

    shouldShowSidebar() {
      const { frontmatter } = this.$page;
      return (
        !frontmatter.home &&
        frontmatter.sidebar !== false &&
        this.sidebarItems.length
      );
    },

    sidebarItems() {
      const regularPath = this.$page.regularPath;
      const matchedNavPath = regularPath.slice(
        0,
        regularPath.indexOf("/", regularPath.startsWith("/en/") ? 4 : 1) + 1
      );
      return sidebarList?.[matchedNavPath]?.list || [];
    },

    pageClasses() {
      const userPageClass = this.$page.frontmatter.pageClass;
      return [
        {
          "no-navbar": !this.shouldShowNavbar,
          "sidebar-open": this.isSidebarOpen,
          "no-sidebar": !this.shouldShowSidebar,
        },
        userPageClass,
      ];
    },
  },

  mounted() {
    this.$router.afterEach(() => {
      this.isSidebarOpen = false;
    });

    ["utm_term", "utm_source", "utm_campaign", "utm_medium"].forEach((item) =>
      delCookie(item)
    );
    let search = querystring.parse(
      typeof window !== "undefined" && window.location.search
    );

    Object.keys(search).forEach((k) => {
      let v = search[k];
      setCookie(k, v);
    });
    this.registerMessage();
    if (this.$route.query.isInConsoleAppDetail) {
      this.$themeConfig.isInConsoleAppDetail = true;
    }
  },

  beforeDestroy() {
    window.removeEventListener("message");
  },

  methods: {
    findDom(domClass, params) {
      let _this = this;
      let elements = [...document.querySelectorAll(domClass)];

      let keys = Object.keys(params);

      keys.forEach((key, index) => {
        let found = elements.filter((d) => d.innerHTML.indexOf(key) !== -1);

        if (found.length !== 0) {
          let targetDOM = _this.findTarget(found, key);

          targetDOM.forEach((node) => {
            node.innerHTML = `'${params[key]}'`;
          });
        }
      });
    },

    findTarget(doms, key) {
      let codes = doms.reduce((current, next) => {
        let code = [...next.children].find(
          (d) => d.nodeType === 1 && d.nodeName === "CODE"
        );
        current.push(code);
        return current;
      }, []);

      let children = codes.reduce((current, next) => {
        current = current.concat([...next.children]);
        return current;
      }, []);

      let targets = children.filter((d) => d.innerHTML.indexOf(key) !== -1);

      return targets;
    },

    // 进行字符串替换方法
    replaceString(repStr, rgExp, replaceText) {
      var str = repStr.replace(rgExp, replaceText);
      if (str.indexOf(rgExp) != -1) {
        str = this.replaceString(str, rgExp, replaceText);
      }
      return str;
    },
    // 注册消息事件来自 fe console
    registerMessage() {
      if (window) {
        let _this = this;
        window.addEventListener("message", (evt) => {
          try {
            const { event, data } = JSON.parse(evt.data);
            if (event.source === "authing-fe-console") {
              // 1. 隐藏头部和顶部区域
              _this.hiddenModule();
              _this.isInConsole = event.eventType;
            }

            let target = {};

            // 这里判断是在控制台快速开始文档，要操作的步骤
            if (event.isQuickDocs) {
              if (data.appId) {
                target["AUTHING_APP_ID"] = data.appId;
              }
              if (data.userPoolId) {
                target["AUTHING_USERPOOL_ID"] = data.userPoolId;
              }
              if (data.secret) {
                target["AUTHING_SECRET"] = data.secret;
              }
              if (data.domain) {
                target["AUTHING_DOMAIN"] = data.domain;
              }
              if (data.redirectUri) {
                target["AUTHING_REDIRECTURI"] = data.redirectUri;
              }
              if (data.logoutRedirectUris) {
                target["AUTHING_LOGOUTREDIRECTURI"] = data.logoutRedirectUris;
              }
              if (data.scope) {
                target["AUTHING_SCOPE"] = data.scope;
              }
              if (data.userPoolSecret) {
                target["AUTHING_USERPOOL_SECRET"] = data.userPoolSecret;
              }
              if (data.appId) {
                target["APP_ID"] = data.appId;
              }

              _this.$nextTick(() => {
                _this.findDom("pre[class*='language-']", target);
              });

              _this.quickDocsStyle();
            }
          } catch (e) {}
        });
      }
    },
    // 控制台快速开始文档样式调整
    quickDocsStyle() {
      let mainContent = document.querySelector("[class*='main-content']");
      let lauoutContent = document.querySelector("[class*='page']");
      let breadcrumbContent = document.querySelector(
        "[class*='breadcrumb-content-container']"
      );
      if (mainContent) {
        mainContent.style = "margin-top: 0";
      }
      if (lauoutContent) {
        lauoutContent.style = "padding: 0";
      }
      if (breadcrumbContent) {
        breadcrumbContent.style = "margin: 0 !important";
      }
    },
    // 1. 移除模块
    hiddenModule() {
      let aside = document.querySelector("aside[class='sidebar']");
      let header = document.querySelector("header[class*='navbar']");
      let footer = document.querySelector("footer[class*='footer']");
      let body = document.body;
      let newAside = document.querySelector(
        "aside[class='on-this-page-navigation']"
      );
      let authingLastUpdate = document.querySelector(
        "div[class='authing-last-updated']"
      );

      let feedback = document.querySelector("div[class='feedback']");

      if (aside) {
        aside.style = "display:none;";
      }

      if (header) {
        header.style = "display:none;";
      }

      if (footer) {
        footer.style = "display:none;";
      }

      if (newAside) {
        newAside.style = "display:none;";
      }

      if (authingLastUpdate) {
        authingLastUpdate.style = "display:none;";
      }

      if (feedback) {
        feedback.style = "display:none;";
      }

      if (body) {
        body.style = "padding-right:16px;";
      }

      let h2 = document.querySelectorAll(
        "div[class*='theme-default-content'] h2"
      );
      let h3 = document.querySelectorAll(
        "div[class*='theme-default-content'] h3"
      );

      if (h2) {
        h2.forEach((el) => {
          el.style = "margin-top:10px;padding-top:0px;";
        });
      }
      if (h3) {
        h3.forEach((el) => {
          el.style = "margin-top:10px;padding-top:0px;";
        });
      }
    },

    toggleSidebar(to) {
      this.isSidebarOpen = typeof to === "boolean" ? to : !this.isSidebarOpen;
      this.$emit("toggle-sidebar", this.isSidebarOpen);
    },

    // side swipe
    onTouchStart(e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };
    },

    onTouchEnd(e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x;
      const dy = e.changedTouches[0].clientY - this.touchStart.y;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true);
        } else {
          this.toggleSidebar(false);
        }
      }
    },
  },
};
</script>

<style lang="stylus">
.theme-container
  .sidebar-mask
    // transition transform .2s
    // display block
    background-color rgba(0, 0, 0, 0.25)
    // transform translateX(100%)
    // opacity: 0;
  // &.sidebar-open
  //   .sidebar-mask
  //     transform translateX(0)
  //     opacity: 1;
</style>
