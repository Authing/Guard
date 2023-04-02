<div align=center>
  <img width="250" src="https://files.authing.co/authing-console/authing-logo-new-20210924.svg" />
</div>

<div align="center">
  <a href="javascript:;"><img src="https://img.shields.io/badge/test-passing-brightgreen" /></a>
  <a href="https://forum.authing.cn/" target="_blank"><img src="https://img.shields.io/badge/chat-forum-blue" /></a>
  <a href="https://docs.authing.cn/v2/reference/ui-components/" target="_blank"><img src="https://img.shields.io/badge/docs-passing-brightgreen" /></a>
  <a href="javascript:;"><img src="https://img.shields.io/badge/License-MIT-success" alt="License"></a>
  <a href="javascript:;" target="_blank"><img src="https://img.shields.io/badge/node-%3E=12-green.svg" alt="Node"></a>
</div>

[English](./README.md) | 简体中文

通用登录组件（Guard）帮助开发者屏蔽了很多底层认证的实现细节，同时也包括繁琐的 UI 开发。使得企业和开发者可以快速上线安全的、跨平台的统一登录表单。

<br />

<div align="center">
  <img src="./guard.png" width="650" />
</div>

## 🌍 生态系统

|项目|状态|描述
|-----|----|----|
|@authing/guard-react|[![npm version](https://badge.fury.io/js/@authing%2Fguard-react.svg)](https://www.npmjs.com/package/@authing/guard-react)|<a href="https://docs.authing.cn/v2/reference/guard/v2/web.html" target="_blank">Guard 适用于 React</a>|
|@authing/guard-react18|[![npm version](https://badge.fury.io/js/@authing%2Fguard-react18.svg)](https://www.npmjs.com/package/@authing/guard-react18)|<a href="https://docs.authing.cn/v2/reference/guard/v2/web.html" target="_blank">Guard 适用于 React18</a>|
|@authing/guard-vue2|[![npm version](https://badge.fury.io/js/@authing%2Fguard-vue2.svg)](https://www.npmjs.com/package/@authing/guard-vue2)|<a href="https://docs.authing.cn/v2/reference/guard/v2/web.html" target="_blank">Guard 适用于 Vue2</a>|
|@authing/guard-vue3|[![npm version](https://badge.fury.io/js/@authing%2Fguard-vue3.svg)](https://www.npmjs.com/package/@authing/guard-vue3)|<a href="https://docs.authing.cn/v2/reference/guard/v2/web.html" target="_blank">Guard 适用于 Vue3</a>|
|@authing/guard-angular|[![npm version](https://badge.fury.io/js/@authing%2Fguard-angular.svg)](https://www.npmjs.com/package/@authing/guard-angular)|<a href="https://docs.authing.cn/v2/reference/guard/v2/web.html" target="_blank">Guard 适用于 Angular</a>|
|@authing/guard|[![npm version](https://badge.fury.io/js/@authing%2Fguard.svg)](https://www.npmjs.com/package/@authing/guard)|<a href="https://docs.authing.cn/v2/reference/guard/v2/web.html" target="_blank">Guard 适用于原生 JavaScript</a>|

## 🖥 环境支持

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br>Safari |
| --- | --- | --- | --- |
| IE11, Edge | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## ✨ 特性

### 🌈 拥有丰富的登录注册方式

账号密码 / 手机验证码 / APP 扫码 / 小程序扫码 / 企业身份源 / 社会化登录。

### 📦 内置多种功能，无需额外编写代码

内置了忘记密码的交互 UI、多因素认证（MFA）功能，用户无需编写任何额外代码，即可使用该组件完成任务。

### 🛡 拥有响应式布局

不仅完美兼容移动端和 PC 端，还可以用 CSS 轻松自定义登录框样式。

### 🎇 兼容前端所有主流框架

包括 React、Vue、Angular、JavaScript 等登录组件。

### 🎨 单点登录

Authing 支持 OAuth2、OIDC、SAML、LDAP 等多种协议，开发者可以配合统一用户池，最低五行代码轻松实现单点登录，实现登录定制化。

<div align="center">
  <img src="https://docs.authing.cn/authing-assets/init-guard-react.png" width="650" />
</div>

## 👀 在线体验

点击查看 [sample-sso.authing.cn](https://sample-sso.authing.cn/login?app_id=5d70d0e991fdd597019df70d&protocol=oidc&finish_login_url=%2Finteraction%2Foidc%2Fd7223e6b-b796-4068-a3f2-298d527993c2%2Flogin&login_page_context=)

## 📚 文档

更多示例和使用说明可参考[官方文档](https://docs.authing.cn/v2/reference/guard/v2/)

## ❓ 问题反馈

如果需要在线技术支持，可访问[官方论坛](https://forum.authing.cn/). 此仓库的 issue 仅用于上报 Bug 和提交新功能特性。

## 👍 更新日志

详细发布记录可参考[更新日志](https://docs.authing.cn/v2/reference/guard/guard-changelog.html).

## 🤝 开源共建

- Fork 此仓库
- 创建自己的 git 分支 (git checkout -b my-new-feature)
- 提交你的修改 (git commit -am 'Add some feature')
- 将修改内容推送到远程分支 (git push -u origin my-new-feature)
- 创建一个 Pull Request

感谢所有为 Guard 做出贡献的人！

<div>
  <a href="https://github.com/leinue"><img width="30px" src="https://avatars.githubusercontent.com/u/2469688?v=4" /></a>
  <a href="https://github.com/lixpng"><img width="30px" src="https://avatars.githubusercontent.com/u/19266401?v=4" /></a>
  <a href="https://github.com/yelexin"><img width="30px" src="https://avatars.githubusercontent.com/u/27125445?v=4" /></a>
  <a href="https://github.com/liaochangjiang"><img width="30px" src="https://avatars.githubusercontent.com/u/35447896?v=4" /></a>
  <a href="https://github.com/zhaoyiming0803"><img width="30px" src="https://avatars.githubusercontent.com/u/25874685?s=96&v=4" /></a>
</div>

## 🎁 开源许可

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2019 Authing

## 🔗 友情链接
- [authing-mfa-component](https://github.com/Authing/authing-mfa-component)
- [authing-js-sdk](https://github.com/Authing/authing-js-sdk)
- [AuthingMove](https://github.com/authing/authingmove)
- [authingmove-template](https://github.com/Authing/authingmove-template)
