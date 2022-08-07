<div align=center>
  <img width="300" src="https://files.authing.co/authing-console/authing-logo-new-20210924.svg" />
</div>

<br />

简体中文 | [English](./README.md)

<br />

Guard 是 Authing 提供的一种轻便的认证组件，你可以把它嵌入在你任何的 SPA（Single Page Application）应用中，一站式处理复杂的用户认证流程。

准备好你的 Angular 项目，跟随引导将 Authing Guard 接入到你的 Angular 项目中吧！

## 安装
``` shell
npm insstall --save @authing/angular
```

## 初始化

|字段|类型|默认值|必传
|-----|----|----|----|
|appId|String| - |Y|
|mode|normal / modal|normal|N|
|defaultScene|GuardModuleType|login|N|
|lang|zh-CN / en-US|zh-CN|N|
|isSSO|Boolean|true|N|
|host|String| - |N|
|scope|String| - |N|
|redirectUri|String| - |N|
|state|String| - |N|

``` json
// angular.json
{
  "projects": {
    "architect": {
      "build": {
        "styles": [
          "node_modules/@authing/guard-angular/dist/guard.min.css"
        ]
      }
    }
  }
}
```

``` javascript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { GuardModule } from '@authing/guard-angular'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GuardModule.forRoot({
      appId: '62e22721c889dd44bad1dda2',
      host: 'https://guard-test-2022.authing.cn',
      redirectUri: 'http://localhost:3000/callback'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
```

``` typescript
// 组件中使用 Guard 的 API
import { Component } from '@angular/core'

import { GuardService } from '@authing/guard-angular'

@Component({
  selector: 'login-container',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor (
    private guard: GuardService
  ) {}

  userInfo = ''

  ngOnInit () {
   console.log(this.guard.client)
  }
}
```

## Guard 提供三种登录模式

### 嵌入模式

渲染 Guard 组件

``` typescript
import { Component } from '@angular/core'

import { GuardService } from '@authing/guard-angular'

@Component({
  selector: 'login-container',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor (
    private guard: GuardService
  ) {}

  userInfo = ''

  ngOnInit () {
    this.guard.client.start('#guard-root')
  }
}
```

### 弹窗模式

当 Guard 实例化的参数 `mode` 为 `modal` 时，将启动模态模式，下面的 API 可用于显示和隐藏 Guard。

``` javascript
this.guard.client.show()
```

``` javascript
this.guard.client.hide()
```

### 跳转模式

使用 code 码登录，跳转到登录页面

``` javascript
this.guard.client.startWithRedirect()
```

code 换 token，自动处理页面重定向

``` javascript
this.guard.client.handleRedirectCallback()
```

登出

``` javascript
this.guard.client.logout()
```

## 注册事件

``` javascript
this.guard.client.on('load', e => {
  console.log(e)
})

this.guard.client.on('login', userInfo => {
  console.log(userInfo)
})

// ......
```

## 集成 Authing JS SDK

Guard 集成了 AuthenticationClient，所以你可以使用 `guard.authClient` 来访问 AuthenticationClient 的所有 api 等等:

``` javascript
this.guard.client.authClient.registerByEmail()
this.guard.client.authClient.validateToken()
// ....
```

参考 [Authentication SDK](https://docs.authing.cn/v2/reference/sdk-for-node/authentication/) 

## 文档

参考详细文档说明 [docs](https://docs.authing.cn/v2/reference/guard/v2/)
