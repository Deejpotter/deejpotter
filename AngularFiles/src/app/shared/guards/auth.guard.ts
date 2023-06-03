import {AuthService} from 'src/app/shared/services/auth.service';
import {Router} from '@angular/router';
import {inject} from '@angular/core';

export const AuthGuard: () => (boolean) = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};
