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
  selector: "app-calculation-bulk-input",
  templateUrl: "./calculation-bulk-input.component.html",
  styleUrls: ["./calculation-bulk-input.component.css"]
})
export class CalculationBulkInputComponent implements OnInit {
  public gridOptions: GridOptions;
  private gridApi: GridApi;
  private fileReaded;
  gridColumnApi: GridApi;
  loadingProgress: number;
  loading: boolean;
  @Input()
  calculationInput: string[];
  isInput: boolean;
  constructor(public snackBar: MatSnackBar, public dialog: MatDialog) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.columnDefs = [];
    this.gridOptions.columnDefs = [
      {
        editable: false,
        headerName: "Input",
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

  ngOnInit() {}

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.calculationInput.forEach(row => {
      this.gridApi.updateRowData({ add: [row] });
    });
  }

  onExportCSV() {
    this.gridApi.exportDataAsCsv();
  }

  getAllRowsNodes(): any[] {
    const arr: Array<any> = [];
    this.gridApi.forEachNode(function(node) {
      arr.push(node);
    });
    return arr;
  }

  getAllColumns(): any[] {
    return this.gridOptions.columnApi.getAllColumns();
  }
  getValue(column, row): string {
    return this.gridApi.getValue(column, row);
  }


  onUploadCSV(csv: any) {
    this.fileReaded = csv.target.files[0];
    const reader: FileReader = new FileReader();
    reader.readAsText(this.fileReaded);
    reader.onload = e => {
      const csvUpload: string = reader.result.toString();
      const allTextLines = csvUpload.split(/\r|\n|\r/);
      const headers = allTextLines[0].split(",");
      const lines = [];

      for (let i = 0; i < allTextLines.length; i++) {
        const data = allTextLines[i].split(",");
        if (data.length === headers.length) {
          const tarr = [];
          for (let j = 0; j < headers.length; j++) {
            tarr.push(data[j]);
          }
          lines.push(tarr);
        }
      }
      let x = 0;
      for (const element of lines[0]) {
        // tslint:disable-next-line:quotemark
        if (x > 1) {
          const headerName = this.gridOptions.columnDefs.length - 1;
          this.gridOptions.columnDefs.push({
            editable: true,
            headerName: headerName.toString(),
            field: this.gridOptions.columnDefs.length.toString()
          });
        }
        x++;
      }
      this.gridApi.setColumnDefs(this.gridOptions.columnDefs);
      this.gridApi.forEachNode(function(rowNode) {
        rowNode.setData(
          Object.assign(rowNode.data, lines[rowNode.rowIndex + 1])
        );
      });
    };
  }
  onRemoveSelected() {
    this.gridApi.setColumnDefs([]);
    this.gridOptions.columnDefs = [];
    this.gridApi.setRowData([]);
  }
}
