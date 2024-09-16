import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CalculationService } from "../../shared/services/calculation.service";
import { AuthService } from "../../../shared/services/auth.service";
import { CalculationInput } from "../../shared/models/calculation-input";
import { Calculation } from "../../shared/models/calculation";
import { GridOptions, GridApi, Grid } from "ag-grid";
import { CalculationComponent } from "../../calculation.component";
import { ReleaseService } from "../../shared/services/release.service";
import { MatSnackBar, MatDialog } from "@angular/material";
import { AutoCompleteService } from "../../shared/services/auto-complete.service";
import { HttpClient } from "@angular/common/http";
import { LookupService } from "../../shared/services/lookup.service";
import { CalculateService } from "../../shared/services/calculate.service";
import { CalculationInputComponent } from "../../calculation-input/calculation-input.component";
import { CalculationOutputComponent } from "../../calculation-output/calculation-output.component";
import { CalculationConfigurationComponent } from "../../calculation-configuration/calculation-configuration.component";
import { CalculationConfiguration } from "../../shared/models/calculation-configuration";
import { CalculationOutput } from "../../shared/models/calculation-output";
@Component({
  selector: "app-calculation-bulk-output",
  templateUrl: "./calculation-bulk-output.component.html",
  styleUrls: ["./calculation-bulk-output.component.css"]
})
export class CalculationBulkOutputComponent implements OnInit {
  public outputGridOptions: GridOptions;
  private gridOutputApi: GridApi;
  private fileReaded;
  gridColumnApi: GridApi;
  loadingProgress: number;
  loading: boolean;
  @Input()
  calculationOutput: string[];
  isInput: boolean;

  constructor(public snackBar: MatSnackBar, public dialog: MatDialog) {
    this.outputGridOptions = <GridOptions>{};
    this.outputGridOptions.columnDefs = [];
    this.outputGridOptions.columnDefs = [
      {
        editable: false,
        headerName: "Output",
        field: "name",
        pinned: "left"
      },
      {
        editable: false,
        headerName: "Data Type",
        field: "data",
        pinned: "left"
      }
    ];
  }

  ngOnInit() {

  }

  onGridReady(params) {
    this.gridOutputApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.calculationOutput.forEach(row => {
      this.gridOutputApi.updateRowData({ add: [row] });
    });
  }

  onResetColumns() {
    this.outputGridOptions.columnDefs = [];
    this.outputGridOptions.columnDefs = [
      {
        editable: false,
        headerName: "Output",
        field: "name",
        pinned: "left"
      },
      {
        editable: false,
        headerName: "Data Type",
        field: "data",
        pinned: "left"
      }
    ];
  }

  onExportCSV() {
    this.gridOutputApi.exportDataAsCsv();
  }

  getAllRowsNodes(): any[] {
    const arr: Array<any> = [];
    this.gridOutputApi.forEachNode(function(node) {
      arr.push(node);
    });
    return arr;
  }

  getAllColumns(): any[] {
    return this.outputGridOptions.columnApi.getAllColumns();
  }

  setNewColumn() {
    const headerNumber = this.outputGridOptions.columnDefs.length - 1;
    this.outputGridOptions.columnDefs.push({
      editable: true,
      headerName: headerNumber.toString(),
      field: this.outputGridOptions.columnDefs.length.toString()
    });
    this.gridOutputApi.setColumnDefs(this.outputGridOptions.columnDefs);
  }

  setCellValue(rowNodes, value, column) {
    const rowNode = this.gridOutputApi.getRowNode(rowNodes.id);
    rowNode.setDataValue(column, value);
  }

}
