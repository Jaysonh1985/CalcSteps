import { Component, Input, OnInit } from "@angular/core";
import * as expeval from "expr-eval";
import { Observable } from "rxjs";

import { CalculationError } from "../../shared/models/calculation-error";

export class IfLogic {
  bracketOpen: string;
  input1: string;
  functionType: string;
  input2: string;
  bracketClose: string;
  nextFunction: string;
  constructor(
    bracketOpen,
    input1,
    functionType,
    input2,
    bracketClose,
    nextFunction
  ) {
    this.bracketOpen = "";
    this.input1 = "";
    this.functionType = "";
    this.input2 = "";
    this.bracketClose = "";
    this.nextFunction = "";
  }
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
  filteredOptions: Observable<string[]>;
  constructor() {}
  onAddRow() {
    this.selectedRow[0].ifLogic.push(new IfLogic("", "", "", "", "", ""));
  }
  onDeleteRow(index) {
    this.selectedRow[0].ifLogic.splice(index, 1);
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
  filterAutoComplete(val: string) {
    if (val) {
      const filterValue = val.toLowerCase();
      const filteredResults = this.autoCompleteOptions.filter(state =>
        state.toLowerCase().startsWith(filterValue)
      );
      return filteredResults;
    }
    return this.autoCompleteOptions;
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
        "'" +
        input1 +
        "'" +
        functionType +
        "'" +
        input2 +
        "'" +
        bracketClose +
        nextFunction;
    });
    const Parser = expeval.Parser;
    const parser = new Parser();
    const expr = parser.parse(ifLogicString);
    return expr.evaluate();
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
          new CalculationError(
            ifLogic.rowIndex,
            "Error",
            "Input 1 is missing and is a required field"
          )
        );
      }
      if (!column.input2) {
        this.errorArray.push(
          new CalculationError(
            ifLogic.rowIndex,
            "Error",
            "Input 2 is missing and is a required field"
          )
        );
      }
      if (!column.functionType) {
        this.errorArray.push(
          new CalculationError(
            ifLogic.rowIndex,
            "Error",
            "Function is missing and is a required field"
          )
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
          new CalculationError(
            ifLogic.rowIndex,
            "Error",
            "Next row logic on row with no next row"
          )
        );
      }
      if (paramCounter < mathsLength && ifLogic[paramCounter + 1]) {
        if (column.nextFunction === "" || column.nextFunction === "na") {
          this.errorArray.push(
            new CalculationError(
              ifLogic.rowIndex,
              "Error",
              "Next row logic missing"
            )
          );
        }
      }
      paramCounter = paramCounter + 1;
    });
    if (LBcounter > RBcounter) {
      this.errorArray.push(
        new CalculationError(ifLogic.rowIndex, "Error", "Brackets not closed")
      );
    } else if (LBcounter < RBcounter) {
      this.errorArray.push(
        new CalculationError(ifLogic.rowIndex, "Error", "Brackets not open")
      );
    }
    return this.errorArray;
  }
}
