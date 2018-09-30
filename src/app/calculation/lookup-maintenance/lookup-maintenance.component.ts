import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";

import { LookupService } from "../shared/services/lookup.service";
import { InputDialogComponent } from "../../shared/components/input-dialog/input-dialog.component";
import { AuthService } from "../../shared/services/auth.service";
import { Lookup } from "../shared/models/lookup";

@Component({
  selector: "app-lookup-maintenance",
  templateUrl: "./lookup-maintenance.component.html",
  styleUrls: ["./lookup-maintenance.component.css"]
})
export class LookupMaintenanceComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private lookupService: LookupService,
    public dialog: MatDialog,
    private router: Router
  ) {}
  lookups: any;
  displayName: string;
  lookup: Lookup = null;
  config = {
    sideNav: [
      { name: "Home", routerLink: "../", icon: "home" },
      { name: "Dashboard", routerLink: "../dashboard", icon: "dashboard" },
      { name: "Account", routerLink: "../account", icon: "account_circle" },
      { name: "Lookup Table", routerLink: "../lookup-maintenance", icon: "folder" },
      { name: "Help", routerLink: "../help", icon: "help_outline" },
    ]
  };
  ngOnInit() {
    this.authService.userFirebase.subscribe(auth => {
      if (auth) {
        this.displayName = auth.displayName;
        this.lookupService
          .getLookupListbyuid(auth.uid)
          .snapshotChanges()
          .map(changes => {
            return changes.map(c => ({
              key: c.payload.key,
              ...c.payload.val()
            }));
          })
          .subscribe(customers => {
            this.lookups = customers;
          });
      }
    });
  }
  onAddLookup() {
    const dialogRef = this.dialog.open(InputDialogComponent, {
      width: "400px",
      data: { group: "", name: "" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.userFirebase.subscribe(auth => {
          if (auth) {
            this.lookup = new Lookup();
            this.lookup.group = result.group;
            this.lookup.name = result.name;
            this.lookup.updateDate = new Date();
            this.lookup.owner = auth.displayName;
            this.lookup.username = auth.email;
            this.lookup.userid = auth.uid;
            this.lookup.headerRow = [];
            this.lookup.lookup = [];
            this.lookupService.createLookup(this.lookup);
            this.lookup = new Lookup();
          }
        });
      }
    });
  }
  editLookup(lookup) {
    this.router.navigate(["lookup", lookup.key]);
  }
}
