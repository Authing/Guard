import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmbedComponent } from './pages/embed/embed.component'

import { GuardModule } from '@authing/guard-angular'

import * as facePlugin from 'face-api.js'

@NgModule({
  declarations: [
    AppComponent,
    EmbedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GuardModule.forRoot({
      appId: '6322ef4c06b1a01036695b33',
      facePlugin
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
