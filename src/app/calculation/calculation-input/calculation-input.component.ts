import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { GridOptions } from "ag-grid";
import { Grid } from "ag-grid";
import { tryParse } from "selenium-webdriver/http";
import { CalculationInput } from "../shared/models/calculation-input";
import { CalculationError } from "../shared/models/calculation-error";
import * as moment from "moment";
import "moment/locale/pt-br";
import { AutoCompleteService } from "../shared/services/auto-complete.service";
@Component({
  selector: "app-calculation-input",
  templateUrl: "./calculation-input.component.html",
  styleUrls: ["./calculation-input.component.css"]
})
export class CalculationInputComponent implements OnInit {
  public gridOptions: GridOptions;
  public inputGridOptions: GridOptions;
  public outputGridOptions: GridOptions;
  public rowSelection;
  private gridApi;
  private gridColumnApi;
  public inputRows: object[];
  @Input() calculationInput: string[];
  @Input() release: boolean;
  @Output() messageEvent = new EventEmitter();
  public errorArray: CalculationError[];
  constructor(private autocompleteService: AutoCompleteService) {
    this.inputGridOptions = <GridOptions>{};
    this.rowSelection = "single";
    this.inputGridOptions.columnDefs = [
      {
        headerName: "Name",
        rowDrag: true,
        field: "name",
        editable: params => {
          if (this.release === true) {
            return false;
          } else {
            return true;
          }
        },
        width: 190
      },
      {
        headerName: "Data",
        field: "data",
        editable: params => {
          if (this.release === true) {
            return false;
          } else {
            return true;
          }
        },
        width: 75,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["Date", "Number", "Text", "Logic"] },
        suppressFilter: true
      },
      {
        headerName: "Input",
        field: "output",
        width: 135,
        cellEditorSelector: function(params) {
          if (params.data.dropDownList === "True") {
            return {
              component: "agSelectCellEditor",
              params: { values: params.data.dropDownValues.split(",") }
            };
          }
          return null;
        },
        editable: true,
        suppressFilter: true
      },
      {
        headerName: "Drop Down List?",
        field: "dropDownList",
        width: 135,
        editable: true,
        suppressFilter: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["True", "False"] }
      },
      {
        headerName: "Drop Down Values",
        field: "dropDownValues",
        width: 135,
        editable: params => params.data.dropDownList === "True",
        suppressFilter: true
      },
      {
        headerName: "Required",
        field: "required",
        width: 135,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["True", "False"] },
        editable: true,
        suppressFilter: true
      }
    ];
    this.inputGridOptions.floatingFilter = true;
    this.inputRows = [];
    this.inputGridOptions.getRowStyle = function(params) {
      if (params.data.errors !== undefined) {
        if (params.data.errors.length > 0) {
          return { background: "lightcoral" };
        }
        if (params.data.errors.length === 0) {
          return { background: "" };
        }
      }
    };
  }
  ngOnInit() {
    this.inputGridOptions.rowData = this.calculationInput;
  }
  onGridReady(params) {
    this.gridApi = params.api;
    if (this.release === true) {
      this.inputGridOptions.columnApi.setColumnsVisible(
        ["required", "dropDownList", "dropDownValues"],
        false,
        "api"
      );
    }
    this.gridColumnApi = params.columnApi;
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(column => {
      allColumnIds.push(column.colId);
    });
    this.autocompleteService.editAutocomplete(this.getAllRowsNodes());
  }
  onAddRow() {
    const newItem = new CalculationInput("", "", "", "", [], "", false);
    const res = this.gridApi.updateRowData({ add: [newItem] });
    this.autocompleteService.editAutocomplete(this.getAllRowsNodes());
  }
  onRemoveSelected() {
    const selectedData = this.gridApi.getSelectedRows();
    const res = this.gridApi.updateRowData({ remove: selectedData });
    this.autocompleteService.editAutocomplete(this.getAllRowsNodes());
  }
  onDeleteAllInputs() {
    this.gridApi.forEachNode(function(node, index) {
      const rowNode = node;
      const data = rowNode.data;
      data.output = "";
      rowNode.setData(data);
    });
    this.autocompleteService.editAutocomplete(this.getAllRowsNodes());
  }
  getAllRows(): CalculationInput[] {
    const arr: Array<CalculationInput> = [];
    this.gridApi.forEachNode(function(node, index) {
      const Row: CalculationInput = {
        id: node.data.id,
        name: node.data.name,
        output: node.data.output,
        data: node.data.data,
        errors: node.data.errors,
        dropDownList: node.data.dropDownList,
        required: node.data.required
      };
      arr.push(Row);
    });
    return arr;
  }
  getAllRowsNodes(): any[] {
    const arr: Array<any> = [];
    this.gridApi.forEachNode(function(node, index) {
      arr.push(node);
    });
    return arr;
  }
  getFinalRowNodesName(name): any[] {
    const arr: Array<any> = [];
    this.gridApi.forEachNode(function(node, index) {
      if (node.data.name === name) {
        arr.push(node);
      }
    });
    return arr[arr.length - 1];
  }
  getAllRowNodesbyData(data): any[] {
    const arr: Array<any> = [];
    this.gridApi.forEachNode(function(node, index) {
      if (node.data.data === data) {
        arr.push(node);
      }
    });
    return arr;
  }
  public setRowOuput(id, rowData) {
    const rowNode = this.gridApi.getRowNode(id);
    let data = rowNode.data;
    data = rowData;
    rowNode.setData(data);
    this.autocompleteService.addAutoComplete(this.getAllRowsNodes());
  }
  errorCheck(input): CalculationError[] {
    this.errorArray = [];
    if (
      input.data.required === "True" &&
      (!input.data.output || input.data.output === "")
    ) {
      this.errorArray.push(
        new CalculationError(
          input.rowIndex,
          "Error",
          input.data.name + " - Input is Required Field"
        )
      );
    }
    if (input.data.data === "Date") {
      moment.locale("en-GB");
      const a = moment(input.data.output, "DD/MM/YYYY", true);
      if (a.isValid() === false) {
        this.errorArray.push(
          new CalculationError(
            input.rowIndex,
            "Error",
            input.data.name + " - Date is not a valid date value"
          )
        );
      }
    }
    if (input.data.data === "Number") {
      if (isNaN(Number(input.data.output))) {
        this.errorArray.push(
          new CalculationError(
            input.rowIndex,
            "Error",
            input.data.name + " - Number is not a valid numeric value"
          )
        );
      }
    }
    return this.errorArray;
  }
}
