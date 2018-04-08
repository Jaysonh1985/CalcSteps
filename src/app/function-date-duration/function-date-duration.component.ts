import { Component, OnInit } from "@angular/core";
import * as moment from "moment";

@Component({
  selector: "app-function-date-duration",
  templateUrl: "./function-date-duration.component.html",
  styleUrls: ["./function-date-duration.component.css"]
})
export class FunctionDateDurationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const c = moment([2007, 0, 29]);
    const d = moment([2006, 0, 28]);
    c.diff(d, "days");
  }

}
