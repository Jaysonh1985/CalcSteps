import { Component, Input, OnInit, NgZone, ViewChild } from "@angular/core";
import * as mathJs from "mathjs";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { CalculationError } from "../../shared/models/calculation-error";
import { DragulaService } from "ng2-dragula";
import { Chip } from "../../shared/models/chip";

export class Maths {
  formula: string[];
  rounding: string;
  constructor(formula) {
    this.formula = formula;
  }
}

@Component({
  selector: "app-function-maths",
  templateUrl: "./function-maths.component.html",
  styleUrls: ["./function-maths.component.css"]
})
export class FunctionMathsComponent implements OnInit {
  errorArray: any[];
  @Input()
  selectedRow: any[];
  @Input()
  autoCompleteArray: any[];
  public maths: Maths;
  public autoCompleteOptions: any[];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  droppedData: string;

  constructor(private dragulaService: DragulaService) {
    this.dragulaService.destroy("formula");
    this.dragulaService.createGroup("formula", {
      revertOnSpill: true,
      direction: "horizontal",
      copy: (el, source) => {
        return source.id === "options";
      },
      copyItem: (chip: Chip) => {
        return new Chip(chip.name, chip.type, chip.datatype);
      },
      accepts: (el, target, source, sibling) => {
        // To avoid dragging from right to left container
        return target.id !== "options";
      }
    });
    this.dragulaService.dropModel("formula").subscribe(args => {});
  }

  ngOnInit() {
    if (this.selectedRow[0].maths == null) {
      this.selectedRow[0].maths = new Maths([]);
    }
    if (this.selectedRow[0].maths.formula == null) {
      this.selectedRow[0].maths.formula = [];
    }
    this.autoCompleteOptions = [];
    this.autoCompleteOptions.push({ name: "(", type: "" });
    this.autoCompleteOptions.push({ name: ")", type: "" });
    this.autoCompleteOptions.push({ name: "+", type: "" });
    this.autoCompleteOptions.push({ name: "-", type: "" });
    this.autoCompleteOptions.push({ name: "*", type: "" });
    this.autoCompleteOptions.push({ name: "/", type: "" });
    this.autoCompleteOptions.push({ name: "^", type: "" });
    this.autoCompleteArray.forEach(element => {
      if (element.data.data === "Number") {
        if (element.data.name !== "") {
          this.autoCompleteOptions.push({
            name: element.data.name,
            type: "variable",
            datatype: "Number"
          });
        }
      }
    });
  }

  onAddInput(type, event) {
    if (event.target.value !== "") {
      this.selectedRow[0].maths.formula.push({
        name: event.target.value,
        type: "hardcoded",
        datatype: type
      });
      event.target.value = null;
    }
  }

  remove(index): void {
    if (index >= 0) {
      this.selectedRow[0].maths.formula.splice(index, 1);
    }
  }

  private getAutoCompleteOutput(InputValue, array): any {
    let input = 0;
    if (isNaN(Number(InputValue))) {
      input = InputValue;
      array.forEach(value => {
        if (value.name === InputValue && value.data === "Number") {
          input = value.output;
        }
      });
      if (isNaN(Number(input))) {
        input = 0;
      }
    } else {
      input = InputValue;
    }
    return input;
  }

  public calculate(maths, autoComplete): any {
    let mathString: string;
    mathString = "";
    maths.formula.forEach(element => {
      let number = element.name;
      if (element.type === "variable") {
        number = this.getAutoCompleteOutput(element.name, autoComplete);
      }
      mathString = mathString.concat(number);
    });
    const evalulation = mathJs.eval(mathString);
    if (maths.rounding === undefined) {
      maths.rounding = 2;
    }
    return mathJs.round(evalulation, maths.rounding);
  }

  errorCheck(maths, autoComplete): CalculationError[] {
    this.errorArray = [];
    if (maths.formula === "") {
      this.errorArray.push(
        new CalculationError(maths.rowIndex, "Error", "No formula in builder")
      );
    }
    maths.formula.forEach(element => {
      if (element.type === "variable") {
        const Number1 = this.getAutoCompleteOutput(element.name, autoComplete);
        if (isNaN(Number(Number1))) {
          this.errorArray.push(
            new CalculationError(
              maths.rowIndex,
              "Error",
              Number1 +
                " - Variable mismatch error - this could be a missing variable or a number in an incorrect format"
            )
          );
        }
      }
    });
    let mathString: string;
    mathString = "";
    maths.formula.forEach(element => {
      let number = element.name;
      if (element.type === "variable") {
        number = this.getAutoCompleteOutput(element.name, autoComplete);
      }
      mathString = mathString.concat(number);
    });
    try {
      const evalulation = mathJs.eval(mathString);
    } catch (error) {
      this.errorArray.push(
        new CalculationError(
          maths.rowIndex,
          "Error",
          "Formula is invalid please check this and rearrange"
        )
      );
    }
    return this.errorArray;
  }
}
