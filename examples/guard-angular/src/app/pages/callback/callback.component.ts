import { Component } from '@angular/core'
import { Router } from '@angular/router'

import { GuardService } from '../../../guard-angular'

@Component({
  selector: 'callback-container',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent {
  constructor (
    private router: Router,
    private guard: GuardService
  ) {}

  ngOnInit () {
    this.handleAuthingLoginCallback()
  }

  async handleAuthingLoginCallback () {
    await this.guard.client.handleRedirectCallback()
    this.router.navigateByUrl('personal', {
      replaceUrl: true
    })
  }
}
