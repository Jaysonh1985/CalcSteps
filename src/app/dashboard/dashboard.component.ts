import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";

import { DateAdjustment } from "../calculation/functions/function-date-adjustment/function-date-adjustment.component";
import { DateDuration } from "../calculation/functions/function-date-duration/function-date-duration.component";
import { Distance } from "../calculation/functions/function-distance/function-distance.component";
import { LookupTable } from "../calculation/functions/function-lookup-table/function-lookup-table.component";
import { Calculation } from "../calculation/shared/models/calculation";
import { CalculationConfiguration } from "../calculation/shared/models/calculation-configuration";
import { CalculationInput } from "../calculation/shared/models/calculation-input";
import { CalculationOutput } from "../calculation/shared/models/calculation-output";
import { CalculationService } from "../calculation/shared/services/calculation.service";
import { ReleaseService } from "../calculation/shared/services/release.service";
import { InputDialogComponent } from "../shared/components/input-dialog/input-dialog.component";
import { AuthService } from "../shared/services/auth.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  calculations: any;
  calculation: Calculation = null;
  displayName: string;
  config = {
    sideNav: [
      { name: "Home", routerLink: "../", icon: "home" },
      { name: "Dashboard", routerLink: "../dashboard", icon: "dashboard" },
      { name: "Account", routerLink: "../account", icon: "account_circle" },
      { name: "Lookup Table", routerLink: "../lookup-maintenance", icon: "folder" },
      { name: "Help", routerLink: "../account", icon: "help_outline" },
    ]
  };
  constructor(
    private calcService: CalculationService,
    private router: Router,
    public releaseService: ReleaseService,
    public dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.userFirebase.subscribe(auth => {
      if (auth) {
        this.displayName = auth.displayName;
        this.calcService
          .getCalculationListbyuid(auth.uid)
          .snapshotChanges()
          .map(changes => {
            return changes.map(c => ({
              key: c.payload.key,
              ...c.payload.val()
            }));
          })
          .subscribe(customers => {
            this.calculations = customers;
          });
      }
    });
  }
  onAddCalculation() {
    const dialogRef = this.dialog.open(InputDialogComponent, {
      width: "400px",
      data: { group: "", name: "" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.userFirebase.subscribe(auth => {
          if (auth) {
            this.calculation = new Calculation();
            this.calculation.group = result.group;
            this.calculation.name = result.name;
            this.calculation.function = "";
            this.calculation.updateDate = new Date();
            this.calculation.calculationType = "calculation";
            this.calculation.owner = auth.displayName;
            this.calculation.regression = false;
            this.calculation.username = auth.email;
            this.calculation.userid = auth.uid;
            this.calculation.calculationInputs = [];
            this.calculation.calculationInputs.push(
              new CalculationInput("", "", "", "", [], "", false)
            );
            this.calculation.calculationOutputs = [];
            this.calculation.calculationOutputs.push(
              new CalculationOutput("", "", "", "")
            );
            this.calculation.calculationConfigurations = [];
            this.calculation.calculationConfigurations.push(
              new CalculationConfiguration(
                "",
                "",
                "",
                "",
                "",
                [],
                new DateAdjustment("", "", "", "", "", "", "", ""),
                new DateDuration("", "", "", "", ""),
                new Distance("", ""),
                [],
                [],
                new LookupTable("", "", "", "", "", "", "", "", "", ""),
                "",
                true
              )
            );
            this.calculation.users = [];
            this.calculation.users.push({
              email: auth.email,
              name: auth.displayName,
              uid: auth.uid,
              owner: true
            }),
            this.calcService.createCalculation(this.calculation);
            this.calculation = new Calculation();
          }
        });
      }
    });
  }
  deleteCalculations() {
    this.calcService.deleteAll();
  }
  editCalculation(calculation) {
    this.router.navigate(["calculation", calculation.key]);
  }
  viewCalculation(calculation) {
    this.releaseService
      .getReleaseListbycalculationKey(calculation.key)
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          key: c.payload.key,
          ...c.payload.val()
        }));
      })
      .subscribe(customers => {
        let releaseRef = null;
        customers.forEach(customer => {
          if (customer.currentVersion === true) {
            releaseRef = customer.key;
          }
        });
        if (releaseRef !== null) {
          this.router.navigate(["release", releaseRef]);
        }
      });
  }
}
