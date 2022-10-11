import { Component } from '@angular/core'
import { GuardService } from '@authing/guard-angular'

@Component({
  selector: 'jump-container',
  templateUrl: './jump.component.html',
  styleUrls: ['./jump.component.css']
})
export class JumpComponent {
  constructor (
    private guard: GuardService
  ) {}
  
  startWithRedirect () {
    this.guard.client.startWithRedirect()
  }
}
