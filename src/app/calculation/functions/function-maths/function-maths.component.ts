import { Component, Input, OnInit, NgZone, ViewChild } from "@angular/core";
import * as mathJs from "mathjs";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { CalculationError } from "../../shared/models/calculation-error";
import { DragulaService } from "ng2-dragula";
import { Chip } from "../../shared/models/chip";
import { AutoCompleteService } from "../../shared/services/auto-complete.service";

export class Maths {
  formula: string[];
  rounding: string;
  roundingMethod: string;
  constructor(formula) {
    this.formula = formula;
  }
}

@Component({
  selector: "app-function-maths",
  templateUrl: "./function-maths.component.html",
  styleUrls: ["./function-maths.component.css"],
  providers: [AutoCompleteService]
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

  constructor(
    private dragulaService: DragulaService,
    private _autoCompleteService: AutoCompleteService
  ) {
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

    this.autoCompleteOptions = this.autoCompleteOptions.concat(
      this._autoCompleteService.getAutoCompleteArray(
        this.autoCompleteArray,
        "Number"
      )
    );
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

  onAddChipByDblClick(data) {
    this.selectedRow[0].maths.formula.push({
      name: data.name,
      type: data.type,
      datatype: data.datatype
    });
  }

  remove(index): void {
    if (index >= 0) {
      this.selectedRow[0].maths.formula.splice(index, 1);
    }
  }

  public RoundingRoundUp(Rounding, Value) {
    if (Rounding === 1 || Rounding === 2) {
      return mathJs.round(mathJs.ceil(Value * 100) / 100, Rounding);
    } else if (Rounding === 3) {
      return mathJs.round(mathJs.ceil(Value * 1000) / 1000, Rounding);
    } else if (Rounding === 4) {
      return mathJs.round(mathJs.ceil(Value * 10000) / 10000, Rounding);
    } else if (Rounding === 5) {
      return mathJs.round(mathJs.ceil(Value * 100000) / 100000, Rounding);
    } else if (Rounding === 6) {
      return mathJs.round(mathJs.ceil(Value * 100000) / 1000000, Rounding);
    } else {
      return mathJs.round(mathJs.ceil(Value * 1000) / 1000, Rounding);
    }
  }

  public RoundingRoundDown(Rounding, Value) {
    if (Rounding === 1 || Rounding === 2) {
      return mathJs.round(mathJs.floor(Value * 100) / 100, Rounding);
    } else if (Rounding === 3) {
      return mathJs.round(mathJs.floor(Value * 1000) / 1000, Rounding);
    } else if (Rounding === 4) {
      return mathJs.round(mathJs.floor(Value * 10000) / 10000, Rounding);
    } else if (Rounding === 5) {
      return mathJs.round(mathJs.floor(Value * 100000) / 100000, Rounding);
    } else if (Rounding === 6) {
      return mathJs.round(mathJs.floor(Value * 100000) / 1000000, Rounding);
    } else {
      return mathJs.round(mathJs.floor(Value * 1000) / 1000, Rounding);
    }
  }

  public RoundingDecimalPlaces(Rounding, Value) {
    return Value.toFixed(Rounding);
  }

  public calculate(maths, autoComplete): any {
    let mathString: string;
    mathString = "";
    maths.formula.forEach(element => {
      let number = element.name;
      if (element.type === "variable") {
        number = this._autoCompleteService.getNumber(
          element.name,
          autoComplete
        );
      }
      if (number === "") {
        number = 0;
      }
      mathString = mathString.concat(number);
    });
    const evalulation = mathJs.eval(mathString);
    if (maths.rounding === undefined) {
      maths.rounding = 2;
    }
    if (maths.roundingMethod === "Up") {
      return this.RoundingRoundUp(maths.rounding, evalulation).toFixed(
        maths.rounding
      );
    } else if (maths.roundingMethod === "Down") {
      if (maths.rounding === 0) {
        return mathJs.Truncate(evalulation);
      } else {
        return this.RoundingRoundDown(maths.rounding, evalulation).toFixed(
          maths.rounding
        );
      }
    } else {
      if (maths.rounding !== "") {
        return this.RoundingDecimalPlaces(
          maths.rounding,
          mathJs.round(evalulation, maths.rounding)
        );
      } else {
        return this.RoundingDecimalPlaces(
          maths.rounding,
          mathJs.round(evalulation, 2)
        );
      }
    }
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
        try {
          const Number1 = this._autoCompleteService.getNumberError(
            element.name,
            autoComplete
          );
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
        } catch (error) {
          this.errorArray.push(
            new CalculationError(
              maths.rowIndex,
              "Error",
               "Variable mismatch error - this could be a missing variable or a number in an incorrect format"
            )
          );
        }
      }
    });
    try {
      const evalulation = this.calculate(maths, autoComplete);
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
