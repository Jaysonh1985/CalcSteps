import { Component, OnInit, Input } from "@angular/core";
import * as moment from "moment";
import "moment/locale/pt-br";
import { CalculationError } from "../../shared/models/calculation-error";
export class DateAdjustment {
  type: string;
  date1: string;
  date2: string;
  periodType: string;
  period: string;
  adjustment: string;
  day: string;
  month: string;
}

@Component({
  selector: "app-function-date-adjustment",
  templateUrl: "./function-date-adjustment.component.html",
  styleUrls: ["./function-date-adjustment.component.css"]
})
export class FunctionDateAdjustmentComponent implements OnInit {
  @Input() selectedRow: any[];
  @Input() autoCompleteArray: any[];
  public dateAdjustment: DateAdjustment;
  public autoCompleteOptions: any[];
  public errorArray: CalculationError[];
  constructor() {
    const dateAdjustment = new DateAdjustment();
    dateAdjustment.adjustment = "";
    dateAdjustment.type = "";
    dateAdjustment.date1 = "";
    dateAdjustment.date2 = "";
    dateAdjustment.day = "";
    dateAdjustment.month = "";
    dateAdjustment.period = "";
    dateAdjustment.periodType = "";
  }

  ngOnInit() {
    if (this.selectedRow[0].dateAdjustment == null) {
      this.selectedRow[0].dateAdjustment = this.dateAdjustment;
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
  private getAutoCompleteOutput(InputValue, array): any {
    let input = 0;
    const date = moment(InputValue, "DD/MM/YYYY", true);
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
  calculate(dateAdjustment, autoComplete): any {
    moment.locale("en-GB");
    const Date1 = this.getAutoCompleteOutput(
      dateAdjustment.date1,
      autoComplete
    );
    const Date2 = this.getAutoCompleteOutput(
      dateAdjustment.date2,
      autoComplete
    );
    if (dateAdjustment.type === "Add") {
      if (dateAdjustment.periodType === "Years") {
        return moment(Date1, "DD/MM/YYYY")
          .add(dateAdjustment.period, "y")
          .format("L");
      } else if (dateAdjustment.periodType === "Months") {
        return moment(Date1, "DD/MM/YYYY")
          .add(dateAdjustment.period, "M")
          .format("L");
      } else if (dateAdjustment.periodType === "Days") {
        return moment(Date1, "DD/MM/YYYY")
          .add(dateAdjustment.period, "d")
          .format("L");
      }
    } else if (dateAdjustment.type === "Subtract") {
      if (dateAdjustment.periodType === "Years") {
        return moment(Date1, "DD/MM/YYYY")
          .subtract(dateAdjustment.period, "y")
          .format("L");
      } else if (dateAdjustment.periodType === "Months") {
        return moment(Date1, "DD/MM/YYYY")
          .subtract(dateAdjustment.period, "M")
          .format("L");
      } else if (dateAdjustment.periodType === "Days") {
        return moment(Date1, "DD/MM/YYYY")
          .subtract(dateAdjustment.period, "d")
          .format("L");
      }
    } else if (dateAdjustment.type === "Earlier") {
      const date1 = moment(Date1, "DD/MM/YYYY");
      const date2 = moment(Date2, "DD/MM/YYYY");
      return moment.min(date1, date2).format("L");
    } else if (dateAdjustment.type === "Later") {
      const date1 = moment(Date1, "DD/MM/YYYY");
      const date2 = moment(Date2, "DD/MM/YYYY");
      return moment.max(date1, date2).format("L");
    } else if (dateAdjustment.type === "FirstDayMonth") {
      return moment(Date1, "DD/MM/YYYY")
        .startOf("month")
        .format("L");
    } else if (dateAdjustment.type === "LastDayMonth") {
      return moment(Date1, "DD/MM/YYYY")
        .endOf("month")
        .format("L");
    } else if (dateAdjustment.type === "Today") {
      return moment().format("L");
    }
    return "";
  }
  errorCheck(dateAdjustment, autoComplete): CalculationError[] {
    this.errorArray = [];
    if (!dateAdjustment.date1 && dateAdjustment.type !== "Today") {
      this.errorArray.push(
        this.createError(
          dateAdjustment,
          "Date 1 is missing and is a required field"
        )
      );
    }
    if (
      !dateAdjustment.date2 &&
      (dateAdjustment.type === "Earlier" ||
        dateAdjustment.type === "Later" ||
        dateAdjustment.type === "DatesBetween")
    ) {
      this.errorArray.push(
        this.createError(
          dateAdjustment,
          "Date 2 is missing and is a required field"
        )
      );
    }
    if (!dateAdjustment.type) {
      this.errorArray.push(
        this.createError(
          dateAdjustment,
          "Type is missing and is a required field"
        )
      );
    }
    if (
      (dateAdjustment.type === "Add" || dateAdjustment.type === "Subtract") &&
      !dateAdjustment.periodType
    ) {
      this.errorArray.push(
        this.createError(
          dateAdjustment,
          "Period Type is missing and is a required field"
        )
      );
    }
    if (dateAdjustment.type === "Adjust") {
      if (!dateAdjustment.adjustment) {
        this.errorArray.push(
          this.createError(
            dateAdjustment,
            "Adjustment Type is missing and is a required field"
          )
        );
      }
      if (!dateAdjustment.day) {
        this.errorArray.push(
          this.createError(
            dateAdjustment,
            "Day is missing and is a required field"
          )
        );
      }
      if (!dateAdjustment.month) {
        this.errorArray.push(
          this.createError(
            dateAdjustment,
            "Month is missing and is a required field"
          )
        );
      }
    }
    moment.locale("en-GB");

    if (dateAdjustment.type !== "Today") {
      const Date1 = this.getAutoCompleteOutput(
        dateAdjustment.date1,
        autoComplete
      );
      const a = moment(Date1, "DD/MM/YYYY", true);
      if (a.isValid() === false) {
        this.errorArray.push(
          this.createError(
            dateAdjustment,
            "Date 1 - Variable mismatch error - this could be a missing variable or a date in an incorrect format"
          )
        );
      }
    }
    if (
      dateAdjustment.type === "Earlier" ||
      dateAdjustment.type === "Later" ||
      dateAdjustment.type === "DatesBetween"
    ) {
      const Date2 = this.getAutoCompleteOutput(
        dateAdjustment.date2,
        autoComplete
      );
      const b = moment(Date2, "DD/MM/YYYY", true);
      if (b.isValid() === false) {
        this.errorArray.push(
          this.createError(
            dateAdjustment,
            "Date 2 - Variable mismatch error - this could be a missing variable or a date in an incorrect format"
          )
        );
      }
    }

    return this.errorArray;
  }
  createError(dateDuration, errorText): CalculationError {
    const error = new CalculationError();
    error.errorText = errorText;
    error.index = dateDuration.rowIndex;
    error.type = "Error";
    return error;
  }
}
