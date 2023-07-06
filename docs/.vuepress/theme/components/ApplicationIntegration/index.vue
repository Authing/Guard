<template>
  <div class="application-integration">
    <slot name="sidebar"></slot>
    <section class="integration-banner">
      <div class="banner-inner">
        <div class="integration-banner-title">
          <h1>{{ langMap.title }}</h1>
          <p class="description">
            {{ langMap.subtitle }}
          </p>
        </div>
        <img
          width="500px"
          src="~@theme/assets/images/integration/banner.png"
          alt=""
        />
      </div>
    </section>

    <section>
      <div class="integration-main-content">
        <div class="apps-header">
          <span
            class="hide-in-mobile"
            v-show="!mobileSearchVisible"
            @click="showMobileSearch"
          >
            <IconFont class="mobile-search-icon" type="authing-icon-search" />
          </span>
          <span
            class="search-split-line hide-in-mobile"
            v-show="!mobileSearchVisible"
          ></span>

          <AuthingTabs
            ref="tabRef"
            :tabs="tabs"
            :activeTab="currentCategory"
            @tab-click="handleTabClick"
            v-show="!mobileSearchVisible"
          />

          <SearchApp
            ref="searchRef"
            v-model="searchKeyword"
            :apps="allApps"
            :class="{
              searching: mobileSearchVisible
            }"
            @blur="hideMobileSearch"
          />
        </div>

        <div
          ref="appsContainerRef"
          class="apps-container"
          v-if="pagedApps.length"
        >
          <template v-for="item of pagedApps">
            <RouterLink
              :to="item.link"
              v-if="!item.empty"
              class="app-item"
              :title="item.name"
              ref="appItemRef"
              :key="item.link"
            >
              <div class="app-logo">
                <img
                  :width="item.imageWidth || '100%'"
                  :height="item.imageHeight || '106px'"
                  :src="
                    require(`@theme/assets/images/integration/${item.image}`)
                  "
                  :srcset="
                    `${require('@theme/assets/images/integration/' +
                      item.image2x)} 2x`
                  "
                  :alt="item.name"
                />
              </div>
              <h5 class="app-name">{{ item.name }}</h5>
            </RouterLink>
            <div class="empty-app-item" :key="item.link" v-else></div>
          </template>
        </div>
        <AuthingEmpty
          description="暂无应用"
          :style="{
            marginTop: '100px'
          }"
          v-else
        />

        <v-pagination
          class="integration-pagination"
          v-model="page"
          :records="filteredApps.length"
          :per-page="pageSize"
        />
      </div>
    </section>

    <section class="apn">
      <h3>
        {{ langMap.apnTitle }}
      </h3>
      <p>
        {{ langMap.apnSubtitle }}
      </p>
      <router-link to="/apn/overview/" target="_blank">
        {{ langMap.apnLink }}
      </router-link>
    </section>
  </div>
</template>

<script>
import AuthingTabs from "@theme/components/AuthingTabs/index.vue";
import AuthingEmpty from "@theme/components/AuthingEmpty/index.vue";
import SearchApp from "@theme/components/ApplicationIntegration/SearchApp.vue";
import keyBy from "lodash/keyBy";
import IconFont from "@theme/components/IconFont/index.vue";
import debounce from "lodash/debounce";
import { MQMobile } from "@theme/util/constants";

