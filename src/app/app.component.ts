import {Component} from '@angular/core';
import {Router, RouterOutlet, NavigationEnd, NavigationStart, ChildrenOutletContexts} from '@angular/router';
import {filter} from 'rxjs/operators';
import {routeAnimations} from './shared/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeAnimations],
})
export class AppComponent {
  animate = false;

  constructor(private contexts: ChildrenOutletContexts) {}

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
