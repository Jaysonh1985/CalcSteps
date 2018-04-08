import { Component, OnInit } from "@angular/core";
import { GridOptions } from "ag-grid";
import { Grid } from "ag-grid";
import { tryParse } from "selenium-webdriver/http";

@Component({
  selector: "app-ag-grid",
  templateUrl: "./ag-grid.component.html",
  styleUrls: ["./ag-grid.component.css"]
})
export class AgGridComponent implements OnInit {
  public gridOptions: GridOptions;
  public inputGridOptions: GridOptions;
  public outputGridOptions: GridOptions;
  public rowSelection;
  private gridApi;
  private gridColumnApi;
  public selectedRows;

  constructor() {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.columnDefs = [
      {
        headerName: "Configuration",
        children: [
          {
            headerName: "",
            checkboxSelection: true,
            rowDrag: true,
            suppressFilter: true
          },
          { headerName: "Group", field: "group", editable: true },
          {
            headerName: "Function",
            field: "function",
            width: 100,
            filter: "agTextColumnFilter",
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
              values: [
                "Maths",
                "Date Adjustment",
                "Date Duration",
                "If Logic"
              ]
            }
          },
          {
            headerName: "Name",
            field: "name",
            width: 100,
            filter: "agTextColumnFilter",
            editable: true
          },
          {
            headerName: "Data Type",
            field: "data",
            width: 100,
            filter: "agTextColumnFilter",
            editable: false
          },
          { headerName: "Output", field: "output", width: 100, editable: false }
        ]
      }
    ];
    this.gridOptions.floatingFilter = true;
    this.gridOptions.rowData = [
      {
        id: 1,
        group: "Service",
        result: "pre 97",
        function: "Maths",
        output: "100"
      },
      {
        id: 2,
        group: "Service",
        result: "pre 97",
        function: "Maths",
        output: "100"
      },
      {
        id: 3,
        group: "Service",
        result: "pre 97",
        function: "Maths",
        output: "100"
      }
    ];
    this.rowSelection = "multiple";
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }
  onAddRow() {
    const newItem = this.createNewRowData();
    const res = this.gridApi.updateRowData({ add: [newItem] });
  }
  onRemoveSelected() {
    const selectedData = this.gridApi.getSelectedRows();
    const res = this.gridApi.updateRowData({ remove: selectedData });
  }
  onSelectionChanged() {
    this.selectedRows = this.gridApi.getSelectedRows();
  }
  createNewRowData() {
    const newData = {
      id: 2,
      group: "Service",
      result: "pre 97",
      function: "Maths",
      output: "100.00"
    };
    return newData;
  }
  ngOnInit() {}
}
