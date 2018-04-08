import { Component, OnInit } from "@angular/core";
import { GridOptions } from "ag-grid";
import { Grid } from "ag-grid";
import { tryParse } from "selenium-webdriver/http";

@Component({
  selector: "app-ag-grid-input",
  templateUrl: "./ag-grid-input.component.html",
  styleUrls: ["./ag-grid-input.component.css"]
})
export class AgGridInputComponent implements OnInit {
  public gridOptions: GridOptions;
  public inputGridOptions: GridOptions;
  public outputGridOptions: GridOptions;
  public rowSelection;
  private gridApi;
  private gridColumnApi;

  constructor() {
    this.inputGridOptions = <GridOptions>{};
    this.rowSelection = "multiple";
    this.inputGridOptions.columnDefs = [
      {
        headerName: "Input",
        children: [
          {
            headerName: "Name",
            field: "name",
            editable: true,
            rowDrag: true,
            checkboxSelection: true
          },
          {
            headerName: "Data Type",
            field: "datatype",
            width: 100,
            editable: true,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: { values: ["Date", "Number", "Text", "Logic"] }
          },
          { headerName: "Input", field: "input", width: 100, editable: true }
        ]
      }
    ];
    this.inputGridOptions.floatingFilter = true;
    this.inputGridOptions.rowData = [
      {
        id: 1,
        name: "Service",
        output: "100"
      },
      {
        id: 2,
        name: "Service",
        output: "100"
      },
      {
        id: 3,
        name: "Service",
        output: "100"
      }
    ];
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
  createNewRowData() {
    const newData = {
      id: "1",
      name: "This_is_a_Test",
      output: "1000.00"
    };
    return newData;
  }
  ngOnInit() {}
}
