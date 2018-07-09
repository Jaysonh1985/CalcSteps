import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ReleaseService } from "../shared/services/release.service";
import { CalculationConfiguration } from "../shared/models/calculation-configuration";
import { CalculationInput } from "../shared/models/calculation-input";
import { CalculationOutput } from "../shared/models/calculation-output";
import { CalculationInputComponent } from "../calculation-input/calculation-input.component";
import { CalculationOutputComponent } from "../calculation-output/calculation-output.component";
import { CalculationConfigurationComponent } from "../calculation-configuration/calculation-configuration.component";
import { CalculationComponent } from "../calculation.component";
import { CalculationService } from "../shared/services/calculation.service";
import { CalculationError } from "../shared/models/calculation-error";
import { moveIn, fallIn, moveInLeft } from "../../router.animations";
import { MatSnackBar, MatDialog } from "@angular/material";
import { AutoCompleteService } from "../shared/services/auto-complete.service";
import { HttpClient } from "@angular/common/http";
import { FunctionMathsComponent } from "../functions/function-maths/function-maths.component";
import { FunctionDateAdjustmentComponent } from "../functions/function-date-adjustment/function-date-adjustment.component";
import { FunctionDateDurationComponent } from "../functions/function-date-duration/function-date-duration.component";
import { FunctionIfLogicComponent } from "../functions/function-if-logic/function-if-logic.component";
import { FunctionDistanceComponent } from "../functions/function-distance/function-distance.component";
import { AuthService } from "../../shared/services/auth.service";
import { LookupService } from "../shared/services/lookup.service";
import { FunctionLookupTableComponent } from "../functions/function-lookup-table/function-lookup-table.component";
import * as moment from "moment";
import "moment/locale/pt-br";
import { CalculateService } from "../shared/services/calculate.service";

@Component({
  selector: "app-release",
  templateUrl: "./release.component.html",
  styleUrls: ["./release.component.css"],
  animations: [moveIn(), fallIn(), moveInLeft()]
})
export class ReleaseComponent implements OnInit {
  isErrors: boolean;
  isInput: boolean;
  errors: string[];
  public calculation: any;
  public calculationConfiguration: CalculationConfiguration;
  public calculationInput: CalculationInput[];
  public calculationOutput: CalculationOutput;
  public calculationName: string;
  public calculationGroup: string;
  public calculationInputNodes: any[];
  @ViewChild(CalculationInputComponent)
  private CalculationInputComponent: CalculationInputComponent;
  @ViewChild(CalculationOutputComponent)
  private CalculationOutputComponent: CalculationOutputComponent;
  @ViewChild(CalculationConfigurationComponent)
  private CalculationConfigurationComponent: CalculationConfigurationComponent;
  constructor(
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
  ) {
    this.errors = [];
  }

  ngOnInit() {
    const key = this.route.snapshot.params["key"];
    this.isInput = true;
    this.releaseService
      .getRelease(key)
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
  onReset() {
    this.CalculationInputComponent.onDeleteAllInputs();
    this.CalculationOutputComponent.onDeleteAllOutputs();
  }
  onExit() {
    this.router.navigate(["dashboard"]);
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
        const calc = new CalculationComponent(
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
    if (this.isErrors) {
      this.CalculationInputComponent.getAllRowsNodes().forEach(input => {
        if (input.data.errors.length > 0) {
          input.data.errors.forEach(element => {
            this.errors.push(element.errorText);
          });
        }
      });
    }

    if (this.isErrors === false) {
      this.errors = [];
      this.CalculationConfigurationComponent.getAllRowsNodes().forEach(
        configuration => {
          const calc = new CalculationComponent(
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
              // this.calculateService
              //   .runDistanceCalculationPromise(
              //     configuration,
              //     autoCompleteAll,
              //     this.authService,
              //     this.lookupService,
              //     this.calcService
              //   )
              //   .subscribe(data => {
              //     if (data["status"] === "OK") {
              //       configuration.data.output = this.calculateService.getDistanceCalculation(data);
              //       if (oldOutput !== configuration.data.output) {
              //         this.CalculationConfigurationComponent.setRowOuput(
              //           configuration.id,
              //           configuration.data,
              //           true
              //         );
              //         this.calcOutput();
              //       }
              //     }
              //   });
            } else if (configuration.data.functionType === "Lookup Table") {
              // this.calculateService
              //   .runCalculationObservable(
              //     configuration,
              //     autoCompleteAll,
              //     this.authService,
              //     this.lookupService,
              //     this.calcService
              //   )
              //   .subscribe(lookups => {
              //     configuration.data.output = this.calculateService.getLookupTableCalculation(
              //       configuration,
              //       lookups[0].LookupValue,
              //       lookups
              //     );
              //     if (oldOutput !== configuration.data.output) {
              //       this.CalculationConfigurationComponent.setRowOuput(
              //         configuration.id,
              //         configuration.data,
              //         true
              //       );
              //       this.calcOutput();
              //     }
              //   });
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
      );
      this.calcOutput();
    }
  }
  errorInput(input) {
    const inputs = new CalculationInputComponent(this.autocompleteService);
    let errorCheck: CalculationError[];
    errorCheck = inputs.errorCheck(input);
    if (errorCheck.length > 0) {
      this.isErrors = true;
    }
    return [];
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
    this.isInput = false;
  }
  routeInput() {
    this.isInput = true;
  }
  getCalcStyle() {
    if (this.isInput) {
      return "";
    } else {
      return "None";
    }
  }
  getResultStyle() {
    if (!this.isInput) {
      return "";
    } else {
      return "None";
    }
  }
  getResultTransition() {
    if (!this.isInput) {
      return "void";
    } else {
      return "*";
    }
  }
}
