import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import * as netlifyIdentity from 'netlify-identity-widget';
import {User} from 'netlify-identity-widget';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authEvents = new BehaviorSubject<User | Error | null>(null);
  private currentUser = new BehaviorSubject<User | null>(null);


  constructor() {
    netlifyIdentity.init();
    this.setupEventHandlers();
    const user = netlifyIdentity.currentUser();
    if (user) {
      this.currentUser.next(user);
    }
  }

  private setupEventHandlers(): void {
    netlifyIdentity.on('login', (user) => {
      this.authEvents.next(user);
      this.currentUser.next(user);
    });
    netlifyIdentity.on('error', (error) => this.authEvents.next(error));
    netlifyIdentity.on('close', () =>
      this.authEvents.next(new Error('The modal was closed before completing'))
    );
    netlifyIdentity.on('logout', () => this.currentUser.next(null));
  }

  signUp(): void {
    netlifyIdentity.open('signup');
  }

  login(): void {
    netlifyIdentity.open('login');
  }

  logout(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      netlifyIdentity.logout();
      if (netlifyIdentity.currentUser() === null) {
        this.currentUser.next(null);
        observer.next(true);
        observer.complete();
      } else {
        observer.next(false);
        observer.complete();
      }
    });
  }

  isAuthenticated(): boolean {
    return this.currentUser.value !== null;
  }

  async getAccessToken(): Promise<string> {
    const currentUser = this.getCurrentUser();
    const accessToken = currentUser.token?.access_token;
    if (!accessToken) {
      throw new Error('Access token not found');
    }
    return accessToken;
  }

  getAuthEvents(): Observable<User | Error | null> {
    return this.authEvents.asObservable();
  }

  getUserId(): string {
    return this.getCurrentUser().id;
  }

  getCurrentUser(): User {
    const user = this.currentUser.value;
    if (!user) {
      throw new Error("There is no user logged in")
    }
    return user;
  }
}
