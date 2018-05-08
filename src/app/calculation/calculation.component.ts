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
import { Router } from "@angular/router";
import { FunctionMathsComponent } from "./functions/function-maths/function-maths.component";
import { FunctionDateAdjustmentComponent } from "./functions/function-date-adjustment/function-date-adjustment.component";
import { FunctionDateDurationComponent } from "./functions/function-date-duration/function-date-duration.component";
import { FunctionIfLogicComponent } from "./functions/function-if-logic/function-if-logic.component";
@Component({
  selector: "app-calculation",
  templateUrl: "./calculation.component.html",
  styleUrls: ["./calculation.component.css"]
})
export class CalculationComponent implements OnInit {
  public key: any[];
  public calculation: any;
  public calculationConfiguration: CalculationConfiguration;
  public calculationInput: CalculationInput[];
  public calculationInputNodes: any[];
  public calculationOutput: CalculationOutput;
  @ViewChild(CalculationInputComponent)
  private CalculationInputComponent: CalculationInputComponent;
  @ViewChild(CalculationOutputComponent)
  private CalculationOutputComponent: CalculationOutputComponent;
  @ViewChild(CalculationConfigurationComponent)
  private CalculationConfigurationComponent: CalculationConfigurationComponent;
  private FunctionMaths: FunctionMathsComponent;
  events = [];
  opened = true;
  public calculationName: string;
  public calculationGroup: string;
  constructor(
    private route: ActivatedRoute,
    private calcService: CalculationService,
    private router: Router
  ) {}
  onSave() {
    this.calculation.calculationInputs = this.CalculationInputComponent.getAllRows();
    this.calculation.calculationOutputs = this.CalculationOutputComponent.getAllRows();
    this.calculation.calculationConfigurations = this.CalculationConfigurationComponent.getAllRows();
    this.calculation.group = this.calculationGroup;
    this.calculation.name = this.calculationName;
    this.calcService.updateCalculation(
      this.calculation.key,
      JSON.parse(JSON.stringify(this.calculation))
    );
  }
  onDelete() {
    this.calcService.deleteCalculation(this.calculation.key);
    this.router.navigate(["dashboard"]);
  }
  onExit() {
    this.router.navigate(["dashboard"]);
  }
  // public getCalculationInputs(): any[] {

  //   return [];
  // }
  onCalc() {
    let autoComplete = [];
    autoComplete = this.CalculationInputComponent.getAllRowsNodes();
    this.CalculationConfigurationComponent.getAllRowsNodes().forEach(
      configuration => {
        if (configuration.data.functionType === "Maths") {
          this.calcMaths(configuration, autoComplete);
        } else if (configuration.data.functionType === "Date Adjustment") {
          this.calcDateAdjustment(configuration, autoComplete);
        } else if (configuration.data.functionType === "Date Duration") {
          this.calcDateDuration(configuration, autoComplete);
        } else if (configuration.data.functionType === "If Logic") {
          this.calcIfLogic(configuration, autoComplete);
        }
      }
    );
    this.calcOutput();
  }
  calcDateAdjustment(configuration, autoComplete) {
    const dateAdjustment = new FunctionDateAdjustmentComponent();
    const result = dateAdjustment.calculate(
      configuration.data.dateAdjustment,
      this.getCalculationConfigurationAutoComplete(
        "Date",
        autoComplete,
        configuration.rowIndex
      )
    );
    this.CalculationConfigurationComponent.setRowOuput(
      configuration.id,
      result
    );
  }
  calcDateDuration(configuration, autoComplete) {
    const dateDuration = new FunctionDateDurationComponent();
    const result = dateDuration.calculate(
      configuration.data.dateDuration,
      this.getCalculationConfigurationAutoComplete(
        "Date",
        autoComplete,
        configuration.rowIndex
      )
    );
    this.CalculationConfigurationComponent.setRowOuput(
      configuration.id,
      result
    );
  }
  calcMaths(configuration, autoComplete) {
    const math = new FunctionMathsComponent();
    const result = math.calculate(
      configuration.data.maths,
      this.getCalculationConfigurationAutoComplete(
        "Number",
        autoComplete,
        configuration.rowIndex
      )
    );
    this.CalculationConfigurationComponent.setRowOuput(
      configuration.id,
      result
    );
  }
  calcIfLogic(configuration, autoComplete) {
    const ifLogic = new FunctionIfLogicComponent();
    const result = ifLogic.calculate(
      configuration.data.ifLogic,
      this.getCalculationConfigurationAutoComplete(
        "Number",
        autoComplete,
        configuration.rowIndex
      )
    );
    this.CalculationConfigurationComponent.setRowOuput(
      configuration.id,
      result
    );
  }
  getCalculationConfigurationAutoComplete(data, inputs, rowIndex): any[] {
    let autoCompleteConfig = [];
    autoCompleteConfig = this.CalculationConfigurationComponent.getFinalRowNodesbyDataIndex(
      data,
      rowIndex
    );
    if (autoCompleteConfig === undefined) {
      return inputs;
    } else {
      return inputs.concat(autoCompleteConfig);
    }
  }
  calcOutput() {
    this.CalculationOutputComponent.getAllRowsNodes().forEach(output => {
      this.CalculationOutputComponent.setRowOuput(output.id, "");
      let arr: Array<any> = [];
      arr = this.CalculationConfigurationComponent.getFinalRowNodes(
        output.data.variable
      );
      this.CalculationOutputComponent.setRowOuput(
        output.id,
        arr["data"].output
      );
    });
  }
  receiveCalculationInput() {
    this.calculationInputNodes = this.CalculationInputComponent.getAllRowsNodes();
  }
  ngOnInit() {
    const key = this.route.snapshot.params["key"];
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
        this.calculationName = calculations[0].name;
        this.calculationGroup = calculations[0].group;
        this.calculationInputNodes = calculations[0].calculationInputs;
      });
  }
}
