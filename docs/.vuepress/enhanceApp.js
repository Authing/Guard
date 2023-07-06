import VueNotification from "vue-notification/dist/ssr.js";
import VueSelect from "vue-select";
import "vue-select/src/scss/vue-select.scss";
import Pagination from "vue-pagination-2";
import VTooltip from "v-tooltip";

export default ({ Vue, options, router, siteData }) => {
  Vue.use(VueNotification);
  Vue.use(VTooltip);
  Vue.component("v-select", VueSelect);
  Vue.component("v-pagination", Pagination);
  Vue.extend({
    mixins: [
      {
        data() {
          return {
            appId: "",
          };
        },
      },
    ],
  });

  Vue.prototype.$eventBus = new Vue();

  // // 移动端判断
  // let isMobile = false;
  // if (
  //   navigator.userAgent.match(
  //     /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
  //   )
  // ) {
  //   isMobile = true;
  // }
  // if (document.body.clientWidth < 1060) {
  //   isMobile = true;
  // }
  // Vue.prototype.$isMobile = isMobile;

  if (typeof process === "undefined" || process.env.VUE_ENV !== "server") {
    router.onReady(() => {
      const { app } = router;

      app.$once("hook:mounted", () => {
        setTimeout(() => {
          const { hash } = document.location;
          if (hash.length > 1) {
            const id = decodeURIComponent(hash.substring(1));
            const element = document.getElementById(id);
            if (element) element.scrollIntoView();
          }
        }, 500);
      });
    });
  }
};
