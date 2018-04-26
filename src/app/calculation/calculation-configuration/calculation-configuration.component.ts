import { Component, OnInit, Input } from "@angular/core";
import { GridOptions } from "ag-grid";
import { Grid } from "ag-grid";
import { Maths } from "../functions/function-maths/function-maths.component";
import { CalculationConfiguration } from "../shared/models/calculation-configuration";

@Component({
  selector: "app-calculation-configuration",
  templateUrl: "./calculation-configuration.component.html",
  styleUrls: ["./calculation-configuration.component.css"]
})
export class CalculationConfigurationComponent implements OnInit {
  public gridOptions: GridOptions;
  public rowSelection;
  private gridApi;
  private gridColumnApi;
  public selectedRows;
  public selectedRow: CalculationConfiguration;
  @Input() calculationConfiguration: string[];
  constructor() {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.columnDefs = [
      {
        headerName: "Group",
        field: "group",
        editable: true,
        rowDrag: true
      },
      {
        headerName: "Function",
        field: "function",
        width: 100,
        filter: "agTextColumnFilter",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: ["Maths", "Date Adjustment", "Date Duration", "If Logic"]
        }
      },
      {
        headerName: "Name",
        field: "name",
        width: 200,
        filter: "agTextColumnFilter",
        editable: true
      },
      {
        headerName: "Data",
        field: "data",
        width: 75,
        filter: "agTextColumnFilter",
        editable: false,
        suppressFilter: true
      },
      {
        headerName: "Output",
        field: "output",
        width: 125,
        editable: false,
        suppressFilter: true
      },
    ];
    this.gridOptions.floatingFilter = true;
    this.rowSelection = "single";
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
  onSelectionChanged(event, myRows: CalculationConfiguration) {
    this.selectedRows = this.gridApi.getSelectedRows();
    this.selectedRow = this.gridApi.getSelectedRows();
  }
  getAllRows(): CalculationConfiguration[] {
    const arr: Array<any> = [];
    this.gridApi.forEachNode(function(node, index) {
      arr.push(node);
    });
    return arr;
  }
  setOuput(id) {
    const row = this.gridApi.getRowNode(id);
  }
  onCalcConfiguration() {}
  createNewRowData() {
    const newRow: CalculationConfiguration = {
      group: "",
      function: "",
      maths: [],
      name: "",
      output: "",
      data: ""
    };
    return newRow;
  }
  ngOnInit() {
    this.gridOptions.rowData = this.calculationConfiguration;
  }
}
