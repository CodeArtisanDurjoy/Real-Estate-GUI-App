import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';

export const AuthGuard: CanActivateFn = (
  route,
  state
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  return inject(AuthService).isAuthenticated()
    ? true
    : inject(Router).createUrlTree(['login']);
};
