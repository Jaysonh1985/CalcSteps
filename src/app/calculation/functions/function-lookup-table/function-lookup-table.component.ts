import "moment/locale/pt-br";

import { Component, Input, OnInit } from "@angular/core";
import * as moment from "moment";

import { AuthService } from "../../../shared/services/auth.service";
import { CalculationError } from "../../shared/models/calculation-error";
import { LookupService } from "../../shared/services/lookup.service";
import { MatChipInputEvent } from "@angular/material";
import { AutoCompleteService } from "../../shared/services/auto-complete.service";

export class LookupTable {
  TableName: string;
  LookupType: string;
  LookupValue: string[];
  OutputType: string;
  RowMatch: string;
  RowMatchLookupType: string;
  RowMatchRowNo: number;
  RowMatchValue: string;
  ColumnNo: string;
  Interpolate: boolean;
  constructor(
    TableName,
    LookupType,
    LookupValue,
    OutputType,
    RowMatch,
    RowMatchLookupType,
    RowMatchRowNo,
    RowMatchValue,
    ColumnNo,
    Interpolate
  ) {
    this.TableName = "";
    this.LookupType = "";
    this.LookupValue = [];
    this.OutputType = "";
    this.RowMatch = "";
    this.RowMatchLookupType = "";
    this.RowMatchRowNo = 0;
    this.RowMatchValue = "";
    this.ColumnNo = "";
    this.Interpolate = false;
  }
}
@Component({
  selector: "app-function-lookup-table",
  templateUrl: "./function-lookup-table.component.html",
  styleUrls: ["./function-lookup-table.component.css"],
  providers: [AutoCompleteService]
})
export class FunctionLookupTableComponent implements OnInit {
  @Input()
  selectedRow: any[];
  @Input()
  autoCompleteArray: any[];
  public lookupTable: LookupTable;
  public autoCompleteOptionsNumber: any[];
  public autoCompleteOptionsText: any[];
  public autoCompleteOptionsDate: any[];
  public errorArray: CalculationError[];
  lookups: any;
  columnList: any;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  droppedData: string;
  constructor(
    private authService: AuthService,
    private lookupService: LookupService,
    private _autoCompleteService: AutoCompleteService
  ) {}

  ngOnInit() {
    if (this.selectedRow[0].lookupTable == null) {
      this.selectedRow[0].lookupTable = this.lookupTable;
    }
    if (this.selectedRow[0].lookupTable.LookupValue == null) {
      this.selectedRow[0].lookupTable.LookupValue = [];
    }
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
    this.authService.userFirebase.subscribe(auth => {
      if (auth) {
        this.lookupService
          .getLookupListbyuid(auth.uid)
          .snapshotChanges()
          .map(changes => {
            return changes.map(c => ({
              key: c.payload.key,
              ...c.payload.val()
            }));
          })
          .subscribe(customers => {
            this.lookups = customers;
            if (this.selectedRow[0].lookupTable.TableName !== "") {
              this.setColumnList(this.selectedRow[0].lookupTable.TableName);
            }
          });
      }
    });
  }
  setColumnList(key: string) {
    if (key) {
      this.lookupService
        .getLookup(key)
        .snapshotChanges()
        .map(changes => {
          return changes.map(c => ({
            key: c.payload.key,
            ...c.payload.val()
          }));
        })
        .subscribe(lookups => {
          this.columnList = [];
          lookups[0].headerRow.forEach(element => {
            this.columnList.push({
              key: element.field,
              name: element.headerName
            });
          });
        });
    }
  }
  removeChip(array, field) {
    if (field === "lookuptype") {
      this.selectedRow[0].lookupTable.LookupValue = [];
    }
  }

  dropChip(array, field) {
    if (field === "lookuptype") {
      this.selectedRow[0].lookupTable.LookupValue = [];
      this.selectedRow[0].lookupTable.LookupValue = array;
    }
  }

  errorCheck(lookupTable, autoComplete): CalculationError[] {
    this.errorArray = [];
    if (!lookupTable.TableName) {
      this.errorArray.push(
        new CalculationError(
          lookupTable.rowIndex,
          "Error",
          "Lookup Table is missing and is a required field"
        )
      );
    }
    if (!lookupTable.LookupType) {
      this.errorArray.push(
        new CalculationError(
          lookupTable.rowIndex,
          "Error",
          "Lookup Type is missing and is a required field"
        )
      );
    }
    if (lookupTable.LookupValue.length === 0) {
      this.errorArray.push(
        new CalculationError(
          lookupTable.rowIndex,
          "Error",
          "Lookup Value is missing and is a required field"
        )
      );
    }
    if (!lookupTable.ColumnNo) {
      this.errorArray.push(
        new CalculationError(
          lookupTable.rowIndex,
          "Error",
          "Lookup Column is missing and is a required field"
        )
      );
    }
    if (!lookupTable.OutputType) {
      this.errorArray.push(
        new CalculationError(
          lookupTable.rowIndex,
          "Error",
          "Output Data Type is missing and is a required field"
        )
      );
    }
    if (
      lookupTable.LookupType === "Date" &&
      lookupTable.LookupValue.length > 0
    ) {
      let Date1 = lookupTable.LookupValue[0].name;
      if (lookupTable.LookupValue[0].type === "variable") {
        Date1 = this._autoCompleteService.getDate(
          lookupTable.LookupValue[0].name,
          autoComplete
        );
      }

      const a = moment(Date1, "DD/MM/YYYY", true);
      if (a.isValid() === false) {
        this.errorArray.push(
          new CalculationError(
            lookupTable.rowIndex,
            "Error",
            Date1 +
              "Lookup Value - Variable mismatch error - this could be a missing variable or a date in an incorrect format"
          )
        );
      }
    } else if (
      lookupTable.LookupType === "Number" &&
      lookupTable.LookupValue.length > 0
    ) {
      let Number1 = lookupTable.LookupValue[0].name;
      if (lookupTable.LookupValue[0].type === "variable") {
        Number1 = this._autoCompleteService.getNumber(
          lookupTable.LookupValue[0].name,
          autoComplete
        );
      }

      if (isNaN(Number(Number1))) {
        this.errorArray.push(
          new CalculationError(
            lookupTable.rowIndex,
            "Error",
            Number1 +
              " - Lookup Value - Variable mismatch error - this could be a missing variable or a date in an incorrect format"
          )
        );
      }
    } else {
      let Text1 = lookupTable.LookupValue[0].name;
      if (lookupTable.LookupValue[0].type === "variable") {
        Text1 = this._autoCompleteService.getText(
          lookupTable.LookupValue[0].name,
          autoComplete
        );
        if (lookupTable.LookupValue[0].name === Text1) {
          this.errorArray.push(
            new CalculationError(
              lookupTable.rowIndex,
              "Error",
              Text1 +
                " - Text - Variable mismatch error - this could be a missing variable or a date in an incorrect format"
            )
          );
        }
      }
    }
    return this.errorArray;
  }
}
