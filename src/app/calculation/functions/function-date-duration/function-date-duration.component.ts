import "moment/locale/pt-br";

import { Component, Input, OnInit } from "@angular/core";
import * as moment from "moment";
import { Observable } from "rxjs/Observable";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

import { CalculationError } from "../../shared/models/calculation-error";
import { DragulaService } from "ng2-dragula";
import { Chip } from "../../shared/models/chip";
import { DragAndDropModule } from "angular-draggable-droppable";
import { FormControl } from "@angular/forms";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material/core";

export class DateDuration {
  type: string;
  date1: string[];
  date2: string[];
  inclusive: string;
  daysinyear: string;
  constructor(type, date1, date2, inclusive, daysinyear) {
    this.type = "";
    this.date1 = [];
    this.date2 = [];
    this.inclusive = "";
    this.daysinyear = "";
  }
}

@Component({
  selector: "app-function-date-duration",
  templateUrl: "./function-date-duration.component.html",
  styleUrls: ["./function-date-duration.component.css"],
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
export class FunctionDateDurationComponent implements OnInit {
  @Input()
  selectedRow: any[];
  @Input()
  autoCompleteArray: any[];
  public dateDuration: DateDuration;
  public autoCompleteOptions: any[];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  public errorArray: CalculationError[];
  public error: CalculationError;
  filteredOptions: Observable<string[]>;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  droppedData: string;

  constructor() {}
  ngOnInit() {
    if (this.selectedRow[0].dateDuration == null) {
      this.selectedRow[0].dateDuration = this.dateDuration;
    }
    if (this.selectedRow[0].dateDuration.date1 == null) {
      this.selectedRow[0].dateDuration.date1 = [];
    }
    if (this.selectedRow[0].dateDuration.date2 == null) {
      this.selectedRow[0].dateDuration.date2 = [];
    }
    this.autoCompleteOptions = [];
    this.autoCompleteArray.forEach(element => {
      if (element.data.data === "Date") {
        if (element.data.name !== "") {
          this.autoCompleteOptions.push({
            name: element.data.name,
            type: "variable",
            datatype: "date"
          });
        }
      }
    });
  }
  onDate1Drop(data: any) {
    // Get the dropped data here
    this.selectedRow[0].dateDuration.date1 = [];
    this.selectedRow[0].dateDuration.date1.push({
      name: data.dragData.name,
      type: data.dragData.type,
      datatype: data.dragData.datatype
    });
  }
  onDate2Drop(data: any) {
    // Get the dropped data here
    this.selectedRow[0].dateDuration.date2 = [];
    this.selectedRow[0].dateDuration.date2.push({
      name: data.dragData.name,
      type: data.dragData.type,
      datatype: data.dragData.datatype
    });
  }
  removeDates1() {
    this.selectedRow[0].dateDuration.date1 = [];
  }
  removeDates2() {
    this.selectedRow[0].dateDuration.date2 = [];
  }
  addEventDate1(type: string, event: MatDatepickerInputEvent<Date>) {
    moment.locale("en-GB");
    this.selectedRow[0].dateDuration.date1 = [];
    this.selectedRow[0].dateDuration.date1.push({
      name: moment(event.value).format("DD/MM/YYYY"),
      type: "date",
      datatype: ""
    });
  }
  addEventDate2(type: string, event: MatDatepickerInputEvent<Date>) {
    moment.locale("en-GB");
    this.selectedRow[0].dateDuration.date2 = [];
    this.selectedRow[0].dateDuration.date2.push({
      name: moment(event.value).format("DD/MM/YYYY"),
      type: "date",
      datatype: ""
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

  calculate(dateDuration, autoComplete): any {
    moment.locale("en-GB");
    let Date1 = dateDuration.date1[0].name;
    if (dateDuration.date1[0].type === "variable") {
      Date1 = this.getAutoCompleteOutputDate(
        dateDuration.date1[0].name,
        autoComplete
      );
    }

    let Date2 = dateDuration.date2[0].name;
    if (dateDuration.date2[0].type === "variable") {
      Date2 = this.getAutoCompleteOutputDate(
        dateDuration.date2[0].name,
        autoComplete
      );
    }

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
    if (dateDuration.date1.length === 0) {
      this.errorArray.push(
        new CalculationError(
          dateDuration.rowIndex,
          "Error",
          "Date 1 is missing and is a required field"
        )
      );
    }
    if (dateDuration.date2.length === 0) {
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
    let Date1 = dateDuration.date1[0].name;
    if (dateDuration.date1[0].type === "variable") {
      Date1 = this.getAutoCompleteOutputDate(
        dateDuration.date1[0].name,
        autoComplete
      );
    }

    let Date2 = dateDuration.date2[0].name;
    if (dateDuration.date2[0].type === "variable") {
      Date2 = this.getAutoCompleteOutputDate(
        dateDuration.date2[0].name,
        autoComplete
      );
    }

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
