import { Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";

import { CalculationService } from "../../shared/services/calculation.service";
import { DragAndDropModule } from "angular-draggable-droppable";
import { MatChipInputEvent } from "@angular/material";

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
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  droppedData: string;

  constructor(private calcService: CalculationService) {}

  ngOnInit() {
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
            datatype: "text"
          });
        }
      }
    });
  }

  addOrigin(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || "").trim()) {
      this.selectedRow[0].distance.origin = [];
      this.selectedRow[0].distance.origin.push({
        name: value.trim(),
        type: "",
        datatype: "text"
      });
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }
  onOriginDrop(data: any) {
    // Get the dropped data here
    this.selectedRow[0].distance.origin = [];
    this.selectedRow[0].distance.origin.push({
      name: data.dragData.name,
      type: data.dragData.type,
      datatype: data.dragData.datatype
    });
  }
  onDestinationDrop(data: any) {
    // Get the dropped data here
    this.selectedRow[0].distance.destination = [];
    this.selectedRow[0].distance.destination.push({
      name: data.dragData.name,
      type: data.dragData.type,
      datatype: data.dragData.datatype
    });
  }
  removeOrigin() {
    this.selectedRow[0].distance.origin = [];
  }
  removeDestination() {
    this.selectedRow[0].distance.destination = [];
  }
  public getAutoCompleteOutput(InputValue, array): string {
    let input = "";
    input = InputValue;
    array.forEach(value => {
      if (value.data.name === InputValue && value.data.data === "Text") {
        input = value.data.output;
      }
    });
    return input;
  }
}
