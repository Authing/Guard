const { basePath } = require("../env");

const cacheSidebarPlugin = require("./vuepress-plugin-cache-sidebar");
const compressHtmlPlugin = require("./vuepress-plugin-compress-html");

const parsePath = (path) => {
  const urlPath = path.includes(".md") ? path.slice(0, -3) + ".html" : path;
  const relativePath = path.includes(".md")
    ? path.slice(1)
    : path.slice(1) + "README.md";

  const link = urlPath.replace(new RegExp(basePath), "/");

  const text = `{{($site.pages.find(page => page.relativePath === '${relativePath}') || {}).title}}`;

  return {
    link,
    text,
  };
};

const plugins = [
  [
    "vuepress-plugin-container",
    {
      type: "description",
      defaultTitle: "",
    },
  ],
  [
    "vuepress-plugin-container",
    {
      type: "img-description",
      defaultTitle: "",
    },
  ],
  [
    "vuepress-plugin-container",
    {
      type: "hint-success",
      defaultTitle: "",
    },
  ],
  [
    "vuepress-plugin-container",
    {
      type: "hint-info",
      defaultTitle: "",
    },
  ],
  [
    "vuepress-plugin-container",
    {
      type: "hint-warning",
      defaultTitle: "",
    },
  ],
  [
    "vuepress-plugin-container",
    {
      type: "hint-danger",
      defaultTitle: "",
    },
  ],
  [
    "vuepress-plugin-container",
    {
      type: "page-ref",
      before: (path) => {
        const parsed = parsePath(path);

        return `<RouterLink class="page-ref" to="${parsed.link}">${parsed.text}`;
      },
      after: "</RouterLink>",
    },
  ],
  [
    "vuepress-plugin-container",
    {
      type: "page-ref-list",
      before: (pathsStr) => {
        const paths = pathsStr.split(",").map((item) => item.trim());
        const aTags = paths
          .map((path) => {
            const parsed = parsePath(path);
            return `<li class="page-ref-list-item"><RouterLink to="${parsed.link}">${parsed.text}</RouterLink></li>`;
          })
          .join("");

        return `<div class="page-ref-list"><p class="page-ref-list-title">{{$localeConfig.relatedDocText}}</p><ul>${aTags}</ul></div>`;
      },
      after: "",
    },
  ],
  [
    "vuepress-plugin-container",
    {
      type: "embed",
      before: `<div class="embed">`,
      after: "</div>",
    },
  ],
  [
    "vuepress-plugin-container",
    {
      type: "api-method",
      before: (info) => {
        const method = info.match(/method="(.*?)"/)[1];
        const host = info.match(/host="(.*?)"/)[1];
        const path = info.match(/path="(.*?)"/)[1];
        return `<div class="api-method">
            <div class="method">${method.toUpperCase()}</div>
            <div class="path"> ${host}<strong>${path}</strong> </div>
        `;
      },
      after: "</div>",
    },
  ],
  [
    "vuepress-plugin-container",
    {
      type: "api-method-summary",
      before: (info) => {
        return `<div class="api-method-summary"><strong>`;
      },
      after: "</strong></div>",
    },
  ],
  [
    "vuepress-plugin-container",
    {
      type: "api-method-description",
      before: (info) => {
        return `<div class="api-method-description">`;
      },
      after: "</div>",
    },
  ],
  [
    "vuepress-plugin-container",
    {
      type: "api-method-spec",
      before: (info) => {
        return `<form class="api-method-spec tabs">`;
      },
      after: "</form>",
    },
  ],
  [
    "vuepress-plugin-container",
    {
      type: "api-method-request",
      before: (info) => {
        const random = Math.random().toString();
        return `
        <input type="radio" name="tabs" id="tabone${random}" checked>
        <label for="tabone${random}">Request</label>
        <div class="api-method-request tab">
        `;
      },
      after: "</div>",
    },
  ],
  [
    "vuepress-plugin-container",
    {
      type: "api-method-response",
      before: (info) => {
        const random = Math.random().toString();
        return `
          <input type="radio" name="tabs" id="tabtwo${random}">
          <label for="tabtwo${random}">Response</label>
          <div class="api-method-response tab">
        `;
      },
      after: "</div>",
    },
  ],
  [
    "vuepress-plugin-container",
    {
      type: "api-method-path-parameters",
      before: (info) => {
        return `<div class="api-method-path-parameters">
          <div class="parameters-description"> Path Paramter </div>
          <table>
        `;
      },
      after: "</table></div>",
    },
  ],
  [
    "vuepress-plugin-container",
    {
      type: "api-method-body-parameters",
      before: (info) => {
        return `<div class="api-method-body-parameters">
          <div class="parameters-description"> Body Paramter </div>
          <table>
        `;
      },
      after: "</table></div>",
    },
  ],
  [
    "vuepress-plugin-container",
    {
      type: "api-method-headers",
      before: (info) => {
        return `<div class="api-method-headers">
          <div class="parameters-description"> Headers </div>
          <table>
        `;
      },
      after: "</table></div>",
    },
  ],
  [
    "vuepress-plugin-container",
    {
      type: "api-method-query-parameters",
      before: (info) => {
        return `<div class="api-method-query-parameters">
          <div class="parameters-description"> Query Parameters </div>
          <table>
        `;
      },
      after: "</table></div>",
    },
  ],
  [
    "vuepress-plugin-container",
    {
      type: "api-method-form-data-parameters",
      before: (info) => {
        return `<div class="api-method-form-data-parameters">
          <div class="parameters-description"> Form Data Parameters </div>
          <table>
        `;
      },
      after: "</table></div>",
    },
  ],
  [
    "vuepress-plugin-container",
    {
      type: "api-method-parameter",
      before: (info) => {
        const name = info.match(/name="(.*?)"/)[1];
        const type = info.match(/type="(.*?)"/)[1];
        const required = info.match(/required=(.*)/)[1];
        return `
        <tr class="api-method-parameter">
          <td>
          ${name}
          ${
            required.includes("true")
              ? '<div class="required">REQUIRED</div>'
              : '<div class="optional">OPTIONAL</div>'
          }
          </td>
          <td>${type}</td>
          <td class="description">
        `;
      },
      after: "</td></tr>",
    },
  ],
  [
    "vuepress-plugin-container",
    {
      type: "api-method-response-example",
      before: (info) => {
        const httpCode = info.match(/httpCode=(.*)/)[1];
        const OkDIV = '<div> <span class="green-dot"></span> 200: OK </div>';
        const ErrDIV =
          '<div> <span class="red-dot"></span> 400: Bad Request </div>';
        return `<div class="api-method-response-example">
          <div class="parameters-description">
            ${httpCode.includes("200") ? OkDIV : ""}
            ${httpCode.includes("400") ? ErrDIV : ""}
          </div>
        `;
      },
      after: "</div>",
    },
  ],
  [
    "vuepress-plugin-container",
    {
      type: "api-method-response-example-description",
      before: (info) => {
        return `<div class="api-method-response-example-description">`;
      },
      after: "</div>",
    },
  ],
  // 更新时间
  [
    "@vuepress/last-updated",
    {
      transformer: (timestamp, lang) => {
        // 不要忘了安装 moment
        const dayjs = require("dayjs");
        return dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");
      },
    },
  ],

  // 代码块 可以复制
  [
    "vuepress-plugin-code-copy",
    {
      // selector: String,
      // 顶部是最好的选择 但是顶部还有语言标识 会出现重叠
      align: "bottom",
      // color: String,
      // backgroundTransition: Boolean,
      // backgroundColor: String,
      successText: "复制成功",
      // staticIcon: true
    },
  ],

  // 图片 可以放大
  [
    "@vuepress/plugin-medium-zoom",
    {
      selector:
        ".theme-default-content :not(a) > img:not(.no-zoom), .theme-default-content > img",
      delay: 1000,
      options: {
        margin: 24,
        background: "rgba(0,0,0,0.85)",
        scrollOffset: 0,
      },
    },
  ],

  // nav 过长的时候 自动调整位置 使高亮位置呈现在视觉范围
  // "@vuepress/active-header-links",

  [compressHtmlPlugin],
  [cacheSidebarPlugin],

  [require("vuepress-plugin-tabs")],
];

module.exports = plugins;
