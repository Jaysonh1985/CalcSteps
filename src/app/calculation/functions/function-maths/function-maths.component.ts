import { Component, OnInit, Input } from "@angular/core";
import * as mathJs from "mathjs";
import { CalculationConfiguration } from "../../shared/models/calculation-configuration";
export class Maths {
  bracketOpen: string;
  input1: string;
  functionType: string;
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
    this.maths.functionType = "";
    this.maths.input2 = "";
    this.maths.bracketClose = "";
    this.maths.nextFunction = "";
  }
  onAddRow() {
    this.selectedRow[0].maths.push(this.maths);
  }
  onDeleteRow(index) {
    this.selectedRow[0].maths.splice(index, 1);
  }
  ngOnInit() {
    if (this.selectedRow[0].maths == null) {
      this.selectedRow[0].maths = [this.maths];
    }
  }
  convertFunctionType(functionType): any {}
  public calculate(maths): any {
    let mathString = "";
    maths.forEach(function(column) {
      const bracketOpen = column.bracketOpen;
      const input1 = column.input1;
      let functionType = column.function;
      if ((functionType = "add")) {
        functionType = "+";
      } else if ((functionType = "subtract")) {
        functionType = "-";
      } else if ((functionType = "multiply")) {
        functionType = "*";
      } else if ((functionType = "divide")) {
        functionType = "/";
      }
      const input2 = column.input2;
      const bracketClose = column.bracketClose;
      let nextFunction = column.nextFunction;
      if (nextFunction === "add") {
        nextFunction = "+";
      } else if (nextFunction === "subtract") {
        nextFunction = "-";
      } else if (nextFunction === "multiply") {
        nextFunction = "*";
      } else if (nextFunction === "divide") {
        nextFunction = "/";
      } else if (nextFunction === "") {
        nextFunction = "";
      }
      mathString =
        mathString +
        bracketOpen +
        input1 +
        functionType +
        input2 +
        bracketClose +
        nextFunction;
    });
    return mathJs.eval(mathString);
  }
}
