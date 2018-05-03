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
  constructor(private router: Router, public authService: AuthService) {
    this.authService.user.subscribe(auth => {
      if (auth) {
        this.name = auth;
      }
    });
  }
  logout() {
    this.authService.logout();
  }
  ngOnInit() {}
}