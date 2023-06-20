// app.module.ts
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'

import { GuardModule } from '@authing/ng-ui-components'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    GuardModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
