import { Component, OnInit } from "@angular/core";
import { AuthService, User } from "../services/auth.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  email: string;
  password: string;
  name: string;
  constructor(public authService: AuthService, private router: Router) {}
  signup() {
    this.authService
      .signup(this.email, this.password, this.name)
      .then(res => {
        const user: User = {
          uid: res.uid,
          displayName: this.name,
          email: this.email
        };
        this.authService
          .createUser(user).then( newUser => {
            this.router.navigate(["dashboard"]);
          });
      })
      .catch(err => console.log(err));
  }
  ngOnInit() {}
}
