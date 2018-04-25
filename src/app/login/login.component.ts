import { Component, OnInit, HostBinding } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  passReset: boolean;
  constructor(public authService: AuthService, private router: Router) {
    this.passReset = false;
  }
  signInWithGoogle() {
    this.authService
      .signInWithGoogle()
      .then(res => {
        this.router.navigate(["dashboard"]);
      })
      .catch(err => console.log(err));
  }
  login() {
    this.authService
      .login(this.email, this.password)
      .then(res => {
        this.router.navigate(["dashboard"]);
      })
      .catch(err => console.log(err));
  }
  logout() {
    this.authService.logout();
  }
  resetPassword() {
    if (this.email != null) {
      this.authService
        .resetPassword(this.email)
        .then(() => (this.passReset = true));
    }
  }
  ngOnInit() {}
}
