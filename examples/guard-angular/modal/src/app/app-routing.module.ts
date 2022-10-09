import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component'
import { EmbedComponent } from './pages/embed/embed.component'
import { PageNotFoundComponent } from './pages/not-found/not-found.component'

const routes: Routes = [{
  path: '',
  component: HomeComponent
}, {
  path: 'home',
  component: HomeComponent
}, {
  path: 'embed',
  component: EmbedComponent
}, {
  path: '**', 
  component: PageNotFoundComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
