import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from '../app/pages/login/login.component'

import { GuardModule } from '@authing/guard-angular'

import * as facePlugin from 'face-api.js'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GuardModule.forRoot({
      appId: 'Your Authing application ID',
      facePlugin
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
