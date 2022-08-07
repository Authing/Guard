import { Injectable, Inject } from '@angular/core'

import { GuardClientService } from './guard.client'

import { Guard } from '@authing/guard'

@Injectable({
  providedIn: 'root'
})
export class GuardService {
  constructor(@Inject(GuardClientService) public client: Guard) {}
}
