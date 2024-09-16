import { Component, Input, OnInit } from "@angular/core";
import { MatChipInputEvent } from "@angular/material";
import { CalculationError } from "../../shared/models/calculation-error";
import { AutoCompleteService } from "../../shared/services/auto-complete.service";

export class TextFunctions {
  type: string;
  text1: string[];
  text2: string[];
  number1: string[];
  constructor(type, text1, text2, number1) {
    this.type = "";
    this.text1 = [];
    this.text2 = [];
    this.number1 = [];
  }
}

@Component({
  selector: "app-function-text-functions",
  templateUrl: "./function-text-functions.component.html",
  styleUrls: ["./function-text-functions.component.css"],
  providers: [AutoCompleteService]
})
export class FunctionTextFunctionsComponent implements OnInit {
  @Input()
  selectedRow: any[];
  @Input()
  autoCompleteArray: any[];
  public autoCompleteOptionsText: any[];
  public autoCompleteOptionsNumber: any[];
  public errorArray: CalculationError[];
  public error: CalculationError;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  droppedData: string;

  constructor(private _autoCompleteService: AutoCompleteService) {}

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
    if (this.selectedRow[0].textFunctions.number1 == null) {
      this.selectedRow[0].textFunctions.number1 = [];
    }
    this.autoCompleteOptionsNumber = [];
    this.autoCompleteOptionsNumber = this._autoCompleteService.getAutoCompleteArray(
      this.autoCompleteArray,
      "Number"
    );
    this.autoCompleteOptionsText = [];
    this.autoCompleteOptionsText = this._autoCompleteService.getAutoCompleteArray(
      this.autoCompleteArray,
      "Text"
    );
  }
  removeChip(array, field) {
    if (field === "text1") {
      this.selectedRow[0].textFunctions.text1 = [];
    } else if (field === "text2") {
      this.selectedRow[0].textFunctions.text2 = [];
    } else if (field === "number1") {
      this.selectedRow[0].textFunctions.number1 = [];
    }
  }

  dropChip(array, field) {
    if (field === "text1" && array[0].datatype === "Text") {
      this.selectedRow[0].textFunctions.text1 = [];
      this.selectedRow[0].textFunctions.text1 = array;
    } else if (field === "text2" && array[0].datatype === "Text") {
      this.selectedRow[0].textFunctions.text2 = [];
      this.selectedRow[0].textFunctions.text2 = array;
    } else if (field === "number1" && array[0].datatype === "Number") {
      this.selectedRow[0].textFunctions.number1 = [];
      this.selectedRow[0].textFunctions.number1 = array;
    }
  }

  calculate(textFunctions, autoComplete): any {
    let Text1 = textFunctions.text1[0].name;
    if (textFunctions.text1[0].type === "variable") {
      Text1 = this._autoCompleteService.getText(
        textFunctions.text1[0].name,
        autoComplete
      );
    }

    if (textFunctions.type === "AddText") {
      return Text1;
    } else if (textFunctions.type === "Concatenate") {
      let Text2 = textFunctions.text2[0].name;
      if (textFunctions.text2[0].type === "variable") {
        Text2 = this._autoCompleteService.getText(
          textFunctions.text2[0].name,
          autoComplete
        );
      }
      return Text1 + Text2;
    } else if (textFunctions.type === "Length") {
      return Text1.length;
    } else if (textFunctions.type === "Left") {
      let Number1 = textFunctions.number1[0].name;
      if (textFunctions.number1[0].type === "variable") {
        Number1 = this._autoCompleteService.getText(
          textFunctions.number1[0].name,
          autoComplete
        );
      }
      return Text1.substring(0, Number(Number1));
    } else if (textFunctions.type === "Right") {
      let Number1 = textFunctions.number1[0].name;
      if (textFunctions.number1[0].type === "variable") {
        Number1 = this._autoCompleteService.getNumber(
          textFunctions.number1[0].name,
          autoComplete
        );
      }
      return Text1.substring(Text1.length - Number(Number1), Text1.length);
    } else if (textFunctions.type === "StripNumber") {
      return Text1.replace(/[0-9]/g, "");
    } else if (textFunctions.type === "StripText") {
      return Text1.replace(/[A-Z]/g, "");
    } else if (textFunctions.type === "Trim") {
      return Text1.trim();
    }
    return "";
  }

  errorCheck(textFunctions, autoComplete): CalculationError[] {
    this.errorArray = [];
    if (textFunctions.type === "") {
      this.errorArray.push(
        new CalculationError(
          textFunctions.rowIndex,
          "Error",
          "Type is missing and is a required field"
        )
      );
    }
    if (textFunctions.text1.length === 0) {
      this.errorArray.push(
        new CalculationError(
          textFunctions.rowIndex,
          "Error",
          "Text 1 is missing and is a required field"
        )
      );
    } else {
      let Text1 = textFunctions.text1[0].name;
      if (textFunctions.text1[0].type === "variable") {
        Text1 = this._autoCompleteService.getText(
          textFunctions.text1[0].name,
          autoComplete
        );
        if (textFunctions.text1[0].name === Text1) {
          this.errorArray.push(
            new CalculationError(
              textFunctions.rowIndex,
              "Error",
              Text1 +
                " - Text - Variable mismatch error - this could be a missing variable or a date in an incorrect format"
            )
          );
        }
      }
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
      } else {
        let Text2 = textFunctions.text2[0].name;
        if (textFunctions.text2[0].type === "variable") {
          Text2 = this._autoCompleteService.getText(
            textFunctions.text2[0].name,
            autoComplete
          );
          if (textFunctions.text2[0].name === Text2) {
            this.errorArray.push(
              new CalculationError(
                textFunctions.rowIndex,
                "Error",
                Text2 +
                  " - Text - Variable mismatch error - this could be a missing variable or a date in an incorrect format"
              )
            );
          }
        }
      }
      if (textFunctions.type === "Left" || textFunctions.type === "Right") {
        if (textFunctions.number1.length === 0) {
          this.errorArray.push(
            new CalculationError(
              textFunctions.rowIndex,
              "Error",
              "Number 1 is missing and is a required field"
            )
          );
        }
        if (textFunctions.number1.length > 0) {
          let Number1 = textFunctions.number1[0].name;
          if (textFunctions.number1[0].type === "variable") {
            Number1 = this._autoCompleteService.getNumber(
              textFunctions.number1[0].name,
              autoComplete
            );
          }
          if (isNaN(Number(Number1))) {
            this.errorArray.push(
              new CalculationError(
                textFunctions.rowIndex,
                "Error",
                "Number 1 - Variable mismatch error - this could be a missing variable or a Number in an incorrect format"
              )
            );
          }
        }
      }
    }
    return this.errorArray;
  }
}
