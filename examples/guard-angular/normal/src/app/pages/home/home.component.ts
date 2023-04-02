import { Component } from '@angular/core'
import { Router } from '@angular/router';

@Component({
  selector: 'home-container',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor (
    private router: Router
  ) {}

  toEmbed () {
    this.router.navigateByUrl('embed')
  }

  toJump () {
    this.router.navigateByUrl('jump')
  }
}
