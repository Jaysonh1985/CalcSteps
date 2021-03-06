import { Component, OnInit, Input } from "@angular/core";
import * as moment from "moment";
import "moment/locale/pt-br";
import { CalculationError } from "../../shared/models/calculation-error";
import { Observable } from "rxjs";
import { MatChipInputEvent, MatDatepickerInputEvent } from "@angular/material";
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material/core";
import { AutoCompleteService } from "../../shared/services/auto-complete.service";

export class DateAdjustment {
  type: string;
  date1: string[];
  date2: string[];
  periodType: string;
  period: string[];
  adjustment: string;
  day: string[];
  month: string[];
  constructor(adjustment, type, date1, date2, day, month, period, periodType) {
    this.adjustment = "";
    this.type = "";
    this.date1 = [];
    this.date2 = [];
    this.day = [];
    this.month = [];
    this.period = [];
    this.periodType = "";
  }
}

@Component({
  selector: "app-function-date-adjustment",
  templateUrl: "./function-date-adjustment.component.html",
  styleUrls: ["./function-date-adjustment.component.css"],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class FunctionDateAdjustmentComponent implements OnInit {
  @Input()
  selectedRow: any[];
  @Input()
  autoCompleteArray: any[];
  public dateAdjustment: DateAdjustment;
  public autoCompleteOptionsNumber: any[];
  public autoCompleteOptionsText: any[];
  public autoCompleteOptionsDate: any[];
  public errorArray: CalculationError[];
  constructor(private _autoCompleteService: AutoCompleteService) {}
  filteredOptions: Observable<string[]>;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  droppedData: string;
  ngOnInit() {
    if (this.selectedRow[0].dateAdjustment == null) {
      this.selectedRow[0].dateAdjustment = this.dateAdjustment;
    }
    if (this.selectedRow[0].dateAdjustment.date1 == null) {
      this.selectedRow[0].dateAdjustment.date1 = [];
    }
    if (this.selectedRow[0].dateAdjustment.date2 == null) {
      this.selectedRow[0].dateAdjustment.date2 = [];
    }
    if (this.selectedRow[0].dateAdjustment.period == null) {
      this.selectedRow[0].dateAdjustment.period = [];
    }
    this.autoCompleteOptionsNumber = [];
    this.autoCompleteOptionsDate = [];
    this.autoCompleteOptionsDate = this._autoCompleteService.getAutoCompleteArray(
      this.autoCompleteArray,
      "Date"
    );
    this.autoCompleteOptionsNumber = this._autoCompleteService.getAutoCompleteArray(
      this.autoCompleteArray,
      "Number"
    );
  }
  removeChip(array, field) {
    if (field === "date1") {
      this.selectedRow[0].dateAdjustment.date1 = [];
    } else if (field === "date2") {
      this.selectedRow[0].dateAdjustment.date2 = [];
    } else if (field === "period") {
      this.selectedRow[0].dateAdjustment.period = [];
    }
  }
  dropChip(array, field) {
    if (field === "date1" && array[0].datatype === "Date") {
      this.selectedRow[0].dateAdjustment.date1 = [];
      this.selectedRow[0].dateAdjustment.date1 = array;
    } else if (field === "date2" && array[0].datatype === "Date") {
      this.selectedRow[0].dateAdjustment.date2 = [];
      this.selectedRow[0].dateAdjustment.date2 = array;
    } else if (field === "period" && array[0].datatype === "Number") {
      this.selectedRow[0].dateAdjustment.period = [];
      this.selectedRow[0].dateAdjustment.period = array;
    }
  }

  calculate(dateAdjustment, autoComplete): any {
    moment.locale("en-GB");
    let Date1 = dateAdjustment.date1[0].name;
    if (dateAdjustment.date1[0].type === "variable") {
      Date1 = this._autoCompleteService.getDate(
        dateAdjustment.date1[0].name,
        autoComplete
      );
    }
    let Date2 = dateAdjustment.date2[0].name;
    if (dateAdjustment.date2[0].type === "variable") {
      Date2 = this._autoCompleteService.getDate(
        dateAdjustment.date2[0].name,
        autoComplete
      );
    }
    if (dateAdjustment.type === "Add" || dateAdjustment.type === "Subtract") {
      let Period = dateAdjustment.period[0].name;
      if (dateAdjustment.period[0].type === "variable") {
        Period = this._autoCompleteService.getNumber(
          dateAdjustment.period[0].name,
          autoComplete
        );
      }
      if (dateAdjustment.type === "Add") {
        if (dateAdjustment.periodType === "Years") {
          return moment(Date1, "DD/MM/YYYY")
            .add(Period, "y")
            .format("L");
        } else if (dateAdjustment.periodType === "Months") {
          return moment(Date1, "DD/MM/YYYY")
            .add(Period, "M")
            .format("L");
        } else if (dateAdjustment.periodType === "Days") {
          return moment(Date1, "DD/MM/YYYY")
            .add(Period, "d")
            .format("L");
        }
      } else if (dateAdjustment.type === "Subtract") {
        if (dateAdjustment.periodType === "Years") {
          return moment(Date1, "DD/MM/YYYY")
            .subtract(Period, "y")
            .format("L");
        } else if (dateAdjustment.periodType === "Months") {
          return moment(Date1, "DD/MM/YYYY")
            .subtract(Period, "M")
            .format("L");
        } else if (dateAdjustment.periodType === "Days") {
          return moment(Date1, "DD/MM/YYYY")
            .subtract(Period, "d")
            .format("L");
        }
      }
    } else {
      if (dateAdjustment.type === "Earlier") {
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
    }
    return "";
  }
  errorCheck(dateAdjustment, autoComplete): CalculationError[] {
    this.errorArray = [];
    if (dateAdjustment.date1.length === 0 && dateAdjustment.type !== "Today") {
      this.errorArray.push(
        new CalculationError(
          dateAdjustment.rowIndex,
          "Error",
          "Date 1 is missing and is a required field"
        )
      );
    }
    if (
      dateAdjustment.date2.length === 0 &&
      (dateAdjustment.type === "Earlier" ||
        dateAdjustment.type === "Later" ||
        dateAdjustment.type === "DatesBetween")
    ) {
      this.errorArray.push(
        new CalculationError(
          dateAdjustment.rowIndex,
          "Error",
          "Date 2 is missing and is a required field"
        )
      );
    }
    if (!dateAdjustment.type) {
      this.errorArray.push(
        new CalculationError(
          dateAdjustment.rowIndex,
          "Error",
          "Type is missing and is a required field"
        )
      );
    }
    if (
      (dateAdjustment.type === "Add" || dateAdjustment.type === "Subtract") &&
      !dateAdjustment.periodType
    ) {
      this.errorArray.push(
        new CalculationError(
          dateAdjustment.rowIndex,
          "Error",
          "Period Type is missing and is a required field"
        )
      );
    }
    if (
      (dateAdjustment.type === "Add" || dateAdjustment.type === "Subtract") &&
      dateAdjustment.period.length === 0
    ) {
      this.errorArray.push(
        new CalculationError(
          dateAdjustment.rowIndex,
          "Error",
          "Period is missing and is a required field"
        )
      );
    }
    if (dateAdjustment.type === "Adjust") {
      if (!dateAdjustment.adjustment) {
        this.errorArray.push(
          new CalculationError(
            dateAdjustment.rowIndex,
            "Error",
            "Adjustment Type is missing and is a required field"
          )
        );
      }
      if (!dateAdjustment.day) {
        this.errorArray.push(
          new CalculationError(
            dateAdjustment.rowIndex,
            "Error",
            "Day is missing and is a required field"
          )
        );
      }
      if (!dateAdjustment.month) {
        this.errorArray.push(
          new CalculationError(
            dateAdjustment.rowIndex,
            "Error",
            "Month is missing and is a required field"
          )
        );
      }
    }
    moment.locale("en-GB");
    if (dateAdjustment.type !== "Today" && dateAdjustment.date1.length > 0) {
      let Date1 = dateAdjustment.date1[0].name;
      if (dateAdjustment.date1[0].type === "variable") {
        Date1 = this._autoCompleteService.getDate(
          dateAdjustment.date1[0].name,
          autoComplete
        );
      }
      const a = moment(Date1, "DD/MM/YYYY", true);
      if (a.isValid() === false) {
        this.errorArray.push(
          new CalculationError(
            dateAdjustment.rowIndex,
            "Error",
            "Date 1 - Variable mismatch error - this could be a missing variable or a date in an incorrect format"
          )
        );
      }
    }
    if (
      (dateAdjustment.type === "Earlier" ||
        dateAdjustment.type === "Later" ||
        dateAdjustment.type === "DatesBetween") &&
      dateAdjustment.date2.length > 0
    ) {
      let Date2 = dateAdjustment.date2[0].name;
      if (dateAdjustment.date2[0].type === "variable") {
        Date2 = this._autoCompleteService.getDate(
          dateAdjustment.date2[0].name,
          autoComplete
        );
      }
      const b = moment(Date2, "DD/MM/YYYY", true);
      if (b.isValid() === false) {
        this.errorArray.push(
          new CalculationError(
            dateAdjustment.rowIndex,
            "Error",
            "Date 2 - Variable mismatch error - this could be a missing variable or a date in an incorrect format"
          )
        );
      }
    }
    if (
      (dateAdjustment.type === "Add" || dateAdjustment.type === "Subtract") &&
      dateAdjustment.period.length > 0
    ) {
      let Period = dateAdjustment.period[0].name;
      if (dateAdjustment.period[0].type === "variable") {
        Period = this._autoCompleteService.getNumber(
          dateAdjustment.period[0].name,
          autoComplete
        );
      }
      if (isNaN(Number(Period))) {
        this.errorArray.push(
          new CalculationError(
            dateAdjustment.rowIndex,
            "Error",
            Period +
              " - Variable mismatch error - this could be a missing variable or a number in an incorrect format"
          )
        );
      }
    }
    return this.errorArray;
  }
}
