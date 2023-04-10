import {HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {AuthService} from './auth.service';

export abstract class BaseService {
  protected constructor(protected authService: AuthService) {
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
}
