import { Component, OnInit, Input } from "@angular/core";
import { GridOptions } from "ag-grid";
import { Grid } from "ag-grid";
import { tryParse } from "selenium-webdriver/http";
import { CalculationOutput } from "../shared/models/calculation-output";

@Component({
  selector: "app-calculation-output",
  templateUrl: "./calculation-output.component.html",
  styleUrls: ["./calculation-output.component.css"]
})
export class CalculationOutputComponent implements OnInit {
  public gridOptions: GridOptions;
  public inputGridOptions: GridOptions;
  public outputGridOptions: GridOptions;
  public rowSelection;
  private gridApi;
  private gridColumnApi;
  @Input() calculationOutput: string[];
  @Input() configOutputsNumber: string[];
  @Input() configOutputsDate: string[];
  @Input() configOutputsLogic: string[];
  @Input() configOutputsText: string[];
  @Input() release: boolean;
  constructor() {
    this.outputGridOptions = <GridOptions>{};
    this.rowSelection = "multiple";
    this.outputGridOptions.columnDefs = [
      {
        headerName: "Name",
        field: "name",
        width: 180,
        cellEditor: "agPopupTextCellEditor",
        editable: params => {
          if (this.release === true) {
            return false;
          } else {
            return true;
          }
        },
        rowDrag: true
      },
      {
        headerName: "Data",
        field: "data",
        width: 70,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["Date", "Number", "Text", "Logic"] },
        editable: params => {
          if (this.release === true) {
            return false;
          } else {
            return true;
          }
        },
        suppressFilter: true
      },
      {
        headerName: "Variable",
        field: "variable",
        width: 110,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: config => {
          if (config.data.data === "Number") {
            return { values: this.configOutputsNumber };
          } else if (config.data.data === "Date") {
            return { values: this.configOutputsDate };
          } else if (config.data.data === "Logic") {
            return { values: this.configOutputsLogic };
          } else if (config.data.data === "Text") {
            return { values: this.configOutputsText };
          }
        },
        editable: true,
        suppressFilter: true
      },
      {
        headerName: "Output",
        field: "output",
        width: 110,
        editable: false,
        suppressFilter: true
      }
    ];
    this.outputGridOptions.floatingFilter = true;
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    if (this.release === true) {
      this.outputGridOptions.columnApi.setColumnsVisible(["variable"], false, "api");
    }
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
  }
  onAddRow() {
    const newItem = this.createNewRowData();
    const res = this.gridApi.updateRowData({ add: [newItem] });
  }
  onRemoveSelected() {
    const selectedData = this.gridApi.getSelectedRows();
    const res = this.gridApi.updateRowData({ remove: selectedData });
  }
  getAllRows(): CalculationOutput[] {
    const arr: Array<CalculationOutput> = [];
    this.gridApi.forEachNode(function(node, index) {
      const Row: CalculationOutput = {
        name: node.data.name,
        variable: node.data.variable,
        output: node.data.output,
        data: node.data.data
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
  public setRowOuput(id, value) {
    const rowNode = this.gridApi.getRowNode(id);
    const data = rowNode.data;
    data.output = value;
    rowNode.setData(data);
  }
  createNewRowData() {
    const newRow: CalculationOutput = {
      name: "",
      output: "",
      variable: "",
      data: ""
    };
    console.log(this);
    return newRow;
  }
  ngOnInit() {
    this.outputGridOptions.rowData = this.calculationOutput;
  }
}
