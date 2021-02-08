import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import jwtDecode from 'jwt-decode';
import { Observable } from 'rxjs';
import { Token } from './header/header.component';
import { KEY_TOKEN } from './traveler.service';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = localStorage.getItem(KEY_TOKEN);
    if (token) {
      const decoded: Token = jwtDecode(token);
      if (decoded.exp > Date.now().valueOf() / 1000) {
        if (!decoded.isAdmin) {
          this.router.navigate(['/admin-login']);
        }
        return true;
      }
    }
    this.router.navigate(['/admin-login']);
    return false;
  }
}
