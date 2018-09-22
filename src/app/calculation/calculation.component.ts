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
import { CalculationError } from "./shared/models/calculation-error";
import { CalculationInput } from "./shared/models/calculation-input";
import { CalculationOutput } from "./shared/models/calculation-output";
import { AutoCompleteService } from "./shared/services/auto-complete.service";
import { CalculationService } from "./shared/services/calculation.service";

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
  @ViewChild("calculationForm") calculationForm: any;
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
  ) {
  }
  ngOnInit() {
    const key = this.route.snapshot.params["key"];
    this.loadingProgress = 0;
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
    setTimeout(() => {  this.loadingProgress = 0; }, 2000);
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
    this.snackBar.open("Calculation in progress...", "Please wait", {
      duration: 500
    });
    this.loadingProgress = 0;
    this.isErrors = false;
    this.CalculationInputComponent.getAllRowsNodes().forEach(input => {
      const inputs = new CalculationInputComponent(this.autocompleteService);
      input.data.errors = inputs.errorCheck(input);
      if (input.data.errors.length > 0) {
        this.isErrors = true;
      }
      this.CalculationInputComponent.setRowOuput(input.id, input.data);
    });
    this.loadingProgress = 30;
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
        configuration.data.errors = this.calculateService.runError(
          configuration,
          autoCompleteAll,
          this.authService,
          this.lookupService
        );
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
    this.loadingProgress = 50;
    if (this.isErrors) {
      this.snackBar.open("Calculation Failed", "Failed", {
        duration: 2000
      });
      this.loading = false;
      setTimeout(() => {  this.loadingProgress = 0; }, 2000);
    }
    if (this.isErrors === false) {
      for (const configuration of this.CalculationConfigurationComponent.getAllRowsNodes()) {
        let autoCompleteConfig = [];
        let autoCompleteAll = [];
        autoCompleteConfig = this.CalculationConfigurationComponent.getAllRowsNodesbyIndex(
          configuration.rowIndex
        );
        autoCompleteAll = autoCompleteInputs.concat(autoCompleteConfig);
        configuration.data.conditionResult = this.calculateService.runCondition(
          configuration,
          autoCompleteAll
        );
        if (configuration.data.conditionResult === false) {
          const output = this.CalculationConfigurationComponent.getFinalRowNodesbyNameIndex(
            configuration.data.name,
            configuration.rowIndex
          );
          if (output === undefined) {
            if (configuration.data.data === "Number") {
              configuration.data.output = 0;
            } else {
              configuration.data.output = "";
            }
          } else {
            configuration.data.output = output;
          }
        }
        this.CalculationConfigurationComponent.setRowOuput(
          configuration.id,
          configuration.data,
          false
        );
        if (configuration.data.conditionResult === true) {
          const oldOutput = configuration.data.output;
          if (configuration.data.functionType === "Distance") {
            configuration.data.output = await this.calculateService.runDistanceCalculationPromise(
              configuration,
              autoCompleteAll,
              this.authService,
              this.lookupService,
              this.calcService
            );
          } else if (configuration.data.functionType === "Lookup Table") {
            configuration.data.output = await this.calculateService.runLookupCalculationPromise2(
              configuration,
              autoCompleteAll,
              this.authService,
              this.lookupService,
              this.calcService
            );
          } else {
            configuration.data.output = this.calculateService.runCalculation(
              configuration,
              autoCompleteAll,
              this.authService,
              this.lookupService,
              this.calcService
            );
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
      this.loadingProgress = 70;
      this.calcOutput();
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
    this.loadingProgress = 100;
    this.loading = false;
    this.snackBar.open("Calculated Successfully", "Success", {
      duration: 2000
    });
    setTimeout(() => {  this.loadingProgress = 0; }, 2000);
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
  routerUserManagement() {
    this.router.navigate(["user-management", this.calculation.key]);
  }
  setFormDirty() {
    this.calculationForm.control.markAsDirty();
  }

}
