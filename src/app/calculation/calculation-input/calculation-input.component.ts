import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { GridOptions } from "ag-grid";
import { Grid } from "ag-grid";
import { tryParse } from "selenium-webdriver/http";
import { CalculationInput } from "../shared/models/calculation-input";

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
  @Output() messageEvent = new EventEmitter();
  constructor() {
    this.inputGridOptions = <GridOptions>{};
    this.rowSelection = "single";
    this.inputGridOptions.columnDefs = [
      {
        headerName: "Name",
        rowDrag: true,
        field: "name",
        editable: true,
        width: 190
      },
      {
        headerName: "Data",
        field: "data",
        editable: true,
        width: 75,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["Date", "Number", "Text", "Logic"] },
        suppressFilter: true
      },
      {
        headerName: "Input",
        field: "output",
        width: 135,
        cellEditorSelector: function (params) {
          if (params.data.dropDownList !== "") { return {
            component: "agSelectCellEditor",
            params: { values: params.data.dropDownList.split(",") }
          };
          }
          return null;
        },
        editable: true,
        suppressFilter: true
      },
      {
        headerName: "Drop Down",
        field: "dropDownList",
        width: 135,
        editable: true,
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
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    // this.gridColumnApi.autoSizeColumns(allColumnIds);
  }
  onAddRow() {
    const newItem = this.createNewRowData();
    const res = this.gridApi.updateRowData({ add: [newItem] });
  }
  onRemoveSelected() {
    const selectedData = this.gridApi.getSelectedRows();
    const res = this.gridApi.updateRowData({ remove: selectedData });
  }
  onSelectionChanged(event, myRows: CalculationInput) {
    this.messageEvent.emit("Add Input");
  }
  createNewRowData(): CalculationInput {
    const newRow: CalculationInput = {
      id: "",
      name: "",
      output: "",
      data: "",
      errors: [],
      dropDownList: "",
      required: "False"
    };
    return newRow;
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
  ngOnInit() {
    this.inputGridOptions.rowData = this.calculationInput;
  }
}
