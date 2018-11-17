import { Component, OnInit, ViewChild } from "@angular/core";
import {
  Validators,
  FormGroup,
  FormBuilder,
  FormControl
} from "@angular/forms";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";

import { CalculateService } from "./shared/services/calculate.service";
import { LookupService } from "./shared/services/lookup.service";
import { ConfirmationDialogComponent } from "../shared/components/confirmation-dialog/confirmation-dialog.component";
import { AuthService } from "../shared/services/auth.service";
import { CalculationConfigurationComponent } from "./calculation-configuration/calculation-configuration.component";
import { CalculationInputComponent } from "./calculation-input/calculation-input.component";
import { CalculationOutputComponent } from "./calculation-output/calculation-output.component";
import { CalculationConfiguration } from "./shared/models/calculation-configuration";
import { CalculationInput } from "./shared/models/calculation-input";
import { CalculationOutput } from "./shared/models/calculation-output";
import { AutoCompleteService } from "./shared/services/auto-complete.service";
import { CalculationService } from "./shared/services/calculation.service";
import { CalculationError } from "./shared/models/calculation-error";

@Component({
  selector: "app-calculation",
  templateUrl: "./calculation.component.html",
  styleUrls: ["./calculation.component.css"]
})
export class CalculationComponent implements OnInit {
  public key: any[];
  public calculation: any;
  public calculationConfiguration: CalculationConfiguration[];
  public calculationInput: CalculationInput[];
  public calculationInputNodes: any[];
  public calculationOutput: CalculationOutput[];
  @ViewChild(CalculationInputComponent)
  public CalculationInputComponent: CalculationInputComponent;
  @ViewChild(CalculationOutputComponent)
  public CalculationOutputComponent: CalculationOutputComponent;
  @ViewChild(CalculationConfigurationComponent)
  public CalculationConfigurationComponent: CalculationConfigurationComponent;
  @ViewChild("calculationForm")
  calculationForm: any;
  events = [];
  opened = true;
  public calculationName: string;
  public calculationGroup: string;
  public configOutputsNumber: string[];
  public configOutputsDate: string[];
  public configOutputsText: string[];
  public configOutputsLogic: string[];
  public loading: boolean;
  public loadingProgress: number;
  public isErrors: boolean;
  config = {
    sideNav: [
      { name: "Home", routerLink: "../", icon: "home" },
      { name: "Account", routerLink: "../account", icon: "account_circle" },
      { name: "Help", routerLink: "../account", icon: "help_outline" }
    ]
  };
  errorArray: any[];
  constructor(
    private route: ActivatedRoute,
    private calcService: CalculationService,
    private router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private autocompleteService: AutoCompleteService,
    private lookupService: LookupService,
    private authService: AuthService,
    private calculateService: CalculateService
  ) {}
  ngOnInit() {
    const key = this.route.snapshot.params["key"];
    this.loadingProgress = 0;
    this.authService.userFirebase.subscribe(auth => {
      if (auth) {
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
      } else {
        this.router.navigate(["home"]);
      }
    });
  }
  onSave() {
    this.loading = true;
    this.snackBar.open("Calculation in progress...", "Please wait", {
      duration: 500
    });
    this.loadingProgress = 10;
    this.calculation.calculationInputs = this.CalculationInputComponent.getAllRows();
    this.calculation.calculationOutputs = this.CalculationOutputComponent.getAllRows();
    this.calculation.calculationConfigurations = this.CalculationConfigurationComponent.getAllRows();
    this.calculation.group = this.calculationGroup;
    this.calculation.name = this.calculationName;
    this.loadingProgress = 30;
    this.calcService.updateCalculation(
      this.calculation.key,
      JSON.parse(JSON.stringify(this.calculation))
    );
    this.loadingProgress = 70;
    this.snackBar.open("Calculation Saved", "Saved", {
      duration: 2000
    });
    this.loadingProgress = 100;
    this.loading = false;
    this.opened = false;
    this.calculationForm.reset();
    setTimeout(() => {
      this.loadingProgress = 0;
    }, 2000);
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
  async onCalc() {
    this.loading = true;
    const selectedRow = this.CalculationConfigurationComponent.getSelectedRow();
    this.snackBar.open("Calculation in progress...", "Please wait", {
      duration: 500
    });
    this.loadingProgress = 0;
    const calculationInput = this.CalculationInputComponent.getAllRows();
    const getErrorsInput: CalculationInput[] = this.getErrorsInput(
      calculationInput
    );
    const isErrorInput = this.errorExists(getErrorsInput);
    this.CalculationInputComponent.setTableData(calculationInput);
    this.loadingProgress = 30;
    let autoCompleteInputs = [];
    autoCompleteInputs = this.CalculationInputComponent.getAllRows();
    const calculationConfiguration = this.CalculationConfigurationComponent.getAllRows();
    const getErrorsConfiguration: CalculationConfiguration[] = this.getErrorsConfiguration(
      calculationConfiguration,
      autoCompleteInputs
    );
    const isErrorConfiguration = this.errorExists(getErrorsConfiguration);
    this.CalculationConfigurationComponent.setTableData(
      calculationConfiguration
    );
    let calculationOutput = this.CalculationOutputComponent.getAllRows();
    const getErrorsOutput: CalculationOutput[] = this.getErrorsOutput(
      calculationOutput,
      autoCompleteInputs,
      calculationConfiguration
    );
    const isErrorOutput = this.errorExists(getErrorsOutput);
    this.CalculationOutputComponent.setTableData(calculationOutput);
    this.loadingProgress = 50;
    if (
      isErrorInput === true ||
      isErrorConfiguration === true ||
      isErrorOutput === true
    ) {
      this.snackBar.open("Calculation Failed", "Failed", {
        duration: 2000
      });
      this.loading = false;
      setTimeout(() => {
        this.loadingProgress = 0;
      }, 2000);
    }
    if (isErrorInput === false && isErrorConfiguration === false) {
      await this.calculateConfiguration(
        calculationConfiguration,
        autoCompleteInputs
      );
      this.CalculationConfigurationComponent.setTableData(
        calculationConfiguration
      );
      this.loadingProgress = 70;
      calculationOutput = this.CalculationOutputComponent.getAllRows();
      calculationOutput = this.calculateOutput(
        calculationOutput,
        calculationConfiguration
      );
      this.CalculationOutputComponent.setTableData(calculationOutput);
      this.loadingProgress = 100;
      this.loading = false;
      this.snackBar.open("Calculated Successfully", "Success", {
        duration: 2000
      });
      if (selectedRow.length > 0) {
        this.CalculationConfigurationComponent.setSelectedRow(selectedRow[0]);
      }
      setTimeout(() => {
        this.loadingProgress = 0;
      }, 2000);
    }
  }
  // ErrorChecking
  getErrorsInput(calculationInput): CalculationInput[] {
    for (const input of calculationInput) {
      const inputs = new CalculationInputComponent(this.autocompleteService);
      input.errors = inputs.errorCheck(input);
    }
    return calculationInput;
  }
  getErrorsConfiguration(
    calculationConfiguration,
    autoCompleteInputs
  ): CalculationConfiguration[] {
    let rowIndex = 0;
    for (const configuration of calculationConfiguration) {
      let autoCompleteConfig = [];
      let autoCompleteAll = [];
      configuration.errors = [];
      autoCompleteConfig = this.getAllRowsbyIndex(
        rowIndex,
        calculationConfiguration
      );
      autoCompleteAll = autoCompleteInputs.concat(autoCompleteConfig);
      configuration.errors = this.calculateService.runError(
        configuration,
        autoCompleteAll,
        this.authService,
        this.lookupService
      );
      rowIndex++;
    }
    return calculationConfiguration;
  }
  getErrorsOutput(
    calculationOutput,
    autoCompleteInputs,
    calculationConfiguration
  ): CalculationOutput[] {
    let rowIndex = 0;
    this.errorArray = [];
    for (const output of calculationOutput) {
      if (output.name === "" || output.name === undefined) {
        this.errorArray.push(
          new CalculationError(output.rowIndex, "Error", "Name is missing")
        );
      }
      if (output.data === "" || output.data === undefined) {
        this.errorArray.push(
          new CalculationError(output.rowIndex, "Error", "Data is missing")
        );
      }
      if (output.variable === "" || output.name === undefined) {
        this.errorArray.push(
          new CalculationError(output.rowIndex, "Error", "Variable is missing")
        );
      }
      output.errors = [];
      if (output.variable !== "" || output.name !== undefined) {
        const outputs = new CalculationOutputComponent();
        output.errors = this.errorArray.concat(
          outputs.errorCheck(output, calculationConfiguration)
        );
      } else {
        output.errors = this.errorArray;
      }
      rowIndex++;
    }
    return calculationOutput;
  }
  errorExists(array) {
    for (const row of array) {
      if (row.errors.length > 0) {
        return true;
      }
    }
    return false;
  }
  async calculateConfiguration(calculationConfiguration, autoCompleteInputs) {
    let rowIndex = 0;
    for (const configuration of calculationConfiguration) {
      let autoCompleteConfig = [];
      let autoCompleteAll = [];
      autoCompleteConfig = this.getAllRowsbyIndex(
        rowIndex,
        calculationConfiguration
      );
      autoCompleteAll = autoCompleteInputs.concat(autoCompleteConfig);
      configuration.conditionResult = this.calculateService.runCondition(
        configuration,
        autoCompleteAll
      );
      if (configuration.conditionResult === false) {
        const output = this.getFinalRowNodesbyNameIndex(
          configuration.name,
          rowIndex,
          calculationConfiguration
        );
        if (output === undefined) {
          if (configuration.data === "Number") {
            configuration.output = "0";
          } else {
            configuration.output = "";
          }
        } else {
          configuration.output = output.output;
        }
      }
      if (configuration.conditionResult === true) {
        if (configuration.functionType === "Distance") {
          configuration.output = await this.calculateService.runDistanceCalculationPromise(
            configuration,
            autoCompleteAll,
            this.authService,
            this.lookupService,
            this.calcService
          );
        } else if (configuration.functionType === "Lookup Table") {
          configuration.output = await this.calculateService.runLookupCalculationPromise2(
            configuration,
            autoCompleteAll,
            this.authService,
            this.lookupService,
            this.calcService
          );
        } else {
          configuration.output = this.calculateService.runCalculation(
            configuration,
            autoCompleteAll,
            this.authService,
            this.lookupService,
            this.calcService
          );
        }
      }
      rowIndex++;
    }
    return calculationConfiguration;
  }
  calculateOutput(
    calculationOutput,
    calculationConfiguration
  ): CalculationOutput[] {
    for (const output of calculationOutput) {
      let arr: CalculationConfiguration;
      arr = this.getFinalRowNodes(output.variable, calculationConfiguration);
      output.output = arr.output.toString();
      if (output.output === output.eresult) {
        output.pass = true;
      } else if (output.eresult === "") {
        output.pass = "";
      } else {
        output.pass = false;
      }
    }
    return calculationOutput;
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
  getAllRowsbyIndex(rowIndex, array): any[] {
    const arr: Array<any> = [];
    array.forEach(function(node, index) {
      if (index < rowIndex) {
        arr.push(node);
      }
      if (index === rowIndex) {
        if (arr.length > 0) {
          return arr[arr.length - 1];
        } else {
          return null;
        }
      }
    });
    return arr;
  }
  getFinalRowNodesbyNameIndex(name, rowIndex, array): CalculationConfiguration {
    const arr: Array<any> = [];
    array.forEach(function(node, index) {
      if (node.name === name && index < rowIndex) {
        arr.push(node);
      }
      if (index === rowIndex) {
        if (arr.length === 0) {
          return null;
        } else {
          return arr[arr.length - 1];
        }
      }
    });
    return arr[arr.length - 1];
  }
  getFinalRowNodes(name, array): CalculationConfiguration {
    const arr: Array<any> = [];
    array.forEach(function(node, index) {
      if (node.name === name) {
        arr.push(node);
      }
    });
    return arr[arr.length - 1];
  }
  routerReleaseManagement() {
    this.router.navigate(["release-management", this.calculation.key]);
  }
  routerUserManagement() {
    this.router.navigate(["user-management", this.calculation.key]);
  }
  routerTestManagement() {
    this.router.navigate(["test-management", this.calculation.key]);
  }
  routerCalculationBulk() {
    this.router.navigate(["calculation-bulk", this.calculation.key]);
  }
  setFormDirty() {
    this.calculationForm.control.markAsDirty();
  }
}
