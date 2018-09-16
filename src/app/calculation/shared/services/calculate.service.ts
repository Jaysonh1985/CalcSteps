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

@Injectable()
export class CalculateService {
  readonly api = `${environment.functionsURL}/app`;
  constructor(private http: HttpClient, private dragulaService: DragulaService) {}

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
    const distance = new FunctionDistanceComponent(calcService);
    let Origin = "";
    if (row.data.distance.origin[0].type === "variable") {
       Origin = distance.getAutoCompleteOutput(
        row.data.distance.origin[0].name,
        autocomplete
      );
    }
    let Destination = "";
    if (row.data.distance.destination[0].type === "variable") {
      Destination = distance.getAutoCompleteOutput(
        row.data.distance.destination[0].name,
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
      lookupService
    );
    let LookupValue: string;
    LookupValue = row.data.lookupTable.LookupValue;
    if (row.data.lookupTable.LookupType === "Date") {
      LookupValue = lookupTable.getAutoCompleteOutputDate(
        row.data.lookupTable.LookupValue,
        autocomplete
      );
    } else if (row.data.lookupTable.LookupType === "Number") {
      LookupValue = lookupTable.getAutoCompleteNumber(
        row.data.lookupTable.LookupValue,
        autocomplete
      );
    }
    if (row.data.lookupTable.TableName) {
      const dataType = row.data.lookupTable.LookupType;
      return await this.getLookupTableHttp(row.data.lookupTable.TableName).then(
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
    if (row.data.functionType === "Maths") {
      const math = new FunctionMathsComponent(this.dragulaService);
      return math.calculate(row.data.maths, autocomplete);
    } else if (row.data.functionType === "Date Adjustment") {
      const dateAdjustment = new FunctionDateAdjustmentComponent();
      return dateAdjustment.calculate(row.data.dateAdjustment, autocomplete);
    } else if (row.data.functionType === "Date Duration") {
      const dateDuration = new FunctionDateDurationComponent();
      return dateDuration.calculate(row.data.dateDuration, autocomplete);
    } else if (row.data.functionType === "If Logic") {
      const ifLogic = new FunctionIfLogicComponent();
      return ifLogic.calculate(row.data.ifLogic, autocomplete);
    }
    return "";
  }
  runCondition(row, autocomplete): boolean {
    let input: boolean;
    input = row.data.condition;
    autocomplete.forEach(value => {
      if (value.data.name === row.data.condition) {
        input = value.data.output;
      }
    });
    if (row.data.condition === undefined) {
      row.data.condition = "";
    }
    if (row.data.condition === "") {
      return true;
    } else if (
      row.data.condition === "true" ||
      row.data.condition === "True" ||
      row.data.condition === "TRUE"
    ) {
      return true;
    } else if (
      row.data.condition === "false" ||
      row.data.condition === "False" ||
      row.data.condition === "FALSE"
    ) {
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
    if (row.data.functionType === "Maths") {
      const math = new FunctionMathsComponent(this.dragulaService);
      return math.errorCheck(row.data.maths, autocomplete);
    } else if (row.data.functionType === "Date Adjustment") {
      const dateAdjustment = new FunctionDateAdjustmentComponent();
      return dateAdjustment.errorCheck(row.data.dateAdjustment, autocomplete);
    } else if (row.data.functionType === "Date Duration") {
      const dateDuration = new FunctionDateDurationComponent();
      return dateDuration.errorCheck(row.data.dateDuration, autocomplete);
    } else if (row.data.functionType === "If Logic") {
      const ifLogic = new FunctionIfLogicComponent();
      return ifLogic.errorCheck(row.data.ifLogic, autocomplete);
    } else if (row.data.functionType === "Lookup Table") {
      const lookupTable = new FunctionLookupTableComponent(
        authService,
        lookupService
      );
      return lookupTable.errorCheck(row.data.lookupTable, autocomplete);
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
    if (row.data.lookupTable.LookupType === "Number") {
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
      return lookupRow[row.data.lookupTable.ColumnNo];
    } else if (row.data.lookupTable.LookupType === "Date") {
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
      return lookupRow[row.data.lookupTable.ColumnNo];
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
      return lookupRow[row.data.lookupTable.ColumnNo];
    }
  }
}
