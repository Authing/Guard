import { Component } from '@angular/core'

import { GuardService } from '@authing/guard-angular'

@Component({
  selector: 'embed-container',
  templateUrl: './embed.component.html',
  styleUrls: ['./embed.component.css']
})
export class EmbedComponent {
  constructor (
    private guard: GuardService
  ) {}

  ngOnInit () {
    this.guard.client.start('#authing-guard-container')
  }

  changeContentCSS () {
    this.guard.client.changeContentCSS('body {background: blue}')
  }

  startRegister () {
    this.guard.client.startRegister()
  }

  logout () {
    this.guard.client.logout()
  }

  async getUserInfo () {
    const userInfo = await this.guard.client.trackSession()
    console.log('userInfo: ', userInfo)
  }

  async refreshToken () {
    const authClient = await this.guard.client.getAuthClient()
    const token = await authClient.refreshToken()
    console.log('token: ', token)
  }
}
