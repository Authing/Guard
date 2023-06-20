import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'guard-angular'

  appId = '630ed3137dd6f2fd7001da24'

  onLogin(user: any): void {
    console.log(user)
  }
}
