import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { ConfirmationDialogComponent } from "../../shared/components/confirmation-dialog/confirmation-dialog.component";
import { AuthService } from "../../shared/services/auth.service";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.css"]
})
export class AccountComponent implements OnInit {
  name: any;
  email: any;
  accountReference: any;
  formdata;
  config = {
    sideNav: [
      { name: "Home", routerLink: "../", icon: "home" },
      { name: "Dashboard", routerLink: "../dashboard", icon: "dashboard" },
      { name: "Lookup Table", routerLink: "../lookup-maintenance", icon: "folder" },
      { name: "Help", routerLink: "../help", icon: "help_outline" },
      { name: "Account", routerLink: "../account", icon: "account_circle" },
    ]
  };
  constructor(
    private router: Router,
    public authService: AuthService,
    public dialog: MatDialog
  ) {
    this.authService.userFirebase.subscribe(auth => {
      if (auth) {
        this.name = auth.displayName;
        this.email = auth.email;
        this.accountReference = auth.uid;
      }
    });
  }
  logout() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "400px",
      data: { description: "Do you wish to log out?" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.authService.logout();
      }
    });
  }
  deleteAccount() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "400px",
      data: { description: "Do you wish to delete your Account?", password: ""}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.authService.deleteUser(this.formdata.controls["password"].value);
      }
    });
  }
  ngOnInit() {
    this.formdata = new FormGroup({
      password: new FormControl("", Validators.compose([Validators.required]))
    });
  }
}
