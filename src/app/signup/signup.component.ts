import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  email: string;
  password: string;
  constructor(public authService: AuthService, private router: Router) {}
  signup() {
    this.authService
      .signup(this.email, this.password)
      .then(res => {
        this.router.navigate(["home"]);
      })
      .catch(err => console.log(err));
  }
  ngOnInit() {}
}
