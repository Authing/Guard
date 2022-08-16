import { Component } from '@angular/core'

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

  lang = 'zh-CN'

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
    const authClient = await this.guard.client.getAuthClient()
    const _userInfo = await authClient.getCurrentUser()
    this.userInfo = _userInfo && JSON.stringify(_userInfo, null, 2) || ''
  }

  changeCurrentCSS () {
    this.guard.client.changeContentCSS('body { background: green }')
  }

  changeLang () {
    const lang = this.lang = this.lang === 'zh-CN' ? 'en-US' : 'zh-CN'
    this.guard.client.changeLang(lang)
  }
}
