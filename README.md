# sso

[Authing](https://authing.cn) 是一个企业级身份认证提供商，其集成了 OAuth、LDAP、OIDC 等多种身份认证和授权解决方案。

SSO 套件是 Authing 提供的浏览器端单点登录解决方案，开发者可基于此框架在浏览器端实现单点登录的页面及逻辑，其依托 Authing 的另一开源项目 [Login Form](https://github.com/authing/login-form) 作为 UI 展示层。

## 安装

### 通过 CDN 安装

```html
<!-- 施工中-->
<script src="https://cdn.authing.cn/sdk/javascript/authing-sso.js"></script>
```

### 通过 NPM 安装

```shell
$ npm install authing-sso --save
```

接着你可以使用以下方式引入 `AuthingSSO`：

```javascript
import AuthingSSO from 'authing-sso';
```

## API

### new AuthingSSO(clientID, domain, options)

初始化一个新的 `AuthingSSO` 实例，需要传入你在 [Authing](https://authing.cn/dashboard) 对应应用中的 clientID 和域名信息。

- **clientId {String}**: Authing 应用的 _clientId_；
- **domain {String}**: Authing 中配置的 _域名_. 通常是 _sso.authing.cn/login?client_id=YOUR_CLIENT_ID_；
- **options {Object}**: 允许你自定义 [Login Form](https://github.com/authing/login-form) 的行为。

#### 示例

```js
var clientId = "YOUR_AUTHing_APP_CLIENTID";
var domain = "sso.authing.cn/login?client_id=YOUR_CLIENT_ID_";
var sso = new AuthingSSO(clientId, domain);

sso.on("authenticated", function(authResult) {
  sso.getUserInfo(authResult.accessToken, function(error, profile) {
    if (error) {
      // Handle error
      return;
    }

    localStorage.setItem("accessToken", authResult.accessToken);
    localStorage.setItem("profile", JSON.stringify(profile));

    // Update DOM
  });
});
```

## 浏览器兼容性

兼容 Chrome、Safari、Firefox 和 Edge。

## 问题报告

如果你遇到问题，请打开 Issue 提出问题。

## 开发者信息

[Authing](https://authing.cn)

## License

This project is licensed under the MIT license. See the [LICENSE](./LICENSE) file for more info.
