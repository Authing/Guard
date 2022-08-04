import { Component } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'home-container',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor (
    private router: Router,
    private route: ActivatedRoute
  ) {}
  title = 'This is Home page'

  toLogin () {
    this.router.navigateByUrl('login')
  }
}
