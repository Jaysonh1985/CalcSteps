import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { GridOptions } from "ag-grid";

import { DateAdjustment } from "../functions/function-date-adjustment/function-date-adjustment.component";
import { DateDuration } from "../functions/function-date-duration/function-date-duration.component";
import { Distance } from "../functions/function-distance/function-distance.component";
import { LookupTable } from "../functions/function-lookup-table/function-lookup-table.component";
import { CalculationConfiguration } from "../shared/models/calculation-configuration";
import { AutoCompleteService } from "../shared/services/auto-complete.service";
import { Maths } from "../functions/function-maths/function-maths.component";
import { IfLogic } from "../functions/function-if-logic/function-if-logic.component";
import { NumberFunctions } from "../functions/function-number-functions/function-number-functions.component";
import { TextFunctions } from "../functions/function-text-functions/function-text-functions.component";

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
  public autoCompleteArray;
  public selectedRow: any[];
  public rowClassRules;
  @Output()
  dataChangeEvent = new EventEmitter();
  @Input()
  calculationConfiguration: string[];
  public autoCompleteOptions: any[];
  public defaultColDef;
  constructor(private autocompleteService: AutoCompleteService) {
    this.gridOptions = <GridOptions>{};
    this.defaultColDef = {
      cellClass: "align-right",
      enableCellChangeFlash: true
    };

    this.gridOptions.columnDefs = [
      {
        headerName: "Group",
        width: 250,
        field: "group",
        editable: true,
        rowDrag: true
      },
      {
        headerName: "Function",
        field: "functionType",
        width: 100,
        filter: "agTextColumnFilter",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: [
            "Date Adjustment",
            "Date Duration",
            "Distance",
            "If Logic",
            "Lookup Table",
            "Maths",
            "Number Functions",
            "Text Functions"
          ]
        }
      },
      {
        headerName: "Name",
        field: "name",
        width: 250,
        filter: "agTextColumnFilter",
        editable: true
      },
      {
        headerName: "Data",
        field: "data",
        width: 75,
        filter: "agTextColumnFilter",
        editable: false,
        suppressFilter: true,
        valueGetter: function aPlusBValueGetter(params) {
          if (params.data.functionType === "Maths") {
            params.data.data = "Number";
            return "Number";
          } else if (params.data.functionType === "Date Adjustment") {
            params.data.data = "Date";
            return "Date";
          } else if (params.data.functionType === "Date Duration") {
            params.data.data = "Number";
            return "Number";
          } else if (params.data.functionType === "If Logic") {
            params.data.data = "Logic";
            return "Logic";
          } else if (params.data.functionType === "Distance") {
            params.data.data = "Number";
            return "Number";
          } else if (params.data.functionType === "Lookup Table") {
            params.data.data = params.data.lookupTable.OutputType;
            return params.data.lookupTable.OutputType;
          } else if (params.data.functionType === "Number Functions") {
            params.data.data = "Number";
            return "Number";
          } else if (params.data.functionType === "Text Functions") {
            if (params.data.textFunctions.type === "Length") {
              params.data.data = "Number";
              return "Number";
            } else {
              params.data.data = "Text";
              return "Text";
            }
          }
        }
      },
      {
        headerName: "Output",
        field: "output",
        width: 200,
        editable: false,
        suppressFilter: true,
        enableCellChangeFlash: true
      }
    ];
    this.gridOptions.floatingFilter = true;
    this.rowSelection = "single";
    this.gridOptions.getRowStyle = function(params) {
      if (params.data.conditionResult === false) {
        return { background: "lightgrey" };
      }
      if (params.data.errors !== undefined) {
        if (params.data.errors.length > 0) {
          return { background: "lightcoral" };
        }
        if (params.data.errors.length === 0) {
          return { background: "" };
        }
      }
    };
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    this.onSetAllRowID();
    // this.gridColumnApi.autoSizeColumns(allColumnIds);
  }
  onAddRow() {
    const newItem = new CalculationConfiguration(
      this.getGuid(),
      "",
      "",
      "",
      "",
      "",
      new Maths([]),
      new DateAdjustment("", "", "", "", "", "", "", ""),
      new DateDuration("", "", "", "", ""),
      new Distance("", ""),
      new IfLogic("", []),
      [],
      new LookupTable("", "", "", "", "", "", "", "", "", ""),
      "",
      true,
      new NumberFunctions("", "", ""),
      new TextFunctions("", "", "", "")
    );
    const res = this.gridApi.updateRowData({ add: [newItem] });
    const rowNode = this.gridApi.getRowNode(res.add[0].id);
    rowNode.id = rowNode.data.id;
    this.setRowOuput(res.add[0].id, rowNode.data, true);
    this.onDataChanged();
  }
  getGuid() {
    return (
      this.s4() +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      this.s4() +
      this.s4()
    );
  }

  s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  onRemoveSelected() {
    const selectedData = this.gridApi.getSelectedRows();
    const res = this.gridApi.updateRowData({ remove: selectedData });
    this.onDataChanged();
  }

  onSetAllRowID() {
    const array = this.getAllRowsNodes();
    array.forEach(row => {
      const oldRowId = row.id;
      const rowNode = this.gridApi.getRowNode(row.id);
      if (rowNode.data.id === undefined) {
        row.id = this.getGuid();
        rowNode.data.id = row.id;
        this.setRowOuput(oldRowId, rowNode.data, true);
      } else {
        row.id = rowNode.data.id;
      }
    });
  }

  onSelectionChanged(event, myRows: CalculationConfiguration) {
    this.selectedRow = this.gridApi.getSelectedNodes();
    if (this.selectedRow.length > 0) {
      this.selectedRows = [];
      this.selectedRows.push(this.selectedRow[0].data);
      this.autoCompleteArray = [];
      this.autoCompleteArray = this.getAllRowsNodesbyIndex(
        this.selectedRow[0].rowIndex
      );
      this.autocompleteService.cast.subscribe(autocomplete => {
        this.autoCompleteArray = autocomplete.concat(this.autoCompleteArray);
      });
      const autoCompleteArrayUnique = [];
      this.autoCompleteArray.forEach(element => {
        const name = element.data.name;
        if (autoCompleteArrayUnique.length > 0) {
          const nameList = [];
          for (const row of autoCompleteArrayUnique) {
            nameList.push(row.data.name);
          }
          const nameExists = nameList.indexOf(name);
          if (nameExists === -1) {
            autoCompleteArrayUnique.push(element);
          }
        } else {
          autoCompleteArrayUnique.push(element);
        }
      });
      this.autoCompleteArray = autoCompleteArrayUnique;
      this.getLogicArray();
    }
  }

  onDataChanged() {
    this.dataChangeEvent.emit();
  }

  getLogicArray() {
    this.autoCompleteOptions = [];
    this.autoCompleteOptions.push("True");
    this.autoCompleteOptions.push("False");
    this.autoCompleteArray.forEach(element => {
      if (element.data.data === "Logic") {
        if (element.data.name !== "") {
          const autoCompleteText = element.data.name;
          this.autoCompleteOptions.push(autoCompleteText);
        }
      }
    });
  }

  getAllRows(): CalculationConfiguration[] {
    const arr: Array<CalculationConfiguration> = [];
    this.gridApi.forEachNode(function(node, index) {
      const row: CalculationConfiguration = {
        id: node.data.id,
        group: node.data.group,
        functionType: node.data.functionType,
        name: node.data.name,
        data: node.data.data,
        output: node.data.output,
        maths: node.data.maths,
        dateAdjustment: node.data.dateAdjustment,
        dateDuration: node.data.dateDuration,
        distance: node.data.distance,
        ifLogic: node.data.ifLogic,
        lookupTable: node.data.lookupTable,
        errors: node.data.errors,
        condition: node.data.condition,
        conditionResult: node.data.conditionResult,
        numberFunctions: node.data.numberFunctions,
        textFunctions: node.data.textFunctions
      };
      arr.push(row);
    });
    return arr;
  }

  getAllRowsNodes(): any[] {
    const arr: Array<any> = [];
    this.gridApi.forEachNode(function(node, index) {
      arr.push(node);
    });
    return arr;
  }

  getAllRowsNodesbyIndex(index): any[] {
    const arr: Array<any> = [];
    this.gridApi.forEachNode(function(node) {
      if (node.rowIndex < index) {
        arr.push(node);
      }
      if (node.rowIndex === index) {
        if (arr.length > 0) {
          return arr[arr.length - 1];
        } else {
          return null;
        }
      }
    });
    return arr;
  }

  getFinalRowNodesbyDataIndex(data, index): any[] {
    const arr: Array<any> = [];
    this.gridApi.forEachNode(function(node) {
      if (node.data.data === data && node.rowIndex < index) {
        arr.push(node);
      }
      if (node.rowIndex === index) {
        if (arr.length > 0) {
          return arr[arr.length - 1];
        } else {
          return null;
        }
      }
    });
    return arr[arr.length - 1];
  }

  public setRowOuput(id, rowData, flash) {
    const rowNode = this.gridApi.getRowNode(id);
    const oldData = rowNode.data;
    let data = rowNode.data;
    data = rowData;
    rowNode.setData(data);
    if (flash === true) {
      this.gridApi.flashCells({ rowNodes: [rowNode], columns: ["output"] });
    }
  }

  setTableData(calculationConfiguration) {
    let selectedData = this.gridApi.selectAll();
    selectedData = this.gridApi.getSelectedRows();
    const res = this.gridApi.updateRowData({ remove: selectedData });
    calculationConfiguration.forEach(element => {
      const res2 = this.gridApi.updateRowData({ add: [element] });
    });
  }

  ngOnInit() {
    this.gridOptions.rowData = this.calculationConfiguration;
  }
  public getSelectedRow() {
    return this.gridApi.getSelectedNodes();
  }
  public setSelectedRow(selectedRow) {
    this.gridOptions.api.forEachNode(function(node) {
      const id = "0";
      if (selectedRow.data.id === node.data.id) {
        node.setSelected(true);
      }
    });
  }
}
