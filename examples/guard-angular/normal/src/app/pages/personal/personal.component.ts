import { Component } from '@angular/core'
import { AuthenticationClient, GuardService, User } from '@authing/guard-angular'

@Component({
  selector: 'personal-container',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent {
  constructor(private guard: GuardService) {}

  userInfo = ''

  ngOnInit() {
    this.getUserInfo()
  }

  // 登出后的回调地址请在 Authing 控制台「应用详情」-「应用配置」-「登出回调 URL」中配置
  logout() {
    this.guard.client.logout()
  }

  async getUserInfo() {
    const _userInfo: User | null = await this.guard.client.trackSession()
    this.userInfo = JSON.stringify(_userInfo || '', null, 2)
  }

  updateProfile() {
    this.guard.client.getAuthClient().then((authenticationClient: AuthenticationClient) => {
      // 获取到 AuthenticationClient 实例之后，可以调用其提供的所有方法
      // 比如更新用户昵称
      authenticationClient.updateProfile({
        nickname: 'Nick'
      })
      // 更多 AuthenticationClient 的方法，请见 authing-js-sdk 文档介绍。
    })
  }
}
