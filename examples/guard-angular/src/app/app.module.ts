import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from '../app/pages/login/login.component'

import { GuardModule } from '@authing/guard-angular'

console.log('--------: ', GuardModule)

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GuardModule.forRoot({
      appId: '62e22721c889dd44bad1dda2',
      host: 'https://guard-test-2022.authing.cn',
      // redirectUri: 'http://localhost:3000/callback'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
