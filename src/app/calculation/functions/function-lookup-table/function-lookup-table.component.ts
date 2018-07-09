import { Component, OnInit, Input } from "@angular/core";
import { CalculationError } from "../../shared/models/calculation-error";
import { Observable } from "rxjs/Observable";
import { AuthService } from "../../../shared/services/auth.service";
import { LookupService } from "../../shared/services/lookup.service";
import * as moment from "moment";
import "moment/locale/pt-br";
export class LookupTable {
  TableName: string;
  LookupType: string;
  LookupValue: string;
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
    this.LookupValue = "";
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
  styleUrls: ["./function-lookup-table.component.css"]
})
export class FunctionLookupTableComponent implements OnInit {
  @Input() selectedRow: any[];
  @Input() autoCompleteArray: any[];
  public lookupTable: LookupTable;
  public autoCompleteOptions: any[];
  public errorArray: CalculationError[];
  lookups: any;
  columnList: any;
  constructor(
    private authService: AuthService,
    private lookupService: LookupService
  ) {}

  ngOnInit() {
    if (this.selectedRow[0].lookupTable == null) {
      this.selectedRow[0].lookupTable = this.lookupTable;
    }
    this.autoCompleteOptions = [];
    this.autoCompleteArray.forEach(element => {
      if (element.data.name !== "") {
        const autoCompleteText = element.data.name;
        this.autoCompleteOptions.push(autoCompleteText);
      }
    });
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
            this.setColumnList(customers[0].key);
          });
      }
    });
  }
  filterAutoComplete(val: string) {
    if (val) {
      const filterValue = val.toLowerCase();
      const filteredResults = this.autoCompleteOptions.filter(state =>
        state.toLowerCase().startsWith(filterValue)
      );
      return filteredResults;
    }
    return this.autoCompleteOptions;
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
  getAutoCompleteOutputDate(InputValue, array): any {
    let input = 0;
    const date = moment(InputValue, "DD/MM/YYYY", true);
    if (date.isValid() === false) {
      input = InputValue;
      array.forEach(value => {
        if (value.data.name === InputValue && value.data.data === "Date") {
          input = value.data.output;
        }
      });
    } else {
      input = InputValue;
    }
    return input;
  }
  getAutoCompleteNumber(InputValue, array): any {
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
  calculate(lookupTable, autoComplete): any {}
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
    if (!lookupTable.LookupValue) {
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
    if (lookupTable.LookupType === "Date") {
      const Date1 = this.getAutoCompleteOutputDate(
        lookupTable.LookupValue,
        autoComplete
      );
      const a = moment(Date1, "DD/MM/YYYY", true);
      if (a.isValid() === false) {
        this.errorArray.push(
          new CalculationError(
            lookupTable.rowIndex,
            "Error",
            "Lookup Value - Variable mismatch error - this could be a missing variable or a date in an incorrect format"
          )
        );
      }
    } else if (lookupTable.LookupType === "Number") {
      const Number2 = this.getAutoCompleteNumber(
        lookupTable.LookupValue,
        autoComplete
      );
      if (isNaN(Number(Number2))) {
        this.errorArray.push(
          new CalculationError(
            lookupTable.rowIndex,
            "Error",
            Number2 +
              " - Number 2 - Variable mismatch error - this could be a missing variable or a date in an incorrect format"
          )
        );
      }
    }
    return this.errorArray;
  }
}
