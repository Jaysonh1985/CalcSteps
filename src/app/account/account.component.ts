import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.css"]
})
export class AccountComponent implements OnInit {
  name: any;
  email: any;
  constructor(private router: Router, public authService: AuthService) {
    this.authService.userFirebase.subscribe(auth => {
      if (auth) {
        this.name = auth.displayName;
        this.email = auth.email;
      }
    });
  }
  logout() {
    this.authService.logout();
  }
  deleteAccount() {
    this.authService.deleteUser();
  }
  ngOnInit() {}
}
