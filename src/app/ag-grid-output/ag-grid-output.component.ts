import { Component, OnInit } from "@angular/core";
import { GridOptions } from "ag-grid";
import { Grid } from "ag-grid";
import { tryParse } from "selenium-webdriver/http";

@Component({
  selector: "app-ag-grid-output",
  templateUrl: "./ag-grid-output.component.html",
  styleUrls: ["./ag-grid-output.component.css"]
})
export class AgGridOutputComponent implements OnInit {
  public gridOptions: GridOptions;
  public inputGridOptions: GridOptions;
  public outputGridOptions: GridOptions;
  public rowSelection;
  private gridApi;
  private gridColumnApi;

  constructor() {
    this.outputGridOptions = <GridOptions>{};
    this.rowSelection = "multiple";
    this.outputGridOptions.columnDefs = [
      {
        headerName: "Output",
        children: [
          {
            headerName: "Name",
            field: "name",
            width: 100,
            editable: true,
            rowDrag: true,
            checkboxSelection: true
          },
          {
            headerName: "Data Type",
            field: "datatype",
            width: 100,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: { values: ["Date", "Number", "Text", "Logic"] },
            editable: true
          },
          {
            headerName: "Variable to Use",
            field: "output",
            width: 100,
            editable: true
          },
          {
            headerName: "Expected Result",
            field: "expectedresult",
            width: 100,
            editable: true
          }
        ]
      }
    ];
    this.outputGridOptions.floatingFilter = true;
    this.outputGridOptions.rowData = [
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
