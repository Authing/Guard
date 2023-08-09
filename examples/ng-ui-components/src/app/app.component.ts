import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'guard-angular'

  appId = 'AUTHING_APP_ID'

  onLogin(user: any): void {
    console.log(user)
  }
}
