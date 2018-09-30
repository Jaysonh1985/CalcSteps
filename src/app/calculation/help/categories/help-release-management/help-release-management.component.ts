import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-help-release-management",
  templateUrl: "./help-release-management.component.html",
  styleUrls: ["./help-release-management.component.css"]
})
export class HelpReleaseManagementComponent implements OnInit {
  config = {
    sideNav: [
      { name: "Home", routerLink: "../", icon: "home" },
      { name: "Dashboard", routerLink: "../dashboard", icon: "dashboard" },
      { name: "Account", routerLink: "../account", icon: "account_circle" },
      { name: "Lookup Table", routerLink: "../lookup-maintenance", icon: "folder" },
      { name: "Help", routerLink: "../help", icon: "help_outline" },
    ]
  };
  constructor() {}

  ngOnInit() {}
}
