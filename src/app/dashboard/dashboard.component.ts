import { Component, OnInit, Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Calculation } from "../calculation/shared/calculation";
import { CalculationService } from "../calculation/shared/calculation.service";
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject
} from "angularfire2/database";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  calculations: any;
  calculation: Calculation = null;
  customers: any;
  // public calcService: CalculationService;
  constructor(private calcService: CalculationService) {}

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
  createCalculation() {
    this.calculation = new Calculation();
    this.calculation.group = "Test Group";
    this.calculation.name = "Test Name";
    this.calculation.function = "Test Function";
    this.calculation.updatedate = new Date();
    this.calculation.calculationtype = "calculation";
    this.calculation.owner = "Jayson Herbert";
    this.calculation.regressionpass = false;
    this.calculation.username = "jaysonh1985@gmail.com";
    this.calcService.createCalculation(this.calculation);
    this.calculation = new Calculation();
  }
  deleteCalculations() {
    this.calcService.deleteAll();
  }
}
