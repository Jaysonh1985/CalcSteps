import { Component, OnInit } from "@angular/core";
import * as moment from "moment";

@Component({
  selector: "app-function-date-adjustment",
  templateUrl: "./function-date-adjustment.component.html",
  styleUrls: ["./function-date-adjustment.component.css"]
})
export class FunctionDateAdjustmentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const c = moment([2007, 0, 29]);
    const d = moment([2006, 0, 28]);
    c.diff(d, "days");
  }

}