export default {
  components: {
    AuthingTabs,
    AuthingEmpty,
    SearchApp,
    IconFont
  },
  data() {
    return {
      page: 1,
      pageSize: 20,
      offsetFromViewport: null,
      searchKeyword: "",
      mobileSearchVisible: false,
      lastRowFillCount: 0
    };
  },
  computed: {
    langMap() {
      if (this.$lang === "en-US") {
        return {
          title: "Application integration",
          subtitle:
            "Do not worry about login, authing integrates all mainstream applications!",
          apnTitle: "Want to join Authing APN?",
          apnSubtitle:
            "Authing APN is a great way to increase the number of users.",
          apnLink: "Learn more"
        };
      } else if (this.$lang === "zh-CN") {
        return {
          title: "应用集成",
          subtitle: "不要再为登录发愁，Authing 集成了所有主流应用 ！",
          apnTitle: "想要加入 Authing 合作网络？",
          apnSubtitle:
            "你可以将应用加入到 Authing 合作网络，让千万客户快速集成访问",
          apnLink: "了解更多"
        };
      }
    },
    currentCategory() {
      return this.$route.query.category || "all";
    },
    tabs() {
      return this.$frontmatter.categories.map(item => {
        return {
          label: item.name,
          key: item.key
        };
      });
    },
    appKeyMap() {
      return keyBy(this.allApps, "key");
    },
    maxPage() {
      return Math.ceil(this.filteredApps.length / this.pageSize);
    },
    categorizedApps() {
      if (this.currentCategory === "all") {
        // LDAP 协议是单独分类，不在所有应用中显示
        return this.allApps.filter(item => item.category !== "ldap");
      }

      return this.allApps.filter(
        item => item.category === this.currentCategory
      );
    },
    filteredApps() {
      if (!this.searchKeyword) {
        return this.categorizedApps;
      }

      if (this.currentCategory === "ldap") {
        return this.categorizedApps.filter(app =>
          app.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
        );
      }

      return this.allApps
        .filter(app =>
          app.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
        )
        .filter(app =>
          this.currentCategory === "all"
            ? app.category !== "ldap"
            : app.category === this.currentCategory
        ); // Filter apps by keyword and category.

      return apps;
    },
    filledApps() {
      const apps = [...this.filteredApps];
      let fillCount = this.lastRowFillCount;

      while (fillCount > 0) {
        apps.push({
          empty: true
        });
        fillCount--;
      }

      return apps;
    },
    pagedApps() {
      return this.filledApps.slice(
        this.pageSize * (this.page - 1),
        this.pageSize * this.page
      );
    },
    allApps() {
      return this.$frontmatter.apps.map(app => ({
        ...app,
        link: `${this.$localeConfig.path}integration/${app.key}`
      }));
    }
  },
  watch: {
    page: {
      // immediate: true,
      handler(page) {
        if (page !== Number(this.$route.query.page)) {
          this.$router.replace({
            query: {
              ...this.$route.query,
              page
            }
          });
        }

        if (page > this.maxPage) {
          this.$router.replace({
            query: {
              ...this.$route.query,
              page: this.maxPage
            }
          });
        }

        if (page < 1) {
          this.$router.replace({
            query: {
              ...this.$route.query,
              page: 1
            }
          });
        }
      }
    },
    filteredApps() {
      this.setLastRowFillCount();
    },
    searchKeyword() {
      this.page = 1; // Always show the first page of apps when searching by keyword.
    },
    currentCategory() {
      this.page = 1; // Always show the first page of apps when switching to a new category.
    }
  },
  mounted() {
    this.page = Number(this.$route.query.page || 1);
    this.setLastRowFillCount();
    window.addEventListener("resize", this.setLastRowFillCount);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.setLastRowFillCount);
  },
  methods: {
    handleTabClick(tab) {
      const tabsEl = this.$refs.tabRef.$el;
      this.offsetFromViewport = tabsEl.getBoundingClientRect().top;
      this.$router.replace(
        {
          query: {
            category: tab.key
          }
        },
        () => {
          this.$nextTick(() => {
            window.scroll(0, tabsEl.offsetTop - this.offsetFromViewport);
          });
        }
      );
    },
    showMobileSearch() {
      this.mobileSearchVisible = true;
      this.$nextTick(() => {
        this.$refs.searchRef.focus();
      });
    },
    hideMobileSearch() {
      this.mobileSearchVisible = false;
    },
    setLastRowFillCount: debounce(function() {
      const { appsContainerRef, appItemRef } = this.$refs;

      if (
        !appsContainerRef ||
        !appItemRef ||
        !appItemRef.length ||
        !this.filteredApps.length
      ) {
        this.lastRowFillCount = 0;
        return;
      }
      const appsCount = this.filteredApps.length;
      const containerWidth = this.$refs.appsContainerRef.clientWidth;
      // 每个 logo 之间的水平间隔，来自下面的 $appItemHorizontalSpace 和 $mobileAppItemHorizontalSpace
      const appItemHoriaontalSpace =
        document.body.offsetWidth > MQMobile ? 20 : 5;
      const appItemWidth = appItemRef[0].$el.offsetWidth;

      // 每行能放多少个
      const everyRowCount = Math.floor(
        (containerWidth + appItemHoriaontalSpace) /
          (appItemWidth + appItemHoriaontalSpace)
      );

      // 最后一行有多少个
      const lastRowCount = appsCount % everyRowCount || everyRowCount;

      this.lastRowFillCount = everyRowCount - lastRowCount;
    }, 200)
  }
};
</script>

<style lang="stylus">
$appItemVerticalSpace = 60px;
$mobileAppItemVerticalSpace = 1.5625rem;
$appItemHorizontalSpace = 20px; // 改了这里记得改 setLastRowFillCount
$mobileAppItemHorizontalSpace = 5px; // 改了这里记得改 setLastRowFillCount

