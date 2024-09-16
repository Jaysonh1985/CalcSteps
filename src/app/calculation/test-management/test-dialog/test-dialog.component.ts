import { HttpClient } from "@angular/common/http";
import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatDialog } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { ReleaseService } from "../../shared/services/release.service";
import { CalculationService } from "../../shared/services/calculation.service";
import { AutoCompleteService } from "../../shared/services/auto-complete.service";
import { LookupService } from "../../shared/services/lookup.service";
import { AuthService } from "../../../shared/services/auth.service";
import { CalculateService } from "../../shared/services/calculate.service";
import { CalculationComponent } from "../../calculation.component";
import { CalculationInputComponent } from "../../calculation-input/calculation-input.component";
import { CalculationOutputComponent } from "../../calculation-output/calculation-output.component";
import { CalculationConfigurationComponent } from "../../calculation-configuration/calculation-configuration.component";
import { CalculationInput } from "../../shared/models/calculation-input";
import { CalculationConfiguration } from "../../shared/models/calculation-configuration";

@Component({
  selector: "app-test-dialog",
  templateUrl: "./test-dialog.component.html",
  styleUrls: ["./test-dialog.component.css"]
})
export class TestDialogComponent implements OnInit {
  @ViewChild(CalculationInputComponent)
  private CalculationInputComponent: CalculationInputComponent;
  @ViewChild(CalculationOutputComponent)
  private CalculationOutputComponent: CalculationOutputComponent;
  @ViewChild(CalculationConfigurationComponent)
  private CalculationConfigurationComponent: CalculationConfigurationComponent;
  public loading: boolean;
  public loadingProgress: number;
  isInput: boolean;
  constructor(
    public dialogRef: MatDialogRef<TestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route: ActivatedRoute,
    private releaseService: ReleaseService,
    private router: Router,
    private calcService: CalculationService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private autocompleteService: AutoCompleteService,
    private http: HttpClient,
    private lookupService: LookupService,
    private authService: AuthService,
    private calculateService: CalculateService
  ) {}

  ngOnInit() {

  }

  async onCalc() {
    const calculationComponent = new CalculationComponent(
      this.route,
      this.calcService,
      this.router,
      this.snackBar,
      this.dialog,
      this.autocompleteService,
      this.lookupService,
      this.authService,
      this.calculateService
    );
    const calculationInput = this.CalculationInputComponent.getAllRows();
    const getErrorsInput: CalculationInput[] = calculationComponent.getErrorsInput(
      calculationInput
    );
    const isErrorInput = calculationComponent.errorExists(getErrorsInput);
    this.CalculationInputComponent.setTableData(calculationInput);
    this.data.calculationInputs = calculationInput;
    this.loadingProgress = 30;
    let autoCompleteInputs = [];
    autoCompleteInputs = this.CalculationInputComponent.getAllRows();
    const calculationConfiguration = this.data.calculationConfiguration;
    const getErrorsConfiguration: CalculationConfiguration[] = calculationComponent.getErrorsConfiguration(
      calculationConfiguration,
      autoCompleteInputs
    );
    const isErrorConfiguration = calculationComponent.errorExists(
      getErrorsConfiguration
    );
    this.loadingProgress = 50;
    if (isErrorInput === true || isErrorConfiguration === true) {
      this.snackBar.open("Calculation Failed", "Failed", {
        duration: 2000
      });
      this.loading = false;
      setTimeout(() => {
        this.loadingProgress = 0;
      }, 2000);
    }
    if (isErrorInput === false && isErrorConfiguration === false) {
      await calculationComponent.calculateConfiguration(calculationConfiguration, autoCompleteInputs);
      this.loadingProgress = 70;
      let calculationOutput = this.CalculationOutputComponent.getAllRows();
      calculationOutput = calculationComponent.calculateOutput(calculationOutput, calculationConfiguration);
      this.CalculationOutputComponent.setTableData(calculationOutput);
      this.data.calculationOutputs = calculationOutput;
      this.loadingProgress = 100;
      this.loading = false;
      this.snackBar.open("Calculated Successfully", "Success", {
        duration: 2000
      });
      this.isInput = false;
      setTimeout(() => {
        this.loadingProgress = 0;
      }, 2000);
    }
  }
}
