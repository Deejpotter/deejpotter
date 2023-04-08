import {Component} from '@angular/core';
import {Router, RouterOutlet, NavigationEnd} from '@angular/router';
import {filter} from 'rxjs/operators';
import {fadeInAnimation, slideInAnimation, scaleInAnimation, rotateAnimation} from './shared/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [slideInAnimation, fadeInAnimation, scaleInAnimation, rotateAnimation],
})
export class AppComponent {
  animate = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.animate = true;
        setTimeout(() => {
          this.animate = false;
        }, 300);
      });
  }

}
