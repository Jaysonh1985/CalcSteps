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
  constructor() {
    this.outputGridOptions = <GridOptions>{};
    this.rowSelection = "multiple";
    this.outputGridOptions.columnDefs = [
      {
        headerName: "Name",
        field: "name",
        width: 200,
        editable: true,
        rowDrag: true
      },
      {
        headerName: "Data",
        field: "datatype",
        width: 70,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["Date", "Number", "Text", "Logic"] },
        editable: true,
        suppressFilter: true
      },
      {
        headerName: "Variable",
        field: "output",
        width: 110,
        editable: true,
        suppressFilter: true
      },
      {
        headerName: "Output",
        field: "output",
        width: 110,
        editable: true,
        suppressFilter: true
      }
    ];
    this.outputGridOptions.floatingFilter = true;
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
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
        id: node.data.id,
        name: node.data.name,
        output: node.data.output,
        data: node.data.data
      };
      arr.push(Row);
    });
    return arr;
  }
  createNewRowData() {
    const newRow: CalculationOutput = {
      id: "",
      name: "",
      output: "",
      data: ""
    };
    return newRow;
  }
  ngOnInit() {
    this.outputGridOptions.rowData = this.calculationOutput;
  }
}
