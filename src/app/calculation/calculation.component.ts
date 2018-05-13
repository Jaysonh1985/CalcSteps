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
  public configOutputsNumber: string[];
  public configOutputsDate: string[];
  public configOutputsText: string[];
  public configOutputsLogic: string[];
  public isErrors: boolean;
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
  onCalc() {
    this.isErrors = false;
    this.CalculationInputComponent.getAllRowsNodes().forEach(input => {
      this.errorInput(input);
    });
    let autoComplete = [];
    autoComplete = this.CalculationInputComponent.getAllRowsNodes();
    this.CalculationConfigurationComponent.getAllRowsNodes().forEach(
      configuration => {
        if (configuration.data.functionType === "Maths") {
          this.errorMaths(configuration, autoComplete);
        } else if (configuration.data.functionType === "Date Adjustment") {
        } else if (configuration.data.functionType === "Date Duration") {
          this.errorDateDuration(configuration, autoComplete);
        } else if (configuration.data.functionType === "If Logic") {
          this.errorIfLogic(configuration, autoComplete);
        }
      }
    );

    if (this.isErrors === false) {
      this.CalculationConfigurationComponent.getAllRowsNodes().forEach(
        configuration => {
          this.calcCondition(configuration, autoComplete);
          if (configuration.data.conditionResult === true) {
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
        }
      );
    }

    this.calcOutput();
  }
  private getAutoCompleteOutputLogic(InputValue, array): any {
    let input = 0;
    if (InputValue !== "true" && InputValue !== "false") {
      input = InputValue;
      array.forEach(value => {
        if (value.data.name === InputValue) {
          input = value.data.output;
        }
      });
    } else {
      input = InputValue;
    }
    return input;
  }
  calcCondition(configuration, autoComplete) {
    let autoCompleteLogic = [];
    autoCompleteLogic = autoComplete.concat(
      this.CalculationConfigurationComponent.getAllRowsNodesbyIndex(
        configuration.rowIndex
      )
    );
    if (configuration.data.condition === undefined) {
      configuration.data.condition = "";
    }
    if (configuration.data.condition === "") {
      configuration.data.conditionResult = true;
    } else if (
      configuration.data.condition === "true" ||
      configuration.data.condition === "True" ||
      configuration.data.condition === "TRUE"
    ) {
      configuration.data.conditionResult = true;
    } else if (
      configuration.data.condition === "false" ||
      configuration.data.condition === "False" ||
      configuration.data.condition === "FALSE"
    ) {
      configuration.data.conditionResult = false;
    } else {
      if (
        this.getAutoCompleteOutputLogic(
          configuration.data.condition,
          autoCompleteLogic
        ) === "true"
      ) {
        configuration.data.conditionResult = true;
      } else {
        configuration.data.conditionResult = false;
      }
    }
    this.CalculationConfigurationComponent.setRowOuput(
      configuration.id,
      configuration.data
    );
  }
  calcDateAdjustment(configuration, autoComplete) {
    const dateAdjustment = new FunctionDateAdjustmentComponent();
    configuration.data.output = dateAdjustment.calculate(
      configuration.data.dateAdjustment,
      this.getCalculationConfigurationAutoComplete(
        "Date",
        autoComplete,
        configuration.rowIndex
      )
    );
    this.CalculationConfigurationComponent.setRowOuput(
      configuration.id,
      configuration.data
    );
  }
  calcDateDuration(configuration, autoComplete) {
    const dateDuration = new FunctionDateDurationComponent();
    configuration.data.output = dateDuration.calculate(
      configuration.data.dateDuration,
      this.getCalculationConfigurationAutoComplete(
        "Date",
        autoComplete,
        configuration.rowIndex
      )
    );
    this.CalculationConfigurationComponent.setRowOuput(
      configuration.id,
      configuration.data
    );
  }
  calcMaths(configuration, autoComplete) {
    const math = new FunctionMathsComponent();
    configuration.data.output = math.calculate(
      configuration.data.maths,
      this.getCalculationConfigurationAutoComplete(
        "Number",
        autoComplete,
        configuration.rowIndex
      )
    );
    this.CalculationConfigurationComponent.setRowOuput(
      configuration.id,
      configuration.data
    );
  }
  calcIfLogic(configuration, autoComplete) {
    const ifLogic = new FunctionIfLogicComponent();
    configuration.data.output = ifLogic.calculate(
      configuration.data.ifLogic,
      this.getCalculationConfigurationAutoComplete(
        "Number",
        autoComplete,
        configuration.rowIndex
      )
    );
    this.CalculationConfigurationComponent.setRowOuput(
      configuration.id,
      configuration.data
    );
  }
  errorInput(input) {
    const inputs = new CalculationInputComponent();
    input.data.errors =   inputs.errorCheck(input);
    if (input.data.errors.length > 0) {
      this.isErrors = true;
    }
    this.CalculationInputComponent.setRowOuput(
      input.id,
      input.data
    );
  }
  errorDateAdjustment(configuration, autoComplete) {
    const dateDuration = new FunctionDateAdjustmentComponent();
    configuration.data.errors = dateDuration.errorCheck(
      configuration.data.dateDuration,
      this.getCalculationConfigurationAutoComplete(
        "Date",
        autoComplete,
        configuration.rowIndex
      )
    );
    if (configuration.data.errors.length > 0) {
      this.isErrors = true;
    }
    this.CalculationConfigurationComponent.setRowOuput(
      configuration.id,
      configuration.data
    );
  }
  errorDateDuration(configuration, autoComplete) {
    const dateDuration = new FunctionDateDurationComponent();
    configuration.data.errors = dateDuration.errorCheck(
      configuration.data.dateDuration,
      this.getCalculationConfigurationAutoComplete(
        "Date",
        autoComplete,
        configuration.rowIndex
      )
    );
    if (configuration.data.errors.length > 0) {
      this.isErrors = true;
    }
    this.CalculationConfigurationComponent.setRowOuput(
      configuration.id,
      configuration.data
    );
  }
  errorMaths(configuration, autoComplete) {
    const math = new FunctionMathsComponent();
    configuration.data.errors = math.errorCheck(
      configuration.data.maths,
      this.getCalculationConfigurationAutoComplete(
        "Number",
        autoComplete,
        configuration.rowIndex
      )
    );
    if (configuration.data.errors.length > 0) {
      this.isErrors = true;
    }
    this.CalculationConfigurationComponent.setRowOuput(
      configuration.id,
      configuration.data
    );
  }
  errorIfLogic(configuration, autoComplete) {
    const ifLogic = new FunctionIfLogicComponent();
    configuration.data.errors = ifLogic.errorCheck(
      configuration.data.ifLogic,
      this.getCalculationConfigurationAutoComplete(
        "Number",
        autoComplete,
        configuration.rowIndex
      )
    );
    if (configuration.data.errors.length > 0) {
      this.isErrors = true;
    }
    this.CalculationConfigurationComponent.setRowOuput(
      configuration.id,
      configuration.data
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
  getConfigOutputLists() {
    const arrNumber: Array<any> = [];
    const arrDate: Array<any> = [];
    const arrLogic: Array<any> = [];
    const arrText: Array<any> = [];
    this.CalculationConfigurationComponent.getAllRowsNodes().forEach(output => {
      if (output.data.data === "Number") {
        arrNumber.push(output.data.name);
      } else if (output.data.data === "Date") {
        arrDate.push(output.data.name);
      } else if (output.data.data === "Logic") {
        arrLogic.push(output.data.name);
      } else if (output.data.data === "Text") {
        arrText.push(output.data.name);
      }
    });
    this.configOutputsNumber = [];
    this.configOutputsDate = [];
    this.configOutputsLogic = [];
    this.configOutputsText = [];
    this.configOutputsNumber = arrNumber;
    this.configOutputsDate = arrDate;
    this.configOutputsLogic = arrLogic;
    this.configOutputsText = arrText;
  }
  receiveCalculationInput() {
    this.calculationInputNodes = this.CalculationInputComponent.getAllRowsNodes();
    this.getConfigOutputLists();
  }
  routerReleaseManagement() {
    this.router.navigate(["release-management", this.calculation.key]);
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
