import { Injectable } from "@angular/core";
import { FunctionMathsComponent } from "../../functions/function-maths/function-maths.component";
import { FunctionDateAdjustmentComponent } from "../../functions/function-date-adjustment/function-date-adjustment.component";
import { CalculationError } from "../models/calculation-error";
import { FunctionDateDurationComponent } from "../../functions/function-date-duration/function-date-duration.component";
import { FunctionIfLogicComponent } from "../../functions/function-if-logic/function-if-logic.component";
import { FunctionLookupTableComponent } from "../../functions/function-lookup-table/function-lookup-table.component";
import { FunctionDistanceComponent } from "../../functions/function-distance/function-distance.component";
import * as moment from "moment";
import "moment/locale/pt-br";
import { HttpParams, HttpClient } from "@angular/common/http";
import "rxjs/add/operator/first";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import { environment } from "../../../../environments/environment";
import { DragulaService } from "ng2-dragula";
import { FunctionNumberFunctionsComponent } from "../../functions/function-number-functions/function-number-functions.component";
import { FunctionTextFunctionsComponent } from "../../functions/function-text-functions/function-text-functions.component";
import { AutoCompleteService } from "./auto-complete.service";

@Injectable()
export class CalculateService {
  readonly api = `${environment.functionsURL}/app`;
  errorArray: any[];
  constructor(
    private http: HttpClient,
    private dragulaService: DragulaService,
    private autoCompleteService: AutoCompleteService
  ) {}

  async getDistanceMatrix(origin: string, destination: string): Promise<any> {
    let params = new HttpParams();
    params = params.set("Origin", origin.toString());
    params = params.set("Destination", destination.toString());
    const url = `${this.api}/distanceMatrix/`;
    return await this.http.get(url, { params }).toPromise();
  }

  async getLookupTableHttp(name: string): Promise<any> {
    let params = new HttpParams();
    params = params.set("Name", name.toString());
    const url = `${this.api}/lookupTable/`;
    return await this.http.get(url, { params }).toPromise();
  }

  async runDistanceCalculationPromise(
    row,
    autocomplete,
    authService,
    lookupService,
    calcService
  ): Promise<any> {
    const distance = new FunctionDistanceComponent(autocomplete);
    let Origin = "";
    if (row.distance.origin[0].type === "variable") {
      Origin = this.autoCompleteService.getText(
        row.distance.origin[0].name,
        autocomplete
      );
    }
    let Destination = "";
    if (row.distance.destination[0].type === "variable") {
      Destination = this.autoCompleteService.getText(
        row.distance.destination[0].name,
        autocomplete
      );
    }

    Origin = Origin.replace(" ", "+");
    Destination = Destination.replace(" ", "+");
    return await this.getDistanceMatrix(Origin, Destination).then(data => {
      return this.getDistanceCalculation(data);
    });
  }

  async runLookupCalculationPromise2(
    row,
    autocomplete,
    authService,
    lookupService,
    calcService
  ) {
    const lookupTable = new FunctionLookupTableComponent(
      authService,
      lookupService,
      this.autoCompleteService
    );
    let LookupValue: string;
    LookupValue = row.lookupTable.LookupValue[0].name;
    if (
      row.lookupTable.LookupType === "Date" &&
      row.lookupTable.LookupValue[0].type === "variable"
    ) {
      LookupValue = this.autoCompleteService.getDate(
        row.lookupTable.LookupValue[0].name,
        autocomplete
      );
    } else if (
      row.lookupTable.LookupType === "Number" &&
      row.lookupTable.LookupValue[0].type === "variable"
    ) {
      LookupValue = this.autoCompleteService.getNumber(
        row.lookupTable.LookupValue[0].name,
        autocomplete
      );
    } else if (
      row.lookupTable.LookupType === "Text" &&
      row.lookupTable.LookupValue[0].type === "variable"
    ) {
      LookupValue = this.autoCompleteService.getText(
        row.lookupTable.LookupValue[0].name,
        autocomplete
      );
    }
    if (row.lookupTable.TableName) {
      const dataType = row.lookupTable.LookupType;
      return await this.getLookupTableHttp(row.lookupTable.TableName).then(
        data => {
          return this.getLookupTableCalculation(row, LookupValue, data.lookup);
        }
      );
    }
  }

  runCalculation(
    row,
    autocomplete,
    authService,
    lookupService,
    calcService
  ): string {
    if (row.functionType === "Maths") {
      const math = new FunctionMathsComponent(
        this.dragulaService,
        this.autoCompleteService
      );
      return math.calculate(row.maths, autocomplete);
    } else if (row.functionType === "Date Adjustment") {
      const dateAdjustment = new FunctionDateAdjustmentComponent(
        this.autoCompleteService
      );
      return dateAdjustment.calculate(row.dateAdjustment, autocomplete);
    } else if (row.functionType === "Date Duration") {
      const dateDuration = new FunctionDateDurationComponent(
        this.autoCompleteService
      );
      return dateDuration.calculate(row.dateDuration, autocomplete);
    } else if (row.functionType === "If Logic") {
      const ifLogic = new FunctionIfLogicComponent(
        this.dragulaService,
        this.autoCompleteService
      );
      return ifLogic.calculate(row.ifLogic, autocomplete);
    } else if (row.functionType === "Number Functions") {
      const numberFunctions = new FunctionNumberFunctionsComponent(
        this.autoCompleteService
      );
      return numberFunctions.calculate(row.numberFunctions, autocomplete);
    } else if (row.functionType === "Text Functions") {
      const textFunctions = new FunctionTextFunctionsComponent(
        this.autoCompleteService
      );
      return textFunctions.calculate(row.textFunctions, autocomplete);
    }
    return "";
  }
  runCondition(row, autocomplete): boolean {
    let input: boolean;
    input = row.condition;
    autocomplete.forEach(value => {
      if (value.name === row.condition && value.data === "Logic") {
        input = value.output;
      }
    });
    if (row.condition === undefined) {
      row.condition = "";
    }
    if (row.condition === "") {
      return true;
    } else if (row.condition === "True") {
      return true;
    } else if (row.condition === "False") {
      return false;
    } else {
      if (input === true) {
        return true;
      } else {
        return false;
      }
    }
  }

