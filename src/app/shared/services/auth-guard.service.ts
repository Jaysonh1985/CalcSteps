import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate() {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(["/"]);
    return false;
  }
}