.application-integration {
  padding-top: $navbarHeight;
  padding-bottom: 100px;
  .apn {
    margin-top: 40px;
    text-align: center;
    h3,p {
      margin: 16px 0;
    }
    h3 {
      font-style: normal;
      font-weight: 500;
      font-size: 24px;
      line-height: 38px;
      color: #282d3c;
    }
    p {
      font-style: normal;
      font-weight: 400;
      font-size: 20px;
      line-height: 32px;
      color: #4e5969;
    }
    a {
      margin-top:16px;
      display: inline-block;
      width: 160px;
      height: 40px;
      line-height: 40px;
      background: $accentColor;
      color: #fff;
      border-radius: 4px;
    }
  }
  .authing-tabs {
    align-self: stretch;
    overflow: auto;
    white-space: nowrap;
  }
  .hide-in-mobile {
    position: absolute;
  }
  .sidebar {
    display: none;
  }
  .integration-banner {
    background: #F7F8FA;
    .banner-inner {
      max-width: $mainContentWidthWithoutSideBar;
      padding: 0 24px;
      margin: 0 auto;
      height: 450px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow: hidden;
    }
    img {
      padding-top:80px;
      margin-right: 40px;
      margin-left: 40px;
      width: 53%;
      pointer-events: none;
    }
    .integration-banner-title {
      // margin-right: 272px;
      h1 {
        color: #293350;
        font-size: 36px;
        margin-bottom: 18px;
      }

      .description {
        color: #9BA1A7;
        font-size: 20px;
        font-weight: 500;
      }
    }
  }
  .apps-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .integration-main-content {
    padding: 46px 24px 0 24px;
    max-width: $mainContentWidthWithoutSideBar;
    box-sizing: border-box;
    margin: 0px auto;
  }
  .apps-container {
    margin-top: -14px;
    display: flex;
    margin-left: -($appItemHorizontalSpace);
    flex-wrap: wrap;
    justify-content: space-between;
    .app-item {
      margin-top: $appItemVerticalSpace;
      cursor: pointer;
      transition: transform .3s;
      &:hover {
        .app-name {
          color: $accentColor;
        }
        .app-logo {
          transform: translateY(-6px);
        }
      }
    }
    .empty-app-item, .app-item {
      box-sizing: border-box;
      margin-left: $appItemHorizontalSpace;
      width: 208px;
      flex-shrink: 0;
    }
    .app-logo {
      height: 106px;
      box-shadow: 0px 6px 12px 0px rgba(161, 171, 200, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #EEEEEE;
      border-radius: 4px;
      transition: transform .3s;
    }
    .app-name {
      color: #293350;
      font-size: 16px;
      font-weight: 400;
      text-align: center;
      margin: 0;
      margin-top: 16px;
    }
  }
  .integration-pagination {
    margin-top: 58px;
    display: flex;
    justify-content: flex-end;
  }
  .mobile-search-icon {
    display: none;
  }
}

@media (max-width: $MQMobile) {
  .application-integration {
    padding-bottom: 25px;
    .hide-in-mobile  {
      position: relative;
    }
    .sidebar {
      display: block;
    }
    .search-app-wrapper {
      order: 1;
      width: 1rem;
      overflow: hidden;
    }
    .authing-tabs {
      order: 2;
    }
    .integration-banner {
      .banner-inner {
        padding-right: 0;
        padding-left: 1.8125rem;
        height: 13.9375rem;
        position: relative;
        img {
          position: absolute;
          right: 0;
          margin-right: 0;
          margin-left: 0;
          min-width: 15rem;
          transform: translateY(22px);
        }
      }
      .integration-banner-title {
        max-width: 43%;
        h1 {
          font-size: 1.75rem;
          margin-top: 0;
        }
        .description {
          font-size 1rem;
          margin-bottom: 0;
        }
      }
    }
    .integration-main-content {
      padding: 0 1.25rem 0 1.25rem;
    }
    .apps-header {
      box-shadow: 0px 1px 0px 0px #EEEEEE;
      margin: 0 -1.25rem 24px -1.25rem
      padding: 5px 1.25rem 5px 1.25rem;
      .search-app-wrapper {
        width: 0;
        overflow: hidden;
      }
      .searching {
        width: auto;
      }
      .authing-tabs {
        flex: 1;
      }
    }
    .mobile-search-icon {
      display: unset;
      cursor: pointer;
    }
    .search-split-line {
      width: 1px;
      min-width 1px;
      background-color: #EEEEEE;
      height: 1.125rem;
      margin: 0 0.625rem;
    }
    .apps-container {
      margin-left: -($mobileAppItemHorizontalSpace);
      .app-item {
        height: auto;
        margin-top: $mobileAppItemVerticalSpace;
      }
      .empty-app-item, .app-item {
        margin-left $mobileAppItemHorizontalSpace;
        width: 9.8125rem;
      }
      .app-logo, .app-logo img {
        max-width: 100%;
        max-height: 78px;
      }
    }
  }
}
</style>
