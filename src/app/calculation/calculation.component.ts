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
import { CalculationError } from "./shared/models/calculation-error";
import { MatSnackBar, MatDialog } from "@angular/material";
import { ConfirmationDialogComponent } from "../shared/confirmation-dialog/confirmation-dialog.component";
import { AutoCompleteService } from "./shared/services/auto-complete.service";
import { FunctionDistanceComponent } from "./functions/function-distance/function-distance.component";
import { HttpClient } from "@angular/common/http";

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
    private router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private autocompleteService: AutoCompleteService,
    private http: HttpClient
  ) {}
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
    this.snackBar.open("Calculation Saved", "Saved", {
      duration: 2000
    });
    this.opened = false;
  }
  onDelete() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "400px",
      data: { description: "Do you wish to delete this calculation?" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.calcService.deleteCalculation(this.calculation.key);
        this.router.navigate(["dashboard"]);
      }
    });
  }
  onExit() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "400px",
      data: { description: "Do you wish to exit?" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.router.navigate(["dashboard"]);
      }
    });
  }
  onCalc() {
    this.isErrors = false;
    this.CalculationInputComponent.getAllRowsNodes().forEach(input => {
      const inputs = new CalculationInputComponent(this.autocompleteService);
      input.data.errors = inputs.errorCheck(input);
      if (input.data.errors.length > 0) {
        this.isErrors = true;
      }
      this.CalculationInputComponent.setRowOuput(input.id, input.data);
    });
    let autoCompleteInputs = [];
    autoCompleteInputs = this.CalculationInputComponent.getAllRowsNodes();
    this.CalculationConfigurationComponent.getAllRowsNodes().forEach(
      configuration => {
        let autoCompleteConfig = [];
        let autoCompleteAll = [];
        configuration.data.errors = [];
        autoCompleteConfig = this.CalculationConfigurationComponent.getAllRowsNodesbyIndex(
          configuration.rowIndex
        );
        autoCompleteAll = autoCompleteInputs.concat(autoCompleteConfig);
        if (configuration.data.functionType === "Maths") {
          const math = new FunctionMathsComponent();
          configuration.data.errors = math.errorCheck(
            configuration.data.maths,
            autoCompleteAll
          );
        } else if (configuration.data.functionType === "Date Adjustment") {
          const dateAdjustment = new FunctionDateAdjustmentComponent();
          configuration.data.errors = dateAdjustment.errorCheck(
            configuration.data.dateAdjustment,
            autoCompleteAll
          );
        } else if (configuration.data.functionType === "Date Duration") {
          const dateDuration = new FunctionDateDurationComponent();
          configuration.data.errors = dateDuration.errorCheck(
            configuration.data.dateDuration,
            autoCompleteAll
          );
        } else if (configuration.data.functionType === "If Logic") {
          const ifLogic = new FunctionIfLogicComponent();
          configuration.data.errors = ifLogic.errorCheck(
            configuration.data.ifLogic,
            autoCompleteAll
          );
        }
        if (configuration.data.errors.length > 0) {
          this.isErrors = true;
        }
        this.CalculationConfigurationComponent.setRowOuput(
          configuration.id,
          configuration.data,
          false
        );
      }
    );
    if (this.isErrors) {
      this.snackBar.open("Calculation Failed", "Failed", {
        duration: 2000
      });
    }
    if (this.isErrors === false) {
      this.CalculationConfigurationComponent.getAllRowsNodes().forEach(
        configuration => {
          let autoCompleteConfig = [];
          let autoCompleteAll = [];
          autoCompleteConfig = this.CalculationConfigurationComponent.getAllRowsNodesbyIndex(
            configuration.rowIndex
          );
          autoCompleteAll = autoCompleteInputs.concat(autoCompleteConfig);
          configuration.data.conditionResult = this.calcCondition(
            configuration,
            autoCompleteAll
          );
          this.CalculationConfigurationComponent.setRowOuput(
            configuration.id,
            configuration.data,
            false
          );
          if (configuration.data.conditionResult === true) {
            const oldOutput = configuration.data.output;
            if (configuration.data.functionType === "Maths") {
              const math = new FunctionMathsComponent();
              configuration.data.output = math.calculate(
                configuration.data.maths,
                autoCompleteAll
              );
            } else if (configuration.data.functionType === "Date Adjustment") {
              const dateAdjustment = new FunctionDateAdjustmentComponent();
              configuration.data.output = dateAdjustment.calculate(
                configuration.data.dateAdjustment,
                autoCompleteAll
              );
            } else if (configuration.data.functionType === "Date Duration") {
              const dateDuration = new FunctionDateDurationComponent();
              configuration.data.output = dateDuration.calculate(
                configuration.data.dateDuration,
                autoCompleteAll
              );
            } else if (configuration.data.functionType === "If Logic") {
              const ifLogic = new FunctionIfLogicComponent();
              configuration.data.output = ifLogic.calculate(
                configuration.data.ifLogic,
                autoCompleteAll
              );
            } else if (configuration.data.functionType === "Distance") {
              const distance = new FunctionDistanceComponent(this.calcService);
              let Origin = distance.getAutoCompleteOutput(
                configuration.data.distance.origin,
                autoCompleteAll
              );
              let Destination = distance.getAutoCompleteOutput(
                configuration.data.distance.destination,
                autoCompleteAll
              );
              Origin = Origin.replace(" ", "+");
              Destination = Destination.replace(" ", "+");
              this.http
                // tslint:disable-next-line:max-line-length
                .get(
                  "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" +
                    Origin +
                    "&destinations=" +
                    Destination +
                    "&mode=driving&language=en-GB&key=AIzaSyDzO3msuuB8lAAjsrSfG15Ecw8hSmXKbzQ"
                )
                .subscribe(data => {
                  if (data["status"] === "OK") {
                    let rows = data["rows"];
                    rows = rows[0];
                    let elements = rows["elements"];
                    elements = elements[0];
                    let meters = elements["distance"];
                    meters = meters["value"];
                    let miles: Number;
                    miles = Number(meters / 1609.34);
                    configuration.data.output = miles.toFixed(2);
                    this.CalculationConfigurationComponent.setRowOuput(
                      configuration.id,
                      configuration.data,
                      true
                    );
                  }
                });
            }
            if (oldOutput !== configuration.data.output) {
              this.CalculationConfigurationComponent.setRowOuput(
                configuration.id,
                configuration.data,
                true
              );
            }
          }
        }
      );
      this.snackBar.open("Calculated Successfully", "Success", {
        duration: 2000
      });
      this.calcOutput();
    }
  }
  calcCondition(configuration, autoComplete) {
    let input: string;
    input = configuration.data.condition;
    autoComplete.forEach(value => {
      if (value.data.name === configuration.data.condition) {
        input = value.data.output;
      }
    });
    if (configuration.data.condition === undefined) {
      configuration.data.condition = "";
    }
    if (configuration.data.condition === "") {
      return true;
    } else if (
      configuration.data.condition === "true" ||
      configuration.data.condition === "True" ||
      configuration.data.condition === "TRUE"
    ) {
      return true;
    } else if (
      configuration.data.condition === "false" ||
      configuration.data.condition === "False" ||
      configuration.data.condition === "FALSE"
    ) {
      return false;
    } else {
      if (input === "true") {
        return true;
      } else {
        return false;
      }
    }
  }
  errorInput(input) {
    const inputs = new CalculationInputComponent(this.autocompleteService);
    let errorCheck: CalculationError[];
    errorCheck = [];
    errorCheck = inputs.errorCheck(input);
    if (errorCheck.length > 0) {
      this.isErrors = true;
    }
    return [];
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
      const oldOutput = output.data.output;
      let arr: Array<any> = [];
      arr = this.CalculationConfigurationComponent.getFinalRowNodes(
        output.data.variable
      );
      if (oldOutput !== arr["data"].output) {
        this.CalculationOutputComponent.setRowOuput(
          output.id,
          arr["data"].output
        );
      }
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
  routerReleaseManagement() {
    this.router.navigate(["release-management", this.calculation.key]);
  }
}
