import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { GridOptions } from "ag-grid";

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
  @Output() messageEvent = new EventEmitter();
  @Output() dataChangeEvent = new EventEmitter();
  @Input() calculationOutput: string[];
  @Input() configOutputsNumber: string[];
  @Input() configOutputsDate: string[];
  @Input() configOutputsLogic: string[];
  @Input() configOutputsText: string[];
  @Input() release: boolean;
  constructor() {
    this.outputGridOptions = <GridOptions>{};
    this.rowSelection = "single";
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
      },
      {
        headerName: "Expected Result",
        field: "eresult",
        width: 110,
        editable: true,
        suppressFilter: true
      },
      {
        headerName: "Pass/Fail",
        field: "pass",
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
      this.outputGridOptions.columnApi.setColumnsVisible(
        ["variable"],
        false
      );
    }
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
  }
  onAddRow() {
    const newItem = new CalculationOutput("", "", "", "", "", true);
    const res = this.gridApi.updateRowData({ add: [newItem] });
  }
  onRemoveSelected() {
    const selectedData = this.gridApi.getSelectedRows();
    const res = this.gridApi.updateRowData({ remove: selectedData });
  }
  onSelectionChanged() {
    this.messageEvent.emit("Add Input");
  }
  onDataChanged() {
    this.dataChangeEvent.emit();
  }
  getAllRows(): CalculationOutput[] {
    const arr: Array<CalculationOutput> = [];
    this.gridApi.forEachNode(function(node, index) {
      const Row: CalculationOutput = {
        name: node.data.name,
        variable: node.data.variable,
        output: node.data.output,
        data: node.data.data,
        eresult: node.data.eresult,
        pass: node.data.pass
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
  onDeleteAllOutputs() {
    this.gridApi.forEachNode(function(node, index) {
      const rowNode = node;
      const data = rowNode.data;
      data.output = "";
      rowNode.setData(data);
    });
  }
  public setTableData(calculationOutput) {
    let selectedData = this.gridApi.selectAll();
    selectedData = this.gridApi.getSelectedRows();
    const res = this.gridApi.updateRowData({ remove: selectedData});
    calculationOutput.forEach(element => {
      const res2 = this.gridApi.updateRowData({ add: [element] });
    });
  }
  public setRowOuput(id, value) {
    const rowNode = this.gridApi.getRowNode(id);
    const data = rowNode.data;
    data.output = value;
    rowNode.setData(data);
    this.gridApi.flashCells({ rowNodes: [rowNode], columns: ["output"] });
  }
  ngOnInit() {
    this.outputGridOptions.rowData = this.calculationOutput;
  }
}
