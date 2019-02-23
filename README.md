# Guard

[Authing](https://authing.cn) 是一个企业级身份认证提供商，其集成了 OAuth、LDAP、OIDC 等多种身份认证和授权解决方案。

Guard 套件是 Authing 提供的浏览器端单点登录解决方案，开发者可基于此框架在浏览器端实现单点登录的页面及逻辑，其依托 Authing 的另一开源项目 [Login Form](https://github.com/authing/login-form) 作为 UI 展示层。

## 安装

### 通过 CDN 安装

```html
<!-- 施工中-->
<script src="https://cdn.authing.cn/sdk/javascript/authing-guard.js"></script>
```

### 通过 NPM 安装

```shell
$ npm install authing-guard --save
```

接着你可以使用以下方式引入 `AuthingGuard`：

```javascript
import AuthingGuard from 'authing-guard';
```

## API

### new AuthingGuard(clientID, domain, options)

初始化一个新的 `AuthingGuard` 实例，需要传入你在 [Authing](https://authing.cn/dashboard) 对应应用中的 clientID 和域名信息。

- **clientId {String}**: Authing 应用的 _clientId_；
- **domain {String}**: Authing 中配置的 _域名_. 通常是 _sso.authing.cn/login?client_id=YOUR_CLIENT_ID_；
- **options {Object}**: 允许你自定义 [Login Form](https://github.com/authing/login-form) 的行为。

#### 示例

```js
var clientId = "YOUR_AUTHing_APP_CLIENTID";
var domain = "sso.authing.cn/login?client_id=YOUR_CLIENT_ID_";
var guard = new AuthingGuard(clientId, domain);

guard.on("authenticated", function(authResult) {
  guard.getUserInfo(authResult.accessToken, function(error, profile) {
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

### getUserInfo(accessToken, callback)

一旦用户登录，并且你已经获取 accessToken 后你就可以通过 `getUserInfo` 获取用户资料。

- **accessToken {String}**: accessToken.
- **callback {Function}**: 获取用户资料后会处罚此函数.

#### Example

```js
guard.getUserInfo(accessToken, function(error, profile) {
  if (!error) {
    alert("hello " + profile.username);
  }
});
```

### on(event, callback)

Guard 会在以下生命周期中触发相应事件：

事件名称          | 事件说明              | 事件参数 | 事件参数说明
--------------- | -------------------- | --------| -------- 
authingLoad     | Authing Client ID 和 Secret验证通过，加载完成   |      authing | authing 对象，可直接操作 ``login``,``register``等方法
authingUnload     | Authing Client ID 和 Secret验证失败   |      ``error`` | 错误信息
oauthLoad     | OAuth列表加载完成   |      oauthList | 完整的 OAuth 列表，若用户未在后台配置过则为空
oauthUnload     | OAuth列表加载失败  |      ``error`` | 错误信息
login     | 用户登录成功   |      user | 用户数据
loginError   | 用户登录失败  |      ``error`` | 错误信息，包含字段缺失／非法或服务器错误等信息
register     | 用户注册成功   |      user | 用户数据
registerError     | 用户注册失败  |      ``error`` | 错误信息，包含字段缺失／非法或服务器错误等信息
emailSent     | 忘记密码邮件发送成功   |      data | 发送的结果
emailSentError     | 忘记密码邮件发送失败  |      ``error`` | 错误信息
resetPassword     | 重置密码成功   |      data | 重置密码结果
resetPasswordError     | 重置密码失败  |      ``error`` | 错误信息
scanning     | 扫码登录成功   |      user | 用户数据
scanningError     | 扫码登录失败  |      ``error`` | 错误信息
scanningIntervalStarting     | 开始监听扫码事件   |      interval | 用户可使用 ``clearInterval`` 停止监听
formClosed     | Login Form 关闭事件   |      null | 用户按下 ESC 或点击右上方的关闭按钮后会触发此事件

## 浏览器兼容性

兼容 Chrome、Safari、Firefox 和 Edge。

## 问题报告

如果你遇到问题，请打开 Issue 提出问题。

## 开发者信息

[Authing](https://authing.cn)

## License

This project is licensed under the MIT license. See the [LICENSE](./LICENSE) file for more info.
