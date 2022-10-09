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
    this.guard.client.start('#authing-guard-container').then(userInfo => {
      console.log('userInfo: ', userInfo)
    })

    setTimeout(() => {
      this.guard.client.hide()
    }, 2000)
  }

  showGuard () {
    this.guard.client.show()
  }
}
