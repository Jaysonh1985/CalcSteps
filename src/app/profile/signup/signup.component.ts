import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService, User } from "../../shared/services/auth.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  userExists: boolean;
  formdata;
  constructor(public authService: AuthService, private router: Router) {
    this.userExists = false;
  }
  ngOnInit() {
    this.formdata = new FormGroup({
      name: new FormControl("", Validators.compose([Validators.required])),
      email: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          ,
          Validators.email,
          Validators.pattern("[^ @]*@[^ @]*")
        ])
      ),
      password: new FormControl("", Validators.compose([Validators.required]))
    });
  }
  signup() {
    this.authService
      .signup(
        this.formdata.controls["email"].value,
        this.formdata.controls["password"].value,
        this.formdata.controls["name"].value
      )
      .then(res => {
        const user: User = {
          uid: res.uid,
          displayName: this.formdata.controls["name"].value,
          email: this.formdata.controls["email"].value
        };
        this.authService.createUser(user).then(newUser => {
          this.router.navigate(["dashboard"]);
        });
      })
      .catch(err => {
        if (err.code === "auth/email-already-in-use") {
          this.userExists = true;
        }
      });
  }
  onRouteLogin() {
    this.router.navigate(["login"]);
  }
  getNameErrorMessage() {
    return this.formdata.controls["name"].hasError("required")
      ? "You must enter a value"
      : "";
  }
  getEmailErrorMessage() {
    return this.formdata.controls["email"].hasError("required")
      ? "You must enter a value"
      : this.formdata.controls["email"].hasError("email")
        ? "Not a valid email"
        : "";
  }
  getPasswordErrorMessage() {
    return this.formdata.controls["password"].hasError("required")
      ? "You must enter a value"
      : "";
  }
}
