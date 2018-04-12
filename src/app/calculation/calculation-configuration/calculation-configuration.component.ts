import { Component, OnInit } from "@angular/core";
import { GridOptions } from "ag-grid";
import { Grid } from "ag-grid";
import { Maths } from "../functions/function-maths/function-maths.component";

export interface CalculationConfiguration {
  id: Int16Array;
  group: string;
  function: string;
  name: string;
  data: string;
  output: string;
  maths: Array<Maths>;
}

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
  constructor() {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.columnDefs = [
      {
        headerName: "Configuration",
        headerComponentParams: {
          headerComponentParams: { menuIcon: "fa-external-link" }
        },
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
              values: ["Maths", "Date Adjustment", "Date Duration", "If Logic"]
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
        output: "100",
        maths: null
      },
      {
        id: 2,
        group: "Service",
        result: "pre 97",
        function: "Maths",
        output: "100",
        maths: null
      },
      {
        id: 3,
        group: "Service",
        result: "pre 97",
        function: "Maths",
        output: "100",
        maths: null
      }
    ];
    this.rowSelection = "single";
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
  onSelectionChanged(event, myRows: CalculationConfiguration) {
    this.selectedRows = this.gridApi.getSelectedRows();
    this.selectedRow = this.gridApi.getSelectedRows();
  }
  onCalcConfiguration() {}
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
