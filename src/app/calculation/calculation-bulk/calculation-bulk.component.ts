import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CalculationService } from "../shared/services/calculation.service";
import { AuthService } from "../../shared/services/auth.service";
import { CalculationInput } from "../shared/models/calculation-input";
import { Calculation } from "../shared/models/calculation";
import { GridOptions, GridApi, Grid } from "ag-grid";
import { CalculationComponent } from "../calculation.component";
import { ReleaseService } from "../shared/services/release.service";
import { MatSnackBar, MatDialog } from "@angular/material";
import { AutoCompleteService } from "../shared/services/auto-complete.service";
import { HttpClient } from "@angular/common/http";
import { LookupService } from "../shared/services/lookup.service";
import { CalculateService } from "../shared/services/calculate.service";
import { CalculationInputComponent } from "../calculation-input/calculation-input.component";
import { CalculationOutputComponent } from "../calculation-output/calculation-output.component";
import { CalculationConfigurationComponent } from "../calculation-configuration/calculation-configuration.component";
import { CalculationConfiguration } from "../shared/models/calculation-configuration";
import { CalculationOutput } from "../shared/models/calculation-output";
import { CalculationBulkInputComponent } from "./calculation-bulk-input/calculation-bulk-input.component";
import { CalculationBulkOutputComponent } from "./calculation-bulk-output/calculation-bulk-output.component";

@Component({
  selector: "app-calculation-bulk",
  templateUrl: "./calculation-bulk.component.html",
  styleUrls: ["./calculation-bulk.component.css"]
})
export class CalculationBulkComponent implements OnInit {
  public gridOptions: GridOptions;
  public outputGridOptions: GridOptions;
  private gridApi: GridApi;
  private gridApiOutputs: GridApi;
  private fileReaded;
  gridColumnApi: GridApi;
  gridOutputColumnApi: GridApi;
  loadingProgress: number;
  bulkLoadingProgress: number;
  loading: boolean;
  @ViewChild(CalculationInputComponent)
  private CalculationInputComponent: CalculationInputComponent;
  @ViewChild(CalculationOutputComponent)
  private CalculationOutputComponent: CalculationOutputComponent;
  @ViewChild(CalculationConfigurationComponent)
  private CalculationConfigurationComponent: CalculationConfigurationComponent;
  isInput: boolean;
  calculationInputNew: CalculationInput;
  calculationNewInput: CalculationInput;
  calculationNewOutputs: any[];
  calculationName: string;
  calculationCount: number;
  calculationTotalCount: number;
  calculationTime: number;
  totalCalculationTimeSeconds: number;
  totalCalculationTimeMinutes: number;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private calcService: CalculationService,
    private authService: AuthService,
    private releaseService: ReleaseService,
    public snackBar: MatSnackBar,
    private autocompleteService: AutoCompleteService,
    private http: HttpClient,
    public dialog: MatDialog,
    private lookupService: LookupService,
    private calculateService: CalculateService
  ) {}
  public calculationInput: CalculationInput[];
  public calculationInputs: CalculationInput[];
  public calculationConfiguration: CalculationConfiguration[];
  public calculationOutput: CalculationOutput[];
  public calculationOutputs: CalculationOutput[];
  public calculationNewInputs: CalculationInput[];
  public calculation: any;
  public calculations: Calculation[];
  @ViewChild(CalculationBulkInputComponent)
  public CalculationBulkInputComponent: CalculationBulkInputComponent;
  @ViewChild(CalculationBulkOutputComponent)
  public CalculationBulkOutputComponent: CalculationBulkOutputComponent;

  config = {
    sideNav: [
      { name: "Home", routerLink: "../", icon: "home" },
      { name: "Account", routerLink: "../account", icon: "account_circle" },
      { name: "Help", routerLink: "../account", icon: "help_outline" }
    ]
  };
  ngOnInit() {
    this.authService.userFirebase.subscribe(auth => {
      if (auth) {
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
          });
      }
    });
  }

  async onCalculate() {
    const arr = this.CalculationBulkInputComponent.getAllRowsNodes();
    let arrCol = [];
    arrCol = this.CalculationBulkInputComponent.getAllColumns();
    this.calculationTotalCount = arrCol.length - 2;
    this.calculationNewInputs = [];
    this.calculationNewOutputs = [];
    this.calculationCount = 0;
    this.bulkLoadingProgress = 0;
    this.totalCalculationTimeSeconds = 0;
    this.totalCalculationTimeMinutes = 0;
    this.CalculationBulkOutputComponent.onResetColumns();
    this.snackBar.open("Bulk Calculation Started", "Success", {
      duration: 2000
    });
    for (const col of arrCol) {
      if (col.colId !== "name" && col.colId !== "data") {
        const start = new Date().getTime();
        for (const row of arr) {
          const cell = this.CalculationBulkInputComponent.getValue(
            col.colId,
            row
          );
          this.calculationNewInputs.push(
            new CalculationInput(
              row.data.id,
              row.data.name,
              row.data.data,
              cell,
              [],
              "False",
              "False"
            )
          );
        }
        await this.onCalc(
          this.calculationNewInputs,
          this.calculationOutput
        ).then(res => {
          this.calculationNewOutputs.push(res);
          this.CalculationBulkOutputComponent.setNewColumn();
          const arrOutput = this.CalculationBulkOutputComponent.getAllRowsNodes();
          const arrColOutput = this.CalculationBulkOutputComponent.getAllColumns();
          for (const outputRow of arrOutput) {
            let filterArray = [];
            filterArray = res.filter(x => x.id === outputRow.data.id);
            this.CalculationBulkOutputComponent.setCellValue(
              outputRow,
              filterArray[0].output,
              col.colId
            );
          }
          this.calculationNewInputs = [];
          this.calculationNewOutputs = [];
        });
        this.calculationCount++;
        this.bulkLoadingProgress = this.calculationCount / this.calculationTotalCount * 100;
        this.totalCalculationTimeSeconds = Math.floor(this.totalCalculationTimeSeconds + this.calculationTime);
        this.totalCalculationTimeMinutes = Math.floor(this.totalCalculationTimeSeconds / 60);
        if (this.calculationCount === this.calculationTotalCount) {
          this.snackBar.open("Bulk Calculation Finished", "Success", {
            duration: 2000
          });
        }
        const end = new Date().getTime();
        this.calculationTime = (end - start) / 1000;
      }
    }
  }
  async onCalc(calculationInput, calculationOutput) {
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
    const getErrorsInput: CalculationInput[] = calculationComponent.getErrorsInput(
      calculationInput
    );
    const isErrorInput = calculationComponent.errorExists(getErrorsInput);
    this.calculationInputs = calculationInput;
    this.loadingProgress = 30;
    let autoCompleteInputs = [];
    autoCompleteInputs = calculationInput;
    const calculationConfiguration = this.calculationConfiguration;
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
      await calculationComponent.calculateConfiguration(
        calculationConfiguration,
        autoCompleteInputs
      );
      this.loadingProgress = 70;
      calculationOutput = calculationComponent.calculateOutput(
        calculationOutput,
        calculationConfiguration
      );
      return calculationOutput;
    }
  }
  routerCalculation(calculation) {
    this.router.navigate(["calculation", this.route.snapshot.params["key"]]);
  }
}
