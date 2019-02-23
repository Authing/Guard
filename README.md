# sso

[Authing](https://authing.cn) 是一个企业级身份认证提供商，其集成了 OAuth、LDAP、OIDC 等多种身份认证和授权解决方案。

SSO 套件是 Authing 提供的浏览器端单点登录解决方案，开发者可基于此框架在浏览器端实现单点登录的页面及逻辑。

SSO 套件依托 Authing 的另一开源项目 [Login Form](https://github.com/authing/login-form) 作为 UI 展示层。

## 安装

### 通过 CDN 安装

```html
<!-- Latest patch release (recommended for production) -->
<script src="https://cdn.auth0.com/js/lock/11.14.0/lock.min.js"></script>
```

### 通过 NPM 安装

```shell
$ npm install authing-sso
```

接着你可以使用以下方式引入 `AuthingSSO`：

```javascript
import AuthingSSO from 'authing-sso';
```

## API

## 浏览器兼容性

兼容 Chrome、Safari、Firefox 和 Edge。

## 问题报告

如果你遇到问题，请打开 Issue 提出问题。

## 开发者信息

[Authing](https://authing.cn)

## License

This project is licensed under the MIT license. See the [LICENSE](./LICENSE) file for more info.
