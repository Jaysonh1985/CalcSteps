import { Component, OnInit, Input, ViewChild } from "@angular/core";
import * as mathJs from "mathjs";
import { CalculationConfiguration } from "../../shared/models/calculation-configuration";
import { CalculationInputComponent } from "../../calculation-input/calculation-input.component";
import { CalculationOutputComponent } from "../../calculation-output/calculation-output.component";
import { parse } from "querystring";
import { MatSelect } from "@angular/material";
import { map, startWith, concat } from "rxjs/operators";
import { CalculationError } from "../../shared/models/calculation-error";
import { Observable } from "rxjs/Observable";
export class Maths {
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
  selector: "app-function-maths",
  templateUrl: "./function-maths.component.html",
  styleUrls: ["./function-maths.component.css"]
})
export class FunctionMathsComponent implements OnInit {
  errorArray: any[];
  @Input() selectedRow: any[];
  @Input() autoCompleteArray: any[];
  public maths: Maths;
  public autoCompleteOptions: any[];
  filteredOptions: Observable<string[]>;
  constructor() {}
  onAddRow() {
    this.selectedRow[0].maths.push(new Maths("", "", "", "", "", ""));
  }
  onDeleteRow(index) {
    this.selectedRow[0].maths.splice(index, 1);
  }
  ngOnInit() {
    if (this.selectedRow[0].maths == null) {
      this.selectedRow[0].maths = [this.maths];
    }
    this.autoCompleteOptions = [];
    this.autoCompleteArray.forEach(element => {
      if (element.data.data === "Number") {
        if (element.data.name !== "") {
          const autoCompleteText = element.data.name;
          this.autoCompleteOptions.push(autoCompleteText);
        }
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
        if (value.data.name === InputValue && value.data.data === "Number") {
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
    } else if (functionType === "na") {
      return "";
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
  errorCheck(maths, autoComplete): CalculationError[] {
    this.errorArray = [];
    let paramCounter = 0;
    let LBcounter = 0;
    let RBcounter = 0;
    const mathsLength = maths.length - 1;
    maths.forEach(column => {
      if (!column.input1) {
        this.errorArray.push(
          new CalculationError(
            maths.rowIndex,
            "Error",
            "Input 1 is missing and is a required field"
          )
        );
      }
      if (!column.input2) {
        this.errorArray.push(
          new CalculationError(
            maths.rowIndex,
            "Error",
            "Input 2 is missing and is a required field"
          )
        );
      }
      if (!column.functionType) {
        this.errorArray.push(
          new CalculationError(
            maths.rowIndex,
            "Error",
            "Function is missing and is a required field"
          )
        );
      }
      if (column.input1) {
        const Number1 = this.getAutoCompleteOutput(column.input1, autoComplete);
        if (isNaN(Number(Number1))) {
          this.errorArray.push(
            new CalculationError(
              maths.rowIndex,
              "Error",
              Number1 +
                " - Number 1 - Variable mismatch error - this could be a missing variable or a date in an incorrect format"
            )
          );
        }
      }
      if (column.input2) {
        const Number2 = this.getAutoCompleteOutput(column.input2, autoComplete);
        if (isNaN(Number(Number2))) {
          this.errorArray.push(
            new CalculationError(
              maths.rowIndex,
              "Error",
              Number2 +
                " - Number 2 - Variable mismatch error - this could be a missing variable or a date in an incorrect format"
            )
          );
        }
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
            maths.rowIndex,
            "Error",
            "Next row logic on row with no next row"
          )
        );
      }
      if (paramCounter < mathsLength && maths[paramCounter + 1]) {
        if (column.nextFunction === "" || column.nextFunction === "na") {
          this.errorArray.push(
            new CalculationError(
              maths.rowIndex,
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
        new CalculationError(maths.rowIndex, "Error", "Brackets not closed")
      );
    } else if (LBcounter < RBcounter) {
      this.errorArray.push(
        new CalculationError(maths.rowIndex, "Error", "Brackets not open")
      );
    }
    return this.errorArray;
  }
}
