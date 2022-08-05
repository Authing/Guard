import { Component } from '@angular/core'
import '@authing/guard-angular'

import { GuardService } from '@authing/guard-angular'

@Component({
  selector: 'login-container',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor (
    private guard: GuardService
  ) {}

  userInfo = ''

  ngOnInit () {
    this.getCurrentUser()
    this.guard.client.start('#guard-root')
  }

  onLogin () {
    this.guard.client.startWithRedirect()
  }

  onLogout () {
    this.guard.client.logout()
  }

  async getCurrentUser () {
    const _userInfo = await this.guard.client.authClient.getCurrentUser()
    this.userInfo = _userInfo && JSON.stringify(_userInfo, null, 2) || ''
  }
}
