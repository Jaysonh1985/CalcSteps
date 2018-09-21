import { Component, Input, OnInit, NgZone, ViewChild } from "@angular/core";
import * as mathJs from "mathjs";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { CalculationError } from "../../shared/models/calculation-error";
import { DragulaService } from "ng2-dragula";
import { Chip } from "../../shared/models/chip";

export class Maths {
  formula: string[];
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
    this.autoCompleteOptions.push({ name: "1", type: "", datatype: "number" });
    this.autoCompleteOptions.push({ name: "2", type: "", datatype: "number" });
    this.autoCompleteOptions.push({ name: "3", type: "", datatype: "number" });
    this.autoCompleteOptions.push({ name: "4", type: "", datatype: "number" });
    this.autoCompleteOptions.push({ name: "5", type: "", datatype: "number" });
    this.autoCompleteOptions.push({ name: "6", type: "", datatype: "number" });
    this.autoCompleteOptions.push({ name: "7", type: "", datatype: "number" });
    this.autoCompleteOptions.push({ name: "8", type: "", datatype: "number" });
    this.autoCompleteOptions.push({ name: "9", type: "", datatype: "number" });
    this.autoCompleteArray.forEach(element => {
      if (element.data.datatype === "Number") {
        if (element.data.name !== "") {
          this.autoCompleteOptions.push({
            name: element.data.name,
            type: "variable",
            datatype: "number"
          });
        }
      }
    });
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
        if (value.data.name === InputValue && value.data.data === "Number") {
          input = value.data.output;
        }
      });
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
      mathString = mathString.concat(
        number
      );
    });
    return mathJs.eval(mathString);
  }

  errorCheck(maths, autoComplete): CalculationError[] {
    this.errorArray = [];
    maths.formula.forEach(element => {
      if (element.datatype === "variable") {
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
    return this.errorArray;
  }
}
