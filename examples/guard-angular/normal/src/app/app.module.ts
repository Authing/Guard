// app.module.ts
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

import { GuardModule } from '@authing/guard-angular'

import * as facePlugin from 'face-api.js'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GuardModule.forRoot({
      appId: 'AUTHING_APP_ID',
      // host: 'https://my-authing-app.example.com',
      isSSO: true,
      config: {
        socialConnectionList: ['github'],
        langRange: ['zh-CN'],
        disableRegister: true,
        disableResetPwd: true
      },
      facePlugin
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
