import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'guard-angular'

  appId = '5f6265c67ff6fdae64ec516e'

  onLogin(user: any): void {
    console.log(user)
  }
}
