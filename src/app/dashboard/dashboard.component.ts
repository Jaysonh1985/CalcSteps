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

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  calculations: any;
  calculation: Calculation = null;
  // public calcService: CalculationService;
  constructor(
    private calcService: CalculationService,
    private router: Router
  ) {}

  ngOnInit() {
    // Use snapshotChanges().map() to store the key
    this.calcService
      .getCalculationsList()
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
  onAddCalculation() {
    this.calculation = new Calculation();
    this.calculation.group = "Test Group";
    this.calculation.name = "Test Name";
    this.calculation.function = "Test Function";
    this.calculation.updateDate = new Date();
    this.calculation.calculationType = "calculation";
    this.calculation.owner = "Jayson Herbert";
    this.calculation.regression = false;
    this.calculation.username = "jaysonh1985@gmail.com";
    this.calculation.calculationInputs = new CalculationInput();
    this.calculation.calculationOutputs = new CalculationOutput();
    this.calculation.calculationConfigurations = new CalculationConfiguration();
    this.calcService.createCalculation(this.calculation);
    this.calculation = new Calculation();
  }
  deleteCalculations() {
    this.calcService.deleteAll();
  }
  editCalculation(calculation) {
    this.router.navigate(["calculation", calculation.key]);
  }
}
