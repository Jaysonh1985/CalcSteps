import { Component, OnInit } from "@angular/core";
import { tryParse } from "selenium-webdriver/http";
import { ActivatedRoute } from "@angular/router";
import { CalculationService } from "./shared/services/calculation.service";
import { Calculation } from "./shared/models/calculation";
import { AngularFireList } from "angularfire2/database";
import { Observable } from "rxjs/Observable";

@Component({
  selector: "app-calculation",
  templateUrl: "./calculation.component.html",
  styleUrls: ["./calculation.component.css"]
})
export class CalculationComponent implements OnInit {
  public key: string;
  public calculations: any;
  public calculation: Calculation;
  constructor(
    private route: ActivatedRoute,
    private calcService: CalculationService
  ) {
    this.route.params.subscribe(params => console.log(params));
  }

  ngOnInit() {
    this.calcService
      .getCalculation("-LA90dXIgqulVfGZvwVK")
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          key: c.payload.key,
          ...c.payload.val()
        }));
      })
      .subscribe(customers => {
        this.calculations = customers[0];
        console.log(this.calculations);
      });
  }
}
