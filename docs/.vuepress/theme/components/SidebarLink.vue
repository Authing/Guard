<script>
import { isActive, hashRE, groupHeaders } from "../util";

export default {
  functional: true,

  props: ["item", "sidebarDepth"],

  render(
    h,
    {
      parent: { $page, $site, $route, $themeConfig, $themeLocaleConfig, routerLink },
      props: { item, sidebarDepth },
    }
  ) {
    // use custom active class matching logic
    // due to edge case of paths ending with / + hash
    const selfActive = isActive($route, item.path);
    // for sidebar: auto pages, a hash link should be active if one of its child
    // matches
    const active =
      item.type === "auto"
        ? selfActive ||
          item.children.some(c =>
            isActive($route, item.basePath + "#" + c.slug)
          )
        : selfActive;
    const link =
      item.type === "external"
        ? renderExternal(h, item.path, item.title || item.path)
        : renderLink(h, item.path, item.title || item.path, active, null, item.dataIndex, routerLink);

    const maxDepth = [
      $page.frontmatter.sidebarDepth,
      sidebarDepth,
      $themeLocaleConfig.sidebarDepth,
      $themeConfig.sidebarDepth,
      1
    ].find(depth => depth !== undefined);

    const displayAllHeaders =
      $themeLocaleConfig.displayAllHeaders || $themeConfig.displayAllHeaders;

    if (item.type === "auto") {
      return [
        link,
        renderChildren(h, item.children, item.basePath, $route, maxDepth, routerLink)
      ];
    } else if (
      (active || displayAllHeaders) &&
      item.headers &&
      !hashRE.test(item.path)
    ) {
      const children = groupHeaders(item.headers);
      return [link, renderChildren(h, children, item.path, $route, maxDepth, routerLink)];
    } else {
      return link;
    }
  }
};

function renderLink(h, to, text, active, level, dataIndex, routerLink) {
  if (active) {
    routerLink(dataIndex)
  }
  const component = {
    props: {
      to,
      activeClass: "",
      exactActiveClass: ""
    },
    class: {
      active,
      "sidebar-link": true
    }
    // directives: [
    //   {
    //     name: 'tooltip',
    //     value: text
    //   }
    // ]
  };

  if (level > 2) {
    component.style = {
      "padding-left": level + "rem"
    };
  }

  return h("RouterLink", component, text);
}

function renderChildren(h, children, path, route, maxDepth, routerLink, depth = 1) {
  if (!children || depth > maxDepth) return null;
  return h(
    "ul",
    { class: "sidebar-sub-headers" },
    children.map(c => {
      const active = isActive(route, path + "#" + c.slug);
      return h("li", { class: "sidebar-sub-header" }, [
        renderLink(h, path + "#" + c.slug, c.title, active, c.level - 1, c.dataIndex, routerLink),
        renderChildren(h, c.children, path, route, maxDepth, routerLink, depth + 1)
      ]);
    })
  );
}

function renderExternal(h, to, text) {
  return h(
    "a",
    {
      attrs: {
        href: to,
        target: "_blank",
        rel: "noopener noreferrer"
      },
      class: {
        "sidebar-link": true
      }
      // directives: [
      //   {
      //     name: 'tooltip',
      //     value: text
      //   }
      // ]
    },
    [text, h("OutboundLink")]
  );
}
</script>

<style lang="stylus">
.sidebar .sidebar-sub-headers
  padding-left 1rem
  font-size 0.95em

a.sidebar-link
  // font-size 14px
  font-weight 400
  display inline-block
  // color $textColor
  color #4E5969
  padding 8px 16px 8px 0.8rem
  line-height 22px
  width: 100%
  box-sizing: border-box
  // white-space nowrap
  // overflow hidden
  // text-overflow ellipsis
  &:hover
    color $accentColor
  &.active
    font-weight 500
    color $accentColor!important
  .sidebar-group &
    padding-left 1.5rem
  .sidebar-sub-headers &
    padding-top 0.25rem
    padding-bottom 0.25rem
    border-left none
    &.active
      font-weight 500
@media (max-width: $MQMobile)
  a.sidebar-link:hover
    color #4E5969 !important
</style>
