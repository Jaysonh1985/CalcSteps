import { Component, OnInit, Input } from "@angular/core";
import * as moment from "moment";

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
  constructor() {}

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
}
