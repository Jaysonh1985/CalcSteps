import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { GridOptions } from "ag-grid";

import { CalculationOutput } from "../shared/models/calculation-output";
import { CalculationError } from "../shared/models/calculation-error";

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
  @Output()
  messageEvent = new EventEmitter();
  @Output()
  dataChangeEvent = new EventEmitter();
  @Input()
  calculationOutput: string[];
  @Input()
  configOutputsNumber: string[];
  @Input()
  configOutputsDate: string[];
  @Input()
  configOutputsLogic: string[];
  @Input()
  configOutputsText: string[];
  @Input()
  release: boolean;
  errorArray: any[];
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
        headerName: "Pass",
        field: "pass",
        width: 110,
        editable: false,
        suppressFilter: true
      }
    ];
    this.outputGridOptions.floatingFilter = true;
    this.outputGridOptions.getRowStyle = function(params) {
      if (params.data.errors !== undefined) {
        if (params.data.errors.length > 0) {
          return { background: "lightcoral" };
        }
        if (params.data.pass === true) {
          return { background: "#80B280" };
        }
        if (params.data.errors.length === 0) {
          return { background: "" };
        }
      }
    };
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    if (this.release === true) {
      this.outputGridOptions.columnApi.setColumnsVisible(["variable"], false);
    }
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
  }
  onAddRow() {
    const newItem = new CalculationOutput(
      this.getGuid(),
      "",
      "",
      "",
      "",
      "",
      false,
      []
    );
    const res = this.gridApi.updateRowData({ add: [newItem] });
  }
  getGuid() {
    return (
      this.s4() +
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
      this.s4()
    );
  }

  s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
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
        id: node.data.id,
        name: node.data.name,
        variable: node.data.variable,
        output: node.data.output,
        data: node.data.data,
        eresult: node.data.eresult,
        pass: node.data.pass,
        errors: node.data.errors
      };
      arr.push(Row);
    });
    return arr;
  }
  onDeleteAllOutputs() {
    this.gridApi.forEachNode(function(node, index) {
      const rowNode = node;
      const data = rowNode.data;
      data.output = "";
      data.eresult = "";
      rowNode.setData(data);
    });
  }
  public setTableData(calculationOutput) {
    let selectedData = this.gridApi.selectAll();
    selectedData = this.gridApi.getSelectedRows();
    const res = this.gridApi.updateRowData({ remove: selectedData });
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
  private getVariableExist(InputValue, array): any {
    for (const value of array) {
      if (value.name === InputValue) {
        return true;
      }
    }
    return false;
  }
  ngOnInit() {
    this.outputGridOptions.rowData = this.calculationOutput;
  }
  errorCheck(output, autoComplete): CalculationError[] {
    this.errorArray = [];
    const outputValue = this.getVariableExist(output.variable, autoComplete);
    if (outputValue === false) {
      this.errorArray.push(
        new CalculationError(
          output.rowIndex,
          "Error",
          "Variable does not exist"
        )
      );
    }
    return this.errorArray;
  }
}
