import {HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {AuthService} from './auth.service';

export abstract class BaseService<T> {
  public loadingCompleted: BehaviorSubject<boolean> | null = null;
  items: T[] = [];
  itemsSubject = new BehaviorSubject<T[]>([]);

  protected constructor(loadingEnabled: boolean = true, protected authService: AuthService) {
    if (loadingEnabled) {
      this.loadingCompleted = new BehaviorSubject<boolean>(true);
    }
  }

  protected setCache(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  protected getCache<U>(key: string): U | null {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data) as U;
    }
    return null;
  }

  protected removeCache(key: string): void {
    localStorage.removeItem(key);
  }

  protected setLoading(loading: boolean): void {
    if (this.loadingCompleted) {
      this.loadingCompleted.next(loading);
    }
  }

  protected getHeaders(): Observable<HttpHeaders> {
    const token = this.authService.getAccessToken();
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return of(headers);
    } else {
      return of(new HttpHeaders());
    }
  }

  protected updateItems(items: T[]): void {
    this.items = items;
    this.itemsSubject.next(this.items);
    this.setCache(this.getCacheKey(), items);
  }

  protected abstract getCacheKey(): string;
}
