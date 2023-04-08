// animation.guard.ts
import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {AppComponent} from "src/app/app.component";

@Injectable({providedIn: 'root'})
export class AnimationGuard {
  canDeactivate(
    component: AppComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    component.animate = true;
    return of(true).pipe(delay(300));
  }
}

export function animationGuardFn() {
  return inject(AnimationGuard).canDeactivate;
}
