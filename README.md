# Guard

[Authing](https://authing.cn) 是一个企业级身份认证提供商，其集成了 OAuth、LDAP、OIDC 等多种身份认证和授权解决方案。

Guard 套件是 Authing 提供的浏览器端单点登录解决方案，开发者可基于此框架在浏览器端实现单点登录的页面及逻辑，其依托 Authing 的另一开源项目 [Login Form](https://github.com/authing/login-form) 作为 UI 展示层。

Guard 提供的表单拥有以下基本功能：

 - 邮箱／密码登录注册
 - 忘记密码以及重置密码
 - 记住账号功能（加密存储到浏览器本地）
 - 第三方 OAuth 登录（需先在后台配置）
 - 小程序扫码登录（需先在后台配置）
 - 响应式特性
 - SSO

![login-form](https://cdn.authing.cn/sdk/guide/image/login-form.png)

[点击体验](https://sample.authing.cn/#/) 或 [在 jsfiddle 上尝试](https://jsfiddle.net/yelexin/Lanvjpct)。

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
- **options {Object}**: 允许你自定义表单的 UI，相关参数请参考 [自定义](https://github.com/Authing/Guard#自定义)

#### 示例

```js
var clientId = "YOUR_AUTHing_APP_CLIENTID";
var domain = "sso.authing.cn/login?client_id=YOUR_CLIENT_ID_";
var guard = new AuthingGuard(clientId, domain);

guard.on('login', (userInfo) => {
  console.log('用户登录成功', userInfo);

  localStorage.setItem("accessToken", userInfo.token);
  localStorage.setItem("userInfo", JSON.stringify(userInfo));

  // Update DOM

});

guard.on('loginError', (error) => {
  // Handle error 
  console.log('用户登录失败', error);
})
```

如果你想获取其他事件，请参考[这里](https://github.com/Authing/Guard#onevent-callback)。

### authing 对象

如果你想获取 authing 对象以调用[用户接口](https://docs.authing.cn/#/user_service/user_service)，请使用如下代码：

``` javascript
guard.on('authenticated', (authing) => {
  console.log('Authing 实例初始化成功', authing);

  // authing.login
  // authing.register
  // authing.logout
  // authing.checkLoginStaus
  // ...
  // 更多 请参考 https://docs.authing.cn/#/user_service/user_service
});
```

### show(mountId)

显示登录表单，同时允许覆盖初始化时的配置。

- **mountId {String}**: 指定 Authing form 将在何处显示，接受一个 html 元素 id，不含#号。不指定则默认全屏弹出 Modal 登录框。

#### 示例

```js
// 没有 mountId
guard.show();

// 将会挂载在 mountId 上
guard.show('#mountId');

```

### hide()

隐藏表单

#### 示例

```js
guard.hide();
```

### on(event, callback)

Guard 会在以下生命周期中触发相应事件：

事件名称          | 事件说明              | 事件参数 | 事件参数说明
--------------- | -------------------- | --------| -------- 
authenticated    | Authing Client ID 验证通过，加载完成   |      authing | authing 对象，可直接操作 ``login``,``register``等方法
authenticatedOnError     | Authing Client ID 验证失败   |      ``error`` | 错误信息
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

### 自定义

Guard 提供的表单拥有以下基本功能：

 - 邮箱／密码登录注册
 - 忘记密码以及重置密码
 - 记住账号功能（加密存储到浏览器本地）
 - 第三方 OAuth 登录（需先在后台配置）
 - 小程序扫码登录（需先在后台配置）
 - 响应式特性
 - SSO

![login-form](https://cdn.authing.cn/sdk/guide/image/login-form.png)

[点击体验](https://sample.authing.cn/#/) 或 [在 jsfiddle 上尝试](https://jsfiddle.net/yelexin/Lanvjpct)。

### UI 定制

以下是完整的参数列表：

参数名称          | 是否必填              | 默认值   | 类型   |参数说明|回调参数
--------------- | -------------------- | --------| --------|------------|------------
**clientId**     |  **是**   |      无   | String   |Authing Client ID| -
**domain**     |  **是**   |      无   | String   | 回调链接 | -
mountId   |  否   |无|String|指定 Authing form 将在何处显示，接受一个 html 元素 id，不含`#`号。不指定则默认全屏弹出 Modal 登录框|-
title     |  否   |      Authing  | String   |**产品名称**| -
logo     |  否   |     [Authing LOGO]  | String   |**产品logo**，默认为 Authing 的官方 Logo| -
forceLogin     |  否   |      false  | Boolean   |**是否将注册和登录合并**，合并后如果用户不存在将自动注册| -
hideQRCode     |  否   |      false  | Boolean   |**是否隐藏小程序扫码登录**，在开发者在 Authing 控制台开启小程序扫码登录后，若此项为 true 将不显示小程序扫码登录| -
hideUP     |  否   |      false  | Boolean   |**是否隐藏用户名-密码登陆**，隐藏后将不显示用户名-密码登录框| -
hideUsename     |  否   |      false  | Boolean   |**是否隐藏注册时的用户名填写**，隐藏后将不显示用户名输入框| -
hideOAuth     |  否   |      false  | Boolean   |**是否隐藏第三方 OAuth 登录**，在开发者在 Authing 控制台开启 OAuth 登录后，若此项为 true 将隐藏全部 OAuth 登录| -
hideClose|否|false|Boolean|**是否隐藏登录框右上角的关闭按钮**，如果隐藏，用户将不能通过点击按钮或按 ESC 关闭登录框| -
**placeholder**     |  否   |      {}  | Object   |**定制输入框的 paceholder**| -
**placeholder**.username     |  否   |      请输入用户名  | String   |**定制输入框的 paceholder**| -
**placeholder**.email     |  否   |      请输入邮箱  | String   |**用户名输入框的 paceholder**| -
**placeholder**.password     |  否   |      请输入密码  | String   |**邮箱输入框的 paceholder**| -
**placeholder**.confirmPassword     |  否   |      请确认密码  | String   |**密码输入框的 paceholder**| -
**placeholder**.verfiyCode     |  否   |      请输入验证码  | String   |**验证码输入框的 paceholder**| -
**placeholder**.newPassword     |  否   |      请输入新密码  | String   |**新密码输入框的 paceholder**| -
**qrcodeScanning**     |  否   |      {}  | Object   |**小程序扫码登录的配置项**| -
**qrcodeScanning**.redirect     |  否   |      true  | Boolean   |**是否执行跳转（在用户后台配置的URL）**，若值为false，用户数据会通过 onSuccess 回调函数返回| -
**qrcodeScanning**.interval     |  否   |      1500  | Number   |每隔多少秒检查一次是否扫码，默认1500 | -
**qrcodeScanning**.tips     |  否   |      使用 微信 或小程序 身份管家 扫码登录  | String   |提示信息，可写HTML | -
**host**     |  否   |      {}  | Object   |**小程序扫码登录的配置项**| -
**host**.user     |  否   |      [Authing 官方链接]  | String   |**GraphQL 链接**，默认 Authing 官方链接，此处用于私有部署 Authing 的用户使用| -
**host**.oauth     |  否   |      [Authing 官方链接]  | String   |**GraphQL 链接**，默认 Authing 官方链接，此处用于私有部署 Authing 的用户使用| -

## 浏览器兼容性

兼容 Chrome、Safari、Firefox 和 Edge。

## 问题报告

如果你遇到问题，请打开 Issue 提出问题。

## 开发者信息

[Authing](https://authing.cn)

## License

This project is licensed under the MIT license. See the [LICENSE](./LICENSE) file for more info.
