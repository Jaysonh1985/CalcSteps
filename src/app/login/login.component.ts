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
  constructor(public authService: AuthService, private router: Router) { }

  signInWithGoogle() {
    this.authService
      .signInWithGoogle()
      .then(res => {
        this.router.navigate(["dashboard"]);
      })
      .catch(err => console.log(err));
  }
  signup() {
    this.authService.signup(this.email, this.password)
      .then(res => { this.router.navigate(["home"]) })
      .catch(err => console.log(err));
  }

  login() {
    this.authService.login(this.email, this.password)
      .then(res => { this.router.navigate(["dashboard"]) })
      .catch(err => console.log(err));;
  }

  logout() {
    this.authService.logout();
  }
  ngOnInit() {}
}
