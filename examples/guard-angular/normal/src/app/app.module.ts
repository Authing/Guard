// app.module.ts
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

import { GuardModule } from '@authing/guard-angular'
import parse from 'html-react-parser';

import * as facePlugin from 'face-api.js'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GuardModule.forRoot({
      appId: '63e195c4f5fac9c08b9c3aa8',

      // 如果你使用的是私有化部署的 Authing 服务，需要传入自定义 host，如:
      host: 'https://console.mysql.authing-inc.co',

      // 默认情况下，会使用你在 Authing 控制台中配置的第一个回调地址为此次认证使用的回调地址。
      // 如果你配置了多个回调地址，也可以手动指定（此地址也需要加入到应用的「登录回调 URL」中）：
      // redirectUri: "YOUR_REDIRECT_URI",

      // isSSO: true,
      config: {
        // socialConnectionList: ['github'],
        // langRange: ['zh-CN'],
        // disableRegister: true,
        // disableResetPwd: true,
        loadingComponent: parse(`<div class="g2-init-setting-loading"><div class="loader__view-box"><span class="loader__dot"></span><span class="loader__dot"></span><span class="loader__dot"></span></div></div>`)
      },
      // facePlugin
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
