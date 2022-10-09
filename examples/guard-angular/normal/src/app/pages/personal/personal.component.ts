import { Component } from '@angular/core'
import { GuardService } from '@authing/guard-angular'

@Component({
  selector: 'personal-container',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent {
  constructor (
    private guard: GuardService
  ) {}

  userInfo = ''

  ngOnInit () {
    this.getUserInfo()
  }

  logout () {
    this.guard.client.logout()
  }

  async getUserInfo () {
    const _userInfo = await this.guard.client.trackSession()
    this.userInfo = JSON.stringify(_userInfo || '', null, 2)
  }
}
