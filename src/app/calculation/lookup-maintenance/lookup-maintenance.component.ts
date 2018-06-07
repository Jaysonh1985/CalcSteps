import { Component, OnInit } from "@angular/core";
import { LookupService } from "../../calculation/shared/services/lookup.service";
import { MatDialog } from "@angular/material";
import { AuthService } from "../../services/auth.service";
import { InputDialogComponent } from "../../shared/input-dialog/input-dialog.component";
import { Router } from "@angular/router";
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
