import { Component, Input, OnInit } from "@angular/core";
import { MatChipInputEvent } from "@angular/material";
import { CalculationError } from "../../shared/models/calculation-error";

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
  styleUrls: ["./function-number-functions.component.css"]
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

  constructor() {}

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
}
