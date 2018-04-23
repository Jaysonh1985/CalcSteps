import { Component, OnInit, ViewChild } from "@angular/core";
import { tryParse } from "selenium-webdriver/http";
import { ActivatedRoute } from "@angular/router";
import { CalculationService } from "./shared/services/calculation.service";
import { Calculation } from "./shared/models/calculation";
import { AngularFireList } from "angularfire2/database";
import { Observable } from "rxjs/Observable";
import { CalculationInput } from "./shared/models/calculation-input";
import { CalculationOutput } from "./shared/models/calculation-output";
import { CalculationConfiguration } from "./shared/models/calculation-configuration";
import { CalculationInputComponent } from "./calculation-input/calculation-input.component";
import { CalculationOutputComponent } from "./calculation-output/calculation-output.component";
import { CalculationConfigurationComponent } from "./calculation-configuration/calculation-configuration.component";

@Component({
  selector: "app-calculation",
  templateUrl: "./calculation.component.html",
  styleUrls: ["./calculation.component.css"]
})
export class CalculationComponent implements OnInit {
  public key: any[];
  public calculation: any;
  public calculationConfiguration: CalculationConfiguration;
  public calculationInput: CalculationInput;
  public calculationOutput: CalculationOutput;
  @ViewChild(CalculationInputComponent)
  private CalculationInputComponent: CalculationInputComponent;
  @ViewChild(CalculationOutputComponent)
  private CalculationOutputComponent: CalculationOutputComponent;
  @ViewChild(CalculationConfigurationComponent)
  private CalculationConfigurationComponent: CalculationConfigurationComponent;
  events = [];
  opened = true;
  constructor(
    private route: ActivatedRoute,
    private calcService: CalculationService
  ) {}
  onSave() {
    this.calculation.calculationInputs = this.CalculationInputComponent.getAllRows();
    this.calculation.calculationOutputs = this.CalculationOutputComponent.getAllRows();
    this.calculation.calculationConfigurations = this.CalculationConfigurationComponent.getAllRows();
    this.calcService.updateCalculation(
      this.calculation.key,
      JSON.parse(JSON.stringify(this.calculation))
    );
  }
  ngOnInit() {
    const key = this.route.snapshot.params["key"];
    console.log(key);
    this.calcService
      .getCalculation(key)
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          key: c.payload.key,
          ...c.payload.val()
        }));
      })
      .subscribe(calculations => {
        this.calculation = calculations[0];
        this.calculationInput = calculations[0].calculationInputs;
        this.calculationConfiguration =
          calculations[0].calculationConfigurations;
        this.calculationOutput = calculations[0].calculationOutputs;
      });
  }
}
