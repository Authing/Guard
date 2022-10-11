// app.module.ts
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

import { GuardModule } from '@authing/guard-angular'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GuardModule.forRoot({
      appId: '6322ef4c06b1a01036695b33',
      isSSO: true,
      config: {
        socialConnectionList: ['github']
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
