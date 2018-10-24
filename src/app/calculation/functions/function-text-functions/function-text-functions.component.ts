import { Component, Input, OnInit } from "@angular/core";
import { MatChipInputEvent } from "@angular/material";
import { CalculationError } from "../../shared/models/calculation-error";

export class TextFunctions {
  type: string;
  text1: string[];
  text2: string[];
  constructor(type, text1, text2) {
    this.type = "";
    this.text1 = [];
    this.text2 = [];
  }
}

@Component({
  selector: "app-function-text-functions",
  templateUrl: "./function-text-functions.component.html",
  styleUrls: ["./function-text-functions.component.css"]
})
export class FunctionTextFunctionsComponent implements OnInit {
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
    if (this.selectedRow[0].textFunctions == null) {
      this.selectedRow[0].textFunctions = [];
    }
    if (this.selectedRow[0].textFunctions.text1 == null) {
      this.selectedRow[0].textFunctions.text1 = [];
    }
    if (this.selectedRow[0].textFunctions.text2 == null) {
      this.selectedRow[0].textFunctions.text2 = [];
    }
    this.autoCompleteOptions = [];
    this.autoCompleteArray.forEach(element => {
      if (element.data.data === "Text") {
        if (element.data.name !== "") {
          this.autoCompleteOptions.push({
            name: element.data.name,
            type: "variable",
            datatype: "Text"
          });
        }
      }
    });
  }
  addText1(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || "").trim()) {
      this.selectedRow[0].textFunctions.text1 = [];
      this.selectedRow[0].textFunctions.text1.push({
        name: value.trim(),
        type: "hardcoded",
        datatype: "Text"
      });
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }
  addText2(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || "").trim()) {
      this.selectedRow[0].textFunctions.text2 = [];
      this.selectedRow[0].textFunctions.text2.push({
        name: value.trim(),
        type: "hardcoded",
        datatype: "Text"
      });
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  onText1Drop(data: any) {
    // Get the dropped data here
    this.selectedRow[0].textFunctions.text1 = [];
    this.selectedRow[0].textFunctions.text1.push({
      name: data.dragData.name,
      type: data.dragData.type,
      datatype: data.dragData.datatype
    });
  }
  onText2Drop(data: any) {
    // Get the dropped data here
    this.selectedRow[0].textFunctions.text2 = [];
    this.selectedRow[0].textFunctions.text2.push({
      name: data.dragData.name,
      type: data.dragData.type,
      datatype: data.dragData.datatype
    });
  }
  removeText1() {
    this.selectedRow[0].textFunctions.text1 = [];
  }
  removeText2() {
    this.selectedRow[0].textFunctions.text2 = [];
  }
  calculate(textFunctions, autoComplete): any {
    const Text1 = textFunctions.text1[0].name;
    const Text2 = textFunctions.text2[0].name;
    return "";
  }
  errorCheck(textFunctions, autoComplete): CalculationError[] {
    this.errorArray = [];
    if (textFunctions.text1.length === 0) {
      this.errorArray.push(
        new CalculationError(
          textFunctions.rowIndex,
          "Error",
          "Text 1 is missing and is a required field"
        )
      );
    }
    if (textFunctions.type === "Concatenate") {
      if (textFunctions.text2.length === 0) {
        this.errorArray.push(
          new CalculationError(
            textFunctions.rowIndex,
            "Error",
            "Text 2 is missing and is a required field"
          )
        );
      }
    }

    return this.errorArray;
  }
}
