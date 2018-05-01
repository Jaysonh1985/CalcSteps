import { Component, OnInit, Input, ViewChild } from "@angular/core";
import * as mathJs from "mathjs";
import { CalculationConfiguration } from "../../shared/models/calculation-configuration";
import { CalculationInputComponent } from "../../calculation-input/calculation-input.component";
import { CalculationOutputComponent } from "../../calculation-output/calculation-output.component";
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
  @ViewChild(CalculationInputComponent)
  private CalculationInputComponent: CalculationInputComponent;
  @ViewChild(CalculationOutputComponent)
  private CalculationOutputComponent: CalculationOutputComponent;
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
  private getAutoCompleteOutput(InputValue, array): any {
    const InputCheck = mathJs.typeof(InputValue);
    let input = 0;
    if (InputCheck === "string") {
      input = InputValue;
      array.forEach(value => {
        if (value.data.name === InputValue) {
          input = value.data.output;
        }
      });
    } else {
      input = InputValue;
    }
    return input;
  }
  private getFunctionType(functionType): any {
    if (functionType === "add") {
      return "+";
    } else if (functionType === "subtract") {
      return "-";
    } else if (functionType === "multiply") {
      return "*";
    } else if (functionType === "divide") {
      return "/";
    } else if (functionType === "") {
      return "";
    }
  }
  public calculate(maths, autoComplete): any {
    let mathString = "";
    maths.forEach(column => {
      const input1 = this.getAutoCompleteOutput(column.input1, autoComplete);
      const bracketOpen = column.bracketOpen;
      const functionType = this.getFunctionType(column.functionType);
      const input2 = this.getAutoCompleteOutput(column.input2, autoComplete);
      const bracketClose = column.bracketClose;
      const nextFunction = this.getFunctionType(column.nextFunction);
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
