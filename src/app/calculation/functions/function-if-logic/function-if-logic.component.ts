import { Component, OnInit, Input } from "@angular/core";
import * as mathJs from "mathjs";
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
}
