import { Component } from '@angular/core'

import { GuardService } from '@authing/guard-angular'

@Component({
  selector: 'login-container',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor (
    private authing: GuardService
  ) {}

  userInfo = ''

  ngOnInit () {
    this.getCurrentUser()
  }

  onLogin () {
    this.authing.client.startWithRedirect()
  }

  onLogout () {
    this.authing.client.logout()
  }

  async getCurrentUser () {
    const _userInfo = await this.authing.client.authClient.getCurrentUser()
    this.userInfo = _userInfo && JSON.stringify(_userInfo, null, 2) || ''
  }
}
