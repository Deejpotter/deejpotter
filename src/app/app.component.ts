import {Component, ElementRef, HostListener, ViewChild} from '@angular/core';
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
  @ViewChild('contentContainer', { static: false }) contentContainer!: ElementRef;

  constructor(private contexts: ChildrenOutletContexts, private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.scrollToTop();
      });
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    this.scrollToTop();
  }

  private scrollToTop() {
    setTimeout(() => {
      this.contentContainer.nativeElement.scrollTo({top: 0, behavior: 'smooth'});
    }, 0);
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
