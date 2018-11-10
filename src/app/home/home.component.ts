import { Component, OnInit } from "@angular/core";

import { AuthService } from "../shared/services/auth.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  constructor(public authService: AuthService) {}
  displayName: string;
  loggedIn: boolean;
  ngOnInit() {
    this.loggedIn = false;
    this.authService.userFirebase.subscribe(auth => {
      if (auth) {
        this.loggedIn = true;
        if (auth.isAnonymous) {
          this.authService.logout();
        }
      }
    });
  }

}
