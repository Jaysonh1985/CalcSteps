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
