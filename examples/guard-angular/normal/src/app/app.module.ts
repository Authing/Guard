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
      appId: '63438f6f49cfbc1bbb37ece3',
      config: {
        // @ts-ignore
        socialConnections: ['github']
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
