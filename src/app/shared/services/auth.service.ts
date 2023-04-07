import {Injectable} from '@angular/core';
import * as netlifyIdentity from 'netlify-identity-widget';
import {EMPTY, Observable, of} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {
    const identityConfig: netlifyIdentity.InitOptions = {
      locale: 'en'
    };

    netlifyIdentity.init(identityConfig);
  }

  signUp(): Observable<netlifyIdentity.User | Error> {
    let value: Observable<netlifyIdentity.User | Error> = EMPTY;
    netlifyIdentity.open('signup');
    netlifyIdentity.on('login', user => {
      value = of(user);
    })
    netlifyIdentity.on('error', error => {
      value = of(error);
    })
    netlifyIdentity.on('close', () => {
      value = of(new Error("The modal was closed before completing"));
    })
    return value;
  }

  login(): Observable<netlifyIdentity.User | Error> {
    let value: Observable<netlifyIdentity.User | Error> = EMPTY;
    netlifyIdentity.open('login');
    netlifyIdentity.on('login', user => {
      value = of(user);
    })
    netlifyIdentity.on('error', error => {
      value = of(error);
    })
    netlifyIdentity.on('close', () => {
      value = of(new Error("The modal was closed before completing"));
    })
    return value;
  }

  logout(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      const result = netlifyIdentity.logout();
      if (result) {
        observer.next(true);
        observer.complete();
      } else {
        observer.next(false);
        observer.complete();
      }
    });
  }


  getCurrentUser(): netlifyIdentity.User | null {
    return netlifyIdentity.currentUser();
  }

  isAuthenticated(): boolean {
    return netlifyIdentity.currentUser() !== null;
  }
}
