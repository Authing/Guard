import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component'

import { GuardModule } from '@authing/guard-angular'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GuardModule.forRoot({
      appId: '62be97e30fa6ea1c1ced35c0',
      host: 'https://spa-demo-2022.authing.cn',
      redirectUri: 'http://localhost:3000/callback'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
