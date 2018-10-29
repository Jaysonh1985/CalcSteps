import { Component, OnInit } from "@angular/core";
import { MatDialog, MatSnackBar } from "@angular/material";
import { ActivatedRoute, Router } from "@angular/router";
import { GridApi, GridOptions } from "ag-grid";

import { Lookup } from "../shared/models/lookup";
import { LookupService } from "../shared/services/lookup.service";
import { LookupDialogComponent } from "./lookup-dialog/lookup-dialog.component";

@Component({
  selector: "app-lookup",
  templateUrl: "./lookup.component.html",
  styleUrls: ["./lookup.component.css"]
})
export class LookupComponent implements OnInit {
  public gridOptions: GridOptions;
  private gridApi: GridApi;
  private fileReaded;
  public lookup: Lookup;
  lookupName: any;
  lookupGroup: any;

  constructor(
    public dialog: MatDialog,
    private lookupService: LookupService,
    public snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.gridOptions = <GridOptions>{};
    this.gridOptions.columnDefs = [];
  }

  ngOnInit() {
    const key = this.route.snapshot.params["key"];
    this.lookupService
      .getLookup(key)
      .snapshotChanges()
      .map(changes => {
        return changes.map(c => ({
          key: c.payload.key,
          ...c.payload.val()
        }));
      })
      .subscribe(lookups => {
        this.lookup = lookups[0];
        this.lookupName = lookups[0].name;
        this.lookupGroup = lookups[0].group;
        this.gridOptions.columnDefs = [];
        lookups[0].headerRow.forEach(header => {
          // tslint:disable-next-line:quotemark
          this.gridOptions.columnDefs.push({
            editable: header.editable,
            headerName: header.headerName,
            field: header.field
          });
        });
        this.gridApi.setColumnDefs(this.gridOptions.columnDefs);
        for (let i = 0; i <= lookups[0].lookup.length - 1; i++) {
          const newItem = [];
          lookups[0].lookup[i].forEach(row => {
            newItem.push(row);
          });
          const res = this.gridApi.updateRowData({ add: [newItem] });
        }
      });
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }
  onAddColumn(name) {
    const dialogRef = this.dialog.open(LookupDialogComponent, {
      width: "400px",
      data: { name: "" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.gridOptions.columnDefs.push({
          editable: true,
          headerName: result.name,
          field: this.gridOptions.columnDefs.length.toString()
        });
        this.gridApi.setColumnDefs(this.gridOptions.columnDefs);
      }
    });
  }
  onAddRow() {
    const newItem = [];
    this.gridOptions.columnDefs.forEach(element => {
      newItem.push("");
    });
    const res = this.gridApi.updateRowData({ add: [newItem] });
  }
  onSave() {
    this.lookup.headerRow = this.gridOptions.columnDefs;
    this.lookup.lookup = this.getAllRowsNodes();
    this.lookup.group = this.lookupGroup;
    this.lookup.name = this.lookupName;
    this.lookupService.updateLookup(
      this.route.snapshot.params["key"],
      JSON.parse(JSON.stringify(this.lookup))
    );
    this.snackBar.open("Lookup Tables Saved", "Saved", {
      duration: 2000
    });
    this.router.navigate(["lookup-maintenance"]);
  }
  onRemoveSelected() {
    this.gridApi.setColumnDefs([]);
    this.gridOptions.columnDefs = [];
    this.gridApi.setRowData([]);
  }
  onExit() {
    this.router.navigate(["lookup-maintenance"]);
  }
  getAllRowsNodes(): any[] {
    const arr: Array<any> = [];
    this.gridApi.forEachNode(node => {
      arr.push(node.data);
    });
    return arr;
  }
  onExportCSV() {
    this.gridApi.exportDataAsCsv();
  }
  onUploadCSV(csv: any) {
    this.fileReaded = csv.target.files[0];

    const reader: FileReader = new FileReader();
    reader.readAsText(this.fileReaded);
    reader.onload = e => {
      this.onRemoveSelected();
      const csvUpload: string = reader.result;
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
      for (let i = 0; i <= lines.length - 1; i++) {
        if (i === 0) {
          this.gridOptions.columnDefs = [];
          lines[0].forEach(element => {
            // tslint:disable-next-line:quotemark
            const elements = element.replace(/"/g, "");
            this.gridOptions.columnDefs.push({
              editable: true,
              headerName: elements.toString(),
              field: this.gridOptions.columnDefs.length.toString()
            });
          });
          this.gridApi.setColumnDefs(this.gridOptions.columnDefs);
        } else {
          const newItem = [];
          lines[i].forEach(element => {
            const elements = element.replace(/"/g, "");
            newItem.push(elements);
          });
          const res = this.gridApi.updateRowData({ add: [newItem] });
        }
      }
    };
  }
}
