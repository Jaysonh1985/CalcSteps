import { Component, OnInit, Input } from "@angular/core";
import * as mathJs from "mathjs";
import { CalculationError } from "../../shared/models/calculation-error";
export class IfLogic {
  bracketOpen: string;
  input1: string;
  functionType: string;
  input2: string;
  bracketClose: string;
  nextFunction: string;
}
@Component({
  selector: "app-function-if-logic",
  templateUrl: "./function-if-logic.component.html",
  styleUrls: ["./function-if-logic.component.css"]
})
export class FunctionIfLogicComponent implements OnInit {
  errorArray: any[];
  @Input() selectedRow: any[];
  @Input() autoCompleteArray: any[];
  public ifLogic: IfLogic;
  public autoCompleteOptions: any[];
  constructor() {
    this.ifLogic = new IfLogic();
    this.ifLogic.bracketOpen = "";
    this.ifLogic.input1 = "";
    this.ifLogic.functionType = "";
    this.ifLogic.input2 = "";
    this.ifLogic.bracketClose = "";
    this.ifLogic.nextFunction = "";
  }
  onAddRow() {
    this.ifLogic = new IfLogic();
    this.ifLogic.bracketOpen = "";
    this.ifLogic.input1 = "";
    this.ifLogic.functionType = "";
    this.ifLogic.input2 = "";
    this.ifLogic.bracketClose = "";
    this.ifLogic.nextFunction = "";
    this.selectedRow[0].ifLogic.push(this.ifLogic);
  }
  onDeleteRow(index) {
    this.selectedRow[0].maths.splice(index, 1);
  }
  ngOnInit() {
    if (this.selectedRow[0].ifLogic == null) {
      this.selectedRow[0].ifLogic = [this.ifLogic];
    }
    this.autoCompleteOptions = [];
    this.autoCompleteArray.forEach(element => {
      if (element.data.name !== "") {
        const autoCompleteText = element.data.name;
          this.autoCompleteOptions.push(autoCompleteText);
      }
    });
  }
  private getAutoCompleteOutput(InputValue, array): any {
    let input = 0;
    if (isNaN(Number(InputValue))) {
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
    if (functionType === "=") {
      return "==";
    } else if (functionType === "NotEqual") {
      return "!=";
    } else if (functionType === "Greater") {
      return ">";
    } else if (functionType === "GreaterEqual") {
      return ">=";
    } else if (functionType === "Less") {
      return "<";
    } else if (functionType === "LessEqual") {
      return "<=";
    }
  }
  public calculate(maths, autoComplete): any {
    let ifLogicString = "";
    maths.forEach(column => {
      const input1 = this.getAutoCompleteOutput(column.input1, autoComplete);
      const bracketOpen = column.bracketOpen;
      const functionType = this.getFunctionType(column.functionType);
      const input2 = this.getAutoCompleteOutput(column.input2, autoComplete);
      const bracketClose = column.bracketClose;
      const nextFunction = " " + column.nextFunction + " ";
      ifLogicString =
        ifLogicString +
        bracketOpen +
        input1 +
        functionType +
        input2 +
        bracketClose +
        nextFunction;
    });
    return mathJs.eval(ifLogicString);
  }
  errorCheck(ifLogic, autoComplete): CalculationError[] {
    this.errorArray = [];
    let paramCounter = 0;
    let LBcounter = 0;
    let RBcounter = 0;
    const mathsLength = ifLogic.length - 1;
    ifLogic.forEach(column => {
      if (!column.input1) {
        this.errorArray.push(
          this.createError(ifLogic, "Input 1 is missing and is a required field")
        );
      }
      if (!column.input2) {
        this.errorArray.push(
          this.createError(ifLogic, "Input 2 is missing and is a required field")
        );
      }
      if (!column.functionType) {
        this.errorArray.push(
          this.createError(ifLogic, "Function is missing and is a required field")
        );
      }
      if (column.bracketOpen === "(") {
        LBcounter = LBcounter + 1;
      }
      if (column.bracketClose === ")") {
        RBcounter = RBcounter + 1;
      }
      if (
        paramCounter === mathsLength &&
        column.nextFunction !== "" &&
        column.nextFunction !== "na"
      ) {
        this.errorArray.push(
          this.createError(ifLogic, "Next row logic on row with no next row")
        );
      }
      if (paramCounter < mathsLength && ifLogic[paramCounter + 1]) {
        if (column.nextFunction === "" || column.nextFunction === "na") {
          this.errorArray.push(
            this.createError(ifLogic, "Next row logic missing")
          );
        }
      }
      paramCounter = paramCounter + 1;
    });
    if (LBcounter > RBcounter) {
      this.errorArray.push(this.createError(ifLogic, "Brackets not closed"));
    } else if (LBcounter < RBcounter) {
      this.errorArray.push(this.createError(ifLogic, "Brackets not open"));
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
