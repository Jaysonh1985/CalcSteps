import { Component, Input, OnInit } from "@angular/core";
import * as expeval from "expr-eval";
import { Observable } from "rxjs";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { DragulaService } from "ng2-dragula";
import { Chip } from "../../shared/models/chip";
import { CalculationError } from "../../shared/models/calculation-error";
import * as moment from "moment";
import { MatDatepickerInputEvent } from "@angular/material";
import { AutoCompleteService } from "../../shared/services/auto-complete.service";

export class IfLogic {
  datatype: string;
  formula: string[];
  constructor(datatype, formula) {
    this.formula = formula;
    this.datatype = datatype;
  }
}
@Component({
  selector: "app-function-if-logic",
  templateUrl: "./function-if-logic.component.html",
  styleUrls: ["./function-if-logic.component.css"],
  providers: [AutoCompleteService]
})
export class FunctionIfLogicComponent implements OnInit {
  errorArray: any[];
  @Input()
  selectedRow: any[];
  @Input()
  autoCompleteArray: any[];
  public ifLogic: IfLogic;
  public autoCompleteOptions: any[];
  filteredOptions: Observable<string[]>;
  public autoCompleteOptionsNumber: any[];
  public autoCompleteOptionsText: any[];
  public autoCompleteOptionsDate: any[];
  public autoCompleteOptionsLogic: any[];
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
    if (this.selectedRow[0].ifLogic == null) {
      this.selectedRow[0].ifLogic = [this.ifLogic];
    }
    if (this.selectedRow[0].ifLogic.formula == null) {
      this.selectedRow[0].ifLogic.formula = [];
    }
    if (this.selectedRow[0].ifLogic.datatype == null) {
      this.selectedRow[0].ifLogic.datatype = "";
    }
    this.autoCompleteOptions = [];
    this.autoCompleteOptions.push({ name: "==", type: "" });
    this.autoCompleteOptions.push({ name: "!=", type: "" });
    this.autoCompleteOptions.push({ name: ">", type: "" });
    this.autoCompleteOptions.push({ name: ">=", type: "" });
    this.autoCompleteOptions.push({ name: "<", type: "" });
    this.autoCompleteOptions.push({ name: "<=", type: "" });
    this.autoCompleteOptions.push({ name: "(", type: "" });
    this.autoCompleteOptions.push({ name: ")", type: "" });
    this.autoCompleteOptions.push({ name: "and", type: "" });
    this.autoCompleteOptions.push({ name: "or", type: "" });
    this.autoCompleteOptionsDate = [];
    this.autoCompleteOptionsDate = this._autoCompleteService.getAutoCompleteArray(
      this.autoCompleteArray,
      "Date"
    );
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
    this.autoCompleteOptionsLogic = [];
    this.autoCompleteOptionsLogic = this._autoCompleteService.getAutoCompleteArray(
      this.autoCompleteArray,
      "Logic"
    );
    this.autoCompleteOptionsLogic.push({
      name: "true",
      type: "hardcoded",
      datatype: "Logic"
    });
    this.autoCompleteOptionsLogic.push({
      name: "false",
      type: "hardcoded",
      datatype: "Logic"
    });
  }

  remove(index): void {
    if (index >= 0) {
      this.selectedRow[0].ifLogic.formula.splice(index, 1);
    }
  }
  clearFormula(): void {
    this.selectedRow[0].ifLogic.formula = [];
  }
  addEventLookup(type: string, event: MatDatepickerInputEvent<Date>) {
    moment.locale("en-GB");
    this.selectedRow[0].ifLogic.formula.push({
      name: moment(event.value).format("DD/MM/YYYY"),
      type: "hardcoded",
      datatype: "Date"
    });
    event.target.value = null;
  }

  onAddInput(type, event) {
    if (event.target.value !== "") {
      this.selectedRow[0].ifLogic.formula.push({
        name: event.target.value,
        type: "hardcoded",
        datatype: type
      });
      event.target.value = null;
    }
  }

  onAddChipByDblClick(data) {
    this.selectedRow[0].ifLogic.formula.push({
      name: data.name,
      type: data.type,
      datatype: data.datatype
    });
  }

  public calculate(ifLogic, autoComplete): any {
    let ifLogicString: string;
    ifLogicString = "";
    ifLogic.formula.forEach(element => {
      let output = element.name;
      if (element.type === "variable") {
        if (element.datatype === "Date") {
          output = this._autoCompleteService.getDate(
            element.name,
            autoComplete
          );
          output = "'" + output + "'";
        } else if (element.datatype === "Number") {
          output = this._autoCompleteService.getNumber(
            element.name,
            autoComplete
          );
        } else if (element.datatype === "Text") {
          output = this._autoCompleteService.getText(
            element.name,
            autoComplete
          );
          output = "'" + output + "'";
        } else if (element.datatype === "Logic") {
          output = this._autoCompleteService.getLogic(
            element.name,
            autoComplete
          );
        } else {
          output = this._autoCompleteService.getText(
            element.name,
            autoComplete
          );
          output = "'" + output + "'";
        }
      } else if (element.type === "hardcoded") {
        if (element.datatype === "Date") {
          output = " '" + element.name + "'";
        } else if (element.datatype === "Number") {
          output = element.name;
        } else if (element.datatype === "Logic") {
          output = element.name;
        } else {
          output = " '" + element.name + "'";
        }
      }
      ifLogicString = ifLogicString.concat(output);
    });
    const Parser = expeval.Parser;
    const parser = new Parser();
    const expr = parser.parse(ifLogicString);
    return expr.evaluate();
  }

  errorCheck(ifLogic, autoComplete): CalculationError[] {
    this.errorArray = [];
    ifLogic.formula.forEach(element => {
      if (element.type === "variable") {
        if (element.datatype === "Date") {
          let Date1 = element.name;
          if (element.type === "variable") {
            Date1 = this._autoCompleteService.getDate(
              element.name,
              autoComplete
            );
          }
          const a = moment(Date1, "DD/MM/YYYY", true);
          if (a.isValid() === false) {
            this.errorArray.push(
              new CalculationError(
                ifLogic.rowIndex,
                "Error",
                Date1 +
                  "Lookup Value - Variable mismatch error - this could be a missing variable or a date in an incorrect format"
              )
            );
          }
        }
        if (element.datatype === "Number") {
          let Number2 = element.name;
          if (element.type === "variable") {
            Number2 = this._autoCompleteService.getNumber(
              element.name,
              autoComplete
            );
          }
          if (isNaN(Number(Number2))) {
            this.errorArray.push(
              new CalculationError(
                ifLogic.rowIndex,
                "Error",
                Number2 +
                  " - Number 2 - Variable mismatch error - this could be a missing variable or a number in an incorrect format"
              )
            );
          }
        }
        if (element.datatype === "Text") {
          let Text1 = element.name;
          if (element.type === "variable") {
            Text1 = this._autoCompleteService.getText(
              element.name,
              autoComplete
            );
            if (element.name === Text1) {
              this.errorArray.push(
                new CalculationError(
                  ifLogic.rowIndex,
                  "Error",
                  Text1 +
                    " - Text - Variable mismatch error - this could be a missing variable or a date in an incorrect format"
                )
              );
            }
          }
        }
        if (element.datatype === "Logic") {
          let Logic1 = element.name;
          if (element.type === "variable") {
            Logic1 = this._autoCompleteService.getLogic(
              element.name,
              autoComplete
            );
            if (Logic1 !== true && Logic1 !== false) {
              this.errorArray.push(
                new CalculationError(
                  ifLogic.rowIndex,
                  "Error",
                  Logic1 +
                    " - If Logic - Variable mismatch error - this could be a missing variable or a date in an incorrect format"
                )
              );
            }
          }
        }
      }
    });
    try {
      const evalulation = this.calculate(ifLogic, autoComplete);
    } catch (error) {
      this.errorArray.push(
        new CalculationError(
          ifLogic.rowIndex,
          "Error",
          "Formula is invalid please check this and rearrange"
        )
      );
    }
    return this.errorArray;
  }
}
