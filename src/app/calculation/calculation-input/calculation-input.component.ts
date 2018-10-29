import "moment/locale/pt-br";

import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { GridOptions } from "ag-grid";
import * as moment from "moment";

import { CalculationError } from "../shared/models/calculation-error";
import { CalculationInput } from "../shared/models/calculation-input";
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
  @Input()
  calculationInput: string[];
  @Input()
  release: boolean;
  @Input()
  test: boolean;
  @Output()
  messageEvent = new EventEmitter();
  @Output()
  dataChangeEvent = new EventEmitter();
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
        width: 250
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
        width: 250,
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
        width: 115,
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
        width: 100,
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

    this.gridColumnApi = params.columnApi;
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(column => {
      allColumnIds.push(column.colId);
    });
    if (this.release === true) {
      this.onDeleteAllInputs();
    }
    this.gridColumnApi.sizeColumnsToFit(1423);
    if (this.release === true || this.test === true) {
      this.inputGridOptions.columnApi.setColumnsVisible(
        ["required", "dropDownList", "dropDownValues"],
        false
      );
      if (this.release === true || this.test === true) {
        this.inputGridOptions.columnApi.setColumnsVisible(
          ["required", "dropDownList", "dropDownValues"],
          false
        );
        this.gridColumnApi.sizeColumnsToFit(532);
      }
    }
    this.onSetAllRowID();
    this.autocompleteService.editAutocomplete(this.getAllRowsNodes());
  }
  onAddRow() {
    const newItem = new CalculationInput(this.getGuid(), "", "", "", [], "False", "False");
    const res = this.gridApi.updateRowData({ add: [newItem] });
    const rowNode = this.gridApi.getRowNode(res.add[0].id);
    rowNode.id = rowNode.data.id;
    this.setRowOuput(res.add[0].id, rowNode.data);
    this.autocompleteService.editAutocomplete(this.getAllRowsNodes());
    this.onDataChanged();
  }
  getGuid() {
    return this.s4() +
    this.s4() +
    "-" +
    this.s4() +
    "-" +
    this.s4() +
    "-" +
    this.s4() +
    "-" +
    this.s4() +
    this.s4() +
    this.s4();
  }

  s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  onSetAllRowID() {
    const array = this.getAllRowsNodes();
    array.forEach(row => {
      const oldRowId = row.id;
      const rowNode = this.gridApi.getRowNode(row.id);
      if (rowNode.data.id === undefined) {
        row.id = this.getGuid();
        rowNode.data.id = row.id;
        this.setRowOuput(oldRowId, rowNode.data);
      } else {
        row.id = rowNode.data.id;
      }
    });
  }
  onRemoveSelected() {
    const selectedData = this.gridApi.getSelectedRows();
    const res = this.gridApi.updateRowData({ remove: selectedData });
    this.autocompleteService.editAutocomplete(this.getAllRowsNodes());
    this.onDataChanged();
  }
  onDeleteAllInputs() {
    this.gridApi.forEachNode(function(node, index) {
      const rowNode = node;
      const data = rowNode.data;
      data.output = "";
      rowNode.setData(data);
    });
    this.autocompleteService.editAutocomplete(this.getAllRowsNodes());
    this.onDataChanged();
  }
  onDataChanged() {
    this.autocompleteService.editAutocomplete(this.getAllRowsNodes());
    this.dataChangeEvent.emit();
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
        dropDownValues: node.data.dropDownValues,
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
  public setTableData(calculationInput) {
    let selectedData = this.gridApi.selectAll();
    selectedData = this.gridApi.getSelectedRows();
    const res = this.gridApi.updateRowData({ remove: selectedData});
    calculationInput.forEach(element => {
      const res2 = this.gridApi.updateRowData({ add: [element] });
    });
  }
  public setRowOuput(id, rowData) {
    const rowNode = this.gridApi.getRowNode(id);
    if (rowNode !== undefined) {
      let data = rowNode.data;
      data = rowData;
      rowNode.setData(data);
      this.autocompleteService.editAutocomplete(this.getAllRowsNodes());
    }
  }
  errorCheck(input): CalculationError[] {
    this.errorArray = [];
    if (
      input.required === "True" &&
      (!input.output || input.output === "")
    ) {
      this.errorArray.push(
        new CalculationError(
          input.rowIndex,
          "Error",
          input.name + " - Input is Required Field"
        )
      );
    }
    if (input.data === "Date") {
      moment.locale("en-GB");
      const a = moment(input.output, "DD/MM/YYYY", true);
      if (a.isValid() === false) {
        this.errorArray.push(
          new CalculationError(
            input.rowIndex,
            "Error",
            input.name + " - Date is not a valid date value"
          )
        );
      }
    }
    if (input.data === "Number") {
      if (isNaN(Number(input.output))) {
        this.errorArray.push(
          new CalculationError(
            input.rowIndex,
            "Error",
            input.name + " - Number is not a valid numeric value"
          )
        );
      }
    }
    return this.errorArray;
  }
}
