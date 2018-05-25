import { Component, OnInit, HostBinding } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  emailNotFound: boolean;
  passReset: boolean;
  passwordIncorrect: boolean;
  isLoggedIn: boolean;
  formdata;
  constructor(public authService: AuthService, private router: Router) {
    this.passReset = false;
    this.emailNotFound = false;
    this.passwordIncorrect = false;
  }
  ngOnInit() {
    this.formdata = new FormGroup({
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
      .login(
        this.formdata.controls["email"].value,
        this.formdata.controls["password"].value
      )
      .then(res => {
        this.router.navigate(["dashboard"]);
      })
      .catch(err => {
        if (err.code === "auth/wrong-password") {
          this.passwordIncorrect = true;
        } else if (err.code === "auth/invalid-email") {
          this.emailNotFound = true;
        }
      });
  }
  logout() {
    this.authService.logout();
  }
  resetPassword() {
    if (
      this.formdata.controls["email"].value !== null &&
      this.formdata.controls["email"].value !== undefined
    ) {
      this.authService
        .resetPassword(this.formdata.controls["email"].value)
        .then(() => (this.passReset = true))
        .catch(err => {
          this.emailNotFound = false;
        });
    } else {
      this.emailNotFound = false;
    }
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
