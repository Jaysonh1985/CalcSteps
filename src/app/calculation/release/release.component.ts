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
import { AuthService } from "../../services/auth.service";
import { LookupService } from "../shared/services/lookup.service";
import { FunctionLookupTableComponent } from "../functions/function-lookup-table/function-lookup-table.component";
import * as moment from "moment";
import "moment/locale/pt-br";
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
    private authService: AuthService
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
      input.data.errors = this.errorInput(input);
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
          this.http,
          this.lookupService,
          this.authService
        );
        let autoCompleteConfig = [];
        let autoCompleteAll = [];
        autoCompleteConfig = this.CalculationConfigurationComponent.getAllRowsNodesbyIndex(
          configuration.rowIndex
        );
        autoCompleteAll = autoCompleteInputs.concat(autoCompleteConfig);
        if (configuration.data.functionType === "Maths") {
          const math = new FunctionMathsComponent();
          configuration.data.errors = math.errorCheck(configuration.data.maths, autoCompleteAll);
        } else if (configuration.data.functionType === "Date Adjustment") {
          const dateAdjustment = new FunctionDateAdjustmentComponent();
          configuration.data.errors = dateAdjustment.errorCheck(configuration.data.dateAdjustment, autoCompleteAll);
        } else if (configuration.data.functionType === "Date Duration") {
          const dateDuration = new FunctionDateDurationComponent();
          configuration.data.errors = dateDuration.errorCheck(configuration.data.dateDuration, autoCompleteAll);
        } else if (configuration.data.functionType === "Distance") {
          configuration.data.errors = [];
        } else if (configuration.data.functionType === "If Logic") {
          const ifLogic = new FunctionIfLogicComponent();
          configuration.data.errors = ifLogic.errorCheck(configuration.data.ifLogic, autoCompleteAll);
        } else if (configuration.data.functionType === "Lookup Table") {
          const lookupTable = new FunctionLookupTableComponent(this.authService, this.lookupService);
          configuration.data.errors = lookupTable.errorCheck(configuration.data.lookupTable, autoCompleteAll);
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
    this.errors = [];
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
            this.http,
            this.lookupService,
            this.authService
          );
          let autoCompleteConfig = [];
          let autoCompleteAll = [];
          autoCompleteConfig = this.CalculationConfigurationComponent.getAllRowsNodesbyIndex(
            configuration.rowIndex
          );
          autoCompleteAll = autoCompleteInputs.concat(autoCompleteConfig);
          configuration.data.conditionResult = calc.calcCondition(
            configuration,
            autoCompleteAll
          );
          this.CalculationConfigurationComponent.setRowOuput(
            configuration.id,
            configuration.data,
            false
          );
          if (configuration.data.conditionResult === true) {
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
                     configuration.data.output = ifLogic.calculate(configuration.data.ifLogic, autoCompleteAll);
                   } else if (configuration.data.functionType === "Lookup Table") {
                     const lookupTable = new FunctionLookupTableComponent(this.authService, this.lookupService);
                     let LookupValue: string;
                     LookupValue = configuration.data.lookupTable.LookupValue;
                     if (configuration.data.lookupTable.LookupType === "Date") {
                       LookupValue = lookupTable.getAutoCompleteOutputDate(configuration.data.lookupTable.LookupValue, autoCompleteAll);
                     } else if (configuration.data.lookupTable.LookupType === "Number") {
                       LookupValue = lookupTable.getAutoCompleteNumber(configuration.data.lookupTable.LookupValue, autoCompleteAll);
                     }
                     if (configuration.data.lookupTable.TableName) {
                       const dataType = configuration.data.lookupTable.LookupType;
                       this.lookupService
                         .getLookup(configuration.data.lookupTable.TableName)
                         .snapshotChanges()
                         .map(changes => {
                           return changes.map(c => ({
                             key: c.payload.key,
                             ...c.payload.val()
                           }));
                         })
                         .subscribe(lookups => {
                           let returnValue = "";
                           if (configuration.data.lookupTable.LookupType === "Number") {
                             let closest = 79228162514264337593543950335;
                             let minDifference = 79228162514264337593543950335;
                             const DecimalLookupValue = Number(LookupValue);
                             let outputRowNo = 0;
                             let RowNo = 0;
                             lookups[0].lookup.forEach(
                               element => {
                                 let deciParsed = Number(
                                   element[0]
                                 );
                                 if (
                                   isNaN(Number(element[0]))
                                 ) {
                                   deciParsed = 0;
                                 }
                                 const difference = Math.abs(
                                   deciParsed -
                                     DecimalLookupValue
                                 );
                                 if (
                                   minDifference > difference
                                 ) {
                                   minDifference = Number(
                                     difference
                                   );
                                   closest = deciParsed;
                                   outputRowNo = RowNo;
                                 }
                                 RowNo++;
                               }
                             );
                             const lookupRow = lookups[0].lookup[outputRowNo];
                             returnValue = lookupRow[configuration.data.lookupTable.ColumnNo];
                           } else if (configuration.data.lookupTable.LookupType === "Date") {
                             const date = moment(LookupValue, "DD/MM/YYYY", true);
                             let lookupDate: Date;
                             if (date.isValid() === true) {
                               lookupDate = date.toDate();
                             }
                             const lookupDateticks = lookupDate.getTime() * 10000 + 621355968000000000;
                             let lookupsDate = lookups[0].lookup[0];
                             lookupsDate = lookupsDate[0];
                             const minDate = moment(lookupsDate, "DD/MM/YYYY", true);
                             let minDate1: Date;
                             if (minDate.isValid() === true) {
                               minDate1 = minDate.toDate();
                             }
                             const minDateTicks = minDate1.getTime() * 10000 + 621355968000000000;
                             let min = Math.abs(lookupDateticks - minDateTicks);
                             let diff;
                             let closestDate: Date;
                             let outputRowNo = 0;
                             let RowNo = 0;
                             lookups[0].lookup.forEach(
                               element => {
                                 const date2 = moment(
                                   element[0],
                                   "DD/MM/YYYY",
                                   true
                                 );
                                 let returnDate: Date;
                                 if (
                                   date2.isValid() === true
                                 ) {
                                   returnDate = date2.toDate();
                                 }
                                 const returnDateticks =
                                   returnDate.getTime() *
                                     10000 +
                                   621355968000000000;
                                 diff = Math.abs(
                                   lookupDateticks -
                                     returnDateticks
                                 );
                                 if (diff < min) {
                                   min = diff;
                                   closestDate = returnDate;
                                   outputRowNo = RowNo;
                                 }
                                 RowNo++;
                               }
                             );
                             const lookupRow = lookups[0].lookup[outputRowNo];
                             returnValue = lookupRow[configuration.data.lookupTable.ColumnNo];
                           } else {
                             let outputRowNo = 0;
                             let RowNo = 0;
                             lookups[0].lookup.forEach(
                               element => {
                                 if (
                                   LookupValue === element[0]
                                 ) {
                                   outputRowNo = RowNo;
                                 }
                                 RowNo++;
                               }
                             );
                             const lookupRow = lookups[0].lookup[outputRowNo];
                             returnValue = lookupRow[configuration.data.lookupTable.ColumnNo];
                           }
                           configuration.data.output = returnValue;
                           this.CalculationConfigurationComponent.setRowOuput(configuration.id, configuration.data, true);
                         });
                     }
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
              this.calcService
                .getDistanceMatrix(Origin, Destination)
                // .do(data => {
                //   console.log(data);
                // });
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
