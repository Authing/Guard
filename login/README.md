# 一行代码生成登录表单

----------

一行代码生成表单仅适用于 **JavaScript** 客户端应用，该功能简称 [Login-Form](https://github.com/Authing/login-form)。

该表单拥有以下基本功能：

 - 邮箱／密码登录注册
 - 忘记密码以及重置密码
 - 记住账号功能（加密存储到浏览器本地）
 - 第三方 OAuth 登录（需先在后台配置）
 - 小程序扫码登录（需先在后台配置）
 - 响应式特性

![login-form](https://cdn.authing.cn/sdk/guide/image/login-form.png)

[点击体验](https://sample.authing.cn/#/) 或 [在 jsfiddle 上尝试](https://jsfiddle.net/yelexin/Lanvjpct)。

## 使用步骤

### 1. 引入代码

目前只支持 **script** 引入，暂不支持 **NPM** 安装，使用了本功能的开发者可以不必再安装 **authing-js-sdk**，因为通过 script 标签引入的代码中包含了 **authing-js-sdk**。

``` javascript
<script src="https://cdn.authing.cn/sdk/javascript/authing-login-form-1.2.2.js"></script>
```

### 2. 显示表单

初始化 AuthingForm 即可，查看怎么获取 Client Id 和 Secret 请 [点击这里](https://docs.authing.cn/#/quick_start/howto)。

``` javascript

  new AuthingForm({
    clientId: '填入_Authing_的_client_ID',
    secret: '填入_Authing_client_ID_的_secret'
  });

```

完成这两步后就可以使用表单了。

### 3. 完整代码

``` html
<script src="https://cdn.authing.cn/sdk/javascript/login-form.1.2.2.js"></script>
<script>
  new AuthingForm({
    clientId: '填入_Authing_的_client_ID',
    secret: '填入_Authing_client_ID_的_secret'
  });
</script>
```

为了应用的安全起见，建议参数中的 ``secret`` 以加密方式存储在客户端代码中。
如果你想获取用户登录事件，请参考[完整事件列表](https://docs.authing.cn/#/quick_start/login-form?id=%E4%BA%8B%E4%BB%B6%E5%93%8D%E5%BA%94)。

## 高级功能

### 方法

Login-Form 提供了两个方法用以操作界面的显示和隐藏，方法名见下表：

方法名称          | 方法参数              | 功能
--------------- | -------------------- | --------|
**show**     |  **mountId**   | 指定 Authing form 将在何处显示，接受一个 html 元素 id，不含`#`号。不指定则默认全屏弹出 Modal 登录框
**hide**     | 无             | 隐藏表单

在初始化完构造函数后会自动执行 ``show`` 方法。

### 完整参数

Login-Form 的构造函数 ``AuthingForm`` 提供了一些高级功能。

以下是完整的参数列表：

参数名称          | 是否必填              | 默认值   | 类型   |参数说明|回调参数
--------------- | -------------------- | --------| --------|------------|------------
**clientId**     |  **是**   |      无   | String   |Authing Client ID| -
**secret**     |  **是**   |      无   | String   |Authing Client Secret| -
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


完整代码：

``` javascript
  var form = new AuthingForm({

  	// 必选，client ID
    clientId: '5b7f79f519915500015f18ac',
    // 必选，secret
    secret: '82f36cba243e13f81f06675193732af7',

    host: {
      user: null,
      oauth: null
    },

    title: 'Authing',
    logo: 'https://cdn.authing.cn/authing-logo.png',

    forceLogin: false,
    hideQRCode: false,
    hideUP: false,
    hideOAuth: false,
    hideUsername: false,
    hideClose: true,

    mountId: 'app',

    // 输入框的placeholder
    placeholder: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      verfiyCode: '',
      newPassword: ''
    },

    qrcodeScanning: {
      redirect: true, // 可选，是否执行跳转（在用户后台配置的URL），默认为true，相关用户信息回传至url上
      interval: 1500, // 可选，每隔多少秒检查一次是否扫码，默认1500
      tips: '使用 微信 或小程序 身份管家 扫码登录', // 可选，提示信息，可写HTML
    }
  });
```
### 事件响应

Login-Form 还提供了 **十五** 个事件，开发者可根据需要定制操作。

在初始化 ``AuthingForm`` 后，可使用 ``on``方法，如：

``` javascript
var form = new AuthingForm({ clientId: 'xxxx', secret: 'xxxxx'});
form.on('login', function(user) {
	// 成功登录后的回调事件，参数 user 为用户数据
});
```

完整的事件列表如下：

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

完整代码如下：

``` javascript
form.on('authingLoad', function (authing) {
	console.log('on authing load', authing);
});

form.on('authingUnload', function (error) {
	console.log('on authing load error', error);
});

form.on('oauthLoad', function (oauthList) {
	console.log('on oauth load', oauthList);
});

form.on('oauthUnload', function (error) {
	console.log('on oauth unload', error);
});

form.on('login', function (user) {
	console.log('on login', user);
});

form.on('loginError', function (error) {
	console.log('on login error', error);
});

form.on('register', function (user) {
	console.log('on register', user);
});

form.on('registerError', function (error) {
	console.log('on register error', error);
});

form.on('emailSent', function (data) {
	console.log('on email sent', data);
});

form.on('emailSentError', function (error) {
	console.log('on email sent error');
});

form.on('resetPassword', function (result) {
	console.log('on reset password');
});

form.on('resetPasswordError', function (error) {
	console.log('on reset password error', error);
});

form.on('scanning', function (data) {
	console.log('on scanning success', data);
});

form.on('scanningError', function (error) {
	console.log('on scanning error', error);
});

form.on('scanningIntervalStarting', function (interval) {
	console.log('on scanning interval starting', interval);
});

form.on('formClosed', function () {
	console.log('on form closed');
});
```
