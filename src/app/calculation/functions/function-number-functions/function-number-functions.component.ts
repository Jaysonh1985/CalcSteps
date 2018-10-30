import { Component, Input, OnInit } from "@angular/core";
import { MatChipInputEvent } from "@angular/material";
import { CalculationError } from "../../shared/models/calculation-error";
import { AutoCompleteService } from "../../shared/services/auto-complete.service";

export class NumberFunctions {
  type: string;
  number1: string[];
  number2: string[];
  constructor(type, number1, number2) {
    this.type = "";
    this.number1 = [];
    this.number2 = [];
  }
}
@Component({
  selector: "app-function-number-functions",
  templateUrl: "./function-number-functions.component.html",
  styleUrls: ["./function-number-functions.component.css", "../../shared/css/drag-chip.css"],
  providers: [AutoCompleteService]
})
export class FunctionNumberFunctionsComponent implements OnInit {
  @Input()
  selectedRow: any[];
  @Input()
  autoCompleteArray: any[];
  public autoCompleteOptions: any[];
  public errorArray: CalculationError[];
  public error: CalculationError;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  droppedData: string;

  constructor(private _autoCompleteService: AutoCompleteService) {}

  ngOnInit() {
    if (this.selectedRow[0].numberFunctions == null) {
      this.selectedRow[0].numberFunctions = [];
    }
    if (this.selectedRow[0].numberFunctions.number1 == null) {
      this.selectedRow[0].numberFunctions.number1 = [];
    }
    if (this.selectedRow[0].numberFunctions.number2 == null) {
      this.selectedRow[0].numberFunctions.number2 = [];
    }
    this.autoCompleteOptions = [];
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
  addNumber1(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || "").trim()) {
      this.selectedRow[0].numberFunctions.number1 = [];
      this.selectedRow[0].numberFunctions.number1.push({
        name: value.trim(),
        type: "hardcoded",
        datatype: "Number"
      });
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }
  addNumber2(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || "").trim()) {
      this.selectedRow[0].numberFunctions.number2 = [];
      this.selectedRow[0].numberFunctions.number2.push({
        name: value.trim(),
        type: "hardcoded",
        datatype: "Number"
      });
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  onNumber1Drop(data: any) {
    // Get the dropped data here
    this.selectedRow[0].numberFunctions.number1 = [];
    this.selectedRow[0].numberFunctions.number1.push({
      name: data.dragData.name,
      type: data.dragData.type,
      datatype: data.dragData.datatype
    });
  }

  onNumber2Drop(data: any) {
    // Get the dropped data here
    this.selectedRow[0].numberFunctions.number2 = [];
    this.selectedRow[0].numberFunctions.number2.push({
      name: data.dragData.name,
      type: data.dragData.type,
      datatype: data.dragData.datatype
    });
  }
  removeNumber1() {
    this.selectedRow[0].numberFunctions.number1 = [];
  }
  removeNumber2() {
    this.selectedRow[0].numberFunctions.number2 = [];
  }

  calculate(numberFunctions, autoComplete): any {
    let Number1 = numberFunctions.number1[0].name;
    if (numberFunctions.number1[0].type === "variable") {
      Number1 = this._autoCompleteService.getNumber(
        numberFunctions.number1[0].name,
        autoComplete
      );
    }
    if (numberFunctions.type === "Max" || numberFunctions.type === "Min") {
      let Number2 = numberFunctions.number2[0].name;
      if (numberFunctions.number2[0].type === "variable") {
        Number2 = this._autoCompleteService.getNumber(
          numberFunctions.number2[0].name,
          autoComplete
        );
      }
      if (numberFunctions.type === "Max") {
        if (Number1 > Number2) {
          return Number1;
        } else {
          return Number2;
        }
      } else if (numberFunctions.type === "Min") {
        if (Number1 < Number2) {
          return Number1;
        } else {
          return Number2;
        }
      }
    } else {
      if (numberFunctions.type === "Abs") {
        return Math.abs(Number1);
      } else if (numberFunctions.type === "Ceiling") {
        return Math.ceil(Number1);
      } else if (numberFunctions.type === "DecimalPart") {
        return Number1 - Math.trunc(Number1);
      } else if (numberFunctions.type === "Floor") {
        return Math.floor(Number1);
      } else if (numberFunctions.type === "Truncate") {
        return Math.trunc(Number1);
      }
    }
    return "";
  }
  errorCheck(numberFunctions, autoComplete): CalculationError[] {
    this.errorArray = [];
    if (numberFunctions.type === "") {
      this.errorArray.push(
        new CalculationError(
          numberFunctions.rowIndex,
          "Error",
          "Type is missing and is a required field"
        )
      );
    }
    if (numberFunctions.number1.length === 0) {
      this.errorArray.push(
        new CalculationError(
          numberFunctions.rowIndex,
          "Error",
          "Number 1 is missing and is a required field"
        )
      );
    }
    if (numberFunctions.number1.length > 0) {
      let Number1 = numberFunctions.number1[0].name;
      if (numberFunctions.number1[0].type === "variable") {
        Number1 = this._autoCompleteService.getNumber(
          numberFunctions.number1[0].name,
          autoComplete
        );
      }
      if (isNaN(Number(Number1))) {
        this.errorArray.push(
          new CalculationError(
            numberFunctions.rowIndex,
            "Error",
            "Number 1 - Variable mismatch error - this could be a missing variable or a Number in an incorrect format"
          )
        );
      }
    }
    if (numberFunctions.type === "Max" || numberFunctions.type === "Min") {
      if (numberFunctions.number2.length === 0) {
        this.errorArray.push(
          new CalculationError(
            numberFunctions.rowIndex,
            "Error",
            "Number 2 is missing and is a required field"
          )
        );
      }
      if (numberFunctions.number2.length > 0) {
        let Number2 = numberFunctions.number2[0].name;
        if (numberFunctions.number2[0].type === "variable") {
          Number2 = this._autoCompleteService.getNumber(
            numberFunctions.number2[0].name,
            autoComplete
          );
        }
        if (isNaN(Number(Number2))) {
          this.errorArray.push(
            new CalculationError(
              numberFunctions.rowIndex,
              "Error",
              "Number 2 - Variable mismatch error - this could be a missing variable or a Number in an incorrect format"
            )
          );
        }
      }
    }
    return this.errorArray;
  }
}
