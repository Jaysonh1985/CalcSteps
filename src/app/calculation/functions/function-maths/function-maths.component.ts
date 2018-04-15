import { Component, OnInit, Input } from "@angular/core";
import * as mathJs from "mathjs";
import { CalculationConfiguration } from "../../shared/models/calculation-configuration";
export class Maths {
  bracketOpen: string;
  input1: string;
  function: string;
  input2: string;
  bracketClose: string;
  nextFunction: string;
}

@Component({
  selector: "app-function-maths",
  templateUrl: "./function-maths.component.html",
  styleUrls: ["./function-maths.component.css"]
})
export class FunctionMathsComponent implements OnInit {
  @Input() selectedRow: CalculationConfiguration;
  public maths: Maths;

  constructor() {
    this.maths = new Maths();
    this.maths.bracketOpen = "";
    this.maths.input1 = "";
    this.maths.function = "";
    this.maths.input2 = "";
    this.maths.bracketClose = "";
  }

  ngOnInit() {
    if (this.selectedRow[0].maths == null) {
      this.selectedRow[0].maths = [this.maths];
    }
  }
}
