import { Component, OnInit, Input } from "@angular/core";
import * as moment from "moment";
export class DateDuration {
  type: string;
  date1: string;
  date2: string;
  inclusive: string;
  daysinyear: string;
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
  constructor() {
    const dateDuration = new DateDuration();
    dateDuration.type = "";
    dateDuration.date1 = "";
    dateDuration.date2 = "";
    dateDuration.inclusive = "";
    dateDuration.daysinyear = "";
  }

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
}
