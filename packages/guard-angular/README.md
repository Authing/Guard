<div align=center>
  <img width="300" src="https://files.authing.co/authing-console/authing-logo-new-20210924.svg" />
</div>

<br />

Guard is a portable authentication component provided by authing. You can embed it in any application to handle complex user authentication processes in one stop.

Prepare your Angular project and follow the guide to connect authoring guard to your Angular project!

## Install
``` shell
npm insstall --save @authing/angular
```

## Initialize

|Key|Type|Default|Requires
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
// use Guard APIs in Components
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

## Guard for React provides three login modes

### Embed mode

Render Guard component

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

### modal mode

When the parameter 'mode' of Guard instantiation is' modal ', the modal mode is started, and the following API can be used to display and hide the guard.

``` javascript
this.guard.client.show()
```

``` javascript
this.guard.client.hide()
```

### Redirect mode

Login by code, redirect to login page

``` javascript
this.guard.client.startWithRedirect()
```

Auto handle redirect callback

``` javascript
this.guard.client.handleRedirectCallback()
```

Logout

``` javascript
this.guard.client.logout()
```

## Regist events

``` javascript
this.guard.client.on('load', e => {
  console.log(e)
})

this.guard.client.on('login', userInfo => {
  console.log(userInfo)
})

// ......
```

## Integrate authing js sdk instance

Guard integrated AuthenticationClient, so you can use `guard.authClient` to access all apis of AuthenticationClient, etc:

``` javascript
this.guard.client.authClient.registerByEmail()
this.guard.client.authClient.validateToken()
// ....
```

Refer to [Authentication SDK](https://docs.authing.cn/v2/reference/sdk-for-node/authentication/) 

## 📚 Documentation

To check out live examples and docs, visit [docs](https://docs.authing.cn/v2/reference/guard/v2/)
