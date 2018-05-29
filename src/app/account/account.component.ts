import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { MatSnackBar, MatDialog } from "@angular/material";
import { ConfirmationDialogComponent } from "../shared/confirmation-dialog/confirmation-dialog.component";
@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.css"]
})
export class AccountComponent implements OnInit {
  name: any;
  email: any;
  constructor(
    private router: Router,
    public authService: AuthService,
    public dialog: MatDialog
  ) {
    this.authService.userFirebase.subscribe(auth => {
      if (auth) {
        this.name = auth.displayName;
        this.email = auth.email;
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
      data: { description: "Do you wish to delete your Account?" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.authService.deleteUser();
      }
    });
  }
  ngOnInit() {}
}