  runError(row, autocomplete, authService, lookupService): CalculationError[] {
    this.errorArray = [];
    if (row.name === "") {
      this.errorArray.push(
        new CalculationError(row.rowIndex, "Error", "Row Name is missing")
      );
    }
    if (row.data === "") {
      this.errorArray.push(
        new CalculationError(row.rowIndex, "Error", "Row Data Type is missing")
      );
    }
    if (row.functionType === "") {
      this.errorArray.push(
        new CalculationError(
          row.rowIndex,
          "Error",
          "Row Function Type is missing"
        )
      );
      return this.errorArray;
    }
    if (row.functionType === "Maths") {
      const math = new FunctionMathsComponent(
        this.dragulaService,
        this.autoCompleteService
      );
      return this.errorArray.concat(math.errorCheck(row.maths, autocomplete));
    } else if (row.functionType === "Date Adjustment") {
      const dateAdjustment = new FunctionDateAdjustmentComponent(
        this.autoCompleteService
      );
      return this.errorArray.concat(
        dateAdjustment.errorCheck(row.dateAdjustment, autocomplete)
      );
    } else if (row.functionType === "Date Duration") {
      const dateDuration = new FunctionDateDurationComponent(
        this.autoCompleteService
      );
      return this.errorArray.concat(
        dateDuration.errorCheck(row.dateDuration, autocomplete)
      );
    } else if (row.functionType === "If Logic") {
      const ifLogic = new FunctionIfLogicComponent(
        this.dragulaService,
        this.autoCompleteService
      );
      return this.errorArray.concat(
        ifLogic.errorCheck(row.ifLogic, autocomplete)
      );
    } else if (row.functionType === "Distance") {
      const distance = new FunctionDistanceComponent(autocomplete);
      return this.errorArray.concat(
        distance.errorCheck(row.distance, autocomplete)
      );
    } else if (row.functionType === "Lookup Table") {
      const lookupTable = new FunctionLookupTableComponent(
        authService,
        lookupService,
        this.autoCompleteService
      );
      return this.errorArray.concat(
        lookupTable.errorCheck(row.lookupTable, autocomplete)
      );
    } else if (row.functionType === "Number Functions") {
      const numberFunctions = new FunctionNumberFunctionsComponent(
        this.autoCompleteService
      );
      return this.errorArray.concat(
        numberFunctions.errorCheck(row.numberFunctions, autocomplete)
      );
    } else if (row.functionType === "Text Functions") {
      const testFunctions = new FunctionTextFunctionsComponent(
        this.autoCompleteService
      );
      return this.errorArray.concat(
        testFunctions.errorCheck(row.textFunctions, autocomplete)
      );
    } else {
      return [];
    }
  }

  getDistanceCalculation(data): string {
    let rows = data["rows"];
    rows = rows[0];
    let elements = rows["elements"];
    elements = elements[0];
    let meters = elements["distance"];
    meters = meters["value"];
    let miles: Number;
    miles = Number(meters / 1609.34);
    return miles.toFixed(2);
  }

  getLookupTableCalculation(row, LookupValue, lookups): string {
    if (row.lookupTable.LookupType === "Number") {
      let closest = 79228162514264337593543950335;
      let minDifference = 79228162514264337593543950335;
      const DecimalLookupValue = Number(LookupValue);
      let outputRowNo = 0;
      let RowNo = 0;
      lookups.forEach(element => {
        let deciParsed = Number(element[0]);
        if (isNaN(Number(element[0]))) {
          deciParsed = 0;
        }
        const difference = Math.abs(deciParsed - DecimalLookupValue);
        if (minDifference > difference) {
          minDifference = Number(difference);
          closest = deciParsed;
          outputRowNo = RowNo;
        }
        RowNo++;
      });
      const lookupRow = lookups[outputRowNo];
      return lookupRow[row.lookupTable.ColumnNo];
    } else if (row.lookupTable.LookupType === "Date") {
      const date = moment(LookupValue, "DD/MM/YYYY", true);
      let lookupDate: Date;
      if (date.isValid() === true) {
        lookupDate = date.toDate();
      }
      const lookupDateticks = lookupDate.getTime() * 10000 + 621355968000000000;
      let lookupsDate = lookups[0];
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
      lookups.forEach(element => {
        const date2 = moment(element[0], "DD/MM/YYYY", true);
        let returnDate: Date;
        if (date2.isValid() === true) {
          returnDate = date2.toDate();
        }
        const returnDateticks =
          returnDate.getTime() * 10000 + 621355968000000000;
        diff = Math.abs(lookupDateticks - returnDateticks);
        if (diff < min) {
          min = diff;
          closestDate = returnDate;
          outputRowNo = RowNo;
        }
        RowNo++;
      });
      const lookupRow = lookups[outputRowNo];
      return lookupRow[row.lookupTable.ColumnNo];
    } else {
      let outputRowNo = 0;
      let RowNo = 0;
      lookups.forEach(element => {
        if (LookupValue === element[0]) {
          outputRowNo = RowNo;
        }
        RowNo++;
      });
      const lookupRow = lookups[outputRowNo];
      return lookupRow[row.lookupTable.ColumnNo];
    }
  }
}
