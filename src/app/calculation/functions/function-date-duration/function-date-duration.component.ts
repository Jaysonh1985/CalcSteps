import "moment/locale/pt-br";

import { Component, Input, OnInit } from "@angular/core";
import * as moment from "moment";
import { Observable } from "rxjs/observable";

import { CalculationError } from "../../shared/models/calculation-error";

export class DateDuration {
  type: string;
  date1: string;
  date2: string;
  inclusive: string;
  daysinyear: string;
  constructor(type, date1, date2, inclusive, daysinyear) {
    this.type = "";
    this.date1 = "";
    this.date2 = "";
    this.inclusive = "";
    this.daysinyear = "";
  }
}

@Component({
  selector: "app-function-date-duration",
  templateUrl: "./function-date-duration.component.html",
  styleUrls: ["./function-date-duration.component.css"]
})
export class FunctionDateDurationComponent implements OnInit {
  @Input() selectedRow: any[];
  @Input() autoCompleteArray: any[];
  public dateDuration: DateDuration;
  public autoCompleteOptions: any[];
  public errorArray: CalculationError[];
  public error: CalculationError;
  filteredOptions: Observable<string[]>;

  constructor() {}
  ngOnInit() {
    if (this.selectedRow[0].dateDuration == null) {
      this.selectedRow[0].dateDuration = this.dateDuration;
    }
    this.autoCompleteOptions = [];
    this.autoCompleteArray.forEach(element => {
      if (element.data.data === "Date") {
        if (element.data.name !== "") {
          const autoCompleteText = element.data.name;
          this.autoCompleteOptions.push(autoCompleteText);
        }
      }
    });
  }
  private getAutoCompleteOutputDate(InputValue, array): any {
    let input = 0;
    const date = moment(InputValue, "DD/MM/YYYY");
    if (date.isValid() === false) {
      input = InputValue;
      array.forEach(value => {
        if (value.data.name === InputValue && value.data.data === "Date") {
          input = value.data.output;
        }
      });
    } else {
      input = InputValue;
    }
    return input;
  }
  filterAutoComplete(val: string) {
    if (val) {
      const filterValue = val.toLowerCase();
      return this.autoCompleteOptions.filter(state =>
        state.toLowerCase().startsWith(filterValue)
      );
    }
    return this.autoCompleteOptions;
  }

  calculate(dateDuration, autoComplete): any {
    moment.locale("en-GB");
    const Date1 = this.getAutoCompleteOutputDate(
      dateDuration.date1,
      autoComplete
    );
    const Date2 = this.getAutoCompleteOutputDate(
      dateDuration.date2,
      autoComplete
    );
    const a = moment(Date1, "DD/MM/YYYY");
    const b = moment(Date2, "DD/MM/YYYY");
    if (dateDuration.type === "Years") {
      return b.diff(a, "years");
    } else if (dateDuration.type === "YearsFrac") {
      return b.diff(a, "years", true);
    } else if (dateDuration.type === "Months") {
      return b.diff(a, "months");
    } else if (dateDuration.type === "Days") {
      return b.diff(a, "days");
    }
    return "";
  }
  errorCheck(dateDuration, autoComplete): CalculationError[] {
    this.errorArray = [];
    if (!dateDuration.date1) {
      this.errorArray.push(
        new CalculationError(
          dateDuration.rowIndex,
          "Error",
          "Date 1 is missing and is a required field"
        )
      );
    }
    if (!dateDuration.date2) {
      this.errorArray.push(
        new CalculationError(
          dateDuration.rowIndex,
          "Error",
          "Date 2 is missing and is a required field"
        )
      );
    }
    if (!dateDuration.type) {
      this.errorArray.push(
        new CalculationError(
          dateDuration.rowIndex,
          "Error",
          "Type is missing and is a required field"
        )
      );
    }
    moment.locale("en-GB");
    const Date1 = this.getAutoCompleteOutputDate(
      dateDuration.date1,
      autoComplete
    );
    const Date2 = this.getAutoCompleteOutputDate(
      dateDuration.date2,
      autoComplete
    );
    const a = moment(Date1, "DD/MM/YYYY", true);
    const b = moment(Date2, "DD/MM/YYYY", true);
    if (a.isValid() === false) {
      this.errorArray.push(
        new CalculationError(
          dateDuration.rowIndex,
          "Error",
          "Date 1 - Variable mismatch error - this could be a missing variable or a date in an incorrect format"
        )
      );
    }
    if (b.isValid() === false) {
      this.errorArray.push(
        new CalculationError(
          dateDuration.rowIndex,
          "Error",
          "Date 2 - Variable mismatch error - this could be a missing variable or a date in an incorrect format"
        )
      );
    }
    return this.errorArray;
  }
}
