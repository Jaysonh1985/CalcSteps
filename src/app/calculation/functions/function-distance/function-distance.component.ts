import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";

import { MatChipInputEvent } from "@angular/material";
import { CalculationError } from "../../shared/models/calculation-error";

export class Distance {
  origin: string[];
  destination: string[];
  constructor(origin, destination) {
    this.origin = [];
    this.destination = [];
  }
}

@Component({
  selector: "app-function-distance",
  templateUrl: "./function-distance.component.html",
  styleUrls: ["./function-distance.component.css"]
})
export class FunctionDistanceComponent implements OnInit {
  @Input()
  selectedRow: any[];
  @Input()
  autoCompleteArray: any[];
  public autoCompleteOptions: any[];
  filteredOptions: Observable<string[]>;
  public distance: Distance;
  public errorArray: CalculationError[];
  public error: CalculationError;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  droppedData: string;

  constructor() {}

  ngOnInit() {
    if (this.selectedRow[0].distance == null) {
      this.selectedRow[0].distance = [];
    }
    if (this.selectedRow[0].distance.origin == null) {
      this.selectedRow[0].distance.origin = [];
    }
    if (this.selectedRow[0].distance.destination == null) {
      this.selectedRow[0].distance.destination = [];
    }
    this.autoCompleteOptions = [];
    this.autoCompleteArray.forEach(element => {
      if (element.data.data === "Text") {
        if (element.data.name !== "") {
          this.autoCompleteOptions.push({
            name: element.data.name,
            type: "variable",
            datatype: "Text",
            value: element.data.output
          });
        }
      }
    });
  }

  removeChip(array, field) {
    if (field === "origin") {
      this.selectedRow[0].distance.origin = [];
    } else if (field === "destination") {
      this.selectedRow[0].distance.destination = [];
    }
  }

  dropChip(array, field) {
    if (field === "origin") {
      this.selectedRow[0].distance.origin = [];
      this.selectedRow[0].distance.origin = array;
    } else if (field === "destination") {
      this.selectedRow[0].distance.destination = [];
      this.selectedRow[0].distance.destination = array;
    }
  }

  errorCheck(distance, autoComplete): CalculationError[] {
    this.errorArray = [];
    if (distance.origin.length === 0) {
      this.errorArray.push(
        new CalculationError(
          distance.rowIndex,
          "Error",
          "Origin is missing and is a required field"
        )
      );
    }
    if (distance.destination.length === 0) {
      this.errorArray.push(
        new CalculationError(
          distance.rowIndex,
          "Error",
          "Destination is missing and is a required field"
        )
      );
    }
    return this.errorArray;
  }
}
