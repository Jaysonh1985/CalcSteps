import { Component, OnInit, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Calculation } from "../calculation/shared/models/calculation";
import { CalculationService } from "../calculation/shared/services/calculation.service";
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject
} from "angularfire2/database";
import { CalculationInput } from "../calculation/shared/models/calculation-input";
import { CalculationOutput } from "../calculation/shared/models/calculation-output";
import { CalculationConfiguration } from "../calculation/shared/models/calculation-configuration";
import { CalculationInputComponent } from "../calculation/calculation-input/calculation-input.component";
import { CalculationOutputComponent } from "../calculation/calculation-output/calculation-output.component";
import { CalculationConfigurationComponent } from "../calculation/calculation-configuration/calculation-configuration.component";
import { ReleaseService } from "../calculation/shared/services/release.service";
import { MatDialog } from "@angular/material";
import { InputDialogComponent } from "../shared/input-dialog/input-dialog.component";
import { AuthService } from "../services/auth.service";
import { DateAdjustment } from "../calculation/functions/function-date-adjustment/function-date-adjustment.component";
import { DateDuration } from "../calculation/functions/function-date-duration/function-date-duration.component";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  calculations: any;
  calculation: Calculation = null;
  constructor(
    private calcService: CalculationService,
    private router: Router,
    public releaseService: ReleaseService,
    public dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.user.subscribe(auth => {
      if (auth) {
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
        this.authService.user.subscribe(auth => {
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
                [],
                [],
                "",
                true
              )
            );
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
